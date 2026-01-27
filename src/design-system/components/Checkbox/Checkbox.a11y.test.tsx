import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';

describe('Checkbox Accessibility', () => {
  it('should have no accessibility violations with label', async () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with description', async () => {
    const { container } = render(
      <Checkbox label="Newsletter" description="Receive weekly updates" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when checked', async () => {
    const { container } = render(<Checkbox label="Option" defaultChecked />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when indeterminate', async () => {
    const { container } = render(<Checkbox label="Select all" indeterminate />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Checkbox label="Disabled" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with error', async () => {
    const { container } = render(<Checkbox label="Terms" error errorMessage="Required" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
