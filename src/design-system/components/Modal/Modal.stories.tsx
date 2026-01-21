import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal, ConfirmModal } from './Modal';
import { Button } from '../Button';
import { Input } from '../Input';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '모달 크기',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: '배경 클릭시 닫기',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Escape 키로 닫기',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Basic Modal
export const Default: Story = {
  render: function DefaultModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Title"
          description="This is a description text that provides more context about the modal."
        >
          <div className="text-sm text-[var(--color-text-default)]">
            Modal content goes here. You can put any content inside the modal.
          </div>
        </Modal>
      </>
    );
  },
};

// Confirm Modal
export const Confirm: Story = {
  render: function ConfirmModalExample() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Confirm Modal</Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            alert('Confirmed!');
            setIsOpen(false);
          }}
          title="Confirm Action"
          description="Are you sure you want to proceed with this action?"
        />
      </>
    );
  },
};

// Delete Confirm Modal
export const DeleteConfirm: Story = {
  render: function DeleteConfirmExample() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Delete Item
        </Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            alert('Deleted!');
            setIsOpen(false);
          }}
          title="Delete Item"
          description="This action cannot be undone. Are you sure you want to delete this item?"
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          infoLabel="Item name"
          infoValue="my-important-file.txt"
        />
      </>
    );
  },
};

// With Form
export const WithForm: Story = {
  render: function FormModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Edit Profile</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Edit Profile"
          description="Update your profile information."
        >
          <div className="flex flex-col gap-4">
            <Input label="Name" placeholder="Enter your name" fullWidth />
            <Input label="Email" type="email" placeholder="Enter your email" fullWidth />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} fullWidth>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert('Saved!');
                  setIsOpen(false);
                }}
                fullWidth
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

// Loading State
export const Loading: Story = {
  render: function LoadingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsOpen(false);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Submit Action</Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => !isLoading && setIsOpen(false)}
          onConfirm={handleConfirm}
          title="Submit"
          description="This will submit the form."
          confirmText="Submit"
          isLoading={isLoading}
        />
      </>
    );
  },
};

// Warning Modal
export const Warning: Story = {
  render: function WarningModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button variant="warning" onClick={() => setIsOpen(true)}>
          Reset Settings
        </Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            alert('Settings reset!');
            setIsOpen(false);
          }}
          title="Reset Settings"
          description="This will reset all settings to their default values. Your current configuration will be lost."
          confirmText="Reset"
          cancelText="Keep Current"
          confirmVariant="warning"
        />
      </>
    );
  },
};

// No Backdrop Close
export const NoBackdropClose: Story = {
  render: function NoBackdropCloseModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Important Notice"
          description="You must click a button to close this modal."
          closeOnBackdropClick={false}
          closeOnEscape={false}
        >
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} fullWidth>
              Got it
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};
