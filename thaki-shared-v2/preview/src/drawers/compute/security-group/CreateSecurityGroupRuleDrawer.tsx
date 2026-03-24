import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { RadioButton } from '@shared/components/RadioButton';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

type Direction = 'ingress' | 'egress';
type EtherType = 'ipv4' | 'ipv6';

const PROTOCOL_OPTIONS = [
  { value: 'tcp', label: 'TCP' },
  { value: 'udp', label: 'UDP' },
  { value: 'icmp', label: 'ICMP' },
  { value: 'any', label: 'Any' },
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
  const [etherType, setEtherType] = useState<EtherType>('ipv4');
  const [protocol, setProtocol] = useState(PROTOCOL_OPTIONS[0].value);
  const [portMin, setPortMin] = useState('');
  const [portMax, setPortMax] = useState('');
  const [remotePrefix, setRemotePrefix] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDirection('ingress');
      setEtherType('ipv4');
      setProtocol(PROTOCOL_OPTIONS[0].value);
      setPortMin('');
      setPortMax('');
      setRemotePrefix('');
      setRuleDescription('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Create security group rule"
      description="Add a new rule to this security group."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Security Group name" values={[securityGroupName]} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-12 font-medium text-text">Direction</span>
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
          <span className="text-12 font-medium text-text">Ether type</span>
          <div className="flex flex-col gap-2">
            <RadioButton
              name="sgRuleEther"
              value="ipv4"
              label="IPv4"
              checked={etherType === 'ipv4'}
              onChange={() => setEtherType('ipv4')}
            />
            <RadioButton
              name="sgRuleEther"
              value="ipv6"
              label="IPv6"
              checked={etherType === 'ipv6'}
              onChange={() => setEtherType('ipv6')}
            />
          </div>
        </div>

        <FormField label="Protocol">
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
        </FormField>

        <FormField label="Port range min">
          <Input
            value={portMin}
            onChange={(e) => setPortMin(e.target.value)}
            placeholder="e.g. 80"
            size="sm"
          />
        </FormField>

        <FormField label="Port range max">
          <Input
            value={portMax}
            onChange={(e) => setPortMax(e.target.value)}
            placeholder="e.g. 80"
            size="sm"
          />
        </FormField>

        <FormField label="Remote IP prefix">
          <Input
            value={remotePrefix}
            onChange={(e) => setRemotePrefix(e.target.value)}
            placeholder="0.0.0.0/0"
            size="sm"
          />
        </FormField>

        <FormField label="Description">
          <Input
            value={ruleDescription}
            onChange={(e) => setRuleDescription(e.target.value)}
            placeholder="Enter description"
            size="sm"
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
