import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

export interface EditSystemAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  initialData?: { email: string; displayName: string; enabled: boolean };
}

export function EditSystemAdminDrawer({
  isOpen,
  onClose,
  userName = 'admin-user',
  initialData,
}: EditSystemAdminDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [email, setEmail] = useState(initialData?.email || '');
  const [displayName, setDisplayName] = useState(initialData?.displayName || '');
  const [enabled, setEnabled] = useState(initialData?.enabled ?? true);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialData?.email || '');
      setDisplayName(initialData?.displayName || '');
      setEnabled(initialData?.enabled ?? true);
      setEmailError(null);
    }
  }, [isOpen, initialData?.email, initialData?.displayName, initialData?.enabled]);

  const handleSubmit = () => {
    if (!email.trim()) {
      setEmailError('Please enter an email address.');
      return;
    }
    setEmailError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Edit system administrator"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Username" values={[userName]} />
        </div>

        <FormField label="Email" required error={emailError || undefined}>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            placeholder="Enter email address"
            error={!!emailError}
          />
        </FormField>

        <FormField label="Display name">
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
          />
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Status</span>
            <span className="text-12 text-text-muted">
              If disabled, this administrator cannot sign in.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            <span className="text-12 text-text">{enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
