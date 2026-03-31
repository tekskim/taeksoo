import React, { forwardRef, useCallback, useState } from 'react';
import { cn } from '../../services/utils/cn';
import {
  characterCountVariants,
  textareaContainerStyles,
  textareaVariants,
} from './Textarea.styles';

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size' | 'children'
> {
  error?: boolean;
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoResize?: boolean;
  showCharacterCount?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * [Design System] 텍스트 영역 컴포넌트
 *
 * 여러 줄 텍스트 입력을 위한 컴포넌트입니다.
 *
 * @example
 * // 기본 사용법
 * <Textarea
 *   placeholder="설명을 입력하세요"
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 * />
 *
 * @example
 * // 글자 수 제한 및 카운터 표시
 * <Textarea
 *   maxLength={500}
 *   showCharacterCount
 *   placeholder="최대 500자까지 입력 가능"
 * />
 *
 * @example
 * // 자동 높이 조절
 * <Textarea autoResize placeholder="내용에 따라 높이가 조절됩니다" />
 *
 * @example
 * // 에러 상태
 * <Textarea error placeholder="필수 입력 항목입니다" />
 *
 * @example
 * // FormField와 함께 사용
 * <FormField label="비고" error={errors.note}>
 *   <Textarea
 *     error={Boolean(errors.note)}
 *     rows={5}
 *     maxLength={1000}
 *     showCharacterCount
 *   />
 * </FormField>
 *
 * @param error - 에러 상태 여부
 * @param success - 성공 상태 여부
 * @param size - 크기 ('sm' | 'md' | 'lg')
 * @param resize - 리사이즈 옵션 ('none' | 'vertical' | 'horizontal' | 'both')
 * @param autoResize - 자동 높이 조절 여부
 * @param showCharacterCount - 글자 수 표시 여부
 * @param rows - 기본 행 수 (기본값: 3)
 * @param maxLength - 최대 글자 수
 * @param disabled - 비활성화 상태
 * @param className - 추가 CSS 클래스
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      success,
      size = 'md',
      resize = 'vertical',
      autoResize = false,
      showCharacterCount = false,
      className,
      rows = 3,
      maxLength,
      onChange,
      defaultValue,
      value,
      disabled,
      ...restProps
    },
    ref
  ) => {
    // 내부 state (uncontrolled 모드용)
    const [internalValue, setInternalValue] = useState(defaultValue?.toString() || '');

    // 현재 값 계산 (controlled vs uncontrolled)
    const currentValue = value !== undefined ? value.toString() : internalValue;

    // 자동 리사이즈 핸들러
    const handleAutoResize = useCallback(
      (textarea: HTMLTextAreaElement) => {
        if (autoResize) {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      },
      [autoResize]
    );

    // onChange 핸들러 (debounce 포함)
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        // 즉시 실행: UI 반응성을 위해
        if (value === undefined) {
          // uncontrolled 모드에서만 내부 state 업데이트
          setInternalValue(newValue);
        }

        if (autoResize) {
          handleAutoResize(e.target); // 자동 리사이즈도 즉시
        }

        // onChange 즉시 실행
        onChange?.(e);
      },
      [value, autoResize, handleAutoResize, onChange]
    );

    // ref 콜백으로 초기 자동 리사이즈 설정 및 cleanup 처리
    const textareaRef = useCallback(
      (textarea: HTMLTextAreaElement | null) => {
        if (textarea && autoResize) {
          handleAutoResize(textarea);
        }

        if (ref) {
          if (typeof ref === 'function') {
            ref(textarea);
          } else {
            ref.current = textarea;
          }
        }
      },
      [ref, autoResize, handleAutoResize]
    );

    // 글자 수 계산
    const currentLength = currentValue.length;
    const isNear = maxLength ? currentLength > maxLength * 0.9 : false;
    const isOver = maxLength ? currentLength > maxLength : false;

    return (
      <div className={textareaContainerStyles}>
        <textarea
          ref={textareaRef}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            textareaVariants({
              size,
              error,
              success,
              disabled,
              resize: autoResize ? undefined : resize,
              autoResize,
            }),
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          onChange={handleChange}
          value={currentValue}
          {...restProps}
        />

        {showCharacterCount && maxLength && (
          <div className={characterCountVariants({ near: isNear, over: isOver })}>
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
