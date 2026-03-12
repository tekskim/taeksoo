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
  createdAt: 'Sep 12, 2025 15:43:35',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   Table Columns
   ---------------------------------------- */

const userGroupColumns: TableColumn<UserGroupItem>[] = [
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
  { key: 'type', label: 'Type', flex: 1 },
  { key: 'roles', label: 'Roles', flex: 1 },
  { key: 'userCount', label: 'User count', flex: 1, sortable: true },
  { key: 'createdAt', label: 'Created at', flex: 1, sortable: true },
];

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
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([...initialSelectedIds]);
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
      setSelectedGroupIds([...initialSelectedIds]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    // Validate required fields
    if (selectedGroupIds.length === 0) {
      return; // Don't submit if no groups selected
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        groupIds: selectedGroupIds,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedGroupIds([...initialSelectedIds]);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleRemoveSelection = (groupId: string) => {
    setSelectedGroupIds((prev) => prev.filter((id) => id !== groupId));
  };

  // Get selected items for SelectionIndicator
  const selectedItems = userGroups
    .filter((group) => selectedGroupIds.includes(group.id))
    .map((group) => ({ id: group.id, label: group.name }));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage user groups"
      description="Add or remove the user groups this user belongs to."
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
          {/* User Info Box */}
          <InfoBox label="User" value={userName} />
        </VStack>

        {/* User Groups Section */}
        <VStack gap={3} className="w-full pb-5">
          {/* Section Header */}
          <VStack gap={1}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                User groups
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">*</span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)]">
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
            selectedCount={selectedGroupIds.length > 0 ? selectedGroupIds.length : undefined}
            onPageChange={setCurrentPage}
          />

          {/* User Groups Table + Selection Indicator */}
          <VStack gap={2} className="w-full">
            <Table<UserGroupItem>
              columns={userGroupColumns}
              data={paginatedGroups}
              rowKey="id"
              selectable
              selectedKeys={selectedGroupIds}
              onSelectionChange={setSelectedGroupIds}
              emptyMessage="No user groups found"
            />

            <SelectionIndicator
              selectedItems={selectedItems}
              onRemove={handleRemoveSelection}
              emptyText="No items selected"
              error={hasAttemptedSubmit && selectedGroupIds.length === 0}
              errorMessage="Please select at least one user group."
              className="shrink-0 w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageUserGroupsDrawer;
