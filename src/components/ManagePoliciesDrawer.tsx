import { useState, useEffect } from 'react';
import {
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
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface PolicyItem {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  apps: string;
  description: string;
  editedAt: string;
}

export interface ManagePoliciesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roleName?: string;
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
  type: 'Built-in',
  apps: 'compute (+3)',
  description: '-',
  editedAt: 'Sep 12, 2025',
}));

const ITEMS_PER_PAGE = 5;

const policyColumns: TableColumn<PolicyItem>[] = [
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <span className="flex items-center gap-1.5">
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
  { key: 'type', label: 'Type', width: 100, align: 'center' as const },
  { key: 'apps', label: 'Apps', flex: 1 },
  { key: 'description', label: 'Description', flex: 1, sortable: true },
  { key: 'editedAt', label: 'Edited at', flex: 1, sortable: true },
];

/* ----------------------------------------
   ManagePoliciesDrawer Component
   ---------------------------------------- */

export function ManagePoliciesDrawer({
  isOpen,
  onClose,
  roleName = 'member',
  initialSelectedIds = [],
  policies = defaultPolicies,
  onSubmit,
}: ManagePoliciesDrawerProps) {
  // Policy selection state
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([...initialSelectedIds]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

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
      title="Manage policies"
      description="Add or remove policies of this role."
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

export default ManagePoliciesDrawer;
