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
  InfoBox,
  InlineMessage,
  ConfirmModal,
  type ContextMenuItem,
  type StatusType,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  IconChevronDown,
  IconLoader2,
  IconExternalLink,
  IconRefresh,
  IconTrash,
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
   Mock Data
   ---------------------------------------- */

const mockClusterDetails: Record<string, ClusterDetail> = {
  'cluster-001': {
    id: 'cluster-001',
    name: 'Cluster1',
    status: 'Provisioned',
    kubernetesVersion: 'v1.34',
    containerNetwork: 'Kube OVN',
    createdAt: 'Nov 11, 2026 08:30:18',
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
    createdAt: 'Oct 6, 2026 21:25:53',
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
    createdAt: 'Oct 5, 2026 14:12:36',
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
    status: 'Deleting',
    kubernetesVersion: 'v1.33.1',
    containerNetwork: 'Kube OVN',
    createdAt: 'Sep 20, 2026 09:15:42',
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
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 3,
      etcd: 'External (10GiB)',
    },
    nodes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 2,
    },
  },
  'cluster-005': {
    id: 'cluster-005',
    name: 'Cluster5',
    status: 'Unknown',
    kubernetesVersion: 'v1.31.0',
    containerNetwork: 'Kube OVN',
    createdAt: 'Aug 14, 2026 16:45:10',
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
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 1,
      etcd: 'External (10GiB)',
    },
    nodes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.tiny (1vCPU, 2.00 GiB RAM, 10.00 GiB Disk)',
      nodeCount: 1,
    },
  },
  'cluster-006': {
    id: 'cluster-006',
    name: 'Cluster6',
    status: 'Updating',
    kubernetesVersion: 'v1.33.4',
    containerNetwork: 'Kube OVN',
    createdAt: 'Jun 5, 2026 15:42:33',
    networking: {
      externalNetwork: 'extnet-06',
      tenantNetwork: 'net-06',
      subnet: 'subnet-06 (10.62.6.0/28)',
    },
    nodeConfiguration: {
      nodeType: 'Instance',
    },
    controlPlanes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.medium (4vCPU, 8.00 GiB RAM, 40.00 GiB Disk)',
      nodeCount: 3,
      etcd: 'External (20GiB)',
    },
    nodes: {
      image: 'ubuntu-24.04-tk-base',
      flavor: 'th.medium (4vCPU, 8.00 GiB RAM, 40.00 GiB Disk)',
      nodeCount: 4,
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
  const [isDeleteTokenOpen, setIsDeleteTokenOpen] = useState(false);
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
    createdAt: 'Jul 25, 2026 10:32:16',
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

  const isProvisioned = clusterData.status === 'Provisioned';
  const isProvisioning = clusterData.status === 'Provisioning';
  const isFailed = clusterData.status === 'Failed';
  const isDeleting = clusterData.status === 'Deleting';
  const isUnknown = clusterData.status === 'Unknown';
  const isUpdating = clusterData.status === 'Updating';

  // More actions menu items — vary by status
  const moreActionsItems: ContextMenuItem[] = [
    ...(isProvisioned
      ? [
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
        ]
      : []),
    ...(isProvisioned || isFailed || isUnknown
      ? [
          {
            id: 'edit',
            label: 'Edit cluster',
            onClick: () => navigate(`/container/cluster-management/${clusterData.id}/edit`),
          },
        ]
      : []),
    ...(isFailed
      ? [
          {
            id: 'reprovision',
            label: 'Reprovision',
            onClick: () => console.log('Reprovision'),
          },
        ]
      : []),
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
    ...(!isDeleting
      ? [
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger' as const,
            onClick: () => console.log('Delete'),
          },
        ]
      : []),
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
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Cluster management', href: '/container/cluster-management' },
                { label: 'Clusters', href: '/container/cluster-management' },
                { label: clusterData.name },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6}>
        <VStack gap={4}>
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
                  {isProvisioning && (
                    <span className="flex-1 min-w-0 flex items-center gap-1.5">
                      <IconLoader2
                        size={14}
                        stroke={1.5}
                        className="text-[var(--color-action-primary)] animate-spin shrink-0"
                      />
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Control plane initializing
                      </span>
                    </span>
                  )}
                  {isDeleting && (
                    <span className="flex-1 min-w-0 flex items-center gap-1.5">
                      <IconLoader2
                        size={14}
                        stroke={1.5}
                        className="text-[var(--color-text-muted)] animate-spin shrink-0"
                      />
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Removing cluster resources
                      </span>
                    </span>
                  )}
                  {isUpdating && (
                    <span className="flex-1 min-w-0 flex items-center gap-1.5">
                      <IconLoader2
                        size={14}
                        stroke={1.5}
                        className="text-[var(--color-action-primary)] animate-spin shrink-0"
                      />
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Updating cluster
                      </span>
                    </span>
                  )}
                </div>
              </InfoBox>
              <DetailHeader.InfoCard
                label="Kubernetes version"
                value={clusterData.kubernetesVersion}
              />
              <DetailHeader.InfoCard
                label="Container network"
                value={clusterData.containerNetwork}
              />
              <DetailHeader.InfoCard label="Created at" value={clusterData.createdAt} />
            </DetailHeader.InfoGrid>
          </DetailHeader>

          {isProvisioning && (
            <InlineMessage variant="info">
              A cluster operation is in progress. Some actions may be temporarily unavailable.
              Status will return to &apos;Provisioned&apos; once the operation is complete.
            </InlineMessage>
          )}

          {isFailed && (
            <InlineMessage variant="error">
              Cluster provisioning failed at control plane initializing.{' '}
              <a
                href="#logs"
                className="inline-flex items-center gap-0.5 underline hover:no-underline text-[var(--color-action-primary)] font-medium"
              >
                View error logs in Logs
                <IconExternalLink
                  size={12}
                  stroke={2}
                  className="inline-block text-[var(--color-action-primary)]"
                />
              </a>
            </InlineMessage>
          )}

          {isUpdating && (
            <InlineMessage variant="info">
              A cluster operation is in progress. Some actions may be temporarily unavailable.
              Status will return to &apos;Provisioned&apos; once the operation is complete.
            </InlineMessage>
          )}

          {isDeleting && (
            <InlineMessage variant="info">
              Cluster deletion is in progress. All resources will be cleaned up automatically.
            </InlineMessage>
          )}
        </VStack>

        {/* Tabs Section */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="networking">Networking</Tab>
            <Tab value="node-config">Node configuration</Tab>
            <Tab value="access-token">Access token</Tab>
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

          <TabPanel value="access-token">
            <VStack gap={6}>
              <SectionCard>
                <SectionCard.Header
                  title="Access token"
                  actions={
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconTrash size={12} />}
                        onClick={() => setIsDeleteTokenOpen(true)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconRefresh size={12} />}
                        onClick={() => console.log('Regenerate token')}
                      >
                        Regenerate
                      </Button>
                    </>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Cluster" value={clusterData.name} />
                  <SectionCard.DataRow label="Created on" value="Mar 20, 2026" />
                  <SectionCard.DataRow label="Expires on" value="Apr 19, 2026" />
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      <ConfirmModal
        isOpen={isDeleteTokenOpen}
        onClose={() => setIsDeleteTokenOpen(false)}
        onConfirm={() => {
          console.log('Delete access token');
          setIsDeleteTokenOpen(false);
        }}
        title="Delete token"
        description="Any kubectl sessions or scripts using this token will lose access immediately."
        infoLabel="Cluster"
        infoValue={clusterData.name}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </PageShell>
  );
}

export default ClusterDetailPage;
