import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Accordion } from './Accordion';

describe('Accordion Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when expanded', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );

    await user.click(screen.getByRole('button', { name: 'Section 1' }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with default expanded', async () => {
    const { container } = render(
      <Accordion.Root defaultExpanded={['item-1']}>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with allowMultiple', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion.Root allowMultiple>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item-2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );

    await user.click(screen.getByRole('button', { name: 'Section 1' }));
    await user.click(screen.getByRole('button', { name: 'Section 2' }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for different variants', async () => {
    const variants = ['default', 'bordered', 'separated'] as const;

    for (const variant of variants) {
      const { container } = render(
        <Accordion.Root variant={variant}>
          <Accordion.Item id="item-1">
            <Accordion.Trigger>Section 1</Accordion.Trigger>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have proper ARIA attributes on trigger', () => {
    render(
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );

    const trigger = screen.getByRole('button', { name: 'Section 1' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('should have proper ARIA attributes on panel when expanded', async () => {
    const user = userEvent.setup();
    render(
      <Accordion.Root>
        <Accordion.Item id="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );

    await user.click(screen.getByRole('button', { name: 'Section 1' }));
    const panel = screen.getByRole('region');
    expect(panel).toHaveAttribute('aria-labelledby');
  });

  it('should have no accessibility violations for disabled item', async () => {
    const { container } = render(
      <Accordion.Root>
        <Accordion.Item id="item-1" disabled>
          <Accordion.Trigger>Disabled Section</Accordion.Trigger>
          <Accordion.Panel>Content</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
