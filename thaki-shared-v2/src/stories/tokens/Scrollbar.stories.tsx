import type { Meta, StoryObj } from '@storybook/react';
import type { ReactElement } from 'react';

const ScrollbarDemo = () => {
  const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      {/* Vertical scroll */}
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>Vertical Scroll</p>
        <div
          style={{
            height: '200px',
            width: '200px',
            overflow: 'auto',
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            padding: '8px',
          }}
        >
          {items.map(item => (
            <div
              key={item}
              style={{
                padding: '8px',
                borderBottom: '1px solid var(--semantic-color-border)',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal scroll */}
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>
          Horizontal Scroll
        </p>
        <div
          style={{
            width: '200px',
            overflow: 'auto',
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            padding: '8px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
            {items.map(item => (
              <div
                key={item}
                style={{
                  padding: '8px 16px',
                  background: 'var(--semantic-color-surfaceElevated)',
                  borderRadius: 'var(--semantic-radius-sm)',
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Both directions */}
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 600 }}>Both Directions</p>
        <div
          style={{
            height: '200px',
            width: '200px',
            overflow: 'auto',
            border: '1px solid var(--semantic-color-border)',
            borderRadius: 'var(--semantic-radius-md)',
            padding: '8px',
          }}
        >
          <div style={{ width: '400px' }}>
            {items.map(item => (
              <div
                key={item}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid var(--semantic-color-border)',
                  whiteSpace: 'nowrap',
                }}
              >
                {item} - with extra long content that causes horizontal overflow
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof ScrollbarDemo> = {
  title: 'Layout/Scrollbar',
  component: ScrollbarDemo,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ScrollbarDemo>;

export const Default: Story = {};
