import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   Tabs Context
   ---------------------------------------- */

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  size: TabSize;
  variant: TabVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs provider');
  }
  return context;
};

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type TabSize = 'sm' | 'md';
export type TabVariant = 'underline' | 'boxed';
// thaki-ui compatibility aliases
export type TabVariantAlias = 'line' | 'button';

const variantAliasMap: Record<TabVariantAlias, TabVariant> = {
  line: 'underline',
  button: 'boxed',
};

export interface TabsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Default active tab value */
  defaultValue?: string;
  /** Controlled active tab value */
  value?: string;
  /** @deprecated Use value instead (thaki-ui compatibility) */
  activeTabId?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Tab size */
  size?: TabSize;
  /** Tab style variant (also accepts thaki-ui aliases: line, button) */
  variant?: TabVariant | TabVariantAlias;
  /** Children (TabList and TabPanels) */
  children: ReactNode;
}

export interface TabListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Tab items */
  children: ReactNode;
}

export interface TabProps extends Omit<
  React.HTMLAttributes<HTMLButtonElement>,
  'children' | 'value'
> {
  /** Tab value (unique identifier) */
  value: string;
  /** Tab label */
  children: ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface TabPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Panel value (matches Tab value) */
  value: string;
  /** Panel content */
  children: ReactNode;
}

/* ----------------------------------------
   Tabs Component (Root)
   ---------------------------------------- */

export function Tabs({
  defaultValue,
  value: controlledValue,
  activeTabId,
  onChange,
  size = 'sm',
  variant: rawVariant = 'underline',
  children,
  className = '',
  ...rest
}: TabsProps) {
  // thaki-ui compatibility: support activeTabId as alias for value
  const effectiveControlledValue = controlledValue ?? activeTabId;

  // thaki-ui compatibility: support variant aliases
  const variant: TabVariant =
    rawVariant in variantAliasMap
      ? variantAliasMap[rawVariant as TabVariantAlias]
      : (rawVariant as TabVariant);

  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const isControlled = effectiveControlledValue !== undefined;
  const activeTab = isControlled ? effectiveControlledValue : internalValue;

  const setActiveTab = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, size, variant }}>
      <div className={twMerge('flex flex-col h-fit', className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/* ----------------------------------------
   TabList Component
   ---------------------------------------- */

export function TabList({ children, className = '', ...rest }: TabListProps) {
  const { variant, setActiveTab } = useTabsContext();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const tablist = e.currentTarget;
      const tabs = Array.from(
        tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      );
      if (tabs.length === 0) return;

      const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (currentIndex < 0) return;

      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = tabs.length - 1;
          break;
      }

      if (nextIndex !== null) {
        tabs[nextIndex].focus();
        const tabValue = tabs[nextIndex].getAttribute('data-tab-value');
        if (tabValue) setActiveTab(tabValue);
      }
    },
    [setActiveTab]
  );

  const variantStyles = {
    underline:
      'flex gap-[var(--tabs-gap)] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-[var(--color-border-default)] after:pointer-events-none after:z-10',
    boxed: [
      'inline-flex',
      'items-center',
      'gap-1',
      'p-1',
      'h-10',
      'bg-[var(--color-surface-subtle)]',
      'shadow-[inset_0_0_0_1px_var(--color-border-subtle)]',
      'rounded-lg',
      'w-fit',
    ].join(' '),
  };

  return (
    <div
      {...rest}
      role="tablist"
      className={twMerge(variantStyles[variant], className)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------
   Tab Component
   ---------------------------------------- */

export function Tab({ value, children, disabled = false, className = '', ...rest }: TabProps) {
  const { activeTab, setActiveTab, size, variant } = useTabsContext();
  const isActive = activeTab === value;

  const sizeStyles = {
    sm: 'text-[length:var(--tabs-font-size-sm)] leading-[var(--tabs-line-height-sm)]',
    md: 'text-[length:var(--tabs-font-size-md)] leading-[var(--tabs-line-height-md)]',
  };

  // Underline variant
  if (variant === 'underline') {
    return (
      <button
        {...rest}
        role="tab"
        type="button"
        data-tab-value={value}
        tabIndex={isActive ? 0 : -1}
        aria-selected={isActive}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => !disabled && setActiveTab(value)}
        className={twMerge(
          'flex flex-col items-center gap-[var(--tabs-indicator-gap)]',
          'min-w-[var(--tabs-min-width)]',
          'cursor-pointer transition-colors duration-[var(--duration-fast)]',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        {/* Tab Label */}
        <span
          className={twMerge(
            'px-[var(--tabs-padding-x)] py-0',
            'font-medium text-center whitespace-nowrap',
            sizeStyles[size],
            isActive
              ? 'text-[var(--tabs-active-color)]'
              : 'text-[var(--tabs-inactive-color)] hover:text-[var(--tabs-hover-color)]'
          )}
        >
          {children}
        </span>

        {/* Active Indicator */}
        <span
          className={twMerge(
            'relative z-20',
            'w-full h-[var(--tabs-indicator-height)]',
            'transition-colors duration-[var(--duration-fast)]',
            isActive ? 'bg-[var(--tabs-indicator-color)]' : 'bg-transparent'
          )}
        />
      </button>
    );
  }

  // Boxed variant
  return (
    <button
      {...rest}
      role="tab"
      type="button"
      data-tab-value={value}
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={twMerge(
        'flex items-center justify-center',
        'min-w-[80px] px-3 h-8',
        'font-medium text-center whitespace-nowrap',
        'rounded-md',
        'cursor-pointer transition-colors duration-[var(--duration-fast)]',
        sizeStyles[size],
        isActive
          ? 'bg-[var(--color-surface-default)] shadow-[inset_0_0_0_1px_var(--color-border-default),0_1px_2px_0_rgba(0,0,0,0.05)] text-[var(--color-action-primary)]'
          : 'bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)]',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------
   TabPanel Component
   ---------------------------------------- */

export function TabPanel({ value, children, className = '', ...rest }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <div
      {...rest}
      role="tabpanel"
      aria-hidden={!isActive}
      className={twMerge('pt-[var(--tabs-panel-padding)]', !isActive && 'hidden', className)}
    >
      {children}
    </div>
  );
}
