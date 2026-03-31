import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Textarea } from './Textarea';
import { Typography } from '../Typography';
import Layout from '../Layout';

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '멀티라인 텍스트 입력을 위한 Textarea 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '입력 필드의 크기',
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: '리사이즈 옵션',
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
    autoResize: {
      control: 'boolean',
      description: '자동 높이 조절',
    },
    showCharacterCount: {
      control: 'boolean',
      description: '글자 수 표시',
    },
    rows: {
      control: 'number',
      description: '기본 행 수',
    },
    maxLength: {
      control: 'number',
      description: '최대 글자 수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
    size: 'md',
    rows: 4,
  },
};

export const Sizes: Story = {
  render: () => (
    <Layout.VStack gap="md" style={{ width: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Small</Typography.Text>
        <Textarea size="sm" placeholder="Small textarea" rows={3} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Medium (Default)</Typography.Text>
        <Textarea size="md" placeholder="Medium textarea" rows={4} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Large</Typography.Text>
        <Textarea size="lg" placeholder="Large textarea" rows={4} />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const States: Story = {
  render: () => (
    <Layout.VStack gap="md" style={{ width: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Default</Typography.Text>
        <Textarea placeholder="기본 상태" rows={3} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Error</Typography.Text>
        <Textarea placeholder="에러 상태" error rows={3} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Success</Typography.Text>
        <Textarea placeholder="성공 상태" success rows={3} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Disabled</Typography.Text>
        <Textarea placeholder="비활성화 상태" disabled rows={3} />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const ResizeOptions: Story = {
  render: () => (
    <Layout.VStack gap="md" style={{ width: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">None (리사이즈 불가)</Typography.Text>
        <Textarea resize="none" placeholder="리사이즈할 수 없습니다" rows={3} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Vertical (세로만)</Typography.Text>
        <Textarea resize="vertical" placeholder="세로로만 리사이즈 가능" rows={3} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Horizontal (가로만)</Typography.Text>
        <Textarea resize="horizontal" placeholder="가로로만 리사이즈 가능" rows={3} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Both (가로/세로 모두)</Typography.Text>
        <Textarea resize="both" placeholder="모든 방향으로 리사이즈 가능" rows={3} />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const AutoResize: Story = {
  render: () => (
    <Layout.VStack gap="md" style={{ width: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">일반 Textarea</Typography.Text>
        <Textarea placeholder="일반 textarea입니다. 내용이 늘어나도 높이가 고정됩니다." rows={2} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">자동 리사이즈</Typography.Text>
        <Textarea
          autoResize
          placeholder="자동 리사이즈 textarea입니다. 내용에 따라 높이가 자동 조절됩니다. 여러 줄을 입력해보세요!"
          rows={2}
        />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const CharacterCount: Story = {
  render: () => (
    <Layout.VStack gap="md" style={{ width: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">글자 수 제한 (100자)</Typography.Text>
        <Textarea
          placeholder="최대 100자까지 입력 가능합니다"
          maxLength={100}
          showCharacterCount
          rows={4}
        />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">글자 수 제한 (50자)</Typography.Text>
        <Textarea
          placeholder="최대 50자까지 입력 가능합니다"
          maxLength={50}
          showCharacterCount
          rows={3}
        />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const CodeInput: Story = {
  render: () => (
    <Layout.VStack gap="md" style={{ width: '500px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">코드 입력 (모노스페이스 폰트)</Typography.Text>
        <Textarea
          placeholder={`function example() {
  console.log("Hello, World!");
  return true;
}`}
          rows={8}
          style={{ fontFamily: 'var(--semantic-font-familyMono)' }}
          resize="vertical"
        />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">JSON 입력</Typography.Text>
        <Textarea
          placeholder={`{
  "name": "example",
  "version": "1.0.0",
  "description": "Example JSON"
}`}
          rows={6}
          style={{ fontFamily: 'var(--semantic-font-familyMono)' }}
          maxLength={500}
          showCharacterCount
        />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

// 상태 관리 예시
const ControlledTextareaExample = () => {
  const [value, setValue] = useState('');
  const [autoResize, setAutoResize] = useState(false);

  return (
    <Layout.VStack gap="md" style={{ width: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">입력된 글자 수: {value.length}</Typography.Text>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={autoResize}
            onChange={(e) => setAutoResize(e.target.checked)}
          />
          <Typography.Text variant="caption">자동 리사이즈</Typography.Text>
        </label>
      </Layout.VStack>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="제어된 textarea 필드"
        rows={3}
        autoResize={autoResize}
        maxLength={200}
        showCharacterCount
      />
      <Layout.VStack>
        <Typography.Text variant="caption">입력된 내용:</Typography.Text>
        <div
          style={{
            padding: '12px',
            backgroundColor: 'var(--semantic-color-surfaceLight)',
            borderRadius: 'var(--semantic-radius-base)',
            minHeight: '60px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--semantic-font-family)',
            fontSize: 'var(--semantic-font-sizeSm)',
            color: 'var(--semantic-color-textMuted)',
          }}
        >
          {value || '(내용이 없습니다)'}
        </div>
      </Layout.VStack>
    </Layout.VStack>
  );
};

export const Controlled: Story = {
  render: () => <ControlledTextareaExample />,
};
