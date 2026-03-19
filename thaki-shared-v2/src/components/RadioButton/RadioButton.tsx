import React from 'react';
import { cn } from '../../services/utils/cn';
import {
  radioContainerStyles,
  radioContainerDisabledStyles,
  radioInputVariants,
  radioLabelStyles,
} from './RadioButton.styles';
import { RadioButtonProps } from './RadioButton.types';

export const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  checked = false,
  disabled = false,
  size = 'md',
  label,
  name,
  onChange,
  ...htmlProps
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!disabled && onChange) {
      onChange(value);
    }
    e.stopPropagation();
  };

  const handleClick = (e: React.MouseEvent<HTMLLabelElement>): void => {
    e.stopPropagation();
  };

  return (
    <label
      className={cn(radioContainerStyles, disabled && radioContainerDisabledStyles)}
      onClick={handleClick}
    >
      <input
        type="radio"
        className={radioInputVariants({ size })}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        {...htmlProps}
      />
      {label && <span className={radioLabelStyles}>{label}</span>}
    </label>
  );
};
