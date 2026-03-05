import { useState, useEffect } from 'react';
import { Drawer, Button, Toggle, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface VolumeInfo {
  id: string;
  name: string;
  size: string;
  isBootable?: boolean;
}

export interface BootSettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: VolumeInfo | null;
  onSubmit?: (isBootable: boolean) => void;
}

export function BootSettingDrawer({ isOpen, onClose, volume, onSubmit }: BootSettingDrawerProps) {
  const [isBootable, setIsBootable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && volume) {
      setIsBootable(volume.isBootable ?? false);
    }
  }, [isOpen, volume]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(isBootable);
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
      title="Boot setting"
      description="Unsetting this volume as bootable will make it unavailable as a boot source for new instances. Existing instances that boot from this volume will not be affected."
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
        {volume && <InfoBox label="Volume name" value={volume.name} />}

        <FormField label="Bootable state" spacing="loose">
          <HStack gap={2} align="center">
            <Toggle checked={isBootable} onChange={setIsBootable} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {isBootable ? 'Bootable' : 'Not bootable'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default BootSettingDrawer;
