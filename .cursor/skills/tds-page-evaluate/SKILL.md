# TDS Page Evaluate

구현된 페이지를 Figma 원본과 비교하여 시각적·기능적 품질을 검증하고, PASS/FAIL 판정과 수정 사항을 제안하는 스킬입니다.

## 트리거

- "페이지 검증", "page evaluate", "QA 해줘", "페이지 확인해줘"
- 오케스트레이터(`tds-page-sync`)에서 Phase 4로 자동 호출

## 입력

- **페이지 파일**: `src/pages/ai-platform/{PageName}Page.tsx`
- **스펙 파일**: `.cursor/skills/tds-page-sync/specs/pages/{PageName}-spec.md`
- **Figma fileKey / nodeId**: 원본 디자인 참조용

## 출력

- **평가 리포트**: 콘솔 출력 (PASS/FAIL + 상세 피드백)
- **수정 사항 적용**: FAIL 항목이 있으면 자동 수정 시도

## 동작 절차

### Step 1: 빌드 검증

코드가 빌드에 통과하는지 확인합니다.

1. **TypeScript 타입 체크**: `ReadLints`로 해당 파일의 linter 에러 확인
2. **Import 검증**: 사용된 모든 심볼이 존재하는지 확인
3. **문법 오류**: JSX 닫는 태그, 괄호 매칭 등

```
ReadLints:
  paths: ["src/pages/ai-platform/{PageName}Page.tsx"]
```

**판정**: 에러 0개 → PASS, 1개 이상 → FAIL (즉시 수정 시도)

### Step 2: TDS 규칙 준수 검증

`.cursor/rules/tds-design-system.mdc` 규칙을 기준으로 코드를 검사합니다.

#### 2-1. Import 검증

| 체크           | 기준                                            | 판정      |
| -------------- | ----------------------------------------------- | --------- |
| DS import      | 모든 UI 컴포넌트가 `@/design-system`에서 import | PASS/FAIL |
| Icon import    | 아이콘이 `@tabler/icons-react`에서 import       | PASS/FAIL |
| Sidebar import | `@/components/AIPlatformSidebar`에서 import     | PASS/FAIL |
| useTabs import | `@/contexts/TabContext`에서 import              | PASS/FAIL |

#### 2-2. 하드코딩 검사

코드에서 하드코딩된 값을 검사합니다:

| 검사 대상     | 금지 패턴                | 올바른 패턴                     |
| ------------- | ------------------------ | ------------------------------- |
| 색상          | `#2563eb`, `bg-blue-500` | `var(--color-*)`                |
| 폰트 크기     | `text-[12px]`, `text-xs` | `text-body-md`, `text-label-sm` |
| Border radius | `rounded-[4px]`          | `rounded-[var(--radius-sm)]`    |
| Fallback 색상 | `var(--color-xxx, #fff)` | `var(--color-xxx)`              |

**검사 방법**: `Grep` 도구로 파일 내 금지 패턴 검색

```
Grep:
  pattern: "#[0-9a-fA-F]{3,8}"
  path: "src/pages/ai-platform/{PageName}Page.tsx"
```

#### 2-3. 컴포넌트 규칙 검사

| 체크                | 기준                                                         |
| ------------------- | ------------------------------------------------------------ |
| PageShell 사용      | 수동 `fixed inset-0` 레이아웃 금지                           |
| EmptyState 사용     | 커스텀 empty state 인라인 정의 금지                          |
| FormField 래핑      | Input/Select 등이 FormField로 감싸져 있는지                  |
| Button variant/size | 위치별 규칙 (PageHeader=primary/md, Toolbar=secondary/sm 등) |
| 테이블 정렬         | 텍스트=left, 숫자=right, 상태/액션=center                    |
| BadgeList           | 배열 데이터 렌더링 시 BadgeList 사용                         |
| ContextMenu items   | 모든 item에 `id` 필드 존재                                   |
| icon-only 버튼      | `aria-label` 존재                                            |

### Step 3: 스펙 일치도 검증

스펙 파일의 내용과 실제 코드를 비교합니다.

#### 3-1. 레이아웃 구조 비교

스펙의 Layout Structure와 코드의 JSX 구조를 비교합니다.

| 체크              | 방법                             |
| ----------------- | -------------------------------- |
| 컴포넌트 트리     | 스펙의 구조와 JSX 트리 매칭      |
| VStack/HStack gap | 스펙의 spacing과 코드의 gap 비교 |
| Breadcrumb items  | 스펙과 코드의 경로 일치          |
| contentClassName  | 스펙의 padding과 일치            |

