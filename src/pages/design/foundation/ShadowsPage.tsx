import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';

export function ShadowsPage() {
  return (
    <ComponentPageTemplate
      title="Shadows"
      description="Box shadow tokens for elevation and depth"
      relatedLinks={[
        {
          label: 'Token architecture',
          path: '/design/foundation/tokens',
          description: '3-tier token structure',
        },
        {
          label: 'Spacing & Radius',
          path: '/design/foundation/spacing',
          description: 'Layout tokens',
        },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'xs', value: '0 1px 2px 0 rgba(0,0,0,0.05)' },
          {
            name: 'sm',
            value: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
          },
          {
            name: 'md',
            value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
          },
          {
            name: 'lg',
            value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
          },
          {
            name: 'xl',
            value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          },
        ].map(({ name, value }) => (
          <div
            key={name}
            className="flex gap-4 items-center p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]"
          >
            <div
              className="w-24 h-16 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
              style={{ boxShadow: `var(--shadow-${name})` }}
            >
              <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                {name}
              </span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] font-medium font-mono">
                --shadow-{name}
              </div>
              <div className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)] font-mono break-all">
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ComponentPageTemplate>
  );
}
