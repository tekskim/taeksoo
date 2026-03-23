# TDS SSoT → 프로덕션 Code-to-Code 가이드

## 1. 개요

### TDS SSoT란?

TDS(THAKI Design System) SSoT(Single Source of Truth)는 프로덕션 UI의 **실행 가능한 스펙**입니다. Figma 같은 정적 디자인이 아닌, 실제 동작하는 React 애플리케이션으로 모든 페이지의 구조, 인터랙션, 상태 관리, 접근성이 코드로 구현되어 있습니다.

- **라이브 데모**: https://thakicloud.github.io/tds_ssot/
- **소스 저장소**: `github.com/thakicloud/tds_ssot`

### Code-to-Code 방식이란?

기존 Figma 기반 "Design-to-Code"와 달리, TDS 소스코드를 프론트엔드 팀의 자체 라이브러리로 **번역(translation)**하는 방식입니다.

|               | Design-to-Code                | Code-to-Code                               |
| ------------- | ----------------------------- | ------------------------------------------ |
| **원본**      | Figma 디자인 (시각적, 불완전) | TDS React 소스코드 (완전한 구현)           |
| **변환 방식** | AI가 "해석" (추론 필요)       | AI가 "번역" (매핑 기반)                    |
| **정보 범위** | 레이아웃, 색상, 간격          | + 타입, 상태, 인터랙션, 필터, 검증, 접근성 |
| **정보 손실** | 높음                          | 매우 낮음                                  |

---

## 2. 워크플로우

```
1. TDS SSoT URL 확인
   https://thakicloud.github.io/tds_ssot/compute/instances

2. URL → 소스 파일 식별 (섹션 5 매핑 테이블 참조)
   /compute/instances → src/pages/InstanceListPage.tsx

3. TDS 소스코드 읽기
   - 데이터 타입 (Interface)
   - 테이블 컬럼 정의
   - 필터 필드/옵션
   - Drawer/Modal 목록 및 상태 관리
   - ContextMenu 항목
   - 페이지 구조 (PageShell > PageHeader > ListToolbar > Table)

4. 컴포넌트 매핑 테이블 적용 (섹션 6 참조)
   TDS Button → [프론트엔드 라이브러리 Button]
   TDS Table  → [프론트엔드 라이브러리 DataGrid]
   ...

5. 프론트엔드 라이브러리 기반 코드 생성
```

---

## 3. TDS가 제공하는 정보

TDS 소스코드 한 페이지에서 추출할 수 있는 정보와 Figma에서 얻을 수 있는 정보의 비교:

| 정보                             | Figma | TDS 소스 | 예시                                               |
| -------------------------------- | :---: | :------: | -------------------------------------------------- |
| 레이아웃 구조                    |   O   |    O     | PageHeader + Table                                 |
| 색상/간격/타이포                 |   O   |    O     | 토큰 기반 스타일                                   |
| 데이터 타입 정의                 |   X   |    O     | `interface Instance { id, name, status, ... }`     |
| 테이블 컬럼 (정렬, 너비, 렌더러) |   X   |    O     | `{ key: 'status', align: 'center', render: ... }`  |
| 필터 필드 + 옵션                 |   X   |    O     | `{ id: 'status', type: 'select', options: [...] }` |
| Drawer 목록 및 폼 필드           |   X   |    O     | Edit, Snapshot, Lock 등 12개 Drawer                |
| ContextMenu 항목                 |   X   |    O     | Start, Stop, Delete 등 액션 목록                   |
| 폼 검증 규칙                     |   X   |    O     | 필수 필드, 에러 메시지                             |
| 상태 관리 패턴                   |   X   |    O     | useState, 필터 연동, 페이지네이션                  |
| 라우팅 링크                      |   X   |    O     | 행 클릭 → Detail 페이지 이동                       |
| 벌크 액션                        |   X   |    O     | 선택된 행에 대한 일괄 처리                         |
| 접근성                           |   X   |    O     | aria-label, 키보드 네비게이션                      |

---

## 4. 페이지 패턴 (5가지)

TDS의 모든 페이지는 아래 5가지 패턴 중 하나입니다. 패턴을 먼저 파악하면 구현 속도가 빨라집니다.

### Pattern 1: List Page

**구조**: `PageHeader → ListToolbar → Pagination → Table`

**대표 예시**: `/compute/instances`, `/iam/users`, `/container/deployments`

**포함 요소**:

- 제목 + Create 버튼
- 필터 검색 (FilterSearchInput)
- 벌크 액션 (선택 시 활성화)
- 페이지네이션 (설정 포함)
- 테이블 (선택, 정렬, 커스텀 셀 렌더러)
- 행별 ContextMenu
- Drawer (Edit, Delete 등)

### Pattern 2: Detail Page

**구조**: `DetailHeader → Tabs → SectionCard(s)`

**대표 예시**: `/compute/instances/:id`, `/iam/users/:username`

**포함 요소**:

- 리소스명, 상태, ID(복사 가능), 메타 정보
- 액션 버튼 + More Actions 드롭다운
- 탭 (Details, Volumes, Network 등)
- SectionCard (라벨-값 쌍의 데이터 행)

### Pattern 3: Create Page (Wizard)

**구조**: `SectionCard(s) (순차 또는 동시)`

**대표 예시**: `/compute/instances/create`, `/container/deployments/create`

**포함 요소**:

- 다단계 폼 (Basic Info → Source → Configuration)
- 섹션별 상태 (pre/active/done)
- 폼 검증 (Next 클릭 시)
- 동적 폼 패턴 (Key-Value, 포트, 환경 변수 등)

### Pattern 4: Form Drawer

**구조**: `Drawer (title + FormFields + Footer)`

**대표 예시**: Edit Instance, Create Snapshot, Lock Setting

**포함 요소**:

- 3가지 타입: Basic, With description, With header box
- FormField (Input, Select, Toggle, Checkbox)
- 검증 (hasAttemptedSubmit 패턴)
- Footer (Cancel + Save/Submit)

### Pattern 5: Dashboard

**구조**: `MetricCard.Group + SectionCard(s) + Chart(s)`

**대표 예시**: `/container/dashboard`, `/storage/performance`

---

## 5. URL → 소스 파일 매핑

모든 소스 파일은 `src/pages/` 디렉토리에 위치합니다.

### Compute

| URL                                  | 소스 파일                        | 패턴      |
| ------------------------------------ | -------------------------------- | --------- |
| `/compute`                           | `ComputeHomePage.tsx`            | dashboard |
| `/compute/instances`                 | `InstanceListPage.tsx`           | list      |
| `/compute/instances/:id`             | `InstanceDetailPage.tsx`         | detail    |
| `/compute/instances/create`          | `CreateInstancePage.tsx`         | create    |
| `/compute/instance-templates`        | `InstanceTemplatesPage.tsx`      | list      |
| `/compute/instance-templates/:id`    | `InstanceTemplateDetailPage.tsx` | detail    |
| `/compute/instance-templates/create` | `CreateTemplatePage.tsx`         | create    |
| `/compute/instance-snapshots`        | `InstanceSnapshotsPage.tsx`      | list      |
| `/compute/instance-snapshots/:id`    | `InstanceSnapshotDetailPage.tsx` | detail    |
| `/compute/images`                    | `ComputeImagesPage.tsx`          | list      |
| `/compute/images/:id`                | `ComputeImageDetailPage.tsx`     | detail    |
| `/compute/images/create`             | `CreateImagePage.tsx`            | create    |
| `/compute/flavors`                   | `FlavorsPage.tsx`                | list      |
| `/compute/flavors/:id`               | `FlavorDetailPage.tsx`           | detail    |
| `/compute/key-pairs`                 | `KeyPairsPage.tsx`               | list      |
| `/compute/key-pairs/:id`             | `KeyPairDetailPage.tsx`          | detail    |
| `/compute/server-groups`             | `ServerGroupsPage.tsx`           | list      |
| `/compute/server-groups/:id`         | `ServerGroupDetailPage.tsx`      | detail    |
| `/compute/volumes`                   | `VolumesPage.tsx`                | list      |
| `/compute/volumes/:id`               | `VolumeDetailPage.tsx`           | detail    |
| `/compute/volumes/create`            | `CreateVolumePage.tsx`           | create    |
| `/compute/volume-snapshots`          | `VolumeSnapshotsPage.tsx`        | list      |
| `/compute/volume-snapshots/:id`      | `VolumeSnapshotDetailPage.tsx`   | detail    |
| `/compute/volume-backups`            | `VolumeBackupsPage.tsx`          | list      |
| `/compute/volume-backups/:id`        | `VolumeBackupDetailPage.tsx`     | detail    |
| `/compute/networks`                  | `NetworksPage.tsx`               | list      |
| `/compute/networks/:id`              | `NetworkDetailPage.tsx`          | detail    |
| `/compute/networks/create`           | `CreateNetworkPage.tsx`          | create    |
| `/compute/routers`                   | `RoutersPage.tsx`                | list      |
| `/compute/routers/:id`               | `RouterDetailPage.tsx`           | detail    |
| `/compute/ports`                     | `PortsPage.tsx`                  | list      |
| `/compute/ports/:id`                 | `PortDetailPage.tsx`             | detail    |
| `/compute/floating-ips`              | `FloatingIPsPage.tsx`            | list      |
| `/compute/floating-ips/:id`          | `FloatingIPDetailPage.tsx`       | detail    |
| `/compute/security-groups`           | `SecurityGroupsPage.tsx`         | list      |
| `/compute/security-groups/:id`       | `SecurityGroupDetailPage.tsx`    | detail    |
| `/compute/load-balancers`            | `LoadBalancersPage.tsx`          | list      |
| `/compute/load-balancers/:id`        | `LoadBalancerDetailPage.tsx`     | detail    |
| `/compute/load-balancers/create`     | `CreateLoadBalancerPage.tsx`     | create    |
| `/compute/certificates`              | `CertificatesPage.tsx`           | list      |
| `/compute/certificates/:id`          | `CertificateDetailPage.tsx`      | detail    |
| `/compute/dns-zones`                 | `DNSZonesPage.tsx`               | list      |
| `/compute/backup-policies`           | `BackupPoliciesPage.tsx`         | list      |
| `/compute/scheduled-tasks`           | `ScheduledTasksPage.tsx`         | list      |

