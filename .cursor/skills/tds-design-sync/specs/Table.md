# Table Design Spec

> Extracted from TDS `src/design-system/components/Table/Table.tsx` and `src/index.css` (table tokens)  
> thaki-shared target: `src/components/Table/` (`Table.tsx`, `Table.styles.ts`)  
> Light theme resolved values unless noted.

## Base Styles

| Property                                    | TDS Value                                              | TDS Token                            | thaki-shared Value                                                | thaki-shared Token                                                    | Match             |
| ------------------------------------------- | ------------------------------------------------------ | ------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------- |
| Layout model                                | Flex column + flex rows (`<div>`), no `<table>`        | —                                    | `<table class="border-separate">`, `<thead>` / `<tbody>` / `<tr>` | `tableStyles.table` + `tableAuto`/`table`                             | No (DOM / layout) |
| Outer scroll                                | `overflow-x-auto` (+ `overflow-y-auto` if `maxHeight`) | —                                    | `overflow-x-auto` on wrapper                                      | `tableStyles.container`                                               | Yes               |
| Min table width                             | From columns / `min-w-fit`                             | —                                    | `min-w-[600px]` (fixed layout)                                    | `tableStyles.table`                                                   | No                |
| Gap between header block and first body row | 4px                                                    | `--table-row-gap` → `--spacing-1`    | 4px vertical (`0.25rem`)                                          | `[border-spacing:0_var(--semantic-space-xs)]` → `--semantic-space-xs` | Yes (4px)         |
| Gap between body rows                       | 4px                                                    | `--table-row-gap`                    | 4px                                                               | same `border-spacing`                                                 | Yes (4px)         |
| Row corner radius                           | 6px                                                    | `--table-row-radius` → `--radius-md` | 6px                                                               | `rounded-*-base6` → `--semantic-radius-base6` (`0.375rem`)            | Yes               |
| Default border color                        | `#e2e8f0`                                              | `--color-border-default`             | `#e2e8f0`                                                         | `border-border` → `--semantic-color-border`                           | Yes               |
| Expanded row separator                      | 1px subtle                                             | `--color-border-subtle`              | 1px subtle                                                        | `border-[var(--semantic-color-borderSubtle)]`                         | Yes               |
| Sticky header behavior                      | Sticky when `stickyHeader` **or** `maxHeight`          | —                                    | `thead` always `sticky top-0 z-10`                                | `theadSticky`                                                         | No (gating)       |
| Sticky right column shadow (TDS only)       | `-8px 0 16px -4px rgba(0,0,0,0.04)`                    | —                                    | (last column uses sticky + bg, no same shadow)                    | `stickyLast` / `shadow-*` absent                                      | No                |

## Header Cell (th)

| Property                | TDS Value                                        | thaki-shared Value                                            | Match                                   |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------------------- | --------------------------------------- |
| Min row height          | 48px                                             | `h-12` (48px)                                                 | Yes                                     |
| Padding X               | 12px                                             | `px-[12px]`                                                   | Yes                                     |
| Padding Y               | 8px (`--table-header-padding-y` → `--spacing-2`) | `py-[8px]`                                                    | Yes                                     |
| Font size               | 11px                                             | `text-11` → `--primitive-font-size-11`                        | Yes                                     |
| Line height             | 16px                                             | `leading-16` → 16px                                           | Yes                                     |
| Font weight             | 500                                              | `font-medium`                                                 | Yes                                     |
| Text color              | `#0f172a`                                        | `text-text` → `--semantic-color-text`                         | Manual (token-map: text hex may differ) |
| Background              | `#f8fafc`                                        | `theadTr` `bg-surface-subtle` → `#f8fafc`                     | Yes                                     |
| Label ↔ sort icon gap   | 4px (`gap-1`)                                    | 6px (`gap-[var(--semantic-space-1-5)]`)                       | No                                      |
| Sortable hover          | `hover:text-[var(--color-action-primary)]`       | `hover:text-[var(--semantic-color-primary)]` on `thClickable` | Yes (both primary)                      |
| Unsorted sort icon      | `IconSelector` 14px / `#64748b`                  | `IconSelector` 14px / `--semantic-color-textSubtle`           | Yes                                     |
| Active sort icon        | Chevron 14px / primary `#2563eb`                 | Chevron 14px / `--semantic-color-primary`                     | Yes                                     |
| Column resize hit width | 4px                                              | `w-4` (16px)                                                  | No                                      |
| Inner overflow          | `truncate` on label span                         | `truncate` on `thLabel`, `whitespace-nowrap` on `th`          | Similar                                 |

