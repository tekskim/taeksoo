import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import {
  ModalDemo,
  ModalUseCaseDemo,
  AIAgentModalDemo,
} from '../../design-system-sections/OverlayDemos';
import { Button, VStack, HStack } from '@/design-system';
import { IconAlertCircle } from '@tabler/icons-react';

const modalProps: PropDef[] = [
  { name: 'isOpen', type: 'boolean', required: true, description: 'Open state' },
  { name: 'onClose', type: '() => void', required: true, description: 'Close handler' },
  { name: 'title', type: 'string', required: true, description: 'Modal title' },
  { name: 'description', type: 'string', required: false, description: 'Description below title' },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    required: false,
    description: 'Modal width',
  },
  { name: 'children', type: 'ReactNode', required: false, description: 'Modal content' },
  {
    name: 'showCloseButton',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show close button',
  },
  {
    name: 'closeOnBackdropClick',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Close on backdrop click',
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Close on Escape key',
  },
];

export function ModalPage() {
  return (
    <ComponentPageTemplate
      title="Modal"
      description="Dialog overlay for confirmations, alerts, and user interactions"
      preview={<ModalDemo variant="delete" />}
      usage={{
        code: `import { Modal } from '@/design-system';\n\n<Modal\n  isOpen={isOpen}\n  onClose={handleClose}\n  title="Modal Title"\n  description="Optional description"\n  size="sm"\n>\n  {/* Content */}\n</Modal>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Use cases</span>
            <HStack gap={2} className="flex-wrap">
              <ModalUseCaseDemo useCase="delete-single" />
              <ModalUseCaseDemo useCase="delete-multiple" />
              <ModalUseCaseDemo useCase="disassociate" />
              <ModalUseCaseDemo useCase="restore-warning" />
            </HStack>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              ConfirmModal component
            </span>
            <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              삭제 확인 등 반복적인 패턴을 위한 전용 컴포넌트. <code>infoLabel</code>,{' '}
              <code>infoValue</code>, <code>confirmVariant</code> props 지원.
            </p>
            <ModalDemo variant="delete" />
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">AI Agent modals</span>
            <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              AI Agent 관리를 위한 모달 컴포넌트. Agent source 삭제 등의 확인 모달을 포함.
            </p>
            <AIAgentModalDemo />
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={8}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">1. 개요</h4>
                <VStack gap={2}>
                  <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                  <p className="text-body-md text-[var(--color-text-muted)]">
                    모달은 사용자가 리소스에 대해 액션을 실행하기 전에 확인을 받기 위한 UI로,
                    사용자의 실수를 방지하고, 액션으로 인해 발생할 수 있는 결과를 명확하게
                    인지시켜야 합니다.
                  </p>
                </VStack>
                <VStack gap={2}>
                  <h4 className="text-heading-h6 text-[var(--color-text-default)]">적용 기준</h4>
                  <p className="text-body-md text-[var(--color-text-muted)] mb-1">
                    다음과 같은 액션을 실행할 때 모달을 노출시켜 사용자의 실수를 방지합니다.
                  </p>
                  <ol className="list-decimal pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                    <li>
                      <strong>파괴적 액션</strong> — 삭제, 중단 등 리소스 자체를 불가능한 상태로
                      만드는 액션
                    </li>
                    <li>
                      <strong>치명적 영향 액션</strong> — 연결 끊기, 연결 변경 등 리소스의 특정
                      기능에 문제를 만드는 액션
                    </li>
                    <li>
                      <strong>복구 불가 액션</strong> — 데이터 손실 등 되돌릴 수 없을 수 있는 액션
                    </li>
                    <li>
                      <strong>일괄 액션</strong> — 여러 리소스를 대상으로 일어나는 액션
                    </li>
                  </ol>
                </VStack>
              </VStack>
            </VStack>
          </div>

          <VStack gap={3}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">2. 구성 요소</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">1. 타이틀</h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                  액션을 명확히 제시 · 좌측 최상단
                </p>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                  <li>
                    <code>KO</code> 리소스 + 액션 구조로 작성 권장
                  </li>
                  <li>
                    <code>EN</code> 액션 + 리소스 구조로 작성 권장
                  </li>
                  <li>문장의 첫 글자만 대문자 사용 권장</li>
                  <li>단일 대상 → 단수형, 다중 대상 → 복수형</li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                  2. 디스크립션
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                  상세한 액션에 대한 확인 · 타이틀 하단
                </p>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                  <li>
                    <code>KO</code> &#123;리소스&#125;를 정말 &#123;액션&#125;하시겠습니까?
                  </li>
                  <li>
                    <code>EN</code> Are you sure you want to &#123;action&#125; this
                    &#123;resource&#125;?
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                  3. 주체{' '}
                  <span className="text-body-sm text-[var(--color-text-subtle)] font-normal">
                    (선택)
                  </span>
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                  액션이 이뤄지는 대상 확인 · 디스크립션 하단
                </p>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                  <li>&#123;리소스명&#125; + &#123;이름&#125; 조합</li>
                  <li>액션이 이뤄지는 주된 대상이 하나일 때 노출</li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                  4. 액션 가능한 주체{' '}
                  <span className="text-body-sm text-[var(--color-text-subtle)] font-normal">
                    (선택)
                  </span>
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                  액션이 이뤄지는 대상 확인 · 디스크립션 하단
                </p>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                  <li>
                    <code>KO</code> &#123;액션&#125; 가능한 &#123;리소스&#125;
                  </li>
                  <li>
                    <code>EN</code> &#123;resources&#125; that can be &#123;action&#125;
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                  5. 액션 불가능한 주체{' '}
                  <span className="text-body-sm text-[var(--color-text-subtle)] font-normal">
                    (선택)
                  </span>
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                  액션이 불가능한 대상 확인 · 액션 가능한 주체 하단
                </p>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                  <li>
                    <code>KO</code> &#123;액션&#125; 불가능한 &#123;리소스&#125;
                  </li>
                  <li>
                    <code>EN</code> &#123;resources&#125; that cannot be &#123;action&#125;
                  </li>
                  <li>백엔드 확인 없이 액션이 불가능하다고 판단 가능한 경우 표기</li>
                </ul>
              </div>
              <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                  6. 경고 문구{' '}
                  <span className="text-body-sm text-[var(--color-text-subtle)] font-normal">
                    (선택)
                  </span>
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-1.5">
                  액션으로 인해 발생할 수 있는 위험 전달 · 버튼 상단
                </p>
                <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-0.5">
                  <li>다른 리소스에 영향을 미칠 수 있는 경우</li>
                  <li>대상 리소스에 치명적인 오류 또는 서비스 중단을 초래할 수 있을 때 표기</li>
                </ul>
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Inner components</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">
                  Info Box (single value)
                </span>
                <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1">
                  <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
                    Volume name
                  </span>
                  <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                    vol-01 (Available)
                  </span>
                </div>
              </div>

              <div className="p-4 border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">
                  Scrollable List (max-h: 96px)
                </span>
                <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1 max-h-[96px] overflow-y-auto sidebar-scroll">
                  <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
                    Security groups (6)
                  </span>
                  <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-1">
                    <li>sg-01</li>
                    <li>sg-02</li>
                    <li>sg-03</li>
                    <li>sg-04</li>
                    <li>sg-05</li>
                    <li>sg-06</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">
                  Warning Alert
                </span>
                <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-center">
                  <IconAlertCircle
                    size={16}
                    className="text-[var(--color-state-danger)] shrink-0"
                    stroke={1.5}
                  />
                  <p className="text-[11px] text-[var(--color-text-default)] leading-4">
                    This action will permanently delete the resource. This cannot be undone.
                  </p>
                </div>
              </div>

              <div className="p-4 border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">
                  Button Group
                </span>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="md" className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" className="flex-1">
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      tokens={
        <VStack gap={3}>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>padding: 24px</code> · <code>gap: 16px</code> · <code>radius: 16px</code> ·{' '}
            <code>backdrop: black/60</code>
          </div>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>sm: 400px</code> · <code>md: 480px</code> · <code>lg: 640px</code>
          </div>
        </VStack>
      }
      apiReference={modalProps}
      relatedLinks={[
        { label: 'Drawer', path: '/design/components/drawer', description: 'Slide-out panel' },
        {
          label: 'ConfirmModal',
          path: '/design/components/modal',
          description: 'Delete confirmation',
        },
        {
          label: 'Popover',
          path: '/design/components/popover',
          description: 'Lightweight overlay',
        },
      ]}
    />
  );
}
