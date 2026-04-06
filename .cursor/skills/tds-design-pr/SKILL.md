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

**고정 브랜치 `design-sync`**에 커밋을 누적하고, PR 요청 시 컴포넌트 수에 따라 분할합니다.

- 브랜치명은 항상 `design-sync` (고정) — 작업용 누적 브랜치
- 최초 싱크 시 `dev`에서 브랜치 생성, 이후에는 동일 브랜치에 커밋 누적
- 컴포넌트를 싱크할 때마다 개별 커밋 추가 (git log에서 추적 용이)
- `design-sync` 브랜치는 모든 싱크 작업이 완료될 때까지 유지 (배치 머지와 무관)

### PR 분할 정책

- **6개 이하**: design-sync → dev **단일 PR** (배치 분할 없음)
- **7개 이상**: file-checkout 배치 브랜치로 분할 (**PR당 최대 5개**)
- 배치 브랜치명: `ds-batch-{N}` (예: `ds-batch-1`, `ds-batch-2`, ...)
- 관련 토큰/공유 파일은 첫 번째 배치에 포함

### 배치 생성 절차 (file-checkout 방식)

cherry-pick이 아닌 **file-checkout**으로 배치 브랜치를 생성합니다.
design-sync의 **최신 파일 상태**를 항상 가져오므로 후속 수정이 누락되지 않습니다.

```bash
# 1. dev 최신화
git checkout dev && git pull

# 2. design-sync에서 dev로 아직 안 간 변경 확인
git diff dev..design-sync --name-only

# 3. 배치 브랜치 생성 + file-checkout (컴포넌트 단위)
git checkout -b ds-batch-1 dev
git checkout design-sync -- src/components/Button/ src/components/DatePicker/ src/components/Pagination/
# 토큰/공유 파일이 변경된 경우 함께 포함
git checkout design-sync -- tokens/ tailwind.preset.js src/styles/
git add . && git commit -m "style(design-sync): batch 1 — Button, DatePicker, Pagination"
git push -u origin ds-batch-1
```

**cherry-pick 대비 장점**:

- design-sync의 **최신 파일 상태**를 항상 가져오므로 후속 수정 누락 없음
- cherry-pick 충돌 없음
- 배치 브랜치는 PR 직전에 만들고, 머지 후 삭제 (일회용)

```
design-sync ──A──B──C──D──(후속수정)──E──F──
                                       ↓ file-checkout (항상 최신)
dev ──●──●──●── (batch-1 머지) ── (batch-2 머지) ──●──
        \              /                  /
         ds-batch-1 ──[Button,DatePicker,Pagination]
         ds-batch-2 ──[Breadcrumb,FrameControls,TopBar]
```

## 동작 절차

### Step 1: 입력 수집

1. **커밋 목록 확인**:

   ```bash
   cd /path/to/thaki-shared && git log dev..design-sync --oneline
   ```

   → 포함된 컴포넌트 목록 자동 추출 (커밋 메시지에서 컴포넌트명 파싱)

2. **스펙 파일 읽기**: 각 컴포넌트의 `specs/{ComponentName}.md`에서 "주요 디자인 차이" 섹션 추출