### Compute Admin

| URL                                        | 소스 파일                                      | 패턴      |
| ------------------------------------------ | ---------------------------------------------- | --------- |
| `/compute-admin`                           | `ComputeAdminHomePage.tsx`                     | dashboard |
| `/compute-admin/instances`                 | `ComputeAdminInstanceListPage.tsx`             | list      |
| `/compute-admin/instances/:id`             | `ComputeAdminInstanceDetailPage.tsx`           | detail    |
| `/compute-admin/instances/create`          | `ComputeAdminCreateInstancePage.tsx`           | create    |
| `/compute-admin/instance-templates`        | `ComputeAdminInstanceTemplatesPage.tsx`        | list      |
| `/compute-admin/instance-templates/:id`    | `ComputeAdminInstanceTemplateDetailPage.tsx`   | detail    |
| `/compute-admin/instance-templates/create` | `ComputeAdminCreateTemplatePage.tsx`           | create    |
| `/compute-admin/instance-snapshots`        | `ComputeAdminInstanceSnapshotsPage.tsx`        | list      |
| `/compute-admin/instance-snapshots/:id`    | `ComputeAdminInstanceSnapshotDetailPage.tsx`   | detail    |
| `/compute-admin/images`                    | `ComputeAdminImagesPage.tsx`                   | list      |
| `/compute-admin/images/:id`                | `ComputeAdminImageDetailPage.tsx`              | detail    |
| `/compute-admin/images/create`             | `ComputeAdminCreateImagePage.tsx`              | create    |
| `/compute-admin/flavors`                   | `ComputeAdminFlavorsPage.tsx`                  | list      |
| `/compute-admin/flavors/:id`               | `ComputeAdminFlavorDetailPage.tsx`             | detail    |
| `/compute-admin/flavors/create`            | `ComputeAdminCreateFlavorPage.tsx`             | create    |
| `/compute-admin/server-groups`             | `ComputeAdminServerGroupsPage.tsx`             | list      |
| `/compute-admin/server-groups/:id`         | `ComputeAdminServerGroupDetailPage.tsx`        | detail    |
| `/compute-admin/host-aggregates`           | `ComputeAdminHostAggregatesPage.tsx`           | list      |
| `/compute-admin/bare-metal-nodes`          | `ComputeAdminBareMetalNodesPage.tsx`           | list      |
| `/compute-admin/bare-metal-nodes/:id`      | `ComputeAdminBareMetalDetailPage.tsx`          | detail    |
| `/compute-admin/volumes`                   | `ComputeAdminVolumesPage.tsx`                  | list      |
| `/compute-admin/volumes/:id`               | `ComputeAdminVolumeDetailPage.tsx`             | detail    |
| `/compute-admin/volume-snapshots`          | `ComputeAdminVolumeSnapshotsPage.tsx`          | list      |
| `/compute-admin/volume-snapshots/:id`      | `ComputeAdminVolumeSnapshotDetailPage.tsx`     | detail    |
| `/compute-admin/volume-backups`            | `ComputeAdminVolumeBackupsPage.tsx`            | list      |
| `/compute-admin/volume-backups/:id`        | `ComputeAdminVolumeBackupDetailPage.tsx`       | detail    |
| `/compute-admin/volume-types`              | `ComputeAdminVolumeTypesPage.tsx`              | list      |
| `/compute-admin/volume-types/:id`          | `ComputeAdminVolumeTypeDetailPage.tsx`         | detail    |
| `/compute-admin/networks`                  | `ComputeAdminNetworksPage.tsx`                 | list      |
| `/compute-admin/networks/:id`              | `ComputeAdminNetworkDetailPage.tsx`            | detail    |
| `/compute-admin/networks/create`           | `ComputeAdminCreateNetworkPage.tsx`            | create    |
| `/compute-admin/routers`                   | `ComputeAdminRoutersPage.tsx`                  | list      |
| `/compute-admin/routers/:id`               | `ComputeAdminRouterDetailPage.tsx`             | detail    |
| `/compute-admin/ports`                     | `ComputeAdminPortsPage.tsx`                    | list      |
| `/compute-admin/ports/:id`                 | `ComputeAdminPortDetailPage.tsx`               | detail    |
| `/compute-admin/floating-ips`              | `ComputeAdminFloatingIPsPage.tsx`              | list      |
| `/compute-admin/floating-ips/:id`          | `ComputeAdminFloatingIPDetailPage.tsx`         | detail    |
| `/compute-admin/security-groups`           | `ComputeAdminSecurityGroupsPage.tsx`           | list      |
| `/compute-admin/security-groups/:id`       | `ComputeAdminSecurityGroupDetailPage.tsx`      | detail    |
| `/compute-admin/load-balancers`            | `ComputeAdminLoadBalancersPage.tsx`            | list      |
| `/compute-admin/load-balancers/:id`        | `ComputeAdminLoadBalancerDetailPage.tsx`       | detail    |
| `/compute-admin/certificates`              | `ComputeAdminCertificatesPage.tsx`             | list      |
| `/compute-admin/certificates/:id`          | `ComputeAdminCertificateDetailPage.tsx`        | detail    |
| `/compute-admin/firewall`                  | `ComputeAdminFirewallsPage.tsx`                | list      |
| `/compute-admin/firewalls/:id`             | `ComputeAdminFirewallDetailPage.tsx`           | detail    |
| `/compute-admin/firewall/create-rule`      | `ComputeAdminCreateFirewallRulePage.tsx`       | create    |
| `/compute-admin/tenants`                   | `ComputeAdminTenantsPage.tsx`                  | list      |
| `/compute-admin/tenants/:id`               | `ComputeAdminTenantDetailPage.tsx`             | detail    |
| `/compute-admin/metadata-definition`       | `ComputeAdminMetadataDefinitionsPage.tsx`      | list      |
| `/compute-admin/metadata-definition/:id`   | `ComputeAdminMetadataDefinitionDetailPage.tsx` | detail    |
| `/compute-admin/physical-nodes`            | `ComputeAdminPhysicalNodesPage.tsx`            | list      |

### Container

