import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';

const APP_WINDOW_GUIDELINES = `## Overview

App Window는 사용자가 하나의 애플리케이션을 탐색하고 작업을 수행하는 기본 UI 컨테이너 패턴이다.
이 패턴은 데스크탑 환경의 macOS 및 Windows 애플리케이션 window 구조와 유사하게 설계되며, 사용자는 App Window 내부에서 앱의 기능을 탐색하고 여러 작업을 동시에 수행할 수 있다.

App Window는 다음 역할을 수행한다.
- 앱 기능 탐색
- 작업 공간 제공
- 여러 화면을 탭으로 관리
- 애플리케이션 window 제어

---

## Composition

\`\`\`
+----------------------------------------------------------+
| [Menu] | Tab 1 | Tab 2 | Tab 3 |        [_] [□] [×]       |  Top Bar
+--------+-------+-------+-------+--------------------------+
|        |                                                     |
| Menu   |              Content Area                           |
|        |                                                     |
+--------+-----------------------------------------------------+
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Menu | 앱 내 기능 탐색 |
| Top Bar | 탭 영역 및 윈도우 제어 |
| Tab Area | 여러 화면을 동시에 관리 |
| Window Controls | 최소화 / 최대화 / 닫기 |
| Content Area | 실제 기능 화면 표시 |

---

## Behavior

### 1) 앱 윈도우 실행
- 앱을 실행하면 새로운 App Window가 열린다.
- 앱이 실행되면 기본 탭이 존재한다.
- 앱 전환은 윈도우 focus 전환을 기본으로 한다.
- 앱마다 독립적인 윈도우 상태를 유지한다.

### 2) 앱 윈도우 종료
- 윈도우 컨트롤의 (x)버튼을 클릭하면 앱 윈도우가 종료된다.
- 앱 윈도우 내의 모든 탭이 닫히면 해당 앱 윈도우가 종료된다.
- 앱 윈도우 종료가 앱 종료를 의미하지 않는다.

### 3) 탭 정책
- 탭 생성 시 해당앱의 대시보드(홈) 화면이 열린다.
  - 컴퓨트의 경우, 사용자의 기본 테넌트의 대시보드(홈) 화면이 열린다.

### 4) Top Bar 인터랙션
- Top Bar를 더블 클릭하면 App Window가 최대화 / 원래 크기 복원 토글 동작을 수행한다.
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

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Menu | Component | 앱 기능 탐색 |
| Top Navigation Bar | Component | 앱 기능 탐색 |
| Top Bar | Component | 화면 관리 |
| Window Controls | Component | 윈도우 제어 |
| List Page | Pattern | 주요 콘텐츠 |
| Create Page | Pattern | 리소스 생성 |
`;

export function AppWindowPage() {
  return (
    <ComponentPageTemplate
      title="App Window"
      description="사용자가 하나의 애플리케이션을 탐색하고 작업을 수행하는 기본 UI 컨테이너 패턴. 데스크탑 환경의 macOS 및 Windows 애플리케이션 window 구조와 유사하게 설계되며, 사용자는 App Window 내부에서 앱의 기능을 탐색하고 여러 작업을 동시에 수행할 수 있다."
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
          <NotionRenderer markdown={APP_WINDOW_GUIDELINES} />
          <DosDonts
            doItems={[
              '메뉴와 콘텐츠 영역을 명확히 분리한다.',
              '여러 작업을 탭으로 관리할 수 있도록 한다.',
            ]}
            dontItems={[
              '앱 기능을 여러 Window로 분산하지 않는다.',
              '메뉴와 작업 영역을 혼합하지 않는다.',
              'Window Controls를 커스텀 동작으로 변경하지 않는다.',
            ]}
          />
        </>
      }
      relatedLinks={[
        { label: 'Menu', path: '/design/components/menu' },
        { label: 'Top Bar', path: '/design/components/topbar' },
        { label: 'Window Controls', path: '/design/components/window-control' },
        { label: 'List Page', path: '/design/patterns/common' },
        { label: 'Create Page', path: '/design/patterns/wizard' },
      ]}
    />
  );
}
