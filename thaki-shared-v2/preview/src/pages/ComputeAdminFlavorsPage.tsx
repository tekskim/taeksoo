import { useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { Tabs, Tab } from '@shared/components/Tabs';
import { IconDownload, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type FlavorType = 'CPU' | 'GPU' | 'MPU' | 'Custom';
type AccessType = 'Public' | 'Private';

interface Flavor {
  id: string;
  name: string;
  category: string;
  vcpu: number;
  ram: string;
  ephemeralDisk: string;
  internalNetworkBandwidth: string;
  access: AccessType;
  type: FlavorType;
  gpuType?: string;
  numaNodes?: string;
  cpuPolicy?: string;
  cpuThreadPolicy?: string;
  [key: string]: unknown;
}

const mockFlavors: Flavor[] = [
  {
    id: 'flv-001',
    name: 'c5.large',
    category: 'Compute Optimized',
    vcpu: 2,
    ram: '16GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    type: 'CPU',
  },
  {
    id: 'flv-002',
    name: 'c5.xlarge',
    category: 'Compute Optimized',
    vcpu: 4,
    ram: '32GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Public',
    type: 'CPU',
  },
  {
    id: 'flv-003',
    name: 'm5.large',
    category: 'General Purpose',
    vcpu: 2,
    ram: '8GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    type: 'CPU',
  },
  {
    id: 'flv-004',
    name: 'm5.xlarge',
    category: 'General Purpose',
    vcpu: 4,
    ram: '16GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Public',
    type: 'CPU',
  },
  {
    id: 'flv-005',
    name: 'r5.large',
    category: 'Memory Optimized',
    vcpu: 2,
    ram: '16GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    type: 'CPU',
  },
  {
    id: 'flv-006',
    name: 'r5.xlarge',
    category: 'Memory Optimized',
    vcpu: 4,
    ram: '32GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Public',
    type: 'CPU',
  },
  {
    id: 'flv-007',
    name: 't3.micro',
    category: 'Burstable',
    vcpu: 2,
    ram: '1GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    type: 'CPU',
  },
  {
    id: 'flv-008',
    name: 't3.small',
    category: 'Burstable',
    vcpu: 2,
    ram: '2GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '-',
    access: 'Public',
    type: 'CPU',
  },
  {
    id: 'flv-009',
    name: 'g4dn.xlarge',
    category: 'GPU Accelerated',
    vcpu: 4,
    ram: '16GiB',
    ephemeralDisk: '125GiB',
    internalNetworkBandwidth: '25Gbps',
    access: 'Public',
    type: 'GPU',
    gpuType: 'NVIDIA T4',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
  },
  {
    id: 'flv-010',
    name: 'g4dn.2xlarge',
    category: 'GPU Accelerated',
    vcpu: 8,
    ram: '32GiB',
    ephemeralDisk: '225GiB',
    internalNetworkBandwidth: '25Gbps',
    access: 'Public',
    type: 'GPU',
    gpuType: 'NVIDIA T4',
    numaNodes: '2',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Isolate',
  },
  {
    id: 'flv-011',
    name: 'p3.2xlarge',
    category: 'GPU Compute',
    vcpu: 8,
    ram: '61GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Public',
    type: 'GPU',
    gpuType: 'NVIDIA V100',
    numaNodes: '2',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Require',
  },
  {
    id: 'flv-012',
    name: 'inf1.xlarge',
    category: 'ML Inference',
    vcpu: 4,
    ram: '8GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '25Gbps',
    access: 'Public',
    type: 'MPU',
    gpuType: 'AWS Inferentia',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
  },
  {
    id: 'flv-013',
    name: 'inf1.2xlarge',
    category: 'ML Inference',
    vcpu: 8,
    ram: '16GiB',
    ephemeralDisk: '0GiB',
    internalNetworkBandwidth: '25Gbps',
    access: 'Public',
    type: 'MPU',
    gpuType: 'AWS Inferentia',
    numaNodes: '2',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Isolate',
  },
  {
    id: 'flv-014',
    name: 'custom.small',
    category: 'Custom',
    vcpu: 2,
    ram: '4GiB',
    ephemeralDisk: '20GiB',
    internalNetworkBandwidth: '-',
    access: 'Private',
    type: 'Custom',
  },
  {
    id: 'flv-015',
    name: 'custom.medium',
    category: 'Custom',
    vcpu: 4,
    ram: '8GiB',
    ephemeralDisk: '50GiB',
    internalNetworkBandwidth: '10Gbps',
    access: 'Private',
    type: 'Custom',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  {
    key: 'access',
    label: 'Access',
    type: 'select',
    options: [
      { value: 'Public', label: 'Public' },
      { value: 'Private', label: 'Private' },
    ],
  },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'vcpu', label: 'vCPU', visible: true },
  { key: 'ram', label: 'RAM', visible: true },
  { key: 'ephemeralDisk', label: 'Root Disk', visible: true },
  { key: 'access', label: 'Access', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeAdminFlavorsPage() {
  const [prefsOpen, setPrefsOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'cpu';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const filteredFlavors = useMemo(() => {
    let filtered = mockFlavors;

    switch (activeTab) {
      case 'cpu':
        filtered = filtered.filter((f) => f.type === 'CPU');
        break;
      case 'gpu':
        filtered = filtered.filter((f) => f.type === 'GPU');
        break;
      case 'mpu':
        filtered = filtered.filter((f) => f.type === 'MPU');
        break;
      case 'custom':
        filtered = filtered.filter((f) => f.type === 'Custom');
        break;
      default:
        break;
    }

    if (appliedFilters.length > 0) {
      filtered = filtered.filter((f) =>
        appliedFilters.every((filter) => {
          const value = String(f[filter.key as keyof Flavor] || '').toLowerCase();
          return value.includes(String(filter.value ?? '').toLowerCase());
        })
      );
    }

    return filtered;
  }, [activeTab, appliedFilters]);

  const itemsPerPage = 10;
  const paginatedRows = filteredFlavors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

  const columns: TableColumn[] = useMemo(() => {
    const showGpuCols = activeTab === 'gpu' || activeTab === 'mpu';
    const cols: TableColumn[] = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'vcpu', header: 'vCPU', sortable: true },
      { key: 'ram', header: 'RAM', sortable: true },
      { key: 'ephemeralDisk', header: 'Root Disk', sortable: true },
    ];
    if (showGpuCols) {
      cols.push(
        { key: 'gpuType', header: 'GPU Type', sortable: true },
        { key: 'numaNodes', header: 'NUMA Nodes', sortable: true },
        { key: 'cpuPolicy', header: 'CPU Policy', sortable: true },
        { key: 'cpuThreadPolicy', header: 'CPU Thread Policy', sortable: true }
      );
    }
    cols.push(
      { key: 'access', header: 'Public', sortable: true },
      { key: 'actions', header: 'Action', width: 60, align: 'center' }
    );
    return cols;
  }, [activeTab]);

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Flavors" />
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={setActiveTab}
        size="sm"
        variant="line"
        contentClassName="hidden"
        fullWidth
      >
        <Tab id="cpu" label="CPU">
          {null}
        </Tab>
        <Tab id="gpu" label="GPU">
          {null}
        </Tab>
        <Tab id="mpu" label="MPU">
          {null}
        </Tab>
        <Tab id="custom" label="Custom">
          {null}
        </Tab>
      </Tabs>

      <div className="flex items-center gap-1">
        <FilterSearchInput
          filterKeys={filterKeys}
          onFilterAdd={handleFilterAdd}
          selectedFilters={appliedFilters}
          placeholder="Search flavor by attributes"
          defaultFilterKey="name"
        />
        <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
          <IconDownload size={12} />
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

      {filteredFlavors.length > 0 && (
        <Pagination
          totalCount={filteredFlavors.length}
          size={itemsPerPage}
          currentAt={currentPage}
          onPageChange={setCurrentPage}
          onSettingClick={() => setPrefsOpen(true)}
          totalCountLabel="items"
          selectedCount={0}
        />
      )}

      <Table<Flavor>
        columns={columns}
        rows={paginatedRows}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedRows.map((row) => (
          <Table.Tr key={row.id} rowData={row}>
            <Table.Td rowData={row} column={c('name')}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute-admin/flavors/${row.id}`}
                  className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                >
                  {row.name}
                </Link>
                <span className="text-11 leading-16 text-text-muted truncate">ID : {row.id}</span>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={c('vcpu')}>
              {row.vcpu}
            </Table.Td>
            <Table.Td rowData={row} column={c('ram')}>
              {row.ram}
            </Table.Td>
            <Table.Td rowData={row} column={c('ephemeralDisk')}>
              {row.ephemeralDisk}
            </Table.Td>
            {(activeTab === 'gpu' || activeTab === 'mpu') && (
              <>
                <Table.Td rowData={row} column={c('gpuType')}>
                  {row.gpuType ?? '-'}
                </Table.Td>
                <Table.Td rowData={row} column={c('numaNodes')}>
                  {row.numaNodes ?? '-'}
                </Table.Td>
                <Table.Td rowData={row} column={c('cpuPolicy')}>
                  {row.cpuPolicy ?? '-'}
                </Table.Td>
                <Table.Td rowData={row} column={c('cpuThreadPolicy')}>
                  {row.cpuThreadPolicy ?? '-'}
                </Table.Td>
              </>
            )}
            <Table.Td rowData={row} column={c('access')}>
              {row.access === 'Public' ? 'On' : 'Off'}
            </Table.Td>
            <Table.Td rowData={row} column={c('actions')} preventClickPropagation>
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
                <ContextMenu.Item action={() => console.log('Create instance', row.id)}>
                  Create instance
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Create instance template', row.id)}>
                  Create instance template
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
