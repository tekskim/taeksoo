import { useState, useEffect } from 'react';
import { Drawer, Button, Select, FormField, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface AddDhcpAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  networkName?: string;
  onSubmit?: (agentId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const DHCP_AGENT_OPTIONS = [
  { value: 'agent-01', label: 'dhcp-agent-01 (compute-node-1)' },
  { value: 'agent-02', label: 'dhcp-agent-02 (compute-node-2)' },
  { value: 'agent-03', label: 'dhcp-agent-03 (network-node-1)' },
  { value: 'agent-04', label: 'dhcp-agent-04 (network-node-2)' },
];

/* ----------------------------------------
   AddDhcpAgentDrawer Component
   ---------------------------------------- */

export function AddDhcpAgentDrawer({
  isOpen,
  onClose,
  networkName = 'private-network',
  onSubmit,
}: AddDhcpAgentDrawerProps) {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedAgent('');
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedAgent) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedAgent);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAgent('');
    setHasAttemptedSubmit(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Add DHCP Agent"
      description="Adds a DHCP agent to the network."
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
        <InfoBox label="Network" value={networkName} />

        <FormField
          label="DHCP Agent"
          description="Select a DHCP agent from the list to assign to the network."
          required
          error={hasAttemptedSubmit && !selectedAgent}
          errorMessage="Please select a DHCP agent."
        >
          <Select
            options={DHCP_AGENT_OPTIONS}
            value={selectedAgent}
            onChange={(val) => {
              setSelectedAgent(val);
              if (hasAttemptedSubmit) setHasAttemptedSubmit(false);
            }}
            placeholder="Select DHCP Agent"
            fullWidth
            error={hasAttemptedSubmit && !selectedAgent}
          />
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default AddDhcpAgentDrawer;
