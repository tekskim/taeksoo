import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { Input } from '../Input';
import { Checkbox } from '../Checkbox';
import { Typography } from '../Typography';
import Layout from '../Layout';

const meta: Meta<typeof FormField> = {
  title: 'Form/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '라벨, 힌트, 에러 메시지를 자동으로 연결하는 폼 필드 래퍼 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: '폼 필드의 라벨',
    },
    required: {
      control: 'boolean',
      description: '필수 필드 여부',
    },
    hint: {
      control: 'text',
      description: '도움말 텍스트',
    },
    error: {
      control: 'text',
      description: '에러 메시지',
    },
    success: {
      control: 'text',
      description: '성공 메시지',
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
  args: {
    label: '이름',
    hint: '실명을 입력해주세요',
  },
  render: (args) => (
    <FormField label={args.label} hint={args.hint}>
      <Input placeholder="홍길동" />
    </FormField>
  ),
};

export const Required: Story = {
  args: {
    label: '이메일',
    required: true,
    hint: '유효한 이메일 주소를 입력해주세요',
  },
  render: (args) => (
    <FormField label={args.label} required={args.required} hint={args.hint}>
      <Input type="email" placeholder="example@email.com" />
    </FormField>
  ),
};

export const WithError: Story = {
  args: {
    label: '비밀번호',
    required: true,
    error: '비밀번호는 최소 8자 이상이어야 합니다',
  },
  render: (args) => (
    <FormField label={args.label} required={args.required} error={args.error}>
      <Input type="password" placeholder="비밀번호 입력" error />
    </FormField>
  ),
};

export const WithSuccess: Story = {
  args: {
    label: '사용자명',
    required: true,
    success: '사용 가능한 사용자명입니다',
  },
  render: (args) => (
    <FormField label={args.label} required={args.required} success={args.success}>
      <Input placeholder="username" success />
    </FormField>
  ),
};

export const Disabled: Story = {
  args: {
    label: '아이디',
    hint: '자동으로 생성된 아이디입니다',
    disabled: true,
  },
  render: (args) => (
    <FormField label={args.label} hint={args.hint} disabled={args.disabled}>
      <Input value="USER_12345" disabled />
    </FormField>
  ),
};

export const WithCheckbox: Story = {
  args: {
    label: '이용약관 동의',
    required: true,
    hint: '서비스 이용을 위해 필수로 동의해주세요',
  },
  render: (args) => (
    <FormField label={args.label} required={args.required} hint={args.hint}>
      <Checkbox label="개인정보 처리방침 및 이용약관에 동의합니다" />
    </FormField>
  ),
};

export const AllStates: Story = {
  render: () => (
    <Layout.VStack gap="lg">
      <Layout.VStack gap="md">
        <Typography.Text>다양한 FormField 상태</Typography.Text>

        <FormField label="기본 필드" hint="일반적인 입력 필드입니다">
          <Input placeholder="기본 입력" />
        </FormField>

        <FormField label="필수 필드" required hint="필수로 입력해야 하는 필드입니다">
          <Input placeholder="필수 입력" />
        </FormField>

        <FormField label="에러 상태" error="잘못된 값이 입력되었습니다">
          <Input placeholder="에러 입력" error />
        </FormField>

        <FormField label="성공 상태" success="올바르게 입력되었습니다">
          <Input placeholder="성공 입력" success />
        </FormField>

        <FormField label="비활성화 상태" hint="현재 수정할 수 없습니다" disabled>
          <Input value="비활성화된 값" disabled />
        </FormField>
      </Layout.VStack>
    </Layout.VStack>
  ),
};
