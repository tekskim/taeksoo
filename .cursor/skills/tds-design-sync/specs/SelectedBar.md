# SelectedBar Design Spec

> Extracted from TDS `src/design-system/components/SelectionIndicator/SelectionIndicator.tsx` (+ `Chip.tsx` for removable pills)  
> Demo: `src/pages/design/components/SelectionIndicatorPage.tsx` — `/design/components/selection-indicator`  
> thaki-shared target: `src/components/SelectedBar/SelectedBar.tsx` (+ `Tag` for pills)

## 매핑 메모 (component-map)

- 기존 표에서는 **SelectionIndicator**가 “shared에 대응 없음(skip)”으로 기록되어 있었음.
- **SelectedBar**는 동일 UX(테이블·리스트 선택 요약 + 칩 제거)를 목표로 한 **신규 shared 컴포넌트**로, TDS와는 **부분 대응(partial)** — 구조·API·상태가 다름.

---

## 1. TDS SelectionIndicator — 추출

### Base Styles (컨테이너)

| Property          | Resolved value                                | TDS Token / class                                        |
| ----------------- | --------------------------------------------- | -------------------------------------------------------- |
| Layout            | `flex-row`, `items-center`, `justify-between` | —                                                        |
| Min height        | **42px**                                      | `h-[42px]`                                               |
| Padding X         | **12px**                                      | `px-[var(--inline-message-padding)]` → `--spacing-3`     |
| Padding Y         | **0**                                         | `py-0`                                                   |
| Border radius     | **6px**                                       | `rounded-[var(--inline-message-radius)]` → `--radius-md` |
| Row gap (좌↔우)   | **16px**                                      | `gap-4`                                                  |
| Background (기본) | **#f8fafc**                                   | `bg-[var(--color-surface-subtle)]` (slate50)             |
| Background (에러) | **#fef2f2**                                   | `bg-[var(--inline-message-error-bg)]` → `--color-red-50` |
| Transition        | (컨테이너 자체 없음)                          | —                                                        |

### 내부 칩 영역

| Property | Value                               | TDS Token / class                                 |
| -------- | ----------------------------------- | ------------------------------------------------- |
| Layout   | `flex`, `items-center`, `flex-wrap` | —                                                 |
| Gap      | **8px**                             | `gap-[var(--inline-message-gap)]` → `--spacing-2` |

### Empty 상태 (선택 없음, 에러 아님)

| Property   | Value                    | TDS                              |
| ---------- | ------------------------ | -------------------------------- |
| Typography | **12px / 18px**, regular | `text-body-md`                   |
| Text color | **#475569**              | `text-[var(--color-text-muted)]` |
| 기본 문구  | `"No item selected"`     | `emptyText` 기본값               |

### Error 상태 (`error && !hasSelection`)

| Property   | Value                      | TDS                                                                                                          |
| ---------- | -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Icon       | Tabler `IconAlertTriangle` | size **16**, `strokeWidth={1.5}`                                                                             |
| Icon color | **#dc2626**                | `text-[var(--inline-message-error-icon)]` → `--color-red-600`                                                |
| Message TY | **12px / 16px**            | `text-[length:var(--inline-message-font-size)]` → 12px, `leading-[var(--inline-message-line-height)]` → 16px |
| Text color | **#0f172a**                | `text-[var(--inline-message-text)]`                                                                          |
| `role`     | `status`                   | 접근성                                                                                                       |

### 우측 슬롯

| Property       | Value                            |
| -------------- | -------------------------------- |
| `rightContent` | optional `ReactNode`, `shrink-0` |

### 선택 칩 — TDS `Chip` `variant="selected"` (+ `onRemove`)

| Property        | Resolved                              | TDS Token                                           |
| --------------- | ------------------------------------- | --------------------------------------------------- |
| Font size       | **11px**                              | `--chip-font-size`                                  |
| Line height     | **16px**                              | `--chip-line-height`                                |
| Font weight     | **500**                               | `font-medium`                                       |
| Background      | **#ffffff**                           | `--chip-bg`                                         |
| Selected border | **1px inset #2563eb**                 | `--chip-border-selected` → `--color-action-primary` |
| Close icon      | Tabler `IconX` **12px**, **stroke 2** | —                                                   |

### Interactive States (동적)

| State         | 조건                                     | 스타일 요약                                     |
| ------------- | ---------------------------------------- | ----------------------------------------------- |
| Error 배너    | `error && selectedItems.length === 0`    | 빨간 톤 배경 + 경고 아이콘 + 본문 스타일 텍스트 |
| Empty 안내    | `!hasSelection && !error`                | `text-body-md` + muted                          |
| Removable off | `removable={false}` 또는 `onRemove` 없음 | Chip에서 닫기 버튼 미표시                       |

