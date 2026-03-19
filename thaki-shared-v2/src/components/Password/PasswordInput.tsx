import React, { ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Direction } from '../../types';
import { Input } from '../Input';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;

interface PasswordInputBaseProps {
  id: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  tooltipContent: ReactNode;
  showTooltip: boolean;
  onFocus: InputHTMLAttributes['onFocus'];
  onBlur: InputHTMLAttributes['onBlur'];
  autoFocus?: InputHTMLAttributes['autoFocus'];
  tooltipDirection?: Direction;
}

interface PasswordInputWithRegister extends PasswordInputBaseProps {
  register: UseFormRegisterReturn;
  value?: never;
  onChange?: never;
}

interface PasswordInputControlled extends PasswordInputBaseProps {
  register?: never;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type PasswordInputProps = PasswordInputWithRegister | PasswordInputControlled;

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  placeholder,
  disabled,
  error,
  errorMessage,
  tooltipContent,
  showTooltip,
  onFocus,
  onBlur,
  register,
  value,
  onChange,
  tooltipDirection = 'right',
  autoFocus,
}) => {
  const inputProps = register ? { ...register } : { value, onChange };

  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor={id}>
        <Typography.Label as="span">{label}</Typography.Label>
      </label>
      <Tooltip
        content={tooltipContent}
        visibile={showTooltip}
        direction={tooltipDirection}
        focusable={false}
      >
        <Input
          id={id}
          type="password"
          showPasswordToggle
          placeholder={placeholder}
          disabled={disabled}
          {...inputProps}
          autoFocus={autoFocus}
          error={error}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete="new-password"
        />
      </Tooltip>
      {error && errorMessage && (
        <Typography.Text as="span" variant="caption" color="error">
          {errorMessage}
        </Typography.Text>
      )}
    </div>
  );
};

export default PasswordInput;
