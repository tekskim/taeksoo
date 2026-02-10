import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuItem } from './MenuItem';
import { MenuSection } from './MenuSection';
import { MenuDivider } from './MenuDivider';
import {
  IconHome,
  IconSettings,
  IconUser,
  IconFolder,
  IconFile,
  IconTrash,
  IconLogout,
} from '@tabler/icons-react';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof MenuItem> = {
  title: 'Components/Menu',
  component: MenuItem,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="bg-[var(--color-surface-default)] p-[var(--primitive-spacing-4)] rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] w-fit">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
## Menu 컴포넌트

사이드바 또는 드롭다운에서 사용하는 메뉴 아이템 컴포넌트입니다.

### 구성 요소
- **MenuItem**: 개별 메뉴 항목
- **MenuSection**: 메뉴 섹션 (제목 포함)
- **MenuDivider**: 구분선

### MenuItem Props
- **icon**: 왼쪽 아이콘
- **label**: 메뉴 텍스트
- **href**: 링크 URL (react-router Link 사용)
- **active**: 현재 선택 상태
- **badge**: 뱃지 텍스트 (New, Beta 등)
- **disabled**: 비활성화 상태

### 사용 시기
- 사이드바 네비게이션
- 컨텍스트 메뉴
- 드롭다운 메뉴

### 예시
\`\`\`tsx
<MenuItem
  icon={<IconHome size={14} />}
  label="Dashboard"
  href="/dashboard"
  active={true}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    active: {
      control: 'boolean',
      description: '활성 상태',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
      table: { defaultValue: { summary: 'false' } },
    },
    badge: {
      control: 'text',
      description: '뱃지 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

// Default
export const Default: Story = {
  args: {
    icon: <IconHome size={14} stroke={1.5} />,
    label: 'Dashboard',
    href: '/dashboard',
  },
};

// Active
export const Active: Story = {
  args: {
    icon: <IconHome size={14} stroke={1.5} />,
    label: 'Dashboard',
    href: '/dashboard',
    active: true,
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    icon: <IconSettings size={14} stroke={1.5} />,
    label: 'Settings',
    disabled: true,
  },
};

// With Badge
export const WithBadge: Story = {
  args: {
    icon: <IconFolder size={14} stroke={1.5} />,
    label: 'New Feature',
    badge: 'New',
  },
};

// Without Icon
export const WithoutIcon: Story = {
  args: {
    label: 'Simple Menu Item',
  },
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-1)]">
      <MenuItem icon={<IconHome size={14} stroke={1.5} />} label="Default" />
      <MenuItem icon={<IconFolder size={14} stroke={1.5} />} label="Active" active />
      <MenuItem icon={<IconSettings size={14} stroke={1.5} />} label="Disabled" disabled />
      <MenuItem icon={<IconFile size={14} stroke={1.5} />} label="With Badge" badge="Beta" />
    </div>
  ),
};

// Sidebar Menu Example
export const SidebarMenu: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-1)] w-[200px]">
      <MenuSection label="Main" />
      <MenuItem
        icon={<IconHome size={14} stroke={1.5} />}
        label="Dashboard"
        href="/dashboard"
        active
      />
      <MenuItem icon={<IconUser size={14} stroke={1.5} />} label="Profile" href="/profile" />
      <MenuItem
        icon={<IconFolder size={14} stroke={1.5} />}
        label="Projects"
        href="/projects"
        badge="12"
      />

      <MenuDivider />

      <MenuSection label="Settings" />
      <MenuItem
        icon={<IconSettings size={14} stroke={1.5} />}
        label="Preferences"
        href="/settings"
      />
      <MenuItem icon={<IconTrash size={14} stroke={1.5} />} label="Trash" href="/trash" />

      <MenuDivider />

      <MenuItem
        icon={<IconLogout size={14} stroke={1.5} />}
        label="Logout"
        onClick={() => console.log('Logout')}
      />
    </div>
  ),
};

// Compact Menu
export const CompactMenu: Story = {
  render: () => (
    <div className="flex flex-col">
      <MenuItem label="Cut" onClick={() => {}} />
      <MenuItem label="Copy" onClick={() => {}} />
      <MenuItem label="Paste" onClick={() => {}} />
      <MenuDivider />
      <MenuItem label="Delete" onClick={() => {}} />
    </div>
  ),
};
