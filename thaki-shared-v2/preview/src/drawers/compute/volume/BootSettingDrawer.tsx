import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Toggle } from '@shared/components/Toggle';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface BootSettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volumeName?: string;
  initialBootable?: boolean;
}

export function BootSettingDrawer({
  isOpen,
  onClose,
  volumeName = 'my-volume',
  initialBootable = false,
}: BootSettingDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [bootable, setBootable] = useState(initialBootable);

  useEffect(() => {
    if (isOpen) {
      setBootable(initialBootable);
    }
  }, [isOpen, initialBootable]);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Boot setting"
      description="Set whether this volume can be used as a boot device."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Volume name" values={[volumeName]} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Bootable</span>
            <span className="text-12 text-text-muted">
              Bootable volumes can be attached as a system disk when launching instances.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={bootable} onChange={(e) => setBootable(e.target.checked)} />
            <span className="text-12 text-text">{bootable ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
