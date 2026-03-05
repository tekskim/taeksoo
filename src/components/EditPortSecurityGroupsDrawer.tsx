import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Toggle,
  SelectionIndicator,
  FormField,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
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

export interface PortInfo {
  id: string;
  name: string;
}

export interface EditPortSecurityGroupsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  port: PortInfo;
  securityGroups?: SecurityGroupItem[];
  initialSelectedGroupIds?: string[];
  initialPortSecurityEnabled?: boolean;
  onSave?: (data: { portSecurityEnabled: boolean; securityGroupIds: string[] }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultSecurityGroups: SecurityGroupItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `sg-${i + 1}`,
  name: 'default-sg',
  description: '-',
  createdAt: 'Aug 23, 2025',
}));

const ITEMS_PER_PAGE = 5;

const securityGroupColumns: TableColumn<SecurityGroupItem>[] = [
  {
    key: 'name',
    label: 'Name',
    render: (_value, row) => (
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="text-label-md text-[var(--color-action-primary)] leading-4 truncate">
            {row.name}
          </span>
          <IconExternalLink
            size={12}
            stroke={1.5}
            className="shrink-0 text-[var(--color-action-primary)]"
          />
        </div>
        <span className="text-body-sm text-[var(--color-text-subtle)] leading-4 truncate">
          ID : {row.id}
        </span>
      </div>
    ),
  },
  { key: 'description', label: 'Description' },
  { key: 'createdAt', label: 'Created at' },
];

/* ----------------------------------------
   Filter Tag Component
   ---------------------------------------- */

interface FilterTagProps {
  label: string;
  value: string;
  onRemove: () => void;
}

function FilterTag({ label, value, onRemove }: FilterTagProps) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md">
      <span className="text-label-sm text-[var(--color-text-default)]">{label}</span>
      <span className="text-body-sm text-[var(--color-border-default)]">|</span>
      <span className="text-label-sm text-[var(--color-text-default)]">{value}</span>
      <button
        onClick={onRemove}
        className="flex items-center justify-center hover:bg-[var(--color-surface-subtle)] rounded"
      >
        <IconX size={16} className="text-[var(--color-text-default)]" />
      </button>
    </div>
  );
}

/* ----------------------------------------
   EditPortSecurityGroupsDrawer Component
   ---------------------------------------- */

export function EditPortSecurityGroupsDrawer({
  isOpen,
  onClose,
  port,
  securityGroups = defaultSecurityGroups,
  initialSelectedGroupIds = [],
  initialPortSecurityEnabled = true,
  onSave,
}: EditPortSecurityGroupsDrawerProps) {
  // Port security toggle state
  const [portSecurityEnabled, setPortSecurityEnabled] = useState(initialPortSecurityEnabled);

  // Security Groups state
  const [selectedSecurityGroupIds, setSelectedSecurityGroupIds] =
    useState<string[]>(initialSelectedGroupIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter state (for demonstration - search term becomes a filter tag)
  const [activeFilter, setActiveFilter] = useState<{ label: string; value: string } | null>(null);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setPortSecurityEnabled(initialPortSecurityEnabled);
      setSelectedSecurityGroupIds(initialSelectedGroupIds);
      setSearchQuery('');
      setCurrentPage(1);
      setActiveFilter(null);
    }
  }, [isOpen]);

  // Filter security groups
  const filteredSecurityGroups = securityGroups.filter((sg) => {
    const matchesSearch =
      searchQuery === '' ||
      sg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sg.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      !activeFilter || sg.name.toLowerCase().includes(activeFilter.value.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredSecurityGroups.length / ITEMS_PER_PAGE);
  const paginatedSecurityGroups = filteredSecurityGroups.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.({
        portSecurityEnabled,
        securityGroupIds: portSecurityEnabled ? selectedSecurityGroupIds : [],
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPortSecurityEnabled(initialPortSecurityEnabled);
    setSelectedSecurityGroupIds(initialSelectedGroupIds);
    setSearchQuery('');
    setCurrentPage(1);
    setActiveFilter(null);
    onClose();
  };

  const handleSecurityGroupToggle = (sgId: string) => {
    setSelectedSecurityGroupIds((prev) =>
      prev.includes(sgId) ? prev.filter((id) => id !== sgId) : [...prev, sgId]
    );
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setActiveFilter({ label: 'Name', value: searchQuery.trim() });
      setSearchQuery('');
      setCurrentPage(1);
    }
  };

  const handleClearFilters = () => {
    setActiveFilter(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage security groups"
      description="When disabled, no security groups will be applied, and anti-spoofing checks are turned off."
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        <VStack gap={3}>
          <InfoBox label="Port name" value={port.name} />
        </VStack>

        {/* Port Security Toggle Section */}
        <FormField label="Port security">
          <Toggle
            checked={portSecurityEnabled}
            onChange={(e) => setPortSecurityEnabled(e.target.checked)}
            label={portSecurityEnabled ? 'On' : 'Off'}
          />
        </FormField>

        {/* Security Groups Section - Only shown when port security is enabled */}
        {portSecurityEnabled && (
          <VStack gap={3} className="pb-5">
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
              Security groups
            </h3>

            {/* Search */}
            <div className="w-[280px]">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                placeholder="Search security group by attributes"
                size="sm"
                fullWidth
              />
            </div>

            {/* Filter Tags Bar */}
            {activeFilter && (
              <div className="flex items-center justify-between w-full px-2 py-2 bg-[var(--color-surface-muted)] rounded-md">
                <FilterTag
                  label={activeFilter.label}
                  value={activeFilter.value}
                  onRemove={handleClearFilters}
                />
                <button
                  onClick={handleClearFilters}
                  className="text-label-sm text-[var(--color-action-primary)] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredSecurityGroups.length}
              onPageChange={setCurrentPage}
              selectedCount={selectedSecurityGroupIds.length}
            />

            <VStack gap={2}>
              <div className="w-[648px] max-w-[648px]">
                <Table<SecurityGroupItem>
                  columns={securityGroupColumns}
                  data={paginatedSecurityGroups}
                  rowKey="id"
                  selectable
                  selectedKeys={selectedSecurityGroupIds}
                  onSelectionChange={setSelectedSecurityGroupIds}
                  onRowClick={(row) => handleSecurityGroupToggle(row.id)}
                  emptyMessage="No security groups found"
                />
              </div>

              {/* Selection Indicator - Below table */}
              <SelectionIndicator
                selectedItems={selectedSecurityGroupIds.map((id) => ({
                  id,
                  label: securityGroups.find((sg) => sg.id === id)?.name || '',
                }))}
                onRemove={(id) =>
                  setSelectedSecurityGroupIds((prev) => prev.filter((sgId) => sgId !== id))
                }
                emptyText="No item selected"
                className="w-full"
              />
            </VStack>
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default EditPortSecurityGroupsDrawer;
