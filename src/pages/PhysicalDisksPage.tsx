import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  Drawer,
  Select,
  FormField,
  type TableColumn,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { StorageSidebar } from '@/components/StorageSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconRefresh, IconBell, IconTrash, IconDownload } from '@tabler/icons-react';
import { Siren } from 'lucide-react';

/* ----------------------------------------
   Custom Identify Icon (using Siren from lucide-react)
   ---------------------------------------- */

interface IdentifyIconProps {
  size?: number;
  className?: string;
}

function IdentifyIcon({ size = 16, className }: IdentifyIconProps) {
  return <Siren size={size} className={className} strokeWidth={1.5} />;
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
    identifyTimer: null,
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
    available: 'shutoff',
    'in-use': 'active',
    error: 'error',
    offline: 'down',
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
  maxVisible?: number;
}

function OSDsCell({ osds, maxVisible = 2 }: OSDsCellProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const visibleOsds = osds.slice(0, maxVisible);
  const remainingCount = osds.length - maxVisible;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 100; // Approximate height
    const gap = 8;

    // Check if there's enough space above
    const spaceAbove = rect.top;
    const showAbove = spaceAbove > popoverHeight + gap;

    setPopoverPosition({
      top: showAbove ? rect.top - gap : rect.bottom + gap,
      left: rect.left + rect.width / 2,
    });
  }, []);

  useEffect(() => {
    if (isPopoverOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isPopoverOpen, updatePosition]);

  const showAbove = triggerRef.current
    ? triggerRef.current.getBoundingClientRect().top > 100
    : true;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visibleOsds.map((osd, index) => (
        <Chip key={index} value={osd} />
      ))}
      {remainingCount > 0 && (
        <>
          <span
            ref={triggerRef}
            className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-body-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors"
            onMouseEnter={() => setIsPopoverOpen(true)}
            onMouseLeave={() => setIsPopoverOpen(false)}
          >
            +{remainingCount}
          </span>
          {isPopoverOpen &&
            createPortal(
              <div
                ref={popoverRef}
                className="fixed z-[9999]"
                style={{
                  top: popoverPosition.top,
                  left: popoverPosition.left,
                  transform: showAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
                }}
                onMouseEnter={() => setIsPopoverOpen(true)}
                onMouseLeave={() => setIsPopoverOpen(false)}
              >
                <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-lg p-3 min-w-[120px] max-w-[240px]">
                  <div className="text-body-xs font-medium text-[var(--color-text-muted)] mb-2">
                    All OSDs ({osds.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {osds.map((osd, index) => (
                      <Chip key={index} value={osd} />
                    ))}
                  </div>
                </div>
                {/* Arrow */}
                {showAbove ? (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-border-default)]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[var(--color-surface-default)]" />
                  </div>
                ) : (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[-1px]">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--color-border-default)]" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-[-1px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-[var(--color-surface-default)]" />
                  </div>
                )}
              </div>,
              document.body
            )}
        </>
      )}
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
      <span className="text-label-sm text-[var(--color-state-warning)]">
        {formatTime(timer)}
      </span>
    );
  }

  return (
    <button
      onClick={onIdentify}
      className="p-1 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
      aria-label="Identify disk"
    >
      <IdentifyIcon size={16} className="text-[var(--color-text-default)]" />
    </button>
  );
}

/* ----------------------------------------
   Physical disks Page
   ---------------------------------------- */