| URL                                    | 소스 파일                             | 패턴      |
| -------------------------------------- | ------------------------------------- | --------- |
| `/container`                           | `ContainerHomePage.tsx`               | other     |
| `/container/dashboard`                 | `ContainerDashboardPage.tsx`          | dashboard |
| `/container/namespaces`                | `ContainerNamespacesPage.tsx`         | list      |
| `/container/namespaces/:name`          | `NamespaceDetailPage.tsx`             | detail    |
| `/container/namespaces/create`         | `CreateNamespacePage.tsx`             | create    |
| `/container/nodes`                     | `ContainerNodesPage.tsx`              | list      |
| `/container/nodes/:name`               | `NodeDetailPage.tsx`                  | detail    |
| `/container/events`                    | `ContainerEventsPage.tsx`             | list      |
| `/container/deployments`               | `DeploymentsPage.tsx`                 | list      |
| `/container/deployments/:id`           | `DeploymentDetailPage.tsx`            | detail    |
| `/container/deployments/create`        | `CreateDeploymentPage.tsx`            | create    |
| `/container/statefulsets`              | `StatefulSetsPage.tsx`                | list      |
| `/container/statefulsets/:id`          | `StatefulSetDetailPage.tsx`           | detail    |
| `/container/statefulsets/create`       | `CreateStatefulSetPage.tsx`           | create    |
| `/container/daemonsets`                | `DaemonSetsPage.tsx`                  | list      |
| `/container/daemonsets/:id`            | `DaemonSetDetailPage.tsx`             | detail    |
| `/container/daemonsets/create`         | `CreateDaemonSetPage.tsx`             | create    |
| `/container/jobs`                      | `JobsPage.tsx`                        | list      |
| `/container/jobs/:id`                  | `JobDetailPage.tsx`                   | detail    |
| `/container/jobs/create`               | `CreateJobPage.tsx`                   | create    |
| `/container/cronjobs`                  | `CronJobsPage.tsx`                    | list      |
| `/container/cronjobs/:id`              | `CronJobDetailPage.tsx`               | detail    |
| `/container/cronjobs/create`           | `CreateCronJobPage.tsx`               | create    |
| `/container/pods`                      | `PodsPage.tsx`                        | list      |
| `/container/pods/:id`                  | `PodDetailPage.tsx`                   | detail    |
| `/container/pods/create`               | `CreatePodPage.tsx`                   | create    |
| `/container/services`                  | `ContainerServicesPage.tsx`           | list      |
| `/container/services/:id`              | `ContainerServiceDetailPage.tsx`      | detail    |
| `/container/services/create`           | `CreateServicePage.tsx`               | create    |
| `/container/ingresses`                 | `ContainerIngressesPage.tsx`          | list      |
| `/container/ingresses/:id`             | `ContainerIngressDetailPage.tsx`      | detail    |
| `/container/ingresses/create`          | `CreateIngressPage.tsx`               | create    |
| `/container/hpa`                       | `ContainerHPAPage.tsx`                | list      |
| `/container/hpa/:id`                   | `ContainerHPADetailPage.tsx`          | detail    |
| `/container/hpa/create`                | `CreateHPAPage.tsx`                   | create    |
| `/container/persistent-volumes`        | `PersistentVolumesPage.tsx`           | list      |
| `/container/persistent-volumes/:id`    | `PersistentVolumeDetailPage.tsx`      | detail    |
| `/container/persistent-volumes/create` | `CreatePersistentVolumePage.tsx`      | create    |
| `/container/pvc`                       | `PersistentVolumeClaimsPage.tsx`      | list      |
| `/container/pvc/:id`                   | `PersistentVolumeClaimDetailPage.tsx` | detail    |
| `/container/pvc/create`                | `CreatePersistentVolumeClaimPage.tsx` | create    |
| `/container/storage-classes`           | `StorageClassesPage.tsx`              | list      |
| `/container/storage-classes/:id`       | `StorageClassDetailPage.tsx`          | detail    |
| `/container/storage-classes/create`    | `CreateStorageClassPage.tsx`          | create    |
| `/container/configmaps`                | `ConfigMapsPage.tsx`                  | list      |
| `/container/configmaps/:id`            | `ConfigMapDetailPage.tsx`             | detail    |
| `/container/configmaps/create`         | `CreateConfigMapPage.tsx`             | create    |
| `/container/secrets`                   | `SecretsPage.tsx`                     | list      |
| `/container/secrets/:id`               | `SecretDetailPage.tsx`                | detail    |
| `/container/secrets/create`            | `CreateSecretPage.tsx`                | create    |
| `/container/limit-ranges`              | `LimitRangesPage.tsx`                 | list      |
| `/container/limit-ranges/create`       | `CreateLimitRangePage.tsx`            | create    |
| `/container/resource-quotas`           | `ResourceQuotasPage.tsx`              | list      |
| `/container/resource-quotas/create`    | `CreateResourceQuotaPage.tsx`         | create    |
| `/container/network-policies`          | `NetworkPoliciesPage.tsx`             | list      |
| `/container/network-policies/:id`      | `NetworkPolicyDetailPage.tsx`         | detail    |
| `/container/network-policies/create`   | `CreateNetworkPolicyPage.tsx`         | create    |
| `/container/pdb`                       | `PodDisruptionBudgetsPage.tsx`        | list      |
| `/container/pdb/:id`                   | `PodDisruptionBudgetDetailPage.tsx`   | detail    |
| `/container/pdb/create`                | `CreatePodDisruptionBudgetPage.tsx`   | create    |
| `/container/cluster-management`        | `ClusterManagementPage.tsx`           | list      |
| `/container/cluster-management/:id`    | `ClusterDetailPage.tsx`               | detail    |
| `/container/cluster-management/create` | `CreateClusterPage.tsx`               | create    |

### IAM

| URL                                    | 소스 파일                           | 패턴      |
| -------------------------------------- | ----------------------------------- | --------- |
| `/iam`                                 | `IAMHomePage.tsx`                   | dashboard |
| `/iam/users`                           | `IAMUsersPage.tsx`                  | list      |
| `/iam/users/:username`                 | `IAMUserDetailPage.tsx`             | detail    |
| `/iam/users/create`                    | `CreateUserPage.tsx`                | create    |
| `/iam/user-groups`                     | `IAMUserGroupsPage.tsx`             | list      |
| `/iam/user-groups/:groupName`          | `IAMUserGroupDetailPage.tsx`        | detail    |
| `/iam/user-groups/create`              | `CreateUserGroupPage.tsx`           | create    |
| `/iam/roles`                           | `IAMRolesPage.tsx`                  | list      |
| `/iam/roles/:roleName`                 | `IAMRoleDetailPage.tsx`             | detail    |
| `/iam/roles/create`                    | `CreateRolePage.tsx`                | create    |
| `/iam/policies`                        | `IAMPoliciesPage.tsx`               | list      |
| `/iam/policies/:policyId`              | `IAMPolicyDetailPage.tsx`           | detail    |
| `/iam/policies/create`                 | `CreatePolicyPage.tsx`              | create    |
| `/iam/active-sessions`                 | `IAMActiveSessionsPage.tsx`         | list      |
| `/iam/domains`                         | `IAMDomainsPage.tsx`                | list      |
| `/iam/system-administrators`           | `IAMSystemAdministratorsPage.tsx`   | list      |
| `/iam/system-administrators/:username` | `IAMSystemAdminDetailPage.tsx`      | detail    |
| `/iam/system-administrators/create`    | `CreateSystemAdministratorPage.tsx` | create    |
| `/iam/event-logs`                      | `IAMEventLogsPage.tsx`              | list      |
| `/iam/mfa-policies`                    | `IAMMFAPoliciesPage.tsx`            | list      |
| `/iam/session-policies`                | `IAMSessionPoliciesPage.tsx`        | list      |
| `/iam/token-policies`                  | `IAMTokenPoliciesPage.tsx`          | list      |
| `/iam/login-policies`                  | `IAMLoginPoliciesPage.tsx`          | list      |

### Storage

| URL                       | 소스 파일                    | 패턴      |
| ------------------------- | ---------------------------- | --------- |
| `/storage`                | `StorageHomePage.tsx`        | dashboard |
| `/storage/pools`          | `PoolsPage.tsx`              | list      |
| `/storage/pools/:id`      | `StoragePoolDetailPage.tsx`  | detail    |
| `/storage/hosts`          | `HostsPage.tsx`              | list      |
| `/storage/hosts/:id`      | `HostDetailPage.tsx`         | detail    |
| `/storage/osds`           | `OSDsPage.tsx`               | list      |
| `/storage/osds/:id`       | `OSDDetailPage.tsx`          | detail    |
| `/storage/physical-disks` | `PhysicalDisksPage.tsx`      | list      |
| `/storage/images`         | `ImagesPage.tsx`             | list      |
| `/storage/images/:id`     | `ImageDetailPage.tsx`        | detail    |
| `/storage/buckets`        | `BucketsPage.tsx`            | list      |
| `/storage/buckets/:id`    | `BucketDetailPage.tsx`       | detail    |
| `/storage/buckets/create` | `CreateBucketPage.tsx`       | create    |
| `/storage/performance`    | `OverallPerformancePage.tsx` | dashboard |

