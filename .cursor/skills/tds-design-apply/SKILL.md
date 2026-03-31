# TDS Design Apply

추출된 TDS 디자인 스펙을 thaki-shared 컴포넌트에 반영하는 스킬입니다.
**스타일만 변경하며, 로직/이벤트/상태 관리는 절대 변경하지 않습니다.**

## 트리거

- "디자인 적용", "apply design", "싱크 반영", "디자인 반영해줘"
- 오케스트레이터(`tds-design-sync`)에서 자동 호출

## 입력

- **디자인 스펙 파일**: `.cursor/skills/tds-design-sync/specs/{ComponentName}.md` (Skill 1 출력)
- **component-map.md**: thaki-shared 대응 컴포넌트 경로
- **token-map.md**: 토큰 이름 매핑

## 엄격한 제약 사항

### 절대 금지

1. **`.tsx` 파일의 로직 변경 금지**: 이벤트 핸들러, state, hooks, API 호출 등
2. **`.tsx` 파일의 렌더 구조 변경 금지**: JSX 트리, 컴포넌트 합성 구조, 조건부 렌더링
3. **토큰 이름(key) 변경 금지**: `tokens/light.json`, `tokens/dark.json`의 키 이름 변경 불가
   - 예: `semantic.color.primary` → `semantic.color.actionPrimary` (금지)
4. **props 삭제 금지**: 불필요한 props는 `@deprecated` JSDoc 처리

### 허용

1. **`.styles.ts` 파일의 CVA classes 변경**: Tailwind 클래스, CSS 변수 참조 등
2. **`tokens/light.json`, `tokens/dark.json`의 토큰 값(value) 변경**: 색상값, 크기값 등
3. **props 추가**: 반드시 사용자 확인 후
4. **`tailwind.preset.js` 재생성**: 토큰 값 변경 후 `pnpm generate:tailwind-preset`
5. **`.tsx` 파일의 조건부 스타일 클래스 변경/추가** (아래 조건 충족 시):
   - 기존 state 변수를 그대로 사용 (새 state 추가 금지)
   - `className` 합성 위치에서 조건부 클래스만 추가/변경
   - 예: `cn(styles, isCopied && 'text-success', className)` — 기존 `isCopied`를 활용한 색상 클래스 추가
   - 예: `cn(styles, isActive && 'bg-primary')` — 기존 `isActive`를 활용한 배경 클래스 추가
6. **`.tsx` 파일의 인라인 SVG 디자인 속성 변경**:
   - `viewBox`, `width`, `height` — 아이콘 좌표계/크기
   - `path d` 속성 — 아이콘 형태 (TDS Tabler Icons path에 맞춤)
   - `strokeWidth`, `stroke`, `fill` — 아이콘 선 굵기/색상
   - 로직(이벤트, 조건부 렌더링 등)은 변경 불가

## 동작 절차

### Step 1: 스펙 읽기

`.cursor/skills/tds-design-sync/specs/{ComponentName}.md` 읽기

### Step 2: thaki-shared 현재 상태 읽기

`component-map.md`에서 경로 확인 후:

- `{Name}.styles.ts` — CVA variant 정의 (주 수정 대상)
- `{Name}.tsx` — 렌더 로직 읽기 + 아래 항목만 수정 가능:
  - 조건부 스타일 클래스 (기존 state 활용, className 합성 내)
  - 인라인 SVG 디자인 속성 (viewBox, path d, strokeWidth 등)
- `{Name}.types.ts` — props 타입 (읽기 전용, 필요시 추가만)

**`.tsx` 읽기 시 반드시 확인할 항목**:

1. 상태별 조건부 className이 있는가? (예: `copied && successClass`, `isActive && activeClass`)
2. TDS에는 상태별 스타일이 있는데 shared에는 누락된 것이 있는가?
3. 인라인 SVG 아이콘이 있다면 TDS의 아이콘(Tabler Icons)과 시각적으로 동일한가?

### Step 3: 변경 계획 생성 (Pre-flight)

**반드시 적용 전에 사용자에게 보여주는 리포트**:

