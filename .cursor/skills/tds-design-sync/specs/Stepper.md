# Stepper Design Spec

> Extracted from TDS `src/design-system/components/Wizard/WizardSection.tsx` + `WizardSummary.tsx`
> thaki-shared target: `src/components/Stepper/`

## Component Mapping

| TDS Component             | thaki-shared Component                                              |
| ------------------------- | ------------------------------------------------------------------- |
| `WizardSectionStatusIcon` | `renderStatusIndicator` (in StepperSummary) + Stepper header badges |
| `WizardSummary`           | `StepperSummary`                                                    |
| `PreSection`              | Stepper accordion item (completed=false, open=false)                |
| `WritingSection`          | Stepper accordion item (writing=true, open=false)                   |
| `SkippedSection`          | Stepper accordion item (skipped=true, completed=true)               |
| `DoneSection`             | Stepper accordion item (completed=true)                             |
| `WizardSection`           | `Stepper` (router by status)                                        |

## StepperSummary — Style Differences

### Container

| Property   | thaki-shared                            | TDS                                           | Type         |
| ---------- | --------------------------------------- | --------------------------------------------- | ------------ |
| Background | `bg-surface-muted`                      | `bg-[var(--color-surface-subtle)]` (slate50)  | style        |
| Border     | `border border-border`                  | `border border-[var(--color-border-default)]` | token-global |
| Radius     | `rounded-base8` (8px)                   | `rounded-lg` (8px)                            | exact        |
| Padding    | `p-[17px]`                              | `p-4` (16px)                                  | style        |
| Width      | `w-[380px] min-w-[380px] max-w-[380px]` | No fixed width                                | style        |

### Title

| Property | thaki-shared                       | TDS                                | Type                |
| -------- | ---------------------------------- | ---------------------------------- | ------------------- |
| Font     | `text-16 font-semibold leading-24` | `text-heading-h5` (16px/24px/600)  | exact (same values) |
| Color    | `text-text`                        | `text-[var(--color-text-default)]` | token-global        |

### List

| Property   | thaki-shared  | TDS                       | Type  |
| ---------- | ------------- | ------------------------- | ----- |
| Top margin | `mt-3` (12px) | `gap-3` (12px) via VStack | exact |
| Item gap   | `gap-0`       | `gap-0` via VStack        | exact |

### Item Row

| Property     | thaki-shared                     | TDS                                | Type                |
| ------------ | -------------------------------- | ---------------------------------- | ------------------- |
| Height       | `h-[27px]`                       | auto (py-1.5 = 6px each side)      | style               |
| Padding      | `px-1 py-[4.5px]`                | `py-1.5` (6px)                     | style               |
| Label font   | `text-12 font-normal leading-18` | `text-body-md` (12px/18px/400)     | exact (same values) |
| Label color  | `text-text`                      | `text-[var(--color-text-default)]` | token-global        |
| Status width | `w-16` (64px)                    | `w-16` (64px)                      | exact               |

### Status Icons

| Status               | thaki-shared                              | TDS                                                                          | Type                        |
| -------------------- | ----------------------------------------- | ---------------------------------------------------------------------------- | --------------------------- |
| **done** — container | `size-4 rounded-full bg-state-success`    | `w-4 h-4 rounded-full bg-[var(--color-state-success)]`                       | exact                       |
| **done** — icon      | `CheckIcon size={10} color="white"`       | `IconCheck size={10} stroke={2.5} text-white`                                | style (icon swap)           |
| **active** — icon    | `ProgressIcon size={16} color="slate600"` | `IconProgress size={20} stroke={1.5} text-[var(--color-text-muted)]`         | style (icon swap + size)    |
| **writing** — text   | `text-11 leading-16 text-text-muted`      | `text-body-sm text-[var(--color-text-subtle)]`                               | style (color: muted→subtle) |
| **skipped** — icon   | CSS dash `h-px w-3 bg-slate500`           | `IconMinus size={12} stroke={1.5} text-[var(--color-text-subtle)]`           | style (dash→icon)           |
| **pre** — icon       | `ProgressIcon size={16} color="slate200"` | `IconCircleDashed size={20} stroke={1.5} text-[var(--color-border-default)]` | style (icon swap + size)    |

## Stepper (Accordion Items) — Style Differences

### Header

| Property             | thaki-shared                                      | TDS                                                              | Type                |
| -------------------- | ------------------------------------------------- | ---------------------------------------------------------------- | ------------------- |
| Height               | `h-7` (28px)                                      | `h-[28px]`                                                       | exact               |
| Label font           | `text-16 font-semibold`                           | `text-heading-h5` (16px/24px/600)                                | exact (same values) |
| Label active color   | `text-text`                                       | `text-[var(--color-text-default)]`                               | token-global        |
| Label disabled color | `text-text-muted`                                 | `text-[var(--color-text-default)]` (same for all)                | style               |
| Writing badge        | `text-primary text-sm font-semibold` (blue, bold) | `text-body-md text-[var(--color-text-subtle)]` (subtle, regular) | style               |
| Not configured text  | `text-text-muted text-xs leading-[18px]`          | `text-body-md text-[var(--color-text-muted)]`                    | style               |
| Edit button icon     | `EditIcon size="xs"` (internal SVG)               | `IconEdit size={12}` (Tabler)                                    | style               |
| Edit button variant  | `variant="outline"`                               | `variant="secondary"` (DoneSection) or `variant="secondary"`     | style               |

### Container

| Property         | thaki-shared              | TDS                                              | Type         |
| ---------------- | ------------------------- | ------------------------------------------------ | ------------ |
| Border (active)  | `border-2 border-primary` | SectionCard `isActive` (blue left border accent) | style        |
| Border (default) | `border border-border`    | `border border-[var(--color-border-default)]`    | token-global |
| Padding          | Accordion internal        | `px-4 py-3`                                      | style        |
| Radius           | `rounded-lg`              | `rounded-lg`                                     | exact        |

## 주요 디자인 차이 요약

| #   | 항목                           | Before (thaki-shared)                    | After (TDS)                                             | 유형  |
| --- | ------------------------------ | ---------------------------------------- | ------------------------------------------------------- | ----- |
| 1   | Summary container bg           | `bg-surface-muted`                       | `bg-surface-subtle` (slate50)                           | style |
| 2   | Summary container padding      | `p-[17px]`                               | `p-4` (16px)                                            | style |
| 3   | Summary item height            | `h-[27px]` fixed                         | auto with `py-1.5`                                      | style |
| 4   | Done icon                      | `CheckIcon` (internal SVG)               | `IconCheck` (Tabler) size=10 stroke=2.5                 | style |
| 5   | Active icon                    | `ProgressIcon` size=16                   | `IconProgress` (Tabler) size=20 stroke=1.5              | style |
| 6   | Pre icon                       | `ProgressIcon` size=16 slate200          | `IconCircleDashed` (Tabler) size=20 stroke=1.5          | style |
| 7   | Skipped icon                   | CSS dash (`h-px w-3`)                    | `IconMinus` (Tabler) size=12 stroke=1.5                 | style |
| 8   | Writing status text (summary)  | `text-text-muted`                        | `text-[var(--color-text-subtle)]`                       | style |
| 9   | Writing badge (stepper header) | `text-primary font-semibold` (blue bold) | `text-body-md text-[var(--color-text-subtle)]` (subtle) | style |
| 10  | Not configured text            | `text-text-muted text-xs`                | `text-body-md text-[var(--color-text-muted)]`           | style |
| 11  | Stepper Edit icon              | `EditIcon` (internal SVG)                | `IconEdit` (Tabler) size=12                             | style |
