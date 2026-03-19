import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Form/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Button

Button은 사용자 액션을 트리거하는 핵심 인터랙티브 컴포넌트입니다. 의미론적 색상과 다양한 상태를 제공하여 일관된 사용자 경험을 보장합니다.

## 스타일 옵션

### 크기 (Size)
- **sm**: 작은 크기 (인라인 요소, 테이블 액션)
- **md**: 기본 크기 (일반적인 사용)
- **lg**: 큰 크기 (주요 CTA, 모바일 친화적)

### 변형 (Variant)
- **primary**: 주요 액션 (저장, 제출, 확인)
- **secondary**: 보조 액션 (취소, 뒤로가기)
- **success**: 성공 관련 액션 (승인, 완료)
- **error**: 위험한 액션 (삭제, 거부)
- **warning**: 주의가 필요한 액션 (경고, 확인 필요)
- **muted**: 비활성화된 상태나 보조적 액션

### 외관 (Appearance)
- **solid**: 배경이 채워진 기본 스타일 (가장 강조)
- **outline**: 테두리만 있는 스타일 (중간 강조)
- **ghost**: 배경이 투명한 스타일 (가장 약한 강조)

## 주요 기능
- 의미론적 디자인: variant별로 명확한 의미와 사용 목적
- 다양한 상태 지원: 기본, 로딩, 비활성화 상태
- 웹 접근성: 키보드 네비게이션 및 스크린 리더 지원
- 디자인 토큰 기반: 테마 변경 시 자동 적용

## 사용 가이드라인

### 언제 사용하나요?
- 사용자 액션을 트리거할 때 (저장, 삭제, 제출 등)
- 폼 제출이나 데이터 처리 작업을 시작할 때
- 모달이나 다이얼로그의 액션 버튼으로 사용할 때

### 언제 사용하지 말아야 하나요?
- 단순한 링크 (a 태그 사용 권장)
- 정보 표시만 하는 경우 (Typography 컴포넌트 사용)
- 같은 페이지에 여러 개의 primary 버튼 사용

### 사용 팁
- 버튼 텍스트는 액션을 명확히 표현하세요 ("저장", "삭제", "취소")
- 로딩 상태일 때는 사용자에게 진행 상황을 알려주세요
- 비활성화 상태일 때는 이유를 명확히 표시하세요
- 모바일에서는 최소 44px 터치 영역을 확보하세요

## 접근성
- 키보드 네비게이션 지원 (Tab, Enter, Space)
- 스크린 리더 지원
- 포커스 표시기 제공
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'error',
        'warning',
        'muted',
      ],
      description: '버튼의 의미론적 색상 변형',
    },
    appearance: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: '버튼의 시각적 스타일',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼의 크기',
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태 표시',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    children: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled',
  },
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--semantic-space-md)',
        alignItems: 'center',
      }}
    >
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Variants: Story = {
  render: () => {
    const variants = [
      'primary',
      'secondary',
      'tertiary',
      'success',
      'error',
      'warning',
      'muted',
    ] as const;

    return (
      <div
        style={{
          display: 'flex',
          gap: 'var(--semantic-space-sm)',
          flexWrap: 'wrap',
        }}
      >
        {variants.map(variant => (
          <Button key={variant} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>
    );
  },
};

export const Appearances: Story = {
  render: () => {
    const appearances = ['solid', 'outline', 'ghost'] as const;

    return (
      <div
        style={{
          display: 'flex',
          gap: 'var(--semantic-space-sm)',
          flexWrap: 'wrap',
        }}
      >
        {appearances.map(appearance => (
          <Button key={appearance} variant="primary" appearance={appearance}>
            {appearance.charAt(0).toUpperCase() + appearance.slice(1)}
          </Button>
        ))}
      </div>
    );
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
};

// 테스트 스토리
export const ClickTest: Story = {
  args: {
    variant: 'primary',
    children: 'Click Test',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(button).toBeInTheDocument();
  },
};
