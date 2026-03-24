import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

export interface CreateDomainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDomainDrawer({ isOpen, onClose }: CreateDomainDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [domainName, setDomainName] = useState('');
  const [description, setDescription] = useState('');
  const [driver, setDriver] = useState<string>('sql');
  const [enabled, setEnabled] = useState(true);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDomainName('');
      setDescription('');
      setDriver('sql');
      setEnabled(true);
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!domainName.trim()) {
      setNameError('Please enter a domain name.');
      return;
    }
    setNameError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Create domain"
      description="Create a new authentication domain for user management."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField label="Domain name" required error={nameError || undefined}>
          <Input
            value={domainName}
            onChange={(e) => {
              setDomainName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter domain name"
            error={!!nameError}
          />
        </FormField>

        <FormField label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
            size="sm"
          />
        </FormField>

        <FormField label="Driver">
          <Dropdown.Select
            value={driver}
            onChange={(v) => setDriver(String(v))}
            placeholder="Select driver"
            size="sm"
          >
            <Dropdown.Option value="sql" label="SQL" />
            <Dropdown.Option value="ldap" label="LDAP" />
            <Dropdown.Option value="keystone" label="Keystone" />
          </Dropdown.Select>
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Status</span>
            <span className="text-12 text-text-muted">
              Disabled domains are not used for authentication.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            <span className="text-12 text-text">{enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
