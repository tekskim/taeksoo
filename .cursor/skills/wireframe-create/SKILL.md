---
name: wireframe-create
description: >-
  프로토타입/스크린샷 기반으로 구현 동기화 와이어프레임을 생성한다.
  상태 수집→캡처→와이어프레임 변환을 반복해 모든 사용자 가시 상태를 포함하고,
  결정론적 화면 ID를 부여한다.
  트리거: "와이어프레임 만들어", "wireframe-create", "화면기획서 생성",
  "Figma 와이어프레임", "[manifest]로 와이어프레임"
---

# wireframe-create

구현 상태를 반영한 와이어프레임을 Figma에 일관된 문서 구조로 생성/보강한다.

기본 구성(화면 세트 1개 기준):

- 메타데이터 행(화면명, 화면ID, 화면 경로)
- 메인 화면 와이어프레임
- 상태 변형(드로어/패널/오버레이)
- 우측 Description 패널
- 상태 전이 플로우 화살표

핵심 원칙은 "보이는 것을 그대로 그린다"이다. 추상화된 블록 목업이 아니라 실제 화면과 높은 시각적 일치도를 목표로 한다.

## 캡처 모드 (2-Track)

매니페스트 YAML이 있으면 **모드 A(자동)**, 없으면 **모드 B(수동)**으로 동작한다.

### 모드 선택 흐름

```
스킬 진입
  ├─ manifests/desktop-ui.yaml 존재? → 모드 A (자동)
  │   └─ 매니페스트에 없는 화면 추가 요청?
  │       ├─ YES → 해당 화면만 모드 B → 결과를 매니페스트에 추가
  │       └─ NO  → 매니페스트 전체 실행
  └─ NO → 모드 B (수동) → 완료 후 매니페스트 역생성 제안
```

### 모드 A: 매니페스트 기반 자동 캡처

매니페스트 파일 위치: `manifests/<package-name>.yaml`

#### 매니페스트 구조

```yaml
meta:
  package: <패키지명>
  base_url: "http://localhost:5173"
  figma_file_key: "<fileKey>"
  figma_page_name: "<Figma 페이지명>"
  capture_output_mode: existingFile

screens:
  - id: "<화면 ID>"           # 결정론적 ID
    name: "<화면명>"
    path: "<화면 경로>"
    figma_node_id: "<nodeId>" # 기존 프레임 ID. null이면 신규 생성
    capture:
      method: generate_figma_design  # 또는 playwright
      selector: "body"              # captureForDesign 범위 제한
      preconditions: [...]          # 캡처 전 선행 액션 (선택)
      viewport: { width: 1440, height: 900 }
    states:                         # 드로어/패널/오버레이 상태 변형
      - id: "<화면 ID>-S01"
        name: "<상태명>"
        type: overlay | drawer | modal
        figma_node_id: null
        capture:
          method: playwright        # 상태 변형은 항상 playwright
          preconditions: [...]      # 선행 조건 (선택)
          actions: [...]            # 트리거 액션 시퀀스
          viewport: { width: 1440, height: 900 }
    annotations:                    # 어노테이션 정의 (Desktop UI 전용)
      - label: "A"
        selector: "<CSS selector>"
        description: "<설명>"
        side: left
      - label: "1"
        position: { x: 200, y: 26 }  # selector 없을 때 DOM 좌표 직접 지정
        description: "<설명>"
```

#### 캡처 method 분기

| method | 사용 조건 | 도구 |
|---|---|---|
| `generate_figma_design` | URL만으로 접근 가능한 기본 페이지 | Figma MCP `generate_figma_design` |
| `playwright` | 클릭/입력 등 사용자 액션이 필요한 상태 | Playwright MCP (`browser_navigate` + `browser_evaluate` + `browser_take_screenshot`) |

#### 자동 캡처 워크플로우

