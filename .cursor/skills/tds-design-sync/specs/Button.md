# Button Design Spec

> Extracted from TDS `src/design-system/components/Button/Button.tsx`  
> thaki-shared target: `src/components/Button/` (매핑: **1:1**, `component-map.md`)

## Base Styles

| Property      | Value                 | TDS Token / Class                                                    |
| ------------- | --------------------- | -------------------------------------------------------------------- |
| border-radius | 6px                   | `rounded-[var(--button-radius)]` → `--radius-button` → `--radius-md` |
| transition    | color 150ms           | `transition-colors duration-[var(--duration-fast)]`                  |
| font-weight   | 500                   | `font-medium`                                                        |
| focus-visible | ring 1px, offset 1px  | `ring-[var(--color-border-focus)]` → `#3b82f6`                       |
| cursor        | pointer / not-allowed | `cursor-pointer`, `disabled:cursor-not-allowed`                      |
| layout        | inline-flex, centered | `inline-flex items-center justify-center`                            |

**thaki-shared Base (대비)**

| Property      | thaki-shared                                                             |
| ------------- | ------------------------------------------------------------------------ |
| border-radius | `rounded-md` → `--semantic-radius-md` → `0.375rem` (**6px** @ 16px root) |
| transition    | `transition-colors duration-normal ease-in-out` → **200ms**              |
| focus-visible | `ring-1 ring-blue-500 ring-offset-1` (Tailwind `blue-500` ≈ `#3b82f6`)   |
| outline       | `outline-none` (TDS도 `focus-visible:outline-none`)                      |

## Variants

### variant="primary"

| State    | Background                           | Text                              | Border |
| -------- | ------------------------------------ | --------------------------------- | ------ |
| default  | `#2563eb`                            | `#ffffff`                         | —      |
| hover    | `#1d4ed8`                            | `#ffffff`                         | —      |
| active   | `#1e40af`                            | `#ffffff`                         | —      |
| disabled | `#e2e8f0` (`--color-border-default`) | `#64748b` (`--color-text-subtle`) | —      |

**thaki-shared primary**: `bg` / `hover` / text는 `--component-button-solid-primary-*`로 TDS와 **동일 hex**. 비활성은 **전역 `state: disabled` → `opacity-60`**로 처리되어, TDS와 **시각적으로 불일치**(회색 솔리드 vs 투명도).

### variant="secondary"

| State    | Background | Text      | Border        |
| -------- | ---------- | --------- | ------------- |
| default  | `#ffffff`  | `#0f172a` | 1px `#cbd5e1` |
| hover    | `#f1f5f9`  | `#0f172a` | `#cbd5e1`     |
| active   | `#ffffff`  | `#0f172a` | (동일)        |
| disabled | `#f8fafc`  | `#94a3b8` | `#e2e8f0`     |

**thaki-shared secondary**: `bg-surface`, `border-slate-300`, `text` slate900, hover `bg-slate-100` — 팔레트는 동일 계열. 비활성은 **opacity-60** (TDS는 배경/텍스트/보더 개별 토큰).

### variant="outline"

| State    | Background  | Text      | Border        |
| -------- | ----------- | --------- | ------------- |
| default  | transparent | `#0f172a` | 1px `#cbd5e1` |
| hover    | `#f1f5f9`   | `#0f172a` | `#cbd5e1`     |
| active   | `#ffffff`   | `#0f172a` | —             |
| disabled | —           | `#94a3b8` | `#e2e8f0`     |

**thaki-shared outline**: hover `bg-slate-100`, 비활성 **opacity-60**.

### variant="ghost"

| State    | Background  | Text      | Border |
| -------- | ----------- | --------- | ------ |
| default  | transparent | `#475569` | —      |
| hover    | `#f1f5f9`   | `#475569` | —      |
| active   | `#e2e8f0`   | `#475569` | —      |
| disabled | —           | `#94a3b8` | —      |

**thaki-shared ghost**: hover `bg-slate-100`, **active 배경 없음**(TDS는 `active:bg` border-default).

### variant="muted"

| State    | Background | Text      | Border        |
| -------- | ---------- | --------- | ------------- |
| default  | `#ffffff`  | `#475569` | 1px `#cbd5e1` |
| hover    | `#f8fafc`  | `#0f172a` | `#cbd5e1`     |
| active   | `#ffffff`  | `#475569` | —             |
| disabled | `#ffffff`  | `#94a3b8` | `#e2e8f0`     |

**thaki-shared muted**: hover `bg-slate-50` + 텍스트 slate900 — TDS `surface-subtle`(`#f8fafc`)과 동일 계열.

### variant="danger"

