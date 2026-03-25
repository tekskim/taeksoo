import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import { Tabs, Tab } from '@shared/components/Tabs';
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

const MOCK_TENANTS = ['admin', 'demo-project', 'engineering', 'production'] as const;

type AccessType = 'Private' | 'Shared' | 'Public';
type ImageStatus = 'active' | 'error' | 'pending' | 'deactivated';

interface Image extends Record<string, unknown> {
  id: string;
  name: string;
  tenant: string;
  os: string;
  size: string;
  diskFormat: string;
  protected: boolean;
  visibility: 'Public' | 'Private' | 'Shared' | 'Community';
  access: AccessType;
  description: string;
  createdAt: string;
  status: ImageStatus;
}

const mockImages: Image[] = [
  {
    id: '29tgj234',
    name: 'Ubuntu-22.04-base',
    tenant: MOCK_TENANTS[0],
    os: 'Ubuntu24.04',
    size: '16GiB',
    diskFormat: 'RAW',
    protected: true,
    visibility: 'Private',
    access: 'Private',
    description: 'Base Ubuntu 22.04 image',
    createdAt: 'Sep 12, 2025 15:43:35',
    status: 'active',
  },
  {
    id: 'img-002',
    name: 'CentOS-8-minimal',
    tenant: MOCK_TENANTS[1],
    os: 'CentOS8',
    size: '8GiB',
    diskFormat: 'QCOW2',
    protected: false,
    visibility: 'Private',
    access: 'Private',
    description: 'Minimal CentOS 8 installation',
    createdAt: 'Sep 10, 2025 01:17:01',
    status: 'active',
  },
  {
    id: 'img-003',
    name: 'Rocky-Linux-9',
    tenant: MOCK_TENANTS[2],
    os: 'Rocky Linux 9',
    size: '12GiB',
    diskFormat: 'RAW',
    protected: true,
    visibility: 'Shared',
    access: 'Shared',
    description: 'Rocky Linux 9 server image',
    createdAt: 'Sep 8, 2025 11:51:27',
    status: 'active',
  },
  {
    id: 'img-004',
    name: 'Debian-12-standard',
    tenant: MOCK_TENANTS[3],
    os: 'Debian 12',
    size: '10GiB',
    diskFormat: 'QCOW2',
    protected: false,
    visibility: 'Public',
    access: 'Public',
    description: 'Standard Debian 12 image',
    createdAt: 'Sep 5, 2025 14:12:36',
    status: 'active',
  },
  {
    id: 'img-005',
    name: 'Ubuntu-20.04-LTS',
    tenant: MOCK_TENANTS[0],
    os: 'Ubuntu20.04',
    size: '14GiB',
    diskFormat: 'RAW',
    protected: true,
    visibility: 'Private',
    access: 'Private',
    description: 'Ubuntu 20.04 LTS server',
    createdAt: 'Aug 28, 2025 07:11:07',
    status: 'active',
  },
  {
    id: 'img-006',
    name: 'Windows-Server-2022',
    tenant: MOCK_TENANTS[1],
    os: 'Windows Server 2022',
    size: '32GiB',
    diskFormat: 'QCOW2',
    protected: false,
    visibility: 'Shared',
    access: 'Shared',
    description: 'Windows Server 2022 Datacenter',
    createdAt: 'Aug 25, 2025 10:32:16',
    status: 'pending',
  },
  {
    id: 'img-007',
    name: 'Alpine-3.18-minimal',
    tenant: MOCK_TENANTS[2],
    os: 'Alpine 3.18',
    size: '256MiB',
    diskFormat: 'RAW',
    protected: false,
    visibility: 'Public',
    access: 'Public',
    description: 'Lightweight Alpine Linux',
    createdAt: 'Aug 20, 2025 23:27:51',
    status: 'active',
  },
  {
    id: 'img-008',
    name: 'Fedora-39-workstation',
    tenant: MOCK_TENANTS[3],
    os: 'Fedora 39',
    size: '20GiB',
    diskFormat: 'RAW',
    protected: true,
    visibility: 'Community',
    access: 'Private',
    description: 'Fedora 39 workstation image',
    createdAt: 'Aug 15, 2025 12:22:26',
    status: 'active',
  },
  {
    id: 'img-009',
    name: 'Oracle-Linux-8',
    tenant: MOCK_TENANTS[0],
    os: 'Oracle Linux 8',
    size: '18GiB',
    diskFormat: 'QCOW2',
    protected: false,
    visibility: 'Shared',
    access: 'Shared',
    description: 'Oracle Linux 8 for databases',
    createdAt: 'Aug 10, 2025 01:17:01',
    status: 'deactivated',
  },
  {
    id: 'img-010',
    name: 'Ubuntu-22.04-GPU',
    tenant: MOCK_TENANTS[1],
    os: 'Ubuntu22.04',
    size: '24GiB',
    diskFormat: 'RAW',
    protected: true,
    visibility: 'Private',
    access: 'Private',
    description: 'Ubuntu with GPU drivers',
    createdAt: 'Aug 5, 2025 14:12:36',
    status: 'active',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'tenant', label: 'Tenant', type: 'input', placeholder: 'Enter tenant...' },
  { key: 'os', label: 'OS', type: 'input', placeholder: 'Enter OS...' },
  {
    key: 'diskFormat',
    label: 'Disk Format',
    type: 'select',
    options: [
      { value: 'RAW', label: 'RAW' },
      { value: 'QCOW2', label: 'QCOW2' },
    ],
  },
  {
    key: 'access',
    label: 'Access',
    type: 'select',
    options: [
      { value: 'Private', label: 'Private' },
      { value: 'Shared', label: 'Shared' },
      { value: 'Public', label: 'Public' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'error', label: 'Error' },
      { value: 'deactivated', label: 'Deactivated' },
    ],
  },
];

