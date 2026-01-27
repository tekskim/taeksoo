import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ConfirmModal } from './Modal';

describe('Modal', () => {
  beforeEach(() => {
    // Reset body overflow
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<Modal isOpen={true} onClose={() => {}} title="Test Modal" />);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<Modal isOpen={false} onClose={() => {}} title="Test Modal" />);
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('renders title', () => {
      render(<Modal isOpen={true} onClose={() => {}} title="Modal Title" />);
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Title" description="Modal description" />
      );
      expect(screen.getByText('Modal description')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Title">
          <div>Custom content</div>
        </Modal>
      );
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });
  });

  describe('Closing Behavior', () => {
    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(<Modal isOpen={true} onClose={handleClose} title="Title" />);

      // Click on backdrop (the container element)
      const backdrop = document.querySelector('.fixed.inset-0');
      if (backdrop) {
        await user.click(backdrop);
      }

      expect(handleClose).toHaveBeenCalled();
    });

    it('does not close on backdrop click when closeOnBackdropClick is false', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Title" closeOnBackdropClick={false} />
      );

      const backdrop = document.querySelector('.fixed.inset-0');
      if (backdrop) {
        await user.click(backdrop);
      }

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape is pressed', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(<Modal isOpen={true} onClose={handleClose} title="Title" />);

      await user.keyboard('{Escape}');

      expect(handleClose).toHaveBeenCalled();
    });

    it('does not close on Escape when closeOnEscape is false', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(<Modal isOpen={true} onClose={handleClose} title="Title" closeOnEscape={false} />);

      await user.keyboard('{Escape}');

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('does not close when clicking inside modal content', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Title">
          <button>Click me</button>
        </Modal>
      );

      await user.click(screen.getByText('Click me'));

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Lock', () => {
    it('prevents body scroll when open', () => {
      render(<Modal isOpen={true} onClose={() => {}} title="Title" />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when closed', async () => {
      const { rerender } = render(<Modal isOpen={true} onClose={() => {}} title="Title" />);
      expect(document.body.style.overflow).toBe('hidden');

      rerender(<Modal isOpen={false} onClose={() => {}} title="Title" />);

      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });
  });
});

describe('ConfirmModal', () => {
  describe('Rendering', () => {
    it('renders confirm and cancel buttons', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Confirm Action"
        />
      );

      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('renders custom button text', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Delete Item"
          confirmText="Delete"
          cancelText="Keep"
        />
      );

      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Keep')).toBeInTheDocument();
    });

    it('renders info box when infoLabel and infoValue are provided', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Delete"
          infoLabel="Item name"
          infoValue="example-item"
        />
      );

      expect(screen.getByText('Item name')).toBeInTheDocument();
      expect(screen.getByText('example-item')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      render(
        <ConfirmModal isOpen={true} onClose={() => {}} onConfirm={handleConfirm} title="Confirm" />
      );

      // Find confirm button (the second button, first is Cancel)
      const buttons = screen.getAllByRole('button');
      const confirmButton = buttons.find((b) => b.textContent === 'Confirm');
      if (confirmButton) {
        await user.click(confirmButton);
      }

      expect(handleConfirm).toHaveBeenCalled();
    });

    it('calls onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <ConfirmModal isOpen={true} onClose={handleClose} onConfirm={() => {}} title="Confirm" />
      );

      await user.click(screen.getByText('Cancel'));

      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('shows "Processing..." when isLoading', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Confirm"
          isLoading={true}
        />
      );

      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('disables buttons when isLoading', () => {
      render(
        <ConfirmModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Confirm"
          isLoading={true}
        />
      );

      expect(screen.getByText('Cancel')).toBeDisabled();
      expect(screen.getByText('Processing...')).toBeDisabled();
    });
  });
});
