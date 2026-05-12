import { type TableColumn } from '@/design-system';
import { IconTrash, IconDotsCircleHorizontal } from '@tabler/icons-react';

/**
 * Reusable column presets for AI Platform table pages.
 * Use these to avoid repeating common column definitions.
 */

export function nameColumn<T>(options?: {
  label?: string;
  minWidth?: string;
  render?: TableColumn<T>['render'];
}): TableColumn<T> {
  return {
    key: 'name',
    label: options?.label ?? 'Name',
    sortable: true,
    minWidth: options?.minWidth ?? '160px',
    render: options?.render,
  };
}

export function statusColumn<T>(options?: {
  label?: string;
  width?: string;
  render?: TableColumn<T>['render'];
}): TableColumn<T> {
  return {
    key: 'status',
    label: options?.label ?? 'Status',
    width: options?.width ?? '80px',
    align: 'center',
    render: options?.render,
  };
}

export function createdAtColumn<T>(options?: {
  label?: string;
  minWidth?: string;
}): TableColumn<T> {
  return {
    key: 'createdAt',
    label: options?.label ?? 'Created at',
    minWidth: options?.minWidth ?? '140px',
    align: 'right',
  };
}

export function deleteActionColumn<T>(options?: { onDelete?: (row: T) => void }): TableColumn<T> {
  return {
    key: 'action',
    label: 'Action',
    width: '72px',
    align: 'center',
    render: (_value, row) => (
      <button
        className="inline-flex items-center justify-center rounded-[var(--radius-md)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-state-danger)]"
        onClick={() => options?.onDelete?.(row)}
      >
        <IconTrash size={16} stroke={1.5} />
      </button>
    ),
  };
}

export function moreActionColumn<T>(options?: { onClick?: (row: T) => void }): TableColumn<T> {
  return {
    key: 'action',
    label: 'Action',
    width: '72px',
    align: 'center',
    render: (_value, row) => (
      <button
        className="inline-flex items-center justify-center rounded-[var(--radius-md)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
        onClick={() => options?.onClick?.(row)}
      >
        <IconDotsCircleHorizontal size={16} stroke={1.5} />
      </button>
    ),
  };
}
