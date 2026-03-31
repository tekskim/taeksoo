import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Toggle from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Form/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '체크 상태 (controlled)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    defaultChecked: {
      control: 'boolean',
      description: '기본 체크 상태 (uncontrolled)',
    },
    checkedLabel: {
      control: 'text',
      description: '체크된 상태일 때 표시할 라벨',
    },
    uncheckedLabel: {
      control: 'text',
      description: '체크되지 않은 상태일 때 표시할 라벨',
    },
  },
};

export default meta;

/** 기본 토글 (Uncontrolled, 라벨 없음) */
const Default: StoryObj<typeof Toggle> = {
  args: {
    name: 'default-toggle',
  },
};

/** 라벨이 있는 토글 (Uncontrolled) - 상태에 따라 라벨 변경 */
const WithLabels: StoryObj<typeof Toggle> = {
  args: {
    name: 'label-toggle',
    checkedLabel: 'Enabled',
    uncheckedLabel: 'Disabled',
  },
};

/** 체크된 상태 (Uncontrolled) */
const Checked: StoryObj<typeof Toggle> = {
  args: {
    name: 'checked-toggle',
    checkedLabel: 'Bootable',
    uncheckedLabel: 'Non-Bootable',
    defaultChecked: true,
  },
};

/** 비활성화 상태 (Uncontrolled) */
const Disabled: StoryObj<typeof Toggle> = {
  args: {
    name: 'disabled-toggle',
    checkedLabel: 'On',
    uncheckedLabel: 'Off',
    disabled: true,
  },
};

/** 비활성화 + 체크 상태 (Uncontrolled) */
const DisabledChecked: StoryObj<typeof Toggle> = {
  args: {
    name: 'disabled-checked-toggle',
    checkedLabel: 'On',
    uncheckedLabel: 'Off',
    disabled: true,
    defaultChecked: true,
  },
};

/** Controlled 모드 예제 - 라벨이 자동으로 변경됨 */
const ControlledExample = () => {
  const [isOn, setIsOn] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Toggle
        checked={isOn}
        onChange={(e) => setIsOn(e.target.checked)}
        checkedLabel="Enabled"
        uncheckedLabel="Disabled"
        name="controlled-toggle"
      />
      <div style={{ fontSize: '14px', color: 'var(--semantic-color-textMuted)' }}>
        Current state: {isOn ? 'ON' : 'OFF'}
      </div>
    </div>
  );
};

const Controlled: StoryObj<typeof Toggle> = {
  render: () => <ControlledExample />,
};

export { Checked, Controlled, Default, Disabled, DisabledChecked, WithLabels };
