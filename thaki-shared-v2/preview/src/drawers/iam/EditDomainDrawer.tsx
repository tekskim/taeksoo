import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Textarea } from '@shared/components/Textarea';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

export interface EditDomainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  domainId?: string;
  initialData?: { name: string; description: string; enabled: boolean };
}

export function EditDomainDrawer({
  isOpen,
  onClose,
  domainId = 'domain-001',
  initialData,
}: EditDomainDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [enabled, setEnabled] = useState(initialData?.enabled ?? true);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setDescription(initialData?.description || '');
      setEnabled(initialData?.enabled ?? true);
      setNameError(null);
    }
  }, [isOpen, initialData?.name, initialData?.description, initialData?.enabled]);

  const handleSubmit = () => {
    if (!name.trim()) {
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
      title="Edit domain"
      description="Edit the domain's basic information."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Domain ID" values={[domainId]} />
        </div>

        <FormField label="Domain name" required error={nameError || undefined}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
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
