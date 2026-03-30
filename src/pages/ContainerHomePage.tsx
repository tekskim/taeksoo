import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  SectionCard,
  SearchInput,
  Pagination,
  PageShell,
  ContextMenu,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
  Badge,
  Tooltip,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconDotsCircleHorizontal,
  IconSettings,
} from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ClusterRow {
  id: string;
  name: string;
  status: string;
  kubernetesVersion: string;
  createdAt: string;
  cpu: string;
  memory: string;
  pods: string;
  manage: string;
  actions: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const clustersData: ClusterRow[] = [
  {
    id: '1',
    name: 'ClusterName',
    status: 'Provisioned',
    kubernetesVersion: 'v1.34.0',
    createdAt: 'Nov 11, 2025',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    manage: '',
    actions: '',
  },
  {
    id: '2',
    name: 'ClusterName',
    status: 'Failed',
    kubernetesVersion: 'v1.34.0',
    createdAt: 'Nov 11, 2025',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    manage: '',
    actions: '',
  },
  {
    id: '3',
    name: 'ClusterName',
    status: 'Provisioning',
    kubernetesVersion: 'v1.34.0',
    createdAt: 'Nov 11, 2025',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    manage: '',
    actions: '',
  },
  {
    id: '4',
    name: 'ClusterName',
    status: 'Processing',
    kubernetesVersion: 'v1.34.0',
    createdAt: 'Nov 11, 2025',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    manage: '',
    actions: '',
  },
  {
    id: '5',
    name: 'ClusterName',
    status: 'Deleting',
    kubernetesVersion: 'v1.34.0',
    createdAt: 'Nov 11, 2025',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    manage: '',
    actions: '',
  },
  {
    id: '6',
    name: 'ClusterName',
    status: 'Unknown',
    kubernetesVersion: 'v1.34.0',
    createdAt: 'Nov 11, 2025',
    cpu: '8 cores',
    memory: '16 GiB',
    pods: '46/110',
    manage: '',
    actions: '',
  },
];

/* ----------------------------------------
   Container Home Page
   ---------------------------------------- */

export function ContainerHomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Home');
  }, [updateActiveTabLabel]);

  // Home page only shows icon sidebar (40px), menu sidebar is hidden
  const sidebarWidth = 48;

  // Table columns
  const columns: TableColumn<ClusterRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      sortable: false,
      render: (value: string) => (
        <div className="min-w-0">
          <Tooltip content={value}>
            <Badge
              theme={getContainerStatusTheme(value)}
              type="subtle"
              size="sm"
              className="max-w-[80px]"
            >
              <span className="truncate">{value}</span>
            </Badge>
          </Tooltip>
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <div className="min-w-0">
          <span
            className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block"
            title={value}
            onClick={() => navigate('/container/dashboard')}
          >
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'kubernetesVersion',
      label: 'Kubernetes Version',
      flex: 1,
      minWidth: columnMinWidths.kubernetesVersion,
      sortable: true,
    },
    { key: 'cpu', label: 'CPU', flex: 1, minWidth: columnMinWidths.cpu, sortable: true },
    { key: 'memory', label: 'Memory', flex: 1, minWidth: columnMinWidths.memory, sortable: true },
    { key: 'pods', label: 'Pods', flex: 1, minWidth: columnMinWidths.pods, sortable: true },
    {
      key: 'createdAt',
      label: 'Created At',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'manage',
      label: 'Manage',
      width: '120px',
      align: 'center',
      sortable: false,
      render: (_value: string, row: ClusterRow) => (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<IconSettings size={12} />}
          onClick={() => navigate(`/container/clusters/${row.id}`)}
        >
          Manage
        </Button>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actionWide,
      align: 'center',
      sortable: false,
      render: (_value: string, row: ClusterRow) => (
        <ContextMenu
          items={[
            { id: 'kubectl-shell', label: 'Kubectl Shell', onClick: () => {} },
            { id: 'download-kubeconfig', label: 'Download KubeConfig', onClick: () => {} },
            { id: 'copy-kubeconfig', label: 'Copy KubeConfig to Clipboard', onClick: () => {} },
            { id: 'view-yaml', label: 'View YAML', onClick: () => {} },
            { id: 'download-yaml', label: 'Download YAML', onClick: () => {} },
            { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
          ]}
          trigger="click"
        >
          <button className="p-1.5 rounded hover:bg-[var(--color-surface-hover)] transition-colors">
            <IconDotsCircleHorizontal
              size={16}
              className="text-[var(--color-text-muted)]"
              stroke={1.5}
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<ContainerSidebar isOpen={true} />}
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
          showSidebarToggle={false}
          breadcrumb={<Breadcrumb items={[{ label: 'Home' }]} />}
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconFile size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconCopy size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />
      }
      contentClassName="pt-6 px-8 pb-20"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Welcome Header */}
        <SectionCard className="bg-[var(--color-surface-subtle)]">
          <SectionCard.Content>
            <VStack gap={2}>
              <h1 className="text-heading-h4 text-[var(--color-text-default)]">
                Welcome to Thaki Cloud Container
              </h1>
              <p className="text-body-lg text-[var(--color-text-muted)]">
                Manage effortlessly, scale and optimize your Kubernetes clusters, workloads, and
                resources from a single platform.
              </p>
            </VStack>
          </SectionCard.Content>
        </SectionCard>

        {/* Clusters Section */}
        <HStack gap={6} align="start">
          {/* Clusters Table */}
          <SectionCard className="flex-1">
            <SectionCard.Header title="Clusters" />
            <SectionCard.Content>
              <VStack gap={4}>
                <SearchInput
                  placeholder="Search clusters by attributes"
                  size="sm"
                  className="w-[var(--search-input-width)]"
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(clustersData.length / 10)}
                  onPageChange={setCurrentPage}
                  totalItems={clustersData.length}
                />
                <Table<ClusterRow>
                  columns={columns}
                  data={clustersData}
                  rowKey="id"
                  rowHeight="40px"
                />
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* Create Cluster Card */}
          <SectionCard className="w-[var(--search-input-width)] shrink-0">
            <SectionCard.Content>
              <VStack gap={4}>
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                  Create a cluster
                </h3>
                <p className="text-body-md text-[var(--color-text-muted)] leading-relaxed">
                  Create a Kubernetes cluster to start running and managing your containerized
                  workloads.
                </p>
                <div className="w-full flex justify-end">
                  <Button variant="primary" size="md">
                    Create cluster
                  </Button>
                </div>
              </VStack>
            </SectionCard.Content>
          </SectionCard>
        </HStack>
      </VStack>
    </PageShell>
  );
}

export default ContainerHomePage;
