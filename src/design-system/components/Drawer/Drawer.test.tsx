import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Test Drawer">
          Content
        </Drawer>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(
        <Drawer isOpen={false} onClose={() => {}} title="Test Drawer">
          Content
        </Drawer>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders title', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Drawer Title">
          Content
        </Drawer>
      );
      expect(screen.getByText('Drawer Title')).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title">
          <div>Custom content</div>
        </Drawer>
      );
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title" footer={<button>Save</button>}>
          Content
        </Drawer>
      );
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('renders close button by default', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title">
          Content
        </Drawer>
      );
      expect(screen.getByLabelText('Close drawer')).toBeInTheDocument();
    });

    it('hides close button when showCloseButton is false', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title" showCloseButton={false}>
          Content
        </Drawer>
      );
      expect(screen.queryByLabelText('Close drawer')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Drawer isOpen={true} onClose={handleClose} title="Title">
          Content
        </Drawer>
      );

      await user.click(screen.getByLabelText('Close drawer'));

      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Closing Behavior', () => {
    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Drawer isOpen={true} onClose={handleClose} title="Title">
          Content
        </Drawer>
      );

      // Click on backdrop
      const backdrop = document.querySelector('.fixed.inset-0.z-50');
      if (backdrop) {
        await user.click(backdrop);
      }

      expect(handleClose).toHaveBeenCalled();
    });

    it('does not close on backdrop click when closeOnBackdropClick is false', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Drawer isOpen={true} onClose={handleClose} title="Title" closeOnBackdropClick={false}>
          Content
        </Drawer>
      );

      const backdrop = document.querySelector('.fixed.inset-0.z-50');
      if (backdrop) {
        await user.click(backdrop);
      }

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape is pressed', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Drawer isOpen={true} onClose={handleClose} title="Title">
          Content
        </Drawer>
      );

      await user.keyboard('{Escape}');

      expect(handleClose).toHaveBeenCalled();
    });

    it('does not close on Escape when closeOnEscape is false', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Drawer isOpen={true} onClose={handleClose} title="Title" closeOnEscape={false}>
          Content
        </Drawer>
      );

      await user.keyboard('{Escape}');

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Side Position', () => {
    it('positions on right by default', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title">
          Content
        </Drawer>
      );

      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('right-0');
    });

    it('positions on left when side="left"', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title" side="left">
          Content
        </Drawer>
      );

      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveClass('left-0');
    });
  });

  describe('Width', () => {
    it('applies default width', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title">
          Content
        </Drawer>
      );

      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveStyle({ width: '320px' });
    });

    it('applies custom width as number', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title" width={400}>
          Content
        </Drawer>
      );

      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveStyle({ width: '400px' });
    });

    it('applies custom width as string', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title" width="50%">
          Content
        </Drawer>
      );

      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveStyle({ width: '50%' });
    });
  });

  describe('Body Scroll Lock', () => {
    it('prevents body scroll when open', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title">
          Content
        </Drawer>
      );
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when closed', async () => {
      const { rerender } = render(
        <Drawer isOpen={true} onClose={() => {}} title="Title">
          Content
        </Drawer>
      );
      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Drawer isOpen={false} onClose={() => {}} title="Title">
          Content
        </Drawer>
      );

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });
  });

  describe('Accessibility', () => {
    it('has role="dialog"', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title">
          Content
        </Drawer>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal="true"', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Title">
          Content
        </Drawer>
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby when title is provided', () => {
      render(
        <Drawer isOpen={true} onClose={() => {}} title="Drawer Title">
          Content
        </Drawer>
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'drawer-title');
      expect(screen.getByText('Drawer Title')).toHaveAttribute('id', 'drawer-title');
    });
  });
});
