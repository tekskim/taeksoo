import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  SelectionIndicator,
  StatusIndicator,
  Table,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface ServerCertificateItem {
  id: string;
  name: string;
  domain: string;
  listeners: string;
  listenersCount?: number;
  expiresAt: string;
  status: 'active' | 'error' | 'building' | 'pending';
}

export interface CurrentCertificateInfo {
  name: string;
  expiresAt: string;
}

export interface ChangeServerCertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listenerName?: string;
  currentCertificate: CurrentCertificateInfo;
  certificates?: ServerCertificateItem[];
  onChangeCertificate?: (certificateId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultCertificates: ServerCertificateItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'server-01',
  domain: '.domain.com',
  listeners: 'listener-1',
  listenersCount: 3,
  expiresAt: '2025.10.10',
  status: 'active' as const,
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   ChangeServerCertificateDrawer Component
   ---------------------------------------- */

export function ChangeServerCertificateDrawer({
  isOpen,
  onClose,
  listenerName,
  currentCertificate,
  certificates = defaultCertificates,
  onChangeCertificate,
}: ChangeServerCertificateDrawerProps) {
  // Certificate selection state
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCertificateId(null);
      setSearchQuery('');
      setCurrentPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  // Filter certificates
  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.listeners.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);
  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const certificateColumns: TableColumn<ServerCertificateItem>[] = [
    {
      key: 'id' as keyof ServerCertificateItem,
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
      render: (_value, row) => <StatusIndicator layout="icon-only" status={row.status} size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)] truncate">
              {row.name}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="shrink-0 text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            ID : {row.id}
          </span>
        </div>
      ),
    },
    { key: 'domain', label: 'SAN', sortable: true },
    {
      key: 'listeners',
      label: 'Listeners',
      sortable: true,
      render: (_value, row) =>
        row.listenersCount && row.listenersCount > 0
          ? `${row.listeners} (+${row.listenersCount})`
          : row.listeners,
    },
    { key: 'expiresAt', label: 'Expires at', sortable: true },
  ];

  const handleChange = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedCertificateId) return;

    setIsSubmitting(true);
    try {
      await onChangeCertificate?.(selectedCertificateId);
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

  const selectedCertificate = certificates.find((cert) => cert.id === selectedCertificateId);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Change server certificate"
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleChange}
            disabled={isSubmitting}
            className="w-[152px]"
          >
            {isSubmitting ? 'Changing...' : 'Change'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        <InfoBox.Group>
          {listenerName && <InfoBox label="Listener" value={listenerName} />}
          <InfoBox
            label="Current server certificate"
            value={`${currentCertificate.name} (expired on ${currentCertificate.expiresAt})`}
          />
        </InfoBox.Group>

        {/* New Server Certificate Section */}
        <VStack gap={3} className="pb-5">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            New server certificate
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
            <Table<ServerCertificateItem>
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
              className="w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ChangeServerCertificateDrawer;
