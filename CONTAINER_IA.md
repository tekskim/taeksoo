# Container 페이지 IA (Information Architecture)

> **기준 파일**: `src/App.tsx` (Container Routes, 716~962번 줄), `src/components/ContainerSidebar.tsx`  
> **최종 업데이트**: 2026-03-17

## Screen ID 체계

```
CON + 1Code(2) + 2Code(2) + 3Code(2) + [4Code(2)]

1Code  섹션         01=Global, 02=Cluster Management, 03=Cluster, 04=Workloads
                   05=Service Discovery, 06=Storage, 07=Policy, 08=App Catalog
2Code  리소스       섹션 내 순서 (01, 02, 03…)
3Code  화면 타입    01=List, 02=Create Form, 03=Create YAML, 04=Detail
                   05=Edit Config, 06=Edit YAML
4Code  탭 (선택)    Detail 페이지 탭 순서 (01, 02, 03…)
```

---

## 01. Global

| Screen ID | Screen Name | Page Type | Route Path             | Breadcrumb      |
| --------- | ----------- | --------- | ---------------------- | --------------- |
| CON0101   | Home        | home      | `/container`           | —               |
| CON0102   | Dashboard   | dashboard | `/container/dashboard` | `{clusterName}` |

---

## 02. Cluster Management

| Screen ID   | Screen Name                         | Page Type   | Route Path                                  | Breadcrumb                                       |
| ----------- | ----------------------------------- | ----------- | ------------------------------------------- | ------------------------------------------------ |
| CON020101   | Clusters                            | list        | `/container/cluster-management`             | `Cluster management > Clusters`                  |
| CON020102   | Create Cluster (Form)               | create-form | `/container/cluster-management/create`      | `Cluster management > Clusters > Create cluster` |
| CON020103   | Create Cluster (YAML)               | create-yaml | `/container/cluster-management/create-yaml` | `Cluster management > Clusters > Create cluster` |
| CON020104   | Cluster Detail                      | detail      | `/container/cluster-management/:clusterId`  | `Cluster management > Clusters > {clusterName}`  |
| CON02010401 | Cluster Detail — Networking         | detail-tab  | `/container/cluster-management/:clusterId`  | `Cluster management > Clusters > {clusterName}`  |
| CON02010402 | Cluster Detail — Node configuration | detail-tab  | `/container/cluster-management/:clusterId`  | `Cluster management > Clusters > {clusterName}`  |

---

## 03. Cluster

### 03-01. Namespaces

| Screen ID   | Screen Name                   | Page Type   | Route Path                                       | Breadcrumb                                                 |
| ----------- | ----------------------------- | ----------- | ------------------------------------------------ | ---------------------------------------------------------- |
| CON030101   | Namespaces                    | list        | `/container/namespaces`                          | `{clusterName} > Namespaces`                               |
| CON030102   | Create Namespace (Form)       | create-form | `/container/namespaces/create`                   | `{clusterName} > Namespaces > Create namespace`            |
| CON030103   | Create Namespace (YAML)       | create-yaml | `/container/namespaces/create-yaml`              | `{clusterName} > Namespaces > Create namespace`            |
| CON030104   | Namespace Detail              | detail      | `/container/namespaces/:namespaceName`           | `{clusterName} > Namespaces > {namespaceName}`             |
| CON03010401 | Namespace Detail — Resources  | detail-tab  | `/container/namespaces/:namespaceName`           | `{clusterName} > Namespaces > {namespaceName}`             |
| CON03010402 | Namespace Detail — Workloads  | detail-tab  | `/container/namespaces/:namespaceName`           | `{clusterName} > Namespaces > {namespaceName}`             |
| CON03010403 | Namespace Detail — Conditions | detail-tab  | `/container/namespaces/:namespaceName`           | `{clusterName} > Namespaces > {namespaceName}`             |
| CON030106   | Edit Namespace (YAML)         | edit-yaml   | `/container/namespaces/:namespaceName/edit-yaml` | `{clusterName} > Namespaces > {namespaceName} > Edit YAML` |

### 03-02. Nodes

| Screen ID   | Screen Name                 | Page Type   | Route Path                             | Breadcrumb                                       |
| ----------- | --------------------------- | ----------- | -------------------------------------- | ------------------------------------------------ |
| CON030201   | Nodes                       | list        | `/container/nodes`                     | `{clusterName} > Nodes`                          |
| CON030204   | Node Detail                 | detail      | `/container/nodes/:nodeName`           | `{clusterName} > Nodes > {nodeName}`             |
| CON03020401 | Node Detail — Pods          | detail-tab  | `/container/nodes/:nodeName`           | `{clusterName} > Nodes > {nodeName}`             |
| CON03020402 | Node Detail — Details       | detail-tab  | `/container/nodes/:nodeName`           | `{clusterName} > Nodes > {nodeName}`             |
| CON03020403 | Node Detail — Images        | detail-tab  | `/container/nodes/:nodeName`           | `{clusterName} > Nodes > {nodeName}`             |
| CON03020404 | Node Detail — Taints        | detail-tab  | `/container/nodes/:nodeName`           | `{clusterName} > Nodes > {nodeName}`             |
| CON03020405 | Node Detail — Conditions    | detail-tab  | `/container/nodes/:nodeName`           | `{clusterName} > Nodes > {nodeName}`             |
| CON03020406 | Node Detail — Recent events | detail-tab  | `/container/nodes/:nodeName`           | `{clusterName} > Nodes > {nodeName}`             |
| CON030205   | Edit Node Config            | edit-config | `/container/nodes/:nodeName/edit`      | `{clusterName} > Nodes > {nodeName} > Edit`      |
| CON030206   | Edit Node (YAML)            | edit-yaml   | `/container/nodes/:nodeName/edit-yaml` | `{clusterName} > Nodes > {nodeName} > Edit YAML` |

