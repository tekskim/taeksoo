import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  cloneElement,
  isValidElement,
  Children,
  useId,
} from 'react';
import { twMerge } from '../../utils/cn';

/* ----------------------------------------
   FormField Context
   ---------------------------------------- */

interface FormFieldContextValue {
  id?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  spacing?: 'default' | 'loose';
}

const FormFieldContext = createContext<FormFieldContextValue>({});

const useFormField = () => useContext(FormFieldContext);

/* ----------------------------------------
   FormField Types
   ---------------------------------------- */

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Field ID - used to connect label with input */
  id?: string;
  /** Whether the field has an error */
  error?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Children elements */
  children: ReactNode;

  /* ----------------------------------------
     Simple API Props (alternative to Compound)
     ---------------------------------------- */

  /** Label text (simple API) - if provided, enables simple mode */
  label?: ReactNode;
  /** Description text below label (simple API) */
  description?: ReactNode;
  /** Helper text below input (simple API) */
  helperText?: ReactNode;
  /** Error message (simple API) */
  errorMessage?: ReactNode;
  /** Label size */
  labelSize?: 'sm' | 'md';
  /** Spacing between sub-components. 'loose' uses 12px gap (matches VStack gap={3}) for complex sections */
  spacing?: 'default' | 'loose';
}

export interface FormFieldLabelProps extends HTMLAttributes<HTMLLabelElement> {
  /** Label text */
  children: ReactNode;
  /** Whether to show required indicator */
  required?: boolean;
  /** Label size */
  size?: 'sm' | 'md';
}

export interface FormFieldHelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Helper text content */
  children: ReactNode;
}

export interface FormFieldErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Error message content */
  children: ReactNode;
}

export interface FormFieldControlProps extends HTMLAttributes<HTMLDivElement> {
  /** Control content (Input, Select, etc.) */
  children: ReactNode;
}

export interface FormFieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Description text content */
  children: ReactNode;
}

/* ----------------------------------------
   FormField Component
   
   Supports two usage modes:
   
   1. Simple API (recommended for most cases):
      <FormField label="Name" helperText="2-64 characters" required>
        <Input placeholder="Enter name" />
      </FormField>
   
   2. Compound API (for complex layouts):
      <FormField required>
        <FormField.Label>Name <Badge>NEW</Badge></FormField.Label>
        <FormField.Description>설명</FormField.Description>
        <FormField.Control>
          <Input placeholder="Enter name" />
        </FormField.Control>
        <FormField.HelperText>2-64 characters</FormField.HelperText>
      </FormField>
   ---------------------------------------- */

const FormFieldRoot = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      id: idProp,
      error,
      disabled,
      required,
      children,
      className,
      // Simple API props
      label,
      description,
      helperText,
      errorMessage,
      labelSize = 'md',
      spacing = 'default',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp || (label ? generatedId : undefined);

    const contextValue: FormFieldContextValue = {
      id,
      error,
      disabled,
      required,
      spacing,
    };

    // Simple API mode: when label prop is provided
    if (label !== undefined) {
      return (
        <FormFieldContext.Provider value={contextValue}>
          <div ref={ref} className={twMerge('flex flex-col', className)} {...props}>
            {/* Label */}
            <FormFieldLabel size={labelSize}>{label}</FormFieldLabel>

            {/* Description (below label, 4px gap from label) */}
            {description && <FormFieldDescription>{description}</FormFieldDescription>}

            {/* Control with auto-injected props */}
            <FormFieldControl>
              {Children.map(children, (child) => {
                if (isValidElement(child)) {
                  // Auto-inject id, error, disabled props to form controls
                  return cloneElement(child as React.ReactElement<any>, {
                    id: (child.props as any).id || id,
                    error: (child.props as any).error ?? error,
                    disabled: (child.props as any).disabled ?? disabled,
                  });
                }
                return child;
              })}
            </FormFieldControl>

            {/* Error Message (below input, shown when error) */}
            {errorMessage && <FormFieldErrorMessage>{errorMessage}</FormFieldErrorMessage>}

            {/* Helper Text (below input, always visible) */}
            {helperText && <FormFieldHelperText>{helperText}</FormFieldHelperText>}
          </div>
        </FormFieldContext.Provider>
      );
    }

    // Compound API mode: traditional usage with sub-components
    return (
      <FormFieldContext.Provider value={contextValue}>
        <div ref={ref} className={twMerge('flex flex-col', className)} {...props}>
          {children}
        </div>
      </FormFieldContext.Provider>
    );
  }
);

