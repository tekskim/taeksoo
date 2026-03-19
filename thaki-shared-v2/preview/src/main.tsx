import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import '@shared/styles/index.css';

import { IAMLayout } from './layouts/IAMLayout';
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<IAMLayout />}>
          <Route path="/iam" element={<IAMHomePage />} />
          <Route path="/iam/users" element={<IAMUsersPage />} />
          <Route path="/iam/users/:username" element={<IAMUserDetailPage />} />
          <Route path="/iam/user-groups" element={<IAMUserGroupsPage />} />
          <Route path="/iam/user-groups/:groupName" element={<IAMUserGroupDetailPage />} />
          <Route path="/iam/roles" element={<IAMRolesPage />} />
          <Route path="/iam/roles/:roleName" element={<IAMRoleDetailPage />} />
          <Route path="/iam/policies" element={<IAMPoliciesPage />} />
          <Route path="/iam/policies/:policyId" element={<IAMPolicyDetailPage />} />
          <Route path="/iam/active-sessions" element={<IAMActiveSessionsPage />} />
          <Route path="/iam/domains" element={<IAMDomainsPage />} />
          <Route path="/iam/system-administrators" element={<IAMSystemAdministratorsPage />} />
          <Route path="/iam/system-administrators/:username" element={<IAMSystemAdminDetailPage />} />
          <Route path="/iam/event-logs" element={<IAMEventLogsPage />} />
          <Route path="/iam/mfa-policies" element={<IAMMFAPoliciesPage />} />
          <Route path="/iam/session-policies" element={<IAMSessionPoliciesPage />} />
          <Route path="/iam/token-policies" element={<IAMTokenPoliciesPage />} />
          <Route path="/iam/login-policies" element={<IAMLoginPoliciesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/iam/users" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
