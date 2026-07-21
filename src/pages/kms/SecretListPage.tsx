import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  FilterSearchInput,
  type AppliedFilter,
  ListToolbar,
  Pagination,
  Table,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { KmsSidebar } from '@/components/KmsSidebar';
import { useTabs } from '@/contexts/TabContext';
import { KmsStateBadge, formatDate } from './shared';
import type { SecretListResult, SecretState, SecretSummary } from './models/secret';
import { listMockSecrets } from './mocks/secretsRepository';

const PAGE_SIZE = 10;
const DETAIL_ROUTE_PREFIX = '/kms/secrets/';

/* ─────────────────────────────────────────────────────────────────
   SecretListPage — ported from kms/features/secrets/ui/pages
   ───────────────────────────────────────────────────────────────── */

export default function SecretListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SecretListResult | null>(null);

  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const filterParams = useMemo(() => {
    const record: Record<string, string> = {};
    for (const f of appliedFilters) record[f.fieldId] = f.value;
    return {
      name: record.name || undefined,
      status: (record.status as SecretState) || undefined,
    };
  }, [appliedFilters]);

  // 서버 목록 조회 — keepPreviousData처럼 로딩 중에도 이전 결과 유지
  useEffect(() => {
    let cancelled = false;
    listMockSecrets({
      ...filterParams,
      page,
      pageSize: PAGE_SIZE,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    }).then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, [filterParams, page]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = appliedFilters.length > 0;

  const handleFiltersChange = (next: AppliedFilter[]) => {
    setAppliedFilters(next);
    setPage(1);
  };

  const handleRowClick = (row: SecretSummary): void => {
    navigate(`${DETAIL_ROUTE_PREFIX}${encodeURIComponent(row.slug)}`);
  };

  const columns: TableColumn<SecretSummary>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_, row) => <KmsStateBadge status={row.status} />,
    },
    {
      key: 'name',
      label: 'Secret name',
      width: '220px',
      render: (_, row) => (
        <button
          type="button"
          className="block max-w-full truncate border-0 bg-transparent p-0 text-left text-body-md text-[var(--color-action-primary)] hover:underline cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            handleRowClick(row);
          }}
        >
          {row.name}
        </button>
      ),
    },
    {
      key: 'currentVersion',
      label: 'Current version',
      width: '140px',
      render: (_, row) => (
        <span className="font-mono text-body-sm">{`v${row.currentVersion}`}</span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last updated',
      flex: 1,
      minWidth: columnMinWidths.timestamp,
      sortable: true,
      render: (_, row) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {row.updatedAt ? formatDate(row.updatedAt) : '-'}
        </span>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<KmsSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb items={[{ label: 'KMS', href: '/kms/overview' }, { label: 'Secrets' }]} />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader title="Secrets" />

        {/* List Toolbar — name / status filters */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                filters={[
                  {
                    id: 'name',
                    label: 'Secret name',
                    type: 'text',
                    placeholder: 'e.g. postgres',
                  },
                  {
                    id: 'status',
                    label: 'Status',
                    type: 'select',
                    options: [
                      { value: 'active', label: 'Active' },
                      { value: 'expired', label: 'Expired' },
                      { value: 'deactivated', label: 'Deactivated' },
                    ],
                  },
                ]}
                appliedFilters={appliedFilters}
                onFiltersChange={handleFiltersChange}
                placeholder="Search secrets by attributes"
                className="w-[var(--search-input-width)]"
              />
            </ListToolbar.Actions>
          }
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={total}
        />

        <Table<SecretSummary>
          columns={columns}
          data={items}
          rowKey="slug"
          onRowClick={handleRowClick}
          emptyMessage={hasFilters ? 'No secrets match the current filter.' : 'No secrets found.'}
          resizable={false}
        />
      </VStack>
    </PageShell>
  );
}
