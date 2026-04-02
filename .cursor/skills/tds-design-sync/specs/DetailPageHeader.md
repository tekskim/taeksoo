# DetailPageHeader Design Spec

> Extracted from TDS `src/design-system/components/DetailHeader/DetailHeader.tsx`
> thaki-shared target: `src/components/DetailPageHeader/`
> Mapping: **partial** (TDS compound component vs shared flat props)

## Architecture Difference

| Aspect    | TDS                                                                   | thaki-shared                                    |
| --------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| Pattern   | Compound (`DetailHeader.Title`, `.Actions`, `.InfoGrid`, `.InfoCard`) | Flat props (`title`, `actions`, `infoFields[]`) |
| InfoCard  | Wraps `InfoBox` component                                             | Inline implementation                           |
| Title     | Direct `<h5>` element                                                 | Uses `<Title>` sub-component                    |
| Loading   | None                                                                  | Skeleton support                                |
| Multi-row | `getRowLayout()` function for 5+ cards                                | Single row only                                 |

**Strategy**: Style-only changes. No structural/API changes.

## Key Design Differences

| #   | Element    | Property          | TDS                                  | thaki-shared                                 | Type    |
| --- | ---------- | ----------------- | ------------------------------------ | -------------------------------------------- | ------- |
| 1   | Container  | bottom padding    | `pb-3` (12px)                        | `pb-4` (16px)                                | `style` |
| 2   | Container  | gap               | none (children use mb-3)             | `gap-3` (12px)                               | `style` |
| 3   | Title      | font-size         | 16px (`text-heading-h5`)             | 18px (`text-18`)                             | `style` |
| 4   | Title      | line-height       | 24px                                 | 28px (`leading-7`)                           | `style` |
| 5   | Title      | margin-bottom     | `mb-3` (12px)                        | none (container gap handles)                 | `style` |
| 6   | Actions    | gap               | `gap-1` (4px)                        | `gap-[var(--component-layout-gap-xs)]` (4px) | match   |
| 7   | Actions    | margin-bottom     | `mb-3` (12px)                        | none (container gap handles)                 | `style` |
| 8   | InfoGrid   | gap               | `gap-3` (12px)                       | `gap-2` (8px)                                | `style` |
| 9   | InfoGrid   | alignment         | `items-stretch`                      | `items-center`                               | `style` |
| 10  | InfoCard   | background        | `surface-subtle` (#f8fafc, slate50)  | `surface-muted` (#f1f5f9, blueGray100)       | `style` |
| 11  | InfoCard   | label color       | `text-subtle` (blueGray500, #64748b) | `text-muted` (blueGray600, #475569)          | `style` |
| 12  | InfoCard   | value line-height | 18px (text-body-md)                  | 16px (leading-16)                            | `style` |
| 13  | InfoCard   | label-value gap   | 6px (gap-[6px])                      | 6px (gap-1.5)                                | match   |
| 14  | CopyButton | color             | primary via CopyButton component     | `text-primary`                               | match   |

## Token Mapping (Resolved)

| TDS Token                 | TDS Value | thaki-shared Token  | shared Value | Match |
| ------------------------- | --------- | ------------------- | ------------ | ----- |
| `--color-surface-default` | #ffffff   | `bg-surface`        | #ffffff      | exact |
| `--color-surface-subtle`  | #f8fafc   | `bg-surface-subtle` | #f8fafc      | exact |
| `--color-surface-muted`   | #f1f5f9   | `bg-surface-muted`  | #f1f5f9      | exact |
| `--color-border-default`  | #e2e8f0   | `border-border`     | #e2e8f0      | exact |
| `--color-text-subtle`     | #64748b   | `text-text-subtle`  | #64748b      | exact |
| `--color-text-muted`      | #475569   | `text-text-muted`   | #475569      | exact |
| `--radius-lg`             | 8px       | `rounded-base8`     | 8px          | exact |

## Summary of Style Changes to Apply

1. **Container**: `pb-4` → `pb-3`
2. **Title**: `text-18 leading-7` → `text-16 leading-6` (16px/24px, matching text-heading-h5)
3. **InfoGrid**: `gap-2` → `gap-3`, `items-center` → `items-stretch`
4. **InfoCard bg**: `bg-surface-muted` → `bg-surface-subtle`
5. **InfoCard label**: `text-text-muted` → `text-text-subtle`
6. **InfoCard value line-height**: `leading-16` → `leading-18`
