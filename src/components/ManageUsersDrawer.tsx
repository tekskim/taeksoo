import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Checkbox,
  StatusIndicator,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown, IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface UserItem {
  id: string;
  username: string;
  status: 'active' | 'error' | 'muted';
  userGroups: string;
  roles: string;
  createdAt: string;
  hasWarning?: boolean;
}

export interface ManageUsersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userGroupName?: string;
  initialSelectedIds?: string[];
  users?: UserItem[];
  onSubmit?: (data: { userIds: string[] }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultUsers: UserItem[] = [
  {
    id: 'user-1',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-2',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-3',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-4',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-5',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-6',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-7',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-8',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  },
  {
    id: 'user-9',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
    hasWarning: true,
  },
  {
    id: 'user-10',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `user-${i + 11}`,
    username: 'thaki-kim',
    status: 'active' as const,
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: '2025-09-12',
  })),
];

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   ManageUsersDrawer Component
   ---------------------------------------- */

export function ManageUsersDrawer({
  isOpen,
  onClose,
  userGroupName = 'MemberGroup',
  initialSelectedIds = [],
  users = defaultUsers,
  onSubmit,
}: ManageUsersDrawerProps) {
  // User selection state
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set(initialSelectedIds));
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userGroups.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roles.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedUserIds(new Set(initialSelectedIds));
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    // Validate required fields
    if (selectedUserIds.size === 0) {
      return; // Don't submit if no users selected
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        userIds: Array.from(selectedUserIds),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUserIds(new Set(initialSelectedIds));
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleRemoveSelection = (userId: string) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  // Get selected items for SelectionIndicator
  const selectedItems = users
    .filter((user) => selectedUserIds.has(user.id))
    .map((user) => ({ id: user.id, label: user.username }));

  // Select all logic
  const allCurrentPageSelected =
    paginatedUsers.length > 0 && paginatedUsers.every((user) => selectedUserIds.has(user.id));
  const someCurrentPageSelected = paginatedUsers.some((user) => selectedUserIds.has(user.id));

  const handleSelectAll = () => {
    if (allCurrentPageSelected) {
      // Deselect all on current page
      setSelectedUserIds((prev) => {
        const newSet = new Set(prev);
        paginatedUsers.forEach((user) => newSet.delete(user.id));
        return newSet;
      });
    } else {
      // Select all on current page
      setSelectedUserIds((prev) => {
        const newSet = new Set(prev);
        paginatedUsers.forEach((user) => newSet.add(user.id));
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
              Manage users
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Add or remove members of this user group. Users included in the group automatically
              receive the permissions assigned to the group.
            </p>
          </VStack>

          {/* User Group Info Box */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                User group
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {userGroupName}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* Users Section */}
        <VStack gap={4} className="w-full pb-5">
          {/* Section Header */}
          <VStack gap={2}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Users
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">
                *
              </span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Select users to include in this group. All selected users will receive the group's
              assigned roles and policies.
            </p>
          </VStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search users by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            selectedCount={selectedUserIds.size > 0 ? selectedUserIds.size : undefined}
            onPageChange={setCurrentPage}
          />

          {/* Users Table */}
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
              <div className="w-[59px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Status
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Username
                <IconChevronDown size={12} />
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                User groups
              </div>
              <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Roles
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Created at
                <IconChevronDown size={12} />
              </div>
            </div>

            {/* Rows */}
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                  selectedUserIds.has(user.id)
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => handleToggleUser(user.id)}
              >
                {/* Checkbox */}
                <div
                  className="w-[var(--table-checkbox-width)] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedUserIds.has(user.id)}
                    onChange={() => handleToggleUser(user.id)}
                  />
                </div>
                {/* Status */}
                <div className="w-[59px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]">
                  <StatusIndicator status={user.status} />
                </div>
                {/* Username with link */}
                <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">
                    {user.username}
                  </span>
                  <IconExternalLink
                    size={12}
                    stroke={1.5}
                    className="shrink-0 text-[var(--color-action-primary)]"
                  />
                  {user.hasWarning && (
                    <IconAlertCircle
                      size={16}
                      stroke={1.5}
                      className="shrink-0 text-[var(--color-state-danger)]"
                    />
                  )}
                </div>
                {/* User groups */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {user.userGroups}
                  </span>
                </div>
                {/* Roles */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {user.roles}
                  </span>
                </div>
                {/* Created at */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)]">
                    {user.createdAt}
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
            error={hasAttemptedSubmit && selectedUserIds.size === 0}
            errorMessage="Please select at least one user."
            className="shrink-0 w-full"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageUsersDrawer;