### 03-03. Events

| Screen ID | Screen Name | Page Type | Route Path          | Breadcrumb               |
| --------- | ----------- | --------- | ------------------- | ------------------------ |
| CON030301 | Events      | list      | `/container/events` | `{clusterName} > Events` |

### 03-04. Console

| Screen ID | Screen Name       | Page Type | Route Path                       | Breadcrumb                |
| --------- | ----------------- | --------- | -------------------------------- | ------------------------- |
| CON030401 | Container Console | console   | `/container/console/:instanceId` | `{clusterName} > Console` |

---

## 04. Workloads

### 04-01. Deployments

| Screen ID   | Screen Name                       | Page Type   | Route Path                                         | Breadcrumb                                                     |
| ----------- | --------------------------------- | ----------- | -------------------------------------------------- | -------------------------------------------------------------- |
| CON040101   | Deployments                       | list        | `/container/deployments`                           | `{clusterName} > Deployments`                                  |
| CON040102   | Create Deployment (Form)          | create-form | `/container/deployments/create`                    | `{clusterName} > Deployments > Create deployment`              |
| CON040103   | Create Deployment (YAML)          | create-yaml | `/container/deployments/create-yaml`               | `{clusterName} > Deployments > Create deployment`              |
| CON040104   | Deployment Detail                 | detail      | `/container/deployments/:deploymentId`             | `{clusterName} > Deployments > {deploymentName}`               |
| CON04010401 | Deployment Detail — Pods          | detail-tab  | `/container/deployments/:deploymentId`             | `{clusterName} > Deployments > {deploymentName}`               |
| CON04010402 | Deployment Detail — Services      | detail-tab  | `/container/deployments/:deploymentId`             | `{clusterName} > Deployments > {deploymentName}`               |
| CON04010403 | Deployment Detail — Conditions    | detail-tab  | `/container/deployments/:deploymentId`             | `{clusterName} > Deployments > {deploymentName}`               |
| CON04010404 | Deployment Detail — Recent events | detail-tab  | `/container/deployments/:deploymentId`             | `{clusterName} > Deployments > {deploymentName}`               |
| CON040105   | Edit Deployment (Config)          | edit-config | `/container/deployments/:deploymentName/edit`      | `{clusterName} > Deployments > {deploymentName} > Edit config` |
| CON040106   | Edit Deployment (YAML)            | edit-yaml   | `/container/deployments/:deploymentName/edit-yaml` | `{clusterName} > Deployments > {deploymentName} > Edit YAML`   |

### 04-02. StatefulSets

| Screen ID   | Screen Name                        | Page Type   | Route Path                                           | Breadcrumb                                                       |
| ----------- | ---------------------------------- | ----------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| CON040201   | StatefulSets                       | list        | `/container/statefulsets`                            | `{clusterName} > StatefulSets`                                   |
| CON040202   | Create StatefulSet (Form)          | create-form | `/container/statefulsets/create`                     | `{clusterName} > StatefulSets > Create StatefulSet`              |
| CON040203   | Create StatefulSet (YAML)          | create-yaml | `/container/statefulsets/create-yaml`                | `{clusterName} > StatefulSets > Create StatefulSet`              |
| CON040204   | StatefulSet Detail                 | detail      | `/container/statefulsets/:statefulsetId`             | `{clusterName} > StatefulSets > {statefulSetName}`               |
| CON04020401 | StatefulSet Detail — Pods          | detail-tab  | `/container/statefulsets/:statefulsetId`             | `{clusterName} > StatefulSets > {statefulSetName}`               |
| CON04020402 | StatefulSet Detail — Services      | detail-tab  | `/container/statefulsets/:statefulsetId`             | `{clusterName} > StatefulSets > {statefulSetName}`               |
| CON04020403 | StatefulSet Detail — Conditions    | detail-tab  | `/container/statefulsets/:statefulsetId`             | `{clusterName} > StatefulSets > {statefulSetName}`               |
| CON04020404 | StatefulSet Detail — Recent events | detail-tab  | `/container/statefulsets/:statefulsetId`             | `{clusterName} > StatefulSets > {statefulSetName}`               |
| CON040205   | Edit StatefulSet (Config)          | edit-config | `/container/statefulsets/:statefulSetName/edit`      | `{clusterName} > StatefulSets > {statefulSetName} > Edit config` |
| CON040206   | Edit StatefulSet (YAML)            | edit-yaml   | `/container/statefulsets/:statefulSetName/edit-yaml` | `{clusterName} > StatefulSets > {statefulSetName} > Edit YAML`   |

### 04-03. DaemonSets

