# shared-v2 프리뷰 리포트

> **프리뷰 사이트**: https://thakicloud.github.io/tds_ssot/shared-v2/
> **작성일**: 2026-03-26

---

## 결론

**shared 라이브러리 컴포넌트만으로 TDS 전체 디자인을 구현할 수 있습니다.**

252개 페이지 (7개 앱)를 shared 컴포넌트로 구현한 프리뷰가 그 증거입니다.
다만 일부 컴포넌트는 API가 다르고, TDS에만 존재하는 컴포넌트가 있어 보완이 필요합니다.

---

## 1. 앱별 커버리지

| 앱            | 페이지 수 | 경로               |
| ------------- | --------: | ------------------ |
| Container     |       104 | `/container/*`     |
| Compute Admin |        61 | `/compute-admin/*` |
| Compute       |        47 | `/compute/*`       |
| IAM           |        23 | `/iam/*`           |
| Design        |         8 | `/design/*`        |
| Storage       |         5 | `/storage/*`       |
| CloudBuilder  |         3 | `/cloudbuilder/*`  |
| **합계**      |   **252** |                    |

---

## 2. TDS ↔ shared 컴포넌트 매핑

### 2.1 동일 역할, 다른 이름/API

| TDS 컴포넌트           | shared 컴포넌트                             | 차이 요약                                                     |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| `Select`               | `Dropdown.Select` + `Dropdown.Option`       | TDS: `options` 배열 props / shared: Compound children 패턴    |
| `Modal`                | `Overlay.Template type="modal"`             | TDS: 별도 컴포넌트 / shared: Overlay 통합                     |
| `Drawer`               | `Overlay.Template type="drawer-horizontal"` | TDS: 별도 컴포넌트 / shared: Overlay 통합                     |
| `Radio` + `RadioGroup` | `RadioButton` + `RadioGroup`                | TDS: Context 기반 / shared: options 배열 패턴                 |
| `DetailHeader`         | `DetailPageHeader`                          | TDS: Compound (Title, Actions, InfoGrid) / shared: props 기반 |
| `PageHeader`           | `Title`                                     | TDS: title + actions / shared: title만                        |
| `PageShell`            | `AppLayout`                                 | TDS: sidebar/tabBar/topBar 통합 / shared: Content 기반        |
| `EmptyState`           | `EmptyUI`                                   | TDS: icon/title/description/action / shared: 간단한 빈 상태   |
| `ErrorState`           | `Error403` / `Error404` / `Error500`        | TDS: 범용 / shared: HTTP 에러 코드별 분리                     |
| `Loading`              | `LoadingSpinner`                            | 동일 역할, 이름만 다름                                        |
| `Slider`               | `Range`                                     | 동일 역할, 이름만 다름                                        |
| `InfoBox`              | `InfoContainer`                             | TDS: label+value / shared: 다른 구조                          |
| `SNBMenuItem`          | `SidebarMenuItem`                           | 동일 역할                                                     |
| `TopBar`               | `NavigationControls` + `FrameControls`      | TDS: 통합 / shared: 분리                                      |
| `WindowControl`        | `FrameControls`                             | 동일 역할, 이름만 다름                                        |
| `Chip`                 | `Tag`                                       | TDS: Chip 별도 / shared: Tag로 통합                           |

### 2.2 TDS에만 있는 컴포넌트 (shared 보완 필요)

