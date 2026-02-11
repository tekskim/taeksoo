import { useState, useEffect } from 'react';
import { Drawer, Button, Input, NumberInput, Select, Toggle, FormField } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type HealthMonitorType = 'HTTP' | 'HTTPS' | 'PING' | 'TCP' | 'TLS-HELLO' | 'UDP-CONNECT' | 'SCTP';

export interface PoolInfo {
  id: string;
  name: string;
}

export interface CreateHealthMonitorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pool: PoolInfo;
  onSubmit?: (data: {
    name: string;
    type: HealthMonitorType;
    interval: number;
    timeout: number;
    maxRetries: number;
    adminStateUp: boolean;
  }) => void;
}

/* ----------------------------------------
   Constants
   ---------------------------------------- */

const healthMonitorTypeOptions = [
  { value: 'HTTP', label: 'HTTP' },
  { value: 'HTTPS', label: 'HTTPS' },
  { value: 'PING', label: 'PING' },
  { value: 'TCP', label: 'TCP' },
  { value: 'TLS-HELLO', label: 'TLS-HELLO' },
  { value: 'UDP-CONNECT', label: 'UDP-CONNECT' },
  { value: 'SCTP', label: 'SCTP' },
];

/* ----------------------------------------
   CreateHealthMonitorDrawer Component
   ---------------------------------------- */

export function CreateHealthMonitorDrawer({
  isOpen,
  onClose,
  pool,
  onSubmit,
}: CreateHealthMonitorDrawerProps) {
  const [healthMonitorName, setHealthMonitorName] = useState('');
  const [monitorType, setMonitorType] = useState<HealthMonitorType>('HTTP');
  const [interval, setInterval] = useState(5);
  const [timeout, setTimeout] = useState(3);
  const [maxRetries, setMaxRetries] = useState(3);
  const [adminStateUp, setAdminStateUp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setHealthMonitorName(`hm-${pool.name}`);
      setMonitorType('HTTP');
      setInterval(5);
      setTimeout(3);
      setMaxRetries(3);
      setAdminStateUp(true);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, pool.name]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    // Validation: timeout must be less than interval
    if (timeout >= interval) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        name: healthMonitorName,
        type: monitorType,
        interval,
        timeout,
        maxRetries,
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

  // Validation
  const isTimeoutValid = timeout < interval && timeout >= 1 && timeout <= 3599;
  const isIntervalValid = interval >= 1 && interval <= 3600;
  const isMaxRetriesValid = maxRetries >= 1 && maxRetries <= 10;

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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="pb-6">
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Create Health Monitor
          </h2>
        </VStack>

        {/* Pool Name (Read-only) */}
        <FormField>
          <FormField.Label>Pool name</FormField.Label>
          <FormField.Control>
            <Input value={pool.name} readOnly disabled fullWidth />
          </FormField.Control>
        </FormField>

        {/* Health Monitor Name */}
        <FormField>
          <FormField.Label>
            Health Monitor Name{' '}
            <span className="text-body-md text-[var(--color-text-subtle)]">(Optional)</span>
          </FormField.Label>
          <FormField.Control>
            <Input
              value={healthMonitorName}
              onChange={(e) => setHealthMonitorName(e.target.value)}
              placeholder="e.g. hm-pool-http"
              fullWidth
            />
          </FormField.Control>
          <FormField.HelperText>
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </FormField.HelperText>
        </FormField>

        {/* Type */}
        <FormField>
          <FormField.Label>Type</FormField.Label>
          <FormField.Control>
            <Select
              value={monitorType}
              onChange={(value) => setMonitorType(value as HealthMonitorType)}
              options={healthMonitorTypeOptions}
              fullWidth
            />
          </FormField.Control>
        </FormField>

        {/* Interval (sec) */}
        <FormField error={hasAttemptedSubmit && !isIntervalValid}>
          <FormField.Label>Interval (sec)</FormField.Label>
          <FormField.Description>Time between consecutive health checks.</FormField.Description>
          <FormField.Control>
            <NumberInput
              value={interval}
              onChange={(value) => setInterval(value ?? 1)}
              min={1}
              max={3600}
              fullWidth
              error={hasAttemptedSubmit && !isIntervalValid}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Interval must be between 1-3600</FormField.ErrorMessage>
          <FormField.HelperText>1 ~ 3600; Timeout &lt; Delay</FormField.HelperText>
        </FormField>

        {/* Timeout (sec) */}
        <FormField error={hasAttemptedSubmit && !isTimeoutValid}>
          <FormField.Label>Timeout (sec)</FormField.Label>
          <FormField.Description>Maximum time to wait for response</FormField.Description>
          <FormField.Control>
            <NumberInput
              value={timeout}
              onChange={(value) => setTimeout(value ?? 1)}
              min={1}
              max={3599}
              fullWidth
              error={hasAttemptedSubmit && !isTimeoutValid}
            />
          </FormField.Control>
          <FormField.ErrorMessage>
            Timeout must be between 1-3599 and less than Interval
          </FormField.ErrorMessage>
          <FormField.HelperText>1 ~ 3599; Timeout &lt; Delay</FormField.HelperText>
        </FormField>

        {/* Max Retries */}
        <FormField error={hasAttemptedSubmit && !isMaxRetriesValid}>
          <FormField.Label>Max retries</FormField.Label>
          <FormField.Description>
            Number of failed attempts before marking member OFFLINE.
          </FormField.Description>
          <FormField.Control>
            <NumberInput
              value={maxRetries}
              onChange={(value) => setMaxRetries(value ?? 1)}
              min={1}
              max={10}
              fullWidth
              error={hasAttemptedSubmit && !isMaxRetriesValid}
            />
          </FormField.Control>
          <FormField.ErrorMessage>Max retries must be between 1-10</FormField.ErrorMessage>
          <FormField.HelperText>1 ~ 10</FormField.HelperText>
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

export default CreateHealthMonitorDrawer;
