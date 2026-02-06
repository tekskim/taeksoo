import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar Accessibility', () => {
  it('should have no accessibility violations for default variant', async () => {
    const { container } = render(<ProgressBar value={50} max={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for quota variant', async () => {
    const { container } = render(
      <ProgressBar variant="quota" value={30} max={100} label="Storage" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with label', async () => {
    const { container } = render(<ProgressBar value={75} max={100} label="Upload Progress" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with newValue', async () => {
    const { container } = render(
      <ProgressBar variant="quota" value={30} newValue={20} max={100} label="CPU" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations in error state', async () => {
    const { container } = render(
      <ProgressBar value={100} max={100} error errorMessage="Quota exceeded" label="Memory" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with statusText', async () => {
    const { container } = render(<ProgressBar value={45} max={100} statusText="Processing..." />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for unlimited (no max)', async () => {
    const { container } = render(<ProgressBar variant="quota" value={50} label="Unlimited" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for different statuses', async () => {
    const statuses = ['success', 'warning', 'danger', 'info', 'neutral'] as const;

    for (const status of statuses) {
      const { container } = render(<ProgressBar value={50} max={100} status={status} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations without showValue', async () => {
    const { container } = render(
      <ProgressBar variant="quota" value={50} max={100} showValue={false} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for different sizes', async () => {
    const sizes = ['sm', 'md'] as const;

    for (const size of sizes) {
      const { container } = render(<ProgressBar value={50} max={100} size={size} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations at 0%', async () => {
    const { container } = render(<ProgressBar value={0} max={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations at 100%', async () => {
    const { container } = render(<ProgressBar value={100} max={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when exceeding max', async () => {
    const { container } = render(<ProgressBar variant="quota" value={120} max={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