### AI Platform

| URL                             | 소스 파일                             | 패턴      |
| ------------------------------- | ------------------------------------- | --------- |
| `/ai-platform`                  | `AIPlatformPage.tsx`                  | dashboard |
| `/ai-platform/explore`          | `ai-platform/ExplorePage.tsx`         | other     |
| `/ai-platform/packages`         | `ai-platform/PackagesPage.tsx`        | list      |
| `/ai-platform/models`           | `ai-platform/ModelsPage.tsx`          | list      |
| `/ai-platform/datasets`         | `ai-platform/DatasetsPage.tsx`        | list      |
| `/ai-platform/workloads`        | `ai-platform/WorkloadsPage.tsx`       | list      |
| `/ai-platform/workloads/:id`    | `WorkloadDetailPage.tsx`              | detail    |
| `/ai-platform/my-templates`     | `ai-platform/MyTemplatesPage.tsx`     | list      |
| `/ai-platform/devspace`         | `ai-platform/DevSpacePage.tsx`        | other     |
| `/ai-platform/pipeline-builder` | `ai-platform/PipelineBuilderPage.tsx` | other     |
| `/ai-platform/benchmarks`       | `ai-platform/BenchmarksPage.tsx`      | list      |
| `/ai-platform/serverless`       | `ai-platform/ServerlessPage.tsx`      | other     |
| `/ai-platform/monitoring`       | `ai-platform/MonitoringPage.tsx`      | other     |

---

## 6. 컴포넌트 매핑 테이블

> 아래 테이블은 TDS 컴포넌트와 `@ThakiCloud/shared` (thaki-shared) 컴포넌트의 매핑을 정리한 것입니다. TDS 팀에서 프론트엔드 라이브러리를 분석하여 사전 매핑을 완료한 상태이며, 정확하지 않은 부분이 있으면 피드백 부탁드립니다.

### Layout

| TDS 컴포넌트   | 역할                         | ThakiUI 컴포넌트                             | 비고                                                                         |
| -------------- | ---------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| `PageShell`    | 전체 페이지 레이아웃         | `Sidebar` + `TabBar` + `ToolBar` + flex 조합 | `AppLayout`은 사용하지 않음. flex shell + `Outlet`으로 직접 구성 (아래 참조) |
| `PageHeader`   | 페이지 제목 + 액션 버튼      | `Title` + 커스텀 조합                        | `Title title="..." size="large"` (기본값이 large). HStack으로 액션 배치      |
| `DetailHeader` | 리소스 상세 헤더             | `DetailPageHeader`                           | `InfoGrid`/`InfoCard` → `infoFields: DetailPageHeaderInfoField[]`            |
| `SectionCard`  | 섹션 카드 (Header + Content) | `Layout.Block` 또는 `DetailCard`             | `DataRow` → `DetailCardField`, `Header.actions` → `Layout.Block` 내 커스텀   |
| `ListToolbar`  | 검색 + 필터 + 벌크 액션 바   | 직접 대응 없음                               | `FilterSearchInput` + `Button` 조합으로 구성. `ComputeListTemplate` 참조     |
| `VStack`       | 수직 스택                    | `Layout.VStack`                              | `gap` 숫자 → `gap` 문자열 (`'xs'`/`'sm'`/`'md'`/`'lg'`)                      |
| `HStack`       | 수평 스택                    | `Layout.HStack`                              | 동일                                                                         |
| `Container`    | 컨테이너                     | `Layout.Container`                           | `maxWidth` 문자열 (`'sm'`/`'md'`/`'lg'`/`'xl'`)                              |

**PageShell 실제 구현 패턴** (Preview에서 사용 중):

```tsx
// TDS PageShell을 직접 대응시키는 shared 컴포넌트가 없으므로
// flex 레이아웃 + Sidebar + TabBar + ToolBar로 직접 조합
import TabBar from '@shared/components/TabBar/TabBar';
import ToolBar from '@shared/components/ToolBar/ToolBar';
import { Sidebar, SidebarMenu } from '@shared/components/Sidebar';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-surface">
      <TabBar tabs={[{ id: 'main', title: 'IAM', fixed: true }]} activeTab="main" ... />
      <div className="flex flex-1 overflow-hidden">
        <IAMSidebar isOpen={sidebarOpen} onNavigate={...} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ToolBar
            breadcrumbItems={breadcrumb}
            navigation={{ canGoBack, canGoForward, onGoBack, onGoForward }}
            isSidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 overflow-y-auto pt-4 px-8 pb-20">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
```

### Form Controls

| TDS 컴포넌트           | 역할                      | ThakiUI 컴포넌트                      | 비고                                                                                                                               |
| ---------------------- | ------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Button`               | 버튼                      | `Button`                              | `variant`: danger→error, `tertiary` 추가. `appearance` 별도 prop (solid/outline/ghost). size에 `'xs'` 추가                         |
| `Input`                | 텍스트 입력               | `Input`                               | size에 `'xs'` 추가. `filter` prop으로 입력 필터링 가능                                                                             |
| `NumberInput`          | 숫자 입력 (증감 버튼)     | 직접 대응 없음                        | `Input` + `filter={/^\d*$/}` 조합 또는 커스텀 구현 필요                                                                            |
| `Textarea`             | 여러 줄 텍스트            | `Textarea`                            | `autoResize`, `showCharacterCount` 지원                                                                                            |
| `Select`               | 드롭다운 선택             | `Dropdown.Select` + `Dropdown.Option` | `options` props 방식 → children 기반으로 변환 필요                                                                                 |
| `Checkbox`             | 체크박스                  | `Checkbox`                            | 거의 동일                                                                                                                          |
| `Radio` / `RadioGroup` | 라디오 버튼               | `RadioButton` / `RadioGroup`          | `options` 구조 유사, `renderOption` 커스텀 가능                                                                                    |
| `Toggle`               | on/off 스위치             | `Toggle`                              | `checkedLabel`/`uncheckedLabel` 추가 지원                                                                                          |
| `Slider`               | 범위 선택 슬라이더        | `Range`                               | `showValue` → 별도 구현. `dual` prop으로 범위 선택                                                                                 |
| `DatePicker`           | 날짜 선택                 | `DatePicker`                          | API 확인 필요                                                                                                                      |
| `SearchInput`          | 검색 입력                 | `Input` + 아이콘 조합                 | 직접 대응 없음                                                                                                                     |
| `FilterSearchInput`    | 고급 필터 검색            | `FilterSearchInput`                   | `filters` → `filterKeys`. `type`: `input/select/number/date/dateRange`. `defaultFilterKey`, `selectedFilters` 추가 (섹션 6.1 참조) |
| `FormField`            | 라벨 + 입력 + 도움말 래퍼 | `FormField`                           | `helperText` → `hint`, `errorMessage` → `error` (string)                                                                           |

### Data Display

| TDS 컴포넌트      | 역할                      | ThakiUI 컴포넌트                         | 비고                                                                                                                                                                      |
| ----------------- | ------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Table`           | 데이터 테이블             | `Table`/`SelectableTable` 또는 `TcTable` | deprecated `Table`+`SelectableTable` (현재 사용) / 권장 `TcTable` (섹션 6.2 참조)                                                                                         |
| `Pagination`      | 페이지 네비게이션         | `Pagination`                             | `currentPage`→`currentAt`, `pageSize`→`size`, `totalItems`→`totalCount`. 추가: `onSettingClick`, `selectedCount`, `totalCountLabel`                                       |
| `Badge`           | 뱃지/태그                 | `Badge`                                  | `variant` → `theme` (약어: `'blu'`/`'red'`/`'gre'`/`'ylw'`/`'gry'`), `type`: `'subtle'`/`'solid'`. `layout`: `text-only`/`left-icon`/`right-icon`. `size`: `sm`/`md`/`lg` |
| `BadgeList`       | 뱃지 목록 (overflow)      | `MultiItemDisplay`                       | API 확인 필요                                                                                                                                                             |
| `Chip`            | 필터 칩                   | `Tag`                                    | 이름 변경. 기능 유사                                                                                                                                                      |
| `StatusIndicator` | 상태 표시                 | `StatusIndicator`                        | `status` → `variant` (16종: active/pending/error/shutoff/degraded/building 등). `layout`: `leftIcon`/`iconOnly`. `colorScheme`, `customIcon`, `tooltip` 추가              |
| `MetricCard`      | 메트릭 카드               | 직접 대응 없음                           | `Layout.Block` + 커스텀 조합                                                                                                                                              |
| `InfoBox`         | 정보 박스 (label + value) | `InfoContainer`                          | `value` → `values: string[]` (배열), `children` → `showBullets`                                                                                                           |
| `ProgressBar`     | 진행률 바                 | `ProgressBar`                            | 거의 동일                                                                                                                                                                 |

