import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label, SemanticColorTable } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function SemanticColorsPage() {
  return (
    <ComponentPageTemplate
      title="Semantic colors"
      description="Purpose-driven color tokens with light/dark theme support. Click token or hex to copy."
      preview={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SemanticColorTable
            title="Action"
            colors={[
              {
                token: 'action.primary',
                cssVar: '--color-action-primary',
                primitive: 'blue600',
              },
              {
                token: 'action.primary-hover',
                cssVar: '--color-action-primary-hover',
                primitive: 'blue700',
              },
              {
                token: 'action.primary-active',
                cssVar: '--color-action-primary-active',
                primitive: 'blue800',
              },
            ]}
          />
          <SemanticColorTable
            title="Text"
            colors={[
              {
                token: 'text.default',
                cssVar: '--color-text-default',
                primitive: 'slate900',
              },
              {
                token: 'text.muted',
                cssVar: '--color-text-muted',
                primitive: 'slate600',
              },
              {
                token: 'text.subtle',
                cssVar: '--color-text-subtle',
                primitive: 'slate500',
              },
              {
                token: 'text.disabled',
                cssVar: '--color-text-disabled',
                primitive: 'slate400',
              },
              {
                token: 'text.inverse',
                cssVar: '--color-text-inverse',
                primitive: 'white',
                border: true,
              },
            ]}
          />
        </div>
      }
      examples={
        <VStack gap={8}>
          {/* Surface & Border */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SemanticColorTable
              title="Surface"
              colors={[
                {
                  token: 'surface.default',
                  cssVar: '--color-surface-default',
                  primitive: 'white',
                  border: true,
                },
                {
                  token: 'surface.subtle',
                  cssVar: '--color-surface-subtle',
                  primitive: 'slate50',
                  border: true,
                },
                {
                  token: 'surface.muted',
                  cssVar: '--color-surface-muted',
                  primitive: 'slate100',
                },
                {
                  token: 'surface.inverse',
                  cssVar: '--color-surface-inverse',
                  primitive: 'slate900',
                },
              ]}
            />
            <SemanticColorTable
              title="Border"
              colors={[
                {
                  token: 'border.default',
                  cssVar: '--color-border-default',
                  primitive: 'slate200',
                },
                {
                  token: 'border.subtle',
                  cssVar: '--color-border-subtle',
                  primitive: 'slate100',
                },
                {
                  token: 'border.strong',
                  cssVar: '--color-border-strong',
                  primitive: 'slate300',
                },
                {
                  token: 'border.focus',
                  cssVar: '--color-border-focus',
                  primitive: 'blue500',
                },
              ]}
            />
          </div>

          {/* State Colors */}
          <VStack gap={4}>
            <Label>State</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SemanticColorTable
                title="Info"
                colors={[
                  {
                    token: 'state.info',
                    cssVar: '--color-state-info',
                    primitive: 'blue600',
                  },
                  {
                    token: 'state.info-bg',
                    cssVar: '--color-state-info-bg',
                    primitive: 'blue50',
                    border: true,
                  },
                  {
                    token: 'state.info-text',
                    cssVar: '--color-state-info-text',
                    primitive: 'blue800',
                  },
                ]}
              />
              <SemanticColorTable
                title="Success"
                colors={[
                  {
                    token: 'state.success',
                    cssVar: '--color-state-success',
                    primitive: 'green600',
                  },
                  {
                    token: 'state.success-bg',
                    cssVar: '--color-state-success-bg',
                    primitive: 'green50',
                    border: true,
                  },
                  {
                    token: 'state.success-text',
                    cssVar: '--color-state-success-text',
                    primitive: 'green800',
                  },
                ]}
              />
              <SemanticColorTable
                title="Warning"
                colors={[
                  {
                    token: 'state.warning',
                    cssVar: '--color-state-warning',
                    primitive: 'orange600',
                  },
                  {
                    token: 'state.warning-bg',
                    cssVar: '--color-state-warning-bg',
                    primitive: 'yellow50',
                    border: true,
                  },
                  {
                    token: 'state.warning-text',
                    cssVar: '--color-state-warning-text',
                    primitive: 'orange800',
                  },
                ]}
              />
              <SemanticColorTable
                title="Danger"
                colors={[
                  {
                    token: 'state.danger',
                    cssVar: '--color-state-danger',
                    primitive: 'red600',
                  },
                  {
                    token: 'state.danger-bg',
                    cssVar: '--color-state-danger-bg',
                    primitive: 'red50',
                    border: true,
                  },
                  {
                    token: 'state.danger-text',
                    cssVar: '--color-state-danger-text',
                    primitive: 'red800',
                  },
                ]}
              />
            </div>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Token architecture',
          path: '/design/foundation/tokens',
          description: '3-tier token structure',
        },
        {
          label: 'Primitive colors',
          path: '/design/foundation/primitive-colors',
          description: 'Core color palette',
        },
      ]}
    />
  );
}
