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
  StatusIndicator,
  SectionCard,
  SearchInput,
  Pagination,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTerminal2, IconFile, IconCopy, IconSearch } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface ClusterRow {
  id: string;
  name: string;
  status: 'Running' | 'Stopped' | 'Creating' | 'Error';
  kubernetesVersion: string;
  createdAt: string;
  cpu: string;
  memory: string;
  pods: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const clustersData: ClusterRow[] = [
  {
    id: '1',
    name: 'Cluster1',
    status: 'Running',
    kubernetesVersion: 'v1.24',
    createdAt: '2025-11-11 8:59',
    cpu: '-',
    memory: '-',
    pods: '-',
  },
  {
    id: '2',
    name: 'ClusterName',
    status: 'Running',
    kubernetesVersion: 'v1.29.1',
    createdAt: '2025-10-30 21:28',
    cpu: '-',
    memory: '-',
    pods: '-',
  },
  {
    id: '3',
    name: 'ClusterName',
    status: 'Running',
    kubernetesVersion: 'v1.33.4',
    createdAt: '2025-10-30 21:28',
    cpu: '8 cores',
    memory: '-',
    pods: '10/110',
  },
  {
    id: '4',
    name: 'ClusterName',
    status: 'Running',
    kubernetesVersion: 'v1.33.4',
    createdAt: '2025-10-30 21:28',
    cpu: '-',
    memory: '16 GiB',
    pods: '-',
  },
  {
    id: '5',
    name: 'ClusterName',
    status: 'Running',
    kubernetesVersion: 'v1.33.4',
    createdAt: '2025-10-30 21:28',
    cpu: '-',
    memory: '-',
    pods: '-',
  },
  {
    id: '6',
    name: 'ClusterName',
    status: 'Running',
    kubernetesVersion: 'v1.33.4',
    createdAt: '2025-10-30 21:28',
    cpu: '-',
    memory: '-',
    pods: '-',
  },
  {
    id: '7',
    name: 'ClusterName',
    status: 'Running',
    kubernetesVersion: 'v1.33.4',
    createdAt: '2025-10-30 21:28',
    cpu: '-',
    memory: '16 GiB',
    pods: '10/110',
  },
  {
    id: '8',
    name: 'ClusterName',
    status: 'Running',
    kubernetesVersion: 'v1.33.4',
    createdAt: '2025-10-30 21:28',
    cpu: '-',
    memory: '-',
    pods: '45/100',
  },
];

/* ----------------------------------------
   Container Home Page
   ---------------------------------------- */

export function ContainerHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('Home');
  }, [updateActiveTabLabel]);

  // Calculate sidebar width (40px icon sidebar always visible + 200px menu sidebar when open)
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // Table columns
  const columns: TableColumn<ClusterRow>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: true,
      render: (value: string) => (
        <StatusIndicator
          status={value === 'Running' ? 'active' : value === 'Creating' ? 'building' : 'suspended'}
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value: string) => (
        <span
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline"
          onClick={() => navigate('/container/dashboard')}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'kubernetesVersion',
      label: 'Kubernetes version',
      flex: 1,
      minWidth: columnMinWidths.kubernetesVersion,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    { key: 'cpu', label: 'CPU', flex: 1, minWidth: columnMinWidths.cpu, sortable: true },
    { key: 'memory', label: 'Memory', flex: 1, minWidth: columnMinWidths.memory, sortable: true },
    { key: 'pods', label: 'Pods', flex: 1, minWidth: columnMinWidths.pods, sortable: true },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
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

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-6 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Welcome Header */}
              <SectionCard className="bg-[var(--color-surface-subtle)]">
                <SectionCard.Content>
                  <VStack gap={2}>
                    <h1 className="text-heading-h4 text-[var(--color-text-default)]">
                      Welcome to Thaki Cloud Container
                    </h1>
                    <p className="text-body-lg text-[var(--color-text-muted)]">
                      Manage effortlessly, scale and optimize your Kubernetes clusters, workloads,
                      and resources from a single platform.
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
                        Create a Cluster
                      </h3>
                      <p className="text-body-md text-[var(--color-text-muted)] leading-relaxed">
                        Create a Kubernetes cluster to start running and managing your containerized
                        workloads.
                      </p>
                      <div className="w-full flex justify-end">
                        <Button variant="primary" size="md">
                          Create Cluster
                        </Button>
                      </div>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>
              </HStack>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContainerHomePage;
