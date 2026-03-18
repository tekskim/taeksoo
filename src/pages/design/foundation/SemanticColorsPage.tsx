import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label, SemanticColorTable } from '../../design-system-sections/HelperComponents';
import type { SemanticColor } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export const actionColors: SemanticColor[] = [
  {
    token: 'action.primary',
    cssVar: '--color-action-primary',
    lightHex: '#2563EB',
    darkHex: '#3B82F6',
    lightPrimitive: 'blue600',
    darkPrimitive: 'blue500',
  },
  {
    token: 'action.primary-hover',
    cssVar: '--color-action-primary-hover',
    lightHex: '#1D4ED8',
    darkHex: '#60A5FA',
    lightPrimitive: 'blue700',
    darkPrimitive: 'blue400',
  },
  {
    token: 'action.primary-active',
    cssVar: '--color-action-primary-active',
    lightHex: '#1E40AF',
    darkHex: '#93C5FD',
    lightPrimitive: 'blue800',
    darkPrimitive: 'blue300',
  },
];

export const textColors: SemanticColor[] = [
  {
    token: 'text.default',
    cssVar: '--color-text-default',
    lightHex: '#0F172A',
    darkHex: '#EBEBEB',
    lightPrimitive: 'slate900',
    darkPrimitive: 'custom',
  },
  {
    token: 'text.muted',
    cssVar: '--color-text-muted',
    lightHex: '#475569',
    darkHex: '#A0A0A0',
    lightPrimitive: 'slate600',
    darkPrimitive: 'custom',
  },
  {
    token: 'text.subtle',
    cssVar: '--color-text-subtle',
    lightHex: '#64748B',
    darkHex: '#7A7A7A',
    lightPrimitive: 'slate500',
    darkPrimitive: 'custom',
  },
  {
    token: 'text.disabled',
    cssVar: '--color-text-disabled',
    lightHex: '#94A3B8',
    darkHex: '#4A4A4A',
    lightPrimitive: 'slate400',
    darkPrimitive: 'custom',
  },
  {
    token: 'text.inverse',
    cssVar: '--color-text-inverse',
    lightHex: '#FFFFFF',
    darkHex: '#0D0D0D',
    lightPrimitive: 'white',
    darkPrimitive: 'custom',
    border: true,
  },
];

export const surfaceColors: SemanticColor[] = [
  {
    token: 'surface.default',
    cssVar: '--color-surface-default',
    lightHex: '#FFFFFF',
    darkHex: '#1C1C1C',
    lightPrimitive: 'white',
    darkPrimitive: 'custom',
    border: true,
  },
  {
    token: 'surface.subtle',
    cssVar: '--color-surface-subtle',
    lightHex: '#F8FAFC',
    darkHex: '#141414',
    lightPrimitive: 'slate50',
    darkPrimitive: 'custom',
    border: true,
  },
  {
    token: 'surface.muted',
    cssVar: '--color-surface-muted',
    lightHex: '#F1F5F9',
    darkHex: '#252525',
    lightPrimitive: 'slate100',
    darkPrimitive: 'custom',
  },
  {
    token: 'surface.inverse',
    cssVar: '--color-surface-inverse',
    lightHex: '#0F172A',
    darkHex: '#FAFAFA',
    lightPrimitive: 'slate900',
    darkPrimitive: 'custom',
  },
];

export const borderColors: SemanticColor[] = [
  {
    token: 'border.default',
    cssVar: '--color-border-default',
    lightHex: '#E2E8F0',
    darkHex: '#3A3A3A',
    lightPrimitive: 'slate200',
    darkPrimitive: 'custom',
  },
  {
    token: 'border.subtle',
    cssVar: '--color-border-subtle',
    lightHex: '#F1F5F9',
    darkHex: '#2E2E2E',
    lightPrimitive: 'slate100',
    darkPrimitive: 'custom',
  },
  {
    token: 'border.strong',
    cssVar: '--color-border-strong',
    lightHex: '#CBD5E1',
    darkHex: '#4A4A4A',
    lightPrimitive: 'slate300',
    darkPrimitive: 'custom',
  },
  {
    token: 'border.focus',
    cssVar: '--color-border-focus',
    lightHex: '#3B82F6',
    darkHex: '#60A5FA',
    lightPrimitive: 'blue500',
    darkPrimitive: 'blue400',
  },
];

