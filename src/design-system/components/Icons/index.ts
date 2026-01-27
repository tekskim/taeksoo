/**
 * TDS Icon Library
 *
 * Figma 아이콘을 @tabler/icons-react에 매핑합니다.
 * 사용법: import { Icons } from '@/design-system';
 *
 * 예시:
 * <Icons.Play size={16} />
 * <Icons.ChevronDown size={20} strokeWidth={1.5} />
 */

// Custom Icons (Figma 디자인에 맞는 비율)

export type { CustomIconProps } from './CustomIcons';

// Custom Icons (Figma 디자인에 맞는 비율)
export {
  IconAction,
  IconActivity,
  IconAdd,
  IconAddRobot,
  IconAdjustmentsAlt,
  IconBrain,
  IconBranch,
  IconBuilding,
  IconCahatbot,
  IconCategory,
} from './CustomIcons';
export {
  IconChat,
  IconCheckcircle,
  IconChevrondown,
  IconChevronleft,
  IconChevronright,
  IconChevronup,
  IconClosesmall,
  IconCloudComputing,
  IconCodeConsole,
} from './CustomIcons';
export {
  IconCopy,
  IconDashboards,
  IconDelete,
  IconDeviceDesktopAnalytics,
  IconDollarSign,
  IconDot,
  IconDownload,
} from './CustomIcons';
export {
  IconEdit,
  IconErrorWarning,
  IconExpandOff,
  IconExpandOn,
  IconExternallink,
  IconFavoriteoff,
  IconFlavor,
  IconHelp,
  IconHide,
  IconHome,
  IconHourglassHigh,
} from './CustomIcons';
export {
  IconInfo,
  IconKeypairs,
  IconLayers,
  IconLink,
  IconList,
  IconLoadbalancer,
  IconLock,
  IconMicrosoft,
  IconMoreKebab,
  IconMoreMeatball,
} from './CustomIcons';
export {
  IconNetworks,
  IconNewtab,
  IconNotification,
  IconOther,
  IconPaused,
  IconPlay,
  IconPlusCircle,
  IconProgress,
  IconRefresh,
  IconRequest,
} from './CustomIcons';
export {
  IconReset1,
  IconReset2,
  IconRouters1,
  IconSchedule,
  IconSearch,
  IconSecurity,
  IconSecurityerror,
  IconServer,
  IconSetting,
  IconShare,
} from './CustomIcons';
export {
  IconShow,
  IconSidebar,
  IconSnapshot,
  IconStop,
  IconStorage,
  IconTemplate,
  IconTimeout,
  IconTopology,
  IconUpload,
} from './CustomIcons';
export {
  IconUserCircle,
  IconZap,
  IconRobotCustom,
  IconAddRobotCustom,
  IconWindowActive,
  IconWindowMinimized,
} from './CustomIcons';
// Newly added icons from SVG files (these replace existing ones)
export {
  IconActive,
  IconAddVolume,
  IconAlert,
  IconAttach,
  IconBackup,
  IconCertificate,
  IconChart,
  IconCheckCircle,
  IconDeactivated,
  IconDeleting,
  IconDrawerClose,
  IconError,
  IconFavoriteOn,
  IconFile,
  IconFloatingIp,
  IconHardDrive,
  IconHostAggregates,
  IconHypervisor,
  IconImages,
  IconInstances,
  IconInuse,
  IconKey,
  IconLoadBalancer,
  IconMaintenance,
  IconMorekebab,
  IconNetwork,
  IconNotificationnew,
  IconOrder,
  IconPlugin,
  IconPorts,
  IconPorts2,
  IconPublish,
  IconReboot,
  IconRouters,
  IconSecurityError,
  IconSecurityGroup,
  IconShelved,
  IconSuspended,
  IconVerify,
  IconVolumeSearch,
  IconVolumeType,
  IconWarning,
  IconAffiliate,
  IconArticlehistory,
  IconCard,
  IconCheck,
  IconCloudcomputing,
  IconFinetuning,
  IconHistory,
  IconLanguage,
  IconNewchat,
  IconPending,
  IconPuzzle,
  IconReset,
  IconRetry,
  IconRocky,
  IconSpeed,
  IconStudy,
  IconTransfer,
  IconUbuntu,
  IconUnlink,
  IconGrid,
} from './CustomIcons';

