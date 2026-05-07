import { useState, useEffect } from 'react';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  Table,
  Badge,
  SearchInput,
  ListToolbar,
  ContextMenu,
  Tooltip,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import postgresqlLogo from '@/assets/catalog/postgresql.svg';
import kafkaLogo from '@/assets/catalog/kafka.svg';
import milvusLogo from '@/assets/catalog/milvus.svg';
import nginxLogo from '@/assets/catalog/nginx.svg';
import valkeyLogo from '@/assets/catalog/valkey.svg';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { getContainerStatusTheme } from './containerStatusUtils';

interface InstalledOperator {
  id: string;
  name: string;
  iconSrc: string;
  version: string;
  namespace: string;
  status: string;
  statusMessage?: string;
  managedResources: number;
  lastUpdated: string;
}

const installedOperators: InstalledOperator[] = [
  {
    id: '1',
    name: 'CNPG operator',
    iconSrc: postgresqlLogo,
    version: 'v1.29.0',
    namespace: 'Cluster',
    status: 'Deployed',
    managedResources: 3,
    lastUpdated: 'Mar 15, 2026',
  },
  {
    id: '2',
    name: 'Strimzi Kafka operator',
    iconSrc: kafkaLogo,
    version: 'v0.44.0',
    namespace: 'Cluster',
    status: 'Pending',
    managedResources: 5,
    lastUpdated: 'Mar 10, 2026',
  },
  {
    id: '3',
    name: 'Milvus operator',
    iconSrc: milvusLogo,
    version: 'v1.1.2',
    namespace: 'Cluster',
    status: 'Deployed',
    managedResources: 2,
    lastUpdated: 'Feb 28, 2026',
  },
  {
    id: '4',
    name: 'NGINX Ingress operator',
    iconSrc: nginxLogo,
    version: 'v3.4.0',
    namespace: 'Namespace',
    status: 'Deployed',
    managedResources: 1,
    lastUpdated: 'Feb 20, 2026',
  },
  {
    id: '5',
    name: 'Valkey operator',
    iconSrc: valkeyLogo,
    version: 'v0.8.1',
    namespace: 'Cluster',
    status: 'Failed',
    statusMessage:
      'PersistentVolumeClaim "data-postgresql-0" failed to bind: no matching StorageClass found.',
    managedResources: 0,
    lastUpdated: 'Apr 01, 2026',
  },
];

const operatorColumns: TableColumn<InstalledOperator>[] = [
  {
    key: 'status',
    header: 'Status',
    width: fixedColumns.statusLabel,
    render: (_, row) => {
      const badge = (
        <Badge theme={getContainerStatusTheme(row.status)} type="subtle" size="sm">
          {row.status}
        </Badge>
      );
      if (row.statusMessage) {
        return <Tooltip content={row.statusMessage}>{badge}</Tooltip>;
      }
      return badge;
    },
  },
  {
    key: 'name',
    header: 'Operator name',
    minWidth: columnMinWidths.name,
    render: (_, row) => (
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-[4px] border border-[var(--color-border-default)]">
          <img src={row.iconSrc} alt={row.name} className="w-4 h-4" />
        </div>
        <Link
          to={`/container/installed-operators/${row.id}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline truncate min-w-0"
        >
          {row.name}
        </Link>
      </div>
    ),
  },
  {
    key: 'namespace',
    header: 'Scope',
    minWidth: columnMinWidths.namespace,
  },
  {
    key: 'version',
    header: 'Version',
    minWidth: 100,
  },
  {
    key: 'lastUpdated',
    header: 'Installed at',
    minWidth: columnMinWidths.createdAt,
  },
  {
    key: 'actions',
    header: 'Action',
    width: fixedColumns.actions,
    align: 'center' as const,
    sticky: 'right' as const,
    render: (_, row) => {
      const items: ContextMenuItem[] = [
        {
          id: 'delete',
          label: 'Delete',
          status: 'danger',
          onClick: () => console.log('Delete', row.id),
        },
      ];
      return (
        <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={items} trigger="click" align="right">
            <button
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-default)]"
              />
            </button>
          </ContextMenu>
        </div>
      );
    },
  },
];

export default function InstalledOperatorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    updateActiveTabLabel('Installed operators');
  }, [updateActiveTabLabel]);

  const filteredOperators = installedOperators.filter((op) =>
    op.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
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
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[{ label: 'Cluster1', href: '/container' }, { label: 'Installed operators' }]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={3}>
        <PageHeader title="Installed operators" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Search operators"
                size="sm"
                className="w-[var(--search-input-width)]"
              />
            </ListToolbar.Actions>
          }
        />

        <Table<InstalledOperator>
          columns={operatorColumns}
          data={filteredOperators}
          rowKey="id"
          emptyMessage="No installed operators found"
        />
      </VStack>
    </PageShell>
  );
}
