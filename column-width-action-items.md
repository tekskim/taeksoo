# 테이블 컬럼 너비 변경 작업 목록

> **목적**: 개발자가 바로 프로덕션에 적용할 수 있는 구체적인 변경 가이드
> 
> **마지막 업데이트**: 2026-01-27
> 
> **우선순위 기준**:
> - 🔴 높음: 하드코딩된 값 → 프리셋으로 변경 필요
> - 🟡 중간: minWidth 하드코딩 → 프리셋으로 변경 권장
> - 🟢 낮음: 현재 상태 유지 가능 (확장 컬럼으로 의도된 flex: 1)

---

## 시작 전 준비

```tsx
// 모든 파일 상단에 import 확인
import { columnWidths } from '@/design-system';
```

---

## 1. Compute 영역

### 📄 InstanceListPage.tsx
**파일**: `src/pages/InstanceListPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| vcpu | `width: '64px'` | `width: columnWidths.vcpu` | 🔴 |
| ram | `width: '64px'` | `width: columnWidths.ram` | 🔴 |
| disk | `width: '64px'` | `width: columnWidths.disk` | 🔴 |
| gpu | `width: '56px'` | `width: columnWidths.gpu` | 🔴 |
| az | `width: '56px'` | `width: columnWidths.az` | 🔴 |
| name | `minWidth: 140px` | `minWidth: columnWidths.name` | 🟡 |
| fixedIp | `minWidth: 100px` | `minWidth: columnWidths.fixedIp` | 🟡 |
| floatingIp | `minWidth: 100px` | `minWidth: columnWidths.floatingIp` | 🟡 |

<details>
<summary>코드 변경 예시</summary>

```tsx
// Before
{ key: 'vcpu', label: 'vCPU', width: '64px', sortable: true, align: 'center' },
{ key: 'ram', label: 'RAM', width: '64px', sortable: true, align: 'center' },
{ key: 'disk', label: 'Disk', width: '64px', sortable: true, align: 'center' },
{ key: 'gpu', label: 'GPU', width: '56px', sortable: true, align: 'center' },
{ key: 'az', label: 'AZ', width: '56px', sortable: true },

// After
{ key: 'vcpu', label: 'vCPU', width: columnWidths.vcpu, sortable: true, align: 'center' },
{ key: 'ram', label: 'RAM', width: columnWidths.ram, sortable: true, align: 'center' },
{ key: 'disk', label: 'Disk', width: columnWidths.disk, sortable: true, align: 'center' },
{ key: 'gpu', label: 'GPU', width: columnWidths.gpu, sortable: true, align: 'center' },
{ key: 'az', label: 'AZ', width: columnWidths.az, sortable: true },
```
</details>

---

### 📋 InstanceDetailPage.tsx - Volumes Tab
**파일**: `src/pages/InstanceDetailPage.tsx`
**위치**: Volumes 탭 columns 정의 부분

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| size | `flex: 1` | `width: columnWidths.size` | 🔴 |
| type | `flex: 1` | `width: columnWidths.type` | 🔴 |
| diskTag | `flex: 1` | `width: columnWidths.diskTag` | 🔴 |
| bootable | `flex: 1` | `width: columnWidths.bootable` | 🔴 |
| access | `flex: 1` | `width: columnWidths.access` | 🔴 |
| name | `flex: 1` | `flex: 1, minWidth: columnWidths.name` | 🟢 (확장 컬럼 유지) |

<details>
<summary>코드 변경 예시</summary>

```tsx
// Before
{ key: 'size', label: 'Size', flex: 1 },
{ key: 'type', label: 'Type', flex: 1 },

// After
{ key: 'size', label: 'Size', width: columnWidths.size },
{ key: 'type', label: 'Type', width: columnWidths.type },
```
</details>

---

### 📋 InstanceDetailPage.tsx - Interfaces Tab
**파일**: `src/pages/InstanceDetailPage.tsx`
**위치**: Interfaces 탭 columns 정의 부분

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| network | `flex: 1` | `width: columnWidths.network` | 🔴 |
| macAddress | `flex: 1` | `width: columnWidths.macAddress` | 🔴 |
| createdAt | `flex: 1` | `width: columnWidths.createdAt` | 🔴 |

---

### 📋 InstanceDetailPage.tsx - Security Tab
**파일**: `src/pages/InstanceDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| createdAt | `flex: 1` | `width: columnWidths.createdAt` | 🔴 |
| name | `flex: 1` | `flex: 1, minWidth: columnWidths.name` | 🟢 (확장 컬럼) |
| description | `flex: 1` | `flex: 1` | 🟢 (확장 컬럼 유지) |

---

