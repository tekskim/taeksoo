# wireframe-create — 빠른 참조

## Figma 파일 정보

| 항목                | 값                                                  |
| ------------------- | --------------------------------------------------- |
| 파일 키             | `sDY0PfHButRV1ClAu7hxzM`                            |
| 파일명              | DESKTOP-Wireframe                                   |
| 기획서 페이지       | `(1.0v)Desktop`                                     |
| v0.7 템플릿 페이지  | `v0.7`                                              |
| v0.7 HOME 프레임 ID | `4:1449`                                            |
| Figma 링크          | https://www.figma.com/design/sDY0PfHButRV1ClAu7hxzM |

## 이미지 좌표 변환

템플릿 프레임의 이미지 영역:

- `x=42, y=120, w=2048, h=1054`
- DOM viewport: `1440×900`

```
figma_x = 42  + dom_cx * (2048 / 1440)   ≈ dom_cx * 1.4222
figma_y = 120 + dom_cy * (1054 / 900)    ≈ dom_cy * 1.1711
```

어노테이션 닷 배치:

```
dot.x = figma_x - dot.width  / 2    (dot 크기 ≈ 16~21px)
dot.y = figma_y - dot.height / 2
```

## 화면 ID 목록 (desktop-ui.yaml)

| ID          | 화면명                  | URL                             | generate_figma_design |
| ----------- | ----------------------- | ------------------------------- | --------------------- |
| HOME01      | 홈 화면 (도메인 사용자) | /desktop-v1                     | ✅                    |
| HOME02      | 홈 화면 (시스템 관리자) | /desktop-v1 (System admin 클릭) | ✅                    |
| LAUNCHER01  | App Launcher            | /desktop-v1 + launcher 클릭     | ✅                    |
| DOCK_MENU01 | Dock Menu 컨텍스트 메뉴 | /desktop-v1 + 우클릭            | ❌ (이미지 업로드)    |
| TCA01       | TCA 패널                | /desktop-v1 + TCA 클릭          | ❌                    |
| TOP_GNB01   | Top GNB Auto-hide       | /desktop-v1 + 최대화            | ❌                    |
| SETTINGS01  | Settings 윈도우         | /desktop-v1 + Settings 클릭     | ❌                    |

## 주요 CSS 셀렉터 (DesktopPageV1)

```css
/* GNB */
.fixed.top-0.left-0.right-0.h-\[52px\]

/* App Launcher 버튼 */
[aria-label="Open app launcher"]

/* Dock */
.rounded-xl.px-1\.5.py-1

/* 도메인 라벨 */
.text-white\/90.text-body-md  (text에 '.cloud' 포함)

/* TCA 버튼 */
button[title="TCA — AI Assistant"]

/* 앱 아이콘 (데스크탑 그리드) */
button[aria-label="<AppName>"]

/* 역할 토글 */
button:text("Domain"), button:text("System admin")

/* Launcher 검색창 */
input[placeholder="Search apps..."]

/* 앱 그리드 */
.grid.grid-cols-

/* 앱 윈도우 헤더 (더블클릭으로 최대화) */
.bg-\[var\(--color-surface-subtle\)\].border-b
```

## 자주 쓰는 GNB 버튼 DOM 좌표 (1440×900 viewport)

| 요소                  | dom_cx | dom_cy | figma_x | figma_y |
| --------------------- | ------ | ------ | ------- | ------- |
| App Launcher 버튼     | 203    | 26     | 331     | 150     |
| Dock 영역 중앙        | 311    | 26     | 484     | 150     |
| 도메인 라벨           | 1221   | 26     | 1778    | 150     |
| Preferences (아이콘)  | 1302   | 26     | 1893    | 150     |
| Account (아이콘)      | 1334   | 26     | 1939    | 150     |
| Notification (아이콘) | 1366   | 26     | 1985    | 150     |
| TCA 버튼              | 1417   | 26     | 2057    | 150     |

## 에러 대응

| 에러                                | 원인                                    | 해결                                                      |
| ----------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| `Cannot find module 'puppeteer'`    | 워크스페이스 외부에서 실행              | `cd /workspace && node ...`                               |
| `unloaded font "Mona Sans"`         | 섹션 appendChild 시                     | 섹션 쓰지 않고 targetPage에 직접 배치                     |
| `"Mona Sans Regular"` loadFont 실패 | 이 파일에 해당 폰트 없음                | Annotation 인스턴스 clone 시 자동 처리됨, loadFont 불필요 |
| `Invalid hook call`                 | HMR 캐시 문제                           | 개발 서버 재시작                                          |
| captureId pending 10회 이상         | 캡처 스크립트가 브라우저에서 실행 안 됨 | computerUse 에이전트로 hash URL 직접 열기                 |
