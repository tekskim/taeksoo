import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  // Spinner variant tests
  describe('spinner variant', () => {
    it('renders with default props', () => {
      render(<Loading />);
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renders with custom text', () => {
      render(<Loading text="Please wait..." />);
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('renders without text when text is empty', () => {
      render(<Loading text="" />);
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });

    it('applies correct size classes for sm', () => {
      const { container } = render(<Loading size="sm" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies correct size classes for lg', () => {
      const { container } = render(<Loading size="lg" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<Loading className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  // Progress variant tests
  describe('progress variant', () => {
    it('renders progress variant', () => {
      render(<Loading variant="progress" text="Downloading" />);
      expect(screen.getByText('Downloading')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(
        <Loading
          variant="progress"
          text="Processing"
          description="Please wait while we process your request"
        />
      );
      expect(screen.getByText('Please wait while we process your request')).toBeInTheDocument();
    });

    it('renders with status text', () => {
      render(<Loading variant="progress" text="Uploading" statusText="50% complete" />);
      expect(screen.getByText('50% complete')).toBeInTheDocument();
    });

    it('clamps progress value to 0-100', () => {
      const { container } = render(<Loading variant="progress" progress={150} />);
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });

    it('clamps negative progress value', () => {
      const { container } = render(<Loading variant="progress" progress={-50} />);
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('renders progress value correctly', () => {
      const { container } = render(<Loading variant="progress" progress={75} />);
      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle({ width: '75%' });
    });
  });

  // Button variant tests
  describe('button variant', () => {
    it('renders button variant', () => {
      render(<Loading variant="button" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('renders with custom button label', () => {
      render(<Loading variant="button" buttonLabel="Submitting" />);
      expect(screen.getByText('Submitting')).toBeInTheDocument();
    });

    it('button is disabled', () => {
      render(<Loading variant="button" />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
