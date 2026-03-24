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
import { Tabs, Tab } from '@shared/components/Tabs';
import { Tooltip } from '@shared/components/Tooltip';
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
import containerIcon from '@shared/assets/app-icons/container.png';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  mockInstances,
  mockBareMetalInstances,
  type Instance,
  type BareMetalInstance,
  type InstanceStatus,
} from './computeInstancesMockData';

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

function instanceMatchesFilter(
  instance: Instance | BareMetalInstance,
  filter: FilterKeyWithValue
): boolean {
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

const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

export function ComputeInstancesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vm' | 'bare-metal'>('vm');
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBareMetalPage, setCurrentBareMetalPage] = useState(1);
  const [selectedVmRows, setSelectedVmRows] = useState<(string | number)[]>([]);
  const [selectedBmRows, setSelectedBmRows] = useState<(string | number)[]>([]);
  const [sortVm, setSortVm] = useState<string>('');
  const [orderVm, setOrderVm] = useState<SortOrder>('asc');
  const [sortBm, setSortBm] = useState<string>('');
  const [orderBm, setOrderBm] = useState<SortOrder>('asc');

  const itemsPerPage = 10;

  const filteredInstances = useMemo(() => {
    if (appliedFilters.length === 0) return mockInstances;
    return mockInstances.filter((instance) =>
      appliedFilters.every((filter) => instanceMatchesFilter(instance, filter))
    );
  }, [appliedFilters]);

  const filteredBareMetal = useMemo(() => {
    if (appliedFilters.length === 0) return mockBareMetalInstances;
    return mockBareMetalInstances.filter((instance) =>
      appliedFilters.every((filter) => instanceMatchesFilter(instance, filter))
    );
  }, [appliedFilters]);

  const paginatedInstances = useMemo(
    () => filteredInstances.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredInstances, currentPage, itemsPerPage]
  );

  const paginatedBareMetal = useMemo(
    () =>
      filteredBareMetal.slice(
        (currentBareMetalPage - 1) * itemsPerPage,
        currentBareMetalPage * itemsPerPage
      ),
    [filteredBareMetal, currentBareMetalPage, itemsPerPage]
  );

  const hasSelection = activeTab === 'vm' ? selectedVmRows.length > 0 : selectedBmRows.length > 0;

  const handleSortVm = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSortVm(nextSort ?? '');
    setOrderVm(nextOrder);
  }, []);

  const handleSortBm = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSortBm(nextSort ?? '');
    setOrderBm(nextOrder);
  }, []);

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setCurrentPage(1);
    setCurrentBareMetalPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setCurrentPage(1);
    setCurrentBareMetalPage(1);
  }, []);

  const logAction = useCallback((label: string, instance: Instance | BareMetalInstance) => {
    console.log(`[Instances] ${label}`, instance.id, instance.name);
  }, []);

  const vmColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'locked', header: 'Locked', width: 72, align: 'center' },
    { key: 'fixedIp', header: 'Fixed IP', sortable: true },
    { key: 'floatingIp', header: 'Floating IP', sortable: true },
    { key: 'os', header: 'OS', sortable: true },
    { key: 'flavor', header: 'Flavor', sortable: true },
    { key: 'vcpu', header: 'vCPU', sortable: true },
    { key: 'ram', header: 'RAM', sortable: true },
    { key: 'disk', header: 'Disk', sortable: true },
    { key: 'gpu', header: 'GPU', sortable: true },
    { key: 'az', header: 'AZ', sortable: true },
    { key: 'actions', header: 'Action', width: 100, align: 'center' },
  ];

  const bmColumns: TableColumn[] = [
    { key: 'status', header: 'Status', width: 80, align: 'center' },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'locked', header: 'Locked', width: 72, align: 'center' },
    { key: 'os', header: 'OS', sortable: true },
    { key: 'flavor', header: 'Flavor', sortable: true },
    { key: 'cpu', header: 'CPU', sortable: true },
    { key: 'ram', header: 'RAM', sortable: true },
    { key: 'disk', header: 'Disk', sortable: true },
    { key: 'gpu', header: 'GPU', sortable: true },
    { key: 'az', header: 'AZ', sortable: true },
    { key: 'actions', header: 'Action', width: 60, align: 'center' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between h-8">
        <Title title="Instances list" />
        {activeTab === 'vm' && (
          <Button variant="primary" size="md" onClick={() => navigate('/compute/instances/create')}>
            Create instance
          </Button>
        )}
      </div>

      <Tabs
        activeTabId={activeTab}
        onChange={(id) => setActiveTab(id as 'vm' | 'bare-metal')}
        variant="line"
        size="sm"
        contentClassName="hidden"
        fullWidth
      >
        <Tab id="vm" label="VM">
          <span className="sr-only">VM</span>
        </Tab>
        <Tab id="bare-metal" label="Bare metal">
          <span className="sr-only">Bare metal</span>
        </Tab>
      </Tabs>

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
            onClick={() =>
              console.log(
                '[Instances] Bulk Start',
                activeTab === 'vm' ? selectedVmRows : selectedBmRows
              )
            }
          >
            <IconPlayerPlay size={12} /> Start
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() =>
              console.log(
                '[Instances] Bulk Stop',
                activeTab === 'vm' ? selectedVmRows : selectedBmRows
              )
            }
          >
            <IconPlayerStop size={12} /> Stop
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() =>
              console.log(
                '[Instances] Bulk Reboot',
                activeTab === 'vm' ? selectedVmRows : selectedBmRows
              )
            }
          >
            <IconPower size={12} /> Reboot
          </Button>
          <Button
            appearance="outline"
            variant="muted"
            size="sm"
            disabled={!hasSelection}
            onClick={() =>
              console.log(
                '[Instances] Bulk Delete',
                activeTab === 'vm' ? selectedVmRows : selectedBmRows
              )
            }
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
              setCurrentBareMetalPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {activeTab === 'vm' && filteredInstances.length > 0 && (
        <Pagination
          totalCount={filteredInstances.length}
          size={itemsPerPage}
          currentAt={currentPage}
          onPageChange={setCurrentPage}
          onSettingClick={() => {}}
          totalCountLabel="items"
          selectedCount={selectedVmRows.length}
        />
      )}

      {activeTab === 'bare-metal' && filteredBareMetal.length > 0 && (
        <Pagination
          totalCount={filteredBareMetal.length}
          size={itemsPerPage}
          currentAt={currentBareMetalPage}
          onPageChange={setCurrentBareMetalPage}
          onSettingClick={() => {}}
          totalCountLabel="items"
          selectedCount={selectedBmRows.length}
        />
      )}

      {activeTab === 'vm' && (
        <SelectableTable<Instance>
          columns={vmColumns}
          rows={paginatedInstances}
          selectionType="checkbox"
          selectedRows={selectedVmRows}
          onRowSelectionChange={setSelectedVmRows}
          getRowId={(row) => row.id}
          sort={sortVm}
          order={orderVm}
          onSortChange={handleSortVm}
          stickyLastColumn
        >
          {paginatedInstances.map((instance) => (
            <Table.Tr key={instance.id} rowData={instance}>
              <Table.Td rowData={instance} column={vmColumns[0]}>
                <StatusIndicator variant={statusMap[instance.status]} layout="iconOnly" />
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[1]}>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    to={`/compute/instances/${instance.id}`}
                    className={`${linkClass} truncate`}
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
              <Table.Td rowData={instance} column={vmColumns[2]}>
                <div className="flex items-center justify-center w-full">
                  {instance.locked ? (
                    <IconLock size={16} stroke={1.5} className="text-text" />
                  ) : (
                    <IconLockOpen size={16} stroke={1.5} className="text-text-muted" />
                  )}
                </div>
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[3]}>
                {instance.fixedIp}
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[4]}>
                {instance.floatingIp}
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[5]}>
                {instance.os}
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[6]}>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    to={`/compute/flavors/${instance.id}`}
                    className={`${linkClass} truncate`}
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
              <Table.Td rowData={instance} column={vmColumns[7]}>
                {instance.vcpu}
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[8]}>
                {instance.ram}
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[9]}>
                {instance.disk}
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[10]}>
                {instance.gpu}
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[11]}>
                {instance.az}
              </Table.Td>
              <Table.Td rowData={instance} column={vmColumns[12]} preventClickPropagation>
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent text-text-subtle hover:bg-surface-muted transition-colors cursor-pointer border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      logAction('Open console', instance);
                    }}
                    aria-label="Open console"
                  >
                    <IconTerminal2 size={16} stroke={1.5} className="text-text-subtle" />
                  </button>
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
                        <IconDotsCircleHorizontal
                          size={16}
                          stroke={1.5}
                          className="text-text-subtle"
                        />
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
                    <ContextMenu.SubItems label="Storage&Snapshot">
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
                      <ContextMenu.Item
                        action={() => logAction('Detach interface', instance)}
                        danger
                      >
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
                      <ContextMenu.Item
                        action={() => logAction('Manage security groups', instance)}
                      >
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
      )}

      {activeTab === 'bare-metal' && (
        <SelectableTable<BareMetalInstance>
          columns={bmColumns}
          rows={paginatedBareMetal}
          selectionType="checkbox"
          selectedRows={selectedBmRows}
          onRowSelectionChange={setSelectedBmRows}
          getRowId={(row) => row.id}
          sort={sortBm}
          order={orderBm}
          onSortChange={handleSortBm}
          stickyLastColumn
        >
          {paginatedBareMetal.map((instance) => (
            <Table.Tr key={instance.id} rowData={instance}>
              <Table.Td rowData={instance} column={bmColumns[0]}>
                <StatusIndicator variant={statusMap[instance.status]} layout="iconOnly" />
              </Table.Td>
              <Table.Td rowData={instance} column={bmColumns[1]}>
                <div className="flex items-center gap-2 min-w-0">
                  <Tooltip
                    content="This bare metal was created via the Container cluster."
                    direction="top"
                    focusable={false}
                  >
                    <div className="flex items-center justify-center w-6 h-6 shrink-0 rounded-[4px] border border-border bg-surface">
                      <img src={containerIcon} alt="" className="w-4 h-4" />
                    </div>
                  </Tooltip>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <Link
                      to={`/compute/bare-metal/${instance.id}`}
                      className={`${linkClass} truncate`}
                      title={instance.name}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {instance.name}
                    </Link>
                    <span className="text-11 text-text-muted truncate" title={instance.id}>
                      ID : {instance.id}
                    </span>
                  </div>
                </div>
              </Table.Td>
              <Table.Td rowData={instance} column={bmColumns[2]}>
                <div className="flex items-center justify-center w-full">
                  {instance.locked ? (
                    <IconLock size={16} stroke={1.5} className="text-text" />
                  ) : (
                    <IconLockOpen size={16} stroke={1.5} className="text-text-muted" />
                  )}
                </div>
              </Table.Td>
              <Table.Td rowData={instance} column={bmColumns[3]}>
                {instance.os}
              </Table.Td>
              <Table.Td rowData={instance} column={bmColumns[4]}>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    to={`/compute/flavors/${instance.id}`}
                    className={`${linkClass} truncate`}
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
              <Table.Td rowData={instance} column={bmColumns[5]}>
                {instance.cpu}
              </Table.Td>
              <Table.Td rowData={instance} column={bmColumns[6]}>
                {instance.ram}
              </Table.Td>
              <Table.Td rowData={instance} column={bmColumns[7]}>
                {instance.disk}
              </Table.Td>
              <Table.Td rowData={instance} column={bmColumns[8]}>
                {instance.gpu}
              </Table.Td>
              <Table.Td rowData={instance} column={bmColumns[9]}>
                {instance.az}
              </Table.Td>
              <Table.Td rowData={instance} column={bmColumns[10]} preventClickPropagation>
                <div className="flex items-center justify-center w-full">
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
                        <IconDotsCircleHorizontal
                          size={16}
                          stroke={1.5}
                          className="text-text-subtle"
                        />
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
                    </ContextMenu.SubItems>
                    <ContextMenu.SubItems label="Configuration">
                      <ContextMenu.Item action={() => logAction('Lock setting', instance)}>
                        Lock setting
                      </ContextMenu.Item>
                      <ContextMenu.Item action={() => logAction('Manage tags', instance)}>
                        Manage tags
                      </ContextMenu.Item>
                      <ContextMenu.Item action={() => logAction('Edit', instance)}>
                        Edit
                      </ContextMenu.Item>
                    </ContextMenu.SubItems>
                    <ContextMenu.Item action={() => logAction('Delete', instance)} danger>
                      Delete
                    </ContextMenu.Item>
                  </ContextMenu.Root>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </SelectableTable>
      )}
    </div>
  );
}
