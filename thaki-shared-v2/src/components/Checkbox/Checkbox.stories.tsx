import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { Typography } from '../Typography';
import Layout from '../Layout';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '체크박스 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: '체크박스 라벨 텍스트',
    },
    checked: {
      control: 'boolean',
      description: '체크 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Layout.VStack gap="sm">
        <Checkbox
          label="체크되지 않은 상태로 시작"
          onChange={(checked) => console.log('첫 번째 체크박스:', checked)}
        />
        <Checkbox
          label="체크된 상태로 시작"
          defaultChecked={true}
          onChange={(checked) => console.log('두 번째 체크박스:', checked)}
        />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const States: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Unchecked</Typography.Text>
        <Checkbox label="선택되지 않음" checked={false} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Checked</Typography.Text>
        <Checkbox label="선택됨" checked={true} />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Disabled</Typography.Text>
        <Checkbox label="비활성화됨" disabled />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Disabled Checked</Typography.Text>
        <Checkbox label="비활성화됨 (선택)" checked disabled />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

// 체크박스 그룹 예시
const CheckboxGroupExample = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const items = [
    { id: 'apple', label: '사과' },
    { id: 'banana', label: '바나나' },
    { id: 'orange', label: '오렌지' },
  ];

  const handleItemChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const isAllSelected = selectedItems.length === items.length;

  return (
    <Layout.VStack gap="md">
      <Layout.VStack gap="sm">
        <Typography.Text>선택된 항목: {selectedItems.length}개</Typography.Text>
        <Checkbox label="전체 선택" checked={isAllSelected} onChange={handleSelectAll} />
      </Layout.VStack>

      <Layout.VStack gap="sm" style={{ paddingLeft: 'var(--semantic-space-md)' }}>
        {items.map((item) => (
          <Checkbox
            key={item.id}
            label={item.label}
            checked={selectedItems.includes(item.id)}
            onChange={(checked) => handleItemChange(item.id, checked)}
          />
        ))}
      </Layout.VStack>
    </Layout.VStack>
  );
};

export const CheckboxGroup: Story = {
  render: () => <CheckboxGroupExample />,
};

// 제어된 체크박스
const ControlledExample = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Layout.VStack gap="sm">
      <Typography.Text variant="caption">
        현재 상태: {checked ? '선택됨' : '선택안됨'}
      </Typography.Text>
      <Checkbox label="제어된 체크박스" checked={checked} onChange={setChecked} />
    </Layout.VStack>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
