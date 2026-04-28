import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { IconPlus, IconX, IconMinus, IconSquare, IconSquares } from '@tabler/icons-react';
import { useIsDesktopWindow, useDesktopWindowControls } from '@/contexts/DesktopWindowContext';
import { WindowControl } from '../WindowControl';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface TabBarItem {
  /** Unique identifier */
  id: string;
  /** Tab label */
  label?: string;
  /** @deprecated thaki-ui compatibility - use label instead */
  title?: string;
  /** Icon (optional) */
  icon?: React.ReactNode;
  /** Whether the tab can be closed */
  closable?: boolean;
  /** @deprecated thaki-ui compatibility - whether tab is draggable */
  draggable?: boolean;
  /** @deprecated thaki-ui compatibility - whether tab is fixed (not closable) */
  fixed?: boolean;
}

export interface TabBarProps {
  /** Tab items */
  tabs: TabBarItem[];
  /** Currently active tab id */
  activeTab: string;
  /** Callback when tab is selected */
  onTabChange: (tabId: string) => void;
  /** Callback when tab is closed */
  onTabClose?: (tabId: string) => void;
  /** Callback when add button is clicked */
  onTabAdd?: () => void;
  /** Callback when tabs are reordered via drag and drop */
  onTabReorder?: (fromIndex: number, toIndex: number) => void;
  /** Show add button */
  showAddButton?: boolean;
  /** Show window controls (minimize, maximize, close) */
  showWindowControls?: boolean;
  /** Show bottom border (default: true) */
  showBottomBorder?: boolean;
  /** Callback when minimize button is clicked */
  onMinimize?: () => void;
  /** Callback when maximize button is clicked */
  onMaximize?: () => void;
  /** Callback when window close button is clicked */
  onWindowClose?: () => void;
  /** Custom class name */
  className?: string;
}

