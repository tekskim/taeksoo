import { useState } from 'react';
import {
  Drawer,
  Button,
  SearchInput,
  Pagination,
  StatusIndicator,
  Table,
  SelectionIndicator,
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
  portName: string;
  networkName: string;
  ipAddress: string;
  macAddress: string;
  status: 'active' | 'error' | 'building';
}

export interface SecurityGroupItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface InstanceInfo {
  id: string;
  name: string;
}

export interface ManageSecurityGroupsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instance: InstanceInfo;
  interfaces?: InterfaceItem[];
  securityGroups?: SecurityGroupItem[];
  onSave?: (interfaceId: string, securityGroupIds: string[]) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const defaultInterfaces: InterfaceItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `iface-${i + 1}`,
  portName: 'port-02',
  networkName: 'net-02',
  ipAddress: '192.168.10.1',
  macAddress: 'fa:16:3e:ab:cd:ef',
  status: 'active',
}));

const defaultSecurityGroups: SecurityGroupItem[] = Array.from({ length: 115 }, (_, i) => ({
  id: `sg-${i + 1}`,
  name: 'default-sg',
  description: '-',
  createdAt: 'Sep 5, 2025',
}));

const ITEMS_PER_PAGE = 5;

const interfaceColumns: TableColumn<InterfaceItem>[] = [
  {
    key: 'status',
    label: 'Status',
    width: '59px',
    align: 'center',
    render: (_value, row) => <StatusIndicator status={row.status} layout="icon-only" size="sm" />,
  },
  {
    key: 'portName',
    label: 'Name',
    sortable: true,
    render: (_value, row) => (
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.portName}
          </span>
          <IconExternalLink
            size={12}
            stroke={1.5}
            className="shrink-0 text-[var(--color-action-primary)]"
          />
        </div>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID : {row.id}</span>
      </div>
    ),
  },
  {
    key: 'networkName',
    label: 'Network',
    sortable: true,
    render: (_value, row) => (
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="text-label-md text-[var(--color-action-primary)] truncate">
            {row.networkName}
          </span>
          <IconExternalLink
            size={12}
            stroke={1.5}
            className="shrink-0 text-[var(--color-action-primary)]"
          />
        </div>
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID : {row.id}</span>
      </div>
    ),
  },
  { key: 'ipAddress', label: 'Fixed IP' },
  { key: 'macAddress', label: 'MAC address' },
];

const securityGroupColumns: TableColumn<SecurityGroupItem>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    render: (_value, row) => (
      <div className="flex flex-col gap-0.5 overflow-hidden">
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
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate">ID : {row.id}</span>
      </div>
    ),
  },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'createdAt', label: 'Created at', sortable: true },
];

/* ----------------------------------------
   ManageSecurityGroupsDrawer Component
   ---------------------------------------- */

