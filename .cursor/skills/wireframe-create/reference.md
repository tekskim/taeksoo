# wireframe-create — 빠른 참조

## Figma 파일 정보

| 항목 | 값 |
|---|---|
| 파일 키 | `sDY0PfHButRV1ClAu7hxzM` |
| 파일명 | DESKTOP-Wireframe |
| 기획서 페이지 | `(1.0v)Desktop` |
| v0.7 템플릿 페이지 | `v0.7` |
| v0.7 HOME 프레임 ID | `4:1449` |
| Figma 링크 | https://www.figma.com/design/sDY0PfHButRV1ClAu7hxzM |

---

## 화면 세트 구조 (강제)

모든 화면은 아래 네이밍 구조로 Figma에 배치한다.

```
<screen-id> - <screen-name>     ← 부모 그룹 (선택)
├── <screen-id> Meta             ← 화면명/화면ID/화면경로 행
├── <screen-id> Screen           ← 기본 화면 프레임
├── <screen-id>-S01 Screen       ← 상태 변형 (있을 때)
├── <screen-id>-S02 Screen       ← 상태 변형 (있을 때)
└── <screen-id> Description      ← Description 패널
```

`figma_node_id`는 `<screen-id> Screen` 프레임의 nodeId를 가리킨다.

---

## 플로우 화살표 색상 코드

### 유형별 분류

| 유형 | RGB (0~1 범위) | 16진수 근사 | 선 스타일 | 뱃지 |
|---|---|---|---|---|
| 페이지 이동 / 앱 실행 | `(0.85, 0.68, 0.15)` | `#D9AD26` | 실선 | `페이지 이동` |
| 오버레이 / 패널 열기 | `(0.68, 0.52, 0.82)` | `#AD85D1` | 점선 `[4, 3, 1, 3]` | `오버레이` |

### Marker (트리거 요소 위 원형 강조)

```js
// use_figma 코드 예시
const marker = figma.createEllipse();
marker.resize(20, 20);
marker.name = `Marker/HOME01-HOME01-S01`;
marker.fills = [{ type: 'SOLID', color: { r: 0.68, g: 0.52, b: 0.82 }, opacity: 0.3 }];
marker.strokes = [{ type: 'SOLID', color: { r: 0.68, g: 0.52, b: 0.82 } }];
marker.strokeWeight = 2.5;
// 트리거 요소 중심에 배치
marker.x = triggerCenter.x - 10;
marker.y = triggerCenter.y - 10;
```

### Arrow (L자형 벡터)

```js
// 경로 데이터 — 양수 좌표만 사용, 바운딩 박스 좌상단 = (0, 0)
const arrow = figma.createVector();
arrow.name = `Arrow/HOME01-HOME01-S01`;
arrow.vectorPaths = [{
  windingRule: 'NONE',
  data: 'M 0 0 L 0 -80 L 300 -80 L 300 0',  // L자형 예시
}];
arrow.strokes = [{ type: 'SOLID', color: { r: 0.68, g: 0.52, b: 0.82 } }];
arrow.strokeWeight = 1.5;
arrow.dashPattern = [4, 3, 1, 3];  // 점선 (오버레이 유형)
```

### Label (뱃지 + 설명)

```js
const label = figma.createFrame();
label.name = `Label/HOME01-HOME01-S01`;
// 뱃지 텍스트 + 설명 텍스트 조합
```

---

## captureForDesign fire-and-poll 패턴

일부 환경에서 Promise가 resolve되지 않는 경우 아래 패턴을 사용한다.

```
1. generate_figma_design(outputMode: existingFile, fileKey: ...) → captureId 발급
2. browser_evaluate: captureForDesign({ captureId, endpoint, selector: 'body' })
   → 타임아웃 발생 (정상 — 무시)
3. 5~10초 대기 (browser_wait 또는 sleep)
4. generate_figma_design(captureId: ...) → status 확인
   → pending/processing: 5초 대기 후 재폴링
   → completed: 성공
5. 결과 프레임을 target 페이지로 이동 + 이름 변경
```

