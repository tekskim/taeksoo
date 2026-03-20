import { useState, useMemo, useCallback } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Button, SearchInput, Select, SectionCard, VStack, HStack } from '@/design-system';
import {
  // Actions - Media Controls
  IconPlayerPlay,
  IconPlayerStop,
  IconPlayerPause,
  IconRefresh,
  IconRefreshDot,
  IconRotate,
  IconRotateClockwise,
  IconPower,
  IconCircleX,
  // Actions - CRUD
  IconPlus,
  IconCirclePlus,
  IconSquarePlus,
  IconMinus,
  IconPencil,
  IconEdit,
  IconTrash,
  IconTrashX,
  IconCopy,
  // Actions - Transfer
  IconDownload,
  IconUpload,
  IconShare,
  IconSend,
  IconTransfer,
  IconLink,
  IconUnlink,
  IconLinkOff,
  IconExternalLink,
  // Navigation - Chevrons & Arrows
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconChevronsRight,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconArrowDown,
  IconCaretRightFilled,
  IconCaretDownFilled,
  // Navigation - Expand & Menu
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconLayoutSidebarLeftCollapse,
  IconDotsCircleHorizontal,
  IconDots,
  IconDotsVertical,
  IconMenu2,
  // Status - Success & Error
  IconCircleCheck,
  IconCheck,
  IconShieldCheck,
  IconShieldX,
  IconAlertCircle,
  IconAlertTriangle,
  IconAlertOctagon,
  IconInfoCircle,
  IconHelpCircle,
  // Status - State
  IconCircle,
  IconCircleFilled,
  IconCircleOff,
  IconBan,
  IconTool,
  IconLoader,
  IconLoader2,
  IconProgress,
  IconInfinity,
  // UI - Common
  IconSearch,
  IconFilter,
  IconSettings,
  IconHome,
  IconX,
  IconList,
  IconLayoutGrid,
  IconGridDots,
  IconArrowsSort,
  IconGripVertical,
  IconSelector,
  IconSquare,
  IconTag,
  IconPhoto,
  IconSlash,
  IconMapPin,
  // UI - Notifications & Favorites
  IconBell,
  IconBellRinging,
  IconStar,
  IconStarFilled,
  IconHeart,
  IconTarget,
  IconPoint,
  // UI - Visibility & Security
  IconEye,
  IconEyeOff,
  IconLock,
  IconLockOpen,
  IconShield,
  IconShieldLock,
  IconKey,
  // UI - User & Communication
  IconUser,
  IconUserCircle,
  IconMail,
  IconMessage,
  IconMessagePlus,
  IconHelp,
  IconQuestionMark,
  IconLogout,
  // UI - Theme
  IconSun,
  IconMoon,
  IconPalette,
  // Infrastructure - Compute
  IconServer,
  IconServer2,
  IconCube,
  IconCpu,
  IconServerCog,
  IconServerOff,
  IconCloud,
  // Infrastructure - Network
  IconNetwork,
  IconRouter,
  IconPlug,
  IconPlugConnected,
  IconScale,
  IconWorldWww,
  IconWifiOff,
  // Infrastructure - Storage
  IconDatabase,
  IconDatabaseSearch,
  IconDeviceFloppy,
  IconDeviceSdCard,
  IconBoxMultiple,
  // Infrastructure - Security
  IconCertificate,
  // Storage & Files
  IconCamera,
  IconDisc,
  IconFile,
  IconFileText,
  IconFolder,
  IconFolderOpen,
  IconArchive,
  IconTemplate,
  IconStack2,
  IconCode,
  // Monitoring & Analytics
  IconTerminal,
  IconTerminal2,
  IconActivity,
  IconChartBar,
  IconGauge,
  IconDeviceDesktop,
  IconDeviceDesktopAnalytics,
  IconLayoutDashboard,
  // Organization & Structure
  IconTopologyRing,
  IconTopologyStar3,
  IconBuilding,
  IconCategory,
  IconLayoutSidebar,
  IconAdjustments,
  IconBolt,
  IconGitBranch,
  // Time & Schedule
  IconClock,
  IconHourglass,
  IconStopwatch,
  IconHistory,
  IconArticle,
  IconCalendar,
  // Business & Finance
  IconCurrencyDollar,
  IconLanguage,
  // AI & ML
  IconBrain,
  IconRobot,
  IconRobotFace,
  IconMessageChatbot,
  IconBook,
  IconTestPipe,
  // OS / Brand
  IconBrandDebian,
  IconBrandWindows,
  IconBrandRedhat,
  IconGrid3x3,
  IconCircleDot,
  // Sidebar Icons - Additional
  IconBucket,
  IconCpu2,
  IconDatabaseExport,
  IconDatabaseCog,
  IconLoadBalancer,
  IconTopologyStar,
  IconTimelineEvent,
  IconArrowsShuffle,
  IconArrowsJoin2,
  IconReorder,
  IconChartPie3,
  IconRulerMeasure,
  IconListSearch,
  IconAffiliate,
  IconFolders,
  IconRocket,
  IconStack3,
  IconFileSettings,
  IconBrandSpeedtest,
  IconUsers,
  IconUsersGroup,
  IconFileDescription,
  IconFileCode,
  IconWorld,
  IconUserCog,
  IconCalendarTime,
  IconCompass,
  IconPackages,
  IconMessageCircle,
  IconRoute,
  IconMessages,
  IconPuzzle,
  // Recently added
  IconBinaryTree,
  IconLinkPlus,
  IconCircleMinus,
  IconReload,
  IconRestore,
} from '@tabler/icons-react';
import {
  IconUbuntu2,
  IconRocky2,
  IconWindowActive,
  IconWindowMinimized,
  IconRouterArrows,
  IconExpandOff,
  IconExpandOn,
} from '@/design-system/components/Icons/CustomIcons';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface IconItem {
  icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>;
  name: string;
  label: string;
  library?: 'tabler' | 'lucide' | 'custom';
  usage?: string;
  note?: string;
}

interface IconCategoryData {
  title: string;
  items: IconItem[];
}

/* ----------------------------------------
   Icon Data
   ---------------------------------------- */

