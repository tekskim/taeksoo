import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select', () => {
  describe('Rendering', () => {
    it('renders with placeholder', () => {
      render(<Select options={defaultOptions} placeholder="Select an option" />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Select options={defaultOptions} label="Choose option" />);
      expect(screen.getByText('Choose option')).toBeInTheDocument();
    });

    it('renders label with required indicator', () => {
      render(<Select options={defaultOptions} label="Category" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(<Select options={defaultOptions} helperText="Select a value" />);
      expect(screen.getByText('Select a value')).toBeInTheDocument();
    });

    it('renders combobox role', () => {
      render(<Select options={defaultOptions} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Opening and Closing', () => {
    it('opens dropdown on click', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('shows all options when open', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
      });
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Selection', () => {
    it('selects option on click', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={defaultOptions} onChange={handleChange} />);

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('displays selected value', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 1' }));

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('shows controlled value', () => {
      render(<Select options={defaultOptions} value="option2" />);
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('shows default value (uncontrolled)', () => {
      render(<Select options={defaultOptions} defaultValue="option3" />);
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens with Enter key', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);

      screen.getByRole('combobox').focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('opens with Space key', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);

      screen.getByRole('combobox').focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('opens with ArrowDown key', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);

      screen.getByRole('combobox').focus();
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('navigates options with arrow keys', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={defaultOptions} onChange={handleChange} />);

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Navigate down and select
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Select options={defaultOptions} disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} disabled />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Disabled Options', () => {
    it('renders disabled option with aria-disabled', async () => {
      const user = userEvent.setup();
      const optionsWithDisabled = [
        { value: '1', label: 'Enabled' },
        { value: '2', label: 'Disabled', disabled: true },
      ];

      render(<Select options={optionsWithDisabled} />);
      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const disabledOption = screen.getByRole('option', { name: 'Disabled' });
        expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('Error State', () => {
    it('renders error message', () => {
      render(<Select options={defaultOptions} error="Selection required" />);
      expect(screen.getByText('Selection required')).toBeInTheDocument();
    });

    it('has aria-invalid when error exists', () => {
      render(<Select options={defaultOptions} error="Error" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Clearable', () => {
    it('shows clear button when clearable and has value', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} clearable value="option1" />);

      // Look for clear button by aria-label
      expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument();
    });

    it('clears value when clear button clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Select options={defaultOptions} clearable value="option1" onChange={handleChange} />);

      await user.click(screen.getByRole('button', { name: 'Clear selection' }));

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('shows clear option in dropdown when clearable', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} clearable clearLabel="Clear selection" />);

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.getByText('Clear selection')).toBeInTheDocument();
      });
    });
  });

  describe('Width Variants', () => {
    it('applies sm width', () => {
      const { container } = render(<Select options={defaultOptions} width="sm" />);
      expect(container.firstChild).toHaveClass('w-[160px]');
    });

    it('applies md width by default', () => {
      const { container } = render(<Select options={defaultOptions} />);
      expect(container.firstChild).toHaveClass('w-[240px]');
    });

    it('applies lg width', () => {
      const { container } = render(<Select options={defaultOptions} width="lg" />);
      expect(container.firstChild).toHaveClass('w-[320px]');
    });

    it('applies full width when fullWidth is true', () => {
      const { container } = render(<Select options={defaultOptions} fullWidth />);
      expect(container.firstChild).toHaveClass('w-full');
    });
  });

  describe('Accessibility', () => {
    it('has aria-expanded attribute', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);

      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-expanded', 'false');

      await user.click(combobox);

      await waitFor(() => {
        expect(combobox).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('has aria-haspopup attribute', () => {
      render(<Select options={defaultOptions} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('has aria-controls pointing to listbox', async () => {
      const user = userEvent.setup();
      render(<Select options={defaultOptions} />);

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const combobox = screen.getByRole('combobox');
        const listbox = screen.getByRole('listbox');
        expect(combobox.getAttribute('aria-controls')).toBe(listbox.id);
      });
    });
  });
});
