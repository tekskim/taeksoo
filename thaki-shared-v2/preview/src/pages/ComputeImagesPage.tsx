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
import {
  EditImageDrawer,
  type EditImageVisibility,
} from '../drawers/compute/image/EditImageDrawer';
import { CreateVolumeFromImageDrawer } from '../drawers/compute/volume/CreateVolumeFromImageDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

type ImageStatus = 'active' | 'queued' | 'error';
type ImageType = 'image' | 'snapshot';
type Visibility = 'public' | 'private';

interface ComputeImage {
  id: string;
  name: string;
  status: ImageStatus;
  type: ImageType;
  size: string;
  visibility: Visibility;
  createdAt: string;
  [key: string]: unknown;
}

const mockRows: ComputeImage[] = [
  {
    id: 'img-001',
    name: 'ubuntu-22.04-lts',
    status: 'active',
    type: 'image',
    size: '2.1 GiB',
    visibility: 'public',
    createdAt: 'Mar 1, 2025 10:00:00',
  },
  {
    id: 'img-002',
    name: 'custom-app-golden',
    status: 'active',
    type: 'snapshot',
    size: '45 GiB',
    visibility: 'private',
    createdAt: 'Feb 26, 2025 15:30:45',
  },
  {
    id: 'img-003',
    name: 'windows-2022',
    status: 'queued',
    type: 'image',
    size: '8.4 GiB',
    visibility: 'public',
    createdAt: 'Feb 20, 2025 09:12:33',
  },
  {
    id: 'img-004',
    name: 'broken-import',
    status: 'error',
    type: 'image',
    size: '-',
    visibility: 'private',
    createdAt: 'Feb 18, 2025 11:05:00',
  },
  {
    id: 'img-005',
    name: 'debian-12-minimal',
    status: 'active',
    type: 'image',
    size: '380 MiB',
    visibility: 'public',
    createdAt: 'Jan 30, 2025 08:44:21',
  },
  {
    id: 'img-006',
    name: 'ml-base-cuda',
    status: 'active',
    type: 'snapshot',
    size: '12 GiB',
    visibility: 'private',
    createdAt: 'Jan 15, 2025 13:22:10',
  },
  {
    id: 'img-007',
    name: 'rocky-9',
    status: 'active',
    type: 'image',
    size: '1.9 GiB',
    visibility: 'public',
    createdAt: 'Dec 8, 2024 17:00:55',
  },
  {
    id: 'img-008',
    name: 'backup-snap-weekly',
    status: 'active',
    type: 'snapshot',
    size: '100 GiB',
    visibility: 'private',
    createdAt: 'Nov 3, 2024 12:12:12',
  },
];

function imageSizeToMinGiB(size: string): number {
  const g = size.match(/^([\d.]+)\s*GiB/i);
  if (g) return Math.max(1, Math.ceil(Number(g[1])));
  const m = size.match(/^([\d.]+)\s*MiB/i);
  if (m) return Math.max(1, Math.ceil(Number(m[1]) / 1024) || 1);
  const t = size.match(/^([\d.]+)\s*TiB/i);
  if (t) return Math.max(1, Math.ceil(Number(t[1]) * 1024));
  return 1;
}

const statusMap: Record<ImageStatus, StatusVariant> = {
  active: 'active',
  queued: 'pending',
  error: 'error',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'image', label: 'Image' },
      { value: 'snapshot', label: 'Snapshot' },
    ],
  },
  {
    key: 'visibility',
    label: 'Visibility',
    type: 'select',
    options: [
      { value: 'public', label: 'Public' },
      { value: 'private', label: 'Private' },
    ],
  },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'type', label: 'Type', visible: true },
  { key: 'size', label: 'Size', visible: true },
  { key: 'visibility', label: 'Visibility', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeImagesPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ComputeImage | null>(null);
  const [createVolumeFromImageRow, setCreateVolumeFromImageRow] = useState<ComputeImage | null>(
    null
  );
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
    { key: 'type', header: 'Type', sortable: true },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'visibility', header: 'Visibility', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Images" />
        <Button variant="primary" size="md" onClick={() => navigate('/compute/images/create')}>
          Create image
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search images by attributes"
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

      <SelectableTable<ComputeImage>
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
                to={`/compute/images/${row.id}`}
                className="text-primary font-medium hover:underline"
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              {row.type}
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.size}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.visibility}
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
                    setEditTarget(row);
                    setEditDrawerOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setCreateVolumeFromImageRow(row);
                  }}
                >
                  Create volume from image
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Delete', row.id)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <EditImageDrawer
        isOpen={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setEditTarget(null);
        }}
        imageId={editTarget?.id}
        initialData={
          editTarget
            ? {
                name: editTarget.name,
                description: '',
                minDiskGiB: 20,
                minRamMiB: 2048,
                visibility: (editTarget.visibility === 'public'
                  ? 'Public'
                  : 'Private') as EditImageVisibility,
                protected: false,
              }
            : undefined
        }
      />

      <CreateVolumeFromImageDrawer
        isOpen={!!createVolumeFromImageRow}
        onClose={() => setCreateVolumeFromImageRow(null)}
        imageName={createVolumeFromImageRow?.name ?? ''}
        minDiskGiB={createVolumeFromImageRow ? imageSizeToMinGiB(createVolumeFromImageRow.size) : 1}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
