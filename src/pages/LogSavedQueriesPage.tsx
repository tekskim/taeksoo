import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  ContextMenu,
  EmptyState,
  FilterSearchInput,
  HStack,
  Modal,
  PageHeader,
  PageShell,
  Pagination,
  TabBar,
  Table,
  TopBar,
  Tooltip,
  type AppliedFilter,
  type FilterField,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { LogSidebar } from '@/components/LogSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconAlertTriangle, IconBookmark, IconDotsCircleHorizontal } from '@tabler/icons-react';
import {
  canManageSavedQuery,
  deleteSavedQuery,
  getSavedQueries,
  updateSavedQuery,
  type SavedQuery,
} from '@/services/savedQueriesStore';
import EditSavedQueryDrawer from '@/components/logs/EditSavedQueryDrawer';

const toDisplay = (value: string): string => (value.trim().length > 0 ? value : '-');
const DEFAULT_PAGE_SIZE = 10;

// TDS UX writing(영문) — 테이블 datetime: Mth DD, YYYY HH:mm (24시간, UTC·초 생략)
const MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatDateTime = (isoString: string): string => {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${MONTH_ABBR[d.getMonth()]} ${day}, ${d.getFullYear()} ${h}:${mi}`;
};

const getLevelBadgeTheme = (level: string): 'red' | 'ylw' | 'blu' | 'gre' | 'gry' => {
  if (level === 'CRITICAL' || level === 'ERROR') return 'red';
  if (level === 'WARN') return 'ylw';
  if (level === 'INFO') return 'blu';
  return 'gry';
};

const FILTER_FIELDS: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Search by name...' },
  {
    id: 'level',
    label: 'Level',
    type: 'select',
    options: [
      { value: 'CRITICAL', label: 'CRITICAL' },
      { value: 'ERROR', label: 'ERROR' },
      { value: 'WARN', label: 'WARN' },
      { value: 'INFO', label: 'INFO' },
      { value: 'DEBUG', label: 'DEBUG' },
    ],
  },
  { id: 'query', label: 'Query', type: 'text', placeholder: 'Search by query...' },
  { id: 'appId', label: 'App Identifier', type: 'text', placeholder: 'Search by app ID...' },
  { id: 'partition', label: 'Partition', type: 'text', placeholder: 'Search by partition...' },
];

const SavedQueriesListPage = (): ReactElement => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(() => getSavedQueries());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [editTarget, setEditTarget] = useState<SavedQuery | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedQuery | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('preview') === 'edit') {
      const queries = getSavedQueries();
      if (queries.length > 0) setEditTarget(queries[0]);
    }
  }, []);

  const filterMap = useMemo(
    () => Object.fromEntries(appliedFilters.map((f) => [f.fieldId, f.value])),
    [appliedFilters]
  );

  const filteredSavedQueries = useMemo(() => {
    const nameFilter = (filterMap.name ?? '').toLowerCase();
    const queryFilter = (filterMap.query ?? '').toLowerCase();
    const appIdFilter = (filterMap.appId ?? '').toLowerCase();
    const partitionFilter = (filterMap.partition ?? '').toLowerCase();
    // Level is select-type: collect all selected level values (OR logic)
    const levelFilters = appliedFilters
      .filter((f) => f.fieldId === 'level')
      .map((f) => f.value.toUpperCase());

    return [...savedQueries]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((sq) => {
        const byName = !nameFilter || sq.name.toLowerCase().includes(nameFilter);
        const byQuery = !queryFilter || sq.query.toLowerCase().includes(queryFilter);
        const byAppId = !appIdFilter || sq.appId.toLowerCase().includes(appIdFilter);
        const byPartition =
          !partitionFilter || (sq.partition ?? '').toLowerCase().includes(partitionFilter);
        const byLevel =
          levelFilters.length === 0 ||
          levelFilters.some((lf) => sq.levels.some((l) => l.toUpperCase() === lf));
        return byName && byQuery && byAppId && byPartition && byLevel;
      });
  }, [savedQueries, filterMap, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredSavedQueries.length / DEFAULT_PAGE_SIZE));
  const pagedSavedQueries = useMemo(() => {
    const start = (currentPage - 1) * DEFAULT_PAGE_SIZE;
    return filteredSavedQueries.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [currentPage, filteredSavedQueries]);

  const selectedSavedQueries = useMemo(
    () => savedQueries.filter((item) => selectedRows.includes(item.id)),
    [savedQueries, selectedRows]
  );
  const hasForbiddenSelection = useMemo(
    () => selectedSavedQueries.some((item) => !canManageSavedQuery(item)),
    [selectedSavedQueries]
  );
  const canBulkDelete = selectedSavedQueries.length > 0 && !hasForbiddenSelection;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    const currentPageIds = new Set(pagedSavedQueries.map((item) => item.id));
    setSelectedRows((prev) => prev.filter((id) => currentPageIds.has(id)));
  }, [pagedSavedQueries]);

  const handleFiltersChange = useCallback((filters: AppliedFilter[]) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleDeleteConfirm = (): void => {
    if (!deleteTarget) return;
    setSavedQueries(deleteSavedQuery(deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleBulkDeleteConfirm = (): void => {
    let nextQueries = getSavedQueries();
    selectedSavedQueries.forEach((item) => {
      nextQueries = deleteSavedQuery(item.id);
    });
    setSavedQueries(nextQueries);
    setSelectedRows([]);
    setBulkDeleteOpen(false);
  };

  const getRowMenuItems = (row: SavedQuery): ContextMenuItem[] => {
    const canManage = canManageSavedQuery(row);
    return [
      {
        id: 'edit',
        label: 'Edit',
        onClick: () => setEditTarget(row),
        disabled: !canManage,
      },
      {
        id: 'delete',
        label: 'Delete',
        status: 'danger',
        onClick: () => setDeleteTarget(row),
        disabled: !canManage,
      },
    ];
  };

  const columns: TableColumn<SavedQuery>[] = [
    {
      key: 'name',
      header: 'Name',
      minWidth: 200,
      render: (_value, row) => <span className="text-body-md">{toDisplay(row.name)}</span>,
    },
    {
      key: 'levels',
      header: 'Level',
      minWidth: 140,
      render: (_value, row) =>
        row.levels.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.levels.map((level) => (
              <Badge key={level} theme={getLevelBadgeTheme(level)} size="sm" type="subtle">
                {level}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-body-md text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'query',
      header: 'Query',
      render: (_value, row) => (
        <Tooltip content={row.query || '-'}>
          <span className="text-body-md truncate max-w-[200px] block">{toDisplay(row.query)}</span>
        </Tooltip>
      ),
    },
    {
      key: 'appId',
      header: 'App Identifier',
      minWidth: 130,
      render: (_value, row) => <span className="text-body-md">{toDisplay(row.appId)}</span>,
    },
    {
      key: 'partition',
      header: 'Partition',
      minWidth: 120,
      render: (_value, row) => (
        <span className="text-body-md">{toDisplay(row.partition ?? '')}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      minWidth: 160,
      render: (_value, row) => (
        <span className="text-body-md">{formatDateTime(row.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      minWidth: 48,
      render: (_value, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getRowMenuItems(row)} trigger="click" align="right">
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
              aria-label="Actions"
            >
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--action-icon-color)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<LogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
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
          breadcrumb={<Breadcrumb items={[{ label: 'Logs' }, { label: 'Saved Queries' }]} />}
        />
      }
    >
      <div className="flex flex-col gap-6 w-full py-6">
        <PageHeader title="Saved Queries" />

        <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4">
          {/* Toolbar */}
          <HStack gap={2} align="center" className="flex-wrap">
            <FilterSearchInput
              filters={FILTER_FIELDS}
              appliedFilters={appliedFilters}
              onFiltersChange={handleFiltersChange}
              placeholder="Search saved queries..."
              size="sm"
              className="flex-1 min-w-[240px]"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => setBulkDeleteOpen(true)}
              disabled={!canBulkDelete}
            >
              {selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Delete'}
            </Button>
          </HStack>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredSavedQueries.length}
            selectedCount={selectedRows.length}
          />

          {pagedSavedQueries.length === 0 ? (
            <EmptyState
              variant="inline"
              icon={<IconBookmark size={48} stroke={1} />}
              title={appliedFilters.length > 0 ? 'No results found' : 'No saved queries yet'}
              description={
                appliedFilters.length > 0
                  ? 'Try adjusting your search.'
                  : 'Save a query from Log Explorer to reuse it later.'
              }
            />
          ) : (
            <Table
              columns={columns}
              data={pagedSavedQueries}
              rowKey="id"
              selectable
              isRowSelectable={(row) => canManageSavedQuery(row)}
              selectedKeys={selectedRows}
              onSelectionChange={(keys) => setSelectedRows(keys.map(String))}
            />
          )}
        </div>

        {/* Edit Drawer */}
        <EditSavedQueryDrawer
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          savedQuery={editTarget ?? { name: '', query: '', appId: '', levels: [], partition: '' }}
          onSave={(values) => {
            if (!editTarget) return;
            const updated = updateSavedQuery(editTarget.id, values);
            if (updated) setSavedQueries(getSavedQueries());
          }}
        />

        {/* Delete single confirm — TDS Delete (Single) template */}
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Saved Query"
        >
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]">Saved query name</span>
            <span className="text-body-md text-[var(--color-text-default)]">
              {deleteTarget?.name ?? ''}
            </span>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] px-4 py-3 flex gap-3 items-start">
            <IconAlertTriangle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
            />
            <span className="text-body-md text-[var(--color-text-default)]">
              Removing the selected instances is permanent and cannot be undone.
            </span>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleDeleteConfirm} className="flex-1">
              Delete
            </Button>
          </div>
        </Modal>

        {/* Bulk delete confirm — TDS Delete (Multiple) template */}
        <Modal
          isOpen={bulkDeleteOpen}
          onClose={() => setBulkDeleteOpen(false)}
          title="Delete Saved Queries"
        >
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]">Saved query names</span>
            <ul className="flex flex-col gap-1 list-disc pl-5">
              {selectedSavedQueries.map((item) => (
                <li key={item.id} className="text-body-md text-[var(--color-text-default)]">
                  {toDisplay(item.name)}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] px-4 py-3 flex gap-3 items-start">
            <IconAlertTriangle
              size={16}
              className="text-[var(--color-state-danger)] shrink-0 mt-0.5"
            />
            <span className="text-body-md text-[var(--color-text-default)]">
              Removing the selected instances is permanent and cannot be undone.
            </span>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="md"
              onClick={() => setBulkDeleteOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleBulkDeleteConfirm} className="flex-1">
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </PageShell>
  );
};

export default SavedQueriesListPage;
