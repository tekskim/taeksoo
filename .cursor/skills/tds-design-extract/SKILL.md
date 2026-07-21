# TDS Design Extract

TDS 컴포넌트의 모든 시각적 디자인 정보를 구조화된 스펙으로 추출하는 스킬입니다.

## 트리거

다음 키워드로 트리거됩니다:

- "디자인 추출", "extract design", "디자인 스펙 뽑아줘", "TDS 디자인 추출"
- 오케스트레이터(`tds-design-sync`)에서 자동 호출

## 입력

- **컴포넌트명**: 1개 (예: "Button")
- **component-map.md**: `.cursor/skills/tds-design-sync/component-map.md`에서 TDS 파일 경로 확인

## 출력

- **디자인 스펙 파일**: `.cursor/skills/tds-design-sync/specs/{ComponentName}.md`

## 동작 절차

### Step 1: 컴포넌트 파일 읽기

1. `component-map.md`에서 TDS 경로 확인
2. TDS 컴포넌트 파일 읽기: `src/design-system/components/{Name}/{Name}.tsx`
3. 관련 파일이 있다면 함께 읽기 (예: Input 폴더의 NumberInput.tsx, SearchInput.tsx)

### Step 2: CSS 변수 Resolve

TDS 컴포넌트에서 사용하는 모든 `var(--*)` 참조를 최종값까지 resolve합니다.

**Resolve 체인 규칙** (reference.md 참조):

1. `var(--button-height-sm)` → `src/index.css`에서 정의 찾기 → `28px` (직접값)
2. `var(--color-action-primary)` → `var(--color-blue-600)` → `#2563eb` (체인)
3. `var(--radius-md)` → `6px` (직접값)

**읽어야 할 파일**:

- `src/index.css` (주 토큰 정의)
- `src/styles/tokens/compatibility.css` (별칭 매핑)
- `src/styles/tokens/light.css` (생성된 토큰)

### Step 3: 추출 항목

CVA 정의를 파싱하여 아래 항목을 추출합니다:

#### 3-1. Base Styles (공통)

- `border-radius`
- `transition` (duration, property)
- `focus` 스타일 (ring, outline)
- `cursor` 상태
- `font-weight`

#### 3-2. Variants

각 variant에 대해:

- **variant명** (예: primary, secondary, danger, ghost, ...)
- **background**: normal / hover / active / disabled
- **text color**: normal / hover / disabled
- **border**: color, width (normal / hover / focus)
- **shadow**: 있는 경우

#### 3-3. Sizes

각 size에 대해:

- **height**
- **padding** (x, y)
- **gap** (아이콘-텍스트 간격)
- **font-size**
- **line-height**
- **icon-size**

#### 3-4. States (정적)

- **disabled**: opacity, cursor, colors
- **loading**: 있는 경우
- **focus-visible**: ring 스타일

#### 3-5. Interactive States (동적 — 반드시 확인)

JSX 내 상태 변수에 따라 조건부로 적용되는 스타일을 추출합니다:

- **copied/success**: 복사 성공 시 색상 변화 (예: `text-[var(--color-state-success)]`)
- **active/selected**: 선택 상태 배경/테두리 변화
- **error/invalid**: 에러 상태 색상 변화
- **expanded/open**: 열림 상태 아이콘 회전, 배경 변화

**추출 방법**: `.tsx` 파일에서 `className` 합성 부분을 확인하여 `조건 && 'class-name'` 패턴을 모두 찾아냅니다.

```
예: className={twMerge(..., copied && successStyles)} → copied 상태에서 successStyles 적용
```

#### 3-6. CSS 구현 기법 비교 (Critical)

TDS와 thaki-shared가 **같은 시각 효과를 다른 CSS 기법으로 구현**하는 경우를 반드시 식별합니다.

**비교 항목**:

