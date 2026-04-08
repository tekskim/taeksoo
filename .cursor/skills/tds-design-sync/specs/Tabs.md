# Tabs Design Spec

> Extracted from TDS `src/design-system/components/Tabs/Tabs.tsx` + `src/index.css` (Component - Tabs)  
> thaki-shared target: `src/components/Tabs/` (`Tabs.tsx`, `Tabs.styles.ts`)  
> Design reference pages: `src/pages/design/components/TabsPage.tsx`, `SharedComponentsPage.tsx`, `foundation/SemanticColorsPage.tsx` (boxed preview)

## Mapping (component-map)

| 항목         | 값                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| 매핑         | Tabs ↔ Tabs (1:1, #27)                                                                                      |
| Variant 이름 | TDS `underline` / `boxed` — thaki `line` / `button` (TDS는 `line`→`underline`, `button`→`boxed` alias 지원) |

---

## Base Styles (공통)

| Property           | Value                                                | TDS Token / Class                 |
| ------------------ | ---------------------------------------------------- | --------------------------------- |
| Root layout        | `flex flex-col h-fit`                                | `Tabs` root                       |
| Font weight (라벨) | 500                                                  | `font-medium`                     |
| Transition (색)    | 150ms                                                | `duration-[var(--duration-fast)]` |
| Cursor             | pointer (`not-allowed` + `opacity-50` when disabled) | Tab buttons                       |
| Focus ring         | 없음 (별도 `focus-visible` 링 미정의)                | 양쪽 동일                         |

---

## Variants

### variant=`underline` (thaki: `line`)

#### TabList (트랙)

| 항목            | 값                                                       |
| --------------- | -------------------------------------------------------- |
| Layout          | `flex` + `gap` 8px                                       |
| 하단 베이스라인 | 전체 너비 1px, `var(--color-border-default)` (`#e2e8f0`) |
| TDS 구현        | `after:absolute` pseudo (`h-px`, bottom)                 |
| shared 구현     | `border-b border-border` (동일 역할)                     |

#### Tab (라벨 + 인디케이터)

| State          | Text                                                              | 인디케이터                             |
| -------------- | ----------------------------------------------------------------- | -------------------------------------- |
| inactive       | `var(--tabs-inactive-color)` → `#64748b` (`--color-text-subtle`)  | 투명                                   |
| inactive hover | `var(--tabs-hover-color)` → `#0f172a` (`--color-text-default`)    | 투명                                   |
| active         | `var(--tabs-active-color)` → `#2563eb` (`--color-action-primary`) | `var(--tabs-indicator-color)` 2px 높이 |
| disabled       | 글자 50% opacity, `cursor-not-allowed`                            | —                                      |

**구조 차이 (시각 동등 목표)**

- TDS: 라벨 `span` + 아래 별도 `span` 인디케이터, 라벨↔인디케이터 간격 `var(--tabs-indicator-gap)` = **10px** (`--spacing-2-5`).
- shared: 단일 버튼 + `::after` 2px, `pb-2.5` (10px)로 여백. 인디케이터는 동일 2px primary.

---

### variant=`boxed` (thaki: `button`)

#### TabList (세그먼트 컨트롤 배경)

| 항목           | TDS 값                                       |
| -------------- | -------------------------------------------- |
| Height         | 40px (`h-10`)                                |
| Padding        | 4px (`p-1`)                                  |
| Gap (탭 간)    | 4px (`gap-1`)                                |
| Background     | `var(--color-surface-subtle)` → `#f8fafc`    |
| Border (inset) | `inset 0 0 0 1px var(--color-border-subtle)` |
| Radius         | `rounded-lg` → **8px** (`--radius-lg`)       |
| Width          | `w-fit` (콘텐츠 너비)                        |

#### Tab (세그먼트 버튼)

| State          | Background                        | Text                          | Border / shadow                                                              |
| -------------- | --------------------------------- | ----------------------------- | ---------------------------------------------------------------------------- |
| inactive       | transparent                       | `var(--color-text-default)`   | —                                                                            |
| inactive hover | `var(--color-surface-default)`    | 동일                          | —                                                                            |
| active         | `var(--color-surface-default)`    | `var(--color-action-primary)` | `inset 0 0 0 1px var(--color-border-default)` + `0 1px 2px rgba(0,0,0,0.05)` |
| disabled       | opacity 50%, `cursor-not-allowed` | —                             | —                                                                            |

| 항목      | 값                                     |
| --------- | -------------------------------------- |
| min-width | 80px                                   |
| padding   | `px-3` (12px), `h-8` (32px)            |
| radius    | `rounded-md` → **6px** (`--radius-md`) |

---

## Sizes

| Size | Font size | Line height | TDS 변수                                       |
| ---- | --------- | ----------- | ---------------------------------------------- |
| `sm` | 12px      | 16px        | `--tabs-font-size-sm`, `--tabs-line-height-sm` |
| `md` | 14px      | 20px        | `--tabs-font-size-md`, `--tabs-line-height-md` |

thaki-shared는 `size="md"`를 deprecated로 표기하나,라인 variant에서 `text-14 leading-5`로 유지.

---

## TabPanel / 콘텐츠 영역

| 항목            | TDS                              | Resolved                 |
| --------------- | -------------------------------- | ------------------------ |
| Panel 상단 패딩 | `pt-[var(--tabs-panel-padding)]` | **24px** (`--spacing-6`) |

---

## Interactive States (동적)

| State      | TDS                                                              | 비고                      |
| ---------- | ---------------------------------------------------------------- | ------------------------- |
| Selected   | `activeTab === value` → underline/boxed 스타일 위 참조           | 양쪽 동일 개념            |
| thaki-only | 콘텐츠 래퍼 `opacity: 0.7` during `useTransition`                | TDS 없음 — 전환 시 흐림   |
| thaki-only | 가로 오버플로 시 좌우 스크롤 버튼 + `opacity`로 스크롤 상태 표시 | TDS Tabs에 스크롤 UI 없음 |

---

## 아이콘 비교

| 영역    | TDS                    | thaki-shared                                                                                |
| ------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| 탭 라벨 | 아이콘 없음 (텍스트만) | 동일 (라벨은 `ReactNode`이나 일반 텍스트)                                                   |
| 스크롤  | 없음                   | `ChevronLeftIcon` / `ChevronRightIcon` (`Icon` 래퍼, Tabler `IconChevronLeft`/`Right` 계열) |

TDS Tabs.tsx 본문에는 Tabler 아이콘 import 없음. 스크롤 아이콘은 shared 전용 기능으로 디자인 스펙에서 “패턴 차이”로 분리.

---

## Token Mapping (참조)

| TDS Token                                                   | TDS Resolved | thaki-shared (의미상 대응)       | Match |
| ----------------------------------------------------------- | ------------ | -------------------------------- | ----- |
| `--tabs-active-color`                                       | `#2563eb`    | `--semantic-color-primary`       | exact |
| `--tabs-inactive-color`                                     | `#64748b`    | `--semantic-color-textSubtle`    | exact |
| `--tabs-hover-color`                                        | `#0f172a`    | `--semantic-color-text`          | exact |
| `--tabs-indicator-color`                                    | `#2563eb`    | `--semantic-color-primary`       | exact |
| `--color-border-default` (underline baseline / boxed inset) | `#e2e8f0`    | `--semantic-color-border`        | exact |
| `--color-border-subtle` (boxed container inset)             | `#f1f5f9`    | `--semantic-color-borderSubtle`  | exact |
| `--color-surface-subtle` (boxed 트랙 배경)                  | `#f8fafc`    | `--semantic-color-surfaceSubtle` | exact |
| `--duration-fast`                                           | 150ms        | `--primitive-duration-150`       | exact |

---

## Props 기본값 비교 (체크리스트 A)

| Prop        | TDS default                                    | thaki-shared default | 시각 영향                                                                                                  |
| ----------- | ---------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------- |
| `size`      | `'sm'`                                         | `'sm'`               | 없음                                                                                                       |
| `variant`   | `'underline'`                                  | `'line'`             | 없음 (동일 시각)                                                                                           |
| `fullWidth` | (해당 prop 없음, boxed TabList는 항상 `w-fit`) | `true`               | **boxed**에서 탭 행이 컨테이너 전체 너비로 늘어나고 `grow`로 탭이 균등 분할될 수 있음 → TDS `w-fit`과 다름 |

---

## 주요 디자인 차이

| #   | 항목                                      | TDS                                                 | thaki-shared                                                                   | 변경 유형      | 비고 / 마이그레이션                                                               |
| --- | ----------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ | -------------- | --------------------------------------------------------------------------------- |
| 1   | Boxed 탭 행 너비                          | TabList `w-fit`, 탭에 `grow` 없음                   | 기본 `fullWidth={true}` + 버튼 variant에 `grow` → 넓은 레이아웃에서 균등 폭 탭 | `style`        | TDS와 동일: shared에서 `fullWidth={false}` 또는 레이아웃에 맞게 조정              |
| 2   | 전환 시 콘텐츠                            | opacity 변화 없음                                   | `useTransition` 중 `opacity: 0.7`                                              | `style`        | 의도적 로딩 느낌 유지 vs 제거는 제품 결정                                         |
| 3   | 가로 스크롤 UI                            | 없음                                                | 오버플로 시 좌우 화살표 + 스크롤                                               | `style`        | 기능 패턴 차이; 토큰 정렬과 무관                                                  |
| 4   | Underline 베이스라인                      | `after` 1px (별도 레이어)                           | `border-b`                                                                     | `style`        | 동일 1px 구분선 목적, 구현만 상이                                                 |
| 5   | 라벨–인디케이터 간격                      | 명시 `gap` 10px + 별도 인디케이터 블록              | `pb-2.5` + `::after`                                                           | `style`        | 픽셀 퍼펙트 필요 시 측정 후 미세 조정                                             |
| 6   | 키보드 탐색                               | TabList `onKeyDown`: Arrow/Home/End                 | 구현 없음                                                                      | `api-required` | **A11y**: shared에 동일 키보드 패턴 적용 권장 (디자인 토큰과 별도)                |
| 7   | `index.css` boxed 토큰 (`--tabs-boxed-*`) | 일부 정의, **Tabs.tsx는 직접 하드코딩 클래스 다수** | CVA + 시맨틱 유틸                                                              | `token-global` | 장기적으로 TDS boxed를 토큰만으로 정리 가능; 현재 스펙은 **실제 TSX 적용값** 기준 |

---

## API / 구조 (참고 — Apply 범위 밖)

- TDS: compound `Tabs` / `TabList` / `Tab` / `TabPanel`, `value` / `onChange`, `defaultValue`.
- shared: `Tab` 자식에 `id` + `label`, `activeTabId` / `defaultActiveTabId`, `persistence` / `destroyOnHidden`.
- 디자인 싱크는 **스타일 토큰·클래스** 정렬이 핵심; 마크업/API는 부분 대응 유지 (component-map 결정).
