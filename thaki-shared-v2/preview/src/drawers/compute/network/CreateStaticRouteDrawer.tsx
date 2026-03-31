import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface CreateStaticRouteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routerName?: string;
}

export function CreateStaticRouteDrawer({
  isOpen,
  onClose,
  routerName = 'my-router',
}: CreateStaticRouteDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [destination, setDestination] = useState('');
  const [nextHop, setNextHop] = useState('');
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [nextHopError, setNextHopError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDestination('');
      setNextHop('');
      setDestinationError(null);
      setNextHopError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    let ok = true;
    if (!destination.trim()) {
      setDestinationError('Please enter a destination CIDR.');
      ok = false;
    } else setDestinationError(null);
    if (!nextHop.trim()) {
      setNextHopError('Please enter a next hop.');
      ok = false;
    } else setNextHopError(null);
    if (!ok) return;
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Create static route"
      description="Add a static route to this router."
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Add"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Router name" values={[routerName]} />
        </div>

        <FormField label="Destination CIDR" required error={destinationError || undefined}>
          <Input
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (destinationError) setDestinationError(null);
            }}
            placeholder="10.0.0.0/24"
            error={!!destinationError}
          />
        </FormField>

        <FormField label="Next hop" required error={nextHopError || undefined}>
          <Input
            value={nextHop}
            onChange={(e) => {
              setNextHop(e.target.value);
              if (nextHopError) setNextHopError(null);
            }}
            placeholder="192.168.1.1"
            error={!!nextHopError}
          />
        </FormField>
      </div>
    </Overlay.Template>
  );
}
