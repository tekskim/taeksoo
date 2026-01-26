import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import {
  Badge,
  Button,
  ConfirmModal,
  ContextMenu,
  ListToolbar,
  Modal,
  Pagination,
  SearchInput,
  Table,
  Tabs,
  TabList,
  Tab,
  VStack,
  ProgressBar,
  type ContextMenuItem,
  type TableColumn,
} from '@/design-system';
import { IconDotsCircleHorizontal, IconDownload, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  CLOUD_BUILDER_SLUGS,
  getCloudBuilderListConfig,
  type BadgeTone,
  type CloudBuilderSlug,
  type ListColumn,
} from './consoleListConfig';
import { Textarea } from '@/design-system';

function isCloudBuilderSlug(v: string | undefined): v is CloudBuilderSlug {
  return !!v && (CLOUD_BUILDER_SLUGS as readonly string[]).includes(v);
}

function toneToBadgeTheme(tone: BadgeTone) {
  switch (tone) {
    case 'success':
      return 'green';
    case 'warning':
      return 'yellow';
    case 'danger':
      return 'red';
    case 'blue':
      return 'blue';
    case 'neutral':
    default:
      return 'gray';
  }
}

function buildTableColumns(
  cols: ListColumn[],
  {
    onRowAction,
    linkifyColumnKeys,
  }: {
    onRowAction: (actionId: string, row: Record<string, string> & { id: string }) => void;
    linkifyColumnKeys?: string[];
  },
): TableColumn<Record<string, string> & { id: string }>[] {
  return cols.map((c) => {
    const column: TableColumn<Record<string, string> & { id: string }> = {
      key: c.key,
      label: c.label,
      sortable: c.sortable,
      width: c.width,
      align: c.align,
    };

    if (c.key === 'storageCapacityGiB') {
      column.render = (_value, row) => {
        const used = Number(row.storageUsedGiB ?? 0);
        const total = Number(row.storageTotalGiB ?? 0);
        const safeUsed = Number.isFinite(used) ? used : 0;
        const safeTotal = Number.isFinite(total) ? total : 0;
        return (
          <div className="flex flex-col gap-2 w-full">
            <ProgressBar value={safeUsed} max={safeTotal} showValue={false} />
            <div className="text-[12px] text-[var(--color-text-default)]">
              {safeUsed.toFixed(2)} / {safeTotal.toFixed(2)}
            </div>
          </div>
        );
      };
      return column;
    }

    // Service-like statuses should be rendered as dot + text (like OpenStack UIs)
    if (c.key === 'serviceStatus' || c.key === 'serviceState' || c.key === 'status') {
      column.render = (value) => {
        const v = String(value ?? '') || '-';
        // Only apply for typical state words; fall back to raw text otherwise.
        const isKnown = v === 'Enabled' || v === 'Disabled' || v === 'Up' || v === 'Down';
        if (!isKnown) {
          return <span className="text-[12px] text-[var(--color-text-default)]">{v}</span>;
        }
        const isGood = v === 'Enabled' || v === 'Up';
        return (
          <div className="inline-flex items-center gap-2">
            <span
              className={`inline-block size-2 rounded-full ${
                isGood ? 'bg-[var(--color-state-success)]' : 'bg-[var(--color-border-strong)]'
              }`}
              aria-hidden="true"
            />
            <span className="text-[12px] text-[var(--color-text-default)]">{v}</span>
          </div>
        );
      };
      return column;
    }

    if (c.kind === 'mono') {
      column.render = (value) => <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">{value ?? '-'}</span>;
      return column;
    }

    if (c.kind === 'badge') {
      column.render = (value) => {
        const v = String(value ?? '');
        const tone = c.badgeTones?.[v] ?? 'neutral';
        return (
          <Badge theme={toneToBadgeTheme(tone)} type="subtle" size="sm">
            {v || '-'}
          </Badge>
        );
      };
      return column;
    }

    // 기본 text (필요한 경우에만 linkify)
    const shouldLink = !!linkifyColumnKeys?.includes(c.key);
    if (shouldLink) {
      column.render = (value, row) => (
        <button
          type="button"
          className="font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2 text-left"
          onClick={(e) => {
            e.stopPropagation();
            onRowAction('open-detail', row);
          }}
        >
          {String(value ?? '-') || '-'}
        </button>
      );
    }

    return column;
  });
}

