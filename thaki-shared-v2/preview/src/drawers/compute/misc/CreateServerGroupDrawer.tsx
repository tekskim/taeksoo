import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Dropdown } from '@shared/components/Dropdown';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export type ServerGroupPolicyOption =
  | 'anti-affinity'
  | 'affinity'
  | 'soft-anti-affinity'
  | 'soft-affinity';

export interface CreateServerGroupDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const POLICY_OPTIONS: { value: ServerGroupPolicyOption; label: string }[] = [
  { value: 'anti-affinity', label: 'Anti-affinity' },
  { value: 'affinity', label: 'Affinity' },
  { value: 'soft-anti-affinity', label: 'Soft anti-affinity' },
  { value: 'soft-affinity', label: 'Soft affinity' },
];

export function CreateServerGroupDrawer({ isOpen, onClose }: CreateServerGroupDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState('');
  const [policy, setPolicy] = useState<ServerGroupPolicyOption>('anti-affinity');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setPolicy('anti-affinity');
      setNameError(null);
    }
  }, [isOpen]);

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
      title="Create server group"
      description="Create a new server group."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
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

        <FormField label="Policy" required>
          <Dropdown.Select
            value={policy}
            onChange={(v) => setPolicy(v as ServerGroupPolicyOption)}
            placeholder="Select policy"
            size="sm"
          >
            {POLICY_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>
      </div>
    </Overlay.Template>
  );
}
