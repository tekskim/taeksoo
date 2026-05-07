# Badge Design Spec

> Extracted from TDS `src/design-system/components/Badge/Badge.tsx`
> thaki-shared target: `src/components/Badge/` (1:1 매핑, component-map)

## Component Mapping

| 항목        | TDS                                                                                                 | thaki-shared                                                |
| ----------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 매핑        | `Badge`                                                                                             | `Badge`                                                     |
| 스타일 정의 | `Badge.tsx` 내 `themeStyles` / `sizes`                                                              | `Badge.styles.ts` (`badgeVariants` cva)                     |
| 테마 이름   | `blue` \| `red` \| `green` \| `yellow` \| `gray` \| `white` + 별칭 `blu` \| `gry` \| `gre` \| `ylw` | `blu` \| `red` \| `gre` \| `ylw` \| `gry` 만 (`white` 없음) |

## Base Styles

| Property                    | Value (TDS resolved)                      | TDS Token / class                                                                           |
| --------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| Layout                      | `inline-flex items-center justify-center` | —                                                                                           |
| Gap (아이콘–텍스트)         | 4px                                       | `--badge-gap` → `--spacing-1`                                                               |
| Font weight                 | 500                                       | `font-medium`                                                                               |
| Min width                   | 20px                                      | `min-w-[20px]`                                                                              |
| Text align                  | center                                    | `text-center`                                                                               |
| Border radius               | 4px                                       | `--badge-radius` → `--radius-sm`                                                            |
| White / subtle-white border | 1px inset ring                            | `shadow-[inset_0_0_0_1px_var(--badge-white-border)]` (`--color-border-default` → `#e2e8f0`) |
| Transition                  | 없음                                      | —                                                                                           |
| Focus-visible               | 없음 (span, 비포커스블)                   | —                                                                                           |
| Cursor                      | 기본                                      | —                                                                                           |

thaki-shared base: `inline-flex items-center gap-1 rounded-base6 font-sans font-medium whitespace-nowrap box-border` — radius `--semantic-radius-base6` = **6px** (`0.375rem`), TDS는 **4px**.

## Variants

### type="solid"

| theme  | Background                                                 | Text                               | Border / 기타                     |
| ------ | ---------------------------------------------------------- | ---------------------------------- | --------------------------------- |
| blue   | `#2563eb` (`--color-state-info` → `--color-blue-600`)      | `#ffffff`                          | —                                 |
| red    | `#ef4444` (`--color-state-danger` → `--color-red-500`)     | `#ffffff`                          | —                                 |
| green  | `#22c55e` (`--color-state-success` → `--color-green-500`)  | `#ffffff`                          | —                                 |
| yellow | `#f97316` (`--color-state-warning` → `--color-orange-500`) | `#ffffff`                          | 이름은 yellow, 색은 **orange500** |
| gray   | `#64748b` (`--color-text-subtle` → `--color-slate-500`)    | `#ffffff`                          | —                                 |
| white  | `#ffffff` (`--color-surface-default`)                      | `#0f172a` (`--color-text-default`) | inset 1px `--badge-white-border`  |

### type="subtle"

| theme  | Background                                      | Text                                                            |
| ------ | ----------------------------------------------- | --------------------------------------------------------------- |
| blue   | `#dbeafe` (`--color-blue-100`)                  | `#1e40af` (`--color-state-info-text` → `--color-blue-800`)      |
| red    | `#fee2e2` (`--color-red-100`)                   | `#dc2626` (`--color-state-danger-text` → `--color-red-600`)     |
| green  | `#dcfce7` (`--color-green-100`)                 | `#16a34a` (`--color-state-success-text` → `--color-green-600`)  |
| yellow | `#ffedd5` (`--color-orange-100`)                | `#ea580c` (`--color-state-warning-text` → `--color-orange-600`) |
| gray   | `#f1f5f9` (`--color-surface-muted` / slate-100) | `#475569` (`--badge-subtle-gray-text` 고정)                     |
| white  | `#ffffff`                                       | `#0f172a` + inset border (solid와 동일)                         |

### thaki-shared compoundVariants (요약)

