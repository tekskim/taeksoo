# DS 문서 ↔ Storybook 싱크 감사 계획

> **생성일**: 2026-03-11  
> **목적**: `/design` DS 문서 페이지와 Storybook 스토리 간의 불일치를 파악하고 해결 방안을 제시

---

## 1. 현황 요약

| 구분                           | 개수     |
| ------------------------------ | -------- |
| DS 문서 페이지 (컴포넌트/패턴) | ~80개    |
| Storybook 스토리 파일          | ~61개    |
| **양쪽 모두 존재 (정상 매칭)** | **43개** |
| Storybook만 있고 DS 문서 없음  | 9개      |
| DS 문서만 있고 Storybook 없음  | 7개      |

---

## 2. Storybook에만 존재 — DS 문서 페이지 없음 (9개)

### 2-1. Accordion

| 항목              | 내용                                                                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **스토리 파일**   | `src/design-system/components/Accordion/Accordion.stories.tsx`                                                                                             |
| **스토리 수**     | 11개 (Default, DefaultExpanded, AllowMultiple, Bordered, Separated, IconLeft, HideIcon, Controlled, DisabledItems, FAQ, Settings)                          |
| **컴포넌트 구조** | Compound — `Accordion.Root`, `.Item`, `.Trigger`, `.Panel`                                                                                                 |
| **현황**          | 사이드바 메뉴에도 없음. DS 문서 페이지 자체가 존재하지 않음                                                                                                |
| **권장**          | ⭐ **DS 문서 페이지 신규 생성** — Feedback 또는 Data Display 카테고리에 추가. Disclosure와 유사하지만 다중 패널을 지원하는 별도 컴포넌트이므로 문서화 필요 |
| **우선순위**      | 🟡 Medium                                                                                                                                                  |

### 2-2. Dropdown

| 항목              | 내용                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **스토리 파일**   | `src/design-system/components/Dropdown/Dropdown.stories.tsx`                                                                                          |
| **스토리 수**     | 12개 (Default, Controlled, Sizes, Widths, Groups, Dividers, Error, LongList, ThakiUIStyle 등)                                                         |
| **컴포넌트 구조** | Compound — `Dropdown.Root`, `.Select`, `.Option`, `.Group`, `.Divider`                                                                                |
| **현황**          | Select 페이지(`/design/components/select`)가 존재함. Dropdown과 Select의 관계가 불분명                                                                |
| **권장**          | 🔍 **관계 정리 필요** — (A) Dropdown이 Select의 내부 구현이면 Select 문서에서 언급만, (B) 별도 컴포넌트면 DS 문서 신규 생성, (C) 중복이면 하나로 통합 |
| **우선순위**      | 🟡 Medium                                                                                                                                             |

### 2-3. Tag

| 항목              | 내용                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **스토리 파일**   | `src/design-system/components/Tag/Tag.stories.tsx`                                                                             |
| **스토리 수**     | 14개 (Variants, OutlineVariants, Sizes, Rounded, WithIcon, Closable, Clickable, Disabled, TagGroup, Skills, Status, Filter 등) |
| **컴포넌트 구조** | `Tag`, `TagGroup`                                                                                                              |
| **현황**          | Badge, Chip 페이지는 있으나 Tag는 없음. Badge/Chip/Tag 3개의 차이점이 문서화되지 않음                                          |
| **권장**          | ⭐ **DS 문서 페이지 신규 생성** — Badge/Chip과의 차이점을 Usage에서 명확히 구분. 또는 Chip 페이지에 통합                       |
| **우선순위**      | 🟡 Medium                                                                                                                      |

### 2-4. RangeSlider

| 항목            | 내용                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| **스토리 파일** | `src/design-system/components/Slider/RangeSlider.stories.tsx`                                          |
| **스토리 수**   | 10개 (Default, CustomRange, SmallStep, Disabled, Controlled, PasswordLength, PriceRange, PortRange 등) |
| **현황**        | Slider 문서 페이지(`/design/components/slider`)는 존재하지만 RangeSlider는 미포함                      |
| **권장**        | 📝 **Slider 페이지에 RangeSlider 섹션 추가** — 별도 페이지는 불필요. 기존 Slider 페이지를 확장         |
| **우선순위**    | 🟢 Low                                                                                                 |

