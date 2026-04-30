---
name: wireframe-create
description: >-
  프로토타입 구현 화면 기준으로 Figma 화면기획서(와이어프레임)를 자동 생성/갱신한다.
  manifests/*.yaml에 선언된 화면 목록을 읽어, Puppeteer로 실제 구현 화면을 캡처하고
  generate_figma_design으로 Figma에 전송한다. 캡처 결과를 단순 이미지가 아닌
  편집 가능한 노드 구조(v0.7 템플릿 clone 기반)로 배치하며, 화면 ID를 결정론적으로
  부여해 반복 실행 시에도 동일 노드를 갱신한다.
  트리거: "와이어프레임 만들어", "wireframe-create", "화면기획서 생성",
  "Figma 와이어프레임", "[manifest]로 와이어프레임"
---

# wireframe-create

프로토타입 구현 화면 → Figma 화면기획서(와이어프레임) 자동 생성 스킬.

## 핵심 원칙

1. **generate_figma_design 기반**: 단순 이미지 붙여넣기가 아닌 HTML→Figma 변환으로 편집 가능한 노드 생성
2. **결정론적 화면 ID**: 매니페스트의 `id` 필드가 Figma 프레임 이름과 1:1 매핑 → 반복 실행 시 같은 노드를 업데이트
3. **템플릿 clone 기반**: v0.7 기획서 프레임을 clone()해서 폰트/색상/레이아웃 100% 동일
4. **DOM 좌표 기반 어노테이션**: Puppeteer getBoundingClientRect()로 실제 UI 요소 위치를 측정해서 배치

## 파일 구조

```
.cursor/skills/wireframe-create/
├── SKILL.md                        # 이 파일 (에이전트 진입점)
├── manifests/
│   └── desktop-ui.yaml             # Desktop UI 화면 캡처 설계서
└── scripts/
    ├── capture.cjs                 # Puppeteer 캡처 + DOM 좌표 수집
    └── figma-build.cjs             # Figma 노드 생성/갱신
```

## 워크플로우

### Step 1: 매니페스트 확인

```bash
cat .cursor/skills/wireframe-create/manifests/<target>.yaml
```

매니페스트에는 다음이 정의됩니다:

- `figma.fileKey`: 대상 Figma 파일 키
- `figma.targetPage`: 기획서를 넣을 Figma 페이지 이름
- `figma.templateFrameId`: clone 기준이 될 v0.7 템플릿 프레임 ID
- `screens[]`: 캡처할 화면 목록 (id, name, url, setup, annotations)

### Step 2: 캡처 실행

```bash
cd /workspace
node .cursor/skills/wireframe-create/scripts/capture.cjs \
  --manifest .cursor/skills/wireframe-create/manifests/desktop-ui.yaml \
  --out /tmp/wf_captures/
```

출력:

- `/tmp/wf_captures/<screen_id>.png` — 2x 해상도 스크린샷
- `/tmp/wf_captures/rects.json` — 화면별 DOM 요소 좌표

### Step 3: Figma에 이미지 업로드

`upload_assets` MCP 도구를 사용해 캡처 이미지를 Figma에 업로드하고 imageHash를 수집한다.

```
각 스크린샷을 upload_assets로 업로드 → imageHash 기록
```

### Step 4: generate_figma_design으로 캡처 전송

매니페스트에 `use_generate_figma_design: true`인 화면에 대해:

1. `generate_figma_design` MCP 도구로 captureId 생성
2. computerUse 에이전트로 해당 URL 열기 + figma capture hash URL 방문
3. captureId 폴링 완료 대기
4. 완료된 프레임을 target 페이지로 이동 + 이름을 `<screen_id>_capture`로 변경

### Step 5: Figma 기획서 프레임 생성/갱신

`figma-build.cjs` 또는 `use_figma` MCP 직접 호출:

```
1. targetPage에서 screen_id와 일치하는 프레임 검색
2. 없으면: templateFrameId clone() → name = screen_id
   있으면: 기존 프레임 재사용 (결정론적 갱신)
3. image 1 fill → 업로드한 imageHash로 교체
4. 헤더 텍스트 (화면명/화면ID/화면경로) 업데이트
5. 설명 패널 텍스트 업데이트 (매니페스트 description 기반)
6. Annotation 인스턴스 위치 재배치 (rects.json의 DOM 좌표 → Figma 좌표 변환)
```

### Step 6: 검증

생성된 각 프레임의 스크린샷을 찍어 다음을 확인:

- [ ] 이미지가 선명하게 들어갔는가 (2x 해상도)
- [ ] 화면명/화면ID가 올바른가
- [ ] 어노테이션 번호가 해당 UI 요소 위에 배치됐는가
- [ ] 설명 패널 내용이 매니페스트와 일치하는가

## 매니페스트 스키마

```yaml
# manifests/<target>.yaml
version: '1'
figma:
  fileKey: 'sDY0PfHButRV1ClAu7hxzM' # Figma 파일 키
  targetPage: '(1.0v)Desktop' # 기획서 페이지
  templateFrameId: '4:1449' # v0.7 HOME 프레임 (clone 기준)
  sectionName: 'DESKTOP (v1.0 화면기획서)' # 섹션 이름

capture:
  baseUrl: 'http://localhost:5173'
  viewport:
    width: 1440
    height: 900
    deviceScaleFactor: 2 # 2x 해상도

screens:
  - id: HOME01 # 결정론적 화면 ID (Figma 프레임 이름)
    name: '홈 화면 (도메인 사용자)'
    screenId: HOME01 # 화면기획서 화면ID 칸
    path: '로그인 → 홈 화면 (도메인 사용자)' # 화면 경로 칸
    url: '/desktop-v1'
    use_generate_figma_design: true # HTML→Figma 변환 여부
    setup: # 캡처 전 실행할 액션
      - type: wait
        ms: 2000
    annotations: # 어노테이션 정의
      - label: 'A'
        selector: ".fixed.top-0.left-0.right-0.h-\\[52px\\]"
        description: '상단바(Top GNB) 영역'
        side: left
      - label: 'B'
        selector: null
        position: { x: 0, y: 178 } # DOM 좌표 직접 지정 (selector 없을 때)
        description: '메인 데스크탑 영역'
        side: left
      - label: '1'
        selector: "[aria-label='Open app launcher']"
        description: 'App Launcher 버튼'
      - label: '2'
        selector: ".rounded-xl.px-1\\.5.py-1"
        description: 'Dock Menu'
    description:
      '00': |
        Desktop Home (v1.0 - 도메인 사용자)
        로그인 후 도메인 사용자 기준 홈 화면.
        A: 상단바(Top GNB) 영역
        B: 메인 데스크탑 영역 (앱 아이콘 그리드)
      '01': |
        App Launcher 버튼
        GNB 로고 오른쪽의 그리드 아이콘 버튼.
        클릭 시 전체 앱 목록 오버레이 노출 (→ LAUNCHER01).
```

## Figma 좌표 변환 공식

DOM viewport(1440×900) → Figma 이미지 영역(x:42, y:120, w:2048, h:1054):

```
figma_x = 42 + dom_x * (2048 / 1440)
figma_y = 120 + dom_y * (1054 / 900)
```

어노테이션 닷 중심 배치:

```
dot.x = figma_x - dot.width / 2
dot.y = figma_y - dot.height / 2
```

## 주의사항

- `generate_figma_design`은 각 화면마다 별도 captureId를 생성해야 함 (single-use)
- 캡처 스크립트는 `/workspace` 디렉토리에서 실행해야 puppeteer 모듈을 찾음
- Figma `use_figma` 호출 전에는 반드시 사용되는 모든 폰트를 `loadFontAsync`로 로드
- templateFrameId의 clone 시 `Mona Sans` 폰트 로드 불필요 (Annotation 인스턴스에서 자동 처리)
- 섹션 `appendChild` 시 Mona Sans 로드 에러 발생 → 섹션 없이 targetPage에 직접 배치
