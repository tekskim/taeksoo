import { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
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
  Modal,
  FormField,
  Select,
  CopyButton,
  ConfirmModal,
  type ContextMenuItem,
  type StatusType,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import type { ClusterUsage, ClusterOverviewData } from '@/components/ClusterOverviewTab';
import { useTabs } from '@/contexts/TabContext';
import { useContainerMode } from '@/contexts/ContainerModeContext';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  IconChevronDown,
  IconLoader2,
  IconExternalLink,
  IconRefresh,
  IconTrash,
  IconCirclePlus,
  IconAffiliate,
} from '@tabler/icons-react';
import { Tooltip } from '@/design-system';
import { getContainerStatusTheme } from './containerStatusUtils';
import { HAS_CLUSTER_CONDITIONS_TAB } from './containerDashboardLayout';
import { ClusterConditionsTab, type ClusterCondition } from '@/components/ClusterConditionsTab';

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
  const [isGenerateTokenOpen, setIsGenerateTokenOpen] = useState(false);
  const [tokenExpiration, setTokenExpiration] = useState('24h');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [tokenCreatedAt, setTokenCreatedAt] = useState('');
  const [tokenExpiresAt, setTokenExpiresAt] = useState('');
  const [isRegenerateTokenOpen, setIsRegenerateTokenOpen] = useState(false);
  const [regeneratedToken, setRegeneratedToken] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  /* 상세에는 Overview 탭을 두지 않는다 (CAPSIS-D-73) — 자원 개수·용량·컨트롤
     플레인 상태 같은 「지금 도는 상태」는 대시보드가 전담하고, 상세는 「어떻게
     만들어졌는가」를 맡는다. Rancher가 두 화면을 가르는 방식을 그대로 따랐다.
     상세에 새로 만드는 것은 Conditions 탭 하나다. Aegis/Metis 모드는 무변경(D-26). */
  const { isPlatform } = useContainerMode();
  const showConditionsTab = isPlatform && HAS_CLUSTER_CONDITIONS_TAB;
  const activeTab = searchParams.get('tab') || 'networking';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Usage assignment (D-30) — the list row action already exists; the detail
  // screen offers the same thing so it lives next to the rest of the cluster.
  const [assignedUsage, setAssignedUsage] = useState<ClusterUsage | undefined>(undefined);
  const [isAssignUsageOpen, setIsAssignUsageOpen] = useState(false);
  const [pendingUsage, setPendingUsage] = useState<ClusterUsage>('General');
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  const [updateChannel, setUpdateChannel] = useState('stable-1.34');
  const [pendingChannel, setPendingChannel] = useState('stable-1.34');
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const computeTokenDates = (expiration: string) => {
    const now = new Date();
    const dateOnly: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const dateTime: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    const isHours = ['1h', '6h', '24h'].includes(expiration);
    const created = now.toLocaleDateString('en-US', isHours ? dateTime : dateOnly);
    const durationMs: Record<string, number> = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };
    const expiresDate = new Date(now.getTime() + (durationMs[expiration] || 0));
    const expires = expiresDate.toLocaleDateString('en-US', isHours ? dateTime : dateOnly);
    setTokenCreatedAt(created);
    setTokenExpiresAt(expires);
  };
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
    iconText: '',
  };

  const [clusterIconText, setClusterIconText] = useState(clusterData.iconText || '');

  useEffect(() => {
    const handler = (e: Event) => {
      const { clusterId, iconText } = (e as CustomEvent<{ clusterId: string; iconText: string }>)
        .detail;
      if (clusterId === clusterData.id) {
        setClusterIconText(iconText);
      }
    };
    window.addEventListener('cluster-appearance-changed', handler);
    return () => window.removeEventListener('cluster-appearance-changed', handler);
  }, [clusterData.id]);

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

  /* Overview tab data (D-34). Inline mock — reachableVersions is what the
     channel exposes above the current version; an empty list means "latest"
     and the screen says so instead of just disabling the button ([CCONT-03]). */
  /* Conditions 탭 목업 (CAPSIS-D-73). 어떤 조건이 오는지는 아직 확인되지 않아
     Rancher의 칼럼 구성만 따랐다 — 화면 정의서 §GAP. */
  const clusterConditions: ClusterCondition[] = [
    { type: 'Ready', status: 'True', updatedAt: '2026-08-19 09:12' },
    { type: 'Provisioned', status: 'True', updatedAt: '2026-05-02 14:31' },
    { type: 'Updated', status: 'True', updatedAt: '2026-08-11 03:20' },
    {
      type: 'AgentDeployed',
      status: 'Unknown',
      updatedAt: '2026-08-19 09:12',
      message: '용도를 지정하면 에이전트를 설치하고 이 값이 채워집니다.',
    },
  ];

  const overviewData: ClusterOverviewData = {
    version: clusterData.kubernetesVersion,
    reachableVersions: isProvisioned ? ['v1.34.5'] : [],
    channel: updateChannel,
    status: clusterData.status,
    usage: assignedUsage,
    controlPlaneHealthy: isProvisioned,
    nodesReady: isProvisioned ? 4 : 0,
    nodesTotal: 4,
    agentHealthy: true,
    inventory: {
      nodes: 4,
      namespaces: 12,
      workloads: 37,
      persistentVolumeClaims: 8,
    },
    ongoingActivity: isProvisioning
      ? 'Control plane initializing'
      : isUpdating
        ? 'Updating cluster'
        : isDeleting
          ? 'Removing cluster resources'
          : undefined,
    recentEvents: [
      { at: '11:24', message: 'Node worker-03 became Ready' },
      { at: '11:18', message: 'Pulled image "registry.thakicloud.io/agent:1.4.0"' },
      { at: '10:52', message: 'Scaled deployment nginx-ingress to 3 replicas' },
      { at: '10:31', message: 'Namespace tkai-metis created' },
    ],
  };

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
              <InfoBox
                label="Status"
                className="flex-1"
                accessory={
                  isProvisioning || isDeleting || isUpdating ? (
                    <IconLoader2
                      size={16}
                      stroke={1.5}
                      className={`animate-spin ${
                        isDeleting
                          ? 'text-[var(--color-text-muted)]'
                          : 'text-[var(--color-action-primary)]'
                      }`}
                    />
                  ) : undefined
                }
              >
                <div className="flex items-center gap-2 min-w-0">
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
                    <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                      Control plane initializing
                    </span>
                  )}
                  {isDeleting && (
                    <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                      Removing cluster resources
                    </span>
                  )}
                  {isUpdating && (
                    <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
                      Updating cluster
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
              {/* 용도 지정 진입점 — CAPSIS-D-30. 대시보드를 어디에 두든(안건 A)
                  이 진입점은 클러스터 상세에 있어야 하므로 탭 바깥 헤더에 둔다. */}
              {isPlatform && (
                <DetailHeader.InfoCard
                  label="Usage"
                  value={
                    overviewData.usage ? (
                      <Badge
                        theme={
                          overviewData.usage === 'Metis'
                            ? 'yellow'
                            : overviewData.usage === 'Maxis'
                              ? 'green'
                              : 'blue'
                        }
                        type="subtle"
                        size="sm"
                      >
                        {overviewData.usage}
                      </Badge>
                    ) : (
                      <HStack gap={2} className="items-center">
                        <Badge theme="gray" type="subtle" size="sm">
                          Unassigned
                        </Badge>
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => {
                            setPendingUsage('General');
                            setIsAssignUsageOpen(true);
                          }}
                        >
                          Assign usage
                        </Button>
                      </HStack>
                    )
                  }
                />
              )}
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
            <Tab value="service-account-token">Access token</Tab>
            {showConditionsTab && <Tab value="conditions">Conditions</Tab>}
          </TabList>

          <TabPanel value="conditions">
            <ClusterConditionsTab conditions={clusterConditions} />
          </TabPanel>

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

          <TabPanel value="service-account-token">
            <VStack gap={4}>
              <div className="flex items-center justify-between w-full p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                    {clusterIconText ? (
                      <span className="text-body-sm font-semibold text-[var(--color-text-default)] uppercase">
                        {clusterIconText}
                      </span>
                    ) : (
                      <IconAffiliate
                        size={16}
                        stroke={1.5}
                        className="text-[var(--color-text-muted)]"
                      />
                    )}
                  </div>
                  {hasToken ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-label-sm text-[var(--color-text-default)]">
                        {clusterData.name}
                      </span>
                      <span className="text-body-sm text-[var(--color-text-subtle)]">
                        Created on: {tokenCreatedAt} | Expires on: {tokenExpiresAt}
                      </span>
                    </div>
                  ) : (
                    <span className="text-label-sm text-[var(--color-text-default)]">
                      {clusterData.name}
                    </span>
                  )}
                </div>
                {hasToken ? (
                  <div className="flex items-center gap-2">
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
                      onClick={() => {
                        setTokenExpiration('24h');
                        setRegeneratedToken(null);
                        setIsRegenerateTokenOpen(true);
                      }}
                    >
                      Regenerate token
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconCirclePlus size={12} />}
                    onClick={() => {
                      setTokenExpiration('24h');
                      setGeneratedToken(null);
                      setIsGenerateTokenOpen(true);
                    }}
                  >
                    Generate new token
                  </Button>
                )}
              </div>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      <ConfirmModal
        isOpen={isDeleteTokenOpen}
        onClose={() => setIsDeleteTokenOpen(false)}
        onConfirm={() => {
          console.log('Delete access token');
          setHasToken(false);
          setIsDeleteTokenOpen(false);
        }}
        title="Delete token"
        description="Any kubectl sessions or scripts using this token will lose access immediately."
        infoLabel="Cluster"
        infoValue={clusterData.name}
        confirmText="Delete"
        confirmVariant="danger"
      />

      <Modal
        isOpen={isGenerateTokenOpen}
        onClose={() => {
          if (generatedToken) setHasToken(true);
          setIsGenerateTokenOpen(false);
          setGeneratedToken(null);
        }}
        title="Generate new token"
        size="sm"
      >
        {generatedToken ? (
          <>
            <VStack gap={2}>
              <InfoBox label="Cluster" value={clusterData.name} />
              <InlineMessage variant="warning">
                Make sure to copy your token now as you will not be able to see it again.
              </InlineMessage>
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] w-full">
                <span className="flex-1 min-w-0 truncate font-mono text-body-sm text-[var(--color-text-default)]">
                  {generatedToken}
                </span>
                <CopyButton value={generatedToken} size="sm" variant="ghost" iconOnly />
              </div>
            </VStack>

            <Button
              variant="secondary"
              onClick={() => {
                setHasToken(true);
                setIsGenerateTokenOpen(false);
                setGeneratedToken(null);
              }}
              className="w-full"
            >
              Close
            </Button>
          </>
        ) : (
          <>
            <VStack gap={2}>
              <InfoBox label="Cluster" value={clusterData.name} />
              <InlineMessage variant="info">
                Generating a new token grants kubectl access to this cluster for the selected
                period.
              </InlineMessage>
            </VStack>

            <FormField
              label="Expiration"
              helperText="Expired tokens cannot be renewed — generate a new token instead."
            >
              <Select
                options={[
                  { value: '1h', label: '1 hour' },
                  { value: '6h', label: '6 hours' },
                  { value: '24h', label: '24 hours (recommended)' },
                  { value: '7d', label: '7 days' },
                  { value: '30d', label: '30 days' },
                ]}
                value={tokenExpiration}
                onChange={(val) => setTokenExpiration(val)}
                fullWidth
              />
            </FormField>

            <HStack gap={2} className="w-full">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsGenerateTokenOpen(false);
                  setGeneratedToken(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  computeTokenDates(tokenExpiration);
                  setGeneratedToken(
                    'tk-demo-token-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.mock-signature'
                  );
                }}
                className="flex-1"
              >
                Generate
              </Button>
            </HStack>
          </>
        )}
      </Modal>

      <Modal
        isOpen={isRegenerateTokenOpen}
        onClose={() => {
          if (regeneratedToken) setHasToken(true);
          setIsRegenerateTokenOpen(false);
          setRegeneratedToken(null);
        }}
        title="Regenerate token"
        size="sm"
      >
        {regeneratedToken ? (
          <>
            <VStack gap={2}>
              <InfoBox label="Cluster" value={clusterData.name} />
              <InlineMessage variant="warning">
                Make sure to copy your token now as you will not be able to see it again.
              </InlineMessage>
              <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] w-full">
                <span className="flex-1 min-w-0 truncate font-mono text-body-sm text-[var(--color-text-default)]">
                  {regeneratedToken}
                </span>
                <CopyButton value={regeneratedToken} size="sm" variant="ghost" iconOnly />
              </div>
            </VStack>

            <Button
              variant="secondary"
              onClick={() => {
                setHasToken(true);
                setIsRegenerateTokenOpen(false);
                setRegeneratedToken(null);
              }}
              className="w-full"
            >
              Close
            </Button>
          </>
        ) : (
          <>
            <VStack gap={2}>
              <InfoBox label="Cluster" value={clusterData.name} />
              <InlineMessage variant="warning">
                The existing token will be revoked immediately. Any kubectl sessions using it will
                lose access.
              </InlineMessage>
            </VStack>

            <FormField
              label="Expiration"
              helperText="Expired tokens cannot be renewed — generate a new token instead."
            >
              <Select
                options={[
                  { value: '1h', label: '1 hour' },
                  { value: '6h', label: '6 hours' },
                  { value: '24h', label: '24 hours (recommended)' },
                  { value: '7d', label: '7 days' },
                  { value: '30d', label: '30 days' },
                ]}
                value={tokenExpiration}
                onChange={(val) => setTokenExpiration(val)}
                fullWidth
              />
            </FormField>

            <HStack gap={2} className="w-full">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsRegenerateTokenOpen(false);
                  setRegeneratedToken(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  computeTokenDates(tokenExpiration);
                  setRegeneratedToken(
                    'tk-demo-token-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.regen-signature'
                  );
                }}
                className="flex-1"
              >
                Regenerate
              </Button>
            </HStack>
          </>
        )}
      </Modal>

      {/* ---------- Assign usage (D-30) ---------- */}
      <Modal
        isOpen={isAssignUsageOpen}
        onClose={() => setIsAssignUsageOpen(false)}
        title="Assign usage"
        description="Choose what this cluster is used for. The agent installs and registers the required packages for the selected usage."
      >
        <VStack gap={4}>
          <FormField label="Usage" required>
            <Select
              value={pendingUsage}
              onChange={(value) => setPendingUsage(value as ClusterUsage)}
              options={[
                { value: 'General', label: 'General — general purpose workloads' },
                { value: 'Metis', label: 'Metis — inference and serving' },
                { value: 'Maxis', label: 'Maxis — training' },
              ]}
            />
          </FormField>
          {pendingUsage !== 'General' && (
            <InlineMessage variant="info">
              Dedicated clusters are view and operate only. Resource creation is disabled and
              editing is available through Edit YAML.
            </InlineMessage>
          )}
          <HStack gap={2} className="w-full">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsAssignUsageOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setAssignedUsage(pendingUsage);
                setIsAssignUsageOpen(false);
              }}
            >
              Assign
            </Button>
          </HStack>
        </VStack>
      </Modal>

      {/* ---------- Change update channel ---------- */}
      <Modal
        isOpen={isChannelOpen}
        onClose={() => setIsChannelOpen(false)}
        title="Change update channel"
        description="The channel decides which versions this cluster can move to."
      >
        <VStack gap={4}>
          <FormField label="Update channel" required>
            <Select
              value={pendingChannel}
              onChange={setPendingChannel}
              options={[
                { value: 'stable-1.34', label: 'stable-1.34' },
                { value: 'stable-1.35', label: 'stable-1.35' },
              ]}
            />
          </FormField>
          <HStack gap={2} className="w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsChannelOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setUpdateChannel(pendingChannel);
                setIsChannelOpen(false);
              }}
            >
              Save
            </Button>
          </HStack>
        </VStack>
      </Modal>

      {/* ---------- Update cluster ([CCONT-01]) ---------- */}
      <ConfirmModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        onConfirm={() => setIsUpdateOpen(false)}
        title="Update cluster"
        description={`This cluster will move from ${clusterData.kubernetesVersion} to ${
          overviewData.reachableVersions[overviewData.reachableVersions.length - 1] ?? '-'
        } on the ${updateChannel} channel. Workloads keep running while nodes are updated one at a time.`}
        confirmText="Update"
        cancelText="Cancel"
      />
    </PageShell>
  );
}

export default ClusterDetailPage;
