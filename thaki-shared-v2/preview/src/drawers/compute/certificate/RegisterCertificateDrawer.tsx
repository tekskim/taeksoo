import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

const TYPE_OPTIONS = [
  { value: 'SERVER', label: 'SERVER' },
  { value: 'CA', label: 'CA' },
  { value: 'CLIENT', label: 'CLIENT' },
];

export interface RegisterCertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterCertificateDrawer({ isOpen, onClose }: RegisterCertificateDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState('');
  const [certType, setCertType] = useState('SERVER');
  const [certificate, setCertificate] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [certError, setCertError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setCertType('SERVER');
      setCertificate('');
      setPrivateKey('');
      setNameError(null);
      setCertError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    let invalid = false;
    if (!name.trim()) {
      setNameError('Please enter a name.');
      invalid = true;
    } else {
      setNameError(null);
    }
    if (!certificate.trim()) {
      setCertError('Certificate is required.');
      invalid = true;
    } else {
      setCertError(null);
    }
    if (invalid) return;
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Register certificate"
      description="Register an external certificate."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Register"
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
            placeholder="Enter certificate name"
            error={!!nameError}
            size="sm"
          />
        </FormField>

        <FormField label="Type">
          <Dropdown.Select
            value={certType}
            onChange={(v) => setCertType(String(v))}
            placeholder="Select type"
            size="sm"
          >
            {TYPE_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <FormField label="Certificate" required error={certError || undefined}>
          <Textarea
            value={certificate}
            onChange={(e) => {
              setCertificate(e.target.value);
              if (certError) setCertError(null);
            }}
            placeholder="-----BEGIN CERTIFICATE-----"
            rows={6}
            size="sm"
            error={!!certError}
          />
        </FormField>

        {certType === 'SERVER' && (
          <FormField label="Private key">
            <Textarea
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="-----BEGIN PRIVATE KEY-----"
              rows={6}
              size="sm"
            />
          </FormField>
        )}
      </div>
    </Overlay.Template>
  );
}
