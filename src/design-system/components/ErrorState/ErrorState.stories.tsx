import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from './ErrorState';
import { Button } from '../Button';
import { IconAlertTriangle, IconWifiOff, IconServerOff } from '@tabler/icons-react';

const meta: Meta<typeof ErrorState> = {
  title: 'Feedback/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
에러 상태를 표시하는 컴포넌트. API 실패, 네트워크 오류 등의 상황에서 사용합니다.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

// 기본
export const Default: Story = {
  args: {
    icon: <IconAlertTriangle size={48} stroke={1} />,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again later.',
    action: (
      <Button variant="secondary" size="md">
        Retry
      </Button>
    ),
  },
};

// 네트워크 에러
export const NetworkError: Story = {
  args: {
    icon: <IconWifiOff size={48} stroke={1} />,
    title: 'Network Error',
    description: 'Unable to connect to the server. Please check your network connection.',
    action: (
      <Button variant="primary" size="md">
        Retry Connection
      </Button>
    ),
  },
};

// 서버 에러
export const ServerError: Story = {
  args: {
    icon: <IconServerOff size={48} stroke={1} />,
    title: '500 Internal Server Error',
    description: 'The server encountered an error. Our team has been notified.',
  },
};

// 최소형
export const Minimal: Story = {
  args: {
    title: 'Failed to load data',
    action: (
      <Button variant="secondary" size="sm">
        Retry
      </Button>
    ),
  },
};
