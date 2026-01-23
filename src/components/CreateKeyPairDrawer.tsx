import { useState, useRef } from 'react';
import { Drawer, Button, Input, Radio, RadioGroup } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconInfinity, IconUpload } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface QuotaInfo {
  used: number;
  total: number | null; // null means unlimited (∞)
}

export interface CreateKeyPairDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  keyPairQuota?: QuotaInfo;
  onSubmit?: (name: string, type: 'create' | 'import', publicKey?: string) => void;
}

/* ----------------------------------------
   QuotaProgressBar Component
   ---------------------------------------- */

interface QuotaProgressBarProps {
  label: string;
  used: number;
  total: number | null;
}

function QuotaProgressBar({ label, used, total }: QuotaProgressBarProps) {
  const isUnlimited = total === null;
  const percentage = isUnlimited ? 20 : (total > 0 ? (used / total) * 100 : 0);
  const nextPercentage = isUnlimited ? 20 : (total > 0 ? ((used + 1) / total) * 100 : 0);

  return (
    <VStack gap={2} className="w-full">
      <HStack className="w-full justify-between items-center">
        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
          {label}
        </span>
        <HStack gap={0} className="items-center">
          <span className="text-[12px] text-[var(--color-text-default)] leading-4">
            {used}/
          </span>
          {isUnlimited ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" stroke={1} />
          ) : (
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              {total}
            </span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg relative overflow-hidden">
        {/* Current usage (darker green) */}
        <div 
          className="absolute left-0 top-0 h-full bg-[#4ade80] rounded-lg z-[2]"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Next usage preview (lighter green) */}
        <div 
          className="absolute left-0 top-0 h-full bg-[#bbf7d0] rounded-lg z-[1]"
          style={{ width: `${Math.min(nextPercentage, 100)}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateKeyPairDrawer Component
   ---------------------------------------- */

export function CreateKeyPairDrawer({
  isOpen,
  onClose,
  keyPairQuota = { used: 2, total: 10 },
  onSubmit,
}: CreateKeyPairDrawerProps) {
  const [createType, setCreateType] = useState<'create' | 'import'>('create');
  const [keyPairName, setKeyPairName] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setPublicKey(content);
      };
      reader.readAsText(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!keyPairName.trim()) return;
    if (createType === 'import' && !publicKey.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(keyPairName, createType, createType === 'import' ? publicKey : undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCreateType('create');
    setKeyPairName('');
    setPublicKey('');
    setHasAttemptedSubmit(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <VStack gap={6} className="w-full">
          {/* Quota Section */}
          <VStack gap={6} className="w-full border-t border-[var(--color-border-subtle)] pt-4">
            <QuotaProgressBar
              label="Key Pair Quota"
              used={keyPairQuota.used}
              total={keyPairQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <HStack gap={2} className="w-full border-t border-[var(--color-border-default)] pt-4">
            <Button 
              variant="secondary" 
              onClick={handleClose}
              className="flex-1 h-8"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 h-8"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Create Key pair
          </h2>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Create a new SSH key pair to securely access your instances.
          </p>
        </VStack>

        {/* Create Type Radio */}
        <VStack gap={3} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Create type
          </label>
          <RadioGroup 
            value={createType} 
            onChange={(value) => setCreateType(value as 'create' | 'import')}
          >
            <VStack gap={3}>
              <Radio value="create" label="Create Key Pair" />
              <Radio value="import" label="Import Key Pair" />
            </VStack>
          </RadioGroup>
        </VStack>

        {/* Key Pair Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Key pair name
          </label>
          <Input
            value={keyPairName}
            onChange={(e) => setKeyPairName(e.target.value)}
            placeholder="e.g. my-key"
            fullWidth
            error={hasAttemptedSubmit && !keyPairName.trim()}
          />
          {hasAttemptedSubmit && !keyPairName.trim() ? (
            <p className="text-[11px] text-[var(--color-state-danger)] leading-4">
              Key pair name is required
            </p>
          ) : (
            <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
              Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
            </p>
          )}
        </VStack>

        {/* Public Key Input (only for Import) */}
        {createType === 'import' && (
          <VStack gap={2} className="w-full">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Public key
            </label>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pub,.pem,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            {/* Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-[var(--color-text-default)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              <IconUpload size={12} stroke={1} />
              Upload a File
            </button>
            {/* Textarea */}
            <textarea
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder="Upload a file with a public key or enter it in the field."
              className={`w-full min-h-[80px] px-[10px] py-2 text-[12px] leading-4 text-[var(--color-text-default)] placeholder:text-[var(--color-text-subtle)] bg-[var(--color-surface-default)] border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-action-primary)] focus:border-transparent ${hasAttemptedSubmit && !publicKey.trim() ? 'border-[var(--color-state-danger)]' : 'border-[var(--color-border-strong)]'}`}
            />
            {hasAttemptedSubmit && !publicKey.trim() && (
              <p className="text-[11px] text-[var(--color-state-danger)] leading-4">
                Public key is required
              </p>
            )}
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default CreateKeyPairDrawer;

