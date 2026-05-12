# TDS Page Sync

Figma 디자인에서 TDS 페이지를 자동 재현하는 전체 파이프라인 오케스트레이터입니다. 4단계 스킬을 순차적으로 실행하여 Figma URL 하나로 여러 페이지를 일괄 처리합니다.

## 트리거

- "페이지 싱크", "page sync", "Figma에서 페이지 만들어줘"
- "AI 플랫폼 페이지 재현해줘"
- Figma URL과 함께 페이지 구현 요청

## 입력

- **Figma URL**: 파일 URL 또는 특정 프레임 URL
- **범위** (선택): 전체 파일 / 특정 페이지만 / 특정 프레임 목록

## 출력

- **figma-page-map.md**: Figma-TDS 매핑 테이블
- **specs/pages/\*.md**: 페이지별 plan + spec
- **src/pages/ai-platform/\*.tsx**: 구현된 페이지 파일들
- **최종 리포트**: 전체 결과 요약

## 파일 구조

```
.cursor/skills/tds-page-sync/
├── SKILL.md                    # 이 파일 (오케스트레이터)
├── figma-page-map.md           # Figma-TDS 매핑 (자동 생성)
└── specs/pages/
    ├── {PageName}-plan.md      # 페이지별 계획서
    └── {PageName}-spec.md      # 페이지별 상세 스펙
```

## 파이프라인 실행 흐름

### Phase 0: Figma 크롤링 + 매핑

**스킬**: `tds-page-plan` (Step 1~6)

1. Figma URL에서 fileKey 추출
2. `get_metadata`로 파일 구조 크롤링
3. 프레임 목록을 TDS 라우트와 자동 매핑
4. `figma-page-map.md` 생성
5. **사용자에게 매핑 확인 요청** — 승인 전 진행하지 않음

**사용자 확인 형식**:

```
## Figma Page Map

{N}개 페이지가 발견되었습니다.

| # | Figma Frame | TDS Route | 기존 파일 | 상태 |
|---|---|---|---|---|
| 1 | Dashboard | /ai-platform | AIPlatformPage.tsx (기존) | pending |
| 2 | Workloads - List | /ai-platform/workloads | WorkloadsPage.tsx (기존) | pending |
| 3 | New Feature | /ai-platform/new-feature | (신규 생성) | pending |

매핑이 없는 프레임 {M}개: Icon Set, Color Guide, ...

▶ 전체 승인하시겠습니까? 수정이 필요하면 알려주세요.
```

### Phase 1: 기존 페이지 패턴 추출 + 계획서 생성 (병렬)

이 Phase에서 두 가지를 **서브에이전트로 동시에** 실행합니다:

#### 1-A. 기존 페이지 패턴 추출 (explore 서브에이전트)

동일 도메인·동일 유형의 기존 페이지 2~3개를 읽고 공통 패턴을 추출합니다.

```
Task(subagent_type="explore"):
  "동일 도메인 기존 페이지들의 contentClassName, TopBar.actions,
   PageHeader.actions Button props, Breadcrumb 패턴을 추출해줘"
```

추출 항목: contentClassName, TopBar actions, PageHeader Button (variant/size/leftIcon), Breadcrumb items, Table props, Pagination props, SearchInput/FilterSearchInput 선택, Toolbar 구조

#### 1-B. 계획서 생성 (메인 에이전트 또는 generalPurpose 서브에이전트)

**스킬**: `tds-page-plan` (Step 7~8)

승인된 각 페이지에 대해 계획서를 생성합니다.

- `get_design_context`로 레이아웃 구조 파악
- 사용할 TDS 컴포넌트 목록 작성
- 예상 작업량 산정

**실행 방식**: Figma API rate limit 고려하여 최대 3개 동시

> **핵심**: 1-A의 패턴 추출 결과는 Phase 3(구현)에서 모든 페이지에 적용됩니다. 이 단계를 건너뛰면 contentClassName, 버튼 아이콘, TopBar 등에서 기존 페이지와 불일치가 발생합니다.

### Phase 2: 디자인 정밀 추출

**스킬**: `tds-page-extract`

각 페이지의 상세 디자인을 정밀 추출합니다.

- 컴포넌트, 패딩, 정렬, 색상, 타이포그래피
- 테이블 컬럼 상세
- 상태별 화면 (Empty, Error)
- 스크린샷 참조

**실행 방식**: 순차 (Figma API 호출 간격 유지)

### Phase 3: 페이지 구현 (서브에이전트 병렬)

**스킬**: `tds-page-apply`

스펙을 기반으로 실제 코드를 생성합니다. **페이지가 2개 이상이면 서브에이전트로 병렬 구현합니다.**

#### 병렬 구현 전략

