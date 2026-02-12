import { useState } from 'react';
import {
  Drawer,
  Button,
  Radio,
  SearchInput,
  Pagination,
  ProgressBar,
  SelectionIndicator,
  InfoBox,
  Table,
  STATUS_THRESHOLDS,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface MigrateInstanceInfo {
  id: string;
  name: string;
  currentHost: string;
}

export interface MigrateInstanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: MigrateInstanceInfo;
  onMigrate?: (hostId: string) => void;
}

/* ----------------------------------------
   Mock Data for Hosts
   ---------------------------------------- */

interface HostItem {
  id: string;
  name: string;
  vcpuUsed: number;
  vcpuTotal: number;
  ramUsed: number;
  ramTotal: number;
  instances: number;
}

const mockHosts: HostItem[] = [
  ...Array.from({ length: 114 }, (_, i) => ({
    id: `host-${i + 1}`,
    name: 'host-02',
    vcpuUsed: 6,
    vcpuTotal: 10,
    ramUsed: 6.0,
    ramTotal: 10.0,
    instances: 10,
  })),
  {
    id: 'host-115',
    name: 'host-02',
    vcpuUsed: 10,
    vcpuTotal: 10,
    ramUsed: 10.0,
    ramTotal: 10.0,
    instances: 10,
  },
];

/* ----------------------------------------
   MigrateInstanceDrawer Component
   ---------------------------------------- */

export function MigrateInstanceDrawer({
  isOpen,
  onClose,
  instance,
  onMigrate,
}: MigrateInstanceDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Host selection state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);

  // Validation state
  const [hostError, setHostError] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // Filter hosts based on search
  const filteredHosts = mockHosts.filter((host) =>
    host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHosts.length / ITEMS_PER_PAGE);
  const paginatedHosts = filteredHosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectHost = (hostId: string) => {
    setSelectedHostId(hostId);
    if (hostError) setHostError(false);
  };

  const hostColumns: TableColumn<HostItem>[] = [
    {
      key: 'id' as keyof HostItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="host-select"
            value={row.id}
            checked={selectedHostId === row.id}
            onChange={() => handleSelectHost(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      minWidth: '80px',
      sortable: true,
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-default)]">{row.name}</span>
      ),
    },
    {
      key: 'vcpuUsed',
      label: 'vCPU',
      flex: 1,
      minWidth: '130px',
      render: (_value, row) => {
        const percent = Math.round((row.vcpuUsed / row.vcpuTotal) * 100);
        return (
          <VStack gap={1} className="w-full">
            <span className="text-body-sm text-[var(--color-text-default)]">
              {row.vcpuUsed}/{row.vcpuTotal} ({percent}%)
            </span>
            <ProgressBar
              value={row.vcpuUsed}
              max={row.vcpuTotal}
              showValue={false}
              size="sm"
              thresholds={STATUS_THRESHOLDS.computeAdmin}
            />
          </VStack>
        );
      },
    },
    {
      key: 'ramUsed',
      label: 'RAM',
      flex: 1.3,
      minWidth: '160px',
      render: (_value, row) => {
        const percent = Math.round((row.ramUsed / row.ramTotal) * 100);
        return (
          <VStack gap={1} className="w-full">
            <span className="text-body-sm text-[var(--color-text-default)]">
              {row.ramUsed.toFixed(2)}/{row.ramTotal.toFixed(2)}GiB ({percent}%)
            </span>
            <ProgressBar
              value={row.ramUsed}
              max={row.ramTotal}
              showValue={false}
              size="sm"
              thresholds={STATUS_THRESHOLDS.computeAdmin}
            />
          </VStack>
        );
      },
    },
    {
      key: 'instances',
      label: 'Instances',
      width: '100px',
      sortable: true,
      render: (value) => (
        <span className="text-body-md text-[var(--color-text-default)]">{value as number}</span>
      ),
    },
  ];

  const handleMigrate = () => {
    if (!selectedHostId) {
      setHostError(true);
      return;
    }
    setIsSubmitting(true);
    onMigrate?.(selectedHostId);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedHostId(null);
    setHostError(false);
    onClose();
  };

  const selectedHost = selectedHostId ? mockHosts.find((h) => h.id === selectedHostId) : null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      showCloseButton={false}
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleMigrate} className="w-[152px]">
            Migrate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        {/* Title */}
        <VStack gap={2}>
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">Migrate instance</h2>
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            Migrate the instance to a different host. Migration does not change the instance
            configuration or data.
          </p>
        </VStack>

        {/* Instance Info */}
        <InfoBox.Group>
          <InfoBox label="Instance" value={instance.name} />
          <InfoBox label="Current compute host" value={instance.currentHost} />
        </InfoBox.Group>

        {/* Hosts Section */}
        <VStack gap={3} className="w-full">
          <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
            Hosts <span className="text-[var(--color-state-danger)]">*</span>
          </h3>
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            Select a host to migrate the instance to. Only available hosts are shown.
          </p>

          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search hosts by attributes"
            size="sm"
            className="w-[var(--search-input-width)]"
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredHosts.length}
            selectedCount={selectedHostId ? 1 : 0}
          />

          {/* Table + Selection Indicator */}
          <VStack gap={2}>
            <Table
              columns={hostColumns}
              data={paginatedHosts}
              rowKey="id"
              onRowClick={(row) => handleSelectHost(row.id)}
              emptyMessage="No hosts found"
            />

            <SelectionIndicator
              selectedItems={
                selectedHost ? [{ id: selectedHost.id, label: selectedHost.name }] : []
              }
              removable={false}
              emptyText="No item selected"
              error={hostError}
              errorMessage="Please select a host to migrate."
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default MigrateInstanceDrawer;
