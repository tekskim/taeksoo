import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface RouterInfo {
  id: string;
  name: string;
}

export interface CreateStaticRouteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  router: RouterInfo;
  onSubmit?: (destinationCidr: string, nextHop: string) => void;
}

/* ----------------------------------------
   CreateStaticRouteDrawer Component
   ---------------------------------------- */

export function CreateStaticRouteDrawer({
  isOpen,
  onClose,
  router,
  onSubmit,
}: CreateStaticRouteDrawerProps) {
  const [destinationCidr, setDestinationCidr] = useState('');
  const [nextHop, setNextHop] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setDestinationCidr('');
      setNextHop('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!destinationCidr.trim() || !nextHop.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(destinationCidr, nextHop);
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
      title="Create Static Route"
      description="Add a static route to manually define traffic paths beyond connected subnets."
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
        {/* Header */}

        <InfoBox label="Router name" value={router.name} />

        {/* Destination CIDR Input */}
        <FormField required error={hasAttemptedSubmit && !destinationCidr.trim()}>
          <FormField.Label>Destination CIDR</FormField.Label>
          <FormField.Control>
            <Input
              value={destinationCidr}
              onChange={(e) => setDestinationCidr(e.target.value)}
              placeholder="e.g., 10.7.61.0/24"
              fullWidth
              error={hasAttemptedSubmit && !destinationCidr.trim()}
            />
          </FormField.Control>
          {hasAttemptedSubmit && !destinationCidr.trim() && (
            <FormField.ErrorMessage>Destination CIDR is required</FormField.ErrorMessage>
          )}
        </FormField>

        {/* Next hop Input */}
        <FormField required error={hasAttemptedSubmit && !nextHop.trim()}>
          <FormField.Label>Next hop</FormField.Label>
          <FormField.Control>
            <Input
              value={nextHop}
              onChange={(e) => setNextHop(e.target.value)}
              placeholder="e.g., 192.168.10.50"
              fullWidth
              error={hasAttemptedSubmit && !nextHop.trim()}
            />
          </FormField.Control>
          {hasAttemptedSubmit && !nextHop.trim() && (
            <FormField.ErrorMessage>Next hop is required</FormField.ErrorMessage>
          )}
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateStaticRouteDrawer;
