import { useState, useEffect } from 'react';
import { Overlay } from '@shared/components/Overlay';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { Toggle } from '@shared/components/Toggle';
import { Dropdown } from '@shared/components/Dropdown';
import { useDrawerAnimation } from '../../../hooks/useDrawerAnimation';

const TYPE_OPTIONS = [
  { value: 'HOST_NAME', label: 'HOST_NAME' },
  { value: 'PATH', label: 'PATH' },
  { value: 'FILE_TYPE', label: 'FILE_TYPE' },
  { value: 'HEADER', label: 'HEADER' },
  { value: 'COOKIE', label: 'COOKIE' },
];

const COMPARE_OPTIONS = [
  { value: 'REGEX', label: 'REGEX' },
  { value: 'STARTS_WITH', label: 'STARTS_WITH' },
  { value: 'ENDS_WITH', label: 'ENDS_WITH' },
  { value: 'CONTAINS', label: 'CONTAINS' },
  { value: 'EQUAL_TO', label: 'EQUAL_TO' },
];

export interface AddL7RuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddL7RuleDrawer({ isOpen, onClose }: AddL7RuleDrawerProps) {
  const { mounted, appeared } = useDrawerAnimation(isOpen);
  const [ruleType, setRuleType] = useState('PATH');
  const [compareType, setCompareType] = useState('EQUAL_TO');
  const [value, setValue] = useState('');
  const [key, setKey] = useState('');
  const [invert, setInvert] = useState(false);
  const [valueError, setValueError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRuleType('PATH');
      setCompareType('EQUAL_TO');
      setValue('');
      setKey('');
      setInvert(false);
      setValueError(null);
    }
  }, [isOpen]);

  const showKey = ruleType === 'HEADER' || ruleType === 'COOKIE';

  const handleSubmit = () => {
    if (!value.trim()) {
      setValueError('Please enter a value.');
      return;
    }
    setValueError(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Add L7 Rule"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={onClose}
      confirmUI="Add"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField label="Type">
          <Dropdown.Select
            value={ruleType}
            onChange={(v) => setRuleType(String(v))}
            placeholder="Select type"
            size="sm"
          >
            {TYPE_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <FormField label="Compare type">
          <Dropdown.Select
            value={compareType}
            onChange={(v) => setCompareType(String(v))}
            placeholder="Select compare type"
            size="sm"
          >
            {COMPARE_OPTIONS.map((opt) => (
              <Dropdown.Option key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Dropdown.Select>
        </FormField>

        <FormField label="Value" required error={valueError || undefined}>
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (valueError) setValueError(null);
            }}
            placeholder="Enter match value"
            error={!!valueError}
            size="sm"
          />
        </FormField>

        {showKey && (
          <FormField label="Key">
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Header or cookie name"
              size="sm"
            />
          </FormField>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-12 font-medium text-text">Invert</span>
            <span className="text-12 text-text-muted">
              When enabled, the rule match is inverted.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={invert} onChange={(e) => setInvert(e.target.checked)} />
            <span className="text-12 text-text">{invert ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </Overlay.Template>
  );
}
