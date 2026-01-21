import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Toggle } from './Toggle';

describe('Toggle Accessibility', () => {
  it('should have no accessibility violations with label', async () => {
    const { container } = render(<Toggle label="Enable notifications" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with description', async () => {
    const { container } = render(
      <Toggle
        label="Dark mode"
        description="Enable dark theme for better visibility"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when checked', async () => {
    const { container } = render(
      <Toggle label="Active" defaultChecked />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(
      <Toggle label="Disabled toggle" disabled />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with different sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    for (const size of sizes) {
      const { container } = render(<Toggle label={`Size ${size}`} size={size} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });
});