#### 3-2. 컴포넌트 상세 비교

| 체크              | 방법                                      |
| ----------------- | ----------------------------------------- |
| 테이블 컬럼 수    | 스펙의 컬럼 수와 코드의 columns 배열 길이 |
| 테이블 컬럼 이름  | header 텍스트 일치                        |
| 필터 필드 수/이름 | FilterField 배열 비교                     |
| 버튼 라벨/variant | 스펙과 코드 비교                          |
| 상태별 화면       | Empty/Error 상태 존재 여부                |

#### 3-3. 목 데이터 검증

| 체크        | 기준                          |
| ----------- | ----------------------------- |
| 데이터 개수 | List: 15~20개                 |
| 타입 일치   | 인터페이스와 실제 데이터 매칭 |
| 현실적 값   | placeholder 텍스트 없음       |
| 상태 분포   | 다양한 상태값 포함            |

### Step 4: 시각적 비교 (브라우저 검증)

dev 서버가 실행 중인 경우, 브라우저에서 실제 렌더링을 확인합니다.

#### 4-1. 페이지 스크린샷 캡처

```
CallMcpTool:
  server: "cursor-ide-browser"
  toolName: "browser_navigate"
  arguments:
    url: "http://localhost:5173/ai-platform/{route}"
```

```
CallMcpTool:
  server: "cursor-ide-browser"
  toolName: "browser_snapshot"
```

#### 4-2. Figma 스크린샷 획득

```
CallMcpTool:
  server: "user-Figma"
  toolName: "get_screenshot"
  arguments:
    fileKey: "{fileKey}"
    nodeId: "{nodeId}"
```

#### 4-3. 비교 항목

| 항목          | 비교 방법                        | 허용 오차              |
| ------------- | -------------------------------- | ---------------------- |
| 전체 레이아웃 | 사이드바, 헤더, 컨텐츠 영역 위치 | 구조적 일치            |
| 컴포넌트 배치 | 테이블, 버튼, 필터 위치          | 논리적 일치            |
| 간격/패딩     | 요소 간 간격                     | ±4px (1 spacing token) |
| 타이포그래피  | 제목, 본문, 라벨 크기            | 정확 일치              |
| 색상          | 배경, 텍스트, 보더               | TDS 토큰 일치          |

**비교 방법**: 두 스크린샷을 나란히 보면서 주요 차이점을 텍스트로 서술합니다. (픽셀 단위 비교가 아닌 구조적/시각적 비교)

### Step 5: 판정 및 리포트

모든 검증 결과를 종합하여 판정합니다.

**판정 기준**:

| 등급             | 기준                                                           |
| ---------------- | -------------------------------------------------------------- |
| **PASS**         | 빌드 통과 + TDS 규칙 준수 + 스펙 일치 + 시각적 일치            |
| **PASS (Minor)** | 빌드 통과 + 경미한 차이 (간격 1단계 차이, 아이콘 미세 차이 등) |
| **FAIL**         | 빌드 에러, TDS 규칙 위반, 주요 컴포넌트 누락, 레이아웃 불일치  |

**리포트 형식**:

```markdown
## Evaluation Report: {PageName}

### Result: {PASS|PASS (Minor)|FAIL}

### Build Check

- TypeScript: ✅ PASS (0 errors)
- Imports: ✅ PASS

### TDS Rules

- Import sources: ✅ PASS
- Hardcoded values: ✅ PASS
- Component rules: ✅ PASS
- Button conventions: ✅ PASS
  | Total: 8/8 rules passed

### Spec Compliance

- Layout structure: ✅ Match
- Table columns: ✅ 8/8 match
- Filter fields: ✅ 3/3 match
- Button labels: ✅ 5/5 match
- Empty state: ✅ Present
- Mock data: ✅ 18 items

### Visual Comparison

- Overall layout: ✅ Match
- Component placement: ✅ Match
- Spacing: ⚠️ Minor — PageHeader gap is 16px (spec: 12px)
- Typography: ✅ Match
- Colors: ✅ Match

### Issues Found

1. ⚠️ [Minor] PageHeader와 Toolbar 간격이 gap-4 (스펙: gap-3)
   → 수정 권장: VStack gap={3}

### Auto-fix Applied

- (자동 수정한 항목 나열)
```

