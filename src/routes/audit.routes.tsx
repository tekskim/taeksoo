import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage'));

export const auditRoutes = (
  <>
    <Route path="/audit/logs" element={<AuditLogsPage />} />
    <Route path="/audit" element={<Navigate to="/audit/logs" replace />} />
    <Route path="/audit/*" element={<AuditLogsPage />} />
  </>
);