### 2-5. SNBMenuItem

| 항목            | 내용                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------- |
| **스토리 파일** | `src/design-system/components/SNBMenuItem/SNBMenuItem.stories.tsx`                                  |
| **스토리 수**   | 9개 (Default, Hover, Selected, TextType, AllStates, NavigationMenu, Interactive 등)                 |
| **현황**        | Side Navigation Bar 메뉴 아이템. Menu 페이지(`/design/components/menu`)가 있으나 SNBMenuItem은 별도 |
| **권장**        | 📝 **Menu 페이지에 SNBMenuItem 섹션 추가** 또는 Navigation 카테고리에 별도 페이지 생성              |
| **우선순위**    | 🟢 Low                                                                                              |

### 2-6. PageHeader

| 항목            | 내용                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------- |
| **스토리 파일** | `src/design-system/components/PageHeader/PageHeader.stories.tsx`                            |
| **스토리 수**   | 3개 (Default, WithDropdownAction, TitleOnly)                                                |
| **현황**        | 패턴 페이지(List Page, Detail Page)에서 사용되지만 컴포넌트 전용 문서 없음                  |
| **권장**        | ⭐ **DS 문서 페이지 신규 생성** — Layout 또는 Patterns 카테고리. props/variants 문서화 필요 |
| **우선순위**    | 🔴 High — 거의 모든 페이지에서 사용되는 핵심 컴포넌트                                       |

### 2-7. PageShell

| 항목            | 내용                                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------------------- |
| **스토리 파일** | `src/design-system/components/PageShell/PageShell.stories.tsx`                                              |
| **스토리 수**   | 3개 (Default, CollapsedSidebar, WithoutTabBar)                                                              |
| **현황**        | Shell 패턴 페이지(`/design/patterns/shell`)가 존재                                                          |
| **권장**        | ✅ **현행 유지** — Shell 패턴 페이지가 PageShell 문서를 겸함. 필요 시 패턴 페이지에서 Storybook 링크만 추가 |
| **우선순위**    | ⚪ None                                                                                                     |

### 2-8. EmptyState

| 항목            | 내용                                                               |
| --------------- | ------------------------------------------------------------------ |
| **스토리 파일** | `src/design-system/components/EmptyState/EmptyState.stories.tsx`   |
| **스토리 수**   | 5개 (Default, NoSearchResults, Inline, WithoutIcon, WithoutAction) |
| **현황**        | Empty States 패턴 페이지(`/design/patterns/empty-states`)가 존재   |
| **권장**        | ✅ **현행 유지** — 패턴 페이지가 EmptyState/ErrorState 문서를 겸함 |
| **우선순위**    | ⚪ None                                                            |

### 2-9. ErrorState

| 항목            | 내용                                                             |
| --------------- | ---------------------------------------------------------------- |
| **스토리 파일** | `src/design-system/components/ErrorState/ErrorState.stories.tsx` |
| **스토리 수**   | 4개 (Default, NetworkError, ServerError, Minimal)                |
| **현황**        | Empty States 패턴 페이지에 포함                                  |
| **권장**        | ✅ **현행 유지** — 위 EmptyState와 동일                          |
| **우선순위**    | ⚪ None                                                          |

---

## 3. DS 문서만 존재 — Storybook 스토리 없음 (7개)

### 3-1. Scrollbar

| 항목          | 내용                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **문서 경로** | `/design/components/scrollbar`                                                                                                                                   |
| **문서 상태** | Full page — 6개 CSS 클래스, 라이브 예제, 토큰, 가이드라인                                                                                                        |
| **권장**      | ⭐ **Storybook 스토리 생성** — 6개 scrollbar 클래스별 예제 (sidebar-scroll, drawer-scroll, settings-scroll, legend-scroll, shell-scroll, table-scroll-container) |
| **우선순위**  | 🟢 Low — CSS 유틸리티 클래스여서 시각적 스토리 가치가 상대적으로 낮음                                                                                            |