```
메인 에이전트:
  1. Phase 1-A의 패턴 추출 결과를 정리
  2. 각 페이지 서브에이전트에 공통 컨텍스트로 전달
  3. 서브에이전트 결과 수집 후 App.tsx 라우트 일괄 등록

서브에이전트 (generalPurpose) x N:
  각각 1개 페이지를 독립적으로 구현
  - 스펙 파일 읽기
  - 패턴 컨텍스트 적용 (contentClassName, TopBar, Button 등)
  - TDS 컴포넌트로 코드 생성
  - 목 데이터 생성
  - 빌드 검증 (TypeScript + ESLint)
```

#### 서브에이전트 프롬프트에 필수 포함 사항

서브에이전트에 전달하는 프롬프트에 반드시 다음을 포함합니다:

```markdown
## 기존 페이지 패턴 (반드시 준수)

- contentClassName: "{Phase 1-A 결과}"
- TopBar actions: {Phase 1-A 결과}
- PageHeader Button: variant="{}", size="{}", leftIcon={없음|있음}
- PageHeader gap: {gap 값}
- Breadcrumb: {패턴}
```

#### 병렬 제약 조건

- **최대 동시 서브에이전트**: 4개
- **App.tsx 수정**: 서브에이전트가 하지 않음 → 메인 에이전트가 모든 페이지 완료 후 일괄 등록
- **공유 컴포넌트 수정**: 서브에이전트가 DS 컴포넌트를 수정하면 안 됨 → 메인 에이전트만 수정

#### 단일 페이지일 때

페이지가 1개면 서브에이전트 없이 메인 에이전트가 직접 구현합니다.

### Phase 4: 품질 검증

**스킬**: `tds-page-evaluate`

구현된 페이지의 품질을 검증합니다.

- 빌드 검증 (타입 체크, import)
- TDS 규칙 준수 검사
- 스펙 일치도 확인
- 시각적 비교 (브라우저 스크린샷 vs Figma)

**실행 방식**: 순차 (브라우저 공유)

**FAIL 시 처리**:

1. 자동 수정 가능 → 수정 후 재검증 (최대 2회)
2. 자동 수정 불가 → 이슈 목록을 리포트에 기록, 다음 페이지로 진행

### Phase 5: 최종 리포트

모든 페이지 처리 후 최종 리포트를 출력합니다.

```markdown
## TDS Page Sync Report

> Figma File: {fileKey}
> Generated: {timestamp}
> Total pages: {N}

### Results

| #   | Page      | Type | Phase    | Result          | Issues           |
| --- | --------- | ---- | -------- | --------------- | ---------------- |
| 1   | Dashboard | Main | Evaluate | ✅ PASS         | —                |
| 2   | Workloads | List | Evaluate | ✅ PASS (Minor) | gap-4 → gap-3    |
| 3   | Models    | List | Evaluate | ❌ FAIL         | 테이블 컬럼 누락 |
| 4   | Settings  | Main | Apply    | ⏸️ Skipped      | 사용자 제외      |

### Summary

- ✅ PASS: {n} pages
- ⚠️ PASS (Minor): {n} pages
- ❌ FAIL: {n} pages
- ⏸️ Skipped: {n} pages

### Failed Pages — Action Required

1. **Models** (FAIL)
   - Issue: 테이블 컬럼 "Framework" 누락
   - Suggested fix: columns 배열에 Framework 컬럼 추가
   - File: src/pages/ai-platform/ModelsPage.tsx:45

### Files Changed

- Modified: src/pages/ai-platform/WorkloadsPage.tsx
- Created: src/pages/ai-platform/NewFeaturePage.tsx
- Modified: src/App.tsx (route added)

### Next Steps

- FAIL 페이지 수동 수정 후 `tds-page-evaluate` 재실행
- 커밋: `[feat] Reproduce AI Platform pages from Figma`
```

## 실행 모드

### 전체 파이프라인 (기본)

```
사용자: "이 Figma로 AI 플랫폼 페이지 만들어줘" + Figma URL

→ Phase 0~5 순차 실행
```

### 단일 페이지

```
사용자: "이 프레임으로 Workloads 페이지 만들어줘" + 프레임 URL

→ Phase 0 스킵 (URL에서 직접 매핑)
→ Phase 1~4 해당 페이지만 실행
```

### 특정 Phase만

```
사용자: "Workloads 페이지 스펙만 추출해줘"
→ tds-page-extract만 실행

사용자: "Models 페이지 검증해줘"
→ tds-page-evaluate만 실행
```

### 재실행 (실패 페이지)

```
사용자: "실패한 페이지 다시 해줘"

→ figma-page-map.md에서 status=fail인 페이지만 Phase 2~4 재실행
```

