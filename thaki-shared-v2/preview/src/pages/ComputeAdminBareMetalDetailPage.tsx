import { useCallback, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import CopyButton from '@shared/components/CopyButton/CopyButton';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { IconChevronDown, IconEdit, IconExternalLink, IconTrash, IconX } from '@tabler/icons-react';

interface BareMetalDetail {
  id: string;
  uuid: string;
  hostname: string;
  status: 'active' | 'maintenance' | 'error';
  powerState: 'power on' | 'power off' | 'rebooting';
  provisionState: 'available' | 'cleaning' | 'deploying' | 'error';
  driver: string;
  tenant: string;
  tenantId: string;
  resourceClass: string;
  chassisUuid: string;
  consoleEnabled: boolean;
  inspectInterface: string;
}

interface BareMetalPortRow extends Record<string, unknown> {
  id: string;
  name: string;
  macAddress: string;
  pxeEnabled: boolean;
  networkName: string;
  networkId: string;
}

const mockBareMetalMap: Record<string, BareMetalDetail> = {
  'bm-001': {
    id: 'bm-001',
    uuid: '8f3c2a10-4b9e-4d11-9c7e-1a2b3c4d5e6f',
    hostname: 'bm-compute-01',
    status: 'active',
    powerState: 'power on',
    provisionState: 'available',
    driver: 'ipmi',
    tenant: 'engineering',
    tenantId: 'tenant-eng-01',
    resourceClass: 'baremetal.large',
    chassisUuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    consoleEnabled: true,
    inspectInterface: 'agent',
  },
  'bm-002': {
    id: 'bm-002',
    uuid: '9e4d3b21-5caf-5e22-ad8f-2b3c4d5e6f70',
    hostname: 'bm-gpu-02',
    status: 'maintenance',
    powerState: 'power off',
    provisionState: 'cleaning',
    driver: 'redfish',
    tenant: 'demo-project',
    tenantId: 'tenant-demo-01',
    resourceClass: 'baremetal.gpu',
    chassisUuid: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    consoleEnabled: false,
    inspectInterface: 'inspector',
  },
};

const defaultBareMetal: BareMetalDetail = {
  id: 'bm-unknown',
  uuid: '00000000-0000-0000-0000-000000000000',
  hostname: 'Unknown bare metal',
  status: 'error',
  powerState: 'power off',
  provisionState: 'error',
  driver: '-',
  tenant: '-',
  tenantId: '',
  resourceClass: '-',
  chassisUuid: '-',
  consoleEnabled: false,
  inspectInterface: '-',
};

const mockPortsByNode: Record<string, BareMetalPortRow[]> = {
  'bm-001': [
    {
      id: 'port-bm-101',
      name: 'bm-compute-01-nic0',
      macAddress: '3c:fd:fe:12:34:56',
      pxeEnabled: true,
      networkName: 'provisioning-net',
      networkId: 'net-900',
    },
    {
      id: 'port-bm-102',
      name: 'bm-compute-01-nic1',
      macAddress: '3c:fd:fe:12:34:57',
      pxeEnabled: false,
      networkName: 'tenant-data',
      networkId: 'net-001',
    },
  ],
  'bm-002': [
    {
      id: 'port-bm-201',
      name: 'bm-gpu-02-ib0',
      macAddress: '00:11:22:33:44:55',
      pxeEnabled: false,
      networkName: 'gpu-interconnect',
      networkId: 'net-880',
    },
  ],
};

const bmStatusVariant: Record<BareMetalDetail['status'], StatusVariant> = {
  active: 'active',
  maintenance: 'building',
  error: 'error',
};

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input' },
  { key: 'macAddress', label: 'MAC', type: 'input' },
];

function portMatches(row: BareMetalPortRow, filter: FilterKeyWithValue): boolean {
  const fv = String(filter.value ?? '').toLowerCase();
  if (!fv) return true;
  const key = filter.key as keyof BareMetalPortRow;
  const value = String(row[key] ?? '').toLowerCase();
  return value.includes(fv);
}

const linkClass =
  'text-12 leading-18 font-medium text-primary hover:underline no-underline inline-flex items-center gap-1';

