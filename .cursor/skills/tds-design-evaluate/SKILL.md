# TDS Design Evaluate

디자인 적용 결과의 시각적 일치도 + 기능 무결성을 검증하는 스킬입니다.

## 트리거

- "디자인 검증", "evaluate design", "싱크 검증", "디자인 확인해줘"
- 오케스트레이터(`tds-design-sync`)에서 자동 호출

## 입력

- **컴포넌트명**: Skill 2에서 적용 완료된 컴포넌트
- **디자인 스펙**: `.cursor/skills/tds-design-sync/specs/{ComponentName}.md`

## 동작 절차

### Step 1A: Computed Style 비교 (정량 검증 — 자동 판정)

browser MCP로 양쪽 페이지에 접근하여 `getComputedStyle`을 JavaScript로 실행, 스펙에 정의된 속성을 정확한 px/hex 값으로 추출하여 비교합니다.

> **Fallback**: browser MCP가 타임아웃되거나 사용 불가능한 경우, Step 1A와 Step 1B를 건너뛰고 **코드 레벨 검증**으로 대체합니다:
>
> 1. 스펙의 "주요 디자인 차이" 테이블의 각 항목을 `.styles.ts` / `.tsx` 코드에서 직접 확인
> 2. CSS 변수 resolve chain을 따라가서 최종값이 TDS와 일치하는지 수동 검증
> 3. Storybook 스크린샷 대신 사용자에게 Storybook URL을 제시하여 수동 확인 요청
> 4. 리포트의 "Computed Style 비교" 섹션에 "browser MCP 불가 — 코드 레벨 검증으로 대체" 명시

**추출 대상 속성:**

- `height`, `padding`, `margin`
- `font-size`, `line-height`, `font-weight`
- `border-radius`
- `background-color`, `color` (rgb → hex 변환)
- `box-shadow`, `border`
- `gap`

**비교 방법:**

1. TDS 페이지(localhost:5173)에서 해당 컴포넌트의 DOM 요소를 선택하고 computed style 추출
2. thaki-shared Storybook(localhost:6006 등)에서 동일 요소의 computed style 추출
3. 속성별 값을 비교하여 match/diff 테이블 생성

**variant/size/theme 조합별 비교:**

- 스펙에 정의된 모든 variant/size/theme 조합에 대해 반복 실행
- 예: Badge라면 sm/md × subtle × red/blue/green/yellow/gray/white 각각 비교

**상태별 비교:**

- **default**: 기본 상태의 computed style 비교
- **hover**: browser MCP의 hover 동작 후 computed style 비교
- **focus-visible**: 키보드 포커스 상태에서 비교 (ring/outline 스타일)
- **disabled**: 비활성 상태에서 비교 (opacity, cursor)
- **success/copied**, **loading**, **error**: 해당 상태가 있는 경우만 비교

**심각도 판정:**

- **exact**: 값이 완전히 동일
- **minor**: 1px 이내 크기 차이, 또는 동일 계열 색상의 미세 차이
- **major**: 2px 이상 크기 차이, 다른 계열 색상, 누락된 속성

### Step 1B: 시각적 비교 Canvas (사용자 확인용)

Computed Style 비교가 끝난 후, 사용자가 직접 눈으로 확인할 수 있도록 **Canvas HTML 페이지**를 생성합니다.

**Canvas 구성:**

- 좌측: TDS 페이지 해당 컴포넌트 스크린샷 (browser MCP `browser_snapshot` 또는 `browser_take_screenshot`)
- 우측: thaki-shared Storybook 해당 스토리 스크린샷
- 하단: Step 1A에서 생성한 Computed Style 비교 결과 테이블 (일치/불일치 시각화)
- 각 variant/size/theme 조합별 섹션 분리
- 상태별(default, hover, disabled 등) 비교 섹션 포함

**Canvas 생성 방법:**

browser MCP의 `canvas` 도구를 사용하여 HTML 페이지를 생성합니다.
스크린샷 이미지를 Base64로 인라인 삽입하여 iframe 제약 없이 표시합니다.

사용자가 Canvas를 열면 양쪽을 나란히 보면서 시각적 일치를 직접 확인할 수 있습니다.
Computed Style이 PASS여도 사용자가 Canvas에서 문제를 발견하면 FAIL 처리 가능합니다.

### Step 2: 금지 변경 검증 (git diff 분석)

```bash
cd /path/to/thaki-shared && git diff --name-only
```

**체크리스트**:

#### 2-1. 파일 범위 검증

- [ ] 변경된 파일이 허용 범위에 한정되는가?
  - `.styles.ts` ✅ 허용
  - `tokens/*.json` ✅ 허용 (값만)
  - `.tsx` ⚠️ 조건부 허용 (2-3 참조)
  - `.types.ts` ❌ 기존 props 삭제 불가

