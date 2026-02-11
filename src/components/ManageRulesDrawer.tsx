import { useState } from 'react';
import { Drawer, Button, SearchInput, Table } from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconCirclePlus, IconCircleMinus } from '@tabler/icons-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available rules state
  const [availableSearchQuery, setAvailableSearchQuery] = useState('');

  // Selected rules state
  const [selectedSearchQuery, setSelectedSearchQuery] = useState('');
  const [selectedRules, setSelectedRules] = useState<FirewallRule[]>(mockInitialSelectedRules);

  // Filter available rules
  const filteredAvailable = mockAvailableRules.filter((rule) =>
    rule.name.toLowerCase().includes(availableSearchQuery.toLowerCase())
  );

  // Filter selected rules for display
  const filteredSelected = selectedRules.filter((rule) =>
    rule.name.toLowerCase().includes(selectedSearchQuery.toLowerCase())
  );

  const handleAddRule = (rule: FirewallRule) => {
    if (selectedRules.some((r) => r.id === rule.id)) return;
    setSelectedRules([...selectedRules, { ...rule }]);
  };

  const handleRemoveRule = (ruleId: string) => {
    setSelectedRules(selectedRules.filter((r) => r.id !== ruleId));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.(selectedRules.map((r) => r.id));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAvailableSearchQuery('');
    setSelectedSearchQuery('');
    setSelectedRules(mockInitialSelectedRules);
    onClose();
  };

  /* ── Available Rules Table Columns ── */
  const availableColumns: TableColumn<FirewallRule>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.name}</span>
      ),
    },
    {
      key: 'protocol',
      label: 'Protocol',
      minWidth: '60px',
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.protocol}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      minWidth: '50px',
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.action}</span>
      ),
    },
    {
      key: 'id' as keyof FirewallRule,
      label: '',
      width: '40px',
      align: 'center',
      render: (_value, row) => (
        <Button
          variant="ghost"
          size="xs"
          icon={<IconCirclePlus size={14} stroke={1.5} />}
          onClick={(e) => {
            e.stopPropagation();
            handleAddRule(row);
          }}
          aria-label={`Add ${row.name}`}
          className="!min-w-0 !p-0"
        />
      ),
    },
  ];

  /* ── Selected Rules Table Columns ── */
  const selectedColumns: TableColumn<FirewallRule>[] = [
    {
      key: 'id' as keyof FirewallRule,
      label: '#',
      width: '36px',
      align: 'center',
      render: (_value, _row, rowIndex) => (
        <span className="text-label-sm text-[var(--color-action-primary)]">{rowIndex + 1}</span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.name}</span>
      ),
    },
    {
      key: 'protocol',
      label: 'Protocol',
      minWidth: '60px',
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.protocol}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      minWidth: '50px',
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.action}</span>
      ),
    },
    {
      key: 'id' as keyof FirewallRule,
      label: '',
      width: '40px',
      align: 'center',
      render: (_value, row) => (
        <Button
          variant="ghost"
          size="xs"
          icon={<IconCircleMinus size={14} stroke={1.5} />}
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveRule(row.id);
          }}
          aria-label={`Remove ${row.name}`}
          className="!min-w-0 !p-0"
        />
      ),
    },
  ];

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
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">Manage rules</h2>

        {/* Policy Info */}
        <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
          <div className="text-label-sm text-[var(--color-text-subtle)] mb-1.5">
            Firewall policy
          </div>
          <div className="text-body-md text-[var(--color-text-default)]">{policy.name}</div>
        </div>

        {/* Rules Section */}
        <VStack gap={4} className="w-full">
          <VStack gap={2}>
            <span className="text-label-lg text-[var(--color-text-default)]">Rules</span>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Select rules from the list to add to the policy.
            </p>
          </VStack>

          {/* Dual Panel Layout */}
          <HStack gap={4} className="w-full" align="start">
            {/* Available Rules Panel */}
            <VStack gap={2} className="flex-1 min-w-0">
              <span className="text-label-lg text-[var(--color-text-default)]">
                Available rules
              </span>

              <SearchInput
                value={availableSearchQuery}
                onChange={(e) => setAvailableSearchQuery(e.target.value)}
                placeholder="Search rule name"
                size="sm"
              />

              <div className="max-h-[500px] overflow-y-auto">
                <Table
                  columns={availableColumns}
                  data={filteredAvailable}
                  rowKey="id"
                  emptyMessage="No rules found"
                />
              </div>
            </VStack>

            {/* Selected Rules Panel */}
            <VStack gap={2} className="flex-1 min-w-0">
              <span className="text-label-lg text-[var(--color-text-default)]">Selected rules</span>

              <SearchInput
                value={selectedSearchQuery}
                onChange={(e) => setSelectedSearchQuery(e.target.value)}
                placeholder="Search rule name"
                size="sm"
              />

              <div className="max-h-[500px] overflow-y-auto">
                <Table
                  columns={selectedColumns}
                  data={filteredSelected}
                  rowKey="id"
                  emptyMessage="No rules selected"
                />
              </div>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageRulesDrawer;
