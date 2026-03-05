import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
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
      title="Edit security group"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1 h-8">
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
            Allowed: 1–128 characters, letters, numbers, &quot;-&quot;, &quot;_&quot;,
            &quot;.&quot;, &quot;()&quot;, &quot;[]&quot;
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Web server access group"
              fullWidth
            />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditSecurityGroupDrawer;