```markdown
## Pre-flight Report: {ComponentName}

### 1. .styles.ts 변경 사항

| 위치 (variant/size)    | 현재 값                                       | 변경 값                               | 사유                |
| ---------------------- | --------------------------------------------- | ------------------------------------- | ------------------- |
| solid.primary.class bg | bg-[var(--component-button-solid-primary-bg)] | (유지)                                | 이미 일치           |
| size.sm.class height   | h-control-sm                                  | h-[var(--semantic-control-height-sm)] | 토큰 참조 방식 통일 |

### 2. 토큰 값 변경 사항

| JSON path           | 현재 값                       | 변경 값                       | 영향 범위                |
| ------------------- | ----------------------------- | ----------------------------- | ------------------------ |
| semantic.color.text | {primitive.color.trueGray900} | {primitive.color.blueGray900} | 모든 text-default 사용처 |

### 3. 크기/레이아웃 변경 사항

| 속성        | 현재 값 (shared) | TDS 값              | 변경 위치                      | 사유               |
| ----------- | ---------------- | ------------------- | ------------------------------ | ------------------ |
| button size | `size-3` (12x12) | `h-6 px-1.5` (24px) | `.styles.ts` 또는 `.tsx` const | TDS 호버 영역 확보 |

> **이 섹션은 스펙의 "주요 디자인 차이"에서 크기/레이아웃 관련 항목을 모두 나열합니다.** 비어있으면 "변경 없음"으로 명시하세요.

### 4. .tsx 조건부 스타일 클래스 변경 (있는 경우)

| 위치           | 현재                    | 변경                                                | 사유                      |
| -------------- | ----------------------- | --------------------------------------------------- | ------------------------- |
| className 합성 | `cn(styles, className)` | `cn(styles, isCopied && 'text-success', className)` | TDS copied 상태 녹색 반영 |

### 5. .tsx 인라인 SVG 디자인 변경 (있는 경우)

| 아이콘    | 속성        | 현재 값           | 변경 값        | 사유                    |
| --------- | ----------- | ----------------- | -------------- | ----------------------- |
| checkIcon | viewBox     | 0 0 12 12         | 0 0 24 24      | TDS Tabler Icons 좌표계 |
| checkIcon | path d      | M10 3L4.5 8.5L2 6 | M5 12l5 5L20 7 | TDS IconCheck path      |
| checkIcon | strokeWidth | 1.5               | 2              | TDS stroke={2}          |

### 6. props 변경 (있는 경우)

- 추가: `size="xs"` — TDS에 xs 사이즈 존재
- deprecated: 없음

### 7. 변경하지 않는 항목

- .tsx 로직 (이벤트 핸들러, state, hooks, 조건부 렌더링)
- .types.ts (타입 변경 없음)
```

### Step 4: 사용자 확인 대기

Pre-flight 리포트를 보여주고 사용자 승인을 기다립니다.

- "확인" / "진행" → Step 5로
- 수정 요청 → 리포트 수정 후 재확인
- "취소" → 중단

### Step 5: 적용

사용자 승인 후:

1. **`.styles.ts` 파일 수정**:
   - CVA variant의 Tailwind 클래스 업데이트
   - CSS 변수 참조를 TDS 디자인값에 맞게 조정
   - `token-map.md`를 참조하여 thaki-shared 토큰명 사용

2. **토큰 값 수정** (필요한 경우):
   - `tokens/light.json`에서 해당 토큰의 **값만** 변경
   - `tokens/dark.json`에서도 대응 값 변경
   - 이름/키는 절대 변경하지 않음

3. **Tailwind preset 재생성** (토큰 변경 시):
   ```bash
   cd /Users/pobae/thaki-shared && pnpm generate:tailwind-preset
   ```

### Step 5.5: 스펙 대조 검증 (Critical)

**적용 후, 빌드 전에 반드시 수행합니다.**

스펙(`specs/{ComponentName}.md`)의 **"주요 디자인 차이"** 섹션을 한 항목씩 순회하면서, 각 차이가 실제로 코드에 반영되었는지 확인합니다.

