import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Badge } from '@shared/components/Badge';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { Title } from '@shared/components/Title';
import { Textarea } from '@shared/components/Textarea';
import { ProgressBar } from '@shared/components/ProgressBar';
import { ActionModal } from '@shared/components/ActionModal';
import { DeleteResourceModal } from '@shared/components/DeleteResourceModal';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKeyWithValue, FilterKey } from '@shared/components/FilterSearch';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { IconPlus, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import {
  CLOUD_BUILDER_SLUGS,
  getCloudBuilderListConfig,
  type BadgeTone,
  type CloudBuilderSlug,
  type ListColumn,
} from '../data/consoleListConfig';

type RowData = Record<string, string> & { id: string };

function isCloudBuilderSlug(v: string | undefined): v is CloudBuilderSlug {
  return !!v && (CLOUD_BUILDER_SLUGS as readonly string[]).includes(v);
}

function toneToBadgeTheme(tone: BadgeTone): 'gre' | 'gry' | 'blu' | 'ylw' | 'red' {
  switch (tone) {
    case 'success':
      return 'gre';
    case 'warning':
      return 'ylw';
    case 'danger':
      return 'red';
    case 'blue':
      return 'blu';
    case 'neutral':
    default:
      return 'gry';
  }
}

function statusMapToVariant(
  statusMap: Record<string, string> | undefined,
  value: string
): StatusVariant {
  const mapped = statusMap?.[value];
  if (mapped === 'active') return 'active';
  if (mapped === 'error') return 'error';
  return 'shutoff';
}

function buildTableColumns(cols: ListColumn[], opts: { showActionColumn: boolean }): TableColumn[] {
  const result: TableColumn[] = cols.map((c) => ({
    key: c.key,
    header: c.label,
    sortable: c.sortable,
    width: c.width ? parseInt(c.width) || undefined : undefined,
    align: c.align,
  }));

  if (opts.showActionColumn) {
    result.push({ key: '__actions', header: 'Action', width: 64, align: 'center' });
  }

  return result;
}

export function CloudBuilderConsolePage() {
  const navigate = useNavigate();
  const params = useParams();
  const slug: CloudBuilderSlug = isCloudBuilderSlug(params.slug) ? params.slug : 'discovery';
  const config = useMemo(() => getCloudBuilderListConfig(slug), [slug]);

  const hasTabs = !!config.tabs && config.tabs.length > 0;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || config.tabs?.[0]?.id || '';
  const setActiveTabId = (tabId: string) => setSearchParams({ tab: tabId }, { replace: true });

  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<RowData[]>(config.rows);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [rowToRemove, setRowToRemove] = useState<RowData | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<{ rowId: string; nextStatus: string } | null>(
    null
  );
  const [disableReason, setDisableReason] = useState('');

  useEffect(() => {
    setRows(config.rows);
    setSelected([]);
    setAppliedFilters([]);
    setCurrentPage(1);
    setConfirmRemoveOpen(false);
    setRowToRemove(null);
    setStatusModalOpen(false);
    setStatusModal(null);
    setDisableReason('');
  }, [config.rows, config.slug]);

  const activeTab = useMemo(() => {
    if (!hasTabs) return null;
    return config.tabs!.find((t) => t.id === activeTabId) ?? config.tabs![0]!;
  }, [hasTabs, config.tabs, activeTabId]);

  useEffect(() => {
    if (!hasTabs || !activeTab) return;
    setRows(activeTab.rows);
    setSelected([]);
    setAppliedFilters([]);
    setCurrentPage(1);
  }, [hasTabs, activeTabId]);

  const rowsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return rows;
    return rows.filter((r) =>
      appliedFilters.every((f) => {
        const val = Object.values(r).join(' ').toLowerCase();
        return val.includes(String(f.value ?? '').toLowerCase());
      })
    );
  }, [rows, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filteredRows.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const viewConfig = activeTab ?? config;
  const selectable = viewConfig.showCheckboxColumn ?? true;
  const showBulkDelete = viewConfig.showBulkDelete ?? true;
  const showActionColumn = viewConfig.showActionColumn ?? true;
  const statusAction = viewConfig.statusAction ?? config.statusAction;

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const onRowAction = useCallback(
    (actionId: string, row: RowData) => {
      if (actionId === 'open-detail') {
        const base = viewConfig.detailHrefBase ?? config.detailHrefBase;
        if (base) {
          navigate(`${base}/${row.id}`);
          return;
        }
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
    },
    [config.detailHrefBase, navigate, viewConfig.detailHrefBase]
  );

  const columns = useMemo(
    () => buildTableColumns(viewConfig.columns, { showActionColumn }),
    [viewConfig.columns, showActionColumn]
  );

  const filterKeys: FilterKey[] = useMemo(
    () =>
      viewConfig.columns
        .filter((c) => c.sortable && c.kind !== 'statusIndicator')
        .slice(0, 5)
        .map((c) => ({
          key: c.key,
          label: c.label,
          type: 'input' as const,
          placeholder: `Enter ${c.label.toLowerCase()}...`,
        })),
    [viewConfig.columns]
  );

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  // shared-v2 Table strips width for non-built-in keys in fixed layout;
  // columnWidths prop bypasses this stripping
  const columnWidthOverrides = useMemo(() => {
    const overrides: Record<string, number> = {};
    viewConfig.columns.forEach((c) => {
      if (c.width) {
        const w = parseInt(c.width);
        if (w) overrides[c.key] = w;
      }
    });
    return Object.keys(overrides).length > 0 ? overrides : undefined;
  }, [viewConfig.columns]);

  const colConfigs = viewConfig.columns;
  const linkifyKeys = new Set(viewConfig.linkifyColumnKeys ?? config.linkifyColumnKeys ?? []);

  const renderCell = useCallback(
    (row: RowData, col: TableColumn) => {
      const colConfig = colConfigs.find((c) => c.key === col.key);
      const value = row[col.key] ?? '-';

      if (col.key === '__actions') {
        const statusKey = statusAction?.statusKey;
        const currentStatus = statusKey ? row[statusKey] : undefined;
        const hasStatusAction = !!(config.slug === 'compute-services' || statusAction);

        return (
          <ContextMenu.Root
            direction="bottom-end"
            gap={4}
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          >
            {hasStatusAction ? (
              currentStatus === 'Enabled' ? (
                <ContextMenu.Item action={() => onRowAction('set-status-disabled', row)}>
                  Disable
                </ContextMenu.Item>
              ) : (
                <ContextMenu.Item action={() => onRowAction('set-status-enabled', row)}>
                  Enable
                </ContextMenu.Item>
              )
            ) : (
              (viewConfig.actionMenu?.items ?? []).map((it) => (
                <ContextMenu.Item
                  key={it.id}
                  danger={it.status === 'danger'}
                  action={() =>
                    it.kind === 'link'
                      ? navigate((it as any).href)
                      : onRowAction((it as any).actionId, row)
                  }
                >
                  {it.label}
                </ContextMenu.Item>
              ))
            )}
          </ContextMenu.Root>
        );
      }

      if (col.key === 'storageCapacityGiB') {
        const used = Number(row.storageUsedGiB ?? 0);
        const total = Number(row.storageTotalGiB ?? 0);
        return (
          <ProgressBar
            value={isFinite(used) ? used : 0}
            max={isFinite(total) ? total : 0}
            showValue="absolute"
          />
        );
      }

      if (colConfig?.kind === 'statusIndicator') {
        const variant = statusMapToVariant(colConfig.statusMap, String(value));
        return <StatusIndicator variant={variant} layout="iconOnly" />;
      }

      if (colConfig?.kind === 'badge') {
        const tone = colConfig.badgeTones?.[String(value)] ?? 'neutral';
        return (
          <Badge theme={toneToBadgeTheme(tone)} type="subtle" size="sm">
            {String(value) || '-'}
          </Badge>
        );
      }

      if (colConfig?.kind === 'nameWithSub') {
        const isLink = linkifyKeys.has(col.key);
        return (
          <div className="flex flex-col gap-0.5 min-w-0">
            {isLink ? (
              <button
                type="button"
                className="text-primary font-medium hover:underline text-left truncate bg-transparent border-none p-0 cursor-pointer text-12 leading-16"
                onClick={(e) => {
                  e.stopPropagation();
                  onRowAction('open-detail', row);
                }}
              >
                {String(value) || '-'}
              </button>
            ) : (
              <span className="text-12 font-medium leading-16 text-text truncate">
                {String(value) || '-'}
              </span>
            )}
            {colConfig.subKey && (
              <span className="text-11 leading-16 text-text-muted truncate">
                {colConfig.subLabel ?? colConfig.subKey}: {row[colConfig.subKey] ?? '-'}
              </span>
            )}
          </div>
        );
      }

      if (linkifyKeys.has(col.key)) {
        return (
          <button
            type="button"
            className="text-primary font-medium hover:underline text-left bg-transparent border-none p-0 cursor-pointer text-12 leading-16"
            onClick={(e) => {
              e.stopPropagation();
              onRowAction('open-detail', row);
            }}
          >
            {String(value) || '-'}
          </button>
        );
      }

      if (colConfig?.kind === 'mono') {
        return <span className="text-12 leading-16 text-text">{String(value) || '-'}</span>;
      }

      return undefined;
    },
    [
      colConfigs,
      config.slug,
      linkifyKeys,
      navigate,
      onRowAction,
      statusAction,
      viewConfig.actionMenu?.items,
    ]
  );

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    setRows((prev) => prev.filter((r) => !selected.includes(r.id)));
    setSelected([]);
    setCurrentPage(1);
  };

  const handleRemoveConfirm = () => {
    if (!rowToRemove) return;
    setRows((prev) => prev.filter((r) => r.id !== rowToRemove.id));
    setSelected((prev) => prev.filter((x) => x !== rowToRemove.id));
    setConfirmRemoveOpen(false);
    setRowToRemove(null);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    if (config.createHref) {
      navigate(config.createHref);
      return;
    }
  };

  const applyStatusChange = () => {
    if (!statusModal) return;
    if (
      statusModal.nextStatus === 'Disabled' &&
      !!statusAction?.requireDisableReason &&
      !disableReason.trim()
    )
      return;
    setStatusModalOpen(false);
    setStatusModal(null);
    setDisableReason('');
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setStatusModal(null);
    setDisableReason('');
  };

  const tableContent = (
    <>
      {selectable ? (
        <SelectableTable<RowData>
          columns={columns}
          rows={paged}
          selectionType="checkbox"
          selectedRows={selected}
          onRowSelectionChange={setSelected}
          getRowId={(row) => row.id}
          sort={sort}
          order={order}
          onSortChange={handleSortChange}
          stickyLastColumn={showActionColumn}
          columnWidths={columnWidthOverrides}
        >
          {paged.map((row) => (
            <Table.Tr key={row.id} rowData={row}>
              {columns.map((col) => {
                const cell = renderCell(row, col);
                return (
                  <Table.Td
                    key={col.key}
                    rowData={row}
                    column={col}
                    preventClickPropagation={col.key === '__actions'}
                  >
                    {cell !== undefined ? cell : (row[col.key] ?? '-')}
                  </Table.Td>
                );
              })}
            </Table.Tr>
          ))}
        </SelectableTable>
      ) : (
        <Table<RowData>
          columns={columns}
          rows={paged}
          sort={sort}
          order={order}
          onSortChange={handleSortChange}
          stickyLastColumn={showActionColumn}
          columnWidths={columnWidthOverrides}
        >
          {paged.map((row) => (
            <Table.Tr key={row.id} rowData={row}>
              {columns.map((col) => {
                const cell = renderCell(row, col);
                return (
                  <Table.Td
                    key={col.key}
                    rowData={row}
                    column={col}
                    preventClickPropagation={col.key === '__actions'}
                  >
                    {cell !== undefined ? cell : (row[col.key] ?? '-')}
                  </Table.Td>
                );
              })}
            </Table.Tr>
          ))}
        </Table>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title={config.title} />
        {config.createLabel && (
          <Button variant="primary" size="md" onClick={handleCreate}>
            <IconPlus size={12} /> {config.createLabel}
          </Button>
        )}
      </div>

      {hasTabs && config.tabs && (
        <Tabs size="sm" variant="line" activeTabId={activeTabId} onChange={setActiveTabId}>
          {config.tabs.map((t) => (
            <Tab key={t.id} id={t.id} label={t.label}>
              {null}
            </Tab>
          ))}
        </Tabs>
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder={activeTab?.searchPlaceholder ?? config.searchPlaceholder}
            defaultFilterKey={filterKeys[0]?.key ?? 'name'}
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        {selectable && showBulkDelete && (
          <>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1">
              <Button
                appearance="outline"
                variant="muted"
                size="sm"
                disabled={selected.length === 0}
                onClick={handleDeleteSelected}
              >
                <IconTrash size={12} /> Delete
              </Button>
            </div>
          </>
        )}
      </div>

      {appliedFilters.length > 0 && (
        <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
          <div className="flex items-center gap-1 flex-wrap">
            {appliedFilters.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-border text-11 text-text"
              >
                <span className="font-medium text-text-subtle">{f.label}:</span>{' '}
                {f.displayValue ?? f.value}
                <button
                  type="button"
                  onClick={() => handleFilterRemove(f.id ?? '')}
                  className="ml-0.5 text-text-muted hover:text-text bg-transparent border-none cursor-pointer p-0"
                >
                  <IconX size={10} />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setAppliedFilters([]);
              setCurrentPage(1);
            }}
            className="text-11 text-text-muted hover:text-text bg-transparent border-none cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {filteredRows.length > 0 && (
        <Pagination
          totalCount={filteredRows.length}
          size={rowsPerPage}
          currentAt={safePage}
          onPageChange={setCurrentPage}
          onSettingClick={() => {}}
          totalCountLabel="items"
          selectedCount={selected.length}
        />
      )}

      {tableContent}

      {confirmRemoveOpen && (
        <DeleteResourceModal
          appeared={confirmRemoveOpen}
          onConfirm={() => {
            handleRemoveConfirm();
          }}
          onCancel={() => {
            setConfirmRemoveOpen(false);
            setRowToRemove(null);
          }}
          targets={rowToRemove ? [{ id: rowToRemove.id, name: rowToRemove.id }] : []}
          labels={{
            titleSingle: 'Remove item',
            descriptionSingle: 'Are you sure you want to remove this item?',
            actionButtonText: 'Remove',
          }}
        />
      )}

      {statusModalOpen && (
        <ActionModal
          appeared={statusModalOpen}
          onConfirm={() => {
            applyStatusChange();
          }}
          onCancel={closeStatusModal}
          actionConfig={{
            title:
              statusModal?.nextStatus === 'Disabled'
                ? `Disable ${config.title.replace(/s$/, '').toLowerCase()}`
                : `Enable ${config.title.replace(/s$/, '').toLowerCase()}`,
            subtitle:
              statusModal?.nextStatus === 'Disabled'
                ? `Change this ${config.title.replace(/s$/, '').toLowerCase()} status to Disabled?`
                : `Change this ${config.title.replace(/s$/, '').toLowerCase()} status to Enabled?`,
            actionButtonText: statusModal?.nextStatus === 'Disabled' ? 'Disable' : 'Enable',
            actionButtonVariant: 'primary',
          }}
          confirmDisabled={
            statusModal?.nextStatus === 'Disabled' &&
            !!statusAction?.requireDisableReason &&
            !disableReason.trim()
          }
        >
          {statusModal?.nextStatus === 'Disabled' && !!statusAction?.requireDisableReason && (
            <div className="flex flex-col gap-2">
              <span className="text-12 font-medium text-text">
                Reason <span className="text-error">*</span>
              </span>
              <Textarea
                placeholder="Enter a reason for disabling"
                value={disableReason}
                onChange={(e) => setDisableReason(e.target.value)}
              />
            </div>
          )}
        </ActionModal>
      )}
    </div>
  );
}

export default CloudBuilderConsolePage;
