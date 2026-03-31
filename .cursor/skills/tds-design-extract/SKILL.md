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

#### 3-6. 아이콘 구현 비교

TDS와 thaki-shared의 아이콘 구현 방식이 다를 수 있으므로 반드시 비교합니다:

- **TDS 아이콘**: Tabler Icons (`@tabler/icons-react`) 사용 — `size`, `stroke` props
- **thaki-shared 아이콘**: 인라인 SVG 또는 자체 Icon 컴포넌트 사용

**비교 항목**:
| 항목 | 확인 내용 |
|---|---|
| viewBox | 좌표계 (12x12 vs 24x24) |
| width/height | 렌더링 크기 |
| path d | 아이콘 형태 (Tabler path와 일치 여부) |
| strokeWidth | 선 굵기 (TDS stroke prop과 일치 여부) |
| stroke/fill | 색상 (currentColor 사용 여부) |

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

| TDS Token              | Resolved | thaki-shared Token                  | Match |
| ---------------------- | -------- | ----------------------------------- | ----- |
| --button-height-sm     | 28px     | --semantic-control-height-sm        | exact |
| --color-action-primary | #2563eb  | --component-button-solid-primary-bg | exact |
```

## 주의사항

- CSS 변수는 반드시 **최종값까지 resolve** (체인 따라가기)
- Tailwind 유틸리티 클래스도 실제 값으로 변환 (예: `text-body-md` → 12px/18px)
- `cn()` 또는 `twMerge`로 합쳐지는 클래스도 추적
- 컴포넌트가 compound 구조인 경우 (예: SectionCard.Header, SectionCard.Content) 하위 컴포넌트도 각각 추출
- **`.tsx`에서 조건부 className 패턴을 반드시 추출**: `조건 && 'class'` 또는 `조건 ? 'classA' : 'classB'` 형태로 적용되는 상태별 스타일
- **인라인 SVG 아이콘의 디자인 속성을 반드시 비교**: viewBox, path, strokeWidth가 TDS Tabler Icons와 시각적으로 동일한지
