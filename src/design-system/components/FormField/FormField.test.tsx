import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';
import { Input } from '../Input';

describe('FormField', () => {
  describe('FormFieldRoot', () => {
    it('renders children', () => {
      render(
        <FormField>
          <span>Child content</span>
        </FormField>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <FormField className="custom-class">
          <span>Content</span>
        </FormField>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('FormField.Label', () => {
    it('renders label text', () => {
      render(
        <FormField>
          <FormField.Label>Username</FormField.Label>
        </FormField>
      );
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('shows required indicator when required', () => {
      render(
        <FormField required>
          <FormField.Label>Username</FormField.Label>
        </FormField>
      );
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('shows required indicator from prop override', () => {
      render(
        <FormField>
          <FormField.Label required>Username</FormField.Label>
        </FormField>
      );
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('connects label to input via id', () => {
      render(
        <FormField id="username-field">
          <FormField.Label>Username</FormField.Label>
          <FormField.Control>
            <input id="username-field" />
          </FormField.Control>
        </FormField>
      );
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('applies sm size styles', () => {
      const { container } = render(
        <FormField>
          <FormField.Label size="sm">Small Label</FormField.Label>
        </FormField>
      );
      expect(container.querySelector('label')).toHaveClass('text-[length:var(--font-size-12)]');
    });

    it('applies md size styles by default', () => {
      const { container } = render(
        <FormField>
          <FormField.Label>Default Label</FormField.Label>
        </FormField>
      );
      expect(container.querySelector('label')).toHaveClass('text-[length:var(--font-size-14)]');
    });
  });

  describe('FormField.Control', () => {
    it('renders control content', () => {
      render(
        <FormField>
          <FormField.Control>
            <input placeholder="Enter value" />
          </FormField.Control>
        </FormField>
      );
      expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <FormField>
          <FormField.Control className="custom-control">
            <input />
          </FormField.Control>
        </FormField>
      );
      expect(container.querySelector('.custom-control')).toBeInTheDocument();
    });
  });

  describe('FormField.HelperText', () => {
    it('renders helper text', () => {
      render(
        <FormField>
          <FormField.HelperText>Enter a unique username</FormField.HelperText>
        </FormField>
      );
      expect(screen.getByText('Enter a unique username')).toBeInTheDocument();
    });

    it('does not render when there is an error', () => {
      render(
        <FormField error>
          <FormField.HelperText>This should not appear</FormField.HelperText>
        </FormField>
      );
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
    });

    it('has correct id when field has id', () => {
      const { container } = render(
        <FormField id="test-field">
          <FormField.HelperText>Helper text</FormField.HelperText>
        </FormField>
      );
      expect(container.querySelector('#test-field-helper')).toBeInTheDocument();
    });
  });

  describe('FormField.ErrorMessage', () => {
    it('renders error message when error is true', () => {
      render(
        <FormField error>
          <FormField.ErrorMessage>Username is required</FormField.ErrorMessage>
        </FormField>
      );
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not render when there is no error', () => {
      render(
        <FormField>
          <FormField.ErrorMessage>This should not appear</FormField.ErrorMessage>
        </FormField>
      );
      expect(screen.queryByText('This should not appear')).not.toBeInTheDocument();
    });

    it('has correct id when field has id', () => {
      const { container } = render(
        <FormField id="test-field" error>
          <FormField.ErrorMessage>Error message</FormField.ErrorMessage>
        </FormField>
      );
      expect(container.querySelector('#test-field-error')).toBeInTheDocument();
    });
  });

  describe('Full FormField composition', () => {
    it('renders complete form field', () => {
      render(
        <FormField id="email" required>
          <FormField.Label>Email</FormField.Label>
          <FormField.Control>
            <input id="email" type="email" placeholder="Enter email" />
          </FormField.Control>
          <FormField.HelperText>We'll never share your email</FormField.HelperText>
        </FormField>
      );

      expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders form field with error', () => {
      render(
        <FormField id="password" error>
          <FormField.Label>Password</FormField.Label>
          <FormField.Control>
            <input id="password" type="password" />
          </FormField.Control>
          <FormField.HelperText>This should be hidden</FormField.HelperText>
          <FormField.ErrorMessage>Password is too short</FormField.ErrorMessage>
        </FormField>
      );

      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.queryByText('This should be hidden')).not.toBeInTheDocument();
      expect(screen.getByText('Password is too short')).toBeInTheDocument();
    });
  });
});
