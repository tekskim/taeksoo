import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';
import { Typography } from '../Typography';
import Layout from '../Layout';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Feedback/Loading',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '로딩 상태를 표시하는 스피너 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '스피너 크기',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'white'],
      description: '스피너 색상',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
};

export const Sizes: Story = {
  render: () => (
    <Layout.HStack gap="lg" align="center">
      <Layout.VStack gap="sm" align="center">
        <Typography.Text variant="caption">Small</Typography.Text>
        <LoadingSpinner size="sm" />
      </Layout.VStack>
      <Layout.VStack gap="sm" align="center">
        <Typography.Text variant="caption">Medium</Typography.Text>
        <LoadingSpinner size="md" />
      </Layout.VStack>
      <Layout.VStack gap="sm" align="center">
        <Typography.Text variant="caption">Large</Typography.Text>
        <LoadingSpinner size="lg" />
      </Layout.VStack>
    </Layout.HStack>
  ),
};

export const Colors: Story = {
  render: () => (
    <Layout.HStack gap="lg" align="center">
      <Layout.VStack gap="sm" align="center">
        <Typography.Text variant="caption">Primary</Typography.Text>
        <LoadingSpinner color="primary" size="md" />
      </Layout.VStack>
      <Layout.VStack gap="sm" align="center">
        <Typography.Text variant="caption">Secondary</Typography.Text>
        <LoadingSpinner color="secondary" size="md" />
      </Layout.VStack>
      <Layout.VStack gap="sm" align="center" style={{ 
        backgroundColor: 'var(--semantic-color-text)', 
        padding: 'var(--semantic-space-md)', 
        borderRadius: 'var(--semantic-radius-sm)' 
      }}>
        <Typography.Text variant="caption" color="primary" style={{ color: 'white' }}>White</Typography.Text>
        <LoadingSpinner color="white" size="md" />
      </Layout.VStack>
    </Layout.HStack>
  ),
};

export const InContext: Story = {
  render: () => (
    <Layout.VStack gap="lg">
      <Layout.VStack gap="md">
        <Typography.Text>버튼 내부</Typography.Text>
        <Layout.HStack gap="sm" align="center" style={{ 
          padding: 'var(--semantic-space-md)', 
          backgroundColor: 'var(--semantic-color-primary)', 
          color: 'white',
          borderRadius: 'var(--semantic-radius-sm)' 
        }}>
          <LoadingSpinner size="sm" color="white" />
          <Typography.Text style={{ color: 'white' }}>로딩 중...</Typography.Text>
        </Layout.HStack>
      </Layout.VStack>
      
      <Layout.VStack gap="md">
        <Typography.Text>카드 중앙</Typography.Text>
        <Layout.VStack align="center" gap="md" style={{ 
          padding: 'var(--semantic-space-lg)', 
          border: '1px solid var(--semantic-color-border)',
          borderRadius: 'var(--semantic-radius-md)' 
        }}>
          <LoadingSpinner size="lg" />
          <Typography.Text variant="caption">데이터를 불러오는 중...</Typography.Text>
        </Layout.VStack>
      </Layout.VStack>
    </Layout.VStack>
  ),
};
