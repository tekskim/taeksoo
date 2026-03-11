import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  Button,
  SearchInput,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  VStack,
  HStack,
  PageShell,
  TopBar,
} from '@/design-system';
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
  // UI - Theme
  IconSun,
  IconMoon,
  // Infrastructure - Compute
  IconServer,
  IconServer2,
  IconCube,
  IconCpu,
  IconServerCog,
  IconCloud,
  // Infrastructure - Network
  IconNetwork,
  IconRouter,
  IconPlug,
  IconPlugConnected,
  IconScale,
  IconWorldWww,
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
  IconChartDonut,
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
  IconBooks,
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
  IconBox,
  IconCompass,
  IconPackages,
  IconMessageCircle,
  IconRoute,
  IconMessages,
  IconPuzzle,
  // Recently added action icons
  IconBinaryTree,
  IconLinkPlus,
  IconCircleMinus,
  IconReload,
  IconRestore,
} from '@tabler/icons-react';
import {
  IconTimeout,
  IconHistory2,
  IconUbuntu2,
  IconRocky2,
  IconWindowActive,
  IconWindowMinimized,
} from '@/design-system/components/Icons/CustomIcons';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface IconItem {
  icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>;
  name: string;
  label: string;
  library?: 'tabler' | 'lucide' | 'custom';
}

interface IconCategory {
  title: string;
  items: IconItem[];
}

/* ----------------------------------------
   Icon Data - Design System Icons
   ---------------------------------------- */

