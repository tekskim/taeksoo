import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, Toggle, Disclosure, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconInfinity } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface QuotaInfo {
  used: number;
  total: number | null; // null means unlimited
}

export interface CreateSubnetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  networkId?: string;
  networkName?: string;
  subnetQuota?: QuotaInfo;
  onSubmit?: (data: SubnetFormData) => void;
}

export interface SubnetFormData {
  name: string;
  cidr: string;
  gatewayEnabled: boolean;
  gatewayIp: string;
  dhcpEnabled: boolean;
  allocationPools: string;
  dns: string;
  hostRoutes: string;
}

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
  const percentage = !isUnlimited && total > 0 ? (used / total) * 100 : 0;
  const nextPercentage = !isUnlimited && total > 0 ? ((used + 1) / total) * 100 : 0;

  return (
    <VStack gap={2} className="w-full">
      <HStack className="w-full justify-between items-center">
        <span className="text-label-lg text-[var(--color-text-default)] leading-5">{label}</span>
        <HStack gap={0} align="center">
          <span className="text-body-md text-[var(--color-text-default)] leading-4">{used}/</span>
          {isUnlimited ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" />
          ) : (
            <span className="text-body-md text-[var(--color-text-default)] leading-4">{total}</span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg relative overflow-hidden">
        {/* Current usage (darker green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[var(--color-state-success)] rounded-lg z-[2]"
          style={{ width: isUnlimited ? '5%' : `${Math.min(percentage, 100)}%` }}
        />
        {/* Next usage preview (lighter green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[var(--color-state-success-bg)] rounded-lg z-[1]"
          style={{ width: isUnlimited ? '10%' : `${Math.min(nextPercentage, 100)}%` }}
        />
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   CreateSubnetDrawer Component
   ---------------------------------------- */

export function CreateSubnetDrawer({
  isOpen,
  onClose,
  networkId,
  networkName,
  subnetQuota = { used: 5, total: 10 },
  onSubmit,
}: CreateSubnetDrawerProps) {
  // Form state
  const [subnetName, setSubnetName] = useState('private-net-subnet-002');
  const [cidr, setCidr] = useState('192.168.1.0/24');
  const [gatewayEnabled, setGatewayEnabled] = useState(true);
  const [gatewayIp, setGatewayIp] = useState('10.0.2.0.1');
  const [dhcpEnabled, setDhcpEnabled] = useState(true);
  const [allocationPools, setAllocationPools] = useState('');
  const [dns, setDns] = useState('');
  const [hostRoutes, setHostRoutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Advanced options disclosure state
  const [showAdvanced, setShowAdvanced] = useState(true);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSubnetName('private-net-subnet-002');
      setCidr('192.168.1.0/24');
      setGatewayEnabled(true);
      setGatewayIp('10.0.2.0.1');
      setDhcpEnabled(true);
      setAllocationPools('');
      setDns('');
      setHostRoutes('');
      setShowAdvanced(true);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!cidr.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: subnetName,
        cidr,
        gatewayEnabled,
        gatewayIp,
        dhcpEnabled,
        allocationPools,
        dns,
        hostRoutes,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubnetName('private-net-subnet-002');
    setCidr('192.168.1.0/24');
    setGatewayEnabled(true);
    setGatewayIp('10.0.2.0.1');
    setDhcpEnabled(true);
    setAllocationPools('');
    setDns('');
    setHostRoutes('');
    setHasAttemptedSubmit(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Subnet"
      width={696}
      footer={
        <VStack gap={4} className="w-full">
          {/* Quota Section */}
          <VStack gap={4} className="w-full">
            <QuotaProgressBar
              label="Subnet quota"
              used={subnetQuota.used}
              total={subnetQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <HStack gap={2} justify="center" className="w-full">
            <Button variant="secondary" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header */}
        {/* Subnet Name */}
        <FormField required>
          <FormField.Label>Subnet Name</FormField.Label>
          <FormField.Control>
            <Input value={subnetName} onChange={(e) => setSubnetName(e.target.value)} fullWidth />
          </FormField.Control>
          <FormField.HelperText>
            You can use letters, numbers, and special characters (+=,.@-_), and the length must be
            between 2-128 characters.
          </FormField.HelperText>
        </FormField>

        {/* CIDR */}
        <FormField required error={hasAttemptedSubmit && !cidr.trim()}>
          <FormField.Label>CIDR</FormField.Label>
          <FormField.Description>
            Defines the network address (CIDR) for the subnet.
          </FormField.Description>
          <FormField.Control>
            <Input
              value={cidr}
              onChange={(e) => setCidr(e.target.value)}
              fullWidth
              error={hasAttemptedSubmit && !cidr.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>CIDR is required</FormField.ErrorMessage>
        </FormField>

        {/* Gateway */}
        <FormField spacing="loose" required>
          <FormField.Label>Gateway</FormField.Label>
          <FormField.Description>
            Specifies the gateway IP address for the subnet. Gateway must be an IP address within
            the subnet range, excluding the network and broadcast addresses.
          </FormField.Description>
          <VStack gap={2}>
            <Toggle
              checked={gatewayEnabled}
              onChange={(e) => setGatewayEnabled(e.target.checked)}
              label={gatewayEnabled ? 'On' : 'Off'}
            />
            {gatewayEnabled && (
              <Input value={gatewayIp} onChange={(e) => setGatewayIp(e.target.value)} fullWidth />
            )}
          </VStack>
        </FormField>

        {/* Advanced Options Disclosure */}
        <Disclosure open={showAdvanced} onChange={setShowAdvanced}>
          <Disclosure.Trigger>Advanced options</Disclosure.Trigger>
          <Disclosure.Panel>
            <VStack gap={6} className="mt-6 pb-5">
              {/* DHCP */}
              <FormField label="DHCP" spacing="loose">
                <Toggle
                  checked={dhcpEnabled}
                  onChange={(e) => setDhcpEnabled(e.target.checked)}
                  label={dhcpEnabled ? 'Up' : 'Down'}
                />
              </FormField>

              {/* Allocation Pools */}
              <FormField>
                <FormField.Label>Allocation pools</FormField.Label>
                <FormField.Description>
                  Manually define the range of IP addresses to be automatically allocated by DHCP.
                  IPs outside this range will not be allocated, which is useful for reserving static
                  IPs.
                </FormField.Description>
                <FormField.Control>
                  <Textarea
                    value={allocationPools}
                    onChange={(e) => setAllocationPools(e.target.value)}
                    placeholder="e.g. 192.168.0.100,192.168.0.200"
                    fullWidth
                    rows={3}
                  />
                </FormField.Control>
                <FormField.HelperText>
                  Enter one IP address allocation range per line.
                </FormField.HelperText>
              </FormField>

              {/* DNS */}
              <FormField>
                <FormField.Label>DNS</FormField.Label>
                <FormField.Description>
                  The address of the server that acts like a phonebook for the internet, translating
                  domain names into IP addresses for your instances.
                </FormField.Description>
                <FormField.Control>
                  <Textarea
                    value={dns}
                    onChange={(e) => setDns(e.target.value)}
                    placeholder="e.g. 8.8.8.8"
                    fullWidth
                    rows={3}
                  />
                </FormField.Control>
                <FormField.HelperText>Enter one DNS server address per line.</FormField.HelperText>
              </FormField>

              {/* Host Routes */}
              <FormField>
                <FormField.Label>Host Routes</FormField.Label>
                <FormField.Description>
                  An advanced feature for manually specifying a route to a specific network
                  destination.
                </FormField.Description>
                <FormField.Control>
                  <Textarea
                    value={hostRoutes}
                    onChange={(e) => setHostRoutes(e.target.value)}
                    placeholder="e.g. 10.10.0.0/24,192.168.0.254"
                    fullWidth
                    rows={3}
                  />
                </FormField.Control>
                <FormField.HelperText>
                  Enter the destination CIDR and the next hop IP address.
                </FormField.HelperText>
              </FormField>
            </VStack>
          </Disclosure.Panel>
        </Disclosure>
      </VStack>
    </Drawer>
  );
}

export default CreateSubnetDrawer;
