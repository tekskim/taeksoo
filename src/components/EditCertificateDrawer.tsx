import { useState, useEffect } from 'react';
import { Drawer, Button, Input, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CertificateInfo {
  id: string;
  name: string;
  description?: string;
}

export interface EditCertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateInfo;
  onSubmit?: (name: string, description: string) => void;
}

/* ----------------------------------------
   EditCertificateDrawer Component
   ---------------------------------------- */

export function EditCertificateDrawer({
  isOpen,
  onClose,
  certificate,
  onSubmit,
}: EditCertificateDrawerProps) {
  const [name, setName] = useState(certificate.name);
  const [description, setDescription] = useState(certificate.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens or certificate changes
  useEffect(() => {
    if (isOpen) {
      setName(certificate.name);
      setDescription(certificate.description || '');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, certificate]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(name, description);
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
      title="Edit certificate"
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
        {/* Certificate name Input */}
        <FormField required error={hasAttemptedSubmit && !name.trim()}>
          <FormField.Label>Certificate name</FormField.Label>
          <FormField.Control>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. my-ssl-cert"
              fullWidth
              error={hasAttemptedSubmit && !name.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Certificate name is required</FormField.ErrorMessage>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. SSL certificate for web application HTTPS"
              fullWidth
            />
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditCertificateDrawer;
