# CopyButton Design Spec

> Extracted from TDS `src/design-system/components/CopyButton/CopyButton.tsx`  
> thaki-shared target: `src/components/CopyButton/CopyButton.tsx`  
> component-map: **1:1** (`CopyButton` ↔ `CopyButton`)

## 싱크 범위 메모

- **디자인 페이지 / Copyable 연동 기준**: TDS는 **`size="sm"`** 만 쓰는 것으로 가정하고 스타일 싱크의 기준 트리트먼트로 삼음. (`variant` / `size` API는 TDS에만 존재 — **스타일만** shared에 맞출 때는 아래 **ghost + sm + icon-only** 트리트먼트와 비교.)
- **아이콘**: 싱크 후에도 **인라인 SVG 유지** (Tabler로 교체하지 않음). 시각적 목표는 TDS와의 **색·크기·굵기** 정렬.
- **API 차이**는 스타일 변경과 분리해 별도 절에만 기술.

## API 차이 (디자인 싱크 범위 밖 — 참고)

| 구분            | TDS                                                   | thaki-shared                                |
| --------------- | ----------------------------------------------------- | ------------------------------------------- |
| 복사 값 prop    | `value`                                               | `text`                                      |
| variant         | `default` \| `ghost` \| `outline` (기본 `ghost`)      | 없음 (단일 스타일)                          |
| size            | `sm` \| `md` \| `lg` (기본 `sm`)                      | 없음 (`size-3` 고정)                        |
| 라벨 / iconOnly | `label`, `successLabel`, `iconOnly`, 커스텀 아이콘 등 | 기본은 아이콘만; `children`으로 텍스트 가능 |
| 콜백 / tooltip  | `onCopy`, `onError`, `tooltip` 등                     | 없음                                        |
| disabled        | `disabled` + `opacity-50` 등                          | props에 없음 (스타일도 없음)                |

**Props 기본값 (시각에 영향)**

- TDS: `variant="ghost"`, `size="sm"`, `label="Copy"`, `iconOnly=false` (디자인 시안에서 텍스트 버튼이면 라벨 표시).
- shared: 단일 문자열 스타일; 기본 렌더는 copy/check 아이콘만.

---

## Base Styles (공통 — TDS)

| Property      | Resolved                          | TDS token / class                                                              |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| display       | inline-flex, align/justify center | `inline-flex items-center justify-center`                                      |
| border        | 1px solid (색은 variant)          | `border`                                                                       |
| border-radius | **4px**                           | `rounded-[var(--radius-sm)]` → `--radius-sm: 4px`                              |
| font-weight   | 500                               | `font-medium`                                                                  |
| transition    | color (및 관련) **150ms**         | `transition-colors duration-[var(--duration-fast)]` → `--duration-fast: 150ms` |
| focus-visible | ring 2px **#2563eb**              | `focus-visible:ring-2 focus-visible:ring-[var(--color-action-primary)]`        |
| disabled      | opacity 50%, not-allowed          | `opacity-50 cursor-not-allowed`                                                |

---

## Variants (TDS)

### `variant="ghost"` (shared 단일 스타일과 비교 기준)

| State   | Background                         | Text                             | Border      |
| ------- | ---------------------------------- | -------------------------------- | ----------- |
| default | transparent                        | #0f172a (`--color-text-default`) | transparent |
| hover   | #f8fafc (`--color-surface-subtle`) | #0f172a                          | transparent |

### `variant="default"`

| State   | Background                         | Text    | Border      |
| ------- | ---------------------------------- | ------- | ----------- |
| default | #f1f5f9 (`--color-surface-muted`)  | #0f172a | transparent |
| hover   | #f8fafc (`--color-surface-subtle`) | #0f172a | transparent |

### `variant="outline"`

| State   | Background  | Text    | Border                             |
| ------- | ----------- | ------- | ---------------------------------- |
| default | transparent | #0f172a | #e2e8f0 (`--color-border-default`) |
| hover   | #f8fafc     | #0f172a | #e2e8f0                            |

---

## Sizes (TDS)

| Size | Height                           | Padding X          | Font                                    | Line height               | Gap (아이콘–텍스트) | Icon (Tabler)                          |
| ---- | -------------------------------- | ------------------ | --------------------------------------- | ------------------------- | ------------------- | -------------------------------------- |
| sm   | **24px** (`h-6` → `--spacing-6`) | **6px** (`px-1.5`) | 11px (`text-body-sm`, `--font-size-11`) | 16px (`--line-height-16`) | 4px (`gap-1`)       | 12px, copy stroke 1.5 / check stroke 2 |
| md   | 32px                             | 8px                | 12px (`text-body-md`)                   | 18px                      | 6px                 | 14px                                   |
| lg   | 36px                             | 10px               | 12px                                    | 18px                      | 8px                 | 16px                                   |