3. **전체 diff 수집**:

   ```bash
   cd /path/to/thaki-shared && git diff dev..design-sync --stat
   cd /path/to/thaki-shared && git diff dev..design-sync
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

- 브랜치가 **없으면**: `dev` 최신에서 `design-sync` 생성
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

### Step 4.5: 배치 분할 (file-checkout 방식)

커밋 후, design-sync에서 dev로 아직 반영되지 않은 컴포넌트를 확인하고 분할 여부를 결정합니다.

```bash
# 미반영 파일 확인
cd /Users/pobae/thaki-shared && git diff dev..design-sync --name-only
```

1. 변경된 파일에서 컴포넌트 목록 추출
2. **6개 이하**면 design-sync → dev 직접 PR → Step 5A
3. **7개 이상**이면 5개씩 분할하여 배치 브랜치 생성:

```bash
git checkout dev && git pull
git checkout -b ds-batch-1 dev
# design-sync에서 해당 컴포넌트 파일을 직접 복사 (항상 최신 상태)
git checkout design-sync -- src/components/Button/ src/components/DatePicker/ src/components/Pagination/
# 토큰/공유 파일 변경이 있으면 첫 배치에 포함
git checkout design-sync -- tokens/ tailwind.preset.js src/styles/
git add . && git commit -m "style(design-sync): batch 1 — Button, DatePicker, Pagination"
git push -u origin ds-batch-1
# 다음 배치 반복...
```

4. 각 배치별로 Step 5A 실행 (배치당 1개 PR 생성)
5. 배치 브랜치는 머지 후 삭제 (일회용)

### Step 5A: PR 본문 생성 — CREATE 모드

열려 있는 PR이 없을 때, **현재 싱크한 컴포넌트(들)만으로** 전체 PR 본문을 새로 작성합니다.

**언어 규칙**: PR 본문은 반드시 **한국어**로 작성합니다. 섹션 헤더(Summary, Design Sync Details 등)와 테이블 컬럼명은 템플릿 원문(영어) 유지, 설명/비고/항목명은 한국어로 작성합니다.

---

#### PR 본문 템플릿

````markdown
## Summary

- {Component1}, {Component2}, ... 컴포넌트의 디자인을 TDS(THAKI Design System)에 맞춰 싱크
- 로직/이벤트/상태 관리 변경 없이 **스타일만 변경**
- {API 변경이 있는 컴포넌트가 있으면 한 줄로 요약: 예) "NumberInput: size `sm` deprecated (`md` 고정), 아이콘 Tabler로 교체"}

## Design Sync Details

### {ComponentName1}

**스펙 출처**: `tds/src/design-system/components/{ComponentName1}/`

#### 주요 변경점

| #   | 항목            | Before (thaki-shared) | After (TDS 기준) |
| --- | --------------- | --------------------- | ---------------- |
| 1   | {차이점 1 항목} | `{이전 값}`           | `{변경 값}`      |
| 2   | {차이점 2 항목} | `{이전 값}`           | `{변경 값}`      |

> 위 테이블은 디자인 스펙(`specs/{ComponentName}.md`)의 "주요 디자인 차이"에서 **빠짐없이** 추출합니다.
> API 변경이 있으면 별도 테이블로 분리합니다 (예: "주요 변경점 — API").

#### 변경 코드 요약

```diff
// 실제 git diff에서 핵심 변경 부분만 발췌
// 파일명과 변경 의도를 주석으로 표시
// {Name}.styles.ts — {변경 요약}
- 이전 코드
+ 변경된 코드

// {Name}.tsx — {변경 요약}
- 이전 코드
+ 변경된 코드
```

> **필수**: `.styles.ts`만 변경된 경우에도 diff를 포함합니다.
> **생략 금지**: 이 섹션이 비어있으면 리뷰어가 변경 범위를 파악할 수 없습니다.
> **파일별 구분**: 여러 파일이 변경된 경우 `// {FileName} — {설명}` 주석으로 구분합니다.

#### Safety Checklist

| 항목                      | 결과 | 비고                                                 |
| ------------------------- | ---- | ---------------------------------------------------- |
| `.tsx` 로직 미변경        | ✅   | useState, useEffect, 이벤트 핸들러 등 변경 없음      |
| `.tsx` 허용된 변경만 포함 | ✅   | 조건부 스타일 클래스 / 인라인 SVG 디자인 속성만 변경 |
| props 타입 미변경         | ✅   | `.types.ts` 변경 없음                                |
| 토큰 이름 미변경          | ✅   | JSON key 변경 없음 (값만 변경)                       |
| 렌더 구조 미변경          | ✅   | JSX 트리 구조, 조건부 렌더링 변경 없음               |

> **⚠️ 표기**: 변경이 있지만 허용 범위인 경우 ⚠️ + 비고로 설명 (예: `⚠️ | indeterminate?: boolean 추가 (non-breaking)`)
> **빌드 통과**: API/로직 변경이 있는 컴포넌트는 `pnpm build 통과 | ✅`, `tsc --noEmit 통과 | ✅` 행을 추가

