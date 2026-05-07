import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  SearchInput,
  Table,
  Pagination,
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  StatusIndicator,
  ContextMenu,
  SectionCard,
  PageShell,
  DetailHeader,
  ConfirmModal,
  ErrorState,
  Tooltip,
  Badge,
  BadgeList,
  fixedColumns,
  columnMinWidths,
  type TableColumn,
  type ContextMenuItem,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
  IconCirclePlus,
  IconArrowBackUp,
  IconExclamationCircle,
  IconRefresh,
  IconSettings,
  IconSquarePlus,
  IconReload,
  IconCircleX,
  IconCircleMinus,
  IconDotsCircleHorizontal,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { InlineCopyId } from '@/components/InlineCopyId';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface UserDetail {
  id: string;
  username: string;
  displayName: string;
  email: string;
  status: 'online' | 'offline';
  locked?: boolean;
  createdAt: string;
}

interface PolicyRule {
  application: string;
  partition: string;
  resource: string;
  actions: string[];
}

interface Policy {
  id: string;
  name: string;
  policyId: string;
  type: 'Built-in' | 'Custom';
  apps: string[];
  attachment: string;
  createdAt: string;
  rules: PolicyRule[];
}

interface Role {
  id: string;
  name: string;
  source: 'Direct' | 'Group';
  type: 'Built-in' | 'Custom';
  policies: string[];
  description: string;
  members: number;
  createdAt: string;
}

