import { useState, useEffect } from 'react';
import { Drawer, Button, Radio, InfoBox, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface EditConsumerQosSpecInfo {
  id: string;
  name: string;
  currentConsumer: string;
}

export interface EditConsumerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  qosSpec: EditConsumerQosSpecInfo;
  onSubmit?: (consumer: string) => void;
}

/* ----------------------------------------
   EditConsumerDrawer Component
   ---------------------------------------- */

export function EditConsumerDrawer({
  isOpen,
  onClose,
  qosSpec,
  onSubmit,
}: EditConsumerDrawerProps) {
  const [consumer, setConsumer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [consumerError, setConsumerError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConsumer('');
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      setConsumerError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!consumer) {
      setConsumerError('Please select a consumer.');
      return;
    }
    setConsumerError(null);
    setIsSubmitting(true);
    try {
      await onSubmit?.(consumer);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setConsumerError(null);
    onClose();
  };

  const currentConsumerLower = qosSpec.currentConsumer.toLowerCase();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit consumer"
      description="Modifies the consumer scope applied to the QoS specification."
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
        <InfoBox.Group>
          <InfoBox label="QoS spec" value={qosSpec.name} />
          <InfoBox label="Current consumer" value={qosSpec.currentConsumer} />
        </InfoBox.Group>

        <FormField
          label="Consumer"
          description="Select the consumer scope to which the QoS specification applies."
          spacing="loose"
          required
          error={hasAttemptedSubmit && !!consumerError}
          errorMessage={hasAttemptedSubmit && consumerError ? consumerError : undefined}
        >
          <VStack gap={2}>
            <Radio
              value="frontend"
              label="Frontend"
              checked={consumer === 'frontend'}
              onChange={() => {
                setConsumer('frontend');
                setConsumerError(null);
              }}
              disabled={currentConsumerLower === 'frontend'}
            />
            <Radio
              value="backend"
              label="Backend"
              checked={consumer === 'backend'}
              onChange={() => {
                setConsumer('backend');
                setConsumerError(null);
              }}
              disabled={currentConsumerLower === 'backend'}
            />
            <Radio
              value="both"
              label="Both"
              checked={consumer === 'both'}
              onChange={() => {
                setConsumer('both');
                setConsumerError(null);
              }}
              disabled={currentConsumerLower === 'both'}
            />
          </VStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditConsumerDrawer;
