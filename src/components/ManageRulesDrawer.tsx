import { useState, useRef } from 'react';
import { Drawer, Button, SearchInput } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconCirclePlus, IconCircleMinus, IconGripVertical } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FirewallRule {
  id: string;
  name: string;
  protocol: string;
  action: string;
}

export interface FirewallPolicyInfo {
  id: string;
  name: string;
}

export interface ManageRulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  policy: FirewallPolicyInfo;
  onSave?: (selectedRuleIds: string[]) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockAvailableRules: FirewallRule[] = Array.from({ length: 20 }, (_, i) => ({
  id: `rule-${i + 1}`,
  name: 'Name',
  protocol: 'TCP',
  action: 'Allow',
}));

const mockInitialSelectedRules: FirewallRule[] = [
  { id: 'selected-1', name: 'Name', protocol: 'TCP', action: 'Allow' },
  { id: 'selected-2', name: 'Name', protocol: 'UDP', action: 'Block' },
  { id: 'selected-3', name: 'Name', protocol: 'ICMP', action: 'Deny' },
  { id: 'selected-4', name: 'Name', protocol: 'Any', action: 'Allow' },
  { id: 'selected-5', name: 'Name', protocol: 'Any', action: 'Reject' },
];

/* ----------------------------------------
   ManageRulesDrawer Component
   ---------------------------------------- */