| Screen ID   | Screen Name                      | Page Type   | Route Path                                       | Breadcrumb                                                   |
| ----------- | -------------------------------- | ----------- | ------------------------------------------------ | ------------------------------------------------------------ |
| CON040301   | DaemonSets                       | list        | `/container/daemonsets`                          | `{clusterName} > DaemonSets`                                 |
| CON040302   | Create DaemonSet (Form)          | create-form | `/container/daemonsets/create`                   | `{clusterName} > DaemonSets > Create DaemonSet`              |
| CON040303   | Create DaemonSet (YAML)          | create-yaml | `/container/daemonsets/create-yaml`              | `{clusterName} > DaemonSets > Create DaemonSet`              |
| CON040304   | DaemonSet Detail                 | detail      | `/container/daemonsets/:daemonsetId`             | `{clusterName} > DaemonSets > {daemonSetName}`               |
| CON04030401 | DaemonSet Detail — Pods          | detail-tab  | `/container/daemonsets/:daemonsetId`             | `{clusterName} > DaemonSets > {daemonSetName}`               |
| CON04030402 | DaemonSet Detail — Services      | detail-tab  | `/container/daemonsets/:daemonsetId`             | `{clusterName} > DaemonSets > {daemonSetName}`               |
| CON04030403 | DaemonSet Detail — Conditions    | detail-tab  | `/container/daemonsets/:daemonsetId`             | `{clusterName} > DaemonSets > {daemonSetName}`               |
| CON04030404 | DaemonSet Detail — Recent events | detail-tab  | `/container/daemonsets/:daemonsetId`             | `{clusterName} > DaemonSets > {daemonSetName}`               |
| CON040305   | Edit DaemonSet (Config)          | edit-config | `/container/daemonsets/:daemonSetName/edit`      | `{clusterName} > DaemonSets > {daemonSetName} > Edit config` |
| CON040306   | Edit DaemonSet (YAML)            | edit-yaml   | `/container/daemonsets/:daemonSetName/edit-yaml` | `{clusterName} > DaemonSets > {daemonSetName} > Edit YAML`   |

### 04-04. Jobs

| Screen ID   | Screen Name                | Page Type   | Route Path                           | Breadcrumb                                       |
| ----------- | -------------------------- | ----------- | ------------------------------------ | ------------------------------------------------ |
| CON040401   | Jobs                       | list        | `/container/jobs`                    | `{clusterName} > Jobs`                           |
| CON040402   | Create Job (Form)          | create-form | `/container/jobs/create`             | `{clusterName} > Jobs > Create job`              |
| CON040403   | Create Job (YAML)          | create-yaml | `/container/jobs/create-yaml`        | `{clusterName} > Jobs > Create job`              |
| CON040404   | Job Detail                 | detail      | `/container/jobs/:jobId`             | `{clusterName} > Jobs > {jobName}`               |
| CON04040401 | Job Detail — Pods          | detail-tab  | `/container/jobs/:jobId`             | `{clusterName} > Jobs > {jobName}`               |
| CON04040402 | Job Detail — Conditions    | detail-tab  | `/container/jobs/:jobId`             | `{clusterName} > Jobs > {jobName}`               |
| CON04040403 | Job Detail — Recent events | detail-tab  | `/container/jobs/:jobId`             | `{clusterName} > Jobs > {jobName}`               |
| CON040405   | Edit Job (Config)          | edit-config | `/container/jobs/:jobName/edit`      | `{clusterName} > Jobs > {jobName} > Edit config` |
| CON040406   | Edit Job (YAML)            | edit-yaml   | `/container/jobs/:jobName/edit-yaml` | `{clusterName} > Jobs > {jobName} > Edit YAML`   |

### 04-05. CronJobs

| Screen ID   | Screen Name                    | Page Type   | Route Path                                   | Breadcrumb                                               |
| ----------- | ------------------------------ | ----------- | -------------------------------------------- | -------------------------------------------------------- |
| CON040501   | CronJobs                       | list        | `/container/cronjobs`                        | `{clusterName} > CronJobs`                               |
| CON040502   | Create CronJob (Form)          | create-form | `/container/cronjobs/create`                 | `{clusterName} > CronJobs > Create CronJob`              |
| CON040503   | Create CronJob (YAML)          | create-yaml | `/container/cronjobs/create-yaml`            | `{clusterName} > CronJobs > Create CronJob`              |
| CON040504   | CronJob Detail                 | detail      | `/container/cronjobs/:cronjobId`             | `{clusterName} > CronJobs > {cronJobName}`               |
| CON04050401 | CronJob Detail — Jobs          | detail-tab  | `/container/cronjobs/:cronjobId`             | `{clusterName} > CronJobs > {cronJobName}`               |
| CON04050402 | CronJob Detail — Recent events | detail-tab  | `/container/cronjobs/:cronjobId`             | `{clusterName} > CronJobs > {cronJobName}`               |
| CON040505   | Edit CronJob (Config)          | edit-config | `/container/cronjobs/:cronJobName/edit`      | `{clusterName} > CronJobs > {cronJobName} > Edit config` |
| CON040506   | Edit CronJob (YAML)            | edit-yaml   | `/container/cronjobs/:cronJobName/edit-yaml` | `{clusterName} > CronJobs > {cronJobName} > Edit YAML`   |

### 04-06. Pods

