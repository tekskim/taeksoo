import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

const DNS_OPTIONS = [
  { value: 'example.com', label: 'example.com' },
  { value: 'internal.local', label: 'internal.local' },
  { value: 'cloud.example', label: 'cloud.example' },
];

export interface EditFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  floatingIpAddress?: string;
  initialDescription?: string;
  initialDnsDomain?: string;
}

export function EditFloatingIPDrawer({
  isOpen,
  onClose,
  floatingIpAddress = '203.0.113.50',
  initialDescription = '',
  initialDnsDomain = DNS_OPTIONS[0].value,
}: EditFloatingIPDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [description, setDescription] = useState(initialDescription);
  const [dnsDomain, setDnsDomain] = useState(initialDnsDomain);

  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription);
      setDnsDomain(initialDnsDomain);
    }
  }, [isOpen, initialDescription, initialDnsDomain]);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Edit floating IP"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Floating IP address" values={[floatingIpAddress]} />
        </div>

        <FormField label="Description">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            size="sm"
          />
        </FormField>

        <FormField label="DNS domain">
          <Dropdown.Select
            value={dnsDomain}
            onChange={(v) => setDnsDomain(String(v))}
            placeholder="Select DNS domain"
            size="sm"
          >
            {DNS_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>
      </div>
    </Overlay.Template>
  );
}
