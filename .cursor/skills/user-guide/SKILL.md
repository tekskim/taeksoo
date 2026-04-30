---
name: user-guide
description: >-
  Create or improve user-guide documentation from implemented TDS/thaki-ui
  screens, using manifest-driven page capture and Figma generation for guide
  sections that stay aligned with the running product.
---

# user-guide

구현된 화면을 기준으로 사용자 가이드 초안 또는 보강본을 만들 때 사용하는 스킬입니다.
Slack에서 공유된 `wireframe-create` 방식처럼, 실제 실행 화면을 `generate_figma_design`으로 캡처해 가이드 산출물의 정합성을 높이는 것을 기본 워크플로우에 포함합니다.

## 사용 시점

- "user-guide", "사용자 가이드", "가이드 문서", "사용 흐름 문서화"를 요청받았을 때
- 이미 구현된 화면을 기준으로 기능별 사용 절차를 정리해야 할 때
- Figma에 사용자 가이드용 화면 세트, 설명, 흐름 화살표를 만들거나 갱신해야 할 때
- 기존 가이드가 코드/프로토타입 화면과 어긋나 실제 UI 기준으로 재정렬해야 할 때

## 비사용 시점

- 구현 전 와이어프레임만 만드는 작업 (`wireframe-create` 또는 Figma 디자인 생성 워크플로우 사용)
- 단순 텍스트 릴리즈 노트 작성
- API 명세나 개발자 SDK 문서 작성
- 디자인 시스템 컴포넌트 자체를 수정하는 작업

## 핵심 원칙

1. **실제 구현 화면 기준**: 설명은 코드나 추측이 아니라 실행 가능한 화면 상태를 기준으로 작성합니다.
2. **매니페스트 우선**: 어떤 화면을 어떤 순서와 조건으로 캡처할지 매니페스트에 먼저 고정합니다.
3. **결정론적 ID 유지**: 반복 실행해도 같은 화면/단계는 같은 ID를 사용해 Figma와 문서 갱신 정합성을 유지합니다.
4. **편집 가능한 Figma 산출물**: 단순 이미지 붙여넣기가 아니라, 가능한 경우 Figma에서 편집 가능한 노드 구조로 생성/배치합니다.
5. **사용자 흐름 단위 구성**: 각 가이드 단계는 `기본 화면 + 설명 + 주요 액션 표시 + 다음 단계 화살표`를 한 세트로 관리합니다.

## 입력

가능하면 아래 정보를 먼저 수집합니다.

| 입력 | 예시 | 필수 |
| --- | --- | --- |
| 가이드 대상 기능 | Log alert policy creation | 예 |
| 대상 URL 또는 라우트 | `/monitoring/log-alerts/create` | 예 |
| 사용자 흐름 | 목록 -> 생성 -> 조건 설정 -> 저장 -> 상세 확인 | 예 |
| 주요 사용자 역할 | Project admin, Viewer | 아니오 |
| Figma 대상 | 파일 URL, page/frame 이름 | Figma 산출물이 필요하면 예 |
| 캡처 매니페스트 경로 | `manifests/log-alert-user-guide.yaml` | 없으면 생성 |

정보가 부족하면 한 번에 필요한 항목만 짧게 질문합니다.

## 권장 파일 구조

```text
manifests/
  <feature>-user-guide.yaml
docs/user-guides/
  <feature>.md
```

이미 프로젝트에 다른 가이드/매니페스트 위치가 있으면 기존 위치를 우선합니다.

## 매니페스트 스키마

```yaml
guideId: log-alert
title: Log Alert User Guide
baseUrl: http://localhost:3000
figma:
  fileKey: "<figma-file-key>"
  pageName: "User Guides"
  frameName: "Log Alert"
screens:
  - id: log-alert.list
    title: "Open log alerts"
    route: "/monitoring/log-alerts"
    captureName: "01-log-alert-list"
    description: "Review existing alert policies before creating a new one."
    actions:
      - type: click
        target: "Create alert"
        note: "Start creating a new alert policy."
  - id: log-alert.create.basic
    title: "Enter basic information"
    route: "/monitoring/log-alerts/create"
    captureName: "02-create-basic-info"
    description: "Enter a policy name and choose the target project."
    highlight:
      - "Policy name"
      - "Project"
flow:
  - from: log-alert.list
    to: log-alert.create.basic
    label: "Create alert"
```

### 매니페스트 규칙

- `guideId`는 kebab-case로 작성합니다.
- `screens[].id`는 `<feature>.<screen>[.<state>]` 형태로 결정론적으로 작성합니다.
- `captureName`은 정렬 가능한 숫자 prefix를 붙입니다. 예: `01-list`, `02-create-basic`.
- `route`와 `actions`는 실제 브라우저에서 재현 가능한 값으로 작성합니다.
- 같은 화면의 모달/드로어/탭 상태는 별도 `screens[].id`로 분리합니다.
- 텍스트 설명은 사용자가 해야 할 행동과 결과 중심으로 작성합니다.

## 워크플로우

### 1단계: 대상 기능과 현재 구현 확인

1. 라우트, 페이지 컴포넌트, 메뉴 진입점을 확인합니다.
2. 실제 실행에 필요한 dev server, seed data, feature flag를 확인합니다.
3. 기존 가이드 문서나 Figma 산출물이 있으면 구조와 명명 규칙을 확인합니다.