| Screen ID   | Screen Name                | Page Type   | Route Path                           | Breadcrumb                                       |
| ----------- | -------------------------- | ----------- | ------------------------------------ | ------------------------------------------------ |
| CON040601   | Pods                       | list        | `/container/pods`                    | `{clusterName} > Pods`                           |
| CON040602   | Create Pod (Form)          | create-form | `/container/pods/create`             | `{clusterName} > Pods > Create pod`              |
| CON040603   | Create Pod (YAML)          | create-yaml | `/container/pods/create-yaml`        | `{clusterName} > Pods > Create pod`              |
| CON040604   | Pod Detail                 | detail      | `/container/pods/:podId`             | `{clusterName} > Pods > {podName}`               |
| CON04060401 | Pod Detail — Containers    | detail-tab  | `/container/pods/:podId`             | `{clusterName} > Pods > {podName}`               |
| CON04060402 | Pod Detail — Conditions    | detail-tab  | `/container/pods/:podId`             | `{clusterName} > Pods > {podName}`               |
| CON04060403 | Pod Detail — Recent events | detail-tab  | `/container/pods/:podId`             | `{clusterName} > Pods > {podName}`               |
| CON040605   | Edit Pod (Config)          | edit-config | `/container/pods/:podName/edit`      | `{clusterName} > Pods > {podName} > Edit config` |
| CON040606   | Edit Pod (YAML)            | edit-yaml   | `/container/pods/:podName/edit-yaml` | `{clusterName} > Pods > {podName} > Edit YAML`   |

---

## 05. Service Discovery

### 05-01. Services

| Screen ID   | Screen Name                 | Page Type   | Route Path                                 | Breadcrumb                                               |
| ----------- | --------------------------- | ----------- | ------------------------------------------ | -------------------------------------------------------- |
| CON050101   | Services                    | list        | `/container/services`                      | `{clusterName} > Services`                               |
| CON050102   | Create Service (Form)       | create-form | `/container/services/create`               | `{clusterName} > Services > Create service`              |
| CON050103   | Create Service (YAML)       | create-yaml | `/container/services/create-yaml`          | `{clusterName} > Services > Create service`              |
| CON050104   | Service Detail              | detail      | `/container/services/:serviceId`           | `{clusterName} > Services > {serviceName}`               |
| CON05010401 | Service Detail — Pods       | detail-tab  | `/container/services/:serviceId`           | `{clusterName} > Services > {serviceName}`               |
| CON05010402 | Service Detail — Ports      | detail-tab  | `/container/services/:serviceId`           | `{clusterName} > Services > {serviceName}`               |
| CON05010403 | Service Detail — Selectors  | detail-tab  | `/container/services/:serviceId`           | `{clusterName} > Services > {serviceName}`               |
| CON05010404 | Service Detail — Conditions | detail-tab  | `/container/services/:serviceId`           | `{clusterName} > Services > {serviceName}`               |
| CON050105   | Edit Service (Config)       | edit-config | `/container/services/:serviceId/edit`      | `{clusterName} > Services > {serviceName} > Edit config` |
| CON050106   | Edit Service (YAML)         | edit-yaml   | `/container/services/:serviceId/edit-yaml` | `{clusterName} > Services > {serviceName} > Edit YAML`   |

### 05-02. Ingresses

| Screen ID   | Screen Name            | Page Type   | Route Path                                  | Breadcrumb                                                |
| ----------- | ---------------------- | ----------- | ------------------------------------------- | --------------------------------------------------------- |
| CON050201   | Ingresses              | list        | `/container/ingresses`                      | `{clusterName} > Ingresses`                               |
| CON050202   | Create Ingress (Form)  | create-form | `/container/ingresses/create`               | `{clusterName} > Ingresses > Create ingress`              |
| CON050203   | Create Ingress (YAML)  | create-yaml | `/container/ingresses/create-yaml`          | `{clusterName} > Ingresses > Create ingress`              |
| CON050204   | Ingress Detail         | detail      | `/container/ingresses/:ingressId`           | `{clusterName} > Ingresses > {ingressName}`               |
| CON05020401 | Ingress Detail — Rules | detail-tab  | `/container/ingresses/:ingressId`           | `{clusterName} > Ingresses > {ingressName}`               |
| CON050205   | Edit Ingress (Config)  | edit-config | `/container/ingresses/:ingressId/edit`      | `{clusterName} > Ingresses > {ingressName} > Edit config` |
| CON050206   | Edit Ingress (YAML)    | edit-yaml   | `/container/ingresses/:ingressId/edit-yaml` | `{clusterName} > Ingresses > {ingressName} > Edit YAML`   |

### 05-03. Horizontal Pod Autoscalers (HPA)

| Screen ID   | Screen Name                | Page Type   | Route Path                        | Breadcrumb                                                             |
| ----------- | -------------------------- | ----------- | --------------------------------- | ---------------------------------------------------------------------- |
| CON050301   | Horizontal pod autoscalers | list        | `/container/hpa`                  | `{clusterName} > Horizontal pod autoscalers`                           |
| CON050302   | Create HPA (Form)          | create-form | `/container/hpa/create`           | `{clusterName} > Horizontal pod autoscalers > Create HPA`              |
| CON050303   | Create HPA (YAML)          | create-yaml | `/container/hpa/create-yaml`      | `{clusterName} > Horizontal pod autoscalers > Create HPA`              |
| CON050304   | HPA Detail                 | detail      | `/container/hpa/:hpaId`           | `{clusterName} > Horizontal pod autoscalers > {hpaName}`               |
| CON05030401 | HPA Detail — Metrics       | detail-tab  | `/container/hpa/:hpaId`           | `{clusterName} > Horizontal pod autoscalers > {hpaName}`               |
| CON05030402 | HPA Detail — Behavior      | detail-tab  | `/container/hpa/:hpaId`           | `{clusterName} > Horizontal pod autoscalers > {hpaName}`               |
| CON05030403 | HPA Detail — Conditions    | detail-tab  | `/container/hpa/:hpaId`           | `{clusterName} > Horizontal pod autoscalers > {hpaName}`               |
| CON050305   | Edit HPA (Config)          | edit-config | `/container/hpa/:hpaId/edit`      | `{clusterName} > Horizontal pod autoscalers > {hpaName} > Edit config` |
| CON050306   | Edit HPA (YAML)            | edit-yaml   | `/container/hpa/:hpaId/edit-yaml` | `{clusterName} > Horizontal pod autoscalers > {hpaName} > Edit YAML`   |