## figma-page-map.md 상태 관리

파이프라인 진행에 따라 각 페이지의 Status를 업데이트합니다:

| Status       | 의미                       |
| ------------ | -------------------------- |
| `pending`    | 아직 처리 시작 안 함       |
| `planned`    | Phase 1 완료 (plan 생성)   |
| `extracted`  | Phase 2 완료 (spec 생성)   |
| `applied`    | Phase 3 완료 (코드 생성)   |
| `pass`       | Phase 4 통과               |
| `pass-minor` | Phase 4 통과 (경미한 이슈) |
| `fail`       | Phase 4 실패               |
| `skipped`    | 사용자가 제외              |

## 에러 처리

| 에러               | 처리                                          |
| ------------------ | --------------------------------------------- |
| Figma API 실패     | 3회 재시도 후 해당 페이지 skip, 리포트에 기록 |
| 빌드 에러          | 자동 수정 시도 → 실패 시 fail 기록            |
| 브라우저 접속 불가 | 시각적 비교 skip, 나머지 검증만 수행          |
| 매핑 실패          | Unmapped Frames에 기록, 사용자 확인 요청      |

## 관련 스킬

| 스킬                | 역할                       | 호출 Phase |
| ------------------- | -------------------------- | ---------- |
| `tds-page-plan`     | Figma 크롤링 + 매핑 + 계획 | Phase 0, 1 |
| `tds-page-extract`  | 디자인 정밀 추출           | Phase 2    |
| `tds-page-apply`    | TDS 컴포넌트로 구현        | Phase 3    |
| `tds-page-evaluate` | 시각/기능 품질 검증        | Phase 4    |

## 서브에이전트 활용 가이드

### 언제 서브에이전트를 쓰는가

| 조건                     | 서브에이전트                  | 메인 에이전트 직접 |
| ------------------------ | ----------------------------- | ------------------ |
| 구현할 페이지 ≥ 2개      | generalPurpose 병렬 (Phase 3) | —                  |
| 기존 패턴 추출 필요      | explore (Phase 1-A)           | —                  |
| 구현 페이지 1개          | —                             | 직접 구현          |
| App.tsx/DS 컴포넌트 수정 | —                             | 메인만 수정        |

### 서브에이전트 타입별 용도

| 타입             | 용도                             | Phase  |
| ---------------- | -------------------------------- | ------ |
| `explore`        | 기존 페이지 패턴 추출 (readonly) | 1-A    |
| `generalPurpose` | 개별 페이지 코드 구현            | 3      |
| `shell`          | 커밋/푸시/PR 생성 자동화         | 후처리 |

### 서브에이전트 프롬프트 템플릿

**Phase 1-A (explore)**:

```
src/pages/ai-platform/ 아래에서 {도메인} 관련 기존 페이지 파일을 분석해줘.

분석 대상 파일: {비슷한 기존 페이지 2~3개}

각 파일에서 다음을 추출:
1. PageShell contentClassName 값
2. TopBar actions에 어떤 아이콘이 있는지
3. PageHeader actions 버튼의 variant, size, leftIcon 유무
4. PageHeader의 HStack gap 값
5. Breadcrumb items 패턴
6. Table에 selectable 등 주요 props
7. Pagination 사용 여부 및 props
8. SearchInput vs FilterSearchInput 중 무엇을 사용하는지
```

**Phase 3 (generalPurpose)**:

```
다음 스펙 파일을 기반으로 TDS 페이지를 구현해줘.

스펙 파일: {경로}
출력 파일: {경로}

## 기존 페이지 패턴 (반드시 준수)
{Phase 1-A 결과 붙여넣기}

## 구현 규칙
1. TDS 디자인 시스템 규칙 파일 참조: .cursor/rules/tds-design-system.mdc
2. 기존 패턴과 Figma가 다르면 기존 패턴을 따름
3. App.tsx 수정하지 않음 (메인 에이전트가 일괄 처리)
4. DS 공통 컴포넌트 수정하지 않음
5. TypeScript 에러 없어야 함
```

## 주의사항

- Phase 0 후 **반드시** 사용자 승인을 받아야 후속 Phase 진행
- Figma API 호출은 rate limit 고려하여 간격 유지 (순차 처리 권장)
- 한 번에 처리하는 페이지가 많으면 (10개+) Phase별로 중간 리포트 출력
- App.tsx 라우트 수정은 모든 페이지 apply 후 한 번에 처리 (충돌 방지)
- 서브에이전트가 DS 컴포넌트를 수정하면 안 됨 — 메인 에이전트만 수정
- 커밋은 자동으로 하지 않음 — 사용자가 결과 확인 후 직접 커밋 요청
