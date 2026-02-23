import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function TypographyPage() {
  return (
    <ComponentPageTemplate
      title="Typography"
      description="Mona Sans based typography system (base: 12px)"
      relatedLinks={[
        {
          label: 'Spacing & Radius',
          path: '/design/foundation/spacing',
          description: 'Consistent spacing scale',
        },
        {
          label: 'Primitive colors',
          path: '/design/foundation/primitive-colors',
          description: 'Core color palette',
        },
        { label: 'Borders', path: '/design/foundation/borders', description: 'Border tokens' },
      ]}
    >
      <VStack gap={8}>
        {/* Headings */}
        <VStack gap={4}>
          <Label>Headings</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                    Token
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Size
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                    Line Height
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Weight
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    token: 'h1',
                    size: '40px',
                    lh: '48px',
                    weight: '600',
                    desc: 'Hero / Page title',
                  },
                  {
                    token: 'h2',
                    size: '32px',
                    lh: '40px',
                    weight: '600',
                    desc: 'Section title',
                  },
                  {
                    token: 'h3',
                    size: '24px',
                    lh: '32px',
                    weight: '600',
                    desc: 'Card title',
                  },
                  {
                    token: 'h4',
                    size: '18px',
                    lh: '28px',
                    weight: '600',
                    desc: 'Subsection',
                  },
                  {
                    token: 'h5',
                    size: '16px',
                    lh: '24px',
                    weight: '600',
                    desc: 'Small heading',
                  },
                  {
                    token: 'h6',
                    size: '14px',
                    lh: '20px',
                    weight: '600',
                    desc: 'Label heading',
                  },
                  {
                    token: 'h7',
                    size: '12px',
                    lh: '18px',
                    weight: '600',
                    desc: 'Card section title',
                  },
                ].map(({ token, size, lh, weight, desc, extra }) => (
                  <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 w-[120px]">
                      <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                        heading.{token}
                      </code>
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      {size}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                      {lh}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      {weight}
                    </td>
                    <td className="py-2">
                      <span
                        style={{
                          fontSize: size,
                          lineHeight: lh,
                          fontWeight: Number(weight),
                          ...(extra?.includes('uppercase') && {
                            textTransform: 'uppercase' as const,
                          }),
                          ...(extra?.includes('muted') && {
                            color: 'var(--color-text-muted)',
                          }),
                        }}
                      >
                        {desc}
                      </span>
                      {extra && (
                        <span className="ml-2 text-[10px] text-[var(--color-text-subtle)]">
                          ({extra})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VStack>

        {/* Body */}
        <VStack gap={4}>
          <Label>Body</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                    Token
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Size
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                    Line Height
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Weight
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    token: 'lg',
                    size: '14px',
                    lh: '20px',
                    weight: '400',
                    desc: 'Large body text',
                  },
                  {
                    token: 'md',
                    size: '12px',
                    lh: '18px',
                    weight: '400',
                    desc: 'Default body text',
                  },
                  {
                    token: 'sm',
                    size: '11px',
                    lh: '16px',
                    weight: '400',
                    desc: 'Small body text',
                  },
                  {
                    token: 'xs',
                    size: '10px',
                    lh: '14px',
                    weight: '400',
                    desc: 'Caption text',
                  },
                ].map(({ token, size, lh, weight, desc }) => (
                  <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 w-[120px]">
                      <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                        body.{token}
                      </code>
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      {size}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                      {lh}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      {weight}
                    </td>
                    <td className="py-2">
                      <span
                        style={{
                          fontSize: size,
                          lineHeight: lh,
                          fontWeight: Number(weight),
                        }}
                      >
                        {desc}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VStack>

        {/* Label */}
        <VStack gap={4}>
          <Label>Label</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                    Token
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Size
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                    Line Height
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Weight
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    token: 'lg',
                    size: '13px',
                    lh: '18px',
                    weight: '500',
                    desc: 'Input label',
                  },
                  {
                    token: 'md',
                    size: '12px',
                    lh: '16px',
                    weight: '500',
                    desc: 'Default label',
                  },
                  {
                    token: 'sm',
                    size: '11px',
                    lh: '16px',
                    weight: '500',
                    desc: 'Small label',
                  },
                ].map(({ token, size, lh, weight, desc }) => (
                  <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 w-[120px]">
                      <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                        label.{token}
                      </code>
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      {size}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                      {lh}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      {weight}
                    </td>
                    <td className="py-2">
                      <span
                        style={{
                          fontSize: size,
                          lineHeight: lh,
                          fontWeight: Number(weight),
                        }}
                      >
                        {desc}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VStack>

        {/* Button */}
        <VStack gap={4}>
          <Label>Button</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                    Token
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Size
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                    Line Height
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Weight
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    token: 'lg',
                    size: '14px',
                    lh: '20px',
                    weight: '500',
                    desc: 'Large button',
                  },
                  {
                    token: 'md',
                    size: '12px',
                    lh: '16px',
                    weight: '500',
                    desc: 'Default button',
                  },
                  {
                    token: 'sm',
                    size: '11px',
                    lh: '16px',
                    weight: '500',
                    desc: 'Small button',
                  },
                ].map(({ token, size, lh, weight, desc }) => (
                  <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 w-[120px]">
                      <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                        button.{token}
                      </code>
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      {size}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                      {lh}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      {weight}
                    </td>
                    <td className="py-2">
                      <span
                        style={{
                          fontSize: size,
                          lineHeight: lh,
                          fontWeight: Number(weight),
                        }}
                      >
                        {desc}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VStack>

        {/* Code */}
        <VStack gap={4}>
          <Label>Code</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[120px]">
                    Token
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Size
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[90px]">
                    Line Height
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)] w-[60px]">
                    Font
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    token: 'md',
                    size: '12px',
                    lh: '18px',
                    desc: 'const value = 42;',
                  },
                  {
                    token: 'sm',
                    size: '11px',
                    lh: '16px',
                    desc: 'const value = 42;',
                  },
                ].map(({ token, size, lh, desc }) => (
                  <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 w-[120px]">
                      <code className="text-[var(--color-action-primary)] font-mono text-[10px]">
                        code.{token}
                      </code>
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      {size}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[90px]">
                      {lh}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)] w-[60px]">
                      mono
                    </td>
                    <td className="py-2">
                      <code
                        style={{
                          fontSize: size,
                          lineHeight: lh,
                          fontFamily: "Menlo, 'Fira Code', Consolas, monospace",
                        }}
                      >
                        {desc}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
