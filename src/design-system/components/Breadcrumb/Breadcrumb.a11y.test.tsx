import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { BrowserRouter } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import { IconHome } from '@tabler/icons-react';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Breadcrumb Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = renderWithRouter(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Category' },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have navigation role with proper aria-label', () => {
    renderWithRouter(
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Current Page' }]} />
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('should mark current page with aria-current', () => {
    renderWithRouter(
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Current Page' }]} />
    );
    expect(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page');
  });

  it('should have no accessibility violations with icons', async () => {
    const { container } = renderWithRouter(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/', icon: <IconHome size={14} /> },
          { label: 'Products', href: '/products' },
          { label: 'Item' },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with custom separator', async () => {
    const { container } = renderWithRouter(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Item' },
        ]}
        separator="/"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with maxItems', async () => {
    const { container } = renderWithRouter(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Level 1', href: '/1' },
          { label: 'Level 2', href: '/2' },
          { label: 'Level 3', href: '/3' },
          { label: 'Current' },
        ]}
        maxItems={3}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with onClick handler', async () => {
    const { container } = renderWithRouter(
      <Breadcrumb items={[{ label: 'Home', onClick: () => {} }, { label: 'Current' }]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('separators should be hidden from screen readers', () => {
    renderWithRouter(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Current' }]} />);
    const separators = document.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBeGreaterThan(0);
  });
});
