# TabSelector Design Spec

> Extracted from TDS `src/design-system/components/Tabs/Tabs.tsx` (**boxed** variant 구간)  
> thaki-shared target: `src/components/TabSelector/TabSelector.tsx`, `TabSelector.styles.ts`  
> component-map: **partial** — `TabSelector` ↔ TDS `Tabs` `variant="boxed"` (segment 스타일). `TabSelector`의 `small` / `medium`은 언더라인형 탭으로 TDS `variant="underline"`에 가깝고, 별도 비교는 `specs/Tabs.md`(shared `Tabs`)를 참고.

## 매핑 요약

| thaki-shared                  | TDS                   | 비고                                      |
| ----------------------------- | --------------------- | ----------------------------------------- |
| `variant="pill"`              | `variant="boxed"`     | 세그먼트/칩형 탭 — 본 스펙의 주 비교 대상 |
| `variant="small" \| "medium"` | `variant="underline"` | 하단 보더 인디케이터형                    |
| `layout="vertical"`           | (boxed에 대응 없음)   | TDS Tabs는 boxed TabList 가로 고정        |

## Props 기본값 (A. 체크리스트)

| Prop       | TabSelector 기본값 | TDS Tabs 기본값 | 영향                                                       |
| ---------- | ------------------ | --------------- | ---------------------------------------------------------- |
| variant    | `'medium'`         | `'underline'`   | theme 미지정 시 **완전히 다른 패턴**(언더라인 vs 세그먼트) |
| size (TDS) | —                  | `'sm'`          | boxed에서 타이포만 sm/md로 갈림                            |

**api-required 후보**: shared에서 세그먼트 UI를 쓰려면 `variant="pill"`을 명시해야 함. TDS로 옮길 때는 `variant="boxed"` 명시가 동등 마이그레이션.

---

## TDS — Boxed variant (실제 TSX 기준)

> `src/index.css`의 `--tabs-boxed-*` 토큰은 정의되어 있으나 **현재 `Tabs.tsx` boxed 구현에서는 사용되지 않음** (하드코딩 Tailwind). 스펙 값은 렌더링 기준 TSX를 따름.

### TabList (boxed 컨테이너)

| Property      | Resolved 값       | TDS 참조 / 클래스                                     |
| ------------- | ----------------- | ----------------------------------------------------- |
| display       | inline-flex       | `inline-flex items-center`                            |
| gap           | 4px               | `gap-1` → `--spacing-1` = 4px                         |
| padding       | 4px               | `p-1`                                                 |
| height        | 40px (고정)       | `h-10`                                                |
| background    | #f8fafc           | `bg-[var(--color-surface-subtle)]` → slate50          |
| border (외곽) | 1px #f1f5f9       | `shadow-[inset_0_0_0_1px_var(--color-border-subtle)]` |
| border-radius | 8px               | `rounded-lg` → `--radius-lg`                          |
| width         | 콘텐츠 맞춤       | `w-fit`                                               |
| transition    | (컨테이너에 없음) | —                                                     |

### Tab 버튼 (boxed)

| Property        | Resolved 값                         | 클래스 / 토큰                                       |
| --------------- | ----------------------------------- | --------------------------------------------------- |
| layout          | flex row, 중앙 정렬                 | `flex items-center justify-center`                  |
| min-width       | 80px                                | `min-w-[80px]`                                      |
| padding-x       | 12px                                | `px-3` → `--spacing-3`                              |
| height          | 32px                                | `h-8`                                               |
| border-radius   | 6px                                 | `rounded-md` → `--radius-md`                        |
| font-weight     | 500                                 | `font-medium`                                       |
| transition      | color 150ms                         | `transition-colors duration-[var(--duration-fast)]` |
| typography (sm) | 12px / 16px                         | `--tabs-font-size-sm`, `--tabs-line-height-sm`      |
| typography (md) | 14px / 20px                         | `--tabs-font-size-md`, `--tabs-line-height-md`      |
| focus           | TSX에 ring/outline 전용 클래스 없음 | 글로벌/브라우저 기본에 의존                         |
| disabled        | opacity 50%, cursor not-allowed     | `opacity-50`, `cursor-not-allowed`                  |

