import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
  SelectionIndicator,
  Table,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CACertificateItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  listeners: string;
  expiresAt: string;
}

export interface CurrentCertificateInfo {
  name: string;
  expiredOn: string;
}

export interface ChangeCACertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCertificate: CurrentCertificateInfo;
  certificates?: CACertificateItem[];
  onSubmit?: (certificateId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultCertificates: CACertificateItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'ca-01',
  status: 'active',
  listeners: 'listener-1',
  expiresAt: '2025.10.10',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   ChangeCACertificateDrawer Component
   ---------------------------------------- */

export function ChangeCACertificateDrawer({
  isOpen,
  onClose,
  currentCertificate,
  certificates = defaultCertificates,
  onSubmit,
}: ChangeCACertificateDrawerProps) {
  // Certificate selection state
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Filter certificates
  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.listeners.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);
  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const certificateColumns: TableColumn<CACertificateItem>[] = [
    {
      key: 'id' as keyof CACertificateItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="certificate-select"
            value={row.id}
            checked={selectedCertificateId === row.id}
            onChange={() => setSelectedCertificateId(row.id)}
          />
        </div>
      ),
    },
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
        <div className="flex flex-col justify-center gap-0.5">
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
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    { key: 'listeners', label: 'Listeners' },
    { key: 'expiresAt', label: 'Expires at' },
  ];

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCertificateId(null);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedCertificateId) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(selectedCertificateId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCertificateId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const selectedCertificate = certificates.find((c) => c.id === selectedCertificateId);

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
            {isSubmitting ? 'Changing...' : 'Change'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
            Change CA certificate
          </h2>

          {/* Current Certificate Info Box */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Current CA certificate
              </span>
              <span className="text-body-md text-[var(--color-text-default)] leading-4">
                {currentCertificate.name} (expired on {currentCertificate.expiredOn})
              </span>
            </VStack>
          </div>
        </VStack>

        {/* New Certificate Section */}
        <VStack gap={3} className="w-full pb-5">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            New CA certificate
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
            onPageChange={setCurrentPage}
            selectedCount={selectedCertificateId ? 1 : 0}
          />

          <VStack gap={2}>
            <Table<CACertificateItem>
              columns={certificateColumns}
              data={paginatedCertificates}
              rowKey="id"
              onRowClick={(row) => setSelectedCertificateId(row.id)}
              emptyMessage="No certificates found"
            />
            <SelectionIndicator
              selectedItems={
                selectedCertificate
                  ? [{ id: selectedCertificate.id, label: selectedCertificate.name }]
                  : []
              }
              onRemove={() => setSelectedCertificateId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedCertificateId}
              errorMessage="Please select a certificate."
              className="shrink-0"
              style={{ width: '648px' }}
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ChangeCACertificateDrawer;
