import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { Toggle } from '@shared/components/Toggle';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface LockSettingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName?: string;
  initialLocked?: boolean;
}

export function LockSettingDrawer({
  isOpen,
  onClose,
  instanceName = 'my-instance',
  initialLocked = false,
}: LockSettingDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [locked, setLocked] = useState(initialLocked);

  useEffect(() => {
    if (isOpen) {
      setLocked(initialLocked);
    }
  }, [isOpen, initialLocked]);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Lock setting"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Instance name" values={[instanceName]} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Lock status</span>
            <span className="text-12 text-text-muted">
              When locked, the instance cannot be modified or deleted.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={locked} onChange={(e) => setLocked(e.target.checked)} />
            <span className="text-12 text-text">{locked ? 'Locked' : 'Unlocked'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
