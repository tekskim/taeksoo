import { lazy } from 'react';
import { Route } from 'react-router-dom';

const IAMHomePage = lazy(() => import('@/pages/IAMHomePage'));
const IAMUsersPage = lazy(() => import('@/pages/IAMUsersPage'));
const IAMUserDetailPage = lazy(() => import('@/pages/IAMUserDetailPage'));
const CreateUserPage = lazy(() => import('@/pages/CreateUserPage'));
const IAMUserGroupsPage = lazy(() => import('@/pages/IAMUserGroupsPage'));
const IAMUserGroupDetailPage = lazy(() => import('@/pages/IAMUserGroupDetailPage'));
const CreateUserGroupPage = lazy(() => import('@/pages/CreateUserGroupPage'));
const IAMRolesPage = lazy(() => import('@/pages/IAMRolesPage'));
const IAMRoleDetailPage = lazy(() => import('@/pages/IAMRoleDetailPage'));
const CreateRolePage = lazy(() => import('@/pages/CreateRolePage'));
const IAMPoliciesPage = lazy(() => import('@/pages/IAMPoliciesPage'));
const IAMPolicyDetailPage = lazy(() => import('@/pages/IAMPolicyDetailPage'));
const CreatePolicyPage = lazy(() => import('@/pages/CreatePolicyPage'));
const IAMActiveSessionsPage = lazy(() => import('@/pages/IAMActiveSessionsPage'));
const IAMDomainsPage = lazy(() => import('@/pages/IAMDomainsPage'));
const IAMSystemAdministratorsPage = lazy(() => import('@/pages/IAMSystemAdministratorsPage'));
const IAMSystemAdminDetailPage = lazy(() => import('@/pages/IAMSystemAdminDetailPage'));
const CreateSystemAdministratorPage = lazy(() => import('@/pages/CreateSystemAdministratorPage'));
const IAMEventLogsPage = lazy(() => import('@/pages/IAMEventLogsPage'));
const IAMMFAPoliciesPage = lazy(() => import('@/pages/IAMMFAPoliciesPage'));
const IAMSessionPoliciesPage = lazy(() => import('@/pages/IAMSessionPoliciesPage'));
const IAMTokenPoliciesPage = lazy(() => import('@/pages/IAMTokenPoliciesPage'));
const IAMLoginPoliciesPage = lazy(() => import('@/pages/IAMLoginPoliciesPage'));

export const iamRoutes = (
  <>
    <Route path="/iam" element={<IAMHomePage />} />
    <Route path="/iam/users" element={<IAMUsersPage />} />
    <Route path="/iam/users/create" element={<CreateUserPage />} />
    <Route path="/iam/users/create-v2" element={<CreateUserPage />} />
    <Route path="/iam/users/:username" element={<IAMUserDetailPage />} />
    <Route path="/iam/user-groups" element={<IAMUserGroupsPage />} />
    <Route path="/iam/user-groups/create" element={<CreateUserGroupPage />} />
    <Route path="/iam/user-groups/create-v2" element={<CreateUserGroupPage />} />
    <Route path="/iam/user-groups/:groupName" element={<IAMUserGroupDetailPage />} />
    <Route path="/iam/roles" element={<IAMRolesPage />} />
    <Route path="/iam/roles/create" element={<CreateRolePage />} />
    <Route path="/iam/roles/create-v2" element={<CreateRolePage />} />
    <Route path="/iam/roles/:roleName" element={<IAMRoleDetailPage />} />
    <Route path="/iam/policies" element={<IAMPoliciesPage />} />
    <Route path="/iam/policies/create" element={<CreatePolicyPage />} />
    <Route path="/iam/policies/create-v2" element={<CreatePolicyPage />} />
    <Route path="/iam/policies/:policyId" element={<IAMPolicyDetailPage />} />
    <Route path="/iam/active-sessions" element={<IAMActiveSessionsPage />} />
    <Route path="/iam/domains" element={<IAMDomainsPage />} />
    <Route path="/iam/system-administrators" element={<IAMSystemAdministratorsPage />} />
    <Route path="/iam/system-administrators/create" element={<CreateSystemAdministratorPage />} />
    <Route
      path="/iam/system-administrators/create-v2"
      element={<CreateSystemAdministratorPage />}
    />
    <Route path="/iam/system-administrators/:username" element={<IAMSystemAdminDetailPage />} />
    <Route path="/iam/event-logs" element={<IAMEventLogsPage />} />
    <Route path="/iam/mfa-policies" element={<IAMMFAPoliciesPage />} />
    <Route path="/iam/session-policies" element={<IAMSessionPoliciesPage />} />
    <Route path="/iam/token-policies" element={<IAMTokenPoliciesPage />} />
    <Route path="/iam/login-policies" element={<IAMLoginPoliciesPage />} />
    <Route path="/iam/*" element={<IAMHomePage />} />
  </>
);
