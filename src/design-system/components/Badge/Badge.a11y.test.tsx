import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';
import { IconCheck } from '@tabler/icons-react';

describe('Badge Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with different themes', async () => {
    const themes = ['blue', 'red', 'green', 'yellow', 'gray'] as const;
    
    for (const theme of themes) {
      const { container } = render(<Badge theme={theme}>{theme}</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations with different types', async () => {
    const types = ['solid', 'subtle'] as const;
    
    for (const type of types) {
      const { container } = render(<Badge type={type}>{type}</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations with icon', async () => {
    const { container } = render(
      <Badge leftIcon={<IconCheck size={12} />}>Verified</Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with dot', async () => {
    const { container } = render(<Badge dot>Status</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
