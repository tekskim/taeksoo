import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface NetworkInfo {
  id: string;
  name: string;
  description?: string;
  adminStateUp?: boolean;
  portSecurityEnabled?: boolean;
}

export interface EditNetworkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  network: NetworkInfo;
  onSubmit?: (
    name: string,
    description: string,
    adminStateUp: boolean,
    portSecurityEnabled: boolean
  ) => void;
}

/* ----------------------------------------
   EditNetworkDrawer Component
   ---------------------------------------- */

export function EditNetworkDrawer({ isOpen, onClose, network, onSubmit }: EditNetworkDrawerProps) {
  const [networkName, setNetworkName] = useState(network.name);
  const [description, setDescription] = useState(network.description || '');
  const [adminStateUp, setAdminStateUp] = useState(network.adminStateUp ?? true);
  const [portSecurityEnabled, setPortSecurityEnabled] = useState(
    network.portSecurityEnabled ?? true
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when drawer opens or network changes
  useEffect(() => {
    if (isOpen) {
      setNetworkName(network.name);
      setDescription(network.description || '');
      setAdminStateUp(network.adminStateUp ?? true);
      setPortSecurityEnabled(network.portSecurityEnabled ?? true);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, network]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!networkName.trim()) {
      setNameError('Network name is required');
      return;
    }
    if (networkName.trim().length > 128) {
      setNameError('Network name must be 128 characters or fewer');
      return;
    }

    setNameError(null);
    setIsSubmitting(true);
    try {
      await onSubmit?.(networkName, description, adminStateUp, portSecurityEnabled);
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
      title="Edit network"
      description="Modifies the properties of the network."
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
        {/* Network Name Input */}
        <FormField required error={hasAttemptedSubmit && !!nameError}>
          <FormField.Label>Network name</FormField.Label>
          <FormField.Control>
            <Input
              value={networkName}
              onChange={(e) => {
                setNetworkName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. my-network"
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
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              fullWidth
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
          description="Indicates whether the network's administrative state is Up or Down."
          spacing="loose"
        >
          <HStack gap={2} className="items-center">
            <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {adminStateUp ? 'Up' : 'Down'}
            </span>
          </HStack>
        </FormField>

        {/* Port security */}
        <FormField
          label="Port security"
          description="Enhances security by allowing only permitted devices to access this network. It is recommended to keep this enabled in most cases."
          spacing="loose"
        >
          <HStack gap={2} className="items-center">
            <Toggle
              checked={portSecurityEnabled}
              onChange={(e) => setPortSecurityEnabled(e.target.checked)}
            />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {portSecurityEnabled ? 'On' : 'Off'}
            </span>
          </HStack>
        </FormField>

        {/* Shared */}
        <FormField
          label="Shared"
          description="Indicates whether the network is available to other projects."
          spacing="loose"
        >
          <HStack gap={2} className="items-center">
            <Toggle
              checked={portSecurityEnabled}
              onChange={(e) => setPortSecurityEnabled(e.target.checked)}
            />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {portSecurityEnabled ? 'Yes' : 'No'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditNetworkDrawer;
