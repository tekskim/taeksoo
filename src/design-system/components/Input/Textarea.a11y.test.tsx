import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Textarea } from './Textarea';

describe('Textarea Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Textarea aria-label="Description" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with label', async () => {
    const { container } = render(<Textarea label="Description" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with required', async () => {
    const { container } = render(<Textarea label="Description" required />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with helperText', async () => {
    const { container } = render(
      <Textarea aria-label="Description" helperText="Enter a detailed description" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with error', async () => {
    const { container } = render(
      <Textarea aria-label="Description" error="Description is required" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have aria-invalid when error is present', () => {
    render(<Textarea aria-label="Description" error="Error message" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Textarea aria-label="Description" disabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations when readonly', async () => {
    const { container } = render(
      <Textarea aria-label="Description" readOnly value="Read only content" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with maxLength and showCount', async () => {
    const { container } = render(<Textarea aria-label="Description" maxLength={200} showCount />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations for code variant', async () => {
    const { container } = render(<Textarea aria-label="Code" variant="code" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with autoResize', async () => {
    const { container } = render(
      <Textarea aria-label="Description" autoResize minRows={3} maxRows={10} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have aria-describedby for helper/error text', () => {
    render(<Textarea id="desc-input" aria-label="Description" helperText="Help text" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-describedby', 'desc-input-helper');
  });
});
