# LoadingSpinner Design Spec

> Extracted from TDS `src/design-system/components/Loading/Loading.tsx` (`variant="spinner"` 및 동일 파일의 `progress` / `button` 변형)
> thaki-shared target: `src/components/LoadingSpinner/`

## 매핑 관계

| TDS                              | thaki-shared     | 비고                                                       |
| -------------------------------- | ---------------- | ---------------------------------------------------------- |
| `Loading` + `variant="spinner"`  | `LoadingSpinner` | component-map: 이름 차이, **partial** — 시각·API 모두 상이 |
| `Loading` + `variant="progress"` | (없음)           | TDS 전용                                                   |
| `Loading` + `variant="button"`   | (없음)           | TDS 전용 — 비활성 로딩 버튼 프리셋                         |

`token-map.md`에 LoadingSpinner 전용 행은 없음. 스피너 색은 양쪽 모두 시맨틱 primary / border 계열로 정렬 가능.

## Base Styles (TDS `variant="spinner"`)

| Property                      | TDS Value                    | TDS Token / 출처 | thaki-shared Value             | Match    |
| ----------------------------- | ---------------------------- | ---------------- | ------------------------------ | -------- |
| 레이아웃                      | `flex flex-col items-center` | —                | `inline-block relative` (외곽) | **DIFF** |
| border-radius (스피너 그래픽) | — (아이콘)                   | Tabler path      | `rounded-full` (링)            | **DIFF** |
| animation                     | `animate-spin`               | Tailwind         | `animate-spin`                 | exact    |
| transition (스피너 본체)      | —                            | —                | —                              | —        |
| focus / cursor                | 없음 (비포커스 블록)         | —                | 없음                           | —        |

## Variants (TDS)

### `variant="spinner"` (LoadingSpinner 대응)

| State        | Spinner graphic                                      | Text                                                    | 비고                      |
| ------------ | ---------------------------------------------------- | ------------------------------------------------------- | ------------------------- |
| default      | `IconLoader2` + `text-[var(--color-action-primary)]` | `text-[var(--color-text-subtle)]`, optional `text` prop | `text` 기본값 `"Loading"` |
| hover/active | (애니메이션만)                                       | 동일                                                    | 인터랙션 없음             |
| disabled     | 없음                                                 | —                                                       | —                         |

**아이콘 색 resolve**: `--color-action-primary` → `--color-blue-600` → `#2563eb`

**캡션 텍스트 resolve**: `--color-text-subtle` → `--color-slate-500` → `#64748b`

### `variant="progress"`

| 영역       | 스타일                                                      | Resolved                        |
| ---------- | ----------------------------------------------------------- | ------------------------------- |
| 제목       | `text-body-lg font-medium text-[var(--color-text-default)]` | 14px/20px, `#0f172a`            |
| 설명       | `text-body-md`                                              | 12px/18px                       |
| 트랙 배경  | `bg-[var(--color-border-subtle)] h-1 rounded-lg`            | `#f1f5f9`, 4px 높이, 8px radius |
| 채움       | `bg-[var(--color-state-info)] transition-all duration-300`  | `#2563eb`, 300ms                |
| 영역 너비  | `w-[300px]`                                                 | 고정 300px                      |
| statusText | `text-body-md text-[var(--color-text-subtle)]`              | `#64748b`                       |

### `variant="button"`

| Property | Value                                                      | Resolved                 |
| -------- | ---------------------------------------------------------- | ------------------------ |
| 버튼     | `disabled`, `cursor-not-allowed`                           | —                        |
| 레이아웃 | `flex items-center justify-center gap-1.5`                 | gap 6px                  |
| 크기     | `min-w-[80px] px-3 py-2`                                   | min 80px, pad 12px / 8px |
| 배경     | `bg-[var(--color-border-strong)]`                          | `#cbd5e1`                |
| radius   | `rounded-[var(--primitive-radius-md)]`                     | `6px`                    |
| 아이콘   | `IconLoader2` size 12, stroke 2, `text-white animate-spin` | —                        |
| 라벨     | `text-body-md font-medium text-white`                      | 12px/16px                |

## Sizes

### TDS `variant="spinner"`

| Size | Icon (px) | Text classes                 | Line height (적용) | Gap (icon↔text) |
| ---- | --------- | ---------------------------- | ------------------ | --------------- |
| sm   | 16        | `text-body-sm` + `leading-4` | 11px / **16px**    | `gap-1.5` (6px) |
| md   | 22        | `text-body-md` + `leading-4` | 12px / **16px**    | `gap-2` (8px)   |
| lg   | 32        | `text-body-lg` + `leading-5` | 14px / **20px**    | `gap-3` (12px)  |

아이콘 `stroke={1.5}` (Tabler).

### thaki-shared `LoadingSpinner` (CVA)

| Size | Box (Tailwind) | Border  | 대략 외경 |
| ---- | -------------- | ------- | --------- |
| xs   | `size-3`       | `1.5px` | 12px      |
| sm   | `size-4`       | `2px`   | 16px      |
| md   | `size-6`       | `3px`   | 24px      |
| lg   | `size-8`       | `4px`   | 32px      |

**색 (`.spinner-*` in `shared-utilities.css`)**:

