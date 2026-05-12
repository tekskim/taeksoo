# TDS Page Extract

Figma 프레임에서 페이지의 컴포넌트 구조, 패딩, 정렬, 색상, 타이포그래피를 정밀하게 추출하여 구조화된 스펙으로 변환하는 스킬입니다.

## 트리거

- "페이지 추출", "page extract", "디자인 추출해줘", "스펙 뽑아줘"
- 오케스트레이터(`tds-page-sync`)에서 Phase 2로 자동 호출

## 입력

- **페이지명**: figma-page-map.md에서 참조
- **Figma fileKey**: 크롤링 시 저장된 값
- **Figma nodeId**: 해당 페이지 프레임의 노드 ID
- **plan 파일** (있는 경우): `specs/pages/{PageName}-plan.md`

## 출력

- **스펙 파일**: `.cursor/skills/tds-page-sync/specs/pages/{PageName}-spec.md`

## 동작 절차

### Step 1: Figma 디자인 컨텍스트 추출

`get_design_context` MCP 도구로 프레임의 상세 디자인 정보를 가져옵니다.

```
CallMcpTool:
  server: "user-Figma"
  toolName: "get_design_context"
  arguments:
    fileKey: "{fileKey}"
    nodeId: "{nodeId}"
    clientLanguages: "typescript"
    clientFrameworks: "react"
```

반환 데이터:

- **code**: React + Tailwind 참조 코드 (적응 필요)
- **screenshot**: 프레임의 시각적 이미지
- **metadata**: Code Connect 스니펫, 디자인 토큰, 주석 등

### Step 2: Figma 스크린샷 획득

시각적 참조용 스크린샷을 별도로 가져옵니다.

```
CallMcpTool:
  server: "user-Figma"
  toolName: "get_screenshot"
  arguments:
    fileKey: "{fileKey}"
    nodeId: "{nodeId}"
```

### Step 3: 레이아웃 구조 분석

Figma 출력에서 페이지의 전체 레이아웃 구조를 식별합니다.

**식별 대상**:

| 레벨    | 요소                     | TDS 컴포넌트 매핑                            |
| ------- | ------------------------ | -------------------------------------------- |
| Shell   | 사이드바 + 탭바 + 상단바 | PageShell, AIPlatformSidebar, TabBar, TopBar |
| Header  | 페이지 제목 + 액션 버튼  | PageHeader                                   |
| Toolbar | 검색 + 필터 + 벌크 액션  | ListToolbar, FilterSearchInput               |
| Content | 테이블/카드/폼/차트      | Table, SectionCard, FormField 등             |
| Overlay | 모달/드로어/팝오버       | Modal, Drawer, ContextMenu                   |

**분석 방법**:

1. Figma code에서 레이아웃 구조 (flex, grid, position)를 파악
2. 컴포넌트 이름이 명시된 경우 (Code Connect) 직접 매핑
3. 시각적 패턴으로 TDS 컴포넌트 식별 (테이블 → Table, 카드 → SectionCard)

### Step 4: 컴포넌트 정밀 식별

페이지에 사용된 각 컴포넌트를 정밀하게 식별합니다.

#### 4-1. 버튼

| 추출 항목   | 매핑 대상                                      |
| ----------- | ---------------------------------------------- |
| 라벨 텍스트 | children                                       |
| 색상/스타일 | variant (primary/secondary/ghost/danger 등)    |
| 크기        | size (sm/md/lg)                                |
| 아이콘 유무 | leftIcon/rightIcon/icon                        |
| 위치        | PageHeader actions, Toolbar, Detail Actions 등 |

#### 4-2. 테이블

| 추출 항목        | 매핑 대상                                                        |
| ---------------- | ---------------------------------------------------------------- |
| 컬럼 헤더 텍스트 | columns[].header                                                 |
| 컬럼 너비 비율   | columns[].minWidth                                               |
| 정렬 (좌/중/우)  | columns[].align                                                  |
| 셀 렌더링 타입   | text, StatusIndicator, Badge, BadgeList, link, date, ContextMenu |
| 체크박스 유무    | selectable                                                       |
| 정렬 가능 여부   | sortable                                                         |

#### 4-3. 필터/검색

| 추출 항목         | 매핑 대상                                |
| ----------------- | ---------------------------------------- |
| 검색 플레이스홀더 | placeholder                              |
| 필터 필드 목록    | FilterField[] (id, label, type, options) |
| 필터 타입         | text, select, date 등                    |

#### 4-4. 상세 페이지 요소

