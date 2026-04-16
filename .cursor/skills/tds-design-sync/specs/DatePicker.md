# DatePicker Design Spec

> Extracted from TDS `src/design-system/components/DatePicker/DatePicker.tsx`
> thaki-shared target: `src/components/DatePicker/` (at `/Users/jungyun_doh/Desktop/thaki-shared/`)
> 매핑: `component-map.md` — TDS DatePicker ↔ shared DatePicker (1:1 경로)

## Base Styles (캘린더 루트)

| Property          | TDS Value           | TDS Token / Class                      | thaki-shared Value                                   | Match                  |
| ----------------- | ------------------- | -------------------------------------- | ---------------------------------------------------- | ---------------------- |
| background        | #ffffff             | `--color-surface-default`              | `bg-surface` → `--semantic-color-surface`            | exact                  |
| border            | 1px solid #e2e8f0   | `--color-border-default`               | `border border-border`                               | exact                  |
| border-radius     | 8px                 | `--datepicker-radius` → `--radius-lg`  | `rounded-base8` → `--semantic-radius-base8` (0.5rem) | exact                  |
| padding           | 12px                | `--datepicker-padding` → `--spacing-3` | `p-3`                                                | exact                  |
| gap (header↔grid) | 12px                | `--datepicker-gap` → `--spacing-3`     | `gap-3` (root flex-col)                              | exact                  |
| width             | 284px (inline 계산) | `7×32 + 6×6 + 2×12`                    | `w-fit` (내용 기준)                                  | — (레이아웃 방식 상이) |

## Header (월 네비게이션)

| Property            | TDS                                                                | thaki-shared                                      | Match                |
| ------------------- | ------------------------------------------------------------------ | ------------------------------------------------- | -------------------- | ----- |
| 행 정렬             | `flex items-center gap-2`                                          | `flex items-center justify-start gap-2 h-6`       | 유사                 |
| 이전/다음 버튼 크기 | 24×24px (`w-6 h-6`)                                                | 24×24px (`w-6 h-6`)                               | exact                |
| Nav 버튼 radius     | 6px (`--radius-button` → `--radius-md`)                            | 4px (`rounded-base4` → `--semantic-radius-base4`) | ❌ DIFF              |
| Nav hover bg        | #f1f5f9 (`--datepicker-hover-bg` → `--color-slate-100`)            | #f1f5f9 (`--semantic-color-surfaceHover`)         | exact                |
| Nav transition      | 150ms color                                                        | `--duration-fast`                                 | 150ms `duration-150` | exact |
| 월/년 타이포        | `text-heading-h5` (16px / 24px, semibold), `w-[64px]`, `text-left` | `text-16 font-semibold leading-24`, `text-center` | ❌ DIFF (정렬·폭)    |
| 월/년 색            | `--color-text-default`                                             | `text-text`                                       | exact (이름만 상이)  |

## Weekday 행

| Property              | TDS                                            | thaki-shared                     | Match |
| --------------------- | ---------------------------------------------- | -------------------------------- | ----- |
| 타이포                | `text-label-sm` (11px / 16px, medium)          | `text-11 font-medium leading-16` | exact |
| 색                    | `--color-text-muted`                           | `text-text-muted`                | exact |
| 헤더↔날짜 그리드 간격 | 6px (`--datepicker-row-gap` → `--spacing-1-5`) | `mb-1.5` (6px) on weekday row    | exact |

## 날짜 셀 (버튼)

