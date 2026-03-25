import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Textarea } from '@shared/components/Textarea';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface EditPortDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portId?: string;
  initialData?: {
    name?: string;
    description?: string;
    adminStateUp?: boolean;
    bindingHost?: string;
  };
}

export function EditPortDrawer({
  isOpen,
  onClose,
  portId = 'port-00000000',
  initialData,
}: EditPortDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [adminUp, setAdminUp] = useState(initialData?.adminStateUp ?? true);
  const [bindingHost, setBindingHost] = useState(initialData?.bindingHost ?? '');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setAdminUp(initialData?.adminStateUp ?? true);
      setBindingHost(initialData?.bindingHost ?? '');
    }
  }, [
    isOpen,
    initialData?.name,
    initialData?.description,
    initialData?.adminStateUp,
    initialData?.bindingHost,
  ]);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Edit port"
      description="Edit the port's name and description. These changes update basic information only."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Port ID" values={[portId]} />
        </div>

        <FormField label="Port name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter port name"
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
              When down, the port is administratively disabled.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={adminUp} onChange={(e) => setAdminUp(e.target.checked)} />
            <span className="text-12 text-text">{adminUp ? 'Up' : 'Down'}</span>
          </div>
        </div>

        <FormField label="Binding host">
          <Input
            value={bindingHost}
            onChange={(e) => setBindingHost(e.target.value)}
            placeholder="Enter host ID"
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