| color     | border (나머지)                | border-top (강조)            | tokens-light resolved (예시) |
| --------- | ------------------------------ | ---------------------------- | ---------------------------- |
| primary   | `--semantic-color-border`      | `--semantic-color-primary`   | `#e2e8f0` / `#2563eb`        |
| secondary | `--semantic-color-border`      | `--semantic-color-textLight` | `#e2e8f0` / `#d4d4d4`        |
| white     | `--semantic-color-textInverse` | 동일                         | `#ffffff`                    |

TDS는 스피너에 **색 variant 없음** (항상 primary 색 아이콘).

## Interactive States (동적)

| State             | TDS            | thaki-shared |
| ----------------- | -------------- | ------------ |
| 조건부 className  | 없음 (spinner) | 없음         |
| copied/success 등 | 해당 없음      | 해당 없음    |

## 아이콘 비교

| 항목      | TDS                                   | thaki-shared                                     |
| --------- | ------------------------------------- | ------------------------------------------------ |
| 구현      | `IconLoader2` (`@tabler/icons-react`) | CSS `border` 링 + `border-top-color` (path 없음) |
| viewBox   | Tabler 기본 (24×24 좌표계)            | —                                                |
| 렌더 크기 | 16 / 22 / 32 px (size)                | 12 / 16 / 24 / 32 px (box)                       |
| stroke    | 1.5 (spinner), 2 (button variant)     | border width 1.5~4px                             |
| 색        | `currentColor` → CSS color 토큰       | 테두리 색 조합                                   |

시각적으로 **회전하는 탭ler 로더** vs **끊긴 원형 링** — 형태가 다름.

## Props 기본값 비교

| Prop    | TDS `Loading` (spinner) | thaki-shared `LoadingSpinner` |
| ------- | ----------------------- | ----------------------------- |
| variant | `'spinner'`             | (없음)                        |
| size    | `'md'`                  | `'md'`                        |
| text    | `'Loading'`             | (없음 — 자식/라벨 없음)       |
| color   | (없음)                  | `'primary'`                   |

thaki-shared JSDoc에 `color="inverse"` 예시가 있으나 타입은 `'primary' \| 'secondary' \| 'white'` (`LoadingSpinner.types.ts`) — **문서와 API 불일치**.

## 주요 디자인 차이 요약

| #   | 항목              | TDS                                 | thaki-shared                      | 변경 유형      | 영향 범위                                | 마이그레이션                               |
| --- | ----------------- | ----------------------------------- | --------------------------------- | -------------- | ---------------------------------------- | ------------------------------------------ |
| 1   | 스피너 그래픽     | Tabler `IconLoader2` 회전           | 보더 링 `animate-spin`            | `style`        | 동일 영역도 완전 다른 실루엣             | 디자인 싱크 시 한쪽 패러다임 선택          |
| 2   | 크기 스케일       | sm/md/lg → 아이콘 16/22/32px        | xs/sm/md/lg → 12/16/24/32px       | `api-required` | `xs` 없음·중간 크기 불일치 (md 22 vs 24) | 사이즈 매핑표로 명시적 매핑 필요           |
| 3   | 캡션 텍스트       | 기본 `"Loading"` 포함 가능          | 컴포넌트에 텍스트 슬롯 없음       | `api-required` | 페이지 카피/레이아웃                     | 상위에서 텍스트 병치 또는 `text` prop 추가 |
| 4   | 스피너 색 variant | 없음 (항상 primary)                 | `primary` / `secondary` / `white` | `api-required` | secondary·white 사용처                   | TDS에 `color` 류 prop 추가 또는 토큰 래핑  |
| 5   | 추가 UI           | `progress`, `button` 변형 동일 파일 | 없음                              | `style` (범위) | 풀 패리티 시 별도 컴포넌트               | Progress/Button 패턴 별도 이행             |
| 6   | 문서              | —                                   | `inverse` 언급 vs 실제 `white`    | `api-required` | 문서만                                   | JSDoc을 `white`로 정정                     |

## Token Mapping (참조)

| TDS Token                                | TDS Resolved | thaki-shared Token                               | shared Resolved | Match              |
| ---------------------------------------- | ------------ | ------------------------------------------------ | --------------- | ------------------ |
| `--color-action-primary`                 | `#2563eb`    | `--semantic-color-primary`                       | `#2563eb`       | exact              |
| `--color-text-subtle`                    | `#64748b`    | (스피너 미사용; `textLight` 등 별도)             | —               | —                  |
| `--color-border-strong` (button variant) | `#cbd5e1`    | `--semantic-color-borderStrong`                  | `#cbd5e1`       | exact              |
| `--primitive-radius-md`                  | `6px`        | `--semantic-radius-base6` 등 버튼 쪽과 별도 확인 | 6px 계열        | exact              |
| `--color-border-subtle` (progress track) | `#f1f5f9`    | `--semantic-color-borderSubtle`                  | `#f1f5f9`       | exact              |
| `--color-state-info` (progress fill)     | `#2563eb`    | `--semantic-color-primary` (동일 역할)           | `#2563eb`       | exact              |
| secondary 스피너 상단색 (shared만)       | —            | `--semantic-color-textLight`                     | `#d4d4d4`       | TDS에 대응 색 없음 |
