# StatusIndicator Design Spec

> Extracted from TDS `src/design-system/components/StatusIndicator/StatusIndicator.tsx`  
> thaki-shared: `src/components/StatusIndicator/StatusIndicator.tsx` + `StatusIndicator.styles.ts`  
> **Note:** 두 구현 모두 **색 점(dot)** 이 아니라 **아이콘 + 배경**으로 상태를 표현합니다. (문서·Figma의 “dot”은 시맨틱 배경색/아이콘 영역으로 이해.)

## Component Mapping

| 항목      | TDS                                                                | thaki-shared                                            |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| 매핑      | `StatusIndicator`                                                  | `StatusIndicator`                                       |
| 스타일    | 인라인 `twMerge` + 토큰 클래스                                     | `cva` (`statusIndicatorVariants`) + `colorSchemeStyles` |
| 상태 식별 | `status` (`StatusType`, 다수 변형)                                 | `variant` (`StatusVariant`, 적은 수)                    |
| 레이아웃  | `default` \| `icon-only` \| `badge` (+ `leftIcon`/`iconOnly` 별칭) | `iconOnly` \| `leftIcon` (`leftIcon` deprecated)        |

## Base Styles (default — 아이콘 + 라벨 pill)

| Property          | TDS (resolved)                              | TDS Token / class                                          |
| ----------------- | ------------------------------------------- | ---------------------------------------------------------- |
| Display           | `inline-flex items-center`                  | —                                                          |
| Gap (아이콘–라벨) | **4px**                                     | `--status-gap` → `--spacing-1`                             |
| Padding X         | **6px**                                     | `--status-padding-x` → `--spacing-1-5`                     |
| Padding Y         | **4px**                                     | `--status-padding-y` → `--spacing-1`                       |
| Border radius     | **pill** (9999px)                           | `--status-radius` → `--radius-pill` → `--radius-full`      |
| Font size         | **11px**                                    | `text-[length:var(--status-font-size)]` → `--font-size-11` |
| Line height       | **16px**                                    | `leading-[var(--status-line-height)]` → `--line-height-16` |
| Font weight       | **500**                                     | `font-medium`                                              |
| Text color        | **#ffffff**                                 | `text-[var(--status-text)]` → `--color-text-inverse`       |
| Visual indicator  | **16×16** Tabler 아이콘 (`strokeWidth={2}`) | 고정 `ICON_SIZE = 16`                                      |

**thaki-shared (`iconOnly: false`, `leftIcon` + label)**

| Property      | Value                     | Classes / token                                                                        |
| ------------- | ------------------------- | -------------------------------------------------------------------------------------- |
| Gap           | **4px**                   | `gap-1`                                                                                |
| Padding X / Y | **6px / 4px**             | `px-1.5 py-1`                                                                          |
| Border radius | **~16px** (토큰 `base16`) | `rounded-2xl` — Tailwind 기본 스케일 또는 `base16`(`1rem`)에 근접; **TDS pill과 다름** |
| Font          | **11px / 16px / 500**     | `text-11 leading-16 font-medium`                                                       |
| Text          | **#ffffff**               | `text-text-inverse` → `--semantic-color-textInverse`                                   |
| Icon          | **16px** (컨테이너 내)    | `Icon* color="white" size="md"`                                                        |

## Layout: icon-only

| Property                   | TDS                                              | thaki-shared                                             |
| -------------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| Container                  | `rounded-full`, 배경은 상태별 토큰               | `rounded-full`, `p-1`, `!w-6 !h-6` → **24×24px**         |
| Sizes (`sm` / `md` / `lg`) | **24 / 24 / 28px** (`size-[24px]`·`size-[28px]`) | **고정 24×24** (size prop 없음)                          |
| Icon size                  | sm·md: **14px**, lg: **16px**                    | **16px** (`size="md"`)                                   |
| Tooltip                    | 항상 `<Tooltip>` 래핑                            | `tooltip` / `label` / variant명으로 `<Tooltip>` (조건부) |
| Label                      | 시각적 라벨 없음 (`aria-label`)                  | 동일 (텍스트는 툴팁)                                     |

## Layout: badge (TDS only)

