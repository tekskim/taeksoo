import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface EditNetworkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  networkId?: string;
  initialData?: { name: string; adminStateUp?: boolean; shared?: boolean };
}

export function EditNetworkDrawer({
  isOpen,
  onClose,
  networkId = 'net-00000000',
  initialData,
}: EditNetworkDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState(initialData?.name ?? '');
  const [adminStateUp, setAdminStateUp] = useState(initialData?.adminStateUp ?? true);
  const [shared, setShared] = useState(initialData?.shared ?? false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setAdminStateUp(initialData?.adminStateUp ?? true);
      setShared(initialData?.shared ?? false);
      setNameError(null);
    }
  }, [isOpen, initialData?.name, initialData?.adminStateUp, initialData?.shared]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Please enter a network name.');
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
      title="Edit network"
      description="Edit the network's basic information."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Network ID" values={[networkId]} />
        </div>

        <FormField label="Name" required error={nameError || undefined}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter network name"
            error={!!nameError}
          />
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Admin state</span>
            <span className="text-12 text-text-muted">
              When down, the network is administratively disabled.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
            <span className="text-12 text-text">{adminStateUp ? 'Up' : 'Down'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Shared</span>
            <span className="text-12 text-text-muted">
              Allow other projects to use this network.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={shared} onChange={(e) => setShared(e.target.checked)} />
            <span className="text-12 text-text">{shared ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
