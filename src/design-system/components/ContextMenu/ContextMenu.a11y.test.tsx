import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { ContextMenu, type ContextMenuItem } from './ContextMenu';

describe('ContextMenu Accessibility', () => {
  const basicItems: ContextMenuItem[] = [
    { id: 'edit', label: 'Edit', onClick: () => {} },
    { id: 'duplicate', label: 'Duplicate', onClick: () => {} },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
  ];

  it('should have no accessibility violations in closed state', async () => {
    const { container } = render(
      <ContextMenu items={basicItems} trigger="click">
        <button>Open Menu</button>
      </ContextMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ContextMenu items={basicItems} trigger="click">
        <button>Open Menu</button>
      </ContextMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with disabled items', async () => {
    const items: ContextMenuItem[] = [
      { id: 'edit', label: 'Edit', onClick: () => {} },
      { id: 'delete', label: 'Delete', disabled: true, onClick: () => {} },
    ];

    const user = userEvent.setup();
    const { container } = render(
      <ContextMenu items={items} trigger="click">
        <button>Open Menu</button>
      </ContextMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with dividers', async () => {
    const items: ContextMenuItem[] = [
      { id: 'edit', label: 'Edit', onClick: () => {}, divider: true },
      { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
    ];

    const user = userEvent.setup();
    const { container } = render(
      <ContextMenu items={items} trigger="click">
        <button>Open Menu</button>
      </ContextMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with icons', async () => {
    const items: ContextMenuItem[] = [
      {
        id: 'edit',
        label: 'Edit',
        icon: <span>✏️</span>,
        onClick: () => {},
      },
    ];

    const user = userEvent.setup();
    const { container } = render(
      <ContextMenu items={items} trigger="click">
        <button>Open Menu</button>
      </ContextMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should close on Escape key', async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu items={basicItems} trigger="click">
        <button>Open Menu</button>
      </ContextMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  it('should have no accessibility violations with contextmenu trigger', async () => {
    const { container } = render(
      <ContextMenu items={basicItems} trigger="contextmenu">
        <div>Right-click area</div>
      </ContextMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(
      <ContextMenu items={basicItems} trigger="click" disabled>
        <button>Disabled Menu</button>
      </ContextMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