| Property               | TDS                                                  | thaki-shared                                                    | Match                     |
| ---------------------- | ---------------------------------------------------- | --------------------------------------------------------------- | ------------------------- |
| 셀 크기                | 32×32px (`--datepicker-cell-size`)                   | `w-8 h-8`                                                       | exact                     |
| padding                | `p-2` (8px)                                          | `p-2`                                                           | exact                     |
| border-radius          | `rounded-full`                                       | 동일                                                            | exact                     |
| 숫자 타이포            | `text-label-md` (12px / 18px, medium)                | `text-12 font-medium leading-16` (12px / 16px)                  | ❌ DIFF (line-height)     |
| 기본 텍스트            | `--color-text-default`                               | `text-text`                                                     | exact                     |
| 이전/다음 달 (outside) | `--color-text-muted`                                 | `text-text-muted`                                               | exact                     |
| hover (활성일)         | `--datepicker-hover-bg`                              | `hover:enabled:bg-surface-hover`                                | exact                     |
| 선택 배경/글자         | `--color-action-primary` / `--color-text-on-primary` | `bg-primary` / `text-on-primary` + hover primary-hover          | exact                     |
| disabled               | `opacity-50`, `cursor-not-allowed`                   | `opacity-40`, `text-text-light`, `disabled:pointer-events-none` | ❌ DIFF                   |
| focus-visible          | `ring-2` `--color-border-focus` (#3b82f6)            | `outline-2 outline-primary outline-offset-2`                    | ❌ DIFF (ring vs outline) |

## Range 선택

| 구분             | TDS                                                      | thaki-shared                                                         | Match                |
| ---------------- | -------------------------------------------------------- | -------------------------------------------------------------------- | -------------------- |
| 중간/스트립 배경 | `#dbeafe` (`--datepicker-range-bg` → `--color-blue-100`) | `#eff6ff` (`before:bg-info-weak-bg` → `--semantic-color-infoWeakBg`) | ❌ DIFF              |
| 시작/끝 시각화   | 절대 배치 `div` + 동일 range bg                          | `before` 그라데이션 (50% 투명 ↔ infoWeakBg)                          | 구현 상이, 색도 상이 |

## Today

| 구분      | TDS                                                          | thaki-shared                         | Match   |
| --------- | ------------------------------------------------------------ | ------------------------------------ | ------- |
| 비선택 시 | `ring-1 ring-[var(--color-action-primary)]` (셀 테두리 강조) | `after:` 하단 중앙 **dot** (primary) | ❌ DIFF |

## Event indicator (일정 점)

| 구분            | TDS                                                                  | thaki-shared            |
| --------------- | -------------------------------------------------------------------- | ----------------------- |
| `eventDates` 점 | 선택 시: on-primary 색 점 / 비선택: primary 색 점, `bottom-1`, 4×4px | **미구현** (props 없음) |

## Disabled (전체)

| 구분               | TDS                                   | thaki-shared                 |
| ------------------ | ------------------------------------- | ---------------------------- |
| `disabled` on root | 루트 `opacity-50 pointer-events-none` | 해당 없음 (날짜/버튼 단위만) |

## Interactive States (동적)

| State        | 조건              | TDS                              | thaki-shared                         |
| ------------ | ----------------- | -------------------------------- | ------------------------------------ |
| 선택됨       | single/range      | primary 배경 + on-primary 텍스트 | 동일 토큰 역할                       |
| range middle | 시작·끝 모두 선택 | 파란 배경 스트립 (#dbeafe)       | 연한 배경 (#eff6ff) + 구현 방식 상이 |
| today        | 당일·미선택       | primary 링                       | 하단 점                              |
| event        | `hasEvent`        | 하단 점                          | 없음                                 |

## 아이콘 비교 (월 이동)

| 항목       | TDS                                               | thaki-shared                                         |
| ---------- | ------------------------------------------------- | ---------------------------------------------------- |
| 라이브러리 | `@tabler/icons-react` `IconChevronLeft` / `Right` | `ChevronLeftIcon` / `ChevronRightIcon` (Tabler 래핑) |
| size       | `12`                                              | `size="sm"` → **16px** (`ICON_SIZES.sm`)             |
| stroke     | `1`                                               | default weight **regular** → **1.5**                 |
| viewBox    | Tabler 24 기본                                    | 동일 출처                                            |

## Props 기본값 비교

| Prop               | TDS 기본값                        | thaki-shared 기본값           | 영향                                   |
| ------------------ | --------------------------------- | ----------------------------- | -------------------------------------- |
| `mode`             | `'single'`                        | `'range'`                     | 기본 UI·동작이 다름 → **api-required** |
| `firstDayOfWeek`   | `0` (일요일 시작), `1` 지원       | 없음 (항상 일요일 시작)       | **api-required**                       |
| `numberOfMonths`   | deprecated 경고만                 | `1` (다중 월 지원)            | **api-required**                       |
| `isLoading`        | deprecated 경고만                 | `false`                       | Apply UX                               |
| `preventFutureSet` | 없음                              | `true`                        | shared만 maxDate와 결합                |
| Apply/Cancel       | deprecated (`onApply`/`onCancel`) | 선택적 — 있으면 **푸터 버튼** | **api-required** (레이아웃)            |

## Token Mapping (참조)

| TDS Token                | TDS Resolved                  | thaki-shared Token              | shared Resolved | Match   |
| ------------------------ | ----------------------------- | ------------------------------- | --------------- | ------- |
| `--datepicker-range-bg`  | #dbeafe (`--color-blue-100`)  | `--semantic-color-infoWeakBg`   | #eff6ff         | ❌ DIFF |
| `--datepicker-hover-bg`  | #f1f5f9 (`--color-slate-100`) | `--semantic-color-surfaceHover` | #f1f5f9         | exact   |
| `--color-action-primary` | #2563eb                       | `--semantic-color-primary`      | #2563eb         | exact   |
| `--color-border-focus`   | #3b82f6                       | `--semantic-color-focus`        | #3b82f6         | exact   |
| `--radius-button` (nav)  | 6px                           | `--semantic-radius-base4`       | 4px             | ❌ DIFF |

> `token-map.md`의 "exact"는 이름 매핑일 수 있음. DatePicker range 배경은 TDS가 **blue-100**, shared가 **infoWeakBg(blue-50)** 로 실제 hex가 다름.

## 주요 디자인 차이 (요약)

| #   | 항목                     | thaki-shared (현재)    | TDS 기준                   | 유형         |
| --- | ------------------------ | ---------------------- | -------------------------- | ------------ |
| 1   | Range 하이라이트 색      | #eff6ff (infoWeakBg)   | #dbeafe (blue-100)         | style        |
| 2   | 오늘 표시                | 하단 primary dot       | primary 링(원형 셀 테두리) | style        |
| 3   | 월 네비 아이콘           | 16px, stroke 1.5       | 12px, stroke 1             | style        |
| 4   | 네비 버튼 모서리         | 4px                    | 6px                        | style        |
| 5   | 포커스 링                | outline 2px + offset   | ring-2 focus 색            | style        |
| 6   | 비활성 날짜              | opacity 40%            | opacity 50%                | style        |
| 7   | 날짜 숫자 줄간격         | 16px (leading-16)      | 18px (label-md)            | style        |
| 8   | 월/년 라벨               | 가운데 정렬            | 64px 고정 폭, 왼쪽 정렬    | style        |
| 9   | 이벤트 점 (`eventDates`) | 없음                   | 있음                       | api-required |
| 10  | `mode` 기본값            | range                  | single                     | api-required |
| 11  | 요일 시작                | 일요일만               | 일/월 선택 가능            | api-required |
| 12  | Apply/Cancel 바          | 선택 시 하단 버튼 영역 | 없음(즉시 반영 API)        | api-required |

## 참고 파일

- TDS: `src/design-system/components/DatePicker/DatePicker.tsx`, `src/index.css` (Component - DatePicker)
- 토큰: `src/index.css`, `src/styles/tokens/compatibility.css`
