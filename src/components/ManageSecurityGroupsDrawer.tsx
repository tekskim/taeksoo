import { useState } from 'react';
import { 
  Drawer, 
  Button, 
  SearchInput, 
  Pagination, 
  StatusIndicator,
  Table,
  Radio,
  Checkbox,
  Chip,
  type TableColumn,
} from '@/design-system';
import { HStack, VStack } from '@/design-system/layouts';
import { IconExternalLink, IconX } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export interface InterfaceItem {
  id: string;
  status: 'active' | 'down' | 'error';
  network: string;
  networkId: string;
  portId: string;
  portIdShort: string;
  ipAddress: string;
  macAddress: string;
}

export interface SecurityGroupItem {
  id: string;
  name: string;
  sgId: string;
  description: string;
  createdAt: string;
}

export interface ManageSecurityGroupsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  interfaces?: InterfaceItem[];
  securityGroups?: SecurityGroupItem[];
  initialSelectedSecurityGroups?: string[];
  onSave?: (interfaceId: string, securityGroupIds: string[]) => void;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInterfaces: InterfaceItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `int-${i + 1}`,
  status: 'active',
  network: 'port-02',
  networkId: '17kfj123',
  portId: 'net-02',
  portIdShort: '17kfj123',
  ipAddress: '192.168.10.1',
  macAddress: 'fa:16:3e:ab:cd:ef',
}));

const mockSecurityGroups: SecurityGroupItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `sg-${i + 1}`,
  name: 'default-sg',
  sgId: '21stu345',
  description: '-',
  createdAt: '2025-09-05',
}));

/* ----------------------------------------
   ManageSecurityGroupsDrawer Component
   ---------------------------------------- */

