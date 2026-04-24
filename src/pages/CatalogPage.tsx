import { useState } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  SearchInput,
  Button,
  Tabs,
  TabList,
  Tab,
  EmptyState,
  TabPanel,
  CatalogCard,
} from '@/design-system';
import { IconSearch } from '@tabler/icons-react';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import postgresqlLogo from '@/assets/catalog/postgresql.svg';
import valkeyLogo from '@/assets/catalog/valkey.svg';
import kafkaLogo from '@/assets/catalog/kafka.svg';
import nginxLogo from '@/assets/catalog/nginx.svg';
import milvusLogo from '@/assets/catalog/milvus.svg';
import giteaLogo from '@/assets/catalog/gitea.svg';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type AppCategory =
  | 'All'
  | 'Database'
  | 'Data processing'
  | 'Networking'
  | 'Vector DB'
  | 'Developer tools';
type OperatorCategory = 'All' | 'Database';

interface CatalogApp {
  id: string;
  name: string;
  version: string;
  description: string;
  category: AppCategory;
  iconSrc: string;
  installed: boolean;
  deployType: 'Helm' | 'Operator-managed' | 'Operator';
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const catalogApps: CatalogApp[] = [
  {
    id: 'valkey',
    name: 'Valkey',
    version: 'v8.1',
    description:
      'Valkey is an open source, high performance key/value database that supports a variety of workloads such as caching, message queues, and can act as a primary database.',
    category: 'Database',
    iconSrc: valkeyLogo,
    installed: false,
    deployType: 'Helm',
  },
  {
    id: 'cnpg',
    name: 'CNPG',
    version: 'v1.29.0',
    description:
      'PostgreSQL cluster instance managed by CloudNativePG Operator. Requires CNPG Operator to be installed first. Supports HA, PgBouncer pooling, and automated backups.',
    category: 'Database',
    iconSrc: postgresqlLogo,
    installed: false,
    deployType: 'Operator-managed',
  },
  {
    id: 'gitea',
    name: 'Gitea',
    version: 'v10.6.0',
    description:
      'Gitea is a lightweight self-hosted Git service. Includes embedded PostgreSQL-HA and Valkey-Cluster. No external dependencies required.',
    category: 'Developer tools',
    iconSrc: giteaLogo,
    installed: false,
    deployType: 'Helm',
  },
  {
    id: 'nginx',
    name: 'Nginx',
    version: 'v4.11.0',
    description:
      'NGINX Ingress Controller for Kubernetes – routes external HTTP/HTTPS traffic into cluster services using Ingress resources. Multiple instances are allowed per namespace.',
    category: 'Networking',
    iconSrc: nginxLogo,
    installed: false,
    deployType: 'Helm',
  },
  {
    id: 'kafka',
    name: 'Kafka',
    version: '',
    description:
      'Apache Kafka is an open-source distributed event streaming platform used for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.',
    category: 'Data processing',
    iconSrc: kafkaLogo,
    installed: false,
    deployType: 'Operator-managed',
  },
  {
    id: 'milvus',
    name: 'Milvus',
    version: 'v4.2.7',
    description:
      'Milvus is an open-source vector database built to power embedding similarity search and AI applications. It supports trillion-scale vector similarity search and is used for AI/ML workflows.',
    category: 'Vector DB',
    iconSrc: milvusLogo,
    installed: false,
    deployType: 'Helm',
  },
];

const categories: AppCategory[] = [
  'All',
  'Database',
  'Developer tools',
  'Data processing',
  'Networking',
  'Vector DB',
];

const operatorApps: CatalogApp[] = [
  {
    id: 'postgresql-operator',
    name: 'CNPG operator',
    version: 'v1.29.0',
    description:
      'CloudNativePG Operator for Kubernetes. Manages PostgreSQL clusters using the CNPG CRD. Install this first before creating PostgreSQL instances.',
    category: 'Database',
    iconSrc: postgresqlLogo,
    installed: false,
    deployType: 'Operator',
  },
];

const operatorCategories: OperatorCategory[] = ['All', 'Database'];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function CatalogPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const navigate = useNavigate();

