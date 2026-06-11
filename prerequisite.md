# Planning Mockup — Claude Code Guide

이 프로젝트는 **Thaki Design System(TDS)** 컴포넌트를 사용하는 제품 목업 프로젝트입니다.
새 페이지·기능을 구현하기 전에 반드시 아래 규칙을 따르세요.

---

## TDS 컴포넌트 우선 원칙

**절대 원칙: 직접 HTML 태그(`<table>`, `<input>`, `<select>` 등)로 UI를 구현하지 말 것.**
항상 `@/design-system`에서 TDS 컴포넌트를 import하여 사용한다.

### TDS SSOT 레포지토리

정책 문서 및 스타일 가이드: `/Users/taeksoo.kim/workspace/thakicloud/tds_ssot/`

- `TABLE_STYLE_GUIDE.md` — 테이블 컬럼 너비 정책 (fixedColumns / columnMinWidths 패턴)
- `DESIGN_SYSTEM.md` — 타이포그래피, 색상, 간격 토큰 정리

목업 작업 전 반드시 이 문서들을 참조할 것.

### 컴포넌트 확인 순서

1. `src/design-system/components/` — 이 프로젝트의 TDS 구현체 (소스 of truth)
2. `/Users/taeksoo.kim/workspace/thakicloud/tds_ssot/` — TDS SSOT 정책/스타일 가이드
3. 각 컴포넌트 폴더의 `*.stories.tsx` — 사용 예시와 props 문서
4. 같은 패턴을 이미 구현한 다른 페이지 (`FlavorsPage`, `KeyPairsPage`, `DatasourcePage` 등) 참조

---

## 페이지 레이아웃 패턴

```
PageShell
  └─ sidebar: AlertSidebar
  └─ tabBar: TabBar
  └─ topBar: TopBar (breadcrumb 포함)
  └─ content:
       VStack gap={4}
         PageHeader (title + actions)
         [탭: HStack border-b 또는 TDS Tabs]
         ListToolbar          ← 필터/검색 영역
         Pagination           ← 테이블 상단 좌측
         Table<T>             ← TDS Table 컴포넌트
```

---

## 컴포넌트별 사용 규칙

### ListToolbar + FilterSearchInput (리스트 검색/필터)

```tsx
import { ListToolbar, FilterSearchInput, type AppliedFilter } from '@/design-system';

const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

<ListToolbar
  primaryActions={
    <ListToolbar.Actions>
      <FilterSearchInput
        size="sm"
        filters={[
          { id: 'status', label: 'Status', type: 'select', options: [...] },
          { id: 'name',   label: 'Name',   type: 'text', placeholder: '...' },
        ]}
        appliedFilters={appliedFilters}
        onFiltersChange={(next) => { setAppliedFilters(next); setPage(1); }}
        placeholder="Search by attributes"
        className="w-[var(--search-input-width)]"   // 항상 고정폭 (280px)
      />
    </ListToolbar.Actions>
  }
/>
```

- `fullWidth` 사용 금지 — 항상 `className="w-[var(--search-input-width)]"`
- `SearchInput` + `Select` 조합 사용 금지 — `FilterSearchInput` 단일 컴포넌트로 통합
- 필터 칩은 `FilterSearchInput` 내부에서 자동 렌더링됨 (`hideAppliedFilters` 불필요)

### Table (목록 테이블)

**컬럼 너비 정책** — 하드코딩된 `width` 값 절대 금지. 반드시 `fixedColumns`/`columnMinWidths` 프리셋 사용.

| 컬럼 유형             | 패턴                                     | 예시                                                                                            |
| --------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 아이콘/뱃지 고정 컬럼 | `width: fixedColumns.xxx`                | `fixedColumns.status` (64px), `fixedColumns.statusLabel` (120px), `fixedColumns.actions` (64px) |
| 텍스트 유연 컬럼      | `flex: 1, minWidth: columnMinWidths.xxx` | `columnMinWidths.name` (180px), `columnMinWidths.createdAt` (140px)                             |

- 고정 컬럼에는 항상 `align: 'center'` 추가
- 유연 컬럼의 `render`에서 긴 텍스트에는 `truncate` + `min-w-0` 적용

