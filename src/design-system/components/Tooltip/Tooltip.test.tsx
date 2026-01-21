import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders trigger element', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('does not show tooltip content initially', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Visibility', () => {
    it('shows tooltip on hover after delay', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Tooltip text" delay={200}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      
      vi.advanceTimersByTime(200);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
      });
    });

    it('hides tooltip on mouse leave', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      vi.advanceTimersByTime(0);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      await user.unhover(screen.getByText('Hover me'));
      
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('does not show tooltip when disabled', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Tooltip text" disabled delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      vi.advanceTimersByTime(100);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Focus Behavior', () => {
    it('shows tooltip on focus', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Focus me</button>
        </Tooltip>
      );

      await user.tab();
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('hides tooltip on blur', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Focus me</button>
        </Tooltip>
      );

      await user.tab();
      vi.advanceTimersByTime(0);
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('Delay', () => {
    it('respects custom delay', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Tooltip text" delay={500}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      
      // Should not show after 200ms
      vi.advanceTimersByTime(200);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      
      // Should show after 500ms total
      vi.advanceTimersByTime(300);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('cancels tooltip if mouse leaves before delay', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Tooltip text" delay={500}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      vi.advanceTimersByTime(200);
      await user.unhover(screen.getByText('Hover me'));
      vi.advanceTimersByTime(500);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="tooltip"', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Tooltip text" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover me'));
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('Content', () => {
    it('renders string content', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content="Simple text" delay={0}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(screen.getByText('Simple text')).toBeInTheDocument();
      });
    });

    it('renders JSX content', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Tooltip content={<span data-testid="jsx-content">JSX Content</span>} delay={0}>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByText('Hover'));
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(screen.getByTestId('jsx-content')).toBeInTheDocument();
      });
    });
  });
});
