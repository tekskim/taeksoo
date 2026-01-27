# 테이블 컬럼 정렬 가이드

테이블 컬럼 정렬 설정 가이드입니다.

---

## 기본 원칙

**모든 컬럼은 왼쪽 정렬이 기본입니다.**

아이콘/버튼만 표시하는 컬럼만 가운데 정렬을 사용합니다.

---

## 정렬 설정

### TableColumn align 속성

```tsx
interface TableColumn {
  align?: 'left' | 'center' | 'right';  // 기본값: 'left'
}
```

### 정렬 옵션

| 정렬 | 사용 비율 | 용도 |
|------|----------|------|
| `left` (기본) | ~90% | 텍스트, 숫자, 날짜 등 |
| `center` | ~10% | 아이콘, 버튼 |
| `right` | - | 미사용 |

---

## 가운데 정렬 컬럼

**아래 컬럼만 `align: 'center'` 적용:**

| 컬럼 | 이유 |
|------|------|
| `status` | 상태 아이콘만 표시 |
| `actions` | 액션 버튼 |
| `locked` | 잠금 아이콘 |

```tsx
{ key: 'status', width: columnWidths.status, align: 'center' }
{ key: 'actions', width: columnWidths.actions, align: 'center' }
{ key: 'locked', width: columnWidths.locked, align: 'center' }
```

---

## 왼쪽 정렬 컬럼 (기본)

**위 3개 컬럼을 제외한 모든 컬럼은 왼쪽 정렬입니다.**

왼쪽 정렬은 기본값이므로 `align` 속성을 생략합니다.

```tsx
// ❌ 불필요 - align: 'left'는 기본값이라 생략 가능
{ key: 'name', flex: 1, align: 'left' }

// ✅ 권장 - align 생략 (자동으로 왼쪽 정렬)
{ key: 'name', flex: 1 }
```

### 왼쪽 정렬 대상

- 이름, 설명 등 텍스트
- IP 주소, MAC 주소
- 날짜/시간
- 숫자 (CPU, RAM, Count 등)
- 타입, 카테고리
- 네임스페이스, 라벨

---

## 전체 예시

```tsx
const columns = [
  // 가운데 정렬 (align 명시)
  { key: 'status', width: columnWidths.status, align: 'center' },
  
  // 왼쪽 정렬 (align 생략)
  { key: 'name', flex: 1 },
  { key: 'type', width: columnWidths.type },
  { key: 'ip', width: columnWidths.ip },
  { key: 'createdAt', width: columnWidths.createdAt },
  
  // 가운데 정렬 (align 명시)
  { key: 'actions', width: columnWidths.actions, align: 'center' },
];
```

---

## 오른쪽 정렬

SSOT에서는 사용하지 않습니다.

---

## 요약

| 컬럼 | 정렬 | align 속성 |
|------|------|-----------|
| `status`, `actions`, `locked` | 가운데 | `align: 'center'` 명시 |
| 나머지 전부 | 왼쪽 | 생략 (기본값) |

---

## 관련 문서

- [컬럼 너비 가이드](./column-width-guide.md)
- [행 높이 가이드](./table-row-height-guide.md)
