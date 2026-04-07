# Layout Design Spec (VStack / HStack / Container)

> Extracted from TDS `src/design-system/layouts/Stack.tsx`, `src/design-system/layouts/Container.tsx`  
> thaki-shared target: `src/components/Layout/Layout.tsx` + `Layout.styles.ts` (Stack/HStack/VStack, Container만 비교)  
> component-map: **partial** — shared `Layout.Block` / `Grid` / `Divider`는 TDS 단일 대응 없음 (본 스펙 범위 외)

## 구조 차이

| 항목        | TDS                                                  | thaki-shared                                               |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| API         | `VStack`, `HStack`, `Stack`, `Container` 개별 export | `Layout.VStack` 등 네임스페이스 + default export 객체      |
| Stack 구현  | 단일 `Stack.tsx` (숫자 `gap`, `row`/`column`)        | `Stack` + `HStack`/`VStack` 래퍼 (`horizontal`/`vertical`) |
| 스타일      | Tailwind 유틸 + 임의 px (`gap-[Npx]`)                | CVA + `--component-layout-*` 토큰                          |
| 루트 클래스 | `flex` + 방향/정렬/gap                               | `flex min-w-0` + 동일 계열 유틸                            |
| DOM         | `data-figma-name` (HStack/VStack)                    | `data-layout`, `data-direction` (Stack)                    |

## TDS — Stack / HStack / VStack

### Base Styles

| Property                 | Value                   | 비고 / 토큰 대응                           |
| ------------------------ | ----------------------- | ------------------------------------------ |
| display                  | flex                    | —                                          |
| direction                | `row` / `column`        | HStack→row, VStack→column                  |
| flex-wrap                | `wrap` 시만 `flex-wrap` | 기본 nowrap                                |
| min-width                | 없음 (명시 없음)        | flex 자식 오버플로우 시 shared와 차이 가능 |
| border / radius / shadow | 없음                    | 순수 레이아웃                              |
| transition / focus       | 없음                    | —                                          |

### Gap (숫자 스케일 → px, `src/index.css` `--spacing-*` 와 동일 값)

| gap prop | Resolved | TDS spacing token |
| -------- | -------- | ----------------- |
| 0        | 0        | --spacing-0       |
| 0.5      | 2px      | --spacing-0-5     |
| 1        | 4px      | --spacing-1       |
| 1.5      | 6px      | --spacing-1-5     |
| 2        | 8px      | --spacing-2       |
| 3        | 12px     | --spacing-3       |
| 4        | 16px     | --spacing-4       |
| 5        | 20px     | --spacing-5       |
| 6        | 24px     | --spacing-6       |
| 8        | 32px     | --spacing-8       |
| 10       | 40px     | --spacing-10      |
| 12       | 48px     | --spacing-12      |
| 16       | 64px     | --spacing-16      |
| 20       | 80px     | --spacing-20      |
| 24       | 96px     | --spacing-24      |

### Align / Justify

| align    | class          | justify | class           |
| -------- | -------------- | ------- | --------------- |
| start    | items-start    | start   | justify-start   |
| center   | items-center   | center  | justify-center  |
| end      | items-end      | end     | justify-end     |
| stretch  | items-stretch  | between | justify-between |
| baseline | items-baseline | around  | justify-around  |
|          |                | evenly  | justify-evenly  |

### 기본값 (Props)

| Prop              | 기본값       |
| ----------------- | ------------ |
| direction (Stack) | `column`     |
| gap               | **6** → 24px |
| align             | **stretch**  |
| justify           | **start**    |
| wrap              | **false**    |

## TDS — Container

### Base Styles

| Property          | Value                                   | 비고                                            |
| ----------------- | --------------------------------------- | ----------------------------------------------- |
| width             | `w-full`                                | —                                               |
| max-width         | `size`에 따라 Tailwind breakpoint       | `max-w-screen-*`                                |
| horizontal margin | `centered` true → `mx-auto`             | 기본 가운데 정렬                                |
| padding           | `padding` true → `px-4 sm:px-6 lg:px-8` | **좌우만**, 반응형 (16px → 24px sm↑ → 32px lg↑) |

### Size → max-width (Tailwind 기본 스케일)

| size | Resolved (typical) |
| ---- | ------------------ |
| sm   | 640px              |
| md   | 768px              |
| lg   | 1024px (기본값)    |
| xl   | 1280px             |
| full | max-w-full         |

### 기본값 (Props)

| Prop     | 기본값   |
| -------- | -------- |
| size     | **lg**   |
| centered | **true** |
| padding  | **true** |

## thaki-shared — Stack / HStack / VStack (해당 부분만)

### Base

| Property   | 값                                                |
| ---------- | ------------------------------------------------- |
| 루트       | `flex min-w-0`                                    |
| gap 토큰   | `--component-layout-gap-xs` ~ `lg` (아래 resolve) |
| align 옵션 | start, center, end, stretch (**baseline 없음**)   |
| justify    | TDS와 동일 6종                                    |

### Gap variant → resolved (16px root 기준, `tokens-light.css`)

| variant | CSS     | Resolved |
| ------- | ------- | -------- |
| xs      | 0.25rem | **4px**  |
| sm      | 0.5rem  | **8px**  |
| md      | 1rem    | **16px** |
| lg      | 1.5rem  | **24px** |

### CVA 기본값

