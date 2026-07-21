# Password / PasswordInput — TDS vs thaki-shared design spec

> **Sources**
>
> - **TDS**: `src/design-system/components/Password/Password.tsx` (+ input tokens in `src/index.css`)
> - **thaki-shared**: `src/components/Password/PasswordInput.tsx`, `PasswordInput.styles.ts` (behavior/styles inherit from `src/components/Input/Input.tsx`, `Input.styles.ts`)
> - **Token map**: `.cursor/skills/tds-design-sync/token-map.md`
> - **thaki-shared tokens**: `src/styles/tokens/tokens-light.css` (`--component-input-*`)

**Note:** thaki-shared has no dedicated `Password*.css`; styles come from **Input** component tokens and `PasswordInput.styles.ts`. TDS `Password` is a **standalone** field (not wrapping `Input.tsx`).

---

## 1. Architecture & scope

| Aspect         | TDS `Password`                                                   | thaki-shared `PasswordInput`                                                         |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Composition    | Single flex row: `[input][toggle]` inside one bordered container | Wraps shared `Input`; toggle is `rearIcon` slot (absolute `right-2`)                 |
| Sizes          | `sm` \| `md` only                                                | `sm` \| `md` only (via `Input`)                                                      |
| `lg`           | Not exposed                                                      | Not exposed on `PasswordInput` (same as TDS)                                         |
| Extra UI       | `helperText` / string `error` below; optional `success` border   | `message` below; optional `Tooltip` + `PasswordRequirementsTooltip`                  |
| Browser chrome | Not hidden                                                       | `passwordInputNativeUiResetClass` hides MS/WebKit password reveal / autofill buttons |

---

## 2. Container / field wrapper

### 2.1 Layout & width

| Property                 | TDS (resolved)                                                                                                                       | thaki-shared (resolved)                                           | Match?                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | -------------------------------------------------- |
| Default width (non-full) | `w-[var(--input-default-width)]` — **variable is not defined** in `src/index.css` (invalid/ignored → browser default width behavior) | `Input` default `width="full"` → `w-full` unless `width` prop set | **No** — semantics differ; TDS reference is broken |
| Read-only background     | `bg-[var(--input-bg-readonly)]` — **`--input-bg-readonly` is not defined** in `src/index.css` (same issue as default width)          | Read-only styling follows `Input` if supported                    | **No** — TDS token gap                             |
| `fullWidth`              | `w-full`                                                                                                                             | Use `width="full"` on `Input`                                     | **API differs**                                    |
| Column gap label–field   | `gap-[var(--input-label-gap)]` = **8px**                                                                                             | Label `mb-1` (4px) + structure; not `input-label-gap`             | **No**                                             |

### 2.2 Height (size variants)

| Size | TDS                                  | thaki-shared (`inputVariants`) | Match?  |
| ---- | ------------------------------------ | ------------------------------ | ------- |
| `sm` | `h` = `--input-height-sm` = **28px** | `h-[1.75rem]` = **28px**       | **Yes** |
| `md` | `h` = `--input-height-md` = **32px** | `h-[2rem]` = **32px**          | **Yes** |

### 2.3 Padding (horizontal)

| Property   | TDS                                                                  | thaki-shared                                           | Match?                                  |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------- |
| Horizontal | Container `px-[var(--input-padding-x)]` = **10px** (`--spacing-2-5`) | Input `px-2.5` (md) / `px-2` (sm) = **10px** / **8px** | **md: Yes** / **sm: Yes (8px)**         |
| Vertical   | No extra `py` on container; input is `h-full`                        | `py-2` (md), `py-1.5` (sm)                             | **Same net height** via flex vs padding |

### 2.4 Border, radius, background (default state)

| Property               | TDS (token → value)                                                           | thaki-shared (token → value)                              | Match?                       |
| ---------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------- |
| Border width           | Tailwind `border` → **1px** (not `--input-border-width` explicit on Password) | `border` → **1px**                                        | **Yes** (both 1px)           |
| Border color (default) | `--input-border` → `--color-border-strong` → **#cbd5e1** (slate300)           | `--component-input-color-border` → **#e2e8f0** (slate200) | **No** — TDS stronger border |
| Border radius          | `--input-radius` → `--radius-md` → **6px**                                    | `rounded-md` → **6px**                                    | **Yes**                      |
| Background             | `--input-bg` → **#ffffff**                                                    | `--component-input-color-bg` → **#ffffff**                | **Yes**                      |

