import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, Select, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FirewallInfo {
  id: string;
  name: string;
  description: string;
  ingressPolicyId: string;
  egressPolicyId: string;
  adminStateUp: boolean;
}

export interface PolicyOption {
  value: string;
  label: string;
}

export interface EditFirewallDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  firewall: FirewallInfo;
  ingressPolicies?: PolicyOption[];
  egressPolicies?: PolicyOption[];
  onSubmit?: (data: {
    name: string;
    description: string;
    ingressPolicyId: string;
    egressPolicyId: string;
    adminStateUp: boolean;
  }) => void;
}

/* ----------------------------------------
   Default Options
   ---------------------------------------- */

const defaultIngressPolicies: PolicyOption[] = [
  { value: 'policy-1', label: 'ingress-policy-1' },
  { value: 'policy-2', label: 'ingress-policy-2' },
  { value: 'policy-3', label: 'ingress-policy-3' },
];

const defaultEgressPolicies: PolicyOption[] = [
  { value: 'policy-1', label: 'egress-policy-1' },
  { value: 'policy-2', label: 'egress-policy-2' },
  { value: 'policy-3', label: 'egress-policy-3' },
];

/* ----------------------------------------
   EditFirewallDrawer Component
   ---------------------------------------- */

export function EditFirewallDrawer({
  isOpen,
  onClose,
  firewall,
  ingressPolicies = defaultIngressPolicies,
  egressPolicies = defaultEgressPolicies,
  onSubmit,
}: EditFirewallDrawerProps) {
  const [firewallName, setFirewallName] = useState('');
  const [description, setDescription] = useState('');
  const [ingressPolicy, setIngressPolicy] = useState('');
  const [egressPolicy, setEgressPolicy] = useState('');
  const [adminStateUp, setAdminStateUp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && firewall) {
      setFirewallName(firewall.name);
      setDescription(firewall.description);
      setIngressPolicy(firewall.ingressPolicyId);
      setEgressPolicy(firewall.egressPolicyId);
      setAdminStateUp(firewall.adminStateUp);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
      setNameError(null);
    }
  }, [isOpen, firewall]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!firewallName.trim()) {
      setNameError('Please enter a firewall name.');
      return;
    }
    setNameError(null);

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: firewallName,
        description,
        ingressPolicyId: ingressPolicy,
        egressPolicyId: egressPolicy,
        adminStateUp,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setNameError(null);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit firewall"
      width={360}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Firewall name */}
        <FormField
          label="Firewall name"
          helperText="You can use letters, numbers, and special characters (+=,.@-_), and the length must be between 2-128 characters."
          error={hasAttemptedSubmit && !!nameError}
          required
        >
          <Input
            value={firewallName}
            onChange={(e) => {
              setFirewallName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter policy name"
            fullWidth
            error={hasAttemptedSubmit && !!nameError}
          />
          {hasAttemptedSubmit && nameError && (
            <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
          )}
        </FormField>

        {/* Description */}
        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            fullWidth
            rows={2}
          />
        </FormField>

        {/* Ingress Policy */}
        <FormField label="Ingress Policy">
          <FormField.Description>
            Select the ingress policy to apply to the firewall.
          </FormField.Description>
          <FormField.Control>
            <Select
              value={ingressPolicy}
              onChange={(val) => setIngressPolicy(val)}
              options={ingressPolicies}
              placeholder="Select a policy"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Egress Policy */}
        <FormField label="Egress Policy">
          <FormField.Description>
            Select the egress policy to apply to the firewall.
          </FormField.Description>
          <FormField.Control>
            <Select
              value={egressPolicy}
              onChange={(val) => setEgressPolicy(val)}
              options={egressPolicies}
              placeholder="Select a policy"
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Admin state */}
        <FormField label="Admin state" spacing="loose">
          <FormField.Description>
            Indicates whether the policy rules have been audited.
          </FormField.Description>
          <FormField.Control>
            <HStack gap={2} align="center">
              <Toggle checked={adminStateUp} onChange={setAdminStateUp} />
              <span className="text-body-md text-[var(--color-text-default)]">
                {adminStateUp ? 'Up' : 'Down'}
              </span>
            </HStack>
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default EditFirewallDrawer;
