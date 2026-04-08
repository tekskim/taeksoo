# MultiItemDisplay / BadgeList Design Spec

> Extracted from TDS `src/design-system/components/Badge/BadgeList.tsx` (+ `Badge.tsx` for chip 스타일)
> thaki-shared target: `src/components/MultiItemDisplay/MultiItemDisplay.tsx`
> component-map: **MultiItemDisplay ↔ BadgeList** (역할 동일: 테이블 셀 다중 항목 오버플로우), **API·동작 차이 큼** (partial)

## 매핑 요약

| 항목            | TDS `BadgeList`                                                          | thaki-shared `MultiItemDisplay`                              |
| --------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| 빈 목록         | `null` 반환                                                              | `emptyText` (기본 `'-'`)                                     |
| 단일 항목       | `Badge` 1개 (기본 theme `white` / `solid`)                               | 뱃지 없이 `span` + truncate                                  |
| 다중 항목 표시  | `maxVisible`개(기본 **2**) `Badge` + `+N`                                | **첫 1개** 텍스트 + `(+N)`                                   |
| `items` 타입    | `string[]`                                                               | `string[]` \| `Record<string, string>` (`key: value`로 펼침) |
| 오버레이        | `Popover` (hover, top, delay/hideDelay 100ms)                            | `Tooltip` (direction top, Portal/anchor)                     |
| 오버레이 본문   | 제목 + 세로 `Badge` 스택 (`break-all`)                                   | `whiteSpace: pre-line` 텍스트만                              |
| 항목 truncation | `maxBadgeWidth` + `title` (옵션)                                         | 첫 항목 `truncate` + `title`; 툴팁은 전체 줄바꿈             |
| 칩 스타일       | `Badge` (`size`/`theme`/`type`, 기본 size `sm`)                          | 없음 (본문 `text-xs`)                                        |
| `+N` 트리거     | 배경 칩 (`surface-subtle`, hover `surface-muted`, `text-body-xs` medium) | 괄호 문자열, 배경 없음, `text-text-muted`                    |

## Base Styles (BadgeList 루트 행)

| Property    | Value                           | TDS Token / 출처                   |
| ----------- | ------------------------------- | ---------------------------------- |
| layout      | `flex flex-nowrap items-center` | —                                  |
| gap (칩 간) | 4px                             | Tailwind `gap-1` (= `--spacing-1`) |
| wrap        | nowrap                          | 테이블 행 높이 일관성              |

## `+N` 트리거 (BadgeList 전용 블록)

| Property           | Resolved                                                                                  | TDS Token / 클래스                                            |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| display            | inline-flex, shrink-0                                                                     | `inline-flex shrink-0 items-center justify-center`            |
| padding-x          | 6px                                                                                       | `px-1.5`                                                      |
| border-radius      | 4px                                                                                       | Tailwind `rounded` (0.25rem → 4px @ 16px root)                |
| font-size          | 10px                                                                                      | `text-body-xs` → `--font-size-10`                             |
| line-height        | 14px                                                                                      | `text-body-xs` → `--line-height-14`                           |
| font-weight        | 500                                                                                       | `font-medium`                                                 |
| text color         | #475569                                                                                   | `text-[var(--color-text-muted)]` → `--color-slate-600`        |
| background         | #f8fafc                                                                                   | `bg-[var(--color-surface-subtle)]` → `--color-slate-50`       |
| hover background   | #f1f5f9                                                                                   | `hover:bg-[var(--color-surface-muted)]` → `--color-slate-100` |
| cursor             | pointer                                                                                   | `cursor-pointer`                                              |
| transition         | color/background (Tailwind `transition-colors`)                                           | 명시 duration 없음                                            |
| height (size 연동) | sm: 20px (`h-5`), md: 24px (`h-6`), lg 분기 있으나 Badge size는 sm\|md만 — **lg는 `h-7`** | 조건부 `h-5` / `h-6` / `h-7`                                  |

> **참고**: `BadgeSize`는 공식적으로 `'sm' \| 'md'`만이나, `+N` span에 `size === 'lg'` 분기가 있어 높이만 28px(`h-7`)로 잡힘.

## Popover 내부 (전체 목록)

| Property      | Value                                                        | 비고                                          |
| ------------- | ------------------------------------------------------------ | --------------------------------------------- |
| padding       | 12px                                                         | `p-3`                                         |
| min/max width | 120px / 320px                                                | `min-w-[120px] max-w-[320px]`                 |
| 제목          | `text-body-xs` + `font-medium` + `text-muted` + `mb-2` (8px) | 기본 문구 `All items (N)` 또는 `popoverTitle` |
| 목록 gap      | 4px 세로                                                     | `flex flex-col gap-1`                         |
| 각 항목       | `Badge` + `break-all` 내부 `span`                            | 테이블 셀과 동일 theme/type/size              |

## Badge (BadgeList 기본 칩) — 기본 props 미지정 시

