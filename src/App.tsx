import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TabProvider } from '@/contexts/TabContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { DarkModeProvider } from '@/hooks/useDarkMode';
import { ProjectProvider } from '@/contexts/ProjectContext';

// Entry Page
import { EntryPage } from '@/pages/EntryPage';

// Pages - Settings
import { SettingsPageWrapper } from '@/pages/SettingsPageWrapper';

// Pages - Mail Template
import { MailTemplatePage } from '@/pages/MailTemplatePage';
import { MailTemplatePreviewPage } from '@/pages/MailTemplatePreviewPage';

// Pages - Compute
import { InstanceListPage } from '@/pages/InstanceListPage';
import { InstanceDetailPage } from '@/pages/InstanceDetailPage';
import { HomePage } from '@/pages/HomePage';
import { ComputeHomePage } from '@/pages/ComputeHomePage';
import { ComputeAdminHomePage } from '@/pages/ComputeAdminHomePage';
import { InstanceTemplatesPage } from '@/pages/InstanceTemplatesPage';
import { ComputeAdminInstanceTemplatesPage } from '@/pages/ComputeAdminInstanceTemplatesPage';
import { InstanceTemplateDetailPage } from '@/pages/InstanceTemplateDetailPage';
import { InstanceSnapshotsPage } from '@/pages/InstanceSnapshotsPage';
import { ComputeAdminInstanceSnapshotsPage } from '@/pages/ComputeAdminInstanceSnapshotsPage';
import { InstanceSnapshotDetailPage } from '@/pages/InstanceSnapshotDetailPage';
import { ComputeAdminInstanceSnapshotDetailPage } from '@/pages/ComputeAdminInstanceSnapshotDetailPage';
import { ImagesPage } from '@/pages/ImagesPage';
import { ComputeImagesPage } from '@/pages/ComputeImagesPage';
import { ImageDetailPage } from '@/pages/ImageDetailPage';
import { ComputeImageDetailPage } from '@/pages/ComputeImageDetailPage';
import { BucketsPage } from '@/pages/BucketsPage';
import { BucketDetailPage } from '@/pages/BucketDetailPage';
import CreateBucketPage from '@/pages/CreateBucketPage';
import { FlavorsPage } from '@/pages/FlavorsPage';
import { FlavorDetailPage } from '@/pages/FlavorDetailPage';
import { KeyPairsPage } from '@/pages/KeyPairsPage';
import { KeyPairDetailPage } from '@/pages/KeyPairDetailPage';
import { ServerGroupsPage } from '@/pages/ServerGroupsPage';
import { ServerGroupDetailPage } from '@/pages/ServerGroupDetailPage';
import { VolumesPage } from '@/pages/VolumesPage';
import { VolumeDetailPage } from '@/pages/VolumeDetailPage';
import { CreateVolumePage } from '@/pages/CreateVolumePage';
import { VolumeSnapshotsPage } from '@/pages/VolumeSnapshotsPage';
import { VolumeSnapshotDetailPage } from '@/pages/VolumeSnapshotDetailPage';
import { VolumeBackupsPage } from '@/pages/VolumeBackupsPage';
import { VolumeBackupDetailPage } from '@/pages/VolumeBackupDetailPage';
import { NetworksPage } from '@/pages/NetworksPage';
import NetworkDetailPage from '@/pages/NetworkDetailPage';
import CreateNetworkPage from '@/pages/CreateNetworkPage';
import CreateVirtualAdapterPage from '@/pages/CreateVirtualAdapterPage';
import { RoutersPage } from '@/pages/RoutersPage';
import RouterDetailPage from '@/pages/RouterDetailPage';
import { PortsPage } from '@/pages/PortsPage';
import PortDetailPage from '@/pages/PortDetailPage';
import { FloatingIPsPage } from '@/pages/FloatingIPsPage';
import FloatingIPDetailPage from '@/pages/FloatingIPDetailPage';
import { SecurityGroupsPage } from '@/pages/SecurityGroupsPage';
import SecurityGroupDetailPage from '@/pages/SecurityGroupDetailPage';
import { LoadBalancersPage } from '@/pages/LoadBalancersPage';
import LoadBalancerDetailPage from '@/pages/LoadBalancerDetailPage';
import CreateLoadBalancerPage from '@/pages/CreateLoadBalancerPage';
import { CertificatesPage } from '@/pages/CertificatesPage';
import CertificateDetailPage from '@/pages/CertificateDetailPage';
import SubnetDetailPage from '@/pages/SubnetDetailPage';
import ListenerDetailPage from '@/pages/ListenerDetailPage';
import PoolDetailPage from '@/pages/PoolDetailPage';
import L7PolicyDetailPage from '@/pages/L7PolicyDetailPage';
import { TopologyD3Page } from '@/pages/TopologyD3Page';
import { ConsolePage } from '@/pages/ConsolePage';
import { CreateInstancePage } from '@/pages/CreateInstancePage';
import ComputeAdminBareMetalDetailPage from '@/pages/ComputeAdminBareMetalDetailPage';
import { ComputeAdminInstanceDetailPage } from '@/pages/ComputeAdminInstanceDetailPage';
import { ComputeAdminInstanceListPage } from '@/pages/ComputeAdminInstanceListPage';
import CreateTemplatePage from '@/pages/CreateTemplatePage';
import { ComputeAdminCreateTemplatePage } from '@/pages/ComputeAdminCreateTemplatePage';
import { CreateImagePage } from '@/pages/CreateImagePage';

