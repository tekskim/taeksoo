# 테이블 컬럼 너비 매핑표

SSOT 프로토타입의 모든 테이블과 컬럼 너비 프리셋 매핑 현황

> **마지막 업데이트**: 2026-01-27  
> **총 테이블 페이지**: 86개+

---

## 컬럼 너비 정책 (리팩토링됨)

### 핵심 원칙

1. **완전 고정 컬럼** (`fixedColumns`): 아이콘/버튼만 표시, 크기 불변
2. **유연 컬럼** (`columnMinWidths`): `flex: 1 + minWidth` 조합으로 공간 유연하게 채움

### 완전 고정 컬럼 목록

| 컬럼 | 너비 | 용도 |
|------|------|------|
| status | 64px | 상태 아이콘 |
| select/checkbox | 40px | 체크박스 |
| radio | 40px | 라디오 버튼 |
| favorite | 40px | 즐겨찾기 아이콘 |
| locked | 68px | 잠금 아이콘 |
| actions | 64px | 액션 메뉴 |
| mfa | 80px | MFA 아이콘 |

### 사용 패턴

```typescript
import { fixedColumns, columnMinWidths } from '@/design-system';

columns={[
  { key: 'status', width: fixedColumns.status },             // 완전 고정
  { key: 'name', flex: 1, minWidth: columnMinWidths.name },  // 유연
  { key: 'type', flex: 1, minWidth: columnMinWidths.type },  // 유연
  { key: 'actions', width: fixedColumns.actions },           // 완전 고정
]}
```

### 장점

- **컬럼 숨김 시 여백 문제 해결**: 남은 flex 컬럼들이 공간을 자동으로 채움
- **최소 가독성 보장**: minWidth로 컬럼이 너무 좁아지는 것 방지
- **일관성**: 고정 컬럼(status, actions)은 항상 일정한 크기 유지

---

## 상태 범례

| 아이콘 | 상태 | 설명 |
|:------:|------|------|
| ✅ | 완료 | 새 정책 적용 완료 (`fixedColumns` / `flex + columnMinWidths`) |
| 📐 | 유연 컬럼 | `flex: 1, minWidth` 조합 사용 |
| 🔒 | 고정 컬럼 | `width: fixedColumns.xxx` 사용 |
| 🔄 | 변경 필요 | 아직 새 정책 미적용 |

**페이지 유형**: 📄 리스트 | 📋 상세 탭 | 🧙 위자드

---

## 목차

