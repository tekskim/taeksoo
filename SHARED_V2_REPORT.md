# shared-v2 프리뷰 리포트

> **프리뷰 사이트**: https://thakicloud.github.io/tds_ssot/shared-v2/
> **작성일**: 2026-03-26

---

## 결론

**shared 라이브러리 컴포넌트만으로 TDS 전체 디자인을 구현하였습니다.**

6개 앱, 244개 페이지를 shared 컴포넌트로 구현한 프리뷰입니다. 아래는 TDS와 shared 간 차이점 정리입니다.

---

## 1. 앱별 커버리지

| 앱            | 페이지 수 | 경로               |
| ------------- | --------: | ------------------ |
| Container     |       104 | `/container/*`     |
| Compute Admin |        61 | `/compute-admin/*` |
| Compute       |        47 | `/compute/*`       |
| IAM           |        23 | `/iam/*`           |
| Storage       |         5 | `/storage/*`       |
| CloudBuilder  |         3 | `/cloudbuilder/*`  |
| **합계**      |   **244** |                    |

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

### 2.2 TDS에만 있는 컴포넌트

| 컴포넌트                | 설명                                       | shared 대응                            |
| ----------------------- | ------------------------------------------ | -------------------------------------- |
| **ListToolbar**         | 검색 + 필터 + 벌크 액션 통합 툴바          | 없음 (수동 조합)                       |
| **Wizard**              | 멀티스텝 폼 (섹션 상태 관리)               | `CreateLayout` + `Stepper`로 유사 구현 |
| **Card**                | 범용 카드 컨테이너                         | 없음 (div 직접 구현)                   |
| **Menu**                | 드롭다운 메뉴 (섹션 구분 지원)             | 없음                                   |
| **MetricCard**          | 메트릭 표시 카드 (title + value + tooltip) | 없음                                   |
| **BadgeList**           | 테이블 내 배열 데이터 뱃지 오버플로 처리   | `MultiItemDisplay`로 유사 구현         |
| **NotificationCenter**  | 알림 센터                                  | 없음                                   |
| **ExpandableChecklist** | 접기/펼치기 체크리스트                     | 없음                                   |
| **FileListCard**        | 파일 목록 카드                             | 없음                                   |
| **CardTitle**           | 카드 타이틀                                | 없음                                   |
| **SelectionIndicator**  | 선택 인디케이터                            | 없음                                   |
| **NumberInput** (별도)  | TDS에서는 별도 컴포넌트                    | shared `Input`에 내장                  |
| **SearchInput**         | TDS에서는 별도 컴포넌트                    | shared `FilterSearchInput` 사용        |
| **Textarea** (별도)     | TDS에서는 Input 파생                       | shared에 별도 `Textarea` 존재          |

### 2.3 shared에만 있는 컴포넌트

| 컴포넌트                                                      | 설명                 | TDS 대응                      |
| ------------------------------------------------------------- | -------------------- | ----------------------------- |
| `Terminal`                                                    | xterm 기반 웹 터미널 | 없음 (Container 전용)         |
| `Editor` / `PromptEditor`                                     | Monaco 에디터        | 없음 (기능 컴포넌트)          |
| `CreateLayout` + `Stepper`                                    | 위자드 레이아웃      | TDS `Wizard`                  |
| `ActionModal` / `DeleteResourceModal` / `ResourceActionModal` | 특화 모달            | TDS `Modal` + `ConfirmModal`  |
| `FilterSearchInput` / `FilterSearchResults`                   | 필터 검색            | TDS `FilterSearchInput`       |
| `ChartToggle` / `ChartTooltip`                                | 차트 보조            | 없음 (페이지 레벨)            |
| `AppIcon` (앱별 아이콘)                                       | 앱 전용 아이콘       | 없음                          |
| `ErrorBoundary`                                               | 에러 바운더리        | 없음 (유틸리티)               |
| `Sidebar` / `SidebarMenu`                                     | 사이드바             | 없음 (앱 레벨)                |
| `Typography`                                                  | Title, Text, Label   | Tailwind 유틸리티 클래스 사용 |
| `TagInput`                                                    | 태그 입력            | 없음                          |
| `MultiItemDisplay`                                            | 다중 아이템 표시     | TDS `BadgeList`               |

---

## 3. API 차이 상세 (Breaking Changes)

### 🔴 구조가 완전히 다른 컴포넌트

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

### 🟢 호환 가능한 컴포넌트

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

## 4. 논의 포인트

TDS와 shared 간 API를 맞춰가기 위해 함께 논의가 필요한 항목들입니다.

| 영역             | 현재 상태                                              | 논의 사항                             |
| ---------------- | ------------------------------------------------------ | ------------------------------------- |
| **Select API**   | shared: Compound / TDS: 배열 props                     | 어떤 방식으로 통일할지                |
| **Modal/Drawer** | shared: Overlay 통합 / TDS: 별도 컴포넌트              | 어떤 구조를 기준으로 할지             |
| **Badge 네이밍** | shared: `gre/blu/ylw` / TDS: `success/info/warning`    | 네이밍 체계 통일                      |
| **Button API**   | shared: `variant` + `appearance` / TDS: `variant` 통합 | 분리 vs 통합                          |
| **FormField**    | shared: 단일 / TDS: Compound                           | API 통일 방향                         |
| **ListToolbar**  | TDS에만 존재                                           | shared에 추가할지, 각 앱에서 조합할지 |
| **Wizard**       | shared: `CreateLayout`+`Stepper` / TDS: `Wizard`       | 위자드 패턴 통일                      |
| **Pagination**   | shared: `totalCount` 기반 / TDS: `totalPages` 기반     | 계산 방식 통일                        |
| **Typography**   | shared: 컴포넌트 / TDS: Tailwind 유틸리티 클래스       | 접근 방식 결정                        |

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

---

## 참고 문서

| 문서                   | 경로                                   |
| ---------------------- | -------------------------------------- |
| 컴포넌트 API 비교 상세 | `COMPONENT_API_COMPARISON.md`          |
| 페이지 패턴 가이드     | `CODE_TO_CODE_GUIDE.md`                |
| AI 가이드              | `thaki-shared-v2/AI_GUIDE.md`          |
| 라우팅 정의            | `thaki-shared-v2/preview/src/main.tsx` |