### Tab 버튼 — 상태 색 (boxed)

| State    | Background       | Text             | Border / 그림자                                    |
| -------- | ---------------- | ---------------- | -------------------------------------------------- |
| default  | transparent      | #0f172a          | —                                                  |
| hover    | #ffffff          | #0f172a          | —                                                  |
| active   | #ffffff          | #2563eb          | inset 1px `#e2e8f0` + `0 1px 2px rgba(0,0,0,0.05)` |
| disabled | (동일 비율 흐림) | (동일 비율 흐림) | opacity 50%                                        |

---

## thaki-shared — `variant="pill"` (TabSelector)

### 컨테이너 (`tabSelectorStyles` + pill)

| Property      | 클래스 / 의도                                                        | Resolved (토큰 기준)                                                                                 |
| ------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| display       | `flex` + `items-center`                                              | 가로 그룹                                                                                            |
| gap           | `gap-2`                                                              | `--primitive-space-2` = 8px                                                                          |
| background    | `bg-surface-muted`                                                   | `--semantic-color-surfaceMuted` → `#f1f5f9` (token-map: blueGray100)                                 |
| border        | `border border-border-subtle`                                        | 1px `#f1f5f9` (borderSubtle)                                                                         |
| border-radius | `rounded-md`                                                         | `--semantic-radius-md` / primitive = **6px**                                                         |
| padding       | `p-xxs`                                                              | 주석상 4px 의도 — `tailwind.preset.js`의 `spacing`에 **`xxs` 키 없음** → 빌드에서 미생성 가능성 있음 |
| width         | `w-fit`                                                              | 콘텐츠 맞춤                                                                                          |
| 하단 보더     | 기본 베이스 `border-b border-border`가 pill에서 `border-0` 후 재적용 | 외곽은 `border-subtle` 위주                                                                          |

### 버튼 (`tabButtonStyles`, pill)

| Property       | 클래스                              | Resolved 의도                                                                                    |
| -------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| min-width      | `min-w-[100px]`                     | **100px** (TDS 80px와 다름)                                                                      |
| padding        | `py-2 px-3`                         | 8px 세로, 12px 가로                                                                              |
| gap            | `gap-1`                             | 4px (아이콘 없을 때 영향 작음)                                                                   |
| border-radius  | `rounded-md`                        | 6px                                                                                              |
| font           | `text-[11px] leading-[16px]`        | **11px / 16px** (TDS sm/md 타이포와 다름)                                                        |
| transition     | `transition-all duration-normal`    | **200ms** (`--primitive-duration-200`, TDS boxed 탭은 150ms color만)                             |
| font-weight    | `font-medium`                       | 500                                                                                              |
| inactive text  | `text-text`                         | `--semantic-color-text` — token-map: trueGray900 **#171717** vs TDS default **#0f172a** (manual) |
| inactive hover | `hover:not-disabled:bg-transparent` | TDS는 hover 시 **흰 배경** — **DIFF**                                                            |
| disabled       | `disabled:opacity-disabled`         | 시맨틱 토큰 (TDS 고정 50%와 별도)                                                                |

### 버튼 — 상태 색 (pill, compoundVariants)

| State    | 클래스 요약                                           | 효과                                                                         |
| -------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| active   | `border border-border-subtle bg-surface text-primary` | 배경 #fff, 1px borderSubtle, 텍스트 primary (#2563eb)                        |
| inactive | 투명 border + `text-text`                             | TDS boxed inactive는 텍스트가 동일하게 default이나, **hover 배경 처리 상이** |

---

## Interactive States (동적)

| State     | TabSelector (pill)              | TDS boxed                         |
| --------- | ------------------------------- | --------------------------------- |
| selected  | `active: true` CVA              | `activeTab === value`             |
| disabled  | `disabled:` + `option.disabled` | `disabled` prop + `aria-disabled` |
| copied 등 | 없음                            | 없음                              |

---

## 아이콘 비교

| 항목        | TDS boxed Tab | TabSelector |
| ----------- | ------------- | ----------- |
| 내장 아이콘 | 없음          | 없음        |

---

## Token Mapping (참조)

