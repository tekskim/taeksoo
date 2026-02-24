import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Radio, RadioGroup, VStack } from '@/design-system';

const radioProps: PropDef[] = [
  { name: 'label', type: 'ReactNode', required: false, description: 'Radio label' },
  {
    name: 'description',
    type: 'ReactNode',
    required: false,
    description: 'Description below label',
  },
  { name: 'value', type: 'string', required: true, description: 'Radio value' },
  { name: 'checked', type: 'boolean', required: false, description: 'Controlled checked state' },
  {
    name: 'onChange',
    type: '(e: ChangeEvent) => void',
    required: false,
    description: 'Change handler',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: false,
    description: 'Alternative to label prop',
  },
];

export function RadioPage() {
  return (
    <ComponentPageTemplate
      title="Radio"
      description="Single selection control for mutually exclusive options"
      preview={
        <ComponentPreview
          code={`<RadioGroup label="Select one" defaultValue="option1">\n  <Radio label="Option 1" value="option1" />\n  <Radio label="Option 2" value="option2" />\n</RadioGroup>`}
        >
          <RadioGroup label="Select one" defaultValue="option1" direction="vertical">
            <Radio label="Option 1" value="option1" />
            <Radio label="Option 2" value="option2" />
          </RadioGroup>
        </ComponentPreview>
      }
      usage={{
        code: `import { Radio, RadioGroup } from '@/design-system';\n\n<RadioGroup label="Select one" defaultValue="option1">\n  <Radio label="Option 1" value="option1" />\n  <Radio label="Option 2" value="option2" />\n</RadioGroup>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Layout</Label>
            <div className="flex gap-8 items-start">
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Icon Only
                </span>
                <Radio value="icon" checked onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  With Label
                </span>
                <Radio label="Label" value="label" checked onChange={() => {}} />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Status</Label>
            <div className="flex gap-8 items-start">
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Unselected
                </span>
                <Radio label="Label" value="unselected" checked={false} onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Selected
                </span>
                <Radio label="Label" value="selected" checked onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <Radio label="Label" value="disabled" disabled />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled + Selected
                </span>
                <Radio
                  label="Label"
                  value="disabled-selected"
                  checked
                  disabled
                  onChange={() => {}}
                />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Radio group</Label>
            <div className="flex gap-8 items-start">
              <RadioGroup label="Select one option" defaultValue="option1" direction="vertical">
                <Radio label="Option 1" value="option1" />
                <Radio label="Option 2" value="option2" />
                <Radio label="Option 3" value="option3" />
              </RadioGroup>
              <RadioGroup label="Horizontal layout" defaultValue="a" direction="horizontal">
                <Radio label="A" value="a" />
                <Radio label="B" value="b" />
                <Radio label="C" value="c" />
              </RadioGroup>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Group with Error</Label>
            <RadioGroup
              label="Required selection"
              description="Please select one option"
              error
              errorMessage="You must select an option"
            >
              <Radio label="Option A" value="a" />
              <Radio label="Option B" value="b" />
            </RadioGroup>
          </VStack>
        </VStack>
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                옵션이 <strong>2~3개</strong>이고, 모든 옵션을 한눈에 볼 필요가 있을 때 사용합니다.
              </li>
              <li>옵션이 4개 이상이면 Select를 사용합니다.</li>
              <li>반드시 하나의 옵션이 선택된 상태여야 합니다 (기본값 설정 권장).</li>
              <li>라벨은 간결하게 작성하고, 부가 설명이 필요하면 description을 활용합니다.</li>
              <li>수직 배치를 기본으로 사용합니다.</li>
            </ul>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>size: 16×16px</code> · <code>dot: 6px</code> · <code>border: 2px</code> ·{' '}
          <code>gap: 6px</code>
        </div>
      }
      apiReference={radioProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Arrow keys: Navigate between options in group</li>
          <li>Space: Select focused option</li>
          <li>Tab: Move focus</li>
        </ul>
      }
      relatedLinks={[
        {
          label: 'Select',
          path: '/design/components/select',
          description: 'Dropdown for 4+ options',
        },
        {
          label: 'Checkbox',
          path: '/design/components/checkbox',
          description: 'Multiple selection',
        },
        {
          label: 'Form Field Spacing',
          path: '/design/components/form-field',
          description: 'Label combinations',
        },
      ]}
    />
  );
}
