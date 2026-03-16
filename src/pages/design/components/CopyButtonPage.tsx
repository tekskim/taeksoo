import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { CopyButton, Copyable, VStack, HStack } from '@/design-system';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { Label } from '../../design-system-sections/HelperComponents';

const copyButtonProps: PropDef[] = [
  { name: 'value', type: 'string', required: true, description: 'Text to copy to clipboard' },
  {
    name: 'variant',
    type: "'default' | 'ghost' | 'outline'",
    default: "'default'",
    required: false,
    description: 'Button variant',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    required: false,
    description: 'Button size',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Copy'",
    required: false,
    description: 'Button label',
  },
  {
    name: 'successLabel',
    type: 'string',
    default: "'Copied!'",
    required: false,
    description: 'Label shown after successful copy',
  },
  {
    name: 'successDuration',
    type: 'number',
    default: '2000',
    required: false,
    description: 'Duration of success state (ms)',
  },
  {
    name: 'iconOnly',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show only icon without label',
  },
  { name: 'tooltip', type: 'string', required: false, description: 'Tooltip text' },
  {
    name: 'onCopy',
    type: '(value: string) => void',
    required: false,
    description: 'Callback on successful copy',
  },
];

function CopyButtonPreview() {
  return (
    <VStack gap={4}>
      <HStack gap={2}>
        <CopyButton value="Hello, World!" />
        <CopyButton value="Icon only" iconOnly tooltip="Copy to clipboard" />
        <CopyButton value="Outline" variant="outline" />
      </HStack>
      <Copyable value="i-0a1b2c3d4e5f6789" />
      <Copyable value="a-very-long-resource-id-that-should-be-truncated" truncate maxWidth={200} />
    </VStack>
  );
}

export function CopyButtonPage() {
  return (
    <ComponentPageTemplate
      title="CopyButton"
      description="Button that copies text to the clipboard and shows a success state. Includes Copyable compound component for inline copy."
      whenToUse={[
        '리소스 ID, 커맨드, URL 등 복사가 필요한 텍스트 옆에 사용',
        'DetailHeader InfoCard의 copyable 기능 내부에서 사용',
      ]}
      whenNotToUse={['단순 버튼 클릭 액션 → Button 사용', '텍스트 선택 후 Ctrl+C로 충분한 경우']}
      preview={
        <ComponentPreview
          code={`<CopyButton value="Hello, World!" />
<CopyButton value="Icon only" iconOnly tooltip="Copy" />
<CopyButton value="Outline" variant="outline" />
<Copyable value="i-0a1b2c3d4e5f6789" />`}
        >
          <CopyButtonPreview />
        </ComponentPreview>
      }
      props={copyButtonProps}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>States — Ghost (default variant)</Label>
            <div className="grid grid-cols-3 gap-6">
              <VStack gap={1} align="start">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Default</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-transparent rounded-[var(--radius-sm)] font-medium h-6 px-1.5 text-body-sm gap-1 bg-transparent text-[var(--color-text-muted)]"
                >
                  <span className="shrink-0 flex items-center">
                    <IconCopy size={12} stroke={1.5} />
                  </span>
                  <span>Copy</span>
                </button>
              </VStack>
              <VStack gap={1} align="start">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Hover</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-transparent rounded-[var(--radius-sm)] font-medium h-6 px-1.5 text-body-sm gap-1 bg-[var(--color-surface-subtle)] text-[var(--color-text-default)]"
                >
                  <span className="shrink-0 flex items-center">
                    <IconCopy size={12} stroke={1.5} />
                  </span>
                  <span>Copy</span>
                </button>
              </VStack>
              <VStack gap={1} align="start">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Copied</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-transparent rounded-[var(--radius-sm)] font-medium h-6 px-1.5 text-body-sm gap-1 bg-transparent text-[var(--color-state-success)]"
                >
                  <span className="shrink-0 flex items-center">
                    <IconCheck size={12} stroke={2} />
                  </span>
                  <span>Copied!</span>
                </button>
              </VStack>
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <Label>States — Icon Only</Label>
            <div className="grid grid-cols-3 gap-6">
              <VStack gap={1} align="start">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Default</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-transparent rounded-[var(--radius-sm)] font-medium h-6 px-1.5 text-body-sm bg-transparent text-[var(--color-text-muted)]"
                >
                  <span className="shrink-0 flex items-center">
                    <IconCopy size={12} stroke={1.5} />
                  </span>
                </button>
              </VStack>
              <VStack gap={1} align="start">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Hover</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-transparent rounded-[var(--radius-sm)] font-medium h-6 px-1.5 text-body-sm bg-[var(--color-surface-subtle)] text-[var(--color-text-default)]"
                >
                  <span className="shrink-0 flex items-center">
                    <IconCopy size={12} stroke={1.5} />
                  </span>
                </button>
              </VStack>
              <VStack gap={1} align="start">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Copied</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-transparent rounded-[var(--radius-sm)] font-medium h-6 px-1.5 text-body-sm bg-transparent text-[var(--color-state-success)]"
                >
                  <span className="shrink-0 flex items-center">
                    <IconCheck size={12} stroke={2} />
                  </span>
                </button>
              </VStack>
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <Label>States — Outline</Label>
            <div className="grid grid-cols-3 gap-6">
              <VStack gap={1} align="start">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Default</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-[var(--color-border-default)] rounded-[var(--radius-sm)] font-medium h-6 px-1.5 text-body-sm gap-1 bg-transparent text-[var(--color-text-default)]"
                >
                  <span className="shrink-0 flex items-center">
                    <IconCopy size={12} stroke={1.5} />
                  </span>
                  <span>Copy</span>
                </button>
              </VStack>
              <VStack gap={1} align="start">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Hover</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-[var(--color-border-default)] rounded-[var(--radius-sm)] font-medium h-6 px-1.5 text-body-sm gap-1 bg-[var(--color-surface-subtle)] text-[var(--color-text-default)]"
                >
                  <span className="shrink-0 flex items-center">
                    <IconCopy size={12} stroke={1.5} />
                  </span>
                  <span>Copy</span>
                </button>
              </VStack>
              <VStack gap={1} align="start">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Copied</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center border border-[var(--color-border-default)] rounded-[var(--radius-sm)] font-medium h-6 px-1.5 text-body-sm gap-1 bg-transparent text-[var(--color-state-success)]"
                >
                  <span className="shrink-0 flex items-center">
                    <IconCheck size={12} stroke={2} />
                  </span>
                  <span>Copied!</span>
                </button>
              </VStack>
            </div>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          <VStack gap={3}>
            <Label>Copyable (Inline)</Label>
            <VStack gap={2}>
              <Copyable value="i-0a1b2c3d4e5f6789" />
              <Copyable
                value="a-very-long-resource-id-that-should-be-truncated"
                truncate
                maxWidth={240}
              />
            </VStack>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Button', path: '/design/components/button' },
        { label: 'DetailHeader', path: '/design/patterns/detail-header' },
      ]}
    />
  );
}
