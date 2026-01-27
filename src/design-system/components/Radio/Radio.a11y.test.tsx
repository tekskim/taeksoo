import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Radio, RadioGroup } from './';

describe('Radio Accessibility', () => {
  it('should have no accessibility violations with label', async () => {
    const { container } = render(<Radio label="Option A" name="test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with description', async () => {
    const { container } = render(
      <Radio label="Option A" description="This is the first option" name="test" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Radio label="Disabled option" name="test" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when checked', async () => {
    const { container } = render(<Radio label="Selected option" name="test" defaultChecked />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('RadioGroup Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <RadioGroup name="options" label="Choose an option">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
        <Radio value="c" label="Option C" />
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with description', async () => {
    const { container } = render(
      <RadioGroup name="options" label="Choose an option" description="Select one of the following">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with error', async () => {
    const { container } = render(
      <RadioGroup
        name="options"
        label="Choose an option"
        error
        errorMessage="Please select an option"
      >
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when required', async () => {
    const { container } = render(
      <RadioGroup name="options" label="Choose an option" required>
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
