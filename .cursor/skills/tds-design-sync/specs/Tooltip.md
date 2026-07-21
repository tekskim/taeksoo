# Tooltip Design Spec

> Extracted from TDS `src/design-system/components/Tooltip/Tooltip.tsx`
> thaki-shared target: `src/components/Tooltip/`

## Base Styles

| Property              | TDS Value                              | TDS Token                                | Resolved    |
| --------------------- | -------------------------------------- | ---------------------------------------- | ----------- |
| padding-x             | 6px                                    | --tooltip-padding-x → --spacing-1-5      | 6px         |
| padding-y             | 4px                                    | --tooltip-padding-y → --spacing-1        | 4px         |
| border-radius         | 4px                                    | --tooltip-radius → --radius-sm           | 4px         |
| font-size             | 11px                                   | --tooltip-font-size → --font-size-11     | 11px        |
| line-height           | 16px                                   | --tooltip-line-height → --line-height-16 | 16px        |
| font-weight           | 400 (regular)                          | (implicit)                               | 400         |
| text-align            | center                                 | —                                        | center      |
| min-width             | 60px                                   | --tooltip-min-width                      | 60px        |
| max-width             | 240px                                  | --tooltip-max-width                      | 240px       |
| width                 | w-max                                  | —                                        | max-content |
| bg-color              | #0f172a (light) / surface-muted (dark) | --tooltip-bg → --color-slate-900         | #0f172a     |
| text-color            | #ffffff (light) / text-default (dark)  | --tooltip-text → --color-white           | #ffffff     |
| arrow-size            | 4px                                    | --tooltip-arrow-size                     | 4px         |
| z-index               | 1400                                   | --z-tooltip                              | 1400        |
| gap (trigger↔tooltip) | 6px                                    | hardcoded                                | 6px         |
| transition            | opacity 150ms                          | --duration-fast                          | 150ms       |
| word-break            | (not set, default)                     | —                                        | —           |
| white-space           | (not set, wraps naturally)             | —                                        | —           |

## TDS Tooltip Detailed Style Breakdown

### Trigger Wrapper

| Property | TDS           | thaki-shared  | Match |
| -------- | ------------- | ------------- | ----- |
| display  | `inline-flex` | `inline-flex` | ✅    |

### Tooltip Box

| Property      | TDS                                                                | thaki-shared                                | Match    |
| ------------- | ------------------------------------------------------------------ | ------------------------------------------- | -------- |
| background    | `var(--tooltip-bg)` → `#0f172a`                                    | `var(--semantic-color-text)` → `#0f172a`    | ✅ exact |
| text color    | `var(--tooltip-text)` → `#ffffff`                                  | `var(--semantic-color-surface)` → `#ffffff` | ✅ exact |
| padding-x     | `var(--tooltip-padding-x)` → 6px                                   | `px-1.5` → 6px                              | ✅ exact |
| padding-y     | `var(--tooltip-padding-y)` → 4px                                   | `py-1` → 4px                                | ✅ exact |
| border-radius | `var(--tooltip-radius)` → 4px                                      | `rounded-base` → 4px                        | ✅ exact |
| font-size     | `var(--tooltip-font-size)` → 11px                                  | `text-11` → 11px                            | ✅ exact |
| line-height   | `var(--tooltip-line-height)` → 16px                                | `leading-16` → 16px                         | ✅ exact |
| font-weight   | (normal, not set)                                                  | `font-normal`                               | ✅ exact |
| font-family   | (inherited)                                                        | `font-sans`                                 | ✅       |
| text-align    | `text-center`                                                      | `text-center`                               | ✅ exact |
| min-width     | `var(--tooltip-min-width)` → 60px                                  | `min-w-[60px]`                              | ✅ exact |
| max-width     | `var(--tooltip-max-width)` → 240px                                 | `max-w-[240px]`                             | ✅ exact |
| width         | `w-max`                                                            | `w-max`                                     | ✅ exact |
| word-break    | (not set)                                                          | `break-words`                               | ⚠️ diff  |
| white-space   | (not set — natural wrapping)                                       | `whitespace-normal`                         | ✅ ~same |
| transition    | `opacity` via `transition-opacity duration-[var(--duration-fast)]` | `transition-opacity duration-fast`          | ✅ exact |
| opacity logic | `opacity: isPositioned ? 1 : 0`                                    | `opacity-100` (always once rendered)        | ⚠️ diff  |

