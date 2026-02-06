import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Popover } from './Popover';

describe('Popover Accessibility', () => {
  it('should have no accessibility violations in closed state', async () => {
    const { container } = render(
      <Popover content={<div>Popover content</div>}>
        <button>Open popover</button>
      </Popover>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Popover content={<div>Popover content</div>} trigger="click" aria-label="Test popover">
        <button>Open popover</button>
      </Popover>
    );

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with different positions', async () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;
    const user = userEvent.setup();

    for (const position of positions) {
      const { container, unmount } = render(
        <Popover
          content={<div>Popover on {position}</div>}
          position={position}
          trigger="click"
          aria-label={`Popover ${position}`}
        >
          <button>Button</button>
        </Popover>
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      unmount();
    }
  });

  it('should have no accessibility violations with hover trigger', async () => {
    const { container } = render(
      <Popover content={<div>Hover content</div>} trigger="hover">
        <button>Hover me</button>
      </Popover>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(
      <Popover content={<div>Disabled popover</div>} disabled>
        <button>Disabled trigger</button>
      </Popover>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Popover content</div>} trigger="click" aria-label="Keyboard test">
        <button>Trigger</button>
      </Popover>
    );

    const trigger = screen.getByRole('button');
    trigger.focus();

    // Open with Enter
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close with Escape
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Open with Space
    await user.keyboard(' ');
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should have proper ARIA attributes', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Test content</div>} trigger="click" aria-label="ARIA test">
        <button>Trigger</button>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('aria-controls');

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'ARIA test');
    });
  });
});
