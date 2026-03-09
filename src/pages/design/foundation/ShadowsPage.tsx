import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function ShadowsGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <SectionTitle>Shadow tokens</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Token</Th>
              <Th>Usage</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>--shadow-xs</strong>
              </Td>
              <Td>Subtle borders, light elevation</Td>
            </tr>
            <tr>
              <Td>
                <strong>--shadow-sm</strong>
              </Td>
              <Td>Cards, dropdowns, small elevation</Td>
            </tr>
            <tr>
              <Td>
                <strong>--shadow-md</strong>
              </Td>
              <Td>Modals, popovers, medium elevation</Td>
            </tr>
            <tr>
              <Td>
                <strong>--shadow-lg</strong>
              </Td>
              <Td>Drawers, panels, high elevation</Td>
            </tr>
            <tr>
              <Td>
                <strong>--shadow-xl</strong>
              </Td>
              <Td>Maximum elevation, overlays</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <p>
            Use CSS variable <code>var(--shadow-*)</code> for elevation. Prefer tokens over
            hardcoded values for consistency.
          </p>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function ShadowsPage() {
  return (
    <ComponentPageTemplate
      title="Shadows"
      description="Box shadow tokens for elevation and depth"
      guidelines={<ShadowsGuidelines />}
      preview={
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
      }
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
    />
  );
}
