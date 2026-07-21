# TabBar Design Spec

> Extracted from TDS `src/design-system/components/TabBar/TabBar.tsx`  
> thaki-shared target: `src/components/TabBar/` (TabBar.tsx + TabItem.tsx + `*.styles.ts`)  
> component-map: **1:1** (TabBar ↔ TabBar)

## 구성 요약

| 영역                      | TDS                                                        | thaki-shared                                       |
| ------------------------- | ---------------------------------------------------------- | -------------------------------------------------- |
| 탭 스트립 + 윈도우 컨트롤 | 단일 `TabBar` (WindowControl `split` + min/max/close 버튼) | `TabBar` + `TabItem` only — **윈도우 컨트롤 없음** |
| 상태 훅                   | `useTabBar` 동일 파일 export                               | 없음 (앱에서 직접 state)                           |
| 탭 레이아웃               | 고정 min/max 너비 + flex shrink, `useTabLayout` 없음       | `useTabLayout` / `useTabScroll`로 동적 너비        |

---

## Base Styles (바 컨테이너)

| Property      | TDS (resolved)                    | TDS Token / class                         | thaki-shared                                             |
| ------------- | --------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| Height        | **36px**                          | `--tabbar-height: 36px`                   | `h-9` → **36px** (동일)                                  |
| Width         | `w-full`                          | —                                         | `flex-1 min-w-0 w-full max-w-full`                       |
| Background    | `#ffffff`                         | `--color-surface-default`                 | `bg-surface` → semantic surface (white, token-map exact) |
| Bottom border | **1px** `#e2e8f0` (옵션, 기본 on) | `::after` `h-px` `--color-border-default` | **없음** (`mb-0`만)                                      |
| Layout        | `flex items-center`               | —                                         | `flex items-center`                                      |

---

## Tab item — 크기 · 간격 · 타이포

| Property               | TDS (resolved)               | TDS Token / source                          | thaki-shared                                            |
| ---------------------- | ---------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| Tab row item height    | **36px** (부모 `h-full`)     | bar `--tabbar-height`                       | `h-9` → **36px**                                        |
| Min width              | **100px**                    | `--tabbar-tab-min-width`                    | **80px** (`min-w-[80px]` + layout 상수 `MIN_TAB_WIDTH`) |
| Max width              | **160px**                    | `--tabbar-tab-max-width`                    | **160px** (`w-[160px]` 기본, layout이 픽셀 덮어씀)      |
| Padding X (비대칭)     | **left 12px**, **right 8px** | `--spacing-3` / `--spacing-2`               | **대칭 12px** (`px-3`)                                  |
| Gap (아이콘·라벨·닫기) | **8px**                      | `--tabbar-tab-gap` → `--spacing-2`          | `gap-2` → **8px**                                       |
| Font size              | **12px**                     | `--tabbar-font-size` → `--font-size-12`     | `--primitive-font-size12` → **12px**                    |
| Line height            | **16px**                     | `--tabbar-line-height` → `--line-height-16` | `--primitive-font-lineHeight16` → **16px**              |
| Font weight            | **500**                      | `font-medium` on label                      | **500** (`--primitive-font-weightMedium`)               |

---

## Tab item — 배경 · 테두리 · 호버 (정적 상태)

### 배경 (비활성 vs 활성) — **주요 시각 차이**

| State          | TDS                                                   | thaki-shared                         |
| -------------- | ----------------------------------------------------- | ------------------------------------ |
| 비활성 default | `#ffffff` (`--color-surface-default`) — **바와 동색** | `#f8fafc` (`bg-surface-subtle`)      |
| 비활성 hover   | `#f1f5f9` (`--color-surface-muted`)                   | `#f1f5f9` (`hover:bg-surface-muted`) |
| 활성           | `#ffffff` (`--color-surface-default`)                 | `#ffffff` (`bg-surface`)             |

