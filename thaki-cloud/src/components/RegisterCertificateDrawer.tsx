import { useState, useEffect, useRef } from 'react';
import { Drawer, Button, Input, Radio, RadioGroup } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconUpload, IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type CertificateType = 'server' | 'ca';

export interface RegisterCertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (
    type: CertificateType,
    name: string,
    description: string,
    certificateBody: string,
    privateKey: string,
    intermediateCert: string
  ) => void;
}

/* ----------------------------------------
   FileUploadSection Component
   ---------------------------------------- */

interface FileUploadSectionProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxSizeKB?: number;
}

function FileUploadSection({
  label,
  description,
  value,
  onChange,
  placeholder = "e.g. -----BEGIN CERTIFICATE----- ...",
  maxSizeKB = 64,
}: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sizeKB = new Blob([value]).size / 1024;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <VStack gap={2} className="w-full">
      <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
        {label}
      </label>
      <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
        {description}
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".crt,.pem,.key,.cer,.txt"
      />
      <Button 
        variant="secondary" 
        onClick={handleUploadClick}
        leftIcon={<IconUpload size={12} stroke={1.5} />}
      >
        Upload a File
      </Button>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[80px] px-[10px] py-2 text-[12px] leading-4 text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-action-primary)] focus:border-transparent"
      />
      <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
        ({sizeKB.toFixed(1)}/{maxSizeKB} KB)
      </p>
    </VStack>
  );
}

/* ----------------------------------------
   CollapsibleSection Component
   ---------------------------------------- */

interface CollapsibleSectionProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  defaultExpanded?: boolean;
}

function CollapsibleSection({
  label,
  description,
  value,
  onChange,
  defaultExpanded = false,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sizeKB = new Blob([value]).size / 1024;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <VStack gap={2} className="w-full">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-text-default)] leading-5"
      >
        {isExpanded ? (
          <IconChevronDown size={12} stroke={2} />
        ) : (
          <IconChevronRight size={12} stroke={2} />
        )}
        {label}
      </button>
      
      {isExpanded && (
        <>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            {description}
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".crt,.pem,.key,.cer,.txt"
          />
          <Button 
            variant="secondary" 
            onClick={handleUploadClick}
            leftIcon={<IconUpload size={12} stroke={1.5} />}
          >
            Upload a File
          </Button>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. -----BEGIN CERTIFICATE----- ..."
            className="w-full min-h-[80px] px-[10px] py-2 text-[12px] leading-4 text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-action-primary)] focus:border-transparent"
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            ({sizeKB.toFixed(1)}/64 KB)
          </p>
        </>
      )}
    </VStack>
  );
}

/* ----------------------------------------
   RegisterCertificateDrawer Component
   ---------------------------------------- */

export function RegisterCertificateDrawer({
  isOpen,
  onClose,
  onSubmit,
}: RegisterCertificateDrawerProps) {
  const [certificateType, setCertificateType] = useState<CertificateType>('server');
  const [certificateName, setCertificateName] = useState('');
  const [description, setDescription] = useState('');
  const [certificateBody, setCertificateBody] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [intermediateCert, setIntermediateCert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setCertificateType('server');
      setCertificateName('');
      setDescription('');
      setCertificateBody('');
      setPrivateKey('');
      setIntermediateCert('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!certificateName.trim() || !certificateBody.trim()) return;
    if (certificateType === 'server' && !privateKey.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(
        certificateType,
        certificateName,
        description,
        certificateBody,
        privateKey,
        intermediateCert
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isValid = 
    certificateName.trim().length > 0 && 
    certificateBody.trim().length > 0 &&
    (certificateType !== 'server' || privateKey.trim().length > 0);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Register Certificate
          </h2>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Register a certificate issued by an external CA for use within Compute resources.
          </p>
        </VStack>

        {/* Type Radio */}
        <VStack gap={3} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Type
          </label>
          <RadioGroup 
            value={certificateType} 
            onChange={(value) => setCertificateType(value as CertificateType)}
          >
            <VStack gap={3}>
              <Radio value="server" label="Server Certificate" />
              <Radio value="ca" label="CA Certificate" />
            </VStack>
          </RadioGroup>
        </VStack>

        {/* Certificate Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Certificate Name
          </label>
          <Input
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
            placeholder={certificateType === 'server' ? "e.g. my-ssl-cert" : "e.g. company-internal-ca"}
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Description Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Description (optional)
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={certificateType === 'server' ? "e.g. SSL certificate for web application HTTPS" : "e.g. Internal Root Certificate Authority"}
            fullWidth
          />
        </VStack>

        {/* Certificate Body */}
        <FileUploadSection
          label="Certificate Body"
          description="Paste the full contents of your server certificate file (.crt, .pem), including the BEGIN/END lines."
          value={certificateBody}
          onChange={setCertificateBody}
        />

        {/* Private Key (only for Server Certificate) */}
        {certificateType === 'server' && (
          <FileUploadSection
            label="Private Key"
            description="Paste the contents of the private key file (.key) for your certificate."
            value={privateKey}
            onChange={setPrivateKey}
          />
        )}

        {/* Intermediate Certificate (Collapsible, only for Server Certificate) */}
        {certificateType === 'server' && (
          <CollapsibleSection
            label="Label"
            description="If you received an intermediate certificate from your CA, paste it here."
            value={intermediateCert}
            onChange={setIntermediateCert}
            defaultExpanded={true}
          />
        )}
      </VStack>
    </Drawer>
  );
}

export default RegisterCertificateDrawer;