export function PhysicalDisksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Identify drawer state
  const [isIdentifyDrawerOpen, setIsIdentifyDrawerOpen] = useState(false);
  const [selectedDiskId, setSelectedDiskId] = useState<string | null>(null);
  const [identifyDuration, setIdentifyDuration] = useState('1');

  // Timer state for each disk (in seconds)
  const [diskTimers, setDiskTimers] = useState<Record<string, number>>({});

  // Duration options for identify
  const durationOptions = [
    { value: '1', label: '1 minute' },
    { value: '2', label: '2 minutes' },
    { value: '5', label: '5 minutes' },
    { value: '10', label: '10 minutes' },
    { value: '15', label: '15 minutes' },
  ];

  // Countdown effect for disk timers
  useEffect(() => {
    const activeTimers = Object.entries(diskTimers).filter(([, time]) => time > 0);
    if (activeTimers.length === 0) return;

    const interval = setInterval(() => {
      setDiskTimers((prev) => {
        const updated = { ...prev };
        for (const [diskId, time] of Object.entries(updated)) {
          if (time > 0) {
            updated[diskId] = time - 1;
          }
          // Remove timer when it reaches 0
          if (updated[diskId] <= 0) {
            delete updated[diskId];
          }
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [diskTimers]);

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, moveTab } = useTabs();

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Filter disks based on search
  const filteredDisks = useMemo(
    () =>
      mockPhysicalDisks.filter(
        (disk) =>
          disk.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          disk.devicePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
          disk.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          disk.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          disk.type.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const totalPages = Math.ceil(filteredDisks.length / rowsPerPage);
  const totalItems = filteredDisks.length;

  // Get paginated data
  const paginatedDisks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDisks.slice(start, start + rowsPerPage);
  }, [filteredDisks, currentPage, rowsPerPage]);

  // Handle identify disk - open drawer
  const handleIdentify = (diskId: string) => {
    setSelectedDiskId(diskId);
    setIdentifyDuration('1'); // Reset to default
    setIsIdentifyDrawerOpen(true);
  };

  // Handle execute identify
  const handleExecuteIdentify = () => {
    if (selectedDiskId) {
      // Convert minutes to seconds
      const durationInSeconds = parseInt(identifyDuration, 10) * 60;
      setDiskTimers((prev) => ({
        ...prev,
        [selectedDiskId]: durationInSeconds,
      }));
    }
    setIsIdentifyDrawerOpen(false);
  };

  // Handle close identify drawer
  const handleCloseIdentifyDrawer = () => {
    setIsIdentifyDrawerOpen(false);
    setSelectedDiskId(null);
  };

  // Table columns definition
  const columns: TableColumn<PhysicalDisk>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      sortable: false,
      render: (_, row) => <StatusCell status={row.status} />,
    },
    {
      key: 'hostname',
      label: 'Hostname',
      flex: 1,
      minWidth: columnMinWidths.hostname,
      sortable: true,
    },
    {
      key: 'devicePath',
      label: 'Device path',
      flex: 1,
      minWidth: columnMinWidths.devicePath,
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.type,
      sortable: true,
      render: (_, row) => <TypeCell type={row.type} />,
    },
    {
      key: 'vendor',
      label: 'Vendor',
      flex: 1,
      minWidth: columnMinWidths.vendor,
      sortable: true,
    },
    {
      key: 'model',
      label: 'Model',
      flex: 1,
      minWidth: columnMinWidths.model,
      sortable: true,
    },
    {
      key: 'size',
      label: 'Size',
      flex: 1,
      minWidth: columnMinWidths.size,
      sortable: true,
    },
    {
      key: 'osds',
      label: 'OSDs',
      flex: 1,
      minWidth: columnMinWidths.osds,
      sortable: false,
      render: (_, row) => <OSDsCell osds={row.osds} />,
    },
    {
      key: 'identify',
      label: 'Identify',
      width: fixedColumns.identify,
      align: 'center',
      sortable: false,
      render: (_, row) => (
        <IdentifyCell
          timer={diskTimers[row.id] ?? row.identifyTimer}
          onIdentify={() => handleIdentify(row.id)}
        />
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <StorageSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Content */}
      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${sidebarOpen ? 'left-[var(--layout-sidebar-width)]' : 'left-0'}`}
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
            onTabReorder={moveTab}
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
                items={[{ label: 'Home', href: '/storage' }, { label: 'Physical disks' }]}
              />
            }
            actions={
              <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* Page Content */}
          <div className="pt-4 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={3}>
              {/* Page Header */}
              <div className="flex items-center justify-between h-8">
                <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Physical disks
                </h1>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="flex items-center gap-1">
                    <div className="w-[var(--search-input-width)]">
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
                      icon={<IconDownload size={14} stroke={1.5} />}
                      aria-label="Download"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<IconRefresh size={14} stroke={1.5} />}
                      aria-label="Refresh"
                      onClick={() => console.log('Refresh clicked')}
                    />
                  </div>
                  <div className="w-px h-4 bg-[var(--color-border-default)]" />
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
              <Table columns={columns} data={paginatedDisks} getRowId={(row) => row.id} />
            </VStack>
          </div>
        </div>
      </main>

      {/* Identify Drawer */}
      <Drawer
        isOpen={isIdentifyDrawerOpen}
        onClose={handleCloseIdentifyDrawer}
        title="Identify device"
        width={360}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="secondary" onClick={handleCloseIdentifyDrawer} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExecuteIdentify} className="flex-1">
              Execute
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <p className="text-body-md leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
            Please enter the duration how long to indicate the LED.
          </p>
          <FormField>
            <FormField.Label>Duration</FormField.Label>
            <FormField.Control>
              <Select
                options={durationOptions}
                value={identifyDuration}
                onChange={(value) => setIdentifyDuration(value)}
                fullWidth
              />
            </FormField.Control>
          </FormField>
        </div>
      </Drawer>
    </div>
  );
}

export default PhysicalDisksPage;
