import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Table,
  Button,
  SectionCard,
  SearchInput,
  Pagination,
  Chip,
  type TableColumn,
} from '@/design-system';
import { IAMSidebar } from '@/components/IAMSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBell,
  IconSearch,
  IconUserPlus,
  IconShieldPlus,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface UserRow {
  id: string;
  username: string;
  email: string;
  groups: string[];
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Pending';
  mfaEnabled: boolean;
}

interface RoleRow {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  createdAt: string;
}

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const usersData: UserRow[] = [
  { id: '1', username: 'admin', email: 'admin@thaki.cloud', groups: ['Administrators'], lastLogin: '2025-01-09 10:30', status: 'Active', mfaEnabled: true },
  { id: '2', username: 'john.doe', email: 'john.doe@thaki.cloud', groups: ['Developers', 'DevOps'], lastLogin: '2025-01-09 09:15', status: 'Active', mfaEnabled: true },
  { id: '3', username: 'jane.smith', email: 'jane.smith@thaki.cloud', groups: ['Developers'], lastLogin: '2025-01-08 16:45', status: 'Active', mfaEnabled: false },
  { id: '4', username: 'bob.wilson', email: 'bob.wilson@thaki.cloud', groups: ['Viewers'], lastLogin: '2025-01-07 11:20', status: 'Active', mfaEnabled: false },
  { id: '5', username: 'alice.johnson', email: 'alice.johnson@thaki.cloud', groups: ['DevOps'], lastLogin: '2025-01-06 14:00', status: 'Inactive', mfaEnabled: true },
  { id: '6', username: 'new.user', email: 'new.user@thaki.cloud', groups: [], lastLogin: '-', status: 'Pending', mfaEnabled: false },
];

const rolesData: RoleRow[] = [
  { id: '1', name: 'Administrator', description: 'Full access to all resources', usersCount: 3, createdAt: '2025-01-01' },
  { id: '2', name: 'Developer', description: 'Access to development resources', usersCount: 12, createdAt: '2025-01-01' },
  { id: '3', name: 'Viewer', description: 'Read-only access', usersCount: 8, createdAt: '2025-01-01' },
  { id: '4', name: 'DevOps Engineer', description: 'Infrastructure and deployment access', usersCount: 5, createdAt: '2025-01-02' },
  { id: '5', name: 'Security Auditor', description: 'Security and compliance access', usersCount: 2, createdAt: '2025-01-03' },
];

/* ----------------------------------------
   IAM Home Page
   ---------------------------------------- */

