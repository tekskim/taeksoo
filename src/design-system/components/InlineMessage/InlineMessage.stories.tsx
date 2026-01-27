import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconRocket, IconBell } from '@tabler/icons-react';
import { InlineMessage } from './InlineMessage';

/**
 * # InlineMessage
 *
 * 인라인 알림 메시지를 표시하는 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 사용자에게 중요한 정보를 전달할 때
 * - 작업 결과(성공/실패)를 알릴 때
 * - 경고나 주의사항을 표시할 때
 * - 도움말이나 팁을 제공할 때
 *
 * ## Variants
 * - **info** (파랑): 일반 정보, 도움말
 * - **success** (녹색): 성공 메시지, 완료 알림
 * - **warning** (주황): 경고, 주의사항
 * - **error** (빨강): 에러, 실패 메시지
 *
 * ## 접근성
 * - `role="status"` 속성으로 스크린 리더가 인식
 * - 색상 외에도 아이콘으로 상태 구분
 * - 충분한 색상 대비로 가독성 확보
 */
const meta = {
  title: 'Components/InlineMessage',
  component: InlineMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '인라인 알림 메시지를 표시하는 컴포넌트입니다. info, success, warning, error 네 가지 variant를 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: '메시지 유형',
    },
    children: {
      control: 'text',
      description: '메시지 내용',
    },
    hideIcon: {
      control: 'boolean',
      description: '아이콘 숨김 여부',
    },
    icon: {
      control: false,
      description: '커스텀 아이콘',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InlineMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Basic Variants
   ---------------------------------------- */

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is an informational message to help guide the user.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Your changes have been saved successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Please review your settings before proceeding.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'An error occurred while processing your request.',
  },
};

/* ----------------------------------------
   Variations
   ---------------------------------------- */

export const WithoutIcon: Story = {
  name: 'Without Icon',
  args: {
    variant: 'info',
    children: 'This message is displayed without an icon.',
    hideIcon: true,
  },
};

export const WithCustomIcon: Story = {
  name: 'With Custom Icon',
  args: {
    variant: 'info',
    children: 'New feature available! Check out the latest updates.',
    icon: (
      <IconRocket size={16} className="text-[var(--inline-message-info-icon)]" strokeWidth={1.5} />
    ),
  },
};

export const LongMessage: Story = {
  name: 'Long Message',
  args: {
    variant: 'warning',
    children:
      'This is a longer message that demonstrates how the component handles multiple lines of text. The icon should stay aligned to the top while the text wraps naturally.',
  },
};

/* ----------------------------------------
   All Variants Comparison
   ---------------------------------------- */

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <InlineMessage variant="info">Info: This is an informational message.</InlineMessage>
      <InlineMessage variant="success">
        Success: Your operation completed successfully.
      </InlineMessage>
      <InlineMessage variant="warning">Warning: Please review before continuing.</InlineMessage>
      <InlineMessage variant="error">Error: Something went wrong.</InlineMessage>
    </div>
  ),
};

/* ----------------------------------------
   Use Cases
   ---------------------------------------- */

export const FormValidation: Story = {
  name: 'Use Case - Form Validation',
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <InlineMessage variant="error">
        Password must be at least 8 characters long and contain a number.
      </InlineMessage>
    </div>
  ),
};

export const FeatureAnnouncement: Story = {
  name: 'Use Case - Feature Announcement',
  render: () => (
    <InlineMessage
      variant="info"
      icon={
        <IconBell size={16} className="text-[var(--inline-message-info-icon)]" strokeWidth={1.5} />
      }
    >
      New: Dark mode is now available! Go to Settings to enable it.
    </InlineMessage>
  ),
};

export const DeploymentStatus: Story = {
  name: 'Use Case - Deployment Status',
  render: () => (
    <div className="flex flex-col gap-4 w-full">
      <InlineMessage variant="success">
        Deployment successful! Your application is now live.
      </InlineMessage>
      <InlineMessage variant="warning">
        Deployment in progress. This may take a few minutes.
      </InlineMessage>
      <InlineMessage variant="error">
        Deployment failed. Please check the logs for more details.
      </InlineMessage>
    </div>
  ),
};
