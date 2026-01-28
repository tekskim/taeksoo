# 테이블 스타일 가이드

> **버전**: 1.0  
> **최종 업데이트**: 2026-01-27  
> **대상**: 프로덕션 프론트엔드 개발팀

---

## 목차

1. [개요](#1-개요)
2. [컬럼 너비 정책](#2-컬럼-너비-정책)
3. [행 높이 정책](#3-행-높이-정책)
4. [컬럼 정렬 정책](#4-컬럼-정렬-정책)
5. [텍스트 처리 정책](#5-텍스트-처리-정책)
6. [thaki-ui와의 비교](#6-thaki-ui와의-비교)
7. [마이그레이션 가이드](#7-마이그레이션-가이드)
8. [FAQ](#8-faq)

---

## 1. 개요

이 문서는 TDS(THAKI Design System)의 테이블 컴포넌트 스타일링에 대한 통합 가이드입니다.

### 적용 대상

- 모든 리스트 페이지 테이블
- 상세 페이지 내 탭 테이블
- 모달/Drawer 내 테이블
- Wizard 단계 내 테이블

### 핵심 원칙

| 영역 | 원칙 |
|------|------|
| **너비** | 고정 컬럼(아이콘/버튼)과 유연 컬럼(텍스트) 이원화 |
| **높이** | 기본 48px, 밀집 레이아웃 40px |
| **텍스트** | 단일행 + truncate + 툴팁 패턴 |

---

## 2. 컬럼 너비 정책

### 2.1 컬럼 이원화

| 분류 | 설명 | 사용법 |
|------|------|--------|
| **완전 고정 컬럼** | 아이콘/버튼만 표시, 크기 불변 | `width: fixedColumns.xxx` |
| **유연 컬럼** | 텍스트/데이터 표시, 공간에 따라 확장 | `flex: 1, minWidth: columnMinWidths.xxx` |

### 2.2 Import

```typescript
import { fixedColumns, columnMinWidths } from '@/design-system';
```

### 2.3 완전 고정 컬럼 (`fixedColumns`)

아이콘이나 버튼만 표시되어 **크기가 변할 필요 없는** 컬럼

| 키 | 너비 | 용도 | 예시 |
|----|------|------|------|
| `status` | 64px | 상태 아이콘 | `StatusIndicator` |
| `select` | 40px | 선택 체크박스 | `Checkbox` |
| `checkbox` | 40px | 체크박스 | `Checkbox` |
| `radio` | 40px | 라디오 버튼 | `Radio` |
| `favorite` | 40px | 즐겨찾기 아이콘 | `IconStar` |
| `locked` | 64px | 잠금 아이콘 | `IconLock` |
| `actions` | 64px | 액션 메뉴 | `ContextMenu` |
| `action` | 64px | 액션 메뉴 (단수) | `ContextMenu` |
| `actionWide` | 72px | 액션 메뉴 (넓은 버전) | - |
| `identify` | 80px | 식별 버튼 | Identify 버튼 |

### 2.4 유연 컬럼 (`columnMinWidths`)

텍스트나 데이터를 표시하며 **공간에 따라 늘어나야 하는** 컬럼

| 카테고리 | 키 | minWidth | 용도 |
|----------|-----|----------|------|
| **이름/식별자** | `name` | 180px | 리소스 이름 |
| | `nameLg` | 240px | 긴 리소스 이름 |
| | `hostname` | 150px | 호스트명 |
| | `username` | 150px | 사용자명 |
| **날짜/시간** | `createdAt` | 140px | 생성일 |
| | `updatedAt` | 140px | 수정일 |
| | `expiresAt` | 120px | 만료일 |
| | `lastSignIn` | 120px | 마지막 로그인 |
| **IP/주소** | `fixedIp` | 130px | 고정 IP |
| | `floatingIp` | 130px | 유동 IP |
| | `ipAddress` | 130px | IP 주소 |
| | `macAddress` | 150px | MAC 주소 |
| | `cidr` | 130px | CIDR 블록 |
| **타입/분류** | `type` | 100px | 유형 |
| | `category` | 140px | 카테고리 |
| | `protocol` | 90px | 프로토콜 |
| **리소스** | `cpu` | 80px | CPU |
| | `vcpu` | 80px | vCPU |
| | `ram` | 80px | RAM |
| | `disk` | 80px | 디스크 |
| | `size` | 100px | 크기 |
| **기타** | `description` | 200px | 설명 |
| | `role` | 100px | 역할 |
| | `mfa` | 80px | MFA 상태 |

### 2.5 장점

1. **여백 문제 해결**: 어떤 컬럼을 숨겨도 남은 flex 컬럼들이 공간을 채움
2. **최소 가독성 보장**: `minWidth`로 컬럼이 너무 좁아지는 것 방지
3. **일관성**: 고정 컬럼(status, actions)은 항상 동일한 크기 유지

### 2.6 가로 스크롤 정책

#### 발생 조건

테이블에 가로 스크롤이 발생하는 조건:

```
(고정 컬럼들의 width 합) + (유연 컬럼들의 minWidth 합) > 컨테이너 너비
```

#### 예시

```typescript
// 컬럼 너비 합계 예시
// status(64) + name(180) + ip(130) + createdAt(140) + actions(64) = 578px
// → 컨테이너가 578px보다 좁으면 가로 스크롤 발생
```

#### 의도된 동작

| 상황 | 가로 스크롤 없음 | 가로 스크롤 있음 |
|-----|----------------|----------------|
| 결과 | 컬럼이 과도하게 좁아짐 | minWidth 보장 |
| 가독성 | ❌ truncate 과다 | ✅ 최소 가독성 유지 |
| UX | 텍스트 읽기 어려움 | 스크롤로 전체 확인 가능 |

**minWidth가 없으면:**
```
| status | ins... | 192... | 2026... | ⋮ |  ← 내용 알아볼 수 없음
```

**minWidth가 있으면 (가로 스크롤 발생):**
```
| status | instance-name-lo... | 192.168.1.10 | 2026-01-27 | ⋮ |
                                             [← 스크롤 →]
```

#### 테이블 컨테이너

Table 컴포넌트는 자동으로 `overflow-x-auto`가 적용되어 있어 가로 스크롤을 지원합니다.

```typescript
// Table 컨테이너 기본 스타일
<div className="overflow-x-auto">
  <table>...</table>
</div>
```

---

## 3. 행 높이 정책

### 3.1 기본 규칙

| 용도 | 높이 | `rowHeight` prop |
|------|------|------------------|
| **기본 테이블** | 48px | 생략 (기본값) |
| **밀집 테이블** | 40px | `rowHeight="40px"` |

### 3.2 사용 기준

#### 기본 높이 (48px) 사용

- 메인 리스트 페이지 (InstanceListPage, VolumesPage 등)
- 데이터가 많지 않은 테이블
- 가독성이 중요한 테이블

```typescript
<Table columns={columns} data={data} rowKey="id" />
```

#### 밀집 높이 (40px) 사용

- 설정 페이지 내 테이블
- 모니터링/대시보드 테이블
- 공간이 제한된 영역의 테이블

```typescript
<Table columns={columns} data={data} rowKey="id" rowHeight="40px" />
```

### 3.3 CSS 변수

테이블은 내부적으로 `--table-row-height` CSS 변수를 사용합니다:

```css
/* 기본값 */
--table-row-height: 48px;

/* rowHeight prop 전달 시 자동 적용 */
--table-row-height: 40px;
```

### 3.4 예시

```typescript
// 기본 리스트 페이지 - 48px
<Table columns={instanceColumns} data={instances} rowKey="id" />

// 설정 페이지 테이블 - 40px
<Table columns={settingsColumns} data={settings} rowKey="id" rowHeight="40px" />

// 모니터링 대시보드 테이블 - 40px
<Table columns={metricsColumns} data={metrics} rowKey="id" rowHeight="40px" />
```

---

## 4. 컬럼 정렬 정책

### 4.1 정렬 유형

| 정렬 | 적용 대상 | 예시 컬럼 |
|-----|----------|----------|
| **중앙** | 고정 너비 컬럼 (아이콘/버튼) | `status`, `locked`, `actions`, `select`, `checkbox` |
| **왼쪽** | 유연 컬럼 (텍스트/데이터) - 기본값 | `name`, `description`, `type`, `count` |
| **오른쪽** | 연관 리소스 표시 | `attachedTo`, `associatedTo` |

### 4.2 적용 규칙

1. **고정 컬럼은 중앙 정렬**
   - `fixedColumns`에 정의된 모든 컬럼은 `align: 'center'` 적용
   - 아이콘, 버튼, 체크박스 등 시각적 요소가 셀 중앙에 위치

2. **유연 컬럼은 왼쪽 정렬 (기본값)**
   - 텍스트, 숫자 등 데이터 컬럼은 명시적 설정 불필요
   - 숫자 컬럼도 왼쪽 정렬 사용 (일관성 유지)

3. **오른쪽 정렬은 특수 케이스만**
   - 연관 리소스 참조 컬럼에만 사용

### 4.3 코드 예시

```typescript
// 고정 컬럼 - 중앙 정렬
{ key: 'status', label: 'Status', width: fixedColumns.status, align: 'center' }
{ key: 'locked', label: 'Locked', width: fixedColumns.locked, align: 'center' }
{ key: 'actions', label: 'Action', width: fixedColumns.actions, align: 'center' }

// 유연 컬럼 - 왼쪽 정렬 (기본값, 명시 불필요)
{ key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.name }
{ key: 'count', label: 'Count', flex: 1, minWidth: columnMinWidths.count }

// 연관 리소스 - 오른쪽 정렬
{ key: 'attachedTo', label: 'Attached to', flex: 1, align: 'right' }
```

---

## 5. 텍스트 처리 정책

### 5.1 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **단일행 유지** | 테이블 셀은 항상 한 줄로 표시 (서브텍스트 패턴 제외) |
| **Truncate 적용** | minWidth 내에서 긴 텍스트는 말줄임표(...)로 잘림 |
| **툴팁 제공** | 잘린 텍스트는 hover 시 전체 내용 표시 |
| **서브텍스트 패턴** | 이름 + ID 조합 시 ID를 작은 서브텍스트로 표시 (2줄 허용) |

### 5.2 텍스트 잘림 처리

#### 기본 동작

Table 컴포넌트는 기본적으로 셀 내용에 `truncate` 클래스를 적용합니다:

```typescript
// Table.tsx 내부
<span className="truncate w-full">
  {row[column.key]}
</span>
```

#### 커스텀 render 시 처리

`render` 함수를 사용할 때는 직접 truncate 처리를 해야 합니다:

```typescript
// ✅ 올바른 패턴
{
  key: 'name',
  label: 'Name',
  flex: 1,
  minWidth: columnMinWidths.name,
  render: (_, row) => (
    <span className="truncate" title={row.name}>
      {row.name}
    </span>
  ),
}

// ✅ 링크에 truncate 적용
{
  key: 'name',
  label: 'Name',
  flex: 1,
  minWidth: columnMinWidths.name,
  render: (_, row) => (
    <Link 
      to={`/items/${row.id}`}
      className="text-[var(--color-action-primary)] hover:underline truncate block"
      title={row.name}
    >
      {row.name}
    </Link>
  ),
}
```

### 5.3 줄바꿈 방지

테이블 셀에서 줄바꿈을 방지하려면 `whitespace-nowrap`을 사용합니다:

```typescript
// 날짜/시간 표시
{
  key: 'createdAt',
  label: 'Created at',
  flex: 1,
  minWidth: columnMinWidths.createdAt,
  render: (_, row) => (
    <span className="whitespace-nowrap">{formatDate(row.createdAt)}</span>
  ),
}
```

### 5.4 Truncate 클래스 정의

```css
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 5.5 복합 셀 처리

여러 요소가 있는 셀에서의 truncate 처리:

```typescript
// 이름 + 서브텍스트 조합
{
  key: 'name',
  label: 'Name',
  flex: 1,
  minWidth: columnMinWidths.name,
  render: (_, row) => (
    <div className="flex flex-col min-w-0">
      <span 
        className="font-medium text-[var(--color-action-primary)] hover:underline truncate"
        title={row.name}
      >
        {row.name}
      </span>
      <span 
        className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] truncate"
        title={row.id}
      >
        {row.id}
      </span>
    </div>
  ),
}
```

### 5.6 Tooltip과 함께 사용

긴 텍스트에 대한 상세 정보 표시:

```typescript
import { Tooltip } from '@/design-system';

// 툴팁과 truncate 조합
{
  key: 'description',
  label: 'Description',
  flex: 1,
  minWidth: columnMinWidths.description,
  render: (_, row) => (
    <Tooltip content={row.description} placement="top">
      <span className="truncate block">{row.description}</span>
    </Tooltip>
  ),
}
```

### 5.7 금지 패턴

```typescript
// ❌ 줄바꿈 허용 (테이블 행 높이가 깨짐)
{
  render: (_, row) => (
    <span className="whitespace-pre-wrap">{row.description}</span>
  ),
}

// ❌ line-clamp 사용 (여러 줄 표시)
{
  render: (_, row) => (
    <span className="line-clamp-2">{row.description}</span>
  ),
}

// ❌ min-w-0 없이 flex 컨테이너 사용 (truncate 안 됨)
{
  render: (_, row) => (
    <div className="flex flex-col">  {/* min-w-0 필요! */}
      <span className="truncate">{row.name}</span>
    </div>
  ),
}
```

---

## 6. thaki-ui와의 비교

### 6.1 컬럼 사이징 방식 비교

| 항목 | TDS (SSOT) | thaki-ui |
|-----|------------|----------|
| **사이징 방식** | `flex` + `minWidth` 조합 | `width` 고정값만 사용 |
| **고정 컬럼** | `width: fixedColumns.xxx` | `width: 60` 등 하드코딩 |
| **유연 컬럼** | `flex: 1, minWidth: columnMinWidths.xxx` | `width` 없으면 자동 분배 |
| **테이블 레이아웃** | flexbox 기반 | `table-fixed` (CSS table) |
| **minWidth 지원** | ✅ 지원 | ❌ 미지원 |
| **maxWidth 지원** | ✅ 지원 | ❌ 미지원 |

### 6.2 컬럼 정의 비교

**TDS (SSOT)**
```typescript
const columns: TableColumn[] = [
  { key: 'status', width: fixedColumns.status, align: 'center' },
  { key: 'name', flex: 1, minWidth: columnMinWidths.name },
  { key: 'createdAt', flex: 1, minWidth: columnMinWidths.createdAt },
  { key: 'actions', width: fixedColumns.actions, align: 'center' },
];
```

**thaki-ui**
```typescript
const columns: TableColumn[] = [
  { key: 'status', width: 60, align: 'center' },
  { key: 'username' },  // width 없음 → 자동 분배
  { key: 'groups' },
  { key: 'actions', width: 80, align: 'center' },
];
```

### 6.3 thaki-ui의 문제점과 TDS 해결책

| 문제 | thaki-ui | TDS 해결책 |
|-----|----------|-----------|
| **minWidth 미지원** | 컬럼이 과도하게 좁아질 수 있음 | `minWidth`로 최소 너비 보장 |
| **비율 제어 불가** | 자동 균등 분배만 가능 | `flex` 값으로 비율 조정 가능 |
| **값 일관성** | 하드코딩된 값 분산 | 중앙 프리셋으로 일관성 보장 |
| **가로 스크롤 정책** | 고정 `min-w-[600px]` | 컬럼 합계 기반 동적 스크롤 |

#### 문제 1: 좁은 화면에서 내용 잘림

**thaki-ui**
```
| st... | use... | gro... | act... |
  ↑       ↑        ↑
  minWidth가 없어 과도하게 축소됨
```

**TDS 해결책**
```
| status | username(min:150px) | groups(min:100px) | actions |
                 ↑                     ↑
           minWidth 보장 → 가로 스크롤 발생
```

#### 문제 2: 비율 제어 불가

**thaki-ui** - 자동 균등 분배만 가능
```typescript
{ key: 'name' }      // 1/3
{ key: 'email' }     // 1/3  
{ key: 'role' }      // 1/3
```

**TDS** - flex로 비율 제어 가능
```typescript
{ key: 'name', flex: 2, minWidth: '180px' }   // 2/4 (더 넓게)
{ key: 'email', flex: 1, minWidth: '150px' }  // 1/4
{ key: 'role', flex: 1, minWidth: '100px' }   // 1/4
```

#### 문제 3: 하드코딩된 값

**thaki-ui** - 여러 파일에 분산
```typescript
// UsersListPage.tsx
{ key: 'status', width: 60 }
// GroupsListPage.tsx
{ key: 'status', width: 64 }  // 불일치!
```

**TDS** - 중앙 프리셋
```typescript
import { fixedColumns } from '@/design-system';
{ key: 'status', width: fixedColumns.status }  // 항상 64px
```

---

## 7. 마이그레이션 가이드

### 7.1 Import 변경

```diff
- import { columnWidths } from '@/design-system';
+ import { fixedColumns, columnMinWidths } from '@/design-system';
```

### 7.2 고정 컬럼 변환

아이콘/버튼 컬럼은 `columnWidths` → `fixedColumns`로 변경:

```diff
  {
    key: 'status',
    label: 'Status',
-   width: columnWidths.status,
+   width: fixedColumns.status,
    align: 'center',
    render: (_, row) => <StatusIndicator status={row.status} layout="icon-only" />,
  },
```

### 7.3 유연 컬럼 변환

텍스트/데이터 컬럼은 `width` → `flex + minWidth`로 변경:

```diff
  {
    key: 'createdAt',
    label: 'Created at',
-   width: columnWidths.createdAt,
+   flex: 1,
+   minWidth: columnMinWidths.createdAt,
    sortable: true,
  },
```

### 7.4 기존 flex 컬럼에 minWidth 추가

```diff
  {
    key: 'name',
    label: 'Name',
    flex: 1,
-   minWidth: '140px',  // 하드코딩
+   minWidth: columnMinWidths.name,  // 프리셋 사용
  },
```

### 7.5 render 함수에 truncate 추가

```diff
  {
    key: 'name',
    render: (_, row) => (
-     <Link to={`/items/${row.id}`}>
+     <Link to={`/items/${row.id}`} className="truncate block" title={row.name}>
        {row.name}
      </Link>
    ),
  },
```

### 7.6 복합 셀에 min-w-0 추가

```diff
  {
    key: 'name',
    render: (_, row) => (
-     <div className="flex flex-col">
+     <div className="flex flex-col min-w-0">
        <span className="truncate">{row.name}</span>
        <span className="truncate text-[var(--color-text-subtle)]">{row.id}</span>
      </div>
    ),
  },
```

---

## 8. FAQ

### Q: 기존 `columnWidths`를 계속 사용해도 되나요?

A: 레거시 호환을 위해 `columnWidths`는 여전히 export됩니다. 하지만 **deprecated**이며, 새 코드에서는 `fixedColumns`와 `columnMinWidths`를 사용해야 합니다.

### Q: `minWidth` 값이 프리셋에 없는 경우는?

A: 가장 유사한 프리셋을 사용하거나, 직접 값을 지정할 수 있습니다:

```typescript
// 프리셋 사용 (권장)
{ key: 'customField', flex: 1, minWidth: columnMinWidths.name }

// 직접 지정 (프리셋이 없는 경우)
{ key: 'veryCustomField', flex: 1, minWidth: '120px' }
```

### Q: `flex` 값을 1이 아닌 다른 값으로 설정해도 되나요?

A: 네, 특정 컬럼에 더 많은 공간을 할당하려면 `flex: 2` 등을 사용할 수 있습니다:

```typescript
{ key: 'description', flex: 2, minWidth: columnMinWidths.description }  // 2배 공간
{ key: 'type', flex: 1, minWidth: columnMinWidths.type }  // 1배 공간
```

### Q: 테이블 셀에서 여러 줄을 표시해야 하는 경우는?

A: 테이블 셀은 항상 단일행이어야 합니다. 여러 줄이 필요한 경우:
- **Drawer**나 **Modal**로 상세 정보 표시
- **Tooltip**으로 전체 내용 표시
- 상세 페이지로 이동하는 링크 제공

### Q: rowHeight를 40px 이외의 값으로 설정해도 되나요?

A: 가능하지만, 디자인 일관성을 위해 **48px(기본) 또는 40px(밀집)**만 사용하는 것을 권장합니다.

### Q: truncate가 적용되지 않는 이유는?

A: 다음 사항을 확인하세요:
1. 부모 컨테이너에 `min-w-0` 클래스가 있는지
2. flex 컨테이너 내부인 경우 `min-w-0`이 필요
3. `truncate` 클래스가 실제 텍스트를 감싸는 요소에 있는지

```typescript
// ❌ truncate 안 됨
<div className="flex flex-col">
  <span className="truncate">{text}</span>
</div>

// ✅ truncate 됨
<div className="flex flex-col min-w-0">
  <span className="truncate">{text}</span>
</div>
```

---

## 부록: 프리셋 전체 목록

### A. fixedColumns

```typescript
export const fixedColumns = {
  select: '40px',
  checkbox: '40px',
  radio: '40px',
  favorite: '40px',
  status: '64px',
  locked: '64px',
  actions: '64px',
  action: '64px',
  actionWide: '72px',
  identify: '80px',
} as const;
```

### B. columnMinWidths (주요 항목)

```typescript
export const columnMinWidths = {
  // 이름/식별자
  name: '180px',
  nameLg: '240px',
  hostname: '150px',
  username: '150px',
  
  // 날짜/시간
  createdAt: '140px',
  updatedAt: '140px',
  expiresAt: '120px',
  lastSignIn: '120px',
  
  // IP/주소
  fixedIp: '130px',
  floatingIp: '130px',
  ipAddress: '130px',
  macAddress: '150px',
  cidr: '130px',
  
  // 타입/분류
  type: '100px',
  category: '140px',
  protocol: '90px',
  
  // 리소스
  cpu: '80px',
  vcpu: '80px',
  ram: '80px',
  disk: '80px',
  size: '100px',
  
  // 기타
  description: '200px',
  role: '100px',
  mfa: '80px',
  // ... (전체 목록은 columnWidths.ts 참조)
} as const;
```

### C. 행 높이

| 타입 | 값 | 사용 |
|------|-----|------|
| 기본 | 48px | `rowHeight` 생략 |
| 밀집 | 40px | `rowHeight="40px"` |

---

## 체크리스트

새 테이블 구현 시 확인 사항:

- [ ] `fixedColumns`, `columnMinWidths` import 확인
- [ ] 아이콘/버튼 컬럼에 `width: fixedColumns.xxx` 적용
- [ ] 텍스트 컬럼에 `flex: 1, minWidth: columnMinWidths.xxx` 적용
- [ ] 상세 페이지/모달 테이블에 `rowHeight="40px"` 적용
- [ ] 커스텀 render 함수에 `truncate` 클래스 적용
- [ ] 복합 셀에 `min-w-0` 클래스 적용
- [ ] 긴 텍스트에 `title` 속성 또는 `Tooltip` 적용
- [ ] 날짜/시간에 `whitespace-nowrap` 적용

---

## 문의

질문이나 피드백은 디자인 시스템 팀에 문의해 주세요.
