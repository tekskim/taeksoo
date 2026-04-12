---
name: project-workflows
description: Project-specific automation workflows for the myRepository (TDS/thaki-ui) project. Use when working in this specific project and needing to automate TDS design sync, component release, token updates, PR creation for design system changes, or Notion documentation for TDS components. Combines GitHub (ThakiCloud/thaki-shared, thaki-ui), Notion (TDS docs), and Figma (TDS components).
---

# Project Workflows — myRepository (TDS)

이 프로젝트(`myRepository`)는 ThakiCloud 디자인 시스템(TDS)의 SSOT 및 UI 컴포넌트 작업 공간입니다.

## 연결된 레포

| 레포                      | 역할                    |
| ------------------------- | ----------------------- |
| `ThakiCloud/thaki-shared` | TDS 컴포넌트 라이브러리 |
| `ThakiCloud/thaki-ui`     | 플랫폼 웹 앱            |
| `ThakiCloud/tds_ssot`     | 디자인 토큰 SSOT        |
| `ThakiCloud/ai-suite`     | AI 플랫폼               |

## 워크플로우 1: TDS 컴포넌트 변경 → PR 생성

```bash
# 1. 현재 브랜치 상태 확인
git status && git log --oneline -5

# 2. 변경된 컴포넌트 확인
git diff --name-only

# 3. PR 생성 (ThakiCloud/thaki-shared)
gh pr create \
  --repo ThakiCloud/thaki-shared \
  --title "feat(TDS): <컴포넌트명> 변경사항" \
  --body "## Summary
- 변경 내용

## Changes
-

## Test Plan
- [ ] Storybook 확인
- [ ] 기존 사용처 regression 테스트" \
  --base main
```

## 워크플로우 2: 디자인 토큰 업데이트

```bash
# 1. 토큰 파일 확인
cat src/styles/tokens/index.css

# 2. tailwind preset 확인
cat tailwind.preset.js

# 3. 변경사항 커밋
git add src/styles/tokens/index.css tailwind.preset.js
git commit -m "chore(tokens): <토큰명> 업데이트"
```

## 워크플로우 3: Figma → TDS 컴포넌트 구현

```
1. tds-design-extract 스킬 → Figma에서 컴포넌트 스펙 추출
2. tds-design-apply 스킬 → 코드에 TDS 패턴 적용
3. tds-design-evaluate 스킬 → 구현 품질 평가
4. PR 생성 (Workflow 1 참조)
5. Notion에 컴포넌트 문서 업데이트
```

## 워크플로우 4: 컴포넌트 문서 → Notion

```
1. 컴포넌트 코드 분석 (props, 사용법)
2. notion-search "TDS <컴포넌트명>" → 기존 문서 확인
3. notion-create-pages 또는 notion-update-page:
   - 컴포넌트 설명
   - Props 테이블
   - 사용 예시
   - 디자인 토큰 참조
```

## 워크플로우 5: 스프린트 계획 → Notion

```bash
# 1. 현재 열린 이슈 조회
gh issue list --repo ThakiCloud/thaki-ui --state open \
  --label "sprint" --json number,title,labels,assignees

# 2. Notion 스프린트 페이지 생성
notion-create-pages:
  title: "Sprint <번호> — <날짜>"
  content: |
    ## Goals

    ## Issues
    <이슈 목록>

    ## TDS Tasks
```

## 워크플로우 6: 릴리즈 → 전체 알림

```bash
# 1. 릴리즈 생성
gh release create v<x.y.z> \
  --repo ThakiCloud/thaki-shared \
  --generate-notes \
  --title "TDS v<x.y.z>"

# 2. Notion 릴리즈 기록
# 3. Slack 공지 (slack-thakicloud 스킬)
```

## 현재 프로젝트 파일 구조

```
myRepository/
├── src/
│   ├── styles/tokens/index.css   ← 디자인 토큰
│   └── ...
├── tailwind.preset.js             ← Tailwind 프리셋
└── .cursor/
    ├── rules/                     ← TDS 규칙
    └── skills/                    ← 프로젝트 스킬
```

## 자주 쓰는 gh 명령어 (이 레포 기준)

```bash
# 현재 레포 PR
gh pr list --state open

# 이슈 생성 (TDS 관련)
gh issue create \
  --title "[TDS] <컴포넌트/토큰> 이슈" \
  --label "TDS,frontend" \
  --body "## 문제\n\n## 해결 방안\n"

# PR → main 머지 상태 확인
gh pr checks <number>
```
