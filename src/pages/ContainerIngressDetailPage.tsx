import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  type TableColumn,
  type ContextMenuItem,
  columnMinWidths,
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
  status: 'Active' | 'Pending' | 'Error';
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
    status: 'Active',
    namespace: 'default',
    ingressClass: 'ingressclassName',
    createdAt: '2025-07-25 09:12:20',
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
    status: 'Active',
    namespace: 'kube-system',
    ingressClass: 'traefik',
    createdAt: '2025-11-08 09:30:00',
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
      label: 'Path Type',
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
      label: 'Target Service',
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
      <h3 className="text-heading-h5 text-[var(--color-text-default)]">
        Rules
      </h3>
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
  const { tabs, activeTab, setActiveTab, closeTab } = useTabs();
  const {
    isOpen: isShellOpen,
    shellTabs,
    activeShellTab,
    setActiveShellTab,
    closeShellTab,
    addShellTab,
    closeShell,
  } = useShellPanel();

  useEffect(() => {
    if (ingressId && mockIngressData[ingressId]) {
      setIngress(mockIngressData[ingressId]);
    }
  }, [ingressId]);

  const getStatusType = (status: string): 'active' | 'pending' | 'error' => {
    switch (status) {
      case 'Active':
        return 'active';
      case 'Pending':
        return 'pending';
      case 'Error':
        return 'error';
      default:
        return 'active';
    }
  };

  const moreActionsItems: ContextMenuItem[] = [
    {
      id: 'edit-config',
      label: 'Edit Config',
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
      <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
        <ContainerSidebar />
        <main
          className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
          style={{ left: 'var(--sidebar-width)' }}
        >
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--color-text-subtle)]">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <ContainerSidebar />

      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: 'var(--sidebar-width)' }}
      >
        {/* TabBar */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={setActiveTab}
            onTabClose={closeTab}
          />
        </div>

        {/* TopBar */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          <TopBar>
            <TopBar.Breadcrumb>
              <Breadcrumb
                items={[
                  {
                    label: 'clusterName',
                    onClick: () => navigate('/container'),
                  },
                  {
                    label: 'Ingresses',
                    onClick: () => navigate('/container/ingresses'),
                  },
                  { label: ingress.name },
                ]}
              />
            </TopBar.Breadcrumb>
            <TopBar.Actions>
              <button
                className="p-2 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
                onClick={() => console.log('Search')}
              >
                <IconSearch size={20} stroke={1.5} />
              </button>
              <button
                className="p-2 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors"
                onClick={() =>
                  addShellTab({
                    id: `shell-${Date.now()}`,
                    title: 'Shell',
                    type: 'shell',
                  })
                }
              >
                <IconTerminal2 size={20} stroke={1.5} />
              </button>
              <button className="p-2 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors relative">
                <IconBell size={20} stroke={1.5} />
              </button>
            </TopBar.Actions>
          </TopBar>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <VStack gap={6}>
              {/* Detail Header */}
              <DetailHeader>
                <DetailHeader.Title>Ingress: {ingress.name}</DetailHeader.Title>
                <DetailHeader.Actions>
                  <ContextMenu items={moreActionsItems} trigger="click" align="left">
                    <Button
                      variant="secondary"
                      size="md"
                      rightIcon={<IconChevronDown size={16} stroke={1.5} />}
                    >
                      More Actions
                    </Button>
                  </ContextMenu>
                </DetailHeader.Actions>
                <DetailHeader.InfoGrid>
                  <DetailHeader.InfoCard
                    label="Status"
                    value={ingress.status}
                    status={getStatusType(ingress.status)}
                  />
                  <DetailHeader.InfoCard label="Namespace" value={ingress.namespace} copyable />
                  <DetailHeader.InfoCard label="Ingress Class" value={ingress.ingressClass} />
                  <DetailHeader.InfoCard label="Created At" value={ingress.createdAt} />
                </DetailHeader.InfoGrid>

                {/* Labels & Annotations Cards */}
                <HStack gap={3} className="w-full mt-3">
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <VStack gap={2}>
                      <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                        Labels ({Object.keys(ingress.labels).length})
                      </span>
                      <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                        {Object.entries(ingress.labels)
                          .slice(0, 1)
                          .map(([key, val]) => (
                            <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                          ))}
                        {Object.keys(ingress.labels).length > 1 && (
                          <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                            (+{Object.keys(ingress.labels).length - 1})
                          </span>
                        )}
                      </div>
                    </VStack>
                  </div>
                  <div className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
                    <VStack gap={2}>
                      <span className="text-label-sm text-[var(--color-text-subtle)] leading-4">
                        Annotations ({Object.keys(ingress.annotations).length})
                      </span>
                      <div className="flex flex-wrap items-center gap-1 min-w-0 w-full">
                        {Object.entries(ingress.annotations)
                          .slice(0, 1)
                          .map(([key, val]) => (
                            <Chip key={key} value={`${key}: ${val}`} maxWidth="100%" />
                          ))}
                        {Object.keys(ingress.annotations).length > 1 && (
                          <span className="text-body-sm text-[var(--color-text-default)] cursor-pointer hover:underline">
                            (+{Object.keys(ingress.annotations).length - 1})
                          </span>
                        )}
                      </div>
                    </VStack>
                  </div>
                </HStack>
              </DetailHeader>

              {/* Tabs */}
              <Tabs defaultValue="rules">
                <TabList>
                  <Tab value="rules">Rules</Tab>
                </TabList>
                <TabPanel value="rules">
                  <RulesTab rules={mockRulesData} />
                </TabPanel>
              </Tabs>
            </VStack>
          </div>
        </div>

        {/* Shell Panel */}
        {isShellOpen && (
          <ShellPanel
            tabs={shellTabs}
            activeTab={activeShellTab}
            onTabChange={setActiveShellTab}
            onTabClose={closeShellTab}
            onClose={closeShell}
          />
        )}
      </main>
    </div>
  );
}
