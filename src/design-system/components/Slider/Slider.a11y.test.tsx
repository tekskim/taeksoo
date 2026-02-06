import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Slider } from './Slider';

describe('Slider Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Slider min={0} max={100} aria-label="Volume" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have role="slider"', () => {
    render(<Slider min={0} max={100} aria-label="Volume" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(<Slider min={0} max={100} value={50} aria-label="Volume" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(slider).toHaveAttribute('aria-label', 'Volume');
  });

  it('should have no accessibility violations with default value', async () => {
    const { container } = render(
      <Slider min={0} max={100} defaultValue={25} aria-label="Brightness" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(
      <Slider min={0} max={100} disabled aria-label="Disabled slider" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have aria-disabled when disabled', () => {
    render(<Slider min={0} max={100} disabled aria-label="Disabled slider" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
  });

  it('should have no accessibility violations with showValue', async () => {
    const { container } = render(
      <Slider min={0} max={100} value={75} showValue aria-label="Progress" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider min={0} max={100} value={50} onChange={onChange} aria-label="Volume" />);

    const slider = screen.getByRole('slider');
    slider.focus();

    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(51);

    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith(49);
  });

  it('should support Home/End keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider min={0} max={100} value={50} onChange={onChange} aria-label="Volume" />);

    const slider = screen.getByRole('slider');
    slider.focus();

    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenCalledWith(0);

    await user.keyboard('{End}');
    expect(onChange).toHaveBeenCalledWith(100);
  });
});

import { vi } from 'vitest';
