import React, { useState } from 'react';
import { cn } from '../../services/utils/cn';
import { ComponentSize } from '../../types';
import { HideIcon, ShowIcon } from '../Icon';
import { inputContainerStyles, inputVariants, passwordToggleStyles } from './Input.styles';

interface Props extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'defaultValue' | 'onChange'
> {
  error?: boolean;
  success?: boolean;
  size?: ComponentSize;
  showPasswordToggle?: boolean;
  filter?: RegExp | ((value: string) => string);
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, filteredValue: string) => void;
  /** 비제어 모드 초기값 */
  defaultValue?: string | number;
}

/**
 * [Design System] 텍스트 입력 컴포넌트
 *
 * 다양한 상태(error, success)와 크기를 지원하며, 비밀번호 토글 기능을 제공합니다.
 *
 * @example
 * // 기본 텍스트 입력
 * <Input placeholder="이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} />
 *
 * @example
 * // 에러 상태
 * <Input error placeholder="이메일" value={email} onChange={handleChange} />
 *
 * @example
 * // 비밀번호 입력 (토글 버튼 포함)
 * <Input type="password" showPasswordToggle placeholder="비밀번호" />
 *
 * @example
 * // 숫자만 입력 (필터 사용)
 * <Input filter={/[^0-9]/g} placeholder="숫자만 입력" />
 *
 * @example
 * // FormField와 함께 사용
 * <FormField label="이메일" error={errors.email} required>
 *   <Input type="email" error={Boolean(errors.email)} />
 * </FormField>
 *
 * @param error - 에러 상태 여부
 * @param success - 성공 상태 여부
 * @param size - 입력 필드 크기 ('xs' | 'sm' | 'md' | 'lg')
 * @param filter - 입력 값 필터링 (정규식 또는 함수)
 * @param disabled - 비활성화 상태
 * @param showPasswordToggle - 비밀번호 토글 버튼 표시 (type="password"일 때만)
 * @param className - 추가 CSS 클래스
 */
const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      error,
      success,
      size = 'md',
      className,
      type,
      showPasswordToggle = false,
      value,
      filter,
      disabled,
      onChange,
      defaultValue,
      ...restProps
    },
    ref
  ): React.ReactElement => {
    // 비밀번호 토글 상태 관리
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    /** 필터 함수 */
    const applyFilter = (v: string): string => {
      if (typeof filter === 'function') {
        return filter(v);
      }

      if (filter instanceof RegExp) {
        return v.replace(filter, '');
      }

      return v;
    };

    // 비제어 모드에서만 사용하는 내부 값
    const [inputValue, setInputValue] = useState<string>(applyFilter(String(defaultValue ?? '')));

    /** 제어/비제어 분기 */
    const isControlled = value !== undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.currentTarget.value;

      const filteredValue = applyFilter(rawValue);

      // 비제어 모드라면 내부 상태 업데이트
      if (!isControlled && filteredValue !== inputValue) {
        setInputValue(filteredValue);
      }

      onChange?.(e, filteredValue);
    };

    /** 렌더링될 값(제어상태라면 value prop을 렌더링, 비제어상태라면 필터링된 내부 상태를 렌더링) */
    const renderedValue = isControlled ? String(value) : inputValue;

    /** 토글 버튼 표시 조건: password 타입이고 showPasswordToggle이 true일 때 */
    const shouldShowToggle = type === 'password' && showPasswordToggle;

    /** 실제 input type: 토글 상태에 따라 password ↔ text 변경 */
    const inputType = shouldShowToggle && isPasswordVisible ? 'text' : type;

    /** 컴포넌트 사이즈에 따른 아이콘 크기 매핑 */
    const getIconSize = (inputSize: ComponentSize): number => {
      const sizeMap: Record<ComponentSize, number> = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 22,
      };

      return sizeMap[inputSize];
    };

    /** 토글 버튼 클릭 핸들러 */
    const handleToggle = () => setIsPasswordVisible(!isPasswordVisible);

    // Map size to CVA-compatible size (xs maps to sm)
    const cvaSize = size === 'xs' ? 'sm' : size;

    return (
      <div className={cn(inputContainerStyles, className)}>
        <input
          ref={ref}
          value={renderedValue}
          onChange={handleChange}
          type={inputType}
          disabled={disabled}
          className={cn(
            inputVariants({
              size: cvaSize,
              error,
              success,
              disabled,
              hasToggle: shouldShowToggle,
            })
          )}
          aria-invalid={error ? 'true' : undefined}
          {...restProps}
        />

        {shouldShowToggle && (
          <button
            type="button"
            className={passwordToggleStyles()}
            onClick={handleToggle}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보이기'}
            disabled={disabled}
          >
            {isPasswordVisible ? (
              <ShowIcon variant="muted" size={getIconSize(size)} />
            ) : (
              <HideIcon variant="muted" size={getIconSize(size)} />
            )}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
export type { Props as InputProps };
