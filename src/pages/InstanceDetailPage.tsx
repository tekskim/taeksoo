import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  SectionCard,
  Table,
  SearchInput,
  Pagination,
  StatusIndicator,
} from '@/design-system';
import { Link } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconTerminal2,
  IconPlayerPlay,
  IconPlayerStop,
  IconRefresh,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconChevronRight,
  IconEdit,
  IconBell,
  IconCirclePlus,
  IconDotsCircleHorizontal,
  IconExternalLink,
  IconDownload,
  IconSearch,
  IconCopy,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface AttachedVolume {
  id: string;
  name: string;
  status: 'active' | 'in-use' | 'available' | 'error';
  size: string;
  type: string;
  diskTag: string;
  bootable: boolean;
  access: string;
}

interface AttachedInterface {
  id: string;
  network: string;
  port: string;
  portStatus: 'Active' | 'Inactive' | 'Down' | 'Build';
  fixedIp: string;
  macAddress: string;
}

interface FloatingIP {
  id: string;
  name: string;
  status: 'active' | 'shutoff' | 'error';
  floatingIp: string;
  fixedIp: string;
  createdAt: string;
}

interface SecurityGroup {
  id: string;
  name: string;
  description: string;
}

interface NetworkInterface {
  id: string;
  name: string;
  ip: string;
}

interface InstanceSnapshot {
  id: string;
  name: string;
  status: 'active' | 'queued' | 'saving' | 'error';
  size: string;
  diskFormat: string;
  createdAt: string;
}

interface ActionLog {
  id: string;
  operationName: string;
  requestId: string;
  requestedTime: string;
  result: 'Success' | 'Error' | 'In Progress';
  startTime: string;
  endTime: string;
}

