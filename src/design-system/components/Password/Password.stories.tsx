import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Password } from './Password';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { VStack } from '../../layouts';

const meta: Meta<typeof Password> = {
  title: 'Components/Password',
  component: Password,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Password>;

/* ----------------------------------------
   Basic Stories
   ---------------------------------------- */

export const Default: Story = {
  args: {
    placeholder: 'Enter password',
  },
};

export const WithLabel: Story = {
  render: () => (
    <FormField label="Password">
      <Password placeholder="Enter your password" />
    </FormField>
  ),
};

export const Required: Story = {
  render: () => (
    <FormField label="Password" required>
      <Password placeholder="Enter your password" />
    </FormField>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <FormField label="Password" helperText="Password must be at least 8 characters">
      <Password placeholder="Enter your password" />
    </FormField>
  ),
};

/* ----------------------------------------
   Size Variants
   ---------------------------------------- */

export const Sizes: Story = {
  render: () => (
    <VStack gap={4}>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Small
        </h3>
        <Password size="sm" placeholder="Small password input" />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-[var(--primitive-spacing-2)]">
          Medium (default)
        </h3>
        <Password size="md" placeholder="Medium password input" />
      </div>
    </VStack>
  ),
};

/* ----------------------------------------
   States
   ---------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <FormField label="Password">
      <Password placeholder="Enter password" disabled value="secret123" />
    </FormField>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <FormField label="Password">
      <Password value="secret123" readOnly />
    </FormField>
  ),
};

export const Error: Story = {
  render: () => (
    <FormField label="Password" errorMessage="Password is required" error>
      <Password placeholder="Enter password" />
    </FormField>
  ),
};

export const ErrorBoolean: Story = {
  render: () => (
    <FormField label="Password" helperText="This field has an error" error>
      <Password placeholder="Enter password" />
    </FormField>
  ),
};

/* ----------------------------------------
   Toggle Options
   ---------------------------------------- */

export const WithoutToggle: Story = {
  render: () => (
    <FormField label="Password">
      <Password placeholder="Enter password" showToggle={false} />
    </FormField>
  ),
};

export const CustomToggleLabels: Story = {
  render: () => (
    <FormField label="Password">
      <Password
        placeholder="Enter password"
        showLabel="비밀번호 보기"
        hideLabel="비밀번호 숨기기"
      />
    </FormField>
  ),
};

/* ----------------------------------------
   Full Width
   ---------------------------------------- */

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <FormField label="Password">
        <Password placeholder="Enter password" fullWidth />
      </FormField>
    </div>
  ),
};

/* ----------------------------------------
   Controlled Example
   ---------------------------------------- */

export const Controlled: Story = {
  render: () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (value: string) => {
      if (value.length < 8) {
        setError('Password must be at least 8 characters');
      } else if (!/[A-Z]/.test(value)) {
        setError('Password must contain at least one uppercase letter');
      } else if (!/[0-9]/.test(value)) {
        setError('Password must contain at least one number');
      } else {
        setError('');
      }
    };

    return (
      <VStack gap={4}>
        <FormField
          label="Password"
          helperText={!error ? 'Min 8 characters, 1 uppercase, 1 number' : undefined}
          errorMessage={error || undefined}
          error={!!error}
        >
          <Password
            placeholder="Enter a strong password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
        </FormField>
        <p className="text-body-sm text-[var(--color-text-muted)]">
          Password length: {password.length}
        </p>
      </VStack>
    );
  },
};

/* ----------------------------------------
   Form Example
   ---------------------------------------- */

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    const [errors, setErrors] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors = { ...errors };

      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'New password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      setErrors(newErrors);
    };

    return (
      <form onSubmit={handleSubmit} style={{ width: '320px' }}>
        <VStack gap={4}>
          <FormField
            label="Current Password"
            required
            errorMessage={errors.currentPassword || undefined}
            error={!!errors.currentPassword}
          >
            <Password
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) => {
                setFormData({ ...formData, currentPassword: e.target.value });
                setErrors({ ...errors, currentPassword: '' });
              }}
              fullWidth
            />
          </FormField>
          <FormField
            label="New Password"
            required
            helperText="Minimum 8 characters"
            errorMessage={errors.newPassword || undefined}
            error={!!errors.newPassword}
          >
            <Password
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => {
                setFormData({ ...formData, newPassword: e.target.value });
                setErrors({ ...errors, newPassword: '' });
              }}
              fullWidth
            />
          </FormField>
          <FormField
            label="Confirm Password"
            required
            errorMessage={errors.confirmPassword || undefined}
            error={!!errors.confirmPassword}
          >
            <Password
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setErrors({ ...errors, confirmPassword: '' });
              }}
              fullWidth
            />
          </FormField>
          <Button type="submit" variant="primary" size="md" fullWidth>
            Change Password
          </Button>
        </VStack>
      </form>
    );
  },
};
