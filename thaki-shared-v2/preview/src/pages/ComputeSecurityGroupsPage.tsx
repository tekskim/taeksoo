import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { CreateSecurityGroupDrawer } from '../drawers/compute/security-group/CreateSecurityGroupDrawer';
import { EditSecurityGroupDrawer } from '../drawers/compute/security-group/EditSecurityGroupDrawer';
import {
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';
import { Title } from '@shared/components/Title';
import { Tooltip } from '@shared/components/Tooltip';
import { IconDownload, IconTrash, IconX } from '@tabler/icons-react';
import containerIcon from '@shared/assets/app-icons/container.png';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type SecurityGroupStatus = 'active' | 'error';

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  ingressRules: number;
  egressRules: number;
  createdAt: string;
  status: SecurityGroupStatus;
  origin?: 'container';
  [key: string]: unknown;
}

const mockSecurityGroups: SecurityGroup[] = [
  {
    id: 'sg-001',
    name: 'sg-01',
    description: 'Web server access group',
    ingressRules: 3,
    egressRules: 3,
    createdAt: 'Jan 15, 2024 12:22:26',
    status: 'active',
    origin: 'container',
  },
  {
    id: 'sg-002',
    name: 'default',
    description: 'Default security group',
    ingressRules: 2,
    egressRules: 2,
    createdAt: 'Jan 10, 2024 01:17:01',
    status: 'active',
    origin: 'container',
  },
  {
    id: 'sg-003',
    name: 'db-sg',
    description: 'Database access group',
    ingressRules: 5,
    egressRules: 1,
    createdAt: 'Feb 1, 2024 10:20:28',
    status: 'active',
  },
  {
    id: 'sg-004',
    name: 'app-sg',
    description: 'Application server security group',
    ingressRules: 8,
    egressRules: 4,
    createdAt: 'Feb 15, 2024 12:22:26',
    status: 'active',
    origin: 'container',
  },
  {
    id: 'sg-005',
    name: 'lb-sg',
    description: 'Load balancer security group',
    ingressRules: 4,
    egressRules: 2,
    createdAt: 'Mar 1, 2024 10:20:28',
    status: 'active',
  },
  {
    id: 'sg-006',
    name: 'cache-sg',
    description: 'Cache server access group',
    ingressRules: 2,
    egressRules: 1,
    createdAt: 'Mar 10, 2024 01:17:01',
    status: 'active',
  },
  {
    id: 'sg-007',
    name: 'monitor-sg',
    description: 'Monitoring access group',
    ingressRules: 6,
    egressRules: 3,
    createdAt: 'Apr 1, 2024 10:20:28',
    status: 'error',
  },
  {
    id: 'sg-008',
    name: 'vpn-sg',
    description: 'VPN access group',
    ingressRules: 10,
    egressRules: 5,
    createdAt: 'Apr 15, 2024 12:22:26',
    status: 'active',
  },
  {
    id: 'sg-009',
    name: 'admin-sg',
    description: 'Admin access group',
    ingressRules: 15,
    egressRules: 8,
    createdAt: 'May 1, 2024 10:20:28',
    status: 'active',
  },
  {
    id: 'sg-010',
    name: 'test-sg',
    description: 'Test environment security group',
    ingressRules: 1,
    egressRules: 1,
    createdAt: 'May 10, 2024 01:17:01',
    status: 'active',
  },
];

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'description', label: 'Description', type: 'input', placeholder: 'Enter description...' },
];

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputeSecurityGroupsPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return mockSecurityGroups;
    return mockSecurityGroups.filter((sg) =>
      appliedFilters.every((filter) => {
        const value = String(sg[filter.key as keyof SecurityGroup] || '').toLowerCase();
        return value.includes(String(filter.value ?? '').toLowerCase());
      })
    );
  }, [appliedFilters]);

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

  const columns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'description', header: 'Description' },
    { key: 'ingressRules', header: 'Ingress rules', sortable: true },
    { key: 'egressRules', header: 'Egress rules', sortable: true },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  const c = (key: string) => columns.find((col) => col.key === key)!;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Security groups" />
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/compute/security-groups/create')}
        >
          Create security group
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search security group by attributes"
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

      <SelectableTable<SecurityGroup>
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
              <div className="flex items-center gap-2 min-w-0">
                {row.origin === 'container' && (
                  <Tooltip
                    content="This security group was created via the Container cluster."
                    direction="top"
                    focusable={false}
                  >
                    <div className="flex items-center justify-center w-6 h-6 shrink-0 rounded-[4px] border border-border bg-surface">
                      <img src={containerIcon} alt="" className="w-4 h-4" />
                    </div>
                  </Tooltip>
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    to={`/compute/security-groups/${row.id}`}
                    className="text-12 leading-18 font-medium text-primary hover:underline no-underline truncate"
                  >
                    {row.name}
                  </Link>
                  <span className="text-11 leading-16 text-text-muted truncate">ID : {row.id}</span>
                </div>
              </div>
            </Table.Td>
            <Table.Td rowData={row} column={c('description')}>
              {row.description}
            </Table.Td>
            <Table.Td rowData={row} column={c('ingressRules')}>
              {row.ingressRules}
            </Table.Td>
            <Table.Td rowData={row} column={c('egressRules')}>
              {row.egressRules}
            </Table.Td>
            <Table.Td rowData={row} column={c('createdAt')}>
              {row.createdAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
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
                <ContextMenu.Item action={() => console.log('Create rule', row.id)}>
                  Create rule
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Edit', row.id)}>Edit</ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Delete', row.id)} danger>
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
