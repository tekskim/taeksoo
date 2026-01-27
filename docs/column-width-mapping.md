# 테이블 컬럼 너비 매핑표

SSOT 프로토타입의 모든 테이블과 `columnWidths` 프리셋 매핑 현황

> **범례**
> - ✅ 프리셋 직접 사용 (`columnWidths.xxx`)
> - ⚠️ 하드코딩 또는 flex 사용 (프리셋으로 변환 필요)
> - 📄 리스트 페이지 | 📋 상세 탭 테이블 | 🧙 위자드 테이블

---

## 1. Compute

### 📄 InstanceListPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: 140px | `name` | 180px | ⚠️ |
| locked | columnWidths.locked | `locked` | 68px | ✅ |
| fixedIp | flex: 1, minWidth: 100px | `fixedIp` | 130px | ⚠️ |
| floatingIp | flex: 1, minWidth: 100px | `floatingIp` | 130px | ⚠️ |
| image | flex: 1 | `image` | 110px | ⚠️ |
| flavor | flex: 1 | `flavor` | 90px | ⚠️ |
| vcpu | 64px | `vcpu` | 80px | ⚠️ |
| ram | 64px | `ram` | 80px | ⚠️ |
| disk | 64px | `disk` | 80px | ⚠️ |
| gpu | 56px | `gpu` | 64px | ⚠️ |
| az | 56px | `az` | 80px | ⚠️ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📋 InstanceDetailPage - Volumes Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1 (default) | `name` | 180px | ⚠️ |
| size | flex: 1 | `size` | 100px | ⚠️ |
| type | flex: 1 | `type` | 80px | ⚠️ |
| diskTag | flex: 1 | `diskTag` | 100px | ⚠️ |
| bootable | flex: 1 | `bootable` | 80px | ⚠️ |
| access | flex: 1 | `access` | 80px | ⚠️ |
| action | columnWidths.action | `action` | 64px | ✅ |

### 📋 InstanceDetailPage - Interfaces Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1 | `name` | 180px | ⚠️ |
| network | flex: 1 | `network` | 140px | ⚠️ |
| fixedIp | flex: 1 | `fixedIp` | 130px | ⚠️ |
| macAddress | flex: 1 | `macAddress` | 150px | ⚠️ |
| createdAt | flex: 1 | `createdAt` | 140px | ⚠️ |
| action | columnWidths.action | `action` | 64px | ✅ |

### 📋 InstanceDetailPage - Floating IPs Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| floatingIp | flex: 1 | `floatingIp` | 130px | ⚠️ |
| fixedIp | flex: 1 | `fixedIp` | 130px | ⚠️ |
| createdAt | flex: 1 | `createdAt` | 140px | ⚠️ |
| action | columnWidths.action | `action` | 64px | ✅ |

### 📋 InstanceDetailPage - Security Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| name | flex: 1 | `name` | 180px | ⚠️ |
| description | flex: 1 | `description` | 200px | ⚠️ |
| createdAt | flex: 1 | `createdAt` | 140px | ⚠️ |
| action | columnWidths.action | `action` | 64px | ✅ |

### 📋 InstanceDetailPage - Snapshots Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1 | `name` | 180px | ⚠️ |
| size | flex: 1 | `size` | 100px | ⚠️ |
| diskFormat | flex: 1 | `diskFormat` | 100px | ⚠️ |
| createdAt | flex: 1 | `createdAt` | 140px | ⚠️ |
| action | columnWidths.action | `action` | 64px | ✅ |

### 🧙 CreateInstancePage - Template Selection Table
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| select | columnWidths.select | `select` | 40px | ✅ |
| favorite | columnWidths.favorite | `favorite` | 40px | ✅ |
| name | flex: 1 | `name` | 180px | ⚠️ |