const iconCategories: IconCategoryData[] = [
  {
    title: 'Actions - Media Controls',
    items: [
      {
        icon: IconPlayerPlay,
        name: 'IconPlayerPlay',
        label: 'Play',
        usage: 'Instance Detail/List, DetailHeader, ContextMenu',
      },
      {
        icon: IconPlayerStop,
        name: 'IconPlayerStop',
        label: 'Stop',
        usage: 'Instance Detail/List, ScheduledTasks',
      },
      {
        icon: IconPlayerPause,
        name: 'IconPlayerPause',
        label: 'Pause',
        usage: 'StatusIndicator, CronJobs, AIPlatform, Workload Detail',
      },
      {
        icon: IconRefresh,
        name: 'IconRefresh',
        label: 'Refresh',
        usage: 'MonitoringToolbar, DS 컴포넌트',
      },
      {
        icon: IconRefreshDot,
        name: 'IconRefreshDot',
        label: 'Reboot',
        usage: 'Instance Detail, ContextMenu',
      },
      { icon: IconRotate, name: 'IconRotate', label: 'Rotate', note: '미사용' },
      { icon: IconRotateClockwise, name: 'IconRotateClockwise', label: 'Retry', note: '미사용' },
      {
        icon: IconPower,
        name: 'IconPower',
        label: 'Reboot',
        usage: 'StatusIndicator, Instance pages, CloudBuilder Detail',
      },
      {
        icon: IconCircleX,
        name: 'IconCircleX',
        label: 'Terminate',
        usage: 'Toast, WorkloadDetail, IAM pages, MCPTools',
      },
    ],
  },
  {
    title: 'Actions - CRUD',
    items: [
      {
        icon: IconPlus,
        name: 'IconPlus',
        label: 'Add',
        usage: 'PageHeader Create 버튼, TabBar, 동적 폼 추가',
      },
      {
        icon: IconCirclePlus,
        name: 'IconCirclePlus',
        label: 'Create / Add',
        usage: '동적 폼 행 추가 버튼',
      },
      {
        icon: IconSquarePlus,
        name: 'IconSquarePlus',
        label: 'Attach',
        usage: 'HomePage, InstanceDetail',
      },
      {
        icon: IconMinus,
        name: 'IconMinus',
        label: 'Remove',
        usage: 'Checkbox(indeterminate), TabBar, NumberInput',
      },
      {
        icon: IconPencil,
        name: 'IconPencil',
        label: 'Edit',
        usage: 'SectionCard Edit 버튼, Detail pages',
      },
      {
        icon: IconEdit,
        name: 'IconEdit',
        label: 'Edit Alt',
        usage: 'SectionCard Edit, DesignTodoPage',
      },
      {
        icon: IconTrash,
        name: 'IconTrash',
        label: 'Delete',
        usage: 'Bulk actions, ContextMenu, 동적 폼 행 삭제',
      },
      { icon: IconTrashX, name: 'IconTrashX', label: 'Deleting', note: '미사용' },
      {
        icon: IconCopy,
        name: 'IconCopy',
        label: 'Copy',
        usage: 'CopyButton, InfoBox, TopBar',
        note: 'DS 내부',
      },
      { icon: IconRestore, name: 'IconRestore', label: 'Restore', usage: 'VolumeBackupDetail' },
      {
        icon: IconReload,
        name: 'IconReload',
        label: 'Reset',
        usage: 'IAMUserDetail, IAMSystemAdminDetail',
      },
    ],
  },
  {
    title: 'Actions - Transfer',
    items: [
      {
        icon: IconDownload,
        name: 'IconDownload',
        label: 'Download',
        usage: 'AppIconsPage 다운로드, Drawer',
      },
      {
        icon: IconUpload,
        name: 'IconUpload',
        label: 'Upload',
        usage: 'ConfigMap 파일 읽기, Create pages',
      },
      { icon: IconShare, name: 'IconShare', label: 'Share', usage: 'Detail pages, ContextMenu' },
      { icon: IconSend, name: 'IconSend', label: 'Send', usage: 'ChatbotPanel 전송 버튼' },
      {
        icon: IconTransfer,
        name: 'IconTransfer',
        label: 'Transfer',
        usage: 'Volume Transfer, ContextMenu',
      },
      { icon: IconLink, name: 'IconLink', label: 'Link', usage: 'SectionCard DataRow isLink' },
      {
        icon: IconUnlink,
        name: 'IconUnlink',
        label: 'Unlink',
        usage: 'FloatingIP, LB, IAM Group pages',
      },
      {
        icon: IconLinkOff,
        name: 'IconLinkOff',
        label: 'Link Off',
        usage: 'FloatingIPDetail, RouterDetail',
      },
      {
        icon: IconLinkPlus,
        name: 'IconLinkPlus',
        label: 'Associate',
        usage: 'InstanceDetail, PortDetail',
      },
      {
        icon: IconExternalLink,
        name: 'IconExternalLink',
        label: 'External',
        usage: 'Drawer 외부 문서 링크 (60+ files)',
      },
      {
        icon: IconBinaryTree,
        name: 'IconBinaryTree',
        label: 'Allocate',
        usage: 'FloatingIPs, PortDetail',
      },
      {
        icon: IconCircleMinus,
        name: 'IconCircleMinus',
        label: 'Remove',
        usage: 'StatusIndicator, ManageRules/MetadataDrawer, IAMUserDetail',
      },
    ],
  },
  {
    title: 'Navigation - Chevrons & Arrows',
    items: [
      {
        icon: IconChevronLeft,
        name: 'IconChevronLeft',
        label: 'Chevron L',
        usage: 'DatePicker, Pagination, TopBar',
        note: 'DS 내부',
      },
      {
        icon: IconChevronRight,
        name: 'IconChevronRight',
        label: 'Chevron R',
        usage: 'Breadcrumb, ContextMenu submenu, Disclosure',
        note: 'DS 내부',
      },
      {
        icon: IconChevronDown,
        name: 'IconChevronDown',
        label: 'Chevron D',
        usage: 'Select, Dropdown, ContextMenu trigger',
        note: 'DS 내부',
      },
      {
        icon: IconChevronUp,
        name: 'IconChevronUp',
        label: 'Chevron U',
        usage: 'Table sort, NumberInput',
        note: 'DS 내부',
      },
      { icon: IconArrowLeft, name: 'IconArrowLeft', label: 'Arrow L', usage: 'TopBar 뒤로가기' },
      {
        icon: IconArrowRight,
        name: 'IconArrowRight',
        label: 'Arrow R',
        usage: 'TopBar 앞으로가기',
      },
      { icon: IconArrowUp, name: 'IconArrowUp', label: 'Arrow U', usage: 'Table sort 방향' },
      { icon: IconArrowDown, name: 'IconArrowDown', label: 'Arrow D', usage: 'Table sort 방향' },
      {
        icon: IconChevronsRight,
        name: 'IconChevronsRight',
        label: 'Chevrons R',
        usage: 'ChatbotPanel',
      },
      {
        icon: IconCaretRightFilled,
        name: 'IconCaretRightFilled',
        label: 'Caret R',
        usage: 'CreateTemplate, Tree 컴포넌트',
      },
      {
        icon: IconCaretDownFilled,
        name: 'IconCaretDownFilled',
        label: 'Caret D',
        usage: 'CreateTemplate, Tree 컴포넌트',
      },
    ],
  },
  {
    title: 'Navigation - Expand & Menu',
    items: [
      {
        icon: IconArrowsMaximize,
        name: 'IconArrowsMaximize',
        label: 'Maximize',
        usage: 'Chart/Monitor 확대, OverallPerformance, HostDetail',
      },
      {
        icon: IconArrowsMinimize,
        name: 'IconArrowsMinimize',
        label: 'Minimize',
        usage: 'Chart/Monitor 축소',
      },
      {
        icon: IconLayoutSidebarLeftCollapse,
        name: 'IconLayoutSidebarLeftCollapse',
        label: 'Collapse',
        usage: 'Sidebar 접기 버튼',
      },
      {
        icon: IconDotsCircleHorizontal,
        name: 'IconDotsCircleHorizontal',
        label: 'Action',
        usage: 'Table row 액션 메뉴 (90+ files), IAM pages',
      },
      { icon: IconDots, name: 'IconDots', label: 'Meatball', usage: 'ContextMenu trigger' },
      {
        icon: IconDotsVertical,
        name: 'IconDotsVertical',
        label: 'Kebab',
        usage: 'ContextMenu trigger (vertical)',
      },
      { icon: IconMenu2, name: 'IconMenu2', label: 'Hamburger', usage: 'Mobile menu toggle' },
    ],
  },
  {
    title: 'Status - Success & Error',
    items: [
      {
        icon: IconCircleCheck,
        name: 'IconCircleCheck',
        label: 'Success',
        usage: 'InlineMessage, StatusIndicator, TodoPage',
        note: 'DS 내부',
      },
      {
        icon: IconCheck,
        name: 'IconCheck',
        label: 'Check',
        usage: 'Checkbox, Dropdown selected, CopyButton',
        note: 'DS 내부',
      },
      {
        icon: IconShieldCheck,
        name: 'IconShieldCheck',
        label: 'Verified',
        usage: 'SecurityGroup Detail, KeyPair pages',
      },
      {
        icon: IconShieldX,
        name: 'IconShieldX',
        label: 'Sec Error',
        usage: 'SecurityGroup/Firewall status',
      },
      {
        icon: IconAlertCircle,
        name: 'IconAlertCircle',
        label: 'Error',
        usage: 'InlineMessage, FormField error, 인라인 경고',
        note: 'DS 내부',
      },
      {
        icon: IconAlertTriangle,
        name: 'IconAlertTriangle',
        label: 'Warning',
        usage: 'InlineMessage, SelectionIndicator, SystemError',
        note: 'DS 내부',
      },
      {
        icon: IconAlertOctagon,
        name: 'IconAlertOctagon',
        label: 'Critical',
        usage: 'SystemError 500 pages',
      },
      {
        icon: IconInfoCircle,
        name: 'IconInfoCircle',
        label: 'Info',
        usage: 'Tooltip 정보 아이콘, InlineMessage, DetailHeader',
        note: 'DS 내부',
      },
      {
        icon: IconHelpCircle,
        name: 'IconHelpCircle',
        label: 'Help',
        usage: 'Help 버튼, Tooltip trigger',
      },
    ],
  },
  {
    title: 'Status - State',
    items: [
      {
        icon: IconCircle,
        name: 'IconCircle',
        label: 'Active',
        usage: 'StatusIndicator, TodoPage 상태 토글',
      },
      {
        icon: IconCircleFilled,
        name: 'IconCircleFilled',
        label: 'Filled',
        usage: 'ContainerConsolePage',
      },
      { icon: IconCircleOff, name: 'IconCircleOff', label: 'Inactive', note: '미사용' },
      {
        icon: IconBan,
        name: 'IconBan',
        label: 'Suspended',
        usage: 'StatusIndicator, CloudBuilderDetail',
      },
      {
        icon: IconTool,
        name: 'IconTool',
        label: 'Maintain',
        usage: 'StatusIndicator maintenance 상태',
      },
      {
        icon: IconLoader,
        name: 'IconLoader',
        label: 'Loading',
        usage: 'StatusIndicator building/deleting/pending',
      },
      {
        icon: IconLoader2,
        name: 'IconLoader2',
        label: 'Spinner',
        usage: 'Loading 컴포넌트 스피너',
        note: 'DS 내부',
      },
      {
        icon: IconProgress,
        name: 'IconProgress',
        label: 'Progress',
        usage: 'StatusIndicator progress 상태',
      },
      {
        icon: IconInfinity,
        name: 'IconInfinity',
        label: 'Infinity',
        usage: 'Create Drawer 무제한 표시, ProgressBar (15+ files)',
      },
    ],
  },
  {
    title: 'UI - Common',
    items: [
      {
        icon: IconSearch,
        name: 'IconSearch',
        label: 'Search',
        usage: 'SearchInput, FilterSearchInput',
        note: 'DS 내부',
      },
      {
        icon: IconFilter,
        name: 'IconFilter',
        label: 'Filter',
        usage: 'DatasetsPage, DesignAuditPage',
      },
      {
        icon: IconSettings,
        name: 'IconSettings',
        label: 'Manage',
        usage: 'Sidebar 메뉴, SettingsPage',
      },
      { icon: IconHome, name: 'IconHome', label: 'Home', usage: 'Sidebar Home 메뉴' },
      {
        icon: IconX,
        name: 'IconX',
        label: 'Close',
        usage: 'SearchInput clear, Chip dismiss, FileListCard, Tag',
        note: 'DS 내부',
      },
      { icon: IconList, name: 'IconList', label: 'List', usage: 'View 전환 (List/Grid)' },
      {
        icon: IconLayoutGrid,
        name: 'IconLayoutGrid',
        label: 'Grid',
        usage: 'View 전환 (List/Grid)',
      },
      { icon: IconGridDots, name: 'IconGridDots', label: 'Grid Dots', usage: 'Sidebar 아이콘' },
      {
        icon: IconArrowsSort,
        name: 'IconArrowsSort',
        label: 'Sort',
        usage: 'Table 정렬 아이콘',
        note: 'DS 내부',
      },
      {
        icon: IconSelector,
        name: 'IconSelector',
        label: 'Selector',
        usage: 'Select/Dropdown trigger',
        note: 'DS 내부',
      },
      {
        icon: IconGripVertical,
        name: 'IconGripVertical',
        label: 'Drag',
        usage: 'TodoPage 드래그 핸들, Sortable 행',
      },
      {
        icon: IconSquare,
        name: 'IconSquare',
        label: 'Square',
        usage: 'TabBar 최대화 아이콘',
        note: 'DS 내부',
      },
      { icon: IconSlash, name: 'IconSlash', label: 'Separator', note: 'Storybook only' },
      { icon: IconTag, name: 'IconTag', label: 'Tag', usage: 'Tag/Label 표시 아이콘' },
      { icon: IconPhoto, name: 'IconPhoto', label: 'Photo', usage: 'Image/Snapshot 관련 페이지' },
      { icon: IconMapPin, name: 'IconMapPin', label: 'Location', note: 'Storybook only' },
    ],
  },
  {
    title: 'UI - Notifications & Favorites',
    items: [
      { icon: IconBell, name: 'IconBell', label: 'Bell', usage: 'TopBar 알림 아이콘 (40+ files)' },
      {
        icon: IconBellRinging,
        name: 'IconBellRinging',
        label: 'Bell Ring',
        usage: 'TopBar 알림 active 상태',
      },
      {
        icon: IconStar,
        name: 'IconStar',
        label: 'Star',
        usage: '즐겨찾기 비활성 상태 (15+ files)',
      },
      {
        icon: IconStarFilled,
        name: 'IconStarFilled',
        label: 'Star Fill',
        usage: '즐겨찾기 활성 상태 (yellow400)',
      },
      {
        icon: IconHeart,
        name: 'IconHeart',
        label: 'Heart',
        usage: 'ButtonPage, MetallicPalettePage',
      },
      {
        icon: IconTarget,
        name: 'IconTarget',
        label: 'Target',
        usage: 'HomePage, AgentPage, AIPlatform, StoragePage',
      },
      {
        icon: IconPoint,
        name: 'IconPoint',
        label: 'Dot',
        usage: 'StatusIndicator dot, 상태 점 표시',
      },
    ],
  },
  {
    title: 'UI - Visibility & Security',
    items: [
      { icon: IconEye, name: 'IconEye', label: 'Show', usage: 'Password 표시, Detail 보기' },
      { icon: IconEyeOff, name: 'IconEyeOff', label: 'Hide', usage: 'Password 숨기기' },
      {
        icon: IconLock,
        name: 'IconLock',
        label: 'Lock',
        usage: 'Lock 상태, 리소스 잠금 (15+ files)',
      },
      {
        icon: IconLockOpen,
        name: 'IconLockOpen',
        label: 'Unlock',
        usage: 'Flavor/ServerGroup Detail 잠금 해제',
      },
      {
        icon: IconShield,
        name: 'IconShield',
        label: 'Shield',
        usage: 'Sidebar 보안 메뉴, SecurityGroup',
      },
      {
        icon: IconShieldLock,
        name: 'IconShieldLock',
        label: 'Shield Lock',
        usage: 'SecurityGroup 사이드바, Detail',
      },
      {
        icon: IconKey,
        name: 'IconKey',
        label: 'Key',
        usage: 'KeyPair 메뉴/Detail, 인증 관련 (10+ files)',
      },
    ],
  },
  {
    title: 'UI - User & Communication',
    items: [
      { icon: IconUser, name: 'IconUser', label: 'User', usage: 'SettingsSidebar 사용자 메뉴' },
      {
        icon: IconUserCircle,
        name: 'IconUserCircle',
        label: 'User Circle',
        usage: 'Profile, Avatar placeholder',
      },
      {
        icon: IconUsers,
        name: 'IconUsers',
        label: 'Users',
        usage: 'IAMSidebar 사용자 메뉴, CreatePages',
      },
      {
        icon: IconUsersGroup,
        name: 'IconUsersGroup',
        label: 'Users Group',
        usage: 'IAM UserGroup 관련 페이지',
      },
      {
        icon: IconUserCog,
        name: 'IconUserCog',
        label: 'User Cog',
        usage: 'IAMSidebar, AIPlatformSidebar, SystemAdmin',
      },
      { icon: IconMail, name: 'IconMail', label: 'Mail', usage: 'MailTemplatePage' },
      {
        icon: IconMessage,
        name: 'IconMessage',
        label: 'Message',
        usage: 'Chat/Message 관련 페이지',
      },
      {
        icon: IconMessagePlus,
        name: 'IconMessagePlus',
        label: 'New Chat',
        usage: 'ChatbotPanel 새 대화',
      },
      {
        icon: IconMessages,
        name: 'IconMessages',
        label: 'Messages',
        usage: 'AgentSidebar 메시지 메뉴',
      },
      {
        icon: IconMessageCircle,
        name: 'IconMessageCircle',
        label: 'Message Circle',
        usage: 'AIPlatformSidebar',
      },
      { icon: IconHelp, name: 'IconHelp', label: 'Help', usage: 'Help 버튼, Sidebar' },
      {
        icon: IconQuestionMark,
        name: 'IconQuestionMark',
        label: 'Question',
        usage: 'Help/FAQ 링크',
      },
      { icon: IconLogout, name: 'IconLogout', label: 'Logout', note: 'Storybook only' },
    ],
  },
  {
    title: 'UI - Theme',
    items: [
      {
        icon: IconSun,
        name: 'IconSun',
        label: 'Light',
        usage: 'DarkModeToggle, EntryPage, SemanticColors',
      },
      {
        icon: IconMoon,
        name: 'IconMoon',
        label: 'Dark',
        usage: 'DarkModeToggle, EntryPage, SemanticColors',
      },
      {
        icon: IconPalette,
        name: 'IconPalette',
        label: 'Palette',
        usage: 'AgentPage, MCPTools, navigationData',
      },
    ],
  },
  {
    title: 'Infrastructure - Compute',
    items: [
      {
        icon: IconServer,
        name: 'IconServer',
        label: 'Server',
        usage: 'Sidebar Hypervisor 메뉴, Detail pages',
      },
      {
        icon: IconServer2,
        name: 'IconServer2',
        label: 'Instance',
        usage: 'Sidebar Instance 메뉴, HostDetail',
      },
      {
        icon: IconCube,
        name: 'IconCube',
        label: 'Cube',
        usage: 'Sidebar, Network/Firewall pages, ModelsPage',
      },
      { icon: IconCpu, name: 'IconCpu', label: 'CPU', usage: 'Flavor/Resource 표시, Create pages' },
      { icon: IconCpu2, name: 'IconCpu2', label: 'CPU 2', usage: 'Sidebar Compute 메뉴' },
      {
        icon: IconServerCog,
        name: 'IconServerCog',
        label: 'Host Agg',
        usage: 'Sidebar HostAggregate 메뉴',
      },
      { icon: IconServerOff, name: 'IconServerOff', label: 'Server Off', note: 'Storybook only' },
      { icon: IconCloud, name: 'IconCloud', label: 'Cloud', usage: 'Cloud/AZ 관련 페이지' },
    ],
  },
  {
    title: 'Infrastructure - Network',
    items: [
      {
        icon: IconNetwork,
        name: 'IconNetwork',
        label: 'Network',
        usage: 'Sidebar, ComputeAdminSidebar, WorkloadDetail',
      },
      {
        icon: IconRouter,
        name: 'IconRouter',
        label: 'Router',
        usage: 'Sidebar Router 메뉴, Network Topology',
      },
      { icon: IconPlug, name: 'IconPlug', label: 'Port', usage: 'Sidebar Port 메뉴, Detail pages' },
      {
        icon: IconPlugConnected,
        name: 'IconPlugConnected',
        label: 'Connected',
        usage: 'Port 연결 상태 표시',
      },
      { icon: IconScale, name: 'IconScale', label: 'Load Bal', usage: 'Sidebar LB 메뉴 (구)' },
      {
        icon: IconLoadBalancer,
        name: 'IconLoadBalancer',
        label: 'Load Balancer',
        usage: 'Sidebar, ComputeAdminSidebar LB 메뉴',
      },
      {
        icon: IconWorldWww,
        name: 'IconWorldWww',
        label: 'Float IP',
        usage: 'Sidebar FloatingIP 메뉴, Detail',
      },
      {
        icon: IconWorld,
        name: 'IconWorld',
        label: 'World',
        usage: 'IAMSidebar, DatasetsPage, WorkloadDetail',
      },
      { icon: IconWifiOff, name: 'IconWifiOff', label: 'Disconnected', note: 'Storybook only' },
      { icon: IconTopologyRing, name: 'IconTopologyRing', label: 'Topo Ring', note: '미사용' },
      {
        icon: IconTopologyStar,
        name: 'IconTopologyStar',
        label: 'Topo Star',
        usage: 'ContainerSidebar Services 메뉴',
      },
      {
        icon: IconTopologyStar3,
        name: 'IconTopologyStar3',
        label: 'Topo Star 3',
        usage: 'Sidebar Topology 메뉴',
      },
    ],
  },
  {
    title: 'Infrastructure - Storage',
    items: [
      {
        icon: IconDatabase,
        name: 'IconDatabase',
        label: 'Database',
        usage: 'Sidebar Volume 메뉴, EmptyState',
      },
      {
        icon: IconDatabaseSearch,
        name: 'IconDatabaseSearch',
        label: 'Vol Search',
        usage: 'Volume 검색 관련',
      },
      {
        icon: IconDatabaseExport,
        name: 'IconDatabaseExport',
        label: 'DB Export',
        usage: 'Sidebar, ComputeAdminSidebar Snapshot 메뉴',
      },
      {
        icon: IconDatabaseCog,
        name: 'IconDatabaseCog',
        label: 'DB Cog',
        usage: 'ComputeAdminSidebar VolumeType 메뉴',
      },
      {
        icon: IconDeviceFloppy,
        name: 'IconDeviceFloppy',
        label: 'Disk',
        usage: 'Volume/Disk 관련 Detail',
      },
      {
        icon: IconDeviceSdCard,
        name: 'IconDeviceSdCard',
        label: 'Backup',
        usage: 'Sidebar Backup 메뉴, Detail',
      },
      {
        icon: IconBoxMultiple,
        name: 'IconBoxMultiple',
        label: 'Vol Type',
        usage: 'Sidebar VolumeType 메뉴',
      },
      {
        icon: IconBucket,
        name: 'IconBucket',
        label: 'Bucket',
        usage: 'StorageSidebar Bucket 메뉴',
      },
    ],
  },
  {
    title: 'Infrastructure - Security',
    items: [
      { icon: IconShield, name: 'IconShield', label: 'Security', usage: 'Sidebar 보안 메뉴 섹션' },
      {
        icon: IconShieldLock,
        name: 'IconShieldLock',
        label: 'Sec Group',
        usage: 'Sidebar SecurityGroup 메뉴',
      },
      {
        icon: IconShieldCheck,
        name: 'IconShieldCheck',
        label: 'Shield OK',
        usage: 'SecurityGroup/KeyPair Detail 상태',
      },
      {
        icon: IconKey,
        name: 'IconKey',
        label: 'Key Pair',
        usage: 'Sidebar KeyPair 메뉴, Detail pages',
      },
      {
        icon: IconCertificate,
        name: 'IconCertificate',
        label: 'Certificate',
        usage: 'SSL/Certificate 관련 페이지',
      },
    ],
  },
  {
    title: 'Storage & Files',
    items: [
      {
        icon: IconCamera,
        name: 'IconCamera',
        label: 'Snapshot',
        usage: 'Sidebar Snapshot 메뉴, Create Snapshot',
      },
      {
        icon: IconDisc,
        name: 'IconDisc',
        label: 'Image',
        usage: 'Sidebar Image 메뉴, ComputeAdminSidebar',
      },
      {
        icon: IconFile,
        name: 'IconFile',
        label: 'File',
        usage: 'TopBar 툴바 (40+ files), FileListCard',
      },
      { icon: IconFileText, name: 'IconFileText', label: 'Doc', note: '미사용' },
      {
        icon: IconFileDescription,
        name: 'IconFileDescription',
        label: 'Description',
        usage: 'IAMSidebar, TextGenerationPage',
      },
      {
        icon: IconFileCode,
        name: 'IconFileCode',
        label: 'Code File',
        usage: 'Sidebar, ComputeAdminSidebar',
      },
      {
        icon: IconFileSettings,
        name: 'IconFileSettings',
        label: 'Settings File',
        usage: 'ContainerSidebar ConfigMap 메뉴',
      },
      {
        icon: IconFolder,
        name: 'IconFolder',
        label: 'Folder',
        usage: 'ProjectSelector, BucketDetail, EditorPage',
      },
      {
        icon: IconFolderOpen,
        name: 'IconFolderOpen',
        label: 'Folder Open',
        usage: 'Bucket/Folder 열림 상태',
      },
      {
        icon: IconFolders,
        name: 'IconFolders',
        label: 'Folders',
        usage: 'ContainerSidebar, StorageSidebar',
      },
      { icon: IconArchive, name: 'IconArchive', label: 'Archive', usage: 'Archive 관련 액션' },
      {
        icon: IconTemplate,
        name: 'IconTemplate',
        label: 'Template',
        usage: 'Sidebar Template 메뉴',
      },
      { icon: IconStack2, name: 'IconStack2', label: 'Layers', usage: 'Sidebar 메뉴, Stack 관련' },
      {
        icon: IconStack3,
        name: 'IconStack3',
        label: 'Stack',
        usage: 'ContainerSidebar StatefulSet 메뉴',
      },
      {
        icon: IconCode,
        name: 'IconCode',
        label: 'Code',
        usage: 'AIPlatformSidebar, Agent/MCP pages, DevSpace',
      },
    ],
  },
  {
    title: 'Monitoring & Analytics',
    items: [
      { icon: IconTerminal, name: 'IconTerminal', label: 'Console', usage: 'Console 접속 버튼' },
      {
        icon: IconTerminal2,
        name: 'IconTerminal2',
        label: 'Terminal',
        usage: 'TopBar 터미널 아이콘 (40+ files), ShellPanel',
      },
      {
        icon: IconActivity,
        name: 'IconActivity',
        label: 'Activity',
        usage: 'Monitoring 관련, navigationData',
      },
      {
        icon: IconChartBar,
        name: 'IconChartBar',
        label: 'Bar Chart',
        usage: 'Chart 관련 페이지, navigationData',
      },
      {
        icon: IconChartPie3,
        name: 'IconChartPie3',
        label: 'Pie Chart',
        usage: 'ContainerSidebar ResourceQuota 메뉴',
      },
      {
        icon: IconGauge,
        name: 'IconGauge',
        label: 'Gauge',
        usage: 'Dashboard, Performance 페이지',
      },
      {
        icon: IconBrandSpeedtest,
        name: 'IconBrandSpeedtest',
        label: 'Speedtest',
        usage: 'StorageSidebar 성능 메뉴',
      },
      {
        icon: IconDeviceDesktop,
        name: 'IconDeviceDesktop',
        label: 'Desktop',
        usage: 'IAMSidebar, DarkModeToggle, navigationData',
      },
      {
        icon: IconDeviceDesktopAnalytics,
        name: 'IconDeviceDesktopAnalytics',
        label: 'Analytics',
        usage: 'Monitoring/Analytics 페이지',
      },
      {
        icon: IconLayoutDashboard,
        name: 'IconLayoutDashboard',
        label: 'Dashboard',
        usage: 'Sidebar Dashboard 메뉴',
      },
    ],
  },
  {
    title: 'Organization & Structure',
    items: [
      {
        icon: IconBuilding,
        name: 'IconBuilding',
        label: 'Building',
        usage: 'Organization/Domain 관련 페이지',
      },
      {
        icon: IconCategory,
        name: 'IconCategory',
        label: 'Category',
        usage: 'Sidebar 카테고리 메뉴',
      },
      {
        icon: IconLayoutSidebar,
        name: 'IconLayoutSidebar',
        label: 'Sidebar',
        usage: 'TopBar 사이드바 토글',
        note: 'DS 내부',
      },
      {
        icon: IconAdjustments,
        name: 'IconAdjustments',
        label: 'Adjust',
        usage: 'Settings/Preferences 페이지',
      },
      { icon: IconBolt, name: 'IconBolt', label: 'Bolt', usage: 'Performance/Action 강조' },
      { icon: IconGitBranch, name: 'IconGitBranch', label: 'Branch', usage: 'Git/Version 관련' },
      {
        icon: IconAffiliate,
        name: 'IconAffiliate',
        label: 'Affiliate',
        usage: 'Sidebar Affinity 메뉴',
      },
      {
        icon: IconListSearch,
        name: 'IconListSearch',
        label: 'List Search',
        usage: 'Sidebar 검색/탐색 메뉴',
      },
      {
        icon: IconRulerMeasure,
        name: 'IconRulerMeasure',
        label: 'Ruler',
        usage: 'ContainerSidebar LimitRange 메뉴',
      },
      {
        icon: IconReorder,
        name: 'IconReorder',
        label: 'Reorder',
        usage: 'ContainerSidebar PodDisruptionBudget 메뉴',
      },
      {
        icon: IconArrowsShuffle,
        name: 'IconArrowsShuffle',
        label: 'Shuffle',
        usage: 'ContainerSidebar DaemonSet 메뉴',
      },
      {
        icon: IconArrowsJoin2,
        name: 'IconArrowsJoin2',
        label: 'Join',
        usage: 'ComputeAdminSidebar',
      },
      {
        icon: IconTimelineEvent,
        name: 'IconTimelineEvent',
        label: 'Timeline',
        usage: 'ContainerSidebar CronJob 메뉴',
      },
    ],
  },
  {
    title: 'Time & Schedule',
    items: [
      {
        icon: IconClock,
        name: 'IconClock',
        label: 'Clock',
        usage: '시간/일정 표시, ScheduledTasks',
      },
      {
        icon: IconHourglass,
        name: 'IconHourglass',
        label: 'Hourglass',
        usage: 'Pending/대기 상태 표시',
      },
      { icon: IconStopwatch, name: 'IconStopwatch', label: 'Timeout', note: '미사용' },
      {
        icon: IconHistory,
        name: 'IconHistory',
        label: 'History',
        usage: 'IAMSidebar AuditLog 메뉴',
      },
      {
        icon: IconArticle,
        name: 'IconArticle',
        label: 'Article',
        usage: 'Documentation/Article 링크',
      },
      {
        icon: IconCalendar,
        name: 'IconCalendar',
        label: 'Calendar',
        usage: 'DatePicker 아이콘',
        note: 'DS 내부',
      },
      {
        icon: IconCalendarTime,
        name: 'IconCalendarTime',
        label: 'Cal Time',
        usage: 'ContainerSidebar Job 메뉴',
      },
    ],
  },
  {
    title: 'Container & Workloads',
    items: [
      {
        icon: IconRocket,
        name: 'IconRocket',
        label: 'Deploy',
        usage: 'ContainerSidebar Deployment 메뉴',
      },
      { icon: IconCompass, name: 'IconCompass', label: 'Compass', usage: 'AIPlatformSidebar' },
      {
        icon: IconPackages,
        name: 'IconPackages',
        label: 'Packages',
        usage: 'AIPlatformSidebar, navigationData',
      },
      {
        icon: IconRoute,
        name: 'IconRoute',
        label: 'Route',
        usage: 'AIPlatformSidebar, PipelineBuilder',
      },
      {
        icon: IconPuzzle,
        name: 'IconPuzzle',
        label: 'Puzzle',
        usage: 'HomePage, AgentSidebar Extension 메뉴',
      },
    ],
  },
  {
    title: 'Business & Finance',
    items: [
      {
        icon: IconCurrencyDollar,
        name: 'IconCurrencyDollar',
        label: 'Dollar',
        usage: 'Billing/Cost 관련 페이지',
      },
      { icon: IconLanguage, name: 'IconLanguage', label: 'Language', usage: '언어 설정' },
    ],
  },
  {
    title: 'AI & ML',
    items: [
      {
        icon: IconBrain,
        name: 'IconBrain',
        label: 'Brain',
        usage: 'AIPlatformPage, AIPlatformSidebar, AIWorkspace',
      },
      { icon: IconRobot, name: 'IconRobot', label: 'Robot', usage: 'AI/Bot 관련 페이지' },
      {
        icon: IconRobotFace,
        name: 'IconRobotFace',
        label: 'Robot Face',
        usage: 'HomePage, AgentSidebar',
      },
      {
        icon: IconMessageChatbot,
        name: 'IconMessageChatbot',
        label: 'Chatbot',
        usage: 'ChatbotPanel, AI Chat 기능',
      },
      { icon: IconBook, name: 'IconBook', label: 'Book', usage: 'Knowledge/Docs 관련' },
      { icon: IconTestPipe, name: 'IconTestPipe', label: 'Test', usage: 'Test/Pipeline 관련' },
    ],
  },
  {
    title: 'OS / Brand',
    items: [
      {
        icon: IconUbuntu2,
        name: 'IconUbuntu2',
        label: 'Ubuntu',
        library: 'custom',
        note: '미사용',
      },
      { icon: IconBrandDebian, name: 'IconBrandDebian', label: 'Debian', note: '미사용' },
      {
        icon: IconBrandWindows,
        name: 'IconBrandWindows',
        label: 'Windows',
        usage: 'OS 선택/표시 (Instance Create)',
      },
      { icon: IconBrandRedhat, name: 'IconBrandRedhat', label: 'RedHat', note: '미사용' },
      { icon: IconRocky2, name: 'IconRocky2', label: 'Rocky', library: 'custom', note: '미사용' },
      { icon: IconGrid3x3, name: 'IconGrid3x3', label: 'Grid', note: '미사용' },
      { icon: IconCircleDot, name: 'IconCircleDot', label: 'Other', usage: 'OS 기타 선택' },
    ],
  },
  {
    title: 'Custom Icons',
    items: [
      {
        icon: IconWindowActive,
        name: 'IconWindowActive',
        label: 'Window Active',
        library: 'custom',
        usage: 'DesktopPage 윈도우 상태',
      },
      {
        icon: IconWindowMinimized,
        name: 'IconWindowMinimized',
        label: 'Window Min',
        library: 'custom',
        usage: 'DesktopPage 윈도우 상태',
      },
      {
        icon: IconRouterArrows,
        name: 'IconRouterArrows',
        label: 'Virtual Adapter',
        library: 'custom',
        usage: 'Sidebar, ComputeAdminSidebar',
      },
      {
        icon: IconExpandOff,
        name: 'IconExpandOff',
        label: 'Collapse All',
        library: 'custom',
        note: '미사용',
      },
      {
        icon: IconExpandOn,
        name: 'IconExpandOn',
        label: 'Expand All',
        library: 'custom',
        note: '미사용',
      },
    ],
  },
];

