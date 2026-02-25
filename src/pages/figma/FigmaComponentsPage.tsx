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
  IconCheck,
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
          '8개 Variant × 3 Size × 5 State = 최대 120 조합. 필요한 조합만 선택적으로 생성 권장',
          'Hover/Active 상태는 CSS로 동작하므로 Figma에서 별도 Variant 값으로 추가',
          'Icon 속성을 none/left/right/icon-only로 분리하여 아이콘 유무와 위치를 제어',
          'Icon-only 버튼은 정사각형 (좌우 패딩 동일, Label 텍스트 숨김)',
          'Loading 상태: Label 텍스트 + Spinner 아이콘 조합, opacity 0.7 적용',
          'Disabled 상태: opacity 0.5, 커서 변경 불가하므로 시각적으로만 구분',
          'link Variant는 배경/테두리 없이 텍스트만. hover 시 underline 추가',
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
          { label: 'Error border', value: '--input-border-error (= --color-state-danger)' },
          { label: 'Disabled bg', value: '--input-bg-disabled' },
        ]}
        tips={[
          'Focus 상태: border 색상 변경 + 바깥에 1px ring 추가 (shadow로 구현됨). Figma에서는 Stroke + Effect(Inner Shadow 또는 Drop Shadow)로 재현',
          'LeftElement/RightElement: 아이콘·버튼 슬롯. Boolean으로 on/off 처리하고, Instance swap으로 내용물 교체',
          'Placeholder vs Value: 텍스트 레이어를 하나로 두고, Placeholder일 때 색상을 --color-text-muted로 변경',
          'Error 상태는 border가 빨간색으로 변경. helperText 색상도 danger로 바뀌므로 FormField와 조합 시 주의',
          'Disabled 상태: 배경색이 --input-bg-disabled로 변경되고 텍스트가 흐려짐',
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
          'Stepper 화살표(▲▼) hover: bg가 --color-surface-muted로, active: --color-border-subtle로 변경됨',
          'Figma에서 arrow 영역을 별도 nested component로 분리하고 State(default/hover/active) Variant 부여',
          'Suffix(GiB 등)는 입력 필드 오른쪽에 고정 텍스트로 표시. Text 속성으로 제어',
          'Input + 좌우 Arrow로 구성된 Auto Layout. 중앙의 숫자 영역은 fill container',
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
        tips={[
          'Input 컴포넌트를 기반으로 왼쪽에 검색 아이콘(IconSearch)이 고정된 구조',
          'Figma에서 TDS/Form/Input에 LeftElement=true + 아이콘 인스턴스로 조합하거나, 별도 SearchInput 컴포넌트로 생성',
          '입력값이 있을 때 오른쪽에 X(clear) 버튼이 나타남. Boolean 속성으로 제어',
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
          { name: 'State', type: 'Variant', values: 'default | focus | disabled | error' },
          { name: 'Placeholder', type: 'Text', values: '"Enter text..."' },
        ]}
        radius="6px (--primitive-radius-md)"
        tips={[
          'Input과 동일한 border/focus 토큰 사용. 높이만 다름 (min-height: 80px, 리사이즈 가능)',
          'Focus 상태: Input과 동일하게 border + ring. Figma에서는 Stroke + Effect로 재현',
          '우하단 리사이즈 핸들은 Figma에서 장식용 아이콘으로 추가 (실제 동작 안 함)',
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
      <div className="relative w-[240px] mb-[120px]">
        <Select options={sampleSelectOptions} value="option1" onChange={() => {}} fullWidth />
        <div className="absolute top-full left-0 w-full mt-1 bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] z-10 overflow-hidden">
          {sampleSelectOptions.map((opt, idx) => {
            const isSelected = opt.value === 'option1';
            return (
              <div
                key={opt.value}
                className={[
                  'flex items-center justify-between',
                  'px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)]',
                  'text-[length:var(--select-item-font-size)] leading-[var(--select-item-line-height)] font-[number:var(--font-weight-regular)]',
                  idx < sampleSelectOptions.length - 1
                    ? 'border-b border-[var(--color-border-subtle)]'
                    : '',
                  isSelected
                    ? 'bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)]'
                    : 'text-[var(--color-text-default)]',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <IconCheck
                    size={14}
                    className="shrink-0 text-[var(--select-item-selected-text)]"
                  />
                )}
              </div>
            );
          })}
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
          { label: 'Menu bg', value: '--select-menu-bg (= surface-default)' },
          { label: 'Menu border', value: '--select-menu-border (= border-strong)' },
          { label: 'Menu radius', value: '--select-menu-radius (= radius-md, 6px)' },
          { label: 'Menu shadow', value: '--select-menu-shadow (= shadow-sm)' },
          { label: 'Item hover bg', value: '--select-item-hover-bg' },
          { label: 'Item selected bg', value: '--select-item-selected-bg (= blue-50)' },
          { label: 'Item selected text', value: '--select-item-selected-text (= primary)' },
          { label: 'Item font', value: '12px / 18px / 400 (body-md)' },
          { label: 'Item padding', value: '6px 10px' },
        ]}
        tips={[
          '드롭다운은 코드에서 createPortal로 body에 렌더링됨. Figma에서는 Trigger(Select)와 DropdownList를 별도 컴포넌트로 분리',
          'DropdownList: overflow-hidden + 각 아이템 사이 border-b로 구분선. 마지막 아이템은 구분선 없음',
          '선택된 아이템: 배경 --select-item-selected-bg + 텍스트 --select-item-selected-text + 우측 체크 아이콘(14px)',
          'Hover 아이템: 배경 --select-item-hover-bg로 변경',
          'Trigger의 chevron 아이콘은 open 시 180도 회전. Figma에서는 State=open일 때 회전된 아이콘 사용',
          'Focus 상태: border가 primary color로 변경 + 1px ring 추가 (Input과 동일한 패턴)',
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
          { label: 'Checked bg', value: '--color-action-primary (blue)' },
          { label: 'Box size', value: '16px × 16px' },
          { label: 'Gap (label)', value: '6px' },
        ]}
        tips={[
          '체크박스 = Box(16×16) + Label 텍스트의 수평 Auto Layout. gap: 6px',
          'Box 내부: unchecked → 빈 박스(border만), checked → 파란 배경 + 흰색 체크 아이콘, indeterminate → 파란 배경 + 흰색 마이너스 아이콘',
          'Hover 상태: Box의 border 색상이 --checkbox-border-hover(primary)로 변경됨. Figma에서 Variant로 hover 상태 추가',
          'Disabled+Checked: 배경이 흐려지고(opacity 감소) 커서 변경 불가',
          'Label이 없는 체크박스도 가능 (테이블 선택 컬럼 등). Label을 빈 문자열로 두거나 Boolean으로 제어',
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
        tokens={[
          { label: 'Selected fill', value: '--color-action-primary (blue)' },
          { label: 'Circle size', value: '16px (외부), 6px (내부 dot)' },
          { label: 'Gap (label)', value: '6px' },
        ]}
        tips={[
          'Radio = Circle(16×16) + Label의 수평 Auto Layout. gap: 6px',
          'Selected: 외부 원 border가 primary + 내부에 6px 파란색 원(dot)',
          'Unselected: 외부 원 border만 표시 (border-default 색상)',
          'Hover 상태: Checkbox와 동일하게 border가 primary로 변경. 필요 시 Variant 추가',
          'RadioGroup으로 사용 시 세로(VStack gap-3) 또는 가로(HStack gap-4) 배치',
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
        tokens={[
          { label: 'On bg', value: '--color-action-primary (blue)' },
          { label: 'Off bg', value: '--color-border-default (gray)' },
          { label: 'Thumb', value: 'white, 12px circle' },
          { label: 'Track size', value: '32px × 18px' },
        ]}
        tips={[
          'Track(32×18) + Thumb(12px white circle) 구조. Thumb 위치로 on/off 구분',
          'On: Track bg가 primary, Thumb이 오른쪽. Off: Track bg가 gray, Thumb이 왼쪽',
          'Figma에서 Thumb 위치는 Variant 전환으로 처리 (Auto Layout의 정렬 변경 또는 absolute position)',
          'Label은 Toggle 왼쪽에 위치. Label ↔ Toggle 간격: 12px',
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
        tokens={[
          { label: 'Track width', value: '220px (--slider-track-width) 고정' },
          { label: 'Track height', value: '4px' },
          { label: 'Thumb size', value: '14px circle' },
          { label: 'Filled track', value: '--color-action-primary (blue)' },
          { label: 'Empty track', value: '--color-border-default (gray)' },
        ]}
        tips={[
          'Track(220px × 4px) + Thumb(14px circle) 구조. Filled 영역과 Empty 영역으로 나뉨',
          'Figma에서 Thumb 위치는 비율(%)에 따라 수동 조정하거나, Value를 표시용 텍스트로만 활용',
          'NumberInput과 조합: Slider + NumberInput을 수평 Auto Layout으로 배치. gap: 12px',
          'Disabled: Track과 Thumb 모두 opacity 감소',
          'showValue 옵션: Thumb 위에 현재 값을 표시하는 tooltip 형태',
        ]}
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
        tips={[
          '6 Theme × 2 Type × 3 Size = 36 조합 + Dot 옵션. 필요한 조합만 생성 권장',
          'solid: 배경 진하고 텍스트 흰색. subtle: 배경 연하고 텍스트 진한색',
          'Dot: 라벨 왼쪽에 6px 원형 dot 추가. Boolean으로 on/off',
          'Auto Layout: 수평 방향, 텍스트는 hug contents, 아이콘/dot이 있을 때 gap 4px',
        ]}
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
        radius="9999px (pill)"
        tokens={[
          { label: 'Default bg', value: '--color-surface-subtle' },
          { label: 'Selected bg', value: '--color-action-primary + text white' },
          { label: 'Remove icon', value: 'IconX, 12px' },
        ]}
        tips={[
          'pill 형태(radius 9999px). 수평 Auto Layout: Label + (optional) Remove 아이콘',
          'Selected: 배경이 primary, 텍스트가 white로 전환',
          'Removable: 우측에 X 아이콘 표시. Boolean 속성으로 표시/숨김 제어',
          '태그, 필터 표시 등에 사용. Badge와 용도 구분: Chip은 인터랙티브(선택/삭제 가능), Badge는 읽기 전용',
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
        tips={[
          '16가지 이상의 Status가 있으므로 Variant 값을 전부 나열. 색상이 유사한 것끼리 그룹핑 가능',
          'icon-only: 원형(pill) 배경에 색상만 표시. 작은 공간(테이블 셀 등)에 사용',
          'dot-label: 좌측에 작은 dot(6px) + 우측에 라벨 텍스트. font-size 11px',
          'Figma에서 Status별 색상을 Color Style로 등록해 두면 관리 편리',
          'Tooltip과 조합: icon-only일 때 Tooltip으로 status 라벨을 표시하는 패턴이 일반적',
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
        tips={[
          '활성 페이지 번호는 primary color + font-weight medium으로 강조',
          '구조: 좌측 Info(총 아이템 수) + 중앙 페이지 번호들 + 우측 Settings 아이콘. 수평 Auto Layout',
          '페이지 번호 버튼: 각각 min-width 24px, 중앙 정렬. 활성/비활성 상태를 Variant로',
          'Prev/Next 화살표: 첫 페이지에서 Prev 비활성, 마지막 페이지에서 Next 비활성',
          'Settings 아이콘(톱니바퀴): 페이지당 행 수 설정 팝오버 트리거. Boolean으로 표시/숨김',
        ]}
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
          'status 미지정 시 자동 색상 결정: <70% info, 70-94% warning, ≥95% danger. Figma에서는 status를 명시적 Variant로 관리 권장',
          '구조: Track(전체 바, 높이 4px) + Fill(채워진 부분). Fill의 width를 %로 조절',
          'Figma에서 Fill width는 수동 조절하거나, 대표 값(25%, 50%, 75%, 100%)만 Variant로 생성',
          'Track 배경: --color-border-subtle (연한 회색). Fill 색상: status별 토큰 참조',
          'border-radius: Track과 Fill 모두 9999px (pill)',
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
          { label: 'Underline indicator', value: '2px, --color-action-primary' },
        ]}
        tips={[
          'Underline: 하단에 2px 인디케이터 바. active 탭 아래에만 표시. Figma에서 Rectangle(2px) + absolute bottom',
          'Boxed: 탭들이 둥근 배경(surface-muted) 안에 배치. active 탭은 흰 배경 + shadow로 돌출 효과',
          'Tab 아이템은 개별 컴포넌트로 생성: State(active/inactive/hover) Variant 부여',
          'TabList는 Tab 아이템들의 수평 Auto Layout. gap: 0 (underline) 또는 2px (boxed)',
          'Hover: underline은 텍스트 색상만 변경, boxed는 배경색 추가. 각각 Variant로 처리',
          'Size: sm은 text-body-sm, md는 text-body-md. padding도 Size에 따라 변경',
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
        properties={[
          { name: 'Items', type: 'Text', values: '(breadcrumb labels)' },
          { name: 'ItemCount', type: 'Variant', values: '2 | 3 | 4 | 5' },
        ]}
        tips={[
          '구조: [Link] > [Link] > [CurrentPage]. 수평 Auto Layout, gap 4px',
          'separator: chevron-right 아이콘(12px). 아이템 사이에 자동 삽입',
          '마지막 아이템은 링크 없이 현재 페이지명 표시 (텍스트 색상: text-default, 링크 아이템은 text-muted)',
          'Figma에서 BreadcrumbItem(Link) + BreadcrumbSeparator + BreadcrumbCurrent를 조합',
          'ItemCount를 Variant로 두거나, 아이템을 가변 개수로 처리 (Auto Layout + 복제)',
        ]}
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
          { name: 'Closable', type: 'Boolean', values: 'true | false' },
        ]}
        tokens={[
          { label: 'Info', value: 'bg: state-info-bg, icon/border: state-info' },
          { label: 'Success', value: 'bg: state-success-bg, icon/border: state-success' },
          { label: 'Warning', value: 'bg: state-warning-bg, icon/border: state-warning' },
          { label: 'Error', value: 'bg: state-danger-bg, icon/border: state-danger' },
        ]}
        radius="6px (--primitive-radius-md)"
        tips={[
          '구조: 좌측 아이콘 + 메시지 텍스트 + (optional) 우측 닫기 버튼. 수평 Auto Layout',
          '좌측 아이콘은 Variant별로 자동 결정: info → InfoCircle, success → CircleCheck, warning → AlertTriangle, error → AlertCircle',
          '배경색과 border-left(2px)가 Variant별로 다름. Figma에서 Color Style로 관리',
          'Closable: 우측에 X 아이콘 표시. Boolean 속성으로 제어',
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
        properties={[
          { name: 'Size', type: 'Variant', values: 'sm | md | lg' },
          { name: 'Variant', type: 'Variant', values: 'spinner | progress | button' },
        ]}
        tokens={[
          { label: 'Spinner sizes', value: 'sm: 16px, md: 22px, lg: 32px' },
          { label: 'Spinner color', value: '--color-action-primary (blue)' },
        ]}
        tips={[
          'Figma에서 spinner는 static frame으로 캡처 (CSS 애니메이션 재현 불가)',
          'spinner Variant: 원형 아이콘 + 하단 텍스트 "Loading". 수직 Auto Layout',
          'progress Variant: 텍스트 + ProgressBar + statusText 조합. 별도 컴포넌트로 생성 권장',
          'button Variant: 기존 Button 컴포넌트의 loading 상태와 동일. Button State=loading으로 대체 가능',
        ]}
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
        tokens={[
          { label: 'Card padding', value: '64px (p-16)' },
          { label: 'Inline padding-y', value: '80px (py-20)' },
          { label: 'Icon color', value: '--color-text-disabled' },
          { label: 'Title', value: 'heading-h5 (16px/24px semibold)' },
          { label: 'Description', value: 'body-lg (14px/20px), text-subtle, max-w-md' },
          {
            label: 'Content gap',
            value: '16px (icon ↔ text), 8px (title ↔ desc), 8px (desc ↔ action)',
          },
        ]}
        radius="8px (--primitive-radius-lg) — card variant만"
        tips={[
          'card: 테두리(border-subtle) + 배경(surface-default) + 큰 패딩. 독립 영역에서 사용',
          'inline: 패딩만 있고 테두리/배경 없음. 이미 카드/패널 안에 배치될 때 사용 (중복 테두리 방지)',
          '수직 Auto Layout: 아이콘 → 제목+설명 → 액션 버튼. 모두 중앙 정렬',
          'Icon: 48px, stroke 1. Instance swap으로 상황에 맞는 아이콘 교체 (IconDatabase, IconSearch, IconFolder 등)',
          'Action: 주로 Button(primary, md) + 좌측 아이콘. HasAction=false면 버튼 영역 숨김',
          'Description과 Action은 각각 optional. Boolean으로 표시/숨김 제어',
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
          { name: 'Icon', type: 'Instance swap', values: 'icon slot' },
        ]}
        tokens={[
          { label: 'Icon color', value: '--color-state-danger (red)' },
          { label: 'Title', value: 'heading-h5, mb-8px' },
          { label: 'Description', value: 'body-md, text-muted, mb-16px' },
          { label: 'Padding-y', value: '80px (py-20)' },
        ]}
        tips={[
          'EmptyState와 유사한 구조이나 아이콘 색상이 danger(red). 별도 컴포넌트로 생성',
          '수직 Auto Layout: 아이콘 → 제목 → 설명 → 액션 버튼. 모두 중앙 정렬',
          'Action: 주로 Retry 버튼(secondary, md). HasAction=false면 버튼 숨김',
          'Icon: 48px, stroke 1. AlertTriangle(일반), WifiOff(네트워크), ServerOff(서버) 등',
          'EmptyState와 달리 카드 테두리/배경 없음 (inline과 유사). 상위 컨테이너가 배경 제공',
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
          'Label ↔ Input: 8px, Label ↔ Description: 4px, Description ↔ Input: 8px, Input ↔ HelperText: 8px',
          'Error 시 helperText 대신 errorMessage가 빨간색(--color-state-danger)으로 표시됨',
          'Required: Label 우측에 빨간색 * 표시. 코드에서는 required prop으로 자동 처리',
          '수직 Auto Layout: Label → (Description) → Control(Input/Select) → (HelperText/ErrorMessage)',
          'Figma에서 Description, HelperText, ErrorMessage를 각각 Boolean으로 표시/숨김 제어',
          'Control 슬롯: Input, Select, Textarea, Checkbox, Radio 등 다양한 폼 컴포넌트가 들어감. Instance swap 또는 Slot frame으로 처리',
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
        autoLayout={[{ label: 'Default', direction: 'V', gap: '12px', padding: 'pt-3 px-4 pb-6' }]}
        radius="8px (--primitive-radius-lg)"
        tips={[
          '구조: Header(타이틀 + 액션 버튼) + Divider + Content(DataRow 목록). 수직 Auto Layout',
          'Header: 수평 Auto Layout. 좌측 타이틀(heading-h5) + 우측 액션 버튼(space-between)',
          'DataRow: label(text-label-sm, 고정 너비 ~120px) + value(text-body-md). 수평 Auto Layout',
          'isActive: 좌측에 2px primary 색상 바 표시 + 약간 하이라이트된 배경. Wizard 패턴에서 사용',
          'Divider는 Header와 Content 사이에 1px border-subtle 선',
          'Content 내부 DataRow 사이에도 1px divider 자동 삽입',
        ]}
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
        tokens={[
          { label: 'Padding', value: 'px-4 pt-3 pb-4' },
          { label: 'Radius', value: '8px (--primitive-radius-lg)' },
          { label: 'Title', value: 'heading-h5 (16px semibold), mb-3' },
          { label: 'Actions gap', value: '4px (gap-1)' },
          { label: 'InfoGrid gap', value: '12px (gap-3)' },
          { label: 'InfoCard padding', value: 'px-4 py-3' },
          { label: 'InfoCard label', value: 'label-sm (11px medium)' },
          { label: 'InfoCard value', value: 'body-md (12px regular)' },
        ]}
        tips={[
          '구조: Title → Actions(버튼 그룹) → InfoGrid. 수직 Auto Layout',
          'InfoGrid 레이아웃 정책: 1-4 cards → 1행, 5 → 3/2, 6 → 4/2, 7 → 4/3, 8 → 4/4',
          'Status는 항상 첫 번째 InfoCard에 배치. StatusIndicator 인스턴스 사용',
          'ID InfoCard: copyable 속성으로 우측에 복사 아이콘 표시. 두 번째 카드에 배치 권장',
          '날짜(Created at 등): 마지막 카드에 배치 권장',
          'Actions: Button 여러 개 + ContextMenu(More Actions). 수평 Auto Layout, gap 4px',
          'InfoCard는 독립 컴포넌트로 생성: label + value + (optional) StatusIndicator / CopyButton',
          'CardCount Variant로 InfoGrid의 열 수를 제어하거나, Auto Layout wrap 활용',
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
          { name: 'HasTitleExtra', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[{ label: 'Default', direction: 'H', gap: '—', padding: '0', height: '32px' }]}
        tips={[
          '구조: 좌측 Title + (optional) TitleExtra(Badge) | 우측 Actions(Button). 수평 Auto Layout, space-between',
          'Title: heading-h5 (16px semibold). TitleExtra: Badge 인스턴스 (아이템 카운트 등)',
          'Actions: 주로 Create 버튼(primary, md). ContextMenu와 조합하여 드롭다운 형태도 가능',
          '높이: 32px (md 버튼 높이에 맞춤). 수직 중앙 정렬',
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
          { name: 'HasChildren', type: 'Boolean', values: 'true | false' },
        ]}
        tokens={[
          { label: 'Label', value: 'label-sm (11px medium), text-subtle' },
          { label: 'Value', value: 'body-md (12px regular), text-default' },
          { label: 'Gap', value: '4px (label ↔ value)' },
        ]}
        tips={[
          '구조: Label(위) + Value(아래). 수직 Auto Layout, gap 4px',
          'Value 대신 children으로 복합 콘텐츠(Chip, Badge 등) 표시 가능. HasChildren Boolean으로 전환',
          'InfoBox.Group: 여러 InfoBox를 grid로 균등 분할. Figma에서는 Auto Layout + fill container로 처리',
          '주로 Drawer나 Modal에서 컨텍스트 정보를 표시할 때 사용',
        ]}
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
        tokens={[
          { label: 'Padding', value: '16px' },
          { label: 'Title', value: 'label-sm (11px), text-subtle' },
          { label: 'Value', value: 'heading-h5 (16px semibold)' },
          { label: 'Border', value: 'border-subtle, 1px' },
          { label: 'Radius', value: '8px' },
        ]}
        tips={[
          '구조: Title(+ optional 정보 아이콘) + Value. 수직 Auto Layout, gap 8px',
          'HasTooltip: Title 우측에 InfoCircle 아이콘(14px) 표시. 클릭/호버 시 tooltip 표시',
          'MetricCard.Group: 카드들을 수평 Auto Layout으로 균등 분할. fill container 사용',
          'Dashboard 패턴에서 주요 지표를 나란히 표시할 때 사용',
          'Value에 숫자(3), 백분율(45%), 용량(1.2 GB) 등 다양한 형식 가능',
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
          { name: 'HasSelection', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[{ label: 'Default', direction: 'H', gap: '8px', padding: '0' }]}
        tips={[
          '구조: 좌측 PrimaryActions(검색+필터+다운로드) | 우측 BulkActions(Start, Delete 등). 수평 Auto Layout, space-between',
          'PrimaryActions: FilterSearchInput + 아이콘 버튼들. 수평 Auto Layout, gap 8px',
          'BulkActions: 아이템 선택 시 활성화되는 벌크 액션 버튼들. disabled 상태가 기본',
          'Filters 영역: 적용된 필터 태그(Chip)가 아래쪽에 표시. HasFilters Boolean으로 제어',
          '아이템이 선택되면 SelectionIndicator + BulkActions가 나타나는 패턴',
          'List Page 패턴에서 PageHeader 아래, Pagination 위에 배치',
        ]}
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
        properties={[
          { name: 'Items', type: 'Text', values: '(menu items)' },
          { name: 'Trigger', type: 'Variant', values: 'click | contextmenu' },
        ]}
        radius="6px (--primitive-radius-md)"
        tokens={[
          { label: 'Item padding', value: '6px 8px' },
          { label: 'Item gap', value: '6px' },
          { label: 'Item radius', value: '6px' },
          { label: 'Item hover bg', value: '--color-surface-hover' },
          { label: 'Danger text', value: '--color-state-danger' },
          { label: 'Divider margin', value: '8px (상하)' },
          { label: 'Menu shadow', value: '--shadow-md' },
        ]}
        tips={[
          'ContextMenu는 코드에서 createPortal로 렌더링. Figma에서는 Trigger(Button)와 MenuList를 분리',
          'MenuList: 수직 Auto Layout. 각 아이템은 MenuItem 컴포넌트로 생성',
          'MenuItem: (optional) 아이콘 + Label 텍스트. 수평 Auto Layout. hover 시 배경색 변경',
          'divider: 아이템 사이 구분선. Figma에서 1px Rectangle 또는 Line으로 추가',
          'danger 아이템: 텍스트/아이콘 색상이 빨간색. MenuItem State=danger로 처리',
          'submenu: 우측 화살표 아이콘(chevron-right) + 하위 MenuList. nested component로 구현',
          '모든 아이템에 고유 id 필수. Figma에서는 레이어 이름으로 관리',
        ]}
      />
    </div>
  );
}
