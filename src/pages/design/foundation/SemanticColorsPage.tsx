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
                darkPrimitive: 'blue500',
                darkHex: '#3b82f6',
              },
              {
                token: 'action.primary-hover',
                cssVar: '--color-action-primary-hover',
                primitive: 'blue700',
                darkPrimitive: 'blue400',
                darkHex: '#60a5fa',
              },
              {
                token: 'action.primary-active',
                cssVar: '--color-action-primary-active',
                primitive: 'blue800',
                darkPrimitive: 'blue300',
                darkHex: '#93c5fd',
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
                darkPrimitive: 'slate50',
                darkHex: '#f8fafc',
              },
              {
                token: 'text.muted',
                cssVar: '--color-text-muted',
                primitive: 'slate600',
                darkPrimitive: 'slate400',
                darkHex: '#94a3b8',
              },
              {
                token: 'text.subtle',
                cssVar: '--color-text-subtle',
                primitive: 'slate500',
                darkPrimitive: 'slate500',
                darkHex: '#64748b',
              },
              {
                token: 'text.disabled',
                cssVar: '--color-text-disabled',
                primitive: 'slate400',
                darkPrimitive: 'slate600',
                darkHex: '#475569',
              },
              {
                token: 'text.inverse',
                cssVar: '--color-text-inverse',
                primitive: 'white',
                darkPrimitive: 'slate900',
                darkHex: '#0f172a',
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
                  darkPrimitive: 'slate900',
                  darkHex: '#0f172a',
                  border: true,
                },
                {
                  token: 'surface.subtle',
                  cssVar: '--color-surface-subtle',
                  primitive: 'slate50',
                  darkPrimitive: 'slate800',
                  darkHex: '#1e293b',
                },
                {
                  token: 'surface.muted',
                  cssVar: '--color-surface-muted',
                  primitive: 'slate100',
                  darkPrimitive: 'slate700',
                  darkHex: '#334155',
                },
                {
                  token: 'surface.inverse',
                  cssVar: '--color-surface-inverse',
                  primitive: 'slate900',
                  darkPrimitive: 'slate600',
                  darkHex: '#475569',
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
                  darkPrimitive: 'slate700',
                  darkHex: '#334155',
                },
                {
                  token: 'border.subtle',
                  cssVar: '--color-border-subtle',
                  primitive: 'slate100',
                  darkPrimitive: 'slate800',
                  darkHex: '#1e293b',
                },
                {
                  token: 'border.strong',
                  cssVar: '--color-border-strong',
                  primitive: 'slate300',
                  darkPrimitive: 'slate600',
                  darkHex: '#475569',
                },
                {
                  token: 'border.focus',
                  cssVar: '--color-border-focus',
                  primitive: 'blue500',
                  darkPrimitive: 'blue400',
                  darkHex: '#60a5fa',
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
                    darkPrimitive: 'blue400',
                    darkHex: '#60a5fa',
                  },
                  {
                    token: 'state.info-bg',
                    cssVar: '--color-state-info-bg',
                    primitive: 'blue50',
                    darkPrimitive: 'blue900',
                    darkHex: '#1e3a8a',
                    border: true,
                  },
                  {
                    token: 'state.info-text',
                    cssVar: '--color-state-info-text',
                    primitive: 'blue800',
                    darkPrimitive: 'blue200',
                    darkHex: '#bfdbfe',
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
                    darkPrimitive: 'green400',
                    darkHex: '#4ade80',
                  },
                  {
                    token: 'state.success-bg',
                    cssVar: '--color-state-success-bg',
                    primitive: 'green50',
                    darkPrimitive: 'green900',
                    darkHex: '#14532d',
                    border: true,
                  },
                  {
                    token: 'state.success-text',
                    cssVar: '--color-state-success-text',
                    primitive: 'green800',
                    darkPrimitive: 'green200',
                    darkHex: '#bbf7d0',
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
                    darkPrimitive: 'orange400',
                    darkHex: '#fb923c',
                  },
                  {
                    token: 'state.warning-bg',
                    cssVar: '--color-state-warning-bg',
                    primitive: 'yellow50',
                    darkPrimitive: 'orange900',
                    darkHex: '#7c2d12',
                    border: true,
                  },
                  {
                    token: 'state.warning-text',
                    cssVar: '--color-state-warning-text',
                    primitive: 'orange800',
                    darkPrimitive: 'orange200',
                    darkHex: '#fed7aa',
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
                    darkPrimitive: 'red400',
                    darkHex: '#f87171',
                  },
                  {
                    token: 'state.danger-bg',
                    cssVar: '--color-state-danger-bg',
                    primitive: 'red50',
                    darkPrimitive: 'red900',
                    darkHex: '#7f1d1d',
                    border: true,
                  },
                  {
                    token: 'state.danger-text',
                    cssVar: '--color-state-danger-text',
                    primitive: 'red800',
                    darkPrimitive: 'red200',
                    darkHex: '#fecaca',
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
