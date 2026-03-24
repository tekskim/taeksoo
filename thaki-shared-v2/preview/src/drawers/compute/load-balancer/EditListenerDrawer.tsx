import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Toggle } from '@shared/components/Toggle';
import { Dropdown } from '@shared/components/Dropdown';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

const PROTOCOL_OPTIONS = [
  { value: 'HTTP', label: 'HTTP' },
  { value: 'HTTPS', label: 'HTTPS' },
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
];

export interface EditListenerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listenerId?: string;
  initialData?: {
    name: string;
    description: string;
    protocol: string;
    port: string;
    connectionLimit: string;
    adminUp: boolean;
  };
}

export function EditListenerDrawer({
  isOpen,
  onClose,
  listenerId = 'ln-00000000',
  initialData,
}: EditListenerDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [protocol, setProtocol] = useState(initialData?.protocol ?? 'HTTPS');
  const [port, setPort] = useState(initialData?.port ?? '443');
  const [connectionLimit, setConnectionLimit] = useState(initialData?.connectionLimit ?? '-1');
  const [adminUp, setAdminUp] = useState(initialData?.adminUp ?? true);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setProtocol(initialData?.protocol ?? 'HTTPS');
      setPort(initialData?.port ?? '443');
      setConnectionLimit(initialData?.connectionLimit ?? '-1');
      setAdminUp(initialData?.adminUp ?? true);
      setNameError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Please enter a name.');
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
      title="Edit listener"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Listener ID" values={[listenerId]} />
        </div>

        <FormField label="Name" required error={nameError || undefined}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter name"
            error={!!nameError}
            size="sm"
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

        <FormField label="Protocol">
          <Dropdown.Select
            value={protocol}
            onChange={(v) => setProtocol(String(v))}
            placeholder="Select protocol"
            size="sm"
          >
            {PROTOCOL_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <FormField label="Port">
          <Input
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="443"
            size="sm"
          />
        </FormField>

        <FormField label="Connection limit">
          <Input
            type="number"
            value={connectionLimit}
            onChange={(e) => setConnectionLimit(e.target.value)}
            placeholder="-1 for unlimited"
            size="sm"
          />
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Admin state</span>
            <span className="text-12 text-text-muted">
              Controls whether the listener accepts traffic.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={adminUp} onChange={(e) => setAdminUp(e.target.checked)} />
            <span className="text-12 text-text">{adminUp ? 'Up' : 'Down'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
