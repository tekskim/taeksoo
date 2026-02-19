import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  NumberInput,
  Select,
  Radio,
  RadioGroup,
  FormField,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type RuleDirection = 'ingress' | 'egress';

export type ProtocolType =
  | 'all_proto'
  | 'custom_tcp'
  | 'custom_udp'
  | 'custom_icmp'
  | 'other_protocol'
  | 'ssh'
  | 'http'
  | 'https'
  | 'rdp'
  | 'all_tcp'
  | 'all_udp'
  | 'all_icmp';

export type RemoteType = 'cidr' | 'security_group';

export type PortRangeType = 'all' | 'custom';

export interface QuotaInfo {
  used: number;
  total: number;
}

export interface CreateSecurityGroupRuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  securityGroupId?: string;
  ruleQuota?: QuotaInfo;
  securityGroups?: { value: string; label: string }[];
  onSubmit?: (
    direction: RuleDirection,
    protocol: ProtocolType,
    portRangeType: PortRangeType,
    portRange: string,
    remoteType: RemoteType,
    remoteValue: string
  ) => void;
}

/* ----------------------------------------
   QuotaProgressBar Component
   ---------------------------------------- */

interface QuotaProgressBarProps {
  label: string;
  used: number;
  total: number;
}

function QuotaProgressBar({ label, used, total }: QuotaProgressBarProps) {
  const percentage = total > 0 ? (used / total) * 100 : 0;

  return (
    <VStack gap={2} className="w-full">
      <HStack justify="between" className="w-full">
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)] leading-4">
          {used}/{total}
        </span>
      </HStack>
      <div className="relative w-full h-1 bg-[var(--color-border-subtle)] rounded-lg overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[var(--color-status-success)] rounded-lg"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Reserved portion (next item) */}
        <div
          className="absolute top-0 h-full bg-[var(--color-status-success-subtle)] rounded-lg"
          style={{
            left: `${Math.min(percentage, 100)}%`,
            width: `${Math.min((1 / total) * 100, 100 - percentage)}%`,
          }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateSecurityGroupRuleDrawer Component
   ---------------------------------------- */

export function CreateSecurityGroupRuleDrawer({
  isOpen,
  onClose,
  ruleQuota = { used: 2, total: 10 },
  securityGroups = [],
  onSubmit,
}: CreateSecurityGroupRuleDrawerProps) {
  const [direction, setDirection] = useState<RuleDirection>('ingress');
  const [protocol, setProtocol] = useState<ProtocolType>('custom_tcp');
  const [portRangeType, setPortRangeType] = useState<PortRangeType>('custom');
  const [portRange, setPortRange] = useState('');
  const [remoteType, setRemoteType] = useState<RemoteType>('cidr');
  const [remoteValue, setRemoteValue] = useState('');
  const [icmpType, setIcmpType] = useState<number>(1);
  const [icmpCode, setIcmpCode] = useState<number>(1);
  const [ipProtocol, setIpProtocol] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setDirection('ingress');
      setProtocol('custom_tcp');
      setPortRangeType('custom');
      setPortRange('');
      setRemoteType('cidr');
      setRemoteValue('');
      setIcmpType(1);
      setIcmpCode(1);
      setIpProtocol('');
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const protocolOptions = [
    { value: 'all_proto', label: 'All proto' },
    { value: 'custom_tcp', label: 'Custom TCP' },
    { value: 'custom_udp', label: 'Custom UDP' },
    { value: 'custom_icmp', label: 'Custom ICMP' },
    { value: 'other_protocol', label: 'Other protocol' },
    { value: 'ssh', label: 'SSH (22)' },
    { value: 'http', label: 'HTTP (80)' },
    { value: 'https', label: 'HTTPS (443)' },
    { value: 'rdp', label: 'RDP (3389)' },
    { value: 'all_tcp', label: 'All TCP' },
    { value: 'all_udp', label: 'All UDP' },
    { value: 'all_icmp', label: 'All ICMP' },
  ];

  const portRangeOptions = [
    { value: 'all', label: 'All ports' },
    { value: 'custom', label: 'Custom' },
  ];

  const remoteTypeOptions = [
    { value: 'cidr', label: 'CIDR' },
    { value: 'security_group', label: 'Security group' },
  ];

  // Check if protocol requires port input
  const showPortInput =
    ['custom_tcp', 'custom_udp'].includes(protocol) && portRangeType === 'custom';

  // Check if protocol is "All Proto" - hides Port Range and Remote sections
  const isAllProto = protocol === 'all_proto';

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (showPortInput && !portRange.trim()) return;
    if (!isAllProto && !remoteValue.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(direction, protocol, portRangeType, portRange, remoteType, remoteValue);
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
      width={360}
      footer={
        <VStack gap={6} className="w-full">
          {/* Quota Section */}
          <VStack gap={6} className="w-full">
            <QuotaProgressBar
              label="Security group rule quota"
              used={ruleQuota.used}
              total={ruleQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <div className="w-[calc(100%+48px)] -ml-6 h-px bg-[var(--color-border-default)]" />
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
        </VStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Create rule
          </h2>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            A security group rule defines allowed inbound or outbound network traffic.
          </p>
        </VStack>

        {/* Direction Radio */}
        <FormField>
          <FormField.Label>Direction</FormField.Label>
          <FormField.Control>
            <RadioGroup
              value={direction}
              onChange={(value) => setDirection(value as RuleDirection)}
            >
              <VStack gap={2}>
                <Radio value="ingress" label="Ingress" />
                <Radio value="egress" label="Egress" />
              </VStack>
            </RadioGroup>
          </FormField.Control>
        </FormField>

        {/* Protocol Select */}
        <FormField>
          <FormField.Label>Protocol</FormField.Label>
          {!isAllProto && (
            <FormField.Description>
              Select a protocol type to define the rule's traffic. 'Custom' allows specifying
              specific port numbers.
            </FormField.Description>
          )}
          <FormField.Control>
            <Select
              options={protocolOptions}
              value={protocol}
              onChange={(value) => setProtocol(value as ProtocolType)}
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Port Range (only for Custom TCP/UDP, not for All Proto) */}
        {!isAllProto && ['custom_tcp', 'custom_udp'].includes(protocol) && (
          <FormField>
            <FormField.Label>Port range</FormField.Label>
            <FormField.Control>
              <Select
                options={portRangeOptions}
                value={portRangeType}
                onChange={(value) => setPortRangeType(value as PortRangeType)}
                fullWidth
              />
            </FormField.Control>
            {portRangeType === 'custom' && (
              <>
                <FormField.Control>
                  <Input
                    value={portRange}
                    onChange={(e) => setPortRange(e.target.value)}
                    placeholder=""
                    fullWidth
                    error={hasAttemptedSubmit && !portRange.trim()}
                  />
                </FormField.Control>
                <FormField.ErrorMessage>Port range is required</FormField.ErrorMessage>
                <FormField.HelperText>
                  e.g. single port '8080', port range '7000-7005'
                </FormField.HelperText>
              </>
            )}
          </FormField>
        )}

        {/* ICMP Type and Code (only for Custom ICMP) */}
        {protocol === 'custom_icmp' && (
          <>
            <VStack gap={2} className="w-full">
              <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                ICMP type (optional)
              </label>
              <NumberInput
                value={icmpType}
                onChange={(value) => setIcmpType(value ?? 0)}
                min={0}
                max={255}
                fullWidth
              />
              <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">0-255</p>
            </VStack>

            <VStack gap={2} className="w-full">
              <label className="text-label-lg text-[var(--color-text-default)] leading-5">
                ICMP code (optional)
              </label>
              <NumberInput
                value={icmpCode}
                onChange={(value) => setIcmpCode(value ?? 0)}
                min={0}
                max={255}
                fullWidth
              />
              <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">0-255</p>
            </VStack>
          </>
        )}

        {/* IP Protocol (only for Other Protocol) */}
        {protocol === 'other_protocol' && (
          <VStack gap={2} className="w-full">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">
              IP Protocol
            </label>
            <Input
              value={ipProtocol}
              onChange={(e) => setIpProtocol(e.target.value)}
              placeholder=""
              fullWidth
            />
            <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
              0–255. (e.g., 6=TCP, 17=UDP, 1=ICMP)
            </p>
          </VStack>
        )}

        {/* Remote (not shown for All Proto) */}
        {!isAllProto && (
          <VStack gap={2} className="w-full">
            <label className="text-label-lg text-[var(--color-text-default)] leading-5">
              Remote
            </label>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Define the source or destination of traffic.
            </p>
            <Select
              options={remoteTypeOptions}
              value={remoteType}
              onChange={(value) => setRemoteType(value as RemoteType)}
              fullWidth
            />
            {remoteType === 'cidr' ? (
              <>
                <Input
                  value={remoteValue}
                  onChange={(e) => setRemoteValue(e.target.value)}
                  placeholder="e.g. 192.168.0.0/24"
                  fullWidth
                  error={hasAttemptedSubmit && !remoteValue.trim()}
                />
                {hasAttemptedSubmit && !remoteValue.trim() && (
                  <p className="text-body-sm text-[var(--color-state-danger)] leading-4">
                    CIDR is required
                  </p>
                )}
              </>
            ) : (
              <>
                <Select
                  options={securityGroups}
                  value={remoteValue}
                  onChange={(value) => setRemoteValue(value)}
                  placeholder="Select a security group"
                  fullWidth
                  error={hasAttemptedSubmit && !remoteValue.trim()}
                />
                {hasAttemptedSubmit && !remoteValue.trim() && (
                  <p className="text-body-sm text-[var(--color-state-danger)] leading-4">
                    Security group is required
                  </p>
                )}
              </>
            )}
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default CreateSecurityGroupRuleDrawer;
