import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

const POOL_OPTIONS = [
  { value: 'public-net', label: 'public-net' },
  { value: 'external-net', label: 'external-net' },
  { value: 'provider-net', label: 'provider-net' },
];

export interface AllocateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AllocateFloatingIPDrawer({ isOpen, onClose }: AllocateFloatingIPDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [pool, setPool] = useState(POOL_OPTIONS[0].value);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPool(POOL_OPTIONS[0].value);
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Allocate floating IP"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Allocate"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField label="Floating IP pool" required>
          <Dropdown.Select
            value={pool}
            onChange={(v) => setPool(String(v))}
            placeholder="Select pool"
            size="sm"
          >
            {POOL_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <FormField label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            rows={4}
            size="sm"
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
