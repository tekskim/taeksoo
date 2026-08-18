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
  PageHeader,
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
import { managedByColumn } from '@/pages/containerManagedBy';
import { RESOURCE_TYPES, instancesOf, type InstanceRow } from '@/pages/containerResourceTypesData';
import { IconDotsCircleHorizontal } from '@tabler/icons-react';

const PER_PAGE = 10;

export function ResourceTypeInstancesPage() {
  const navigate = useNavigate();
  const { typeId } = useParams<{ typeId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<InstanceRow | null>(null);
  const { tabs, activeTabId, closeTab, selectTab, moveTab, addNewTab } = useTabs();

  const resourceType = RESOURCE_TYPES.find((t) => t.id === typeId);
  const rows = instancesOf(typeId);

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
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      resizable: false,
      render: (_, row) => {
        const items: ContextMenuItem[] = [
          { id: 'view-yaml', label: 'View YAML', onClick: () => undefined },
          {
            id: 'delete',
            label: 'Delete',
            status: 'danger',
            onClick: () => setPendingDelete(row),
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={items} trigger="click" align="right">
              <button
                type="button"
                aria-label={`Actions for ${row.name}`}
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group"
              >
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--action-icon-color)]"
                />
              </button>
            </ContextMenu>
          </div>
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
          <PageHeader title={kind} />
          <p className="text-body-md text-[var(--color-text-subtle)]">
            {resourceType?.name ?? 'Unknown resource type'}
          </p>
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
