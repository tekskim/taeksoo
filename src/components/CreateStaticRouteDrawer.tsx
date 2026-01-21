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
        <span className="text-[11px] font-medium text-[var(--color-text-subtle)] leading-4">
          Router name
        </span>
        <span className="text-[12px] text-[var(--color-text-default)] leading-4">
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

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setDestinationCidr('');
      setNextHop('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
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
    onClose();
  };

  const isValid = destinationCidr.trim().length > 0 && nextHop.trim().length > 0;

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
            disabled={!isValid || isSubmitting}
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
            Create Static Route
          </h2>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Add a static route to manually define traffic paths beyond connected subnets.
          </p>
        </VStack>

        {/* Router Info */}
        <RouterInfoBox router={router} />

        {/* Destination CIDR Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Destination CIDR
          </label>
          <Input
            value={destinationCidr}
            onChange={(e) => setDestinationCidr(e.target.value)}
            placeholder="e.g., 10.7.61.0/24"
            fullWidth
          />
        </VStack>

        {/* Next hop Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Next hop
          </label>
          <Input
            value={nextHop}
            onChange={(e) => setNextHop(e.target.value)}
            placeholder="e.g., 192.168.10.50"
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateStaticRouteDrawer;


