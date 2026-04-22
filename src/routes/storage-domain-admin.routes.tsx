import { lazy } from 'react';
import { Route } from 'react-router-dom';

const StorageDomainAdminHomePage = lazy(() => import('@/pages/StorageDomainAdminHomePage'));
const StoragePoolDetailPage = lazy(() => import('@/pages/StoragePoolDetailPage'));
const HostsPage = lazy(() => import('@/pages/HostsPage'));
const HostDetailPage = lazy(() => import('@/pages/HostDetailPage'));
const OSDsPage = lazy(() => import('@/pages/OSDsPage'));
const OSDDetailPage = lazy(() => import('@/pages/OSDDetailPage'));
const PoolsPage = lazy(() => import('@/pages/PoolsPage'));
const BucketsPage = lazy(() => import('@/pages/BucketsPage'));
const BucketDetailPage = lazy(() => import('@/pages/BucketDetailPage'));
const CreateBucketPage = lazy(() => import('@/pages/CreateBucketPage'));
const ImagesPage = lazy(() => import('@/pages/ImagesPage'));
const ImageDetailPage = lazy(() => import('@/pages/ImageDetailPage'));

export const storageDomainAdminRoutes = (
  <>
    <Route path="/storage-domain-admin" element={<StorageDomainAdminHomePage />} />
    <Route path="/storage-domain-admin/pools" element={<PoolsPage />} />
    <Route path="/storage-domain-admin/pools/:id" element={<StoragePoolDetailPage />} />
    <Route path="/storage-domain-admin/hosts" element={<HostsPage />} />
    <Route path="/storage-domain-admin/hosts/:id" element={<HostDetailPage />} />
    <Route path="/storage-domain-admin/osds" element={<OSDsPage />} />
    <Route path="/storage-domain-admin/osds/:id" element={<OSDDetailPage />} />
    <Route path="/storage-domain-admin/buckets" element={<BucketsPage />} />
    <Route path="/storage-domain-admin/buckets/create" element={<CreateBucketPage />} />
    <Route path="/storage-domain-admin/buckets/:id" element={<BucketDetailPage />} />
    <Route path="/storage-domain-admin/images" element={<ImagesPage />} />
    <Route path="/storage-domain-admin/images/:id" element={<ImageDetailPage />} />
  </>
);
