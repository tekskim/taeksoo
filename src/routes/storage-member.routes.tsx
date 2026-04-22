import { lazy } from 'react';
import { Route } from 'react-router-dom';

const StorageMemberHomePage = lazy(() => import('@/pages/StorageMemberHomePage'));
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

export const storageMemberRoutes = (
  <>
    <Route path="/storage-member" element={<StorageMemberHomePage />} />
    <Route path="/storage-member/pools" element={<PoolsPage />} />
    <Route path="/storage-member/pools/:id" element={<StoragePoolDetailPage />} />
    <Route path="/storage-member/hosts" element={<HostsPage />} />
    <Route path="/storage-member/hosts/:id" element={<HostDetailPage />} />
    <Route path="/storage-member/osds" element={<OSDsPage />} />
    <Route path="/storage-member/osds/:id" element={<OSDDetailPage />} />
    <Route path="/storage-member/buckets" element={<BucketsPage />} />
    <Route path="/storage-member/buckets/create" element={<CreateBucketPage />} />
    <Route path="/storage-member/buckets/:id" element={<BucketDetailPage />} />
    <Route path="/storage-member/images" element={<ImagesPage />} />
    <Route path="/storage-member/images/:id" element={<ImageDetailPage />} />
  </>
);