**체크 방식**:

1. 스펙의 "주요 디자인 차이" 테이블을 읽는다
2. 각 항목에 대해 **변경된 파일에서 해당 속성을 grep** 한다
3. 스펙에 기술된 "TDS 값"이 코드에 반영되었는지 확인한다
4. 누락이 있으면 즉시 추가 적용한다

**검증 체크리스트**:

| 카테고리          | 확인 항목                                         | 방법                                                |
| ----------------- | ------------------------------------------------- | --------------------------------------------------- |
| **크기/레이아웃** | width, height, padding, margin, gap               | Tailwind 클래스 비교 (예: `size-3` vs `h-6 px-1.5`) |
| **색상**          | 배경, 전경, border 색상                           | CSS 변수 또는 Tailwind 색상 클래스                  |
| **상태별 스타일** | hover, focus, active, disabled, copied/success 등 | 조건부 className 확인                               |
| **타이포그래피**  | font-size, weight, line-height                    | 유틸리티 클래스                                     |
| **보더/라운드**   | border-radius, border-width                       | CSS 변수 또는 Tailwind 클래스                       |
| **트랜지션**      | duration, easing                                  | Tailwind transition 클래스                          |
| **아이콘**        | viewBox, path, strokeWidth, size                  | 인라인 SVG 또는 Tabler import                       |

**누락 발견 시 행동**:

- 허용된 변경 범위 → 즉시 적용
- 금지된 변경 범위 → 리포트에 기록하고 사용자에게 알림

> ⚠️ **이 단계를 건너뛰지 마세요.** 이전 싱크에서 Extract가 크기 차이(`12x12 vs 24px`)를 정확히 파악했음에도 Apply가 반영하지 않아 누락이 발생했습니다. 스펙에 기록된 모든 차이는 반드시 코드에 반영되어야 합니다.

### Step 6: 빌드 확인

```bash
cd /Users/pobae/thaki-shared && pnpm build
```

빌드 실패 시:

- 타입 에러 → `.styles.ts` 수정 (로직 파일 변경 금지)
- 토큰 참조 에러 → `token-map.md` 확인 후 수정

## Safety Guards

### Guard 1: 파일 변경 범위 체크

적용 전 변경 대상 파일 목록을 확인합니다:

- `.styles.ts` ✅ 허용
- `tokens/light.json`, `tokens/dark.json` ✅ 허용 (값만)
- `.tsx` ⚠️ 조건부 허용 (아래 Guard 3 참조)
- `.types.ts` ❌ 삭제 감지 시 즉시 중단
- 기타 파일 ❌ 감지 시 경고

### Guard 2: 토큰 이름 변경 체크

`tokens/light.json` 변경 시:

- JSON 키 변경 감지 → 즉시 중단하고 경고
- 값만 변경되었는지 확인

### Guard 3: `.tsx` 변경 허용/금지 분류

`.tsx` 파일에 변경이 발생하면 아래 기준으로 허용/금지를 판단합니다:

**허용되는 `.tsx` 변경 (순수 디자인)**:

- `className` 합성 내 조건부 스타일 클래스 추가/변경 (기존 state 변수 활용)
- 인라인 SVG의 `viewBox`, `path d`, `strokeWidth`, `width`, `height` 변경
- Tailwind 클래스 문자열 상수 (`const xxxStyles = '...'`) 변경
- `aria-label` 등 접근성 텍스트 변경

**금지되는 `.tsx` 변경 (로직/구조)** — 감지 시 즉시 중단:

- `useState`, `useEffect`, `useCallback`, `useMemo` 호출 추가/변경/삭제
- `onClick`, `onChange`, `onSubmit` 등 이벤트 핸들러 추가/변경/삭제
- 새로운 state 변수 도입 (기존 state 활용은 허용)
- 조건부 렌더링(`if`, JSX 내 `&&`, ternary`) 구조 변경
- import 구조 변경 (신규 라이브러리 추가 등)
- props destructuring 변경
- API 호출, 비동기 로직 변경
