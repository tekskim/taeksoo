import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  ContextMenu,
  DetailHeader,
  Badge,
  Tooltip,
  PageShell,
  ErrorState,
  InlineMessage,
  Table,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { ShellPanel, useShellPanel, type ShellTab } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { IconAlertTriangle, IconChevronDown } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import { findNetworkById, type UserDefinedNetworkRow } from './containerUserDefinedNetworksData';

/* ----------------------------------------
   UserDefinedNetwork 상세.

   OVN-Kubernetes를 CNI로 쓸 때만 존재하는 리소스다.
   ---------------------------------------- */

function networkYaml(n: UserDefinedNetworkRow): string {
  const kind = n.scope === 'Cluster' ? 'ClusterUserDefinedNetwork' : 'UserDefinedNetwork';
  const topologyKey = n.topology === 'Layer2' ? 'layer2' : 'layer3';
  return `apiVersion: k8s.ovn.org/v1
kind: ${kind}
metadata:
  name: ${n.name}${n.scope === 'Cluster' ? '' : `\n  namespace: ${n.namespace}`}
spec:
  topology: ${n.topology}
  ${topologyKey}:
    role: ${n.role}
    mtu: ${n.mtu}
    subnets:
      - ${n.subnets}${n.joinSubnets ? `\n    joinSubnets:\n      - ${n.joinSubnets}` : ''}
    ipam:
      lifecycle: Persistent`;
}

interface AttachedPod {
  name: string;
  namespace: string;
  ip: string;
  status: string;
}

