import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'SSoT';

const PRODUCT_NAMES: Record<string, string> = {
  'ai-platform': 'AI Platform',
  compute: 'Compute',
  'compute-admin': 'Compute Admin',
  container: 'Container',
  storage: 'Storage',
  iam: 'IAM',
  agent: 'Agent',
  design: 'Design',
  lab: 'Lab',
  cloudbuilder: 'Cloud Builder',
  'cloud-builder': 'Cloud Builder',
  settings: 'Settings',
  desktop: 'Desktop',
  figma: 'Figma',
  chat: 'Chat',
  'mcp-tools': 'MCP Tools',
};

const MENU_LABELS: Record<string, string> = {
  instances: 'Instances',
  create: 'Create',
  volumes: 'Volumes',
  'volume-snapshots': 'Volume Snapshots',
  'volume-backups': 'Volume Backups',
  'volume-types': 'Volume Types',
  networks: 'Networks',
  routers: 'Routers',
  ports: 'Ports',
  'floating-ips': 'Floating IPs',
  'security-groups': 'Security Groups',
  'load-balancers': 'Load Balancers',
  certificates: 'Certificates',
  firewall: 'Firewall',
  'dns-zones': 'DNS Zones',
  'backup-policies': 'Backup Policies',
  'scheduled-tasks': 'Scheduled Tasks',
  topology: 'Topology',
  console: 'Console',
  images: 'Images',
  flavors: 'Flavors',
  'key-pairs': 'Key Pairs',
  'server-groups': 'Server Groups',
  'instance-templates': 'Instance Templates',
  'instance-snapshots': 'Instance Snapshots',
  'host-aggregates': 'Host Aggregates',
  'bare-metal-nodes': 'Bare Metal Nodes',
  'monitor-overview': 'Monitor Overview',
  'physical-nodes': 'Physical Nodes',
  tenants: 'Tenants',
  'metadata-definition': 'Metadata Definitions',
  'qos-specs': 'QoS Specs',
  subnets: 'Subnets',
  listeners: 'Listeners',
  pools: 'Pools',
  'l7-policies': 'L7 Policies',
  firewalls: 'Firewalls',
  'firewall-policies': 'Firewall Policies',
  'firewall-rules': 'Firewall Rules',

  dashboard: 'Dashboard',
  namespaces: 'Namespaces',
  events: 'Events',
  nodes: 'Nodes',
  services: 'Services',
  ingresses: 'Ingresses',
  hpa: 'HPA',
  deployments: 'Deployments',
  statefulsets: 'StatefulSets',
  daemonsets: 'DaemonSets',
  jobs: 'Jobs',
  cronjobs: 'CronJobs',
  pods: 'Pods',
  'persistent-volumes': 'Persistent Volumes',
  pvc: 'PVC',
  'storage-classes': 'Storage Classes',
  configmaps: 'ConfigMaps',
  secrets: 'Secrets',
  'limit-ranges': 'Limit Ranges',
  'resource-quotas': 'Resource Quotas',
  'network-policies': 'Network Policies',
  pdb: 'Pod Disruption Budgets',
  catalog: 'Catalog',
  'installed-apps': 'Installed Apps',
  'cluster-management': 'Cluster Management',

  workloads: 'Workloads',
  'my-templates': 'My Templates',
  explore: 'Explore',
  packages: 'Packages',
  models: 'Models',
  datasets: 'Datasets',
  serverless: 'Serverless',
  'text-generation': 'Text Generation',
  devspace: 'Dev Space',
  'pipeline-builder': 'Pipeline Builder',
  benchmarks: 'Benchmarks',
  kubeflow: 'Kubeflow',
  mlflow: 'MLflow',
  faq: 'FAQ',
  kueue: 'Kueue',
  monitoring: 'Monitoring',
  dependencies: 'Dependencies',
  'system-admin': 'System Admin',

  users: 'Users',
  'user-groups': 'User Groups',
  roles: 'Roles',
  policies: 'Policies',
  'active-sessions': 'Active Sessions',
  domains: 'Domains',
  'system-administrators': 'System Administrators',
  'event-logs': 'Event Logs',
  'mfa-policies': 'MFA Policies',
  'session-policies': 'Session Policies',
  'token-policies': 'Token Policies',
  'login-policies': 'Login Policies',

  hosts: 'Hosts',
  osds: 'OSDs',
  'physical-disks': 'Physical Disks',
  buckets: 'Buckets',
  performance: 'Performance',
  'file-systems': 'File Systems',
  nfs: 'NFS',

  list: 'List',

  general: 'General',
  account: 'Account',
  notifications: 'Notifications',
  information: 'Information',

  deploy: 'Deploy',
  edit: 'Edit',
};

