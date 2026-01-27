import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopBar, TopBarAction } from './TopBar';
import { Breadcrumb } from '../Breadcrumb';
import { IconBell, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof TopBar> = {
  title: 'Components/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
## TopBar 컴포넌트

애플리케이션 상단 네비게이션 바 컴포넌트입니다.

### 구성 요소
- **사이드바 토글**: 좌측 사이드바 열기/닫기
- **네비게이션**: 뒤로가기/앞으로가기 버튼
- **Breadcrumb**: 현재 위치 표시
- **액션**: 우측 액션 버튼들

### TopBarAction
일관된 스타일의 액션 버튼 컴포넌트입니다.
- 알림 뱃지 지원
- 접근성 레이블 필수

### 사용 시기
- 메인 애플리케이션 헤더
- 대시보드 상단 네비게이션
- IDE 스타일 레이아웃

### 예시
\`\`\`tsx
<TopBar
  onSidebarToggle={() => {}}
  breadcrumb={<Breadcrumb items={[...]} />}
  actions={
    <>
      <TopBarAction icon={<IconBell />} aria-label="Notifications" badge />
      <TopBarAction icon={<IconSettings />} aria-label="Settings" />
    </>
  }
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    showSidebarToggle: {
      control: 'boolean',
      description: '사이드바 토글 버튼 표시',
      table: { defaultValue: { summary: 'false' } },
    },
    showNavigation: {
      control: 'boolean',
      description: '네비게이션 버튼 표시',
      table: { defaultValue: { summary: 'true' } },
    },
    canGoBack: {
      control: 'boolean',
      description: '뒤로가기 활성화',
      table: { defaultValue: { summary: 'true' } },
    },
    canGoForward: {
      control: 'boolean',
      description: '앞으로가기 활성화',
      table: { defaultValue: { summary: 'true' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TopBar>;

// Default
export const Default: Story = {
  render: () => (
    <TopBar
      breadcrumb={
        <Breadcrumb
          items={[
            { label: 'Compute', href: '/compute' },
            { label: 'Instances', href: '/compute/instances' },
            { label: 'web-server-01' },
          ]}
        />
      }
      actions={
        <>
          <TopBarAction icon={<IconSearch size={16} />} aria-label="Search" />
          <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" />
          <TopBarAction icon={<IconSettings size={16} />} aria-label="Settings" />
        </>
      }
    />
  ),
};

// With Sidebar Toggle
export const WithSidebarToggle: Story = {
  render: () => (
    <TopBar
      showSidebarToggle
      onSidebarToggle={() => console.log('Toggle sidebar')}
      breadcrumb={
        <Breadcrumb
          items={[{ label: 'Container', href: '/container' }, { label: 'Deployments' }]}
        />
      }
      actions={<TopBarAction icon={<IconUser size={16} />} aria-label="Profile" />}
    />
  ),
};

// With Notification Badge
export const WithNotificationBadge: Story = {
  render: () => (
    <TopBar
      breadcrumb={<Breadcrumb items={[{ label: 'Dashboard' }]} />}
      actions={
        <>
          <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" badge />
          <TopBarAction icon={<IconSettings size={16} />} aria-label="Settings" />
        </>
      }
    />
  ),
};

// Without Navigation
export const WithoutNavigation: Story = {
  render: () => (
    <TopBar
      showNavigation={false}
      breadcrumb={
        <Breadcrumb items={[{ label: 'Settings', href: '/settings' }, { label: 'Account' }]} />
      }
    />
  ),
};

// Disabled Navigation
export const DisabledNavigation: Story = {
  render: () => (
    <TopBar
      canGoBack={false}
      canGoForward={false}
      breadcrumb={<Breadcrumb items={[{ label: 'Home' }]} />}
    />
  ),
};

// Minimal
export const Minimal: Story = {
  render: () => (
    <TopBar showNavigation={false} breadcrumb={<Breadcrumb items={[{ label: 'Simple Page' }]} />} />
  ),
};

// Full Featured
export const FullFeatured: Story = {
  render: () => (
    <TopBar
      showSidebarToggle
      onSidebarToggle={() => console.log('Toggle')}
      onBack={() => console.log('Back')}
      onForward={() => console.log('Forward')}
      canGoBack={true}
      canGoForward={false}
      breadcrumb={
        <Breadcrumb
          items={[
            { label: 'Storage', href: '/storage' },
            { label: 'Buckets', href: '/storage/buckets' },
            { label: 'my-bucket', href: '/storage/buckets/my-bucket' },
            { label: 'files' },
          ]}
        />
      }
      actions={
        <>
          <TopBarAction icon={<IconSearch size={16} />} aria-label="Search" />
          <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" badge />
          <TopBarAction icon={<IconSettings size={16} />} aria-label="Settings" />
          <TopBarAction icon={<IconUser size={16} />} aria-label="Profile" />
        </>
      }
    />
  ),
};
