import { useMemo, useState, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import DetailPageHeader from '@shared/components/DetailPageHeader/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader/DetailPageHeader';
import SectionCard from '@shared/components/SectionCard/SectionCard';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import type { StatusVariant } from '@shared/components/StatusIndicator/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { ContextMenu } from '@shared/components/ContextMenu';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import type { FilterKeyWithValue } from '@shared/components/FilterSearch';
import {
  IconCirclePlus,
  IconDotsCircleHorizontal,
  IconLock,
  IconLockOpen,
  IconTerminal2,
} from '@tabler/icons-react';

type VisibilityType = 'Public' | 'Private' | 'Project';
type InstanceStatus = 'active' | 'building' | 'error' | 'shutoff' | 'paused';

interface FlavorDetail {
  id: string;
  name: string;
  category: string;
  vcpu: number;
  ram: string;
  visibility: VisibilityType;
  createdAt: string;
  architecture: string;
  ephemeralDisk: string;
  numaNodes: string;
  cpuPolicy: string;
  cpuThreadPolicy: string;
  memoryPage: string;
  internalNetworkBandwidth: string;
  storageIOPS: string;
}

interface FlavorInstance {
  id: string;
  name: string;
  status: InstanceStatus;
  locked: boolean;
  image: string;
  fixedIP: string;
  az: string;
  createdAt: string;
}

const mockFlavorsMap: Record<string, FlavorDetail> = {
  'flv-001': {
    id: 'flv-001',
    name: 'c5.large',
    category: 'CPU',
    vcpu: 2,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: 'Sep 15, 2025 12:22:26',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-002': {
    id: 'flv-002',
    name: 'c5.xlarge',
    category: 'Compute Optimized',
    vcpu: 4,
    ram: '32GiB',
    visibility: 'Public',
    createdAt: 'Sep 10, 2025 01:17:01',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '-',
  },
  'flv-003': {
    id: 'flv-003',
    name: 'm5.large',
    category: 'General Purpose',
    vcpu: 2,
    ram: '8GiB',
    visibility: 'Public',
    createdAt: 'Sep 5, 2025 14:12:36',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-004': {
    id: 'flv-004',
    name: 'm5.xlarge',
    category: 'General Purpose',
    vcpu: 4,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: 'Sep 1, 2025 10:20:28',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '-',
  },
  'flv-005': {
    id: 'flv-005',
    name: 'r5.large',
    category: 'Memory Optimized',
    vcpu: 2,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: 'Aug 30, 2025 21:37:41',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-006': {
    id: 'flv-006',
    name: 'r5.xlarge',
    category: 'Memory Optimized',
    vcpu: 4,
    ram: '32GiB',
    visibility: 'Public',
    createdAt: 'Aug 25, 2025 10:32:16',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '-',
  },
  'flv-007': {
    id: 'flv-007',
    name: 't3.micro',
    category: 'Burstable',
    vcpu: 2,
    ram: '1GiB',
    visibility: 'Public',
    createdAt: 'Aug 20, 2025 23:27:51',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-008': {
    id: 'flv-008',
    name: 't3.small',
    category: 'Burstable',
    vcpu: 2,
    ram: '2GiB',
    visibility: 'Public',
    createdAt: 'Aug 15, 2025 12:22:26',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-009': {
    id: 'flv-009',
    name: 'g4dn.xlarge',
    category: 'GPU Accelerated',
    vcpu: 4,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: 'Aug 10, 2025 01:17:01',
    architecture: 'X86 Architecture',
    ephemeralDisk: '125GiB',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Isolate',
    memoryPage: 'Large',
    internalNetworkBandwidth: '25Gbps',
    storageIOPS: '3000',
  },
  'flv-010': {
    id: 'flv-010',
    name: 'g4dn.2xlarge',
    category: 'GPU Accelerated',
    vcpu: 8,
    ram: '32GiB',
    visibility: 'Public',
    createdAt: 'Aug 5, 2025 14:12:36',
    architecture: 'X86 Architecture',
    ephemeralDisk: '225GiB',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Isolate',
    memoryPage: 'Large',
    internalNetworkBandwidth: '25Gbps',
    storageIOPS: '5000',
  },
  'flv-011': {
    id: 'flv-011',
    name: 'p3.2xlarge',
    category: 'GPU Compute',
    vcpu: 8,
    ram: '61GiB',
    visibility: 'Public',
    createdAt: 'Aug 1, 2025 10:20:28',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '1',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Isolate',
    memoryPage: 'Large',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '3000',
  },
  'flv-012': {
    id: 'flv-012',
    name: 'inf1.xlarge',
    category: 'ML Inference',
    vcpu: 4,
    ram: '8GiB',
    visibility: 'Public',
    createdAt: 'Jul 28, 2025 07:11:07',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '25Gbps',
    storageIOPS: '-',
  },
  'flv-013': {
    id: 'flv-013',
    name: 'inf1.2xlarge',
    category: 'ML Inference',
    vcpu: 8,
    ram: '16GiB',
    visibility: 'Public',
    createdAt: 'Jul 25, 2025 10:32:16',
    architecture: 'X86 Architecture',
    ephemeralDisk: '0GiB',
    numaNodes: '0',
    cpuPolicy: 'Dedicated',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '25Gbps',
    storageIOPS: '-',
  },
  'flv-014': {
    id: 'flv-014',
    name: 'custom.small',
    category: 'Custom',
    vcpu: 2,
    ram: '4GiB',
    visibility: 'Private',
    createdAt: 'Jul 20, 2025 23:27:51',
    architecture: 'X86 Architecture',
    ephemeralDisk: '20GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '-',
    storageIOPS: '-',
  },
  'flv-015': {
    id: 'flv-015',
    name: 'custom.medium',
    category: 'Custom',
    vcpu: 4,
    ram: '8GiB',
    visibility: 'Private',
    createdAt: 'Jul 15, 2025 12:22:26',
    architecture: 'X86 Architecture',
    ephemeralDisk: '50GiB',
    numaNodes: '0',
    cpuPolicy: 'Shared',
    cpuThreadPolicy: 'Prefer',
    memoryPage: 'Any',
    internalNetworkBandwidth: '10Gbps',
    storageIOPS: '-',
  },
};

const defaultFlavorDetail: FlavorDetail = {
  id: 'unknown',
  name: 'Unknown Flavor',
  category: '-',
  vcpu: 0,
  ram: '0GiB',
  visibility: 'Public',
  createdAt: '-',
  architecture: '-',
  ephemeralDisk: '0GiB',
  numaNodes: '0',
  cpuPolicy: '-',
  cpuThreadPolicy: '-',
  memoryPage: '-',
  internalNetworkBandwidth: '-',
  storageIOPS: '-',
};

const mockFlavorParameters = {
  id: 'b95aaf8a-80c5-4be0-ae67-5c983f5c9536',
  name: 'c5.large',
  ram: 4096,
  disk: 0,
  swap: 0,
  'OS-FLV-EXT-DATA:ephemeral': 0,
  'OS-FLV-DISABLED:disabled': false,
  vcpus: 2,
  'os-flavor-access:is_public': true,
  rxtx_factor: 1,
  links: [
    {
      rel: 'self',
      href: 'http://10.7.12.10/v2.1/flavors/b95aaf8a-80c5-4be0-ae67-5c983f5c9536',
    },
    {
      rel: 'bookmark',
      href: 'http://10.7.12.10/flavors/b95aaf8a-80c5-4be0-ae67-5c983f5c9536',
    },
  ],
  description: null,
  extra_specs: {
    ':architecture': 'x86_architecture',
    ':category': 'compute_optimized',
    'hw:mem_page_size': 'any',
    'hw:numa_nodes': '1',
  },
};

const mockFlavorInstances: FlavorInstance[] = Array.from({ length: 115 }, (_, i) => ({
  id: `inst-${String(i + 1).padStart(3, '0')}`,
  name: `web-server-${String(i + 1).padStart(2, '0')}`,
  status: (['active', 'building', 'error', 'shutoff', 'paused'] as InstanceStatus[])[i % 5],
  locked: i % 3 === 0,
  image: ['Ubuntu24.04', 'CentOS8', 'Debian12', 'Rocky9'][i % 4],
  fixedIP: `10.62.0.${30 + i}`,
  az: ['zone-a', 'zone-b', 'zone-o'][i % 3],
  createdAt: `Sep ${String(30 - (i % 28)).padStart(2, '0')}, 2025`,
}));

const STATUS_COL_WIDTH = 60;
const LOCKED_COL_WIDTH = 60;
const ACTION_COL_WIDTH = 72;
const linkClass = 'text-12 leading-18 font-medium text-primary hover:underline no-underline';

const ActionTrigger = ({ toggle }: { toggle: () => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      toggle();
    }}
    className="p-1.5 rounded-md bg-transparent hover:bg-surface-muted transition-colors cursor-pointer border-none inline-flex"
    aria-label="Row actions"
  >
    <IconDotsCircleHorizontal size={16} stroke={1.5} className="text-text-subtle" />
  </button>
);

