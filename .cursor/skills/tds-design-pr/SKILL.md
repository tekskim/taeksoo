# TDS Design PR

디자인 싱크 완료 후 thaki-shared 저장소에 **FE 개발자가 리뷰할 수 있는 상세 PR**을 자동 생성하는 스킬입니다.

## 트리거

- "PR 만들어줘", "PR 생성", "create PR", "디자인 싱크 PR"
- 오케스트레이터(`tds-design-sync`)에서 Evaluate PASS 후 자동 제안

## 입력

- **디자인 스펙**: `.cursor/skills/tds-design-sync/specs/{ComponentName}.md` (Extract 출력)
- **Evaluate 리포트**: Evaluate 스킬의 최종 판정 결과
- **git log / diff**: `thaki-shared` 저장소의 `design-sync` 브랜치 변경 내역

## 전제 조건

- Evaluate 결과가 **PASS**인 컴포넌트만 PR 대상
- FAIL 상태에서는 PR 생성을 거부하고, 먼저 문제 해결을 안내

## 브랜치 전략

**고정 브랜치 `design-sync`**를 사용합니다.

- 브랜치명은 항상 `design-sync` (고정)
- 최초 싱크 시 `main`에서 브랜치 생성, 이후에는 동일 브랜치에 커밋 누적
- 컴포넌트를 싱크할 때마다 개별 커밋 추가 (git log에서 추적 용이)
- PR은 원하는 시점에 생성 (1개 컴포넌트 후든, 10개 후든 자유)
- PR 머지 후 `design-sync` 브랜치 삭제 → 다음 싱크 시 main 최신 기준으로 재생성

```
main ──●──●──●──●──●──●──────────────────── (머지) ──●──
        \                                    /          \
         design-sync ──A──B──C──D──E── (PR) ─┘           design-sync ──F──G── ...
                       │  │  │  │  │
                  CopyBtn Badge Chip Toggle Input
```

## 동작 절차

### Step 1: 입력 수집

1. **커밋 목록 확인**:

   ```bash
   cd /path/to/thaki-shared && git log main..design-sync --oneline
   ```

   → 포함된 컴포넌트 목록 자동 추출 (커밋 메시지에서 컴포넌트명 파싱)

2. **스펙 파일 읽기**: 각 컴포넌트의 `specs/{ComponentName}.md`에서 "주요 디자인 차이" 섹션 추출

3. **전체 diff 수집**:

   ```bash
   cd /path/to/thaki-shared && git diff main..design-sync --stat
   cd /path/to/thaki-shared && git diff main..design-sync
   ```

4. **Evaluate 리포트 참조**: 이전 대화에서 출력된 Evaluate Report의 판정 결과, 시각적 비교 결과, Safety 검증 결과

### Step 2: 빌드 재확인

PR 생성 직전 빌드 무결성을 한번 더 검증합니다:

```bash
cd /path/to/thaki-shared && git checkout design-sync
cd /path/to/thaki-shared && npx tsc --noEmit
cd /path/to/thaki-shared && pnpm build
```

- 둘 다 성공해야 다음 단계 진행
- 실패 시 원인 파악 → 수정 → 재검증 (Apply 스킬의 Safety Guard 절차 준용)

### Step 3: 브랜치 확인/생성

```bash
cd /path/to/thaki-shared

# design-sync 브랜치가 이미 있으면 checkout
git checkout design-sync 2>/dev/null || git checkout -b design-sync
```

- 브랜치가 **없으면**: `main` 최신에서 `design-sync` 생성
- 브랜치가 **있으면**: 그대로 checkout (기존 커밋 유지)

### Step 4: 커밋

싱크 완료된 컴포넌트의 변경사항을 커밋합니다.
**항상 컴포넌트별 개별 커밋**으로 기록합니다.

```bash
cd /path/to/thaki-shared && git add src/components/{Name}/ && git commit -m "$(cat <<'EOF'
style({Component}): sync design with TDS

EOF
)"
```

토큰 파일이 변경된 경우 별도 커밋:

```bash
git add tokens/ tailwind.preset.js && git commit -m "$(cat <<'EOF'
style(tokens): update design token values for TDS sync

EOF
)"
```

### Step 5: PR 본문 생성

아래 템플릿에 따라 PR 본문을 조립합니다. **모든 섹션은 필수**입니다.
`git log main..design-sync`의 커밋 목록에서 포함된 컴포넌트를 자동 파악합니다.

**언어 규칙**: PR 본문은 반드시 **한국어**로 작성합니다. 섹션 헤더(Summary, Design Sync Details 등)와 테이블 컬럼명은 템플릿 원문(영어) 유지, 설명/비고/항목명은 한국어로 작성합니다.

---

#### PR 본문 템플릿

````markdown
## Summary

- {Component1}, {Component2}, ... 컴포넌트의 디자인을 TDS(THAKI Design System)에 맞춰 싱크
- 로직/이벤트/상태 관리 변경 없이 **스타일만 변경**

