import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

// 정책서 §0-1: 감사 대시보드 / 감사 로그(목록·상세) / 리포트(목록·상세)
const AuditDashboardPage = lazy(() => import('@/pages/AuditDashboardPage'));
const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage'));
const AuditLogDetailPage = lazy(() => import('@/pages/AuditLogDetailPage'));
const AuditReportsPage = lazy(() => import('@/pages/AuditReportsPage'));
const AuditReportDetailPage = lazy(() => import('@/pages/AuditReportDetailPage'));

export const auditRoutes = (
  <>
    <Route path="/audit/dashboard" element={<AuditDashboardPage />} />
    <Route path="/audit/logs" element={<AuditLogsPage />} />
    <Route path="/audit/logs/:id" element={<AuditLogDetailPage />} />
    <Route path="/audit/reports" element={<AuditReportsPage />} />
    <Route path="/audit/reports/:id" element={<AuditReportDetailPage />} />
    <Route path="/audit" element={<Navigate to="/audit/dashboard" replace />} />
    <Route path="/audit/*" element={<Navigate to="/audit/dashboard" replace />} />
  </>
);
