import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { within, userEvent } from '@storybook/test';
import { RadioButton } from './RadioButton';
import { Typography } from '../Typography';

const meta: Meta<typeof RadioButton> = {
  title: 'Form/Radio',
  component: RadioButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'RadioButton 컴포넌트는 단일 선택을 위한 라디오 버튼입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: '라디오 버튼의 값',
      control: 'text',
    },
    name: {
      description: '라디오 버튼의 이름',
      control: 'text',
    },
    checked: {
      description: '선택 상태',
      control: 'boolean',
    },
    disabled: {
      description: '비활성화 상태',
      control: 'boolean',
    },
    size: {
      description: '라디오 버튼 크기',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: {
      description: '라디오 버튼 라벨',
      control: 'text',
    },
    onChange: {
      description: '값 변경 시 호출되는 콜백 함수',
      action: 'changed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

const RadioButtonTemplate = (args: any) => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <RadioButton
        {...args}
        value="option1"
        checked={selectedValue === 'option1'}
        onChange={setSelectedValue}
        label="옵션 1"
      />
      <RadioButton
        {...args}
        value="option2"
        checked={selectedValue === 'option2'}
        onChange={setSelectedValue}
        label="옵션 2"
      />
      <RadioButton
        {...args}
        value="option3"
        checked={selectedValue === 'option3'}
        onChange={setSelectedValue}
        label="옵션 3"
      />
    </div>
  );
};

export const Default: Story = {
  render: RadioButtonTemplate,
  args: {
    size: 'md',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('옵션 1 클릭', async () => {
      const option1 = canvas.getByLabelText('옵션 1');
      await userEvent.click(option1);
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    await step('옵션 2 클릭', async () => {
      const option2 = canvas.getByLabelText('옵션 2');
      await userEvent.click(option2);
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    await step('옵션 3 클릭', async () => {
      const option3 = canvas.getByLabelText('옵션 3');
      await userEvent.click(option3);
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <Typography.Title level={4} style={{ margin: '0 0 8px 0' }}>
          Small
        </Typography.Title>
        <RadioButton value="small" label="Small Radio Button" size="sm" />
      </div>
      <div>
        <Typography.Title level={4} style={{ margin: '0 0 8px 0' }}>
          Medium
        </Typography.Title>
        <RadioButton value="medium" label="Medium Radio Button" size="md" />
      </div>
      <div>
        <Typography.Title level={4} style={{ margin: '0 0 8px 0' }}>
          Large
        </Typography.Title>
        <RadioButton value="large" label="Large Radio Button" size="lg" />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <RadioButton value="disabled1" label="Disabled Radio Button" disabled />
      <RadioButton
        value="disabled2"
        label="Disabled Checked Radio Button"
        disabled
        checked
      />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: {
    value: 'no-label',
    checked: true,
  },
};
