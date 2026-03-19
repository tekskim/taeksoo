import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';
import { Typography } from '../Typography';
import Layout from '../Layout';

const meta: Meta<typeof RadioGroup> = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '라디오 버튼 그룹 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: '라디오 그룹 이름',
    },
    options: {
      description: '라디오 옵션 배열',
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '배치 방향',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
];

export const Default: Story = {
  args: {
    name: 'basic-radio',
    options: basicOptions,
    selectedValue: 'option1',
    onChange: () => {},
  },
};

const ControlledExample = () => {
  const [selected, setSelected] = useState('medium');

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  return (
    <Layout.VStack gap="md">
      <Typography.Text variant="caption">선택된 값: {selected}</Typography.Text>
      <RadioGroup
        name="size-selection"
        options={sizeOptions}
        selectedValue={selected}
        onChange={setSelected}
        direction="vertical"
      />
    </Layout.VStack>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const Directions: Story = {
  render: () => (
    <Layout.VStack gap="lg">
      <Layout.VStack gap="md">
        <Typography.Text>Horizontal</Typography.Text>
        <RadioGroup
          name="horizontal-example"
          options={basicOptions}
          selectedValue="option1"
          onChange={() => {}}
          direction="horizontal"
        />
      </Layout.VStack>

      <Layout.VStack gap="md">
        <Typography.Text>Vertical</Typography.Text>
        <RadioGroup
          name="vertical-example"
          options={basicOptions}
          selectedValue="option2"
          onChange={() => {}}
          direction="vertical"
        />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

const optionsWithTooltip = [
  {
    value: 'option1',
    label: '옵션 1',
    tooltip: '첫 번째 옵션에 대한 상세 설명입니다.',
  },
  {
    value: 'option2',
    label: '옵션 2',
    tooltip: '두 번째 옵션에 대한 추가 정보를 제공합니다.',
  },
  {
    value: 'option3',
    label: '옵션 3',
    tooltip: '세 번째 옵션은 특별한 기능을 포함합니다.',
  },
];
