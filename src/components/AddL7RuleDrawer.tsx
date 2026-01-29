import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, Toggle } from '@/design-system';
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
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!compareType || !value.trim()) return;
    if (ruleTypesWithKey.includes(ruleType) && !key.trim()) return;

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
    onClose();
  };

  const requiresKey = ruleTypesWithKey.includes(ruleType);

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
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Rule Type
          </label>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Select the part of the incoming request to inspect, such as the URL path or a specific
            HTTP header.
          </p>
          <Select
            value={ruleType}
            onChange={(value) => {
              setRuleType(value as RuleType);
              setKey(''); // Reset key when rule type changes
            }}
            options={ruleTypeOptions}
            fullWidth
          />

          {/* Key Input (shown for HEADER, COOKIE, SSL_DN_FIELD) */}
          {requiresKey && (
            <>
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={
                  ruleType === 'HEADER'
                    ? 'e.g. User-Agent'
                    : ruleType === 'COOKIE'
                      ? 'e.g. session_id'
                      : 'e.g. CN'
                }
                fullWidth
              />
              <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
                Allowed: 1–255 characters, letters, numbers, "-".
              </p>
            </>
          )}
        </VStack>

        {/* Compare Type */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Compare Type
          </label>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Select how the value is compared. Regex is for advanced matching.
          </p>
          <Select
            value={compareType}
            onChange={(value) => setCompareType(value as CompareType | '')}
            options={[{ value: '', label: 'Select a compare type' }, ...compareTypeOptions]}
            fullWidth
            error={hasAttemptedSubmit && !compareType}
          />
          {hasAttemptedSubmit && !compareType && (
            <p className="text-body-sm text-[var(--color-state-danger)] leading-4">
              Compare type is required
            </p>
          )}
        </VStack>

        {/* Value */}
        <VStack gap={2} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Value
          </label>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Enter the value or pattern to match.
          </p>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a value to compare"
            fullWidth
            error={hasAttemptedSubmit && !value.trim()}
          />
          {hasAttemptedSubmit && !value.trim() ? (
            <p className="text-body-sm text-[var(--color-state-danger)] leading-4">
              Value is required
            </p>
          ) : (
            <p className="text-body-sm text-[var(--color-text-subtle)] leading-4">
              Allowed: 1–255 characters.
            </p>
          )}
        </VStack>

        {/* Invert */}
        <VStack gap={3} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Invert
          </label>
          <HStack gap={2} className="items-center">
            <Toggle checked={invert} onChange={(e) => setInvert(e.target.checked)} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {invert ? 'On' : 'Off'}
            </span>
          </HStack>
        </VStack>

        {/* Admin State */}
        <VStack gap={3} className="w-full">
          <label className="text-label-lg text-[var(--color-text-default)] leading-5">
            Admin State
          </label>
          <HStack gap={2} className="items-center">
            <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {adminStateUp ? 'Up' : 'Down'}
            </span>
          </HStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AddL7RuleDrawer;
