import { useState, useEffect } from 'react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import {
  Button,
  Input,
  Textarea,
  NumberInput,
  SearchInput,
  Select,
  Slider,
  Chip,
  DatePicker,
  WindowControl,
  WindowControls,
  ContextMenu,
  ProgressBar,
  Pagination,
  TopBar,
  TopBarAction,
  TabBar,
  useTabBar,
  Table,
  Toggle,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  InlineMessage,
  Disclosure,
  Badge,
  Breadcrumb,
  StatusIndicator,
  VStack,
  MenuItem,
  MenuSection,
  MenuDivider,
  Tooltip,
  Modal,
  ConfirmModal,
  DetailHeader,
  SectionCard,
  Drawer,
} from '@/design-system';
import {
  // Navigation icons (for sidebar)
  IconPalette,
  IconTypography,
  IconBoxMultiple,
  IconClick,
  IconForms,
  IconTag,
  IconMenu2,
  IconLayoutGrid,
  IconSquareCheck,
  IconToggleRight,
  IconCircle,
  IconLayoutNavbar,
  IconSelector,
  // Basic - Actions
  IconPlayerPlay,
  IconPlayerStop,
  IconPlayerPause,
  IconRefresh,
  IconRotate,
  IconTrash,
  IconEdit,
  IconCopy,
  IconShare,
  IconDownload,
  IconUpload,
  IconPlus,
  IconCirclePlus,
  IconLink,
  IconUnlink,
  IconExternalLink,
  IconHistory,
  IconSend,
  // Basic - Navigation
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconArrowRight,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconDotsVertical,
  IconDots,
  // Basic - Status & Feedback
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconCircleCheck,
  IconBan,
  IconLoader,
  IconProgress,
  // Basic - UI
  IconSearch,
  IconFilter,
  IconSettings,
  IconHome,
  IconBell,
  IconBellRinging,
  IconStar,
  IconStarFilled,
  IconHeart,
  IconEye,
  IconEyeOff,
  IconLock,
  IconX,
  IconCheck,
  IconUser,
  IconMail,
  IconMessage,
  IconHelp,
  IconList,
  // System - Infrastructure
  IconServer,
  IconServer2,
  IconDatabase,
  IconNetwork,
  IconRouter,
  IconScale,
  IconWorldWww,
  IconShield,
  IconKey,
  IconCpu,
  IconPlug,
  // System - Storage & Files
  IconDeviceFloppy,
  IconCamera,
  IconPhoto,
  IconFile,
  IconArchive,
  IconTemplate,
  // System - Monitoring & Analytics
  IconTerminal,
  IconTerminal2,
  IconPower,
  IconActivity,
  IconChartBar,
  IconGauge,
  IconDeviceDesktop,
  IconDeviceDesktopAnalytics,
  // System - Organization
  IconTopologyRing,
  IconTopologyStar3,
  IconCertificate,
  IconBuilding,
  IconCategory,
  IconStack2,
  IconUserCircle,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconAdjustments,
  IconBolt,
  IconCloud,
  IconGitBranch,
  IconBrain,
  IconRobot,
  IconMessageChatbot,
  IconBooks,
  IconTestPipe,
  IconClock,
  IconHourglass,
  IconCurrencyDollar,
  IconLanguage,
  IconMessage2,
  IconCalendar,
  IconAppWindow,
  IconBorderAll,
  // Brand Icons
  IconBrandUbuntu,
  IconBrandDebian,
  IconBrandWindows,
  IconBrandRedhat,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Navigation Items
   ---------------------------------------- */

// Foundation items (기초 토큰/스타일)
const foundationItems = [
  { id: 'token-architecture', label: 'Token Architecture', icon: IconLayoutGrid },
  { id: 'primitive-colors', label: 'Primitive Colors', icon: IconPalette },
  { id: 'semantic-colors', label: 'Semantic Colors', icon: IconPalette },
  { id: 'typography', label: 'Typography', icon: IconTypography },
  { id: 'spacing-radius', label: 'Spacing & Radius', icon: IconBoxMultiple },
  { id: 'borders', label: 'Borders', icon: IconBorderAll },
  { id: 'shadows', label: 'Shadows', icon: IconBoxMultiple },
  { id: 'icons', label: 'Icons', icon: IconStar },
  { id: 'layout', label: 'Layout', icon: IconLayoutSidebar },
];

// Component items (UI 컴포넌트)
// Form Controls
const formControlItems = [
  { id: 'button', label: 'Button', icon: IconClick },
  { id: 'input', label: 'Input', icon: IconForms },
  { id: 'select', label: 'Select', icon: IconSelector },
  { id: 'datepicker', label: 'DatePicker', icon: IconCalendar },
  { id: 'slider', label: 'Slider', icon: IconAdjustments },
  { id: 'checkbox', label: 'Checkbox', icon: IconSquareCheck },
  { id: 'radio', label: 'Radio', icon: IconCircle },
  { id: 'toggle', label: 'Toggle', icon: IconToggleRight },
];

// Data Display
const dataDisplayItems = [
  { id: 'table', label: 'Table', icon: IconList },
  { id: 'badge', label: 'Badge', icon: IconTag },
  { id: 'chip', label: 'Chip', icon: IconTag },
  { id: 'pagination', label: 'Pagination', icon: IconProgress },
  { id: 'progress-bar', label: 'Progress Bar', icon: IconProgress },
  { id: 'status-indicator', label: 'Status Indicator', icon: IconActivity },
  { id: 'tooltip', label: 'Tooltip', icon: IconMessage2 },
  { id: 'window-control', label: 'Window Control', icon: IconAppWindow },
  { id: 'detail-header', label: 'Detail Header', icon: IconLayoutNavbar },
  { id: 'section-card', label: 'Section Card', icon: IconLayoutGrid },
];

// Navigation
const navigationItems = [
  { id: 'topbar', label: 'TopBar', icon: IconLayoutNavbar },
  { id: 'tabbar', label: 'TabBar', icon: IconLayoutNavbar },
  { id: 'tabs', label: 'Tabs', icon: IconLayoutNavbar },
  { id: 'breadcrumb', label: 'Breadcrumb', icon: IconChevronRight },
  { id: 'menu', label: 'Menu', icon: IconMenu2 },
  { id: 'context-menu', label: 'Context Menu', icon: IconMenu2 },
  { id: 'modal', label: 'Modal', icon: IconLayoutGrid },
  { id: 'drawer', label: 'Drawer', icon: IconLayoutGrid },
];

// Feedback
const feedbackItems = [
  { id: 'inline-message', label: 'Inline Message', icon: IconInfoCircle },
];

// Disclosure
const disclosureItems = [
  { id: 'disclosure', label: 'Disclosure', icon: IconSelector },
];

// All component items
const componentItems = [
  ...formControlItems,
  ...dataDisplayItems,
  ...navigationItems,
  ...feedbackItems,
  ...disclosureItems,
];

// All items for intersection observer
const navItems = [...foundationItems, ...componentItems];

/* ----------------------------------------
   DatePicker Section (with state)
   ---------------------------------------- */

function DatePickerSection() {
  const [singleDate, setSingleDate] = useState<Date | null>(new Date(2025, 2, 8));
  const [rangeValue, setRangeValue] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(2025, 2, 8),
    end: new Date(2025, 2, 23),
  });
  const [minMaxDate, setMinMaxDate] = useState<Date | null>(null);
  const [mondayDate, setMondayDate] = useState<Date | null>(new Date(2025, 2, 8));

  return (
    <Section id="datepicker" title="DatePicker" description="Calendar-based date selection with single and range modes">
      <VStack gap={8}>
        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design Tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>padding: 12px</code> · <code>gap: 12px</code> · <code>radius: 8px</code> · <code>cell: 32×32px</code>
          </div>
        </VStack>

        {/* Single Selection */}
        <VStack gap={3}>
          <Label>Single Selection {singleDate && <span className="font-normal text-[var(--color-text-muted)]">— {singleDate.toLocaleDateString()}</span>}</Label>
          <DatePicker
            value={singleDate}
            onChange={setSingleDate}
            eventDates={[new Date(2025, 2, 7)]}
          />
        </VStack>

        {/* Range Selection */}
        <VStack gap={3}>
          <Label>
            Range Selection
            {rangeValue.start && rangeValue.end && (
              <span className="font-normal text-[var(--color-text-muted)]">
                — {rangeValue.start.toLocaleDateString()} ~ {rangeValue.end.toLocaleDateString()}
              </span>
            )}
          </Label>
          <DatePicker
            mode="range"
            rangeValue={rangeValue}
            onRangeChange={setRangeValue}
            eventDates={[new Date(2025, 2, 7)]}
          />
        </VStack>

        {/* With Min/Max Date */}
        <VStack gap={3}>
          <Label>With Min/Max Date (5th ~ 25th) {minMaxDate && <span className="font-normal text-[var(--color-text-muted)]">— {minMaxDate.toLocaleDateString()}</span>}</Label>
          <DatePicker
            value={minMaxDate}
            onChange={setMinMaxDate}
            minDate={new Date(2025, 2, 5)}
            maxDate={new Date(2025, 2, 25)}
          />
        </VStack>

        {/* Monday Start */}
        <VStack gap={3}>
          <Label>Monday Start {mondayDate && <span className="font-normal text-[var(--color-text-muted)]">— {mondayDate.toLocaleDateString()}</span>}</Label>
          <DatePicker
            firstDayOfWeek={1}
            value={mondayDate}
            onChange={setMondayDate}
          />
        </VStack>

        {/* States */}
        <VStack gap={3}>
          <Label>States</Label>
          <div className="flex gap-4 items-start">
            <VStack gap={1}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
              <DatePicker value={singleDate} onChange={setSingleDate} />
            </VStack>
            <VStack gap={1}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
              <DatePicker value={new Date(2025, 2, 8)} disabled />
            </VStack>
          </div>
        </VStack>
      </VStack>
    </Section>
  );
}

/* ----------------------------------------
   Modal Demo (with state)
   ---------------------------------------- */

function ModalDemo({ variant }: { variant: 'basic' | 'delete' | 'size-sm' | 'size-md' | 'size-lg' }) {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonLabel = () => {
    switch (variant) {
      case 'basic': return 'Open Basic Modal';
      case 'delete': return 'Open Delete Modal';
      case 'size-sm': return 'Small (320px)';
      case 'size-md': return 'Medium (400px)';
      case 'size-lg': return 'Large (560px)';
      default: return 'Open Modal';
    }
  };

  const getSize = (): 'sm' | 'md' | 'lg' => {
    if (variant === 'size-sm') return 'sm';
    if (variant === 'size-lg') return 'lg';
    return variant === 'delete' ? 'sm' : 'md';
  };

  if (variant === 'delete') {
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          {getButtonLabel()}
        </Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log('Deleted!');
            setIsOpen(false);
          }}
          title="Delete Template"
          description="Are you sure you want to delete this template? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          infoLabel="Template name"
          infoValue="My-web-template"
        />
      </>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {getButtonLabel()}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="This is a modal description that provides additional context."
        size={getSize()}
      >
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            Modal content goes here. You can put any content inside a modal.
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}

/* ----------------------------------------
   Drawer Demo (with state)
   ---------------------------------------- */

function DrawerDemo() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [formValue, setFormValue] = useState('');

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Basic Drawer */}
      <Button variant="outline" size="sm" onClick={() => setIsBasicOpen(true)}>
        Basic Drawer
      </Button>
      <Drawer
        isOpen={isBasicOpen}
        onClose={() => setIsBasicOpen(false)}
        title="Drawer Title"
        width={376}
      >
        <VStack gap={4}>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
            <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
              This is a basic drawer with content. Drawers are useful for secondary content, forms, or detail views.
            </p>
          </div>
          <VStack gap={2}>
            <Label>Example Content</Label>
            <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              You can put any content inside a drawer, including forms, lists, or details.
            </p>
          </VStack>
        </VStack>
      </Drawer>

      {/* Drawer with Footer */}
      <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
        With Footer
      </Button>
      <Drawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Edit Settings"
        width={376}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => setIsFormOpen(false)}>
              Save
            </Button>
          </div>
        }
      >
        <VStack gap={4}>
          <VStack gap={2}>
            <label className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
              Setting Name
            </label>
            <Input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Enter value..."
              fullWidth
            />
          </VStack>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-3">
            <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              Drawers with footers are useful for forms with action buttons.
            </p>
          </div>
        </VStack>
      </Drawer>

      {/* Left Side Drawer */}
      <Button variant="outline" size="sm" onClick={() => setIsLeftOpen(true)}>
        Left Side
      </Button>
      <Drawer
        isOpen={isLeftOpen}
        onClose={() => setIsLeftOpen(false)}
        title="Left Drawer"
        side="left"
        width={320}
      >
        <VStack gap={4}>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
            <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
              This drawer slides in from the left side.
            </p>
          </div>
        </VStack>
      </Drawer>
    </div>
  );
}

/* ----------------------------------------
   TabBar Demo (with state)
   ---------------------------------------- */

