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

### Phase 1: 계획서 생성

**스킬**: `tds-page-plan` (Step 7~8)

승인된 각 페이지에 대해 계획서를 생성합니다.

- `get_design_context`로 레이아웃 구조 파악
- 사용할 TDS 컴포넌트 목록 작성
- 예상 작업량 산정

**실행 방식**: 병렬 가능 (단, Figma API rate limit 고려하여 최대 3개 동시)

### Phase 2: 디자인 정밀 추출

**스킬**: `tds-page-extract`

각 페이지의 상세 디자인을 정밀 추출합니다.

- 컴포넌트, 패딩, 정렬, 색상, 타이포그래피
- 테이블 컬럼 상세
- 상태별 화면 (Empty, Error)
- 스크린샷 참조

**실행 방식**: 순차 (Figma API 호출 간격 유지)

### Phase 3: 페이지 구현

**스킬**: `tds-page-apply`

스펙을 기반으로 실제 코드를 생성합니다.

- TDS 컴포넌트로 페이지 코드 작성
- 목 데이터 생성
- 라우트 등록 (신규 페이지)
- 기본 빌드 검증

**실행 방식**: 순차 (파일 충돌 방지, App.tsx 동시 수정 방지)

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

## 주의사항

- Phase 0 후 **반드시** 사용자 승인을 받아야 후속 Phase 진행
- Figma API 호출은 rate limit 고려하여 간격 유지 (순차 처리 권장)
- 한 번에 처리하는 페이지가 많으면 (10개+) Phase별로 중간 리포트 출력
- App.tsx 라우트 수정은 모든 페이지 apply 후 한 번에 처리 (충돌 방지)
- 커밋은 자동으로 하지 않음 — 사용자가 결과 확인 후 직접 커밋 요청
