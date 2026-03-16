import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { IconDisplayGrid } from '../../design-system-sections/HelperComponents';
import { VStack, SearchInput } from '@/design-system';
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconPlayerPause,
  IconRefresh,
  IconRefreshDot,
  IconRotate,
  IconRotateClockwise,
  IconPower,
  IconPlus,
  IconCirclePlus,
  IconSquarePlus,
  IconMinus,
  IconPencil,
  IconTrash,
  IconTrashX,
  IconCopy,
  IconDownload,
  IconUpload,
  IconShare,
  IconSend,
  IconTransfer,
  IconLink,
  IconUnlink,
  IconLinkOff,
  IconExternalLink,
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
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconLayoutSidebarLeftCollapse,
  IconDotsCircleHorizontal,
  IconDots,
  IconDotsVertical,
  IconCircleCheck,
  IconCheck,
  IconShieldCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconAlertOctagon,
  IconInfoCircle,
  IconHelpCircle,
  IconCircle,
  IconCircleOff,
  IconBan,
  IconTool,
  IconLoader,
  IconLoader2,
  IconProgress,
  IconInfinity,
  IconSearch,
  IconFilter,
  IconSettings,
  IconHome,
  IconX,
  IconList,
  IconLayoutGrid,
  IconGridDots,
  IconArrowsSort,
  IconBell,
  IconBellRinging,
  IconStar,
  IconStarFilled,
  IconHeart,
  IconTarget,
  IconPoint,
  IconEye,
  IconEyeOff,
  IconLock,
  IconShield,
  IconShieldLock,
  IconKey,
  IconUser,
  IconUserCircle,
  IconMail,
  IconMessage,
  IconMessagePlus,
  IconHelp,
  IconQuestionMark,
  IconSun,
  IconMoon,
  IconServer,
  IconServer2,
  IconCube,
  IconCpu,
  IconServerCog,
  IconCloud,
  IconNetwork,
  IconRouter,
  IconPlug,
  IconPlugConnected,
  IconScale,
  IconWorldWww,
  IconDatabase,
  IconDatabaseSearch,
  IconDeviceFloppy,
  IconDeviceSdCard,
  IconBoxMultiple,
  IconCertificate,
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
  IconTerminal,
  IconTerminal2,
  IconActivity,
  IconChartBar,
  IconChartDonut,
  IconGauge,
  IconDeviceDesktop,
  IconDeviceDesktopAnalytics,
  IconLayoutDashboard,
  IconTopologyRing,
  IconTopologyStar3,
  IconBuilding,
  IconCategory,
  IconLayoutSidebar,
  IconAdjustments,
  IconBolt,
  IconGitBranch,
  IconClock,
  IconHourglass,
  IconStopwatch,
  IconHistory,
  IconArticle,
  IconCalendar,
  IconCurrencyDollar,
  IconLanguage,
  IconBrain,
  IconRobot,
  IconRobotFace,
  IconMessageChatbot,
  IconBooks,
  IconBook,
  IconTestPipe,
  IconBrandDebian,
  IconBrandWindows,
  IconBrandRedhat,
  IconCircleDot,
} from '@tabler/icons-react';
import { IconExpandOff, IconExpandOn } from '@/design-system/components/Icons/CustomIcons';
import { IconUbuntu, IconRocky, IconGrid } from '@/design-system';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function IconsGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <SectionTitle>아이콘 규칙</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>라이브러리</strong>: Tabler Icons (
              <span className="font-mono">@tabler/icons-react</span>)를 사용합니다.
            </li>
            <li>
              <strong>Stroke</strong>: 기본{' '}
              <span className="font-mono">
                stroke={'{'}1.5{'}'}
              </span>
              .
            </li>
            <li>
              <strong>크기</strong>: 버튼 내 아이콘 12px (sm/md), 14px (lg). 독립 아이콘 16~20px.
            </li>
            <li>
              <strong>색상</strong>: CSS 변수(
              <span className="font-mono">text-[var(--color-text-*)]</span>)를 사용. 하드코딩 금지.
            </li>
            <li>
              <strong>즐겨찾기</strong>: <span className="font-mono">IconStar</span>(비활성) /{' '}
              <span className="font-mono">IconStarFilled</span>
              (활성, yellow400).
            </li>
            <li>
              아이콘만 사용하는 버튼에는 반드시 <span className="font-mono">aria-label</span>을
              지정합니다.
            </li>
          </ul>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function IconsPage() {
  const [iconSearchQuery, setIconSearchQuery] = useState('');

  return (
    <ComponentPageTemplate
      title="Icons"
      description="Tabler Icons & Custom Icons - Stroke width 1.5, Size 16-20px"
      guidelines={<IconsGuidelines />}
      preview={
        <VStack gap={4}>
          <SearchInput
            placeholder="Search icons..."
            value={iconSearchQuery}
            onChange={(e) => setIconSearchQuery(e.target.value)}
          />
          <IconDisplayGrid
            title="Actions - Media Controls"
            icons={[
              { Icon: IconPlayerPlay, name: 'Play' },
              { Icon: IconPlayerStop, name: 'Stop' },
              { Icon: IconPlayerPause, name: 'Pause' },
              { Icon: IconRefresh, name: 'Refresh' },
              { Icon: IconRefreshDot, name: 'Reboot' },
              { Icon: IconRotate, name: 'Rotate' },
              { Icon: IconRotateClockwise, name: 'Retry' },
              { Icon: IconPower, name: 'Power' },
            ]}
            searchQuery={iconSearchQuery}
          />
        </VStack>
      }
      examples={
        <VStack gap={8}>
          <IconDisplayGrid
            title="Actions - CRUD"
            icons={[
              { Icon: IconPlus, name: 'Add' },
              { Icon: IconCirclePlus, name: 'Add Circle' },
              { Icon: IconSquarePlus, name: 'Add Square' },
              { Icon: IconMinus, name: 'Remove' },
              { Icon: IconPencil, name: 'Edit' },
              { Icon: IconTrash, name: 'Delete' },
              { Icon: IconTrashX, name: 'Deleting' },
              { Icon: IconCopy, name: 'Copy' },
            ]}
            searchQuery={iconSearchQuery}
          />

          <IconDisplayGrid
            title="Actions - Transfer"
            icons={[
              { Icon: IconDownload, name: 'Download' },
              { Icon: IconUpload, name: 'Upload' },
              { Icon: IconShare, name: 'Share' },
              { Icon: IconSend, name: 'Send' },
              { Icon: IconTransfer, name: 'Transfer' },
              { Icon: IconLink, name: 'Link' },
              { Icon: IconUnlink, name: 'Unlink' },
              { Icon: IconLinkOff, name: 'Link Off' },
              { Icon: IconExternalLink, name: 'External' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Navigation - Chevrons & Arrows */}
          <IconDisplayGrid
            title="Navigation - Chevrons & Arrows"
            icons={[
              { Icon: IconChevronLeft, name: 'Chevron L' },
              { Icon: IconChevronRight, name: 'Chevron R' },
              { Icon: IconChevronDown, name: 'Chevron D' },
              { Icon: IconChevronUp, name: 'Chevron U' },
              { Icon: IconArrowLeft, name: 'Arrow L' },
              { Icon: IconArrowRight, name: 'Arrow R' },
              { Icon: IconArrowUp, name: 'Arrow U' },
              { Icon: IconArrowDown, name: 'Arrow D' },
              { Icon: IconCaretRightFilled, name: 'Caret R' },
              { Icon: IconCaretDownFilled, name: 'Caret D' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Navigation - Expand & Menu */}
          <IconDisplayGrid
            title="Navigation - Expand & Menu"
            icons={[
              { Icon: IconArrowsMaximize, name: 'Maximize' },
              { Icon: IconArrowsMinimize, name: 'Minimize' },
              { Icon: IconExpandOff, name: 'Expand Off' },
              { Icon: IconExpandOn, name: 'Expand On' },
              { Icon: IconLayoutSidebarLeftCollapse, name: 'Collapse' },
              { Icon: IconDotsCircleHorizontal, name: 'Action' },
              { Icon: IconDots, name: 'Meatball' },
              { Icon: IconDotsVertical, name: 'Kebab' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Status - Success & Error */}
          <IconDisplayGrid
            title="Status - Success & Error"
            icons={[
              { Icon: IconCircleCheck, name: 'Success' },
              { Icon: IconCheck, name: 'Check' },
              { Icon: IconShieldCheck, name: 'Verified' },
              { Icon: IconAlertCircle, name: 'Error' },
              { Icon: IconAlertTriangle, name: 'Warning' },
              { Icon: IconAlertOctagon, name: 'Critical' },
              { Icon: IconInfoCircle, name: 'Info' },
              { Icon: IconHelpCircle, name: 'Help' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Status - State */}
          <IconDisplayGrid
            title="Status - State"
            icons={[
              { Icon: IconCircle, name: 'Active' },
              { Icon: IconCircleOff, name: 'Inactive' },
              { Icon: IconBan, name: 'Suspended' },
              { Icon: IconTool, name: 'Maintain' },
              { Icon: IconLoader, name: 'Loading' },
              { Icon: IconLoader2, name: 'Spinner' },
              { Icon: IconProgress, name: 'Progress' },
              { Icon: IconInfinity, name: 'Infinity' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* UI - Common */}
          <IconDisplayGrid
            title="UI - Common"
            icons={[
              { Icon: IconSearch, name: 'Search' },
              { Icon: IconFilter, name: 'Filter' },
              { Icon: IconSettings, name: 'Settings' },
              { Icon: IconHome, name: 'Home' },
              { Icon: IconX, name: 'Close' },
              { Icon: IconList, name: 'List' },
              { Icon: IconLayoutGrid, name: 'Grid' },
              { Icon: IconGridDots, name: 'Grid Dots' },
              { Icon: IconArrowsSort, name: 'Sort' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* UI - Notifications & Favorites */}
          <IconDisplayGrid
            title="UI - Notifications & Favorites"
            icons={[
              { Icon: IconBell, name: 'Bell' },
              { Icon: IconBellRinging, name: 'Bell Ring' },
              { Icon: IconStar, name: 'Star' },
              { Icon: IconStarFilled, name: 'Star Fill' },
              { Icon: IconHeart, name: 'Heart' },
              { Icon: IconTarget, name: 'Target' },
              { Icon: IconPoint, name: 'Dot' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* UI - Visibility & Security */}
          <IconDisplayGrid
            title="UI - Visibility & Security"
            icons={[
              { Icon: IconEye, name: 'Show' },
              { Icon: IconEyeOff, name: 'Hide' },
              { Icon: IconLock, name: 'Lock' },
              { Icon: IconShield, name: 'Shield' },
              { Icon: IconShieldLock, name: 'Shield Lock' },
              { Icon: IconShieldCheck, name: 'Shield OK' },
              { Icon: IconKey, name: 'Key' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* UI - User & Communication */}
          <IconDisplayGrid
            title="UI - User & Communication"
            icons={[
              { Icon: IconUser, name: 'User' },
              { Icon: IconUserCircle, name: 'User Circle' },
              { Icon: IconMail, name: 'Mail' },
              { Icon: IconMessage, name: 'Message' },
              { Icon: IconMessagePlus, name: 'New Chat' },
              { Icon: IconHelp, name: 'Help' },
              { Icon: IconQuestionMark, name: 'Question' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* UI - Theme */}
          <IconDisplayGrid
            title="UI - Theme"
            icons={[
              { Icon: IconSun, name: 'Light' },
              { Icon: IconMoon, name: 'Dark' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Infrastructure - Compute */}
          <IconDisplayGrid
            title="Infrastructure - Compute"
            icons={[
              { Icon: IconServer, name: 'Server' },
              { Icon: IconServer2, name: 'Instance' },
              { Icon: IconCube, name: 'Cube' },
              { Icon: IconCpu, name: 'CPU' },
              { Icon: IconServerCog, name: 'Host Agg' },
              { Icon: IconCloud, name: 'Cloud' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Infrastructure - Network */}
          <IconDisplayGrid
            title="Infrastructure - Network"
            icons={[
              { Icon: IconNetwork, name: 'Network' },
              { Icon: IconRouter, name: 'Router' },
              { Icon: IconPlug, name: 'Port' },
              { Icon: IconPlugConnected, name: 'Connected' },
              { Icon: IconScale, name: 'Load Bal' },
              { Icon: IconWorldWww, name: 'Float IP' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Infrastructure - Storage */}
          <IconDisplayGrid
            title="Infrastructure - Storage"
            icons={[
              { Icon: IconDatabase, name: 'Database' },
              { Icon: IconDatabaseSearch, name: 'Vol Search' },
              { Icon: IconDeviceFloppy, name: 'Disk' },
              { Icon: IconDeviceSdCard, name: 'Backup' },
              { Icon: IconBoxMultiple, name: 'Vol Type' },
              { Icon: IconSquarePlus, name: 'Add Vol' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Infrastructure - Security */}
          <IconDisplayGrid
            title="Infrastructure - Security"
            icons={[
              { Icon: IconShield, name: 'Security' },
              { Icon: IconShieldLock, name: 'Sec Group' },
              { Icon: IconKey, name: 'Key Pair' },
              { Icon: IconCertificate, name: 'Certificate' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Storage & Files */}
          <IconDisplayGrid
            title="Storage & Files"
            icons={[
              { Icon: IconCamera, name: 'Snapshot' },
              { Icon: IconDisc, name: 'Image' },
              { Icon: IconFile, name: 'File' },
              { Icon: IconFileText, name: 'Doc' },
              { Icon: IconFolder, name: 'Folder' },
              { Icon: IconFolderOpen, name: 'Folder Open' },
              { Icon: IconArchive, name: 'Archive' },
              { Icon: IconTemplate, name: 'Template' },
              { Icon: IconStack2, name: 'Layers' },
              { Icon: IconCode, name: 'Code' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Monitoring & Analytics */}
          <IconDisplayGrid
            title="Monitoring & Analytics"
            icons={[
              { Icon: IconTerminal, name: 'Console' },
              { Icon: IconTerminal2, name: 'Terminal' },
              { Icon: IconActivity, name: 'Activity' },
              { Icon: IconChartBar, name: 'Bar Chart' },
              { Icon: IconChartDonut, name: 'Donut' },
              { Icon: IconGauge, name: 'Gauge' },
              { Icon: IconDeviceDesktop, name: 'Desktop' },
              { Icon: IconDeviceDesktopAnalytics, name: 'Analytics' },
              { Icon: IconLayoutDashboard, name: 'Dashboard' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Organization & Structure */}
          <IconDisplayGrid
            title="Organization & Structure"
            icons={[
              { Icon: IconTopologyRing, name: 'Topo Ring' },
              { Icon: IconTopologyStar3, name: 'Topo Star' },
              { Icon: IconBuilding, name: 'Building' },
              { Icon: IconCategory, name: 'Category' },
              { Icon: IconLayoutSidebar, name: 'Sidebar' },
              { Icon: IconAdjustments, name: 'Adjust' },
              { Icon: IconBolt, name: 'Bolt' },
              { Icon: IconGitBranch, name: 'Branch' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Time & Schedule */}
          <IconDisplayGrid
            title="Time & Schedule"
            icons={[
              { Icon: IconClock, name: 'Clock' },
              { Icon: IconHourglass, name: 'Hourglass' },
              { Icon: IconStopwatch, name: 'Timeout' },
              { Icon: IconHistory, name: 'History' },
              { Icon: IconArticle, name: 'Article' },
              { Icon: IconCalendar, name: 'Calendar' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* Business & Finance */}
          <IconDisplayGrid
            title="Business & Finance"
            icons={[
              { Icon: IconCurrencyDollar, name: 'Dollar' },
              { Icon: IconLanguage, name: 'Language' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* AI & ML */}
          <IconDisplayGrid
            title="AI & ML"
            icons={[
              { Icon: IconBrain, name: 'Brain' },
              { Icon: IconRobot, name: 'Robot' },
              { Icon: IconRobotFace, name: 'Robot Face' },
              { Icon: IconMessageChatbot, name: 'Chatbot' },
              { Icon: IconBooks, name: 'Books' },
              { Icon: IconBook, name: 'Book' },
              { Icon: IconTestPipe, name: 'Test' },
            ]}
            searchQuery={iconSearchQuery}
          />

          {/* OS / Brand Icons */}
          <IconDisplayGrid
            title="OS / Brand"
            icons={[
              { Icon: IconUbuntu, name: 'Ubuntu' },
              { Icon: IconBrandDebian, name: 'Debian' },
              { Icon: IconBrandWindows, name: 'Windows' },
              { Icon: IconBrandRedhat, name: 'RedHat' },
              { Icon: IconRocky, name: 'Rocky' },
              { Icon: IconGrid, name: 'Grid' },
              { Icon: IconCircleDot, name: 'Other' },
            ]}
            searchQuery={iconSearchQuery}
          />
        </VStack>
      }
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
