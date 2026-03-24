import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EditPortDrawer } from '../drawers/compute/network/EditPortDrawer';
import { EditPortSecurityGroupsDrawer } from '../drawers/compute/network/EditPortSecurityGroupsDrawer';
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
  ViewPreferencesDrawer,
  type ColumnPreference,
} from '../drawers/common/ViewPreferencesDrawer';

type PortStatus = 'active' | 'error' | 'down';

interface PortRow {
  id: string;
  name: string;
  status: PortStatus;
  network: string;
  fixedIps: string;
  macAddress: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockRows: PortRow[] = [
  {
    id: 'port-001',
    name: 'instance-01-eth0',
    status: 'active',
    network: 'prod-vpc-main',
    fixedIps: '10.0.1.24',
    macAddress: 'fa:16:3e:4a:2b:c1',
    createdAt: 'Sep 12, 2025 09:23:41',
  },
  {
    id: 'port-002',
    name: 'lb-vip-port',
    status: 'active',
    network: 'shared-services',
    fixedIps: '10.0.10.5, 10.0.10.6',
    macAddress: 'fa:16:3e:88:aa:01',
    createdAt: 'Sep 11, 2025 14:07:22',
  },
  {
    id: 'port-003',
    name: 'orphan-dhcp',
    status: 'down',
    network: 'qa-isolated',
    fixedIps: '—',
    macAddress: 'fa:16:3e:11:22:33',
    createdAt: 'Sep 10, 2025 11:45:33',
  },
  {
    id: 'port-004',
    name: 'router-gw-int',
    status: 'active',
    network: 'edge-uplink',
    fixedIps: '203.0.113.2',
    macAddress: 'fa:16:3e:de:ad:00',
    createdAt: 'Aug 1, 2025 16:52:08',
  },
  {
    id: 'port-005',
    name: 'db-cluster-port',
    status: 'error',
    network: 'prod-vpc-main',
    fixedIps: '10.0.2.101',
    macAddress: 'fa:16:3e:ff:ee:dd',
    createdAt: 'Jan 5, 2025 08:30:15',
  },
  {
    id: 'port-006',
    name: 'staging-app-port',
    status: 'active',
    network: 'staging-net',
    fixedIps: '172.16.5.40',
    macAddress: 'fa:16:3e:01:ab:cd',
    createdAt: 'Apr 18, 2025 13:19:44',
  },
  {
    id: 'port-007',
    name: 'analytics-tap',
    status: 'active',
    network: 'analytics-net',
    fixedIps: '10.30.0.12',
    macAddress: 'fa:16:3e:55:66:77',
    createdAt: 'Mar 22, 2025 10:41:27',
  },
  {
    id: 'port-008',
    name: 'vpn-peer',
    status: 'down',
    network: 'dmz-net',
    fixedIps: '192.168.50.2',
    macAddress: 'fa:16:3e:99:88:77',
    createdAt: 'Feb 14, 2025 17:03:56',
  },
];

const statusMap: Record<PortStatus, StatusVariant> = {
  active: 'active',
  error: 'error',
  down: 'shutoff',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  { key: 'network', label: 'Network', type: 'input', placeholder: 'Enter network...' },
];

function rowMatchesFilter(row: PortRow, filter: FilterKeyWithValue): boolean {
  const fieldId = filter.key;
  const filterValue = (filter.value ?? '').toLowerCase();
  if (!fieldId || !filterValue) return true;

  switch (fieldId) {
    case 'name':
      return row.name?.toLowerCase().includes(filterValue) ?? false;
    case 'network':
      return row.network?.toLowerCase().includes(filterValue) ?? false;
    default:
      return true;
  }
}

const VIEW_PREFERENCE_COLUMNS: ColumnPreference[] = [
  { key: 'status', label: 'Status', visible: true },
  { key: 'name', label: 'Name', visible: true, locked: true },
  { key: 'network', label: 'Network', visible: true },
  { key: 'fixedIps', label: 'Fixed IPs', visible: true },
  { key: 'macAddress', label: 'MAC Address', visible: true },
  { key: 'createdAt', label: 'Created at', visible: true },
  { key: 'actions', label: 'Action', visible: true, locked: true },
];

export function ComputePortsPage() {
  const navigate = useNavigate();
  const [editPortOpen, setEditPortOpen] = useState(false);
  const [editSgOpen, setEditSgOpen] = useState(false);
  const [menuPort, setMenuPort] = useState<PortRow | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [prefsOpen, setPrefsOpen] = useState(false);

  const filteredRows = useMemo(() => {
    if (appliedFilters.length === 0) return mockRows;
    return mockRows.filter((row) => appliedFilters.every((f) => rowMatchesFilter(row, f)));
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
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'network', header: 'Network' },
    { key: 'fixedIps', header: 'Fixed IPs' },
    { key: 'macAddress', header: 'MAC Address' },
    { key: 'createdAt', header: 'Created at', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Ports" />
        <Button variant="primary" size="md" onClick={() => navigate('/compute/ports/create')}>
          Create port
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search ports by attributes"
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

      <SelectableTable<PortRow>
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
                to={`/compute/ports/${row.id}`}
                className="text-primary font-medium hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {row.name}
              </Link>
            </Table.Td>
            <Table.Td rowData={row} column={columns[2]}>
              {row.network}
            </Table.Td>
            <Table.Td rowData={row} column={columns[3]}>
              {row.fixedIps}
            </Table.Td>
            <Table.Td rowData={row} column={columns[4]}>
              {row.macAddress}
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
                    setMenuPort(row);
                    setEditPortOpen(true);
                  }}
                >
                  Edit
                </ContextMenu.Item>
                <ContextMenu.Item
                  action={() => {
                    setMenuPort(row);
                    setEditSgOpen(true);
                  }}
                >
                  Manage security groups
                </ContextMenu.Item>
                <ContextMenu.Item action={() => console.log('Delete', row.id)} danger>
                  Delete
                </ContextMenu.Item>
              </ContextMenu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>

      <EditPortDrawer
        isOpen={editPortOpen}
        onClose={() => {
          setEditPortOpen(false);
          setMenuPort(null);
        }}
        portId={menuPort?.id}
        initialData={
          menuPort
            ? {
                name: menuPort.name,
                description: '',
                adminStateUp: menuPort.status === 'active',
                bindingHost: '',
              }
            : undefined
        }
      />
      <EditPortSecurityGroupsDrawer
        isOpen={editSgOpen}
        onClose={() => {
          setEditSgOpen(false);
          setMenuPort(null);
        }}
        portName={menuPort?.name}
        initialSelectedIds={['psg-1']}
      />
      <ViewPreferencesDrawer
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={VIEW_PREFERENCE_COLUMNS}
      />
    </div>
  );
}
