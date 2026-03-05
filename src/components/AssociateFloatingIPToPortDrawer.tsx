import { useState, useEffect } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  Radio,
  StatusIndicator,
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

export interface FixedIPItem {
  id: string;
  fixedIp: string;
  macAddress: string;
  network: string;
  networkId: string;
  subnetCidr: string;
}

export interface FloatingIPItem {
  id: string;
  floatingIp: string;
  status: 'active' | 'error' | 'building' | 'shutoff';
  networkName: string;
  networkId: string;
  description: string;
}

export interface PortInfo {
  name: string;
}

export interface AssociateFloatingIPToPortDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  port: PortInfo;
  fixedIPs?: FixedIPItem[];
  floatingIPs?: FloatingIPItem[];
  onSubmit?: (data: { fixedIpId: string; floatingIpId: string }) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFixedIPs: FixedIPItem[] = [
  {
    id: 'fip-1',
    fixedIp: '10.0.0.5',
    macAddress: '10.0.01',
    network: 'net-02',
    networkId: '17kfj123',
    subnetCidr: '192.168.10.0/24',
  },
  {
    id: 'fip-2',
    fixedIp: '10.0.0.5',
    macAddress: '10.0.01',
    network: 'net-02',
    networkId: '17kfj123',
    subnetCidr: '192.168.10.0/24',
  },
  {
    id: 'fip-3',
    fixedIp: '10.0.0.5',
    macAddress: '10.0.01',
    network: 'net-02',
    networkId: '17kfj123',
    subnetCidr: '192.168.10.0/24',
  },
  {
    id: 'fip-4',
    fixedIp: '10.0.0.5',
    macAddress: '10.0.01',
    network: 'net-02',
    networkId: '17kfj123',
    subnetCidr: '192.168.10.0/24',
  },
  {
    id: 'fip-5',
    fixedIp: '10.0.0.5',
    macAddress: '10.0.01',
    network: 'net-02',
    networkId: '17kfj123',
    subnetCidr: '192.168.10.0/24',
  },
];