---

## 06. Storage

### 06-01. Persistent Volumes

| Screen ID   | Screen Name                          | Page Type   | Route Path                                        | Breadcrumb                                                      |
| ----------- | ------------------------------------ | ----------- | ------------------------------------------------- | --------------------------------------------------------------- |
| CON060101   | Persistent volumes                   | list        | `/container/persistent-volumes`                   | `{clusterName} > Persistent volumes`                            |
| CON060102   | Create Persistent Volume (Form)      | create-form | `/container/persistent-volumes/create`            | `{clusterName} > Persistent volumes > Create persistent volume` |
| CON060103   | Create Persistent Volume (YAML)      | create-yaml | `/container/persistent-volumes/create-yaml`       | `{clusterName} > Persistent volumes > Create persistent volume` |
| CON060104   | Persistent Volume Detail             | detail      | `/container/persistent-volumes/:pvId`             | `{clusterName} > Persistent volumes > {pvName}`                 |
| CON06010401 | Persistent Volume Detail — Customize | detail-tab  | `/container/persistent-volumes/:pvId`             | `{clusterName} > Persistent volumes > {pvName}`                 |
| CON060105   | Edit Persistent Volume (Config)      | edit-config | `/container/persistent-volumes/:pvName/edit`      | `{clusterName} > Persistent volumes > {pvName} > Edit config`   |
| CON060106   | Edit Persistent Volume (YAML)        | edit-yaml   | `/container/persistent-volumes/:pvName/edit-yaml` | `{clusterName} > Persistent volumes > {pvName} > Edit YAML`     |

### 06-02. Persistent Volume Claims (PVC)

| Screen ID   | Screen Name                       | Page Type   | Route Path                          | Breadcrumb                                                           |
| ----------- | --------------------------------- | ----------- | ----------------------------------- | -------------------------------------------------------------------- |
| CON060201   | Persistent volume claims          | list        | `/container/pvc`                    | `{clusterName} > Persistent volume claims`                           |
| CON060202   | Create PVC (Form)                 | create-form | `/container/pvc/create`             | `{clusterName} > Persistent volume claims > Create PVC`              |
| CON060203   | Create PVC (YAML)                 | create-yaml | `/container/pvc/create-yaml`        | `{clusterName} > Persistent volume claims > Create PVC`              |
| CON060204   | PVC Detail                        | detail      | `/container/pvc/:pvcId`             | `{clusterName} > Persistent volume claims > {pvcName}`               |
| CON06020401 | PVC Detail — Volume claim         | detail-tab  | `/container/pvc/:pvcId`             | `{clusterName} > Persistent volume claims > {pvcName}`               |
| CON06020402 | PVC Detail — Customize            | detail-tab  | `/container/pvc/:pvcId`             | `{clusterName} > Persistent volume claims > {pvcName}`               |
| CON06020403 | PVC Detail — Conditions           | detail-tab  | `/container/pvc/:pvcId`             | `{clusterName} > Persistent volume claims > {pvcName}`               |
| CON06020404 | PVC Detail — Labels & annotations | detail-tab  | `/container/pvc/:pvcId`             | `{clusterName} > Persistent volume claims > {pvcName}`               |
| CON06020405 | PVC Detail — Recent events        | detail-tab  | `/container/pvc/:pvcId`             | `{clusterName} > Persistent volume claims > {pvcName}`               |
| CON060205   | Edit PVC (Config)                 | edit-config | `/container/pvc/:pvcName/edit`      | `{clusterName} > Persistent volume claims > {pvcName} > Edit config` |
| CON060206   | Edit PVC (YAML)                   | edit-yaml   | `/container/pvc/:pvcName/edit-yaml` | `{clusterName} > Persistent volume claims > {pvcName} > Edit YAML`   |

### 06-03. Storage Classes

| Screen ID   | Screen Name                       | Page Type   | Route Path                                               | Breadcrumb                                                           |
| ----------- | --------------------------------- | ----------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| CON060301   | Storage classes                   | list        | `/container/storage-classes`                             | `{clusterName} > Storage classes`                                    |
| CON060302   | Create Storage Class (Form)       | create-form | `/container/storage-classes/create`                      | `{clusterName} > Storage classes > Create storage class`             |
| CON060303   | Create Storage Class (YAML)       | create-yaml | `/container/storage-classes/create-yaml`                 | `{clusterName} > Storage classes > Create storage class`             |
| CON060304   | Storage Class Detail              | detail      | `/container/storage-classes/:storageClassId`             | `{clusterName} > Storage classes > {storageClassName}`               |
| CON06030401 | Storage Class Detail — Parameters | detail-tab  | `/container/storage-classes/:storageClassId`             | `{clusterName} > Storage classes > {storageClassName}`               |
| CON06030402 | Storage Class Detail — Customize  | detail-tab  | `/container/storage-classes/:storageClassId`             | `{clusterName} > Storage classes > {storageClassName}`               |
| CON060305   | Edit Storage Class (Config)       | edit-config | `/container/storage-classes/:storageClassName/edit`      | `{clusterName} > Storage classes > {storageClassName} > Edit config` |
| CON060306   | Edit Storage Class (YAML)         | edit-yaml   | `/container/storage-classes/:storageClassName/edit-yaml` | `{clusterName} > Storage classes > {storageClassName} > Edit YAML`   |

