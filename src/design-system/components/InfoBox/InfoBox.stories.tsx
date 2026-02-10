import type { Meta, StoryObj } from '@storybook/react';
import { InfoBox } from './InfoBox';
import { Chip } from '../Chip';

const meta: Meta<typeof InfoBox> = {
  title: 'Data Display/InfoBox',
  component: InfoBox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
정보를 라벨-값 쌍으로 표시하는 박스 컴포넌트. Drawer/Modal의 컨텍스트 정보 또는 상세 페이지의 요약 정보에 사용합니다.

**사용 위치:**
- Form Drawer의 리소스 정보 표시
- Modal의 삭제 대상 정보
- 상세 페이지의 요약 카드
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InfoBox>;

// 기본 - 텍스트 값
export const Default: Story = {
  args: {
    label: 'Instance ID',
    value: 'i-1234567890abcdef0',
  },
};

// 복합 값 (children)
export const WithChildren: Story = {
  render: () => (
    <InfoBox label="Labels (3)">
      <div className="flex flex-wrap items-center gap-[var(--primitive-spacing-1)]">
        <Chip label="app=nginx" size="sm" />
        <Chip label="env=production" size="sm" />
        <Chip label="version=1.0" size="sm" />
      </div>
    </InfoBox>
  ),
};

// 그룹으로 사용
export const Group: Story = {
  render: () => (
    <InfoBox.Group>
      <InfoBox label="Resource Name" value="my-deployment" />
      <InfoBox label="Namespace" value="default" />
      <InfoBox label="Created at" value="2026-02-06 14:30:00" />
    </InfoBox.Group>
  ),
};

// Drawer 내 사용 예시
export const InDrawerContext: Story = {
  render: () => (
    <div className="w-[344px]">
      <InfoBox.Group>
        <InfoBox label="Resource ID" value="vol-0123456789abcdef" />
        <InfoBox label="Current Status" value="Available" />
      </InfoBox.Group>
    </div>
  ),
};
