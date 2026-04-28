import { lazy } from 'react';
import { Route } from 'react-router-dom';

const StorageHomePage = lazy(() => import('@/pages/StorageHomePage'));
const PoolsPage = lazy(() => import('@/pages/storage-system-admin/PoolsPage'));
const StoragePoolDetailPage = lazy(
  () => import('@/pages/storage-system-admin/StoragePoolDetailPage')
);
const HostsPage = lazy(() => import('@/pages/storage-system-admin/HostsPage'));
const HostDetailPage = lazy(() => import('@/pages/storage-system-admin/HostDetailPage'));
const OSDsPage = lazy(() => import('@/pages/storage-system-admin/OSDsPage'));
const OSDDetailPage = lazy(() => import('@/pages/storage-system-admin/OSDDetailPage'));
const BucketsPage = lazy(() => import('@/pages/storage-system-admin/BucketsPage'));
const BucketDetailPage = lazy(() => import('@/pages/storage-system-admin/BucketDetailPage'));
const CreateBucketPage = lazy(() => import('@/pages/storage-system-admin/CreateBucketPage'));
const ImagesPage = lazy(() => import('@/pages/storage-system-admin/ImagesPage'));
const ImageDetailPage = lazy(() => import('@/pages/storage-system-admin/ImageDetailPage'));
const PhysicalDisksPage = lazy(() => import('@/pages/storage-system-admin/PhysicalDisksPage'));
const OverallPerformancePage = lazy(
  () => import('@/pages/storage-system-admin/OverallPerformancePage')
);
const FileSystemsPage = lazy(() => import('@/pages/storage-system-admin/FileSystemsPage'));
const FileSystemDetailPage = lazy(
  () => import('@/pages/storage-system-admin/FileSystemDetailPage')
);
const NFSPage = lazy(() => import('@/pages/storage-system-admin/NFSPage'));
const NFSExportDetailPage = lazy(() => import('@/pages/storage-system-admin/NFSExportDetailPage'));

export const storageRoutes = (
  <>
    <Route path="/storage" element={<StorageHomePage />} />
    <Route path="/storage/pools" element={<PoolsPage />} />
    <Route path="/storage/pools/:id" element={<StoragePoolDetailPage />} />
    <Route path="/storage/hosts" element={<HostsPage />} />
    <Route path="/storage/hosts/:id" element={<HostDetailPage />} />
    <Route path="/storage/osds" element={<OSDsPage />} />
    <Route path="/storage/osds/:id" element={<OSDDetailPage />} />
    <Route path="/storage/buckets" element={<BucketsPage />} />
    <Route path="/storage/buckets/create" element={<CreateBucketPage />} />
    <Route path="/storage/buckets/:id" element={<BucketDetailPage />} />
    <Route path="/storage/images" element={<ImagesPage />} />
    <Route path="/storage/images/:id" element={<ImageDetailPage />} />
    <Route path="/storage/physical-disks" element={<PhysicalDisksPage />} />
    <Route path="/storage/performance" element={<OverallPerformancePage />} />
    <Route path="/storage/file-systems" element={<FileSystemsPage />} />
    <Route path="/storage/file-systems/:id" element={<FileSystemDetailPage />} />
    <Route path="/storage/nfs" element={<NFSPage />} />
    <Route path="/storage/nfs/:id" element={<NFSExportDetailPage />} />
  </>
);
