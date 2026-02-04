import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface MemberInfo {
  id: string;
  source: string; // Instance name
  ipAddress: string;
  port: number;
  weight: number;
  monitorIpAddress?: string;
  monitorPort?: number;
  backup: boolean;
  adminStateUp: boolean;
}

export interface EditMemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberInfo;
  onSubmit?: (data: {
    weight: number;
    monitorIpAddress?: string;
    monitorPort?: number;
    backup: boolean;
    adminStateUp: boolean;
  }) => void;
}

/* ----------------------------------------
   EditMemberDrawer Component
   ---------------------------------------- */

export function EditMemberDrawer({ isOpen, onClose, member, onSubmit }: EditMemberDrawerProps) {
  const [weight, setWeight] = useState(member.weight);
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(true);
  const [monitorIpAddress, setMonitorIpAddress] = useState(member.monitorIpAddress || '');
  const [monitorPort, setMonitorPort] = useState<string>(
    member.monitorPort ? String(member.monitorPort) : ''
  );
  const [backup, setBackup] = useState(member.backup);
  const [adminStateUp, setAdminStateUp] = useState(member.adminStateUp);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setWeight(member.weight);
      setIsAdvancedExpanded(true);
      setMonitorIpAddress(member.monitorIpAddress || '');
      setMonitorPort(member.monitorPort ? String(member.monitorPort) : '');
      setBackup(member.backup);
      setAdminStateUp(member.adminStateUp);
    }
  }, [isOpen, member]);

  const handleSubmit = async () => {
    // Validation
    if (weight < 1 || weight > 256) return;
    if (monitorPort && (parseInt(monitorPort) < 1 || parseInt(monitorPort) > 65535)) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        weight,
        monitorIpAddress: monitorIpAddress || undefined,
        monitorPort: monitorPort ? parseInt(monitorPort) : undefined,
        backup,
        adminStateUp,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Validation

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
      <VStack gap={6} className="pb-6">
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Edit Member
          </h2>
        </VStack>

        {/* Source (Read-only) */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">Source</label>
          <Input value={member.source} readOnly disabled fullWidth />
        </VStack>

        {/* IP Address (Read-only) */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            IP Address
          </label>
          <Input value={member.ipAddress} readOnly disabled fullWidth />
        </VStack>

        {/* Port (Read-only) */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">Port</label>
          <Input value={String(member.port)} readOnly disabled fullWidth />
        </VStack>

        {/* Weight */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">Weight</label>
          <Input
            type="number"
            value={String(weight)}
            onChange={(e) => setWeight(parseInt(e.target.value) || 1)}
            min={1}
            max={256}
            fullWidth
          />
          <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">1~256</p>
        </VStack>

        {/* Advanced Options (Collapsible) */}
        <VStack gap={2} className="w-full">
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
            Advanced Options
          </button>

          {isAdvancedExpanded && (
            <VStack gap={6} className="w-full pt-4">
              {/* Monitor IP Address */}
              <VStack gap={2} className="w-full">
                <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                  Monitor IP Address
                </label>
                <Input
                  value={monitorIpAddress}
                  onChange={(e) => setMonitorIpAddress(e.target.value)}
                  placeholder="e.g. 10.63.0.50"
                  fullWidth
                />
              </VStack>

              {/* Monitor Port */}
              <VStack gap={2} className="w-full">
                <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                  Monitor Port
                </label>
                <Input
                  type="number"
                  value={monitorPort}
                  onChange={(e) => setMonitorPort(e.target.value)}
                  placeholder="e.g. 8080"
                  fullWidth
                />
                <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">1~65535</p>
              </VStack>

              {/* Backup */}
              <VStack gap={3} className="w-full">
                <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                  Backup
                </label>
                <HStack gap={2} className="items-center">
                  <Toggle checked={backup} onChange={(e) => setBackup(e.target.checked)} />
                  <span className="text-body-md text-[var(--color-text-default)] leading-4">
                    {backup ? 'On' : 'Off'}
                  </span>
                </HStack>
              </VStack>

              {/* Admin State */}
              <VStack gap={3} className="w-full">
                <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                  Admin State
                </label>
                <HStack gap={2} className="items-center">
                  <Toggle
                    checked={adminStateUp}
                    onChange={(e) => setAdminStateUp(e.target.checked)}
                  />
                  <span className="text-body-md text-[var(--color-text-default)] leading-4">
                    {adminStateUp ? 'Up' : 'Down'}
                  </span>
                </HStack>
              </VStack>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditMemberDrawer;
