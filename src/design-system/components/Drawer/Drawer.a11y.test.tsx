import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Drawer } from './Drawer';

describe('Drawer Accessibility', () => {
  it('should have no accessibility violations when open', async () => {
    const { container } = render(
      <Drawer isOpen={true} onClose={() => {}} title="Settings">
        <p>Drawer content goes here</p>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations with footer', async () => {
    const { container } = render(
      <Drawer
        isOpen={true}
        onClose={() => {}}
        title="Edit Profile"
        footer={
          <div>
            <button>Cancel</button>
            <button>Save</button>
          </div>
        }
      >
        <p>Form content</p>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations on left side', async () => {
    const { container } = render(
      <Drawer isOpen={true} onClose={() => {}} title="Navigation" side="left">
        <nav>Navigation menu</nav>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
