import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSubnetId, setSelectedSubnetId] = useState('');
  const [assignmentType, setAssignmentType] = useState<IPAssignmentType>('auto');
  const [manualIpAddress, setManualIpAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setIsExpanded(true);
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
            {isSubmitting ? 'Attaching...' : 'Attach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Allocate IP
          </h2>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Assign an additional fixed IP address to this port. Select a subnet from the list below
            and choose whether to assign an IP automatically or manually.
          </p>
        </VStack>

        {/* Port (Read-only) */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">Port</label>
          <Input value={port.name} readOnly disabled fullWidth />
        </VStack>

        {/* Owned Network (Read-only) */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Owned Network
          </label>
          <Input value={port.networkName} readOnly disabled fullWidth />
        </VStack>

        {/* IP Settings (Collapsible) */}
        <VStack gap={2} className="w-full">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-label-lg text-[var(--color-text-default)] leading-5"
          >
            {isExpanded ? (
              <IconChevronDown size={16} stroke={1} />
            ) : (
              <IconChevronRight size={16} stroke={1} />
            )}
            IP Settings
          </button>

          {isExpanded && (
            <VStack gap={2} className="w-full pt-2">
              {/* Subnet Select */}
              <Select
                value={selectedSubnetId}
                onChange={(value) => setSelectedSubnetId(value)}
                options={subnetOptions}
                fullWidth
                error={hasAttemptedSubmit && !selectedSubnetId}
              />
              {hasAttemptedSubmit && !selectedSubnetId && (
                <p className="text-body-sm text-[var(--color-state-danger)] leading-4">
                  Please select a subnet
                </p>
              )}

              {/* Assignment Type */}
              <Select
                value={assignmentType}
                onChange={(value) => setAssignmentType(value as IPAssignmentType)}
                options={assignmentOptions}
                fullWidth
              />

              {/* Manual IP Input (shown when manual is selected) */}
              {assignmentType === 'manual' && (
                <>
                  <Input
                    value={manualIpAddress}
                    onChange={(e) => setManualIpAddress(e.target.value)}
                    placeholder="e.g. 10.62.0.50"
                    fullWidth
                    error={hasAttemptedSubmit && !manualIpAddress.trim()}
                  />
                  {hasAttemptedSubmit && !manualIpAddress.trim() && (
                    <p className="text-body-sm text-[var(--color-state-danger)] leading-4">
                      IP address is required
                    </p>
                  )}
                </>
              )}

              {/* IP Range Helper Text */}
              {selectedSubnetId && ipRangeText && (
                <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
                  {ipRangeText}
                </p>
              )}
            </VStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AllocateIPDrawer;