| theme | type   | shared 클래스 의미                                 | TDS와의 관계                                                                                |
| ----- | ------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| red   | subtle | `text-primitive-red-600 bg-primitive-red-100`      | subtle red: hex 일치 경향 (`#dc2626` / `#fee2e2`)                                           |
| red   | solid  | `text-primitive-red-50 bg-primitive-red-600`       | solid: 동일 계열                                                                            |
| ylw   | subtle | `text-primitive-yellow-500 bg-primitive-yellow-50` | TDS subtle yellow는 **orange** 계열 배경/텍스트 → **시각 큰 차이**                          |
| ylw   | solid  | `text-primitive-yellow-50 bg-primitive-yellow-500` | TDS solid yellow는 **orange500** 배경 → **hue 불일치**                                      |
| gry   | subtle | `text-text-muted bg-primitive-blueGray-100`        | 배경 `#f1f5f9` TDS gray subtle과 동일 계열                                                  |
| gry   | solid  | `text-primitive-blueGray-50 bg-text-muted`         | TDS gray solid는 **slate-500** 배경 + 흰 텍스트 — shared는 **textMuted** 배경 + 연한 텍스트 |
| blu   | subtle | `text-primitive-blue-500 bg-primitive-blue-50`     | TDS는 텍스트 **blue-800**, 배경 **blue-100**                                                |
| blu   | solid  | `text-primitive-blue-50 bg-primitive-blue-500`     | blue 계열은 대체로 근접                                                                     |
| gre   | subtle | `text-primitive-green-600 bg-primitive-green-50`   | TDS green-600 텍스트 / green-100 배경과 유사                                                |
| gre   | solid  | `text-primitive-green-50 bg-primitive-green-600`   | 유사                                                                                        |

## Sizes

| Size | Height (TDS)             | Padding X | Padding Y (토큰)             | Font size | Line height | Gap | Icon                  |
| ---- | ------------------------ | --------- | ---------------------------- | --------- | ----------- | --- | --------------------- |
| sm   | 20px (`h-5` → spacing-5) | 6px       | 2px (`--badge-padding-y-sm`) | 11px      | 16px        | 4px | 자식에 크기 제약 없음 |
| md   | 24px (`h-6`)             | 8px       | 2px (`--badge-padding-y-md`) | **13px**  | **18px**    | 4px | 동일                  |

**thaki-shared**

| Size | Classes                            | 대략적 해상도                                    |
| ---- | ---------------------------------- | ------------------------------------------------ |
| sm   | `py-0.5 px-1.5 text-11 leading-16` | 11px / 16px 줄, 패딩 2px+6px 가로                |
| md   | `py-1 px-2 text-12 leading-16`     | **12px** / 16px 줄 — TDS md **13px/18px**와 다름 |
| lg   | `py-1 px-3 text-14 leading-20`     | TDS에 **lg 사이즈 없음**                         |

**아이콘 (thaki-shared만 명시적 크기)**

| Badge size | Icon size (px) |
| ---------- | -------------- |
| sm         | 12             |
| md         | 16             |
| lg         | 18             |

TDS는 `leftIcon`/`rightIcon`에 크기 강제 없음 (소비자가 Tabler 등에서 지정).

## Interactive States (동적)

| State          | 조건                     | TDS                                                                                 |
| -------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| dot            | `dot === true`           | solid: 점 `bg-white/50`; subtle: 테마별 시맨틱 색 점. 크기 `--badge-dot-size` (6px) |
| legacy variant | `variant` + `theme` 없음 | `type` → `subtle`, 테마 → variant 매핑 (`default`→gray 등)                          |

thaki-shared: **dot 없음**. `layout`/`icon`으로 아이콘만 지원.

## 아이콘 비교

| 항목             | TDS                                                        | thaki-shared                                |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------- |
| API              | `leftIcon` / `rightIcon` (ReactNode), 별칭 `layout`+`icon` | `layout` + `icon` → `Icon` 래퍼로 렌더      |
| 라이브러리       | Tabler 등 임의 (문서 예시)                                 | `../Icon` 컴포넌트로 감쌈                   |
| 크기             | 비컴포넌트 고정 없음                                       | sm/md/lg별 **12 / 16 / 18**                 |
| viewBox / stroke | 소비자 정의                                                | Icon 시스템에 따름 — Tabler와 1:1 보장 없음 |

