import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as Icons from './svg';

const meta: Meta = {
  title: 'Foundation/Icon/Sidebar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Icons used in each app sidebar (LNB). Cross-referenced with SSOT design system.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconEntry = { name: string; Comp: React.ComponentType<any> };

const ALL_ICONS = Object.entries(Icons)
  .filter(([name, Comp]) => name.endsWith('Icon') && typeof Comp === 'function')
  .map(([name, Comp]) => ({
    name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Comp: Comp as React.ComponentType<any>,
  }));

const iconsByName = new Map(ALL_ICONS.map(i => [i.name, i]));

const resolve = (names: string[]): IconEntry[] =>
  names.map(n => iconsByName.get(n)).filter((e): e is IconEntry => e !== undefined);

type SidebarItem = { icon: string; label: string };
type SidebarSection = { title: string; items: SidebarItem[] };
type SidebarDef = { name: string; sections: SidebarSection[] };

const SIDEBARS: SidebarDef[] = [
  {
    name: 'IAM',
    sections: [
      { title: 'Home', items: [{ icon: 'HomeIcon', label: 'Home' }] },
      {
        title: 'Access management',
        items: [
          { icon: 'IamUsersIcon', label: 'Users' },
          { icon: 'IamUsersGroupIcon', label: 'User groups' },
          { icon: 'SecurityGroupIcon', label: 'Roles' },
          { icon: 'FileIcon', label: 'Policies' },
        ],
      },
      {
        title: 'Authentication',
        items: [{ icon: 'KeyIcon', label: 'MFA policies' }],
      },
      {
        title: 'Session management',
        items: [
          { icon: 'ScheduleIcon', label: 'Session policies' },
          { icon: 'IamDeviceDesktopIcon', label: 'Active sessions' },
        ],
      },
      {
        title: 'Global administration',
        items: [
          { icon: 'IamWorldIcon', label: 'Domains' },
          { icon: 'IamUserCogIcon', label: 'System administrators' },
          { icon: 'LockIcon', label: 'Login policies' },
          { icon: 'KeyIcon', label: 'Token policies' },
        ],
      },
      {
        title: 'Monitoring',
        items: [{ icon: 'IamHistoryIcon', label: 'Event logs' }],
      },
    ],
  },
  {
    name: 'Compute (User)',
    sections: [
      { title: 'Home', items: [{ icon: 'DashboardIcon', label: 'Dashboard' }] },
      {
        title: 'Compute',
        items: [
          { icon: 'InstancesIcon', label: 'Instances' },
          { icon: 'TemplateIcon', label: 'Instance templates' },
          { icon: 'SnapshotIcon', label: 'Instance snapshots' },
          { icon: 'ImagesIcon', label: 'Images' },
          { icon: 'FlavorIcon', label: 'Flavors' },
          { icon: 'KeyPairsIcon', label: 'Key pairs' },
          { icon: 'ServerIcon', label: 'Server groups' },
        ],
      },
      {
        title: 'Storage',
        items: [
          { icon: 'StorageIcon', label: 'Volumes' },
          { icon: 'SnapshotIcon', label: 'Volume snapshots' },
          { icon: 'BackupIcon', label: 'Volume backups' },
        ],
      },
      {
        title: 'Network',
        items: [
          { icon: 'NetworksIcon', label: 'Networks' },
          { icon: 'RoutersIcon', label: 'Routers' },
          { icon: 'PortsIcon', label: 'Ports' },
          { icon: 'FloatingIpIcon', label: 'Floating IPs' },
          { icon: 'SecurityGroupIcon', label: 'Security groups' },
          { icon: 'LoadBalancerIcon', label: 'Load balancers' },
          { icon: 'CertificateIcon', label: 'Certificates' },
          { icon: 'TopologyIcon', label: 'Topology' },
          { icon: 'RouteIcon', label: 'DNS Zones' },
          { icon: 'CloudComputingIcon', label: 'Backup Policies' },
          { icon: 'CalendarEventIcon', label: 'Scheduled Tasks' },
        ],
      },
    ],
  },
  {
    name: 'Compute (Admin)',
    sections: [
      { title: 'Home', items: [{ icon: 'DashboardIcon', label: 'Dashboard' }] },
      {
        title: 'Compute',
        items: [
          { icon: 'InstancesIcon', label: 'Instances' },
          { icon: 'TemplateIcon', label: 'Instance templates' },
          { icon: 'SnapshotIcon', label: 'Instance snapshots' },
          { icon: 'ImagesIcon', label: 'Images' },
          { icon: 'FlavorIcon', label: 'Flavors' },
          { icon: 'CardIcon', label: 'Server groups' },
          { icon: 'HostAggregatesIcon', label: 'Host aggregates' },
          { icon: 'ServerIcon', label: 'Bare metal nodes' },
        ],
      },
      {
        title: 'Storage',
        items: [
          { icon: 'StorageIcon', label: 'Volumes' },
          { icon: 'SnapshotIcon', label: 'Volume snapshots' },
          { icon: 'BackupIcon', label: 'Volume backups' },
          { icon: 'VolumeTypeIcon', label: 'Volume types' },
        ],
      },
      {
        title: 'Network',
        items: [
          { icon: 'NetworksIcon', label: 'Networks' },
          { icon: 'RoutersIcon', label: 'Routers' },
          { icon: 'PortsIcon', label: 'Ports' },
          { icon: 'FloatingIpIcon', label: 'Floating IPs' },
          { icon: 'SecurityGroupIcon', label: 'Security groups' },
          { icon: 'LoadBalancerIcon', label: 'Load balancers' },
          { icon: 'SecurityIcon', label: 'Firewalls' },
        ],
      },
      {
        title: 'System',
        items: [
          { icon: 'IamUsersGroupIcon', label: 'Tenants' },
          { icon: 'FileCodeIcon', label: 'Metadata definition' },
        ],
      },
      {
        title: 'Monitoring',
        items: [
          { icon: 'ActivityIcon', label: 'Monitor overview' },
          { icon: 'HypervisorIcon', label: 'Physical nodes' },
        ],
      },
    ],
  },
  {
    name: 'Container',
    sections: [
      {
        title: 'Primary Menu',
        items: [
          { icon: 'HomeIcon', label: 'Home' },
          { icon: 'SidebarPackagesIcon', label: 'Cluster management' },
          { icon: 'AffiliateIcon', label: 'Cluster instance' },
        ],
      },
      {
        title: 'Cluster',
        items: [
          { icon: 'DashboardIcon', label: 'Dashboard' },
          { icon: 'SidebarFoldersIcon', label: 'Namespaces' },
          { icon: 'SidebarTopologyStarIcon', label: 'Nodes' },
          { icon: 'SidebarTimelineEventIcon', label: 'Events' },
        ],
      },
      {
        title: 'Workloads',
        items: [
          { icon: 'SidebarRocketIcon', label: 'Deployments' },
          { icon: 'SidebarGroupIcon', label: 'StatefulSets' },
          { icon: 'RefreshIcon', label: 'DaemonSets' },
          { icon: 'ScheduleIcon', label: 'Jobs' },
          { icon: 'SidebarCalendarTimeIcon', label: 'CronJobs' },
          { icon: 'BoxIcon', label: 'Pods' },
        ],
      },
      {
        title: 'Service discovery',
        items: [
          { icon: 'SidebarNetworkIcon', label: 'Services' },
          { icon: 'SidebarArrowsShuffleIcon', label: 'Ingresses' },
          { icon: 'SidebarScalingIcon', label: 'HPA' },
        ],
      },
      {
        title: 'Storage',
        items: [
          { icon: 'HardDriveIcon', label: 'Persistent volumes' },
          { icon: 'StorageIcon', label: 'Persistent volume claims' },
          { icon: 'LayersIcon', label: 'Storage classes' },
          { icon: 'SidebarFileSettingsIcon', label: 'ConfigMaps' },
          { icon: 'KeyIcon', label: 'Secrets' },
        ],
      },
      {
        title: 'Policy',
        items: [
          { icon: 'SidebarRulerMeasureIcon', label: 'Limit ranges' },
          { icon: 'SidebarChartPieIcon', label: 'Resource quotas' },
          { icon: 'SecurityGroupIcon', label: 'Network policies' },
          { icon: 'SidebarReorderIcon', label: 'Pod disruption budgets' },
        ],
      },
    ],
  },
  {
    name: 'Storage',
    sections: [
      { title: 'Home', items: [{ icon: 'DashboardIcon', label: 'Dashboard' }] },
      {
        title: 'Cluster',
        items: [
          { icon: 'StorageIcon', label: 'Pools' },
          { icon: 'HypervisorIcon', label: 'Hosts' },
          { icon: 'FlavorIcon', label: 'OSDs' },
          { icon: 'HardDriveIcon', label: 'Physical disks' },
        ],
      },
      {
        title: 'Block',
        items: [{ icon: 'ImagesIcon', label: 'Images' }],
      },
      {
        title: 'Object',
        items: [{ icon: 'BucketIcon', label: 'Buckets' }],
      },
      {
        title: 'Monitoring',
        items: [{ icon: 'SpeedTestIcon', label: 'Overall performance' }],
      },
    ],
  },
  {
    name: 'AI Platform',
    sections: [
      {
        title: 'Home',
        items: [
          { icon: 'HomeIcon', label: 'Dashboard' },
          { icon: 'CompassIcon', label: 'Explore' },
        ],
      },
      {
        title: 'Hub',
        items: [
          { icon: 'PackagesIcon', label: 'Packages' },
          { icon: 'BrainIcon', label: 'Models' },
          { icon: 'StorageIcon', label: 'Datasets' },
        ],
      },
      {
        title: 'Infrastructure',
        items: [
          { icon: 'SpeedIcon', label: 'Workloads' },
          { icon: 'TemplateIcon', label: 'My templates' },
          { icon: 'BoxIcon', label: 'Storage' },
          { icon: 'ZapIcon', label: 'Serverless' },
        ],
      },
      {
        title: 'ML Studio',
        items: [
          { icon: 'MessageCircleIcon', label: 'Text generation' },
        ],
      },
      {
        title: 'MLOps',
        items: [
          { icon: 'CodeIcon', label: 'DevSpace' },
          { icon: 'RouteIcon', label: 'Pipeline builder' },
          { icon: 'ChartIcon', label: 'Benchmarks' },
          { icon: 'BrainIcon', label: 'Kubeflow' },
          { icon: 'RefreshIcon', label: 'MLflow' },
        ],
      },
      {
        title: 'Settings',
        items: [
          { icon: 'SettingIcon', label: 'Settings' },
          { icon: 'HelpIcon', label: 'FAQ' },
        ],
      },
      {
        title: 'Operations',
        items: [
          { icon: 'ListIcon', label: 'Kueue' },
          { icon: 'ActivityIcon', label: 'Monitoring' },
          { icon: 'BranchIcon', label: 'Dependencies' },
          { icon: 'IamUserCogIcon', label: 'System administration' },
        ],
      },
    ],
  },
  {
    name: 'Agent',
    sections: [
      {
        title: 'Navigation',
        items: [
          { icon: 'MessagesIcon', label: 'Chat' },
          { icon: 'RobotFaceIcon', label: 'Agent' },
          { icon: 'StorageIcon', label: 'Data sources' },
          { icon: 'PuzzleIcon', label: 'MCP tools' },
          { icon: 'SettingIcon', label: 'Settings' },
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
          { icon: 'ListSearchIcon', label: 'Discovery' },
          { icon: 'HypervisorIcon', label: 'Servers' },
          { icon: 'PortsIcon', label: 'Switch' },
        ],
      },
      {
        title: 'System info',
        items: [
          { icon: 'FlavorIcon', label: 'Compute services' },
          { icon: 'Cpu2Icon', label: 'Compute nodes' },
          { icon: 'NetworkIcon', label: 'Network agents' },
          { icon: 'StorageIcon', label: 'Block storage services' },
          { icon: 'AffiliateIcon', label: 'Orchestration services' },
        ],
      },
    ],
  },
];

const s = {
  page: { width: '100%', padding: 24, display: 'flex', flexDirection: 'column' as const, gap: 40 },
  app: { display: 'flex', flexDirection: 'column' as const, gap: 16 },
  appName: { fontSize: 16, fontWeight: 700, color: 'var(--semantic-color-text)', borderBottom: '2px solid var(--semantic-color-border)', paddingBottom: 6 },
  section: { display: 'flex', flexDirection: 'column' as const, gap: 4, marginLeft: 8 },
  sectionTitle: { fontSize: 11, fontWeight: 600, color: 'var(--semantic-color-textMuted)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 2 },
  item: { display: 'flex', alignItems: 'center' as const, gap: 8, padding: '4px 8px', borderRadius: 6 },
  label: { fontSize: 12, color: 'var(--semantic-color-text)' },
  iconName: { fontSize: 10, color: 'var(--semantic-color-textMuted)', marginLeft: 'auto' as const },
};

export const Sidebar: Story = {
  render: () => (
    <div style={s.page}>
      {SIDEBARS.map(sidebar => (
        <div key={sidebar.name} style={s.app}>
          <div style={s.appName}>{sidebar.name}</div>
          {sidebar.sections.map(section => {
            const items = section.items
              .map(item => {
                const entry = iconsByName.get(item.icon);
                return entry ? { ...item, Comp: entry.Comp } : null;
              })
              .filter(Boolean) as (SidebarItem & { Comp: React.ComponentType<Record<string, unknown>> })[];

            return (
              <div key={section.title} style={s.section}>
                <div style={s.sectionTitle}>{section.title}</div>
                {items.map(item => (
                  <div key={item.label} style={s.item}>
                    <item.Comp size="sm" />
                    <span style={s.label}>{item.label}</span>
                    <span style={s.iconName}>{item.icon.replace(/Icon$/, '')}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  ),
};
