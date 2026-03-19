import { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabBar from '@shared/components/TabBar/TabBar';
import ToolBar from '@shared/components/ToolBar/ToolBar';
import type { BreadcrumbItem } from '@shared/components/Breadcrumb';
import { IAMSidebar } from '../components/IAMSidebar';

const BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = {
  '/iam': [{ label: 'IAM', path: '/iam' }, { label: 'Home' }],
  '/iam/users': [{ label: 'IAM', path: '/iam' }, { label: 'Users' }],
  '/iam/user-groups': [{ label: 'IAM', path: '/iam' }, { label: 'User groups' }],
  '/iam/roles': [{ label: 'IAM', path: '/iam' }, { label: 'Roles' }],
  '/iam/policies': [{ label: 'IAM', path: '/iam' }, { label: 'Policies' }],
  '/iam/active-sessions': [{ label: 'IAM', path: '/iam' }, { label: 'Active sessions' }],
  '/iam/domains': [{ label: 'IAM', path: '/iam' }, { label: 'Domains' }],
  '/iam/system-administrators': [{ label: 'IAM', path: '/iam' }, { label: 'System administrators' }],
  '/iam/event-logs': [{ label: 'IAM', path: '/iam' }, { label: 'Event logs' }],
  '/iam/mfa-policies': [{ label: 'IAM', path: '/iam' }, { label: 'MFA policies' }],
  '/iam/session-policies': [{ label: 'IAM', path: '/iam' }, { label: 'Session policies' }],
  '/iam/token-policies': [{ label: 'IAM', path: '/iam' }, { label: 'Token policies' }],
  '/iam/login-policies': [{ label: 'IAM', path: '/iam' }, { label: 'Login policies' }],
};

function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const exact = BREADCRUMB_MAP[pathname];
  if (exact) return exact;

  if (pathname.startsWith('/iam/users/')) {
    const userId = pathname.split('/').pop() || '';
    return [{ label: 'IAM', path: '/iam' }, { label: 'Users', path: '/iam/users' }, { label: userId }];
  }
  if (pathname.startsWith('/iam/user-groups/')) {
    const groupId = pathname.split('/').pop() || '';
    return [{ label: 'IAM', path: '/iam' }, { label: 'User groups', path: '/iam/user-groups' }, { label: groupId }];
  }
  if (pathname.startsWith('/iam/roles/')) {
    const roleId = pathname.split('/').pop() || '';
    return [{ label: 'IAM', path: '/iam' }, { label: 'Roles', path: '/iam/roles' }, { label: roleId }];
  }
  if (pathname.startsWith('/iam/policies/')) {
    const policyId = pathname.split('/').pop() || '';
    return [{ label: 'IAM', path: '/iam' }, { label: 'Policies', path: '/iam/policies' }, { label: policyId }];
  }
  if (pathname.startsWith('/iam/system-administrators/')) {
    const adminId = pathname.split('/').pop() || '';
    return [{ label: 'IAM', path: '/iam' }, { label: 'System administrators', path: '/iam/system-administrators' }, { label: adminId }];
  }

  return [{ label: 'IAM' }];
}

export function IAMLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const breadcrumbItems = useMemo(
    () => getBreadcrumbItems(location.pathname),
    [location.pathname],
  );

  const tabTitle = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith('/iam/users/')) return p.split('/').pop() || 'Users';
    if (p.startsWith('/iam/user-groups/')) return p.split('/').pop() || 'User groups';
    if (p.startsWith('/iam/roles/')) return p.split('/').pop() || 'Roles';
    if (p.startsWith('/iam/policies/')) return p.split('/').pop() || 'Policies';
    if (p.startsWith('/iam/system-administrators/')) return p.split('/').pop() || 'System administrators';
    if (p === '/iam') return 'IAM home';
    if (p === '/iam/users') return 'Users';
    if (p === '/iam/user-groups') return 'User groups';
    if (p === '/iam/roles') return 'Roles';
    if (p === '/iam/policies') return 'Policies';
    if (p === '/iam/active-sessions') return 'Active sessions';
    if (p === '/iam/domains') return 'Domains';
    if (p === '/iam/system-administrators') return 'System administrators';
    if (p === '/iam/event-logs') return 'Event logs';
    if (p === '/iam/mfa-policies') return 'MFA policies';
    if (p === '/iam/session-policies') return 'Session policies';
    if (p === '/iam/token-policies') return 'Token policies';
    if (p === '/iam/login-policies') return 'Login policies';
    return 'IAM';
  }, [location.pathname]);

  const tabs = useMemo(
    () => [{ id: 'main', title: tabTitle, fixed: true }],
    [tabTitle],
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <IAMSidebar
        isCollapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main panel */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* TabBar */}
        <TabBar
          tabs={tabs}
          activeTab="main"
          onTabClick={() => {}}
          onTabClose={() => {}}
          onAddTab={() => {}}
        />

        {/* ToolBar */}
        <ToolBar
          breadcrumbItems={breadcrumbItems}
          navigation={{
            canGoBack: true,
            canGoForward: false,
            onGoBack: () => window.history.back(),
            onGoForward: () => window.history.forward(),
          }}
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          langButton={null}
        />

        {/* Page content — matches TDS PageShell sidebar-scroll class */}
        <main className="flex-1 overflow-auto pt-4 px-8 pb-20 content-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