| State    | Background              | Text            | Border |
| -------- | ----------------------- | --------------- | ------ |
| default  | `#ef4444`               | `#ffffff`       | —      |
| hover    | `#dc2626`               | `#ffffff`       | —      |
| active   | `#b91c1c`               | `#ffffff`       | —      |
| disabled | `#ef4444` @ 50% opacity | `#ffffff` @ 50% | —      |

**thaki-shared danger**: `bg-red-500` / hover `red-600` — **red-500/600**는 TDS `--color-state-danger` 체인과 **동일 hex**. 비활성: shared는 **opacity-60** 전역, TDS는 **opacity-50**만 danger 블록.

### variant="warning"

| State    | Background      | Text            | Border |
| -------- | --------------- | --------------- | ------ |
| default  | `#f97316`       | `#ffffff`       | —      |
| hover    | `#ea580c`       | `#ffffff`       | —      |
| active   | `#c2410c`       | `#ffffff`       | —      |
| disabled | `#f97316` @ 50% | `#ffffff` @ 50% | —      |

**thaki-shared**: `Button.styles.ts`의 **variant 목록에 `warning` 없음** (`Button.types`에도 없음). → **TDS 전용 variant**.

### variant="link"

| State    | 스타일                                                                   |
| -------- | ------------------------------------------------------------------------ |
| default  | 투명 배경, `text` primary `#2563eb`, `min-w-0`, `h-auto`, `rounded-none` |
| hover    | underline, `underline-offset-4`                                          |
| active   | 텍스트 `#1e40af`                                                         |
| disabled | `#94a3b8`, 밑줄 없음                                                     |

**thaki-shared link**: `underline-offset-0`, `decoration-2`, `pb-px`, primary 텍스트 `primitive blue600` — hover/오프셋이 TDS와 다름.

## Sizes

### TDS

| Size | Height       | Padding X | Padding Y | Font Size             | Line Height    | Gap | Min width |
| ---- | ------------ | --------- | --------- | --------------------- | -------------- | --- | --------- |
| xs   | 24px (`h-6`) | 8px       | 4px       | 11px (`text-body-sm`) | 16px (body-sm) | 4px | 48px      |
| sm   | 28px         | 10px      | 6px       | 11px                  | 16px           | 6px | 60px      |
| md   | 32px         | 12px      | 8px       | 11px                  | 16px           | 6px | 80px      |
| lg   | 36px         | 16px      | 10px      | 12px                  | 18px           | 8px | 80px      |

아이콘-only: sm/md/lg는 각 높이와 동일한 **정사각형**, 패딩 0. xs는 `24×24`.

### thaki-shared

| Size        | Height                  | Padding (approx)  | Font                 | Gap | Min width |
| ----------- | ----------------------- | ----------------- | -------------------- | --- | --------- |
| sm          | 28px (`h-control-sm`)   | pl 8px / pr 10px  | 11px, `leading-none` | 6px | **42px**  |
| md          | 32px                    | pl 12px / pr 14px | **12px**             | 6px | 80px      |
| lg          | 36px                    | pl 16px / pr 16px | **14px**             | 8px | 80px      |
| half / full | (md와 동일 높이·타이포) | —                 | —                    | —   | —         |
| icon-only   | 28px 정사각형           | 0                 | —                    | 0   | —         |

**차이 요약**: shared **sm 최소 너비 42px vs TDS 60px**; **md/lg 폰트 크기**(shared 12px/14px vs TDS 11px/12px); shared는 **`leading-none`**, TDS는 **고정 line-height 토큰**.

## States (정적)

### disabled

|         | TDS                        | thaki-shared                        |
| ------- | -------------------------- | ----------------------------------- |
| primary | 배경/텍스트 토큰 교체      | `opacity-60` + `cursor-not-allowed` |
| 기타    | variant별 배경·텍스트·보더 | 동일 `opacity-60`                   |
| cursor  | `not-allowed`              | `not-allowed`                       |

### loading

|        | TDS                                                               | thaki-shared                                      |
| ------ | ----------------------------------------------------------------- | ------------------------------------------------- |
| 표시   | 기본 콘텐츠 대체 → **인라인 SVG** 스피너 + `sr-only` "Loading..." | `loadingElement`(기본 `LoadingSpinner size="sm"`) |
| 스타일 | 스피너만 표시, 버튼 색은 variant 유지                             | **`opacity-60` + `cursor-wait`** (전체 버튼)      |
| aria   | `aria-busy`                                                       | (코드상 미설정)                                   |

**로딩 스피너**: TDS는 **24×24 viewBox** SVG, 크기는 `size-2.5`~`size-4`. shared는 **LoadingSpinner** — `sm` = `size-4` border 링 스피너(구현 상이).

### focus-visible