// Pages - Agent
import { AgentPage } from '@/pages/AgentPage';
import { CreateAgentPage } from '@/pages/CreateAgentPage';
import { ChatPage } from '@/pages/ChatPage';
import { StoragePage } from '@/pages/StoragePage';
import { MCPToolsPage } from '@/pages/MCPToolsPage';
import { StorageHomePage } from '@/pages/StorageHomePage';
import { PoolsPage } from '@/pages/PoolsPage';
import { StoragePoolDetailPage } from '@/pages/StoragePoolDetailPage';
import { HostsPage } from '@/pages/HostsPage';
import HostDetailPage from '@/pages/HostDetailPage';
import { OSDsPage } from '@/pages/OSDsPage';
import { OSDDetailPage } from '@/pages/OSDDetailPage';
import { PhysicalDisksPage } from '@/pages/PhysicalDisksPage';
import { OverallPerformancePage } from '@/pages/OverallPerformancePage';

// Pages - Container
import { ContainerDashboardPage } from '@/pages/ContainerDashboardPage';
import { ContainerHomePage } from '@/pages/ContainerHomePage';
import { ContainerNamespacesPage } from '@/pages/ContainerNamespacesPage';
import { ContainerEventsPage } from '@/pages/ContainerEventsPage';
import { ContainerNodesPage } from '@/pages/ContainerNodesPage';
import { CreateNamespacePage } from '@/pages/CreateNamespacePage';
import { CreateNamespaceYamlPage } from '@/pages/CreateNamespaceYamlPage';
import { EditNamespaceYamlPage } from '@/pages/EditNamespaceYamlPage';
import { CreateDeploymentYamlPage } from '@/pages/CreateDeploymentYamlPage';
import { EditDeploymentYamlPage } from '@/pages/EditDeploymentYamlPage';
import { CreateStatefulSetYamlPage } from '@/pages/CreateStatefulSetYamlPage';
import { EditStatefulSetYamlPage } from '@/pages/EditStatefulSetYamlPage';
import { CreateDaemonSetYamlPage } from '@/pages/CreateDaemonSetYamlPage';
import { EditDaemonSetYamlPage } from '@/pages/EditDaemonSetYamlPage';
import { CreateJobYamlPage } from '@/pages/CreateJobYamlPage';
import { EditJobYamlPage } from '@/pages/EditJobYamlPage';
import { CreateCronJobYamlPage } from '@/pages/CreateCronJobYamlPage';
import { EditCronJobYamlPage } from '@/pages/EditCronJobYamlPage';
import { CreatePodYamlPage } from '@/pages/CreatePodYamlPage';
import { EditPodYamlPage } from '@/pages/EditPodYamlPage';
import { CreatePersistentVolumeYamlPage } from '@/pages/CreatePersistentVolumeYamlPage';
import { EditPersistentVolumeYamlPage } from '@/pages/EditPersistentVolumeYamlPage';
import { CreatePersistentVolumeClaimYamlPage } from '@/pages/CreatePersistentVolumeClaimYamlPage';
import { EditPersistentVolumeClaimYamlPage } from '@/pages/EditPersistentVolumeClaimYamlPage';
import { CreateStorageClassYamlPage } from '@/pages/CreateStorageClassYamlPage';
import { EditStorageClassYamlPage } from '@/pages/EditStorageClassYamlPage';
import { CreateConfigMapYamlPage } from '@/pages/CreateConfigMapYamlPage';
import { EditConfigMapYamlPage } from '@/pages/EditConfigMapYamlPage';
import { CreateSecretYamlPage } from '@/pages/CreateSecretYamlPage';
import { EditSecretYamlPage } from '@/pages/EditSecretYamlPage';
import { CreateLimitRangeYamlPage } from '@/pages/CreateLimitRangeYamlPage';
import { EditLimitRangeYamlPage } from '@/pages/EditLimitRangeYamlPage';
import { CreateResourceQuotaYamlPage } from '@/pages/CreateResourceQuotaYamlPage';
import { EditResourceQuotaYamlPage } from '@/pages/EditResourceQuotaYamlPage';
import { CreateNetworkPolicyYamlPage } from '@/pages/CreateNetworkPolicyYamlPage';
import { EditNetworkPolicyYamlPage } from '@/pages/EditNetworkPolicyYamlPage';
import { CreatePodDisruptionBudgetYamlPage } from '@/pages/CreatePodDisruptionBudgetYamlPage';
import { EditPodDisruptionBudgetYamlPage } from '@/pages/EditPodDisruptionBudgetYamlPage';
import { NamespaceDetailPage } from '@/pages/NamespaceDetailPage';
import { ContainerConsolePage } from '@/pages/ContainerConsolePage';
import { EditNodeConfigPage } from '@/pages/EditNodeConfigPage';
import { EditNodeYamlPage } from '@/pages/EditNodeYamlPage';
import { NodeDetailPage } from '@/pages/NodeDetailPage';
import { ContainerServicesPage } from '@/pages/ContainerServicesPage';
import { ContainerServiceDetailPage } from '@/pages/ContainerServiceDetailPage';
import { CreateServicePage } from '@/pages/CreateServicePage';
import { CreateServiceYamlPage } from '@/pages/CreateServiceYamlPage';
import { EditServiceYamlPage } from '@/pages/EditServiceYamlPage';
import { ContainerIngressesPage } from '@/pages/ContainerIngressesPage';
import { ContainerIngressDetailPage } from '@/pages/ContainerIngressDetailPage';
import { CreateIngressYamlPage } from '@/pages/CreateIngressYamlPage';
import { EditIngressYamlPage } from '@/pages/EditIngressYamlPage';
import { ContainerHPAPage } from '@/pages/ContainerHPAPage';
import { ContainerHPADetailPage } from '@/pages/ContainerHPADetailPage';
import { CreateHPAYamlPage } from '@/pages/CreateHPAYamlPage';
import { EditHPAYamlPage } from '@/pages/EditHPAYamlPage';
import { DeploymentsPage } from '@/pages/DeploymentsPage';
import { CreateDeploymentPage } from '@/pages/CreateDeploymentPage';
import { DeploymentDetailPage } from '@/pages/DeploymentDetailPage';
import { StatefulSetsPage } from '@/pages/StatefulSetsPage';
import { CreateStatefulSetPage } from '@/pages/CreateStatefulSetPage';
import { StatefulSetDetailPage } from '@/pages/StatefulSetDetailPage';
import { DaemonSetsPage } from '@/pages/DaemonSetsPage';
import { CreateDaemonSetPage } from '@/pages/CreateDaemonSetPage';
import { DaemonSetDetailPage } from '@/pages/DaemonSetDetailPage';
import { JobsPage } from '@/pages/JobsPage';
import { CreateJobPage } from '@/pages/CreateJobPage';
import { JobDetailPage } from '@/pages/JobDetailPage';
import { CronJobsPage } from '@/pages/CronJobsPage';
import { CreateCronJobPage } from '@/pages/CreateCronJobPage';
import { CronJobDetailPage } from '@/pages/CronJobDetailPage';
import { PodsPage } from '@/pages/PodsPage';
import { CreatePodPage } from '@/pages/CreatePodPage';
import { PodDetailPage } from '@/pages/PodDetailPage';
import { PersistentVolumesPage } from '@/pages/PersistentVolumesPage';
import { CreatePersistentVolumePage } from '@/pages/CreatePersistentVolumePage';
import { PersistentVolumeDetailPage } from '@/pages/PersistentVolumeDetailPage';
import { CreatePersistentVolumeClaimPage } from '@/pages/CreatePersistentVolumeClaimPage';
import { PersistentVolumeClaimsPage } from '@/pages/PersistentVolumeClaimsPage';
import { PersistentVolumeClaimDetailPage } from '@/pages/PersistentVolumeClaimDetailPage';
import { StorageClassesPage } from '@/pages/StorageClassesPage';
import { StorageClassDetailPage } from '@/pages/StorageClassDetailPage';
import { CreateStorageClassPage } from '@/pages/CreateStorageClassPage';
import { ConfigMapsPage } from '@/pages/ConfigMapsPage';
import { ConfigMapDetailPage } from '@/pages/ConfigMapDetailPage';
import { CreateConfigMapPage } from '@/pages/CreateConfigMapPage';
import { SecretsPage } from '@/pages/SecretsPage';
import { SecretDetailPage } from '@/pages/SecretDetailPage';
import { CreateSecretPage } from '@/pages/CreateSecretPage';
import { LimitRangesPage } from '@/pages/LimitRangesPage';
import { CreateLimitRangePage } from '@/pages/CreateLimitRangePage';
import { ResourceQuotasPage } from '@/pages/ResourceQuotasPage';
import { CreateResourceQuotaPage } from '@/pages/CreateResourceQuotaPage';
import { NetworkPoliciesPage } from '@/pages/NetworkPoliciesPage';
import { CreateNetworkPolicyPage } from '@/pages/CreateNetworkPolicyPage';
import { NetworkPolicyDetailPage } from '@/pages/NetworkPolicyDetailPage';
import { PodDisruptionBudgetsPage } from '@/pages/PodDisruptionBudgetsPage';
import { CreatePodDisruptionBudgetPage } from '@/pages/CreatePodDisruptionBudgetPage';
import { PodDisruptionBudgetDetailPage } from '@/pages/PodDisruptionBudgetDetailPage';

