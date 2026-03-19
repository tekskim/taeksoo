import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import * as Icons from './svg';

const meta: Meta = {
  title: 'Foundation/Icon/Catalog',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
All available icons. General-purpose icons use \`@tabler/icons-react\`, domain-specific icons use custom SVGs.

### Usage
\`\`\`tsx
import { FileIcon, AddIcon, SettingIcon } from '@thaki/shared';

<FileIcon variant="primary" size="md" />
<AddIcon variant="success" />
<SettingIcon variant="compute" size="lg" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 24, 32, 48],
    },
    weight: {
      control: 'select',
      options: ['light', 'fill'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'muted', 'inverse', 'brand', 'compute', 'container', 'mlops'],
    },
    color: { control: 'color' },
    mirrored: { control: 'boolean' },
    withStroke: { control: 'boolean' },
    showLabels: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconEntry = { name: string; Comp: React.ComponentType<any>; custom: boolean };

const CUSTOM_ICON_NAMES = new Set([
  'AddRobotIcon', 'HistoryIcon',
  'ExpandOnIcon', 'ExpandOffIcon',
  'SwitchIcon', 'TimeoutIcon',
  'ResetIcon', 'IdentifyIcon',
  'WindowCloseIcon', 'WindowMaximizeIcon', 'WindowMinimizeIcon',
  'UbuntuIcon', 'RockyIcon',
  'SnapTopIcon', 'SnapBottomIcon', 'SnapLeftIcon', 'SnapRightIcon',
  'SidebarScalingIcon',
  'SidebarNetworkIcon',
  'DeviceMobileIcon', 'EnvelopeIcon',
]);

const ALL_ICONS: IconEntry[] = Object.entries(Icons)
  .filter(([name, Comp]) => name.endsWith('Icon') && typeof Comp === 'function')
  .map(([name, Comp]) => ({
    name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Comp: Comp as React.ComponentType<any>,
    custom: CUSTOM_ICON_NAMES.has(name),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const TABLER_CATEGORIES: Record<string, string[]> = {
  'Action': [
    'ActionIcon',
    'PlayIcon', 'StopIcon', 'RebootIcon', 'DeleteIcon',
    'AddIcon', 'CreateIcon', 'EditIcon', 'CopyIcon', 'DownloadIcon',
    'UploadIcon', 'RefreshIcon', 'RetryIcon',
    'SearchIcon', 'PublishIcon', 'TransferIcon', 'ShareIcon',
    'LinkIcon', 'UnlinkIcon', 'OrderIcon',
  ],
  'Navigation': [
    'ChevronLeftIcon', 'ChevronRightIcon', 'ChevronDownIcon', 'ChevronUpIcon',
    'ArrowDownIcon', 'ArrowUpIcon', 'ArrowLeftIcon', 'ArrowRightIcon',
    'ExternalLinkIcon', 'NewTabIcon', 'HomeIcon', 'SidebarIcon',
  ],
  'Status': [
    'ActiveIcon', 'DeactivatedIcon', 'ErrorIcon',
    'AlertIcon', 'AlertCircleIcon', 'InfoIcon', 'CheckIcon', 'CheckCircleIcon',
    'PendingIcon', 'ProgressIcon', 'SuspendedIcon', 'PausedIcon',
    'ShelvedIcon', 'BuildingIcon', 'DeletingIcon', 'ShutoffIcon',
    'MaintenanceIcon', 'InuseIcon', 'SecurityErrorIcon', 'DotIcon',
  ],
  'Infrastructure': [
    'InstancesIcon', 'BoxIcon', 'ServerIcon', 'ServerBoltIcon', 'FlavorIcon',
    'Cpu2Icon', 'MemoryStickIcon', 'HypervisorIcon',
    'HostAggregatesIcon', 'CloudComputingIcon', 'DeviceDesktopAnalyticsIcon',
    'TemplateIcon', 'SnapshotIcon', 'BackupIcon', 'ImagesIcon', 'KeyPairsIcon',
    'StorageIcon', 'HardDriveIcon', 'VolumeTypeIcon', 'VolumeSearchIcon', 'AddVolumeIcon',
    'BucketIcon', 'TopologyIcon', 'SpeedTestIcon',
  ],
  'Network & Security': [
    'NetworksIcon', 'NetworkIcon', 'RoutersIcon', 'PortsIcon',
    'FloatingIpIcon', 'LoadBalancerIcon', 'SecurityGroupIcon',
    'SecurityIcon', 'LockIcon', 'KeyIcon', 'CertificateIcon', 'VerifyIcon',
  ],
  'File & Content': [
    'FileIcon', 'FileCodeIcon', 'FolderIcon', 'FolderOpenIcon',
    'CodeConsoleIcon', 'ListIcon', 'ListSearchIcon', 'GridIcon',
    'LayersIcon', 'ArticleHistoryIcon',
  ],
  'Data & Analytics': [
    'ChartIcon', 'DashboardIcon', 'ActivityIcon', 'SpeedIcon',
  ],
  'AI & MLOps': [
    'BrainIcon', 'RobotIcon', 'RobotFaceIcon', 'ChatIcon', 'ChatbotIcon',
    'MessagesIcon', 'MessageCircleIcon', 'NewChatIcon',
    'FinetuningIcon', 'StudyIcon', 'PuzzleIcon',
    'CompassIcon', 'PackagesIcon', 'CodeIcon', 'RouteIcon',
  ],
  'Schedule & Time': [
    'CalendarIcon', 'CalendarEventIcon', 'ScheduleIcon', 'HourglassHighIcon',
  ],
  'UI & Layout': [
    'MoreIcon', 'CloseSmallIcon', 'DrawerCloseIcon', 'ShowIcon', 'HideIcon',
    'MoreCircleIcon', 'FavoriteOffIcon', 'FavoriteOnIcon', 'NotificationIcon',
    'NotificationNewIcon', 'PlusCircleIcon', 'CardIcon',
    'FullscreenIcon', 'FullscreenExitIcon', 'WindowIcon',
  ],
  'Toast': [
    'ToastSuccessIcon', 'ToastErrorIcon',
  ],
  'IAM': [
    'IamUsersIcon', 'IamUsersGroupIcon', 'IamDeviceDesktopIcon',
    'IamWorldIcon', 'IamUserCogIcon', 'IamHistoryIcon',
  ],
  'Container Sidebar': [
    'SidebarPackagesIcon', 'SidebarChartCohortIcon', 'SidebarFoldersIcon',
    'SidebarTopologyStarIcon', 'SidebarTimelineEventIcon', 'SidebarRocketIcon',
    'SidebarGroupIcon', 'SidebarArrowsShuffleIcon', 'SidebarCalendarTimeIcon',
    'SidebarNetworkIcon', 'SidebarFileSettingsIcon', 'SidebarRulerMeasureIcon',
    'SidebarChartPieIcon', 'SidebarReorderIcon',
  ],
  'Misc': [
    'SettingIcon', 'LanguageIcon', 'SunIcon', 'MoonIcon', 'HelpIcon',
    'DollarSignIcon', 'ZapIcon', 'BranchIcon', 'CategoryIcon',
    'PluginIcon', 'RequestIcon', 'AdjustmentsAltIcon',
    'AffiliateIcon', 'UserCircleIcon', 'OtherIcon',
  ],
  'AppBar': [
    'AppBarDocumentIcon', 'AppBarSettingsIcon', 'AppBarUserIcon',
  ],
};

const CUSTOM_CATEGORIES: Record<string, string[]> = {
  'Domain-specific': [
    'SwitchIcon', 'TimeoutIcon',
    'ResetIcon', 'IdentifyIcon', 'HistoryIcon',
    'AddRobotIcon', 'DeviceMobileIcon', 'EnvelopeIcon',
    'SidebarScalingIcon',
  ],
  'Navigation & Layout': [
    'ExpandOnIcon', 'ExpandOffIcon',
    'SnapTopIcon', 'SnapBottomIcon', 'SnapLeftIcon', 'SnapRightIcon',
  ],
  'OS & Window': [
    'WindowCloseIcon', 'WindowMaximizeIcon', 'WindowMinimizeIcon',
    'UbuntuIcon', 'RockyIcon',
  ],
};

const iconsByName = new Map(ALL_ICONS.map(i => [i.name, i]));

const resolve = (names: string[]): IconEntry[] =>
  names.map(n => iconsByName.get(n)).filter((e): e is IconEntry => e !== undefined);

const allCategorized = new Set([
  ...Object.values(TABLER_CATEGORIES).flat(),
  ...Object.values(CUSTOM_CATEGORIES).flat(),
]);
const uncategorized = ALL_ICONS.filter(i => !allCategorized.has(i.name));

const tablerCount = ALL_ICONS.filter(i => !i.custom).length;
const customCount = ALL_ICONS.filter(i => i.custom).length;

const styles = {
  page: { width: '100%', padding: 24, boxSizing: 'border-box' as const, display: 'flex', flexDirection: 'column' as const, gap: 32 },
  groupHeader: { fontSize: 18, fontWeight: 700, color: 'var(--semantic-color-text)', display: 'flex', alignItems: 'center' as const, gap: 10, padding: '4px 0' },
  badge: (bg: string) => ({ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, color: '#fff', backgroundColor: bg }),
  section: { display: 'flex', flexDirection: 'column' as const, gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: 'var(--semantic-color-text)', borderBottom: '1px solid var(--semantic-color-border)', paddingBottom: 6 },
  count: { fontSize: 12, fontWeight: 400, color: 'var(--semantic-color-textMuted)', marginLeft: 6 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 },
  item: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center' as const, gap: 6, padding: '10px 4px', borderRadius: 8 },
  label: { fontSize: 10, color: 'var(--semantic-color-textMuted)', textAlign: 'center' as const, wordBreak: 'break-word' as const, lineHeight: 1.3 },
  summary: { fontSize: 13, color: 'var(--semantic-color-textMuted)', padding: '4px 0' },
  divider: { height: 1, backgroundColor: 'var(--semantic-color-border)', margin: '8px 0' },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderGrid = (entries: IconEntry[], args: any, showLabels: boolean) => (
  <div style={styles.grid}>
    {entries.map(({ name, Comp }) => (
      <div key={name} style={styles.item} title={name}>
        <Comp
          size={args.size}
          weight={args.weight}
          color={args.color}
          mirrored={args.mirrored}
          withStroke={args.withStroke}
          variant={args.variant}
        />
        {showLabels && <div style={styles.label}>{name.replace(/Icon$/, '')}</div>}
      </div>
    ))}
  </div>
);

const renderCategories = (
  categories: Record<string, string[]>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any,
  showLabels: boolean,
) =>
  Object.entries(categories).map(([category, names]) => {
    const entries = resolve(names);
    if (entries.length === 0) return null;
    return (
      <div key={category} style={styles.section}>
        <div style={styles.sectionTitle}>
          {category}
          <span style={styles.count}>({entries.length})</span>
        </div>
        {renderGrid(entries, args, showLabels)}
      </div>
    );
  });

export const Catalog: Story = {
  args: {
    size: 'md',
    weight: 'light',
    mirrored: false,
    withStroke: true,
    color: undefined,
    variant: undefined,
    showLabels: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (args: any) => {
    const showLabels = Boolean(args.showLabels);

    return (
      <div style={styles.page}>
        <div style={styles.summary}>
          Total {ALL_ICONS.length} icons — Tabler {tablerCount} / Custom SVG {customCount}
        </div>

        {/* Tabler group */}
        <div style={styles.groupHeader}>
          <span style={styles.badge('#228be6')}>Tabler</span>
          General-purpose icons
          <span style={styles.count}>({tablerCount})</span>
        </div>
        {renderCategories(TABLER_CATEGORIES, args, showLabels)}

        <div style={styles.divider} />

        {/* Custom SVG group */}
        <div style={styles.groupHeader}>
          <span style={styles.badge('#e8590c')}>Custom SVG</span>
          Domain-specific icons
          <span style={styles.count}>({customCount})</span>
        </div>
        {renderCategories(CUSTOM_CATEGORIES, args, showLabels)}

        {uncategorized.length > 0 && (
          <>
            <div style={styles.divider} />
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                Uncategorized
                <span style={styles.count}>({uncategorized.length})</span>
              </div>
              {renderGrid(uncategorized, args, showLabels)}
            </div>
          </>
        )}
      </div>
    );
  },
};