interface AccessKey {
  id: string;
  keyId: string;
  description: string;
  lastUsed: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface Session {
  id: string;
  started: string;
  lastAccess: string;
  ipAddress: string;
  device: string;
}

interface ActiveGrant {
  id: string;
  roleName: string;
  roleId: string;
  starts: string;
  ends: string;
  reason: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockUsersMap: Record<string, UserDetail> = {
  'thaki-kim': {
    id: '1231456789101112',
    username: 'thaki-kim',
    displayName: 'thaki.kim',
    email: 'thaki.kim@example.com',
    status: 'online',
    locked: false,
    createdAt: 'Jul 25, 2026 09:14:33',
  },
  'alex.johnson': {
    id: '2341567890201213',
    username: 'alex.johnson',
    displayName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    status: 'online',
    locked: true,
    createdAt: 'Aug 15, 2026 11:42:18',
  },
  'sara.connor': {
    id: '3451678901301314',
    username: 'sara.connor',
    displayName: 'Sara Connor',
    email: 'sara.connor@example.com',
    status: 'offline',
    createdAt: 'Jul 20, 2026 14:28:45',
  },
  'john.doe': {
    id: '4561789012401415',
    username: 'john.doe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    status: 'offline',
    createdAt: 'Jun 10, 2026 08:35:22',
  },
  'jane.smith': {
    id: '5671890123501516',
    username: 'jane.smith',
    displayName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'online',
    createdAt: 'Jan 5, 2026 10:18:51',
  },
  'mike.wilson': {
    id: '6781901234601617',
    username: 'mike.wilson',
    displayName: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    status: 'offline',
    createdAt: 'Apr 18, 2026 16:52:07',
  },
  'emily.chen': {
    id: '7892012345701718',
    username: 'emily.chen',
    displayName: 'Emily Chen',
    email: 'emily.chen@example.com',
    status: 'online',
    createdAt: 'Mar 22, 2026 13:25:38',
  },
  'david.lee': {
    id: '8903123456801819',
    username: 'david.lee',
    displayName: 'David Lee',
    email: 'david.lee@example.com',
    status: 'online',
    createdAt: 'Feb 14, 2026 09:42:14',
  },
  'lisa.park': {
    id: '9014234567901920',
    username: 'lisa.park',
    displayName: 'Lisa Park',
    email: 'lisa.park@example.com',
    status: 'offline',
    createdAt: 'May 30, 2026 11:18:52',
  },
  'chris.taylor': {
    id: '1025345678002021',
    username: 'chris.taylor',
    displayName: 'Chris Taylor',
    email: 'chris.taylor@example.com',
    status: 'online',
    createdAt: 'Jan 28, 2026 15:33:27',
  },
};

const mockPolicies: Policy[] = [
  {
    id: 'p-001',
    name: 'ComputeFullAccess',
    policyId: 'ID 12345678',
    type: 'Built-in',
    apps: ['compute', 'network', 'storage'],
    attachment: 'Direct',
    createdAt: 'Sep 12, 2026',
    rules: [
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'AI_server',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Container',
        partition: 'clusterA',
        resource: 'All(*)',
        actions: ['Read', 'List', 'Write'],
      },
      {
        application: 'IAM',
        partition: '-',
        resource: 'All(*)',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      { application: 'Storage', partition: '-', resource: 'Host', actions: ['Read'] },
    ],
  },
  {
    id: 'p-002',
    name: 'NetworkReadOnly',
    policyId: 'ID 23456789',
    type: 'Built-in',
    apps: ['network'],
    attachment: 'Direct',
    createdAt: 'Aug 20, 2026',
    rules: [
      {
        application: 'Network',
        partition: 'tenantA',
        resource: 'All(*)',
        actions: ['Read', 'List'],
      },
    ],
  },
  {
    id: 'p-003',
    name: 'StorageAdmin',
    policyId: 'ID 34567890',
    type: 'Custom',
    apps: ['storage', 'compute'],
    attachment: 'Direct',
    createdAt: 'Jul 15, 2026',
    rules: [
      {
        application: 'Storage',
        partition: 'tenantA',
        resource: 'All(*)',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'Volume',
        actions: ['Read', 'List'],
      },
    ],
  },
  {
    id: 'p-004',
    name: 'IAMUserManagement',
    policyId: 'ID 45678901',
    type: 'Built-in',
    apps: ['iam'],
    attachment: 'Group:dev-admin-group',
    createdAt: 'Jun 10, 2026',
    rules: [
      {
        application: 'IAM',
        partition: '-',
        resource: 'User',
        actions: ['Read', 'List', 'Write', 'Delete'],
      },
      { application: 'IAM', partition: '-', resource: 'Group', actions: ['Read', 'List'] },
    ],
  },
  {
    id: 'p-005',
    name: 'ContainerFullAccess',
    policyId: 'ID 56789012',
    type: 'Built-in',
    apps: ['container', 'compute', 'network'],
    attachment: 'Direct',
    createdAt: 'May 5, 2026',
    rules: [
      {
        application: 'Container',
        partition: 'clusterA',
        resource: 'All(*)',
        actions: ['Read', 'List', 'Write', 'Delete', 'Admin'],
      },
      {
        application: 'Compute',
        partition: 'tenantA',
        resource: 'Instance',
        actions: ['Read', 'List'],
      },
      { application: 'Network', partition: 'tenantA', resource: 'All(*)', actions: ['Read'] },
    ],
  },
  {
    id: 'p-006',
    name: 'MonitoringViewer',
    policyId: 'ID 67890123',
    type: 'Custom',
    apps: ['compute'],
    attachment: 'Group:ops-team',
    createdAt: 'Apr 1, 2026',
    rules: [
      { application: 'Compute', partition: '-', resource: 'All(*)', actions: ['Read', 'List'] },
    ],
  },
];

const mockAccessKeys: AccessKey[] = [
  {
    id: 'ak-001',
    keyId: 'AKIA112AK3IALQI2',
    description: '-',
    lastUsed: 'Sep 12, 2026 14:35:22 (UTC+9)',
    createdAt: 'Sep 12, 2026 08:22:15 (UTC+9)',
    status: 'active',
  },
];

const mockSessions: Session[] = [
  {
    id: 's-001',
    started: 'Nov 4, 2026',
    lastAccess: 'Nov 4, 2026',
    ipAddress: '10.2.40.25',
    device: 'Chrome/Mac OS',
  },
  {
    id: 's-002',
    started: 'Nov 3, 2026',
    lastAccess: 'Nov 3, 2026',
    ipAddress: '192.168.1.100',
    device: 'Firefox/Windows',
  },
  {
    id: 's-003',
    started: 'Nov 2, 2026',
    lastAccess: 'Nov 2, 2026',
    ipAddress: '10.2.40.30',
    device: 'Safari/iOS',
  },
  {
    id: 's-004',
    started: 'Nov 1, 2026',
    lastAccess: 'Nov 1, 2026',
    ipAddress: '172.16.0.50',
    device: 'Edge/Windows',
  },
  {
    id: 's-005',
    started: 'Oct 31, 2026',
    lastAccess: 'Oct 31, 2026',
    ipAddress: '10.2.40.45',
    device: 'Chrome/Linux',
  },
  {
    id: 's-006',
    started: 'Oct 30, 2026',
    lastAccess: 'Oct 30, 2026',
    ipAddress: '192.168.2.75',
    device: 'Firefox/Mac OS',
  },
  {
    id: 's-007',
    started: 'Oct 29, 2026',
    lastAccess: 'Oct 29, 2026',
    ipAddress: '10.2.40.60',
    device: 'Safari/Mac OS',
  },
  {
    id: 's-008',
    started: 'Oct 28, 2026',
    lastAccess: 'Oct 28, 2026',
    ipAddress: '172.16.0.80',
    device: 'Chrome/Android',
  },
  {
    id: 's-009',
    started: 'Oct 27, 2026',
    lastAccess: 'Oct 27, 2026',
    ipAddress: '10.2.40.70',
    device: 'Firefox/Linux',
  },
  {
    id: 's-010',
    started: 'Oct 26, 2026',
    lastAccess: 'Oct 26, 2026',
    ipAddress: '192.168.3.90',
    device: 'Edge/Mac OS',
  },
  {
    id: 's-011',
    started: 'Oct 25, 2026',
    lastAccess: 'Oct 25, 2026',
    ipAddress: '10.2.40.85',
    device: 'Chrome/Windows',
  },
  {
    id: 's-012',
    started: 'Oct 24, 2026',
    lastAccess: 'Oct 24, 2026',
    ipAddress: '172.16.0.100',
    device: 'Safari/iOS',
  },
  {
    id: 's-013',
    started: 'Oct 23, 2026',
    lastAccess: 'Oct 23, 2026',
    ipAddress: '10.2.40.95',
    device: 'Firefox/Windows',
  },
  {
    id: 's-014',
    started: 'Oct 22, 2026',
    lastAccess: 'Oct 22, 2026',
    ipAddress: '192.168.4.110',
    device: 'Chrome/Linux',
  },
  {
    id: 's-015',
    started: 'Oct 21, 2026',
    lastAccess: 'Oct 21, 2026',
    ipAddress: '10.2.40.105',
    device: 'Edge/Windows',
  },
  {
    id: 's-016',
    started: 'Oct 20, 2026',
    lastAccess: 'Oct 20, 2026',
    ipAddress: '172.16.0.120',
    device: 'Safari/Mac OS',
  },
];

const mockActiveGrants: ActiveGrant[] = [
  {
    id: 'ag-001',
    roleName: 'incident-responder',
    roleId: 'r-101',
    starts: 'Apr 20, 2026 09:00:00 (UTC+9)',
    ends: 'Apr 27, 2026 09:00:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-002',
    roleName: 'emergency-admin',
    roleId: 'r-102',
    starts: 'Apr 19, 2026 14:30:00 (UTC+9)',
    ends: 'Apr 26, 2026 14:30:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-003',
    roleName: 'compute-operator',
    roleId: 'r-103',
    starts: 'Apr 18, 2026 10:15:00 (UTC+9)',
    ends: 'Apr 25, 2026 10:15:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-004',
    roleName: 'network-debug',
    roleId: 'r-104',
    starts: 'Apr 17, 2026 08:45:00 (UTC+9)',
    ends: 'Apr 24, 2026 08:45:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-005',
    roleName: 'storage-recovery',
    roleId: 'r-105',
    starts: 'Apr 16, 2026 16:00:00 (UTC+9)',
    ends: 'Apr 23, 2026 16:00:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-006',
    roleName: 'security-audit',
    roleId: 'r-106',
    starts: 'Apr 15, 2026 11:30:00 (UTC+9)',
    ends: 'Apr 22, 2026 11:30:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-007',
    roleName: 'db-maintenance',
    roleId: 'r-107',
    starts: 'Apr 14, 2026 07:00:00 (UTC+9)',
    ends: 'Apr 21, 2026 07:00:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-008',
    roleName: 'monitoring-admin',
    roleId: 'r-108',
    starts: 'Apr 13, 2026 13:15:00 (UTC+9)',
    ends: 'Apr 20, 2026 13:15:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-009',
    roleName: 'container-debug',
    roleId: 'r-109',
    starts: 'Apr 12, 2026 09:45:00 (UTC+9)',
    ends: 'Apr 19, 2026 09:45:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-010',
    roleName: 'iam-escalation',
    roleId: 'r-110',
    starts: 'Apr 11, 2026 15:00:00 (UTC+9)',
    ends: 'Apr 18, 2026 15:00:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-011',
    roleName: 'backup-restore',
    roleId: 'r-111',
    starts: 'Apr 10, 2026 10:30:00 (UTC+9)',
    ends: 'Apr 17, 2026 10:30:00 (UTC+9)',
    reason: 'Incident response',
  },
  {
    id: 'ag-012',
    roleName: 'log-investigator',
    roleId: 'r-112',
    starts: 'Apr 09, 2026 08:00:00 (UTC+9)',
    ends: 'Apr 16, 2026 08:00:00 (UTC+9)',
    reason: 'Incident response',
  },
];

const mockRoles: Role[] = [
  {
    id: 'r-001',
    name: 'viewer',
    source: 'Direct',
    type: 'Built-in',
    policies: ['Compute:tenantA', 'Network:tenantB', 'Storage:tenantA'],
    description: 'Read-only access to basic resources',
    members: 12,
    createdAt: 'Sep 12, 2026 09:22:18',
  },
  {
    id: 'r-002',
    name: 'compute-admin',
    source: 'Group',
    type: 'Built-in',
    policies: [
      'Compute:tenantA',
      'Network:tenantA',
      'IAM:global',
      'Storage:tenantB',
      'Container:clusterA',
      'Monitoring:global',
    ],
    description: 'Full access to compute resources',
    members: 5,
    createdAt: 'Aug 20, 2026 11:35:42',
  },
  {
    id: 'r-003',
    name: 'storage-viewer',
    source: 'Direct',
    type: 'Custom',
    policies: ['Storage:tenantA'],
    description: 'Read-only access to storage',
    members: 8,
    createdAt: 'Jul 15, 2026 14:48:27',
  },
  {
    id: 'r-004',
    name: 'network-admin',
    source: 'Group',
    type: 'Built-in',
    policies: ['Network:tenantA', 'Network:tenantB', 'Compute:tenantA', 'IAM:global'],
    description: 'Full access to network resources',
    members: 3,
    createdAt: 'Jun 10, 2026 08:52:15',
  },
  {
    id: 'r-005',
    name: 'iam-reader',
    source: 'Direct',
    type: 'Built-in',
    policies: ['IAM:global', 'Compute:tenantA'],
    description: 'Read-only access to IAM',
    members: 15,
    createdAt: 'May 5, 2026 16:18:33',
  },
  {
    id: 'r-006',
    name: 'security-auditor',
    source: 'Direct',
    type: 'Custom',
    policies: ['IAM:global', 'Compute:tenantA', 'Network:tenantA'],
    description: 'Security audit and compliance',
    members: 2,
    createdAt: 'Apr 1, 2026 10:25:48',
  },
  {
    id: 'r-007',
    name: 'billing-viewer',
    source: 'Group',
    type: 'Built-in',
    policies: ['Billing:global'],
    description: 'Read-only access to billing',
    members: 7,
    createdAt: 'Mar 15, 2026 13:42:19',
  },
  {
    id: 'r-008',
    name: 'developer',
    source: 'Direct',
    type: 'Custom',
    policies: [
      'Compute:tenantA',
      'Container:clusterA',
      'Storage:tenantA',
      'Network:tenantA',
      'Monitoring:global',
    ],
    description: 'Development environment access',
    members: 22,
    createdAt: 'Feb 20, 2026 09:55:32',
  },
  {
    id: 'r-009',
    name: 'operator',
    source: 'Group',
    type: 'Built-in',
    policies: ['Compute:tenantA', 'Storage:tenantA', 'Network:tenantA'],
    description: 'Operational management access',
    members: 6,
    createdAt: 'Jan 10, 2026 15:28:44',
  },
  {
    id: 'r-010',
    name: 'support',
    source: 'Direct',
    type: 'Custom',
    policies: ['IAM:global', 'Compute:tenantA'],
    description: 'Customer support access',
    members: 10,
    createdAt: 'Dec 5, 2026 11:12:27',
  },
  {
    id: 'r-011',
    name: 'data-analyst',
    source: 'Direct',
    type: 'Built-in',
    policies: ['Storage:tenantA', 'Compute:tenantA', 'Container:clusterA', 'Monitoring:global'],
    description: 'Data analysis and reporting',
    members: 4,
    createdAt: 'Nov 20, 2026 08:35:51',
  },
  {
    id: 'r-012',
    name: 'db-admin',
    source: 'Group',
    type: 'Custom',
    policies: [
      'Storage:tenantA',
      'Storage:tenantB',
      'Compute:tenantA',
      'Backup:global',
      'Monitoring:global',
    ],
    description: 'Database administration',
    members: 3,
    createdAt: 'Oct 15, 2026 14:22:38',
  },
  {
    id: 'r-013',
    name: 'container-admin',
    source: 'Direct',
    type: 'Built-in',
    policies: ['Container:clusterA'],
    description: 'Full access to container resources',
    members: 9,
    createdAt: 'Sep 10, 2026 10:48:15',
  },
  {
    id: 'r-014',
    name: 'monitoring-viewer',
    source: 'Group',
    type: 'Built-in',
    policies: ['Monitoring:global', 'Compute:tenantA', 'Container:clusterA'],
    description: 'Read-only access to monitoring',
    members: 11,
    createdAt: 'Aug 5, 2026 16:35:42',
  },
  {
    id: 'r-015',
    name: 'log-analyst',
    source: 'Direct',
    type: 'Custom',
    policies: ['Monitoring:global', 'Storage:tenantA'],
    description: 'Log analysis and search',
    members: 5,
    createdAt: 'Jul 1, 2026 09:18:55',
  },
  {
    id: 'r-016',
    name: 'backup-operator',
    source: 'Group',
    type: 'Built-in',
    policies: ['Backup:global', 'Storage:tenantA', 'Compute:tenantA'],
    description: 'Backup and restore operations',
    members: 4,
    createdAt: 'Jun 15, 2026 12:42:18',
  },
];

/* ----------------------------------------
   IAM User Detail Page
   ---------------------------------------- */

export function IAMUserDetailPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDetailTab = searchParams.get('tab') || 'user-groups';
  const setActiveDetailTab = (tab: string) => setSearchParams({ tab }, { replace: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesSearchQuery, setRolesSearchQuery] = useState('');
  const [rolesCurrentPage, setRolesCurrentPage] = useState(1);
  const [sessionsSearchQuery, setSessionsSearchQuery] = useState('');
  const [grantsSearchQuery, setGrantsSearchQuery] = useState('');
  const [grantsCurrentPage, setGrantsCurrentPage] = useState(1);
  const [selectedGrants, setSelectedGrants] = useState<string[]>([]);
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [expandedPolicies, setExpandedPolicies] = useState<Set<string>>(new Set());

  // Get user data based on URL username
  const user: UserDetail | null = username ? (mockUsersMap[username] ?? null) : null;

  // Global tab management
  const { tabs, activeTabId, closeTab, selectTab, addNewTab, updateActiveTabLabel, moveTab } =
    useTabs();

  // Update tab label to username
  useEffect(() => {
    if (user) {
      updateActiveTabLabel(user.username);
    }
  }, [user, updateActiveTabLabel]);

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  if (!user) {
    return (
      <PageShell
        sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
        sidebarWidth={sidebarWidth}
        tabBar={
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={selectTab}
            onTabClose={closeTab}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
          />
        }
        topBar={
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => navigate(-1)}
            onForward={() => navigate(1)}
            breadcrumb={
              <Breadcrumb
                items={[{ label: 'Users', href: '/iam/users' }, { label: username ?? 'User' }]}
              />
            }
          />
        }
        contentClassName="pt-4 px-8 pb-6"
      >
        <ErrorState
          icon={<IconAlertTriangle size={16} strokeWidth={1.5} />}
          title="User not found"
          description={`The user "${username ?? ''}" does not exist.`}
          action={
            <Button variant="secondary" size="md" onClick={() => navigate('/iam/users')}>
              Back to Users
            </Button>
          }
        />
      </PageShell>
    );
  }

