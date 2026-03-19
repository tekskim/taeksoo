/** 날짜 범위 타입 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/** 날짜 선택 값 (single: Date, range: DateRange) */
export type DatePickerValue = Date | DateRange | undefined;

interface DatePickerBaseProps {
  /**
   * Cancel 버튼 클릭 시 호출되는 콜백
   */
  onCancel?: () => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;

  /**
   * 표시할 월 개수 (기본값: 1)
   */
  numberOfMonths?: number;

  /**
   * Apply 버튼 로딩 상태 (기본값: false)
   */
  isLoading?: boolean;

  /**
   * 선택 가능한 최소 날짜 (이 날짜 이전은 선택 불가)
   */
  minDate?: Date;

  /**
   * 선택 가능한 최대 날짜 (이 날짜 이후는 선택 불가)
   */
  maxDate?: Date;

  /**
   * 오늘 이후 날짜 선택 방지 (기본값: true)
   */
  preventFutureSet?: boolean;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  /**
   * 선택 모드: 단일 날짜
   */
  mode: 'single';

  /**
   * 선택된 날짜
   */
  value?: Date;

  /**
   * 날짜 변경 시 호출되는 콜백
   */
  onChange?: (date: Date | undefined) => void;

  /**
   * Apply 버튼 클릭 시 호출되는 콜백
   */
  onApply?: (date: Date | undefined) => void;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  /**
   * 선택 모드: 날짜 범위 (기본값)
   */
  mode?: 'range';

  /**
   * 선택된 날짜 범위
   */
  value?: DateRange;

  /**
   * 날짜 범위 변경 시 호출되는 콜백
   */
  onChange?: (range: DateRange | undefined) => void;

  /**
   * Apply 버튼 클릭 시 호출되는 콜백
   */
  onApply?: (range: DateRange | undefined) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;
