import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal, ConfirmModal } from './Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { FormField } from '../FormField';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Modal 컴포넌트

사용자의 주의를 집중시키는 오버레이 다이얼로그입니다.

### 종류
- **Modal**: 커스텀 콘텐츠를 담는 기본 모달
- **ConfirmModal**: 확인/취소 액션이 있는 확인 모달

### 사용 시기
- 중요한 정보 확인
- 삭제/제출 전 확인
- 폼 입력 (간단한 경우)
- 에러/경고 메시지

### 접근성
- ESC 키로 닫기 지원
- 포커스 트랩 (모달 내에서만 Tab 이동)
- 배경 클릭으로 닫기 (선택적)
- aria-modal, role="dialog" 자동 적용

### 예시
\`\`\`tsx
import { Modal, ConfirmModal } from '@thaki/tds';

// 기본 모달
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="제목"
>
  내용
</Modal>

// 확인 모달
<ConfirmModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="삭제 확인"
  description="정말 삭제하시겠습니까?"
  confirmVariant="danger"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '모달 크기 (sm: 344px, md: 480px, lg: 640px)',
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
      },
    },
    title: {
      control: 'text',
      description: '모달 제목',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: 'text',
      description: '모달 설명 (제목 아래 표시)',
      table: {
        type: { summary: 'string' },
      },
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: '배경 클릭시 닫기 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'ESC 키로 닫기 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    isOpen: {
      control: 'boolean',
      description: '모달 열림 상태',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onClose: {
      description: '모달 닫기 콜백',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Basic Modal
export const Default: Story = {
  render: function DefaultModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Title"
          description="This is a description text that provides more context about the modal."
        >
          <div className="text-body-md text-[var(--color-text-default)]">
            Modal content goes here. You can put any content inside the modal.
          </div>
        </Modal>
      </>
    );
  },
};

// Confirm Modal
export const Confirm: Story = {
  render: function ConfirmModalExample() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Confirm Modal</Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            alert('Confirmed!');
            setIsOpen(false);
          }}
          title="Confirm Action"
          description="This action proceeds with the changes."
        />
      </>
    );
  },
};

// Delete Confirm Modal
export const DeleteConfirm: Story = {
  render: function DeleteConfirmExample() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Delete Item
        </Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            alert('Deleted!');
            setIsOpen(false);
          }}
          title="Delete Item"
          description="Removing the selected instances is permanent and cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          infoLabel="Item name"
          infoValue="my-important-file.txt"
        />
      </>
    );
  },
};

// With Form
export const WithForm: Story = {
  render: function FormModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Profile</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Profile"
          description="Update your profile information."
        >
          <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
            <FormField label="Name">
              <Input placeholder="Enter your name" fullWidth />
            </FormField>
            <FormField label="Email">
              <Input type="email" placeholder="Enter your email" fullWidth />
            </FormField>
            <div className="flex gap-[var(--primitive-spacing-2)] mt-[var(--primitive-spacing-2)]">
              <Button variant="outline" onClick={() => setIsOpen(false)} fullWidth>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert('Saved!');
                  setIsOpen(false);
                }}
                fullWidth
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

// Loading State
export const Loading: Story = {
  render: function LoadingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsOpen(false);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Submit Action</Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => !isLoading && setIsOpen(false)}
          onConfirm={handleConfirm}
          title="Submit"
          description="This will submit the form."
          confirmText="Submit"
          isLoading={isLoading}
        />
      </>
    );
  },
};

// Warning Modal
export const Warning: Story = {
  render: function WarningModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button variant="warning" onClick={() => setIsOpen(true)}>
          Reset Settings
        </Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            alert('Settings reset!');
            setIsOpen(false);
          }}
          title="Reset Settings"
          description="This will reset all settings to their default values. Your current configuration will be lost."
          confirmText="Reset"
          cancelText="Keep Current"
          confirmVariant="warning"
        />
      </>
    );
  },
};

// No Backdrop Close
export const NoBackdropClose: Story = {
  render: function NoBackdropCloseModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Important Notice"
          description="You must click a button to close this modal."
          closeOnBackdropClick={false}
          closeOnEscape={false}
        >
          <div className="flex gap-[var(--primitive-spacing-2)]">
            <Button variant="outline" onClick={() => setIsOpen(false)} fullWidth>
              Got it
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};
