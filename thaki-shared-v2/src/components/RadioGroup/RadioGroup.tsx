import { cn } from '../../services/utils/cn';
import { RadioButton } from '../RadioButton';
import {
  radioGroupStyles,
  radioGroupLegendStyles,
  radioGroupRequiredStyles,
  radioGroupErrorStyles,
} from './RadioGroup.styles';
import { RadioGroupProps } from './RadioGroup.types';

/**
 * [Design System] 라디오 그룹 컴포넌트
 *
 * 여러 옵션 중 하나를 선택하는 라디오 버튼 그룹입니다.
 *
 * @example
 * // 기본 사용법
 * <RadioGroup
 *   name="size"
 *   options={[
 *     { value: 'small', label: 'Small' },
 *     { value: 'medium', label: 'Medium' },
 *     { value: 'large', label: 'Large' },
 *   ]}
 *   selectedValue={size}
 *   onChange={setSize}
 * />
 *
 * @example
 * // 수평 배치
 * <RadioGroup
 *   name="status"
 *   direction="horizontal"
 *   options={[
 *     { value: 'active', label: '활성' },
 *     { value: 'inactive', label: '비활성' },
 *   ]}
 *   selectedValue={status}
 *   onChange={setStatus}
 * />
 *
 * @example
 * // 비활성화된 옵션 포함
 * <RadioGroup
 *   name="plan"
 *   legend="요금제 선택"
 *   required
 *   options={[
 *     { value: 'free', label: 'Free' },
 *     { value: 'pro', label: 'Pro' },
 *     { value: 'enterprise', label: 'Enterprise', disabled: true },
 *   ]}
 *   selectedValue={plan}
 *   onChange={setPlan}
 * />
 *
 * @example
 * // 에러 메시지 표시
 * <RadioGroup
 *   name="agreement"
 *   options={agreementOptions}
 *   selectedValue={agreement}
 *   onChange={setAgreement}
 *   errorMessage="필수 선택 항목입니다"
 * />
 *
 * @param name - 라디오 그룹 이름 (필수)
 * @param options - 옵션 배열 ({ value, label, disabled? })
 * @param selectedValue - 선택된 값
 * @param onChange - 값 변경 콜백
 * @param legend - 필드셋 레전드 텍스트
 * @param required - 필수 여부 표시
 * @param disabled - 전체 비활성화
 * @param direction - 배치 방향 ('vertical' | 'horizontal')
 * @param errorMessage - 에러 메시지
 * @param renderOption - 커스텀 옵션 렌더 함수
 */
export const RadioGroup = ({
  name,
  options,
  selectedValue,
  legend,
  required,
  disabled = false,
  direction = 'vertical',
  errorMessage,
  onChange,
  renderOption,
}: RadioGroupProps) => {
  return (
    <fieldset
      className={cn(radioGroupStyles({ direction, disabled }))}
      disabled={disabled}
    >
      {legend && (
        <legend className={radioGroupLegendStyles}>
          {required && <span className={radioGroupRequiredStyles}> *</span>}
          {legend}
        </legend>
      )}
      {options.map(option => {
        const isSelected = selectedValue === option.value;

        // renderOption이 제공되면 커스텀 렌더링 사용
        if (renderOption) {
          return renderOption(option, isSelected, onChange);
        }

        // 기본 RadioButton 렌더링
        return (
          <RadioButton
            key={option.value}
            name={name}
            label={option.label}
            value={option.value}
            checked={isSelected}
            onChange={() => onChange(option.value)}
            disabled={disabled || option.disabled}
          />
        );
      })}
      {errorMessage && (
        <div className={radioGroupErrorStyles}>{errorMessage}</div>
      )}
    </fieldset>
  );
};
