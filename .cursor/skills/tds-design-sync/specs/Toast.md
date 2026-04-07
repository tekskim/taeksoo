# Toast Design Spec

> Extracted from TDS `src/design-system/components/Toast/Toast.tsx` (includes `ToastContainer`, `ToastProvider`, `useToast`)
> thaki-shared target: `src/components/Toast/`
> component-map: **1:1** (Toast ↔ Toast), 싱크 상태: 대기

## 매핑 / API 요약

| 항목            | TDS                                               | thaki-shared                                      |
| --------------- | ------------------------------------------------- | ------------------------------------------------- |
| 진입 방식       | `ToastProvider` + `useToast()` + `ToastContainer` | `sonner` `toast.custom` + `<Toast handleDismiss>` |
| 상태 구분       | `variant`: success \| warning \| error \| info    | `type`: positive \| negative (기본 `negative`)    |
| 본문            | `message` + 선택 `title`                          | `message` 단일 (`title` 없음)                     |
| 상세            | `detail: { code?, content }` + "View detail" 토글 | `description?: string` + "View/Hide Detail"       |
| 리소스/프로젝트 | `project` → 배지 (`surface-subtle`)               | `resourceName` → 배지 (`state-info-bg`)           |
| 링크/액션       | `link`, `action` 별도 UI                          | `onNavigate` (카드 클릭만)                        |
| 자동 닫힘       | 내장 `duration` (기본 5000ms), hover 시 일시정지  | 컴포넌트 외부(sonner) 설정                        |
| 닫기            | `dismissible` (기본 `true`)                       | 항상 닫기 버튼                                    |
| 타임스탬프      | `Date`, Provider에서 기본 `new Date()` 주입 가능  | `number` (ms), 선택                               |
| 앱 아이콘       | 없음                                              | `appIcon?: ReactElement`                          |

## Base Styles (카드 래퍼)

| Property       | TDS Value            | TDS Token / 클래스                                          | thaki-shared Value  | shared Token / 클래스                                | Match          |
| -------------- | -------------------- | ----------------------------------------------------------- | ------------------- | ---------------------------------------------------- | -------------- |
| width          | 콘텐츠에 맞춤        | `w-fit`                                                     | 고정 264px          | `w-[264px]`                                          | **diff**       |
| padding        | 12px 전방향          | `--primitive-spacing-3`                                     | 12px                | `p-3`                                                | exact          |
| 내부 세로 간격 | 8px (메인 컬럼)      | `gap-[var(--primitive-spacing-2)]`                          | 8px (행 간)         | `gap-2`                                              | exact          |
| border-radius  | 8px                  | `--primitive-radius-lg`                                     | 8px                 | `rounded-base8` → `--semantic-radius-base8` (0.5rem) | exact          |
| background     | #ffffff              | `--color-surface-default` → `--color-white`                 | #ffffff             | `bg-surface`                                         | exact          |
| border         | 1px #e2e8f0          | `border-[var(--color-border-default)]`                      | 1px semantic border | `border border-border`                               | likely exact\* |
| shadow         | Tailwind `shadow-lg` | —                                                           | `shadow-lg`         | —                                                    | exact          |
| hover (카드)   | 테두리 2px primary   | `hover:border-[var(--color-action-primary)] hover:border-2` | 없음 (클릭 시만)    | `clickable` 시 `hover:bg-surface-muted`              | **diff**       |
| transition     | 200ms all            | `transition-all duration-200 ease-out`                      | 색만 150ms          | `transition-colors duration-fast`                    | **diff**       |
| font           | Mona stack           | `text-body-md` 등 유틸                                      | `font-sans`         | semantic font                                        | likely         |

\*`--color-border-default` / shared `--semantic-color-border` 는 token-map 상 동일 역할 (blueGray200 계열).

## Variants (시각적 구분)

TDS는 `ToastVariant`별 **아이콘 맵(`variantIcons`)이 정의되어 있으나 JSX에서 사용되지 않음** — 현재 렌더링에서는 카드 배경/테두리가 variant와 무관하게 동일하다.