### 06-04. ConfigMaps

| Screen ID   | Screen Name             | Page Type   | Route Path                                       | Breadcrumb                                                   |
| ----------- | ----------------------- | ----------- | ------------------------------------------------ | ------------------------------------------------------------ |
| CON060401   | ConfigMaps              | list        | `/container/configmaps`                          | `{clusterName} > ConfigMaps`                                 |
| CON060402   | Create ConfigMap (Form) | create-form | `/container/configmaps/create`                   | `{clusterName} > ConfigMaps > Create ConfigMap`              |
| CON060403   | Create ConfigMap (YAML) | create-yaml | `/container/configmaps/create-yaml`              | `{clusterName} > ConfigMaps > Create ConfigMap`              |
| CON060404   | ConfigMap Detail        | detail      | `/container/configmaps/:configMapId`             | `{clusterName} > ConfigMaps > {configMapName}`               |
| CON06040401 | ConfigMap Detail — Data | detail-tab  | `/container/configmaps/:configMapId`             | `{clusterName} > ConfigMaps > {configMapName}`               |
| CON060405   | Edit ConfigMap (Config) | edit-config | `/container/configmaps/:configMapName/edit`      | `{clusterName} > ConfigMaps > {configMapName} > Edit config` |
| CON060406   | Edit ConfigMap (YAML)   | edit-yaml   | `/container/configmaps/:configMapName/edit-yaml` | `{clusterName} > ConfigMaps > {configMapName} > Edit YAML`   |

### 06-05. Secrets

| Screen ID   | Screen Name          | Page Type   | Route Path                                 | Breadcrumb                                             |
| ----------- | -------------------- | ----------- | ------------------------------------------ | ------------------------------------------------------ |
| CON060501   | Secrets              | list        | `/container/secrets`                       | `{clusterName} > Secrets`                              |
| CON060502   | Create Secret (Form) | create-form | `/container/secrets/create`                | `{clusterName} > Secrets > Create secret`              |
| CON060503   | Create Secret (YAML) | create-yaml | `/container/secrets/create-yaml`           | `{clusterName} > Secrets > Create secret`              |
| CON060504   | Secret Detail        | detail      | `/container/secrets/:secretId`             | `{clusterName} > Secrets > {secretName}`               |
| CON06050401 | Secret Detail — Data | detail-tab  | `/container/secrets/:secretId`             | `{clusterName} > Secrets > {secretName}`               |
| CON060505   | Edit Secret (Config) | edit-config | `/container/secrets/:secretName/edit`      | `{clusterName} > Secrets > {secretName} > Edit config` |
| CON060506   | Edit Secret (YAML)   | edit-yaml   | `/container/secrets/:secretName/edit-yaml` | `{clusterName} > Secrets > {secretName} > Edit YAML`   |

---

## 07. Policy

### 07-01. Limit Ranges

| Screen ID | Screen Name               | Page Type   | Route Path                                          | Breadcrumb                                                      |
| --------- | ------------------------- | ----------- | --------------------------------------------------- | --------------------------------------------------------------- |
| CON070101 | Limit ranges              | list        | `/container/limit-ranges`                           | `{clusterName} > Limit ranges`                                  |
| CON070102 | Create Limit Range (Form) | create-form | `/container/limit-ranges/create`                    | `{clusterName} > Limit ranges > Create limit range`             |
| CON070103 | Create Limit Range (YAML) | create-yaml | `/container/limit-ranges/create-yaml`               | `{clusterName} > Limit ranges > Create limit range`             |
| CON070105 | Edit Limit Range (Config) | edit-config | `/container/limit-ranges/:limitRangeName/edit`      | `{clusterName} > Limit ranges > {limitRangeName} > Edit config` |
| CON070106 | Edit Limit Range (YAML)   | edit-yaml   | `/container/limit-ranges/:limitRangeName/edit-yaml` | `{clusterName} > Limit ranges > {limitRangeName} > Edit YAML`   |

> **참고**: Limit Range에는 별도 Detail 페이지가 없습니다 (App.tsx 기준).

### 07-02. Resource Quotas

| Screen ID | Screen Name                  | Page Type   | Route Path                                                | Breadcrumb                                                            |
| --------- | ---------------------------- | ----------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| CON070201 | Resource quotas              | list        | `/container/resource-quotas`                              | `{clusterName} > Resource quotas`                                     |
| CON070202 | Create Resource Quota (Form) | create-form | `/container/resource-quotas/create`                       | `{clusterName} > Resource quotas > Create resource quota`             |
| CON070203 | Create Resource Quota (YAML) | create-yaml | `/container/resource-quotas/create-yaml`                  | `{clusterName} > Resource quotas > Create resource quota`             |
| CON070205 | Edit Resource Quota (Config) | edit-config | `/container/resource-quotas/:resourceQuotaName/edit`      | `{clusterName} > Resource quotas > {resourceQuotaName} > Edit config` |
| CON070206 | Edit Resource Quota (YAML)   | edit-yaml   | `/container/resource-quotas/:resourceQuotaName/edit-yaml` | `{clusterName} > Resource quotas > {resourceQuotaName} > Edit YAML`   |