| Property   | TDS                                              | thaki-shared |
| ---------- | ------------------------------------------------ | ------------ |
| 존재 여부  | `layout="badge"`                                 | **없음**     |
| Gap        | **6px** (`gap-1.5`)                              | —            |
| Padding    | **8px × 2px** (`px-2 py-0.5`)                    | —            |
| Radius     | **6px** (`rounded-md` → `--primitive-radius-md`) | —            |
| Typography | `text-body-sm` (11px/16px 규칙)                  | —            |

## Variants — 색상 패밀리 (5계열)

상태 타입은 많지만 **배경색은 5가지 시맨틱**으로 수렴합니다.

| Color family | TDS `status` 예                                                                                                           | Dot/아이콘 색              | Background (TDS token → hex)                               | Text        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------- | ----------- |
| Success      | `active`, `enabled`                                                                                                       | `currentColor` (= inverse) | `--status-success-bg` → **#4ade80** (`--color-green-400`)  | **#ffffff** |
| Danger       | `error`                                                                                                                   | 동일                       | `--status-danger-bg` → **#f87171** (`--color-red-400`)     | **#ffffff** |
| Info (진행)  | `building`, `deleting`, `pending`                                                                                         | 동일                       | `--status-info-bg` → **#60a5fa** (`--color-blue-400`)      | **#ffffff** |
| Warning      | `verify-resized`, `degraded`, `no-monitor`, `down`, `maintenance`                                                         | 동일                       | `--status-warning-bg` → **#fb923c** (`--color-orange-400`) | **#ffffff** |
| Muted        | `suspended`, `shelved`, `shelved-offloaded`, `mounted`, `shutoff`, `paused`, `draft`, `deactivated`, `disabled`, `in-use` | 동일                       | `--status-muted-bg` → **#64748b** (`--color-slate-500`)    | **#ffffff** |

### thaki-shared `colorScheme` → primitive (배경)

| Scheme  | Token                         | Hex         | TDS 동일 계열 hex       | Match |
| ------- | ----------------------------- | ----------- | ----------------------- | ----- |
| success | `--primitive-color-green400`  | #4ade80     | #4ade80                 | ✅    |
| danger  | `--primitive-color-red400`    | #f87171     | #f87171                 | ✅    |
| warning | `--primitive-color-orange400` | #fb923c     | #fb923c                 | ✅    |
| info    | `--primitive-color-blue400`   | #60a5fa     | #60a5fa                 | ✅    |
| muted   | `--primitive-color-slate600`  | **#475569** | **#64748b** (slate-500) | ❌    |

### thaki-shared `variant` → 기본 scheme (매핑 참고)

| variant                                                    | default scheme | 비고 (TDS 대응)                                      |
| ---------------------------------------------------------- | -------------- | ---------------------------------------------------- |
| active                                                     | success        | TDS `active`                                         |
| pending                                                    | info           | TDS `pending`                                        |
| error                                                      | danger         | TDS `error`                                          |
| draft, suspended, shelved, mounted, shutoff, paused, inUse | muted          | TDS 동명/유사                                        |
| building, deleting                                         | info           | TDS 동명                                             |
| down, degraded, noMonitor                                  | warning        | TDS `down` 등                                        |
| offline                                                    | danger         | TDS에 `offline` 타입 없음 (`error` 등으로 대체 가능) |

## Sizes

|                     | TDS                                                           | thaki-shared                                |
| ------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| **default / badge** | 단일 스케일 (토큰 고정)                                       | 단일 (`leftIcon` 행)                        |
| **icon-only**       | `sm` \| `md` \| `lg` (컨테이너 24·24·28px, 아이콘 14·14·16px) | **크기 prop 없음** (24px 고정, 아이콘 16px) |

## Interactive States

| State                     | TDS                                   | thaki-shared                                   |
| ------------------------- | ------------------------------------- | ---------------------------------------------- |
| Hover / active / disabled | 컴포넌트에 **미적용** (정적 span/div) | 동일                                           |
| Focus                     | 포커스 가능 요소 아님 (`span`/`div`)  | 동일                                           |
| Tooltip                   | icon-only: **항상** 표시              | icon-only: label/tooltip/variant 기반으로 표시 |

## Deprecated / 호환 (TDS)