export const infoColors: SemanticColor[] = [
  {
    token: 'state.info',
    cssVar: '--color-state-info',
    lightHex: '#2563EB',
    darkHex: '#60A5FA',
    lightPrimitive: 'blue600',
    darkPrimitive: 'blue400',
  },
  {
    token: 'state.info-bg',
    cssVar: '--color-state-info-bg',
    lightHex: '#EFF6FF',
    darkHex: 'rgba(59,130,246,0.2)',
    lightPrimitive: 'blue50',
    darkPrimitive: 'blue500 20%',
    border: true,
  },
  {
    token: 'state.info-text',
    cssVar: '--color-state-info-text',
    lightHex: '#1E40AF',
    darkHex: '#93C5FD',
    lightPrimitive: 'blue800',
    darkPrimitive: 'blue300',
  },
];

export const successColors: SemanticColor[] = [
  {
    token: 'state.success',
    cssVar: '--color-state-success',
    lightHex: '#22C55E',
    darkHex: '#4ADE80',
    lightPrimitive: 'green500',
    darkPrimitive: 'green400',
  },
  {
    token: 'state.success-bg',
    cssVar: '--color-state-success-bg',
    lightHex: '#F0FDF4',
    darkHex: '#14532D',
    lightPrimitive: 'green50',
    darkPrimitive: 'green900',
    border: true,
  },
  {
    token: 'state.success-text',
    cssVar: '--color-state-success-text',
    lightHex: '#16A34A',
    darkHex: '#BBF7D0',
    lightPrimitive: 'green600',
    darkPrimitive: 'green200',
  },
];

export const warningColors: SemanticColor[] = [
  {
    token: 'state.warning',
    cssVar: '--color-state-warning',
    lightHex: '#F97316',
    darkHex: '#FB923C',
    lightPrimitive: 'orange500',
    darkPrimitive: 'orange400',
  },
  {
    token: 'state.warning-bg',
    cssVar: '--color-state-warning-bg',
    lightHex: '#FFF7ED',
    darkHex: 'rgba(249,115,22,0.2)',
    lightPrimitive: 'orange50',
    darkPrimitive: 'orange500 20%',
    border: true,
  },
  {
    token: 'state.warning-text',
    cssVar: '--color-state-warning-text',
    lightHex: '#EA580C',
    darkHex: '#FED7AA',
    lightPrimitive: 'orange600',
    darkPrimitive: 'orange200',
  },
];

export const dangerColors: SemanticColor[] = [
  {
    token: 'state.danger',
    cssVar: '--color-state-danger',
    lightHex: '#EF4444',
    darkHex: '#F87171',
    lightPrimitive: 'red500',
    darkPrimitive: 'red400',
  },
  {
    token: 'state.danger-bg',
    cssVar: '--color-state-danger-bg',
    lightHex: '#FEF2F2',
    darkHex: 'rgba(239,68,68,0.08)',
    lightPrimitive: 'red50',
    darkPrimitive: 'red500 8%',
    border: true,
  },
  {
    token: 'state.danger-text',
    cssVar: '--color-state-danger-text',
    lightHex: '#DC2626',
    darkHex: '#FECACA',
    lightPrimitive: 'red600',
    darkPrimitive: 'red200',
  },
];

export function SemanticColorsPage() {
  return (
    <ComponentPageTemplate
      title="Semantic colors"
      description="Purpose-driven color tokens with light/dark theme support. Click token or hex to copy."
      preview={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SemanticColorTable title="Action" colors={actionColors} />
          <SemanticColorTable title="Text" colors={textColors} />
        </div>
      }
      examples={
        <VStack gap={8}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SemanticColorTable title="Surface" colors={surfaceColors} />
            <SemanticColorTable title="Border" colors={borderColors} />
          </div>

          <VStack gap={4}>
            <Label>State</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SemanticColorTable title="Info" colors={infoColors} />
              <SemanticColorTable title="Success" colors={successColors} />
              <SemanticColorTable title="Warning" colors={warningColors} />
              <SemanticColorTable title="Danger" colors={dangerColors} />
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
