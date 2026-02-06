import { useState, useRef, useCallback, useMemo } from 'react';
import {
  IconHome,
  IconCube,
  IconBrain,
  IconBucket,
  IconDownload,
  IconTemplate,
  IconCamera,
  IconDisc,
  IconCpu,
  IconKey,
  IconServer,
  IconDatabase,
  IconDatabaseExport,
  IconDatabaseCog,
  IconNetwork,
  IconWorldWww,
  IconShieldLock,
  IconLoadBalancer,
  IconCertificate,
  IconTopologyStar3,
  IconTopologyStar,
  IconTimelineEvent,
  IconArrowsShuffle,
  IconArrowsJoin2,
  IconReorder,
  IconChartPie3,
  IconRulerMeasure,
  IconListSearch,
  IconServer2,
  IconActivity,
  IconCpu2,
  IconAffiliate,
  IconFolders,
  IconBell,
  IconRocket,
  IconRefresh,
  IconStack3,
  IconFileSettings,
  IconBrandSpeedtest,
  IconUsers,
  IconUsersGroup,
  IconFileDescription,
  IconFileCode,
  IconClock,
  IconDeviceDesktop,
  IconWorld,
  IconUserCog,
  IconLock,
  IconHistory,
  IconCalendarTime,
  IconBox,
  IconCompass,
  IconPackages,
  IconBolt,
  IconMessageCircle,
  IconCode,
  IconRoute,
  IconChartBar,
  IconSettings,
  IconHelp,
  IconList,
  IconGitBranch,
  IconUser,
  IconInfoCircle,
  IconArrowLeft,
  IconExternalLink,
  IconSearch,
  IconCopy,
  IconCheck,
  IconFile,
  IconFolder,
  IconMessages,
  IconRobotFace,
  IconPuzzle,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import {
  EthernetPort,
  ChevronsLeftRightEllipsis,
  HardDrive,
  Scaling,
  Group,
  Network,
  RefreshCw,
  CircleGauge,
  BrainCircuit,
  LayoutDashboard,
  BrickWallFire,
} from 'lucide-react';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import RouterIcon from '@/assets/Router.svg';
import { Button, Input } from '@/design-system';

/* ----------------------------------------
   Custom SVG Icon Component
   ---------------------------------------- */

interface CustomIconProps {
  src: string;
  size?: number;
  className?: string;
}

function CustomIcon({ src, size = 16, className = '' }: CustomIconProps) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      className={`${className}`}
      style={{ filter: 'var(--icon-filter, none)' }}
      alt=""
    />
  );
}

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface IconItem {
  icon?: React.ComponentType<{
    size?: number;
    stroke?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  customIcon?: string; // Custom SVG import
  name: string;
  label: string;
  slug: string; // kebab-case name for URL
  library?: 'tabler' | 'lucide' | 'custom'; // Icon library (default: tabler)
}

interface AppSection {
  title: string;
  items: IconItem[];
}

interface AppData {
  name: string;
  sidebarFile: string; // File path where this sidebar is defined
  sections: AppSection[];
}

/* ----------------------------------------
   Icon Data
   ---------------------------------------- */

const appIconData: AppData[] = [
  {
    name: 'Compute',
    sidebarFile: 'src/components/Sidebar.tsx',
    sections: [
      {
        title: 'Dashboard',
        items: [
          {
            icon: LayoutDashboard,
            name: 'LayoutDashboard',
            label: 'Dashboard',
            slug: 'layout-dashboard',
            library: 'lucide',
          },
        ],
      },
      {
        title: 'Compute',
        items: [
          { icon: IconCube, name: 'IconCube', label: 'Instances', slug: 'cube' },
          {
            icon: IconTemplate,
            name: 'IconTemplate',
            label: 'Instance templates',
            slug: 'template',
          },
          { icon: IconCamera, name: 'IconCamera', label: 'Instance snapshots', slug: 'camera' },
          { icon: IconDisc, name: 'IconDisc', label: 'Images', slug: 'disc' },
          { icon: IconCpu, name: 'IconCpu', label: 'Flavors', slug: 'cpu' },
          { icon: IconKey, name: 'IconKey', label: 'Key pairs', slug: 'key' },
          { icon: IconServer, name: 'IconServer', label: 'Server groups', slug: 'server' },
        ],
      },
      {
        title: 'Storage',
        items: [
          { icon: IconDatabase, name: 'IconDatabase', label: 'Volumes', slug: 'database' },
          { icon: IconCamera, name: 'IconCamera', label: 'Volume snapshots', slug: 'camera' },
          {
            icon: IconDatabaseExport,
            name: 'IconDatabaseExport',
            label: 'Volume backups',
            slug: 'database-export',
          },
        ],
      },
      {
        title: 'Network',
        items: [
          { icon: IconNetwork, name: 'IconNetwork', label: 'Networks', slug: 'network' },
          {
            customIcon: RouterIcon,
            name: 'Router.svg',
            label: 'Routers',
            slug: 'router',
            library: 'custom',
          },
          {
            icon: ChevronsLeftRightEllipsis,
            name: 'ChevronsLeftRightEllipsis',
            label: 'Ports',
            slug: 'chevrons-left-right-ellipsis',
            library: 'lucide',
          },
          { icon: IconWorldWww, name: 'IconWorldWww', label: 'Floating IPs', slug: 'world-www' },
          {
            icon: IconShieldLock,
            name: 'IconShieldLock',
            label: 'Security groups',
            slug: 'shield-lock',
          },
          {
            icon: IconLoadBalancer,
            name: 'IconLoadBalancer',
            label: 'Load balancers',
            slug: 'load-balancer',
          },
          {
            icon: IconCertificate,
            name: 'IconCertificate',
            label: 'Certificates',
            slug: 'certificate',
          },
          {
            icon: IconTopologyStar3,
            name: 'IconTopologyStar3',
            label: 'Topology',
            slug: 'topology-star-3',
          },
        ],
      },
    ],
  },
  {
    name: 'Compute Admin',
    sidebarFile: 'src/components/ComputeAdminSidebar.tsx',
    sections: [
      {
        title: 'Administration',
        items: [
          { icon: IconUsersGroup, name: 'IconUsersGroup', label: 'Tenants', slug: 'users-group' },
          {
            icon: IconFileCode,
            name: 'IconFileCode',
            label: 'Metadata definition',
            slug: 'file-code',
          },
          { icon: IconActivity, name: 'IconActivity', label: 'Monitor overview', slug: 'activity' },
          { icon: IconServer2, name: 'IconServer2', label: 'Physical nodes', slug: 'server-2' },
          {
            icon: IconDatabaseCog,
            name: 'IconDatabaseCog',
            label: 'Volume types',
            slug: 'database-cog',
          },
          {
            icon: IconServer,
            name: 'IconServer',
            label: 'Bare metal nodes',
            slug: 'server',
          },
          {
            icon: BrickWallFire,
            name: 'BrickWallFire',
            label: 'Firewall',
            slug: 'brick-wall-fire',
            library: 'lucide',
          },
          {
            icon: IconArrowsJoin2,
            name: 'IconArrowsJoin2',
            label: 'Host aggregates',
            slug: 'arrows-join-2',
          },
        ],
      },
    ],
  },
  {
    name: 'Cloud Builder',
    sidebarFile: 'src/components/Sidebar.tsx',
    sections: [
      {
        title: 'Inventory (1.0v)',
        items: [
          { icon: IconListSearch, name: 'IconListSearch', label: 'Discovery', slug: 'list-search' },
          { icon: IconServer2, name: 'IconServer2', label: 'Servers', slug: 'server-2' },
          {
            icon: EthernetPort,
            name: 'EthernetPort',
            label: 'Switch',
            slug: 'ethernet-port',
            library: 'lucide',
          },
        ],
      },
      {
        title: 'System info',
        items: [
          { icon: IconCpu, name: 'IconCpu', label: 'Compute services', slug: 'cpu' },
          { icon: IconCpu2, name: 'IconCpu2', label: 'Compute nodes', slug: 'cpu-2' },
          { icon: IconNetwork, name: 'IconNetwork', label: 'Network agents', slug: 'network' },
          {
            icon: IconDatabase,
            name: 'IconDatabase',
            label: 'Block storage services',
            slug: 'database',
          },
          {
            icon: IconAffiliate,
            name: 'IconAffiliate',
            label: 'Orchestration services',
            slug: 'affiliate',
          },
        ],
      },
    ],
  },
  {
    name: 'Storage',
    sidebarFile: 'src/components/StorageSidebar.tsx',
    sections: [
      {
        title: 'Dashboard',
        items: [
          {
            icon: LayoutDashboard,
            name: 'LayoutDashboard',
            label: 'Dashboard',
            slug: 'layout-dashboard',
            library: 'lucide',
          },
        ],
      },
      {
        title: 'Cluster',
        items: [
          { icon: IconDatabase, name: 'IconDatabase', label: 'Pools', slug: 'database' },
          { icon: IconServer2, name: 'IconServer2', label: 'Hosts', slug: 'server-2' },
          { icon: IconCpu, name: 'IconCpu', label: 'OSDs', slug: 'cpu' },
          {
            icon: HardDrive,
            name: 'HardDrive',
            label: 'Physical disks',
            slug: 'hard-drive',
            library: 'lucide',
          },
        ],
      },
      {
        title: 'Block',
        items: [{ icon: IconDisc, name: 'IconDisc', label: 'Images', slug: 'disc' }],
      },
      {
        title: 'Object',
        items: [{ icon: IconBucket, name: 'IconBucket', label: 'Buckets', slug: 'bucket' }],
      },
      {
        title: 'Monitoring',
        items: [
          {
            icon: IconBrandSpeedtest,
            name: 'IconBrandSpeedtest',
            label: 'Overall performance',
            slug: 'brand-speedtest',
          },
        ],
      },
    ],
  },
  {
    name: 'IAM',
    sidebarFile: 'src/components/IAMSidebar.tsx',
    sections: [
      {
        title: 'Home',
        items: [{ icon: IconHome, name: 'IconHome', label: 'Home', slug: 'home' }],
      },
      {
        title: 'Access management',
        items: [
          { icon: IconUsers, name: 'IconUsers', label: 'Users', slug: 'users' },
          {
            icon: IconUsersGroup,
            name: 'IconUsersGroup',
            label: 'User groups',
            slug: 'users-group',
          },
          { icon: IconShieldLock, name: 'IconShieldLock', label: 'Roles', slug: 'shield-lock' },
          {
            icon: IconFileDescription,
            name: 'IconFileDescription',
            label: 'Policies',
            slug: 'file-description',
          },
        ],
      },
      {
        title: 'Authentication',
        items: [{ icon: IconKey, name: 'IconKey', label: 'MFA policies', slug: 'key' }],
      },
      {
        title: 'Session management',
        items: [
          { icon: IconClock, name: 'IconClock', label: 'Session policies', slug: 'clock' },
          {
            icon: IconDeviceDesktop,
            name: 'IconDeviceDesktop',
            label: 'Active sessions',
            slug: 'device-desktop',
          },
        ],
      },
      {
        title: 'Global administration',
        items: [
          { icon: IconWorld, name: 'IconWorld', label: 'Domains', slug: 'world' },
          {
            icon: IconUserCog,
            name: 'IconUserCog',
            label: 'System administrators',
            slug: 'user-cog',
          },
          { icon: IconLock, name: 'IconLock', label: 'Login policies', slug: 'lock' },
          { icon: IconKey, name: 'IconKey', label: 'Token policies', slug: 'key' },
        ],
      },
      {
        title: 'Monitoring',
        items: [{ icon: IconHistory, name: 'IconHistory', label: 'Event logs', slug: 'history' }],
      },
    ],
  },
  {
    name: 'Container',
    sidebarFile: 'src/components/ContainerSidebar.tsx',
    sections: [
      {
        title: 'Cluster',
        items: [
          { icon: IconHome, name: 'IconHome', label: 'Home', slug: 'home' },
          {
            icon: LayoutDashboard,
            name: 'LayoutDashboard',
            label: 'Dashboard',
            slug: 'layout-dashboard',
            library: 'lucide',
          },
          { icon: IconAffiliate, name: 'IconAffiliate', label: 'Cluster', slug: 'affiliate' },
          { icon: IconFolders, name: 'IconFolders', label: 'Namespaces', slug: 'folders' },
          {
            icon: IconTopologyStar,
            name: 'IconTopologyStar',
            label: 'Nodes',
            slug: 'topology-star',
          },
          {
            icon: IconTimelineEvent,
            name: 'IconTimelineEvent',
            label: 'Events',
            slug: 'timeline-event',
          },
        ],
      },
      {
        title: 'Workloads',
        items: [
          { icon: IconRocket, name: 'IconRocket', label: 'Deployments', slug: 'rocket' },
          { icon: Group, name: 'Group', label: 'StatefulSets', slug: 'group', library: 'lucide' },
          { icon: IconRefresh, name: 'IconRefresh', label: 'DaemonSets', slug: 'refresh' },
          { icon: IconClock, name: 'IconClock', label: 'Jobs', slug: 'clock' },
          {
            icon: IconCalendarTime,
            name: 'IconCalendarTime',
            label: 'CronJobs',
            slug: 'calendar-time',
          },
          { icon: IconBox, name: 'IconBox', label: 'Pods', slug: 'box' },
        ],
      },
      {
        title: 'Service discovery',
        items: [
          { icon: Network, name: 'Network', label: 'Services', slug: 'network', library: 'lucide' },
          {
            icon: IconArrowsShuffle,
            name: 'IconArrowsShuffle',
            label: 'Ingresses',
            slug: 'arrows-shuffle',
          },
          {
            icon: Scaling,
            name: 'Scaling',
            label: 'Horizontal pod autoscalers',
            slug: 'scaling',
            library: 'lucide',
          },
        ],
      },
      {
        title: 'Storage',
        items: [
          {
            icon: HardDrive,
            name: 'HardDrive',
            label: 'Persistent volumes',
            slug: 'hard-drive',
            library: 'lucide',
          },
          {
            icon: IconDatabase,
            name: 'IconDatabase',
            label: 'Persistent volume claims',
            slug: 'database',
          },
          { icon: IconStack3, name: 'IconStack3', label: 'Storage classes', slug: 'stack-3' },
          {
            icon: IconFileSettings,
            name: 'IconFileSettings',
            label: 'ConfigMaps',
            slug: 'file-settings',
          },
          { icon: IconKey, name: 'IconKey', label: 'Secrets', slug: 'key' },
        ],
      },
      {
        title: 'Policy',
        items: [
          {
            icon: IconRulerMeasure,
            name: 'IconRulerMeasure',
            label: 'Limit ranges',
            slug: 'ruler-measure',
          },
          {
            icon: IconChartPie3,
            name: 'IconChartPie3',
            label: 'Resource quotas',
            slug: 'chart-pie-3',
          },
          {
            icon: IconShieldLock,
            name: 'IconShieldLock',
            label: 'Network policies',
            slug: 'shield-lock',
          },
          {
            icon: IconReorder,
            name: 'IconReorder',
            label: 'Pod disruption budgets',
            slug: 'reorder',
          },
        ],
      },
    ],
  },
  {
    name: 'AI Platform',
    sidebarFile: 'src/components/AIPlatformSidebar.tsx',
    sections: [
      {
        title: 'Dashboard',
        items: [
          {
            icon: LayoutDashboard,
            name: 'LayoutDashboard',
            label: 'Dashboard',
            slug: 'layout-dashboard',
            library: 'lucide',
          },
          { icon: IconCompass, name: 'IconCompass', label: 'Explore', slug: 'compass' },
        ],
      },
      {
        title: 'Hub',
        items: [
          { icon: IconPackages, name: 'IconPackages', label: 'Packages', slug: 'packages' },
          { icon: IconBrain, name: 'IconBrain', label: 'Models', slug: 'brain' },
          { icon: IconDatabase, name: 'IconDatabase', label: 'Datasets', slug: 'database' },
        ],
      },
      {
        title: 'Infrastructure',
        items: [
          {
            icon: CircleGauge,
            name: 'CircleGauge',
            label: 'Workloads',
            slug: 'circle-gauge',
            library: 'lucide',
          },
          { icon: IconTemplate, name: 'IconTemplate', label: 'My templates', slug: 'template' },
          { icon: IconBox, name: 'IconBox', label: 'Storage', slug: 'box' },
          { icon: IconBolt, name: 'IconBolt', label: 'Serverless', slug: 'bolt' },
        ],
      },
      {
        title: 'ML Studio',
        items: [
          {
            icon: IconMessageCircle,
            name: 'IconMessageCircle',
            label: 'Text generation',
            slug: 'message-circle',
          },
        ],
      },
      {
        title: 'MLOps',
        items: [
          { icon: IconCode, name: 'IconCode', label: 'DevSpace', slug: 'code' },
          { icon: IconRoute, name: 'IconRoute', label: 'Pipeline builder', slug: 'route' },
          { icon: IconChartBar, name: 'IconChartBar', label: 'Benchmarks', slug: 'chart-bar' },
          {
            icon: BrainCircuit,
            name: 'BrainCircuit',
            label: 'Kubeflow',
            slug: 'brain-circuit',
            library: 'lucide',
          },
          {
            icon: RefreshCw,
            name: 'RefreshCw',
            label: 'MLflow',
            slug: 'refresh-cw',
            library: 'lucide',
          },
        ],
      },
      {
        title: 'Settings',
        items: [
          { icon: IconSettings, name: 'IconSettings', label: 'Settings', slug: 'settings' },
          { icon: IconHelp, name: 'IconHelp', label: 'FAQ', slug: 'help' },
        ],
      },
      {
        title: 'Operations',
        items: [
          { icon: IconList, name: 'IconList', label: 'Kueue', slug: 'list' },
          { icon: IconActivity, name: 'IconActivity', label: 'Monitoring', slug: 'activity' },
          { icon: IconGitBranch, name: 'IconGitBranch', label: 'Dependencies', slug: 'git-branch' },
          {
            icon: IconUserCog,
            name: 'IconUserCog',
            label: 'System administration',
            slug: 'user-cog',
          },
        ],
      },
    ],
  },
  {
    name: 'AI Agent',
    sidebarFile: 'src/pages/AgentPage.tsx',
    sections: [
      {
        title: 'Navigation',
        items: [
          { icon: IconFolder, name: 'IconFolder', label: 'Project', slug: 'folder' },
          { icon: IconMessages, name: 'IconMessages', label: 'Chat', slug: 'messages' },
          { icon: IconRobotFace, name: 'IconRobotFace', label: 'Agent', slug: 'robot-face' },
          { icon: IconDatabase, name: 'IconDatabase', label: 'Data', slug: 'database' },
          { icon: IconPuzzle, name: 'IconPuzzle', label: 'Tools', slug: 'puzzle' },
        ],
      },
    ],
  },
  {
    name: 'Settings',
    sidebarFile: 'src/pages/SettingsPage.tsx',
    sections: [
      {
        title: 'Menu',
        items: [
          { icon: IconSettings, name: 'IconSettings', label: 'General', slug: 'settings' },
          { icon: IconUser, name: 'IconUser', label: 'Account', slug: 'user' },
          { icon: IconBell, name: 'IconBell', label: 'Notifications', slug: 'bell' },
          {
            icon: IconInfoCircle,
            name: 'IconInfoCircle',
            label: 'Information',
            slug: 'info-circle',
          },
        ],
      },
    ],
  },
];

/* ----------------------------------------
   Copy Button Component
   ---------------------------------------- */

interface CopyButtonProps {
  text: string;
  label: string;
  className?: string;
}

function CopyButton({ text, label, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono bg-[var(--color-surface-muted)] hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] transition-colors cursor-pointer ${className}`}
      title={`Copy ${label}`}
    >
      {copied ? (
        <IconCheck size={10} stroke={2} className="text-[var(--color-state-success)]" />
      ) : (
        <IconCopy size={10} stroke={1.5} className="text-[var(--color-text-subtle)]" />
      )}
      <span className="text-[var(--color-text-muted)] truncate max-w-[200px]">{text}</span>
    </button>
  );
}

/* ----------------------------------------
   Icon Card Component
   ---------------------------------------- */

interface IconCardProps {
  item: IconItem;
  sidebarFile: string;
}

function IconCard({ item, sidebarFile }: IconCardProps) {
  const Icon = item.icon;
  const isLucide = item.library === 'lucide';
  const isCustom = item.library === 'custom';

  const iconUrl = isCustom
    ? undefined
    : isLucide
      ? `https://lucide.dev/icons/${item.slug}`
      : `https://tabler.io/icons/icon/${item.slug}`;
  const libraryLabel = isCustom ? 'Custom' : isLucide ? 'Lucide' : 'Tabler';
  const libraryPackage = isCustom ? '@/assets' : isLucide ? 'lucide-react' : '@tabler/icons-react';
  const iconRef = useRef<HTMLDivElement>(null);

  // Generate code snippets
  const importStatement = isCustom
    ? `import ${item.name.replace('.svg', 'Icon')} from '${libraryPackage}/${item.name}';`
    : `import { ${item.name} } from '${libraryPackage}';`;
  const jsxCode = isCustom
    ? `<img src={${item.name.replace('.svg', 'Icon')}} width={16} height={16} />`
    : isLucide
      ? `<${item.name} size={16} strokeWidth={1.5} />`
      : `<${item.name} size={16} stroke={1.5} />`;

  const handleDownload = useCallback(async () => {
    // For custom icons, fetch the SVG file directly
    if (isCustom && item.customIcon) {
      try {
        const response = await fetch(item.customIcon);
        const svgText = await response.text();
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${item.slug}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Failed to download:', err);
      }
      return;
    }

    // For Tabler/Lucide icons, clone from DOM
    if (!iconRef.current) return;

    const svgElement = iconRef.current.querySelector('svg');
    if (!svgElement) return;

    // Clone and modify the SVG for download
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.removeAttribute('class');
    clonedSvg.setAttribute('stroke', 'currentColor');

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.slug}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [item.slug, isCustom, item.customIcon]);

  return (
    <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
      {/* Header: Icon + Label */}
      <div className="flex items-center gap-3">
        <div
          ref={iconRef}
          className="w-8 h-8 flex items-center justify-center bg-[var(--color-surface-subtle)] rounded-md"
        >
          {isCustom && item.customIcon ? (
            <CustomIcon
              src={item.customIcon}
              size={16}
              className="text-[var(--color-text-default)]"
            />
          ) : isLucide && Icon ? (
            <Icon size={16} strokeWidth={1.5} className="text-[var(--color-text-default)]" />
          ) : Icon ? (
            <Icon size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[var(--color-text-default)]">{item.label}</p>
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] text-[var(--color-text-subtle)] font-mono">{item.name}</p>
            {isLucide && (
              <span className="text-[9px] px-1.5 py-0.5 bg-[var(--color-state-info-bg)] text-[var(--color-state-info)] rounded font-medium">
                Lucide
              </span>
            )}
            {isCustom && (
              <span className="text-[9px] px-1.5 py-0.5 bg-[var(--color-state-warning-bg)] text-[var(--color-state-warning)] rounded font-medium">
                Custom
              </span>
            )}
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md text-[var(--color-text-subtle)] hover:text-[var(--color-action-primary)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer"
            title="Download SVG (16px)"
          >
            <IconDownload size={14} stroke={1.5} />
          </button>
          {iconUrl && (
            <a
              href={iconUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-[var(--color-action-primary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
              title={`Open in ${libraryLabel}`}
            >
              <IconExternalLink size={14} stroke={1.5} />
            </a>
          )}
        </div>
      </div>

      {/* Copy buttons */}
      <div className="flex flex-col gap-1.5">
        <CopyButton text={item.name} label="Icon name" />
        <CopyButton text={importStatement} label="Import" />
        <CopyButton text={jsxCode} label="JSX" />
      </div>

      {/* File path */}
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-subtle)]">
        <IconFile size={10} stroke={1.5} />
        <span className="font-mono truncate">{sidebarFile}</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   App Section Component
   ---------------------------------------- */

interface AppSectionCardProps {
  app: AppData;
  searchQuery: string;
}

// Helper to convert app name to kebab-case id
function toKebabCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function AppSectionCard({ app, searchQuery }: AppSectionCardProps) {
  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return app.sections;

    const query = searchQuery.toLowerCase();
    return app.sections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [app.sections, searchQuery]);

  // Don't render if no results
  if (filteredSections.length === 0) return null;

  return (
    <div
      id={toKebabCase(app.name)}
      className="bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] overflow-hidden scroll-mt-20"
    >
      {/* App Header */}
      <div className="px-5 py-4 border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">{app.name}</h2>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-subtle)]">
            <IconFile size={12} stroke={1.5} />
            <span className="font-mono">{app.sidebarFile}</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="p-5 space-y-6">
        {filteredSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-[11px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {section.items.map((item, itemIndex) => (
                <IconCard key={itemIndex} item={item} sidebarFile={app.sidebarFile} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Sidebar Icons Page
   ---------------------------------------- */

export function SidebarIconsPage() {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');

  // Count total icons
  const totalIcons = useMemo(() => {
    return appIconData.reduce(
      (acc, app) => acc + app.sections.reduce((sAcc, section) => sAcc + section.items.length, 0),
      0
    );
  }, []);

  // Count filtered icons
  const filteredCount = useMemo(() => {
    if (!searchQuery.trim()) return totalIcons;
    const query = searchQuery.toLowerCase();
    return appIconData.reduce(
      (acc, app) =>
        acc +
        app.sections.reduce(
          (sAcc, section) =>
            sAcc +
            section.items.filter(
              (item) =>
                item.label.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
            ).length,
          0
        ),
      0
    );
  }, [searchQuery, totalIcons]);

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--color-surface-subtle)]">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          {/* Back button & Logo */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<IconArrowLeft size={14} stroke={1.5} />}
              onClick={() => navigate('/')}
            >
              Back
            </Button>
            <div className="w-px h-5 bg-[var(--color-border-default)]" />
            <img src={isDark ? ThakiLogoDark : ThakiLogoLight} alt="THAKI Cloud" className="h-5" />
          </div>

          {/* Search */}
          <div className="w-[300px]">
            <div className="relative">
              <IconSearch
                size={14}
                stroke={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]"
              />
              <Input
                type="text"
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                fullWidth
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-[28px] font-bold text-[var(--color-text-default)] mb-2">
              Sidebar Icons Reference
            </h1>
            <p className="text-[14px] text-[var(--color-text-subtle)] mb-4">
              각 앱별 사이드바 메뉴에 사용된 아이콘 목록입니다. 클릭하면 코드가 복사됩니다.
            </p>

            {/* Quick Reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)]">
                <h3 className="text-[12px] font-semibold text-[var(--color-text-default)] mb-2">
                  Tabler Icons
                </h3>
                <code className="text-[11px] text-[var(--color-text-muted)] font-mono block">
                  import {'{ IconName }'} from '@tabler/icons-react';
                </code>
                <code className="text-[11px] text-[var(--color-text-subtle)] font-mono block mt-1">
                  {'<IconName size={16} stroke={1.5} />'}
                </code>
              </div>
              <div className="p-4 bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)]">
                <h3 className="text-[12px] font-semibold text-[var(--color-text-default)] mb-2">
                  Lucide Icons
                </h3>
                <code className="text-[11px] text-[var(--color-text-muted)] font-mono block">
                  import {'{ IconName }'} from 'lucide-react';
                </code>
                <code className="text-[11px] text-[var(--color-text-subtle)] font-mono block mt-1">
                  {'<IconName size={16} strokeWidth={1.5} />'}
                </code>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 text-[12px] text-[var(--color-text-subtle)]">
              {searchQuery ? (
                <span>
                  Found{' '}
                  <strong className="text-[var(--color-text-default)]">{filteredCount}</strong> of{' '}
                  {totalIcons} icons
                </span>
              ) : (
                <span>
                  Total <strong className="text-[var(--color-text-default)]">{totalIcons}</strong>{' '}
                  icons across {appIconData.length} apps
                </span>
              )}
            </div>

            {/* Section Navigation */}
            <div className="mt-6 flex flex-wrap gap-2">
              {appIconData.map((app, index) => (
                <a
                  key={index}
                  href={`#${toKebabCase(app.name)}`}
                  className="px-3 py-1.5 text-[12px] font-medium rounded-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-action-primary)] hover:border-[var(--color-action-primary)] transition-colors"
                >
                  {app.name}
                </a>
              ))}
            </div>
          </div>

          {/* App Sections */}
          <div className="space-y-8">
            {appIconData.map((app, index) => (
              <AppSectionCard key={index} app={app} searchQuery={searchQuery} />
            ))}
          </div>

          {/* No results message */}
          {filteredCount === 0 && searchQuery && (
            <div className="text-center py-16">
              <IconSearch
                size={48}
                stroke={1}
                className="mx-auto text-[var(--color-text-subtle)] mb-4"
              />
              <p className="text-[14px] text-[var(--color-text-muted)]">
                No icons found for "<strong>{searchQuery}</strong>"
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <p className="text-[12px] text-[var(--color-text-subtle)] text-center">
            © 2025 THAKI Cloud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SidebarIconsPage;
