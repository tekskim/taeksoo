import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  StatusIndicator,
  Radio,
  SelectionIndicator,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FloatingIPItem {
  id: string;
  floatingIp: string;
  status: 'active' | 'error' | 'down';
  fixedIp: string;
  createdAt: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface DisassociateFloatingIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  floatingIps?: FloatingIPItem[];
  onDisassociate?: (floatingIpId: string) => void;
}

/* ----------------------------------------
   Default Data
   ---------------------------------------- */

const defaultFloatingIps: FloatingIPItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `fip-${i + 1}`,
  floatingIp: '203.0.113.25',
  status: 'active',
  fixedIp: '10.0.0.5',
  createdAt: '2025-09-01',
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function DisassociateFloatingIPDrawer({
  isOpen,
  onClose,
  instance,
  floatingIps = defaultFloatingIps,
  onDisassociate,
}: DisassociateFloatingIPDrawerProps) {
  const [selectedFloatingIpId, setSelectedFloatingIpId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const filteredFloatingIps = floatingIps.filter(
    (fip) =>
      fip.floatingIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fip.fixedIp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFloatingIps.length / ITEMS_PER_PAGE);
  const paginatedFloatingIps = filteredFloatingIps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDisassociate = () => {
    setHasAttemptedSubmit(true);

    if (selectedFloatingIpId && onDisassociate) {
      onDisassociate(selectedFloatingIpId);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFloatingIpId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Disassociate floating IP"
      description="Remove the association between this floating IP and the instance. Once disassociated, the instance will lose external network access through this IP."
      width={700}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={handleClose} className="flex-1 h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDisassociate}
            disabled={false}
            className="flex-1 h-8"
          >
            Disassociate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Instance Info */}
        <div className="w-full bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
          <p className="text-body-sm text-[var(--color-text-subtle)] mb-1.5">Instance</p>
          <p className="text-body-md text-[var(--color-text-default)]">{instance.name}</p>
        </div>

        {/* Floating IPs Section */}
        <VStack gap={3}>
          {/* Header */}
          <div className="flex items-center gap-1 h-7">
            <span className="text-label-lg text-[var(--color-text-default)]">Floating IPs</span>
          </div>

          {/* Search */}
          <SearchInput
            placeholder="Search floating IP by attributes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[280px]"
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredFloatingIps.length}
            onPageChange={setCurrentPage}
          />

          {/* Floating IP Table */}
          <div style={{ width: '648px', maxWidth: '648px' }}>
            {/* Header */}
            <div
              style={{ display: 'flex', width: '648px', height: '40px' }}
              className="bg-[var(--color-border-subtle)] border border-[var(--color-border-default)] rounded-md"
            >
              <div
                style={{ width: '40px', flexShrink: 0 }}
                className="flex items-center justify-center"
              />
              <div
                style={{ width: '59px', flexShrink: 0 }}
                className="flex items-center justify-center px-3 border-l border-[var(--color-border-default)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">Status</span>
              </div>
              <div
                style={{ width: '183px', flexShrink: 0 }}
                className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">Floating IP</span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
              <div
                style={{ width: '183px', flexShrink: 0 }}
                className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">Fixed IP</span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
              <div
                style={{ width: '183px', flexShrink: 0 }}
                className="flex items-center gap-1.5 px-3 border-l border-[var(--color-border-default)] cursor-pointer hover:text-[var(--color-action-primary)]"
              >
                <span className="text-label-sm text-[var(--color-text-default)]">Created At</span>
                <IconChevronDown size={16} className="text-[var(--color-text-default)]" />
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                width: '648px',
                maxWidth: '648px',
                marginTop: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {paginatedFloatingIps.map((fip) => (
                <div
                  key={fip.id}
                  onClick={() => setSelectedFloatingIpId(fip.id)}
                  style={{ display: 'flex', width: '648px', minHeight: '40px' }}
                  className={`border rounded-md cursor-pointer transition-all ${
                    selectedFloatingIpId === fip.id
                      ? 'bg-[var(--color-state-info-bg)] border-[var(--color-action-primary)]'
                      : 'bg-[var(--color-surface-default)] border-[var(--color-border-default)] hover:bg-[var(--table-row-hover-bg)]'
                  }`}
                >
                  <div
                    style={{ width: '40px', flexShrink: 0 }}
                    className="flex items-center justify-center"
                  >
                    <Radio
                      name="floating-ip-select"
                      value={fip.id}
                      checked={selectedFloatingIpId === fip.id}
                      onChange={() => setSelectedFloatingIpId(fip.id)}
                    />
                  </div>
                  <div
                    style={{ width: '59px', flexShrink: 0 }}
                    className="flex items-center justify-center px-3"
                  >
                    <StatusIndicator status="active" layout="icon-only" size="sm" />
                  </div>
                  <div
                    style={{ width: '183px', flexShrink: 0 }}
                    className="flex flex-col gap-0.5 justify-center px-3 py-2 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-label-md text-[var(--color-action-primary)] truncate">
                        {fip.floatingIp}
                      </span>
                      <IconExternalLink
                        size={16}
                        className="shrink-0 text-[var(--color-action-primary)]"
                      />
                    </div>
                    <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                      ID : 17kfj123
                    </span>
                  </div>
                  <div
                    style={{ width: '183px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-body-md text-[var(--color-text-default)] truncate">
                      {fip.fixedIp}
                    </span>
                  </div>
                  <div
                    style={{ width: '183px', flexShrink: 0 }}
                    className="flex items-center px-3 py-2 overflow-hidden"
                  >
                    <span className="text-body-md text-[var(--color-text-default)] truncate">
                      {fip.createdAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </VStack>

        {/* Selection Indicator */}
        <SelectionIndicator
          className="shrink-0"
          style={{ width: '648px' }}
          selectedItems={
            selectedFloatingIpId
              ? [
                  {
                    id: selectedFloatingIpId,
                    label: floatingIps.find((f) => f.id === selectedFloatingIpId)?.floatingIp || '',
                  },
                ]
              : []
          }
          onRemove={() => setSelectedFloatingIpId(null)}
          emptyText="No item selected"
          error={hasAttemptedSubmit && !selectedFloatingIpId}
          errorMessage="Please select a floating IP."
        />
      </VStack>
    </Drawer>
  );
}
