# Legacy Table → TcTable 마이그레이션 가이드

> 실전 코드 기반의 단계별 전환 가이드.
> 왜 전환해야 하는지는 [table-migration-report.md](./table-migration-report.md) 참고.

---

## 목차

1. [임포트 변경](#1-임포트-변경)
2. [컬럼 정의 변환](#2-컬럼-정의-변환)
3. [정렬(Sort) 핸들러](#3-정렬sort-핸들러)
4. [읽기 전용 테이블](#4-읽기-전용-테이블)
5. [선택 가능 테이블](#5-선택-가능-테이블-selectabletable--tctablebody)
6. [확장 가능 테이블](#6-확장-가능-테이블-expandabletable--tctablebody)
7. [셀(Td) 패턴별 전환](#7-셀td-패턴별-전환)
8. [행 클릭 처리](#8-행-클릭-처리)
9. [체크리스트](#9-마이그레이션-체크리스트)

---

## 1. 임포트 변경

```tsx
// Before
import {
  SelectableTable,
  Table,
  type TableColumn,
} from '@thaki/shared';

// After
import { TcTable } from '@thaki/shared';
```

| Legacy | TcTable |
|---|---|
| `Table` | `TcTable.Body` (읽기전용일 때도 동일) |
| `Table.Tr` | `TcTable.Tr` |
| `Table.Td` | `TcTable.Td` |
| `SelectableTable` | `TcTable.Body` + `type="checkbox"` or `type="radio"` |
| `ExpandableTable` | `TcTable.Body` + `expandableUI` |
| `type TableColumn` | 불필요 (삭제) |

---

## 2. 컬럼 정의 변환

Legacy의 `TableColumn[]` 객체 배열 → `string[]` 컬럼명 배열.

```tsx
// Before
const columns: TableColumn[] = [
  { key: 'status', header: t('common.table.status'), width: 60, sortable: false, align: 'center' },
  { key: 'username', header: t('common.table.username'), sortable: true },
  { key: 'actions', header: t('common.table.action'), width: 80, sortable: false, align: 'center' },
];

// After
const columnNames = [
  t('common.table.status'),
  t('common.table.username'),
  t('common.table.action'),
];
```

이전 `TableColumn`의 속성들은 이제 각 `TcTable.Td`에서 직접 제어한다:

| 이전 (`TableColumn`) | 이후 (`TcTable.Td`) |
|---|---|
| `sortable: true` | `<TcTable.Td sortable>` |
| `align: 'center'` | `<TcTable.Td align="center">` |
| `width: 80` | `<TcTable.Td className="w-[80px]">` |
| `clickable: false` | 불필요 (이벤트 핸들러에서 `stopPropagation` 처리) |
| `isEllipsis: false` | 기본 truncate 적용됨; 해제가 필요하면 `className` |

---

## 3. 정렬(Sort) 핸들러

Legacy는 컬럼 `key` 문자열로 정렬을 식별했지만, TcTable은 **컬럼 표시 이름**으로 전달된다.
번역된 컬럼명 → API 정렬 키 매핑이 필요하다.

```tsx
// Before
const handleSortChange = (newSort: string | null, newOrder: 'asc' | 'desc') => {
  if (!newSort) return;
  setSort(newSort);    // 'username', 'createdAt' 등 key 문자열
  setOrder(newOrder);
};

// After
const sortKeyMap = useMemo(
  () => ({
    [t('common.table.username')]: 'username',
    [t('common.table.lastSignIn')]: 'lastSignIn',
    [t('common.table.createdAt')]: 'createdAt',
  }),
  [t]
);

const handleSortChange = useCallback(
  ({ columnName, curr }: { columnName: string; curr: string }) => {
    const apiKey = sortKeyMap[columnName];
    if (!apiKey) return;
    setSort(apiKey);
    setOrder(curr as 'asc' | 'desc');
  },
  [sortKeyMap]
);
```

> `sortKeyMap`에 없는 컬럼은 `sortable` prop이 없으므로 `onSortChange`가 발생하지 않는다.
> Legacy의 `NON_SORTABLE_COLUMNS` 같은 별도 필터 배열은 불필요.

---

## 4. 읽기 전용 테이블

선택(checkbox/radio)이 없는 단순 테이블.

```tsx
// Before
<Table
  isLoading={isLoading}
  columns={columns}
  sort={sort}
  order={order}
  onSortChange={handleSortChange}
  emptyUI={<EmptyUI ... />}
>
  {data.map(item => (
    <Table.Tr key={item.id} rowData={item}>
      <Table.Td rowData={item} column={{ key: 'name' }} preventClickPropagation={false}>
        {item.name}
      </Table.Td>
      <Table.Td rowData={item} column={{ key: 'date' }} preventClickPropagation={false}>
        {formatDate(item.date)}
      </Table.Td>
    </Table.Tr>
  ))}
</Table>

// After
<TcTable.Body
  isLoading={isLoading}
  columnNames={columnNames}
  rowData={data}
  onSortChange={handleSortChange}
  emptyUI={<EmptyUI ... />}
>
  {(item, _helpers) => (
    <TcTable.Tr key={item.id}>
      <TcTable.Td sortable>{item.name}</TcTable.Td>
      <TcTable.Td>{formatDate(item.date)}</TcTable.Td>
    </TcTable.Tr>
  )}
</TcTable.Body>
```

핵심 차이:
- `rowData`를 `TcTable.Body`에 **한 번만** 전달
- 개별 `Td`에 `rowData`, `column`, `preventClickPropagation` 불필요
- render function `(item, helpers) => ...` 패턴

---

## 5. 선택 가능 테이블 (SelectableTable → TcTable.Body)

```tsx
// Before
<SelectableTable
  isLoading={isLoading}
  columns={columns}
  rows={data as unknown as Record<string, unknown>[]}
  selectionType="checkbox"
  selectedRows={selectedRows}
  onRowSelectionChange={setSelectedRows}
  getRowId={(row) => (row as unknown as MyType).id}
  selectOnRowClick={false}
  sort={sort}
  order={order}
  onSortChange={handleSortChange}
  emptyUI={<EmptyUI ... />}
>
  {data.map(item => (
    <Table.Tr key={item.id} rowData={item}>
      <Table.Td rowData={item} column={{ key: 'name' }} preventClickPropagation={false}>
        {item.name}
      </Table.Td>
    </Table.Tr>
  ))}
</SelectableTable>

// After
<TcTable.Body
  isLoading={isLoading}
  columnNames={columnNames}
  rowData={data}
  type="checkbox"
  getSelectValue={(item) => item.id}
  selectedValues={selectedRows}
  onChange={setSelectedRows}
  onSortChange={handleSortChange}
  emptyUI={<EmptyUI ... />}
>
  {(item, { selectCell }) => (
    <TcTable.Tr key={item.id}>
      {selectCell()}
      <TcTable.Td sortable>{item.name}</TcTable.Td>
    </TcTable.Tr>
  )}
</TcTable.Body>
```

| Legacy prop | TcTable prop |
|---|---|
| `selectionType="checkbox"` | `type="checkbox"` |
| `selectedRows` | `selectedValues` |
| `onRowSelectionChange` | `onChange` |
| `getRowId` | `getSelectValue` |
| `rows={data as unknown as ...}` | `rowData={data}` (캐스트 불필요) |

> **중요**: `selectCell()`은 render function의 `helpers`에서 꺼내고, `TcTable.Tr` 안의 **원하는 위치**에 배치한다.

---

## 6. 확장 가능 테이블 (ExpandableTable → TcTable.Body)

`ExpandableTable` → `TcTable.Body` + `expandableUI` prop.

```tsx
// Before
<ExpandableTable
  isLoading={isLoading}
  columns={columns}
  rows={tableRows}
  stickyLastColumn={true}
  expandedRowRender={(row) => <ExpandedContent data={row} />}
/>

// After
<TcTable.Body
  isLoading={isLoading}
  columnNames={columnNames}
  rowData={data}
  expandableUI={(item) => <ExpandedContent data={item} />}
>
  {(item, { expandButton }) => (
    <TcTable.Tr key={item.id}>
      <TcTable.Td>
        {expandButton()}
        {item.name}
      </TcTable.Td>
      <TcTable.Td>{item.description}</TcTable.Td>
    </TcTable.Tr>
  )}
</TcTable.Body>
```

| Legacy prop | TcTable prop |
|---|---|
| `expandedRowRender` | `expandableUI` |
| `expandRowByClick` | `expandOnRowClick` |
| `canMultipleExpand` | `canMultipleExpand` |

> **중요**: `expandButton()`은 별도의 `iconColumn` Td가 아니라, **이름 셀 안에 인라인으로** 배치한다.
> 별도 컬럼을 추가하지 않으므로 `columnNames`에 빈 문자열을 넣을 필요 없다.

### 선택 + 확장 테이블

```tsx
// Before
<ExpandableTable
  isLoading={isLoading}
  columns={columns}
  rows={rows}
  selectionType="checkbox"
  selectedRows={selectedIds}
  onRowSelectionChange={handleChange}
  getRowId={getRowId}
  expandedRowRender={(row) => <ExpandedContent data={row} />}
  expandRowByClick={true}
/>

// After
<TcTable.Body
  isLoading={isLoading}
  columnNames={columnNames}
  rowData={data}
  type="checkbox"
  selectedValues={selectedIds}
  onChange={handleChange}
  getSelectValue={(item) => item.id}
  expandableUI={(item) => <ExpandedContent data={item} />}
  expandOnRowClick
>
  {(item, { selectCell, expandButton }) => (
    <TcTable.Tr key={item.id}>
      {selectCell()}
      <TcTable.Td>
        {expandButton()}
        {item.name}
      </TcTable.Td>
      <TcTable.Td>{item.description}</TcTable.Td>
    </TcTable.Tr>
  )}
</TcTable.Body>
```

> `selectCell()`과 `expandButton()` 모두 render function의 helpers에서 가져온다.
> 선택 셀은 별도 `{selectCell()}`로, 확장 버튼은 이름 셀 안에 인라인으로 배치.

---

## 7. 셀(Td) 패턴별 전환

### 7-1. 기본 텍스트

```tsx
// Before
<Table.Td rowData={item} column={{ key: 'name' }} preventClickPropagation={false}>
  {item.name}
</Table.Td>

// After
<TcTable.Td>{item.name}</TcTable.Td>
```

### 7-2. 정렬 가능 컬럼

```tsx
// Before — columns 배열에서 sortable: true 지정
{ key: 'username', header: 'Username', sortable: true }

// After — Td에 직접 명시
<TcTable.Td sortable>{item.username}</TcTable.Td>
```

### 7-3. 접미사(suffix) — 목록 축약 표시 (+N)

`formatStringListDisplay` 등의 유틸 대신, `suffix` prop으로 `(+N)` 부분을 분리한다.

```tsx
// Before
<Table.Td rowData={item} column={{ key: 'groups' }} preventClickPropagation={false}>
  {item.groups.length > 1 ? (
    <Tooltip content={<div>{item.groups.map(g => <div key={g}>{g}</div>)}</div>}>
      <span className="cursor-help">{formatStringListDisplay(item.groups)}</span>
    </Tooltip>
  ) : (
    formatStringListDisplay(item.groups)
  )}
</Table.Td>

// After
<TcTable.Td
  suffix={item.groups.length > 1 ? `(+${item.groups.length - 1})` : undefined}
>
  {item.groups.length > 1 ? (
    <Tooltip content={<div>{item.groups.map(g => <div key={g}>{g}</div>)}</div>}>
      <span className="cursor-help">{item.groups[0]}</span>
    </Tooltip>
  ) : (
    (item.groups[0] ?? '-')
  )}
</TcTable.Td>
```

> `suffix`는 truncate 영역 바깥에 렌더링되므로, 텍스트가 길어도 `(+N)` 표시가 잘리지 않는다.

### 7-4. 아이콘/액션 컬럼

```tsx
// Before
<Table.Td
  rowData={item}
  column={{ key: 'actions', align: 'center', clickable: false, isEllipsis: false }}
  preventClickPropagation={true}
>
  <ContextMenu.Root ...>...</ContextMenu.Root>
</Table.Td>

// After
<TcTable.Td iconColumn>
  <ContextMenu.Root
    trigger={({ toggle }) => (
      <Button onClick={e => { e.stopPropagation(); toggle(); }}>
        <ActionIcon />
      </Button>
    )}
  >
    ...
  </ContextMenu.Root>
</TcTable.Td>
```

> `iconColumn`은 해당 컬럼에 고정 너비, 중앙 정렬, non-truncate 스타일을 적용한다.
> `preventClickPropagation`이 없으므로 이벤트 핸들러에서 직접 `e.stopPropagation()` 처리.

### 7-6. StatusIndicator 컬럼

`StatusIndicator`(아이콘 전용 상태 표시)를 포함하는 셀은 `iconColumn`을 사용한다.

```tsx
// Before
<Table.Td rowData={item} column={{ key: 'status', align: 'center' }}>
  <StatusIndicator variant={getVariant(item.status)} layout="iconOnly" />
</Table.Td>

// After
<TcTable.Td iconColumn>
  <StatusIndicator variant={getVariant(item.status)} layout="iconOnly" />
</TcTable.Td>
```

> `StatusIndicator`는 고정 너비의 아이콘 전용 셀이므로 `align="center"` 대신 `iconColumn`을 사용한다.

### 7-5. 정렬(align) 지정

> **주의**: `align` prop은 매우 드문 경우에만 사용한다. 명시적으로 요청받은 경우가 아니면 사용하지 않는다.
> `StatusIndicator` 같은 아이콘 전용 셀은 `align="center"` 대신 `iconColumn`을 사용한다.

```tsx
// 일반적으로 align 사용 불필요 — 기본 left 정렬 유지
<TcTable.Td>{item.value}</TcTable.Td>

// 명시적으로 요청된 경우에만
<TcTable.Td align="center">{item.value}</TcTable.Td>
```

---

## 7. 행 클릭 처리

### 행 전체 클릭 → 네비게이션

```tsx
// Before — onClickRow or handleRowClick with Record<string, unknown>
const handleRowClick = (rowData: Record<string, unknown>) => {
  const item = rowData as unknown as MyType;
  navigate(item.id);
};

// After — TcTable.Tr onClick
{(item) => (
  <TcTable.Tr onClick={() => navigate(item.id)}>
    <TcTable.Td>{item.name}</TcTable.Td>
  </TcTable.Tr>
)}
```

### 특정 셀만 클릭 가능 (나머지 행 클릭 무시)

네비게이션 링크가 필요한 셀은 **`Link` 컴포넌트를 사용**한다. 원시 `<button>` 태그를 쓰지 않는다.

```tsx
// Good — Link 컴포넌트 사용
{(item) => (
  <TcTable.Tr>
    <TcTable.Td>
      <Link
        text={item.name}
        to={`/detail/${item.id}`}
        component="DetailPage"
      />
    </TcTable.Td>
    <TcTable.Td>{item.description}</TcTable.Td>
  </TcTable.Tr>
)}

// Bad — 원시 <button> 태그
{(item) => (
  <TcTable.Tr>
    <TcTable.Td>
      <button onClick={e => { e.stopPropagation(); navigate(item.id); }}>
        {item.name}
      </button>
    </TcTable.Td>
  </TcTable.Tr>
)}
```

> **가이드라인**: 셀 안에서 네비게이션이 필요한 경우 `Link` 컴포넌트를 우선 사용한다.
> `Link`는 일관된 스타일(font-medium, text-primary, hover:underline)과 접근성(키보드, aria)을 내장하고 있어,
> 원시 `<button>`으로 매번 className과 onKeyDown을 수동 작성할 필요가 없다.

---

## 8. 콜백(Callback) Props 작성 규칙

### 타입 명시 금지

Callback props에 명시적인 타입 주석을 추가하지 않는다. TypeScript 타입 추론이 자동으로 정확한 타입을 판단한다.

```tsx
// ❌ 타입 주석 명시 금지
<TcTable.Body
  getSelectValue={(item: MyType) => item.id}
  onChange={(selectedRows: (string | number)[]) => { ... }}
  getDisabled={(row: MyType) => row.isLocked}
  onSortChange={({ columnName, curr }: { columnName: string; curr: string }) => { ... }}
/>

// ✅ 타입 주석 제거 (타입 추론에 맡김)
<TcTable.Body
  getSelectValue={item => item.id}
  onChange={selectedRows => { ... }}
  getDisabled={row => row.isLocked}
  onSortChange={({ columnName, curr }) => { ... }}
/>
```

**이유**: TcTable의 제네릭 파라미터가 이미 정확한 타입 정보를 제공하므로, 명시적 타입 주석은 중복이며 코드를 복잡하게 만든다.

### isLoading Prop: 실제 상태 값만 전달

`isLoading` prop에는 **항상 실제 로딩 상태 변수를 전달**한다. 하드코딩된 `true` / `false` 값을 사용하지 않는다.

```tsx
const { isLoading } = useFetchData();

// ❌ 잘못됨 - 하드코딩된 boolean 값
<TcTable.Body isLoading={false} ... />
<TcTable.Body isLoading={true} ... />

// ✅ 올바름 - 실제 상태 변수
<TcTable.Body isLoading={isLoading} ... />
```

**이유**: 테이블이 항상 로딩되지 않은 상태로 표시되거나, 실제 로딩 상태와 무관하게 동작하게 된다. 읽기 전용 테이블도 `isLoading` prop이 필수이므로 `false`를 명시적으로 전달해야 한다면 상위 컴포넌트에서 명시적 상태 변수를 선언한다.

---

## 9. 마이그레이션 체크리스트

- [ ] `SelectableTable`, `Table`, `ExpandableTable`, `type TableColumn` 임포트 제거
- [ ] `TcTable` 임포트 추가
- [ ] `columns: TableColumn[]` → `columnNames: string[]`
- [ ] `onSortChange` 시그니처 변경 + `sortKeyMap` 추가
- [ ] `Table` / `SelectableTable` → `TcTable.Body`
  - [ ] `rows` → `rowData` (타입 캐스트 제거)
  - [ ] `selectionType` → `type`
  - [ ] `selectedRows` → `selectedValues`
  - [ ] `onRowSelectionChange` → `onChange`
  - [ ] `getRowId` → `getSelectValue`
  - [ ] `sort` / `order` prop 제거 (TcTable이 내부 관리)
- [ ] children을 `(item, { selectCell }) => ...` render function으로 변환
- [ ] `Table.Tr` → `TcTable.Tr`
  - [ ] `rowData` prop 제거
- [ ] `Table.Td` → `TcTable.Td`
  - [ ] `rowData`, `column`, `preventClickPropagation` prop 제거
  - [ ] 정렬 가능한 컬럼: `sortable` prop 추가
  - [ ] 중앙 정렬: `align="center"` prop 추가
  - [ ] 아이콘/액션 컬럼: `iconColumn` prop 추가
  - [ ] 목록 축약 표시: `suffix` prop 활용
- [ ] `ExpandableTable` 사용 시:
  - [ ] `expandedRowRender` → `expandableUI` prop
  - [ ] `expandRowByClick` → `expandOnRowClick`
  - [ ] `expandButton()`은 이름 셀 안에 인라인 배치 (별도 컬럼 X)
- [ ] `e.stopPropagation()` 확인 (이전 `preventClickPropagation` 대체)
- [ ] 셀 내 네비게이션 링크: 원시 `<button>` → `Link` 컴포넌트로 교체
- [ ] 사용하지 않는 임포트/유틸 정리 (`formatStringListDisplay` 등)
- [ ] lint 에러 확인
- [ ] **Callback Props 규칙 준수**: 
  - [ ] `getSelectValue`, `onChange`, `getDisabled`, `onSortChange` 등 콜백에 타입 주석 제거
  - [ ] 타입 추론에 맡김
- [ ] **isLoading Prop 규칙 준수**:
  - [ ] `isLoading={false}` 같은 하드코딩된 값 제거
  - [ ] 실제 상태 변수만 전달

---

## Props 매핑 요약

| Legacy | TcTable | 비고 |
|---|---|---|
| `columns: TableColumn[]` | `columnNames: string[]` | |
| `rows` | `rowData` | 타입 캐스트 불필요 |
| `isLoading` | `isLoading` | 동일 |
| `emptyUI` | `emptyUI` | 동일 |
| `selectionType` | `type` | `'checkbox'` / `'radio'` |
| `selectedRows` | `selectedValues` | |
| `onRowSelectionChange` | `onChange` | |
| `getRowId` | `getSelectValue` | |
| `selectOnRowClick` | `selectOnRowClick` | 동일 |
| `sort` / `order` | — | TcTable이 내부 관리 |
| `onSortChange(key, order)` | `onSortChange({ columnName, prev, curr })` | 시그니처 변경 |
| `stickyLastColumn` | — | TcTable 미지원 |
| `expandedRowRender` | `expandableUI` | `expandButton()`은 이름 셀 안에 인라인 |
| `expandRowByClick` | `expandOnRowClick` | |
| `canMultipleExpand` | `canMultipleExpand` | 동일 |
| `onClickRow` | `TcTable.Tr onClick` | |
| `isRowDisabled` | `getDisabled` | |

---

## 알려진 차이

| 항목 | 설명 |
|---|---|
| `stickyLastColumn` | TcTable에 해당 prop이 없음. 액션 컬럼 고정이 필요하면 CSS로 별도 처리. |
| `sort` / `order` prop | TcTable은 현재 정렬 상태를 외부에서 받지 않음. 헤더 UI에 현재 정렬 상태가 표시되지 않을 수 있음. |
| `preventClickPropagation` | TcTable.Td에 없음. 이벤트 핸들러에서 직접 `e.stopPropagation()` 호출. |
