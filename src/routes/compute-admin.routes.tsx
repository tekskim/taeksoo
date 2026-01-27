import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load Compute Admin pages - All pages are separate from compute to avoid cross-editing
const ComputeAdminHomePage = lazy(() => import('@/pages/ComputeAdminHomePage'));

// Instances
const ComputeAdminInstanceListPage = lazy(() => import('@/pages/ComputeAdminInstanceListPage'));
const ComputeAdminInstanceDetailPage = lazy(() => import('@/pages/ComputeAdminInstanceDetailPage'));
const ComputeAdminCreateInstancePage = lazy(() => import('@/pages/ComputeAdminCreateInstancePage'));

// Instance Templates
const ComputeAdminInstanceTemplatesPage = lazy(() => import('@/pages/ComputeAdminInstanceTemplatesPage'));
const ComputeAdminInstanceTemplateDetailPage = lazy(() => import('@/pages/ComputeAdminInstanceTemplateDetailPage'));
const ComputeAdminCreateTemplatePage = lazy(() => import('@/pages/ComputeAdminCreateTemplatePage'));

// Instance Snapshots
const ComputeAdminInstanceSnapshotsPage = lazy(() => import('@/pages/ComputeAdminInstanceSnapshotsPage'));
const ComputeAdminInstanceSnapshotDetailPage = lazy(() => import('@/pages/ComputeAdminInstanceSnapshotDetailPage'));

// Images
const ComputeAdminImagesPage = lazy(() => import('@/pages/ComputeAdminImagesPage'));
const ComputeAdminImageDetailPage = lazy(() => import('@/pages/ComputeAdminImageDetailPage'));

// Flavors
const ComputeAdminFlavorsPage = lazy(() => import('@/pages/ComputeAdminFlavorsPage'));
const ComputeAdminFlavorDetailPage = lazy(() => import('@/pages/ComputeAdminFlavorDetailPage'));
const ComputeAdminCreateFlavorPage = lazy(() => import('@/pages/ComputeAdminCreateFlavorPage'));

// Server Groups
const ComputeAdminServerGroupsPage = lazy(() => import('@/pages/ComputeAdminServerGroupsPage'));
const ComputeAdminServerGroupDetailPage = lazy(() => import('@/pages/ComputeAdminServerGroupDetailPage'));

// Host Aggregates & Bare Metal
const ComputeAdminHostAggregatesPage = lazy(() => import('@/pages/ComputeAdminHostAggregatesPage'));
const ComputeAdminBareMetalNodesPage = lazy(() => import('@/pages/ComputeAdminBareMetalNodesPage'));
const ComputeAdminBareMetalDetailPage = lazy(() => import('@/pages/ComputeAdminBareMetalDetailPage'));

// Storage - Volumes
const ComputeAdminVolumesPage = lazy(() => import('@/pages/ComputeAdminVolumesPage'));
const ComputeAdminVolumeDetailPage = lazy(() => import('@/pages/ComputeAdminVolumeDetailPage'));
const ComputeAdminVolumeSnapshotsPage = lazy(() => import('@/pages/ComputeAdminVolumeSnapshotsPage'));
const ComputeAdminVolumeSnapshotDetailPage = lazy(() => import('@/pages/ComputeAdminVolumeSnapshotDetailPage'));
const ComputeAdminVolumeBackupsPage = lazy(() => import('@/pages/ComputeAdminVolumeBackupsPage'));
const ComputeAdminVolumeBackupDetailPage = lazy(() => import('@/pages/ComputeAdminVolumeBackupDetailPage'));

// Network
const ComputeAdminNetworksPage = lazy(() => import('@/pages/ComputeAdminNetworksPage'));
const ComputeAdminNetworkDetailPage = lazy(() => import('@/pages/ComputeAdminNetworkDetailPage'));
const ComputeAdminCreateNetworkPage = lazy(() => import('@/pages/ComputeAdminCreateNetworkPage'));
const ComputeAdminSubnetDetailPage = lazy(() => import('@/pages/ComputeAdminSubnetDetailPage'));
const ComputeAdminRoutersPage = lazy(() => import('@/pages/ComputeAdminRoutersPage'));
const ComputeAdminRouterDetailPage = lazy(() => import('@/pages/ComputeAdminRouterDetailPage'));
const ComputeAdminPortsPage = lazy(() => import('@/pages/ComputeAdminPortsPage'));
const ComputeAdminPortDetailPage = lazy(() => import('@/pages/ComputeAdminPortDetailPage'));
const ComputeAdminFloatingIPsPage = lazy(() => import('@/pages/ComputeAdminFloatingIPsPage'));
const ComputeAdminFloatingIPDetailPage = lazy(() => import('@/pages/ComputeAdminFloatingIPDetailPage'));

// Security
const ComputeAdminSecurityGroupsPage = lazy(() => import('@/pages/ComputeAdminSecurityGroupsPage'));
const ComputeAdminSecurityGroupDetailPage = lazy(() => import('@/pages/ComputeAdminSecurityGroupDetailPage'));
const ComputeAdminLoadBalancersPage = lazy(() => import('@/pages/ComputeAdminLoadBalancersPage'));
const ComputeAdminLoadBalancerDetailPage = lazy(() => import('@/pages/ComputeAdminLoadBalancerDetailPage'));
const ComputeAdminListenerDetailPage = lazy(() => import('@/pages/ComputeAdminListenerDetailPage'));
const ComputeAdminPoolDetailPage = lazy(() => import('@/pages/ComputeAdminPoolDetailPage'));
const ComputeAdminL7PolicyDetailPage = lazy(() => import('@/pages/ComputeAdminL7PolicyDetailPage'));
const ComputeAdminCertificatesPage = lazy(() => import('@/pages/ComputeAdminCertificatesPage'));
const ComputeAdminCertificateDetailPage = lazy(() => import('@/pages/ComputeAdminCertificateDetailPage'));

