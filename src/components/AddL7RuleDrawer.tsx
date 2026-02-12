import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type RuleType =
  | 'HEADER'
  | 'COOKIE'
  | 'FILE_TYPE'
  | 'HOST_NAME'
  | 'PATH'
  | 'SSL_CONN_HAS_CERT'
  | 'SSL_VERIFY_RESULT'
  | 'SSL_DN_FIELD';
type CompareType = 'CONTAINS' | 'ENDS_WITH' | 'EQUAL_TO' | 'REGEX' | 'STARTS_WITH';

export interface AddL7RuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    ruleType: RuleType;
    key?: string;
    compareType: CompareType;
    value: string;
    invert: boolean;
    adminStateUp: boolean;
  }) => void;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const ruleTypeOptions = [
  { value: 'HEADER', label: 'HEADER' },
  { value: 'COOKIE', label: 'COOKIE' },
  { value: 'FILE_TYPE', label: 'FILE_TYPE' },
  { value: 'HOST_NAME', label: 'HOST_NAME' },
  { value: 'PATH', label: 'PATH' },
  { value: 'SSL_CONN_HAS_CERT', label: 'SSL_CONN_HAS_CERT' },
  { value: 'SSL_VERIFY_RESULT', label: 'SSL_VERIFY_RESULT' },
  { value: 'SSL_DN_FIELD', label: 'SSL_DN_FIELD' },
];

const compareTypeOptions = [
  { value: 'CONTAINS', label: 'CONTAINS' },
  { value: 'ENDS_WITH', label: 'ENDS_WITH' },
  { value: 'EQUAL_TO', label: 'EQUAL_TO' },
  { value: 'REGEX', label: 'REGEX' },
  { value: 'STARTS_WITH', label: 'STARTS_WITH' },
];

// Rule types that require a key field
const ruleTypesWithKey: RuleType[] = ['HEADER', 'COOKIE', 'SSL_DN_FIELD'];

/* ----------------------------------------
   AddL7RuleDrawer Component
   ---------------------------------------- */

export function AddL7RuleDrawer({ isOpen, onClose, onSubmit }: AddL7RuleDrawerProps) {
  const [ruleType, setRuleType] = useState<RuleType>('HEADER');
  const [key, setKey] = useState('');
  const [compareType, setCompareType] = useState<CompareType | ''>('');
  const [value, setValue] = useState('');
  const [invert, setInvert] = useState(false);
  const [adminStateUp, setAdminStateUp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setRuleType('HEADER');
      setKey('');
      setCompareType('');
      setValue('');
      setInvert(false);
      setAdminStateUp(true);
      setHasAttemptedSubmit(false);
      setKeyError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    // Validate all fields together
    let hasError = false;

    if (requiresKey) {
      const error = validateKey(key);
      setKeyError(error);
      if (error) hasError = true;
    } else {
      setKeyError(null);
    }

    if (!compareType || !value.trim()) hasError = true;

    if (hasError) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        ruleType,
        key: ruleTypesWithKey.includes(ruleType) ? key : undefined,
        compareType: compareType as CompareType,
        value,
        invert,
        adminStateUp,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    setKeyError(null);
    onClose();
  };

  const requiresKey = ruleTypesWithKey.includes(ruleType);

  const validateKey = (val: string): string | null => {
    if (!val.trim()) return 'Key is required for this rule type';
    if (val.length > 255) return 'Key must be 255 characters or fewer';
    if (!/^[a-zA-Z0-9-]+$/.test(val)) return 'Key can only contain letters, numbers, and "-"';
    return null;
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={376}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1 h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-8"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="pb-6">
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Add L7 Rule
          </h2>
        </VStack>

        {/* Rule Type */}
        <FormField>
          <FormField.Label>Rule type</FormField.Label>
          <FormField.Description>
            Select the part of the incoming request to inspect, such as the URL path or a specific
            HTTP header.
          </FormField.Description>
          <FormField.Control>
            <Select
              value={ruleType}
              onChange={(value) => {
                setRuleType(value as RuleType);
                setKey('');
                setKeyError(null);
              }}
              options={ruleTypeOptions}
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Key Input (shown for HEADER, COOKIE, SSL_DN_FIELD) */}
        {requiresKey && (
          <FormField required error={!!keyError}>
            <FormField.Label>Key</FormField.Label>
            <FormField.Control>
              <Input
                value={key}
                onChange={(e) => {
                  const newVal = e.target.value;
                  setKey(newVal);
                  if (hasAttemptedSubmit) {
                    setKeyError(validateKey(newVal));
                  } else if (keyError) {
                    setKeyError(null);
                  }
                }}
                placeholder={
                  ruleType === 'HEADER'
                    ? 'e.g. User-Agent'
                    : ruleType === 'COOKIE'
                      ? 'e.g. session_id'
                      : 'e.g. CN'
                }
                fullWidth
                error={!!keyError}
              />
            </FormField.Control>
            {keyError && <FormField.ErrorMessage>{keyError}</FormField.ErrorMessage>}
            <FormField.HelperText>
              Allowed: 1–255 characters, letters, numbers, "-".
            </FormField.HelperText>
          </FormField>
        )}

        {/* Compare Type */}
        <FormField required error={hasAttemptedSubmit && !compareType}>
          <FormField.Label>Compare type</FormField.Label>
          <FormField.Description>
            Select how the value is compared. Regex is for advanced matching.
          </FormField.Description>
          <FormField.Control>
            <Select
              value={compareType}
              onChange={(value) => setCompareType(value as CompareType | '')}
              options={[{ value: '', label: 'Select a compare type' }, ...compareTypeOptions]}
              fullWidth
              error={hasAttemptedSubmit && !compareType}
            />
          </FormField.Control>
          {hasAttemptedSubmit && !compareType && (
            <FormField.ErrorMessage>Compare type is required</FormField.ErrorMessage>
          )}
        </FormField>

        {/* Value */}
        <FormField required error={hasAttemptedSubmit && !value.trim()}>
          <FormField.Label>Value</FormField.Label>
          <FormField.Description>Enter the value or pattern to match.</FormField.Description>
          <FormField.Control>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a value to compare"
              fullWidth
              error={hasAttemptedSubmit && !value.trim()}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Value is required</FormField.ErrorMessage>
          <FormField.HelperText>Allowed: 1–255 characters.</FormField.HelperText>
        </FormField>

        {/* Invert */}
        <FormField>
          <FormField.Label>Invert</FormField.Label>
          <FormField.Control>
            <HStack gap={2} className="items-center">
              <Toggle checked={invert} onChange={(e) => setInvert(e.target.checked)} />
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {invert ? 'On' : 'Off'}
              </span>
            </HStack>
          </FormField.Control>
        </FormField>

        {/* Admin State */}
        <FormField>
          <FormField.Label>Admin state</FormField.Label>
          <FormField.Control>
            <HStack gap={2} className="items-center">
              <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {adminStateUp ? 'Up' : 'Down'}
              </span>
            </HStack>
          </FormField.Control>
        </FormField>
      </VStack>
    </Drawer>
  );
}

export default AddL7RuleDrawer;
