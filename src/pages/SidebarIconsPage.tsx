import { useRef, useCallback } from 'react';
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
  IconNetwork,
  IconRouter,
  IconWorldWww,
  IconShieldLock,
  IconLoadBalancer,
  IconCertificate,
  IconTopologyStar3,
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
  IconRuler,
  IconScale,
  IconAlertTriangle,
  IconBrandSpeedtest,
  IconUsers,
  IconUsersGroup,
  IconFileDescription,
  IconClock,
  IconDeviceDesktop,
  IconWorld,
  IconUserCog,
  IconLock,
  IconHistory,
  IconApps,
  IconCalendarTime,
  IconBox,
  IconCompass,
  IconPackages,
  IconBolt,
  IconMessageCircle,
  IconCode,
  IconRoute,
  IconChartBar,
  IconBrandDocker,
  IconFlask,
  IconSettings,
  IconHelp,
  IconList,
  IconGitBranch,
  IconUser,
  IconInfoCircle,
  IconArrowLeft,
  IconExternalLink,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import { EthernetPort, ChevronsLeftRightEllipsis, HardDrive, LogIn, Scaling, FileCheck2 } from 'lucide-react';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import { Button } from '@/design-system';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface IconItem {
  icon: React.ComponentType<{ size?: number; stroke?: number; strokeWidth?: number; className?: string }>;
  name: string;
  label: string;
  slug: string; // kebab-case name for URL
  library?: 'tabler' | 'lucide'; // Icon library (default: tabler)
}

interface AppSection {
  title: string;
  items: IconItem[];
}

interface AppData {
  name: string;
  sections: AppSection[];
}

/* ----------------------------------------
   Icon Data
   ---------------------------------------- */

