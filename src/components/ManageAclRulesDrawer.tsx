import { useState, useEffect, useRef, useCallback } from 'react';
import { Drawer, Button, Input, InfoBox } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconCirclePlus, IconCircleMinus, IconGripVertical } from '@tabler/icons-react';

const MAX_RULES = 50;

export interface AclRule {
  id: string;
  cidr: string;
}

export interface ManageAclRulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  floatingIp?: string;
  initialRules?: AclRule[];
  onSubmit?: (rules: AclRule[]) => void;
}

export function ManageAclRulesDrawer({
  isOpen,
  onClose,
  floatingIp = '172.24.4.228',
  initialRules,
  onSubmit,
}: ManageAclRulesDrawerProps) {
  const [rules, setRules] = useState<AclRule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRules(initialRules ?? [{ id: crypto.randomUUID(), cidr: '0.0.0.0/0' }]);
      setIsSubmitting(false);
      setDragIndex(null);
      setDropIndex(null);
    }
  }, [isOpen, initialRules]);

  const addRule = () => {
    if (rules.length >= MAX_RULES) return;
    setRules((prev) => [...prev, { id: crypto.randomUUID(), cidr: '' }]);
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const updateCidr = (id: string, cidr: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, cidr } : r)));
  };

  const handleDragStart = useCallback((index: number) => {
    dragNodeRef.current = index;
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIndex(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = dragNodeRef.current;
    if (sourceIndex === null || sourceIndex === targetIndex) return;

    setRules((prev) => {
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDropIndex(null);
    dragNodeRef.current = null;
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDropIndex(null);
    dragNodeRef.current = null;
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.(rules);
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
      title="Manage Rules"
      width={360}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[152px]"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <InfoBox label="Floating IP" value={floatingIp} />

        <VStack gap={4}>
          <VStack gap={2}>
            <span className="text-label-lg text-[var(--color-text-default)]">Rules</span>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              You can add or remove rules and change their order to adjust the evaluation priority.
            </span>
          </VStack>

          <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-2 py-2 w-full">
            <VStack gap={1}>
              {rules.map((rule, index) => (
                <div
                  key={rule.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={[
                    'flex items-center gap-2 bg-[var(--color-surface-default)] border rounded-[4px] px-3 py-2 w-full cursor-grab active:cursor-grabbing transition-all',
                    dragIndex === index
                      ? 'opacity-40 border-[var(--color-border-default)]'
                      : dropIndex === index && dragIndex !== null
                        ? 'border-[var(--color-border-focus)] shadow-[0_0_0_1px_var(--color-border-focus)]'
                        : 'border-[var(--color-border-default)]',
                  ].join(' ')}
                >
                  <IconGripVertical
                    size={12}
                    className="shrink-0 text-[var(--color-text-disabled)]"
                  />
                  <span className="text-label-sm text-[var(--color-action-primary)] shrink-0 w-5 text-center">
                    {index + 1}
                  </span>
                  <Input
                    value={rule.cidr}
                    onChange={(e) => updateCidr(rule.id, e.target.value)}
                    placeholder="Enter source CIDR"
                    fullWidth
                  />
                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(rule.id)}
                      className="shrink-0 size-7 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-hover)] transition-colors"
                      aria-label={`Remove rule ${index + 1}`}
                    >
                      <IconCircleMinus size={12} className="text-[var(--color-text-default)]" />
                    </button>
                  )}
                </div>
              ))}

              <HStack gap={3} align="center" className="mt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconCirclePlus size={12} />}
                  onClick={addRule}
                  disabled={rules.length >= MAX_RULES}
                >
                  Add Rule
                </Button>
                <span className="text-body-md text-[var(--color-text-subtle)]">
                  {rules.length} / {MAX_RULES} rules
                </span>
              </HStack>
            </VStack>
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageAclRulesDrawer;
