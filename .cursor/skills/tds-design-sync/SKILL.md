# TDS Design Sync (Orchestrator)

TDS 디자인을 thaki-shared 컴포넌트에 반영하는 전체 파이프라인을 자동 실행하는 오케스트레이터 스킬입니다.
단일 컴포넌트 또는 배치 모드(복수 컴포넌트)를 지원합니다.

## 트리거

- "디자인 싱크", "design sync", "싱크해줘", "배치 싱크"
- 컴포넌트명과 함께: "Button 싱크해줘", "Button, Badge, Chip 디자인 싱크해줘"

## 입력

- **컴포넌트명**: 1개 또는 콤마 구분 리스트
- 예: `"Button"` 또는 `"Button, Badge, Chip, StatusIndicator"`

## 참조 파일

- `component-map.md`: 이 폴더 내 TDS ↔ thaki-shared 매핑
- `token-map.md`: 이 폴더 내 토큰 네이밍 매핑
- `specs/`: 추출된 디자인 스펙 저장 위치

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

### Step 3: 컴포넌트별 순차 실행

각 컴포넌트에 대해 3단계를 순차 실행합니다:

#### (a) Extract — tds-design-extract 스킬 절차 실행

1. `.cursor/skills/tds-design-extract/SKILL.md` 절차에 따라 실행
2. TDS 컴포넌트의 디자인 스펙 추출
3. `specs/{ComponentName}.md` 생성
4. 추출 완료 알림 (자동 진행)

#### (b) Apply — tds-design-apply 스킬 절차 실행

1. `.cursor/skills/tds-design-apply/SKILL.md` 절차에 따라 실행
2. Pre-flight 리포트 생성
3. **사용자 확인 대기** ← 유일한 수동 개입 포인트
4. 승인 시 적용 실행

#### (c) Evaluate — tds-design-evaluate 스킬 절차 실행

1. `.cursor/skills/tds-design-evaluate/SKILL.md` 절차에 따라 실행
2. 시각적 비교 Canvas 생성
3. 금지 변경 검증
4. 기능 검증 (빌드, 타입 체크)
5. 평가 리포트 출력

#### (d) PR — tds-design-pr 스킬 절차 실행 (배치 완료 후)

> 개별 컴포넌트마다 실행하지 않고, **모든 컴포넌트 처리 완료 후 한번만** 실행합니다.
> Step 5 완료 리포트 출력 후 사용자에게 "PR 생성할까요?" 확인 → 승인 시 실행.

1. `.cursor/skills/tds-design-pr/SKILL.md` 절차에 따라 실행
2. PASS된 컴포넌트의 변경사항을 브랜치로 커밋
3. 상세 PR 본문 생성 (스펙 기반 Before/After + Safety Checklist + Changed Files)
4. 사용자 PR 본문 확인 대기
5. `gh pr create`로 PR 생성
6. PR URL 반환

### Step 4: 결과 처리

#### PASS인 경우

- 다음 컴포넌트로 자동 진행
- 진행 상황 표시: `[2/5] Badge 시작...`

#### FAIL인 경우

사용자에게 선택지 제시:

1. **수정 후 재시도**: 문제 수정 → Evaluate 재실행
2. **건너뛰기**: 해당 컴포넌트 SKIP 처리 → 다음으로
3. **중단**: 전체 배치 중단

### Step 5: 전체 완료 리포트

모든 컴포넌트 처리 후:

```markdown
## Batch Sync Report

### 처리 결과

| #   | 컴포넌트        | 결과    | 비고                           |
| --- | --------------- | ------- | ------------------------------ |
| 1   | Button          | ✅ PASS |                                |
| 2   | Badge           | ✅ PASS |                                |
| 3   | Chip            | ⏭️ SKIP | 시각적 불일치 — 수동 조정 필요 |
| 4   | StatusIndicator | ✅ PASS |                                |

### 변경 파일 총 목록

- `src/components/Button/Button.styles.ts`
- `src/components/Badge/Badge.styles.ts`
- `src/components/StatusIndicator/StatusIndicator.styles.ts`
- `tokens/light.json` (3개 토큰 값 변경)

### 다음 단계

- SKIP된 컴포넌트: Chip — 수동 확인 후 개별 싱크 필요

### PR 생성

→ PR 생성할까요? (확인 시 tds-design-pr 스킬 실행)
→ PR URL: https://github.com/ThakiCloud/thaki-shared/pull/XX
```

## 진행 상황 표시

배치 실행 중 진행 상황을 지속적으로 알립니다:

```
[1/4] Button — Extract 진행 중...
[1/4] Button — Extract 완료. Apply Pre-flight 리포트:
(Pre-flight 리포트 표시)
→ 확인해주세요.

(사용자 확인 후)
[1/4] Button — Apply 완료. Evaluate 진행 중...
[1/4] Button — ✅ PASS

[2/4] Badge — Extract 진행 중...
...
```

## 개별 스킬 독립 실행

오케스트레이터 없이도 각 스킬을 독립 실행할 수 있습니다:

| 명령                            | 실행 스킬                    |
| ------------------------------- | ---------------------------- |
| "Button 디자인 추출해줘"        | tds-design-extract만         |
| "Button 디자인 적용해줘"        | tds-design-apply만           |
| "Button 디자인 검증해줘"        | tds-design-evaluate만        |
| "Button 디자인 싱크해줘"        | 오케스트레이터 (전체)        |
| "Button, Badge 디자인 싱크해줘" | 오케스트레이터 (배치)        |
| "디자인 싱크 PR 만들어줘"       | tds-design-pr만              |
| "Button 노션 스토리 만들어줘"   | Step 2.5 Notion Story 생성만 |
