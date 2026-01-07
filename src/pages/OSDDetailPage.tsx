import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  Chip,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  DetailHeader,
  DetailHeaderTitle,
  DetailHeaderInfoCard,
  SectionCard,
  SectionCardHeader,
  SectionCardContent,
  SectionCardDataRow,
  SearchInput,
  Pagination,
  Table,
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface OSDData {
  id: number;
  host: string;
  status: ('in' | 'up' | 'out' | 'down')[];
  deviceClass: 'hdd' | 'ssd' | 'nvme';
  pgs: number;
  size: string;
  flags: string;
  usage: number;
}

interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  daemons: string[];
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockOSDs: Record<number, OSDData> = {
  1: {
    id: 1,
    host: 'bzv2krt1-ceph',
    status: ['in', 'up'],
    deviceClass: 'hdd',
    pgs: 153,
    size: '2.9 GiB',
    flags: '-',
    usage: 88.17,
  },
  2: {
    id: 2,
    host: 'bzv2krt1-ceph',
    status: ['in', 'up'],
    deviceClass: 'hdd',
    pgs: 153,
    size: '2.9 GiB',
    flags: '-',
    usage: 88.17,
  },
  3: {
    id: 3,
    host: 'bzv2krt1-ceph',
    status: ['in', 'up'],
    deviceClass: 'hdd',
    pgs: 153,
    size: '2.9 GiB',
    flags: '-',
    usage: 88.17,
  },
  4: {
    id: 4,
    host: 'bzv2krt2-ceph',
    status: ['in', 'up'],
    deviceClass: 'ssd',
    pgs: 200,
    size: '4.5 GiB',
    flags: '-',
    usage: 72.5,
  },
  5: {
    id: 5,
    host: 'bzv2krt2-ceph',
    status: ['out', 'down'],
    deviceClass: 'ssd',
    pgs: 0,
    size: '4.5 GiB',
    flags: 'noout',
    usage: 0,
  },
  6: {
    id: 6,
    host: 'bzv2krt3-ceph',
    status: ['in', 'up'],
    deviceClass: 'nvme',
    pgs: 312,
    size: '8.2 GiB',
    flags: '-',
    usage: 45.8,
  },
};

const mockDevices: Device[] = [
  {
    id: '1',
    deviceId: '9350-16i_LOGICAL_VOLUME_L9HF55E012A',
    deviceName: 'sda',
    daemons: ['osd.5', 'osd.4', 'osd.6'],
  },
  {
    id: '2',
    deviceId: '9350-16i_LOGICAL_VOLUME_L9HF55E012A',
    deviceName: 'sdc',
    daemons: ['osd.5', 'osd.4', 'osd.6'],
  },
  {
    id: '3',
    deviceId: 'LENOVO_MG09SCA14TE_2540A00MF2AJ',
    deviceName: 'sda',
    daemons: ['osd.5', 'osd.4', 'osd.6'],
  },
  {
    id: '4',
    deviceId: 'LENOVO_MG09SCA14TE_2540A00MF2AJ',
    deviceName: 'sdc',
    daemons: ['osd.5', 'osd.6'],
  },
  {
    id: '5',
    deviceId: 'LENOVO_MG09SCA14TE_2540A00MF2AJ',
    deviceName: 'sdd',
    daemons: ['osd.5'],
  },
];

/* ----------------------------------------
   Device Health Data
   ---------------------------------------- */

interface DeviceHealth {
  id: string;
  name: string;
  serialNumber: string;
  modelNumber: string;
  firmwareVersion: string;
  totalCapacity: string;
  smartctlOutput: string;
}

