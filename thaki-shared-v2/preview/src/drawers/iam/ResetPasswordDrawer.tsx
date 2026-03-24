import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { RadioButton } from '@shared/components/RadioButton';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

type PasswordMode = 'auto' | 'manual';

export interface ResetPasswordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function ResetPasswordDrawer({
  isOpen,
  onClose,
  userName = 'admin-user',
}: ResetPasswordDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [mode, setMode] = useState<PasswordMode>('auto');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode('auto');
      setPassword('');
      setConfirmPassword('');
      setPasswordError(null);
      setConfirmError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (mode === 'manual') {
      if (!password.trim()) {
        setPasswordError('Please enter a password.');
        setConfirmError(null);
        return;
      }
      if (password !== confirmPassword) {
        setConfirmError('Passwords do not match.');
        setPasswordError(null);
        return;
      }
    }
    setPasswordError(null);
    setConfirmError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Reset password"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Reset"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Username" values={[userName]} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-12 font-medium text-text">Password option</span>
          <div className="flex flex-col gap-2">
            <RadioButton
              name="resetPasswordMode"
              value="auto"
              label="Auto-generate"
              checked={mode === 'auto'}
              onChange={() => setMode('auto')}
            />
            <RadioButton
              name="resetPasswordMode"
              value="manual"
              label="Manual"
              checked={mode === 'manual'}
              onChange={() => setMode('manual')}
            />
          </div>
        </div>

        {mode === 'manual' && (
          <div className="flex flex-col gap-4 p-4 border border-border-subtle rounded-md bg-surface-subtle">
            <FormField label="Password" required error={passwordError || undefined}>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                placeholder="Enter new password"
                error={!!passwordError}
              />
            </FormField>
            <FormField label="Confirm password" required error={confirmError || undefined}>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) setConfirmError(null);
                }}
                placeholder="Confirm new password"
                error={!!confirmError}
              />
            </FormField>
          </div>
        )}
      </div>
    </Overlay.Template>
  );
}
