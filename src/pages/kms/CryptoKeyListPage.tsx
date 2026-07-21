import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  PageHeader,
  FilterSearchInput,
  type AppliedFilter,
  ListToolbar,
  Pagination,
  Modal,
  FormField,
  Textarea,
  InfoBox,
  Table,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { KmsSidebar } from '@/components/KmsSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconDotsCircleHorizontal,
  IconChevronUp,
  IconChevronDown,
  IconSelector,
} from '@tabler/icons-react';
import { KmsStateBadge, formatDate } from './shared';
import type {
  CryptoKeyAlgorithm,
  CryptoKeyListParams,
  CryptoKeyListResult,
  CryptoKeyPurpose,
  CryptoKeySortField,
  CryptoKeySortOrder,
  CryptoKeySummary,
  EncryptionKeyState,
} from './models/cryptoKey';
import {
  listMockCryptoKeys,
  rotateMockCryptoKey,
  updateMockCryptoKeyStatus,
} from './mocks/cryptoKeysRepository';

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;
const REASON_MAX_LENGTH = 500;

type KeyListActionType = 'archive' | 'restore' | 'destroy' | 'rotate';

type KeyListAction = {
  label: string;
  actionType: KeyListActionType;
  danger?: boolean;
};

/** 상태별 row context-menu 액션 (kms CryptoKeyListPage 정책) */
const KEY_LIST_STATUS_ACTIONS: Partial<Record<EncryptionKeyState, KeyListAction[]>> = {
  active: [
    { label: 'Rotate now', actionType: 'rotate' },
    { label: 'Archive', actionType: 'archive' },
    { label: 'Destroy', actionType: 'destroy', danger: true },
  ],
  deactivated: [
    { label: 'Archive', actionType: 'archive' },
    { label: 'Destroy', actionType: 'destroy', danger: true },
  ],
  archived: [
    { label: 'Restore', actionType: 'restore' },
    { label: 'Destroy', actionType: 'destroy', danger: true },
  ],
};

const KEY_LIST_ACTION_CONFIG: Record<
  KeyListActionType,
  { title: string; confirmLabel: string; variant: 'primary' | 'danger' }
