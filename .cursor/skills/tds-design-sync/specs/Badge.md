# Badge Design Spec

> Extracted from TDS `src/design-system/components/Badge/Badge.tsx`
> thaki-shared target: `src/components/Badge/`

## 구조 차이

| 항목          | TDS                                                | thaki-shared                        |
| ------------- | -------------------------------------------------- | ----------------------------------- |
| sizes         | sm, md (2종)                                       | sm, md, lg (3종) — lg는 shared 전용 |
| themes        | blue, red, green, yellow, gray, white (full names) | blu, red, gry, gre, ylw (약칭)      |
| theme aliases | TDS가 약칭(blu/gry/gre/ylw)도 수용                 | 약칭만 사용                         |
| white theme   | 있음 (border: inset shadow)                        | 없음                                |
| dot indicator | 있음                                               | 없음                                |
| icon API      | leftIcon/rightIcon props                           | layout + icon (Icon wrapper)        |
| height        | 명시적 h-5/h-6                                     | 미명시 (padding으로 결정)           |

> API/구조 차이는 디자인 싱크 범위 밖. 스타일(시각적) 차이만 Apply 대상.

## Base Styles

| Property      | TDS Value                | TDS Token                        | thaki-shared Value       | thaki-shared Token | Match    |
| ------------- | ------------------------ | -------------------------------- | ------------------------ | ------------------ | -------- |
| border-radius | 4px                      | `--badge-radius` → `--radius-sm` | 6px                      | `rounded-base6`    | **diff** |
| gap           | 4px                      | `--badge-gap` → `--spacing-1`    | 4px                      | `gap-1`            | exact    |
| font-weight   | 500 (medium)             | `font-medium`                    | 500 (medium)             | `font-medium`      | exact    |
| display       | inline-flex items-center | —                                | inline-flex items-center | —                  | exact    |

## Size: sm

| Property    | TDS                       | thaki-shared         | Match           |
| ----------- | ------------------------- | -------------------- | --------------- |
| padding-x   | 6px (`--spacing-1-5`)     | 6px (`px-1.5`)       | exact           |
| padding-y   | 2px (`--spacing-0-5`)     | 2px (`py-0.5`)       | exact           |
| font-size   | 11px (`--font-size-11`)   | 11px (`text-11`)     | exact           |
| line-height | 16px (`--line-height-16`) | 16px (`leading-16`)  | exact           |
| height      | 20px (`h-5`)              | auto (padding-based) | structural diff |

## Size: md

| Property    | TDS                       | thaki-shared         | Match           |
| ----------- | ------------------------- | -------------------- | --------------- |
| padding-x   | 8px (`--spacing-2`)       | 8px (`px-2`)         | exact           |
| padding-y   | 2px (`--spacing-0-5`)     | 4px (`py-1`)         | **diff**        |
| font-size   | 13px (`--font-size-13`)   | 12px (`text-12`)     | **diff**        |
| line-height | 18px (`--line-height-18`) | 16px (`leading-16`)  | **diff**        |
| height      | 24px (`h-6`)              | auto (padding-based) | structural diff |

## Subtle Colors

| Theme  | TDS bg                  | TDS text              | shared bg             | shared text           | bg match | text match   |
| ------ | ----------------------- | --------------------- | --------------------- | --------------------- | -------- | ------------ |
| blue   | #dbeafe (blue100)       | blue800               | #eff6ff (blue50)      | #3b82f6 (blue500)     | **diff** | **diff**     |
| red    | #fee2e2 (red100)        | red600                | #fef2f2 (red50)       | #dc2626 (red600)      | **diff** | exact        |
| green  | #dcfce7 (green100)      | green600              | #f0fdf4 (green50)     | #16a34a (green600)    | **diff** | exact        |
| yellow | #ffedd5 (orange100)     | orange600             | #fefce8 (yellow50)    | #eab308 (yellow500)   | **diff** | **diff**     |
| gray   | #f1f5f9 (surface-muted) | #475569 (text-subtle) | #f1f5f9 (blueGray100) | text-muted (semantic) | exact    | needs verify |

## Solid Colors

| Theme  | TDS bg                  | TDS text | shared bg             | shared text | bg match                    | text match |
| ------ | ----------------------- | -------- | --------------------- | ----------- | --------------------------- | ---------- |
| blue   | #2563eb (state-info)    | white    | #3b82f6 (blue500)     | blue50      | **diff** (600 vs 500)       | ~exact     |
| red    | #ef4444 (state-danger)  | white    | #dc2626 (red600)      | red50       | **diff** (500 vs 600)       | ~exact     |
| green  | #22c55e (state-success) | white    | #16a34a (green600)    | green50     | **diff** (500 vs 600)       | ~exact     |
| yellow | #f97316 (state-warning) | white    | #eab308 (yellow500)   | yellow50    | **diff** (orange vs yellow) | ~exact     |
| gray   | #64748b (text-subtle)   | white    | text-muted (semantic) | blueGray50  | needs verify                | ~exact     |

## 주요 디자인 차이 (Apply 대상)

| #   | 항목               | Before (thaki-shared) | After (TDS 기준)                   | 변경 위치                          | 비고             |
| --- | ------------------ | --------------------- | ---------------------------------- | ---------------------------------- | ---------------- |
| 1   | border-radius      | 6px (`rounded-base6`) | 4px (`rounded-base4`)              | `Badge.styles.ts` CVA base         | radius 변경      |
| 2   | md padding-y       | 4px (`py-1`)          | 2px (`py-0.5`)                     | `Badge.styles.ts` size.md          | padding 변경     |
| 3   | md font-size       | 12px (`text-12`)      | 13px (`text-13`)                   | `Badge.styles.ts` size.md          | 1px 증가         |
| 4   | md line-height     | 16px (`leading-16`)   | 18px (`leading-18`)                | `Badge.styles.ts` size.md          | 2px 증가         |
| 5   | subtle blue bg     | blue50 (#eff6ff)      | blue100 (#dbeafe)                  | `Badge.styles.ts` compoundVariants | 톤 진하게        |
| 6   | subtle blue text   | blue500 (#3b82f6)     | blue800 (darker)                   | `Badge.styles.ts` compoundVariants | 글로벌 토큰 차이 |
| 7   | subtle red bg      | red50 (#fef2f2)       | red100 (#fee2e2)                   | `Badge.styles.ts` compoundVariants | 톤 진하게        |
| 8   | subtle green bg    | green50 (#f0fdf4)     | green100 (#dcfce7)                 | `Badge.styles.ts` compoundVariants | 톤 진하게        |
| 9   | subtle yellow bg   | yellow50 (#fefce8)    | orange100 (#ffedd5)                | `Badge.styles.ts` compoundVariants | 색상+톤 변경     |
| 10  | subtle yellow text | yellow500 (#eab308)   | orange600 (darker)                 | `Badge.styles.ts` compoundVariants | 색상 변경        |
| 11  | solid blue bg      | blue500 (#3b82f6)     | state-info (#2563eb, blue600)      | `Badge.styles.ts` compoundVariants | 톤 진하게        |
| 12  | solid red bg       | red600 (#dc2626)      | state-danger (#ef4444, red500)     | `Badge.styles.ts` compoundVariants | 톤 연하게        |
| 13  | solid green bg     | green600 (#16a34a)    | state-success (#22c55e, green500)  | `Badge.styles.ts` compoundVariants | 톤 연하게        |
| 14  | solid yellow bg    | yellow500 (#eab308)   | state-warning (#f97316, orange500) | `Badge.styles.ts` compoundVariants | 색상 변경        |

### 적용 판단

- **#1~4**: `.styles.ts`에서 직접 변경 가능. 스타일만 변경.
- **#5~14**: 색상 차이. thaki-shared는 primitive 토큰을 직접 사용하고, TDS는 semantic 토큰을 사용.
  - shared에 TDS와 동일한 semantic 토큰이 없으므로, primitive 토큰 단계(shade)를 변경하여 TDS 값에 맞춤.
  - yellow → orange 전환은 shared의 토큰 체계에 없으므로, CSS 변수(`var(--primitive-color-orange*)`)로 직접 매핑.

### 미적용 항목

- **lg size**: shared 전용. TDS에 없으므로 건드리지 않음.
- **white theme, dot**: TDS 전용 기능. shared에 추가하지 않음 (API 변경).
- **height (h-5/h-6)**: TDS는 명시적 높이 사용. shared는 padding-based. 높이를 추가하면 `lg` size에 영향 — padding 조정으로 결과적 높이를 맞춤.
