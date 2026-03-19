import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import Input, { InputProps } from './Input';

type FormInputProps<T extends FieldValues> = Omit<
  InputProps,
  'value' | 'onChange' | 'defaultValue'
> & {
  /** react-hook-form control object */
  control: Control<T>;
  /** Field name (must match form schema) */
  name: Path<T>;
};

/**
 * Input component integrated with react-hook-form via Controller.
 *
 * Use this instead of `<Input {...register('field')} />` to avoid
 * controlled/uncontrolled mode conflicts.
 *
 * @example
 * const { control } = useForm<FormData>();
 *
 * <FormInput
 *   control={control}
 *   name="email"
 *   placeholder="Enter email"
 *   error={Boolean(errors.email)}
 * />
 */
function FormInput<T extends FieldValues>({
  control,
  name,
  ...inputProps
}: FormInputProps<T>): React.ReactElement {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          value={field.value ?? ''}
          onChange={(_, filteredValue) => field.onChange(filteredValue)}
          onBlur={field.onBlur}
          {...inputProps}
        />
      )}
    />
  );
}

export default FormInput;
export type { FormInputProps };
