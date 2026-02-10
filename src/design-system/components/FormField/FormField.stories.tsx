import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Checkbox } from '../Checkbox/Checkbox';

/**
 * # FormField
 *
 * 폼 필드를 구성하는 컴포넌트입니다.
 * 라벨, 입력 컨트롤, 도움말, 에러 메시지를 일관된 구조로 조합합니다.
 *
 * ## 두 가지 사용 방식
 *
 * ### 1. Simple API (권장)
 * ```tsx
 * <FormField label="Name" helperText="2-64 characters" required>
 *   <Input placeholder="Enter name" />
 * </FormField>
 * ```
 *
 * ### 2. Compound API (복잡한 레이아웃용)
 * ```tsx
 * <FormField required>
 *   <FormField.Label>Name <Badge>NEW</Badge></FormField.Label>
 *   <FormField.Description>설명</FormField.Description>
 *   <FormField.Control>
 *     <Input placeholder="Enter name" />
 *   </FormField.Control>
 *   <FormField.HelperText>2-64 characters</FormField.HelperText>
 * </FormField>
 * ```
 *
 * ## 언제 사용하나요?
 * - 폼 입력 필드에 라벨과 도움말을 추가할 때
 * - 필수 필드 표시가 필요할 때
 * - 유효성 검사 에러 메시지를 표시할 때
 * - 일관된 폼 레이아웃을 구성할 때
 *
 * ## 구성 요소 (Compound API)
 * - **FormField**: 컨테이너 (Context Provider)
 * - **FormField.Label**: 라벨 (필수 표시 포함)
 * - **FormField.Description**: 라벨 아래 설명 (text-body-md)
 * - **FormField.Control**: 입력 컨트롤 래퍼
 * - **FormField.HelperText**: 도움말 텍스트 (text-body-sm)
 * - **FormField.ErrorMessage**: 에러 메시지
 *
 * ## 접근성
 * - `htmlFor`와 `id`로 라벨과 입력 연결
 * - 에러 메시지에 `role="alert"` 적용
 * - 도움말/에러는 `aria-describedby`로 연결 가능
 */
const meta = {
  title: 'Components/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '폼 필드를 구성하는 Compound Component입니다. 라벨, 컨트롤, 도움말, 에러 메시지를 조합합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: '필드 ID (라벨과 입력 연결)',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    required: {
      control: 'boolean',
      description: '필수 필드 여부',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Simple API Examples (Recommended)
   ---------------------------------------- */

export const SimpleAPI: Story = {
  name: 'Simple API (Recommended)',
  render: () => (
    <FormField label="Username" helperText="Your username must be unique.">
      <Input placeholder="Enter username" fullWidth />
    </FormField>
  ),
};

export const SimpleAPIRequired: Story = {
  name: 'Simple API - Required',
  render: () => (
    <FormField label="Email" helperText="We'll never share your email." required>
      <Input type="email" placeholder="Enter email" fullWidth />
    </FormField>
  ),
};

export const SimpleAPIWithDescription: Story = {
  name: 'Simple API - With Description',
  render: () => (
    <FormField
      label="Instance Name"
      description="A unique name to identify your instance"
      helperText="2-64 characters, letters, numbers, and hyphens"
      required
    >
      <Input placeholder="my-instance-01" fullWidth />
    </FormField>
  ),
};

export const SimpleAPIWithError: Story = {
  name: 'Simple API - With Error',
  render: () => (
    <FormField
      label="Password"
      errorMessage="Password must be at least 8 characters."
      required
      error
    >
      <Input type="password" placeholder="Enter password" fullWidth />
    </FormField>
  ),
};

export const SimpleAPIWithSelect: Story = {
  name: 'Simple API - With Select',
  render: () => (
    <FormField label="Country" helperText="Select your country of residence." required>
      <Select
        placeholder="Select a country"
        fullWidth
        options={[
          { value: 'kr', label: 'South Korea' },
          { value: 'us', label: 'United States' },
          { value: 'jp', label: 'Japan' },
        ]}
      />
    </FormField>
  ),
};

/* ----------------------------------------
   Compound API Examples
   ---------------------------------------- */

export const Default: Story = {
  name: 'Compound API - Default',
  render: () => (
    <FormField id="username">
      <FormField.Label>Username</FormField.Label>
      <FormField.Control>
        <Input id="username" placeholder="Enter username" fullWidth />
      </FormField.Control>
      <FormField.HelperText>Your username must be unique.</FormField.HelperText>
    </FormField>
  ),
};

export const Required: Story = {
  render: () => (
    <FormField id="email" required>
      <FormField.Label>Email</FormField.Label>
      <FormField.Control>
        <Input id="email" type="email" placeholder="Enter email" fullWidth />
      </FormField.Control>
      <FormField.HelperText>We'll never share your email.</FormField.HelperText>
    </FormField>
  ),
};

export const WithError: Story = {
  name: 'With Error',
  render: () => (
    <FormField id="password" error required>
      <FormField.Label>Password</FormField.Label>
      <FormField.Control>
        <Input id="password" type="password" placeholder="Enter password" fullWidth error />
      </FormField.Control>
      <FormField.HelperText>This won't be shown when there's an error.</FormField.HelperText>
      <FormField.ErrorMessage>Password must be at least 8 characters.</FormField.ErrorMessage>
    </FormField>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FormField id="readonly" disabled>
      <FormField.Label>Read Only Field</FormField.Label>
      <FormField.Control>
        <Input id="readonly" value="Cannot edit this" disabled fullWidth />
      </FormField.Control>
      <FormField.HelperText>This field is disabled.</FormField.HelperText>
    </FormField>
  ),
};

/* ----------------------------------------
   With Different Controls
   ---------------------------------------- */

export const WithSelect: Story = {
  name: 'With Select',
  render: () => (
    <FormField id="country" required>
      <FormField.Label>Country</FormField.Label>
      <FormField.Control>
        <Select
          id="country"
          placeholder="Select a country"
          fullWidth
          options={[
            { value: 'kr', label: 'South Korea' },
            { value: 'us', label: 'United States' },
            { value: 'jp', label: 'Japan' },
            { value: 'cn', label: 'China' },
          ]}
        />
      </FormField.Control>
      <FormField.HelperText>Select your country of residence.</FormField.HelperText>
    </FormField>
  ),
};

export const WithCheckbox: Story = {
  name: 'With Checkbox',
  render: () => (
    <FormField id="terms" required>
      <FormField.Control>
        <Checkbox
          id="terms"
          label="I agree to the Terms of Service"
          description="By checking this, you agree to our terms and privacy policy."
        />
      </FormField.Control>
    </FormField>
  ),
};

/* ----------------------------------------
   Label Sizes
   ---------------------------------------- */

export const LabelSizes: Story = {
  name: 'Label Sizes',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
      <FormField id="small-label">
        <FormField.Label size="sm">Small Label</FormField.Label>
        <FormField.Control>
          <Input id="small-label" placeholder="With small label" fullWidth />
        </FormField.Control>
      </FormField>
      <FormField id="medium-label">
        <FormField.Label size="md">Medium Label (Default)</FormField.Label>
        <FormField.Control>
          <Input id="medium-label" placeholder="With medium label" fullWidth />
        </FormField.Control>
      </FormField>
    </div>
  ),
};

/* ----------------------------------------
   Complete Form Example
   ---------------------------------------- */

export const CompleteForm: Story = {
  name: 'Complete Form Example',
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-6)] w-full">
      <FormField id="form-name" required>
        <FormField.Label>Full Name</FormField.Label>
        <FormField.Control>
          <Input id="form-name" placeholder="John Doe" fullWidth />
        </FormField.Control>
      </FormField>

      <FormField id="form-email" required>
        <FormField.Label>Email Address</FormField.Label>
        <FormField.Control>
          <Input id="form-email" type="email" placeholder="john@example.com" fullWidth />
        </FormField.Control>
        <FormField.HelperText>We'll send a confirmation to this email.</FormField.HelperText>
      </FormField>

      <FormField id="form-password" required error>
        <FormField.Label>Password</FormField.Label>
        <FormField.Control>
          <Input id="form-password" type="password" placeholder="••••••••" fullWidth error />
        </FormField.Control>
        <FormField.ErrorMessage>Password must contain at least one number.</FormField.ErrorMessage>
      </FormField>

      <FormField id="form-role">
        <FormField.Label>Role</FormField.Label>
        <FormField.Control>
          <Select
            id="form-role"
            placeholder="Select role"
            fullWidth
            options={[
              { value: 'admin', label: 'Administrator' },
              { value: 'editor', label: 'Editor' },
              { value: 'viewer', label: 'Viewer' },
            ]}
          />
        </FormField.Control>
        <FormField.HelperText>Choose the appropriate access level.</FormField.HelperText>
      </FormField>
    </div>
  ),
};