export function ManageRulesDrawer({ isOpen, onClose, policy, onSave }: ManageRulesDrawerProps) {
  // Available rules state
  const [availableSearchQuery, setAvailableSearchQuery] = useState('');

  // Selected rules state
  const [selectedSearchQuery, setSelectedSearchQuery] = useState('');
  const [selectedRules, setSelectedRules] = useState<FirewallRule[]>(mockInitialSelectedRules);

  // Drag-and-drop state
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndexRef.current === null || dragIndexRef.current === index) {
      setDragOverIndex(null);
      return;
    }
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = dragIndexRef.current;
    if (dragIndex === null || dragIndex === dropIndex) {
      dragIndexRef.current = null;
      setDragOverIndex(null);
      return;
    }

    setSelectedRules((prev) => {
      const updated = [...prev];
      const [draggedItem] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, draggedItem);
      return updated;
    });

    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  // Filter available rules (exclude already selected)
  const filteredAvailable = mockAvailableRules.filter(
    (rule) =>
      !selectedRules.some((r) => r.id === rule.id) &&
      (!availableSearchQuery ||
        rule.name.toLowerCase().includes(availableSearchQuery.toLowerCase()) ||
        rule.protocol.toLowerCase().includes(availableSearchQuery.toLowerCase()) ||
        rule.action.toLowerCase().includes(availableSearchQuery.toLowerCase()))
  );

  // Filter selected rules for display
  const filteredSelected = selectedRules.filter(
    (rule) =>
      !selectedSearchQuery ||
      rule.name.toLowerCase().includes(selectedSearchQuery.toLowerCase()) ||
      rule.protocol.toLowerCase().includes(selectedSearchQuery.toLowerCase()) ||
      rule.action.toLowerCase().includes(selectedSearchQuery.toLowerCase())
  );

  const handleAddRule = (rule: FirewallRule) => {
    if (selectedRules.some((r) => r.id === rule.id)) return;
    setSelectedRules([...selectedRules, { ...rule }]);
  };

  const handleRemoveRule = (ruleId: string) => {
    setSelectedRules(selectedRules.filter((r) => r.id !== ruleId));
  };

  const handleSave = () => {
    onSave?.(selectedRules.map((r) => r.id));
    onClose();
  };

  const handleClose = () => {
    setAvailableSearchQuery('');
    setSelectedSearchQuery('');
    setSelectedRules(mockInitialSelectedRules);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="w-[152px]">
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Title */}
        <VStack gap={3}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Manage rules</h2>

          {/* Policy Info */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
            <div className="text-label-sm text-[var(--color-text-subtle)] mb-1.5">
              Firewall policy
            </div>
            <div className="text-body-md text-[var(--color-text-default)]">{policy.name}</div>
          </div>
        </VStack>

        {/* Rules Section */}
        <VStack gap={3} className="w-full">
          <VStack gap={2}>
            <span className="text-label-lg text-[var(--color-text-default)]">Rules</span>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Select rules from the list to add to the policy.
            </p>
          </VStack>

          {/* Two Column Layout */}
          <div className="flex gap-3 h-[500px]">
            {/* Left Column - Available Rules */}
            <div className="flex-1 flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-md p-2 min-h-0">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Available rules
              </span>

              <SearchInput
                value={availableSearchQuery}
                onChange={setAvailableSearchQuery}
                placeholder="Search rules"
                className="w-full"
              />

              <div
                className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 p-px"
                style={{ scrollbarGutter: 'stable' }}
              >
                {filteredAvailable.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex flex-col bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md"
                  >
                    {/* Top row: Name + Add button */}
                    <div className="flex items-center">
                      <div className="flex-1 px-3 py-2 min-h-[40px] flex items-center">
                        <span className="text-label-md text-[var(--color-text-default)]">
                          {rule.name}
                        </span>
                      </div>
                      <div className="px-3 py-2">
                        <button
                          onClick={() => handleAddRule(rule)}
                          className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)]"
                        >
                          <IconCirclePlus
                            size={16}
                            stroke={1.5}
                            className="text-[var(--color-text-default)]"
                          />
                        </button>
                      </div>
                    </div>
                    {/* Divider */}
                    <div className="w-full h-px bg-[var(--color-border-default)]" />
                    {/* Bottom row: Protocol + Action */}
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Protocol: {rule.protocol}
                      </span>
                      <div className="w-px h-4 bg-[var(--color-border-default)]" />
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Action: {rule.action}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredAvailable.length === 0 && (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-body-md text-[var(--color-text-muted)]">
                      No rules available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Selected Rules */}
            <div className="flex-1 flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-md p-2 min-h-0">
              <span className="text-label-lg text-[var(--color-text-default)]">Selected rules</span>

              <SearchInput
                value={selectedSearchQuery}
                onChange={setSelectedSearchQuery}
                placeholder="Search rules"
                className="w-full"
              />

              <div
                className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 p-px"
                style={{ scrollbarGutter: 'stable' }}
              >
                {filteredSelected.map((rule, index) => {
                  const actualIndex = selectedRules.findIndex((r) => r.id === rule.id);
                  return (
                    <div
                      key={rule.id}
                      draggable
                      onDragStart={() => handleDragStart(actualIndex)}
                      onDragOver={(e) => handleDragOver(e, actualIndex)}
                      onDrop={(e) => handleDrop(e, actualIndex)}
                      onDragEnd={handleDragEnd}
                      className={`
                        flex flex-col bg-[var(--color-surface-default)] rounded-md cursor-grab active:cursor-grabbing transition-all
                        ${dragOverIndex === actualIndex ? 'border-2 border-[var(--color-border-focus)]' : 'border border-[var(--color-border-default)]'}
                      `}
                    >
                      {/* Top row: Grip + Index + Name + Remove button */}
                      <div className="flex items-center">
                        <div className="flex-1 flex items-center gap-2 px-3 py-2 min-h-[40px]">
                          <IconGripVertical
                            size={14}
                            stroke={1.5}
                            className="text-[var(--color-text-disabled)] shrink-0"
                          />
                          <span className="text-label-sm text-[var(--color-action-primary)] shrink-0 w-4 text-center">
                            {index + 1}
                          </span>
                          <span className="text-label-md text-[var(--color-text-default)]">
                            {rule.name}
                          </span>
                        </div>
                        <div className="px-3 py-2">
                          <button
                            onClick={() => handleRemoveRule(rule.id)}
                            className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--color-border-strong)] hover:bg-[var(--color-state-danger-bg)]"
                          >
                            <IconCircleMinus
                              size={16}
                              stroke={1.5}
                              className="text-[var(--color-text-default)]"
                            />
                          </button>
                        </div>
                      </div>
                      {/* Divider */}
                      <div className="w-full h-px bg-[var(--color-border-default)]" />
                      {/* Bottom row: Protocol + Action */}
                      <div className="flex items-center gap-2 px-3 py-2">
                        <span className="text-body-sm text-[var(--color-text-subtle)]">
                          Protocol: {rule.protocol}
                        </span>
                        <div className="w-px h-4 bg-[var(--color-border-default)]" />
                        <span className="text-body-sm text-[var(--color-text-subtle)]">
                          Action: {rule.action}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {selectedRules.length === 0 && (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-body-md text-[var(--color-text-muted)]">
                      No rules selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageRulesDrawer;
