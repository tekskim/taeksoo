import type { Meta, StoryObj } from '@storybook/react';
import { Fieldset } from './Fieldset';
import { Input } from '../Input';
import { Checkbox } from '../Checkbox';
import { RadioGroup } from '../RadioGroup';
import { Typography } from '../Typography';
import Layout from '../Layout';

const meta: Meta<typeof Fieldset> = {
  title: 'Form/Fieldset',
  component: Fieldset,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '관련된 폼 요소들을 그룹화하는 Fieldset 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    legend: {
      control: 'text',
      description: '필드셋의 제목',
    },
    description: {
      control: 'text',
      description: '필드셋에 대한 설명',
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered'],
      description: '시각적 변형',
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '내부 요소의 배치 방향',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    legend: '기본 정보',
    description: '사용자의 기본 정보를 입력해주세요',
  },
  render: (args) => (
    <Fieldset legend={args.legend} description={args.description}>
      <Layout.VStack gap="md">
        <Input placeholder="이름" />
        <Input placeholder="이메일" type="email" />
        <Input placeholder="전화번호" type="tel" />
      </Layout.VStack>
    </Fieldset>
  ),
};

export const WithCheckboxes: Story = {
  args: {
    legend: '관심 분야',
    description: '관심 있는 분야를 선택해주세요 (복수 선택 가능)',
    variant: 'bordered',
  },
  render: (args) => (
    <Fieldset legend={args.legend} description={args.description} variant={args.variant}>
      <Layout.VStack gap="sm">
        <Checkbox label="웹 개발" />
        <Checkbox label="모바일 개발" />
        <Checkbox label="데이터 사이언스" />
        <Checkbox label="AI/ML" />
      </Layout.VStack>
    </Fieldset>
  ),
};

export const WithRadioGroup: Story = {
  args: {
    legend: '경력 수준',
    description: '현재 경력 수준을 선택해주세요',
    direction: 'horizontal',
  },
  render: (args) => (
    <Fieldset legend={args.legend} description={args.description} direction={args.direction}>
      <RadioGroup
        name="experience"
        selectedValue=""
        onChange={() => {}}
        options={[
          { value: 'junior', label: '주니어 (1-3년)' },
          { value: 'mid', label: '미드레벨 (3-7년)' },
          { value: 'senior', label: '시니어 (7년+)' },
        ]}
      />
    </Fieldset>
  ),
};

export const Variants: Story = {
  render: () => (
    <Layout.VStack gap="lg">
      <Layout.VStack gap="md">
        <Typography.Text>Default Variant</Typography.Text>
        <Fieldset legend="기본 스타일" description="기본 필드셋 스타일입니다">
          <Layout.VStack gap="sm">
            <Input placeholder="입력 필드 1" />
            <Input placeholder="입력 필드 2" />
          </Layout.VStack>
        </Fieldset>
      </Layout.VStack>

      <Layout.VStack gap="md">
        <Typography.Text>Bordered Variant</Typography.Text>
        <Fieldset
          legend="테두리 스타일"
          description="테두리가 있는 필드셋 스타일입니다"
          variant="bordered"
        >
          <Layout.VStack gap="sm">
            <Input placeholder="입력 필드 1" />
            <Input placeholder="입력 필드 2" />
          </Layout.VStack>
        </Fieldset>
      </Layout.VStack>

      <Layout.VStack gap="md">
        <Typography.Text>Active Bordered Variant</Typography.Text>
        <Fieldset
          legend="활성 섹션"
          description="현재 편집 중인 섹션을 나타냅니다"
          variant="bordered"
          active
        >
          <Layout.VStack gap="sm">
            <Input placeholder="입력 필드 1" />
            <Input placeholder="입력 필드 2" />
          </Layout.VStack>
        </Fieldset>
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const Directions: Story = {
  render: () => (
    <Layout.VStack gap="lg">
      <Layout.VStack gap="md">
        <Typography.Text>Vertical Direction</Typography.Text>
        <Fieldset legend="세로 배치" description="요소들이 세로로 배치됩니다" direction="vertical">
          <Checkbox label="옵션 1" />
          <Checkbox label="옵션 2" />
          <Checkbox label="옵션 3" />
        </Fieldset>
      </Layout.VStack>

      <Layout.VStack gap="md">
        <Typography.Text>Horizontal Direction</Typography.Text>
        <Fieldset
          legend="가로 배치"
          description="요소들이 가로로 배치됩니다"
          direction="horizontal"
        >
          <Checkbox label="옵션 1" />
          <Checkbox label="옵션 2" />
          <Checkbox label="옵션 3" />
        </Fieldset>
      </Layout.VStack>
    </Layout.VStack>
  ),
};
