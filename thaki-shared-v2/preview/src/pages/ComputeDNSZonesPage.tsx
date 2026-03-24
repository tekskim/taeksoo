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
import { Badge } from '@shared/components/Badge';
import { IconDownload, IconEdit, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type ZoneStatus = 'active' | 'pending' | 'error';

interface DNSZone {
  id: string;
  name: string;
  type: 'Public' | 'Private';
  status: ZoneStatus;
  recordCount: number;
  ttl: number;
  serial: string;
  description: string;
  createdAt: string;
}

const mockZones: DNSZone[] = [
  {
    id: 'zone-001',
    name: 'example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 24,
    ttl: 3600,
    serial: '2025111001',
    description: 'Production domain',
    createdAt: 'Nov 10, 2025 09:15:22',
  },
  {
    id: 'zone-002',
    name: 'staging.example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 12,
    ttl: 3600,
    serial: '2025110901',
    description: 'Staging environment',
    createdAt: 'Nov 9, 2025 11:32:45',
  },
  {
    id: 'zone-003',
    name: 'internal.local.',
    type: 'Private',
    status: 'active',
    recordCount: 45,
    ttl: 300,
    serial: '2025110801',
    description: 'Internal services',
    createdAt: 'Nov 8, 2025 14:18:33',
  },
  {
    id: 'zone-004',
    name: 'dev.example.com.',
    type: 'Public',
    status: 'pending',
    recordCount: 3,
    ttl: 3600,
    serial: '2025110701',
    description: 'Development environment',
    createdAt: 'Nov 7, 2025 08:42:17',
  },
  {
    id: 'zone-005',
    name: 'api.example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 8,
    ttl: 1800,
    serial: '2025110601',
    description: 'API gateway domain',
    createdAt: 'Nov 6, 2025 16:25:51',
  },
  {
    id: 'zone-006',
    name: 'db.internal.local.',
    type: 'Private',
    status: 'error',
    recordCount: 6,
    ttl: 60,
    serial: '2025110501',
    description: 'Database cluster DNS',
    createdAt: 'Nov 5, 2025 10:55:28',
  },
  {
    id: 'zone-007',
    name: 'cdn.example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 15,
    ttl: 86400,
    serial: '2025110401',
    description: 'CDN endpoint records',
    createdAt: 'Nov 4, 2025 13:38:42',
  },
  {
    id: 'zone-008',
    name: 'mail.example.com.',
    type: 'Public',
    status: 'active',
    recordCount: 10,
    ttl: 3600,
    serial: '2025110301',
    description: 'Mail server records',
    createdAt: 'Nov 3, 2025 09:12:15',
  },
];

const statusMap: Record<ZoneStatus, StatusVariant> = {
  active: 'active',
  pending: 'building',
  error: 'error',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Search zones by name' },
];

function zoneMatches(z: DNSZone, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  return z.name.toLowerCase().includes(fv);
}

function stripTime(s: string): string {
  return s.replace(/\s+\d{2}:\d{2}:\d{2}$/, '');
}

export function ComputeDNSZonesPage() {
  const [zones] = useState(mockZones);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return zones;
    return zones.filter((z) => appliedFilters.every((f) => zoneMatches(z, f)));
  }, [zones, appliedFilters]);

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

  const columns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Zone Name', sortable: true },
    { key: 'type', header: 'Type' },
    { key: 'recordCount', header: 'Records', sortable: true },
    { key: 'ttl', header: 'TTL' },
    { key: 'serial', header: 'Serial' },
    { key: 'description', header: 'Description' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  const linkClass =
    'text-12 leading-18 font-medium text-primary hover:underline no-underline truncate';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="DNS Zones" />
        <Button variant="primary" size="md" leftIcon={<IconPlus size={14} stroke={1.5} />}>
          Create Zone
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search zones by name"
            defaultFilterKey="name"
          />
          <Button appearance="outline" variant="secondary" size="sm" aria-label="Export">
            <IconDownload size={12} stroke={1.5} />
          </Button>
        </div>
        <div className="h-4 w-px bg-border" />
        <Button appearance="outline" variant="secondary" size="sm" disabled={!hasSelection}>
          <IconEdit size={12} stroke={1.5} /> Edit TTL
        </Button>
        <Button appearance="outline" variant="muted" size="sm" disabled={!hasSelection}>
          <IconTrash size={12} stroke={1.5} /> Delete
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
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      <SelectableTable<DNSZone>
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
              <Link to={`/compute/dns-zones/${row.id}`} className={linkClass}>
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              <Badge theme={row.type === 'Public' ? 'blu' : 'gry'} size="sm" type="subtle">
                {row.type}
              </Badge>
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.recordCount}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.ttl}s
            </Table.Td>
            <Table.Td rowData={row} column={columns[5]}>
              {row.serial}
            </Table.Td>
            <Table.Td rowData={row} column={columns[6]}>
              {row.description}
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
                <ContextMenu.Item action={() => console.log('Edit:', row.id)}>
                  Edit zone
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Add record:', row.id)}>
                  Add record
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Export:', row.id)}>
                  Export zone file
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Delete:', row.id)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}
