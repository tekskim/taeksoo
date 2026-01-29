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
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface UserGroupItem {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  roles: string;
  userCount: number;
  createdAt: string;
}

export interface ManageUserGroupsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  initialSelectedIds?: string[];
  userGroups?: UserGroupItem[];
  onSubmit?: (data: { groupIds: string[] }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultUserGroups: UserGroupItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `group-${i + 1}`,
  name: 'MemberGroup',
  type: 'Built-in',
  roles: 'ReadCompute (+3)',
  userCount: 130,
  createdAt: '2025-09-12',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   ManageUserGroupsDrawer Component
   ---------------------------------------- */

export function ManageUserGroupsDrawer({
  isOpen,
  onClose,
  userName = 'thaki.kim',
  initialSelectedIds = [],
  userGroups = defaultUserGroups,
  onSubmit,
}: ManageUserGroupsDrawerProps) {
  // User group selection state
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(
    new Set(initialSelectedIds)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Filter user groups
  const filteredGroups = userGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.roles.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedGroupIds(new Set(initialSelectedIds));
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    // Validate required fields
    if (selectedGroupIds.size === 0) {
      return; // Don't submit if no groups selected
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        groupIds: Array.from(selectedGroupIds),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedGroupIds(new Set(initialSelectedIds));
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleRemoveSelection = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(groupId);
      return newSet;
    });
  };

  // Get selected items for SelectionIndicator
  const selectedItems = userGroups
    .filter((group) => selectedGroupIds.has(group.id))
    .map((group) => ({ id: group.id, label: group.name }));

  // Select all logic
  const allCurrentPageSelected =
    paginatedGroups.length > 0 && paginatedGroups.every((group) => selectedGroupIds.has(group.id));
  const someCurrentPageSelected = paginatedGroups.some((group) => selectedGroupIds.has(group.id));

  const handleSelectAll = () => {
    if (allCurrentPageSelected) {
      // Deselect all on current page
      setSelectedGroupIds((prev) => {
        const newSet = new Set(prev);
        paginatedGroups.forEach((group) => newSet.delete(group.id));
        return newSet;
      });
    } else {
      // Select all on current page
      setSelectedGroupIds((prev) => {
        const newSet = new Set(prev);
        paginatedGroups.forEach((group) => newSet.add(group.id));
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
              Manage user groups
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Add or remove the user groups this user belongs to.
            </p>
          </VStack>

          {/* User Info Box */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                User
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {userName}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* User Groups Section */}
        <VStack gap={4} className="w-full pb-5">
          {/* Section Header */}
          <VStack gap={2}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                User groups
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">
                *
              </span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Select the user groups this user will belong to. The user will automatically inherit
              the permissions assigned to those groups.
            </p>
          </VStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search user groups by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredGroups.length}
            selectedCount={selectedGroupIds.size > 0 ? selectedGroupIds.size : undefined}
            onPageChange={setCurrentPage}
          />

          {/* User Groups Table */}
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
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Type
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Roles
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                User count
                <IconChevronDown size={12} />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Created at
                <IconChevronDown size={12} />
              </div>
            </div>

            {/* Rows */}
            {paginatedGroups.map((group) => (
              <div
                key={group.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                  selectedGroupIds.has(group.id)
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => handleToggleGroup(group.id)}
              >
                {/* Checkbox */}
                <div
                  className="w-[var(--table-checkbox-width)] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedGroupIds.has(group.id)}
                    onChange={() => handleToggleGroup(group.id)}
                  />
                </div>
                {/* Name with link */}
                <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">
                    {group.name}
                  </span>
                  <IconExternalLink
                    size={12}
                    stroke={1.5}
                    className="shrink-0 text-[var(--color-action-primary)]"
                  />
                </div>
                {/* Type */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {group.type}
                  </span>
                </div>
                {/* Roles */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {group.roles}
                  </span>
                </div>
                {/* User count */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {group.userCount}
                  </span>
                </div>
                {/* Created at */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {group.createdAt}
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
            error={hasAttemptedSubmit && selectedGroupIds.size === 0}
            errorMessage="Please select at least one user group."
            className="shrink-0 w-full"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageUserGroupsDrawer;
