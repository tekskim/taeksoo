import { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import type { SelectionType } from './Table.types';

interface UseTableSelectionProps<TData> {
  rows: TData[];
  getRowId?: (row: TData, index: number) => string | number;
  selectedRows?: (string | number)[];
  onRowSelectionChange?: (selectedRowIds: (string | number)[]) => void;
  selectionType?: SelectionType;
  isRowDisabled?: (row: TData, index: number) => boolean;
  radioGroupName?: string;
}

export const useTableSelection = <TData extends Record<string, unknown>>({
  rows,
  getRowId,
  selectedRows = [],
  onRowSelectionChange,
  selectionType,
  isRowDisabled,
  radioGroupName,
}: UseTableSelectionProps<TData>) => {
  const hasSelection = Boolean(selectionType);
  const selectedRowsSet = useMemo(() => new Set(selectedRows), [selectedRows]);

  // Helper to resolve row ID safely
  const getResolvedRowId = useCallback(
    (row: TData, index: number): string | number => {
      const fallback = (row.id as string | number | undefined) ?? String(index);
      if (!getRowId) {
        return fallback;
      }
      const candidate = getRowId(row, index);
      return candidate === undefined || candidate === null || candidate === ''
        ? fallback
        : candidate;
    },
    [getRowId]
  );

  // Get all enabled (non-disabled) row IDs on current page
  const currentPageIds = useMemo(() => {
    return rows
      .map((row, index) => ({
        row,
        index,
        id: getResolvedRowId(row, index),
      }))
      .filter(({ row, index }) => !isRowDisabled?.(row, index))
      .map(({ id }) => id);
  }, [rows, getResolvedRowId, isRowDisabled]);

  // Set version for O(1) lookup
  const currentPageIdSet = useMemo(
    () => new Set(currentPageIds),
    [currentPageIds]
  );

  // isAllSelected: true only when all enabled rows on current page are selected
  const isAllSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every(id => selectedRowsSet.has(id));

  // Radio group name generation
  const generatedRadioGroupName = useId();
  const resolvedRadioGroupName = useMemo(() => {
    if (selectionType !== 'radio') return '';
    if (radioGroupName) return radioGroupName;
    return `table-selection-${generatedRadioGroupName.replace(/[:]/g, '')}`;
  }, [selectionType, radioGroupName, generatedRadioGroupName]);

  // Keep latest selectedRows in ref for handlers
  const selectedRowsRef = useRef(selectedRows);
  useEffect(() => {
    selectedRowsRef.current = selectedRows;
  }, [selectedRows]);

  const handleRowSelection = useCallback(
    (
      rowId: string | number,
      selected: boolean,
      row?: TData,
      index?: number
    ) => {
      if (!onRowSelectionChange) return;

      // disabled check
      if (isRowDisabled && row !== undefined && index !== undefined) {
        if (isRowDisabled(row, index)) return;
      }

      if (selectionType === 'radio') {
        if (selected) {
          onRowSelectionChange([rowId]);
        } else {
          onRowSelectionChange([]);
        }
      } else {
        const newSelectedRows = new Set(selectedRowsRef.current);
        if (selected) {
          newSelectedRows.add(rowId);
        } else {
          newSelectedRows.delete(rowId);
        }
        onRowSelectionChange(Array.from(newSelectedRows));
      }
    },
    [onRowSelectionChange, selectionType, isRowDisabled]
  );

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (!onRowSelectionChange || selectionType !== 'checkbox') return;

      // Keep selections from other pages, only modify current page
      const otherPageSelections = selectedRowsRef.current.filter(
        id => !currentPageIdSet.has(id)
      );

      const newSelection = selected
        ? [...otherPageSelections, ...currentPageIds]
        : otherPageSelections;

      onRowSelectionChange(newSelection);
    },
    [currentPageIds, currentPageIdSet, onRowSelectionChange, selectionType]
  );

  return {
    hasSelection,
    selectedRowsSet,
    isAllSelected,
    resolvedRadioGroupName,
    getResolvedRowId,
    handleRowSelection,
    handleSelectAll,
  };
};
