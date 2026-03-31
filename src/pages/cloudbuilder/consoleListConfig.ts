import { columnMinWidths, fixedColumns } from '@/design-system';

export type BadgeTone = 'success' | 'neutral' | 'blue' | 'warning' | 'danger';
export type ColumnKind = 'text' | 'badge' | 'mono' | 'nameWithSub' | 'statusIndicator';

export type ListColumn = {
  key: string;
  label: string;
  kind?: ColumnKind;
  sortable?: boolean;
  badgeTones?: Record<string, BadgeTone>;
  /** Maps cell values to StatusIndicator status types (used with kind: 'statusIndicator') */
  statusMap?: Record<string, string>;
  /** Secondary key displayed below the primary value (used with kind: 'nameWithSub') */
  subKey?: string;
  subLabel?: string;
  /** Fixed width (disables flex). Use for fixedColumns (status, actions). */
  width?: string;
  /** Minimum width with flex layout. Use with columnMinWidths for flexible columns. */
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
};

export type ActionMenuItem =
  | { id: string; label: string; kind: 'action'; status?: 'default' | 'danger'; actionId: string }
  | { id: string; label: string; kind: 'link'; status?: 'default' | 'danger'; href: string };

export type CloudBuilderListConfig = {
  slug: string;
  title: string;
  searchPlaceholder: string;
  createLabel?: string;
  createHref?: string;
  showActionColumn?: boolean;
  showCheckboxColumn?: boolean;
  showBulkDelete?: boolean;
  actionMenu?: { items: ActionMenuItem[] };
  /** Detail page base href (e.g. "/cloudbuilder/network-agents/detail"). If omitted, no detail navigation. */
  detailHrefBase?: string;
  /** Columns that should look/behave like a link (open detail). If omitted, nothing is linkified. */
  linkifyColumnKeys?: string[];
  tabs?: Array<{
    id: string;
    label: string;
    searchPlaceholder?: string;
    showActionColumn?: boolean;
    showCheckboxColumn?: boolean;
    showBulkDelete?: boolean;
    actionMenu?: { items: ActionMenuItem[] };
    detailHrefBase?: string;
    linkifyColumnKeys?: string[];
    statusAction?: {
      /** e.g. "status" */
      statusKey: string;
      /** label + key for info box 1 */
      primaryLabel: string;
      primaryKey: string;
      /** label + key for info box 2 */
      secondaryLabel: string;
      secondaryKey: string;
      /** Require reason when disabling */
      requireDisableReason?: boolean;
    };
    columns: ListColumn[];
    rows: Array<Record<string, string> & { id: string }>;
  }>;
  statusAction?: {
    statusKey: string;
    primaryLabel: string;
    primaryKey: string;
    secondaryLabel: string;
    secondaryKey: string;
    requireDisableReason?: boolean;
  };
  columns: ListColumn[];
  rows: Array<Record<string, string> & { id: string }>;
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function yyyyMmDd(i: number) {
  const yyyy = i % 3 === 0 ? 2025 : 2024;
  const mm = pad2((i % 12) + 1);
  const dd = pad2((i % 28) + 1);
  return `${yyyy}-${mm}-${dd}`;
}

function dateTime(i: number) {
  const yyyy = i % 3 === 0 ? 2025 : 2024;
  const mm = (i % 12) + 1;
  const dd = (i % 28) + 1;
  const d = new Date(yyyy, mm - 1, dd);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function randIp(i: number) {
  const a = 10;
  const b = (i % 8) + 0;
  const c = (i % 200) + 1;
  const d = (i % 240) + 10;
  return `${a}.${b}.${c}.${d}`;
}

function randMac(i: number) {
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `00:${hex((i * 13) % 256)}:${hex((i * 29) % 256)}:${hex((i * 7) % 256)}:${hex(
    (i * 19) % 256
  )}:${hex((i * 23) % 256)}`;
}

function uuidLike(i: number) {
  const hex = (n: number, len: number) => (n >>> 0).toString(16).padStart(len, '0');
  const a = (i * 2654435761) >>> 0;
  const b = (i * 1103515245 + 12345) >>> 0;
  const c = (i * 362437) >>> 0;
  return `${hex(a, 8)}-${hex(b, 4).slice(0, 4)}-${hex(c, 4).slice(0, 4)}-${hex(a ^ b, 4).slice(
    0,
    4
  )}-${hex((b ^ c) + a, 12).slice(0, 12)}`;
}

function makeRows(count: number, rowFactory: (i: number) => Record<string, string>) {
  return Array.from({ length: count }, (_, idx) => {
    const i = idx + 1;
    return { id: `${i}`, ...rowFactory(i) };
  });
}

export const CLOUD_BUILDER_SLUGS = [
  'severs0.7',
  'services',
  'compute-services',
  'network-agents',
  'block-storage-services',
  'orchestration-services',
] as const;

export type CloudBuilderSlug = (typeof CLOUD_BUILDER_SLUGS)[number];

export function getCloudBuilderListConfig(slug: CloudBuilderSlug): CloudBuilderListConfig {
  const COUNT = 115;
  const detailHrefBase = `/cloudbuilder/${slug}/detail`;

  if (slug === 'severs0.7') {
    const roleTones: Record<string, BadgeTone> = {
      'Baremetal node': 'blue',
    };

    return {
      slug,
      title: 'Servers',
      searchPlaceholder: 'Search servers by attributes',
      detailHrefBase,
      linkifyColumnKeys: ['serial'],
      createLabel: 'Register server',
      createHref: '/cloudbuilder/servers/create',
      actionMenu: {
        items: [
          { id: 'allocate', label: 'Allocate', kind: 'action' as const, actionId: 'allocate' },
          { id: 'edit', label: 'Edit', kind: 'action' as const, actionId: 'edit' },
          {
            id: 'delete',
            label: 'Delete',
            kind: 'action' as const,
            actionId: 'delete',
            status: 'danger' as const,
          },
        ],
      },
      columns: [
        { key: 'serial', label: 'Serial', sortable: true },
        {
          key: 'bmcIp',
          label: 'BMC IP',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.ip,
        },
        { key: 'productModel', label: 'Product model', sortable: true },
        { key: 'role', label: 'Role', sortable: true, kind: 'badge', badgeTones: roleTones },
        { key: 'domain', label: 'Domain', sortable: true },
        {
          key: 'power',
          label: 'Power',
          sortable: true,
          kind: 'badge',
          badgeTones: { On: 'success', Off: 'neutral' },
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
          kind: 'badge',
          badgeTones: { Available: 'success', Used: 'neutral' },
        },
        {
          key: 'updatedAt',
          label: 'Updated at',
          sortable: true,
          minWidth: columnMinWidths.updatedAt,
        },
      ],
      rows: makeRows(COUNT, (i) => {
        const models = ['PowerEdge R750', 'PowerEdge R650', 'ProLiant DL380', 'ThinkSystem SR650'];
        const domains = ['infra-zone-1', 'infra-zone-2', 'compute-zone-1', 'storage-zone-1'];
        const statuses = ['Available', 'Used'];

        return {
          serial: `SN${String(1000 + i).padStart(4, '0')}`,
          bmcIp: randIp(i),
          productModel: models[(i - 1) % models.length],
          role: 'Baremetal node',
          domain: domains[(i - 1) % domains.length],
          power: i % 7 === 0 ? 'Off' : 'On',
          status: statuses[(i - 1) % statuses.length],
          updatedAt: dateTime(i),
        };
      }),
    };
  }

  if (slug === 'services') {
    return {
      slug,
      title: 'Compute services',
      searchPlaceholder: 'Search services by attributes',
      showCheckboxColumn: false,
      showBulkDelete: false,
      showActionColumn: false,
      linkifyColumnKeys: [],
      columns: [
        { key: 'name', label: 'Name', sortable: true, minWidth: columnMinWidths.name },
        { key: 'service', label: 'Service', sortable: true, minWidth: columnMinWidths.service },
        { key: 'region', label: 'Region', sortable: true, minWidth: columnMinWidths.region },
        {
          key: 'endpoints',
          label: 'Endpoints',
          sortable: true,
          minWidth: columnMinWidths.endpoints,
        },
      ],
      rows: makeRows(COUNT, (i) => ({
        name:
          i % 5 === 0
            ? 'neutron'
            : i % 5 === 1
              ? 'nova'
              : i % 5 === 2
                ? 'keystone'
                : i % 5 === 3
                  ? 'cinder3'
                  : `service-${i}`,
        service:
          i % 4 === 0 ? 'network' : i % 4 === 1 ? 'compute' : i % 4 === 2 ? 'identity' : 'volumev3',
        region: i % 3 === 0 ? 'RegionOne' : i % 3 === 1 ? 'RegionTwo' : 'RegionZero',
        endpoints:
          i % 2 === 0
            ? 'public: http://... / internal: http://...'
            : 'public: https://... / internal: http://...',
      })),
    };
  }

  if (slug === 'compute-services') {
    const serviceNames = [
      'nova-scheduler',
      'nova-conductor',
      'nova-compute',
      'nova-consoleauth',
      'nova-compute',
    ] as const;
    const tabComputeHosts = {
      id: 'compute-hosts',
      label: 'Compute hosts',
      searchPlaceholder: 'Search compute hosts by attributes',
      showActionColumn: true,
      showCheckboxColumn: false,
      showBulkDelete: false,
      statusAction: {
        statusKey: 'serviceStatus',
        primaryLabel: 'Service',
        primaryKey: 'name',
        secondaryLabel: 'Host',
        secondaryKey: 'host',
        requireDisableReason: true,
      },
      columns: [
        {
          key: 'serviceState',
          label: 'Service state',
          sortable: true,
          width: fixedColumns.status,
          align: 'center',
          kind: 'statusIndicator',
          statusMap: { Up: 'active', Down: 'error' },
        },
        { key: 'name', label: 'Name', sortable: true, minWidth: columnMinWidths.name },
        { key: 'host', label: 'Host', sortable: true, minWidth: columnMinWidths.host },
        {
          key: 'availabilityZone',
          label: 'Availability zone',
          sortable: true,
          minWidth: columnMinWidths.availabilityZone,
        },
        {
          key: 'serviceStatus',
          label: 'Service status',
          sortable: true,
          minWidth: columnMinWidths.serviceStatus,
          kind: 'badge',
          badgeTones: { Enabled: 'success', Disabled: 'neutral' },
        },
        {
          key: 'lastUpdated',
          label: 'Last updated',
          sortable: true,
          minWidth: columnMinWidths.lastUpdated,
        },
      ],
      rows: makeRows(COUNT, (i) => ({
        name: serviceNames[i % serviceNames.length],
        host: `bdv2kr1-${i % 3 === 0 ? 'ctrl' : i % 3 === 1 ? 'compute' : 'gcompute'}${String((i % 24) + 1).padStart(2, '0')}`,
        availabilityZone: i % 3 === 0 ? 'internal' : 'nova',
        serviceStatus: i % 4 < 2 ? 'Enabled' : 'Disabled',
        serviceState: i % 4 === 0 || i % 4 === 2 ? 'Up' : 'Down',
        lastUpdated:
          i % 4 === 0
            ? 'a few seconds ago'
            : i % 4 === 1
              ? '1 minute ago'
              : i % 4 === 2
                ? 'a few seconds ago'
                : '2 minutes ago',
      })),
    };

    const tabHypervisors = {
      id: 'hypervisors',
      label: 'Hypervisors',
      searchPlaceholder: 'Search hypervisors by attributes',
      showActionColumn: false,
      showCheckboxColumn: false,
      showBulkDelete: false,
      columns: [
        { key: 'name', label: 'Name', sortable: true, minWidth: columnMinWidths.name },
        { key: 'id', label: 'ID', sortable: true, kind: 'mono', minWidth: columnMinWidths.id },
        { key: 'type', label: 'Type', sortable: true, minWidth: columnMinWidths.type },
        {
          key: 'vcpuCore',
          label: 'VCPU (Core)',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.vcpuCore,
        },
        {
          key: 'configuredMemoryGiB',
          label: 'Configured memory (GiB)',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.configuredMemoryGiB,
        },
        {
          key: 'instances',
          label: 'Instances',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.instances,
        },
        {
          key: 'gpuUsage',
          label: 'GPU usage',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.gpuUsage,
        },
        {
          key: 'pcpuUsage',
          label: 'PCPU usage',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.pcpuUsage,
        },
      ],
      rows: makeRows(COUNT, (i) => ({
        id: `20a0cb${String(80 + (i % 20)).padStart(2, '0')}`,
        name: `bdv2kr1-compute${String((i % 24) + 1).padStart(2, '0')}`,
        type: i % 3 === 0 ? 'QEMU' : i % 3 === 1 ? 'KVM' : 'Ironic',
        vcpuCore: `${(i % 64) + 1} / ${128 + (i % 4) * 64}`,
        configuredMemoryGiB: `${(10 + (i % 20)) / 2} / ${(24 + (i % 16)) / 2}`,
        instances: String((i * 2) % 9),
        gpuUsage: i % 5 === 0 ? '-' : `${i % 100}%`,
        pcpuUsage: `${(i * 7) % 100}%`,
      })),
    };

    const tabResourceProvider = {
      id: 'resource-provider',
      label: 'Resource provider',
      searchPlaceholder: 'Search resource providers by attributes',
      showActionColumn: false,
      showCheckboxColumn: false,
      showBulkDelete: false,
      columns: [
        {
          key: 'rpName',
          label: 'Resource provider name',
          sortable: true,
          minWidth: columnMinWidths.rpName,
        },
        {
          key: 'vcpusUsed',
          label: 'VCPUs used',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.vcpusUsed,
        },
        {
          key: 'vcpusReserved',
          label: 'VCPUs reserved',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.vcpusReserved,
        },
        {
          key: 'vcpusTotal',
          label: 'VCPUs total',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.vcpusTotal,
        },
        {
          key: 'vcpusAllocationRatio',
          label: 'VCPUs allocation ratio',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.vcpusAllocationRatio,
        },
        {
          key: 'pcpusUsed',
          label: 'PCPUs used',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.pcpusUsed,
        },
        {
          key: 'pcpusReserved',
          label: 'PCPUs reserved',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.pcpusReserved,
        },
        {
          key: 'pcpusTotal',
          label: 'PCPUs total',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.pcpusTotal,
        },
        {
          key: 'pcpusAllocationRatio',
          label: 'PCPUs allocation ratio',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.pcpusAllocationRatio,
        },
        {
          key: 'ramUsed',
          label: 'RAM used',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.ramUsed,
        },
        {
          key: 'ramReserved',
          label: 'RAM reserved',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.ramReserved,
        },
        {
          key: 'ramTotal',
          label: 'RAM total',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.ramTotal,
        },
        {
          key: 'ramAllocationRatio',
          label: 'RAM allocation ratio',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.ramAllocationRatio,
        },
        {
          key: 'storageUsed',
          label: 'Storage used',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.storageUsed,
        },
        {
          key: 'storageReserved',
          label: 'Storage reserved',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.storageReserved,
        },
        {
          key: 'storageTotal',
          label: 'Storage total',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.storageTotal,
        },
        {
          key: 'storageAllocationRatio',
          label: 'Storage allocation ratio',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.storageAllocationRatio,
        },
      ],
      rows: makeRows(COUNT, (i) => {
        // 첫 몇 개는 스크린샷/실제 서비스 느낌에 가깝게 고정값
        const names = [
          'bdv2kr1-gcompute01',
          'bdv2kr1-gcompute02',
          'bdv2kr1-gcompute01',
          'bdv2kr1-gcompute02_0000:03:00.0',
          'bdv2kr1-gcompute02_0000:E5:00.0',
          'bdv2kr1-gcompute02_0000:04:00.0',
          'bdv2kr1-gcompute01_0000:03:00.0',
          'bdv2kr1-gcompute01_0000:04:00.0',
          'bdv2kr1-gcompute01_0000:63:00.0',
          'bdv2kr1-gcompute01_0000:64:00.0',
          'bdv2kr1-gcompute01_0000:E5:00.0',
          'bdv2kr1-gcompute02_0000:63:00.0',
          'bdv2kr1-gcompute02_0000:64:00.0',
        ];

        if (i === 1) {
          return {
            rpName: names[0]!,
            vcpusUsed: '9',
            vcpusReserved: '0',
            vcpusTotal: '32',
            vcpusAllocationRatio: '4.0',
            pcpusUsed: '-',
            pcpusReserved: '-',
            pcpusTotal: '-',
            pcpusAllocationRatio: '-',
            ramUsed: '17GB',
            ramReserved: '512MB',
            ramTotal: '31.1GB',
            ramAllocationRatio: '1.0',
            storageUsed: '125GB',
            storageReserved: '0B',
            storageTotal: '10.5TB',
            storageAllocationRatio: '1.0',
          };
        }
        if (i === 2) {
          return {
            rpName: names[1]!,
            vcpusUsed: '135',
            vcpusReserved: '0',
            vcpusTotal: '128',
            vcpusAllocationRatio: '4.0',
            pcpusUsed: '-',
            pcpusReserved: '-',
            pcpusTotal: '-',
            pcpusAllocationRatio: '-',
            ramUsed: '310GB',
            ramReserved: '512MB',
            ramTotal: '1007.6GB',
            ramAllocationRatio: '1.0',
            storageUsed: '1.1TB',
            storageReserved: '0B',
            storageTotal: '10.5TB',
            storageAllocationRatio: '1.0',
          };
        }
        if (i === 3) {
          return {
            rpName: names[2]!,
            vcpusUsed: '227',
            vcpusReserved: '0',
            vcpusTotal: '128',
            vcpusAllocationRatio: '4.0',
            pcpusUsed: '-',
            pcpusReserved: '-',
            pcpusTotal: '-',
            pcpusAllocationRatio: '-',
            ramUsed: '503GB',
            ramReserved: '512MB',
            ramTotal: '1007.6GB',
            ramAllocationRatio: '1.0',
            storageUsed: '2.5TB',
            storageReserved: '0B',
            storageTotal: '10.5TB',
            storageAllocationRatio: '1.0',
          };
        }

        // 일부는 PCI 리소스 프로바이더처럼 수치가 비어있는 행
        if (i >= 4 && i <= 13) {
          return {
            rpName: names[i - 1]!,
            vcpusUsed: '-',
            vcpusReserved: '-',
            vcpusTotal: '-',
            vcpusAllocationRatio: '-',
            pcpusUsed: '-',
            pcpusReserved: '-',
            pcpusTotal: '-',
            pcpusAllocationRatio: '-',
            ramUsed: '0 B',
            ramReserved: '0 B',
            ramTotal: '0 B',
            ramAllocationRatio: '-',
            storageUsed: '0 B',
            storageReserved: '0 B',
            storageTotal: '0 B',
            storageAllocationRatio: '-',
          };
        }

        const host = `bdv2kr1-gcompute${String((i % 24) + 1).padStart(2, '0')}`;
        const isPci = i % 5 === 0;
        const total = i % 3 === 0 ? '1007.6GB' : '31.1GB';
        return {
          rpName: isPci ? `${host}_0000:${String((i % 80) + 1).padStart(2, '0')}:00.0` : host,
          vcpusUsed: String((i * 3) % 256),
          vcpusReserved: '0',
          vcpusTotal: String(32 + (i % 4) * 32),
          vcpusAllocationRatio: i % 3 === 0 ? '4.0' : '1.0',
          pcpusUsed: '-',
          pcpusReserved: '-',
          pcpusTotal: '-',
          pcpusAllocationRatio: '-',
          ramUsed: `${(i % 600) + 1}GB`,
          ramReserved: i % 7 === 0 ? '512MB' : '0B',
          ramTotal: total,
          ramAllocationRatio: '1.0',
          storageUsed: `${(i % 3) + 1}.1TB`,
          storageReserved: '0B',
          storageTotal: '10.5TB',
          storageAllocationRatio: '1.0',
        };
      }),
    };

    return {
      slug,
      title: 'Compute nodes',
      searchPlaceholder: tabComputeHosts.searchPlaceholder,
      showCheckboxColumn: false,
      showBulkDelete: false,
      showActionColumn: tabComputeHosts.showActionColumn,
      tabs: [tabComputeHosts, tabHypervisors, tabResourceProvider],
      statusAction: tabComputeHosts.statusAction,
      columns: tabComputeHosts.columns,
      rows: tabComputeHosts.rows,
    };
  }

  if (slug === 'network-agents') {
    return {
      slug,
      title: 'Network agents',
      searchPlaceholder: 'Search neutron agents by attributes',
      detailHrefBase,
      linkifyColumnKeys: ['name'],
      showCheckboxColumn: false,
      showBulkDelete: false,
      showActionColumn: true,
      statusAction: {
        statusKey: 'serviceStatus',
        primaryLabel: 'Service',
        primaryKey: 'name',
        secondaryLabel: 'Host',
        secondaryKey: 'host',
        requireDisableReason: false,
      },
      columns: [
        {
          key: 'serviceState',
          label: 'Service state',
          sortable: true,
          width: fixedColumns.status,
          align: 'center',
          kind: 'statusIndicator',
          statusMap: { Up: 'active', Down: 'error' },
        },
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          minWidth: columnMinWidths.name,
          kind: 'nameWithSub',
          subKey: 'id',
          subLabel: 'ID',
        },
        { key: 'type', label: 'Type', sortable: true, minWidth: columnMinWidths.typeXl },
        { key: 'host', label: 'Host', sortable: true, minWidth: columnMinWidths.host },
        {
          key: 'availabilityZone',
          label: 'Availability zone',
          sortable: true,
          minWidth: columnMinWidths.availabilityZone,
        },
        {
          key: 'serviceStatus',
          label: 'Service status',
          sortable: true,
          minWidth: columnMinWidths.serviceStatus,
          kind: 'badge',
          badgeTones: { Enabled: 'success', Disabled: 'neutral' },
        },
        {
          key: 'lastUpdated',
          label: 'Last updated',
          sortable: true,
          minWidth: columnMinWidths.lastUpdated,
        },
      ],
      rows: makeRows(COUNT, (i) => ({
        id: `25d21d${String(60 + (i % 30)).padStart(2, '0')}`,
        name:
          i % 4 === 0
            ? 'neutron-dhcp-agent'
            : i % 4 === 1
              ? 'neutron-metadata-agent'
              : i % 4 === 2
                ? 'ovn-controller-agent'
                : 'ovn-gateway-agent',
        type:
          i % 4 === 0
            ? 'DHCP agent'
            : i % 4 === 1
              ? 'OVN Metadata agent'
              : i % 4 === 2
                ? 'OVN Controller agent'
                : 'OVN Controller Gateway agent',
        host:
          i % 3 === 0
            ? 'bdv2kr1-ctrl01'
            : `bdv2kr1-gcompute${String((i % 24) + 1).padStart(2, '0')}`,
        availabilityZone: i % 5 === 0 ? '-' : 'nova',
        serviceStatus: i % 4 < 2 ? 'Enabled' : 'Disabled',
        serviceState: i % 4 === 0 || i % 4 === 2 ? 'Up' : 'Down',
        lastUpdated: i % 6 === 0 ? 'a minute ago' : 'a few minutes ago',
      })),
    };
  }

  if (slug === 'block-storage-services') {
    const tabBlockStorage = {
      id: 'block-storage',
      label: 'Block storage',
      searchPlaceholder: 'Search block storage services by attributes',
      showActionColumn: true,
      showCheckboxColumn: false,
      showBulkDelete: false,
      statusAction: {
        statusKey: 'serviceStatus',
        primaryLabel: 'Service',
        primaryKey: 'name',
        secondaryLabel: 'Host',
        secondaryKey: 'host',
        requireDisableReason: false,
      },
      columns: [
        {
          key: 'serviceState',
          label: 'Service state',
          sortable: true,
          width: fixedColumns.status,
          align: 'center',
          kind: 'statusIndicator',
          statusMap: { Up: 'active', Down: 'error' },
        },
        { key: 'name', label: 'Name', sortable: true, minWidth: columnMinWidths.name },
        { key: 'host', label: 'Host', sortable: true, minWidth: columnMinWidths.host },
        {
          key: 'availabilityZone',
          label: 'Availability zone',
          sortable: true,
          minWidth: columnMinWidths.availabilityZone,
        },
        {
          key: 'serviceStatus',
          label: 'Service status',
          sortable: true,
          minWidth: columnMinWidths.serviceStatus,
          kind: 'badge',
          badgeTones: { Enabled: 'success', Disabled: 'neutral' },
        },
        {
          key: 'lastUpdated',
          label: 'Last updated',
          sortable: true,
          minWidth: columnMinWidths.lastUpdated,
        },
      ],
      rows: makeRows(COUNT, (i) => ({
        name:
          i % 7 === 0
            ? 'cinder-scheduler'
            : i % 7 === 1
              ? 'cinder-volume'
              : i % 7 === 2
                ? 'cinder-backup'
                : 'cinder-volume',
        host:
          i % 5 === 0
            ? 'bdv2kr1-ctrl01'
            : i % 5 === 1
              ? 'bdv2kr1-ctrl01@lvm-1'
              : i % 5 === 2
                ? 'bdv2kr1-ctrl01@ceph1-rbd'
                : i % 5 === 3
                  ? 'bdv2kr1-ctrl01@ceph2-rbd'
                  : 'bdv2kr1-ctrl01',
        availabilityZone: 'nova',
        serviceStatus: i % 4 < 2 ? 'Enabled' : 'Disabled',
        serviceState: i % 4 === 0 || i % 4 === 2 ? 'Up' : 'Down',
        lastUpdated:
          i % 7 === 0 ? 'a few seconds ago' : i % 7 === 1 ? '3 months ago' : 'a few seconds ago',
      })),
    };

    const tabStorageBackends = {
      id: 'storage-backends',
      label: 'Storage backends',
      searchPlaceholder: 'Search storage backends by attributes',
      showActionColumn: false,
      showCheckboxColumn: false,
      showBulkDelete: false,
      columns: [
        { key: 'name', label: 'Name', sortable: true, minWidth: columnMinWidths.name },
        { key: 'protocol', label: 'Protocol', sortable: true, minWidth: columnMinWidths.protocol },
        {
          key: 'backendName',
          label: 'Backend name',
          sortable: true,
          minWidth: columnMinWidths.backendName,
        },
        {
          key: 'storageCapacityGiB',
          label: 'Storage capacity (GiB)',
          sortable: true,
          minWidth: '150px',
        },
      ],
      rows: [
        {
          id: '1',
          name: 'bdv2kr1-ctrl01@ceph1-rbd#ceph1-rbd',
          protocol: 'ceph',
          backendName: 'ceph1-rbd',
          storageUsedGiB: '155.23',
          storageTotalGiB: '1379.52',
          storageCapacityGiB: '',
        },
        {
          id: '2',
          name: 'bdv2kr1-ctrl01@ceph2-rbd#ceph2-rbd',
          protocol: 'ceph',
          backendName: 'ceph2-rbd',
          storageUsedGiB: '13.17',
          storageTotalGiB: '10811.97',
          storageCapacityGiB: '',
        },
      ],
    };

    return {
      slug,
      title: 'Block storage services',
      searchPlaceholder: tabBlockStorage.searchPlaceholder,
      showCheckboxColumn: false,
      showBulkDelete: false,
      showActionColumn: tabBlockStorage.showActionColumn,
      tabs: [tabBlockStorage, tabStorageBackends],
      statusAction: tabBlockStorage.statusAction,
      columns: tabBlockStorage.columns,
      rows: tabBlockStorage.rows,
    };
  }

  if (slug === 'orchestration-services') {
    return {
      slug,
      title: 'Orchestration services',
      searchPlaceholder: 'Search orchestration services by attributes',
      showActionColumn: false,
      showCheckboxColumn: false,
      showBulkDelete: false,
      columns: [
        {
          key: 'status',
          label: 'Status',
          sortable: true,
          width: fixedColumns.status,
          align: 'center',
          kind: 'statusIndicator',
          statusMap: { Up: 'active', Down: 'error' },
        },
        { key: 'name', label: 'Name', sortable: true, minWidth: columnMinWidths.name },
        {
          key: 'engineId',
          label: 'Engine ID',
          sortable: true,
          kind: 'mono',
          minWidth: columnMinWidths.engineId,
        },
        { key: 'host', label: 'Host', sortable: true, minWidth: columnMinWidths.host },
        {
          key: 'lastUpdated',
          label: 'Last updated',
          sortable: true,
          minWidth: columnMinWidths.lastUpdated,
        },
      ],
      rows: makeRows(5, (i) => ({
        name: 'heat-engine',
        engineId: uuidLike(i),
        host: 'bdv2kr1-ctrl01',
        status: i % 3 === 2 ? 'Down' : 'Up',
        lastUpdated: i === 1 ? 'a minute ago' : 'a few seconds ago',
      })),
    };
  }

  // Fallback (should not happen because slug is validated before calling)
  return {
    slug,
    title: 'Cloud Builder',
    searchPlaceholder: 'Search by attributes',
    showActionColumn: false,
    showCheckboxColumn: false,
    showBulkDelete: false,
    columns: [{ key: 'id', label: 'ID', sortable: true, kind: 'mono' }],
    rows: makeRows(0, () => ({})),
  };
}
