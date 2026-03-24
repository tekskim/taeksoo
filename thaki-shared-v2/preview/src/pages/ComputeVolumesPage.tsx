import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { AcceptVolumeTransferDrawer } from '../drawers/compute/volume/AcceptVolumeTransferDrawer';
import { BootSettingDrawer } from '../drawers/compute/volume/BootSettingDrawer';
import { ChangeVolumeTypeDrawer } from '../drawers/compute/volume/ChangeVolumeTypeDrawer';
import { CloneVolumeDrawer } from '../drawers/compute/volume/CloneVolumeDrawer';
import { CreateImageFromVolumeDrawer } from '../drawers/compute/volume/CreateImageFromVolumeDrawer';
import { CreateTransferDrawer } from '../drawers/compute/volume/CreateTransferDrawer';
import { CreateVolumeBackupDrawer } from '../drawers/compute/volume/CreateVolumeBackupDrawer';
import { CreateVolumeSnapshotDrawer } from '../drawers/compute/volume/CreateVolumeSnapshotDrawer';
import { EditVolumeDrawer } from '../drawers/compute/volume/EditVolumeDrawer';
import { ExtendVolumeDrawer } from '../drawers/compute/volume/ExtendVolumeDrawer';
import { MigrateVolumeDrawer } from '../drawers/compute/volume/MigrateVolumeDrawer';
import { RestoreFromSnapshotDrawer } from '../drawers/compute/volume/RestoreFromSnapshotDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

type VolumeStatus = 'active' | 'in-use' | 'error' | 'pending';
type VolumeType = 'SSD' | 'NVMe' | 'HDD';

interface Volume {
  id: string;
  name: string;
  status: VolumeStatus;
  size: string;
  type: VolumeType;
  attachedTo: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockRows: Volume[] = [
  {
    id: 'vol-001',
    name: 'web-data-01',
    status: 'in-use',
    size: '100 GiB',
    type: 'SSD',
    attachedTo: 'instance-web-01',
    createdAt: 'Mar 9, 2025 15:20:00',
  },
  {
    id: 'vol-002',
    name: 'db-primary-vol',
    status: 'in-use',
    size: '500 GiB',
    type: 'NVMe',
    attachedTo: 'instance-db-01',
    createdAt: 'Mar 7, 2025 11:05:22',
  },
  {
    id: 'vol-003',
    name: 'archive-cold',
    status: 'active',
    size: '2 TiB',
    type: 'HDD',
    attachedTo: '-',
    createdAt: 'Mar 2, 2025 09:12:45',
  },
  {
    id: 'vol-004',
    name: 'broken-attach',
    status: 'error',
    size: '50 GiB',
    type: 'SSD',
    attachedTo: '-',
    createdAt: 'Feb 28, 2025 18:33:10',
  },
  {
    id: 'vol-005',
    name: 'k8s-etcd',
    status: 'in-use',
    size: '20 GiB',
    type: 'NVMe',
    attachedTo: 'instance-cp-01',
    createdAt: 'Feb 20, 2025 07:40:33',
  },
  {
    id: 'vol-006',
    name: 'temp-clone',
    status: 'pending',
    size: '80 GiB',
    type: 'SSD',
    attachedTo: '-',
    createdAt: 'Feb 15, 2025 13:00:00',
  },
  {
    id: 'vol-007',
    name: 'logs-buffer',
    status: 'active',
    size: '200 GiB',
    type: 'HDD',
    attachedTo: '-',
    createdAt: 'Jan 30, 2025 16:16:16',
  },
  {
    id: 'vol-008',
    name: 'ml-dataset',
    status: 'in-use',
    size: '1 TiB',
    type: 'NVMe',
    attachedTo: 'instance-gpu-02',
    createdAt: 'Jan 8, 2025 10:22:55',
  },
];

const statusMap: Record<VolumeStatus, StatusVariant> = {
  active: 'active',
  'in-use': 'inUse',
  error: 'error',
  pending: 'pending',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'in-use', label: 'In use' },
      { value: 'error', label: 'Error' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'SSD', label: 'SSD' },
      { value: 'NVMe', label: 'NVMe' },
      { value: 'HDD', label: 'HDD' },
    ],
  },
];