### 📄 FlavorsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| name | flex: 1 | `name` | 180px | ⚠️ |
| category | flex: 1 | `category` | 140px | ⚠️ |
| vcpu | columnWidths.vcpu | `vcpu` | 80px | ✅ |
| ram | columnWidths.ram | `ram` | 80px | ✅ |
| ephemeralDisk | columnWidths.ephemeralDisk | `ephemeralDisk` | 100px | ✅ |
| internalNetworkBandwidth | flex: 1 | `internalNetworkBandwidth` | 180px | ⚠️ |
| gpuType | flex: 1 | `gpuType` | 120px | ⚠️ |
| numaNodes | flex: 1 | `numaNodes` | 100px | ⚠️ |
| cpuPolicy | flex: 1 | `cpuPolicy` | 120px | ⚠️ |
| cpuThreadPolicy | flex: 1 | `cpuThreadPolicy` | 140px | ⚠️ |
| access | columnWidths.access | `access` | 80px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📋 FlavorDetailPage - Instances Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1 | `name` | 180px | ⚠️ |
| locked | columnWidths.locked | `locked` | 68px | ✅ |
| image | flex: 1 | `image` | 110px | ⚠️ |
| fixedIP | flex: 1 | `fixedIp` | 130px | ⚠️ |
| az | flex: 1 | `az` | 80px | ⚠️ |
| createdAt | flex: 1 | `createdAt` | 140px | ⚠️ |
| action | columnWidths.action | `action` | 64px | ✅ |

### 📄 HostsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| hostname | flex: 2 | `hostname` | 150px | ⚠️ |
| labels | flex: 1 | `labels` | 300px | ⚠️ |
| model | flex: 1.5 | `model` | 120px | ⚠️ |
| cpus | minWidth: 65px | `cpus` | 80px | ⚠️ |
| cores | minWidth: 65px | `cores` | 80px | ⚠️ |
| totalMemory | minWidth: 100px | `totalMemory` | 120px | ⚠️ |
| rawCapacity | minWidth: 100px | `rawCapacity` | 120px | ⚠️ |
| hdds | minWidth: 60px | `hdds` | 80px | ⚠️ |
| flash | minWidth: 60px | `flash` | 80px | ⚠️ |
| nics | minWidth: 60px | `nics` | 80px | ⚠️ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📋 HostDetailPage - Devices Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| deviceId | flex: 1 | `deviceId` | 100px | ⚠️ |
| deviceName | flex: 1 | `deviceName` | 150px | ⚠️ |
| daemons | flex: 1 | `daemons` | 100px | ⚠️ |

### 📋 HostDetailPage - Physical Disks Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| devicePath | flex: 1 | `devicePath` | 150px | ⚠️ |
| type | flex: 1 | `type` | 80px | ⚠️ |
| available | flex: 1 | `available` | 80px | ⚠️ |
| vendor | flex: 1 | `vendor` | 120px | ⚠️ |
| model | flex: 1 | `model` | 120px | ⚠️ |
| size | flex: 1 | `size` | 100px | ⚠️ |
| osd | flex: 1 | `osd` | 80px | ⚠️ |
| identify | columnWidths.identify | `identify` | 80px | ✅ |

### 📋 HostDetailPage - Daemon Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| daemonName | flex: 1.5 | `daemonName` | 150px | ⚠️ |
| version | flex: 1 | `version` | 100px | ⚠️ |
| lastRefreshed | flex: 1 | `lastRefreshed` | 140px | ⚠️ |
| cpuUsage | flex: 1 | `cpuUsage` | 100px | ⚠️ |
| memoryUsage | flex: 1 | `memoryUsage` | 100px | ⚠️ |
| daemonEvents | flex: 1.5 | `daemonEvents` | 100px | ⚠️ |

### 📄 InstanceTemplatesPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| favorite | columnWidths.favorite | `favorite` | 40px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| image (Description) | columnWidths.description | `description` | 200px | ✅ |
| flavor (Created at) | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 InstanceSnapshotsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1 | `name` | 180px | ⚠️ |
| size | flex: 1 | `size` | 100px | ⚠️ |
| diskFormat | flex: 1 | `diskFormat` | 100px | ⚠️ |
| sourceInstance | flex: 1 | `sourceInstance` | 140px | ⚠️ |
| createdAt | columnWidths.createdAt | `createdAt` | 140px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

---

## 2. Storage

### 📄 VolumesPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| size | columnWidths.size | `size` | 100px | ✅ |
| type | columnWidths.type | `type` | 80px | ✅ |
| diskTag | columnWidths.diskTag | `diskTag` | 100px | ✅ |
| attachedTo | flex: 1, minWidth: columnWidths.attachedTo | `attachedTo` | 160px | ✅ (확장 컬럼) |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📋 VolumeDetailPage - Snapshots Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | columnWidths.name | `name` | 180px | ✅ |
| size | columnWidths.size | `size` | 100px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 140px | ✅ |
| action | columnWidths.action | `action` | 64px | ✅ |

