import React, { useEffect, useMemo, useState } from 'react';
import {
  useDragAndDrop,
  type DragAndDropItem,
} from '../../services/hooks/useDragAndDrop';
import { cn } from '../../services/utils/cn';
import { Button } from '../Button';
import { Dropdown } from '../Dropdown';
import { OrderIcon, RefreshIcon } from '../Icon';
import Layout from '../Layout';
import { Overlay, type OverlayProps } from '../Overlay';
import { Typography } from '../Typography';

// ============= Table Column Types =============

/**
 * 테이블 컬럼 설정 인터페이스
 * Config 파일과 TableSettingDrawer에서 사용
 * 기본값: visible=true, draggable=true, fixed=false, align='left'
 */
export interface ColumnConfig {
  /** 컬럼 키 (고유 식별자) */
  key: string;
  /** 컬럼 헤더 라벨 */
  label: string;
  /** 가시성 여부 (기본값: true) */
  visible?: boolean;
  /** 드래그 가능 여부 (기본값: true) */
  draggable?: boolean;
  /** 고정 여부 - 드래그 불가, 항상 표시 (기본값: false) */
  fixed?: boolean;
  /** 컬럼 너비 (px) */
  width?: number;
  /** 텍스트 정렬 (기본값: 'left') */
  align?: 'left' | 'center' | 'right';
}

// Internal column data type (compatible with DragAndDropItem)
interface InternalColumnConfig extends ColumnConfig, DragAndDropItem {}

// Convert ColumnConfig to DragAndDropItem
const columnToDragItem = (column: ColumnConfig): InternalColumnConfig => ({
  visible: true,
  draggable: true,
  fixed: false,
  align: 'left',
  ...column,
  id: column.key,
});

// Table settings data interface
export interface TableSettings {
  rowsPerPage: number;
  columns: InternalColumnConfig[];
}

// TableSettingDrawer Props
export interface TableSettingDrawerProps extends OverlayProps {
  /** Initial column configuration */
  defaultColumns: ColumnConfig[];
  /** Initial rows per page (default: 10) */
  defaultRowsPerPage?: number;
  /** Rows per page options (default: [10, 20, 50, 100]) */
  rowsPerPageOptions?: { value: number; label: string }[];
  /** Whether the save operation is pending */
  isPending?: boolean;
}

const DEFAULT_ROWS_PER_PAGE = 10;
const DEFAULT_ROWS_PER_PAGE_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

// Tailwind styles
const styles = {
  drawerContent: 'w-full min-w-[344px]',
  labelSection: 'flex flex-col gap-sm',
  labelText: 'text-14 font-medium leading-20 text-text',
  columnsSection: 'flex flex-col gap-md',
  columnsHeader: 'flex items-center justify-between',
  resetButton:
    'flex items-center gap-1.5 text-primary cursor-pointer bg-transparent border-none p-0 hover:underline',
  resetText: 'text-12 font-medium leading-16 text-primary',
  columnsContainer: 'flex flex-col gap-3 max-h-[500px] overflow-y-auto',
  columnRow:
    'flex items-center justify-between min-w-[80px] py-2 px-2.5 border border-border-strong rounded-base6 bg-surface transition-all duration-200',
  columnRowFixed: 'bg-surface border-border-muted',
  columnRowDragging: 'opacity-60 cursor-grabbing',
  columnRowDragOver: 'border-primary bg-surface-hover',
  columnContent: 'flex items-center gap-1.5',
  dragHandle: 'flex items-center justify-center transition-opacity duration-200',
  dragHandleDraggable: 'cursor-grab active:cursor-grabbing',
  dragHandleDisabled: 'cursor-not-allowed opacity-50',
  columnLabel: 'text-12 font-medium leading-16 text-text whitespace-nowrap',
  footer: 'flex justify-center items-center w-full gap-2 px-6 py-4',
  footerButton: 'min-w-20 w-[152px] py-2 px-3 text-12 font-medium leading-16',
} as const;

