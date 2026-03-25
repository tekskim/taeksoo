import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
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
import { RestoreFromSnapshotDrawer } from '../drawers/compute/volume/RestoreFromSnapshotDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { IconDotsCircleHorizontal, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type VolumeStatus = 'active' | 'in-use' | 'error' | 'pending';

interface Volume {
  id: string;
  name: string;
  tenant: string;
  size: string;
  type: string;
  diskTag: string;
  attachedTo: string | null;
  attachedToId: string | null;
  createdAt: string;
  status: VolumeStatus;
  [key: string]: unknown;
}

const mockVolumes: Volume[] = [
  {
    id: 'vol-001',
    name: 'db-data',
    tenant: 'admin',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'Data disk',
    attachedTo: 'web-server-1',
    attachedToId: 'inst-001',
    createdAt: 'Sep 12, 2025 15:43:35',
    status: 'in-use',
  },
  {
    id: 'vol-002',
    name: 'app-storage',
    tenant: 'demo-project',
    size: '500GiB',
    type: '_DEFAULT_',
    diskTag: 'Data disk',
    attachedTo: 'app-server-1',
    attachedToId: 'inst-002',
    createdAt: 'Sep 10, 2025 01:17:01',
    status: 'in-use',
  },
  {
    id: 'vol-003',
    name: 'backup-vol',
    tenant: 'engineering',
    size: '2000GiB',
    type: 'SSD',
    diskTag: 'Backup',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Sep 8, 2025 11:51:27',
    status: 'active',
  },
  {
    id: 'vol-004',
    name: 'log-storage',
    tenant: 'production',
    size: '100GiB',
    type: '_DEFAULT_',
    diskTag: 'Logs',
    attachedTo: 'log-server',
    attachedToId: 'inst-003',
    createdAt: 'Sep 5, 2025 14:12:36',
    status: 'in-use',
  },
  {
    id: 'vol-005',
    name: 'cache-vol',
    tenant: 'admin',
    size: '256GiB',
    type: 'NVMe',
    diskTag: 'Cache',
    attachedTo: 'cache-01',
    attachedToId: 'inst-004',
    createdAt: 'Aug 30, 2025 21:37:41',
    status: 'in-use',
  },
  {
    id: 'vol-006',
    name: 'media-storage',
    tenant: 'demo-project',
    size: '5000GiB',
    type: 'HDD',
    diskTag: 'Media',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Aug 25, 2025 10:32:16',
    status: 'active',
  },
  {
    id: 'vol-007',
    name: 'temp-vol',
    tenant: 'engineering',
    size: '50GiB',
    type: '_DEFAULT_',
    diskTag: 'Temporary',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Aug 20, 2025 23:27:51',
    status: 'pending',
  },
  {
    id: 'vol-008',
    name: 'ml-data',
    tenant: 'production',
    size: '1000GiB',
    type: 'NVMe',
    diskTag: 'ML Dataset',
    attachedTo: 'gpu-server-1',
    attachedToId: 'inst-005',
    createdAt: 'Aug 15, 2025 12:22:26',
    status: 'in-use',
  },
  {
    id: 'vol-009',
    name: 'archive-vol',
    tenant: 'admin',
    size: '10000GiB',
    type: 'HDD',
    diskTag: 'Archive',
    attachedTo: null,
    attachedToId: null,
    createdAt: 'Aug 10, 2025 01:17:01',
    status: 'active',
  },
  {
    id: 'vol-010',
    name: 'boot-vol-01',
    tenant: 'engineering',
    size: '100GiB',
    type: 'SSD',
    diskTag: 'Boot',
    attachedTo: 'web-server-2',
    attachedToId: 'inst-006',
    createdAt: 'Aug 5, 2025 14:12:36',
    status: 'in-use',
  },
];

const volumeStatusMap: Record<VolumeStatus, StatusVariant> = {
  active: 'active',
  'in-use': 'inUse',
  error: 'error',
  pending: 'pending',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input' },
  { key: 'tenant', label: 'Tenant', type: 'input' },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: '_DEFAULT_', label: '_DEFAULT_' },
      { value: 'SSD', label: 'SSD' },
      { value: 'NVMe', label: 'NVMe' },
      { value: 'HDD', label: 'HDD' },
    ],
  },
  { key: 'diskTag', label: 'Disk tag', type: 'input' },
  { key: 'attachedTo', label: 'Attached to', type: 'input' },
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
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

