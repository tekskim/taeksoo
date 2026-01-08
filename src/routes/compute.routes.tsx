import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load all compute pages for code splitting
// Most pages use default export, so we import them directly
const InstanceListPage = lazy(() => import('@/pages/InstanceListPage'));
const InstanceDetailPage = lazy(() => import('@/pages/InstanceDetailPage'));
const CreateInstancePage = lazy(() => import('@/pages/CreateInstancePage'));
const InstanceTemplatesPage = lazy(() => import('@/pages/InstanceTemplatesPage'));
const InstanceTemplateDetailPage = lazy(() => import('@/pages/InstanceTemplateDetailPage'));
const InstanceSnapshotsPage = lazy(() => import('@/pages/InstanceSnapshotsPage'));
const InstanceSnapshotDetailPage = lazy(() => import('@/pages/InstanceSnapshotDetailPage'));
const ImagesPage = lazy(() => import('@/pages/ImagesPage'));
const ImageDetailPage = lazy(() => import('@/pages/ImageDetailPage'));
const FlavorsPage = lazy(() => import('@/pages/FlavorsPage'));
const FlavorDetailPage = lazy(() => import('@/pages/FlavorDetailPage'));
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

export const computeRoutes = (
  <>
    {/* Compute Routes */}
    <Route path="/compute" element={<InstanceListPage />} />
    <Route path="/compute/instances" element={<InstanceListPage />} />
    <Route path="/compute/instances/create" element={<CreateInstancePage />} />
    <Route path="/compute/instances/:id" element={<InstanceDetailPage />} />
    <Route path="/compute/instance-templates" element={<InstanceTemplatesPage />} />
    <Route path="/compute/instance-templates/:id" element={<InstanceTemplateDetailPage />} />
    <Route path="/compute/instance-snapshots" element={<InstanceSnapshotsPage />} />
    <Route path="/compute/instance-snapshots/:id" element={<InstanceSnapshotDetailPage />} />
    <Route path="/compute/images" element={<ImagesPage />} />
    <Route path="/compute/images/:id" element={<ImageDetailPage />} />
    <Route path="/compute/flavors" element={<FlavorsPage />} />
    <Route path="/compute/flavors/:id" element={<FlavorDetailPage />} />
    <Route path="/compute/key-pairs" element={<KeyPairsPage />} />
    <Route path="/compute/key-pairs/:id" element={<KeyPairDetailPage />} />
    <Route path="/compute/server-groups" element={<ServerGroupsPage />} />
    <Route path="/compute/server-groups/:id" element={<ServerGroupDetailPage />} />
    <Route path="/compute/volumes" element={<VolumesPage />} />
    <Route path="/compute/volumes/:id" element={<VolumeDetailPage />} />
    <Route path="/compute/volume-snapshots" element={<VolumeSnapshotsPage />} />
    <Route path="/compute/volume-snapshots/:id" element={<VolumeSnapshotDetailPage />} />
    <Route path="/compute/volume-backups" element={<VolumeBackupsPage />} />
    <Route path="/compute/volume-backups/:id" element={<VolumeBackupDetailPage />} />
    <Route path="/compute/networks" element={<NetworksPage />} />
    <Route path="/compute/networks/:id" element={<NetworkDetailPage />} />
    <Route path="/compute/subnets/:id" element={<SubnetDetailPage />} />
    <Route path="/compute/routers" element={<RoutersPage />} />
    <Route path="/compute/routers/:id" element={<RouterDetailPage />} />
    <Route path="/compute/ports" element={<PortsPage />} />
    <Route path="/compute/ports/:id" element={<PortDetailPage />} />
    <Route path="/compute/floating-ips" element={<FloatingIPsPage />} />
    <Route path="/compute/floating-ips/:id" element={<FloatingIPDetailPage />} />
    <Route path="/compute/security-groups" element={<SecurityGroupsPage />} />
    <Route path="/compute/security-groups/:id" element={<SecurityGroupDetailPage />} />
    <Route path="/compute/load-balancers" element={<LoadBalancersPage />} />
    <Route path="/compute/load-balancers/:id" element={<LoadBalancerDetailPage />} />
    <Route path="/compute/listeners/:id" element={<ListenerDetailPage />} />
    <Route path="/compute/pools/:id" element={<PoolDetailPage />} />
    <Route path="/compute/l7-policies/:id" element={<L7PolicyDetailPage />} />
    <Route path="/compute/certificates" element={<CertificatesPage />} />
    <Route path="/compute/certificates/:id" element={<CertificateDetailPage />} />
    <Route path="/compute/topology" element={<TopologyD3Page />} />
    <Route path="/compute/console/:instanceId" element={<ConsolePage />} />
  </>
);

