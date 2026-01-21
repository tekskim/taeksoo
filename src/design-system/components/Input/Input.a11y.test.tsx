import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Input } from './Input';

describe('Input Accessibility', () => {
  it('should have no accessibility violations with label', async () => {
    const { container } = render(<Input label="Email" placeholder="Enter email" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with helper text', async () => {
    const { container } = render(
      <Input label="Password" helperText="Must be at least 8 characters" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with error', async () => {
    const { container } = render(
      <Input label="Email" error="Invalid email format" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Input label="Field" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when required', async () => {
    const { container } = render(<Input label="Required Field" required />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
