# ErrorBoundary Level Mapping

TDS SSOT(`@thaki/shared`) 컴포넌트를 ErrorBoundary의 세 레벨에 따라 분류한 참조 문서입니다.
`ErrorBoundary`를 새로 적용하거나 `fallback` UI를 결정할 때 이 문서를 기준으로 삼습니다.

---

## 레벨 판단 기준

> **레벨 = "이 컴포넌트가 렌더 실패했을 때 사용자가 잃는 기능 범위"**

| Level       | 실패 범위                       | Fallback 성격                   | 복구 행동                          |
|-------------|-------------------------------|---------------------------------|----------------------------------|
| **Page**    | 라우트 전체                     | `Error403/404/500` 전체 화면     | 페이지 리로드 / 뒤로 가기           |
| **Section** | 페이지 내 독립 콘텐츠 블록        | 에러 카드 (섹션 크기)             | "재시도" 버튼 → 해당 섹션만 재요청  |
| **Widget**  | 개별 UI 원자                    | `–` 또는 빈 자리 (`DEFAULT_FALLBACK = <>-</>`) | 무시 (자동 복구 기대 안 함)  |

세 레벨 중 어디에도 명확히 속하지 않으면 **[경계 케이스](#경계-케이스)** 항목을 확인합니다.

---

## Page Level

전체 페이지 또는 앱 셸이 정상 렌더되지 않을 때. 이 레벨이 실패하면 나머지 페이지도 없으므로 fallback은 반드시 전체 화면이어야 합니다.

### 해당 컴포넌트

| 카테고리 | 컴포넌트 | 이유 |
|---|---|---|
| APP SHELL | `AppLayout`, `AppLayoutContent`, `AppHeaderTab` | 모든 페이지 콘텐츠를 감싸는 앱 프레임 |
| NAVIGATION | `Sidebar`, `ToolBar` | 앱 전체 탐색 구조 — 없으면 모든 페이지 이동 불가 |
| LAYOUT | `CreateLayout` | 생성 워크플로우 전체를 하나의 페이지로 처리 |
| APP SHELL | `Editor` | 에디터 자체가 해당 라우트의 전체 기능 |
| APP SHELL | `Terminal` | 터미널 라우트에서 전체 기능 담당 (임베드 시 → Section) |
| DATA DISPLAY | `DetailPageHeader` | 페이지 헤더 자체가 렌더 실패 시 하위 탭/섹션 컨텍스트 상실 |
| STEPPER | `Stepper` | 멀티스텝 폼 전체가 하나의 페이지를 구성할 때 (삽입 시 → Section) |
| UTILITIES | `Error403`, `Error404`, `Error500` | Page-level ErrorBoundary의 fallback으로 사용되는 컴포넌트 자체 |

### 사용 예시

```tsx
// app entry: 앱 셸 전체를 감싸는 Page-level ErrorBoundary
<ErrorBoundary fallback={<Error500 />}>
  <AppLayout>
    <Sidebar />
    <AppLayoutContent>
      <Outlet />
    </AppLayoutContent>
  </AppLayout>
</ErrorBoundary>

// route level: 라우트 컴포넌트를 감싸는 Page-level ErrorBoundary
<ErrorBoundary fallback={<Error500 onRetry={() => window.location.reload()} />}>
  <ContainerDetailPage />
</ErrorBoundary>
```

---

## Section Level

페이지 내에서 독립적으로 의미를 갖는 콘텐츠 단위. 이 섹션이 실패해도 나머지 페이지는 동작해야 합니다.

### 해당 컴포넌트

| 카테고리 | 컴포넌트 | 이유 |
|---|---|---|
| DATA DISPLAY | `SectionCard`, `SectionCard.Header`, `SectionCard.Content`, `SectionCard.DataRow` | 페이지 내 독립 정보 그룹 단위 |
| DATA DISPLAY | `Table`, `SelectableTable`, `ExpandableTable` | 데이터 목록 블록 전체 (정렬/페이지네이션 포함) |
| DATA DISPLAY | `TcTable` | Table의 차세대 대체 컴포넌트 — 동일 기준 |
| DATA DISPLAY | `CardList` | 카드 그리드 블록 전체 |
| DATA DISPLAY | `FloatingCard` | 독립적으로 띄워진 카드 콘텐츠 |
| DATA DISPLAY | `InfoContainer` | 페이지 내 정보 표시 컨테이너 |
| NAVIGATION | `Tabs` / `Tab` | 탭 패널 단위 — 하나의 탭 콘텐츠가 실패해도 다른 탭은 동작 |
| NAVIGATION | `TabBar`, `TabContainer`, `TabSelector` | 탭 탐색 블록 전체 |
| DISCLOSURE | `Accordion`, `Accordion.Group`, `Accordion.Item` | 접힌 콘텐츠 블록 |
| DISCLOSURE | `TcAccordion` | Accordion 대체 컴포넌트 |
| DISCLOSURE | `Disclosure` | 펼치기/접기 독립 콘텐츠 |
| OVERLAY | `Overlay`, `Overlay.Template` (modal / drawer) | 모달·드로워 내 콘텐츠 — 트리거(버튼)와 독립 |
| OVERLAY | `ActionModal`, `DeleteResourceModal`, `ResourceActionModal` | 전용 모달 콘텐츠 |
| UTILITIES | `FilterSearch` (Table 필터 블록 전체) | 테이블과 결합된 필터 블록 전체 |
| UTILITIES | `TableSettingDrawer` | 테이블 설정 드로워 |
| UTILITIES | `MonitoringToolbar` + 차트 조합 | 모니터링 패널 전체 (`MonitoringToolbar` 단독은 Widget) |
| FORM | `Fieldset` | 멀티 필드 그룹 단위 |

### 사용 예시

```tsx
// 탭 패널 단위로 각각 격리
<Tabs activeTabId={activeTab} onChange={setActiveTab}>
  <Tab id="details" label="Details">
    <ErrorBoundary fallback={<SectionErrorCard title="Details" onRetry={refetch} />}>
      <SectionCard title="Basic information" fields={basicFields} />
    </ErrorBoundary>
  </Tab>
  <Tab id="performance" label="Performance">
    <ErrorBoundary fallback={<SectionErrorCard title="Performance" onRetry={refetch} />}>
      <MonitoringPanel />
    </ErrorBoundary>
  </Tab>
</Tabs>

// Table 블록 전체를 격리 — Table + FilterSearch + Pagination을 하나의 섹션으로
<ErrorBoundary fallback={<SectionErrorCard title="Instances" onRetry={refetch} />}>
  <FilterSearch ... />
  <Table columns={columns} rows={rows} />
  <Pagination ... />
</ErrorBoundary>

// 모달 콘텐츠 격리
<ActionModal
  appeared={isOpen}
  title="Delete Resource"
  onConfirm={handleDelete}
  onCancel={handleClose}
>
  <ErrorBoundary fallback={<SectionErrorCard title="Resource Info" />}>
    <ResourceDetails id={resourceId} />
  </ErrorBoundary>
</ActionModal>
```

---

## Widget Level

개별 UI 원자. 렌더 실패해도 `–` 또는 빈 자리로 대체 가능하며, 다른 요소에 영향을 주지 않습니다.

> `ErrorBoundary`의 `DEFAULT_FALLBACK = <>-</>` 가 이 레벨을 기본값으로 설계한 이유입니다.

### 해당 컴포넌트

| 카테고리 | 컴포넌트 |
|---|---|
| FEEDBACK & STATUS | `Badge`, `StatusIndicator`, `ProgressBar`, `InlineMessage`, `LoadingSpinner`, `Skeleton`, `Toast` |
| FORM CONTROLS | `Button`, `CopyButton`, `RefreshButton`, `LangButton` |
| FORM CONTROLS | `Input`, `Password`, `Textarea`, `Toggle`, `Checkbox`, `RadioButton`, `RadioGroup` |
| FORM CONTROLS | `Dropdown` (단일 Select), `DatePicker`, `Range` |
| FORM CONTROLS | `TagInput`, `Tag`, `FormField` (단일 필드 래퍼) |
| DATA DISPLAY | `MultiItemDisplay`, `EmptyUI`, `Pagination` (Table에 종속 시) |
| NAVIGATION | `Breadcrumb`, `NavigationControls`, `FrameControls` |
| OVERLAY | `Tooltip`, `Popover`, `ContextMenu`, `Dim`, `Portal` |
| ICONS & MISC | `Icon`, `AppIcon`, `ChartToggle`, `ChartTooltip` |
| LAYOUT | `Typography` (Title, Text, Label), `Title` (페이지 내 소제목) |

### 사용 예시

```tsx
// 테이블 셀 내 상태 값 — 렌더 실패 시 "–"로 대체
<td>
  <ErrorBoundary>
    <StatusIndicator variant={row.status} label={row.statusLabel} />
  </ErrorBoundary>
</td>

// 폼 내 개별 입력 필드
<FormField label="Region" hint="Select one">
  <ErrorBoundary fallback={<span className="text-text-muted text-sm">–</span>}>
    <Dropdown.Select value={region} onChange={setRegion}>
      <Dropdown.Option value="kr" label="Korea" />
    </Dropdown.Select>
  </ErrorBoundary>
</FormField>

// 툴팁은 실패해도 무시 — fallback 생략 (DEFAULT_FALLBACK 사용)
<ErrorBoundary>
  <Tooltip content={description}>
    <Icon name="info" />
  </Tooltip>
</ErrorBoundary>
```

---

## 경계 케이스

일부 컴포넌트는 **사용 문맥에 따라 레벨이 달라집니다**. 아래 조건을 기준으로 적용할 레벨을 결정합니다.

| 컴포넌트 | 기본 레벨 | 문맥에 따른 격상 조건 | 격상 레벨 |
|---|---|---|---|
| `Pagination` | Widget | Table 전체의 탐색이 Pagination에 의존하는 경우 | Section |
| `Stepper` | Page | 전체 페이지가 아닌 페이지 내 일부 폼으로 삽입되는 경우 | Section |
| `Terminal` | Page | 탭 패널 내 임베드 터미널로 사용되는 경우 | Section |
| `FilterSearch` | Section | 단순 검색 바 단독으로만 사용되는 경우 (데이터 필터 기능 없음) | Widget |
| `MonitoringToolbar` | Widget | 차트 패널 전체(차트 + 툴바)를 하나의 섹션으로 감쌀 때 | Section |
| `Sidebar` | Page | 아이콘 하나 등 Sidebar 내부 일부 요소만 실패하는 경우 | Widget |
| `DetailPageHeader` | Page | Tabs와 함께 사용 시 헤더가 독립적으로 의미를 가질 때 | Section |

### 판단 질문

경계 케이스에서 레벨을 결정할 때 다음 질문을 순서대로 적용합니다:

1. **이 컴포넌트가 없으면 페이지 자체가 의미를 잃는가?** → Page
2. **이 컴포넌트가 없어도 페이지의 다른 부분은 동작하는가?** → Section
3. **이 컴포넌트가 없어도 사용자가 주요 작업을 계속할 수 있는가?** → Widget

---

## 컴포넌트 전체 요약 테이블

| 컴포넌트 | 레벨 | 비고 |
|---|---|---|
| `AppLayout` | Page | |
| `AppLayoutContent` | Page | |
| `AppHeaderTab` | Page | |
| `Sidebar` | Page / Widget | 아이콘 일부 실패 시 Widget |
| `ToolBar` | Page | |
| `CreateLayout` | Page | |
| `DetailPageHeader` | Page / Section | Tabs와 분리 가능 시 Section |
| `Editor` | Page | |
| `Terminal` | Page / Section | 임베드 시 Section |
| `Stepper` | Page / Section | 삽입 시 Section |
| `Error403` / `Error404` / `Error500` | — | Page-level fallback으로 사용 |
| `SectionCard` | Section | |
| `Table` / `SelectableTable` / `ExpandableTable` | Section | |
| `TcTable` | Section | |
| `CardList` | Section | |
| `FloatingCard` | Section | |
| `InfoContainer` | Section | |
| `Tabs` / `Tab` | Section | |
| `TabBar` / `TabContainer` / `TabSelector` | Section | |
| `Accordion` / `Accordion.Group` / `Accordion.Item` | Section | |
| `TcAccordion` | Section | |
| `Disclosure` | Section | |
| `Overlay` / `Overlay.Template` | Section | |
| `ActionModal` / `DeleteResourceModal` / `ResourceActionModal` | Section | |
| `FilterSearch` | Section / Widget | 독립 검색 바 시 Widget |
| `TableSettingDrawer` | Section | |
| `MonitoringToolbar` (패널 전체) | Section / Widget | 단독 시 Widget |
| `Fieldset` | Section | |
| `Badge` | Widget | |
| `StatusIndicator` | Widget | |
| `ProgressBar` | Widget | |
| `InlineMessage` | Widget | |
| `LoadingSpinner` | Widget | |
| `Skeleton` | Widget | |
| `Toast` | Widget | |
| `Button` | Widget | |
| `CopyButton` / `RefreshButton` / `LangButton` | Widget | |
| `Input` / `Password` / `Textarea` | Widget | |
| `Toggle` / `Checkbox` | Widget | |
| `RadioButton` / `RadioGroup` | Widget | |
| `Dropdown` | Widget | |
| `DatePicker` / `Range` | Widget | |
| `TagInput` / `Tag` | Widget | |
| `FormField` | Widget | |
| `MultiItemDisplay` | Widget | |
| `EmptyUI` | Widget | |
| `Pagination` | Widget / Section | Table 전체 탐색 의존 시 Section |
| `Breadcrumb` | Widget | |
| `NavigationControls` / `FrameControls` | Widget | |
| `Tooltip` / `Popover` | Widget | |
| `ContextMenu` | Widget | |
| `Dim` / `Portal` | Widget | |
| `Icon` / `AppIcon` | Widget | |
| `ChartToggle` / `ChartTooltip` | Widget | |
| `Typography` / `Title` | Widget | |
