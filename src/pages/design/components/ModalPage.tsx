import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { NotionRenderer } from '../_shared/NotionRenderer';
import {
  ModalDemo,
  ModalUseCaseDemo,
  AIAgentModalDemo,
} from '../../design-system-sections/OverlayDemos';
import { VStack, HStack } from '@/design-system';

const MODAL_GUIDELINES = `## Overview

사용자가 특정 액션을 실행하기 전에 중요한 확인을 요구하거나 추가 입력을 받기 위해 화면 위에 표시되는 UI 컴포넌트이다.
Modal은 현재 화면 위에 오버레이 형태로 나타나며 사용자의 주의를 집중시키기 위해 배경 화면과의 상호작용을 일시적으로 차단한다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Title | 액션 명확화 |
| Description | 액션 설명 |
| Subject | 액션 대상 |
| Target resources | 액션 대상 목록 |
| Warning message | 위험 안내 |
| Actions | 사용자 선택 버튼 |

---

## Variants

| Variant | 설명 |
| --- | --- |
| Single resource confirmation | 단일 리소스 액션 확인 |
| Bulk action confirmation | 다중 리소스 일괄 작업 |
| Subject–Target confirmation | 주체와 대상이 존재하는 액션 |
| Information modal | 정보 전달 |

### 1) Single Resource Confirmation
- 단일 리소스에 대한 액션을 확인하는 모달이다.
- Subject 영역에 대상 리소스를 표시한다.

### 2) Bulk Action Confirmation
- 여러 리소스에 대한 액션을 수행하는 경우 사용한다.
- 선택된 리소스 중 액션이 가능한 리소스와 불가능한 리소스를 분리해서 보여준다.

### 3) Subject–Target Confirmation
- 주체와 대상이 존재하는 액션에서 사용된다.
- Subject와 Target을 명확히 구분한다.

### 4) Information Modal
- 사용자에게 중요한 정보를 전달하기 위한 모달이다.
- 확인 또는 닫기 버튼만 제공한다.

---

## Behavior

### 1) Modal Open
Modal은 다음 상황에서 열린다.
- 위험 액션 실행
- 시스템 상태 변경 작업
- 대량 리소스 작업

### 2) Modal Close
Modal은 다음 방법으로 닫을 수 있다.

| 방법 | 설명 |
| --- | --- |
| Cancel 버튼 | 작업 취소 |
| Close 버튼 | 모달 닫기 |
| 배경화면 영역 클릭 | 모달 닫기 |

### 3) Background Interaction
- 모달이 열려 있을 때 배경화면 영역을 클릭하면 모달이 닫힌다.
- 모달이 열려 있을 때도 배경 영역 스크롤이 가능하다.

### 4) Actions
Modal의 버튼은 다음 구조를 따른다.
파괴적 액션의 경우 Primary 버튼은 Danger 스타일을 사용한다.

| 버튼 | 역할 |
| --- | --- |
| Primary | 액션 실행 |
| Secondary | 취소 |

---

## Content Guidelines

### 1) Title
- \`KO\`: {리소스} {액션}
- \`EN\`: {Action} {resource}

### 2) Subject/Target
- 리소스 표기: {resource name}
- 작업 대상 표기:

| 유형 | 표현 |
| --- | --- |
| Actionable resources | {resources} that can be {action} |
| Non-actionable resources | {resources} that cannot be {action} |

`;

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
      description="사용자가 특정 액션을 실행하기 전에 중요한 확인을 요구하거나 추가 입력을 받기 위해 화면 위에 표시되는 UI 컴포넌트. 현재 화면 위에 오버레이 형태로 나타나며 배경 화면과의 상호작용을 일시적으로 차단한다."
      whenToUse={[
        '삭제, 중단 등 리소스를 사용할 수 없는 상태로 만드는 파괴적 액션',
        '연결 변경, 정책 수정 등 리소스 기능에 영향을 미치는 치명적 액션',
        '데이터 손실 등 되돌릴 수 없는 작업',
        '여러 리소스를 대상으로 하는 일괄 액션',
      ]}
      whenNotToUse={[
        '단순 정보 안내 → Inline message',
        '설정 편집 → Drawer',
        '긴 입력폼 → Full page',
        '짧은 확인 메시지 → Toast, Snackbar',
      ]}
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
      guidelines={<NotionRenderer markdown={MODAL_GUIDELINES} />}
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
      accessibility={
        <VStack gap={4} align="stretch">
          <p className="text-body-md text-[var(--color-text-muted)]">
            Modal은 사용자의 주의를 강제로 집중시키는 컴포넌트이므로, 접근성 요구사항이 특히
            중요합니다.
          </p>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">ARIA 속성</h4>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-body-md text-[var(--color-text-default)]">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3">
                      속성
                    </th>
                    <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3">
                      상태
                    </th>
                    <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      attr: 'role="dialog"',
                      status: 'Gap',
                      desc: '모달 컨테이너에 dialog role 필요',
                    },
                    {
                      attr: 'aria-modal="true"',
                      status: 'Gap',
                      desc: '배경 콘텐츠가 비활성임을 스크린 리더에 전달',
                    },
                    {
                      attr: 'aria-labelledby',
                      status: 'Gap',
                      desc: '모달 타이틀 요소의 id를 참조하여 모달의 목적 전달',
                    },
                    {
                      attr: 'aria-describedby',
                      status: 'Gap',
                      desc: 'description이 있을 경우 해당 요소 id 참조',
                    },
                  ].map((r) => (
                    <tr key={r.attr} className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 px-3 font-mono text-body-sm">{r.attr}</td>
                      <td className="py-2 px-3">
                        <span className="text-body-sm text-[var(--color-state-warning)]">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-body-sm text-[var(--color-text-muted)]">
                        {r.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </VStack>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Focus management</h4>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-body-md text-[var(--color-text-default)]">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3">
                      요구사항
                    </th>
                    <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3">
                      상태
                    </th>
                    <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      req: 'Focus trap',
                      status: 'Gap',
                      desc: 'Tab/Shift+Tab 키로 모달 내부에서만 포커스가 순환해야 함',
                    },
                    {
                      req: 'Initial focus',
                      status: 'Gap',
                      desc: '모달 열릴 때 첫 번째 포커스 가능 요소로 포커스 이동',
                    },
                    {
                      req: 'Focus restore',
                      status: 'Gap',
                      desc: '모달 닫힐 때 트리거 요소로 포커스 복원',
                    },
                  ].map((r) => (
                    <tr key={r.req} className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 px-3 text-label-sm">{r.req}</td>
                      <td className="py-2 px-3">
                        <span className="text-body-sm text-[var(--color-state-warning)]">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-body-sm text-[var(--color-text-muted)]">
                        {r.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </VStack>

          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-state-info-bg)]">
            <p className="text-body-sm text-[var(--color-text-default)]">
              <strong>참조:</strong> WAI-ARIA Authoring Practices 1.2 — Dialog (Modal) Pattern. 위
              Gap 항목은 인식된 개선 과제이며, 접근성 로드맵에 따라 순차적으로 구현 예정입니다.
            </p>
          </div>
        </VStack>
      }
      keyboardInteractions={[
        { key: 'Escape', description: '모달을 닫고 트리거 요소로 포커스 복원' },
        { key: 'Tab', description: '모달 내 다음 포커스 가능 요소로 이동 (trap 구현 시)' },
        {
          key: 'Shift + Tab',
          description: '모달 내 이전 포커스 가능 요소로 이동 (trap 구현 시)',
        },
        { key: 'Enter', description: '포커스된 버튼 활성화' },
        { key: 'Space', description: '포커스된 버튼 활성화' },
      ]}
      relatedLinks={[
        { label: 'Button', path: '/design/components/button' },
        { label: 'Drawer', path: '/design/components/drawer' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Snackbar', path: '/design/components/snackbar' },
      ]}
    />
  );
}
