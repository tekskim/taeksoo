import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

export interface CreateFolderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

export function CreateFolderDrawer({ isOpen, onClose, currentPath }: CreateFolderDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFolderName('');
      setDescription('');
      setNameError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!folderName.trim()) {
      setNameError('Please enter a folder name.');
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
      title="Create folder"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Create"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        {currentPath ? (
          <div className="flex flex-col gap-3">
            <InfoContainer label="Current path" values={[currentPath]} />
          </div>
        ) : null}

        <FormField label="Folder name" required error={nameError || undefined}>
          <Input
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter folder name"
            error={!!nameError}
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
      </div>
    </Overlay.Template>
  );
}
