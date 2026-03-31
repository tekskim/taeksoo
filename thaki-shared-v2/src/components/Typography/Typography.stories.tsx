import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';
import Layout from '../Layout';

const meta: Meta = {
  title: 'Foundation/Typography',
  component: Typography.Title,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '텍스트 표시를 위한 Typography 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

export const Overview: StoryObj = {
  name: 'Overview',
  render: () => (
    <Layout.Container maxWidth="md" padding="lg">
      <Layout.VStack gap="lg">
        {/* 제목들 */}
        <Layout.VStack gap="sm">
          <Typography.Title level={1}>Title Level 1 (h1)</Typography.Title>
          <Typography.Title level={2}>Title Level 2 (h2)</Typography.Title>
          <Typography.Title level={3}>Title Level 3 (h3)</Typography.Title>
          <Typography.Title level={4}>Title Level 4 (h4)</Typography.Title>
        </Layout.VStack>

        {/* 텍스트 변형들 */}
        <Layout.VStack gap="sm">
          <Typography.Text variant="paragraph">
            Paragraph: The quick brown fox jumps over the lazy dog.
          </Typography.Text>
          <Typography.Text variant="detail">
            Detail: The quick brown fox jumps over the lazy dog.
          </Typography.Text>
          <Typography.Text variant="caption">
            Caption: Used for smaller, supporting text.
          </Typography.Text>
          <Typography.Label>Label: For form elements</Typography.Label>
        </Layout.VStack>

        {/* 색상 변형들 */}
        <Layout.VStack gap="sm">
          <Typography.Text color="primary">Primary Color</Typography.Text>
          <Typography.Text color="secondary">Secondary Color</Typography.Text>
          <Typography.Text color="error">Error Color</Typography.Text>
          <Typography.Text color="warning">Warning Color</Typography.Text>
          <Typography.Text color="info">Info Color</Typography.Text>
          <Typography.Text color="success">Success Color</Typography.Text>
        </Layout.VStack>
      </Layout.VStack>
    </Layout.Container>
  ),
};

export const Titles: StoryObj = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Title level={1}>Main Heading</Typography.Title>
      <Typography.Title level={2}>Section Heading</Typography.Title>
      <Typography.Title level={3}>Subsection Heading</Typography.Title>
      <Typography.Title level={4}>Minor Heading</Typography.Title>
    </Layout.VStack>
  ),
};

export const TextVariants: StoryObj = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Text variant="paragraph">
        This is paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography.Text>
      <Typography.Text variant="detail">
        This is detail text. Sed do eiusmod tempor incididunt ut labore.
      </Typography.Text>
      <Typography.Text variant="caption">
        This is caption text. Ut enim ad minim veniam.
      </Typography.Text>
      <Typography.Label>This is label text</Typography.Label>
    </Layout.VStack>
  ),
};

export const Colors: StoryObj = {
  render: () => (
    <Layout.VStack gap="sm">
      <Typography.Text color="primary">Primary text color</Typography.Text>
      <Typography.Text color="secondary">Secondary text color</Typography.Text>
      <Typography.Text color="success">Success text color</Typography.Text>
      <Typography.Text color="warning">Warning text color</Typography.Text>
      <Typography.Text color="error">Error text color</Typography.Text>
      <Typography.Text color="info">Info text color</Typography.Text>
    </Layout.VStack>
  ),
};
