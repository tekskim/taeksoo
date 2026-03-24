import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { CreateServerGroupDrawer } from '../drawers/compute/misc/CreateServerGroupDrawer';
import { EditServerGroupDrawer } from '../drawers/compute/misc/EditServerGroupDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { Badge } from '@shared/components/Badge';
import { Popover } from '@shared/components/Popover';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type PolicyType = 'Anti-affinity' | 'Affinity' | 'Soft-anti-affinity' | 'Soft-affinity';

interface ServerGroup {
  id: string;
  name: string;
  policy: PolicyType;
  instances: { name: string; id: string }[];
}

const mockServerGroups: ServerGroup[] = [
  {
    id: 'sg-001',
    name: 'server-1',
    policy: 'Anti-affinity',
    instances: [{ name: 'tk-instance', id: '294u92s2' }],
  },
  {
    id: 'sg-002',
    name: 'web-servers',
    policy: 'Anti-affinity',
    instances: [
      { name: 'web-01', id: 'a3f8k2m1' },
      { name: 'web-02', id: 'b7d4n9p3' },
      { name: 'web-03', id: 'c1e6q5r8' },
    ],
  },
  {
    id: 'sg-003',
    name: 'db-cluster',
    policy: 'Affinity',
    instances: [
      { name: 'db-primary', id: 'd9g2t7v4' },
      { name: 'db-replica', id: 'e5h8w3x6' },
    ],
  },
  {
    id: 'sg-004',
    name: 'cache-group',
    policy: 'Soft-anti-affinity',
    instances: [
      { name: 'redis-01', id: 'f2j4y1z9' },
      { name: 'redis-02', id: 'g8k6a3b5' },
    ],
  },
  {
    id: 'sg-005',
    name: 'app-servers',
    policy: 'Anti-affinity',
    instances: [
      { name: 'app-01', id: 'h4m9c7d2' },
      { name: 'app-02', id: 'i1n5e8f3' },
      { name: 'app-03', id: 'j6p2g4h7' },
      { name: 'app-04', id: 'k3q8i9j1' },
    ],
  },
  {
    id: 'sg-006',
    name: 'monitoring',
    policy: 'Soft-affinity',
    instances: [
      { name: 'prometheus', id: 'l7r4k2m5' },
      { name: 'grafana', id: 'm9s1l6n8' },
    ],
  },
  {
    id: 'sg-007',
    name: 'k8s-workers',
    policy: 'Anti-affinity',
    instances: [
      { name: 'worker-01', id: 'n5t3o7p4' },
      { name: 'worker-02', id: 'o2u8q1r6' },
      { name: 'worker-03', id: 'p8v4s3t9' },
    ],
  },
  {
    id: 'sg-008',
    name: 'k8s-masters',
    policy: 'Anti-affinity',
    instances: [
      { name: 'master-01', id: 'q4w9u5v2' },
      { name: 'master-02', id: 'r1x6w8y3' },
      { name: 'master-03', id: 's7z2x4a1' },
    ],
  },
  {
    id: 'sg-009',
    name: 'storage-nodes',
    policy: 'Affinity',
    instances: [
      { name: 'storage-01', id: 't3b8y6c5' },
      { name: 'storage-02', id: 'u9d4z2e7' },
    ],
  },
  {
    id: 'sg-010',
    name: 'load-balancers',
    policy: 'Anti-affinity',
    instances: [
      { name: 'lb-01', id: 'v5f1a9g3' },
      { name: 'lb-02', id: 'w2h7b4i8' },
    ],
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  {
    key: 'policy',
    label: 'Policy',
    type: 'select',
    options: [
      { value: 'Anti-affinity', label: 'Anti-affinity' },
      { value: 'Affinity', label: 'Affinity' },
      { value: 'Soft-anti-affinity', label: 'Soft-anti-affinity' },
      { value: 'Soft-affinity', label: 'Soft-affinity' },
    ],
  },
  { key: 'instances', label: 'Instances', type: 'input', placeholder: 'Enter instance...' },
];

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

function sgMatchesFilter(sg: ServerGroup, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  if (filter.key === 'instances') {
    const hay = sg.instances
      .map((i) => `${i.name} ${i.id}`)
      .join(' ')
      .toLowerCase();
    return hay.includes(fv);
  }
  const key = filter.key as keyof ServerGroup;
  const value = String(sg[key] ?? '').toLowerCase();
  return value.includes(fv);
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'policy', label: 'Policy', visible: true },
  { key: 'members', label: 'Members', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeServerGroupsPage() {
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ServerGroup | null>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const [serverGroups, setServerGroups] = useState(mockServerGroups);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return serverGroups;
    return serverGroups.filter((sg) => appliedFilters.every((f) => sgMatchesFilter(sg, f)));
  }, [serverGroups, appliedFilters]);

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
    setServerGroups((prev) => prev.filter((sg) => !selectedRows.includes(sg.id)));
    setSelectedRows([]);
  };

  const handleRowDelete = (row: ServerGroup) => {
    setServerGroups((prev) => prev.filter((sg) => sg.id !== row.id));
  };

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'instances', header: 'Instances', sortable: true },
    { key: 'policy', header: 'Policy', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const hasSelection = selectedRows.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Server groups" />
        <Button variant="primary" size="md">
          Create Server Group
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search server group by attributes"
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

      <SelectableTable<ServerGroup>
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
        {paginatedRows.map((row) => {
          const first = row.instances[0];
          const extra = row.instances.length - 1;
          return (
            <Table.Tr key={row.id} rowData={row}>
              <Table.Td rowData={row} column={columns[0]}>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link to={`/compute/server-groups/${row.id}`} className={`${linkClass} truncate`}>
                    {row.name}
                  </Link>
                  <span className="text-11 leading-16 text-text-muted truncate">ID:{row.id}</span>
                </div>
              </Table.Td>
              <Table.Td rowData={row} column={columns[1]}>
                {!first ? (
                  <span className="text-text-muted">—</span>
                ) : (
                  <div className="flex items-center gap-1 min-w-0">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-12 leading-18 text-text truncate">{first.name}</span>
                      <span className="text-11 leading-16 text-text-muted truncate">
                        ID:{first.id}
                      </span>
                    </div>
                    {extra > 0 && (
                      <span className="ml-auto shrink-0">
                        <Popover
                          trigger="click"
                          position="bottom"
                          aria-label={`All instances (${row.instances.length})`}
                          content={
                            <div className="p-4 min-w-[160px] max-w-[320px]">
                              <div className="text-[10px] font-normal leading-[14px] text-text-muted mb-2">
                                All Instances ({row.instances.length})
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {row.instances.map((inst, i) => (
                                  <Badge key={i} theme="gry" size="sm" type="subtle">
                                    {inst.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          }
                        >
                          <span className="inline-flex shrink-0 items-center justify-center w-5 h-5 rounded border border-transparent text-[10px] font-normal leading-[14px] text-text-muted bg-surface-subtle hover:bg-surface-muted transition-colors cursor-pointer">
                            +{extra}
                          </span>
                        </Popover>
                      </span>
                    )}
                  </div>
                )}
              </Table.Td>
              <Table.Td rowData={row} column={columns[2]}>
                {row.policy}
              </Table.Td>
              <Table.Td rowData={row} column={columns[3]} preventClickPropagation>
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
                    action={() => console.log('Create instance in server group:', row.id)}
                  >
                    Create instance
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => handleRowDelete(row)} danger>
                    Delete
                  </ContextMenu.Item>
                </ContextMenu.Root>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </SelectableTable>
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