// Pages - IAM
import { IAMHomePage } from '@/pages/IAMHomePage';
import { IAMUsersPage } from '@/pages/IAMUsersPage';
import { IAMUserDetailPage } from '@/pages/IAMUserDetailPage';
import CreateUserPage from '@/pages/CreateUserPage';
import CreateUserGroupPage from '@/pages/CreateUserGroupPage';
import { IAMUserGroupsPage } from '@/pages/IAMUserGroupsPage';
import IAMUserGroupDetailPage from '@/pages/IAMUserGroupDetailPage';
import IAMRolesPage from '@/pages/IAMRolesPage';
import IAMRoleDetailPage from '@/pages/IAMRoleDetailPage';
import CreateRolePage from '@/pages/CreateRolePage';
import IAMPoliciesPage from '@/pages/IAMPoliciesPage';
import IAMPolicyDetailPage from '@/pages/IAMPolicyDetailPage';
import CreatePolicyPage from '@/pages/CreatePolicyPage';
import IAMActiveSessionsPage from '@/pages/IAMActiveSessionsPage';
import IAMDomainsPage from '@/pages/IAMDomainsPage';
import IAMSystemAdministratorsPage from '@/pages/IAMSystemAdministratorsPage';
import IAMSystemAdminDetailPage from '@/pages/IAMSystemAdminDetailPage';
import CreateSystemAdministratorPage from '@/pages/CreateSystemAdministratorPage';
import IAMEventLogsPage from '@/pages/IAMEventLogsPage';
import IAMMFAPoliciesPage from '@/pages/IAMMFAPoliciesPage';
import IAMSessionPoliciesPage from '@/pages/IAMSessionPoliciesPage';
import IAMTokenPoliciesPage from '@/pages/IAMTokenPoliciesPage';
import IAMLoginPoliciesPage from '@/pages/IAMLoginPoliciesPage';

