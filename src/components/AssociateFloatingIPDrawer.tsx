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
import { IconExternalLink, IconAlertCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface FixedIPItem {
  id: string;
  fixedIp: string;
  ownedSubnet: string;
  ownedSubnetId: string;
  hasAlert?: boolean;
}

export interface FloatingIPItem {
  id: string;
  status: 'active' | 'error' | 'building' | 'muted';
  floatingIp: string;
  network: string;
  networkId: string;
  description: string;
  hasAlert?: boolean;
}

export interface PortInfo {
  id: string;
  name: string;
}

export interface AssociateFloatingIPDrawerProps {
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

const mockFixedIPs: FixedIPItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `fip-${i + 1}`,
  fixedIp: `10.0.0.${5 + (i % 250)}`,
  ownedSubnet: 'subnet',
  ownedSubnetId: `${12345678 + i}`,
  hasAlert: i === 4,
}));

const mockFloatingIPs: FloatingIPItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `flp-${i + 1}`,
  status: i === 0 ? 'error' : i === 2 ? 'muted' : ('active' as const),
  floatingIp: `203.0.140.${25 + (i % 230)}`,
  network: 'net-02',
  networkId: `${174703 + i}`,
  description: '-',
  hasAlert: i === 0,
}));

const ITEMS_PER_PAGE = 5;

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function AssociateFloatingIPDrawer({
  isOpen,
  onClose,
  port,
  fixedIPs = mockFixedIPs,
  floatingIPs = mockFloatingIPs,
  onSubmit,
}: AssociateFloatingIPDrawerProps) {
  const [selectedFixedIPId, setSelectedFixedIPId] = useState<string | null>(null);
  const [selectedFloatingIPId, setSelectedFloatingIPId] = useState<string | null>(null);

  const [fixedIPSearch, setFixedIPSearch] = useState('');
  const [floatingIPSearch, setFloatingIPSearch] = useState('');

  const [fixedIPPage, setFixedIPPage] = useState(1);
  const [floatingIPPage, setFloatingIPPage] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedFixedIPId(null);
      setSelectedFloatingIPId(null);
      setFixedIPSearch('');
      setFloatingIPSearch('');
      setFixedIPPage(1);
      setFloatingIPPage(1);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  const filteredFixedIPs = fixedIPs.filter(
    (fip) =>
      fip.fixedIp.toLowerCase().includes(fixedIPSearch.toLowerCase()) ||
      fip.ownedSubnet.toLowerCase().includes(fixedIPSearch.toLowerCase())
  );

  const filteredFloatingIPs = floatingIPs.filter(
    (flp) =>
      flp.floatingIp.toLowerCase().includes(floatingIPSearch.toLowerCase()) ||
      flp.network.toLowerCase().includes(floatingIPSearch.toLowerCase())
  );

  const fixedIPTotalPages = Math.ceil(filteredFixedIPs.length / ITEMS_PER_PAGE);
  const paginatedFixedIPs = filteredFixedIPs.slice(
    (fixedIPPage - 1) * ITEMS_PER_PAGE,
    fixedIPPage * ITEMS_PER_PAGE
  );

  const floatingIPTotalPages = Math.ceil(filteredFloatingIPs.length / ITEMS_PER_PAGE);
  const paginatedFloatingIPs = filteredFloatingIPs.slice(
    (floatingIPPage - 1) * ITEMS_PER_PAGE,
    floatingIPPage * ITEMS_PER_PAGE
  );

  const selectedFixedIP = fixedIPs.find((f) => f.id === selectedFixedIPId);
  const selectedFloatingIP = floatingIPs.find((f) => f.id === selectedFloatingIPId);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedFixedIPId || !selectedFloatingIPId) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({ fixedIpId: selectedFixedIPId, floatingIpId: selectedFloatingIPId });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFixedIPId(null);
    setSelectedFloatingIPId(null);
    setFixedIPSearch('');
    setFloatingIPSearch('');
    setFixedIPPage(1);
    setFloatingIPPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const fixedIPColumns: TableColumn<FixedIPItem>[] = [
    {
      key: 'id' as keyof FixedIPItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="fixedip-select"
            value={row.id}
            checked={selectedFixedIPId === row.id}
            onChange={() => setSelectedFixedIPId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <HStack gap={1.5} align="center">
          <span className="text-body-md text-[var(--color-text-default)]">{row.fixedIp}</span>
          {row.hasAlert && (
            <IconAlertCircle size={14} className="text-[var(--color-state-danger)]" />
          )}
        </HStack>
      ),
    },
    {
      key: 'ownedSubnet',
      label: 'Owned Subnet',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <HStack gap={1.5} align="center">
            <span className="text-label-md text-[var(--color-action-primary)]">
              {row.ownedSubnet}
            </span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            ID : {row.ownedSubnetId}
          </span>
        </div>
      ),
    },
  ];

  const floatingIPColumns: TableColumn<FloatingIPItem>[] = [
    {
      key: 'id' as keyof FloatingIPItem,
      label: '',
      width: '40px',
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="floatingip-select"
            value={row.id}
            checked={selectedFloatingIPId === row.id}
            onChange={() => setSelectedFloatingIPId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '60px',
      align: 'center',
      render: (_value, row) => <StatusIndicator layout="icon-only" status={row.status} />,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <HStack gap={1.5} align="center">
            <span className="text-body-md text-[var(--color-text-default)]">{row.floatingIp}</span>
            {row.hasAlert && (
              <IconAlertCircle size={14} className="text-[var(--color-state-danger)]" />
            )}
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      ),
    },
    {
      key: 'network',
      label: 'Network',
      flex: 1,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <HStack gap={1.5} align="center">
            <span className="text-label-md text-[var(--color-action-primary)]">{row.network}</span>
            <IconExternalLink
              size={12}
              stroke={1.5}
              className="text-[var(--color-action-primary)]"
            />
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">ID : {row.networkId}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      render: (value) => <>{value || '-'}</>,
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Associate floating IP"
      description="Associate a floating IP with this port to enable external network access."
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
            {isSubmitting ? 'Associating...' : 'Associate'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        <InfoBox label="Port" value={port.name} />

        {/* Fixed IP Section */}
        <VStack gap={3} className="w-full">
          <VStack gap={1}>
            <h3 className="text-label-lg text-[var(--color-text-default)] leading-5">
              Fixed IP<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </h3>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Choose the fixed IP of the port to associate with the floating IP.
            </span>
          </VStack>

          <div className="w-[280px]">
            <SearchInput
              placeholder="Search fixed IPs by attributes"
              value={fixedIPSearch}
              onChange={(e) => setFixedIPSearch(e.target.value)}
              onClear={() => setFixedIPSearch('')}
              size="sm"
              fullWidth
            />
          </div>

          <Pagination
            currentPage={fixedIPPage}
            totalPages={fixedIPTotalPages}
            totalItems={filteredFixedIPs.length}
            onPageChange={setFixedIPPage}
            selectedCount={selectedFixedIPId ? 1 : 0}
          />

          <VStack gap={2} className="w-full">
            <Table<FixedIPItem>
              columns={fixedIPColumns}
              data={paginatedFixedIPs}
              rowKey="id"
              onRowClick={(row) => setSelectedFixedIPId(row.id)}
              emptyMessage="No fixed IPs found"
            />
            <SelectionIndicator
              selectedItems={
                selectedFixedIP ? [{ id: selectedFixedIP.id, label: selectedFixedIP.fixedIp }] : []
              }
              onRemove={() => setSelectedFixedIPId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedFixedIPId}
              errorMessage="Please select a fixed IP."
              className="shrink-0 w-full"
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
              Choose a floating IP to associate with the selected fixed IP.
            </span>
          </VStack>

          <div className="w-[280px]">
            <SearchInput
              placeholder="Search floating IPs by attributes"
              value={floatingIPSearch}
              onChange={(e) => setFloatingIPSearch(e.target.value)}
              onClear={() => setFloatingIPSearch('')}
              size="sm"
              fullWidth
            />
          </div>

          <Pagination
            currentPage={floatingIPPage}
            totalPages={floatingIPTotalPages}
            totalItems={filteredFloatingIPs.length}
            onPageChange={setFloatingIPPage}
            selectedCount={selectedFloatingIPId ? 1 : 0}
          />

          <VStack gap={2} className="w-full">
            <Table<FloatingIPItem>
              columns={floatingIPColumns}
              data={paginatedFloatingIPs}
              rowKey="id"
              onRowClick={(row) => setSelectedFloatingIPId(row.id)}
              emptyMessage="No floating IPs found"
            />
            <SelectionIndicator
              selectedItems={
                selectedFloatingIP
                  ? [{ id: selectedFloatingIP.id, label: selectedFloatingIP.floatingIp }]
                  : []
              }
              onRemove={() => setSelectedFloatingIPId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedFloatingIPId}
              errorMessage="Please select a floating IP."
              className="shrink-0 w-full"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}