// Navigation & UI
export {
  IconChevronLeft as ChevronLeft,
  IconChevronRight as ChevronRight,
  IconChevronDown as ChevronDown,
  IconChevronUp as ChevronUp,
  IconLayoutSidebarLeftCollapse as DrawerClose,
  IconExternalLink as ExternalLink,
  IconExternalLink as NewTab,
  IconCirclePlus as PlusCircle,
  IconPlus as Add,
  IconSearch as Search,
  IconPencil as Edit,
  IconTrash as Delete,
  IconCopy as Copy,
  IconDotsVertical as MoreKebab,
  IconDots as MoreMeatball,
  IconPoint as Dot,
  IconMenu2 as Action,
  IconSettings as Setting,
  IconLayoutSidebar as Sidebar,
  IconHome as Home,
  IconBell as Notification,
  IconBellRinging as NotificationNew,
  IconStar as FavoriteOff,
  IconStarFilled as FavoriteOn,
  IconX as CloseSmall,
} from '@tabler/icons-react';

// Media Controls
export {
  IconPlayerPlay as Play,
  IconPlayerStop as Stop,
  IconPlayerPause as Paused,
  IconRefresh as Refresh,
  IconTrashX as Deleting,
} from '@tabler/icons-react';

// Status & State
export {
  IconAlertCircle as Error,
  IconAlertTriangle as Alert,
  IconInfoCircle as Info,
  IconAlertOctagon as ErrorWarning,
  IconBan as Suspended,
  IconHelpCircle as Request,
  IconCircleCheck as CheckCircle,
  IconCheck as Check,
  IconShieldCheck as Verify,
  IconCircle as Active,
  IconCircleOff as Deactivated,
  IconTool as Maintenance,
  IconAlertTriangle as Warning,
  IconShieldX as SecurityError,
  IconPlugConnected as Inuse,
  IconLock as Lock,
  IconArchive as Shelved,
} from '@tabler/icons-react';

// Data & View
export {
  IconList as List,
  IconLayoutGrid as Card,
  IconGridDots as Grid,
  IconUpload as Upload,
  IconDownload as Download,
  IconSend as Publish,
  IconEye as Show,
  IconEyeOff as Hide,
  IconCamera as Snapshot,
  IconArrowsSort as Order,
  IconChartBar as Chart,
  IconStack2 as Layers,
  IconLayoutDashboard as Dashboards,
  IconActivity as Activity,
} from '@tabler/icons-react';

// Cloud Infrastructure
export {
  IconCube as Instances,
  IconServer as Server,
  IconDatabase as Storage,
  IconDeviceFloppy as HardDrive,
  IconNetwork as Networks,
  IconRouter as Routers,
  IconPlug as Ports,
  IconWorldWww as FloatingIp,
  IconScale as LoadBalancer,
  IconServer2 as Hypervisor,
  IconShieldLock as SecurityGroup,
  IconKey as KeyPairs,
  IconCertificate as Certificate,
  IconKey as Key,
  IconShield as Security,
  IconPhoto as Images,
  IconDeviceSdCard as Backup,
  IconBoxMultiple as VolumeType,
  IconSquarePlus as AddVolume,
  IconDatabaseSearch as VolumeSearch,
  IconCpu as Flavor,
  IconServerCog as HostAggregates,
  IconCloud as CloudComputing,
  IconTopologyStar3 as Topology,
  IconTopologyStar3 as TopologyStar3,
  IconNetwork as Network,
} from '@tabler/icons-react';

// AI & ML
export {
  IconBrain as Brain,
  IconRobot as Robot,
  IconRobotFace as AddRobot,
  IconPuzzle as Puzzle,
  IconMessageChatbot as Chatbot,
  IconAdjustments as Finetuning,
  IconBook as Study,
  IconTestPipe as Test,
} from '@tabler/icons-react';

// Time & Schedule
export {
  IconClock as Schedule,
  IconHourglass as HourglassHigh,
  IconArticle as ArticleHistory,
} from '@tabler/icons-react';

// Files & Templates
export {
  IconTemplate as Template,
  IconFile as File,
  IconPlug as Plugin,
  IconCategory as Category,
  IconAffiliate as Affiliate,
} from '@tabler/icons-react';

// Communication
export {
  IconHelp as Help,
  IconMessage as Chat,
  IconMessagePlus as NewChat,
  IconShare as Share,
} from '@tabler/icons-react';

// Links & Transfer
export {
  IconTransfer as Transfer,
  IconLink as Link,
  IconLinkOff as Unlink,
} from '@tabler/icons-react';

// Console & Code
export {
  IconTerminal2 as CodeConsole,
  IconTerminal as Console,
  IconDeviceDesktopAnalytics as DeviceDesktopAnalytics,
} from '@tabler/icons-react';

// Other
export {
  IconLanguage as Language,
  IconBolt as Zap,
  IconCurrencyDollar as DollarSign,
  IconGauge as Speed,
  IconBuilding as Building,
  IconGitBranch as Branch,
  IconUserCircle as UserCircle,
} from '@tabler/icons-react';

