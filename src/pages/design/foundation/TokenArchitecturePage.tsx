import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { TokenCard } from '../../design-system-sections/HelperComponents';

export function TokenArchitecturePage() {
  return (
    <ComponentPageTemplate
      title="Token architecture"
      description="3-tier design token structure: Primitive → Semantic → Component"
      preview={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TokenCard
            title="Primitive"
            description="Raw design values"
            items={[
              'Colors (slate, blue, red...)',
              'Spacing (0-32)',
              'Font Size (10-40px)',
              'Radius, Duration, Shadow',
            ]}
            color="var(--color-state-info-bg)"
            textColor="var(--color-state-info-text)"
          />
          <TokenCard
            title="Semantic"
            description="Purpose-driven tokens"
            items={[
              'Typography (heading, body, label)',
              'Color (action, text, surface, border)',
              'Spacing (component, layout)',
              'Radius (field, button, card)',
            ]}
            color="var(--color-state-success-bg)"
            textColor="var(--color-state-success-text)"
          />
          <TokenCard
            title="Component"
            description="Component-specific tokens"
            items={[
              'Button (height, padding, gap)',
              'Input (height, padding, radius)',
              'Badge (padding, radius, dotSize)',
              'Menu (item, section, divider)',
            ]}
            color="var(--color-state-warning-bg)"
            textColor="var(--color-state-warning-text)"
          />
        </div>
      }
      relatedLinks={[
        {
          label: 'Primitive colors',
          path: '/design/foundation/primitive-colors',
          description: 'Core color palette',
        },
        {
          label: 'Semantic colors',
          path: '/design/foundation/semantic-colors',
          description: 'Purpose-driven color tokens',
        },
        {
          label: 'Typography',
          path: '/design/foundation/typography',
          description: 'Typography tokens',
        },
      ]}
    />
  );
}
