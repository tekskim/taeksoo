import { Dropdown } from '@shared/components/Dropdown';
import type { OptionValue } from '@shared/components/Dropdown/Dropdown.types';

export type TdsSelectOption = { value: string | number; label: string; disabled?: boolean };

type Props = {
  options?: TdsSelectOption[];
  value?: OptionValue | null;
  onChange?: (v: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Maps legacy TDS `<Select options={...} />` to shared `Dropdown.Select`. */
export function Select({
  options = [],
  value,
  onChange,
  placeholder,
  fullWidth,
  disabled,
  className,
}: Props) {
  const mergedClass = [fullWidth && 'w-full', className].filter(Boolean).join(' ') || undefined;
  return (
    <Dropdown.Select
      className={mergedClass}
      disabled={disabled}
      value={value ?? ''}
      onChange={(v) => onChange?.(String(v))}
      placeholder={placeholder ?? ''}
    >
      {options.map((opt) => (
        <Dropdown.Option
          key={String(opt.value)}
          value={opt.value}
          label={opt.label}
          disabled={opt.disabled}
        />
      ))}
    </Dropdown.Select>
  );
}
