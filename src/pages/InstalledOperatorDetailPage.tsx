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
  Modal,
  InfoBox,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  type TableColumn,
} from '@/design-system';
import { useParams, useNavigate } from 'react-router-dom';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { IconTrash } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import postgresqlLogo from '@/assets/catalog/postgresql.svg';
import kafkaLogo from '@/assets/catalog/kafka.svg';
import milvusLogo from '@/assets/catalog/milvus.svg';
import nginxLogo from '@/assets/catalog/nginx.svg';
import valkeyLogo from '@/assets/catalog/valkey.svg';

interface OperatorDetail {
  id: string;
  name: string;
  iconSrc: string;
  operatorName: string;
  version: string;
  status: string;
  lastDeployed: string;
}

interface OperatorResource {
  id: string;
  kind: string;
  name: string;
}

interface CRInstance {
  id: string;
  status: string;
  kind: string;
  name: string;
  namespace: string;
}

const operatorsData: Record<string, OperatorDetail> = {
  '1': {
    id: '1',
    name: 'CNPG Operator',
    iconSrc: postgresqlLogo,
    operatorName: 'cnpg-operator',
    version: 'v1.29.0',
    status: 'Deployed',
    lastDeployed: '2026-03-11 14:20',
  },
  '2': {
    id: '2',
    name: 'Strimzi Kafka Operator',
    iconSrc: kafkaLogo,
    operatorName: 'strimzi-cluster-operator',
    version: 'v0.44.0',
    status: 'Pending',
    lastDeployed: '2026-03-10 09:15',
  },
  '3': {
    id: '3',
    name: 'Milvus Operator',
    iconSrc: milvusLogo,
    operatorName: 'milvus-operator',
    version: 'v1.1.2',
    status: 'Deployed',
    lastDeployed: '2026-02-28 16:45',
  },
  '4': {
    id: '4',
    name: 'NGINX Ingress Operator',
    iconSrc: nginxLogo,
    operatorName: 'nginx-ingress-operator',
    version: 'v3.4.0',
    status: 'Deployed',
    lastDeployed: '2026-02-20 11:30',
  },
  '5': {
    id: '5',
    name: 'Valkey Operator',
    iconSrc: valkeyLogo,
    operatorName: 'valkey-operator',
    version: 'v0.8.1',
    status: 'Failed',
    lastDeployed: '2026-04-01 08:00',
  },
};

const operatorResourcesData: Record<string, OperatorResource[]> = {
  '1': [
    { id: 'r1', kind: 'Deployment', name: 'cnpg-operator' },
    { id: 'r2', kind: 'ClusterRole', name: 'cnpg-operator' },
    { id: 'r3', kind: 'CustomResourceDefinition', name: 'clusters.postgresql.cnpg.io' },
  ],
  '2': [
    { id: 'r1', kind: 'Deployment', name: 'strimzi-cluster-operator' },
    { id: 'r2', kind: 'ClusterRole', name: 'strimzi-cluster-operator-global' },
    { id: 'r3', kind: 'CustomResourceDefinition', name: 'kafkas.kafka.strimzi.io' },
    { id: 'r4', kind: 'CustomResourceDefinition', name: 'kafkatopics.kafka.strimzi.io' },
  ],
  '3': [
    { id: 'r1', kind: 'Deployment', name: 'milvus-operator' },
    { id: 'r2', kind: 'CustomResourceDefinition', name: 'milvusclusters.milvus.io' },
  ],
  '4': [
    { id: 'r1', kind: 'Deployment', name: 'nginx-ingress-operator' },
    { id: 'r2', kind: 'ClusterRole', name: 'nginx-ingress-operator' },
  ],
  '5': [
    { id: 'r1', kind: 'Deployment', name: 'valkey-operator' },
    { id: 'r2', kind: 'CustomResourceDefinition', name: 'valkeyclusters.valkey.io' },
  ],
};

const crInstancesData: Record<string, CRInstance[]> = {
  '1': [
    {
      id: 'cr1',
      status: 'Healthy',
      kind: 'Cluster',
      name: 'cnpg-cluster-default',
      namespace: 'default',
    },
    { id: 'cr2', status: 'Failed', kind: 'Cluster', name: 'cnpg-cluster-ai', namespace: 'ai' },
  ],
  '2': [{ id: 'cr1', status: 'Healthy', kind: 'Kafka', name: 'kafka-prod', namespace: 'default' }],
  '3': [],
  '4': [],
  '5': [],
};

export default function InstalledOperatorDetailPage() {
  const { operatorId } = useParams<{ operatorId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [activeTab, setActiveTab] = useState('resources');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const operator = operatorsData[operatorId || '1'];
  const resources = operatorResourcesData[operatorId || '1'] || [];
  const crInstances = crInstancesData[operatorId || '1'] || [];

  const resourceColumns: TableColumn<OperatorResource>[] = [
    {
      key: 'kind',
      header: 'Kind',
      flex: 1,
      minWidth: 200,
    },
    {
      key: 'name',
      header: 'Name',
      flex: 2,
      minWidth: 300,
      render: (_, row) => (
        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">
          {row.name}
        </span>
      ),
    },
  ];

  const crColumns: TableColumn<CRInstance>[] = [
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (_, row) => (
        <Badge theme={getContainerStatusTheme(row.status)} type="subtle" size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'kind',
      header: 'Kind',
      flex: 1,
      minWidth: 150,
    },
    {
      key: 'name',
      header: 'Instance name',
      flex: 2,
      minWidth: 250,
      render: (_, row) => (
        <span className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline">
          {row.name}
        </span>
      ),
    },
    {
      key: 'namespace',
      header: 'Namespace',
      flex: 1,
      minWidth: 150,
    },
  ];

  if (!operator) return null;

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
                { label: 'Cluster1', href: '/container' },
                { label: 'Installed operators', href: '/container/installed-operators' },
                { label: operator.name },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
    >
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-[4px] border border-[var(--color-border-default)]">
                <img src={operator.iconSrc} alt={operator.name} className="w-4 h-4" />
              </div>
              {operator.name}
            </div>
          </DetailHeader.Title>

          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconTrash size={12} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </DetailHeader.Actions>

          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <Badge theme={getContainerStatusTheme(operator.status)} type="subtle" size="sm">
                  {operator.status}
                </Badge>
              }
            />
            <DetailHeader.InfoCard label="Operator" value={operator.operatorName} />
            <DetailHeader.InfoCard label="Version" value={operator.version} />
            <DetailHeader.InfoCard label="Last deployed" value={operator.lastDeployed} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="resources">Resources</Tab>
            <Tab value="cr-instances">CR Instances</Tab>
          </TabList>

          <TabPanel value="resources" className="pt-0">
            <VStack gap={0} className="pt-4">
              <Table<OperatorResource>
                columns={resourceColumns}
                data={resources}
                rowKey="id"
                emptyMessage="No resources found"
              />
            </VStack>
          </TabPanel>

          <TabPanel value="cr-instances" className="pt-0">
            <VStack gap={0} className="pt-4">
              <Table<CRInstance>
                columns={crColumns}
                data={crInstances}
                rowKey="id"
                emptyMessage="No CR instances found"
              />
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete operator"
        description="This will remove the operator and all associated resources. This action cannot be undone."
        size="sm"
      >
        <InfoBox label="Operator" value={operator.name} />
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setIsDeleteOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log('Delete operator', operator.id);
              setIsDeleteOpen(false);
              navigate('/container/installed-operators');
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </PageShell>
  );
}
