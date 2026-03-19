import React, { type ReactElement } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../types';
import * as Raw from './generated';
import type { SvgIconProps } from './types';

// Tabler icons
import {
  IconActivity,
  IconAdjustments,
  IconAffiliate,
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowsJoin2,
  IconArrowUp,
  IconArticle,
  IconBell,
  IconBellRinging,
  IconBolt,
  IconBook,
  IconBrain,
  IconCalendar,
  IconCalendarEvent,
  IconCamera,
  IconCategory,
  IconCertificate,
  IconChartBar,
  IconCheck,
  IconCode,
  IconCompass,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircleCheck,
  IconCircleMinus,
  IconCirclePlus,
  IconCircleX,
  IconClock,
  IconCloudComputing,
  IconCopy,
  IconCpu2,
  IconCube,
  IconCurrencyDollar,
  IconDatabase,
  IconDatabaseSearch,
  IconDeviceDesktopAnalytics,
  IconDeviceSdCard,
  IconDotsCircleHorizontal,
  IconDotsVertical,
  IconDownload,
  IconDots,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFileCode,
  IconFolder,
  IconFolderCog,
  IconFolderOpen,
  IconGauge,
  IconGitBranch,
  IconGridDots,
  IconHelp,
  IconHelpCircle,
  IconHome,
  IconHourglass,
  IconInfoCircle,
  IconKey,
  IconLanguage,
  IconLayoutDashboard,
  IconLayoutGrid,
  IconLayoutSidebar,
  IconLayoutSidebarLeftCollapse,
  IconLink,
  IconLinkOff,
  IconList,
  IconListSearch,
  IconLivePhoto,
  IconLivePhotoOff,
  IconLoader,
  IconLock,
  IconMessage,
  IconMessageChatbot,
  IconMessageCircle,
  IconMessagePlus,
  IconMessages,
  IconMoon,
  IconNetwork,
  IconEdit,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerStop,
  IconPlug,
  IconPlugConnectedX,
  IconPlus,
  IconPower,
  IconPoint,
  IconProgress,
  IconPackages,
  IconPuzzle,
  IconRobotFace,
  IconRoute,
  IconRefresh,
  IconRefreshDot,
  IconRobot,
  IconRotateClockwise,
  IconRotateClockwise2,
  IconSearch,
  IconSend,
  IconServer,
  IconServer2,
  IconServerBolt,
  IconSettings,
  IconShare,
  IconShieldCheck,
  IconShieldExclamation,
  IconShieldLock,
  IconStar,
  IconStarFilled,
  IconSun,
  IconTemplate,
  IconTerminal2,
  IconTool,
  IconTrash,
  IconTransfer,
  IconUpload,
  IconUserCircle,
  IconWorldWww,
  IconX,
  IconArrowsSort,
  IconArrowsShuffle,
  IconBox,
  IconBrandSpeedtest,
  IconBucket,
  IconCalendarTime,
  IconChartPie3,
  IconDatabaseCog,
  IconDatabaseExport,
  IconDeviceDesktop,
  IconDisc,
  IconFileDescription,
  IconFileSettings,
  IconFolders,
  IconHistory,
  IconLoadBalancer,
  IconReorder,
  IconRocket,
  IconRulerMeasure,
  IconStack3,
  IconSquarePlus,
  IconTimelineEvent,
  IconTopologyStar,
  IconTopologyStar3,
  IconCpu,
  IconUserCog,
  IconUsers,
  IconUsersGroup,
  IconWorld,
  IconArrowsMaximize,
  IconArrowsMinimize,
} from '@tabler/icons-react';

type WrappedIconProps = Omit<IconProps, 'children'>;

export type IconComponent = (
  props: Omit<IconProps, 'children'>
) => ReactElement;

/**
 * Wrap a custom SVG icon (from generated.tsx) in the Icon component.
 */
function wrapIcon(
  Inner: React.ComponentType<SvgIconProps>,
  displayName: string
): IconComponent {
  const Wrapped = (props: WrappedIconProps): ReactElement => (
    <Icon {...props}>
      <Inner />
    </Icon>
  );
  Wrapped.displayName = displayName;
  return Wrapped;
}

/**
 * Wrap a custom SVG icon with weight="fill" as default.
 */
