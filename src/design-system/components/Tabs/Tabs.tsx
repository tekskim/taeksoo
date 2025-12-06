import { createContext, useContext, useState, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

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

export interface TabsProps {
  /** Default active tab value */
  defaultValue?: string;
  /** Controlled active tab value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Tab size */
  size?: TabSize;
  /** Tab style variant */
  variant?: TabVariant;
  /** Children (TabList and TabPanels) */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface TabListProps {
  /** Tab items */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface TabProps {
  /** Tab value (unique identifier) */
  value: string;
  /** Tab label */
  children: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export interface TabPanelProps {
  /** Panel value (matches Tab value) */
  value: string;
  /** Panel content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/* ----------------------------------------
   Tabs Component (Root)
   ---------------------------------------- */

export function Tabs({
  defaultValue,
  value: controlledValue,
  onChange,
  size = 'sm',
  variant = 'underline',
  children,
  className = '',
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const isControlled = controlledValue !== undefined;
  const activeTab = isControlled ? controlledValue : internalValue;

  const setActiveTab = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, size, variant }}>
      <div className={twMerge('flex flex-col', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/* ----------------------------------------
   TabList Component
   ---------------------------------------- */

export function TabList({ children, className = '' }: TabListProps) {
  const { variant } = useTabsContext();

  const variantStyles = {
    underline: 'border-b border-[var(--color-border-default)]',
    boxed: [
      'inline-flex',
      'p-[var(--tabs-boxed-padding)]',
      'bg-[var(--tabs-boxed-bg)]',
      'border border-[var(--tabs-boxed-border)]',
      'rounded-[var(--tabs-boxed-radius)]',
    ].join(' '),
  };

  return (
    <div
      role="tablist"
      className={twMerge(
        'flex gap-[var(--tabs-gap)]',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------
   Tab Component
   ---------------------------------------- */

export function Tab({ value, children, disabled = false, className = '' }: TabProps) {
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
        role="tab"
        type="button"
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
              : 'text-[var(--tabs-inactive-color)] hover:text-[var(--tabs-hover-color)]',
          )}
        >
          {children}
        </span>

        {/* Active Indicator */}
        <span
          className={twMerge(
            'w-full h-[var(--tabs-indicator-height)]',
            'transition-colors duration-[var(--duration-fast)]',
            isActive ? 'bg-[var(--tabs-indicator-color)]' : 'bg-transparent',
          )}
        />
      </button>
    );
  }

  // Boxed variant
  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={twMerge(
        'flex-1',
        'px-[var(--tabs-boxed-item-padding-x)] py-[var(--tabs-boxed-item-padding-y)]',
        'font-medium text-center whitespace-nowrap',
        'rounded-[var(--tabs-boxed-item-radius)]',
        'cursor-pointer transition-all duration-[var(--duration-fast)]',
        sizeStyles[size],
        isActive
          ? 'bg-[var(--tabs-boxed-active-bg)] text-[var(--tabs-active-color)]'
          : 'bg-transparent text-[var(--tabs-inactive-color)] hover:text-[var(--tabs-hover-color)]',
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

export function TabPanel({ value, children, className = '' }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      aria-hidden={!isActive}
      className={twMerge('pt-[var(--tabs-panel-padding)]', className)}
    >
      {children}
    </div>
  );
}
