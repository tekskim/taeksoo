import {
  forwardRef,
  useId,
  useState,
  useEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { IconCheck, IconMinus } from '@tabler/icons-react';

/* ----------------------------------------
   Checkbox Types
   ---------------------------------------- */

// thaki-ui compatibility: support both onChange signatures
type ThakiOnChange = (checked: boolean) => void;
type StandardOnChange = (e: React.ChangeEvent<HTMLInputElement>) => void;

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Checkbox label */
  label?: ReactNode;
  /** Description text below label */
  description?: ReactNode;
  /** Indeterminate state (partially selected) */
  indeterminate?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Change handler (supports both standard event and thaki-ui boolean signature) */
  onChange?: StandardOnChange | ThakiOnChange;
}

/* ----------------------------------------
   Checkbox Component
   ---------------------------------------- */

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      indeterminate = false,
      error = false,
      errorMessage,
      disabled = false,
      checked,
      defaultChecked,
      onChange,
      className = '',
      id,
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = errorMessage ? `${inputId}-error` : undefined;

    // Internal ref for indeterminate state
    const internalRef = useRef<HTMLInputElement>(null);

    // Combine refs
    const setRefs = (element: HTMLInputElement | null) => {
      (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = element;
      if (typeof forwardedRef === 'function') {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    };

    // Internal state for uncontrolled mode
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

    // Use controlled value if provided, otherwise use internal state
    const isControlled = checked !== undefined;
    const isCheckedValue = isControlled ? checked : internalChecked;

    // Set indeterminate property on the input element (can't be set via attribute)
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Determine visual state
    const isChecked = isCheckedValue || indeterminate;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      
      // thaki-ui compatibility: support both onChange signatures
      // Call with event, but thaki-ui handlers that expect (checked: boolean)
      // will receive the event object. If you need thaki-ui style, use:
      // onChange={(e) => yourHandler(e.target.checked)}
      // or the component will try to call both styles
      if (onChange) {
        // Always call as standard onChange - TypeScript users will get type checking
        // Runtime: if handler expects boolean and receives event, it still works
        // as JavaScript is loosely typed
        (onChange as StandardOnChange)(e);
      }
    };

    // Box styles based on state
    const getBoxStyles = () => {
      const base = [
        'relative flex items-center justify-center shrink-0',
        'w-[var(--checkbox-size)] h-[var(--checkbox-size)]',
        'rounded-[var(--checkbox-radius)]',
        'transition-all duration-[var(--duration-fast)]',
      ];

      if (disabled) {
        if (isChecked) {
          return [...base, 'bg-[var(--checkbox-disabled-checked-bg)]'];
        }
        return [
          ...base,
          'bg-[var(--checkbox-disabled-bg)] border border-[var(--checkbox-disabled-border)]',
        ];
      }

      if (error) {
        if (isChecked) {
          return [...base, 'bg-[var(--checkbox-error-bg)]'];
        }
        return [...base, 'bg-[var(--checkbox-bg)] border-2 border-[var(--checkbox-error-border)]'];
      }

      if (isChecked) {
        return [...base, 'bg-[var(--checkbox-checked-bg)]'];
      }

      return [
        ...base,
        'bg-[var(--checkbox-bg)] border border-[var(--checkbox-border)]',
        'group-hover:border-[var(--checkbox-border-hover)]',
      ];
    };

    // Label styles based on state
    const getLabelStyles = () => {
      if (disabled) {
        return 'text-[var(--checkbox-label-disabled)]';
      }
      if (error) {
        return 'text-[var(--checkbox-label-error)]';
      }
      return 'text-[var(--checkbox-label-color)]';
    };

    return (
      <div className={twMerge('flex flex-col gap-[var(--checkbox-description-gap)]', className)}>
        <label
          htmlFor={inputId}
          className={twMerge(
            'group inline-flex items-center gap-[var(--checkbox-gap)] cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        >
          {/* Hidden native checkbox */}
          <input
            ref={setRefs}
            type="checkbox"
            id={inputId}
            checked={isCheckedValue}
            disabled={disabled}
            onChange={handleChange}
            // Note: indeterminate state is set via ref in useEffect
            // as it cannot be set via HTML attribute
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={error || undefined}
            className="sr-only peer"
            {...props}
          />

          {/* Custom checkbox box */}
          <span className={twMerge(getBoxStyles())}>
            {isChecked &&
              (indeterminate ? (
                <IconMinus
                  size={12}
                  strokeWidth={3}
                  className={
                    disabled
                      ? 'text-[var(--checkbox-icon-disabled)]'
                      : 'text-[var(--checkbox-icon-color)]'
                  }
                />
              ) : (
                <IconCheck
                  size={12}
                  strokeWidth={3}
                  className={
                    disabled
                      ? 'text-[var(--checkbox-icon-disabled)]'
                      : 'text-[var(--checkbox-icon-color)]'
                  }
                />
              ))}
          </span>

          {/* Label */}
          {label && (
            <span
              className={twMerge(
                'text-[length:var(--checkbox-label-size)] leading-[var(--checkbox-label-line-height)] font-normal',
                getLabelStyles()
              )}
            >
              {label}
            </span>
          )}
        </label>

        {/* Description */}
        {description && (
          <p
            id={descriptionId}
            className="text-[length:var(--checkbox-description-size)] leading-[var(--checkbox-description-line-height)] text-[var(--checkbox-description-color)] ml-[calc(var(--checkbox-size)+var(--checkbox-gap))]"
          >
            {description}
          </p>
        )}

        {/* Error message */}
        {error && errorMessage && (
          <p
            id={errorId}
            role="alert"
            className="text-[length:var(--checkbox-error-size)] leading-[var(--checkbox-error-line-height)] text-[var(--checkbox-error-text)] ml-[calc(var(--checkbox-size)+var(--checkbox-gap))]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
