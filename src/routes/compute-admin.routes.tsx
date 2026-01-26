import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load pages - temporarily using the original Compute pages
// TODO: Replace with compute-admin specific pages once basic routing works
const ComputeAdminHomePage = lazy(() => import('@/pages/ComputeAdminHomePage'));
const InstanceListPage = lazy(() => import('@/pages/InstanceListPage'));
const InstanceDetailPage = lazy(() => import('@/pages/InstanceDetailPage'));
const CreateInstancePage = lazy(() => import('@/pages/CreateInstancePage'));
const InstanceTemplatesPage = lazy(() => import('@/pages/InstanceTemplatesPage'));
const InstanceTemplateDetailPage = lazy(() => import('@/pages/InstanceTemplateDetailPage'));
const CreateTemplatePage = lazy(() => import('@/pages/CreateTemplatePage'));
const ComputeAdminInstanceSnapshotsPage = lazy(() => import('@/pages/ComputeAdminInstanceSnapshotsPage'));
const ComputeAdminInstanceSnapshotDetailPage = lazy(() => import('@/pages/ComputeAdminInstanceSnapshotDetailPage'));
const ComputeAdminImagesPage = lazy(() => import('@/pages/ComputeAdminImagesPage'));
const ComputeAdminImageDetailPage = lazy(() => import('@/pages/ComputeAdminImageDetailPage'));
const ComputeAdminFlavorsPage = lazy(() => import('@/pages/ComputeAdminFlavorsPage'));
const ComputeAdminFlavorDetailPage = lazy(() => import('@/pages/ComputeAdminFlavorDetailPage'));
const KeyPairsPage = lazy(() => import('@/pages/KeyPairsPage'));
const KeyPairDetailPage = lazy(() => import('@/pages/KeyPairDetailPage'));
const ServerGroupsPage = lazy(() => import('@/pages/ServerGroupsPage'));
const ServerGroupDetailPage = lazy(() => import('@/pages/ServerGroupDetailPage'));
const VolumesPage = lazy(() => import('@/pages/VolumesPage'));
const VolumeDetailPage = lazy(() => import('@/pages/VolumeDetailPage'));
const VolumeSnapshotsPage = lazy(() => import('@/pages/VolumeSnapshotsPage'));
const VolumeSnapshotDetailPage = lazy(() => import('@/pages/VolumeSnapshotDetailPage'));
const VolumeBackupsPage = lazy(() => import('@/pages/VolumeBackupsPage'));
const VolumeBackupDetailPage = lazy(() => import('@/pages/VolumeBackupDetailPage'));
const NetworksPage = lazy(() => import('@/pages/NetworksPage'));
const NetworkDetailPage = lazy(() => import('@/pages/NetworkDetailPage'));
const CreateNetworkPage = lazy(() => import('@/pages/CreateNetworkPage'));
const RoutersPage = lazy(() => import('@/pages/RoutersPage'));
const RouterDetailPage = lazy(() => import('@/pages/RouterDetailPage'));
const PortsPage = lazy(() => import('@/pages/PortsPage'));
const PortDetailPage = lazy(() => import('@/pages/PortDetailPage'));
const FloatingIPsPage = lazy(() => import('@/pages/FloatingIPsPage'));
const FloatingIPDetailPage = lazy(() => import('@/pages/FloatingIPDetailPage'));
const SecurityGroupsPage = lazy(() => import('@/pages/SecurityGroupsPage'));
const SecurityGroupDetailPage = lazy(() => import('@/pages/SecurityGroupDetailPage'));
const LoadBalancersPage = lazy(() => import('@/pages/LoadBalancersPage'));
const LoadBalancerDetailPage = lazy(() => import('@/pages/LoadBalancerDetailPage'));
const CertificatesPage = lazy(() => import('@/pages/CertificatesPage'));
const CertificateDetailPage = lazy(() => import('@/pages/CertificateDetailPage'));
const SubnetDetailPage = lazy(() => import('@/pages/SubnetDetailPage'));
const ListenerDetailPage = lazy(() => import('@/pages/ListenerDetailPage'));
const PoolDetailPage = lazy(() => import('@/pages/PoolDetailPage'));
const L7PolicyDetailPage = lazy(() => import('@/pages/L7PolicyDetailPage'));
const TopologyD3Page = lazy(() => import('@/pages/TopologyD3Page'));
const ConsolePage = lazy(() => import('@/pages/ConsolePage'));

