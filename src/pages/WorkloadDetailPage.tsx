import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Badge,
  DetailHeader,
  SectionCard,
  Disclosure,
  InlineMessage,
  ContextMenu,
  PageShell,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconPlayerPause,
  IconTrash,
  IconBell,
  IconCopy,
  IconCheck,
  IconTerminal2,
  IconWorld,
  IconNetwork,
  IconChevronDown,
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface WorkloadDetail {
  id: string;
  name: string;
  status: 'running' | 'pending' | 'failed' | 'stopped';
  namespace: string;
  createdAt: string;
  computeType: string;
  memory: string;
  cost: string;
  image: string;
  gpu: string;
  httpServices: {
    status: 'available' | 'error' | 'unavailable';
    url?: string;
    message?: string;
  };
  sshAccess: {
    status: 'available' | 'unavailable' | 'setup-required';
    host?: string;
    port?: string;
    keyPath?: string;
  };
  sshOverTcp: {
    status: 'ready' | 'unavailable';
    command?: string;
  };
  directTcpPorts: {
    status: 'ready' | 'unavailable';
    address?: string;
    targetPort?: string;
  };
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockWorkloadsMap: Record<string, WorkloadDetail> = {
  '1': {
    id: 'presidio-pii-deid-eb9502cc',
    name: 'presidio-pii-deid-eb9502cc',
    status: 'running',
    namespace: 'default',
    createdAt: 'Jan 8, 2025',
    computeType: 'gpu × 1',
    memory: '40960Mi',
    cost: '$0.89/hr',
    image: 'presidio-pii-deid:latest',
    gpu: 'NVIDIA A100 40GB',
    httpServices: {
      status: 'error',
      message: 'Pod is not running',
    },
    sshAccess: {
      status: 'setup-required',
    },
    sshOverTcp: {
      status: 'ready',
      command: 'ssh root@213.173.108.199 -p 16244 -i ~/.ssh/id_ed25519',
    },
    directTcpPorts: {
      status: 'ready',
      address: '213.173.108.199:16244',
      targetPort: ':22',
    },
  },
  '2': {
    id: 'audiocraft-f6c7d9c6',
    name: 'audiocraft-f6c7d9c6',
    status: 'running',
    namespace: 'default',
    createdAt: 'Jan 7, 2025',
    computeType: 'gpu × 1',
    memory: '40960Mi',
    cost: '$0.89/hr',
    image: 'audiocraft:latest',
    gpu: 'NVIDIA A100 40GB',
    httpServices: {
      status: 'available',
      url: 'https://audiocraft-f6c7d9c6.ai-platform.thaki.cloud',
    },
    sshAccess: {
      status: 'available',
      host: '213.173.108.200',
      port: '16245',
      keyPath: '~/.ssh/id_ed25519',
    },
    sshOverTcp: {
      status: 'ready',
      command: 'ssh root@213.173.108.200 -p 16245 -i ~/.ssh/id_ed25519',
    },
    directTcpPorts: {
      status: 'ready',
      address: '213.173.108.200:16245',
      targetPort: ':22',
    },
  },
};

const defaultWorkloadDetail: WorkloadDetail = {
  id: 'unknown',
  name: 'Unknown Workload',
  status: 'stopped',
  namespace: 'default',
  createdAt: '-',
  computeType: '-',
  memory: '-',
  cost: '-',
  image: '-',
  gpu: '-',
  httpServices: { status: 'unavailable' },
  sshAccess: { status: 'unavailable' },
  sshOverTcp: { status: 'unavailable' },
  directTcpPorts: { status: 'unavailable' },
};

/* ----------------------------------------
   Connection Card Component
   ---------------------------------------- */

interface ConnectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'available' | 'ready' | 'error' | 'unavailable' | 'setup-required';
  badge?: React.ReactNode;
  children?: React.ReactNode;
  highlighted?: boolean;
}