| 컴포넌트                   | 설명                                             | 보완 우선순위                         |
| -------------------------- | ------------------------------------------------ | ------------------------------------- |
| **ListToolbar**            | 검색 + 필터 + 벌크 액션 통합 툴바                | 🔴 높음 — 모든 리스트 페이지에서 사용 |
| **Wizard**                 | 멀티스텝 폼 (섹션 상태 관리)                     | 🟡 중간 — Create 페이지 패턴에서 사용 |
| **Card**                   | 범용 카드 컨테이너                               | 🟡 중간 — 대시보드 페이지에서 사용    |
| **Menu**                   | 드롭다운 메뉴 (섹션 구분 지원)                   | 🟡 중간                               |
| **MetricCard**             | 메트릭 표시 카드 (title + value + tooltip)       | 🟡 중간 — 대시보드/모니터링에서 사용  |
| **BadgeList**              | 테이블 내 배열 데이터 뱃지 오버플로 처리         | 🟡 중간                               |
| **NotificationCenter**     | 알림 센터                                        | 🟢 낮음                               |
| **ExpandableChecklist**    | 접기/펼치기 체크리스트                           | 🟢 낮음                               |
| **FileListCard**           | 파일 목록 카드                                   | 🟢 낮음                               |
| **CardTitle**              | 카드 타이틀                                      | 🟢 낮음                               |
| **SelectionIndicator**     | 선택 인디케이터                                  | 🟢 낮음                               |
| **NumberInput** (TDS 독립) | TDS에서는 별도 컴포넌트, shared에서는 Input 내장 | 🟢 낮음                               |
| **SearchInput**            | TDS에서는 별도 컴포넌트                          | 🟢 낮음                               |
| **Textarea** (TDS 독립)    | TDS에서는 Input 파생, shared에서는 별도 존재     | ✅ 이미 있음                          |

### 2.3 shared에만 있는 컴포넌트

| 컴포넌트                                                      | 설명                 | TDS 반영 필요 여부                  |
| ------------------------------------------------------------- | -------------------- | ----------------------------------- |
| `Terminal`                                                    | xterm 기반 웹 터미널 | Container 전용, TDS 불필요          |
| `Editor` / `PromptEditor`                                     | Monaco 에디터        | 기능 컴포넌트, TDS 불필요           |
| `CreateLayout` + `Stepper`                                    | 위자드 레이아웃      | TDS `Wizard`로 대체                 |
| `ActionModal` / `DeleteResourceModal` / `ResourceActionModal` | 특화 모달            | TDS `Modal` + `ConfirmModal`로 대체 |
| `FilterSearchInput` / `FilterSearchResults`                   | 필터 검색            | TDS `FilterSearchInput`에 해당      |
| `ChartToggle` / `ChartTooltip`                                | 차트 보조            | 페이지 레벨, TDS 불필요             |
| `AppIcon` (앱별 아이콘)                                       | 앱 전용 아이콘       | TDS 불필요                          |
| `ErrorBoundary`                                               | 에러 바운더리        | 유틸리티, TDS 불필요                |
| `Sidebar` / `SidebarMenu`                                     | 사이드바             | 앱 레벨, 각 앱별 구현               |
| `Typography`                                                  | Title, Text, Label   | TDS는 Tailwind 유틸리티 클래스 사용 |
| `TagInput`                                                    | 태그 입력            | 검토 필요                           |
| `MultiItemDisplay`                                            | 다중 아이템 표시     | TDS `BadgeList`에 해당              |

---

## 3. API 차이 상세 (Breaking Changes)

### 🔴 구조가 완전히 다른 컴포넌트 (마이그레이션 필수)

#### Select ↔ Dropdown

```tsx
// shared (Compound 패턴)
<Dropdown.Select value={val} onChange={setVal}>
  <Dropdown.Option value="kr" label="Korea" />
</Dropdown.Select>

// TDS (배열 props)
<Select options={[{ value: 'kr', label: 'Korea' }]} value={val} onChange={setVal} />
```

#### Modal / Drawer ↔ Overlay

```tsx
// shared (통합)
<Overlay.Template type="modal" title="Delete" appeared={isOpen} onConfirm={fn} onCancel={fn} />
<Overlay.Template type="drawer-horizontal" title="Edit" appeared={isOpen} ... />

// TDS (분리)
<Modal isOpen={isOpen} title="Delete" onClose={fn}>...</Modal>
<Drawer isOpen={isOpen} title="Edit" onClose={fn} footer={...}>...</Drawer>
```

#### FormField