export const computeAdminRoutes = (
  <>
    {/* Compute Admin Routes */}
    <Route path="/compute-admin" element={<ComputeAdminHomePage />} />
    <Route path="/compute-admin/instances" element={<InstanceListPage />} />
    <Route path="/compute-admin/instances/create" element={<CreateInstancePage />} />
    <Route path="/compute-admin/instances/:id" element={<InstanceDetailPage />} />
    <Route path="/compute-admin/instance-templates" element={<InstanceTemplatesPage />} />
    <Route path="/compute-admin/instance-templates/create" element={<CreateTemplatePage />} />
    <Route path="/compute-admin/instance-templates/:id" element={<InstanceTemplateDetailPage />} />
    <Route path="/compute-admin/instance-snapshots" element={<ComputeAdminInstanceSnapshotsPage />} />
    <Route path="/compute-admin/instance-snapshots/:id" element={<ComputeAdminInstanceSnapshotDetailPage />} />
    <Route path="/compute-admin/images" element={<ComputeAdminImagesPage />} />
    <Route path="/compute-admin/images/:id" element={<ComputeAdminImageDetailPage />} />
    <Route path="/compute-admin/flavors" element={<ComputeAdminFlavorsPage />} />
    <Route path="/compute-admin/flavors/:id" element={<ComputeAdminFlavorDetailPage />} />
    <Route path="/compute-admin/key-pairs" element={<KeyPairsPage />} />
    <Route path="/compute-admin/key-pairs/:id" element={<KeyPairDetailPage />} />
    <Route path="/compute-admin/server-groups" element={<ServerGroupsPage />} />
    <Route path="/compute-admin/server-groups/:id" element={<ServerGroupDetailPage />} />
    <Route path="/compute-admin/volumes" element={<VolumesPage />} />
    <Route path="/compute-admin/volumes/:id" element={<VolumeDetailPage />} />
    <Route path="/compute-admin/volume-snapshots" element={<VolumeSnapshotsPage />} />
    <Route path="/compute-admin/volume-snapshots/:id" element={<VolumeSnapshotDetailPage />} />
    <Route path="/compute-admin/volume-backups" element={<VolumeBackupsPage />} />
    <Route path="/compute-admin/volume-backups/:id" element={<VolumeBackupDetailPage />} />
    <Route path="/compute-admin/networks" element={<NetworksPage />} />
    <Route path="/compute-admin/networks/create" element={<CreateNetworkPage />} />
    <Route path="/compute-admin/networks/:id" element={<NetworkDetailPage />} />
    <Route path="/compute-admin/subnets/:id" element={<SubnetDetailPage />} />
    <Route path="/compute-admin/routers" element={<RoutersPage />} />
    <Route path="/compute-admin/routers/:id" element={<RouterDetailPage />} />
    <Route path="/compute-admin/ports" element={<PortsPage />} />
    <Route path="/compute-admin/ports/:id" element={<PortDetailPage />} />
    <Route path="/compute-admin/floating-ips" element={<FloatingIPsPage />} />
    <Route path="/compute-admin/floating-ips/:id" element={<FloatingIPDetailPage />} />
    <Route path="/compute-admin/security-groups" element={<SecurityGroupsPage />} />
    <Route path="/compute-admin/security-groups/:id" element={<SecurityGroupDetailPage />} />
    <Route path="/compute-admin/load-balancers" element={<LoadBalancersPage />} />
    <Route path="/compute-admin/load-balancers/:id" element={<LoadBalancerDetailPage />} />
    <Route path="/compute-admin/listeners/:id" element={<ListenerDetailPage />} />
    <Route path="/compute-admin/pools/:id" element={<PoolDetailPage />} />
    <Route path="/compute-admin/l7-policies/:id" element={<L7PolicyDetailPage />} />
    <Route path="/compute-admin/certificates" element={<CertificatesPage />} />
    <Route path="/compute-admin/certificates/:id" element={<CertificateDetailPage />} />
    <Route path="/compute-admin/topology" element={<TopologyD3Page />} />
    <Route path="/compute-admin/console/:instanceId" element={<ConsolePage />} />
  </>
);
