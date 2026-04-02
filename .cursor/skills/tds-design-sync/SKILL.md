# TDS Design Sync (Orchestrator)

TDS 디자인을 thaki-shared 컴포넌트에 반영하는 전체 파이프라인을 자동 실행하는 오케스트레이터 스킬입니다.
단일 컴포넌트 또는 배치 모드(복수 컴포넌트)를 지원하며, 배치 모드에서는 **단계별 일괄 처리(Phase-parallel)**로 실행합니다.

## 트리거

- "디자인 싱크", "design sync", "싱크해줘", "배치 싱크"
- 컴포넌트명과 함께: "Button 싱크해줘", "Button, Badge, Chip 디자인 싱크해줘"
- Phase 단위: "Phase 1 싱크해줘"

## 입력

- **컴포넌트명**: 1개 또는 콤마 구분 리스트
- 예: `"Button"` 또는 `"Button, Badge, Chip, StatusIndicator"`

## 참조 파일

- `component-map.md`: 이 폴더 내 TDS ↔ thaki-shared 매핑
- `token-map.md`: 이 폴더 내 토큰 네이밍 매핑
- `specs/`: 추출된 디자인 스펙 저장 위치

## 실행 모드

| 모드      | 조건              | 실행 방식                              |
| --------- | ----------------- | -------------------------------------- |
| 단일 모드 | 컴포넌트 1개      | 순차 실행 (Extract → Apply → Evaluate) |
| 배치 모드 | 컴포넌트 2개 이상 | Phase-parallel (아래 절차)             |

## 동작 절차

### Step 1: 입력 파싱

사용자 메시지에서 컴포넌트명 추출:

- 단일: "Button 싱크해줘" → `["Button"]`
- 배치: "Button, Badge, Chip 싱크해줘" → `["Button", "Badge", "Chip"]`
- Phase 단위: "Phase 1 싱크해줘" → component-map.md의 Phase 1 컴포넌트 목록

### Step 2: 매핑 확인

`component-map.md`에서 각 컴포넌트의:

- TDS 경로 확인
- thaki-shared 대응 경로 확인
- 매핑 상태 확인 (1:1 / partial / none)

미대응(`none`) 컴포넌트는 경고 후 건너뛰기.

### Step 2.5: Notion Story 생성

싱크 대상 컴포넌트가 확정되면, 팀에 "작업 중" 알림 목적으로 Notion 업무 보드에 Story를 생성합니다.

> **독립 실행 가능**: 싱크 파이프라인 없이 단독으로도 실행할 수 있습니다.
> 트리거: "Button 노션 스토리 만들어줘", "CopyButton 노션 문서 생성해줘"
> 독립 실행 시 Step 1(입력 파싱) → Step 2.5(Notion Story 생성)만 수행합니다.

#### 카테고리 조회

`src/pages/design/_shared/navigationData.ts`의 `navGroups`에서 해당 컴포넌트를 검색합니다:

- **찾으면**: 해당 `navGroup.title`을 카테고리로, `navItem.label`을 컴포넌트 label로 사용
- **못 찾으면**: 카테고리 = `Design Sync`, label = 컴포넌트명 그대로 사용

#### 중복 확인

`notion-search`로 `[Story] {카테고리} - {label}` 검색:

```
notion-search:
  query: "[Story] {카테고리} - {label}"
  data_source_url: "collection://3039eddc-34e6-80a3-a1d7-000b8cd1325d"
  filters: {}
  page_size: 3
```

- **이미 존재**: 기존 페이지 URL만 기록, 재생성하지 않음
- **없으면**: 아래 절차로 생성

#### 페이지 생성

`notion-create-pages`로 업무 보드에 Story 페이지 생성합니다.
`Parent item` 속성으로 `[Epic] TDS 1.0` (`31b9eddc34e6803898f0da77b0286c44`)에 연결하여 Epic 하위 스토리로 등록합니다.

