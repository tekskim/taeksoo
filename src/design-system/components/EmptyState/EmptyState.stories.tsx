import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';
import { IconDatabase, IconSearch, IconFolder, IconPlus } from '@tabler/icons-react';

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
빈 상태를 표시하는 컴포넌트. 데이터가 없거나 검색 결과가 없을 때 사용합니다.

**변형:**
- \`card\`: 테두리와 배경이 있는 카드 형태 (기본)
- \`inline\`: 패딩만 있는 인라인 형태
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// 기본 - 카드 형태
export const Default: Story = {
  args: {
    icon: <IconDatabase size={48} stroke={1} />,
    title: 'No instances found',
    description: 'Create your first instance to get started.',
    action: (
      <Button variant="primary" size="md" leftIcon={<IconPlus size={12} stroke={1.5} />}>
        Create Instance
      </Button>
    ),
  },
};

// 검색 결과 없음
export const NoSearchResults: Story = {
  args: {
    icon: <IconSearch size={48} stroke={1} />,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria.',
  },
};

// 인라인 형태
export const Inline: Story = {
  args: {
    icon: <IconFolder size={48} stroke={1} />,
    title: 'No files uploaded',
    description: 'Drag and drop files here or click the upload button.',
    variant: 'inline',
    action: (
      <Button variant="secondary" size="sm">
        Upload File
      </Button>
    ),
  },
};

// 아이콘 없이
export const WithoutIcon: Story = {
  args: {
    title: 'No data available',
    description: 'Data will appear here once it becomes available.',
  },
};

// 액션 없이
export const WithoutAction: Story = {
  args: {
    icon: <IconDatabase size={48} stroke={1} />,
    title: 'No volumes attached',
    description: 'This instance does not have any volumes attached.',
  },
};