| 시각 효과    | 확인 사항                  | TDS 기법 예시                  | 주의            |
| ------------ | -------------------------- | ------------------------------ | --------------- |
| 테두리       | border vs inset box-shadow | `shadow-[inset_0_0_0_1px_...]` | 요소 크기 차이  |
| 내부 그림자  | border vs inset shadow     | `shadow-[inset_0_0_0_1px_...]` | box-sizing 영향 |
| 외부 그림자  | box-shadow vs border       | `shadow-[0_1px_2px_...]`       | stacking 차이   |
| display 모드 | flex vs inline-flex        | `inline-flex`                  | 너비 계산 차이  |
| 오버플로우   | overflow vs clip           | `overflow-hidden` vs `clip`    | 자식 렌더링     |

**스펙 출력 예시**:

```markdown
## CSS 구현 기법 차이

| 요소             | 시각 효과                   | TDS 기법                   | thaki-shared 기법    | 차이 영향              |
| ---------------- | --------------------------- | -------------------------- | -------------------- | ---------------------- |
| 컨테이너 테두리  | 1px subtle border           | inset box-shadow           | CSS border           | 요소 크기 2px 차이     |
| 활성 탭 테두리   | 1px default border + shadow | inset shadow + drop shadow | border + shadow 중복 | shadow 이중 적용       |
| 컨테이너 display | 콘텐츠 크기에 맞춤          | inline-flex                | flex + w-fit         | 레이아웃 컨텍스트 차이 |
```

> 이 섹션은 Apply 스킬의 "Pitfall 0-B: CSS 구현 기법 차이"와 직결됩니다. 기법 차이가 있으면 값만 맞추는 것이 아니라 **동일한 CSS property를 사용하도록** Apply에서 변경해야 합니다.

#### 3-6-B. CVA base 스타일 상속 분석 (Critical)

thaki-shared 컴포넌트가 CVA를 사용하는 경우, **base 스타일이 모든 variant에 상속**됩니다. 싱크 대상 variant에 영향을 주는 base 속성을 반드시 추출합니다.

**추출 방법**:

1. `.styles.ts`의 CVA base 배열 전체를 읽음
2. 싱크 대상 variant(예: pill)에서 **충돌하거나 불필요한** base 속성을 리스트업
3. 스펙의 "주요 디자인 차이"에 "base 상속 리셋 필요" 항목으로 추가

**스펙 출력 예시**:

```markdown
## CVA Base 상속 분석

싱크 대상 variant: `pill`

| base 클래스                       | pill에서 필요 여부       | 리셋 필요 | 리셋 방법                         |
| --------------------------------- | ------------------------ | --------- | --------------------------------- |
| `pb-2.5`                          | ❌ (underline용)         | ✅        | `py-0 pb-0`                       |
| `border-b-2 border-b-transparent` | ❌ (underline indicator) | ✅        | `border-0 border-b-0`             |
| `transition-all duration-normal`  | 부분 (colors만 필요)     | ✅        | `transition-colors duration-fast` |
| `text-text-subtle`                | ❌ (pill은 text-default) | ✅        | `text-text`                       |
| `px-3`                            | ✅ (동일)                | —         | —                                 |
| `font-medium font-sans`           | ✅ (동일)                | —         | —                                 |
```

> 이 분석이 없으면 Apply에서 "추가만 하고 리셋을 안 하는" 문제가 발생합니다.

#### 3-7. 아이콘 구현 비교 (Critical — SVG 원본 다운로드 필수)

TDS와 thaki-shared의 아이콘 구현 방식이 다를 수 있으므로 반드시 비교합니다:

- **TDS 아이콘**: Tabler Icons (`@tabler/icons-react`) 사용 — `size`, `stroke` props
- **TDS 커스텀 아이콘**: `src/design-system/components/Icons/CustomIcons.tsx` — Figma SVG 원본 재현
- **thaki-shared 아이콘**: 인라인 SVG 또는 자체 Icon 컴포넌트 사용
- **Figma 원본**: `get_design_context`로 asset URL 획득 → 직접 다운로드

**비교 항목**:
| 항목 | 확인 내용 |
|---|---|
| viewBox | 좌표계 (12x12 vs 24x24 등) |
| width/height | 렌더링 크기 |
| path d | 아이콘 형태 (path 좌표 일치 여부) |
| strokeWidth | 선 굵기 (SVG 내 명시값 vs 기본값 1) |
| stroke/fill | 색상 (currentColor 사용 여부) |

