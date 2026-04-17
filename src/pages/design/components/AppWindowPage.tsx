import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';

const APP_WINDOW_GUIDELINES_MAIN = `## Overview

App Window는 사용자가 하나의 애플리케이션을 탐색하고 작업을 수행하는 **기본 UI 컨테이너 패턴**이다.

이 패턴은 데스크탑 환경의 **macOS 및 Windows 애플리케이션 window 구조와 유사하게 설계되며**, 사용자는 App Window 내부에서 앱의 기능을 탐색하고 여러 작업을 동시에 수행할 수 있다.

App Window는 다음 역할을 수행한다.

- 앱 기능 탐색
- 작업 공간 제공
- 여러 화면을 탭으로 관리
- 애플리케이션 window 제어

---

## Composition

\`\`\`
Menu | Top Bar
			 ├ Tabs
			 └ Window Controls

     | Top Navigation Bar
     | Content Area
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Menu | 앱 내 기능 탐색 |
| Top Bar | 탭 영역 및 윈도우 제어 |
| Tab Area | 여러 화면을 동시에 관리 |
| Window Controls | 최소화 / 최대화 / 닫기 |
| Content Area | 실제 기능 화면 표시 |

---

## Variants

이 패턴은 단일 App Window 구조를 기준으로 하며, 앱별로 Menu·Top Bar 구성만 달라질 수 있다.

---

## Behavior

### 1) 앱 윈도우 실행

- 앱을 실행하면 새로운 App Window가 열린다.
- 앱이 실행되면 기본 탭이 존재한다.
- 앱 전환은 윈도우 focus 전환을 기본으로 한다.
- 앱마다 독립적인 윈도우 상태를 유지한다.

### 2) 앱 윈도우 종료

- 윈도우 컨트롤의 (×) 버튼을 클릭하면 앱 윈도우가 종료된다.
- 앱 윈도우 내의 모든 탭이 닫히면 해당 앱 윈도우가 종료된다.
- 앱 윈도우 종료가 앱 종료를 의미하지 않는다.

### 3) 탭 정책

- 탭 생성 시 해당 앱의 대시보드(홈) 화면이 열린다.
  - 컴퓨트의 경우, 사용자의 기본 테넌트의 대시보드(홈) 화면이 열린다.

### 4) Top bar 인터랙션

- Top Bar를 더블 클릭하면 App Window가 **최대화 / 원래 크기 복원** 토글 동작을 수행한다.
- 탭 클릭 시 해당 화면이 활성화된다.
- 탭 닫기 버튼 클릭 시 해당 화면이 종료된다.

### 5) Menu

- 사용자는 Menu를 수동으로 접거나 펼칠 수 있다.
- 앱 기능 단위로 구성한다.
- 현재 선택된 메뉴를 강조 표시한다.

### 6) Content Area

- Content Area는 앱의 실제 기능 화면이 표시되는 작업 공간이다.
- 현재 활성 탭의 화면만 표시한다.
- Menu 및 Top Navigation Bar와 명확히 분리된다.

### 7) 브라우저 새로고침 시 앱 윈도우 동작

- 앱 윈도우 모두 닫힘
- 로그인 진행 시 첫 진입 화면과 동일

**후순위(개발 일정 가능 시 반영)**

- 복원 대상: 앱 윈도우 열림 상태, 각 앱 윈도우별 탭 열림 상태
- 복원 제외 대상: 앱 윈도우 내의 스크롤 위치, 모달·드로어·컨텍스트 메뉴 열림 상태

### 8) 앱 간 이동 — 확인 모달 노출 기준

한 앱에서 **버튼·링크** 등으로 **다른 앱으로 이동·오픈**할 때, 확인 모달 **노출 여부**는 아래 기준으로 선택한다. 문구·토큰·크기 등 UI 세부는 **Modal** 컴포넌트 정책 및 **UX Writing**을 따른다.

**모달 노출** — **행동을 유도하는 이동**일 때 확인 모달을 **표시**한다.

- 다른 앱(예: **IAM**)으로 보내 **그 앱에서 추가 작업**을 하게 하는 흐름
- 단순히 화면만 바뀌는 수준이 아니라, **이동 자체가 다음 액션의 시작**인 경우

**모달 비노출** — **단순 이동**일 때는 확인 모달을 **표시하지 않는다**.

- 연결된 리소스를 **확인·조회**하는 정도의 이동
- **다음에 꼭 해야 할 작업**이 특별히 없을 때

| 구분 | 요약 | 예시 |
| --- | --- | --- |
| **모달 노출** | 이동 후 **할 일이 명확**하고 **행동 유도**가 핵심인 경우 | 다른 앱에서 권한·설정 등 **추가 작업을 이어가야** 하는 링크 |
| **모달 비노출** | **조회·확인** 중심이고 **필수 후속 작업**이 없는 경우 | 연결 리소스 **상세만 열어보기** |

### 9) 앱 간 이동 — 다른 앱 열기 (창·탭·포커스)

특정 앱에서 **다른 앱을 연다**는 것은 다음을 의미한다.

- **새 앱 윈도우**를 연다.
- 그 앱 윈도우 **안에서 새 탭**을 연다(이동 목적지 화면은 해당 탭에 로드).
- **포커스**는 **새로 연 앱 윈도우**의 **그 새 탭**으로 이동한다(키보드·스크린 리더 포커스 포함).

\`\`\`plain text
[앱 A 윈도우] —트리거→ [앱 B 윈도우(신규)]
                      └ 새 탭(목적지) ← 포커스
\`\`\`

### 10) 모션·피드백(애니메이션)

앱 윈도우의 **열기·닫기·이동(드래그)·최소화/복원·포커스 변화**에 적용되는 **시각적 피드백** 원칙이다.

- **열기·복원:** 새로 실행하거나 최소화에서 복원할 때 **짧은 등장 모션**(스케일·페이드 등)을 적용한다.
- **닫기·최소화:** 창이 사라지거나 축소됨이 인지되도록 **짧은 퇴장 모션**을 적용한다.
- **이동(드래그):** 제목 표시줄 등으로 **창을 끌어 이동**할 때, **드래그 중**임을 분명히 보여야 한다.
  - 창 프레임 또는 창 전체에 **일시적으로 불투명도(opacity)를 낮춘다.**
  - **드롭(이동 종료)** 시 **즉시** 기본 불투명도로 복귀한다.
  - **완전 투명**에 가깝게 만들어 창 경계·콘텐츠를 식별할 수 없게 하면 안 된다.
- **리사이즈:** 가장자리 드래그로 크기 변경 시 **조작 중임**이 드러나는 피드백(커서·가이드 등)을 둔다.
- **포커스·Z-order:** 활성 창 전환 시 **과한 연출** 없이 z-order·접근성 포커스 규칙을 따른다.
`;