#### 2-2. 토큰 네이밍 검증

```bash
cd /path/to/thaki-shared && git diff tokens/light.json | head -100
```

- [ ] JSON 키(이름)가 변경되지 않았는가? (값만 변경 허용)
- [ ] 새로운 키가 추가되지 않았는가? (추가는 사용자 확인 필요)
- [ ] 키가 삭제되지 않았는가?

#### 2-3. `.tsx` 변경 분류 검증

만약 `.tsx` 파일이 변경되었다면, diff를 **허용/금지로 분류**하여 검증합니다:

```bash
cd /path/to/thaki-shared && git diff src/components/{Name}/{Name}.tsx
```

**허용되는 변경** (순수 디자인 — PASS):

- [ ] `className` 합성 내 조건부 스타일 클래스 추가/변경 (기존 state 활용)
- [ ] 인라인 SVG 디자인 속성 (`viewBox`, `path d`, `strokeWidth`, `width`, `height`)
- [ ] Tailwind 클래스 문자열 상수 변경
- [ ] `aria-label` 등 접근성 텍스트 변경

**금지되는 변경** (로직/구조 — FAIL):

- [ ] `useState`, `useEffect`, `useCallback`, `useMemo` 추가/변경/삭제 없는가?
- [ ] 이벤트 핸들러 (`onClick`, `onChange` 등) 추가/변경/삭제 없는가?
- [ ] 새로운 state 변수가 도입되지 않았는가?
- [ ] 조건부 렌더링 구조가 변경되지 않았는가?
- [ ] props destructuring이 변경되지 않았는가?
- [ ] import 구조가 변경되지 않았는가? (새 라이브러리 추가 등)

### Step 3: 기능 검증

#### 3-1. 타입 체크

```bash
cd /path/to/thaki-shared && pnpm tsc --noEmit
```

→ 타입 에러가 없어야 함

#### 3-2. 빌드 체크

```bash
cd /path/to/thaki-shared && pnpm build
```

→ 빌드 성공해야 함

#### 3-3. Storybook 렌더링

thaki-shared Storybook에서 해당 컴포넌트의 모든 stories가 정상 렌더링되는지 확인
(browser MCP로 각 story 페이지 접근하여 에러 없는지 확인)

### Step 4: 평가 리포트 출력

```markdown
## Evaluation Report: {ComponentName}

### Computed Style 비교

| variant/size | 속성          | TDS     | thaki-shared | 일치 | 심각도 |
| ------------ | ------------- | ------- | ------------ | ---- | ------ |
| sm/subtle    | height        | 20px    | 20px         | ✅   | —      |
| sm/subtle    | padding       | 2px 6px | 2px 6px      | ✅   | —      |
| sm/subtle    | font-size     | 11px    | 11px         | ✅   | —      |
| sm/subtle    | border-radius | 4px     | 4px          | ✅   | —      |
| sm/subtle    | background    | #dbeafe | #dbeafe      | ✅   | —      |
| md/subtle    | height        | 24px    | 24px         | ✅   | —      |

- 일치율: {N}/{Total} ({%}%)
- 불일치 항목: {있으면 나열, 없으면 "없음"}

### 상태별 Computed Style 비교

| 상태          | 속성             | TDS     | thaki-shared | 일치 |
| ------------- | ---------------- | ------- | ------------ | ---- |
| hover         | background-color | #f8fafc | #f8fafc      | ✅   |
| focus-visible | box-shadow       | (ring)  | (ring)       | ✅   |
| disabled      | opacity          | 0.5     | 0.5          | ✅   |

### 시각적 비교

- Canvas 비교 페이지: [비교 화면](canvas-link)
- 사용자 확인 결과: (사용자에게 Canvas를 보여주고 최종 확인 요청)

### 금지 변경 검증

| 항목                     | 결과    |
| ------------------------ | ------- |
| .styles.ts 변경          | ✅ Pass |
| 토큰 이름 유지           | ✅ Pass |
| .tsx 변경 (허용 범위 내) | ✅ Pass |
| .tsx 로직 미변경         | ✅ Pass |
| props 삭제 없음          | ✅ Pass |

### 기능 검증

| 항목              | 결과    |
| ----------------- | ------- |
| 타입 체크 (tsc)   | ✅ Pass |
| 빌드 (pnpm build) | ✅ Pass |
| Storybook 렌더링  | ✅ Pass |

### 최종 판정: ✅ PASS / ❌ FAIL
```

---

## 배치 모드 (통합 Evaluate)

오케스트레이터의 Phase 4에서 여러 컴포넌트를 한번에 검증할 때 사용합니다.
단일 컴포넌트 모드의 Step 1A~Step 3을 반복 실행하되, Canvas와 리포트를 통합합니다.

### 배치 Computed Style 비교

