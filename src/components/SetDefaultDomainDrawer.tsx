import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
} from '@/design-system';
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
    createdAt: '2025-09-12',
  },
  {
    id: 'domain-2',
    name: 'engineering',
    description: 'Engineering team domain',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'domain-3',
    name: 'marketing',
    description: '-',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'domain-4',
    name: 'sales',
    description: 'Sales department',
    status: 'active',
    createdAt: '2025-09-12',
  },
  {
    id: 'domain-5',
    name: 'hr',
    description: 'Human resources',
    status: 'active',
    createdAt: '2025-09-12',
  },
  { id: 'domain-6', name: 'finance', description: '-', status: 'active', createdAt: '2025-09-12' },
  {
    id: 'domain-7',
    name: 'operations',
    description: 'Operations team',
    status: 'active',
    createdAt: '2025-09-12',
  },
  { id: 'domain-8', name: 'support', description: '-', status: 'active', createdAt: '2025-09-12' },
  {
    id: 'domain-9',
    name: 'research',
    description: 'R&D domain',
    status: 'active',
    createdAt: '2025-09-12',
  },
  { id: 'domain-10', name: 'legal', description: '-', status: 'active', createdAt: '2025-09-12' },
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
  const itemsPerPage = 10;

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
              Set default domain
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
              Defines which domain is opened first when the system administrator signs in. The
              selected domain is used as the initial workspace.
            </p>
          </VStack>

          {/* Admin Info Card */}
          <div className="bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                System administrator
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {adminUsername}
              </span>
            </VStack>
          </div>
        </VStack>

        {/* Domains Section */}
        <VStack gap={4} className="pb-5">
          {/* Section Header */}
          <VStack gap={2}>
            <div className="flex items-start gap-[3px]">
              <span className="text-label-lg text-[var(--color-text-default)] leading-5">
                Domains
              </span>
              <span className="text-label-lg text-[var(--color-state-danger)] leading-5">*</span>
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
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
          />

          {/* Table */}
          <VStack gap={1} className="w-full">
            {/* Table Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" />
              <div className="flex w-[60px] items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] border-l border-[var(--color-border-default)]">
                <span className="text-[var(--table-header-font-size)] font-medium text-[var(--color-text-default)] leading-[var(--table-line-height)]">
                  Status
                </span>
              </div>
              <div className="flex flex-[1_0_0] items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] border-l border-[var(--color-border-default)]">
                <span className="text-[var(--table-header-font-size)] font-medium text-[var(--color-text-default)] leading-[var(--table-line-height)]">
                  Name
                </span>
              </div>
              <div className="flex flex-[1_0_0] items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] border-l border-[var(--color-border-default)]">
                <span className="text-[var(--table-header-font-size)] font-medium text-[var(--color-text-default)] leading-[var(--table-line-height)]">
                  Description
                </span>
              </div>
              <div className="flex flex-[1_0_0] items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] border-l border-[var(--color-border-default)]">
                <span className="text-[var(--table-header-font-size)] font-medium text-[var(--color-text-default)] leading-[var(--table-line-height)]">
                  Created at
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {paginatedDomains.map((domain) => (
              <div
                key={domain.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)] hover:bg-[var(--table-row-hover-bg)] transition-all cursor-pointer ${
                  selectedDomainId === domain.id ? 'bg-[var(--color-state-info-bg)]' : ''
                }`}
                onClick={() => setSelectedDomainId(domain.id)}
              >
                <div className="w-[var(--table-checkbox-width)] flex items-center justify-center">
                  <Radio
                    checked={selectedDomainId === domain.id}
                    onChange={() => setSelectedDomainId(domain.id)}
                  />
                </div>
                <div className="flex w-[60px] items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]">
                  <StatusIndicator status={domain.status} />
                </div>
                <div className="flex flex-[1_0_0] items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]">
                  <span className="text-[var(--table-font-size)] text-[var(--color-text-default)] leading-[var(--table-line-height)]">
                    {domain.name}
                  </span>
                </div>
                <div className="flex flex-[1_0_0] items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]">
                  <span className="text-[var(--table-font-size)] text-[var(--color-text-default)] leading-[var(--table-line-height)]">
                    {domain.description}
                  </span>
                </div>
                <div className="flex flex-[1_0_0] items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)]">
                  <span className="text-[var(--table-font-size)] text-[var(--color-text-default)] leading-[var(--table-line-height)]">
                    {domain.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </VStack>

          {/* Selection Indicator */}
          <SelectionIndicator
            selectedItems={selectedItems}
            onRemove={() => setSelectedDomainId(null)}
            emptyText="No items selected"
            error={hasAttemptedSubmit && !selectedDomainId}
            errorMessage="Please select a domain to set as default"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default SetDefaultDomainDrawer;