const appIconData: AppData[] = [
  {
    name: 'Compute',
    sections: [
      {
        title: 'Home',
        items: [
          { icon: IconHome, name: 'IconHome', label: 'Home', slug: 'home' },
        ],
      },
      {
        title: 'Compute',
        items: [
          { icon: IconCube, name: 'IconCube', label: 'Instances', slug: 'cube' },
          { icon: IconTemplate, name: 'IconTemplate', label: 'Instance templates', slug: 'template' },
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
          { icon: IconDatabaseExport, name: 'IconDatabaseExport', label: 'Volume backups', slug: 'database-export' },
        ],
      },
      {
        title: 'Network',
        items: [
          { icon: IconNetwork, name: 'IconNetwork', label: 'Networks', slug: 'network' },
          { icon: IconRouter, name: 'IconRouter', label: 'Routers', slug: 'router' },
          { icon: ChevronsLeftRightEllipsis, name: 'ChevronsLeftRightEllipsis', label: 'Ports', slug: 'chevrons-left-right-ellipsis', library: 'lucide' },
          { icon: IconWorldWww, name: 'IconWorldWww', label: 'Floating IPs', slug: 'world-www' },
          { icon: IconShieldLock, name: 'IconShieldLock', label: 'Security groups', slug: 'shield-lock' },
          { icon: IconLoadBalancer, name: 'IconLoadBalancer', label: 'Load balancers', slug: 'load-balancer' },
          { icon: IconCertificate, name: 'IconCertificate', label: 'Certificates', slug: 'certificate' },
          { icon: IconTopologyStar3, name: 'IconTopologyStar3', label: 'Topology', slug: 'topology-star-3' },
        ],
      },
    ],
  },
  {
    name: 'Cloud Builder',
    sections: [
      {
        title: 'Inventory (1.0v)',
        items: [
          { icon: IconListSearch, name: 'IconListSearch', label: 'Discovery', slug: 'list-search' },
          { icon: IconServer2, name: 'IconServer2', label: 'Servers', slug: 'server-2' },
          { icon: EthernetPort, name: 'EthernetPort', label: 'Switch', slug: 'ethernet-port', library: 'lucide' },
        ],
      },
      {
        title: 'System info',
        items: [
          { icon: IconActivity, name: 'IconActivity', label: 'Compute services', slug: 'activity' },
          { icon: IconCpu2, name: 'IconCpu2', label: 'Compute nodes', slug: 'cpu-2' },
          { icon: IconNetwork, name: 'IconNetwork', label: 'Network agents', slug: 'network' },
          { icon: IconDatabase, name: 'IconDatabase', label: 'Block storage services', slug: 'database' },
          { icon: IconAffiliate, name: 'IconAffiliate', label: 'Orchestration services', slug: 'affiliate' },
        ],
      },
    ],
  },
  {
    name: 'Storage',
    sections: [
      {
        title: 'Home',
        items: [
          { icon: IconHome, name: 'IconHome', label: 'Home', slug: 'home' },
        ],
      },
      {
        title: 'Cluster',
        items: [
          { icon: IconDatabase, name: 'IconDatabase', label: 'Pools', slug: 'database' },
          { icon: IconTemplate, name: 'IconTemplate', label: 'Hosts', slug: 'template' },
          { icon: IconCpu, name: 'IconCpu', label: 'OSDs', slug: 'cpu' },
          { icon: HardDrive, name: 'HardDrive', label: 'Physical disks', slug: 'hard-drive', library: 'lucide' },
        ],
      },
      {
        title: 'Block',
        items: [
          { icon: IconDisc, name: 'IconDisc', label: 'Images', slug: 'disc' },
        ],
      },
      {
        title: 'Object',
        items: [
          { icon: IconBucket, name: 'IconBucket', label: 'Buckets', slug: 'bucket' },
        ],
      },
      {
        title: 'Monitoring',
        items: [
          { icon: IconBrandSpeedtest, name: 'IconBrandSpeedtest', label: 'Overall performance', slug: 'brand-speedtest' },
        ],
      },
    ],
  },
  {
    name: 'IAM',
    sections: [
      {
        title: 'Home',
        items: [
          { icon: IconHome, name: 'IconHome', label: 'Home', slug: 'home' },
        ],
      },
      {
        title: 'Access management',
        items: [
          { icon: IconUsers, name: 'IconUsers', label: 'Users', slug: 'users' },
          { icon: IconUsersGroup, name: 'IconUsersGroup', label: 'User groups', slug: 'users-group' },
          { icon: IconShieldLock, name: 'IconShieldLock', label: 'Roles', slug: 'shield-lock' },
          { icon: IconFileDescription, name: 'IconFileDescription', label: 'Policies', slug: 'file-description' },
        ],
      },
      {
        title: 'Authentication',
        items: [
          { icon: IconKey, name: 'IconKey', label: 'MFA policies', slug: 'key' },
        ],
      },
      {
        title: 'Session management',
        items: [
          { icon: IconClock, name: 'IconClock', label: 'Session policies', slug: 'clock' },
          { icon: IconDeviceDesktop, name: 'IconDeviceDesktop', label: 'Active sessions', slug: 'device-desktop' },
        ],
      },
      {
        title: 'Global administration',
        items: [
          { icon: IconWorld, name: 'IconWorld', label: 'Domains', slug: 'world' },
          { icon: IconUserCog, name: 'IconUserCog', label: 'System administrators', slug: 'user-cog' },
          { icon: IconLock, name: 'IconLock', label: 'Login policies', slug: 'lock' },
          { icon: IconKey, name: 'IconKey', label: 'Token policies', slug: 'key' },
        ],
      },
      {
        title: 'Monitoring',
        items: [
          { icon: IconHistory, name: 'IconHistory', label: 'Event logs', slug: 'history' },
        ],
      },
    ],
  },
  {
    name: 'Container',
    sections: [
      {
        title: 'Cluster',
        items: [
          { icon: IconHome, name: 'IconHome', label: 'Dashboard', slug: 'home' },
          { icon: IconFolders, name: 'IconFolders', label: 'Namespaces', slug: 'folders' },
          { icon: IconServer, name: 'IconServer', label: 'Nodes', slug: 'server' },
          { icon: IconBell, name: 'IconBell', label: 'Events', slug: 'bell' },
        ],
      },
      {
        title: 'Workloads',
        items: [
          { icon: IconRocket, name: 'IconRocket', label: 'Deployments', slug: 'rocket' },
          { icon: IconApps, name: 'IconApps', label: 'StatefulSets', slug: 'apps' },
          { icon: IconRefresh, name: 'IconRefresh', label: 'DaemonSets', slug: 'refresh' },
          { icon: IconClock, name: 'IconClock', label: 'Jobs', slug: 'clock' },
          { icon: IconCalendarTime, name: 'IconCalendarTime', label: 'CronJobs', slug: 'calendar-time' },
          { icon: IconBox, name: 'IconBox', label: 'Pods', slug: 'box' },
        ],
      },
      {
        title: 'Service discovery',
        items: [
          { icon: IconNetwork, name: 'IconNetwork', label: 'Services', slug: 'network' },
          { icon: LogIn, name: 'LogIn', label: 'Ingresses', slug: 'log-in', library: 'lucide' },
          { icon: Scaling, name: 'Scaling', label: 'Horizontal pod autoscalers', slug: 'scaling', library: 'lucide' },
        ],
      },
      {
        title: 'Storage',
        items: [
          { icon: HardDrive, name: 'HardDrive', label: 'Persistent volumes', slug: 'hard-drive', library: 'lucide' },
          { icon: FileCheck2, name: 'FileCheck2', label: 'Persistent volume claims', slug: 'file-check-2', library: 'lucide' },
          { icon: IconStack3, name: 'IconStack3', label: 'Storage classes', slug: 'stack-3' },
          { icon: IconFileSettings, name: 'IconFileSettings', label: 'ConfigMaps', slug: 'file-settings' },
          { icon: IconKey, name: 'IconKey', label: 'Secrets', slug: 'key' },
        ],
      },
      {
        title: 'Policy',
        items: [
          { icon: IconRuler, name: 'IconRuler', label: 'Limit ranges', slug: 'ruler' },
          { icon: IconScale, name: 'IconScale', label: 'Resource quotas', slug: 'scale' },
          { icon: IconShieldLock, name: 'IconShieldLock', label: 'Network policies', slug: 'shield-lock' },
          { icon: IconAlertTriangle, name: 'IconAlertTriangle', label: 'Pod disruption budgets', slug: 'alert-triangle' },
        ],
      },
    ],
  },
  {
    name: 'AI Platform',
    sections: [
      {
        title: 'Home',
        items: [
          { icon: IconHome, name: 'IconHome', label: 'Dashboard', slug: 'home' },
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
          { icon: IconServer, name: 'IconServer', label: 'Workloads', slug: 'server' },
          { icon: IconTemplate, name: 'IconTemplate', label: 'My templates', slug: 'template' },
          { icon: IconBox, name: 'IconBox', label: 'Storage', slug: 'box' },
          { icon: IconBolt, name: 'IconBolt', label: 'Serverless', slug: 'bolt' },
        ],
      },
      {
        title: 'ML Studio',
        items: [
          { icon: IconMessageCircle, name: 'IconMessageCircle', label: 'Text generation', slug: 'message-circle' },
        ],
      },
      {
        title: 'MLOps',
        items: [
          { icon: IconCode, name: 'IconCode', label: 'DevSpace', slug: 'code' },
          { icon: IconRoute, name: 'IconRoute', label: 'Pipeline builder', slug: 'route' },
          { icon: IconChartBar, name: 'IconChartBar', label: 'Benchmarks', slug: 'chart-bar' },
          { icon: IconBrandDocker, name: 'IconBrandDocker', label: 'Kubeflow', slug: 'brand-docker' },
          { icon: IconFlask, name: 'IconFlask', label: 'MLflow', slug: 'flask' },
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
          { icon: IconUserCog, name: 'IconUserCog', label: 'System administration', slug: 'user-cog' },
        ],
      },
    ],
  },
  {
    name: 'Settings',
    sections: [
      {
        title: 'Menu',
        items: [
          { icon: IconSettings, name: 'IconSettings', label: 'General', slug: 'settings' },
          { icon: IconUser, name: 'IconUser', label: 'Account', slug: 'user' },
          { icon: IconBell, name: 'IconBell', label: 'Notifications', slug: 'bell' },
          { icon: IconInfoCircle, name: 'IconInfoCircle', label: 'Information', slug: 'info-circle' },
        ],
      },
    ],
  },
];

