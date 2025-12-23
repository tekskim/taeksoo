import React, { useState, useRef } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';

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
  className = '',
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);

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
        flex items-center
        h-[var(--tabbar-height)]
        bg-[var(--color-surface-default)]
        border-b border-[var(--color-border-default)]
        ${className}
      `}
    >
      {/* Tabs Container */}
      <div
        ref={tabsRef}
        className="
          flex items-end
          overflow-x-auto
          scrollbar-none
          h-full
        "
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const closable = tab.closable !== false;

          return (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                group
                relative
                flex items-center
                h-[calc(var(--tabbar-height)-1px)]
                min-w-[var(--tabbar-tab-min-width)]
                max-w-[var(--tabbar-tab-max-width)]
                px-[var(--tabbar-tab-padding-x)]
                gap-[var(--tabbar-tab-gap)]
                cursor-pointer
                transition-colors duration-[var(--duration-fast)]
                border-r border-[var(--color-border-subtle)]
                ${isActive
                  ? 'bg-[var(--color-surface-default)] border-b-2 border-b-[var(--color-action-primary)]'
                  : 'bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)]'
                }
              `}
            >
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
                  ${isActive
                    ? 'text-[var(--color-text-default)] font-medium'
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
                  <IconX size={12} stroke={2} />
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
          <IconPlus size={14} stroke={2} />
        </button>
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

