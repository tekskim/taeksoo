import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateAllowedAddressPairDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portName?: string;
}

export function CreateAllowedAddressPairDrawer({
  isOpen,
  onClose,
  portName = 'instance-01-eth0',
}: CreateAllowedAddressPairDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [ipAddress, setIpAddress] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [ipError, setIpError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIpAddress('');
      setMacAddress('');
      setIpError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!ipAddress.trim()) {
      setIpError('Please enter an IP address.');
      return;
    }
    setIpError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Create allowed address pair"
      description="Add an allowed address pair to this port."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Add"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Port name" values={[portName]} />
        </div>

        <FormField label="IP address" required error={ipError || undefined}>
          <Input
            value={ipAddress}
            onChange={(e) => {
              setIpAddress(e.target.value);
              if (ipError) setIpError(null);
            }}
            placeholder="192.168.1.100"
            size="sm"
            error={!!ipError}
          />
        </FormField>

        <FormField label="MAC address">
          <Input
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
            placeholder="optional"
            size="sm"
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
