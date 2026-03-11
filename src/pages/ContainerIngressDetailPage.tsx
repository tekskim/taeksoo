import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Pagination,
  Button,
  ContextMenu,
  DetailHeader,
  Badge,
  Tooltip,
  PageShell,
  type TableColumn,
  type ContextMenuItem,
  columnMinWidths,
  Popover,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ShellPanel, useShellPanel } from '@/components/ShellPanel';
import { useTabs } from '@/contexts/TabContext';
import { IconBell, IconTerminal2, IconSearch, IconChevronDown } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface IngressData {
  id: string;
  name: string;
  status: string;
  namespace: string;
  ingressClass: string;
  createdAt: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

interface RuleRow {
  id: string;
  pathType: string;
  path: string;
  targetService: string;
  port: number;
  certificates: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockIngressData: Record<string, IngressData> = {
  '1': {
    id: '1',
    name: 'ingressName',
    status: 'OK',
    namespace: 'default',
    ingressClass: 'ingressclassName',
    createdAt: 'Jul 25, 2025',
    labels: {
      'app.kubernetes.io/managed-by': 'Helm',
      'cluster.x-k8s.io/provider': 'cluster-api',
      'control-plane': 'controller-manager',
    },
    annotations: {
      'deployment.kubernetes.io/revision': '1',
      'meta.helm.sh/release-name': 'thakicloud-provisioning-capi',
      'meta.helm.sh/release-namespace': 'cattle-provisioning-capi-system',
    },
  },
  '2': {
    id: '2',
    name: 'api-ingress',
    status: 'True',
    namespace: 'kube-system',
    ingressClass: 'traefik',
    createdAt: 'Nov 8, 2025',
    labels: {
      'app.kubernetes.io/name': 'traefik',
    },
    annotations: {
      'kubernetes.io/ingress.class': 'traefik',
    },
  },
};

const mockRulesData: RuleRow[] = [
  {
    id: '1',
    pathType: 'ImplementationSpecific',
    path: 'https://thakicloud.thakicloud.net/',
    targetService: 'serviceName',
    port: 80,
    certificates: 'tls-thakicloud-ingress',
  },
];

/* ----------------------------------------
   Rules Tab Component
   ---------------------------------------- */

interface RulesTabProps {
  rules: RuleRow[];
}

function RulesTab({ rules }: RulesTabProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const columns: TableColumn<RuleRow>[] = [
    {
      key: 'pathType',
      label: 'Path type',
      flex: 1,
      minWidth: columnMinWidths.pathType,
      sortable: true,
    },
    {
      key: 'path',
      label: 'Path',
      flex: 1,
      minWidth: columnMinWidths.path,
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
    {
      key: 'targetService',
      label: 'Target service',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
    {
      key: 'port',
      label: 'Port',
      flex: 1,
      sortable: true,
    },
    {
      key: 'certificates',
      label: 'Certificates',
      flex: 1,
      sortable: true,
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">Rules</h3>
      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={rules.length}
      />
      <Table columns={columns} data={rules} rowKey="id" />
    </VStack>
  );
}

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export function ContainerIngressDetailPage() {
  const { ingressId } = useParams<{ ingressId: string }>();
  const navigate = useNavigate();
  const [ingress, setIngress] = useState<IngressData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'rules';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const shellPanel = useShellPanel();

  useEffect(() => {
    if (ingressId && mockIngressData[ingressId]) {
      setIngress(mockIngressData[ingressId]);
    }
  }, [ingressId]);

  // Update tab label
  useEffect(() => {
    if (ingress) {
      updateActiveTabLabel(`Ingress: ${ingress.name}`);
    }
  }, [updateActiveTabLabel, ingress]);

  // Sidebar width calculation
  const sidebarWidth = sidebarOpen ? 240 : 40;

  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  const getStatusType = (status: string): 'active' | 'building' | 'error' => {
    switch (status) {
      case 'Active':
        return 'active';
      case 'Pending':
        return 'building';
      case 'Error':
        return 'error';
      default:
        return 'active';
    }
  };

  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit config',
      onClick: () => console.log('Edit Config'),
    },
    {
      id: 'edit-yaml',
      label: 'Edit YAML',
      onClick: () => ingressId && navigate(`/container/ingresses/${ingressId}/edit-yaml`),
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

  if (!ingress) {
    return (
      <PageShell
        sidebar={
          <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        }
        sidebarWidth={sidebarWidth}
        contentClassName="flex items-center justify-center"
      >
        <p className="text-[var(--color-text-subtle)]">Loading...</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabReorder={moveTab}
          onTabAdd={addNewTab}
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
                { label: 'clusterName', href: '/container' },
                { label: 'Ingresses', href: '/container/ingresses' },
                { label: ingress.name },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconTerminal2 size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
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
          onOpenInNewTab={(tab) => console.log('Open in new tab:', tab)}
          initialHeight={350}
          sidebarWidth={sidebarWidth}
        />
      }
      bottomPanelPadding={shellPanel.isExpanded ? 'var(--shell-panel-height)' : '0'}
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={6}>
        {/* Detail Header */}
        <DetailHeader>
          <DetailHeader.Title>Ingress: {ingress.name}</DetailHeader.Title>
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
                <Tooltip content={ingress.status}>
                  <span className="max-w-[80px] truncate">
                    <Badge theme="white" size="sm">
                      {ingress.status}
                    </Badge>
                  </span>
                </Tooltip>
              }
            />
            <DetailHeader.InfoCard label="Namespace" value={ingress.namespace} copyable />
            <DetailHeader.InfoCard label="Ingress class" value={ingress.ingressClass} />
            <DetailHeader.InfoCard label="Created at" value={ingress.createdAt} />
          </DetailHeader.InfoGrid>

          {/* Labels & Annotations Cards */}
          <HStack gap={3} className="w-full mt-3">
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                  Labels ({Object.keys(ingress.labels).length})
                </span>
                <div className="flex items-center gap-1 min-w-0 w-full">
                  {Object.entries(ingress.labels)
                    .slice(0, 1)
                    .map(([key, val]) => (
                      <Badge
                        key={key}
                        theme="white"
                        size="sm"
                        className="min-w-0 truncate justify-start text-left"
                      >
                        {`${key}: ${val}`}
                      </Badge>
                    ))}
                  {Object.keys(ingress.labels).length > 1 && (
                    <Popover
                      trigger="hover"
                      position="bottom"
                      delay={100}
                      hideDelay={100}
                      content={
                        <div className="p-3 min-w-[120px] max-w-[320px]">
                          <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                            All labels ({Object.keys(ingress.labels).length})
                          </div>
                          <div className="flex flex-col gap-1">
                            {Object.entries(ingress.labels).map(([k, v]) => (
                              <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                                <span className="break-all">{`${k}: ${v}`}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                        (+{Object.keys(ingress.labels).length - 1})
                      </span>
                    </Popover>
                  )}
                </div>
              </VStack>
            </div>
            <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <VStack gap={2}>
                <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                  Annotations ({Object.keys(ingress.annotations).length})
                </span>
                <div className="flex items-center gap-1 min-w-0 w-full">
                  {Object.entries(ingress.annotations)
                    .slice(0, 1)
                    .map(([key, val]) => (
                      <Badge
                        key={key}
                        theme="white"
                        size="sm"
                        className="min-w-0 truncate justify-start text-left"
                      >
                        {`${key}: ${val}`}
                      </Badge>
                    ))}
                  {Object.keys(ingress.annotations).length > 1 && (
                    <Popover
                      trigger="hover"
                      position="bottom"
                      delay={100}
                      hideDelay={100}
                      content={
                        <div className="p-3 min-w-[120px] max-w-[320px]">
                          <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                            All annotations ({Object.keys(ingress.annotations).length})
                          </div>
                          <div className="flex flex-col gap-1">
                            {Object.entries(ingress.annotations).map(([k, v]) => (
                              <Badge key={k} theme="white" size="sm" className="w-fit max-w-full">
                                <span className="break-all">{`${k}: ${v}`}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      }
                    >
                      <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                        (+{Object.keys(ingress.annotations).length - 1})
                      </span>
                    </Popover>
                  )}
                </div>
              </VStack>
            </div>
          </HStack>
        </DetailHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="rules">Rules</Tab>
          </TabList>
          <TabPanel value="rules">
            <RulesTab rules={mockRulesData} />
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}