→ TDS는 비활성 탭이 **서브틀 배경 없이** 바와 한 덩어리로 보임. shared는 비활성이 **surface-subtle**로 구분됨.

### 구분선

| 요소           | TDS                                              | thaki-shared                                               |
| -------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| 탭 사이 세로선 | `border-r` **1px** `--border-subtle` (`#f1f5f9`) | `border-r` **1px** `border-border-subtle` (동일 토큰 매핑) |
| 활성 variant   | 동일 `border-r` 유지                             | active variant에서도 `border-r` 유지                       |

---

## Active indicator

| Property | TDS                                       | thaki-shared                                                             |
| -------- | ----------------------------------------- | ------------------------------------------------------------------------ |
| Height   | **2px**                                   | **2px**                                                                  |
| Color    | `#2563eb` `--color-action-primary`        | `bg-primary` → `--semantic-color-primary` (token-map: **#2563eb exact**) |
| Position | `absolute bottom-0 left-0 right-0` `z-20` | 동일 패턴 `z-20`                                                         |

---

## Close button

| Property                      | TDS                                                                                                    | thaki-shared                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 버튼 박스                     | **16×16px** `--tabbar-close-size`                                                                      | **16×16px** `w-4 h-4`                                                             |
| Radius                        | **4px** `--radius-sm`                                                                                  | `rounded-[var(--primitive-radius-base)]` → **4px** (이름만 다름)                  |
| 아이콘                        | `IconX` **size 12**, **stroke 1**                                                                      | `CloseSmallIcon` **size xs → 12px**, default Icon **weight regular → stroke 1.5** |
| 비활성 + 닫기모드 아님        | `opacity-0` → `group-hover:opacity-100`                                                                | `hidden` → `group-hover:inline-flex` (동등 패턴)                                  |
| 활성 **또는** `isClosingMode` | 항상 표시, hover bg `--surface-muted`                                                                  | `active: inline-flex`, hover `bg-surface-muted`                                   |
| Hover (비활성 탭)             | icon: default text; hover `surface-muted` on **active/closing** branch vs `border-default` on inactive | `hover:bg-border` (≈ `--color-border-default`)                                    |

**아이콘 스트로크 차이**: TDS **1** vs shared Icon 기본 **1.5** → 시각적으로 살짝 두꺼울 수 있음.

---

## Add button

| Property    | TDS                                                       | thaki-shared                                      |
| ----------- | --------------------------------------------------------- | ------------------------------------------------- |
| 크기        | **28×28px** `--tabbar-add-size`                           | `w-7 h-7` → **28px**                              |
| Margin      | **좌우 4px** `mx-[--spacing-1]`                           | **좌 4px만** `ml-1` (우측 마진 없음)              |
| Radius      | **4px** `--radius-sm`                                     | `--primitive-radius-base` → **4px**               |
| 아이콘      | `IconPlus` **14**, **stroke 1**                           | `AddIcon` **14**, stroke **1.5** (default weight) |
| Text / idle | `--color-text-muted`                                      | `text-text-muted`                                 |
| Hover bg    | `--tabbar-hover-bg` → `#f1f5f9` (`--color-surface-muted`) | `hover:bg-surface-muted`                          |
| Hover text  | `--color-text-default`                                    | `hover:text-text`                                 |

---

## Window controls (TDS only)

TDS `showWindowControls` (기본 `true`, 데스크톱 앱 모드에선 숨김)에서 **min / WindowControl(split) / max / close** — 버튼 **24×24**, 아이콘 **12** **stroke 1**, hover `surface-subtle`.  
`WindowControl`은 `src/design-system/components/WindowControl/WindowControl.tsx`의 **`type="split"`** (스냅 드롭다운)만 TabBar에서 사용.  
thaki-shared TabBar에는 해당 UI **없음** (`FrameControls` 등 별도 컴포넌트 매핑).

---

## Interactive States (동적)

| State                  | 조건          | TDS                                              | thaki-shared                    |
| ---------------------- | ------------- | ------------------------------------------------ | ------------------------------- |
| Dragging               | DnD 중        | `opacity-50`                                     | `opacity-50`                    |
| Drop target            | `dragOver`    | `border-l-2` `--color-action-primary`            | `border-l-2` `border-l-primary` |
| Closing mode           | 연속 닫기     | 탭 너비 lock, 닫기 버튼 항상 보임                | 해당 패턴 없음                  |
| Enter/leave 애니메이션 | 탭 추가/제거  | width/padding/border/opacity transition 200ms 등 | `transition: none` 명시         |
| Truncation tooltip     | 라벨 overflow | portal + tooltip 토큰 (`--tooltip-*`)            | 없음                            |
| Chrome wheel scroll    | 탭 영역 휠    | 가로 스크롤                                      | `useTabScroll`                  |

---

## CSS 구현 기법 차이

| 요소            | 시각 효과      | TDS 기법                                | thaki-shared 기법  | 영향                           |
| --------------- | -------------- | --------------------------------------- | ------------------ | ------------------------------ |
| 바 하단 구분선  | 1px full-width | **`::after` pseudo** on bar             | 없음               | shared는 바-콘텐츠 경계가 약함 |
| 비활성 탭 배경  | 영역 구분      | **전부 surface-default** (호버만 muted) | **surface-subtle** | 가장 큰 시각 차이              |
| 탭 패딩         | 좌우 여백      | **비대칭** (12 / 8)                     | **대칭** 12        | 닫기 버튼·트렁케이션 밸런스    |
| Add 버튼 margin | 좌우 여백      | **대칭 mx 4px**                         | **ml만 4px**       | 우측 정렬·스크롤 끝 미세 차이  |
| 탭 최소 너비    | 스크롤/압축    | **100px**                               | **80px**           | 좁을 때 레이아웃               |

---

## CVA Base 상속 분석 (TabItem)

싱크 시 TabItem `tabItemStyles` **base**는 단일 variant만 쓰는 경우에도 아래가 전부 적용됨.

| base 클래스                     | TDS 대응 관점                | 비고                                                     |
| ------------------------------- | ---------------------------- | -------------------------------------------------------- |
| `bg-surface-subtle`             | TDS 비활성은 surface-default | 비활성 배경 맞추려면 active가 아닐 때 base override 필요 |
| `px-3`                          | TDS는 우측 8px               | `pr-2` + `pl-3` 식 분리 필요                             |
| `min-w-[80px] w-[160px]`        | 100 / 160                    | min-width 토큰 정렬                                      |
| `gap-2`                         | `--tabbar-tab-gap`           | 일치                                                     |
| `border-r border-border-subtle` | 일치                         | —                                                        |

---

## 아이콘 비교

| 아이콘            | TDS 구현                       | size | stroke | thaki-shared 구현                  | resolved size | stroke (default)    |
| ----------------- | ------------------------------ | ---- | ------ | ---------------------------------- | ------------- | ------------------- |
| Tab close         | IconX (Tabler)                 | 12   | **1**  | CloseSmallIcon (Tabler IconX 래핑) | **12** (`xs`) | **1.5** (`regular`) |
| Add               | IconPlus (Tabler)              | 14   | **1**  | AddIcon (Tabler)                   | **14**        | **1.5** (`regular`) |
| Win min/max/close | IconMinus / IconSquare / IconX | 12   | 1      | **N/A** (TabBar에 없음)            | —             | —                   |

---

## Token Mapping (참조, TabBar 관련)

| TDS Token                                       | TDS Resolved | thaki-shared Token               | Match (이름) | Hex / 값 검증              |
| ----------------------------------------------- | ------------ | -------------------------------- | ------------ | -------------------------- |
| `--tabbar-height`                               | 36px         | (Tailwind `h-9`)                 | —            | 동일                       |
| `--tabbar-tab-min-width`                        | 100px        | CVA + 상수 80px                  | —            | ❌ DIFF                    |
| `--tabbar-tab-max-width`                        | 160px        | `w-[160px]`                      | —            | 동일                       |
| `--tabbar-tab-padding-x`                        | 12px         | `px-3` 좌                        | partial      | 우측 TDS 8px               |
| `--tabbar-tab-padding-r`                        | 8px          | (shared는 12px 우)               | —            | ❌ DIFF                    |
| `--tabbar-tab-gap`                              | 8px          | `gap-2`                          | exact        | 동일                       |
| `--tabbar-font-size`                            | 12px         | primitive font 12                | exact        | 동일                       |
| `--tabbar-line-height`                          | 16px         | line height 16                   | exact        | 동일                       |
| `--tabbar-close-size`                           | 16px         | `w-4 h-4`                        | exact        | 동일                       |
| `--tabbar-add-size`                             | 28px         | `w-7 h-7`                        | exact        | 동일                       |
| `--tabbar-add-margin`                           | 4px (양쪽)   | `ml-1`만                         | —            | ❌ DIFF (대칭 여부)        |
| `--tabbar-hover-bg`                             | `#f1f5f9`    | `surface-muted`                  | exact        | 동일                       |
| `--color-action-primary` (indicator)            | `#2563eb`    | `--semantic-color-primary`       | exact        | 동일                       |
| `--color-border-default` (inactive close hover) | `#e2e8f0`    | `border` semantic                | exact        | 동일                       |
| `--color-surface-default`                       | `#ffffff`    | `--semantic-color-surface`       | exact        | 동일                       |
| `--color-surface-subtle`                        | `#f8fafc`    | `--semantic-color-surfaceSubtle` | exact        | TDS 탭 비활성에 **미사용** |

---

## Props 기본값 비교 (체크리스트 A)

| Prop                          | TDS default | thaki-shared                   | 비고                |
| ----------------------------- | ----------- | ------------------------------ | ------------------- |
| `showAddButton`               | `true`      | Add 버튼 항상 렌더 (분기 없음) | 유사                |
| `showWindowControls`          | `true`      | 해당 props 없음                | **API / 구조 차이** |
| `showBottomBorder`            | `true`      | 하단 보더 없음                 | 시각 차이           |
| `enableWindowDragPassthrough` | —           | `false`                        | shared 전용         |

---

## 주요 디자인 차이 (변경 유형)

| 항목                                       | 유형                  | 설명                                                                                                                                                 |
| ------------------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 비활성 탭 배경 (default vs subtle)         | `style`               | TDS는 bar와 동일 흰색; shared는 subtle 회색                                                                                                          |
| 탭 좌우 패딩 비대칭                        | `style`               | TDS 12/8 vs shared 12/12                                                                                                                             |
| 탭 min-width 100 vs 80                     | `style`               | 압축 시 동작 차이                                                                                                                                    |
| Add 버튼 `mx` vs `ml`                      | `style`               | 우측 여백 유무                                                                                                                                       |
| 바 하단 1px 보더                           | `style`               | TDS만 `::after`                                                                                                                                      |
| Close / Add 아이콘 stroke                  | `style`               | 1 vs 1.5                                                                                                                                             |
| 윈도우 컨트롤 + split + 데스크톱 예약 영역 | `api-required`        | **영향**: shared TabBar만으로는 TDS TopBar/Chrome 패리티 불가. 마이그레이션: 앱에서 `FrameControls`/layout 조합으로 분리 유지 또는 TabBar 확장 검토. |
| `useTabBar` 훅                             | `api-required` (선택) | **영향**: 없으면 소비자가 동일 상태 패턴 수동 구현. 마이그레이션: 선택적 래퍼 훅 추가 또는 문서화.                                                   |

---

## TDS 전용 참고 파일

- `TabBar/index.ts` — export
- `TabBar.stories.tsx` — Storybook
- `useTabBar` — `TabBar.tsx` 하단 동일 파일