| Variant         | 기본값                                                          |
| --------------- | --------------------------------------------------------------- |
| direction       | vertical                                                        |
| wrap            | false                                                           |
| gap             | **없음** → gap 클래스 미적용 → 브라우저 기본 **0**              |
| align / justify | defaultVariants 없음 → flex 기본 (align stretch, justify start) |

## thaki-shared — Container (해당 부분만)

### maxWidth variant

| Key | class          | Resolved              |
| --- | -------------- | --------------------- |
| sm  | max-w-[640px]  | 640px                 |
| md  | max-w-[768px]  | 768px                 |
| lg  | max-w-[1024px] | 1024px                |
| xl  | **w-full**     | 상한 없음 (부모 너비) |

### padding variant (`--component-layout-padding-*`)

| Key | Resolved (16px root) |
| --- | -------------------- |
| sm  | 8px (0.5rem)         |
| md  | 16px (1rem)          |
| lg  | 24px (1.5rem)        |

적용: **사방 균등 `p-*`** (TDS는 좌우 `px`만 + 브레이크포인트별).

### CVA 기본값

`maxWidth` / `padding` **defaultVariants 없음** → 기본은 **`w-full`만** (max-width·패딩 없음).

## Interactive States (동적)

없음 (레이아웃 프리미티브).

## 아이콘 비교

해당 없음 — 두 구현 모두 아이콘 미사용.

## Token Mapping (레이아웃 gap / padding — 참조)

> shared는 `--component-layout-*` 사용. 값은 글로벌 `--primitive-space-*` / `--spacing-*` 와 같은 계열이면 싱크 시 정렬 가능.

| 의미                  | TDS (Stack gap 숫자) | TDS Resolved | shared token              | shared Resolved | Match        |
| --------------------- | -------------------- | ------------ | ------------------------- | --------------- | ------------ |
| 최소 단계             | 1                    | 4px          | --component-layout-gap-xs | 4px             | exact        |
| 작은 간격             | 2                    | 8px          | --component-layout-gap-sm | 8px             | exact        |
| 중간                  | 4                    | 16px         | --component-layout-gap-md | 16px            | exact        |
| 큰 간격               | 6 (TDS 기본)         | 24px         | --component-layout-gap-lg | 24px            | exact        |
| Container 패딩 (대략) | px-4 기준 16px       | 16px         | padding md                | 16px            | exact (값)   |
| Container 패딩 lg     | lg:px-8 → 32px       | 32px         | shared padding lg         | 24px            | ❌ DIFF (값) |

TDS Container 상단/하단 패딩은 **기본 없음**; shared `p-*`는 **상하 포함** — 동작/레이아웃 의미도 다름.

## 주요 디자인 차이

| 차이                                       | 유형           | 설명                                                                    | 영향 범위                                                        | 마이그레이션 / 비고                                                                                                                |
| ------------------------------------------ | -------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Stack **기본 gap**                         | `api-required` | TDS 기본 24px(`gap=6`) vs shared `gap` 미지정 시 **0**                  | props 생략 시 세로/가로 간격 전부 달라짐                         | 기존 TDS와 동일 간격: shared에서 `gap="lg"`(24px) 또는 토큰 정렬 후 기본 variant를 lg로                                            |
| Container **기본 max-width / 패딩 / 정렬** | `api-required` | TDS 기본 lg(1024px)+가운데+반응형 좌우 패딩 vs shared 기본 **w-full만** | `Layout.Container` 단독 사용 시 레이아웃이 넓게 퍼지고 여백 없음 | TDS와 맞추려면 `maxWidth="lg"` `padding="md"` 등 명시; **가운데 정렬**은 shared에 `mx-auto` 부재 → className 또는 스타일 확장 필요 |
| Container **xl**                           | `api-required` | TDS xl = 1280px 상한 vs shared xl = **w-full**                          | `size="xl"` / `maxWidth="xl"` 매핑 시 너비 불일치                | 매핑 테이블에서 xl 의미 통일 또는 별도 토큰                                                                                        |
| Container **패딩 축**                      | `style`        | TDS 좌우만·반응형 vs shared 사방 균등·고정 토큰                         | 세로 리듬, 모바일 퍼스트 여백                                    | Apply 시 의도에 맞게 `px` 전용 유틸 또는 토큰 분리 검토                                                                            |
| Stack **min-w-0**                          | `style`        | shared만 `min-w-0`                                                      | flex 자식 truncation/overflow                                    | TDS에 동일 추가 시 과축소 방지 위해 회귀 테스트                                                                                    |
| **align baseline**                         | `api-required` | TDS Stack만 `baseline`                                                  | 텍스트 베이스라인 정렬 사용 시 shared 불가                       | baseline 필요 시 className 또는 shared Stack 확장                                                                                  |
| TDS **추가 gap 스텝**                      | —              | 0.5, 1.5, 3, 5, 7~24 등 세분화                                          | shared는 xs/sm/md/lg 4단                                         | 토큰 싱크만으로는 API 스케일 차이 잔존; 필요 시 숫자 gap 옵션 추가                                                                 |

## 필수 체크리스트 (Extract)

- **A. Props 기본값**: Stack `gap`, Container `size`/`centered`/`padding` vs shared `gap`/Container variants — **상이** (위 표).
- **B. TDS 전용**: 숫자 gap 스케일, `baseline`, Container `centered`/`padding` boolean — shared에 직접 대응 없음 또는 의미 다름.
- **C. 색상**: 본 비교 범위(VStack/HStack/Container)에 **배경/테두리 토큰 없음** (shared Block/Grid는 제외).
- **D. deprecated**: 해당 없음.
