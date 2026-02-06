import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';

describe('Popover', () => {
  it('renders trigger element', () => {
    render(
      <Popover content={<div>Popover content</div>}>
        <button>Trigger</button>
      </Popover>
    );
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
  });

  it('shows popover on click when trigger is click', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Popover content</div>} trigger="click">
        <button>Click me</button>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Click me' });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });
  });

  it('hides popover on second click', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Popover content</div>} trigger="click">
        <button>Toggle</button>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Toggle' });

    // Open
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes on escape key', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Popover content</div>} trigger="click">
        <button>Trigger</button>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('does not close on escape when closeOnEscape is false', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Popover content</div>} trigger="click" closeOnEscape={false}>
        <button>Trigger</button>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    // Popover should still be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover content={<div>Popover content</div>} trigger="click">
          <button>Trigger</button>
        </Popover>
        <button>Outside button</button>
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Outside button' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('does not show popover when disabled', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Popover content</div>} trigger="click" disabled>
        <button>Trigger</button>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onOpenChange callback', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Popover content={<div>Popover content</div>} trigger="click" onOpenChange={onOpenChange}>
        <button>Trigger</button>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports controlled state', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Popover content={<div>Popover content</div>} trigger="click" isOpen={false}>
        <button>Trigger</button>
      </Popover>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <Popover content={<div>Popover content</div>} trigger="click" isOpen={true}>
        <button>Trigger</button>
      </Popover>
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('renders with different positions', async () => {
    const user = userEvent.setup();
    const positions = ['top', 'bottom', 'left', 'right'] as const;

    for (const position of positions) {
      const { unmount } = render(
        <Popover content={<div>Content</div>} trigger="click" position={position}>
          <button>Trigger</button>
        </Popover>
      );

      await user.click(screen.getByRole('button', { name: 'Trigger' }));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      unmount();
    }
  });

  it('allows interaction with popover content', async () => {
    const onButtonClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Popover
        content={
          <div>
            <button onClick={onButtonClick}>Inner button</button>
          </div>
        }
        trigger="click"
      >
        <button>Trigger</button>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Inner button' }));
    expect(onButtonClick).toHaveBeenCalled();
  });

  it('has correct ARIA attributes', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Content</div>} trigger="click" aria-label="Test popover">
        <button>Trigger</button>
      </Popover>
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Test popover');
    });
  });

  it('can hide arrow', async () => {
    const user = userEvent.setup();
    render(
      <Popover content={<div>Content</div>} trigger="click" showArrow={false}>
        <button>Trigger</button>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Arrow should not be present - check the container doesn't have the arrow element
    const dialog = screen.getByRole('dialog');
    const arrow = dialog.querySelector('.border-l-\\[7px\\]');
    expect(arrow).not.toBeInTheDocument();
  });
});
