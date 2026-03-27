import { useState, useEffect } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  Badge,
  DetailHeader,
  SectionCard,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  ContextMenu,
  PageShell,
  CopyButton,
  type ContextMenuItem,
  type StatusType,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  IconBell,
  IconTerminal2,
  IconFile,
  IconSearch,
  IconChevronDown,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ClusterStatus = string;

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
    status: 'Raw',
    kubernetesVersion: 'v1.34',
    containerNetwork: 'Kube OVN',
    createdAt: 'Nov 11, 2025 08:30:18',
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
    status: 'OK',
    kubernetesVersion: 'v1.33.4',
    containerNetwork: 'Kube OVN',
    createdAt: 'Oct 6, 2025 21:25:53',
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
  'cluster-003': {
    id: 'cluster-003',
    name: 'Cluster3',
    status: 'OK',
    kubernetesVersion: 'v1.33.4',
    containerNetwork: 'Kube OVN',
    createdAt: 'Oct 5, 2025 14:12:36',
    networking: {
      externalNetwork: 'extnet-03',
      tenantNetwork: 'net-03',
      subnet: 'subnet-03 (10.62.3.0/28)',
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
      flavor: 'th.small (2vCPU, 4.00 GiB RAM, 20.00 GiB Disk)',
      nodeCount: 3,
    },
  },
};

/* ----------------------------------------
   Status Mapping
   ---------------------------------------- */

const statusMap: Record<string, StatusType> = {
  Raw: 'building',
  OK: 'active',
  True: 'active',
  None: 'muted',
  CreateContainerConfigError: 'error',
  InvalidImageName: 'error',
  ImagePullBackOff: 'error',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function ClusterDetailPage() {
  const navigate = useNavigate();
  const { clusterId } = useParams<{ clusterId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'networking';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();

  // Get cluster data
  const cluster = clusterId ? mockClusterDetails[clusterId] : null;

  // Default cluster for demo
  const clusterData = cluster || {
    id: 'cluster-001',
    name: 'tk-test',
    status: 'OK',
    kubernetesVersion: 'v1.34',
    containerNetwork: 'Kube OVN',
    createdAt: 'Jul 25, 2025 10:32:16',
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
  const sidebarWidth = sidebarOpen ? 248 : 48;

  // More actions menu items
  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'kubectl-shell',
      label: 'Kubectl shell',
      onClick: () => console.log('Kubectl Shell'),
    },
    {
      id: 'download-kubeconfig',
      label: 'Download KubeConfig',
      onClick: () => console.log('Download KubeConfig'),
    },
    {
      id: 'copy-kubeconfig',
      label: 'Copy KubeConfig to clipboard',
      onClick: () => console.log('Copy KubeConfig'),
    },
    {
      id: 'edit',
      label: 'Edit cluster',
      onClick: () => navigate(`/container/cluster-management/${clusterData.id}/edit`),
    },
    {
      id: 'customize-appearance',
      label: 'Customize appearance',
      divider: true,
      onClick: () =>
        setTimeout(() =>
          window.dispatchEvent(
            new CustomEvent('open-cluster-appearance', { detail: clusterData.id })
          )
        ),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete'),
    },
  ];

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
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
                { label: 'Cluster management', href: '/container/cluster-management' },
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
              <CopyButton value={clusterData.id} size="sm" iconOnly tooltip="Copy cluster ID" />
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
        <DetailHeader>
          <DetailHeader.Title>{clusterData.name}</DetailHeader.Title>

          <DetailHeader.Actions>
            <ContextMenu items={moreActionsItems} trigger="click" align="right">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<IconChevronDown size={16} stroke={1.5} />}
              >
                More actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <Badge theme="white" size="sm">
                  {clusterData.status}
                </Badge>
              }
            />
            <DetailHeader.InfoCard
              label="Kubernetes version"
              value={clusterData.kubernetesVersion}
            />
            <DetailHeader.InfoCard label="Container network" value={clusterData.containerNetwork} />
            <DetailHeader.InfoCard label="Created at" value={clusterData.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs Section */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="networking">Networking</Tab>
            <Tab value="node-config">Node configuration</Tab>
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
