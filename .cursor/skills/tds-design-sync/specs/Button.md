# Button Design Spec

> Extracted from TDS `src/design-system/components/Button/Button.tsx`
> thaki-shared target: `src/components/Button/`
> Mapping: 1:1 대응

## 구조 차이

| 항목          | TDS                                                                      | thaki-shared                                                                                                    |
| ------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| variant 체계  | flat: `primary, secondary, outline, ghost, muted, danger, warning, link` | compound: `appearance(solid,outline,ghost)` x `variant(primary,secondary,tertiary,success,error,warning,muted)` |
| disabled 처리 | 개별 색상 지정                                                           | `opacity-50`                                                                                                    |
| focus ring    | `focus-visible:ring-1 ring-[--color-border-focus] ring-offset-1`         | 없음                                                                                                            |
| border-radius | base: `rounded-[var(--button-radius)]` (6px)                             | per-size: `rounded-md` (sm/md/lg), `rounded-full` (xs)                                                          |
| border 기본   | variant별 (`border border-[--color-border-strong]`)                      | `border-none` (base), appearance=outline시 `border border-solid`                                                |

## Base Styles

| Property      | TDS Value                               | TDS Token                      | thaki-shared Current    |
| ------------- | --------------------------------------- | ------------------------------ | ----------------------- |
| display       | inline-flex items-center justify-center | —                              | 동일                    |
| font-weight   | 500 (medium)                            | font-medium                    | 동일 (font-medium)      |
| transition    | colors 150ms                            | --duration-fast                | duration-normal (200ms) |
| cursor        | pointer / not-allowed(disabled)         | —                              | 동일                    |
| border-radius | 6px (모든 size 공통)                    | --button-radius → --radius-md  | per-size rounded-md     |
| focus-visible | ring-1 ring-blue500 ring-offset-1       | --color-border-focus (#3b82f6) | 없음                    |
| disabled      | 개별 color 지정                         | —                              | opacity-50              |

## Variants — Solid (appearance="solid")

### primary (TDS variant="primary")

| State    | Property   | TDS Value | TDS Token                     |
| -------- | ---------- | --------- | ----------------------------- |
| default  | background | #2563eb   | --color-action-primary        |
| default  | text       | #ffffff   | --color-text-on-primary       |
| hover    | background | #1d4ed8   | --color-action-primary-hover  |
| active   | background | #1e40af   | --color-action-primary-active |
| disabled | background | #e2e8f0   | --color-border-default        |
| disabled | text       | #64748b   | --color-text-subtle           |

### secondary (TDS variant="secondary")

| State    | Property   | TDS Value         | TDS Token                                       |
| -------- | ---------- | ----------------- | ----------------------------------------------- |
| default  | background | #ffffff           | --color-surface-default                         |
| default  | text       | #0f172a           | --color-text-default                            |
| default  | border     | 1px solid #cbd5e1 | --color-border-strong                           |
| hover    | background | #f1f5f9           | --button-secondary-hover-bg → --color-slate-100 |
| active   | background | #ffffff           | --color-surface-default                         |
| disabled | background | #f8fafc           | --color-surface-subtle                          |
| disabled | text       | #94a3b8           | --color-text-disabled                           |
| disabled | border     | #e2e8f0           | --color-border-default                          |

### danger (TDS variant="danger")

| State    | Property   | TDS Value   | TDS Token                   |
| -------- | ---------- | ----------- | --------------------------- |
| default  | background | #ef4444     | --color-state-danger        |
| default  | text       | #ffffff     | --color-text-on-primary     |
| hover    | background | #dc2626     | --color-state-danger-hover  |
| active   | background | #b91c1c     | --color-state-danger-active |
| disabled | —          | opacity 50% | —                           |

### warning (TDS variant="warning")

| State    | Property   | TDS Value   | TDS Token               |
| -------- | ---------- | ----------- | ----------------------- |
| default  | background | #f97316     | --color-state-warning   |
| default  | text       | #ffffff     | --color-text-on-primary |
| hover    | background | #ea580c     | --color-orange-600      |
| active   | background | #c2410c     | --color-orange-700      |
| disabled | —          | opacity 50% | —                       |

### ghost (TDS variant="ghost")

| State    | Property   | TDS Value   | TDS Token                                   |
| -------- | ---------- | ----------- | ------------------------------------------- |
| default  | background | transparent | —                                           |
| default  | text       | #475569     | --color-text-muted                          |
| hover    | background | #f1f5f9     | --button-ghost-hover-bg → --color-slate-100 |
| active   | background | #e2e8f0     | --color-border-default                      |
| disabled | text       | #94a3b8     | --color-text-disabled                       |

### muted (TDS variant="muted")

| State    | Property   | TDS Value         | TDS Token               |
| -------- | ---------- | ----------------- | ----------------------- |
| default  | background | #ffffff           | --color-surface-default |
| default  | text       | #475569           | --color-text-muted      |
| default  | border     | 1px solid #cbd5e1 | --color-border-strong   |
| hover    | background | #f8fafc           | --color-surface-subtle  |
| hover    | text       | #0f172a           | --color-text-default    |
| hover    | border     | #cbd5e1           | --color-border-strong   |
| active   | background | #ffffff           | --color-surface-default |
| disabled | text       | #94a3b8           | --color-text-disabled   |
| disabled | border     | #e2e8f0           | --color-border-default  |

### outline (TDS variant="outline")

| State    | Property   | TDS Value         | TDS Token                   |
| -------- | ---------- | ----------------- | --------------------------- |
| default  | background | transparent       | —                           |
| default  | text       | #0f172a           | --color-text-default        |
| default  | border     | 1px solid #cbd5e1 | --color-border-strong       |
| hover    | background | #f1f5f9           | --button-secondary-hover-bg |
| active   | background | #ffffff           | --color-surface-default     |
| disabled | text       | #94a3b8           | --color-text-disabled       |
| disabled | border     | #e2e8f0           | --color-border-default      |

### link (TDS variant="link") — thaki-shared에 대응 없음

| State    | Property        | TDS Value                               |
| -------- | --------------- | --------------------------------------- |
| default  | background      | transparent                             |
| default  | text            | #2563eb (--color-action-primary)        |
| default  | padding         | 0, height auto, radius none             |
| hover    | text-decoration | underline, offset 4                     |
| active   | text            | #1e40af (--color-action-primary-active) |
| disabled | text            | #94a3b8, no-underline                   |

## Sizes

| Size | Height | Padding X | Padding Y | Gap | Min Width | Font Size | Line Height |
| ---- | ------ | --------- | --------- | --- | --------- | --------- | ----------- |
| xs   | 24px   | 8px       | 4px       | 4px | 48px      | 11px      | 16px        |
| sm   | 28px   | 10px      | 6px       | 6px | 60px      | 11px      | 16px        |
| md   | 32px   | 12px      | 8px       | 6px | 80px      | 11px      | 16px        |
| lg   | 36px   | 16px      | 10px      | 8px | 80px      | 12px      | 18px        |

### thaki-shared 현재 Sizes 비교

| Size | shared Height       | shared Padding          | shared Font | 차이                                               |
| ---- | ------------------- | ----------------------- | ----------- | -------------------------------------------------- |
| xs   | 24px (w-6 h-6)      | 0 (p-0, rounded-full)   | 11px        | TDS: 직사각, shared: 원형                          |
| sm   | 28px (h-control-sm) | pl-2(8px) pr-2.5(10px)  | 11px        | TDS: px 10px 균등, shared: 비대칭                  |
| md   | 32px (h-control-md) | pl-3(12px) pr-3.5(14px) | 12px        | TDS: px 12px, font 11px, shared: 비대칭, font 12px |
| lg   | 36px (h-control-lg) | pl-4(16px) pr-4(16px)   | 14px        | TDS: font 12px, shared: font 14px                  |

## Icon-Only

| Size | TDS Width                      | TDS Config           |
| ---- | ------------------------------ | -------------------- |
| xs   | 24px (!w-6)                    | !min-w-0 !px-0 !py-0 |
| sm   | 28px (!w-[--button-height-sm]) | !min-w-0 !px-0 !py-0 |
| md   | 32px (!w-[--button-height-md]) | !min-w-0 !px-0 !py-0 |
| lg   | 36px (!w-[--button-height-lg]) | !min-w-0 !px-0 !py-0 |

thaki-shared:

- sm/md/lg: `w-[var(--semantic-control-height-*)] px-0` — 동일

## Token Mapping (TDS → thaki-shared)

| TDS Token                     | Resolved | thaki-shared Token                       | Match                |
| ----------------------------- | -------- | ---------------------------------------- | -------------------- |
| --button-height-sm            | 28px     | --semantic-control-height-sm             | exact                |
| --button-height-md            | 32px     | --semantic-control-height-md             | exact                |
| --button-height-lg            | 36px     | --semantic-control-height-lg             | exact                |
| --button-radius (--radius-md) | 6px      | rounded-md (6px)                         | exact                |
| --duration-fast               | 150ms    | duration-normal (200ms)                  | manual               |
| --color-action-primary        | #2563eb  | --component-button-solid-primary-bg      | exact (값 확인 필요) |
| --color-text-on-primary       | #ffffff  | --component-button-solid-primary-text    | exact                |
| --color-action-primary-hover  | #1d4ed8  | --component-button-solid-primary-bgHover | exact (값 확인 필요) |

## 주요 디자인 차이 요약

1. **transition duration**: TDS 150ms vs shared 200ms → `.styles.ts`에서 `duration-normal` → `duration-150` 변경 또는 토큰값 조정
2. **padding 비대칭**: shared sm `pl-2 pr-2.5`, md `pl-3 pr-3.5` → TDS는 좌우 대칭 `px-*`
3. **font-size**: md에서 TDS 11px vs shared 12px, lg에서 TDS 12px vs shared 14px
4. **focus ring**: TDS에는 있고 shared에는 없음 → base에 추가 필요
5. **disabled 처리**: TDS는 개별 색상, shared는 opacity-50 → `.styles.ts` compoundVariant로 disabled 색상 추가 가능
6. **xs size**: TDS는 직사각형, shared는 원형(rounded-full)
7. **link variant**: TDS에만 존재
