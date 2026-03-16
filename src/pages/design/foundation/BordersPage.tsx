import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function BordersPage() {
  return (
    <ComponentPageTemplate
      title="Borders"
      description="Border tokens for colors, widths, and styles"
      preview={
        <VStack gap={4}>
          <Label>Border colors</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'default', token: '--color-border-default', desc: '기본 보더' },
              { name: 'subtle', token: '--color-border-subtle', desc: '미세한 구분선' },
              { name: 'strong', token: '--color-border-strong', desc: '강조 보더' },
              { name: 'focus', token: '--color-border-focus', desc: '포커스 링' },
            ].map(({ name, desc }) => (
              <div key={name} className="flex flex-col gap-2">
                <div
                  className="h-16 rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
                  style={{ border: `2px solid var(--color-border-${name})` }}
                />
                <div>
                  <span className="text-[length:var(--font-size-11)] font-mono text-[var(--color-text-default)]">
                    border-{name}
                  </span>
                  <p className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </VStack>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={4}>
            <Label>Border widths</Label>
            <div className="grid grid-cols-4 gap-4">
              {[
                { name: '0', value: '0px' },
                { name: '1', value: '1px' },
                { name: '2', value: '2px' },
                { name: '4', value: '4px' },
              ].map(({ name, value }) => (
                <div key={name} className="flex flex-col gap-2 items-center">
                  <div
                    className="w-full h-12 rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
                    style={{ border: `${value} solid var(--color-border-strong)` }}
                  />
                  <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-subtle)]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </VStack>

          {/* Border Styles */}
          <VStack gap={4}>
            <Label>Border styles</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['solid', 'dashed', 'dotted', 'none'].map((style) => (
                <div key={style} className="flex flex-col gap-2 items-center">
                  <div
                    className="w-full h-12 rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
                    style={{ border: `2px ${style} var(--color-border-strong)` }}
                  />
                  <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-subtle)]">
                    {style}
                  </span>
                </div>
              ))}
            </div>
          </VStack>

          {/* Border Usage Examples */}
          <VStack gap={4}>
            <Label>Usage examples</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">
                  Card with default border
                </p>
                <span className="font-mono text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">
                  border border-[var(--color-border-default)]
                </span>
              </div>
              <div className="p-4 rounded-[var(--radius-lg)] border-2 border-[var(--color-border-strong)] bg-[var(--color-surface-default)]">
                <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">
                  Card with strong border
                </p>
                <span className="font-mono text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">
                  border-2 border-[var(--color-border-strong)]
                </span>
              </div>
              <div className="p-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">
                  Dashed border (dropzone)
                </p>
                <span className="font-mono text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">
                  border border-dashed
                </span>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      tokens={
        <VStack gap={3}>
          <pre className="text-[length:var(--font-size-11)] p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] overflow-x-auto text-[var(--color-text-muted)]">
            {`/* Border Colors */
--color-border-default   /* 기본 보더 (slate-200 / #333) */
--color-border-subtle    /* 미세한 구분선 (slate-100 / #252525) */
--color-border-strong    /* 강조 보더 (slate-300 / #444) */
--color-border-focus     /* 포커스 링 (blue-500 / blue-400) */

/* Usage */
border: 1px solid var(--color-border-default);
border-color: var(--color-border-strong);
outline: 2px solid var(--color-border-focus);`}
          </pre>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Spacing & Radius',
          path: '/design/foundation/spacing',
          description: 'Consistent spacing scale',
        },
        {
          label: 'Typography',
          path: '/design/foundation/typography',
          description: 'Mona Sans typography system',
        },
        {
          label: 'Semantic colors',
          path: '/design/foundation/semantic-colors',
          description: 'Purpose-driven color tokens',
        },
      ]}
    />
  );
}
