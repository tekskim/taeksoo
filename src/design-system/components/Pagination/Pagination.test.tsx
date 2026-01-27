import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination with page numbers', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('calls onPageChange when clicking next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    const nextButton = screen.getByLabelText('Next page');
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking previous', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

    const prevButton = screen.getByLabelText('Previous page');
    await user.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />);
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when clicking a page number', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    const page3 = screen.getByText('3');
    await user.click(page3);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('highlights current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('renders total items when provided', () => {
    render(<Pagination {...defaultProps} totalItems={100} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('renders selected count when provided', () => {
    render(<Pagination {...defaultProps} totalItems={100} selectedCount={5} />);
    expect(screen.getByText(/5 selected/)).toBeInTheDocument();
  });

  it('shows settings button when showSettings is true', () => {
    render(<Pagination {...defaultProps} showSettings />);
    expect(screen.getByLabelText('Pagination settings')).toBeInTheDocument();
  });

  it('calls onSettingsClick when settings button is clicked', async () => {
    const user = userEvent.setup();
    const onSettingsClick = vi.fn();
    render(<Pagination {...defaultProps} showSettings onSettingsClick={onSettingsClick} />);

    await user.click(screen.getByLabelText('Pagination settings'));
    expect(onSettingsClick).toHaveBeenCalled();
  });

  it('disables all buttons when disabled is true', () => {
    render(<Pagination {...defaultProps} currentPage={5} disabled />);

    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('shows ellipsis for many pages', () => {
    render(<Pagination {...defaultProps} totalPages={20} currentPage={10} />);
    // Should show ellipsis between page groups (using middle dots ···)
    expect(screen.getAllByText('···').length).toBeGreaterThan(0);
  });

  it('renders with few pages without ellipsis', () => {
    render(<Pagination {...defaultProps} totalPages={3} />);
    expect(screen.queryByText('···')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Pagination {...defaultProps} className="custom-pagination" />);
    expect(container.firstChild).toHaveClass('custom-pagination');
  });
});
