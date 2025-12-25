import { useState, useMemo, useCallback } from 'react';
import type { TableColumn } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  locked?: boolean;
}

export interface UseTablePreferencesOptions<T> {
  /** All available columns */
  columns: TableColumn<T>[];
  /** Default column configurations */
  defaultColumnConfig: ColumnConfig[];
  /** Default rows per page */
  defaultRowsPerPage?: number;
}

export interface UseTablePreferencesReturn<T> {
  /** Filtered and ordered columns based on preferences */
  visibleColumns: TableColumn<T>[];
  /** Current column configurations */
  columnConfig: ColumnConfig[];
  /** Update column configurations */
  setColumnConfig: (config: ColumnConfig[]) => void;
  /** Current rows per page */
  rowsPerPage: number;
  /** Update rows per page */
  setRowsPerPage: (value: number) => void;
  /** Reset to default settings */
  resetToDefault: () => void;
  /** Get paginated data */
  getPaginatedData: <D>(data: D[], currentPage: number) => D[];
  /** Calculate total pages */
  getTotalPages: (totalItems: number) => number;
}

/* ----------------------------------------
   Hook
   ---------------------------------------- */

export function useTablePreferences<T>({
  columns,
  defaultColumnConfig,
  defaultRowsPerPage = 10,
}: UseTablePreferencesOptions<T>): UseTablePreferencesReturn<T> {
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Filter and order columns based on preferences
  const visibleColumns = useMemo(() => {
    const visibleColumnIds = columnConfig
      .filter((col) => col.visible)
      .map((col) => col.id);

    // Create a map for quick column lookup
    const columnMap = new Map(columns.map((col) => [col.key, col]));

    // Return columns in the order defined by columnConfig
    return visibleColumnIds
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumn<T> => col !== undefined);
  }, [columns, columnConfig]);

  // Reset to default
  const resetToDefault = useCallback(() => {
    setColumnConfig(defaultColumnConfig);
    setRowsPerPage(defaultRowsPerPage);
  }, [defaultColumnConfig, defaultRowsPerPage]);

  // Get paginated data
  const getPaginatedData = useCallback(
    <D>(data: D[], currentPage: number): D[] => {
      const startIndex = (currentPage - 1) * rowsPerPage;
      return data.slice(startIndex, startIndex + rowsPerPage);
    },
    [rowsPerPage]
  );

  // Calculate total pages
  const getTotalPages = useCallback(
    (totalItems: number): number => {
      return Math.ceil(totalItems / rowsPerPage);
    },
    [rowsPerPage]
  );

  return {
    visibleColumns,
    columnConfig,
    setColumnConfig,
    rowsPerPage,
    setRowsPerPage,
    resetToDefault,
    getPaginatedData,
    getTotalPages,
  };
}

export default useTablePreferences;


