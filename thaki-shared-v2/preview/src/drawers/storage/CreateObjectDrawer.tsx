import { useState, useEffect, useRef } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../hooks/useDrawerAnimation';

export interface CreateObjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  containerPath?: string;
}

export function CreateObjectDrawer({
  isOpen,
  onClose,
  containerPath = '/default/container',
}: CreateObjectDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [objectName, setObjectName] = useState('');
  const [contentType, setContentType] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setObjectName('');
      setContentType('');
      setNameError(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!objectName.trim()) {
      setNameError('Please enter an object name.');
      return;
    }
    setNameError(null);
    onClose();
  };

  const triggerFilePick = () => fileInputRef.current?.click();

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Create object"
      description="Upload an object to this container."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Upload"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Container path" values={[containerPath]} />
        </div>

        <FormField label="Object name" required error={nameError || undefined}>
          <Input
            value={objectName}
            onChange={(e) => {
              setObjectName(e.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Enter object name"
            error={!!nameError}
          />
        </FormField>

        <FormField label="Content type">
          <Input
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            placeholder="application/octet-stream"
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <span className="text-12 font-medium text-text">File</span>
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            onChange={() => {}}
          />
          <button
            type="button"
            onClick={triggerFilePick}
            className="flex flex-col items-center justify-center gap-2 min-h-[120px] rounded-lg border border-dashed border-border bg-surface-subtle px-4 py-6 cursor-pointer text-12 text-text-muted hover:bg-surface-muted transition-colors"
          >
            Drag &amp; drop or click to upload
          </button>
        </div>
      </div>
    </Overlay.Template>
  );
}
