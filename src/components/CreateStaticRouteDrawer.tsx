import { useState, useEffect } from 'react';
import { Drawer, Button, Input } from '@/design-system';
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
   RouterInfoBox Component
   ---------------------------------------- */

function RouterInfoBox({ router }: { router: RouterInfo }) {
  return (
    <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
      <VStack gap={2}>
        <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
          Router name
        </span>
        <span className="text-body-md text-[var(--color-text-default)] leading-4">
          {router.name}
        </span>
      </VStack>
    </div>
  );
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
      title=""
      showCloseButton={false}
      width={376}
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
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Create Static Route
          </h2>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Add a static route to manually define traffic paths beyond connected subnets.
          </p>
        </VStack>

        {/* Router Info */}
        <RouterInfoBox router={router} />

        {/* Destination CIDR Input */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Destination CIDR
          </label>
          <Input
            value={destinationCidr}
            onChange={(e) => setDestinationCidr(e.target.value)}
            placeholder="e.g., 10.7.61.0/24"
            fullWidth
            error={hasAttemptedSubmit && !destinationCidr.trim()}
          />
          {hasAttemptedSubmit && !destinationCidr.trim() && (
            <p className="text-body-sm text-[var(--color-state-danger)] leading-4">
              Destination CIDR is required
            </p>
          )}
        </VStack>

        {/* Next hop Input */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Next hop
          </label>
          <Input
            value={nextHop}
            onChange={(e) => setNextHop(e.target.value)}
            placeholder="e.g., 192.168.10.50"
            fullWidth
            error={hasAttemptedSubmit && !nextHop.trim()}
          />
          {hasAttemptedSubmit && !nextHop.trim() && (
            <p className="text-body-sm text-[var(--color-state-danger)] leading-4">
              Next hop is required
            </p>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateStaticRouteDrawer;
