import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationCenter, type NotificationItem } from './NotificationCenter';
import { useState } from 'react';

const meta: Meta<typeof NotificationCenter> = {
  title: 'Components/NotificationCenter',
  component: NotificationCenter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## NotificationCenter 컴포넌트

알림 목록을 표시하는 알림 센터 패널입니다.

### 특징
- 탭 필터링 (All, Unread, Error)
- 읽음/안읽음 상태 관리
- 알림 상세 정보 확장
- 프로젝트 태그 표시

### NotificationItem 구조
\`\`\`ts
interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  time: string;
  project?: string;
  isRead?: boolean;
  detail?: {
    code?: string | number;
    message?: string;
  };
}
\`\`\`

### 사용 시기
- 헤더 알림 드롭다운
- 알림 패널
- 시스템 이벤트 로그

### 예시
\`\`\`tsx
<NotificationCenter
  notifications={notifications}
  onMarkAsRead={(id) => markAsRead(id)}
  onMarkAllAsRead={() => markAllAsRead()}
/>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationCenter>;

const sampleNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'success',
    message: 'Instance "web-server-01" has been successfully created.',
    time: '2 min ago',
    project: 'Production',
    isRead: false,
  },
  {
    id: '2',
    type: 'error',
    message: 'Failed to connect to database server.',
    time: '15 min ago',
    project: 'Backend',
    isRead: false,
    detail: {
      code: 'ECONNREFUSED',
      message: 'Connection refused at 10.0.1.50:5432. Please check if the database server is running.',
    },
  },
  {
    id: '3',
    type: 'warning',
    message: 'Storage usage exceeded 80% threshold.',
    time: '1 hour ago',
    project: 'Storage',
    isRead: true,
  },
  {
    id: '4',
    type: 'info',
    message: 'Scheduled maintenance will occur at 2:00 AM UTC.',
    time: '3 hours ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'success',
    message: 'Backup completed successfully.',
    time: '5 hours ago',
    project: 'Database',
    isRead: true,
  },
];

// Default
export const Default: Story = {
  render: () => (
    <NotificationCenter
      notifications={sampleNotifications}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
      onNotificationClick={(n) => console.log('Clicked:', n)}
    />
  ),
};

// Interactive
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);
    
    const handleMarkAsRead = (id: string) => {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    };
    
    const handleMarkAllAsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };
    
    return (
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationClick={(n) => console.log('Clicked:', n)}
      />
    );
  },
};

// Empty State
export const EmptyState: Story = {
  render: () => (
    <NotificationCenter
      notifications={[]}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
    />
  ),
};

// All Read
export const AllRead: Story = {
  render: () => (
    <NotificationCenter
      notifications={sampleNotifications.map(n => ({ ...n, isRead: true }))}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
    />
  ),
};

// Only Errors
export const OnlyErrors: Story = {
  render: () => (
    <NotificationCenter
      notifications={[
        {
          id: '1',
          type: 'error',
          message: 'Database connection failed',
          time: '5 min ago',
          project: 'Backend',
          isRead: false,
          detail: {
            code: 500,
            message: 'Internal server error occurred while connecting to the database.',
          },
        },
        {
          id: '2',
          type: 'error',
          message: 'API rate limit exceeded',
          time: '10 min ago',
          project: 'API Gateway',
          isRead: false,
          detail: {
            code: 429,
            message: 'Too many requests. Please try again later.',
          },
        },
        {
          id: '3',
          type: 'error',
          message: 'SSL certificate expired',
          time: '1 hour ago',
          project: 'Security',
          isRead: true,
        },
      ]}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
    />
  ),
};

// With Details
export const WithDetails: Story = {
  render: () => (
    <NotificationCenter
      notifications={[
        {
          id: '1',
          type: 'error',
          message: 'Deployment failed for service "api-gateway"',
          time: '2 min ago',
          project: 'Production',
          isRead: false,
          detail: {
            code: 'DEPLOY_FAILED',
            message: 'Container failed health check after 3 attempts. Last error: Connection timeout to upstream service.',
          },
        },
        {
          id: '2',
          type: 'warning',
          message: 'High memory usage detected',
          time: '15 min ago',
          project: 'Monitoring',
          isRead: false,
          detail: {
            code: 'MEM_HIGH',
            message: 'Memory usage at 92%. Consider scaling up or optimizing memory-intensive processes.',
          },
        },
      ]}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
    />
  ),
};

// Many Notifications
export const ManyNotifications: Story = {
  render: () => (
    <NotificationCenter
      notifications={Array.from({ length: 20 }, (_, i) => ({
        id: String(i + 1),
        type: (['success', 'error', 'warning', 'info'] as const)[i % 4],
        message: `Notification message ${i + 1}`,
        time: `${i + 1} min ago`,
        project: `Project ${(i % 3) + 1}`,
        isRead: i > 5,
      }))}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
    />
  ),
};
