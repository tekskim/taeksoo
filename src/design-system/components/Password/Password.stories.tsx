import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Password } from './Password';
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
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    helperText: 'Password must be at least 8 characters',
  },
};

/* ----------------------------------------
   Size Variants
   ---------------------------------------- */

export const Sizes: Story = {
  render: () => (
    <VStack gap={4}>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Small</h3>
        <Password size="sm" placeholder="Small password input" />
      </div>
      <div>
        <h3 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Medium (default)</h3>
        <Password size="md" placeholder="Medium password input" />
      </div>
    </VStack>
  ),
};

/* ----------------------------------------
   States
   ---------------------------------------- */

export const Disabled: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    disabled: true,
    value: 'secret123',
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Password',
    value: 'secret123',
    readOnly: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    error: 'Password is required',
  },
};

export const ErrorBoolean: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    error: true,
    helperText: 'This field has an error',
  },
};

/* ----------------------------------------
   Toggle Options
   ---------------------------------------- */

export const WithoutToggle: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    showToggle: false,
  },
};

export const CustomToggleLabels: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    showLabel: '비밀번호 보기',
    hideLabel: '비밀번호 숨기기',
  },
};

/* ----------------------------------------
   Full Width
   ---------------------------------------- */

export const FullWidth: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
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
        <Password
          label="Password"
          placeholder="Enter a strong password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          error={error}
          helperText={!error ? 'Min 8 characters, 1 uppercase, 1 number' : undefined}
        />
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
          <Password
            label="Current Password"
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChange={(e) => {
              setFormData({ ...formData, currentPassword: e.target.value });
              setErrors({ ...errors, currentPassword: '' });
            }}
            error={errors.currentPassword}
            fullWidth
            required
          />
          <Password
            label="New Password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={(e) => {
              setFormData({ ...formData, newPassword: e.target.value });
              setErrors({ ...errors, newPassword: '' });
            }}
            error={errors.newPassword}
            helperText="Minimum 8 characters"
            fullWidth
            required
          />
          <Password
            label="Confirm Password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              setErrors({ ...errors, confirmPassword: '' });
            }}
            error={errors.confirmPassword}
            fullWidth
            required
          />
          <button
            type="submit"
            className="w-full h-9 bg-[var(--color-action-primary)] text-white rounded-md text-body-md font-medium hover:opacity-90 transition-opacity"
          >
            Change Password
          </button>
        </VStack>
      </form>
    );
  },
};
