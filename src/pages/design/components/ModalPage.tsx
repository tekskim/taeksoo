import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
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
| Escape 키 | 모달 닫기 |
| 배경화면 영역 클릭 | 모달 닫기 |

> **Note**: Close(X) 버튼은 기본적으로 표시하지 않는다 (\`showCloseButton\` 기본값 \`false\`). Cancel 버튼, Escape 키, 배경 클릭으로 닫기를 제공한다.

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
              삭제 확인 등 반복적인 패턴을 위한 전용 컴포넌트.{' '}
              <span className="font-mono">infoLabel</span>,{' '}
              <span className="font-mono">infoValue</span>,{' '}
              <span className="font-mono">confirmVariant</span> props 지원.
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
            <span className="font-mono">padding: 24px</span> ·{' '}
            <span className="font-mono">gap: 16px</span> ·{' '}
            <span className="font-mono">radius: 16px</span> ·{' '}
            <span className="font-mono">backdrop: black/60</span>
          </div>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <span className="font-mono">width: 344px</span>
          </div>
        </VStack>
      }
      relatedLinks={[
        { label: 'Button', path: '/design/components/button' },
        { label: 'Drawer', path: '/design/components/drawer' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Snackbar', path: '/design/components/snackbar' },
      ]}
    />
  );
}
