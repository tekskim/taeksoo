# NumberInput Design Spec

> Extracted from TDS `src/design-system/components/Input/NumberInput.tsx`
> thaki-shared target: `src/components/NumberInput/`

## Component Architecture

| Aspect         | TDS                                     | thaki-shared                                |
| -------------- | --------------------------------------- | ------------------------------------------- |
| Pattern        | Standalone (own `<input>` element)      | Wraps shared `Input` component              |
| Steppers       | Absolute positioned in relative wrapper | `innerSuffix` slot of Input                 |
| Long-press     | ✅ (400ms delay, 60ms interval)         | ❌ (click only)                             |
| Icons          | Tabler `IconChevronUp/Down` (direct)    | `ChevronUpIcon/DownIcon` via Icon wrapper   |
| Width variants | xs/sm/md/lg/half/full + custom px       | Inherits from Input (xs/sm/md/lg/half/full) |
| Suffix prop    | ✅ (separate text element)              | ❌                                          |
| hideSteppers   | ✅                                      | ❌                                          |

> Architecture differences are **out of scope** for design sync.
> Input-level styles were already synced in a previous pass.

## Step Button Styles

| Property             | TDS Value                        | TDS Token/Class                                     | thaki-shared Value         | thaki-shared Class | Match    |
| -------------------- | -------------------------------- | --------------------------------------------------- | -------------------------- | ------------------ | -------- |
| Width                | **20px**                         | `w-5`                                               | **10px**                   | `w-2.5`            | **DIFF** |
| Height               | **14px**                         | `h-[14px]`                                          | **10px**                   | `h-2.5`            | **DIFF** |
| Border radius        | **4px**                          | `rounded-[var(--radius-sm)]`                        | none                       | —                  | **DIFF** |
| Background (default) | transparent                      | —                                                   | transparent                | `bg-transparent`   | exact    |
| Border               | none                             | —                                                   | none                       | `border-0`         | exact    |
| Padding              | 0                                | —                                                   | 0                          | `p-0`              | exact    |
| Text color (default) | #64748b                          | `text-[var(--color-text-subtle)]`                   | via icon `variant="muted"` | —                  | **DIFF** |
| Hover text color     | #0f172a                          | `hover:text-[var(--color-text-default)]`            | none                       | —                  | **DIFF** |
| Hover background     | #f1f5f9                          | `hover:bg-[var(--color-surface-muted)]`             | none                       | —                  | **DIFF** |
| Active background    | #f1f5f9                          | `active:bg-[var(--color-border-subtle)]`            | none                       | —                  | **DIFF** |
| Transition           | 150ms                            | `transition-colors duration-[var(--duration-fast)]` | none                       | —                  | **DIFF** |
| Cursor               | pointer                          | `cursor-pointer`                                    | default                    | —                  | **DIFF** |
| Disabled             | pointer-events-none + opacity-50 | `pointer-events-none opacity-50`                    | none                       | —                  | **DIFF** |

## Step Control Container

| Property  | TDS Value     | TDS Class                                   | thaki-shared Value | thaki-shared Class            | Match                                |
| --------- | ------------- | ------------------------------------------- | ------------------ | ----------------------------- | ------------------------------------ |
| Display   | flex column   | `flex flex-col`                             | flex column        | `flex flex-col`               | exact                                |
| Alignment | —             | —                                           | center both        | `items-center justify-center` | TDS omits (items stretch by default) |
| Gap       | none          | —                                           | 2px                | `gap-0.5`                     | **DIFF**                             |
| Position  | right-1 (4px) | `absolute right-1 top-1/2 -translate-y-1/2` | right-2 (8px)      | via `inputInnerSuffixStyles`  | **DIFF**                             |

> Position difference: TDS right-1 (4px) vs shared right-2 (8px). Since shared uses Input's `innerSuffix` slot which is positioned via `inputInnerSuffixStyles`, changing the position requires modifying Input.styles.ts which could affect other uses of `innerSuffix`. Keep as-is.

## Icon

| Property    | TDS                                         | thaki-shared                    | Match    |
| ----------- | ------------------------------------------- | ------------------------------- | -------- |
| Size        | **12px**                                    | **10px**                        | **DIFF** |
| strokeWidth | 2 (explicit)                                | default (via Icon wrapper)      | **DIFF** |
| Color       | inherited from button text (`currentColor`) | `variant="muted"` (fixed color) | **DIFF** |

## Differences Summary (Priority)

| #   | Property             | TDS                              | Shared                  | Priority | Changeable?            |
| --- | -------------------- | -------------------------------- | ----------------------- | -------- | ---------------------- |
| 1   | Button width         | 20px (`w-5`)                     | 10px (`w-2.5`)          | HIGH     | ✅ styles.ts           |
| 2   | Button height        | 14px (`h-[14px]`)                | 10px (`h-2.5`)          | HIGH     | ✅ styles.ts           |
| 3   | Button border-radius | 4px                              | none                    | HIGH     | ✅ styles.ts           |
| 4   | Button hover text    | text-default                     | none                    | HIGH     | ✅ styles.ts           |
| 5   | Button hover bg      | surface-muted                    | none                    | HIGH     | ✅ styles.ts           |
| 6   | Button active bg     | border-subtle                    | none                    | MED      | ✅ styles.ts           |
| 7   | Button transition    | 150ms                            | none                    | MED      | ✅ styles.ts           |
| 8   | Button disabled      | pointer-events-none + opacity-50 | none                    | MED      | ✅ styles.ts           |
| 9   | Button text color    | text-subtle                      | via icon variant        | MED      | ✅ styles.ts + .tsx    |
| 10  | Container gap        | none                             | 2px                     | LOW      | ✅ styles.ts           |
| 11  | Icon size            | 12px                             | 10px                    | HIGH     | ✅ .tsx (default prop) |
| 12  | Icon color           | currentColor (inherited)         | variant="muted" (fixed) | MED      | ✅ .tsx (default prop) |
