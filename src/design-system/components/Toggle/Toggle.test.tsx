import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  describe('Rendering', () => {
    it('renders switch role', () => {
      render(<Toggle />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Toggle label="Enable notifications" />);
      expect(screen.getByLabelText('Enable notifications')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(<Toggle label="Dark mode" description="Switch to dark theme" />);
      expect(screen.getByText('Switch to dark theme')).toBeInTheDocument();
    });

    it('has aria-describedby pointing to description', () => {
      render(<Toggle label="Setting" description="Description text" id="test" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-describedby', expect.stringContaining('description'));
    });
  });

  describe('Checked State', () => {
    it('is unchecked by default', () => {
      render(<Toggle label="Option" />);
      expect(screen.getByRole('switch')).not.toBeChecked();
    });

    it('can be checked with defaultChecked', () => {
      render(<Toggle label="Option" defaultChecked />);
      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('supports controlled checked state', () => {
      const { rerender } = render(<Toggle label="Option" checked={false} onChange={() => {}} />);
      expect(screen.getByRole('switch')).not.toBeChecked();

      rerender(<Toggle label="Option" checked={true} onChange={() => {}} />);
      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('has aria-checked attribute', () => {
      const { rerender } = render(<Toggle label="Option" />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

      rerender(<Toggle label="Option" defaultChecked />);
      // Need to re-render with new component for defaultChecked
    });
  });

  describe('Interactions', () => {
    it('toggles when clicked (uncontrolled)', async () => {
      const user = userEvent.setup();
      render(<Toggle label="Option" />);

      const toggle = screen.getByRole('switch');
      expect(toggle).not.toBeChecked();

      await user.click(toggle);
      expect(toggle).toBeChecked();

      await user.click(toggle);
      expect(toggle).not.toBeChecked();
    });

    it('calls onChange when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Toggle label="Option" onChange={handleChange} />);

      await user.click(screen.getByRole('switch'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('can be toggled by clicking label', async () => {
      const user = userEvent.setup();
      render(<Toggle label="Click me" />);

      await user.click(screen.getByText('Click me'));
      expect(screen.getByRole('switch')).toBeChecked();
    });
  });

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Toggle label="Option" disabled />);
      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Toggle label="Option" disabled onChange={handleChange} />);

      await user.click(screen.getByRole('switch'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has role="switch"', () => {
      render(<Toggle label="Option" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('is focusable', () => {
      render(<Toggle label="Option" />);
      const toggle = screen.getByRole('switch');
      toggle.focus();
      expect(toggle).toHaveFocus();
    });

    it('can be toggled with Space key', async () => {
      const user = userEvent.setup();
      render(<Toggle label="Option" />);

      const toggle = screen.getByRole('switch');
      toggle.focus();
      await user.keyboard(' ');

      expect(toggle).toBeChecked();
    });

    it('uses provided id', () => {
      render(<Toggle label="Option" id="custom-id" />);
      expect(screen.getByRole('switch')).toHaveAttribute('id', 'custom-id');
    });
  });
});