FormFieldRoot.displayName = 'FormField';

/* ----------------------------------------
   FormField.Label Component
   ---------------------------------------- */

const FormFieldLabel = forwardRef<HTMLLabelElement, FormFieldLabelProps>(
  ({ children, required: requiredProp, size = 'md', className, ...props }, ref) => {
    const { id, required: contextRequired } = useFormField();
    const isRequired = requiredProp ?? contextRequired;

    const sizeStyles = {
      sm: 'text-label-md',
      md: 'text-label-lg',
    };

    return (
      <label
        ref={ref}
        htmlFor={id}
        className={twMerge(
          'font-medium text-[var(--color-text-default)]',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
        {isRequired && <span className="ml-1 text-[var(--color-state-danger)]">*</span>}
      </label>
    );
  }
);

FormFieldLabel.displayName = 'FormField.Label';

/* ----------------------------------------
   FormField.Control Component
   ---------------------------------------- */

const FormFieldControl = forwardRef<HTMLDivElement, FormFieldControlProps>(
  ({ children, className, ...props }, ref) => {
    const { spacing } = useFormField();

    return (
      <div
        ref={ref}
        className={twMerge(
          'w-full',
          spacing === 'loose'
            ? 'mt-[var(--primitive-spacing-3)]'
            : 'mt-[var(--primitive-spacing-2)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormFieldControl.displayName = 'FormField.Control';

/* ----------------------------------------
   FormField.Description Component
   (Appears below label, describes the field purpose)
   ---------------------------------------- */

const FormFieldDescription = forwardRef<HTMLParagraphElement, FormFieldDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    const { id } = useFormField();

    // Label ↔ Description: always 4px regardless of spacing
    return (
      <p
        ref={ref}
        id={id ? `${id}-description` : undefined}
        className={twMerge(
          'text-body-md text-[var(--color-text-subtle)] mt-[var(--primitive-spacing-1)]',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

FormFieldDescription.displayName = 'FormField.Description';

/* ----------------------------------------
   FormField.HelperText Component
   ---------------------------------------- */

const FormFieldHelperText = forwardRef<HTMLParagraphElement, FormFieldHelperTextProps>(
  ({ children, className, ...props }, ref) => {
    const { id } = useFormField();

    // HelperText uses text-body-sm (11px/16px), 8px gap from input
    // Always visible — shown alongside ErrorMessage, not replaced by it
    return (
      <p
        ref={ref}
        id={id ? `${id}-helper` : undefined}
        className={twMerge(
          'text-body-sm text-[var(--color-text-subtle)] mt-[var(--primitive-spacing-2)]',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

FormFieldHelperText.displayName = 'FormField.HelperText';

/* ----------------------------------------
   FormField.ErrorMessage Component
   ---------------------------------------- */

const FormFieldErrorMessage = forwardRef<HTMLParagraphElement, FormFieldErrorMessageProps>(
  ({ children, className, ...props }, ref) => {
    const { id, error } = useFormField();

    // Only render if there's an error
    if (!error) return null;

    return (
      <p
        ref={ref}
        id={id ? `${id}-error` : undefined}
        role="alert"
        className={twMerge(
          'text-body-sm text-[var(--color-state-danger)] mt-[var(--primitive-spacing-2)]',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

FormFieldErrorMessage.displayName = 'FormField.ErrorMessage';

/* ----------------------------------------
   Compound Component Export
   ---------------------------------------- */

export const FormField = Object.assign(FormFieldRoot, {
  Label: FormFieldLabel,
  Description: FormFieldDescription,
  Control: FormFieldControl,
  HelperText: FormFieldHelperText,
  ErrorMessage: FormFieldErrorMessage,
});