const iconCategories: IconCategory[] = [
  {
    title: 'Actions - Media Controls',
    items: [
      { icon: IconPlayerPlay, name: 'IconPlayerPlay', label: 'Play' },
      { icon: IconPlayerStop, name: 'IconPlayerStop', label: 'Stop' },
      { icon: IconPlayerPause, name: 'IconPlayerPause', label: 'Pause' },
      { icon: IconRefresh, name: 'IconRefresh', label: 'Refresh' },
      { icon: IconRefreshDot, name: 'IconRefreshDot', label: 'Reboot' },
      { icon: IconRotate, name: 'IconRotate', label: 'Rotate' },
      { icon: IconRotateClockwise, name: 'IconRotateClockwise', label: 'Retry' },
      { icon: IconPower, name: 'IconPower', label: 'Reboot' },
      { icon: IconCircleX, name: 'IconCircleX', label: 'Terminate' },
    ],
  },
  {
    title: 'Actions - CRUD',
    items: [
      { icon: IconPlus, name: 'IconPlus', label: 'Add' },
      { icon: IconCirclePlus, name: 'IconCirclePlus', label: 'Create / Add' },
      { icon: IconSquarePlus, name: 'IconSquarePlus', label: 'Attach' },
      { icon: IconMinus, name: 'IconMinus', label: 'Remove' },
      { icon: IconPencil, name: 'IconPencil', label: 'Edit' },
      { icon: IconTrash, name: 'IconTrash', label: 'Delete' },
      { icon: IconTrashX, name: 'IconTrashX', label: 'Deleting' },
      { icon: IconCopy, name: 'IconCopy', label: 'Copy' },
      { icon: IconRestore, name: 'IconRestore', label: 'Restore' },
      { icon: IconReload, name: 'IconReload', label: 'Reset' },
    ],
  },
  {
    title: 'Actions - Transfer',
    items: [
      { icon: IconDownload, name: 'IconDownload', label: 'Download' },
      { icon: IconUpload, name: 'IconUpload', label: 'Upload' },
      { icon: IconShare, name: 'IconShare', label: 'Share' },
      { icon: IconSend, name: 'IconSend', label: 'Send' },
      { icon: IconTransfer, name: 'IconTransfer', label: 'Transfer' },
      { icon: IconLink, name: 'IconLink', label: 'Link' },
      { icon: IconUnlink, name: 'IconUnlink', label: 'Unlink' },
      { icon: IconLinkOff, name: 'IconLinkOff', label: 'Link Off' },
      { icon: IconLinkPlus, name: 'IconLinkPlus', label: 'Associate' },
      { icon: IconExternalLink, name: 'IconExternalLink', label: 'External' },
      { icon: IconBinaryTree, name: 'IconBinaryTree', label: 'Allocate' },
      { icon: IconCircleMinus, name: 'IconCircleMinus', label: 'Remove' },
    ],
  },
  {
    title: 'Navigation - Chevrons & Arrows',
    items: [
      { icon: IconChevronLeft, name: 'IconChevronLeft', label: 'Chevron L' },
      { icon: IconChevronRight, name: 'IconChevronRight', label: 'Chevron R' },
      { icon: IconChevronDown, name: 'IconChevronDown', label: 'Chevron D' },
      { icon: IconChevronUp, name: 'IconChevronUp', label: 'Chevron U' },
      { icon: IconArrowLeft, name: 'IconArrowLeft', label: 'Arrow L' },
      { icon: IconArrowRight, name: 'IconArrowRight', label: 'Arrow R' },
      { icon: IconArrowUp, name: 'IconArrowUp', label: 'Arrow U' },
      { icon: IconArrowDown, name: 'IconArrowDown', label: 'Arrow D' },
      { icon: IconCaretRightFilled, name: 'IconCaretRightFilled', label: 'Caret R' },
      { icon: IconCaretDownFilled, name: 'IconCaretDownFilled', label: 'Caret D' },
    ],
  },
  {
    title: 'Navigation - Expand & Menu',
    items: [
      { icon: IconArrowsMaximize, name: 'IconArrowsMaximize', label: 'Maximize' },
      { icon: IconArrowsMinimize, name: 'IconArrowsMinimize', label: 'Minimize' },
      {
        icon: IconLayoutSidebarLeftCollapse,
        name: 'IconLayoutSidebarLeftCollapse',
        label: 'Collapse',
      },
      { icon: IconDotsCircleHorizontal, name: 'IconDotsCircleHorizontal', label: 'Action' },
      { icon: IconDots, name: 'IconDots', label: 'Meatball' },
      { icon: IconDotsVertical, name: 'IconDotsVertical', label: 'Kebab' },
    ],
  },
  {
    title: 'Status - Success & Error',
    items: [
      { icon: IconCircleCheck, name: 'IconCircleCheck', label: 'Success' },
      { icon: IconCheck, name: 'IconCheck', label: 'Check' },
      { icon: IconShieldCheck, name: 'IconShieldCheck', label: 'Verified' },
      { icon: IconShieldX, name: 'IconShieldX', label: 'Sec Error' },
      { icon: IconAlertCircle, name: 'IconAlertCircle', label: 'Error' },
      { icon: IconAlertTriangle, name: 'IconAlertTriangle', label: 'Warning' },
      { icon: IconAlertOctagon, name: 'IconAlertOctagon', label: 'Critical' },
      { icon: IconInfoCircle, name: 'IconInfoCircle', label: 'Info' },
      { icon: IconHelpCircle, name: 'IconHelpCircle', label: 'Help' },
    ],
  },
  {
    title: 'Status - State',
    items: [
      { icon: IconCircle, name: 'IconCircle', label: 'Active' },
      { icon: IconCircleOff, name: 'IconCircleOff', label: 'Inactive' },
      { icon: IconBan, name: 'IconBan', label: 'Suspended' },
      { icon: IconTool, name: 'IconTool', label: 'Maintain' },
      { icon: IconLoader, name: 'IconLoader', label: 'Loading' },
      { icon: IconLoader2, name: 'IconLoader2', label: 'Spinner' },
      { icon: IconProgress, name: 'IconProgress', label: 'Progress' },
      { icon: IconInfinity, name: 'IconInfinity', label: 'Infinity' },
    ],
  },
  {
    title: 'UI - Common',
    items: [
      { icon: IconSearch, name: 'IconSearch', label: 'Search' },
      { icon: IconFilter, name: 'IconFilter', label: 'Filter' },
      { icon: IconSettings, name: 'IconSettings', label: 'Manage' },
      { icon: IconHome, name: 'IconHome', label: 'Home' },
      { icon: IconX, name: 'IconX', label: 'Close' },
      { icon: IconList, name: 'IconList', label: 'List' },
      { icon: IconLayoutGrid, name: 'IconLayoutGrid', label: 'Grid' },
      { icon: IconGridDots, name: 'IconGridDots', label: 'Grid Dots' },
      { icon: IconArrowsSort, name: 'IconArrowsSort', label: 'Sort' },
    ],
  },
  {
    title: 'UI - Notifications & Favorites',
    items: [
      { icon: IconBell, name: 'IconBell', label: 'Bell' },
      { icon: IconBellRinging, name: 'IconBellRinging', label: 'Bell Ring' },
      { icon: IconStar, name: 'IconStar', label: 'Star' },
      { icon: IconStarFilled, name: 'IconStarFilled', label: 'Star Fill' },
      { icon: IconHeart, name: 'IconHeart', label: 'Heart' },
      { icon: IconTarget, name: 'IconTarget', label: 'Target' },
      { icon: IconPoint, name: 'IconPoint', label: 'Dot' },
    ],
  },
  {
    title: 'UI - Visibility & Security',
    items: [
      { icon: IconEye, name: 'IconEye', label: 'Show' },
      { icon: IconEyeOff, name: 'IconEyeOff', label: 'Hide' },
      { icon: IconLock, name: 'IconLock', label: 'Lock' },
      { icon: IconShield, name: 'IconShield', label: 'Shield' },
      { icon: IconShieldLock, name: 'IconShieldLock', label: 'Shield Lock' },
      { icon: IconKey, name: 'IconKey', label: 'Key' },
    ],
  },
  {
    title: 'UI - User & Communication',
    items: [
      { icon: IconUser, name: 'IconUser', label: 'User' },
      { icon: IconUserCircle, name: 'IconUserCircle', label: 'User Circle' },
      { icon: IconUsers, name: 'IconUsers', label: 'Users' },
      { icon: IconUsersGroup, name: 'IconUsersGroup', label: 'Users Group' },
      { icon: IconUserCog, name: 'IconUserCog', label: 'User Cog' },
      { icon: IconMail, name: 'IconMail', label: 'Mail' },
      { icon: IconMessage, name: 'IconMessage', label: 'Message' },
      { icon: IconMessagePlus, name: 'IconMessagePlus', label: 'New Chat' },
      { icon: IconMessages, name: 'IconMessages', label: 'Messages' },
      { icon: IconMessageCircle, name: 'IconMessageCircle', label: 'Message Circle' },
      { icon: IconHelp, name: 'IconHelp', label: 'Help' },
      { icon: IconQuestionMark, name: 'IconQuestionMark', label: 'Question' },
    ],
  },
  {
    title: 'UI - Theme',
    items: [
      { icon: IconSun, name: 'IconSun', label: 'Light' },
      { icon: IconMoon, name: 'IconMoon', label: 'Dark' },
    ],
  },
  {
    title: 'Infrastructure - Compute',
    items: [
      { icon: IconServer, name: 'IconServer', label: 'Server' },
      { icon: IconServer2, name: 'IconServer2', label: 'Instance' },
      { icon: IconCube, name: 'IconCube', label: 'Cube' },
      { icon: IconCpu, name: 'IconCpu', label: 'CPU' },
      { icon: IconCpu2, name: 'IconCpu2', label: 'CPU 2' },
      { icon: IconServerCog, name: 'IconServerCog', label: 'Host Agg' },
      { icon: IconCloud, name: 'IconCloud', label: 'Cloud' },
    ],
  },
  {
    title: 'Infrastructure - Network',
    items: [
      { icon: IconNetwork, name: 'IconNetwork', label: 'Network' },
      { icon: IconRouter, name: 'IconRouter', label: 'Router' },
      { icon: IconPlug, name: 'IconPlug', label: 'Port' },
      { icon: IconPlugConnected, name: 'IconPlugConnected', label: 'Connected' },
      { icon: IconScale, name: 'IconScale', label: 'Load Bal' },
      { icon: IconLoadBalancer, name: 'IconLoadBalancer', label: 'Load Balancer' },
      { icon: IconWorldWww, name: 'IconWorldWww', label: 'Float IP' },
      { icon: IconWorld, name: 'IconWorld', label: 'World' },
      { icon: IconTopologyRing, name: 'IconTopologyRing', label: 'Topo Ring' },
      { icon: IconTopologyStar, name: 'IconTopologyStar', label: 'Topo Star' },
      { icon: IconTopologyStar3, name: 'IconTopologyStar3', label: 'Topo Star 3' },
    ],
  },
  {
    title: 'Infrastructure - Storage',
    items: [
      { icon: IconDatabase, name: 'IconDatabase', label: 'Database' },
      { icon: IconDatabaseSearch, name: 'IconDatabaseSearch', label: 'Vol Search' },
      { icon: IconDatabaseExport, name: 'IconDatabaseExport', label: 'DB Export' },
      { icon: IconDatabaseCog, name: 'IconDatabaseCog', label: 'DB Cog' },
      { icon: IconDeviceFloppy, name: 'IconDeviceFloppy', label: 'Disk' },
      { icon: IconDeviceSdCard, name: 'IconDeviceSdCard', label: 'Backup' },
      { icon: IconBoxMultiple, name: 'IconBoxMultiple', label: 'Vol Type' },
      { icon: IconBucket, name: 'IconBucket', label: 'Bucket' },
    ],
  },
  {
    title: 'Infrastructure - Security',
    items: [
      { icon: IconShield, name: 'IconShield', label: 'Security' },
      { icon: IconShieldLock, name: 'IconShieldLock', label: 'Sec Group' },
      { icon: IconShieldCheck, name: 'IconShieldCheck', label: 'Shield OK' },
      { icon: IconKey, name: 'IconKey', label: 'Key Pair' },
      { icon: IconCertificate, name: 'IconCertificate', label: 'Certificate' },
    ],
  },
  {
    title: 'Storage & Files',
    items: [
      { icon: IconCamera, name: 'IconCamera', label: 'Snapshot' },
      { icon: IconDisc, name: 'IconDisc', label: 'Image' },
      { icon: IconFile, name: 'IconFile', label: 'File' },
      { icon: IconFileText, name: 'IconFileText', label: 'Doc' },
      { icon: IconFileDescription, name: 'IconFileDescription', label: 'Description' },
      { icon: IconFileCode, name: 'IconFileCode', label: 'Code File' },
      { icon: IconFileSettings, name: 'IconFileSettings', label: 'Settings File' },
      { icon: IconFolder, name: 'IconFolder', label: 'Folder' },
      { icon: IconFolderOpen, name: 'IconFolderOpen', label: 'Folder Open' },
      { icon: IconFolders, name: 'IconFolders', label: 'Folders' },
      { icon: IconArchive, name: 'IconArchive', label: 'Archive' },
      { icon: IconTemplate, name: 'IconTemplate', label: 'Template' },
      { icon: IconStack2, name: 'IconStack2', label: 'Layers' },
      { icon: IconStack3, name: 'IconStack3', label: 'Stack' },
      { icon: IconCode, name: 'IconCode', label: 'Code' },
    ],
  },
  {
    title: 'Monitoring & Analytics',
    items: [
      { icon: IconTerminal, name: 'IconTerminal', label: 'Console' },
      { icon: IconTerminal2, name: 'IconTerminal2', label: 'Terminal' },
      { icon: IconActivity, name: 'IconActivity', label: 'Activity' },
      { icon: IconChartBar, name: 'IconChartBar', label: 'Bar Chart' },
      { icon: IconChartDonut, name: 'IconChartDonut', label: 'Donut' },
      { icon: IconChartPie3, name: 'IconChartPie3', label: 'Pie Chart' },
      { icon: IconGauge, name: 'IconGauge', label: 'Gauge' },
      { icon: IconBrandSpeedtest, name: 'IconBrandSpeedtest', label: 'Speedtest' },
      { icon: IconDeviceDesktop, name: 'IconDeviceDesktop', label: 'Desktop' },
      { icon: IconDeviceDesktopAnalytics, name: 'IconDeviceDesktopAnalytics', label: 'Analytics' },
      { icon: IconLayoutDashboard, name: 'IconLayoutDashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'Organization & Structure',
    items: [
      { icon: IconBuilding, name: 'IconBuilding', label: 'Building' },
      { icon: IconCategory, name: 'IconCategory', label: 'Category' },
      { icon: IconLayoutSidebar, name: 'IconLayoutSidebar', label: 'Sidebar' },
      { icon: IconAdjustments, name: 'IconAdjustments', label: 'Adjust' },
      { icon: IconBolt, name: 'IconBolt', label: 'Bolt' },
      { icon: IconGitBranch, name: 'IconGitBranch', label: 'Branch' },
      { icon: IconAffiliate, name: 'IconAffiliate', label: 'Affiliate' },
      { icon: IconListSearch, name: 'IconListSearch', label: 'List Search' },
      { icon: IconRulerMeasure, name: 'IconRulerMeasure', label: 'Ruler' },
      { icon: IconReorder, name: 'IconReorder', label: 'Reorder' },
      { icon: IconArrowsShuffle, name: 'IconArrowsShuffle', label: 'Shuffle' },
      { icon: IconArrowsJoin2, name: 'IconArrowsJoin2', label: 'Join' },
      { icon: IconTimelineEvent, name: 'IconTimelineEvent', label: 'Timeline' },
    ],
  },
  {
    title: 'Time & Schedule',
    items: [
      { icon: IconClock, name: 'IconClock', label: 'Clock' },
      { icon: IconHourglass, name: 'IconHourglass', label: 'Hourglass' },
      { icon: IconStopwatch, name: 'IconStopwatch', label: 'Timeout' },
      { icon: IconHistory, name: 'IconHistory', label: 'History' },
      { icon: IconArticle, name: 'IconArticle', label: 'Article' },
      { icon: IconCalendar, name: 'IconCalendar', label: 'Calendar' },
      { icon: IconCalendarTime, name: 'IconCalendarTime', label: 'Cal Time' },
    ],
  },
  {
    title: 'Container & Workloads',
    items: [
      { icon: IconBox, name: 'IconBox', label: 'Pod' },
      { icon: IconRocket, name: 'IconRocket', label: 'Deploy' },
      { icon: IconCompass, name: 'IconCompass', label: 'Compass' },
      { icon: IconPackages, name: 'IconPackages', label: 'Packages' },
      { icon: IconRoute, name: 'IconRoute', label: 'Route' },
      { icon: IconPuzzle, name: 'IconPuzzle', label: 'Puzzle' },
    ],
  },
  {
    title: 'Business & Finance',
    items: [
      { icon: IconCurrencyDollar, name: 'IconCurrencyDollar', label: 'Dollar' },
      { icon: IconLanguage, name: 'IconLanguage', label: 'Language' },
    ],
  },
  {
    title: 'AI & ML',
    items: [
      { icon: IconBrain, name: 'IconBrain', label: 'Brain' },
      { icon: IconRobot, name: 'IconRobot', label: 'Robot' },
      { icon: IconRobotFace, name: 'IconRobotFace', label: 'Robot Face' },
      { icon: IconMessageChatbot, name: 'IconMessageChatbot', label: 'Chatbot' },
      { icon: IconBooks, name: 'IconBooks', label: 'Books' },
      { icon: IconBook, name: 'IconBook', label: 'Book' },
      { icon: IconTestPipe, name: 'IconTestPipe', label: 'Test' },
    ],
  },
  {
    title: 'OS / Brand',
    items: [
      { icon: IconUbuntu2, name: 'IconUbuntu2', label: 'Ubuntu', library: 'custom' },
      { icon: IconBrandDebian, name: 'IconBrandDebian', label: 'Debian' },
      { icon: IconBrandWindows, name: 'IconBrandWindows', label: 'Windows' },
      { icon: IconBrandRedhat, name: 'IconBrandRedhat', label: 'RedHat' },
      { icon: IconRocky2, name: 'IconRocky2', label: 'Rocky', library: 'custom' },
      { icon: IconGrid3x3, name: 'IconGrid3x3', label: 'Grid' },
      { icon: IconCircleDot, name: 'IconCircleDot', label: 'Other' },
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
      },
      {
        icon: IconWindowMinimized,
        name: 'IconWindowMinimized',
        label: 'Window Min',
        library: 'custom',
      },
      { icon: IconTimeout, name: 'IconTimeout', label: 'Timeout', library: 'custom' },
      { icon: IconHistory2, name: 'IconHistory2', label: 'History', library: 'custom' },
    ],
  },
];

/* ----------------------------------------
   Icon Table Row Component
   ---------------------------------------- */

interface IconRowProps {
  item: IconItem;
  categoryType: string;
}

function IconRow({ item, categoryType }: IconRowProps) {
  const [copied, setCopied] = useState(false);
  const Icon = item.icon;

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

  // Extract type from category (e.g., "Actions - Media Controls" -> "Action")
  const type = categoryType.split(' - ')[0].replace(/s$/, '');

  const libraryLabel =
    item.library === 'custom' ? 'Custom' : item.library === 'lucide' ? 'Lucide' : 'Tabler';

  return (
    <tr
      onClick={handleCopy}
      className="border-b border-[var(--color-border-default)] hover:bg-[var(--color-surface-subtle)] cursor-pointer transition-colors group"
    >
      <td className="py-3 px-4" style={{ width: '64px' }}>
        <div className="flex items-center justify-center">
          <Icon size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        </div>
      </td>
      <td className="py-3 px-4" style={{ width: '220px' }}>
        <div className="flex items-center gap-2">
          <span className="text-body-md text-[var(--color-text-default)]">{item.name}</span>
          {copied && (
            <span className="text-body-sm text-[var(--color-state-success)]">Copied!</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4" style={{ width: '100px' }}>
        <span className="text-body-md text-[var(--color-text-muted)]">{type}</span>
      </td>
      <td className="py-3 px-4" style={{ width: '80px' }}>
        {item.library === 'custom' ? (
          <span className="text-body-sm px-2 py-0.5 bg-[var(--color-state-warning-bg)] text-[var(--color-state-warning)] rounded">
            {libraryLabel}
          </span>
        ) : (
          <span className="text-body-md text-[var(--color-text-subtle)]">{libraryLabel}</span>
        )}
      </td>
      <td className="py-3 px-4">
        <span className="text-body-md text-[var(--color-text-subtle)]">{item.label}</span>
      </td>
    </tr>
  );
}

/* ----------------------------------------
   Size Demo Component
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
   Usage Example Component
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
   Iconography Page
   ---------------------------------------- */

export function IconographyPage() {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('icons');

  // Get all unique category titles
  const categoryTitles = useMemo(() => ['all', ...iconCategories.map((c) => c.title)], []);

  // Filter icons
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

  // Total icon count
  const totalIcons = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  const sidebarWidth = 0;

  return (
    <PageShell
      sidebarWidth={sidebarWidth}
      topBar={
        <TopBar
          breadcrumb={
            <HStack gap={4} align="center">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<IconArrowLeft size={14} stroke={1.5} />}
                onClick={() => navigate('/')}
              >
                Back
              </Button>
              <div className="w-px h-5 bg-[var(--color-border-default)]" />
              <img
                src={isDark ? ThakiLogoDark : ThakiLogoLight}
                alt="THAKI Cloud"
                className="h-5"
              />
            </HStack>
          }
          actions={
            <div className="w-[280px]">
              <SearchInput
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
              />
            </div>
          }
        />
      }
      contentClassName="max-w-7xl mx-auto px-8 py-8"
    >
      {/* Page Header */}
      <VStack gap={2} className="mb-8">
        <h1 className="text-heading-h3 text-[var(--color-text-default)]">Iconography</h1>
        <p className="text-body-md text-[var(--color-text-subtle)]">
          Tabler Icons & Custom Icons - Stroke width 1.5, Size 16-20px
        </p>
      </VStack>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
        <TabList>
          <Tab value="icons">Icon Set</Tab>
          <Tab value="sizes">Size Guidelines</Tab>
          <Tab value="usage">Usage</Tab>
        </TabList>

        {/* Icon Set Tab */}
        <TabPanel value="icons" className="pt-6">
          <VStack gap={4}>
            {/* Header with count and category filter */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-heading-h5 text-[var(--color-text-default)]">
                Available icons ({totalIcons})
              </h2>
              {/* Category Filter - Dropdown style */}
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
            </div>

            {/* Icons Table */}
            {filteredCategories.map((category) => (
              <div
                key={category.title}
                className="bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] overflow-hidden"
              >
                {/* Category Header */}
                <div className="px-4 py-3 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
                  <h3 className="text-label-md text-[var(--color-text-default)] font-semibold">
                    {category.title}
                    <span className="ml-2 text-body-sm text-[var(--color-text-subtle)] font-normal">
                      ({category.items.length})
                    </span>
                  </h3>
                </div>

                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th
                        className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                        style={{ width: '64px' }}
                      >
                        Icon
                      </th>
                      <th
                        className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                        style={{ width: '220px' }}
                      >
                        Name
                      </th>
                      <th
                        className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                        style={{ width: '100px' }}
                      >
                        Type
                      </th>
                      <th
                        className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium"
                        style={{ width: '80px' }}
                      >
                        Library
                      </th>
                      <th className="py-2 px-4 text-left text-label-sm text-[var(--color-text-muted)] font-medium">
                        Description
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

            {/* No Results */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-16">
                <IconSearch
                  size={48}
                  stroke={1}
                  className="mx-auto text-[var(--color-text-subtle)] mb-4"
                />
                <p className="text-body-md text-[var(--color-text-muted)]">
                  "{searchQuery}"에 대한 결과가 없습니다.
                </p>
              </div>
            )}
          </VStack>
        </TabPanel>

        {/* Size Guidelines Tab */}
        <TabPanel value="sizes" className="pt-6">
          <VStack gap={6}>
            <SectionCard>
              <SectionCard.Header title="Icon Sizes" />
              <SectionCard.Content>
                <p className="text-body-md text-[var(--color-text-subtle)] mb-6">
                  아이콘은 사용 컨텍스트에 따라 4가지 주요 사이즈로 표시됩니다. 텍스트와 함께 사용할
                  때는 폰트 크기와 조화를 이루는 사이즈를 선택하세요.
                </p>
                <SizeDemo />
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Stroke Width" />
              <SectionCard.Content>
                <p className="text-body-md text-[var(--color-text-subtle)] mb-4">
                  아이콘의 stroke-width는 인터페이스의 일관성에 중요한 요소입니다. TDS에서는{' '}
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
          </VStack>
        </TabPanel>

        {/* Usage Tab */}
        <TabPanel value="usage" className="pt-6">
          <VStack gap={6}>
            <SectionCard>
              <SectionCard.Header title="Button Icons" />
              <SectionCard.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UsageExample
                    title="sm/md 버튼"
                    description="12px 아이콘 사용"
                    code={`<Button size="sm" leftIcon={<IconPlus size={12} />}>Create</Button>`}
                  >
                    <Button size="sm" leftIcon={<IconPlus size={12} />}>
                      Create
                    </Button>
                    <Button size="md" leftIcon={<IconPencil size={12} />}>
                      Edit
                    </Button>
                  </UsageExample>

                  <UsageExample
                    title="lg 버튼"
                    description="14px 아이콘 사용"
                    code={`<Button size="lg" leftIcon={<IconPlus size={14} />}>Create</Button>`}
                  >
                    <Button size="lg" leftIcon={<IconPlus size={14} />}>
                      Create
                    </Button>
                  </UsageExample>
                </div>
              </SectionCard.Content>
            </SectionCard>

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
                    <IconLoader2
                      size={20}
                      className="animate-spin text-[var(--color-action-primary)]"
                    />
                  </UsageExample>
                </div>
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Favorite (Star) Icon" />
              <SectionCard.Content>
                <UsageExample
                  title="즐겨찾기"
                  description="yellow400 색상 사용"
                  code={`// Active
<IconStarFilled className="text-[var(--primitive-color-yellow400)]" />
// Inactive
<IconStar className="text-[var(--color-text-muted)]" />`}
                >
                  <HStack gap={4}>
                    <IconStarFilled size={20} className="text-[var(--primitive-color-yellow400)]" />
                    <IconStar size={20} stroke={1.5} className="text-[var(--color-text-muted)]" />
                  </HStack>
                </UsageExample>
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Import Statements" />
              <SectionCard.Content>
                <VStack gap={4}>
                  <div className="p-4 bg-[var(--color-surface-subtle)] rounded-lg">
                    <h4 className="text-label-sm text-[var(--color-text-muted)] mb-2">
                      Tabler Icons
                    </h4>
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

            <SectionCard>
              <SectionCard.Header title="General Guidelines" />
              <SectionCard.Content>
                <VStack gap={3}>
                  <div className="flex items-start gap-3">
                    <IconCircleCheck
                      size={16}
                      className="text-[var(--color-state-success)] mt-0.5"
                    />
                    <p className="text-body-md text-[var(--color-text-default)]">
                      상태 아이콘과 심볼 아이콘에는 레이블을 함께 사용하세요.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconCircleCheck
                      size={16}
                      className="text-[var(--color-state-success)] mt-0.5"
                    />
                    <p className="text-body-md text-[var(--color-text-default)]">
                      stroke width는 항상 1.5를 사용하세요.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconAlertCircle
                      size={16}
                      className="text-[var(--color-state-danger)] mt-0.5"
                    />
                    <p className="text-body-md text-[var(--color-text-default)]">
                      페이지, 섹션 제목에 아이콘을 사용하지 마세요.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconAlertCircle
                      size={16}
                      className="text-[var(--color-state-danger)] mt-0.5"
                    />
                    <p className="text-body-md text-[var(--color-text-default)]">
                      여러 아이콘을 하나의 객체로 결합하지 마세요.
                    </p>
                  </div>
                </VStack>
              </SectionCard.Content>
            </SectionCard>
          </VStack>
        </TabPanel>
      </Tabs>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <p className="text-body-sm text-[var(--color-text-subtle)] text-center">
            © 2026 THAKI Cloud. All rights reserved.
          </p>
        </div>
      </footer>
    </PageShell>
  );
}

export default IconographyPage;