### {ComponentName2}

(위와 동일 형식 반복: 주요 변경점 → 변경 코드 요약 → Safety Checklist — **3가지 모두 필수**)

---

## Changed Files

| Category                | Files                                                      |
| ----------------------- | ---------------------------------------------------------- |
| Styles                  | `{Name}.styles.ts`, `{Name2}.styles.ts`                    |
| Component (design only) | `{Name}.tsx`                                               |
| Types                   | `{Name}.types.ts`                                          |
| Stories                 | `{Name}.stories.tsx`                                       |
| Tokens                  | `tokens/light.json`, `tokens-light.css`, `token-docs.json` |
| Generated               | `tailwind.preset.js`, `shared-utilities.css`               |
| Icons                   | `{Icon}.svg`                                               |

> 카테고리별로 변경된 파일만 나열합니다. 변경 없는 카테고리는 생략.
> 파일명은 경로 없이 **파일명만** 기재합니다 (간결성).
> `git diff dev..{branch} --name-only`의 결과를 카테고리별로 분류합니다.

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

### Step 5B: PR 본문 업데이트 — APPEND 모드

이미 열려 있는 PR이 있을 때, **기존 PR 본문을 그대로 보존**하고 현재 컴포넌트 섹션만 추가합니다.

> **핵심 원칙**: 기존 본문의 다른 컴포넌트 상세 내용을 절대 덮어쓰거나 축약하지 않습니다. 이전 채팅 세션에서 작성된 내용이 PR 본문에 그대로 남아야 합니다.

#### 5B-1. 기존 PR 본문 가져오기

```bash
cd /Users/pobae/thaki-shared && gh pr view {number} --json body --jq '.body' > /tmp/pr_body.md
```

`/tmp/pr_body.md` 파일을 Read 도구로 읽어 현재 본문 내용을 파악합니다.

#### 5B-2. 중복 확인

기존 본문에 `### {ComponentName}\n` 패턴이 이미 존재하는지 확인합니다.

- **이미 존재** → 사용자에게 "이미 {ComponentName} 섹션이 PR에 있습니다. 교체할까요?" 확인
  - 교체 승인 → 기존 섹션을 새 내용으로 대체
  - 거부 → 스킵
- **존재하지 않음** → 5B-3으로 진행

#### 5B-3. 새 컴포넌트 섹션 작성

현재 컴포넌트의 상세 블록을 Step 5A의 컴포넌트 섹션 템플릿과 동일한 형식으로 작성합니다:

```markdown
### {ComponentName}

**스펙 출처**: `tds/src/design-system/components/{ComponentName}/`

#### 주요 변경점

| #   | 항목 | Before (thaki-shared) | After (TDS 기준) |
| --- | ---- | --------------------- | ---------------- |
| 1   | ...  | `...`                 | `...`            |

#### 변경 코드 요약

(diff 발췌)

#### Safety Checklist

(테이블)
```

#### 5B-4. 기존 본문에 삽입

StrReplace 도구로 `/tmp/pr_body.md` 파일을 편집합니다. 편집 순서:

1. **Summary 라인 업데이트**: 기존 컴포넌트 목록 뒤에 새 컴포넌트명 추가
   - Before: `"- Disclosure, Checkbox, ... 컴포넌트의 디자인을"`
   - After: `"- Disclosure, Checkbox, ..., {NewComponent} 컴포넌트의 디자인을"`

2. **Design Sync Details에 새 컴포넌트 블록 삽입**: `\n---\n\n## Changed Files` 앵커를 찾아 그 **바로 위**에 새 컴포넌트 블록을 삽입합니다.
   - 앵커를 못 찾으면 `## Review Guide` 앞에 삽입 (fallback)

3. **Changed Files 테이블 업데이트**: 카테고리별로 새 파일명 추가
   - Styles 행에 새 `.styles.ts` 파일 추가
   - Component 행에 새 `.tsx` 파일 추가 (해당하는 경우)