| Variant (TDS) | 카드 스타일 차이 | 비고                                       |
| ------------- | ---------------- | ------------------------------------------ |
| success       | 없음 (코드만)    | Tabler `IconCircleCheck` + state 색 정의됨 |
| warning       | 없음             | `IconAlertTriangle`                        |
| error         | 없음             | `IconCircleX`                              |
| info          | 없음             | `IconInfoCircle`                           |

thaki-shared는 **항상** 상태 아이콘을 표시:

| type (shared) | 아이콘 (Tabler 래핑)                 | 색 prop / 토큰                             | 시각적 의미    |
| ------------- | ------------------------------------ | ------------------------------------------ | -------------- |
| positive      | `ToastSuccessIcon` (IconCircleCheck) | `var(--primitive-color-green400)` #4ade80  | 성공           |
| negative      | `ToastErrorIcon` (IconAlertTriangle) | `var(--primitive-color-orange600)` #ea580c | 경고형(삼각형) |

→ TDS 의도(error=빨간 X + danger 토큰)와 shared negative(주황 삼각형)는 **아이콘·색 모두 불일치**.

## Sizes

단일 크기 컴포넌트 (TDS/shared 모두 별도 `size` prop 없음). 너비만 TDS `w-fit` vs shared `264px` 고정.

## Typography (본문·부가 텍스트)

| 역할             | TDS 클래스      | Resolved (TDS) | thaki-shared 클래스   | Resolved (shared) | Match    |
| ---------------- | --------------- | -------------- | --------------------- | ----------------- | -------- |
| 제목 (optional)  | `text-label-md` | 12px/18px 500  | —                     | —                 | TDS only |
| 메시지           | `text-body-md`  | 12px/18px 400  | `text-12 leading-16`  | 12px/16px 400     | **LH**   |
| 프로젝트 배지    | `text-body-sm`  | 11px/16px      | `text-11 leading-16`  | 11px/16px         | exact    |
| 타임스탬프       | `text-body-sm`  | 11px, subtle   | `text-11`, subtle     | 11px              | exact    |
| 링크 버튼        | `text-label-md` | 12px/18px 500  | —                     | —                 | TDS only |
| View detail 토글 | `text-label-md` | 12px/18px 500  | `text-12 font-medium` | 12px/16px 500     | **LH**   |
| 상세 본문        | `text-body-md`  | 12px/18px      | `text-12 leading-16`  | 12px/16px         | **LH**   |

## Interactive States (동적)

| State               | TDS 조건 / 동작      | 적용 스타일 요약                                 |
| ------------------- | -------------------- | ------------------------------------------------ |
| exiting             | `isExiting === true` | `opacity-0 translate-x-2`, 200ms 후 `onDismiss`  |
| auto-dismiss 타이머 | `duration > 0`       | hover 시 clear, leave 시 재시작                  |
| detail expanded     | `isDetailExpanded`   | ChevronUp `rotate-180` when collapsed; 패널 표시 |
| close / action      | —                    | `focus-visible:ring-2` `--color-border-focus`    |
| 카드 hover          | 항상                 | primary 테두리 2px (레이아웃 시프트 유발 가능)   |

| State (shared) | 조건              | 스타일 요약                             |
| -------------- | ----------------- | --------------------------------------- |
| expanded       | `isExpanded`      | ChevronDown `rotate-180`                |
| clickable      | `onNavigate` 존재 | `cursor-pointer`, hover `surface-muted` |
| 카드 클릭      | `onNavigate`      | 전체 래퍼 `onClick` (이벤트 전파)       |

## 보조 UI (닫기 / 액션 / 링크)

| 요소         | TDS                                                             | thaki-shared                                                          |
| ------------ | --------------------------------------------------------------- | --------------------------------------------------------------------- |
| 닫기         | `IconX` 16px, stroke 1.5, subtle→default/hover, `surface-hover` | `CloseSmallIcon` 16px, Tabler+Icon 래퍼 (weight regular → stroke 1.5) |
| 닫기 focus   | `ring-2` focus color                                            | `outline-2 outline-border-focus offset-2`                             |
| 외부 링크 행 | 별도 행, primary 텍스트 + `IconExternalLink` 12px               | 없음 (`onNavigate`로 대체)                                            |
| 액션 버튼    | subtle 배경 작은 버튼 + optional icon                           | 없음                                                                  |

## 상세(detail) 패널

