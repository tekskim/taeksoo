import React, {
  CSSProperties,
  ReactNode,
  forwardRef,
  ReactElement,
  useContext,
  useId,
  useState,
} from 'react';
import { cn } from '../../services/utils/cn';
import {
  controlStyles,
  descriptionStyles,
  errorStyles,
  formFieldVariants,
  hintStyles,
  labelVariants,
  messageAreaStyles,
  requiredIndicatorStyles,
  successStyles,
} from './FormField.styles';

// FieldsetContext에서 상태를 받아오기 위한 인터페이스
interface FieldsetContextValue {
  disabled?: boolean;
  error?: string;
  requiredIndicator?: 'asterisk' | 'text' | 'none';
}

const FieldsetContext = React.createContext<FieldsetContextValue | null>(null);

export const useFieldsetContext = (): FieldsetContextValue => {
  return useContext(FieldsetContext) || {};
};

export interface FormFieldProps {
  /** 폼 필드의 라벨 텍스트 (필수) */
  label: string;
  /** 필수 필드 여부 표시 */
  required?: boolean;
  /** 도움말 텍스트 */
  hint?: string;
  /** 에러 메시지 (유효성 검사 결과) */
  error?: string;
  /** 성공 메시지 */
  success?: string;
  /** 라벨과 입력 사이에 추가 설명 요소 */
  description?: ReactNode;
  /** 단일 폼 컨트롤 요소 (필수) */
  children: ReactElement<Record<string, unknown>>;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 인라인 스타일 */
  style?: CSSProperties;
  /** 비활성화 상태 */
  disabled?: boolean;
}

/**
 * [Design System] 폼 필드 컴포넌트
 *
 * 라벨, 입력 컨트롤, 에러/힌트 메시지를 통합 관리하는 폼 필드 래퍼입니다.
 * 접근성(ARIA)을 자동으로 처리합니다.
 *
 * @example
 * // 기본 사용법
 * <FormField label="이름" required>
 *   <Input placeholder="이름을 입력하세요" />
 * </FormField>
 *
 * @example
 * // 에러 상태
 * <FormField label="이메일" required error="올바른 이메일 형식이 아닙니다">
 *   <Input type="email" error />
 * </FormField>
 *
 * @example
 * // 힌트 메시지
 * <FormField label="비밀번호" hint="8자 이상, 특수문자 포함">
 *   <Input type="password" showPasswordToggle />
 * </FormField>
 *
 * @example
 * // 성공 상태
 * <FormField label="사용자명" success="사용 가능한 사용자명입니다">
 *   <Input value={username} success />
 * </FormField>
 *
 * @example
 * // 설명 추가
 * <FormField
 *   label="프로젝트"
 *   required
 *   description="이 설정은 나중에 변경할 수 없습니다."
 * >
 *   <Dropdown.Select placeholder="프로젝트 선택">
 *     {projects.map(p => <Dropdown.Option key={p.id} value={p.id} label={p.name} />)}
 *   </Dropdown.Select>
 * </FormField>
 *
 * @example
 * // Textarea와 함께
 * <FormField label="설명" error={errors.description}>
 *   <Textarea rows={4} maxLength={500} showCharacterCount error={Boolean(errors.description)} />
 * </FormField>
 *
 * @param label - 라벨 텍스트 (필수)
 * @param required - 필수 필드 표시
 * @param hint - 도움말 텍스트
 * @param error - 에러 메시지
 * @param success - 성공 메시지
 * @param description - 라벨과 입력 사이 추가 설명
 * @param disabled - 비활성화 상태
 * @param children - 단일 폼 컨트롤 요소 (Input, Textarea, Dropdown 등)
 * @param className - 추가 CSS 클래스
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      required = false,
      hint,
      error,
      success,
      description,
      children,
      className,
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const fieldId = useId();
    const messageId = `${fieldId}-message`;
    const [isFocused, setIsFocused] = useState(false);

    // Fieldset Context에서 상태 가져오기
    const fieldsetContext = useFieldsetContext();
    const isDisabled = disabled || fieldsetContext.disabled;
    const finalError = error || fieldsetContext.error;
    const requiredIndicator = fieldsetContext.requiredIndicator || 'asterisk';

    // aria-describedby 자동 구성 - 메시지가 있는 경우에만
    const hintId = `${fieldId}-hint`;
    const hasErrorOrSuccess = Boolean(finalError) || Boolean(success);
    const describedBy =
      [hint ? hintId : null, hasErrorOrSuccess ? messageId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    // children에 props 주입 (ID, ARIA 속성들 자동 연결)
    // void elements (input, img, br 등)는 children을 가질 수 없으므로 안전하게 처리
    const { children: _, ...safeChildProps } = children.props || {};
    const childProps = {
      id: fieldId,
      'aria-describedby': describedBy,
      'aria-invalid': finalError ? 'true' : undefined,
      disabled: isDisabled,
      onFocus: (e: React.FocusEvent) => {
        setIsFocused(true);
        if (typeof safeChildProps.onFocus === 'function') {
          safeChildProps.onFocus(e);
        }
      },
      onBlur: (e: React.FocusEvent) => {
        setIsFocused(false);
        if (typeof safeChildProps.onBlur === 'function') {
          safeChildProps.onBlur(e);
        }
      },
      ...safeChildProps, // children prop을 제외한 기존 props
    };

    // React.cloneElement를 사용하되, children prop을 전달하지 않음
    const enhancedChild = React.isValidElement(children)
      ? React.cloneElement(children, childProps)
      : children;

    const renderRequiredIndicator = (): React.ReactNode => {
      if (!required) return null;

      switch (requiredIndicator) {
        case 'asterisk':
          return (
            <span className={requiredIndicatorStyles} aria-label="필수">
              *
            </span>
          );
        case 'text':
          return (
            <span className={requiredIndicatorStyles} aria-label="필수 입력">
              (필수)
            </span>
          );
        case 'none':
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          formFieldVariants({
            disabled: isDisabled,
            error: Boolean(finalError),
            success: Boolean(success),
          }),
          className
        )}
        style={style}
        {...props}
      >
        {/* Label */}
        <label
          htmlFor={fieldId}
          className={labelVariants({
            disabled: isDisabled,
            error: Boolean(finalError),
            success: Boolean(success) && !finalError,
            focused: isFocused && !finalError,
          })}
        >
          <span>{label}</span>
          {renderRequiredIndicator()}
        </label>

        {description ? (
          <div className={descriptionStyles}>{description}</div>
        ) : null}

        {/* Form Control */}
        <div className={controlStyles}>{enhancedChild}</div>

        {/* Message Area - Error/Success 메시지만 표시 */}
        {hasErrorOrSuccess && (
          <div className={messageAreaStyles}>
            {finalError ? (
              <p id={messageId} className={errorStyles} role="alert">
                {finalError}
              </p>
            ) : (
              <p id={messageId} className={successStyles}>
                {success}
              </p>
            )}
          </div>
        )}

        {/* Hint - error가 없을 때만 표시 */}
        {hint && !finalError && (
          <p id={hintId} className={hintStyles}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

// Context도 함께 export
export { FieldsetContext };
