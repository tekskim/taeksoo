import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { RadioButton } from '@shared/components/RadioButton';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

type Direction = 'ingress' | 'egress';
type PortRangeType = 'all' | 'custom';
type RemoteType = 'cidr' | 'security_group';

const PROTOCOL_OPTIONS = [
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

const PORT_RANGE_OPTIONS = [
  { value: 'all', label: 'All ports' },
  { value: 'custom', label: 'Custom' },
];

const REMOTE_TYPE_OPTIONS = [
  { value: 'cidr', label: 'CIDR' },
  { value: 'security_group', label: 'Security group' },
];

export interface CreateSecurityGroupRuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  securityGroupName?: string;
}

export function CreateSecurityGroupRuleDrawer({
  isOpen,
  onClose,
  securityGroupName = 'web-tier',
}: CreateSecurityGroupRuleDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [direction, setDirection] = useState<Direction>('ingress');
  const [protocol, setProtocol] = useState('custom_tcp');
  const [portRangeType, setPortRangeType] = useState<PortRangeType>('custom');
  const [portRange, setPortRange] = useState('');
  const [icmpType, setIcmpType] = useState('');
  const [icmpCode, setIcmpCode] = useState('');
  const [ipProtocol, setIpProtocol] = useState('');
  const [remoteType, setRemoteType] = useState<RemoteType>('cidr');
  const [remoteValue, setRemoteValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDirection('ingress');
      setProtocol('custom_tcp');
      setPortRangeType('custom');
      setPortRange('');
      setIcmpType('');
      setIcmpCode('');
      setIpProtocol('');
      setRemoteType('cidr');
      setRemoteValue('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onClose();
  };

  const isAllProto = protocol === 'all_proto';
  const showPortInput = ['custom_tcp', 'custom_udp'].includes(protocol);
  const showIcmpFields = protocol === 'custom_icmp';
  const showIpProtocol = protocol === 'other_protocol';

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Create rule"
      description="A security group rule defines allowed inbound or outbound network traffic."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Security Group" values={[securityGroupName]} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-12 font-medium text-text">Direction</span>
              <span className="text-12 font-medium text-danger">*</span>
            </div>
            <span className="text-12 text-text-muted">Choose the traffic direction.</span>
          </div>
          <div className="flex flex-col gap-2">
            <RadioButton
              name="sgRuleDirection"
              value="ingress"
              label="Ingress"
              checked={direction === 'ingress'}
              onChange={() => setDirection('ingress')}
            />
            <RadioButton
              name="sgRuleDirection"
              value="egress"
              label="Egress"
              checked={direction === 'egress'}
              onChange={() => setDirection('egress')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-[3px]">
              <span className="text-12 font-medium text-text">Protocol</span>
              <span className="text-12 font-medium text-danger">*</span>
            </div>
            <span className="text-12 text-text-muted">
              Select the protocol to apply to the rule.
            </span>
          </div>
          <Dropdown.Select
            value={protocol}
            onChange={(v) => setProtocol(String(v))}
            placeholder="Select protocol"
            size="sm"
          >
            {PROTOCOL_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </div>

        {showPortInput && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-[3px]">
                <span className="text-12 font-medium text-text">Port range</span>
                <span className="text-12 font-medium text-danger">*</span>
              </div>
              <span className="text-12 text-text-muted">Select the port range to allow.</span>
            </div>
            <Dropdown.Select
              value={portRangeType}
              onChange={(v) => setPortRangeType(String(v) as PortRangeType)}
              size="sm"
            >
              {PORT_RANGE_OPTIONS.map((opt) => (
                <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
              ))}
            </Dropdown.Select>
            {portRangeType === 'custom' && (
              <Input
                value={portRange}
                onChange={(e) => setPortRange(e.target.value)}
                placeholder="e.g. 80 or 1000-2000"
                size="sm"
              />
            )}
          </div>
        )}

        {showIcmpFields && (
          <>
            <FormField label="ICMP type" hint="0-255" required>
              <Input
                value={icmpType}
                onChange={(e) => setIcmpType(e.target.value)}
                placeholder="e.g. 8"
                size="sm"
              />
            </FormField>
            <FormField label="ICMP code" hint="0-255" required>
              <Input
                value={icmpCode}
                onChange={(e) => setIcmpCode(e.target.value)}
                placeholder="e.g. 0"
                size="sm"
              />
            </FormField>
          </>
        )}

        {showIpProtocol && (
          <FormField label="IP Protocol" hint="0-255 (e.g., 6=TCP, 17=UDP, 1=ICMP)" required>
            <Input
              value={ipProtocol}
              onChange={(e) => setIpProtocol(e.target.value)}
              placeholder=""
              size="sm"
            />
          </FormField>
        )}

        {!isAllProto && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-[3px]">
                <span className="text-12 font-medium text-text">Remote</span>
                <span className="text-12 font-medium text-danger">*</span>
              </div>
              <span className="text-12 text-text-muted">
                Select the remote target (CIDR or security group) for the rule.
              </span>
            </div>
            <Dropdown.Select
              value={remoteType}
              onChange={(v) => setRemoteType(String(v) as RemoteType)}
              size="sm"
            >
              {REMOTE_TYPE_OPTIONS.map((opt) => (
                <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
              ))}
            </Dropdown.Select>
            <Input
              value={remoteValue}
              onChange={(e) => setRemoteValue(e.target.value)}
              placeholder={
                remoteType === 'cidr'
                  ? 'Enter CIDR (e.g. 192.168.0.0/24)'
                  : 'Select a security group'
              }
              size="sm"
            />
          </div>
        )}
      </div>
    </Overlay.Template>
  );
}
