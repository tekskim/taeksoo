import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface EditPolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  policy?: {
    name: string;
    description: string;
    shared: boolean;
    audited: boolean;
  };
  onSubmit?: (data: {
    name: string;
    description: string;
    shared: boolean;
    audited: boolean;
  }) => void;
}

export function EditPolicyDrawer({ isOpen, onClose, policy, onSubmit }: EditPolicyDrawerProps) {
  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');
  const [shared, setShared] = useState(false);
  const [audited, setAudited] = useState(false);

  useEffect(() => {
    if (isOpen && policy) {
      setPolicyName(policy.name);
      setDescription(policy.description);
      setShared(policy.shared);
      setAudited(policy.audited);
    }
  }, [isOpen, policy]);

  const handleSubmit = () => {
    onSubmit?.({ name: policyName, description, shared, audited });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit policy"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Policy name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          required
        >
          <Input value={policyName} onChange={(e) => setPolicyName(e.target.value)} fullWidth />
        </FormField>

        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </FormField>

        <FormField
          label="Shared"
          description="Indicates whether the policy is shared with other tenants."
          spacing="loose"
        >
          <Toggle checked={shared} onChange={setShared} label={shared ? 'Yes' : 'No'} />
        </FormField>

        <FormField
          label="Audited"
          description="Indicates whether the policy rules have been audited."
          spacing="loose"
        >
          <Toggle checked={audited} onChange={setAudited} label={audited ? 'Yes' : 'No'} />
        </FormField>
      </VStack>
    </Drawer>
  );
}
