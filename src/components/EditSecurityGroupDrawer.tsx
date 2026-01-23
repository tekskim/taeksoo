import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SecurityGroupInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditSecurityGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  securityGroup: SecurityGroupInfo;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditSecurityGroupDrawer Component
   ---------------------------------------- */

export function EditSecurityGroupDrawer({
  isOpen,
  onClose,
  securityGroup,
  onSubmit,
}: EditSecurityGroupDrawerProps) {
  const [name, setName] = useState(securityGroup.name);
  const [description, setDescription] = useState(securityGroup.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens or securityGroup changes
  useEffect(() => {
    if (isOpen) {
      setName(securityGroup.name);
      setDescription(securityGroup.description || '');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, securityGroup]);

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
        <HStack gap={2} className="w-full">
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Edit Security Group
          </h2>
        </VStack>

        {/* Security Group Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
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
            <p className="text-[11px] text-[var(--color-state-danger)] leading-4">
              Security Group name is required
            </p>
          ) : (
            <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
              Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
            </p>
          )}
        </VStack>

        {/* Description Input */}
        <VStack gap={2} className="w-full">
          <HStack gap={1} className="items-center">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Description
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              (optional)
            </span>
          </HStack>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Web server access group"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditSecurityGroupDrawer;