### Step 6: 자동 수정 (FAIL인 경우)

FAIL 판정 항목에 대해 자동 수정을 시도합니다.

**자동 수정 가능 항목**:

- 하드코딩된 색상 → CSS 변수로 교체
- 잘못된 import 경로 → 올바른 경로로 수정
- 누락된 aria-label → 추가
- 잘못된 버튼 variant/size → 규칙에 맞게 수정
- 간격 불일치 → 올바른 gap 값으로 수정

**자동 수정 불가 항목** (사용자 확인 필요):

- 컴포넌트 구조 변경
- 누락된 컴포넌트 추가 (테이블 컬럼 추가 등)
- 비즈니스 로직 변경

수정 후 Step 1부터 재검증합니다 (최대 2회 반복).

## 추가 검증: 반복 실수 방지 체크 (KNOWN_ISSUES 대응)

Step 2의 TDS 규칙 검증에 아래 항목을 **필수로** 추가합니다.

### 아이콘 검증 (#1, #4)

| 체크                                                     | 방법                                             |
| -------------------------------------------------------- | ------------------------------------------------ |
| 아이콘이 Figma SVG와 시각적으로 매칭되는가               | 스펙의 아이콘 비교 테이블 대조                   |
| stroke prop이 명시적으로 설정되었는가                    | `Grep`으로 `Icon.*size=` 검색 → stroke 존재 확인 |
| Tabler 기본 stroke(2)가 아닌 값이 필요한 아이콘이 있는가 | 스펙의 stroke 값 대조                            |

```
Grep:
  pattern: "Icon\\w+.*size=.*(?!stroke)"
  path: "src/pages/ai-platform/{PageName}Page.tsx"
```

→ stroke가 누락된 아이콘이 발견되면 FAIL

### TDS 컴포넌트 사용 검증 (#2)

| 체크                                               | 방법                             |
| -------------------------------------------------- | -------------------------------- |
| 경고/에러/정보 배너가 InlineMessage로 구현되었는가 | 커스텀 bg-red/bg-yellow div 검색 |
| 빈 상태가 EmptyState로 구현되었는가                | 커스텀 empty state div 검색      |
| 상태 표시가 StatusIndicator로 구현되었는가         | 커스텀 dot+text div 검색         |

```
Grep:
  pattern: "bg-\\[#fe[ef]|bg-red-|bg-yellow-|bg-orange-"
  path: "src/pages/ai-platform/{PageName}Page.tsx"
```

→ 커스텀 배경색 배너가 발견되면 FAIL (InlineMessage 사용 필요)

### Figma 수치 일치 검증 (#3)

스펙의 Spacing Map에 기록된 **모든 px 수치**가 코드에 정확히 반영되었는지 확인합니다.

| 체크       | 방법                                                      |
| ---------- | --------------------------------------------------------- |
| rounded 값 | 스펙의 border-radius와 코드의 rounded-[Npx] 비교          |
| padding 값 | 스펙의 padding과 코드의 p-[Npx] 비교                      |
| gap 값     | 스펙의 gap과 코드의 gap-N 비교                            |
| font-size  | 스펙의 font-size와 코드의 text-body-_/text-heading-_ 비교 |

### 케이스 완성도 검증 (#5)

스펙에 기록된 **모든 케이스**가 코드에 구현되었는지 확인합니다.

| 체크                                                        | 방법                                |
| ----------------------------------------------------------- | ----------------------------------- |
| 스펙의 States 섹션에 나열된 모든 케이스가 코드에 존재하는가 | 조건부 렌더링 로직 확인             |
| 각 케이스로 진입할 수 있는 라우팅/상태 전환이 있는가        | useParams, useState 등 확인         |
| 브라우저에서 모든 케이스를 시각적으로 확인했는가            | 케이스별 URL 또는 인터랙션으로 검증 |

## 주의사항

- 브라우저 검증은 dev 서버 실행 여부에 따라 선택적 수행
- 시각적 비교는 픽셀 퍼펙트가 아닌 구조적 일치를 목표
- 자동 수정은 보수적으로 수행 (확실한 것만)
- 자동 수정 후에도 FAIL이면 사용자에게 이슈 목록 전달
- 평가 리포트는 tds-page-sync 오케스트레이터가 최종 집계에 사용
- **반복 실수 방지 체크가 하나라도 FAIL이면 전체 판정도 FAIL**
