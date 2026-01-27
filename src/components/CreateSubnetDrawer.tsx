import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Textarea, Toggle, Disclosure } from '@/design-system';
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
        <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
          {label}
        </span>
        <HStack gap={0} align="center">
          <span className="text-[12px] text-[var(--color-text-default)] leading-4">{used}/</span>
          {isUnlimited ? (
            <IconInfinity size={16} className="text-[var(--color-text-default)]" />
          ) : (
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">{total}</span>
          )}
        </HStack>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-border-subtle)] rounded-lg relative overflow-hidden">
        {/* Current usage (darker green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[#4ade80] rounded-lg z-[2]"
          style={{ width: isUnlimited ? '5%' : `${Math.min(percentage, 100)}%` }}
        />
        {/* Next usage preview (lighter green) */}
        <div
          className="absolute left-0 top-0 h-full bg-[#bbf7d0] rounded-lg z-[1]"
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
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <VStack gap={4} className="w-full">
          {/* Quota Section */}
          <VStack gap={4} className="w-full">
            <QuotaProgressBar
              label="Subnet Quota"
              used={subnetQuota.used}
              total={subnetQuota.total}
            />
          </VStack>

          {/* Buttons */}
          <HStack gap={2} justify="center" className="w-full">
            <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[152px] h-8"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header */}
        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
          Create Subnet
        </h2>

        {/* Subnet Name */}
        <VStack gap={2}>
          <HStack gap={1.5} align="center">
            <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Subnet Name
            </span>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              (Optional)
            </span>
          </HStack>
          <Input value={subnetName} onChange={(e) => setSubnetName(e.target.value)} fullWidth />
          <span className="text-[11px] text-[var(--color-text-subtle)]">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </span>
        </VStack>

        {/* CIDR */}
        <VStack gap={2}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            CIDR
          </span>
          <Input
            value={cidr}
            onChange={(e) => setCidr(e.target.value)}
            fullWidth
            error={hasAttemptedSubmit && !cidr.trim()}
          />
          {hasAttemptedSubmit && !cidr.trim() ? (
            <span className="text-[11px] text-[var(--color-state-danger)]">CIDR is required</span>
          ) : (
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              It is recommended that you use the private network address 10.0.0.0/8, 172.16.0.0/12,
              192.168.0.0/16
            </span>
          )}
        </VStack>

        {/* Gateway */}
        <VStack gap={3}>
          <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Gateway
          </span>
          <VStack gap={2}>
            <Toggle
              checked={gatewayEnabled}
              onChange={(e) => setGatewayEnabled(e.target.checked)}
              label={gatewayEnabled ? 'On' : 'Off'}
            />
            {gatewayEnabled && (
              <>
                <Input value={gatewayIp} onChange={(e) => setGatewayIp(e.target.value)} fullWidth />
                <span className="text-[11px] text-[var(--color-text-subtle)]">
                  Gateway must be an IP address within the subnet range, excluding the network and
                  broadcast addresses.
                </span>
              </>
            )}
          </VStack>
        </VStack>

        {/* Advanced Options Disclosure */}
        <Disclosure open={showAdvanced} onChange={setShowAdvanced}>
          <Disclosure.Trigger>Advanced Options</Disclosure.Trigger>
          <Disclosure.Panel>
            <VStack gap={6} className="mt-6">
              {/* DHCP */}
              <VStack gap={3}>
                <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                  DHCP
                </span>
                <Toggle
                  checked={dhcpEnabled}
                  onChange={(e) => setDhcpEnabled(e.target.checked)}
                  label={dhcpEnabled ? 'Up' : 'Down'}
                />
              </VStack>

              {/* Allocation Pools */}
              <VStack gap={2}>
                <HStack gap={1.5} align="center">
                  <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                    Allocation Pools
                  </span>
                  <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                    (Optional)
                  </span>
                </HStack>
                <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                  Manually define the range of IP addresses to be automatically allocated by DHCP.
                  IPs outside this range will not be allocated, which is useful for reserving static
                  IPs.
                </span>
                <Textarea
                  value={allocationPools}
                  onChange={(e) => setAllocationPools(e.target.value)}
                  placeholder="e.g. 192.168.0.100,192.168.0.200"
                  fullWidth
                  rows={3}
                />
                <span className="text-[11px] text-[var(--color-text-subtle)]">
                  Enter one IP address allocation range per line.
                </span>
              </VStack>

              {/* DNS */}
              <VStack gap={2}>
                <HStack gap={1.5} align="center">
                  <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                    DNS
                  </span>
                  <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                    (Optional)
                  </span>
                </HStack>
                <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                  The address of the server that acts like a phonebook for the internet, translating
                  domain names into IP addresses for your instances.
                </span>
                <Textarea
                  value={dns}
                  onChange={(e) => setDns(e.target.value)}
                  placeholder="e.g. 8.8.8.8"
                  fullWidth
                  rows={3}
                />
                <span className="text-[11px] text-[var(--color-text-subtle)]">
                  Enter one DNS server address per line.
                </span>
              </VStack>

              {/* Host Routes */}
              <VStack gap={2} className="pb-5">
                <HStack gap={1.5} align="center">
                  <span className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
                    Host Routes
                  </span>
                  <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                    (Optional)
                  </span>
                </HStack>
                <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
                  An advanced feature for manually specifying a route to a specific network
                  destination.
                </span>
                <Textarea
                  value={hostRoutes}
                  onChange={(e) => setHostRoutes(e.target.value)}
                  placeholder="e.g. 10.10.0.0/24,192.168.0.254"
                  fullWidth
                  rows={3}
                />
                <span className="text-[11px] text-[var(--color-text-subtle)]">
                  Enter the destination CIDR and the next hop IP address.
                </span>
              </VStack>
            </VStack>
          </Disclosure.Panel>
        </Disclosure>
      </VStack>
    </Drawer>
  );
}

export default CreateSubnetDrawer;