## Data Cell (td)

| Property                    | TDS Value                                        | thaki-shared Value                                | Match                 |
| --------------------------- | ------------------------------------------------ | ------------------------------------------------- | --------------------- |
| Padding X                   | 12px                                             | `px-[12px]`                                       | Yes                   |
| Padding Y                   | 6px (`--table-cell-padding-y` → `--spacing-1-5`) | `py-[6px]`                                        | Yes                   |
| Font size                   | 12px                                             | `0.75rem` (12px)                                  | Yes                   |
| Line height                 | 16px                                             | `leading-[1rem]` (16px)                           | Yes                   |
| Font weight                 | 400 (default)                                    | 400 (default)                                     | Yes                   |
| Text color                  | `#0f172a`                                        | `text-text`                                       | Manual                |
| Vertical align (multi-line) | Flex cell `items-center`                         | `align-middle` on `td`                            | No (center vs middle) |
| Default ellipsis            | Inner wrapper `truncate`                         | `truncate` on `td` when `isEllipsis`              | Similar               |
| Border model                | Transparent left on cells + outer row border     | `border-t` + `border-b` + first/last side borders | No                    |

## Row (tr) / TDS row container

| Property                  | TDS Value                                | thaki-shared Value                                     | Match |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------ | ----- |
| Min height                | 48px (`min-h-[var(--table-row-height)]`) | `h-12` (48px) on `tr`                                  | Yes   |
| Default background        | `#ffffff`                                | `bg-surface` → `#ffffff`                               | Yes   |
| Hover background          | `#f8fafc`                                | `hover:bg-surface-subtle` → `#f8fafc`                  | Yes   |
| Selected background       | `#eff6ff` (`--color-state-info-bg`)      | `bg-[var(--semantic-color-infoWeakBg)]` → `#eff6ff`    | Yes   |
| Selected border           | 1px `#2563eb`                            | `!border-primary` on cells                             | Yes   |
| Error row background      | (not in base Table)                      | `bg-error-light`                                       | N/A   |
| Cursor when row clickable | `cursor-pointer`                         | `cursor-pointer` on `tr`                               | Yes   |
| Row border                | Full 1px around flex “card”              | Horizontal rules + separated rows via `border-spacing` | No    |

## Cell Content Gap (VStack in td)

| Property                                         | TDS Value                                                                                                                 | thaki-shared Value                                                                                                                       | Match                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Multi-line stack gap (primary + secondary lines) | **Not defined in `Table.tsx`.** Recommended: `<VStack gap={0.5}>` → **2px** (`gap-[2px]` in `Stack.tsx`) to match shared. | **`2px`** — `[&>[data-layout="stack"][data-direction="vertical"]]:gap-[var(--semantic-space-0-5)]` (`--semantic-space-0-5` = `0.125rem`) | Align if TDS pages use `gap={1}` (4px) or default `VStack` `gap={6}` (24px) — those **do not** match shared. |
| Stack in action column (horizontal)              | (no special rule)                                                                                                         | `gap-[var(--semantic-space-xs)]` (4px) for horizontal stack in `tdActionColumn`                                                          | N/A                                                                                                          |

## Token Mapping