const mockFloatingIPs: FloatingIPItem[] = [
  {
    id: 'flp-1',
    floatingIp: '203.0.140.25',
    status: 'active',
    networkName: 'net-02',
    networkId: '17kfj123',
    description: '-',
  },
  {
    id: 'flp-2',
    floatingIp: '203.0.140.25',
    status: 'active',
    networkName: 'net-02',
    networkId: '17kfj123',
    description: '-',
  },
  {
    id: 'flp-3',
    floatingIp: '203.0.140.25',
    status: 'active',
    networkName: 'net-02',
    networkId: '17kfj123',
    description: '-',
  },
  {
    id: 'flp-4',
    floatingIp: '203.0.140.25',
    status: 'active',
    networkName: 'net-02',
    networkId: '17kfj123',
    description: '-',
  },
  {
    id: 'flp-5',
    floatingIp: '203.0.140.25',
    status: 'active',
    networkName: 'net-02',
    networkId: '17kfj123',
    description: '-',
  },
  {
    id: 'flp-6',
    floatingIp: '203.0.140.25',
    status: 'active',
    networkName: 'net-02',
    networkId: '17kfj123',
    description: '-',
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function AssociateFloatingIPToPortDrawer({
  isOpen,
  onClose,
  port,
  fixedIPs = mockFixedIPs,
  floatingIPs = mockFloatingIPs,
  onSubmit,
}: AssociateFloatingIPToPortDrawerProps) {
  // Fixed IP state
  const [selectedFixedIpId, setSelectedFixedIpId] = useState<string | null>(null);
  const [fixedIpSearchQuery, setFixedIpSearchQuery] = useState('');
  const [fixedIpCurrentPage, setFixedIpCurrentPage] = useState(1);

  // Floating IP state
  const [selectedFloatingIpId, setSelectedFloatingIpId] = useState<string | null>(null);
  const [floatingIpSearchQuery, setFloatingIpSearchQuery] = useState('');
  const [floatingIpCurrentPage, setFloatingIpCurrentPage] = useState(1);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    if (!isOpen) {
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  // Reset state function
  const resetState = () => {
    setSelectedFixedIpId(null);
    setSelectedFloatingIpId(null);
    setFixedIpSearchQuery('');
    setFloatingIpSearchQuery('');
    setFixedIpCurrentPage(1);
    setFloatingIpCurrentPage(1);
  };

  // Handle close with reset
  const handleClose = () => {
    resetState();
    onClose();
  };

  // Fixed IP filtering
  const filteredFixedIPs = fixedIPs.filter(
    (item) =>
      item.fixedIp.toLowerCase().includes(fixedIpSearchQuery.toLowerCase()) ||
      item.macAddress.toLowerCase().includes(fixedIpSearchQuery.toLowerCase()) ||
      item.subnetCidr.toLowerCase().includes(fixedIpSearchQuery.toLowerCase())
  );

  const paginatedFixedIPs = filteredFixedIPs.slice(
    (fixedIpCurrentPage - 1) * itemsPerPage,
    fixedIpCurrentPage * itemsPerPage
  );

  const fixedIpTotalPages = Math.ceil(filteredFixedIPs.length / itemsPerPage);

  // Floating IP filtering
  const filteredFloatingIPs = floatingIPs.filter(
    (item) =>
      item.floatingIp.toLowerCase().includes(floatingIpSearchQuery.toLowerCase()) ||
      item.networkName.toLowerCase().includes(floatingIpSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(floatingIpSearchQuery.toLowerCase())
  );

  const paginatedFloatingIPs = filteredFloatingIPs.slice(
    (floatingIpCurrentPage - 1) * itemsPerPage,
    floatingIpCurrentPage * itemsPerPage
  );

  const floatingIpTotalPages = Math.ceil(filteredFloatingIPs.length / itemsPerPage);

  // Selected items
  const selectedFixedIp = fixedIPs.find((item) => item.id === selectedFixedIpId);
  const selectedFloatingIp = floatingIPs.find((item) => item.id === selectedFloatingIpId);

  // Column definitions
  const fixedIpColumns: TableColumn<FixedIPItem>[] = [
    {
      key: 'id' as keyof FixedIPItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="fixed-ip-select"
            value={row.id}
            checked={selectedFixedIpId === row.id}
            onChange={() => setSelectedFixedIpId(row.id)}
          />
        </div>
      ),
    },
    { key: 'fixedIp', label: 'Fixed IP', flex: 1, sortable: true },
    { key: 'macAddress', label: 'MAC address', flex: 1 },
    {
      key: 'network',
      label: 'Network',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)]">{row.network}</span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.networkId}</span>
        </div>
      ),
    },
    { key: 'subnetCidr', label: 'Subnet CIDR', flex: 1 },
  ];

  const floatingIpColumns: TableColumn<FloatingIPItem>[] = [
    {
      key: 'id' as keyof FloatingIPItem,
      label: '',
      width: '40px',
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
      width: '60px',
      align: 'center',
      render: (_value, row) => <StatusIndicator status={row.status} />,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)]">
              {row.floatingIp}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'networkName',
      label: 'Network',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-[var(--color-action-primary)]">
              {row.networkName}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
          </div>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.networkId}</span>
        </div>
      ),
    },
    { key: 'description', label: 'Description', flex: 1, sortable: true },
  ];

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);

    if (!selectedFixedIpId || !selectedFloatingIpId) {
      return;
    }

    if (onSubmit) {
      onSubmit({ fixedIpId: selectedFixedIpId, floatingIpId: selectedFloatingIpId });
    }
    handleClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Associate floating IP"
      description="Assign a floating IP to this instance for external network access."
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px]">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="w-[152px]">
            Associate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        {/* Port Info */}
        <InfoBox label="Instance" value={port.name} />

        {/* Fixed IP Section */}
        <VStack gap={3} className="w-full">
          <VStack gap={1}>
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
              Fixed IP<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </h3>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select the Fixed IP of the instance to associate with a Floating IP.
            </span>
          </VStack>

          <div className="w-[280px]">
            <SearchInput
              placeholder="Search fixed IP by attributes"
              value={fixedIpSearchQuery}
              onChange={(e) => {
                setFixedIpSearchQuery(e.target.value);
                setFixedIpCurrentPage(1);
              }}
            />
          </div>

          <Pagination
            currentPage={fixedIpCurrentPage}
            totalPages={fixedIpTotalPages}
            totalItems={filteredFixedIPs.length}
            onPageChange={setFixedIpCurrentPage}
            selectedCount={selectedFixedIpId ? 1 : 0}
          />

          <VStack gap={2}>
            <Table<FixedIPItem>
              columns={fixedIpColumns}
              data={paginatedFixedIPs}
              rowKey="id"
              onRowClick={(row) => setSelectedFixedIpId(row.id)}
              emptyMessage="No fixed IPs found"
            />

            <SelectionIndicator
              selectedItems={
                selectedFixedIp ? [{ id: selectedFixedIp.id, label: selectedFixedIp.fixedIp }] : []
              }
              onRemove={() => setSelectedFixedIpId(null)}
              emptyText="No item selected"
            />
          </VStack>
        </VStack>

        {/* Floating IP Section */}
        <VStack gap={3} className="w-full pb-5">
          <VStack gap={1}>
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
              Floating IP<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </h3>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select the Floating IP to associate with the chosen Fixed IP.
            </span>
          </VStack>

          <div className="w-[280px]">
            <SearchInput
              placeholder="Search floating IP by attributes"
              value={floatingIpSearchQuery}
              onChange={(e) => {
                setFloatingIpSearchQuery(e.target.value);
                setFloatingIpCurrentPage(1);
              }}
            />
          </div>

          <Pagination
            currentPage={floatingIpCurrentPage}
            totalPages={floatingIpTotalPages}
            totalItems={filteredFloatingIPs.length}
            onPageChange={setFloatingIpCurrentPage}
            selectedCount={selectedFloatingIpId ? 1 : 0}
          />

          <VStack gap={2}>
            <Table<FloatingIPItem>
              columns={floatingIpColumns}
              data={paginatedFloatingIPs}
              rowKey="id"
              onRowClick={(row) => setSelectedFloatingIpId(row.id)}
              emptyMessage="No floating IPs found"
            />

            <SelectionIndicator
              selectedItems={
                selectedFloatingIp
                  ? [{ id: selectedFloatingIp.id, label: selectedFloatingIp.floatingIp }]
                  : []
              }
              onRemove={() => setSelectedFloatingIpId(null)}
              emptyText="No item selected"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}