```
notion-create-pages:
  parent:
    data_source_id: "3039eddc-34e6-80a3-a1d7-000b8cd1325d"
  pages:
    - properties:
        Summary(Title): "[Story] {카테고리} - {label}"
        Team: "디자인"
        Work type: "story"
        우선 순위: "P2"
        디자인_Status: "In Progress"
        Parent item: "https://www.notion.so/31b9eddc34e6803898f0da77b0286c44"
      icon: "🎨"
      content: |
        ## 요구사항 (Acceptance Criteria)
        1. {ComponentName} 컴포넌트의 디자인이 TDS와 일치
        2. 로직/이벤트/상태 관리 변경 없음
        3. pnpm build, tsc --noEmit 통과
        4. Storybook에서 정상 렌더링

        ## TDS Design File
        - {TDS 페이지 URL 또는 "(추후 업데이트 예정)"}

        ## PR
        - (싱크 완료 후 업데이트 예정)
```

**TDS 페이지 URL 결정**:

- `navigationData.ts`에 있는 경우: `https://thakicloud.github.io/tds_ssot/design/components/{component-id}`
- `navigationData.ts`에 없는 경우: `(추후 업데이트 예정)`

**타이틀 형식**:

| 상황            | 타이틀                                  | 예시                                  |
| --------------- | --------------------------------------- | ------------------------------------- |
| TDS 페이지 있음 | `[Story] {카테고리} - {label}`          | `[Story] Form Controls - Copy Button` |
| TDS 페이지 없음 | `[Story] Design Sync - {ComponentName}` | `[Story] Design Sync - FloatingCard`  |

#### Guard

사용자에게 "Notion에 Story를 생성할까요?" 확인 후 실행. 생성된 Notion 페이지 URL을 이후 단계(PR)에서 참조할 수 있도록 보관합니다.

---

## Phase-parallel 실행 (배치 모드)

컴포넌트가 2개 이상일 때 아래 Phase 순서로 일괄 처리합니다.
단일 컴포넌트일 때는 동일 Phase를 순차 실행합니다 (Phase 1에서 서브에이전트 없이 직접 Extract).

```
Phase 1: Batch Extract (병렬) ─→ Phase 2: Batch Apply (통합 확인 + 순차 적용)
  ─→ Phase 3: Single Build (1회) ─→ Phase 4: Batch Evaluate (통합 Canvas)
  ─→ [대기] 사용자 디자인 확인 후 PR 요청 시 ─→ Phase 5: PR
```

### Phase 1: Batch Extract (병렬)

Task 서브에이전트를 사용하여 모든 컴포넌트의 Extract를 **동시** 실행합니다.

#### 실행 방법

각 컴포넌트마다 Task 서브에이전트를 하나씩 생성하여 병렬 호출합니다:

```
Task(subagent_type="generalPurpose", model="fast"):
  prompt: |
    tds-design-extract 스킬을 실행하세요.
    - 스킬 파일: .cursor/skills/tds-design-extract/SKILL.md
    - 컴포넌트: {ComponentName}
    - component-map: .cursor/skills/tds-design-sync/component-map.md
    - token-map: .cursor/skills/tds-design-sync/token-map.md
    - 출력: .cursor/skills/tds-design-sync/specs/{ComponentName}.md

    스킬 파일을 읽고 절차에 따라 실행하세요.
    완료 후 생성된 스펙 파일의 "주요 디자인 차이" 요약을 반환하세요.
```

**모든 Task를 단일 메시지에서 동시 호출**하여 병렬 실행합니다.

#### 충돌 관리

- 각 서브에이전트는 서로 다른 `specs/{Name}.md` 파일을 생성하므로 충돌 없음
- 모든 서브에이전트는 읽기 전용으로 TDS/shared 소스를 참조

#### 결과 수집

모든 서브에이전트 완료 후 결과를 집계합니다:

