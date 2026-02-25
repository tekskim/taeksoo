import { useState } from 'react';
import {
  Button,
  Input,
  SearchInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Toggle,
  Slider,
  Badge,
  Chip,
  StatusIndicator,
  Pagination,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Breadcrumb,
  InlineMessage,
  Loading,
  EmptyState,
  ErrorState,
  FormField,
  SectionCard,
  DetailHeader,
  PageHeader,
  InfoBox,
  MetricCard,
  ListToolbar,
  FilterSearchInput,
  NumberInput,
  ProgressBar,
  Tooltip,
  ContextMenu,
  Disclosure,
  VStack,
  HStack,
} from '@/design-system';
import type { FilterField, AppliedFilter } from '@/design-system';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDownload,
  IconChevronDown,
  IconSearch,
  IconDatabase,
  IconAlertTriangle,
  IconPlayerPlay,
  IconTerminal2,
} from '@tabler/icons-react';

/* ──────────────────────────────────────────
   Shared Layout Helpers
   ────────────────────────────────────────── */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-heading-h4 text-[var(--color-text-default)] pb-2 border-b border-[var(--color-border-default)] mb-6 mt-16 first:mt-0">
    {children}
  </h2>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-heading-h6 text-[var(--color-text-muted)] mb-3 mt-6">{children}</h3>
);

const StateLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-body-xs text-[var(--color-text-subtle)]">{children}</span>
);

/* ──────────────────────────────────────────
   FigmaGuide — Inline migration guide block
   ────────────────────────────────────────── */

interface FigmaProperty {
  name: string;
  type: 'Variant' | 'Boolean' | 'Text' | 'Instance swap';
  values: string;
}

interface AutoLayoutRow {
  label: string;
  direction: string;
  gap: string;
  padding: string;
  height?: string;
}

interface FigmaGuideProps {
  figmaName: string;
  properties?: FigmaProperty[];
  autoLayout?: AutoLayoutRow[];
  radius?: string;
  tokens?: { label: string; value: string }[];
  tips?: string[];
}