/** Parse size label (e.g. "1500GiB", "80 GiB") to GiB for ExtendVolumeDrawer. */
function volumeSizeToGiB(sizeLabel: string): number {
  const s = String(sizeLabel);
  const numMatch = s.match(/([\d.]+)/);
  if (!numMatch) return 100;
  const n = parseFloat(numMatch[1]);
  if (!Number.isFinite(n)) return 100;
  if (/\bti?b\b/i.test(s) && !/gib/i.test(s)) return Math.round(n * 1024);
  return Math.round(n);
}

function mapVolumeTypeForDrawer(t: string): 'SSD' | 'HDD' | 'NVMe' {
  const u = t.toUpperCase();
  if (u === 'SSD' || u === 'HDD') return u;
  if (u === 'NVME') return 'NVMe';
  return 'SSD';
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'tenant', label: 'Tenant', visible: true },
  { key: 'size', label: 'Size', visible: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'attachedTo', label: 'Attached To', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminVolumesPage() {
  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [createImageOpen, setCreateImageOpen] = useState(false);
  const [bootSettingOpen, setBootSettingOpen] = useState(false);
  const [changeTypeOpen, setChangeTypeOpen] = useState(false);
  const [createTransferOpen, setCreateTransferOpen] = useState(false);
  const [acceptTransferOpen, setAcceptTransferOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const clearSelectedVolume = useCallback(() => setSelectedVolume(null), []);

  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredVolumes = useMemo(() => {
    if (appliedFilters.length === 0) return mockVolumes;

    return mockVolumes.filter((v) => {
      return appliedFilters.every((filter) => {
        const key = filter.key as keyof Volume;
        const value = String(v[key] ?? '').toLowerCase();
        return value.includes(String(filter.value ?? '').toLowerCase());
      });
    });
  }, [appliedFilters]);

  const paginatedRows = filteredVolumes.slice(
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

  const openInstanceInNewTab = useCallback((instanceId: string, instanceName: string) => {
    const path = `/compute-admin/instances/${instanceId}`;
    window.open(path, '_blank', 'noopener,noreferrer');
    console.log('[Volumes] Open instance in new tab', instanceName, path);
  }, []);

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'tenant', header: 'Tenant', sortable: true },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'diskTag', header: 'Disk tag', sortable: true },
    { key: 'attachedTo', header: 'Attached to', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8 gap-2 flex-wrap">
        <Title title="Volumes" />
        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" onClick={() => setAcceptTransferOpen(true)}>
            Accept Volume Transfer
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/compute-admin/volumes/create')}
          >
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
            placeholder="Search volume by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Volumes] Bulk Delete', selectedRows)}
          >
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

      {filteredVolumes.length > 0 && (
        <Pagination
          totalCount={filteredVolumes.length}
          size={itemsPerPage}
          currentAt={currentPage}
          onPageChange={setCurrentPage}
          onSettingClick={() => setPrefsOpen(true)}
          totalCountLabel="items"
          selectedCount={selectedRows.length}
        />
      )}

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
              <StatusIndicator variant={volumeStatusMap[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute-admin/volumes/${row.id}`}
                  className={`${linkClass} truncate`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.name}
                </Link>
                <span className="text-11 text-text-muted truncate" title={row.id}>
                  {row.id}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <span className="text-12 text-text truncate" title={row.tenant}>
                {row.tenant}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.size}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.type}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.diskTag}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {row.attachedTo && row.attachedToId ? (
                <div className="flex flex-col gap-0.5 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openInstanceInNewTab(row.attachedToId!, row.attachedTo!);
                    }}
                    className={`inline-flex items-center gap-1.5 min-w-0 ${linkClass} truncate text-left bg-transparent border-none cursor-pointer p-0`}
                  >
                    {row.attachedTo}
                  </button>
                  <span className="text-11 text-text-muted">ID : {row.attachedToId}</span>
                </div>
              ) : (
                <span className="text-text-muted">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]}>
              {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
            </Table.Td>
            <Table.Td rowData={row} column={columns[8]} preventClickPropagation>
              <ContextMenu.Root
                direction="bottom-end"
                gap={4}
                trigger={({ toggle }) => (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                    aria-label="Row actions"
                  >
                    <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-text-subtle" />
                  </button>
                )}
              >
                <ContextMenu.SubItems label="Data protection">
                  <ContextMenu.Item
                    action={() => {
                      setSelectedVolume(row);
                      setSnapshotOpen(true);
                    }}
                  >
                    Create volume snapshot
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => {
                      setSelectedVolume(row);
                      setBackupOpen(true);
                    }}
                  >
                    Create volume backup
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => {
                      setSelectedVolume(row);
                      setCloneOpen(true);
                    }}
                  >
                    Clone volume
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => {
                      setSelectedVolume(row);
                      setRestoreOpen(true);
                    }}
                  >
                    Restore from Snapshot
                  </ContextMenu.Item>
                </ContextMenu.SubItems>
                <ContextMenu.SubItems label="Operate">
                  <ContextMenu.Item action={() => console.log('[Volumes] Create instance', row.id)}>
                    Create instance
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => {
                      setSelectedVolume(row);
                      setCreateImageOpen(true);
                    }}
                  >
                    Create image
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => console.log('[Volumes] Attach instance', row.id)}>
                    Attach instance
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => console.log('[Volumes] Detach instance', row.id)}
                    disabled={!row.attachedTo}
                  >
                    Detach instance
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => {
                      setSelectedVolume(row);
                      setBootSettingOpen(true);
                    }}
                  >
                    Boot setting
                  </ContextMenu.Item>
                </ContextMenu.SubItems>
                <ContextMenu.SubItems label="Configuration">
                  <ContextMenu.Item
                    action={() => {
                      setSelectedVolume(row);
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => {
                      setSelectedVolume(row);
                      setExtendOpen(true);
                    }}
                  >
                    Extend volume
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => console.log('[Volumes] Manage metadata', row.id)}>
                    Manage metadata
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    action={() => {
                      setSelectedVolume(row);
                      setChangeTypeOpen(true);
                    }}
                  >
                    Change volume Type
                  </ContextMenu.Item>
                </ContextMenu.SubItems>
                <ContextMenu.Item
                  action={() => {
                    setSelectedVolume(row);
                    setCreateTransferOpen(true);
                  }}
                >
                  Create transfer
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('[Volumes] Cancel transfer', row.id)}>
                  Cancel transfer
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('[Volumes] Delete', row.id)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
      <AcceptVolumeTransferDrawer
        isOpen={acceptTransferOpen}
        onClose={() => setAcceptTransferOpen(false)}
      />
      <EditVolumeDrawer
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          clearSelectedVolume();
        }}
        volumeId={selectedVolume?.id}
        initialData={
          selectedVolume
            ? { name: selectedVolume.name, description: '' }
            : { name: '', description: '' }
        }
      />
      <ExtendVolumeDrawer
        isOpen={extendOpen}
        onClose={() => {
          setExtendOpen(false);
          clearSelectedVolume();
        }}
        volumeName={selectedVolume?.name}
        currentSizeLabel={selectedVolume?.size}
        currentSizeGiB={selectedVolume ? volumeSizeToGiB(selectedVolume.size) : undefined}
      />
      <CreateVolumeSnapshotDrawer
        isOpen={snapshotOpen}
        onClose={() => {
          setSnapshotOpen(false);
          clearSelectedVolume();
        }}
        volumeName={selectedVolume?.name}
      />
      <CreateVolumeBackupDrawer
        isOpen={backupOpen}
        onClose={() => {
          setBackupOpen(false);
          clearSelectedVolume();
        }}
        volumeName={selectedVolume?.name}
      />
      <CloneVolumeDrawer
        isOpen={cloneOpen}
        onClose={() => {
          setCloneOpen(false);
          clearSelectedVolume();
        }}
        volumeName={selectedVolume?.name}
        volumeType={selectedVolume?.type}
        volumeSize={selectedVolume?.size}
      />
      <RestoreFromSnapshotDrawer
        isOpen={restoreOpen}
        onClose={() => {
          setRestoreOpen(false);
          clearSelectedVolume();
        }}
        volumeName={selectedVolume?.name}
      />
      <CreateImageFromVolumeDrawer
        isOpen={createImageOpen}
        onClose={() => {
          setCreateImageOpen(false);
          clearSelectedVolume();
        }}
        volumeName={selectedVolume?.name}
      />
      <BootSettingDrawer
        isOpen={bootSettingOpen}
        onClose={() => {
          setBootSettingOpen(false);
          clearSelectedVolume();
        }}
        volumeName={selectedVolume?.name}
        initialBootable={false}
      />
      <ChangeVolumeTypeDrawer
        isOpen={changeTypeOpen}
        onClose={() => {
          setChangeTypeOpen(false);
          clearSelectedVolume();
        }}
        volumeName={selectedVolume?.name}
        initialType={selectedVolume ? mapVolumeTypeForDrawer(selectedVolume.type) : 'SSD'}
      />
      <CreateTransferDrawer
        isOpen={createTransferOpen}
        onClose={() => {
          setCreateTransferOpen(false);
          clearSelectedVolume();
        }}
        volumeName={selectedVolume?.name}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
