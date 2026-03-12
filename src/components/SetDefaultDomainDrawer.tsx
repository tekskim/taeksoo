import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  Table,
  StatusIndicator,
  SelectionIndicator,
  fixedColumns,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface DomainItem {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'error' | 'muted';
  createdAt: string;
}

export interface SetDefaultDomainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  adminUsername?: string;
  currentDefaultDomainId?: string;
  onSubmit?: (domainId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockDomains: DomainItem[] = [
  {
    id: 'domain-1',
    name: 'default',
    description: 'Default domain',
    status: 'active',
    createdAt: 'Sep 12, 2025 08:15:22',
  },
  {
    id: 'domain-2',
    name: 'engineering',
    description: 'Engineering team domain',
    status: 'active',
    createdAt: 'Sep 12, 2025 09:32:45',
  },
  {
    id: 'domain-3',
    name: 'marketing',
    description: '-',
    status: 'active',
    createdAt: 'Sep 12, 2025 10:48:11',
  },
  {
    id: 'domain-4',
    name: 'sales',
    description: 'Sales department',
    status: 'active',
    createdAt: 'Sep 12, 2025 11:55:33',
  },
  {
    id: 'domain-5',
    name: 'hr',
    description: 'Human resources',
    status: 'active',
    createdAt: 'Sep 12, 2025 13:12:07',
  },
  {
    id: 'domain-6',
    name: 'finance',
    description: '-',
    status: 'active',
    createdAt: 'Sep 12, 2025 14:28:52',
  },
  {
    id: 'domain-7',
    name: 'operations',
    description: 'Operations team',
    status: 'active',
    createdAt: 'Sep 12, 2025 15:41:18',
  },
  {
    id: 'domain-8',
    name: 'support',
    description: '-',
    status: 'active',
    createdAt: 'Sep 12, 2025 16:03:44',
  },
  {
    id: 'domain-9',
    name: 'research',
    description: 'R&D domain',
    status: 'active',
    createdAt: 'Sep 12, 2025 17:19:29',
  },
  {
    id: 'domain-10',
    name: 'legal',
    description: '-',
    status: 'active',
    createdAt: 'Sep 12, 2025 18:36:55',
  },
];

const getDomainColumns = (
  selectedDomainId: string | null,
  onSelect: (id: string) => void
): TableColumn<DomainItem>[] => [
  {
    key: 'radio' as keyof DomainItem,
    label: '',
    width: 40,
    render: (_, row) => (
      <Radio checked={selectedDomainId === row.id} onChange={() => onSelect(row.id)} />
    ),
  },
  {
    key: 'status',
    label: 'Status',
    width: fixedColumns.status,
    align: 'center',
    render: (_, row) => <StatusIndicator layout="icon-only" status={row.status} />,
  },
  { key: 'name', label: 'Name', flex: 1 },
  { key: 'description', label: 'Description', flex: 1 },
  { key: 'createdAt', label: 'Created at', flex: 1 },
];

/* ----------------------------------------
   SetDefaultDomainDrawer Component
   ---------------------------------------- */

export function SetDefaultDomainDrawer({
  isOpen,
  onClose,
  adminUsername = 'thaki.kim',
  currentDefaultDomainId,
  onSubmit,
}: SetDefaultDomainDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(
    currentDefaultDomainId ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const itemsPerPage = 5;

  // Filter domains based on search
  const filteredDomains = useMemo(() => {
    if (!searchQuery.trim()) return mockDomains;
    const query = searchQuery.toLowerCase();
    return mockDomains.filter(
      (domain) =>
        domain.name.toLowerCase().includes(query) ||
        domain.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Paginate
  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);
  const paginatedDomains = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDomains.slice(start, start + itemsPerPage);
  }, [filteredDomains, currentPage]);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setCurrentPage(1);
      setSelectedDomainId(currentDefaultDomainId ?? null);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen, currentDefaultDomainId]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedDomainId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedDomainId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedDomainId(currentDefaultDomainId ?? null);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const domainColumns = useMemo(
    () => getDomainColumns(selectedDomainId, setSelectedDomainId),
    [selectedDomainId]
  );

  const selectedDomain = selectedDomainId
    ? mockDomains.find((d) => d.id === selectedDomainId)
    : null;

  const selectedItems = selectedDomain
    ? [{ id: selectedDomain.id, label: selectedDomain.name }]
    : [];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Set default domain"
      description="Defines which domain is opened first when the system administrator signs in. The selected domain is used as the initial workspace."
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
          {/* Admin Info Card */}
          <InfoBox label="System administrator" value={adminUsername} />
        </VStack>

        {/* Domains Section */}
        <VStack gap={3} className="pb-5">
          {/* Section Header */}
          <VStack gap={1}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Domains
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">*</span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Select one of the available domains to set as the default.
            </p>
          </VStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search domains by attributes"
              size="sm"
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredDomains.length}
            itemsPerPage={itemsPerPage}
            selectedCount={selectedDomainId ? 1 : 0}
          />

          {/* Table + Selection Indicator */}
          <VStack gap={2} className="w-full">
            <Table<DomainItem>
              columns={domainColumns}
              data={paginatedDomains}
              rowKey="id"
              onRowClick={(row) => setSelectedDomainId(row.id)}
              emptyMessage="No domains found"
            />

            <SelectionIndicator
              selectedItems={selectedItems}
              onRemove={() => setSelectedDomainId(null)}
              emptyText="No items selected"
              error={hasAttemptedSubmit && !selectedDomainId}
              errorMessage="Please select a domain to set as default"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default SetDefaultDomainDrawer;
