# Desktop TopBar 자동 숨김 (Auto-hide) 기획서

> THAKI Desktop Shell / Interaction Spec  
> 작성일: 2026-04-20

---

## 1. 개요

개별 앱 창이 **전체화면(Maximize)** 상태일 때 상단 TopBar를 자동으로 숨기고, 마우스를 화면 최상단으로 이동하면 **슬라이딩 애니메이션**으로 다시 표시하는 macOS 스타일 동작.

> 참고: macOS의 "메뉴 막대 자동으로 가리기 및 보기" 동작과 동일한 패턴

---

## 2. 트리거 조건

| 조건 | 설명 |
|---|---|
| **TopBar 숨김 시작** | 하나 이상의 앱 창이 Maximize 상태가 되면 즉시 TopBar가 위로 슬라이딩되어 숨겨짐 |
| **TopBar 복원** | 모든 앱 창이 Maximize 해제(Restore)되면 TopBar가 항상 표시 상태로 복원 |
| **창 닫기** | Maximize된 창이 닫히면 남은 Maximize 창이 없을 경우 TopBar 복원 |
| **앱 종료** | Dock에서 앱 종료(Quit) 시 해당 앱의 Maximize 상태도 해제되어 TopBar 복원 조건에 반영 |

---

## 3. 상태 흐름

```
                    앱 Maximize
  [항상 표시] ─────────────────────> [숨김]
       ^                              │  ^
       │                   상단 호버  │  │  마우스 이탈 (200ms 딜레이)
       │                              v  │
       │                         [슬라이드 표시]
       │                              │
       │         앱 Unmaximize        │
       <──────────────────────────────┘
```

**상태 전이 상세:**

- **항상 표시** → 앱 Maximize → **숨김**
- **숨김** → 마우스 상단 호버 → **슬라이드 표시**
- **슬라이드 표시** → 마우스 이탈 (200ms 후) → **숨김**
- **숨김** → 앱 Unmaximize → **항상 표시**
- **슬라이드 표시** → 앱 Unmaximize → **항상 표시**

---

## 4. 전체화면(Maximize) 동작 변경

### Before (기존)

| 속성 | 값 |
|---|---|
| top | 52px (TopBar 높이) |
| height | calc(100vh - 52px) |
| 영역 | TopBar 아래 영역만 사용 |

### After (변경 후)

| 속성 | 값 |
|---|---|
| top | 0 |
| height | 100vh |
| 영역 | **Viewport 전체** (TopBar를 덮음) |
| border-radius | 0 (모서리 둥글기 제거) |

> 앱 창의 z-index(2000+)가 TopBar(1000)보다 높으므로 자연스럽게 TopBar를 덮는다.

---

## 5. 호버 인터랙션 상세

### 5-1. Hot Zone (감지 영역)

| 속성 | 값 | 설명 |
|---|---|---|
| 위치 | 화면 최상단 | fixed, top: 0 |
| 높이 | **6px** | 보이지 않는 투명 영역 |
| 너비 | 화면 전체 | left: 0, right: 0 |
| z-index | 10000 | 모든 요소 위에 위치하여 항상 호버 감지 가능 |

### 5-2. 슬라이딩 애니메이션

| 속성 | 값 |
|---|---|
| 숨김 상태 | `transform: translateY(-100%)` |
| 표시 상태 | `transform: translateY(0)` |
| 전환 시간 | **300ms** |
| 이징 | **ease-out** |
| 대상 속성 | transform, box-shadow |

### 5-3. 마우스 이탈 시 딜레이

- TopBar 영역에서 마우스가 벗어나면 **200ms 후** 다시 숨김
- 이 딜레이는 사용자가 실수로 마우스를 벗어났다가 돌아올 때를 대비한 것
- 딜레이 중 마우스가 다시 TopBar/Hot Zone에 진입하면 숨김 타이머가 취소되어 TopBar가 유지됨

---

## 6. 시각 효과

### 6-1. 호버 슬라이딩 시 Shadow

autoHide 모드에서 TopBar가 슬라이딩으로 나타날 때, 기존 TopBar shadow에 추가로 부드러운 drop shadow를 적용하여 앱 콘텐츠 위에 떠 있는 느낌을 준다.

| 상태 | box-shadow |
|---|---|
| 일반 모드 | `var(--desktop-topbar-shadow)` |
| autoHide 슬라이딩 표시 | `var(--desktop-topbar-shadow), 0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)` |

> Shadow는 transform과 함께 300ms ease-out으로 전환된다.

### 6-2. Domain 드롭다운

- TopBar 내부의 Domain 드롭다운은 **불투명 배경**(surface-default)을 사용
- 전체화면 앱 콘텐츠가 비치지 않도록 `backdrop-blur` 효과는 적용하지 않음

---

## 7. Z-index 레이어 체계

| 레이어 | z-index | 설명 |
|---|---|---|
| TopBar (일반 모드) | 1000 | 항상 표시 상태일 때 |
| Domain 드롭다운 | 1100 | TopBar 내부 드롭다운 |
| 앱 창 (일반) | 2000 + n | n은 창 생성 순서 |
| TopBar (autoHide) | 9999 | 전체화면 앱 위로 슬라이딩할 수 있도록 |
| Hot Zone | 10000 | 항상 최상위에서 호버 감지 |

---

## 8. 엣지 케이스

| 케이스 | 동작 |
|---|---|
| 여러 창 중 하나만 Maximize | TopBar 숨김 (하나라도 Maximize되면 autoHide 활성화) |
| 여러 창 모두 Maximize 후 하나 Restore | TopBar 여전히 숨김 (다른 창이 아직 Maximize) |
| Maximize된 창을 닫기(X) | 남은 Maximize 창이 없으면 TopBar 복원 |
| Dock에서 앱 종료(Quit) | 해당 앱의 모든 창 Maximize 상태 해제 후 TopBar 복원 조건 재평가 |
| TopBar 슬라이딩 중 드롭다운 열기 | 드롭다운은 불투명 배경으로 정상 표시 |
| TopBar 표시 중 Unmaximize | 즉시 항상 표시 모드로 전환 (autoHide 해제) |

---

## 9. 접근성 고려사항

- Hot Zone은 마우스 기반 인터랙션이므로 키보드 접근성은 별도 고려 필요
- 향후 키보드 단축키(예: `Ctrl+Shift+M`)로 TopBar 토글 기능 추가 검토 가능

---

## 수정 파일

- `src/pages/DesktopPage.tsx` — PageWindow maximize 좌표 변경, maximize 상태 공유, DesktopTopBar autoHide, hot zone, 슬라이딩 애니메이션
- `src/index.css` — Desktop CSS 변수 (변경 없음, 참조용)
