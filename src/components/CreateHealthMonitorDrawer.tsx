import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, Toggle } from '@/design-system';
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
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="flex-1 h-8"
          >
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
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Create Health Monitor
          </h2>
        </VStack>

        {/* Pool Name (Read-only) */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Pool name
          </label>
          <Input
            value={pool.name}
            readOnly
            disabled
            fullWidth
          />
        </VStack>

        {/* Health Monitor Name */}
        <VStack gap={2} className="w-full">
          <HStack gap={2} className="items-center">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Health Monitor Name
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)]">(Optional)</span>
          </HStack>
          <Input
            value={healthMonitorName}
            onChange={(e) => setHealthMonitorName(e.target.value)}
            placeholder="e.g. hm-pool-http"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Type */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Type
          </label>
          <Select
            value={monitorType}
            onChange={(value) => setMonitorType(value as HealthMonitorType)}
            options={healthMonitorTypeOptions}
            fullWidth
          />
        </VStack>

        {/* Interval (sec) */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Interval (sec)
          </label>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Time between consecutive health checks.
          </p>
          <Input
            type="number"
            value={String(interval)}
            onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
            min={1}
            max={3600}
            fullWidth
            error={hasAttemptedSubmit && !isIntervalValid}
          />
          {hasAttemptedSubmit && !isIntervalValid ? (
            <p className="text-[11px] text-[var(--color-state-danger)] leading-4">
              Interval must be between 1-3600
            </p>
          ) : (
            <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
              1 ~ 3600; Timeout &lt; Delay
            </p>
          )}
        </VStack>

        {/* Timeout (sec) */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Timeout (sec)
          </label>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Maximum time to wait for response
          </p>
          <Input
            type="number"
            value={String(timeout)}
            onChange={(e) => setTimeout(parseInt(e.target.value) || 1)}
            min={1}
            max={3599}
            fullWidth
            error={hasAttemptedSubmit && !isTimeoutValid}
          />
          {hasAttemptedSubmit && !isTimeoutValid ? (
            <p className="text-[11px] text-[var(--color-state-danger)] leading-4">
              Timeout must be between 1-3599 and less than Interval
            </p>
          ) : (
            <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
              1 ~ 3599; Timeout &lt; Delay
            </p>
          )}
        </VStack>

        {/* Max Retries */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Max Retries
          </label>
          <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
            Number of failed attempts before marking member OFFLINE.
          </p>
          <Input
            type="number"
            value={String(maxRetries)}
            onChange={(e) => setMaxRetries(parseInt(e.target.value) || 1)}
            min={1}
            max={10}
            fullWidth
            error={hasAttemptedSubmit && !isMaxRetriesValid}
          />
          {hasAttemptedSubmit && !isMaxRetriesValid ? (
            <p className="text-[11px] text-[var(--color-state-danger)] leading-4">
              Max Retries must be between 1-10
            </p>
          ) : (
            <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
              1 ~ 10
            </p>
          )}
        </VStack>

        {/* Admin State */}
        <VStack gap={3} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Admin State
          </label>
          <HStack gap={2} className="items-center">
            <Toggle 
              checked={adminStateUp} 
              onChange={(e) => setAdminStateUp(e.target.checked)} 
            />
            <span className="text-[12px] text-[var(--color-text-default)] leading-4">
              {adminStateUp ? 'Up' : 'Down'}
            </span>
          </HStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default CreateHealthMonitorDrawer;

