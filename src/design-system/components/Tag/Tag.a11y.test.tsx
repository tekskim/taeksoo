import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Tag, TagGroup } from './Tag';
import { IconCheck } from '@tabler/icons-react';

describe('Tag Accessibility', () => {
  it('should have no accessibility violations for default tag', async () => {
    const { container } = render(<Tag>Default Tag</Tag>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for all variants', async () => {
    const variants = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const;

    for (const variant of variants) {
      const { container } = render(<Tag variant={variant}>{variant} Tag</Tag>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations for all sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      const { container } = render(<Tag size={size}>{size} Tag</Tag>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations with icon', async () => {
    const { container } = render(<Tag icon={<IconCheck size={12} />}>With Icon</Tag>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for closable tag', async () => {
    const { container } = render(
      <Tag closable onClose={() => {}}>
        Closable Tag
      </Tag>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible close button', () => {
    render(
      <Tag closable onClose={() => {}}>
        Closable Tag
      </Tag>
    );
    const closeButton = screen.getByRole('button', { name: /remove tag/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should have no accessibility violations for clickable tag', async () => {
    const { container } = render(
      <Tag clickable onClick={() => {}}>
        Clickable Tag
      </Tag>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have role="button" for clickable tag', () => {
    render(
      <Tag clickable onClick={() => {}}>
        Clickable Tag
      </Tag>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should have no accessibility violations for disabled tag', async () => {
    const { container } = render(<Tag disabled>Disabled Tag</Tag>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for outline tag', async () => {
    const { container } = render(
      <Tag variant="primary" outline>
        Outline Tag
      </Tag>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for rounded tag', async () => {
    const { container } = render(<Tag rounded>Rounded Tag</Tag>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for TagGroup', async () => {
    const { container } = render(
      <TagGroup gap="md">
        <Tag>Tag 1</Tag>
        <Tag>Tag 2</Tag>
        <Tag>Tag 3</Tag>
      </TagGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
