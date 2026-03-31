import { HTMLAttributes } from 'react';

export interface RadioButtonProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  name?: string;
  value: string | number;
  checked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  onChange?: (value: string | number) => void;
}
