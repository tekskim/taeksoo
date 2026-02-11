import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Radio, RadioGroup, Tooltip, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconHelp } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type MacAddressType = 'from_port' | 'manual';

export interface CreateAllowedAddressPairDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (cidr: string, macAddressType: MacAddressType, macAddress?: string) => void;
}

/* ----------------------------------------
   CreateAllowedAddressPairDrawer Component
   ---------------------------------------- */

export function CreateAllowedAddressPairDrawer({
  isOpen,
  onClose,
  onSubmit,
}: CreateAllowedAddressPairDrawerProps) {
  const [cidr, setCidr] = useState('');
  const [macAddressType, setMacAddressType] = useState<MacAddressType>('from_port');
  const [macAddress, setMacAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setCidr('');
      setMacAddressType('from_port');
      setMacAddress('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!cidr.trim()) return;
    if (macAddressType === 'manual' && !macAddress.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(cidr, macAddressType, macAddressType === 'manual' ? macAddress : undefined);
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
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Create Allowed Address Pair
          </h2>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Specify additional IP or MAC addresses that are allowed to pass through this port.
          </p>
        </VStack>

        {/* CIDR Input */}
        <FormField required error={hasAttemptedSubmit && !cidr.trim()}>
          <FormField.Label>CIDR</FormField.Label>
          <FormField.Control>
            <Input
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              placeholder="e.g. 192.168.0.0/24"
              fullWidth
              error={hasAttemptedSubmit && !cidr.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>CIDR is required</FormField.ErrorMessage>
          <FormField.HelperText>Prefix (/): 24~28</FormField.HelperText>
        </FormField>

        {/* MAC Address Radio Group */}
        <FormField
          required
          error={macAddressType === 'manual' && hasAttemptedSubmit && !macAddress.trim()}
        >
          <FormField.Label>MAC Address</FormField.Label>
          <FormField.Control>
            <RadioGroup
              value={macAddressType}
              onChange={(value) => setMacAddressType(value as MacAddressType)}
            >
              <VStack gap={3}>
                <HStack gap={2} className="items-center">
                  <Radio value="from_port" label="From Port" />
                  <Tooltip content="Use the MAC address assigned to this port automatically.">
                    <IconHelp
                      size={16}
                      stroke={1}
                      className="text-[var(--color-text-subtle)] cursor-help"
                    />
                  </Tooltip>
                </HStack>
                <Radio value="manual" label="Manual" />
              </VStack>
            </RadioGroup>
          </FormField.Control>
          {/* Manual MAC Address Input */}
          {macAddressType === 'manual' && (
            <>
              <FormField.Control>
                <Input
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  placeholder="e.g. fa:16:3e:ab:cd:ef"
                  fullWidth
                  error={hasAttemptedSubmit && !macAddress.trim()}
                />
              </FormField.Control>
              {hasAttemptedSubmit && !macAddress.trim() && (
                <FormField.ErrorMessage>MAC address is required</FormField.ErrorMessage>
              )}
            </>
          )}
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateAllowedAddressPairDrawer;
