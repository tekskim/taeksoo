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
  InlineMessage,
  InfoBox,
} from '@/design-system';
import type { TableColumn } from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InterfaceItem {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface DetachInterfaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  interfaces?: InterfaceItem[];
  onDetach?: (interfaceId: string) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInterfaces: InterfaceItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `iface-${i + 1}`,
  name: 'net-02',
  status: 'active',
  fixedIp: '192.168.10.1',
  floatingIp: '192.168.10.1',
  macAddress: 'fa:16:3e:ab:cd:ef',
}));

/* ----------------------------------------
   DetachInterfaceDrawer Component
   ---------------------------------------- */

export function DetachInterfaceDrawer({
  isOpen,
  onClose,
  instance,
  interfaces = mockInterfaces,
  onDetach,
}: DetachInterfaceDrawerProps) {
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleDetach = async () => {
    setHasAttemptedSubmit(true);
    if (!selectedInterfaceId) return;

    setIsSubmitting(true);
    try {
      await onDetach?.(selectedInterfaceId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedInterfaceId(null);
    setSearchQuery('');
    setCurrentPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const filteredInterfaces = interfaces.filter(
    (iface) =>
      iface.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iface.fixedIp.includes(searchQuery) ||
      iface.macAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedInterfaces = filteredInterfaces.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const interfaceColumns: TableColumn<InterfaceItem>[] = [
    {
      key: 'id' as keyof InterfaceItem,
      label: '',
      width: 40,
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Radio
            name="interface-select"
            value={row.id}
            checked={selectedInterfaceId === row.id}
            onChange={() => setSelectedInterfaceId(row.id)}
          />
        </div>
      ),
    },
    {
      key: 'status' as keyof InterfaceItem,
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
      key: 'fixedIp',
      label: 'Fixed IP',
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
    },
    {
      key: 'macAddress',
      label: 'MAC address',
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
            onClick={handleDetach}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Detaching...' : 'Detach'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={3} className="h-full">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-heading-h5 text-[var(--color-text-default)] leading-6">
              Detach Interface
            </h2>
            <p className="text-body-md text-[var(--color-text-subtle)]">
              Detach a network interface from this instance. This may interrupt connectivity if the
              selected port is primary.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <InfoBox label="Instance" value={instance.name} />

          {/* Warning Message */}
          <InlineMessage variant="error">
            For data consistency, stop all write operations on the instance before detaching a
            interface.
          </InlineMessage>
        </VStack>

        {/* Interfaces Section */}
        <VStack gap={3} className="flex-1 min-h-0 pb-5">
          {/* Interfaces Header */}
          <h3 className="text-label-lg text-[var(--color-text-default)]">Interfaces</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search interface by attributes"
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
              selectedCount={selectedInterfaceId ? 1 : 0}
            />
          </HStack>

          <VStack gap={2}>
            <Table<InterfaceItem>
              columns={interfaceColumns}
              data={paginatedInterfaces}
              rowKey="id"
              onRowClick={(row) => setSelectedInterfaceId(row.id)}
              emptyMessage="No interfaces found"
            />
            <SelectionIndicator
              selectedItems={
                selectedInterfaceId
                  ? [
                      {
                        id: selectedInterfaceId,
                        label: interfaces.find((i) => i.id === selectedInterfaceId)?.name || '',
                      },
                    ]
                  : []
              }
              onRemove={() => setSelectedInterfaceId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedInterfaceId}
              errorMessage="Please select an interface"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default DetachInterfaceDrawer;
