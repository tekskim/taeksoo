import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

export interface MoveFilesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount?: number;
}

export function MoveFilesDrawer({ isOpen, onClose, selectedCount = 0 }: MoveFilesDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [destinationPath, setDestinationPath] = useState('');
  const [overwrite, setOverwrite] = useState(false);
  const [pathError, setPathError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDestinationPath('');
      setOverwrite(false);
      setPathError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!destinationPath.trim()) {
      setPathError('Please enter a destination path.');
      return;
    }
    setPathError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Move files"
      description="Move selected files to a different location."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Move"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        {selectedCount > 0 ? (
          <p className="text-12 text-text-muted">
            <span className="font-medium text-text">{selectedCount}</span> file
            {selectedCount === 1 ? '' : 's'} selected
          </p>
        ) : null}

        <FormField label="Destination path" required error={pathError || undefined}>
          <Input
            value={destinationPath}
            onChange={(e) => {
              setDestinationPath(e.target.value);
              if (pathError) setPathError(null);
            }}
            placeholder="/container/path"
            error={!!pathError}
          />
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Overwrite existing</span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
              checkedLabel="On"
              uncheckedLabel="Off"
            />
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