function ConnectionCard({
  icon,
  title,
  description,
  status,
  badge,
  children,
  highlighted,
}: ConnectionCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm bg-[var(--color-state-success-bg)] text-[var(--color-state-success)] border border-[var(--color-state-success)]">
            <IconCircleCheck size={16} />
            Available
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm bg-[var(--color-state-success-bg)] text-[var(--color-state-success)] border border-[var(--color-state-success)]">
            <IconCircleCheck size={16} />
            Ready
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm bg-[var(--color-state-danger-bg)] text-[var(--color-state-danger)] border border-[var(--color-state-danger)]">
            <IconAlertCircle size={16} />
            Error
          </span>
        );
      case 'setup-required':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border-default)]">
            <IconCircleCheck size={16} />
            Available
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border-default)]">
            Unavailable
          </span>
        );
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 ${highlighted ? 'border-[var(--color-action-primary)] border-2' : 'border-[var(--color-border-default)]'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3">
          <div className="text-[var(--color-text-muted)] mt-0.5">{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-body-lg text-[var(--color-text-default)]">
                {title}
              </span>
              {badge}
            </div>
            <p className="text-body-md text-[var(--color-text-subtle)] mt-0.5">{description}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Copyable Command Component
   ---------------------------------------- */

interface CopyableCommandProps {
  command: string;
}

function CopyableCommand({ command }: CopyableCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--color-surface-subtle)] rounded-md px-4 py-3 flex items-center justify-between mt-3">
      <code className="text-label-lg text-[var(--color-text-default)] font-mono">{command}</code>
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <IconCheck size={16} stroke={1.5} className="text-[var(--color-state-success)]" />
        ) : (
          <IconCopy size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        )}
      </button>
    </div>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export function WorkloadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'connect';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  // Get workload data based on the ID from URL
  const workload = id ? mockWorkloadsMap[id] || defaultWorkloadDetail : defaultWorkloadDetail;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label to workload name
  useEffect(() => {
    if (workload.name) {
      updateActiveTabLabel(workload.name);
    }
  }, [workload.name, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle tab close - navigate to root
  const handleTabClose = (tabId: string) => {
    // First navigate, then close tab to avoid race condition
    navigate('/');
    // Small delay to ensure navigation starts before tab context updates
    setTimeout(() => {
      closeTab(tabId);
    }, 0);
  };

  // Status mapping
  const getStatusType = () => {
    switch (workload.status) {
      case 'running':
        return 'active' as const;
      case 'pending':
        return 'building' as const;
      case 'failed':
        return 'error' as const;
      default:
        return 'muted' as const;
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={handleTabClose}
          onTabMove={moveTab}
          showWindowControls={true}
          onWindowClose={() => navigate('/')}
        />
      }
      topBar={
        <TopBar
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Pods', href: '/ai-platform/workloads' }, { label: workload.name }]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6} className="min-w-[1176px]">
        {/* Workload Header Card */}
        <DetailHeader>
          <DetailHeader.Title>{workload.name}</DetailHeader.Title>

          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconPlayerPause size={12} />}>
              Stop
            </Button>
            <Button variant="danger" size="sm" leftIcon={<IconTrash size={12} />}>
              Terminate
            </Button>
            <ContextMenu
              items={[
                { id: 'restart', label: 'Restart', onClick: () => console.log('Restart') },
                {
                  id: 'view-logs',
                  label: 'View logs',
                  onClick: () => console.log('View logs'),
                },
                {
                  id: 'view-metrics',
                  label: 'View metrics',
                  onClick: () => console.log('View metrics'),
                },
              ]}
              trigger="click"
            >
              <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                More Actions
              </Button>
            </ContextMenu>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={workload.status.charAt(0).toUpperCase() + workload.status.slice(1)}
              status={getStatusType()}
            />
            <DetailHeader.InfoCard label="ID" value={workload.id} copyable />
            <DetailHeader.InfoCard label="Namespace" value={workload.namespace} />
            <DetailHeader.InfoCard label="Created at" value={workload.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Workload Tabs */}
        <div className="w-full">
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="connect">Connect</Tab>
              <Tab value="details">Details</Tab>
              <Tab value="telemetry">Telemetry</Tab>
              <Tab value="logs">Logs</Tab>
              <Tab value="terminal">Terminal</Tab>
            </TabList>

            {/* Connect Tab Panel */}
            <TabPanel value="connect" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Quick Access Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-body-lg font-semibold text-[var(--color-text-default)]">
                      Quick Access
                    </h3>
                    <Badge variant="default" size="sm">
                      Recommended
                    </Badge>
                  </div>

                  <ConnectionCard
                    icon={<IconWorld size={24} stroke={1.5} />}
                    title="HTTP Services"
                    description="Access your service through web browser"
                    status={workload.httpServices.status}
                    highlighted={true}
                  >
                    {workload.httpServices.status === 'error' && (
                      <div className="flex items-center gap-2 mt-3 text-[var(--color-text-subtle)]">
                        <IconInfoCircle size={16} stroke={1.5} />
                        <span className="text-label-lg">{workload.httpServices.message}</span>
                      </div>
                    )}
                    {workload.httpServices.status === 'available' && workload.httpServices.url && (
                      <div className="mt-3">
                        <a
                          href={workload.httpServices.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-action-primary)] hover:underline text-label-lg"
                        >
                          {workload.httpServices.url}
                        </a>
                      </div>
                    )}
                  </ConnectionCard>
                </div>

                {/* Advanced Connection Options */}
                <Disclosure defaultOpen={true}>
                  <Disclosure.Trigger>
                    <span className="text-body-lg text-[var(--color-text-default)]">
                      Advanced Connection Options
                    </span>
                  </Disclosure.Trigger>
                  <Disclosure.Panel>
                    <VStack gap={4} className="pt-4">
                      {/* SSH Access */}
                      <ConnectionCard
                        icon={<IconTerminal2 size={24} stroke={1.5} />}
                        title="SSH Access"
                        description="Secure shell access for advanced users"
                        status={workload.sshAccess.status}
                        badge={
                          <Badge variant="default" size="sm">
                            Advanced
                          </Badge>
                        }
                      >
                        {workload.sshAccess.status === 'setup-required' && (
                          <>
                            <InlineMessage variant="info" className="mt-3">
                              SSH access requires setting up a secure connection through our bastion
                              host. This process takes 5-10 seconds.
                            </InlineMessage>
                            <Button
                              variant="primary"
                              size="md"
                              className="w-full mt-3"
                              leftIcon={<IconTerminal2 size={16} />}
                            >
                              Set Up SSH Connection
                            </Button>
                          </>
                        )}
                        {workload.sshAccess.status === 'available' && workload.sshAccess.host && (
                          <CopyableCommand
                            command={`ssh root@${workload.sshAccess.host} -p ${workload.sshAccess.port} -i ${workload.sshAccess.keyPath}`}
                          />
                        )}
                      </ConnectionCard>

                      {/* SSH over TCP */}
                      <ConnectionCard
                        icon={<IconNetwork size={24} stroke={1.5} />}
                        title="SSH over TCP"
                        description="Direct TCP connection with SCP & SFTP support"
                        status={workload.sshOverTcp.status}
                        badge={
                          <Badge variant="default" size="sm">
                            Advanced
                          </Badge>
                        }
                      >
                        {workload.sshOverTcp.status === 'ready' && workload.sshOverTcp.command && (
                          <CopyableCommand command={workload.sshOverTcp.command} />
                        )}
                      </ConnectionCard>

                      {/* Direct TCP Ports */}
                      <ConnectionCard
                        icon={<IconNetwork size={24} stroke={1.5} />}
                        title="Direct TCP ports"
                        description="Direct TCP connections to exposed ports"
                        status={workload.directTcpPorts.status}
                        badge={
                          <Badge variant="default" size="sm">
                            Advanced
                          </Badge>
                        }
                      >
                        {workload.directTcpPorts.status === 'ready' &&
                          workload.directTcpPorts.address && (
                            <CopyableCommand
                              command={`${workload.directTcpPorts.address} → ${workload.directTcpPorts.targetPort}`}
                            />
                          )}
                      </ConnectionCard>
                    </VStack>
                  </Disclosure.Panel>
                </Disclosure>
              </VStack>
            </TabPanel>

            {/* Details Tab Panel */}
            <TabPanel value="details" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Basic information */}
                <SectionCard>
                  <SectionCard.Header title="Basic information" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Name" value={workload.name} />
                    <SectionCard.DataRow label="ID" value={workload.id} />
                    <SectionCard.DataRow label="Namespace" value={workload.namespace} />
                    <SectionCard.DataRow
                      label="Status"
                      value={workload.status.charAt(0).toUpperCase() + workload.status.slice(1)}
                    />
                    <SectionCard.DataRow label="Created at" value={workload.createdAt} />
                  </SectionCard.Content>
                </SectionCard>

                {/* Resources */}
                <SectionCard>
                  <SectionCard.Header title="Resources" />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Compute type" value={workload.computeType} />
                    <SectionCard.DataRow label="Memory" value={workload.memory} />
                    <SectionCard.DataRow label="GPU" value={workload.gpu} />
                    <SectionCard.DataRow label="Image" value={workload.image} />
                    <SectionCard.DataRow label="Cost" value={workload.cost} />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Telemetry Tab Panel */}
            <TabPanel value="telemetry" className="pt-0">
              <div className="flex items-center justify-center h-[400px] text-[var(--color-text-muted)] pt-6">
                <p>Telemetry data will be displayed here</p>
              </div>
            </TabPanel>

            {/* Logs Tab Panel */}
            <TabPanel value="logs" className="pt-0">
              <div className="pt-6">
                <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4 font-mono text-body-md text-[var(--color-text-default)] h-[400px] overflow-auto">
                  <pre className="whitespace-pre-wrap">
                    {`[2025-01-08 14:30:00] Starting container...
[2025-01-08 14:30:02] Pulling image presidio-pii-deid:latest
[2025-01-08 14:30:15] Image pulled successfully
[2025-01-08 14:30:16] Creating container...
[2025-01-08 14:30:18] Container created
[2025-01-08 14:30:19] Starting services...
[2025-01-08 14:30:25] GPU initialized: NVIDIA A100 40GB
[2025-01-08 14:30:30] Service ready on port 8080
[2025-01-08 14:30:30] Workload is now running`}
                  </pre>
                </div>
              </div>
            </TabPanel>

            {/* Terminal Tab Panel */}
            <TabPanel value="terminal" className="pt-0">
              <div className="pt-6">
                <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-body-md text-[#d4d4d4] h-[400px] overflow-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#4ec9b0]">root</span>
                    <span className="text-[#d4d4d4]">@</span>
                    <span className="text-[#569cd6]">{workload.name}</span>
                    <span className="text-[#d4d4d4]">:~$</span>
                    <span className="animate-pulse">▊</span>
                  </div>
                  <p className="text-[#808080] text-center mt-20">Click to connect to terminal</p>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>
    </PageShell>
  );
}

export default WorkloadDetailPage;