### Navigation

| TDS 컴포넌트               | 역할                 | ThakiUI 컴포넌트 | 비고                                                                                                                                           |
| -------------------------- | -------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tabs` / `TabList` / `Tab` | 탭 네비게이션        | `Tabs` + `Tab`   | `value`→`activeTabId`, `variant`: underline→`line`, boxed→`button`. `size`: `sm`/`md`. `destroyOnHidden`, `fullWidth`, `contentClassName` 추가 |
| `TabBar`                   | 브라우저 스타일 탭바 | `TabBar`         | 거의 동일                                                                                                                                      |
| `TopBar`                   | 상단바               | `ToolBar`        | `breadcrumb` → `breadcrumbItems`, `actions` → `rightActions`. `navigation` 객체 필요                                                           |
| `Breadcrumb`               | 경로 표시            | `Breadcrumb`     | `items` 구조 유사. `path`만으로는 네비게이션 안 됨 — `onClick` 핸들러 필수. `isLoading` 지원                                                   |

### Overlay

| TDS 컴포넌트   | 역할                   | ThakiUI 컴포넌트                            | 비고                                                                                                   |
| -------------- | ---------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `Modal`        | 모달 다이얼로그        | `Overlay.Template type="modal"`             | `isOpen`→`appeared`, `onClose`→`onCancel`. Modal은 고정 너비(`w-[21.5rem]`), `size` 미적용             |
| `ConfirmModal` | 확인/삭제 모달         | `ActionModal` 또는 `DeleteResourceModal`    | `confirmVariant` → `actionButtonVariant` (error/primary/secondary)                                     |
| `Drawer`       | 사이드 패널 (폼)       | `Overlay.Template type="drawer-horizontal"` | `isOpen`→`appeared`, `footer`→`confirmUI`+`cancelUI`. `size`: `sm`/`md` (Drawer 전용). `isGlobal` 추가 |
| `Tooltip`      | 툴팁                   | `Tooltip`                                   | `position` → `direction`                                                                               |
| `Popover`      | 인터랙티브 팝오버      | 직접 대응 없음                              | `Portal` + 커스텀 구현 필요                                                                            |
| `ContextMenu`  | 컨텍스트/드롭다운 메뉴 | `ContextMenu.Root` + `ContextMenu.Item`     | `items` 배열 → compound component (children 기반)                                                      |

### Feedback

| TDS 컴포넌트    | 역할           | ThakiUI 컴포넌트                 | 비고                                                                                                    |
| --------------- | -------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `InlineMessage` | 인라인 알림    | `InlineMessage`                  | `variant` → `type`. 콘텐츠는 `message` prop (children 아님). `closable`, `expandable`, `timestamp` 추가 |
| `EmptyState`    | 빈 상태 화면   | `EmptyUI`                        | `icon`/`action` → `content: { title, description }` + `children`                                        |
| `ErrorState`    | 에러 상태 화면 | `Error403`/`Error404`/`Error500` | 페이지 레벨 에러용. 인라인 에러는 커스텀 필요                                                           |
| `Loading`       | 로딩 표시      | `LoadingSpinner` + `Skeleton`    | 스피너와 스켈레톤 분리                                                                                  |
| `Toast`         | 토스트 알림    | `Toast` (sonner 기반)            | `toast.custom(id => <Toast handleDismiss={...} />)` 패턴                                                |

### Detail Page

| TDS 컴포넌트            | 역할           | ThakiUI 컴포넌트            | 비고                                                                                                                    |
| ----------------------- | -------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `DetailHeader.InfoCard` | 상세 정보 카드 | `DetailPageHeaderInfoField` | `copyable` → `showCopyButton`+`copyText`                                                                                |
| `SectionCard.DataRow`   | 라벨-값 행     | `DetailCardField`           | `label`+`value` 동일. `isLink` → `type: 'component'`+커스텀. `DetailCard` 추가 props: `visible`, `isLoading`, `actions` |

### Create Page

| TDS 컴포넌트               | 역할            | ThakiUI 컴포넌트         | 비고                                                                                                                                        |
| -------------------------- | --------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `Wizard`                   | 다단계 폼       | 직접 대응 없음           | `Fieldset` + 커스텀 상태 관리로 구현                                                                                                        |
| `FormField` (Open Section) | 위자드 폼 필드  | `Fieldset` + `FormField` | `Fieldset variant`: `default`/`bordered`/`elevated`. `direction`: `vertical`/`horizontal`. `requiredIndicator`, `description`, `error` 추가 |
| —                          | Create 레이아웃 | `CreateLayout`           | TDS에 없는 컴포넌트. `sidebar`(FloatingCard), `header` 지원                                                                                 |
| —                          | 요약 사이드바   | `FloatingCard`           | TDS에 없는 컴포넌트. `sections`, `quotas` 지원                                                                                              |

---

### 6.1 FilterSearchInput 변환 가이드

두 라이브러리 모두 `FilterSearchInput`을 제공하지만, 필터 정의와 상태 관리 API가 다릅니다.

```tsx
// === TDS ===
import type { FilterField, AppliedFilter } from '@/design-system';

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'running', label: 'Running' },
      { value: 'stopped', label: 'Stopped' },
    ],
  },
];
const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

<FilterSearchInput
  filters={filterFields}
  appliedFilters={appliedFilters}
  onFiltersChange={setAppliedFilters}
  placeholder="Search by attributes"
/>;

// === ThakiUI ===
import type { FilterKey } from '@thaki/shared';

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'running', label: 'Running' },
      { value: 'stopped', label: 'Stopped' },
    ],
  },
];

<FilterSearchInput
  filterKeys={filterKeys}
  onFilterAdd={handleFilterAdd}
  selectedFilters={appliedFilters}
  placeholder="Search by attributes"
  defaultFilterKey="name"
/>;
```

**주요 차이:**

- `id` → `key`
- `type: 'text'` → `type: 'input'`
- `filters` → `filterKeys`
- `appliedFilters`+`onFiltersChange` → `onFilterAdd` 콜백 + `selectedFilters` (중복 방지)
- ThakiUI `FilterKey.type`은 `'input'`/`'select'` 외에 `'number'`/`'date'`/`'dateRange'`도 지원
- `defaultFilterKey`: 기본 필터 키 (검색창 focus 시 자동 선택)

---

### 6.2 Table 변환 가이드

ThakiUI에는 두 가지 Table API가 있습니다.

#### 방법 A: `Table` + `SelectableTable` (deprecated, Preview에서 사용 중)

`Table`은 `columns` + `rows`(TDS의 `data`) 기반이며, `Table.Tr` / `Table.Td` children으로 행을 렌더링합니다. 선택 기능이 필요하면 `SelectableTable`로 감쌉니다. **deprecated**이지만 Preview 앱에서 현재 사용 중인 패턴입니다.

```tsx
// === TDS Table ===
const columns = [
  { key: 'name', header: 'Name', sortable: true, minWidth: 200 },
  {
    key: 'status',
    header: 'Status',
    align: 'center' as const,
    render: (_, row) => <StatusIndicator status={row.status} label={row.status} />,
  },
  { key: 'createdAt', header: 'Created', align: 'right' as const, sortable: true },
];

<Table
  columns={columns}
  data={instances}
  rowKey="id"
  selectable
  selectedKeys={selectedItems}
  onSelectionChange={setSelectedItems}
/>;

// === ThakiUI Table + SelectableTable (deprecated) ===
const columns: TableColumn[] = [
  { key: 'status', header: 'Status', width: 80, align: 'center' },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'createdAt', header: 'Created', sortable: true },
];

<SelectableTable
  columns={columns}
  rows={instances}
  selectionType="checkbox"
  selectedRows={selectedItems}
  onRowSelectionChange={setSelectedItems}
  getRowId={(row) => row.id}
  sort={sortKey}
  order={sortOrder}
  onSortChange={handleSortChange}
  stickyLastColumn
>
  {(row) => (
    <Table.Tr>
      <Table.Td>
        <StatusIndicator variant={statusMap[row.status]} layout="iconOnly" />
      </Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.createdAt}</Table.Td>
    </Table.Tr>
  )}
