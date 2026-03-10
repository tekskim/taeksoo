import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface RouterInfo {
  id: string;
  name: string;
  description?: string;
  adminStateUp?: boolean;
}

export interface EditRouterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  router: RouterInfo;
  onSubmit?: (name: string, description: string, adminStateUp: boolean) => void;
}

/* ----------------------------------------
   EditRouterDrawer Component
   ---------------------------------------- */

export function EditRouterDrawer({ isOpen, onClose, router, onSubmit }: EditRouterDrawerProps) {
  const [routerName, setRouterName] = useState(router.name);
  const [description, setDescription] = useState(router.description || '');
  const [adminStateUp, setAdminStateUp] = useState(router.adminStateUp ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens or router changes
  useEffect(() => {
    if (isOpen) {
      setRouterName(router.name);
      setDescription(router.description || '');
      setAdminStateUp(router.adminStateUp ?? true);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, router]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!routerName.trim()) {
      setNameError('Router name is required');
      return;
    }
    if (routerName.trim().length > 128) {
      setNameError('Router name must be 128 characters or fewer');
      return;
    }

    setNameError(null);
    setIsSubmitting(true);
    try {
      await onSubmit?.(routerName, description, adminStateUp);
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
      title="Edit router"
      description="Modifies the properties of the router."
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
        {/* Router Name Input */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Router name</FormField.Label>
          <FormField.Control>
            <Input
              value={routerName}
              onChange={(e) => {
                setRouterName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. my-router"
              fullWidth
              error={hasAttemptedSubmit && !!nameError}
            />
          </FormField.Control>
          <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              fullWidth
              rows={3}
            />
          </FormField.Control>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255
            characters.
          </FormField.HelperText>
        </FormField>

        {/* Admin state */}
        <FormField
          label="Admin state"
          description="Indicates whether the router's administrative state is Up or Down."
          spacing="loose"
        >
          <HStack gap={2} className="items-center">
            <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {adminStateUp ? 'Up' : 'Down'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditRouterDrawer;
