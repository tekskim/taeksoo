import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  SelectionIndicator,
  StatusIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

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
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleChange}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Changing...' : 'Change'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Current Certificate Info Box */}
        <div className="w-full px-4 py-3 bg-[var(--color-surface-muted)] rounded-lg">
          <VStack gap={1.5}>
            <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
              Current Server Certificate
            </span>
            <span className="text-body-md text-[var(--color-text-default)] leading-4">
              {currentCertificate.name} (expired on {currentCertificate.expiresAt})
            </span>
          </VStack>
        </div>

        {/* New Server Certificate Section */}
        <VStack gap={3} className="pb-5">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            New Server Certificate
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
          <div className="flex flex-col gap-1" style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div className="flex items-stretch min-h-[40px] bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md">
              <div className="w-[40px] flex items-center justify-center shrink-0" />
              <div className="w-[59px] flex items-center justify-center px-3 border-l border-[var(--color-border-default)]">
                <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                  Status
                </span>
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                  Name
                </span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                  Domain
                </span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                  Listeners
                </span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                <span className="text-label-sm text-[var(--color-text-default)] leading-4">
                  Expires At
                </span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
            </div>

            {/* Rows */}
            {paginatedCertificates.map((cert) => (
              <div
                key={cert.id}
                className={`flex items-stretch min-h-[40px] border rounded-md cursor-pointer transition-all ${
                  selectedCertificateId === cert.id
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => setSelectedCertificateId(cert.id)}
              >
                {/* Radio */}
                <div
                  className="w-[40px] flex items-center justify-center shrink-0"
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
                <div className="w-[59px] flex items-center justify-center p-2 shrink-0">
                  <StatusIndicator status={cert.status} />
                </div>
                {/* Name */}
                <div className="flex-1 flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-label-md text-[var(--color-action-primary)] leading-4 truncate">
                      {cert.name}
                    </span>
                    <IconExternalLink
                      size={12}
                      stroke={1.5}
                      className="shrink-0 text-[var(--color-action-primary)]"
                    />
                  </div>
                  <span className="text-body-sm text-[var(--color-text-subtle)] leading-4 truncate">
                    ID : {cert.id}
                  </span>
                </div>
                {/* Domain */}
                <div className="flex-1 flex items-center px-3 py-2 overflow-hidden min-w-0">
                  <span className="text-body-md text-[var(--color-text-default)] leading-4 truncate">
                    {cert.domain}
                  </span>
                </div>
                {/* Listeners */}
                <div className="flex-1 flex items-center px-3 py-2 overflow-hidden min-w-0">
                  <span className="text-body-md text-[var(--color-text-default)] leading-4 truncate">
                    {cert.listeners}
                    {cert.listenersCount && cert.listenersCount > 0
                      ? ` (+${cert.listenersCount})`
                      : ''}
                  </span>
                </div>
                {/* Expires At */}
                <div className="flex-1 flex items-center px-3 py-2 overflow-hidden min-w-0">
                  <span className="text-body-md text-[var(--color-text-default)] leading-4 truncate">
                    {cert.expiresAt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator - Below table */}
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
            className="w-full"
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ChangeServerCertificateDrawer;
