import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

const AlertsListPage = lazy(() => import('@/pages/AlertsListPage'));
const AlertDetailPage = lazy(() => import('@/pages/AlertDetailPage'));
const AlertDeliverySettingsPage = lazy(() => import('@/pages/AlertDeliverySettingsPage'));

export const alertRoutes = (
  <>
    <Route path="/alerts/board" element={<AlertsListPage />} />
    <Route path="/alerts/delivery-settings" element={<AlertDeliverySettingsPage />} />
    <Route path="/alerts/:alertId" element={<AlertDetailPage />} />
    <Route path="/alerts" element={<Navigate to="/alerts/board" replace />} />
    <Route path="/alerts/*" element={<AlertsListPage />} />
  </>
);
