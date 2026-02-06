import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { NumberInput } from './NumberInput';

describe('NumberInput Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<NumberInput aria-label="Quantity" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with label', async () => {
    const { container } = render(<NumberInput label="Quantity" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with helperText', async () => {
    const { container } = render(
      <NumberInput aria-label="Quantity" helperText="Enter a number between 1 and 100" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with error', async () => {
    const { container } = render(
      <NumberInput aria-label="Quantity" error="Value must be greater than 0" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have aria-invalid when error is present', () => {
    render(<NumberInput aria-label="Quantity" error="Invalid value" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<NumberInput aria-label="Quantity" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible stepper buttons', () => {
    render(<NumberInput aria-label="Quantity" value={5} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Increase value' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decrease value' })).toBeInTheDocument();
  });

  it('should have no accessibility violations with min/max', async () => {
    const { container } = render(<NumberInput aria-label="Quantity" min={0} max={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput aria-label="Quantity" value={10} onChange={onChange} />);

    const input = screen.getByRole('spinbutton');
    input.focus();

    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenCalledWith(11);

    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it('should have no accessibility violations without steppers', async () => {
    const { container } = render(<NumberInput aria-label="Quantity" hideSteppers />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have aria-describedby for helper text', () => {
    const { container } = render(
      <NumberInput aria-label="Quantity" id="qty-input" helperText="Enter quantity" />
    );
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-describedby', 'qty-input-helper');
  });
});