| 추출 항목   | 매핑 대상                               |
| ----------- | --------------------------------------- |
| 헤더 타이틀 | DetailHeader.Title                      |
| 액션 버튼   | DetailHeader.Actions                    |
| 정보 카드   | DetailHeader.InfoGrid, InfoCard         |
| 탭 목록     | Tabs, TabList, Tab                      |
| 섹션 카드   | SectionCard.Header, SectionCard.Content |
| 데이터 행   | SectionCard.DataRow                     |

#### 4-5. 폼 요소

| 추출 항목   | 매핑 대상                                    |
| ----------- | -------------------------------------------- |
| 입력 필드   | Input, Select, NumberInput, Textarea, Toggle |
| 라벨        | FormField label                              |
| 필수 여부   | required                                     |
| 도움말      | helperText, description                      |
| 에러 메시지 | errorMessage                                 |

### Step 5: 간격 및 정렬 추출

Figma의 auto-layout 속성에서 간격을 추출하고 TDS spacing 토큰에 매핑합니다.

**매핑 테이블**:

| Figma 값 | TDS Token   | Class |
| -------- | ----------- | ----- |
| 0px      | --spacing-0 | gap-0 |
| 4px      | --spacing-1 | gap-1 |
| 8px      | --spacing-2 | gap-2 |
| 12px     | --spacing-3 | gap-3 |
| 16px     | --spacing-4 | gap-4 |
| 20px     | --spacing-5 | gap-5 |
| 24px     | --spacing-6 | gap-6 |
| 32px     | --spacing-8 | gap-8 |

**추출 대상**:

- VStack/HStack gap
- 컴포넌트 간 margin
- 섹션 간 spacing
- 패딩 (content area, card, section)
- 정렬 (items-start, items-center, justify-between 등)

### Step 6: 색상 및 타이포그래피 매핑

Figma에서 사용된 색상과 텍스트 스타일을 TDS 토큰에 매핑합니다.

**색상 매핑**:

| Figma 색상 | TDS Token               |
| ---------- | ----------------------- |
| #0f172a    | --color-text-default    |
| #475569    | --color-text-muted      |
| #64748b    | --color-text-subtle     |
| #2563eb    | --color-action-primary  |
| #ffffff    | --color-surface-default |
| #f8fafc    | --color-surface-subtle  |
| #e2e8f0    | --color-border-default  |

**타이포그래피 매핑**:

| Figma 스타일    | TDS Class       |
| --------------- | --------------- |
| 16px / semibold | text-heading-h5 |
| 14px / semibold | text-heading-h6 |
| 14px / regular  | text-body-lg    |
| 12px / regular  | text-body-md    |
| 11px / regular  | text-body-sm    |
| 13px / medium   | text-label-lg   |
| 12px / medium   | text-label-md   |
| 11px / medium   | text-label-sm   |

### Step 7: 상태별 화면 식별

Figma에서 동일 페이지의 다른 상태 프레임이 있는지 확인합니다.

**확인 대상**:

- **Empty State**: 데이터가 없을 때 표시 (EmptyState 컴포넌트)
- **Loading State**: 로딩 중 표시 (Loading, Skeleton)
- **Error State**: 에러 발생 시 표시 (ErrorState)
- **Selected State**: 테이블 행 선택 시 벌크 액션 표시
- **Drawer/Modal Open**: 오버레이가 열린 상태

같은 Figma 페이지 내에 `{PageName} - Empty`, `{PageName} - Loading` 등의 프레임이 있으면 함께 추출합니다.

### Step 8: 스펙 파일 생성

추출한 모든 정보를 구조화된 스펙 파일로 생성합니다.

**스펙 형식** (`specs/pages/{PageName}-spec.md`):

```markdown
# {PageName} Page Spec

> Extracted from Figma frame: {frameName}
> nodeId: {nodeId}
> Type: {List|Detail|Create|Main}
> Target: src/pages/ai-platform/{PageName}Page.tsx

## Screenshot Reference

(Figma 스크린샷 설명 — 실제 이미지는 get_screenshot으로 별도 참조)

## Layout Structure
```

PageShell
├── AIPlatformSidebar
├── TabBar
├── TopBar (breadcrumb: AI Platform > {Section} > {Page})
└── Content (pt-3 px-8 pb-20 bg-surface-subtle)
└── VStack gap={3}
├── PageHeader (title="{Title}", actions=[...])
├── ListToolbar
│ ├── FilterSearchInput (filters=[...])
│ └── BulkActions (when selected)
├── Pagination
└── Table (columns=[...], selectable)

````

## Components Detail

### PageHeader