### 3-2. Snackbar

| 항목          | 내용                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **문서 경로** | `/design/components/snackbar`                                                                                                                     |
| **문서 상태** | Full page — 가이드라인만 있고 라이브 예제 없음                                                                                                    |
| **권장**      | ⭐ **Storybook 스토리 생성** — Toast 스토리와 유사하게 Snackbar 컴포넌트가 구현되어 있다면 스토리 추가. 미구현 상태라면 문서에 "(구현 예정)" 표시 |
| **우선순위**  | 🟡 Medium — 문서에 라이브 예제가 없어 Storybook이 유일한 인터랙티브 참조가 됨                                                                     |

### 3-3. Spinner

| 항목          | 내용                                                                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **문서 경로** | `/design/components/spinner`                                                                                                                                         |
| **문서 상태** | Full page — Loading variant="spinner" 예제 포함                                                                                                                      |
| **현황**      | Loading.stories.tsx가 존재하며 Spinner가 Loading의 variant일 수 있음                                                                                                 |
| **권장**      | 🔍 **관계 확인 필요** — Loading 스토리에 spinner variant가 포함되어 있는지 확인. (A) 포함되어 있으면 현행 유지, (B) 미포함이면 Loading 스토리에 spinner variant 추가 |
| **우선순위**  | 🟢 Low                                                                                                                                                               |

### 3-4. Card

| 항목          | 내용                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| **문서 경로** | `/design/components/card`                                                                                           |
| **문서 상태** | Full page — 가이드라인만, 라이브 예제 없음 (AI Component)                                                           |
| **현황**      | CardTitle.stories.tsx만 존재. Card 자체의 스토리 없음                                                               |
| **권장**      | ⭐ **Storybook 스토리 생성** — Card 컴포넌트의 6가지 상태 (Default, Hover, Selected, Disabled, Loading, Empty) 예제 |
| **우선순위**  | 🟡 Medium                                                                                                           |

### 3-5. ExpandableChecklist

| 항목          | 내용                                                                                   |
| ------------- | -------------------------------------------------------------------------------------- |
| **문서 경로** | `/design/components/expandable-checklist`                                              |
| **문서 상태** | Full page — 가이드라인만, 라이브 예제 없음 (AI Component)                              |
| **권장**      | ⭐ **Storybook 스토리 생성** — Default/Expandable variant, 선택 제한, 비활성 상태 예제 |
| **우선순위**  | 🟡 Medium                                                                              |

### 3-6. GlobalNotificationPanel

| 항목          | 내용                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------- |
| **문서 경로** | `/design/components/global-notification-panel`                                                     |
| **문서 상태** | Full page — 가이드라인만, 라이브 예제 없음                                                         |
| **권장**      | 📝 **Storybook 스토리 생성 (선택적)** — 데스크톱 레벨 컴포넌트라 Storybook에서 재현 어려울 수 있음 |
| **우선순위**  | 🟢 Low                                                                                             |

### 3-7. TextInput

| 항목          | 내용                                                                                |
| ------------- | ----------------------------------------------------------------------------------- |
| **문서 경로** | `/design/components/text-input`                                                     |
| **문서 상태** | Full page — States, Variants, Sizes, Width, Icons, FormField, Suffix 등 풍부한 예제 |
| **현황**      | Input.stories.tsx가 존재하며 TextInput은 Input의 세부 variant                       |
| **권장**      | ✅ **현행 유지** — Input 스토리가 TextInput 케이스를 대부분 커버                    |
| **우선순위**  | ⚪ None                                                                             |

---

## 4. 추가 점검 사항

### 4-1. Badge vs Chip vs Tag 관계 정리

