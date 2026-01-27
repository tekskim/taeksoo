# 테이블 행 높이 및 텍스트 처리 가이드

테이블 컴포넌트의 행 높이, 줄바꿈, 텍스트 처리 설정 가이드입니다.

---

## 기본 설정

### CSS 변수

```css
/* src/index.css */
--table-row-height: 48px;        /* 행 높이 */
--table-row-gap: 4px;            /* 행 간격 */
--table-line-height: 16px;       /* 텍스트 줄 높이 */
--table-font-size: 12px;         /* 셀 폰트 크기 */
--table-header-font-size: 11px;  /* 헤더 폰트 크기 */
--table-cell-padding-x: 12px;    /* 셀 좌우 패딩 */
--table-cell-padding-y: 6px;     /* 셀 상하 패딩 */
--table-header-padding-y: 8px;   /* 헤더 상하 패딩 */
```

### 높이 동작

| 영역 | CSS | 동작 |
|------|-----|------|
| 헤더 | `min-h-[48px]` | 최소 48px, 내용에 따라 확장 |
| 데이터 행 | `h-[48px]` | **고정 48px** |

### 텍스트 처리

| 영역 | 클래스 | 동작 |
|------|--------|------|
| 헤더 텍스트 | `whitespace-nowrap truncate` | 한 줄, 말줄임(...) |
| 셀 기본값 | `truncate` | 한 줄, 말줄임(...) |
| 커스텀 렌더 | - | 개발자 직접 처리 |

---

## 행 높이 커스터마이징

### rowHeight prop

```tsx
// 기본값 (48px)
<Table columns={columns} data={data} rowKey="id" />

// 커스텀 높이
<Table
  columns={columns}
  data={data}
  rowKey="id"
  rowHeight="56px"  // 48px → 56px
/>
```

### 권장 높이

| 높이 | 용도 |
|------|------|
| `40px` | 컴팩트 (데이터가 많은 목록) |
| `48px` | 기본값 (일반 목록) |
| `56px` | 여유 있는 레이아웃 |
| `64px` | 아이콘/뱃지가 큰 경우 |

---

## 텍스트 말줄임 처리

### 기본 동작 (자동 적용)

```tsx
// 기본 렌더링 - truncate 자동 적용
{ key: 'name', label: 'Name', flex: 1 }

// 출력: "Very long text that..." (말줄임)
```

### 커스텀 렌더 시 truncate 적용

```tsx
// ❌ truncate 없음 - 오버플로우 발생 가능
{
  key: 'name',
  render: (value) => <span>{value}</span>
}

// ✅ truncate 적용
{
  key: 'name',
  render: (value) => <span className="truncate">{value}</span>
}

// ✅ 블록 요소일 경우
{
  key: 'name',
  render: (value) => <div className="truncate">{value}</div>
}
```

### 툴팁과 함께 사용

```tsx
import { Tooltip } from '@/design-system';

{
  key: 'description',
  label: 'Description',
  flex: 1,
  render: (value) => (
    <Tooltip content={value}>
      <span className="truncate block">{value}</span>
    </Tooltip>
  )
}
```

---

## 멀티라인이 필요한 경우

> 기본적으로 테이블은 단일 행 텍스트를 권장합니다.
> 멀티라인이 꼭 필요한 경우 아래 방법을 사용하세요.

### 방법 1: line-clamp (권장)

```tsx
{
  key: 'description',
  label: 'Description',
  flex: 1,
  render: (value) => (
    <span className="line-clamp-2">{value}</span>  // 2줄까지
  )
}
```

**주의**: 행 높이도 함께 조정 필요

```tsx
<Table
  columns={columns}
  data={data}
  rowKey="id"
  rowHeight="64px"  // 2줄 표시 시 높이 증가
/>
```

### 방법 2: 전체 텍스트 표시

```tsx
{
  key: 'message',
  label: 'Message',
  flex: 2,
  render: (value) => (
    <span className="whitespace-normal">{value}</span>
  )
}
```

**주의**: 행 높이가 고정이므로 내용이 잘릴 수 있음

### line-clamp 옵션

| 클래스 | 줄 수 | 권장 행 높이 |
|--------|-------|-------------|
| `line-clamp-1` | 1줄 | 48px (기본) |
| `line-clamp-2` | 2줄 | 64px |
| `line-clamp-3` | 3줄 | 80px |

---

## 특수 케이스

### 아이콘 + 텍스트

```tsx
{
  key: 'name',
  render: (value, row) => (
    <div className="flex items-center gap-2 min-w-0">
      <IconFile size={16} className="shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  )
}
```

### 뱃지/태그 목록

```tsx
{
  key: 'tags',
  render: (value) => (
    <div className="flex items-center gap-1 overflow-hidden">
      {value.slice(0, 3).map(tag => (
        <Chip key={tag} size="sm">{tag}</Chip>
      ))}
      {value.length > 3 && (
        <span className="text-[var(--color-text-muted)]">
          +{value.length - 3}
        </span>
      )}
    </div>
  )
}
```

### 링크 텍스트

```tsx
import { TableLink } from '@/design-system';

{
  key: 'name',
  render: (value, row) => (
    <TableLink to={`/detail/${row.id}`}>
      {value}
    </TableLink>
  )
}

// truncate 비활성화
{
  key: 'name',
  render: (value, row) => (
    <TableLink to={`/detail/${row.id}`} truncate={false}>
      {value}
    </TableLink>
  )
}
```

---

## 요약

| 항목 | 기본값 | 비고 |
|------|--------|------|
| 행 높이 | 48px | `rowHeight` prop으로 변경 가능 |
| 텍스트 처리 | 한 줄 + 말줄임 | `truncate` 클래스 |
| 멀티라인 | 미지원 | `line-clamp-N` + 높이 조정으로 가능 |
| 커스텀 렌더 | truncate 없음 | 직접 클래스 추가 필요 |

---

## 관련 문서

- [컬럼 너비 가이드](./column-width-guide.md) - 컬럼 너비 설정
- [컬럼 너비 매핑표](./column-width-mapping.md) - 전체 테이블 매핑 현황
