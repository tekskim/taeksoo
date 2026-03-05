import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Select, VStack } from '@/design-system';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';

const selectProps: PropDef[] = [
  {
    name: 'options',
    type: 'SelectOption[]',
    required: true,
    description: 'Dropdown options array',
  },
  { name: 'value', type: 'string', required: false, description: 'Controlled selected value' },
  {
    name: 'defaultValue',
    type: 'string',
    required: false,
    description: 'Default value (uncontrolled)',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    required: false,
    description: 'Change handler',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'Select an option'",
    required: false,
    description: 'Placeholder text',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    required: false,
    description: 'Select size',
  },
  {
    name: 'width',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'half' | 'full' | number",
    default: "'md'",
    required: false,
    description: 'Select width',
  },
  { name: 'error', type: 'string | boolean', required: false, description: 'Error state' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Full width select',
  },
  {
    name: 'clearable',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show clear button',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Required field',
  },
];

const selectOptions = [
  { value: 'active', label: 'Active' },
  { value: 'shutoff', label: 'Shutoff' },
  { value: 'building', label: 'Building' },
];

export function SelectPage() {
  return (
    <ComponentPageTemplate
      title="Select"
      description="드롭다운 목록에서 하나의 옵션을 선택하는 입력 컴포넌트다. 옵션이 많아 화면에 모두 노출하기 어려운 경우, 접힌 상태로 공간을 절약하면서 선택 인터랙션을 제공한다."
      whenToUse={['옵션이 4개 이상이거나 가변적이며, 단일 선택이 필요한 경우']}
      whenNotToUse={[
        '하나의 옵션만 선택 가능한 경우 → Radio 사용',
        '옵션이 2~3개 고정인 경우 → Radio Group 사용',
        'On/Off의 즉각적인 상태 전환이 필요한 경우 → Toggle 사용',
        '다중 선택이 필요한 경우 → Checkbox Group 또는 Multi-Select 사용',
      ]}
      keyboardInteractions={[
        { key: 'Enter / Space', description: 'Open dropdown / confirm selection' },
        { key: '↑ / ↓', description: 'Move focus between options' },
        { key: 'Escape', description: 'Close dropdown' },
        { key: 'Tab', description: 'Move to next focus area (closes dropdown)' },
      ]}
      preview={
        <ComponentPreview
          code={`<Select placeholder="Select status" options={options} width="md" />`}
        >
          <Select placeholder="Select status" width="md" options={selectOptions} />
        </ComponentPreview>
      }
      usage={{
        code: `import { Select } from '@/design-system';\n\nconst options = [\n  { value: 'active', label: 'Active' },\n  { value: 'shutoff', label: 'Shutoff' },\n];\n\n<Select placeholder="Select status" options={options} width="md" />`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Dropdown Menu (Expanded)</Label>
            <div className="flex gap-6 items-start flex-wrap">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Default
                </span>
                <VStack gap={1} className="w-[200px]">
                  <button className="flex items-center justify-between gap-2 w-full h-[var(--input-height-md)] px-[var(--select-padding-x)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)] bg-[var(--select-bg)] border border-solid border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)] rounded-[var(--select-radius)] cursor-pointer">
                    <span className="text-body-md text-[var(--color-text-muted)]">
                      Select status
                    </span>
                    <IconChevronDown
                      size={16}
                      stroke={1.5}
                      className="text-[var(--color-text-default)] rotate-180"
                    />
                  </button>
                  <div className="w-full bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] overflow-hidden">
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                      Active
                    </div>
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                      Shutoff
                    </div>
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer">
                      Building
                    </div>
                  </div>
                </VStack>
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  With Selection
                </span>
                <VStack gap={1} className="w-[200px]">
                  <button className="flex items-center justify-between gap-2 w-full h-[var(--input-height-md)] px-[var(--select-padding-x)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)] bg-[var(--select-bg)] border border-solid border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)] rounded-[var(--select-radius)] cursor-pointer">
                    <span className="text-body-md text-[var(--color-text-default)]">Active</span>
                    <IconChevronDown
                      size={16}
                      stroke={1.5}
                      className="text-[var(--color-text-default)] rotate-180"
                    />
                  </button>
                  <div className="w-full bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] overflow-hidden">
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                      Active <IconCheck size={14} className="shrink-0" />
                    </div>
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                      Shutoff
                    </div>
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer">
                      Building
                    </div>
                  </div>
                </VStack>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Status</Label>
            <div className="flex gap-4 items-start flex-wrap">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Placeholder
                </span>
                <Select placeholder="Placeholder" width="md" options={selectOptions} />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Value
                </span>
                <Select
                  placeholder="Placeholder"
                  defaultValue="active"
                  width="md"
                  options={selectOptions}
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <Select placeholder="Placeholder" disabled width="md" options={selectOptions} />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Error
                </span>
                <Select
                  placeholder="Placeholder"
                  error="Please select an option"
                  width="md"
                  options={selectOptions}
                />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With Label & Helper</Label>
            <div className="flex gap-4 items-start">
              <Select
                label="Status"
                placeholder="Select status"
                width="md"
                options={selectOptions}
              />
              <Select
                label="Region"
                placeholder="Select region"
                helperText="Choose your preferred region"
                width="md"
                options={[
                  { value: 'kr', label: 'Korea' },
                  { value: 'us', label: 'United States' },
                  { value: 'jp', label: 'Japan' },
                ]}
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Width variants</Label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-4 items-end">
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    XS (80px)
                  </span>
                  <Select
                    placeholder="Select"
                    width="xs"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    SM (160px)
                  </span>
                  <Select
                    placeholder="Select"
                    width="sm"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    MD (240px)
                  </span>
                  <Select
                    placeholder="Select"
                    width="md"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    LG (320px)
                  </span>
                  <Select
                    placeholder="Select"
                    width="lg"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    Half (50%)
                  </span>
                  <Select
                    placeholder="Select"
                    width="half"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    Full (100%)
                  </span>
                  <Select
                    placeholder="Select"
                    width="full"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With Disabled Options</Label>
            <Select
              label="Instance type"
              placeholder="Select type"
              defaultValue="medium"
              options={[
                { value: 'small', label: 'Small (2 vCPU)' },
                { value: 'medium', label: 'Medium (4 vCPU)' },
                { value: 'large', label: 'Large (8 vCPU)', disabled: true },
                { value: 'xlarge', label: 'X-Large (16 vCPU)', disabled: true },
              ]}
              className="w-[240px]"
            />
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Variant
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Default</td>
                      <td className="py-2 text-[var(--color-text-muted)]">placeholder 표시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Value</td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택된 값 표시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Disabled</td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성화 상태</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Error</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        에러 상태 (테두리 + 메시지)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Width Variants</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Size
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        너비
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">XS</td>
                      <td className="py-2 text-[var(--color-text-muted)]">80px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">SM</td>
                      <td className="py-2 text-[var(--color-text-muted)]">160px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">MD</td>
                      <td className="py-2 text-[var(--color-text-muted)]">240px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">LG</td>
                      <td className="py-2 text-[var(--color-text-muted)]">320px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Half</td>
                      <td className="py-2 text-[var(--color-text-muted)]">50%</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Full</td>
                      <td className="py-2 text-[var(--color-text-muted)]">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">States</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        State
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Default</td>
                      <td className="py-2 text-[var(--color-text-muted)]">기본 상태</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Focus</td>
                      <td className="py-2 text-[var(--color-text-muted)]">포커스 시 테두리 강조</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Open</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        드롭다운 열림, Chevron 회전
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Selected</td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택된 옵션 체크 표시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Disabled</td>
                      <td className="py-2 text-[var(--color-text-muted)]">상호작용 불가</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Error</td>
                      <td className="py-2 text-[var(--color-text-muted)]">에러 테두리 + 메시지</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Composition</h4>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Trigger 영역</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        Placeholder / Value
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        선택 전/후 표시 텍스트
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Chevron</td>
                      <td className="py-2 text-[var(--color-text-muted)]">열림/닫힘 상태 표시</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Dropdown Menu</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Option Item</td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택 가능한 옵션 행</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Check Icon</td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택된 옵션에 표시</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Text (optional)</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Label</td>
                      <td className="py-2 text-[var(--color-text-muted)]">FormField로 제공</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Helper Text</td>
                      <td className="py-2 text-[var(--color-text-muted)]">FormField로 제공</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">Design Tokens</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Token
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        값
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">padding</td>
                      <td className="py-2 text-[var(--color-text-muted)]">10×8px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">radius</td>
                      <td className="py-2 text-[var(--color-text-muted)]">6px</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">item</td>
                      <td className="py-2 text-[var(--color-text-muted)]">10×6px, 12px</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Behavior</h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                드롭다운 열림/닫힘: 클릭 또는 Enter/Space로 열고, 옵션 선택 또는 Esc/외부 클릭으로
                닫는다.
              </p>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)]">키보드 인터랙션</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        키
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        동작
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Enter / Space</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        드롭다운 열기 / 선택 확정
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">↑ / ↓</td>
                      <td className="py-2 text-[var(--color-text-muted)]">옵션 간 포커스 이동</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Esc</td>
                      <td className="py-2 text-[var(--color-text-muted)]">드롭다운 닫기</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">Tab</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        다음 포커스 영역으로 이동 (닫힘)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                드롭다운 위치: 트리거 하단에 정렬하여 표시한다. 옵션 텍스트가 길 경우 말줄임
                처리하고, tooltip으로 전체 텍스트를 제공한다.
              </p>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Usage Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
                  <h5 className="text-heading-h7 text-[var(--color-state-success)] mb-3">Do ✅</h5>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>placeholder로 &quot;Select [항목]&quot; 형태의 안내를 제공한다.</li>
                    <li>기본 선택값이 있는 경우 미리 설정하여 사용자 입력을 줄인다.</li>
                    <li>옵션 목록은 논리적 순서로 정렬한다 (알파벳, 빈도, 중요도).</li>
                    <li>선택 사항인 경우 &quot;None&quot; 옵션으로 해제를 허용한다.</li>
                    <li>긴 옵션 텍스트는 말줄임 처리하고 tooltip으로 전체 텍스트를 제공한다.</li>
                    <li>FormField와 함께 사용하여 라벨과 helperText를 제공한다.</li>
                    <li>옵션 목록이 길 경우(20개 이상) 스크롤 영역 내에서 탐색한다.</li>
                  </ul>
                </div>
                <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
                  <h5 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">
                    Don&apos;t ❌
                  </h5>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>옵션이 3개 이하인 경우 Select를 사용하지 않는다 (Radio Group 사용).</li>
                    <li>Select 내부에 복잡한 레이아웃(아이콘+설명)을 넣지 않는다.</li>
                    <li>옵션 목록이 동적으로 변경되면서 현재 선택이 사라지게 하지 않는다.</li>
                    <li>
                      다중 선택이 필요한 경우 Select 대신 Checkbox Group 또는 Multi-Select를
                      사용한다.
                    </li>
                  </ul>
                </div>
              </div>
            </VStack>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>padding: 10×8px</code> · <code>radius: 6px</code> · <code>font: 12px</code> ·{' '}
          <code>item: 10×6px, 11px</code> · <code>border: 1px → 2px focus</code>
        </div>
      }
      apiReference={selectProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Enter/Space: Open dropdown</li>
          <li>Arrow keys: Navigate options</li>
          <li>Tab: Move focus</li>
          <li>Escape: Close dropdown</li>
        </ul>
      }
      relatedLinks={[
        { label: 'Checkbox', path: '/design/components/checkbox', description: '다중 선택' },
        { label: 'Radio Group', path: '/design/components/radio', description: '2~3개 단일 선택' },
        { label: 'Toggle', path: '/design/components/toggle', description: 'On/Off 스위치' },
        {
          label: 'Tooltip',
          path: '/design/components/tooltip',
          description: '긴 옵션 텍스트 안내',
        },
      ]}
    />
  );
}
