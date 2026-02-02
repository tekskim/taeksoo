import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast, ToastProvider, useToast } from './Toast';
import type { ToastData } from './Toast';

// Helper to create toast data
const createToast = (overrides: Partial<ToastData> = {}): ToastData => ({
  id: '1',
  variant: 'info',
  message: 'Test message',
  ...overrides,
});

// Test component to trigger toast
function ToastTrigger() {
  const { success } = useToast();
  return <button onClick={() => success('Test toast')}>Show Toast</button>;
}

describe('Toast', () => {
  it('renders toast message', () => {
    render(<Toast toast={createToast({ message: 'Test message' })} onDismiss={() => {}} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(
      <Toast
        toast={createToast({ id: '1', message: 'Success', variant: 'success' })}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('Success')).toBeInTheDocument();

    rerender(
      <Toast
        toast={createToast({ id: '2', message: 'Error', variant: 'error' })}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('Error')).toBeInTheDocument();

    rerender(
      <Toast
        toast={createToast({ id: '3', message: 'Warning', variant: 'warning' })}
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', async () => {
    vi.useFakeTimers();
    const handleDismiss = vi.fn();
    render(<Toast toast={createToast({ id: '1' })} onDismiss={handleDismiss} />);

    const closeButton = screen.getByRole('button', { name: /닫기/i });
    fireEvent.click(closeButton);

    // Wait for animation timeout
    vi.advanceTimersByTime(200);

    expect(handleDismiss).toHaveBeenCalledWith('1');
    vi.useRealTimers();
  });

  it('renders title when provided', () => {
    render(
      <Toast
        toast={createToast({ title: 'Test Title', message: 'Test message' })}
        onDismiss={() => {}}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});

describe('ToastProvider', () => {
  it('provides toast context', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>
    );

    expect(screen.getByText('Show Toast')).toBeInTheDocument();
  });
});