### 📋 VolumeDetailPage - Backups Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | columnWidths.name | `name` | 180px | ✅ |
| backupMode | columnWidths.backupMode | `backupMode` | 100px | ✅ |
| size | columnWidths.size | `size` | 100px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 140px | ✅ |
| action | columnWidths.action | `action` | 64px | ✅ |

### 📄 VolumeSnapshotsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | columnWidths.name | `name` | 180px | ✅ |
| size | columnWidths.size | `size` | 100px | ✅ |
| sourceVolume | columnWidths.sourceVolume | `sourceVolume` | 150px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 140px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 VolumeBackupsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | columnWidths.name | `name` | 180px | ✅ |
| size | columnWidths.size | `size` | 100px | ✅ |
| sourceVolume | columnWidths.sourceVolume | `sourceVolume` | 150px | ✅ |
| backupMode | columnWidths.backupMode | `backupMode` | 100px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 140px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 BucketsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| name | flex: 1, minWidth: columnWidths.nameWide | `nameWide` | 220px | ✅ (확장 컬럼) |
| owner | columnWidths.owner | `owner` | 160px | ✅ |
| usedCapacity | columnWidths.usedCapacity | `usedCapacity` | 120px | ✅ |
| capacityLimit | columnWidths.capacityLimit | `capacityLimit` | 120px | ✅ |
| objects | columnWidths.objects | `objects` | 80px | ✅ |
| objectLimit | columnWidths.objectLimit | `objectLimit` | 100px | ✅ |
| creationDate | columnWidths.creationDate | `creationDate` | 140px | ✅ |
| action | columnWidths.actionWide | `actionWide` | 72px | ✅ |

### 📄 StorageClassesPage (Container)
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | columnWidths.name | `name` | 180px | ✅ |
| isDefault | columnWidths.default | `default` | 100px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 140px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

---

## 3. Container (Kubernetes)

### 📄 PodsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| namespace | columnWidths.namespace | `namespace` | 120px | ✅ |
| image | columnWidths.image | `image` | 110px | ✅ |
| ready | columnWidths.ready | `ready` | 80px | ✅ |
| restarts | columnWidths.restarts | `restarts` | 80px | ✅ |
| ip | columnWidths.ip | `ip` | 130px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 DeploymentsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| namespace | columnWidths.namespace | `namespace` | 120px | ✅ |
| image | columnWidths.image | `image` | 110px | ✅ |
| ready | columnWidths.ready | `ready` | 80px | ✅ |
| upToDate | columnWidths.upToDate | `upToDate` | 80px | ✅ |
| available | columnWidths.available | `available` | 80px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 StatefulSetsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| namespace | columnWidths.namespace | `namespace` | 120px | ✅ |
| image | columnWidths.image | `image` | 110px | ✅ |
| ready | columnWidths.ready | `ready` | 80px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 DaemonSetsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| namespace | columnWidths.namespace | `namespace` | 120px | ✅ |
| image | columnWidths.image | `image` | 110px | ✅ |
| ready | columnWidths.ready | `ready` | 80px | ✅ |
| current | columnWidths.current | `current` | 80px | ✅ |
| desired | columnWidths.desired | `desired` | 80px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 CronJobsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| namespace | columnWidths.namespace | `namespace` | 120px | ✅ |
| image | columnWidths.image | `image` | 110px | ✅ |
| schedule | columnWidths.schedule | `schedule` | 120px | ✅ |
| lastSchedule | columnWidths.lastSchedule | `lastSchedule` | 120px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 ContainerServicesPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| namespace | columnWidths.namespace | `namespace` | 120px | ✅ |
| target | columnWidths.target | `target` | 300px | ✅ |
| selector | columnWidths.selector | `selector` | 200px | ✅ |
| type | columnWidths.type | `type` | 80px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 ContainerNodesPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| roles | columnWidths.roles | `roles` | 100px | ✅ |
| version | columnWidths.version | `version` | 100px | ✅ |
| ip | columnWidths.ipAddress | `ipAddress` | 130px | ✅ |
| os | columnWidths.os | `os` | 120px | ✅ |
| cpuUsage | columnWidths.cpuUsage | `cpuUsage` | 100px | ✅ |
| ramUsage | columnWidths.ramUsage | `ramUsage` | 100px | ✅ |
| podsUsage | columnWidths.podsUsage | `podsUsage` | 100px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 ContainerEventsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| namespace | columnWidths.namespace | `namespace` | 120px | ✅ |
| lastSeen | columnWidths.lastSeen | `lastSeen` | 100px | ✅ |
| type | columnWidths.type | `type` | 80px | ✅ |
| reason | columnWidths.reason | `reason` | 120px | ✅ |
| object | columnWidths.object | `object` | 120px | ✅ |
| subobject | columnWidths.subobject | `subobject` | 100px | ✅ |
| source | columnWidths.source | `source` | 100px | ✅ |
| message | columnWidths.message | `message` | 240px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

