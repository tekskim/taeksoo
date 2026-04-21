import { useState, useEffect } from 'react';
import { Drawer, Button, Input, InfoBox, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CreateExtraSpecVolumeTypeInfo {
  id: string;
  name: string;
}

export interface CreateExtraSpecDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeType: CreateExtraSpecVolumeTypeInfo;
  onSubmit?: (data: { parameter: string; value: string }) => void;
}

/* ----------------------------------------
   CreateExtraSpecDrawer Component
   ---------------------------------------- */

export function CreateExtraSpecDrawer({
  isOpen,
  onClose,
  volumeType,
  onSubmit,
}: CreateExtraSpecDrawerProps) {
  const [parameter, setParameter] = useState('');
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [parameterError, setParameterError] = useState<string | null>(null);
  const [valueError, setValueError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setParameter('');
      setValue('');
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      setParameterError(null);
      setValueError(null);
    }
  }, [isOpen]);

  const validate = () => {
    let valid = true;
    if (!parameter.trim()) {
      setParameterError('Please enter a parameter.');
      valid = false;
    } else {
      setParameterError(null);
    }
    if (!value.trim()) {
      setValueError('Please enter a value.');
      valid = false;
    } else {
      setValueError(null);
    }
    return valid;
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({ parameter: parameter.trim(), value: value.trim() });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setParameterError(null);
    setValueError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create extra spec"
      description="Creates an extra spec to apply to the volume type."
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
        <InfoBox label="Volume type" value={volumeType.name} />

        <FormField
          label="Parameter"
          description="Specifies the parameter for the extra spec to add."
          required
          error={hasAttemptedSubmit && !!parameterError}
          errorMessage={hasAttemptedSubmit && parameterError ? parameterError : undefined}
        >
          <Input
            value={parameter}
            onChange={(e) => {
              setParameter(e.target.value);
              if (parameterError) setParameterError(null);
            }}
            placeholder="Enter parameter"
            fullWidth
          />
        </FormField>

        <FormField
          label="Value"
          description="Specifies the value for the extra spec."
          required
          error={hasAttemptedSubmit && !!valueError}
          errorMessage={hasAttemptedSubmit && valueError ? valueError : undefined}
        >
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (valueError) setValueError(null);
            }}
            placeholder="Enter value"
            fullWidth
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateExtraSpecDrawer;
