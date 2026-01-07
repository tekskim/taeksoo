import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface LoadBalancerInfo {
  id: string;
  name: string;
  description?: string;
  adminStateUp?: boolean;
}

export interface EditLoadBalancerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loadBalancer: LoadBalancerInfo;
  onSubmit?: (name: string, description: string, adminStateUp: boolean) => void;
}

/* ----------------------------------------
   EditLoadBalancerDrawer Component
   ---------------------------------------- */

export function EditLoadBalancerDrawer({
  isOpen,
  onClose,
  loadBalancer,
  onSubmit,
}: EditLoadBalancerDrawerProps) {
  const [name, setName] = useState(loadBalancer.name);
  const [description, setDescription] = useState(loadBalancer.description || '');
  const [adminStateUp, setAdminStateUp] = useState(loadBalancer.adminStateUp ?? true);
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens or loadBalancer changes
  useEffect(() => {
    if (isOpen) {
      setName(loadBalancer.name);
      setDescription(loadBalancer.description || '');
      setAdminStateUp(loadBalancer.adminStateUp ?? true);
      setIsAdvancedExpanded(true);
    }
  }, [isOpen, loadBalancer]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(name, description, adminStateUp);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isValid = name.trim().length > 0;

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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Edit Load Balancer
          </h2>
        </VStack>

        {/* Load Balancer Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Load balancer name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. web-lb-01"
            fullWidth
          />
          <p className="text-[11px] text-[var(--color-text-subtle)] leading-4">
            Allowed: 1–128 characters, letters, numbers, "-", "_", ".", "()", "[]"
          </p>
        </VStack>

        {/* Description Input */}
        <VStack gap={2} className="w-full">
          <HStack gap={1} className="items-center">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              Description
            </label>
            <span className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              (optional)
            </span>
          </HStack>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Web traffic distribution"
            fullWidth
          />
        </VStack>

        {/* Advanced Options Toggle */}
        <VStack gap={3} className="w-full">
          <button
            type="button"
            onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
            className="flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-text-default)] leading-5"
          >
            {isAdvancedExpanded ? (
              <IconChevronDown size={12} stroke={1} />
            ) : (
              <IconChevronRight size={12} stroke={1} />
            )}
            Lable
          </button>

          {/* Admin State Toggle (Collapsible) */}
          {isAdvancedExpanded && (
            <HStack gap={2} className="items-center">
              <Toggle 
                checked={adminStateUp} 
                onChange={(e) => setAdminStateUp(e.target.checked)} 
              />
              <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                {adminStateUp ? 'Up' : 'Down'}
              </span>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default EditLoadBalancerDrawer;

