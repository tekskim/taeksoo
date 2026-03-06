import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  StatusIndicator,
  Radio,
  SelectionIndicator,
  Table,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

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
  createdAt: 'Sep 1, 2025',
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

  const floatingIpColumns: TableColumn<FloatingIPItem>[] = [
    {
      key: 'id' as keyof FloatingIPItem,
      label: '',
      width: 40,
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="floating-ip-select"
            value={row.id}
            checked={selectedFloatingIpId === row.id}
            onChange={() => setSelectedFloatingIpId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 60,
      align: 'center',
      render: (_value, row) => <StatusIndicator status={row.status} size="sm" />,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)] truncate">
              {row.floatingIp}
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
    { key: 'fixedIp', label: 'Fixed IP', sortable: true },
    { key: 'createdAt', label: 'Created at', sortable: true },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Disassociate floating IP"
      description="Remove the association between this floating IP and the instance. Once disassociated, the instance will lose external network access through this IP."
      width={700}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDisassociate}
            disabled={false}
            className="w-[152px] h-8"
          >
            Disassociate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Instance Info */}
        <InfoBox label="Instance" value={instance.name} />

        {/* Floating IPs Section */}
        <VStack gap={3}>
          <VStack gap={1}>
            <span className="text-label-lg text-[var(--color-text-default)]">
              Floating IPs<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </span>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select the Floating IP to disassociate from the instance.
            </span>
          </VStack>

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
            selectedCount={selectedFloatingIpId ? 1 : 0}
          />

          <VStack gap={2}>
            <Table<FloatingIPItem>
              columns={floatingIpColumns}
              data={paginatedFloatingIps}
              rowKey="id"
              onRowClick={(row) => setSelectedFloatingIpId(row.id)}
              emptyMessage="No floating IPs found"
            />
            <SelectionIndicator
              selectedItems={
                selectedFloatingIpId
                  ? [
                      {
                        id: selectedFloatingIpId,
                        label:
                          floatingIps.find((f) => f.id === selectedFloatingIpId)?.floatingIp || '',
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
        </VStack>
      </VStack>
    </Drawer>
  );
}
