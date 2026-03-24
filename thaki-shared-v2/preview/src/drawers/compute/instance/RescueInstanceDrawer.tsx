import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface RescueInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName?: string;
}

const RESCUE_IMAGES = [
  { value: 'rescue-ubuntu-2204', label: 'Ubuntu 22.04 rescue' },
  { value: 'rescue-debian-12', label: 'Debian 12 rescue' },
  { value: 'rescue-centos-9', label: 'CentOS Stream 9 rescue' },
  { value: 'rescue-minimal', label: 'Minimal rescue shell' },
  { value: 'rescue-firmware', label: 'Firmware diagnostics' },
];

export function RescueInstanceDrawer({
  isOpen,
  onClose,
  instanceName = 'my-instance',
}: RescueInstanceDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [rescueImage, setRescueImage] = useState(RESCUE_IMAGES[0].value);
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRescueImage(RESCUE_IMAGES[0].value);
      setAdminPassword('');
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
      title="Rescue Instance"
      description="Boot this instance from a rescue image for troubleshooting."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Rescue"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Instance name" values={[instanceName]} />
        </div>

        <FormField label="Rescue image" required>
          <Dropdown.Select
            value={rescueImage}
            onChange={(v) => setRescueImage(String(v))}
            placeholder="Select rescue image"
            size="sm"
          >
            {RESCUE_IMAGES.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <FormField
          label="Admin password"
          hint="Optional. If set, this password will be used for the rescue session."
        >
          <Input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter password (optional)"
            size="sm"
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