| 컴포넌트 | DS 문서 | Storybook | 비고                      |
| -------- | ------- | --------- | ------------------------- |
| Badge    | ✅      | ✅        | 상태/카운트 표시          |
| Chip     | ✅      | ✅        | 필터/태그 (제거 가능)     |
| Tag      | ❌      | ✅        | 14개 스토리, Chip과 중복? |

**권장**: Badge/Chip/Tag 세 컴포넌트의 사용 구분 가이드 문서화 필요. Tag가 Chip과 별개 컴포넌트라면 문서 신규 생성, 동일하다면 스토리 통합.

### 4-2. Dropdown vs Select 관계 정리

| 컴포넌트 | DS 문서 | Storybook | 비고                       |
| -------- | ------- | --------- | -------------------------- |
| Select   | ✅      | ✅        | FormField 내 사용          |
| Dropdown | ❌      | ✅        | 12개 스토리, compound 구조 |

**권장**: (A) Select의 v2/advanced 버전이면 Select 문서에 Dropdown 섹션 추가, (B) 별개 컴포넌트면 문서 신규 생성.

---

## 5. 작업 우선순위 정리

### 🔴 High (핵심 컴포넌트, 즉시 필요)

| #   | 작업                               | 유형      |
| --- | ---------------------------------- | --------- |
| 1   | **PageHeader** DS 문서 페이지 생성 | 신규 문서 |

### 🟡 Medium (문서 완성도 향상)

| #   | 작업                                          | 유형        |
| --- | --------------------------------------------- | ----------- |
| 2   | **Accordion** DS 문서 페이지 생성             | 신규 문서   |
| 3   | **Tag** DS 문서 페이지 생성 또는 Chip에 통합  | 신규/통합   |
| 4   | **Dropdown** vs Select 관계 정리 및 문서화    | 정리/신규   |
| 5   | **Snackbar** Storybook 스토리 생성            | 신규 스토리 |
| 6   | **Card** Storybook 스토리 생성                | 신규 스토리 |
| 7   | **ExpandableChecklist** Storybook 스토리 생성 | 신규 스토리 |

### 🟢 Low (보완적)

| #   | 작업                                                       | 유형        |
| --- | ---------------------------------------------------------- | ----------- |
| 8   | **RangeSlider** → Slider 문서에 섹션 추가                  | 문서 확장   |
| 9   | **SNBMenuItem** → Menu 문서에 섹션 추가 또는 별도 생성     | 문서 확장   |
| 10  | **Spinner** — Loading 스토리에 spinner variant 포함 확인   | 확인        |
| 11  | **Scrollbar** Storybook 스토리 생성                        | 신규 스토리 |
| 12  | **GlobalNotificationPanel** Storybook 스토리 생성 (선택적) | 신규 스토리 |

### ⚪ 조치 불필요

| 컴포넌트   | 사유                                      |
| ---------- | ----------------------------------------- |
| PageShell  | Shell 패턴 페이지가 문서 역할 수행        |
| EmptyState | Empty States 패턴 페이지가 문서 역할 수행 |
| ErrorState | Empty States 패턴 페이지가 문서 역할 수행 |
| TextInput  | Input 스토리가 커버                       |

---

## 6. 실행 순서 제안

```
Phase 1: 핵심 문서 (High)
 └─ PageHeader 문서 페이지 생성

Phase 2: 관계 정리 (Medium)
 ├─ Dropdown vs Select 관계 확인 → 문서화 방향 결정
 └─ Tag vs Chip 관계 확인 → 문서화 방향 결정

Phase 3: 문서 신규 생성 (Medium)
 ├─ Accordion 문서 페이지
 ├─ Tag 또는 Chip 확장
 └─ Dropdown 문서 또는 Select 확장

Phase 4: 스토리 보완 (Medium/Low)
 ├─ Snackbar 스토리
 ├─ Card 스토리
 ├─ ExpandableChecklist 스토리
 └─ 기타 Low 항목

Phase 5: 기존 문서 확장 (Low)
 ├─ Slider 페이지에 RangeSlider 섹션
 ├─ Menu 페이지에 SNBMenuItem 섹션
 └─ Spinner/Loading 관계 확인
```
