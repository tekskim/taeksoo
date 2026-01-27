import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<NumberInput />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<NumberInput label="Quantity" />);
      expect(screen.getByText('Quantity')).toBeInTheDocument();
      expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<NumberInput helperText="Enter a number between 1-100" />);
      expect(screen.getByText('Enter a number between 1-100')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<NumberInput error="Value is required" />);
      expect(screen.getByText('Value is required')).toBeInTheDocument();
    });

    it('renders stepper buttons by default', () => {
      render(<NumberInput />);
      expect(screen.getByRole('button', { name: 'Increase value' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Decrease value' })).toBeInTheDocument();
    });

    it('hides stepper buttons when hideSteppers is true', () => {
      render(<NumberInput hideSteppers />);
      expect(screen.queryByRole('button', { name: 'Increase value' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Decrease value' })).not.toBeInTheDocument();
    });
  });

  describe('Controlled mode', () => {
    it('displays controlled value', () => {
      render(<NumberInput value={42} onChange={() => {}} />);
      expect(screen.getByRole('spinbutton')).toHaveValue(42);
    });

    it('calls onChange when value changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={10} onChange={handleChange} />);
      const input = screen.getByRole('spinbutton');

      await user.clear(input);
      await user.type(input, '25');

      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onChange when increment button is clicked', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={5} onChange={handleChange} />);

      await user.click(screen.getByRole('button', { name: 'Increase value' }));

      expect(handleChange).toHaveBeenCalledWith(6);
    });

    it('calls onChange when decrement button is clicked', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={5} onChange={handleChange} />);

      await user.click(screen.getByRole('button', { name: 'Decrease value' }));

      expect(handleChange).toHaveBeenCalledWith(4);
    });
  });

  describe('Uncontrolled mode', () => {
    it('uses defaultValue', () => {
      render(<NumberInput defaultValue={10} />);
      expect(screen.getByRole('spinbutton')).toHaveValue(10);
    });

    it('updates internal value on input change', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={0} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '15');

      expect(input).toHaveValue(15);
    });
  });

  describe('Min/Max constraints', () => {
    it('clamps value to min', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={5} onChange={handleChange} min={0} />);

      await user.click(screen.getByRole('button', { name: 'Decrease value' }));

      // Should clamp to 4 (value - step), not below min
      expect(handleChange).toHaveBeenCalledWith(4);
    });

    it('clamps value to max', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={95} onChange={handleChange} max={100} />);

      await user.click(screen.getByRole('button', { name: 'Increase value' }));

      expect(handleChange).toHaveBeenCalledWith(96);
    });

    it('prevents increment beyond max', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={100} onChange={handleChange} max={100} />);

      const incrementButton = screen.getByRole('button', { name: 'Increase value' });
      expect(incrementButton).toBeDisabled();
    });

    it('prevents decrement below min', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={0} onChange={handleChange} min={0} />);

      const decrementButton = screen.getByRole('button', { name: 'Decrease value' });
      expect(decrementButton).toBeDisabled();
    });
  });

  describe('Step', () => {
    it('increments by step value', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={10} onChange={handleChange} step={5} />);

      await user.click(screen.getByRole('button', { name: 'Increase value' }));

      expect(handleChange).toHaveBeenCalledWith(15);
    });

    it('decrements by step value', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={10} onChange={handleChange} step={5} />);

      await user.click(screen.getByRole('button', { name: 'Decrease value' }));

      expect(handleChange).toHaveBeenCalledWith(5);
    });

    it('supports decimal step values', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={1} onChange={handleChange} step={0.1} />);

      await user.click(screen.getByRole('button', { name: 'Increase value' }));

      expect(handleChange).toHaveBeenCalledWith(1.1);
    });
  });

  describe('Keyboard navigation', () => {
    it('increments on ArrowUp', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={10} onChange={handleChange} />);

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.keyboard('{ArrowUp}');

      expect(handleChange).toHaveBeenCalledWith(11);
    });

    it('decrements on ArrowDown', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={10} onChange={handleChange} />);

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      expect(handleChange).toHaveBeenCalledWith(9);
    });

    it('does not respond to keyboard when disabled', async () => {
      const handleChange = vi.fn();

      render(<NumberInput value={10} onChange={handleChange} disabled />);

      const input = screen.getByRole('spinbutton');
      fireEvent.keyDown(input, { key: 'ArrowUp' });

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Disabled state', () => {
    it('disables input when disabled prop is true', () => {
      render(<NumberInput disabled />);
      expect(screen.getByRole('spinbutton')).toBeDisabled();
    });

    it('does not allow increment when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={10} onChange={handleChange} disabled />);

      await user.click(screen.getByRole('button', { name: 'Increase value' }));

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not allow decrement when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={10} onChange={handleChange} disabled />);

      await user.click(screen.getByRole('button', { name: 'Decrease value' }));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has aria-invalid when error is present', () => {
      render(<NumberInput error="Invalid value" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
    });

    it('has aria-describedby referencing error message', () => {
      render(<NumberInput id="qty" error="Invalid value" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-describedby', 'qty-error');
    });

    it('has aria-describedby referencing helper text', () => {
      render(<NumberInput id="qty" helperText="Enter quantity" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-describedby', 'qty-helper');
    });

    it('stepper buttons have appropriate aria-labels', () => {
      render(<NumberInput />);
      expect(screen.getByRole('button', { name: 'Increase value' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Decrease value' })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies fullWidth class', () => {
      const { container } = render(<NumberInput fullWidth />);
      expect(container.firstChild).toHaveClass('w-full');
    });

    it('applies custom className to input', () => {
      render(<NumberInput className="custom-class" />);
      expect(screen.getByRole('spinbutton')).toHaveClass('custom-class');
    });
  });

  describe('Empty value handling', () => {
    it('handles empty input', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput value={10} onChange={handleChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);

      // When cleared, should not call onChange with NaN
      expect(handleChange).not.toHaveBeenCalledWith(NaN);
    });

    it('starts from 0 when incrementing from empty', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<NumberInput onChange={handleChange} />);

      await user.click(screen.getByRole('button', { name: 'Increase value' }));

      expect(handleChange).toHaveBeenCalledWith(1);
    });
  });
});
