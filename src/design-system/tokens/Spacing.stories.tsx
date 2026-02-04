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
  <div className="flex items-center gap-4 py-2">
    <div className="w-24 shrink-0">
      <div className="font-mono text-sm">{name}</div>
      <div className="text-xs text-[var(--color-text-muted)]">{value}</div>
    </div>
    <div className="bg-[var(--color-action-primary)] h-4" style={{ width: `var(${name})` }} />
  </div>
);

export const SpacingScale: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold mb-4">Spacing Scale</h3>
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
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Border Radius</h3>
      <div className="flex flex-wrap gap-4">
        {[
          { name: '--radius-sm', value: '4px' },
          { name: '--radius-md', value: '6px' },
          { name: '--radius-lg', value: '8px' },
          { name: '--radius-xl', value: '16px' },
          { name: '--radius-full', value: '9999px' },
        ].map(({ name, value }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 bg-[var(--color-action-primary)]"
              style={{ borderRadius: `var(${name})` }}
            />
            <div className="text-xs font-mono">{name}</div>
            <div className="text-xs text-[var(--color-text-muted)]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Shadows</h3>
      <div className="flex flex-wrap gap-8 p-8">
        {[
          { name: 'shadow-sm', class: 'shadow-sm' },
          { name: 'shadow', class: 'shadow' },
          { name: 'shadow-md', class: 'shadow-md' },
          { name: 'shadow-lg', class: 'shadow-lg' },
          { name: 'shadow-xl', class: 'shadow-xl' },
        ].map(({ name, class: className }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div
              className={`w-24 h-24 bg-[var(--color-surface-default)] rounded-lg ${className}`}
            />
            <div className="text-xs font-mono">{name}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ComponentSpacing: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-semibold">Common Component Spacing</h3>

      <div>
        <h4 className="text-xs font-medium text-[var(--color-text-muted)] mb-2">Button Padding</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border-default)]">
              <th className="text-left py-2">Size</th>
              <th className="text-left py-2">Height</th>
              <th className="text-left py-2">Padding X</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-2">sm</td>
              <td className="py-2">28px</td>
              <td className="py-2">10px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-2">md</td>
              <td className="py-2">32px</td>
              <td className="py-2">12px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-2">lg</td>
              <td className="py-2">40px</td>
              <td className="py-2">12px</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
          Input/Select Width
        </h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border-default)]">
              <th className="text-left py-2">Size</th>
              <th className="text-left py-2">Width</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-2">sm</td>
              <td className="py-2">160px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-2">md</td>
              <td className="py-2">240px</td>
            </tr>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <td className="py-2">lg</td>
              <td className="py-2">320px</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
};
