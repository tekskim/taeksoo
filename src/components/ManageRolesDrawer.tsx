import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  SelectionIndicator,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface RoleItem {
  id: string;
  name: string;
  type: 'Built-in' | 'Custom';
  policies: string;
  createdAt: string;
}

export interface ManageRolesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  initialSelectedIds?: string[];
  roles?: RoleItem[];
  onSubmit?: (data: { roleIds: string[] }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultRoles: RoleItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `role-${i + 1}`,
  name: 'viewer',
  type: 'Built-in',
  policies: 'ReadCompute (+2)',
  createdAt: 'Sep 12, 2025',
}));

const ITEMS_PER_PAGE = 5;

const roleColumns: TableColumn<RoleItem>[] = [
  {
    key: 'name',
    label: 'Name',
    flex: 1,
    sortable: true,
    render: (_, row) => (
      <span className="flex items-center gap-1.5">
        <span className="font-medium text-[var(--color-action-primary)] truncate">{row.name}</span>
        <IconExternalLink
          size={12}
          stroke={1.5}
          className="shrink-0 text-[var(--color-action-primary)]"
        />
      </span>
    ),
  },
  { key: 'type', label: 'Type', flex: 1 },
  { key: 'policies', label: 'Policies', flex: 1 },
  { key: 'createdAt', label: 'Created at', flex: 1, sortable: true },
];

/* ----------------------------------------
   ManageRolesDrawer Component
   ---------------------------------------- */

export function ManageRolesDrawer({
  isOpen,
  onClose,
  userName = 'thaki.kim',
  initialSelectedIds = [],
  roles = defaultRoles,
  onSubmit,
}: ManageRolesDrawerProps) {
  // Role selection state
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([...initialSelectedIds]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Filter roles
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.policies.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRoleIds([...initialSelectedIds]);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    // Validate required fields
    if (selectedRoleIds.length === 0) {
      return; // Don't submit if no roles selected
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        roleIds: selectedRoleIds,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedRoleIds([...initialSelectedIds]);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleRemoveSelection = (roleId: string) => {
    setSelectedRoleIds((prev) => prev.filter((id) => id !== roleId));
  };

  // Get selected items for SelectionIndicator
  const selectedItems = roles
    .filter((role) => selectedRoleIds.includes(role.id))
    .map((role) => ({ id: role.id, label: role.name }));

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
              Manage roles
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Manages roles directly assigned to the user. The user receives permissions from both
              direct assignments and roles inherited from groups.
            </p>
          </VStack>

          {/* User Info Box */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">User</span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {userName}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* Roles Section */}
        <VStack gap={4} className="w-full pb-5">
          {/* Section Header */}
          <VStack gap={2}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Roles
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">*</span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Select roles to assign to this user. If a role's permissions change, the user's
              permissions are updated automatically.
            </p>
          </VStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search roles by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRoles.length}
            selectedCount={selectedRoleIds.length > 0 ? selectedRoleIds.length : undefined}
            onPageChange={setCurrentPage}
          />

          {/* Roles Table + Selection Indicator */}
          <VStack gap={2} className="w-full">
            <Table<RoleItem>
              columns={roleColumns}
              data={paginatedRoles}
              rowKey="id"
              selectable
              selectedKeys={selectedRoleIds}
              onSelectionChange={setSelectedRoleIds}
              emptyMessage="No roles found"
            />

            <SelectionIndicator
              selectedItems={selectedItems}
              onRemove={handleRemoveSelection}
              emptyText="No items selected"
              error={hasAttemptedSubmit && selectedRoleIds.length === 0}
              errorMessage="Please select at least one role."
              className="shrink-0 w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageRolesDrawer;