// OS & Platform (custom - these may need custom SVGs)
export {
  IconBrandUbuntu as Ubuntu,
  IconBrandWindows as Microsoft,
  IconCircleDot as Rocky, // Placeholder - Rocky Linux doesn't have a tabler icon
  IconQuestionMark as Other,
} from '@tabler/icons-react';

// Newly Added Icons (최하단 - 나중에 정렬 예정)
export {
  IconRefreshDot as Reboot,
  IconRotateClockwise as Retry,
  IconProgress as Pending,
  IconProgress as Progress,
} from '@tabler/icons-react';

/* ----------------------------------------
   Icon Component Wrapper (Optional)
   ---------------------------------------- */

import { type IconProps } from '@tabler/icons-react';
import {
  IconExpandOn,
  IconExpandOff,
  IconRobotCustom,
  IconAddRobotCustom,
  IconHistory,
  IconTimeout,
  IconChat,
} from './CustomIcons';

export type TDSIconProps = IconProps;

/* ----------------------------------------
   All Icons as Object (for dynamic usage)
   ---------------------------------------- */

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconLayoutSidebarLeftCollapse,
  IconExternalLink,
  IconCirclePlus,
  IconPlus,
  IconSearch,
  IconPencil,
  IconTrash,
  IconTrashX,
  IconCopy,
  IconDotsVertical,
  IconDots,
  IconPoint,
  IconMenu2,
  IconSettings,
  IconLayoutSidebar,
  IconHome,
  IconBell,
  IconBellRinging,
  IconStar,
  IconStarFilled,
  IconX,
  IconPlayerPlay,
  IconPlayerStop,
  IconPlayerPause,
  IconRefresh,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconAlertOctagon,
  IconBan,
  IconHelpCircle,
  IconCircleCheck,
  IconCheck,
  IconShieldCheck,
  IconCircle,
  IconCircleOff,
  IconTool,
  IconShieldX,
  IconPlugConnected,
  IconLock,
  IconArchive,
  IconList,
  IconLayoutGrid,
  IconGridDots,
  IconUpload,
  IconDownload,
  IconSend,
  IconEye,
  IconEyeOff,
  IconCamera,
  IconArrowsSort,
  IconChartBar,
  IconStack2,
  IconLayoutDashboard,
  IconActivity,
  IconCube,
  IconServer,
  IconDatabase,
  IconDeviceFloppy,
  IconNetwork,
  IconRouter,
  IconPlug,
  IconWorldWww,
  IconScale,
  IconServer2,
  IconShieldLock,
  IconKey,
  IconCertificate,
  IconShield,
  IconPhoto,
  IconDeviceSdCard,
  IconBoxMultiple,
  IconSquarePlus,
  IconDatabaseSearch,
  IconCpu,
  IconServerCog,
  IconCloud,
  IconTopologyStar3,
  IconBrain,
  IconRobot,
  IconRobotFace,
  IconPuzzle,
  IconMessageChatbot,
  IconAdjustments,
  IconBook,
  IconTestPipe,
  IconClock,
  IconHourglass,
  IconArticle,
  IconTemplate,
  IconFile,
  IconCategory,
  IconAffiliate,
  IconHelp,
  IconMessage,
  IconMessagePlus,
  IconShare,
  IconTransfer,
  IconLink,
  IconLinkOff,
  IconTerminal2,
  IconTerminal,
  IconDeviceDesktopAnalytics,
  IconLanguage,
  IconBolt,
  IconCurrencyDollar,
  IconGauge,
  IconBuilding,
  IconGitBranch,
  IconUserCircle,
  IconBrandUbuntu,
  IconBrandWindows,
  IconCircleDot,
  IconQuestionMark,
  // Newly Added Icons (최하단 - 나중에 정렬 예정)
  IconRefreshDot,
  IconRotateClockwise,
  IconProgress,
} from '@tabler/icons-react';

/**
 * Icons 객체 - Figma 아이콘 이름으로 접근
 *
 * 사용법:
 * import { Icons } from '@/design-system';
 * <Icons.ChevronDown size={16} />
 */