##### 3-7-A. Figma 아이콘 SVG 원본 다운로드 절차 (필수)

"비슷해 보인다"는 주관적 판단을 금지합니다. 반드시 아래 절차를 따릅니다:

1. **Figma에서 asset URL 획득**: `get_design_context`로 해당 아이콘의 asset URL을 얻는다
2. **SVG 다운로드**: `curl -s -o /tmp/figma-{icon-name}.svg "{asset_url}"` 로 원본 SVG를 저장
3. **SVG 속성 파싱**: 다운로드한 SVG에서 아래 값을 정확히 추출
   - `viewBox` 좌표계 (예: `0 0 12.6667 10.3333`)
   - `stroke-width` 값 — **명시되어 있지 않으면 SVG 기본값 1이다** (절대로 1.5로 추정하지 않는다)
   - `path d` 속성 전체
   - `stroke-linecap`, `stroke-linejoin` 값
4. **Tabler 대조**: 해당 Tabler 아이콘의 SVG를 `node -e` 명령으로 추출하여 path d를 비교
   ```bash
   node -e "const {IconName} = require('@tabler/icons-react'); console.log(IconName);"
   ```
5. **일치 판정**: path d가 **좌표 수준에서 동일**해야 "일치"로 판정
   - 모양이 "비슷하다" → 불일치로 판정 (커스텀 SVG 필요)
   - viewBox가 다르면 → 불일치로 판정

##### 3-7-B. 아이콘 불일치 시 스펙 출력

불일치 아이콘은 스펙에 아래 형식으로 기록합니다:

```markdown
## 아이콘 불일치 (커스텀 SVG 필요)

| 용도         | Figma 아이콘명  | Figma viewBox       | Figma stroke-width | Tabler 후보      | 판정      | 사유             |
| ------------ | --------------- | ------------------- | ------------------ | ---------------- | --------- | ---------------- |
| Datasets     | Icon/Hard_drive | 0 0 12.6667 10.3333 | 1 (기본값)         | IconDeviceFloppy | ❌ 불일치 | path 형태 상이   |
| My templates | Icon/File       | 0 0 11 13           | 1 (기본값)         | IconFile         | ❌ 불일치 | path d 좌표 다름 |

### SVG 원본 (커스텀 아이콘 생성용)

#### Icon/Hard_drive

\`\`\`xml
<path d="M11.8099 5.16667H0.833374M2.83333 7.5H2.83917..." stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
\`\`\`
viewBox: `0 0 12.6667 10.3333` | stroke-width: 1 (기본값)
```

> **"비슷하니까 OK" 금지**: Tabler 아이콘과 Figma 아이콘이 이름이나 외형이 유사해도, path d 좌표가 다르면 **반드시 커스텀 SVG로 생성**합니다. 이 규칙을 어기면 반복 수정이 발생합니다.

### Step 4: thaki-shared 대응 정보

`component-map.md`에서 대응 컴포넌트 확인 후:

- thaki-shared 컴포넌트 경로
- 매핑 상태 (1:1 / partial / none)
- `token-map.md`에서 관련 토큰 매핑 확인

### Step 5: 스펙 파일 생성

아래 형식으로 `.cursor/skills/tds-design-sync/specs/{ComponentName}.md` 생성:

