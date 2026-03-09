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

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Button | Component | 액션 실행 |
| Drawer | Component | 설정 편집 |
| Inline Message | Component | 상태 안내 |
| Snackbar | Component | 짧은 피드백 |

---

<details>
<summary>이전</summary>

## 1. 개요
- **정의**
  - 모달은 사용자가 리소스에 대해 액션을 실행하기 전에 확인을 받기 위한 UI로, 사용자의 실수를 방지하고, 액션으로 인해 발생할 수 있는 결과를 명확하게 인지시켜야 합니다.
- **적용 기준**
  - 다음과 같은 액션을 실행할 때 모달을 노출시켜 사용자의 실수를 방지합니다.
    1. 삭제, 중단 등 리소스 자체를 불가능한 상태로 만드는 파괴적 액션
    2. 연결 끊기, 연결 변경 등 리소스의 특정 기능에 문제를 만드는 치명적 영향 액션
    3. 데이터 손실 등 되돌릴 수 없을 수 있는 복구 불가 액션
    4. 여러 리소스를 대상으로 일어나는 일괄 액션

## 2. 구성 요소
1. 타이틀
   - 역할: 액션을 명확히 제시
   - 위치: 좌측 최 상단
   - 정책
     - \`KO\` 리소스+액션 구조로 작성 권장
     - \`EN\` 액션+리소스 구조로 작성 권장
       - 문장의 첫 글자만 대문자 사용 권장 (약어, 고유 명사에서 대문자를 사용해야하는 경우 제외)
       - 단일 대상일 때 단수형, 다중 대상일 때 복수형
2. 디스크립션
   - 역할: 상세한 액션에 대한 확인
   - 위치: 타이틀 하단
   - 정책
     - \`KO\` {리소스}를 정말 {액션}하시겠습니까?
     - \`EN\` Are you sure you want to {action} this {resource}? 형식으로 작성 권장
3. 주체 (선택)
   - 역할: 액션이 이뤄지는 대상 확인
   - 위치: 디스크립션 하단
   - 정책
     - {리소스명} + {이름} 조합
     - 액션이 이뤄지는 주된 대상이 하나일 때 노출
4. 액션이 가능한 주체 (선택)
   - 역할: 액션이 이뤄지는 대상 확인
   - 위치: 디스크립션 하단
   - 정책
     - \`KO\` {액션} 가능한 {리소스}
     - \`EN\` {resources} that can be {action}
5. 액션이 불가능한 주체 (선택)
   - 역할: 액션이 불가능한 대상 확인 → 백앤드 확인 필요없이 액션이 불가능하다고 판단 가능한 경우 표기
   - 위치: 액션이 가능한 주체 하단
   - 정책
     - \`KO\` {액션} 불가능한 {리소스}
     - \`EN\` {resources} that cannot be {action}
6. 경고 문구 (선택)
   - 역할: 액션이 이뤄졌을 때 발생할 수 있는 위험 미리 전달
   - 위치: 버튼 상단
   - 정책
     - 해당 액션으로 인해 다른 리소스에 영향을 미칠 수 있거나, 대상 리소스에 치명적인 오류 또는 서비스 중단을 초래할 수 있을 때 표기
7. 액션

</details>
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
        '짧은 확인 메세지 → Toast, Snackbar',
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
      relatedLinks={[
        { label: 'Button', path: '/design/components/button' },
        { label: 'Drawer', path: '/design/components/drawer' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Snackbar', path: '/design/components/snackbar' },
      ]}
    />
  );
}
