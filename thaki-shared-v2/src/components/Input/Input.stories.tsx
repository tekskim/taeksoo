import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Layout from '../Layout';
import { Typography } from '../Typography';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '텍스트 입력을 위한 기본 Input 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '입력 필드의 크기',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel', 'url', 'search'],
      description: 'HTML input 타입',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    success: {
      control: 'boolean',
      description: '성공 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Small</Typography.Text>
        <Input size="sm" placeholder="Small input" />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Medium (Default)</Typography.Text>
        <Input size="md" placeholder="Medium input" />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Large</Typography.Text>
        <Input size="lg" placeholder="Large input" />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const States: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Default</Typography.Text>
        <Input placeholder="기본 상태" />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Error</Typography.Text>
        <Input placeholder="에러 상태" error />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Success</Typography.Text>
        <Input placeholder="성공 상태" success />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Disabled</Typography.Text>
        <Input placeholder="비활성화 상태" disabled />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const Types: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Text</Typography.Text>
        <Input type="text" placeholder="일반 텍스트" />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Email</Typography.Text>
        <Input type="email" placeholder="example@email.com" />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Password</Typography.Text>
        <Input type="password" placeholder="비밀번호" />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Password with Toggle</Typography.Text>
        <Input type="password" placeholder="토글 가능한 비밀번호" showPasswordToggle />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

// 상태 관리 예시
const ControlledInputExample = () => {
  const [value, setValue] = useState('');

  return (
    <Layout.VStack gap="sm">
      <Typography.Text variant="caption">입력된 값: "{value}"</Typography.Text>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="제어된 입력 필드"
      />
    </Layout.VStack>
  );
};

export const Controlled: Story = {
  render: () => <ControlledInputExample />,
};