  // Breadcrumb items
  const breadcrumbItems = [{ label: 'Users', href: '/iam/users' }, { label: user.username }];

  // Filter policies by search query
  const filteredPolicies = mockPolicies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.policyId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Policies pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const paginatedPolicies = filteredPolicies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter roles by search query
  const filteredRoles = mockRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(rolesSearchQuery.toLowerCase()) ||
      role.source.toLowerCase().includes(rolesSearchQuery.toLowerCase()) ||
      role.policies.some((p) => p.toLowerCase().includes(rolesSearchQuery.toLowerCase()))
  );

  // Roles pagination
  const rolesTotalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (rolesCurrentPage - 1) * itemsPerPage,
    rolesCurrentPage * itemsPerPage
  );

  // Filter sessions by search query
  const filteredSessions = mockSessions.filter(
    (session) =>
      session.ipAddress.toLowerCase().includes(sessionsSearchQuery.toLowerCase()) ||
      session.device.toLowerCase().includes(sessionsSearchQuery.toLowerCase())
  );

  // Sessions pagination
  const sessionsTotalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (sessionsCurrentPage - 1) * itemsPerPage,
    sessionsCurrentPage * itemsPerPage
  );

  // Filter active grants by search query
  const filteredGrants = mockActiveGrants.filter(
    (grant) =>
      grant.roleName.toLowerCase().includes(grantsSearchQuery.toLowerCase()) ||
      grant.reason.toLowerCase().includes(grantsSearchQuery.toLowerCase())
  );

  // Grants pagination
  const grantsTotalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const paginatedGrants = filteredGrants.slice(
    (grantsCurrentPage - 1) * itemsPerPage,
    grantsCurrentPage * itemsPerPage
  );

  // Check if user account is locked
  const isUserLocked = user.locked === true;

  const togglePolicyExpand = (policyId: string) => {
    setExpandedPolicies((prev) => {
      const next = new Set(prev);
      if (next.has(policyId)) next.delete(policyId);
      else next.add(policyId);
      return next;
    });
  };

  // Context menu items factory functions (to include row-specific onClick handlers)
  const getPolicyContextMenuItems = (rowId: string): ContextMenuItem[] => [
    {
      id: 'detach',
      label: 'Detach',
      status: isUserLocked ? undefined : 'danger',
      disabled: isUserLocked,
      onClick: () => console.log('Detach policy', rowId),
    },
  ];

  const getRoleContextMenuItems = (rowId: string): ContextMenuItem[] => [
    {
      id: 'detach',
      label: 'Detach',
      status: isUserLocked ? undefined : 'danger',
      disabled: isUserLocked,
      onClick: () => console.log('Detach role', rowId),
    },
  ];

  const getAccessKeyContextMenuItems = (rowId: string): ContextMenuItem[] => [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit', rowId) },
    { id: 'reset', label: 'Reset', onClick: () => console.log('Reset', rowId) },
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      divider: true,
      onClick: () => console.log('Delete', rowId),
    },
  ];

  const getSessionContextMenuItems = (rowId: string): ContextMenuItem[] => [
    {
      id: 'terminate',
      label: 'Terminate',
      status: 'danger',
      onClick: () => console.log('Terminate', rowId),
    },
  ];

  // Table columns for sessions
  const sessionColumns: TableColumn<Session>[] = [
    {
      key: 'started',
      label: 'Started',
      flex: 1,
      minWidth: columnMinWidths.started,
      sortable: true,
    },
    {
      key: 'lastAccess',
      label: 'Last access',
      flex: 1,
      minWidth: columnMinWidths.lastAccess,
      sortable: true,
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      flex: 1,
      minWidth: columnMinWidths.ipAddress,
      sortable: true,
    },
    {
      key: 'device',
      label: 'Device',
      flex: 1,
      minWidth: columnMinWidths.device,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu items={getSessionContextMenuItems(row.id)} trigger="click" align="right">
          <button
            aria-label="Row actions"
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Context menu for active grants
  const getGrantContextMenuItems = (rowId: string): ContextMenuItem[] => [
    {
      id: 'revoke',
      label: 'Revoke',
      status: 'danger',
      onClick: () => console.log('Revoke', rowId),
    },
  ];

  // Table columns for active grants
  const grantColumns: TableColumn<ActiveGrant>[] = [
    {
      key: 'roleName',
      label: 'Role name',
      flex: 1,
      minWidth: 180,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/iam/roles/${row.roleName}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline"
          >
            {row.roleName}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)]">
            <span className="truncate">ID: {row.roleId}</span>
            <InlineCopyId value={row.roleId} />
          </span>
        </div>
      ),
    },
    {
      key: 'starts',
      label: 'Starts',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'ends',
      label: 'Ends',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string, row) => (
        <span className="flex items-center gap-1">
          <span>{value}</span>
          {row.id === 'ag-001' && (
            <Tooltip content="Expires soon">
              <IconExclamationCircle
                size={14}
                className="text-[var(--color-state-warning)] shrink-0"
              />
            </Tooltip>
          )}
        </span>
      ),
    },
    {
      key: 'reason',
      label: 'Reason',
      flex: 1,
      minWidth: 140,
      sortable: true,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu items={getGrantContextMenuItems(row.id)} trigger="click" align="right">
          <button
            aria-label="Row actions"
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Table columns for access keys
  const accessKeyColumns: TableColumn<AccessKey>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.status,
      align: 'center',
      render: (value) => (
        <StatusIndicator
          layout="icon-only"
          status={value === 'active' ? 'active' : 'deactivated'}
        />
      ),
    },
    {
      key: 'keyId',
      label: 'Key ID',
      flex: 1,
      minWidth: columnMinWidths.keyId,
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: columnMinWidths.description,
      sortable: true,
    },
    {
      key: 'lastUsed',
      label: 'Last used',
      flex: 1,
      minWidth: columnMinWidths.lastUsed,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu items={getAccessKeyContextMenuItems(row.id)} trigger="click" align="right">
          <button
            aria-label="Row actions"
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Table columns for roles
  const roleColumns: TableColumn<Role>[] = [
    {
      key: 'name',
      label: 'User group name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_value, row) => (
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/iam/roles/${row.name}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline"
          >
            {row.name}
          </Link>
          <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)]">
            <span className="truncate">ID: {row.id}</span>
            <InlineCopyId value={row.id} />
          </span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: columnMinWidths.typeLg,
      render: (value: string) => (
        <Badge theme="white" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'policies',
      label: 'Policies',
      flex: 1,
      minWidth: columnMinWidths.policies,
      render: (value: string[]) => (
        <BadgeList
          items={value}
          maxVisible={1}
          maxBadgeWidth="140px"
          popoverTitle={`All Policies (${value.length})`}
          overflowAlign="right"
          popoverMaxWidth="160px"
        />
      ),
    },
    {
      key: 'description',
      label: 'Description',
      flex: 1,
      minWidth: 180,
      sortable: true,
    },
    {
      key: 'members',
      label: 'Members',
      flex: 0.5,
      minWidth: 100,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
      render: (value: string) => value?.replace(/\s+\d{2}:\d{2}:\d{2}$/, ''),
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      sticky: 'right',
      render: (_value, row) => (
        <ContextMenu items={getRoleContextMenuItems(row.id)} trigger="click" align="right">
          <button
            aria-label="Row actions"
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // Table columns for policies
  const policyColumns: TableColumn<Policy>[] = [
    {
      key: 'name',
      label: 'Name',
      flex: 1,
      minWidth: columnMinWidths.name,
      sortable: true,
      render: (_value, row) => {
        const isExpanded = expandedPolicies.has(row.id);
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePolicyExpand(row.id);
              }}
              className="shrink-0 flex items-center justify-center w-4 h-4 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-transform"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <IconChevronDown size={14} stroke={1.5} />
              ) : (
                <IconChevronRight size={14} stroke={1.5} />
              )}
            </button>
            <div className="flex flex-col gap-0.5 min-w-0">
              <Link
                to={`/iam/policies/${row.id}`}
                className="text-[var(--color-action-primary)] font-medium hover:underline"
              >
                {row.name}
              </Link>
              <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-subtle)]">
                <span className="truncate">{row.policyId}</span>
                <InlineCopyId value={row.policyId} />
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      flex: 1,
      minWidth: 100,
    },
    {
      key: 'apps',
      label: 'Apps',
      flex: 1,
      minWidth: 160,
      render: (value: string[]) => (
        <BadgeList
          items={value}
          maxVisible={1}
          maxBadgeWidth="100px"
          popoverTitle={`All Apps (${value.length})`}
          overflowAlign="right"
          popoverMaxWidth="160px"
        />
      ),
    },
    {
      key: 'attachment',
      label: 'Attachment',
      flex: 1,
      minWidth: 140,
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Created at',
      flex: 1,
      minWidth: columnMinWidths.createdAt,
      sortable: true,
    },
    {
      key: 'id',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_value, row) => (
        <ContextMenu items={getPolicyContextMenuItems(row.id)} trigger="click" align="right">
          <button
            aria-label="Row actions"
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-transparent hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-border-subtle)] transition-colors cursor-pointer"
          >
            <IconDotsCircleHorizontal
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)]"
            />
          </button>
        </ContextMenu>
      ),
    },
  ];

  return (
    <PageShell
      sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton={true}
          showWindowControls={true}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        <DetailHeader>
          <DetailHeader.Title>{user.username}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconSettings size={12} />}
              onClick={() => console.log('Manage user groups', user.username)}
            >
              Manage user groups
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconReload size={12} />}
              onClick={() => console.log('Reset password', user.username)}
            >
              Reset password
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={12} stroke={1.5} />}
              onClick={() => console.log('Edit user', user.username)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconTrash size={12} stroke={1.5} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              status={user.status === 'online' ? 'active' : 'deactivated'}
              value={user.status === 'online' ? 'Active' : 'Deactivated'}
            />
            <DetailHeader.InfoCard label="ID" value={user.id} copyable />
            <DetailHeader.InfoCard label="Display name" value={user.displayName} />
            <DetailHeader.InfoCard label="Email address" value={user.email} />
            <DetailHeader.InfoCard label="Created at" value={user.createdAt} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* Tabs Section */}
        <div className="w-full">
          <Tabs value={activeDetailTab} onChange={setActiveDetailTab} variant="underline" size="sm">
            <TabList>
              <Tab value="user-groups">Policies</Tab>
              <Tab value="roles">Groups</Tab>
              <Tab value="security-credentials">Security credentials</Tab>
              <Tab value="sessions">Sessions</Tab>
              <Tab value="active-grants">Active grants</Tab>
            </TabList>

            {/* User groups Tab */}
            <TabPanel value="user-groups" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <HStack justify="between" align="center" className="w-full">
                  <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    Policies
                  </h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconSquarePlus size={12} />}
                    onClick={() => console.log('Attach policies', user.username)}
                  >
                    Attach policies
                  </Button>
                </HStack>

                {/* Search */}
                <SearchInput
                  placeholder="Search policies by attributes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  className="w-[var(--search-input-width)]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredPolicies.length}
                  onPageChange={setCurrentPage}
                />

                {/* Table */}
                <Table<Policy>
                  columns={policyColumns}
                  data={paginatedPolicies}
                  rowKey="id"
                  emptyMessage="No policies found"
                  expandedContent={(row) => {
                    if (!expandedPolicies.has(row.id)) return null;
                    const rulesData = row.rules.map((rule, i) => ({
                      id: `${row.id}-rule-${i}`,
                      index: i + 1,
                      ...rule,
                    }));
                    const ruleColumns: TableColumn<(typeof rulesData)[number]>[] = [
                      { key: 'index', label: '#', width: '40px' },
                      { key: 'application', label: 'Application', flex: 1, minWidth: 120 },
                      { key: 'partition', label: 'Partition', flex: 1, minWidth: 120 },
                      { key: 'resource', label: 'Resource', flex: 1, minWidth: 120 },
                      {
                        key: 'actions',
                        label: 'Action',
                        flex: 1,
                        minWidth: 160,
                        render: (value: string[]) => (
                          <BadgeList
                            items={value}
                            maxVisible={1}
                            theme="white"
                            popoverTitle={`All Actions (${value.length})`}
                            overflowAlign="right"
                          />
                        ),
                      },
                    ];
                    return (
                      <div className="px-4 py-3 w-full">
                        <Table columns={ruleColumns} data={rulesData} rowKey="id" />
                      </div>
                    );
                  }}
                />
              </VStack>
            </TabPanel>

            {/* Roles Tab */}
            <TabPanel value="roles" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <HStack justify="between" align="center" className="w-full">
                  <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    User groups
                  </h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconSettings size={12} />}
                    onClick={() => console.log('Manage user groups', user.username)}
                  >
                    Manage user groups
                  </Button>
                </HStack>

                {/* Search */}
                <SearchInput
                  placeholder="Search roles by attributes"
                  value={rolesSearchQuery}
                  onChange={(e) => setRolesSearchQuery(e.target.value)}
                  onClear={() => setRolesSearchQuery('')}
                  className="w-[var(--search-input-width)]"
                />

                {/* Pagination */}
                <Pagination
                  currentPage={rolesCurrentPage}
                  totalPages={rolesTotalPages}
                  totalItems={filteredRoles.length}
                  onPageChange={setRolesCurrentPage}
                />

                {/* Table */}
                <Table<Role>
                  columns={roleColumns}
                  data={paginatedRoles}
                  rowKey="id"
                  emptyMessage="No roles found"
                />
              </VStack>
            </TabPanel>

            {/* Security Credentials Tab */}
            <TabPanel value="security-credentials" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Password Section */}
                <SectionCard>
                  <SectionCard.Header
                    title="Password"
                    actions={
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconReload size={12} />}
                        onClick={() => console.log('Reset password (section)', user.username)}
                      >
                        Reset password
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Last updated at">
                      <span className="flex items-center gap-2">
                        <span>Nov 11, 2026 14:22:43 (UTC+9)</span>
                        <Badge theme="white" size="sm">
                          Updated by user
                        </Badge>
                      </span>
                    </SectionCard.DataRow>
                  </SectionCard.Content>
                </SectionCard>

                {/* OTP MFA Section */}
                <SectionCard>
                  <SectionCard.Header
                    title="OTP MFA"
                    actions={
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<IconCircleMinus size={12} />}
                        onClick={() => console.log('Remove OTP MFA', user.username)}
                      >
                        Remove
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Last used" value="Nov 11, 2026 14:22:43 (UTC+9)" />
                    <SectionCard.DataRow label="Created at" value="Nov 11, 2026 14:22:43 (UTC+9)" />
                  </SectionCard.Content>
                </SectionCard>

                {/* Access Keys Section */}
                <SectionCard>
                  <SectionCard.Header
                    title={`Access keys (${mockAccessKeys.length}/2)`}
                    actions={
                      <Button variant="secondary" size="sm" leftIcon={<IconCirclePlus size={12} />}>
                        Create access key
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <Table<AccessKey>
                      columns={accessKeyColumns}
                      data={mockAccessKeys}
                      rowKey="id"
                    />
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            {/* Sessions Tab */}
            <TabPanel value="sessions" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Section Header */}
                <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                  Sessions
                </h2>

                {/* Action Bar */}
                <div className="flex items-center gap-2">
                  <SearchInput
                    placeholder="Search session by attributes"
                    value={sessionsSearchQuery}
                    onChange={(e) => setSessionsSearchQuery(e.target.value)}
                    onClear={() => setSessionsSearchQuery('')}
                    className="w-[var(--search-input-width)]"
                  />
                  <div className="w-px h-4 bg-[var(--color-border-default)]" />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconRefresh size={12} stroke={1.5} />}
                      onClick={() => console.log('Refresh sessions', user.username)}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<IconCircleX size={12} />}
                      onClick={() => console.log('Terminate all sessions', user.username)}
                    >
                      Terminate all sessions
                    </Button>
                  </div>
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={sessionsCurrentPage}
                  totalPages={sessionsTotalPages}
                  totalItems={filteredSessions.length}
                  onPageChange={setSessionsCurrentPage}
                />

                {/* Table */}
                <Table<Session>
                  columns={sessionColumns}
                  data={paginatedSessions}
                  rowKey="id"
                  emptyMessage="No sessions found"
                />
              </VStack>
            </TabPanel>

            {/* Active Grants Tab */}
            <TabPanel value="active-grants" className="pt-0">
              <VStack gap={4} className="pt-4">
                <HStack justify="between" align="center" className="w-full">
                  <h2 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
                    Active grants
                  </h2>
                </HStack>

                <HStack gap={2} align="center">
                  <SearchInput
                    value={grantsSearchQuery}
                    onChange={(e) => {
                      setGrantsSearchQuery(e.target.value);
                      setGrantsCurrentPage(1);
                    }}
                    placeholder="Search roles by attributes"
                    size="sm"
                    className="w-[var(--search-input-width)]"
                  />
                  <div className="w-px h-4 bg-[var(--color-border-default)]" />
                  <Button
                    variant="muted"
                    size="sm"
                    leftIcon={<IconArrowBackUp size={12} />}
                    disabled={selectedGrants.length === 0}
                  >
                    Revoke
                  </Button>
                </HStack>

                <Pagination
                  currentPage={grantsCurrentPage}
                  totalPages={grantsTotalPages}
                  onPageChange={setGrantsCurrentPage}
                  totalItems={filteredGrants.length}
                  selectedCount={selectedGrants.length}
                />

                <Table<ActiveGrant>
                  columns={grantColumns}
                  data={paginatedGrants}
                  rowKey="id"
                  selectable
                  selectedKeys={selectedGrants}
                  onSelectionChange={setSelectedGrants}
                  emptyMessage="No active grants found"
                />
              </VStack>
            </TabPanel>
          </Tabs>
        </div>
      </VStack>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete user"
        description="Removing this user is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          setIsDeleteOpen(false);
          navigate('/iam/users');
        }}
      />
    </PageShell>
  );
}

export default IAMUserDetailPage;
