import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, ToastProvider, ToastContainer, useToast, type ToastData } from './Toast';
import { Button } from '../Button';
import { IconExternalLink } from '@tabler/icons-react';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Toast 컴포넌트

사용자에게 피드백 메시지를 표시하는 알림 컴포넌트입니다.

### 구성 요소
- **Toast**: 개별 토스트 메시지
- **ToastContainer**: 토스트를 표시할 컨테이너
- **ToastProvider**: 토스트 컨텍스트 제공자
- **useToast**: 토스트 훅

### Variants
- **success**: 성공 메시지 (녹색)
- **info**: 정보 메시지 (파란색)
- **warning**: 경고 메시지 (노란색) — 디자인 가이드라인에서는 Snackbar 사용 권장
- **error**: 에러 메시지 (빨간색) — 디자인 가이드라인에서는 Snackbar/InlineMessage 사용 권장

> **디자인 가이드라인**: Toast는 가벼운 피드백(Success/Info)에 사용합니다. Error/Warning 수준의 알림은 사용자의 확인이나 후속 액션이 필요하므로 Snackbar 또는 InlineMessage를 권장합니다.

### 사용법
\`\`\`tsx
// App.tsx에서 Provider 설정
<ToastProvider>
  <App />
  <ToastContainer position="top-right" />
</ToastProvider>

// 컴포넌트에서 사용
const { success, error, warning, info } = useToast();

success('작업이 완료되었습니다');
error('오류가 발생했습니다', { title: 'Error' });
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

// Mock toast for static display
const createMockToast = (overrides: Partial<ToastData>): ToastData => ({
  id: 'mock-toast',
  variant: 'success',
  message: 'This is a toast message',
  timestamp: new Date(),
  ...overrides,
});

// Success
export const Success: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'success',
        message: 'Instance created successfully',
      })}
      onDismiss={() => {}}
    />
  ),
};

// Warning
export const Warning: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'warning',
        message: 'Your session will expire in 5 minutes',
      })}
      onDismiss={() => {}}
    />
  ),
};

// Error
export const Error: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'error',
        message: 'Failed to connect to the server',
      })}
      onDismiss={() => {}}
    />
  ),
};

// Info
export const Info: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'info',
        message: 'A new update is available',
      })}
      onDismiss={() => {}}
    />
  ),
};

// With Title
export const WithTitle: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'success',
        title: 'Deployment Complete',
        message: 'Your application has been deployed to production',
      })}
      onDismiss={() => {}}
    />
  ),
};

// With Project Badge
export const WithProject: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'info',
        title: 'Build Started',
        message: 'Pipeline #1234 has started',
        project: 'my-project',
      })}
      onDismiss={() => {}}
    />
  ),
};

// With Link
export const WithLink: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'success',
        message: 'Instance web-server-01 is now running',
        link: {
          label: 'View instance',
          href: '#',
        },
      })}
      onDismiss={() => {}}
    />
  ),
};

// With Action Button
export const WithAction: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'warning',
        message: 'Certificate expires in 7 days',
        action: {
          label: 'Renew',
          icon: <IconExternalLink size={14} />,
          onClick: () => console.log('Action clicked'),
        },
      })}
      onDismiss={() => {}}
    />
  ),
};

// With Detail Section
export const WithDetail: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'error',
        title: 'Connection Failed',
        message: 'Unable to establish connection to database',
        detail: {
          code: 'ECONNREFUSED',
          content:
            'The server at 10.0.1.50:5432 refused the connection. Please check if the database server is running and accepting connections.',
        },
      })}
      onDismiss={() => {}}
    />
  ),
};

// Non-dismissible
export const NonDismissible: Story = {
  render: () => (
    <Toast
      toast={createMockToast({
        variant: 'info',
        message: 'Processing your request...',
        dismissible: false,
        duration: 0,
      })}
      onDismiss={() => {}}
    />
  ),
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <Toast
        toast={createMockToast({ variant: 'success', message: 'Success message' })}
        onDismiss={() => {}}
      />
      <Toast
        toast={createMockToast({ variant: 'warning', message: 'Warning message' })}
        onDismiss={() => {}}
      />
      <Toast
        toast={createMockToast({ variant: 'error', message: 'Error message' })}
        onDismiss={() => {}}
      />
      <Toast
        toast={createMockToast({ variant: 'info', message: 'Info message' })}
        onDismiss={() => {}}
      />
    </div>
  ),
};

// Interactive Demo
function InteractiveDemo() {
  const { success, warning, error, info, dismissAll } = useToast();

  return (
    <div className="flex flex-wrap gap-[var(--primitive-spacing-2)]">
      <Button
        size="sm"
        variant="primary"
        onClick={() => success('Operation completed successfully!')}
      >
        Success
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => warning('Please review before proceeding')}
      >
        Warning
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => error('Something went wrong', { title: 'Error' })}
      >
        Error
      </Button>
      <Button size="sm" variant="secondary" onClick={() => info('New features are available')}>
        Info
      </Button>
      <Button size="sm" variant="ghost" onClick={() => dismissAll()}>
        Clear All
      </Button>
    </div>
  );
}

export const Interactive: Story = {
  render: () => (
    <ToastProvider>
      <InteractiveDemo />
      <ToastContainer position="top-right" />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼을 클릭하여 다양한 토스트를 테스트해보세요.',
      },
    },
  },
};