const mockDeviceHealthList: DeviceHealth[] = [
  {
    id: '1',
    name: '/dev/sdf',
    serialNumber: 'L9HF55E012A',
    modelNumber: 'KIOXIA KCD8DPUG3T20',
    firmwareVersion: '1XET7105',
    totalCapacity: '3,200,631,791,616 [3.20 TB]',
    smartctlOutput: `"smartctl_output": [
            "smartctl 7.2 2020-12-30 r5155 [x86_64-linux-6.8.0-79-generic] (local build)",
            "Copyright (C) 2002-20, Bruce Allen, Christian Franke, www.smartmontools.org",
            "",
            "=== START OF INFORMATION SECTION ===",
            "Model Number:                       KIOXIA KCD8DPUG3T20",
            "Serial Number:                      9ET0A01K0AN6",
            "Firmware Version:                   1XET7105",
            "PCI Vendor/Subsystem ID:            0x1e0f",
            "IEEE OUI Identifier:                0x8ce38e",
            "Total NVM Capacity:                 3,200,631,791,616 [3.20 TB]",
            "Unallocated NVM Capacity:           0",
            "Controller ID:                      1",
            "NVMe Version:                       2.0",
            "Number of Namespaces:               64",
            "Namespace 1 Size/Capacity:          3,200,631,791,616 [3.20 TB]",
            "Namespace 1 Utilization:            3,200,626,515,968 [3.20 TB]",
            "Namespace 1 Formatted LBA Size:     512",
            "Namespace 1 IEEE EUI-64:            8ce38e e3049580e8",
            "Local Time is:                      Tue Dec 16 01:00:01 2025 UTC",
            "Firmware Updates (0x16):            3 Slots, no Reset required"`,
  },
  {
    id: '2',
    name: '/dev/sda',
    serialNumber: '2540A00MF2AJ',
    modelNumber: 'LENOVO MG09SCA14TE',
    firmwareVersion: '2.1.0',
    totalCapacity: '14,000,519,643,136 [14.0 TB]',
    smartctlOutput: `"smartctl_output": [
            "smartctl 7.2 2020-12-30 r5155 [x86_64-linux-6.8.0-79-generic] (local build)",
            "Copyright (C) 2002-20, Bruce Allen, Christian Franke, www.smartmontools.org",
            "",
            "=== START OF INFORMATION SECTION ===",
            "Model Number:                       LENOVO MG09SCA14TE",
            "Serial Number:                      2540A00MF2AJ"`,
  },
  {
    id: '3',
    name: '/dev/sdb',
    serialNumber: '2540A00MF2AK',
    modelNumber: 'LENOVO MG09SCA14TE',
    firmwareVersion: '2.1.0',
    totalCapacity: '14,000,519,643,136 [14.0 TB]',
    smartctlOutput: `"smartctl_output": []`,
  },
];

/* ----------------------------------------
   Daemons Cell Component
   ---------------------------------------- */

interface DaemonsCellProps {
  daemons: string[];
}

function DaemonsCell({ daemons }: DaemonsCellProps) {
  return (
    <div className="flex gap-0.5 flex-wrap">
      {daemons.map((daemon, index) => (
        <Chip key={index} value={daemon} />
      ))}
    </div>
  );
}

/* ----------------------------------------
   OSD Detail Page
   ---------------------------------------- */