## Design Sync Details

### {ComponentName1}

**스펙 출처**: `tds/src/design-system/components/{ComponentName1}/`

#### 주요 변경점

| #   | 항목            | Before (thaki-shared) | After (TDS 기준) |
| --- | --------------- | --------------------- | ---------------- |
| 1   | {차이점 1 항목} | `{이전 값}`           | `{변경 값}`      |
| 2   | {차이점 2 항목} | `{이전 값}`           | `{변경 값}`      |

> 위 테이블은 디자인 스펙(`specs/{ComponentName}.md`)의 "주요 디자인 차이"에서 추출합니다.

#### 변경 코드 요약

```diff
// 실제 git diff에서 핵심 변경 부분만 발췌
- 이전 코드
+ 변경된 코드
```

#### Safety Checklist

| 항목                      | 결과 | 비고                                                 |
| ------------------------- | ---- | ---------------------------------------------------- |
| `.tsx` 로직 미변경        | ✅   | useState, useEffect, 이벤트 핸들러 등 변경 없음      |
| `.tsx` 허용된 변경만 포함 | ✅   | 조건부 스타일 클래스 / 인라인 SVG 디자인 속성만 변경 |
| props 타입 미변경         | ✅   | `.types.ts` 변경 없음                                |
| 토큰 이름 미변경          | ✅   | JSON key 변경 없음 (값만 변경)                       |
| 렌더 구조 미변경          | ✅   | JSX 트리 구조, 조건부 렌더링 변경 없음               |

### {ComponentName2}

(위와 동일 형식 반복: 주요 변경점 → 변경 코드 요약 → Safety Checklist)

---

## Commits

| #   | Commit                                            | Component  |
| --- | ------------------------------------------------- | ---------- |
| 1   | `abc1234` style(CopyButton): sync design with TDS | CopyButton |
| 2   | `def5678` style(Badge): sync design with TDS      | Badge      |

> `git log main..design-sync --oneline`에서 자동 추출

## Changed Files

| Category                | Files                                    |
| ----------------------- | ---------------------------------------- |
| Styles                  | `src/components/{Name}/{Name}.styles.ts` |
| Component (design only) | `src/components/{Name}/{Name}.tsx`       |
| Tokens                  | `tokens/light.json`, `tokens/dark.json`  |
| Generated               | `tailwind.preset.js`                     |

> 카테고리별로 변경된 파일만 나열합니다. 변경 없는 카테고리는 생략.

## API Changes Required

> 디자인 싱크 범위(스타일만 변경)로 해결되지 않는 차이입니다.
> 개발팀에서 별도 작업이 필요합니다.

### {ComponentName} — {변경 제목}

- **현상**: {TDS와 thaki-shared의 시각적/동작 차이 설명}
- **필요 작업**: {구체적인 코드 변경 내용}
- **영향 범위**: {변경 시 영향을 받는 사용처}
- **참조**: {TDS 코드 위치}

> 이 섹션은 Extract 스펙에서 `api-required`로 분류된 항목만 포함합니다.
> API 변경이 없는 경우 이 섹션을 생략합니다.

## Review Guide

이 PR은 디자인 싱크 전용이므로 아래 사항을 중점 리뷰해주세요:

1. **Tailwind 클래스 변경이 의도한 시각적 결과를 만드는지** — Storybook에서 확인
2. **`.tsx` 변경이 순수 디자인 변경인지** — 로직/구조 변경이 섞이지 않았는지
3. **토큰 값 변경이 다른 컴포넌트에 영향을 주는지** — 토큰의 사용처 확인
````

> **Note**: Test plan은 PR 본문에 포함하지 않고, 사용자에게 별도로 제시합니다.

---

### Step 6: 사용자 확인

PR 본문 전체를 사용자에게 보여주고 승인을 기다립니다:

- "확인" / "진행" → Step 7로
- 수정 요청 → 본문 수정 후 재확인
- "취소" → 중단

### Step 7: PR 생성

```bash
cd /path/to/thaki-shared && git push -u origin design-sync
cd /path/to/thaki-shared && gh pr create --title "{title}" --body "$(cat <<'EOF'
{PR 본문}
EOF
)"
```

**기존 PR이 있는 경우 (동일 `design-sync` 브랜치)**:

```bash
# push만 실행 (PR은 이미 존재)
cd /path/to/thaki-shared && git push -u origin design-sync --force-with-lease

# PR 타이틀/본문 업데이트 — gh api 사용 (gh pr edit는 GraphQL 경고로 실패할 수 있음)
cd /path/to/thaki-shared && gh api repos/{owner}/{repo}/pulls/{pr_number} -X PATCH \
  -f title="{new title}" \
  -f body="$(cat <<'EOF'
{updated PR body}
EOF
)"
```

