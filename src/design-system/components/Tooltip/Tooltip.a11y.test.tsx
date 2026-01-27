import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Tooltip } from './Tooltip';

describe('Tooltip Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Tooltip content="Helpful information">
        <button>Hover me</button>
      </Tooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with different positions', async () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;

    for (const position of positions) {
      const { container } = render(
        <Tooltip content={`Tooltip on ${position}`} position={position}>
          <button>Button</button>
        </Tooltip>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(
      <Tooltip content="Hidden tooltip" disabled>
        <button>No tooltip</button>
      </Tooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
