import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  Input,
  Textarea,
  Toggle,
  Select,
  Radio,
  RadioGroup,
  FormField,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

export interface EditRuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rule?: {
    name: string;
    description: string;
    enabled: boolean;
    shared: boolean;
    protocol: string;
    action: string;
    sourceCidr: string;
    sourcePort: string;
    destinationCidr: string;
    destinationPort: string;
  };
  onSubmit?: (data: {
    name: string;
    description: string;
    enabled: boolean;
    shared: boolean;
    protocol: string;
    action: string;
    sourceCidr: string;
    sourcePort: string;
    destinationCidr: string;
    destinationPort: string;
  }) => void;
}

const protocolOptions = [
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
  { value: 'ICMP', label: 'ICMP' },
  { value: 'Any', label: 'Any' },
  { value: 'SSH', label: 'SSH' },
  { value: 'HTTP', label: 'HTTP' },
  { value: 'HTTPS', label: 'HTTPS' },
];

export function EditRuleDrawer({ isOpen, onClose, rule, onSubmit }: EditRuleDrawerProps) {
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [shared, setShared] = useState(false);
  const [protocol, setProtocol] = useState('TCP');
  const [action, setAction] = useState('allow');
  const [sourceCidr, setSourceCidr] = useState('');
  const [sourcePort, setSourcePort] = useState('');
  const [destCidr, setDestCidr] = useState('');
  const [destPort, setDestPort] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (rule) {
        setRuleName(rule.name);
        setDescription(rule.description);
        setEnabled(rule.enabled);
        setShared(rule.shared);
        setProtocol(rule.protocol);
        setAction(rule.action);
        setSourceCidr(rule.sourceCidr);
        setSourcePort(rule.sourcePort);
        setDestCidr(rule.destinationCidr);
        setDestPort(rule.destinationPort);
      } else {
        setRuleName('');
        setDescription('');
        setEnabled(true);
        setShared(false);
        setProtocol('TCP');
        setAction('allow');
        setSourceCidr('');
        setSourcePort('');
        setDestCidr('');
        setDestPort('');
      }
    }
  }, [isOpen, rule]);

  const handleSubmit = () => {
    onSubmit?.({
      name: ruleName,
      description,
      enabled,
      shared,
      protocol,
      action,
      sourceCidr,
      sourcePort,
      destinationCidr: destCidr,
      destinationPort: destPort,
    });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit rule"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Rule name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          required
        >
          <Input value={ruleName} onChange={(e) => setRuleName(e.target.value)} fullWidth />
        </FormField>

        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </FormField>

        <FormField
          label="Enabled"
          description="Indicates whether the rule is enabled."
          spacing="loose"
        >
          <Toggle checked={enabled} onChange={setEnabled} label={enabled ? 'On' : 'Off'} />
        </FormField>

        <FormField
          label="Shared"
          description="Indicates whether the rule is shared with other tenants."
          spacing="loose"
        >
          <Toggle checked={shared} onChange={setShared} label={shared ? 'Yes' : 'No'} />
        </FormField>

        <FormField
          label="Protocol"
          description="Select the protocol to which the rule applies."
          required
        >
          <Select
            options={protocolOptions}
            value={protocol}
            onChange={(v) => setProtocol(v)}
            className="w-[200px]"
          />
        </FormField>

        <FormField
          label="Action"
          description="Choose whether to allow or deny the traffic."
          required
          spacing="loose"
        >
          <RadioGroup value={action} onChange={setAction}>
            <Radio value="allow" label="Allow" />
            <Radio value="deny" label="Deny" />
            <Radio value="reject" label="Reject" />
          </RadioGroup>
        </FormField>

        <FormField
          label="Source CIDR"
          description="Specifies the source network or IP address in CIDR format."
          helperText="Must be entered in CIDR format (IP/prefix)."
        >
          <Input
            placeholder="e.g. 192.168.0.0/24"
            value={sourceCidr}
            onChange={(e) => setSourceCidr(e.target.value)}
            fullWidth
          />
        </FormField>

        <FormField
          label="Source Port"
          description="Specifies the port range to which the rule applies."
          helperText='Must be a number between 1–65535 or a "start–end" range.'
        >
          <Input
            placeholder="e.g. 80 or 80–443"
            value={sourcePort}
            onChange={(e) => setSourcePort(e.target.value)}
            fullWidth
          />
        </FormField>

        <FormField
          label="Destination CIDR"
          description="Specifies the destination network or IP address in CIDR format."
          helperText="Must be entered in CIDR format (IP/prefix)."
        >
          <Input
            placeholder="e.g. 10.0.0.0/16"
            value={destCidr}
            onChange={(e) => setDestCidr(e.target.value)}
            fullWidth
          />
        </FormField>

        <FormField
          label="Destination Port"
          description="Defines the network address (CIDR) for the subnet."
          helperText='Must be a number between 1–65535 or a "start–end" range.'
        >
          <Input
            placeholder="e.g. 443 or 3000–4000"
            value={destPort}
            onChange={(e) => setDestPort(e.target.value)}
            fullWidth
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}
