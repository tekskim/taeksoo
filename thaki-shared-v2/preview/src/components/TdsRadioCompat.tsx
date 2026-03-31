import { createContext, useContext, useId, type ReactNode } from 'react';
import { RadioButton } from '@shared/components/RadioButton';

type GroupCtx = {
  name: string;
  value: string | number;
  onChange: (v: string | number) => void;
};

const RadioGroupContext = createContext<GroupCtx | null>(null);
const StandaloneNameContext = createContext<string | null>(null);

export function RadioGroup({
  value,
  onChange,
  children,
  name: nameProp,
}: {
  value: string | number;
  onChange: (v: string | number) => void;
  children: ReactNode;
  name?: string;
}) {
  const id = useId();
  const name = nameProp ?? `rg-${id.replace(/:/g, '')}`;
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div className="flex flex-col gap-[var(--radio-group-item-gap,6px)] items-start">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function StandaloneRadioScope({ children }: { children: ReactNode }) {
  const id = useId();
  return (
    <StandaloneNameContext.Provider value={`sr-${id.replace(/:/g, '')}`}>
      <div className="flex flex-col gap-[var(--radio-group-item-gap,6px)] items-start">
        {children}
      </div>
    </StandaloneNameContext.Provider>
  );
}

export function Radio({
  value,
  label,
  checked: checkedProp,
  onChange: onChangeProp,
  disabled,
}: {
  value: string;
  label?: ReactNode;
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
}) {
  const group = useContext(RadioGroupContext);
  const standaloneName = useContext(StandaloneNameContext);
  const fallbackId = useId();

  const name = group?.name ?? standaloneName ?? `r-${fallbackId.replace(/:/g, '')}`;
  const inGroup = group != null;
  const checked = inGroup ? String(group.value) === String(value) : !!checkedProp;

  const handleChange = (v: string | number) => {
    if (inGroup) {
      group.onChange(v);
    } else if (String(v) === String(value)) {
      onChangeProp?.();
    }
  };

  const textLabel =
    typeof label === 'string' || typeof label === 'number' ? String(label) : undefined;

  return (
    <div className="flex flex-row gap-2 items-center min-w-0 w-full">
      <RadioButton
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        label={textLabel ?? ' '}
        className={textLabel ? undefined : '[&>span]:hidden'}
      />
      {label != null && textLabel == null ? (
        <div className="flex flex-1 min-w-0 items-center gap-1 text-body-md text-[var(--color-text-default)]">
          {label}
        </div>
      ) : null}
    </div>
  );
}
