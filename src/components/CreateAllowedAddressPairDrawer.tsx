import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Radio, RadioGroup, Tooltip } from '@/design-system';
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

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setCidr('');
      setMacAddressType('from_port');
      setMacAddress('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!cidr.trim()) return;
    if (macAddressType === 'manual' && !macAddress.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(
        cidr,
        macAddressType,
        macAddressType === 'manual' ? macAddress : undefined
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isValid = cidr.trim().length > 0 && 
    (macAddressType === 'from_port' || (macAddressType === 'manual' && macAddress.trim().length > 0));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Create Allowed Address Pair
          </h2>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Specify additional IP or MAC addresses that are allowed to pass through this port.
          </p>
        </VStack>

        {/* CIDR Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            CIDR
          </label>
          <Input
            value={cidr}
            onChange={(e) => setCidr(e.target.value)}
            placeholder="e.g. 192.168.0.0/24"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Prefix (/): 24~28
          </p>
        </VStack>

        {/* MAC Address Radio Group */}
        <VStack gap={3} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            MAC Address
          </label>
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
                    stroke={1.5} 
                    className="text-[var(--color-text-subtle)] cursor-help" 
                  />
                </Tooltip>
              </HStack>
              <Radio value="manual" label="Manual" />
            </VStack>
          </RadioGroup>

          {/* Manual MAC Address Input */}
          {macAddressType === 'manual' && (
            <Input
              value={macAddress}
              onChange={(e) => setMacAddress(e.target.value)}
              placeholder="e.g. fa:16:3e:ab:cd:ef"
              fullWidth
            />
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateAllowedAddressPairDrawer;

