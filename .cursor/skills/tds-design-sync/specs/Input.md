# Input Design Spec

> Extracted from TDS `src/design-system/components/Input/Input.tsx`
> thaki-shared target: `src/components/Input/`

## Base Styles

| Property      | TDS Value             | TDS Token                                  | thaki-shared Value                                     | Match                  |
| ------------- | --------------------- | ------------------------------------------ | ------------------------------------------------------ | ---------------------- |
| border-radius | 6px                   | `--input-radius` → `--radius-md`           | `rounded-md` (6px)                                     | exact                  |
| border-width  | 1px                   | `--input-border-width`                     | `border` (1px)                                         | exact                  |
| border-color  | #cbd5e1 (blueGray300) | `--input-border` → `--color-border-strong` | #e2e8f0 (blueGray200) `--component-input-color-border` | ❌ DIFF                |
| background    | #ffffff               | `--input-bg` → `--color-surface-default`   | #ffffff `--component-input-color-bg`                   | exact                  |
| text-color    | #0f172a (slate900)    | `--color-text-default`                     | #171717 (trueGray900) `--component-input-color-text`   | ❌ DIFF (token-global) |
| placeholder   | #64748b (blueGray500) | `--color-text-subtle`                      | #d4d4d4 `--component-input-color-placeholder`          | ❌ DIFF                |
| font-weight   | 400 (normal)          | —                                          | 400 (normal)                                           | exact                  |
| font-family   | Mona Sans             | `--font-sans`                              | font-sans                                              | exact                  |
| transition    | 150ms                 | `--duration-fast`                          | 200ms `duration-normal`                                | ❌ DIFF                |
| line-height   | 20px                  | `--line-height-20`                         | (size-dependent)                                       | —                      |

## Sizes

| Size | Property  | TDS                           | thaki-shared   | Match   |
| ---- | --------- | ----------------------------- | -------------- | ------- |
| sm   | height    | 28px                          | 28px (1.75rem) | exact   |
| sm   | padding-x | 10px (`--input-padding-x`)    | 8px (px-2)     | ❌ DIFF |
| sm   | padding-y | 8px (`--input-padding-y`)     | 6px (py-1.5)   | ❌ DIFF |
| sm   | font-size | 11px (`--input-font-size-sm`) | 12px (text-12) | ❌ DIFF |
| md   | height    | 32px                          | 32px (2rem)    | exact   |
| md   | padding-x | 10px                          | 10px (px-2.5)  | exact   |
| md   | padding-y | 8px                           | 8px (py-2)     | exact   |
| md   | font-size | 12px (`--input-font-size`)    | 12px (text-12) | exact   |

## States

### Hover