function wrapFilledIcon(
  Inner: React.ComponentType<SvgIconProps>,
  displayName: string
): IconComponent {
  const Wrapped = (props: WrappedIconProps): ReactElement => (
    <Icon weight="fill" {...props}>
      <Inner />
    </Icon>
  );
  Wrapped.displayName = displayName;
  return Wrapped;
}

/**
 * Wrap a Tabler icon in the Icon component.
 * Tabler icons accept size, color, stroke, className, style — compatible with Icon's cloneElement.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapTablerIcon(
  TablerIcon: React.ComponentType<any>,
  displayName: string
): IconComponent {
  const Wrapped = (props: WrappedIconProps): ReactElement => (
    <Icon {...props}>
      <TablerIcon />
    </Icon>
  );
  Wrapped.displayName = displayName;
  return Wrapped;
}

/**
 * Wrap a Tabler icon with weight="regular" (stroke 1.5) as default.
 * Used for AppBar icons to match the original custom SVG stroke width.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapTablerIconRegular(
  TablerIcon: React.ComponentType<any>,
  displayName: string
): IconComponent {
  const Wrapped = (props: WrappedIconProps): ReactElement => (
    <Icon weight="regular" {...props}>
      <TablerIcon />
    </Icon>
  );
  Wrapped.displayName = displayName;
  return Wrapped;
}

// ──────────────────────────────────────────
// Tabler-based icons (~70)
// Mapping follows SSOT design system index.ts
// ──────────────────────────────────────────

// Navigation & UI
export const ChevronLeftIcon: IconComponent = wrapTablerIcon(IconChevronLeft, 'ChevronLeftIcon');
export const ChevronRightIcon: IconComponent = wrapTablerIcon(IconChevronRight, 'ChevronRightIcon');
export const ChevronDownIcon: IconComponent = wrapTablerIcon(IconChevronDown, 'ChevronDownIcon');
export const ChevronUpIcon: IconComponent = wrapTablerIcon(IconChevronUp, 'ChevronUpIcon');
export const SearchIcon: IconComponent = wrapTablerIcon(IconSearch, 'SearchIcon');
export const CloseSmallIcon: IconComponent = wrapTablerIcon(IconX, 'CloseSmallIcon');
export const HomeIcon: IconComponent = wrapTablerIcon(IconHome, 'HomeIcon');
export const SidebarIcon: IconComponent = wrapTablerIcon(IconLayoutSidebar, 'SidebarIcon');
export const ExternalLinkIcon: IconComponent = wrapTablerIcon(IconExternalLink, 'ExternalLinkIcon');
// Backward-compatible aliases. Use canonical names above in new code.
export const NewTabIcon: IconComponent = wrapTablerIcon(IconExternalLink, 'NewTabIcon');
export const PlusCircleIcon: IconComponent = wrapTablerIcon(IconCirclePlus, 'PlusCircleIcon');
export const CreateIcon: IconComponent = wrapTablerIcon(IconCirclePlus, 'CreateIcon');
export const AddIcon: IconComponent = wrapTablerIcon(IconPlus, 'AddIcon');
export const EditIcon: IconComponent = wrapTablerIcon(IconEdit, 'EditIcon');
export const DeleteIcon: IconComponent = wrapTablerIcon(IconTrash, 'DeleteIcon');
export const CopyIcon: IconComponent = wrapTablerIcon(IconCopy, 'CopyIcon');
export const MoreIcon: IconComponent = wrapTablerIcon(IconDotsVertical, 'MoreIcon');
export const MoreCircleIcon: IconComponent = wrapTablerIcon(
  IconDotsCircleHorizontal,
  'MoreCircleIcon'
);
export const DotIcon: IconComponent = wrapTablerIcon(IconPoint, 'DotIcon');
export const ActionIcon: IconComponent = wrapTablerIcon(IconDotsCircleHorizontal, 'ActionIcon');
export const SettingIcon: IconComponent = wrapTablerIcon(IconSettings, 'SettingIcon');
export const NotificationIcon: IconComponent = wrapTablerIcon(IconBell, 'NotificationIcon');
export const NotificationNewIcon: IconComponent = wrapTablerIcon(IconBellRinging, 'NotificationNewIcon');
export const FavoriteOffIcon: IconComponent = wrapTablerIcon(IconStar, 'FavoriteOffIcon');
export const FavoriteOnIcon: IconComponent = wrapTablerIcon(IconStarFilled, 'FavoriteOnIcon');

// Media Controls
export const PlayIcon: IconComponent = wrapTablerIcon(IconPlayerPlay, 'PlayIcon');
export const StopIcon: IconComponent = wrapTablerIcon(IconPlayerStop, 'StopIcon');
export const PausedIcon: IconComponent = wrapTablerIcon(IconPlayerPause, 'PausedIcon');
export const RefreshIcon: IconComponent = wrapTablerIcon(IconRefresh, 'RefreshIcon');
export const RebootIcon: IconComponent = wrapTablerIcon(IconRefreshDot, 'RebootIcon');
export const RetryIcon: IconComponent = wrapTablerIcon(IconRotateClockwise, 'RetryIcon');

// Status & State (SSOT-aligned)
export const ActiveIcon: IconComponent = wrapTablerIcon(IconLivePhoto, 'ActiveIcon');
export const DeactivatedIcon: IconComponent = wrapTablerIcon(IconLivePhotoOff, 'DeactivatedIcon');
export const ErrorIcon: IconComponent = wrapTablerIcon(IconCircleX, 'ErrorIcon');
export const AlertIcon: IconComponent = wrapTablerIcon(IconAlertTriangle, 'AlertIcon');
export const AlertCircleIcon: IconComponent = wrapTablerIcon(IconAlertCircle, 'AlertCircleIcon');
export const InfoIcon: IconComponent = wrapTablerIcon(IconInfoCircle, 'InfoIcon');
export const SuspendedIcon: IconComponent = wrapTablerIcon(IconCircleMinus, 'SuspendedIcon');
export const RequestIcon: IconComponent = wrapTablerIcon(IconHelpCircle, 'RequestIcon');
export const CheckCircleIcon: IconComponent = wrapTablerIcon(IconCircleCheck, 'CheckCircleIcon');
export const CheckIcon: IconComponent = wrapTablerIcon(IconCheck, 'CheckIcon');
export const VerifyIcon: IconComponent = wrapTablerIcon(IconShieldCheck, 'VerifyIcon');
export const MaintenanceIcon: IconComponent = wrapTablerIcon(IconTool, 'MaintenanceIcon');
export const SecurityErrorIcon: IconComponent = wrapTablerIcon(IconShieldExclamation, 'SecurityErrorIcon');
export const InuseIcon: IconComponent = wrapIcon(Raw.StatusInUse, 'InuseIcon');
export const LockIcon: IconComponent = wrapTablerIcon(IconLock, 'LockIcon');
export const ShelvedIcon: IconComponent = wrapTablerIcon(IconPlugConnectedX, 'ShelvedIcon');
export const PendingIcon: IconComponent = wrapTablerIcon(IconRotateClockwise2, 'PendingIcon');
export const ProgressIcon: IconComponent = wrapTablerIcon(IconProgress, 'ProgressIcon');
export const BuildingIcon: IconComponent = wrapTablerIcon(IconLoader, 'BuildingIcon');
export const DeletingIcon: IconComponent = wrapIcon(Raw.StatusDeleting, 'DeletingIcon');
export const ShutoffIcon: IconComponent = wrapTablerIcon(IconPower, 'ShutoffIcon');

// Data & View
export const ListIcon: IconComponent = wrapTablerIcon(IconList, 'ListIcon');
export const CardIcon: IconComponent = wrapTablerIcon(IconLayoutGrid, 'CardIcon');
export const GridIcon: IconComponent = wrapTablerIcon(IconGridDots, 'GridIcon');
export const UploadIcon: IconComponent = wrapTablerIcon(IconUpload, 'UploadIcon');
export const DownloadIcon: IconComponent = wrapTablerIcon(IconDownload, 'DownloadIcon');
export const PublishIcon: IconComponent = wrapTablerIcon(IconSend, 'PublishIcon');
export const ShowIcon: IconComponent = wrapTablerIcon(IconEye, 'ShowIcon');
export const HideIcon: IconComponent = wrapTablerIcon(IconEyeOff, 'HideIcon');
export const SnapshotIcon: IconComponent = wrapTablerIcon(IconCamera, 'SnapshotIcon');
export const OrderIcon: IconComponent = wrapTablerIcon(IconArrowsSort, 'OrderIcon');
export const ChartIcon: IconComponent = wrapTablerIcon(IconChartBar, 'ChartIcon');
export const LayersIcon: IconComponent = wrapTablerIcon(IconStack3, 'LayersIcon');
export const DashboardIcon: IconComponent = wrapTablerIcon(IconLayoutDashboard, 'DashboardIcon');
export const ActivityIcon: IconComponent = wrapTablerIcon(IconActivity, 'ActivityIcon');

// Cloud Infrastructure
export const InstancesIcon: IconComponent = wrapTablerIcon(IconCube, 'InstancesIcon');
export const BoxIcon: IconComponent = wrapTablerIcon(IconBox, 'BoxIcon');
export const ServerIcon: IconComponent = wrapTablerIcon(IconServer, 'ServerIcon');
export const StorageIcon: IconComponent = wrapTablerIcon(IconDatabase, 'StorageIcon');
export const HardDriveIcon: IconComponent = wrapIcon(Raw.HardDrive, 'HardDriveIcon');
export const NetworksIcon: IconComponent = wrapTablerIcon(IconNetwork, 'NetworksIcon');
// Backward-compatible alias. Use NetworksIcon in new code.
export const NetworkIcon: IconComponent = wrapTablerIcon(IconNetwork, 'NetworkIcon');
export const RoutersIcon: IconComponent = wrapIcon(Raw.Router, 'RoutersIcon');
export const PortsIcon: IconComponent = wrapIcon(Raw.Ports, 'PortsIcon');
export const FloatingIpIcon: IconComponent = wrapTablerIcon(IconWorldWww, 'FloatingIpIcon');
export const LoadBalancerIcon: IconComponent = wrapTablerIcon(IconLoadBalancer, 'LoadBalancerIcon');
export const HypervisorIcon: IconComponent = wrapTablerIcon(IconServer2, 'HypervisorIcon');
export const SecurityGroupIcon: IconComponent = wrapTablerIcon(IconShieldLock, 'SecurityGroupIcon');
export const KeyPairsIcon: IconComponent = wrapTablerIcon(IconKey, 'KeyPairsIcon');
export const KeyIcon: IconComponent = wrapTablerIcon(IconKey, 'KeyIcon');
export const CertificateIcon: IconComponent = wrapTablerIcon(IconCertificate, 'CertificateIcon');
export const SecurityIcon: IconComponent = wrapIcon(Raw.Firewall, 'SecurityIcon');
export const ImagesIcon: IconComponent = wrapTablerIcon(IconDisc, 'ImagesIcon');
export const BackupIcon: IconComponent = wrapTablerIcon(IconDatabaseExport, 'BackupIcon');
export const VolumeTypeIcon: IconComponent = wrapTablerIcon(IconDatabaseCog, 'VolumeTypeIcon');
export const AddVolumeIcon: IconComponent = wrapTablerIcon(IconSquarePlus, 'AddVolumeIcon');
export const VolumeSearchIcon: IconComponent = wrapTablerIcon(IconDatabaseSearch, 'VolumeSearchIcon');
export const FlavorIcon: IconComponent = wrapTablerIcon(IconCpu, 'FlavorIcon');
export const HostAggregatesIcon: IconComponent = wrapTablerIcon(IconArrowsJoin2, 'HostAggregatesIcon');
export const CloudComputingIcon: IconComponent = wrapTablerIcon(IconCloudComputing, 'CloudComputingIcon');
export const TopologyIcon: IconComponent = wrapTablerIcon(IconTopologyStar3, 'TopologyIcon');
export const BucketIcon: IconComponent = wrapTablerIcon(IconBucket, 'BucketIcon');
export const SpeedTestIcon: IconComponent = wrapTablerIcon(IconBrandSpeedtest, 'SpeedTestIcon');
export const ListSearchIcon: IconComponent = wrapTablerIcon(IconListSearch, 'ListSearchIcon');
export const Cpu2Icon: IconComponent = wrapTablerIcon(IconCpu2, 'Cpu2Icon');
export const ServerBoltIcon: IconComponent = wrapTablerIcon(IconServerBolt, 'ServerBoltIcon');
export const CalendarEventIcon: IconComponent = wrapTablerIcon(IconCalendarEvent, 'CalendarEventIcon');
export const MemoryStickIcon: IconComponent = wrapTablerIcon(IconDeviceSdCard, 'MemoryStickIcon');

// AI & ML
export const BrainIcon: IconComponent = wrapTablerIcon(IconBrain, 'BrainIcon');
export const RobotIcon: IconComponent = wrapTablerIcon(IconRobot, 'RobotIcon');
export const RobotFaceIcon: IconComponent = wrapTablerIcon(IconRobotFace, 'RobotFaceIcon');
export const AddRobotIcon: IconComponent = wrapIcon(Raw.AddRobot, 'AddRobotIcon');
export const PuzzleIcon: IconComponent = wrapTablerIcon(IconPuzzle, 'PuzzleIcon');
export const ChatbotIcon: IconComponent = wrapTablerIcon(IconMessageChatbot, 'ChatbotIcon');
export const MessagesIcon: IconComponent = wrapTablerIcon(IconMessages, 'MessagesIcon');
export const MessageCircleIcon: IconComponent = wrapTablerIcon(IconMessageCircle, 'MessageCircleIcon');
export const FinetuningIcon: IconComponent = wrapTablerIcon(IconAdjustments, 'FinetuningIcon');
export const StudyIcon: IconComponent = wrapTablerIcon(IconBook, 'StudyIcon');
export const CompassIcon: IconComponent = wrapTablerIcon(IconCompass, 'CompassIcon');
export const PackagesIcon: IconComponent = wrapTablerIcon(IconPackages, 'PackagesIcon');
export const CodeIcon: IconComponent = wrapTablerIcon(IconCode, 'CodeIcon');
export const RouteIcon: IconComponent = wrapTablerIcon(IconRoute, 'RouteIcon');

// Time & Schedule
export const CalendarIcon: IconComponent = wrapTablerIcon(IconCalendar, 'CalendarIcon');
export const ScheduleIcon: IconComponent = wrapTablerIcon(IconClock, 'ScheduleIcon');
export const HistoryIcon: IconComponent = wrapIcon(Raw.History, 'HistoryIcon');
export const HourglassHighIcon: IconComponent = wrapTablerIcon(IconHourglass, 'HourglassHighIcon');
export const ArticleHistoryIcon: IconComponent = wrapTablerIcon(IconArticle, 'ArticleHistoryIcon');

// Files & Templates
export const TemplateIcon: IconComponent = wrapTablerIcon(IconTemplate, 'TemplateIcon');
export const FileIcon: IconComponent = wrapTablerIcon(IconFileDescription, 'FileIcon');
export const PluginIcon: IconComponent = wrapTablerIcon(IconPlug, 'PluginIcon');
export const CategoryIcon: IconComponent = wrapTablerIcon(IconCategory, 'CategoryIcon');
export const AffiliateIcon: IconComponent = wrapTablerIcon(IconAffiliate, 'AffiliateIcon');

// Communication
export const HelpIcon: IconComponent = wrapTablerIcon(IconHelp, 'HelpIcon');
export const ChatIcon: IconComponent = wrapTablerIcon(IconMessage, 'ChatIcon');
export const NewChatIcon: IconComponent = wrapTablerIcon(IconMessagePlus, 'NewChatIcon');
export const ShareIcon: IconComponent = wrapTablerIcon(IconShare, 'ShareIcon');

// Links & Transfer
export const TransferIcon: IconComponent = wrapTablerIcon(IconTransfer, 'TransferIcon');
export const LinkIcon: IconComponent = wrapTablerIcon(IconLink, 'LinkIcon');
export const UnlinkIcon: IconComponent = wrapTablerIcon(IconLinkOff, 'UnlinkIcon');

// Console & Code
export const CodeConsoleIcon: IconComponent = wrapTablerIcon(IconTerminal2, 'CodeConsoleIcon');
export const DeviceDesktopAnalyticsIcon: IconComponent = wrapTablerIcon(IconDeviceDesktopAnalytics, 'DeviceDesktopAnalyticsIcon');

// Other
export const LanguageIcon: IconComponent = wrapTablerIcon(IconLanguage, 'LanguageIcon');
export const ZapIcon: IconComponent = wrapTablerIcon(IconBolt, 'ZapIcon');
export const DollarSignIcon: IconComponent = wrapTablerIcon(IconCurrencyDollar, 'DollarSignIcon');
export const SpeedIcon: IconComponent = wrapTablerIcon(IconGauge, 'SpeedIcon');
export const BranchIcon: IconComponent = wrapTablerIcon(IconGitBranch, 'BranchIcon');
export const UserCircleIcon: IconComponent = wrapTablerIcon(IconUserCircle, 'UserCircleIcon');
export const SunIcon: IconComponent = wrapTablerIcon(IconSun, 'SunIcon');
export const MoonIcon: IconComponent = wrapTablerIcon(IconMoon, 'MoonIcon');
export const AdjustmentsAltIcon: IconComponent = wrapTablerIcon(IconAdjustments, 'AdjustmentsAltIcon');

// Arrows
export const ArrowDownIcon: IconComponent = wrapTablerIcon(IconArrowDown, 'ArrowDownIcon');
export const ArrowUpIcon: IconComponent = wrapTablerIcon(IconArrowUp, 'ArrowUpIcon');
export const ArrowLeftIcon: IconComponent = wrapTablerIcon(IconArrowLeft, 'ArrowLeftIcon');
export const ArrowRightIcon: IconComponent = wrapTablerIcon(IconArrowRight, 'ArrowRightIcon');

// ──────────────────────────────────────────
// Custom SVG icons (kept as-is)
// ──────────────────────────────────────────

// ExpandOn/Off (custom triangle caret)
export const ExpandOnIcon: IconComponent = wrapIcon(Raw.ExpandOn, 'ExpandOnIcon');
export const ExpandOffIcon: IconComponent = wrapFilledIcon(Raw.ExpandOff, 'ExpandOffIcon');

// Domain-specific
export const SwitchIcon: IconComponent = wrapIcon(Raw.Switch, 'SwitchIcon');
export const DrawerCloseIcon: IconComponent = wrapTablerIcon(IconLayoutSidebarLeftCollapse, 'DrawerCloseIcon');
export const TimeoutIcon: IconComponent = wrapIcon(Raw.Timeout, 'TimeoutIcon');
export const ResetIcon: IconComponent = wrapIcon(Raw.Reset, 'ResetIcon');
export const IdentifyIcon: IconComponent = wrapIcon(Raw.Identify, 'IdentifyIcon');
export const FileCodeIcon: IconComponent = wrapTablerIcon(IconFileCode, 'FileCodeIcon');
export const FolderIcon: IconComponent = wrapTablerIcon(IconFolder, 'FolderIcon');
export const FolderOpenIcon: IconComponent = wrapTablerIcon(IconFolderOpen, 'FolderOpenIcon');
export const WindowIcon: IconComponent = wrapTablerIcon(IconGridDots, 'WindowIcon');
export const WindowCloseIcon: IconComponent = wrapIcon(Raw.WindowClose, 'WindowCloseIcon');
export const WindowMaximizeIcon: IconComponent = wrapIcon(Raw.WindowMaximize, 'WindowMaximizeIcon');
export const WindowMinimizeIcon: IconComponent = wrapIcon(Raw.WindowMinimize, 'WindowMinimizeIcon');
export const FullscreenIcon: IconComponent = wrapTablerIcon(IconArrowsMaximize, 'FullscreenIcon');
export const FullscreenExitIcon: IconComponent = wrapTablerIcon(IconArrowsMinimize, 'FullscreenExitIcon');
export const OtherIcon: IconComponent = wrapTablerIcon(IconDots, 'OtherIcon');
export const UbuntuIcon: IconComponent = wrapIcon(Raw.Ubuntu, 'UbuntuIcon');
export const RockyIcon: IconComponent = wrapIcon(Raw.Rocky, 'RockyIcon');

// Snap icons
export const SnapTopIcon: IconComponent = wrapIcon(Raw.SnapTop, 'SnapTopIcon');
export const SnapBottomIcon: IconComponent = wrapIcon(Raw.SnapBottom, 'SnapBottomIcon');
export const SnapLeftIcon: IconComponent = wrapIcon(Raw.SnapLeft, 'SnapLeftIcon');
export const SnapRightIcon: IconComponent = wrapIcon(Raw.SnapRight, 'SnapRightIcon');

// Toast
export const ToastSuccessIcon: IconComponent = wrapTablerIcon(IconCircleCheck, 'ToastSuccessIcon');
export const ToastErrorIcon: IconComponent = wrapTablerIcon(IconAlertTriangle, 'ToastErrorIcon');

// Sidebar icons (Container LNB, SSOT-aligned: Tabler)
export const SidebarArrowsShuffleIcon: IconComponent = wrapTablerIcon(IconArrowsShuffle, 'SidebarArrowsShuffleIcon');
export const SidebarCalendarTimeIcon: IconComponent = wrapTablerIcon(IconCalendarTime, 'SidebarCalendarTimeIcon');
export const SidebarChartCohortIcon: IconComponent = wrapTablerIcon(IconAffiliate, 'SidebarChartCohortIcon');
export const SidebarChartPieIcon: IconComponent = wrapTablerIcon(IconChartPie3, 'SidebarChartPieIcon');
export const SidebarFileSettingsIcon: IconComponent = wrapTablerIcon(IconFileSettings, 'SidebarFileSettingsIcon');
export const SidebarFoldersIcon: IconComponent = wrapTablerIcon(IconFolders, 'SidebarFoldersIcon');
export const SidebarPackagesIcon: IconComponent = wrapTablerIcon(IconFolderCog, 'SidebarPackagesIcon');
export const SidebarGroupIcon: IconComponent = wrapTablerIcon(IconUsersGroup, 'SidebarGroupIcon');
export const SidebarReorderIcon: IconComponent = wrapTablerIcon(IconReorder, 'SidebarReorderIcon');
export const SidebarRocketIcon: IconComponent = wrapTablerIcon(IconRocket, 'SidebarRocketIcon');
export const SidebarRulerMeasureIcon: IconComponent = wrapTablerIcon(IconRulerMeasure, 'SidebarRulerMeasureIcon');
export const SidebarNetworkIcon: IconComponent = wrapIcon(Raw.SidebarNetwork, 'SidebarNetworkIcon');
export const SidebarScalingIcon: IconComponent = wrapIcon(Raw.SidebarScaling, 'SidebarScalingIcon');
export const SidebarTimelineEventIcon: IconComponent = wrapTablerIcon(IconTimelineEvent, 'SidebarTimelineEventIcon');
export const SidebarTopologyStarIcon: IconComponent = wrapTablerIcon(IconTopologyStar, 'SidebarTopologyStarIcon');

// IAM icons (SSOT-aligned: Tabler)
export const IamDeviceDesktopIcon: IconComponent = wrapTablerIcon(IconDeviceDesktop, 'IamDeviceDesktopIcon');
export const IamHistoryIcon: IconComponent = wrapTablerIcon(IconHistory, 'IamHistoryIcon');
export const IamUserCogIcon: IconComponent = wrapTablerIcon(IconUserCog, 'IamUserCogIcon');
export const IamUsersIcon: IconComponent = wrapTablerIcon(IconUsers, 'IamUsersIcon');
export const IamUsersGroupIcon: IconComponent = wrapTablerIcon(IconUsersGroup, 'IamUsersGroupIcon');
export const IamWorldIcon: IconComponent = wrapTablerIcon(IconWorld, 'IamWorldIcon');

// MFA icons
export const DeviceMobileIcon: IconComponent = wrapIcon(Raw.DeviceMobile, 'DeviceMobileIcon');
export const EnvelopeIcon: IconComponent = wrapIcon(Raw.Envelope, 'EnvelopeIcon');

// AppBar icons (Tabler with stroke 1.5 to match original custom SVG)
export const AppBarDocumentIcon: IconComponent = wrapTablerIconRegular(IconFileDescription, 'AppBarDocumentIcon');
export const AppBarSettingsIcon: IconComponent = wrapTablerIconRegular(IconAdjustments, 'AppBarSettingsIcon');
export const AppBarUserIcon: IconComponent = wrapTablerIconRegular(IconUserCircle, 'AppBarUserIcon');