```
[Phase 1] Extract: {N}/{Total} 완료
  ✅ Button — 차이 8건
  ✅ Badge — 차이 14건
  ✅ Checkbox — 차이 5건
  ❌ DatePicker — Extract 실패 (SKIP)
```

- **실패한 컴포넌트**: 해당 컴포넌트만 SKIP 처리, 나머지 Phase 2로 진행
- 실패 원인을 기록하여 완료 리포트에 포함

### Phase 2: Batch Apply (통합 확인 + 순차 적용)

#### 2-A: 통합 Pre-flight 리포트 생성

Phase 1에서 생성된 모든 스펙을 읽고, 각 컴포넌트의 Pre-flight 리포트를 **하나의 통합 리포트**로 조립합니다.

```markdown
## 통합 Pre-flight Report

### 요약

| #   | 컴포넌트 | .styles.ts 변경 | .tsx 변경 | 토큰 변경 | API 변경 |
| --- | -------- | --------------- | --------- | --------- | -------- |
| 1   | Button   | 12건            | 0건       | 0건       | 0건      |
| 2   | Badge    | 8건             | 2건 (SVG) | 0건       | 2건      |
| 3   | Checkbox | 5건             | 0건       | 0건       | 0건      |

### Button — Pre-flight Details

(tds-design-apply 스킬의 Pre-flight 형식 그대로)

### Badge — Pre-flight Details

(동일 형식)

### Checkbox — Pre-flight Details

(동일 형식)
```

#### 2-B: 사용자 일괄 확인

통합 Pre-flight 리포트를 사용자에게 보여주고 **1회 확인**을 받습니다.

- **"전체 승인"**: 모든 컴포넌트 Apply 진행
- **"일부 제외"**: 제외할 컴포넌트를 지정 → 해당 컴포넌트 SKIP
- **"취소"**: 전체 중단

#### 2-C: 순차 적용

승인된 컴포넌트를 **순차**로 Apply합니다 (파일 충돌 방지):

```
[Phase 2] Apply: 1/{N} Button 적용 중...
[Phase 2] Apply: 2/{N} Badge 적용 중...
[Phase 2] Apply: {N}/{N} 적용 완료
```

각 컴포넌트 Apply는 `tds-design-apply` 스킬의 Step 5(적용) + Step 5.5(스펙 대조 검증)을 실행합니다.
Pre-flight(Step 3)와 사용자 확인(Step 4)은 Phase 2-A/2-B에서 이미 완료되었으므로 건너뜁니다.

#### Apply 실패 시 격리

개별 컴포넌트 Apply 실패 시:

1. 해당 컴포넌트의 변경 파일을 롤백: `git checkout -- src/components/{Name}/`
2. 해당 컴포넌트를 SKIP 처리
3. 나머지 컴포넌트 Apply 계속 진행

### Phase 3: Single Build (1회)

모든 Apply 완료 후 빌드를 **1회만** 실행합니다:

```bash
cd /path/to/thaki-shared && pnpm build && npx tsc --noEmit
```

> **토큰 변경이 있는 경우**, 빌드 전에 반드시 토큰 재생성을 실행합니다:
>
> ```bash
> cd /path/to/thaki-shared && pnpm run generate:tokens && pnpm run generate:tailwind-preset && pnpm run generate:token-docs
> ```

#### 빌드 성공

Phase 4로 진행합니다.

#### 빌드 실패 시 이분법 격리

빌드가 실패하면 원인 컴포넌트를 특정합니다:

1. `git stash`로 전체 변경 저장
2. 컴포넌트를 절반씩 나눠서 적용 → 빌드 → 실패하는 절반 재분할
3. 원인 컴포넌트 특정 후 해당 컴포넌트만 롤백
4. 나머지 컴포넌트로 빌드 재확인

또는 간단한 방법으로:

1. 전체 롤백: `git checkout -- .`
2. 컴포넌트를 하나씩 Apply하면서 빌드 → 실패 시점의 컴포넌트 SKIP
3. 나머지 컴포넌트 재적용

