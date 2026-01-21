import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders checkbox input', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(<Checkbox label="Newsletter" description="Receive weekly updates" />);
      expect(screen.getByText('Receive weekly updates')).toBeInTheDocument();
    });

    it('has aria-describedby pointing to description', () => {
      render(<Checkbox label="Newsletter" description="Receive updates" id="test" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', expect.stringContaining('description'));
    });
  });

  describe('Checked State', () => {
    it('is unchecked by default', () => {
      render(<Checkbox label="Option" />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('can be checked with defaultChecked', () => {
      render(<Checkbox label="Option" defaultChecked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('supports controlled checked state', () => {
      const { rerender } = render(<Checkbox label="Option" checked={false} onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();

      rerender(<Checkbox label="Option" checked={true} onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('Indeterminate State', () => {
    it('has aria-checked="mixed" when indeterminate', () => {
      render(<Checkbox label="Select all" indeterminate />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    });
  });

  describe('Interactions', () => {
    it('toggles when clicked (uncontrolled)', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Option" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('calls onChange when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox label="Option" onChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('can be toggled by clicking label', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Click me" />);

      await user.click(screen.getByText('Click me'));
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Checkbox label="Option" disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox label="Option" disabled onChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    it('shows error message when error is true', () => {
      render(<Checkbox label="Terms" error errorMessage="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('has aria-invalid when error is true', () => {
      render(<Checkbox label="Terms" error />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('error message has role="alert"', () => {
      render(<Checkbox label="Terms" error errorMessage="Required" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Required');
    });
  });

  describe('Accessibility', () => {
    it('is focusable', () => {
      render(<Checkbox label="Option" />);
      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(checkbox).toHaveFocus();
    });

    it('can be toggled with Space key', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Option" />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      await user.keyboard(' ');

      expect(checkbox).toBeChecked();
    });

    it('uses provided id', () => {
      render(<Checkbox label="Option" id="custom-id" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'custom-id');
    });
  });
});
