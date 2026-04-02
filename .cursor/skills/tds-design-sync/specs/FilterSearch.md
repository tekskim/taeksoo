# FilterSearch Design Spec

> Extracted from TDS `src/design-system/components/Input/FilterSearchInput.tsx`
> thaki-shared target: `src/components/FilterSearch/`

## Architecture Difference (Partial Mapping)

| Aspect          | TDS                               | thaki-shared                                                                          |
| --------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| Structure       | Self-contained single file        | Multi-component (FilterSearchInput, FilterDropdown, FilterLabel, FilterSearchResults) |
| Search input    | Inline `<input>` with wrapper div | `SearchInput` (wraps `Input` component)                                               |
| Filter types    | `text`, `select`                  | `input`, `number`, `select`, `dateRange`                                              |
| Applied filters | `Chip` component inline           | `FilterSearchResults` with `Tag` component (separate)                                 |
| Filter prefix   | Inline `<span>`                   | `FilterLabel` component                                                               |
| Dropdown        | Inline absolute div               | `FilterDropdown` + `Portal`                                                           |
| Icon            | `IconSearch` (Tabler, 12px)       | `SearchIcon` (custom Icon, via SearchInput)                                           |

> Since SearchInput wraps Input, the search input styling is already inherited from the Input sync. Focus is on: **inputModeContainer**, **dropdown**, **filterLabel**, and **resetTrigger** styles.

## Input Wrapper (inputModeContainer / fieldSurface)

