import { useState, useEffect } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput,
  Pagination,
  Checkbox,
  Toggle,
  StatusIndicator,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

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
  const [selectedCertificateIds, setSelectedCertificateIds] = useState<Set<string>>(new Set(initialSelectedIds));
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter certificates
  const filteredCertificates = certificates.filter((cert) =>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Select all logic
  const allCurrentPageSelected = paginatedCertificates.length > 0 && 
    paginatedCertificates.every((cert) => selectedCertificateIds.has(cert.id));
  const someCurrentPageSelected = paginatedCertificates.some((cert) => selectedCertificateIds.has(cert.id));
  
  const handleSelectAll = () => {
    if (allCurrentPageSelected) {
      // Deselect all on current page
      setSelectedCertificateIds((prev) => {
        const newSet = new Set(prev);
        paginatedCertificates.forEach((cert) => newSet.delete(cert.id));
        return newSet;
      });
    } else {
      // Select all on current page
      setSelectedCertificateIds((prev) => {
        const newSet = new Set(prev);
        paginatedCertificates.forEach((cert) => newSet.add(cert.id));
        return newSet;
      });
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="w-[152px] h-8"
          >
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
        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
          Manage SNI Certificate
        </h2>

        {/* SNI Toggle Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h3 className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
              SNI
            </h3>
            <p className="text-[12px] text-[var(--color-text-subtle)] leading-4">
              Add more certificates here to host multiple, different HTTPS websites on this single listener.
            </p>
          </VStack>
          <HStack gap={2} align="center">
            <Toggle
              checked={sniEnabled}
              onChange={setSniEnabled}
            />
            <span className="text-[12px] text-[var(--color-text-default)]">
              {sniEnabled ? 'On' : 'Off'}
            </span>
          </HStack>
        </VStack>

        {/* SNI Certificates Section */}
        <VStack gap={3} className="w-full pb-5">
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)] leading-5">
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
            selectedCount={selectedCertificateIds.size > 0 ? selectedCertificateIds.size : undefined}
            onPageChange={setCurrentPage}
          />

          {/* Certificates Table */}
          <div className="flex flex-col gap-[var(--table-row-gap)]" style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div className="flex items-stretch min-h-[var(--table-row-height)] bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-[var(--table-row-radius)]">
              <div className="w-[var(--table-checkbox-width)] flex items-center justify-center">
                <Checkbox
                  checked={allCurrentPageSelected}
                  indeterminate={someCurrentPageSelected && !allCurrentPageSelected}
                  onChange={handleSelectAll}
                />
              </div>
              <div className="w-[59px] flex items-center justify-center px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)]">
                Status
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Name
                <IconChevronDown size={12} />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Domain
                <IconChevronDown size={12} />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Listeners
                <IconChevronDown size={12} />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-[var(--table-cell-padding-x)] py-[var(--table-header-padding-y)] text-[length:var(--table-header-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-text-default)] border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]">
                Expires At
                <IconChevronDown size={12} />
              </div>
            </div>

            {/* Rows */}
            {paginatedCertificates.map((cert) => (
              <div 
                key={cert.id}
                className={`flex items-stretch min-h-[var(--table-row-height)] border rounded-[var(--table-row-radius)] cursor-pointer transition-all ${
                  selectedCertificateIds.has(cert.id) 
                    ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]' 
                    : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                }`}
                onClick={() => handleToggleCertificate(cert.id)}
              >
                {/* Checkbox */}
                <div className="w-[var(--table-checkbox-width)] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedCertificateIds.has(cert.id)}
                    onChange={() => handleToggleCertificate(cert.id)}
                  />
                </div>
                {/* Status */}
                <div className="w-[59px] flex items-center justify-center">
                  <StatusIndicator status={cert.status} layout="icon-only" size="sm" />
                </div>
                {/* Name with ID */}
                <div className="flex-1 flex flex-col justify-center gap-0.5 px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <HStack gap={1.5} align="center">
                    <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] font-medium text-[var(--color-action-primary)] truncate">{cert.name}</span>
                    <IconExternalLink size={12} stroke={1.5} className="shrink-0 text-[var(--color-action-primary)]" />
                  </HStack>
                  <span className="text-[11px] text-[var(--color-text-subtle)] truncate">ID : {cert.id}</span>
                </div>
                {/* Domain */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">{cert.domain}</span>
                </div>
                {/* Listeners */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">{cert.listeners}</span>
                </div>
                {/* Expires At */}
                <div className="flex-1 flex items-center px-[var(--table-cell-padding-x)] py-[var(--table-cell-padding-y)] min-w-0 overflow-hidden">
                  <span className="text-[length:var(--table-font-size)] leading-[var(--table-line-height)] text-[var(--color-text-default)] truncate">{cert.expiresAt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Indicator - directly under the table */}
          <SelectionIndicator
            selectedItems={selectedItems}
            onRemove={handleRemoveSelection}
            emptyText="No item Selected"
            className="shrink-0"
            style={{ width: '648px' }}
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageSNICertificateDrawer;
