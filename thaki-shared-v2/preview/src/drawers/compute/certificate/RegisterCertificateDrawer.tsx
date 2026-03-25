import { useState, useEffect, useRef } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { RadioButton } from '@shared/components/RadioButton';
import { Button } from '@shared/components/Button';
import { IconUpload } from '@tabler/icons-react';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

type CertificateType = 'server' | 'ca';

export interface RegisterCertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterCertificateDrawer({ isOpen, onClose }: RegisterCertificateDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState('');
  const [certType, setCertType] = useState<CertificateType>('server');
  const [certificate, setCertificate] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [intermediateCert, setIntermediateCert] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [certError, setCertError] = useState<string | null>(null);
  const certFileRef = useRef<HTMLInputElement>(null);
  const keyFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setCertType('server');
      setCertificate('');
      setPrivateKey('');
      setIntermediateCert('');
      setNameError(null);
      setCertError(null);
    }
  }, [isOpen]);

  const handleFileRead = (file: File, setter: (v: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target?.result as string);
    reader.readAsText(file);
  };

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
      description="Register a certificate issued by an external CA for use within Compute resources."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Register"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-12 font-medium text-text">Type</span>
              <span className="text-12 font-medium text-danger">*</span>
            </div>
            <span className="text-12 text-text-muted">
              Choose the type of certificate to register.
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <RadioButton
              name="certType"
              value="server"
              label="Server certificate"
              checked={certType === 'server'}
              onChange={() => setCertType('server')}
            />
            <RadioButton
              name="certType"
              value="ca"
              label="CA certificate"
              checked={certType === 'ca'}
              onChange={() => setCertType('ca')}
            />
          </div>
        </div>

        <FormField label="Certificate name" required error={nameError || undefined}>
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

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-12 font-medium text-text">Certificate body</span>
              <span className="text-12 font-medium text-danger">*</span>
            </div>
            <span className="text-12 text-text-muted">
              Paste the full contents of your certificate file (.crt, .pem), including the BEGIN/END
              lines.
            </span>
          </div>
          <input
            type="file"
            ref={certFileRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                handleFileRead(file, (v) => {
                  setCertificate(v);
                  if (certError) setCertError(null);
                });
            }}
            className="hidden"
            accept=".crt,.pem,.key,.cer,.txt"
          />
          <Button
            appearance="outline"
            variant="secondary"
            size="sm"
            onClick={() => certFileRef.current?.click()}
          >
            <IconUpload size={12} /> Choose file
          </Button>
          <Textarea
            value={certificate}
            onChange={(e) => {
              setCertificate(e.target.value);
              if (certError) setCertError(null);
            }}
            placeholder="-----BEGIN CERTIFICATE-----"
            rows={4}
            size="sm"
            error={!!certError}
          />
          {certError && <span className="text-11 text-danger">{certError}</span>}
        </div>

        {certType === 'server' && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-[3px]">
                <span className="text-12 font-medium text-text">Private key</span>
                <span className="text-12 font-medium text-danger">*</span>
              </div>
              <span className="text-12 text-text-muted">
                Paste the contents of the private key file (.key) for your certificate.
              </span>
            </div>
            <input
              type="file"
              ref={keyFileRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileRead(file, setPrivateKey);
              }}
              className="hidden"
              accept=".key,.pem,.txt"
            />
            <Button
              appearance="outline"
              variant="secondary"
              size="sm"
              onClick={() => keyFileRef.current?.click()}
            >
              <IconUpload size={12} /> Choose file
            </Button>
            <Textarea
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="-----BEGIN PRIVATE KEY-----"
              rows={4}
              size="sm"
            />
          </div>
        )}

        {certType === 'server' && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-12 font-medium text-text">Certificate chain</span>
              <span className="text-12 text-text-muted">
                If you received an intermediate certificate from your CA, paste it here.
              </span>
            </div>
            <Textarea
              value={intermediateCert}
              onChange={(e) => setIntermediateCert(e.target.value)}
              placeholder="-----BEGIN CERTIFICATE-----"
              rows={4}
              size="sm"
            />
          </div>
        )}
      </div>
    </Overlay.Template>
  );
}