> **참고**: Resource Quota에는 별도 Detail 페이지가 없습니다 (App.tsx 기준).

### 07-03. Network Policies

| Screen ID   | Screen Name                                  | Page Type   | Route Path                                                 | Breadcrumb                                                             |
| ----------- | -------------------------------------------- | ----------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| CON070301   | Network policies                             | list        | `/container/network-policies`                              | `{clusterName} > Network policies`                                     |
| CON070302   | Create Network Policy (Form)                 | create-form | `/container/network-policies/create`                       | `{clusterName} > Network policies > Create network policy`             |
| CON070303   | Create Network Policy (YAML)                 | create-yaml | `/container/network-policies/create-yaml`                  | `{clusterName} > Network policies > Create network policy`             |
| CON070304   | Network Policy Detail                        | detail      | `/container/network-policies/:networkPolicyId`             | `{clusterName} > Network policies > {networkPolicyName}`               |
| CON07030401 | Network Policy Detail — Ingress rules        | detail-tab  | `/container/network-policies/:networkPolicyId`             | `{clusterName} > Network policies > {networkPolicyName}`               |
| CON07030402 | Network Policy Detail — Egress rules         | detail-tab  | `/container/network-policies/:networkPolicyId`             | `{clusterName} > Network policies > {networkPolicyName}`               |
| CON07030403 | Network Policy Detail — Selectors            | detail-tab  | `/container/network-policies/:networkPolicyId`             | `{clusterName} > Network policies > {networkPolicyName}`               |
| CON07030404 | Network Policy Detail — Labels & annotations | detail-tab  | `/container/network-policies/:networkPolicyId`             | `{clusterName} > Network policies > {networkPolicyName}`               |
| CON070305   | Edit Network Policy (Config)                 | edit-config | `/container/network-policies/:networkPolicyName/edit`      | `{clusterName} > Network policies > {networkPolicyName} > Edit config` |
| CON070306   | Edit Network Policy (YAML)                   | edit-yaml   | `/container/network-policies/:networkPolicyName/edit-yaml` | `{clusterName} > Network policies > {networkPolicyName} > Edit YAML`   |

### 07-04. Pod Disruption Budgets (PDB)

| Screen ID   | Screen Name                       | Page Type   | Route Path                          | Breadcrumb                                                         |
| ----------- | --------------------------------- | ----------- | ----------------------------------- | ------------------------------------------------------------------ |
| CON070401   | Pod disruption budgets            | list        | `/container/pdb`                    | `{clusterName} > Pod disruption budgets`                           |
| CON070402   | Create PDB (Form)                 | create-form | `/container/pdb/create`             | `{clusterName} > Pod disruption budgets > Create PDB`              |
| CON070403   | Create PDB (YAML)                 | create-yaml | `/container/pdb/create-yaml`        | `{clusterName} > Pod disruption budgets > Create PDB`              |
| CON070404   | PDB Detail                        | detail      | `/container/pdb/:pdbId`             | `{clusterName} > Pod disruption budgets > {pdbName}`               |
| CON07040401 | PDB Detail — Budget               | detail-tab  | `/container/pdb/:pdbId`             | `{clusterName} > Pod disruption budgets > {pdbName}`               |
| CON07040402 | PDB Detail — Selector             | detail-tab  | `/container/pdb/:pdbId`             | `{clusterName} > Pod disruption budgets > {pdbName}`               |
| CON07040403 | PDB Detail — Conditions           | detail-tab  | `/container/pdb/:pdbId`             | `{clusterName} > Pod disruption budgets > {pdbName}`               |
| CON07040404 | PDB Detail — Labels & annotations | detail-tab  | `/container/pdb/:pdbId`             | `{clusterName} > Pod disruption budgets > {pdbName}`               |
| CON07040405 | PDB Detail — Recent events        | detail-tab  | `/container/pdb/:pdbId`             | `{clusterName} > Pod disruption budgets > {pdbName}`               |
| CON070405   | Edit PDB (Config)                 | edit-config | `/container/pdb/:pdbName/edit`      | `{clusterName} > Pod disruption budgets > {pdbName} > Edit config` |
| CON070406   | Edit PDB (YAML)                   | edit-yaml   | `/container/pdb/:pdbName/edit-yaml` | `{clusterName} > Pod disruption budgets > {pdbName} > Edit YAML`   |

---

## 08. App Catalog

### 08-01. Catalog

| Screen ID | Screen Name        | Page Type   | Route Path                                   | Breadcrumb                                           |
| --------- | ------------------ | ----------- | -------------------------------------------- | ---------------------------------------------------- |
| CON080101 | Catalog            | list        | `/container/apps/catalog`                    | `{clusterName} > Apps > Catalog`                     |
| CON080102 | Install App (Form) | create-form | `/container/apps/catalog/:chartName/install` | `{clusterName} > Apps > Catalog > Install {appName}` |

> **참고**: AppInstallPage는 Cluster & Namespace / Version / Configuration 3단계 Wizard 구조입니다. "Create YAML" 경로는 존재하지 않습니다.

### 08-02. Installed Apps

