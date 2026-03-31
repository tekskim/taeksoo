import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Textarea } from '@shared/components/Textarea';
import { Dropdown } from '@shared/components/Dropdown';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

const EXTERNAL_NETWORKS = [
  { value: 'ext-pool-a', label: 'ext-pool-a (public)' },
  { value: 'ext-gw-dmz', label: 'ext-gw-dmz' },
  { value: 'nat-shared-01', label: 'nat-shared-01' },
];

export interface CreateRouterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRouterDrawer({ isOpen, onClose }: CreateRouterDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [routerName, setRouterName] = useState('');
  const [description, setDescription] = useState('');
  const [adminUp, setAdminUp] = useState(true);
  const [externalNetwork, setExternalNetwork] = useState<string>(EXTERNAL_NETWORKS[0].value);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRouterName('');
      setDescription('');
      setAdminUp(true);
      setExternalNetwork(EXTERNAL_NETWORKS[0].value);
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!routerName.trim()) {
      setNameError('Please enter a router name.');
      return;
    }
    setNameError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Create router"
      description="Create a virtual router to route traffic between different networks or subnets."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField label="Router name" required error={nameError || undefined}>
          <Input
            value={routerName}
            onChange={(e) => {
              setRouterName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter router name"
            error={!!nameError}
          />
        </FormField>

        <FormField label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
            size="sm"
          />
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Admin state</span>
            <span className="text-12 text-text-muted">
              When down, the router is administratively disabled.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={adminUp} onChange={(e) => setAdminUp(e.target.checked)} />
            <span className="text-12 text-text">{adminUp ? 'Up' : 'Down'}</span>
          </div>
        </div>

        <FormField label="External network">
          <Dropdown.Select
            value={externalNetwork}
            onChange={(v) => setExternalNetwork(String(v))}
            placeholder="Select external network"
            size="sm"
          >
            {EXTERNAL_NETWORKS.map((n) => (
              <Dropdown.Option key={n.value} value={n.value} label={n.label} />
            ))}
          </Dropdown.Select>
        </FormField>
      </div>
    </Overlay.Template>
  );
}
