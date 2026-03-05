import { useState, useCallback, useEffect } from 'react';
import { Drawer, Button, Select } from '@/design-system';
import { IconGripVertical, IconEye, IconEyeOff, IconRefresh } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  locked?: boolean; // Locked columns can't be reordered or hidden
}

export interface ViewPreferencesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current rows per page */
  rowsPerPage: number;
  /** Callback when rows per page changes */
  onRowsPerPageChange: (value: number) => void;
  /** Column configurations */
  columns: ColumnConfig[];
  /** Callback when columns change */
  onColumnsChange: (columns: ColumnConfig[]) => void;
  /** Default column configurations for reset */
  defaultColumns?: ColumnConfig[];
  /** Callback when settings are saved */
  onSave?: () => void;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const rowsPerPageOptions = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
];

const defaultColumns: ColumnConfig[] = [
  { id: 'favorite', label: 'Favorite', visible: true, locked: true },
  { id: 'name', label: 'Name', visible: true, locked: true },
  { id: 'image', label: 'Image', visible: true },
  { id: 'flavor', label: 'Flavor', visible: true },
  { id: 'vcpu', label: 'vCPU', visible: true },
  { id: 'ram', label: 'RAM', visible: true },
  { id: 'disk', label: 'Disk', visible: true },
  { id: 'network', label: 'Network', visible: true },
  { id: 'floatingIp', label: 'Floating IP', visible: true },
  { id: 'access', label: 'Access', visible: true },
  { id: 'id', label: 'ID', visible: false },
  { id: 'gpu', label: 'GPU', visible: false },
  { id: 'az', label: 'AZ', visible: false },
  { id: 'tag', label: 'Tag', visible: false },
  { id: 'createdAt', label: 'Created at', visible: false },
  { id: 'action', label: 'Action', visible: true, locked: true },
];

/* ----------------------------------------
   ViewPreferencesDrawer Component
   ---------------------------------------- */

export function ViewPreferencesDrawer({
  isOpen,
  onClose,
  rowsPerPage,
  onRowsPerPageChange,
  columns,
  onColumnsChange,
  defaultColumns: customDefaultColumns,
  onSave,
}: ViewPreferencesDrawerProps) {
  const [localRowsPerPage, setLocalRowsPerPage] = useState(rowsPerPage.toString());
  const [localColumns, setLocalColumns] = useState<ColumnConfig[]>(columns);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sync local state when columns prop changes
  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  // Reset to default
  const handleResetToDefault = useCallback(() => {
    const resetColumns = customDefaultColumns || defaultColumns;
    setLocalColumns(resetColumns);
    setLocalRowsPerPage('10');
  }, [customDefaultColumns]);

  // Toggle column visibility
  const toggleColumnVisibility = useCallback((columnId: string) => {
    setLocalColumns((prev) =>
      prev.map((col) =>
        col.id === columnId && !col.locked ? { ...col, visible: !col.visible } : col
      )
    );
  }, []);

  // Drag and drop handlers
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const draggedColumn = localColumns[draggedIndex];
      const targetColumn = localColumns[index];

      // Don't allow reordering locked columns
      if (draggedColumn.locked || targetColumn.locked) return;

      const newColumns = [...localColumns];
      newColumns.splice(draggedIndex, 1);
      newColumns.splice(index, 0, draggedColumn);
      setLocalColumns(newColumns);
      setDraggedIndex(index);
    },
    [draggedIndex, localColumns]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  // Cancel
  const handleCancel = useCallback(() => {
    setLocalColumns(columns);
    setLocalRowsPerPage(rowsPerPage.toString());
    onClose();
  }, [columns, rowsPerPage, onClose]);

  // Save
  const handleSave = useCallback(() => {
    onRowsPerPageChange(parseInt(localRowsPerPage, 10));
    onColumnsChange(localColumns);
    onSave?.();
    onClose();
  }, [localRowsPerPage, localColumns, onRowsPerPageChange, onColumnsChange, onSave, onClose]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleCancel}
      title="View preferences"
      width={320}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleCancel} className="flex-1 h-8">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} className="flex-1 h-8">
            Save
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Rows per page */}
        <div className="flex flex-col gap-2">
          <label className="text-label-lg text-[var(--color-text-default)]">Rows per page</label>
          <Select
            options={rowsPerPageOptions}
            value={localRowsPerPage}
            onChange={setLocalRowsPerPage}
            fullWidth
          />
        </div>

        {/* Attribute Columns */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-[var(--color-text-default)]">
              Attribute Columns
            </span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 text-label-md text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors"
            >
              <IconRefresh size={12} stroke={1} />
              <span>Reset to default</span>
            </button>
          </div>

          {/* Column List */}
          <div className="flex flex-col gap-2">
            {localColumns.map((column, index) => (
              <div
                key={column.id}
                draggable={!column.locked}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center justify-between
                  min-w-[80px] p-2
                  bg-[var(--color-surface-default)]
                  border border-solid rounded-[6px]
                  transition-colors
                  ${
                    column.locked
                      ? 'border-[var(--color-border-default)]'
                      : 'border-[var(--color-border-strong)] cursor-grab active:cursor-grabbing'
                  }
                  ${draggedIndex === index ? 'opacity-50' : ''}
                `}
              >
                <div className="flex items-center gap-1.5">
                  {!column.locked && (
                    <IconGripVertical
                      size={16}
                      className="text-[var(--color-text-default)]"
                      stroke={1}
                    />
                  )}
                  <span className="text-label-md text-[var(--color-text-default)]">
                    {column.label}
                  </span>
                </div>

                {!column.locked && (
                  <button
                    type="button"
                    onClick={() => toggleColumnVisibility(column.id)}
                    className="p-0.5 hover:bg-[var(--color-surface-subtle)] rounded transition-colors"
                    aria-label={column.visible ? 'Hide column' : 'Show column'}
                  >
                    {column.visible ? (
                      <IconEye size={16} className="text-[var(--color-text-default)]" stroke={1} />
                    ) : (
                      <IconEyeOff size={16} className="text-[var(--color-text-muted)]" stroke={1} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export { defaultColumns };
export default ViewPreferencesDrawer;
