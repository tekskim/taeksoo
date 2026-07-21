import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

const LogExplorerPage = lazy(() => import('@/pages/LogExplorerPage'));
const LogSavedQueriesPage = lazy(() => import('@/pages/LogSavedQueriesPage'));
const LiveTailPage = lazy(() => import('@/pages/LiveTailPage'));

export const logsRoutes = (
  <>
    <Route path="/logs/explorer" element={<LogExplorerPage />} />
    <Route path="/logs/saved-queries" element={<LogSavedQueriesPage />} />
    <Route path="/logs/live-tail" element={<LiveTailPage />} />
    <Route path="/logs" element={<Navigate to="/logs/explorer" replace />} />
    <Route path="/logs/*" element={<LogExplorerPage />} />
  </>
);
