import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';

/**
 * # Loading
 *
 * 로딩 상태를 표시하는 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 데이터를 불러오는 중일 때
 * - 비동기 작업이 진행 중일 때
 * - 버튼 클릭 후 처리 중일 때
 *
 * ## Variants
 * - **spinner**: 기본 스피너 (아이콘 + 텍스트)
 * - **progress**: 진행률 표시 (프로그레스 바 포함)
 * - **button**: 버튼 형태의 로딩 상태
 *
 * ## 접근성
 * - 스크린 리더가 로딩 상태를 인식할 수 있도록 텍스트 제공
 * - 애니메이션이 있어 시각적으로 상태 변화 인지 가능
 */
const meta = {
  title: 'Components/Loading',
  component: Loading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '로딩 상태를 표시하는 컴포넌트입니다. spinner, progress, button 세 가지 variant를 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['spinner', 'progress', 'button'],
      description: '로딩 표시 유형',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '크기 (spinner variant에만 적용)',
    },
    text: {
      control: 'text',
      description: '로딩 텍스트',
    },
    description: {
      control: 'text',
      description: '설명 텍스트 (progress variant)',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '진행률 (progress variant)',
    },
    statusText: {
      control: 'text',
      description: '상태 텍스트 (progress variant)',
    },
    buttonLabel: {
      control: 'text',
      description: '버튼 라벨 (button variant)',
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Spinner Variant Stories
   ---------------------------------------- */

export const Default: Story = {
  args: {
    variant: 'spinner',
    size: 'md',
    text: 'Loading',
  },
};

export const SpinnerSmall: Story = {
  name: 'Spinner - Small',
  args: {
    variant: 'spinner',
    size: 'sm',
    text: 'Loading...',
  },
};

export const SpinnerMedium: Story = {
  name: 'Spinner - Medium',
  args: {
    variant: 'spinner',
    size: 'md',
    text: 'Loading data...',
  },
};

export const SpinnerLarge: Story = {
  name: 'Spinner - Large',
  args: {
    variant: 'spinner',
    size: 'lg',
    text: 'Please wait...',
  },
};

export const SpinnerWithoutText: Story = {
  name: 'Spinner - Without Text',
  args: {
    variant: 'spinner',
    size: 'md',
    text: '',
  },
};

/* ----------------------------------------
   Progress Variant Stories
   ---------------------------------------- */

export const Progress: Story = {
  args: {
    variant: 'progress',
    text: 'Uploading file',
    description: 'Please wait while we upload your file...',
    progress: 45,
    statusText: '45% complete',
  },
};

export const ProgressStart: Story = {
  name: 'Progress - Start',
  args: {
    variant: 'progress',
    text: 'Starting upload',
    progress: 0,
    statusText: 'Preparing...',
  },
};

export const ProgressHalfway: Story = {
  name: 'Progress - Halfway',
  args: {
    variant: 'progress',
    text: 'Processing data',
    description: 'Analyzing your data for insights',
    progress: 50,
    statusText: '50% - Halfway there!',
  },
};

export const ProgressAlmostDone: Story = {
  name: 'Progress - Almost Done',
  args: {
    variant: 'progress',
    text: 'Almost done',
    description: 'Finalizing your request',
    progress: 90,
    statusText: '90% - Just a moment...',
  },
};

export const ProgressComplete: Story = {
  name: 'Progress - Complete',
  args: {
    variant: 'progress',
    text: 'Complete!',
    progress: 100,
    statusText: 'Done!',
  },
};

/* ----------------------------------------
   Button Variant Stories
   ---------------------------------------- */

export const Button: Story = {
  args: {
    variant: 'button',
    buttonLabel: 'Loading',
  },
};

export const ButtonSaving: Story = {
  name: 'Button - Saving',
  args: {
    variant: 'button',
    buttonLabel: 'Saving...',
  },
};

export const ButtonSubmitting: Story = {
  name: 'Button - Submitting',
  args: {
    variant: 'button',
    buttonLabel: 'Submitting',
  },
};

/* ----------------------------------------
   All Sizes Comparison
   ---------------------------------------- */

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <Loading variant="spinner" size="sm" text="Small" />
        <span className="text-xs text-gray-500">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading variant="spinner" size="md" text="Medium" />
        <span className="text-xs text-gray-500">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading variant="spinner" size="lg" text="Large" />
        <span className="text-xs text-gray-500">lg</span>
      </div>
    </div>
  ),
};

/* ----------------------------------------
   All Variants Comparison
   ---------------------------------------- */

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex flex-col gap-12 items-center">
      <div className="flex flex-col items-center gap-2">
        <Loading variant="spinner" size="md" text="Loading data..." />
        <span className="text-xs text-gray-500 mt-2">spinner</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading
          variant="progress"
          text="Uploading file"
          description="document.pdf"
          progress={65}
          statusText="65% complete"
        />
        <span className="text-xs text-gray-500 mt-2">progress</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loading variant="button" buttonLabel="Saving..." />
        <span className="text-xs text-gray-500 mt-2">button</span>
      </div>
    </div>
  ),
};
