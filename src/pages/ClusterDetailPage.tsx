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
  ProgressBar,
  InfoBox,
  InlineMessage,
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
  IconPencilCog,
  IconKey,
} from '@tabler/icons-react';
import { Tooltip } from '@/design-system';
import { getContainerStatusTheme } from './containerStatusUtils';

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
   Status Policy Helpers
   ---------------------------------------- */

// Progress Bar: Provisioning, Processing, Deleting 상태에서만 표시
const PROGRESS_BAR_STATUSES = new Set(['Provisioning', 'Processing', 'Deleting']);

const getProgressBarLabel = (status: string): string => {
  switch (status) {
    case 'Provisioning':
      return 'Control plane initializing';
    case 'Processing':
      return 'Processing operation';
    case 'Deleting':
      return 'Removing worker nodes';
    default:
      return '';
  }
};

// Inline Message: 상태별 variant 및 문구 정의
interface InlineMessageConfig {
  variant: 'info' | 'error' | 'warning' | 'success';
  message: string;
}

const getInlineMessageConfig = (status: string): InlineMessageConfig | null => {
  switch (status) {
    case 'Provisioning':
      return {
        variant: 'info',
        message:
          "Cluster provisioning is in progress. This typically takes a few minutes. Status will become 'Provisioned' when provisioning is complete.",
      };
    case 'Deleting':
      return {
        variant: 'info',
        message: 'Cluster deletion is in progress. All resources will be cleaned up automatically.',
      };
    case 'Processing':
      return {
        variant: 'info',
        message:
          "A cluster operation is in progress. Some actions may be temporarily unavailable. Status will return to 'Provisioned' once the operation is complete.",
      };
    case 'Failed':
      return {
        variant: 'error',
        message:
          'Cluster provisioning failed at Control plane initializing. View error logs in Logs for details.',
      };
    default:
      return null;
  }
};

// Section Card 표시 정책: Provisioned 이외 상태에서는 모든 값을 —(em dash)로 표시
const getDisplayValue = (value: string, status: string): string => {
  return status === 'Provisioned' ? value : '\u2014';
};

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockClusterDetails: Record<string, ClusterDetail> = {
  'cluster-001': {
    id: 'cluster-001',
    name: 'Cluster1',
    status: 'Provisioned',
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
    status: 'Failed',
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
    status: 'Provisioning',
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
  'cluster-004': {
    id: 'cluster-004',
    name: 'Cluster4',
    status: 'Processing',
    kubernetesVersion: 'v1.33.4',
    containerNetwork: 'Kube OVN',
    createdAt: 'Oct 4, 2025 09:00:00',
    networking: {
      externalNetwork: 'extnet-04',
      tenantNetwork: 'net-04',
      subnet: 'subnet-04 (10.62.4.0/28)',
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
      nodeCount: 2,
    },
  },
  'cluster-005': {
    id: 'cluster-005',
    name: 'Cluster5',
    status: 'Deleting',
    kubernetesVersion: 'v1.33.4',
    containerNetwork: 'Kube OVN',
    createdAt: 'Oct 3, 2025 16:45:00',
    networking: {
      externalNetwork: 'extnet-05',
      tenantNetwork: 'net-05',
      subnet: 'subnet-05 (10.62.5.0/28)',
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
    status: 'Provisioned',
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

  const showProgressBar = PROGRESS_BAR_STATUSES.has(clusterData.status);
  const inlineMessageConfig = getInlineMessageConfig(clusterData.status);

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
              <Tooltip content="Customize appearance" position="bottom">
                <button
                  className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent('open-cluster-appearance', { detail: clusterData.id })
                    )
                  }
                  aria-label="Customize cluster appearance"
                >
                  <IconPencilCog
                    size={16}
                    className="text-[var(--color-text-muted)]"
                    stroke={1.5}
                  />
                </button>
              </Tooltip>
              <Tooltip content="Access Token" position="bottom">
                <button
                  className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-access-token'))}
                  aria-label="Access Token"
                >
                  <IconKey size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
                </button>
              </Tooltip>
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
            <InfoBox label="Status" className="flex-1">
              <div className="flex items-center gap-3 w-full">
                <Tooltip content={clusterData.status}>
                  <span className="shrink-0">
                    <Badge
                      theme={getContainerStatusTheme(clusterData.status)}
                      type="subtle"
                      size="sm"
                    >
                      {clusterData.status}
                    </Badge>
                  </span>
                </Tooltip>
                {showProgressBar && (
                  <span className="flex-1 min-w-0 flex flex-col gap-1">
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      {getProgressBarLabel(clusterData.status)}
                    </span>
                    <ProgressBar value={65} max={100} size="sm" showValue={false} />
                  </span>
                )}
              </div>
            </InfoBox>
            <DetailHeader.InfoCard
              label="Kubernetes version"
              value={clusterData.kubernetesVersion}
            />
            <DetailHeader.InfoCard label="Container network" value={clusterData.containerNetwork} />
            <DetailHeader.InfoCard label="Created at" value={clusterData.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {inlineMessageConfig && (
          <InlineMessage variant={inlineMessageConfig.variant}>
            {inlineMessageConfig.message}
          </InlineMessage>
        )}

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
                    value={getDisplayValue(
                      clusterData.networking.externalNetwork,
                      clusterData.status
                    )}
                  />
                  <SectionCard.DataRow
                    label="Tenant network"
                    value={getDisplayValue(
                      clusterData.networking.tenantNetwork,
                      clusterData.status
                    )}
                  />
                  <SectionCard.DataRow
                    label="Subnet"
                    value={getDisplayValue(clusterData.networking.subnet, clusterData.status)}
                  />
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
                    value={getDisplayValue(
                      clusterData.nodeConfiguration.nodeType,
                      clusterData.status
                    )}
                  />
                </SectionCard.Content>
              </SectionCard>

              {/* Control Planes Card */}
              <SectionCard>
                <SectionCard.Header title="Control planes" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Image"
                    value={getDisplayValue(clusterData.controlPlanes.image, clusterData.status)}
                  />
                  <SectionCard.DataRow
                    label="Flavor"
                    value={getDisplayValue(clusterData.controlPlanes.flavor, clusterData.status)}
                  />
                  <SectionCard.DataRow
                    label="Node count"
                    value={getDisplayValue(
                      clusterData.controlPlanes.nodeCount.toString(),
                      clusterData.status
                    )}
                  />
                  <SectionCard.DataRow
                    label="etcd"
                    value={getDisplayValue(clusterData.controlPlanes.etcd, clusterData.status)}
                  />
                </SectionCard.Content>
              </SectionCard>

              {/* Nodes Card */}
              <SectionCard>
                <SectionCard.Header title="Nodes" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Image"
                    value={getDisplayValue(clusterData.nodes.image, clusterData.status)}
                  />
                  <SectionCard.DataRow
                    label="Flavor"
                    value={getDisplayValue(clusterData.nodes.flavor, clusterData.status)}
                  />
                  <SectionCard.DataRow
                    label="Node count"
                    value={getDisplayValue(
                      clusterData.nodes.nodeCount.toString(),
                      clusterData.status
                    )}
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
