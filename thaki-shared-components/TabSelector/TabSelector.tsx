import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '../../services';
import { tabButtonStyles, tabSelectorStyles } from './TabSelector.styles';

type Orientation = 'horizontal' | 'vertical';
export type TabVariant = 'small' | 'medium' | 'pill';

export interface TabSelectorOption {
  id: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface TabSelectorProps {
  /** Available options to render */
  options: TabSelectorOption[];
  /** Controlled selected option id */
  value?: string;
  /** Initial selected option id when uncontrolled */
  defaultValue?: string;
  /** Triggered when selection changes */
  onChange?: (id: string) => void;
  /** Design variant: small (12px/24px gap), medium (14px/32px gap), or pill (segment control style) */
  variant?: TabVariant;
  /** Horizontal by default; vertical stacks options */
  layout?: Orientation;
  /** Optional class name applied to the container */
  className?: string;
  /** aria-label forwarded to group container */
  ariaLabel?: string;
  /** aria-labelledby forwarded to group container */
  ariaLabelledBy?: string;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  variant = 'medium',
  layout = 'horizontal',
  className,
  ariaLabel,
  ariaLabelledBy,
}) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return options[0]?.id;
  });

  // Ensure internal state stays in sync with available options when uncontrolled
  useEffect(() => {
    if (value !== undefined) return;
    const current = internalValue;
    if (current && options.some((option) => option.id === current)) return;
    const fallback = defaultValue ?? options[0]?.id;
    setInternalValue(fallback);
  }, [options, value, defaultValue, internalValue]);

  const selectedId = useMemo(
    () => (value !== undefined ? value : (internalValue ?? options[0]?.id)),
    [value, internalValue, options]
  );

  const handleSelect = (optionId: string, disabled?: boolean) => {
    if (disabled || optionId === selectedId) return;

    if (value === undefined) {
      setInternalValue(optionId);
    }

    onChange?.(optionId);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(tabSelectorStyles({ variant, layout }), className)}
    >
      {options.map((option) => {
        const isActive = option.id === selectedId;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option.id, option.disabled)}
            disabled={option.disabled}
            className={cn(tabButtonStyles({ variant, active: isActive, layout }))}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSelector;
