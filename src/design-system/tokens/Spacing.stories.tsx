import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tokens/Spacing',
  parameters: {
    docs: {
      description: {
        component: `
## 간격 토큰

TDS에서 사용하는 간격(spacing) 값입니다.

### 기본 단위
4px 기반 간격 시스템을 사용합니다.

### 사용법
\`\`\`css
padding: var(--spacing-4);
gap: var(--spacing-2);
margin: var(--spacing-6);
\`\`\`

\`\`\`tsx
<div className="p-[var(--spacing-4)] gap-[var(--spacing-2)]">
  ...
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const SpacingSample = ({ name, value }: { name: string; value: string }) => (
  <div className="flex items-center gap-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)]">
    <div className="w-24 shrink-0">
      <div className="font-mono text-body-md">{name}</div>
      <div className="text-body-xs text-[var(--color-text-muted)]">{value}</div>
    </div>
    <div className="bg-[var(--color-action-primary)] h-4" style={{ width: `var(${name})` }} />
  </div>
);

export const SpacingScale: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-2)]">
      <h3 className="text-heading-h7 mb-[var(--primitive-spacing-4)]">Spacing Scale</h3>
      <SpacingSample name="--spacing-1" value="4px" />
      <SpacingSample name="--spacing-2" value="8px" />
      <SpacingSample name="--spacing-3" value="12px" />
      <SpacingSample name="--spacing-4" value="16px" />
      <SpacingSample name="--spacing-5" value="20px" />
      <SpacingSample name="--spacing-6" value="24px" />
      <SpacingSample name="--spacing-8" value="32px" />
      <SpacingSample name="--spacing-10" value="40px" />
      <SpacingSample name="--spacing-12" value="48px" />
      <SpacingSample name="--spacing-16" value="64px" />
    </div>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <h3 className="text-heading-h7">Border Radius</h3>
      <div className="flex flex-wrap gap-[var(--primitive-spacing-4)]">
        {[
          { name: '--radius-sm', value: '4px' },
          { name: '--radius-md', value: '6px' },
          { name: '--radius-lg', value: '8px' },
          { name: '--radius-xl', value: '16px' },
          { name: '--radius-full', value: '9999px' },
        ].map(({ name, value }) => (
          <div key={name} className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
            <div
              className="w-16 h-16 bg-[var(--color-action-primary)]"
              style={{ borderRadius: `var(${name})` }}
            />
            <div className="text-body-xs font-mono">{name}</div>
            <div className="text-body-xs text-[var(--color-text-muted)]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <h3 className="text-heading-h7">Shadows</h3>
      <div className="flex flex-wrap gap-[var(--primitive-spacing-8)] p-[var(--primitive-spacing-8)]">
        {[
          { name: 'shadow-sm', class: 'shadow-sm' },
          { name: 'shadow', class: 'shadow' },
          { name: 'shadow-md', class: 'shadow-md' },
          { name: 'shadow-lg', class: 'shadow-lg' },
          { name: 'shadow-xl', class: 'shadow-xl' },
        ].map(({ name, class: className }) => (
          <div key={name} className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
            <div
              className={`w-24 h-24 bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-lg)] ${className}`}
            />
            <div className="text-body-xs font-mono">{name}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ComponentSpacing: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-6)]">
      <h3 className="text-heading-h7">Common Component Spacing</h3>

      <div>
        <h4 className="text-body-xs text-label-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Button Padding
        </h4>
        <table className="w-full text-body-md">
          <thead>
            <tr className="border-b border-[var(--color-border-default)]">
              <th className="text-left py-[var(--primitive-spacing-2)]">Size</th>
              <th className="text-left py-[var(--primitive-spacing-2)]">Height</th>
              <th className="text-left py-[var(--primitive-spacing-2)]">Padding X</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">sm</td>
              <td className="py-[var(--primitive-spacing-2)]">28px</td>
              <td className="py-[var(--primitive-spacing-2)]">10px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">md</td>
              <td className="py-[var(--primitive-spacing-2)]">32px</td>
              <td className="py-[var(--primitive-spacing-2)]">12px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">lg</td>
              <td className="py-[var(--primitive-spacing-2)]">40px</td>
              <td className="py-[var(--primitive-spacing-2)]">12px</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="text-body-xs text-label-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-2)]">
          Input/Select Width
        </h4>
        <table className="w-full text-body-md">
          <thead>
            <tr className="border-b border-[var(--color-border-default)]">
              <th className="text-left py-[var(--primitive-spacing-2)]">Size</th>
              <th className="text-left py-[var(--primitive-spacing-2)]">Width</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">sm</td>
              <td className="py-[var(--primitive-spacing-2)]">160px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">md</td>
              <td className="py-[var(--primitive-spacing-2)]">240px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)]">lg</td>
              <td className="py-[var(--primitive-spacing-2)]">320px</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
};
