import { forwardRef, type HTMLAttributes, type ReactNode, createContext, useContext } from 'react';
import { twMerge } from 'tailwind-merge';

/* ----------------------------------------
   FormField Context
   ---------------------------------------- */

interface FormFieldContextValue {
  id?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
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

/* ----------------------------------------
   FormField Component
   ---------------------------------------- */

const FormFieldRoot = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ id, error, disabled, required, children, className, ...props }, ref) => {
    const contextValue: FormFieldContextValue = {
      id,
      error,
      disabled,
      required,
    };

    return (
      <FormFieldContext.Provider value={contextValue}>
        <div ref={ref} className={twMerge('flex flex-col gap-2', className)} {...props}>
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
      sm: 'text-[length:var(--font-size-12)] leading-[var(--line-height-16)]',
      md: 'text-[length:var(--font-size-14)] leading-[var(--line-height-20)]',
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
    return (
      <div ref={ref} className={twMerge('w-full', className)} {...props}>
        {children}
      </div>
    );
  }
);

FormFieldControl.displayName = 'FormField.Control';

/* ----------------------------------------
   FormField.HelperText Component
   ---------------------------------------- */

const FormFieldHelperText = forwardRef<HTMLParagraphElement, FormFieldHelperTextProps>(
  ({ children, className, ...props }, ref) => {
    const { id } = useFormField();

    return (
      <p
        ref={ref}
        id={id ? `${id}-helper` : undefined}
        className={twMerge(
          'text-[11px] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]',
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
          'text-[11px] leading-[var(--line-height-16)] text-[var(--color-state-danger)]',
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
  Control: FormFieldControl,
  HelperText: FormFieldHelperText,
  ErrorMessage: FormFieldErrorMessage,
});