// Pages - Cloud Builder
import { CloudBuilderConsolePage } from '@/pages/cloudbuilder/CloudBuilderConsolePage';
import { CloudBuilderCreatePage } from '@/pages/cloudbuilder/CloudBuilderCreatePage';
import { CloudBuilderDetailPage } from '@/pages/cloudbuilder/CloudBuilderDetailPage';

// Pages - Design System
import { DesignSystemPage } from '@/pages/DesignSystemPage';
import { DrawersPage } from '@/pages/DrawersPage';
import { ModalsPage } from '@/pages/ModalsPage';
import { GradientShowcasePage } from '@/pages/GradientShowcasePage';
import ColorPalettePage from '@/pages/ColorPalettePage';
import MetallicPalettePage from '@/pages/MetallicPalettePage';

// Pages - Desktop
import { DesktopPage } from '@/pages/DesktopPage';

// Pages - Developer Resources
import { SidebarIconsPage } from '@/pages/SidebarIconsPage';

// Pages - AI Platform
import { WorkloadDetailPage } from '@/pages/WorkloadDetailPage';

// Pages - AI Platform
import { AIPlatformPage } from '@/pages/AIPlatformPage';
import { TextGenerationPage } from '@/pages/ai-platform/TextGenerationPage';
import { ExplorePage } from '@/pages/ai-platform/ExplorePage';
import { PackagesPage } from '@/pages/ai-platform/PackagesPage';
import { ModelsPage } from '@/pages/ai-platform/ModelsPage';
import { DatasetsPage } from '@/pages/ai-platform/DatasetsPage';
import { WorkloadsPage } from '@/pages/ai-platform/WorkloadsPage';
import { MyTemplatesPage } from '@/pages/ai-platform/MyTemplatesPage';
import { StoragePage as AIPlatformStoragePage } from '@/pages/ai-platform/StoragePage';
import { ServerlessPage } from '@/pages/ai-platform/ServerlessPage';
import { DevSpacePage } from '@/pages/ai-platform/DevSpacePage';
import { PipelineBuilderPage } from '@/pages/ai-platform/PipelineBuilderPage';
import { BenchmarksPage } from '@/pages/ai-platform/BenchmarksPage';
import { KubeflowPage } from '@/pages/ai-platform/KubeflowPage';
import { MLflowPage } from '@/pages/ai-platform/MLflowPage';
import { SettingsPage as AIPlatformSettingsPage } from '@/pages/ai-platform/SettingsPage';
import { FAQPage } from '@/pages/ai-platform/FAQPage';
import { KueuePage } from '@/pages/ai-platform/KueuePage';
import { MonitoringPage } from '@/pages/ai-platform/MonitoringPage';
import { DependenciesPage } from '@/pages/ai-platform/DependenciesPage';
import { SystemAdminPage } from '@/pages/ai-platform/SystemAdminPage';

// Layouts
import { AgentAppLayout } from '@/layouts';

const defaultTabs = [
  { id: 'home', label: 'Home', path: '/compute', closable: true },
];