export function ManageSecurityGroupsDrawer({
  isOpen,
  onClose,
  instance,
  interfaces = defaultInterfaces,
  securityGroups = defaultSecurityGroups,
  onSave,
}: ManageSecurityGroupsDrawerProps) {
  // Interface state
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string | null>(null);
  const [interfaceSearchQuery, setInterfaceSearchQuery] = useState('');
  const [interfacePage, setInterfacePage] = useState(1);

  // Security Groups state
  const [selectedSecurityGroupIds, setSelectedSecurityGroupIds] = useState<string[]>([]);
  const [sgSearchQuery, setSgSearchQuery] = useState('');
  const [sgPage, setSgPage] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Filter interfaces
  const filteredInterfaces = interfaces.filter(
    (iface) =>
      iface.portName.toLowerCase().includes(interfaceSearchQuery.toLowerCase()) ||
      iface.networkName.toLowerCase().includes(interfaceSearchQuery.toLowerCase()) ||
      iface.ipAddress.includes(interfaceSearchQuery)
  );

  const interfaceTotalPages = Math.ceil(filteredInterfaces.length / ITEMS_PER_PAGE);
  const paginatedInterfaces = filteredInterfaces.slice(
    (interfacePage - 1) * ITEMS_PER_PAGE,
    interfacePage * ITEMS_PER_PAGE
  );

  // Filter security groups
  const filteredSecurityGroups = securityGroups.filter(
    (sg) =>
      sg.name.toLowerCase().includes(sgSearchQuery.toLowerCase()) ||
      sg.description.toLowerCase().includes(sgSearchQuery.toLowerCase())
  );

  const sgTotalPages = Math.ceil(filteredSecurityGroups.length / ITEMS_PER_PAGE);
  const paginatedSecurityGroups = filteredSecurityGroups.slice(
    (sgPage - 1) * ITEMS_PER_PAGE,
    sgPage * ITEMS_PER_PAGE
  );

  const handleSave = async () => {
    setHasAttemptedSubmit(true);

    if (!selectedInterfaceId) return;

    setIsSubmitting(true);
    try {
      await onSave?.(selectedInterfaceId, selectedSecurityGroupIds);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedInterfaceId(null);
    setSelectedSecurityGroupIds([]);
    setInterfaceSearchQuery('');
    setSgSearchQuery('');
    setInterfacePage(1);
    setSgPage(1);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleSecurityGroupToggle = (sgId: string) => {
    setSelectedSecurityGroupIds((prev) =>
      prev.includes(sgId) ? prev.filter((id) => id !== sgId) : [...prev, sgId]
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage security groups"
      description="You can attach or detach security groups for the selected interface. These rules control inbound and outbound traffic for the instance."
      width={696}
      footer={
        <HStack gap={2} justify="center" className="w-full">
          <Button variant="secondary" onClick={handleClose} className="w-[152px] h-8">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-[152px] h-8"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full">
        <VStack gap={3}>
          {/* Instance Info Box */}
          <InfoBox label="Instance" value={instance.name} />
        </VStack>

        {/* Interfaces Section */}
        <VStack gap={3}>
          <VStack gap={1}>
            <h3 className="text-label-lg text-[var(--color-text-default)]">
              Interfaces<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </h3>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select the interface to apply security groups to.
            </span>
          </VStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={interfaceSearchQuery}
              onChange={(e) => setInterfaceSearchQuery(e.target.value)}
              onClear={() => setInterfaceSearchQuery('')}
              placeholder="Search interface by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={interfacePage}
            totalPages={interfaceTotalPages}
            totalItems={filteredInterfaces.length}
            onPageChange={setInterfacePage}
            selectedCount={selectedInterfaceId ? 1 : 0}
          />

          <VStack gap={2}>
            <div className="w-[648px] max-w-[648px]">
              <Table<InterfaceItem>
                columns={interfaceColumns}
                data={paginatedInterfaces}
                rowKey="id"
                selectable
                hideSelectAll
                selectedKeys={selectedInterfaceId ? [selectedInterfaceId] : []}
                onSelectionChange={(keys) =>
                  setSelectedInterfaceId(keys.length > 0 ? keys[keys.length - 1] : null)
                }
                onRowClick={(row) => setSelectedInterfaceId(row.id)}
                emptyMessage="No interfaces found"
              />
            </div>

            {/* Interface Selection Indicator */}
            <SelectionIndicator
              selectedItems={
                selectedInterfaceId
                  ? [
                      {
                        id: selectedInterfaceId,
                        label: interfaces.find((i) => i.id === selectedInterfaceId)?.portName || '',
                      },
                    ]
                  : []
              }
              onRemove={() => setSelectedInterfaceId(null)}
              emptyText="No item selected"
              error={hasAttemptedSubmit && !selectedInterfaceId}
              errorMessage="Please select an interface."
              className="shrink-0 w-[648px]"
            />
          </VStack>
        </VStack>

        {/* Security Groups Section */}
        <VStack gap={3} className="pb-5">
          <VStack gap={1}>
            <h3 className="text-label-lg text-[var(--color-text-default)]">
              Security groups<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </h3>
            <span className="text-body-md text-[var(--color-text-subtle)]">
              Select the security groups to apply to the chosen interface.
            </span>
          </VStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={sgSearchQuery}
              onChange={(e) => setSgSearchQuery(e.target.value)}
              onClear={() => setSgSearchQuery('')}
              placeholder="Search security group by attributes"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={sgPage}
            totalPages={sgTotalPages}
            totalItems={filteredSecurityGroups.length}
            onPageChange={setSgPage}
            selectedCount={selectedSecurityGroupIds.length}
          />

          <VStack gap={2}>
            <Table<SecurityGroupItem>
              columns={securityGroupColumns}
              data={paginatedSecurityGroups}
              rowKey="id"
              selectable
              selectedKeys={selectedSecurityGroupIds}
              onSelectionChange={(keys) => setSelectedSecurityGroupIds(keys as string[])}
              emptyMessage="No security groups found"
            />
            <SelectionIndicator
              selectedItems={selectedSecurityGroupIds.map((id) => ({
                id,
                label: securityGroups.find((sg) => sg.id === id)?.name || '',
              }))}
              onRemove={(id) =>
                setSelectedSecurityGroupIds((prev) => prev.filter((sgId) => sgId !== id))
              }
              emptyText="No item selected"
            />
          </VStack>
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageSecurityGroupsDrawer;
