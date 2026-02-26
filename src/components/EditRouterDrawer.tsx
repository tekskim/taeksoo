import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

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
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens or router changes
  useEffect(() => {
    if (isOpen) {
      setRouterName(router.name);
      setDescription(router.description || '');
      setAdminStateUp(router.adminStateUp ?? true);
      setIsAdvancedExpanded(true);
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
      title=""
      showCloseButton={false}
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
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Edit router
          </h2>
        </VStack>

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
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>
            Description{' '}
            <span className="text-body-sm text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Router for production web servers"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Advanced Options Toggle */}
        <VStack gap={3} className="w-full">
          <button
            type="button"
            onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
            className="flex items-center gap-1.5 text-label-lg text-[var(--color-text-default)] leading-5"
          >
            {isAdvancedExpanded ? (
              <IconChevronDown size={16} stroke={1} />
            ) : (
              <IconChevronRight size={16} stroke={1} />
            )}
            Label
          </button>

          {/* Admin State Toggle (Collapsible) */}
          {isAdvancedExpanded && (
            <FormField label="Admin state" spacing="loose">
              <HStack gap={2} className="items-center">
                <Toggle
                  checked={adminStateUp}
                  onChange={(e) => setAdminStateUp(e.target.checked)}
                />
                <span className="text-body-md text-[var(--color-text-default)] leading-4">
                  {adminStateUp ? 'Up' : 'Down'}
                </span>
              </HStack>
            </FormField>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditRouterDrawer;
