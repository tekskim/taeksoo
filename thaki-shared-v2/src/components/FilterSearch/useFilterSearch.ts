import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { FilterKeyWithValue, AppliedFilterMap } from './FilterSearch.types';
import { convertFiltersToApiParams } from './filterUtils';

export interface UseFilterSearchReturn {
  filters: FilterKeyWithValue[];
  appliedFilters: AppliedFilterMap;
  addFilter: (filter: FilterKeyWithValue) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
}

/**
 * useFilterSearch 훅
 *
 * FilterSearch의 상태 관리를 담당하는 커스텀 훅
 * FilterSearchInput과 FilterSearchResults를 연결하여 사용
 *
 * @param onFiltersChange - 필터 변경 시 호출되는 콜백 함수
 * @returns 필터 상태와 관리 함수들
 */
export const useFilterSearch = (
  onFiltersChange?: (filters: AppliedFilterMap) => void
): UseFilterSearchReturn => {
  const [filters, setFilters] = useState<FilterKeyWithValue[]>([]);
  const appliedFilters = useMemo(() => convertFiltersToApiParams(filters), [filters]);

  // Store callback in ref to avoid re-triggering useEffect on callback change
  const onFiltersChangeRef = useRef(onFiltersChange);
  onFiltersChangeRef.current = onFiltersChange;

  // 필터 추가
  const addFilter = useCallback((filter: FilterKeyWithValue): void => {
    setFilters((prev) => [...prev, filter]);
  }, []);

  // 필터 제거
  const removeFilter = useCallback((id: string): void => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // 모든 필터 제거
  const clearFilters = useCallback((): void => {
    setFilters([]);
  }, []);

  useEffect(() => {
    onFiltersChangeRef.current?.(appliedFilters);
  }, [appliedFilters]);

  return {
    filters,
    appliedFilters,
    addFilter,
    removeFilter,
    clearFilters,
  };
};