`iconOnly`일 때도 sm 기준 `px-1.5`가 유지됨 (패딩이 아이콘 주변 최소 히트 영역 역할).

---

## Interactive States (동적)

| State            | 조건              | TDS 적용                                                      | Resolved / 비고                                   |
| ---------------- | ----------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| copied / success | `copied === true` | 버튼에 `successStyles`: 전체 **텍스트(및 아이콘) 색** 성공색  | `text-[var(--color-state-success)]` → **#22c55e** |
| copied 콘텐츠    | 동일              | 아이콘을 check로 교체, 라벨은 `successLabel` (기본 `Copied!`) | —                                                 |
| disabled         | `disabled`        | `opacity-50`, `cursor-not-allowed`                            | —                                                 |

**thaki-shared**

| State    | 조건       | 적용                  | 비고                                                      |
| -------- | ---------- | --------------------- | --------------------------------------------------------- |
| copied   | `isCopied` | 아이콘만 check로 교체 | **버튼/아이콘 색은 기본 `text-muted` 유지** (성공색 없음) |
| disabled | —          | 없음                  | `disabled` prop 미노출                                    |

---

## CSS 구현 기법 차이

| 요소             | 시각 효과     | TDS                                          | thaki-shared                         | 차이 영향                                                      |
| ---------------- | ------------- | -------------------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| 테두리           | 기본 1px 윤곽 | `border` + variant별 색 (`transparent` 포함) | `border-none`                        | TDS는 레이아웃에 1px 보더 박스 포함; shared는 보더 없음        |
| display          | 콘텐츠 래핑   | `inline-flex`                                | `flex` (또는 동일 줄에서의 flex)     | 인라인 흐름에서 동작 미세 차이 가능                            |
| 포커스           | 2px 강조      | `ring-2` (box-shadow 계열)                   | `outline` 2px + `outline-offset` 2px | 스택/접근성 포커스 링 외형이 다름; 값은 둘 다 포커스 블루 계열 |
| 복사 완료 피드백 | 성공 상태     | 전역 **색 변경** (녹색)                      | **아이콘 스왑만**                    | 의미 전달 방식이 다름                                          |

> Apply 시 값만 맞추기보다, 링 vs 아웃라인 등 **동일 property로 맞출지**는 별도 결정이 필요.

## CVA Base 상속 분석

thaki-shared `CopyButton`은 **CVA 미사용** (단일 `copyButtonStyles` 문자열). 해당 없음.

---

## 아이콘 비교

| 아이콘 | TDS                                  | thaki-shared (인라인 SVG 유지 정책)         |
| ------ | ------------------------------------ | ------------------------------------------- |
| copy   | `IconCopy` 12px (sm), **stroke 1.5** | 12×12, viewBox 0 0 12 12, **strokeWidth 1** |
| check  | `IconCheck` 12px, **stroke 2**       | 12×12, **strokeWidth 1.5**                  |
| 색     | `currentColor` (버튼 글자색 상속)    | `stroke="currentColor"`                     |

싱크 시: **stroke 굵기**를 TDS에 더 가깝게 올릴지(복사 1.5, 체크 2)는 시각 결정. (path 형태는 유지.)

---

## thaki-shared 현재 스타일 (요약)

| Property            | 값 / 클래스                                                   | Resolved (tokens-light 기준)                                                  |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 터치 박스           | `size-3 p-0`                                                  | **12×12px** (아이콘과 동일)                                                   |
| 배경                | `bg-transparent`                                              | —                                                                             |
| 기본 글자/아이콘 색 | `text-text-muted`                                             | **#475569**                                                                   |
| hover 글자          | `hover:text-text`                                             | **#0f172a**                                                                   |
| hover 배경          | `hover:bg-surface-muted`                                      | **#f1f5f9** (TDS ghost hover의 `#f8fafc`와 다름)                              |
| active              | `active:text-text-strong`                                     | 프리셋에 `text-strong` 색 키 없음 → **유틸 미해결 가능**                      |
| radius              | `rounded-sm`                                                  | `--semantic-radius-sm` → **0.125rem (2px)** @ 16px root                       |
| focus               | `outline-[2px] outline-border-focus outline-offset-[2px]`     | 포커스 **#3b82f6** 계열                                                       |
| transition          | `transition-[color,background] duration-control ease-control` | `duration-control` / `ease-control`는 preset에 없음 → **적용 불명/무효 가능** |

