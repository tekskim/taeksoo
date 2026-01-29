import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SecurityGroupQuota {
  used: number;
  limit: number;
}

export interface CreateSecurityGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quota: SecurityGroupQuota;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   QuotaProgressBar Component
   ---------------------------------------- */

function QuotaProgressBar({ label, used, limit }: { label: string; used: number; limit: number }) {
  const currentPercent = Math.min((used / limit) * 100, 100);
  const nextPercent = Math.min(((used + 1) / limit) * 100, 100);

  return (
    <VStack gap={2} className="w-full">
      <HStack className="w-full justify-between">
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">
          {label}
        </span>
        <span className="text-body-md text-[var(--color-text-default)] leading-4">
          {used}/{limit}
        </span>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg overflow-hidden relative">
        {/* Next usage (lighter green) */}
        <div
          className="absolute h-full bg-[#bbf7d0] rounded-lg transition-all duration-300"
          style={{ width: `${nextPercent}%` }}
        />
        {/* Current usage (darker green) */}
        <div
          className="absolute h-full bg-[var(--color-status-success)] rounded-lg transition-all duration-300"
          style={{ width: `${currentPercent}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateSecurityGroupDrawer Component
   ---------------------------------------- */

export function CreateSecurityGroupDrawer({
  isOpen,
  onClose,
  quota,
  onSubmit,
}: CreateSecurityGroupDrawerProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(name, description);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
        <VStack gap={4} className="w-full">
          {/* Quota Section */}
          <div className="w-full border-t border-[var(--color-border-subtle)] pt-4">
            <QuotaProgressBar label="Security Group Quota" used={quota.used} limit={quota.limit} />
          </div>

          {/* Buttons */}
          <HStack gap={2} className="w-full border-t border-[var(--color-border-default)] pt-4">
            <Button variant="secondary" onClick={handleClose} className="flex-1 h-8">
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
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Create Security Group
          </h2>
        </VStack>

        {/* Security Group Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Security Group name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. web-server-sg"
            fullWidth
            error={hasAttemptedSubmit && !name.trim()}
          />
          {hasAttemptedSubmit && !name.trim() ? (
            <p className="text-body-sm text-[var(--color-state-danger)] leading-4">
              Security Group name is required
            </p>
          ) : (
            <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
              Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
            </p>
          )}
        </VStack>

        {/* Description Input */}
        <VStack gap={2} className="w-full">
          <HStack gap={1} className="items-center">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">
              Description
            </label>
            <span className="text-body-md text-[var(--color-text-subtle)] leading-4">
              (optional)
            </span>
          </HStack>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. NIC for frontend instance"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateSecurityGroupDrawer;
