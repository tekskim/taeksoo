import { useState, useEffect, useRef } from 'react';
import { Drawer, Button, Textarea, Select, Toggle, FormField, DatePicker } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconCalendar } from '@tabler/icons-react';

export interface CreateAPIKeyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    description: string;
    expiration: string;
    customDate: Date | null;
    active: boolean;
  }) => void;
}

const expirationOptions = [
  { value: '1d', label: '1 days' },
  { value: '5d', label: '5 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '365d', label: '365 days' },
  { value: 'custom', label: 'Custom date' },
  { value: 'never', label: 'Never expires' },
];

function formatDateTag(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function CustomDatePicker({
  value,
  onChange,
}: {
  value: Date | null;
  onChange: (d: Date | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | null>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setPendingDate(value);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        const el = target instanceof Element ? target : target.parentElement;
        if (el?.closest('[role="listbox"]')) return;
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        className={`flex items-center gap-2 w-full h-[var(--input-height-md)] px-[var(--input-padding-x)] bg-[var(--color-surface-default)] border rounded-[var(--input-radius)] text-body-md cursor-pointer transition-colors ${value ? 'border-[var(--color-border-focus)]' : open ? 'border-[var(--color-border-focus)]' : 'border-[var(--color-border-strong)] hover:border-[var(--color-border-focus)]'}`}
        onClick={() => setOpen((p) => !p)}
      >
        <IconCalendar size={14} stroke={1.5} className="shrink-0 text-[var(--color-text-subtle)]" />
        <span
          className={value ? 'text-[var(--color-text-default)]' : 'text-[var(--color-text-subtle)]'}
        >
          {value ? formatDateTag(value) : 'Select expiration date'}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-50">
          <DatePicker
            value={pendingDate}
            onChange={setPendingDate}
            showActions
            onApply={(d) => {
              onChange(d);
              setOpen(false);
            }}
            onCancel={() => {
              setPendingDate(value);
              setOpen(false);
            }}
            minDate={new Date()}
          />
        </div>
      )}
    </div>
  );
}

export function CreateAPIKeyDrawer({ isOpen, onClose, onSubmit }: CreateAPIKeyDrawerProps) {
  const [description, setDescription] = useState('');
  const [expiration, setExpiration] = useState('never');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setExpiration('never');
      setCustomDate(null);
      setActive(true);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit?.({ description, expiration, customDate, active });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create API key"
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Create
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField
          label="Description"
          helperText="You can use letters, numbers, and special characters (+=,.@-_()[]), and maximum 255 characters."
        >
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            maxLength={255}
            fullWidth
          />
        </FormField>

        <FormField
          label="Expiration"
          description="The expiration date cannot be changed after the key is created."
        >
          <VStack gap={2}>
            <Select
              options={expirationOptions}
              value={expiration}
              onChange={(val) => {
                setExpiration(val);
                if (val !== 'custom') setCustomDate(null);
              }}
              fullWidth
            />
            {expiration === 'custom' && (
              <CustomDatePicker value={customDate} onChange={setCustomDate} />
            )}
          </VStack>
        </FormField>

        <FormField
          label="Status"
          description="Sets the activation state of the access key. Active enables the key, and Deactivated disables it."
          spacing="loose"
        >
          <HStack gap={2} align="center">
            <Toggle checked={active} onChange={setActive} />
            <span className="text-body-md text-[var(--color-text-default)]">
              {active ? 'Active' : 'Deactivated'}
            </span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default CreateAPIKeyDrawer;
