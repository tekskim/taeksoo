import { useState, useMemo } from 'react';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
  StatusIndicator,
  Chip,
  type TableColumn,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconRefresh,
  IconBell,
  IconTrash,
  IconDownload,
} from '@tabler/icons-react';

/* ----------------------------------------
   Custom Identify Icon
   ---------------------------------------- */

interface IdentifyIconProps {
  size?: number;
  className?: string;
}

function IdentifyIcon({ size = 16, className }: IdentifyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.66699 12.0003V8.00033C4.66699 7.11627 5.01818 6.26842 5.6433 5.6433C6.26842 5.01818 7.11627 4.66699 8.00033 4.66699C8.88438 4.66699 9.73223 5.01818 10.3573 5.6433C10.9825 6.26842 11.3337 7.11627 11.3337 8.00033V12.0003"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33301 14C3.33301 14.1768 3.40325 14.3464 3.52827 14.4714C3.65329 14.5964 3.82286 14.6667 3.99967 14.6667H11.9997C12.1765 14.6667 12.3461 14.5964 12.4711 14.4714C12.5961 14.3464 12.6663 14.1768 12.6663 14V13.3333C12.6663 12.9797 12.5259 12.6406 12.2758 12.3905C12.0258 12.1405 11.6866 12 11.333 12H4.66634C4.31272 12 3.97358 12.1405 3.72353 12.3905C3.47348 12.6406 3.33301 12.9797 3.33301 13.3333V14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.333 8H13.9997" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.3333 3L12 3.33333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.33301 8H1.99967" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 1.33301V1.99967" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.28613 3.28613L3.75747 3.75747" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PhysicalDisk {
  id: string;
  status: 'available' | 'in-use' | 'error' | 'offline';
  hostname: string;
  devicePath: string;
  type: 'HDD' | 'SSD' | 'NVMe';
  vendor: string;
  model: string;
  size: string;
  osds: string[];
  identifyTimer?: number | null; // seconds remaining, null means not identifying
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockPhysicalDisks: PhysicalDisk[] = [
  {
    id: 'disk-1',
    status: 'in-use',
    hostname: 'bzv2krt1-cephadm-cl01',
    devicePath: '/dev/sda',
    type: 'HDD',
    vendor: 'LENOVO',
    model: 'MG09SCA14TE',
    size: '12.7 GiB',
    osds: ['osd.4'],
    identifyTimer: 273, // 04:33
  },
  {
    id: 'disk-2',
    status: 'available',
    hostname: 'bzv2krt1-cephadm-cl01',
    devicePath: '/dev/sdb',
    type: 'HDD',
    vendor: 'LENOVO',
    model: 'MG09SCA14TE',
    size: '12.7 GiB',
    osds: ['osd.5'],
    identifyTimer: null,
  },
  {
    id: 'disk-3',
    status: 'available',
    hostname: 'bzv2krt1-cephadm-cl01',
    devicePath: '/dev/sdc',
    type: 'HDD',
    vendor: 'LENOVO',
    model: 'MG09SCA14TE',
    size: '12.7 GiB',
    osds: ['osd.6'],
    identifyTimer: null,
  },
  {
    id: 'disk-4',
    status: 'available',
    hostname: 'bzv2krt1-cephadm-cl01',
    devicePath: '/dev/sdd',
    type: 'HDD',
    vendor: 'LENOVO',
    model: 'MG09SCA14TE',
    size: '12.7 GiB',
    osds: ['osd.15'],
    identifyTimer: null,
  },
  {
    id: 'disk-5',
    status: 'available',
    hostname: 'bzv2krt1-cephadm-cl01',
    devicePath: '/dev/sdf',
    type: 'SSD',
    vendor: '9350-16i',
    model: 'LOGICAL VOLUME',
    size: '745.2 GiB',
    osds: ['osd.4', 'osd.5', 'osd.6', 'osd.15'],
    identifyTimer: null,
  },
  {
    id: 'disk-6',
    status: 'available',
    hostname: 'bzv2krt1-cephadm-cl02',
    devicePath: '/dev/sda',
    type: 'HDD',
    vendor: 'LENOVO',
    model: 'MG09SCA14TE',
    size: '12.7 GiB',
    osds: ['osd.16'],
    identifyTimer: null,
  },
  {
    id: 'disk-7',
    status: 'available',
    hostname: 'bzv2krt1-cephadm-cl02',
    devicePath: '/dev/sdb',
    type: 'HDD',
    vendor: 'LENOVO',
    model: 'MG09SCA14TE',
    size: '12.7 GiB',
    osds: ['osd.17'],
    identifyTimer: null,
  },
  {
    id: 'disk-8',
    status: 'available',
    hostname: 'bzv2krt1-cephadm-cl02',
    devicePath: '/dev/sdc',
    type: 'HDD',
    vendor: 'LENOVO',
    model: 'MG09SCA14TE',
    size: '12.7 GiB',
    osds: ['osd.18'],
    identifyTimer: null,
  },
  {
    id: 'disk-9',
    status: 'available',
    hostname: 'bzv2krt1-cephadm-cl02',
    devicePath: '/dev/sdd',
    type: 'HDD',
    vendor: 'LENOVO',
    model: 'MG09SCA14TE',
    size: '12.7 GiB',
    osds: ['osd.19'],
    identifyTimer: null,
  },
  {
    id: 'disk-10',
    status: 'available',
    hostname: 'bzv2krt1-cephadm-cl02',
    devicePath: '/dev/sdf',
    type: 'SSD',
    vendor: '9350-16i',
    model: 'LOGICAL VOLUME',
    size: '745.2 GiB',
    osds: ['osd.16', 'osd.17', 'osd.18', 'osd.19'],
    identifyTimer: null,
  },
];

/* ----------------------------------------
   Status Cell Component
   ---------------------------------------- */

interface StatusCellProps {
  status: PhysicalDisk['status'];
}

function StatusCell({ status }: StatusCellProps) {
  const statusMap: Record<PhysicalDisk['status'], 'active' | 'error' | 'shutoff' | 'down'> = {
    'available': 'shutoff',
    'in-use': 'active',
    'error': 'error',
    'offline': 'down',
  };

  return <StatusIndicator status={statusMap[status]} />;
}

/* ----------------------------------------
   Type Cell Component
   ---------------------------------------- */

interface TypeCellProps {
  type: PhysicalDisk['type'];
}

function TypeCell({ type }: TypeCellProps) {
  return <Chip value={type} />;
}

/* ----------------------------------------
   OSDs Cell Component
   ---------------------------------------- */

interface OSDsCellProps {
  osds: string[];
}

function OSDsCell({ osds }: OSDsCellProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {osds.map((osd, index) => (
        <Chip key={index} value={osd} />
      ))}
    </div>
  );
}