`BadgeList`는 `theme`/`type`을 넘기지 않으면 `Badge` 기본으로 **solid + white**: 배경 surface-default, 텍스트 default, inset 1px border (`--badge-white-border` → `--color-border-default` #e2e8f0).

| Size                | Height | padding-x | font-size | line-height |
| ------------------- | ------ | --------- | --------- | ----------- |
| sm (BadgeList 기본) | 20px   | 6px       | 11px      | 16px        |
| md                  | 24px   | 8px       | 13px      | 18px        |

## thaki-shared MultiItemDisplay — 타이포·색

| 상태                        | 클래스/스타일                                    | 비고                                                              |
| --------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| 빈/단일/다중 공통 래퍼 (2+) | `inline-flex items-center gap-1 text-xs min-w-0` | `text-xs`: Tailwind 기본 스케일(보통 12px/1rem lh, root rem 의존) |
| 빈                          | `text-xs` only                                   | 색상 클래스 없음 → 상위 상속                                      |
| 단일 값                     | `text-xs truncate max-w-full` + `title`          | 뱃지 없음                                                         |
| 첫 항목 (2+)                | `truncate` + `title`                             | 뱃지 없음                                                         |
| `+N`                        | `text-text-muted cursor-pointer shrink-0`        | **배경·hover 배경 없음**; 표기 `(+N)` (TDS는 `+N`)                |

## Interactive States (동적)

| 컴포넌트         | 상태         | 조건                 | 스타일                                   |
| ---------------- | ------------ | -------------------- | ---------------------------------------- |
| BadgeList        | hover (`+N`) | Popover 트리거 hover | `surface-muted` 배경으로 전환            |
| MultiItemDisplay | hover        | Tooltip 트리거 hover | 트리거 자체에 배경 변화 없음 (Tooltip만) |

## 아이콘 비교

| 위치               | TDS         | thaki-shared |
| ------------------ | ----------- | ------------ |
| 셀 / 오버플로우 UI | 아이콘 없음 | 아이콘 없음  |

## Token Mapping (참조)

| TDS Token                              | TDS Resolved (light) | thaki-shared                                     | shared Resolved (tokens-light) | Match   |
| -------------------------------------- | -------------------- | ------------------------------------------------ | ------------------------------ | ------- |
| `--color-text-muted`                   | #475569 (slate600)   | `text-text-muted` → `--semantic-color-textMuted` | #737373                        | ❌ DIFF |
| `--color-surface-subtle`               | #f8fafc (slate50)    | (+N에 미사용)                                    | —                              | n/a     |
| `--color-surface-muted`                | #f1f5f9 (slate100)   | (+N에 미사용)                                    | —                              | n/a     |
| `--color-border-default` (white badge) | #e2e8f0              | —                                                | —                              | n/a     |

`token-map.md`에 BadgeList/MultiItemDisplay 전용 행은 없음. 위는 컴포넌트 직접 참조 기준 비교.

## Props 기본값 체크리스트 (A)

| Prop         | TDS BadgeList | thaki-shared MultiItemDisplay       |
| ------------ | ------------- | ----------------------------------- |
| `maxVisible` | `2`           | 해당 없음 (항상 1개만 노출 후 축약) |
| `size`       | `'sm'`        | —                                   |
| `emptyText`  | —             | `'-'`                               |
| 빈 배열 동작 | `null`        | `'-'` 텍스트                        |

→ **기본 화면이 동일하지 않음** (항목 수·빈 상태·칩 유무).

## 주요 디자인 차이 (요약)

| #   | 항목           | Before (shared)               | After (TDS 기준)                                | 유형                     | 영향 범위 / 마이그레이션                                                                                                  |
| --- | -------------- | ----------------------------- | ----------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | 축약 규칙      | 2개 이상이면 **1개** + `(+N)` | 기본 **2**개 칩 + `+N` (`maxVisible` 조정 가능) | `api-required`           | 동일 밀도를 원하면 `maxVisible={1}` 및 `+` 표기 문자열 커스터마이즈는 TDS에 별도 API 없음 → 표기 `(+N)`은 현재 `+N` 고정. |
| 2   | 단일/빈 표현   | 단일은 일반 텍스트, 빈은 `-`  | 단일도 `Badge`, 빈은 렌더 없음                  | `api-required`           | 테이블 UX 통일 시 빈/단일 처리 props 필요 여부 검토.                                                                      |
| 3   | 칩 vs 텍스트   | 뱃지 없음                     | `Badge`(기본 white solid)                       | `style`                  | 시각적 무게 증가 (테두리·패딩).                                                                                           |
| 4   | `+N` 트리거    | 텍스트만, muted #737373       | 서브틀 배경 + hover, muted #475569              | `style` + `token-global` | muted 색은 글로벌 토큰 정렬로 일부 수렴 가능.                                                                             |
| 5   | 오버레이       | Tooltip + plain text          | Popover + Badge 리스트                          | `style`                  | 인터랙션·폭·타이포(제목 10px medium) 차이.                                                                                |
| 6   | 긴 문자열      | 툴팁만 전체, 셀은 truncate    | `maxBadgeWidth`로 칩 단위 ellipsis + `title`    | `api-required`           | 마이그레이션 시 `maxBadgeWidth` 등으로 맞춤.                                                                              |
| 7   | `Record` items | 지원 (`key: value`)           | 미지원 (`string[]`만)                           | `api-required`           | 적용 시 문자열 배열로 변환 레이어 유지.                                                                                   |

### 적용 판단

- **스타일만 싱크**하기 어렵고, **동작·API**(`maxVisible`, 빈/단일, Record, 오버레이 형태)를 먼저 맞추는 것이 선행됨.
- **토큰**: `textMuted` 실제 hex 불일치 (#737373 vs #475569)는 컴포넌트 밖 글로벌 정렬로 완화 가능하나, TDS `+N`은 추가로 surface 배경을 씀.

### 미적용·보류

- TDS `renderItem` 커스텀은 shared에 대응 타입 없음 — 필요 시 별도 래퍼.
- `BadgeList`의 `data-figma-name` 등 캡처용 속성은 shared 싱크 대상 아님.