### Phase 4: Batch Evaluate (통합 Canvas)

빌드 성공 후, 모든 컴포넌트의 시각적 검증을 일괄 수행합니다.

#### 4-A: Computed Style 비교

`tds-design-evaluate` 스킬의 Step 1A를 **각 컴포넌트에 대해 순차 실행**합니다.
(browser MCP는 공유 자원이므로 순차 실행 필수)

1. TDS 페이지(localhost:5173)에서 컴포넌트별 computed style 추출
2. thaki-shared Storybook(localhost:6006)에서 동일 요소 computed style 추출
3. 속성별 비교 결과를 컴포넌트별로 수집

#### 4-B: 금지 변경 검증

`tds-design-evaluate` 스킬의 Step 2를 **전체 diff에 대해 1회** 실행합니다:

```bash
cd /path/to/thaki-shared && git diff --name-only
```

변경된 모든 파일을 스캔하여 금지 변경 여부를 일괄 검증합니다.

#### 4-C: 통합 Canvas 생성

`tds-design-evaluate` 스킬의 Step 1B를 **통합 모드**로 실행합니다.
모든 컴포넌트의 비교 결과를 **하나의 Canvas HTML 페이지**에 합산합니다.

Canvas 구성:

- 상단: 요약 대시보드 (컴포넌트별 일치율 한눈에 표시)
- 컴포넌트별 탭으로 섹션 분리
- 각 탭 내: variant/size/theme 조합별 스크린샷 비교 + Computed Style 테이블
- 일치/불일치 시각화 (PASS=초록, FAIL=빨강)

#### 4-D: 통합 Evaluate 리포트

모든 결과를 하나의 리포트로 출력합니다:

```markdown
## Batch Evaluate Report

### 요약

| #   | 컴포넌트 | Computed Style | 금지 변경 | 기능 검증 | 판정     |
| --- | -------- | -------------- | --------- | --------- | -------- |
| 1   | Button   | 100% (42/42)   | ✅ Pass   | ✅ Pass   | ✅ PASS  |
| 2   | Badge    | 95% (38/40)    | ✅ Pass   | ✅ Pass   | ⚠️ minor |
| 3   | Checkbox | 100% (28/28)   | ✅ Pass   | ✅ Pass   | ✅ PASS  |

### Canvas 비교 페이지

[통합 비교 화면](canvas-link)

### 컴포넌트별 상세

(각 컴포넌트의 Computed Style 비교 테이블, 불일치 항목 나열)
```

#### Evaluate FAIL 처리

- **minor 불일치** (1px 이내, 동일 계열 색상): PASS 처리, 리포트에 기록
- **major 불일치**: 해당 컴포넌트를 SKIP 처리, 커밋에서 제외

### Phase 5: PR (사용자 요청 시에만)

Phase 4 완료 후 결과 리포트를 출력하고 **대기**합니다.
PR은 자동 생성하지 않으며, 사용자가 디자인을 확인하고 명시적으로 요청할 때만 생성합니다.

사용자가 PR을 요청하면 `tds-design-pr` 스킬을 실행합니다:

1. `.cursor/skills/tds-design-pr/SKILL.md` 절차에 따라 실행
2. PASS된 컴포넌트의 변경사항을 `design-sync` 브랜치에 커밋
3. 상세 PR 본문 생성 (스펙 기반 Before/After + Safety Checklist + Changed Files)
4. 사용자 PR 본문 확인 대기
5. 승인 시 `gh pr create`로 PR 생성
6. PR URL 반환

---

## 완료 리포트

모든 Phase 처리 후 최종 리포트를 출력합니다:

