# TDS 기여 가이드

TDS(THAKI Design System)에 기여하기 위한 개발 환경 셋업, 브랜치 전략, 코드 스타일, 컴포넌트 개발 프로세스, 릴리스 규칙을 정리합니다.

---

## 개발 환경 셋업

### 필수 도구

| 도구    | 버전      | 설치                   |
| ------- | --------- | ---------------------- |
| Node.js | ≥ 22.14.0 | `nvm install 22`       |
| pnpm    | ≥ 10.8.0  | `corepack enable pnpm` |
| Git     | 최신      | —                      |

### 초기 설정

```bash
# 1. 저장소 클론
git clone https://github.com/ThakiCloud/tds_ssot.git
cd tds_ssot

# 2. Node 버전 설정
nvm use

# 3. 의존성 설치
pnpm install

# 4. 토큰 빌드
pnpm tokens

# 5. 개발 서버 실행
pnpm dev          # http://localhost:5173
```

### 주요 명령어

| 명령어               | 설명                              |
| -------------------- | --------------------------------- |
| `pnpm dev`           | Rspack 개발 서버                  |
| `pnpm dev:vite`      | Vite 개발 서버 (대체)             |
| `pnpm build`         | 프로덕션 빌드                     |
| `pnpm build:lib`     | 라이브러리 빌드 (npm 배포용)      |
| `pnpm storybook`     | Storybook (http://localhost:6006) |
| `pnpm tokens`        | 디자인 토큰 빌드                  |
| `pnpm test`          | 테스트 (watch 모드)               |
| `pnpm test:run`      | 테스트 (단일 실행)                |
| `pnpm test:coverage` | 커버리지 포함 테스트              |
| `pnpm lint`          | ESLint 검사                       |
| `pnpm lint:fix`      | ESLint 자동 수정                  |
| `pnpm format`        | Prettier 포맷팅                   |
| `pnpm format:check`  | Prettier 검사만                   |

### 에디터 설정

VS Code 권장 설정이 `.vscode/` 디렉토리에 포함되어 있습니다. 프로젝트를 열면 자동 적용됩니다.

---

## 브랜치 전략 및 PR 프로세스

### 브랜치 네이밍

```
feature/{기능명}     # 새 기능
fix/{버그명}         # 버그 수정
refactor/{대상}      # 리팩토링
docs/{문서명}        # 문서 작업
chore/{작업명}       # 빌드, 설정 등
```

### PR 프로세스

1. `main` 에서 새 브랜치 생성
2. 작업 완료 후 PR 생성
3. PR 템플릿(`.github/pull_request_template.md`) 작성
4. 셀프 리뷰 완료
5. 리뷰어 지정
6. 승인 후 머지

### PR 체크리스트

- [ ] 스타일 가이드 준수 (`.cursor/rules/tds-design-system.mdc`)
- [ ] 셀프 리뷰 완료
- [ ] 관련 문서 업데이트
- [ ] 콘솔 경고/에러 없음
- [ ] 테스트 통과

---

## 코드 스타일

### ESLint + Prettier

프로젝트에 ESLint와 Prettier가 설정되어 있습니다. Pre-commit hook(Husky + lint-staged)이 커밋 시 자동으로 검사합니다.

```bash
# 수동 실행
pnpm lint          # 검사
pnpm lint:fix      # 자동 수정
pnpm format        # 포맷팅
```

### 커밋 메시지 컨벤션

```
<type>: <description>

[optional body]
```

| Type       | 설명                         |
| ---------- | ---------------------------- |
| `feat`     | 새 기능                      |
| `fix`      | 버그 수정                    |
| `refactor` | 리팩토링 (기능 변경 없음)    |
| `style`    | 코드 스타일 변경 (포맷팅 등) |
| `docs`     | 문서 변경                    |
| `test`     | 테스트 추가/수정             |
| `chore`    | 빌드, 설정, 의존성 등        |

### 주의사항

- TypeScript strict 모드 사용
- `any` 타입 사용 최소화
- 컴포넌트 props에 `interface` + JSDoc 주석 작성
- CSS 하드코딩 금지 — 디자인 토큰(CSS 변수) 사용

---

## 컴포넌트 개발 가이드

### 파일 구조

새 컴포넌트를 추가할 때 다음 구조를 따릅니다:

```
src/design-system/components/
└── {ComponentName}/
    ├── {ComponentName}.tsx           # 컴포넌트 구현
    ├── {ComponentName}.stories.tsx   # Storybook 스토리
    └── {ComponentName}.a11y.test.tsx # 접근성 테스트
```

### 체크리스트

새 컴포넌트를 추가할 때 반드시 다음을 완료합니다:

- [ ] **컴포넌트 구현** — `src/design-system/components/{Name}/{Name}.tsx`
  - Props interface 정의 (`export interface {Name}Props`)
  - `twMerge` 사용 (className 합성)
  - 디자인 토큰 CSS 변수 사용 (하드코딩 금지)
  - 적절한 ARIA 속성 및 role 설정 (ACCESSIBILITY.md 참조)

- [ ] **Export 등록** — `src/design-system/index.ts`에 추가

  ```tsx
  export { ComponentName } from './components/ComponentName/ComponentName';
  export type { ComponentNameProps } from './components/ComponentName/ComponentName';
  ```

- [ ] **Storybook 스토리** — `{Name}.stories.tsx`
  - Default 스토리 + 주요 variant별 스토리
  - Props 설명 포함

- [ ] **접근성 테스트** — `{Name}.a11y.test.tsx`

  ```tsx
  import { render } from '@testing-library/react';
  import { axe, toHaveNoViolations } from 'vitest-axe';
  import { ComponentName } from './ComponentName';

  expect.extend(toHaveNoViolations);

  describe('ComponentName a11y', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ComponentName />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
  ```

- [ ] **디자인 시스템 페이지** — `src/pages/design/components/{Name}Page.tsx`
  - `ComponentPageTemplate` 사용
  - preview, usage, examples, guidelines, tokens, apiReference 포함

- [ ] **Cursor 규칙 업데이트** — `.cursor/rules/tds-design-system.mdc`
  - 컴포넌트 목록에 추가
  - 토큰이 있으면 컴포넌트 토큰 섹션에 추가
  - 사용법 섹션에 코드 예시 추가

- [ ] **CHANGELOG 기록** — `CHANGELOG.md`의 `[Unreleased]`에 추가

### 컴포넌트 구현 규칙

```tsx
// 1. Props interface — export하여 외부에서 타입 사용 가능
export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** 버튼 variant */
  variant?: 'primary' | 'secondary' | 'muted' | 'ghost' | 'outline' | 'danger';
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
}

// 2. CSS 변수 사용 (하드코딩 금지)
className="bg-[var(--color-surface-default)] text-[var(--color-text-default)]"

// 3. twMerge로 className 합성
className={twMerge('base-classes', variantClasses, className)}

// 4. Compound Component 패턴 (필요 시)
ComponentName.SubComponent = SubComponent;
```

---

## 토큰 변경 가이드

디자인 토큰을 추가하거나 수정할 때의 프로세스입니다.

### 프로세스

```
1. tokens/*.json 수정
   ↓
2. pnpm tokens (빌드)
   ↓
3. 생성된 CSS 확인
   ↓
4. compatibility.css 확인 (새 토큰이면 별칭 추가 필요할 수 있음)
   ↓
5. .cursor/rules/tds-design-system.mdc 동기화
   ↓
6. CHANGELOG.md 기록
```

### 1단계: 토큰 수정

```bash
# light.json에 새 토큰 추가
vi tokens/light.json

# dark.json에도 동일 키로 다크 값 추가
vi tokens/dark.json
```

**규칙:**

- `primitive`: 새 색상 팔레트, 간격, 폰트 크기 추가
- `semantic`: 새 용도 토큰 추가 (primitive 참조)
- `component`: 새 컴포넌트 토큰 추가

### 2단계: 빌드

```bash
pnpm tokens
```

**출력 확인:**

- `src/styles/tokens/light.css` — 새 CSS 변수 추가됨
- `src/styles/tokens/dark.css` — 다크 값 추가됨
- `tailwind.preset.js` — Tailwind 확장 업데이트됨

### 3단계: Compatibility 별칭

새 semantic 토큰에 대해 `--color-*` 별칭이 필요하면 `build-tokens.js`의 `generateCompatibilityAliases()` 함수에 매핑을 추가합니다.

### 4단계: 규칙 동기화

`.cursor/rules/tds-design-system.mdc`의 해당 섹션을 업데이트합니다:

- **디자인 토큰** 섹션: 새 토큰 값 추가
- **컴포넌트 토큰** 섹션: 새 컴포넌트 토큰 추가
- **CSS 변수 사용 예시**: 새 변수 사용법 추가

### 5단계: CHANGELOG 기록

```markdown
## [Unreleased]

### Added

- 새 토큰 `--semantic-color-{name}` 추가 (용도 설명)
```

### 토큰 변경 유형별 버전 영향

| 변경 유형      | 버전      | 예시                                      |
| -------------- | --------- | ----------------------------------------- |
| 토큰 추가      | Minor     | 새 `--semantic-color-accent` 추가         |
| 토큰 값 변경   | Patch     | `--semantic-color-primary` 색상 미세 조정 |
| 토큰 이름 변경 | **Major** | `--color-text` → `--color-text-default`   |
| 토큰 삭제      | **Major** | `--color-old-token` 삭제                  |

---

## 릴리스 및 버전 관리

### Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH
  │     │     └── 버그 수정, 스타일 미세 조정 (호환성 유지)
  │     └──────── 새 기능 추가 (호환성 유지)
  └────────────── Breaking Change (호환성 깨짐)
```

### MAJOR (Breaking Change)

다음 변경은 MAJOR 버전을 올립니다:

- 컴포넌트 삭제
- 필수 prop 추가 또는 변경
- prop 이름 변경 또는 삭제
- 기본값 변경 (기존 동작에 영향)
- 토큰 삭제 또는 이름 변경
- import 경로 변경

### MINOR (새 기능)

- 새 컴포넌트 추가
- 기존 컴포넌트에 새 prop 추가 (선택적)
- 새 variant 추가
- 새 토큰 추가
- 새 유틸리티 함수 추가

### PATCH (버그 수정)

- 버그 수정
- 스타일 미세 조정
- 문서 수정
- 타입 수정
- 성능 개선 (API 변경 없음)

### CHANGELOG 작성

`CHANGELOG.md`에 변경 사항을 기록합니다.

**카테고리:**

| 카테고리       | 설명                 |
| -------------- | -------------------- |
| **Added**      | 새 기능, 새 컴포넌트 |
| **Changed**    | 기존 기능 변경       |
| **Deprecated** | 향후 제거 예정       |
| **Removed**    | 기능 삭제            |
| **Fixed**      | 버그 수정            |
| **Security**   | 보안 취약점 수정     |

**형식:**

```markdown
## [1.2.0] - 2026-03-01

### Added

- `Popover` 컴포넌트 추가 (#PR번호)
- `Button`에 `loading` prop 추가

### Fixed

- `Select` 드롭다운 위치 계산 버그 수정
- `Modal` ESC 키 이벤트 버블링 수정
```

### 릴리스 프로세스

```bash
# 1. CHANGELOG.md 업데이트 (버전, 날짜, 변경 사항)

# 2. package.json 버전 업데이트
# (수동 또는 pnpm version major/minor/patch)

# 3. 라이브러리 빌드 + 테스트
pnpm build:lib
pnpm test:run

# 4. 커밋 & 태그
git add .
git commit -m "release: v1.2.0"
git tag v1.2.0

# 5. 푸시
git push origin main --tags

# 6. npm 배포 (prepublishOnly가 build:lib + test:run 자동 실행)
pnpm publish
```

### 지원 정책

| 버전 | 상태            |
| ---- | --------------- |
| 1.x  | Active (현재)   |
| 0.x  | EOL (지원 종료) |