/* ----------------------------------------
   Icon Card Component
   ---------------------------------------- */

interface IconCardProps {
  item: IconItem;
}

function IconCard({ item }: IconCardProps) {
  const Icon = item.icon;
  const isLucide = item.library === 'lucide';
  const iconUrl = isLucide
    ? `https://lucide.dev/icons/${item.slug}`
    : `https://tabler.io/icons/icon/${item.slug}`;
  const libraryLabel = isLucide ? 'Lucide' : 'Tabler';
  const iconRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
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
  }, [item.slug]);
  
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-strong)] transition-colors">
      <div 
        ref={iconRef}
        className="w-8 h-8 flex items-center justify-center bg-[var(--color-surface-subtle)] rounded-md"
      >
        {isLucide ? (
          <Icon size={16} strokeWidth={1.5} className="text-[var(--color-text-default)]" />
        ) : (
          <Icon size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-[var(--color-text-default)] truncate">
          {item.label}
        </p>
        <div className="flex items-center gap-1.5">
          <p className="text-[10px] text-[var(--color-text-subtle)] font-mono truncate">
            {item.name}
          </p>
          {isLucide && (
            <span className="text-[8px] px-1 py-0.5 bg-[var(--color-surface-muted)] rounded text-[var(--color-text-subtle)]">
              Lucide
            </span>
          )}
          <button
            onClick={handleDownload}
            className="flex-shrink-0 text-[var(--color-text-subtle)] hover:text-[var(--color-action-primary)] transition-colors"
            title="Download SVG (16px)"
          >
            <IconDownload size={10} stroke={1.5} />
          </button>
          <a
            href={iconUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors"
            title={`Open in ${libraryLabel}`}
          >
            <IconExternalLink size={10} stroke={1.5} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   App Section Component
   ---------------------------------------- */

interface AppSectionCardProps {
  app: AppData;
}

function AppSectionCard({ app }: AppSectionCardProps) {
  return (
    <div className="bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] overflow-hidden">
      {/* App Header */}
      <div className="px-5 py-4 border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
        <h2 className="text-[16px] font-semibold text-[var(--color-text-default)]">
          {app.name}
        </h2>
      </div>
      
      {/* Sections */}
      <div className="p-5 space-y-6">
        {app.sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-[11px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {section.items.map((item, itemIndex) => (
                <IconCard key={itemIndex} item={item} />
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
            <img 
              src={isDark ? ThakiLogoDark : ThakiLogoLight} 
              alt="THAKI Cloud" 
              className="h-5"
            />
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
            <p className="text-[14px] text-[var(--color-text-subtle)]">
              각 앱별 사이드바 메뉴에 사용된 Tabler 아이콘 목록입니다. 아이콘 이름을 클릭하면 복사됩니다.
            </p>
            <div className="mt-4 p-3 bg-[var(--color-surface-muted)] rounded-lg border border-[var(--color-border-default)]">
              <code className="text-[12px] text-[var(--color-text-default)]">
                import {'{ IconName }'} from '@tabler/icons-react';
              </code>
            </div>
          </div>

          {/* App Sections */}
          <div className="space-y-8">
            {appIconData.map((app, index) => (
              <AppSectionCard key={index} app={app} />
            ))}
          </div>
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