export function ContainerUserDefinedNetworkDetailPage() {
  const { networkId } = useParams<{ networkId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    tabs,
    activeTabId,
    selectTab,
    closeTab,
    addNewTab,
    moveTab,
    addTab,
    updateActiveTabLabel,
  } = useTabs();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const shellPanel = useShellPanel();
  const network = findNetworkById(networkId);

  useEffect(() => {
    if (network) updateActiveTabLabel(network.name);
  }, [updateActiveTabLabel, network]);

  const handleOpenInNewTab = (tab: ShellTab) => {
    const tabId = `console-${tab.instanceId}-${Date.now()}`;
    addTab({
      id: tabId,
      label: tab.title,
      path: `/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`,
      closable: true,
    });
    navigate(`/container/console/${tab.instanceId}?name=${encodeURIComponent(tab.title)}`);
  };

  const sidebarWidth = sidebarOpen ? 248 : 48;

  const shell = (children: React.ReactNode, crumbLabel: string) => (
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
                { label: 'User Defined Networks', href: '/container/user-defined-networks' },
                { label: crumbLabel },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      bottomPanel={
        <ShellPanel
          isExpanded={shellPanel.isExpanded}
          onExpandedChange={shellPanel.setIsExpanded}
          tabs={shellPanel.tabs}
          activeTabId={shellPanel.activeTabId}
          onActiveTabChange={shellPanel.setActiveTabId}
          onCloseTab={shellPanel.closeTab}
          onContentChange={shellPanel.updateContent}
          onClear={shellPanel.clearContent}
          onOpenInNewTab={handleOpenInNewTab}
          initialHeight={350}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20"
    >
      {children}
    </PageShell>
  );

  if (!network) {
    return shell(
      <ErrorState
        icon={<IconAlertTriangle size={16} strokeWidth={1.5} />}
        title="Network not found"
        description={`The network "${networkId ?? ''}" does not exist or has been deleted.`}
        action={
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/container/user-defined-networks')}
          >
            Back to User Defined Networks
          </Button>
        }
      />,
      networkId ?? 'Network'
    );
  }

  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () =>
        navigate(`/container/user-defined-networks/${encodeURIComponent(network.name)}/edit-yaml`),
    },
    {
      id: 'download-yaml',
      label: 'Download YAML',
      onClick: () => console.log('Download YAML'),
    },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => console.log('Delete'),
    },
  ];

  const podColumns: TableColumn<AttachedPod>[] = [
    {
      key: 'name',
      label: 'Pod',
      flex: 1,
      minWidth: 240,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: 140,
      render: (value: string) => (
        <span className="truncate block min-w-0" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'ip',
      label: 'IP on this network',
      flex: 1,
      minWidth: 160,
      render: (value: string) => (
        <span className="truncate block min-w-0 font-mono text-[12px]" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      flex: 1,
      minWidth: 120,
      render: (value: string) => (
        <Badge theme={getContainerStatusTheme(value)} type="subtle" size="sm">
          {value}
        </Badge>
      ),
    },
  ];

  return shell(
    <VStack gap={6}>
      <DetailHeader>
        <DetailHeader.Title>User Defined Network: {network.name}</DetailHeader.Title>
        <DetailHeader.Actions>
          <ContextMenu items={moreActionsItems} trigger="click" align="right">
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<IconChevronDown size={12} stroke={1.5} />}
            >
              More actions
            </Button>
          </ContextMenu>
        </DetailHeader.Actions>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard
            label="Status"
            value={
              <Tooltip content={network.status}>
                <span className="max-w-[100px] truncate">
                  <Badge theme={getContainerStatusTheme(network.status)} type="subtle" size="sm">
                    {network.status}
                  </Badge>
                </span>
              </Tooltip>
            }
          />
          <DetailHeader.InfoCard label="Namespace" value={network.namespace} />
          <DetailHeader.InfoCard
            label="Scope"
            value={
              <Badge
                theme={network.scope === 'Cluster' ? 'yellow' : 'gray'}
                type="subtle"
                size="sm"
              >
                {network.scope}
              </Badge>
            }
          />
          <DetailHeader.InfoCard
            label="Role"
            value={
              <Badge theme={network.role === 'Primary' ? 'blue' : 'gray'} type="subtle" size="sm">
                {network.role}
              </Badge>
            }
          />
          <DetailHeader.InfoCard label="Topology" value={network.topology} />
          <DetailHeader.InfoCard label="Subnets" value={network.subnets} />
          <DetailHeader.InfoCard label="Created at" value={network.createdAt} />
        </DetailHeader.InfoGrid>
      </DetailHeader>

      <Tabs value={activeTab} onChange={setActiveTab} size="sm">
        <TabList>
          <Tab value="details">Details</Tab>
          <Tab value="pods">Attached pods ({network.attachedPods.length})</Tab>
          <Tab value="yaml">YAML</Tab>
        </TabList>

        <TabPanel value="details">
          <VStack gap={4}>
            {network.role === 'Primary' && (
              <InlineMessage variant="info">
                This is the <strong>primary</strong> network of the namespace — it replaces the
                default pod network. A primary network must exist before any pod is created in the
                namespace, so it cannot be added to a namespace that is already running workloads.
              </InlineMessage>
            )}

            {network.status === 'Failed' && (
              <InlineMessage variant="warning">
                This network failed to be created. Pods referencing it will stay pending. Check
                whether the subnet overlaps with an existing network.
              </InlineMessage>
            )}

            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
              <VStack gap={3}>
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Topology
                </h3>
                <DetailRow label="Type" value={network.topology} />
                <DetailRow
                  label="Behaviour"
                  value={
                    network.topology === 'Layer2'
                      ? 'One flat network across all nodes. A VM keeps its IP when it moves to another node.'
                      : 'Each node gets its own slice of the subnet and traffic is routed between them.'
                  }
                />
                <DetailRow label="MTU" value={String(network.mtu)} />
              </VStack>
            </div>

            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
              <VStack gap={3}>
                <h3 className="text-heading-h5 leading-[24px] text-[var(--color-text-default)]">
                  Addressing
                </h3>
                <DetailRow label="Subnets" value={network.subnets} />
                {network.joinSubnets && (
                  <DetailRow label="Join subnets" value={network.joinSubnets} />
                )}
                <DetailRow label="IPAM lifecycle" value="Persistent" />
                <DetailRow label="Scope" value={network.scope} />
                <DetailRow label="Role" value={network.role} />
              </VStack>
            </div>
          </VStack>
        </TabPanel>

        <TabPanel value="pods">
          <VStack gap={3}>
            <Table<AttachedPod>
              columns={podColumns}
              data={network.attachedPods}
              rowKey="name"
              emptyMessage="No pods are attached to this network yet"
            />
          </VStack>
        </TabPanel>

        <TabPanel value="yaml">
          <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
            <pre className="text-body-sm font-mono whitespace-pre-wrap text-[var(--color-text-default)] overflow-x-auto">
              {networkYaml(network)}
            </pre>
          </div>
        </TabPanel>
      </Tabs>
    </VStack>,
    network.name
  );
}

/* ----------------------------------------
   Row
   ---------------------------------------- */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack gap={4} className="w-full" align="start">
      <span className="text-body-md text-[var(--color-text-subtle)] w-[220px] shrink-0">
        {label}
      </span>
      <span className="text-body-md text-[var(--color-text-default)] min-w-0 break-all">
        {value}
      </span>
    </HStack>
  );
}

export default ContainerUserDefinedNetworkDetailPage;
