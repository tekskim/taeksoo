import { useState, useEffect } from 'react';
import { Drawer, Button, Select, FormField, InlineMessage, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ChangeVolumeTypeInfo {
  id: string;
  name: string;
  currentType: string;
}

export interface ChangeVolumeTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: ChangeVolumeTypeInfo | null;
  volumeTypes?: { value: string; label: string }[];
  onSubmit?: (newType: string) => void;
}

/* ----------------------------------------
   Default Data
   ---------------------------------------- */

const defaultVolumeTypes = [
  { value: 'ssd', label: 'SSD' },
  { value: 'hdd', label: 'HDD' },
  { value: 'nvme', label: 'NVMe' },
  { value: 'high-iops', label: 'High IOPS' },
];

/* ----------------------------------------
   ChangeVolumeTypeDrawer Component
   ---------------------------------------- */

export function ChangeVolumeTypeDrawer({
  isOpen,
  onClose,
  volume,
  volumeTypes = defaultVolumeTypes,
  onSubmit,
}: ChangeVolumeTypeDrawerProps) {
  const [newType, setNewType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [typeError, setTypeError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewType('');
      setHasAttemptedSubmit(false);
      setTypeError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!newType) {
      setTypeError('Please select a volume type.');
      return;
    }
    setTypeError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(newType);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setTypeError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Type"
      description="Change the storage type of this volume to another available volume type. This operation may take some time."
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
        <InlineMessage variant="error">
          For data consistency, stop all write operations on the instance before retrying.
        </InlineMessage>

        <InfoBox.Group>
          <InfoBox label="Volume" value={volume?.name || '-'} />
          <InfoBox label="Current Volume Type" value={volume?.currentType || '-'} />
        </InfoBox.Group>

        <FormField required error={hasAttemptedSubmit && !!typeError}>
          <FormField.Label>New volume type</FormField.Label>
          <FormField.Control>
            <Select
              options={volumeTypes}
              value={newType}
              onChange={(val) => {
                setNewType(val);
                if (typeError) setTypeError(null);
              }}
              placeholder="Please select a volume type"
              fullWidth
            />
          </FormField.Control>
          {hasAttemptedSubmit && typeError && (
            <FormField.ErrorMessage>{typeError}</FormField.ErrorMessage>
          )}
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default ChangeVolumeTypeDrawer;
