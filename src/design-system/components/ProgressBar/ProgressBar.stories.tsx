import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

/**
 * # ProgressBar
 *
 * 진행률이나 사용량을 시각적으로 표시하는 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 파일 업로드/다운로드 진행률 표시
 * - 리소스 사용량 (CPU, 메모리, 스토리지 등) 표시
 * - 쿼터(할당량) 대비 사용량 표시
 * - 작업 진행 상태 표시
 *
 * ## Variants
 * - **default**: 기본 프로그레스 바 (단일 색상)
 * - **quota**: 쿼터/할당량 표시용 (사용량 + 신규 값 구분)
 *
 * ## 상태 색상
 * - **success** (녹색): 정상 범위 (0-70%)
 * - **warning** (주황): 경고 범위 (70-100%)
 * - **danger** (빨강): 위험/초과 (100%+)
 * - **info** (파랑): 정보 표시용
 * - **neutral** (회색): 무제한 또는 중립
 *
 * ## 접근성
 * - 색상 외에도 수치로 정보 전달
 * - 에러 상태 시 아이콘과 툴팁으로 추가 정보 제공
 */
const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '진행률이나 리소스 사용량을 시각적으로 표시하는 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'quota'],
      description: '프로그레스 바 유형',
    },
    value: {
      control: { type: 'number', min: 0 },
      description: '현재 값 (사용량)',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: '최대 값 (총량), undefined = 무제한',
    },
    newValue: {
      control: { type: 'number', min: 0 },
      description: '추가될 새 값 (quota variant)',
    },
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    showValue: {
      control: 'boolean',
      description: '값 표시 여부',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지 (툴팁)',
    },
    statusText: {
      control: 'text',
      description: '상태 텍스트',
    },
    status: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'neutral'],
      description: '상태 색상 (default variant)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '크기',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Default Variant Stories
   ---------------------------------------- */

export const Default: Story = {
  args: {
    variant: 'default',
    value: 45,
    max: 100,
    label: 'Progress',
    showValue: true,
  },
};

export const DefaultWithStatus: Story = {
  name: 'Default - With Status Text',
  args: {
    variant: 'default',
    value: 65,
    max: 100,
    label: 'Uploading',
    statusText: '65%',
    status: 'info',
  },
};

export const DefaultSuccess: Story = {
  name: 'Default - Success',
  args: {
    variant: 'default',
    value: 30,
    max: 100,
    label: 'CPU Usage',
    statusText: '30%',
    status: 'success',
  },
};

export const DefaultWarning: Story = {
  name: 'Default - Warning',
  args: {
    variant: 'default',
    value: 75,
    max: 100,
    label: 'Memory Usage',
    statusText: '75%',
    status: 'warning',
  },
};

export const DefaultDanger: Story = {
  name: 'Default - Danger',
  args: {
    variant: 'default',
    value: 95,
    max: 100,
    label: 'Storage',
    statusText: '95%',
    status: 'danger',
  },
};

export const DefaultError: Story = {
  name: 'Default - Error State',
  args: {
    variant: 'default',
    value: 100,
    max: 100,
    label: 'Disk Space',
    error: true,
    errorMessage: 'Storage quota exceeded',
    statusText: 'Full',
  },
};

/* ----------------------------------------
   Quota Variant Stories
   ---------------------------------------- */

export const Quota: Story = {
  args: {
    variant: 'quota',
    value: 5,
    max: 10,
    label: 'Instances',
    showValue: true,
  },
};

export const QuotaWithNewValue: Story = {
  name: 'Quota - With New Value',
  args: {
    variant: 'quota',
    value: 3,
    newValue: 2,
    max: 10,
    label: 'Instances',
    showValue: true,
  },
};

export const QuotaWarning: Story = {
  name: 'Quota - Warning Level',
  args: {
    variant: 'quota',
    value: 6,
    newValue: 2,
    max: 10,
    label: 'vCPU',
    showValue: true,
  },
};

export const QuotaExceeding: Story = {
  name: 'Quota - Exceeding',
  args: {
    variant: 'quota',
    value: 8,
    newValue: 5,
    max: 10,
    label: 'Memory (GB)',
    showValue: true,
  },
};

export const QuotaUnlimited: Story = {
  name: 'Quota - Unlimited',
  args: {
    variant: 'quota',
    value: 15,
    max: undefined,
    label: 'API Calls',
    showValue: true,
  },
};

/* ----------------------------------------
   Status Colors Comparison
   ---------------------------------------- */

export const AllStatuses: Story = {
  name: 'All Status Colors',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
      <ProgressBar
        variant="default"
        value={50}
        max={100}
        label="Info"
        status="info"
        statusText="50%"
      />
      <ProgressBar
        variant="default"
        value={50}
        max={100}
        label="Success"
        status="success"
        statusText="50%"
      />
      <ProgressBar
        variant="default"
        value={50}
        max={100}
        label="Warning"
        status="warning"
        statusText="50%"
      />
      <ProgressBar
        variant="default"
        value={50}
        max={100}
        label="Danger"
        status="danger"
        statusText="50%"
      />
      <ProgressBar
        variant="default"
        value={50}
        max={100}
        label="Neutral"
        status="neutral"
        statusText="50%"
      />
    </div>
  ),
};

/* ----------------------------------------
   Quota Levels Comparison
   ---------------------------------------- */

export const QuotaLevels: Story = {
  name: 'Quota - All Levels',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
      <ProgressBar variant="quota" value={3} newValue={1} max={10} label="Normal (40%)" showValue />
      <ProgressBar
        variant="quota"
        value={5}
        newValue={2}
        max={10}
        label="Warning (70%)"
        showValue
      />
      <ProgressBar
        variant="quota"
        value={7}
        newValue={3}
        max={10}
        label="Warning (100%)"
        showValue
      />
      <ProgressBar
        variant="quota"
        value={8}
        newValue={5}
        max={10}
        label="Danger (130%)"
        showValue
      />
    </div>
  ),
};
