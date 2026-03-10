import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type IPAssignmentType = 'auto' | 'manual';

export interface SubnetOption {
  id: string;
  name: string;
  cidr: string;
  ipRangeStart?: string;
  ipRangeEnd?: string;
}

export interface PortInfo {
  id: string;
  name: string;
  networkName: string;
}

export interface AllocateIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  port: PortInfo;
  subnets: SubnetOption[];
  onSubmit?: (data: {
    subnetId: string;
    assignmentType: IPAssignmentType;
    ipAddress?: string;
  }) => void;
}

/* ----------------------------------------
   AllocateIPDrawer Component
   ---------------------------------------- */

export function AllocateIPDrawer({
  isOpen,
  onClose,
  port,
  subnets,
  onSubmit,
}: AllocateIPDrawerProps) {
  const [selectedSubnetId, setSelectedSubnetId] = useState('');
  const [assignmentType, setAssignmentType] = useState<IPAssignmentType>('auto');
  const [manualIpAddress, setManualIpAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSubnetId('');
      setAssignmentType('auto');
      setManualIpAddress('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedSubnetId) return;
    if (assignmentType === 'manual' && !manualIpAddress.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        subnetId: selectedSubnetId,
        assignmentType,
        ipAddress: assignmentType === 'manual' ? manualIpAddress : undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    onClose();
  };

  const selectedSubnet = subnets.find((s) => s.id === selectedSubnetId);
  const ipRangeText =
    selectedSubnet && selectedSubnet.ipRangeStart && selectedSubnet.ipRangeEnd
      ? `${selectedSubnet.ipRangeStart} - ${selectedSubnet.ipRangeEnd}`
      : '';

  const subnetOptions = [
    { value: '', label: 'Select subnet' },
    ...subnets.map((s) => ({ value: s.id, label: `${s.name} (${s.cidr})` })),
  ];

  const assignmentOptions = [
    { value: 'auto', label: 'Auto-assign' },
    { value: 'manual', label: 'Manual' },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Allocate IP"
      description="Assign an additional fixed IP address to this port. Select a subnet from the list below and choose whether to assign an IP automatically or manually."
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
            {isSubmitting ? 'Attaching...' : 'Attach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}

        <InfoBox.Group>
          <InfoBox label="Port" value={port.name} />
          <InfoBox label="Owned network" value={port.networkName} />
        </InfoBox.Group>

        {/* Fixed IP */}
        <FormField required error={hasAttemptedSubmit && !selectedSubnetId}>
          <FormField.Label>Fixed IP</FormField.Label>
          <FormField.Description>
            Select a subnet and choose whether to auto-allocate a fixed IP or enter one manually.
          </FormField.Description>
          <FormField.Control>
            <VStack gap={2} className="w-full">
              <Select
                value={selectedSubnetId}
                onChange={(value) => setSelectedSubnetId(value)}
                options={subnetOptions}
                fullWidth
                error={hasAttemptedSubmit && !selectedSubnetId}
              />
              <Select
                value={assignmentType}
                onChange={(value) => setAssignmentType(value as IPAssignmentType)}
                options={assignmentOptions}
                fullWidth
              />
              {assignmentType === 'manual' && (
                <Input
                  value={manualIpAddress}
                  onChange={(e) => setManualIpAddress(e.target.value)}
                  placeholder="e.g. 10.62.0.50"
                  fullWidth
                  error={hasAttemptedSubmit && !manualIpAddress.trim()}
                />
              )}
            </VStack>
          </FormField.Control>
          {hasAttemptedSubmit && !selectedSubnetId && (
            <FormField.ErrorMessage>Please select a subnet</FormField.ErrorMessage>
          )}
          {hasAttemptedSubmit && assignmentType === 'manual' && !manualIpAddress.trim() && (
            <FormField.ErrorMessage>IP address is required</FormField.ErrorMessage>
          )}
        </FormField>

        {/* IP Range Helper Text */}
        {selectedSubnetId && ipRangeText && (
          <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">{ipRangeText}</p>
        )}
      </VStack>
    </Drawer>
  );
}

export default AllocateIPDrawer;
