import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';

const OverviewPage = lazy(() => import('@/pages/container-platform/OverviewPage'));
const ClustersPage = lazy(() => import('@/pages/container-platform/ClustersPage'));
const ClusterDetailPage = lazy(() => import('@/pages/container-platform/ClusterDetailPage'));
const NodesPage = lazy(() => import('@/pages/container-platform/NodesPage'));
const WorkloadsPage = lazy(() => import('@/pages/container-platform/WorkloadsPage'));

export const containerPlatformRoutes = (
  <>
    <Route path="/container-platform/overview" element={<OverviewPage />} />
    <Route path="/container-platform/clusters" element={<ClustersPage />} />
    <Route path="/container-platform/clusters/:clusterId" element={<ClusterDetailPage />} />
    <Route path="/container-platform/nodes" element={<NodesPage />} />
    <Route path="/container-platform/workloads" element={<WorkloadsPage />} />
    <Route
      path="/container-platform/*"
      element={<Navigate to="/container-platform/overview" replace />}
    />
  </>
);
