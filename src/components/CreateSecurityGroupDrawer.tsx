import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, FormField } from '@/design-system';
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
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)] leading-4">
          {used}/{limit}
        </span>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg overflow-hidden relative">
        {/* Next usage (lighter green) */}
        <div
          className="absolute h-full bg-[var(--primitive-color-green200)] rounded-lg transition-all duration-300"
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
      title="Create security group"
      description="A security group acts as a virtual firewall for your instances. Define inbound and outbound rules to control network access to your servers."
      width={360}
      footer={
        <VStack gap={4} className="w-full">
          {/* Quota Section */}
          <div className="w-full">
            <QuotaProgressBar label="Security group quota" used={quota.used} limit={quota.limit} />
          </div>

          {/* Buttons */}
          <div className="w-[calc(100%+48px)] -ml-6 h-px bg-[var(--color-border-default)]" />
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6}>
        {/* Security Group Name Input */}
        <FormField required error={hasAttemptedSubmit && !name.trim()}>
          <FormField.Label>Security group name</FormField.Label>
          <FormField.Control>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. web-server-sg"
              fullWidth
              error={hasAttemptedSubmit && !name.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Security group name is required</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. NIC for frontend instance"
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
            characters.
          </FormField.HelperText>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateSecurityGroupDrawer;
