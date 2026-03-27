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
  Badge,
  Tabs,
  TabList,
  Tab,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useNavigate } from 'react-router-dom';
import { IconBell, IconTerminal2 } from '@tabler/icons-react';

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

type AppCategory = 'All' | 'Database' | 'Data Processing' | 'Networking' | 'Vector DB';

interface CatalogApp {
  id: string;
  name: string;
  version: string;
  description: string;
  category: AppCategory;
  iconBg: string;
  iconText: string;
  installed: boolean;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const catalogApps: CatalogApp[] = [
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    version: 'v16.2',
    description:
      'PostgreSQL is a powerful open-source object-relational database system with a strong reputation for reliability, feature robustness, and performance.',
    category: 'Database',
    iconBg: '#336791',
    iconText: 'P',
    installed: true,
  },
  {
    id: 'valkey',
    name: 'Valkey',
    version: 'v8.1',
    description:
      'Valkey is an open source, high performance key/value database that supports a variety of workloads such as caching, message queues, and can act as a primary database.',
    category: 'Database',
    iconBg: '#7B4EFA',
    iconText: 'V',
    installed: false,
  },
  {
    id: 'kafka',
    name: 'Kafka',
    version: '',
    description:
      'Apache Kafka is an open-source distributed event streaming platform used for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.',
    category: 'Data Processing',
    iconBg: '#231F20',
    iconText: 'K',
    installed: false,
  },
  {
    id: 'nginx',
    name: 'Nginx',
    version: 'v4.11.0',
    description:
      'NGINX Ingress Controller for Kubernetes – routes external HTTP/HTTPS traffic into cluster services using Ingress resources. Multiple instances are allowed per namespace.',
    category: 'Networking',
    iconBg: '#009639',
    iconText: 'N',
    installed: true,
  },
  {
    id: 'milvus',
    name: 'Milvus',
    version: 'v4.2.7',
    description:
      'Milvus is an open-source vector database built to power embedding similarity search and AI applications. It supports trillion-scale vector similarity search and is used for AI/ML workflows.',
    category: 'Vector DB',
    iconBg: '#00A1EA',
    iconText: 'M',
    installed: false,
  },
];

const categories: AppCategory[] = ['All', 'Database', 'Data Processing', 'Networking', 'Vector DB'];

const categoryBadgeVariant: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  Database: 'info',
  'Data Processing': 'info',
  Networking: 'info',
  'Vector DB': 'info',
};

/* ----------------------------------------
   Component
   ---------------------------------------- */

export default function CatalogPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<AppCategory>('All');

  const filteredApps = catalogApps.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
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
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'clusterName', href: '/container' },
                { label: 'Apps', href: '/container/catalog' },
                { label: 'Catalog' },
              ]}
            />
          }
          actions={
            <>
              <TopBarActionButton icon={<IconTerminal2 size={16} stroke={1.5} />} label="Console" />
              <TopBarActionButton
                icon={<IconBell size={16} stroke={1.5} />}
                label="Notifications"
              />
            </>
          }
        />
      }
    >
      <VStack gap={4}>
        <PageHeader title="Catalog" />

        <VStack gap={4}>
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
            variant="underline"
            size="sm"
          >
            <TabList>
              {categories.map((cat) => (
                <Tab key={cat} value={cat}>
                  {cat}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </VStack>

        <div className="grid grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)]"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0 text-white font-semibold text-[16px]"
                  style={{ backgroundColor: app.iconBg }}
                >
                  {app.iconText}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-heading-h6 text-[var(--color-text-default)]">
                    {app.name}
                  </span>
                  {app.version && (
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      {app.version}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-body-md text-[var(--color-text-muted)] m-0 line-clamp-3 flex-1">
                {app.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <Badge variant={categoryBadgeVariant[app.category] || 'info'} size="sm">
                  {app.category}
                </Badge>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/container/catalog/${app.id}/install`)}
                >
                  Install
                </Button>
              </div>
            </div>
          ))}
        </div>
      </VStack>
    </PageShell>
  );
}
