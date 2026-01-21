import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Chip } from './Chip';
import { IconTag } from '@tabler/icons-react';

describe('Chip Accessibility', () => {
  it('should have no accessibility violations with label only', async () => {
    const { container } = render(<Chip label="Category" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with label and value', async () => {
    const { container } = render(<Chip label="Status" value="Active" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with different variants', async () => {
    const variants = ['default', 'outlined'] as const;
    
    for (const variant of variants) {
      const { container } = render(<Chip label="Tag" variant={variant} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations with remove button', async () => {
    const { container } = render(
      <Chip label="Removable" onRemove={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Chip label="Disabled" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with icon', async () => {
    const { container } = render(
      <Chip label="Tagged" icon={<IconTag size={12} />} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
