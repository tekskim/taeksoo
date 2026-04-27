import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Badge,
  BadgeList,
  SelectionIndicator,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronRight, IconChevronDown, IconExternalLink } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PolicyRule {
  application: string;
  partition: string;
  resource: string;
  action: string;
}

export interface PolicyItem {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  apps: string[];
  description: string;
  editedAt: string;
  rules: PolicyRule[];
}

export interface AttachPoliciesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  initialSelectedIds?: string[];
  policies?: PolicyItem[];
  onSubmit?: (data: { policyIds: string[] }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultPolicies: PolicyItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `policy-${i + 1}`,
  name: 'policy',
  type: 'Built-in' as const,
  apps: ['compute', 'network', 'storage', 'iam'],
  description: '-',
  editedAt: 'Sep 12, 2025',
  rules: [
    { application: 'Compute', partition: 'tenantA', resource: '', action: 'AI_server' },
    { application: 'Container', partition: 'clusterA', resource: '', action: 'All(*)' },
    { application: 'IAM', partition: '-', resource: '', action: 'All(*)' },
    { application: 'Storage', partition: '-', resource: '', action: 'Host' },
  ],
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   AttachPoliciesDrawer Component
   ---------------------------------------- */

export function AttachPoliciesDrawer({
  isOpen,
  onClose,
  userName = 'thaki.kim',
  initialSelectedIds = [],
  policies = defaultPolicies,
  onSubmit,
}: AttachPoliciesDrawerProps) {
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([...initialSelectedIds]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const filteredPolicies = policies.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPolicies.length / ITEMS_PER_PAGE);
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedPolicyIds([...initialSelectedIds]);
      setSearchQuery('');
      setCurrentPage(1);
      setExpandedPolicies(new Set());
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const toggleExpand = (id: string) => {
    setExpandedPolicies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (selectedPolicyIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit?.({ policyIds: selectedPolicyIds });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPolicyIds([...initialSelectedIds]);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleRemoveSelection = (policyId: string) => {
    setSelectedPolicyIds((prev) => prev.filter((id) => id !== policyId));
  };

  const selectedItems = policies
    .filter((p) => selectedPolicyIds.includes(p.id))
    .map((p) => ({ id: p.id, label: p.name }));

  const ruleColumns: TableColumn<PolicyRule>[] = [
    {
      key: 'application',
      label: '#',
      width: 40,
      render: (_v, _r, index) => <span>{(index ?? 0) + 1}</span>,
    },
    { key: 'application', label: 'Application', flex: 1 },
    { key: 'partition', label: 'Partition', flex: 1 },
    { key: 'resource', label: 'Resource', flex: 1, render: (v: string) => <span>{v || '-'}</span> },
    { key: 'action', label: 'Action', flex: 1 },
  ];

  const policyColumns: TableColumn<PolicyItem>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: 120,
      sortable: true,
      render: (_value, row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(row.id);
            }}
            className="shrink-0 p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors cursor-pointer"
          >
            {expandedPolicies.has(row.id) ? (
              <IconChevronDown size={12} className="text-[var(--color-text-default)]" />
            ) : (
              <IconChevronRight size={12} className="text-[var(--color-text-default)]" />
            )}
          </button>
          <Link
            to={`/iam/policies/${row.name}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline"
          >
            {row.name}
          </Link>
          <IconExternalLink
            size={12}
            stroke={1.5}
            className="shrink-0 text-[var(--color-action-primary)]"
          />
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 0.7,
      minWidth: 80,
      render: (value: string) => (
        <Badge theme="white" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'apps',
      label: 'Apps',
      flex: 1,
      minWidth: 120,
      render: (value: string[]) => (
        <BadgeList
          items={value}
          maxVisible={1}
          maxBadgeWidth="100px"
          popoverTitle={`All Apps (${value.length})`}
          overflowAlign="right"
          popoverMaxWidth="160px"
        />
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 0.7,
      minWidth: 80,
      sortable: true,
    },
    {
      key: 'editedAt',
      label: 'Edited at',
      flex: 0.8,
      minWidth: 100,
      sortable: true,
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Attach policies"
      width={696}
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
            {isSubmitting ? 'Attaching...' : 'Attach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        <InfoBox label="Username" value={userName} />

        <VStack gap={3} className="w-full pb-5">
          <VStack gap={1}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Policies
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">*</span>
            </div>
          </VStack>

          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => setSearchQuery('')}
            placeholder="Search policies by attributes"
            size="sm"
            className="w-[280px]"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPolicies.length}
            selectedCount={selectedPolicyIds.length > 0 ? selectedPolicyIds.length : undefined}
            onPageChange={setCurrentPage}
          />

          <VStack gap={2} className="w-full">
            <Table<PolicyItem>
              columns={policyColumns}
              data={paginatedPolicies}
              rowKey="id"
              selectable
              selectedKeys={selectedPolicyIds}
              onSelectionChange={setSelectedPolicyIds}
              emptyMessage="No policies found"
              expandedContent={(row) =>
                expandedPolicies.has(row.id) ? (
                  <div className="px-6 py-3 w-full">
                    <Table<PolicyRule>
                      columns={ruleColumns}
                      data={row.rules}
                      rowKey="application"
                      compact
                    />
                  </div>
                ) : null
              }
            />

            <SelectionIndicator
              selectedItems={selectedItems}
              onRemove={handleRemoveSelection}
              emptyText="No item selected"
              error={hasAttemptedSubmit && selectedItems.length === 0}
              errorMessage="Please select at least one policy."
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AttachPoliciesDrawer;