```markdown
# {ComponentName} Design Spec

> Extracted from TDS `src/design-system/components/{Name}/{Name}.tsx`
> thaki-shared target: `src/components/{SharedName}/`

## Base Styles

| Property      | Value | TDS Token                       |
| ------------- | ----- | ------------------------------- |
| border-radius | 6px   | --button-radius (→ --radius-md) |
| transition    | 150ms | --duration-fast                 |
| font-weight   | 500   | font-medium                     |

## Variants

### variant="primary"

| State    | Background  | Text        | Border |
| -------- | ----------- | ----------- | ------ |
| default  | #2563eb     | #ffffff     | —      |
| hover    | #1d4ed8     | #ffffff     | —      |
| active   | #1e40af     | #ffffff     | —      |
| disabled | #2563eb/50% | #ffffff/50% | —      |

### variant="secondary"

(동일 형식)

## Sizes

| Size | Height | Padding X | Padding Y | Font Size | Line Height | Gap | Icon |
| ---- | ------ | --------- | --------- | --------- | ----------- | --- | ---- |
| sm   | 28px   | 10px      | 6px       | 11px      | 16px        | 6px | 12px |
| md   | 32px   | 12px      | 8px       | 11px      | 16px        | 6px | 12px |
| lg   | 36px   | 16px      | 10px      | 12px      | 18px        | 8px | 12px |

## Interactive States (동적)

| State                     | 조건              | 적용 스타일                       | 색상    |
| ------------------------- | ----------------- | --------------------------------- | ------- |
| copied/success            | `copied === true` | text-[var(--color-state-success)] | #22c55e |
| (해당 없으면 "없음" 표기) |                   |                                   |         |

## 아이콘 비교

| 아이콘 | TDS 구현           | size | stroke | thaki-shared 구현 | viewBox | strokeWidth |
| ------ | ------------------ | ---- | ------ | ----------------- | ------- | ----------- |
| copy   | IconCopy (Tabler)  | 12   | 1.5    | inline SVG        | 12x12   | 1           |
| check  | IconCheck (Tabler) | 12   | 2      | inline SVG        | 12x12   | 1.5         |

## Token Mapping (참조)

| TDS Token              | TDS Resolved | thaki-shared Token                  | shared Resolved | Match   |
| ---------------------- | ------------ | ----------------------------------- | --------------- | ------- |
| --button-height-sm     | 28px         | --semantic-control-height-sm        | 28px            | exact   |
| --color-action-primary | #2563eb      | --component-button-solid-primary-bg | #2563eb         | exact   |
| --color-text-muted     | #475569      | --semantic-color-textMuted          | #737373         | ❌ DIFF |
```

> ⚠️ **Token value 검증 필수**: `token-map.md`의 "exact" 매핑은 **이름 매핑**만 의미합니다. 실제 **resolve된 CSS 값(hex)**이 일치하는지 반드시 확인하세요. 이름은 매핑되어 있어도 참조하는 primitive가 달라 다른 색상으로 렌더링될 수 있습니다.

## 필수 체크리스트 (Extract 완료 전 검증)

### A. Props 기본값 비교

TDS와 thaki-shared의 **모든 props default value**를 비교합니다. 기본값이 다르면 "theme 미지정 시 다르게 보이는" 문제가 발생합니다.

```
예: TDS default theme='white' vs shared default theme='gry' → 기본 상태 시각적 차이
```

### B. TDS 전용 variant/theme 시각적 중요도 판단

TDS에만 있는 variant/theme/size가 **기본 상태나 주요 사용 시나리오에 관여하는지** 확인합니다:

- 기본값으로 사용되는 variant → **API Changes Required**로 분류 (시각적으로 중요)
- 드물게 사용되는 추가 옵션 → 스펙에 기록만 (미적용)

### C. 색상 토큰 분류 — 글로벌 vs 컴포넌트 전용

"토큰 레이어 차이"로 넘기기 전에, 해당 토큰이 **컴포넌트에서 직접 참조하는 primitive 토큰**인지 확인합니다:

- `primitive-blue-50` 등 **primitive 토큰을 직접 참조** → 컴포넌트 레벨에서 shade 변경 가능 (Apply 대상)
- `--semantic-color-success` 등 **semantic 토큰 참조** → 토큰 레이어에서 해결 (미적용)

### C-1. 시맨틱 토큰의 실제 값(hex) 비교 (**Critical**)

`token-map.md`에서 "exact"로 표기된 시맨틱 토큰이라도, **참조하는 primitive가 다를 수 있습니다**. 반드시 실제 CSS 출력값을 비교하세요.

**비교 방법**:

1. TDS 값: `src/index.css` 또는 `src/styles/tokens/compatibility.css`에서 최종 hex 값 확인
2. thaki-shared 값: `src/styles/tokens/tokens-light.css`에서 같은 이름의 토큰 값 확인
3. 값이 다르면: `tokens/light.json`에서 참조하는 `{primitive.color.*}` 경로를 확인하고, 스펙의 Token Mapping 테이블에 `❌ DIFF`로 기록

