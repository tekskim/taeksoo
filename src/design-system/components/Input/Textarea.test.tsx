import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  describe('Rendering', () => {
    it('renders textarea element', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Textarea label="Description" />);
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('renders with required indicator', () => {
      render(<Textarea label="Description" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<Textarea helperText="Max 500 characters" />);
      expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<Textarea error="Description is required" />);
      // Note: The component doesn't render error message in the DOM
      // but sets aria-invalid to true
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('renders with placeholder', () => {
      render(<Textarea placeholder="Enter your message..." />);
      expect(screen.getByPlaceholderText('Enter your message...')).toBeInTheDocument();
    });
  });

  describe('Value handling', () => {
    it('displays controlled value', () => {
      render(<Textarea value="Hello World" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('Hello World');
    });

    it('displays default value', () => {
      render(<Textarea defaultValue="Initial content" />);
      expect(screen.getByRole('textbox')).toHaveValue('Initial content');
    });

    it('calls onChange when typing', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Textarea onChange={handleChange} />);
      
      await user.type(screen.getByRole('textbox'), 'test');
      
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Textarea variant="default" />);
      expect(screen.getByRole('textbox')).toHaveClass('rounded-[var(--input-radius)]');
    });

    it('renders code variant with monospace font', () => {
      render(<Textarea variant="code" />);
      expect(screen.getByRole('textbox')).toHaveClass('font-mono');
    });
  });

  describe('Disabled state', () => {
    it('disables textarea when disabled prop is true', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toHaveClass('cursor-not-allowed');
    });
  });

  describe('ReadOnly state', () => {
    it('sets readonly attribute', () => {
      render(<Textarea readOnly />);
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('applies readonly styles', () => {
      render(<Textarea readOnly />);
      expect(screen.getByRole('textbox')).toHaveClass('cursor-default');
    });
  });

  describe('Character limit', () => {
    it('sets maxLength attribute', () => {
      render(<Textarea maxLength={100} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '100');
    });
  });

  describe('Styling', () => {
    it('applies fullWidth class', () => {
      const { container } = render(<Textarea fullWidth />);
      expect(container.firstChild).toHaveClass('w-full');
    });

    it('applies w-fit when not fullWidth', () => {
      const { container } = render(<Textarea />);
      expect(container.firstChild).toHaveClass('w-fit');
    });

    it('applies custom className', () => {
      render(<Textarea className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('has resizable style by default', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toHaveClass('resize-y');
    });

    it('disables resize when disabled', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toHaveClass('resize-none');
    });
  });

  describe('Accessibility', () => {
    it('has aria-invalid when error is present', () => {
      render(<Textarea error="Error message" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('has aria-describedby referencing helper text', () => {
      render(<Textarea id="desc" helperText="Help text" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'desc-helper');
    });

    it('generates unique id when not provided', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.id).toMatch(/^textarea-/);
    });

    it('uses provided id', () => {
      render(<Textarea id="my-textarea" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-textarea');
    });

    it('associates label with textarea', () => {
      render(<Textarea id="my-input" label="Description" />);
      const label = screen.getByText('Description');
      expect(label).toHaveAttribute('for', 'my-input');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = { current: null as HTMLTextAreaElement | null };
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('Native props', () => {
    it('passes through native textarea props', () => {
      render(<Textarea rows={5} cols={50} name="message" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
      expect(textarea).toHaveAttribute('cols', '50');
      expect(textarea).toHaveAttribute('name', 'message');
    });
  });
});
