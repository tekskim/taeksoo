import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Loading } from './Loading';

describe('Loading Accessibility', () => {
  it('should have no accessibility violations for spinner variant', async () => {
    const { container } = render(<Loading variant="spinner" text="Loading..." />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for progress variant', async () => {
    const { container } = render(
      <Loading
        variant="progress"
        text="Uploading"
        description="Please wait while we process your file"
        progress={45}
        statusText="45% complete"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for button variant', async () => {
    const { container } = render(<Loading variant="button" buttonLabel="Saving..." />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for different sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      const { container } = render(<Loading variant="spinner" size={size} text="Loading" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations without text', async () => {
    const { container } = render(<Loading variant="spinner" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
