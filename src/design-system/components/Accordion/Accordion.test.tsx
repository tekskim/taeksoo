import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('renders accordion items', () => {
    render(
      <Accordion.Root>
        <Accordion.Item id="item1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('expands item when trigger is clicked', () => {
    render(
      <Accordion.Root>
        <Accordion.Item id="item1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );

    const trigger = screen.getByText('Section 1');
    fireEvent.click(trigger);

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('supports defaultExpanded for initially expanded item', () => {
    render(
      <Accordion.Root defaultExpanded={['item1']}>
        <Accordion.Item id="item1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('supports controlled expanded', () => {
    const onChange = vi.fn();
    render(
      <Accordion.Root expanded={['item1']} onChange={onChange}>
        <Accordion.Item id="item1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    );

    const trigger = screen.getByText('Section 2');
    fireEvent.click(trigger);

    expect(onChange).toHaveBeenCalled();
  });
});