---

## Token Mapping (참조)

| TDS token                                       | TDS resolved      | thaki-shared token                  | shared resolved (tokens-light) | Match                                                           |
| ----------------------------------------------- | ----------------- | ----------------------------------- | ------------------------------ | --------------------------------------------------------------- |
| `--color-text-default`                          | #0f172a           | `--semantic-color-text`             | #0f172a                        | exact                                                           |
| `--color-text-muted`                            | #475569           | `--semantic-color-textMuted`        | #475569                        | exact                                                           |
| `--color-surface-subtle`                        | #f8fafc           | `--semantic-color-surfaceSubtle`    | #f8fafc                        | exact                                                           |
| `--color-surface-muted`                         | #f1f5f9           | `--semantic-color-surfaceMuted`     | #f1f5f9                        | exact                                                           |
| `--color-border-focus` / action primary (focus) | #3b82f6 / #2563eb | `--semantic-color-borderFocus` 등   | #3b82f6                        | exact (focus 색)                                                |
| `--color-state-success`                         | #22c55e           | `--semantic-color-stateSuccess`     | #22c55e                        | exact (현재 JSON)                                               |
| `--radius-sm`                                   | **4px**           | `--semantic-radius-sm` (rounded-sm) | **2px**                        | ❌ DIFF (이름/역할 혼동 주의: TDS sm=4px = shared **base** 4px) |
| `--duration-fast`                               | 150ms             | `--primitive-duration-150`          | 150ms                          | exact                                                           |

> `token-map.md`의 `--color-state-success` vs green400 **manual** 메모는 과거 값일 수 있음. **현재** `tokens-light.css`의 `--semantic-color-stateSuccess`는 **#22c55e**로 TDS와 동일.

---

## 주요 디자인 차이

| #   | 차이                           | 유형           | 설명                                                                                                                                                                 |
| --- | ------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **히트 영역 / 높이**           | `style`        | shared **12×12** vs TDS sm **24px** 높이 + 좌우 패딩 6px (아이콘-only도 최소 24px 타깃)                                                                              |
| 2   | **기본 아이콘 색**             | `style`        | shared 기본 **muted (#475569)** vs TDS ghost 기본 **text-default (#0f172a)**                                                                                         |
| 3   | **hover 배경**                 | `style`        | shared **surface-muted #f1f5f9** vs TDS ghost **surface-subtle #f8fafc**                                                                                             |
| 4   | **모서리 반경**                | `style`        | shared **2px** (`rounded-sm`) vs TDS **4px** (`--radius-sm`)                                                                                                         |
| 5   | **복사 완료**                  | `style`        | TDS는 **전체 녹색 텍스트**; shared는 **아이콘 교체만**, 색 유지                                                                                                      |
| 6   | **포커스**                     | `style`        | ring(TDS) vs outline+offset(shared) — 기법 차이                                                                                                                      |
| 7   | **보더**                       | `style`        | TDS 1px 보더(투명 포함) vs shared 보더 없음                                                                                                                          |
| 8   | **아이콘 스트로크**            | `style`        | Tabler 굵기 vs 인라인 SVG 1 / 1.5                                                                                                                                    |
| 9   | **disabled / transition 유틸** | `api-required` | shared는 disabled·일관 duration 미정의; TDS는 `disabled`+150ms. **영향**: 접근성·키보드 사용자. **마이그레이션**: 필요 시 `disabled` prop 및 `duration-150` 등 명시. |
| 10  | **variant/size/label API**     | `api-required` | TDS 전용. **영향**: 공용 API 정렬 시 shared 확장 필요. **마이그레이션**: 스타일만 싱크할 경우 API 변경 없이 토큰·클래스만 조정 가능.                                 |

---

## 필수 체크리스트 (Extract)

- **A. Props 기본값**: 상기 API 표 및 TDS `variant`/`size` 기본값 기록함.
- **B. TDS 전용 variant/size**: 디자인 시안은 **sm** 위주; `default`/`outline`/md/lg는 문서화만 (Apply에서 제외 가능).
- **C. 색상**: 성공/텍스트/서피스는 현재 토큰 파일 기준 대부분 일치; **radius sm vs TDS radius-sm**은 값 불일치.
- **D. deprecated 후보**: 미검색 (요청 범위 외 시 생략).