| Property                     | TDS                                                                                                       | thaki-shared                                     | Match                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------- |
| border                       | `border-[length:var(--input-border-width)] border-solid border-[var(--input-border)]` (1px solid #cbd5e1) | `ring-1 ring-inset ring-border-strong` (#cbd5e1) | ❌ DIFF (technique: ring vs border) |
| background                   | `bg-[var(--input-bg)]` (#ffffff)                                                                          | `bg-surface` (#ffffff)                           | exact                               |
| border-radius                | `rounded-[var(--input-radius)]` (6px, radius-md)                                                          | `rounded-base6` (6px)                            | exact                               |
| padding (inputWrapper)       | `px-[var(--input-padding-x)]` (10px)                                                                      | `py-1.5 px-2 pl-2.5` (6px/8px/10px)              | ❌ DIFF                             |
| padding (inputModeContainer) | N/A (TDS has no separate mode)                                                                            | `py-1 px-2` (4px/8px)                            | —                                   |
| transition                   | `transition-all duration-[var(--duration-fast)]` (150ms)                                                  | `transition-shadow duration-200`                 | ❌ DIFF                             |
| height (sm)                  | `h-[var(--search-input-height-sm)]` (28px)                                                                | (inherits from SearchInput)                      | —                                   |
| height (md)                  | `h-[var(--search-input-height-md)]` (28px)                                                                | (inherits from SearchInput)                      | —                                   |

## Focus State

| Property    | TDS                                            | thaki-shared                  | Match |
| ----------- | ---------------------------------------------- | ----------------------------- | ----- |
| border      | `border-[var(--input-border-focus)]` (#2563eb) | (via SearchInput/Input focus) | —     |
| ring/shadow | `shadow-[0_0_0_1px_var(--input-border-focus)]` | (via SearchInput/Input focus) | —     |

> Focus is handled by SearchInput in search mode. For inputModeContainer, thaki-shared does not apply explicit focus styling.

## Dropdown Styling

| Property      | TDS                                                    | thaki-shared                            | Match            |
| ------------- | ------------------------------------------------------ | --------------------------------------- | ---------------- |
| background    | `bg-[var(--color-surface-default)]` (#fff)             | `bg-surface` (#fff)                     | exact            |
| border        | `border border-[var(--color-border-strong)]` (#cbd5e1) | `border border-border-strong` (#cbd5e1) | exact            |
| border-radius | `rounded-[var(--context-menu-radius)]` (6px)           | `rounded-base6` (6px)                   | exact            |
| shadow        | `shadow-[var(--shadow-md)]`                            | `shadow-lg`                             | ❌ DIFF          |
| max-height    | none                                                   | `max-h-[300px] overflow-y-auto`         | — (shared extra) |

## Dropdown Item

| Property             | TDS                                                     | thaki-shared                                   | Match                |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------- | -------------------- |
| padding-x            | `px-[var(--context-menu-padding-x)]` (12px, spacing-3)  | `px-2.5` (10px)                                | ❌ DIFF              |
| padding-y            | `py-[var(--context-menu-padding-y)]` (6px, spacing-1.5) | `py-1.5` (6px)                                 | exact                |
| font-size            | `text-body-sm` (11px)                                   | `text-11` (11px)                               | exact                |
| font-weight          | (regular 400, via text-body-sm)                         | `font-medium` (500)                            | ❌ DIFF              |
| line-height          | (16px, via text-body-sm)                                | `leading-16` (16px)                            | exact                |
| text-color           | `text-[var(--color-text-default)]` (#0f172a)            | `text-text`                                    | exact (token-global) |
| hover-bg             | `hover:bg-[var(--context-menu-hover-bg)]` (#f1f5f9)     | `hover:bg-surface-hover` (#f1f5f9)             | exact                |
| transition           | `duration-[var(--duration-fast)]` (150ms)               | `duration-200` (200ms)                         | ❌ DIFF              |
| border-bottom        | none                                                    | `border-b border-border-muted` (between items) | ❌ DIFF              |
| border-radius (item) | none                                                    | `first:rounded-t-base6 last:rounded-b-base6`   | ❌ DIFF              |

## Filter Label / Prefix

| Property      | TDS (inline span)                                  | thaki-shared (FilterLabel)         | Match              |
| ------------- | -------------------------------------------------- | ---------------------------------- | ------------------ |
| background    | `bg-[var(--color-surface-subtle)]` (#f8fafc)       | `bg-surface` (#fff)                | ❌ DIFF            |
| border        | none                                               | `border border-border` (#e2e8f0)   | ❌ DIFF            |
| border-radius | `rounded` (4px)                                    | `rounded-base4` (4px)              | exact              |
| padding       | `px-2 py-0.5` (8px/2px)                            | `py-0.5 pl-2 pr-1.5` (2px/8px/6px) | close              |
| font-size     | `text-body-sm` (11px)                              | `text-11` (11px)                   | exact              |
| font-weight   | (regular 400) label: `text-label-sm` (500)         | `font-medium` (500)                | exact (label part) |
| separator     | `text-[var(--color-border-strong)]` (#cbd5e1) pipe | `text-border` (#e2e8f0) pipe       | ❌ DIFF            |

## Applied Filters Area

| Property      | TDS                                                     | thaki-shared (FilterSearchResults) | Match                         |
| ------------- | ------------------------------------------------------- | ---------------------------------- | ----------------------------- |
| background    | `bg-[var(--color-surface-subtle)]` (#f8fafc)            | `bg-surface-muted` (#f1f5f9)       | ❌ DIFF                       |
| border-radius | `rounded-[var(--radius-md)]` (6px)                      | `rounded-md` (6px)                 | exact                         |
| padding       | `pl-2 pr-4 py-2`                                        | `p-2` (8px)                        | ❌ DIFF                       |
| chip/tag      | `Chip` component                                        | `Tag` component                    | partial (different component) |
| clear button  | `text-label-sm text-[var(--color-action-primary)]` link | `Button size="sm" variant="ghost"` | ❌ DIFF                       |

## 주요 디자인 차이 (요약)

| #   | 항목                          | Before (thaki-shared)                        | After (TDS 기준)               | 유형    |
| --- | ----------------------------- | -------------------------------------------- | ------------------------------ | ------- |
| 1   | fieldSurface border technique | `ring-1 ring-inset ring-border-strong`       | `border border-border-strong`  | `style` |
| 2   | inputWrapper padding          | `py-1.5 px-2 pl-2.5`                         | `px-2.5` (10px symmetric)      | `style` |
| 3   | transition                    | `transition-shadow duration-200`             | `transition-all duration-150`  | `style` |
| 4   | dropdown shadow               | `shadow-lg`                                  | `shadow-md`                    | `style` |
| 5   | dropdown item padding-x       | `px-2.5` (10px)                              | `px-3` (12px)                  | `style` |
| 6   | dropdown item font-weight     | `font-medium` (500)                          | `font-regular` (400)           | `style` |
| 7   | dropdown item border-bottom   | `border-b border-border-muted`               | none                           | `style` |
| 8   | dropdown item border-radius   | `first:rounded-t-base6 last:rounded-b-base6` | none (container has radius)    | `style` |
| 9   | filterLabel background        | `bg-surface` (white)                         | `bg-surface-subtle` (#f8fafc)  | `style` |
| 10  | filterLabel border            | `border border-border`                       | none                           | `style` |
| 11  | filterLabel separator color   | `text-border` (#e2e8f0)                      | `text-border-strong` (#cbd5e1) | `style` |
| 12  | results area bg               | `bg-surface-muted` (#f1f5f9)                 | `bg-surface-subtle` (#f8fafc)  | `style` |
| 13  | transition duration (items)   | `duration-200` (200ms)                       | `duration-150` (150ms)         | `style` |

## API Changes Required

없음 — 스타일 변경만으로 대응 가능. 구조적 차이(Chip vs Tag, SearchInput vs inline input)는 디자인 싱크 범위 외.
