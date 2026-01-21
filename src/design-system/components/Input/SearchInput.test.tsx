import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  describe('Rendering', () => {
    it('renders search input element', () => {
      render(<SearchInput />);
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<SearchInput label="Search items" />);
      expect(screen.getByText('Search items')).toBeInTheDocument();
      expect(screen.getByLabelText('Search items')).toBeInTheDocument();
    });

    it('has default aria-label when no label is provided', () => {
      render(<SearchInput />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label', 'Search');
    });

    it('renders with placeholder', () => {
      render(<SearchInput placeholder="Type to search..." />);
      expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
    });
  });

  describe('Value handling', () => {
    it('displays controlled value', () => {
      render(<SearchInput value="test query" onChange={() => {}} />);
      expect(screen.getByRole('searchbox')).toHaveValue('test query');
    });

    it('displays default value', () => {
      render(<SearchInput defaultValue="initial value" />);
      expect(screen.getByRole('searchbox')).toHaveValue('initial value');
    });

    it('calls onChange when typing', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<SearchInput onChange={handleChange} />);
      
      await user.type(screen.getByRole('searchbox'), 'hello');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('updates uncontrolled value on input', async () => {
      const user = userEvent.setup();
      render(<SearchInput />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'search term');
      
      expect(input).toHaveValue('search term');
    });
  });

  describe('Clear button', () => {
    it('shows clear button when has value and clearable', async () => {
      const user = userEvent.setup();
      render(<SearchInput clearable />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');
      
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    });

    it('hides clear button when input is empty', () => {
      render(<SearchInput clearable />);
      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    });

    it('hides clear button when clearable is false', async () => {
      const user = userEvent.setup();
      render(<SearchInput clearable={false} defaultValue="test" />);
      
      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    });

    it('hides clear button when disabled', () => {
      render(<SearchInput defaultValue="test" disabled />);
      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    });

    it('clears uncontrolled value when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchInput clearable />);
      
      const input = screen.getByRole('searchbox');
      await user.type(input, 'test value');
      
      expect(input).toHaveValue('test value');
      
      await user.click(screen.getByRole('button', { name: 'Clear search' }));
      
      expect(input).toHaveValue('');
    });

    it('calls onClear when clear button is clicked', async () => {
      const handleClear = vi.fn();
      const user = userEvent.setup();

      render(<SearchInput clearable onClear={handleClear} defaultValue="test" />);
      
      await user.click(screen.getByRole('button', { name: 'Clear search' }));
      
      expect(handleClear).toHaveBeenCalled();
    });

    it('calls onClear for controlled component', async () => {
      const handleClear = vi.fn();
      const user = userEvent.setup();

      render(<SearchInput clearable onClear={handleClear} value="test" onChange={() => {}} />);
      
      await user.click(screen.getByRole('button', { name: 'Clear search' }));
      
      expect(handleClear).toHaveBeenCalled();
    });
  });

  describe('Size variants', () => {
    it('renders with default md size', () => {
      render(<SearchInput />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('h-[var(--search-input-height-md)]');
    });

    it('renders with sm size', () => {
      render(<SearchInput size="sm" />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('h-[var(--search-input-height-sm)]');
    });
  });

  describe('Disabled state', () => {
    it('disables input when disabled prop is true', () => {
      render(<SearchInput disabled />);
      expect(screen.getByRole('searchbox')).toBeDisabled();
    });

    it('does not show clear button when disabled', () => {
      render(<SearchInput defaultValue="test" disabled clearable />);
      expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies fullWidth class', () => {
      const { container } = render(<SearchInput fullWidth />);
      expect(container.querySelector('.w-full')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<SearchInput className="custom-class" />);
      expect(screen.getByRole('searchbox')).toHaveClass('custom-class');
    });

    it('extracts width classes to wrapper', () => {
      const { container } = render(<SearchInput className="w-[300px]" />);
      expect(container.firstChild).toHaveClass('w-[300px]');
    });

    it('extracts margin classes to wrapper', () => {
      const { container } = render(<SearchInput className="mt-4" />);
      expect(container.firstChild).toHaveClass('mt-4');
    });
  });

  describe('Accessibility', () => {
    it('has search input type', () => {
      render(<SearchInput />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
    });

    it('clear button has aria-label', () => {
      render(<SearchInput defaultValue="test" clearable />);
      expect(screen.getByRole('button', { name: 'Clear search' })).toHaveAttribute('aria-label', 'Clear search');
    });

    it('generates unique id when not provided', () => {
      render(<SearchInput />);
      const input = screen.getByRole('searchbox');
      expect(input.id).toMatch(/^search-input-/);
    });

    it('uses provided id', () => {
      render(<SearchInput id="my-search" />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('id', 'my-search');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = { current: null as HTMLInputElement | null };
      render(<SearchInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });
});
