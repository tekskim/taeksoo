import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';
import { useState } from 'react';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Textarea 컴포넌트

여러 줄 텍스트 입력을 위한 폼 컴포넌트입니다.

### 사용 시기
- 설명, 메모, 주석 등 긴 텍스트 입력
- YAML/JSON 등 코드 입력 (code variant)
- 자동 높이 조절이 필요한 경우

### Variant
- **default**: 일반 텍스트 입력
- **code**: 모노스페이스 폰트 (코드 편집용)

### Resize 옵션
- **none**: 크기 조절 불가
- **vertical**: 세로만 조절 (기본값)
- **horizontal**: 가로만 조절
- **both**: 양방향 조절

### 접근성
- aria-invalid, aria-describedby 자동 연결
- maxLength + showCount로 글자 수 제한 시각화

### 예시
\`\`\`tsx
import { Textarea } from '@thaki/tds';

// 기본 사용
<Textarea placeholder="Enter description..." fullWidth />

// FormField와 함께
<FormField label="Description" helperText="최대 500자">
  <Textarea placeholder="Enter description..." maxLength={500} showCount fullWidth />
</FormField>

// 코드 입력
<Textarea variant="code" placeholder="apiVersion: v1..." fullWidth />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'code'],
      description: '스타일 변형',
      table: {
        type: { summary: '"default" | "code"' },
        defaultValue: { summary: '"default"' },
      },
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
      description: '크기 조절 방향',
      table: {
        type: { summary: '"none" | "vertical" | "horizontal" | "both"' },
        defaultValue: { summary: '"vertical"' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: '부모 컨테이너 너비에 맞춤',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
      table: { defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용 상태',
      table: { defaultValue: { summary: 'false' } },
    },
    showCount: {
      control: 'boolean',
      description: '글자 수 표시 (maxLength 필요)',
      table: { defaultValue: { summary: 'false' } },
    },
    autoResize: {
      control: 'boolean',
      description: '내용에 따라 자동 높이 조절',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'text',
      description: '에러 메시지',
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    placeholder: 'Enter text...',
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// Basic
export const Default: Story = {
  args: {
    placeholder: 'Enter description...',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// With Label
export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a detailed description...',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Required
export const Required: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Enter notes...',
    required: true,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// With Helper Text
export const WithHelperText: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
    helperText: 'Provide a detailed description of the resource.',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Character Count
export const WithCharacterCount: Story = {
  render: function CharacterCountExample() {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '400px' }}>
        <Textarea
          label="Bio"
          placeholder="Tell us about yourself..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          showCount
          fullWidth
        />
      </div>
    );
  },
};

// Error State
export const WithError: Story = {
  args: {
    label: 'Description',
    defaultValue: 'Too short',
    error: 'Description must be at least 20 characters.',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Code Variant
export const CodeVariant: Story = {
  args: {
    variant: 'code',
    label: 'YAML Configuration',
    defaultValue: `apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80`,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

// Auto Resize
export const AutoResize: Story = {
  render: function AutoResizeExample() {
    const [value, setValue] = useState('Type here and watch the textarea grow...');

    return (
      <div style={{ width: '400px' }}>
        <Textarea
          label="Auto-resize Textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoResize
          minRows={2}
          maxRows={10}
          fullWidth
          helperText="높이가 내용에 따라 자동 조절됩니다 (최소 2줄, 최대 10줄)"
        />
      </div>
    );
  },
};

// Resize Options
export const ResizeOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '400px' }}>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">resize=&quot;none&quot;</p>
        <Textarea placeholder="Cannot resize" resize="none" fullWidth />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">
          resize=&quot;vertical&quot; (default)
        </p>
        <Textarea placeholder="Vertical resize only" resize="vertical" fullWidth />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-muted)] mb-1">resize=&quot;both&quot;</p>
        <Textarea placeholder="Resize in any direction" resize="both" fullWidth />
      </div>
    </div>
  ),
};

// Disabled
export const Disabled: Story = {
  args: {
    label: 'Disabled Textarea',
    defaultValue: 'This textarea is disabled.',
    disabled: true,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Read Only
export const ReadOnly: Story = {
  args: {
    label: 'Read Only',
    defaultValue: 'This content is read-only. You can select and copy the text but cannot edit it.',
    readOnly: true,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '400px' }}>
      <Textarea label="Default" placeholder="Default state" fullWidth />
      <Textarea label="With Value" defaultValue="Some content here" fullWidth />
      <Textarea label="Disabled" defaultValue="Disabled content" disabled fullWidth />
      <Textarea label="Read Only" defaultValue="Read only content" readOnly fullWidth />
      <Textarea label="Error" defaultValue="Invalid" error="This field has an error" fullWidth />
      <Textarea label="Code" variant="code" defaultValue="const x = 42;" fullWidth />
    </div>
  ),
};
