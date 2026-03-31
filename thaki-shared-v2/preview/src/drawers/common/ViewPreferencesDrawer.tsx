import { useState, useEffect, useCallback } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Toggle } from '@shared/components/Toggle';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

export interface ColumnPreference {
  key: string;
  label: string;
  visible: boolean;
  locked?: boolean;
}

export interface ViewPreferencesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnPreference[];
  onSave?: (columns: ColumnPreference[]) => void;
}

export function ViewPreferencesDrawer({
  isOpen,
  onClose,
  columns: initialColumns,
  onSave,
}: ViewPreferencesDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [columns, setColumns] = useState<ColumnPreference[]>([]);

  useEffect(() => {
    if (isOpen) {
      setColumns(initialColumns.map((c) => ({ ...c })));
    }
  }, [isOpen, initialColumns]);

  const toggleColumn = useCallback((key: string) => {
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)));
  }, []);

  const handleSubmit = () => {
    onSave?.(columns);
    onClose();
  };

  const handleReset = () => {
    setColumns(initialColumns.map((c) => ({ ...c, visible: true })));
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="View preferences"
      description="Choose which columns to display and their order."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Apply"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-13 font-medium text-text">Columns</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-12 text-primary hover:underline"
          >
            Reset to default
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {columns.map((col) => (
            <div
              key={col.key}
              className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-surface-muted"
            >
              <span className="text-12 text-text">{col.label}</span>
              <Toggle
                checked={col.visible}
                onChange={() => toggleColumn(col.key)}
                disabled={col.locked}
              />
            </div>
          ))}
        </div>
      </div>
    </Overlay.Template>
  );
}
