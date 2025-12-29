import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Checkbox,
  Toggle,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SecurityGroupItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface FilterTag {
  key: string;
  value: string;
}

export interface ManagePortSecurityGroupsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  portName: string;
  initialPortSecurity?: boolean;
  securityGroups?: SecurityGroupItem[];
  initialSelectedIds?: string[];
  onSave?: (data: { portSecurity: boolean; securityGroupIds: string[] }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockSecurityGroups: SecurityGroupItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `k2l2j${123 + i}`,
  name: i === 0 ? 'default-sg' : `default-sg`,
  description: '-',
  createdAt: '2025-08-23',
}));

/* ----------------------------------------
   ManagePortSecurityGroupsDrawer Component
   ---------------------------------------- */

export function ManagePortSecurityGroupsDrawer({
  isOpen,
  onClose,
  portName,
  initialPortSecurity = true,
  securityGroups = mockSecurityGroups,
  initialSelectedIds = [],
  onSave,
}: ManagePortSecurityGroupsDrawerProps) {
  const [portSecurity, setPortSecurity] = useState(initialPortSecurity);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTags, setFilterTags] = useState<FilterTag[]>([{ key: 'Name', value: 'sg' }]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds.length > 0 ? initialSelectedIds : ['k2l2j123']);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  // Apply search and filter tags
  const filteredGroups = securityGroups.filter((group) => {
    // Apply search term
    const matchesSearch =
      searchTerm === '' ||
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply filter tags
    const matchesTags = filterTags.every((tag) => {
      if (tag.key.toLowerCase() === 'name') {
        return group.name.toLowerCase().includes(tag.value.toLowerCase());
      }
      return true;
    });

    return matchesSearch && matchesTags;
  });

  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectGroup = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = (id: string) => {
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  };

  const handleClearFilters = () => {
    setFilterTags([]);
    setSearchTerm('');
  };

  const handleRemoveFilterTag = (index: number) => {
    setFilterTags((prev) => prev.filter((_, i) => i !== index));
  };

  const columns: TableColumn<SecurityGroupItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Checkbox
          checked={selectedIds.includes(row.id)}
          onChange={() => handleSelectGroup(row.id)}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/security-groups/${item.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{item.name}</span>
            <IconExternalLink size={12} className="flex-shrink-0" />
          </a>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
            ID : {item.id}
          </span>
        </VStack>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
    },
  ];

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.({ portSecurity, securityGroupIds: selectedIds });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setCurrentPage(1);
    onClose();
  };

  const selectedGroups = securityGroups.filter((g) => selectedIds.includes(g.id));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage Security Groups"
      description="When disabled, no security groups will be applied, and anti-spoofing checks are turned off."
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Port Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Port name
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {portName}
          </p>
        </div>

        {/* Port Security Toggle */}
        <VStack gap={3} alignItems="start">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            Port security
          </h6>
          <Toggle
            checked={portSecurity}
            onChange={setPortSecurity}
            label={portSecurity ? 'On' : 'Off'}
          />
        </VStack>

        {/* Security Groups Section */}
        {portSecurity && (
          <VStack gap={3} className="flex-1">
            <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
              Security Groups
            </h6>

            {/* Search */}
            <div className="w-[280px]">
              <SearchInput
                placeholder="Find security group with filters"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filter Tags Bar */}
            {filterTags.length > 0 && (
              <div className="flex items-center justify-between w-full bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] px-2 py-2">
                <HStack gap={2}>
                  {filterTags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-sm)] pl-2 pr-1.5 py-1"
                    >
                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                        {tag.key}
                      </span>
                      <span className="text-[11px] text-[var(--color-border-default)]">|</span>
                      <span className="text-[11px] font-medium text-[var(--color-text-default)]">
                        {tag.value}
                      </span>
                      <button
                        onClick={() => handleRemoveFilterTag(index)}
                        className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded"
                      >
                        <IconX size={12} className="text-[var(--color-text-default)]" />
                      </button>
                    </div>
                  ))}
                </HStack>
                <button
                  onClick={handleClearFilters}
                  className="text-[11px] font-medium text-[var(--color-action-primary)] hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <HStack gap={2} alignItems="center" className="w-full">
              <Pagination
                totalItems={filteredGroups.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
              <div className="w-px h-4 bg-[var(--color-border-default)]" />
              <span className="text-[11px] text-[var(--color-text-subtle)]">
                {filteredGroups.length} items
              </span>
            </HStack>

            {/* Security Groups Table */}
            <div className="flex-1 overflow-auto">
              <Table<SecurityGroupItem>
                columns={columns}
                data={paginatedGroups}
                rowKey="id"
                selectedKeys={selectedIds}
                onRowClick={(row) => handleSelectGroup(row.id)}
                emptyMessage="No security groups available"
              />
            </div>

            {/* Selected Security Groups */}
            {selectedGroups.length > 0 && (
              <div className="flex items-center gap-1 w-full bg-[var(--color-surface-subtle)] rounded-[var(--radius-sm)] px-2 py-2">
                {selectedGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-1.5 bg-[var(--color-action-primary)] rounded-[var(--radius-sm)] pl-2 pr-1.5 py-1"
                  >
                    <span className="text-[11px] font-medium text-white">{group.name}</span>
                    <button
                      onClick={() => handleRemoveSelected(group.id)}
                      className="p-0.5 hover:bg-white/20 rounded"
                    >
                      <IconX size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default ManagePortSecurityGroupsDrawer;