4. **PR 타이틀 업데이트**: 총 컴포넌트 수 반영

#### 5B-5. 사용자에게 변경된 부분만 보여주기

APPEND 모드에서는 전체 본문이 아닌, **추가된 컴포넌트 섹션**과 **변경된 Summary/Changed Files** 부분만 사용자에게 보여주고 확인을 요청합니다.

---

### Step 6: 사용자 확인

PR 본문 전체(CREATE) 또는 변경된 부분(APPEND)을 사용자에게 보여주고 승인을 기다립니다:

- "확인" / "진행" → Step 7로
- 수정 요청 → 본문 수정 후 재확인
- "취소" → 중단

### Step 7: PR 생성 또는 업데이트

#### CREATE 모드

```bash
cd /Users/pobae/thaki-shared && git push -u origin design-sync
cd /Users/pobae/thaki-shared && gh pr create --base dev --title "{title}" --body-file /tmp/pr_body.md
```

#### APPEND 모드

```bash
cd /Users/pobae/thaki-shared && git push origin design-sync
cd /Users/pobae/thaki-shared && gh pr edit {number} --title "{new_title}" --body-file /tmp/pr_body.md
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
- 컴포넌트 2~5개: `style(design-sync): batch {N} — {Component1}, {Component2}, ...`
- 컴포넌트 6개 이하 (배치 분할 없음): `style(design-sync): sync {N} components with TDS`
- **6개 이상은 배치 분할** (PR당 최대 5개)

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

배치 PR이 머지되면:

```bash
cd /path/to/thaki-shared && git checkout dev && git pull
# 배치 브랜치만 삭제 (design-sync는 유지)
git branch -d ds-batch-{N}
```

- **배치 브랜치** (`ds-batch-*`): 머지 후 즉시 삭제
- **design-sync 브랜치**: 모든 싱크 작업이 완료될 때까지 유지. 주기적으로 dev를 merge하여 최신 상태 유지
- 모든 싱크가 완료되고 design-sync와 dev의 diff가 없을 때 비로소 삭제

```bash
# design-sync에 dev 최신 반영 (배치 머지 후)
git checkout design-sync && git merge dev --no-edit

# 모든 싱크 완료 후 최종 삭제
git diff dev..design-sync --shortstat  # 차이 없으면 삭제 가능
git branch -d design-sync
```

## Safety Guards

### Guard 1: Evaluate PASS 필수

Evaluate 결과가 PASS가 아닌 컴포넌트는 PR에 포함하지 않습니다.

- 일부만 PASS인 경우: PASS 컴포넌트만 커밋된 상태에서 PR 생성
- 전체 FAIL인 경우: PR 생성 거부

### Guard 2: 빌드 재확인

Step 2에서 빌드가 실패하면 PR을 생성하지 않습니다.

### Guard 3: 사용자 확인 필수

PR 본문을 반드시 사용자에게 보여주고 승인을 받습니다. 자동으로 PR을 생성하지 않습니다.

### Guard 4: dev 직접 푸시 금지

반드시 `design-sync` 브랜치에서 PR을 통해 머지합니다. dev에 직접 커밋/푸시하지 않습니다.

### Guard 5: 사용자 명시적 push 승인 필수

`git push` 및 `gh pr create/edit` 실행 전에 반드시 사용자에게 "push 해도 될까요?" 또는 "PR 생성/업데이트 해도 될까요?"를 확인합니다. 사용자가 "don't push unless I tell you"라고 한 경우 로컬 커밋까지만 진행하고 push는 대기합니다.

## 본문 작성 규칙

### 필수 포함 섹션 (누락 금지)

각 컴포넌트 블록은 **반드시 아래 3가지 서브섹션을 모두 포함**해야 합니다:

1. **`#### 주요 변경점`** — Before/After 테이블 (스펙의 "주요 디자인 차이" **전체** 항목)
2. **`#### 변경 코드 요약`** — `git diff`에서 핵심 변경만 발췌한 diff 블록
3. **`#### Safety Checklist`** — `.tsx` 로직/props/토큰/렌더 구조 변경 여부 테이블

