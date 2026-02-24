import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Checkbox, CheckboxGroup, VStack } from '@/design-system';

const checkboxProps: PropDef[] = [
  { name: 'label', type: 'ReactNode', required: false, description: 'Checkbox label' },
  {
    name: 'description',
    type: 'ReactNode',
    required: false,
    description: 'Description below label',
  },
  { name: 'checked', type: 'boolean', required: false, description: 'Controlled checked state' },
  {
    name: 'indeterminate',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Partially selected state',
  },
  { name: 'error', type: 'boolean', default: 'false', required: false, description: 'Error state' },
  { name: 'errorMessage', type: 'string', required: false, description: 'Error message text' },
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
];

export function CheckboxPage() {
  return (
    <ComponentPageTemplate
      title="Checkbox"
      description="Selection control for single or multiple options"
      preview={
        <ComponentPreview code={`<Checkbox label="Label" defaultChecked />`}>
          <Checkbox label="Label" defaultChecked />
        </ComponentPreview>
      }
      usage={{
        code: `import { Checkbox } from '@/design-system';\n\n<Checkbox label="Label" defaultChecked />`,
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
                <Checkbox defaultChecked />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  With Label
                </span>
                <Checkbox label="Label" defaultChecked />
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
                <Checkbox label="Label" checked={false} onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Selected
                </span>
                <Checkbox label="Label" checked onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Indeterminate
                </span>
                <Checkbox label="Label" checked indeterminate onChange={() => {}} />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <Checkbox label="Label" disabled />
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled + Checked
                </span>
                <Checkbox label="Label" checked disabled />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Error state</Label>
            <div className="flex gap-8 items-start">
              <Checkbox label="Unchecked with error" error errorMessage="This field is required" />
              <Checkbox label="Checked with error" defaultChecked error />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With description</Label>
            <Checkbox
              label="Email notifications"
              description="Receive email notifications for important updates"
              defaultChecked
            />
          </VStack>

          <VStack gap={3}>
            <Label>Checkbox group</Label>
            <div className="flex gap-8 items-start">
              <CheckboxGroup label="Select options" direction="vertical">
                <Checkbox label="Option 1" defaultChecked />
                <Checkbox label="Option 2" />
                <Checkbox label="Option 3" />
              </CheckboxGroup>
              <CheckboxGroup label="Horizontal layout" direction="horizontal">
                <Checkbox label="A" defaultChecked />
                <Checkbox label="B" />
                <Checkbox label="C" />
              </CheckboxGroup>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Group with Error</Label>
            <CheckboxGroup
              label="Required selection"
              description="Please select at least one option"
              error
              errorMessage="At least one option must be selected"
            >
              <Checkbox label="Option A" />
              <Checkbox label="Option B" />
            </CheckboxGroup>
          </VStack>
        </VStack>
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>단일 체크박스</strong>: 약관 동의, 옵션 활성화 등 이진(yes/no) 선택에
                사용합니다.
              </li>
              <li>
                <strong>CheckboxGroup</strong>: 여러 옵션 중 복수 선택이 가능한 경우 사용합니다.
              </li>
              <li>
                <strong>테이블 선택</strong>: Table 컴포넌트의 행 선택에 내장되어 사용됩니다.
              </li>
              <li>
                <strong>Indeterminate</strong>: &quot;전체 선택&quot; 체크박스에서 일부 항목만
                선택된 경우 indeterminate(—) 상태로 표시합니다.
              </li>
              <li>라벨은 반드시 제공하며, 라벨 클릭으로도 체크 상태를 변경할 수 있어야 합니다.</li>
              <li>
                Toggle은 On/Off 이진 선택, Checkbox는 다중 항목 선택(체크리스트)에 사용합니다.
              </li>
            </ul>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>size: 16×16px</code> · <code>radius: 4px</code> · <code>gap: 6px</code> ·{' '}
          <code>icon: 12px</code>
        </div>
      }
      apiReference={checkboxProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Space: Toggle checked state</li>
          <li>Tab: Move focus</li>
          <li>Label must be associated for keyboard access</li>
        </ul>
      }
      relatedLinks={[
        { label: 'Radio', path: '/design/components/radio', description: 'Single selection' },
        { label: 'Toggle', path: '/design/components/toggle', description: 'On/Off switch' },
        {
          label: 'Form Field Spacing',
          path: '/design/components/form-field',
          description: 'Label combinations',
        },
      ]}
    />
  );
}
