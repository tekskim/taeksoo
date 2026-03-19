import { useState } from 'react';
import { cn } from '../../services/utils/cn';
import {
  toggleWrapperStyles,
  toggleInputStyles,
  toggleTrackStyles,
  toggleThumbStyles,
  toggleLabelStyles,
} from './Toggle.styles';

interface Props {
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 체크 상태 (controlled) */
  checked?: boolean;
  /** input name 속성 */
  name?: string;
  /** 기본 체크 상태 (uncontrolled) */
  defaultChecked?: boolean;
  /** 체크된 상태일 때 표시할 라벨 */
  checkedLabel?: string;
  /** 체크되지 않은 상태일 때 표시할 라벨 */
  uncheckedLabel?: string;
  /** 체크 상태 변경 핸들러 */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * [Design System] 토글 스위치 컴포넌트
 *
 * On/Off 상태를 시각적으로 표현하는 스위치입니다.
 *
 * @example
 * // 기본 토글
 * <Toggle checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
 *
 * @example
 * // 라벨과 함께 사용
 * <Toggle
 *   checked={notifications}
 *   onChange={(e) => setNotifications(e.target.checked)}
 *   checkedLabel="알림 켜짐"
 *   uncheckedLabel="알림 꺼짐"
 * />
 *
 * @example
 * // 비활성화 상태
 * <Toggle disabled checked={false} />
 *
 * @example
 * // 비제어 모드
 * <Toggle defaultChecked name="autoSave" />
 */
const Toggle = ({
  className,
  defaultChecked = false,
  disabled = false,
  checked,
  name,
  checkedLabel,
  uncheckedLabel,
  onChange,
}: Props): React.ReactElement => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newChecked = e.target.checked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onChange?.(e);
  };

  const displayLabel = currentChecked ? checkedLabel : uncheckedLabel;

  return (
    <label className={cn(toggleWrapperStyles, className)}>
      <input
        className={toggleInputStyles}
        type="checkbox"
        name={name}
        disabled={disabled}
        checked={currentChecked}
        aria-label={`${name || 'toggle'} ${currentChecked ? 'on' : 'off'}`}
        onChange={handleChange}
      />
      <div className={toggleTrackStyles}>
        <div className={toggleThumbStyles} />
      </div>
      {displayLabel && <span className={toggleLabelStyles}>{displayLabel}</span>}
    </label>
  );
};

export default Toggle;
