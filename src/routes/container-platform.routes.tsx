import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';

const OverviewPage = lazy(() => import('@/pages/container-platform/OverviewPage'));
const ClustersPage = lazy(() => import('@/pages/container-platform/ClustersPage'));
const ClusterDetailPage = lazy(() => import('@/pages/container-platform/ClusterDetailPage'));
const NodesPage = lazy(() => import('@/pages/container-platform/NodesPage'));
const NodeDetailPage = lazy(() => import('@/pages/container-platform/NodeDetailPage'));
const NamespacesPage = lazy(() => import('@/pages/container-platform/NamespacesPage'));
const EventsPage = lazy(() => import('@/pages/container-platform/EventsPage'));
const WorkloadsPage = lazy(() => import('@/pages/container-platform/WorkloadsPage'));
const AIWorkloadsPage = lazy(() => import('@/pages/container-platform/AIWorkloadsPage'));
const SearchPage = lazy(() => import('@/pages/container-platform/SearchPage'));

export const containerPlatformRoutes = (
  <>
    <Route path="/container-platform/overview" element={<OverviewPage />} />
    <Route path="/container-platform/clusters" element={<ClustersPage />} />
    <Route path="/container-platform/clusters/:clusterId" element={<ClusterDetailPage />} />
    <Route path="/container-platform/nodes" element={<NodesPage />} />
    <Route path="/container-platform/nodes/:nodeId" element={<NodeDetailPage />} />
    <Route path="/container-platform/namespaces" element={<NamespacesPage />} />
    <Route path="/container-platform/events" element={<EventsPage />} />
    <Route path="/container-platform/workloads" element={<WorkloadsPage />} />
    <Route path="/container-platform/ai-workloads" element={<AIWorkloadsPage />} />
    <Route path="/container-platform/search" element={<SearchPage />} />
    <Route
      path="/container-platform/*"
      element={<Navigate to="/container-platform/overview" replace />}
    />
  </>
);
