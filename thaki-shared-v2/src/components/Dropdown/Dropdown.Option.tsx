import { cn } from '../../services/utils/cn';
import { dropdownOptionStyles } from './Dropdown.styles';
import { BasicOptionProps, OptionProps } from './Dropdown.types';

/**
 * @description
 * OptionPlaceholder 컴포넌트는 드롭다운 옵션의 플레이스홀더 역할을 하는 컴포넌트입니다.
 * 실제로는 렌더링되지 않으며, 타입 체크 및 옵션 구조 정의를 위해 사용됩니다.
 *
 * @param _props - 기본 옵션 속성들 (실제로는 사용되지 않음)
 * @returns null (렌더링되지 않음)
 */
const OptionPlaceholder = (_props: BasicOptionProps): null => null;

/** Static identifier for Module Federation compatibility */
OptionPlaceholder.displayName = 'Dropdown.Option';

/** Type guard to check if a component is OptionPlaceholder */
export const isOptionPlaceholder = (type: unknown): type is typeof OptionPlaceholder => {
  return (
    typeof type === 'function' &&
    (type as { displayName?: string }).displayName === 'Dropdown.Option'
  );
};

/**
 * @description
 * Dropdown.Option 컴포넌트는 드롭다운 내부의 개별 옵션을 나타내는 컴포넌트입니다.
 * Dropdown.Select 및 Dropdown.ComboBox 컴포넌트의 자식으로 사용됩니다.
 *
 * 주요 기능:
 * - 드롭다운 내부의 선택 가능한 옵션을 제공합니다.
 * - 선택, 포커스, 비활성화 상태를 지원합니다.
 * - 웹 접근성 표준을 준수합니다.
 *
 * @param label - 옵션에 표시될 텍스트
 * @param value - 옵션의 값
 * @param selected - 선택된 상태 여부 (기본값: false)
 * @param focused - 포커스된 상태 여부 (기본값: false)
 * @param disabled - 비활성화 상태 여부 (기본값: false)
 * @param onClick - 옵션 클릭 시 호출되는 콜백 함수
 * @returns 드롭다운 옵션 컴포넌트
 */
const Option = ({ id, index, value, label, selected, focused, disabled, onClick }: OptionProps) => {
  return (
    <li
      id={id}
      data-option-index={index}
      className={cn(
        dropdownOptionStyles({ focused, disabled }),
        'dropdown-option',
        focused && 'focused',
        disabled && 'disabled'
      )}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();

          return;
        }

        onClick?.(value);
      }}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      aria-label={`옵션: ${label}`}
      tabIndex={disabled ? undefined : -1}
    >
      {label}
    </li>
  );
};

export default Option;
export { OptionPlaceholder };
