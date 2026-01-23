import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ServerGroupInfo {
  id: string;
  name: string;
}

export interface EditServerGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serverGroup: ServerGroupInfo | null;
  onSubmit?: (name: string) => void;
}

/* ----------------------------------------
   EditServerGroupDrawer Component
   ---------------------------------------- */

export function EditServerGroupDrawer({
  isOpen,
  onClose,
  serverGroup,
  onSubmit,
}: EditServerGroupDrawerProps) {
  const [groupName, setGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen && serverGroup) {
      setGroupName(serverGroup.name);
    }
  }, [isOpen, serverGroup]);

  const handleSubmit = async () => {
    if (!groupName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(groupName);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
          Edit Server Group
        </h2>

        {/* Server Group Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Server Group Name
          </label>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter server group name"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditServerGroupDrawer;


