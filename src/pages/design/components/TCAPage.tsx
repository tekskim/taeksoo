import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack } from '@/design-system';

const TCA_GUIDELINES = `## Overview

TCA (Thaki Cloud Assistant)는 **TopBar의 AI 아이콘 버튼으로 활성화되는 우측 슬라이드 패널 형태의 AI 대화 컴포넌트**이다. 사용자는 현재 작업 컨텍스트를 벗어나지 않고 AI 어시스턴트와 대화하거나 작업을 위임할 수 있다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| ① Trigger Button | TopBar에 위치하는 AI 아이콘 버튼. 클릭 시 TCA Panel을 토글한다. |
| ② TCA Panel | 화면 우측에서 슬라이드 인하는 고정 패널 |
| ③ Panel Header | 제목과 닫기·추가 액션이 포함된 상단 영역 |
| ④ Message Area | 대화 메시지가 표시되는 스크롤 영역 |
| ⑤ Input Area | 사용자가 메시지를 입력하는 하단 고정 영역 |

---

## States

| 상태 | 설명 |
| --- | --- |
| Open — Idle | TCA Panel이 열린 상태. 대화 내용을 표시하며 입력을 대기한다. |
| Open — Generating | AI 응답을 생성 중인 상태. 전송 버튼이 중지 버튼(■)으로 전환된다. |
| Open — Error | AI 응답 실패. 에러 메시지와 재시도 버튼을 표시한다. |

---

## Behavior

### 1) 패널 열기/닫기
- Trigger Button 클릭 시 TCA Panel이 열리거나 닫힌다 (토글).
- 패널 열림/닫힐 시 슬라이드 트랜지션을 적용한다.
- 패널은 기존 콘텐츠 영역 위에 오버레이되며 콘텐츠를 밀지 않는다.
- Escape 키로 패널을 닫을 수 있다.

### 2) 메시지 전송 및 중지
- 입력창에 메시지 입력 후 Enter 또는 전송 버튼(↑)으로 전송한다.
- 전송 즉시 응답 생성 중 상태로 전환되며, 전송 버튼이 중지 버튼(■)으로 변경된다.
- 중지 버튼 클릭 시 AI 응답 생성을 즉시 중단하고 전송 버튼 상태로 복귀한다.
- 응답 수신 완료 시 Message Area에 AI 메시지를 추가하고 전송 버튼 상태로 복귀한다.

### 3) 스크롤 동작
- 새 메시지가 추가되면 Message Area가 자동으로 최신 메시지로 스크롤된다.
- 사용자가 수동으로 위로 스크롤한 경우 자동 스크롤을 중단한다.

### 4) 패널 위치 및 레이어
- TopBar 하단에서 시작하여 화면 하단까지 차지한다.
- Drawer, Modal 등 다른 레이어보다 위에 위치한다.
- ShellPanel이 열린 경우 하단 위치를 조정한다.

### 5) 세션 유지
- 대화 히스토리는 브라우저 세션 내에서 유지된다.
- 패널 닫기/다시 열기 시 기존 대화 내용이 유지된다.

### 6) 접근성
- Trigger Button에 보조 기술(스크린 리더) 지원을 위한 레이블과 열림 상태 정보를 제공한다.
- TCA Panel은 보조 영역 또는 대화 영역으로 마크업한다.
- Escape 키로 패널을 닫을 수 있어야 한다.

---

## Content Guidelines

- **Trigger Button**: 아이콘만 사용하며 텍스트 라벨을 추가하지 않는다.
- **Panel 제목**: 제품 내 일관된 명칭 **TCA** 또는 **Thaki Cloud Assistant** 사용.
- **AI 메시지**: 중립적이고 전문적인 문체를 사용한다. 감정·사과 표현을 지양한다.

---

## Related

| 이름 | 유형 | 비고 |
| --- | --- | --- |
| Drawer | Component | 유사한 슬라이드 패널 패턴 (비교) |
| TopBar | Component | Trigger Button 위치 |
| System Error | Pattern | AI 응답 실패 시 에러 처리 참고 |
| Toast | Component | AI 작업 완료 알림 |
`;

export function TCAPage() {
  return (
    <ComponentPageTemplate
      title="TCA"
      description="TopBar의 AI 아이콘 버튼으로 활성화되는 우측 슬라이드 패널 형태의 AI 대화 컴포넌트. 사용자는 현재 작업 컨텍스트를 벗어나지 않고 AI 어시스턴트와 대화하거나 작업을 위임할 수 있다."
      whenToUse={[
        '현재 화면 컨텍스트에서 AI 어시스턴트와 대화하고 싶을 때',
        '작업 흐름을 벗어나지 않고 AI 도움이 필요할 때',
        '복잡한 태스크 실행·자동화를 AI에게 위임할 때',
      ]}
      whenNotToUse={['단순 알림·확인 메시지 → Toast 또는 Modal 사용']}
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={TCA_GUIDELINES} />
          <DosDonts
            doItems={[
              'Trigger Button은 사용자가 쉽게 인지할 수 있는 위치(TopBar 등)에 배치한다.',
              'AI 응답 생성 중에는 사용자가 언제든지 중지할 수 있는 수단(중지 버튼)을 제공한다.',
              '대화 히스토리는 세션 내에서 유지한다.',
            ]}
            dontItems={[
              'TCA Panel과 함께 배경 Overlay(Dimmed backdrop)를 사용하지 않는다.',
              '패널 열림 시 기존 콘텐츠 영역을 강제로 리사이즈하지 않는다.',
              'AI 응답을 사용자 확인 없이 자동으로 실행하지 않는다.',
            ]}
          />
        </VStack>
      }
      relatedLinks={[
        { label: 'Drawer', path: '/design/components/drawer' },
        { label: 'TopBar', path: '/design/components/topbar' },
        { label: 'System Error', path: '/design/policies/system-error' },
        { label: 'Toast', path: '/design/components/toast' },
      ]}
    />
  );
}