| 항목      | TDS                              | thaki-shared                           |
| --------- | -------------------------------- | -------------------------------------- |
| 배경      | `--color-surface-subtle` #f8fafc | `bg-primitive-slate-50` (#f8fafc 동일) |
| radius    | `--primitive-radius-md` (6px)    | `rounded-base6` (6px)                  |
| padding   | px 16px, py 12px                 | `p-2` (8px 전방향)                     |
| 코드 라인 | `code: {code}` 가능              | 없음                                   |

## ToastContainer (위치)

| 항목    | TDS                                                 | thaki-shared       |
| ------- | --------------------------------------------------- | ------------------ |
| z-index | `--z-toast` → 1500 (`src/index.css`)                | sonner 스택에 의존 |
| 위치    | 6방위 `positionStyles` + primitive-spacing-4 오프셋 | —                  |
| 스택    | `flex-col`, bottom 시 `flex-col-reverse`            | —                  |
| max     | `maxToasts` (기본 5)                                | —                  |

## 아이콘 비교

| 아이콘       | TDS 구현                   | size | stroke | thaki-shared 구현                | size | 비고                              |
| ------------ | -------------------------- | ---- | ------ | -------------------------------- | ---- | --------------------------------- |
| 성공 (의도)  | `IconCircleCheck` (미렌더) | 20\* | 1.5    | `ToastSuccessIcon` (Tabler)      | 15   | 색: green400 vs TDS state-success |
| 실패 (의도)  | `IconCircleX` (미렌더)     | 20   | 1.5    | `ToastErrorIcon` = AlertTriangle | 15   | orange600 vs TDS danger           |
| 닫기         | `IconX`                    | 16   | 1.5    | `CloseSmallIcon` (= IconX)       | 16   | 동일 소스                         |
| 외부 링크    | `IconExternalLink`         | 12   | 1.5    | —                                | —    | TDS only                          |
| 상세 Chevron | `IconChevronUp`            | 16   | 1.5    | `ChevronDownIcon`                | 12   | 방향/크기 다름                    |

\*정의만 있고 현재 트리에 없음.

## Token Mapping (참조)

| TDS Token                 | TDS Resolved | thaki-shared 관련 Token                     | shared Resolved   | Match / 비고              |
| ------------------------- | ------------ | ------------------------------------------- | ----------------- | ------------------------- |
| `--primitive-spacing-2`   | 8px          | spacing `2`                                 | 8px               | exact                     |
| `--primitive-spacing-3`   | 12px         | `p-3`                                       | 12px              | exact                     |
| `--primitive-spacing-4`   | 16px         | —                                           | —                 | TDS container offset      |
| `--primitive-radius-lg`   | 8px          | `--semantic-radius-base8`                   | 8px               | exact                     |
| `--primitive-radius-md`   | 6px          | `--semantic-radius-base6`                   | 6px               | exact                     |
| `--primitive-radius-sm`   | 4px          | `rounded-sm`                                | 4px               | exact                     |
| `--color-surface-default` | #ffffff      | `--semantic-color-surface`                  | #ffffff           | exact                     |
| `--color-surface-subtle`  | #f8fafc      | slate50 / surfaceSubtle                     | #f8fafc           | exact                     |
| `--color-border-default`  | #e2e8f0      | `--semantic-color-border`                   | #e2e8f0           | exact (역할 동일)         |
| `--color-action-primary`  | #2563eb      | `--semantic-color-primary`                  | #2563eb           | exact                     |
| `--color-text-muted`      | #475569      | `--semantic-color-textMuted`                | #475569\*         | exact\*                   |
| `--color-text-subtle`     | #64748b      | `--semantic-color-textSubtle`               | #64748b\*         | exact\*                   |
| `--color-state-success`   | #22c55e      | (아이콘은 primitive green400)               | #4ade80 / #22c55e | **diff** (아이콘 경로)    |
| `--color-state-danger`    | #ef4444      | negative 아이콘 orange600                   | #ea580c           | **diff**                  |
| `--color-state-warning`   | #f97316      | —                                           | —                 | shared에 토스트 전용 부재 |
| `--color-state-info`      | #2563eb      | —                                           | —                 | shared 타입 없음          |
| `--duration-fast`         | 150ms        | `--primitive-duration-150`                  | 150ms             | exact                     |
| `--color-border-focus`    | #3b82f6      | `--semantic-color-borderFocus` / focus ring | #3b82f6           | exact                     |