```
1. YAML 로드 → meta 검증
2. 화면별 루프 {
   a. 기본 페이지 캡처:
      - method=generate_figma_design → captureId 발급 → fire-and-poll → Figma 배치
      - method=playwright → 네비게이션 → preconditions 실행 → 스크린샷 → use_figma 삽입
   b. figma_node_id 분기:
      - 값 존재 → 기존 프레임 in-place 갱신
      - null → 템플릿(4:1449) 복제 후 신규 세트 생성
   c. states 루프 (드로어/오버레이):
      - 부모 페이지 상태에서 시작
      - preconditions 실행 (있으면)
      - actions 시퀀스 실행 → 상태 열기
      - Playwright 스크린샷 → use_figma로 부모 세트 옆에 배치
   d. 캡처 결과를 와이어프레임 프레임으로 변환
}
3. 전체 세트에 플로우 화살표 연결
4. Description 슬롯 판정 + 작성
5. 검증
6. (선택) 매니페스트 figma_node_id 역갱신
```

### generate_figma_design captureForDesign fire-and-poll 패턴 (필수)

일부 환경에서 `captureForDesign()` Promise는 서버 전송 완료 후에도 **resolve되지 않는다**.
데이터는 실제로 수 초 내 전송되지만 Promise가 pending으로 남아 타임아웃한다.

**워크플로우:**

1. `generate_figma_design` MCP 호출 (`outputMode: "existingFile"`, `fileKey`) → `captureId` 발급
2. Playwright `browser_evaluate`로 `captureForDesign()` 호출 (Promise resolve 대기하지 않음 — 타임아웃 허용)
3. 호출 후 **5~10초 대기**
4. `generate_figma_design(captureId)` 폴링으로 완료 확인
5. status가 `completed`이면 성공 — Promise 타임아웃은 무시

**타임아웃이 발생해도 캡처 실패가 아니다.** 반드시 폴링으로 실제 상태를 확인한다.

```
# 예시 흐름
1. generate_figma_design(outputMode: existingFile, fileKey: ...) → captureId 발급
2. browser_evaluate: captureForDesign({ captureId, endpoint, selector: 'body' })
   → 타임아웃 발생 (정상)
3. 5초 대기
4. generate_figma_design(captureId: ...) → status: completed ✓
```

#### generate_figma_design 캡처 절차

1. `generate_figma_design` 호출 → `captureId` 발급
2. 캡처 스크립트 주입 대상: `index.html` (개발 서버 HTML)
3. hash URL 방문: `http://localhost:5173/desktop-v1#figmacapture=<captureId>&...`
4. 5초 간격 폴링 (최대 10회) → status `completed` 확인
5. 결과 노드를 와이어프레임 세트 위치로 이동/복제

`captureId`는 1회용. 한 페이지에 하나의 `captureId`만 유효.

#### Playwright 캡처 절차

1. `browser_navigate` → `http://localhost:5173/desktop-v1`
2. `preconditions` 순차 실행 (fill, click, wait 등)
3. `actions` 순차 실행 (드로어/오버레이 트리거)
4. `browser_take_screenshot` → 로컬 이미지 저장
5. `use_figma`로 Figma에 이미지 프레임 생성 또는 기존 프레임 교체

#### action 타입 레퍼런스

| action | 파라미터 | 설명 |
|---|---|---|
| `click` | `selector` | 요소 클릭 |
| `fill` | `selector`, `value` | 입력 필드에 값 입력 |
| `press` | `selector`, `key` | 키보드 입력 (Enter 등) |
| `wait` | `selector` 또는 `timeout` | 요소 출현 대기 또는 고정 대기(ms) |
| `navigate` | `route` | base_url 기준 내부 라우트 이동 |

### 모드 B: 수동 캡처 (매니페스트 없음)

매니페스트 YAML이 없거나, 새 화면을 처음 다루거나, 특정 화면만 빠르게 갱신할 때 사용한다.

