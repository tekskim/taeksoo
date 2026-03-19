export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  legend?: string;
  required?: boolean;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  name: string;
  options: RadioOption[];
  selectedValue: string;
  errorMessage?: string;
  onChange: (value: string) => void;
  renderOption?: (
    option: RadioOption,
    isSelected: boolean,
    onChange: (value: string) => void
  ) => React.ReactNode;
}