/* ----------------------------------------
   Icon Table Row
   ---------------------------------------- */

function IconRow({ item, categoryType }: { item: IconItem; categoryType: string }) {
  const [copied, setCopied] = useState(false);
  const Icon = item.icon;
  const figmaName = item.name.replace(/^Icon/, 'Icon/');

  const handleCopy = useCallback(async () => {
    const code = `<${item.name} size={16} stroke={1.5} />`;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [item.name]);

  const type = categoryType.split(' - ')[0].replace(/s$/, '');
  const libraryLabel =
    item.library === 'custom' ? 'Custom' : item.library === 'lucide' ? 'Lucide' : 'Tabler';

  const noteStyle =
    item.note === '미사용'
      ? 'bg-[var(--color-state-danger-bg)] text-[var(--color-state-danger)]'
      : item.note === 'DS 내부'
        ? 'bg-[var(--color-state-info-bg)] text-[var(--color-state-info)]'
        : item.note === 'Storybook only'
          ? 'bg-[var(--color-state-warning-bg)] text-[var(--color-state-warning)]'
          : '';

  return (
    <tr
      onClick={handleCopy}
      className="border-b border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)] cursor-pointer transition-colors group"
    >
      <td className="py-3 px-4" style={{ width: '48px' }}>
        <div className="flex items-center justify-center">
          <Icon
            size={16}
            stroke={1.5}
            className="text-[var(--color-text-default)]"
            data-figma-name={figmaName}
            aria-label={figmaName}
          />
        </div>
      </td>
      <td className="py-3 px-4" style={{ width: '200px' }}>
        <div className="flex items-center gap-2">
          <span className="text-body-md text-[var(--color-text-default)]">{item.name}</span>
          {copied && (
            <span className="text-body-sm text-[var(--color-state-success)]">Copied!</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4" style={{ width: '80px' }}>
        <span className="text-body-md text-[var(--color-text-muted)]">{type}</span>
      </td>
      <td className="py-3 px-4" style={{ width: '70px' }}>
        {item.library === 'custom' ? (
          <span className="text-body-sm px-2 py-0.5 bg-[var(--color-state-warning-bg)] text-[var(--color-state-warning)] rounded">
            {libraryLabel}
          </span>
        ) : (
          <span className="text-body-md text-[var(--color-text-subtle)]">{libraryLabel}</span>
        )}
      </td>
      <td className="py-3 px-4" style={{ width: '80px' }}>
        <span className="text-body-md text-[var(--color-text-subtle)]">{item.label}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-body-sm text-[var(--color-text-subtle)]">{item.usage || '-'}</span>
      </td>
      <td className="py-3 px-4" style={{ width: '100px' }}>
        {item.note && noteStyle ? (
          <span className={`text-body-sm px-2 py-0.5 rounded whitespace-nowrap ${noteStyle}`}>
            {item.note}
          </span>
        ) : (
          <span className="text-body-sm text-[var(--color-text-subtle)]">{item.note || '-'}</span>
        )}
      </td>
    </tr>
  );
}

/* ----------------------------------------
   Size Demo
   ---------------------------------------- */

function SizeDemo() {
  const sizes = [
    { size: 12, label: '12px', usage: 'sm/md 버튼 내 아이콘' },
    { size: 14, label: '14px', usage: 'lg 버튼 내 아이콘' },
    { size: 16, label: '16px', usage: '기본 아이콘, 메뉴' },
    { size: 20, label: '20px', usage: '강조 아이콘' },
    { size: 24, label: '24px', usage: '빈 상태, 헤더' },
    { size: 32, label: '32px', usage: '페이지 아이콘' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {sizes.map(({ size, label, usage }) => (
        <div
          key={size}
          className="flex flex-col items-center gap-3 p-4 bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)]"
        >
          <div className="h-12 flex items-center justify-center">
            <IconSettings size={size} stroke={1.5} className="text-[var(--color-text-default)]" />
          </div>
          <div className="text-center">
            <p className="text-label-md text-[var(--color-text-default)] font-semibold">{label}</p>
            <p className="text-body-sm text-[var(--color-text-subtle)]">{usage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Usage Example
   ---------------------------------------- */

function UsageExample({
  title,
  description,
  children,
  code,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="p-4 bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)]">
      <h4 className="text-label-md text-[var(--color-text-default)] font-semibold mb-1">{title}</h4>
      <p className="text-body-sm text-[var(--color-text-subtle)] mb-4">{description}</p>
      <div className="flex items-center gap-4 mb-4">{children}</div>
      <div className="relative">
        <pre className="p-3 bg-[var(--color-surface-subtle)] rounded-md text-body-sm font-mono text-[var(--color-text-muted)] overflow-x-auto">
          {code}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-[var(--color-surface-default)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
        >
          {copied ? (
            <IconCheck size={12} className="text-[var(--color-state-success)]" />
          ) : (
            <IconCopy size={12} className="text-[var(--color-text-subtle)]" />
          )}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Icons Content (all sections flattened)
   ---------------------------------------- */

function IconsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCategories = useMemo(() => {
    return iconCategories
      .filter((category) => activeCategory === 'all' || category.title === activeCategory)
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          if (!searchQuery.trim()) return true;
          const query = searchQuery.toLowerCase();
          return (
            item.name.toLowerCase().includes(query) || item.label.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [activeCategory, searchQuery]);

  const totalIcons = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  return (
    <VStack gap={8}>
      {/* --- Icon Set --- */}
      <VStack gap={4}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">
            Icon Set ({totalIcons})
          </h2>
          <HStack gap={2}>
            <SearchInput
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="sm"
              className="w-[200px]"
            />
            <Select
              value={activeCategory}
              onChange={(value) => setActiveCategory(value)}
              options={[
                { value: 'all', label: 'All Categories' },
                ...iconCategories.map((cat) => ({
                  value: cat.title,
                  label: cat.title,
                })),
              ]}
              size="sm"
              className="w-[200px]"
            />
          </HStack>
        </div>

        {filteredCategories.map((category) => (
          <div
            key={category.title}
            className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] overflow-hidden"
          >
            <div className="px-4 py-3 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
              <h3 className="text-label-md text-[var(--color-text-default)] font-semibold">
                {category.title}
                <span className="ml-2 text-body-sm text-[var(--color-text-subtle)] font-normal">
                  ({category.items.length})
                </span>
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th
                    className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                    style={{ width: '48px' }}
                  >
                    Icon
                  </th>
                  <th
                    className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                    style={{ width: '200px' }}
                  >
                    Name
                  </th>
                  <th
                    className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                    style={{ width: '80px' }}
                  >
                    Type
                  </th>
                  <th
                    className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                    style={{ width: '70px' }}
                  >
                    Library
                  </th>
                  <th
                    className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                    style={{ width: '80px' }}
                  >
                    Label
                  </th>
                  <th className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium">
                    Usage
                  </th>
                  <th
                    className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                    style={{ width: '100px' }}
                  >
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {category.items.map((item) => (
                  <IconRow key={item.name} item={item} categoryType={category.title} />
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <IconSearch
              size={48}
              stroke={1}
              className="mx-auto text-[var(--color-text-subtle)] mb-4"
            />
            <p className="text-body-md text-[var(--color-text-muted)]">
              &quot;{searchQuery}&quot;에 대한 결과가 없습니다.
            </p>
          </div>
        )}
      </VStack>

      {/* --- Size Guidelines --- */}
      <SectionCard>
        <SectionCard.Header title="Icon Sizes" />
        <SectionCard.Content>
          <p className="text-body-md text-[var(--color-text-subtle)] mb-6">
            아이콘은 사용 컨텍스트에 따라 6가지 주요 사이즈로 표시됩니다.
          </p>
          <SizeDemo />
        </SectionCard.Content>
      </SectionCard>

      {/* --- Stroke Width --- */}
      <SectionCard>
        <SectionCard.Header title="Stroke Width" />
        <SectionCard.Content>
          <p className="text-body-md text-[var(--color-text-subtle)] mb-4">
            TDS에서는{' '}
            <code className="px-1.5 py-0.5 bg-[var(--color-surface-subtle)] rounded text-body-sm">
              stroke={'{1.5}'}
            </code>
            를 기본값으로 사용합니다.
          </p>
          <div className="flex items-center gap-8">
            {[1, 1.5, 2].map((stroke) => (
              <div key={stroke} className="flex flex-col items-center gap-2">
                <IconSettings
                  size={24}
                  stroke={stroke}
                  className="text-[var(--color-text-default)]"
                />
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  stroke={stroke}
                </span>
              </div>
            ))}
          </div>
        </SectionCard.Content>
      </SectionCard>

      {/* --- Button Icons --- */}
      <SectionCard>
        <SectionCard.Header title="Button Icons" />
        <SectionCard.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UsageExample
              title="sm/md 버튼"
              description="12px 아이콘 사용"
              code={`<Button size="sm" leftIcon={<IconPlus size={12} stroke={1.5} />}>Create</Button>`}
            >
              <Button size="sm" leftIcon={<IconPlus size={12} stroke={1.5} />}>
                Create
              </Button>
              <Button size="md" leftIcon={<IconPencil size={12} stroke={1.5} />}>
                Edit
              </Button>
            </UsageExample>
            <UsageExample
              title="lg 버튼"
              description="14px 아이콘 사용"
              code={`<Button size="lg" leftIcon={<IconPlus size={14} stroke={1.5} />}>Create</Button>`}
            >
              <Button size="lg" leftIcon={<IconPlus size={14} stroke={1.5} />}>
                Create
              </Button>
            </UsageExample>
          </div>
        </SectionCard.Content>
      </SectionCard>

      {/* --- Status Icons --- */}
      <SectionCard>
        <SectionCard.Header title="Status Icons" />
        <SectionCard.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UsageExample
              title="상태 표시"
              description="상태별 색상과 함께 사용"
              code={`<IconCircleCheck className="text-[var(--color-state-success)]" />`}
            >
              <HStack gap={4}>
                <IconCircleCheck size={20} className="text-[var(--color-state-success)]" />
                <IconAlertTriangle size={20} className="text-[var(--color-state-warning)]" />
                <IconAlertCircle size={20} className="text-[var(--color-state-danger)]" />
                <IconInfoCircle size={20} className="text-[var(--color-state-info)]" />
              </HStack>
            </UsageExample>
            <UsageExample
              title="로딩 상태"
              description="animate-spin 클래스와 함께 사용"
              code={`<IconLoader2 className="animate-spin" />`}
            >
              <IconLoader2 size={20} className="animate-spin text-[var(--color-action-primary)]" />
            </UsageExample>
          </div>
        </SectionCard.Content>
      </SectionCard>

      {/* --- Favorite Star --- */}
      <SectionCard>
        <SectionCard.Header title="Favorite (Star) Icon" />
        <SectionCard.Content>
          <UsageExample
            title="즐겨찾기"
            description="yellow400 색상 사용"
            code={`// Active\n<IconStarFilled className="text-[var(--primitive-color-yellow400)]" />\n// Inactive\n<IconStar className="text-[var(--color-text-muted)]" />`}
          >
            <HStack gap={4}>
              <IconStarFilled size={20} className="text-[var(--primitive-color-yellow400)]" />
              <IconStar size={20} stroke={1.5} className="text-[var(--color-text-muted)]" />
            </HStack>
          </UsageExample>
        </SectionCard.Content>
      </SectionCard>

      {/* --- Import Statements --- */}
      <SectionCard>
        <SectionCard.Header title="Import Statements" />
        <SectionCard.Content>
          <VStack gap={4}>
            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-lg">
              <h4 className="text-label-sm text-[var(--color-text-muted)] mb-2">Tabler Icons</h4>
              <code className="text-body-sm font-mono text-[var(--color-text-default)]">
                {`import { IconName } from '@tabler/icons-react';`}
              </code>
            </div>
            <div className="p-4 bg-[var(--color-surface-subtle)] rounded-lg">
              <h4 className="text-label-sm text-[var(--color-text-muted)] mb-2">
                Custom Icons (TDS)
              </h4>
              <code className="text-body-sm font-mono text-[var(--color-text-default)]">
                {`import { IconName } from '@/design-system/components/Icons/CustomIcons';`}
              </code>
            </div>
          </VStack>
        </SectionCard.Content>
      </SectionCard>

      {/* --- General Guidelines --- */}
      <SectionCard>
        <SectionCard.Header title="General Guidelines" />
        <SectionCard.Content>
          <VStack gap={3}>
            <div className="flex items-start gap-3">
              <IconCircleCheck size={16} className="text-[var(--color-state-success)] mt-0.5" />
              <p className="text-body-md text-[var(--color-text-default)]">
                상태 아이콘과 심볼 아이콘에는 레이블을 함께 사용하세요.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <IconCircleCheck size={16} className="text-[var(--color-state-success)] mt-0.5" />
              <p className="text-body-md text-[var(--color-text-default)]">
                stroke width는 항상 1.5를 사용하세요.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <IconAlertCircle size={16} className="text-[var(--color-state-danger)] mt-0.5" />
              <p className="text-body-md text-[var(--color-text-default)]">
                페이지, 섹션 제목에 아이콘을 사용하지 마세요.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <IconAlertCircle size={16} className="text-[var(--color-state-danger)] mt-0.5" />
              <p className="text-body-md text-[var(--color-text-default)]">
                여러 아이콘을 하나의 객체로 결합하지 마세요.
              </p>
            </div>
          </VStack>
        </SectionCard.Content>
      </SectionCard>
    </VStack>
  );
}

/* ----------------------------------------
   Page Export
   ---------------------------------------- */

export function IconsPage() {
  return (
    <ComponentPageTemplate
      title="Icons"
      description="Tabler Icons & Custom Icons - Stroke width 1.5, Size 16-20px"
      examples={<IconsContent />}
      relatedLinks={[
        {
          label: 'App icons',
          path: '/design/foundation/app-icons',
          description: 'Application icons for THAKI Cloud',
        },
      ]}
    />
  );
}
