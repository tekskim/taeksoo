import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Disclosure } from './Disclosure';

describe('Disclosure', () => {
  it('renders trigger text', () => {
    render(
      <Disclosure>
        <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
        <Disclosure.Panel>Hidden content</Disclosure.Panel>
      </Disclosure>
    );

    expect(screen.getByText('Click to expand')).toBeInTheDocument();
  });

  it('toggles content visibility on click', () => {
    render(
      <Disclosure>
        <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
        <Disclosure.Panel>Hidden content</Disclosure.Panel>
      </Disclosure>
    );

    // Initially hidden (panel not rendered)
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByText('Click to expand'));
    expect(screen.getByText('Hidden content')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByText('Click to expand'));
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('supports defaultOpen prop', () => {
    render(
      <Disclosure defaultOpen>
        <Disclosure.Trigger>Click to expand</Disclosure.Trigger>
        <Disclosure.Panel>Hidden content</Disclosure.Panel>
      </Disclosure>
    );

    expect(screen.getByText('Hidden content')).toBeInTheDocument();
  });
});
