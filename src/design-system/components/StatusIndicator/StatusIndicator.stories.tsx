import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusIndicator, type StatusType } from './StatusIndicator';

/**
 * # StatusIndicator
 *
 * 리소스나 작업의 상태를 시각적으로 표시하는 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 서버/인스턴스 상태 표시 (Active, Error, Building 등)
 * - 작업 진행 상태 표시 (Pending, Deleting 등)
 * - 리소스 사용 상태 표시 (In-use, Mounted 등)
 * - 테이블이나 카드에서 상태 정보 표시
 *
 * ## 상태 카테고리
 * - **Success (녹색)**: active
 * - **Danger (빨강)**: error
 * - **Info (파랑)**: building, deleting, pending
 * - **Warning (주황)**: verify-resized, degraded, no-monitor, down, maintenance
 * - **Muted (회색)**: suspended, shelved, shelved-offloaded, mounted, shutoff, paused, draft, deactivated, in-use
 *
 * ## 레이아웃
 * - **icon-only**: 아이콘만 표시 (원형 배경)
 * - **default**: 아이콘 + 라벨 (pill 형태)
 * - **badge**: 아이콘 + 라벨 (사각형 배지)
 *
 * ## 접근성
 * - `role="status"`로 상태 정보 전달
 * - `aria-label`로 스크린 리더에 상태 설명
 */
const meta = {
  title: 'Components/StatusIndicator',
  component: StatusIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '리소스나 작업의 상태를 시각적으로 표시하는 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'active',
        'error',
        'building',
        'deleting',
        'suspended',
        'shelved',
        'shelved-offloaded',
        'mounted',
        'shutoff',
        'paused',
        'pending',
        'draft',
        'verify-resized',
        'deactivated',
        'in-use',
        'maintenance',
        'degraded',
        'no-monitor',
        'down',
      ] as StatusType[],
      description: '상태 유형',
    },
    layout: {
      control: 'select',
      options: ['icon-only', 'default', 'badge'],
      description: '레이아웃 유형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '크기 (icon-only 레이아웃에만 적용)',
    },
    label: {
      control: 'text',
      description: '커스텀 라벨 (기본값 덮어쓰기)',
    },
  },
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Basic Examples
   ---------------------------------------- */

export const Active: Story = {
  args: {
    status: 'active',
    layout: 'default',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    layout: 'default',
  },
};

export const Building: Story = {
  args: {
    status: 'building',
    layout: 'default',
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
    layout: 'default',
  },
};

/* ----------------------------------------
   Layout Variants
   ---------------------------------------- */

export const IconOnly: Story = {
  name: 'Layout - Icon Only',
  args: {
    status: 'active',
    layout: 'icon-only',
    size: 'md',
  },
};

export const DefaultLayout: Story = {
  name: 'Layout - Default (Pill)',
  args: {
    status: 'active',
    layout: 'default',
  },
};

export const BadgeLayout: Story = {
  name: 'Layout - Badge',
  args: {
    status: 'active',
    layout: 'badge',
  },
};

/* ----------------------------------------
   Sizes (Icon Only)
   ---------------------------------------- */

export const AllSizes: Story = {
  name: 'All Sizes (Icon Only)',
  render: () => (
    <div className="flex items-center gap-[var(--primitive-spacing-4)]">
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <StatusIndicator status="active" layout="icon-only" size="sm" />
        <span className="text-body-sm text-[var(--color-text-subtle)]">sm</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <StatusIndicator status="active" layout="icon-only" size="md" />
        <span className="text-body-sm text-[var(--color-text-subtle)]">md</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
        <StatusIndicator status="active" layout="icon-only" size="lg" />
        <span className="text-body-sm text-[var(--color-text-subtle)]">lg</span>
      </div>
    </div>
  ),
};

/* ----------------------------------------
   All Statuses by Category
   ---------------------------------------- */

export const SuccessStatuses: Story = {
  name: 'Category - Success (Green)',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <StatusIndicator status="active" layout="default" />
    </div>
  ),
};

export const DangerStatuses: Story = {
  name: 'Category - Danger (Red)',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <StatusIndicator status="error" layout="default" />
    </div>
  ),
};

