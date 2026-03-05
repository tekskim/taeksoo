import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Toggle,
  FormField,
  StatusIndicator,
  SelectionIndicator,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SNICertificateItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  domain: string;
  listeners: string;
  expiresAt: string;
}

export interface ManageSNICertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialSniEnabled?: boolean;
  initialSelectedIds?: string[];
  certificates?: SNICertificateItem[];
  onSubmit?: (data: { sniEnabled: boolean; certificateIds: string[] }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultCertificates: SNICertificateItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'server-01',
  status: 'active',
  domain: '.domain.com',
  listeners: 'listener-1 (+3)',
  expiresAt: '2025.10.10',
}));

const ITEMS_PER_PAGE = 5;

const certificateColumns: TableColumn<SNICertificateItem>[] = [
  {
    key: 'status',
    label: 'Status',
    width: '59px',
    align: 'center',
    render: (_value, row) => <StatusIndicator status={row.status} layout="icon-only" size="sm" />,
  },
  {
    key: 'name',
    label: 'Name',
    render: (_value, row) => (
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <HStack gap={1.5} align="center">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.name}
          </span>
          <IconExternalLink
            size={12}
            stroke={1.5}
            className="shrink-0 text-[var(--color-action-primary)]"
          />
        </HStack>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID : {row.id}</span>
      </div>
    ),
  },
  { key: 'domain', label: 'Domain' },
  { key: 'listeners', label: 'Listeners' },
  { key: 'expiresAt', label: 'Expires at' },
];

/* ----------------------------------------
   ManageSNICertificateDrawer Component
   ---------------------------------------- */

export function ManageSNICertificateDrawer({
  isOpen,
  onClose,
  initialSniEnabled = true,
  initialSelectedIds = [],
  certificates = defaultCertificates,
  onSubmit,
}: ManageSNICertificateDrawerProps) {
  // SNI toggle state
  const [sniEnabled, setSniEnabled] = useState(initialSniEnabled);

  // Certificate selection state
  const [selectedCertificateIds, setSelectedCertificateIds] = useState<Set<string>>(
    new Set(initialSelectedIds)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter certificates
  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.listeners.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);
  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset state when drawer opens - only reset when drawer opens (isOpen changes to true)
  useEffect(() => {
    if (isOpen) {
      setSniEnabled(initialSniEnabled);
      setSelectedCertificateIds(new Set(initialSelectedIds));
      setSearchQuery('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  const handleToggleCertificate = (certId: string) => {
    setSelectedCertificateIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(certId)) {
        newSet.delete(certId);
      } else {
        newSet.add(certId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit?.({
        sniEnabled,
        certificateIds: Array.from(selectedCertificateIds),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCertificateIds(new Set(initialSelectedIds));
    setSniEnabled(initialSniEnabled);
    setSearchQuery('');
    setCurrentPage(1);
    onClose();
  };

  const handleRemoveSelection = (certId: string) => {
    setSelectedCertificateIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(certId);
      return newSet;
    });
  };

  // Get selected items for SelectionIndicator
  const selectedItems = certificates
    .filter((cert) => selectedCertificateIds.has(cert.id))
    .map((cert) => ({ id: cert.id, label: cert.name }));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage SNI certificate"
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
        {/* SNI Toggle Section */}
        <FormField
          label="SNI"
          description="Add more certificates here to host multiple, different HTTPS websites on this single listener."
          spacing="loose"
        >
          <Toggle
            checked={sniEnabled}
            onChange={(e) => setSniEnabled(e.target.checked)}
            label={sniEnabled ? 'On' : 'Off'}
          />
        </FormField>

        {/* SNI Certificates Section */}
        <VStack gap={3} className="w-full pb-5">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            SNI Certificates
          </h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search certificate by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCertificates.length}
            selectedCount={
              selectedCertificateIds.size > 0 ? selectedCertificateIds.size : undefined
            }
            onPageChange={setCurrentPage}
          />

          <VStack gap={2}>
            <div className="w-[648px] max-w-[648px]">
              <Table<SNICertificateItem>
                columns={certificateColumns}
                data={paginatedCertificates}
                rowKey="id"
                selectable
                selectedKeys={Array.from(selectedCertificateIds)}
                onSelectionChange={(keys) => setSelectedCertificateIds(new Set(keys))}
                onRowClick={(row) => handleToggleCertificate(row.id)}
                emptyMessage="No certificates found"
              />
            </div>

            {/* Selection Indicator - directly under the table */}
            <SelectionIndicator
              selectedItems={selectedItems}
              onRemove={handleRemoveSelection}
              emptyText="No item selected"
              className="shrink-0 w-[648px]"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageSNICertificateDrawer;
