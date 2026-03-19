import React, { forwardRef, useState } from 'react';
import { cn } from '../../services/utils/cn';
import {
  checkboxContainerStyles,
  checkboxContainerDisabledStyles,
  checkboxInputVariants,
  checkboxLabelStyles,
} from './Checkbox.styles';
import { CheckboxProps } from './Checkbox.types';

/**
 * [Design System] 체크박스 컴포넌트
 *
 * 단독 또는 라벨과 함께 사용 가능한 체크박스입니다.
 *
 * @example
 * // 기본 체크박스 (라벨 포함)
 * <Checkbox checked={agreed} onChange={setAgreed}>
 *   이용약관에 동의합니다
 * </Checkbox>
 *
 * @example
 * // 크기 변형
 * <Checkbox size="sm" checked={checked} onChange={setChecked}>Small</Checkbox>
 * <Checkbox size="md" checked={checked} onChange={setChecked}>Medium</Checkbox>
 *
 * @example
 * // 비활성화 상태
 * <Checkbox disabled checked>비활성화된 체크박스</Checkbox>
 *
 * @example
 * // 라벨 없이 단독 사용
 * <Checkbox checked={selected} onChange={setSelected} />
 *
 * @example
 * // 폼에서 사용 (name, value 활용)
 * <Checkbox name="terms" value="accepted" checked={form.terms} onChange={handleChange}>
 *   약관 동의
 * </Checkbox>
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      disabled = false,
      size = 'md',
      name,
      value,
      onChange,
      className,
      children,
      label,
      ...htmlProps
    },
    ref
  ) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const currentChecked = isControlled ? checked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const isChecked = e.target.checked;

      if (!isControlled) {
        setInternalChecked(isChecked);
      }

      onChange?.(isChecked);
      e.stopPropagation();
    };

    const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>): void => {
      e.stopPropagation();
    };

    const checkboxProps = {
      ref,
      type: 'checkbox' as const,
      className: checkboxInputVariants({ size }),
      name,
      value,
      disabled,
      onChange: handleChange,
      checked: currentChecked,
      ...htmlProps,
    };

    const input = <input {...checkboxProps} />;
    const labelText = children || label;

    if (labelText) {
      return (
        <label
          className={cn(
            checkboxContainerStyles,
            disabled && checkboxContainerDisabledStyles,
            className
          )}
          onClick={handleLabelClick}
        >
          {input}
          <span className={checkboxLabelStyles}>{labelText}</span>
        </label>
      );
    }

    return input;
  }
);

Checkbox.displayName = 'Checkbox';