```markdown
## Batch Sync Report

### 처리 결과

| #   | 컴포넌트   | Extract | Apply | Evaluate | 최종 |
| --- | ---------- | ------- | ----- | -------- | ---- |
| 1   | Button     | ✅      | ✅    | ✅ PASS  | ✅   |
| 2   | Badge      | ✅      | ✅    | ⚠️ minor | ✅   |
| 3   | Checkbox   | ✅      | ✅    | ✅ PASS  | ✅   |
| 4   | DatePicker | ❌ SKIP | —     | —        | ❌   |

### 변경 파일 총 목록

- `src/components/Button/Button.styles.ts`
- `src/components/Badge/Badge.styles.ts`
- `src/components/Checkbox/Checkbox.styles.ts`

### SKIP된 컴포넌트

- DatePicker — Extract 실패 (파일 구조 불일치)

### Canvas 비교 페이지

[통합 비교 화면](canvas-link) — 시각적으로 확인해주세요.

### 다음 단계

디자인 확인 후 PR 요청해주세요.
```

## 진행 상황 표시

배치 실행 중 Phase별 진행 상황을 표시합니다:

```
[Phase 1] Extract: 10/10 완료 (1 SKIP)
  ✅ Button, Badge, Checkbox, Toggle, ...
  ❌ DatePicker (SKIP)

[Phase 2] Pre-flight 리포트 준비 완료 — 확인해주세요
(통합 Pre-flight 리포트 표시)

→ 사용자 확인 후

[Phase 2] Apply: 9/9 적용 완료
[Phase 3] Build: ✅ PASS (pnpm build + tsc)
[Phase 4] Evaluate: 8/9 PASS, 1 FAIL

[완료] 8/10 PASS — 디자인 확인 후 PR 요청해주세요
```

## 에러 처리: 컴포넌트 단위 격리

개별 컴포넌트 실패가 전체 배치를 중단하지 않습니다:

| Phase            | 실패 시                    | 조치                                    |
| ---------------- | -------------------------- | --------------------------------------- |
| Phase 1 Extract  | 서브에이전트 에러/타임아웃 | 해당 컴포넌트 SKIP, 나머지 진행         |
| Phase 2 Apply    | 파일 편집 에러             | `git checkout -- {files}`로 롤백, SKIP  |
| Phase 3 Build    | 빌드/타입 에러             | 이분법으로 원인 컴포넌트 특정 후 롤백   |
| Phase 4 Evaluate | major 불일치               | 해당 컴포넌트 커밋 제외, 나머지 PR 포함 |

## 배치 크기 권장

| 배치 크기         | 장점                           | 단점                    | 권장 상황                |
| ----------------- | ------------------------------ | ----------------------- | ------------------------ |
| 5개               | 리뷰 부담 적음, 실패 격리 쉬움 | 여전히 여러 번 반복     | 첫 실행, 복잡한 컴포넌트 |
| 10개 (Phase 단위) | component-map의 Phase와 일치   | Pre-flight 리뷰 양 많음 | 단순 컴포넌트 위주       |
| 전체              | 한번에 끝남                    | 실패 시 디버깅 어려움   | 충분히 안정화된 후       |

**권장**: `component-map.md`의 Phase 단위 (10개)로 실행.

## 개별 스킬 독립 실행

오케스트레이터 없이도 각 스킬을 독립 실행할 수 있습니다:

| 명령                            | 실행 스킬                    |
| ------------------------------- | ---------------------------- |
| "Button 디자인 추출해줘"        | tds-design-extract만         |
| "Button 디자인 적용해줘"        | tds-design-apply만           |
| "Button 디자인 검증해줘"        | tds-design-evaluate만        |
| "Button 디자인 싱크해줘"        | 오케스트레이터 (단일)        |
| "Button, Badge 디자인 싱크해줘" | 오케스트레이터 (배치)        |
| "Phase 1 싱크해줘"              | 오케스트레이터 (Phase 배치)  |
| "디자인 싱크 PR 만들어줘"       | tds-design-pr만              |
| "Button 노션 스토리 만들어줘"   | Step 2.5 Notion Story 생성만 |