```tsx
// shared (단일, children props 자동 주입)
<FormField label="Name" required error={nameError}>
  <Input value={name} onChange={...} />
</FormField>

// TDS (Compound)
<FormField label="Name" required error={!!nameError}>
  <Input fullWidth />
  <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>
</FormField>
```

#### ContextMenu

```tsx
// shared (Compound)
<ContextMenu.Root>
  <ContextMenu.Item label="Edit" onClick={fn} />
  <ContextMenu.Item label="Delete" status="danger" onClick={fn} />
</ContextMenu.Root>

// TDS (배열)
<ContextMenu items={[
  { id: 'edit', label: 'Edit', onClick: fn },
  { id: 'delete', label: 'Delete', status: 'danger', onClick: fn },
]} trigger="click">
  <Button>Actions</Button>
</ContextMenu>
```

### 🟡 Props 이름/타입이 다른 컴포넌트

| 컴포넌트            | shared                                 | TDS                          | 변경 사항                   |
| ------------------- | -------------------------------------- | ---------------------------- | --------------------------- |
| **Button**          | `variant` + `appearance` 분리          | `variant`에 통합             | `primary/solid` → `primary` |
| **Badge**           | `theme="gre"` (약어)                   | `variant="success"`          | 이름 체계 전체 다름         |
| **Pagination**      | `totalCount` + `size`                  | `totalPages` + `totalItems`  | 계산 방식 다름              |
| **ProgressBar**     | `variant="success"`                    | `status="success"`           | prop 이름 변경              |
| **StatusIndicator** | `variant` (16종) + `colorScheme`       | `status` (19종)              | 확장 + 단순화               |
| **Toast**           | `sonner` + `Toast` 직접 사용           | `ToastProvider` + `useToast` | Provider 패턴 도입          |
| **Breadcrumb**      | `path`                                 | `href`                       | prop 이름 변경              |
| **Tabs**            | `activeTabId` + `<Tab id="" label="">` | `value` + `<Tab value="">`   | prop 이름 변경              |
| **Disclosure**      | 단일 (`label` + `children`)            | Compound (Trigger + Panel)   | 구조 변경                   |
| **Toggle**          | `checkedLabel` / `uncheckedLabel`      | `label` / `description`      | 라벨링 방식 변경            |
| **DatePicker**      | `onApply` / `onCancel`                 | 즉시 `onChange`              | 동작 방식 변경              |

### 🟢 호환 가능한 컴포넌트 (이름만 변경)

| shared              | TDS                 | 비고                        |
| ------------------- | ------------------- | --------------------------- |
| `Input`             | `Input`             | fullWidth, variant 추가됨   |
| `Checkbox`          | `Checkbox`          | ✅ 호환                     |
| `Toggle`            | `Toggle`            | label 방식만 다름           |
| `Table`             | `Table`             | columns API 유사            |
| `SectionCard`       | `SectionCard`       | ✅ 거의 동일                |
| `Tooltip`           | `Tooltip`           | delay, disabled 추가됨      |
| `Popover`           | `Popover`           | ✅ 호환                     |
| `InlineMessage`     | `InlineMessage`     | type→variant, closable 제거 |
| `Skeleton`          | `Skeleton`          | ✅ 호환                     |
| `Tag`               | `Tag`               | ✅ 호환                     |
| `CopyButton`        | `CopyButton`        | ✅ 호환                     |
| `Accordion`         | `Accordion`         | ✅ 호환                     |
| `MonitoringToolbar` | `MonitoringToolbar` | 기본값만 다름               |
| `FloatingCard`      | `FloatingCard`      | 접기/펼치기 API 다름        |
| `TabBar`            | `TabBar`            | title→label 등 이름 변경    |

---

## 4. shared 보완 권장 로드맵

### Phase 1: 필수 보완 (리스트/상세 페이지 구현에 필요)

