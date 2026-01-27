import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { IconHome, IconFolder, IconFile, IconSlash } from '@tabler/icons-react';
import { Breadcrumb } from './Breadcrumb';

/**
 * # Breadcrumb
 *
 * 현재 페이지의 위치를 계층 구조로 표시하는 네비게이션 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 사용자가 현재 위치를 파악해야 할 때
 * - 상위 페이지로 쉽게 이동해야 할 때
 * - 깊은 계층 구조의 페이지에서
 * - 파일 탐색기나 폴더 구조 표시
 *
 * ## 기능
 * - React Router `Link` 컴포넌트 사용
 * - 커스텀 구분자 지원
 * - 아이콘 지원
 * - 긴 경로 축소 (maxItems)
 * - 클릭 핸들러 지원
 *
 * ## 접근성
 * - `nav` 요소에 `aria-label="Breadcrumb"` 적용
 * - 현재 페이지에 `aria-current="page"` 적용
 * - 구분자에 `aria-hidden="true"` 적용
 */
const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '현재 페이지의 위치를 계층 구조로 표시하는 네비게이션 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    items: {
      control: 'object',
      description: 'Breadcrumb 항목 배열',
    },
    separator: {
      control: false,
      description: '커스텀 구분자',
    },
    maxItems: {
      control: { type: 'number', min: 0, max: 10 },
      description: '최대 표시 항목 수 (0 = 무제한)',
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Basic Examples
   ---------------------------------------- */

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Category', href: '/products/category' },
      { label: 'Item' },
    ],
  },
};

export const TwoLevels: Story = {
  name: 'Two Levels',
  args: {
    items: [{ label: 'Dashboard', href: '/' }, { label: 'Settings' }],
  },
};

export const ThreeLevels: Story = {
  name: 'Three Levels',
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Project Alpha' },
    ],
  },
};

/* ----------------------------------------
   With Icons
   ---------------------------------------- */

export const WithIcons: Story = {
  name: 'With Icons',
  args: {
    items: [
      { label: 'Home', href: '/', icon: <IconHome size={14} /> },
      { label: 'Documents', href: '/documents', icon: <IconFolder size={14} /> },
      { label: 'Report.pdf', icon: <IconFile size={14} /> },
    ],
  },
};

export const HomeIconOnly: Story = {
  name: 'Home Icon Only',
  render: () => (
    <Breadcrumb
      items={[
        { label: '', href: '/', icon: <IconHome size={16} /> },
        { label: 'Settings', href: '/settings' },
        { label: 'Profile' },
      ]}
    />
  ),
};

/* ----------------------------------------
   Custom Separator
   ---------------------------------------- */

export const SlashSeparator: Story = {
  name: 'Slash Separator',
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Users', href: '/users' },
      { label: 'John Doe' },
    ],
    separator: <IconSlash size={16} className="text-gray-400" />,
  },
};

export const TextSeparator: Story = {
  name: 'Text Separator',
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics' },
    ],
    separator: <span className="text-gray-400 text-sm">/</span>,
  },
};

/* ----------------------------------------
   Collapsed (maxItems)
   ---------------------------------------- */

export const Collapsed: Story = {
  name: 'Collapsed (Long Path)',
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Level 1', href: '/level1' },
      { label: 'Level 2', href: '/level1/level2' },
      { label: 'Level 3', href: '/level1/level2/level3' },
      { label: 'Level 4', href: '/level1/level2/level3/level4' },
      { label: 'Current Page' },
    ],
    maxItems: 4,
  },
};

export const CollapsedThreeItems: Story = {
  name: 'Collapsed (3 Items Max)',
  args: {
    items: [
      { label: 'Root', href: '/' },
      { label: 'Folder A', href: '/a' },
      { label: 'Folder B', href: '/a/b' },
      { label: 'Folder C', href: '/a/b/c' },
      { label: 'File.txt' },
    ],
    maxItems: 3,
  },
};

/* ----------------------------------------
   Click Handler
   ---------------------------------------- */

export const WithClickHandler: Story = {
  name: 'With Click Handler',
  render: () => (
    <Breadcrumb
      items={[
        { label: 'Home', onClick: () => alert('Navigate to Home') },
        { label: 'Products', onClick: () => alert('Navigate to Products') },
        { label: 'Current Item' },
      ]}
    />
  ),
};

/* ----------------------------------------
   Real World Examples
   ---------------------------------------- */

export const FileExplorer: Story = {
  name: 'Use Case - File Explorer',
  args: {
    items: [
      { label: 'My Drive', href: '/drive', icon: <IconFolder size={14} /> },
      { label: 'Work', href: '/drive/work', icon: <IconFolder size={14} /> },
      { label: 'Projects', href: '/drive/work/projects', icon: <IconFolder size={14} /> },
      { label: '2024', icon: <IconFolder size={14} /> },
    ],
  },
};

export const ECommerce: Story = {
  name: 'Use Case - E-Commerce',
  args: {
    items: [
      { label: 'Shop', href: '/' },
      { label: 'Electronics', href: '/electronics' },
      { label: 'Computers', href: '/electronics/computers' },
      { label: 'Laptops', href: '/electronics/computers/laptops' },
      { label: 'MacBook Pro 16"' },
    ],
    maxItems: 4,
  },
};

export const AdminPanel: Story = {
  name: 'Use Case - Admin Panel',
  args: {
    items: [
      { label: 'Admin', href: '/admin', icon: <IconHome size={14} /> },
      { label: 'Users', href: '/admin/users' },
      { label: 'User Details' },
    ],
  },
};
