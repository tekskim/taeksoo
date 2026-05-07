import { useState, useEffect } from 'react';
import { Drawer, Button, Input, InfoBox, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface EditExtraSpecInfo {
  volumeTypeId: string;
  volumeTypeName: string;
  parameter: string;
  value: string;
}

export interface EditExtraSpecDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  extraSpec: EditExtraSpecInfo | null;
  onSubmit?: (parameter: string, value: string) => void;
}

/* ----------------------------------------
   EditExtraSpecDrawer Component
   ---------------------------------------- */

export function EditExtraSpecDrawer({
  isOpen,
  onClose,
  extraSpec,
  onSubmit,
}: EditExtraSpecDrawerProps) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [valueError, setValueError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && extraSpec) {
      setValue(extraSpec.value);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      setValueError(null);
    }
  }, [isOpen, extraSpec]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!value.trim()) {
      setValueError('Please enter a value.');
      return;
    }
    setValueError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.(extraSpec?.parameter ?? '', value.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setValueError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit extra spec"
      description="Edit an extra spec to apply to the volume type."
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
        <InfoBox label="Volume type" value={extraSpec?.volumeTypeName ?? ''} />

        <FormField label="Parameter">
          <Input value={extraSpec?.parameter ?? ''} disabled fullWidth />
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

export default EditExtraSpecDrawer;
