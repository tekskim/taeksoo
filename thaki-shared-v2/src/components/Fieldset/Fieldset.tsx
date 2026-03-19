import React, { FieldsetHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../services/utils/cn';
import { FieldsetContext } from '../FormField';
import {
  contentVariants,
  descriptionStyles,
  errorMessageStyles,
  fieldsetVariants,
  legendVariants,
} from './Fieldset.styles';

export interface FieldsetProps
  extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** 그룹의 제목 (필수) - <legend> 태그로 렌더링됩니다 */
  legend: string;
  /** 그룹에 대한 추가적인 설명 (선택사항) */
  description?: ReactNode;
  /** 그룹 전체에 대한 유효성 검사 오류 메시지 (선택사항) */
  error?: ReactNode;
  /** 그룹 전체 비활성화 여부 */
  disabled?: boolean;
  /** 시각적 변형 */
  variant?: 'default' | 'bordered' | 'elevated';
  /** 그룹 내 필드들의 배치 방향 */
  direction?: 'vertical' | 'horizontal';
  /** 필수 필드 표시 방식 */
  requiredIndicator?: 'asterisk' | 'text' | 'none';
}

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  (
    {
      legend,
      description,
      error,
      disabled = false,
      variant = 'default',
      direction = 'vertical',
      requiredIndicator = 'asterisk',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const fieldsetId = React.useId();
    const descriptionId = description ? `${fieldsetId}-description` : undefined;
    const errorId = error ? `${fieldsetId}-error` : undefined;

    // Context 값 - 하위 FormField들에게 전파될 상태
    const contextValue = React.useMemo(
      () => ({
        disabled,
        error: typeof error === 'string' ? error : undefined,
        requiredIndicator,
      }),
      [disabled, error, requiredIndicator]
    );

    return (
      <FieldsetContext.Provider value={contextValue}>
        <fieldset
          ref={ref}
          className={cn(
            fieldsetVariants({
              variant,
              disabled,
              error: Boolean(error),
            }),
            className
          )}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            [descriptionId, errorId].filter(Boolean).join(' ') || undefined
          }
          {...props}
        >
          <legend
            className={legendVariants({
              error: Boolean(error),
              disabled,
            })}
          >
            {legend}
          </legend>

          {description && (
            <div id={descriptionId} className={descriptionStyles}>
              {description}
            </div>
          )}

          <div className={contentVariants({ direction })}>{children}</div>

          {error && (
            <div id={errorId} className={errorMessageStyles} role="alert">
              {error}
            </div>
          )}
        </fieldset>
      </FieldsetContext.Provider>
    );
  }
);

Fieldset.displayName = 'Fieldset';
