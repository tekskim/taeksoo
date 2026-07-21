# WindowControl Design Spec

> Extracted from TDS `src/design-system/components/WindowControl/WindowControl.tsx`
> thaki-shared target: `src/components/FrameControls/`
> Sync status: 머지 #155

## Component Overview

|                  | TDS (`WindowControl`)                                                            | thaki-shared (`FrameControls`)                                                      |
| ---------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| File             | `WindowControl.tsx` (single file, no CVA)                                        | `FrameControls.tsx` + `FrameControls.styles.ts` (CVA)                               |
| Styling approach | Inline Tailwind classes with CSS custom properties                               | CVA variants + Tailwind utility classes                                             |
| Sub-components   | `WindowControl` (single) + `WindowControls` (group) + `SplitDropdown` (internal) | `FrameControls` (group) + `ControlButton` (internal) + `SnapLayoutPanel` (internal) |
| Icon system      | Tabler Icons (`@tabler/icons-react`) + Lucide (`Scaling`)                        | Custom inline SVG (`WindowMinimize`, `WindowMaximize`, `WindowClose`, `Snap*`)      |

## Base Styles

### Control Button

| Property            | TDS Value                               | TDS Token                                 | thaki-shared Value                                               | thaki-shared Token            | Match                                                              |
| ------------------- | --------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------ |
| display             | `flex` (inline-flex)                    | —                                         | `flex` (inline-flex)                                             | —                             | ✅                                                                 |
| align/justify       | `items-center justify-center`           | —                                         | `items-center justify-center`                                    | —                             | ✅                                                                 |
| width               | `24px`                                  | `--window-control-size`                   | `24px` (sm)                                                      | `w-6`                         | ✅ exact                                                           |
| height              | `24px`                                  | `--window-control-size`                   | `24px` (sm)                                                      | `h-6`                         | ✅ exact                                                           |
| border-radius       | `4px`                                   | `--window-control-radius` → `--radius-sm` | `4px`                                                            | `--primitive-radius-base`     | ✅ exact                                                           |
| background (normal) | `transparent`                           | —                                         | `transparent`                                                    | `bg-transparent`              | ✅                                                                 |
| text-color          | `var(--color-text-default)` (#0f172a)   | `--color-text-default`                    | `text-text` → `--semantic-color-text`                            | `text-text`                   | ⚠️ (TDS: #0f172a slate900, shared: trueGray900 — known token diff) |
| hover background    | `var(--color-surface-subtle)` (#f8fafc) | `--color-surface-subtle`                  | `bg-surface-subtle` → `--semantic-color-surfaceSubtle` (#f8fafc) | `hover:bg-surface-subtle`     | ✅ exact                                                           |
| transition          | `colors 150ms`                          | `--duration-fast`                         | `colors 150ms ease-linear`                                       | `duration-150 ease-linear`    | ✅ exact                                                           |
| cursor              | `pointer` (implicit)                    | —                                         | `cursor-pointer`                                                 | —                             | ✅                                                                 |
| disabled opacity    | `0.5`                                   | —                                         | `0.5`                                                            | `disabled:opacity-50`         | ✅                                                                 |
| disabled cursor     | `not-allowed`                           | —                                         | `not-allowed`                                                    | `disabled:cursor-not-allowed` | ✅                                                                 |

### Controls Group

| Property      | TDS Value      | TDS Token                              | thaki-shared Value | thaki-shared Token | Match                                   |
| ------------- | -------------- | -------------------------------------- | ------------------ | ------------------ | --------------------------------------- |
| display       | `flex`         | —                                      | `flex`             | —                  | ✅                                      |
| align         | `items-center` | —                                      | `items-center`     | —                  | ✅                                      |
| gap           | `4px`          | `--window-control-gap` → `--spacing-1` | `gap-xs` (= 4px)   | `gap-xs`           | ✅ exact                                |
| padding-right | —              | —                                      | `8px`              | `pr-2`             | ❌ DIFF (shared has extra pr-2)         |
| select        | —              | —                                      | `none`             | `select-none`      | ❌ DIFF (shared adds user-select: none) |
| flex-shrink   | —              | —                                      | `0`                | `flex-shrink-0`    | ❌ DIFF (shared adds flex-shrink-0)     |

## Sizes

thaki-shared has 3 sizes; TDS has a single fixed size (24px).

| Size         | TDS Width | TDS Height | Shared Width | Shared Height | Match                       |
| ------------ | --------- | ---------- | ------------ | ------------- | --------------------------- |
| sm (default) | 24px      | 24px       | 24px         | 24px          | ✅ exact                    |
| md           | —         | —          | 28px         | 28px          | N/A (TDS only has one size) |
| lg           | —         | —          | 32px         | 32px          | N/A                         |

## States

### Focus-visible

| Property           | TDS            | thaki-shared                                 | Match                                        |
| ------------------ | -------------- | -------------------------------------------- | -------------------------------------------- |
| focus-visible ring | None specified | `outline-2 outline-primary outline-offset-1` | ❌ DIFF (shared has focus ring, TDS doesn't) |

### Pressed

| Property      | TDS  | thaki-shared                  | Match                                  |
| ------------- | ---- | ----------------------------- | -------------------------------------- |
| pressed state | None | `bg-surface-pressed scale-95` | ❌ DIFF (shared has pressed animation) |

## Interactive States (동적)

| State                | TDS                                                 | thaki-shared                                                                    |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------- |
| isMaximized          | Changes maximize icon: `IconSquare` → `IconSquares` | Changes button label: "Maximize" → "Restore"; icon unchanged (`WindowMaximize`) |
| showDropdown (split) | Opens `SplitDropdown` via portal on hover/click     | Opens `SnapLayoutPanel` via `Portal` on hover                                   |

## Icon Comparison

### Control Button Icons

| Icon     | TDS Component         | TDS Size | TDS Stroke | Shared Component                     | Shared Size | Match                   |
| -------- | --------------------- | -------- | ---------- | ------------------------------------ | ----------- | ----------------------- |
| minimize | `IconMinus` (Tabler)  | 12       | 1          | `WindowMinimize` (custom SVG)        | 12          | ⚠️ Visual match TBD     |
| maximize | `IconSquare` (Tabler) | 12       | 1          | `WindowMaximize` (custom SVG)        | 12          | ⚠️ Visual match TBD     |
| close    | `IconX` (Tabler)      | 12       | 1          | `WindowClose` (custom SVG)           | 12          | ⚠️ Visual match TBD     |
| split    | `Scaling` (Lucide)    | 12       | 1          | N/A (snap built into maximize hover) | —           | ❌ Different UX pattern |

### Split / Snap UI Comparison

| Aspect  | TDS                                                | thaki-shared                                    |
| ------- | -------------------------------------------------- | ----------------------------------------------- |
| Trigger | Separate `split` button type + hover dropdown      | Hover on maximize button opens snap panel       |
| Options | 2: Left Half, Right Half                           | 4: Top, Bottom, Left, Right                     |
| Display | `SplitDropdown` (portal, fixed position, white bg) | `SnapLayoutPanel` (Portal, dark bg, with arrow) |
| Style   | List items with keyboard shortcuts (⌥⇧←/→)         | Icon grid (24x24 snap icons)                    |

## CSS Implementation Differences

| Element       | Visual Effect         | TDS Approach                        | thaki-shared Approach                        | Impact                                  |
| ------------- | --------------------- | ----------------------------------- | -------------------------------------------- | --------------------------------------- |
| Border        | No border on buttons  | No border class                     | `border-none` explicit                       | None (same result)                      |
| Icon wrapper  | Icon centering        | No wrapper, icon directly in button | `<span>` wrapper with `controlIconStyles`    | Structural difference, no visual impact |
| Pressed state | Button press feedback | None                                | `bg-surface-pressed scale-95`                | Shared has micro-interaction            |
| Focus-visible | Accessibility ring    | Not specified                       | `outline-2 outline-primary outline-offset-1` | Shared has better a11y                  |

## CVA Base Inheritance Analysis

thaki-shared uses CVA for `controlButtonStyles`. Base classes that affect all sizes:

| Base Class                                                 | Purpose                    | Impact on sm (sync target)               | Reset Needed         |
| ---------------------------------------------------------- | -------------------------- | ---------------------------------------- | -------------------- |
| `border-none bg-transparent`                               | Clear native button styles | ✅ Needed                                | —                    |
| `cursor-pointer`                                           | Pointer cursor             | ✅ Needed                                | —                    |
| `rounded-[var(--primitive-radius-base)]`                   | 4px radius                 | ✅ Matches TDS (--radius-sm = 4px)       | —                    |
| `transition-colors duration-150 ease-linear`               | Transition                 | ✅ Matches TDS (--duration-fast = 150ms) | —                    |
| `outline-none relative`                                    | Focus/positioning          | ✅ Needed                                | —                    |
| `group/ctrl`                                               | Group hover context        | Not in TDS                               | — (no visual impact) |
| `hover:bg-surface-subtle`                                  | Hover background           | ✅ Matches TDS                           | —                    |
| `disabled:opacity-50 disabled:cursor-not-allowed`          | Disabled state             | ✅ Matches TDS                           | —                    |
| `focus-visible:outline-2 outline-primary outline-offset-1` | Focus ring                 | ❌ Not in TDS                            | Keep (better a11y)   |

**No base resets needed** — all base classes are compatible with TDS design.

## API Differences

| Aspect            | TDS (`WindowControlsProps`)                                       | thaki-shared (`FrameControlsProps`)                           |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| Maximize state    | `isMaximized: boolean`                                            | `frameState: 'normal' \| 'maximized'`                         |
| Split control     | `showSplit` prop + `onSnapLeft`/`onSnapRight`                     | `onSnap(mode: SnapMode)` — 4 modes                            |
| Button visibility | `showMinimize`, `showSplit`, `showMaximize`, `showClose` booleans | Controlled by handler presence (`onMinimize`, `onClose` etc.) |
| Size              | Not available (single 24px)                                       | `size: 'sm' \| 'md' \| 'lg'`                                  |
| Disabled          | `disabled: boolean`                                               | Not available                                                 |

## Token Mapping

| TDS Token                                 | TDS Resolved | thaki-shared Token               | Shared Resolved         | Match                  |
| ----------------------------------------- | ------------ | -------------------------------- | ----------------------- | ---------------------- |
| `--window-control-size`                   | `24px`       | `w-6 h-6` (sm)                   | `24px`                  | ✅ exact               |
| `--window-control-radius` → `--radius-sm` | `4px`        | `--primitive-radius-base`        | `4px`                   | ✅ exact               |
| `--window-control-gap` → `--spacing-1`    | `4px`        | `gap-xs`                         | `4px`                   | ✅ exact               |
| `--color-text-default`                    | `#0f172a`    | `--semantic-color-text`          | `#171717` (trueGray900) | ❌ DIFF (known global) |
| `--color-surface-subtle`                  | `#f8fafc`    | `--semantic-color-surfaceSubtle` | `#f8fafc`               | ✅ exact               |
| `--duration-fast`                         | `150ms`      | `duration-150`                   | `150ms`                 | ✅ exact               |

## Summary of Design Differences

| #   | Item                | Type         | TDS                              | thaki-shared                   | Change Needed                        | Impact         |
| --- | ------------------- | ------------ | -------------------------------- | ------------------------------ | ------------------------------------ | -------------- |
| 1   | Group padding-right | style        | none                             | `pr-2` (8px)                   | No (shared layout concern)           | Minor spacing  |
| 2   | Group user-select   | style        | none                             | `select-none`                  | No (UX enhancement)                  | None visual    |
| 3   | Group flex-shrink   | style        | none                             | `flex-shrink-0`                | No (layout protection)               | None visual    |
| 4   | Focus-visible ring  | style        | none                             | `outline-2 outline-primary`    | No (keep shared's better a11y)       | Accessibility  |
| 5   | Pressed animation   | style        | none                             | `bg-surface-pressed scale-95`  | No (keep shared's micro-interaction) | UX enhancement |
| 6   | Text color          | token-global | `#0f172a` (slate900)             | `#171717` (trueGray900)        | Global token alignment               | Imperceptible  |
| 7   | Icon implementation | structural   | Tabler Icons (stroke=1)          | Custom SVG components          | Visual comparison needed             | Icon shape     |
| 8   | Split/Snap UX       | structural   | Separate split button + dropdown | Hover on maximize + snap panel | Keep shared pattern                  | Different UX   |

### Verdict

**All core visual tokens (size, radius, gap, hover color, transition) already match between TDS and thaki-shared.** The component was synced in PR #155.

Remaining differences are:

- **Structural** (icon system, split/snap UX pattern) — intentional divergence
- **Token-global** (text color trueGray vs slate) — resolved at global token level
- **Shared extras** (focus-visible, pressed state, pr-2, select-none) — UX/a11y enhancements kept in shared

**No further style sync is needed for this component.**