export function ManageSecurityGroupsDrawer({
  isOpen,
  onClose,
  instanceName,
  interfaces = mockInterfaces,
  securityGroups = mockSecurityGroups,
  initialSelectedSecurityGroups = ['sg-1', 'sg-2'],
  onSave,
}: ManageSecurityGroupsDrawerProps) {
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string | null>(interfaces[0]?.id || null);
  const [selectedSecurityGroupIds, setSelectedSecurityGroupIds] = useState<string[]>(initialSelectedSecurityGroups);
  const [interfaceSearch, setInterfaceSearch] = useState('');
  const [securityGroupSearch, setSecurityGroupSearch] = useState('');
  const [interfacePage, setInterfacePage] = useState(1);
  const [securityGroupPage, setSecurityGroupPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = 115;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSave = async () => {
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
    setSelectedInterfaceId(interfaces[0]?.id || null);
    setSelectedSecurityGroupIds(initialSelectedSecurityGroups);
    setInterfaceSearch('');
    setSecurityGroupSearch('');
    setInterfacePage(1);
    setSecurityGroupPage(1);
    onClose();
  };

  const toggleSecurityGroup = (sgId: string) => {
    setSelectedSecurityGroupIds(prev => 
      prev.includes(sgId) 
        ? prev.filter(id => id !== sgId) 
        : [...prev, sgId]
    );
  };

  const removeSecurityGroup = (sgId: string) => {
    setSelectedSecurityGroupIds(prev => prev.filter(id => id !== sgId));
  };

  // Interface Table columns
  const interfaceColumns: TableColumn<InterfaceItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Radio
          name="interface-select"
          value={row.id}
          checked={selectedInterfaceId === row.id}
          onChange={() => setSelectedInterfaceId(row.id)}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '59px',
      align: 'center',
      render: () => (
        <StatusIndicator status="active" layout="icon-only" size="sm" />
      ),
    },
    {
      key: 'network',
      label: 'Network',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">{row.network}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: {row.networkId}</span>
        </VStack>
      ),
    },
    {
      key: 'portId',
      label: 'Port ID',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">{row.portId}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: {row.portIdShort}</span>
        </VStack>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'macAddress',
      label: 'Mac Address',
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
  ];

  // Security Group Table columns
  const securityGroupColumns: TableColumn<SecurityGroupItem>[] = [
    {
      key: 'select',
      label: '',
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Checkbox
          checked={selectedSecurityGroupIds.includes(row.id)}
          onChange={() => toggleSecurityGroup(row.id)}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, row) => (
        <VStack gap={0}>
          <HStack gap={1} align="center">
            <span className="text-[12px] font-medium text-[var(--color-action-primary)]">{row.name}</span>
            <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
          </HStack>
          <span className="text-[11px] text-[var(--color-text-muted)]">ID: {row.sgId}</span>
        </VStack>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value) => (
        <span className="text-[12px] text-[var(--color-text-default)]">{value}</span>
      ),
    },
  ];

  // Get selected security group names for tags
  const selectedSecurityGroupNames = securityGroups
    .filter(sg => selectedSecurityGroupIds.includes(sg.id))
    .map(sg => ({ id: sg.id, name: sg.name }));

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
            size="md"
            className="w-[152px]"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!selectedInterfaceId || isSubmitting}
            size="md"
            className="w-[152px]"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </HStack>
      }
    >
      <VStack gap={6} className="h-full overflow-y-auto">
        {/* Header Section */}
        <VStack gap={3}>
          <VStack gap={2}>
            <h2 className="text-[16px] font-semibold text-[var(--color-text-default)] leading-6">
              Manage Security Groups
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] leading-4">
              You can attach or detach security groups for the selected interface. These rules control inbound and outbound traffic for the instance.
            </p>
          </VStack>

          {/* Instance Info Box */}
          <div className="w-full p-4 bg-[var(--color-surface-subtle)] rounded-lg">
            <div className="text-[11px] text-[var(--color-text-muted)] mb-1">Instance</div>
            <div className="text-[12px] text-[var(--color-text-default)]">{instanceName}</div>
          </div>
        </VStack>

        {/* Interfaces Section */}
        <VStack gap={3}>
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Interfaces</h3>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={interfaceSearch}
              onChange={(e) => setInterfaceSearch(e.target.value)}
              onClear={() => setInterfaceSearch('')}
              placeholder="Find interface with filters"
              size="sm"
              fullWidth
            />
          </div>

          {/* Pagination */}
          <HStack gap={2} align="center">
            <Pagination
              currentPage={interfacePage}
              totalPages={totalPages}
              onPageChange={setInterfacePage}
              size="sm"
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-[11px] text-[var(--color-text-muted)]">{totalItems} items</span>
          </HStack>

          {/* Interface Table */}
          <Table<InterfaceItem>
            columns={interfaceColumns}
            data={interfaces}
            rowKey="id"
            selectedKeys={selectedInterfaceId ? [selectedInterfaceId] : []}
            onRowClick={(row) => setSelectedInterfaceId(row.id)}
            emptyMessage="No interfaces available"
          />
        </VStack>

        {/* Security Groups Section */}
        <VStack gap={3}>
          <h3 className="text-[14px] font-medium text-[var(--color-text-default)]">Security Groups</h3>

          {/* Pagination */}
          <HStack gap={2} align="center">
            <Pagination
              currentPage={securityGroupPage}
              totalPages={totalPages}
              onPageChange={setSecurityGroupPage}
              size="sm"
            />
            <div className="w-px h-4 bg-[var(--color-border-default)] mx-2" />
            <span className="text-[11px] text-[var(--color-text-muted)]">{totalItems} items</span>
          </HStack>

          {/* Search */}
          <div className="w-[280px]">
            <SearchInput
              value={securityGroupSearch}
              onChange={(e) => setSecurityGroupSearch(e.target.value)}
              onClear={() => setSecurityGroupSearch('')}
              placeholder="Find security group with filters"
              size="sm"
              fullWidth
            />
          </div>

          {/* Security Group Table */}
          <Table<SecurityGroupItem>
            columns={securityGroupColumns}
            data={securityGroups}
            rowKey="id"
            selectedKeys={selectedSecurityGroupIds}
            onRowClick={(row) => toggleSecurityGroup(row.id)}
            emptyMessage="No security groups available"
          />

          {/* Selected Security Groups Tags */}
          {selectedSecurityGroupNames.length > 0 && (
            <HStack gap={2} className="flex-wrap">
              {selectedSecurityGroupNames.map(sg => (
                <div 
                  key={sg.id}
                  className="flex items-center gap-1.5 px-2 py-1 bg-[var(--color-action-primary)] text-white rounded text-[11px] font-medium"
                >
                  <span>{sg.name}</span>
                  <button 
                    onClick={() => removeSecurityGroup(sg.id)}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <IconX size={12} />
                  </button>
                </div>
              ))}
            </HStack>
          )}
        </VStack>
      </VStack>
    </Drawer>
  );
}

export default ManageSecurityGroupsDrawer;


