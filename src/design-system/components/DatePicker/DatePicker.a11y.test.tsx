import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { DatePicker } from './DatePicker';

describe('DatePicker Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<DatePicker mode="single" onChange={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with selected date', async () => {
    const { container } = render(
      <DatePicker mode="single" value={new Date(2025, 0, 15)} onChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations in range mode', async () => {
    const { container } = render(
      <DatePicker
        mode="range"
        rangeValue={{ start: new Date(2025, 0, 10), end: new Date(2025, 0, 20) }}
        onRangeChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible navigation buttons', () => {
    render(<DatePicker mode="single" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<DatePicker mode="single" disabled onChange={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with event dates', async () => {
    const { container } = render(
      <DatePicker
        mode="single"
        eventDates={[new Date(2025, 0, 15), new Date(2025, 0, 20)]}
        onChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with min/max dates', async () => {
    const { container } = render(
      <DatePicker
        mode="single"
        minDate={new Date(2025, 0, 1)}
        maxDate={new Date(2025, 11, 31)}
        onChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have accessible date buttons', () => {
    render(<DatePicker mode="single" onChange={() => {}} />);
    const dateButtons = screen.getAllByRole('button');
    // Should have navigation buttons plus date buttons
    expect(dateButtons.length).toBeGreaterThan(2);
  });

  it('should have no accessibility violations with Monday start', async () => {
    const { container } = render(
      <DatePicker mode="single" firstDayOfWeek={1} onChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('date buttons should have aria-label with date', () => {
    render(<DatePicker mode="single" onChange={() => {}} />);
    const dateButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.getAttribute('aria-label')?.match(/\d{1,2}\/\d{1,2}\/\d{4}/));
    expect(dateButtons.length).toBeGreaterThan(0);
  });
});
