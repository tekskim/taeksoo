import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Pagination } from './Pagination';

describe('Pagination Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have navigation role with aria-label', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('should have accessible previous/next buttons', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('should mark current page with aria-current', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />);
    const currentButton = screen.getByRole('button', { name: 'Page 5' });
    expect(currentButton).toHaveAttribute('aria-current', 'page');
  });

  it('should have no accessibility violations on first page', async () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations on last page', async () => {
    const { container } = render(
      <Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should disable previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} disabled />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with settings button', async () => {
    const { container } = render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={() => {}}
        showSettings
        onSettingsClick={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible settings button', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={() => {}}
        showSettings
        onSettingsClick={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Pagination settings' })).toBeInTheDocument();
  });

  it('should have no accessibility violations with totalItems', async () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} totalItems={100} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with selectedCount', async () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
        totalItems={100}
        selectedCount={5}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('page buttons should have proper aria-label', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
  });
});