```
1. 사용자로부터 입력 수집:
   - 대상 화면 범위
   - Figma fileKey / 대상 페이지
2. 기본 페이지 캡처 (generate_figma_design 또는 Playwright)
3. 상태 변형 캡처 (대화형):
   a. 에이전트가 화면에서 가능한 트리거 목록 제시
   b. 사용자가 트리거 실행 (또는 에이전트가 Playwright로 실행)
   c. 캡처 수집
4. Figma 세트 생성/갱신
5. 플로우 화살표 연결
6. Description 작성
7. (권장) 캡처 완료 후 매니페스트 역생성 제안
```

## 강제 구조 (모든 화면 세트 공통)

```
<screen-id> - <screen-name>   ← 부모 그룹
├── <screen-id> Meta           ← 화면명/화면ID/화면경로 행
├── <screen-id> Screen         ← 기본 화면 프레임
├── <screen-id>-S01 Screen     ← 상태 변형 프레임 (있을 때)
└── <screen-id> Description    ← Description 패널
```

Figma 내 각 프레임 이름은 이 규칙을 따른다. `figma_node_id`는 `<screen-id> Screen` 프레임의 ID를 가리킨다.

## 플로우 화살표 규칙

### 핵심 원칙 (필수)

화살표는 반드시 **실제 UI 트리거 요소의 정확한 위치**에서 출발해야 한다.
프레임 간 갭이나 프레임 외곽이 아니라, 버튼·아이콘·링크 등 사용자가 클릭하는 요소의 중심을 시작점으로 한다.

**금지**: 두 화면 프레임 사이 빈 공간에서 시작/종료하는 추상 화살표.

### 화살표 구성 요소 (3종 세트)

각 화살표는 아래 3개 노드로 구성한다.

1. **Marker** — 트리거 요소 위에 놓는 원형 강조 (Ellipse 20×20px, stroke 2.5, fill opacity 0.3)
2. **Arrow** — L자형 꺾임 경로 벡터 (트리거 → 화면 상단 여백 → 대상 화면)
3. **Label** — 유형 뱃지 + 동작 설명 텍스트 박스 (트리거 근처 배치)

네이밍: `Marker/<from>-<to>`, `Arrow/<from>-<to>`, `Label/<from>-<to>`

### 유형별 시각 분류

| 유형 | 색상 (RGB 0~1) | 선 스타일 | 뱃지 텍스트 | 용도 |
|---|---|---|---|---|
| 페이지 이동 | 노란 계열 `(0.85, 0.68, 0.15)` | 실선 | `페이지 이동` | 아이콘 클릭으로 앱 실행 |
| 오버레이/패널 | 보라 계열 `(0.68, 0.52, 0.82)` | 점선 `[4, 3, 1, 3]` | `오버레이` / `패널` | Launcher, TCA 패널, Dock 메뉴 등 |

### 경로 라우팅 규칙

- 동일 행 화면 간 연결: 화면 상단 여백(프레임 위 60~120px)을 통해 L자형 라우팅
- 여러 화살표가 같은 행을 지날 때: 각 라우팅 높이를 20px씩 엇갈려 겹침 방지
- 화살표 끝점: 대상 화면의 좌측 또는 상단 가장자리

### Figma 벡터 좌표 규칙

- 경로 데이터는 **양수 좌표만 사용**
- 모든 포인트를 부모 프레임 절대 좌표로 계산한 뒤, 바운딩 박스 좌상단을 (0, 0)으로 변환
- 벡터 노드의 `(x, y)`는 바운딩 박스 좌상단 = 부모 프레임 내 절대 위치
- 화살촉: 끝점에서 ±8px 오프셋으로 삼각형 세그먼트 추가

## Description 작성 규칙

### 범위 한정 (필수)

Description은 **현재 화면 + 해당 화면에서 직접 트리거되어 즉시 연결되는 상태**까지만 다룬다.

