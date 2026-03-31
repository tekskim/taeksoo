import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface AcceptVolumeTransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AcceptVolumeTransferDrawer({ isOpen, onClose }: AcceptVolumeTransferDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [transferId, setTransferId] = useState('');
  const [authKey, setAuthKey] = useState('');
  const [transferIdError, setTransferIdError] = useState<string | null>(null);
  const [authKeyError, setAuthKeyError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTransferId('');
      setAuthKey('');
      setTransferIdError(null);
      setAuthKeyError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    let invalid = false;
    if (!transferId.trim()) {
      setTransferIdError('Please enter a transfer ID.');
      invalid = true;
    } else {
      setTransferIdError(null);
    }
    if (!authKey.trim()) {
      setAuthKeyError('Please enter an authorization key.');
      invalid = true;
    } else {
      setAuthKeyError(null);
    }
    if (invalid) return;
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Accept volume transfer"
      description="Accept a volume transfer using the transfer ID and authorization key."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Accept"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField label="Transfer ID" required error={transferIdError || undefined}>
          <Input
            value={transferId}
            onChange={(e) => {
              setTransferId(e.target.value);
              if (transferIdError) setTransferIdError(null);
            }}
            placeholder="Enter transfer ID"
            error={!!transferIdError}
          />
        </FormField>

        <FormField label="Authorization key" required error={authKeyError || undefined}>
          <Input
            type="password"
            value={authKey}
            onChange={(e) => {
              setAuthKey(e.target.value);
              if (authKeyError) setAuthKeyError(null);
            }}
            placeholder="Enter authorization key"
            error={!!authKeyError}
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
