import { useState, useRef } from 'react';
import { Drawer, Button, SearchInput, InfoBox } from '@/design-system';
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

const mockAvailableRules: FirewallRule[] = [
  { id: 'rule-1', name: 'allow-ssh-inbound', protocol: 'TCP', action: 'Allow' },
  { id: 'rule-2', name: 'allow-http', protocol: 'TCP', action: 'Allow' },
  { id: 'rule-3', name: 'allow-https', protocol: 'TCP', action: 'Allow' },
  { id: 'rule-4', name: 'block-telnet', protocol: 'TCP', action: 'Deny' },
  { id: 'rule-5', name: 'allow-dns-udp', protocol: 'UDP', action: 'Allow' },
  { id: 'rule-6', name: 'allow-ntp', protocol: 'UDP', action: 'Allow' },
  { id: 'rule-7', name: 'allow-ping', protocol: 'ICMP', action: 'Allow' },
  { id: 'rule-8', name: 'block-icmp-redirect', protocol: 'ICMP', action: 'Deny' },
  { id: 'rule-9', name: 'allow-mysql', protocol: 'TCP', action: 'Allow' },
  { id: 'rule-10', name: 'allow-postgres', protocol: 'TCP', action: 'Allow' },
  { id: 'rule-11', name: 'allow-redis', protocol: 'TCP', action: 'Allow' },
  { id: 'rule-12', name: 'block-smtp-outbound', protocol: 'TCP', action: 'Block' },
  { id: 'rule-13', name: 'allow-kubernetes-api', protocol: 'TCP', action: 'Allow' },
  { id: 'rule-14', name: 'allow-etcd', protocol: 'TCP', action: 'Allow' },
  { id: 'rule-15', name: 'allow-dhcp', protocol: 'UDP', action: 'Allow' },
  { id: 'rule-16', name: 'block-netbios', protocol: 'UDP', action: 'Block' },
  { id: 'rule-17', name: 'allow-all-internal', protocol: 'Any', action: 'Allow' },
  { id: 'rule-18', name: 'deny-all-external', protocol: 'Any', action: 'Deny' },
  { id: 'rule-19', name: 'allow-rdp', protocol: 'TCP', action: 'Allow' },
  { id: 'rule-20', name: 'reject-ftp', protocol: 'TCP', action: 'Reject' },
];

const mockInitialSelectedRules: FirewallRule[] = [
  { id: 'selected-1', name: 'allow-ssh-inbound', protocol: 'TCP', action: 'Allow' },
  { id: 'selected-2', name: 'block-udp-flood', protocol: 'UDP', action: 'Block' },
  { id: 'selected-3', name: 'deny-icmp-fragmentation', protocol: 'ICMP', action: 'Deny' },
  { id: 'selected-4', name: 'allow-all-loopback', protocol: 'Any', action: 'Allow' },
  { id: 'selected-5', name: 'reject-unknown-traffic', protocol: 'Any', action: 'Reject' },
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
  const [dropIndicator, setDropIndicator] = useState<{
    index: number;
    position: 'before' | 'after';
  } | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndexRef.current === null) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const isAboveMid = e.clientY < midY;
    const dragIdx = dragIndexRef.current;
    const lastIndex = selectedRules.length - 1;

    // Normalize: use "before" for the next item instead of "after" on current,
    // except for the last item where "after" is needed
    let targetIndex: number;
    let position: 'before' | 'after';

    if (isAboveMid) {
      targetIndex = index;
      position = 'before';
    } else if (index === lastIndex) {
      targetIndex = index;
      position = 'after';
    } else {
      targetIndex = index + 1;
      position = 'before';
    }

    // Suppress indicator at positions adjacent to the dragged item (no-op moves)
    if (
      targetIndex === dragIdx ||
      (position === 'before' && targetIndex === dragIdx + 1) ||
      (position === 'after' && targetIndex === dragIdx)
    ) {
      setDropIndicator(null);
      return;
    }

    setDropIndicator({ index: targetIndex, position });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = dragIndexRef.current;
    if (dragIndex === null || !dropIndicator) {
      dragIndexRef.current = null;
      setDropIndicator(null);
      return;
    }

    const { index: targetIndex, position } = dropIndicator;

    setSelectedRules((prev) => {
      const updated = [...prev];
      const [draggedItem] = updated.splice(dragIndex, 1);
      let insertAt = position === 'before' ? targetIndex : targetIndex + 1;
      if (dragIndex < targetIndex) insertAt--;
      updated.splice(insertAt, 0, draggedItem);
      return updated;
    });

    dragIndexRef.current = null;
    setDropIndicator(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDropIndicator(null);
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
      width={1032}
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

          <InfoBox label="Firewall policy" value={policy.name} />
        </VStack>

        {/* Rules Section */}
        <VStack gap={3} className="w-full">
          <VStack gap={2}>
            <span className="text-label-lg text-[var(--color-text-default)]">Rules</span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Select rules from the list to add to the policy.
            </p>
          </VStack>

          {/* Two Column Layout */}
          <div className="flex gap-3 h-[500px]">
            {/* Left Column - Available Rules */}
            <div className="flex-1 flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-md px-4 py-3 min-h-0">
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
            <div className="flex-1 flex flex-col gap-2 bg-[var(--color-surface-subtle)] rounded-md px-4 py-3 min-h-0">
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
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {filteredSelected.map((rule, index) => {
                  const actualIndex = selectedRules.findIndex((r) => r.id === rule.id);
                  const isDragging = dragIndexRef.current === actualIndex;
                  const showBefore =
                    dropIndicator?.index === actualIndex && dropIndicator.position === 'before';
                  const showAfter =
                    dropIndicator?.index === actualIndex && dropIndicator.position === 'after';

                  return (
                    <div key={rule.id} className="flex flex-col gap-1">
                      {showBefore && (
                        <div className="h-1 bg-[var(--color-border-focus)] rounded-full" />
                      )}
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, actualIndex)}
                        onDragOver={(e) => handleDragOver(e, actualIndex)}
                        onDragEnd={handleDragEnd}
                        className={`
                          flex flex-col bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md cursor-grab active:cursor-grabbing transition-opacity
                          ${isDragging ? 'opacity-40' : ''}
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
                      {showAfter && (
                        <div className="h-1 bg-[var(--color-border-focus)] rounded-full" />
                      )}
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
