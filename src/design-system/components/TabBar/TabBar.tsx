import React, { useState } from 'react';
import { IconPlus, IconX, IconMinus, IconSquare } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface TabBarItem {
  /** Unique identifier */
  id: string;
  /** Tab label */
  label: string;
  /** Icon (optional) */
  icon?: React.ReactNode;
  /** Whether the tab can be closed */
  closable?: boolean;
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
  /** Show add button */
  showAddButton?: boolean;
  /** Show window controls (minimize, maximize, close) */
  showWindowControls?: boolean;
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
  showAddButton = true,
  showWindowControls = true,
  onMinimize,
  onMaximize,
  onWindowClose,
  className = '',
}) => {
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose?.(tabId);
  };

  return (
    <div
      className={`
        relative
        flex items-center
        w-full
        h-[var(--tabbar-height)]
        bg-[var(--color-surface-default)]
        after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10
        ${className}
      `}
    >
      {/* Tabs Container */}
      <div
        className="
          flex items-end
          overflow-hidden
          h-full
          min-w-0
          shrink
        "
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const closable = tab.closable !== false;

          return (
            <div
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                group
                relative
                flex items-center
                h-full
                w-[160px]
                min-w-0
                shrink
                px-[var(--tabbar-tab-padding-x)]
                gap-[var(--tabbar-tab-gap)]
                cursor-pointer
                transition-colors duration-[var(--duration-fast)]
                border-r border-[var(--color-border-subtle)]
                ${isActive
                  ? 'bg-[var(--color-surface-default)]'
                  : 'bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)]'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)] z-20"
                />
              )}
              {/* Icon */}
              {tab.icon && (
                <span className={`
                  shrink-0
                  ${isActive ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-muted)]'}
                `}>
                  {tab.icon}
                </span>
              )}

              {/* Label */}
              <span
                className={`
                  flex-1
                  truncate
                  text-[length:var(--tabbar-font-size)]
                  leading-[var(--tabbar-line-height)]
                  font-medium
                  ${isActive
                    ? 'text-[var(--color-text-default)]'
                    : 'text-[var(--color-text-muted)]'
                  }
                `}
              >
                {tab.label}
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
                    ${isActive
                      ? 'text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]'
                      : 'opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-border-default)]'
                    }
                  `}
                  aria-label={`Close ${tab.label}`}
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

      {/* Spacer */}
      <div className="flex-1" />

      {/* Window Controls */}
      {showWindowControls && (
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
            onClick={onWindowClose}
            className="
              flex items-center justify-center
              size-[24px]
              rounded-[var(--radius-sm)]
              text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-state-danger-bg)]
              hover:text-[var(--color-state-danger-text)]
            "
            aria-label="Close window"
          >
            <IconX size={12} stroke={1} />
          </button>
        </div>
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
  const {
    initialTabs = [],
    initialActiveTab,
    onCreateTab,
  } = options;

  const [tabs, setTabs] = useState<TabBarItem[]>(initialTabs);
  const [activeTab, setActiveTab] = useState<string>(
    initialActiveTab || initialTabs[0]?.id || ''
  );

  const addTab = (tab?: TabBarItem) => {
    const newTab = tab || onCreateTab?.() || {
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

