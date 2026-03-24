import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Textarea } from '@shared/components/Textarea';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface EditKeyPairDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  keyPairName?: string;
  initialDescription?: string;
}

export function EditKeyPairDrawer({
  isOpen,
  onClose,
  keyPairName = 'my-key-pair',
  initialDescription = '',
}: EditKeyPairDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription);
    }
  }, [isOpen, initialDescription]);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Edit key pair"
      description="Update the key pair description."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Key pair name" values={[keyPairName]} />
        </div>

        <FormField label="Description">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
            size="sm"
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
