import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

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
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens or loadBalancer changes
  useEffect(() => {
    if (isOpen) {
      setName(loadBalancer.name);
      setDescription(loadBalancer.description || '');
      setAdminStateUp(loadBalancer.adminStateUp ?? true);
      setIsAdvancedExpanded(true);
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
      title=""
      showCloseButton={false}
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
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Edit load balancer
          </h2>
        </VStack>

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
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>
            Description{' '}
            <span className="text-body-sm text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Web traffic distribution"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Advanced Options Toggle */}
        <VStack gap={3} className="w-full">
          <button
            type="button"
            onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
            className="flex items-center gap-1.5 text-label-lg text-[var(--color-text-default)] leading-5"
          >
            {isAdvancedExpanded ? (
              <IconChevronDown size={16} stroke={1} />
            ) : (
              <IconChevronRight size={16} stroke={1} />
            )}
            Lable
          </button>

          {/* Admin State Toggle (Collapsible) */}
          {isAdvancedExpanded && (
            <HStack gap={2} className="items-center">
              <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {adminStateUp ? 'Up' : 'Down'}
              </span>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditLoadBalancerDrawer;
