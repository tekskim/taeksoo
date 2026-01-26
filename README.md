# TDS (THAKI Design System) - SSOT

TDS SSOT 저장소는 Thaki Cloud 서비스 전반에 사용되는 디자인 시스템의 **Single Source of Truth**입니다. 모든 UI 컴포넌트, 디자인 토큰, 스타일 가이드를 한 곳에서 관리하며, 프로덕션 환경에 반영하기 위한 프로토타입과 컴포넌트 라이브러리 역할을 합니다.

## 주요 기술 스택 및 버전

- **Node.js**: v22.14.x (LTS)
- **pnpm**: v10.8.x (루트 `package.json`의 `packageManager` 참고)
- **TypeScript**: ~5.9
- **React**: ^18 || ^19
- **Rspack**: ^1.7 (번들링/개발 서버)
- **Vite**: ^5.4 (라이브러리 빌드/Storybook)
- **Tailwind CSS**: v4
- ESLint / Prettier (코드 품질 관리)

> 반드시 지정된 Node.js 및 pnpm 버전을 사용해 주세요. `.nvmrc` 파일을 참고하세요.

## 레포지토리 구조

```
tds/
├── .cursor/              # Cursor IDE 설정 및 규칙
├── .github/              # GitHub Actions 워크플로우
├── .husky/               # Git hooks (pre-commit)
├── .storybook/           # Storybook 설정
├── .vscode/              # VS Code 설정
├── scripts/              # 빌드 스크립트 (토큰 생성 등)
├── src/
│   ├── design-system/    # 디자인 시스템 컴포넌트
│   │   ├── components/   # UI 컴포넌트 (50+)
│   │   ├── hooks/        # 커스텀 훅
│   │   ├── layouts/      # 레이아웃 컴포넌트
│   │   ├── tokens/       # 디자인 토큰 (Storybook 문서)
│   │   └── utils/        # 유틸리티 함수
│   ├── pages/            # 데모/프로토타입 페이지
│   └── tokens/           # 디자인 토큰 JSON 원본
├── docs/                 # 빌드된 데모 사이트 (GitHub Pages)
└── dist/                 # 빌드된 라이브러리
```

## 공용 설정

- **패키지 관리**: pnpm (`package.json`의 `packageManager` 필드)
- **TypeScript**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **ESLint / Prettier**: 루트 `eslint.config.js`, `.prettierrc`에서 공통 규칙 정의
- **디자인 토큰**: `src/tokens/*.json` → CSS Variables 자동 생성

## 개발 환경 준비

```bash
# Node.js 버전 설정 (nvm 사용 시)
nvm use

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## 실행 스크립트

루트 `package.json`에 정의된 주요 스크립트:

| 명령어               | 설명                          |
| -------------------- | ----------------------------- |
| `pnpm dev`           | 개발 서버 실행 (Rspack)       |
| `pnpm build`         | 프로덕션 빌드 (데모 사이트)   |
| `pnpm build:lib`     | 라이브러리 빌드 (npm 배포용)  |
| `pnpm storybook`     | Storybook 실행                |
| `pnpm test`          | 테스트 실행 (watch 모드)      |
| `pnpm test:run`      | 테스트 1회 실행               |
| `pnpm test:coverage` | 테스트 커버리지 리포트        |
| `pnpm lint`          | ESLint 검사                   |
| `pnpm lint:fix`      | ESLint 자동 수정              |
| `pnpm format`        | Prettier 포맷팅               |
| `pnpm tokens`        | 디자인 토큰 빌드 (JSON → CSS) |
| `pnpm deploy`        | GitHub Pages 배포             |

## 디자인 토큰 시스템

디자인 토큰은 JSON 파일에서 정의하고 CSS Variables로 자동 변환됩니다:

```
src/tokens/
├── colors.json     # 색상 토큰
├── typography.json # 타이포그래피 토큰
├── spacing.json    # 간격 토큰
└── ...
```

토큰 빌드:

```bash
pnpm tokens
```

생성 결과:

- `src/tokens/generated/variables.css` - CSS Variables
- `src/tokens/generated/tailwind-preset.js` - Tailwind 프리셋

## 코드 품질

- ESLint + Prettier 조합을 사용하며, VS Code/Cursor 사용 시 저장 시 포맷 자동 적용
- `.vscode/settings.json` 및 `.vscode/extensions.json` 참고
- Pre-commit hook으로 lint-staged 자동 실행

## 🔒 보안 감사

### 수동 실행

```bash
# 보안 취약점 검사
pnpm audit

# 중간 이상 심각도만 검사
pnpm audit:check

# 자동 수정 시도
pnpm audit:fix
```

## 데모 및 문서

- **데모 사이트**: https://thakicloud.github.io/tds_ssot/
- **Storybook**: `pnpm storybook` 실행 후 http://localhost:6006

## 프로덕션 연동

이 SSOT에서 정의된 컴포넌트와 토큰은 프로덕션([thaki-ui](https://github.com/ThakiCloud/thaki-ui))에 반영됩니다:

1. **디자인 토큰**: SSOT의 토큰 값을 프로덕션에 동기화
2. **컴포넌트 인터페이스**: Props 인터페이스 통일 후 코드 이식
3. **스타일 가이드**: SSOT의 디자인 결정사항을 프로덕션에 적용

## 참고

- 컴포넌트 사용법은 Storybook 문서 또는 `src/design-system/components/` 참고
- Cursor IDE 사용 시 `.cursor/rules/tds-design-system.mdc` 규칙 자동 적용
- 새로운 컴포넌트 추가 시 본 문서 및 Storybook 최신 상태 유지

---

코드 일관성을 위해 ESLint와 Prettier를 사용합니다:

- **ESLint**: 코드 린팅
- **Prettier**: 코드 포맷팅
- **에디터 설정**: 저장 시 자동 포맷팅
