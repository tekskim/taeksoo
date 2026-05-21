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
- 탭 필터링 (All, Unread)
- Critical Alert Section (상단 고정, danger border)
- 읽음/안읽음 상태 관리
- 알림 상세 정보 확장 (failed, critical만)

### NotificationItem 구조
\`\`\`ts
interface NotificationItem {
  id: string;
  type: 'critical' | 'warning' | 'success' | 'failed';
  message: string;
  time: string;
  project?: string;
  isRead?: boolean;
  isResolved?: boolean;
  detail?: {
    code?: string | number;
    message?: string;
  };
}
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
    id: 'c1',
    type: 'critical',
    message: 'Node "worker-03" became NotReady.',
    time: '09:58',
    project: 'default',
    isRead: false,
    isResolved: false,
    detail: { code: 'NODE_NOT_READY', message: 'Kubelet stopped posting node status.' },
  },
  {
    id: '1',
    type: 'success',
    message: 'Instance "web-server-01" has been successfully created.',
    time: '09:55',
    project: 'Production',
    isRead: false,
  },
  {
    id: '2',
    type: 'failed',
    message: 'Failed to connect to database server.',
    time: '09:42',
    project: 'Backend',
    isRead: false,
    detail: {
      code: 'ECONNREFUSED',
      message:
        'Connection refused at 10.0.1.50:5432. Please check if the database server is running.',
    },
  },
  {
    id: '3',
    type: 'success',
    message: 'Scheduled maintenance completed successfully.',
    time: '08:30',
    project: 'Storage',
    isRead: true,
  },
  {
    id: '4',
    type: 'warning',
    message: 'Certificate expires in 7 days.',
    time: 'May 20',
    isRead: true,
  },
  {
    id: '5',
    type: 'success',
    message: 'Backup completed successfully.',
    time: 'May 20',
    project: 'Database',
    isRead: true,
  },
];

export const Default: Story = {
  render: () => (
    <NotificationCenter
      notifications={sampleNotifications}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
      onResolveCritical={(id) => console.log('Resolve critical:', id)}
      onNotificationClick={(n) => console.log('Clicked:', n)}
    />
  ),
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);

    const handleMarkAsRead = (id: string) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    };

    const handleMarkAllAsRead = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const handleResolve = (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isResolved: true, isRead: true } : n))
      );
    };

    return (
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onResolveCritical={handleResolve}
        onNotificationClick={(n) => console.log('Clicked:', n)}
      />
    );
  },
};

export const EmptyState: Story = {
  render: () => (
    <NotificationCenter
      notifications={[]}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
    />
  ),
};

export const AllRead: Story = {
  render: () => (
    <NotificationCenter
      notifications={sampleNotifications.map((n) => ({ ...n, isRead: true, isResolved: true }))}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
    />
  ),
};

export const OnlyFailures: Story = {
  render: () => (
    <NotificationCenter
      notifications={[
        {
          id: '1',
          type: 'failed',
          message: 'Database connection failed',
          time: '09:52',
          project: 'Backend',
          isRead: false,
          detail: {
            code: 500,
            message: 'Internal server error occurred while connecting to the database.',
          },
        },
        {
          id: '2',
          type: 'failed',
          message: 'API rate limit exceeded',
          time: '09:47',
          project: 'API Gateway',
          isRead: false,
          detail: { code: 429, message: 'Too many requests. Please try again later.' },
        },
        {
          id: '3',
          type: 'failed',
          message: 'SSL certificate expired',
          time: '08:30',
          project: 'Security',
          isRead: true,
        },
      ]}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
    />
  ),
};

export const WithCriticalAlerts: Story = {
  render: function CriticalAlertStory() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([
      {
        id: 'c1',
        type: 'critical',
        message: 'Node "worker-03" became NotReady.',
        time: '09:58',
        project: 'default',
        isRead: false,
        isResolved: false,
        detail: { code: 'NODE_NOT_READY', message: 'Kubelet stopped posting node status.' },
      },
      {
        id: 'c2',
        type: 'critical',
        message: 'Pod "api-gateway" crash loop detected.',
        time: '09:55',
        project: 'prod',
        isRead: false,
        isResolved: false,
        detail: { code: 'ERR_CRASH_LOOP', message: 'Container exited with code 137 (OOMKilled).' },
      },
      {
        id: '1',
        type: 'success',
        message: 'Deployment completed.',
        time: '09:48',
        isRead: true,
      },
      {
        id: '2',
        type: 'failed',
        message: 'Volume creation failed.',
        time: '09:38',
        project: 'Backend',
        isRead: false,
        detail: { code: 400, message: 'Insufficient storage quota.' },
      },
    ]);

    return (
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={(id) =>
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
        }
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        }
        onResolveCritical={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isResolved: true, isRead: true } : n))
          )
        }
      />
    );
  },
};

export const ManyNotifications: Story = {
  render: () => (
    <NotificationCenter
      notifications={Array.from({ length: 20 }, (_, i) => ({
        id: String(i + 1),
        type: (['success', 'failed', 'warning', 'critical'] as const)[i % 4],
        message: `Notification message ${i + 1}`,
        time: `${String(9 - Math.floor(i / 6)).padStart(2, '0')}:${String(59 - ((i * 3) % 60)).padStart(2, '0')}`,
        project: `Project ${(i % 3) + 1}`,
        isRead: i > 5,
        isResolved: i > 3,
      }))}
      onMarkAsRead={(id) => console.log('Mark as read:', id)}
      onMarkAllAsRead={() => console.log('Mark all as read')}
      onResolveCritical={(id) => console.log('Resolve:', id)}
    />
  ),
};
