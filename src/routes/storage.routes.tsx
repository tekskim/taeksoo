import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load all storage pages for code splitting
const StorageHomePage = lazy(() => import('@/pages/StorageHomePage'));
const StoragePoolDetailPage = lazy(() => import('@/pages/StoragePoolDetailPage'));
const HostsPage = lazy(() => import('@/pages/HostsPage'));
const HostDetailPage = lazy(() => import('@/pages/HostDetailPage'));
const OSDsPage = lazy(() => import('@/pages/OSDsPage'));
const OSDDetailPage = lazy(() => import('@/pages/OSDDetailPage'));
const PoolsPage = lazy(() => import('@/pages/PoolsPage'));

export const storageRoutes = (
  <>
    {/* Storage Routes */}
    <Route path="/storage" element={<StorageHomePage />} />
    <Route path="/storage/pools" element={<PoolsPage />} />
    <Route path="/storage/pools/:id" element={<StoragePoolDetailPage />} />
    <Route path="/storage/hosts" element={<HostsPage />} />
    <Route path="/storage/hosts/:id" element={<HostDetailPage />} />
    <Route path="/storage/osds" element={<OSDsPage />} />
    <Route path="/storage/osds/:id" element={<OSDDetailPage />} />
  </>
);