> **주의**: `변경 코드 요약`이나 `Safety Checklist`를 생략하면 리뷰어가 변경 범위를 파악할 수 없습니다. 스타일 전용 변경(`.styles.ts`만 변경)이더라도 반드시 포함하세요. diff가 매우 짧은 경우에도 생략하지 않습니다.

### Changed Files 카테고리

Changed Files 테이블은 아래 카테고리로 분류합니다 (해당 없는 카테고리는 생략):

| Category                | 포함 파일                                                                      |
| ----------------------- | ------------------------------------------------------------------------------ |
| Styles                  | `*.styles.ts`                                                                  |
| Component (design only) | `*.tsx` (디자인 변경만 포함된 컴포넌트)                                        |
| Types                   | `*.types.ts`                                                                   |
| Stories                 | `*.stories.tsx`                                                                |
| Tokens                  | `tokens/light.json`, `tokens/dark.json`, `tokens-light.css`, `token-docs.json` |
| Generated               | `tailwind.preset.js`, `shared-utilities.css`                                   |
| Icons                   | `*.svg`                                                                        |
| CSS                     | `shared-utilities.css` (토큰/유틸리티 외 직접 CSS 변경)                        |

### Review Guide 커스터마이징

Review Guide의 체크 항목은 배치 내용에 맞게 **구체적으로** 작성합니다:

- 토큰 변경이 있으면: "토큰 값 변경이 다른 컴포넌트에 영향을 주는지"
- API 변경이 있으면: "props 기본값 변경이 기존 사용처에 breaking change가 아닌지"
- SVG 변경이 있으면: "SVG viewBox 변경이 올바른지"
- 색상 매핑 변경이 있으면: "상태별 색상 매핑이 시각적으로 적절한지"

### 데이터 소스 우선순위

1. **스펙 파일**: `specs/{ComponentName}.md`의 "주요 디자인 차이" → 주요 변경점 테이블
2. **git diff**: `git diff dev..{branch} -- src/components/{Name}/` → 변경 코드 요약
3. **Evaluate 리포트**: 금지 변경 검증 결과 → Safety Checklist
4. **git diff --name-only**: 변경된 파일 목록 → Changed Files 테이블

### 상세 규칙

1. **Before/After 테이블은 스펙 기반**: `specs/{ComponentName}.md`의 "주요 디자인 차이" 항목을 **빠짐없이** 나열
2. **diff는 핵심만 발췌**: 전체 diff가 아닌 리뷰어가 판단에 필요한 핵심 변경만 포함. 단, 생략하지 않음
3. **Safety Checklist는 Evaluate 결과 반영**: Evaluate 리포트의 금지 변경 검증 결과를 그대로 반영
4. **Changed Files는 git diff 기반**: `git diff dev..{branch} --name-only`에서 자동 추출
5. **Commits 테이블은 git log 기반**: `git log dev..{branch} --oneline`에서 자동 추출

### APPEND 모드 추가 규칙

6. **기존 본문 보존 필수**: APPEND 모드에서 기존 컴포넌트 섹션의 내용을 절대 수정/축약/재생성하지 않음. 이전 세션에서 작성된 상세 내용(테이블, diff, Safety Checklist)이 그대로 유지되어야 함
7. **삽입 위치 규칙**: 새 컴포넌트 블록은 `---` + `## Changed Files` 앵커 바로 위에 삽입. 앵커를 못 찾으면 `## Review Guide` 앞에 삽입
8. **중복 방지**: `### {ComponentName}` 패턴으로 기존 본문에 동일 컴포넌트 섹션이 있는지 반드시 확인. 이미 존재하면 사용자에게 교체 여부 확인
9. **파일 기반 편집**: `/tmp/pr_body.md`에 기존 본문을 저장한 후 StrReplace 도구로 정밀 편집. 전체를 재생성하지 않음

## 출력

- `thaki-shared` 저장소에 PR 생성
- PR URL 반환