- TDS: `ring` semantic focus 색 (`--color-border-focus` `#3b82f6`)
- shared: `ring-blue-500` — 실질적으로 동일 톤

## Interactive States (동적)

| State             | 조건        | TDS              | thaki-shared               |
| ----------------- | ----------- | ---------------- | -------------------------- |
| loading           | `isLoading` | 콘텐츠 → Spinner | `state: loading` + opacity |
| copied/success 등 | —           | **없음**         | **없음**                   |

## 아이콘 비교

| 용도         | TDS                                                | thaki-shared                               |
| ------------ | -------------------------------------------------- | ------------------------------------------ |
| 좌/우 아이콘 | `leftIcon` / `rightIcon` (소비자가 Tabler 등 전달) | `frontIcon` / `rearIcon`                   |
| 아이콘 전용  | `icon` + `aria-label` 필수                         | 단일 자식 아이콘 패턴(스토리) — API는 다름 |
| 로딩         | 인라인 SVG (animate-spin)                          | `LoadingSpinner` (div + border 애니메이션) |

## Props 기본값 비교

| Prop          | TDS 기본                    | thaki-shared 기본 |
| ------------- | --------------------------- | ----------------- |
| variant       | `primary`                   | `primary`         |
| size          | `md`                        | `md`              |
| isLoading     | `false`                     | `false`           |
| type (button) | `'button'` (button 요소 시) | `'button'`        |

**API 차이 (디자인 영향)**

- TDS: `as` 폴리모픽, `fullWidth`, `iconOnly`, `appearance`(호환), `leftIcon`/`rightIcon`/`icon`
- shared: `<button>` 고정, `size`: `half` | `full` | `icon-only`, **`warning` variant 없음**, **`xs` size 없음**

## Token Mapping (참조)

| TDS Token                                  | TDS Resolved | thaki-shared Token                         | shared Resolved    | Match                                       |
| ------------------------------------------ | ------------ | ------------------------------------------ | ------------------ | ------------------------------------------- |
| `--button-height-sm`                       | 28px         | `--semantic-control-height-sm`             | 1.75rem → **28px** | exact                                       |
| `--button-height-md`                       | 32px         | `--semantic-control-height-md`             | 2rem → **32px**    | exact                                       |
| `--button-height-lg`                       | 36px         | `--semantic-control-height-lg`             | 2.25rem → **36px** | exact                                       |
| `--button-radius`                          | 6px          | `rounded-md` → `--semantic-radius-md`      | 0.375rem → **6px** | exact                                       |
| `--color-action-primary`                   | `#2563eb`    | `--component-button-solid-primary-bg`      | `#2563eb`          | exact                                       |
| `--color-action-primary-hover`             | `#1d4ed8`    | `--component-button-solid-primary-bgHover` | `#1d4ed8`          | exact                                       |
| `--duration-fast`                          | 150ms        | `duration-normal` 사용                     | **200ms**          | ❌ DIFF (구현)                              |
| `--semantic-control-radius` (파일 내 별도) | —            | `--semantic-control-radius`                | `0.25rem` (4px)    | 버튼은 `rounded-md` 사용으로 **실사용 6px** |

> `token-map.md`의 “exact”는 **이름 매핑**이며, **disabled/loading 표현**은 컴포넌트 구현 차이로 동일 토큰만으로는 맞지 않음.

## 주요 디자인 차이

| 항목                           | 변경 유형      | 요약                                                                   |
| ------------------------------ | -------------- | ---------------------------------------------------------------------- |
| Primary (및 공통) **disabled** | `style`        | TDS는 배경·텍스트 토큰 교체 / shared는 **전체 opacity 60%**            |
| **Loading** 상태               | `style`        | TDS는 스피너만·색 유지 / shared는 **opacity 60% + cursor-wait**        |
| **md/lg 타이포**               | `style`        | TDS 11px/12px + 고정 line-height / shared **12px/14px + leading-none** |
| **sm min-width**               | `style`        | TDS 60px / shared **42px**                                             |
| **warning** variant            | `api-required` | TDS만 존재 — shared에 **추가 또는 문서화된 미지원**                    |
| **xs** size                    | `api-required` | TDS만 존재                                                             |
| **half / full** size           | `api-required` | shared만 존재 (TDS는 `fullWidth` boolean)                              |
| **Ghost active**               | `style`        | TDS `active:bg` border / shared **미정의**                             |
| **Link** underline offset      | `style`        | TDS offset-4 / shared offset-0 + decoration-2                          |
| **Transition** duration        | `style`        | TDS 150ms / shared 200ms                                               |
| 폴리모픽 `as`                  | `api-required` | TDS만                                                                  |

---

_Generate with tds-design-extract — Button_