| Prop | Value |
|---|---|
| title | "{Title}" |
| actions | Button(primary, md, "Create {Resource}") |

### Table Columns

| # | Header | Key | Align | MinWidth | Sortable | Render |
|---|---|---|---|---|---|---|
| 1 | Name | name | left | 200px | yes | text + link |
| 2 | Status | status | center | 80px | yes | StatusIndicator |

### FilterSearchInput

| # | Field ID | Label | Type | Options |
|---|---|---|---|---|
| 1 | name | Name | text | — |
| 2 | status | Status | select | Running, Stopped, Error |

### Buttons

| Location | Label | Variant | Size | Icon |
|---|---|---|---|---|
| PageHeader | Create {Resource} | primary | md | IconPlus (12) |
| Toolbar | Download | secondary | sm | IconDownload (12) |
| Bulk | Delete | muted | sm | IconTrash (12) |

## Spacing Map

| Area | Spacing | Token |
|---|---|---|
| Content padding-top | 12px | pt-3 |
| Content padding-x | 32px | px-8 |
| PageHeader ↔ Toolbar | 12px | gap-3 (VStack) |
| Toolbar ↔ Pagination | 12px | gap-3 (VStack) |
| Pagination ↔ Table | 12px | gap-3 (VStack) |

## States

### Empty State

| Prop | Value |
|---|---|
| icon | {IconName} size={48} stroke={1} |
| title | "{empty title}" |
| description | "{empty description}" |
| action | Button(primary, md, "Create {Resource}") |

### Selected State (Bulk Actions)

- SelectionIndicator 표시
- BulkAction 버튼 활성화

## Mock Data Shape

```typescript
interface {PageName}Item {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building' | 'muted';
  // ...추출된 필드
}
````

## Breadcrumb

```typescript
[{ label: 'AI Platform' }, { label: '{Section}' }, { label: '{PageName}' }];
```

## Notes

- {Figma에서 발견한 특이사항}
- {TDS 컴포넌트로 매핑이 어려운 부분}
- {커스텀 구현이 필요한 부분}

```

## TDS 컴포넌트 식별 규칙

### 시각적 패턴 → TDS 컴포넌트

| 시각적 패턴 | TDS 컴포넌트 |
|---|---|
| 좌측 아이콘 사이드바 + 메뉴 | AIPlatformSidebar |
| 상단 탭 바 | TabBar |
| 브레드크럼 + 검색/알림 아이콘 | TopBar + Breadcrumb |
| 제목 + 우측 버튼 | PageHeader |
| 검색바 + 필터 태그 | FilterSearchInput + ListToolbar |
| 행 체크박스 + 헤더 + 정렬 화살표 | Table (selectable, sortable) |
| 페이지 번호 + 화살표 | Pagination |
| 컬러 도트 + 텍스트 | StatusIndicator |
| 작은 라운드 라벨 | Badge |
| 삼점 메뉴 | ContextMenu |
| 하단 고정 패널 | Drawer (footer) |
| 중앙 오버레이 + 딤 | Modal |
| 빈 아이콘 + 텍스트 + 버튼 | EmptyState |
| 정보 라벨-값 쌍 행 | SectionCard.DataRow |
| 카드 + 제목 + Edit 버튼 | SectionCard.Header |
| 큰 숫자 + 설명 카드 그룹 | MetricCard.Group |

### 페이지 타입별 기본 구조

**List Page**:
```

PageShell > VStack gap={3} >
PageHeader (title + Create 버튼)
ListToolbar (SearchInput + 필터 + 벌크 액션)
Pagination
Table (selectable, columns, data)

```

**Detail Page**:
```

PageShell > VStack gap={4} >
DetailHeader (title + status + actions + InfoGrid)
Tabs (underline, sm)
TabPanel > VStack gap={4} >
SectionCard (Header + DataRow들)

```

**Create Page (Wizard)**:
```

PageShell > VStack gap={4} >
PageHeader (title)
SectionCard (isActive, open form)
SectionCard (pre, collapsed)
HStack > Cancel + Create 버튼

```

**Dashboard**:
```

PageShell > VStack gap={4} >
PageHeader (title)
MetricCard.Group
SectionCard (차트/테이블)

```

## 필수: 전체 케이스 사전 파악 (KNOWN_ISSUES #5 대응)

**구현 전에 반드시 수행합니다.** Figma에서 동일 섹션의 모든 프레임을 `get_metadata`로 먼저 리스팅하여 케이스 목록을 작성합니다. 케이스를 하나씩 발견하면서 구현하면 반복 수정이 발생합니다.