function instanceStatusVariant(s: InstanceStatus): StatusVariant {
  const m: Record<InstanceStatus, StatusVariant> = {
    active: 'active',
    building: 'building',
    error: 'error',
    shutoff: 'shutoff',
    paused: 'paused',
  };
  return m[s];
}

export function ComputeFlavorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'details';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const flavor = useMemo(
    () => (id ? (mockFlavorsMap[id] ?? defaultFlavorDetail) : defaultFlavorDetail),
    [id]
  );

  const [instanceSearchQuery, setInstanceSearchQuery] = useState('');
  const [instanceCurrentPage, setInstanceCurrentPage] = useState(1);
  const instancesPerPage = 10;
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const filteredInstances = useMemo(() => {
    if (!instanceSearchQuery) return mockFlavorInstances;
    const query = instanceSearchQuery.toLowerCase();
    return mockFlavorInstances.filter(
      (inst) =>
        inst.name.toLowerCase().includes(query) ||
        inst.id.toLowerCase().includes(query) ||
        inst.image.toLowerCase().includes(query) ||
        inst.fixedIP.toLowerCase().includes(query)
    );
  }, [instanceSearchQuery]);

  const instanceTotalPages = Math.ceil(filteredInstances.length / instancesPerPage);
  const paginatedInstances = filteredInstances.slice(
    (instanceCurrentPage - 1) * instancesPerPage,
    instanceCurrentPage * instancesPerPage
  );

  const infoFields: DetailPageHeaderInfoField[] = [
    { label: 'ID', value: flavor.id, showCopyButton: true, copyText: flavor.id },
    { label: 'Category', value: flavor.category },
    { label: 'vCPU', value: String(flavor.vcpu) },
    { label: 'RAM', value: flavor.ram },
    { label: 'Root disk', value: flavor.ephemeralDisk },
    { label: 'Public', value: flavor.visibility === 'Public' ? 'On' : 'Off' },
  ];

  const instanceColumns: TableColumn[] = useMemo(
    () => [
      { key: 'status', header: 'Status', width: STATUS_COL_WIDTH, align: 'center' },
      { key: 'name', header: 'Name', sortable: true },
      { key: 'locked', header: 'Locked', width: LOCKED_COL_WIDTH, align: 'center' },
      { key: 'image', header: 'OS', sortable: true },
      { key: 'fixedIP', header: 'Fixed IP' },
      { key: 'az', header: 'AZ' },
      { key: 'createdAt', header: 'Created at', sortable: true },
      {
        key: 'actions',
        header: 'Action',
        width: ACTION_COL_WIDTH,
        align: 'center',
        clickable: false,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <DetailPageHeader
        title={flavor.name}
        actions={
          <div className="flex items-center gap-1 flex-wrap">
            <Button variant="secondary" appearance="outline" size="sm">
              <IconCirclePlus size={12} stroke={1.5} /> Create instance
            </Button>
            <Button variant="secondary" appearance="outline" size="sm">
              <IconCirclePlus size={12} stroke={1.5} /> Create instance template
            </Button>
          </div>
        }
        infoFields={infoFields}
      />

      <div className="w-full">
        <Tabs activeTabId={activeDetailTab} onChange={setActiveDetailTab} variant="line" size="sm">
          <Tab id="details" label="Details">
            <div className="flex flex-col gap-4 pt-4">
              <SectionCard>
                <SectionCard.Header title="Basic information" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Flavor name" value={flavor.name} />
                  <SectionCard.DataRow label="Category" value={flavor.category} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Specification" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="vCPU" value={String(flavor.vcpu)} />
                  <SectionCard.DataRow label="RAM" value={flavor.ram} />
                  <SectionCard.DataRow label="Root disk" value={flavor.ephemeralDisk} />
                  <SectionCard.DataRow label="Ephemeral disk" value={flavor.ephemeralDisk} />
                  <SectionCard.DataRow label="Swap disk" value={flavor.numaNodes} />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Security" />
                <SectionCard.Content>
                  <SectionCard.DataRow
                    label="Public"
                    value={flavor.visibility === 'Public' ? 'On' : 'Off'}
                  />
                </SectionCard.Content>
              </SectionCard>

              <SectionCard>
                <SectionCard.Header title="Metadata" />
                <SectionCard.Content>
                  <SectionCard.DataRow label="{metadata}" value="{value}" />
                </SectionCard.Content>
              </SectionCard>
            </div>
          </Tab>

          <Tab id="instances" label="Instances">
            <div className="flex flex-col gap-4 pt-4">
              <h2 className="text-16 font-semibold leading-6 text-text m-0">Instances</h2>
              <FilterSearchInput
                filterKeys={[{ key: 'name', label: 'Name', type: 'input' as const }]}
                onFilterAdd={(f: FilterKeyWithValue) => {
                  setInstanceSearchQuery(String(f.value ?? ''));
                  setInstanceCurrentPage(1);
                }}
                selectedFilters={
                  instanceSearchQuery
                    ? [
                        {
                          id: 'search',
                          key: 'name',
                          label: 'Name',
                          value: instanceSearchQuery,
                          type: 'input' as const,
                        },
                      ]
                    : []
                }
                placeholder="Search by attributes"
                defaultFilterKey="name"
                className="w-full max-w-[320px]"
              />
              <Pagination
                totalCount={filteredInstances.length}
                size={instancesPerPage}
                currentAt={instanceCurrentPage}
                onPageChange={setInstanceCurrentPage}
                totalCountLabel="items"
              />
              <Table<FlavorInstance>
                columns={instanceColumns}
                rows={paginatedInstances}
                sort={sort}
                order={order}
                onSortChange={handleSortChange}
                stickyLastColumn
              >
                {paginatedInstances.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={instanceColumns[0]}>
                      <StatusIndicator
                        variant={instanceStatusVariant(row.status)}
                        layout="iconOnly"
                      />
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[1]}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <Link
                          to={`/compute/instances/${row.id}`}
                          className={`${linkClass} truncate`}
                        >
                          {row.name}
                        </Link>
                        <span className="text-11 leading-16 text-text-muted truncate">
                          ID : {row.id}
                        </span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[2]}>
                      {row.locked ? (
                        <IconLock size={16} stroke={1.5} className="text-text mx-auto" />
                      ) : (
                        <IconLockOpen size={16} stroke={1.5} className="text-text-muted mx-auto" />
                      )}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[3]}>
                      {row.image}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[4]}>
                      {row.fixedIP}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[5]}>
                      {row.az}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[6]}>
                      {row.createdAt}
                    </Table.Td>
                    <Table.Td rowData={row} column={instanceColumns[7]} preventClickPropagation>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          className="p-1.5 rounded-md hover:bg-surface-muted transition-colors"
                          title="Console"
                        >
                          <IconTerminal2 size={16} stroke={1.5} className="text-text-muted" />
                        </button>
                        <ContextMenu.Root
                          direction="bottom-end"
                          gap={4}
                          trigger={({ toggle }) => <ActionTrigger toggle={toggle} />}
                        >
                          <ContextMenu.Item action={() => {}}>View details</ContextMenu.Item>
                          <ContextMenu.Item action={() => {}}>Start</ContextMenu.Item>
                          <ContextMenu.Item action={() => {}}>Stop</ContextMenu.Item>
                          <ContextMenu.Item action={() => {}}>Restart</ContextMenu.Item>
                          <ContextMenu.Item action={() => {}} danger>
                            Delete
                          </ContextMenu.Item>
                        </ContextMenu.Root>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>

          <Tab id="parameters" label="Parameters">
            <div className="pt-6">
              <div className="bg-[#1e293b] border border-border rounded-md p-4 w-full min-h-[576px] overflow-auto">
                <pre className="font-mono text-12 leading-[18px] text-slate-200 whitespace-pre-wrap break-all">
                  {JSON.stringify(mockFlavorParameters, null, 5)}
                </pre>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
