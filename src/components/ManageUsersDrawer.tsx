import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  StatusIndicator,
  SelectionIndicator,
  fixedColumns,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconAlertCircle } from '@tabler/icons-react';

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
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-2',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-3',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-4',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-5',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-6',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-7',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-8',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
  },
  {
    id: 'user-9',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
    hasWarning: true,
  },
  {
    id: 'user-10',
    username: 'thaki-kim',
    status: 'active',
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `user-${i + 11}`,
    username: 'thaki-kim',
    status: 'active' as const,
    userGroups: 'dev-admin-group (+2)',
    roles: 'compute-admin (+3)',
    createdAt: 'Sep 12, 2025',
  })),
];

const ITEMS_PER_PAGE = 5;

const userColumns: TableColumn<UserItem>[] = [
  {
    key: 'status',
    label: 'Status',
    width: fixedColumns.status,
    align: 'center',
    render: (_, row) => <StatusIndicator status={row.status} />,
  },
  {
    key: 'username',
    label: 'Username',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <span className="flex items-center gap-1.5">
        <span className="text-label-md text-[var(--color-action-primary)] truncate">
          {row.username}
        </span>
        <IconExternalLink
          size={12}
          stroke={1.5}
          className="shrink-0 text-[var(--color-action-primary)]"
        />
        {row.hasWarning && (
          <IconAlertCircle size={14} className="shrink-0 text-[var(--color-state-danger)]" />
        )}
      </span>
    ),
  },
  { key: 'userGroups', label: 'User groups', flex: 1 },
  { key: 'roles', label: 'Roles', flex: 1 },
  { key: 'createdAt', label: 'Created at', flex: 1, sortable: true },
];

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
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([...initialSelectedIds]);
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
      setSelectedUserIds([...initialSelectedIds]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    // Validate required fields
    if (selectedUserIds.length === 0) {
      return; // Don't submit if no users selected
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        userIds: selectedUserIds,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUserIds([...initialSelectedIds]);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleRemoveSelection = (userId: string) => {
    setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  // Get selected items for SelectionIndicator
  const selectedItems = users
    .filter((user) => selectedUserIds.includes(user.id))
    .map((user) => ({ id: user.id, label: user.username }));

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
            <p className="text-body-md text-[var(--color-text-subtle)]">
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
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">*</span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)]">
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
            selectedCount={selectedUserIds.length > 0 ? selectedUserIds.length : undefined}
            onPageChange={setCurrentPage}
          />

          {/* Users Table + Selection Indicator */}
          <VStack gap={2} className="w-full">
            <Table<UserItem>
              columns={userColumns}
              data={paginatedUsers}
              rowKey="id"
              selectable
              selectedKeys={selectedUserIds}
              onSelectionChange={setSelectedUserIds}
              emptyMessage="No users found"
            />

            <SelectionIndicator
              selectedItems={selectedItems}
              onRemove={handleRemoveSelection}
              emptyText="No items selected"
              error={hasAttemptedSubmit && selectedUserIds.length === 0}
              errorMessage="Please select at least one user."
              className="shrink-0 w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageUsersDrawer;
