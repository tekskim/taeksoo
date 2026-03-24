import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Toggle } from '@shared/components/Toggle';
import { Dropdown } from '@shared/components/Dropdown';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

const ALGORITHM_OPTIONS = [
  { value: 'ROUND_ROBIN', label: 'ROUND_ROBIN' },
  { value: 'LEAST_CONNECTIONS', label: 'LEAST_CONNECTIONS' },
  { value: 'SOURCE_IP', label: 'SOURCE_IP' },
  { value: 'SOURCE_IP_PORT', label: 'SOURCE_IP_PORT' },
];

const PERSISTENCE_OPTIONS = [
  { value: 'None', label: 'None' },
  { value: 'SOURCE_IP', label: 'SOURCE_IP' },
  { value: 'HTTP_COOKIE', label: 'HTTP_COOKIE' },
  { value: 'APP_COOKIE', label: 'APP_COOKIE' },
];

export interface EditPoolDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  poolId?: string;
  initialData?: {
    name: string;
    description: string;
    algorithm: string;
    sessionPersistence: string;
    adminUp: boolean;
  };
}

export function EditPoolDrawer({
  isOpen,
  onClose,
  poolId = 'pl-00000000',
  initialData,
}: EditPoolDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [algorithm, setAlgorithm] = useState(initialData?.algorithm ?? 'ROUND_ROBIN');
  const [sessionPersistence, setSessionPersistence] = useState(
    initialData?.sessionPersistence ?? 'None'
  );
  const [adminUp, setAdminUp] = useState(initialData?.adminUp ?? true);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setAlgorithm(initialData?.algorithm ?? 'ROUND_ROBIN');
      setSessionPersistence(initialData?.sessionPersistence ?? 'None');
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
      title="Edit pool"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Pool ID" values={[poolId]} />
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

        <FormField label="Algorithm">
          <Dropdown.Select
            value={algorithm}
            onChange={(v) => setAlgorithm(String(v))}
            placeholder="Select algorithm"
            size="sm"
          >
            {ALGORITHM_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <FormField label="Session persistence">
          <Dropdown.Select
            value={sessionPersistence}
            onChange={(v) => setSessionPersistence(String(v))}
            placeholder="Select session persistence"
            size="sm"
          >
            {PERSISTENCE_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Admin state</span>
            <span className="text-12 text-text-muted">
              Controls whether the pool receives traffic.
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
