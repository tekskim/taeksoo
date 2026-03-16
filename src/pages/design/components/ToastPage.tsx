import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack } from '@/design-system';

const TOAST_GUIDELINES = `## Overview

Toast는 사용자의 작업에 대한 **짧고 즉각적인 피드백을 제공하는 비기록형 알림 컴포넌트**이다.
Toast는 지정된 알림 영역에 **짧은 시간 동안 표시된 후 자동으로 사라지며**, 사용자의 현재 작업 흐름을 방해하지 않고 상태 변화를 빠르게 전달한다.
Toast는 **알림센터나 글로벌 알림 패널에 기록되지 않는다.**

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Icon (optional) | 상태를 보조적으로 표시하는 아이콘 |
| Message | 사용자에게 전달되는 짧은 메시지 |

---

## Variants

| 유형 | 설명 |
| --- | --- |
| Success | 작업이 성공적으로 완료됨 |
| Info | 일반적인 상태 알림 |

> **Note**: Toast는 Success와 Info만 지원한다. Error/Warning 수준의 알림은 사용자의 확인이나 후속 액션이 필요하므로, Snackbar(기록형 알림) 또는 Inline Message(영속적 경고)를 사용한다.

---

## States

| 상태 | 설명 |
| --- | --- |
| Visible | 화면에 표시된 상태 |
| Closed | 자동 종료 또는 UI 종료 상태 |

---

## Behavior

### 1) 표시 위치
- Toast는 사용자의 시야에 들어오되 화면 작업을 방해하지 않는 위치에 표시되어야 한다.
- 토스트는 화면 하단 중앙에 표시된다.

### 2) 동시 노출 규칙
- Toast는 동시에 최대 1개만 표시된다.
- 새로운 Toast가 발생하면 이전 Toast는 즉시 교체된다.

### 3) 표시 시간
- 토스트는 3초간 표시된다.
- 토스트는 자동으로 종료된다.

### 4) 종료 조건
- 토스트는 다음 상황에서 종료된다.
  - 표시 시간이 만료된 경우
  - 새로운 Toast가 발생한 경우
- 사용자가 직접 닫는 버튼을 제공하지 않는다.

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Snackbar | Component | 기록형 알림 |
| Inline Message | Component | 지속 경고 |
| Modal | Component | 사용자 확인 |
| Notification Center | Component | 알림 기록 관리 |
| UX Writing Guide | Foundation | 메시지 작성 규칙 |
`;

export function ToastPage() {
  return (
    <ComponentPageTemplate
      title="Toast"
      description="사용자의 작업에 대한 짧고 즉각적인 피드백을 제공하는 비기록형 알림 컴포넌트. 지정된 알림 영역에 짧은 시간 동안 표시된 후 자동으로 사라지며, 사용자의 현재 작업 흐름을 방해하지 않고 상태 변화를 빠르게 전달한다."
      whenToUse={[
        '사용자의 간단한 UI 액션이 완료된 경우',
        '작업 결과를 빠르게 전달하면 충분한 경우',
        '기록이 필요 없는 일시적 피드백인 경우',
      ]}
      whenNotToUse={[
        '사용자의 작업 결과가 기록되어야 하는 경우 (→ Snackbar)',
        '사용자의 확인이 필요한 경우 (→ Modal)',
        '입력 오류 안내 (→ Validation)',
      ]}
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={TOAST_GUIDELINES} />
          <DosDonts
            doItems={[
              '가벼운 UI 피드백에 사용한다.',
              '메시지는 짧고 명확하게 작성한다.',
              '사용자가 후속 행동을 할 필요 없는 경우에 사용한다.',
            ]}
            dontItems={[
              '사용자 확인이 필요한 메시지를 Toast로 표시하지 않는다.',
              '기록이 필요한 알림에 사용하지 않는다.',
              '긴 문장을 사용하지 않는다.',
            ]}
          />
        </VStack>
      }
      relatedLinks={[
        { label: 'Snackbar', path: '/design/components/snackbar' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Modal', path: '/design/components/modal' },
      ]}
    />
  );
}