  const [activePageTab, setActivePageTab] = useState<'applications' | 'operators'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<AppCategory>('All');
  const [operatorSearchQuery, setOperatorSearchQuery] = useState('');
  const [activeOperatorCategory, setActiveOperatorCategory] = useState<OperatorCategory>('All');

  const filteredApps = catalogApps.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredOperators = operatorApps.filter((app) => {
    const matchesSearch =
      !operatorSearchQuery ||
      app.name.toLowerCase().includes(operatorSearchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(operatorSearchQuery.toLowerCase());
    const matchesCategory =
      activeOperatorCategory === 'All' || app.category === activeOperatorCategory;
    return matchesSearch && matchesCategory;
  });

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
          breadcrumb={<Breadcrumb items={[{ label: 'Catalog' }]} />}
          actions={<ContainerTopBarActions />}
        />
      }
    >
      <VStack gap={4}>
        <PageHeader title="Catalog" />

        <Tabs
          value={activePageTab}
          onChange={(val) => setActivePageTab(val as 'applications' | 'operators')}
          variant="underline"
          size="sm"
        >
          <TabList>
            <Tab value="applications">Applications</Tab>
            <Tab value="operators">Operators</Tab>
          </TabList>

          <TabPanel value="applications" className="pt-0">
            <VStack gap={4} className="pt-4">
              <SearchInput
                placeholder="Search by app name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                size="sm"
                className="w-[var(--search-input-width)]"
              />

              <Tabs
                value={activeCategory}
                onChange={(val) => setActiveCategory(val as AppCategory)}
                variant="boxed"
                size="sm"
              >
                <TabList>
                  {categories.map((cat) => (
                    <Tab key={cat} value={cat} className="w-[120px]">
                      {cat}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>

              {filteredApps.length === 0 ? (
                <EmptyState
                  variant="inline"
                  icon={<IconSearch size={48} stroke={1} />}
                  title="No apps found"
                  description="Try adjusting your search or filter criteria."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredApps.map((app) => (
                    <CatalogCard
                      key={app.id}
                      iconSrc={app.iconSrc}
                      iconAlt={app.name}
                      name={app.name}
                      version={app.version}
                      description={app.description}
                      badges={[
                        { label: app.deployType, variant: 'info' },
                        { label: app.category, theme: 'white' },
                      ]}
                      actions={
                        app.installed ? (
                          <Button variant="outline" size="sm" disabled>
                            Installed
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/container/catalog/${app.id}/install`)}
                          >
                            Install
                          </Button>
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </VStack>
          </TabPanel>

          <TabPanel value="operators" className="pt-0">
            <VStack gap={4} className="pt-4">
              <SearchInput
                placeholder="Search by operator name"
                value={operatorSearchQuery}
                onChange={(e) => setOperatorSearchQuery(e.target.value)}
                onClear={() => setOperatorSearchQuery('')}
                size="sm"
                className="w-[var(--search-input-width)]"
              />

              <Tabs
                value={activeOperatorCategory}
                onChange={(val) => setActiveOperatorCategory(val as OperatorCategory)}
                variant="boxed"
                size="sm"
              >
                <TabList>
                  {operatorCategories.map((cat) => (
                    <Tab key={cat} value={cat} className="w-[120px]">
                      {cat}
                    </Tab>
                  ))}
                </TabList>
              </Tabs>

              {filteredOperators.length === 0 ? (
                <EmptyState
                  variant="inline"
                  icon={<IconSearch size={48} stroke={1} />}
                  title="No operators found"
                  description="Try adjusting your search or filter criteria."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOperators.map((app) => (
                    <CatalogCard
                      key={app.id}
                      iconSrc={app.iconSrc}
                      iconAlt={app.name}
                      name={app.name}
                      version={app.version}
                      description={app.description}
                      badges={[
                        { label: app.deployType, variant: 'info' },
                        { label: app.category, theme: 'white' },
                      ]}
                      actions={
                        app.installed ? (
                          <Button variant="outline" size="sm" disabled>
                            Installed
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/container/catalog/${app.id}/install`)}
                          >
                            Install
                          </Button>
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>
    </PageShell>
  );
}