</SelectableTable>;
```

**SelectableTable 주요 Props:**

| Prop                   | 타입                        | 설명                      |
| ---------------------- | --------------------------- | ------------------------- |
| `selectionType`        | `'checkbox' \| 'radio'`     | 선택 유형                 |
| `selectedRows`         | `(string \| number)[]`      | 선택된 행 ID 배열         |
| `onRowSelectionChange` | `(ids) => void`             | 선택 변경 콜백            |
| `getRowId`             | `(row) => string \| number` | 행 고유 ID 추출 함수      |
| `selectOnRowClick`     | `boolean`                   | 행 클릭 시 선택 여부      |
| `isRowDisabled`        | `(row) => boolean`          | 행 비활성화 여부          |
| `stickyLastColumn`     | `boolean`                   | 마지막 컬럼(Actions) 고정 |

#### 방법 B: `TcTable` (권장, 신규 코드용)

`TcTable`은 render-prop 기반이며, `columnNames`는 **문자열 배열**입니다. 컬럼 메타데이터(정렬, 너비)는 `TcTable.Td` props에서 자동 추론됩니다.

```tsx
// === ThakiUI TcTable (권장) ===
const columnNames = ['Name', 'Status', 'Created'];

<TcTable.Body
  type="checkbox"
  isLoading={isLoading}
  rowData={instances}
  columnNames={columnNames}
  selectedValues={selectedItems}
  getSelectValue={(row) => row.id}
  onChange={setSelectedItems}
>
  {(row, helpers) => (
    <TcTable.Tr>
      <TcTable.Td>{row.name}</TcTable.Td>
      <TcTable.Td align="center">
        <StatusIndicator variant={row.status} label={row.status} />
      </TcTable.Td>
      <TcTable.Td align="right">{row.createdAt}</TcTable.Td>
    </TcTable.Tr>
  )}
</TcTable.Body>;
```

> **주의**: `columnNames`는 `string[]`이며, TDS의 `columns` 객체 배열과 구조가 다릅니다. 헤더 텍스트만 전달하고, 정렬·너비·정렬 정보는 `TcTable.Td`에서 설정합니다.

**핵심 차이 요약:**

| 항목        | TDS                           | ThakiUI (Table)                  | ThakiUI (TcTable)                    |
| ----------- | ----------------------------- | -------------------------------- | ------------------------------------ |
| 데이터 prop | `data`                        | `rows`                           | `rowData`                            |
| 컬럼 정의   | `columns` (객체 배열)         | `columns` (객체 배열)            | `columnNames` (string[])             |
| 셀 렌더링   | `columns[].render` 함수       | `Table.Tr` / `Table.Td` children | `TcTable.Tr` / `TcTable.Td` children |
| 선택        | `selectable` + `selectedKeys` | `SelectableTable` 래퍼           | `type="checkbox"` + `selectedValues` |
| 상태        | 현행                          | deprecated                       | 권장                                 |

---

### 6.3 Overlay (Modal/Drawer) 변환 가이드

TDS는 `Modal`과 `Drawer`가 별도 컴포넌트이지만, ThakiUI는 `Overlay.Template`으로 통합되어 있습니다.

```tsx
// === TDS Modal ===
<Modal isOpen={isOpen} onClose={handleClose} title="Delete Instance" size="sm">
  <InfoBox label="Instance" value={instance.name} />
  <div className="flex gap-2 w-full">
    <Button variant="secondary" onClick={handleClose} className="flex-1">Cancel</Button>
    <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
  </div>
</Modal>

// === ThakiUI Overlay (Modal) ===
// 주의: Modal은 고정 너비(w-[21.5rem])이며 size prop이 적용되지 않음
<Overlay.Template
  type="modal"
  appeared={isOpen}
  title="Delete Instance"
  onCancel={handleClose}
  onConfirm={handleDelete}
  confirmUI={<Button variant="error">Delete</Button>}
  cancelUI={<Button variant="secondary">Cancel</Button>}
>
  <InfoContainer label="Instance" values={[instance.name]} />
</Overlay.Template>

// === ThakiUI 삭제 전용 (더 간편) ===
<DeleteResourceModal
  appeared={isOpen}
  onConfirm={handleDelete}
  onCancel={handleClose}
  targets={[{ id: instance.id, name: instance.name }]}
  labels={{ titleSingle: 'Delete Instance', descriptionSingle: '...', actionButtonText: 'Delete' }}
/>

// === ThakiUI 일반 확인 액션 ===
<ActionModal
  appeared={isOpen}
  onConfirm={handleAction}
  onCancel={handleClose}
  actionConfig={{ title: 'Disable Agent', subtitle: '...', actionButtonText: 'Disable', actionButtonVariant: 'primary' }}
>
  <Textarea placeholder="Reason..." />
</ActionModal>
```

```tsx
// === TDS Drawer ===
<Drawer isOpen={isOpen} onClose={handleClose} title="Edit Instance" width={360}
  footer={
    <HStack gap={2} className="w-full">
      <Button variant="secondary" className="flex-1">Cancel</Button>
      <Button variant="primary" className="flex-1">Save</Button>
    </HStack>
  }
>
  <VStack gap={6}>
    <FormField label="Name"><Input fullWidth /></FormField>
  </VStack>
</Drawer>

// === ThakiUI Overlay (Drawer) ===
// size는 drawer-horizontal에만 적용 ('sm' | 'md')
<Overlay.Template
  type="drawer-horizontal"
  size="sm"
  appeared={isOpen}
  isGlobal
  title="Edit Instance"
  onCancel={handleClose}
  onConfirm={handleSave}
  confirmUI={<Button variant="primary">Save</Button>}
  cancelUI={<Button variant="secondary">Cancel</Button>}
>
  <Layout.VStack gap="lg">
    <FormField label="Name"><Input /></FormField>
  </Layout.VStack>
