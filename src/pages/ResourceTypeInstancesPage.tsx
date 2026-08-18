/* ----------------------------------------
   Resource type → instances (CorePlan D-35)

   Spec: 2-screens/3-custom-resources-v1.0.0.md
   Rules: [CCONT-08] view / YAML / delete only — never create
          [CCONT-09] managed-by badge follows the workload list rule

   Delete warns when another product owns the instance: D-26 treats the impact
   as the user's responsibility, so the screen says so rather than blocking.
   ---------------------------------------- */

import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  ConfirmModal,
  ContextMenu,
  FilterSearchInput,
  ListToolbar,
  PageShell,
  Pagination,
  Table,
  TabBar,
  TopBar,
  VStack,
  columnMinWidths,
  fixedColumns,
  type AppliedFilter,
  type ContextMenuItem,
  type TableColumn,
} from '@/design-system';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { ContainerTopBarActions } from '@/components/ContainerTopBarActions';
import { useTabs } from '@/contexts/TabContext';
import { managedByColumn, type WorkloadManagedBy } from '@/pages/containerManagedBy';
import { RESOURCE_TYPES } from '@/pages/ResourceTypesPage';
import { IconDotsVertical } from '@tabler/icons-react';

interface InstanceRow {
  id: string;
  name: string;
  namespace?: string;
  managedBy?: WorkloadManagedBy;
  createdAt: string;
}

/* Inline mock keyed by resource type id. */
const INSTANCES: Record<string, InstanceRow[]> = {
  'clusters-cnpg': [
    { id: 'g1', name: 'orders-db', namespace: 'apps', createdAt: 'Jul 24, 2026 09:12' },
    { id: 'g2', name: 'billing-db', namespace: 'apps', createdAt: 'Jul 22, 2026 14:03' },
    { id: 'g3', name: 'analytics-db', namespace: 'data', createdAt: 'Jul 19, 2026 11:47' },
  ],
  'kafkatopics-strimzi': [
    { id: 'k1', name: 'events.orders', namespace: 'apps', createdAt: 'Jul 27, 2026 08:30' },
    { id: 'k2', name: 'events.audit', namespace: 'apps', createdAt: 'Jul 26, 2026 17:22' },
  ],
  'milvus-zilliz': [
    {
      id: 'm1',
      name: 'metis-vector-store',
      namespace: 'metis-serving',
      managedBy: 'Metis',
      createdAt: 'Jul 27, 2026 08:30',
    },
  ],
  'pytorchjobs-kubeflow': [
    {
      id: 'p1',
      name: 'finetune-qwen-0729',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 29, 2026 02:10',
    },
    {
      id: 'p2',
      name: 'pretrain-run-14',
      namespace: 'maxis-train',
      managedBy: 'Maxis',
      createdAt: 'Jul 28, 2026 21:55',
    },
  ],
  'clusterpolicies-nvidia': [
    { id: 'c1', name: 'gpu-cluster-policy', createdAt: 'Jun 15, 2026 07:41' },
  ],
};

const PER_PAGE = 10;

export function ResourceTypeInstancesPage() {
  const navigate = useNavigate();
  const { typeId } = useParams<{ typeId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<InstanceRow | null>(null);
  const { tabs, activeTabId, closeTab, selectTab, moveTab, addNewTab } = useTabs();

  const resourceType = RESOURCE_TYPES.find((t) => t.id === typeId);
  const rows = (typeId && INSTANCES[typeId]) || [];

  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        appliedFilters.every((f) => {
          const value = String(f.value ?? '').toLowerCase();
          if (!value) return true;
          if (f.id === 'name') return row.name.toLowerCase().includes(value);
          return true;
        })
      ),
    [rows, appliedFilters]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const isNamespaced = resourceType?.scope !== 'Cluster';

  const columns: TableColumn<InstanceRow>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <span className="truncate min-w-0 font-medium text-[var(--color-text-default)]">
          {row.name}
        </span>
      ),
    },
    ...(isNamespaced
      ? ([
          {
            key: 'namespace',
            label: 'Namespace',
            flex: 1,
            minWidth: columnMinWidths.name,
            render: (_, row) => <span className="truncate min-w-0">{row.namespace ?? '—'}</span>,
          },
        ] as TableColumn<InstanceRow>[])
      : []),
    managedByColumn<InstanceRow>(),
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      render: (_, row) => <span className="truncate min-w-0">{row.createdAt}</span>,
    },
    {
      key: '_action',
      label: '',
      width: fixedColumns.actions,
      align: 'center',
      resizable: false,
      render: (_, row) => {
        const items: ContextMenuItem[] = [
          { label: 'View YAML', onClick: () => undefined },
          { label: 'Delete', onClick: () => setPendingDelete(row), variant: 'danger' },
        ];
        return (
          <ContextMenu items={items} trigger="click" align="right">
            <button
              type="button"
              aria-label={`Actions for ${row.name}`}
              className="p-1 rounded hover:bg-[var(--color-surface-muted)]"
            >
              <IconDotsVertical size={16} stroke={1.5} />
            </button>
          </ContextMenu>
        );
      },
    },
  ];

  const kind = resourceType?.kind ?? 'Resource';

  return (
    <PageShell
      sidebar={
        <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
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
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Container', href: '/container/dashboard' },
                { label: 'Resource types', href: '/container/resource-types' },
                { label: kind },
              ]}
            />
          }
          actions={<ContainerTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      <VStack gap={4}>
        <VStack gap={1}>
          <h1 className="text-heading-xl font-semibold text-[var(--color-text-default)]">{kind}</h1>
          <span className="text-body-md text-[var(--color-text-muted)]">
            {resourceType?.name ?? 'Unknown resource type'}
          </span>
        </VStack>

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                filters={[
                  { id: 'name', label: 'Name', type: 'text', placeholder: 'Instance name' },
                ]}
                appliedFilters={appliedFilters}
                onFiltersChange={(next) => {
                  setAppliedFilters(next);
                  setPage(1);
                }}
                placeholder="Search by attributes"
                className="w-[var(--search-input-width)]"
              />
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filtered.length}
        />

        <Table<InstanceRow>
          columns={columns}
          data={paged}
          rowKey="id"
          resizable={false}
          emptyMessage={`No instances of ${kind} found.`}
        />
      </VStack>

      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => setPendingDelete(null)}
        title={`Delete ${kind}`}
        description={
          pendingDelete?.managedBy
            ? `"${pendingDelete.name}" is managed by ${pendingDelete.managedBy}. Deleting it here may affect that product's behavior.`
            : `"${pendingDelete?.name}" will be deleted. This cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </PageShell>
  );
}

export default ResourceTypeInstancesPage;
