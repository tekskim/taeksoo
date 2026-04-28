# Known Issues

## thaki-shared 마이그레이션 시 Tailwind 색상 유틸리티 누락

- **Symptom**: thaki-shared 컴포넌트(Table, Checkbox 등)의 배경색/텍스트색이 적용되지 않아 흰색/투명으로 보임
- **Root cause (Type 1 — Context Gap)**: `tailwind.config.cjs`에 thaki-shared 컴포넌트가 사용하는 Tailwind 유틸리티 클래스의 색상 키가 누락됨. 예) `surface-subtle` 키가 없으면 `bg-surface-subtle` CSS 클래스가 생성되지 않아 테이블 헤더 배경이 transparent로 폴백
- **Secondary cause**: CSS 변수 네이밍 불일치 — 기존 config가 kebab-case(`--semantic-color-surface-muted`)를 사용했으나, thaki-shared는 camelCase(`--semantic-color-surfaceMuted`)를 기대
- **Fix pattern**:
  1. `tailwind.config.cjs`의 `theme.extend.colors`를 `thaki-shared-v2/tailwind.preset.js`에 맞춰 전체 업데이트
  2. CSS 변수 네이밍을 camelCase로 통일
  3. 누락된 확장 토큰 추가 (`background`, `surface-pressed`, `error-weak-bg`, `text-default`, `text-on-fill`, `text-strong`)
- **Prevention**: `node scripts/validate-tailwind-colors.cjs` 실행하여 thaki-shared 컴포넌트가 사용하는 모든 색상 유틸리티가 config에 매핑되어 있는지 검증
- **Date**: 2026-04-09

## Figma → TDS 페이지 재현 시 반복 실수 패턴 (5건)

### 1. 아이콘 임의 선택

- **Symptom**: Figma 커스텀 아이콘(Icon/Copy, Icon/Request)을 확인하지 않고 Tabler Icons에서 비슷해 보이는 것을 임의 선택 (IconThumbUp 등)
- **Root cause (Type 1 — Context Gap)**: Figma MCP에서 아이콘 SVG 원본을 다운로드하지 않고 이름만 보고 추측
- **Fix pattern**: Figma에서 아이콘의 SVG asset을 반드시 다운로드하여 path 형태를 확인한 후, 가장 일치하는 Tabler icon을 매칭. TDS에 없으면 명시적으로 보고
- **Prevention**: 아이콘 매칭 시 반드시 `get_design_context`로 SVG 원본 확인 → Read로 SVG path 분석 → Tabler icon 매칭

### 2. TDS 컴포넌트 미사용 (직접 div 구현)

- **Symptom**: InlineMessage, StatusIndicator 등 TDS에 이미 존재하는 컴포넌트를 직접 div+클래스로 재구현. 결과적으로 각 인스턴스마다 디자인이 달라짐
- **Root cause (Type 2 — Direction Error)**: TDS 컴포넌트 목록을 사전 확인하지 않고 바로 구현에 돌입
- **Fix pattern**: 구현 전 `@/design-system` export 목록에서 사용 가능한 컴포넌트를 먼저 확인
- **Prevention**: 경고/에러/정보 배너 → InlineMessage, 상태 표시 → StatusIndicator, 빈 상태 → EmptyState 등 매핑 테이블 참조

### 3. Figma 레이아웃 속성 무시 (높이, 패딩, 라운드)

- **Symptom**: Figma에서 `rounded-[16px]`, `p-[16px]`, `bg-gray-200` 등 명확한 값이 있는데 임의의 값(border-t, 12px 텍스트 등)을 사용
- **Root cause (Type 2 — Direction Error)**: `get_design_context`에서 반환된 코드의 구체적 수치를 읽지 않고 "대충 비슷한" 스타일 적용
- **Fix pattern**: Figma MCP 코드 출력의 Tailwind 클래스에서 px 값, rounded 값, padding 값을 그대로 추출하여 적용
- **Prevention**: Figma 코드의 모든 수치(px)를 추출 목록으로 정리한 후 구현에 반영

### 4. stroke 두께 미확인 (아이콘)

- **Symptom**: Figma 아이콘의 stroke가 1px인데 Tabler 기본값(2)으로 렌더링 → 시각적 불일치
- **Root cause (Type 1 — Context Gap)**: SVG의 stroke-width를 확인하지 않음
- **Fix pattern**: SVG path 분석 시 strokeWidth/stroke 속성도 함께 확인하여 Tabler의 stroke prop에 반영
- **Prevention**: 아이콘 적용 시 항상 `stroke={N}` prop을 명시적으로 설정

### 5. 케이스별 조건 분기 누락

- **Symptom**: Figma에 여러 상태(empty, readonly, error 등)가 있는데 기본 케이스만 구현
- **Root cause (Type 1 — Context Gap)**: Figma 파일의 프레임을 하나만 보고 나머지를 확인하지 않음
- **Fix pattern**: `get_metadata`로 같은 섹션의 모든 프레임을 먼저 리스팅한 후, 케이스별로 `get_design_context` 호출
- **Prevention**: 페이지 구현 전 해당 섹션의 전체 프레임 목록을 먼저 확인하고 케이스 목록 작성

- **Date**: 2026-04-28