/* ----------------------------------------
   TabBar Component
   ---------------------------------------- */

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onTabAdd,
  onTabReorder,
  showAddButton = true,
  showWindowControls = true,
  showBottomBorder = true,
  onMinimize,
  onMaximize,
  onWindowClose,
  className = '',
}) => {
  const navigate = useNavigate();
  const isDesktopWindow = useIsDesktopWindow();
  const desktopControls = useDesktopWindowControls();
  const effectiveShowWindowControls = showWindowControls && !isDesktopWindow;
  const showDesktopWindowControls = isDesktopWindow && !!desktopControls;

  const handleWindowClose = useCallback(() => {
    if (isDesktopWindow && desktopControls) {
      desktopControls.onClose();
    } else if (onWindowClose) {
      onWindowClose();
    } else {
      navigate('/');
    }
  }, [isDesktopWindow, desktopControls, onWindowClose, navigate]);

  // Drag and drop state
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);

  // Chrome-style rapid tab closing: lock individual tab widths so close buttons stay in place
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isClosingMode, setIsClosingMode] = useState(false);
  const [lockedTabWidth, setLockedTabWidth] = useState<number | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const unlockTimeoutRef = useRef<number | undefined>(undefined);

  // Tab open / close animation state (transition-based)
  type TabAnimState = 'enter-from' | 'enter-active' | 'leave';
  const prevTabIdsRef = useRef<Set<string>>(new Set(tabs.map((t) => t.id)));
  const [tabAnimMap, setTabAnimMap] = useState<Map<string, TabAnimState>>(new Map());
  const tabAnimMapRef = useRef(tabAnimMap);
  tabAnimMapRef.current = tabAnimMap;

  // Truncation tooltip state
  const [tooltipTab, setTooltipTab] = useState<{
    id: string;
    label: string;
    x: number;
    y: number;
  } | null>(null);
  const tooltipTimeoutRef = useRef<number | undefined>(undefined);

  const handleTabMouseEnter = useCallback((e: React.MouseEvent, tabId: string, label: string) => {
    const labelEl = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-tab-label]');
    if (!labelEl || labelEl.scrollWidth <= labelEl.clientWidth) {
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    tooltipTimeoutRef.current = window.setTimeout(() => {
      setTooltipTab({ id: tabId, label, x: rect.left + rect.width / 2, y: rect.bottom + 6 });
    }, 200);
  }, []);

  const handleTabMouseLeave = useCallback(() => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = undefined;
    }
    setTooltipTab(null);
  }, []);

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
      if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current);
    };
  }, []);

  // Detect newly added tabs → start enter animation
  // Skip when no previous tabs are retained (initial load or app switch)
  useLayoutEffect(() => {
    const prevIds = prevTabIdsRef.current;
    const currentIds = new Set(tabs.map((t) => t.id));
    const added: string[] = [];
    currentIds.forEach((id) => {
      if (!prevIds.has(id)) added.push(id);
    });
    const hasRetainedTabs = [...currentIds].some((id) => prevIds.has(id));
    if (added.length > 0 && hasRetainedTabs) {
      setTabAnimMap((prev) => {
        const next = new Map(prev);
        added.forEach((id) => next.set(id, 'enter-from'));
        return next;
      });
    }
    prevTabIdsRef.current = currentIds;
  }, [tabs]);

  // Force reflow trick: transition enter-from → enter-active before first paint
  useLayoutEffect(() => {
    const enterFromIds = [...tabAnimMap.entries()]
      .filter(([, s]) => s === 'enter-from')
      .map(([id]) => id);
    if (enterFromIds.length === 0) return;
    // Force browser to compute layout at width:0 for each entering tab
    enterFromIds.forEach((id) => {
      const el = tabsContainerRef.current?.querySelector<HTMLElement>(`[data-tab-id="${id}"]`);
      if (el) void el.offsetWidth;
    });
    setTabAnimMap((prev) => {
      const next = new Map(prev);
      enterFromIds.forEach((id) => {
        if (next.get(id) === 'enter-from') next.set(id, 'enter-active');
      });
      return next;
    });
  }, [tabAnimMap]);

  useEffect(() => {
    if (!isClosingMode) return;
    const closableTabs = tabs.filter((t) => !t.fixed && t.closable !== false);
    if (closableTabs.length <= 1) {
      setIsClosingMode(false);
      setIsUnlocking(true);
      unlockTimeoutRef.current = window.setTimeout(() => {
        setLockedTabWidth(null);
        unlockTimeoutRef.current = window.setTimeout(() => {
          setIsUnlocking(false);
        }, 200);
      }, 20);
    }
  }, [tabs, isClosingMode]);

  const handleAnimTransitionEnd = useCallback(
    (e: React.TransitionEvent, tabId: string) => {
      if (e.propertyName !== 'width' || e.target !== e.currentTarget) return;
      const wasLeaving = tabAnimMapRef.current.get(tabId) === 'leave';
      setTabAnimMap((prev) => {
        const next = new Map(prev);
        next.delete(tabId);
        return next;
      });
      if (wasLeaving) {
        onTabClose?.(tabId);
      }
    },
    [onTabClose]
  );

  const handleTabClick = (tabId: string) => {
    if (tabAnimMap.get(tabId) === 'leave') return;
    onTabChange(tabId);
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabAnimMap.get(tabId) === 'leave') return;
    // Skip animation when closing the last tab (app exit)
    if (tabs.length <= 1) {
      onTabClose?.(tabId);
      return;
    }
    const tabEl = (e.currentTarget as HTMLElement).closest('[data-tab-id]') as HTMLElement | null;
    if (tabEl) {
      setLockedTabWidth(tabEl.getBoundingClientRect().width);
      setIsClosingMode(true);
    }
    setTabAnimMap((prev) => new Map(prev).set(tabId, 'leave'));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTabId(tabId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tabId);
    // Add a slight delay to show the drag effect
    requestAnimationFrame(() => {
      (e.target as HTMLElement).style.opacity = '0.5';
    });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTabId(null);
    setDragOverTabId(null);
    (e.target as HTMLElement).style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedTabId && draggedTabId !== tabId) {
      setDragOverTabId(tabId);
    }
  };

  const handleDragLeave = () => {
    setDragOverTabId(null);
  };

  const handleDrop = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    setDragOverTabId(null);

    if (!draggedTabId || !onTabReorder) return;

    const fromIndex = tabs.findIndex((t) => t.id === draggedTabId);
    const toIndex = tabs.findIndex((t) => t.id === targetTabId);

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      onTabReorder(fromIndex, toIndex);
    }

    setDraggedTabId(null);
  };

  return (
    <div
      data-figma-name="[TDS] TabBar"
      className={`
        relative
        flex items-center
        w-full
        h-[var(--tabbar-height)]
        bg-[var(--color-surface-default)]
        ${showBottomBorder ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10' : ''}
        ${className}
      `}
    >
      {/* Tabs Container */}
      <div
        ref={tabsContainerRef}
        onMouseLeave={() => {
          if (isClosingMode) {
            setIsClosingMode(false);
            setIsUnlocking(true);
            unlockTimeoutRef.current = window.setTimeout(() => {
              setLockedTabWidth(null);
              unlockTimeoutRef.current = window.setTimeout(() => {
                setIsUnlocking(false);
              }, 200);
            }, 20);
          }
        }}
        className="
          flex items-end
          overflow-hidden
          h-full
          min-w-0
        "
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          // thaki-ui compatibility: title alias for label, fixed alias for !closable
          const tabLabel = tab.label ?? tab.title ?? '';
          const closable = tab.fixed ? false : tab.closable !== false;
          const isDragging = draggedTabId === tab.id;
          const isDragOver = dragOverTabId === tab.id;
          const animState = tabAnimMap.get(tab.id);
          const isAnimating = !!animState;
          const isClosing = animState === 'leave';

          const collapsed: React.CSSProperties = {
            width: 0,
            paddingLeft: 0,
            paddingRight: 0,
            borderRightWidth: 0,
            opacity: 0,
            overflow: 'hidden',
          };
          const enterTransition =
            'width 200ms ease-out, padding-left 200ms ease-out, padding-right 200ms ease-out, border-right-width 200ms ease-out, opacity 150ms ease-out';
          const leaveTransition =
            'width 200ms ease-in, padding-left 200ms ease-in, padding-right 200ms ease-in, border-right-width 200ms ease-in, opacity 100ms ease-in';

          const getAnimStyle = (): React.CSSProperties => {
            switch (animState) {
              case 'enter-from':
                return collapsed;
              case 'enter-active':
                return { overflow: 'hidden', transition: enterTransition };
              case 'leave':
                return { ...collapsed, transition: leaveTransition };
              default:
                return {};
            }
          };

          return (
            <div
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => handleTabClick(tab.id)}
              onMouseEnter={(e) => handleTabMouseEnter(e, tab.id, tabLabel)}
              onMouseLeave={handleTabMouseLeave}
              draggable={!!onTabReorder && !isAnimating}
              onDragStart={(e) => handleDragStart(e, tab.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, tab.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tab.id)}
              onTransitionEnd={(e) => handleAnimTransitionEnd(e, tab.id)}
              style={{
                ...(lockedTabWidth != null && !isAnimating ? { width: lockedTabWidth } : {}),
                ...getAnimStyle(),
              }}
              className={`
                group
                relative
                flex items-center
                h-full
                ${isClosingMode && !isAnimating ? 'shrink-0' : 'w-[160px] shrink'}
                min-w-0
                pl-[var(--tabbar-tab-padding-x)] pr-[var(--tabbar-tab-padding-r)]
                gap-[var(--tabbar-tab-gap)]
                ${isClosing ? 'pointer-events-none' : 'cursor-pointer'}
                ${isUnlocking && !isAnimating ? 'transition-[color,background-color,width] duration-[var(--duration-normal)]' : !isAnimating ? 'transition-colors duration-[var(--duration-fast)]' : ''}
                border-r border-[var(--color-border-subtle)]
                ${
                  isActive
                    ? 'bg-[var(--color-surface-default)]'
                    : 'bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-muted)]'
                }
                ${isDragging ? 'opacity-50' : ''}
                ${isDragOver ? 'border-l-2 border-l-[var(--color-action-primary)]' : ''}
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)] z-20" />
              )}
              {/* Icon */}
              {tab.icon && (
                <span
                  className={`
                  shrink-0
                  ${isActive ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-muted)]'}
                `}
                >
                  {tab.icon}
                </span>
              )}

              {/* Label */}
              <span
                data-tab-label
                className={`
                  flex-1
                  truncate
                  text-[length:var(--tabbar-font-size)]
                  leading-[var(--tabbar-line-height)]
                  font-medium
                  ${
                    isActive ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-muted)]'
                  }
                `}
              >
                {tabLabel}
              </span>

              {/* Close Button */}
              {closable && onTabClose && (
                <button
                  type="button"
                  onClick={(e) => handleTabClose(e, tab.id)}
                  className={`
                    shrink-0
                    size-[var(--tabbar-close-size)]
                    flex items-center justify-center
                    rounded-[var(--radius-sm)]
                    transition-all duration-[var(--duration-fast)]
                    ${
                      isActive || isClosingMode
                        ? 'text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]'
                        : 'opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-border-default)]'
                    }
                  `}
                  aria-label={`Close ${tabLabel}`}
                >
                  <IconX size={12} stroke={1} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      {showAddButton && onTabAdd && (
        <button
          type="button"
          onClick={onTabAdd}
          className="
            shrink-0
            flex items-center justify-center
            size-[var(--tabbar-add-size)]
            mx-[var(--tabbar-add-margin)]
            rounded-[var(--radius-sm)]
            text-[var(--color-text-muted)]
            transition-colors duration-[var(--duration-fast)]
            hover:bg-[var(--tabbar-hover-bg)]
            hover:text-[var(--color-text-default)]
          "
          aria-label="Add new tab"
        >
          <IconPlus size={14} stroke={1} />
        </button>
      )}

      {/* Spacer — draggable in desktop window mode */}
      <div
        className="flex-1 h-full"
        onMouseDown={showDesktopWindowControls ? desktopControls!.onDragStart : undefined}
        onDoubleClick={showDesktopWindowControls ? desktopControls!.onDoubleClick : undefined}
      />

      {/* Window Controls — normal mode */}
      {effectiveShowWindowControls && (
        <div className="flex items-center gap-1 px-2">
          <button
            type="button"
            onClick={onMinimize}
            className="
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            "
            aria-label="Minimize"
          >
            <IconMinus size={12} stroke={1} />
          </button>
          <button
            type="button"
            onClick={onMaximize}
            className="
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            "
            aria-label="Maximize"
          >
            <IconSquare size={12} stroke={1} />
          </button>
          <button
            type="button"
            onClick={handleWindowClose}
            className="
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            "
            aria-label="Close window"
          >
            <IconX size={12} stroke={1} />
          </button>
        </div>
      )}

      {/* Window Controls — desktop window mode (from context) */}
      {showDesktopWindowControls && (
        <div className="flex items-center gap-1 px-2">
          <button
            type="button"
            onClick={desktopControls!.onMinimize}
            className="
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            "
            aria-label="Minimize"
          >
            <IconMinus size={12} stroke={1} />
          </button>
          <WindowControl
            type="split"
            onSnapLeft={desktopControls!.onSnapLeft}
            onSnapRight={desktopControls!.onSnapRight}
            className="text-[var(--color-text-muted)]"
          />
          <button
            type="button"
            onClick={desktopControls!.onMaximize}
            className="
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            "
            aria-label={desktopControls!.isMaximized ? 'Restore' : 'Maximize'}
          >
            {desktopControls!.isMaximized ? (
              <IconSquares size={12} stroke={1} />
            ) : (
              <IconSquare size={12} stroke={1} />
            )}
          </button>
          <button
            type="button"
            onClick={desktopControls!.onClose}
            className="
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-surface-subtle)]
              hover:text-[var(--color-text-default)]
            "
            aria-label="Close window"
          >
            <IconX size={12} stroke={1} />
          </button>
        </div>
      )}
      {/* Truncation tooltip (portal) — mirrors DS Tooltip visuals */}
      {tooltipTab &&
        createPortal(
          <div
            role="tooltip"
            className="fixed z-[var(--z-tooltip)] pointer-events-none"
            style={{ left: tooltipTab.x, top: tooltipTab.y, transform: 'translateX(-50%)' }}
          >
            <div className="relative">
              <div
                className="
              bg-[var(--tooltip-bg)]
              text-[var(--tooltip-text)]
              px-[var(--tooltip-padding-x)]
              py-[var(--tooltip-padding-y)]
              rounded-[var(--tooltip-radius)]
              text-[length:var(--tooltip-font-size)]
              leading-[var(--tooltip-line-height)]
              text-left
              max-w-[var(--tooltip-max-width)]
              w-max
            "
              >
                {tooltipTab.label}
              </div>
              {/* Arrow pointing up */}
              <div className="absolute top-0 -translate-y-full left-1/2 -translate-x-1/2 w-0 h-0 border-[length:var(--tooltip-arrow-size)] border-solid border-l-transparent border-r-transparent border-t-transparent border-b-[var(--tooltip-bg)]" />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

/* ----------------------------------------
   useTabBar Hook (for easy state management)
   ---------------------------------------- */

export interface UseTabBarOptions {
  /** Initial tabs */
  initialTabs?: TabBarItem[];
  /** Initial active tab id */
  initialActiveTab?: string;
  /** Callback to generate new tab */
  onCreateTab?: () => TabBarItem;
}

export function useTabBar(options: UseTabBarOptions = {}) {
  const { initialTabs = [], initialActiveTab, onCreateTab } = options;

  const [tabs, setTabs] = useState<TabBarItem[]>(initialTabs);
  const [activeTab, setActiveTab] = useState<string>(initialActiveTab || initialTabs[0]?.id || '');

  const addTab = (tab?: TabBarItem) => {
    const newTab = tab ||
      onCreateTab?.() || {
        id: `tab-${Date.now()}`,
        label: `New Tab`,
        closable: true,
      };
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newTab.id);
    return newTab;
  };

  const closeTab = (tabId: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((t) => t.id !== tabId);

      // If closing active tab, switch to adjacent tab
      if (activeTab === tabId && newTabs.length > 0) {
        const closedIndex = prev.findIndex((t) => t.id === tabId);
        const newActiveIndex = Math.min(closedIndex, newTabs.length - 1);
        setActiveTab(newTabs[newActiveIndex].id);
      }

      return newTabs;
    });
  };

  const selectTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return {
    tabs,
    activeTab,
    addTab,
    closeTab,
    selectTab,
    setTabs,
  };
}

export default TabBar;
