import { useState, useEffect, useCallback } from 'react';
import { IconX } from '@tabler/icons-react';
import { Overlay } from '@shared/components/Overlay';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface MetadataRow {
  id: string;
  key: string;
  value: string;
}

const DEFAULT_ROWS: MetadataRow[] = [
  { id: 'meta-arch', key: 'architecture', value: 'x86_64' },
  { id: 'meta-os', key: 'os_type', value: 'linux' },
  { id: 'meta-disk', key: 'hw_disk_bus', value: 'virtio' },
];

export interface ManageMetadataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  imageName?: string;
}

export function ManageMetadataDrawer({
  isOpen,
  onClose,
  imageName = 'my-image',
}: ManageMetadataDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [rows, setRows] = useState<MetadataRow[]>(DEFAULT_ROWS);

  useEffect(() => {
    if (isOpen) {
      setRows(DEFAULT_ROWS.map((r) => ({ ...r })));
    }
  }, [isOpen]);

  const updateRow = useCallback((id: string, field: 'key' | 'value', next: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: next } : r)));
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, { id: crypto.randomUUID(), key: '', value: '' }]);
  }, []);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Manage metadata"
      description="Manage image metadata properties."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Image name" values={[imageName]} />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div className="grid grid-cols-[1fr_1fr_20px] gap-1 items-center">
            <span className="text-11 font-medium text-text-muted">Key</span>
            <span className="text-11 font-medium text-text-muted">Value</span>
            <div />
            {rows.map((row) => (
              <div key={row.id} className="contents">
                <Input
                  value={row.key}
                  onChange={(e) => updateRow(row.id, 'key', e.target.value)}
                  placeholder="Key"
                  size="sm"
                />
                <Input
                  value={row.value}
                  onChange={(e) => updateRow(row.id, 'value', e.target.value)}
                  placeholder="Value"
                  size="sm"
                />
                <button
                  type="button"
                  className="flex items-center justify-center w-5 h-5 rounded-md text-text-muted hover:text-text hover:bg-surface-muted border-none bg-transparent cursor-pointer"
                  onClick={() => removeRow(row.id)}
                  aria-label={`Remove ${row.key || 'metadata row'}`}
                >
                  <IconX size={14} stroke={2} />
                </button>
              </div>
            ))}
          </div>

          <Button variant="secondary" size="sm" type="button" onClick={addRow}>
            Add metadata
          </Button>
        </div>
      </div>
    </Overlay.Template>
  );
}
