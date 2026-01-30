import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
  SearchInput,
  Pagination,
  StatusIndicator,
  SectionCard,
  DetailHeader,
  Tooltip,
  type TableColumn,
  fixedColumns,
} from '@/design-system';
import { ComputeAdminSidebar } from '@/components/ComputeAdminSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconTrash,
  IconBell,
  IconDownload,
  IconRouter,
  IconCube,
  IconServer,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface FirewallDetail {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'down' | 'error';
  tenant: string;
  tenantId: string;
  adminState: 'Up' | 'Down';
  ingressPolicy: string;
  ingressPolicyId: string;
  egressPolicy: string;
  egressPolicyId: string;
  createdAt: string;
}

interface Port {
  id: string;
  name: string;
  status: 'active' | 'down' | 'build';
  attachedToType: string;
  attachedToName: string;
  attachedToId: string;
  network: string;
  networkId: string;
  fixedIp: string;
  floatingIp: string;
  macAddress: string;
  adminState: 'Up' | 'Down';
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockFirewallsMap: Record<string, FirewallDetail> = {
  'fw-001': {
    id: '7284d9174e81431e93060a9bbcf2cdfd',
    name: 'firewall-1',
    description: 'Main firewall for web servers',
    status: 'active',
    tenant: 'tenantA',
    tenantId: 'tenant-001',
    adminState: 'Up',
    ingressPolicy: 'ingress-policy-1',
    ingressPolicyId: 'fwp-001',
    egressPolicy: 'egress-policy-1',
    egressPolicyId: 'fwp-002',
    createdAt: '25 Dec, 2025',
  },
  'fw-002': {
    id: '8394e0285f92542f04171b0ccd3deff0',
    name: 'firewall-2',
    description: 'Database firewall',
    status: 'active',
    tenant: 'tenantB',
    tenantId: 'tenant-002',
    adminState: 'Up',
    ingressPolicy: 'db-ingress-policy',
    ingressPolicyId: 'fwp-003',
    egressPolicy: 'db-egress-policy',
    egressPolicyId: 'fwp-004',
    createdAt: '20 Dec, 2025',
  },
};

const defaultFirewallDetail: FirewallDetail = {
  id: 'unknown',
  name: 'Unknown Firewall',
  description: '-',
  status: 'down',
  tenant: '-',
  tenantId: '',
  adminState: 'Down',
  ingressPolicy: '-',
  ingressPolicyId: '',
  egressPolicy: '-',
  egressPolicyId: '',
  createdAt: '-',
};

const mockPorts: Port[] = Array.from({ length: 115 }, (_, i) => ({
  id: `port-${String(i + 1).padStart(3, '0')}`,
  name: `port`,
  status: ['active', 'active', 'active', 'down', 'build'][i % 5] as 'active' | 'down' | 'build',
  attachedToType: ['Router(Interface)', 'Instance', 'Load Balancer'][i % 3],
  attachedToName: ['router', 'instance-1', 'lb-1'][i % 3],
  attachedToId: `${['router', 'instance', 'lb'][i % 3]}-${String(i + 1).padStart(3, '0')}`,
  network: `network`,
  networkId: `net-${String((i % 5) + 1).padStart(3, '0')}`,
  fixedIp: `10.70.0.${48 + i}`,
  floatingIp: i % 3 === 0 ? `203.0.113.${i}` : '-',
  macAddress: `fa:16:3e:77:62:${String(19 + i).padStart(2, '0')}`,
  adminState: i % 4 === 0 ? 'Down' : 'Up',
}));

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function ComputeAdminFirewallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Ports state
  const [portSearchTerm, setPortSearchTerm] = useState('');
  const [portCurrentPage, setPortCurrentPage] = useState(1);
  const portsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Get firewall data based on URL ID
  const firewall = id ? mockFirewallsMap[id] || defaultFirewallDetail : defaultFirewallDetail;

  // Update tab label to firewall name
  useEffect(() => {
    if (firewall.name) {
      updateActiveTabLabel(firewall.name);
    }
  }, [firewall.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));
  // Status mapping
  const statusMap: Record<string, 'active' | 'down' | 'error' | 'building'> = {
    active: 'active',
    down: 'down',
    error: 'error',
    build: 'building',
  };

  // Filter ports based on search
  const filteredPorts = useMemo(() => {
    if (!portSearchTerm) return mockPorts;
    const query = portSearchTerm.toLowerCase();
    return mockPorts.filter(
      (port) =>
        port.name.toLowerCase().includes(query) ||
        port.network.toLowerCase().includes(query) ||
        port.fixedIp.toLowerCase().includes(query)
    );
  }, [portSearchTerm]);

  // Paginated ports
  const paginatedPorts = useMemo(() => {
    const start = (portCurrentPage - 1) * portsPerPage;
    return filteredPorts.slice(start, start + portsPerPage);
  }, [filteredPorts, portCurrentPage, portsPerPage]);