const APP_WINDOW_GUIDELINES_TAIL = `## Content Guidelines

- 확인 모달 **제목·본문·버튼** 문자열은 **KO / EN 병기** 및 **UX Writing**을 적용한다.
- **새 앱 창·새 탭**으로 열린다는 점이 사용자에게 이해되도록 문구를 쓴다.

---

## Related

| 이름 | 유형 | 이유 |
| --- | --- | --- |
| Menu | Component | 앱 기능 탐색 |
| Top Navigation Bar | Component | 앱 기능 탐색 |
| Top bar | Component | 화면 관리 |
| Window Controls | Component | 윈도우 제어 |
| Modal | Component | 앱 간 이동 확인 모달 |
| List Page | Pattern | 주요 콘텐츠 |
| Create Page | Pattern | 리소스 생성 |
`;

export function AppWindowPage() {
  return (
    <ComponentPageTemplate
      title="App Window"
      status="desktop-only"
      description="사용자가 하나의 애플리케이션을 탐색하고 작업을 수행하는 기본 UI 컨테이너 패턴이다. 데스크탑 환경의 macOS 및 Windows 애플리케이션 window 구조와 유사하게 설계되며, App Window 내부에서 앱 기능 탐색·작업 공간·탭 기반 멀티 화면·윈도우 제어를 제공한다."
      whenToUse={[
        '하나의 앱이 독립적인 기능 영역을 가질 때',
        '여러 화면을 동시에 열어 작업해야 할 때',
        '데스크탑 애플리케이션 UX를 제공해야 할 때',
      ]}
      whenNotToUse={[
        '특정 리소스에 대한 설정 패널 (→ Drawer, Modal)',
        '보조 정보 표시 (→ Drawer, Popover)',
      ]}
      guidelines={
        <>
          <NotionRenderer markdown={APP_WINDOW_GUIDELINES_MAIN} />
          <h3 className="text-heading-h5 text-[var(--color-text-default)] mb-4 mt-8">
            Usage Guidelines
          </h3>
          <DosDonts
            doItems={[
              '메뉴와 콘텐츠 영역을 명확히 분리한다.',
              '여러 작업을 탭으로 관리할 수 있도록 한다.',
              '앱 간 이동 목적이 작업 이어가기인지 열람인지 먼저 판단하고, 확인 모달 노출 기준(Behavior 8)에 맞춘다.',
              '다른 앱을 열 때 새 앱 윈도우 + 새 탭 + 포커스 규칙(Behavior 9)을 지킨다.',
              '윈도우 열기·닫기·이동 시 모션·피드백은 Behavior 10 및 Desktop UI 가이드 8.1을 따른다.',
            ]}
            dontItems={[
              '앱 기능을 여러 Window로 분산하지 않는다.',
              '메뉴와 작업 영역을 혼합하지 않는다.',
              'Window Controls를 커스텀 동작으로 변경하지 않는다.',
              '단순 조회인데도 불필요하게 확인 모달을 늘리지 않는다.',
              '다른 앱을 동일 윈도우 내 전환만 하는 것처럼 구현하지 않는다(본 정책과 불일치 시 제품·디자인 검토).',
            ]}
          />
          <NotionRenderer markdown={APP_WINDOW_GUIDELINES_TAIL} />
        </>
      }
      relatedLinks={[
        { label: 'Menu', path: '/design/components/menu' },
        { label: 'Top Navigation Bar', path: '/design/components/menu' },
        { label: 'Top Bar', path: '/design/components/topbar' },
        { label: 'Window Controls', path: '/design/components/window-control' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'List Page', path: '/design/patterns/list-page' },
        { label: 'Create Page', path: '/design/patterns/wizard' },
      ]}
    />
  );
}