\*token-map 주의: JSON primitive 경로가 다르면 실제 빌드값 재확인 필요.

## 애니메이션

| 항목 | TDS                                                                                                                                       |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 진입 | 클래스 `animate-toast-in` 사용 **하나** `tailwind.config.cjs` / `index.css`에 해당 `@keyframes` 미정의 → **유효 애니메이션 없을 수 있음** |
| 퇴장 | `opacity-0 translate-x-2` + 200ms 타이머                                                                                                  |

## Props 기본값 비교 (체크리스트 A)

| Prop / 동작    | TDS 기본값                   | thaki-shared 기본값 |
| -------------- | ---------------------------- | ------------------- |
| variant / type | (호출 시 필수 variant)       | `type = 'negative'` |
| duration       | 5000ms                       | (컴포넌트 무관)     |
| dismissible    | `true`                       | (항상 닫기)         |
| timestamp      | Provider가 `new Date()` 주입 | `undefined`         |

## 주요 디자인 차이 (요약)

| #   | 항목               | Before (thaki-shared)                                  | After (TDS 기준)                                                          | 변경 유형                   | 영향 / 마이그레이션                                                       |
| --- | ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| 1   | 너비               | 고정 264px                                             | `w-fit` (콘텐츠 기준)                                                     | `style`                     | 좁은 메시지는 카드 축소, 긴 메시지는 확장                                 |
| 2   | 상태 아이콘        | positive/negative + 항상 표시, 색 green400 / orange600 | 코드상 variant 아이콘 **미사용**; 디자인 의도는 4 variant + state 토큰 색 | `style` + **TDS 버그 후보** | 싱크 시 TDS에서 아이콘을 렌더할지, shared를 TDS 토큰으로 맞출지 결정 필요 |
| 3   | negative 의미      | 삼각형 + 주황 (경고 느낌)                              | error 시 빨간 X + danger (정의상)                                         | `style`                     | 에러 톤 통일 시 아이콘·색 교체                                            |
| 4   | 프로젝트 배지 배경 | `bg-state-info-bg` (#eff6ff)                           | `bg-surface-subtle` (#f8fafc)                                             | `style`                     | 배지 토큰을 surface-subtle 계열로                                         |
| 5   | 카드 hover         | `onNavigate` 시 배경만                                 | 항상 primary 2px 테두리                                                   | `style`                     | hover 시 레이아웃 점프(1px→2px) TDS 동작 주의                             |
| 6   | 상세 패딩          | 8px                                                    | 12px 세로 / 16px 가로                                                     | `style`                     | detail 컨테이너 패딩 정렬                                                 |
| 7   | 줄 간격(메시지 등) | leading-16 (16px)                                      | body-md 18px line-height                                                  | `style`                     | 타이포 유틸 TDS에 맞춤                                                    |
| 8   | View detail 라벨   | "View Detail" / "Hide Detail"                          | "View detail" 고정                                                        | `style`                     | 문구·케이스 정책                                                          |
| 9   | 접근성 역할        | positive도 `role="alert"`                              | positive `status`, negative `alert`                                       | `api-required`              | 스크린리더 공지 강도 차이; TDS 맞출 경우 `role`/`aria-live` 조정 필요     |
| 10  | 자동 닫힘·Provider | 내장 타이머·Context                                    | sonner 위임                                                               | `api-required`              | 앱이 sonner duration을 TDS 기본(5s)과 맞출지 정책 결정                    |

## 주요 디자인 차이 (변경 유형 표 — 스킬 E)

| 유형           | 설명                             | 본 스펙 해당 항목                                    |
| -------------- | -------------------------------- | ---------------------------------------------------- |
| `style`        | 스타일만 변경 (디자인 싱크 범위) | #1, #2(렌더 가정), #3~#8, #2(TDS 아이콘 노출 시)     |
| `api-required` | API/접근성 동작 변경             | #9 `role`/`aria-live`, #10 타이머·Provider 패턴      |
| `token-global` | 글로벌 토큰 정렬로 해결          | text 기본색(#0f172a vs #171717) 등 — Toast 전용 아님 |