### Arrow

| Property    | TDS                               | thaki-shared                     | Match   |
| ----------- | --------------------------------- | -------------------------------- | ------- |
| arrow size  | `var(--tooltip-arrow-size)` → 4px | CSS `tooltip-arrow` pseudo class | ⚠️ diff |
| arrow color | matches tooltip bg                | matches tooltip bg               | ✅      |

### Positioning

| Property       | TDS                               | thaki-shared                      | Match     |
| -------------- | --------------------------------- | --------------------------------- | --------- |
| mechanism      | `createPortal` + manual rect calc | `Portal` (CSS Anchor Positioning) | different |
| gap            | 6px (hardcoded `const gap = 6`)   | 6px (`TOOLTIP_GAP_PX = 6`)        | ✅ exact  |
| z-index        | `var(--z-tooltip)` → 1400         | (from Portal)                     | check     |
| viewport clamp | yes (8px margin)                  | (from Portal/browser)             | ~same     |
| arrow tracking | yes (follows clamped position)    | N/A (CSS arrow)                   | different |

## Props Comparison

| Prop       | TDS                                                   | thaki-shared                   | Match                                                       |
| ---------- | ----------------------------------------------------- | ------------------------------ | ----------------------------------------------------------- |
| content    | `ReactNode`                                           | `ReactNode`                    | ✅                                                          |
| position   | `'top'\|'bottom'\|'left'\|'right'` (default: `'top'`) | `Direction` (default: `'top'`) | ⚠️ TDS has 4, shared has more (top-start, bottom-end, etc.) |
| delay      | `number` (default: 200)                               | ❌ not in shared               | ❌ missing                                                  |
| disabled   | `boolean` (default: false)                            | ❌ not in shared               | ❌ missing                                                  |
| children   | `ReactNode`                                           | `ReactNode`                    | ✅                                                          |
| className  | N/A                                                   | `string`                       | shared-only                                                 |
| visibile   | N/A                                                   | `boolean`                      | shared-only (typo: should be "visible")                     |
| focusable  | N/A                                                   | `boolean`                      | shared-only                                                 |
| triggerRef | N/A                                                   | `RefObject`                    | shared-only                                                 |

## Interactive States

| State       | Condition           | Style Applied                                                  |
| ----------- | ------------------- | -------------------------------------------------------------- |
| hidden      | not hovered/focused | not rendered                                                   |
| visible     | hover/focus         | portal rendered, opacity 1                                     |
| positioning | just rendered       | TDS: opacity 0 until positioned; shared: immediately opacity 1 |

## CSS 구현 기법 차이

| 요소         | 시각 효과   | TDS 기법                                        | thaki-shared 기법                 | 차이 영향                              |
| ------------ | ----------- | ----------------------------------------------- | --------------------------------- | -------------------------------------- |
| 포지셔닝     | 위치 계산   | `createPortal` + manual `getBoundingClientRect` | `Portal` (CSS Anchor Positioning) | 동작은 유사, 구현 다름 — 변경 불필요   |
| 화살표       | 삼각형 표시 | CSS border trick (`border-[length:4px]`)        | CSS pseudo `tooltip-arrow` class  | 스타일만, 변경 불필요                  |
| opacity 전환 | 나타남 효과 | `opacity: isPositioned ? 1 : 0`                 | `opacity-100` (즉시)              | TDS는 위치 계산 후 표시, shared는 즉시 |

