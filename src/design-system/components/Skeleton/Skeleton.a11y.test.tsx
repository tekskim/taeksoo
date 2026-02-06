import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonCard,
  SkeletonTable,
} from './Skeleton';

describe('Skeleton Accessibility', () => {
  it('should have no accessibility violations for text variant', async () => {
    const { container } = render(<Skeleton variant="text" width={200} height={16} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for circular variant', async () => {
    const { container } = render(<Skeleton variant="circular" size={40} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for rectangular variant', async () => {
    const { container } = render(<Skeleton variant="rectangular" width={200} height={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for rounded variant', async () => {
    const { container } = render(<Skeleton variant="rounded" width={200} height={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with multiple count', async () => {
    const { container } = render(<Skeleton variant="text" count={3} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for SkeletonText', async () => {
    const { container } = render(<SkeletonText lines={4} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for SkeletonAvatar', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      const { container } = render(<SkeletonAvatar size={size} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });

  it('should have no accessibility violations for SkeletonButton', async () => {
    const { container } = render(<SkeletonButton size="md" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for SkeletonImage', async () => {
    const { container } = render(<SkeletonImage aspectRatio="16/9" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for SkeletonCard', async () => {
    const { container } = render(<SkeletonCard avatar lines={3} image />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for SkeletonTable', async () => {
    const { container } = render(<SkeletonTable rows={5} columns={4} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with different animations', async () => {
    const animations = ['pulse', 'wave', 'none'] as const;

    for (const animation of animations) {
      const { container } = render(<Skeleton variant="text" animation={animation} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });
});
