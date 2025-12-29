import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Radio,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface CACertificateItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  listeners: string;
  expiresAt: string;
}

export interface ChangeCACertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCertificateName: string;
  currentCertificateExpiry: string;
  certificates?: CACertificateItem[];
  onChange?: (certificateId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockCertificates: CACertificateItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'ca-01',
  status: 'active',
  listeners: 'listener-1',
  expiresAt: '2025.10.10',
}));

/* ----------------------------------------
   ChangeCACertificateDrawer Component
   ---------------------------------------- */

export function ChangeCACertificateDrawer({
  isOpen,
  onClose,
  currentCertificateName,
  currentCertificateExpiry,
  certificates = mockCertificates,
  onChange,
}: ChangeCACertificateDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.listeners.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: TableColumn<CACertificateItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="ca-certificate-select"
          value={row.id}
          checked={selectedCertificateId === row.id}
          onChange={() => setSelectedCertificateId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: (_, item) => (
        <StatusIndicator status={item.status} layout="icon-only" size="sm" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, item) => (
        <VStack gap={0.5} alignItems="start">
          <a
            href={`/certificates/${item.id}`}
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
      key: 'listeners',
      label: 'Listeners',
      sortable: true,
    },
    {
      key: 'expiresAt',
      label: 'Expires At',
      sortable: true,
    },
  ];

  const handleChange = async () => {
    if (!selectedCertificateId) return;
    setIsSubmitting(true);
    try {
      await onChange?.(selectedCertificateId);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedCertificateId(null);
    setCurrentPage(1);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Change CA Certificate"
      width={696}
      footer={
        <HStack gap={2} justifyContent="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} size="md" className="w-[152px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleChange}
            disabled={isSubmitting || !selectedCertificateId}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Changing...' : 'Change'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Current CA Certificate Info */}
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] mb-1.5">
            Current CA Certificate
          </p>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            {currentCertificateName} (expired on {currentCertificateExpiry})
          </p>
        </div>

        {/* New CA Certificate Section */}
        <VStack gap={3} className="flex-1">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            New CA Certificate
          </h6>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              placeholder="Find certificate with filters"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} alignItems="center" className="w-full">
            <Pagination
              totalItems={filteredCertificates.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <div className="w-px h-4 bg-[var(--color-border-default)]" />
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              {filteredCertificates.length} items
            </span>
          </HStack>

          {/* Certificate Table */}
          <div className="flex-1 overflow-auto">
            <Table<CACertificateItem>
              columns={columns}
              data={paginatedCertificates}
              rowKey="id"
              selectedKeys={selectedCertificateId ? [selectedCertificateId] : []}
              onRowClick={(row) => setSelectedCertificateId(row.id)}
              emptyMessage="No CA certificates available"
            />
          </div>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ChangeCACertificateDrawer;

