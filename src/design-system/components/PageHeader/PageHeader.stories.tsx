import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { ContextMenu } from '../ContextMenu';
import { IconPlus, IconChevronDown } from '@tabler/icons-react';

const meta: Meta<typeof PageHeader> = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
리스트 페이지의 공통 헤더 컴포넌트. 제목과 우측 액션 버튼을 포함합니다.

**사용 위치:** 모든 리스트 페이지 최상단
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

// 기본 사용
export const Default: Story = {
  args: {
    title: 'Instances',
    actions: (
      <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
        Create Instance
      </Button>
    ),
  },
};

// 드롭다운 버튼
export const WithDropdownAction: Story = {
  args: {
    title: 'Pods',
    actions: (
      <ContextMenu
        items={[
          { id: 'yaml', label: 'From YAML', onClick: () => {} },
          { id: 'form', label: 'From Form', onClick: () => {} },
        ]}
        trigger="click"
        align="right"
      >
        <Button variant="primary" size="md" rightIcon={<IconChevronDown size={14} stroke={1.5} />}>
          Create Pod
        </Button>
      </ContextMenu>
    ),
  },
};

// 제목에 뱃지 추가
export const WithTitleExtra: Story = {
  args: {
    title: 'Security Groups',
    titleExtra: (
      <Badge variant="info" size="sm">
        12
      </Badge>
    ),
    actions: (
      <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
        Create Security Group
      </Button>
    ),
  },
};

// 액션 없음
export const TitleOnly: Story = {
  args: {
    title: 'Dashboard',
  },
};