// Other
const ComputeAdminTopologyD3Page = lazy(() => import('@/pages/ComputeAdminTopologyD3Page'));
const ComputeAdminConsolePage = lazy(() => import('@/pages/ComputeAdminConsolePage'));

export const computeAdminRoutes = (
  <>
    {/* Compute Admin Home */}
    <Route path="/compute-admin" element={<ComputeAdminHomePage />} />

    {/* Instances */}
    <Route path="/compute-admin/instances" element={<ComputeAdminInstanceListPage />} />
    <Route path="/compute-admin/instances/create" element={<ComputeAdminCreateInstancePage />} />
    <Route path="/compute-admin/instances/:id" element={<ComputeAdminInstanceDetailPage />} />

    {/* Instance Templates */}
    <Route path="/compute-admin/instance-templates" element={<ComputeAdminInstanceTemplatesPage />} />
    <Route path="/compute-admin/instance-templates/create" element={<ComputeAdminCreateTemplatePage />} />
    <Route path="/compute-admin/instance-templates/:id" element={<ComputeAdminInstanceTemplateDetailPage />} />

    {/* Instance Snapshots */}
    <Route path="/compute-admin/instance-snapshots" element={<ComputeAdminInstanceSnapshotsPage />} />
    <Route path="/compute-admin/instance-snapshots/:id" element={<ComputeAdminInstanceSnapshotDetailPage />} />

    {/* Images */}
    <Route path="/compute-admin/images" element={<ComputeAdminImagesPage />} />
    <Route path="/compute-admin/images/:id" element={<ComputeAdminImageDetailPage />} />

    {/* Flavors */}
    <Route path="/compute-admin/flavors" element={<ComputeAdminFlavorsPage />} />
    <Route path="/compute-admin/flavors/create" element={<ComputeAdminCreateFlavorPage />} />
    <Route path="/compute-admin/flavors/:id" element={<ComputeAdminFlavorDetailPage />} />

    {/* Server Groups */}
    <Route path="/compute-admin/server-groups" element={<ComputeAdminServerGroupsPage />} />
    <Route path="/compute-admin/server-groups/:id" element={<ComputeAdminServerGroupDetailPage />} />

    {/* Host Aggregates & Bare Metal */}
    <Route path="/compute-admin/host-aggregates" element={<ComputeAdminHostAggregatesPage />} />
    <Route path="/compute-admin/bare-metal-nodes" element={<ComputeAdminBareMetalNodesPage />} />
    <Route path="/compute-admin/bare-metal-nodes/:id" element={<ComputeAdminBareMetalDetailPage />} />

    {/* Storage - Volumes */}
    <Route path="/compute-admin/volumes" element={<ComputeAdminVolumesPage />} />
    <Route path="/compute-admin/volumes/:id" element={<ComputeAdminVolumeDetailPage />} />
    <Route path="/compute-admin/volume-snapshots" element={<ComputeAdminVolumeSnapshotsPage />} />
    <Route path="/compute-admin/volume-snapshots/:id" element={<ComputeAdminVolumeSnapshotDetailPage />} />
    <Route path="/compute-admin/volume-backups" element={<ComputeAdminVolumeBackupsPage />} />
    <Route path="/compute-admin/volume-backups/:id" element={<ComputeAdminVolumeBackupDetailPage />} />

    {/* Network */}
    <Route path="/compute-admin/networks" element={<ComputeAdminNetworksPage />} />
    <Route path="/compute-admin/networks/create" element={<ComputeAdminCreateNetworkPage />} />
    <Route path="/compute-admin/networks/:id" element={<ComputeAdminNetworkDetailPage />} />
    <Route path="/compute-admin/subnets/:id" element={<ComputeAdminSubnetDetailPage />} />
    <Route path="/compute-admin/routers" element={<ComputeAdminRoutersPage />} />
    <Route path="/compute-admin/routers/:id" element={<ComputeAdminRouterDetailPage />} />
    <Route path="/compute-admin/ports" element={<ComputeAdminPortsPage />} />
    <Route path="/compute-admin/ports/:id" element={<ComputeAdminPortDetailPage />} />
    <Route path="/compute-admin/floating-ips" element={<ComputeAdminFloatingIPsPage />} />
    <Route path="/compute-admin/floating-ips/:id" element={<ComputeAdminFloatingIPDetailPage />} />

    {/* Security */}
    <Route path="/compute-admin/security-groups" element={<ComputeAdminSecurityGroupsPage />} />
    <Route path="/compute-admin/security-groups/:id" element={<ComputeAdminSecurityGroupDetailPage />} />
    <Route path="/compute-admin/load-balancers" element={<ComputeAdminLoadBalancersPage />} />
    <Route path="/compute-admin/load-balancers/:id" element={<ComputeAdminLoadBalancerDetailPage />} />
    <Route path="/compute-admin/listeners/:id" element={<ComputeAdminListenerDetailPage />} />
    <Route path="/compute-admin/pools/:id" element={<ComputeAdminPoolDetailPage />} />
    <Route path="/compute-admin/l7-policies/:id" element={<ComputeAdminL7PolicyDetailPage />} />
    <Route path="/compute-admin/certificates" element={<ComputeAdminCertificatesPage />} />
    <Route path="/compute-admin/certificates/:id" element={<ComputeAdminCertificateDetailPage />} />

    {/* Other */}
    <Route path="/compute-admin/topology" element={<ComputeAdminTopologyD3Page />} />
    <Route path="/compute-admin/console/:instanceId" element={<ComputeAdminConsolePage />} />
  </>
);
