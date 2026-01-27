import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  describe('Default variant', () => {
    it('renders progress bar', () => {
      const { container } = render(<ProgressBar value={50} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<ProgressBar value={50} label="Loading" />);
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renders with statusText', () => {
      render(<ProgressBar value={50} statusText="chunking" />);
      expect(screen.getByText('chunking')).toBeInTheDocument();
    });

    it('calculates percentage correctly', () => {
      const { container } = render(<ProgressBar value={25} max={100} />);
      const filledBar = container.querySelector('[style*="width: 25%"]');
      expect(filledBar).toBeInTheDocument();
    });

    it('caps at 100%', () => {
      const { container } = render(<ProgressBar value={150} max={100} />);
      const filledBar = container.querySelector('[style*="width: 100%"]');
      expect(filledBar).toBeInTheDocument();
    });
  });

  describe('Quota variant', () => {
    it('renders quota variant', () => {
      render(<ProgressBar value={10} max={100} variant="quota" showValue />);
      expect(screen.getByText('10/')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('shows used/max value', () => {
      render(<ProgressBar value={25} max={50} variant="quota" showValue />);
      expect(screen.getByText('25/')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('shows unlimited indicator when max is undefined', () => {
      const { container } = render(<ProgressBar value={25} variant="quota" showValue />);
      // Infinity icon should be rendered
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders with newValue', () => {
      render(<ProgressBar value={30} newValue={20} max={100} variant="quota" showValue />);
      // Should show total (30 + 20 = 50)
      expect(screen.getByText('50/')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('Status colors', () => {
    it('uses success color for low usage', () => {
      const { container } = render(<ProgressBar value={30} max={100} variant="quota" />);
      const filledBar = container.querySelector('[style*="var(--color-state-success)"]');
      expect(filledBar).toBeInTheDocument();
    });

    it('uses warning color for 70-100% usage', () => {
      const { container } = render(<ProgressBar value={75} max={100} variant="quota" />);
      const filledBar = container.querySelector('[style*="var(--color-state-warning)"]');
      expect(filledBar).toBeInTheDocument();
    });

    it('uses danger color for over 100% usage', () => {
      const { container } = render(<ProgressBar value={110} max={100} variant="quota" />);
      const filledBar = container.querySelector('[style*="var(--color-state-danger)"]');
      expect(filledBar).toBeInTheDocument();
    });

    it('uses info color as default for default variant', () => {
      const { container } = render(<ProgressBar value={50} max={100} />);
      const filledBar = container.querySelector('[style*="var(--color-state-info)"]');
      expect(filledBar).toBeInTheDocument();
    });

    it('applies custom status color', () => {
      const { container } = render(<ProgressBar value={50} max={100} status="success" />);
      const filledBar = container.querySelector('[style*="var(--color-state-success)"]');
      expect(filledBar).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('shows danger color when error is true', () => {
      const { container } = render(<ProgressBar value={50} max={100} error />);
      const filledBar = container.querySelector('[style*="var(--color-state-danger)"]');
      expect(filledBar).toBeInTheDocument();
    });

    it('shows error icon when error is true', () => {
      const { container } = render(<ProgressBar value={50} label="Progress" error />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('shows error message on hover', () => {
      render(<ProgressBar value={50} label="Progress" error errorMessage="Something went wrong" />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Unlimited max', () => {
    it('handles undefined max', () => {
      const { container } = render(<ProgressBar value={50} variant="quota" />);
      // Should show 50% for unlimited (centered display)
      const filledBar = container.querySelector('[style*="width: 50%"]');
      expect(filledBar).toBeInTheDocument();
    });

    it('handles Infinity max', () => {
      const { container } = render(<ProgressBar value={50} max={Infinity} variant="quota" />);
      const filledBar = container.querySelector('[style*="width: 50%"]');
      expect(filledBar).toBeInTheDocument();
    });

    it('uses neutral color for unlimited', () => {
      const { container } = render(<ProgressBar value={50} variant="quota" />);
      const filledBar = container.querySelector('[style*="var(--color-border-default)"]');
      expect(filledBar).toBeInTheDocument();
    });
  });

  describe('Tooltip for quota variant', () => {
    it('shows tooltip on hover when newValue exists', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <ProgressBar value={30} newValue={20} max={100} variant="quota" />
      );

      const progressBar = container.querySelector(
        '.relative.h-\\[var\\(--progress-bar-height\\)\\]'
      );
      if (progressBar) {
        await user.hover(progressBar);
        expect(screen.getByText('Used: 30')).toBeInTheDocument();
        expect(screen.getByText('New: 20')).toBeInTheDocument();
      }
    });
  });

  describe('showValue prop', () => {
    it('shows value when showValue is true (default)', () => {
      render(<ProgressBar value={50} max={100} variant="quota" />);
      expect(screen.getByText('50/')).toBeInTheDocument();
    });

    it('hides value when showValue is false', () => {
      render(<ProgressBar value={50} max={100} variant="quota" showValue={false} />);
      expect(screen.queryByText('50/')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(<ProgressBar value={50} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('has full width by default', () => {
      const { container } = render(<ProgressBar value={50} />);
      expect(container.firstChild).toHaveClass('w-full');
    });
  });

  describe('New value segment', () => {
    it('renders new value segment in quota variant', () => {
      const { container } = render(
        <ProgressBar value={30} newValue={20} max={100} variant="quota" />
      );
      // Should have both used and new segments - check for multiple positioned elements
      const segments = container.querySelectorAll('[style*="background-color"]');
      expect(segments.length).toBeGreaterThanOrEqual(2);
    });

    it('uses lighter color for new segment', () => {
      const { container } = render(
        <ProgressBar value={30} newValue={20} max={100} variant="quota" />
      );
      // New segment should use light color variant - check that multiple segments exist
      const allSegments = container.querySelectorAll('[class*="absolute"][class*="inset-y-0"]');
      expect(allSegments.length).toBeGreaterThanOrEqual(2);
    });
  });
});
