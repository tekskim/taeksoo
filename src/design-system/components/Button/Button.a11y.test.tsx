import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Button } from './Button';
import { IconPlus } from '@tabler/icons-react';

describe('Button Accessibility', () => {
  it('should have no accessibility violations with text', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with icon and aria-label', async () => {
    const { container } = render(<Button icon={<IconPlus />} aria-label="Add item" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with loading state', async () => {
    const { container } = render(<Button isLoading>Loading</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for all variants', async () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;

    for (const variant of variants) {
      const { container } = render(<Button variant={variant}>Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations as link', async () => {
    const { container } = render(
      <Button as="a" href="/test">
        Link Button
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
