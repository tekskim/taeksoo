import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { RadioGroup } from '@shared/components/RadioGroup';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export type CreateKeyPairType = 'ssh' | 'x509';

export interface CreateKeyPairDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_OPTIONS = [
  { value: 'ssh', label: 'SSH Key' },
  { value: 'x509', label: 'X.509 Certificate' },
];

export function CreateKeyPairDrawer({ isOpen, onClose }: CreateKeyPairDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState('');
  const [keyType, setKeyType] = useState<CreateKeyPairType>('ssh');
  const [publicKey, setPublicKey] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setKeyType('ssh');
      setPublicKey('');
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Please enter a name.');
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
      title="Create key pair"
      description="Create a new SSH key pair."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField label="Name" required error={nameError || undefined}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter name"
            error={!!nameError}
            size="sm"
          />
        </FormField>

        <FormField label="Type" required>
          <RadioGroup
            name="create-key-pair-type"
            options={TYPE_OPTIONS}
            selectedValue={keyType}
            onChange={(v: string) => setKeyType(v as CreateKeyPairType)}
            direction="vertical"
          />
        </FormField>

        <FormField label="Public key">
          <Textarea
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Paste your public key here..."
            rows={5}
            size="sm"
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
