import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateTransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
}

export function CreateTransferDrawer({
  isOpen,
  onClose,
  volumeName = 'my-volume',
}: CreateTransferDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [transferName, setTransferName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTransferName('');
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!transferName.trim()) {
      setNameError('Please enter a transfer name.');
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
      title="Create volume transfer"
      description="Create a volume transfer request to move this volume to another project."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Volume name" values={[volumeName]} />
        </div>

        <FormField label="Transfer name" required error={nameError || undefined}>
          <Input
            value={transferName}
            onChange={(e) => {
              setTransferName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter transfer name"
            error={!!nameError}
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
