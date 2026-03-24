import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import '@shared/styles/index.css';

import { IAMLayout } from './layouts/IAMLayout';
import { CloudBuilderLayout } from './layouts/CloudBuilderLayout';
import { StorageLayout } from './layouts/StorageLayout';
import { EntryPage } from './pages/EntryPage';
import { CloudBuilderConsolePage } from './pages/CloudBuilderConsolePage';
import { CloudBuilderDetailPage } from './pages/CloudBuilderDetailPage';
import { CloudBuilderCreatePage } from './pages/CloudBuilderCreatePage';
import { IAMHomePage } from './pages/IAMHomePage';
import { IAMUsersPage } from './pages/IAMUsersPage';
import { IAMUserGroupsPage } from './pages/IAMUserGroupsPage';
import { IAMRolesPage } from './pages/IAMRolesPage';
import { IAMUserDetailPage } from './pages/IAMUserDetailPage';
import { IAMUserGroupDetailPage } from './pages/IAMUserGroupDetailPage';
import { IAMRoleDetailPage } from './pages/IAMRoleDetailPage';
import { IAMPoliciesPage } from './pages/IAMPoliciesPage';
import { IAMPolicyDetailPage } from './pages/IAMPolicyDetailPage';
import { IAMActiveSessionsPage } from './pages/IAMActiveSessionsPage';
import { IAMDomainsPage } from './pages/IAMDomainsPage';
import { IAMSystemAdministratorsPage } from './pages/IAMSystemAdministratorsPage';
import { IAMSystemAdminDetailPage } from './pages/IAMSystemAdminDetailPage';
import { IAMEventLogsPage } from './pages/IAMEventLogsPage';
import { IAMMFAPoliciesPage } from './pages/IAMMFAPoliciesPage';
import { IAMSessionPoliciesPage } from './pages/IAMSessionPoliciesPage';
import { IAMTokenPoliciesPage } from './pages/IAMTokenPoliciesPage';
import { IAMLoginPoliciesPage } from './pages/IAMLoginPoliciesPage';
import { IAMCreateUserPage } from './pages/IAMCreateUserPage';
import { IAMCreateUserGroupPage } from './pages/IAMCreateUserGroupPage';
import { IAMCreateRolePage } from './pages/IAMCreateRolePage';
import { IAMCreatePolicyPage } from './pages/IAMCreatePolicyPage';
import { IAMCreateSysAdminPage } from './pages/IAMCreateSysAdminPage';
import { StorageHomePage } from './pages/StorageHomePage';
import { StorageConsolePage } from './pages/StorageConsolePage';
import { StorageDetailPage } from './pages/StorageDetailPage';
import { StoragePerformancePage } from './pages/StoragePerformancePage';
import { StorageCreatePage } from './pages/StorageCreatePage';
import { ContainerLayout } from './layouts/ContainerLayout';
import { ContainerHomePage } from './pages/ContainerHomePage';
import { ContainerDashboardPage } from './pages/ContainerDashboardPage';
import { ContainerClusterManagementPage } from './pages/ContainerClusterManagementPage';
import { ContainerCreateClusterPage } from './pages/ContainerCreateClusterPage';
import { ContainerClusterDetailPage } from './pages/ContainerClusterDetailPage';
import { ContainerConfigMapsPage } from './pages/ContainerConfigMapsPage';
import { ContainerConfigMapDetailPage } from './pages/ContainerConfigMapDetailPage';
import { ContainerCronJobsPage } from './pages/ContainerCronJobsPage';
import { ContainerCronJobDetailPage } from './pages/ContainerCronJobDetailPage';
import { ContainerDaemonSetsPage } from './pages/ContainerDaemonSetsPage';
import { ContainerDaemonSetDetailPage } from './pages/ContainerDaemonSetDetailPage';
import { ContainerHPAPage } from './pages/ContainerHPAPage';
import { ContainerHPADetailPage } from './pages/ContainerHPADetailPage';
import { ContainerCreateHPAPage } from './pages/ContainerCreateHPAPage';
import { ContainerIngressesPage } from './pages/ContainerIngressesPage';
import { ContainerIngressDetailPage } from './pages/ContainerIngressDetailPage';
import { ContainerJobsPage } from './pages/ContainerJobsPage';
import { ContainerJobDetailPage } from './pages/ContainerJobDetailPage';
import { ContainerLimitRangesPage } from './pages/ContainerLimitRangesPage';
import { ContainerNetworkPoliciesPage } from './pages/ContainerNetworkPoliciesPage';
import { ContainerNetworkPolicyDetailPage } from './pages/ContainerNetworkPolicyDetailPage';
import { ContainerPersistentVolumesPage } from './pages/ContainerPersistentVolumesPage';
import { ContainerPVDetailPage } from './pages/ContainerPVDetailPage';
import { ContainerPodsPage } from './pages/ContainerPodsPage';
import { ContainerPodDetailPage } from './pages/ContainerPodDetailPage';
import { ContainerCreatePodPage } from './pages/ContainerCreatePodPage';
import { ContainerNamespacesPage } from './pages/ContainerNamespacesPage';
import { ContainerNamespaceDetailPage } from './pages/ContainerNamespaceDetailPage';
import { ContainerEventsPage } from './pages/ContainerEventsPage';
import { ContainerNodesPage } from './pages/ContainerNodesPage';
import { ContainerNodeDetailPage } from './pages/ContainerNodeDetailPage';
import { ContainerDeploymentsPage } from './pages/ContainerDeploymentsPage';
import { ContainerDeploymentDetailPage } from './pages/ContainerDeploymentDetailPage';
import { ContainerPDBPage } from './pages/ContainerPDBPage';
import { ContainerPDBDetailPage } from './pages/ContainerPDBDetailPage';
import { ContainerPVCsPage } from './pages/ContainerPVCsPage';
import { ContainerPVCDetailPage } from './pages/ContainerPVCDetailPage';
import { ContainerResourceQuotasPage } from './pages/ContainerResourceQuotasPage';
import { ContainerSecretsPage } from './pages/ContainerSecretsPage';
import { ContainerSecretDetailPage } from './pages/ContainerSecretDetailPage';
import { ContainerServicesPage } from './pages/ContainerServicesPage';
import { ContainerServiceDetailPage } from './pages/ContainerServiceDetailPage';
import { ContainerStatefulSetsPage } from './pages/ContainerStatefulSetsPage';
import { ContainerStatefulSetDetailPage } from './pages/ContainerStatefulSetDetailPage';
import { ContainerStorageClassesPage } from './pages/ContainerStorageClassesPage';
import { ContainerStorageClassDetailPage } from './pages/ContainerStorageClassDetailPage';
import { ContainerCreatePVPage } from './pages/ContainerCreatePVPage';
import { ContainerCreatePVCPage } from './pages/ContainerCreatePVCPage';
import { ContainerCreateStorageClassPage } from './pages/ContainerCreateStorageClassPage';
import { ContainerCreateConfigMapPage } from './pages/ContainerCreateConfigMapPage';
import { ContainerCreateSecretPage } from './pages/ContainerCreateSecretPage';
import { ContainerCreateLimitRangePage } from './pages/ContainerCreateLimitRangePage';
import { ContainerCreateResourceQuotaPage } from './pages/ContainerCreateResourceQuotaPage';
import { ContainerCreateNetworkPolicyPage } from './pages/ContainerCreateNetworkPolicyPage';
import { ContainerCreatePDBPage } from './pages/ContainerCreatePDBPage';
import { ContainerCreatePVYamlPage } from './pages/ContainerCreatePVYamlPage';
import { ContainerCreatePVCYamlPage } from './pages/ContainerCreatePVCYamlPage';
import { ContainerCreateStorageClassYamlPage } from './pages/ContainerCreateStorageClassYamlPage';
import { ContainerCreateConfigMapYamlPage } from './pages/ContainerCreateConfigMapYamlPage';
import { ContainerCreateSecretYamlPage } from './pages/ContainerCreateSecretYamlPage';
import { ContainerCreateLimitRangeYamlPage } from './pages/ContainerCreateLimitRangeYamlPage';
import { ContainerCreateResourceQuotaYamlPage } from './pages/ContainerCreateResourceQuotaYamlPage';
import { ContainerCreateNetworkPolicyYamlPage } from './pages/ContainerCreateNetworkPolicyYamlPage';
import { ContainerCreatePDBYamlPage } from './pages/ContainerCreatePDBYamlPage';
import { ContainerCreateNamespacePage } from './pages/ContainerCreateNamespacePage';
import { ContainerCreateDeploymentPage } from './pages/ContainerCreateDeploymentPage';
import { ContainerCreateStatefulSetPage } from './pages/ContainerCreateStatefulSetPage';
import { ContainerCreateDaemonSetPage } from './pages/ContainerCreateDaemonSetPage';
import { ContainerCreateJobPage } from './pages/ContainerCreateJobPage';
import { ContainerCreateCronJobPage } from './pages/ContainerCreateCronJobPage';
import { ContainerCreateNamespaceYamlPage } from './pages/ContainerCreateNamespaceYamlPage';
import { ContainerCreateDeploymentYamlPage } from './pages/ContainerCreateDeploymentYamlPage';
import { ContainerCreateStatefulSetYamlPage } from './pages/ContainerCreateStatefulSetYamlPage';
import { ContainerCreateDaemonSetYamlPage } from './pages/ContainerCreateDaemonSetYamlPage';
import { ContainerCreateJobYamlPage } from './pages/ContainerCreateJobYamlPage';
import { ContainerCreateCronJobYamlPage } from './pages/ContainerCreateCronJobYamlPage';
import { ContainerCreatePodYamlPage } from './pages/ContainerCreatePodYamlPage';
import { ContainerCreateServiceYamlPage } from './pages/ContainerCreateServiceYamlPage';
import { ContainerCreateIngressYamlPage } from './pages/ContainerCreateIngressYamlPage';
import { ContainerEditNamespaceYamlPage } from './pages/ContainerEditNamespaceYamlPage';
import { ContainerEditNodeYamlPage } from './pages/ContainerEditNodeYamlPage';
import { ContainerConsolePage } from './pages/ContainerConsolePage';
import { ContainerEditNodeConfigPage } from './pages/ContainerEditNodeConfigPage';
import { ContainerEditDeploymentYamlPage } from './pages/ContainerEditDeploymentYamlPage';
import { ContainerEditStatefulSetYamlPage } from './pages/ContainerEditStatefulSetYamlPage';
import { ContainerEditDaemonSetYamlPage } from './pages/ContainerEditDaemonSetYamlPage';
import { ContainerEditJobYamlPage } from './pages/ContainerEditJobYamlPage';
import { ContainerEditCronJobYamlPage } from './pages/ContainerEditCronJobYamlPage';
import { ContainerEditPodYamlPage } from './pages/ContainerEditPodYamlPage';
import { ContainerEditServiceYamlPage } from './pages/ContainerEditServiceYamlPage';
import { ContainerEditIngressYamlPage } from './pages/ContainerEditIngressYamlPage';
import { ContainerEditHPAYamlPage } from './pages/ContainerEditHPAYamlPage';
import { ContainerEditPVYamlPage } from './pages/ContainerEditPVYamlPage';
import { ContainerEditPVCYamlPage } from './pages/ContainerEditPVCYamlPage';
import { ContainerEditStorageClassYamlPage } from './pages/ContainerEditStorageClassYamlPage';
import { ContainerEditConfigMapYamlPage } from './pages/ContainerEditConfigMapYamlPage';
import { ContainerEditSecretYamlPage } from './pages/ContainerEditSecretYamlPage';
import { ContainerEditLimitRangeYamlPage } from './pages/ContainerEditLimitRangeYamlPage';
import { ContainerEditResourceQuotaYamlPage } from './pages/ContainerEditResourceQuotaYamlPage';
import { ContainerEditNetworkPolicyYamlPage } from './pages/ContainerEditNetworkPolicyYamlPage';
import { ContainerEditPDBYamlPage } from './pages/ContainerEditPDBYamlPage';
import { ContainerCreateHPAYamlPage } from './pages/ContainerCreateHPAYamlPage';
import { ContainerCreateServicePage } from './pages/ContainerCreateServicePage';
import { ContainerCreateIngressPage } from './pages/ContainerCreateIngressPage';
import { ComputeLayout } from './layouts/ComputeLayout';
import { DesignLayout } from './layouts/DesignLayout';
import { DesignOverviewPage } from './pages/DesignOverviewPage';
import { DesignLayoutComponentsPage } from './pages/DesignLayoutComponentsPage';
import { DesignFeedbackPage } from './pages/DesignFeedbackPage';
import { DesignNavigationPage } from './pages/DesignNavigationPage';
import { DesignOverlaysPage } from './pages/DesignOverlaysPage';
import { DesignFormControlsPage } from './pages/DesignFormControlsPage';
import { DesignDataDisplayPage } from './pages/DesignDataDisplayPage';
import { ComputeHomePage } from './pages/ComputeHomePage';
import { ComputeInstancesPage } from './pages/ComputeInstancesPage';
import { ComputeInstanceDetailPage } from './pages/ComputeInstanceDetailPage';
import { ComputeCreateInstancePage } from './pages/ComputeCreateInstancePage';
import { ComputeInstanceTemplatesPage } from './pages/ComputeInstanceTemplatesPage';
import { ComputeInstanceTemplateDetailPage } from './pages/ComputeInstanceTemplateDetailPage';
import { ComputeInstanceSnapshotsPage } from './pages/ComputeInstanceSnapshotsPage';
import { ComputeInstanceSnapshotDetailPage } from './pages/ComputeInstanceSnapshotDetailPage';
import { ComputeImagesPage } from './pages/ComputeImagesPage';
import { ComputeImageDetailPage } from './pages/ComputeImageDetailPage';
import { ComputeCreateImagePage } from './pages/ComputeCreateImagePage';
import { ComputeFlavorsPage } from './pages/ComputeFlavorsPage';
import { ComputeFlavorDetailPage } from './pages/ComputeFlavorDetailPage';
import { ComputeKeyPairsPage } from './pages/ComputeKeyPairsPage';
import { ComputeKeyPairDetailPage } from './pages/ComputeKeyPairDetailPage';
import { ComputeServerGroupsPage } from './pages/ComputeServerGroupsPage';
import { ComputeServerGroupDetailPage } from './pages/ComputeServerGroupDetailPage';
import { ComputeVolumesPage } from './pages/ComputeVolumesPage';
import { ComputeVolumeDetailPage } from './pages/ComputeVolumeDetailPage';
import { ComputeCreateVolumePage } from './pages/ComputeCreateVolumePage';
import { ComputeVolumeSnapshotsPage } from './pages/ComputeVolumeSnapshotsPage';
import { ComputeVolumeSnapshotDetailPage } from './pages/ComputeVolumeSnapshotDetailPage';
import { ComputeVolumeBackupsPage } from './pages/ComputeVolumeBackupsPage';
import { ComputeVolumeBackupDetailPage } from './pages/ComputeVolumeBackupDetailPage';
import { ComputeNetworksPage } from './pages/ComputeNetworksPage';
import { ComputeNetworkDetailPage } from './pages/ComputeNetworkDetailPage';
import { ComputeCreateNetworkPage } from './pages/ComputeCreateNetworkPage';
import { ComputeRoutersPage } from './pages/ComputeRoutersPage';
import { ComputeRouterDetailPage } from './pages/ComputeRouterDetailPage';
import { ComputePortsPage } from './pages/ComputePortsPage';
import { ComputePortDetailPage } from './pages/ComputePortDetailPage';
import { ComputeFloatingIPsPage } from './pages/ComputeFloatingIPsPage';
import { ComputeFloatingIPDetailPage } from './pages/ComputeFloatingIPDetailPage';
import { ComputeSecurityGroupsPage } from './pages/ComputeSecurityGroupsPage';
import { ComputeSecurityGroupDetailPage } from './pages/ComputeSecurityGroupDetailPage';
import { ComputeLoadBalancersPage } from './pages/ComputeLoadBalancersPage';
import { ComputeLoadBalancerDetailPage } from './pages/ComputeLoadBalancerDetailPage';
import { ComputeCreateLoadBalancerPage } from './pages/ComputeCreateLoadBalancerPage';
import { ComputeFirewallsPage } from './pages/ComputeFirewallsPage';
import { ComputeFirewallDetailPage } from './pages/ComputeFirewallDetailPage';
import { ComputeCertificatesPage } from './pages/ComputeCertificatesPage';
import { ComputeCertificateDetailPage } from './pages/ComputeCertificateDetailPage';
import { ComputeDNSZonesPage } from './pages/ComputeDNSZonesPage';
import { ComputeBackupPoliciesPage } from './pages/ComputeBackupPoliciesPage';
import { ComputeScheduledTasksPage } from './pages/ComputeScheduledTasksPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Routes>
        <Route element={<IAMLayout />}>
          <Route path="/iam" element={<IAMHomePage />} />
          <Route path="/iam/users" element={<IAMUsersPage />} />
          <Route path="/iam/users/create" element={<IAMCreateUserPage />} />
          <Route path="/iam/users/:username" element={<IAMUserDetailPage />} />
          <Route path="/iam/user-groups" element={<IAMUserGroupsPage />} />
          <Route path="/iam/user-groups/create" element={<IAMCreateUserGroupPage />} />
          <Route path="/iam/user-groups/:groupName" element={<IAMUserGroupDetailPage />} />
          <Route path="/iam/roles" element={<IAMRolesPage />} />
          <Route path="/iam/roles/create" element={<IAMCreateRolePage />} />
          <Route path="/iam/roles/:roleName" element={<IAMRoleDetailPage />} />
          <Route path="/iam/policies" element={<IAMPoliciesPage />} />
          <Route path="/iam/policies/create" element={<IAMCreatePolicyPage />} />
          <Route path="/iam/policies/:policyId" element={<IAMPolicyDetailPage />} />
          <Route path="/iam/active-sessions" element={<IAMActiveSessionsPage />} />
          <Route path="/iam/domains" element={<IAMDomainsPage />} />
          <Route path="/iam/system-administrators" element={<IAMSystemAdministratorsPage />} />
          <Route path="/iam/system-administrators/create" element={<IAMCreateSysAdminPage />} />
          <Route
            path="/iam/system-administrators/:username"
            element={<IAMSystemAdminDetailPage />}
          />
          <Route path="/iam/event-logs" element={<IAMEventLogsPage />} />
          <Route path="/iam/mfa-policies" element={<IAMMFAPoliciesPage />} />
          <Route path="/iam/session-policies" element={<IAMSessionPoliciesPage />} />
          <Route path="/iam/token-policies" element={<IAMTokenPoliciesPage />} />
          <Route path="/iam/login-policies" element={<IAMLoginPoliciesPage />} />
        </Route>
        <Route element={<CloudBuilderLayout />}>
          <Route path="/cloudbuilder" element={<CloudBuilderConsolePage />} />
          <Route path="/cloudbuilder/:slug" element={<CloudBuilderConsolePage />} />
          <Route path="/cloudbuilder/:slug/create" element={<CloudBuilderCreatePage />} />
          <Route path="/cloudbuilder/:slug/detail/:id" element={<CloudBuilderDetailPage />} />
        </Route>
        <Route element={<StorageLayout />}>
          <Route path="/storage" element={<StorageHomePage />} />
          <Route path="/storage/performance" element={<StoragePerformancePage />} />
          <Route path="/storage/buckets/create" element={<StorageCreatePage />} />
          <Route path="/storage/:slug" element={<StorageConsolePage />} />
          <Route path="/storage/:slug/:id" element={<StorageDetailPage />} />
        </Route>
        <Route path="/container" element={<ContainerLayout />}>
          <Route index element={<ContainerHomePage />} />
          <Route path="dashboard" element={<ContainerDashboardPage />} />
          <Route path="clusters/:id" element={<ContainerClusterManagementPage />} />
          <Route path="cluster-management" element={<ContainerClusterManagementPage />} />
          <Route path="cluster-management/create" element={<ContainerCreateClusterPage />} />
          <Route path="cluster-management/:clusterId" element={<ContainerClusterDetailPage />} />
          <Route path="nodes" element={<ContainerNodesPage />} />
          <Route path="nodes/:id/edit-yaml" element={<ContainerEditNodeYamlPage />} />
          <Route path="nodes/:id/edit" element={<ContainerEditNodeConfigPage />} />
          <Route path="nodes/:id" element={<ContainerNodeDetailPage />} />
          <Route path="console/:id" element={<ContainerConsolePage />} />
          <Route path="deployments" element={<ContainerDeploymentsPage />} />
          <Route path="deployments/create" element={<ContainerCreateDeploymentPage />} />
          <Route path="deployments/create-yaml" element={<ContainerCreateDeploymentYamlPage />} />
          <Route path="deployments/:id/edit-yaml" element={<ContainerEditDeploymentYamlPage />} />
          <Route path="deployments/:id" element={<ContainerDeploymentDetailPage />} />
          <Route path="pods" element={<ContainerPodsPage />} />
          <Route path="pods/create" element={<ContainerCreatePodPage />} />
          <Route path="pods/create-yaml" element={<ContainerCreatePodYamlPage />} />
          <Route path="pods/:id/edit-yaml" element={<ContainerEditPodYamlPage />} />
          <Route path="pods/:id" element={<ContainerPodDetailPage />} />
          <Route path="pdb" element={<ContainerPDBPage />} />
          <Route path="pdb/create" element={<ContainerCreatePDBPage />} />
          <Route path="pdb/create-yaml" element={<ContainerCreatePDBYamlPage />} />
          <Route path="pdb/:id/edit-yaml" element={<ContainerEditPDBYamlPage />} />
          <Route path="pdb/:pdbId" element={<ContainerPDBDetailPage />} />
          <Route path="statefulsets" element={<ContainerStatefulSetsPage />} />
          <Route path="statefulsets/create" element={<ContainerCreateStatefulSetPage />} />
          <Route path="statefulsets/create-yaml" element={<ContainerCreateStatefulSetYamlPage />} />
          <Route path="statefulsets/:id/edit-yaml" element={<ContainerEditStatefulSetYamlPage />} />
          <Route path="statefulsets/:id" element={<ContainerStatefulSetDetailPage />} />
          <Route path="daemonsets" element={<ContainerDaemonSetsPage />} />
          <Route path="daemonsets/create" element={<ContainerCreateDaemonSetPage />} />
          <Route path="daemonsets/create-yaml" element={<ContainerCreateDaemonSetYamlPage />} />
          <Route path="daemonsets/:id/edit-yaml" element={<ContainerEditDaemonSetYamlPage />} />
          <Route path="daemonsets/:id" element={<ContainerDaemonSetDetailPage />} />
          <Route path="jobs" element={<ContainerJobsPage />} />
          <Route path="jobs/create" element={<ContainerCreateJobPage />} />
          <Route path="jobs/create-yaml" element={<ContainerCreateJobYamlPage />} />
          <Route path="jobs/:id/edit-yaml" element={<ContainerEditJobYamlPage />} />
          <Route path="jobs/:id" element={<ContainerJobDetailPage />} />
          <Route path="cronjobs" element={<ContainerCronJobsPage />} />
          <Route path="cronjobs/create" element={<ContainerCreateCronJobPage />} />
          <Route path="cronjobs/create-yaml" element={<ContainerCreateCronJobYamlPage />} />
          <Route path="cronjobs/:id/edit-yaml" element={<ContainerEditCronJobYamlPage />} />
          <Route path="cronjobs/:id" element={<ContainerCronJobDetailPage />} />
          <Route path="services" element={<ContainerServicesPage />} />
          <Route path="services/create" element={<ContainerCreateServicePage />} />
          <Route path="services/create-yaml" element={<ContainerCreateServiceYamlPage />} />
          <Route path="services/:id/edit-yaml" element={<ContainerEditServiceYamlPage />} />
          <Route path="services/:id" element={<ContainerServiceDetailPage />} />
          <Route path="ingresses" element={<ContainerIngressesPage />} />
          <Route path="ingresses/create" element={<ContainerCreateIngressPage />} />
          <Route path="ingresses/create-yaml" element={<ContainerCreateIngressYamlPage />} />
          <Route path="ingresses/:id/edit-yaml" element={<ContainerEditIngressYamlPage />} />
          <Route path="ingresses/:id" element={<ContainerIngressDetailPage />} />
          <Route path="hpa" element={<ContainerHPAPage />} />
          <Route path="hpa/create" element={<ContainerCreateHPAPage />} />
          <Route path="hpa/create-yaml" element={<ContainerCreateHPAYamlPage />} />
          <Route path="hpa/:id/edit-yaml" element={<ContainerEditHPAYamlPage />} />
          <Route path="hpa/:hpaId" element={<ContainerHPADetailPage />} />
          <Route path="persistent-volumes" element={<ContainerPersistentVolumesPage />} />
          <Route path="persistent-volumes/create" element={<ContainerCreatePVPage />} />
          <Route path="persistent-volumes/create-yaml" element={<ContainerCreatePVYamlPage />} />
          <Route path="persistent-volumes/:id/edit-yaml" element={<ContainerEditPVYamlPage />} />
          <Route path="persistent-volumes/:pvId" element={<ContainerPVDetailPage />} />
          <Route path="pvc" element={<ContainerPVCsPage />} />
          <Route path="pvc/create" element={<ContainerCreatePVCPage />} />
          <Route path="pvc/create-yaml" element={<ContainerCreatePVCYamlPage />} />
          <Route path="pvc/:id/edit-yaml" element={<ContainerEditPVCYamlPage />} />
          <Route path="pvc/:pvcId" element={<ContainerPVCDetailPage />} />
          <Route path="storage-classes" element={<ContainerStorageClassesPage />} />
          <Route path="storage-classes/create" element={<ContainerCreateStorageClassPage />} />
          <Route
            path="storage-classes/create-yaml"
            element={<ContainerCreateStorageClassYamlPage />}
          />
          <Route
            path="storage-classes/:id/edit-yaml"
            element={<ContainerEditStorageClassYamlPage />}
          />
          <Route
            path="storage-classes/:storageClassId"
            element={<ContainerStorageClassDetailPage />}
          />
          <Route path="configmaps" element={<ContainerConfigMapsPage />} />
          <Route path="configmaps/create" element={<ContainerCreateConfigMapPage />} />
          <Route path="configmaps/create-yaml" element={<ContainerCreateConfigMapYamlPage />} />
          <Route path="configmaps/:id/edit-yaml" element={<ContainerEditConfigMapYamlPage />} />
          <Route path="configmaps/:configMapId" element={<ContainerConfigMapDetailPage />} />
          <Route path="secrets" element={<ContainerSecretsPage />} />
          <Route path="secrets/create" element={<ContainerCreateSecretPage />} />
          <Route path="secrets/create-yaml" element={<ContainerCreateSecretYamlPage />} />
          <Route path="secrets/:id/edit-yaml" element={<ContainerEditSecretYamlPage />} />
          <Route path="secrets/:secretId" element={<ContainerSecretDetailPage />} />
          <Route path="limit-ranges" element={<ContainerLimitRangesPage />} />
          <Route path="limit-ranges/create" element={<ContainerCreateLimitRangePage />} />
          <Route path="limit-ranges/create-yaml" element={<ContainerCreateLimitRangeYamlPage />} />
          <Route path="limit-ranges/:id/edit-yaml" element={<ContainerEditLimitRangeYamlPage />} />
          <Route path="resource-quotas" element={<ContainerResourceQuotasPage />} />
          <Route path="resource-quotas/create" element={<ContainerCreateResourceQuotaPage />} />
          <Route
            path="resource-quotas/create-yaml"
            element={<ContainerCreateResourceQuotaYamlPage />}
          />
          <Route
            path="resource-quotas/:id/edit-yaml"
            element={<ContainerEditResourceQuotaYamlPage />}
          />
          <Route path="network-policies" element={<ContainerNetworkPoliciesPage />} />
          <Route path="network-policies/create" element={<ContainerCreateNetworkPolicyPage />} />
          <Route
            path="network-policies/create-yaml"
            element={<ContainerCreateNetworkPolicyYamlPage />}
          />
          <Route
            path="network-policies/:id/edit-yaml"
            element={<ContainerEditNetworkPolicyYamlPage />}
          />
          <Route
            path="network-policies/:networkPolicyId"
            element={<ContainerNetworkPolicyDetailPage />}
          />
          <Route path="namespaces" element={<ContainerNamespacesPage />} />
          <Route path="namespaces/create" element={<ContainerCreateNamespacePage />} />
          <Route path="namespaces/create-yaml" element={<ContainerCreateNamespaceYamlPage />} />
          <Route path="namespaces/:id/edit-yaml" element={<ContainerEditNamespaceYamlPage />} />
          <Route path="namespaces/:id" element={<ContainerNamespaceDetailPage />} />
          <Route path="events" element={<ContainerEventsPage />} />
        </Route>
        <Route path="/compute" element={<ComputeLayout />}>
          <Route index element={<ComputeHomePage />} />
          <Route path="instances" element={<ComputeInstancesPage />} />
          <Route path="instances/create" element={<ComputeCreateInstancePage />} />
          <Route path="instances/:id" element={<ComputeInstanceDetailPage />} />
          <Route path="instance-templates" element={<ComputeInstanceTemplatesPage />} />
          <Route path="instance-templates/:id" element={<ComputeInstanceTemplateDetailPage />} />
          <Route path="instance-snapshots" element={<ComputeInstanceSnapshotsPage />} />
          <Route path="instance-snapshots/:id" element={<ComputeInstanceSnapshotDetailPage />} />
          <Route path="images" element={<ComputeImagesPage />} />
          <Route path="images/create" element={<ComputeCreateImagePage />} />
          <Route path="images/:id" element={<ComputeImageDetailPage />} />
          <Route path="flavors" element={<ComputeFlavorsPage />} />
          <Route path="flavors/:id" element={<ComputeFlavorDetailPage />} />
          <Route path="key-pairs" element={<ComputeKeyPairsPage />} />
          <Route path="key-pairs/:id" element={<ComputeKeyPairDetailPage />} />
          <Route path="server-groups" element={<ComputeServerGroupsPage />} />
          <Route path="server-groups/:id" element={<ComputeServerGroupDetailPage />} />
          <Route path="volumes" element={<ComputeVolumesPage />} />
          <Route path="volumes/create" element={<ComputeCreateVolumePage />} />
          <Route path="volumes/:id" element={<ComputeVolumeDetailPage />} />
          <Route path="volume-snapshots" element={<ComputeVolumeSnapshotsPage />} />
          <Route path="volume-snapshots/:id" element={<ComputeVolumeSnapshotDetailPage />} />
          <Route path="volume-backups" element={<ComputeVolumeBackupsPage />} />
          <Route path="volume-backups/:id" element={<ComputeVolumeBackupDetailPage />} />
          <Route path="networks" element={<ComputeNetworksPage />} />
          <Route path="networks/create" element={<ComputeCreateNetworkPage />} />
          <Route path="networks/:id" element={<ComputeNetworkDetailPage />} />
          <Route path="routers" element={<ComputeRoutersPage />} />
          <Route path="routers/:id" element={<ComputeRouterDetailPage />} />
          <Route path="ports" element={<ComputePortsPage />} />
          <Route path="ports/:id" element={<ComputePortDetailPage />} />
          <Route path="floating-ips" element={<ComputeFloatingIPsPage />} />
          <Route path="floating-ips/:id" element={<ComputeFloatingIPDetailPage />} />
          <Route path="security-groups" element={<ComputeSecurityGroupsPage />} />
          <Route path="security-groups/:id" element={<ComputeSecurityGroupDetailPage />} />
          <Route path="load-balancers" element={<ComputeLoadBalancersPage />} />
          <Route path="load-balancers/create" element={<ComputeCreateLoadBalancerPage />} />
          <Route path="load-balancers/:id" element={<ComputeLoadBalancerDetailPage />} />
          <Route path="firewalls" element={<ComputeFirewallsPage />} />
          <Route path="firewalls/:id" element={<ComputeFirewallDetailPage />} />
          <Route path="certificates" element={<ComputeCertificatesPage />} />
          <Route path="certificates/:id" element={<ComputeCertificateDetailPage />} />
          <Route path="dns-zones" element={<ComputeDNSZonesPage />} />
          <Route path="backup-policies" element={<ComputeBackupPoliciesPage />} />
          <Route path="scheduled-tasks" element={<ComputeScheduledTasksPage />} />
        </Route>
        <Route path="/design" element={<DesignLayout />}>
          <Route index element={<DesignOverviewPage />} />
          <Route path="form-controls" element={<DesignFormControlsPage />} />
          <Route path="data-display" element={<DesignDataDisplayPage />} />
          <Route path="layout" element={<DesignLayoutComponentsPage />} />
          <Route path="feedback" element={<DesignFeedbackPage />} />
          <Route path="overlays" element={<DesignOverlaysPage />} />
          <Route path="navigation" element={<DesignNavigationPage />} />
        </Route>
        <Route path="/" element={<EntryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
