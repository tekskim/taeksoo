import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label, SpacingSwatch } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function SpacingPage() {
  return (
    <ComponentPageTemplate
      title="Spacing & Radius"
      description="Consistent spacing scale (4px grid) and border radius"
      relatedLinks={[
        {
          label: 'Typography',
          path: '/design/foundation/typography',
          description: 'Mona Sans typography system',
        },
        { label: 'Borders', path: '/design/foundation/borders', description: 'Border tokens' },
        {
          label: 'Primitive colors',
          path: '/design/foundation/primitive-colors',
          description: 'Core color palette',
        },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <VStack gap={4}>
          <Label>Spacing</Label>
          <div className="flex flex-wrap gap-2 items-end">
            {[
              { name: '0', value: '0px' },
              { name: '0.5', value: '2px' },
              { name: '1', value: '4px' },
              { name: '1.5', value: '6px' },
              { name: '2', value: '8px' },
              { name: '2.5', value: '10px' },
              { name: '3', value: '12px' },
              { name: '4', value: '16px' },
              { name: '5', value: '20px' },
              { name: '6', value: '24px' },
              { name: '7', value: '28px' },
              { name: '8', value: '32px' },
              { name: '9', value: '36px' },
              { name: '10', value: '40px' },
              { name: '12', value: '48px' },
              { name: '14', value: '56px' },
              { name: '16', value: '64px' },
              { name: '20', value: '80px' },
              { name: '24', value: '96px' },
              { name: '32', value: '128px' },
            ].map(({ name, value }) => (
              <SpacingSwatch key={name} name={name} value={value} />
            ))}
          </div>
        </VStack>
        <VStack gap={4}>
          <Label>Border radius</Label>
          <div className="flex gap-4 flex-wrap">
            {[
              { name: 'none', value: '0px' },
              { name: 'sm', value: '4px' },
              { name: 'md', value: '6px' },
              { name: 'lg', value: '8px' },
              { name: 'xl', value: '16px' },
              { name: 'full', value: '999px' },
            ].map(({ name, value }) => (
              <VStack key={name} gap={2} align="center">
                <div
                  className="w-12 h-12 bg-[var(--color-action-primary)]"
                  style={{ borderRadius: value }}
                />
                <code className="text-[9px] font-mono text-[var(--color-text-subtle)]">{name}</code>
              </VStack>
            ))}
          </div>
        </VStack>
      </div>
    </ComponentPageTemplate>
  );
}
