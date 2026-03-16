import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';
import { IconTag } from '@tabler/icons-react';

describe('Chip', () => {
  describe('Rendering', () => {
    it('renders value', () => {
      render(<Chip value="Active" />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders label and value', () => {
      render(<Chip label="Status" value="Active" />);
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders separator between label and value', () => {
      render(<Chip label="Status" value="Active" />);
      expect(screen.getByText('|')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      render(<Chip value="Tag" icon={<IconTag data-testid="chip-icon" />} />);
      expect(screen.getByTestId('chip-icon')).toBeInTheDocument();
    });

    it('shows title attribute with full text', () => {
      const { container } = render(<Chip label="Status" value="Active" />);
      const chip = container.firstChild;
      expect(chip).toHaveAttribute('title', 'Status: Active');
    });

    it('shows title attribute with value only when no label', () => {
      const { container } = render(<Chip value="Active" />);
      const chip = container.firstChild;
      expect(chip).toHaveAttribute('title', 'Active');
    });
  });

  describe('Remove Button', () => {
    it('shows remove button when onRemove is provided', () => {
      render(<Chip value="Tag" onRemove={() => {}} />);
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    it('does not show remove button by default', () => {
      render(<Chip value="Tag" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onRemove when remove button is clicked', async () => {
      const user = userEvent.setup();
      const handleRemove = vi.fn();
      render(<Chip value="Tag" onRemove={handleRemove} />);

      await user.click(screen.getByRole('button'));

      expect(handleRemove).toHaveBeenCalled();
    });

    it('does not show remove button when disabled', () => {
      render(<Chip value="Tag" onRemove={() => {}} disabled />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('has correct aria-label on remove button', () => {
      render(<Chip label="Status" value="Active" onRemove={() => {}} />);
      expect(screen.getByLabelText('Remove Status: Active')).toBeInTheDocument();
    });

    it('has correct aria-label when no label', () => {
      render(<Chip value="Active" onRemove={() => {}} />);
      expect(screen.getByLabelText('Remove Active')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('applies default variant', () => {
      const { container } = render(<Chip value="Tag" />);
      const chip = container.firstChild;
      expect(chip).toHaveClass('shadow-[inset_0_0_0_1px_var(--chip-border)]');
    });

    it('applies selected variant', () => {
      const { container } = render(<Chip value="Tag" variant="selected" />);
      const chip = container.firstChild;
      expect(chip).toHaveClass('shadow-[inset_0_0_0_1px_var(--chip-border-selected)]');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled styles', () => {
      const { container } = render(<Chip value="Tag" disabled />);
      const chip = container.firstChild;
      expect(chip).toHaveClass('opacity-50');
      expect(chip).toHaveClass('cursor-not-allowed');
    });
  });

  describe('Truncation', () => {
    it('applies maxWidth when provided', () => {
      const { container } = render(<Chip value="Very long value" maxWidth="100px" />);
      const chip = container.firstChild;
      expect(chip).toHaveStyle({ maxWidth: '100px' });
    });

    it('does not apply maxWidth by default', () => {
      const { container } = render(<Chip value="Value" />);
      const chip = container.firstChild;
      expect(chip).not.toHaveAttribute('style');
    });
  });

  describe('Custom Props', () => {
    it('passes additional props to container', () => {
      render(<Chip value="Tag" data-testid="custom-chip" />);
      expect(screen.getByTestId('custom-chip')).toBeInTheDocument();
    });

    it('merges custom className', () => {
      const { container } = render(<Chip value="Tag" className="custom-class" />);
      const chip = container.firstChild;
      expect(chip).toHaveClass('custom-class');
    });
  });
});
