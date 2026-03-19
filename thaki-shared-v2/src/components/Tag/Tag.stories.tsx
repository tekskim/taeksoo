import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Layout from '../Layout';
import { Typography } from '../Typography';
import Tag from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Data Display/Chip',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '태그/뱃지 컴포넌트입니다. 키-값 쌍을 표시하거나 제거 가능한 라벨로 사용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: '태그 라벨',
    },
    value: {
      control: 'text',
      description: '태그 값 (선택사항)',
    },
    onClose: {
      action: 'closed',
      description: '닫기 버튼 클릭 콜백',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'tag',
    onClose: () => console.log('Tag closed'),
  },
};

export const WithValue: Story = {
  args: {
    label: 'tag',
    value: 'value',
    onClose: () => console.log('Tag closed'),
  },
};

export const WithoutClose: Story = {
  args: {
    label: 'Read-only tag',
  },
};

export const Variants: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Label Only</Typography.Text>
        <Layout.HStack gap="sm">
          <Tag label="Design" onClose={() => {}} />
          <Tag label="Development" onClose={() => {}} />
          <Tag label="Testing" onClose={() => {}} />
        </Layout.HStack>
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Label with Value</Typography.Text>
        <Layout.HStack gap="sm">
          <Tag label="environment" value="production" onClose={() => {}} />
          <Tag label="region" value="ap-northeast-2" onClose={() => {}} />
          <Tag label="version" value="1.0.0" onClose={() => {}} />
        </Layout.HStack>
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">
          Read-only (No Close Button)
        </Typography.Text>
        <Layout.HStack gap="sm">
          <Tag label="Status" value="Active" />
          <Tag label="Priority" value="High" />
          <Tag label="Category" value="Bug" />
        </Layout.HStack>
      </Layout.VStack>
    </Layout.VStack>
  ),
};

const DynamicTagsExample = () => {
  const [tags, setTags] = useState([
    { id: '1', label: 'React' },
    { id: '2', label: 'TypeScript' },
    { id: '3', label: 'Storybook' },
  ]);

  const handleRemoveTag = (id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  };

  return (
    <Layout.VStack gap="sm">
      <Typography.Text variant="caption">
        클릭하여 태그 제거 ({tags.length}개)
      </Typography.Text>
      <Layout.HStack gap="sm" style={{ flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <Tag
            key={tag.id}
            label={tag.label}
            onClose={() => handleRemoveTag(tag.id)}
          />
        ))}
      </Layout.HStack>
    </Layout.VStack>
  );
};

export const DynamicTags: Story = {
  render: () => <DynamicTagsExample />,
};

const KeyValueTagsExample = () => {
  const [filters, setFilters] = useState([
    { id: '1', label: 'status', value: 'active' },
    { id: '2', label: 'type', value: 'instance' },
    { id: '3', label: 'region', value: 'us-east-1' },
  ]);

  const handleRemoveFilter = (id: string) => {
    setFilters(prev => prev.filter(filter => filter.id !== id));
  };

  return (
    <Layout.VStack gap="sm">
      <Typography.Text variant="caption">
        필터 태그 ({filters.length}개)
      </Typography.Text>
      <Layout.HStack gap="sm" style={{ flexWrap: 'wrap' }}>
        {filters.map(filter => (
          <Tag
            key={filter.id}
            label={filter.label}
            value={filter.value}
            onClose={() => handleRemoveFilter(filter.id)}
          />
        ))}
      </Layout.HStack>
    </Layout.VStack>
  );
};

export const KeyValueFilters: Story = {
  render: () => <KeyValueTagsExample />,
};
