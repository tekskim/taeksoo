import { Overlay } from '@shared/components/Overlay';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface DisassociateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  floatingIpAddress?: string;
  /** e.g. "port-web-01 · instance-01" */
  associatedTo?: string;
}

export function DisassociateFloatingIPDrawer({
  isOpen,
  onClose,
  floatingIpAddress = '203.0.113.50',
  associatedTo = 'port-web-01 · instance-01',
}: DisassociateFloatingIPDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);

  const handleSubmit = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="md"
      title="Disassociate floating IP"
      description="Remove the floating IP association."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Disassociate"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Floating IP" values={[floatingIpAddress]} />
          <InfoContainer label="Currently associated to" values={[associatedTo]} />
        </div>
      </div>
    </Overlay.Template>
  );
}
