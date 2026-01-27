import { useState, useEffect } from 'react';
import { Drawer, Button, Input, Toggle } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface RouterInfo {
  id: string;
  name: string;
  description?: string;
  adminStateUp?: boolean;
}

export interface EditRouterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  router: RouterInfo;
  onSubmit?: (name: string, description: string, adminStateUp: boolean) => void;
}

/* ----------------------------------------
   EditRouterDrawer Component
   ---------------------------------------- */

export function EditRouterDrawer({ isOpen, onClose, router, onSubmit }: EditRouterDrawerProps) {
  const [routerName, setRouterName] = useState(router.name);
  const [description, setDescription] = useState(router.description || '');
  const [adminStateUp, setAdminStateUp] = useState(router.adminStateUp ?? true);
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens or router changes
  useEffect(() => {
    if (isOpen) {
      setRouterName(router.name);
      setDescription(router.description || '');
      setAdminStateUp(router.adminStateUp ?? true);
      setIsAdvancedExpanded(true);
    }
  }, [isOpen, router]);

  const handleSubmit = async () => {
    if (!routerName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(routerName, description, adminStateUp);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Header */}
        <VStack gap={2}>
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
            Edit Router
          </h2>
        </VStack>

        {/* Router Name Input */}
        <VStack gap={2} className="w-full">
          <label className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
            Router name
          </label>
          <Input
            value={routerName}
            onChange={(e) => setRouterName(e.target.value)}
            placeholder="e.g. my-router"
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
            placeholder="e.g. Router for production web servers"
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
              <Toggle checked={adminStateUp} onChange={(e) => setAdminStateUp(e.target.checked)} />
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

export default EditRouterDrawer;