### TDS 전용 / shared 미대응 Props (기본값 비교용)

| Prop            | TDS default                     |
| --------------- | ------------------------------- |
| `selectedItems` | `[]`                            |
| `emptyText`     | `'No item selected'`            |
| `removable`     | `true`                          |
| `error`         | `false`                         |
| `onRemove`      | `(id: string) => void` 시그니처 |

---

## 2. thaki-shared SelectedBar — 현재 상태

### 컨테이너 (`tw.container`)

| Property      | 클래스 / 토큰             | 비고                                                              |
| ------------- | ------------------------- | ----------------------------------------------------------------- |
| Layout        | `flex items-center gap-1` | 좌측 라벨↔태그 영역 간격 **4px**                                  |
| Padding       | `py-2 pl-2 pr-4`          | **8px** Y, **8px** L, **16px** R (비대칭)                         |
| Min height    | `min-h-6` (**24px**)      | TDS 42px 고정과 다름                                              |
| Max width     | `w-full`                  | —                                                                 |
| Background    | `bg-surface-muted`        | `--semantic-color-surfaceMuted` → light **#f1f5f9** (blueGray100) |
| Border radius | `rounded-md`              | shared preset에서 **6px** (`--primitive-radius-md` 계열)          |

### 라벨 (`Typography.Text`)

