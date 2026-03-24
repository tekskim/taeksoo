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
import {
  IconDotsCircleHorizontal,
  IconDownload,
  IconLock,
  IconLockOpen,
  IconPlayerPlay,
  IconPlayerStop,
  IconPower,
  IconTerminal2,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';

type InstanceStatus = 'running' | 'stopped' | 'pending' | 'error' | 'building';

interface Instance {
  id: string;
  name: string;
  status: InstanceStatus;
  locked: boolean;
  fixedIp: string;
  floatingIp: string;
  os: string;
  flavor: string;
  vcpu: number;
  ram: string;
  disk: string;
  gpu: string;
  az: string;
  description?: string;
  [key: string]: unknown;
}

const mockInstances: Instance[] = [
  {
    id: 'vm-001',
    name: 'worker-node-01',
    status: 'running',
    locked: true,
    fixedIp: '10.20.30.40',
    floatingIp: '20.30.40.50',
    os: 'Ubuntu 24.04',
    flavor: 'Medium',
    vcpu: 4,
    ram: '8GB',
    disk: '100GB',
    gpu: '1',
    az: 'keystone',
  },
  {
    id: 'vm-002',
    name: 'worker-node-02',
    status: 'running',
    locked: false,
    fixedIp: '10.20.30.41',
    floatingIp: '20.30.40.51',
    os: 'CentOS 7',
    flavor: 'Medium',
    vcpu: 4,
    ram: '8GB',
    disk: '100GB',
    gpu: '1',
    az: 'keystone',
  },
  {
    id: 'vm-003',
    name: 'master-node-01',
    status: 'running',
    locked: true,
    fixedIp: '10.20.30.10',
    floatingIp: '20.30.40.10',
    os: 'Ubuntu 22.04',
    flavor: 'Large',
    vcpu: 8,
    ram: '16GB',
    disk: '200GB',
    gpu: '-',
    az: 'nova',
  },
  {
    id: 'vm-004',
    name: 'db-server-01',
    status: 'stopped',
    locked: true,
    fixedIp: '10.20.30.20',
    floatingIp: '-',
    os: 'CentOS 8',
    flavor: 'XLarge',
    vcpu: 16,
    ram: '64GB',
    disk: '500GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-005',
    name: 'gpu-node-01',
    status: 'running',
    locked: false,
    fixedIp: '10.20.30.50',
    floatingIp: '20.30.40.60',
    os: 'Ubuntu 22.04',
    flavor: 'GPU Large',
    vcpu: 32,
    ram: '128GB',
    disk: '1TB',
    gpu: '4',
    az: 'nova',
  },
  {
    id: 'vm-006',
    name: 'gpu-node-02',
    status: 'running',
    locked: false,
    fixedIp: '10.20.30.51',
    floatingIp: '20.30.40.61',
    os: 'Ubuntu 22.04',
    flavor: 'GPU Large',
    vcpu: 32,
    ram: '128GB',
    disk: '1TB',
    gpu: '4',
    az: 'nova',
  },
  {
    id: 'vm-007',
    name: 'web-server-01',
    status: 'pending',
    locked: false,
    fixedIp: '-',
    floatingIp: '-',
    os: 'Rocky Linux 9',
    flavor: 'Small',
    vcpu: 2,
    ram: '4GB',
    disk: '50GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-008',
    name: 'web-server-02',
    status: 'building',
    locked: false,
    fixedIp: '-',
    floatingIp: '-',
    os: 'Rocky Linux 9',
    flavor: 'Small',
    vcpu: 2,
    ram: '4GB',
    disk: '50GB',
    gpu: '-',
    az: 'keystone',
  },
  {
    id: 'vm-009',
    name: 'analytics-01',
    status: 'error',
    locked: true,
    fixedIp: '10.20.30.80',
    floatingIp: '-',
    os: 'Debian 12',
    flavor: 'XLarge',
    vcpu: 16,
    ram: '32GB',
    disk: '500GB',
    gpu: '2',
    az: 'nova',
  },
  {
    id: 'vm-010',
    name: 'cache-server-01',
    status: 'running',
    locked: false,
    fixedIp: '10.20.30.90',
    floatingIp: '20.30.40.90',
    os: 'Debian 12',
    flavor: 'Medium',
    vcpu: 4,
    ram: '16GB',
    disk: '100GB',
    gpu: '-',
    az: 'keystone',
  },
];

const statusMap: Record<InstanceStatus, StatusVariant> = {
  running: 'active',
  stopped: 'shutoff',
  pending: 'paused',
  error: 'error',
  building: 'building',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter instance name...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'running', label: 'Running' },
      { value: 'stopped', label: 'Stopped' },
      { value: 'error', label: 'Error' },
      { value: 'building', label: 'Building' },
    ],
  },
  {
    key: 'os',
    label: 'OS',
    type: 'select',
    options: [
      { value: 'ubuntu', label: 'Ubuntu' },
      { value: 'centos', label: 'CentOS' },
      { value: 'windows', label: 'Windows' },
      { value: 'rocky', label: 'Rocky Linux' },
    ],
  },
  { key: 'flavor', label: 'Flavor', type: 'input', placeholder: 'Enter flavor...' },
];

