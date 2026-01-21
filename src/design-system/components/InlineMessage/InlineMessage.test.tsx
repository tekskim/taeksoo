import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InlineMessage } from './InlineMessage';

describe('InlineMessage', () => {
  it('renders with default info variant', () => {
    render(<InlineMessage>Test message</InlineMessage>);
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders success variant', () => {
    const { container } = render(
      <InlineMessage variant="success">Success message</InlineMessage>
    );
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-[var(--inline-message-success-bg)]');
  });

  it('renders warning variant', () => {
    const { container } = render(
      <InlineMessage variant="warning">Warning message</InlineMessage>
    );
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-[var(--inline-message-warning-bg)]');
  });

  it('renders error variant', () => {
    const { container } = render(
      <InlineMessage variant="error">Error message</InlineMessage>
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-[var(--inline-message-error-bg)]');
  });

  it('renders info variant', () => {
    const { container } = render(
      <InlineMessage variant="info">Info message</InlineMessage>
    );
    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-[var(--inline-message-info-bg)]');
  });

  it('hides icon when hideIcon is true', () => {
    const { container } = render(
      <InlineMessage hideIcon>Message without icon</InlineMessage>
    );
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('shows icon by default', () => {
    const { container } = render(
      <InlineMessage>Message with icon</InlineMessage>
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(
      <InlineMessage icon={<span data-testid="custom-icon">★</span>}>
        Message with custom icon
      </InlineMessage>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <InlineMessage className="custom-class">Message</InlineMessage>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes additional props', () => {
    render(
      <InlineMessage data-testid="inline-message" aria-label="Important message">
        Message
      </InlineMessage>
    );
    expect(screen.getByTestId('inline-message')).toBeInTheDocument();
    expect(screen.getByLabelText('Important message')).toBeInTheDocument();
  });
});
