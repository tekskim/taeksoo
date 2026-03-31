/** 필터 입력 타입 */
export type FilterType = 'select' | 'input' | 'number' | 'date' | 'dateRange';

/** 필터 키 설정 */
export interface FilterKey {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  placeholder?: string;
  /** 날짜 필터에서 선택 가능한 최소 날짜 (date, dateRange 타입에서 사용) */
  minDate?: Date;
  /** 날짜 필터에서 선택 가능한 최대 날짜 (date, dateRange 타입에서 사용) */
  maxDate?: Date;
  /** 날짜 필터에서 미래 날짜 선택 방지 여부 (기본값: true) */
  preventFutureSet?: boolean;
}

/** 선택형 필터 옵션 */
export interface FilterOption {
  value: string;
  label: string;
}

/** 적용된 필터 (Deprecated: FilterKeyWithValue 사용) */
export interface AppliedFilter {
  key: string;
  label: string;
  value: string;
  displayValue: string;
  type: FilterType;
}

/** API 파라미터 맵 */
export interface AppliedFilterMap {
  [key: string]: string;
}

/** 필터 키와 값을 포함한 타입 */
export interface FilterKeyWithValue extends FilterKey {
  id?: string;
  value?: string;
  operator?: 'gte' | 'lte' | 'eq';
  displayValue?: string;
  startDate?: Date;
  endDate?: Date;
}
