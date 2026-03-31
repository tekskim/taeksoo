import { HTMLAttributes } from 'react';
import { ComponentSize } from '../../types';

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  name?: string;
  label?: string;
  value?: string | number;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  onChange?: (checked: boolean) => void;
  children?: React.ReactNode;
}
