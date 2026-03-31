import type { Meta, StoryObj } from '@storybook/react';
import { useOverlay } from '../../services/hooks';
import { Button } from '../Button';
import ResourceActionModal, { ResourceActionModalProps } from './ResourceActionModal';

/**
 * ResourceActionModal 컴포넌트
 *
 * ActionModal을 기반으로 리소스 관련 액션을 처리하는 모달입니다.
 * 단일 리소스, 다중 리소스, 주체-객체 관계 리소스 등 다양한 케이스를 지원합니다.
 */

const meta: Meta<typeof ResourceActionModal> = {
  title: 'Overlay/ResourceActionModal',
  component: ResourceActionModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# ResourceActionModal

리소스 관련 액션을 처리하는 모달 컴포넌트입니다.

## 사용 케이스

### 1. 단일 리소스 모달
단일 리소스에 대한 액션 확인 모달입니다.

### 2. 다중 리소스 모달
여러 리소스를 한번에 처리할 때 사용합니다.
- 액션 가능한 리소스
- 액션 불가능한 리소스 (상태 등의 이유로)

### 3. 주체-객체 관계 모달
서로 다른 두 리소스 간의 관계 액션 (예: Instance에서 Floating IP 분리)

## Props

- **actionConfig**: 모달 설정 (title, subtitle, actionButtonText, actionButtonVariant)
- **infoItems**: InfoContainer에 표시할 정보 목록 (label, values)
- **content**: InlineMessage에 표시할 컨텐츠 (type, message)
- **onAction**: 확인 버튼 클릭 시 콜백
- **isLoading**: 로딩 상태
- **loadingText**: 로딩 중 버튼 텍스트
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResourceActionModal>;

// Story wrapper component to use the hook
const StoryWrapper = ({
  actionConfig,
  infoItems,
  content,
  isLoading,
  loadingText,
}: Partial<ResourceActionModalProps>) => {
  const { openOverlay } = useOverlay();

  const handleClick = async (): Promise<void> => {
    const result = await openOverlay({
      component: ResourceActionModal,
      props: {
        actionConfig: actionConfig ?? {
          title: 'Delete Instance',
          subtitle: 'Are you sure you want to delete this instance?',
          actionButtonText: 'Delete',
          actionButtonVariant: 'error' as const,
          cancelButtonText: 'Cancel',
        },
        infoItems,
        content,
        isLoading,
        loadingText,
        onAction: async () => {
          console.log('Action executed');
        },
      },
      options: { type: 'modal' },
    });
    console.log('ResourceActionModal result:', result);
  };

  return <Button onClick={handleClick}>Open Modal</Button>;
};

/**
 * 단일 리소스 모달
 *
 * 단일 리소스에 대한 삭제/해제 등의 액션을 확인하는 모달입니다.
 */
export const SingleResource: Story = {
  render: () => (
    <StoryWrapper
      actionConfig={{
        title: 'Delete Instance',
        subtitle: 'Are you sure you want to delete this instance?',
        actionButtonText: 'Delete',
        actionButtonVariant: 'error',
        cancelButtonText: 'Cancel',
      }}
      infoItems={[{ label: 'Instance', values: ['web-server-1'] }]}
      content={{
        message:
          'Once deleted, all attached resources and data will be permanently lost. This action cannot be undone.',
      }}
    />
  ),
};

/**
 * 다중 리소스 모달
 *
 * 여러 리소스를 한번에 처리할 때 사용합니다.
 * 액션 가능/불가능 리소스를 구분하여 표시합니다.
 */
export const MultipleResources: Story = {
  render: () => (
    <StoryWrapper
      actionConfig={{
        title: 'Delete Instances',
        subtitle: 'Are you sure you want to delete these instances?',
        actionButtonText: 'Delete',
        actionButtonVariant: 'error',
        cancelButtonText: 'Cancel',
      }}
      infoItems={[
        {
          label: 'Instances that can be deleted',
          values: ['web-server-01', 'web-server-02', 'web-server-03', 'web-server-05'],
        },
        {
          label: 'Instances that cannot be deleted',
          values: [
            'my-server-04 (Locked instances cannot be deleted.)',
            'my-server-03 (Instances in current state cannot be deleted.)',
          ],
        },
      ]}
      content={{
        message:
          'Once deleted, all attached resources and data will be permanently lost. This action cannot be undone.',
      }}
    />
  ),
};

/**
 * 주체-객체 관계 모달
 *
 * 서로 다른 두 리소스 간의 관계 액션 (예: Instance에서 Floating IP 분리)
 */
export const SubjectObjectRelation: Story = {
  render: () => (
    <StoryWrapper
      actionConfig={{
        title: 'Disassociate Floating IP',
        subtitle: 'Are you sure you want to disassociate this floating IP from the instance?',
        actionButtonText: 'Confirm',
        actionButtonVariant: 'primary',
        cancelButtonText: 'Cancel',
      }}
      infoItems={[
        { label: 'Instance', values: ['web-server-1'] },
        { label: 'Floating IP', values: ['10.168.100.2'] },
      ]}
      content={{
        message: 'The instance will lose external network access once this floating IP is removed.',
      }}
    />
  ),
};

/**
 * 경고 메시지 없음
 *
 * 경고 메시지가 필요 없는 간단한 확인 모달입니다.
 */
export const WithoutWarning: Story = {
  render: () => (
    <StoryWrapper
      actionConfig={{
        title: 'Detach Volume',
        subtitle: 'Are you sure you want to detach this volume?',
        actionButtonText: 'Detach',
        actionButtonVariant: 'primary',
        cancelButtonText: 'Cancel',
      }}
      infoItems={[{ label: 'Volume', values: ['data-volume-01'] }]}
    />
  ),
};

/**
 * 로딩 상태
 *
 * 액션 처리 중 로딩 상태를 보여줍니다.
 */
export const Loading: Story = {
  render: () => (
    <StoryWrapper
      actionConfig={{
        title: 'Delete Instance',
        subtitle: 'Are you sure you want to delete this instance?',
        actionButtonText: 'Delete',
        actionButtonVariant: 'error',
        cancelButtonText: 'Cancel',
      }}
      infoItems={[{ label: 'Instance', values: ['web-server-1'] }]}
      content={{ message: 'This action cannot be undone.' }}
      isLoading={true}
      loadingText="Deleting..."
    />
  ),
};
