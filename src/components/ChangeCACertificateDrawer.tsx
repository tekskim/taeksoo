import { useState, useEffect } from 'react';
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
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

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
            Change CA Certificate
          </h2>

          {/* Current Certificate Info Box */}
          <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
            <VStack gap={1.5}>
              <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                Current CA Certificate
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
            New CA Certificate
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
          />

          {/* Certificates Table */}
          <div
            className="flex flex-col gap-[var(--table-row-gap)]"
            style={{ width: '648px', maxWidth: '648px' }}
          >
            {/* Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" />
              <div className="w-[59px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Status
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Name
                <IconChevronDown size={16} />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Listeners
                <IconChevronDown size={16} />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Expires At
                <IconChevronDown size={16} />
              </div>
            </div>

            {/* Rows */}
            {paginatedCertificates.map((cert) => (
              <div
                key={cert.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                  selectedCertificateId === cert.id
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => setSelectedCertificateId(cert.id)}
              >
                {/* Radio */}
                <div
                  className="w-[var(--table-checkbox-width)] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Radio
                    name="certificate-select"
                    value={cert.id}
                    checked={selectedCertificateId === cert.id}
                    onChange={() => setSelectedCertificateId(cert.id)}
                  />
                </div>
                {/* Status */}
                <div className="w-[59px] flex items-center justify-center">
                  <StatusIndicator status={cert.status} layout="icon-only" size="sm" />
                </div>
                {/* Name with ID */}
                <div className="flex-1 flex flex-col justify-center gap-0.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <HStack gap={1.5} align="center">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">
                      {cert.name}
                    </span>
                    <IconExternalLink
                      size={16}
                      stroke={1.5}
                      className="shrink-0 text-[var(--color-action-primary)]"
                    />
                  </HStack>
                  <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                    ID : {cert.id}
                  </span>
                </div>
                {/* Listeners */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {cert.listeners}
                  </span>
                </div>
                {/* Expires At */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">
                    {cert.expiresAt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator - directly under the table */}
          <SelectionIndicator
            selectedItems={
              selectedCertificate
                ? [{ id: selectedCertificate.id, label: selectedCertificate.name }]
                : []
            }
            onRemove={() => setSelectedCertificateId(null)}
            emptyText="No item Selected"
            error={hasAttemptedSubmit && !selectedCertificateId}
            errorMessage="Please select a certificate."
            className="shrink-0"
            style={{ width: '648px' }}
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ChangeCACertificateDrawer;