export const InfoStatuses: Story = {
  name: 'Category - Info (Blue)',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <StatusIndicator status="building" layout="default" />
      <StatusIndicator status="deleting" layout="default" />
      <StatusIndicator status="pending" layout="default" />
    </div>
  ),
};

export const WarningStatuses: Story = {
  name: 'Category - Warning (Orange)',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-3)]">
      <StatusIndicator status="verify-resized" layout="default" />
      <StatusIndicator status="degraded" layout="default" />
      <StatusIndicator status="no-monitor" layout="default" />
      <StatusIndicator status="down" layout="default" />
      <StatusIndicator status="maintenance" layout="default" />
    </div>
  ),
};

export const MutedStatuses: Story = {
  name: 'Category - Muted (Gray)',
  render: () => (
    <div className="flex flex-wrap gap-[var(--primitive-spacing-3)]">
      <StatusIndicator status="suspended" layout="default" />
      <StatusIndicator status="shelved" layout="default" />
      <StatusIndicator status="shelved-offloaded" layout="default" />
      <StatusIndicator status="mounted" layout="default" />
      <StatusIndicator status="shutoff" layout="default" />
      <StatusIndicator status="paused" layout="default" />
      <StatusIndicator status="draft" layout="default" />
      <StatusIndicator status="deactivated" layout="default" />
      <StatusIndicator status="in-use" layout="default" />
    </div>
  ),
};

/* ----------------------------------------
   All Statuses Overview
   ---------------------------------------- */

export const AllStatuses: Story = {
  name: 'All Statuses',
  render: () => {
    const statuses: StatusType[] = [
      'active',
      'error',
      'building',
      'deleting',
      'suspended',
      'shelved',
      'shelved-offloaded',
      'mounted',
      'shutoff',
      'paused',
      'pending',
      'draft',
      'verify-resized',
      'deactivated',
      'in-use',
      'maintenance',
      'degraded',
      'no-monitor',
      'down',
    ];

    return (
      <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
        <div className="grid grid-cols-3 gap-[var(--primitive-spacing-4)]">
          {statuses.map((status) => (
            <div key={status} className="flex items-center gap-[var(--primitive-spacing-3)]">
              <StatusIndicator status={status} layout="icon-only" size="md" />
              <StatusIndicator status={status} layout="default" />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ----------------------------------------
   Custom Label
   ---------------------------------------- */

export const CustomLabel: Story = {
  name: 'With Custom Label',
  args: {
    status: 'active',
    layout: 'default',
    label: 'Running',
  },
};

/* ----------------------------------------
   Use Cases
   ---------------------------------------- */

export const InstanceTable: Story = {
  name: 'Use Case - Instance Table',
  render: () => (
    <div className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] overflow-hidden">
      <table className="w-full text-body-md">
        <thead className="bg-[var(--color-surface-subtle)]">
          <tr>
            <th className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left">
              Instance
            </th>
            <th className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              web-server-01
            </td>
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              <StatusIndicator status="active" layout="icon-only" size="sm" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              web-server-02
            </td>
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              <StatusIndicator status="building" layout="icon-only" size="sm" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              db-server-01
            </td>
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              <StatusIndicator status="error" layout="icon-only" size="sm" />
            </td>
          </tr>
          <tr className="border-t">
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              cache-server-01
            </td>
            <td className="px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
              <StatusIndicator status="shutoff" layout="icon-only" size="sm" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

export const ResourceCard: Story = {
  name: 'Use Case - Resource Card',
  render: () => (
    <div className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-[var(--primitive-spacing-4)] w-64">
      <div className="flex items-center justify-between mb-[var(--primitive-spacing-3)]">
        <h3 className="text-label-lg text-[var(--color-text-default)]">Production Server</h3>
        <StatusIndicator status="active" layout="badge" />
      </div>
      <div className="text-body-md text-[var(--color-text-muted)]">
        <p>CPU: 45%</p>
        <p>Memory: 2.4 GB / 8 GB</p>
        <p>Uptime: 15 days</p>
      </div>
    </div>
  ),
};
