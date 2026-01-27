import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { IconCheck } from '@tabler/icons-react';

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(<Badge>Label</Badge>);
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('renders as span element', () => {
      render(<Badge>Label</Badge>);
      expect(screen.getByText('Label').tagName).toBe('SPAN');
    });
  });

  describe('Themes', () => {
    it('applies blue theme by default', () => {
      render(<Badge>Blue</Badge>);
      const badge = screen.getByText('Blue');
      expect(badge).toHaveClass('bg-[var(--color-state-info)]');
    });

    it('applies red theme', () => {
      render(<Badge theme="red">Red</Badge>);
      const badge = screen.getByText('Red');
      expect(badge).toHaveClass('bg-[var(--color-state-danger)]');
    });

    it('applies green theme', () => {
      render(<Badge theme="green">Green</Badge>);
      const badge = screen.getByText('Green');
      expect(badge).toHaveClass('bg-[var(--color-state-success)]');
    });

    it('applies yellow theme', () => {
      render(<Badge theme="yellow">Yellow</Badge>);
      const badge = screen.getByText('Yellow');
      expect(badge).toHaveClass('bg-[var(--color-state-warning)]');
    });

    it('applies gray theme', () => {
      render(<Badge theme="gray">Gray</Badge>);
      const badge = screen.getByText('Gray');
      expect(badge).toHaveClass('bg-[var(--color-text-subtle)]');
    });
  });

  describe('Types', () => {
    it('applies solid type by default', () => {
      render(<Badge theme="blue">Solid</Badge>);
      const badge = screen.getByText('Solid');
      expect(badge).toHaveClass('bg-[var(--color-state-info)]');
      expect(badge).toHaveClass('text-white');
    });

    it('applies subtle type', () => {
      render(
        <Badge theme="blue" type="subtle">
          Subtle
        </Badge>
      );
      const badge = screen.getByText('Subtle');
      expect(badge).toHaveClass('bg-[var(--color-state-info-bg)]');
    });
  });

  describe('Sizes', () => {
    it('applies sm size', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByText('Small');
      expect(badge).toHaveClass('px-[var(--badge-padding-x-sm)]');
    });

    it('applies md size by default', () => {
      render(<Badge>Medium</Badge>);
      const badge = screen.getByText('Medium');
      expect(badge).toHaveClass('px-[var(--badge-padding-x-md)]');
    });

    it('applies lg size', () => {
      render(<Badge size="lg">Large</Badge>);
      const badge = screen.getByText('Large');
      expect(badge).toHaveClass('px-[var(--badge-padding-x-lg)]');
    });
  });

  describe('Icons', () => {
    it('renders left icon', () => {
      render(<Badge leftIcon={<IconCheck data-testid="left-icon" />}>With Icon</Badge>);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders right icon', () => {
      render(<Badge rightIcon={<IconCheck data-testid="right-icon" />}>With Icon</Badge>);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('renders both icons', () => {
      render(
        <Badge
          leftIcon={<IconCheck data-testid="left-icon" />}
          rightIcon={<IconCheck data-testid="right-icon" />}
        >
          With Icons
        </Badge>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Dot', () => {
    it('renders dot when dot prop is true', () => {
      const { container } = render(<Badge dot>With Dot</Badge>);
      const dot = container.querySelector('.rounded-full');
      expect(dot).toBeInTheDocument();
    });

    it('does not render dot by default', () => {
      const { container } = render(<Badge>No Dot</Badge>);
      const dot = container.querySelector('.rounded-full');
      expect(dot).not.toBeInTheDocument();
    });
  });

  describe('Legacy Variant Support', () => {
    it('supports legacy variant prop', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText('Success');
      // Legacy variants use subtle type
      expect(badge).toHaveClass('bg-[var(--color-state-success-bg)]');
    });

    it('theme prop takes precedence over variant', () => {
      render(
        <Badge variant="success" theme="red">
          Mixed
        </Badge>
      );
      const badge = screen.getByText('Mixed');
      expect(badge).toHaveClass('bg-[var(--color-state-danger)]');
    });
  });

  describe('Custom className', () => {
    it('merges custom className', () => {
      render(<Badge className="custom-class">Custom</Badge>);
      expect(screen.getByText('Custom')).toHaveClass('custom-class');
    });
  });
});
