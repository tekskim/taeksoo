import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { RadioButton } from '@shared/components/RadioButton';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateSubnetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  networkName?: string;
}

export function CreateSubnetDrawer({
  isOpen,
  onClose,
  networkName = 'my-network',
}: CreateSubnetDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [subnetName, setSubnetName] = useState('');
  const [cidr, setCidr] = useState('');
  const [ipVersion, setIpVersion] = useState<'ipv4' | 'ipv6'>('ipv4');
  const [gatewayIp, setGatewayIp] = useState('');
  const [dhcpEnabled, setDhcpEnabled] = useState(true);
  const [allocationPools, setAllocationPools] = useState('');
  const [subnetNameError, setSubnetNameError] = useState<string | null>(null);
  const [cidrError, setCidrError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubnetName('');
      setCidr('');
      setIpVersion('ipv4');
      setGatewayIp('');
      setDhcpEnabled(true);
      setAllocationPools('');
      setSubnetNameError(null);
      setCidrError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    let ok = true;
    if (!subnetName.trim()) {
      setSubnetNameError('Please enter a subnet name.');
      ok = false;
    } else setSubnetNameError(null);
    if (!cidr.trim()) {
      setCidrError('Please enter a CIDR.');
      ok = false;
    } else setCidrError(null);
    if (!ok) return;
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Create subnet"
      description="Create a new subnet in this network."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Network name" values={[networkName]} />
        </div>

        <FormField label="Subnet name" required error={subnetNameError || undefined}>
          <Input
            value={subnetName}
            onChange={(e) => {
              setSubnetName(e.target.value);
              if (subnetNameError) setSubnetNameError(null);
            }}
            placeholder="Enter subnet name"
            error={!!subnetNameError}
          />
        </FormField>

        <FormField label="CIDR" required error={cidrError || undefined}>
          <Input
            value={cidr}
            onChange={(e) => {
              setCidr(e.target.value);
              if (cidrError) setCidrError(null);
            }}
            placeholder="192.168.0.0/24"
            error={!!cidrError}
          />
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-13 font-medium text-text">IP version</span>
          </div>
          <div className="flex flex-col gap-2">
            <RadioButton
              name="subnetIpVersion"
              value="ipv4"
              label="IPv4"
              checked={ipVersion === 'ipv4'}
              onChange={() => setIpVersion('ipv4')}
            />
            <RadioButton
              name="subnetIpVersion"
              value="ipv6"
              label="IPv6"
              checked={ipVersion === 'ipv6'}
              onChange={() => setIpVersion('ipv6')}
            />
          </div>
        </div>

        <FormField label="Gateway IP">
          <Input
            value={gatewayIp}
            onChange={(e) => setGatewayIp(e.target.value)}
            placeholder="e.g. 192.168.0.1"
          />
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Enable DHCP</span>
            <span className="text-12 text-text-muted">
              Automatically assign IPs to instances on this subnet.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={dhcpEnabled} onChange={(e) => setDhcpEnabled(e.target.checked)} />
            <span className="text-12 text-text">{dhcpEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>

        <FormField label="Allocation pools" hint="Optional range in start-end format.">
          <Input
            value={allocationPools}
            onChange={(e) => setAllocationPools(e.target.value)}
            placeholder="start-end"
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
