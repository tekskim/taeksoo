import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Disclosure } from './Disclosure';

describe('Disclosure Accessibility', () => {
  it('should have no accessibility violations when closed', async () => {
    const { container } = render(
      <Disclosure>
        <Disclosure.Trigger>Show Details</Disclosure.Trigger>
        <Disclosure.Panel>Detailed content here</Disclosure.Panel>
      </Disclosure>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Disclosure>
        <Disclosure.Trigger>Show Details</Disclosure.Trigger>
        <Disclosure.Panel>Detailed content here</Disclosure.Panel>
      </Disclosure>
    );

    await user.click(screen.getByRole('button', { name: 'Show Details' }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with defaultOpen', async () => {
    const { container } = render(
      <Disclosure defaultOpen>
        <Disclosure.Trigger>Show Details</Disclosure.Trigger>
        <Disclosure.Panel>Detailed content here</Disclosure.Panel>
      </Disclosure>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes on trigger', () => {
    render(
      <Disclosure>
        <Disclosure.Trigger>Show Details</Disclosure.Trigger>
        <Disclosure.Panel>Detailed content here</Disclosure.Panel>
      </Disclosure>
    );

    const trigger = screen.getByRole('button', { name: 'Show Details' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('should update aria-expanded when toggled', async () => {
    const user = userEvent.setup();
    render(
      <Disclosure>
        <Disclosure.Trigger>Show Details</Disclosure.Trigger>
        <Disclosure.Panel>Detailed content here</Disclosure.Panel>
      </Disclosure>
    );

    const trigger = screen.getByRole('button', { name: 'Show Details' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('should have proper ARIA attributes on panel when open', async () => {
    const user = userEvent.setup();
    render(
      <Disclosure>
        <Disclosure.Trigger>Show Details</Disclosure.Trigger>
        <Disclosure.Panel>Detailed content here</Disclosure.Panel>
      </Disclosure>
    );

    await user.click(screen.getByRole('button', { name: 'Show Details' }));
    const panel = screen.getByRole('region');
    expect(panel).toHaveAttribute('aria-labelledby');
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <Disclosure>
        <Disclosure.Trigger>Show Details</Disclosure.Trigger>
        <Disclosure.Panel>Detailed content here</Disclosure.Panel>
      </Disclosure>
    );

    const trigger = screen.getByRole('button', { name: 'Show Details' });
    trigger.focus();

    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