interface InstanceDetail {
  id: string;
  name: string;
  status: 'active' | 'shutoff' | 'building' | 'error' | 'paused';
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
  interfaces: number;
  keyPair: string;
  serverGroup: string;
  userData: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockInstanceDetail: InstanceDetail = {
  id: '7284d9174e81431e93060a9bbcf2cdfd',
  name: 'tk-test',
  status: 'active',
  host: 'compute-03',
  createdAt: '2025-07-25 09:12:20',
  availabilityZone: 'nova',
  description: '-',
  flavor: {
    name: 'web-server-10',
    vcpu: 1,
    ram: '4 GiB',
    disk: '40 GiB',
    gpu: 1,
  },
  image: 'web-server-10',
  interfaces: 5,
  keyPair: 'web-server-10',
  serverGroup: 'web-server-10',
  userData: 'web-server-10',
};

const mockAttachedVolumes: AttachedVolume[] = [
  {
    id: 'vol-001',
    name: 'vol34',
    status: 'active',
    size: '1500GiB',
    type: '_DEFAULT_',
    diskTag: 'OS Disk',
    bootable: false,
    access: 'Public',
  },
  {
    id: 'vol-002',
    name: 'data-volume-01',
    status: 'active',
    size: '500GiB',
    type: 'SSD',
    diskTag: 'Data Disk',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-003',
    name: 'backup-vol',
    status: 'active',
    size: '2000GiB',
    type: '_DEFAULT_',
    diskTag: 'Backup',
    bootable: false,
    access: 'Public',
  },
  {
    id: 'vol-004',
    name: 'app-storage',
    status: 'active',
    size: '750GiB',
    type: 'SSD',
    diskTag: 'App Data',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-005',
    name: 'database-vol',
    status: 'active',
    size: '1000GiB',
    type: 'SSD',
    diskTag: 'Database',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-006',
    name: 'logs-archive',
    status: 'active',
    size: '250GiB',
    type: '_DEFAULT_',
    diskTag: 'Logs',
    bootable: false,
    access: 'Public',
  },
  {
    id: 'vol-007',
    name: 'media-storage',
    status: 'active',
    size: '3000GiB',
    type: '_DEFAULT_',
    diskTag: 'Media',
    bootable: false,
    access: 'Public',
  },
  {
    id: 'vol-008',
    name: 'cache-vol',
    status: 'active',
    size: '128GiB',
    type: 'SSD',
    diskTag: 'Cache',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-009',
    name: 'temp-storage',
    status: 'active',
    size: '64GiB',
    type: 'SSD',
    diskTag: 'Temp',
    bootable: false,
    access: 'Private',
  },
  {
    id: 'vol-010',
    name: 'shared-data',
    status: 'active',
    size: '500GiB',
    type: '_DEFAULT_',
    diskTag: 'Shared',
    bootable: false,
    access: 'Public',
  },
];

const mockAttachedInterfaces: AttachedInterface[] = [
  { id: 'iface-001', network: 'ens-server-03', port: '123984734', portStatus: 'Inactive', fixedIp: '10.0.0.6', macAddress: '10.0.0.2' },
  { id: 'iface-002', network: 'ens-server-02', port: '987654321', portStatus: 'Active', fixedIp: '10.0.0.5', macAddress: 'fa:16:3e:12:34:56' },
  { id: 'iface-003', network: 'private-network', port: '456789123', portStatus: 'Active', fixedIp: '192.168.1.10', macAddress: 'fa:16:3e:ab:cd:ef' },
  { id: 'iface-004', network: 'public-network', port: '789012345', portStatus: 'Active', fixedIp: '172.16.0.10', macAddress: 'fa:16:3e:11:22:33' },
  { id: 'iface-005', network: 'management-net', port: '234567890', portStatus: 'Active', fixedIp: '10.10.0.5', macAddress: 'fa:16:3e:44:55:66' },
  { id: 'iface-006', network: 'storage-net', port: '345678901', portStatus: 'Down', fixedIp: '10.20.0.15', macAddress: 'fa:16:3e:77:88:99' },
  { id: 'iface-007', network: 'backup-network', port: '456789012', portStatus: 'Active', fixedIp: '10.30.0.20', macAddress: 'fa:16:3e:aa:bb:cc' },
  { id: 'iface-008', network: 'monitoring-net', port: '567890123', portStatus: 'Active', fixedIp: '10.40.0.25', macAddress: 'fa:16:3e:dd:ee:ff' },
  { id: 'iface-009', network: 'replication-net', port: '678901234', portStatus: 'Build', fixedIp: '10.50.0.30', macAddress: 'fa:16:3e:12:34:ab' },
  { id: 'iface-010', network: 'cluster-network', port: '789012345', portStatus: 'Active', fixedIp: '10.60.0.35', macAddress: 'fa:16:3e:cd:ef:12' },
  { id: 'iface-011', network: 'api-network', port: '890123456', portStatus: 'Active', fixedIp: '10.70.0.40', macAddress: 'fa:16:3e:34:56:78' },
  { id: 'iface-012', network: 'tenant-network', port: '901234567', portStatus: 'Inactive', fixedIp: '10.80.0.45', macAddress: 'fa:16:3e:9a:bc:de' },
];

const mockFloatingIPs: FloatingIP[] = [
  { id: 'fip-001', name: 'ens-server-04', status: 'active', floatingIp: '10.0.0.11', fixedIp: '10.0.0.11', createdAt: '2025-09-01' },
  { id: 'fip-002', name: 'public-ip-01', status: 'active', floatingIp: '192.168.1.100', fixedIp: '10.0.0.5', createdAt: '2025-08-15' },
  { id: 'fip-003', name: 'lb-frontend', status: 'shutoff', floatingIp: '172.16.0.50', fixedIp: '10.0.0.20', createdAt: '2025-07-20' },
  { id: 'fip-004', name: 'web-server-01', status: 'active', floatingIp: '203.0.113.10', fixedIp: '10.0.1.10', createdAt: '2025-09-10' },
  { id: 'fip-005', name: 'api-gateway', status: 'active', floatingIp: '203.0.113.20', fixedIp: '10.0.1.20', createdAt: '2025-09-12' },
  { id: 'fip-006', name: 'db-primary', status: 'error', floatingIp: '203.0.113.30', fixedIp: '10.0.1.30', createdAt: '2025-09-15' },
  { id: 'fip-007', name: 'cache-server', status: 'active', floatingIp: '203.0.113.40', fixedIp: '10.0.1.40', createdAt: '2025-09-18' },
  { id: 'fip-008', name: 'monitoring', status: 'active', floatingIp: '203.0.113.50', fixedIp: '10.0.1.50', createdAt: '2025-09-20' },
  { id: 'fip-009', name: 'backup-server', status: 'shutoff', floatingIp: '203.0.113.60', fixedIp: '10.0.1.60', createdAt: '2025-09-22' },
  { id: 'fip-010', name: 'staging-env', status: 'active', floatingIp: '203.0.113.70', fixedIp: '10.0.1.70', createdAt: '2025-09-25' },
  { id: 'fip-011', name: 'dev-server', status: 'active', floatingIp: '203.0.113.80', fixedIp: '10.0.1.80', createdAt: '2025-09-28' },
  { id: 'fip-012', name: 'test-instance', status: 'shutoff', floatingIp: '203.0.113.90', fixedIp: '10.0.1.90', createdAt: '2025-09-30' },
];

const mockNetworkInterfaces: NetworkInterface[] = [
  { id: 'net-001', name: 'private-net', ip: '10.0.0.5' },
  { id: 'net-002', name: 'public-net', ip: '72.116.0.10' },
  { id: 'net-003', name: 'public-net', ip: '72.116.0.10' },
];

const mockSecurityGroups: SecurityGroup[] = [
  { id: 'sg-001', name: '00cc559f', description: '10.0.0.11' },
  { id: 'sg-002', name: 'default', description: 'Default security group' },
  { id: 'sg-003', name: 'web-servers', description: 'Web server security group' },
  { id: 'sg-004', name: 'ssh-access', description: 'SSH access security group' },
  { id: 'sg-005', name: 'db-servers', description: 'Database server security group' },
  { id: 'sg-006', name: 'internal-only', description: 'Internal network only' },
  { id: 'sg-007', name: 'load-balancer', description: 'Load balancer security group' },
  { id: 'sg-008', name: 'monitoring', description: 'Monitoring services access' },
  { id: 'sg-009', name: 'kubernetes', description: 'Kubernetes cluster security group' },
  { id: 'sg-010', name: 'api-gateway', description: 'API gateway security group' },
  { id: 'sg-011', name: 'cache-servers', description: 'Cache server security group' },
  { id: 'sg-012', name: 'message-queue', description: 'Message queue security group' },
];

const mockInstanceSnapshots: InstanceSnapshot[] = [
  { id: 'snap-001', name: 'ens-server-03', status: 'active', size: '30GiB', diskFormat: 'RAW', createdAt: '2025-09-01' },
  { id: 'snap-002', name: 'db-backup-weekly', status: 'active', size: '50GiB', diskFormat: 'QCOW2', createdAt: '2025-08-28' },
  { id: 'snap-003', name: 'web-server-snapshot', status: 'active', size: '20GiB', diskFormat: 'RAW', createdAt: '2025-08-25' },
  { id: 'snap-004', name: 'pre-upgrade-backup', status: 'active', size: '45GiB', diskFormat: 'QCOW2', createdAt: '2025-08-20' },
  { id: 'snap-005', name: 'dev-environment', status: 'active', size: '15GiB', diskFormat: 'RAW', createdAt: '2025-08-15' },
  { id: 'snap-006', name: 'staging-snapshot', status: 'active', size: '35GiB', diskFormat: 'QCOW2', createdAt: '2025-08-10' },
  { id: 'snap-007', name: 'production-backup', status: 'active', size: '60GiB', diskFormat: 'RAW', createdAt: '2025-08-05' },
  { id: 'snap-008', name: 'test-environment', status: 'queued', size: '25GiB', diskFormat: 'QCOW2', createdAt: '2025-08-01' },
  { id: 'snap-009', name: 'app-server-v2', status: 'active', size: '40GiB', diskFormat: 'RAW', createdAt: '2025-07-28' },
  { id: 'snap-010', name: 'database-snapshot', status: 'active', size: '55GiB', diskFormat: 'QCOW2', createdAt: '2025-07-25' },
  { id: 'snap-011', name: 'cache-server-snap', status: 'active', size: '10GiB', diskFormat: 'RAW', createdAt: '2025-07-20' },
  { id: 'snap-012', name: 'monitoring-backup', status: 'active', size: '18GiB', diskFormat: 'QCOW2', createdAt: '2025-07-15' },
];

const mockActionLogs: ActionLog[] = [
  { id: 'log-001', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
  { id: 'log-002', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
  { id: 'log-003', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
  { id: 'log-004', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
  { id: 'log-005', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
  { id: 'log-006', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
  { id: 'log-007', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
  { id: 'log-008', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
  { id: 'log-009', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
  { id: 'log-010', operationName: 'Create', requestId: 'req-fe6b60ca-76cf-4bd5-aa2f-d2b8d7f918c2', requestedTime: '2025-09-11 13:34:57', result: 'Success', startTime: '14:23:15', endTime: '14:23:15' },
];


/* ----------------------------------------
   Instance Detail Page
   ---------------------------------------- */

export function InstanceDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('details');
  const [selectedNetworkInterface, setSelectedNetworkInterface] = useState(mockNetworkInterfaces[0]?.id || '');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  // Interface tab pagination state
  const [interfaceCurrentPage, setInterfaceCurrentPage] = useState(1);
  const interfaceRowsPerPage = 10;
  const interfaceTotalPages = Math.ceil(mockAttachedInterfaces.length / interfaceRowsPerPage);
  
  // Floating IP tab pagination state
  const [floatingIpCurrentPage, setFloatingIpCurrentPage] = useState(1);
  const floatingIpRowsPerPage = 10;
  const floatingIpTotalPages = Math.ceil(mockFloatingIPs.length / floatingIpRowsPerPage);
  
  // Security tab pagination state
  const [securityCurrentPage, setSecurityCurrentPage] = useState(1);
  const securityRowsPerPage = 10;
  const securityTotalPages = Math.ceil(mockSecurityGroups.length / securityRowsPerPage);
  
  // Instance Snapshots tab pagination state
  const [snapshotCurrentPage, setSnapshotCurrentPage] = useState(1);
  const [snapshotSearchQuery, setSnapshotSearchQuery] = useState('');
  const snapshotRowsPerPage = 10;
  const filteredSnapshots = mockInstanceSnapshots.filter(snapshot =>
    snapshot.name.toLowerCase().includes(snapshotSearchQuery.toLowerCase())
  );
  const snapshotTotalPages = Math.ceil(filteredSnapshots.length / snapshotRowsPerPage);

  // Monitoring (Console Logs) state
  const [logLength, setLogLength] = useState(20);

  // Action Logs tab state
  const [actionLogCurrentPage, setActionLogCurrentPage] = useState(1);
  const [actionLogSearchQuery, setActionLogSearchQuery] = useState('');
  const [expandedLogIds, setExpandedLogIds] = useState<Set<string>>(new Set(['log-001']));
  const actionLogRowsPerPage = 10;
  const filteredActionLogs = mockActionLogs.filter(log =>
    log.operationName.toLowerCase().includes(actionLogSearchQuery.toLowerCase()) ||
    log.requestId.toLowerCase().includes(actionLogSearchQuery.toLowerCase())
  );
  const actionLogTotalPages = Math.ceil(filteredActionLogs.length / actionLogRowsPerPage);

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  // In a real app, you would fetch the instance data based on the ID
  const instance = mockInstanceDetail;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className={`min-h-screen bg-[var(--color-surface-default)] transition-[margin] duration-200 ${sidebarOpen ? 'ml-[200px]' : 'ml-0'}`}>
        {/* Tab Bar */}
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          showWindowControls={true}
        />

        {/* Top Bar with Breadcrumb Navigation */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Proj-1', href: '/project' },
                { label: 'Instances List', href: '/instances' },
                { label: instance.name },
              ]}
            />
          }
          actions={
            <TopBarAction
              icon={<IconBell size={16} stroke={1.5} />}
              aria-label="Notifications"
              badge={true}
            />
          }
        />

        {/* Page Content */}
        <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
          <VStack gap={6} className="min-w-[1176px]">
            {/* Instance Header Card */}
            <DetailHeader>
              <DetailHeader.Title>{instance.name}</DetailHeader.Title>
              
              <DetailHeader.Actions>
                <Button variant="secondary" size="sm" leftIcon={<IconTerminal2 size={12} />}>
                  Console
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
                  Start
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconPlayerStop size={12} />}>
                  Stop
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>
                  Reboot
                </Button>
                <Button variant="secondary" size="sm" leftIcon={<IconTrash size={12} />}>
                  Delete
                </Button>
                <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
                  More Actions
                </Button>
              </DetailHeader.Actions>

              <DetailHeader.InfoGrid>
                <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                <DetailHeader.InfoCard label="ID" value={instance.id} copyable />
                <DetailHeader.InfoCard label="Host" value={instance.host} />
                <DetailHeader.InfoCard label="Created At" value={instance.createdAt} />
              </DetailHeader.InfoGrid>
            </DetailHeader>

            {/* Instance Tabs */}
            <div className="w-full">
              <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
                <TabList>
                  <Tab value="details">Details</Tab>
                  <Tab value="volumes">Volumes</Tab>
                  <Tab value="interfaces">Interfaces</Tab>
                  <Tab value="floating-ips">Floating IPs</Tab>
                  <Tab value="security">Security</Tab>
                  <Tab value="snapshots">Instance Snapshots</Tab>
                  <Tab value="monitoring">Monitoring</Tab>
                  <Tab value="resource-map">Resource Map</Tab>
                  <Tab value="logs">Logs</Tab>
                  <Tab value="action-logs">Action Logs</Tab>
                </TabList>

                {/* Details Tab Panel */}
                <TabPanel value="details">
                  <VStack gap={4} className="pt-6">
                    {/* Basic Information */}
                    <SectionCard>
                      <SectionCard.Header 
                        title="Basic Information" 
                        actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={16} />}>Edit</Button>}
                      />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Instance Name" value={instance.name} />
                        <SectionCard.DataRow label="Availability Zone" value={instance.availabilityZone} />
                        <SectionCard.DataRow label="Description" value={instance.description} />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Flavor */}
                    <SectionCard>
                      <SectionCard.Header title="Flavor" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Flavor Name" 
                          value={instance.flavor.name} 
                          isLink 
                          linkHref="/flavors" 
                        />
                        <SectionCard.DataRow 
                          label="Spec" 
                          value={`vCPU : ${instance.flavor.vcpu} / RAM : ${instance.flavor.ram} / Disk : ${instance.flavor.disk} / GPU : ${instance.flavor.gpu}`} 
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Image */}
                    <SectionCard>
                      <SectionCard.Header title="Image" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Image" 
                          value={instance.image} 
                          isLink 
                          linkHref="/images" 
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Network */}
                    <SectionCard>
                      <SectionCard.Header title="Network" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Interfaces" 
                          value={`${instance.interfaces} connected`} 
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Authentication */}
                    <SectionCard>
                      <SectionCard.Header title="Authentication" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Key Pair" 
                          value={instance.keyPair} 
                          isLink 
                          linkHref="/key-pairs" 
                        />
                      </SectionCard.Content>
                    </SectionCard>