export const Icons = {
  // Navigation & UI
  ChevronLeft: IconChevronLeft,
  ChevronRight: IconChevronRight,
  ChevronDown: IconChevronDown,
  ChevronUp: IconChevronUp,
  DrawerClose: IconLayoutSidebarLeftCollapse,
  ExternalLink: IconExternalLink,
  NewTab: IconExternalLink,
  ExpandOn: IconExpandOn,
  ExpandOff: IconExpandOff,
  PlusCircle: IconCirclePlus,
  Add: IconPlus,
  Search: IconSearch,
  Edit: IconPencil,
  Delete: IconTrash,
  Copy: IconCopy,
  MoreKebab: IconDotsVertical,
  MoreMeatball: IconDots,
  Dot: IconPoint,
  Action: IconMenu2,
  Setting: IconSettings,
  Sidebar: IconLayoutSidebar,
  Home: IconHome,
  Notification: IconBell,
  NotificationNew: IconBellRinging,
  FavoriteOff: IconStar,
  FavoriteOn: IconStarFilled,
  CloseSmall: IconX,

  // Media Controls
  Play: IconPlayerPlay,
  Stop: IconPlayerStop,
  Paused: IconPlayerPause,
  Refresh: IconRefresh,
  Deleting: IconTrashX,

  // Status & State
  Error: IconAlertCircle,
  Alert: IconAlertTriangle,
  Info: IconInfoCircle,
  ErrorWarning: IconAlertOctagon,
  Suspended: IconBan,
  Request: IconHelpCircle,
  CheckCircle: IconCircleCheck,
  Check: IconCheck,
  Verify: IconShieldCheck,
  Active: IconCircle,
  Deactivated: IconCircleOff,
  Maintenance: IconTool,
  Warning: IconAlertTriangle,
  SecurityError: IconShieldX,
  Inuse: IconPlugConnected,
  Lock: IconLock,
  Shelved: IconArchive,

  // Data & View
  List: IconList,
  Card: IconLayoutGrid,
  Grid: IconGridDots,
  Upload: IconUpload,
  Download: IconDownload,
  Publish: IconSend,
  Show: IconEye,
  Hide: IconEyeOff,
  Snapshot: IconCamera,
  Order: IconArrowsSort,
  Chart: IconChartBar,
  Layers: IconStack2,
  Dashboards: IconLayoutDashboard,
  Activity: IconActivity,

  // Cloud Infrastructure
  Instances: IconCube,
  Server: IconServer,
  Storage: IconDatabase,
  HardDrive: IconDeviceFloppy,
  Networks: IconNetwork,
  Network: IconNetwork,
  Routers: IconRouter,
  Ports: IconPlug,
  FloatingIp: IconWorldWww,
  LoadBalancer: IconScale,
  Hypervisor: IconServer2,
  SecurityGroup: IconShieldLock,
  KeyPairs: IconKey,
  Certificate: IconCertificate,
  Key: IconKey,
  Security: IconShield,
  Images: IconPhoto,
  Backup: IconDeviceSdCard,
  VolumeType: IconBoxMultiple,
  AddVolume: IconSquarePlus,
  VolumeSearch: IconDatabaseSearch,
  Flavor: IconCpu,
  HostAggregates: IconServerCog,
  CloudComputing: IconCloud,
  Topology: IconTopologyStar3,
  TopologyStar3: IconTopologyStar3,

  // AI & ML
  Brain: IconBrain,
  Robot: IconRobotCustom || IconRobot,
  RobotOriginal: IconRobot,
  AddRobot: IconAddRobotCustom || IconRobotFace,
  AddRobotOriginal: IconRobotFace,
  Puzzle: IconPuzzle,
  Chatbot: IconMessageChatbot,
  Finetuning: IconAdjustments,
  Study: IconBook,
  Test: IconTestPipe,

  // Time & Schedule
  Schedule: IconClock,
  History: IconHistory,
  HourglassHigh: IconHourglass,
  ArticleHistory: IconArticle,

  // Files & Templates
  Template: IconTemplate,
  File: IconFile,
  Plugin: IconPlug,
  Category: IconCategory,
  Affiliate: IconAffiliate,

  // Communication
  Help: IconHelp,
  Chat: IconChat,
  ChatOriginal: IconMessage,
  NewChat: IconMessagePlus,
  Share: IconShare,

  // Links & Transfer
  Transfer: IconTransfer,
  Link: IconLink,
  Unlink: IconLinkOff,

  // Console & Code
  CodeConsole: IconTerminal2,
  Console: IconTerminal,
  DeviceDesktopAnalytics: IconDeviceDesktopAnalytics,

  // Other
  Language: IconLanguage,
  Zap: IconBolt,
  DollarSign: IconCurrencyDollar,
  Speed: IconGauge,
  Building: IconBuilding,
  Branch: IconGitBranch,
  UserCircle: IconUserCircle,

  // OS & Platform
  Ubuntu: IconBrandUbuntu,
  Microsoft: IconBrandWindows,
  Rocky: IconCircleDot,
  Other: IconQuestionMark,

  // Newly Added Icons (최하단 - 나중에 정렬 예정)
  Reboot: IconRefreshDot,
  Retry: IconRotateClockwise,
  Pending: IconProgress,
  Progress: IconProgress,
  Timeout: IconTimeout,
} as const;

export type IconName = keyof typeof Icons;
