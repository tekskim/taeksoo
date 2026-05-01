# TDS SSOT — Workspace

ThakiCloud Design System(TDS) SSOT 및 UI 프로토타입 작업 공간.

## 프로젝트 구조

| 경로                          | 역할                                 |
| ----------------------------- | ------------------------------------ |
| `src/`                        | TDS 컴포넌트 및 프로토타입 페이지    |
| `src/pages/DesktopPage.tsx`   | Desktop UI v0.7 목업                 |
| `src/pages/DesktopPageV1.tsx` | Desktop UI v1.0 목업 (`/desktop-v1`) |
| `.cursor/skills/`             | 에이전트 자동화 스킬                 |

## 개발 서버

```bash
# 개발 서버 시작 (포트 5173)
export PATH="/home/ubuntu/.nvm/versions/node/v22.22.2/bin:$PATH"
cd /workspace && pnpm run dev

# 서버가 실행 중이면 재시작 불필요 — 파일 변경 시 HMR 자동 반영
# HMR 캐시 문제 시: 서버 재시작 (PID 확인 후 kill + pnpm run dev)
```

## 스킬 목록

| 스킬                  | 위치                                  | 사용 시점                               |
| --------------------- | ------------------------------------- | --------------------------------------- |
| `wireframe-create`    | `.cursor/skills/wireframe-create/`    | 프로토타입 → Figma 화면기획서 자동 생성 |
| `figma-capture-mode`  | `.cursor/skills/figma-capture-mode/`  | TDS 페이지에 Figma 캡처 모드 추가       |
| `tds-design-apply`    | `.cursor/skills/tds-design-apply/`    | 디자인 스펙을 컴포넌트에 반영           |
| `planner-mockup-page` | `.cursor/skills/planner-mockup-page/` | 자연어 → 목업 페이지 스캐폴딩           |

## Cursor Cloud 특화 지침

### 개발 서버 실행 확인

```bash
# 서버가 이미 실행 중인지 확인
curl -s http://localhost:5173 | head -3
# → HTML 반환이면 실행 중, 연결 오류면 시작 필요
```

### Puppeteer 실행 위치

캡처 스크립트는 반드시 `/workspace` 디렉토리에서 실행해야 `puppeteer` 모듈을 찾습니다:

```bash
cd /workspace && node .cursor/skills/wireframe-create/scripts/capture.cjs ...
```

### Figma MCP 사용 시

- `use_figma` 호출 전 반드시 `figma-use` skill 읽기
- 페이지 전환 시 반드시 `await figma.setCurrentPageAsync(page)` 사용
- 섹션 `appendChild` 시 Mona Sans 에러 발생 → 섹션 없이 targetPage에 직접 배치

### 테스트

```bash
# 타입/빌드 확인 (rspack 기반)
export PATH="/home/ubuntu/.nvm/versions/node/v22.22.2/bin:$PATH"
cd /workspace && pnpm run build
```