                    {/* Advanced */}
                    <SectionCard>
                      <SectionCard.Header title="Advanced" />
                      <SectionCard.Content>
                        <SectionCard.DataRow 
                          label="Server Group" 
                          value={instance.serverGroup} 
                          isLink 
                          linkHref="/server-groups" 
                        />
                        <SectionCard.DataRow 
                          label="User Data" 
                          value={instance.userData} 
                          isLink 
                          linkHref="#" 
                        />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>
                </TabPanel>

                {/* Volumes Tab Panel */}
                <TabPanel value="volumes" className="pt-0">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                        Volumes
                      </h2>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Attach Volume
                      </Button>
                    </div>

                    {/* Search */}
                    <SearchInput
                      placeholder="Find volume with filters"
                      size="sm"
                      className="w-[280px]"
                    />

                    {/* Pagination */}
                    <Pagination
                      currentPage={1}
                      totalPages={1}
                      totalItems={10}
                      onPageChange={() => {}}
                      showSettings
                      onSettingsClick={() => setIsPreferencesOpen(true)}
                    />

                    {/* Table */}
                    <Table
                      columns={[
                        {
                          key: 'status',
                          label: 'Status',
                          width: '60px',
                          align: 'center',
                          render: (_, row: AttachedVolume) => (
                            <StatusIndicator status={row.status as any} layout="icon-only" />
                          ),
                        },
                        {
                          key: 'name',
                          label: 'Name',
                          sortable: true,
                          render: (value: string, row: AttachedVolume) => (
                            <Link
                              to={`/volumes/${row.id}`}
                              className="flex items-center gap-1.5 text-[var(--color-action-primary)] hover:underline"
                            >
                              {value}
                              <IconExternalLink size={12} />
                            </Link>
                          ),
                        },
                        {
                          key: 'size',
                          label: 'Size',
                          sortable: true,
                        },
                        {
                          key: 'type',
                          label: 'Type',
                          sortable: true,
                        },
                        {
                          key: 'diskTag',
                          label: 'Disk Tag',
                          sortable: true,
                        },
                        {
                          key: 'bootable',
                          label: 'Bootable',
                          render: (value: boolean) => (value ? 'Yes' : 'No'),
                        },
                        {
                          key: 'access',
                          label: 'Access',
                          sortable: true,
                        },
                        {
                          key: 'action',
                          label: 'Action',
                          width: '72px',
                          align: 'center',
                          render: () => (
                            <button className="p-1.5 rounded hover:bg-[var(--color-surface-subtle)] transition-colors">
                              <IconDotsCircleHorizontal size={16} stroke={1} className="text-[var(--color-text-default)]" />
                            </button>
                          ),
                        },
                      ]}
                      data={mockAttachedVolumes}
                      rowKey="id"
                    />
                  </VStack>
                </TabPanel>

