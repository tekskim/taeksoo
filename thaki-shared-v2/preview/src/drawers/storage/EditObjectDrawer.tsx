import { useState, useEffect, useCallback } from 'react';
import { IconX } from '@tabler/icons-react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Button } from '@shared/components/Button';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

const MOCK_METADATA_ROWS = [
  { key: 'Content-Encoding', value: 'gzip' },
  { key: 'X-Custom', value: 'value1' },
];

type MetadataRow = { id: string; key: string; value: string };

function toRows(entries: { key: string; value: string }[]): MetadataRow[] {
  return entries.map((e) => ({
    id: crypto.randomUUID(),
    key: e.key,
    value: e.value,
  }));
}

export interface EditObjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  objectName: string;
  initialContentType?: string;
  initialMetadata?: { key: string; value: string }[];
}

export function EditObjectDrawer({
  isOpen,
  onClose,
  objectName,
  initialContentType = 'application/octet-stream',
  initialMetadata,
}: EditObjectDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [contentType, setContentType] = useState(initialContentType);
  const [rows, setRows] = useState<MetadataRow[]>(() => toRows(MOCK_METADATA_ROWS));

  useEffect(() => {
    if (isOpen) {
      setContentType(initialContentType);
      const source = initialMetadata?.length ? initialMetadata : MOCK_METADATA_ROWS;
      setRows(toRows(source));
    }
  }, [isOpen, initialContentType, initialMetadata]);

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
      size="sm"
      title="Edit object"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Object name" values={[objectName]} />
        </div>

        <FormField label="Content type">
          <Input
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            placeholder="application/octet-stream"
          />
        </FormField>

        <div className="flex flex-col gap-3 w-full">
          <span className="text-12 font-medium text-text">Metadata</span>
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