| TDS Token / 사용처              | TDS Resolved | thaki-shared (pill에서 유사 역할)      | shared Resolved (token-map) | Match     |
| ------------------------------- | ------------ | -------------------------------------- | --------------------------- | --------- |
| `--color-surface-subtle` (List) | #f8fafc      | `--semantic-color-surfaceMuted` (배경) | #f1f5f9                     | ❌ DIFF   |
| `--color-border-subtle`         | #f1f5f9      | `--semantic-color-borderSubtle`        | #f1f5f9                     | exact     |
| `--color-border-default`        | #e2e8f0      | (active tab border subtle과 조합)      | #e2e8f0                     | 역할 상이 |
| `--color-action-primary`        | #2563eb      | `--semantic-color-primary`             | #2563eb                     | exact     |
| `--color-text-default`          | #0f172a      | `--semantic-color-text`                | #171717 (manual)            | ❌ DIFF   |
| `--duration-fast`               | 150ms        | `--primitive-duration-200`             | 200ms                       | ❌ DIFF   |
| `--radius-lg` (List)            | 8px          | `--semantic-radius-md` (container)     | 6px                         | ❌ DIFF   |
| `--radius-md` (Tab)             | 6px          | `rounded-md`                           | 6px                         | exact     |

---

## 주요 디자인 차이

| #   | 항목               | TDS (boxed)                                   | TabSelector (`pill`)             | 유형           | 비고 / 마이그레이션                                         |
| --- | ------------------ | --------------------------------------------- | -------------------------------- | -------------- | ----------------------------------------------------------- |
| 1   | 세그먼트 트랙 배경 | `#f8fafc` (surface-subtle)                    | `#f1f5f9` (surface-muted)        | `style`        | 토큰 정렬 또는 shared 배경 토큰을 subtle 쪽으로 맞추는 검토 |
| 2   | 외곽 코너 반경     | 8px (`rounded-lg`)                            | 6px (`rounded-md`)               | `style`        |                                                             |
| 3   | 탭 간 gap          | 4px                                           | 8px                              | `style`        |                                                             |
| 4   | 트랙 고정 높이     | 40px (`h-10`)                                 | 없음 (콘텐츠 기반)               | `style`        |                                                             |
| 5   | 탭 min-width       | 80px                                          | 100px                            | `style`        |                                                             |
| 6   | 탭 높이            | 32px (`h-8`)                                  | `py-2` 기준 약 32px 내외         | `style`        | 수치는 유사하나 padding 모델 다름                           |
| 7   | 탭 타이포          | sm: 12/16, md: 14/20                          | 11/16 고정                       | `style`        |                                                             |
| 8   | 비활성 탭 hover    | 배경 → `#ffffff`                              | 배경 유지(transparent)           | `style`        |                                                             |
| 9   | 활성 탭 그림자     | inset default border + drop shadow            | borderSubtle만, drop shadow 없음 | `style`        |                                                             |
| 10  | transition 시간    | 150ms (color)                                 | 200ms (`transition-all`)         | `style`        |                                                             |
| 11  | 기본 variant       | TDS `underline` / shared `medium`(언더라인형) | —                                | `api-required` | 동일 UI를 쓰려면 각각 `boxed` / `pill` 명시 필요            |
| 12  | `p-xxs`            | —                                             | preset에 키 없음 가능            | `style`        | `p-1`(4px) 등으로 치환 검토                                 |
| 13  | 텍스트 default hex | #0f172a                                       | #171717 (semantic.text)          | `token-global` | token-map manual 항목                                       |

---

## TabSelector `small` / `medium` (언더라인형) — 참고

- 컨테이너: `border-b border-border`, 탭 간 `gap-4`(16px) / `gap-6`(24px).
- 탭: 하단 2px 보더로 활성 표시 (`border-b-primary`), 비활성 텍스트 `text-subtle`, 활성 `text-primary`.
- TDS `underline`과 시각적으로 유사하나 간격·패딩·호버 색은 `specs/Tabs.md`의 shared **Tabs**와 다를 수 있음 — 통합 싱크 시 Tabs vs TabSelector 사용처를 구분해 적용.