```

1. get_metadata → 섹션 내 모든 프레임 이름 리스팅
2. 케이스 목록 작성 (예: empty, basic, readonly, error, no-datasource, full)
3. 각 케이스의 nodeId 매핑
4. 모든 케이스에 대해 get_design_context 병렬 호출
5. 스펙에 모든 케이스 한 번에 기술

```

## 필수: 아이콘 SVG 원본 확인 (KNOWN_ISSUES #1 대응)

아이콘 이름만 보고 Tabler Icons를 추측하여 매칭하면 안 됩니다. 반드시 SVG asset을 다운로드하여 path 형태를 확인합니다.

```

1. get_design_context에서 아이콘의 SVG asset URL 획득
2. Read로 SVG 파일 다운로드 → path d 속성 확인
3. SVG path 형태 기준으로 Tabler Icons 매칭:
   - 겹치는 사각형 = IconCopy
   - 원+체크 = IconCircleCheck
   - 원+X = IconCircleX
4. TDS/Tabler에 없으면 "TDS에 없음"으로 스펙에 기록
5. strokeWidth도 SVG에서 확인 → stroke={N} prop으로 스펙에 기록

```

## 필수: Figma 수치 정확 추출 (KNOWN_ISSUES #3 대응)

`get_design_context` 반환 코드의 Tailwind 클래스에서 **모든 px 수치**를 추출 목록으로 정리합니다. 임의의 값으로 대체하지 않습니다.

**추출 필수 항목**: rounded, padding, gap, font-size, line-height, width, height, background-color

## 서브에이전트 병렬 추출 전략

### 개요

여러 페이지의 디자인을 추출할 때, Figma API rate limit이 허용하는 범위 내에서 서브에이전트를 활용하여 추출 속도를 높입니다.

### 병렬 추출 조건

| 조건 | 추출 방식 |
|---|---|
| 추출 대상 1~2개 | 메인 에이전트가 순차 처리 |
| 추출 대상 3개 이상 | 서브에이전트 병렬 (최대 3개 동시) |

### 병렬 추출 실행 방법

```

메인 에이전트:

1. figma-page-map.md에서 추출 대상 페이지 목록 정리
2. 2~3개씩 배치로 나눔 (Figma API rate limit 고려)
3. 각 배치를 generalPurpose 서브에이전트로 병렬 실행
4. 결과 스펙 파일을 검증

서브에이전트 (generalPurpose):

- Figma MCP 도구로 get_design_context + get_screenshot 호출
- Step 3~8 수행 (레이아웃 분석 → 컴포넌트 식별 → 스펙 생성)
- 스펙 파일을 specs/pages/{PageName}-spec.md에 저장

````

### 서브에이전트 프롬프트 템플릿

```markdown
## 디자인 추출 대상
- 페이지명: {PageName}
- fileKey: {fileKey}
- nodeId: {nodeId}
- 페이지 타입: {List / Detail / Create / Main}

## 작업 내용
1. Figma MCP의 get_design_context로 디자인 추출
2. get_screenshot으로 스크린샷 획득
3. 레이아웃 구조 → TDS 컴포넌트 매핑
4. 컴포넌트/간격/색상/타이포 정밀 식별
5. 스펙 파일 생성: .cursor/skills/tds-page-sync/specs/pages/{PageName}-spec.md

## 참조
- 스펙 형식: tds-page-extract SKILL.md의 Step 8 참조
- TDS 컴포넌트 매핑: tds-page-extract SKILL.md의 "TDS 컴포넌트 식별 규칙" 참조
````

### Rate Limit 고려

- Figma API 호출 간격: 서브에이전트 간 자연스럽게 분산됨
- 동시 서브에이전트: 최대 3개 (Figma API 부하 제한)
- API 에러(429) 발생 시: 해당 페이지를 다음 배치로 이동

## 주의사항

- Figma의 코드 출력은 **참조용**이지 그대로 사용하면 안 됨 → TDS 컴포넌트에 맞게 변환
- 디자인 토큰이 Figma 변수로 연결된 경우 Code Connect 스니펫을 우선 참조
- 간격이 TDS 토큰과 정확히 일치하지 않는 경우 가장 가까운 토큰으로 매핑
- 아이콘은 Figma SVG 원본 확인 후 Tabler Icons 매칭 (**이름만 보고 추측 금지**)
- 색상이 디자인 토큰과 미세하게 다른 경우 가장 가까운 TDS 토큰 사용
- 테이블 컬럼의 align은 TDS 규칙을 따름 (텍스트=left, 숫자/날짜=right, 상태/액션=center)

```

```
