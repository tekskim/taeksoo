export type BadgeTone = 'success' | 'neutral' | 'blue' | 'warning' | 'danger';
export type ColumnKind = 'text' | 'badge' | 'mono';

export type ListColumn = {
  key: string;
  label: string;
  kind?: ColumnKind;
  sortable?: boolean;
  badgeTones?: Record<string, BadgeTone>;
  width?: string;
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
  const date = yyyyMmDd(i);
  const hh = pad2(i % 24);
  const min = pad2((i * 7) % 60);
  return `${date} ${hh}:${min}`;
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
    (i * 19) % 256,
  )}:${hex((i * 23) % 256)}`;
}

function uuidLike(i: number) {
  const hex = (n: number, len: number) => (n >>> 0).toString(16).padStart(len, '0');
  const a = (i * 2654435761) >>> 0;
  const b = (i * 1103515245 + 12345) >>> 0;
  const c = (i * 362437) >>> 0;
  return `${hex(a, 8)}-${hex(b, 4).slice(0, 4)}-${hex(c, 4).slice(0, 4)}-${hex(a ^ b, 4).slice(
    0,
    4,
  )}-${hex((b ^ c) + a, 12).slice(0, 12)}`;
}

function makeRows(count: number, rowFactory: (i: number) => Record<string, string>) {
  return Array.from({ length: count }, (_, idx) => {
    const i = idx + 1;
    return { id: `${i}`, ...rowFactory(i) };
  });
}

const frontierTones: Record<string, BadgeTone> = {
  OK: 'success',
  Missing: 'neutral',
  Invalid: 'blue',
};

export const CLOUD_BUILDER_SLUGS = [
  'discovery',
  'servers',
  'switch',
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

  if (slug === 'discovery') {
    return {
      slug,
      title: 'Discovery',
      searchPlaceholder: 'Search discovered assets',
      detailHrefBase,
      linkifyColumnKeys: ['serial'],
      createLabel: 'Create',
      createHref: '/cloudbuilder/discovery/create',
      actionMenu: {
        items: [
          { id: 'register-server', label: 'Register server', kind: 'action', actionId: 'register-server' },
          { id: 'register-switch', label: 'Register switch', kind: 'action', actionId: 'register-switch' },
          { id: 'edit', label: 'Edit', kind: 'action', actionId: 'edit' },
          { id: 'remove', label: 'Remove', kind: 'action', status: 'danger', actionId: 'remove' },
        ],
      },
      columns: [
        { key: 'serial', label: 'Serial', sortable: true },
        { key: 'location', label: 'Location', sortable: true },
        { key: 'mgmtIp', label: 'Mgmt IP', sortable: true, kind: 'mono' },
        { key: 'source', label: 'Source', sortable: true },
        { key: 'frontierNet', label: 'Frontier NET', sortable: true, kind: 'badge', badgeTones: frontierTones },
        { key: 'updatedAt', label: 'Updated At', sortable: true },
      ],
      rows: makeRows(COUNT, (i) => {
        const frontierNet = i % 10 === 0 ? 'Invalid' : i % 4 === 0 ? 'Missing' : 'OK';
        return {
          serial: `SN${String(2000 + i).padStart(4, '0')}`,
          location: `R${(i % 6) + 1}-U${(i % 38) + 1}`,
          mgmtIp: i % 5 === 0 ? '-' : randIp(i),
          source: i % 3 === 0 ? 'Discovery' : 'Manual',
          frontierNet,
          updatedAt: dateTime(i),
        };
      }),
    };
  }

  if (slug === 'servers') {
    const observedHealthTones: Record<string, BadgeTone> = {
      Running: 'success',
      'Not Running': 'neutral',
    };
    const provisionStatusTones: Record<string, BadgeTone> = {
      Done: 'success',
      Registered: 'neutral',
      Provisioning: 'blue',
    };
    const roleTones: Record<string, BadgeTone> = {
      controller: 'blue',
      'ceph-mon': 'blue',
      'ceph-mgr': 'blue',
      'ceph-mds': 'blue',
      'ceph-osd': 'blue',
    };

    return {
      slug,
      title: 'Servers',
      searchPlaceholder: 'Search servers by attributes',
      detailHrefBase,
      linkifyColumnKeys: ['serial'],
      createLabel: 'Create',
      createHref: '/cloudbuilder/servers/create',
      columns: [
        { key: 'serial', label: 'Serial', sortable: true },
        { key: 'macPrimary', label: 'MAC (Primary)', sortable: true, kind: 'mono' },
        { key: 'location', label: 'Location', sortable: true },
        { key: 'updatedAt', label: 'Updated At', sortable: true },
        { key: 'nicPrimaryName', label: 'NIC (Primary Name)', sortable: true },
        { key: 'frontierNet', label: 'Frontier NET', sortable: true, kind: 'badge', badgeTones: frontierTones },
        { key: 'mgmtIp', label: 'Mgmt IP', sortable: true, kind: 'mono' },
        { key: 'observedHealth', label: 'Observed Health', sortable: true, kind: 'badge', badgeTones: observedHealthTones },
        { key: 'provisionStatus', label: 'Provision Status', sortable: true, kind: 'badge', badgeTones: provisionStatusTones },
        { key: 'role', label: 'Role', sortable: true, kind: 'badge', badgeTones: roleTones },
        { key: 'purpose', label: 'Purpose', sortable: true },
      ],
      rows: makeRows(COUNT, (i) => {
        const frontierNet = i % 11 === 0 ? 'Invalid' : i % 7 === 0 ? 'Missing' : 'OK';
        const observedHealth = i % 9 === 0 ? 'Not Running' : 'Running';
        const provisionStatus = i % 13 === 0 ? 'Provisioning' : i % 5 === 0 ? 'Registered' : 'Done';
        const rolePool = [
          'controller',
          ...Array.from({ length: 24 }, (_, idx) => `compute${idx + 1}`),
          ...Array.from({ length: 3 }, (_, idx) => `master${idx + 1}`),
          ...Array.from({ length: 24 }, (_, idx) => `worker${idx + 1}`),
          'ceph-mon',
          'ceph-mgr',
          'ceph-mds',
          'ceph-osd',
        ];
        const role = rolePool[(i - 1) % rolePool.length]!;
        const purpose = i % 3 === 0 ? 'K8s worker' : i % 3 === 1 ? 'Hypervisor' : 'Ceph Storage';

        return {
          serial: `SN${String(1000 + i).padStart(4, '0')}`,
          macPrimary: randMac(i),
          location: `R${(i % 8) + 1}-U${(i % 42) + 1}`,
          updatedAt: dateTime(i),
          nicPrimaryName: i % 2 === 0 ? 'eno1' : 'ens3',
          frontierNet,
          mgmtIp: randIp(i),
          observedHealth,
          provisionStatus,
          role,
          purpose,
        };
      }),
    };
  }

  if (slug === 'switch') {
    return {
      slug,
      title: 'Switch',
      searchPlaceholder: 'Search switches',
      detailHrefBase,
      columns: [
        { key: 'name', label: 'Switch', sortable: true },
        { key: 'mgmtIp', label: 'Mgmt IP', sortable: true, kind: 'mono' },
        { key: 'model', label: 'Model', sortable: true },
        { key: 'status', label: 'Status', sortable: true, kind: 'badge', badgeTones: { Up: 'success', Down: 'neutral' } },
        { key: 'updatedAt', label: 'Updated At', sortable: true },
      ],
      rows: makeRows(COUNT, (i) => ({
        name: `spine-${(i % 6) + 1}`,
        mgmtIp: randIp(i + 50),
        model: i % 2 === 0 ? 'X9300' : 'N9300',
        status: i % 14 === 0 ? 'Down' : 'Up',
        updatedAt: dateTime(i),
      })),
    };
  }

  if (slug === 'severs0.7') {
    const observedHealthTones: Record<string, BadgeTone> = {
      Running: 'success',
      'Not Running': 'neutral',
    };
    const provisionStatusTones: Record<string, BadgeTone> = {
      Done: 'success',
      Registered: 'neutral',
      Provisioning: 'blue',
    };
    const roleTones: Record<string, BadgeTone> = {
      controller: 'blue',
      'ceph-mon': 'blue',
      'ceph-mgr': 'blue',
      'ceph-mds': 'blue',
      'ceph-osd': 'blue',
    };

    return {
      slug,
      title: 'Servers',
      searchPlaceholder: 'Search servers by attributes',
      detailHrefBase,
      linkifyColumnKeys: ['serial'],
      createLabel: 'Create',
      createHref: '/cloudbuilder/servers/create',
      columns: [
        { key: 'serial', label: 'Serial', sortable: true },
        { key: 'macPrimary', label: 'MAC (Primary)', sortable: true, kind: 'mono' },
        { key: 'location', label: 'Location', sortable: true },
        { key: 'updatedAt', label: 'Updated At', sortable: true },
        { key: 'nicPrimaryName', label: 'NIC (Primary Name)', sortable: true },
        { key: 'frontierNet', label: 'Frontier NET', sortable: true, kind: 'badge', badgeTones: frontierTones },
        { key: 'mgmtIp', label: 'Mgmt IP', sortable: true, kind: 'mono' },
        {
          key: 'observedHealth',
          label: 'Observed Health',
          sortable: true,
          kind: 'badge',
          badgeTones: observedHealthTones,
        },
        {
          key: 'provisionStatus',
          label: 'Provision Status',
          sortable: true,
          kind: 'badge',
          badgeTones: provisionStatusTones,
        },
        { key: 'role', label: 'Role', sortable: true, kind: 'badge', badgeTones: roleTones },
        { key: 'purpose', label: 'Purpose', sortable: true },
      ],
      rows: makeRows(COUNT, (i) => {
        const frontierNet = i % 11 === 0 ? 'Invalid' : i % 7 === 0 ? 'Missing' : 'OK';
        const observedHealth = i % 9 === 0 ? 'Not Running' : 'Running';
        const provisionStatus = i % 13 === 0 ? 'Provisioning' : i % 5 === 0 ? 'Registered' : 'Done';
        const rolePool = [
          'controller',
          ...Array.from({ length: 24 }, (_, idx) => `compute${idx + 1}`),
          ...Array.from({ length: 3 }, (_, idx) => `master${idx + 1}`),
          ...Array.from({ length: 24 }, (_, idx) => `worker${idx + 1}`),
          'ceph-mon',
          'ceph-mgr',
          'ceph-mds',
          'ceph-osd',
        ];
        const role = rolePool[(i - 1) % rolePool.length]!;
        const purpose = i % 3 === 0 ? 'K8s worker' : i % 3 === 1 ? 'Hypervisor' : 'Ceph Storage';

        return {
          serial: `SN${String(1000 + i).padStart(4, '0')}`,
          macPrimary: randMac(i),
          location: `R${(i % 8) + 1}-U${(i % 42) + 1}`,
          updatedAt: dateTime(i),
          nicPrimaryName: i % 2 === 0 ? 'eno1' : 'ens3',
          frontierNet,
          mgmtIp: randIp(i),
          observedHealth,
          provisionStatus,
          role,
          purpose,
        };
      }),
    };
  }

  if (slug === 'services') {
    return {
      slug,
      title: 'Compute Services',
      searchPlaceholder: 'Search services by attributes',
      showCheckboxColumn: false,
      showBulkDelete: false,
      showActionColumn: false,
      linkifyColumnKeys: [],
      columns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'service', label: 'Service', sortable: true },
        { key: 'region', label: 'Region', sortable: true },
        { key: 'endpoints', label: 'Endpoints', sortable: true },
      ],
      rows: makeRows(COUNT, (i) => ({
        name: i % 5 === 0 ? 'neutron' : i % 5 === 1 ? 'nova' : i % 5 === 2 ? 'keystone' : i % 5 === 3 ? 'cinder3' : `service-${i}`,
        service: i % 4 === 0 ? 'network' : i % 4 === 1 ? 'compute' : i % 4 === 2 ? 'identity' : 'volumev3',
        region: i % 3 === 0 ? 'RegionOne' : i % 3 === 1 ? 'RegionTwo' : 'RegionZero',
        endpoints: i % 2 === 0 ? 'public: http://... / internal: http://...' : 'public: https://... / internal: http://...',
      })),
    };
  }

  if (slug === 'compute-services') {
    const tabComputeHosts = {
      id: 'compute-hosts',
      label: 'Compute Hosts',
      searchPlaceholder: 'Search compute hosts',
      showActionColumn: true,
      showCheckboxColumn: false,
      showBulkDelete: false,
      statusAction: {
        statusKey: 'status',
        primaryLabel: 'Service',
        primaryKey: 'computeService',
        secondaryLabel: 'Host',
        secondaryKey: 'host',
        requireDisableReason: true,
      },
      columns: [
        { key: 'host', label: 'Host', sortable: true },
        { key: 'vcpus', label: 'vCPUs', sortable: true, kind: 'mono' },
        { key: 'ram', label: 'RAM', sortable: true, kind: 'mono' },
        { key: 'status', label: 'Status', sortable: true, kind: 'badge', badgeTones: { Enabled: 'success', Disabled: 'neutral' } },
        { key: 'updatedAt', label: 'Updated At', sortable: true },
      ],
      rows: makeRows(COUNT, (i) => ({
        computeService: 'nova-compute',
        host: `compute-${(i % 24) + 1}`,
        vcpus: String(16 + (i % 8) * 4),
        ram: `${64 + (i % 6) * 32} GiB`,
        status: i % 9 === 0 ? 'Disabled' : 'Enabled',
        updatedAt: dateTime(i),
      })),
    };

    const tabHypervisors = {
      id: 'hypervisors',
      label: 'Hypervisors',
      searchPlaceholder: 'Search hypervisors',
      showActionColumn: false,
      showCheckboxColumn: false,
      showBulkDelete: false,
      columns: [
        { key: 'id', label: 'ID', sortable: true, kind: 'mono' },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'vcpuCore', label: 'VCPU (Core)', sortable: true, kind: 'mono' },
        { key: 'configuredMemoryGiB', label: 'Configured Memory (GiB)', sortable: true, kind: 'mono' },
        { key: 'instances', label: 'Instances', sortable: true, kind: 'mono' },
        { key: 'gpuUsage', label: 'GPU usage', sortable: true, kind: 'mono' },
        { key: 'pcpuUsage', label: 'PCPU usage', sortable: true, kind: 'mono' },
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
      label: 'Resource Provider',
      searchPlaceholder: 'Search resource providers',
      showActionColumn: false,
      showCheckboxColumn: false,
      showBulkDelete: false,
      columns: [
        { key: 'rpName', label: 'Resource Provider Name', sortable: true },
        { key: 'vcpusUsed', label: 'VCPUs used', sortable: true, kind: 'mono' },
        { key: 'vcpusReserved', label: 'VCPUs reserved', sortable: true, kind: 'mono' },
        { key: 'vcpusTotal', label: 'VCPUs total', sortable: true, kind: 'mono' },
        { key: 'vcpusAllocationRatio', label: 'VCPUs allocation ratio', sortable: true, kind: 'mono' },
        { key: 'pcpusUsed', label: 'PCPUs used', sortable: true, kind: 'mono' },
        { key: 'pcpusReserved', label: 'PCPUs reserved', sortable: true, kind: 'mono' },
        { key: 'pcpusTotal', label: 'PCPUs total', sortable: true, kind: 'mono' },
        { key: 'pcpusAllocationRatio', label: 'PCPUs allocation ratio', sortable: true, kind: 'mono' },
        { key: 'ramUsed', label: 'RAM used', sortable: true, kind: 'mono' },
        { key: 'ramReserved', label: 'RAM reserved', sortable: true, kind: 'mono' },
        { key: 'ramTotal', label: 'RAM total', sortable: true, kind: 'mono' },
        { key: 'ramAllocationRatio', label: 'RAM allocation ratio', sortable: true, kind: 'mono' },
        { key: 'storageUsed', label: 'Storage used', sortable: true, kind: 'mono' },
        { key: 'storageReserved', label: 'Storage reserved', sortable: true, kind: 'mono' },
        { key: 'storageTotal', label: 'Storage total', sortable: true, kind: 'mono' },
        { key: 'storageAllocationRatio', label: 'Storage allocation ratio', sortable: true, kind: 'mono' },
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
      title: 'Compute Nodes',
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
      title: 'Network Agents',
      searchPlaceholder: 'Search neutron agents',
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
        { key: 'id', label: 'ID', sortable: true, kind: 'mono' },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'host', label: 'Host', sortable: true },
        { key: 'availabilityZone', label: 'Availability Zone', sortable: true },
        { key: 'serviceStatus', label: 'Service Status', sortable: true, kind: 'badge', badgeTones: { Enabled: 'success', Disabled: 'neutral' } },
        { key: 'serviceState', label: 'Service State', sortable: true, kind: 'badge', badgeTones: { Up: 'success', Down: 'neutral' } },
        { key: 'lastUpdated', label: 'Last Updated', sortable: true },
      ],
      rows: makeRows(COUNT, (i) => ({
        id: `25d21d${String(60 + (i % 30)).padStart(2, '0')}`,
        name: i % 4 === 0 ? 'neutron-dhcp-agent' : i % 4 === 1 ? 'neutron-metadata-agent' : i % 4 === 2 ? 'ovn-controller-agent' : 'ovn-gateway-agent',
        type: i % 4 === 0 ? 'DHCP agent' : i % 4 === 1 ? 'OVN Metadata agent' : i % 4 === 2 ? 'OVN Controller agent' : 'OVN Controller Gateway agent',
        host: i % 3 === 0 ? 'bdv2kr1-ctrl01' : `bdv2kr1-gcompute${String((i % 24) + 1).padStart(2, '0')}`,
        availabilityZone: i % 5 === 0 ? '-' : 'nova',
        serviceStatus: i % 9 === 0 ? 'Disabled' : 'Enabled',
        serviceState: i % 11 === 0 ? 'Down' : 'Up',
        lastUpdated: i % 6 === 0 ? 'a minute ago' : 'a few minutes ago',
      })),
    };
  }

  if (slug === 'block-storage-services') {
    const tabBlockStorage = {
      id: 'block-storage',
      label: 'Block Storage',
      searchPlaceholder: 'Search block storage services',
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
        { key: 'name', label: 'Name', sortable: true },
        { key: 'host', label: 'Host', sortable: true },
        { key: 'availabilityZone', label: 'Availability Zone', sortable: true },
        { key: 'serviceStatus', label: 'Service Status', sortable: true },
        { key: 'serviceState', label: 'Service State', sortable: true },
        { key: 'lastUpdated', label: 'Last Updated', sortable: true },
      ],
      rows: makeRows(COUNT, (i) => ({
        name: i % 7 === 0 ? 'cinder-scheduler' : i % 7 === 1 ? 'cinder-volume' : i % 7 === 2 ? 'cinder-backup' : 'cinder-volume',
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
        serviceStatus: i % 11 === 0 ? 'Disabled' : 'Enabled',
        serviceState: i % 13 === 0 ? 'Down' : 'Up',
        lastUpdated: i % 7 === 0 ? 'a few seconds ago' : i % 7 === 1 ? '3 months ago' : 'a few seconds ago',
      })),
    };

    const tabStorageBackends = {
      id: 'storage-backends',
      label: 'Storage Backends',
      searchPlaceholder: 'Search storage backends',
      showActionColumn: false,
      showCheckboxColumn: false,
      showBulkDelete: false,
      columns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'protocol', label: 'Protocol', sortable: true },
        { key: 'backendName', label: 'Backend Name', sortable: true },
        { key: 'storageCapacityGiB', label: 'Storage Capacity(GiB)', sortable: true, align: 'center', width: '520px' },
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
      title: 'Block Storage Services',
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
      title: 'Orchestration Services',
      searchPlaceholder: 'Search orchestration services',
      showActionColumn: false,
      showCheckboxColumn: false,
      showBulkDelete: false,
      columns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'engineId', label: 'Engine ID', sortable: true, kind: 'mono' },
        { key: 'host', label: 'Host', sortable: true },
        { key: 'status', label: 'Status', sortable: true, align: 'center', width: '160px' },
        { key: 'lastUpdated', label: 'Last Updated', sortable: true },
      ],
      rows: makeRows(5, (i) => ({
        name: 'heat-engine',
        engineId: uuidLike(i),
        host: 'bdv2kr1-ctrl01',
        status: 'Up',
        lastUpdated: i === 1 ? 'a minute ago' : 'a few seconds ago',
      })),
    };
  }

  // Fallback (should not happen because slug is validated before calling)
  return {
    slug,
    title: 'Cloud Builder',
    searchPlaceholder: 'Search',
    showActionColumn: false,
    showCheckboxColumn: false,
    showBulkDelete: false,
    columns: [{ key: 'id', label: 'ID', sortable: true, kind: 'mono' }],
    rows: makeRows(0, () => ({})),
  };
}
