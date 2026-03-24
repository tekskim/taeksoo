import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Toggle } from '@shared/components/Toggle';
import { Dropdown } from '@shared/components/Dropdown';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface ChangeVolumeTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
  initialType?: 'SSD' | 'HDD' | 'NVMe';
}

const TYPE_OPTIONS = [
  { value: 'SSD', label: 'SSD' },
  { value: 'HDD', label: 'HDD' },
  { value: 'NVMe', label: 'NVMe' },
];

export function ChangeVolumeTypeDrawer({
  isOpen,
  onClose,
  volumeName = 'my-volume',
  initialType = 'SSD',
}: ChangeVolumeTypeDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [volumeType, setVolumeType] = useState(initialType);
  const [migrateData, setMigrateData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVolumeType(initialType);
      setMigrateData(false);
    }
  }, [isOpen, initialType]);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Change volume type"
      description="Select a new volume type. Optionally migrate existing data to the new backend."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Apply"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Volume name" values={[volumeName]} />
        </div>

        <FormField label="Volume type" required>
          <Dropdown.Select
            value={volumeType}
            onChange={(v) => setVolumeType(v as 'SSD' | 'HDD' | 'NVMe')}
            placeholder="Select type"
            size="sm"
          >
            {TYPE_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Migrate data</span>
            <span className="text-12 text-text-muted">
              Copy existing data to the new volume type. This may take a long time.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={migrateData} onChange={(e) => setMigrateData(e.target.checked)} />
            <span className="text-12 text-text">{migrateData ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