```tsx
import { Table, type TableColumn, fixedColumns, columnMinWidths } from '@/design-system';

const columns: TableColumn<Row>[] = [
  { key: 'state',   label: 'State',  width: fixedColumns.statusLabel, align: 'center', resizable: false, render: (_, row) => <Badge /> },
  { key: 'name',    label: 'Name',   flex: 1, minWidth: columnMinWidths.name, render: (_, row) => <span className="truncate">{row.name}</span> },
  { key: 'created', label: 'Created', flex: 1, minWidth: columnMinWidths.createdAt, render: (_, row) => <span>{row.created}</span> },
  { key: '_action', label: '',       width: fixedColumns.actions, align: 'center', resizable: false, render: (_, row) => <ContextMenu ... /> },
];

<Table<Row>
  columns={columns}
  data={pagedRows}
  rowKey="id"
  onRowClick={(row) => navigate(`/path/${row.id}`)}
  resizable={false}
  emptyMessage="No items to display."
/>
```

- `<table>` 직접 사용 금지 (Delivery Settings 테이블도 추후 `Table<T>`로 전환 필요)
- Action 열: `ContextMenu` + `IconDotsVertical` 패턴
- 행 클릭 → 상세 페이지 이동: `onRowClick`

### Pagination (페이지네이션)

```tsx
<Pagination
  currentPage={safePage}
  totalPages={totalPages}
  onPageChange={setPage}
  totalItems={filteredItems.length} // "n items" 자동 표시
/>
```

- 위치: `ListToolbar` 아래, `Table` 위 (테이블 좌측 상단)
- `totalItems` 필수 — 오른쪽에 "n items" 표시

### DetailHeader (상세 페이지 헤더)

```tsx
import { DetailHeader } from '@/design-system';

<DetailHeader>
  <DetailHeader.Title>{name}</DetailHeader.Title>
  <DetailHeader.Actions>
    <Button>Action</Button>
  </DetailHeader.Actions>
  <DetailHeader.InfoGrid>
    <DetailHeader.InfoCard label="State" value={<StateBadge />} />
    <DetailHeader.InfoCard label="Severity" value={<SeverityBadge />} />
    {/* 최대 9개 권장 (3×3 레이아웃) */}
  </DetailHeader.InfoGrid>
</DetailHeader>;
```

- 수동 헤더 + `<dl>` 패턴 사용 금지
- 상세 페이지 상단에는 항상 `DetailHeader` 사용

### Tabs (탭 내비게이션)

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@/design-system';

<Tabs value={activeTab} onChange={setActiveTab}>
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="timeline">Timeline</Tab>
  </TabList>
  <TabPanel value="overview">...</TabPanel>
  <TabPanel value="timeline">...</TabPanel>
</Tabs>;
```

- 탭 레이블에 `(n)` 카운트 표시 금지
- 하드코딩 border-b 탭 대신 TDS `Tabs` 사용

### Drawer (슬라이드 패널)

```tsx
import { Drawer } from '@/design-system';

<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Title"
  description="Optional subtitle"
  width={400}
  footer={
    <HStack gap={2} className="w-full">
      <Button variant="secondary" className="flex-1">
        Cancel
      </Button>
      <Button variant="primary" className="flex-1">
        Save
      </Button>
    </HStack>
  }
>
  {/* form content */}
</Drawer>;
```

---

## Delivery Settings 테이블 TODO

현재 `<table>` HTML을 직접 사용 중 — 추후 `Table<DeliveryRule>` TDS 컴포넌트로 전환 필요.

---

## 참조 페이지 (패턴 예시)

| 패턴                                            | 참조 파일                             |
| ----------------------------------------------- | ------------------------------------- |
| ListToolbar + FilterSearch + Table + Pagination | `FlavorsPage.tsx`, `KeyPairsPage.tsx` |
| DetailHeader + Tabs                             | `AlertDetailPage.tsx`                 |
| Drawer form                                     | `AlertDeliverySettingsPage.tsx`       |
| ContextMenu action column                       | `AlertsListPage.tsx`                  |
