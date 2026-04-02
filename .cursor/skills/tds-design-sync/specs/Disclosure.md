# Disclosure Design Spec

> Extracted from TDS `src/design-system/components/Disclosure/Disclosure.tsx`
> thaki-shared target: `src/components/Disclosure/`

## Component Architecture

| Aspect        | TDS                                                | thaki-shared                                            |
| ------------- | -------------------------------------------------- | ------------------------------------------------------- |
| Pattern       | Compound (Disclosure + Trigger + Panel)            | Single component with props (label, children, expanded) |
| State mgmt    | Controlled/uncontrolled via `open` / `defaultOpen` | Controlled/uncontrolled via `expanded`                  |
| Icon          | Swaps `IconChevronRight` ↔ `IconChevronDown`       | Rotates `ExpandOffIcon` 90°                             |
| Panel         | Conditional render (`if (!isOpen) return null`)    | `display: none` / `display: block` + `keepMounted`      |
| Disabled      | Not supported                                      | Supported (`opacity-50 pointer-events-none`)            |
| Optional text | Not supported                                      | Parses `(Optional)` suffix in label                     |

> Architecture differences are **out of scope** for design sync.

## Base Styles

### Root (Disclosure)

| Property | TDS Value | TDS Token | thaki-shared Value | thaki-shared Token | Match |
| -------- | --------- | --------- | ------------------ | ------------------ | ----- |
| display  | block     | —         | block              | —                  | exact |
| width    | —         | —         | w-full             | —                  | —     |

### Trigger (Header)

| Property    | TDS Value   | TDS Token                            | thaki-shared Value | thaki-shared Token                        | Match       |
| ----------- | ----------- | ------------------------------------ | ------------------ | ----------------------------------------- | ----------- |
| display     | flex        | —                                    | flex               | —                                         | exact       |
| align-items | center      | —                                    | center             | —                                         | exact       |
| gap         | **6px**     | `--disclosure-gap` → `--spacing-1-5` | **8px**            | `gap-sm` → `--semantic-space-sm` (0.5rem) | **DIFF**    |
| cursor      | pointer     | —                                    | pointer            | —                                         | exact       |
| user-select | none        | —                                    | none               | —                                         | exact       |
| background  | transparent | —                                    | transparent        | `bg-transparent`                          | exact       |
| border      | none        | —                                    | none               | `border-none`                             | exact       |
| padding     | 0           | —                                    | 0                  | `p-0`                                     | exact       |
| appearance  | —           | —                                    | none               | `appearance-none`                         | shared-only |
| outline     | —           | —                                    | none               | `outline-none`                            | shared-only |

### Label Typography

| Property    | TDS Value          | TDS Token/Class          | thaki-shared Value | thaki-shared Class                    | Match                                            |
| ----------- | ------------------ | ------------------------ | ------------------ | ------------------------------------- | ------------------------------------------------ |
| font-size   | **13px**           | `text-label-lg`          | **14px**           | `text-14`                             | **DIFF**                                         |
| line-height | **18px**           | `text-label-lg`          | **20px**           | `leading-20`                          | **DIFF**                                         |
| font-weight | 500                | `text-label-lg` (medium) | 500                | `font-medium`                         | exact                                            |
| color       | #0f172a            | `--color-text-default`   | semantic text      | `text-text` → `--semantic-color-text` | likely (token mismatch: trueGray900 vs slate900) |
| white-space | normal (default)   | —                        | **nowrap**         | `whitespace-nowrap`                   | **DIFF**                                         |
| font-family | system (inherited) | —                        | system             | `font-sans`                           | exact                                            |

### Optional Text (shared-only)

| Property    | Value      | Class              |
| ----------- | ---------- | ------------------ |
| font-size   | 12px       | `text-12`          |
| font-weight | 400        | `font-normal`      |
| line-height | 16px       | `leading-16`       |
| color       | textSubtle | `text-text-subtle` |

> TDS does not have this feature. Keep as-is.

## Icon

