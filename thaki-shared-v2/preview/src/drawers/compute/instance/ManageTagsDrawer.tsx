import { useState, useEffect, useCallback } from 'react';
import { IconX, IconCirclePlus } from '@tabler/icons-react';
import { Overlay } from '@shared/components/Overlay';
import { Input } from '@shared/components/Input';
import { Button } from '@shared/components/Button';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface ManageTagsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName?: string;
  initialTags?: { key: string; value: string }[];
}

interface TagRow {
  id: string;
  key: string;
  value: string;
}

const DEFAULT_TAGS: { key: string; value: string }[] = [
  { key: 'env', value: 'production' },
  { key: 'team', value: 'backend' },
];

function rowsFromInitial(tags: { key: string; value: string }[]): TagRow[] {
  return tags.map((t, i) => ({
    id: `tag-row-${i}-${t.key}`,
    key: t.key,
    value: t.value,
  }));
}

export function ManageTagsDrawer({
  isOpen,
  onClose,
  instanceName = 'my-instance',
  initialTags,
}: ManageTagsDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [rows, setRows] = useState<TagRow[]>(() => rowsFromInitial(initialTags ?? DEFAULT_TAGS));

  useEffect(() => {
    if (isOpen) {
      setRows(rowsFromInitial(initialTags ?? DEFAULT_TAGS));
    }
  }, [isOpen, initialTags]);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, { id: `tag-row-${Date.now()}`, key: '', value: '' }]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRow = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Manage Tags"
      description="Add, edit, or remove tags on this instance."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Instance name" values={[instanceName]} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-13 font-medium text-text leading-5">Tags</span>
            <p className="text-12 text-text-muted">
              Key-value pairs are shown as instance metadata.
            </p>
          </div>

          <div className="bg-surface-muted rounded-md px-4 py-3 w-full">
            <div className="grid grid-cols-[1fr_1fr_20px] gap-1 items-center">
              <span className="text-11 text-text-muted">Key</span>
              <span className="text-11 text-text-muted">Value</span>
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
                    onClick={() => removeRow(row.id)}
                    className="flex items-center justify-center w-5 h-8 text-text-muted hover:text-text"
                    aria-label="Remove tag"
                  >
                    <IconX size={14} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="button" variant="secondary" size="sm" onClick={addRow}>
            <span className="inline-flex items-center gap-1.5">
              <IconCirclePlus size={12} strokeWidth={2} />
              Add Tag
            </span>
          </Button>
        </div>
      </div>
    </Overlay.Template>
  );
}