> = {
  rotate: { title: 'Confirm key rotation', confirmLabel: 'Rotate now', variant: 'primary' },
  archive: { title: 'Confirm key archive', confirmLabel: 'Archive', variant: 'primary' },
  restore: { title: 'Confirm key restore', confirmLabel: 'Restore', variant: 'primary' },
  destroy: { title: 'Confirm key destruction', confirmLabel: 'Destroy', variant: 'danger' },
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CryptoKeyListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<CryptoKeySortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<CryptoKeySortOrder>('desc');

  const [result, setResult] = useState<CryptoKeyListResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [confirmModal, setConfirmModal] = useState<{
    actionType: KeyListActionType;
    keyName: string;
    slug: string;
  } | null>(null);
  const [confirmReason, setConfirmReason] = useState('');

  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  // ── Data loading (mock repository, async) ───────────────────────────────────

  const collectFilterValues = (fieldId: string): string[] =>
    appliedFilters.filter((f) => f.fieldId === fieldId).map((f) => f.value);

  const requestParams = useMemo<CryptoKeyListParams>(
    () => ({
      search: collectFilterValues('name')[0] || undefined,
      algorithms: collectFilterValues('algorithm') as CryptoKeyAlgorithm[],
      purposes: collectFilterValues('purpose') as CryptoKeyPurpose[],
      statuses: collectFilterValues('status') as EncryptionKeyState[],
      sortBy,
      sortOrder,
      page,
      pageSize: PAGE_SIZE,
    }),

    [appliedFilters, page, sortBy, sortOrder]
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    listMockCryptoKeys(requestParams).then((res) => {
      if (cancelled) return;
      setResult(res);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [requestParams, refreshKey]);

  const items = result?.items ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleFiltersChange = (next: AppliedFilter[]) => {
    setAppliedFilters(next);
    setPage(1);
  };

  const handleSortToggle = (field: CryptoKeySortField) => {
    setPage(1);
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleKeyAction = (row: CryptoKeySummary, actionType: KeyListActionType) => {
    setConfirmReason('');
    setConfirmModal({ actionType, keyName: row.name, slug: row.slug });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    const { actionType, slug } = confirmModal;
    if (actionType === 'rotate') {
      await rotateMockCryptoKey(slug);
    } else {
      const nextStatus: EncryptionKeyState =
        actionType === 'archive'
          ? 'archived'
          : actionType === 'restore'
            ? 'deactivated'
            : 'destroyed';
      await updateMockCryptoKeyStatus(slug, nextStatus);
    }
    setConfirmModal(null);
    setConfirmReason('');
    setRefreshKey((k) => k + 1);
  };

  // ── Sortable column header (repository 전체 정렬 — Table 내부 정렬 미사용) ──

  const renderSortableHeader = (label: string, field: CryptoKeySortField) => (
    <button
      type="button"
      onClick={() => handleSortToggle(field)}
      className="flex items-center gap-1 hover:text-[var(--color-text-default)] transition-colors"
    >
      <span>{label}</span>
      {sortBy === field ? (
        sortOrder === 'asc' ? (
          <IconChevronUp size={14} stroke={1} className="text-[var(--color-action-primary)]" />
        ) : (
          <IconChevronDown size={14} stroke={1} className="text-[var(--color-action-primary)]" />
        )
      ) : (
        <IconSelector size={14} stroke={1} className="text-[var(--color-text-subtle)]" />
      )}
    </button>
  );

  // ── Table columns ───────────────────────────────────────────────────────────

  const columns: TableColumn<CryptoKeySummary>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_: any, row: CryptoKeySummary) => <KmsStateBadge status={row.status} />,
    },
    {
      key: 'name',
      label: 'Key name',
      flex: 1,
      minWidth: columnMinWidths.name,
      render: (_: any, row: CryptoKeySummary) => (
        <button
          type="button"
          className="block max-w-full truncate text-left text-body-md font-medium text-[var(--color-action-primary)] hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/kms/keys/${row.slug}`);
          }}
        >
          {row.name}
        </button>
      ),
    },
    {
      key: 'algorithm',
      label: 'Algorithm',
      flex: 1,
      minWidth: columnMinWidths.algorithm,
      render: (v: any) => (
        <span className="text-body-sm font-mono text-[var(--color-text-subtle)]">{v}</span>
      ),
    },
    {
      key: 'purpose',
      label: 'Key purpose',
      flex: 1,
      minWidth: columnMinWidths.algorithm,
      render: (v: any) => (
        <span className="text-body-sm text-[var(--color-text-subtle)] truncate block">{v}</span>
      ),
    },
    {
      key: 'currentVersion',
      label: 'Current version',
      width: columnMinWidths.version,
      align: 'center',
      resizable: false,
      render: (v: any) => <span className="text-body-sm font-mono">{`v${v}`}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      headerRender: () => renderSortableHeader('Created at', 'createdAt'),
      render: (v: any) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {v ? formatDate(v) : '-'}
        </span>
      ),
    },
    {
      key: 'nextRotationAt',
      label: 'Next rotation at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      headerRender: () => renderSortableHeader('Next rotation at', 'nextRotationAt'),
      render: (v: any) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {v ? formatDate(v) : '-'}
        </span>
      ),
    },
    {
      key: '_action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      resizable: false,
      render: (_: any, row: CryptoKeySummary) => {
        const rowActions = KEY_LIST_STATUS_ACTIONS[row.status] ?? [];
        if (rowActions.length === 0) {
          return <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>;
        }
        const menuItems: ContextMenuItem[] = rowActions.map((action) => ({
          id: action.actionType,
          label: action.label,
          status: action.danger ? 'danger' : 'default',
          onClick: () => handleKeyAction(row, action.actionType),
        }));
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button
                aria-label={`Actions for ${row.name}`}
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--color-text-subtle)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  const confirmConfig = confirmModal ? KEY_LIST_ACTION_CONFIG[confirmModal.actionType] : null;

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
            <Breadcrumb
              items={[{ label: 'KMS', href: '/kms/overview' }, { label: 'Encryption Keys' }]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        <PageHeader title="Encryption keys" />

        {/* List Toolbar — filter chips: name / algorithm / purpose / status */}
        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <FilterSearchInput
                size="sm"
                filters={[
                  {
                    id: 'name',
                    label: 'Key name',
                    type: 'text',
                    placeholder: 'e.g. iam-master-key',
                  },
                  {
                    id: 'algorithm',
                    label: 'Algorithm',
                    type: 'select',
                    options: [
                      { value: 'AES-256', label: 'AES-256' },
                      { value: 'RSA-2048', label: 'RSA-2048' },
                      { value: 'RSA-4096', label: 'RSA-4096' },
                    ],
                  },
                  {
                    id: 'purpose',
                    label: 'Key purpose',
                    type: 'select',
                    options: [
                      { value: 'Encrypt / Decrypt', label: 'Encrypt / Decrypt' },
                      { value: 'Sign / Verify', label: 'Sign / Verify' },
                    ],
                  },
                  {
                    id: 'status',
                    label: 'Status',
                    type: 'select',
                    options: [
                      { value: 'active', label: 'Active' },
                      { value: 'deactivated', label: 'Deactivated' },
                      { value: 'archived', label: 'Archived' },
                    ],
                  },
                ]}
                appliedFilters={appliedFilters}
                onFiltersChange={handleFiltersChange}
                placeholder="Search keys by attributes"
                className="w-[var(--search-input-width)]"
              />
            </ListToolbar.Actions>
          }
        />

        {/* Pagination — table 상단 좌측 */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={total}
        />

        {/* Table */}
        <Table<CryptoKeySummary>
          columns={columns}
          data={items}
          rowKey="slug"
          onRowClick={(row) => navigate(`/kms/keys/${row.slug}`)}
          resizable={false}
          emptyMessage={
            isLoading
              ? 'Loading encryption keys...'
              : appliedFilters.length > 0
                ? 'No encryption keys match the current filter.'
                : 'No encryption keys to display.'
          }
        />
      </VStack>

      {/* Action confirm modal — reason 필수 입력 */}
      {confirmModal && confirmConfig && (
        <Modal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          title={confirmConfig.title}
          className="w-[400px]"
        >
          <VStack gap={4}>
            <InfoBox.Group>
              <InfoBox label="Key name" value={confirmModal.keyName} />
            </InfoBox.Group>
            <FormField label="Reason" required>
              <Textarea
                value={confirmReason}
                onChange={(e) => setConfirmReason(e.target.value)}
                maxLength={REASON_MAX_LENGTH}
                placeholder="Enter reason for change"
                rows={3}
                fullWidth
              />
            </FormField>
            <HStack gap={2} className="w-full">
              <Button variant="secondary" className="flex-1" onClick={() => setConfirmModal(null)}>
                Cancel
              </Button>
              <Button
                variant={confirmConfig.variant}
                className="flex-1"
                disabled={confirmReason.trim().length === 0}
                onClick={handleConfirmAction}
              >
                {confirmConfig.confirmLabel}
              </Button>
            </HStack>
          </VStack>
        </Modal>
      )}
    </PageShell>
  );
}