| Screen ID   | Screen Name                        | Page Type   | Route Path                                   | Breadcrumb                                                           |
| ----------- | ---------------------------------- | ----------- | -------------------------------------------- | -------------------------------------------------------------------- |
| CON080201   | Installed Apps                     | list        | `/container/apps/installed-apps`             | `{clusterName} > Apps > Installed Apps`                              |
| CON080204   | Installed App Detail               | detail      | `/container/apps/installed-apps/:appId`      | `{clusterName} > Apps > Installed Apps > {appName}`                  |
| CON08020401 | Installed App Detail — Resources   | detail-tab  | `/container/apps/installed-apps/:appId`      | `{clusterName} > Apps > Installed Apps > {appName}`                  |
| CON08020402 | Installed App Detail — Values.yaml | detail-tab  | `/container/apps/installed-apps/:appId`      | `{clusterName} > Apps > Installed Apps > {appName}`                  |
| CON080205   | Edit / Upgrade App (Form)          | edit-config | `/container/apps/installed-apps/:appId/edit` | `{clusterName} > Apps > Installed Apps > {appName} > Edit / Upgrade` |

> **참고**: AppEditPage는 Version / Configuration 2단계 Wizard 구조입니다. Installed Apps에는 "Create Form", "Create YAML", "Edit YAML" 경로가 없습니다.

---

## 전체 페이지 수 요약

| 섹션                  | List   | Create Form | Create YAML | Detail | Detail-Tab | Edit Config | Edit YAML | 소계    |
| --------------------- | ------ | ----------- | ----------- | ------ | ---------- | ----------- | --------- | ------- |
| 01 Global             | 1      | —           | —           | 1      | —          | —           | —         | 2       |
| 02 Cluster Management | 1      | 1           | 1           | 1      | 2          | —           | —         | 6       |
| 03 Cluster            | 3      | 2           | 2           | 3      | 9          | 1           | 2         | 22      |
| 04 Workloads          | 6      | 6           | 6           | 6      | 22         | 6           | 6         | 58      |
| 05 Service Discovery  | 3      | 3           | 3           | 3      | 12         | 3           | 3         | 30      |
| 06 Storage            | 5      | 5           | 5           | 5      | 17         | 5           | 5         | 47      |
| 07 Policy             | 4      | 4           | 4           | 2      | 13         | 4           | 4         | 35      |
| 08 App Catalog        | 2      | 1           | —           | 1      | 2          | 1           | —         | 7       |
| **합계**              | **25** | **22**      | **21**      | **22** | **77**     | **20**      | **20**    | **207** |

---

## Page Type 정의

| Page Type     | 설명                                                 |
| ------------- | ---------------------------------------------------- |
| `home`        | 서비스 진입 홈 화면                                  |
| `dashboard`   | 클러스터 대시보드                                    |
| `list`        | 리소스 목록 화면 (Table + FilterSearch + Pagination) |
| `create-form` | 폼 기반 리소스 생성 화면 (Wizard 패턴)               |
| `create-yaml` | YAML 에디터 기반 리소스 생성 화면                    |
| `detail`      | 리소스 상세 화면 (DetailHeader + Tabs)               |
| `detail-tab`  | Detail 페이지 내 탭 뷰                               |
| `edit-config` | 설정 편집 화면 (Node Config 전용)                    |
| `edit-yaml`   | YAML 에디터 기반 리소스 편집 화면                    |
| `console`     | 터미널 콘솔 화면                                     |

---

## 라우트 파라미터 규칙

| 파라미터                                  | 타입   | 예시                                            |
| ----------------------------------------- | ------ | ----------------------------------------------- |
| `:clusterId`                              | UUID   | `cluster-1a2b3c`                                |
| `:namespaceName`                          | 문자열 | `production`                                    |
| `:nodeName`                               | 문자열 | `worker-01`                                     |
| `:deploymentId` / `:deploymentName`       | 문자열 | `nginx-deployment`                              |
| `:statefulsetId` / `:statefulSetName`     | 문자열 | `mysql-statefulset`                             |
| `:daemonsetId` / `:daemonSetName`         | 문자열 | `fluentd-daemonset`                             |
| `:jobId` / `:jobName`                     | 문자열 | `batch-job-1`                                   |
| `:cronjobId` / `:cronJobName`             | 문자열 | `daily-backup`                                  |
| `:podId` / `:podName`                     | 문자열 | `nginx-abc12`                                   |
| `:serviceId`                              | 문자열 | `nginx-service`                                 |
| `:ingressId`                              | 문자열 | `api-ingress`                                   |
| `:hpaId`                                  | 문자열 | `nginx-hpa`                                     |
| `:pvId` / `:pvName`                       | 문자열 | `pv-nfs-001`                                    |
| `:pvcId` / `:pvcName`                     | 문자열 | `pvc-mysql`                                     |
| `:storageClassId` / `:storageClassName`   | 문자열 | `standard`                                      |
| `:configMapId` / `:configMapName`         | 문자열 | `app-config`                                    |
| `:secretId` / `:secretName`               | 문자열 | `db-secret`                                     |
| `:limitRangeName`                         | 문자열 | `mem-limit`                                     |
| `:resourceQuotaName`                      | 문자열 | `compute-quota`                                 |
| `:networkPolicyId` / `:networkPolicyName` | 문자열 | `allow-internal`                                |
| `:pdbId` / `:pdbName`                     | 문자열 | `nginx-pdb`                                     |
| `:instanceId`                             | 문자열 | 콘솔 접속 대상 인스턴스 ID                      |
| `:chartName`                              | 문자열 | `postgresql`, `nginx` (App Catalog 차트 식별자) |
| `:appId`                                  | 문자열 | `app-abc12` (설치된 앱 인스턴스 ID)             |
