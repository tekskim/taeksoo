import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface ExtendVolumeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
  /** Current size label, e.g. "100 GiB" */
  currentSizeLabel?: string;
  /** Current size in GiB for validation */
  currentSizeGiB?: number;
}

export function ExtendVolumeDrawer({
  isOpen,
  onClose,
  volumeName = 'my-volume',
  currentSizeLabel = '100 GiB',
  currentSizeGiB = 100,
}: ExtendVolumeDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const minGiB = currentSizeGiB + 1;
  const [newSizeGiB, setNewSizeGiB] = useState(String(minGiB));
  const [sizeError, setSizeError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewSizeGiB(String(currentSizeGiB + 1));
      setSizeError(null);
    }
  }, [isOpen, currentSizeGiB]);

  const handleSubmit = () => {
    const n = Number(newSizeGiB);
    if (!Number.isFinite(n) || n < minGiB) {
      setSizeError(`Enter a size greater than ${currentSizeGiB} GiB.`);
      return;
    }
    setSizeError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Extend volume"
      description="Extend the volume size. This cannot be undone."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Extend"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Volume name" values={[volumeName]} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-12 font-medium text-text">Current size</span>
          <span className="text-12 text-text">{currentSizeLabel}</span>
        </div>

        <FormField label="New size (GiB)" required error={sizeError || undefined}>
          <Input
            type="number"
            min={minGiB}
            value={newSizeGiB}
            onChange={(e) => {
              setNewSizeGiB(e.target.value);
              if (sizeError) setSizeError(null);
            }}
            placeholder={`Min ${minGiB}`}
            error={!!sizeError}
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
