import type { Meta, StoryObj } from '@storybook/react';
import { useOverlay } from '../../services/hooks';
import { Button } from '../Button';
import ActionModal, { ActionModalProps } from './ActionModal';
import { InfoContainer } from '../InfoContainer';
import { InlineMessage } from '../InlineMessage';

/**
 * ActionModal 컴포넌트
 *
 * 사용자에게 확인/취소 액션을 요청하는 모달입니다.
 * 삭제, 해제, 확인 등의 액션에 사용됩니다.
 */

// 테스트용 ActionModal 래퍼 컴포넌트
interface TestActionModalProps extends ActionModalProps {
  resourceName?: string;
}

const TestActionModal = ({
  resourceName = 'vol57',
  onConfirm,
  onCancel,
  ...props
}: TestActionModalProps) => {
  return (
    <ActionModal {...props} onConfirm={onConfirm} onCancel={onCancel}>
      <InfoContainer label="Volume name" values={[resourceName]} />
      <InlineMessage type="warning" message="This action cannot be undone." />
    </ActionModal>
  );
};

const meta: Meta<typeof ActionModal> = {
  title: 'Overlay/ActionModal',
  component: ActionModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# ActionModal

사용자에게 확인/취소 액션을 요청하는 범용 모달 컴포넌트입니다.

## 사용 예시

\`\`\`tsx
import { useOverlay, ActionModal } from '@thaki/shared';

const MyComponent = () => {
  const { openOverlay } = useOverlay();

  const handleDelete = async () => {
    const confirmed = await openOverlay({
      component: ActionModal,
      props: {
        actionConfig: {
          title: 'Delete Item',
          subtitle: 'Are you sure you want to delete this item?',
          actionButtonText: 'Delete',
          actionButtonVariant: 'error',
          cancelButtonText: 'Cancel',
        },
        onAction: async () => {
          // 삭제 로직
        },
      },
      options: { type: 'modal' },
    });
  };
};
\`\`\`

## Props

- **actionConfig**: 모달 설정 (title, subtitle, actionButtonText, actionButtonVariant, cancelButtonText)
- **onAction**: 확인 버튼 클릭 시 호출되는 콜백
- **focusActionButtonOnOpen**: 모달이 열릴 때 확인 버튼 자동 포커스 여부 (기본값: true)
- **isLoading**: 로딩 상태
- **loadingText**: 로딩 중 버튼 텍스트
- **children**: 모달 내용
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    actionConfig: {
      description: '액션 모달 설정',
    },
    onAction: {
      description: '확인 버튼 클릭 시 호출되는 콜백',
    },
    focusActionButtonOnOpen: {
      control: 'boolean',
      description: '모달이 열릴 때 확인 버튼 자동 포커스 여부',
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태',
    },
    loadingText: {
      control: 'text',
      description: '로딩 중 버튼 텍스트',
    },
  },
};

type Story = StoryObj<typeof meta>;

// Story wrapper component to use the hook
const StoryWrapper = ({
  actionConfig,
  focusActionButtonOnOpen,
  isLoading,
  loadingText,
}: {
  actionConfig: ActionModalProps['actionConfig'];
  focusActionButtonOnOpen?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}) => {
  const { openOverlay } = useOverlay();

  const handleClick = async (): Promise<void> => {
    const result = await openOverlay({
      component: TestActionModal,
      props: {
        actionConfig,
        focusActionButtonOnOpen,
        isLoading,
        loadingText,
        resourceName: 'vol57',
      },
      options: { type: 'modal' },
    });
    console.log('ActionModal result:', result);
  };

  return <Button onClick={handleClick}>Open ActionModal</Button>;
};

const Default: Story = {
  args: {
    actionConfig: {
      title: 'Detach Volume',
      subtitle: 'Are you sure you want to detach this volume?',
      actionButtonText: 'Release',
      actionButtonVariant: 'primary',
      cancelButtonText: 'Cancel',
    },
    focusActionButtonOnOpen: true,
    isLoading: false,
    loadingText: 'Processing...',
  },
  render: (args) => (
    <StoryWrapper
      actionConfig={
        args.actionConfig ?? {
          title: 'Detach Volume',
          subtitle: 'Are you sure you want to detach this volume?',
          actionButtonText: 'Release',
          actionButtonVariant: 'primary',
          cancelButtonText: 'Cancel',
        }
      }
      focusActionButtonOnOpen={args.focusActionButtonOnOpen}
      isLoading={args.isLoading}
      loadingText={args.loadingText}
    />
  ),
};

export default meta;
export { Default };
