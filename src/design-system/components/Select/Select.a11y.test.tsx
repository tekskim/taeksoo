import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Select } from './Select';

const options = [
  { value: 'kr', label: 'Korea' },
  { value: 'us', label: 'USA' },
  { value: 'jp', label: 'Japan' },
];

describe('Select Accessibility', () => {
  it('should have no accessibility violations with label', async () => {
    const { container } = render(
      <Select label="Country" options={options} placeholder="Select country" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with helper text', async () => {
    const { container } = render(
      <Select label="Country" options={options} helperText="Choose your country" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with error', async () => {
    const { container } = render(
      <Select label="Country" options={options} error="Please select a country" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Select label="Country" options={options} disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when required', async () => {
    const { container } = render(<Select label="Country" options={options} required />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with selected value', async () => {
    const { container } = render(
      <Select label="Country" options={options} value="kr" onChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
