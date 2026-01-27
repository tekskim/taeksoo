import type { Meta, StoryObj } from '@storybook/react-vite';
import { SNBMenuItem } from './SNBMenuItem';
import {
  IconHome,
  IconSettings,
  IconFolder,
  IconServer,
  IconDatabase,
  IconCloud,
} from '@tabler/icons-react';

const meta: Meta<typeof SNBMenuItem> = {
  title: 'Components/SNBMenuItem',
  component: SNBMenuItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## SNBMenuItem 컴포넌트

좁은 사이드 네비게이션 바(Side Navigation Bar)의 메뉴 아이템 컴포넌트입니다.

### 특징
- 아이콘 또는 텍스트 타입 지원
- 세 가지 상태: default, hover, selected
- 38×38px 고정 크기

### 상태별 스타일
- **Default**: 흰색 배경, 회색 아이콘
- **Hover**: 연한 회색 배경, 진한 회색 아이콘
- **Selected**: 연한 파란색 배경, 파란색 아이콘

### 사용 시기
- 좁은 아이콘 기반 사이드바
- 앱 전환 메뉴
- 빠른 액션 패널

### 예시
\`\`\`tsx
<SNBMenuItem
  icon={<IconHome size={22} />}
  isSelected={false}
  onClick={() => navigate('/home')}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['icon', 'text'],
      description: '메뉴 아이템 타입',
      table: { defaultValue: { summary: 'icon' } },
    },
    status: {
      control: 'select',
      options: ['default', 'hover', 'selected'],
      description: '상태',
    },
    isSelected: {
      control: 'boolean',
      description: '선택 상태',
      table: { defaultValue: { summary: 'false' } },
    },
    iconSize: {
      control: 'number',
      description: '아이콘 크기',
      table: { defaultValue: { summary: '22' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SNBMenuItem>;

// Default
export const Default: Story = {
  args: {
    icon: <IconHome size={22} stroke={1.5} />,
    status: 'default',
  },
};

// Hover
export const Hover: Story = {
  args: {
    icon: <IconHome size={22} stroke={1.5} />,
    status: 'hover',
  },
};

// Selected
export const Selected: Story = {
  args: {
    icon: <IconHome size={22} stroke={1.5} />,
    status: 'selected',
  },
};

// Text Type
export const TextType: Story = {
  args: {
    type: 'text',
    text: 'A',
    status: 'default',
  },
};

// Text Type Selected
export const TextTypeSelected: Story = {
  args: {
    type: 'text',
    text: 'B',
    status: 'selected',
  },
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex gap-2">
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} status="default" />
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} status="hover" />
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} status="selected" />
    </div>
  ),
};

// Navigation Menu Example
export const NavigationMenu: Story = {
  render: () => (
    <div className="flex flex-col gap-1 bg-[var(--color-surface-default)] p-2 rounded-lg border border-[var(--color-border-default)] w-fit">
      <SNBMenuItem
        icon={<IconHome size={22} stroke={1.5} />}
        isSelected
        onClick={() => console.log('Home')}
      />
      <SNBMenuItem
        icon={<IconServer size={22} stroke={1.5} />}
        onClick={() => console.log('Compute')}
      />
      <SNBMenuItem
        icon={<IconDatabase size={22} stroke={1.5} />}
        onClick={() => console.log('Storage')}
      />
      <SNBMenuItem
        icon={<IconCloud size={22} stroke={1.5} />}
        onClick={() => console.log('Cloud')}
      />
      <SNBMenuItem
        icon={<IconFolder size={22} stroke={1.5} />}
        onClick={() => console.log('Files')}
      />
      <div className="h-px bg-[var(--color-border-subtle)] my-1" />
      <SNBMenuItem
        icon={<IconSettings size={22} stroke={1.5} />}
        onClick={() => console.log('Settings')}
      />
    </div>
  ),
};

// With isSelected Prop
export const WithIsSelected: Story = {
  render: () => (
    <div className="flex gap-2">
      <SNBMenuItem icon={<IconHome size={22} stroke={1.5} />} isSelected={false} />
      <SNBMenuItem icon={<IconSettings size={22} stroke={1.5} />} isSelected={true} />
    </div>
  ),
};

// Interactive
export const Interactive: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-1 bg-[var(--color-surface-default)] p-2 rounded-lg border border-[var(--color-border-default)] w-fit">
        <p className="text-xs text-[var(--color-text-muted)] mb-2 px-1">Hover to see effect</p>
        <SNBMenuItem
          icon={<IconHome size={22} stroke={1.5} />}
          onClick={() => alert('Home clicked!')}
        />
        <SNBMenuItem
          icon={<IconServer size={22} stroke={1.5} />}
          onClick={() => alert('Server clicked!')}
        />
        <SNBMenuItem
          icon={<IconDatabase size={22} stroke={1.5} />}
          onClick={() => alert('Database clicked!')}
        />
      </div>
    );
  },
};
