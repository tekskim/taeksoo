import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Checkbox,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown, IconChevronRight } from '@tabler/icons-react';

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
  editedAt: '2025-09-12',
}));

const ITEMS_PER_PAGE = 5;

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
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<Set<string>>(
    new Set(initialSelectedIds)
  );
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
      setSelectedPolicyIds(new Set(initialSelectedIds));
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleTogglePolicy = (policyId: string) => {
    setSelectedPolicyIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(policyId)) {
        newSet.delete(policyId);
      } else {
        newSet.add(policyId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    // Validate required fields
    if (selectedPolicyIds.size === 0) {
      return; // Don't submit if no policies selected
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        policyIds: Array.from(selectedPolicyIds),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedPolicyIds(new Set(initialSelectedIds));
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleRemoveSelection = (policyId: string) => {
    setSelectedPolicyIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(policyId);
      return newSet;
    });
  };

  // Get selected items for SelectionIndicator
  const selectedItems = policies
    .filter((policy) => selectedPolicyIds.has(policy.id))
    .map((policy) => ({ id: policy.id, label: policy.name }));

  // Select all logic
  const allCurrentPageSelected =
    paginatedPolicies.length > 0 &&
    paginatedPolicies.every((policy) => selectedPolicyIds.has(policy.id));
  const someCurrentPageSelected = paginatedPolicies.some((policy) =>
    selectedPolicyIds.has(policy.id)
  );

  const handleSelectAll = () => {
    if (allCurrentPageSelected) {
      // Deselect all on current page
      setSelectedPolicyIds((prev) => {
        const newSet = new Set(prev);
        paginatedPolicies.forEach((policy) => newSet.delete(policy.id));
        return newSet;
      });
    } else {
      // Select all on current page
      setSelectedPolicyIds((prev) => {
        const newSet = new Set(prev);
        paginatedPolicies.forEach((policy) => newSet.add(policy.id));
        return newSet;
      });
    }
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
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Manage policies
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Add or remove policies of this role.
            </p>
          </VStack>

          {/* Role Info Box */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Role
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {roleName}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* Policies Section */}
        <VStack gap={4} className="w-full pb-5">
          {/* Section Header */}
          <VStack gap={2}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Policies
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">
                *
              </span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
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
            selectedCount={selectedPolicyIds.size > 0 ? selectedPolicyIds.size : undefined}
            onPageChange={setCurrentPage}
          />

          {/* Policies Table */}
          <div className="w-full flex flex-col gap-[var(--table-row-gap)]">
            {/* Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="w-[var(--table-checkbox-width)] flex items-center justify-center">
                <Checkbox
                  checked={allCurrentPageSelected}
                  indeterminate={someCurrentPageSelected && !allCurrentPageSelected}
                  onChange={handleSelectAll}
                />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Name
                <IconChevronDown size={12} />
              </div>
              <div className="w-[100px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Type
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Apps
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Description
                <IconChevronDown size={12} />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Edited at
                <IconChevronDown size={12} />
              </div>
            </div>

            {/* Rows */}
            {paginatedPolicies.map((policy) => (
              <div
                key={policy.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                  selectedPolicyIds.has(policy.id)
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => handleTogglePolicy(policy.id)}
              >
                {/* Checkbox */}
                <div
                  className="w-[var(--table-checkbox-width)] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedPolicyIds.has(policy.id)}
                    onChange={() => handleTogglePolicy(policy.id)}
                  />
                </div>
                {/* Name with chevron and link */}
                <div className="flex-1 flex items-center gap-2 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <IconChevronRight
                    size={12}
                    className="shrink-0 text-[var(--color-text-default)]"
                  />
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">
                    {policy.name}
                  </span>
                  <IconExternalLink
                    size={12}
                    stroke={1.5}
                    className="shrink-0 text-[var(--color-action-primary)]"
                  />
                </div>
                {/* Type (centered) */}
                <div className="w-[100px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {policy.type}
                  </span>
                </div>
                {/* Apps */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {policy.apps}
                  </span>
                </div>
                {/* Description */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {policy.description}
                  </span>
                </div>
                {/* Edited at */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {policy.editedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator - directly under the table */}
          <SelectionIndicator
            selectedItems={selectedItems}
            onRemove={handleRemoveSelection}
            emptyText="No items selected"
            error={hasAttemptedSubmit && selectedPolicyIds.size === 0}
            errorMessage="Please select at least one policy."
            className="shrink-0 w-full"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManagePoliciesDrawer;
