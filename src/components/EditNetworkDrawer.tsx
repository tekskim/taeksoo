import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

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
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens or network changes
  useEffect(() => {
    if (isOpen) {
      setNetworkName(network.name);
      setDescription(network.description || '');
      setAdminStateUp(network.adminStateUp ?? true);
      setPortSecurityEnabled(network.portSecurityEnabled ?? true);
      setIsAdvancedExpanded(true);
    }
  }, [isOpen, network]);

  const handleSubmit = async () => {
    if (!networkName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(networkName, description, adminStateUp, portSecurityEnabled);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
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
            Edit Network
          </h2>
        </VStack>

        {/* Network Name Input */}
        <FormField required>
          <FormField.Label>Network name</FormField.Label>
          <FormField.Control>
            <Input
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              placeholder="e.g. my-network"
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Description Input */}
        <FormField>
          <FormField.Label>
            Description{' '}
            <span className="text-body-md text-[var(--color-text-subtle)]">(optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Advanced Options Toggle */}
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
          Lable
        </button>

        {/* Advanced Options (Collapsible) */}
        {isAdvancedExpanded && (
          <>
            {/* Admin State */}
            <FormField>
              <FormField.Label>Admin State</FormField.Label>
              <FormField.Description>
                Setting it to "Down" disables all related network or control operations, regardless
                of runtime status.
              </FormField.Description>
              <FormField.Control>
                <HStack gap={2} className="items-center">
                  <Toggle
                    checked={adminStateUp}
                    onChange={(e) => setAdminStateUp(e.target.checked)}
                  />
                  <span className="text-body-md text-[var(--color-text-default)] leading-4">
                    {adminStateUp ? 'Up' : 'Down'}
                  </span>
                </HStack>
              </FormField.Control>
            </FormField>

            {/* Port Security */}
            <FormField>
              <FormField.Label>Port Security</FormField.Label>
              <FormField.Description>
                Enhances security by allowing only permitted devices to access this network. It is
                recommended to keep this enabled in most cases.
              </FormField.Description>
              <FormField.Control>
                <HStack gap={2} className="items-center">
                  <Toggle
                    checked={portSecurityEnabled}
                    onChange={(e) => setPortSecurityEnabled(e.target.checked)}
                  />
                  <span className="text-body-md text-[var(--color-text-default)] leading-4">
                    {portSecurityEnabled ? 'On' : 'Off'}
                  </span>
                </HStack>
              </FormField.Control>
            </FormField>
          </>
        )}
      </VStack>
    </Drawer>
  );
}

export default EditNetworkDrawer;
