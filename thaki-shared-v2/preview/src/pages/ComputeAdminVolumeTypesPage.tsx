import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Title } from '@shared/components/Title';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { IconDotsCircleHorizontal, IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

interface VolumeType extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  encryption: string;
  qosSpecName: string | null;
  qosSpecId: string | null;
}

const mockVolumeTypes: VolumeType[] = [
  {
    id: 'vt-001',
    name: 'ssd-performance',
    description: 'High performance SSD storage',
    encryption: 'luks',
    qosSpecName: 'high-iops',
    qosSpecId: 'qos-001',
  },
  {
    id: 'vt-002',
    name: 'hdd-standard',
    description: 'Standard HDD storage',
    encryption: 'plain',
    qosSpecName: null,
    qosSpecId: null,
  },
  {
    id: 'vt-003',
    name: 'nvme-ultra',
    description: 'Ultra-fast NVMe storage',
    encryption: 'luks',
    qosSpecName: 'ultra-perf',
    qosSpecId: 'qos-002',
  },
  {
    id: 'vt-004',
    name: 'encrypted-secure',
    description: 'Encrypted secure storage',
    encryption: 'luks2',
    qosSpecName: 'standard',
    qosSpecId: 'qos-003',
  },
  {
    id: 'vt-005',
    name: 'cold-archive',
    description: 'Cold tier object-backed volumes',
    encryption: 'plain',
    qosSpecName: 'archive-qos',
    qosSpecId: 'qos-004',
  },
  {
    id: 'vt-006',
    name: 'legacy-type',
    description: 'Legacy migration volume type',
    encryption: 'plain',
    qosSpecName: null,
    qosSpecId: null,
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Filter by name...' },
  {
    key: 'description',
    label: 'Description',
    type: 'input',
    placeholder: 'Filter by description...',
  },
  { key: 'encryption', label: 'Encryption', type: 'input', placeholder: 'Filter by encryption...' },
  {
    key: 'qosSpec',
    label: 'Associated QoS Spec',
    type: 'input',
    placeholder: 'Filter by QoS spec...',
  },
  {
    key: 'isPublic',
    label: 'Public',
    type: 'select',
    options: [
      { value: 'true', label: 'On' },
      { value: 'false', label: 'Off' },
    ],
  },
];

function rowMatchesFilter(row: VolumeType, filter: FilterKeyWithValue): boolean {
  if (filter.key === 'isPublic') {
    return String(row.isPublic) === String(filter.value);
  }
  const q = String(filter.value ?? '').toLowerCase();
  if (!q) return true;
  switch (filter.key) {
    case 'name':
      return row.name.toLowerCase().includes(q);
    case 'description':
      return row.description.toLowerCase().includes(q);
    case 'encryption':
      return row.encryption.toLowerCase().includes(q);
    case 'qosSpec':
      return (row.qosSpec ?? '').toLowerCase().includes(q);
    default:
      return true;
  }
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'qosSpec', label: 'Associated QoS Spec', visible: true },
  { key: 'encryption', label: 'Encryption', visible: true },
  { key: 'isPublic', label: 'Public', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

export function ComputeAdminVolumeTypesPage() {
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    if (appliedFilters.length === 0) return mockVolumeTypes;
    return mockVolumeTypes.filter((row) => appliedFilters.every((f) => rowMatchesFilter(row, f)));
  }, [appliedFilters]);

  const pageRows = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasSelection = selectedRows.length > 0;

  const columns: TableColumn[] = useMemo(
    () => [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'description', header: 'Description', sortable: true },
      { key: 'qosSpec', header: 'Associated QoS Spec' },
      { key: 'encryption', header: 'Encryption', sortable: true },
      { key: 'isPublic', header: 'Public' },
      { key: 'actions', header: 'Action', width: 60, align: 'center', clickable: false },
    ],
    []
  );

  const c = (key: string) => columns.find((col) => col.key === key)!;

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Volume types" />
        <Button variant="primary" size="md">
          Create volume type
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search volume types by attributes"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Download">
            <IconDownload size={12} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
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
        totalCount={filtered.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => setPrefsOpen(true)}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<VolumeType>
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
            <Table.Td rowData={row} column={c('name')}>
              <Link to={`/compute-admin/volume-types/${row.id}`} className={linkClass}>
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={c('description')}>
              <span
                className="text-12 text-text truncate block max-w-[240px]"
                title={row.description}
              >
                {row.description}
              </span>
            </Table.Td>
            <Table.Td rowData={row} column={c('qosSpec')}>
              {row.qosSpecId && row.qosSpec ? (
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link to={`/compute-admin/qos-specs/${row.qosSpecId}`} className={linkClass}>
                    {row.qosSpec}
                  </Link>
                  <span className="text-11 leading-16 text-text-muted">ID: {row.qosSpecId}</span>
                </div>
              ) : (
                <span className="text-12 text-text-muted">-</span>
              )}
            </Table.Td>
            <Table.Td rowData={row} column={c('encryption')}>
              <span className="text-12 text-text">{row.encryption}</span>
            </Table.Td>
            <Table.Td rowData={row} column={c('isPublic')}>
              <span className="text-12 text-text">{row.isPublic ? 'On' : 'Off'}</span>
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
                    aria-label="Row actions"
                  >
                    <IconDotsCircleHorizontal size={16} stroke={1.5} />
                  </button>
                )}
              >
                <ContextMenu.Item action={() => console.log('edit', row.id)}>Edit</ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('create qos', row.id)}>
                  Create QoS spec
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('delete', row.id)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