function TabBarDemo() {
  const { tabs, activeTab, addTab, closeTab, selectTab } = useTabBar({
    initialTabs: [
      { id: 'tab-1', label: 'Dashboard', closable: true },
      { id: 'tab-2', label: 'Settings', closable: true },
      { id: 'tab-3', label: 'Profile', closable: true },
    ],
    initialActiveTab: 'tab-1',
  });

  let tabCounter = 4;

  const handleAddTab = () => {
    addTab({
      id: `tab-${tabCounter}`,
      label: `New Tab ${tabCounter}`,
      closable: true,
    });
    tabCounter++;
  };

  return (
    <VStack gap={8}>
      {/* Tokens */}
      <VStack gap={3}>
        <Label>Design Tokens</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>height: 36px</code> · <code>tab-width: 100-200px</code> · <code>padding-x: 12px</code> · <code>font: 12px</code>
        </div>
      </VStack>

      {/* Interactive Demo */}
      <VStack gap={3}>
        <Label>Interactive Demo</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={handleAddTab}
          />
          <div className="h-[120px] flex items-center justify-center bg-[var(--color-surface-default)] text-[var(--color-text-muted)] text-[length:var(--font-size-12)]">
            Content for: {tabs.find(t => t.id === activeTab)?.label || 'No tab selected'}
          </div>
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click tabs to switch, click × to close, click + to add new tabs
        </p>
      </VStack>

      {/* With Icons */}
      <VStack gap={3}>
        <Label>With Icons</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={[
              { id: 'home', label: 'Home', icon: <IconHome size={14} stroke={1.5} />, closable: false },
              { id: 'docs', label: 'Documents', icon: <IconFile size={14} stroke={1.5} /> },
              { id: 'settings', label: 'Settings', icon: <IconSettings size={14} stroke={1.5} /> },
            ]}
            activeTab="docs"
            onTabChange={() => {}}
            onTabClose={() => {}}
            showAddButton={false}
          />
        </div>
      </VStack>

      {/* No Add Button */}
      <VStack gap={3}>
        <Label>Without Add Button</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={[
              { id: 'tab-a', label: 'Tab A' },
              { id: 'tab-b', label: 'Tab B' },
            ]}
            activeTab="tab-a"
            onTabChange={() => {}}
            onTabClose={() => {}}
            showAddButton={false}
          />
        </div>
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   Table Demo (with state)
   ---------------------------------------- */

interface InstanceData {
  id: string;
  name: string;
  status: 'Running' | 'Stopped' | 'Building';
  locked: boolean;
  fixedIp: string;
  floatingIp: string;
  image: string;
  flavor: string;
  vCPU: number;
  ram: string;
  disk: string;
  gpu: number;
  az: string;
}

const sampleTableData: InstanceData[] = [
  { id: '1', name: 'worker-node-01', status: 'Running', locked: true, fixedIp: '10.20.30.40', floatingIp: '20.30.40.50', image: 'CentOS 7', flavor: 'Medium', vCPU: 4, ram: '8GB', disk: '100GB', gpu: 1, az: 'keystone' },
  { id: '2', name: 'web-server-01', status: 'Running', locked: false, fixedIp: '10.20.30.41', floatingIp: '-', image: 'Ubuntu 22.04', flavor: 'Large', vCPU: 8, ram: '16GB', disk: '200GB', gpu: 0, az: 'keystone' },
  { id: '3', name: 'db-master', status: 'Running', locked: true, fixedIp: '10.20.30.42', floatingIp: '20.30.40.52', image: 'Rocky Linux 9', flavor: 'XLarge', vCPU: 16, ram: '32GB', disk: '500GB', gpu: 2, az: 'nova' },
  { id: '4', name: 'api-gateway', status: 'Stopped', locked: false, fixedIp: '10.20.30.43', floatingIp: '-', image: 'Ubuntu 22.04', flavor: 'Small', vCPU: 2, ram: '4GB', disk: '50GB', gpu: 0, az: 'keystone' },
  { id: '5', name: 'redis-cache', status: 'Running', locked: false, fixedIp: '10.20.30.44', floatingIp: '20.30.40.54', image: 'Debian 12', flavor: 'Medium', vCPU: 4, ram: '8GB', disk: '100GB', gpu: 0, az: 'nova' },
  { id: '6', name: 'ml-worker', status: 'Building', locked: false, fixedIp: '-', floatingIp: '-', image: 'Ubuntu 22.04', flavor: 'GPU Large', vCPU: 8, ram: '64GB', disk: '1TB', gpu: 4, az: 'gpu-zone' },
];

// Sample Key Pair data for copy demo
interface KeyPairData {
  id: string;
  name: string;
  fingerprint: string;
  createdAt: string;
}

const sampleKeyPairData: KeyPairData[] = [
  { id: 'kp-001', name: 'tk-keypair', fingerprint: '02:c1:ff:54:df:d9:69:0e:bb:46:a9:c8:0c:dc:2f:bb', createdAt: '2025-09-10' },
  { id: 'kp-002', name: 'dev-keypair', fingerprint: 'a3:b2:c1:d4:e5:f6:07:18:29:3a:4b:5c:6d:7e:8f:90', createdAt: '2025-09-08' },
  { id: 'kp-003', name: 'prod-keypair', fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00', createdAt: '2025-09-05' },
];

function TableDemo() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy handler with visual feedback
  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Columns with copy functionality
  const copyColumns = [
    { 
      key: 'name', 
      label: 'Name', 
      width: '160px',
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] cursor-pointer hover:underline">{value}</span>
      )
    },
    { 
      key: 'fingerprint', 
      label: 'Fingerprint', 
      flex: 1,
      render: (_: string, row: KeyPairData) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[length:var(--font-size-11)] text-[var(--color-text-default)]">{row.fingerprint}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(row.id, row.fingerprint);
            }}
            className="p-1.5 -m-1 rounded-md hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-subtle)] transition-colors"
            title={copiedId === row.id ? 'Copied!' : 'Copy fingerprint'}
          >
            {copiedId === row.id ? (
              <IconCheck size={12} className="text-[var(--color-state-success)]" />
            ) : (
              <IconCopy size={12} className="text-[var(--color-action-primary)]" />
            )}
          </button>
        </div>
      )
    },
    { key: 'createdAt', label: 'Created At', width: '120px' },
  ];

  const columns = [
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true, 
      width: '80px',
      render: (value: string) => (
        <StatusIndicator 
          status={value === 'Running' ? 'active' : value === 'Stopped' ? 'error' : 'building'}
        />
      )
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true, 
      width: '140px',
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] cursor-pointer hover:underline">{value}</span>
      )
    },
    { 
      key: 'locked', 
      label: 'Locked', 
      width: '70px',
      render: (value: boolean) => value ? (
        <IconLock size={16} className="text-[var(--color-text-subtle)]" />
      ) : null
    },
    { key: 'fixedIp', label: 'Fixed IP', sortable: true, width: '120px' },
    { key: 'floatingIp', label: 'Floating IP', sortable: true, width: '120px' },
    { key: 'image', label: 'Image', sortable: true, width: '110px' },
    { key: 'flavor', label: 'Flavor', sortable: true, width: '90px' },
    { key: 'vCPU', label: 'vCPU', sortable: true, width: '70px' },
    { key: 'ram', label: 'RAM', sortable: true, width: '70px' },
    { key: 'disk', label: 'Disk', sortable: true, width: '80px' },
    { key: 'gpu', label: 'GPU', sortable: true, width: '60px' },
    { key: 'az', label: 'AZ', sortable: true, width: '90px' },
    { 
      key: 'actions', 
      label: 'Action', 
      width: '100px',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-text-subtle)]">
            <IconTerminal2 size={16} />
          </button>
          <button className="p-1 rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-text-subtle)]">
            <IconPower size={16} />
          </button>
        </div>
      )
    },
  ];

  return (
    <VStack gap={8}>
      {/* Tokens */}
      <VStack gap={3}>
        <Label>Design Tokens</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>cell-padding: 12×10px</code> · <code>header-padding: 12×8px</code> · <code>radius: 8px</code> · <code>font: 12px</code>
        </div>
      </VStack>

      {/* Basic Table */}
      <VStack gap={3}>
        <Label>Basic Table with Sorting</Label>
        <Table
          columns={columns}
          data={sampleTableData}
          rowKey="id"
        />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click column headers to sort
        </p>
      </VStack>

      {/* Selectable Table */}
      <VStack gap={3}>
        <Label>Selectable Table</Label>
        <Table
          columns={columns}
          data={sampleTableData}
          rowKey="id"
          selectable
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Selected: {selectedKeys.length > 0 ? selectedKeys.join(', ') : 'None'}
        </p>
      </VStack>

      {/* Sticky Header */}
      <VStack gap={3}>
        <Label>Sticky Header (scroll to see effect)</Label>
        <Table
          columns={columns}
          data={[...sampleTableData, ...sampleTableData]}
          rowKey={(row) => `${row.id}-${Math.random()}`}
          maxHeight="200px"
          stickyHeader
        />
      </VStack>

      {/* Horizontal Scroll */}
      <VStack gap={3}>
        <Label>Horizontal Scroll (max-width: 600px)</Label>
        <div className="max-w-[600px] border border-dashed border-[var(--color-border-default)] rounded-[var(--radius-md)] p-2">
          <Table
            columns={columns}
            data={sampleTableData.slice(0, 3)}
            rowKey="id"
            selectable
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          />
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Shift + Mouse wheel or trackpad swipe to scroll horizontally
        </p>
      </VStack>

      {/* Empty State */}
      <VStack gap={3}>
        <Label>Empty State</Label>
        <Table
          columns={columns}
          data={[]}
          rowKey="id"
          emptyMessage="No instances found"
        />
      </VStack>

      {/* Copy Cell */}
      <VStack gap={3}>
        <Label>Cell with Copy Button</Label>
        <Table
          columns={copyColumns}
          data={sampleKeyPairData}
          rowKey="id"
        />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click copy icon to copy fingerprint. Icon changes to checkmark for 2 seconds after copying.
        </p>
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   Design System Page
   ---------------------------------------- */

export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState('token-architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Pagination demo states
  const [demoPage1, setDemoPage1] = useState(1);
  const [demoPage2, setDemoPage2] = useState(5);
  const [demoPage3, setDemoPage3] = useState(15);
  const [demoPage4, setDemoPage4] = useState(2);

  // Scroll to top handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Intersection Observer to track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter nav items based on search query
  const filteredNavItems = searchQuery.trim()
    ? navItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredNavItems.length > 0) {
      scrollToSection(filteredNavItems[0].id);
      setSearchQuery('');
    }
    if (e.key === 'Escape') {
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Left Sidebar Navigation */}
      <nav className="fixed left-0 top-0 w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] overflow-y-auto z-50">
        <div className="p-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">TDS</span>
            </div>
            <span className="text-[length:var(--font-size-14)] font-semibold text-[var(--color-text-default)]">
              Design System
            </span>
          </Link>

          {/* Navigation */}
          <VStack gap={4}>
            {/* Foundation Section */}
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Foundation
              </span>
              {foundationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
                    ${activeSection === id
                      ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Form Controls */}
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Form Controls
              </span>
              {formControlItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
                    ${activeSection === id
                      ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Data Display */}
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Data Display
              </span>
              {dataDisplayItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
                    ${activeSection === id
                      ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Navigation */}
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Navigation
              </span>
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
                    ${activeSection === id
                      ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Feedback */}
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Feedback
              </span>
              {feedbackItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
                    ${activeSection === id
                      ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

            {/* Disclosure */}
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Disclosure
              </span>
              {disclosureItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
                    ${activeSection === id
                      ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)] font-medium'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
                    }
                  `}
                >
                  <Icon size={16} stroke={1.5} />
                  {label}
                </button>
              ))}
            </VStack>

          </VStack>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-[200px] py-12 px-8 overflow-x-auto">
        <div className="min-w-[var(--layout-content-min-width)]">
        <div className="max-w-[1000px] mx-auto">
          <VStack gap={12} align="stretch">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <VStack gap={2} align="start">
                <h1 className="text-[length:var(--font-size-40)] font-semibold text-[var(--color-text-default)]">
                  TDS Design System
                </h1>
                <p className="text-[length:var(--font-size-16)] text-[var(--color-text-muted)]">
                  Design tokens and components built with a 3-tier token architecture
                </p>
              </VStack>
              <div className="flex items-center gap-3">
                <DarkModeToggle size="sm" />
                <Link to="/">
                  <Button variant="outline">View Instance List →</Button>
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="relative">
                <IconSearch 
                  size={18} 
                  stroke={1.5} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" 
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search components, tokens... (Enter to go, Esc to clear)"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[length:var(--font-size-14)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                  >
                    <IconX size={16} stroke={1.5} />
                  </button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50 max-h-[300px] overflow-y-auto">
                  {filteredNavItems.length > 0 ? (
                    <div className="p-2">
                      {filteredNavItems.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => {
                            scrollToSection(id);
                            setSearchQuery('');
                          }}
                          className="w-full px-3 py-2 rounded-[var(--radius-md)] flex items-center gap-3 text-left hover:bg-[var(--color-surface-muted)] transition-colors"
                        >
                          <Icon size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">{label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Token Architecture Overview */}
            <Section id="token-architecture" title="Token Architecture" description="3-tier design token structure: Primitive → Semantic → Component">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TokenCard
                  title="Primitive"
                  description="Raw design values"
                  items={['Colors (slate, blue, red...)', 'Spacing (0-32)', 'Font Size (10-40px)', 'Radius, Duration, Shadow']}
                  color="var(--color-state-info-bg)"
                  textColor="var(--color-state-info-text)"
                />
                <TokenCard
                  title="Semantic"
                  description="Purpose-driven tokens"
                  items={['Typography (heading, body, label)', 'Color (action, text, surface, border)', 'Spacing (component, layout)', 'Radius (field, button, card)']}
                  color="var(--color-state-success-bg)"
                  textColor="var(--color-state-success-text)"
                />
                <TokenCard
                  title="Component"
                  description="Component-specific tokens"
                  items={['Button (height, padding, gap)', 'Input (height, padding, radius)', 'Badge (padding, radius, dotSize)', 'Menu (item, section, divider)']}
                  color="var(--color-state-warning-bg)"
                  textColor="var(--color-state-warning-text)"
                />
              </div>
            </Section>

            {/* Primitive Colors */}
            <Section id="primitive-colors" title="Primitive Colors" description="Core color palette used as building blocks">
              <VStack gap={6}>
                {/* Base Colors */}
                <VStack gap={2}>
                  <Label>Base</Label>
                  <div className="flex gap-2">
                    <ColorSwatch name="white" color="var(--color-white)" textLight={false} />
                    <ColorSwatch name="black" color="var(--color-black)" textLight={true} />
                  </div>
                </VStack>
                
                {/* Slate (Cool Neutral) */}
                <VStack gap={2}>
                  <Label>Slate <span className="text-[var(--color-text-subtle)] font-normal">(Cool Neutral - Blue tint)</span></Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-slate-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>

                {/* Gray (Pure Neutral) */}
                <VStack gap={2}>
                  <Label>Gray <span className="text-[var(--color-text-subtle)] font-normal">(Pure Neutral)</span></Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-gray-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>

                {/* Zinc (Warm Neutral) */}
                <VStack gap={2}>
                  <Label>Zinc <span className="text-[var(--color-text-subtle)] font-normal">(Warm Neutral)</span></Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-zinc-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>

                {/* Neutral (True Neutral) */}
                <VStack gap={2}>
                  <Label>Neutral <span className="text-[var(--color-text-subtle)] font-normal">(True Neutral)</span></Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-neutral-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Blue (Primary) */}
                <VStack gap={2}>
                  <Label>Blue (Primary)</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-blue-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Red (Danger) */}
                <VStack gap={2}>
                  <Label>Red (Danger)</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 500, 600, 700, 800].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-red-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Green (Success) */}
                <VStack gap={2}>
                  <Label>Green (Success)</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 500, 600, 700, 800].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-green-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Orange (Warning) */}
                <VStack gap={2}>
                  <Label>Orange (Warning)</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 500, 600, 700, 800].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-orange-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Yellow */}
                <VStack gap={2}>
                  <Label>Yellow</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-yellow-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Semantic Colors */}
            <Section id="semantic-colors" title="Semantic Colors" description="Purpose-driven color tokens with light/dark theme support">
              <VStack gap={6}>
                {/* Action, Text, Surface, Border */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <VStack gap={3}>
                    <Label>Action</Label>
                    <div className="flex gap-2">
                      <SemanticColorBox name="primary" color="var(--color-action-primary)" />
                      <SemanticColorBox name="hover" color="var(--color-action-primary-hover)" />
                      <SemanticColorBox name="active" color="var(--color-action-primary-active)" />
                    </div>
                  </VStack>
                  <VStack gap={3}>
                    <Label>Text</Label>
                    <div className="flex gap-2 flex-wrap">
                      <SemanticColorBox name="default" color="var(--color-text-default)" />
                      <SemanticColorBox name="muted" color="var(--color-text-muted)" />
                      <SemanticColorBox name="subtle" color="var(--color-text-subtle)" />
                      <SemanticColorBox name="disabled" color="var(--color-text-disabled)" />
                      <SemanticColorBox name="inverse" color="var(--color-text-inverse)" border />
                    </div>
                  </VStack>
                  <VStack gap={3}>
                    <Label>Surface</Label>
                    <div className="flex gap-2">
                      <SemanticColorBox name="default" color="var(--color-surface-default)" border />
                      <SemanticColorBox name="subtle" color="var(--color-surface-subtle)" border />
                      <SemanticColorBox name="muted" color="var(--color-surface-muted)" />
                      <SemanticColorBox name="inverse" color="var(--color-surface-inverse)" />
                    </div>
                  </VStack>
                  <VStack gap={3}>
                    <Label>Border</Label>
                    <div className="flex gap-2">
                      <SemanticColorBox name="default" color="var(--color-border-default)" />
                      <SemanticColorBox name="subtle" color="var(--color-border-subtle)" />
                      <SemanticColorBox name="strong" color="var(--color-border-strong)" />
                      <SemanticColorBox name="focus" color="var(--color-border-focus)" />
                    </div>
                  </VStack>
                </div>
                
                {/* State Colors */}
                <VStack gap={3}>
                  <Label>State</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Info */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Info</span>
                      <div className="flex gap-2">
                        <SemanticColorBox name="default" color="var(--color-state-info)" />
                        <SemanticColorBox name="bg" color="var(--color-state-info-bg)" border />
                        <SemanticColorBox name="text" color="var(--color-state-info-text)" />
                      </div>
                    </VStack>
                    {/* Success */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Success</span>
                      <div className="flex gap-2">
                        <SemanticColorBox name="default" color="var(--color-state-success)" />
                        <SemanticColorBox name="bg" color="var(--color-state-success-bg)" border />
                        <SemanticColorBox name="text" color="var(--color-state-success-text)" />
                      </div>
                    </VStack>
                    {/* Warning */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Warning</span>
                      <div className="flex gap-2">
                        <SemanticColorBox name="default" color="var(--color-state-warning)" />
                        <SemanticColorBox name="bg" color="var(--color-state-warning-bg)" border />
                        <SemanticColorBox name="text" color="var(--color-state-warning-text)" />
                      </div>
                    </VStack>
                    {/* Danger */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Danger</span>
                      <div className="flex gap-2">
                        <SemanticColorBox name="default" color="var(--color-state-danger)" />
                        <SemanticColorBox name="bg" color="var(--color-state-danger-bg)" border />
                        <SemanticColorBox name="text" color="var(--color-state-danger-text)" />
                      </div>
                    </VStack>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Typography */}
            <Section id="typography" title="Typography" description="Mona Sans based typography system (base: 12px)">
              <VStack gap={8}>
                {/* Headings */}
                <VStack gap={4}>
                  <Label>Headings</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-11)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Token</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Size</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Line Height</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Weight</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { token: 'h1', size: '40px', lh: '48px', weight: '600', desc: 'Hero / Page title' },
                          { token: 'h2', size: '32px', lh: '40px', weight: '600', desc: 'Section title' },
                          { token: 'h3', size: '24px', lh: '32px', weight: '600', desc: 'Card title' },
                          { token: 'h4', size: '18px', lh: '28px', weight: '600', desc: 'Subsection' },
                          { token: 'h5', size: '16px', lh: '24px', weight: '600', desc: 'Small heading' },
                          { token: 'h6', size: '14px', lh: '20px', weight: '500', desc: 'Label heading' },
                        ].map(({ token, size, lh, weight, desc }) => (
                          <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4"><code className="text-[var(--color-action-primary)] font-mono text-[10px]">heading.{token}</code></td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{size}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{lh}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{weight}</td>
                            <td className="py-2"><span style={{ fontSize: size, lineHeight: lh, fontWeight: Number(weight) }}>{desc}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </VStack>

                {/* Body */}
                <VStack gap={4}>
                  <Label>Body</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-11)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Token</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Size</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Line Height</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Weight</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { token: 'lg', size: '14px', lh: '20px', weight: '400', desc: 'Large body text' },
                          { token: 'md', size: '12px', lh: '18px', weight: '400', desc: 'Default body text' },
                          { token: 'sm', size: '11px', lh: '16px', weight: '400', desc: 'Small body text' },
                          { token: 'xs', size: '10px', lh: '14px', weight: '400', desc: 'Caption text' },
                        ].map(({ token, size, lh, weight, desc }) => (
                          <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4"><code className="text-[var(--color-action-primary)] font-mono text-[10px]">body.{token}</code></td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{size}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{lh}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{weight}</td>
                            <td className="py-2"><span style={{ fontSize: size, lineHeight: lh, fontWeight: Number(weight) }}>{desc}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </VStack>

                {/* Label */}
                <VStack gap={4}>
                  <Label>Label</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-11)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Token</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Size</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Line Height</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Weight</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { token: 'lg', size: '14px', lh: '20px', weight: '500', desc: 'Large label' },
                          { token: 'md', size: '12px', lh: '16px', weight: '500', desc: 'Default label' },
                          { token: 'sm', size: '11px', lh: '16px', weight: '500', desc: 'Small label' },
                        ].map(({ token, size, lh, weight, desc }) => (
                          <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4"><code className="text-[var(--color-action-primary)] font-mono text-[10px]">label.{token}</code></td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{size}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{lh}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{weight}</td>
                            <td className="py-2"><span style={{ fontSize: size, lineHeight: lh, fontWeight: Number(weight) }}>{desc}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Spacing & Radius */}
            <Section id="spacing-radius" title="Spacing & Radius" description="Consistent spacing scale (4px grid) and border radius">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <VStack gap={4}>
                  <Label>Spacing</Label>
                  <div className="flex flex-wrap gap-2 items-end">
                    {[
                      { name: '0', value: '0px' },
                      { name: '0.5', value: '2px' },
                      { name: '1', value: '4px' },
                      { name: '1.5', value: '6px' },
                      { name: '2', value: '8px' },
                      { name: '2.5', value: '10px' },
                      { name: '3', value: '12px' },
                      { name: '4', value: '16px' },
                      { name: '5', value: '20px' },
                      { name: '6', value: '24px' },
                      { name: '7', value: '28px' },
                      { name: '8', value: '32px' },
                      { name: '9', value: '36px' },
                      { name: '10', value: '40px' },
                      { name: '12', value: '48px' },
                      { name: '14', value: '56px' },
                      { name: '16', value: '64px' },
                      { name: '20', value: '80px' },
                      { name: '24', value: '96px' },
                      { name: '32', value: '128px' },
                    ].map(({ name, value }) => (
                      <SpacingSwatch key={name} name={name} value={value} />
                    ))}
                  </div>
                </VStack>
                <VStack gap={4}>
                  <Label>Border Radius</Label>
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { name: 'none', value: '0px' },
                      { name: 'sm', value: '4px' },
                      { name: 'md', value: '6px' },
                      { name: 'lg', value: '8px' },
                      { name: 'xl', value: '16px' },
                      { name: 'full', value: '999px' },
                    ].map(({ name, value }) => (
                      <VStack key={name} gap={2} align="center">
                        <div className="w-12 h-12 bg-[var(--color-action-primary)]" style={{ borderRadius: value }} />
                        <code className="text-[9px] font-mono text-[var(--color-text-subtle)]">{name}</code>
                      </VStack>
                    ))}
                  </div>
                </VStack>
              </div>
            </Section>

            {/* Borders */}
            <Section id="borders" title="Borders" description="Border tokens for colors, widths, and styles">
              <VStack gap={8}>
                {/* Border Colors */}
                <VStack gap={4}>
                  <Label>Border Colors</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'default', token: '--color-border-default', desc: '기본 보더' },
                      { name: 'subtle', token: '--color-border-subtle', desc: '미세한 구분선' },
                      { name: 'strong', token: '--color-border-strong', desc: '강조 보더' },
                      { name: 'focus', token: '--color-border-focus', desc: '포커스 링' },
                    ].map(({ name, desc }) => (
                      <div key={name} className="flex flex-col gap-2">
                        <div
                          className="h-16 rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
                          style={{ border: `2px solid var(--color-border-${name})` }}
                        />
                        <div>
                          <code className="text-[length:var(--font-size-11)] font-mono text-[var(--color-text-default)]">
                            border-{name}
                          </code>
                          <p className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </VStack>

                {/* Border Widths */}
                <VStack gap={4}>
                  <Label>Border Widths</Label>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { name: '0', value: '0px' },
                      { name: '1', value: '1px' },
                      { name: '2', value: '2px' },
                      { name: '4', value: '4px' },
                    ].map(({ name, value }) => (
                      <div key={name} className="flex flex-col gap-2 items-center">
                        <div
                          className="w-full h-12 rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
                          style={{ border: `${value} solid var(--color-border-strong)` }}
                        />
                        <code className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-subtle)]">
                          {value}
                        </code>
                      </div>
                    ))}
                  </div>
                </VStack>

                {/* Border Styles */}
                <VStack gap={4}>
                  <Label>Border Styles</Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {['solid', 'dashed', 'dotted', 'double', 'none'].map((style) => (
                      <div key={style} className="flex flex-col gap-2 items-center">
                        <div
                          className="w-full h-12 rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
                          style={{ border: `2px ${style} var(--color-border-strong)` }}
                        />
                        <code className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-subtle)]">
                          {style}
                        </code>
                      </div>
                    ))}
                  </div>
                </VStack>

                {/* Border Usage Examples */}
                <VStack gap={4}>
                  <Label>Usage Examples</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Card with default border</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border border-[var(--color-border-default)]</code>
                    </div>
                    <div className="p-4 rounded-[var(--radius-lg)] border-2 border-[var(--color-border-strong)] bg-[var(--color-surface-default)]">
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Card with strong border</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border-2 border-[var(--color-border-strong)]</code>
                    </div>
                    <div className="p-4 rounded-[var(--radius-lg)] border-l-4 border-[var(--color-action-primary)] bg-[var(--color-surface-default)]">
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Accent left border</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border-l-4 border-[var(--color-action-primary)]</code>
                    </div>
                    <div className="p-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Dashed border (dropzone)</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border border-dashed</code>
                    </div>
                  </div>
                </VStack>

                {/* CSS Variables Reference */}
                <VStack gap={3}>
                  <Label>CSS Variables</Label>
                  <pre className="text-[length:var(--font-size-11)] p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] overflow-x-auto text-[var(--color-text-muted)]">
{`/* Border Colors */
--color-border-default   /* 기본 보더 (slate-200 / #333) */
--color-border-subtle    /* 미세한 구분선 (slate-100 / #252525) */
--color-border-strong    /* 강조 보더 (slate-300 / #444) */
--color-border-focus     /* 포커스 링 (blue-500 / blue-400) */

/* Usage */
border: 1px solid var(--color-border-default);
border-color: var(--color-border-strong);
outline: 2px solid var(--color-border-focus);`}
                  </pre>
                </VStack>
              </VStack>
            </Section>

            {/* Shadows */}
            <Section id="shadows" title="Shadows" description="Box shadow tokens for elevation and depth">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'xs', value: '0 1px 2px 0 rgba(0,0,0,0.05)' },
                  { name: 'sm', value: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)' },
                  { name: 'md', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
                  { name: 'lg', value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' },
                  { name: 'xl', value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' },
                ].map(({ name, value }) => (
                  <div key={name} className="flex flex-col gap-3">
                    <div
                      className="h-20 bg-[var(--color-surface-default)] rounded-[var(--radius-lg)] flex items-center justify-center"
                      style={{ boxShadow: `var(--shadow-${name})` }}
                    >
                      <span className="text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                        shadow-{name}
                      </span>
                    </div>
                    <div className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)] font-mono truncate" title={value}>
                      --shadow-{name}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Icons */}
            <Section id="icons" title="Icons" description="Tabler Icons library - Stroke width 1.5, Size 16-20px">
              <VStack gap={8}>
                {/* Basic - Actions */}
                <IconGrid
                  title="Actions"
                  icons={[
                    { Icon: IconPlayerPlay, name: 'Play' },
                    { Icon: IconPlayerStop, name: 'Stop' },
                    { Icon: IconPlayerPause, name: 'Pause' },
                    { Icon: IconRefresh, name: 'Refresh' },
                    { Icon: IconRotate, name: 'Reboot' },
                    { Icon: IconTrash, name: 'Delete' },
                    { Icon: IconEdit, name: 'Edit' },
                    { Icon: IconCopy, name: 'Copy' },
                    { Icon: IconShare, name: 'Share' },
                    { Icon: IconDownload, name: 'Download' },
                    { Icon: IconUpload, name: 'Upload' },
                    { Icon: IconPlus, name: 'Add' },
                    { Icon: IconCirclePlus, name: 'Add Circle' },
                    { Icon: IconLink, name: 'Link' },
                    { Icon: IconUnlink, name: 'Unlink' },
                    { Icon: IconExternalLink, name: 'External' },
                    { Icon: IconHistory, name: 'History' },
                    { Icon: IconSend, name: 'Send' },
                  ]}
                />

                {/* Basic - Navigation */}
                <IconGrid
                  title="Navigation"
                  icons={[
                    { Icon: IconChevronLeft, name: 'Left' },
                    { Icon: IconChevronRight, name: 'Right' },
                    { Icon: IconChevronDown, name: 'Down' },
                    { Icon: IconChevronUp, name: 'Up' },
                    { Icon: IconArrowRight, name: 'Arrow' },
                    { Icon: IconArrowsMaximize, name: 'Expand' },
                    { Icon: IconArrowsMinimize, name: 'Collapse' },
                    { Icon: IconDotsVertical, name: 'Kebab' },
                    { Icon: IconDots, name: 'Meatball' },
                  ]}
                />

                {/* Basic - Status */}
                <IconGrid
                  title="Status & Feedback"
                  icons={[
                    { Icon: IconCircleCheck, name: 'Success' },
                    { Icon: IconAlertCircle, name: 'Error' },
                    { Icon: IconAlertTriangle, name: 'Warning' },
                    { Icon: IconInfoCircle, name: 'Info' },
                    { Icon: IconBan, name: 'Suspended' },
                    { Icon: IconLoader, name: 'Loading' },
                    { Icon: IconProgress, name: 'Progress' },
                  ]}
                />

                {/* Basic - UI */}
                <IconGrid
                  title="UI Elements"
                  icons={[
                    { Icon: IconSearch, name: 'Search' },
                    { Icon: IconFilter, name: 'Filter' },
                    { Icon: IconSettings, name: 'Settings' },
                    { Icon: IconHome, name: 'Home' },
                    { Icon: IconBell, name: 'Bell' },
                    { Icon: IconBellRinging, name: 'Bell New' },
                    { Icon: IconStar, name: 'Star' },
                    { Icon: IconStarFilled, name: 'Star Fill' },
                    { Icon: IconHeart, name: 'Heart' },
                    { Icon: IconEye, name: 'Show' },
                    { Icon: IconEyeOff, name: 'Hide' },
                    { Icon: IconLock, name: 'Lock' },
                    { Icon: IconX, name: 'Close' },
                    { Icon: IconCheck, name: 'Check' },
                    { Icon: IconUser, name: 'User' },
                    { Icon: IconMail, name: 'Mail' },
                    { Icon: IconMessage, name: 'Chat' },
                    { Icon: IconHelp, name: 'Help' },
                    { Icon: IconList, name: 'List' },
                    { Icon: IconLayoutGrid, name: 'Grid' },
                  ]}
                />

                {/* System - Infrastructure */}
                <IconGrid
                  title="Infrastructure"
                  icons={[
                    { Icon: IconServer, name: 'Server' },
                    { Icon: IconServer2, name: 'Instance' },
                    { Icon: IconDatabase, name: 'Storage' },
                    { Icon: IconNetwork, name: 'Network' },
                    { Icon: IconRouter, name: 'Router' },
                    { Icon: IconScale, name: 'LB' },
                    { Icon: IconWorldWww, name: 'Float IP' },
                    { Icon: IconShield, name: 'Security' },
                    { Icon: IconKey, name: 'Key Pair' },
                    { Icon: IconCpu, name: 'Flavor' },
                    { Icon: IconPlug, name: 'Port' },
                    { Icon: IconCloud, name: 'Cloud' },
                  ]}
                />

                {/* System - Storage & Files */}
                <IconGrid
                  title="Storage & Files"
                  icons={[
                    { Icon: IconDeviceFloppy, name: 'Backup' },
                    { Icon: IconCamera, name: 'Snapshot' },
                    { Icon: IconPhoto, name: 'Image' },
                    { Icon: IconFile, name: 'File' },
                    { Icon: IconArchive, name: 'Archive' },
                    { Icon: IconTemplate, name: 'Template' },
                    { Icon: IconStack2, name: 'Layers' },
                  ]}
                />

                {/* System - Monitoring */}
                <IconGrid
                  title="Monitoring & Analytics"
                  icons={[
                    { Icon: IconTerminal, name: 'Console' },
                    { Icon: IconTerminal2, name: 'Terminal' },
                    { Icon: IconActivity, name: 'Activity' },
                    { Icon: IconChartBar, name: 'Chart' },
                    { Icon: IconGauge, name: 'Speed' },
                    { Icon: IconDeviceDesktop, name: 'Desktop' },
                    { Icon: IconDeviceDesktopAnalytics, name: 'Analytics' },
                    { Icon: IconLayoutDashboard, name: 'Dashboard' },
                  ]}
                />

                {/* System - Organization */}
                <IconGrid
                  title="Organization"
                  icons={[
                    { Icon: IconTopologyRing, name: 'Topology' },
                    { Icon: IconTopologyStar3, name: 'Star Topo' },
                    { Icon: IconCertificate, name: 'Cert' },
                    { Icon: IconBuilding, name: 'Building' },
                    { Icon: IconCategory, name: 'Category' },
                    { Icon: IconUserCircle, name: 'User' },
                    { Icon: IconLayoutSidebar, name: 'Sidebar' },
                    { Icon: IconAdjustments, name: 'Adjust' },
                    { Icon: IconBolt, name: 'Action' },
                    { Icon: IconGitBranch, name: 'Branch' },
                    { Icon: IconClock, name: 'Schedule' },
                    { Icon: IconHourglass, name: 'Timeout' },
                    { Icon: IconCurrencyDollar, name: 'Billing' },
                    { Icon: IconLanguage, name: 'Language' },
                  ]}
                />

                {/* AI & Advanced */}
                <IconGrid
                  title="AI & Advanced"
                  icons={[
                    { Icon: IconBrain, name: 'Brain' },
                    { Icon: IconRobot, name: 'Robot' },
                    { Icon: IconMessageChatbot, name: 'Chatbot' },
                    { Icon: IconBooks, name: 'Study' },
                    { Icon: IconTestPipe, name: 'Test' },
                  ]}
                />

                {/* OS / Brand Icons */}
                <IconGrid
                  title="OS / Brand"
                  icons={[
                    { Icon: IconBrandUbuntu, name: 'Ubuntu' },
                    { Icon: IconBrandDebian, name: 'Debian' },
                    { Icon: IconBrandWindows, name: 'Windows' },
                    { Icon: IconBrandRedhat, name: 'RedHat' },
                    { Icon: IconHelp, name: 'Rocky Linux', missing: true },
                  ]}
                />
              </VStack>
            </Section>

            {/* ============================================
                COMPONENTS
                ============================================ */}

            {/* Button Component */}
            <Section id="button" title="Button" description="Interactive button component with multiple variants, sizes, and states">
              <VStack gap={8}>
                {/* Token Table */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-11)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Token</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">SM</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">MD</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">LG</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'height', sm: '28px', md: '32px', lg: '40px' },
                          { name: 'min-width', sm: '60px', md: '80px', lg: '80px' },
                          { name: 'padding-x', sm: '10px', md: '12px', lg: '12px' },
                          { name: 'padding-y', sm: '6px', md: '8px', lg: '10px' },
                          { name: 'gap', sm: '6px', md: '6px', lg: '8px' },
                          { name: 'font-size', sm: '12px', md: '12px', lg: '14px' },
                        ].map(({ name, sm, md, lg }) => (
                          <tr key={name} className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">--button-{name}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{sm}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{md}</td>
                            <td className="py-2 font-mono text-[var(--color-text-muted)]">{lg}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
                    <code>radius: 6px (md)</code> · <code>border: slate-300 (secondary)</code> · <code>disabled-bg: slate-200 (primary)</code>
                  </div>
                </VStack>

                {/* Sizes */}
                <VStack gap={3}>
                  <Label>Sizes</Label>
                  <div className="flex gap-3 items-center">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </VStack>

                {/* Variants */}
                <VStack gap={3}>
                  <Label>Variants</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" variant="primary">Primary</Button>
                    <Button size="sm" variant="secondary">Secondary</Button>
                    <Button size="sm" variant="outline">Outline</Button>
                    <Button size="sm" variant="ghost">Ghost</Button>
                    <Button size="sm" variant="muted">Muted</Button>
                    <Button size="sm" variant="danger">Danger</Button>
                    <Button size="sm" variant="warning">Warning</Button>
                    <Button size="sm" variant="link">Link</Button>
                  </div>
                </VStack>

                {/* With Icons */}
                <VStack gap={3}>
                  <Label>With Icons</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" leftIcon={<IconPlus size={14} />}>Left Icon</Button>
                    <Button size="sm" rightIcon={<IconArrowRight size={14} />}>Right Icon</Button>
                    <Button size="sm" icon={<IconHeart size={14} />} aria-label="Like" />
                    <Button size="sm" variant="secondary" icon={<IconStar size={14} />} aria-label="Star" />
                  </div>
                  <div className="mt-4"><Label>Icon + Text (Action Buttons)</Label></div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" variant="secondary" leftIcon={<IconPlayerPlay size={12} />}>Start</Button>
                    <Button size="sm" variant="muted" leftIcon={<IconPlayerPlay size={12} />}>Start</Button>
                    <Button size="sm" variant="secondary" leftIcon={<IconPlus size={12} />}>Create</Button>
                    <Button size="sm" variant="muted" leftIcon={<IconPlus size={12} />}>Create</Button>
                    <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>Edit</Button>
                    <Button size="sm" variant="muted" leftIcon={<IconEdit size={12} />}>Edit</Button>
                  </div>
                </VStack>

                {/* States */}
                <VStack gap={3}>
                  <Label>States</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm">Default</Button>
                    <Button size="sm" disabled>Disabled</Button>
                    <Button size="sm" isLoading>Loading</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" variant="secondary">Default</Button>
                    <Button size="sm" variant="secondary" disabled>Disabled</Button>
                  </div>
                </VStack>

                {/* Polymorphic */}
                <VStack gap={3}>
                  <Label>Polymorphic (as prop)</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" as="a" href="#" target="_blank">As Anchor</Button>
                    <Button size="sm" as={Link} to="/">As Router Link</Button>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Input Component */}
            <Section id="input" title="Input" description="Text fields, textarea, number input, and search">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>height: 28/32px</code> · <code>padding: 10×8px</code> · <code>radius: 6px</code> · <code>font: 11-12px</code> · <code>border: 1px → 2px focus</code>
                  </div>
                </VStack>

                {/* Text Input - Status */}
                <VStack gap={3}>
                  <Label>Text Input - Status</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Placeholder</span>
                      <Input placeholder="Input placeholder" className="w-full" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Value</span>
                      <Input defaultValue="Input value" className="w-full" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Read-only</span>
                      <Input defaultValue="Input read-only" readOnly className="w-full" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Input defaultValue="Input disabled" disabled className="w-full" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Error</span>
                      <Input defaultValue="Input error" error="Error message" className="w-full" />
                    </VStack>
                  </div>
                </VStack>

                {/* Text Input - Sizes */}
                <VStack gap={3}>
                  <Label>Text Input - Sizes</Label>
                  <div className="flex gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">SM (28px)</span>
                      <Input size="sm" placeholder="Input placeholder" className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">MD (32px)</span>
                      <Input size="md" placeholder="Input placeholder" className="w-[200px]" />
                    </VStack>
                  </div>
                </VStack>

                {/* With Labels & Helpers */}
                <VStack gap={3}>
                  <Label>Labels & Validation</Label>
                  <div className="flex flex-wrap gap-4 items-start">
                    <Input label="Label" placeholder="Enter text..." className="w-[200px]" />
                    <Input label="With Helper" placeholder="Email" helperText="We'll never share your email" className="w-[200px]" />
                    <Input label="With Error" placeholder="Username" error="Username is required" className="w-[200px]" />
                  </div>
                </VStack>

                {/* With Icons */}
                <VStack gap={3}>
                  <Label>With Icons</Label>
                  <div className="flex gap-4">
                    <Input placeholder="Search..." leftElement={<IconSearch size={14} />} className="w-[200px]" />
                    <Input placeholder="Email" rightElement={<IconMail size={14} />} className="w-[200px]" />
                  </div>
                </VStack>

                {/* Textarea */}
                <VStack gap={3}>
                  <Label>Textarea</Label>
                  <div className="flex gap-4">
                    <Textarea placeholder="Input placeholder" className="w-[280px]" />
                    <Textarea defaultValue="Input value with multiple lines of text content" className="w-[280px]" />
                  </div>
                </VStack>

                {/* Textarea - Code */}
                <VStack gap={3}>
                  <Label>Textarea - Code Variant</Label>
                  <Textarea 
                    variant="code" 
                    placeholder="input user data" 
                    defaultValue={`input user data\n\n`}
                    className="w-[280px]" 
                  />
                </VStack>

                {/* NumberInput (Stepper) */}
                <VStack gap={3}>
                  <Label>Number Input (Stepper)</Label>
                  <div className="flex gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
                      <NumberInput defaultValue={1} className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">With Min/Max</span>
                      <NumberInput defaultValue={5} min={0} max={10} className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <NumberInput defaultValue={1} disabled className="w-[200px]" />
                    </VStack>
                  </div>
                </VStack>

                {/* SearchInput */}
                <VStack gap={3}>
                  <Label>Search Input</Label>
                  <div className="flex gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">SM (28px)</span>
                      <SearchInput size="sm" placeholder="Search placeholder" className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">MD (32px)</span>
                      <SearchInput size="md" placeholder="Search placeholder" className="w-[200px]" />
                    </VStack>
                  </div>
                </VStack>

                {/* SearchInput - Status */}
                <VStack gap={3}>
                  <Label>Search Input - Status</Label>
                  <div className="flex gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Placeholder</span>
                      <SearchInput placeholder="Search placeholder" className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Value</span>
                      <SearchInput defaultValue="Search value" className="w-[200px]" />
                    </VStack>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Select Component */}
            <Section id="select" title="Select" description="Dropdown select for choosing from a list of options">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 10×8px</code> · <code>radius: 6px</code> · <code>font: 12px</code> · <code>item: 10×6px, 11px</code> · <code>border: 1px → 2px focus</code>
                  </div>
                </VStack>

                {/* Status */}
                <VStack gap={3}>
                  <Label>Status</Label>
                  <div className="flex gap-4 items-start flex-wrap">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Placeholder</span>
                      <Select
                        placeholder="Placeholder"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                        className="w-[200px]"
                      />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Value</span>
                      <Select
                        placeholder="Placeholder"
                        defaultValue="active"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                        className="w-[200px]"
                      />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Select
                        placeholder="Placeholder"
                        disabled
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                        className="w-[200px]"
                      />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Error</span>
                      <Select
                        placeholder="Placeholder"
                        error="Please select an option"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                        className="w-[200px]"
                      />
                    </VStack>
                  </div>
                </VStack>

                {/* With Label */}
                <VStack gap={3}>
                  <Label>With Label & Helper</Label>
                  <div className="flex gap-4 items-start">
                    <Select
                      label="Status"
                      placeholder="Select status"
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'shutoff', label: 'Shutoff' },
                        { value: 'building', label: 'Building' },
                      ]}
                      className="w-[200px]"
                    />
                    <Select
                      label="Region"
                      placeholder="Select region"
                      helperText="Choose your preferred region"
                      options={[
                        { value: 'kr', label: 'Korea' },
                        { value: 'us', label: 'United States' },
                        { value: 'jp', label: 'Japan' },
                      ]}
                      className="w-[200px]"
                    />
                  </div>
                </VStack>

                {/* Disabled Options */}
                <VStack gap={3}>
                  <Label>With Disabled Options</Label>
                  <Select
                    label="Instance Type"
                    placeholder="Select type"
                    defaultValue="medium"
                    options={[
                      { value: 'small', label: 'Small (2 vCPU)' },
                      { value: 'medium', label: 'Medium (4 vCPU)' },
                      { value: 'large', label: 'Large (8 vCPU)', disabled: true },
                      { value: 'xlarge', label: 'X-Large (16 vCPU)', disabled: true },
                    ]}
                    className="w-[240px]"
                  />
                </VStack>
              </VStack>
            </Section>

            {/* DatePicker Component */}
            <DatePickerSection />

            {/* Slider Component */}
            <Section id="slider" title="Slider" description="Draggable slider for selecting values within a range">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>track: 6px height</code> · <code>thumb: 16px, 3px border</code> · <code>fill: primary</code>
                  </div>
                </VStack>

                {/* Basic */}
                <VStack gap={3}>
                  <Label>Basic</Label>
                  <div className="w-[312px]">
                    <Slider defaultValue={40} />
                  </div>
                </VStack>

                {/* With Value Display */}
                <VStack gap={3}>
                  <Label>With Value Display</Label>
                  <div className="w-[312px]">
                    <Slider defaultValue={50} showValue />
                  </div>
                </VStack>

                {/* Custom Range */}
                <VStack gap={3}>
                  <Label>Custom Range (0-1000 GB)</Label>
                  <div className="w-[312px]">
                    <Slider 
                      min={0} 
                      max={1000} 
                      step={50} 
                      defaultValue={250} 
                      showValue 
                      formatValue={(v) => `${v} GB`}
                    />
                  </div>
                </VStack>

                {/* States */}
                <VStack gap={3}>
                  <Label>States</Label>
                  <div className="flex flex-col gap-4">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
                      <div className="w-[312px]">
                        <Slider defaultValue={30} />
                      </div>
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <div className="w-[312px]">
                        <Slider defaultValue={60} disabled />
                      </div>
                    </VStack>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Chip Component */}
            <Section id="chip" title="Chip" description="Interactive tags for displaying selected values with optional remove action">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 8×4px</code> · <code>gap: 6px</code> · <code>radius: 6px</code> · <code>font: 11px</code>
                  </div>
                </VStack>

                {/* Basic */}
                <VStack gap={3}>
                  <Label>Basic</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Chip value="Active" />
                    <Chip value="Running" />
                    <Chip value="Completed" />
                  </div>
                </VStack>

                {/* With Label (Key-Value) */}
                <VStack gap={3}>
                  <Label>With Label (Key-Value)</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Chip label="Status" value="Active" />
                    <Chip label="Region" value="Korea" />
                    <Chip label="Type" value="Standard" />
                  </div>
                </VStack>

                {/* With Remove Button */}
                <VStack gap={3}>
                  <Label>With Remove Button</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Chip value="Active" onRemove={() => {}} />
                    <Chip label="Name" value="a" onRemove={() => {}} />
                    <Chip label="Status" value="Running" onRemove={() => {}} />
                  </div>
                </VStack>

                {/* Selected Variant */}
                <VStack gap={3}>
                  <Label>Selected Variant (for Radio/Checkbox selections)</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Chip value="default-sg" variant="selected" onRemove={() => {}} />
                    <Chip value="custom-group" variant="selected" onRemove={() => {}} />
                    <Chip value="production" variant="selected" onRemove={() => {}} />
                  </div>
                </VStack>

                {/* States */}
                <VStack gap={3}>
                  <Label>States</Label>
                  <div className="flex gap-2 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
                      <Chip label="Name" value="a" onRemove={() => {}} />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Chip label="Name" value="a" disabled />
                    </VStack>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Pagination Component */}
            <Section id="pagination" title="Pagination" description="Navigation for paginated content">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>item-size: 24px</code> · <code>gap: 4px</code> · <code>radius: 4px</code> · <code>font: 11px</code>
                  </div>
                </VStack>

                {/* Basic */}
                <VStack gap={3}>
                  <Label>Basic</Label>
                  <Pagination
                    currentPage={demoPage1}
                    totalPages={10}
                    onPageChange={setDemoPage1}
                  />
                </VStack>

                {/* Middle Page */}
                <VStack gap={3}>
                  <Label>Middle Page (with dots)</Label>
                  <Pagination
                    currentPage={demoPage2}
                    totalPages={10}
                    onPageChange={setDemoPage2}
                  />
                </VStack>

                {/* Many Pages */}
                <VStack gap={3}>
                  <Label>Many Pages</Label>
                  <Pagination
                    currentPage={demoPage3}
                    totalPages={50}
                    onPageChange={setDemoPage3}
                  />
                </VStack>

                {/* Few Pages */}
                <VStack gap={3}>
                  <Label>Few Pages (no dots)</Label>
                  <Pagination
                    currentPage={demoPage4}
                    totalPages={5}
                    onPageChange={setDemoPage4}
                  />
                </VStack>

                {/* Disabled */}
                <VStack gap={3}>
                  <Label>Disabled</Label>
                  <Pagination
                    currentPage={3}
                    totalPages={10}
                    onPageChange={(page) => console.log('Page:', page)}
                    disabled
                  />
                </VStack>

                {/* With Settings & Total Items */}
                <VStack gap={3}>
                  <Label>With Settings & Total Items</Label>
                  <Pagination
                    currentPage={demoPage1}
                    totalPages={10}
                    onPageChange={setDemoPage1}
                    showSettings
                    onSettingsClick={() => console.log('Settings clicked')}
                    totalItems={115}
                  />
                </VStack>

                {/* With Selected Count */}
                <VStack gap={3}>
                  <Label>With Selected Count (3 selected)</Label>
                  <Pagination
                    currentPage={demoPage1}
                    totalPages={10}
                    onPageChange={setDemoPage1}
                    showSettings
                    onSettingsClick={() => console.log('Settings clicked')}
                    totalItems={115}
                    selectedCount={3}
                  />
                  <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                    When rows are selected in a table, the pagination shows "X selected / Y items" format.
                  </p>
                </VStack>
              </VStack>
            </Section>

            {/* ProgressBar Component */}
            <Section id="progress-bar" title="Progress Bar" description="Visual indicator for quota usage and progress with status-based colors">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>height: 4px</code> · <code>radius: pill</code>
                  </div>
                </VStack>

                {/* Quota Variant - Status Examples */}
                <VStack gap={3}>
                  <Label>Quota Variant - Status Based Colors</Label>
                  <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                    {/* 1. Normal (under 70%) - Green */}
                    <ProgressBar
                      variant="quota"
                      label="Instance"
                      value={2}
                      newValue={0}
                      max={10}
                    />

                    {/* 2. Warning (70-100%) - Orange */}
                    <ProgressBar
                      variant="quota"
                      label="Instance"
                      value={8}
                      newValue={2}
                      max={10}
                    />

                    {/* 3. Used < 70% but total >= 70% - Green + Orange */}
                    <ProgressBar
                      variant="quota"
                      label="Instance"
                      value={5}
                      newValue={2}
                      max={10}
                    />

                    {/* 4. Total exceeds 100% - Red */}
                    <ProgressBar
                      variant="quota"
                      label="Instance"
                      value={8}
                      newValue={5}
                      max={10}
                    />

                    {/* 5. Already over quota - Red */}
                    <ProgressBar
                      variant="quota"
                      label="Instance"
                      value={10}
                      newValue={0}
                      max={10}
                    />

                    {/* 6. Unlimited - Gray */}
                    <ProgressBar
                      variant="quota"
                      label="Instance"
                      value={10}
                      newValue={0}
                    />
                  </div>
                </VStack>

                {/* Default Variant - Simple Progress */}
                <VStack gap={3}>
                  <Label>Default Variant - Simple Progress</Label>
                  <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <ProgressBar
                      label="60 MB (75%)"
                      value={75}
                      max={100}
                      statusText="chunking"
                      showValue={false}
                    />
                  </div>
                </VStack>

                {/* Error State */}
                <VStack gap={3}>
                  <Label>Error State</Label>
                  <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <ProgressBar
                      label="60 MB (75%)"
                      value={75}
                      max={100}
                      statusText="error"
                      showValue={false}
                      error
                      errorMessage="Upload failed: Network error"
                    />
                  </div>
                </VStack>

                {/* Color Legend */}
                <VStack gap={3}>
                  <Label>Status Colors</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[var(--color-state-success-default)]" />
                      <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">0% ~ 70%: Normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[var(--color-state-warning-default)]" />
                      <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">70% ~ 100%: Warning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[var(--color-state-error-default)]" />
                      <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">&gt;100%: Danger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[var(--color-border-default)]" />
                      <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Unlimited: Neutral</span>
                    </div>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Toggle Component */}
            <Section id="toggle" title="Toggle" description="On/Off switch control for binary settings">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>track: 48×24px</code> · <code>thumb: 16×16px</code> · <code>padding: 4px</code> · <code>radius: pill</code> · <code>gap: 8px</code>
                  </div>
                </VStack>

                {/* Layout */}
                <VStack gap={3}>
                  <Label>Layout</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Without Label</span>
                      <Toggle defaultChecked />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">With Label</span>
                      <Toggle label="Bootable" defaultChecked />
                    </VStack>
                  </div>
                </VStack>

                {/* Status */}
                <VStack gap={3}>
                  <Label>Status</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Off</span>
                      <Toggle label="Setting" checked={false} onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">On</span>
                      <Toggle label="Setting" checked onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled Off</span>
                      <Toggle label="Setting" disabled />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled On</span>
                      <Toggle label="Setting" defaultChecked disabled />
                    </VStack>
                  </div>
                </VStack>

                {/* Interactive */}
                <VStack gap={3}>
                  <Label>Interactive Examples</Label>
                  <div className="flex flex-col gap-3">
                    <Toggle label="Enable dark mode" defaultChecked />
                    <Toggle label="Receive notifications" />
                    <Toggle label="Auto-backup enabled" defaultChecked />
                  </div>
                </VStack>

                {/* With Description */}
                <VStack gap={3}>
                  <Label>With Description</Label>
                  <Toggle
                    label="Auto-scaling"
                    description="Automatically scale instances based on demand"
                    defaultChecked
                  />
                </VStack>
              </VStack>
            </Section>

            {/* Checkbox Component */}
            <Section id="checkbox" title="Checkbox" description="Selection control for single or multiple options">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>size: 16×16px</code> · <code>radius: 4px</code> · <code>gap: 6px</code> · <code>icon: 12px</code>
                  </div>
                </VStack>

                {/* Layout */}
                <VStack gap={3}>
                  <Label>Layout</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Icon Only</span>
                      <Checkbox defaultChecked />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">With Label</span>
                      <Checkbox label="Label" defaultChecked />
                    </VStack>
                  </div>
                </VStack>

                {/* Status */}
                <VStack gap={3}>
                  <Label>Status</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Unselected</span>
                      <Checkbox label="Label" checked={false} onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Selected</span>
                      <Checkbox label="Label" checked onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Indeterminate</span>
                      <Checkbox label="Label" checked indeterminate onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Checkbox label="Label" disabled />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled + Checked</span>
                      <Checkbox label="Label" checked disabled />
                    </VStack>
                  </div>
                </VStack>

                {/* Error State */}
                <VStack gap={3}>
                  <Label>Error State</Label>
                  <div className="flex gap-8 items-start">
                    <Checkbox label="Unchecked with error" error errorMessage="This field is required" />
                    <Checkbox label="Checked with error" defaultChecked error />
                  </div>
                </VStack>

                {/* With Description */}
                <VStack gap={3}>
                  <Label>With Description</Label>
                  <Checkbox
                    label="Email notifications"
                    description="Receive email notifications for important updates"
                    defaultChecked
                  />
                </VStack>

                {/* Checkbox Group */}
                <VStack gap={3}>
                  <Label>Checkbox Group</Label>
                  <div className="flex gap-8 items-start">
                    <CheckboxGroup label="Select options" direction="vertical">
                      <Checkbox label="Option 1" defaultChecked />
                      <Checkbox label="Option 2" />
                      <Checkbox label="Option 3" />
                    </CheckboxGroup>
                    <CheckboxGroup label="Horizontal layout" direction="horizontal">
                      <Checkbox label="A" defaultChecked />
                      <Checkbox label="B" />
                      <Checkbox label="C" />
                    </CheckboxGroup>
                  </div>
                </VStack>

                {/* Group with Error */}
                <VStack gap={3}>
                  <Label>Group with Error</Label>
                  <CheckboxGroup
                    label="Required selection"
                    description="Please select at least one option"
                    error
                    errorMessage="At least one option must be selected"
                  >
                    <Checkbox label="Option A" />
                    <Checkbox label="Option B" />
                  </CheckboxGroup>
                </VStack>
              </VStack>
            </Section>

            {/* Radio Component */}
            <Section id="radio" title="Radio" description="Single selection control for mutually exclusive options">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>size: 16×16px</code> · <code>dot: 6px</code> · <code>border: 2px</code> · <code>gap: 6px</code>
                  </div>
                </VStack>

                {/* Layout */}
                <VStack gap={3}>
                  <Label>Layout</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Icon Only</span>
                      <Radio value="icon" checked onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">With Label</span>
                      <Radio label="Label" value="label" checked onChange={() => {}} />
                    </VStack>
                  </div>
                </VStack>

                {/* Status */}
                <VStack gap={3}>
                  <Label>Status</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Unselected</span>
                      <Radio label="Label" value="unselected" checked={false} onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Selected</span>
                      <Radio label="Label" value="selected" checked onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Radio label="Label" value="disabled" disabled />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled + Selected</span>
                      <Radio label="Label" value="disabled-selected" checked disabled onChange={() => {}} />
                    </VStack>
                  </div>
                </VStack>

                {/* Radio Group */}
                <VStack gap={3}>
                  <Label>Radio Group</Label>
                  <div className="flex gap-8 items-start">
                    <RadioGroup label="Select one option" defaultValue="option1" direction="vertical">
                      <Radio label="Option 1" value="option1" />
                      <Radio label="Option 2" value="option2" />
                      <Radio label="Option 3" value="option3" />
                    </RadioGroup>
                    <RadioGroup label="Horizontal layout" defaultValue="a" direction="horizontal">
                      <Radio label="A" value="a" />
                      <Radio label="B" value="b" />
                      <Radio label="C" value="c" />
                    </RadioGroup>
                  </div>
                </VStack>

                {/* Group with Error */}
                <VStack gap={3}>
                  <Label>Group with Error</Label>
                  <RadioGroup
                    label="Required selection"
                    description="Please select one option"
                    error
                    errorMessage="You must select an option"
                  >
                    <Radio label="Option A" value="a" />
                    <Radio label="Option B" value="b" />
                  </RadioGroup>
                </VStack>
              </VStack>
            </Section>

            {/* TopBar Component */}
            <Section id="topbar" title="TopBar" description="Application header with sidebar toggle, navigation, breadcrumb, and actions">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>height: 40px</code> · <code>padding-x: 12px</code> · <code>button-size: 28px</code> · <code>radius: 4px</code>
                  </div>
                </VStack>

                {/* Basic */}
                <VStack gap={3}>
                  <Label>Basic</Label>
                  <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
                    <TopBar
                      onSidebarToggle={() => console.log('Toggle sidebar')}
                      onBack={() => console.log('Go back')}
                      onForward={() => console.log('Go forward')}
                      breadcrumb={
                        <Breadcrumb
                          items={[
                            { label: 'Home', onClick: () => {} },
                            { label: 'Dashboard', onClick: () => {} },
                            { label: 'Settings' },
                          ]}
                        />
                      }
                      actions={
                        <>
                          <TopBarAction
                            icon={<IconBell size={16} stroke={1.5} />}
                            aria-label="Notifications"
                            onClick={() => console.log('Notifications')}
                          />
                          <TopBarAction
                            icon={<IconUser size={16} stroke={1.5} />}
                            aria-label="Profile"
                            onClick={() => console.log('Profile')}
                          />
                        </>
                      }
                    />
                  </div>
                </VStack>

                {/* With Badge */}
                <VStack gap={3}>
                  <Label>With Notification Badge</Label>
                  <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
                    <TopBar
                      onSidebarToggle={() => console.log('Toggle sidebar')}
                      canGoBack={true}
                      canGoForward={false}
                      breadcrumb={
                        <Breadcrumb
                          items={[
                            { label: 'Projects', onClick: () => {} },
                            { label: 'My Project' },
                          ]}
                        />
                      }
                      actions={
                        <>
                          <TopBarAction
                            icon={<IconBell size={16} stroke={1.5} />}
                            aria-label="Notifications"
                            badge
                          />
                          <TopBarAction
                            icon={<IconBell size={16} stroke={1.5} />}
                            aria-label="Notifications with count"
                            badgeCount={5}
                          />
                          <TopBarAction
                            icon={<IconSettings size={16} stroke={1.5} />}
                            aria-label="Settings"
                          />
                        </>
                      }
                    />
                  </div>
                </VStack>

                {/* Minimal */}
                <VStack gap={3}>
                  <Label>Minimal (No Navigation)</Label>
                  <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
                    <TopBar
                      showNavigation={false}
                      breadcrumb={
                        <Breadcrumb
                          items={[
                            { label: 'Settings' },
                          ]}
                        />
                      }
                      actions={
                        <TopBarAction
                          icon={<IconHelp size={16} stroke={1.5} />}
                          aria-label="Help"
                        />
                      }
                    />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* TabBar Component */}
            <Section id="tabbar" title="TabBar" description="Browser-style tabs with add/close functionality">
              <TabBarDemo />
            </Section>

            {/* Tabs Component */}
            <Section id="tabs" title="Tabs" description="Tabs for navigation between views with underline and boxed variants">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>gap: 24px</code> · <code>min-width: 80px</code> · <code>padding-x: 12px</code> · <code>indicator: 2px</code> · <code>boxed-padding: 24×8px</code>
                  </div>
                </VStack>

                {/* Variants */}
                <VStack gap={3}>
                  <Label>Variants</Label>
                  <VStack gap={4}>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Underline (default)</span>
                      <Tabs defaultValue="tab1" size="sm">
                        <TabList>
                          <Tab value="tab1">menu 1</Tab>
                          <Tab value="tab2">menu 2</Tab>
                          <Tab value="tab3">menu 3</Tab>
                        </TabList>
                      </Tabs>
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Boxed</span>
                      <Tabs defaultValue="left" variant="boxed" size="sm">
                        <TabList>
                          <Tab value="left">left</Tab>
                          <Tab value="right">right</Tab>
                        </TabList>
                      </Tabs>
                    </VStack>
                  </VStack>
                </VStack>

                {/* Boxed - Multiple Items */}
                <VStack gap={3}>
                  <Label>Boxed - Multiple Items</Label>
                  <VStack gap={4}>
                    <Tabs defaultValue="tab1" variant="boxed" size="sm">
                      <TabList>
                        <Tab value="tab1">Tab 1</Tab>
                        <Tab value="tab2">Tab 2</Tab>
                        <Tab value="tab3">Tab 3</Tab>
                      </TabList>
                    </Tabs>
                    <Tabs defaultValue="tab1" variant="boxed" size="sm">
                      <TabList>
                        <Tab value="tab1">Tab 1</Tab>
                        <Tab value="tab2">Tab 2</Tab>
                        <Tab value="tab3">Tab 3</Tab>
                        <Tab value="tab4">Tab 4</Tab>
                      </TabList>
                    </Tabs>
                  </VStack>
                </VStack>

                {/* Sizes */}
                <VStack gap={3}>
                  <Label>Sizes</Label>
                  <VStack gap={4}>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Small (12px)</span>
                      <Tabs defaultValue="tab1" size="sm">
                        <TabList>
                          <Tab value="tab1">menu 1</Tab>
                          <Tab value="tab2">menu 2</Tab>
                          <Tab value="tab3">menu 3</Tab>
                        </TabList>
                      </Tabs>
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Medium (14px)</span>
                      <Tabs defaultValue="tab1" size="md">
                        <TabList>
                          <Tab value="tab1">menu 1</Tab>
                          <Tab value="tab2">menu 2</Tab>
                          <Tab value="tab3">menu 3</Tab>
                        </TabList>
                      </Tabs>
                    </VStack>
                  </VStack>
                </VStack>

                {/* Interactive Example */}
                <VStack gap={3}>
                  <Label>Interactive Example</Label>
                  <Tabs defaultValue="overview" size="sm">
                    <TabList>
                      <Tab value="overview">Overview</Tab>
                      <Tab value="settings">Settings</Tab>
                      <Tab value="logs">Logs</Tab>
                      <Tab value="disabled" disabled>Disabled</Tab>
                    </TabList>
                    <TabPanel value="overview">
                      <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                          Overview panel content goes here.
                        </p>
                      </div>
                    </TabPanel>
                    <TabPanel value="settings">
                      <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                          Settings panel content goes here.
                        </p>
                      </div>
                    </TabPanel>
                    <TabPanel value="logs">
                      <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                        <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                          Logs panel content goes here.
                        </p>
                      </div>
                    </TabPanel>
                  </Tabs>
                </VStack>
              </VStack>
            </Section>

            {/* Disclosure Component */}
            <Section id="disclosure" title="Disclosure" description="Expandable/collapsible content sections">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>gap: 6px</code> · <code>icon: 12px</code> · <code>font: 14px / 20px / medium</code>
                  </div>
                </VStack>

                {/* States */}
                <VStack gap={3}>
                  <Label>States</Label>
                  <div className="flex items-center gap-12">
                    <Disclosure>
                      <Disclosure.Trigger>Collapsed</Disclosure.Trigger>
                    </Disclosure>
                    <Disclosure defaultOpen>
                      <Disclosure.Trigger>Expanded</Disclosure.Trigger>
                    </Disclosure>
                  </div>
                </VStack>

                {/* With Content */}
                <VStack gap={3}>
                  <Label>With Content</Label>
                  <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
                    <Disclosure defaultOpen>
                      <Disclosure.Trigger>Volume Details</Disclosure.Trigger>
                      <Disclosure.Panel>
                        <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                          <p>Name: vol-12345</p>
                          <p>Size: 100 GB</p>
                          <p>Status: Available</p>
                        </div>
                      </Disclosure.Panel>
                    </Disclosure>
                  </div>
                </VStack>

                {/* Multiple */}
                <VStack gap={3}>
                  <Label>Multiple Disclosures</Label>
                  <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] divide-y divide-[var(--color-border-default)]">
                    <div className="p-4">
                      <Disclosure>
                        <Disclosure.Trigger>Section 1</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                            Content for section 1
                          </div>
                        </Disclosure.Panel>
                      </Disclosure>
                    </div>
                    <div className="p-4">
                      <Disclosure>
                        <Disclosure.Trigger>Section 2</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                            Content for section 2
                          </div>
                        </Disclosure.Panel>
                      </Disclosure>
                    </div>
                    <div className="p-4">
                      <Disclosure defaultOpen>
                        <Disclosure.Trigger>Section 3 (Default Open)</Disclosure.Trigger>
                        <Disclosure.Panel>
                          <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                            Content for section 3
                          </div>
                        </Disclosure.Panel>
                      </Disclosure>
                    </div>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* InlineMessage Component */}
            <Section id="inline-message" title="Inline Message" description="Contextual feedback messages for different states">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 12px</code> · <code>gap: 8px</code> · <code>radius: 6px</code> · <code>icon: 16px</code> · <code>font: 12px</code>
                  </div>
                </VStack>

                {/* Variants */}
                <VStack gap={3}>
                  <Label>Variants</Label>
                  <VStack gap={3}>
                    <InlineMessage variant="success">
                      Used for completed or normal operations.
                    </InlineMessage>
                    <InlineMessage variant="warning">
                      Used when attention is needed but not critical.
                    </InlineMessage>
                    <InlineMessage variant="error">
                      Used for failed actions or system issues.
                    </InlineMessage>
                    <InlineMessage variant="info">
                      Used for general or non-critical updates.
                    </InlineMessage>
                  </VStack>
                </VStack>

                {/* Without Icon */}
                <VStack gap={3}>
                  <Label>Without Icon</Label>
                  <InlineMessage variant="info" hideIcon>
                    This message has no icon.
                  </InlineMessage>
                </VStack>

                {/* Long Content */}
                <VStack gap={3}>
                  <Label>Long Content</Label>
                  <InlineMessage variant="warning">
                    This is a longer message that demonstrates how the component handles multi-line content. 
                    The text will wrap naturally and the icon stays aligned to the top.
                  </InlineMessage>
                </VStack>
              </VStack>
            </Section>

            {/* Table Component */}
            <Section id="table" title="Table" description="Data table with sorting, selection, and sticky header">
              <TableDemo />
            </Section>

            {/* Badge Component */}
            <Section id="badge" title="Badge" description="Status indicators and labels with various styles">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-11)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Size</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Padding</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Font Size</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Line Height</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">sm</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">6×2px</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">11px</td>
                          <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">md</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">8×4px</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12px</td>
                          <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">lg</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12×4px</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">14px</td>
                          <td className="py-2 font-mono text-[var(--color-text-muted)]">20px</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
                    <code>radius: 6px</code> · <code>gap: 4px</code> · <code>dot-size: 6px</code>
                  </div>
                </VStack>

                {/* Sizes */}
                <VStack gap={3}>
                  <Label>Sizes</Label>
                  <div className="flex gap-3 items-center">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </VStack>

                {/* Types */}
                <VStack gap={3}>
                  <Label>Types</Label>
                  <div className="flex gap-6">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Solid</span>
                      <div className="flex gap-2">
                        <Badge size="sm" type="solid" theme="blue">Blue</Badge>
                        <Badge size="sm" type="solid" theme="green">Green</Badge>
                        <Badge size="sm" type="solid" theme="red">Red</Badge>
                        <Badge size="sm" type="solid" theme="yellow">Yellow</Badge>
                        <Badge size="sm" type="solid" theme="gray">Gray</Badge>
                      </div>
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Subtle</span>
                      <div className="flex gap-2">
                        <Badge size="sm" type="subtle" theme="blue">Blue</Badge>
                        <Badge size="sm" type="subtle" theme="green">Green</Badge>
                        <Badge size="sm" type="subtle" theme="red">Red</Badge>
                        <Badge size="sm" type="subtle" theme="yellow">Yellow</Badge>
                        <Badge size="sm" type="subtle" theme="gray">Gray</Badge>
                      </div>
                    </VStack>
                  </div>
                </VStack>

                {/* Layout (with icons) */}
                <VStack gap={3}>
                  <Label>Layout (with Icons)</Label>
                  <div className="flex gap-3 items-center">
                    <Badge size="sm" theme="blue">Text Only</Badge>
                    <Badge size="sm" theme="blue" leftIcon={<IconCheck size={10} />}>Left Icon</Badge>
                    <Badge size="sm" theme="blue" rightIcon={<IconArrowRight size={10} />}>Right Icon</Badge>
                  </div>
                </VStack>

                {/* With Dot */}
                <VStack gap={3}>
                  <Label>With Dot Indicator</Label>
                  <div className="flex gap-3 items-center">
                    <Badge size="sm" theme="green" dot>Running</Badge>
                    <Badge size="sm" theme="red" dot>Stopped</Badge>
                    <Badge size="sm" theme="yellow" dot>Pending</Badge>
                    <Badge size="sm" theme="gray" dot>Unknown</Badge>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Badge size="sm" type="subtle" theme="green" dot>Running</Badge>
                    <Badge size="sm" type="subtle" theme="red" dot>Stopped</Badge>
                    <Badge size="sm" type="subtle" theme="yellow" dot>Pending</Badge>
                    <Badge size="sm" type="subtle" theme="gray" dot>Unknown</Badge>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Breadcrumb Component */}
            <Section id="breadcrumb" title="Breadcrumb" description="Navigation path indicator with clickable links">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>gap: 4px</code> · <code>font-size: 11px</code> · <code>line-height: 16px</code> · <code>font-weight: medium</code>
                  </div>
                </VStack>

                {/* Basic Usage */}
                <VStack gap={3}>
                  <Label>Basic Usage</Label>
                  <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <Breadcrumb
                      items={[
                        { label: 'Home', onClick: () => {} },
                        { label: 'Compute', onClick: () => {} },
                        { label: 'Instances', onClick: () => {} },
                        { label: 'web-large' },
                      ]}
                    />
                  </div>
                </VStack>

                {/* Long Path */}
                <VStack gap={3}>
                  <Label>Long Path</Label>
                  <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <Breadcrumb
                      items={[
                        { label: 'Home', onClick: () => {} },
                        { label: 'Instance Snapshots', onClick: () => {} },
                        { label: 'Instance Snapshots', onClick: () => {} },
                        { label: 'Instance Snapshots', onClick: () => {} },
                        { label: 'web-large' },
                      ]}
                    />
                  </div>
                </VStack>

                {/* States */}
                <VStack gap={3}>
                  <Label>States</Label>
                  <div className="grid grid-cols-3 gap-4 text-[length:var(--font-size-10)]">
                    <div className="flex flex-col gap-2 items-center">
                      <span className="text-[var(--color-text-subtle)]">Default</span>
                      <span className="text-[var(--breadcrumb-text-color)] font-medium">Home</span>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <span className="text-[var(--color-text-subtle)]">Hover</span>
                      <span className="text-[var(--breadcrumb-text-hover)] font-medium">Home</span>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <span className="text-[var(--color-text-subtle)]">Current</span>
                      <span className="text-[var(--breadcrumb-text-current)] font-medium">web-large</span>
                    </div>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Status Indicator Component */}
            <Section id="status-indicator" title="Status Indicator" description="Server/instance status indicators with predefined states">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 6×4px</code> · <code>gap: 4px</code> · <code>radius: pill (16px)</code> · <code>font-size: 11px</code> · <code>icon: 14px</code>
                  </div>
                </VStack>

                {/* All Status Types by Category */}
                <VStack gap={3}>
                  <Label>Success (Green)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="active" />
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Danger (Red)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="error" />
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Info (Blue)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="building" />
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Warning (Orange)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="verify-resized" />
                    <StatusIndicator status="degraded" />
                    <StatusIndicator status="no-monitor" />
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Muted (Gray)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="suspended" />
                    <StatusIndicator status="shelved-offloaded" />
                    <StatusIndicator status="mounted" />
                    <StatusIndicator status="shutoff" />
                    <StatusIndicator status="paused" />
                    <StatusIndicator status="pending" />
                    <StatusIndicator status="draft" />
                    <StatusIndicator status="deactivated" />
                    <StatusIndicator status="in-use" />
                    <StatusIndicator status="maintenance" />
                    <StatusIndicator status="down" />
                  </div>
                </VStack>

                {/* Layout Variants - Icon Only (All Cases) */}
                <VStack gap={3}>
                  <Label>Icon Only - All Status Types</Label>
                  <VStack gap={4}>
                    {/* Success */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Success (Green)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="active" layout="icon-only" />
                      </div>
                    </VStack>
                    {/* Danger */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Danger (Red)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="error" layout="icon-only" />
                      </div>
                    </VStack>
                    {/* Info */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Info (Blue)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="building" layout="icon-only" />
                      </div>
                    </VStack>
                    {/* Warning */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Warning (Orange)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="verify-resized" layout="icon-only" />
                        <StatusIndicator status="degraded" layout="icon-only" />
                        <StatusIndicator status="no-monitor" layout="icon-only" />
                      </div>
                    </VStack>
                    {/* Muted */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Muted (Gray)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="suspended" layout="icon-only" />
                        <StatusIndicator status="shelved-offloaded" layout="icon-only" />
                        <StatusIndicator status="mounted" layout="icon-only" />
                        <StatusIndicator status="shutoff" layout="icon-only" />
                        <StatusIndicator status="paused" layout="icon-only" />
                        <StatusIndicator status="pending" layout="icon-only" />
                        <StatusIndicator status="draft" layout="icon-only" />
                        <StatusIndicator status="deactivated" layout="icon-only" />
                        <StatusIndicator status="in-use" layout="icon-only" />
                        <StatusIndicator status="maintenance" layout="icon-only" />
                        <StatusIndicator status="down" layout="icon-only" />
                      </div>
                    </VStack>
                  </VStack>
                </VStack>

                {/* Custom Labels */}
                <VStack gap={3}>
                  <Label>Custom Labels</Label>
                  <div className="flex gap-3 items-center">
                    <StatusIndicator status="active" label="Running" />
                    <StatusIndicator status="error" label="Failed" />
                    <StatusIndicator status="building" label="Deploying..." />
                  </div>
                </VStack>

                {/* Color Reference - Semantic Status Tokens */}
                <VStack gap={3}>
                  <Label>Semantic Color Tokens</Label>
                  <div className="grid grid-cols-5 gap-2 text-[length:var(--font-size-10)]">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[var(--status-success-bg)]" />
                      <span className="text-[var(--color-text-subtle)]">--status-success-bg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[var(--status-danger-bg)]" />
                      <span className="text-[var(--color-text-subtle)]">--status-danger-bg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[var(--status-info-bg)]" />
                      <span className="text-[var(--color-text-subtle)]">--status-info-bg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[var(--status-warning-bg)]" />
                      <span className="text-[var(--color-text-subtle)]">--status-warning-bg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-[var(--status-muted-bg)]" />
                      <span className="text-[var(--color-text-subtle)]">--status-muted-bg</span>
                    </div>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Tooltip Component */}
            <Section id="tooltip" title="Tooltip" description="Contextual information on hover">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 8×4px</code> · <code>radius: 4px</code> · <code>font-size: 11px</code> · <code>min-width: 60px</code> · <code>max-width: 230px</code> · <code>arrow: 4px</code>
                  </div>
                </VStack>

                {/* Positions */}
                <VStack gap={3}>
                  <Label>Positions</Label>
                  <div className="flex gap-6 items-center justify-center py-8">
                    <Tooltip content="Top tooltip" position="top">
                      <Button variant="secondary" size="sm">Top</Button>
                    </Tooltip>
                    <Tooltip content="Bottom tooltip" position="bottom">
                      <Button variant="secondary" size="sm">Bottom</Button>
                    </Tooltip>
                    <Tooltip content="Left tooltip" position="left">
                      <Button variant="secondary" size="sm">Left</Button>
                    </Tooltip>
                    <Tooltip content="Right tooltip" position="right">
                      <Button variant="secondary" size="sm">Right</Button>
                    </Tooltip>
                  </div>
                </VStack>

                {/* Examples */}
                <VStack gap={3}>
                  <Label>Use Cases</Label>
                  <div className="flex gap-4 items-center">
                    <Tooltip content="Delete this item permanently">
                      <Button variant="danger" icon={<IconTrash size={16} />} aria-label="Delete" />
                    </Tooltip>
                    <Tooltip content="Add to favorites">
                      <Button variant="ghost" icon={<IconStar size={16} />} aria-label="Favorite" />
                    </Tooltip>
                    <Tooltip content="Copy to clipboard">
                      <Button variant="secondary" icon={<IconCopy size={16} />} aria-label="Copy" />
                    </Tooltip>
                    <Tooltip content="This action requires admin permissions" position="bottom">
                      <Badge variant="warning">Restricted</Badge>
                    </Tooltip>
                  </div>
                </VStack>

                {/* With Delay */}
                <VStack gap={3}>
                  <Label>Custom Delay</Label>
                  <div className="flex gap-4 items-center">
                    <Tooltip content="Instant (0ms)" delay={0}>
                      <Button variant="outline" size="sm">0ms</Button>
                    </Tooltip>
                    <Tooltip content="Default (200ms)" delay={200}>
                      <Button variant="outline" size="sm">200ms</Button>
                    </Tooltip>
                    <Tooltip content="Slow (500ms)" delay={500}>
                      <Button variant="outline" size="sm">500ms</Button>
                    </Tooltip>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* WindowControl Component */}
            <Section id="window-control" title="Window Control" description="Window control buttons for minimize, maximize, and close actions">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>size: 16×16px</code> · <code>radius: 4px</code> · <code>gap: 4px</code>
                  </div>
                </VStack>

                {/* Individual Controls */}
                <VStack gap={3}>
                  <Label>Individual Controls</Label>
                  <div className="flex gap-6 items-center">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Minimize</span>
                      <WindowControl type="minimize" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Maximize</span>
                      <WindowControl type="maximize" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Close</span>
                      <WindowControl type="close" />
                    </VStack>
                  </div>
                </VStack>

                {/* Controls Group */}
                <VStack gap={3}>
                  <Label>Controls Group</Label>
                  <div className="flex gap-6 items-center">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">All Controls</span>
                      <WindowControls />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Minimize + Close</span>
                      <WindowControls showMaximize={false} />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Close Only</span>
                      <WindowControls showMinimize={false} showMaximize={false} />
                    </VStack>
                  </div>
                </VStack>

                {/* In Context */}
                <VStack gap={3}>
                  <Label>In Context (Header Bar)</Label>
                  <div className="flex items-center justify-between w-full max-w-[400px] h-10 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <span className="text-[length:var(--font-size-12)] font-medium">Application Title</span>
                    <WindowControls />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* DetailHeader Component */}
            <Section id="detail-header" title="Detail Header" description="Page header component for resource detail views with title, actions, and info cards">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 16px</code> · <code>radius: 8px</code> · <code>title: 16px semibold</code> · <code>info-card.padding: 16×12px</code> · <code>info-card.radius: 8px</code>
                  </div>
                </VStack>

                {/* Basic Example */}
                <VStack gap={3}>
                  <Label>Basic Usage</Label>
                  <DetailHeader>
                    <DetailHeader.Title>Instance Name</DetailHeader.Title>
                    <DetailHeader.Actions>
                      <Button variant="secondary" size="sm">Start</Button>
                      <Button variant="secondary" size="sm">Stop</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </DetailHeader.Actions>
                    <DetailHeader.InfoGrid>
                      <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                      <DetailHeader.InfoCard label="ID" value="abc123-def456" copyable />
                      <DetailHeader.InfoCard label="Created At" value="2025-01-15 10:30:00" />
                    </DetailHeader.InfoGrid>
                  </DetailHeader>
                </VStack>

                {/* With Different Status */}
                <VStack gap={3}>
                  <Label>Different Status States</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailHeader.InfoCard label="Active" value="Running" status="active" />
                    <DetailHeader.InfoCard label="Shutoff" value="Stopped" status="shutoff" />
                    <DetailHeader.InfoCard label="Degraded" value="Degraded" status="degraded" />
                    <DetailHeader.InfoCard label="Error" value="Failed" status="error" />
                  </div>
                </VStack>

                {/* With Copy Button */}
                <VStack gap={3}>
                  <Label>Copyable Info Cards</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailHeader.InfoCard label="Instance ID" value="i-0abc123def456789" copyable />
                    <DetailHeader.InfoCard label="IP Address" value="192.168.1.100" copyable />
                  </div>
                </VStack>

                {/* Full Example */}
                <VStack gap={3}>
                  <Label>Full Example (VM Detail Page)</Label>
                  <DetailHeader>
                    <DetailHeader.Title>web-server-01</DetailHeader.Title>
                    <DetailHeader.Actions>
                      <Button variant="secondary" size="sm" leftIcon={<IconTerminal2 size={12} />}>Console</Button>
                      <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>Start</Button>
                      <Button variant="secondary" size="sm" leftIcon={<IconPlayerStop size={12} />}>Stop</Button>
                      <Button variant="secondary" size="sm" leftIcon={<IconRefresh size={12} />}>Reboot</Button>
                      <Button variant="destructive" size="sm" leftIcon={<IconTrash size={12} />}>Delete</Button>
                    </DetailHeader.Actions>
                    <DetailHeader.InfoGrid>
                      <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                      <DetailHeader.InfoCard label="ID" value="7284d9174e81431e93060a9bbcf2cdfd" copyable />
                      <DetailHeader.InfoCard label="Host" value="compute-03" />
                      <DetailHeader.InfoCard label="Created At" value="2025-07-25 09:12:20" />
                    </DetailHeader.InfoGrid>
                  </DetailHeader>
                </VStack>
              </VStack>
            </Section>

            {/* SectionCard Component */}
            <Section id="section-card" title="Section Card" description="Container component for grouping related content in detail views">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 16×12px</code> · <code>radius: 6px (md)</code> · <code>header.height: 32px</code> · <code>title: 14px medium</code> · <code>label: 11px medium</code> · <code>value: 12px</code>
                  </div>
                </VStack>

                {/* Basic Example */}
                <VStack gap={3}>
                  <Label>Basic Usage</Label>
                  <SectionCard>
                    <SectionCard.Header title="Basic Information" />
                    <SectionCard.Content>
                      <SectionCard.DataRow label="Instance Name" value="web-server-01" />
                      <SectionCard.DataRow label="Availability Zone" value="nova" />
                      <SectionCard.DataRow label="Description" value="Production web server" />
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>

                {/* With Actions */}
                <VStack gap={3}>
                  <Label>With Action Buttons</Label>
                  <SectionCard>
                    <SectionCard.Header 
                      title="Basic Information" 
                      actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={16} />}>Edit</Button>}
                    />
                    <SectionCard.Content>
                      <SectionCard.DataRow label="Instance Name" value="web-server-01" />
                      <SectionCard.DataRow label="Availability Zone" value="nova" />
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>

                {/* With Links */}
                <VStack gap={3}>
                  <Label>With Link Values</Label>
                  <SectionCard>
                    <SectionCard.Header title="Flavor" />
                    <SectionCard.Content>
                      <SectionCard.DataRow label="Flavor Name" value="m1.large" isLink linkHref="/flavors" />
                      <SectionCard.DataRow label="Spec" value="vCPU: 4 / RAM: 8 GiB / Disk: 80 GiB" />
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>

                {/* Multiple Sections Example */}
                <VStack gap={3}>
                  <Label>Multiple Sections (Detail Page Layout)</Label>
                  <VStack gap={4}>
                    <SectionCard>
                      <SectionCard.Header 
                        title="Basic Information" 
                        actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={16} />}>Edit</Button>}
                      />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Instance Name" value="tk-test" />
                        <SectionCard.DataRow label="Availability Zone" value="nova" />
                        <SectionCard.DataRow label="Description" value="-" />
                      </SectionCard.Content>
                    </SectionCard>

                    <SectionCard>
                      <SectionCard.Header title="Flavor" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Flavor Name" value="web-server-10" isLink linkHref="/flavors" />
                        <SectionCard.DataRow label="Spec" value="vCPU: 1 / RAM: 4 GiB / Disk: 40 GiB / GPU: 1" />
                      </SectionCard.Content>
                    </SectionCard>

                    <SectionCard>
                      <SectionCard.Header title="Image" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Image" value="web-server-10" isLink linkHref="/images" />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>
                </VStack>
              </VStack>
            </Section>

            {/* Menu Component */}
            <Section id="menu" title="Menu" description="Navigation menu with sections, items, and dividers">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>item.padding: 8×6px</code> · <code>item.gap: 6px</code> · <code>item.radius: 6px (md)</code> · <code>section.padding: 8×4px</code> · <code>divider.margin: 8px</code>
                  </div>
                </VStack>

                {/* Example */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VStack gap={3}>
                    <Label>Menu Items</Label>
                    <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
                      <MenuItem icon={<IconHome size={16} />} label="Home" />
                      <MenuItem icon={<IconServer size={16} />} label="Instances" active badge="6" />
                      <MenuItem icon={<IconSettings size={16} />} label="Settings" />
                      <MenuDivider />
                      <MenuItem icon={<IconUser size={16} />} label="Profile" />
                    </div>
                  </VStack>

                  <VStack gap={3}>
                    <Label>Collapsible Section</Label>
                    <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
                      <MenuSection title="Storage">
                        <MenuItem label="Volumes" />
                        <MenuItem label="Snapshots" />
                        <MenuItem label="Backups" />
                      </MenuSection>
                      <MenuSection title="Network">
                        <MenuItem label="Security Groups" />
                        <MenuItem label="Floating IPs" />
                      </MenuSection>
                    </div>
                  </VStack>
                </div>
              </VStack>
            </Section>

            {/* ContextMenu Component */}
            <Section id="context-menu" title="Context Menu" description="Popup menu triggered by right-click or click with submenu support">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>min-width: 80px</code> · <code>padding: 12×6px</code> · <code>radius: 6px</code> · <code>shadow: md</code>
                  </div>
                </VStack>

                {/* Right Click Trigger */}
                <VStack gap={3}>
                  <Label>Right Click Trigger</Label>
                  <ContextMenu
                    trigger="contextmenu"
                    items={[
                      { id: 'edit', label: 'Edit', onClick: () => {} },
                      { id: 'duplicate', label: 'Duplicate', onClick: () => {} },
                      { id: 'copy', label: 'Copy', onClick: () => {}, divider: true },
                      { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
                    ]}
                  >
                    <div className="w-[200px] h-[100px] flex items-center justify-center bg-[var(--color-surface-subtle)] border border-dashed border-[var(--color-border-default)] rounded-[var(--radius-md)] text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                      Right-click here
                    </div>
                  </ContextMenu>
                </VStack>

                {/* Click Trigger */}
                <VStack gap={3}>
                  <Label>Click Trigger</Label>
                  <ContextMenu
                    trigger="click"
                    items={[
                      { id: 'view', label: 'View Details', onClick: () => {} },
                      { id: 'edit', label: 'Edit', onClick: () => {} },
                      { id: 'share', label: 'Share', onClick: () => {}, divider: true },
                      { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
                    ]}
                  >
                    <Button variant="outline" size="sm">Click for Menu</Button>
                  </ContextMenu>
                </VStack>

                {/* With Submenu */}
                <VStack gap={3}>
                  <Label>With Submenu</Label>
                  <ContextMenu
                    trigger="click"
                    items={[
                      { id: 'new', label: 'New', submenu: [
                        { id: 'new-file', label: 'File', onClick: () => {} },
                        { id: 'new-folder', label: 'Folder', onClick: () => {} },
                      ]},
                      { id: 'open', label: 'Open', onClick: () => {} },
                      { id: 'save', label: 'Save', onClick: () => {}, divider: true },
                      { id: 'export', label: 'Export', submenu: [
                        { id: 'export-pdf', label: 'PDF', onClick: () => {} },
                        { id: 'export-csv', label: 'CSV', onClick: () => {} },
                        { id: 'export-json', label: 'JSON', onClick: () => {} },
                      ]},
                    ]}
                  >
                    <Button variant="outline" size="sm">Menu with Submenu</Button>
                  </ContextMenu>
                </VStack>

                {/* Status Variants */}
                <VStack gap={3}>
                  <Label>Status Variants</Label>
                  <ContextMenu
                    trigger="click"
                    items={[
                      { id: 'item1', label: 'Default Item', onClick: () => {} },
                      { id: 'item2', label: 'Another Item', onClick: () => {}, divider: true },
                      { id: 'danger1', label: 'Warning Action', status: 'danger', onClick: () => {} },
                      { id: 'danger2', label: 'Delete Forever', status: 'danger', onClick: () => {} },
                    ]}
                  >
                    <Button variant="outline" size="sm">Show Status Variants</Button>
                  </ContextMenu>
                </VStack>
              </VStack>
            </Section>

            {/* Modal Component */}
            <Section id="modal" title="Modal" description="Dialog overlay for confirmations, alerts, and user interactions">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 16px</code> · <code>gap: 24px</code> · <code>radius: 16px</code> · <code>backdrop: black/60</code>
                  </div>
                </VStack>

                {/* Basic Modal */}
                <VStack gap={3}>
                  <Label>Basic Modal</Label>
                  <ModalDemo variant="basic" />
                </VStack>

                {/* Confirm Modal */}
                <VStack gap={3}>
                  <Label>Confirm Modal (Delete)</Label>
                  <ModalDemo variant="delete" />
                </VStack>

                {/* Sizes */}
                <VStack gap={3}>
                  <Label>Sizes</Label>
                  <div className="flex gap-2">
                    <ModalDemo variant="size-sm" />
                    <ModalDemo variant="size-md" />
                    <ModalDemo variant="size-lg" />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Drawer Component */}
            <Section id="drawer" title="Drawer" description="Slide-out panel for forms, details, and secondary content">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>width: 376px (default)</code> · <code>padding-x: 24px</code> · <code>padding-y: 16px</code> · <code>animation: 300ms ease-out</code>
                  </div>
                </VStack>

                {/* Interactive Demo */}
                <VStack gap={3}>
                  <Label>Interactive Demo</Label>
                  <DrawerDemo />
                </VStack>

                {/* Specifications */}
                <VStack gap={3}>
                  <Label>Specifications</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-12)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Property</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Type</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Default</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">isOpen</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Whether the drawer is open</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">onClose</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">() =&gt; void</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Callback when drawer should close</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">title</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Drawer title</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">width</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">string | number</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">320</td>
                          <td className="py-2 text-[var(--color-text-default)]">Width of the drawer</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">side</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">'left' | 'right'</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">'right'</td>
                          <td className="py-2 text-[var(--color-text-default)]">Side from which drawer appears</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">footer</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">ReactNode</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Footer content (typically action buttons)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">showCloseButton</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                          <td className="py-2 text-[var(--color-text-default)]">Whether to show close button</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">closeOnBackdropClick</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                          <td className="py-2 text-[var(--color-text-default)]">Whether clicking backdrop closes drawer</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Layout Section */}
            <Section id="layout" title="Layout" description="Application layout structure with responsive sidebar">
              <VStack gap={8}>
                {/* Layout Specs */}
                <VStack gap={4}>
                  <Label>Layout Specifications</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-12)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Breakpoint</th>
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Width</th>
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Sidebar</th>
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Content Area</th>
                          <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">Features</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">Desktop (Default)</td>
                          <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">1920px</td>
                          <td className="py-3 pr-4 text-[var(--color-text-default)]">200px (collapsible)</td>
                          <td className="py-3 pr-4 text-[var(--color-text-muted)]">1720px max</td>
                          <td className="py-3 text-[var(--color-text-muted)]">Sidebar toggle</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">Laptop (Min)</td>
                          <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">1440px</td>
                          <td className="py-3 pr-4 text-[var(--color-text-default)]">200px (collapsible)</td>
                          <td className="py-3 pr-4 text-[var(--color-text-muted)]">1240px max</td>
                          <td className="py-3 text-[var(--color-text-muted)]">Sidebar toggle</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </VStack>

                {/* Visual Diagram - Desktop */}
                <VStack gap={4}>
                  <Label>Desktop Layout (1920px)</Label>
                  <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-muted)]">
                    <div className="flex h-[200px]">
                      {/* Sidebar */}
                      <div className="w-[52px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
                        <div className="p-2 border-b border-[var(--color-border-subtle)]">
                          <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
                            <span className="text-[6px] font-bold text-white">TDS</span>
                          </div>
                        </div>
                        <div className="flex-1 p-2 space-y-1">
                          <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                          <div className="h-2 bg-[var(--color-action-primary)] rounded opacity-50" />
                          <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                          <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                        </div>
                        <div className="p-2 border-t border-[var(--color-border-subtle)] flex justify-center">
                          <IconChevronLeft size={12} className="text-[var(--color-text-muted)]" />
                        </div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col gap-3">
                        <div className="h-4 w-32 bg-[var(--color-surface-default)] rounded" />
                        <div className="flex-1 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-3">
                          <div className="space-y-2">
                            <div className="h-2 bg-[var(--color-border-subtle)] rounded w-3/4" />
                            <div className="h-2 bg-[var(--color-border-subtle)] rounded w-1/2" />
                            <div className="h-2 bg-[var(--color-border-subtle)] rounded w-2/3" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Dimensions */}
                    <div className="flex border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                      <div className="w-[52px] py-2 text-center border-r border-[var(--color-border-default)]">
                        <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-action-primary)]">200px</span>
                      </div>
                      <div className="flex-1 py-2 text-center">
                        <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-muted)]">Content Area (1720px max)</span>
                      </div>
                    </div>
                  </div>
                </VStack>

                {/* Visual Diagram - Laptop */}
                <VStack gap={4}>
                  <Label>Laptop Layout (1440px)</Label>
                  <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-muted)] max-w-[600px]">
                    <div className="flex h-[160px]">
                      {/* Sidebar */}
                      <div className="w-[42px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col">
                        <div className="p-1.5 border-b border-[var(--color-border-subtle)]">
                          <div className="w-5 h-5 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
                            <span className="text-[5px] font-bold text-white">TDS</span>
                          </div>
                        </div>
                        <div className="flex-1 p-1.5 space-y-1">
                          <div className="h-1.5 bg-[var(--color-surface-muted)] rounded" />
                          <div className="h-1.5 bg-[var(--color-action-primary)] rounded opacity-50" />
                          <div className="h-1.5 bg-[var(--color-surface-muted)] rounded" />
                        </div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 p-3 flex flex-col gap-2">
                        <div className="h-3 w-24 bg-[var(--color-surface-default)] rounded" />
                        <div className="flex-1 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] p-2">
                          <div className="space-y-1.5">
                            <div className="h-1.5 bg-[var(--color-border-subtle)] rounded w-3/4" />
                            <div className="h-1.5 bg-[var(--color-border-subtle)] rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Dimensions */}
                    <div className="flex border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                      <div className="w-[42px] py-1.5 text-center border-r border-[var(--color-border-default)]">
                        <span className="text-[length:var(--font-size-9)] font-mono text-[var(--color-action-primary)]">200px</span>
                      </div>
                      <div className="flex-1 py-1.5 text-center">
                        <span className="text-[length:var(--font-size-9)] font-mono text-[var(--color-text-muted)]">Content (1240px max)</span>
                      </div>
                    </div>
                  </div>
                </VStack>

                {/* Sidebar Toggle States */}
                <VStack gap={4}>
                  <Label>Sidebar States</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Expanded */}
                    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
                      <div className="flex h-[120px] bg-[var(--color-surface-muted)]">
                        <div className="w-[60px] bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] p-2">
                          <div className="space-y-2">
                            <div className="h-2 bg-[var(--color-action-primary)] rounded opacity-50" />
                            <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                            <div className="h-2 bg-[var(--color-surface-muted)] rounded" />
                          </div>
                        </div>
                        <div className="flex-1 p-3">
                          <div className="h-full bg-[var(--color-surface-default)] rounded" />
                        </div>
                      </div>
                      <div className="p-2 bg-[var(--color-surface-default)] border-t border-[var(--color-border-default)] text-center">
                        <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)]">Sidebar Expanded</span>
                      </div>
                    </div>
                    {/* Collapsed */}
                    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
                      <div className="flex h-[120px] bg-[var(--color-surface-muted)]">
                        <div className="w-0 bg-[var(--color-surface-default)] overflow-hidden transition-all" />
                        <div className="flex-1 p-3">
                          <div className="h-full bg-[var(--color-surface-default)] rounded flex items-start p-2">
                            <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center cursor-pointer">
                              <IconMenu2 size={12} className="text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 bg-[var(--color-surface-default)] border-t border-[var(--color-border-default)] text-center">
                        <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)]">Sidebar Collapsed</span>
                      </div>
                    </div>
                  </div>
                </VStack>

                {/* CSS Variables */}
                <VStack gap={3}>
                  <Label>Layout Tokens</Label>
                  <pre className="text-[length:var(--font-size-11)] p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] overflow-x-auto text-[var(--color-text-muted)]">
{`/* Layout Variables */
--layout-max-width: 1920px;      /* Maximum viewport */
--layout-min-width: 1440px;      /* Minimum supported */
--layout-sidebar-width: 200px;   /* Fixed sidebar width */
--layout-sidebar-collapsed: 0px; /* Collapsed state */

/* Content Area */
--layout-content-padding: var(--spacing-8);  /* 32px */
--layout-content-max-width: calc(100% - var(--layout-sidebar-width));

/* Responsive behavior */
@media (max-width: 1440px) {
  /* Maintain same structure, content scales */
}`}
                  </pre>
                </VStack>

                {/* Notes */}
                <div className="p-4 bg-[var(--color-state-info-bg)] rounded-[var(--radius-md)]">
                  <div className="text-[length:var(--font-size-12)] text-[var(--color-state-info)]">
                    <strong>📐 Layout Guidelines:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Sidebar는 200px 고정, 숨김/표시 토글 가능</li>
                      <li>1920px에서 1440px까지 반응형 지원</li>
                      <li>1440px 미만은 모바일 레이아웃 (추후 확장)</li>
                      <li>Content area는 sidebar 상태에 따라 자동 조절</li>
                    </ul>
                  </div>
                </div>
              </VStack>
            </Section>

          </VStack>
        </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-10 h-10 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <IconChevronUp size={20} stroke={2} />
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------
   Helper Components
   ---------------------------------------- */

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <VStack id={id} gap={6} align="stretch" className="p-6 bg-[var(--color-surface-default)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] scroll-mt-6">
      <VStack gap={1} align="start">
        <h2 className="text-[length:var(--font-size-18)] font-semibold text-[var(--color-text-default)]">{title}</h2>
        <p className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">{description}</p>
      </VStack>
      {children}
    </VStack>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] uppercase tracking-wider">{children}</span>;
}

function ColorSwatch({ name, color, textLight = false }: { name: string; color: string; textLight?: boolean }) {
  return (
    <div 
      className="w-full h-12 rounded-[var(--radius-md)] flex items-center justify-center border border-[var(--color-border-subtle)]" 
      style={{ backgroundColor: color }}
    >
      <span className={`text-[10px] font-mono ${textLight ? 'text-white' : 'text-black'}`}>{name}</span>
    </div>
  );
}

function SemanticColorBox({ name, color, border = false }: { name: string; color: string; border?: boolean }) {
  return (
    <VStack gap={1} align="center">
      <div className={`w-10 h-10 rounded-[var(--radius-md)] ${border ? 'border border-[var(--color-border-default)]' : ''}`} style={{ backgroundColor: color }} />
      <span className="text-[8px] font-mono text-[var(--color-text-disabled)] truncate max-w-10">{name}</span>
    </VStack>
  );
}

function SpacingSwatch({ name, value }: { name: string; value: string }) {
  const numericValue = parseInt(value);
  return (
    <VStack gap={1} align="center">
      <div className="bg-[var(--color-action-primary)] rounded-sm min-w-1" style={{ width: Math.max(numericValue, 4), height: 20 }} />
      <span className="text-[9px] font-mono text-[var(--color-text-disabled)]">{name}</span>
      <span className="text-[8px] font-mono text-[var(--color-text-disabled)]">{value}</span>
    </VStack>
  );
}

function TokenCard({ title, description, items, color, textColor }: { title: string; description: string; items: string[]; color: string; textColor: string }) {
  return (
    <VStack gap={3} className="p-4 rounded-[var(--radius-lg)]" style={{ backgroundColor: color }}>
      <VStack gap={1}>
        <span className="text-[length:var(--font-size-14)] font-semibold" style={{ color: textColor }}>{title}</span>
        <span className="text-[length:var(--font-size-11)]" style={{ color: textColor, opacity: 0.8 }}>{description}</span>
      </VStack>
      <ul className="text-[length:var(--font-size-10)] space-y-1" style={{ color: textColor, opacity: 0.9 }}>
        {items.map((item, i) => <li key={i}>• {item}</li>)}
      </ul>
    </VStack>
  );
}

function IconGrid({ title, icons }: { title: string; icons: { Icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>; name: string; missing?: boolean }[] }) {
  return (
    <VStack gap={3}>
      <Label>{title}</Label>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {icons.map(({ Icon, name, missing }, i) => (
          <div
            key={i}
            title={missing ? `⚠️ ${name} (needs custom icon)` : name}
            className={`flex flex-col items-center gap-2 p-3 rounded-[var(--radius-md)] border transition-colors cursor-default group ${
              missing
                ? 'bg-[var(--color-state-warning-bg)] border-[var(--color-state-warning)] border-dashed hover:bg-[var(--color-yellow-100)]'
                : 'bg-[var(--color-surface-subtle)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-surface-default)]'
            }`}
          >
            <Icon size={18} stroke={1.5} className={`shrink-0 transition-colors ${missing ? 'text-[var(--color-state-warning)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)]'}`} />
            <span className={`text-[length:var(--font-size-10)] transition-colors truncate w-full text-center ${missing ? 'text-[var(--color-state-warning-text)]' : 'text-[var(--color-text-disabled)] group-hover:text-[var(--color-text-subtle)]'}`}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </VStack>
  );
}