| Aspect            | TDS                                          | thaki-shared                                                 | Match           |
| ----------------- | -------------------------------------------- | ------------------------------------------------------------ | --------------- |
| Icon (collapsed)  | `IconChevronRight` (Tabler) — stroke chevron | `ExpandOffIcon` — filled triangle (▶)                        | **DIFF (HIGH)** |
| Icon (expanded)   | `IconChevronDown` (Tabler) — stroke chevron  | Same icon, rotated 90°                                       | **DIFF**        |
| Size              | 12px                                         | 12px                                                         | exact           |
| strokeWidth       | 2                                            | N/A (filled)                                                 | **DIFF**        |
| Animation         | None (icon swap)                             | `transition-transform duration-200 ease-in-out`, `rotate-90` | **DIFF**        |
| Icon wrapper size | 12×12px                                      | —                                                            | —               |

> Icon shape change requires `.tsx` import modification → **prohibited** by design sync guidelines.
> Icon animation difference requires render structure change → **prohibited**.

## Interactive States

### Hover

| State         | TDS                                         | thaki-shared | Match    |
| ------------- | ------------------------------------------- | ------------ | -------- |
| Trigger hover | `text-[var(--color-text-subtle)]` (#64748b) | None         | **DIFF** |

### Transition

| Property       | TDS                                                         | thaki-shared                                    | Match       |
| -------------- | ----------------------------------------------------------- | ----------------------------------------------- | ----------- |
| Trigger color  | `transition-colors duration-[var(--duration-fast)]` (150ms) | None                                            | **DIFF**    |
| Icon transform | None                                                        | `transition-transform duration-200 ease-in-out` | shared-only |

### Focus Visible

| Property   | TDS                    | thaki-shared                                            | Match              |
| ---------- | ---------------------- | ------------------------------------------------------- | ------------------ |
| Focus ring | None (browser default) | `outline-1 outline-primary outline-offset-2 rounded-sm` | shared-only (keep) |

### Disabled (shared-only)

| Property | Value                            | Note                      |
| -------- | -------------------------------- | ------------------------- |
| Section  | `opacity-50 pointer-events-none` | TDS has no disabled state |
| Header   | `cursor-not-allowed`             | —                         |

> Keep disabled state as-is (shared-specific feature).

## Token Mapping (References)

| TDS Token                            | Resolved | thaki-shared Token            | Match                            |
| ------------------------------------ | -------- | ----------------------------- | -------------------------------- |
| `--disclosure-gap` → `--spacing-1-5` | 6px      | `--primitive-space-1-5`       | exact                            |
| `--color-text-default`               | #0f172a  | `--semantic-color-text`       | manual (trueGray900 vs slate900) |
| `--color-text-subtle`                | #64748b  | `--semantic-color-textSubtle` | exact                            |
| `--duration-fast`                    | 150ms    | `--primitive-duration-150`    | exact                            |

## Differences Summary (Priority)

| #   | Property          | TDS              | Shared            | Priority | Changeable in Sync?      |
| --- | ----------------- | ---------------- | ----------------- | -------- | ------------------------ |
| 1   | Label font-size   | 13px             | 14px              | HIGH     | ✅ styles.ts             |
| 2   | Label line-height | 18px             | 20px              | HIGH     | ✅ styles.ts             |
| 3   | Icon-label gap    | 6px              | 8px               | MEDIUM   | ✅ styles.ts             |
| 4   | Hover text color  | #64748b          | none              | MEDIUM   | ✅ styles.ts             |
| 5   | Color transition  | 150ms            | none              | MEDIUM   | ✅ styles.ts             |
| 6   | whitespace-nowrap | no               | yes               | LOW      | ✅ styles.ts             |
| 7   | Icon shape        | Chevron (stroke) | Triangle (filled) | HIGH     | ❌ .tsx import change    |
| 8   | Icon animation    | Swap             | Rotate 90°        | LOW      | ❌ .tsx structure change |
| 9   | Icon duration     | N/A              | 200ms             | LOW      | Keep (shared-specific)   |