export const TableSettingDrawer: React.FC<TableSettingDrawerProps> = ({
  defaultColumns,
  defaultRowsPerPage = DEFAULT_ROWS_PER_PAGE,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  isPending = false,
  onConfirm,
  onCancel,
  ...props
}): React.ReactElement => {
  // Initial settings
  const initialSettings = useMemo<TableSettings>(() => {
    return {
      rowsPerPage: defaultRowsPerPage,
      columns: defaultColumns.map(columnToDragItem),
    };
  }, [defaultColumns, defaultRowsPerPage]);

  // Frontend default settings (for Reset to default)
  const frontendDefaultSettings = useMemo<TableSettings>(() => {
    return {
      rowsPerPage: defaultRowsPerPage,
      columns: defaultColumns.map(columnToDragItem),
    };
  }, [defaultColumns, defaultRowsPerPage]);

  // State management
  const [settings, setSettings] = useState<TableSettings>(initialSettings);

  // Update state when server settings change
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  // Column reorder handler
  const handleColumnReorder = (fromIndex: number, toIndex: number): void => {
    setSettings(prev => {
      const newColumns = [...prev.columns];
      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);
      return { ...prev, columns: newColumns };
    });
  };

  // Drag and drop hook
  const dragAndDrop = useDragAndDrop({
    items: settings.columns,
    onReorder: handleColumnReorder,
  });

  // Reset to default (frontend default settings)
  const resetToDefault = (): void => {
    setSettings(frontendDefaultSettings);
  };

  // Save settings
  const handleSave = (): void => {
    onConfirm?.(settings);
  };

  return (
    <Overlay.Template
      {...props}
      onConfirm={handleSave}
      onCancel={onCancel}
      footer={
        <div className={styles.footer}>
          <Button
            variant="muted"
            appearance="outline"
            onClick={onCancel}
            className={styles.footerButton}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isPending}
            className={styles.footerButton}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      }
    >
      <Layout.VStack gap="lg" className={styles.drawerContent}>
        {/* Rows per page setting */}
        <Layout.VStack gap="sm" className={styles.labelSection}>
          <Typography.Text className={styles.labelText}>
            Rows per page
          </Typography.Text>
          <Dropdown.Select
            value={settings.rowsPerPage}
            onChange={value =>
              setSettings(prev => ({
                ...prev,
                rowsPerPage: Number(value),
              }))
            }
            size="sm"
          >
            {rowsPerPageOptions.map(option => (
              <Dropdown.Option
                key={option.value}
                value={option.value}
                label={option.label}
              />
            ))}
          </Dropdown.Select>
        </Layout.VStack>

        {/* Attribute Columns setting */}
        <Layout.VStack gap="md" className={styles.columnsSection}>
          <Layout.HStack
            align="center"
            justify="between"
            className={styles.columnsHeader}
          >
            <Typography.Text className={styles.labelText}>
              Attribute Columns
            </Typography.Text>
            <button
              onClick={resetToDefault}
              className={styles.resetButton}
              type="button"
            >
              <RefreshIcon variant="primary" size="xs" />
              <Typography.Text className={styles.resetText}>
                Reset to default
              </Typography.Text>
            </button>
          </Layout.HStack>

          <Layout.VStack gap="sm" className={styles.columnsContainer}>
            {settings.columns.map((column, index) => (
              <div
                key={column.key}
                draggable={dragAndDrop.canDragItem(index)}
                onDragStart={e => dragAndDrop.handleDragStart(e, index)}
                onDragOver={e => dragAndDrop.handleDragOver(e, index)}
                onDragLeave={e => {
                  // Check if actually left the element (ignore child element movements)
                  if (
                    e.currentTarget === e.target ||
                    !e.currentTarget.contains(e.relatedTarget as Node)
                  ) {
                    dragAndDrop.handleDragLeave();
                  }
                }}
                onDrop={e => dragAndDrop.handleDrop(e, index)}
                onDragEnd={dragAndDrop.handleDragEnd}
                className={cn(
                  styles.columnRow,
                  column.fixed && styles.columnRowFixed,
                  dragAndDrop.isDragging(index) && styles.columnRowDragging,
                  dragAndDrop.isDragOver(index) && styles.columnRowDragOver
                )}
              >
                <div className={styles.columnContent}>
                  {/* Drag handle (only for non-fixed columns) */}
                  {!column.fixed && (
                    <div
                      className={cn(
                        styles.dragHandle,
                        dragAndDrop.canDragItem(index)
                          ? styles.dragHandleDraggable
                          : styles.dragHandleDisabled
                      )}
                      title="Drag to reorder"
                    >
                      <OrderIcon variant="secondary" size="xs" />
                    </div>
                  )}

                  {/* Column name */}
                  <Typography.Text className={styles.columnLabel}>
                    {column.label}
                  </Typography.Text>
                </div>

              </div>
            ))}
          </Layout.VStack>
        </Layout.VStack>
      </Layout.VStack>
    </Overlay.Template>
  );
};

export default TableSettingDrawer;
