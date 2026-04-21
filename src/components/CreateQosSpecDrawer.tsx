import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Radio, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CreateQosSpecDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { name: string; consumer: string }) => void;
}

/* ----------------------------------------
   CreateQosSpecDrawer Component
   ---------------------------------------- */

export function CreateQosSpecDrawer({ isOpen, onClose, onSubmit }: CreateQosSpecDrawerProps) {
  const [name, setName] = useState('');
  const [consumer, setConsumer] = useState('frontend');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setConsumer('frontend');
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen]);

  const validate = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError('Please enter a name.');
      valid = false;
    } else if (name.trim().length < 2 || name.trim().length > 128) {
      setNameError('Name must be between 2-128 characters.');
      valid = false;
    } else {
      setNameError(null);
    }
    return valid;
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({ name: name.trim(), consumer });
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
      title="Create QoS spec"
      description="Creates a new QoS specification and configures its attributes."
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
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          required
          error={hasAttemptedSubmit && !!nameError}
          errorMessage={hasAttemptedSubmit && nameError ? nameError : undefined}
        >
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter name"
            fullWidth
          />
        </FormField>

        <FormField
          label="Consumer"
          description="Select the consumer scope to which the QoS specification applies."
          spacing="loose"
          required
        >
          <VStack gap={2}>
            <Radio
              value="frontend"
              label="Frontend"
              checked={consumer === 'frontend'}
              onChange={() => setConsumer('frontend')}
            />
            <Radio
              value="backend"
              label="Backend"
              checked={consumer === 'backend'}
              onChange={() => setConsumer('backend')}
            />
            <Radio
              value="both"
              label="Both"
              checked={consumer === 'both'}
              onChange={() => setConsumer('both')}
            />
          </VStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateQosSpecDrawer;