/* ----------------------------------------
   Identify Cell Component
   ---------------------------------------- */

interface IdentifyCellProps {
  timer: number | null | undefined;
  onIdentify: () => void;
}

function IdentifyCell({ timer, onIdentify }: IdentifyCellProps) {
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (timer && timer > 0) {
    return (
      <div className="flex items-center gap-1">
        <IdentifyIcon size={16} className="text-[#ff851a]" />
        <span className="text-[11px] font-medium text-[#ff851a]">{formatTime(timer)}</span>
      </div>
    );
  }

  return (
    <button
      onClick={onIdentify}
      className="p-1 hover:bg-[var(--color-surface-subtle)] rounded transition-colors"
      aria-label="Identify disk"
    >
      <IdentifyIcon size={16} className="text-[var(--color-text-subtle)]" />
    </button>
  );
}

/* ----------------------------------------
   Physical Disks Page
   ---------------------------------------- */

export function PhysicalDisksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter disks based on search
  const filteredDisks = useMemo(() =>
    mockPhysicalDisks.filter((disk) =>
      disk.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disk.devicePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disk.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disk.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disk.type.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  const totalPages = Math.ceil(filteredDisks.length / rowsPerPage);
  const totalItems = filteredDisks.length;

  // Get paginated data
  const paginatedDisks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDisks.slice(start, start + rowsPerPage);
  }, [filteredDisks, currentPage, rowsPerPage]);

  // Handle identify disk
  const handleIdentify = (diskId: string) => {
    console.log('Identify disk:', diskId);
    // In real implementation, this would start the identify process
  };

  // Table columns definition
  const columns: TableColumn<PhysicalDisk>[] = [
    {
      key: 'status',
      label: 'Status',
      width: 60,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusCell status={row.status} />,
    },
    {
      key: 'hostname',
      label: 'Hostname',
      flex: 1,
      sortable: true,
    },
    {
      key: 'devicePath',
      label: 'Device path',
      flex: 1,
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 0.5,
      sortable: true,
      render: (_, row) => <TypeCell type={row.type} />,
    },
    {
      key: 'vendor',
      label: 'Vendor',
      flex: 0.8,
      sortable: true,
    },
    {
      key: 'model',
      label: 'Model',
      flex: 1,
      sortable: true,
    },
    {
      key: 'size',
      label: 'Size',
      flex: 0.6,
      sortable: true,
    },
    {
      key: 'osds',
      label: 'OSDs',
      flex: 1,
      sortable: false,
      render: (_, row) => <OSDsCell osds={row.osds} />,
    },
    {
      key: 'identify',
      label: 'Identify',
      width: 80,
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <IdentifyCell 
          timer={row.identifyTimer} 
          onIdentify={() => handleIdentify(row.id)} 
        />
      ),
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
                  { label: 'Physical Disks' },
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
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-[length:var(--font-size-16)] font-semibold text-[var(--color-text-default)]">
                  Physical Disks
                </h1>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="flex items-center gap-1">
                    <div className="w-[280px]">
                      <SearchInput
                        placeholder="Search users by attributes"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        size="sm"
                        fullWidth
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconDownload size={12} stroke={1.5} />}
                      aria-label="Download"
                    />
                  </div>
                  <div className="w-px h-4 bg-[var(--color-border-default)]" />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<IconRefresh size={16} stroke={1.5} />}
                    aria-label="Refresh"
                    onClick={() => console.log('Refresh clicked')}
                  />
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconTrash size={14} stroke={1.5} />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {filteredDisks.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showSettings
                  onSettingsClick={() => console.log('Settings clicked')}
                  totalItems={totalItems}
                />
              )}

              {/* Table */}
              <Table
                columns={columns}
                data={paginatedDisks}
                getRowId={(row) => row.id}
              />
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PhysicalDisksPage;

