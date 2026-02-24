import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  StatusIndicator,
  Radio,
  SelectionIndicator,
  Select,
  Table,
  FormField,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface NetworkItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  subnetCidr: string;
  external: boolean;
  shared: boolean;
  inThisProject: boolean;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface AttachInterfaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  networks?: NetworkItem[];
  onAttach?: (networkId: string, fixedIp: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockNetworks: NetworkItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `net-${i + 1}`,
  name: 'net-02',
  status: 'active',
  subnetCidr: '192.168.20.0/24',
  external: false,
  shared: true,
  inThisProject: true,
}));

/* ----------------------------------------
   AttachInterfaceDrawer Component
   ---------------------------------------- */

export function AttachInterfaceDrawer({
  isOpen,
  onClose,
  instance,
  networks = mockNetworks,
  onAttach,
}: AttachInterfaceDrawerProps) {
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fixedIpMode, setFixedIpMode] = useState('auto-assign');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAttach = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedNetworkId) return;

    setIsSubmitting(true);
    try {
      await onAttach?.(selectedNetworkId, fixedIpMode);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedNetworkId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setFixedIpMode('auto-assign');
    setHasAttemptedSubmit(false);
    onClose();
  };

  const filteredNetworks = networks.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const networkColumns: TableColumn<NetworkItem>[] = [
    {
      key: 'id' as keyof NetworkItem,
      label: '',
      width: 40,
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="network-select"
            value={row.id}
            checked={selectedNetworkId === row.id}
            onChange={() => setSelectedNetworkId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status' as keyof NetworkItem,
      label: 'Status',
      width: 60,
      align: 'center' as const,
      render: () => <StatusIndicator status="active" layout="icon-only" size="sm" />,
    },
    {
      key: 'name',
      label: 'Name',
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
    {
      key: 'subnetCidr',
      label: 'Subnet CIDR',
    },
    {
      key: 'external' as keyof NetworkItem,
      label: 'External',
      render: (_value, row) => <span>{row.external ? 'Yes' : 'No'}</span>,
    },
    {
      key: 'shared' as keyof NetworkItem,
      label: 'Shared',
      render: (_value, row) => <span>{row.shared ? 'On' : 'Off'}</span>,
    },
    {
      key: 'inThisProject' as keyof NetworkItem,
      label: 'In this project',
      render: (_value, row) => <span>{row.inThisProject ? 'Yes' : 'No'}</span>,
    },
  ];

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
            onClick={handleAttach}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Attaching...' : 'Attach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Attach Interface
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Attach a new network interface to this instance. You can connect it to another network
              or subnet for additional access.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full px-4 py-3 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-body-sm text-[var(--color-text-subtle)] mb-1.5">Instance name</div>
            <div className="text-body-md text-[var(--color-text-default)]">{instance.name}</div>
          </div>
        </VStack>

        {/* Networks Section */}
        <VStack gap={3} className="flex-1 min-h-0 pb-5">
          {/* Networks Header */}
          <h3 className="text-label-lg text-[var(--color-text-default)]">Networks</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search network by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} align="center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              selectedCount={selectedNetworkId ? 1 : 0}
            />
          </HStack>

          <VStack gap={2}>
            <Table<NetworkItem>
              columns={networkColumns}
              data={filteredNetworks}
              rowKey="id"
              onRowClick={(row) => setSelectedNetworkId(row.id)}
              emptyMessage="No networks found"
            />
            <SelectionIndicator
              selectedItems={
                selectedNetworkId
                  ? [
                      {
                        id: selectedNetworkId,
                        label: networks.find((n) => n.id === selectedNetworkId)?.name || '',
                      },
                    ]
                  : []
              }
              onRemove={() => setSelectedNetworkId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedNetworkId}
              errorMessage="Please select a network"
            />
          </VStack>

          {/* Fixed IP Section */}
          <VStack gap={2} className="shrink-0 w-full">
            <FormField label="Subnet">
              <Select
                options={[
                  { value: 'subnet-1', label: '192.168.20.0/24 (subnet-1)' },
                  { value: 'subnet-2', label: '10.0.0.0/24 (subnet-2)' },
                ]}
                placeholder="Select subnet"
                fullWidth
              />
            </FormField>
            <FormField label="Fixed IP mode">
              <Select
                options={[
                  { value: 'auto-assign', label: 'Auto-assign' },
                  { value: 'manual', label: 'Manual' },
                ]}
                value={fixedIpMode}
                onChange={(value) => setFixedIpMode(value)}
                fullWidth
              />
            </FormField>
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default AttachInterfaceDrawer;
