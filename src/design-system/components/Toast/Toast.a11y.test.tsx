import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Toast, ToastProvider, ToastContainer } from './Toast';

describe('Toast Accessibility', () => {
  it('should have no accessibility violations for success toast', async () => {
    const { container } = render(
      <Toast
        toast={{
          id: 'test-1',
          variant: 'success',
          message: 'Operation completed successfully',
        }}
        onDismiss={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for error toast', async () => {
    const { container } = render(
      <Toast
        toast={{
          id: 'test-2',
          variant: 'error',
          message: 'An error occurred',
          title: 'Error',
        }}
        onDismiss={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for warning toast', async () => {
    const { container } = render(
      <Toast
        toast={{
          id: 'test-3',
          variant: 'warning',
          message: 'Please review your changes',
        }}
        onDismiss={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for info toast', async () => {
    const { container } = render(
      <Toast
        toast={{
          id: 'test-4',
          variant: 'info',
          message: 'New update available',
        }}
        onDismiss={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have role="alert" for toast notifications', () => {
    render(
      <Toast
        toast={{
          id: 'test-5',
          variant: 'success',
          message: 'Test message',
        }}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should have no accessibility violations with action button', async () => {
    const { container } = render(
      <Toast
        toast={{
          id: 'test-6',
          variant: 'info',
          message: 'New update available',
          action: {
            label: 'View',
            onClick: () => {},
          },
        }}
        onDismiss={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with link', async () => {
    const { container } = render(
      <Toast
        toast={{
          id: 'test-7',
          variant: 'success',
          message: 'Resource created',
          link: {
            label: 'View resource',
            href: '/resource/123',
          },
        }}
        onDismiss={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible close button', () => {
    render(
      <Toast
        toast={{
          id: 'test-8',
          variant: 'success',
          message: 'Test message',
          dismissible: true,
        }}
        onDismiss={() => {}}
      />
    );
    const closeButton = screen.getByRole('button', { name: /닫기/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should have no accessibility violations for ToastContainer', async () => {
    const { container } = render(
      <ToastProvider>
        <ToastContainer position="top-right" />
      </ToastProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