const imageStatusVariant: Record<ImageStatus, StatusVariant> = {
  active: 'active',
  error: 'error',
  pending: 'building',
  deactivated: 'shutoff',
};

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function imgMatchesFilter(img: Image, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof Image;
  const value = String(img[key] ?? '').toLowerCase();
  return value.includes(fv);
}

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

function imageSizeToMinGiB(size: string): number {
  const g = size.match(/^([\d.]+)\s*GiB/i);
  if (g) return Math.max(1, Math.ceil(Number(g[1])));
  const m = size.match(/^([\d.]+)\s*MiB/i);
  if (m) return Math.max(1, Math.ceil(Number(m[1]) / 1024) || 1);
  const t = size.match(/^([\d.]+)\s*TiB/i);
  if (t) return Math.max(1, Math.ceil(Number(t[1]) * 1024));
  return 1;
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'tenant', label: 'Tenant', visible: true },
  { key: 'os', label: 'OS', visible: true },
  { key: 'size', label: 'Size', visible: true },
  { key: 'diskFormat', label: 'Disk format', visible: true },
  { key: 'protected', label: 'Visibility', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminImagesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'current';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [images, setImages] = useState(mockImages);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Image | null>(null);
  const [createVolumeFromImageRow, setCreateVolumeFromImageRow] = useState<Image | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    let filtered = images;
    switch (activeTab) {
      case 'current':
        filtered = filtered.filter((img) => img.access === 'Private');
        break;
      case 'shared':
        filtered = filtered.filter((img) => img.access === 'Shared');
        break;
      case 'public':
        filtered = filtered.filter((img) => img.access === 'Public');
        break;
      default:
        break;
    }
    if (appliedFilters.length === 0) return filtered;
    return filtered.filter((img) => appliedFilters.every((f) => imgMatchesFilter(img, f)));
  }, [images, activeTab, appliedFilters]);

  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredRows, currentPage, itemsPerPage]
  );

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

  const handleBulkDelete = () => {
    setImages((prev) => prev.filter((img) => !selectedRows.includes(img.id)));
    setSelectedRows([]);
  };

  const handleRowDelete = (row: Image) => {
    setImages((prev) => prev.filter((img) => img.id !== row.id));
  };

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 64, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'tenant', header: 'Tenant', sortable: true, width: 120 },
    { key: 'os', header: 'OS', sortable: true },
    { key: 'size', header: 'Size', sortable: true },
    { key: 'diskFormat', header: 'Disk format', sortable: true },
    { key: 'protected', header: 'Visibility', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Images" />
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/compute-admin/images/create')}
        >
          Create image
        </Button>
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={(id) => setActiveTab(id)}
        variant="line"
        size="sm"
        fullWidth
        contentClassName="hidden"
      >
        <Tab id="current" label="Current tenant">
          <></>
        </Tab>
        <Tab id="shared" label="Shared">
          <></>
        </Tab>
        <Tab id="public" label="Public">
          <></>
        </Tab>
        <Tab id="all" label="All">
          <></>
        </Tab>
      </Tabs>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search image by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button
          appearance="outline"
          variant="muted"
          size="sm"
          disabled={!hasSelection}
          onClick={handleBulkDelete}
        >
          <IconTrash size={12} /> Delete
        </Button>
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
                  aria-label={`Remove ${filter.label}`}
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

      <SelectableTable<Image>
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
              <StatusIndicator variant={imageStatusVariant[row.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={row} column={columns[1]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link to={`/compute-admin/images/${row.id}`} className={linkClass}>
                  {row.name}
                </Link>
                <span className="text-11 leading-16 text-text-muted">ID : {row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              {row.tenant}
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.os}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.size}
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.diskFormat}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {row.protected ? 'Private' : 'Public'}
            </Table.Td>
            <Table.Td rowData={row} column={columns[7]}>
              {stripTime(row.createdAt)}
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
                <ContextMenu.Item action={() => console.log('Create instance from image:', row.id)}>
                  Create instance
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => console.log('Create instance template from image:', row.id)}
                >
                  Create instance Template
                </ContextMenu.Item>
                <ContextMenu.Item action={() => setCreateVolumeFromImageRow(row)}>
                  Create volume
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setEditTarget(row);
                    setEditDrawerOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item action={() => handleRowDelete(row)} danger>
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
                description: editTarget.description ?? '',
                minDiskGiB: 20,
                minRamMiB: 2048,
                visibility:
                  editTarget.visibility === 'Public' || editTarget.visibility === 'Community'
                    ? ('Public' as EditImageVisibility)
                    : ('Private' as EditImageVisibility),
                protected: editTarget.protected,
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
