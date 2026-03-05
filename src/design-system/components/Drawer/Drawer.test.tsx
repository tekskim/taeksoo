import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders when open', () => {
    render(
      <Drawer isOpen={true} onClose={() => {}} title="Test Drawer">
        <div>Drawer content</div>
      </Drawer>
    );

    expect(screen.getByText('Test Drawer')).toBeInTheDocument();
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Drawer isOpen={false} onClose={() => {}} title="Test Drawer">
        <div>Drawer content</div>
      </Drawer>
    );

    expect(screen.queryByText('Test Drawer')).not.toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Drawer isOpen={true} onClose={handleClose} title="Test Drawer">
        <div>Drawer content</div>
      </Drawer>
    );

    const backdrop = screen.getByRole('dialog').previousElementSibling as HTMLElement;
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders footer when provided', () => {
    render(
      <Drawer isOpen={true} onClose={() => {}} title="Test Drawer" footer={<button>Save</button>}>
        <div>Drawer content</div>
      </Drawer>
    );

    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('applies custom width', () => {
    render(
      <Drawer isOpen={true} onClose={() => {}} title="Test Drawer" width={500}>
        <div>Drawer content</div>
      </Drawer>
    );

    const drawer = screen.getByRole('dialog');
    expect(drawer).toHaveStyle({ width: '500px' });
  });
});