| Property     | TDS                    | thaki-shared                                    | Match   |
| ------------ | ---------------------- | ----------------------------------------------- | ------- |
| border-color | 없음 (hover 효과 없음) | `--component-input-color-borderFocus` (#3b82f6) | ❌ DIFF |
| background   | 없음                   | `--component-input-color-bgHover` (#f1f5f9)     | ❌ DIFF |

> TDS Input은 hover 상태에서 시각적 변화가 없음. thaki-shared는 hover 시 border/bg 변경.

### Focus

| Property     | TDS                                   | thaki-shared                                    | Match   |
| ------------ | ------------------------------------- | ----------------------------------------------- | ------- |
| border-color | #2563eb (`--input-border-focus`)      | #3b82f6 (`--component-input-color-borderFocus`) | ❌ DIFF |
| box-shadow   | `0 0 0 1px var(--input-border-focus)` | 없음                                            | ❌ DIFF |
| background   | 유지                                  | `--component-input-color-bg` (명시적 리셋)      | —       |
| outline      | none                                  | none                                            | exact   |

### Disabled

| Property     | TDS                                            | thaki-shared                                   | Match   |
| ------------ | ---------------------------------------------- | ---------------------------------------------- | ------- |
| background   | #f1f5f9 (`--input-bg-disabled` → slate100)     | #f8fafc (`--component-input-color-bgDisabled`) | ❌ DIFF |
| text-color   | #475569 (`--input-text-disabled` → text-muted) | #475569 (`--semantic-color-textMuted`)         | exact   |
| border-color | transparent                                    | `--semantic-color-borderMuted`                 | ❌ DIFF |
| placeholder  | —                                              | `--semantic-color-textLight`                   | —       |
| cursor       | not-allowed                                    | not-allowed                                    | exact   |

### Error

| Property     | TDS                                             | thaki-shared                                    | Match                  |
| ------------ | ----------------------------------------------- | ----------------------------------------------- | ---------------------- |
| border-color | #ef4444 (`--input-border-error` → state-danger) | #dc2626 (`--component-input-color-borderError`) | ❌ DIFF (token-global) |

### ReadOnly

| Property     | TDS                                                 | thaki-shared           |
| ------------ | --------------------------------------------------- | ---------------------- |
| border-color | `--input-border-readonly` → border-subtle (#f1f5f9) | (no explicit readOnly) |
| cursor       | default                                             | —                      |
| focus        | 없음 (focus styles skipped for readOnly)            | —                      |

## Icon Padding (with icons)

| Config    | TDS         | thaki-shared sm | thaki-shared md |
| --------- | ----------- | --------------- | --------------- |
| frontIcon | pl-8 (32px) | pl-8 (32px)     | pl-9 (36px)     |
| rearIcon  | pr-8 (32px) | pr-8 (32px)     | pr-9 (36px)     |

## Label/Message Typography

| Element             | TDS                                        | thaki-shared                                 | Match                  |
| ------------------- | ------------------------------------------ | -------------------------------------------- | ---------------------- |
| Label font          | `text-label-lg` (13px/18px, medium)        | `text-12 font-medium leading-16` (12px/16px) | ❌ DIFF                |
| Label color         | `--color-text-default` (#0f172a)           | `--semantic-color-text` (#171717)            | ❌ DIFF (token-global) |
| Helper/message font | `text-body-sm` (11px/16px)                 | `text-11 font-normal leading-16` (11px/16px) | exact                  |
| Helper color        | `--color-text-subtle` (#64748b)            | `--semantic-color-textMuted` (#475569)       | ❌ DIFF                |
| Error msg color     | `--color-state-danger` (#ef4444)           | `--semantic-color-error` (#dc2626)           | ❌ DIFF (token-global) |
| Label gap           | `--primitive-spacing-2` (8px) via flex gap | `mb-1` (4px)                                 | ❌ DIFF                |
| Message gap         | `--primitive-spacing-2` (8px) via flex gap | `mt-1` (4px)                                 | ❌ DIFF                |

## 주요 디자인 차이 (요약)

| #   | 항목                 | Before (thaki-shared)         | After (TDS 기준)                      | 유형           |
| --- | -------------------- | ----------------------------- | ------------------------------------- | -------------- |
| 1   | Placeholder color    | `#d4d4d4` (매우 밝은 gray)    | `#64748b` (blueGray500, text-subtle)  | `style`        |
| 2   | Default border color | `#e2e8f0` (border-default)    | `#cbd5e1` (border-strong, 더 진한)    | `style`        |
| 3   | Hover 효과           | border→focus색 + bg→hover색   | 없음 (hover 효과 제거)                | `style`        |
| 4   | Focus ring           | border 색상 변경만            | border + `box-shadow: 0 0 0 1px` ring | `style`        |
| 5   | Focus border color   | `#3b82f6` (blue500)           | `#2563eb` (blue600, action-primary)   | `style`        |
| 6   | Transition duration  | 200ms (`duration-normal`)     | 150ms (`duration-fast`)               | `style`        |
| 7   | sm padding-x         | 8px (px-2)                    | 10px (px-2.5)                         | `style`        |
| 8   | sm padding-y         | 6px (py-1.5)                  | 8px (py-2)                            | `style`        |
| 9   | sm font-size         | 12px (text-12)                | 11px                                  | `style`        |
| 10  | Disabled bg          | `#f8fafc` (surfaceSubtle)     | `#f1f5f9` (surfaceMuted)              | `style`        |
| 11  | Disabled border      | `borderMuted` 색상            | `transparent` (border 숨김)           | `style`        |
| 12  | Icon padding (md)    | frontIcon→pl-9, rearIcon→pr-9 | frontIcon→pl-8, rearIcon→pr-8         | `style`        |
| 13  | Label gap            | `mb-1` (4px)                  | 8px (flex gap)                        | `style`        |
| 14  | Message gap          | `mt-1` (4px)                  | 8px (flex gap)                        | `style`        |
| 15  | Label font-size      | 12px/16px                     | 13px/18px (`text-label-lg`)           | `style`        |
| 16  | Helper/message color | `textMuted` (#475569)         | `text-subtle` (#64748b)               | `style`        |
| 17  | Text color           | `#171717` (trueGray900)       | `#0f172a` (slate900)                  | `token-global` |
| 18  | Error border color   | `#dc2626` (red600)            | `#ef4444` (red500)                    | `token-global` |

## Token Mapping

| TDS Token                                 | TDS Resolved | thaki-shared Token                    | shared Resolved | Match                  |
| ----------------------------------------- | ------------ | ------------------------------------- | --------------- | ---------------------- |
| `--input-border` (→ border-strong)        | #cbd5e1      | `--component-input-color-border`      | #e2e8f0         | ❌ DIFF                |
| `--color-text-subtle` (placeholder)       | #64748b      | `--component-input-color-placeholder` | #d4d4d4         | ❌ DIFF                |
| `--input-border-focus` (→ action-primary) | #2563eb      | `--component-input-color-borderFocus` | #3b82f6         | ❌ DIFF                |
| `--input-bg-disabled` (→ slate100)        | #f1f5f9      | `--component-input-color-bgDisabled`  | #f8fafc         | ❌ DIFF                |
| `--color-text-default`                    | #0f172a      | `--component-input-color-text`        | #171717         | ❌ DIFF (token-global) |
| `--input-border-error` (→ state-danger)   | #ef4444      | `--component-input-color-borderError` | #dc2626         | ❌ DIFF (token-global) |

## API Changes Required

없음 — 스타일 변경만으로 대응 가능
