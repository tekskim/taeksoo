import { useState, useEffect } from 'react';
import { Drawer, Button, Input, NumberInput, Toggle, FormField } from '@/design-system';
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
  const [monitorPort, setMonitorPort] = useState<number | undefined>(
    member.monitorPort ?? undefined
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
      setMonitorPort(member.monitorPort ?? undefined);
      setBackup(member.backup);
      setAdminStateUp(member.adminStateUp);
    }
  }, [isOpen, member]);

  const handleSubmit = async () => {
    // Validation
    if (weight < 1 || weight > 256) return;
    if (monitorPort !== undefined && (monitorPort < 1 || monitorPort > 65535)) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        weight,
        monitorIpAddress: monitorIpAddress || undefined,
        monitorPort: monitorPort ?? undefined,
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
            Edit member
          </h2>
        </VStack>

        {/* Source (Read-only) */}
        <FormField>
          <FormField.Label>Source</FormField.Label>
          <FormField.Control>
            <Input value={member.source} readOnly disabled fullWidth />
          </FormField.Control>
        </FormField>

        {/* IP Address (Read-only) */}
        <FormField>
          <FormField.Label>IP address</FormField.Label>
          <FormField.Control>
            <Input value={member.ipAddress} readOnly disabled fullWidth />
          </FormField.Control>
        </FormField>

        {/* Port (Read-only) */}
        <FormField>
          <FormField.Label>Port</FormField.Label>
          <FormField.Control>
            <Input value={String(member.port)} readOnly disabled fullWidth />
          </FormField.Control>
        </FormField>

        {/* Weight */}
        <FormField required>
          <FormField.Label>Weight</FormField.Label>
          <FormField.Control>
            <NumberInput
              value={weight}
              onChange={(value) => setWeight(value ?? 1)}
              min={1}
              max={256}
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>1~256</FormField.HelperText>
        </FormField>

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
            Advanced options
          </button>

          {isAdvancedExpanded && (
            <VStack gap={6} className="w-full pt-4">
              {/* Monitor IP Address */}
              <FormField>
                <FormField.Label>Monitor IP address</FormField.Label>
                <FormField.Control>
                  <Input
                    value={monitorIpAddress}
                    onChange={(e) => setMonitorIpAddress(e.target.value)}
                    placeholder="e.g. 10.63.0.50"
                    fullWidth
                  />
                </FormField.Control>
              </FormField>

              {/* Monitor Port */}
              <FormField>
                <FormField.Label>Monitor port</FormField.Label>
                <FormField.Control>
                  <NumberInput
                    value={monitorPort ?? undefined}
                    onChange={(value) => setMonitorPort(value ?? undefined)}
                    min={1}
                    max={65535}
                    placeholder="e.g. 8080"
                    fullWidth
                  />
                </FormField.Control>
                <FormField.HelperText>1~65535</FormField.HelperText>
              </FormField>

              {/* Backup */}
              <FormField>
                <FormField.Label>Backup</FormField.Label>
                <FormField.Control>
                  <HStack gap={2} className="items-center">
                    <Toggle checked={backup} onChange={(e) => setBackup(e.target.checked)} />
                    <span className="text-body-md text-[var(--color-text-default)] leading-4">
                      {backup ? 'On' : 'Off'}
                    </span>
                  </HStack>
                </FormField.Control>
              </FormField>

              {/* Admin State */}
              <FormField>
                <FormField.Label>Admin state</FormField.Label>
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
            </VStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditMemberDrawer;
