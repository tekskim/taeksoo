import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Table,
  Checkbox,
  Toggle,
  StatusIndicator,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface SNICertificateItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  domain: string;
  listeners: string;
  expiresAt: string;
}

export interface ManageSNICertificateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isSNIEnabled?: boolean;
  certificates?: SNICertificateItem[];
  selectedCertificateIds?: string[];
  onSave?: (enabled: boolean, selectedCertificateIds: string[]) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockCertificates: SNICertificateItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `29tgj${234 + i}`,
  name: 'server-01',
  status: 'active',
  domain: '.domain.com',
  listeners: 'listener-1 (+3)',
  expiresAt: '2025.10.10',
}));

/* ----------------------------------------
   ManageSNICertificateDrawer Component
   ---------------------------------------- */

export function ManageSNICertificateDrawer({
  isOpen,
  onClose,
  isSNIEnabled = true,
  certificates = mockCertificates,
  selectedCertificateIds = [],
  onSave,
}: ManageSNICertificateDrawerProps) {
  const [sniEnabled, setSniEnabled] = useState(isSNIEnabled);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedCertificateIds);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.listeners.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCertificates = filteredCertificates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleToggleCertificate = (certId: string) => {
    setSelectedIds((prev) =>
      prev.includes(certId)
        ? prev.filter((id) => id !== certId)
        : [...prev, certId]
    );
  };

  const columns: TableColumn<SNICertificateItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Checkbox
          checked={selectedIds.includes(row.id)}
          onChange={() => handleToggleCertificate(row.id)}
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
      key: 'domain',
      label: 'Domain',
      sortable: true,
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

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave?.(sniEnabled, selectedIds);
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage SNI Certificate"
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
        {/* SNI Toggle Section */}
        <VStack gap={3} alignItems="start">
          <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
            SNI
          </h6>
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
            Add more certificates here to host multiple, different HTTPS websites on this single listener.
          </p>
          <Toggle
            checked={sniEnabled}
            onChange={setSniEnabled}
            label={sniEnabled ? 'On' : 'Off'}
          />
        </VStack>

        {/* SNI Certificates Section */}
        {sniEnabled && (
          <VStack gap={3} className="flex-1">
            <h6 className="text-[length:var(--font-size-14)] font-medium text-[var(--color-text-default)]">
              SNI Certificates
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
              <Table<SNICertificateItem>
                columns={columns}
                data={paginatedCertificates}
                rowKey="id"
                selectedKeys={selectedIds}
                onRowClick={(row) => handleToggleCertificate(row.id)}
                emptyMessage="No SNI certificates available"
              />
            </div>
          </VStack>
        )}
      </VStack>
    </Drawer>
  );
}

export default ManageSNICertificateDrawer;