                {/* Interfaces Tab Panel */}
                <TabPanel value="interfaces" className="pt-0">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                        Interfaces
                      </h2>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Attach Interface
                      </Button>
                    </div>

                    {/* Search */}
                    <SearchInput placeholder="Find Interface with filters" size="sm" className="w-[280px]" />

                    {/* Pagination */}
                    <Pagination
                      currentPage={interfaceCurrentPage}
                      totalPages={interfaceTotalPages}
                      onPageChange={setInterfaceCurrentPage}
                      totalItems={mockAttachedInterfaces.length}
                      showSettings
                      onSettingsClick={() => setIsPreferencesOpen(true)}
                    />

                    {/* Table */}
                    <Table
                      columns={[
                        {
                          key: 'network',
                          label: 'Network',
                          sortable: true,
                          render: (_value: string, iface: AttachedInterface) => (
                            <Link 
                              to={`/networks/${iface.id}`}
                              className="flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {iface.network}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          ),
                        },
                        {
                          key: 'port',
                          label: 'Port',
                          sortable: true,
                          render: (_value: string, iface: AttachedInterface) => (
                            <Link 
                              to={`/ports/${iface.port}`}
                              className="flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {iface.port}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          ),
                        },
                        {
                          key: 'portStatus',
                          label: 'Port Status',
                          render: (_value: string, iface: AttachedInterface) => (
                            <span className="text-[var(--color-text-default)]">{iface.portStatus}</span>
                          ),
                        },
                        {
                          key: 'fixedIp',
                          label: 'Fixed IP',
                          render: (_value: string, iface: AttachedInterface) => (
                            <span className="text-[var(--color-text-default)]">{iface.fixedIp}</span>
                          ),
                        },
                        {
                          key: 'macAddress',
                          label: 'Mac Address',
                          render: (_value: string, iface: AttachedInterface) => (
                            <span className="text-[var(--color-text-default)]">{iface.macAddress}</span>
                          ),
                        },
                        {
                          key: 'action',
                          label: 'Action',
                          width: '72px',
                          align: 'center' as const,
                          render: () => (
                            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-subtle)] transition-colors">
                              <IconDotsCircleHorizontal size={16} stroke={1} className="text-[var(--color-text-default)]" />
                            </button>
                          ),
                        },
                      ]}
                      data={mockAttachedInterfaces.slice((interfaceCurrentPage - 1) * interfaceRowsPerPage, interfaceCurrentPage * interfaceRowsPerPage)}
                      rowKey="id"
                    />
                  </VStack>
                </TabPanel>