각 컴포넌트에 대해 Step 1A를 순차 실행합니다 (browser MCP 공유 자원).
결과를 컴포넌트별로 수집하여 통합 리포트에 합산합니다.

### 배치 금지 변경 검증

전체 git diff에 대해 Step 2를 **1회** 실행합니다.
변경 파일을 컴포넌트별로 분류하여 각 컴포넌트의 금지 변경 여부를 판정합니다.

### 배치 기능 검증

Step 3(tsc + build)을 **1회만** 실행합니다.
오케스트레이터 Phase 3에서 이미 빌드를 통과한 경우, 이 단계는 건너뛸 수 있습니다.

### 통합 Canvas 생성

모든 컴포넌트의 비교 결과를 **하나의 Canvas HTML 페이지**에 합산합니다.

**Canvas 구조:**

```html
<!-- 상단: 요약 대시보드 -->
<header>
  컴포넌트별 일치율 카드 (Button 100%, Badge 95%, Checkbox 100%, ...) 전체 PASS/FAIL 카운트
</header>

<!-- 탭 네비게이션 -->
<nav>[Button] [Badge] [Checkbox] [Toggle] ...</nav>

<!-- 각 탭 콘텐츠 -->
<section id="button">
  <!-- variant/size 조합별 비교 -->
  <div class="comparison">
    좌: TDS 스크린샷 (Base64 인라인) 우: thaki-shared Storybook 스크린샷 (Base64 인라인)
  </div>
  <!-- Computed Style 비교 테이블 -->
  <table>
    variant/size | 속성 | TDS | shared | 일치
  </table>
  <!-- 상태별 비교 -->
  <table>
    상태 | 속성 | TDS | shared | 일치
  </table>
</section>
```

**Canvas 디자인 가이드:**

- 대시보드: 각 컴포넌트를 카드로 표시, PASS=초록 테두리, minor=노랑 테두리, FAIL=빨강 테두리
- 탭: 컴포넌트명 + 일치율 뱃지 (예: "Badge 95%")
- 비교 영역: 좌우 나란히, 동일 크기로 정규화
- 테이블: 불일치 행만 하이라이트 (빨강 배경)
- 스크린샷은 browser MCP `browser_take_screenshot`으로 캡처 후 Base64 인라인

### 통합 Evaluate 리포트

```markdown
## Batch Evaluate Report

### 요약

| #   | 컴포넌트 | Computed Style 일치율 | 금지 변경 | 기능 검증 | 판정     |
| --- | -------- | --------------------- | --------- | --------- | -------- |
| 1   | Button   | 100% (42/42)          | ✅ Pass   | ✅ Pass   | ✅ PASS  |
| 2   | Badge    | 95% (38/40)           | ✅ Pass   | ✅ Pass   | ⚠️ minor |
| 3   | Checkbox | 100% (28/28)          | ✅ Pass   | ✅ Pass   | ✅ PASS  |

### 통합 Canvas

[통합 비교 화면](canvas-link)

### 불일치 항목 (있는 경우)

#### Badge

| variant/size  | 속성       | TDS     | thaki-shared | 심각도 |
| ------------- | ---------- | ------- | ------------ | ------ |
| md/subtle/red | background | #fee2e2 | #fecaca      | minor  |
| md/subtle/red | color      | #dc2626 | #ef4444      | minor  |

### 금지 변경 검증 (전체)

| 항목              | 결과    |
| ----------------- | ------- |
| .styles.ts 변경만 | ✅ Pass |
| 토큰 이름 유지    | ✅ Pass |
| .tsx 허용 범위 내 | ✅ Pass |
| .tsx 로직 미변경  | ✅ Pass |
| props 삭제 없음   | ✅ Pass |

### 기능 검증 (1회)

| 항목              | 결과    |
| ----------------- | ------- |
| 타입 체크 (tsc)   | ✅ Pass |
| 빌드 (pnpm build) | ✅ Pass |

### 최종 판정

- ✅ PASS: {N}개
- ⚠️ minor: {M}개
- ❌ FAIL: {K}개
```

---

## 판정 기준

### PASS 조건 (모두 충족)

- Computed Style 비교 일치율 100%, 또는 차이가 minor(1px 이내, 동일 계열 색상)
- 금지 변경 검증 전체 Pass
- 기능 검증 전체 Pass
- 사용자가 Canvas 시각적 비교에서 문제를 발견하지 않음

### FAIL 조건 (하나라도 해당)

- Computed Style 비교에서 major 불일치 (2px 이상 크기 차이, 다른 계열 색상, 누락된 속성)
- 금지 변경 위반 (`.tsx` 로직 변경, 토큰 이름 변경, props 삭제)
- 빌드 실패
- 타입 에러
- 사용자가 Canvas에서 시각적 문제를 발견

### FAIL 시 조치

1. FAIL 원인 명시
2. 수정 방안 제안
3. Skill 2 재실행 필요 여부 판단