export function IAMHomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usersPage, setUsersPage] = useState(1);
  const [rolesPage, setRolesPage] = useState(1);
  const navigate = useNavigate();
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, updateActiveTabLabel, moveTab } = useTabs();

  // Update tab label on mount
  useEffect(() => {
    updateActiveTabLabel('IAM Home');
  }, [updateActiveTabLabel]);

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 200 : 0;

  // User table columns
  const userColumns: TableColumn<UserRow>[] = [
    { 
      key: 'username', 
      label: 'Username', 
      flex: 1, 
      sortable: true,
      render: (value: string) => (
        <span 
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline"
          onClick={() => navigate(`/iam/users/${value}`)}
        >
          {value}
        </span>
      )
    },
    { key: 'email', label: 'Email', flex: 1, sortable: true },
    { 
      key: 'groups', 
      label: 'Groups', 
      width: '200px', 
      sortable: false,
      render: (value: string[]) => (
        <HStack gap={1}>
          {value.length > 0 ? (
            value.slice(0, 2).map((group, idx) => (
              <Chip key={idx} size="sm">{group}</Chip>
            ))
          ) : (
            <span className="text-[var(--color-text-muted)]">-</span>
          )}
          {value.length > 2 && (
            <Chip size="sm">+{value.length - 2}</Chip>
          )}
        </HStack>
      )
    },
    { key: 'lastLogin', label: 'Last Login', width: '140px', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      width: '100px', 
      sortable: true,
      render: (value: string) => (
        <Chip 
          size="sm" 
          variant={value === 'Active' ? 'success' : value === 'Inactive' ? 'danger' : 'warning'}
        >
          {value}
        </Chip>
      )
    },
    { 
      key: 'mfaEnabled', 
      label: 'MFA', 
      width: '80px', 
      align: 'center',
      render: (value: boolean) => (
        <span className={value ? 'text-[var(--color-state-success)]' : 'text-[var(--color-text-muted)]'}>
          {value ? '✓' : '-'}
        </span>
      )
    },
  ];

  // Role table columns
  const roleColumns: TableColumn<RoleRow>[] = [
    { 
      key: 'name', 
      label: 'Role Name', 
      flex: 1, 
      sortable: true,
      render: (value: string) => (
        <span 
          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline"
          onClick={() => navigate(`/iam/roles/${value.toLowerCase().replace(/\s+/g, '-')}`)}
        >
          {value}
        </span>
      )
    },
    { key: 'description', label: 'Description', flex: 2, sortable: false },
    { key: 'usersCount', label: 'Users', width: '80px', sortable: true, align: 'center' },
    { key: 'createdAt', label: 'Created', width: '120px', sortable: true },
  ];

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      {/* Sidebar */}
      <IAMSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        <TabBar
          tabs={tabs.map(tab => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />

        {/* Top Bar */}
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'IAM' },
                { label: 'Home' },
              ]}
            />
          }
          actions={
            <>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconSearch size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
              <button className="p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors">
                <IconBell size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
              </button>
            </>
          }
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          <div className="pt-6 px-8 pb-20 bg-[var(--color-surface-default)] min-h-full">
            <VStack gap={6} className="min-w-[1176px]">
              {/* Welcome Header */}
              <SectionCard className="bg-[var(--color-surface-subtle)]">
                <SectionCard.Content>
                  <VStack gap={2}>
                    <h1 className="text-[24px] font-semibold text-[var(--color-text-default)]">Identity & Access Management</h1>
                    <p className="text-[14px] text-[var(--color-text-muted)]">
                      Manage users, groups, roles, and policies to control access to your cloud resources securely.
                    </p>
                  </VStack>
                </SectionCard.Content>
              </SectionCard>

              {/* Users and Quick Actions Row */}
              <HStack gap={6} align="start">
                {/* Users Table */}
                <SectionCard className="flex-1">
                  <SectionCard.Header 
                    title="Users" 
                    actions={
                      <Button 
                        variant="primary" 
                        size="sm" 
                        leftIcon={<IconUserPlus size={14} stroke={1.5} />}
                        onClick={() => navigate('/iam/users/create')}
                      >
                        Add User
                      </Button>
                    }
                  />
                  <SectionCard.Content>
                    <VStack gap={4}>
                      <HStack justify="between" align="center">
                        <SearchInput 
                          placeholder="Search users..." 
                          size="sm" 
                          className="w-[280px]"
                        />
                        <Pagination
                          currentPage={usersPage}
                          totalPages={Math.ceil(usersData.length / 5)}
                          onPageChange={setUsersPage}
                          totalItems={usersData.length}
                        />
                      </HStack>
                      <Table<UserRow>
                        columns={userColumns}
                        data={usersData.slice((usersPage - 1) * 5, usersPage * 5)}
                        rowKey="id"
                      />
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>

                {/* Quick Actions Card */}
                <SectionCard className="w-[280px] shrink-0">
                  <SectionCard.Header title="Quick Actions" />
                  <SectionCard.Content>
                    <VStack gap={3}>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        fullWidth
                        leftIcon={<IconUserPlus size={14} stroke={1.5} />}
                        onClick={() => navigate('/iam/users/create')}
                      >
                        Add User
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        fullWidth
                        leftIcon={<IconShieldPlus size={14} stroke={1.5} />}
                        onClick={() => navigate('/iam/roles/create')}
                      >
                        Create Role
                      </Button>
                      <div className="h-px bg-[var(--color-border-default)]" />
                      <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                        Quickly add users or create new roles to manage access to your cloud resources.
                      </p>
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>
              </HStack>

              {/* Roles Section */}
              <SectionCard>
                <SectionCard.Header 
                  title="Roles" 
                  actions={
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      leftIcon={<IconShieldPlus size={14} stroke={1.5} />}
                      onClick={() => navigate('/iam/roles/create')}
                    >
                      Create Role
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <VStack gap={4}>
                    <HStack justify="between" align="center">
                      <SearchInput 
                        placeholder="Search roles..." 
                        size="sm" 
                        className="w-[280px]"
                      />
                      <Pagination
                        currentPage={rolesPage}
                        totalPages={Math.ceil(rolesData.length / 5)}
                        onPageChange={setRolesPage}
                        totalItems={rolesData.length}
                      />
                    </HStack>
                    <Table<RoleRow>
                      columns={roleColumns}
                      data={rolesData.slice((rolesPage - 1) * 5, rolesPage * 5)}
                      rowKey="id"
                    />
                  </VStack>
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </div>
        </div>
      </main>
    </div>
  );
}

export default IAMHomePage;

