import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: {
    docs: {
      description: {
        component: `
## 타이포그래피 토큰

TDS에서 사용하는 폰트 크기와 줄 높이입니다.

### 폰트 패밀리
- **기본**: Mona Sans (Variable)
- **코드**: Menlo, Monaco, monospace

### 사용법
\`\`\`css
font-size: var(--font-size-14);
line-height: var(--line-height-20);
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const TypographySample = ({
  name,
  fontSize,
  lineHeight,
  weight = 'normal',
}: {
  name: string;
  fontSize: string;
  lineHeight: string;
  weight?: string;
}) => (
  <div className="flex items-baseline gap-[var(--primitive-spacing-8)] py-[var(--primitive-spacing-4)] border-b border-[var(--color-border-subtle)]">
    <div className="w-24 shrink-0">
      <div className="text-label-md">{name}</div>
      <div className="text-body-xs text-[var(--color-text-muted)] font-mono">
        {fontSize}/{lineHeight}
      </div>
    </div>
    <div
      style={{
        fontSize: `var(${fontSize})`,
        lineHeight: `var(${lineHeight})`,
        fontWeight: weight === 'bold' ? 600 : 400,
      }}
    >
      The quick brown fox jumps over the lazy dog
    </div>
  </div>
);

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col">
      <h3 className="text-heading-h7 mb-[var(--primitive-spacing-4)]">Headings</h3>
      <TypographySample
        name="H1"
        fontSize="--font-size-40"
        lineHeight="--line-height-48"
        weight="bold"
      />
      <TypographySample
        name="H2"
        fontSize="--font-size-32"
        lineHeight="--line-height-40"
        weight="bold"
      />
      <TypographySample
        name="H3"
        fontSize="--font-size-24"
        lineHeight="--line-height-32"
        weight="bold"
      />
      <TypographySample
        name="H4"
        fontSize="--font-size-18"
        lineHeight="--line-height-28"
        weight="bold"
      />
      <TypographySample
        name="H5"
        fontSize="--font-size-16"
        lineHeight="--line-height-24"
        weight="bold"
      />
      <TypographySample
        name="H6"
        fontSize="--font-size-14"
        lineHeight="--line-height-20"
        weight="bold"
      />
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div className="flex flex-col">
      <h3 className="text-heading-h7 mb-[var(--primitive-spacing-4)]">Body Text</h3>
      <TypographySample name="body.lg" fontSize="--font-size-14" lineHeight="--line-height-20" />
      <TypographySample name="body.md" fontSize="--font-size-12" lineHeight="--line-height-18" />
      <TypographySample name="body.sm" fontSize="--font-size-11" lineHeight="--line-height-16" />
      <TypographySample name="body.xs" fontSize="--font-size-10" lineHeight="--line-height-14" />
    </div>
  ),
};

export const FontSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <h3 className="text-heading-h7">Font Size Variables</h3>
      <table className="w-full text-body-md">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            <th className="text-left py-[var(--primitive-spacing-2)]">Variable</th>
            <th className="text-left py-[var(--primitive-spacing-2)]">Size</th>
            <th className="text-left py-[var(--primitive-spacing-2)]">Example</th>
          </tr>
        </thead>
        <tbody>
          {[
            { var: '--font-size-10', size: '10px' },
            { var: '--font-size-11', size: '11px' },
            { var: '--font-size-12', size: '12px' },
            { var: '--font-size-14', size: '14px' },
            { var: '--font-size-16', size: '16px' },
            { var: '--font-size-18', size: '18px' },
            { var: '--font-size-24', size: '24px' },
            { var: '--font-size-32', size: '32px' },
            { var: '--font-size-40', size: '40px' },
          ].map(({ var: v, size }) => (
            <tr key={v} className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)] font-mono text-body-xs">{v}</td>
              <td className="py-[var(--primitive-spacing-2)]">{size}</td>
              <td className="py-[var(--primitive-spacing-2)]" style={{ fontSize: `var(${v})` }}>
                Aa
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const LineHeights: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--primitive-spacing-4)]">
      <h3 className="text-heading-h7">Line Height Variables</h3>
      <table className="w-full text-body-md">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            <th className="text-left py-[var(--primitive-spacing-2)]">Variable</th>
            <th className="text-left py-[var(--primitive-spacing-2)]">Value</th>
          </tr>
        </thead>
        <tbody>
          {[
            { var: '--line-height-14', value: '14px' },
            { var: '--line-height-16', value: '16px' },
            { var: '--line-height-18', value: '18px' },
            { var: '--line-height-20', value: '20px' },
            { var: '--line-height-24', value: '24px' },
            { var: '--line-height-28', value: '28px' },
            { var: '--line-height-32', value: '32px' },
            { var: '--line-height-40', value: '40px' },
            { var: '--line-height-48', value: '48px' },
          ].map(({ var: v, value }) => (
            <tr key={v} className="border-b border-[var(--color-border-subtle)]">
              <td className="py-[var(--primitive-spacing-2)] font-mono text-body-xs">{v}</td>
              <td className="py-[var(--primitive-spacing-2)]">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
