import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';

const OverviewPage = lazy(() => import('@/pages/container-platform/OverviewPage'));
const ClustersPage = lazy(() => import('@/pages/container-platform/ClustersPage'));
const ClusterDetailPage = lazy(() => import('@/pages/container-platform/ClusterDetailPage'));
const NodesPage = lazy(() => import('@/pages/container-platform/NodesPage'));
const NodeDetailPage = lazy(() => import('@/pages/container-platform/NodeDetailPage'));
const NamespacesPage = lazy(() => import('@/pages/container-platform/NamespacesPage'));
const VolumesPage = lazy(() => import('@/pages/container-platform/VolumesPage'));
const EventsPage = lazy(() => import('@/pages/container-platform/EventsPage'));
const WorkloadsPage = lazy(() => import('@/pages/container-platform/WorkloadsPage'));
const AIWorkloadsPage = lazy(() => import('@/pages/container-platform/AIWorkloadsPage'));
const SearchPage = lazy(() => import('@/pages/container-platform/SearchPage'));

// Cluster scope (manage)
const ManageOverviewPage = lazy(
  () => import('@/pages/container-platform/manage/ManageOverviewPage')
);
const ManageWorkloadsPage = lazy(
  () => import('@/pages/container-platform/manage/ManageWorkloadsPage')
);
const ManageWorkloadDetailPage = lazy(
  () => import('@/pages/container-platform/manage/ManageWorkloadDetailPage')
);
const CreateDeploymentEasyPage = lazy(
  () => import('@/pages/container-platform/manage/CreateDeploymentEasyPage')
);
const ManageVolumesPage = lazy(() => import('@/pages/container-platform/manage/ManageVolumesPage'));
const ManageEventsPage = lazy(() => import('@/pages/container-platform/manage/ManageEventsPage'));
const ManagePlaceholderPage = lazy(
  () => import('@/pages/container-platform/manage/ManagePlaceholderPage')
);

export const containerPlatformRoutes = (
  <>
    {/* Estate scope */}
    <Route path="/container-platform/overview" element={<OverviewPage />} />
    <Route path="/container-platform/clusters" element={<ClustersPage />} />
    <Route path="/container-platform/clusters/:clusterId" element={<ClusterDetailPage />} />
    <Route path="/container-platform/nodes" element={<NodesPage />} />
    <Route path="/container-platform/nodes/:nodeId" element={<NodeDetailPage />} />
    <Route path="/container-platform/namespaces" element={<NamespacesPage />} />
    <Route path="/container-platform/volumes" element={<VolumesPage />} />
    <Route path="/container-platform/events" element={<EventsPage />} />
    <Route path="/container-platform/workloads" element={<WorkloadsPage />} />
    <Route path="/container-platform/ai-workloads" element={<AIWorkloadsPage />} />
    <Route path="/container-platform/search" element={<SearchPage />} />

    {/* Cluster scope (manage) */}
    <Route path="/container-platform/clusters/:clusterId/manage" element={<ManageOverviewPage />} />
    <Route
      path="/container-platform/clusters/:clusterId/manage/workloads"
      element={<ManageWorkloadsPage />}
    />
    <Route
      path="/container-platform/clusters/:clusterId/manage/workloads/create"
      element={<CreateDeploymentEasyPage />}
    />
    <Route
      path="/container-platform/clusters/:clusterId/manage/workloads/:workloadId"
      element={<ManageWorkloadDetailPage />}
    />
    <Route
      path="/container-platform/clusters/:clusterId/manage/volumes"
      element={<ManageVolumesPage />}
    />
    <Route
      path="/container-platform/clusters/:clusterId/manage/events"
      element={<ManageEventsPage />}
    />
    <Route
      path="/container-platform/clusters/:clusterId/manage/:section"
      element={<ManagePlaceholderPage />}
    />

    <Route
      path="/container-platform/*"
      element={<Navigate to="/container-platform/overview" replace />}
    />
  </>
);
