import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Badge } from '@shared/components/Badge';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { ProgressBar } from '@shared/components/ProgressBar';
import { Title } from '@shared/components/Title';
import { DeleteResourceModal } from '@shared/components/DeleteResourceModal';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKeyWithValue, FilterKey } from '@shared/components/FilterSearch';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { IconPlus, IconDownload, IconTrash, IconX, IconCheck } from '@tabler/icons-react';
import {
  STORAGE_SLUGS,
  getStorageListConfig,
  type BadgeTone,
  type StorageSlug,
  type ListColumn,
} from '../data/storageListConfig';

type RowData = Record<string, string> & { id: string };

function isStorageSlug(v: string | undefined): v is StorageSlug {
  return !!v && (STORAGE_SLUGS as readonly string[]).includes(v);
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
  if (mapped === 'maintenance') return 'degraded';
  if (mapped === 'down') return 'shutoff';
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

export function StorageConsolePage() {
  const navigate = useNavigate();
  const params = useParams();
  const slug: StorageSlug = isStorageSlug(params.slug) ? params.slug : 'pools';
  const config = useMemo(() => getStorageListConfig(slug), [slug]);

  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<RowData[]>(config.rows);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [rowToRemove, setRowToRemove] = useState<RowData | null>(null);

  useEffect(() => {
    setRows(config.rows);
    setSelected([]);
    setAppliedFilters([]);
    setCurrentPage(1);
    setConfirmRemoveOpen(false);
    setRowToRemove(null);
  }, [config.rows, config.slug]);

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

  const selectable = config.showCheckboxColumn ?? false;
  const showBulkDelete = config.showBulkDelete ?? false;
  const showActionColumn = config.showActionColumn ?? false;

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const onRowAction = useCallback(
    (actionId: string, row: RowData) => {
      if (actionId === 'open-detail') {
        const base = config.detailHrefBase;
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
    },
    [config.detailHrefBase, navigate]
  );

  const columns = useMemo(
    () => buildTableColumns(config.columns, { showActionColumn }),
    [config.columns, showActionColumn]
  );

  const filterKeys: FilterKey[] = useMemo(
    () =>
      config.columns
        .filter(
          (c) =>
            c.sortable && c.kind !== 'statusIndicator' && c.kind !== 'usage' && c.kind !== 'enabled'
        )
        .slice(0, 5)
        .map((c) => ({
          key: c.key,
          label: c.label,
          type: 'input' as const,
          placeholder: `Enter ${c.label.toLowerCase()}...`,
        })),
    [config.columns]
  );

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  const columnWidthOverrides = useMemo(() => {
    const overrides: Record<string, number> = {};
    config.columns.forEach((c) => {
      if (c.width) {
        const w = parseInt(c.width);
        if (w) overrides[c.key] = w;
      }
    });
    return Object.keys(overrides).length > 0 ? overrides : undefined;
  }, [config.columns]);

  const colConfigs = config.columns;
  const linkifyKeys = new Set(config.linkifyColumnKeys ?? []);

  const renderCell = useCallback(
    (row: RowData, col: TableColumn) => {
      const colConfig = colConfigs.find((c) => c.key === col.key);
      const value = row[col.key] ?? '-';

      if (col.key === '__actions') {
        return (
          <ContextMenu.Root
            direction="bottom-end"
            gap={4}
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
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
            {(config.actionMenu?.items ?? []).map((it) => (
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
            ))}
          </ContextMenu.Root>
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

      if (colConfig?.kind === 'usage') {
        const pct = Number(value) || 0;
        return <ProgressBar value={pct} max={100} showValue="percentage" />;
      }

      if (colConfig?.kind === 'badgeList') {
        const items = String(value)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        if (items.length === 0) return <span className="text-12 text-text-muted">-</span>;
        const visible = items.slice(0, 2);
        const rest = items.length - 2;
        return (
          <div className="flex items-center gap-1 flex-wrap">
            {visible.map((item, i) => (
              <Badge key={i} theme="gry" type="subtle" size="sm">
                {item}
              </Badge>
            ))}
            {rest > 0 && (
              <span className="text-11 text-text-muted" title={items.join(', ')}>
                +{rest}
              </span>
            )}
          </div>
        );
      }

      if (colConfig?.kind === 'enabled') {
        return value === 'true' ? (
          <IconCheck size={14} className="text-state-success" />
        ) : (
          <span className="text-12 text-text-muted">-</span>
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
    [colConfigs, config.actionMenu?.items, linkifyKeys, navigate, onRowAction]
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
    if (config.createHref) navigate(config.createHref);
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

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder={config.searchPlaceholder}
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
          onConfirm={handleRemoveConfirm}
          onCancel={() => {
            setConfirmRemoveOpen(false);
            setRowToRemove(null);
          }}
          targets={
            rowToRemove ? [{ id: rowToRemove.id, name: rowToRemove.name ?? rowToRemove.id }] : []
          }
          labels={{
            titleSingle: 'Delete item',
            descriptionSingle: 'Are you sure you want to delete this item?',
            actionButtonText: 'Delete',
          }}
        />
      )}
    </div>
  );
}

export default StorageConsolePage;