export function ComputeAdminBareMetalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'details';

  const node = useMemo(
    () => (id && mockBareMetalMap[id] ? mockBareMetalMap[id] : defaultBareMetal),
    [id]
  );

  const ports = useMemo(() => mockPortsByNode[node.id] ?? [], [node.id]);

  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');

  const handleFilterAdd = useCallback((filter: FilterKeyWithValue) => {
    setAppliedFilters((prev) => [...prev, filter]);
    setPage(1);
  }, []);

  const handleFilterRemove = useCallback((filterId: string) => {
    setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));
    setPage(1);
  }, []);

  const filteredPorts = useMemo(() => {
    if (appliedFilters.length === 0) return ports;
    return ports.filter((row) => appliedFilters.every((f) => portMatches(row, f)));
  }, [ports, appliedFilters]);

  const paginated = filteredPorts.slice((page - 1) * pageSize, page * pageSize);

  const portColumns: TableColumn[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'macAddress', header: 'MAC address', sortable: true },
    { key: 'pxe', header: 'PXE', width: 72, align: 'center' },
    { key: 'network', header: 'Network', sortable: true },
  ];

  const statusLabel = node.status.charAt(0).toUpperCase() + node.status.slice(1);

  const infoFields: DetailPageHeaderInfoField[] = [
    {
      label: 'Status',
      value: statusLabel,
      accessory: <StatusIndicator variant={bmStatusVariant[node.status]} layout="iconOnly" />,
    },
    {
      label: 'UUID',
      value: node.uuid,
      showCopyButton: true,
      copyText: node.uuid,
    },
    { label: 'Power state', value: node.powerState },
    { label: 'Provision state', value: node.provisionState },
    { label: 'Driver', value: node.driver },
    {
      label: 'Tenant',
      value:
        node.tenant === '-' ? (
          '-'
        ) : (
          <Link to={`/compute-admin/tenants/${node.tenantId}`} className={linkClass}>
            {node.tenant}
          </Link>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <DetailPageHeader
        title={node.hostname}
        actions={
          <div className="flex flex-wrap gap-1 items-center">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconEdit size={12} stroke={1.5} /> Edit
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconTrash size={12} stroke={1.5} /> Delete
            </Button>
            <ContextMenu.Root
              direction="bottom-end"
              gap={4}
              trigger={({ toggle }) => (
                <Button variant="secondary" appearance="outline" size="sm" onClick={toggle}>
                  More actions <IconChevronDown size={12} stroke={1.5} />
                </Button>
              )}
            >
              <ContextMenu.Item action={() => {}}>Power on</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Power off</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Reboot</ContextMenu.Item>
              <ContextMenu.Item action={() => {}}>Put in maintenance</ContextMenu.Item>
              <ContextMenu.Item action={() => {}} danger>
                Decommission node
              </ContextMenu.Item>
            </ContextMenu.Root>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs
          activeTabId={activeTab}
          onChange={(tab) => setSearchParams({ tab }, { replace: true })}
          variant="line"
          size="sm"
        >
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Properties" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Hostname" value={node.hostname} />
                  <SectionCard.DataRow label="Resource class" value={node.resourceClass} />
                  <SectionCard.DataRow label="Chassis UUID">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-12 leading-18 text-text">{node.chassisUuid}</span>
                      {node.chassisUuid !== '-' && <CopyButton text={node.chassisUuid} />}
                    </div>
                  </SectionCard.DataRow>
                  <SectionCard.DataRow
                    label="Console enabled"
                    value={node.consoleEnabled ? 'Yes' : 'No'}
                  />
                  <SectionCard.DataRow label="Inspect interface" value={node.inspectInterface} />
                </SectionCard.Content>
              </SectionCard>
              <SectionCard>
                <SectionCard.Header title="Driver information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Driver" value={node.driver} />
                  <SectionCard.DataRow label="BMC address" value="192.168.70.12" />
                  <SectionCard.DataRow label="BMC username" value="admin" />
                  <SectionCard.DataRow label="Last heartbeat" value="Mar 24, 2026 08:14:22" />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>
          <Tab id="ports" label="Ports">
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <FilterSearchInput
                  filterKeys={filterKeys}
                  onFilterAdd={handleFilterAdd}
                  selectedFilters={appliedFilters}
                  placeholder="Search ports by attributes"
                  defaultFilterKey="name"
                  className="w-full max-w-[320px]"
                />
                {appliedFilters.length > 0 && (
                  <div className="flex items-center justify-between pl-2 pr-4 py-2 bg-surface-subtle rounded-md">
                    <div className="flex items-center gap-1 flex-wrap">
                      {appliedFilters.map((filter) => (
                        <span
                          key={filter.id}
                          className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-md bg-surface text-text text-11 leading-16 font-medium shadow-[inset_0_0_0_1px] shadow-border"
                        >
                          <span className="flex items-center gap-1">
                            <span>{filter.label}</span>
                            <span className="text-border">|</span>
                            <span>{filter.displayValue ?? filter.value}</span>
                          </span>
                          <button
                            type="button"
                            className="shrink-0 p-0.5 -mr-0.5 text-text hover:text-text-muted rounded-sm transition-colors cursor-pointer bg-transparent border-none"
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
                      className="text-11 font-medium text-primary hover:text-primary-hover cursor-pointer bg-transparent border-none ml-4"
                      onClick={() => {
                        setAppliedFilters([]);
                        setPage(1);
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
              <Pagination
                totalCount={filteredPorts.length}
                size={pageSize}
                currentAt={page}
                onPageChange={setPage}
                totalCountLabel="ports"
              />
              <Table<BareMetalPortRow>
                columns={portColumns}
                rows={paginated}
                sort={sort}
                order={order}
                onSortChange={(k, o) => {
                  setSort(k ?? '');
                  setOrder(o);
                }}
              >
                {paginated.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={portColumns[0]}>
                      <Link to={`/compute-admin/ports/${row.id}`} className={linkClass}>
                        {row.name}
                        <IconExternalLink size={12} className="text-primary shrink-0" />
                      </Link>
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[1]}>
                      <div className="flex items-center gap-2">
                        <span className="text-12 text-text">{row.macAddress}</span>
                        <CopyButton text={row.macAddress} />
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[2]}>
                      {row.pxeEnabled ? 'On' : 'Off'}
                    </Table.Td>
                    <Table.Td rowData={row} column={portColumns[3]}>
                      <Link to={`/compute-admin/networks/${row.networkId}`} className={linkClass}>
                        {row.networkName}
                      </Link>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
