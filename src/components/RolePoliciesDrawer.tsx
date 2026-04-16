import { useState, useEffect, useCallback } from 'react';
import {
  Badge,
  BadgeList,
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  SelectionIndicator,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconChevronRight, IconChevronDown, IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface PolicyPermission {
  application: string;
  partition: string;
  resource: string;
  actions: string[];
}

export interface PolicyItem {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  apps: string;
  description: string;
  editedAt: string;
  permissions?: PolicyPermission[];
}

export interface RolePoliciesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roleName?: string;
  title?: string;
  description?: string;
  initialSelectedIds?: string[];
  policies?: PolicyItem[];
  onSubmit?: (data: { policyIds: string[] }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultPermissions: PolicyPermission[] = [
  {
    application: 'Compute',
    partition: 'tenantA',
    resource: 'AI_server',
    actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
  },
  {
    application: 'Container',
    partition: 'clusterA',
    resource: 'All(*)',
    actions: ['Read', 'List', 'Write'],
  },
  {
    application: 'IAM',
    partition: '-',
    resource: 'All(*)',
    actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
  },
  { application: 'Storage', partition: '-', resource: 'Host', actions: ['Read'] },
];

const defaultPolicies: PolicyItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `policy-${i + 1}`,
  name: 'policy',
  type: 'Built-in',
  apps: 'Compute:tenantA',
  description: '-',
  editedAt: 'Sep 12, 2025',
  permissions: defaultPermissions,
}));

const ITEMS_PER_PAGE = 5;

function buildPolicyColumns(
  expandedIds: Set<string>,
  onToggleExpand: (id: string) => void
): TableColumn<PolicyItem>[] {
  return [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: 140,
      sortable: true,
      render: (_, row) => (
        <span className="flex items-center gap-1">
          <button
            type="button"
            className="shrink-0 p-0 border-0 bg-transparent cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(row.id);
            }}
            aria-label={expandedIds.has(row.id) ? 'Collapse' : 'Expand'}
          >
            {expandedIds.has(row.id) ? (
              <IconChevronDown size={14} stroke={2} />
            ) : (
              <IconChevronRight size={14} stroke={2} />
            )}
          </button>
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.name}
          </span>
          <IconExternalLink
            size={12}
            stroke={1.5}
            className="shrink-0 text-[var(--color-action-primary)]"
          />
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      width: 100,
      render: (_, row) => (
        <Badge theme="white" size="sm">
          {row.type}
        </Badge>
      ),
    },
    {
      key: 'apps',
      label: 'Apps',
      flex: 1,
      minWidth: 160,
      render: (_, row) => {
        const items = row.permissions
          ? [
              ...new Set(
                row.permissions.map((p) =>
                  p.partition !== '-' ? `${p.application}:${p.partition}` : p.application
                )
              ),
            ]
          : [row.apps];
        return (
          <BadgeList
            items={items}
            maxVisible={1}
            popoverTitle={`All Apps (${items.length})`}
            overflowAlign="right"
          />
        );
      },
    },
    { key: 'description', label: 'Description', flex: 1, minWidth: 120, sortable: true },
    { key: 'editedAt', label: 'Edited at', flex: 1, minWidth: 120, sortable: true },
  ];
}

interface PermissionRow extends PolicyPermission {
  _index: number;
}

const permissionColumns: TableColumn<PermissionRow>[] = [
  { key: '_index' as keyof PermissionRow, label: '#', width: 40 },
  { key: 'application', label: 'Application', flex: 1 },
  { key: 'partition', label: 'Partition', flex: 1 },
  { key: 'resource', label: 'Resource', flex: 1 },
  {
    key: 'actions' as keyof PermissionRow,
    label: 'Action',
    flex: 1.5,
    render: (_, row) => (
      <BadgeList
        items={row.actions}
        maxVisible={1}
        popoverTitle={`All Actions (${row.actions.length})`}
        overflowAlign="right"
      />
    ),
  },
];

function PermissionSubTable({ permissions }: { permissions: PolicyPermission[] }) {
  const data: PermissionRow[] = permissions.map((p, i) => ({ ...p, _index: i + 1 }));
  return (
    <div className="w-full px-4 py-3">
      <Table<PermissionRow> columns={permissionColumns} data={data} rowKey="_index" />
    </div>
  );
}

/* ----------------------------------------
   RolePoliciesDrawer Component
   ---------------------------------------- */

export function RolePoliciesDrawer({
  isOpen,
  onClose,
  roleName = 'member',
  title: drawerTitle = 'Manage policies',
  description: drawerDescription = 'Add or remove policies of this role.',
  initialSelectedIds = [],
  policies = defaultPolicies,
  onSubmit,
}: RolePoliciesDrawerProps) {
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([...initialSelectedIds]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const policyColumns = buildPolicyColumns(expandedIds, handleToggleExpand);

  // Filter policies
  const filteredPolicies = policies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.apps.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPolicies.length / ITEMS_PER_PAGE);
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPolicyIds([...initialSelectedIds]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
      setExpandedIds(new Set());
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    // Validate required fields
    if (selectedPolicyIds.length === 0) {
      return; // Don't submit if no policies selected
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        policyIds: selectedPolicyIds,
      });
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
    setExpandedIds(new Set());
    onClose();
  };

  const handleRemoveSelection = (policyId: string) => {
    setSelectedPolicyIds((prev) => prev.filter((id) => id !== policyId));
  };

  // Get selected items for SelectionIndicator
  const selectedItems = policies
    .filter((policy) => selectedPolicyIds.includes(policy.id))
    .map((policy) => ({ id: policy.id, label: policy.name }));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={drawerTitle}
      description={drawerDescription}
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header */}
        <VStack gap={3}>
          <InfoBox label="Role" value={roleName} />
        </VStack>

        {/* Policies Section */}
        <VStack gap={3} className="w-full pb-5">
          {/* Section Header */}
          <VStack gap={1}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Policies
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">*</span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Select policies to apply to this role. If policies include conditions, all conditions
              must be satisfied for the permission to be granted.
            </p>
          </VStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search policies by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPolicies.length}
            selectedCount={selectedPolicyIds.length > 0 ? selectedPolicyIds.length : undefined}
            onPageChange={setCurrentPage}
          />

          {/* Policies Table + Selection Indicator */}
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
                expandedIds.has(row.id) && row.permissions?.length ? (
                  <PermissionSubTable permissions={row.permissions} />
                ) : null
              }
            />

            <SelectionIndicator
              selectedItems={selectedItems}
              onRemove={handleRemoveSelection}
              emptyText="No items selected"
              error={hasAttemptedSubmit && selectedPolicyIds.length === 0}
              errorMessage="Please select at least one policy."
              className="shrink-0 w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default RolePoliciesDrawer;
