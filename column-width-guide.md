# 테이블 컬럼 너비 가이드

`columnWidths` 프리셋을 활용한 테이블 컬럼 너비 설정 가이드입니다.

## 목차

1. [개요](#개요)
2. [기본 사용법](#기본-사용법)
3. [너비 전략](#너비-전략)
4. [테이블 유형별 권장 패턴](#테이블-유형별-권장-패턴)
5. [문제 해결](#문제-해결)
6. [프로덕션 적용 가이드](#프로덕션-적용-가이드)

---

## 개요

### 프리셋 목적

- **일관성**: 동일한 데이터 타입에 동일한 너비 적용
- **유지보수**: 중앙 집중식 너비 관리
- **반응형**: 다양한 화면 크기 대응

### Import

```tsx
import { columnWidths } from '@/design-system';
```

### 프리셋 구조

```
columnWidths
├── 공통 (select, actions, status, name, createdAt, ...)
├── Compute (cpu, ram, disk, gpu, az, image, flavor, ...)
├── Network (ip, fixedIp, cidr, protocol, macAddress, ...)
├── LoadBalancer (listeners, pools, algorithm, ...)
├── Storage (volume, capacity, storageClass, ...)
├── Container (replicas, namespace, pods, ...)
├── IAM (username, policies, mfa, ...)
├── CloudBuilder (serial, pcpusTotal, vcpusUsed, ...)
└── 키 별칭 (action→actions, vCPU→vcpu, ...)
```

---

## 기본 사용법

### 1. 고정 너비 (Fixed Width)

```tsx
const columns = [
  { key: 'status', width: columnWidths.status },     // 64px
  { key: 'createdAt', width: columnWidths.createdAt }, // 140px
  { key: 'actions', width: columnWidths.actions },   // 64px
];
```

**사용 시점:**
- 내용 길이가 예측 가능한 컬럼 (상태, 날짜, 액션)
- 정렬된 레이아웃이 필요한 경우

### 2. 가변 너비 (Flexible Width)

```tsx
const columns = [
  { key: 'name', flex: 1 },        // 남은 공간 1/3
  { key: 'description', flex: 2 }, // 남은 공간 2/3
];
```

**사용 시점:**
- 내용 길이가 가변적인 컬럼 (이름, 설명)
- 화면 크기에 따라 조절되어야 하는 컬럼

### 3. 반응형 (Flex + minWidth)

```tsx
const columns = [
  { key: 'name', flex: 1, minWidth: '120px' },
  { key: 'namespace', flex: 1, minWidth: '80px' },
];
```

**사용 시점:**
- 컬럼이 많은 테이블 (8개 이상)
- 최소 너비 보장이 필요한 경우

---

## 너비 전략

### 컬럼 타입별 권장 설정

| 컬럼 타입 | 권장 설정 | 예시 |
|----------|----------|------|
| 체크박스 | 고정 40px | `width: columnWidths.select` |
| 상태 | 고정 64px | `width: columnWidths.status` |
| 날짜/시간 | 고정 140px | `width: columnWidths.createdAt` |
| 액션 | 고정 64px | `width: columnWidths.actions` |
| 이름 | 가변 | `flex: 1` 또는 `flex: 1, minWidth: '120px'` |
| 설명 | 가변 (2배) | `flex: 2` |
| IP 주소 | 고정 130px | `width: columnWidths.ip` |
| 숫자 (CPU, RAM) | 고정 80px | `width: columnWidths.cpu` |

### 정렬 아이콘 고려

정렬 가능한(sortable) 컬럼은 아이콘 공간 (~16px)이 필요합니다.

```tsx
// ❌ 잘못된 예: 텍스트가 잘릴 수 있음
{ key: 'vcpu', label: 'vCPU', width: '50px', sortable: true }

// ✅ 올바른 예: 아이콘 공간 포함
{ key: 'vcpu', label: 'vCPU', width: columnWidths.vcpu, sortable: true } // 80px
```

### 총 너비 계산

**규칙**: 고정 너비 합계가 800px를 초과하면 오버플로우 위험

```tsx
// 예: 10개 컬럼 테이블
const fixedTotal = 40 + 64 + 140 + 64; // 308px (체크박스, 상태, 날짜, 액션)
const remaining = '100% - 308px'; // 나머지는 flex 컬럼이 분배
```

---

## 테이블 유형별 권장 패턴

### 패턴 1: 기본 목록 (5~7개 컬럼)

```tsx
const columns = [
  { key: 'select', width: columnWidths.select },
  { key: 'status', width: columnWidths.status },
  { key: 'name', flex: 1 },
  { key: 'type', width: columnWidths.type },
  { key: 'createdAt', width: columnWidths.createdAt },
  { key: 'actions', width: columnWidths.actions },
];
```

### 패턴 2: 리소스 목록 (8~10개 컬럼)

```tsx
const columns = [
  { key: 'select', width: columnWidths.select },
  { key: 'status', width: columnWidths.status },
  { key: 'name', flex: 1, minWidth: '120px' },
  { key: 'cpu', width: '64px' },
  { key: 'ram', width: '64px' },
  { key: 'disk', width: '64px' },
  { key: 'ip', flex: 1, minWidth: '100px' },
  { key: 'createdAt', width: columnWidths.createdAt },
  { key: 'actions', width: columnWidths.actions },
];
```

### 패턴 3: 상세 목록 (10개+ 컬럼)

```tsx
const columns = [
  { key: 'select', width: columnWidths.select },
  { key: 'status', width: columnWidths.status },
  { key: 'name', flex: 1, minWidth: '100px' },
  { key: 'namespace', flex: 1, minWidth: '80px' },
  { key: 'type', width: '80px' },
  { key: 'cpu', width: '56px' },
  { key: 'ram', width: '56px' },
  { key: 'age', width: '100px' },
  { key: 'actions', width: columnWidths.actions },
];

// 팁: 리소스 컬럼(cpu, ram 등)은 최소화하고, 텍스트 컬럼은 flex 사용
```

### 패턴 4: 이벤트/로그 테이블

```tsx
const columns = [
  { key: 'reason', flex: 1, minWidth: '80px' },
  { key: 'object', flex: 1, minWidth: '80px' },
  { key: 'message', flex: 2, minWidth: '100px' },
  { key: 'firstSeen', width: columnWidths.firstSeen },
  { key: 'lastSeen', width: columnWidths.lastSeen },
  { key: 'count', width: columnWidths.count },
];

// 팁: 메시지 컬럼은 flex: 2로 더 많은 공간 할당
```

---

## 문제 해결

### 1. 컬럼이 테이블 밖으로 벗어남 (Overflow)

**원인**: 고정 너비 합계가 너무 큼

**해결**:
```tsx
// ❌ 문제: 모든 컬럼이 고정 너비
{ key: 'name', width: '180px' },
{ key: 'ip', width: '130px' },

// ✅ 해결: 일부 컬럼을 flex로 변경
{ key: 'name', flex: 1, minWidth: '120px' },
{ key: 'ip', flex: 1, minWidth: '100px' },
```

### 2. 헤더 텍스트가 잘림 (Truncation)

**원인**: 컬럼 너비가 텍스트보다 좁음

**해결**:
```tsx
// ❌ 문제: 'vCPU' + 정렬 아이콘에 50px 부족
{ key: 'vcpu', label: 'vCPU', width: '50px', sortable: true }

// ✅ 해결: 80px로 증가 (텍스트 ~45px + 아이콘 ~16px + 여백)
{ key: 'vcpu', label: 'vCPU', width: columnWidths.vcpu, sortable: true }
```

### 3. 셀 내용이 잘림

**원인**: 내용이 컬럼 너비를 초과

**해결 옵션**:

```tsx
// 옵션 1: 너비 증가
{ key: 'fingerprint', width: columnWidths.fingerprint } // 360px

// 옵션 2: flex 사용
{ key: 'description', flex: 1 }

// 옵션 3: 툴팁 추가 (render 함수에서)
{
  key: 'description',
  width: '200px',
  render: (value) => (
    <Tooltip content={value}>
      <span className="truncate">{value}</span>
    </Tooltip>
  )
}
```

### 4. 반응형 대응

```tsx
// 화면이 좁아질 때 자연스럽게 축소되는 패턴
const columns = [
  { key: 'select', width: columnWidths.select },       // 항상 40px
  { key: 'status', width: columnWidths.status },       // 항상 64px
  { key: 'name', flex: 2, minWidth: '100px' },         // 최소 100px, 비율 2
  { key: 'type', flex: 1, minWidth: '60px' },          // 최소 60px, 비율 1
  { key: 'actions', width: columnWidths.actions },     // 항상 64px
];
```

---

## 프로덕션 적용 가이드

### 1. 현황 파악

1. 적용 대상 테이블 목록 확인
2. 각 테이블의 컬럼 수 파악
3. 현재 하드코딩된 너비 값 수집

### 2. 매핑 확인

[column-width-mapping.md](./column-width-mapping.md) 참조:
- ✅ 프리셋에 존재하는 키
- ⚠️ 키 불일치 (별칭 사용 필요)
- ❌ 프리셋에 없음 (추가 필요)

### 3. 적용 순서

```
1. Import 추가
   import { columnWidths } from '@/design-system';

2. 하드코딩 값을 프리셋으로 교체
   width: '64px'  →  width: columnWidths.status

3. 8개+ 컬럼 테이블은 flex + minWidth 적용
   width: '180px'  →  flex: 1, minWidth: '120px'

4. 브라우저에서 확인
   - 오버플로우 없는지
   - 헤더 텍스트 잘림 없는지
   - 최소 너비에서도 정상 표시되는지
```

### 4. 키 불일치 처리

```tsx
// 옵션 1: 프리셋 별칭 사용
{ key: 'action', width: columnWidths.action }  // action은 actions의 별칭

// 옵션 2: 코드에서 키 통일 (권장)
{ key: 'actions', width: columnWidths.actions }
```

### 5. 새 컬럼 추가 시

1. `columnWidths.ts`에 프리셋 추가
2. 카테고리에 맞는 섹션에 배치
3. 기존 유사 컬럼과 일관된 너비 사용

```tsx
// columnWidths.ts
export const columnWidths = {
  // ...
  // 새 컬럼 추가
  newColumn: '120px',
};
```

---

## 빠른 참조

### 자주 사용하는 프리셋

| 키 | 너비 | 용도 |
|----|------|------|
| `select` | 40px | 체크박스 |
| `status` | 64px | 상태 뱃지 |
| `actions` | 64px | 액션 버튼 |
| `name` | 180px | 이름 (또는 flex: 1) |
| `createdAt` | 140px | 생성일시 |
| `cpu` / `vcpu` | 80px | CPU 리소스 |
| `ram` | 80px | 메모리 |
| `ip` / `fixedIp` | 130px | IP 주소 |
| `namespace` | 120px | 네임스페이스 |

### 너비 범위 가이드

| 범위 | 용도 |
|------|------|
| 40px | 아이콘, 체크박스 |
| 60~80px | 짧은 숫자, 상태 |
| 100~120px | 짧은 텍스트, 날짜 |
| 130~150px | IP, 중간 텍스트 |
| 180~200px | 이름, 설명 |
| 300px+ | 긴 텍스트, 라벨 |
| flex: 1 | 가변 길이 컨텐츠 |

---

## 관련 문서

- [컬럼 너비 매핑표](./column-width-mapping.md) - 전체 테이블별 매핑 현황
- [디자인 시스템](../DESIGN_SYSTEM.md) - TDS 컴포넌트 가이드