function AppRoutes() {
  return (
      <Routes>
        {/* Entry Page */}
        <Route path="/" element={<EntryPage />} />

        {/* Settings & Mail Template Routes */}
        <Route path="/settings" element={<SettingsPageWrapper />} />
        <Route path="/mail-template" element={<MailTemplatePage />} />
        <Route path="/mail-template/:templateId" element={<MailTemplatePreviewPage />} />

        {/* Agent Routes - Shared TabBar via AgentAppLayout */}
        <Route element={<AgentAppLayout />}>
          <Route path="/agent" element={<HomePage />} />
          <Route path="/agent/list" element={<AgentPage />} />
          <Route path="/agent/create" element={<CreateAgentPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/agent/storage" element={<StoragePage />} />
          <Route path="/mcp-tools" element={<MCPToolsPage />} />
        </Route>

        {/* Cloud Builder Routes */}
        <Route path="/cloudbuilder" element={<CloudBuilderConsolePage />} />
        <Route path="/cloudbuilder/:slug" element={<CloudBuilderConsolePage />} />
        <Route path="/cloudbuilder/:slug/create" element={<CloudBuilderCreatePage />} />
        <Route path="/cloudbuilder/:slug/detail/:id" element={<CloudBuilderDetailPage />} />
        {/* Backward compatible route */}
        <Route path="/cloud-builder" element={<CloudBuilderConsolePage />} />
        <Route path="/cloud-builder/:slug" element={<CloudBuilderConsolePage />} />
        <Route path="/cloud-builder/:slug/create" element={<CloudBuilderCreatePage />} />
        <Route path="/cloud-builder/:slug/detail/:id" element={<CloudBuilderDetailPage />} />

        {/* Compute Routes */}
        <Route path="/compute" element={<ComputeHomePage />} />
        <Route path="/compute/instances" element={<InstanceListPage />} />
        <Route path="/compute/instances/create" element={<CreateInstancePage />} />
        <Route path="/compute/instances/:id" element={<InstanceDetailPage />} />
        <Route path="/compute/instance-templates" element={<InstanceTemplatesPage />} />
        <Route path="/compute/instance-templates/create" element={<CreateTemplatePage />} />
        <Route path="/compute/instance-templates/:id" element={<InstanceTemplateDetailPage />} />
        <Route path="/compute/instance-snapshots" element={<InstanceSnapshotsPage />} />
        <Route path="/compute/instance-snapshots/:id" element={<InstanceSnapshotDetailPage />} />
        <Route path="/compute/images" element={<ComputeImagesPage />} />
        <Route path="/compute/images/create" element={<CreateImagePage />} />
        <Route path="/compute/images/:id" element={<ComputeImageDetailPage />} />
        <Route path="/compute/flavors" element={<FlavorsPage />} />
        <Route path="/compute/flavors/:id" element={<FlavorDetailPage />} />
        <Route path="/compute/key-pairs" element={<KeyPairsPage />} />
        <Route path="/compute/key-pairs/:id" element={<KeyPairDetailPage />} />
        <Route path="/compute/server-groups" element={<ServerGroupsPage />} />
        <Route path="/compute/server-groups/:id" element={<ServerGroupDetailPage />} />
        <Route path="/compute/volumes" element={<VolumesPage />} />
        <Route path="/compute/volumes/create" element={<CreateVolumePage />} />
        <Route path="/compute/volumes/:id" element={<VolumeDetailPage />} />
        <Route path="/compute/volume-snapshots" element={<VolumeSnapshotsPage />} />
        <Route path="/compute/volume-snapshots/:id" element={<VolumeSnapshotDetailPage />} />
        <Route path="/compute/volume-backups" element={<VolumeBackupsPage />} />
        <Route path="/compute/volume-backups/:id" element={<VolumeBackupDetailPage />} />
        <Route path="/compute/networks" element={<NetworksPage />} />
        <Route path="/compute/networks/create" element={<CreateNetworkPage />} />
        <Route path="/compute/networks/:id" element={<NetworkDetailPage />} />
        <Route path="/compute/ports/create" element={<CreateVirtualAdapterPage />} />
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
        <Route path="/compute/load-balancers/create" element={<CreateLoadBalancerPage />} />
        <Route path="/compute/load-balancers/:id" element={<LoadBalancerDetailPage />} />
        <Route path="/compute/listeners/:id" element={<ListenerDetailPage />} />
        <Route path="/compute/pools/:id" element={<PoolDetailPage />} />
        <Route path="/compute/l7-policies/:id" element={<L7PolicyDetailPage />} />
        <Route path="/compute/certificates" element={<CertificatesPage />} />
        <Route path="/compute/certificates/:id" element={<CertificateDetailPage />} />
        <Route path="/compute/topology" element={<TopologyD3Page />} />
        <Route path="/compute/console/:instanceId" element={<ConsolePage />} />

        {/* Compute Admin Routes - same pages, different sidebar will be implemented later */}
        <Route path="/compute-admin" element={<ComputeAdminHomePage />} />
        <Route path="/compute-admin/instances" element={<ComputeAdminInstanceListPage />} />
        <Route path="/compute-admin/instances/create" element={<CreateInstancePage />} />
        <Route path="/compute-admin/instances/:id" element={<ComputeAdminInstanceDetailPage />} />
        <Route path="/compute-admin/instance-templates" element={<ComputeAdminInstanceTemplatesPage />} />
        <Route path="/compute-admin/instance-templates/create" element={<ComputeAdminCreateTemplatePage />} />
        <Route path="/compute-admin/instance-templates/:id" element={<InstanceTemplateDetailPage />} />
        <Route path="/compute-admin/instance-snapshots" element={<ComputeAdminInstanceSnapshotsPage />} />
        <Route path="/compute-admin/instance-snapshots/:id" element={<ComputeAdminInstanceSnapshotDetailPage />} />
        <Route path="/compute-admin/images" element={<ComputeImagesPage />} />
        <Route path="/compute-admin/images/create" element={<CreateImagePage />} />
        <Route path="/compute-admin/images/:id" element={<ComputeImageDetailPage />} />
        <Route path="/compute-admin/flavors" element={<FlavorsPage />} />
        <Route path="/compute-admin/flavors/:id" element={<FlavorDetailPage />} />
        <Route path="/compute-admin/key-pairs" element={<KeyPairsPage />} />
        <Route path="/compute-admin/key-pairs/:id" element={<KeyPairDetailPage />} />
        <Route path="/compute-admin/server-groups" element={<ServerGroupsPage />} />
        <Route path="/compute-admin/server-groups/:id" element={<ServerGroupDetailPage />} />
        <Route path="/compute-admin/volumes" element={<VolumesPage />} />
        <Route path="/compute-admin/volumes/create" element={<CreateVolumePage />} />
        <Route path="/compute-admin/volumes/:id" element={<VolumeDetailPage />} />
        <Route path="/compute-admin/volume-snapshots" element={<VolumeSnapshotsPage />} />
        <Route path="/compute-admin/volume-snapshots/:id" element={<VolumeSnapshotDetailPage />} />
        <Route path="/compute-admin/volume-backups" element={<VolumeBackupsPage />} />
        <Route path="/compute-admin/volume-backups/:id" element={<VolumeBackupDetailPage />} />
        <Route path="/compute-admin/networks" element={<NetworksPage />} />
        <Route path="/compute-admin/networks/create" element={<CreateNetworkPage />} />
        <Route path="/compute-admin/networks/:id" element={<NetworkDetailPage />} />
        <Route path="/compute-admin/ports/create" element={<CreateVirtualAdapterPage />} />
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
        <Route path="/compute-admin/load-balancers/create" element={<CreateLoadBalancerPage />} />
        <Route path="/compute-admin/load-balancers/:id" element={<LoadBalancerDetailPage />} />
        <Route path="/compute-admin/listeners/:id" element={<ListenerDetailPage />} />
        <Route path="/compute-admin/pools/:id" element={<PoolDetailPage />} />
        <Route path="/compute-admin/l7-policies/:id" element={<L7PolicyDetailPage />} />
        <Route path="/compute-admin/certificates" element={<CertificatesPage />} />
        <Route path="/compute-admin/certificates/:id" element={<CertificateDetailPage />} />
        <Route path="/compute-admin/topology" element={<TopologyD3Page />} />
        <Route path="/compute-admin/console/:instanceId" element={<ConsolePage />} />
        <Route path="/compute-admin/bare-metal/:id" element={<ComputeAdminBareMetalDetailPage />} />

        {/* Storage Routes */}
        <Route path="/storage" element={<StorageHomePage />} />
        <Route path="/storage/pools" element={<PoolsPage />} />
        <Route path="/storage/pools/:id" element={<StoragePoolDetailPage />} />
        <Route path="/storage/hosts" element={<HostsPage />} />
        <Route path="/storage/hosts/:id" element={<HostDetailPage />} />
        <Route path="/storage/osds" element={<OSDsPage />} />
        <Route path="/storage/osds/:id" element={<OSDDetailPage />} />
        <Route path="/storage/physical-disks" element={<PhysicalDisksPage />} />
        <Route path="/storage/images" element={<ImagesPage />} />
        <Route path="/storage/images/:id" element={<ImageDetailPage />} />
        <Route path="/storage/buckets" element={<BucketsPage />} />
        <Route path="/storage/buckets/create" element={<CreateBucketPage />} />
        <Route path="/storage/buckets/:id" element={<BucketDetailPage />} />
        <Route path="/storage/performance" element={<OverallPerformancePage />} />

        {/* Container Routes */}
        <Route path="/container" element={<ContainerHomePage />} />
        <Route path="/container/dashboard" element={<ContainerDashboardPage />} />
        <Route path="/container/namespaces" element={<ContainerNamespacesPage />} />
        <Route path="/container/namespaces/create" element={<CreateNamespacePage />} />
        <Route path="/container/namespaces/create-yaml" element={<CreateNamespaceYamlPage />} />
        <Route path="/container/namespaces/:namespaceName/edit-yaml" element={<EditNamespaceYamlPage />} />
        <Route path="/container/namespaces/:namespaceName" element={<NamespaceDetailPage />} />
        <Route path="/container/events" element={<ContainerEventsPage />} />
        <Route path="/container/nodes" element={<ContainerNodesPage />} />
        <Route path="/container/nodes/:nodeName/edit" element={<EditNodeConfigPage />} />
        <Route path="/container/nodes/:nodeName/edit-yaml" element={<EditNodeYamlPage />} />
        <Route path="/container/nodes/:nodeName" element={<NodeDetailPage />} />
        <Route path="/container/services" element={<ContainerServicesPage />} />
        <Route path="/container/services/create" element={<CreateServicePage />} />
        <Route path="/container/services/create-yaml" element={<CreateServiceYamlPage />} />
        <Route path="/container/services/:serviceId/edit-yaml" element={<EditServiceYamlPage />} />
        <Route path="/container/services/:serviceId" element={<ContainerServiceDetailPage />} />
        <Route path="/container/ingresses" element={<ContainerIngressesPage />} />
        <Route path="/container/ingresses/create-yaml" element={<CreateIngressYamlPage />} />
        <Route path="/container/ingresses/:ingressId/edit-yaml" element={<EditIngressYamlPage />} />
        <Route path="/container/ingresses/:ingressId" element={<ContainerIngressDetailPage />} />
        <Route path="/container/hpa" element={<ContainerHPAPage />} />
        <Route path="/container/hpa/create-yaml" element={<CreateHPAYamlPage />} />
        <Route path="/container/hpa/:hpaId" element={<ContainerHPADetailPage />} />
        <Route path="/container/hpa/:hpaId/edit-yaml" element={<EditHPAYamlPage />} />
        <Route path="/container/console/:instanceId" element={<ContainerConsolePage />} />
        <Route path="/container/deployments" element={<DeploymentsPage />} />
        <Route path="/container/deployments/create" element={<CreateDeploymentPage />} />
        <Route path="/container/deployments/create-yaml" element={<CreateDeploymentYamlPage />} />
        <Route path="/container/deployments/:deploymentName/edit-yaml" element={<EditDeploymentYamlPage />} />
        <Route path="/container/deployments/:deploymentId" element={<DeploymentDetailPage />} />
        <Route path="/container/statefulsets" element={<StatefulSetsPage />} />
        <Route path="/container/statefulsets/create" element={<CreateStatefulSetPage />} />
        <Route path="/container/statefulsets/create-yaml" element={<CreateStatefulSetYamlPage />} />
        <Route path="/container/statefulsets/:statefulSetName/edit-yaml" element={<EditStatefulSetYamlPage />} />
        <Route path="/container/statefulsets/:statefulsetId" element={<StatefulSetDetailPage />} />
        <Route path="/container/daemonsets" element={<DaemonSetsPage />} />
        <Route path="/container/daemonsets/create" element={<CreateDaemonSetPage />} />
        <Route path="/container/daemonsets/create-yaml" element={<CreateDaemonSetYamlPage />} />
        <Route path="/container/daemonsets/:daemonSetName/edit-yaml" element={<EditDaemonSetYamlPage />} />
        <Route path="/container/daemonsets/:daemonsetId" element={<DaemonSetDetailPage />} />
        <Route path="/container/jobs" element={<JobsPage />} />
        <Route path="/container/jobs/create" element={<CreateJobPage />} />
        <Route path="/container/jobs/create-yaml" element={<CreateJobYamlPage />} />
        <Route path="/container/jobs/:jobName/edit-yaml" element={<EditJobYamlPage />} />
        <Route path="/container/jobs/:jobId" element={<JobDetailPage />} />
        <Route path="/container/cronjobs" element={<CronJobsPage />} />
        <Route path="/container/cronjobs/create" element={<CreateCronJobPage />} />
        <Route path="/container/cronjobs/create-yaml" element={<CreateCronJobYamlPage />} />
        <Route path="/container/cronjobs/:cronJobName/edit-yaml" element={<EditCronJobYamlPage />} />
        <Route path="/container/cronjobs/:cronjobId" element={<CronJobDetailPage />} />
        <Route path="/container/pods" element={<PodsPage />} />
        <Route path="/container/pods/create" element={<CreatePodPage />} />
        <Route path="/container/pods/create-yaml" element={<CreatePodYamlPage />} />
        <Route path="/container/pods/:podName/edit-yaml" element={<EditPodYamlPage />} />
        <Route path="/container/pods/:podId" element={<PodDetailPage />} />
        <Route path="/container/persistent-volumes" element={<PersistentVolumesPage />} />
        <Route path="/container/persistent-volumes/create" element={<CreatePersistentVolumePage />} />
        <Route path="/container/persistent-volumes/create-yaml" element={<CreatePersistentVolumeYamlPage />} />
        <Route path="/container/persistent-volumes/:pvName/edit-yaml" element={<EditPersistentVolumeYamlPage />} />
        <Route path="/container/persistent-volumes/:pvId" element={<PersistentVolumeDetailPage />} />
        <Route path="/container/pvc" element={<PersistentVolumeClaimsPage />} />
        <Route path="/container/pvc/create" element={<CreatePersistentVolumeClaimPage />} />
        <Route path="/container/pvc/create-yaml" element={<CreatePersistentVolumeClaimYamlPage />} />
        <Route path="/container/pvc/:pvcName/edit-yaml" element={<EditPersistentVolumeClaimYamlPage />} />
        <Route path="/container/pvc/:pvcId" element={<PersistentVolumeClaimDetailPage />} />
        <Route path="/container/storage-classes" element={<StorageClassesPage />} />
        <Route path="/container/storage-classes/create" element={<CreateStorageClassPage />} />
        <Route path="/container/storage-classes/create-yaml" element={<CreateStorageClassYamlPage />} />
        <Route path="/container/storage-classes/:storageClassName/edit-yaml" element={<EditStorageClassYamlPage />} />
        <Route path="/container/storage-classes/:storageClassId" element={<StorageClassDetailPage />} />
        <Route path="/container/configmaps" element={<ConfigMapsPage />} />
        <Route path="/container/configmaps/create" element={<CreateConfigMapPage />} />
        <Route path="/container/configmaps/create-yaml" element={<CreateConfigMapYamlPage />} />
        <Route path="/container/configmaps/:configMapName/edit-yaml" element={<EditConfigMapYamlPage />} />
        <Route path="/container/configmaps/:configMapId" element={<ConfigMapDetailPage />} />
        <Route path="/container/secrets" element={<SecretsPage />} />
        <Route path="/container/secrets/create" element={<CreateSecretPage />} />
        <Route path="/container/secrets/create-yaml" element={<CreateSecretYamlPage />} />
        <Route path="/container/secrets/:secretName/edit-yaml" element={<EditSecretYamlPage />} />
        <Route path="/container/secrets/:secretId" element={<SecretDetailPage />} />
        <Route path="/container/limit-ranges" element={<LimitRangesPage />} />
        <Route path="/container/limit-ranges/create" element={<CreateLimitRangePage />} />
        <Route path="/container/limit-ranges/create-yaml" element={<CreateLimitRangeYamlPage />} />
        <Route path="/container/limit-ranges/:limitRangeName/edit-yaml" element={<EditLimitRangeYamlPage />} />
        <Route path="/container/resource-quotas" element={<ResourceQuotasPage />} />
        <Route path="/container/resource-quotas/create" element={<CreateResourceQuotaPage />} />
        <Route path="/container/resource-quotas/create-yaml" element={<CreateResourceQuotaYamlPage />} />
        <Route path="/container/resource-quotas/:resourceQuotaName/edit-yaml" element={<EditResourceQuotaYamlPage />} />
        <Route path="/container/network-policies" element={<NetworkPoliciesPage />} />
        <Route path="/container/network-policies/create" element={<CreateNetworkPolicyPage />} />
        <Route path="/container/network-policies/create-yaml" element={<CreateNetworkPolicyYamlPage />} />
        <Route path="/container/network-policies/:networkPolicyName/edit-yaml" element={<EditNetworkPolicyYamlPage />} />
        <Route path="/container/network-policies/:networkPolicyId" element={<NetworkPolicyDetailPage />} />
        <Route path="/container/pdb" element={<PodDisruptionBudgetsPage />} />
        <Route path="/container/pdb/create" element={<CreatePodDisruptionBudgetPage />} />
        <Route path="/container/pdb/create-yaml" element={<CreatePodDisruptionBudgetYamlPage />} />
        <Route path="/container/pdb/:pdbName/edit-yaml" element={<EditPodDisruptionBudgetYamlPage />} />
        <Route path="/container/pdb/:pdbId" element={<PodDisruptionBudgetDetailPage />} />
        <Route path="/container/*" element={<ContainerDashboardPage />} />

        {/* IAM Routes */}
        <Route path="/iam" element={<IAMHomePage />} />
        <Route path="/iam/users" element={<IAMUsersPage />} />
        <Route path="/iam/users/create" element={<CreateUserPage />} />
        <Route path="/iam/users/:username" element={<IAMUserDetailPage />} />
        <Route path="/iam/user-groups" element={<IAMUserGroupsPage />} />
        <Route path="/iam/user-groups/create" element={<CreateUserGroupPage />} />
        <Route path="/iam/user-groups/:groupName" element={<IAMUserGroupDetailPage />} />
        <Route path="/iam/roles" element={<IAMRolesPage />} />
        <Route path="/iam/roles/create" element={<CreateRolePage />} />
        <Route path="/iam/roles/:roleName" element={<IAMRoleDetailPage />} />
        <Route path="/iam/policies" element={<IAMPoliciesPage />} />
        <Route path="/iam/policies/create" element={<CreatePolicyPage />} />
        <Route path="/iam/policies/:policyId" element={<IAMPolicyDetailPage />} />
        <Route path="/iam/active-sessions" element={<IAMActiveSessionsPage />} />
        <Route path="/iam/domains" element={<IAMDomainsPage />} />
        <Route path="/iam/system-administrators" element={<IAMSystemAdministratorsPage />} />
        <Route path="/iam/system-administrators/create" element={<CreateSystemAdministratorPage />} />
        <Route path="/iam/system-administrators/:username" element={<IAMSystemAdminDetailPage />} />
        <Route path="/iam/event-logs" element={<IAMEventLogsPage />} />
        <Route path="/iam/mfa-policies" element={<IAMMFAPoliciesPage />} />
        <Route path="/iam/session-policies" element={<IAMSessionPoliciesPage />} />
        <Route path="/iam/token-policies" element={<IAMTokenPoliciesPage />} />
        <Route path="/iam/login-policies" element={<IAMLoginPoliciesPage />} />
        <Route path="/iam/*" element={<IAMHomePage />} />

        {/* AI Platform Routes */}
        <Route path="/ai-platform" element={<AIPlatformPage />} />
        <Route path="/ai-platform/explore" element={<ExplorePage />} />
        <Route path="/ai-platform/packages" element={<PackagesPage />} />
        <Route path="/ai-platform/models" element={<ModelsPage />} />
        <Route path="/ai-platform/datasets" element={<DatasetsPage />} />
        <Route path="/ai-platform/workloads" element={<WorkloadsPage />} />
        <Route path="/ai-platform/my-templates" element={<MyTemplatesPage />} />
        <Route path="/ai-platform/storage" element={<AIPlatformStoragePage />} />
        <Route path="/ai-platform/serverless" element={<ServerlessPage />} />
        <Route path="/ai-platform/text-generation" element={<TextGenerationPage />} />
        <Route path="/ai-platform/devspace" element={<DevSpacePage />} />
        <Route path="/ai-platform/pipeline-builder" element={<PipelineBuilderPage />} />
        <Route path="/ai-platform/benchmarks" element={<BenchmarksPage />} />
        <Route path="/ai-platform/kubeflow" element={<KubeflowPage />} />
        <Route path="/ai-platform/mlflow" element={<MLflowPage />} />
        <Route path="/ai-platform/settings" element={<AIPlatformSettingsPage />} />
        <Route path="/ai-platform/faq" element={<FAQPage />} />
        <Route path="/ai-platform/kueue" element={<KueuePage />} />
        <Route path="/ai-platform/monitoring" element={<MonitoringPage />} />
        <Route path="/ai-platform/dependencies" element={<DependenciesPage />} />
        <Route path="/ai-platform/system-admin" element={<SystemAdminPage />} />
        <Route path="/ai-platform/*" element={<AIPlatformPage />} />

        {/* Design System Routes */}
        <Route path="/design" element={<DesignSystemPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/design/components" element={<DesignSystemPage />} />
        <Route path="/design/drawers" element={<DrawersPage />} />
        <Route path="/design/modals" element={<ModalsPage />} />
        <Route path="/design/gradients" element={<GradientShowcasePage />} />
        <Route path="/design/colors" element={<ColorPalettePage />} />
        <Route path="/design/metallic" element={<MetallicPalettePage />} />

        {/* Desktop Routes */}
        <Route path="/desktop" element={<DesktopPage />} />

        {/* Developer Resources */}
        <Route path="/sidebar-icons" element={<SidebarIconsPage />} />

        {/* AI Platform Routes */}
        <Route path="/ai-platform" element={<AIPlatformPage />} />
        <Route path="/ai-platform/workloads/:id" element={<WorkloadDetailPage />} />
        <Route path="/ai-platform/*" element={<AIPlatformPage />} />
      </Routes>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ProjectProvider>
          <SidebarProvider>
            <TabProvider defaultTabs={defaultTabs}>
              <AppRoutes />
            </TabProvider>
          </SidebarProvider>
        </ProjectProvider>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
