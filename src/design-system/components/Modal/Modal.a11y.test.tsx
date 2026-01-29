import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Modal, ConfirmModal } from './Modal';

describe('Modal Accessibility', () => {
  it('should have no accessibility violations when open', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">
        Modal content
      </Modal>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with description', async () => {
    const { container } = render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Modal Title"
        description="This is a description"
      >
        Modal content
      </Modal>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('ConfirmModal Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirm Action"
        description="This action confirms the changes."
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with info box', async () => {
    const { container } = render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Delete Item"
        infoLabel="Item name"
        infoValue="example.txt"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