| Prop                                                      | 동작                          |
| --------------------------------------------------------- | ----------------------------- |
| `colorScheme`                                             | dev 경고; `status` 사용 권장  |
| `tooltip`                                                 | dev 경고; 외부 `Tooltip` 권장 |
| `layout` `leftIcon` → `default`, `iconOnly` → `icon-only` | 별칭 매핑                     |

---

## Token Mapping

| TDS Token              | TDS Resolved                  | thaki-shared Token                                                 | thaki-shared Resolved | Match?                       |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------ | --------------------- | ---------------------------- |
| `--status-padding-x`   | 6px (`--spacing-1-5`)         | (implicit `px-1.5`)                                                | 6px                   | exact                        |
| `--status-padding-y`   | 4px (`--spacing-1`)           | `py-1`                                                             | 4px                   | exact                        |
| `--status-gap`         | 4px                           | `gap-1`                                                            | 4px                   | exact                        |
| `--status-radius`      | 9999px (pill)                 | `rounded-2xl` (≈16px; preset에 `2xl` 키 없으면 Tailwind 기본 1rem) | ~16px                 | **manual** (shape)           |
| `--status-font-size`   | 11px                          | `--semantic-font-size11`                                           | 11px (토큰 빌드 가정) | exact                        |
| `--status-line-height` | 16px                          | `leading-16`                                                       | 16px                  | exact                        |
| `--status-text`        | #ffffff                       | `--semantic-color-textInverse`                                     | #ffffff               | exact                        |
| `--status-success-bg`  | #4ade80                       | `--primitive-color-green400`                                       | #4ade80               | exact                        |
| `--status-danger-bg`   | #f87171                       | `--primitive-color-red400`                                         | #f87171               | exact                        |
| `--status-info-bg`     | #60a5fa                       | `--primitive-color-blue400`                                        | #60a5fa               | exact                        |
| `--status-warning-bg`  | #fb923c                       | `--primitive-color-orange400`                                      | #fb923c               | exact                        |
| `--status-muted-bg`    | #64748b (`--color-slate-500`) | muted → `--primitive-color-slate600`                               | #475569               | **manual** (muted 회색 단계) |

`token-map.md`에는 StatusIndicator 전용 행이 없음 — 위 표가 동기화용 참조.

---

## 주요 디자인 차이 (Key Design Differences)

| #   | item                                          | TDS value                                      | thaki-shared value                              | change type                                                    |
| --- | --------------------------------------------- | ---------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| 1   | 기본 레이아웃                                 | `layout` 기본 **`default`** (아이콘+라벨 항상) | 기본 **`iconOnly`**                             | api-required                                                   |
| 2   | Pill 모서리                                   | **완전 pill** (`--radius-full`)                | **`rounded-2xl`** (큰 라운드, ~16px)            | style                                                          |
| 3   | Muted 배경색                                  | **slate-500** `#64748b`                        | **slate600** `#475569`                          | token-global (shared `muted` primitive 조정 시 영향 범위 확인) |
| 4   | `badge` 레이아웃                              | 있음 (6px radius, 별도 패딩)                   | **없음**                                        | api-required                                                   |
| 5   | icon-only **크기 단계**                       | `sm`/`md`/`lg` (24·24·28px, 아이콘 14·14·16)   | **24px 고정**, 아이콘 16px만                    | style                                                          |
| 6   | 상태 **API**                                  | `status` + 넓은 `StatusType`                   | `variant` + 적은 `StatusVariant`                | api-required                                                   |
| 7   | 아이콘 세트                                   | **Tabler** `@tabler/icons-react`               | **내부 `Icon`** 프리셋                          | style                                                          |
| 8   | `enabled`, `verify-resized`, `maintenance`, … | TDS 전용 타입 다수                             | shared에 없거나 이름 다름 (`inUse` vs `in-use`) | api-required                                                   |
| 9   | Tooltip (icon-only)                           | **항상** 래핑                                  | 조건부 (`tooltip`/`label`/variant)              | style (동작 근접)                                              |
| 10  | `colorScheme`                                 | deprecated 호환만                              | **공식** 오버라이드                             | api-required                                                   |

---

## 주요 디자인 차이 요약 (한 줄)

**기본이 라벨 포함 pill(TDS) vs 아이콘만(thaki), 모서리 pill vs `rounded-2xl`, muted 배경이 slate-500 vs slate600, TDS만 `badge`/다양한 `status`·크기 단계를 제공한다.**
