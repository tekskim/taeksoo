import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Toast, VStack, HStack, Button, useToast } from '@/design-system';

const TOAST_GUIDELINES = `## Overview

Toast Message는 사용자의 작업에 대한 **짧고 즉각적인 피드백을 제공하는 비기록형 알림 컴포넌트**이다.

Toast는 지정된 알림 영역에 **짧은 시간 동안 표시된 후 자동으로 사라지며**, 사용자의 현재 작업 흐름을 방해하지 않고 상태 변화를 빠르게 전달하는 목적을 가진다.

Toast는 **알림센터나 글로벌 알림 패널에 기록되지 않는다.**

따라서 사용자가 반드시 확인하거나 추후 추적해야 하는 알림에는 사용하지 않는다.

---

## Composition

\`\`\`
[Icon] Message
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Icon (optional) | 상태를 보조적으로 표시하는 아이콘 |
| Message | 사용자에게 전달되는 짧은 메시지 |

---

## Variants

Toast는 **Success**와 **Info**의 두 가지 변형만 사용한다.

| 유형 | 설명 |
| --- | --- |
| Success | 작업이 성공적으로 완료됨 |
| Info | 일반적인 상태 알림 |

---

## States

| 상태 | 설명 |
| --- | --- |
| Visible | 화면에 표시된 상태 |
| Closed | 자동 종료 또는 UI 종료 상태 |

---

## Behavior

### 1) 표시 위치

- Toast는 **개별 앱(PageShell)의 main 영역 우측 하단**에 표시된다. (사이드바 제외)
- 사용자의 시야에 들어오되 작업을 방해하지 않는 위치이다.

### 2) 동시 노출 규칙

- Toast는 동시에 **최대 1개만** 표시된다.
- 새로운 Toast가 발생하면 이전 Toast는 즉시 교체된다.

### 3) 표시 시간

- Toast는 **2초**간 표시된다.
- Toast는 자동으로 종료된다.

### 4) 종료 조건

- Toast는 다음 상황에서 종료된다.
  - 표시 시간이 만료된 경우
  - 새로운 Toast가 발생한 경우
- **사용자가 직접 닫는 버튼은 제공하지 않는다.**

### 5) 애니메이션

- **진입**: 우측 밖에서 좌측으로 슬라이드 인 (300ms, ease-out)
- **퇴장**: 좌측에서 우측 밖으로 슬라이드 아웃 (300ms, ease-out)
- 페이드 인/아웃이 함께 적용된다.

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

const NOOP = () => {};

function ToastLiveDemo() {
  const { success, error, warning, info } = useToast();

  return (
    <VStack gap={3}>
      <VStack gap={1}>
        <span className="text-label-md text-[var(--color-text-default)]">Live demo</span>
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          버튼을 클릭하면 앱 영역 우측 하단에 실제 토스트가 표시된다.
        </span>
      </VStack>
      <HStack gap={2}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => success('Instance created successfully.')}
        >
          Success
        </Button>
        <Button variant="danger" size="sm" onClick={() => error('Volume create failed.')}>
          Error
        </Button>
        <Button variant="warning" size="sm" onClick={() => warning('Disk usage exceeded 90%.')}>
          Warning
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => info('Deployment scaled to 3 replicas.')}
        >
          Info
        </Button>
      </HStack>
    </VStack>
  );
}

export function ToastPage() {
  return (
    <ComponentPageTemplate
      title="Toast"
      description="사용자의 작업에 대한 짧고 즉각적인 피드백을 제공하는 비기록형 알림 컴포넌트. 짧은 시간 동안 표시된 후 자동으로 사라지며 작업 흐름을 방해하지 않는다. 알림센터나 글로벌 알림 패널에 기록되지 않으며, 반드시 확인하거나 추후 추적해야 하는 알림에는 사용하지 않는다."
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
      preview={
        <ComponentPreview code={`toast('Instance created successfully.');`} previewClassName="p-3">
          <VStack gap={3} className="items-start pointer-events-none">
            <Toast
              toast={{
                id: 'preview-default',
                variant: 'success',
                message: 'Instance created successfully.',
                duration: 0,
                dismissible: false,
              }}
              onDismiss={NOOP}
            />
          </VStack>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <ToastLiveDemo />
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">Default</span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                작업 완료 또는 상태 변화를 짧은 메시지로 전달한다.
              </span>
            </VStack>
            <div className="pointer-events-none">
              <Toast
                toast={{
                  id: 'ex-default',
                  variant: 'success',
                  message: 'Instance created successfully.',
                  duration: 0,
                  dismissible: false,
                }}
                onDismiss={NOOP}
              />
            </div>
          </VStack>
        </VStack>
      }
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
        { label: 'Notification Center', path: '/design/components/global-notification-panel' },
        { label: 'UX Writing Guide', path: '/design/policies/ux-writing' },
      ]}
    />
  );
}
