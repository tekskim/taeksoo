import { useState, useEffect } from 'react';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  ListToolbar,
  ContextMenu,
  StatusIndicator,
  Badge,
  PageShell,
  PageHeader,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconDotsCircleHorizontal,
  IconTrash,
  IconDownload,
  IconBell,
  IconEdit,
  IconPlus,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ZoneStatus = 'active' | 'pending' | 'error';

interface DNSZone {
  id: string;
  name: string;
  type: 'Public' | 'Private';
  status: ZoneStatus;
  recordCount: number;
  ttl: number;
  serial: string;
  description: string;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockZones: DNSZone[] = [
  {
    id: 'zone-001',
    name: 'example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 24,
    ttl: 3600,
    serial: '2025111001',
    description: 'Production domain',
    createdAt: 'Nov 10, 2025',
  },
  {
    id: 'zone-002',
    name: 'staging.example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 12,
    ttl: 3600,
    serial: '2025110901',
    description: 'Staging environment',
    createdAt: 'Nov 9, 2025',
  },
  {
    id: 'zone-003',
    name: 'internal.local.',
    type: 'Private',
    status: 'active',
    recordCount: 45,
    ttl: 300,
    serial: '2025110801',
    description: 'Internal services',
    createdAt: 'Nov 8, 2025',
  },
  {
    id: 'zone-004',
    name: 'dev.example.com.',
    type: 'Public',
    status: 'pending',
    recordCount: 3,
    ttl: 3600,
    serial: '2025110701',
    description: 'Development environment',
    createdAt: 'Nov 7, 2025',
  },
  {
    id: 'zone-005',
    name: 'api.example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 8,
    ttl: 1800,
    serial: '2025110601',
    description: 'API gateway domain',
    createdAt: 'Nov 6, 2025',
  },
  {
    id: 'zone-006',
    name: 'db.internal.local.',
    type: 'Private',
    status: 'error',
    recordCount: 6,
    ttl: 60,
    serial: '2025110501',
    description: 'Database cluster DNS',
    createdAt: 'Nov 5, 2025',
  },
  {
    id: 'zone-007',
    name: 'cdn.example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 15,
    ttl: 86400,
    serial: '2025110401',
    description: 'CDN endpoint records',
    createdAt: 'Nov 4, 2025',
  },
  {
    id: 'zone-008',
    name: 'mail.example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 10,
    ttl: 3600,
    serial: '2025110301',
    description: 'Mail server records',
    createdAt: 'Nov 3, 2025',
  },
];

/* ----------------------------------------
   Status Config
   ---------------------------------------- */

const statusMap: Record<ZoneStatus, 'active' | 'building' | 'error'> = {
  active: 'active',
  pending: 'building',
  error: 'error',
};

/* ----------------------------------------
   DNS Zones Page
   ---------------------------------------- */

export function DNSZonesPage() {
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    updateActiveTabLabel('DNS Zones');
  }, [updateActiveTabLabel]);

  const sidebarWidth = sidebarOpen ? 200 : 0;
  const rowsPerPage = 10;
  const totalPages = Math.ceil(mockZones.length / rowsPerPage);
  const paginatedData = mockZones.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getContextMenuItems = (row: DNSZone): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit zone', onClick: () => console.log('Edit:', row.id) },
    { id: 'add-record', label: 'Add record', onClick: () => console.log('Add record:', row.id) },
    { id: 'export', label: 'Export zone file', onClick: () => console.log('Export:', row.id) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      divider: true,
      onClick: () => console.log('Delete:', row.id),
    },
  ];

  const columns: TableColumn<DNSZone>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={statusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Zone Name',
      flex: 2,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <Link
          to={`/compute/dns-zones/${row.id}`}
          className="text-label-md text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 truncate"
          onClick={(e) => e.stopPropagation()}
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: 80,
      render: (value: string) => (
        <Badge variant={value === 'Public' ? 'info' : 'muted'} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'recordCount',
      label: 'Records',
      flex: 1,
      minWidth: 80,
      sortable: true,
    },
    {
      key: 'ttl',
      label: 'TTL',
      flex: 1,
      minWidth: 80,
      render: (value: number) => `${value}s`,
    },
    {
      key: 'serial',
      label: 'Serial',
      flex: 1,
      minWidth: columnMinWidths.id,
    },
    {
      key: 'description',
      label: 'Description',
      flex: 2,
      minWidth: 120,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={openSidebar}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'Proj-1', href: '/compute' }, { label: 'DNS Zones' }]} />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="DNS Zones"
          actions={
            <Button size="md" leftIcon={<IconPlus size={14} stroke={1.5} />}>
              Create Zone
            </Button>
          }
        />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search zones by name"
                size="sm"
                className="w-[var(--search-input-width)]"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={<IconDownload size={12} stroke={1.5} />}
                aria-label="Export"
              />
            </ListToolbar.Actions>
          }
          bulkActions={
            <ListToolbar.Actions>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconEdit size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Edit TTL
              </Button>
              <Button
                variant="muted"
                size="sm"
                leftIcon={<IconTrash size={12} stroke={1.5} />}
                disabled={selectedRows.length === 0}
              >
                Delete
              </Button>
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={mockZones.length}
          selectedCount={selectedRows.length}
        />

        <Table<DNSZone>
          columns={columns}
          data={paginatedData}
          rowKey="id"
          selectable
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          emptyMessage="No DNS zones found"
        />
      </VStack>
    </PageShell>
  );
}

export default DNSZonesPage;