  // Port columns
  const portColumns: TableColumn<Port>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator status={statusMap[row.status]} layout="icon-only" />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/ports/${row.id}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.name}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: 'attachedTo',
      label: 'Attached To',
      flex: 1,
      render: (_, row) => (
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-0.5 min-w-0">
            <Link
              to={`/compute-admin/routers/${row.attachedToId}`}
              className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.attachedToName}
            </Link>
            <span className="text-body-sm text-[var(--color-text-muted)]">
              ID: {row.attachedToId}
            </span>
          </div>
          <Tooltip
            content={
              row.attachedToType === 'Router(Interface)'
                ? 'Router'
                : row.attachedToType === 'Instance'
                  ? 'Instance'
                  : 'Load Balancer'
            }
            position="top"
            delay={0}
          >
            <div className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-1">
              {row.attachedToType === 'Router(Interface)' ? (
                <IconRouter size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
              ) : row.attachedToType === 'Instance' ? (
                <IconCube size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
              ) : (
                <IconServer size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
              )}
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      key: 'network',
      label: 'Owned Network',
      flex: 1,
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/compute-admin/networks/${row.networkId}`}
            className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.network}
          </Link>
          <span className="text-body-sm text-[var(--color-text-muted)]">ID: {row.networkId}</span>
        </div>
      ),
    },
    {
      key: 'fixedIp',
      label: 'Fixed IP',
      flex: 1,
    },
    {
      key: 'floatingIp',
      label: 'Floating IP',
      flex: 1,
    },
    {
      key: 'macAddress',
      label: 'MAC Address',
      flex: 1,
    },
    {
      key: 'adminState',
      label: 'Admin State',
      flex: 1,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ComputeAdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Compute Admin', href: '/compute-admin' },
                  { label: 'Firewalls', href: '/compute-admin/firewall' },
                  { label: firewall.name },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
                badge={true}
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)]">
            <VStack gap={8} className="min-w-[1176px]">
              {/* Header Card */}
              <DetailHeader>
                <DetailHeader.Title>{firewall.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                    Delete
                  </Button>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={firewall.status.charAt(0).toUpperCase() + firewall.status.slice(1)}
                    status={statusMap[firewall.status]}
                  />
                  <DetailHeader.InfoCard label="ID" value={firewall.id} copyable />
                  <DetailHeader.InfoCard label="Tenant" value={firewall.tenant} />
                  <DetailHeader.InfoCard label="Admin State" value={firewall.adminState} />
                  <DetailHeader.InfoCard label="Created At" value={firewall.createdAt} />
                </DetailHeader.InfoGrid>
              </DetailHeader>

              {/* Tabs Section */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab}>
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="ports">Ports</Tab>
                  </TabList>

                  {/* Details Tab */}
                  <TabPanel value="details" className="pt-6">
                    <SectionCard>
                      <SectionCard.Header title="Basic Information" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Firewall Name" value={firewall.name} />
                        <SectionCard.DataRow
                          label="Description"
                          value={firewall.description || '-'}
                        />
                        <SectionCard.DataRow label="Admin State" value={firewall.adminState} />
                        <SectionCard.DataRow
                          label="Ingress Policy"
                          value={
                            firewall.ingressPolicyId ? (
                              <Link
                                to={`/compute-admin/firewall-policies/${firewall.ingressPolicyId}`}
                                className="font-medium text-[var(--color-action-primary)] hover:underline"
                              >
                                {firewall.ingressPolicy}
                              </Link>
                            ) : (
                              '-'
                            )
                          }
                        />
                        <SectionCard.DataRow
                          label="Egress Policy"
                          value={
                            firewall.egressPolicyId ? (
                              <Link
                                to={`/compute-admin/firewall-policies/${firewall.egressPolicyId}`}
                                className="font-medium text-[var(--color-action-primary)] hover:underline"
                              >
                                {firewall.egressPolicy}
                              </Link>
                            ) : (
                              '-'
                            )
                          }
                        />
                      </SectionCard.Content>
                    </SectionCard>
                  </TabPanel>

                  {/* Ports Tab */}
                  <TabPanel value="ports" className="pt-6">
                    <VStack gap={3}>
                      {/* Title */}
                      <h3 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                        Ports
                      </h3>

                      {/* Action Bar */}
                      <div className="flex items-center gap-1">
                        <div className="w-[var(--search-input-width)]">
                          <SearchInput
                            value={portSearchTerm}
                            onChange={(e) => {
                              setPortSearchTerm(e.target.value);
                              setPortCurrentPage(1);
                            }}
                            placeholder="Search ports by attributes"
                          />
                        </div>
                        <button
                          type="button"
                          className="flex items-center justify-center w-7 h-7 rounded-[var(--button-radius)] border border-[var(--color-border-strong)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] hover:bg-[var(--button-secondary-hover-bg)]"
                          aria-label="Download"
                        >
                          <IconDownload size={14} stroke={1.5} />
                        </button>
                      </div>

                      {/* Pagination */}
                      <Pagination
                        currentPage={portCurrentPage}
                        totalPages={Math.ceil(filteredPorts.length / portsPerPage)}
                        onPageChange={setPortCurrentPage}
                        totalItems={filteredPorts.length}
                      />

                      {/* Table */}
                      <Table columns={portColumns} data={paginatedPorts} rowKey="id" />
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}
