import type {
  AppliedFilterMap,
  FilterKeyWithValue,
} from './FilterSearch.types';
import { formatDateToISO } from '../../services/utils/dateUtils';

/**
 * 선택된 필터 키들을 API 파라미터로 변환
 * @returns API 요청에 사용할 파라미터 맵
 */
export const convertFiltersToApiParams = (
  selectedKeys: FilterKeyWithValue[]
): AppliedFilterMap => {
  const result: AppliedFilterMap = {};

  selectedKeys.forEach(key => {
    if (key.type === 'dateRange') {
      handleDateRangeFilter(key, result);
      return;
    }

    if (!key.value) return;

    if (key.type === 'number' && key.operator && key.operator !== 'eq') {
      result[`${key.key}_${key.operator}`] = key.value;
    } else if (
      key.type === 'input' ||
      key.type === 'select' ||
      (key.type === 'number' && key.operator === 'eq')
    ) {
      appendMultiValue(result, key.key, key.value);
    } else {
      result[key.key] = key.value;
    }
  });

  return result;
};

const handleDateRangeFilter = (
  key: FilterKeyWithValue,
  result: AppliedFilterMap
): void => {
  const today = new Date();
  const startDate = key.startDate;
  const endDate = key.endDate;

  if (!startDate && !endDate) return;

  const startKey = `${key.key}Gte`;
  const endKey = `${key.key}Lte`;

  result[startKey] = formatDateToISO(startDate || today);
  result[endKey] = formatDateToISO(endDate || today);
};

const appendMultiValue = (
  result: AppliedFilterMap,
  key: string,
  value: string
): void => {
  result[key] = result[key] ? `${result[key]},${value}` : value;
};

/**
 * 날짜 범위를 사용자에게 표시할 형식으로 변환
 * @returns "yyyy/mm/dd ~ yyyy/mm/dd" 형식의 문자열
 */
export const formatDateRangeDisplay = (
  startDate?: Date,
  endDate?: Date
): string => {
  if (!startDate && !endDate) return '';

  const formatWithSlash = (date: Date) =>
    formatDateToISO(date).replace(/-/g, '/');

  if (startDate && endDate) {
    return `${formatWithSlash(startDate)} ~ ${formatWithSlash(endDate)}`;
  }
  if (startDate) return `${formatWithSlash(startDate)} ~`;
  return `~ ${formatWithSlash(endDate!)}`;
};

/**
 * 고유한 필터 ID 생성
 * @param key - 필터 키 (예: "status", "name")
 * @returns 타임스탬프와 랜덤값을 포함한 고유 ID
 */
export const generateFilterId = (key: string): string => {
  return `${key}-${Date.now()}-${Math.random()}`;
};