### 2.5 Transitions (container / input)

| Property   | TDS `Password` container      | thaki-shared `Input` field                              | Match?      |
| ---------- | ----------------------------- | ------------------------------------------------------- | ----------- |
| Properties | `transition-colors`           | `transition-[border-color,background-color,box-shadow]` | **Partial** |
| Duration   | `--duration-fast` = **150ms** | `duration-normal` = **200ms**                           | **No**      |
| Easing     | default                       | `ease-in-out`                                           | **No**      |

---

## 3. Input element (text)

### 3.1 Typography

| Property       | TDS                                                                                                          | thaki-shared                                                                  | Match?                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------ |
| Font size `md` | `--input-font-size` = **12px**                                                                               | `text-12` → **12px**                                                          | **Yes**                                    |
| Font size `sm` | `--input-font-size-sm` = **11px**                                                                            | `text-12` on both sizes in `inputVariants` (size only changes height/padding) | **No** — shared uses **12px** for `sm` too |
| Font weight    | Inherited / default                                                                                          | `font-normal`                                                                 | **Likely yes**                             |
| Line height    | **Not set** on `<input>` (inherits); TDS `Input` uses `leading-[var(--line-height-20)]` — **Password omits** | Not explicit beyond `text-12` utility                                         | **No** vs TDS `Input`                      |
| Text color     | `--color-text-default` **#0f172a**                                                                           | `--component-input-color-text` **#171717**                                    | **No** (see token-map: text manual)        |
| Placeholder    | `--color-text-subtle` **#64748b**                                                                            | `--component-input-color-placeholder` **#d4d4d4**                             | **No** — shared much lighter               |

### 3.2 Input chrome

| Property            | TDS                        | thaki-shared             | Match?                         |
| ------------------- | -------------------------- | ------------------------ | ------------------------------ |
| Border on `<input>` | None (wrapper owns border) | Full border on `<input>` | **Structural** — different DOM |
| `outline`           | `outline-none` on input    | `outline-none`           | **Yes**                        |

---

## 4. Toggle button (eye)

### 4.1 Size, position, icon

| Property        | TDS                                            | thaki-shared                                                                 | Match?                                     |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| Icon library    | `@tabler/icons-react` `IconEye` / `IconEyeOff` | `ShowIcon` / `HideIcon` → Tabler `IconEye` / `IconEyeOff` via `Icon` wrapper | **Same source**                            |
| Icon size       | **16px** (`size={16}`)                         | `size="md"` → **16px** (`ICON_SIZES.md`)                                     | **Yes**                                    |
| Stroke          | **1.5**                                        | Default weight **regular** → stroke **1.5**                                  | **Yes**                                    |
| Button box      | `p-1` + `ml-2` → flex item after text          | `h-4 w-4` (**16×16**) fixed; `p-0`                                           | **No** — TDS larger hit area + left margin |
| Toggle position | Inside padded flex row (after input)           | `inputRearIconStyles`: `absolute right-2 top-1/2 -translate-y-1/2`           | **Different** layout model                 |

### 4.2 Colors & interaction

| State         | TDS toggle classes                                                                  | thaki-shared `passwordToggleButtonStyles`                        | Match?                         |
| ------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------ |
| Default       | `--color-text-muted` **#475569**                                                    | `[color:var(--component-input-color-placeholder)]` **#d4d4d4**   | **No**                         |
| Hover         | `hover:text-[var(--color-text-default)]` + `hover:bg-[var(--color-surface-subtle)]` | `hover:[color:var(--component-input-color-text)]` (no bg)        | **No**                         |
| Focus visible | `ring-2 ring-[var(--color-action-primary)]`                                         | `focus-visible:outline-none` only                                | **No** — TDS clearer focus     |
| Disabled      | `opacity-50` + `pointer-events-none`                                                | `[color:var(--semantic-color-textLight)]` + `cursor-not-allowed` | **Different** treatment        |
| Error         | Same as default (border on container shows error)                                   | `[color:var(--component-input-color-borderError)]` **#dc2626**   | **No** — shared tints icon red |

