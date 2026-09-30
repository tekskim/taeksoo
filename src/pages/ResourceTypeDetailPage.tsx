/* ----------------------------------------
   리소스 종류 상세 — Overview · Instances · YAML (CAPSIS-D-35·D-63)

   화면 정의서: 02-screens/03-custom-resources-v1.0.md §화면 2
   조항: [CAPSIS-07] 표준 K8s 종류는 이 경로에 넣지 않는다
         [CAPSIS-08] 생성도 폼 편집도 없다 — 조회·YAML·삭제만
         [CAPSIS-09] 만든 주체 배지는 워크로드 목록과 같은 규칙

   전에는 인스턴스를 별도 페이지로 열었다. 그러면 그 종류가 무엇인지
   (그룹·범위·어느 오퍼레이터가 만들었는지)를 볼 자리가 없어서, 종류
   상세를 두고 인스턴스를 그 안의 탭으로 옮겼다.

   삭제는 상위 제품이 관리하는 인스턴스일 때 안내를 함께 보여준다.
   막지는 않는다 — CAPSIS-D-26이 그 영향을 사용자 책임으로 정했다.
   ---------------------------------------- */

import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumb,
  ConfirmModal,
  ContextMenu,
  FilterSearchInput,
  HStack,
  ListToolbar,
  PageShell,
  PageHeader,
  Pagination,
  SectionCard,
  Tab,
  TabList,
  TabPanel,
  Table,
  TabBar,
  Tabs,
  TopBar,
  VStack,
  YamlEditor,
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
import {
  RESOURCE_TYPES,
  crdYamlOf,
  instancesOf,
  type InstanceRow,
} from '@/pages/containerResourceTypesData';
import { IconDotsCircleHorizontal } from '@tabler/icons-react';

const PER_PAGE = 10;

export function ResourceTypeDetailPage() {
  const navigate = useNavigate();
  const { typeId } = useParams<{ typeId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 248 : 48;
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<InstanceRow | null>(null);
  const { tabs, activeTabId, closeTab, selectTab, moveTab, addNewTab } = useTabs();

  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

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
        {/* 머리말 — 종류 자체를 한 줄로 요약한다. 인스턴스만 보던 때는
            이 자리가 없어서 무엇의 인스턴스인지 알 수 없었다. */}
        <VStack gap={1}>
          <PageHeader
            title={kind}
            titleExtra={
              <HStack gap={2} className="items-center">
                <Badge theme="gray" type="subtle" size="sm">
                  {resourceType?.scope ?? 'Namespaced'}
                </Badge>
                {resourceType?.managedBy && (
                  <Badge
                    theme={resourceType.managedBy === 'Maxis' ? 'green' : 'yellow'}
                    type="subtle"
                    size="sm"
                  >
                    {resourceType.managedBy}
                  </Badge>
                )}
              </HStack>
            }
          />
          <p className="text-body-md text-[var(--color-text-subtle)]">
            {resourceType?.name ?? 'Unknown resource type'}
          </p>
        </VStack>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="instances">Instances</Tab>
            <Tab value="yaml">YAML</Tab>
          </TabList>

          {/* ---------- Overview — 이 종류가 무엇인가 ---------- */}
          <TabPanel value="overview">
            <VStack gap={4} className="pt-4">
              <SectionCard>
                <SectionCard.Header title="Definition" />
                <SectionCard.DataRow label="Full name" value={resourceType?.name ?? '—'} />
                <SectionCard.DataRow label="Kind" value={kind} />
                <SectionCard.DataRow label="Group" value={resourceType?.group ?? '—'} />
                <SectionCard.DataRow label="Scope" value={resourceType?.scope ?? '—'} />
                <SectionCard.DataRow label="Versions">
                  <HStack gap={2} className="items-center">
                    {(resourceType?.versions ?? []).map((version, index) => (
                      <Badge
                        key={version}
                        theme={index === 0 ? 'blue' : 'gray'}
                        type="subtle"
                        size="sm"
                      >
                        {index === 0 ? `${version} (storage)` : version}
                      </Badge>
                    ))}
                  </HStack>
                </SectionCard.DataRow>
              </SectionCard>

              {/* 이 종류를 누가 만들었나. 앱이 안 뜰 때 어느 오퍼레이터를
                  봐야 하는지가 여기서 갈린다. */}
              <SectionCard>
                <SectionCard.Header title="Source" />
                <SectionCard.DataRow label="Created by">
                  {resourceType?.operator ?? (
                    <span className="text-[var(--color-text-muted)]">Unknown</span>
                  )}
                </SectionCard.DataRow>
                <SectionCard.DataRow label="Managed by">
                  {resourceType?.managedBy ? (
                    <Badge
                      theme={resourceType.managedBy === 'Maxis' ? 'green' : 'yellow'}
                      type="subtle"
                      size="sm"
                    >
                      {resourceType.managedBy}
                    </Badge>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">—</span>
                  )}
                </SectionCard.DataRow>
                <SectionCard.DataRow label="Instances">
                  <span className="tabular-nums">{rows.length}</span>
                </SectionCard.DataRow>
              </SectionCard>
            </VStack>
          </TabPanel>

          {/* ---------- Instances — 전에 별도 페이지였던 것 ---------- */}
          <TabPanel value="instances">
            <VStack gap={4} className="pt-4">
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
          </TabPanel>

          {/* ---------- YAML — CRD 정의. 읽기 전용 ---------- */}
          <TabPanel value="yaml">
            <VStack gap={4} className="pt-4">
              <div className="h-[560px]">
                <YamlEditor
                  value={resourceType ? crdYamlOf(resourceType) : ''}
                  onChange={() => undefined}
                  readOnly
                  className="h-full"
                />
              </div>
            </VStack>
          </TabPanel>
        </Tabs>
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

export default ResourceTypeDetailPage;
