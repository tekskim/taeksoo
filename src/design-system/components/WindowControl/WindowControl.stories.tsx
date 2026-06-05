import type { Meta, StoryObj } from '@storybook/react-vite';
import { WindowControl, WindowControls } from './WindowControl';

const meta: Meta<typeof WindowControl> = {
  title: 'Components/WindowControl',
  component: WindowControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## WindowControl 컴포넌트

윈도우 컨트롤 버튼 (최소화, 최대화, 닫기)을 제공하는 컴포넌트입니다.

### 구성 요소
- **WindowControl**: 개별 컨트롤 버튼
- **WindowControls**: 컨트롤 버튼 그룹

### 타입
- **minimize**: 최소화 버튼 (-)
- **maximize**: 최대화 버튼 (□)
- **close**: 닫기 버튼 (×)

### 사용 시기
- 데스크톱 앱 스타일 UI
- 모달/다이얼로그 헤더
- TabBar와 함께 사용

### 예시
\`\`\`tsx
<WindowControls
  onMinimize={() => {}}
  onMaximize={() => {}}
  onClose={() => {}}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['minimize', 'maximize', 'close'],
      description: '컨트롤 타입',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WindowControl>;

// Minimize
export const Minimize: Story = {
  args: {
    type: 'minimize',
    onClick: () => console.log('Minimize'),
  },
};

// Maximize
export const Maximize: Story = {
  args: {
    type: 'maximize',
    onClick: () => console.log('Maximize'),
  },
};

// Close
export const Close: Story = {
  args: {
    type: 'close',
    onClick: () => console.log('Close'),
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    type: 'minimize',
    disabled: true,
  },
};

// All Controls
export const AllControls: Story = {
  render: () => (
    <div className="flex gap-[var(--primitive-spacing-2)]">
      <WindowControl type="minimize" onClick={() => console.log('Minimize')} />
      <WindowControl type="maximize" onClick={() => console.log('Maximize')} />
      <WindowControl type="close" onClick={() => console.log('Close')} />
    </div>
  ),
};

// WindowControls Group
export const ControlsGroup: Story = {
  render: () => (
    <WindowControls
      onMinimize={() => console.log('Minimize')}
      onMaximize={() => console.log('Maximize')}
      onClose={() => console.log('Close')}
    />
  ),
};

// Partial Controls
export const PartialControls: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <div>
        <p className="text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Close only
        </p>
        <WindowControls
          showMinimize={false}
          showMaximize={false}
          onClose={() => console.log('Close')}
        />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Minimize & Close
        </p>
        <WindowControls
          showMaximize={false}
          onMinimize={() => console.log('Minimize')}
          onClose={() => console.log('Close')}
        />
      </div>
    </div>
  ),
};

// In Header Context
export const InHeaderContext: Story = {
  render: () => (
    <div className="flex items-center justify-between bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
      <span className="text-label-md text-[var(--color-text-default)]">Application Window</span>
      <WindowControls
        onMinimize={() => console.log('Minimize')}
        onMaximize={() => console.log('Maximize')}
        onClose={() => console.log('Close')}
      />
    </div>
  ),
};
