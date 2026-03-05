import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface LoadBalancerInfo {
  id: string;
  name: string;
  description?: string;
  adminStateUp?: boolean;
}

export interface EditLoadBalancerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loadBalancer: LoadBalancerInfo;
  onSubmit?: (name: string, description: string, adminStateUp: boolean) => void;
}

/* ----------------------------------------
   EditLoadBalancerDrawer Component
   ---------------------------------------- */

export function EditLoadBalancerDrawer({
  isOpen,
  onClose,
  loadBalancer,
  onSubmit,
}: EditLoadBalancerDrawerProps) {
  const [name, setName] = useState(loadBalancer.name);
  const [description, setDescription] = useState(loadBalancer.description || '');
  const [adminStateUp, setAdminStateUp] = useState(loadBalancer.adminStateUp ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens or loadBalancer changes
  useEffect(() => {
    if (isOpen) {
      setName(loadBalancer.name);
      setDescription(loadBalancer.description || '');
      setAdminStateUp(loadBalancer.adminStateUp ?? true);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, loadBalancer]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!name.trim()) {
      setNameError('Load balancer name is required');
      return;
    }
    if (name.trim().length > 128) {
      setNameError('Load balancer name must be 128 characters or fewer');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(name, description, adminStateUp);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setNameError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit load balancer"
      width={360}
      footer={
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Load Balancer Name Input */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Load balancer name</FormField.Label>
          <FormField.Control>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. web-lb-01"
              fullWidth
              error={hasAttemptedSubmit && !!nameError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Web traffic distribution"
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
            characters.
          </FormField.HelperText>
        </FormField>

        {/* Admin state */}
        <FormField
          label="Admin state"
          description="Indicates whether the load balancer's administrative state is Up or Down."
          spacing="loose"
        >
          <HStack gap={2} className="items-center">
            <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {adminStateUp ? 'Up' : 'Down'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditLoadBalancerDrawer;
