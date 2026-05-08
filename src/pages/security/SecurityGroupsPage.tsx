import { useState } from 'react';
import {
  VStack,
  PageShell,
  PageHeader,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Pagination,
  SearchInput,
  Button,
  Badge,
  EmptyState,
  type TableColumn,
  columnMinWidths,
} from '@/design-system';
import { SecuritySidebar } from '@/components/SecuritySidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { IconPlus, IconDownload, IconRefresh, IconBuildingFortress } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  inboundRules: number;
  outboundRules: number;
  associatedInstances: number;
  createdAt: string;
}

const mockSecurityGroups: SecurityGroup[] = [
  {
    id: 'sg-001',
    name: 'default',
    description: 'Default security group',
    inboundRules: 3,
    outboundRules: 1,
    associatedInstances: 5,
    createdAt: '2026-01-10 08:00:00',
  },
  {
    id: 'sg-002',
    name: 'web-servers',
    description: 'Security group for web servers',
    inboundRules: 4,
    outboundRules: 2,
    associatedInstances: 3,
    createdAt: '2026-02-15 10:30:00',
  },
  {
    id: 'sg-003',
    name: 'db-servers',
    description: 'Security group for database servers',
    inboundRules: 2,
    outboundRules: 1,
    associatedInstances: 2,
    createdAt: '2026-02-20 14:00:00',
  },
  {
    id: 'sg-004',
    name: 'monitoring',
    description: 'Security group for monitoring services',
    inboundRules: 5,
    outboundRules: 3,
    associatedInstances: 1,
    createdAt: '2026-03-01 09:15:00',
  },
];

export function SecurityGroupsPage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = mockSecurityGroups.filter(
    (sg) =>
      sg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns: TableColumn<SecurityGroup>[] = [
    { key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.name, sortable: true },
    { key: 'description', label: 'Description', flex: 2, minWidth: 200 },
    {
      key: 'inboundRules',
      label: 'Inbound rules',
      flex: 1,
      minWidth: 100,
      align: 'right' as const,
    },
    {
      key: 'outboundRules',
      label: 'Outbound rules',
      flex: 1,
      minWidth: 100,
      align: 'right' as const,
    },
    {
      key: 'associatedInstances',
      label: 'Instances',
      flex: 1,
      minWidth: 100,
      align: 'right' as const,
      render: (_, row) => (
        <Badge theme="white" size="sm">
          {row.associatedInstances}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      align: 'right' as const,
    },
  ];

  return (
    <PageShell
      sidebar={<SecuritySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Security', href: '/security' }, { label: 'Security Groups' }]}
            />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Security Groups"
          actions={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
              Create Security Group
            </Button>
          }
        />

        <div className="flex items-center gap-1">
          <div className="w-[var(--search-input-width)]">
            <SearchInput
              placeholder="Search security groups by attributes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              size="sm"
              fullWidth
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<IconDownload size={12} stroke={1.5} />}
            aria-label="Download"
          />
          <Button
            variant="secondary"
            size="sm"
            icon={<IconRefresh size={12} stroke={1.5} />}
            aria-label="Refresh"
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          showSettings
        />

        {filteredData.length === 0 ? (
          <EmptyState
            icon={<IconBuildingFortress size={48} stroke={1} />}
            title="No security groups found"
            description="Create your first security group to manage instance access."
            action={
              <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
                Create Security Group
              </Button>
            }
          />
        ) : (
          <Table<SecurityGroup>
            columns={columns}
            data={paginatedData}
            rowKey="id"
            emptyMessage="No security groups found"
          />
        )}
      </VStack>
    </PageShell>
  );
}

export default SecurityGroupsPage;