## Props 기본값 비교

| Prop    | TDS default                | thaki-shared default | 영향                                        |
| ------- | -------------------------- | -------------------- | ------------------------------------------- |
| `type`  | **`solid`**                | **`subtle`**         | 동일 마크업 시 배경/텍스트 대비 완전히 다름 |
| `theme` | **`white`** (명시 없을 때) | **`gry`**            | 기본 배지 색이 흰(테두리) vs 회색 subtle    |
| `size`  | `md`                       | `md`                 | 동일 이름이나 md 타이포가 13px vs 12px      |
| `dot`   | `false`                    | (없음)               | —                                           |

**마이그레이션 (기존 shared 기본 유지 시):** `theme="gry" type="subtle"` 를 명시하거나, TDS 기본에 맞추려면 `theme="white" type="solid"` 를 기본으로 통일할지 제품 결정 필요.

## Token Mapping (참조)

| TDS Token                              | TDS Resolved      | thaki-shared / 비고                            | Match              |
| -------------------------------------- | ----------------- | ---------------------------------------------- | ------------------ |
| `--badge-radius`                       | 4px               | `rounded-base6` → 6px                          | ❌ DIFF (radius)   |
| `--badge-font-size-md`                 | 13px              | `text-12` → semantic 12px                      | ❌ DIFF            |
| `--badge-line-height-md`               | 18px              | `leading-16`                                   | ❌ DIFF            |
| `--color-state-warning` (yellow solid) | `#f97316`         | `ylw` solid → `primitive-yellow-500` `#eab308` | ❌ DIFF            |
| `--badge-subtle-yellow-*`              | orange 계열       | yellow50/yellow500                             | ❌ DIFF            |
| `--color-text-subtle` (gray solid)     | `#64748b`         | gry solid: `bg-text-muted` `#475569` 등        | ❌ DIFF            |
| `--color-state-info` / blue subtle     | blue100 + blue800 | blue50 + blue500                               | likely (대비 다름) |
| `--color-state-success`                | `#22c55e`         | green 계열 primitive                           | exact 경향         |
| `--color-state-danger`                 | `#ef4444`         | red500/600 primitive                           | exact 경향         |

## 주요 디자인 차이 요약

| #   | 항목                  | Before (thaki-shared)         | After (TDS)                                     | 유형                                                                                |
| --- | --------------------- | ----------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | 기본 `type`           | `subtle`                      | `solid`                                         | api-required — props 미지정 시 대비·채도가 다름. 기존 동작: `type="subtle"` 명시    |
| 2   | 기본 `theme`          | `gry`                         | `white`                                         | api-required — 기본이 회색 subtle vs 흰 solid+테두리. 기존 동작: `theme="gry"` 명시 |
| 3   | Corner radius         | 6px (`rounded-base6`)         | 4px (`--radius-sm`)                             | style                                                                               |
| 4   | md 타이포             | 12px / 16px 줄                | 13px / 18px 줄                                  | style                                                                               |
| 5   | `size="lg"`           | 있음 (14px/20px 등)           | 없음                                            | api-required — TDS에 대응 없음; UI 유지 시 로컬 스타일 또는 확장 검토               |
| 6   | Yellow / Warning 색   | yellow 팔레트 (`#eab308` 등)  | orange 시맨틱 (`#f97316`, orange100/600 subtle) | style                                                                               |
| 7   | Gray solid            | `bg-text-muted` + 연한 텍스트 | slate-500 배경 + 흰 텍스트                      | style                                                                               |
| 8   | Dot indicator         | 없음                          | `dot` + 6px 원                                  | style (기능 차이)                                                                   |
| 9   | White 테마            | 없음                          | solid/subtle white + inset border               | style                                                                               |
| 10  | 아이콘                | `Icon` 래퍼 고정 크기         | 자유 ReactNode                                  | style                                                                               |
| 11  | Legacy `variant` prop | 없음                          | 있음 (`@deprecated`)                            | api-required — 마이그레이션 시 `theme`/`type`으로 치환                              |