### 📄 PersistentVolumeClaimsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| name | flex: 1, minWidth: 120px | `name` | 180px | ⚠️ |
| namespace | flex: 1, minWidth: 80px | `namespace` | 120px | ⚠️ |
| volume | flex: 1.5 | `volume` | 150px | ⚠️ |
| capacity | columnWidths.capacity | `capacity` | 100px | ✅ |
| accessModes | columnWidths.accessModes | `accessModes` | 120px | ✅ |
| storageClass | flex: 1, minWidth: 100px | `storageClass` | 120px | ⚠️ |
| volumeAttributesClass | flex: 1, minWidth: 120px | `volumeAttributesClass` | 160px | ⚠️ |
| createdAt | columnWidths.createdAt | `createdAt` | 140px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

---

## 4. IAM

### 📄 IAMUsersPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| username | flex: 1, minWidth: columnWidths.username | `username` | 150px | ✅ (확장 컬럼) |
| userGroups | columnWidths.userGroups | `userGroups` | 150px | ✅ |
| roles | columnWidths.roles | `roles` | 100px | ✅ |
| lastSignIn | columnWidths.lastSignIn | `lastSignIn` | 120px | ✅ |
| mfa | columnWidths.mfa | `mfa` | 80px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actionWide | `actionWide` | 72px | ✅ |

### 📋 IAMUserDetailPage - User Groups Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| name | flex: 1 | `name` | 180px | ⚠️ |
| users | flex: 1 | `users` | 100px | ⚠️ |
| attachedRoles | flex: 1 | `attachedRoles` | 150px | ⚠️ |
| description | flex: 1 | `description` | 200px | ⚠️ |
| actions | columnWidths.actionWide | `actionWide` | 72px | ✅ |

### 📋 IAMUserDetailPage - Roles Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| name | flex: 1 | `name` | 180px | ⚠️ |
| source | flex: 1 | - | - | ⚠️ |
| type | flex: 1 | `type` | 80px | ⚠️ |
| policies | flex: 1 | `policies` | 150px | ⚠️ |
| createdAt | flex: 1 | `createdAt` | 140px | ⚠️ |
| actions | columnWidths.actionWide | `actionWide` | 72px | ✅ |

### 📋 IAMUserDetailPage - Sessions Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| started | flex: 1 | `started` | 140px | ⚠️ |
| lastAccess | flex: 1 | `lastAccess` | 140px | ⚠️ |
| ipAddress | flex: 1 | `ipAddress` | 130px | ⚠️ |
| device | flex: 1 | `device` | 120px | ⚠️ |
| actions | columnWidths.actionWide | `actionWide` | 72px | ✅ |

### 📋 IAMUserDetailPage - Access Keys Tab
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| status | columnWidths.status | `status` | 64px | ✅ |
| keyId | flex: 1 | `keyId` | 150px | ⚠️ |
| description | flex: 1 | `description` | 200px | ⚠️ |
| lastUsed | flex: 1 | `lastUsed` | 140px | ⚠️ |
| createdAt | flex: 1 | `createdAt` | 140px | ⚠️ |
| actions | columnWidths.actionWide | `actionWide` | 72px | ✅ |

### 📄 IAMUserGroupsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| type | columnWidths.typeLg | `typeLg` | 100px | ✅ |
| roles | columnWidths.roles | `roles` | 100px | ✅ |
| userCount | columnWidths.userCount | `userCount` | 80px | ✅ |
| description | columnWidths.description | `description` | 200px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actionWide | `actionWide` | 72px | ✅ |

### 📄 IAMRolesPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| name | flex: 1, minWidth: columnWidths.name | `name` | 180px | ✅ (확장 컬럼) |
| type | columnWidths.typeLg | `typeLg` | 100px | ✅ |
| policies | columnWidths.policies | `policies` | 150px | ✅ |
| description | columnWidths.description | `description` | 200px | ✅ |
| scope | columnWidths.scope | `scope` | 100px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actionWide | `actionWide` | 72px | ✅ |