| TDS Token                           | TDS Resolved                   | thaki-shared Token                                     | shared Resolved | Match                 |
| ----------------------------------- | ------------------------------ | ------------------------------------------------------ | --------------- | --------------------- |
| `--table-row-gap`                   | 4px                            | `--semantic-space-xs`                                  | 4px (`0.25rem`) | Yes                   |
| `--table-row-radius`                | 6px                            | `--semantic-radius-base6` / `--primitive-radius-base6` | 6px             | Yes                   |
| `--table-row-height`                | 48px                           | Tailwind `h-12` / `min-h-12`                           | 48px            | Yes                   |
| `--table-cell-padding-x`            | 12px                           | `--primitive-space-3` (in preset) / literal `12px`     | 12px            | Yes                   |
| `--table-cell-padding-y`            | 6px                            | literal `py-[6px]`                                     | 6px             | Yes                   |
| `--table-header-padding-y`          | 8px                            | literal `py-[8px]` on `th`                             | 8px             | Yes                   |
| `--table-font-size`                 | 12px                           | `--primitive-font-size-12`                             | 12px            | Yes                   |
| `--table-header-font-size`          | 11px                           | `--primitive-font-size-11`                             | 11px            | Yes                   |
| `--table-line-height`               | 16px                           | `leading-16` / `1rem`                                  | 16px            | Yes                   |
| `--table-header-bg`                 | `#f8fafc`                      | `--semantic-color-surfaceSubtle`                       | `#f8fafc`       | Yes                   |
| `--table-row-hover-bg`              | `#f8fafc`                      | `--semantic-color-surfaceSubtle` (hover class)         | `#f8fafc`       | Yes                   |
| `--table-row-selected-bg`           | `#eff6ff`                      | `--semantic-color-infoWeakBg`                          | `#eff6ff`       | Yes                   |
| `--table-row-selected-border`       | `#2563eb`                      | `--semantic-color-primary`                             | `#2563eb`       | Yes                   |
| `--table-checkbox-width`            | 40px                           | `TABLE_SELECTION_COLUMN_WIDTH`                         | 40px            | Yes                   |
| `--table-empty-padding-y`           | 32px                           | `emptyState` `py-[32px]`                               | 32px            | Yes                   |
| `--table-expanded-row-height`       | 42px                           | `expandedInner` `min-h-[42px]`                         | 42px            | Yes                   |
| `--table-resize-handle-width`       | 4px                            | `resizeHandle` `w-4`                                   | 16px            | No                    |
| `--table-resize-handle-hover-color` | `#2563eb`                      | resize handle styling in CSS                           | primary         | Partial               |
| `--color-border-default`            | `#e2e8f0`                      | `--semantic-color-border`                              | `#e2e8f0`       | Yes                   |
| `--color-border-subtle`             | `#f1f5f9`                      | `--semantic-color-borderSubtle`                        | `#f1f5f9`       | Yes                   |
| Multi-line cell stack gap           | use `VStack` `gap={0.5}` → 2px | `--semantic-space-0-5`                                 | 2px             | Yes (if TDS uses 0.5) |

## Summary of Design Differences

| #   | Property                                     | TDS                                                          | thaki-shared                                       | Type           | Priority    |
| --- | -------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- | -------------- | ----------- |
| 1   | DOM / row structure                          | Flex “cards” per row                                         | Native `<table>` + `border-separate` + row spacing | Layout         | High        |
| 2   | Multi-line cell vertical alignment           | Flex `items-center` on cell                                  | `td` `align-middle`                                | Style          | Medium      |
| 3   | Header label / sort icon gap                 | 4px                                                          | 6px                                                | Style          | Medium      |
| 4   | Cell content stack gap (primary + secondary) | Not tokenized; use `VStack gap={0.5}` (2px) to mirror shared | 2px via `--semantic-space-0-5`                     | Style          | High (sync) |
| 5   | Column resize hit area                       | 4px wide                                                     | 16px wide                                          | Style          | Medium      |
| 6   | Sticky header                                | Only when `stickyHeader` or `maxHeight`                      | Always sticky `thead`                              | API / behavior | Medium      |
| 7   | Min width                                    | Content-driven                                               | `600px` min on table                               | Style          | Low         |
| 8   | Sticky column shadow                         | Box shadow on fixed right stack                              | No equivalent shadow                               | Style          | Low         |