> ⚠️ `gh pr edit`는 "Projects (classic) is being deprecated" GraphQL 경고로 실패할 수 있습니다. `gh api` REST 호출을 사용하세요.

**PR 타이틀 규칙**:

- 컴포넌트 1개: `style({Component}): sync design with TDS`
- 컴포넌트 2-4개: `style(design-sync): sync {Component1}, {Component2}, ... with TDS`
- 컴포넌트 5개+: `style(design-sync): sync {N} components with TDS`

**라벨**: `design-sync` 라벨이 존재하면 `--label design-sync` 추가. 없으면 생략.

**리뷰어**: 사용자에게 "리뷰어를 지정할까요?" 확인 후, 지정 시 `--reviewer {username}` 추가.

### Step 8: 완료

- PR URL을 사용자에게 반환
- 오케스트레이터 실행 중이면 전체 완료 리포트에 PR URL 포함

### Step 8.5: Notion Story에 PR URL 업데이트

PR 생성 후, 오케스트레이터 Step 2.5에서 생성한 Notion Story 페이지에 PR 링크를 추가합니다.

#### 대상 페이지 찾기

`notion-search`로 해당 컴포넌트의 Story 페이지를 검색합니다:

```
notion-search:
  query: "[Story] {카테고리} - {label}"
  data_source_url: "collection://3039eddc-34e6-80a3-a1d7-000b8cd1325d"
  filters: {}
  page_size: 3
```

검색 결과에서 page_id를 추출합니다.

#### 속성 업데이트

`notion-update-page`로 `디자인_Status`를 업데이트합니다:

```
notion-update-page:
  page_id: "{찾은 page_id}"
  command: "update_properties"
  properties:
    디자인_Status: "In Progress"
```

> ⚠️ **주의**: `프론트엔드_Status`가 아닌 `디자인_Status`를 사용합니다. 디자인 싱크는 디자인 작업이므로 디자인 상태를 업데이트합니다.

#### 내용 업데이트

`notion-update-page`로 `## PR` 섹션의 내용을 실제 PR URL로 교체합니다:

```
notion-update-page:
  page_id: "{찾은 page_id}"
  command: "update_content"
  content_updates:
    - old_str: "## PR\n- (싱크 완료 후 업데이트 예정)"
      new_str: "## PR\n- {PR URL}"
```

#### 배치 모드

여러 컴포넌트를 한 PR에 포함한 경우, 모든 관련 Story 페이지에 동일한 PR URL을 업데이트합니다.

#### Guard

사용자에게 "Notion Story에 PR URL을 업데이트할까요?" 확인 후 실행.

### Step 9: 머지 후 정리

PR이 머지되면:

```bash
cd /path/to/thaki-shared && git checkout main && git pull
cd /path/to/thaki-shared && git branch -d design-sync
```

다음 싱크 시 Step 3에서 `design-sync` 브랜치가 새로 생성됩니다 (main 최신 기준).

## Safety Guards

### Guard 1: Evaluate PASS 필수

Evaluate 결과가 PASS가 아닌 컴포넌트는 PR에 포함하지 않습니다.

- 일부만 PASS인 경우: PASS 컴포넌트만 커밋된 상태에서 PR 생성
- 전체 FAIL인 경우: PR 생성 거부

### Guard 2: 빌드 재확인

Step 2에서 빌드가 실패하면 PR을 생성하지 않습니다.

### Guard 3: 사용자 확인 필수

PR 본문을 반드시 사용자에게 보여주고 승인을 받습니다. 자동으로 PR을 생성하지 않습니다.

### Guard 4: main 직접 푸시 금지

반드시 `design-sync` 브랜치에서 PR을 통해 머지합니다. main에 직접 커밋/푸시하지 않습니다.

### Guard 5: 사용자 명시적 push 승인 필수

`git push` 및 `gh pr create/edit` 실행 전에 반드시 사용자에게 "push 해도 될까요?" 또는 "PR 생성/업데이트 해도 될까요?"를 확인합니다. 사용자가 "don't push unless I tell you"라고 한 경우 로컬 커밋까지만 진행하고 push는 대기합니다.

## 본문 작성 규칙

1. **Before/After 테이블은 스펙 기반**: `specs/{ComponentName}.md`의 "주요 디자인 차이" 항목을 **빠짐없이** 나열
2. **diff는 핵심만 발췌**: 전체 diff가 아닌 리뷰어가 판단에 필요한 핵심 변경만 포함
3. **Safety Checklist는 Evaluate 결과 반영**: Evaluate 리포트의 금지 변경 검증 결과를 그대로 반영
4. **Changed Files는 git diff 기반**: `git diff main..design-sync --name-only`에서 자동 추출
5. **Commits 테이블은 git log 기반**: `git log main..design-sync --oneline`에서 자동 추출

## 출력

- `thaki-shared` 저장소에 PR 생성
- PR URL 반환