export function OSDDetailPage() {
  const { id } = useParams<{ id: string }>();
  const osdId = parseInt(id || '1', 10);
  const osd = mockOSDs[osdId] || mockOSDs[1];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
  const [deviceCurrentPage, setDeviceCurrentPage] = useState(1);
  const deviceRowsPerPage = 10;
  
  // Device health tab state
  const [selectedHealthDevice, setSelectedHealthDevice] = useState(mockDeviceHealthList[0]);
  const [healthSubTab, setHealthSubTab] = useState<'device-info' | 'smart'>('device-info');

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter devices based on search
  const filteredDevices = useMemo(() =>
    mockDevices.filter((device) =>
      device.deviceId.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
      device.deviceName.toLowerCase().includes(deviceSearchQuery.toLowerCase()) ||
      device.daemons.some(d => d.toLowerCase().includes(deviceSearchQuery.toLowerCase()))
    ), [deviceSearchQuery]
  );

  const deviceTotalPages = Math.ceil(filteredDevices.length / deviceRowsPerPage);

  // Get paginated devices
  const paginatedDevices = useMemo(() => {
    const start = (deviceCurrentPage - 1) * deviceRowsPerPage;
    return filteredDevices.slice(start, start + deviceRowsPerPage);
  }, [filteredDevices, deviceCurrentPage, deviceRowsPerPage]);

  // Device table columns
  const deviceColumns: TableColumn<Device>[] = [
    {
      key: 'deviceId',
      label: 'Device ID',
      flex: 1,
      sortable: true,
    },
    {
      key: 'deviceName',
      label: 'Device Name',
      flex: 1,
      sortable: true,
    },
    {
      key: 'daemons',
      label: 'Daemons',
      flex: 1,
      sortable: false,
      render: (_, row) => <DaemonsCell daemons={row.daemons} />,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[200px]' : 'left-0'}`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            showAddButton={true}
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
                  { label: 'Home', href: '/storage' },
                  { label: 'OSDs', href: '/storage/osds' },
                  { label: `OSD.${osd.id}` },
                ]}
              />
            }
            actions={
              <TopBarAction
                icon={<IconBell size={16} stroke={1.5} />}
                aria-label="Notifications"
              />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]">
            <div className="flex flex-col items-stretch justify-start gap-6 min-w-[1176px] max-w-[1320px]">
              {/* OSD Header Card */}
              <DetailHeader>
                <DetailHeaderTitle>{osd.host}</DetailHeaderTitle>
                <div className="flex gap-2 w-full">
                  <DetailHeaderInfoCard 
                    label="Status" 
                    value={
                      <div className="flex gap-0.5">
                        {osd.status.map((s, index) => (
                          <Chip
                            key={index}
                            value={s}
                          />
                        ))}
                      </div>
                    }
                    status={osd.status.includes('up') ? 'active' : 'error'}
                  />
                  <DetailHeaderInfoCard 
                    label="ID" 
                    value={String(osd.id)}
                  />
                </div>
              </DetailHeader>

              {/* Tabs Section */}
              <div className="w-full">
                <Tabs value={activeTab} onChange={setActiveTab}>
                  <TabList>
                    <Tab value="details">Details</Tab>
                    <Tab value="devices">Devices</Tab>
                    <Tab value="device-health">Device health</Tab>
                    <Tab value="performance">Performance</Tab>
                  </TabList>

                  {/* Details Tab */}
                  <TabPanel value="details" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      {/* Basic Information */}
                      <SectionCard>
                        <SectionCardHeader
                          title="Basic Information"
                        />
                        <SectionCardContent>
                          <SectionCardDataRow label="Device class" showDivider={false}>
                            <Chip value={osd.deviceClass} />
                          </SectionCardDataRow>
                          <SectionCardDataRow label="PGs" value={String(osd.pgs)} />
                          <SectionCardDataRow label="Size" value={osd.size} />
                          <SectionCardDataRow label="Flags" value={osd.flags} />
                          <SectionCardDataRow label="Usage" value={`${osd.usage}%`} />
                        </SectionCardContent>
                      </SectionCard>
                    </VStack>
                  </TabPanel>

                  {/* Devices Tab */}
                  <TabPanel value="devices" className="pt-0">
                    <VStack gap={3} className="pt-4">
                      {/* Section Header */}
                      <div className="flex items-center h-7">
                        <h2 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                          Devices
                        </h2>
                      </div>

                      {/* Search */}
                      <div className="flex items-center gap-1">
                        <div className="w-[280px]">
                          <SearchInput
                            placeholder="Find instance with filters"
                            value={deviceSearchQuery}
                            onChange={(e) => setDeviceSearchQuery(e.target.value)}
                            onClear={() => setDeviceSearchQuery('')}
                            size="sm"
                            fullWidth
                          />
                        </div>
                        <div className="w-px h-4 bg-[var(--color-border-default)]" />
                      </div>

                      {/* Pagination */}
                      {filteredDevices.length > 0 && (
                        <Pagination
                          currentPage={deviceCurrentPage}
                          totalPages={deviceTotalPages}
                          onPageChange={setDeviceCurrentPage}
                          totalItems={filteredDevices.length}
                          itemsPerPage={deviceRowsPerPage}
                          showItemCount
                        />
                      )}

                      {/* Devices Table */}
                      <Table<Device>
                        columns={deviceColumns}
                        data={paginatedDevices}
                        rowKey="id"
                        emptyMessage="No devices found"
                      />
                    </VStack>
                  </TabPanel>

                  {/* Device Health Tab */}
                  <TabPanel value="device-health" className="pt-0">
                    <div className="flex gap-4 pt-4">
                      {/* Device List Sidebar */}
                      <div className="w-[224px] shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-3">
                        <h3 className="text-[14px] font-medium text-[var(--color-text-default)] mb-3">
                          Device health
                        </h3>
                        <div className="flex flex-col">
                          {mockDeviceHealthList.map((device) => (
                            <button
                              key={device.id}
                              onClick={() => setSelectedHealthDevice(device)}
                              className={`
                                text-left px-2.5 py-[7px] rounded text-[12px] font-medium truncate
                                transition-colors duration-[var(--duration-fast)]
                                ${selectedHealthDevice.id === device.id
                                  ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)]'
                                  : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)]'
                                }
                              `}
                            >
                              {device.name} ({device.serialNumber})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Device Details */}
                      <div className="flex-1 flex flex-col gap-3 min-w-0">
                        {/* Selected Device Header */}
                        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">
                          {selectedHealthDevice.name} ({selectedHealthDevice.serialNumber})
                        </h2>

                        {/* Sub-tab Switcher */}
                        <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-md p-1 flex gap-2">
                          <button
                            onClick={() => setHealthSubTab('device-info')}
                            className={`
                              flex-1 py-2.5 px-4 rounded-md text-[14px] font-medium text-center
                              transition-colors duration-[var(--duration-fast)]
                              ${healthSubTab === 'device-info'
                                ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                                : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)]'
                              }
                            `}
                          >
                            Device information
                          </button>
                          <button
                            onClick={() => setHealthSubTab('smart')}
                            className={`
                              flex-1 py-2.5 px-4 rounded-md text-[14px] font-medium text-center
                              transition-colors duration-[var(--duration-fast)]
                              ${healthSubTab === 'smart'
                                ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                                : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)]'
                              }
                            `}
                          >
                            SMART
                          </button>
                        </div>

                        {/* Content based on sub-tab */}
                        <SectionCard>
                          <SectionCardHeader title="Device Information" />
                          <SectionCardContent>
                            <SectionCardDataRow label="Model Number" value={selectedHealthDevice.modelNumber} showDivider={false} />
                            <SectionCardDataRow label="Serial Number" value={selectedHealthDevice.serialNumber} />
                            <SectionCardDataRow label="Firmware Version" value={selectedHealthDevice.firmwareVersion} />
                            <SectionCardDataRow label="Total Capacity" value={selectedHealthDevice.totalCapacity} />
                            
                            {/* smartctl output */}
                            <div className="pt-3 mt-3 border-t border-[var(--color-border-default)]">
                              <p className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-1.5">
                                smartctl output
                              </p>
                              <div className="bg-[var(--color-surface-contrast)] rounded-md p-4 overflow-x-auto max-h-[280px] overflow-y-auto">
                                <pre className="text-[12px] leading-[18px] text-white font-mono whitespace-pre-wrap break-all">
                                  {selectedHealthDevice.smartctlOutput}
                                </pre>
                              </div>
                            </div>
                          </SectionCardContent>
                        </SectionCard>
                      </div>
                    </div>
                  </TabPanel>

                  {/* Performance Tab */}
                  <TabPanel value="performance" className="pt-0">
                    <VStack gap={4} className="pt-4">
                      <SectionCard>
                        <SectionCardHeader title="Performance" />
                        <SectionCardContent>
                          <p className="text-[12px] text-[var(--color-text-muted)]">
                            No performance data available.
                          </p>
                        </SectionCardContent>
                      </SectionCard>
                    </VStack>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OSDDetailPage;