- 포함: 현재 화면에서 보이는 필드/버튼/상태, 현재 화면 액션으로 바로 열리는 오버레이/패널
- 제외: 현재 화면에서 트리거되지 않는 타 화면 상세, 백엔드 처리/코드 구현 설명

### 프로토타입 동작 추출 (작성 전 필수)

```text
- Trigger: (클릭/입력/선택)
- Visible Result: (즉시 관찰 가능한 결과)
- Constraint: (조건/제약)
- Evidence: (prototype 캡처 ID — 최종 본문에는 미포함)
```

정규화 레코드가 없는 내용은 Description에 작성하지 않는다.

### 작성 규칙

- 명사형 단문 우선: `표기.`, `숨김.`, `유지.` 등 (`~다` 종결형 지양)
- 섹션당 최대 8 bullet, bullet 1개 = 동작/결과 1개
- 코드 용어(함수명, prop명, 컴포넌트명) 금지
- 필터/컬럼/필드는 대시 리스트로 작성 (문단 금지)

```text
# 예시
앱 아이콘 그리드
- 역할별 노출 목록 필터링.
- 드래그로 위치 이동 가능.
- 아이콘끼리 겹치기(폴더 생성) 불가.
```

### Description 슬롯 순서 (기본)

1. 화면 목적/컨텍스트
2. 핵심 동작
3. 사용자 상호작용
4. 상태/검증/예외
5. 종료/복귀 경로

화면에 존재하지 않는 슬롯은 삭제. 삭제 후 번호와 프레임명 재정렬.

## Figma 좌표 변환 (Desktop UI 전용)

DOM viewport(1440×900) → Figma 이미지 영역(x:42, y:120, w:2048, h:1054):

```
figma_x = 42  + dom_x * (2048 / 1440)
figma_y = 120 + dom_y * (1054 / 900)
```

어노테이션 닷 중심 배치:

```
dot.x = figma_x - dot.width  / 2
dot.y = figma_y - dot.height / 2
```

## 파일 구조

```
.cursor/skills/wireframe-create/
├── SKILL.md                         # 이 파일 (에이전트 진입점)
├── reference.md                     # 빠른 참조 (좌표, 셀렉터, 색상 코드)
├── manifests/
│   └── desktop-ui.yaml              # Desktop UI 화면 캡처 설계서
└── scripts/
    ├── capture.cjs                  # Puppeteer 캡처 fallback 스크립트
    └── figma-build.cjs              # Figma 노드 빌더 코드 생성기
```

## 검증 체크리스트

- [ ] 이미지가 선명하게 들어갔는가 (2x 해상도)
- [ ] 화면명/화면ID/화면경로가 올바른가
- [ ] 어노테이션 번호가 해당 UI 요소 위에 배치됐는가
- [ ] states(드로어/패널) 캡처가 누락 없이 포함됐는가
- [ ] 플로우 화살표가 실제 UI 트리거 요소 중심에서 출발하는가
- [ ] Description이 현재 화면 연결 범위 내로 제한됐는가
- [ ] 각 bullet이 프로토타입 동작 레코드와 매핑되는가
- [ ] 코드 용어가 없는가
- [ ] 텍스트 클리핑이 없는가

## 주의사항

- `generate_figma_design`은 각 화면마다 별도 captureId를 생성해야 함 (single-use)
- captureForDesign Promise 타임아웃은 정상 — 반드시 폴링으로 상태 확인
- Figma `use_figma` 호출 전에는 반드시 사용되는 모든 폰트를 `loadFontAsync`로 로드
- 섹션 `appendChild` 시 Mona Sans 에러 발생 → 섹션 없이 targetPage에 직접 배치
- templateFrameId clone 시 Mona Sans 폰트 로드 불필요 (Annotation 인스턴스에서 자동 처리)
- Puppeteer 스크립트는 `/workspace` (또는 프로젝트 루트) 디렉토리에서 실행해야 모듈을 찾음