function volumeSizeToGiB(size: string): number {
  const g = size.match(/^([\d.]+)\s*GiB/i);
  if (g) return Math.max(1, Math.floor(Number(g[1])));
  const t = size.match(/^([\d.]+)\s*TiB/i);
  if (t) return Math.max(1, Math.floor(Number(t[1]) * 1024));
  return 10;
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'size', label: 'Size', visible: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'attachedTo', label: 'Attached To', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeVolumesPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [drawerVolume, setDrawerVolume] = useState<Volume | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [changeTypeOpen, setChangeTypeOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [acceptTransferOpen, setAcceptTransferOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [bootOpen, setBootOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [migrateOpen, setMigrateOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return mockRows;
    return mockRows.filter((row) =>
      appliedFilters.every((filter) => {
        const val = String(row[filter.key] ?? '').toLowerCase();
        return val.includes(String(filter.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

  const itemsPerPage = 10;
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'attachedTo', header: 'Attached To', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Volumes" />
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" onClick={() => setAcceptTransferOpen(true)}>
            Accept volume transfer
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate('/compute/volumes/create')}>
            Create volume
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search volumes by attributes"
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

      <SelectableTable<Volume>
        columns={columns}
        rows={paginatedRows}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={columns[0]}>
              <StatusIndicator variant={statusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <Link
                to={`/compute/volumes/${row.id}`}
                className="text-primary font-medium hover:underline"
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              {row.size}
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.type}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.attachedTo}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]} preventClickPropagation>
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
                    setDrawerVolume(row);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setExtendOpen(true);
                  }}
                >
                  Extend
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setChangeTypeOpen(true);
                  }}
                >
                  Change type
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setMigrateOpen(true);
                  }}
                >
                  Migrate
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setCloneOpen(true);
                  }}
                >
                  Clone
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setSnapshotOpen(true);
                  }}
                >
                  Create snapshot
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setBackupOpen(true);
                  }}
                >
                  Create backup
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setTransferOpen(true);
                  }}
                >
                  Create transfer
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setImageOpen(true);
                  }}
                >
                  Create image
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setBootOpen(true);
                  }}
                >
                  Boot setting
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setDrawerVolume(row);
                    setRestoreOpen(true);
                  }}
                >
                  Restore from snapshot
                </ContextMenu.Item>
                <ContextMenu.Item action={() => {}}>Detach</ContextMenu.Item>
                <ContextMenu.Item action={() => {}} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <EditVolumeDrawer
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        volumeId={drawerVolume?.id ?? ''}
        initialData={drawerVolume ? { name: drawerVolume.name, description: '' } : undefined}
      />
      <ExtendVolumeDrawer
        isOpen={extendOpen}
        onClose={() => setExtendOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
        currentSizeLabel={drawerVolume?.size ?? '100 GiB'}
        currentSizeGiB={drawerVolume ? volumeSizeToGiB(drawerVolume.size) : 100}
      />
      <ChangeVolumeTypeDrawer
        isOpen={changeTypeOpen}
        onClose={() => setChangeTypeOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
        initialType={drawerVolume?.type ?? 'SSD'}
      />
      <MigrateVolumeDrawer
        isOpen={migrateOpen}
        onClose={() => setMigrateOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
      />
      <CloneVolumeDrawer
        isOpen={cloneOpen}
        onClose={() => setCloneOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
        volumeType={drawerVolume?.type ?? 'SSD'}
        volumeSize={drawerVolume?.size ?? ''}
      />
      <CreateVolumeSnapshotDrawer
        isOpen={snapshotOpen}
        onClose={() => setSnapshotOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
      />
      <CreateVolumeBackupDrawer
        isOpen={backupOpen}
        onClose={() => setBackupOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
      />
      <CreateTransferDrawer
        isOpen={transferOpen}
        onClose={() => setTransferOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
      />
      <CreateImageFromVolumeDrawer
        isOpen={imageOpen}
        onClose={() => setImageOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
      />
      <BootSettingDrawer
        isOpen={bootOpen}
        onClose={() => setBootOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
        initialBootable={false}
      />
      <RestoreFromSnapshotDrawer
        isOpen={restoreOpen}
        onClose={() => setRestoreOpen(false)}
        volumeName={drawerVolume?.name ?? ''}
      />
      <AcceptVolumeTransferDrawer
        isOpen={acceptTransferOpen}
        onClose={() => setAcceptTransferOpen(false)}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