### 4.3 Radius

| TDS                             | thaki-shared                     |
| ------------------------------- | -------------------------------- |
| `rounded` → **4px** (`0.25rem`) | `rounded-sm` → **4px** (typical) |

**Match:** **Yes** (both ~4px).

### 4.4 Transition

| TDS                                                         | thaki-shared                                            |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| `transition-colors duration-[var(--duration-fast)]` (150ms) | `transition-colors duration-normal ease-in-out` (200ms) |

**Match:** **No**.

### 4.5 Behavior

| Behavior        | TDS                                    | thaki-shared                                                                 |
| --------------- | -------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| Click           | `onClick` toggles                      | `onClick` toggles; `onMouseDown={e => e.preventDefault()}` avoids focus loss | **No**                                        |
| Disabled toggle | Disabled when `disabled \|\| readOnly` | Only `disabled` prop to button                                               | **No** — read-only can still toggle in shared |
| `aria`          | `aria-label` show/hide (EN defaults)   | Korean default labels; `aria-pressed`                                        | **Different**                                 |

---

## 5. States: default, hover, focus, disabled, error

### 5.1 Hover (field)

| TDS `Password`                | thaki-shared `Input`                                                          |
| ----------------------------- | ----------------------------------------------------------------------------- |
| **No** container hover styles | `hover:enabled:border-[borderFocus]` + `hover:enabled:bg-[bgHover]` (#f1f5f9) |

**Match:** **No** — shared field reacts on hover; TDS does not.

### 5.2 Focus (field)

| TDS `Password`                                                            | TDS `Input` (reference)                             | thaki-shared `Input`                                    |
| ------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| `focus-within:border-[--input-border-focus]` (**#2563eb**), **no** shadow | `focus:border` + **shadow** `0 0 0 1px` focus color | `focus:border-[borderFocus]` **#3b82f6**, **no** shadow |

**Match TDS Password vs shared:** Both use **border-only** focus (no ring shadow). **TDS `Input`** adds shadow; **Password** does not — internal inconsistency.

**Focus color:** TDS `--color-action-primary` **#2563eb** vs shared `--component-input-color-borderFocus` **#3b82f6** — **different** blues (token-map: focus vs primary).

### 5.3 Disabled

| Property         | TDS                                            | thaki-shared                                                 | Match?                          |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------ | ------------------------------- |
| Field background | `--input-bg-disabled` → **#f1f5f9** (slate100) | `--component-input-color-bgDisabled` → **#f8fafc** (slate50) | **No**                          |
| Text             | `--color-text-subtle` on input when disabled   | `--semantic-color-textMuted`                                 | **Close** — both “muted” family |
| Border           | Still colored; container `bg` disabled         | `border-[--semantic-color-borderMuted]`                      | **No**                          |

### 5.4 Error

| Property | TDS                                                         | thaki-shared                                      | Match?              |
| -------- | ----------------------------------------------------------- | ------------------------------------------------- | ------------------- |
| Border   | `--input-border-error` → `--color-state-danger` **#ef4444** | `--component-input-color-borderError` **#dc2626** | **No**              |
| Message  | `text-body-sm` + danger color                               | `text-11` + `--semantic-color-error`              | **Different** scale |

### 5.5 Read-only

| TDS                                                                                                                                                                                      | thaki-shared                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Container: `border-[--input-border-readonly]` (**defined**); `bg-[--input-bg-readonly]` (**CSS variable missing** — same bug pattern as `--input-default-width`); input `cursor-default` | `readOnly` passes through to `<input>`; toggle only respects `disabled` |

**Match:** **No** (TDS disables toggle when read-only; shared does not).

### 5.6 Success (optional)

| TDS                                              | thaki-shared           |
| ------------------------------------------------ | ---------------------- |
| `success` → green border `--color-state-success` | Not on `PasswordInput` |

---

## 6. Label & helper text

| Element           | TDS `Password`                     | thaki-shared `Input`                        |
| ----------------- | ---------------------------------- | ------------------------------------------- |
| Label             | `text-label-sm` (11px / per rules) | `text-12 font-medium leading-16` (**12px**) |
| Required asterisk | `--color-state-danger`             | `--semantic-color-error`                    |
| Helper            | `text-body-sm` (11px)              | `text-11` (11px) — closer                   |

---

## 7. Icon implementation differences

| Topic       | TDS                                   | thaki-shared                                        |
| ----------- | ------------------------------------- | --------------------------------------------------- |
| Import      | Direct Tabler icons                   | `Icon` wrapper + variant colors (`muted` / `error`) |
| Sizing      | Explicit `16` / `stroke={1.5}`        | Tokenized `size="md"` + stroke via weight           |
| Error color | Border only; icon stays muted palette | Icon uses **error** color variant                   |

---

## 8. Other behavioral / API differences

- **Autocomplete:** shared forces `autoComplete="new-password"`; TDS leaves to consumer.
- **Tooltip:** shared `PasswordInput` can wrap field in `Tooltip` + policy content; TDS has no equivalent.
- **Visibility:** TDS `showToggle={false}` hides control; shared always supplies `rearIcon` button.

---

## 주요 디자인 차이 요약

| #   | Topic                                                   | TDS                                         | thaki-shared          | Severity                        |
| --- | ------------------------------------------------------- | ------------------------------------------- | --------------------- | ------------------------------- |
| 1   | Default **border** color                                | Strong slate300 `#cbd5e1`                   | Lighter `#e2e8f0`     | **MED**                         |
| 2   | **Placeholder** color                                   | Subtle text `#64748b`                       | Light gray `#d4d4d4`  | **HIGH** (contrast/readability) |
| 3   | **Input text** color                                    | `#0f172a`                                   | `#171717`             | **LOW** (token-map manual)      |
| 4   | **Focus** border blue                                   | Primary `#2563eb`                           | Focus `#3b82f6`       | **MED**                         |
| 5   | **Error** border red                                    | `#ef4444`                                   | `#dc2626`             | **MED**                         |
| 6   | **Disabled** field background                           | `#f1f5f9`                                   | `#f8fafc`             | **LOW**                         |
| 7   | **Hover** on field                                      | None                                        | Border + bg hover     | **MED**                         |
| 8   | **Transition** duration                                 | 150ms                                       | 200ms                 | **LOW**                         |
| 9   | **sm** font size inside field                           | 11px                                        | 12px (same as md)     | **MED**                         |
| 10  | Toggle **default** icon color                           | Text muted `#475569`                        | Placeholder `#d4d4d4` | **HIGH**                        |
| 11  | Toggle **hover**                                        | Text + subtle bg                            | Text only             | **LOW**                         |
| 12  | Toggle **focus ring**                                   | Ring 2px primary                            | outline-none          | **MED** (a11y)                  |
| 13  | Toggle on **error**                                     | No icon tint                                | Icon red              | **MED**                         |
| 14  | **Read-only** + toggle                                  | Toggle disabled                             | Toggle still active   | **HIGH** (behavior)             |
| 15  | **`--input-default-width`** / **`--input-bg-readonly`** | Referenced but **undefined** in `index.css` | N/A                   | **HIGH** (TDS token gaps)       |
| 16  | Label typography                                        | `text-label-sm` (11px)                      | `text-12` (12px)      | **MED**                         |
| 17  | **Focus ring** vs TDS `Input`                           | Password has no shadow; `Input` has shadow  | N/A                   | **MED** (TDS internal parity)   |

---

## Alignment recommendations (for sync work)

1. Define **`--input-default-width`** and **`--input-bg-readonly`** in TDS `index.css` (or remove usages) — both are referenced by `Password` but missing today.
2. Align **placeholder** and **toggle default** colors between systems (shared toward TDS text tokens or document intentional contrast).
3. Decide on **hover** on password field (shared has it; TDS does not).
4. Unify **focus** blue and **error** red with token-map “manual” fixes.
5. Match **read-only** behavior for the toggle (disable + pointer-events like TDS).
6. Add **line-height** on TDS `Password` input to match `Input` for vertical metrics.