| Property | 값                                                                                      |
| -------- | --------------------------------------------------------------------------------------- |
| Default  | `label="Selected"`                                                                      |
| Variant  | `caption` → `text-body-xs` + `text-text-muted` (**10px/14px** 수준, 프로젝트 토큰 따름) |
| Color    | `secondary` → `text-text-muted` (**#475569** 계열, token-map과 동일 시맨틱)             |

### 태그 리스트

| Property  | 값                                                   |
| --------- | ---------------------------------------------------- |
| Layout    | `flex flex-wrap gap-1` — 칩 간 **4px**               |
| Component | `Tag` **기본 `variant="filter"`** (multiSelect 아님) |

### 상태 / API

| 항목           | shared                                            |
| -------------- | ------------------------------------------------- |
| Empty copy     | 라벨만 표시; TDS처럼 “No item selected” 문구 없음 |
| Error          | **미구현**                                        |
| `rightContent` | **없음**                                          |
| `onRemove`     | `(item) => void` — **객체/문자열** 단위           |

---

## 3. 아이콘 비교 (제거 버튼)

| 항목   | TDS (`Chip`)       | thaki-shared (`Tag`)                       |
| ------ | ------------------ | ------------------------------------------ |
| 기반   | Tabler `IconX`     | `CloseSmallIcon` = `wrapTablerIcon(IconX)` |
| Size   | 12                 | 12                                         |
| Stroke | 2                  | Tabler 기본(일반적으로 2)                  |
| 결론   | 동일 계열 X 아이콘 | 동일 계열 — **형태 일치**                  |

---

## 4. Token Mapping (참조)

| TDS Token                  | TDS Resolved | thaki-shared Token               | shared Resolved (light) | Match                                                     |
| -------------------------- | ------------ | -------------------------------- | ----------------------- | --------------------------------------------------------- |
| `--color-surface-subtle`   | `#f8fafc`    | `--semantic-color-surfaceSubtle` | `#f8fafc`               | SelectedBar는 **surfaceMuted 사용** → ❌ DIFF vs TDS 배경 |
| `--color-surface-muted`    | `#f1f5f9`    | `--semantic-color-surfaceMuted`  | `#f1f5f9`               | exact (이름 정렬) — SelectedBar는 이쪽에 가깝음           |
| `--inline-message-padding` | 12px         | `--primitive-space-3`            | 12px                    | exact                                                     |
| `--inline-message-gap`     | 8px          | `--primitive-space-2`            | 8px                     | exact                                                     |
| `--inline-message-radius`  | 6px          | `--primitive-radius-md`          | 6px                     | exact                                                     |
| `--color-text-muted`       | `#475569`    | `--semantic-color-textMuted`     | `#475569`               | exact (token-map)                                         |

> SelectedBar 배경은 TDS SelectionIndicator 기본 배경(`surface-subtle`)과 **다른 토큰**(surfaceMuted)을 쓰고 있어, 같은 “연한 회색 바”라도 **한 단계 진한 그레이**로 보일 수 있음.

---

## 5. Props 기본값 체크리스트 (A)

| 관점           | TDS                              | thaki-shared                | 리스크                                       |
| -------------- | -------------------------------- | --------------------------- | -------------------------------------------- |
| 빈 상태 카피   | `emptyText = 'No item selected'` | 라벨 `"Selected"` + 칩 없음 | **api-required** — 문구·레이아웃 모델이 다름 |
| 제거 콜백 인자 | `id: string`                     | `SelectedBarItem \| string` | 마이그레이션 시 매핑 필요                    |
| 에러 검증 UI   | `error` / `errorMessage`         | 없음                        | 기능 공백                                    |

---

## 6. 주요 디자인 차이 요약

| #   | 항목                      | TDS SelectionIndicator                                 | thaki-shared SelectedBar                       | 변경 유형                | 영향 범위              | 마이그레이션                                                   |
| --- | ------------------------- | ------------------------------------------------------ | ---------------------------------------------- | ------------------------ | ---------------------- | -------------------------------------------------------------- |
| 1   | 바 배경                   | `--color-surface-subtle` (#f8fafc)                     | `bg-surface-muted` (#f1f5f9)                   | `style`                  | 전체 톤                | TDS 맞춤: `surfaceSubtle` 유틸/토큰으로 통일 검토              |
| 2   | 바 높이                   | 고정 **42px**, 세로 패딩 0                             | `min-h-6` (**24px**) + `py-2` (**8px**×2)      | `style`                  | 높이·수직 리듬         | 최소 높이·패딩을 TDS에 맞춤                                    |
| 3   | 가로 패딩                 | 대칭 **12px**                                          | **8px** L / **16px** R + 내부 `gap-1` (4px)    | `style`                  | 여백                   | `px-3` 등으로 12px 대칭 검토                                   |
| 4   | 행 gap (라벨↔칩 vs 좌↔우) | 메인 `gap-4` (16px), 칩 열 **8px**                     | 라벨↔태그 **4px**, 칩 간 **4px**               | `style`                  | 밀도                   | 칩 간 `gap-2`(8px), 필요 시 라벨 영역 분리                     |
| 5   | 빈 상태                   | `emptyText` 한 줄 (body-md muted)                      | `"Selected"` 라벨 항상 + 칩 0개                | `api-required`           | 카피·정보 밀도         | TDS 동작: 빈 카피 prop + 라벨 optional                         |
| 6   | 에러 상태                 | 배경·아이콘·메시지 (`InlineMessage` 토큰)              | 없음                                           | `api-required`           | 필수 선택 검증 UX      | `error`/`errorMessage` 포팅 또는 상위에서 `InlineMessage` 병행 |
| 7   | 우측 액션                 | `rightContent`                                         | 없음                                           | `api-required`           | 확장 슬롯              | 슬롯 prop 추가 또는 레이아웃 래핑                              |
| 8   | 칩 스타일                 | `Chip` **`variant="selected"`** (primary inset border) | `Tag` **기본 `filter`** (일반 border)          | `style` + `api-required` | 선택 칩 가시성         | `variant="multiSelect"` 또는 Chip 포팅 검토                    |
| 9   | 칩 타이포                 | 11px/16px medium                                       | Tag: 11px/16px medium (`tagTextWrapperStyles`) | `style`                  | 미세                   | 선택 variant 맞추면 정렬                                       |
| 10  | 라벨 타이포               | (TDS는 라벨 전용 없음 — empty만 본문)                  | caption **10px**대 + muted                     | `style`                  | 라벨 vs 본문 위계      | TDS에 맞추려면 `text-body-md` 등으로 조정 검토                 |
| 11  | 토큰 레이어               | `surface-subtle` vs shared `surfaceMuted` 값 차이      | 위 표 참고                                     | `token-global`           | 전역 정렬 시 함께 검토 | token-map의 surface 계열 실값 유지 전제                        |

---

## 7. 필수 체크리스트 요약

- **B (TDS 전용 variant)**: SelectionIndicator 단일 패턴; 칩은 **selected** Chip이 시각적 핵심 — shared는 **filter** Tag로 기본값이 달라 **시각적 중요도 높음**.
- **C/C-1**: 배경은 shared가 **surfaceMuted**를 직접 사용 — TDS **surface-subtle**과 hex 불일치.
- **D**: shared 레포 내 사용처는 별도 `grep`로 후속 확인.
- **E**: 위 “주요 디자인 차이” 표에 **변경 유형** 포함 완료.
