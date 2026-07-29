/* ----------------------------------------
   Resource types — custom resources (CorePlan D-35)

   Spec: 2-screens/3-custom-resources-v1.0.0.md
   Rules: [CCONT-07] CP can reach every resource kind in the cluster
          [CCONT-08] no create / no form edit — view, YAML, delete only
          [CCONT-09] managed-by badge follows the workload list rule

   D-24 says resource-level management belongs to CP no matter who created the
   resource. Standard kinds already have dedicated screens; this is the path to
   everything else — Hub's ArgoCD `Application`, Metis' Knative `Service`, …
   ---------------------------------------- */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Breadcrumb,
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
import { IconDotsVertical } from '@tabler/icons-react';

export interface ResourceTypeRow {
  id: string;
  /** Full CRD name, e.g. applications.argoproj.io */
  name: string;
  /** Kind an instance uses, e.g. Application */
  kind: string;
  group: string;
  scope: 'Namespaced' | 'Cluster';
  instances: number;
  managedBy?: WorkloadManagedBy;
}

/* Inline mock. Standard K8s kinds are deliberately absent — they already have
   dedicated list screens ([CCONT-07]). */
export const RESOURCE_TYPES: ResourceTypeRow[] = [
  {
    id: 'applications-argoproj',
    name: 'applications.argoproj.io',
    kind: 'Application',
    group: 'argoproj.io',
    scope: 'Namespaced',
    instances: 14,
  },
  {
    id: 'appprojects-argoproj',
    name: 'appprojects.argoproj.io',
    kind: 'AppProject',
    group: 'argoproj.io',
    scope: 'Namespaced',
    instances: 3,
  },
  {
    id: 'services-knative',
    name: 'services.serving.knative.dev',
    kind: 'Service',
    group: 'serving.knative.dev',
    scope: 'Namespaced',
    instances: 6,
    managedBy: 'Metis',
  },
  {
    id: 'revisions-knative',
    name: 'revisions.serving.knative.dev',
    kind: 'Revision',
    group: 'serving.knative.dev',
    scope: 'Namespaced',
    instances: 21,
    managedBy: 'Metis',
  },
  {
    id: 'pytorchjobs-kubeflow',
    name: 'pytorchjobs.kubeflow.org',
    kind: 'PyTorchJob',
    group: 'kubeflow.org',
    scope: 'Namespaced',
    instances: 9,
    managedBy: 'Maxis',
  },
  {
    id: 'workqueues-kueue',
    name: 'workloads.kueue.x-k8s.io',
    kind: 'Workload',
    group: 'kueue.x-k8s.io',
    scope: 'Namespaced',
    instances: 31,
    managedBy: 'Maxis',
  },
  {
    id: 'clusterpolicies-nvidia',
    name: 'clusterpolicies.nvidia.com',
    kind: 'ClusterPolicy',
    group: 'nvidia.com',
    scope: 'Cluster',
    instances: 1,
  },
];

const PER_PAGE = 10;

export function ResourceTypesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const { tabs, activeTabId, closeTab, selectTab, moveTab, addNewTab } = useTabs();

  const filtered = useMemo(() => {
    return RESOURCE_TYPES.filter((row) =>
      appliedFilters.every((f) => {
        const value = String(f.value ?? '').toLowerCase();
        if (!value) return true;
        if (f.id === 'scope') return row.scope.toLowerCase() === value;
        if (f.id === 'name') return `${row.name} ${row.kind}`.toLowerCase().includes(value);
        return true;
      })
    );
  }, [appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const columns: TableColumn<ResourceTypeRow>[] = [
    {
      key: 'kind',
      label: 'Kind',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_, row) => (
        <span className="truncate min-w-0 font-medium text-[var(--color-text-default)]">
          {row.kind}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_, row) => (
        <span className="truncate min-w-0 text-[var(--color-text-muted)]">{row.name}</span>
      ),
    },
    {
      key: 'group',
      label: 'Group',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_, row) => <span className="truncate min-w-0">{row.group}</span>,
    },
    {
      key: 'scope',
      label: 'Scope',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_, row) => (
        <Badge theme="gray" type="subtle" size="sm">
          {row.scope}
        </Badge>
      ),
    },
    {
      key: 'instances',
      label: 'Instances',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      sortable: true,
      render: (_, row) => <span className="tabular-nums">{row.instances}</span>,
    },
    managedByColumn<ResourceTypeRow>(),
    {
      key: '_action',
      label: '',
      width: fixedColumns.actions,
      align: 'center',
      resizable: false,
      render: (_, row) => {
        // [CCONT-08] — no create, no form edit. View and YAML only at this level.
        const items: ContextMenuItem[] = [
          {
            label: 'View instances',
            onClick: () => navigate(`/container/resource-types/${row.id}`),
          },
          { label: 'View YAML', onClick: () => undefined },
        ];
        return (
          <ContextMenu items={items} trigger="click" align="right">
            <button
              type="button"
              aria-label={`Actions for ${row.kind}`}
              className="p-1 rounded hover:bg-[var(--color-surface-muted)]"
            >
              <IconDotsVertical size={16} stroke={1.5} />
            </button>
          </ContextMenu>
        );
      },
    },
  ];

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
                { label: 'Resource types' },
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
          <h1 className="text-heading-xl font-semibold text-[var(--color-text-default)]">
            Resource types
          </h1>
          <span className="text-body-md text-[var(--color-text-muted)]">
            Custom resource kinds defined in this cluster. Standard Kubernetes kinds have their own
            screens.
          </span>
        </VStack>

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                filters={[
                  {
                    id: 'scope',
                    label: 'Scope',
                    type: 'select',
                    options: [
                      { value: 'namespaced', label: 'Namespaced' },
                      { value: 'cluster', label: 'Cluster' },
                    ],
                  },
                  { id: 'name', label: 'Name', type: 'text', placeholder: 'Kind or full name' },
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

        <Table<ResourceTypeRow>
          columns={columns}
          data={paged}
          rowKey="id"
          onRowClick={(row) => navigate(`/container/resource-types/${row.id}`)}
          resizable={false}
          emptyMessage="No custom resource types are defined in this cluster."
        />
      </VStack>
    </PageShell>
  );
}

export default ResourceTypesPage;
