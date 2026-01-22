import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { IconPlus, IconDownload, IconTrash, IconEdit, IconCheck } from '@tabler/icons-react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Button 컴포넌트

사용자 액션을 트리거하는 기본 버튼 컴포넌트입니다.

### 사용 시기
- **Primary**: 페이지의 주요 액션 (저장, 제출, 확인)
- **Secondary**: 보조 액션 (취소, 뒤로가기)
- **Outline**: 덜 강조되는 액션
- **Ghost**: 텍스트처럼 보이지만 클릭 가능한 영역이 필요할 때
- **Danger**: 삭제, 제거 등 위험한 액션

### 사이즈 가이드라인

| 사이즈 | 높이 | 권장 사용처 |
|--------|------|------------|
| **SM** | 28px | 테이블 툴바, 밀집된 UI, 반복 가능한 보조 액션 |
| **MD** | 32px | 일반 폼, 모달/드로어 액션, 독립적인 CTA |
| **LG** | 36px | 페이지 주요 CTA, 랜딩 페이지, 히어로 섹션 |

#### 판단 기준
1. **밀집된 UI인가?** → SM
2. **독립적인 CTA인가?** → MD/LG
3. **반복 가능한 액션인가?** → SM
4. **폼의 최종 제출인가?** → MD/LG

#### 수직 정렬 원칙
같은 행에 있는 요소는 같은 사이즈를 사용하세요:
- \`Input md (32px)\` + \`Button md (32px)\` ✓
- \`SearchInput sm (28px)\` + \`Button sm (28px)\` ✓
- \`Input md (32px)\` + \`Button sm (28px)\` ✗ 높이 불일치

### 접근성
- 아이콘만 있는 버튼은 반드시 \`aria-label\` 제공
- 로딩 중일 때 스크린리더에 상태 전달
- 키보드(Enter, Space)로 활성화 가능

### 예시
\`\`\`tsx
import { Button } from '@thaki/tds';

// 기본 사용
<Button variant="primary">저장</Button>

// 아이콘 포함
<Button leftIcon={<IconPlus />}>추가</Button>

// 아이콘만
<Button icon={<IconTrash />} aria-label="삭제" variant="danger" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'muted', 'danger', 'warning', 'link'],
      description: '버튼 스타일 변형',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기 (sm: 28px, md: 32px, lg: 36px)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태 (스피너 표시)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: '부모 컨테이너 너비에 맞춤',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    leftIcon: {
      description: '버튼 텍스트 왼쪽에 표시할 아이콘',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    rightIcon: {
      description: '버튼 텍스트 오른쪽에 표시할 아이콘',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    icon: {
      description: '아이콘만 표시 (텍스트 없음, aria-label 필수)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    as: {
      description: '렌더링할 HTML 요소 ("button" 또는 "a")',
      table: {
        type: { summary: '"button" | "a"' },
        defaultValue: { summary: '"button"' },
      },
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: 'Muted Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// With Icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <IconPlus size={16} />,
    children: 'Add Item',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <IconDownload size={16} />,
    children: 'Download',
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <IconCheck size={16} />,
    rightIcon: <IconDownload size={16} />,
    children: 'Confirm & Download',
  },
};

// Icon Only
export const IconOnly: Story = {
  args: {
    icon: <IconPlus size={16} />,
    'aria-label': 'Add item',
    variant: 'secondary',
  },
};

export const IconOnlyVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button icon={<IconPlus size={16} />} aria-label="Add" variant="primary" />
      <Button icon={<IconEdit size={16} />} aria-label="Edit" variant="secondary" />
      <Button icon={<IconTrash size={16} />} aria-label="Delete" variant="danger" />
      <Button icon={<IconDownload size={16} />} aria-label="Download" variant="ghost" />
    </div>
  ),
};

// States
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const DisabledVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary" disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="danger" disabled>Danger</Button>
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

// As Link
export const AsLink: Story = {
  args: {
    as: 'a',
    href: 'https://example.com',
    target: '_blank',
    children: 'Visit Website',
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!'),
  },
};