function instanceMatchesFilter(instance: Instance, filter: FilterKeyWithValue): boolean {
  const fieldId = filter.key;
  const filterValue = (filter.value ?? '').toLowerCase();
  if (!fieldId || !filterValue) return true;

  switch (fieldId) {
    case 'name':
      return instance.name?.toLowerCase().includes(filterValue) ?? false;
    case 'status':
      return instance.status?.toLowerCase() === filterValue;
    case 'os':
      return instance.os?.toLowerCase().includes(filterValue) ?? false;
    case 'flavor':
      return instance.flavor?.toLowerCase().includes(filterValue) ?? false;
    default:
      return true;
  }
}

export function ComputeInstancesPage() {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredInstances = useMemo(() => {
    if (appliedFilters.length === 0) return mockInstances;
    return mockInstances.filter((instance) =>
      appliedFilters.every((filter) => instanceMatchesFilter(instance, filter))
    );
  }, [appliedFilters]);

  const paginatedInstances = useMemo(
    () => filteredInstances.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredInstances, currentPage, itemsPerPage]
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
    { key: 'locked', header: 'Locked', width: 72, align: 'center' },
    { key: 'fixedIp', header: 'Fixed IP', sortable: true },
    { key: 'floatingIp', header: 'Floating IP', sortable: true },
    { key: 'os', header: 'OS', sortable: true },
    { key: 'flavor', header: 'Flavor', sortable: true },
    { key: 'vcpu', header: 'vCPU', sortable: true, align: 'right' },
    { key: 'ram', header: 'RAM', sortable: true, align: 'right' },
    { key: 'disk', header: 'Disk', sortable: true, align: 'right' },
    { key: 'gpu', header: 'GPU', sortable: true },
    { key: 'az', header: 'AZ', sortable: true },
    { key: 'actions', header: 'Action', width: 100, align: 'center' },
  ];

  const logAction = useCallback((label: string, instance: Instance) => {
    console.log(`[Instances] ${label}`, instance.id, instance.name);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Page Header */}
      <div className="flex items-center justify-between h-8">
        <Title title="Instances" />
        <Button variant="primary" size="md" onClick={() => navigate('/compute/instances/create')}>
          Create instance
        </Button>
      </div>

      {/* Toolbar: FilterSearchInput + Download | bulk actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={handleFilterAdd}
            selectedFilters={appliedFilters}
            placeholder="Search instance by attributes"
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
            onClick={() => console.log('[Instances] Bulk Start', selectedRows)}
          >
            <IconPlayerPlay size={12} /> Start
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Instances] Bulk Stop', selectedRows)}
          >
            <IconPlayerStop size={12} /> Stop
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Instances] Bulk Reboot', selectedRows)}
          >
            <IconPower size={12} /> Reboot
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() => console.log('[Instances] Bulk Delete', selectedRows)}
          >
            <IconTrash size={12} /> Delete
          </Button>
        </div>
      </div>

      {/* Applied filter chips */}
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

      {/* Pagination */}
      <Pagination
        totalCount={filteredInstances.length}
        size={itemsPerPage}
        currentAt={currentPage}
        onPageChange={setCurrentPage}
        onSettingClick={() => {}}
        totalCountLabel="items"
        selectedCount={selectedRows.length}
      />

      {/* Table */}
      <SelectableTable<Instance>
        columns={columns}
        rows={paginatedInstances}
        selectionType="checkbox"
        selectedRows={selectedRows}
        onRowSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        stickyLastColumn
      >
        {paginatedInstances.map((instance) => (
          <Table.Tr key={instance.id} rowData={instance}>
            <Table.Td rowData={instance} column={columns[0]}>
              <StatusIndicator variant={statusMap[instance.status]} layout="iconOnly" />
            </Table.Td>
            <Table.Td rowData={instance} column={columns[1]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute/instances/${instance.id}`}
                  className="text-primary font-medium hover:underline truncate"
                  title={instance.name}
                  onClick={(e) => e.stopPropagation()}
                >
                  {instance.name}
                </Link>
                <span className="text-11 text-text-muted truncate" title={instance.id}>
                  ID : {instance.id}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={instance} column={columns[2]}>
              <div className="flex items-center justify-center w-full">
                {instance.locked ? (
                  <IconLock size={16} stroke={1.5} className="text-text" />
                ) : (
                  <IconLockOpen size={16} stroke={1.5} className="text-text-muted" />
                )}
              </div>
            </Table.Td>
            <Table.Td rowData={instance} column={columns[3]}>
              {instance.fixedIp}
            </Table.Td>
            <Table.Td rowData={instance} column={columns[4]}>
              {instance.floatingIp}
            </Table.Td>
            <Table.Td rowData={instance} column={columns[5]}>
              {instance.os}
            </Table.Td>
            <Table.Td rowData={instance} column={columns[6]}>
              <div className="flex flex-col gap-0.5 min-w-0">
                <Link
                  to={`/compute/flavors/${instance.id}`}
                  className="text-primary font-medium hover:underline truncate"
                  title={instance.flavor}
                  onClick={(e) => e.stopPropagation()}
                >
                  {instance.flavor}
                </Link>
                <span className="text-11 text-text-muted truncate" title={instance.id}>
                  ID : {instance.id.substring(0, 8)}
                </span>
              </div>
            </Table.Td>
            <Table.Td rowData={instance} column={columns[7]}>
              {instance.vcpu}
            </Table.Td>
            <Table.Td rowData={instance} column={columns[8]}>
              {instance.ram}
            </Table.Td>
            <Table.Td rowData={instance} column={columns[9]}>
              {instance.disk}
            </Table.Td>
            <Table.Td rowData={instance} column={columns[10]}>
              {instance.gpu}
            </Table.Td>
            <Table.Td rowData={instance} column={columns[11]}>
              {instance.az}
            </Table.Td>
            <Table.Td rowData={instance} column={columns[12]} preventClickPropagation>
              <div className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    logAction('Open console', instance);
                  }}
                  aria-label="Open console"
                >
                  <IconTerminal2 size={16} stroke={1.5} className="text-text" />
                </button>
                <ContextMenu.Root
                  direction="bottom-end"
                  gap={4}
                  trigger={({ toggle }) => (
                    <button
                      type="button"
                      onClick={toggle}
                      className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none"
                      aria-label="Row actions"
                    >
                      <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-text" />
                    </button>
                  )}
                >
                  <ContextMenu.SubItems label="Instance status">
                    <ContextMenu.Item action={() => logAction('Start', instance)}>
                      Start
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Stop', instance)} danger>
                      Stop
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Reboot', instance)} danger>
                      Reboot
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Soft reboot', instance)}>
                      Soft reboot
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Pause', instance)}>
                      Pause
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Suspend', instance)}>
                      Suspend
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Shelve', instance)}>
                      Shelve
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Unpause', instance)}>
                      Unpause
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Resume', instance)}>
                      Resume
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Unshelve', instance)}>
                      Unshelve
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Rescue', instance)}>
                      Rescue
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Unrescue', instance)}>
                      Unrescue
                    </ContextMenu.Item>
                  </ContextMenu.SubItems>
                  <ContextMenu.SubItems label="Storage & snapshot">
                    <ContextMenu.Item action={() => logAction('Attach volume', instance)}>
                      Attach volume
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Detach volume', instance)} danger>
                      Detach volume
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      action={() => logAction('Create instance snapshot', instance)}
                    >
                      Create instance snapshot
                    </ContextMenu.Item>
                  </ContextMenu.SubItems>
                  <ContextMenu.SubItems label="Network">
                    <ContextMenu.Item action={() => logAction('Attach interface', instance)}>
                      Attach interface
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Detach interface', instance)} danger>
                      Detach interface
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Associate floating IP', instance)}>
                      Associate floating IP
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      action={() => logAction('Disassociate floating IP', instance)}
                      danger
                    >
                      Disassociate floating IP
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Manage security groups', instance)}>
                      Manage security groups
                    </ContextMenu.Item>
                  </ContextMenu.SubItems>
                  <ContextMenu.SubItems label="Configuration">
                    <ContextMenu.Item action={() => logAction('Lock setting', instance)}>
                      Lock setting
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Rebuild', instance)} danger>
                      Rebuild
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Resize', instance)}>
                      Resize
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Manage tags', instance)}>
                      Manage tags
                    </ContextMenu.Item>
                    <ContextMenu.Item action={() => logAction('Edit', instance)}>
                      Edit
                    </ContextMenu.Item>
                  </ContextMenu.SubItems>
                  <ContextMenu.Item action={() => logAction('Confirm resize', instance)}>
                    Confirm resize
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Revert resize', instance)}>
                    Revert resize
                  </ContextMenu.Item>
                  <ContextMenu.Item action={() => logAction('Delete', instance)} danger>
                    Delete
                  </ContextMenu.Item>
                </ContextMenu.Root>
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </SelectableTable>
    </div>
  );
}