**특히 주의할 시맨틱 토큰**:

- `textMuted`, `textSubtle`, `textLight` — gray 계열 palette 불일치가 빈번
- `border`, `borderStrong` — blueGray vs trueGray 차이
- `surfaceSubtle`, `surfaceMuted` — 배경색 미세 차이

```
예: thaki-shared textMuted → {primitive.color.trueGray500} (#737373)
    TDS --color-text-muted → blueGray600 (#475569)
    → token-map에선 "exact"이지만 실제로는 완전히 다른 색상
```

### D. 사용처 기반 deprecated 후보 식별

TDS에서 제거된 variant/type이 있으면 thaki-shared에서의 실제 사용처를 검색합니다:

```bash
# feature 코드에서 사용하는지 확인 (스토리/테스트 제외)
grep -r 'type="solid"' src/features/ src/pages/
```

- 사용처 0건 → **API Changes Required** (deprecated 권장)
- 사용처 있음 → 스펙에 기록만

### E. 스펙 출력 시 분류

스펙 파일의 "주요 디자인 차이" 테이블에 **변경 유형** 컬럼을 추가합니다:

| 유형           | 설명                                | 영향 범위               | 마이그레이션                    |
| -------------- | ----------------------------------- | ----------------------- | ------------------------------- |
| `style`        | 스타일만 변경 (디자인 싱크 범위)    | —                       | —                               |
| `api-required` | API 변경 필요 (Apply에서 함께 적용) | (구체적 영향 기술 필수) | (기존 동작 유지 방법 기술 필수) |
| `token-global` | 글로벌 토큰 정렬 시 해결 (미적용)   | —                       | —                               |

**`api-required` 항목 기술 규칙:**

`api-required`로 분류된 항목은 **영향 범위**와 **마이그레이션 가이드**를 반드시 기술합니다.
이 정보는 Apply의 Pre-flight "8. API Changes" 섹션과 PR 본문에 그대로 사용됩니다.

| API 변경 유형 | 영향 범위 기술 예시                     | 마이그레이션 기술 예시                       |
| ------------- | --------------------------------------- | -------------------------------------------- |
| 기본값 변경   | "props 미지정 시 {새 값}으로 표시됨"    | "기존 동작 유지: `{prop}=\"{기존값}\"` 명시" |
| @deprecated   | "기존 `{value}` 사용처에 IDE 경고 표시" | "`{대체값}` 사용 권장"                       |
| 새 옵션 추가  | "기존 코드 영향 없음"                   | "새로운 `{value}` 옵션 사용 가능"            |

> `api-required` 항목은 디자인 반영에 필수적인 경우에만 분류합니다.
> Apply 스킬이 스타일 변경과 함께 자동으로 적용하므로, 별도의 사용자 요청 없이 Pre-flight 확인 시 함께 승인됩니다.

## 주의사항

- CSS 변수는 반드시 **최종값까지 resolve** (체인 따라가기)
- Tailwind 유틸리티 클래스도 실제 값으로 변환 (예: `text-body-md` → 12px/18px)
- `cn()` 또는 `twMerge`로 합쳐지는 클래스도 추적
- 컴포넌트가 compound 구조인 경우 (예: SectionCard.Header, SectionCard.Content) 하위 컴포넌트도 각각 추출
- **`.tsx`에서 조건부 className 패턴을 반드시 추출**: `조건 && 'class'` 또는 `조건 ? 'classA' : 'classB'` 형태로 적용되는 상태별 스타일
- **인라인 SVG 아이콘의 디자인 속성을 반드시 비교**: viewBox, path, strokeWidth가 TDS Tabler Icons와 시각적으로 동일한지
- **아이콘 SVG는 반드시 원본 다운로드 후 비교**: "비슷해 보인다"는 눈대중 판단 금지. Figma SVG를 curl로 다운로드하여 path d 좌표를 직접 대조해야 한다 (§3-7-A)
- **stroke-width 기본값 주의**: SVG에 `stroke-width` 속성이 없으면 기본값은 **1**이다. 1.5나 2로 추정하지 않는다
