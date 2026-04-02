# DetailCard Design Spec

> Extracted from TDS `src/design-system/components/SectionCard/SectionCard.tsx`
> thaki-shared target: `src/components/DetailCard/`
> Mapping: **partial** (TDS compound component vs shared flat props)

## Architecture Difference

| Aspect   | TDS (SectionCard)                            | thaki-shared (DetailCard)                   |
| -------- | -------------------------------------------- | ------------------------------------------- |
| Pattern  | Compound (`.Header`, `.Content`, `.DataRow`) | Flat props (`title`, `fields[]`, `actions`) |
| Markup   | `<div>` children                             | `<dl>/<dt>/<dd>` semantic                   |
| Divider  | Content inserts between children             | Each row has own `border-t`                 |
| isActive | Supported (blue border)                      | Not supported                               |
| Loading  | Not built-in                                 | Built-in skeleton                           |

**Strategy**: Style-only changes. No structural/API changes.

## Key Design Differences

| #   | Element                 | Property       | TDS                          | thaki-shared                 | Type    |
| --- | ----------------------- | -------------- | ---------------------------- | ---------------------------- | ------- |
| 1   | Container               | top padding    | `pt-4` (16px)                | `pt-3` (12px)                | `style` |
| 2   | Container               | bottom padding | `pb-3` (12px)                | `pb-4` (16px)                | `style` |
| 3   | Container               | internal gap   | `gap-4` (16px)               | `gap-3` (12px)               | `style` |
| 4   | Container               | border-radius  | `radius-md` (6px)            | `rounded-md` (6px)           | match   |
| 5   | Header title            | font-size      | 16px (text-heading-h5)       | 14px (text-14)               | `style` |
| 6   | Header title            | font-weight    | 600 (semibold)               | 500 (medium)                 | `style` |
| 7   | Header title            | line-height    | 24px                         | 20px (leading-20)            | `style` |
| 8   | DataRow value           | line-height    | 18px (text-body-md)          | 16px (leading-16)            | `style` |
| 9   | DataRow label           | style          | 11px/16px medium text-subtle | 11px/16px medium text-subtle | match   |
| 10  | DataRow label-value gap | gap            | 6px (gap-1.5)                | 6px (gap-1.5)                | match   |

## Summary of Style Changes to Apply

1. **Container**: `pt-3` → `pt-4`, `pb-4` → `pb-3`, `gap-3` → `gap-4`
2. **Title**: `text-14 font-medium leading-20` → `text-16 font-semibold leading-24`
3. **Value text**: `leading-16` → `leading-18`
