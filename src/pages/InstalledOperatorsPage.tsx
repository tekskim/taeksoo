import { useState, useEffect, useMemo } from 'react';
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
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { IconDotsCircleHorizontal } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { AppCatalogSidebar } from '@/components/AppCatalogSidebar';
import { AppCatalogTopBarActions } from '@/components/AppCatalogTopBarActions';
import { useAppCatalogMode } from '@/contexts/AppCatalogModeContext';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { getContainerStatusTheme } from './containerStatusUtils';
import { installedOperatorsMock } from '@/pages/apps/appsMockData';
import type { InstalledOperator } from '@/pages/apps/appsTypes';

const operatorColumns: TableColumn<InstalledOperator>[] = [
  {
    key: 'status',
    label: 'Status',
    width: fixedColumns.statusLabel,
    render: (_, row) => (
      <Badge theme={getContainerStatusTheme(row.status)} type="subtle" size="sm">
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'displayName',
    label: 'Operator name',
    minWidth: columnMinWidths.name,
    render: (_, row) => (
      <div className="flex items-center gap-2 min-w-0">
        {row.logoUrl && (
          <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-[4px] border border-[var(--color-border-default)]">
            <img src={row.logoUrl} alt={row.displayName} className="w-4 h-4" />
          </div>
        )}
        <Link
          to={`${basePath}/${row.id}`}
          className="text-[var(--color-action-primary)] font-medium hover:underline truncate min-w-0"
        >
          {row.displayName}
        </Link>
      </div>
    ),
  },
  {
    key: 'namespace',
    label: 'Namespace',
    minWidth: columnMinWidths.namespace,
  },
  {
    key: 'version',
    label: 'Version',
    minWidth: 100,
  },
  {
    key: 'installedAt',
    label: 'Installed at',
    minWidth: columnMinWidths.createdAt,
  },
  {
    key: 'actions',
    label: 'Action',
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
  const { isStandalone } = useAppCatalogMode();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = isStandalone ? (sidebarOpen ? 200 : 0) : sidebarOpen ? 248 : 48;
  const basePath = isStandalone
    ? '/app-catalog/installed-operators'
    : '/container/installed-operators';
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } =
    useTabs();
  const [searchQuery, setSearchQuery] = useState('');

  const operatorColumnsResolved = useMemo<TableColumn<InstalledOperator>[]>(
    () =>
      operatorColumns.map((col) => {
        if (col.key !== 'displayName') return col;
        return {
          ...col,
          render: (_, row: InstalledOperator) => (
            <div className="flex items-center gap-2 min-w-0">
              {row.logoUrl && (
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-[4px] border border-[var(--color-border-default)]">
                  <img src={row.logoUrl} alt={row.displayName} className="w-4 h-4" />
                </div>
              )}
              <Link
                to={`${basePath}/${row.id}`}
                className="text-[var(--color-action-primary)] font-medium hover:underline truncate min-w-0"
              >
                {row.displayName}
              </Link>
            </div>
          ),
        };
      }),
    [basePath]
  );

  useEffect(() => {
    updateActiveTabLabel('Installed operators');
  }, [updateActiveTabLabel]);

  const filteredOperators = installedOperatorsMock.filter(
    (op) =>
      op.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageShell
      sidebar={
        isStandalone ? (
          <AppCatalogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        ) : (
          <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        )
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
          showNavigation={!isStandalone}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={
                isStandalone
                  ? [{ label: 'Installed Operators' }]
                  : [{ label: 'Cluster1', href: '/container' }, { label: 'Installed operators' }]
              }
            />
          }
          actions={isStandalone ? <AppCatalogTopBarActions /> : <ContainerTopBarActions />}
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
          columns={operatorColumnsResolved}
          data={filteredOperators}
          rowKey="id"
          emptyMessage="No installed operators found"
        />
      </VStack>
    </PageShell>
  );
}
