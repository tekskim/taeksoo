import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import InfoContainer from '@shared/components/InfoContainer/InfoContainer';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

export interface EditMemberDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  memberId?: string;
  initialData?: { name: string; weight: number; adminUp: boolean };
}

export function EditMemberDrawer({
  isOpen,
  onClose,
  memberId = 'mb-00000000',
  initialData,
}: EditMemberDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [name, setName] = useState(initialData?.name ?? '');
  const [weight, setWeight] = useState(String(initialData?.weight ?? 1));
  const [adminUp, setAdminUp] = useState(initialData?.adminUp ?? true);
  const [weightError, setWeightError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? '');
      setWeight(String(initialData?.weight ?? 1));
      setAdminUp(initialData?.adminUp ?? true);
      setWeightError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    const w = Number(weight);
    if (Number.isNaN(w) || w < 1 || w > 256) {
      setWeightError('Weight must be between 1 and 256.');
      return;
    }
    setWeightError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Edit member"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-col gap-3">
          <InfoContainer label="Member ID" values={[memberId]} />
        </div>

        <FormField label="Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            size="sm"
          />
        </FormField>

        <FormField label="Weight" error={weightError || undefined}>
          <Input
            type="number"
            min={1}
            max={256}
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              if (weightError) setWeightError(null);
            }}
            placeholder="1–256"
            error={!!weightError}
            size="sm"
          />
        </FormField>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Admin state</span>
            <span className="text-12 text-text-muted">
              When down, the member is excluded from rotation.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={adminUp} onChange={(e) => setAdminUp(e.target.checked)} />
            <span className="text-12 text-text">{adminUp ? 'Up' : 'Down'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
