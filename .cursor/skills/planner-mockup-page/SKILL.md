---
name: planner-mockup-page
description: 기획자가 자연어로 원하는 화면을 설명하면 @thaki/shared 컴포넌트를 매핑하고 목업 페이지 스캐폴딩 코드를 생성한다. 비개발자의 바이브코딩 지원용. Figma나 API 없이 자연어만으로 동작하는 화면 프로토타입을 만들 때 사용한다.
---

# planner-mockup-page

## 사용 시점

- 기획자(비개발자)가 원하는 화면을 자연어로 설명할 때
- Figma 와이어프레임 없이 빠르게 화면 프로토타입을 만들 때
- `@thaki/shared` 디자인 시스템으로 동작하는 목업 UI가 필요할 때

## 비사용 시점

- Figma 기반 구현이 필요한 경우 (`pattern-list-page`, `pattern-detail-page` 사용)
- API 연동이 필요한 실제 기능 구현 (`thaki-ui-mfe-edit` 사용)
- 디자인 시스템 컴포넌트 자체를 수정하는 경우 (`thaki-shared-design-system-change` 사용)

## 필수 입력

- 기획자의 자연어 화면 설명 (1문장 이상)

## 레퍼런스 파일

- `reference/component-catalog.md` — 컴포넌트 용도/쓰임새/props 전체 카탈로그
- `reference/page-patterns.md` — 7가지 유즈케이스 패턴 + 스캐폴딩 코드

## 워크플로

### 1단계: 요구사항 추출

기획자 입력에서 아래 항목을 추출한다.

- **페이지 유형**: 리스트 / 상세 / 생성(위저드) / 설정 / 모달 / 드로어 / 대시보드
- **데이터 항목**: 어떤 데이터를 보여줘야 하는지 (컬럼, 필드, 속성)
- **액션**: 사용자가 할 수 있는 동작 (생성, 삭제, 수정, 필터링 등)
- **상태**: 표시해야 하는 상태값 (활성/비활성, 진행중/완료 등)
- **구조**: 탭, 섹션, 단계 등 화면 구조

추출이 모호한 경우 기획자에게 명확히 질문한다.

### 2단계: 패턴 매칭

`reference/page-patterns.md`의 7가지 패턴과 매칭한다.

- **패턴 1**: 리스트 페이지 — "목록", "테이블", "검색", "필터"
- **패턴 2**: 상세 페이지 — "상세", "탭", "속성", "정보"
- **패턴 3**: 생성/편집 페이지 — "만들기", "생성", "등록", "단계별", "위저드"
- **패턴 4**: 설정 페이지 — "설정", "환경설정", "정책"
- **패턴 5**: 확인/삭제 모달 — "삭제 확인", "경고", "확인 팝업"
- **패턴 6**: 편집 드로어 — "수정 패널", "할당", "사이드 패널"
- **패턴 7**: 대시보드 — "대시보드", "요약", "현황", "모니터링"

복합 요구사항이면 여러 패턴을 조합한다. (예: 리스트 + 삭제 모달 + 편집 드로어)

### 3단계: 컴포넌트 매핑

`reference/component-catalog.md`에서 각 영역에 적합한 컴포넌트를 선택한다.

매핑 시 필수 규칙:

- deprecated 컴포넌트 사용 금지: `Accordion`, `Table`, `SelectableTable`, `ExpandableTable`
- 아코디언이 필요하면 `TcAccordion`/`TcAccordionGroup`을 사용
- 테이블이 필요하면 `TcTable`을 사용
- 생성 플로우는 `Stepper`를 사용 (Accordion 기반 스텝 금지)

### 4단계: 매핑 제안

기획자에게 아래 형식으로 매핑 결과를 제안한다.

```
## 제안 구성

**페이지 유형**: [매칭된 패턴]

**컴포넌트 조합**:
- 상단: [컴포넌트 → 역할]
- 본문: [컴포넌트 → 역할]
- 하단: [컴포넌트 → 역할]
- (모달/드로어가 있으면 별도 표시)

**더미 데이터**: [컬럼/필드 목록]

이대로 만들까요?
```

기획자가 수정을 요청하면 반영 후 다시 제안한다.

### 5단계: 스캐폴딩 생성

확인된 매핑을 기반으로 TSX 파일을 생성한다.

생성 규칙:

- 모든 import는 `@thaki/shared`에서 가져온다
- 모든 데이터는 파일 상단 상수로 정의한다 (API 호출 없음)
- `useState`로 인터랙션 상태를 관리한다 (페이지 전환, 탭, 토글 등)
- i18n 없이 한국어 문자열을 직접 사용한다
- 커스터마이즈 포인트에 `// --- 커스터마이즈: ... ---` 주석을 남긴다
- 페이지, 모달, 드로어는 각각 독립 컴포넌트로 만든다

### 6단계: 결과 보고

생성 완료 후 아래를 보고한다.

- 생성된 파일 목록
- 사용된 `@thaki/shared` 컴포넌트 목록
- 커스터마이즈 가능한 포인트 (더미 데이터, 컬럼, 탭, 필터 등)
- 기획자가 다음에 조정할 수 있는 항목 안내

## Verification checklist (synchronized)

When this skill is extended with `mini-mfe-from-prompt` for a desktop-runnable mock app, run and verify in this exact format:

Run in order:

1. `pnpm i --no-frozen-lockfile` (if new package/deps were added)
2. `pnpm lint:rules`
3. `pnpm --filter @thaki/<app> build`
4. `pnpm <app>` and `pnpm platform` (restart `platform` if already running)
5. Confirm desktop app icon appears in `AppList` and launching opens frame with loaded remote.
6. If icon does not appear, verify all of:
   - `suite_<app>` exists in `REMOTE_APP_SEEDS` (`appStore.ts`)
   - `suite_<app>` mapping exists in `APP_MANIFEST_REMOTE_KEY_CANDIDATES`
   - `<app>` remote exists in `packages/platform/public/mf-manifest.json`
   - app id ordering/icon mapping in desktop consts (`DESKTOP_APP_ORDER`, icon map)
7. If runtime errors occur, check and fix first:
   - `No QueryClient set` -> missing `QueryClientProvider`
   - `No PostCSS config found` -> missing `postcss.config.cjs` / `tailwind.config.js`
   - `EADDRINUSE` -> port already occupied, kill existing process then restart

Report each command as:

- `pass`: success
- `fail`: with first actionable error
- `skip`: with reason

## 금지 사항

- API 호출, `fetch`, TanStack Query 등 서버 상태 연동
- deprecated 컴포넌트 사용 (`Accordion`, `Table`, `SelectableTable`, `ExpandableTable`)
- `@thaki/shared` 이외의 패키지 import (패키지 로컬 컴포넌트 포함)
- i18n 키 사용 (목업에서는 한국어 직접 문자열 허용)
- react-hook-form, zod 등 폼 라이브러리 사용 (목업이므로 `useState`로 충분)
- 기획자의 요구사항을 임의 해석하여 확인 없이 컴포넌트를 추가하는 행위
