import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('renders label with required indicator', () => {
      render(<Input label="Email" required />);
      const label = screen.getByText('Email');
      expect(label.parentElement).toContainHTML('*');
    });

    it('renders helper text', () => {
      render(<Input helperText="This is helper text" />);
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('renders error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('has aria-invalid when error exists', () => {
      render(<Input error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('has aria-describedby pointing to error message', () => {
      render(<Input error="Error" id="test-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
    });

    it('does not show helper text when error exists', () => {
      render(<Input helperText="Helper" error="Error" />);
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('cannot be typed into when disabled', async () => {
      const user = userEvent.setup();
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'test');
      expect(input).toHaveValue('');
    });
  });

  describe('ReadOnly State', () => {
    it('applies readOnly attribute', () => {
      render(<Input readOnly />);
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('cannot be modified when readOnly', async () => {
      const user = userEvent.setup();
      render(<Input readOnly defaultValue="initial" />);
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'test');
      expect(input).toHaveValue('initial');
    });
  });

  describe('Interactions', () => {
    it('handles value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'hello');
      
      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('hello');
    });

    it('supports controlled value', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      
      const { rerender } = render(
        <Input value="initial" onChange={handleChange} />
      );
      
      expect(screen.getByRole('textbox')).toHaveValue('initial');
      
      // Simulate controlled update
      rerender(<Input value="updated" onChange={handleChange} />);
      expect(screen.getByRole('textbox')).toHaveValue('updated');
    });
  });

  describe('Sizes', () => {
    it('applies sm size', () => {
      render(<Input size="sm" />);
      expect(screen.getByRole('textbox')).toHaveClass('h-[var(--input-height-sm)]');
    });

    it('applies md size by default', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('h-[var(--input-height-md)]');
    });
  });

  describe('Full Width', () => {
    it('is not full width by default', () => {
      const { container } = render(<Input />);
      expect(container.firstChild).toHaveClass('w-fit');
    });

    it('applies full width when fullWidth is true', () => {
      const { container } = render(<Input fullWidth />);
      expect(container.firstChild).toHaveClass('w-full');
    });
  });

  describe('Left/Right Elements', () => {
    it('renders left element', () => {
      render(<Input leftElement={<span data-testid="left">@</span>} />);
      expect(screen.getByTestId('left')).toBeInTheDocument();
    });

    it('renders right element', () => {
      render(<Input rightElement={<span data-testid="right">!</span>} />);
      expect(screen.getByTestId('right')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('generates unique id when not provided', () => {
      render(<Input label="Field 1" />);
      render(<Input label="Field 2" />);
      
      const input1 = screen.getByLabelText('Field 1');
      const input2 = screen.getByLabelText('Field 2');
      
      expect(input1.id).not.toBe(input2.id);
    });

    it('uses provided id', () => {
      render(<Input id="custom-id" label="Custom" />);
      expect(screen.getByLabelText('Custom')).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Variants', () => {
    it('applies default variant', () => {
      render(<Input variant="default" />);
      expect(screen.getByRole('textbox')).toHaveClass('rounded-[var(--input-radius)]');
    });

    it('applies code variant with monospace font', () => {
      render(<Input variant="code" />);
      expect(screen.getByRole('textbox')).toHaveClass('font-mono');
    });
  });
});
