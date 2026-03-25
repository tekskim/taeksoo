import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import { CreateVolumeBackupWithSelectionDrawer } from '../drawers/compute/volume/CreateVolumeBackupWithSelectionDrawer';
import { CreateVolumeFromBackupDrawer } from '../drawers/compute/volume/CreateVolumeFromBackupDrawer';
import { EditVolumeBackupDrawer } from '../drawers/compute/volume/EditVolumeBackupDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

type BackupStatus = 'available' | 'error' | 'restoring';

interface VolumeBackupRow {
  id: string;
  name: string;
  tenant: string;
  status: BackupStatus;
  volume: string;
  backupMode: string;
  size: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockRows: VolumeBackupRow[] = [
  {
    id: 'vb-001',
    name: 'vol-backup-daily',
    tenant: 'engineering',
    status: 'available',
    volume: 'boot-vol-prod-01',
    backupMode: 'Full',
    size: '80 GiB',
    createdAt: 'Sep 12, 2025 09:23:41',
  },
  {
    id: 'vb-002',
    name: 'db-snapshot-weekly',
    tenant: 'production',
    status: 'available',
    volume: 'postgres-data-1',
    backupMode: 'Incremental',
    size: '512 GiB',
    createdAt: 'Sep 11, 2025 14:07:22',
  },
  {
    id: 'vb-003',
    name: 'restore-test',
    tenant: 'admin',
    status: 'restoring',
    volume: 'cache-vol-02',
    backupMode: 'Full',
    size: '40 GiB',
    createdAt: 'Sep 10, 2025 11:45:33',
  },
  {
    id: 'vb-004',
    name: 'legacy-backup',
    tenant: 'demo-project',
    status: 'error',
    volume: 'orphan-vol',
    backupMode: 'Full',
    size: '20 GiB',
    createdAt: 'Aug 1, 2025 16:52:08',
  },
  {
    id: 'vb-005',
    name: 'app-tier-backup',
    tenant: 'engineering',
    status: 'available',
    volume: 'app-shared-01',
    backupMode: 'Incremental',
    size: '120 GiB',
    createdAt: 'Jan 5, 2025 08:30:15',
  },
  {
    id: 'vb-006',
    name: 'qa-volume-backup',
    tenant: 'production',
    status: 'available',
    volume: 'qa-data-vol',
    backupMode: 'Full',
    size: '64 GiB',
    createdAt: 'Apr 18, 2025 13:19:44',
  },
  {
    id: 'vb-007',
    name: 'analytics-cold',
    tenant: 'admin',
    status: 'available',
    volume: 'analytics-warehouse',
    backupMode: 'Incremental',
    size: '2 TiB',
    createdAt: 'Mar 22, 2025 10:41:27',
  },
  {
    id: 'vb-008',
    name: 'failed-copy',
    tenant: 'demo-project',
    status: 'error',
    volume: 'temp-scratch',
    backupMode: 'Full',
    size: '8 GiB',
    createdAt: 'Feb 14, 2025 17:03:56',
  },
];

const statusMap: Record<BackupStatus, StatusVariant> = {
  available: 'active',
  error: 'error',
  restoring: 'building',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'tenant', label: 'Tenant', type: 'input', placeholder: 'Enter tenant...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'available', label: 'Available' },
      { value: 'error', label: 'Error' },
      { value: 'restoring', label: 'Restoring' },
    ],
  },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'tenant', label: 'Tenant', visible: true },
  { key: 'volume', label: 'Volume', visible: true },
  { key: 'backupMode', label: 'Backup Mode', visible: true },
  { key: 'size', label: 'Size', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminVolumeBackupsPage() {
  const [rows, setRows] = useState<VolumeBackupRow[]>(mockRows);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [drawerBackup, setDrawerBackup] = useState<VolumeBackupRow | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createFromBackupRow, setCreateFromBackupRow] = useState<VolumeBackupRow | null>(null);
  const [createBackupSelectionOpen, setCreateBackupSelectionOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return rows;
    return rows.filter((row) =>
      appliedFilters.every((filter) => {
        const val = String(row[filter.key] ?? '').toLowerCase();
        return val.includes(String(filter.value ?? '').toLowerCase());
      })
    );
  }, [rows, appliedFilters]);

  const itemsPerPage = 10;
  const pageRows = filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasSelection = selectedRows.length > 0;

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
  }, []);

  const handleBulkDelete = useCallback(() => {
    setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
    setSelectedRows([]);
  }, [selectedRows]);

  const handleRowDelete = useCallback((row: VolumeBackupRow) => {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'tenant', header: 'Tenant', sortable: true },
    { key: 'volume', header: 'Volume' },
    { key: 'backupMode', header: 'Backup Mode' },
    { key: 'size', header: 'Size' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Volume backups" />
        <Button variant="primary" size="md" onClick={() => setCreateBackupSelectionOpen(true)}>
          Create backup
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search volume backups by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
            <IconTrash size={12} /> Delete
          </Button>
        </div>
      </div>

      {appliedFilters.length > 0 && (
        <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
          <div className="flex items-center gap-1 flex-wrap">
            {appliedFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
              >
                <span className="flex items-center gap-1">
                  <span className="text-text">{filter.label}</span>
                  <span className="text-border">|</span>
                  <span className="text-text">{filter.displayValue ?? filter.value}</span>
                </span>
                <button
                  type="button"
                  className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors duration-150 cursor-pointer bg-transparent border-none"
                  onClick={() => handleFilterRemove(filter.id!)}
                  aria-label={`Remove ${filter.label}: ${filter.displayValue ?? filter.value}`}
                >
                  <IconX size={12} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            className="text-11 leading-16 font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ml-4"
            onClick={() => {
              setAppliedFilters([]);
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <Pagination
        totalCount={filteredRows.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<VolumeBackupRow>
        columns={columns}
        rows={pageRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {pageRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <StatusIndicator variant={statusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <Link
                to={`/compute-admin/volume-backups/${row.id}`}
                className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <span className="text-12 text-text truncate" title={row.tenant}>
                {row.tenant}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.volume}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.backupMode}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.size}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]} preventClickPropagation>
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
                        d="M5.33333 8V8.00667M8 8V8.00667M10.6667 8V8.00667M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8Z"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              >
                <ContextMenu.Item
                  action={() => {
                    setDrawerBackup(row);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setCreateFromBackupRow(row);
                  }}
                >
                  Create volume from backup
                </ContextMenu.Item>
                <ContextMenu.Item action={() => handleRowDelete(row)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <EditVolumeBackupDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        backupId={drawerBackup?.id ?? ''}
        initialData={drawerBackup ? { name: drawerBackup.name, description: '' } : undefined}
      />

      <CreateVolumeFromBackupDrawer
        isOpen={!!createFromBackupRow}
        onClose={() => setCreateFromBackupRow(null)}
        backupName={createFromBackupRow?.name ?? ''}
      />

      <CreateVolumeBackupWithSelectionDrawer
        isOpen={createBackupSelectionOpen}
        onClose={() => setCreateBackupSelectionOpen(false)}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