1. [Compute (사용자)](#1-compute-사용자)
2. [Storage (Ceph)](#2-storage-ceph)
3. [Container](#3-container)
4. [IAM](#4-iam)
5. [ComputeAdmin (관리자)](#5-computeadmin-관리자)
6. [기타](#6-기타)

---

## 1. Compute (사용자)

> 사이드바: Sidebar.tsx → `/compute/*`

### Compute 섹션

#### 📄 InstanceListPage - VM Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: '140px'` | 📐 |
| locked | `columnWidths.locked` | ✅ |
| fixedIp | `flex: 1, minWidth: '100px'` | 📐 |
| floatingIp | `flex: 1, minWidth: '100px'` | 📐 |
| image | `flex: 1, minWidth: '120px'` | 📐 |
| flavor | `flex: 1, minWidth: '100px'` | 📐 |
| vcpu | `columnWidths.vcpu` | ✅ |
| ram | `columnWidths.ram` | ✅ |
| disk | `columnWidths.disk` | ✅ |
| gpu | `columnWidths.gpu` | ✅ |
| az | `columnWidths.az` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 InstanceListPage - BareMetal Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: '140px'` | 📐 |
| ip | `flex: 1, minWidth: '100px'` | 📐 |
| image | `flex: 1, minWidth: '120px'` | 📐 |
| flavor | `flex: 1, minWidth: '100px'` | 📐 |
| cpu | `columnWidths.cpu` | ✅ |
| ram | `columnWidths.ram` | ✅ |
| disk | `columnWidths.disk` | ✅ |
| gpu | `columnWidths.gpu` | ✅ |
| az | `columnWidths.az` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 InstanceTemplatesPage (Favorites / All 탭 공통)

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| favorite | `columnWidths.favorite` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| image | `columnWidths.description` | ✅ |
| flavor | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 InstanceSnapshotsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| size | `columnWidths.size` | ✅ |
| diskFormat | `columnWidths.diskFormat` | ✅ |
| sourceInstance | `columnWidths.sourceInstance` | ✅ |
| description | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 ComputeImagesPage (Current / Shared / External 탭 공통)

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| os | `flex: 1` | 📐 |
| size | `flex: 1` | 📐 |
| diskFormat | `flex: 1` | 📐 |
| protected | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 FlavorsPage - CPU/Custom Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| category | `flex: 1, minWidth: '120px'` | 📐 |
| vcpu | `columnWidths.vcpu` | ✅ |
| ram | `columnWidths.ram` | ✅ |
| ephemeralDisk | `columnWidths.ephemeralDisk` | ✅ |
| internalNetworkBandwidth | `flex: 1, minWidth: '160px'` | 📐 |
| access | `columnWidths.access` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 FlavorsPage - GPU/MPU Tab (추가 컬럼)

> CPU/Custom Tab과 동일 + 아래 컬럼 추가

| 추가 컬럼 | 현재 설정 | 상태 |
|----------|-----------|:----:|
| gpuType | `columnWidths.gpuType` | ✅ |
| numaNodes | `columnWidths.numaNodes` | ✅ |
| cpuPolicy | `columnWidths.cpuPolicy` | ✅ |
| cpuThreadPolicy | `columnWidths.cpuThreadPolicy` | ✅ |

#### 📄 KeyPairsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1, minWidth: '150px'` | 📐 |
| fingerprint | `flex: 1, minWidth: '280px'` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |

#### 📄 ServerGroupsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| policy | `flex: 1` | 📐 |
| instances | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

### Storage 섹션

#### 📄 VolumesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| size | `columnWidths.size` | ✅ |
| type | `columnWidths.type` | ✅ |
| diskTag | `columnWidths.diskTag` | ✅ |
| attachedTo | `flex: 1, minWidth: columnWidths.attachedTo` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 VolumeSnapshotsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| size | `columnWidths.size` | ✅ |
| sourceVolume | `columnWidths.sourceVolume` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 VolumeBackupsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| size | `columnWidths.size` | ✅ |
| sourceVolume | `columnWidths.sourceVolume` | ✅ |
| backupMode | `columnWidths.backupMode` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

### Network 섹션

#### 📄 NetworksPage (Current / Shared / External 탭 공통)

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| subnetCidr | `flex: 1` | 📐 |
| external | `flex: 1` | 📐 |
| diskTag | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📄 RoutersPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| externalGateway | `flex: 1` | 📐 |
| externalFixedIp | `flex: 1` | 📐 |
| externalNetwork | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📄 PortsPage (All / Instance 탭 공통)

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| attachedTo | `flex: 1` | 📐 |
| ownedNetwork | `flex: 1` | 📐 |
| securityGroups | `flex: 1` | 📐 |
| fixedIp | `flex: 1` | 📐 |
| floatingIp | `flex: 1` | 📐 |
| macAddress | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📄 FloatingIPsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| floatingIp | `flex: 1` | 📐 |
| associatedTo | `columnWidths.associatedTo` | ✅ |
| fixedIp | `flex: 1` | 📐 |
| network | `columnWidths.network` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 SecurityGroupsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| ingressRules | `columnWidths.ingressRules` | ✅ |
| egressRules | `columnWidths.egressRules` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 LoadBalancersPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| vipAddress | `flex: 1` | 📐 |
| ownedNetwork | `flex: 1` | 📐 |
| floatingIp | `flex: 1` | 📐 |
| listeners | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 CertificatesPage (Server / CA 탭 공통)

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| domain | `flex: 1` | 📐 |
| listener | `flex: 1` | 📐 |
| expiresAt | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

### Instance Detail Tabs

#### 📋 InstanceDetailPage - Volumes Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| size | `columnWidths.size` | ✅ |
| type | `columnWidths.type` | ✅ |
| diskTag | `columnWidths.diskTag` | ✅ |
| bootable | `columnWidths.bootable` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 InstanceDetailPage - Interfaces Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| network | `columnWidths.network` | ✅ |
| fixedIp | `columnWidths.fixedIp` | ✅ |
| macAddress | `columnWidths.macAddress` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 VolumeDetailPage - Snapshots Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| size | `columnWidths.size` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 VolumeDetailPage - Backups Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| backupMode | `columnWidths.backupMode` | ✅ |
| size | `columnWidths.size` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 SecurityGroupDetailPage - Ports Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| subnet | `flex: 1` | 📐 |
| dhcp | `flex: 1` | 📐 |
| access | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 SecurityGroupDetailPage - Rules Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| direction | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |
| portRange | `flex: 1` | 📐 |
| remote | `flex: 1` | 📐 |
| icmpTypeCode | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 LoadBalancerDetailPage - Listeners Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |
| port | `flex: 1` | 📐 |
| connectionLimit | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 LoadBalancerDetailPage - Pools Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| protocol | `columnWidths.protocol` | ✅ |
| algorithm | `columnWidths.algorithm` | ✅ |
| listener | `columnWidths.listener` | ✅ |
| members | `columnWidths.members` | ✅ |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 NetworkDetailPage - Subnets Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| cidr | `flex: 1` | 📐 |
| gatewayIp | `flex: 1` | 📐 |
| portCount | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 NetworkDetailPage - Ports Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| attachedTo | `flex: 1` | 📐 |
| fixedIp | `flex: 1` | 📐 |
| macAddress | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 RouterDetailPage - Ports Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| fixedIp | `flex: 1` | 📐 |
| macAddress | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 RouterDetailPage - Static Routes Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| destination | `flex: 1` | 📐 |
| nextHop | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ServerGroupDetailPage - Instances Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| flavor | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 FlavorDetailPage - Instances Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| az | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 PortDetailPage - Fixed IPs Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| fixedIp | `flex: 1` | 📐 |
| floatingIp | `flex: 1` | 📐 |
| ownedSubnet | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 PortDetailPage - Allowed Address Pairs Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| ipAddress | `flex: 1` | 📐 |
| macAddress | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 PortDetailPage - Security Groups Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 SubnetDetailPage - Ports Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| attachedTo | `flex: 1` | 📐 |
| ownedNetwork | `flex: 1` | 📐 |
| fixedIp | `flex: 1` | 📐 |
| macAddress | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ListenerDetailPage - Pools Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |
| algorithm | `flex: 1` | 📐 |
| members | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ListenerDetailPage - L7 Policies Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| behavior | `flex: 1` | 📐 |
| position | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ListenerDetailPage - Certificates Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| expiration | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 L7PolicyDetailPage - Rules Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| compareType | `flex: 1` | 📐 |
| key | `flex: 1` | 📐 |
| value | `flex: 1` | 📐 |
| invert | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 CertificateDetailPage - Listeners Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |
| port | `flex: 1` | 📐 |
| loadBalancer | `flex: 1` | 📐 |

---

## 2. Storage (Ceph)

> 사이드바: StorageSidebar.tsx → `/storage/*`

### Cluster 섹션

#### 📄 PoolsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| pgNum | `flex: 1` | 📐 |
| replicaSize | `flex: 1` | 📐 |
| size | `flex: 1` | 📐 |
| usage | `flex: 1` | 📐 |

#### 📄 HostsPage (Ceph Hosts)

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| hostname | `flex: 2, minWidth: '150px'` | 📐 |
| labels | `flex: 1, minWidth: '100px'` | 📐 |
| model | `flex: 1.5, minWidth: '180px'` | 📐 |
| cpus | `columnWidths.cpus` | ✅ |
| cores | `columnWidths.cores` | ✅ |
| totalMemory | `columnWidths.totalMemory` | ✅ |
| rawCapacity | `columnWidths.rawCapacity` | ✅ |
| hdds | `columnWidths.hdds` | ✅ |
| flash | `columnWidths.flash` | ✅ |
| nics | `columnWidths.nics` | ✅ |

#### 📄 OSDsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| host | `flex: 1` | 📐 |
| deviceClass | `flex: 1` | 📐 |
| pgCount | `flex: 1` | 📐 |
| size | `flex: 1` | 📐 |
| usage | `flex: 1` | 📐 |

#### 📄 PhysicalDisksPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| host | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| vendor | `flex: 1` | 📐 |
| model | `flex: 1` | 📐 |
| size | `flex: 1` | 📐 |

### Performance 섹션

#### 📄 OverallPerformancePage - Pool Overview

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| poolName | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| usableFree | `flex: 1` | 📐 |
| percentUsed | `flex: 1` | 📐 |
| growth5d | `flex: 1` | 📐 |
| iops | `flex: 1` | 📐 |
| bandwidth | `flex: 1` | 📐 |
| stored | `flex: 1` | 📐 |
| id | `columnWidths.id` | ✅ |

#### 📄 OverallPerformancePage - Host Overview

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| hostname | `flex: 2` | 📐 |
| totalMemory | `flex: 1` | 📐 |
| rawCapacity | `flex: 1` | 📐 |
| id | `columnWidths.id` | ✅ |

#### 📄 OverallPerformancePage - OSD Latency

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| osdId | `flex: 1` | 📐 |
| latency | `flex: 1` | 📐 |

#### 📄 OverallPerformancePage - Slow OSD Ops

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| osdId | `flex: 2` | 📐 |
| slowOps | `flex: 2` | 📐 |
| id | `columnWidths.id` | ✅ |

### Block 섹션

#### 📄 ImagesPage (RBD Images)

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `columnWidths.nameXxl` | ✅ |
| pool | `flex: 1` | 📐 |
| size | `flex: 1` | 📐 |
| usage | `flex: 1` | 📐 |
| objects | `flex: 1` | 📐 |
| objectSize | `flex: 1` | 📐 |
| totalProvisioned | `flex: 1` | 📐 |
| parent | `flex: 1` | 📐 |

### Object 섹션

#### 📄 BucketsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1, minWidth: columnWidths.nameWide` | 📐 |
| owner | `columnWidths.owner` | ✅ |
| usedCapacity | `columnWidths.usedCapacity` | ✅ |
| capacityLimit | `columnWidths.capacityLimit` | ✅ |
| objects | `columnWidths.objects` | ✅ |
| objectLimit | `columnWidths.objectLimit` | ✅ |
| creationDate | `columnWidths.creationDate` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

### Storage Detail Tabs

#### 📋 HostDetailPage - Devices Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| deviceId | `columnWidths.deviceId` | ✅ |
| deviceName | `columnWidths.deviceName` | ✅ |
| daemons | `columnWidths.daemons` | ✅ |

#### 📋 HostDetailPage - Physical Disks Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| devicePath | `columnWidths.devicePath` | ✅ |
| type | `columnWidths.type` | ✅ |
| available | `columnWidths.available` | ✅ |
| vendor | `columnWidths.vendor` | ✅ |
| model | `columnWidths.model` | ✅ |
| size | `columnWidths.size` | ✅ |
| osd | `columnWidths.osd` | ✅ |
| identify | `columnWidths.identify` | ✅ |

#### 📋 HostDetailPage - Daemons Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| daemonName | `columnWidths.daemonName` | ✅ |
| version | `columnWidths.version` | ✅ |
| lastRefreshed | `columnWidths.lastRefreshed` | ✅ |
| cpuUsage | `flex: 1` | 📐 |
| memoryUsage | `flex: 1` | 📐 |

#### 📋 OSDDetailPage - Devices Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| deviceId | `columnWidths.deviceId` | ✅ |
| deviceName | `columnWidths.deviceName` | ✅ |

#### 📋 PoolDetailPage (LB) - Members Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| address | `flex: 1` | 📐 |
| port | `flex: 1` | 📐 |
| weight | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 BucketDetailPage - Tags Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| key | `flex: 1` | 📐 |
| value | `flex: 1` | 📐 |

#### 📋 BucketDetailPage - ACL Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| grantee | `flex: 1` | 📐 |
| permissions | `flex: 1` | 📐 |

---

## 3. Container

> 사이드바: ContainerSidebar.tsx → `/container/*`

### Home/Dashboard 섹션

#### 📄 ContainerHomePage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| kubernetesVersion | `columnWidths.kubernetesVersion` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| cpu | `columnWidths.cpu` | ✅ |
| memory | `columnWidths.memory` | ✅ |
| pods | `columnWidths.pods` | ✅ |

#### 📄 ContainerDashboardPage - Events

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| reason | `flex: 1, minWidth: '80px'` | 📐 |
| object | `flex: 1, minWidth: '80px'` | 📐 |
| message | `flex: 2, minWidth: '100px'` | 📐 |
| name | `flex: 1, minWidth: '100px'` | 📐 |
| firstSeen | `columnWidths.firstSeen` | ✅ |
| lastSeen | `columnWidths.lastSeen` | ✅ |
| count | `columnWidths.count` | ✅ |

### Cluster 섹션

#### 📄 ContainerNamespacesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 ContainerNodesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| roles | `columnWidths.roles` | ✅ |
| version | `columnWidths.version` | ✅ |
| ip | `columnWidths.ipAddress` | ✅ |
| os | `columnWidths.os` | ✅ |
| cpuUsage | `columnWidths.cpuUsage` | ✅ |
| ramUsage | `columnWidths.ramUsage` | ✅ |
| podsUsage | `columnWidths.podsUsage` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 ContainerEventsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| namespace | `columnWidths.namespace` | ✅ |
| lastSeen | `columnWidths.lastSeen` | ✅ |
| type | `columnWidths.type` | ✅ |
| reason | `columnWidths.reason` | ✅ |
| object | `columnWidths.object` | ✅ |
| subobject | `columnWidths.subobject` | ✅ |
| source | `columnWidths.source` | ✅ |
| message | `flex: 1` | 📐 |
| firstSeen | `columnWidths.firstSeen` | ✅ |
| count | `columnWidths.count` | ✅ |
| actions | `columnWidths.actions` | ✅ |

### Workloads 섹션

#### 📄 DeploymentsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| namespace | `columnWidths.namespace` | ✅ |
| image | `columnWidths.image` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| upToDate | `columnWidths.upToDate` | ✅ |
| available | `columnWidths.available` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 StatefulSetsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| namespace | `columnWidths.namespace` | ✅ |
| image | `columnWidths.image` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 DaemonSetsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| namespace | `columnWidths.namespace` | ✅ |
| image | `columnWidths.image` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| current | `columnWidths.current` | ✅ |
| desired | `columnWidths.desired` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 JobsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| namespace | `flex: 1` | 📐 |
| image | `flex: 1.5` | 📐 |
| completions | `columnWidths.completions` | ✅ |
| duration | `columnWidths.duration` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 CronJobsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| namespace | `columnWidths.namespace` | ✅ |
| image | `columnWidths.image` | ✅ |
| schedule | `columnWidths.schedule` | ✅ |
| lastSchedule | `columnWidths.lastSchedule` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 PodsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| namespace | `columnWidths.namespace` | ✅ |
| image | `columnWidths.image` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| restarts | `columnWidths.restarts` | ✅ |
| ip | `columnWidths.ip` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

### Service Discovery 섹션

#### 📄 ContainerServicesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| namespace | `columnWidths.namespace` | ✅ |
| target | `columnWidths.target` | ✅ |
| selector | `columnWidths.selector` | ✅ |
| type | `columnWidths.type` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 ContainerIngressesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: '120px'` | 🔄 |
| namespace | `flex: 1, minWidth: '100px'` | 🔄 |
| target | `flex: 1, minWidth: '140px'` | 🔄 |
| default | `flex: 1, minWidth: '80px'` | 🔄 |
| ingressClass | `flex: 1, minWidth: '100px'` | 🔄 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 ContainerHPAPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| namespace | `flex: 1` | 📐 |
| workload | `flex: 1` | 📐 |
| minReplicas | `flex: 1` | 📐 |
| maxReplicas | `flex: 1` | 📐 |
| currentReplicas | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

### Storage 섹션

#### 📄 PersistentVolumesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 2` | 📐 |
| reclaimPolicy | `flex: 1` | 📐 |
| persistentVolumeClaim | `flex: 1.5` | 📐 |
| source | `flex: 1` | 📐 |
| reason | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 PersistentVolumeClaimsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: '120px'` | 🔄 |
| namespace | `flex: 1, minWidth: '80px'` | 🔄 |
| volume | `flex: 1.5` | 📐 |
| capacity | `columnWidths.capacity` | ✅ |
| accessModes | `columnWidths.accessModes` | ✅ |
| storageClass | `flex: 1, minWidth: '100px'` | 🔄 |
| volumeAttributesClass | `flex: 1, minWidth: '120px'` | 🔄 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 StorageClassesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| isDefault | `columnWidths.default` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📄 ConfigMapsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| data | `flex: 2` | 📐 |
| createdAt | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📄 SecretsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| data | `flex: 2` | 📐 |
| createdAt | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

### Policy 섹션

#### 📄 LimitRangesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| namespace | `flex: 1` | 📐 |
| createdAt | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📄 ResourceQuotasPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| namespace | `flex: 1` | 📐 |
| request | `flex: 1` | 📐 |
| limit | `flex: 1` | 📐 |
| createdAt | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📄 NetworkPoliciesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| namespace | `flex: 1` | 📐 |
| podSelector | `flex: 1` | 📐 |
| createdAt | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📄 PodDisruptionBudgetsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| namespace | `flex: 1` | 📐 |
| minAvailable | `flex: 1` | 📐 |
| maxUnavailable | `flex: 1` | 📐 |
| createdAt | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

### Container Detail Tabs

#### 📋 DeploymentDetailPage - Pods Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| image | `columnWidths.image` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| restarts | `columnWidths.restarts` | ✅ |
| ip | `columnWidths.ip` | ✅ |
| node | `columnWidths.node` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 DeploymentDetailPage - Services Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| target | `flex: 1` | 📐 |
| type | `columnWidths.type` | ✅ |
| clusterIP | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 NodeDetailPage - Pods Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| namespace | `columnWidths.namespace` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| restarts | `columnWidths.restarts` | ✅ |
| ip | `columnWidths.ip` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 NodeDetailPage - Images Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 2` | 📐 |
| size | `flex: 1` | 📐 |

#### 📋 NodeDetailPage - Taints Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| key | `flex: 1` | 📐 |
| value | `flex: 1` | 📐 |
| effect | `flex: 1` | 📐 |

#### 📋 NodeDetailPage - Conditions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| status | `flex: 1` | 📐 |
| lastHeartbeat | `flex: 1` | 📐 |
| lastTransition | `flex: 1` | 📐 |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |

#### 📋 NodeDetailPage - Events Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `columnWidths.type` | ✅ |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |
| count | `columnWidths.count` | ✅ |
| lastSeen | `flex: 1` | 📐 |

#### 📋 StatefulSetDetailPage - Pods Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| image | `columnWidths.image` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| restarts | `columnWidths.restarts` | ✅ |
| ip | `columnWidths.ip` | ✅ |
| node | `columnWidths.node` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 DaemonSetDetailPage - Pods Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| image | `columnWidths.image` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| restarts | `columnWidths.restarts` | ✅ |
| ip | `columnWidths.ip` | ✅ |
| node | `columnWidths.node` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 CronJobDetailPage - Jobs Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| completions | `columnWidths.completions` | ✅ |
| duration | `columnWidths.duration` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 JobDetailPage - Pods Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| image | `columnWidths.image` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| restarts | `columnWidths.restarts` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 PodDetailPage - Containers Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| image | `flex: 1` | 📐 |
| ready | `flex: 1` | 📐 |
| restarts | `flex: 1` | 📐 |
| action | `columnWidths.action` | ✅ |

#### 📋 ContainerServiceDetailPage - Pods Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| image | `columnWidths.image` | ✅ |
| ready | `columnWidths.ready` | ✅ |
| restarts | `columnWidths.restarts` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 ContainerServiceDetailPage - Ports Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| port | `flex: 1` | 📐 |
| targetPort | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |

#### 📋 ContainerServiceDetailPage - Selectors Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| key | `flex: 1` | 📐 |
| value | `flex: 1` | 📐 |

#### 📋 ContainerIngressDetailPage - Rules Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| host | `flex: 1` | 📐 |
| path | `flex: 1` | 📐 |
| pathType | `flex: 1` | 📐 |
| backend | `flex: 1` | 📐 |

#### 📋 ContainerHPADetailPage - Conditions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| status | `flex: 1` | 📐 |
| lastTransition | `flex: 1` | 📐 |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |

#### 📋 NamespaceDetailPage - Resources Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| used | `flex: 1` | 📐 |
| hard | `flex: 1` | 📐 |

#### 📋 NamespaceDetailPage - Workloads Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| ready | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |

#### 📋 NamespaceDetailPage - Conditions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| status | `flex: 1` | 📐 |
| lastTransition | `flex: 1` | 📐 |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |

#### 📋 NetworkPolicyDetailPage - Matching Pods Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |

#### 📋 PodDisruptionBudgetDetailPage - Matching Pods Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |

#### 📋 PodDisruptionBudgetDetailPage - Conditions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| condition | `flex: 1` | 📐 |
| size | `flex: 1` | 📐 |
| message | `flex: 1` | 📐 |
| updated | `flex: 1` | 📐 |

#### 📋 PodDisruptionBudgetDetailPage - Recent Events Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| lastSeen | `columnWidths.lastSeen` | ✅ |
| type | `columnWidths.type` | ✅ |
| reason | `flex: 1` | 📐 |
| subobject | `flex: 1` | 📐 |
| source | `columnWidths.source` | ✅ |
| message | `flex: 2` | 📐 |
| firstSeen | `columnWidths.firstSeen` | ✅ |
| count | `columnWidths.count` | ✅ |

#### 📋 StatefulSetDetailPage - Services Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| type | `columnWidths.type` | ✅ |
| clusterIp | `columnWidths.clusterIp` | ✅ |
| ports | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 StatefulSetDetailPage - Conditions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| status | `flex: 1` | 📐 |
| lastTransition | `flex: 1` | 📐 |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |

#### 📋 StatefulSetDetailPage - Events Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `columnWidths.type` | ✅ |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |
| count | `columnWidths.count` | ✅ |
| lastSeen | `flex: 1` | 📐 |

#### 📋 DaemonSetDetailPage - Services Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| type | `columnWidths.type` | ✅ |
| clusterIp | `columnWidths.clusterIp` | ✅ |
| ports | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.action` | ✅ |

#### 📋 DaemonSetDetailPage - Conditions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| status | `flex: 1` | 📐 |
| lastTransition | `flex: 1` | 📐 |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |

#### 📋 DaemonSetDetailPage - Events Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `columnWidths.type` | ✅ |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |
| count | `columnWidths.count` | ✅ |
| lastSeen | `flex: 1` | 📐 |

#### 📋 CronJobDetailPage - Events Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `columnWidths.type` | ✅ |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |
| count | `columnWidths.count` | ✅ |
| lastSeen | `flex: 1` | 📐 |

#### 📋 JobDetailPage - Conditions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| status | `flex: 1` | 📐 |
| lastTransition | `flex: 1` | 📐 |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |

#### 📋 JobDetailPage - Events Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `columnWidths.type` | ✅ |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |
| count | `columnWidths.count` | ✅ |
| lastSeen | `flex: 1` | 📐 |

#### 📋 PodDetailPage - Conditions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| status | `flex: 1` | 📐 |
| lastTransition | `flex: 1` | 📐 |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |

#### 📋 PodDetailPage - Events Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `columnWidths.type` | ✅ |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |
| count | `columnWidths.count` | ✅ |
| lastSeen | `flex: 1` | 📐 |

#### 📋 ContainerServiceDetailPage - Conditions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| status | `flex: 1` | 📐 |
| lastTransition | `flex: 1` | 📐 |
| reason | `flex: 1` | 📐 |
| message | `flex: 2` | 📐 |

---

## 4. IAM

> 사이드바: IAMSidebar.tsx → `/iam/*`

### Access Management 섹션

#### 📄 IAMUsersPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| username | `flex: 1, minWidth: columnWidths.username` | 📐 |
| userGroups | `columnWidths.userGroups` | ✅ |
| roles | `columnWidths.roles` | ✅ |
| lastSignIn | `columnWidths.lastSignIn` | ✅ |
| mfa | `columnWidths.mfa` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actionWide` | ✅ |

#### 📄 IAMUserGroupsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| type | `columnWidths.typeLg` | ✅ |
| roles | `columnWidths.roles` | ✅ |
| userCount | `columnWidths.userCount` | ✅ |
| description | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actionWide` | ✅ |

#### 📄 IAMRolesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1, minWidth: columnWidths.name` | 📐 |
| type | `columnWidths.typeLg` | ✅ |
| policies | `columnWidths.policies` | ✅ |
| description | `flex: 1` | 📐 |
| scope | `columnWidths.scope` | ✅ |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actionWide` | ✅ |

### Session Management 섹션

#### 📄 IAMActiveSessionsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| user | `flex: 1, minWidth: columnWidths.user` | 📐 |
| started | `columnWidths.started` | ✅ |
| lastAccess | `columnWidths.lastAccess` | ✅ |
| ipAddress | `columnWidths.ipAddress` | ✅ |
| device | `flex: 1` | 📐 |
| actions | `columnWidths.actionWide` | ✅ |

### Global Administration 섹션

#### 📄 IAMDomainsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| enabled | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📄 IAMSystemAdministratorsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| username | `flex: 1` | 📐 |
| roles | `flex: 1` | 📐 |
| lastSignIn | `flex: 1` | 📐 |
| mfa | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

### IAM Detail Tabs

#### 📋 IAMUserDetailPage - Sessions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| started | `flex: 1` | 📐 |
| lastAccess | `flex: 1` | 📐 |
| ipAddress | `flex: 1` | 📐 |
| device | `flex: 1` | 📐 |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMUserDetailPage - Access Keys Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| keyId | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| lastUsed | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMUserDetailPage - Roles Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| source | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| policies | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMUserDetailPage - User Groups Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| users | `flex: 1` | 📐 |
| attachedRoles | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMUserGroupDetailPage - Users Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| lastSignIn | `flex: 1` | 📐 |
| mfa | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMUserGroupDetailPage - Roles Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| policies | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMRoleDetailPage - Policies Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMRoleDetailPage - User Groups Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| users | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMRoleDetailPage - Users Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| source | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMPolicyDetailPage - Roles Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMSystemAdminDetailPage - MFA Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| method | `flex: 1` | 📐 |
| lastUsed | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| action | `columnWidths.actionWide` | ✅ |

#### 📋 IAMSystemAdminDetailPage - Sessions Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| started | `flex: 1` | 📐 |
| lastAccess | `flex: 1` | 📐 |
| ipAddress | `flex: 1` | 📐 |
| device | `flex: 1` | 📐 |
| action | `columnWidths.actionWide` | ✅ |

---

## 5. ComputeAdmin (관리자)

> 사이드바: Sidebar.tsx → `/compute-admin/*`  
> **참고**: 대부분 하드코딩 상태, 별도 마이그레이션 필요

### Compute 섹션

#### 📄 ComputeAdminInstanceListPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| locked | `'68px'` | 🔄 |
| vcpu | `'80px'` | 🔄 |
| ram | `'80px'` | 🔄 |
| disk | `'80px'` | 🔄 |
| gpu | `'80px'` | 🔄 |
| az | `'64px'` | 🔄 |
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminInstanceTemplatesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminInstanceSnapshotsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminImagesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminFlavorsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminServerGroupsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| actions | `'72px'` | 🔄 |

#### 📄 ComputeAdminBareMetalNodesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'59px'` | 🔄 |
| actions | `'120px'` | 🔄 |

### Storage 섹션

#### 📄 ComputeAdminVolumesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'59px'` | 🔄 |
| actions | `'72px'` | 🔄 |

#### 📄 ComputeAdminVolumeSnapshotsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminVolumeBackupsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| actions | `'64px'` | 🔄 |

### Network 섹션

#### 📄 ComputeAdminNetworksPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminRoutersPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminPortsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| attachedTo | `'160px'` | 🔄 |
| ownedNetwork | `'140px'` | 🔄 |
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminFloatingIPsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| attachedTo | `'160px'` | 🔄 |
| ownedNetwork | `'140px'` | 🔄 |
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminSecurityGroupsPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminLoadBalancersPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| actions | `'64px'` | 🔄 |

#### 📄 ComputeAdminCertificatesPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `'64px'` | 🔄 |
| actions | `'64px'` | 🔄 |

### Wizard

#### 🧙 ComputeAdminCreateInstancePage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| select | `'40px'` | 🔄 |
| favorite | `'64px'` | 🔄 |
| name | `'300px'` | 🔄 |
| version | `'80px'` | 🔄 |
| size | `'100px'` | 🔄 |
| minDisk | `'90px'` | 🔄 |
| minRam | `'100px'` | 🔄 |
| access | `'80px'` | 🔄 |
| createdAt | `'120px'` | 🔄 |

### ComputeAdmin Detail Tabs

#### 📋 ComputeAdminVolumeDetailPage - Snapshots Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| size | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminVolumeDetailPage - Backups Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| size | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminSecurityGroupDetailPage - Ports Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| attachedTo | `flex: 1` | 📐 |
| network | `flex: 1` | 📐 |
| subnet | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminSecurityGroupDetailPage - Rules Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| direction | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |
| portRange | `flex: 1` | 📐 |
| remote | `flex: 1` | 📐 |
| icmpTypeCode | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminNetworkDetailPage - Subnets Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| cidr | `flex: 1` | 📐 |
| gatewayIp | `flex: 1` | 📐 |
| portCount | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminNetworkDetailPage - Ports Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| attachedTo | `flex: 1` | 📐 |
| fixedIp | `flex: 1` | 📐 |
| macAddress | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminSubnetDetailPage - Ports Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| attachedTo | `flex: 1` | 📐 |
| ownedNetwork | `flex: 1` | 📐 |
| fixedIp | `flex: 1` | 📐 |
| macAddress | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminRouterDetailPage - Ports Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| fixedIp | `flex: 1` | 📐 |
| macAddress | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminRouterDetailPage - Static Routes Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| destination | `flex: 1` | 📐 |
| nextHop | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminPortDetailPage - Fixed IPs Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| fixedIp | `flex: 1` | 📐 |
| floatingIp | `flex: 1` | 📐 |
| ownedSubnet | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminPortDetailPage - Allowed Address Pairs Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| ipAddress | `flex: 1` | 📐 |
| macAddress | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminPortDetailPage - Security Groups Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| name | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminServerGroupDetailPage - Instances Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| flavor | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminFlavorDetailPage - Instances Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| az | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminLoadBalancerDetailPage - Listeners Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |
| port | `flex: 1` | 📐 |
| connectionLimit | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminLoadBalancerDetailPage - Pools Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |
| algorithm | `flex: 1` | 📐 |
| listener | `flex: 1` | 📐 |
| members | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminListenerDetailPage - Pools Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |
| algorithm | `flex: 1` | 📐 |
| members | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminListenerDetailPage - L7 Policies Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| behavior | `flex: 1` | 📐 |
| position | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminListenerDetailPage - Certificates Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| expiration | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminL7PolicyDetailPage - Rules Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| type | `flex: 1` | 📐 |
| compareType | `flex: 1` | 📐 |
| key | `flex: 1` | 📐 |
| value | `flex: 1` | 📐 |
| invert | `flex: 1` | 📐 |
| adminState | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminPoolDetailPage - Members Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| address | `flex: 1` | 📐 |
| port | `flex: 1` | 📐 |
| weight | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

#### 📋 ComputeAdminCertificateDetailPage - Listeners Tab

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| protocol | `flex: 1` | 📐 |
| port | `flex: 1` | 📐 |
| loadBalancer | `flex: 1` | 📐 |

---

## 6. 기타

### 📄 AgentPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| timestamp | `flex: 1` | 📐 |
| level | `flex: 1` | 📐 |
| message | `flex: 3` | 📐 |

### 📄 AIPlatformPage

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| status | `columnWidths.status` | ✅ |
| name | `flex: 1` | 📐 |
| type | `flex: 1` | 📐 |
| createdAt | `columnWidths.createdAt` | ✅ |
| actions | `columnWidths.actions` | ✅ |

### 📄 MCPToolsPage - Tools

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| favorite | `columnWidths.favorite` | ✅ |
| status | `columnWidths.status` | ✅ |
| title | `flex: 1` | 📐 |
| mcpServer | `flex: 1` | 📐 |
| category | `flex: 1` | 📐 |
| tags | `flex: 1` | 📐 |
| createdAt | `flex: 1` | 📐 |

### 📄 MCPToolsPage - Templates

| 컬럼 | 현재 설정 | 상태 |
|------|-----------|:----:|
| favorite | `columnWidths.favorite` | ✅ |
| status | `columnWidths.status` | ✅ |
| title | `flex: 1` | 📐 |
| description | `flex: 1` | 📐 |
| tools | `flex: 1` | 📐 |
| tags | `flex: 1` | 📐 |
| createdAt | `flex: 1` | 📐 |
| actions | `columnWidths.actions` | ✅ |

---

## 요약 통계

| 영역 | ✅ 프리셋 | 📐 확장 | 🔄 변경필요 |
|------|:--------:|:------:|:----------:|
| Compute (사용자) | 68 | 52 | 0 |
| Storage (Ceph) | 20 | 28 | 0 |
| Container | 75 | 55 | 12 |
| IAM | 26 | 14 | 0 |
| ComputeAdmin | 0 | 0 | ~50 |
| 기타 | 5 | 6 | 0 |

---

## 관련 문서

- [columnWidths.ts](./src/design-system/presets/columnWidths.ts) - 프리셋 소스 코드
- [column-width-guide.md](./column-width-guide.md) - 사용 가이드
