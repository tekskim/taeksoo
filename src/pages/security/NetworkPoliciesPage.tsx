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
import { IconPlus, IconDownload, IconRefresh, IconNetwork } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface NetworkPolicy {
  id: string;
  name: string;
  namespace: string;
  policyTypes: string[];
  podSelector: string;
  ingressRules: number;
  egressRules: number;
  createdAt: string;
}

const mockPolicies: NetworkPolicy[] = [
  {
    id: 'np-001',
    name: 'deny-all-ingress',
    namespace: 'production',
    policyTypes: ['Ingress'],
    podSelector: 'app=api',
    ingressRules: 0,
    egressRules: 0,
    createdAt: '2026-03-10 08:00:00',
  },
  {
    id: 'np-002',
    name: 'allow-frontend-to-api',
    namespace: 'production',
    policyTypes: ['Ingress'],
    podSelector: 'app=api',
    ingressRules: 1,
    egressRules: 0,
    createdAt: '2026-03-11 10:00:00',
  },
  {
    id: 'np-003',
    name: 'allow-api-to-db',
    namespace: 'production',
    policyTypes: ['Egress'],
    podSelector: 'app=api',
    ingressRules: 0,
    egressRules: 2,
    createdAt: '2026-03-12 14:30:00',
  },
  {
    id: 'np-004',
    name: 'monitoring-access',
    namespace: 'monitoring',
    policyTypes: ['Ingress', 'Egress'],
    podSelector: 'app=prometheus',
    ingressRules: 3,
    egressRules: 1,
    createdAt: '2026-03-13 09:15:00',
  },
  {
    id: 'np-005',
    name: 'deny-all-egress',
    namespace: 'staging',
    policyTypes: ['Egress'],
    podSelector: 'env=staging',
    ingressRules: 0,
    egressRules: 0,
    createdAt: '2026-03-14 16:00:00',
  },
];

export function NetworkPoliciesPage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = mockPolicies.filter(
    (np) =>
      np.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      np.namespace.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns: TableColumn<NetworkPolicy>[] = [
    { key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.name, sortable: true },
    { key: 'namespace', label: 'Namespace', flex: 1, minWidth: columnMinWidths.namespace },
    {
      key: 'policyTypes',
      label: 'Policy types',
      flex: 1,
      minWidth: 140,
      render: (_, row) => (
        <div className="flex gap-1">
          {row.policyTypes.map((type) => (
            <Badge key={type} theme="white" size="sm">
              {type}
            </Badge>
          ))}
        </div>
      ),
    },
    { key: 'podSelector', label: 'Pod selector', flex: 1, minWidth: 120 },
    {
      key: 'ingressRules',
      label: 'Ingress rules',
      flex: 1,
      minWidth: 100,
      align: 'right' as const,
    },
    { key: 'egressRules', label: 'Egress rules', flex: 1, minWidth: 100, align: 'right' as const },
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
              items={[{ label: 'Security', href: '/security' }, { label: 'Network Policies' }]}
            />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader
          title="Network Policies"
          actions={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
              Create Network Policy
            </Button>
          }
        />

        <div className="flex items-center gap-1">
          <div className="w-[var(--search-input-width)]">
            <SearchInput
              placeholder="Search network policies by attributes"
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
            icon={<IconNetwork size={48} stroke={1} />}
            title="No network policies found"
            description="Create your first network policy to control pod-to-pod traffic."
            action={
              <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
                Create Network Policy
              </Button>
            }
          />
        ) : (
          <Table<NetworkPolicy>
            columns={columns}
            data={paginatedData}
            rowKey="id"
            emptyMessage="No network policies found"
          />
        )}
      </VStack>
    </PageShell>
  );
}

export default NetworkPoliciesPage;
