import { lazy } from 'react';
import { Route } from 'react-router-dom';

const ContainerHomePage = lazy(() => import('@/pages/ContainerHomePage'));
const ContainerDashboardPage = lazy(() => import('@/pages/ContainerDashboardPage'));
const ContainerNamespacesPage = lazy(() => import('@/pages/ContainerNamespacesPage'));
const CreateNamespacePage = lazy(() => import('@/pages/CreateNamespacePage'));
const CreateNamespaceYamlPage = lazy(() => import('@/pages/CreateNamespaceYamlPage'));
const EditNamespaceYamlPage = lazy(() => import('@/pages/EditNamespaceYamlPage'));
const NamespaceDetailPage = lazy(() => import('@/pages/NamespaceDetailPage'));
const ContainerEventsPage = lazy(() => import('@/pages/ContainerEventsPage'));
const ContainerNodesPage = lazy(() => import('@/pages/ContainerNodesPage'));
const EditNodeConfigPage = lazy(() => import('@/pages/EditNodeConfigPage'));
const EditNodeYamlPage = lazy(() => import('@/pages/EditNodeYamlPage'));
const NodeDetailPage = lazy(() => import('@/pages/NodeDetailPage'));
const ContainerServicesPage = lazy(() => import('@/pages/ContainerServicesPage'));
const CreateServicePage = lazy(() => import('@/pages/CreateServicePage'));
const CreateServiceYamlPage = lazy(() => import('@/pages/CreateServiceYamlPage'));
const EditServiceYamlPage = lazy(() => import('@/pages/EditServiceYamlPage'));
const ContainerServiceDetailPage = lazy(() => import('@/pages/ContainerServiceDetailPage'));
const ContainerIngressesPage = lazy(() => import('@/pages/ContainerIngressesPage'));
const CreateIngressPage = lazy(() => import('@/pages/CreateIngressPage'));
const CreateIngressYamlPage = lazy(() => import('@/pages/CreateIngressYamlPage'));
const EditIngressYamlPage = lazy(() => import('@/pages/EditIngressYamlPage'));
const ContainerIngressDetailPage = lazy(() => import('@/pages/ContainerIngressDetailPage'));
const ContainerHPAPage = lazy(() => import('@/pages/ContainerHPAPage'));
const CreateHPAPage = lazy(() => import('@/pages/CreateHPAPage'));
const CreateHPAYamlPage = lazy(() => import('@/pages/CreateHPAYamlPage'));
const ContainerHPADetailPage = lazy(() => import('@/pages/ContainerHPADetailPage'));
const EditHPAYamlPage = lazy(() => import('@/pages/EditHPAYamlPage'));
const ContainerConsolePage = lazy(() => import('@/pages/ContainerConsolePage'));
const DeploymentsPage = lazy(() => import('@/pages/DeploymentsPage'));
const CreateDeploymentPage = lazy(() => import('@/pages/CreateDeploymentPage'));
const CreateDeploymentYamlPage = lazy(() => import('@/pages/CreateDeploymentYamlPage'));
const EditDeploymentYamlPage = lazy(() => import('@/pages/EditDeploymentYamlPage'));
const DeploymentDetailPage = lazy(() => import('@/pages/DeploymentDetailPage'));
const StatefulSetsPage = lazy(() => import('@/pages/StatefulSetsPage'));
const CreateStatefulSetPage = lazy(() => import('@/pages/CreateStatefulSetPage'));
const CreateStatefulSetYamlPage = lazy(() => import('@/pages/CreateStatefulSetYamlPage'));
const EditStatefulSetYamlPage = lazy(() => import('@/pages/EditStatefulSetYamlPage'));
const StatefulSetDetailPage = lazy(() => import('@/pages/StatefulSetDetailPage'));
const DaemonSetsPage = lazy(() => import('@/pages/DaemonSetsPage'));
const CreateDaemonSetPage = lazy(() => import('@/pages/CreateDaemonSetPage'));
const CreateDaemonSetYamlPage = lazy(() => import('@/pages/CreateDaemonSetYamlPage'));
const EditDaemonSetYamlPage = lazy(() => import('@/pages/EditDaemonSetYamlPage'));
const DaemonSetDetailPage = lazy(() => import('@/pages/DaemonSetDetailPage'));
const JobsPage = lazy(() => import('@/pages/JobsPage'));
const CreateJobPage = lazy(() => import('@/pages/CreateJobPage'));
const CreateJobYamlPage = lazy(() => import('@/pages/CreateJobYamlPage'));
const EditJobYamlPage = lazy(() => import('@/pages/EditJobYamlPage'));
const JobDetailPage = lazy(() => import('@/pages/JobDetailPage'));
const CronJobsPage = lazy(() => import('@/pages/CronJobsPage'));
const CreateCronJobPage = lazy(() => import('@/pages/CreateCronJobPage'));
const CreateCronJobYamlPage = lazy(() => import('@/pages/CreateCronJobYamlPage'));
const EditCronJobYamlPage = lazy(() => import('@/pages/EditCronJobYamlPage'));
const CronJobDetailPage = lazy(() => import('@/pages/CronJobDetailPage'));
const PodsPage = lazy(() => import('@/pages/PodsPage'));
const CreatePodPage = lazy(() => import('@/pages/CreatePodPage'));
const CreatePodYamlPage = lazy(() => import('@/pages/CreatePodYamlPage'));
const EditPodYamlPage = lazy(() => import('@/pages/EditPodYamlPage'));
const PodDetailPage = lazy(() => import('@/pages/PodDetailPage'));
const PersistentVolumesPage = lazy(() => import('@/pages/PersistentVolumesPage'));
const CreatePersistentVolumePage = lazy(() => import('@/pages/CreatePersistentVolumePage'));
const CreatePersistentVolumeYamlPage = lazy(() => import('@/pages/CreatePersistentVolumeYamlPage'));
const EditPersistentVolumeYamlPage = lazy(() => import('@/pages/EditPersistentVolumeYamlPage'));
const PersistentVolumeDetailPage = lazy(() => import('@/pages/PersistentVolumeDetailPage'));
const PersistentVolumeClaimsPage = lazy(() => import('@/pages/PersistentVolumeClaimsPage'));
const CreatePersistentVolumeClaimPage = lazy(
  () => import('@/pages/CreatePersistentVolumeClaimPage')
);
const CreatePersistentVolumeClaimYamlPage = lazy(
  () => import('@/pages/CreatePersistentVolumeClaimYamlPage')
);
const EditPersistentVolumeClaimYamlPage = lazy(
  () => import('@/pages/EditPersistentVolumeClaimYamlPage')
);
const PersistentVolumeClaimDetailPage = lazy(
  () => import('@/pages/PersistentVolumeClaimDetailPage')
);
const StorageClassesPage = lazy(() => import('@/pages/StorageClassesPage'));
const CreateStorageClassPage = lazy(() => import('@/pages/CreateStorageClassPage'));
const CreateStorageClassYamlPage = lazy(() => import('@/pages/CreateStorageClassYamlPage'));
const EditStorageClassYamlPage = lazy(() => import('@/pages/EditStorageClassYamlPage'));
const StorageClassDetailPage = lazy(() => import('@/pages/StorageClassDetailPage'));
const ConfigMapsPage = lazy(() => import('@/pages/ConfigMapsPage'));
const CreateConfigMapPage = lazy(() => import('@/pages/CreateConfigMapPage'));
const CreateConfigMapYamlPage = lazy(() => import('@/pages/CreateConfigMapYamlPage'));
const EditConfigMapYamlPage = lazy(() => import('@/pages/EditConfigMapYamlPage'));
const ConfigMapDetailPage = lazy(() => import('@/pages/ConfigMapDetailPage'));
const SecretsPage = lazy(() => import('@/pages/SecretsPage'));
const CreateSecretPage = lazy(() => import('@/pages/CreateSecretPage'));
const CreateSecretYamlPage = lazy(() => import('@/pages/CreateSecretYamlPage'));
const EditSecretYamlPage = lazy(() => import('@/pages/EditSecretYamlPage'));
const SecretDetailPage = lazy(() => import('@/pages/SecretDetailPage'));
const LimitRangesPage = lazy(() => import('@/pages/LimitRangesPage'));
const CreateLimitRangePage = lazy(() => import('@/pages/CreateLimitRangePage'));
const CreateLimitRangeYamlPage = lazy(() => import('@/pages/CreateLimitRangeYamlPage'));
const EditLimitRangeYamlPage = lazy(() => import('@/pages/EditLimitRangeYamlPage'));
const ResourceQuotasPage = lazy(() => import('@/pages/ResourceQuotasPage'));
const CreateResourceQuotaPage = lazy(() => import('@/pages/CreateResourceQuotaPage'));
const CreateResourceQuotaYamlPage = lazy(() => import('@/pages/CreateResourceQuotaYamlPage'));
const EditResourceQuotaYamlPage = lazy(() => import('@/pages/EditResourceQuotaYamlPage'));
const NetworkPoliciesPage = lazy(() => import('@/pages/NetworkPoliciesPage'));
const CreateNetworkPolicyPage = lazy(() => import('@/pages/CreateNetworkPolicyPage'));
const CreateNetworkPolicyYamlPage = lazy(() => import('@/pages/CreateNetworkPolicyYamlPage'));
const EditNetworkPolicyYamlPage = lazy(() => import('@/pages/EditNetworkPolicyYamlPage'));
const NetworkPolicyDetailPage = lazy(() => import('@/pages/NetworkPolicyDetailPage'));
const PodDisruptionBudgetsPage = lazy(() => import('@/pages/PodDisruptionBudgetsPage'));
const CreatePodDisruptionBudgetPage = lazy(() => import('@/pages/CreatePodDisruptionBudgetPage'));
const CreatePodDisruptionBudgetYamlPage = lazy(
  () => import('@/pages/CreatePodDisruptionBudgetYamlPage')
);
const EditPodDisruptionBudgetYamlPage = lazy(
  () => import('@/pages/EditPodDisruptionBudgetYamlPage')
);
const PodDisruptionBudgetDetailPage = lazy(() => import('@/pages/PodDisruptionBudgetDetailPage'));
const ClusterManagementPage = lazy(() => import('@/pages/ClusterManagementPage'));
const CreateClusterPage = lazy(() => import('@/pages/CreateClusterPage'));
const ClusterDetailPage = lazy(() => import('@/pages/ClusterDetailPage'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage'));
const InstalledAppsPage = lazy(() => import('@/pages/InstalledAppsPage'));
const InstalledAppDetailPage = lazy(() => import('@/pages/InstalledAppDetailPage'));
const CatalogInstallPage = lazy(() => import('@/pages/CatalogInstallPage'));
const InstalledAppEditPage = lazy(() => import('@/pages/InstalledAppEditPage'));

export const containerRoutes = (
  <>
    <Route path="/container" element={<ContainerHomePage />} />
    <Route path="/container/dashboard" element={<ContainerDashboardPage />} />
    <Route path="/container/namespaces" element={<ContainerNamespacesPage />} />
    <Route path="/container/namespaces/create" element={<CreateNamespacePage />} />
    <Route path="/container/namespaces/create-v2" element={<CreateNamespacePage />} />
    <Route path="/container/namespaces/create-yaml" element={<CreateNamespaceYamlPage />} />
    <Route path="/container/namespaces/create-yaml-v2" element={<CreateNamespaceYamlPage />} />
    <Route
      path="/container/namespaces/:namespaceName/edit-yaml"
      element={<EditNamespaceYamlPage />}
    />
    <Route path="/container/namespaces/:namespaceName" element={<NamespaceDetailPage />} />
    <Route path="/container/events" element={<ContainerEventsPage />} />
    <Route path="/container/nodes" element={<ContainerNodesPage />} />
    <Route path="/container/nodes/:nodeName/edit" element={<EditNodeConfigPage />} />
    <Route path="/container/nodes/:nodeName/edit-yaml" element={<EditNodeYamlPage />} />
    <Route path="/container/nodes/:nodeName" element={<NodeDetailPage />} />
    <Route path="/container/services" element={<ContainerServicesPage />} />
    <Route path="/container/services/create" element={<CreateServicePage />} />
    <Route path="/container/services/create-v2" element={<CreateServicePage />} />
    <Route path="/container/services/create-yaml" element={<CreateServiceYamlPage />} />
    <Route path="/container/services/create-yaml-v2" element={<CreateServiceYamlPage />} />
    <Route path="/container/services/:serviceId/edit-yaml" element={<EditServiceYamlPage />} />
    <Route path="/container/services/:serviceId" element={<ContainerServiceDetailPage />} />
    <Route path="/container/ingresses" element={<ContainerIngressesPage />} />
    <Route path="/container/ingresses/create" element={<CreateIngressPage />} />
    <Route path="/container/ingresses/create-v2" element={<CreateIngressPage />} />
    <Route path="/container/ingresses/create-yaml" element={<CreateIngressYamlPage />} />
    <Route path="/container/ingresses/create-yaml-v2" element={<CreateIngressYamlPage />} />
    <Route path="/container/ingresses/:ingressId/edit-yaml" element={<EditIngressYamlPage />} />
    <Route path="/container/ingresses/:ingressId" element={<ContainerIngressDetailPage />} />
    <Route path="/container/hpa" element={<ContainerHPAPage />} />
    <Route path="/container/hpa/create" element={<CreateHPAPage />} />
    <Route path="/container/hpa/create-v2" element={<CreateHPAPage />} />
    <Route path="/container/hpa/create-yaml" element={<CreateHPAYamlPage />} />
    <Route path="/container/hpa/create-yaml-v2" element={<CreateHPAYamlPage />} />
    <Route path="/container/hpa/:hpaId" element={<ContainerHPADetailPage />} />
    <Route path="/container/hpa/:hpaId/edit-yaml" element={<EditHPAYamlPage />} />
    <Route path="/container/console/:instanceId" element={<ContainerConsolePage />} />
    <Route path="/container/deployments" element={<DeploymentsPage />} />
    <Route path="/container/deployments/create" element={<CreateDeploymentPage />} />
    <Route path="/container/deployments/create-v2" element={<CreateDeploymentPage />} />
    <Route path="/container/deployments/create-yaml" element={<CreateDeploymentYamlPage />} />
    <Route path="/container/deployments/create-yaml-v2" element={<CreateDeploymentYamlPage />} />
    <Route
      path="/container/deployments/:deploymentName/edit-yaml"
      element={<EditDeploymentYamlPage />}
    />
    <Route path="/container/deployments/:deploymentId" element={<DeploymentDetailPage />} />
    <Route path="/container/statefulsets" element={<StatefulSetsPage />} />
    <Route path="/container/statefulsets/create" element={<CreateStatefulSetPage />} />
    <Route path="/container/statefulsets/create-v2" element={<CreateStatefulSetPage />} />
    <Route path="/container/statefulsets/create-yaml" element={<CreateStatefulSetYamlPage />} />
    <Route path="/container/statefulsets/create-yaml-v2" element={<CreateStatefulSetYamlPage />} />
    <Route
      path="/container/statefulsets/:statefulSetName/edit-yaml"
      element={<EditStatefulSetYamlPage />}
    />
    <Route path="/container/statefulsets/:statefulsetId" element={<StatefulSetDetailPage />} />
    <Route path="/container/daemonsets" element={<DaemonSetsPage />} />
    <Route path="/container/daemonsets/create" element={<CreateDaemonSetPage />} />
    <Route path="/container/daemonsets/create-v2" element={<CreateDaemonSetPage />} />
    <Route path="/container/daemonsets/create-yaml" element={<CreateDaemonSetYamlPage />} />
    <Route path="/container/daemonsets/create-yaml-v2" element={<CreateDaemonSetYamlPage />} />
    <Route
      path="/container/daemonsets/:daemonSetName/edit-yaml"
      element={<EditDaemonSetYamlPage />}
    />
    <Route path="/container/daemonsets/:daemonsetId" element={<DaemonSetDetailPage />} />
    <Route path="/container/jobs" element={<JobsPage />} />
    <Route path="/container/jobs/create" element={<CreateJobPage />} />
    <Route path="/container/jobs/create-v2" element={<CreateJobPage />} />
    <Route path="/container/jobs/create-yaml" element={<CreateJobYamlPage />} />
    <Route path="/container/jobs/create-yaml-v2" element={<CreateJobYamlPage />} />
    <Route path="/container/jobs/:jobName/edit-yaml" element={<EditJobYamlPage />} />
    <Route path="/container/jobs/:jobId" element={<JobDetailPage />} />
    <Route path="/container/cronjobs" element={<CronJobsPage />} />
    <Route path="/container/cronjobs/create" element={<CreateCronJobPage />} />
    <Route path="/container/cronjobs/create-v2" element={<CreateCronJobPage />} />
    <Route path="/container/cronjobs/create-yaml" element={<CreateCronJobYamlPage />} />
    <Route path="/container/cronjobs/create-yaml-v2" element={<CreateCronJobYamlPage />} />
    <Route path="/container/cronjobs/:cronJobName/edit-yaml" element={<EditCronJobYamlPage />} />
    <Route path="/container/cronjobs/:cronjobId" element={<CronJobDetailPage />} />
    <Route path="/container/pods" element={<PodsPage />} />
    <Route path="/container/pods/create" element={<CreatePodPage />} />
    <Route path="/container/pods/create-v2" element={<CreatePodPage />} />
    <Route path="/container/pods/create-yaml" element={<CreatePodYamlPage />} />
    <Route path="/container/pods/create-yaml-v2" element={<CreatePodYamlPage />} />
    <Route path="/container/pods/:podName/edit-yaml" element={<EditPodYamlPage />} />
    <Route path="/container/pods/:podId" element={<PodDetailPage />} />
    <Route path="/container/persistent-volumes" element={<PersistentVolumesPage />} />
    <Route path="/container/persistent-volumes/create" element={<CreatePersistentVolumePage />} />
    <Route
      path="/container/persistent-volumes/create-v2"
      element={<CreatePersistentVolumePage />}
    />
    <Route
      path="/container/persistent-volumes/create-yaml"
      element={<CreatePersistentVolumeYamlPage />}
    />
    <Route
      path="/container/persistent-volumes/create-yaml-v2"
      element={<CreatePersistentVolumeYamlPage />}
    />
    <Route
      path="/container/persistent-volumes/:pvName/edit-yaml"
      element={<EditPersistentVolumeYamlPage />}
    />
    <Route path="/container/persistent-volumes/:pvId" element={<PersistentVolumeDetailPage />} />
    <Route path="/container/pvc" element={<PersistentVolumeClaimsPage />} />
    <Route path="/container/pvc/create" element={<CreatePersistentVolumeClaimPage />} />
    <Route path="/container/pvc/create-v2" element={<CreatePersistentVolumeClaimPage />} />
    <Route path="/container/pvc/create-yaml" element={<CreatePersistentVolumeClaimYamlPage />} />
    <Route path="/container/pvc/create-yaml-v2" element={<CreatePersistentVolumeClaimYamlPage />} />
    <Route
      path="/container/pvc/:pvcName/edit-yaml"
      element={<EditPersistentVolumeClaimYamlPage />}
    />
    <Route path="/container/pvc/:pvcId" element={<PersistentVolumeClaimDetailPage />} />
    <Route path="/container/storage-classes" element={<StorageClassesPage />} />
    <Route path="/container/storage-classes/create" element={<CreateStorageClassPage />} />
    <Route path="/container/storage-classes/create-v2" element={<CreateStorageClassPage />} />
    <Route path="/container/storage-classes/create-yaml" element={<CreateStorageClassYamlPage />} />
    <Route
      path="/container/storage-classes/create-yaml-v2"
      element={<CreateStorageClassYamlPage />}
    />
    <Route
      path="/container/storage-classes/:storageClassName/edit-yaml"
      element={<EditStorageClassYamlPage />}
    />
    <Route path="/container/storage-classes/:storageClassId" element={<StorageClassDetailPage />} />
    <Route path="/container/configmaps" element={<ConfigMapsPage />} />
    <Route path="/container/configmaps/create" element={<CreateConfigMapPage />} />
    <Route path="/container/configmaps/create-v2" element={<CreateConfigMapPage />} />
    <Route path="/container/configmaps/create-yaml" element={<CreateConfigMapYamlPage />} />
    <Route path="/container/configmaps/create-yaml-v2" element={<CreateConfigMapYamlPage />} />
    <Route
      path="/container/configmaps/:configMapName/edit-yaml"
      element={<EditConfigMapYamlPage />}
    />
    <Route path="/container/configmaps/:configMapId" element={<ConfigMapDetailPage />} />
    <Route path="/container/secrets" element={<SecretsPage />} />
    <Route path="/container/secrets/create" element={<CreateSecretPage />} />
    <Route path="/container/secrets/create-v2" element={<CreateSecretPage />} />
    <Route path="/container/secrets/create-yaml" element={<CreateSecretYamlPage />} />
    <Route path="/container/secrets/create-yaml-v2" element={<CreateSecretYamlPage />} />
    <Route path="/container/secrets/:secretName/edit-yaml" element={<EditSecretYamlPage />} />
    <Route path="/container/secrets/:secretId" element={<SecretDetailPage />} />
    <Route path="/container/limit-ranges" element={<LimitRangesPage />} />
    <Route path="/container/limit-ranges/create" element={<CreateLimitRangePage />} />
    <Route path="/container/limit-ranges/create-v2" element={<CreateLimitRangePage />} />
    <Route path="/container/limit-ranges/create-yaml" element={<CreateLimitRangeYamlPage />} />
    <Route path="/container/limit-ranges/create-yaml-v2" element={<CreateLimitRangeYamlPage />} />
    <Route
      path="/container/limit-ranges/:limitRangeName/edit-yaml"
      element={<EditLimitRangeYamlPage />}
    />
    <Route path="/container/resource-quotas" element={<ResourceQuotasPage />} />
    <Route path="/container/resource-quotas/create" element={<CreateResourceQuotaPage />} />
    <Route path="/container/resource-quotas/create-v2" element={<CreateResourceQuotaPage />} />
    <Route
      path="/container/resource-quotas/create-yaml"
      element={<CreateResourceQuotaYamlPage />}
    />
    <Route
      path="/container/resource-quotas/create-yaml-v2"
      element={<CreateResourceQuotaYamlPage />}
    />
    <Route
      path="/container/resource-quotas/:resourceQuotaName/edit-yaml"
      element={<EditResourceQuotaYamlPage />}
    />
    <Route path="/container/network-policies" element={<NetworkPoliciesPage />} />
    <Route path="/container/network-policies/create" element={<CreateNetworkPolicyPage />} />
    <Route path="/container/network-policies/create-v2" element={<CreateNetworkPolicyPage />} />
    <Route
      path="/container/network-policies/create-yaml"
      element={<CreateNetworkPolicyYamlPage />}
    />
    <Route
      path="/container/network-policies/create-yaml-v2"
      element={<CreateNetworkPolicyYamlPage />}
    />
    <Route
      path="/container/network-policies/:networkPolicyName/edit-yaml"
      element={<EditNetworkPolicyYamlPage />}
    />
    <Route
      path="/container/network-policies/:networkPolicyId"
      element={<NetworkPolicyDetailPage />}
    />
    <Route path="/container/pdb" element={<PodDisruptionBudgetsPage />} />
    <Route path="/container/pdb/create" element={<CreatePodDisruptionBudgetPage />} />
    <Route path="/container/pdb/create-v2" element={<CreatePodDisruptionBudgetPage />} />
    <Route path="/container/pdb/create-yaml" element={<CreatePodDisruptionBudgetYamlPage />} />
    <Route path="/container/pdb/create-yaml-v2" element={<CreatePodDisruptionBudgetYamlPage />} />
    <Route path="/container/pdb/:pdbName/edit-yaml" element={<EditPodDisruptionBudgetYamlPage />} />
    <Route path="/container/pdb/:pdbId" element={<PodDisruptionBudgetDetailPage />} />
    <Route path="/container/catalog" element={<CatalogPage />} />
    <Route path="/container/catalog/:appId/install" element={<CatalogInstallPage />} />
    <Route path="/container/installed-apps" element={<InstalledAppsPage />} />
    <Route path="/container/installed-apps/:appId" element={<InstalledAppDetailPage />} />
    <Route path="/container/installed-apps/:appId/edit" element={<InstalledAppEditPage />} />
    <Route path="/container/cluster-management" element={<ClusterManagementPage />} />
    <Route path="/container/cluster-management/create" element={<CreateClusterPage />} />
    <Route path="/container/cluster-management/create-v2" element={<CreateClusterPage />} />
    <Route path="/container/cluster-management/:clusterId" element={<ClusterDetailPage />} />
    <Route path="/container/*" element={<ContainerDashboardPage />} />
  </>
);
