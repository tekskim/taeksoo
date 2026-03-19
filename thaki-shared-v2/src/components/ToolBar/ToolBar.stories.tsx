import type { Meta, StoryObj } from '@storybook/react';
import ToolBar from './ToolBar';

const meta: Meta<typeof ToolBar> = {
  title: 'Navigation/TopBar',
  component: ToolBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
ToolBar 컴포넌트는 앱 상단에 위치하는 네비게이션 및 액션 영역입니다.

## 구성 요소
1. **사이드바 토글 버튼** (선택): 사이드바가 접혀 있을 때 표시
2. **네비게이션 컨트롤**: 뒤로가기/앞으로가기 버튼
3. **브레드크럼**: 현재 경로 표시
4. **알림 센터 아이콘** (선택): 앱별 알림 관리

## 사용 예시
\`\`\`tsx
<ToolBar
  breadcrumbItems={[
    { label: 'Instances', onClick: () => navigate('/instances') },
    { label: 'Instance Detail' },
  ]}
  navigation={{
    canGoBack: true,
    canGoForward: false,
    onGoBack: goBack,
    onGoForward: goForward,
  }}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    breadcrumbItems: {
      description: '브레드크럼 아이템 배열',
    },
    navigation: {
      description: '네비게이션 컨트롤 설정',
    },
    isSidebarOpen: {
      description: '사이드바 상태 (true: 펼침, false: 접힘)',
      control: 'boolean',
    },
    onToggleSidebar: {
      description: '사이드바 토글 핸들러',
    },
    fullWidth: {
      description: '전체 너비 적용 여부',
      control: 'boolean',
    },
  },
  decorators: [
    Story => (
      <div className="bg-surface-muted p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToolBar>;

/**
 * 기본 ToolBar - 사이드바가 열린 상태
 */
export const Default: Story = {
  args: {
    breadcrumbItems: [
      { label: 'Compute', onClick: () => console.log('Navigate to Compute') },
      {
        label: 'Instances',
        onClick: () => console.log('Navigate to Instances'),
      },
      { label: 'Instance Detail' },
    ],
    navigation: {
      canGoBack: true,
      canGoForward: false,
      onGoBack: () => console.log('Go back'),
      onGoForward: () => console.log('Go forward'),
    },
    isSidebarOpen: true,
  },
};

/**
 * 사이드바가 접힌 상태 - 사이드바 토글 버튼이 표시됨
 */
export const SidebarClosed: Story = {
  args: {
    breadcrumbItems: [
      { label: 'Compute', onClick: () => console.log('Navigate to Compute') },
      { label: 'Instances' },
    ],
    navigation: {
      canGoBack: true,
      canGoForward: true,
      onGoBack: () => console.log('Go back'),
      onGoForward: () => console.log('Go forward'),
    },
    isSidebarOpen: false,
    onToggleSidebar: () => console.log('Toggle sidebar'),
  },
  parameters: {
    docs: {
      description: {
        story:
          '사이드바가 접힌 상태에서는 사이드바 토글 버튼이 네비게이션 컨트롤 앞에 표시됩니다.',
      },
    },
  },
};

/**
 * 알림 버튼은 항상 표시되며, 알림 상태는 NotificationHistoryStore에서 자동으로 관리됩니다
 */
export const WithUnreadNotification: Story = {
  args: {
    breadcrumbItems: [
      { label: 'IAM', onClick: () => console.log('Navigate to IAM') },
      { label: 'Users' },
    ],
    navigation: {
      canGoBack: true,
      canGoForward: false,
      onGoBack: () => console.log('Go back'),
      onGoForward: () => console.log('Go forward'),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          '읽지 않은 알림이 있을 때 알림 아이콘에 빨간 배지가 표시됩니다. 알림 상태는 NotificationHistoryStore에서 자동으로 관리됩니다.',
      },
    },
  },
};

/**
 * 네비게이션 버튼이 모두 비활성화된 상태
 */
export const NavigationDisabled: Story = {
  args: {
    breadcrumbItems: [{ label: 'Home' }],
    navigation: {
      canGoBack: false,
      canGoForward: false,
      onGoBack: () => console.log('Go back'),
      onGoForward: () => console.log('Go forward'),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          '히스토리가 없을 때 뒤로가기/앞으로가기 버튼이 비활성화 상태로 표시됩니다.',
      },
    },
  },
};

/**
 * 로딩 중인 브레드크럼
 */
export const LoadingBreadcrumb: Story = {
  args: {
    breadcrumbItems: [
      {
        label: 'Instances',
        onClick: () => console.log('Navigate to Instances'),
      },
      { label: '', isLoading: true },
    ],
    navigation: {
      canGoBack: true,
      canGoForward: false,
      onGoBack: () => console.log('Go back'),
      onGoForward: () => console.log('Go forward'),
    },
  },
  parameters: {
    docs: {
      description: {
        story: '브레드크럼 아이템이 로딩 중일 때 스켈레톤이 표시됩니다.',
      },
    },
  },
};

/**
 * 전체 너비가 아닌 ToolBar
 */
export const NotFullWidth: Story = {
  args: {
    breadcrumbItems: [
      { label: 'Settings', onClick: () => console.log('Navigate to Settings') },
      { label: 'Profile' },
    ],
    navigation: {
      canGoBack: true,
      canGoForward: false,
      onGoBack: () => console.log('Go back'),
      onGoForward: () => console.log('Go forward'),
    },
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'fullWidth를 false로 설정하면 내용에 맞게 너비가 조절됩니다.',
      },
    },
  },
};
