import { useState } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  DetailHeader,
  Badge,
  Button,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  type TableColumn,
  columnMinWidths,
} from '@/design-system';
import { useParams } from 'react-router-dom';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconTerminal2, IconEdit, IconTrash, IconCopy, IconDownload } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';

function TopBarActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
      aria-label={label}
    >
      <span className="text-[var(--color-text-muted)]">{icon}</span>
    </button>
  );
}

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface InstalledAppDetail {
  id: string;
  name: string;
  version: string;
  namespace: string;
  status: string;
  chartName: string;
  lastDeployed: string;
}

interface AppResource {
  id: string;
  type: string;
  name: string;
  namespace: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const installedAppsData: Record<string, InstalledAppDetail> = {
  '1': {
    id: '1',
    name: 'postgresql-1',
    version: '16.3.0',
    namespace: 'default',
    status: 'Deployed',
    chartName: 'postgresql',
    lastDeployed: 'Mar 11, 2026 14:20',
  },
  '2': {
    id: '2',
    name: 'kafka',
    version: '08.33',
    namespace: 'data',
    status: 'Deployed',
    chartName: 'kafka',
    lastDeployed: 'Mar 10, 2026 09:15',
  },
  '3': {
    id: '3',
    name: 'valkey',
    version: '80.2',
    namespace: 'cache',
    status: 'Deployed',
    chartName: 'valkey',
    lastDeployed: 'Mar 06, 2026 17:55',
  },
  '4': {
    id: '4',
    name: 'nginx-1',
    version: '4.05',
    namespace: 'ingress-nginx',
    status: 'Deployed',
    chartName: 'nginx',
    lastDeployed: 'Mar 08, 2026 11:09',
  },
  '5': {
    id: '5',
    name: 'milvus',
    version: '4.27',
    namespace: 'ai',
    status: 'Pending',
    chartName: 'milvus',
    lastDeployed: 'Mar 12, 2026 09:00',
  },
  '6': {
    id: '6',
    name: 'postgresql-1',
    version: '16.30',
    namespace: 'ai',
    status: 'Failed',
    chartName: 'postgresql',
    lastDeployed: 'Mar 12, 2026 15:53',
  },
};

const appResourcesData: Record<string, AppResource[]> = {
  '1': [
    { id: 'r1', type: 'StatefulSet', name: 'postgresql', namespace: 'default' },
    { id: 'r2', type: 'Service', name: 'postgresql', namespace: 'default' },
    { id: 'r3', type: 'Secret', name: 'postgresql', namespace: 'default' },
    {
      id: 'r4',
      type: 'PersistentVolumeClaim',
      name: 'data-postgresql-0',
      namespace: 'default',
    },
    { id: 'r5', type: 'ConfigMap', name: 'postgresql-configuration', namespace: 'default' },
  ],
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function InstalledAppDetailPage() {
  const { appId } = useParams<{ appId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [activeTab, setActiveTab] = useState('resources');

  const app = installedAppsData[appId || '1'];
  const resources = appResourcesData[appId || '1'] || [];

  const valuesYaml = `auth:
  postgresPassword: "change-me"
  username: "appuser"
  password: "change-me"
  database: "appdb"

primary:
  persistence:
    enabled: true
    size: 20Gi
    storageClass: "longhorn"

  resources:
    requests:
      cpu: "250m"
      memory: "512Mi"
    limits:
      cpu: "1"
      memory: "2Gi"
`;

  const resourceColumns: TableColumn<AppResource>[] = [
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      flex: 2,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (value) => (
        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">
          {value}
        </span>
      ),
    },
    {
      key: 'namespace',
      label: 'Namespace',
      flex: 1,
      minWidth: columnMinWidths.namespace,
      sortable: true,
    },
  ];

  if (!app) return null;

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
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/catalog' },
                { label: 'Installed Apps', href: '/container/installed-apps' },
                { label: app.name },
              ]}
            />
          }
          actions={
            <>
              <TopBarActionButton icon={<IconTerminal2 size={16} stroke={1.5} />} label="Console" />
            </>
          }
        />
      }
    >
      <VStack gap={4}>
        <DetailHeader>
          <DetailHeader.Title>{app.name}</DetailHeader.Title>

          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
              Delete
            </Button>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <Badge theme={getContainerStatusTheme(app.status)} type="subtle" size="sm">
                  {app.status}
                </Badge>
              }
            />
            <DetailHeader.InfoCard label="App name" value={app.name} />
            <DetailHeader.InfoCard label="Chart name" value={app.chartName} />
            <DetailHeader.InfoCard label="Version" value={app.version} />
            <DetailHeader.InfoCard label="Namespace" value={app.namespace} />
            <DetailHeader.InfoCard label="Last deployed" value={app.lastDeployed} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="resources">Resources</Tab>
            <Tab value="values">Values.yaml</Tab>
          </TabList>

          <TabPanel value="resources" className="pt-0">
            <VStack gap={0} className="pt-4">
              <Table
                columns={resourceColumns}
                data={resources}
                rowKey="id"
                emptyMessage="No resources found"
              />
            </VStack>
          </TabPanel>

          <TabPanel value="values" className="pt-0">
            <VStack gap={3} className="pt-4">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<IconCopy size={12} />}
                  onClick={() => navigator.clipboard.writeText(valuesYaml)}
                >
                  Copy
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconDownload size={12} />}>
                  Download
                </Button>
              </div>
              <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden p-2">
                <div className="overflow-auto bg-[var(--color-surface-default)]">
                  <table className="w-full border-collapse">
                    <tbody>
                      {valuesYaml.split('\n').map((line, i) => (
                        <tr key={i} className="leading-[20px]">
                          <td className="px-3 py-0 text-right select-none text-body-sm text-[var(--color-text-disabled)] font-mono w-[1%] whitespace-nowrap align-top">
                            {i + 1}
                          </td>
                          <td className="px-3 py-0 text-body-sm text-[var(--color-text-default)] font-mono whitespace-pre">
                            {line || '\u00A0'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}