### 2단계: 매니페스트 작성/갱신

1. 사용자 흐름을 화면 단위로 나눕니다.
2. 각 화면에 결정론적 `id`, `title`, `route`, `description`, `actions`를 부여합니다.
3. 분기/반복/오류 상태는 `flow`에 명시하거나 별도 screen으로 분리합니다.
4. 매니페스트만 보아도 캡처 순서와 가이드 구조를 재현할 수 있어야 합니다.

### 3단계: 구현 화면 캡처 준비

1. 앱을 로컬에서 실행합니다.
2. 필요한 테스트 데이터 또는 상태를 준비합니다.
3. 화면이 TDS Figma 캡처 모드를 지원해야 하는 경우 `figma-capture-mode` 스킬을 함께 적용합니다.
4. 캡처 전 불안정한 값(현재 시간, 랜덤 ID, 로딩 지연)은 가능하면 fixture나 고정 데이터로 안정화합니다.

### 4단계: `generate_figma_design`으로 화면 생성

Figma 산출물이 필요한 경우 이 단계를 기본으로 수행합니다.

1. 매니페스트의 `screens` 순서대로 대상 화면을 브라우저에서 엽니다.
2. 각 화면 상태가 준비되면 `generate_figma_design`으로 실제 렌더링 결과를 Figma 디자인으로 생성합니다.
3. 생성 결과는 화면별 섹션 안에 배치합니다.
4. 단순 screenshot reference가 필요한 경우에도 파일명과 Figma 노드명을 `screens[].captureName`과 맞춥니다.

> Figma MCP를 사용할 때는 현재 환경의 Figma 관련 스킬 지침을 따릅니다.
> `generate_figma_design`을 호출해야 하면 Figma generate-design 스킬을 먼저 읽고,
> `use_figma`로 노드를 조작해야 하면 `figma-use` 스킬도 먼저 읽습니다.

### 5단계: 사용자 가이드 레이아웃 구성

각 screen을 아래 세트로 정리합니다.

```text
[Step number + title]
[Generated screen]
[Description]
[Action callout / highlight]
[Flow arrow to next step]
```

구성 규칙:

- Figma frame 이름: `{NN}. {screens[].title}`
- 주요 조작 위치는 callout 또는 highlight로 표시합니다.
- `flow` 항목이 있으면 화살표와 label을 배치합니다.
- 설명은 화면 아래 또는 오른쪽에 일관되게 배치합니다.
- 반복 실행 시 기존 `screens[].id`에 해당하는 frame을 갱신하고 중복 생성하지 않습니다.

### 6단계: 문서 초안 생성

Markdown 가이드는 아래 구조를 기본으로 합니다.

```markdown
# {title}

## Overview

이 가이드에서 완료할 수 있는 작업과 전제 조건을 설명합니다.

## Before you begin

- 필요한 권한
- 필요한 리소스
- 주의해야 할 제약

## Steps

### 1. {screens[0].title}

{screens[0].description}

### 2. {screens[1].title}

{screens[1].description}

## Result

완료 후 사용자가 확인해야 할 상태를 설명합니다.

## Troubleshooting

자주 발생하는 오류, 빈 상태, 권한 부족 상태를 정리합니다.
```

### 7단계: 정합성 검증

아래를 확인한 뒤 결과를 보고합니다.

| 항목 | 확인 방법 |
| --- | --- |
| 화면 재현성 | 매니페스트 순서대로 화면을 열어 캡처가 가능한지 확인 |
| 설명 정합성 | 문서의 버튼명/필드명/상태명이 실제 UI와 같은지 확인 |
| Figma 정합성 | 각 `screens[].id`가 하나의 frame/section에 대응하는지 확인 |
| 흐름 정합성 | `flow` 화살표가 실제 사용자 이동 순서와 일치하는지 확인 |
| 반복 실행 안정성 | 같은 ID가 중복 frame을 만들지 않고 갱신 대상으로 식별되는지 확인 |

## 산출물 보고 형식

작업 완료 시 아래 형식으로 보고합니다.

```markdown
## User Guide Update

### Created/Updated
- `manifests/<feature>-user-guide.yaml`
- `docs/user-guides/<feature>.md`
- Figma: `<file/page/frame>`

### Captured Screens
| ID | Title | Route | Result |
| --- | --- | --- | --- |
| log-alert.list | Open log alerts | /monitoring/log-alerts | pass |

### Verification
- pass: local guide flow reproduced from manifest
- pass: Figma frames use deterministic screen IDs
- pass: guide text matches visible UI labels
```

## Guardrails

- 화면/문서 산출물은 실제 구현과 다른 UI를 상상해서 만들지 않습니다.
- 캡처 실패 화면을 성공 산출물로 저장하지 않습니다.
- 매니페스트 없이 여러 화면을 임의 순서로 캡처하지 않습니다.
- 기존 Figma frame을 갱신할 때 `screens[].id` 매칭 없이 이름만으로 덮어쓰지 않습니다.
- 사용자가 외부 서비스에 공유하라고 명시하지 않는 한 Slack, Notion, Figma 댓글에 메시지를 남기지 않습니다.
- 제품 용어는 실제 UI label을 우선하고, 불명확하면 `[unknown]`으로 표시합니다.