                {/* Floating IPs Tab Panel */}
                <TabPanel value="floating-ips" className="pt-0">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                        Floating IPs
                      </h2>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Associate Floating IP
                      </Button>
                    </div>

                    {/* Search */}
                    <SearchInput placeholder="Find Floating IP with filters" size="sm" className="w-[280px]" />

                    {/* Pagination */}
                    <Pagination
                      currentPage={floatingIpCurrentPage}
                      totalPages={floatingIpTotalPages}
                      onPageChange={setFloatingIpCurrentPage}
                      totalItems={mockFloatingIPs.length}
                      showSettings
                      onSettingsClick={() => setIsPreferencesOpen(true)}
                    />

                    {/* Table */}
                    <Table
                      columns={[
                        {
                          key: 'status',
                          label: 'Status',
                          width: '59px',
                          render: (_value: string, row: FloatingIP) => (
                            <StatusIndicator status={row.status} layout="icon-only" size="md" />
                          ),
                        },
                        {
                          key: 'name',
                          label: 'ID',
                          sortable: true,
                          render: (_value: string, row: FloatingIP) => (
                            <Link 
                              to={`/floating-ips/${row.id}`}
                              className="flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {row.name}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          ),
                        },
                        {
                          key: 'floatingIp',
                          label: 'Floating IP',
                          sortable: true,
                        },
                        {
                          key: 'fixedIp',
                          label: 'Fixed IP',
                          sortable: true,
                        },
                        {
                          key: 'createdAt',
                          label: 'Created At',
                          sortable: true,
                        },
                        {
                          key: 'action',
                          label: 'Action',
                          width: '72px',
                          align: 'center',
                          render: () => (
                            <Button variant="tertiary" size="sm" iconOnly icon={<IconDotsCircleHorizontal size={16} stroke={1} />} aria-label="Actions" />
                          ),
                        },
                      ]}
                      data={mockFloatingIPs.slice((floatingIpCurrentPage - 1) * floatingIpRowsPerPage, floatingIpCurrentPage * floatingIpRowsPerPage)}
                      rowKey="id"
                    />
                  </VStack>
                </TabPanel>

                {/* Security Tab Panel */}
                <TabPanel value="security" className="pt-0">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold leading-6 text-[var(--color-text-default)]">
                        Security Groups
                      </h2>
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Attach Security Group
                      </Button>
                    </div>

                    {/* Network Interface Toggle */}
                    <div className="inline-flex items-center gap-1 p-1 h-10 bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] rounded-lg w-fit">
                      {mockNetworkInterfaces.map((net) => (
                        <button
                          key={net.id}
                          onClick={() => setSelectedNetworkInterface(net.id)}
                          className={`
                            flex items-center justify-center min-w-[80px] px-3 h-8 rounded-md
                            text-[12px] font-medium leading-4 text-[var(--color-text-default)]
                            transition-colors
                            ${selectedNetworkInterface === net.id 
                              ? 'bg-[var(--color-surface-default)] border border-[var(--color-action-primary)]' 
                              : 'hover:bg-[var(--color-surface-default)]'
                            }
                          `}
                        >
                          {net.name}({net.ip})
                        </button>
                      ))}
                    </div>

                    {/* Search */}
                    <SearchInput placeholder="Find Security Group with filters" size="sm" className="w-[280px]" />

                    {/* Pagination */}
                    <Pagination
                      currentPage={securityCurrentPage}
                      totalPages={securityTotalPages}
                      onPageChange={setSecurityCurrentPage}
                      totalItems={mockSecurityGroups.length}
                      showSettings
                      onSettingsClick={() => setIsPreferencesOpen(true)}
                    />

                    {/* Table */}
                    <Table
                      columns={[
                        {
                          key: 'name',
                          label: 'Security Group',
                          sortable: true,
                          render: (_value: string, row: SecurityGroup) => (
                            <Link 
                              to={`/security-groups/${row.id}`}
                              className="flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {row.name}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          ),
                        },
                        {
                          key: 'description',
                          label: 'Description',
                          sortable: true,
                        },
                        {
                          key: 'action',
                          label: 'Action',
                          width: '72px',
                          align: 'center' as const,
                          render: () => (
                            <Button variant="tertiary" size="sm" iconOnly icon={<IconDotsCircleHorizontal size={16} stroke={1} />} aria-label="Actions" />
                          ),
                        },
                      ]}
                      data={mockSecurityGroups.slice((securityCurrentPage - 1) * securityRowsPerPage, securityCurrentPage * securityRowsPerPage)}
                      rowKey="id"
                    />
                  </VStack>
                </TabPanel>

                {/* Instance Snapshots Tab Panel */}
                <TabPanel value="snapshots">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full">
                      <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">Instance Snapshots</h2>
                      <Button variant="secondary" size="sm">
                        <IconCirclePlus size={12} />
                        Create Snapshot
                      </Button>
                    </div>

                    {/* Search and Download */}
                    <div className="flex items-center gap-1">
                      <SearchInput
                        placeholder="Find Instance Snapshot with filters"
                        value={snapshotSearchQuery}
                        onChange={(e) => {
                          setSnapshotSearchQuery(e.target.value);
                          setSnapshotCurrentPage(1);
                        }}
                        className="w-[280px]"
                      />
                    </div>

                    {/* Pagination */}
                    <Pagination
                      currentPage={snapshotCurrentPage}
                      totalPages={snapshotTotalPages}
                      onPageChange={setSnapshotCurrentPage}
                      totalItems={filteredSnapshots.length}
                      showSettings
                      onSettingsClick={() => setIsPreferencesOpen(true)}
                    />

                    {/* Table */}
                    <Table<InstanceSnapshot>
                      columns={[
                        {
                          key: 'status',
                          label: 'Status',
                          width: '60px',
                          align: 'center',
                          render: (_value: string, row: InstanceSnapshot) => (
                            <StatusIndicator 
                              status={row.status === 'active' ? 'active' : row.status === 'queued' ? 'building' : row.status === 'saving' ? 'building' : 'error'} 
                              layout="icon-only"
                            />
                          ),
                        },
                        {
                          key: 'name',
                          label: 'Name',
                          sortable: true,
                          render: (_value: string, row: InstanceSnapshot) => (
                            <Link 
                              to={`/instance-snapshots/${row.id}`}
                              className="flex items-center gap-1.5 font-medium text-[var(--color-action-primary)] hover:underline"
                            >
                              {row.name}
                              <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                            </Link>
                          ),
                        },
                        {
                          key: 'size',
                          label: 'Size',
                          sortable: true,
                        },
                        {
                          key: 'diskFormat',
                          label: 'Disk Format',
                          sortable: true,
                        },
                        {
                          key: 'createdAt',
                          label: 'Created At',
                          sortable: true,
                        },
                        {
                          key: 'action',
                          label: 'Action',
                          width: '72px',
                          align: 'center',
                          render: () => (
                            <Button variant="tertiary" size="sm" iconOnly icon={<IconDotsCircleHorizontal size={16} stroke={1} />} aria-label="Actions" />
                          ),
                        },
                      ]}
                      data={filteredSnapshots.slice((snapshotCurrentPage - 1) * snapshotRowsPerPage, snapshotCurrentPage * snapshotRowsPerPage)}
                      rowKey="id"
                      emptyMessage="No instance snapshots found"
                    />
                  </VStack>
                </TabPanel>

                {/* Monitoring Tab Panel */}
                <TabPanel value="monitoring">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center h-7">
                      <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">Console Logs</h2>
                    </div>

                    {/* Log Length Container */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md w-full">
                      {/* Left side - Log Length */}
                      <div className="flex items-center gap-3">
                        <span className="text-[14px] font-medium text-[var(--color-text-default)]">Log Length</span>
                        <div className="flex items-center gap-1">
                          {/* Number Input with Spinner */}
                          <div className="flex items-center justify-between w-20 h-8 px-2.5 py-1 bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-md">
                            <span className="text-[12px] text-[var(--color-text-default)]">{logLength}</span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => setLogLength(prev => prev + 1)}
                                className="text-[var(--color-text-default)] hover:text-[var(--color-action-primary)]"
                              >
                                <IconChevronUp size={12} stroke={1} />
                              </button>
                              <button
                                onClick={() => setLogLength(prev => Math.max(1, prev - 1))}
                                className="text-[var(--color-text-default)] hover:text-[var(--color-action-primary)]"
                              >
                                <IconChevronDown size={12} stroke={1} />
                              </button>
                            </div>
                          </div>
                          {/* Search Button */}
                          <Button variant="secondary" size="sm" className="!p-2 !w-8 !h-8 !min-w-8 text-[var(--color-text-default)]">
                            <IconSearch size={16} stroke={1} />
                          </Button>
                        </div>
                      </div>

                      {/* Right side - View Full Log */}
                      <div className="flex items-center gap-1">
                        <Button variant="secondary" size="sm" className="text-[var(--color-text-default)]">
                          <IconTerminal2 size={14} stroke={1} />
                          View Full Log
                        </Button>
                        <Button variant="secondary" size="sm" className="!p-2 !w-8 !h-8 !min-w-8 text-[var(--color-text-default)]">
                          <IconDownload size={18} stroke={1} className="w-[14px]" />
                        </Button>
                      </div>
                    </div>

                    {/* Console Area */}
                    <div className="w-full flex-1 min-h-[500px] bg-[#0F172A] border border-[var(--color-border-default)] rounded-lg p-6 overflow-auto">
                      <pre className="font-mono text-[13px] leading-[22px] text-[#e2e8f0] whitespace-pre-wrap">
{`[    0.000000] Linux version 5.15.0-107-cloud (buildd@ubuntu) (gcc 11.3.0) #119-Ubuntu SMP Thu Sep 5 10:10:10 UTC 2025
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
[   10.000000] *** NOTICE: Unauthorized access to this system is prohibited. ***`}
                      </pre>
                    </div>
                  </VStack>
                </TabPanel>

                {/* Resource Map Tab Panel */}
                <TabPanel value="resource-map">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Resource Map content will be displayed here.</p>
                  </div>
                </TabPanel>

                {/* Logs Tab Panel */}
                <TabPanel value="logs">
                  <div className="pt-6">
                    <p className="text-[var(--color-text-subtle)]">Logs content will be displayed here.</p>
                  </div>
                </TabPanel>

                {/* Action Logs Tab Panel */}
                <TabPanel value="action-logs">
                  <VStack gap={3} className="pt-6">
                    {/* Header */}
                    <div className="flex items-center h-7">
                      <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">Action Logs</h2>
                    </div>

                    {/* Search and Download */}
                    <div className="flex items-center gap-1">
                      <SearchInput
                        placeholder="Find Action Logs with filters"
                        value={actionLogSearchQuery}
                        onChange={(e) => {
                          setActionLogSearchQuery(e.target.value);
                          setActionLogCurrentPage(1);
                        }}
                        className="w-[280px]"
                      />
                      <Button variant="secondary" size="sm" className="!p-2 !w-7 !h-7 !min-w-7">
                        <IconDownload size={12} stroke={1} className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Pagination */}
                    <Pagination
                      currentPage={actionLogCurrentPage}
                      totalPages={actionLogTotalPages}
                      onPageChange={setActionLogCurrentPage}
                      totalItems={filteredActionLogs.length}
                      showSettings
                      onSettingsClick={() => setIsPreferencesOpen(true)}
                    />

                    {/* Action Logs Table */}
                    <div className="w-full flex flex-col gap-1">
                      {/* Table Header */}
                      <div className="flex items-start bg-[var(--table-header-bg)] border border-[var(--color-border-default)] rounded-md">
                        <div className="flex-1 flex items-center h-10 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-[var(--color-text-default)]">Operation Name</span>
                            <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-default)]" />
                          </div>
                        </div>
                        <div className="flex-1 flex items-center h-10 px-3 border-l border-[var(--color-border-default)]">
                          <span className="text-[11px] font-medium text-[var(--color-text-default)]">Request ID</span>
                        </div>
                        <div className="flex-1 flex items-center h-10 px-3 border-l border-[var(--color-border-default)]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-[var(--color-text-default)]">Requested Time</span>
                            <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-default)]" />
                          </div>
                        </div>
                      </div>

                      {/* Table Rows */}
                      {filteredActionLogs
                        .slice((actionLogCurrentPage - 1) * actionLogRowsPerPage, actionLogCurrentPage * actionLogRowsPerPage)
                        .map((log) => {
                          const isExpanded = expandedLogIds.has(log.id);
                          return (
                            <div
                              key={log.id}
                              className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md"
                            >
                              {/* Main Row */}
                              <div className="flex items-center w-full">
                                <div className="flex-1 flex items-center gap-2 min-h-[40px] px-3 py-2">
                                  <button
                                    onClick={() => toggleLogExpansion(log.id)}
                                    className="p-0.5 hover:bg-[var(--color-surface-subtle)] rounded transition-colors"
                                  >
                                    {isExpanded ? (
                                      <IconChevronDown size={12} stroke={1} className="text-[var(--color-text-default)]" />
                                    ) : (
                                      <IconChevronRight size={12} stroke={1} className="text-[var(--color-text-default)]" />
                                    )}
                                  </button>
                                  <span className="text-[12px] text-[var(--color-text-default)]">{log.operationName}</span>
                                </div>
                                <div className="flex-1 flex items-center gap-1.5 min-h-[40px] px-3 py-2">
                                  <span className="text-[12px] text-[var(--color-text-default)]">{log.requestId}</span>
                                  <button
                                    onClick={() => copyToClipboard(log.requestId)}
                                    className="p-0.5 hover:bg-[var(--color-surface-subtle)] rounded transition-colors"
                                  >
                                    <IconCopy size={12} stroke={1} className="text-[var(--color-action-primary)]" />
                                  </button>
                                </div>
                                <div className="flex-1 flex items-center min-h-[40px] px-3 py-2">
                                  <span className="text-[12px] text-[var(--color-text-default)]">{log.requestedTime}</span>
                                </div>
                              </div>

                              {/* Expanded Details */}
                              {isExpanded && (
                                <div className="flex items-center gap-4 min-h-[40px] px-8 py-2 border-t border-[var(--color-border-default)]">
                                  <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-default)]">
                                    <span className="font-medium">Result :</span>
                                    <span>{log.result}</span>
                                  </div>
                                  <div className="w-px h-3 bg-[var(--color-border-default)]" />
                                  <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-default)]">
                                    <span className="font-medium">Start Time :</span>
                                    <span>{log.startTime}</span>
                                  </div>
                                  <div className="w-px h-3 bg-[var(--color-border-default)]" />
                                  <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-default)]">
                                    <span className="font-medium">End Time :</span>
                                    <span>{log.endTime}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </VStack>
                </TabPanel>
              </Tabs>
            </div>
          </VStack>
        </div>
      </main>
    </div>
  );
}

export default InstanceDetailPage;