export function CloudBuilderConsolePage() {
  const navigate = useNavigate();
  const params = useParams();

  // /cloudbuilder 또는 /cloudbuilder/:slug
  const slug: CloudBuilderSlug = isCloudBuilderSlug(params.slug) ? params.slug : 'discovery';
  const config = useMemo(() => getCloudBuilderListConfig(slug), [slug]);

  const hasTabs = !!config.tabs && config.tabs.length > 0;
  const [activeTabId, setActiveTabId] = useState<string>(config.tabs?.[0]?.id ?? '');

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(config.rows);
  const [selected, setSelected] = useState<string[]>([]);

  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [rowToRemove, setRowToRemove] = useState<(Record<string, string> & { id: string }) | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<null | {
    rowId: string;
    nextStatus: string;
  }>(null);
  const [disableReason, setDisableReason] = useState('');

  // slug 변경 시 화면 상태를 config 기준으로 리셋
  useEffect(() => {
    setRows(config.rows);
    setSelected([]);
    setSearchQuery('');
    setCurrentPage(1);
    setConfirmRemoveOpen(false);
    setRowToRemove(null);
    setStatusModalOpen(false);
    setStatusModal(null);
    setDisableReason('');
    setActiveTabId(config.tabs?.[0]?.id ?? '');
  }, [config.rows, config.slug]);

  const activeTab = useMemo(() => {
    if (!hasTabs) return null;
    return config.tabs!.find((t) => t.id === activeTabId) ?? config.tabs![0]!;
  }, [hasTabs, config.tabs, activeTabId]);

  // 탭 변경 시 rows/검색/페이지 등 리셋
  useEffect(() => {
    if (!hasTabs || !activeTab) return;
    setRows(activeTab.rows);
    setSelected([]);
    setSearchQuery('');
    setCurrentPage(1);
    setConfirmRemoveOpen(false);
    setRowToRemove(null);
    setStatusModalOpen(false);
    setStatusModal(null);
    setDisableReason('');
  }, [hasTabs, activeTabId]);

  const rowsPerPage = 10;

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => Object.values(r).join(' ').toLowerCase().includes(q));
  }, [rows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filteredRows.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  // NOTE: 페이지 타이틀은 항상 config.title (탭에는 title이 없음)
  const pageTitle = config.title;
  // 탭이 있으면 탭이 columns/rows/settings을 오버라이드
  const viewConfig = activeTab ?? config;
  const selectable = viewConfig.showCheckboxColumn ?? true;
  const showBulkDelete = viewConfig.showBulkDelete ?? true;
  const showActionColumn = viewConfig.showActionColumn ?? true;
  const statusAction = viewConfig.statusAction ?? config.statusAction;

  const onRowAction = (actionId: string, row: Record<string, string> & { id: string }) => {
    if (actionId === 'open-detail') {
      // detailHrefBase가 있는 페이지는 detail로 이동
      const base = viewConfig.detailHrefBase ?? config.detailHrefBase;
      if (base) {
        navigate(`${base}/${row.id}`);
        return;
      }
      // detail이 없는 페이지는 클릭 동작 없음
      return;
    }
    if (actionId === 'remove') {
      setRowToRemove(row);
      setConfirmRemoveOpen(true);
      return;
    }
    if (actionId === 'set-status-enabled') {
      setDisableReason('');
      setStatusModal({ rowId: row.id, nextStatus: 'Enabled' });
      setStatusModalOpen(true);
      return;
    }
    if (actionId === 'set-status-disabled') {
      setDisableReason('');
      setStatusModal({ rowId: row.id, nextStatus: 'Disabled' });
      setStatusModalOpen(true);
      return;
    }
    // 나머지는 페이지 확장하면서 실제 라우트/폼으로 연결
    window.alert(`${actionId}: Coming Soon`);
  };

  const columns = useMemo(() => {
    const base = buildTableColumns(viewConfig.columns, {
      onRowAction,
      linkifyColumnKeys: viewConfig.linkifyColumnKeys ?? config.linkifyColumnKeys,
    });

    if (!showActionColumn) return base;

    const actionCol: TableColumn<Record<string, string> & { id: string }> = {
      key: 'actions',
      label: 'Action',
      width: '64px',
      align: 'center',
      render: (_, row) => {
        // compute-services 화면은 어떤 탭이든 동일하게 Enable/Disable 액션을 제공한다 (UI only).
        const items: ContextMenuItem[] =
          config.slug === 'compute-services'
            ? [
                { id: 'enable', label: 'Enable', onClick: () => onRowAction('set-status-enabled', row) },
                { id: 'disable', label: 'Disable', onClick: () => onRowAction('set-status-disabled', row) },
              ]
            : statusAction
              ? [
                  { id: 'enable', label: 'Enable', onClick: () => onRowAction('set-status-enabled', row) },
                  { id: 'disable', label: 'Disable', onClick: () => onRowAction('set-status-disabled', row) },
                ]
              : (viewConfig.actionMenu?.items ?? []).map((it) => {
                  if (it.kind === 'link') {
                    return {
                      id: it.id,
                      label: it.label,
                      status: it.status,
                      onClick: () => navigate(it.href),
                    };
                  }
                  return {
                    id: it.id,
                    label: it.label,
                    status: it.status,
                    onClick: () => onRowAction(it.actionId, row),
                  };
                });

        if (items.length === 0) return <span className="text-[var(--color-text-muted)]">-</span>;

        return (
          <ContextMenu items={items} trigger="click">
            <button
              type="button"
              aria-label="Row actions"
              className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
            >
              <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
            </button>
          </ContextMenu>
        );
      },
    };

    return [...base, actionCol];
  }, [viewConfig, statusAction, navigate, showActionColumn]);

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    setRows((prev) => prev.filter((r) => !selected.includes(r.id)));
    setSelected([]);
    setCurrentPage(1);
  };

  const handleRemoveConfirm = () => {
    if (!rowToRemove) return;
    const id = rowToRemove.id;
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => prev.filter((x) => x !== id));
    setConfirmRemoveOpen(false);
    setRowToRemove(null);
    setCurrentPage(1);
  };

  const handleRemoveCancel = () => {
    setConfirmRemoveOpen(false);
    setRowToRemove(null);
  };

  const handleCreate = () => {
    if (config.createHref) {
      navigate(config.createHref);
      return;
    }
    window.alert('Create: Coming Soon');
  };

  const applyStatusChange = () => {
    if (!statusModal) return;
    const requireReason = !!statusAction?.requireDisableReason;
    if (statusModal.nextStatus === 'Disabled' && requireReason && !disableReason.trim()) return;

    // UI only: 실제 동작(상태 변경/API)은 하지 않고 모달만 닫는다.
    setStatusModalOpen(false);
    setStatusModal(null);
    setDisableReason('');
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setStatusModal(null);
    setDisableReason('');
  };

  return (
    <AppLayout>
      <div className="pt-4 px-8 pb-6 bg-[var(--color-surface-default)] w-full">
        <VStack gap={3} className="w-full">
          <div className="flex items-center justify-between h-8">
            <h1 className="text-[length:var(--font-size-16)] font-semibold leading-6 text-[var(--color-text-default)]">
              {pageTitle}
            </h1>
            {config.createLabel && (
              <Button leftIcon={<IconPlus size={12} />} onClick={handleCreate}>
                {config.createLabel}
              </Button>
            )}
          </div>

          {hasTabs && config.tabs && (
            <Tabs
              value={activeTabId}
              onChange={(v) => setActiveTabId(v)}
              variant="underline"
              size="sm"
            >
              <TabList>
                {config.tabs.map((t) => (
                  <Tab key={t.id} value={t.id}>
                    {t.label}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          )}

          <ListToolbar
            primaryActions={
              <ListToolbar.Actions>
                <div className="w-[var(--search-input-width)]">
                  <SearchInput
                    placeholder={activeTab?.searchPlaceholder ?? config.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    onClear={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    size="sm"
                    fullWidth
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<IconDownload size={12} />}
                  aria-label="Download"
                  onClick={() => window.alert('Download: Coming Soon')}
                />
              </ListToolbar.Actions>
            }
            bulkActions={
              selectable && showBulkDelete ? (
                <ListToolbar.Actions>
                  <Button
                    variant="muted"
                    size="sm"
                    leftIcon={<IconTrash size={12} />}
                    disabled={selected.length === 0}
                    onClick={handleDeleteSelected}
                  >
                    Delete
                  </Button>
                </ListToolbar.Actions>
              ) : undefined
            }
          />

          {filteredRows.length > 0 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showSettings={hasTabs}
              onSettingsClick={() => window.alert('View settings: Coming Soon')}
              totalItems={filteredRows.length}
              selectedCount={selected.length}
            />
          )}

          <Table<Record<string, string> & { id: string }>
            columns={columns}
            data={paged}
            rowKey="id"
            emptyMessage="No data found"
            selectable={selectable}
            selectedKeys={selected}
            onSelectionChange={setSelected}
          />
        </VStack>
      </div>

      <ConfirmModal
        isOpen={confirmRemoveOpen}
        onClose={handleRemoveCancel}
        onConfirm={handleRemoveConfirm}
        title="Remove item"
        description="선택한 항목을 삭제할까요?"
        confirmText="Confirm"
        cancelText="Cancel"
        confirmVariant="danger"
        infoLabel="ID"
        infoValue={rowToRemove?.id}
      />

      {/* Enable/Disable Modal (UI only) */}
      <Modal
        isOpen={statusModalOpen}
        onClose={closeStatusModal}
        title={statusModal?.nextStatus === 'Disabled' ? 'Disable compute service' : 'Enable compute service'}
        description={
          statusModal?.nextStatus === 'Disabled'
            ? 'Change this service status to Disabled?'
            : 'Change this service status to Enabled?'
        }
        className="w-[720px] max-w-[calc(100vw-32px)]"
      >
        {statusModal ? (
          <div className="flex flex-col">
            {/* Form rows */}
            {statusModal.nextStatus === 'Disabled' && !!statusAction?.requireDisableReason ? (
              <div className="py-4">
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-12 md:col-span-4 text-[14px] text-[var(--color-text-default)]">
                    <span>Reason</span>{' '}
                    <span className="ml-1 text-[var(--color-state-danger)]">*</span>
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <Textarea
                      placeholder="Enter a reason for disabling"
                      value={disableReason}
                      onChange={(e) => setDisableReason(e.target.value)}
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Footer actions (align right like screenshot) */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--color-border-subtle)]">
              <Button variant="outline" size="md" onClick={closeStatusModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={applyStatusChange}
                disabled={
                  statusModal.nextStatus === 'Disabled' &&
                  !!statusAction?.requireDisableReason &&
                  !disableReason.trim()
                }
              >
                {statusModal.nextStatus === 'Disabled' ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </AppLayout>
  );
}

export default CloudBuilderConsolePage;


