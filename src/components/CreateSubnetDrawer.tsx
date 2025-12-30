import { useState } from 'react';
import {
  Drawer,
  Button,
  Input,
  Toggle,
  Disclosure,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CreateSubnetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subnetQuota?: { used: number; total: number };
  onCreate?: (data: {
    subnetName?: string;
    cidr: string;
    gatewayEnabled: boolean;
    gatewayIp?: string;
    dhcpEnabled: boolean;
    allocationPools?: string;
    dns?: string;
    hostRoutes?: string;
  }) => void;
}

/* ----------------------------------------
   Quota Bar Component
   ---------------------------------------- */

function QuotaBar({ label, used, total }: { label: string; used: number; total: number }) {
  const percentage = Math.min((used / total) * 100, 100);

  return (
    <VStack gap={2} className="w-full">
      <HStack justifyContent="between" className="w-full">
        <span className="text-[14px] font-medium text-[var(--color-text-default)]">{label}</span>
        <span className="text-[12px] text-[var(--color-text-default)]">
          {used}/{total}
        </span>
      </HStack>
      <div className="w-full h-1 bg-[var(--color-surface-muted)] rounded-full overflow-hidden flex">
        <div
          className="h-full rounded-full bg-[var(--color-state-success)]"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="h-full rounded-full bg-[#bbf7d0] -ml-1"
          style={{ width: `${percentage}%` }}
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
  subnetQuota = { used: 5, total: 10 },
  onCreate,
}: CreateSubnetDrawerProps) {
  const [subnetName, setSubnetName] = useState('private-net-subnet-002');
  const [cidr, setCidr] = useState('192.168.1.0/24');
  const [gatewayEnabled, setGatewayEnabled] = useState(true);
  const [gatewayIp, setGatewayIp] = useState('10.0.2.0.1');
  const [dhcpEnabled, setDhcpEnabled] = useState(true);
  const [allocationPools, setAllocationPools] = useState('');
  const [dns, setDns] = useState('');
  const [hostRoutes, setHostRoutes] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!cidr.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate?.({
        subnetName: subnetName.trim() || undefined,
        cidr: cidr.trim(),
        gatewayEnabled,
        gatewayIp: gatewayEnabled ? gatewayIp.trim() : undefined,
        dhcpEnabled,
        allocationPools: allocationPools.trim() || undefined,
        dns: dns.trim() || undefined,
        hostRoutes: hostRoutes.trim() || undefined,
      });
      handleClose();
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
    setIsAdvancedOpen(true);
    onClose();
  };

  const isFormValid = cidr.trim().length > 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Subnet"
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={isSubmitting || !isFormValid}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Subnet Name (Optional) */}
        <VStack gap={2} className="w-full">
          <HStack gap={1.5} alignItems="center">
            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
              Subnet Name
            </span>
            <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
          </HStack>
          <Input
            value={subnetName}
            onChange={(e) => setSubnetName(e.target.value)}
            className="w-full"
          />
          <p className="text-[11px] text-[var(--color-text-subtle)]">
            Allowed: 1-128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* CIDR */}
        <VStack gap={2} className="w-full">
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">CIDR</span>
          <Input value={cidr} onChange={(e) => setCidr(e.target.value)} className="w-full" />
          <p className="text-[11px] text-[var(--color-text-subtle)]">
            It is recommended that you use the private network address 10.0.0.0/8, 172.16.0.0/12,
            192.168.0.0/16
          </p>
        </VStack>

        {/* Gateway */}
        <VStack gap={3} className="w-full">
          <span className="text-[14px] font-medium text-[var(--color-text-default)]">Gateway</span>
          <VStack gap={2} className="w-full">
            <HStack gap={2} alignItems="center">
              <Toggle checked={gatewayEnabled} onChange={setGatewayEnabled} />
              <span className="text-[12px] text-[var(--color-text-default)]">
                {gatewayEnabled ? 'On' : 'Off'}
              </span>
            </HStack>
            {gatewayEnabled && (
              <>
                <Input
                  value={gatewayIp}
                  onChange={(e) => setGatewayIp(e.target.value)}
                  className="w-full"
                />
                <p className="text-[11px] text-[var(--color-text-subtle)]">
                  Gateway must be an IP address within the subnet range, excluding the network and
                  broadcast addresses.
                </p>
              </>
            )}
          </VStack>
        </VStack>

        {/* Disclosure for Advanced Options */}
        <Disclosure
          title="Label"
          isOpen={isAdvancedOpen}
          onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          <VStack gap={6} className="w-full pt-2">
            {/* DHCP */}
            <VStack gap={3} className="w-full">
              <span className="text-[14px] font-medium text-[var(--color-text-default)]">DHCP</span>
              <HStack gap={2} alignItems="center">
                <Toggle checked={dhcpEnabled} onChange={setDhcpEnabled} />
                <span className="text-[12px] text-[var(--color-text-default)]">
                  {dhcpEnabled ? 'Up' : 'Down'}
                </span>
              </HStack>
            </VStack>

            {/* Allocation Pools (Optional) */}
            <VStack gap={2} className="w-full">
              <HStack gap={1.5} alignItems="center">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                  Allocation Pools
                </span>
                <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
              </HStack>
              <p className="text-[12px] text-[var(--color-text-subtle)]">
                Manually define the range of IP addresses to be automatically allocated by DHCP. IPs
                outside this range will not be allocated, which is useful for reserving static IPs.
              </p>
              <textarea
                value={allocationPools}
                onChange={(e) => setAllocationPools(e.target.value)}
                placeholder="e.g. 192.168.0.100,192.168.0.200"
                className="w-full min-h-[72px] px-[10px] py-2 text-[12px] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[6px] resize-none focus:outline-none focus:border-[var(--color-action-primary)]"
              />
              <p className="text-[11px] text-[var(--color-text-subtle)]">
                Enter one IP address allocation range per line.
              </p>
            </VStack>

            {/* DNS (Optional) */}
            <VStack gap={2} className="w-full">
              <HStack gap={1.5} alignItems="center">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">DNS</span>
                <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
              </HStack>
              <p className="text-[12px] text-[var(--color-text-subtle)]">
                The address of the server that acts like a phonebook for the internet, translating
                domain names into IP addresses for your instances.
              </p>
              <textarea
                value={dns}
                onChange={(e) => setDns(e.target.value)}
                placeholder="e.g. 8.8.8.8"
                className="w-full min-h-[72px] px-[10px] py-2 text-[12px] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[6px] resize-none focus:outline-none focus:border-[var(--color-action-primary)]"
              />
              <p className="text-[11px] text-[var(--color-text-subtle)]">
                Enter one DNS server address per line.
              </p>
            </VStack>

            {/* Host Routes (Optional) */}
            <VStack gap={2} className="w-full">
              <HStack gap={1.5} alignItems="center">
                <span className="text-[14px] font-medium text-[var(--color-text-default)]">
                  Host Routes
                </span>
                <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
              </HStack>
              <p className="text-[12px] text-[var(--color-text-subtle)]">
                An advanced feature for manually specifying a route to a specific network
                destination.
              </p>
              <textarea
                value={hostRoutes}
                onChange={(e) => setHostRoutes(e.target.value)}
                placeholder="e.g. 10.10.0.0/24,192.168.0.254"
                className="w-full min-h-[72px] px-[10px] py-2 text-[12px] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[6px] resize-none focus:outline-none focus:border-[var(--color-action-primary)]"
              />
              <p className="text-[11px] text-[var(--color-text-subtle)]">
                Enter the destination CIDR and the next hop IP address.
              </p>
            </VStack>
          </VStack>
        </Disclosure>

        {/* Subnet Quota */}
        <VStack gap={6} className="w-full pt-4 border-t border-[var(--color-border-subtle)]">
          <QuotaBar label="Subnet Quota" used={subnetQuota.used} total={subnetQuota.total} />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateSubnetDrawer;


