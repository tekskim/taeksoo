import { useState } from 'react';
import { Drawer, Button, Select } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface IdentifyDeviceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (duration: string) => void;
}

/* ----------------------------------------
   Duration Options
   ---------------------------------------- */

const DURATION_OPTIONS = [
  { value: '1', label: '1 minute' },
  { value: '5', label: '5 minutes' },
  { value: '10', label: '10 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
];

/* ----------------------------------------
   IdentifyDeviceDrawer Component
   ---------------------------------------- */

export function IdentifyDeviceDrawer({
  isOpen,
  onClose,
  onSubmit,
}: IdentifyDeviceDrawerProps) {
  const [duration, setDuration] = useState('5');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(duration);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDuration('5');
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
        <HStack gap={2} justify="center" className="w-full">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="w-[152px] h-8"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Executing...' : 'Execute'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Identify device
          </h2>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Please enter the duration how long to indicate the LED.
          </p>
        </VStack>

        {/* Duration Select */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Duration
          </label>
          <Select
            value={duration}
            onChange={(value) => setDuration(value)}
            options={DURATION_OPTIONS}
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default IdentifyDeviceDrawer;