## CVA Base 상속 분석

thaki-shared Tooltip은 CVA를 사용하지 않음. `tooltipContentStyles`는 단일 문자열 상수.

→ 상속 리셋 불필요.

## 아이콘 비교

Tooltip 자체에 아이콘 없음. N/A.

## Token Mapping

| TDS Token             | TDS Resolved | thaki-shared Token                       | shared Resolved | Match    |
| --------------------- | ------------ | ---------------------------------------- | --------------- | -------- |
| --tooltip-padding-x   | 6px          | `px-1.5` (hardcoded)                     | 6px             | ✅ exact |
| --tooltip-padding-y   | 4px          | `py-1` (hardcoded)                       | 4px             | ✅ exact |
| --tooltip-radius      | 4px          | `rounded-base` → --primitive-radius-base | 4px             | ✅ exact |
| --tooltip-font-size   | 11px         | `text-11`                                | 11px            | ✅ exact |
| --tooltip-line-height | 16px         | `leading-16`                             | 16px            | ✅ exact |
| --tooltip-bg          | #0f172a      | `--semantic-color-text`                  | #0f172a         | ✅ exact |
| --tooltip-text        | #ffffff      | `--semantic-color-surface`               | #ffffff         | ✅ exact |
| --tooltip-min-width   | 60px         | `min-w-[60px]` (hardcoded)               | 60px            | ✅ exact |
| --tooltip-max-width   | 240px        | `max-w-[240px]` (hardcoded)              | 240px           | ✅ exact |
| --tooltip-arrow-size  | 4px          | (CSS pseudo)                             | (check)         | check    |
| gap (trigger↔tooltip) | 6px          | `TOOLTIP_GAP_PX = 6`                     | 6px             | ✅ exact |
| --duration-fast       | 150ms        | `duration-fast`                          | 150ms           | ✅ exact |

## 주요 디자인 차이

| #   | 항목              | TDS                                 | thaki-shared                                           | 유형                          | 영향 범위 | 마이그레이션 |
| --- | ----------------- | ----------------------------------- | ------------------------------------------------------ | ----------------------------- | --------- | ------------ |
| 1   | `break-words`     | 없음 (기본 word-break)              | `break-words` 적용                                     | style                         | —         | —            |
| 2   | 위치 방향 옵션    | 4개 (top/bottom/left/right)         | Direction (top/bottom/left/right + start/end variants) | — (shared superset)           | —         | —            |
| 3   | `delay` prop      | 200ms (configurable)                | 없음                                                   | — (기능 차이, 싱크 범위 외)   | —         | —            |
| 4   | `disabled` prop   | boolean                             | 없음                                                   | — (기능 차이, 싱크 범위 외)   | —         | —            |
| 5   | Arrow 구현        | CSS border trick + dynamic tracking | CSS pseudo class                                       | — (구현 차이, 변경 불필요)    | —         | —            |
| 6   | opacity 전환 로직 | 위치 계산 후 fade-in                | 즉시 표시                                              | — (미세 UX 차이, 변경 불필요) | —         | —            |

## 결론

**thaki-shared Tooltip의 디자인 토큰은 TDS와 이미 완전히 일치합니다.** 모든 핵심 시각 속성(padding, radius, font-size, line-height, colors, min/max width, gap, transition)이 동일한 값으로 해석됩니다.

유일한 미세 차이는 `break-words` (shared에만 있음)인데, 이는 긴 단어가 줄 바꿈되도록 하는 방어적 처리로 제거보다 유지가 합리적입니다.

기능 차이(`delay`, `disabled`, arrow tracking 등)는 디자인 싱크 범위 밖이며, shared의 `Portal` 기반 포지셔닝은 TDS의 수동 계산 방식과 동등한 결과를 냅니다.

**디자인 싱크 필요 변경사항: 0건**
