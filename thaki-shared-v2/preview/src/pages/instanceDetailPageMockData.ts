/**
 * Mock data copied from TDS `src/pages/InstanceDetailPage.tsx` (same fields/values),
 * plus vm-006–vm-010 for list/detail route parity with Compute instances list.
 */

export interface AttachedVolume {
  id: string;
  name: string;
  status: 'active' | 'in-use' | 'available' | 'error';
  size: string;
  type: string;
  diskTag: string;
  bootable: boolean;
  access: string;
  [key: string]: unknown;
}

export interface AttachedInterface {
  id: string;
  name: string;
  network: string;
  port: string;
  portStatus: 'Active' | 'Inactive' | 'Down' | 'Build';
  fixedIp: string;
  macAddress: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface FloatingIP {
  id: string;
  name: string;
  status: 'active' | 'shutoff' | 'error';
  floatingIp: string;
  fixedIp: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface SecurityGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface NetworkInterface {
  id: string;
  name: string;
  ip: string;
}

export interface InstanceSnapshot {
  id: string;
  name: string;
  status: 'active' | 'queued' | 'saving' | 'error';
  size: string;
  diskFormat: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface ActionLog {
  id: string;
  operationName: string;
  requestId: string;
  requestedTime: string;
  result: 'Success' | 'Error' | 'In Progress';
  startTime: string;
  endTime: string;
  [key: string]: unknown;
}

export interface InstanceDetail {
  id: string;
  name: string;
  status: 'active' | 'shutoff' | 'building' | 'error' | 'paused' | 'stopped';
  host: string;
  createdAt: string;
  availabilityZone: string;
  description: string;
  flavor: {
    name: string;
    vcpu: number;
    ram: string;
    disk: string;
    gpu: number;
  };
  image: string;
  os: string;
  locked: boolean;
  keyPair: string;
  serverGroup: string;
  userData: string;
}

export const mockInstancesMap: Record<string, InstanceDetail> = {
  'vm-001': {
    id: 'vm-001',
    name: 'worker-node-01',
    status: 'active',
    host: 'compute-03',
    createdAt: 'Jul 25, 2025 10:32:16',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Medium', vcpu: 4, ram: '8 GiB', disk: '100 GiB', gpu: 1 },
    image: 'CentOS 7',
    os: 'CentOS 7',
    locked: true,
    keyPair: 'default-key',
    serverGroup: 'worker-group',
    userData: '-',
  },
  'vm-002': {
    id: 'vm-002',
    name: 'worker-node-02',
    status: 'active',
    host: 'compute-03',
    createdAt: 'Jul 24, 2025 03:19:59',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Medium', vcpu: 4, ram: '8 GiB', disk: '100 GiB', gpu: 1 },
    image: 'CentOS 7',
    os: 'CentOS 7',
    locked: false,
    keyPair: 'default-key',
    serverGroup: 'worker-group',
    userData: '-',
  },
  'vm-003': {
    id: 'vm-003',
    name: 'master-node-01',
    status: 'active',
    host: 'compute-01',
    createdAt: 'Jul 20, 2025 23:27:51',
    availabilityZone: 'nova',
    description: 'Kubernetes master node',
    flavor: { name: 'Large', vcpu: 8, ram: '16 GiB', disk: '200 GiB', gpu: 0 },
    image: 'Ubuntu 22.04',
    os: 'Ubuntu 22.04',
    locked: false,
    keyPair: 'master-key',
    serverGroup: 'master-group',
    userData: '-',
  },
  'vm-004': {
    id: 'vm-004',
    name: 'db-server-01',
    status: 'stopped',
    host: 'compute-02',
    createdAt: 'Jul 15, 2025 12:22:26',
    availabilityZone: 'keystone',
    description: 'Database server',
    flavor: { name: 'XLarge', vcpu: 16, ram: '64 GiB', disk: '500 GiB', gpu: 0 },
    image: 'CentOS 8',
    os: 'CentOS 8',
    locked: true,
    keyPair: 'db-key',
    serverGroup: 'db-group',
    userData: '-',
  },
  'vm-005': {
    id: 'vm-005',
    name: 'gpu-node-01',
    status: 'active',
    host: 'compute-gpu-01',
    createdAt: 'Jul 10, 2025 01:17:01',
    availabilityZone: 'nova',
    description: 'GPU compute node',
    flavor: { name: 'GPU Large', vcpu: 32, ram: '128 GiB', disk: '1000 GiB', gpu: 4 },
    image: 'Ubuntu 22.04',
    os: 'Ubuntu 22.04',
    locked: false,
    keyPair: 'gpu-key',
    serverGroup: 'gpu-group',
    userData: '-',
  },
  'vm-006': {
    id: 'vm-006',
    name: 'gpu-node-02',
    status: 'active',
    host: 'compute-gpu-02',
    createdAt: 'Jul 9, 2025 18:40:12',
    availabilityZone: 'nova',
    description: '-',
    flavor: { name: 'GPU Large', vcpu: 32, ram: '128 GiB', disk: '1000 GiB', gpu: 4 },
    image: 'Ubuntu 22.04',
    os: 'Ubuntu 22.04',
    locked: false,
    keyPair: 'gpu-key',
    serverGroup: 'gpu-group',
    userData: '-',
  },
  'vm-007': {
    id: 'vm-007',
    name: 'web-server-01',
    status: 'paused',
    host: 'compute-04',
    createdAt: 'Jul 8, 2025 09:05:00',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Small', vcpu: 2, ram: '4 GiB', disk: '50 GiB', gpu: 0 },
    image: 'Rocky Linux 9',
    os: 'Rocky Linux 9',
    locked: false,
    keyPair: 'default-key',
    serverGroup: '-',
    userData: '-',
  },
  'vm-008': {
    id: 'vm-008',
    name: 'web-server-02',
    status: 'building',
    host: 'compute-04',
    createdAt: 'Jul 7, 2025 14:22:33',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Small', vcpu: 2, ram: '4 GiB', disk: '50 GiB', gpu: 0 },
    image: 'Rocky Linux 9',
    os: 'Rocky Linux 9',
    locked: false,
    keyPair: 'default-key',
    serverGroup: '-',
    userData: '-',
  },
  'vm-009': {
    id: 'vm-009',
    name: 'analytics-01',
    status: 'error',
    host: 'compute-02',
    createdAt: 'Jul 5, 2025 11:18:45',
    availabilityZone: 'nova',
    description: '-',
    flavor: { name: 'XLarge', vcpu: 16, ram: '32 GiB', disk: '500 GiB', gpu: 2 },
    image: 'Debian 12',
    os: 'Debian 12',
    locked: true,
    keyPair: 'default-key',
    serverGroup: '-',
    userData: '-',
  },
  'vm-010': {
    id: 'vm-010',
    name: 'cache-server-01',
    status: 'active',
    host: 'compute-03',
    createdAt: 'Jul 4, 2025 08:12:01',
    availabilityZone: 'keystone',
    description: '-',
    flavor: { name: 'Medium', vcpu: 4, ram: '16 GiB', disk: '100 GiB', gpu: 0 },
    image: 'Debian 12',
    os: 'Debian 12',
    locked: false,
    keyPair: 'default-key',
    serverGroup: '-',
    userData: '-',
  },
};

export const defaultInstanceDetail: InstanceDetail = {
  id: 'unknown',
  name: 'Unknown Instance',
  status: 'active',
  host: 'compute-03',
  createdAt: 'Jul 25, 2025 10:32:16',
  availabilityZone: 'nova',
  description: '-',
  flavor: { name: 'Medium', vcpu: 1, ram: '4 GiB', disk: '40 GiB', gpu: 1 },
  image: 'Unknown',
  os: 'Unknown',
  locked: false,
  keyPair: '-',
  serverGroup: '-',
  userData: '-',
};

export const mockAttachedVolumes: AttachedVolume[] = [
  {
    id: 'vol-001',
    name: 'vol34',
    status: 'active',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'OS Disk',
    bootable: false,
    access: 'Nov 11, 2025',
  },
  {
    id: 'vol-002',
    name: 'data-volume-01',
    status: 'active',
    size: '500GiB',
    type: 'SSD',
    diskTag: 'Data disk',
    bootable: false,
    access: 'Nov 10, 2025',
  },
  {
    id: 'vol-003',
    name: 'backup-vol',
    status: 'active',
    size: '2000GiB',
    type: '_DEFAULT_',
    diskTag: 'Backup',
    bootable: false,
    access: 'Nov 9, 2025',
  },
  {
    id: 'vol-004',
    name: 'app-storage',
    status: 'active',
    size: '750GiB',
    type: 'SSD',
    diskTag: 'App Data',
    bootable: false,
    access: 'Nov 8, 2025',
  },
  {
    id: 'vol-005',
    name: 'database-vol',
    status: 'active',
    size: '1000GiB',
    type: 'SSD',
    diskTag: 'Database',
    bootable: false,
    access: 'Nov 7, 2025',
  },
  {
    id: 'vol-006',
    name: 'logs-archive',
    status: 'active',
    size: '250GiB',
    type: '_DEFAULT_',
    diskTag: 'Logs',
    bootable: false,
    access: 'Nov 6, 2025',
  },
  {
    id: 'vol-007',
    name: 'media-storage',
    status: 'active',
    size: '3000GiB',
    type: '_DEFAULT_',
    diskTag: 'Media',
    bootable: false,
    access: 'Nov 5, 2025',
  },
  {
    id: 'vol-008',
    name: 'cache-vol',
    status: 'active',
    size: '128GiB',
    type: 'SSD',
    diskTag: 'Cache',
    bootable: false,
    access: 'Nov 4, 2025',
  },
  {
    id: 'vol-009',
    name: 'temp-storage',
    status: 'active',
    size: '64GiB',
    type: 'SSD',
    diskTag: 'Temp',
    bootable: false,
    access: 'Nov 3, 2025',
  },
  {
    id: 'vol-010',
    name: 'shared-data',
    status: 'active',
    size: '500GiB',
    type: '_DEFAULT_',
    diskTag: 'Shared',
    bootable: false,
    access: 'Nov 2, 2025',
  },
];

export const mockAttachedInterfaces: AttachedInterface[] = [
  {
    id: '29tgj234',
    name: 'port-01',
    network: 'net-01',
    port: '123984734',
    portStatus: 'Inactive',
    fixedIp: '10.0.0.6',
    macAddress: '10.0.0.2',
    createdAt: 'Nov 11, 2025 08:30:18',
  },
  {
    id: '38hdk456',
    name: 'port-02',
    network: 'net-02',
    port: '987654321',
    portStatus: 'Active',
    fixedIp: '10.0.0.5',
    macAddress: 'fa:16:3e:12:34:56',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: '47jfl789',
    name: 'port-03',
    network: 'net-03',
    port: '456789123',
    portStatus: 'Active',
    fixedIp: '192.168.1.10',
    macAddress: 'fa:16:3e:ab:cd:ef',
    createdAt: 'Nov 9, 2025 18:04:44',
  },
  {
    id: '56kgm012',
    name: 'port-04',
    network: 'net-04',
    port: '789012345',
    portStatus: 'Active',
    fixedIp: '172.16.0.10',
    macAddress: 'fa:16:3e:11:22:33',
    createdAt: 'Nov 8, 2025 11:51:27',
  },
  {
    id: '65lhn345',
    name: 'port-05',
    network: 'net-05',
    port: '234567890',
    portStatus: 'Active',
    fixedIp: '10.10.0.5',
    macAddress: 'fa:16:3e:44:55:66',
    createdAt: 'Nov 7, 2025 04:38:10',
  },
  {
    id: '74mip678',
    name: 'port-06',
    network: 'net-06',
    port: '345678901',
    portStatus: 'Down',
    fixedIp: '10.20.0.15',
    macAddress: 'fa:16:3e:77:88:99',
    createdAt: 'Nov 6, 2025 21:25:53',
  },
  {
    id: '83njq901',
    name: 'port-07',
    network: 'net-07',
    port: '456789012',
    portStatus: 'Active',
    fixedIp: '10.30.0.20',
    macAddress: 'fa:16:3e:aa:bb:cc',
    createdAt: 'Nov 5, 2025 14:12:36',
  },
  {
    id: '92okr234',
    name: 'port-08',
    network: 'net-08',
    port: '567890123',
    portStatus: 'Active',
    fixedIp: '10.40.0.25',
    macAddress: 'fa:16:3e:dd:ee:ff',
    createdAt: 'Nov 4, 2025 07:59:19',
  },
  {
    id: '01pls567',
    name: 'port-09',
    network: 'net-09',
    port: '678901234',
    portStatus: 'Build',
    fixedIp: '10.50.0.30',
    macAddress: 'fa:16:3e:12:34:ab',
    createdAt: 'Nov 3, 2025 00:46:02',
  },
  {
    id: '10qmt890',
    name: 'port-10',
    network: 'net-10',
    port: '789012345',
    portStatus: 'Active',
    fixedIp: '10.60.0.35',
    macAddress: 'fa:16:3e:cd:ef:12',
    createdAt: 'Nov 2, 2025 17:33:45',
  },
  {
    id: '29rnu123',
    name: 'port-11',
    network: 'net-11',
    port: '890123456',
    portStatus: 'Active',
    fixedIp: '10.70.0.40',
    macAddress: 'fa:16:3e:34:56:78',
    createdAt: 'Nov 1, 2025 10:20:28',
  },
  {
    id: '38sov456',
    name: 'port-12',
    network: 'net-12',
    port: '901234567',
    portStatus: 'Inactive',
    fixedIp: '10.80.0.45',
    macAddress: 'fa:16:3e:9a:bc:de',
    createdAt: 'Oct 31, 2025 04:50:58',
  },
];

export const mockFloatingIPs: FloatingIP[] = [
  {
    id: '29tgj234',
    name: 'ens-server-04',
    status: 'active',
    floatingIp: '10.0.0.11',
    fixedIp: '10.0.0.11',
    createdAt: 'Sep 1, 2025 10:20:28',
  },
  {
    id: '38hdk456',
    name: 'public-ip-01',
    status: 'active',
    floatingIp: '192.168.1.100',
    fixedIp: '10.0.0.5',
    createdAt: 'Aug 15, 2025 12:22:26',
  },
  {
    id: '47jfl789',
    name: 'lb-frontend',
    status: 'shutoff',
    floatingIp: '172.16.0.50',
    fixedIp: '10.0.0.20',
    createdAt: 'Jul 20, 2025 23:27:51',
  },
  {
    id: '56kgm012',
    name: 'web-server-01',
    status: 'active',
    floatingIp: '203.0.113.10',
    fixedIp: '10.0.1.10',
    createdAt: 'Sep 10, 2025 01:17:01',
  },
  {
    id: '65lhn345',
    name: 'api-gateway',
    status: 'active',
    floatingIp: '203.0.113.20',
    fixedIp: '10.0.1.20',
    createdAt: 'Sep 12, 2025 15:43:35',
  },
  {
    id: '74mip678',
    name: 'db-primary',
    status: 'error',
    floatingIp: '203.0.113.30',
    fixedIp: '10.0.1.30',
    createdAt: 'Sep 15, 2025 12:22:26',
  },
  {
    id: '83njq901',
    name: 'cache-server',
    status: 'active',
    floatingIp: '203.0.113.40',
    fixedIp: '10.0.1.40',
    createdAt: 'Sep 18, 2025 09:01:17',
  },
  {
    id: '92okr234',
    name: 'monitoring',
    status: 'active',
    floatingIp: '203.0.113.50',
    fixedIp: '10.0.1.50',
    createdAt: 'Sep 20, 2025 23:27:51',
  },
  {
    id: '01pls567',
    name: 'backup-server',
    status: 'shutoff',
    floatingIp: '203.0.113.60',
    fixedIp: '10.0.1.60',
    createdAt: 'Sep 22, 2025 13:53:25',
  },
  {
    id: '10qmt890',
    name: 'staging-env',
    status: 'active',
    floatingIp: '203.0.113.70',
    fixedIp: '10.0.1.70',
    createdAt: 'Sep 25, 2025 10:32:16',
  },
  {
    id: '29rnu123',
    name: 'dev-server',
    status: 'active',
    floatingIp: '203.0.113.80',
    fixedIp: '10.0.1.80',
    createdAt: 'Sep 28, 2025 07:11:07',
  },
  {
    id: '38sov456',
    name: 'test-instance',
    status: 'shutoff',
    floatingIp: '203.0.113.90',
    fixedIp: '10.0.1.90',
    createdAt: 'Sep 30, 2025 21:37:41',
  },
];

export const mockNetworkInterfaces: NetworkInterface[] = [
  { id: 'net-001', name: 'private-net', ip: '10.0.0.5' },
  { id: 'net-002', name: 'public-net', ip: '72.116.0.10' },
  { id: 'net-003', name: 'public-net', ip: '72.116.0.10' },
];

export const mockSecurityGroups: SecurityGroup[] = [
  { id: 'sg-001', name: 'sg-02', description: '10.0.0.11', createdAt: 'Nov 11, 2025 08:30:18' },
  {
    id: 'sg-002',
    name: 'default',
    description: 'Default security group',
    createdAt: 'Nov 10, 2025 01:17:01',
  },
  {
    id: 'sg-003',
    name: 'web-servers',
    description: 'Web server security group',
    createdAt: 'Nov 9, 2025 18:04:44',
  },
  {
    id: 'sg-004',
    name: 'ssh-access',
    description: 'SSH access security group',
    createdAt: 'Nov 8, 2025 11:51:27',
  },
  {
    id: 'sg-005',
    name: 'db-servers',
    description: 'Database server security group',
    createdAt: 'Nov 7, 2025 04:38:10',
  },
  {
    id: 'sg-006',
    name: 'internal-only',
    description: 'Internal network only',
    createdAt: 'Nov 6, 2025 21:25:53',
  },
  {
    id: 'sg-007',
    name: 'load-balancer',
    description: 'Load balancer security group',
    createdAt: 'Nov 5, 2025 14:12:36',
  },
  {
    id: 'sg-008',
    name: 'monitoring',
    description: 'Monitoring services access',
    createdAt: 'Nov 4, 2025 07:59:19',
  },
  {
    id: 'sg-009',
    name: 'kubernetes',
    description: 'Kubernetes cluster security group',
    createdAt: 'Nov 3, 2025 00:46:02',
  },
  {
    id: 'sg-010',
    name: 'api-gateway',
    description: 'API gateway security group',
    createdAt: 'Nov 2, 2025 17:33:45',
  },
  {
    id: 'sg-011',
    name: 'cache-servers',
    description: 'Cache server security group',
    createdAt: 'Nov 1, 2025 10:20:28',
  },
  {
    id: 'sg-012',
    name: 'message-queue',
    description: 'Message queue security group',
    createdAt: 'Oct 31, 2025 04:50:58',
  },
];

export const mockInstanceSnapshots: InstanceSnapshot[] = [
  {
    id: 'snap-001',
    name: 'snap-01',
    status: 'active',
    size: '30GiB',
    diskFormat: 'RAW',
    createdAt: 'Sep 1, 2025 10:20:28',
  },
  {
    id: 'snap-002',
    name: 'db-backup-weekly',
    status: 'active',
    size: '50GiB',
    diskFormat: 'QCOW2',
    createdAt: 'Aug 28, 2025 07:11:07',
  },
  {
    id: 'snap-003',
    name: 'web-server-snapshot',
    status: 'active',
    size: '20GiB',
    diskFormat: 'RAW',
    createdAt: 'Aug 25, 2025 10:32:16',
  },
  {
    id: 'snap-004',
    name: 'pre-upgrade-backup',
    status: 'active',
    size: '45GiB',
    diskFormat: 'QCOW2',
    createdAt: 'Aug 20, 2025 23:27:51',
  },
  {
    id: 'snap-005',
    name: 'dev-environment',
    status: 'active',
    size: '15GiB',
    diskFormat: 'RAW',
    createdAt: 'Aug 15, 2025 12:22:26',
  },
  {
    id: 'snap-006',
    name: 'staging-snapshot',
    status: 'active',
    size: '35GiB',
    diskFormat: 'QCOW2',
    createdAt: 'Aug 10, 2025 01:17:01',
  },
  {
    id: 'snap-007',
    name: 'production-backup',
    status: 'active',
    size: '60GiB',
    diskFormat: 'RAW',
    createdAt: 'Aug 5, 2025 14:12:36',
  },
  {
    id: 'snap-008',
    name: 'test-environment',
    status: 'queued',
    size: '25GiB',
    diskFormat: 'QCOW2',
    createdAt: 'Aug 1, 2025 10:20:28',
  },
  {
    id: 'snap-009',
    name: 'app-server-v2',
    status: 'active',
    size: '40GiB',
    diskFormat: 'RAW',
    createdAt: 'Jul 28, 2025 07:11:07',
  },
  {
    id: 'snap-010',
    name: 'database-snapshot',
    status: 'active',
    size: '55GiB',
    diskFormat: 'QCOW2',
    createdAt: 'Jul 25, 2025 10:32:16',
  },
  {
    id: 'snap-011',
    name: 'cache-server-snap',
    status: 'active',
    size: '10GiB',
    diskFormat: 'RAW',
    createdAt: 'Jul 20, 2025 23:27:51',
  },
  {
    id: 'snap-012',
    name: 'monitoring-backup',
    status: 'active',
    size: '18GiB',
    diskFormat: 'QCOW2',
    createdAt: 'Jul 15, 2025 12:22:26',
  },
];

export const mockActionLogs: ActionLog[] = [
  {
    id: 'log-001',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
  {
    id: 'log-002',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
  {
    id: 'log-003',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
  {
    id: 'log-004',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
  {
    id: 'log-005',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
  {
    id: 'log-006',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
  {
    id: 'log-007',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
  {
    id: 'log-008',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
  {
    id: 'log-009',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
  {
    id: 'log-010',
    operationName: 'Create',
    requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2',
    requestedTime: 'Sep 11, 2025 14:23:15',
    result: 'Success',
    startTime: '14:23:15',
    endTime: '14:23:15',
  },
];

export const CONSOLE_LOG_SAMPLE = `[    0.000000] Linux version 5.15.0-107-cloud (buildd@ubuntu) (gcc 11.3.0) #119-Ubuntu SMP Thu Sep 5 10:10:10 UTC 2025
[    0.500123] cloud-init[101]: Starting network configuration...
[    1.002345] cloud-init[101]: eth0: assigned 192.168.0.15 via DHCP
[    1.456789] systemd[1]: Reached target Cloud-init Pre-Networking.
[    2.123456] cloud-init[204]: Injecting SSH host keys...
[    3.012345] sshd[301]: Server listening on 0.0.0.0 port 22.
[    4.567890] sshd[301]: Accepted publickey for ubuntu from 10.0.0.25 port 50522 ssh2
[    5.123456] WARNING: cloud-init[204]: DNS resolution failed for repo.example.com, retrying in 5s...
[    7.654321] cloud-init[204]: Downloaded init scripts successfully.
[    8.000000] systemd[1]: Reached target Cloud-init Final.
[    9.123456] cloud-init[500]: VM boot completed in 9.12 seconds.
[   10.000000] *** NOTICE: Unauthorized access to this system is prohibited. ***`;
