import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

import '@shared/styles/index.css';

import { IAMLayout } from './layouts/IAMLayout';
import { CloudBuilderLayout } from './layouts/CloudBuilderLayout';
import { StorageLayout } from './layouts/StorageLayout';

function EntryPage() {
  const apps = [
    {
      name: 'IAM',
      description: 'Identity & Access Management',
      href: '/iam/users',
      color: '#2563eb',
    },
    {
      name: 'Cloud Builder',
      description: 'Infrastructure inventory & system info',
      href: '/cloudbuilder/discovery',
      color: '#059669',
    },
    {
      name: 'Storage',
      description: 'Ceph storage cluster management',
      href: '/storage',
      color: '#7c3aed',
    },
    {
      name: 'Compute',
      description: 'Virtual machines and networking',
      href: '/compute/instances',
      color: '#ea580c',
    },
  ];
  return (
    <div className="min-h-screen bg-surface-subtle flex items-center justify-center p-8">
      <div className="max-w-[600px] w-full flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-[28px] leading-[36px] font-semibold text-text m-0">
            shared-v2 Preview
          </h1>
          <p className="text-13 leading-20 text-text-muted m-0">Select an application to preview</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {apps.map((app) => (
            <Link
              key={app.href}
              to={app.href}
              className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-surface hover:border-[color:var(--color-border-strong)] hover:shadow-sm transition-all no-underline"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[18px] font-bold text-white"
                style={{ backgroundColor: app.color }}
              >
                {app.name[0]}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-14 font-semibold leading-20 text-text">{app.name}</span>
                <span className="text-12 leading-18 text-text-muted">{app.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
import { CloudBuilderConsolePage } from './pages/CloudBuilderConsolePage';
import { CloudBuilderDetailPage } from './pages/CloudBuilderDetailPage';
import { CloudBuilderCreatePage } from './pages/CloudBuilderCreatePage';
import { IAMHomePage } from './pages/IAMHomePage';
import { IAMUsersPage } from './pages/IAMUsersPage';
import { IAMUserGroupsPage } from './pages/IAMUserGroupsPage';
import { IAMRolesPage } from './pages/IAMRolesPage';
import { IAMUserDetailPage } from './pages/IAMUserDetailPage';
import { IAMUserGroupDetailPage } from './pages/IAMUserGroupDetailPage';
import { IAMRoleDetailPage } from './pages/IAMRoleDetailPage';
import { IAMPoliciesPage } from './pages/IAMPoliciesPage';
import { IAMPolicyDetailPage } from './pages/IAMPolicyDetailPage';
import { IAMActiveSessionsPage } from './pages/IAMActiveSessionsPage';
import { IAMDomainsPage } from './pages/IAMDomainsPage';
import { IAMSystemAdministratorsPage } from './pages/IAMSystemAdministratorsPage';
import { IAMSystemAdminDetailPage } from './pages/IAMSystemAdminDetailPage';
import { IAMEventLogsPage } from './pages/IAMEventLogsPage';
import { IAMMFAPoliciesPage } from './pages/IAMMFAPoliciesPage';
import { IAMSessionPoliciesPage } from './pages/IAMSessionPoliciesPage';
import { IAMTokenPoliciesPage } from './pages/IAMTokenPoliciesPage';
import { IAMLoginPoliciesPage } from './pages/IAMLoginPoliciesPage';
import { IAMCreateUserPage } from './pages/IAMCreateUserPage';
import { IAMCreateUserGroupPage } from './pages/IAMCreateUserGroupPage';
import { IAMCreateRolePage } from './pages/IAMCreateRolePage';
import { IAMCreatePolicyPage } from './pages/IAMCreatePolicyPage';
import { IAMCreateSysAdminPage } from './pages/IAMCreateSysAdminPage';
import { StorageHomePage } from './pages/StorageHomePage';
import { StorageConsolePage } from './pages/StorageConsolePage';
import { StorageDetailPage } from './pages/StorageDetailPage';
import { StoragePerformancePage } from './pages/StoragePerformancePage';
import { StorageCreatePage } from './pages/StorageCreatePage';
import { ComputeLayout } from './layouts/ComputeLayout';
import { ComputeHomePage } from './pages/ComputeHomePage';
import { ComputeInstancesPage } from './pages/ComputeInstancesPage';
import { ComputeInstanceDetailPage } from './pages/ComputeInstanceDetailPage';
import { ComputeCreateInstancePage } from './pages/ComputeCreateInstancePage';
import { ComputeInstanceTemplatesPage } from './pages/ComputeInstanceTemplatesPage';
import { ComputeInstanceTemplateDetailPage } from './pages/ComputeInstanceTemplateDetailPage';
import { ComputeInstanceSnapshotsPage } from './pages/ComputeInstanceSnapshotsPage';
import { ComputeInstanceSnapshotDetailPage } from './pages/ComputeInstanceSnapshotDetailPage';
import { ComputeImagesPage } from './pages/ComputeImagesPage';
import { ComputeImageDetailPage } from './pages/ComputeImageDetailPage';
import { ComputeCreateImagePage } from './pages/ComputeCreateImagePage';
import { ComputeFlavorsPage } from './pages/ComputeFlavorsPage';
import { ComputeFlavorDetailPage } from './pages/ComputeFlavorDetailPage';
import { ComputeKeyPairsPage } from './pages/ComputeKeyPairsPage';
import { ComputeKeyPairDetailPage } from './pages/ComputeKeyPairDetailPage';
import { ComputeServerGroupsPage } from './pages/ComputeServerGroupsPage';
import { ComputeServerGroupDetailPage } from './pages/ComputeServerGroupDetailPage';
import { ComputeVolumesPage } from './pages/ComputeVolumesPage';
import { ComputeVolumeDetailPage } from './pages/ComputeVolumeDetailPage';
import { ComputeCreateVolumePage } from './pages/ComputeCreateVolumePage';
import { ComputeVolumeSnapshotsPage } from './pages/ComputeVolumeSnapshotsPage';
import { ComputeVolumeSnapshotDetailPage } from './pages/ComputeVolumeSnapshotDetailPage';
import { ComputeVolumeBackupsPage } from './pages/ComputeVolumeBackupsPage';
import { ComputeVolumeBackupDetailPage } from './pages/ComputeVolumeBackupDetailPage';
import { ComputeNetworksPage } from './pages/ComputeNetworksPage';
import { ComputeNetworkDetailPage } from './pages/ComputeNetworkDetailPage';
import { ComputeCreateNetworkPage } from './pages/ComputeCreateNetworkPage';
import { ComputeRoutersPage } from './pages/ComputeRoutersPage';
import { ComputeRouterDetailPage } from './pages/ComputeRouterDetailPage';
import { ComputePortsPage } from './pages/ComputePortsPage';
import { ComputePortDetailPage } from './pages/ComputePortDetailPage';
import { ComputeFloatingIPsPage } from './pages/ComputeFloatingIPsPage';
import { ComputeFloatingIPDetailPage } from './pages/ComputeFloatingIPDetailPage';
import { ComputeSecurityGroupsPage } from './pages/ComputeSecurityGroupsPage';
import { ComputeSecurityGroupDetailPage } from './pages/ComputeSecurityGroupDetailPage';
import { ComputeLoadBalancersPage } from './pages/ComputeLoadBalancersPage';
import { ComputeLoadBalancerDetailPage } from './pages/ComputeLoadBalancerDetailPage';
import { ComputeCreateLoadBalancerPage } from './pages/ComputeCreateLoadBalancerPage';
import { ComputeFirewallsPage } from './pages/ComputeFirewallsPage';
import { ComputeFirewallDetailPage } from './pages/ComputeFirewallDetailPage';
import { ComputeCertificatesPage } from './pages/ComputeCertificatesPage';
import { ComputeCertificateDetailPage } from './pages/ComputeCertificateDetailPage';
import { ComputeDNSZonesPage } from './pages/ComputeDNSZonesPage';
import { ComputeBackupPoliciesPage } from './pages/ComputeBackupPoliciesPage';
import { ComputeScheduledTasksPage } from './pages/ComputeScheduledTasksPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Routes>
        <Route element={<IAMLayout />}>
          <Route path="/iam" element={<IAMHomePage />} />
          <Route path="/iam/users" element={<IAMUsersPage />} />
          <Route path="/iam/users/create" element={<IAMCreateUserPage />} />
          <Route path="/iam/users/:username" element={<IAMUserDetailPage />} />
          <Route path="/iam/user-groups" element={<IAMUserGroupsPage />} />
          <Route path="/iam/user-groups/create" element={<IAMCreateUserGroupPage />} />
          <Route path="/iam/user-groups/:groupName" element={<IAMUserGroupDetailPage />} />
          <Route path="/iam/roles" element={<IAMRolesPage />} />
          <Route path="/iam/roles/create" element={<IAMCreateRolePage />} />
          <Route path="/iam/roles/:roleName" element={<IAMRoleDetailPage />} />
          <Route path="/iam/policies" element={<IAMPoliciesPage />} />
          <Route path="/iam/policies/create" element={<IAMCreatePolicyPage />} />
          <Route path="/iam/policies/:policyId" element={<IAMPolicyDetailPage />} />
          <Route path="/iam/active-sessions" element={<IAMActiveSessionsPage />} />
          <Route path="/iam/domains" element={<IAMDomainsPage />} />
          <Route path="/iam/system-administrators" element={<IAMSystemAdministratorsPage />} />
          <Route path="/iam/system-administrators/create" element={<IAMCreateSysAdminPage />} />
          <Route
            path="/iam/system-administrators/:username"
            element={<IAMSystemAdminDetailPage />}
          />
          <Route path="/iam/event-logs" element={<IAMEventLogsPage />} />
          <Route path="/iam/mfa-policies" element={<IAMMFAPoliciesPage />} />
          <Route path="/iam/session-policies" element={<IAMSessionPoliciesPage />} />
          <Route path="/iam/token-policies" element={<IAMTokenPoliciesPage />} />
          <Route path="/iam/login-policies" element={<IAMLoginPoliciesPage />} />
        </Route>
        <Route element={<CloudBuilderLayout />}>
          <Route path="/cloudbuilder" element={<CloudBuilderConsolePage />} />
          <Route path="/cloudbuilder/:slug" element={<CloudBuilderConsolePage />} />
          <Route path="/cloudbuilder/:slug/create" element={<CloudBuilderCreatePage />} />
          <Route path="/cloudbuilder/:slug/detail/:id" element={<CloudBuilderDetailPage />} />
        </Route>
        <Route element={<StorageLayout />}>
          <Route path="/storage" element={<StorageHomePage />} />
          <Route path="/storage/performance" element={<StoragePerformancePage />} />
          <Route path="/storage/buckets/create" element={<StorageCreatePage />} />
          <Route path="/storage/:slug" element={<StorageConsolePage />} />
          <Route path="/storage/:slug/:id" element={<StorageDetailPage />} />
        </Route>
        <Route path="/compute" element={<ComputeLayout />}>
          <Route index element={<ComputeHomePage />} />
          <Route path="instances" element={<ComputeInstancesPage />} />
          <Route path="instances/create" element={<ComputeCreateInstancePage />} />
          <Route path="instances/:id" element={<ComputeInstanceDetailPage />} />
          <Route path="instance-templates" element={<ComputeInstanceTemplatesPage />} />
          <Route path="instance-templates/:id" element={<ComputeInstanceTemplateDetailPage />} />
          <Route path="instance-snapshots" element={<ComputeInstanceSnapshotsPage />} />
          <Route path="instance-snapshots/:id" element={<ComputeInstanceSnapshotDetailPage />} />
          <Route path="images" element={<ComputeImagesPage />} />
          <Route path="images/create" element={<ComputeCreateImagePage />} />
          <Route path="images/:id" element={<ComputeImageDetailPage />} />
          <Route path="flavors" element={<ComputeFlavorsPage />} />
          <Route path="flavors/:id" element={<ComputeFlavorDetailPage />} />
          <Route path="key-pairs" element={<ComputeKeyPairsPage />} />
          <Route path="key-pairs/:id" element={<ComputeKeyPairDetailPage />} />
          <Route path="server-groups" element={<ComputeServerGroupsPage />} />
          <Route path="server-groups/:id" element={<ComputeServerGroupDetailPage />} />
          <Route path="volumes" element={<ComputeVolumesPage />} />
          <Route path="volumes/create" element={<ComputeCreateVolumePage />} />
          <Route path="volumes/:id" element={<ComputeVolumeDetailPage />} />
          <Route path="volume-snapshots" element={<ComputeVolumeSnapshotsPage />} />
          <Route path="volume-snapshots/:id" element={<ComputeVolumeSnapshotDetailPage />} />
          <Route path="volume-backups" element={<ComputeVolumeBackupsPage />} />
          <Route path="volume-backups/:id" element={<ComputeVolumeBackupDetailPage />} />
          <Route path="networks" element={<ComputeNetworksPage />} />
          <Route path="networks/create" element={<ComputeCreateNetworkPage />} />
          <Route path="networks/:id" element={<ComputeNetworkDetailPage />} />
          <Route path="routers" element={<ComputeRoutersPage />} />
          <Route path="routers/:id" element={<ComputeRouterDetailPage />} />
          <Route path="ports" element={<ComputePortsPage />} />
          <Route path="ports/:id" element={<ComputePortDetailPage />} />
          <Route path="floating-ips" element={<ComputeFloatingIPsPage />} />
          <Route path="floating-ips/:id" element={<ComputeFloatingIPDetailPage />} />
          <Route path="security-groups" element={<ComputeSecurityGroupsPage />} />
          <Route path="security-groups/:id" element={<ComputeSecurityGroupDetailPage />} />
          <Route path="load-balancers" element={<ComputeLoadBalancersPage />} />
          <Route path="load-balancers/create" element={<ComputeCreateLoadBalancerPage />} />
          <Route path="load-balancers/:id" element={<ComputeLoadBalancerDetailPage />} />
          <Route path="firewalls" element={<ComputeFirewallsPage />} />
          <Route path="firewalls/:id" element={<ComputeFirewallDetailPage />} />
          <Route path="certificates" element={<ComputeCertificatesPage />} />
          <Route path="certificates/:id" element={<ComputeCertificateDetailPage />} />
          <Route path="dns-zones" element={<ComputeDNSZonesPage />} />
          <Route path="backup-policies" element={<ComputeBackupPoliciesPage />} />
          <Route path="scheduled-tasks" element={<ComputeScheduledTasksPage />} />
        </Route>
        <Route path="/" element={<EntryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