</Overlay.Template>
```

---

### 6.4 Prop 이름 변환 요약

| 카테고리            | TDS Prop              | ThakiUI Prop                | 값 변환                                                                        |
| ------------------- | --------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| **Button**          | `variant="danger"`    | `variant="error"`           | danger → error                                                                 |
| **Button**          | `variant="ghost"`     | `appearance="ghost"`        | variant에서 appearance로 분리                                                  |
| **Badge**           | `variant="info"`      | `theme="blu"`               | info→blu, success→gre, warning→ylw, danger→red                                 |
| **Badge**           | —                     | `type="subtle"` / `"solid"` | TDS의 기본 스타일 → subtle                                                     |
| **StatusIndicator** | `status="active"`     | `variant="active"`          | prop 이름만 변경                                                               |
| **Pagination**      | `currentPage`         | `currentAt`                 | 이름 변경                                                                      |
| **Pagination**      | `pageSize`            | `size`                      | 이름 변경                                                                      |
| **Pagination**      | `totalItems`          | `totalCount`                | 이름 변경                                                                      |
| **FormField**       | `helperText`          | `hint`                      | 이름 변경                                                                      |
| **FormField**       | `errorMessage`        | `error` (string)            | 이름 변경                                                                      |
| **Tabs**            | `value`               | `activeTabId`               | 이름 변경                                                                      |
| **Tabs**            | `variant="underline"` | `variant="line"`            | underline → line                                                               |
| **Tabs**            | `variant="boxed"`     | `variant="button"`          | boxed → button                                                                 |
| **Modal/Drawer**    | `isOpen`              | `appeared`                  | 이름 변경                                                                      |
| **Modal/Drawer**    | `onClose`             | `onCancel`                  | 이름 변경                                                                      |
| **Tooltip**         | `position`            | `direction`                 | 이름 변경                                                                      |
| **InlineMessage**   | `variant`             | `type`                      | 이름 변경. 콘텐츠: `children` → `message` prop                                 |
| **VStack/HStack**   | `gap={4}` (숫자)      | `gap="md"` (문자열)         | 숫자 → 토큰 이름                                                               |
| **StatusIndicator** | —                     | `layout="iconOnly"`         | TDS는 props로 분리 안 됨. ThakiUI `layout` 추가                                |
| **Pagination**      | —                     | `onSettingClick`            | 설정 버튼 클릭 콜백 (ThakiUI 전용)                                             |
| **Pagination**      | —                     | `selectedCount`             | 선택된 행 수 표시 (ThakiUI 전용)                                               |
| **Pagination**      | —                     | `totalCountLabel`           | 기본값 `'items'` (ThakiUI 전용)                                                |
| **Breadcrumb**      | `items[].href`        | `items[].onClick`           | `path`만으로 자동 네비게이션 안 됨                                             |
| **DetailCard**      | —                     | `visible`, `isLoading`      | 조건부 표시/로딩 상태 (ThakiUI 전용)                                           |
| **Fieldset**        | —                     | `variant="elevated"`        | `default`/`bordered`/`elevated` 3종                                            |
| **Table**           | `data`                | `rows`                      | deprecated Table/SelectableTable 사용 시                                       |
| **Table**           | `selectable`          | `SelectableTable` 래퍼      | `selectionType="checkbox"`, `selectedRows`, `onRowSelectionChange`, `getRowId` |
| **Table**           | `data`                | `rowData`                   | TcTable 사용 시                                                                |
| **Table**           | `columns` (객체 배열) | `columnNames` (string[])    | TcTable — 메타데이터는 `TcTable.Td`에서 설정                                   |

### 6.5 직접 대응 없는 TDS 컴포넌트

아래 컴포넌트는 ThakiUI에 직접 대응이 없으며, 조합하거나 커스텀 구현이 필요합니다.

| TDS 컴포넌트          | 대응 방안                                              | 난이도 |
| --------------------- | ------------------------------------------------------ | :----: |
| `ListToolbar`         | `FilterSearchInput` + `Layout.HStack` + `Button` 조합  |  낮음  |
| `PageHeader`          | `Title size="large"` + `Layout.HStack` + `Button` 조합 |  낮음  |
| `NumberInput`         | `Input filter={/^\d*$/}` + 증감 버튼 커스텀            |  중간  |
| `Popover`             | `Portal` + 커스텀 트리거/콘텐츠                        |  중간  |
| `MetricCard`          | `Layout.Block` + 커스텀 레이아웃                       |  낮음  |
| `Wizard`              | `Fieldset` + 상태 관리                                 |  중간  |
| `SearchInput`         | `Input` + 검색 아이콘 래퍼                             |  낮음  |
| `ErrorState` (인라인) | `EmptyUI` 커스텀 또는 직접 구현                        |  낮음  |

### 6.6 ThakiUI에만 있는 컴포넌트 (활용 권장)

TDS에는 없지만 ThakiUI에서 제공하는 컴포넌트로, 프론트엔드 구현 시 활용하면 좋습니다.

| ThakiUI 컴포넌트      | 역할                                       | 활용 시점                               | Preview에서 사용 여부 |
| --------------------- | ------------------------------------------ | --------------------------------------- | :-------------------: |
| `ActionModal`         | 일반 확인 액션 모달 (커스텀 children 지원) | TDS `ConfirmModal` 변환 시              |           O           |
| `DeleteResourceModal` | 삭제 확인 모달 (타겟 목록)                 | 벌크/단일 삭제 모달                     |           O           |
| `CopyButton`          | 클립보드 복사 버튼                         | Detail 헤더, 코드 블록 등               |           O           |
| `Sidebar`             | 접기/펼치기 사이드바                       | 앱 레이아웃 사이드바                    |           O           |
| `SidebarMenu`         | 사이드바 메뉴 (섹션/아이템)                | `Sidebar` 내부 네비게이션               |           O           |
| `CreateLayout`        | Create 페이지 레이아웃 (사이드바 포함)     | TDS의 Create 페이지 변환 시             |           X           |
| `FloatingCard`        | 요약/Quota 사이드바                        | Create 위자드의 사이드바 패널           |           X           |
| `Fieldset`            | 폼 섹션 그룹핑                             | TDS의 Open Section Card 대체            |           X           |
| `ResourceActionModal` | 리소스 액션 모달 (InfoContainer 포함)      | ConfirmModal 변환 시                    |           X           |
| `TabSelector`         | 세그먼트 스타일 탭                         | 작은 옵션 그룹 전환                     |           X           |
| `ExpandableTable`     | 확장 가능 테이블                           | Detail 페이지 내 중첩 데이터            |           X           |
| `SelectableTable`     | 선택 가능 테이블 (Table 확장, deprecated)  | Table + 선택 기능 (Preview에서 사용 중) |           O           |
| `TableSettingDrawer`  | 테이블 컬럼 설정                           | TDS의 ViewPreferencesDrawer 대체        |           X           |

**Preview에서 확인된 매핑 (Overlay 섹션 보충):**

| TDS 컴포넌트                       | ThakiUI 컴포넌트            | Props 요약                                                                                                                     |
| ---------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `ConfirmModal`                     | `ActionModal`               | `appeared`, `onConfirm`, `onCancel`, `actionConfig: { title, subtitle, actionButtonText, actionButtonVariant }`                |
| `ConfirmModal` (삭제)              | `DeleteResourceModal`       | `appeared`, `onConfirm`, `onCancel`, `targets: [{ id, name }]`, `labels: { titleSingle, descriptionSingle, actionButtonText }` |
| `CopyButton`                       | `CopyButton`                | `text` (복사할 텍스트)                                                                                                         |
| `DetailHeader.InfoCard` (copyable) | `DetailPageHeaderInfoField` | `showCopyButton: true`, `copyText: string`                                                                                     |
| — (앱 사이드바)                    | `Sidebar` + `SidebarMenu`   | `Sidebar`: `isCollapsed`. `SidebarMenu`: `sections`, `defaultOpenSections`, `onNavigate`, `isItemActive`                       |

---

## 7. 변환 범위와 한계

TDS 페이지의 코드는 3가지 레이어로 구성되어 있으며, 레이어별로 변환 방식이 다릅니다.

### 레이어 1: DS 컴포넌트 → 매핑 테이블로 번역

`@/design-system`에서 import하는 컴포넌트들입니다. 섹션 6의 매핑 테이블에 따라 `@thaki/shared` 컴포넌트로 1:1 변환됩니다.

```tsx
// TDS 원본
import { Table, Button, Modal, PageHeader, StatusIndicator } from '@/design-system';

// ThakiUI 변환 (실제 import 경로)
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { SelectableTable } from '@shared/components/Table/SelectableTable';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Pagination } from '@shared/components/Pagination';
import { Title } from '@shared/components/Title';
import { Overlay } from '@shared/components/Overlay';
```

### 레이어 2: Tailwind 인라인 UI → 그대로 복사 또는 자동 변환

DS 컴포넌트가 아닌 커스텀 레이아웃들입니다. TDS 페이지에 상당수 존재합니다.

**대표적인 예시:**

테이블 셀의 커스텀 렌더러 (Name + ID 2줄 표시):

```tsx
render: (_, row) => (
  <div className="flex flex-col gap-0.5 min-w-0">
    <Link
      to={`/compute/instances/${row.id}`}
      className="text-label-md text-[var(--color-action-primary)] hover:underline truncate"
    >
      {row.name}
    </Link>
    <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
      ID : {row.id}
    </span>
  </div>
),
```

Create 페이지의 카드 레이아웃:

```tsx
<div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-4">
  ...
</div>
```

Detail 페이지의 Logs 탭 커스텀 UI:

```tsx
<div className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-md w-full">
  <span className="text-label-lg text-[var(--color-text-default)]">Log Length</span>
  ...
