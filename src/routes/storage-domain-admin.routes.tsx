import { lazy } from 'react';
import { Route } from 'react-router-dom';

const StorageDomainAdminHomePage = lazy(() => import('@/pages/StorageDomainAdminHomePage'));
const PoolsPage = lazy(() => import('@/pages/storage-domain-admin/PoolsPage'));
const StoragePoolDetailPage = lazy(
  () => import('@/pages/storage-domain-admin/StoragePoolDetailPage')
);
const ImagesPage = lazy(() => import('@/pages/storage-domain-admin/ImagesPage'));
const ImageDetailPage = lazy(() => import('@/pages/storage-domain-admin/ImageDetailPage'));
const BucketsPage = lazy(() => import('@/pages/storage-domain-admin/BucketsPage'));
const BucketDetailPage = lazy(() => import('@/pages/storage-domain-admin/BucketDetailPage'));
const CreateBucketPage = lazy(() => import('@/pages/storage-domain-admin/CreateBucketPage'));
const EditBucketPage = lazy(() => import('@/pages/storage-domain-admin/EditBucketPage'));
const OverallPerformancePage = lazy(
  () => import('@/pages/storage-domain-admin/OverallPerformancePage')
);

export const storageDomainAdminRoutes = (
  <>
    <Route path="/storage-domain-admin" element={<StorageDomainAdminHomePage />} />
    <Route path="/storage-domain-admin/pools" element={<PoolsPage />} />
    <Route path="/storage-domain-admin/pools/:id" element={<StoragePoolDetailPage />} />
    <Route path="/storage-domain-admin/buckets" element={<BucketsPage />} />
    <Route path="/storage-domain-admin/buckets/create" element={<CreateBucketPage />} />
    <Route path="/storage-domain-admin/buckets/:id/edit" element={<EditBucketPage />} />
    <Route path="/storage-domain-admin/buckets/:id" element={<BucketDetailPage />} />
    <Route path="/storage-domain-admin/images" element={<ImagesPage />} />
    <Route path="/storage-domain-admin/images/:id" element={<ImageDetailPage />} />
    <Route path="/storage-domain-admin/performance" element={<OverallPerformancePage />} />
  </>
);