const DESIGN_SECTION_LABELS: Record<string, string> = {
  foundation: 'Foundation',
  components: 'Components',
  patterns: 'Patterns',
  charts: 'Charts',
  policies: 'Policies',
  all: 'All Components',
  changelog: 'Changelog',

  tokens: 'Tokens',
  'primitive-colors': 'Primitive Colors',
  'semantic-colors': 'Semantic Colors',
  typography: 'Typography',
  spacing: 'Spacing',
  borders: 'Borders',
  shadows: 'Shadows',
  transitions: 'Transitions',
  icons: 'Icons',
  'app-icons': 'App Icons',
  'ux-writing': 'UX Writing',
  accessibility: 'Accessibility',
  'error-alert': 'Error & Alert',
  'system-error': 'System Error',

  button: 'Button',
  input: 'Input',
  'text-input': 'Text Input',
  'number-input': 'Number Input',
  textarea: 'Textarea',
  'search-input': 'Search Input',
  'form-field': 'Form Field',
  'filter-search-input': 'Filter Search Input',
  select: 'Select',
  datepicker: 'DatePicker',
  slider: 'Slider',
  toggle: 'Toggle',
  checkbox: 'Checkbox',
  radio: 'Radio',
  password: 'Password',
  'copy-button': 'Copy Button',
  'selection-indicator': 'Selection Indicator',
  table: 'Table',
  badge: 'Badge',
  card: 'Card',
  chip: 'Chip',
  'status-indicator': 'Status Indicator',
  pagination: 'Pagination',
  'file-list-card': 'File List Card',
  'expandable-checklist': 'Expandable Checklist',
  'info-box': 'Info Box',
  'card-title': 'Card Title',
  'list-toolbar': 'List Toolbar',
  'inline-message': 'Inline Message',
  loading: 'Loading',
  'progress-bar': 'Progress Bar',
  skeleton: 'Skeleton',
  spinner: 'Spinner',
  topbar: 'Top Bar',
  tabbar: 'Tab Bar',
  tabs: 'Tabs',
  breadcrumb: 'Breadcrumb',
  tooltip: 'Tooltip',
  popover: 'Popover',
  menu: 'Menu',
  'context-menu': 'Context Menu',
  modal: 'Modal',
  drawer: 'Drawer',
  snackbar: 'Snackbar',
  toast: 'Toast',
  'global-notification-panel': 'Global Notification Panel',
  'floating-card': 'Floating Card',
  disclosure: 'Disclosure',
  'window-control': 'Window Control',
  scrollbar: 'Scrollbar',
  'project-selector': 'Project Selector',
  'detail-header': 'Detail Header',
  editor: 'Editor',
  'section-card': 'Section Card',
  'monitoring-toolbar': 'Monitoring Toolbar',
  'csv-download': 'CSV Download',
  'app-window': 'App Window',
  wizard: 'Wizard',
  'open-form': 'Open Form',
  layout: 'Layout',
  'desktop-grid': 'Desktop Grid',
  'dynamic-form-fields': 'Dynamic Form Fields',
  'list-page': 'List Page',
  'detail-page': 'Detail Page',
  'list-selector': 'List Selector',
  'view-preferences': 'View Preferences',
  'form-field-pattern': 'Form Field Pattern',
  shell: 'Shell',
  'empty-states': 'Empty States',
  overview: 'Overview',
  'status-colors': 'Status Colors',
  'usage-chart': 'Usage Chart',
  'area-chart': 'Area Chart',
  'pie-chart': 'Pie Chart',
};

function buildTitle(pathname: string): string {
  const segments = pathname
    .replace(/^\/|\/$/g, '')
    .split('/')
    .filter(Boolean);

  if (segments.length === 0) return SITE_NAME;

  const product = PRODUCT_NAMES[segments[0]];
  if (!product) return SITE_NAME;

  if (segments.length === 1) return `${SITE_NAME} / ${product}`;

  if (segments[0] === 'design' || segments[0] === 'lab') {
    const lastSegment = segments[segments.length - 1];
    const label = DESIGN_SECTION_LABELS[lastSegment];
    if (label) return `${SITE_NAME} / ${product} - ${label}`;
    return `${SITE_NAME} / ${product}`;
  }

  const isIdSegment = (s: string) => /^[0-9a-f-]{8,}$/i.test(s) || /^\d+$/.test(s);

  const menuSegments = segments
    .slice(1)
    .filter(
      (s) => !isIdSegment(s) && s !== 'create-v2' && s !== 'create-yaml-v2' && s !== 'edit-yaml'
    );

  if (menuSegments.length === 0) return `${SITE_NAME} / ${product}`;

  const lastMenu = menuSegments[menuSegments.length - 1];
  const label =
    MENU_LABELS[lastMenu] ?? lastMenu.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return `${SITE_NAME} / ${product} - ${label}`;
}

export function useDocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = buildTitle(pathname);
  }, [pathname]);
}
