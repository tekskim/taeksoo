import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Dropdown } from '@shared/components/Dropdown';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

const ACTION_OPTIONS = [
  { value: 'REDIRECT_TO_POOL', label: 'REDIRECT_TO_POOL' },
  { value: 'REDIRECT_TO_URL', label: 'REDIRECT_TO_URL' },
  { value: 'REJECT', label: 'REJECT' },
];

export interface AddL7PolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddL7PolicyDrawer({ isOpen, onClose }: AddL7PolicyDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState('');
  const [action, setAction] = useState('REDIRECT_TO_POOL');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [position, setPosition] = useState('1');
  const [adminUp, setAdminUp] = useState(true);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setAction('REDIRECT_TO_POOL');
      setRedirectUrl('');
      setPosition('1');
      setAdminUp(true);
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
      title="Add L7 policy"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Add"
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
            placeholder="Enter policy name"
            error={!!nameError}
            size="sm"
          />
        </FormField>

        <FormField label="Action">
          <Dropdown.Select
            value={action}
            onChange={(v) => setAction(String(v))}
            placeholder="Select action"
            size="sm"
          >
            {ACTION_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        {action === 'REDIRECT_TO_URL' && (
          <FormField label="Redirect URL">
            <Input
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://example.com/path"
              size="sm"
            />
          </FormField>
        )}

        <FormField label="Position">
          <Input
            type="number"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="1"
            size="sm"
          />
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Admin state</span>
            <span className="text-12 text-text-muted">Disabled policies are not evaluated.</span>
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