function FigmaGuide({ figmaName, properties, autoLayout, radius, tokens, tips }: FigmaGuideProps) {
  return (
    <div className="mt-4">
      <Disclosure title="Figma Guide" defaultOpen={false}>
        <div className="flex flex-col gap-3 text-body-sm text-[var(--color-text-default)]">
          <div>
            <span className="text-label-sm text-[var(--color-text-subtle)]">Component name</span>
            <div className="font-mono mt-0.5">{figmaName}</div>
          </div>

          {properties && properties.length > 0 && (
            <div>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Properties</span>
              <table className="w-full mt-1 text-body-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-1 pr-3 text-label-sm text-[var(--color-text-subtle)]">
                      Name
                    </th>
                    <th className="text-left py-1 pr-3 text-label-sm text-[var(--color-text-subtle)]">
                      Type
                    </th>
                    <th className="text-left py-1 text-label-sm text-[var(--color-text-subtle)]">
                      Values
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.name} className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-1 pr-3 font-medium">{p.name}</td>
                      <td className="py-1 pr-3">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-body-xs font-medium ${
                            p.type === 'Variant'
                              ? 'bg-[var(--color-state-info-bg)] text-[var(--color-state-info)]'
                              : p.type === 'Boolean'
                                ? 'bg-[var(--color-state-success-bg)] text-[var(--color-state-success)]'
                                : p.type === 'Text'
                                  ? 'bg-[var(--color-state-warning-bg)] text-[var(--color-state-warning)]'
                                  : 'bg-[var(--color-state-danger-bg)] text-[var(--color-state-danger)]'
                          }`}
                        >
                          {p.type}
                        </span>
                      </td>
                      <td className="py-1 font-mono text-body-xs">{p.values}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {autoLayout && autoLayout.length > 0 && (
            <div>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Auto Layout</span>
              <table className="w-full mt-1 text-body-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-1 pr-3 text-label-sm text-[var(--color-text-subtle)]">
                      Size
                    </th>
                    <th className="text-left py-1 pr-3 text-label-sm text-[var(--color-text-subtle)]">
                      Dir
                    </th>
                    <th className="text-left py-1 pr-3 text-label-sm text-[var(--color-text-subtle)]">
                      Gap
                    </th>
                    <th className="text-left py-1 pr-3 text-label-sm text-[var(--color-text-subtle)]">
                      Padding
                    </th>
                    {autoLayout.some((r) => r.height) && (
                      <th className="text-left py-1 text-label-sm text-[var(--color-text-subtle)]">
                        Height
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {autoLayout.map((r) => (
                    <tr key={r.label} className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-1 pr-3">{r.label}</td>
                      <td className="py-1 pr-3">{r.direction}</td>
                      <td className="py-1 pr-3">{r.gap}</td>
                      <td className="py-1 pr-3">{r.padding}</td>
                      {autoLayout.some((row) => row.height) && (
                        <td className="py-1">{r.height || '—'}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {radius && (
            <div>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Radius</span>
              <div className="font-mono mt-0.5">{radius}</div>
            </div>
          )}

          {tokens && tokens.length > 0 && (
            <div>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Key tokens</span>
              <div className="flex flex-col gap-0.5 mt-1">
                {tokens.map((t) => (
                  <div key={t.label}>
                    <span className="text-[var(--color-text-subtle)]">{t.label}:</span>{' '}
                    <code className="text-body-xs font-mono">{t.value}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tips && tips.length > 0 && (
            <div>
              <span className="text-label-sm text-[var(--color-text-subtle)]">Tips</span>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[var(--color-text-muted)]">
                {tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Disclosure>
    </div>
  );
}

/* ──────────────────────────────────────────
   Data
   ────────────────────────────────────────── */

const buttonVariants = [
  'primary',
  'secondary',
  'muted',
  'ghost',
  'outline',
  'danger',
  'warning',
  'link',
] as const;
const buttonSizes = ['sm', 'md', 'lg'] as const;

const buttonHoverClasses: Record<string, string> = {
  primary: 'bg-[var(--color-action-primary-hover)]',
  secondary: 'bg-[var(--button-secondary-hover-bg)]',
  outline: 'bg-[var(--button-secondary-hover-bg)]',
  ghost: 'bg-[var(--button-ghost-hover-bg)]',
  muted:
    'bg-[var(--color-surface-subtle)] text-[var(--color-text-default)] border-[var(--color-border-strong)]',
  danger: 'bg-[var(--color-state-danger-hover)]',
  warning: 'bg-[var(--color-orange-600)]',
  link: 'underline underline-offset-4',
};

const badgeThemes = ['blue', 'red', 'green', 'yellow', 'gray', 'white'] as const;
const badgeTypes = ['solid', 'subtle'] as const;
const badgeSizes = ['sm', 'md', 'lg'] as const;

const statusTypes = [
  'active',
  'error',
  'building',
  'deleting',
  'pending',
  'shutoff',
  'paused',
  'suspended',
  'shelved',
  'mounted',
  'in-use',
  'maintenance',
  'degraded',
  'down',
  'draft',
  'deactivated',
] as const;

const inlineMessageVariants = ['info', 'success', 'warning', 'error'] as const;

const sampleSelectOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const contextMenuItems = [
  { id: 'edit', label: 'Edit', onClick: () => {} },
  { id: 'duplicate', label: 'Duplicate', onClick: () => {} },
  { id: 'export', label: 'Export', onClick: () => {}, divider: true },
  { id: 'delete', label: 'Delete', status: 'danger' as const, onClick: () => {} },
];

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'running', label: 'Running' },
      { value: 'stopped', label: 'Stopped' },
    ],
  },
];

/* ──────────────────────────────────────────
   Page Component
   ────────────────────────────────────────── */

export function FigmaComponentsPage() {
  const [sliderVal, setSliderVal] = useState(50);
  const [numberVal, setNumberVal] = useState(5);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  return (
    <div className="flex flex-col">
      {/* ════════════════ BUTTON ════════════════ */}
      <SectionTitle>Button</SectionTitle>

      <SubTitle>Variants × Sizes</SubTitle>
      <div className="flex flex-col gap-4">
        {buttonSizes.map((size) => (
          <div key={size} className="flex flex-col gap-2">
            <StateLabel>Size: {size}</StateLabel>
            <div className="flex flex-wrap gap-2 items-center">
              {buttonVariants.map((variant) => (
                <Button key={`${variant}-${size}`} variant={variant} size={size}>
                  {variant}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SubTitle>Variants × Hover</SubTitle>
      <div className="flex flex-wrap gap-2 items-center">
        {buttonVariants.map((variant) => (
          <Button
            key={`hover-${variant}`}
            variant={variant}
            size="md"
            className={buttonHoverClasses[variant]}
          >
            {variant}
          </Button>
        ))}
      </div>

      <SubTitle>Icon Buttons</SubTitle>
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="primary" size="sm" leftIcon={<IconPlus size={12} />}>
          Create
        </Button>
        <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
          Edit
        </Button>
        <Button variant="danger" size="sm" leftIcon={<IconTrash size={12} />}>
          Delete
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={<IconDownload size={12} />}
          aria-label="Download"
        />
        <Button variant="primary" size="md" rightIcon={<IconChevronDown size={14} />}>
          Dropdown
        </Button>
      </div>

      <SubTitle>States</SubTitle>
      <div className="flex flex-wrap gap-3 items-center">
        <VStack gap={1} align="center">
          <StateLabel>Default</StateLabel>
          <Button variant="primary" size="md">
            Default
          </Button>
        </VStack>
        <VStack gap={1} align="center">
          <StateLabel>Hover</StateLabel>
          <Button variant="primary" size="md" className="bg-[var(--color-action-primary-hover)]">
            Hover
          </Button>
        </VStack>
        <VStack gap={1} align="center">
          <StateLabel>Disabled</StateLabel>
          <Button variant="primary" size="md" disabled>
            Disabled
          </Button>
        </VStack>
        <VStack gap={1} align="center">
          <StateLabel>Loading</StateLabel>
          <Button variant="primary" size="md" loading>
            Loading
          </Button>
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Button"
        properties={[
          {
            name: 'Variant',
            type: 'Variant',
            values: 'primary | secondary | muted | ghost | outline | danger | warning | link',
          },
          { name: 'Size', type: 'Variant', values: 'sm | md | lg' },
          {
            name: 'State',
            type: 'Variant',
            values: 'default | hover | active | disabled | loading',
          },
          { name: 'Icon', type: 'Variant', values: 'none | left | right | icon-only' },
          { name: 'Label', type: 'Text', values: '"Button"' },
          { name: 'LeftIcon', type: 'Instance swap', values: 'icon slot' },
        ]}
        autoLayout={[
          { label: 'SM', direction: 'H', gap: '6px', padding: '6px 10px', height: '28px' },
          { label: 'MD', direction: 'H', gap: '6px', padding: '8px 12px', height: '32px' },
          { label: 'LG', direction: 'H', gap: '8px', padding: '10px 16px', height: '36px' },
        ]}
        radius="6px (--primitive-radius-md)"
        tokens={[
          { label: 'Primary hover', value: '--color-action-primary-hover' },
          { label: 'Secondary hover bg', value: '--button-secondary-hover-bg' },
          { label: 'Ghost hover bg', value: '--button-ghost-hover-bg' },
          { label: 'Danger hover', value: '--color-state-danger-hover' },
        ]}
        tips={[
          'Hover 상태는 CSS :hover로 동작하므로 Figma에서 별도 Variant로 추가 필요',
          'Icon-only 버튼은 정사각형 (padding 동일, label 없음)',
        ]}
      />

      {/* ════════════════ INPUT ════════════════ */}
      <SectionTitle>Input</SectionTitle>

      <SubTitle>Sizes</SubTitle>
      <div className="flex flex-col gap-3 max-w-md">
        <VStack gap={1}>
          <StateLabel>SM</StateLabel>
          <Input size="sm" placeholder="Small input" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>MD</StateLabel>
          <Input size="md" placeholder="Medium input" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>LG</StateLabel>
          <Input size="lg" placeholder="Large input" />
        </VStack>
      </div>

      <SubTitle>States</SubTitle>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl">
        <VStack gap={1}>
          <StateLabel>Default</StateLabel>
          <Input placeholder="Placeholder" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>With Value</StateLabel>
          <Input defaultValue="Some value" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Focus</StateLabel>
          <Input
            placeholder="Focused"
            className="border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]"
          />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled</StateLabel>
          <Input placeholder="Disabled" disabled />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Error</StateLabel>
          <Input placeholder="Error state" error />
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Input"
        properties={[
          { name: 'Size', type: 'Variant', values: 'sm | md | lg' },
          { name: 'State', type: 'Variant', values: 'default | focus | error | disabled' },
          { name: 'Placeholder', type: 'Text', values: '"Enter value..."' },
          { name: 'Value', type: 'Text', values: '(editable)' },
          { name: 'LeftElement', type: 'Boolean', values: 'true | false' },
          { name: 'RightElement', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'SM', direction: 'H', gap: '—', padding: '0 10px', height: '28px' },
          { label: 'MD', direction: 'H', gap: '—', padding: '0 10px', height: '32px' },
          { label: 'LG', direction: 'H', gap: '—', padding: '0 10px', height: '40px' },
        ]}
        radius="6px (--primitive-radius-md)"
        tokens={[
          { label: 'Focus border', value: '--input-border-focus (= --color-action-primary)' },
          { label: 'Focus ring', value: 'shadow 0 0 0 1px var(--input-border-focus)' },
        ]}
      />

      {/* ════════════════ NUMBER INPUT ════════════════ */}
      <SectionTitle>NumberInput</SectionTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <VStack gap={1}>
          <StateLabel>Default</StateLabel>
          <NumberInput min={0} max={100} value={numberVal} onChange={setNumberVal} width="xs" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>With Suffix</StateLabel>
          <NumberInput min={0} max={1000} value={256} onChange={() => {}} width="xs" suffix="GiB" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled</StateLabel>
          <NumberInput min={0} max={100} value={10} onChange={() => {}} width="xs" disabled />
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/NumberInput"
        properties={[
          { name: 'Value', type: 'Text', values: '(number)' },
          { name: 'Suffix', type: 'Text', values: '"GiB" (optional)' },
          { name: 'Disabled', type: 'Boolean', values: 'true | false' },
        ]}
        tokens={[
          { label: 'Arrow hover bg', value: '--color-surface-muted' },
          { label: 'Arrow hover text', value: '--color-text-default' },
          { label: 'Arrow active bg', value: '--color-border-subtle' },
        ]}
        tips={[
          'Stepper 화살표 hover: bg가 --color-surface-muted로 변경됨',
          'Figma에서 arrow 영역을 별도 Variant(default/hover/active)로 분리 권장',
        ]}
      />

      {/* ════════════════ SEARCH INPUT ════════════════ */}
      <SectionTitle>SearchInput</SectionTitle>
      <div className="max-w-sm">
        <SearchInput placeholder="Search resources..." size="sm" />
      </div>

      <FigmaGuide
        figmaName="TDS/Form/SearchInput"
        properties={[
          { name: 'Size', type: 'Variant', values: 'sm | md' },
          { name: 'Placeholder', type: 'Text', values: '"Search..."' },
        ]}
      />

      {/* ════════════════ TEXTAREA ════════════════ */}
      <SectionTitle>Textarea</SectionTitle>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <VStack gap={1}>
          <StateLabel>Default</StateLabel>
          <Textarea placeholder="Enter description..." />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled</StateLabel>
          <Textarea placeholder="Disabled" disabled />
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Textarea"
        properties={[
          { name: 'State', type: 'Variant', values: 'default | focus | disabled' },
          { name: 'Placeholder', type: 'Text', values: '"Enter text..."' },
        ]}
      />

      {/* ════════════════ SELECT ════════════════ */}
      <SectionTitle>Select</SectionTitle>
      <div className="grid grid-cols-2 gap-6 max-w-2xl">
        <VStack gap={1}>
          <StateLabel>Default</StateLabel>
          <Select options={sampleSelectOptions} placeholder="Select..." fullWidth />
        </VStack>
        <VStack gap={1}>
          <StateLabel>With Value</StateLabel>
          <Select options={sampleSelectOptions} value="option1" onChange={() => {}} fullWidth />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled</StateLabel>
          <Select options={sampleSelectOptions} placeholder="Disabled" disabled fullWidth />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Error</StateLabel>
          <Select options={sampleSelectOptions} placeholder="Error" error fullWidth />
        </VStack>
      </div>

      <SubTitle>Open (Dropdown) — Static</SubTitle>
      <div className="relative w-[240px]">
        <Select options={sampleSelectOptions} value="option1" onChange={() => {}} fullWidth />
        <div className="absolute top-full left-0 w-full mt-1 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] shadow-[var(--shadow-md)] z-10 py-1">
          {sampleSelectOptions.map((opt) => (
            <div
              key={opt.value}
              className={`px-[10px] py-[6px] text-body-md ${
                opt.value === 'option1'
                  ? 'bg-[var(--select-item-hover-bg)] text-[var(--color-text-default)] font-medium'
                  : 'text-[var(--color-text-default)]'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Select"
        properties={[
          { name: 'Size', type: 'Variant', values: 'sm | md' },
          { name: 'State', type: 'Variant', values: 'default | open | error | disabled' },
          { name: 'Placeholder', type: 'Text', values: '"Select..."' },
          { name: 'Value', type: 'Text', values: '(selected option text)' },
        ]}
        tokens={[
          { label: 'Item hover bg', value: '--select-item-hover-bg' },
          { label: 'Item font', value: '12px / 18px / 400 (body-md)' },
          { label: 'Item padding', value: '6px 10px' },
        ]}
        tips={[
          '드롭다운은 코드에서 createPortal 사용 — Figma에서는 Select + DropdownList로 분리',
          '선택된 아이템은 bg-[var(--select-item-hover-bg)]로 하이라이트',
        ]}
      />

      {/* ════════════════ CHECKBOX ════════════════ */}
      <SectionTitle>Checkbox</SectionTitle>
      <div className="flex flex-wrap gap-8 items-start">
        <VStack gap={1}>
          <StateLabel>Unchecked</StateLabel>
          <Checkbox label="Option" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Checked</StateLabel>
          <Checkbox label="Option" checked onChange={() => {}} />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Indeterminate</StateLabel>
          <Checkbox label="Option" indeterminate onChange={() => {}} />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Hover</StateLabel>
          <Checkbox
            label="Option"
            className="[&_span:first-of-type]:border-[var(--checkbox-border-hover)]"
          />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled</StateLabel>
          <Checkbox label="Disabled" disabled />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled Checked</StateLabel>
          <Checkbox label="Disabled" checked disabled onChange={() => {}} />
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Checkbox"
        properties={[
          { name: 'State', type: 'Variant', values: 'unchecked | checked | indeterminate' },
          { name: 'Disabled', type: 'Boolean', values: 'true | false' },
          { name: 'Label', type: 'Text', values: '"Option"' },
        ]}
        radius="4px (--primitive-radius-sm)"
        tokens={[
          { label: 'Hover border', value: '--checkbox-border-hover (= --color-action-primary)' },
          { label: 'Box size', value: '16px × 16px' },
          { label: 'Gap (label)', value: '6px' },
        ]}
      />

      {/* ════════════════ RADIO ════════════════ */}
      <SectionTitle>Radio</SectionTitle>
      <div className="flex flex-wrap gap-8 items-start">
        <VStack gap={1}>
          <StateLabel>Unselected</StateLabel>
          <Radio value="a" label="Option A" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Selected</StateLabel>
          <Radio value="b" label="Option B" checked onChange={() => {}} />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled</StateLabel>
          <Radio value="c" label="Disabled" disabled />
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Radio"
        properties={[
          { name: 'State', type: 'Variant', values: 'unselected | selected' },
          { name: 'Disabled', type: 'Boolean', values: 'true | false' },
          { name: 'Label', type: 'Text', values: '"Option"' },
        ]}
      />

      {/* ════════════════ TOGGLE ════════════════ */}
      <SectionTitle>Toggle</SectionTitle>
      <div className="flex flex-wrap gap-8 items-start">
        <VStack gap={1}>
          <StateLabel>Off</StateLabel>
          <Toggle label="Feature" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>On</StateLabel>
          <Toggle label="Feature" checked onChange={() => {}} />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled</StateLabel>
          <Toggle label="Disabled" disabled />
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Toggle"
        properties={[
          { name: 'State', type: 'Variant', values: 'off | on' },
          { name: 'Disabled', type: 'Boolean', values: 'true | false' },
          { name: 'Label', type: 'Text', values: '"Feature"' },
        ]}
      />

      {/* ════════════════ SLIDER ════════════════ */}
      <SectionTitle>Slider</SectionTitle>
      <div className="flex flex-col gap-6">
        <VStack gap={1}>
          <StateLabel>Default</StateLabel>
          <Slider min={0} max={100} value={sliderVal} onChange={setSliderVal} />
        </VStack>
        <VStack gap={1}>
          <StateLabel>With NumberInput</StateLabel>
          <HStack gap={3} align="center">
            <Slider min={0} max={100} value={sliderVal} onChange={setSliderVal} />
            <NumberInput min={0} max={100} value={sliderVal} onChange={setSliderVal} width="xs" />
          </HStack>
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled</StateLabel>
          <Slider min={0} max={100} value={30} onChange={() => {}} disabled />
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Slider"
        properties={[
          { name: 'State', type: 'Variant', values: 'default | disabled' },
          { name: 'Value', type: 'Text', values: '(number)' },
        ]}
        tips={['트랙 고정 너비 220px (--slider-track-width)']}
      />

      {/* ════════════════ BADGE ════════════════ */}
      <SectionTitle>Badge</SectionTitle>
      {badgeTypes.map((type) => (
        <div key={type}>
          <SubTitle>Type: {type}</SubTitle>
          {badgeSizes.map((size) => (
            <div key={`${type}-${size}`} className="mb-3">
              <StateLabel>Size: {size}</StateLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {badgeThemes.map((theme) => (
                  <Badge key={`${type}-${size}-${theme}`} type={type} theme={theme} size={size}>
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <SubTitle>With Dot</SubTitle>
      <div className="flex flex-wrap gap-2">
        {badgeThemes.map((theme) => (
          <Badge key={`dot-${theme}`} theme={theme} type="subtle" size="sm" dot>
            {theme}
          </Badge>
        ))}
      </div>

      <FigmaGuide
        figmaName="TDS/Data/Badge"
        properties={[
          { name: 'Theme', type: 'Variant', values: 'blue | red | green | yellow | gray | white' },
          { name: 'Type', type: 'Variant', values: 'solid | subtle' },
          { name: 'Size', type: 'Variant', values: 'sm | md | lg' },
          { name: 'Dot', type: 'Boolean', values: 'true | false' },
          { name: 'Label', type: 'Text', values: '"Badge"' },
        ]}
        autoLayout={[
          { label: 'SM', direction: 'H', gap: '4px', padding: '2px 6px' },
          { label: 'MD', direction: 'H', gap: '4px', padding: '4px 8px' },
          { label: 'LG', direction: 'H', gap: '4px', padding: '4px 12px' },
        ]}
        radius="4px (--primitive-radius-sm)"
      />

      {/* ════════════════ CHIP ════════════════ */}
      <SectionTitle>Chip</SectionTitle>
      <div className="flex flex-wrap gap-3 items-center">
        <VStack gap={1}>
          <StateLabel>Default</StateLabel>
          <Chip label="Label" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Selected</StateLabel>
          <Chip label="Selected" selected />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Removable</StateLabel>
          <Chip label="Removable" onRemove={() => {}} />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Disabled</StateLabel>
          <Chip label="Disabled" disabled />
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Data/Chip"
        properties={[
          { name: 'State', type: 'Variant', values: 'default | selected | disabled' },
          { name: 'Removable', type: 'Boolean', values: 'true | false' },
          { name: 'Label', type: 'Text', values: '"Label"' },
        ]}
      />

      {/* ════════════════ STATUS INDICATOR ════════════════ */}
      <SectionTitle>StatusIndicator</SectionTitle>
      <SubTitle>All Statuses (icon-only)</SubTitle>
      <div className="flex flex-wrap gap-4">
        {statusTypes.map((status) => (
          <VStack key={status} gap={1} align="center">
            <Tooltip content={status}>
              <StatusIndicator status={status} />
            </Tooltip>
            <StateLabel>{status}</StateLabel>
          </VStack>
        ))}
      </div>
      <SubTitle>With Label</SubTitle>
      <div className="flex flex-wrap gap-4">
        {(['active', 'error', 'building', 'pending', 'shutoff', 'paused'] as const).map(
          (status) => (
            <StatusIndicator key={`label-${status}`} status={status} layout="dot-label" />
          )
        )}
      </div>

      <FigmaGuide
        figmaName="TDS/Data/StatusIndicator"
        properties={[
          {
            name: 'Status',
            type: 'Variant',
            values: 'active | error | building | deleting | pending | shutoff | paused | ...',
          },
          { name: 'Layout', type: 'Variant', values: 'icon-only | dot-label' },
        ]}
        radius="9999px (pill)"
        tokens={[
          { label: 'Active bg', value: '--status-success-bg (green)' },
          { label: 'Error bg', value: '--status-danger-bg (red)' },
          { label: 'Building bg', value: '--status-info-bg (blue)' },
          { label: 'Shutoff bg', value: '--status-muted-bg (gray)' },
        ]}
      />

      {/* ════════════════ PAGINATION ════════════════ */}
      <SectionTitle>Pagination</SectionTitle>
      <SubTitle>Page 1 (first)</SubTitle>
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
        totalItems={100}
        showSettings
      />
      <SubTitle>Page 5 (middle — active item visible)</SubTitle>
      <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} totalItems={100} />

      <FigmaGuide
        figmaName="TDS/Data/Pagination"
        properties={[
          { name: 'CurrentPage', type: 'Text', values: '(number)' },
          { name: 'ShowSettings', type: 'Boolean', values: 'true | false' },
        ]}
        tips={['활성 페이지 번호는 primary color + font-weight medium']}
      />

      {/* ════════════════ PROGRESS BAR ════════════════ */}
      <SectionTitle>ProgressBar</SectionTitle>
      <div className="flex flex-col gap-4 max-w-md">
        <VStack gap={1}>
          <StateLabel>Info (50%)</StateLabel>
          <ProgressBar value={50} status="info" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Success (50%)</StateLabel>
          <ProgressBar value={50} status="success" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Warning (70%)</StateLabel>
          <ProgressBar value={70} status="warning" />
        </VStack>
        <VStack gap={1}>
          <StateLabel>Danger (95%)</StateLabel>
          <ProgressBar value={95} status="danger" />
        </VStack>
      </div>

      <FigmaGuide
        figmaName="TDS/Data/ProgressBar"
        properties={[
          {
            name: 'Status',
            type: 'Variant',
            values: 'info | success | warning | danger | neutral',
          },
          { name: 'Value', type: 'Text', values: '(0–100)' },
        ]}
        tokens={[
          { label: 'Info fill', value: '--color-state-info (blue)' },
          { label: 'Success fill', value: '--color-state-success (green)' },
          { label: 'Warning fill', value: '--color-state-warning (orange)' },
          { label: 'Danger fill', value: '--color-state-danger (red)' },
          { label: 'Track bg', value: '--color-border-subtle' },
        ]}
        tips={[
          'status 미지정 시 자동: <70% success, 70-94% warning, ≥95% danger',
          'Figma에서는 status를 명시적 Variant로 관리 권장',
        ]}
      />

      {/* ════════════════ TABS ════════════════ */}
      <SectionTitle>Tabs</SectionTitle>

      <SubTitle>Underline</SubTitle>
      <Tabs value="tab1" onChange={() => {}} variant="underline" size="sm">
        <TabList>
          <Tab value="tab1">Active</Tab>
          <Tab value="tab2">Inactive</Tab>
          <Tab value="tab3" className="text-[var(--tabs-hover-color)]">
            Hover
          </Tab>
        </TabList>
        <TabPanel value="tab1">
          <div className="p-4 text-body-md text-[var(--color-text-muted)]">Tab content area</div>
        </TabPanel>
      </Tabs>

      <SubTitle>Boxed</SubTitle>
      <Tabs value="tab1" onChange={() => {}} variant="boxed" size="sm">
        <TabList>
          <Tab value="tab1">Active</Tab>
          <Tab value="tab2">Inactive</Tab>
          <Tab value="tab3" className="bg-[var(--color-surface-default)]">
            Hover
          </Tab>
        </TabList>
        <TabPanel value="tab1">
          <div className="p-4 text-body-md text-[var(--color-text-muted)]">Tab content area</div>
        </TabPanel>
      </Tabs>

      <FigmaGuide
        figmaName="TDS/Navigation/Tabs"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'underline | boxed' },
          { name: 'Size', type: 'Variant', values: 'sm | md' },
          { name: 'Tab State', type: 'Variant', values: 'active | inactive | hover' },
          { name: 'Label', type: 'Text', values: '"Tab"' },
        ]}
        tokens={[
          { label: 'Active color', value: '--tabs-active-color (= --color-action-primary)' },
          { label: 'Inactive color', value: '--tabs-inactive-color (= --color-text-subtle)' },
          {
            label: 'Hover color (underline)',
            value: '--tabs-hover-color (= --color-text-default)',
          },
          { label: 'Hover bg (boxed)', value: '--color-surface-default' },
        ]}
      />

      {/* ════════════════ BREADCRUMB ════════════════ */}
      <SectionTitle>Breadcrumb</SectionTitle>
      <Breadcrumb
        items={[
          { label: 'Project-1', href: '#' },
          { label: 'Compute', href: '#' },
          { label: 'Instances' },
        ]}
      />

      <FigmaGuide
        figmaName="TDS/Navigation/Breadcrumb"
        properties={[{ name: 'Items', type: 'Text', values: '(breadcrumb labels)' }]}
        tips={['마지막 아이템은 링크 없이 현재 페이지를 표시']}
      />

      {/* ════════════════ INLINE MESSAGE ════════════════ */}
      <SectionTitle>InlineMessage</SectionTitle>
      <div className="flex flex-col gap-3 max-w-lg">
        {inlineMessageVariants.map((variant) => (
          <InlineMessage key={variant} variant={variant}>
            This is a {variant} inline message.
          </InlineMessage>
        ))}
      </div>

      <FigmaGuide
        figmaName="TDS/Feedback/InlineMessage"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'info | success | warning | error' },
          { name: 'Message', type: 'Text', values: '"Message content"' },
        ]}
      />

      {/* ════════════════ LOADING ════════════════ */}
      <SectionTitle>Loading</SectionTitle>
      <div className="flex gap-6 items-center">
        <Loading size="sm" />
        <Loading size="md" />
        <Loading size="lg" />
      </div>

      <FigmaGuide
        figmaName="TDS/Feedback/Loading"
        properties={[{ name: 'Size', type: 'Variant', values: 'sm | md | lg' }]}
        tips={['Figma에서 spinner는 static frame으로 캡처 (애니메이션 없음)']}
      />

      {/* ════════════════ EMPTY STATE ════════════════ */}
      <SectionTitle>EmptyState</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmptyState
          icon={<IconDatabase size={48} stroke={1} />}
          title="No instances found"
          description="Create your first instance to get started."
          action={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
              Create Instance
            </Button>
          }
        />
        <EmptyState
          variant="inline"
          icon={<IconSearch size={48} stroke={1} />}
          title="No results found"
          description="Try adjusting your search or filter criteria."
        />
      </div>

      <FigmaGuide
        figmaName="TDS/Feedback/EmptyState"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'card | inline' },
          { name: 'Title', type: 'Text', values: '"No items found"' },
          { name: 'Description', type: 'Text', values: '"Description"' },
          { name: 'HasAction', type: 'Boolean', values: 'true | false' },
          { name: 'Icon', type: 'Instance swap', values: 'icon slot' },
        ]}
      />

      {/* ════════════════ ERROR STATE ════════════════ */}
      <SectionTitle>ErrorState</SectionTitle>
      <ErrorState
        icon={<IconAlertTriangle size={48} stroke={1} />}
        title="Something went wrong"
        description="An unexpected error occurred. Please try again later."
        action={
          <Button variant="secondary" size="md">
            Retry
          </Button>
        }
      />

      <FigmaGuide
        figmaName="TDS/Feedback/ErrorState"
        properties={[
          { name: 'Title', type: 'Text', values: '"Error title"' },
          { name: 'Description', type: 'Text', values: '"Error description"' },
          { name: 'HasAction', type: 'Boolean', values: 'true | false' },
        ]}
      />

      {/* ════════════════ FORM FIELD ════════════════ */}
      <SectionTitle>FormField</SectionTitle>
      <div className="flex flex-col gap-6 max-w-md">
        <FormField label="Instance Name" helperText="2-64 characters" required>
          <Input placeholder="Enter name" fullWidth />
        </FormField>
        <FormField
          label="Region"
          description="Select your preferred region"
          helperText="Changes after creation are not allowed"
          required
        >
          <Select options={sampleSelectOptions} placeholder="Select region" fullWidth />
        </FormField>
        <FormField
          label="Password"
          errorMessage="Password must be at least 8 characters."
          error
          required
        >
          <Input type="password" fullWidth error />
        </FormField>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/FormField"
        properties={[
          { name: 'Label', type: 'Text', values: '"Field Label"' },
          { name: 'Required', type: 'Boolean', values: 'true | false' },
          { name: 'Error', type: 'Boolean', values: 'true | false' },
          { name: 'HasDescription', type: 'Boolean', values: 'true | false' },
          { name: 'HasHelperText', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[{ label: 'Default', direction: 'V', gap: '8px', padding: '0' }]}
        tips={[
          'Label ↔ Input: 8px, Label ↔ Description: 4px, Input ↔ HelperText: 8px',
          'Error 시 helperText 대신 errorMessage가 빨간색으로 표시됨',
        ]}
      />

      {/* ════════════════ SECTION CARD ════════════════ */}
      <SectionTitle>SectionCard</SectionTitle>
      <div className="flex flex-col gap-4">
        <SectionCard>
          <SectionCard.Header
            title="Basic Information"
            actions={
              <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
                Edit
              </Button>
            }
          />
          <SectionCard.Content>
            <SectionCard.DataRow label="Name" value="instance-01" />
            <SectionCard.DataRow label="Status">
              <StatusIndicator status="active" layout="dot-label" />
            </SectionCard.DataRow>
            <SectionCard.DataRow label="Created" value="2026-02-20 14:30:00" />
          </SectionCard.Content>
        </SectionCard>
        <SectionCard isActive>
          <SectionCard.Header title="Active Section (Wizard)" />
          <SectionCard.Content>
            <SectionCard.DataRow label="Setting A" value="Configured" />
          </SectionCard.Content>
        </SectionCard>
      </div>

      <FigmaGuide
        figmaName="TDS/Layout/SectionCard"
        properties={[
          { name: 'State', type: 'Variant', values: 'default | active | done' },
          { name: 'Title', type: 'Text', values: '"Section Title"' },
          { name: 'HasAction', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[{ label: 'Default', direction: 'V', gap: '16px', padding: '16px' }]}
        radius="8px (--primitive-radius-lg)"
      />

      {/* ════════════════ DETAIL HEADER ════════════════ */}
      <SectionTitle>DetailHeader</SectionTitle>
      <DetailHeader>
        <DetailHeader.Title>instance-production-01</DetailHeader.Title>
        <DetailHeader.Actions>
          <Button variant="secondary" size="sm" leftIcon={<IconTerminal2 size={12} />}>
            Console
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
            Start
          </Button>
          <ContextMenu items={contextMenuItems} trigger="click">
            <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
              More Actions
            </Button>
          </ContextMenu>
        </DetailHeader.Actions>
        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard label="Status" status="active" />
          <DetailHeader.InfoCard label="ID" value="i-0123456789abcdef" copyable />
          <DetailHeader.InfoCard label="Host" value="compute-node-03" />
          <DetailHeader.InfoCard label="Created at" value="2026-02-20 14:30" />
        </DetailHeader.InfoGrid>
      </DetailHeader>

      <FigmaGuide
        figmaName="TDS/Layout/DetailHeader"
        properties={[
          { name: 'Title', type: 'Text', values: '"Resource Name"' },
          { name: 'CardCount', type: 'Variant', values: '4 | 5 | 6 | 7 | 8' },
        ]}
        tips={[
          'InfoGrid 레이아웃: 1-4 cards → 1행, 5 → 3/2, 6 → 4/2, 7 → 4/3, 8 → 4/4',
          'Status는 항상 첫 번째 InfoCard에 배치',
          'ID는 copyable 속성으로 클립보드 복사 기능 제공',
        ]}
      />

      {/* ════════════════ PAGE HEADER ════════════════ */}
      <SectionTitle>PageHeader</SectionTitle>
      <PageHeader
        title="Instances"
        actions={
          <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
            Create Instance
          </Button>
        }
      />

      <FigmaGuide
        figmaName="TDS/Layout/PageHeader"
        properties={[
          { name: 'Title', type: 'Text', values: '"Page Title"' },
          { name: 'HasActions', type: 'Boolean', values: 'true | false' },
        ]}
      />

      {/* ════════════════ INFO BOX ════════════════ */}
      <SectionTitle>InfoBox</SectionTitle>
      <InfoBox.Group>
        <InfoBox label="Resource Name" value="my-deployment" />
        <InfoBox label="Namespace" value="default" />
        <InfoBox label="Created at" value="2026-02-06 14:30:00" />
      </InfoBox.Group>

      <FigmaGuide
        figmaName="TDS/Data/InfoBox"
        properties={[
          { name: 'Label', type: 'Text', values: '"Label"' },
          { name: 'Value', type: 'Text', values: '"Value"' },
        ]}
        tips={['InfoBox.Group은 grid 레이아웃으로 균등 분할']}
      />

      {/* ════════════════ METRIC CARD ════════════════ */}
      <SectionTitle>MetricCard</SectionTitle>
      <MetricCard.Group>
        <MetricCard title="Pod restarts" value={3} tooltip="Total restarts." />
        <MetricCard title="CPU usage" value="45%" tooltip="Current CPU utilization." />
        <MetricCard title="Memory" value="1.2 GB" tooltip="Current memory." />
      </MetricCard.Group>

      <FigmaGuide
        figmaName="TDS/Data/MetricCard"
        properties={[
          { name: 'Title', type: 'Text', values: '"Metric"' },
          { name: 'Value', type: 'Text', values: '"Value"' },
          { name: 'HasTooltip', type: 'Boolean', values: 'true | false' },
        ]}
      />

      {/* ════════════════ LIST TOOLBAR ════════════════ */}
      <SectionTitle>ListToolbar</SectionTitle>
      <ListToolbar
        primaryActions={
          <ListToolbar.Actions>
            <FilterSearchInput
              filters={filterFields}
              appliedFilters={appliedFilters}
              onFiltersChange={setAppliedFilters}
              placeholder="Search by attributes"
              size="sm"
              className="w-[var(--search-input-width)]"
              hideAppliedFilters
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<IconDownload size={12} />}
              aria-label="Download"
            />
          </ListToolbar.Actions>
        }
        bulkActions={
          <ListToolbar.Actions>
            <Button variant="muted" size="sm" leftIcon={<IconPlayerPlay size={12} />} disabled>
              Start
            </Button>
            <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled>
              Delete
            </Button>
          </ListToolbar.Actions>
        }
      />

      <FigmaGuide
        figmaName="TDS/Layout/ListToolbar"
        properties={[
          { name: 'HasBulkActions', type: 'Boolean', values: 'true | false' },
          { name: 'HasFilters', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[{ label: 'Default', direction: 'H', gap: '8px', padding: '0' }]}
      />

      {/* ════════════════ CONTEXT MENU ════════════════ */}
      <SectionTitle>ContextMenu</SectionTitle>
      <div className="flex gap-4">
        <ContextMenu items={contextMenuItems} trigger="click">
          <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
            Actions
          </Button>
        </ContextMenu>
      </div>

      <FigmaGuide
        figmaName="TDS/Overlay/ContextMenu"
        properties={[{ name: 'Items', type: 'Text', values: '(menu items)' }]}
        tips={[
          'divider는 아이템의 divider: true 속성으로 구분선 표시',
          'danger 아이템은 빨간색 텍스트',
          'submenu 지원: 하위 메뉴 아이템 포함 가능',
        ]}
      />
    </div>
  );
}
