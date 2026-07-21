import { useState, useMemo } from 'react';
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
  Select,
  FormField,
  StatusIndicator,
  ContextMenu,
  ConfirmModal,
  EmptyState,
  ListToolbar,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import type { TableColumn, ContextMenuItem } from '@/design-system';
import { SecuritySidebar } from '@/components/SecuritySidebar';
import { useTabs } from '@/contexts/TabContext';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  IconChevronDown,
  IconDownload,
  IconTrash,
  IconNetwork,
  IconPlus,
  IconDotsCircleHorizontal,
} from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';

interface NetworkPolicy {
  id: string;
  name: string;
  namespace: string;
  status: 'active' | 'error' | 'muted';
  podSelector: string;
  createdAt: string;
}

const clusterOptions = [
  { value: 'cluster-01', label: 'prod-cluster-01' },
  { value: 'cluster-02', label: 'staging-cluster-02' },
  { value: 'cluster-03', label: 'dev-cluster-03' },
];

const mockPolicies: NetworkPolicy[] = [
  {
    id: 'np-001',
    name: 'deny-all-ingress',
    namespace: 'production',
    status: 'active',
    podSelector: 'app=api',
    createdAt: 'Mar 10 2026 08:00:00',
  },
  {
    id: 'np-002',
    name: 'allow-frontend-to-api',
    namespace: 'production',
    status: 'active',
    podSelector: 'app=api',
    createdAt: 'Mar 11 2026 10:00:00',
  },
  {
    id: 'np-003',
    name: 'allow-api-to-db',
    namespace: 'production',
    status: 'active',
    podSelector: 'app=api',
    createdAt: 'Mar 12 2026 14:30:00',
  },
  {
    id: 'np-004',
    name: 'monitoring-access',
    namespace: 'monitoring',
    status: 'active',
    podSelector: 'app=prometheus',
    createdAt: 'Mar 13 2026 09:15:00',
  },
  {
    id: 'np-005',
    name: 'deny-all-egress',
    namespace: 'staging',
    status: 'error',
    podSelector: 'env=staging',
    createdAt: 'Mar 14 2026 16:00:00',
  },
];

const statusMap: Record<string, 'active' | 'error' | 'muted'> = {
  active: 'active',
  error: 'error',
  muted: 'muted',
};

export function NetworkPoliciesPage() {
  const navigate = useNavigate();
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [selectedCluster, setSelectedCluster] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NetworkPolicy | null>(null);
  const rowsPerPage = 10;

  const hasCluster = selectedCluster !== '';

  const filteredData = useMemo(() => {
    if (!hasCluster) return [];
    return mockPolicies.filter(
      (np) =>
        np.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        np.namespace.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [hasCluster, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getRowActions = (row: NetworkPolicy): ContextMenuItem[] => [
    { id: 'edit-config', label: 'Edit config', onClick: () => {} },
    { id: 'edit-yaml', label: 'Edit YAML', onClick: () => {} },
    { id: 'download', label: 'Download YAML', onClick: () => {} },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      divider: true,
      onClick: () => {
        setDeleteTarget(row);
        setDeleteOpen(true);
      },
    },
  ];

  const columns: TableColumn<NetworkPolicy>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (_, row) => <StatusIndicator layout="icon-only" status={statusMap[row.status]} />,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string, row) => (
        <Link
          to={`/security/network-policies/${row.id}`}
          className="text-label-md font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
    },
    {
      key: 'podSelector',
      label: 'Pod-Selector',
      flex: 1,
      minWidth: 140,
    },
    {
      key: 'createdAt',
      label: 'Created At',
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
        <ContextMenu items={getRowActions(row)} trigger="click" align="right">
          <button
            aria-label="Row actions"
            className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--action-icon-color)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  const createDropdownItems: ContextMenuItem[] = [
    {
      id: 'create-form',
      label: 'Create from form',
      onClick: () => navigate('/security/network-policies/create'),
    },
    {
      id: 'create-yaml',
      label: 'Create from YAML',
      onClick: () => navigate('/security/network-policies/create-yaml'),
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
      <VStack gap={6}>
        {/* Cluster Selector */}
        <VStack gap={2}>
          <FormField label="Cluster" description="Choose a cluster to load its policies.">
            <Select
              options={clusterOptions}
              value={selectedCluster}
              onChange={(val) => {
                setSelectedCluster(val);
                setCurrentPage(1);
                setSearchQuery('');
                setSelectedItems([]);
              }}
              placeholder="Select a cluster"
              className="w-[240px]"
            />
          </FormField>
        </VStack>

        {/* Main Content */}
        <VStack gap={3}>
          <PageHeader
            title="Network Policies"
            actions={
              <ContextMenu items={createDropdownItems} trigger="click" align="right">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<IconChevronDown size={14} />}
                  disabled={!hasCluster}
                >
                  Create Network Policy
                </Button>
              </ContextMenu>
            }
          />

          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <SearchInput
                  placeholder="Search network policies with attributes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  size="sm"
                  className="w-[var(--search-input-width)]"
                  disabled={!hasCluster}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<IconDownload size={12} />}
                  aria-label="Download"
                  disabled={!hasCluster}
                />
              </ListToolbar.Actions>
            }
            bulkActions={
              <ListToolbar.Actions>
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconDownload size={12} />}
                  disabled={selectedItems.length === 0}
                >
                  Download YAML
                </Button>
                <Button
                  variant="muted"
                  size="sm"
                  leftIcon={<IconTrash size={12} />}
                  disabled={selectedItems.length === 0}
                >
                  Delete
                </Button>
              </ListToolbar.Actions>
            }
          />

          {hasCluster && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredData.length}
              selectedCount={selectedItems.length}
              showSettings
            />
          )}

          {!hasCluster ? (
            <Table<NetworkPolicy>
              columns={columns}
              data={[]}
              rowKey="id"
              selectable
              emptyMessage="Choose a cluster above to view and manage NetworkPolicies for that cluster."
            />
          ) : filteredData.length === 0 ? (
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
              selectable
              selectedKeys={selectedItems}
              onSelectionChange={setSelectedItems}
              emptyMessage="No network policies found"
            />
          )}
        </VStack>
      </VStack>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        title="Delete Network Policy"
        description="This action cannot be undone."
        infoLabel="Policy name"
        infoValue={deleteTarget?.name ?? ''}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </PageShell>
  );
}

export default NetworkPoliciesPage;