</div>
```

**변환 전략:**

- ThakiUI도 **Tailwind CSS를 사용**하므로 인라인 UI는 대부분 변환 없이 그대로 가져갈 수 있음
- TDS의 CSS 변수(`var(--color-...)`, `var(--primitive-...)`)는 `@thaki/shared/tailwind.preset`과 `@thaki/shared/core.css`에서 정의하는 토큰 시스템으로 매핑 필요
- TDS 유틸리티 클래스(`text-body-md`, `text-heading-h5` 등)는 ThakiUI 프리셋에서 동일한 이름을 사용하는지 확인 필요

### 레이어 3: 앱 특화 컴포넌트 → 자체 구현 필요

`@/components/`에서 import하는 앱 레벨 컴포넌트들입니다. 디자인 시스템의 일부가 아니며, 프론트엔드 팀이 자체적으로 구현해야 합니다.

| 컴포넌트                       | 역할                    | 변환 방안                                                         |
| ------------------------------ | ----------------------- | ----------------------------------------------------------------- |
| `Sidebar`                      | 사이드바 네비게이션     | `@shared/components/Sidebar` + `SidebarMenu` 사용 (섹션 6.6 참조) |
| `ContainerSidebar`             | Container 전용 사이드바 | `@shared/components/Sidebar` + `SidebarMenu` 사용                 |
| `ShellPanel`                   | 하단 터미널 패널        | 프론트엔드 팀 자체 구현                                           |
| `ViewPreferencesDrawer`        | 테이블 설정 Drawer      | TDS 소스 참조하여 구현                                            |
| `CreateInstanceSnapshotDrawer` | 스냅샷 생성 Drawer      | TDS 소스 참조하여 구현                                            |
| `LockSettingDrawer`            | 잠금 설정 Drawer        | TDS 소스 참조하여 구현                                            |
| `EditInstanceDrawer`           | 인스턴스 편집 Drawer    | TDS 소스 참조하여 구현                                            |
| 기타 Drawer 컴포넌트들         | 리소스별 액션 Drawer    | TDS 소스 참조하여 구현                                            |

> **참고**: 앱 특화 Drawer 컴포넌트들의 소스는 `src/components/` 디렉토리에 있으며, 내부적으로 DS 컴포넌트(`Drawer`, `FormField`, `Input`, `Select` 등)를 조합하여 구성되어 있으므로 매핑 테이블을 적용하면 변환이 가능합니다.

### 변환 비율 (예상)

일반적인 List/Detail 페이지 기준:

| 레이어                         | 비율 | 변환 난이도 |
| ------------------------------ | :--: | :---------: |
| DS 컴포넌트 (매핑 번역)        | ~60% | 낮음 (자동) |
| Tailwind 인라인 UI (복사/변환) | ~25% |  낮음~중간  |
| 앱 특화 컴포넌트 (자체 구현)   | ~15% |  중간~높음  |

Create 페이지(Wizard)의 경우 인라인 UI 비율이 더 높아질 수 있습니다 (~35%).

---

## 8. Cursor AI와 함께 사용하는 방법

### 사전 준비

1. TDS 소스 저장소를 로컬에 클론 (또는 Git submodule로 포함)
2. 컴포넌트 매핑 테이블 확인 및 피드백 (섹션 6 — TDS 팀에서 사전 매핑 완료)
3. 프론트엔드 라이브러리의 Cursor Rules 작성 (`.cursor/rules/`에 배치)

### 프롬프트 예시

```
TDS 소스 파일 src/pages/InstanceListPage.tsx를 참조하여
@thaki/shared 기반으로 Instance 목록 페이지를 구현해줘.

컴포넌트 매핑 (CODE_TO_CODE_GUIDE.md 섹션 6 참조):
- TDS Table → TcTable (render-prop 기반, 섹션 6.2 참조)
- TDS Button variant="danger" → Button variant="error"
- TDS StatusIndicator status → StatusIndicator variant
- TDS FilterSearchInput filters → FilterSearchInput filterKeys
- TDS Drawer → Overlay.Template type="drawer-horizontal"
- TDS ContextMenu items → ContextMenu.Root + ContextMenu.Item

TDS 소스에서 다음을 추출해서 적용해:
- Interface 타입 정의
- 테이블 컬럼 정의 (정렬, 너비, 커스텀 렌더러)
- 필터 필드 및 옵션
- Drawer 목록 및 폼 필드
- ContextMenu 항목
- 벌크 액션 로직
```

### AI가 수행하는 변환

```tsx
// === TDS 원본 ===
import { Table, StatusIndicator, FilterSearchInput, PageHeader, Button } from '@/design-system';

<PageHeader title="Instances" actions={<Button variant="primary">Create</Button>} />
<FilterSearchInput filters={filterFields} appliedFilters={appliedFilters} ... />
<Table columns={columns} data={data} selectable selectedKeys={selected} ... />

// === ThakiUI (@thaki/shared) 변환 ===
import { TcTable, StatusIndicator, FilterSearchInput, Title, Button } from '@thaki/shared';

<Layout.HStack justify="between" align="center">
  <Title title="Instances" size="large" />
  <Button variant="primary">Create</Button>
</Layout.HStack>
<FilterSearchInput filterKeys={filterKeys} onFilterAdd={handleFilterAdd} ... />
<TcTable.Body type="checkbox" rowData={data} columnNames={columnNames}
  selectedValues={selected} getSelectValue={(row) => row.id} onChange={setSelected}>
  {(row) => (
    <TcTable.Tr>
      <TcTable.Td>{row.name}</TcTable.Td>
      <TcTable.Td align="center">
        <StatusIndicator variant={row.status} label={row.statusLabel} />
      </TcTable.Td>
    </TcTable.Tr>
  )}
</TcTable.Body>
```

**변환되는 부분**: 컴포넌트 이름, props 이름, API 구조 (Table→TcTable, Modal→Overlay 등)

**변환되지 않는 부분**: 타입 정의, 비즈니스 로직, 상태 관리, 필터/정렬 로직, Tailwind 인라인 스타일

---

## 9. 페이지 규모 요약

| 카테고리      |  List  | Detail | Create |  기타  |   합계   |
| ------------- | :----: | :----: | :----: | :----: | :------: |
| Compute       |   17   |   16   |   9    |   3    |    45    |
| Compute Admin |   20   |   22   |   7    |   4    |    53    |
| Container     |   17   |   17   |   34   |   15   |    83    |
| IAM           |   11   |   5    |   5    |   1    |    22    |
| Storage       |   5    |   4    |   1    |   2    |    12    |
| AI Platform   |   6    |   1    |   0    |   14   |    21    |
| 기타          |   1    |   2    |   2    |   9    |    14    |
| **합계**      | **77** | **67** | **58** | **48** | **~250** |

---

## 10. 권장 구현 순서

### Phase 1: 패턴 검증 (3개 리소스)

1. **Compute Instances** (List + Detail + Create)
   - 가장 대표적인 3가지 패턴 포함
   - Drawer 12개, ContextMenu, 벌크 액션 등 모든 인터랙션 포함
   - 컴포넌트 매핑의 정확도를 검증하는 기준 페이지

2. **IAM Users** (List + Detail + Create)
   - 비교적 단순한 구조로 패턴 검증에 적합
   - Create 페이지의 위자드 패턴 포함

3. **Container Deployments** (List + Detail + Create)
   - Container 레이아웃 (ContainerSidebar) 확인
   - YAML 편집 패턴 포함

### Phase 2: List 페이지 일괄 변환

List 페이지는 모두 동일한 패턴(PageHeader + ListToolbar + Pagination + Table)이므로, Phase 1에서 검증된 매핑을 기반으로 빠르게 진행 가능.

### Phase 3: Detail 페이지 일괄 변환

Detail 페이지는 모두 동일한 패턴(DetailHeader + Tabs + SectionCard)이므로, 마찬가지로 빠르게 진행 가능.

### Phase 4: Create 페이지

Create 페이지는 위자드 패턴과 동적 폼 패턴이 포함되어 가장 복잡. Phase 1에서 검증한 매핑을 기반으로 진행.

---

## 11. FAQ

**Q: TDS 소스의 Mock 데이터도 변환해야 하나요?**

아닙니다. Mock 데이터는 데모용이며 실제 API 연동으로 대체합니다. 다만 `interface` 타입 정의와 테이블 컬럼 정의는 그대로 활용하세요.

**Q: TDS에 있는 컴포넌트가 우리 라이브러리에 없으면?**

두 가지 선택지가 있습니다:

1. 기존 컴포넌트를 조합하여 구현
2. 해당 TDS 컴포넌트의 소스를 가져와 커스터마이즈

매핑 테이블의 "비고" 란에 대응 방안이 표시되어 있으니 확인 부탁드립니다. 누락되거나 부정확한 매핑이 있으면 피드백 주세요.

**Q: Figma MCP와 병행할 수 있나요?**

네. Figma는 시각적 레퍼런스(색상, 간격, 레이아웃 확인)로, TDS 소스코드는 구조적 레퍼런스(로직, 인터랙션, 타입)로 병행 사용하면 가장 정확합니다.

**Q: TDS가 업데이트되면 어떻게 하나요?**

TDS SSoT 사이트에서 변경된 페이지를 확인하고, 해당 소스 파일의 diff를 검토하여 변경 사항을 적용합니다. `CHANGELOG.md`에서 변경 이력을 확인할 수 있습니다.

**Q: 한 번에 여러 페이지를 자동 변환할 수 있나요?**

패턴이 동일한 List 페이지들은 매핑 테이블이 확정된 후 배치 변환이 가능합니다. 다만 첫 3개 페이지(Phase 1)에서 매핑 정확도를 충분히 검증한 후 진행하는 것을 권장합니다.
