import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusIndicator, type StatusType } from './StatusIndicator';

describe('StatusIndicator', () => {
  describe('Rendering', () => {
    it('renders status indicator', () => {
      render(<StatusIndicator status="active" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
      render(<StatusIndicator status="active" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Active');
    });

    it('uses custom label when provided', () => {
      render(<StatusIndicator status="active" label="Running" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Running');
    });
  });

  describe('Status types', () => {
    const statuses: StatusType[] = [
      'active',
      'error',
      'building',
      'deleting',
      'suspended',
      'shelved',
      'shelved-offloaded',
      'mounted',
      'shutoff',
      'paused',
      'pending',
      'draft',
      'verify-resized',
      'deactivated',
      'in-use',
      'maintenance',
      'degraded',
      'no-monitor',
      'down',
    ];

    it.each(statuses)('renders %s status', (status) => {
      render(<StatusIndicator status={status} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Layout variants', () => {
    it('renders icon-only layout by default', () => {
      render(<StatusIndicator status="active" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('rounded-full');
      // Should not contain text label
      expect(indicator).not.toHaveTextContent('Active');
    });

    it('renders default layout with label', () => {
      render(<StatusIndicator status="active" layout="default" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveTextContent('Active');
    });

    it('renders badge layout', () => {
      render(<StatusIndicator status="active" layout="badge" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('rounded-md');
      expect(indicator).toHaveTextContent('Active');
    });
  });

  describe('Size variants (icon-only)', () => {
    it('renders sm size', () => {
      render(<StatusIndicator status="active" size="sm" />);
      expect(screen.getByRole('status')).toHaveClass('size-[20px]');
    });

    it('renders md size (default)', () => {
      render(<StatusIndicator status="active" size="md" />);
      expect(screen.getByRole('status')).toHaveClass('size-[24px]');
    });

    it('renders lg size', () => {
      render(<StatusIndicator status="active" size="lg" />);
      expect(screen.getByRole('status')).toHaveClass('size-[28px]');
    });
  });

  describe('Status colors', () => {
    it('applies success color for active status', () => {
      render(<StatusIndicator status="active" />);
      expect(screen.getByRole('status')).toHaveClass('bg-[var(--status-success-bg)]');
    });

    it('applies danger color for error status', () => {
      render(<StatusIndicator status="error" />);
      expect(screen.getByRole('status')).toHaveClass('bg-[var(--status-danger-bg)]');
    });

    it('applies info color for building status', () => {
      render(<StatusIndicator status="building" />);
      expect(screen.getByRole('status')).toHaveClass('bg-[var(--status-info-bg)]');
    });

    it('applies warning color for verify-resized status', () => {
      render(<StatusIndicator status="verify-resized" />);
      expect(screen.getByRole('status')).toHaveClass('bg-[var(--status-warning-bg)]');
    });

    it('applies muted color for suspended status', () => {
      render(<StatusIndicator status="suspended" />);
      expect(screen.getByRole('status')).toHaveClass('bg-[var(--status-muted-bg)]');
    });
  });

  describe('Default labels', () => {
    it('shows correct label for active', () => {
      render(<StatusIndicator status="active" layout="default" />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('shows correct label for error', () => {
      render(<StatusIndicator status="error" layout="default" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('shows correct label for building', () => {
      render(<StatusIndicator status="building" layout="default" />);
      expect(screen.getByText('Building...')).toBeInTheDocument();
    });

    it('shows correct label for deleting', () => {
      render(<StatusIndicator status="deleting" layout="default" />);
      expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('building status has spin animation', () => {
      const { container } = render(<StatusIndicator status="building" />);
      const icon = container.querySelector('.animate-spin-slow');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      render(<StatusIndicator status="active" className="custom-class" />);
      expect(screen.getByRole('status')).toHaveClass('custom-class');
    });

    it('merges custom className with base styles', () => {
      render(<StatusIndicator status="active" className="mt-2" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveClass('mt-2');
      expect(indicator).toHaveClass('rounded-full'); // base style preserved
    });
  });

  describe('Accessibility', () => {
    it('has role="status"', () => {
      render(<StatusIndicator status="active" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('aria-label matches displayed label for layout="default"', () => {
      render(<StatusIndicator status="active" layout="default" />);
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-label', 'Active');
      expect(indicator).toHaveTextContent('Active');
    });
  });
});