### 📄 IAMPoliciesPage (Custom Table)
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| (checkbox) | w-[40px] | `checkbox` | 40px | ⚠️ |
| name | flex: 1 | `name` | 180px | ⚠️ |
| type | flex: 1 | `type` | 80px | ⚠️ |
| apps | flex: 1 | `apps` | 100px | ⚠️ |
| roles | flex: 1 | `roles` | 100px | ⚠️ |
| description | flex: 1 | `description` | 200px | ⚠️ |
| editedAt | flex: 1 | `editedAt` | 140px | ⚠️ |
| action | w-[72px] | `actionWide` | 72px | ⚠️ |

### 📄 IAMActiveSessionsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| user | flex: 1, minWidth: columnWidths.user | `user` | 150px | ✅ (확장 컬럼) |
| started | columnWidths.started | `started` | 140px | ✅ |
| lastAccess | columnWidths.lastAccess | `lastAccess` | 140px | ✅ |
| ipAddress | columnWidths.ipAddress | `ipAddress` | 130px | ✅ |
| device | columnWidths.device | `device` | 120px | ✅ |
| actions | columnWidths.actionWide | `actionWide` | 72px | ✅ |

---

## 5. Cloud Builder

### 📄 CloudBuilderConsolePage (Dynamic Columns)
| 컬럼 키 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|------|
| serial | `serial` | 120px | ✅ |
| macPrimary | `macPrimary` | 150px | ✅ |
| location | `location` | 100px | ✅ |
| mgmtIp | `mgmtIp` | 130px | ✅ |
| availabilityZone | `availabilityZone` | 80px | ✅ |
| model | `model` | 120px | ✅ |
| region | `region` | 100px | ✅ |
| service | `service` | 120px | ✅ |
| pcpuUsage | `pcpuUsage` | 100px | ✅ |
| ramTotal | `ramTotal` | 100px | ✅ |
| storageTotal | `storageTotal` | 120px | ✅ |
| vcpusTotal | `vcpusTotal` | 100px | ✅ |
| gpuUsage | `gpuUsage` | 100px | ✅ |
| storageCapacityGiB | `storageCapacityGiB` | 140px | ✅ |
| actions | `actions` | 64px | ✅ |

---

## 6. Network

### 📄 SecurityGroupsPage
| 컬럼 키 | 현재 설정 | 프리셋 키 | 프리셋 값 | 상태 |
|---------|-----------|-----------|-----------|------|
| name | flex: 1 | - | - | ✅ (확장 컬럼) |
| description | flex: 1 | - | - | ✅ (확장 컬럼) |
| ingressRules | columnWidths.ingressRules | `ingressRules` | 100px | ✅ |
| egressRules | columnWidths.egressRules | `egressRules` | 100px | ✅ |
| createdAt | columnWidths.createdAt | `createdAt` | 130px | ✅ |
| actions | columnWidths.actions | `actions` | 64px | ✅ |

---

## 요약 통계

### 프리셋 사용 현황

| 영역 | 전체 컬럼 | 프리셋 사용 (✅) | 변환 필요 (⚠️) |
|------|----------|-----------------|----------------|
| Compute | ~85 | ~25 | ~60 |
| Storage | ~45 | ~42 | ~3 |
| Container | ~75 | ~72 | ~3 |
| IAM | ~50 | ~42 | ~8 |
| Cloud Builder | ~15 | ~15 | 0 |
| **합계** | **~270** | **~196 (73%)** | **~74 (27%)** |

### 키 별칭

| 현재 사용 | 프리셋 키 | 프리셋 값 |
|-----------|-----------|-----------|
| `action` | `actions` | 64px |
| `fixedIP` | `fixedIp` | 130px |
| `creationDate` | `createdAt` | 140px |
| `macPrimary` | `macAddress` | 150px |
| `mgmtIp` | `ip` | 130px |
| `availabilityZone` | `az` | 80px |
| `vCPU` | `vcpu` | 80px |

---

## 관련 문서

- [컬럼 너비 가이드](./column-width-guide.md) - 프리셋 사용법
- [행 높이 가이드](./table-row-height-guide.md) - 행 높이/텍스트 처리
- [컬럼 정렬 가이드](./table-column-align-guide.md) - 정렬 설정
- [columnWidths.ts](/src/design-system/presets/columnWidths.ts) - 프리셋 소스
