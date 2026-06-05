import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { StatusIndicator, type StatusType } from './StatusIndicator';

describe('StatusIndicator Accessibility', () => {
  const statusTypes: StatusType[] = [
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

  it('should have no accessibility violations for all status types', async () => {
    for (const status of statusTypes) {
      const { container } = render(<StatusIndicator status={status} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have role="status"', () => {
    render(<StatusIndicator status="active" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have aria-label with status text', () => {
    render(<StatusIndicator status="active" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Active');
  });

  it('should have no accessibility violations for icon-only layout', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      const { container } = render(
        <StatusIndicator status="active" layout="icon-only" size={size} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations for default layout', async () => {
    const { container } = render(<StatusIndicator status="active" layout="default" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for badge layout', async () => {
    const { container } = render(<StatusIndicator status="error" layout="badge" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with custom label', async () => {
    const { container } = render(<StatusIndicator status="active" label="Custom Status" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should use custom label in aria-label', () => {
    render(<StatusIndicator status="active" label="Custom Status" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Custom Status');
  });
});