### 📋 InstanceDetailPage.tsx - Snapshots Tab
**파일**: `src/pages/InstanceDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| size | `flex: 1` | `width: columnWidths.size` | 🔴 |
| diskFormat | `flex: 1` | `width: columnWidths.diskFormat` | 🔴 |
| createdAt | `flex: 1` | `width: columnWidths.createdAt` | 🔴 |

---

### 📄 FlavorsPage.tsx
**파일**: `src/pages/FlavorsPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| internalNetworkBandwidth | `flex: 1` | `width: columnWidths.internalNetworkBandwidth` | 🔴 |
| gpuType | `flex: 1` | `width: columnWidths.gpuType` | 🔴 |
| numaNodes | `flex: 1` | `width: columnWidths.numaNodes` | 🔴 |
| cpuPolicy | `flex: 1` | `width: columnWidths.cpuPolicy` | 🔴 |
| cpuThreadPolicy | `flex: 1` | `width: columnWidths.cpuThreadPolicy` | 🔴 |
| category | `flex: 1` | `width: columnWidths.category` | 🔴 |
| name | `flex: 1` | `flex: 1, minWidth: columnWidths.name` | 🟢 (확장 컬럼) |

---

### 📋 FlavorDetailPage.tsx - Instances Tab
**파일**: `src/pages/FlavorDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| image | `flex: 1` | `width: columnWidths.image` | 🔴 |
| fixedIP | `flex: 1` | `width: columnWidths.fixedIp` | 🔴 |
| az | `flex: 1` | `width: columnWidths.az` | 🔴 |
| createdAt | `flex: 1` | `width: columnWidths.createdAt` | 🔴 |

---

### 📄 HostsPage.tsx
**파일**: `src/pages/HostsPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| cpus | `minWidth: 65px` | `width: columnWidths.cpus` | 🔴 |
| cores | `minWidth: 65px` | `width: columnWidths.cores` | 🔴 |
| totalMemory | `minWidth: 100px` | `width: columnWidths.totalMemory` | 🔴 |
| rawCapacity | `minWidth: 100px` | `width: columnWidths.rawCapacity` | 🔴 |
| hdds | `minWidth: 60px` | `width: columnWidths.hdds` | 🔴 |
| flash | `minWidth: 60px` | `width: columnWidths.flash` | 🔴 |
| nics | `minWidth: 60px` | `width: columnWidths.nics` | 🔴 |
| hostname | `flex: 2` | `flex: 1, minWidth: columnWidths.hostname` | 🟡 |
| model | `flex: 1.5` | `width: columnWidths.model` | 🔴 |

---

### 📋 HostDetailPage.tsx - Devices Tab
**파일**: `src/pages/HostDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| deviceId | `flex: 1` | `width: columnWidths.deviceId` | 🔴 |
| deviceName | `flex: 1` | `width: columnWidths.deviceName` | 🔴 |
| daemons | `flex: 1` | `width: columnWidths.daemons` | 🔴 |

---

### 📋 HostDetailPage.tsx - Physical Disks Tab
**파일**: `src/pages/HostDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| devicePath | `flex: 1` | `width: columnWidths.devicePath` | 🔴 |
| type | `flex: 1` | `width: columnWidths.type` | 🔴 |
| vendor | `flex: 1` | `width: columnWidths.vendor` | 🔴 |
| model | `flex: 1` | `width: columnWidths.model` | 🔴 |
| size | `flex: 1` | `width: columnWidths.size` | 🔴 |
| osd | `flex: 1` | `width: columnWidths.osd` | 🔴 |

---

### 📋 HostDetailPage.tsx - Daemon Tab
**파일**: `src/pages/HostDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| daemonName | `flex: 1.5` | `flex: 1, minWidth: columnWidths.daemonName` | 🟡 |
| version | `flex: 1` | `width: columnWidths.version` | 🔴 |
| lastRefreshed | `flex: 1` | `width: columnWidths.lastRefreshed` | 🔴 |
| cpuUsage | `flex: 1` | `width: columnWidths.cpuUsage` | 🔴 |
| memoryUsage | `flex: 1` | `width: columnWidths.memoryUsage` | 🔴 |
| daemonEvents | `flex: 1.5` | `width: columnWidths.daemonEvents` | 🔴 |

---

## 2. Container 영역

### 📄 ContainerIngressesPage.tsx
**파일**: `src/pages/ContainerIngressesPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| name | `minWidth: '120px'` | `minWidth: columnWidths.name` | 🟡 |
| namespace | `minWidth: '100px'` | `minWidth: columnWidths.namespace` | 🟡 |
| target | `minWidth: '140px'` | `minWidth: columnWidths.target` | 🟡 |
| default | `minWidth: '80px'` | `minWidth: columnWidths.default` | 🟡 |
| ingressClass | `minWidth: '100px'` | `minWidth: columnWidths.ingressClass` | 🟡 |

<details>
<summary>코드 변경 예시</summary>

```tsx
// Before
{ key: 'name', label: 'Name', flex: 1, minWidth: '120px', sortable: true, ... },

// After
{ key: 'name', label: 'Name', flex: 1, minWidth: columnWidths.name, sortable: true, ... },
```
</details>

