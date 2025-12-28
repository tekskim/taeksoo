import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Select, Toggle } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface PoolOption {
  value: string;
  label: string;
}

export interface AddL7PolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pools?: PoolOption[];
  onSubmit?: (policyName: string, description: string, action: string, targetPool: string, position: number, adminStateUp: boolean) => void;
}

/* ----------------------------------------
   Action Options
   ---------------------------------------- */

const ACTION_OPTIONS = [
  { value: 'forward_to_pool', label: 'Forward to Pool' },
  { value: 'redirect_to_url', label: 'Redirect to URL' },
  { value: 'redirect_to_prefix', label: 'Redirect to Prefix' },
  { value: 'reject', label: 'Reject' },
];

/* ----------------------------------------
   AddL7PolicyDrawer Component
   ---------------------------------------- */

export function AddL7PolicyDrawer({
  isOpen,
  onClose,
  pools = [
    { value: 'pool-1', label: 'pool-1' },
    { value: 'pool-2', label: 'pool-2' },
    { value: 'pool-3', label: 'pool-3' },
  ],
  onSubmit,
}: AddL7PolicyDrawerProps) {
  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');
  const [action, setAction] = useState('forward_to_pool');
  const [targetPool, setTargetPool] = useState('');
  const [position, setPosition] = useState(1);
  const [adminStateUp, setAdminStateUp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setPolicyName('');
      setDescription('');
      setAction('forward_to_pool');
      setTargetPool('');
      setPosition(1);
      setAdminStateUp(true);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!policyName.trim()) return;
    if (action === 'forward_to_pool' && !targetPool) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(policyName, description, action, targetPool, position, adminStateUp);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isValid = policyName.trim().length > 0 && 
    (action !== 'forward_to_pool' || targetPool.length > 0);

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
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
          Add L7 Policy
        </h2>

        {/* L7 Policy Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            L7 Policy Name
          </label>
          <Input
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
            placeholder="e.g. policy-image-redirect"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Description Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Description (optional)
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Redirect image traffic to CDN"
            fullWidth
          />
        </VStack>

        {/* Action Select */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Action
          </label>
          <Select
            value={action}
            onChange={(value) => setAction(value)}
            options={ACTION_OPTIONS}
            fullWidth
          />
          
          {/* Target Pool Select (shown when action is forward_to_pool) */}
          {action === 'forward_to_pool' && (
            <Select
              value={targetPool}
              onChange={(value) => setTargetPool(value)}
              options={pools}
              placeholder="Select a target pool"
              fullWidth
            />
          )}
        </VStack>

        {/* Position Input */}
        <VStack gap={2} className="w-full">
          <HStack gap={2} className="items-center">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Position
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)]">
              (Optional)
            </span>
          </HStack>
          <Input
            type="number"
            value={position.toString()}
            onChange={(e) => setPosition(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            fullWidth
          />
        </VStack>

        {/* Admin State Toggle */}
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

export default AddL7PolicyDrawer;

