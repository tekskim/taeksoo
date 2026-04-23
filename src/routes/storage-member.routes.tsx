import { lazy } from 'react';
import { Route } from 'react-router-dom';

const StorageMemberHomePage = lazy(() => import('@/pages/StorageMemberHomePage'));
const BucketsPage = lazy(() => import('@/pages/storage-member/BucketsPage'));
const BucketDetailPage = lazy(() => import('@/pages/storage-member/BucketDetailPage'));
const CreateBucketPage = lazy(() => import('@/pages/storage-member/CreateBucketPage'));
const EditBucketPage = lazy(() => import('@/pages/storage-member/EditBucketPage'));

export const storageMemberRoutes = (
  <>
    <Route path="/storage-member" element={<StorageMemberHomePage />} />
    <Route path="/storage-member/buckets" element={<BucketsPage />} />
    <Route path="/storage-member/buckets/create" element={<CreateBucketPage />} />
    <Route path="/storage-member/buckets/:id/edit" element={<EditBucketPage />} />
    <Route path="/storage-member/buckets/:id" element={<BucketDetailPage />} />
  </>
);