---

### 📄 ContainerHPAPage.tsx
**파일**: `src/pages/ContainerHPAPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| namespace | `flex: 1` | `width: columnWidths.namespace` | 🔴 |
| workload | `flex: 1` | `width: columnWidths.workload` | 🔴 |
| minReplicas | `flex: 1` | `width: columnWidths.minReplicas` | 🔴 |
| maxReplicas | `flex: 1` | `width: columnWidths.maxReplicas` | 🔴 |
| currentReplicas | `flex: 1` | `width: columnWidths.currentReplicas` | 🔴 |

---

### 📄 PersistentVolumeClaimsPage.tsx
**파일**: `src/pages/PersistentVolumeClaimsPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| name | `minWidth: 120px` | `minWidth: columnWidths.name` | 🟡 |
| namespace | `minWidth: 80px` | `minWidth: columnWidths.namespace` | 🟡 |
| volume | `flex: 1.5` | `flex: 1, minWidth: columnWidths.volume` | 🟡 |
| storageClass | `minWidth: 100px` | `minWidth: columnWidths.storageClass` | 🟡 |
| volumeAttributesClass | `minWidth: 120px` | `minWidth: columnWidths.volumeAttributesClass` | 🟡 |

---

## 3. IAM 영역

### 📋 IAMUserDetailPage.tsx - User Groups Tab
**파일**: `src/pages/IAMUserDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| users | `flex: 1` | `width: columnWidths.users` | 🔴 |
| attachedRoles | `flex: 1` | `width: columnWidths.attachedRoles` | 🔴 |
| name | `flex: 1` | `flex: 1, minWidth: columnWidths.name` | 🟢 (확장 컬럼) |
| description | `flex: 1` | `flex: 1` | 🟢 (확장 컬럼 유지) |

---

### 📋 IAMUserDetailPage.tsx - Roles Tab
**파일**: `src/pages/IAMUserDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| type | `flex: 1` | `width: columnWidths.type` | 🔴 |
| policies | `flex: 1` | `width: columnWidths.policies` | 🔴 |
| createdAt | `flex: 1` | `width: columnWidths.createdAt` | 🔴 |

---

### 📋 IAMUserDetailPage.tsx - Sessions Tab
**파일**: `src/pages/IAMUserDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| started | `flex: 1` | `width: columnWidths.started` | 🔴 |
| lastAccess | `flex: 1` | `width: columnWidths.lastAccess` | 🔴 |
| ipAddress | `flex: 1` | `width: columnWidths.ipAddress` | 🔴 |
| device | `flex: 1` | `flex: 1` | 🟢 (확장 컬럼 유지) |

---

### 📋 IAMUserDetailPage.tsx - Access Keys Tab
**파일**: `src/pages/IAMUserDetailPage.tsx`

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| keyId | `flex: 1` | `width: columnWidths.keyId` | 🔴 |
| description | `flex: 1` | `flex: 1` | 🟢 (확장 컬럼 유지) |
| lastUsed | `flex: 1` | `width: columnWidths.lastUsed` | 🔴 |
| createdAt | `flex: 1` | `width: columnWidths.createdAt` | 🔴 |

---

### 📄 IAMPoliciesPage.tsx (커스텀 테이블)
**파일**: `src/pages/IAMPoliciesPage.tsx`
**참고**: 이 페이지는 커스텀 테이블 구조로 별도 검토 필요

| 컬럼 | 현재 | 변경 후 | 우선순위 |
|------|------|---------|----------|
| checkbox | `w-[40px]` | `width: columnWidths.checkbox` 또는 Table 컴포넌트로 마이그레이션 | 🔴 |
| action | `w-[72px]` | `width: columnWidths.actionWide` 또는 Table 컴포넌트로 마이그레이션 | 🔴 |

---

## 요약

### 작업량 요약

| 우선순위 | 파일 수 | 변경 항목 수 |
|----------|---------|-------------|
| 🔴 높음 | ~15 | ~60 |
| 🟡 중간 | ~8 | ~20 |
| 🟢 낮음 | - | (유지) |

### 권장 작업 순서

1. **1단계**: 하드코딩된 픽셀 값 → 프리셋 변경 (🔴)
   - `width: '64px'` → `width: columnWidths.vcpu`
   
2. **2단계**: 하드코딩된 minWidth → 프리셋 변경 (🟡)
   - `minWidth: '120px'` → `minWidth: columnWidths.name`
   
3. **3단계**: 확장 컬럼에 minWidth 추가 (선택)
   - `flex: 1` → `flex: 1, minWidth: columnWidths.xxx`

---

## 참고 자료

- [columnWidths.ts](/src/design-system/presets/columnWidths.ts) - 모든 프리셋 값 정의
- [column-width-mapping.md](/column-width-mapping.md) - 전체 매핑 현황
- [column-width-guide.md](/column-width-guide.md) - 프리셋 사용 가이드