| 항목                          | 설명                                                                                 | 난이도 |
| ----------------------------- | ------------------------------------------------------------------------------------ | ------ |
| **ListToolbar 추가**          | 검색 + 필터 + 벌크 액션 통합 툴바. 현재 shared에서는 수동으로 조합해야 함            | 중     |
| **ConfirmModal 추가**         | 삭제 확인 전용 모달. 현재 `DeleteResourceModal`이 있지만 TDS ConfirmModal과 API 다름 | 하     |
| **Select options 방식 지원**  | `Dropdown.Select`에 `options` 배열 shorthand 추가 (기존 children 패턴 유지)          | 하     |
| **Badge variant 네이밍 통일** | `gre/blu/ylw/gry` → `success/info/warning/danger` 별칭 추가                          | 하     |

### Phase 2: 개선 (Create/Dashboard 페이지 구현에 필요)

| 항목                   | 설명                                                 | 난이도 |
| ---------------------- | ---------------------------------------------------- | ------ |
| **Wizard 패턴 추가**   | 섹션 상태 관리 (pre/active/done/writing) 포함 위자드 | 상     |
| **MetricCard 추가**    | 대시보드용 메트릭 카드 (title + value + tooltip)     | 하     |
| **Card 범용 컨테이너** | 대시보드 카드 래퍼                                   | 하     |
| **BadgeList 추가**     | 테이블 내 배열 데이터 뱃지 오버플로 처리             | 중     |
| **EmptyState 개선**    | icon/title/description/action 패턴으로 확장          | 하     |

### Phase 3: 정리 (코드 품질 향상)

| 항목                           | 설명                                                | 난이도 |
| ------------------------------ | --------------------------------------------------- | ------ |
| **FormField Compound 지원**    | 기존 simple + compound 두 API 모두 지원             | 중     |
| **Button variant 단순화**      | `variant` + `appearance` → 단일 `variant` 옵션 추가 | 하     |
| **Input fullWidth 기본 지원**  | `fullWidth` prop 명시적 추가                        | 하     |
| **Pagination totalPages 지원** | `totalPages` prop 추가 (기존 `totalCount` 유지)     | 하     |

---

## 5. 디자인 토큰 차이

| 영역              | shared                                | TDS                                 | 비고                                      |
| ----------------- | ------------------------------------- | ----------------------------------- | ----------------------------------------- |
| **색상 변수**     | `--semantic-color-*`                  | `--color-*`                         | TDS는 호환성 별칭 사용                    |
| **Tailwind 색상** | `bg-surface`, `text-text`             | `bg-[var(--color-surface-default)]` | shared는 preset 매핑, TDS는 CSS 변수 직접 |
| **간격**          | `--primitive-space-*`                 | `--spacing-*`                       | 값은 동일, 이름만 다름                    |
| **Radius**        | `--semantic-radius-base8`             | `--radius-lg`                       | 네이밍 체계 다름                          |
| **타이포**        | `Typography.Title`, `Typography.Text` | `.text-heading-h5`, `.text-body-md` | shared: 컴포넌트 / TDS: 유틸리티 클래스   |
| **다크모드**      | `data-theme="dark"`                   | ✅ 동일                             |                                           |

---

## 6. 확인 방법

1. **프리뷰 사이트 접속**: https://thakicloud.github.io/tds_ssot/shared-v2/
2. **앱별 페이지 확인**: 사이드바에서 앱 선택 → 리스트/상세/생성 페이지 탐색
3. **소스 코드 참고**: `thaki-shared-v2/preview/src/pages/` 디렉토리
4. **컴포넌트 쇼케이스**: `/design` 경로에서 개별 컴포넌트 확인

---

## 참고 문서

| 문서                   | 경로                                   |
| ---------------------- | -------------------------------------- |
| 컴포넌트 API 비교 상세 | `COMPONENT_API_COMPARISON.md`          |
| 페이지 패턴 가이드     | `CODE_TO_CODE_GUIDE.md`                |
| AI 가이드              | `thaki-shared-v2/AI_GUIDE.md`          |
| 라우팅 정의            | `thaki-shared-v2/preview/src/main.tsx` |
