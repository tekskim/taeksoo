import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label, SemanticColorTable } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useDarkMode } from '@/hooks/useDarkMode';

export function SemanticColorsPage() {
  const { isDark: isGlobalDark } = useDarkMode();
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>(
    isGlobalDark ? 'dark' : 'light'
  );
  const isDark = previewTheme === 'dark';

  const themeToggle = (
    <button
      onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
      className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--primitive-radius-sm)] text-body-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] transition-colors"
      aria-label={`Switch to ${previewTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      {previewTheme === 'light' ? (
        <IconMoon size={12} stroke={1.5} />
      ) : (
        <IconSun size={12} stroke={1.5} />
      )}
      <span>{previewTheme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  );

  return (
    <ComponentPageTemplate
      title="Semantic colors"
      description="Purpose-driven color tokens with light/dark theme support. Click token or hex to copy."
      previewActions={themeToggle}
      preview={
        <div
          data-theme={previewTheme}
          className={`p-6 rounded-[var(--primitive-radius-lg)] transition-colors bg-[var(--color-surface-default)] ${isDark ? 'dark' : ''}`}
        >
          <VStack gap={8}>
            {/* Action & Text */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SemanticColorTable
                title="Action"
                isDark={isDark}
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
                isDark={isDark}
                colors={[
                  {
                    token: 'text.default',
                    cssVar: '--color-text-default',
                    primitive: 'slate900',
                    darkPrimitive: 'zinc50',
                    darkHex: '#fafafa',
                  },
                  {
                    token: 'text.muted',
                    cssVar: '--color-text-muted',
                    primitive: 'slate600',
                    darkPrimitive: 'zinc300',
                    darkHex: '#d4d4d8',
                  },
                  {
                    token: 'text.subtle',
                    cssVar: '--color-text-subtle',
                    primitive: 'slate500',
                    darkPrimitive: 'zinc400',
                    darkHex: '#a1a1aa',
                  },
                  {
                    token: 'text.disabled',
                    cssVar: '--color-text-disabled',
                    primitive: 'slate400',
                    darkPrimitive: 'zinc600',
                    darkHex: '#52525b',
                  },
                  {
                    token: 'text.inverse',
                    cssVar: '--color-text-inverse',
                    primitive: 'white',
                    darkPrimitive: 'zinc900',
                    darkHex: '#18181b',
                    border: true,
                  },
                ]}
              />
            </div>

            {/* Surface & Border */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SemanticColorTable
                title="Surface"
                isDark={isDark}
                colors={[
                  {
                    token: 'surface.default',
                    cssVar: '--color-surface-default',
                    primitive: 'white',
                    darkPrimitive: 'zinc900',
                    darkHex: '#18181b',
                    border: true,
                  },
                  {
                    token: 'surface.subtle',
                    cssVar: '--color-surface-subtle',
                    primitive: 'slate50',
                    darkPrimitive: 'zinc800',
                    darkHex: '#27272a',
                  },
                  {
                    token: 'surface.muted',
                    cssVar: '--color-surface-muted',
                    primitive: 'slate100',
                    darkPrimitive: 'zinc700',
                    darkHex: '#3f3f46',
                  },
                  {
                    token: 'surface.inverse',
                    cssVar: '--color-surface-inverse',
                    primitive: 'slate900',
                    darkPrimitive: 'zinc600',
                    darkHex: '#52525b',
                  },
                ]}
              />
              <SemanticColorTable
                title="Border"
                isDark={isDark}
                colors={[
                  {
                    token: 'border.default',
                    cssVar: '--color-border-default',
                    primitive: 'slate200',
                    darkPrimitive: 'zinc700',
                    darkHex: '#3f3f46',
                  },
                  {
                    token: 'border.subtle',
                    cssVar: '--color-border-subtle',
                    primitive: 'slate100',
                    darkPrimitive: 'zinc800',
                    darkHex: '#27272a',
                  },
                  {
                    token: 'border.strong',
                    cssVar: '--color-border-strong',
                    primitive: 'slate300',
                    darkPrimitive: 'zinc600',
                    darkHex: '#52525b',
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
                  isDark={isDark}
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
                  isDark={isDark}
                  colors={[
                    {
                      token: 'state.success',
                      cssVar: '--color-state-success',
                      primitive: 'green500',
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
                      primitive: 'green600',
                      darkPrimitive: 'green200',
                      darkHex: '#bbf7d0',
                    },
                  ]}
                />
                <SemanticColorTable
                  title="Warning"
                  isDark={isDark}
                  colors={[
                    {
                      token: 'state.warning',
                      cssVar: '--color-state-warning',
                      primitive: 'orange500',
                      darkPrimitive: 'orange400',
                      darkHex: '#fb923c',
                    },
                    {
                      token: 'state.warning-bg',
                      cssVar: '--color-state-warning-bg',
                      primitive: 'orange50',
                      darkPrimitive: 'orange900',
                      darkHex: '#7c2d12',
                      border: true,
                    },
                    {
                      token: 'state.warning-text',
                      cssVar: '--color-state-warning-text',
                      primitive: 'orange600',
                      darkPrimitive: 'orange200',
                      darkHex: '#fed7aa',
                    },
                  ]}
                />
                <SemanticColorTable
                  title="Danger"
                  isDark={isDark}
                  colors={[
                    {
                      token: 'state.danger',
                      cssVar: '--color-state-danger',
                      primitive: 'red500',
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
                      primitive: 'red600',
                      darkPrimitive: 'red200',
                      darkHex: '#fecaca',
                    },
                  ]}
                />
              </div>
            </VStack>
          </VStack>
        </div>
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