**최대 10회 폴링, 10회 초과 시 Playwright 스크린샷으로 fallback.**

---

## 화면 ID 목록 (desktop-ui.yaml)

| ID | 화면명 | 기존 figma_node_id | capture.method |
|---|---|---|---|
| HOME01 | 홈 화면 (도메인 사용자) | `499:396` | `generate_figma_design` |
| HOME01-S01 | App Launcher | null | `playwright` |
| HOME01-S02 | TCA Panel | null | `playwright` |
| HOME01-S03 | Dock Context Menu | null | `playwright` |
| HOME02 | 홈 화면 (시스템 관리자) | `502:396` | `generate_figma_design` |
| HOME02-S01 | App Launcher (SysAdmin) | null | `playwright` |
| TOP_GNB01 | Top GNB Auto-hide | `502:604` | `playwright` |
| SETTINGS01 | Settings 윈도우 | `502:656` | `playwright` |

---

## 이미지 좌표 변환

템플릿 프레임의 이미지 영역: `x=42, y=120, w=2048, h=1054` / DOM viewport: `1440×900`

```
figma_x = 42  + dom_cx * (2048 / 1440)   ≈ dom_cx * 1.4222 + 42
figma_y = 120 + dom_cy * (1054 / 900)    ≈ dom_cy * 1.1711 + 120
```

어노테이션 닷 배치:
```
dot.x = figma_x - dot.width  / 2
dot.y = figma_y - dot.height / 2
```

---

## 주요 CSS 셀렉터 (DesktopPageV1)

```css
/* GNB 전체 */
.fixed.top-0.left-0.right-0

/* App Launcher 버튼 */
[aria-label="Open app launcher"]

/* Dock 컨테이너 */
.rounded-xl.px-1\.5

/* TCA 버튼 */
button[title="TCA — AI Assistant"]

/* 앱 아이콘 (데스크탑 그리드) */
button[aria-label="<AppName>"]

/* 역할 토글 */
button: text("Domain"), button: text("System admin")

/* Launcher 검색창 */
input[placeholder="Search apps..."]

/* 앱 그리드 */
.grid.grid-cols-

/* 앱 윈도우 헤더 (더블클릭으로 최대화) */
.bg-\[var\(--color-surface-subtle\)\].border-b
```

---

## 자주 쓰는 GNB 버튼 DOM 좌표 (1440×900 viewport)

| 요소 | dom_cx | dom_cy | figma_x | figma_y |
|---|---|---|---|---|
| App Launcher 버튼 | 203 | 26 | 331 | 150 |
| Dock 영역 중앙 | 311 | 26 | 484 | 150 |
| 도메인 라벨 | 1221 | 26 | 1778 | 150 |
| Preferences (아이콘) | 1302 | 26 | 1894 | 150 |
| Account (아이콘) | 1334 | 26 | 1939 | 150 |
| Notification (아이콘) | 1366 | 26 | 1985 | 150 |
| TCA 버튼 | 1417 | 26 | 2057 | 150 |

---

## 에러 대응

| 에러 | 원인 | 해결 |
|---|---|---|
| `Cannot find module 'puppeteer'` | 프로젝트 루트 외부에서 실행 | `cd <project-root> && node ...` |
| `unloaded font "Mona Sans"` | 섹션 appendChild 시 | 섹션 쓰지 않고 targetPage에 직접 배치 |
| `"Mona Sans Regular"` loadFont 실패 | 이 파일에 해당 폰트 없음 | Annotation 인스턴스 clone 시 자동 처리됨, loadFont 불필요 |
| `Invalid hook call` | HMR 캐시 문제 | 개발 서버 재시작 |
| captureId `pending` 10회 이상 | 캡처 스크립트 미실행 | browser_evaluate로 captureForDesign 직접 호출 확인 |
| Promise 타임아웃 (captureForDesign) | 환경 특성 (정상) | 폴링으로 completed 확인, 타임아웃 무시 |
