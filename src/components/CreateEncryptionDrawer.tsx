import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, NumberInput, InfoBox, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CreateEncryptionVolumeTypeInfo {
  id: string;
  name: string;
}

export interface CreateEncryptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeType: CreateEncryptionVolumeTypeInfo;
  onSubmit?: (data: {
    provider: string;
    controlLocation: string;
    cipher: string;
    keySize: number | null;
  }) => void;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const CONTROL_LOCATION_OPTIONS = [
  { value: 'front-end', label: 'Front-end' },
  { value: 'back-end', label: 'Back-end' },
];

/* ----------------------------------------
   CreateEncryptionDrawer Component
   ---------------------------------------- */

export function CreateEncryptionDrawer({
  isOpen,
  onClose,
  volumeType,
  onSubmit,
}: CreateEncryptionDrawerProps) {
  const [provider, setProvider] = useState('');
  const [controlLocation, setControlLocation] = useState('front-end');
  const [cipher, setCipher] = useState('');
  const [keySize, setKeySize] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProvider('');
      setControlLocation('front-end');
      setCipher('');
      setKeySize(null);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      setProviderError(null);
    }
  }, [isOpen]);

  const validate = () => {
    let valid = true;
    if (!provider.trim()) {
      setProviderError('Please enter a provider.');
      valid = false;
    } else if (provider.trim().length > 255) {
      setProviderError('Maximum 255 characters.');
      valid = false;
    } else {
      setProviderError(null);
    }
    return valid;
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        provider: provider.trim(),
        controlLocation,
        cipher: cipher.trim(),
        keySize,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setProviderError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create encryption"
      description="Creates the encryption settings to apply to the volume type."
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
          label="Provider"
          description="Specifies the provider format used for encryption."
          helperText="Maximum 255 characters."
          required
          error={hasAttemptedSubmit && !!providerError}
          errorMessage={hasAttemptedSubmit && providerError ? providerError : undefined}
        >
          <Input
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              if (providerError) setProviderError(null);
            }}
            placeholder="e.g. luks"
            fullWidth
          />
        </FormField>

        <FormField
          label="Control location"
          description="Select the location where the encryption key is managed."
          required
        >
          <Select
            options={CONTROL_LOCATION_OPTIONS}
            value={controlLocation}
            onChange={(val) => setControlLocation(val)}
            fullWidth
          />
        </FormField>

        <FormField
          label="Cipher"
          description="Specifies the encryption cipher to use."
          helperText="Maximum 255 characters."
        >
          <Input
            value={cipher}
            onChange={(e) => setCipher(e.target.value)}
            placeholder="e.g. aes-xts-plain64"
            fullWidth
          />
        </FormField>

        <FormField
          label="Key size"
          description="Specifies the size of the encryption key, in bits."
          helperText="0-4096 bits"
        >
          <NumberInput
            min={0}
            max={4096}
            step={1}
            value={keySize ?? undefined}
            onChange={(val) => setKeySize(val ?? null)}
            width="xs"
            suffix="bits"
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateEncryptionDrawer;
