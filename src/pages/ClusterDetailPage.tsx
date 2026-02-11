import { useState, useEffect } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  StatusIndicator,
  SectionCard,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  ContextMenu,
  PageShell,
  type ContextMenuItem,
  type StatusType,
} from '@/design-system';
import { ClusterManagementSidebar } from '@/components/ClusterManagementSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconCopy,
  IconSearch,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ClusterStatus = 'active' | 'building' | 'error' | 'deleting';

interface ClusterDetail {
  id: string;
  name: string;
  status: ClusterStatus;
  kubernetesVersion: string;
  containerNetwork: string;
  createdAt: string;
  networking: {
    externalNetwork: string;
    tenantNetwork: string;
    subnet: string;
  };
  nodeConfiguration: {
    nodeType: string;
  };
  controlPlanes: {
    image: string;
    flavor: string;
    nodeCount: number;
    etcd: string;
  };
  nodes: {
    image: string;
    flavor: string;
    nodeCount: number;
  };
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockClusterDetails: Record<string, ClusterDetail> = {
  'cluster-001': {
    id: 'cluster-001',
    name: 'Cluster1',
    status: 'building',
    kubernetesVersion: 'v1.34',
    containerNetwork: 'Kube OVN',
    createdAt: 'Nov 11, 2025',
    networking: {
      externalNetwork: 'extnet-01',
      tenantNetwork: 'net-01',
      subnet: 'subnet-01 (10.62.1.0/28)',
    },
    nodeConfiguration: {
      nodeType: 'Instance',
    },
    controlPlanes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 3,
      etcd: 'External (10GiB)',
    },
    nodes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 1,
    },
  },
  'cluster-002': {
    id: 'cluster-002',
    name: 'ClusterName',
    status: 'active',
    kubernetesVersion: 'v1.33.4',
    containerNetwork: 'Kube OVN',
    createdAt: 'Oct 6, 2025',
    networking: {
      externalNetwork: 'extnet-02',
      tenantNetwork: 'net-02',
      subnet: 'subnet-02 (10.62.2.0/28)',
    },
    nodeConfiguration: {
      nodeType: 'Instance',
    },
    controlPlanes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.small (2vCPU, 4.00 GiB RAM, 20.00 GiB Disk)',
      nodeCount: 3,
      etcd: 'External (20GiB)',
    },
    nodes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.medium (4vCPU, 8.00 GiB RAM, 40.00 GiB Disk)',
      nodeCount: 5,
    },
  },
};

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const statusMap: Record<ClusterStatus, StatusType> = {
  active: 'active',
  building: 'building',
  error: 'error',
  deleting: 'deleting',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ClusterDetailPage() {
  const navigate = useNavigate();
  const { clusterId } = useParams<{ clusterId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('networking');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  // Get cluster data
  const cluster = clusterId ? mockClusterDetails[clusterId] : null;

  // Default cluster for demo
  const clusterData = cluster || {
    id: 'cluster-001',
    name: 'tk-test',
    status: 'active' as ClusterStatus,
    kubernetesVersion: 'v1.34',
    containerNetwork: 'Kube OVN',
    createdAt: 'Jul 25, 2025',
    networking: {
      externalNetwork: 'extnet-01',
      tenantNetwork: 'net-01',
      subnet: 'subnet-01 (10.62.1.0/28)',
    },
    nodeConfiguration: {
      nodeType: 'Instance',
    },
    controlPlanes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 3,
      etcd: 'External (10GiB)',
    },
    nodes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 1,
    },
  };

  // Update tab label to match the cluster name
  useEffect(() => {
    updateActiveTabLabel(clusterData.name);
  }, [updateActiveTabLabel, clusterData.name]);

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  // More actions menu items
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'kubectl-shell',
      label: 'Kubectl Shell',
      onClick: () => console.log('Kubectl Shell'),
    },
    {
      id: 'download-kubeconfig',
      label: 'Download KubeConfig',
      onClick: () => console.log('Download KubeConfig'),
    },
    {
      id: 'copy-kubeconfig',
      label: 'Copy KubeConfig to Clipboard',
      onClick: () => console.log('Copy KubeConfig'),
    },
    {
      id: 'edit',
      label: 'Edit Cluster',
      onClick: () => navigate(`/container/cluster-management/${clusterData.id}/edit`),
    },
    {
      id: 'delete',
      label: 'Delete',
      onClick: () => console.log('Delete'),
    },
  ];

  return (
    <PageShell
      sidebar={
        <ClusterManagementSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      }
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
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Cluster Management', href: '/container/cluster-management' },
                { label: 'Clusters', href: '/container/cluster-management' },
                { label: clusterData.name },
              ]}
            />
          }
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
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={8}>
        {/* Header Card */}
        <div className="w-full bg-white border border-[var(--color-border-default)] rounded-lg p-4">
          <VStack gap={3}>
            {/* Cluster Name */}
            <h1 className="text-[16px] leading-6 font-semibold text-[var(--color-text-default)]">
              {clusterData.name}
            </h1>

            {/* More Actions Button */}
            <ContextMenu items={moreActionsItems} trigger="click" align="right">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<IconChevronDown size={16} stroke={1.5} />}
              >
                More actions
              </Button>
            </ContextMenu>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3 w-full">
              {/* Status */}
              <div className="bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3 relative">
                <VStack gap={1}>
                  <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
                    Status
                  </span>
                  <span className="text-[12px] text-[var(--color-text-default)]">
                    {clusterData.status.charAt(0).toUpperCase() + clusterData.status.slice(1)}
                  </span>
                </VStack>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <StatusIndicator
                    status={statusMap[clusterData.status]}
                    layout="icon-only"
                    size="lg"
                  />
                </div>
              </div>

              {/* Kubernetes Version */}
              <div className="bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                <VStack gap={1}>
                  <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
                    Kubernetes Version
                  </span>
                  <span className="text-[12px] text-[var(--color-text-default)]">
                    {clusterData.kubernetesVersion}
                  </span>
                </VStack>
              </div>

              {/* Container Network */}
              <div className="bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                <VStack gap={1}>
                  <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
                    Container Network
                  </span>
                  <span className="text-[12px] text-[var(--color-text-default)]">
                    {clusterData.containerNetwork}
                  </span>
                </VStack>
              </div>

              {/* Created At */}
              <div className="bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                <VStack gap={1}>
                  <span className="text-[11px] font-medium text-[var(--color-text-subtle)]">
                    Created at
                  </span>
                  <span className="text-[12px] text-[var(--color-text-default)]">
                    {clusterData.createdAt}
                  </span>
                </VStack>
              </div>
            </div>
          </VStack>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="networking">Networking</Tab>
            <Tab value="node-config">Node Configuration</Tab>
          </TabList>

          <TabPanel value="networking">
            <div>
              <SectionCard>
                <SectionCard.Header title="Networking" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="External network"
                    value={clusterData.networking.externalNetwork}
                  />
                  <SectionCard.DataRow
                    label="Tenant network"
                    value={clusterData.networking.tenantNetwork}
                  />
                  <SectionCard.DataRow label="Subnet" value={clusterData.networking.subnet} />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </TabPanel>

          <TabPanel value="node-config">
            <VStack gap={6}>
              {/* Node Configuration Card */}
              <SectionCard>
                <SectionCard.Header title="Node configuration" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Node type"
                    value={clusterData.nodeConfiguration.nodeType}
                  />
                </SectionCard.Content>
              </SectionCard>

              {/* Control Planes Card */}
              <SectionCard>
                <SectionCard.Header title="Control planes" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Image" value={clusterData.controlPlanes.image} />
                  <SectionCard.DataRow label="Flavor" value={clusterData.controlPlanes.flavor} />
                  <SectionCard.DataRow
                    label="Node count"
                    value={clusterData.controlPlanes.nodeCount.toString()}
                  />
                  <SectionCard.DataRow label="etcd" value={clusterData.controlPlanes.etcd} />
                </SectionCard.Content>
              </SectionCard>

              {/* Nodes Card */}
              <SectionCard>
                <SectionCard.Header title="Nodes" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Image" value={clusterData.nodes.image} />
                  <SectionCard.DataRow label="Flavor" value={clusterData.nodes.flavor} />
                  <SectionCard.DataRow
                    label="Node count"
                    value={clusterData.nodes.nodeCount.toString()}
                  />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}

export default ClusterDetailPage;
