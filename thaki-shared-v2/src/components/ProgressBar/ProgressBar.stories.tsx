import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ProgressBar from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
진행률을 시각적으로 표시하는 컴포넌트입니다. 현재 값과 추가 예정 값(pending)을 함께 표시할 수 있습니다.

## 주요 기능
- **Pending 값**: 현재 값에 더해 예정된 값을 미리 표시
- **색상 변형**: primary, success, warning, danger
- **값 표시 모드**: 백분율(%) 또는 절댓값(8/16) 표시 가능
- **시맨틱 HTML**: figure, header, output 태그 사용으로 접근성 향상
- **성능 최적화**: useMemo를 사용한 계산 로직 최적화

## 사용 예시
- 파일 업로드/다운로드 진행률
- 리소스 사용량 및 예정 할당량 표시 (메모리, 디스크 등)
- 작업 완료도 표시

## 접근성
- **ARIA 속성**: role="progressbar", aria-valuenow 등 완전 지원
- **스크린 리더**: 시맨틱 태그로 구조적 정보 제공
- **키보드 접근**: 포커스 가능하며 진행률 정보 음성 안내
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '현재 진행률 값 (0-100)',
    },
    pendingValue: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description:
        '추가 예정 값 (0-100 또는 절대값). 현재 값에 더해져서 표시됩니다.',
    },
    max: {
      control: { type: 'number', min: 1, max: 1000, step: 1 },
      description:
        '최대값 (기본값: 100). 100이면 백분율 모드, 100 초과면 절대값 모드',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'danger'],
      description: '색상 변형. color prop이 있으면 무시됩니다.',
    },
    showValue: {
      control: { type: 'select' },
      options: ['percentage', 'absolute', false],
      description:
        '값 표시 형식 (percentage: 백분율, absolute: 절댓값, false: 숨김)',
    },
    color: {
      control: { type: 'color' },
      description: '현재 값 바의 커스텀 색상. variant보다 우선 적용됩니다.',
    },
    pendingColor: {
      control: { type: 'color' },
      description:
        '추가 예정 값 바의 커스텀 색상. 없으면 color와 동일하게 적용됩니다.',
    },
    label: {
      control: { type: 'text' },
      description: '진행률 표시를 위한 라벨',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 55,
    label: 'Percentage',
    showValue: 'percentage',
    variant: 'success',
  },
  decorators: [
    Story => (
      <div style={{ width: '400px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '400px',
        maxWidth: '100%',
      }}
    >
      <ProgressBar
        value={25}
        label="Primary"
        variant="primary"
        showValue="percentage"
      />
      <ProgressBar
        value={50}
        label="Success"
        variant="success"
        showValue="percentage"
      />
      <ProgressBar
        value={75}
        label="Warning"
        variant="warning"
        showValue="percentage"
      />
      <ProgressBar
        value={90}
        label="Danger"
        variant="danger"
        showValue="percentage"
      />
    </div>
  ),
};

// 절댓값 표시 데모
const AbsoluteValueDemo = () => {
  const [currentMemory] = useState(8); // 8GB 고정
  const [pendingMemory, setPendingMemory] = useState(4); // 4GB 추가 예정
  const totalMemory = 16; // 총 16GB

  return (
    <div style={{ width: '400px', maxWidth: '100%' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '14px', margin: '0 0 0.5rem 0' }}>백분율</h4>
        <ProgressBar
          value={currentMemory}
          pendingValue={pendingMemory}
          max={totalMemory}
          label="Memory Usage"
          showValue="percentage"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '14px', margin: '0 0 0.5rem 0' }}>절댓값</h4>
        <ProgressBar
          value={currentMemory}
          pendingValue={pendingMemory}
          max={totalMemory}
          label="Memory Usage"
          showValue="absolute"
        />
      </div>

      <div>
        <label
          style={{ fontSize: '14px', marginBottom: '0.5rem', display: 'block' }}
        >
          Pending Memory: {pendingMemory}GB
        </label>
        <input
          type="range"
          min="0"
          max="8"
          value={pendingMemory}
          onChange={e => setPendingMemory(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export const ValueDisplayModes: Story = {
  render: () => <AbsoluteValueDemo />,
};

// Infinity (무제한) 데모
export const UnlimitedQuota: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '400px',
        maxWidth: '100%',
      }}
    >
      <ProgressBar
        value={5}
        pendingValue={2}
        max={Infinity}
        label="Unlimited Quota"
        showValue="percentage"
        variant="primary"
      />
      <ProgressBar
        value={10}
        pendingValue={3}
        max={Infinity}
        label="Unlimited Storage"
        showValue="absolute"
        variant="success"
      />
    </div>
  ),
};
