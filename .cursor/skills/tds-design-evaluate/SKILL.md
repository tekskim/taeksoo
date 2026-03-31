# TDS Design Evaluate

디자인 적용 결과의 시각적 일치도 + 기능 무결성을 검증하는 스킬입니다.

## 트리거

- "디자인 검증", "evaluate design", "싱크 검증", "디자인 확인해줘"
- 오케스트레이터(`tds-design-sync`)에서 자동 호출

## 입력

- **컴포넌트명**: Skill 2에서 적용 완료된 컴포넌트
- **디자인 스펙**: `.cursor/skills/tds-design-sync/specs/{ComponentName}.md`

## 동작 절차

### Step 1: 시각적 비교 (사용자에게 직접 보여줌)

1. **TDS 스크린샷 캡처**:
   - TDS Storybook (localhost:5173) 또는 배포된 docs에서 해당 컴포넌트 페이지 접근
   - 주요 variant/size 조합의 스크린샷 캡처 (browser MCP 사용)

2. **thaki-shared 스크린샷 캡처**:
   - thaki-shared Storybook (localhost:6006)에서 해당 컴포넌트 스토리 접근
   - 동일 variant/size 조합의 스크린샷 캡처

3. **상태별(Interactive States) 시각적 비교** (필수):
   - 모든 인터랙티브 상태를 개별 확인:
     - **default**: 기본 상태
     - **hover**: 마우스 올림 (배경색, 텍스트색 변화)
     - **focus-visible**: 키보드 포커스 (ring/outline 스타일)
     - **active**: 클릭 중 (눌림 상태)
     - **disabled**: 비활성 (opacity, cursor)
     - **success/copied**: 성공 상태 (색상 변화, 아이콘 변경)
     - **loading**: 로딩 상태 (있는 경우)
     - **error**: 에러 상태 (있는 경우)
   - 디자인 스펙에 명시된 상태별 색상/스타일이 실제로 적용되는지 확인
   - 아이콘 변경이 있는 경우 아이콘 형태/크기/굵기도 비교

4. **Canvas 비교 화면 생성**:
   - 양쪽 스크린샷을 **나란히 배치**한 비교 화면을 Canvas로 생성
   - **상태별 비교도 포함** (default, hover, focus, active, copied 등)
   - 사용자가 직접 시각적 차이를 확인 가능
   - 차이점 텍스트 설명도 함께 표시

### Step 2: 금지 변경 검증 (git diff 분석)

```bash
cd /Users/pobae/thaki-shared && git diff --name-only
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
cd /Users/pobae/thaki-shared && git diff tokens/light.json | head -100
```

- [ ] JSON 키(이름)가 변경되지 않았는가? (값만 변경 허용)
- [ ] 새로운 키가 추가되지 않았는가? (추가는 사용자 확인 필요)
- [ ] 키가 삭제되지 않았는가?

#### 2-3. `.tsx` 변경 분류 검증

만약 `.tsx` 파일이 변경되었다면, diff를 **허용/금지로 분류**하여 검증합니다:

```bash
cd /Users/pobae/thaki-shared && git diff src/components/{Name}/{Name}.tsx
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
cd /Users/pobae/thaki-shared && pnpm tsc --noEmit
```

→ 타입 에러가 없어야 함

#### 3-2. 빌드 체크

```bash
cd /Users/pobae/thaki-shared && pnpm build
```

→ 빌드 성공해야 함

#### 3-3. Storybook 렌더링

thaki-shared Storybook에서 해당 컴포넌트의 모든 stories가 정상 렌더링되는지 확인
(browser MCP로 각 story 페이지 접근하여 에러 없는지 확인)

### Step 4: 평가 리포트 출력

```markdown
## Evaluation Report: {ComponentName}

### 시각적 비교

- Canvas 비교 링크: [비교 화면](canvas-link)
- 일치도: ✅ 높음 / ⚠️ 부분 차이 / ❌ 불일치

### 차이점 (있는 경우)

| 항목             | TDS     | thaki-shared | 심각도 |
| ---------------- | ------- | ------------ | ------ |
| primary hover bg | #1d4ed8 | #1e40af      | minor  |

### 상태별 비교

| 상태           | TDS           | thaki-shared  | 일치 |
| -------------- | ------------- | ------------- | ---- |
| default        | (색상/배경)   | (색상/배경)   | ✅   |
| hover          | (배경 변화)   | (배경 변화)   | ✅   |
| focus-visible  | (ring 스타일) | (ring 스타일) | ✅   |
| copied/success | (녹색 아이콘) | (녹색 아이콘) | ✅   |
| disabled       | (opacity)     | (opacity)     | ✅   |

### 아이콘 비교 (해당 시)

| 아이콘 | TDS 구현                   | thaki-shared 구현              | 일치  |
| ------ | -------------------------- | ------------------------------ | ----- |
| copy   | Tabler IconCopy stroke=1.5 | inline SVG                     | ✅/⚠️ |
| check  | Tabler IconCheck stroke=2  | inline SVG viewBox=24 stroke=2 | ✅    |

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

## 판정 기준

### PASS 조건 (모두 충족)

- 금지 변경 검증 전체 Pass
- 기능 검증 전체 Pass
- 시각적 일치도가 "높음" 또는 "부분 차이 (minor)"

### FAIL 조건 (하나라도 해당)

- 금지 변경 위반 (`.tsx` 로직 변경, 토큰 이름 변경, props 삭제)
- 빌드 실패
- 타입 에러
- 시각적 불일치 (major)

### FAIL 시 조치

1. FAIL 원인 명시
2. 수정 방안 제안
3. Skill 2 재실행 필요 여부 판단
