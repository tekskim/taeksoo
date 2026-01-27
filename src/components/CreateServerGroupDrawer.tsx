import { useState } from 'react';
import { Drawer, Button, Input, Radio, RadioGroup, Tooltip } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconInfinity, IconHelp } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type ServerGroupPolicy =
  | 'anti-affinity'
  | 'affinity'
  | 'soft-anti-affinity'
  | 'soft-affinity';

export interface QuotaInfo {
  used: number;
  total: number | null; // null means unlimited (∞)
}

export interface CreateServerGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serverGroupQuota?: QuotaInfo;
  onSubmit?: (name: string, policy: ServerGroupPolicy) => void;
}

/* ----------------------------------------
   Policy Descriptions
   ---------------------------------------- */

const policyDescriptions: Record<ServerGroupPolicy, string> = {
  'anti-affinity':
    'Instances in this group will be placed on different compute hosts. If no suitable host is available, instance creation will fail.',
  affinity:
    'Instances in this group will be placed on the same compute host. If no suitable host is available, instance creation will fail.',
  'soft-anti-affinity':
    'Instances will preferably be placed on different hosts, but may share a host if necessary.',
  'soft-affinity':
    'Instances will preferably be placed on the same host, but may be spread across hosts if necessary.',
};

/* ----------------------------------------
   QuotaProgressBar Component
   ---------------------------------------- */

interface QuotaProgressBarProps {
  label: string;
  used: number;
  total: number | null;
}

function QuotaProgressBar({ label, used, total }: QuotaProgressBarProps) {
  const isUnlimited = total === null;
  const percentage = isUnlimited ? 20 : total > 0 ? (used / total) * 100 : 0;
  const nextPercentage = isUnlimited ? 20 : total > 0 ? ((used + 1) / total) * 100 : 0;

  return (
    <VStack gap={2} className="w-full">
      <HStack className="w-full justify-between items-center">
        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
          {label}
        </span>
        <HStack gap={0} className="items-center">
          <span className="text-[12px] text-[var(--color-text-default)] leading-4">{used}/</span>
          {isUnlimited ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" stroke={1} />
          ) : (
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">{total}</span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg relative overflow-hidden">
        {/* Current usage (darker green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[#4ade80] rounded-lg z-[2]"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Next usage preview (lighter green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[#bbf7d0] rounded-lg z-[1]"
          style={{ width: `${Math.min(nextPercentage, 100)}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   PolicyRadioOption Component
   ---------------------------------------- */

interface PolicyRadioOptionProps {
  value: ServerGroupPolicy;
  label: string;
  tooltip: string;
}

function PolicyRadioOption({ value, label, tooltip }: PolicyRadioOptionProps) {
  return (
    <HStack gap={2} className="items-start">
      <Radio value={value} label={label} />
      <Tooltip content={tooltip}>
        <button type="button" className="p-0 mt-0.5">
          <IconHelp size={16} className="text-[var(--color-text-subtle)]" stroke={1} />
        </button>
      </Tooltip>
    </HStack>
  );
}

/* ----------------------------------------
   CreateServerGroupDrawer Component
   ---------------------------------------- */

export function CreateServerGroupDrawer({
  isOpen,
  onClose,
  serverGroupQuota = { used: 2, total: 10 },
  onSubmit,
}: CreateServerGroupDrawerProps) {
  const [groupName, setGroupName] = useState('');
  const [policy, setPolicy] = useState<ServerGroupPolicy>('anti-affinity');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!groupName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(groupName, policy);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setGroupName('');
    setPolicy('anti-affinity');
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
        <VStack gap={6} className="w-full">
          {/* Quota Section */}
          <VStack gap={6} className="w-full border-t border-[var(--color-border-subtle)] pt-4">
            <QuotaProgressBar
              label="Server Group Quota"
              used={serverGroupQuota.used}
              total={serverGroupQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <HStack gap={2} className="w-full border-t border-[var(--color-border-default)] pt-4">
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
        </VStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Create Server Group
          </h2>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Create a server group to control how instances are placed across compute hosts.
          </p>
        </VStack>

        {/* Server Group Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Server Group name
          </label>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. web-cluster"
            fullWidth
            error={hasAttemptedSubmit && !groupName.trim()}
          />
          {hasAttemptedSubmit && !groupName.trim() ? (
            <p className="text-[11px] text-[var(--color-state-danger)] leading-4">
              Server Group name is required
            </p>
          ) : (
            <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
              Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
            </p>
          )}
        </VStack>

        {/* Policy Radio */}
        <VStack gap={3} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Create type
          </label>
          <RadioGroup value={policy} onChange={(value) => setPolicy(value as ServerGroupPolicy)}>
            <VStack gap={3}>
              <PolicyRadioOption
                value="anti-affinity"
                label="Anti-affinity"
                tooltip={policyDescriptions['anti-affinity']}
              />
              <PolicyRadioOption
                value="affinity"
                label="Affinity"
                tooltip={policyDescriptions['affinity']}
              />
              <PolicyRadioOption
                value="soft-anti-affinity"
                label="Soft-Anti-affinity"
                tooltip={policyDescriptions['soft-anti-affinity']}
              />
              <PolicyRadioOption
                value="soft-affinity"
                label="Soft-affinity"
                tooltip={policyDescriptions['soft-affinity']}
              />
            </VStack>
          </RadioGroup>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateServerGroupDrawer;
