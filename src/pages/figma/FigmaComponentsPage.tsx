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
  Popover,
  ContextMenu,
  Disclosure,
  Modal,
  ConfirmModal,
  Drawer,
  DatePicker,
  Table,
  TabBar,
  TopBar,
  TopBarAction,
  Skeleton,
  SkeletonText,
  SkeletonTable,
  Tag,
  CopyButton,
  Copyable,
  Password,
  ToastContainer,
  ToastProvider,
  useToast,
  SNBMenuItem,
  SelectionIndicator,
  WindowControl,
  WindowControls,
  VStack,
  HStack,
} from '@/design-system';
import type { FilterField, AppliedFilter, TableColumn } from '@/design-system';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDownload,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconAlertTriangle,
  IconPlayerPlay,
  IconTerminal2,
  IconCheck,
  IconSettings,
  IconBell,
  IconTag,
  IconServer,
  IconHome,
  IconBrandDocker,
  IconX,
  IconLayoutSidebar,
  IconArrowLeft,
  IconArrowRight,
  IconSelector,
  IconChevronUp,
  IconCopy,
  IconInfoCircle,
  IconCircleCheck,
  IconAlertCircle,
} from '@tabler/icons-react';

/* ──────────────────────────────────────────
   Shared Layout Helpers
   ────────────────────────────────────────── */

const CategoryHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-heading-h3 text-[var(--color-text-default)] pb-3 border-b-2 border-[var(--color-border-strong)] mb-6 mt-20 first:mt-0">
    {children}
  </h2>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-heading-h4 text-[var(--color-text-default)] pb-2 border-b border-[var(--color-border-default)] mb-6 mt-12 first:mt-0">
    {children}
  </h3>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-heading-h6 text-[var(--color-text-muted)] mb-3 mt-6">{children}</h4>
);

const StateLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-body-xs text-[var(--color-text-subtle)]">{children}</span>
);

const FigmaFrame = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <div className="inline-flex flex-col items-start gap-1" data-figma-name={name}>
    <span className="text-[10px] font-mono text-[var(--color-text-disabled)] leading-tight whitespace-nowrap select-all">
      {name}
    </span>
    {children}
  </div>
);

const PropertyTypeBadge = ({ type }: { type: string }) => {
  const cls =
    type === 'Variant'
      ? 'bg-[var(--color-state-info-bg)] text-[var(--color-state-info)]'
      : type === 'Boolean'
        ? 'bg-[var(--color-state-success-bg)] text-[var(--color-state-success)]'
        : type === 'Text'
          ? 'bg-[var(--color-state-warning-bg)] text-[var(--color-state-warning)]'
          : 'bg-[var(--color-state-danger-bg)] text-[var(--color-state-danger)]';
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-body-xs font-medium ${cls}`}>
      {type}
    </span>
  );
};

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
      <Disclosure title="Figma Guide" defaultOpen>
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
   Interactive Demo Components
   ────────────────────────────────────────── */

function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Resource"
        description="수정 사항을 입력하세요."
        size="sm"
      >
        <FormField label="Name" required>
          <Input placeholder="Enter name" fullWidth />
        </FormField>
        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setIsOpen(false)} className="flex-1">
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
}

function ConfirmModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="danger" size="sm" onClick={() => setIsOpen(true)}>
        Open Confirm Modal
      </Button>
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => setIsOpen(false)}
        title="Delete Resource"
        description="이 작업은 되돌릴 수 없습니다."
        infoLabel="Resource name"
        infoValue="instance-production-01"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  );
}

function DrawerDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        Open Drawer
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Resource"
        width={360}
        footer={
          <HStack gap={2} className="w-full">
            <Button variant="secondary" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)} className="flex-1">
              Save
            </Button>
          </HStack>
        }
      >
        <VStack gap={4}>
          <InfoBox label="Resource ID" value="i-0123456789abcdef" />
          <FormField label="Display Name" required>
            <Input placeholder="Enter name" fullWidth />
          </FormField>
          <FormField label="Description">
            <Textarea placeholder="Enter description" />
          </FormField>
        </VStack>
      </Drawer>
    </>
  );
}

function ToastDemoInner() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => toast.success('리소스가 생성되었습니다.')}
      >
        Success
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast.error('오류가 발생했습니다.')}>
        Error
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => toast.warning('디스크 사용량이 90%를 초과했습니다.')}
      >
        Warning
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toast.info('새 버전이 출시되었습니다.')}>
        Info
      </Button>
    </div>
  );
}

function ToastDemo() {
  return (
    <ToastProvider>
      <ToastDemoInner />
      <ToastContainer position="top-right" maxToasts={3} />
    </ToastProvider>
  );
}

const demoTableColumns: TableColumn<{
  id: string;
  name: string;
  status: string;
  created: string;
}>[] = [
  { key: 'name', label: 'Name', flex: 1, sortable: true },
  {
    key: 'status',
    label: 'Status',
    width: '80px',
    align: 'center',
    render: (v) => (
      <StatusIndicator status={v === 'Running' ? 'active' : 'error'} layout="icon-only" size="sm" />
    ),
  },
  { key: 'created', label: 'Created', flex: 1, align: 'right', sortable: true },
];

const demoTableData = [
  { id: '1', name: 'web-server-01', status: 'Running', created: 'Mar 01, 2026' },
  { id: '2', name: 'db-primary', status: 'Running', created: 'Feb 28, 2026' },
  { id: '3', name: 'cache-node', status: 'Error', created: 'Feb 25, 2026' },
];

function TableDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Table
      columns={demoTableColumns}
      data={demoTableData}
      rowKey="id"
      selectable
      selectedKeys={selected}
      onSelectionChange={setSelected}
      resizable
    />
  );
}

function TabBarDemo() {
  const [activeTab, setActiveTab] = useState('tab1');
  const tabs = [
    { id: 'tab1', label: 'Overview', closable: false },
    { id: 'tab2', label: 'Instances', closable: true },
    { id: 'tab3', label: 'Settings', closable: true },
  ];
  return (
    <div className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] overflow-hidden">
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTabClose={() => {}}
        showWindowControls={false}
        showAddButton
      />
    </div>
  );
}

/* ──────────────────────────────────────────
   Page Component
   ────────────────────────────────────────── */

export function FigmaComponentsPage() {
  const [sliderVal, setSliderVal] = useState(50);
  const [numberVal, setNumberVal] = useState(5);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  return (
    <div className="flex flex-col">
      {/* ════════════════ INTRO ════════════════ */}
      <div className="mb-12">
        <h2 className="text-heading-h3 text-[var(--color-text-default)] mb-3">
          Figma Components Capture
        </h2>
        <p className="text-body-lg text-[var(--color-text-muted)] mb-6 max-w-2xl">
          이 페이지는 TDS 디자인 시스템의 각 컴포넌트를 Figma 컴포넌트로 변환할 때 필요한 정보를
          제공합니다. 각 컴포넌트의 시각적 프리뷰와 함께 Figma에서의 네이밍, Property 설정, Auto
          Layout 스펙, 디자인 토큰을 확인할 수 있습니다.
        </p>
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-lg)]">
          <span className="text-label-sm text-[var(--color-text-subtle)] block mb-2">
            Property Type 범례
          </span>
          <div className="flex flex-wrap gap-4 items-center">
            <HStack gap={1.5} align="center">
              <PropertyTypeBadge type="Variant" />
              <span className="text-body-sm text-[var(--color-text-muted)]">
                선택 가능한 옵션 목록 (Size, State 등)
              </span>
            </HStack>
            <HStack gap={1.5} align="center">
              <PropertyTypeBadge type="Boolean" />
              <span className="text-body-sm text-[var(--color-text-muted)]">
                true/false 토글 (Disabled, HasIcon 등)
              </span>
            </HStack>
            <HStack gap={1.5} align="center">
              <PropertyTypeBadge type="Text" />
              <span className="text-body-sm text-[var(--color-text-muted)]">
                편집 가능한 텍스트 (Label, Placeholder 등)
              </span>
            </HStack>
            <HStack gap={1.5} align="center">
              <PropertyTypeBadge type="Instance swap" />
              <span className="text-body-sm text-[var(--color-text-muted)]">
                교체 가능한 인스턴스 슬롯 (Icon 등)
              </span>
            </HStack>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          FORM CONTROLS
          ═══════════════════════════════════════════ */}
      <CategoryHeader>Form Controls</CategoryHeader>

      {/* ════════════════ BUTTON ════════════════ */}
      <SectionTitle>Button</SectionTitle>

      {buttonVariants.map((variant) => (
        <div key={variant} className="mb-10">
          <SubTitle>{variant.charAt(0).toUpperCase() + variant.slice(1)}</SubTitle>

          <StateLabel>Sizes — default</StateLabel>
          <div className="flex flex-wrap gap-3 items-end mt-2 mb-4">
            {buttonSizes.map((size) => (
              <FigmaFrame
                key={`${variant}-${size}-default`}
                name={`Button/${variant}/${size}/text-only/default`}
              >
                <Button variant={variant} size={size}>
                  {variant}
                </Button>
              </FigmaFrame>
            ))}
          </div>

          <StateLabel>Sizes — hover</StateLabel>
          <div className="flex flex-wrap gap-3 items-end mt-2 mb-4">
            {buttonSizes.map((size) => (
              <FigmaFrame
                key={`${variant}-${size}-hover`}
                name={`Button/${variant}/${size}/text-only/hover`}
              >
                <Button variant={variant} size={size} className={buttonHoverClasses[variant]}>
                  {variant}
                </Button>
              </FigmaFrame>
            ))}
          </div>

          <StateLabel>States — md</StateLabel>
          <div className="flex flex-wrap gap-3 items-end mt-2 mb-4">
            <FigmaFrame name={`Button/${variant}/md/text-only/default`}>
              <Button variant={variant} size="md">
                Default
              </Button>
            </FigmaFrame>
            <FigmaFrame name={`Button/${variant}/md/text-only/hover`}>
              <Button variant={variant} size="md" className={buttonHoverClasses[variant]}>
                Hover
              </Button>
            </FigmaFrame>
            <FigmaFrame name={`Button/${variant}/md/text-only/disabled`}>
              <Button variant={variant} size="md" disabled>
                Disabled
              </Button>
            </FigmaFrame>
            <FigmaFrame name={`Button/${variant}/md/text-only/loading`}>
              <Button variant={variant} size="md" loading>
                Loading
              </Button>
            </FigmaFrame>
          </div>

          {(variant === 'primary' || variant === 'secondary' || variant === 'danger') && (
            <>
              <StateLabel>Icon — sm</StateLabel>
              <div className="flex flex-wrap gap-3 items-end mt-2">
                <FigmaFrame name={`Button/${variant}/sm/icon-left/default`}>
                  <Button variant={variant} size="sm" leftIcon={<IconPlus size={12} />}>
                    {variant === 'primary' ? 'Create' : variant === 'danger' ? 'Delete' : 'Edit'}
                  </Button>
                </FigmaFrame>
                <FigmaFrame name={`Button/${variant}/sm/icon-left/hover`}>
                  <Button
                    variant={variant}
                    size="sm"
                    leftIcon={<IconPlus size={12} />}
                    className={buttonHoverClasses[variant]}
                  >
                    {variant === 'primary' ? 'Create' : variant === 'danger' ? 'Delete' : 'Edit'}
                  </Button>
                </FigmaFrame>
                {variant === 'secondary' && (
                  <>
                    <FigmaFrame name="Button/secondary/sm/icon-only/default">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<IconDownload size={12} />}
                        aria-label="Download"
                      />
                    </FigmaFrame>
                    <FigmaFrame name="Button/secondary/sm/icon-only/hover">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<IconDownload size={12} />}
                        aria-label="Download"
                        className={buttonHoverClasses.secondary}
                      />
                    </FigmaFrame>
                  </>
                )}
                {variant === 'primary' && (
                  <>
                    <FigmaFrame name="Button/primary/md/icon-right/default">
                      <Button variant="primary" size="md" rightIcon={<IconChevronDown size={14} />}>
                        Dropdown
                      </Button>
                    </FigmaFrame>
                    <FigmaFrame name="Button/primary/md/icon-right/hover">
                      <Button
                        variant="primary"
                        size="md"
                        rightIcon={<IconChevronDown size={14} />}
                        className={buttonHoverClasses.primary}
                      >
                        Dropdown
                      </Button>
                    </FigmaFrame>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      <FigmaGuide
        figmaName="TDS/Form/Button"
        properties={[
          {
            name: 'Variant',
            type: 'Variant',
            values: 'primary | secondary | muted | ghost | outline | danger | link',
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

      <SubTitle>Sizes × States</SubTitle>
      <div className="flex flex-col gap-4">
        {(['sm', 'md'] as const).map((size) => (
          <div key={size} className="flex flex-col gap-2">
            <StateLabel>Size: {size}</StateLabel>
            <div className="flex flex-wrap gap-3 items-end">
              <FigmaFrame name={`Input/${size}/placeholder`}>
                <Input size={size} placeholder="Placeholder" />
              </FigmaFrame>
              <FigmaFrame name={`Input/${size}/with-value`}>
                <Input size={size} defaultValue="Some value" />
              </FigmaFrame>
              <FigmaFrame name={`Input/${size}/focus`}>
                <Input
                  size={size}
                  placeholder="Focused"
                  className="border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]"
                />
              </FigmaFrame>
              <FigmaFrame name={`Input/${size}/disabled`}>
                <Input size={size} placeholder="Disabled" disabled />
              </FigmaFrame>
              <FigmaFrame name={`Input/${size}/error`}>
                <Input size={size} placeholder="Error state" error />
              </FigmaFrame>
            </div>
          </div>
        ))}
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Input"
        properties={[
          { name: 'Size', type: 'Variant', values: 'sm | md' },
          {
            name: 'State',
            type: 'Variant',
            values: 'placeholder | with-value | focus | disabled | error',
          },
          { name: 'Placeholder', type: 'Text', values: '"Enter value..."' },
          { name: 'Value', type: 'Text', values: '(editable)' },
          { name: 'LeftElement', type: 'Boolean', values: 'true | false' },
          { name: 'RightElement', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'SM', direction: 'H', gap: '—', padding: '0 10px', height: '28px' },
          { label: 'MD', direction: 'H', gap: '—', padding: '0 10px', height: '32px' },
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
        <FigmaFrame name="NumberInput/default">
          <NumberInput min={0} max={100} value={numberVal} onChange={setNumberVal} width="xs" />
        </FigmaFrame>
        <FigmaFrame name="NumberInput/arrow-hover">
          <NumberInput
            min={0}
            max={100}
            value={numberVal}
            onChange={setNumberVal}
            width="xs"
            className="[&_button:first-of-type]:text-[var(--color-text-default)] [&_button:first-of-type]:bg-[var(--color-surface-muted)]"
          />
        </FigmaFrame>
        <FigmaFrame name="NumberInput/suffix">
          <NumberInput min={0} max={1000} value={256} onChange={() => {}} width="xs" suffix="GiB" />
        </FigmaFrame>
        <FigmaFrame name="NumberInput/disabled">
          <NumberInput min={0} max={100} value={10} onChange={() => {}} width="xs" disabled />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/NumberInput"
        properties={[
          { name: 'Size', type: 'Variant', values: 'xs | sm | md | lg' },
          { name: 'Value', type: 'Text', values: '(number)' },
          { name: 'Suffix', type: 'Text', values: '"GiB" (optional)' },
          { name: 'Disabled', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'Container', direction: 'H', gap: '0', padding: '0', height: '32px (md)' },
        ]}
        radius="6px (--primitive-radius-md)"
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
      <div className="flex flex-wrap gap-3 items-end">
        <FigmaFrame name="SearchInput/sm/empty">
          <SearchInput placeholder="Search resources..." size="sm" />
        </FigmaFrame>
        <FigmaFrame name="SearchInput/sm/with-value">
          <SearchInput
            placeholder="Search resources..."
            size="sm"
            value="kubernetes"
            onChange={() => {}}
          />
        </FigmaFrame>
        <FigmaFrame name="SearchInput/sm/focus">
          <SearchInput
            placeholder="Search resources..."
            size="sm"
            className="[&_input]:border-[var(--input-border-focus)] [&_input]:shadow-[0_0_0_1px_var(--input-border-focus)]"
          />
        </FigmaFrame>
        <FigmaFrame name="SearchInput/sm/disabled">
          <SearchInput placeholder="Search resources..." size="sm" disabled />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/SearchInput"
        properties={[
          { name: 'Size', type: 'Variant', values: 'sm | md' },
          { name: 'State', type: 'Variant', values: 'empty | filled | focus' },
          { name: 'Placeholder', type: 'Text', values: '"Search..."' },
          { name: 'HasClear', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'SM', direction: 'H', gap: '6px', padding: '0 10px', height: '28px' },
          { label: 'MD', direction: 'H', gap: '6px', padding: '0 10px', height: '32px' },
        ]}
        radius="6px (--primitive-radius-md)"
        tokens={[
          { label: 'Search icon', value: 'IconSearch, 14px, --color-text-subtle' },
          { label: 'Clear icon', value: 'IconX, 14px, --color-text-muted' },
        ]}
        tips={[
          'Input 컴포넌트를 기반으로 왼쪽에 검색 아이콘(IconSearch)이 고정된 구조',
          'Figma에서 TDS/Form/Input에 LeftElement=true + 아이콘 인스턴스로 조합하거나, 별도 SearchInput 컴포넌트로 생성',
          '입력값이 있을 때 오른쪽에 X(clear) 버튼이 나타남. Boolean 속성으로 제어',
        ]}
      />

      {/* ════════════════ TEXTAREA ════════════════ */}
      <SectionTitle>Textarea</SectionTitle>
      <div className="flex flex-wrap gap-4 items-start">
        <FigmaFrame name="Textarea/placeholder">
          <Textarea placeholder="Enter description..." />
        </FigmaFrame>
        <FigmaFrame name="Textarea/with-value">
          <Textarea defaultValue="Some description text here" />
        </FigmaFrame>
        <FigmaFrame name="Textarea/focus">
          <Textarea
            placeholder="Focused"
            className="border-[var(--input-border-focus)] shadow-[0_0_0_1px_var(--input-border-focus)]"
          />
        </FigmaFrame>
        <FigmaFrame name="Textarea/disabled">
          <Textarea placeholder="Disabled" disabled />
        </FigmaFrame>
        <FigmaFrame name="Textarea/error">
          <Textarea placeholder="Error state" error="This field is required" />
        </FigmaFrame>
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
        <FigmaFrame name="Select/default">
          <Select options={sampleSelectOptions} placeholder="Select..." fullWidth />
        </FigmaFrame>
        <FigmaFrame name="Select/with-value">
          <Select options={sampleSelectOptions} value="option1" onChange={() => {}} fullWidth />
        </FigmaFrame>
        <FigmaFrame name="Select/disabled">
          <Select options={sampleSelectOptions} placeholder="Disabled" disabled fullWidth />
        </FigmaFrame>
        <FigmaFrame name="Select/error">
          <Select options={sampleSelectOptions} placeholder="Error" error fullWidth />
        </FigmaFrame>
      </div>

      <SubTitle>Open (Dropdown) — Static</SubTitle>
      <FigmaFrame name="Select/open">
        <div className="relative w-[240px] mb-[120px]">
          {/* Trigger — focus ring + chevron rotated */}
          <button
            type="button"
            className="flex items-center justify-between gap-2 w-full h-[var(--input-height-md)] pl-[var(--select-padding-x)] pr-2 text-[length:var(--select-font-size)] leading-[var(--select-line-height)] bg-[var(--select-bg)] border border-solid rounded-[var(--select-radius)] border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)] cursor-pointer"
          >
            <span className="truncate text-[var(--color-text-default)]">Option 1</span>
            <IconChevronDown
              size={16}
              stroke={1.5}
              className="text-[var(--color-text-default)] rotate-180 shrink-0"
            />
          </button>
          {/* Dropdown */}
          <div className="absolute top-full left-0 w-full mt-1 bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] z-10 overflow-hidden">
            {sampleSelectOptions.map((opt) => {
              const isSelected = opt.value === 'option1';
              return (
                <div
                  key={opt.value}
                  className={[
                    'flex items-center justify-between',
                    'px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)]',
                    'text-[length:var(--select-item-font-size)] leading-[var(--select-item-line-height)] font-[number:var(--font-weight-regular)]',
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
      </FigmaFrame>

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
      <div className="flex flex-wrap gap-8 items-end">
        <FigmaFrame name="Checkbox/unchecked">
          <Checkbox label="Option" />
        </FigmaFrame>
        <FigmaFrame name="Checkbox/checked">
          <Checkbox label="Option" checked onChange={() => {}} />
        </FigmaFrame>
        <FigmaFrame name="Checkbox/indeterminate">
          <Checkbox label="Option" indeterminate onChange={() => {}} />
        </FigmaFrame>
        <FigmaFrame name="Checkbox/hover">
          <Checkbox
            label="Option"
            className="[&_span:first-of-type]:border-[var(--checkbox-border-hover)]"
          />
        </FigmaFrame>
        <FigmaFrame name="Checkbox/disabled">
          <Checkbox label="Disabled" disabled />
        </FigmaFrame>
        <FigmaFrame name="Checkbox/disabled-checked">
          <Checkbox label="Disabled" checked disabled onChange={() => {}} />
        </FigmaFrame>
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
      <div className="flex flex-wrap gap-8 items-end">
        <FigmaFrame name="Radio/unselected">
          <Radio value="a" label="Option A" />
        </FigmaFrame>
        <FigmaFrame name="Radio/selected">
          <Radio value="b" label="Option B" checked onChange={() => {}} />
        </FigmaFrame>
        <FigmaFrame name="Radio/disabled">
          <Radio value="c" label="Disabled" disabled />
        </FigmaFrame>
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
      <div className="flex flex-wrap gap-8 items-end">
        <FigmaFrame name="Toggle/off">
          <Toggle label="Feature" />
        </FigmaFrame>
        <FigmaFrame name="Toggle/on">
          <Toggle label="Feature" checked onChange={() => {}} />
        </FigmaFrame>
        <FigmaFrame name="Toggle/disabled">
          <Toggle label="Disabled" disabled />
        </FigmaFrame>
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
        <FigmaFrame name="Slider/default">
          <Slider min={0} max={100} value={sliderVal} onChange={setSliderVal} />
        </FigmaFrame>
        <FigmaFrame name="Slider/with-input">
          <HStack gap={3} align="center">
            <Slider min={0} max={100} value={sliderVal} onChange={setSliderVal} />
            <NumberInput min={0} max={100} value={sliderVal} onChange={setSliderVal} width="xs" />
          </HStack>
        </FigmaFrame>
        <FigmaFrame name="Slider/disabled">
          <Slider min={0} max={100} value={30} onChange={() => {}} disabled />
        </FigmaFrame>
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

      {/* ═══════════════════════════════════════════
          DATA DISPLAY
          ═══════════════════════════════════════════ */}
      <CategoryHeader>Data Display</CategoryHeader>

      {/* ════════════════ BADGE ════════════════ */}
      <SectionTitle>Badge</SectionTitle>

      <SubTitle>Subtle (권장 — 모든 Semantic Color)</SubTitle>
      {badgeSizes.map((size) => (
        <div key={`subtle-${size}`} className="mb-3">
          <StateLabel>Size: {size}</StateLabel>
          <div className="flex flex-wrap gap-3 mt-1 items-end">
            {badgeThemes.map((theme) => (
              <FigmaFrame
                key={`subtle-${size}-${theme}`}
                name={`Badge/subtle/${size}/${theme}/text-only`}
              >
                <Badge type="subtle" theme={theme} size={size}>
                  {theme}
                </Badge>
              </FigmaFrame>
            ))}
          </div>
        </div>
      ))}

      <SubTitle>Solid (white/gray 중심 사용)</SubTitle>
      <div className="flex flex-wrap gap-3 mb-3 items-end">
        {(['white', 'gray'] as const).map((theme) => (
          <FigmaFrame key={`solid-${theme}`} name={`Badge/solid/md/${theme}/text-only`}>
            <Badge type="solid" theme={theme} size="md">
              {theme}
            </Badge>
          </FigmaFrame>
        ))}
      </div>
      <div className="p-3 bg-[var(--color-state-info-bg)] rounded-[var(--primitive-radius-md)] text-body-sm text-[var(--color-state-info)] mb-4">
        Solid 타입은 white/gray에 주로 사용합니다. 색상 강조가 필요한 경우 Subtle 타입을 사용하세요.
      </div>

      <SubTitle>Semantic Color 매핑</SubTitle>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { semantic: 'info', theme: 'blue' as const },
          { semantic: 'success', theme: 'green' as const },
          { semantic: 'warning', theme: 'yellow' as const },
          { semantic: 'danger', theme: 'red' as const },
          { semantic: 'neutral', theme: 'gray' as const },
          { semantic: 'default', theme: 'white' as const },
        ].map(({ semantic, theme }) => (
          <FigmaFrame key={semantic} name={`Badge/subtle/sm/${theme}/semantic-${semantic}`}>
            <Badge type="subtle" theme={theme} size="sm">
              {theme}
            </Badge>
          </FigmaFrame>
        ))}
      </div>

      <SubTitle>With Icons</SubTitle>
      <div className="flex flex-wrap gap-3 items-end">
        <FigmaFrame name="Badge/subtle/sm/blue/icon-left">
          <Badge theme="blue" type="subtle" size="sm" leftIcon={<IconTag size={10} />}>
            Left Icon
          </Badge>
        </FigmaFrame>
        <FigmaFrame name="Badge/subtle/sm/green/icon-right">
          <Badge theme="green" type="subtle" size="sm" rightIcon={<IconCheck size={10} />}>
            Right Icon
          </Badge>
        </FigmaFrame>
        <FigmaFrame name="Badge/subtle/md/gray/icon-both">
          <Badge
            theme="gray"
            type="subtle"
            size="md"
            leftIcon={<IconSettings size={10} />}
            rightIcon={<IconChevronDown size={10} />}
          >
            Both Icons
          </Badge>
        </FigmaFrame>
      </div>

      <SubTitle>With Dot</SubTitle>
      <div className="flex flex-wrap gap-3 items-end">
        {badgeThemes.map((theme) => (
          <FigmaFrame key={`dot-${theme}`} name={`Badge/subtle/sm/${theme}/dot`}>
            <Badge theme={theme} type="subtle" size="sm" dot>
              {theme}
            </Badge>
          </FigmaFrame>
        ))}
      </div>

      <FigmaGuide
        figmaName="TDS/Data/Badge"
        properties={[
          { name: 'Theme', type: 'Variant', values: 'blue | red | green | yellow | gray | white' },
          { name: 'Type', type: 'Variant', values: 'solid | subtle' },
          { name: 'Size', type: 'Variant', values: 'sm | md | lg' },
          { name: 'Dot', type: 'Boolean', values: 'true | false' },
          { name: 'LeftIcon', type: 'Instance swap', values: 'icon slot' },
          { name: 'RightIcon', type: 'Instance swap', values: 'icon slot' },
          { name: 'Label', type: 'Text', values: '"Badge"' },
        ]}
        autoLayout={[
          { label: 'SM', direction: 'H', gap: '4px', padding: '2px 6px' },
          { label: 'MD', direction: 'H', gap: '4px', padding: '4px 8px' },
          { label: 'LG', direction: 'H', gap: '4px', padding: '4px 12px' },
        ]}
        radius="4px (--primitive-radius-sm)"
        tokens={[
          { label: 'Subtle bg', value: 'theme별 --color-state-{info|success|warning|danger}-bg' },
          { label: 'Subtle text', value: 'theme별 --color-state-{info|success|warning|danger}' },
          { label: 'Solid bg', value: 'theme 색상 (blue600, red600...)' },
          { label: 'Solid text', value: '--color-on-primary (white)' },
          { label: 'Dot size', value: '6px (--badge-dot-size)' },
          { label: 'Icon gap', value: '4px (--badge-gap)' },
        ]}
        tips={[
          'Semantic Color 매핑: info=blue, success=green, warning=yellow, danger=red, neutral=gray, default=white',
          'Subtle 타입 권장: 대부분의 색상 뱃지에 사용. Solid는 white/gray 중심으로 사용',
          'Dot: 라벨 왼쪽에 6px 원형 dot 추가. Boolean으로 on/off',
          'Auto Layout: 수평 방향, 텍스트는 hug contents, 아이콘/dot이 있을 때 gap 4px',
          'Icon slot은 Instance swap으로 설정. 크기: sm/md=10px, lg=12px',
        ]}
      />

      {/* ════════════════ CHIP ════════════════ */}
      <SectionTitle>Chip</SectionTitle>

      <SubTitle>Value only</SubTitle>
      <div className="flex flex-wrap gap-3 items-end">
        <FigmaFrame name="Chip/value-only/default">
          <Chip value="Active" />
        </FigmaFrame>
        <FigmaFrame name="Chip/value-only/removable">
          <Chip value="Running" onRemove={() => {}} />
        </FigmaFrame>
        <FigmaFrame name="Chip/value-only/selected">
          <Chip value="default-sg" variant="selected" />
        </FigmaFrame>
        <FigmaFrame name="Chip/value-only/selected-removable">
          <Chip value="default-sg" variant="selected" onRemove={() => {}} />
        </FigmaFrame>
        <FigmaFrame name="Chip/value-only/disabled">
          <Chip value="Disabled" disabled />
        </FigmaFrame>
      </div>

      <SubTitle>Label + Value</SubTitle>
      <div className="flex flex-wrap gap-3 items-end">
        <FigmaFrame name="Chip/label-value/default">
          <Chip label="Name" value="a" />
        </FigmaFrame>
        <FigmaFrame name="Chip/label-value/removable">
          <Chip label="Status" value="Running" onRemove={() => {}} />
        </FigmaFrame>
        <FigmaFrame name="Chip/label-value/selected">
          <Chip label="Region" value="us-west-2" variant="selected" />
        </FigmaFrame>
        <FigmaFrame name="Chip/label-value/disabled">
          <Chip label="Name" value="a" disabled />
        </FigmaFrame>
      </div>

      <SubTitle>Truncation</SubTitle>
      <div className="flex flex-wrap gap-3 items-end">
        <FigmaFrame name="Chip/truncation/value-only">
          <Chip
            value="very-long-label-name-that-gets-truncated"
            maxWidth="120px"
            onRemove={() => {}}
          />
        </FigmaFrame>
        <FigmaFrame name="Chip/truncation/label-value">
          <Chip
            label="Annotation"
            value="kubernetes.io/very-long-annotation-value"
            maxWidth="160px"
            onRemove={() => {}}
          />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Data/Chip"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'default | selected' },
          { name: 'Removable', type: 'Boolean', values: 'true | false (onRemove prop)' },
          { name: 'Disabled', type: 'Boolean', values: 'true | false' },
          { name: 'Label', type: 'Text', values: 'key/category (optional)' },
          { name: 'Value', type: 'Text', values: 'display value (required)' },
          { name: 'MaxWidth', type: 'Text', values: 'truncation width (optional)' },
        ]}
        autoLayout={[{ label: 'Container', direction: 'H', gap: '6px', padding: '4px 8px' }]}
        radius="6px (--chip-radius)"
        tokens={[
          { label: 'BG', value: '--chip-bg' },
          { label: 'Border (default)', value: '--chip-border' },
          { label: 'Border (selected)', value: '--chip-border-selected' },
          { label: 'Separator', value: '--chip-separator-color (| divider)' },
          { label: 'Font size', value: '--chip-font-size (11px)' },
          { label: 'Remove icon', value: 'IconX, 12px' },
        ]}
        tips={[
          '구조: [icon] + [label | value] + [× remove]. label은 선택적 (key=value 패턴에서만 표시)',
          'Value only: 단일 값 필터, 태그 표시에 사용',
          'Label + Value: label과 value 사이에 구분선(|)으로 시각적 구분',
          'Selected: 파란 테두리 강조. 라디오/체크박스 선택 결과를 표현',
          'Removable: onRemove prop 전달 시 우측에 X 아이콘 표시',
          'Truncation: maxWidth 설정 시 말줄임 처리. title 속성으로 전체 텍스트 확인 가능',
          'Badge와 용도 구분: Chip은 인터랙티브(선택/삭제 가능), Badge는 읽기 전용',
        ]}
      />

      {/* ════════════════ STATUS INDICATOR ════════════════ */}
      <SectionTitle>StatusIndicator</SectionTitle>
      <SubTitle>All Statuses (icon-only)</SubTitle>
      <div className="flex flex-wrap gap-4 items-end">
        {statusTypes.map((status) => (
          <FigmaFrame key={status} name={`StatusIndicator/icon-only/${status}`}>
            <Tooltip content={status}>
              <StatusIndicator status={status} layout="icon-only" />
            </Tooltip>
          </FigmaFrame>
        ))}
      </div>
      <SubTitle>With Label</SubTitle>
      <div className="flex flex-wrap gap-4 items-end">
        {(['active', 'error', 'building', 'pending', 'shutoff', 'paused'] as const).map(
          (status) => (
            <FigmaFrame key={`label-${status}`} name={`StatusIndicator/dot-label/${status}`}>
              <StatusIndicator status={status} layout="dot-label" />
            </FigmaFrame>
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
        autoLayout={[
          { label: 'icon-only', direction: 'H', gap: '0', padding: '4px 6px' },
          { label: 'dot-label', direction: 'H', gap: '4px', padding: '4px 6px' },
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
      <FigmaFrame name="Pagination/first-page/with-settings">
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={() => {}}
          totalItems={100}
          showSettings
        />
      </FigmaFrame>
      <SubTitle>Page 5 (middle — active item visible)</SubTitle>
      <FigmaFrame name="Pagination/middle-page/no-settings">
        <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} totalItems={100} />
      </FigmaFrame>

      <FigmaGuide
        figmaName="TDS/Data/Pagination"
        properties={[
          { name: 'CurrentPage', type: 'Text', values: '(number)' },
          { name: 'ShowSettings', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'Container', direction: 'H', gap: '—', padding: '0', height: '32px' },
          { label: 'Page Button', direction: 'H', gap: '0', padding: '4px 8px' },
        ]}
        tokens={[
          { label: 'Active page', value: '--color-action-primary, font-weight medium' },
          { label: 'Nav button size', value: '24px × 24px' },
        ]}
        tips={[
          '활성 페이지 번호는 primary color + font-weight medium으로 강조',
          '구조: 좌측 Info(총 아이템 수) + 중앙 페이지 번호들 + 우측 Settings 아이콘. 수평 Auto Layout',
          '페이지 번호 버튼: 각각 min-width 24px, 중앙 정렬. 활성/비활성 상태를 Variant로',
          'Prev/Next 화살표: 첫 페이지에서 Prev 비활성, 마지막 페이지에서 Next 비활성',
          'Settings 아이콘(톱니바퀴): 페이지당 행 수 설정 팝오버 트리거. Boolean으로 표시/숨김',
        ]}
      />

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <FigmaFrame name="Pagination/Sub/PrevButton/disabled">
          <button
            disabled
            className="inline-flex items-center justify-center size-[var(--pagination-item-size)] text-[length:var(--pagination-font-size)] leading-[var(--pagination-line-height)] font-medium rounded-[var(--pagination-radius)] text-[var(--color-text-disabled)] cursor-not-allowed"
          >
            <IconChevronLeft size={14} stroke={1} />
          </button>
        </FigmaFrame>
        <FigmaFrame name="Pagination/Sub/PrevButton/enabled">
          <button className="inline-flex items-center justify-center size-[var(--pagination-item-size)] text-[length:var(--pagination-font-size)] leading-[var(--pagination-line-height)] font-medium rounded-[var(--pagination-radius)] text-[var(--pagination-text)] hover:bg-[var(--pagination-hover-bg)] cursor-pointer">
            <IconChevronLeft size={14} stroke={1} />
          </button>
        </FigmaFrame>
        <FigmaFrame name="Pagination/Sub/NextButton/enabled">
          <button className="inline-flex items-center justify-center size-[var(--pagination-item-size)] text-[length:var(--pagination-font-size)] leading-[var(--pagination-line-height)] font-medium rounded-[var(--pagination-radius)] text-[var(--pagination-text)] hover:bg-[var(--pagination-hover-bg)] cursor-pointer">
            <IconChevronRight size={14} stroke={1} />
          </button>
        </FigmaFrame>
        <FigmaFrame name="Pagination/Sub/PageButton/default">
          <button className="inline-flex items-center justify-center size-[var(--pagination-item-size)] text-[length:var(--pagination-font-size)] leading-[var(--pagination-line-height)] font-medium rounded-[var(--pagination-radius)] text-[var(--pagination-text)] hover:bg-[var(--pagination-hover-bg)] cursor-pointer">
            3
          </button>
        </FigmaFrame>
        <FigmaFrame name="Pagination/Sub/PageButton/active">
          <button className="inline-flex items-center justify-center size-[var(--pagination-item-size)] text-[length:var(--pagination-font-size)] leading-[var(--pagination-line-height)] font-medium rounded-[var(--pagination-radius)] bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)]">
            1
          </button>
        </FigmaFrame>
        <FigmaFrame name="Pagination/Sub/Dots">
          <span className="inline-flex items-center justify-center size-[var(--pagination-item-size)] text-[length:var(--pagination-font-size)] text-[var(--pagination-text)]">
            ···
          </span>
        </FigmaFrame>
        <FigmaFrame name="Pagination/Sub/SettingsButton">
          <button className="inline-flex items-center justify-center size-[var(--pagination-item-size)] text-[length:var(--pagination-font-size)] leading-[var(--pagination-line-height)] font-medium rounded-[var(--pagination-radius)] text-[var(--pagination-text)] hover:bg-[var(--pagination-hover-bg)] cursor-pointer">
            <IconSettings size={16} stroke={1} />
          </button>
        </FigmaFrame>
        <FigmaFrame name="Pagination/Sub/Divider">
          <div className="h-4 w-px bg-[var(--color-border-default)]" />
        </FigmaFrame>
        <FigmaFrame name="Pagination/Sub/ItemCount">
          <span className="text-body-sm text-[var(--color-text-subtle)]">100 items</span>
        </FigmaFrame>
        <FigmaFrame name="Pagination/Sub/SelectedCount">
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            <span className="text-[var(--color-text-default)] font-medium">3 selected</span>
            <span className="text-[var(--color-text-muted)]"> / 100 items</span>
          </span>
        </FigmaFrame>
      </div>

      {/* ════════════════ PROGRESS BAR ════════════════ */}
      <SectionTitle>ProgressBar</SectionTitle>

      <SubTitle>Default — Bar only</SubTitle>
      <div className="flex flex-col gap-4 max-w-md">
        <FigmaFrame name="ProgressBar/default/0">
          <ProgressBar value={0} max={100} showValue={false} />
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/default/25">
          <ProgressBar value={25} max={100} showValue={false} />
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/default/50">
          <ProgressBar value={50} max={100} showValue={false} />
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/default/75">
          <ProgressBar value={75} max={100} showValue={false} />
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/default/100">
          <ProgressBar value={100} max={100} showValue={false} />
        </FigmaFrame>
      </div>

      <SubTitle>Labeled — Label + Value + Bar</SubTitle>
      <div className="flex flex-col gap-6 max-w-md">
        <FigmaFrame name="ProgressBar/labeled/uploading">
          <VStack gap={2}>
            <div className="flex justify-between">
              <span className="text-label-sm text-[var(--color-text-default)]">Uploading...</span>
              <span className="text-body-sm text-[var(--color-text-muted)]">65%</span>
            </div>
            <ProgressBar value={65} max={100} showValue={false} />
          </VStack>
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/labeled/complete">
          <VStack gap={2}>
            <div className="flex justify-between">
              <span className="text-label-sm text-[var(--color-text-default)]">Complete</span>
              <span className="text-body-sm text-[var(--color-text-muted)]">100%</span>
            </div>
            <ProgressBar value={100} max={100} showValue={false} />
          </VStack>
        </FigmaFrame>
      </div>

      <SubTitle>Status Colors</SubTitle>
      <div className="flex flex-col gap-4 max-w-md">
        <FigmaFrame name="ProgressBar/status/info">
          <ProgressBar value={50} max={100} label="Info" status="info" statusText="50%" />
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/status/success">
          <ProgressBar value={50} max={100} label="Success" status="success" statusText="50%" />
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/status/warning">
          <ProgressBar value={70} max={100} label="Warning" status="warning" statusText="70%" />
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/status/danger">
          <ProgressBar value={95} max={100} label="Danger" status="danger" statusText="95%" />
        </FigmaFrame>
      </div>

      <SubTitle>Quota Variant</SubTitle>
      <div className="flex flex-col gap-4 max-w-md">
        <FigmaFrame name="ProgressBar/quota/normal">
          <ProgressBar variant="quota" value={3} max={10} label="Instances" showValue />
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/quota/with-new-value">
          <ProgressBar variant="quota" value={5} newValue={2} max={10} label="vCPU" showValue />
        </FigmaFrame>
        <FigmaFrame name="ProgressBar/quota/unlimited">
          <ProgressBar variant="quota" value={15} label="API Calls" showValue />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Data/ProgressBar"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'default | quota' },
          {
            name: 'Status',
            type: 'Variant',
            values: 'info | success | warning | danger | neutral',
          },
          { name: 'Size', type: 'Variant', values: 'sm | md' },
          { name: 'Value', type: 'Number', values: 'current value (0–max)' },
          { name: 'Max', type: 'Number', values: 'total value (undefined = unlimited)' },
          { name: 'NewValue', type: 'Number', values: 'additional value (quota variant)' },
          { name: 'Label', type: 'Text', values: 'task name (optional)' },
          { name: 'StatusText', type: 'Text', values: 'right-side text (e.g. "65%")' },
          { name: 'ShowValue', type: 'Boolean', values: 'show value text (quota variant)' },
        ]}
        autoLayout={[
          { label: 'Container', direction: 'V', gap: '6px', padding: '0' },
          { label: 'Track', direction: 'H', gap: '0', padding: '0', height: '4px' },
        ]}
        radius="9999px (pill — Track and Fill both)"
        tokens={[
          { label: 'Default fill', value: '--color-action-primary (blue)' },
          { label: 'Info fill', value: '--color-state-info (blue)' },
          { label: 'Success fill', value: '--color-state-success (green)' },
          { label: 'Warning fill', value: '--color-state-warning (orange)' },
          { label: 'Danger fill', value: '--color-state-danger (red)' },
          { label: 'Track bg', value: '--color-border-subtle' },
          { label: 'Label', value: 'text-label-sm' },
          { label: 'StatusText', value: 'text-body-sm, text-subtle' },
        ]}
        tips={[
          'Default variant: Bar만 단독 표시. Labeled는 상단에 Label + Value 텍스트 배치',
          'status 미지정 시 기본 색상은 --color-action-primary (파란색)',
          'status 지정 시 해당 상태 색상 사용. thresholds로 자동 색상 전환도 가능',
          'Quota variant: Used/New/Total 구성. newValue로 추가 예정 영역 표시',
          'Quota variant에서 max 미지정 시 "Unlimited" 표시',
          '구조: Track(전체 바, 높이 4px) + Fill(채워진 부분). Fill의 width를 %로 조절',
          'border-radius: Track과 Fill 모두 9999px (pill)',
        ]}
      />

      {/* ═══════════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════════ */}
      <CategoryHeader>Navigation</CategoryHeader>

      {/* ════════════════ TABS ════════════════ */}
      <SectionTitle>Tabs</SectionTitle>

      <SubTitle>Underline</SubTitle>
      <FigmaFrame name="Tabs/underline/sm">
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
      </FigmaFrame>

      <SubTitle>Boxed</SubTitle>
      <FigmaFrame name="Tabs/boxed/sm">
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
      </FigmaFrame>

      <FigmaGuide
        figmaName="TDS/Navigation/Tabs"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'underline | boxed' },
          { name: 'Size', type: 'Variant', values: 'sm | md' },
          { name: 'Tab State', type: 'Variant', values: 'active | inactive | hover' },
          { name: 'Label', type: 'Text', values: '"Tab"' },
        ]}
        autoLayout={[
          { label: 'TabList (underline)', direction: 'H', gap: '0', padding: '0' },
          { label: 'TabList (boxed)', direction: 'H', gap: '2px', padding: '2px' },
          { label: 'Tab item', direction: 'H', gap: '0', padding: '8px 12px' },
        ]}
        radius="6px (boxed TabList background), 4px (boxed active tab)"
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

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <FigmaFrame name="Tabs/Sub/Tab/active">
          <div className="relative px-3 py-2 text-body-sm font-medium text-[var(--tabs-active-color,var(--color-action-primary))]">
            Active
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)]" />
          </div>
        </FigmaFrame>
        <FigmaFrame name="Tabs/Sub/Tab/inactive">
          <div className="px-3 py-2 text-body-sm font-medium text-[var(--tabs-inactive-color,var(--color-text-subtle))]">
            Inactive
          </div>
        </FigmaFrame>
        <FigmaFrame name="Tabs/Sub/Tab/hover">
          <div className="px-3 py-2 text-body-sm font-medium text-[var(--tabs-hover-color,var(--color-text-default))]">
            Hover
          </div>
        </FigmaFrame>
        <FigmaFrame name="Tabs/Sub/ActiveIndicator">
          <div className="w-[60px] h-[2px] bg-[var(--color-action-primary)]" />
        </FigmaFrame>
      </div>

      {/* ════════════════ BREADCRUMB ════════════════ */}
      <SectionTitle>Breadcrumb</SectionTitle>
      <FigmaFrame name="Breadcrumb/3-items">
        <Breadcrumb
          items={[
            { label: 'Project-1', href: '#' },
            { label: 'Compute', href: '#' },
            { label: 'Instances' },
          ]}
        />
      </FigmaFrame>

      <FigmaGuide
        figmaName="TDS/Navigation/Breadcrumb"
        properties={[
          { name: 'Items', type: 'Text', values: '(breadcrumb labels)' },
          { name: 'ItemCount', type: 'Variant', values: '2 | 3 | 4 | 5' },
        ]}
        autoLayout={[{ label: 'Container', direction: 'H', gap: '4px', padding: '0' }]}
        tokens={[
          { label: 'Link color', value: '--color-text-muted' },
          { label: 'Current color', value: '--color-text-default' },
          { label: 'Separator', value: 'IconChevronRight, 12px, --color-text-subtle' },
          { label: 'Font', value: 'body-sm (11px)' },
        ]}
        tips={[
          '구조: [Link] > [Link] > [CurrentPage]. 수평 Auto Layout, gap 4px',
          'separator: chevron-right 아이콘(12px). 아이템 사이에 자동 삽입',
          '마지막 아이템은 링크 없이 현재 페이지명 표시 (텍스트 색상: text-default, 링크 아이템은 text-muted)',
          'Figma에서 BreadcrumbItem(Link) + BreadcrumbSeparator + BreadcrumbCurrent를 조합',
          'ItemCount를 Variant로 두거나, 아이템을 가변 개수로 처리 (Auto Layout + 복제)',
        ]}
      />

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-wrap gap-4 items-center">
        <FigmaFrame name="Breadcrumb/Sub/Item/link">
          <a
            href="#"
            className="text-body-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:underline"
          >
            Project-1
          </a>
        </FigmaFrame>
        <FigmaFrame name="Breadcrumb/Sub/Item/current">
          <span className="text-body-sm text-[var(--color-text-default)]">Instances</span>
        </FigmaFrame>
        <FigmaFrame name="Breadcrumb/Sub/Separator">
          <IconChevronRight size={12} className="text-[var(--color-text-subtle)]" />
        </FigmaFrame>
      </div>

      {/* ═══════════════════════════════════════════
          FEEDBACK
          ═══════════════════════════════════════════ */}
      <CategoryHeader>Feedback</CategoryHeader>

      {/* ════════════════ INLINE MESSAGE ════════════════ */}
      <SectionTitle>InlineMessage</SectionTitle>
      <div className="flex flex-col gap-3 max-w-lg">
        {inlineMessageVariants.map((variant) => (
          <FigmaFrame key={variant} name={`InlineMessage/${variant}`}>
            <InlineMessage variant={variant}>This is a {variant} inline message.</InlineMessage>
          </FigmaFrame>
        ))}
      </div>

      <FigmaGuide
        figmaName="TDS/Feedback/InlineMessage"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'info | success | warning | error' },
          { name: 'Message', type: 'Text', values: '"Message content"' },
          { name: 'Closable', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[{ label: 'Container', direction: 'H', gap: '8px', padding: '12px 16px' }]}
        radius="6px (--primitive-radius-md)"
        tokens={[
          { label: 'Info', value: 'bg: state-info-bg, icon/border: state-info' },
          { label: 'Success', value: 'bg: state-success-bg, icon/border: state-success' },
          { label: 'Warning', value: 'bg: state-warning-bg, icon/border: state-warning' },
          { label: 'Error', value: 'bg: state-danger-bg, icon/border: state-danger' },
          { label: 'Left border', value: '2px, variant별 색상' },
        ]}
        tips={[
          '구조: 좌측 아이콘 + 메시지 텍스트 + (optional) 우측 닫기 버튼. 수평 Auto Layout',
          '좌측 아이콘은 Variant별로 자동 결정: info → InfoCircle, success → CircleCheck, warning → AlertTriangle, error → AlertCircle',
          '배경색과 border-left(2px)가 Variant별로 다름. Figma에서 Color Style로 관리',
          'Closable: 우측에 X 아이콘 표시. Boolean 속성으로 제어',
        ]}
      />

      {/* ════════════════ LOADING ════════════════ */}
      <SectionTitle>Loading</SectionTitle>
      <div className="flex gap-6 items-end">
        <FigmaFrame name="Loading/sm">
          <Loading size="sm" />
        </FigmaFrame>
        <FigmaFrame name="Loading/md">
          <Loading size="md" />
        </FigmaFrame>
        <FigmaFrame name="Loading/lg">
          <Loading size="lg" />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Feedback/Loading"
        properties={[
          { name: 'Size', type: 'Variant', values: 'sm | md | lg' },
          { name: 'Variant', type: 'Variant', values: 'spinner | progress | button' },
        ]}
        autoLayout={[{ label: 'Spinner', direction: 'V', gap: '8px', padding: '0' }]}
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

      {/* ════════════════ FORM FIELD ════════════════ */}
      <SectionTitle>FormField</SectionTitle>
      <div className="flex flex-col gap-6 max-w-md">
        <FigmaFrame name="FormField/default/with-helper">
          <FormField label="Instance Name" helperText="2-64 characters" required>
            <Input placeholder="Enter name" fullWidth />
          </FormField>
        </FigmaFrame>
        <FigmaFrame name="FormField/with-description/with-helper">
          <FormField
            label="Region"
            description="Select your preferred region"
            helperText="Changes after creation are not allowed"
            required
          >
            <Select options={sampleSelectOptions} placeholder="Select region" fullWidth />
          </FormField>
        </FigmaFrame>
        <FigmaFrame name="FormField/error/with-error-message">
          <FormField
            label="Password"
            errorMessage="Password must be at least 8 characters."
            error
            required
          >
            <Input type="password" fullWidth error />
          </FormField>
        </FigmaFrame>
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

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-4 max-w-md">
        <FigmaFrame name="FormField/Sub/Label/default">
          <span className="text-label-sm text-[var(--color-text-default)] font-medium">
            Field Label
          </span>
        </FigmaFrame>
        <FigmaFrame name="FormField/Sub/Label/required">
          <span className="text-label-sm text-[var(--color-text-default)] font-medium">
            Field Label <span className="text-[var(--color-state-danger)]">*</span>
          </span>
        </FigmaFrame>
        <FigmaFrame name="FormField/Sub/Description">
          <span className="text-body-md text-[var(--color-text-subtle)]">
            Select your preferred region for this resource.
          </span>
        </FigmaFrame>
        <FigmaFrame name="FormField/Sub/HelperText">
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            2-64 characters allowed
          </span>
        </FigmaFrame>
        <FigmaFrame name="FormField/Sub/ErrorMessage">
          <span className="text-body-sm text-[var(--color-state-danger)]" role="alert">
            Password must be at least 8 characters.
          </span>
        </FigmaFrame>
      </div>

      {/* ════════════════ SECTION CARD ════════════════ */}
      <SectionTitle>SectionCard</SectionTitle>
      <div className="flex flex-col gap-4">
        <FigmaFrame name="SectionCard/default/with-actions">
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
        </FigmaFrame>
        <FigmaFrame name="SectionCard/active/wizard">
          <SectionCard isActive>
            <SectionCard.Header title="Active Section (Wizard)" />
            <SectionCard.Content>
              <SectionCard.DataRow label="Setting A" value="Configured" />
            </SectionCard.Content>
          </SectionCard>
        </FigmaFrame>
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

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-4">
        <FigmaFrame name="SectionCard/Sub/Header/default">
          <div className="flex items-center justify-between h-[28px]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Basic Information</h3>
          </div>
        </FigmaFrame>
        <FigmaFrame name="SectionCard/Sub/Header/with-actions">
          <div className="flex items-center justify-between h-[28px]">
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Basic Information</h3>
            <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>
              Edit
            </Button>
          </div>
        </FigmaFrame>
        <FigmaFrame name="SectionCard/Sub/Header/with-description">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between h-[28px]">
              <h3 className="text-heading-h5 text-[var(--color-text-default)]">Configuration</h3>
            </div>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              Configure advanced settings for this resource.
            </span>
          </div>
        </FigmaFrame>
        <FigmaFrame name="SectionCard/Sub/DataRow/text">
          <div className="flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]">Name</span>
            <span className="text-body-md text-[var(--color-text-default)]">instance-01</span>
          </div>
        </FigmaFrame>
        <FigmaFrame name="SectionCard/Sub/DataRow/link">
          <div className="flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]">Network</span>
            <a href="#" className="text-body-md text-[var(--color-action-primary)] hover:underline">
              network-01
            </a>
          </div>
        </FigmaFrame>
        <FigmaFrame name="SectionCard/Sub/DataRow/custom">
          <div className="flex flex-col gap-1.5">
            <span className="text-label-sm text-[var(--color-text-subtle)]">Status</span>
            <StatusIndicator status="active" layout="dot-label" />
          </div>
        </FigmaFrame>
        <FigmaFrame name="SectionCard/Sub/Divider">
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />
        </FigmaFrame>
      </div>

      {/* ════════════════ DETAIL HEADER ════════════════ */}
      <SectionTitle>DetailHeader</SectionTitle>
      <FigmaFrame name="DetailHeader/4-cards/with-actions">
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
            <DetailHeader.InfoCard label="Created at" value="Feb 20, 2026 14:30:00" />
          </DetailHeader.InfoGrid>
        </DetailHeader>
      </FigmaFrame>

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

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-4">
        <FigmaFrame name="DetailHeader/Sub/Title">
          <h2 className="text-heading-h5 text-[var(--color-text-default)]">
            instance-production-01
          </h2>
        </FigmaFrame>
        <FigmaFrame name="DetailHeader/Sub/Actions">
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="sm" leftIcon={<IconTerminal2 size={12} />}>
              Console
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
              Start
            </Button>
            <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
              More Actions
            </Button>
          </div>
        </FigmaFrame>
        <div className="flex flex-wrap gap-3">
          <FigmaFrame name="DetailHeader/Sub/InfoCard/default">
            <div className="flex-1 min-w-[160px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Host</span>
                <span className="text-body-md text-[var(--color-text-default)]">
                  compute-node-03
                </span>
              </div>
            </div>
          </FigmaFrame>
          <FigmaFrame name="DetailHeader/Sub/InfoCard/status">
            <div className="flex-1 min-w-[160px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Status</span>
                <StatusIndicator status="active" />
              </div>
            </div>
          </FigmaFrame>
          <FigmaFrame name="DetailHeader/Sub/InfoCard/copyable">
            <div className="flex-1 min-w-[160px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">ID</span>
                <div className="flex items-center gap-1">
                  <span className="text-body-md text-[var(--color-text-default)] truncate">
                    i-0123456789abcdef
                  </span>
                  <button className="shrink-0 p-0.5 rounded hover:bg-[var(--color-surface-hover)]">
                    <IconCopy size={12} className="text-[var(--color-text-muted)]" />
                  </button>
                </div>
              </div>
            </div>
          </FigmaFrame>
          <FigmaFrame name="DetailHeader/Sub/InfoCard/tooltip">
            <div className="flex-1 min-w-[160px] bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-label-sm text-[var(--color-text-subtle)]">IOPS</span>
                  <IconInfoCircle size={12} className="text-[var(--color-text-subtle)]" />
                </div>
                <span className="text-body-md text-[var(--color-text-default)]">3000</span>
              </div>
            </div>
          </FigmaFrame>
        </div>
      </div>

      {/* ════════════════ PAGE HEADER ════════════════ */}
      <SectionTitle>PageHeader</SectionTitle>
      <FigmaFrame name="PageHeader/with-actions">
        <PageHeader
          title="Instances"
          actions={
            <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
              Create Instance
            </Button>
          }
        />
      </FigmaFrame>

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

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <FigmaFrame name="PageHeader/Sub/Title">
          <h1 className="text-heading-h5 text-[var(--color-text-default)]">Instances</h1>
        </FigmaFrame>
        <FigmaFrame name="PageHeader/Sub/TitleExtra">
          <Badge variant="info" size="sm">
            12
          </Badge>
        </FigmaFrame>
        <FigmaFrame name="PageHeader/Sub/Actions">
          <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
            Create Instance
          </Button>
        </FigmaFrame>
      </div>

      {/* ════════════════ INFO BOX ════════════════ */}
      <SectionTitle>InfoBox</SectionTitle>
      <FigmaFrame name="InfoBox/group/3-items">
        <InfoBox.Group>
          <InfoBox label="Resource Name" value="my-deployment" />
          <InfoBox label="Namespace" value="default" />
          <InfoBox label="Created at" value="2026-02-06 14:30:00" />
        </InfoBox.Group>
      </FigmaFrame>

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
      <FigmaFrame name="MetricCard/group/3-items">
        <MetricCard.Group>
          <MetricCard title="Pod restarts" value={3} tooltip="Total restarts." />
          <MetricCard title="CPU usage" value="45%" tooltip="Current CPU utilization." />
          <MetricCard title="Memory" value="1.2 GB" tooltip="Current memory." />
        </MetricCard.Group>
      </FigmaFrame>

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
      <FigmaFrame name="ListToolbar/with-search/with-bulk">
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
      </FigmaFrame>

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

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-4">
        <FigmaFrame name="ListToolbar/Sub/PrimaryActions">
          <ListToolbar.Actions>
            <FilterSearchInput
              filters={filterFields}
              appliedFilters={[]}
              onFiltersChange={() => {}}
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
        </FigmaFrame>
        <FigmaFrame name="ListToolbar/Sub/BulkActions">
          <ListToolbar.Actions>
            <Button variant="muted" size="sm" leftIcon={<IconPlayerPlay size={12} />} disabled>
              Start
            </Button>
            <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled>
              Delete
            </Button>
          </ListToolbar.Actions>
        </FigmaFrame>
        <FigmaFrame name="ListToolbar/Sub/Divider">
          <div className="h-4 w-px bg-[var(--color-border-default)]" />
        </FigmaFrame>
        <FigmaFrame name="ListToolbar/Sub/FilterBar">
          <div className="flex items-center gap-2 pl-2 pr-4 py-2 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)]">
            <Chip label="Status" value="Running" onRemove={() => {}} />
            <Chip label="Name" value="web-server" onRemove={() => {}} />
            <button className="text-label-sm text-[var(--color-action-primary)] hover:underline ml-1">
              Clear all
            </button>
          </div>
        </FigmaFrame>
      </div>

      {/* ════════════════ CONTEXT MENU ════════════════ */}
      <SectionTitle>ContextMenu</SectionTitle>
      <div className="flex gap-4">
        <FigmaFrame name="ContextMenu/click/with-divider">
          <ContextMenu items={contextMenuItems} trigger="click">
            <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
              Actions
            </Button>
          </ContextMenu>
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Overlay/ContextMenu"
        properties={[
          { name: 'Items', type: 'Text', values: '(menu items)' },
          { name: 'Trigger', type: 'Variant', values: 'click | contextmenu' },
        ]}
        autoLayout={[
          { label: 'MenuList', direction: 'V', gap: '2px', padding: '4px' },
          { label: 'MenuItem', direction: 'H', gap: '6px', padding: '6px 8px' },
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

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-3">
        <FigmaFrame name="ContextMenu/Sub/Container">
          <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius,6px)] shadow-md min-w-[80px] p-1">
            <div className="px-2 py-1.5 text-body-sm text-[var(--color-text-default)] rounded-[var(--radius-md)]">
              Edit
            </div>
            <div className="px-2 py-1.5 text-body-sm text-[var(--color-text-default)] rounded-[var(--radius-md)]">
              Duplicate
            </div>
            <div className="px-2 py-1.5 text-body-sm text-[var(--color-text-default)] rounded-[var(--radius-md)]">
              Export
            </div>
            <div className="my-1 border-b border-[var(--color-border-subtle)]" />
            <div className="px-2 py-1.5 text-body-sm text-[var(--color-state-danger)] rounded-[var(--radius-md)]">
              Delete
            </div>
          </div>
        </FigmaFrame>
        <div className="flex flex-wrap gap-4 items-end">
          <FigmaFrame name="ContextMenu/Sub/Item/default">
            <div className="px-2 py-1.5 text-body-sm text-[var(--color-text-default)] rounded-[var(--radius-md)] min-w-[120px]">
              Edit
            </div>
          </FigmaFrame>
          <FigmaFrame name="ContextMenu/Sub/Item/hover">
            <div className="px-2 py-1.5 text-body-sm text-[var(--color-text-default)] bg-[var(--color-surface-hover)] rounded-[var(--radius-md)] min-w-[120px]">
              Edit
            </div>
          </FigmaFrame>
          <FigmaFrame name="ContextMenu/Sub/Item/danger">
            <div className="px-2 py-1.5 text-body-sm text-[var(--color-state-danger)] rounded-[var(--radius-md)] min-w-[120px]">
              Delete
            </div>
          </FigmaFrame>
          <FigmaFrame name="ContextMenu/Sub/Item/with-icon">
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-body-sm text-[var(--color-text-default)] rounded-[var(--radius-md)] min-w-[120px]">
              <IconEdit size={14} className="text-[var(--color-text-muted)]" />
              Edit
            </div>
          </FigmaFrame>
          <FigmaFrame name="ContextMenu/Sub/Divider">
            <div className="w-[120px] my-1 border-b border-[var(--color-border-subtle)]" />
          </FigmaFrame>
          <FigmaFrame name="ContextMenu/Sub/Submenu">
            <div className="flex items-center gap-1.5 px-2 py-1.5 text-body-sm text-[var(--color-text-default)] rounded-[var(--radius-md)] min-w-[120px]">
              <span className="flex-1">Instance status</span>
              <IconChevronRight size={12} className="text-[var(--color-text-muted)]" />
            </div>
          </FigmaFrame>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          OVERLAYS
          ═══════════════════════════════════════════ */}
      <CategoryHeader>Overlays</CategoryHeader>

      {/* ════════════════ TOOLTIP ════════════════ */}
      <SectionTitle>Tooltip</SectionTitle>
      <div className="flex flex-wrap gap-6 items-end">
        <FigmaFrame name="Tooltip/top">
          <Tooltip content="기본 위치 (top)">
            <Button variant="secondary" size="sm">
              Top
            </Button>
          </Tooltip>
        </FigmaFrame>
        <FigmaFrame name="Tooltip/bottom">
          <Tooltip content="아래쪽 표시" position="bottom">
            <Button variant="secondary" size="sm">
              Bottom
            </Button>
          </Tooltip>
        </FigmaFrame>
        <FigmaFrame name="Tooltip/left">
          <Tooltip content="왼쪽 표시" position="left">
            <Button variant="secondary" size="sm">
              Left
            </Button>
          </Tooltip>
        </FigmaFrame>
        <FigmaFrame name="Tooltip/right">
          <Tooltip content="오른쪽 표시" position="right">
            <Button variant="secondary" size="sm">
              Right
            </Button>
          </Tooltip>
        </FigmaFrame>
        <FigmaFrame name="Tooltip/disabled">
          <Tooltip content="비활성 상태" disabled>
            <Button variant="secondary" size="sm">
              Disabled
            </Button>
          </Tooltip>
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Overlay/Tooltip"
        properties={[
          { name: 'Position', type: 'Variant', values: 'top | bottom | left | right' },
          { name: 'Content', type: 'Text', values: '"Tooltip text"' },
        ]}
        autoLayout={[{ label: 'Container', direction: 'H', gap: '0', padding: '4px 6px' }]}
        radius="4px (--primitive-radius-sm)"
        tokens={[
          { label: 'Font', value: '11px (body-xs)' },
          { label: 'Max width', value: '240px' },
          { label: 'Min width', value: '60px' },
          { label: 'BG', value: '--tooltip-bg (dark)' },
          { label: 'Text', value: 'white' },
          { label: 'Arrow', value: '6px triangle, same bg' },
        ]}
        tips={[
          '호버 전용. 인터랙티브 콘텐츠 불가 — 인터랙티브가 필요하면 Popover 사용',
          '긴 텍스트는 max-width 240px에서 자동 줄바꿈. whitespace-nowrap 사용 금지',
          'Figma에서 arrow 포함. Position별로 arrow 방향이 달라짐 (top → 아래쪽 arrow 등)',
          'delay: 200ms (hover 후 표시까지). Figma에서는 표현 불가하므로 spec 문서에 명시',
        ]}
      />

      {/* ════════════════ POPOVER ════════════════ */}
      <SectionTitle>Popover</SectionTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <FigmaFrame name="Popover/click/bottom/arrow">
          <Popover
            trigger="click"
            position="bottom"
            content={
              <div className="p-3">
                <VStack gap={2}>
                  <span className="text-label-sm text-[var(--color-text-default)]">Quick Info</span>
                  <span className="text-body-sm text-[var(--color-text-muted)]">
                    인터랙티브 콘텐츠를 담을 수 있는 팝오버입니다.
                  </span>
                  <Button variant="primary" size="sm">
                    Action
                  </Button>
                </VStack>
              </div>
            }
          >
            <Button variant="secondary" size="sm">
              Click Popover
            </Button>
          </Popover>
        </FigmaFrame>
        <FigmaFrame name="Popover/hover/top/arrow">
          <Popover
            trigger="hover"
            position="top"
            content={<div className="p-3 text-body-sm">Hover로 표시되는 팝오버</div>}
          >
            <Button variant="secondary" size="sm">
              Hover Popover
            </Button>
          </Popover>
        </FigmaFrame>
        <FigmaFrame name="Popover/click/bottom/no-arrow">
          <Popover
            trigger="click"
            position="bottom"
            showArrow={false}
            content={<div className="p-3 text-body-sm">Arrow 없는 팝오버</div>}
          >
            <Button variant="outline" size="sm">
              No Arrow
            </Button>
          </Popover>
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Overlay/Popover"
        properties={[
          { name: 'Position', type: 'Variant', values: 'top | bottom | left | right' },
          { name: 'Trigger', type: 'Variant', values: 'click | hover' },
          { name: 'ShowArrow', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[{ label: 'Container', direction: 'V', gap: '0', padding: '0' }]}
        radius="8px (--primitive-radius-lg)"
        tokens={[
          { label: 'Border', value: '1px, --color-border-default' },
          { label: 'BG', value: '--color-surface-default' },
          { label: 'Arrow size', value: '7px (outer), 6px (inner)' },
          { label: 'Shadow', value: '--shadow-md' },
        ]}
        tips={[
          'Tooltip과 달리 인터랙티브 콘텐츠(폼, 버튼, 메뉴 등) 포함 가능',
          'Figma에서 Content 영역은 Slot frame으로 처리. 내부 콘텐츠는 자유롭게 구성',
          'Arrow는 Position에 따라 방향 변경. ShowArrow=false면 arrow 숨김',
          'click 트리거: 외부 클릭 또는 ESC로 닫힘. hover 트리거: delay/hideDelay로 제어',
          'aria-haspopup="dialog" 자동 적용. Figma에서는 spec 문서에 명시',
        ]}
      />

      {/* ════════════════ MODAL ════════════════ */}
      <SectionTitle>Modal / ConfirmModal</SectionTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <FigmaFrame name="Modal/sm/form">
          <ModalDemo />
        </FigmaFrame>
        <FigmaFrame name="ConfirmModal/sm/danger">
          <ConfirmModalDemo />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Overlay/Modal"
        properties={[
          { name: 'Size', type: 'Variant', values: 'sm | md | lg' },
          { name: 'Title', type: 'Text', values: '"Modal Title"' },
          { name: 'Description', type: 'Text', values: '"Optional description"' },
          { name: 'HasDescription', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'SM', direction: 'V', gap: '16px', padding: '24px' },
          { label: 'MD', direction: 'V', gap: '16px', padding: '24px' },
          { label: 'LG', direction: 'V', gap: '16px', padding: '24px' },
        ]}
        radius="16px (--primitive-radius-xl)"
        tokens={[
          { label: 'SM width', value: '400px' },
          { label: 'MD width', value: '480px' },
          { label: 'LG width', value: '640px' },
          { label: 'Backdrop', value: 'rgba(0,0,0,0.5)' },
          { label: 'Shadow', value: '--shadow-xl' },
        ]}
        tips={[
          '구조: Title → (Description) → Content → Button Group. 수직 Auto Layout, gap 16px',
          'Button Group: 두 버튼이 flex-1로 균등 분할. Cancel(secondary) + Confirm(primary/danger)',
          'ConfirmModal: InfoBox(label + value)가 Content에 포함되는 패턴',
          'Backdrop: 반투명 검은 오버레이. 클릭 시 닫힘 (closeOnBackdropClick)',
          'ESC 키로 닫힘. Figma에서는 spec 문서에 명시',
          'SM/MD 크기는 폼/확인용, LG는 복잡한 콘텐츠용',
        ]}
      />

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-4">
        <FigmaFrame name="Modal/Sub/Overlay">
          <div className="w-[200px] h-[120px] bg-black/60 rounded-[var(--radius-md)]" />
        </FigmaFrame>
        <FigmaFrame name="Modal/Sub/Container">
          <div className="w-[344px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-xl)] shadow-xl p-6">
            <div className="text-body-sm text-[var(--color-text-muted)]">
              Modal container (sm: 344px)
            </div>
          </div>
        </FigmaFrame>
        <FigmaFrame name="Modal/Sub/Title">
          <h3 className="text-heading-h5 text-[var(--color-text-default)]">Delete Resource</h3>
        </FigmaFrame>
        <FigmaFrame name="Modal/Sub/Description">
          <p className="text-body-md text-[var(--color-text-subtle)]">
            This action is permanent and cannot be undone.
          </p>
        </FigmaFrame>
        <FigmaFrame name="Modal/Sub/Content">
          <div className="flex flex-col gap-4">
            <InfoBox label="Resource name" value="instance-01" />
          </div>
        </FigmaFrame>
        <FigmaFrame name="Modal/Sub/Footer">
          <div className="flex gap-2 w-[296px]">
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" className="flex-1">
              Delete
            </Button>
          </div>
        </FigmaFrame>
      </div>

      {/* ════════════════ DRAWER ════════════════ */}
      <SectionTitle>Drawer</SectionTitle>
      <FigmaFrame name="Drawer/right/360/with-footer">
        <DrawerDemo />
      </FigmaFrame>

      <FigmaGuide
        figmaName="TDS/Overlay/Drawer"
        properties={[
          { name: 'Side', type: 'Variant', values: 'left | right' },
          { name: 'Title', type: 'Text', values: '"Drawer Title"' },
          { name: 'HasFooter', type: 'Boolean', values: 'true | false' },
          { name: 'Width', type: 'Variant', values: '360 | 696 | 1032' },
        ]}
        autoLayout={[
          { label: 'Outer', direction: 'V', gap: '0', padding: '0', height: '100vh' },
          { label: 'Header', direction: 'H', gap: '—', padding: '16px 24px', height: '56px' },
          { label: 'Content', direction: 'V', gap: '24px', padding: '0 24px' },
          { label: 'Footer', direction: 'H', gap: '8px', padding: '16px 24px' },
        ]}
        tokens={[
          { label: '4-col width', value: '360px' },
          { label: '8-col width', value: '696px' },
          { label: '12-col width', value: '1032px' },
          { label: 'BG', value: '--color-surface-default' },
          { label: 'Shadow', value: '--shadow-xl' },
          { label: 'Backdrop', value: 'rgba(0,0,0,0.3)' },
        ]}
        tips={[
          '구조: Header(Title + Close) + Content(scrollable) + Footer(sticky). 수직 Auto Layout',
          'Footer: Cancel + Save 버튼이 flex-1로 균등 분할. HStack gap-2',
          'Content 영역은 스크롤 가능. Footer는 하단 고정',
          'Width 3단계: 360px(4col, 간단 폼), 696px(8col, 복잡 폼), 1032px(12col, 대형)',
          'right(기본)에서 슬라이드-인 애니메이션. left도 지원',
          'Backdrop 클릭 또는 ESC로 닫힘',
        ]}
      />

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-4">
        <FigmaFrame name="Drawer/Sub/Overlay">
          <div className="w-[200px] h-[120px] bg-black/40 rounded-[var(--radius-md)]" />
        </FigmaFrame>
        <FigmaFrame name="Drawer/Sub/Title">
          <h3 className="text-heading-h5 text-[var(--color-text-default)]">Edit Instance</h3>
        </FigmaFrame>
        <FigmaFrame name="Drawer/Sub/Description">
          <p className="text-body-md text-[var(--color-text-subtle)] mt-1">
            Create a snapshot of this instance to capture its current system state.
          </p>
        </FigmaFrame>
        <FigmaFrame name="Drawer/Sub/Content">
          <div className="w-[312px] px-6 pt-4 pb-8">
            <VStack gap={6}>
              <FormField label="Instance Name" required>
                <Input placeholder="Enter name" fullWidth />
              </FormField>
              <FormField label="Description">
                <Textarea placeholder="Enter description" fullWidth />
              </FormField>
            </VStack>
          </div>
        </FigmaFrame>
        <FigmaFrame name="Drawer/Sub/Footer">
          <div className="flex gap-2 w-[312px] border-t border-[var(--color-border-default)] px-6 py-4">
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1">
              Save
            </Button>
          </div>
        </FigmaFrame>
      </div>

      {/* ════════════════ TOAST ════════════════ */}
      <SectionTitle>Toast</SectionTitle>
      <FigmaFrame name="Toast/trigger">
        <ToastDemo />
      </FigmaFrame>

      <FigmaGuide
        figmaName="TDS/Feedback/Toast"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'success | warning | error | info' },
          { name: 'Title', type: 'Text', values: '"Toast title"' },
          { name: 'Message', type: 'Text', values: '"Toast message"' },
          { name: 'HasAction', type: 'Boolean', values: 'true | false' },
          { name: 'HasLink', type: 'Boolean', values: 'true | false' },
          { name: 'Dismissible', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'Container', direction: 'H', gap: '12px', padding: '16px' },
          { label: 'Content', direction: 'V', gap: '4px', padding: '0' },
        ]}
        radius="8px (--primitive-radius-lg)"
        tokens={[
          { label: 'Width', value: '360px (fixed)' },
          { label: 'Shadow', value: '--shadow-lg' },
          { label: 'Success icon', value: 'IconCircleCheck, green' },
          { label: 'Error icon', value: 'IconAlertCircle, red' },
          { label: 'Warning icon', value: 'IconAlertTriangle, orange' },
          { label: 'Info icon', value: 'IconInfoCircle, blue' },
        ]}
        tips={[
          '구조: Icon + Content(Title + Message) + Close Button. 수평 Auto Layout',
          'Position: 기본 top-right. 6가지 위치 지원',
          'Auto-dismiss: 기본 5000ms. duration=0이면 수동 닫기만 가능',
          'Action: 버튼 또는 링크. 하단에 표시',
          'Stack: 여러 토스트가 위에서 아래로 쌓임. maxToasts(기본 5)로 제한',
          'useToast() 훅으로 프로그래밍 방식 호출: toast.success(), toast.error() 등',
        ]}
      />

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-4">
        <FigmaFrame name="Toast/Sub/Container">
          <div className="w-[360px] p-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-lg">
            <div className="flex gap-3">
              <IconCircleCheck size={20} className="shrink-0 text-[var(--color-state-success)]" />
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-label-md text-[var(--color-text-default)]">Success</span>
                <span className="text-body-md text-[var(--color-text-muted)]">
                  Instance has been created successfully.
                </span>
              </div>
              <button className="shrink-0 p-1">
                <IconX size={16} className="text-[var(--color-text-muted)]" />
              </button>
            </div>
          </div>
        </FigmaFrame>
        <div className="flex flex-wrap gap-4 items-end">
          <FigmaFrame name="Toast/Sub/Icon/success">
            <IconCircleCheck size={20} className="text-[var(--color-state-success)]" />
          </FigmaFrame>
          <FigmaFrame name="Toast/Sub/Icon/error">
            <IconAlertCircle size={20} className="text-[var(--color-state-danger)]" />
          </FigmaFrame>
          <FigmaFrame name="Toast/Sub/Icon/warning">
            <IconAlertTriangle size={20} className="text-[var(--color-state-warning)]" />
          </FigmaFrame>
          <FigmaFrame name="Toast/Sub/Icon/info">
            <IconInfoCircle size={20} className="text-[var(--color-state-info)]" />
          </FigmaFrame>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <FigmaFrame name="Toast/Sub/Title">
            <span className="text-label-md text-[var(--color-text-default)]">Instance Created</span>
          </FigmaFrame>
          <FigmaFrame name="Toast/Sub/Message">
            <span className="text-body-md text-[var(--color-text-muted)]">
              Your instance has been successfully created.
            </span>
          </FigmaFrame>
          <FigmaFrame name="Toast/Sub/CloseButton">
            <button className="p-1 rounded hover:bg-[var(--color-surface-hover)]">
              <IconX size={16} className="text-[var(--color-text-muted)]" />
            </button>
          </FigmaFrame>
          <FigmaFrame name="Toast/Sub/Timestamp">
            <span className="text-body-sm text-[var(--color-text-subtle)]">2 min ago</span>
          </FigmaFrame>
        </div>
      </div>

      {/* ════════════════ TABLE ════════════════ */}
      <SectionTitle>Table</SectionTitle>
      <FigmaFrame name="Table/selectable/resizable">
        <TableDemo />
      </FigmaFrame>

      <FigmaGuide
        figmaName="TDS/Data/Table"
        properties={[
          { name: 'Selectable', type: 'Boolean', values: 'true | false' },
          { name: 'StickyHeader', type: 'Boolean', values: 'true | false' },
          { name: 'Resizable', type: 'Boolean', values: 'true | false (default: true)' },
        ]}
        autoLayout={[
          { label: 'Table', direction: 'V', gap: '--table-row-gap', padding: '0' },
          { label: 'Row', direction: 'H', gap: '0', padding: '0', height: '44px' },
          { label: 'Cell', direction: 'H', gap: '0', padding: '8px 12px' },
        ]}
        radius="--table-row-radius (rows)"
        tokens={[
          { label: 'Row height', value: '--table-row-height (44px)' },
          { label: 'Cell padding-x', value: '--table-cell-padding-x (12px)' },
          { label: 'Cell padding-y', value: '--table-cell-padding-y (8px)' },
          { label: 'Font size', value: '--table-font-size (12px)' },
          { label: 'Row radius', value: '--table-row-radius' },
          { label: 'Row hover bg', value: '--table-row-hover-bg' },
          { label: 'Header bg', value: '--table-header-bg' },
          { label: 'Resize handle', value: '3px wide, --color-border-focus on hover' },
        ]}
        tips={[
          '정렬: 클릭 시 오름차순 → 내림차순 → 해제. 헤더에 정렬 아이콘 표시',
          '선택: 체크박스로 행 선택. 헤더 체크박스로 전체 선택/해제',
          '컬럼 리사이즈: 헤더 경계 드래그. 더블클릭으로 콘텐츠 맞춤. 키보드(Arrow)도 지원',
          '리사이즈 정책: Overflow 모드 — 개별 컬럼 리사이즈 시 다른 컬럼 영향 없음',
          '텍스트 말줄임: 긴 텍스트는 truncate 처리, hover 시 title 속성으로 전체 표시',
          '고정 너비 컬럼(width prop): 리사이즈 불가 (Status, Actions 등)',
          'flex 컬럼(flex prop): 기본 리사이즈 가능. 최소 50px',
          'Figma에서 Table은 Row 컴포넌트를 반복 배치. Header Row + Body Row를 분리',
        ]}
      />

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 items-end">
          <FigmaFrame name="Table/Sub/HeaderCell/default">
            <div className="inline-flex items-center px-[var(--table-cell-padding-x,12px)] py-[var(--table-header-padding-y,8px)] bg-[var(--table-header-bg,var(--color-surface-subtle))] text-[length:var(--table-header-font-size,12px)] font-medium text-[var(--color-text-default)]">
              Name
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/HeaderCell/sortable">
            <div className="inline-flex items-center gap-1 px-[var(--table-cell-padding-x,12px)] py-[var(--table-header-padding-y,8px)] bg-[var(--table-header-bg,var(--color-surface-subtle))] text-[length:var(--table-header-font-size,12px)] font-medium text-[var(--color-text-default)] cursor-pointer">
              Name
              <IconSelector size={14} className="text-[var(--color-text-subtle)]" />
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/HeaderCell/sorted-asc">
            <div className="inline-flex items-center gap-1 px-[var(--table-cell-padding-x,12px)] py-[var(--table-header-padding-y,8px)] bg-[var(--table-header-bg,var(--color-surface-subtle))] text-[length:var(--table-header-font-size,12px)] font-medium text-[var(--color-action-primary)] cursor-pointer">
              Name
              <IconChevronUp size={14} className="text-[var(--color-action-primary)]" />
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/HeaderCell/sorted-desc">
            <div className="inline-flex items-center gap-1 px-[var(--table-cell-padding-x,12px)] py-[var(--table-header-padding-y,8px)] bg-[var(--table-header-bg,var(--color-surface-subtle))] text-[length:var(--table-header-font-size,12px)] font-medium text-[var(--color-action-primary)] cursor-pointer">
              Name
              <IconChevronDown size={14} className="text-[var(--color-action-primary)]" />
            </div>
          </FigmaFrame>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <FigmaFrame name="Table/Sub/HeaderCheckbox">
            <div className="inline-flex items-center justify-center w-[var(--table-checkbox-width,40px)] py-[var(--table-header-padding-y,8px)] bg-[var(--table-header-bg,var(--color-surface-subtle))]">
              <Checkbox checked={false} onChange={() => {}} />
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/RowCheckbox">
            <div className="inline-flex items-center justify-center w-[var(--table-checkbox-width,40px)] py-[var(--table-cell-padding-y,8px)]">
              <Checkbox checked={false} onChange={() => {}} />
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/RowCheckbox/checked">
            <div className="inline-flex items-center justify-center w-[var(--table-checkbox-width,40px)] py-[var(--table-cell-padding-y,8px)]">
              <Checkbox checked onChange={() => {}} />
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/ResizeHandle">
            <div className="w-[var(--table-resize-handle-width,4px)] h-[44px] bg-[var(--color-border-focus)] cursor-col-resize" />
          </FigmaFrame>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <FigmaFrame name="Table/Sub/DataCell/text">
            <div className="inline-flex items-center px-[var(--table-cell-padding-x,12px)] py-[var(--table-cell-padding-y,8px)] text-[length:var(--table-font-size,12px)] text-[var(--color-text-default)]">
              web-server-01
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/DataCell/badge">
            <div className="inline-flex items-center px-[var(--table-cell-padding-x,12px)] py-[var(--table-cell-padding-y,8px)]">
              <Badge variant="success" size="sm">
                Running
              </Badge>
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/DataCell/status">
            <div className="inline-flex items-center justify-center px-[var(--table-cell-padding-x,12px)] py-[var(--table-cell-padding-y,8px)]">
              <StatusIndicator status="active" />
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/DataCell/link">
            <div className="inline-flex items-center px-[var(--table-cell-padding-x,12px)] py-[var(--table-cell-padding-y,8px)]">
              <a
                href="#"
                className="text-[length:var(--table-font-size,12px)] text-[var(--color-action-primary)] hover:underline"
              >
                network-01
              </a>
            </div>
          </FigmaFrame>
          <FigmaFrame name="Table/Sub/DataCell/mono">
            <div className="inline-flex items-center px-[var(--table-cell-padding-x,12px)] py-[var(--table-cell-padding-y,8px)] font-mono text-[length:var(--table-font-size,12px)] text-[var(--color-text-default)]">
              i-0123456789abcdef
            </div>
          </FigmaFrame>
        </div>
        <FigmaFrame name="Table/Sub/DataRow/default">
          <div className="flex items-center min-h-[var(--table-row-height,44px)] rounded-[var(--table-row-radius,6px)] bg-[var(--color-surface-default)]">
            <div className="px-3 py-2 text-[length:12px] text-[var(--color-text-default)] flex-1">
              web-server-01
            </div>
            <div className="px-3 py-2 text-[length:12px] flex-1">
              <Badge variant="success" size="sm">
                Running
              </Badge>
            </div>
            <div className="px-3 py-2 text-[length:12px] text-[var(--color-text-default)] flex-1 text-right">
              Mar 01, 2026
            </div>
          </div>
        </FigmaFrame>
        <FigmaFrame name="Table/Sub/DataRow/selected">
          <div className="flex items-center min-h-[var(--table-row-height,44px)] rounded-[var(--table-row-radius,6px)] bg-[var(--color-state-info-bg)]">
            <div className="flex items-center justify-center w-[40px]">
              <Checkbox checked onChange={() => {}} />
            </div>
            <div className="px-3 py-2 text-[length:12px] text-[var(--color-text-default)] flex-1">
              web-server-01
            </div>
            <div className="px-3 py-2 text-[length:12px] flex-1">
              <Badge variant="success" size="sm">
                Running
              </Badge>
            </div>
            <div className="px-3 py-2 text-[length:12px] text-[var(--color-text-default)] flex-1 text-right">
              Mar 01, 2026
            </div>
          </div>
        </FigmaFrame>
        <FigmaFrame name="Table/Sub/DataRow/hover">
          <div className="flex items-center min-h-[var(--table-row-height,44px)] rounded-[var(--table-row-radius,6px)] bg-[var(--table-row-hover-bg,var(--color-surface-hover))]">
            <div className="px-3 py-2 text-[length:12px] text-[var(--color-text-default)] flex-1">
              web-server-01
            </div>
            <div className="px-3 py-2 text-[length:12px] flex-1">
              <Badge variant="success" size="sm">
                Running
              </Badge>
            </div>
            <div className="px-3 py-2 text-[length:12px] text-[var(--color-text-default)] flex-1 text-right">
              Mar 01, 2026
            </div>
          </div>
        </FigmaFrame>
      </div>

      {/* ════════════════ DATE PICKER ════════════════ */}
      <SectionTitle>DatePicker</SectionTitle>
      <div className="flex flex-wrap gap-8 items-end">
        <FigmaFrame name="DatePicker/single">
          <DatePicker mode="single" />
        </FigmaFrame>
        <FigmaFrame name="DatePicker/range">
          <DatePicker mode="range" />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/DatePicker"
        properties={[
          { name: 'Mode', type: 'Variant', values: 'single | range' },
          { name: 'Disabled', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'Container', direction: 'V', gap: '8px', padding: '16px' },
          { label: 'Header', direction: 'H', gap: '—', padding: '0', height: '32px' },
          { label: 'Day Grid', direction: 'H (wrap)', gap: '0', padding: '0' },
        ]}
        radius="8px (--primitive-radius-lg) — calendar panel"
        tokens={[
          { label: 'Day cell size', value: '32px × 32px' },
          { label: 'Selected bg', value: '--color-action-primary' },
          { label: 'Range bg', value: '--color-state-info-bg (blue-50)' },
          { label: 'Today border', value: '--color-action-primary (ring)' },
          { label: 'Header font', value: 'heading-h6 (14px semibold)' },
          { label: 'Day font', value: 'body-sm (11px)' },
        ]}
        tips={[
          '구조: Header(월 네비게이션) + Day Grid(7×6). 수직 Auto Layout',
          'Header: ◀ [Month Year] ▶. 좌우 화살표로 월 전환',
          'Day Grid: 7열(요일) × 최대 6행. 각 셀 32×32px, 중앙 정렬',
          'Selected: 원형 파란 배경 + 흰 텍스트. Range: 시작/끝은 원형, 사이는 연한 파란 배경',
          'Today: 파란 ring(outline). 선택되지 않은 오늘 날짜 표시',
          'Event dot: 날짜 아래 작은 dot으로 이벤트 표시. eventDates prop',
          'Disabled 날짜: opacity 감소, 클릭 불가',
        ]}
      />

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-col gap-4">
        <FigmaFrame name="DatePicker/Sub/MonthNav">
          <div className="flex items-center gap-2 justify-between w-[260px]">
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-surface-hover)]">
              <IconChevronLeft size={12} className="text-[var(--color-text-muted)]" />
            </button>
            <span className="w-[64px] text-center text-heading-h6 text-[var(--color-text-default)]">
              Mar 2026
            </span>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-surface-hover)]">
              <IconChevronRight size={12} className="text-[var(--color-text-muted)]" />
            </button>
          </div>
        </FigmaFrame>
        <FigmaFrame name="DatePicker/Sub/WeekdayHeaders">
          <div className="grid grid-cols-7 gap-0" style={{ width: 260 }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div
                key={d}
                className="w-[32px] h-[32px] flex items-center justify-center text-label-sm text-[var(--color-text-muted)]"
              >
                {d}
              </div>
            ))}
          </div>
        </FigmaFrame>
        <div className="flex flex-wrap gap-3 items-end">
          <FigmaFrame name="DatePicker/Sub/DayCell/default">
            <div className="w-[32px] h-[32px] flex items-center justify-center text-label-md text-[var(--color-text-default)] rounded-full cursor-pointer hover:bg-[var(--color-surface-hover)]">
              15
            </div>
          </FigmaFrame>
          <FigmaFrame name="DatePicker/Sub/DayCell/selected">
            <div className="w-[32px] h-[32px] flex items-center justify-center text-label-md text-[var(--color-text-on-primary)] bg-[var(--color-action-primary)] rounded-full">
              11
            </div>
          </FigmaFrame>
          <FigmaFrame name="DatePicker/Sub/DayCell/today">
            <div className="w-[32px] h-[32px] flex items-center justify-center text-label-md text-[var(--color-text-default)] rounded-full ring-1 ring-[var(--color-action-primary)]">
              11
            </div>
          </FigmaFrame>
          <FigmaFrame name="DatePicker/Sub/DayCell/disabled">
            <div className="w-[32px] h-[32px] flex items-center justify-center text-label-md text-[var(--color-text-default)] rounded-full opacity-50 cursor-not-allowed">
              28
            </div>
          </FigmaFrame>
          <FigmaFrame name="DatePicker/Sub/DayCell/other-month">
            <div className="w-[32px] h-[32px] flex items-center justify-center text-label-md text-[var(--color-text-muted)] rounded-full">
              1
            </div>
          </FigmaFrame>
          <FigmaFrame name="DatePicker/Sub/DayCell/range-start">
            <div className="w-[32px] h-[32px] flex items-center justify-center text-label-md text-[var(--color-text-on-primary)] bg-[var(--color-action-primary)] rounded-full">
              5
            </div>
          </FigmaFrame>
          <FigmaFrame name="DatePicker/Sub/DayCell/range-end">
            <div className="w-[32px] h-[32px] flex items-center justify-center text-label-md text-[var(--color-text-on-primary)] bg-[var(--color-action-primary)] rounded-full">
              12
            </div>
          </FigmaFrame>
          <FigmaFrame name="DatePicker/Sub/DayCell/in-range">
            <div className="w-[32px] h-[32px] flex items-center justify-center text-label-md text-[var(--color-text-default)] bg-[var(--color-state-info-bg)]">
              8
            </div>
          </FigmaFrame>
        </div>
      </div>

      {/* ════════════════ TAB BAR ════════════════ */}
      <SectionTitle>TabBar</SectionTitle>
      <FigmaFrame name="TabBar/with-add/3-tabs">
        <TabBarDemo />
      </FigmaFrame>

      <FigmaGuide
        figmaName="TDS/Navigation/TabBar"
        properties={[
          { name: 'ShowAddButton', type: 'Boolean', values: 'true | false' },
          { name: 'ShowWindowControls', type: 'Boolean', values: 'true | false' },
          { name: 'TabState', type: 'Variant', values: 'active | inactive | hover' },
        ]}
        autoLayout={[
          { label: 'Bar', direction: 'H', gap: '0', padding: '0', height: '36px' },
          { label: 'Tab', direction: 'H', gap: '4px', padding: '8px 12px' },
        ]}
        radius="6px (top-left, top-right — active tab)"
        tokens={[
          { label: 'Height', value: '36px' },
          { label: 'Tab padding', value: '8px 12px' },
          { label: 'Active tab bg', value: '--color-surface-default' },
          { label: 'Inactive tab bg', value: 'transparent' },
          { label: 'Close icon', value: 'IconX, 12px' },
          { label: 'Add icon', value: 'IconPlus, 14px' },
          { label: 'BG', value: '--color-surface-subtle' },
        ]}
        tips={[
          '브라우저 탭과 유사한 UI. 드래그로 탭 순서 변경 가능',
          '구조: WindowControls(좌) + Tab List(중앙, 스크롤) + Add Button(우). 수평 Auto Layout',
          'Active 탭: 흰 배경 + 살짝 볼록한 효과. Inactive: 투명 배경',
          'Close 버튼: 각 탭 우측에 X 아이콘. hover 시만 표시. closable=false면 숨김',
          'WindowControls: 빨강/노랑/초록 dot 3개. macOS 스타일',
          'Add 버튼: + 아이콘. 새 탭 추가',
          'Figma에서 Tab을 별도 컴포넌트로: State(active/inactive/hover) + Closable Boolean',
        ]}
      />

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <FigmaFrame name="TabBar/Sub/Tab/active">
          <div className="relative group flex items-center gap-[var(--tabbar-tab-gap,4px)] w-[160px] h-[36px] px-[var(--tabbar-tab-padding-x,12px)] bg-[var(--color-surface-default)] border-r border-[var(--color-border-subtle)] rounded-t-[6px]">
            <IconServer size={12} className="shrink-0 text-[var(--color-text-default)]" />
            <span className="flex-1 truncate text-[length:var(--tabbar-font-size,12px)] font-medium text-[var(--color-text-default)]">
              Active Tab
            </span>
            <button className="shrink-0 size-[16px] flex items-center justify-center rounded-[var(--radius-sm)]">
              <IconX size={12} className="text-[var(--color-text-muted)]" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-action-primary)] z-20" />
          </div>
        </FigmaFrame>
        <FigmaFrame name="TabBar/Sub/Tab/inactive">
          <div className="relative group flex items-center gap-[var(--tabbar-tab-gap,4px)] w-[160px] h-[36px] px-[var(--tabbar-tab-padding-x,12px)] bg-transparent border-r border-[var(--color-border-subtle)]">
            <IconServer size={12} className="shrink-0 text-[var(--color-text-muted)]" />
            <span className="flex-1 truncate text-[length:var(--tabbar-font-size,12px)] font-medium text-[var(--color-text-muted)]">
              Inactive Tab
            </span>
            <button className="shrink-0 size-[16px] flex items-center justify-center rounded-[var(--radius-sm)] opacity-0">
              <IconX size={12} className="text-[var(--color-text-muted)]" />
            </button>
          </div>
        </FigmaFrame>
        <FigmaFrame name="TabBar/Sub/Tab/CloseButton">
          <button className="size-[16px] flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-hover)]">
            <IconX size={12} className="text-[var(--color-text-muted)]" />
          </button>
        </FigmaFrame>
        <FigmaFrame name="TabBar/Sub/Tab/ActiveIndicator">
          <div className="w-[160px] h-[2px] bg-[var(--color-action-primary)]" />
        </FigmaFrame>
        <FigmaFrame name="TabBar/Sub/AddButton">
          <button className="shrink-0 size-[28px] flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)]">
            <IconPlus size={14} className="text-[var(--color-text-muted)]" />
          </button>
        </FigmaFrame>
        <FigmaFrame name="TabBar/Sub/WindowControls">
          <div className="flex items-center gap-1 px-2">
            <WindowControl variant="minimize" onClick={() => {}} />
            <WindowControl variant="maximize" onClick={() => {}} />
            <WindowControl variant="close" onClick={() => {}} />
          </div>
        </FigmaFrame>
        <FigmaFrame name="TabBar/Sub/WindowControl/minimize">
          <WindowControl variant="minimize" onClick={() => {}} />
        </FigmaFrame>
        <FigmaFrame name="TabBar/Sub/WindowControl/maximize">
          <WindowControl variant="maximize" onClick={() => {}} />
        </FigmaFrame>
        <FigmaFrame name="TabBar/Sub/WindowControl/close">
          <WindowControl variant="close" onClick={() => {}} />
        </FigmaFrame>
      </div>

      {/* ════════════════ TOP BAR ════════════════ */}
      <SectionTitle>TopBar</SectionTitle>
      <FigmaFrame name="TopBar/with-nav/with-actions">
        <div className="border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] overflow-hidden">
          <TopBar
            showSidebarToggle
            onSidebarToggle={() => {}}
            showNavigation
            onBack={() => {}}
            onForward={() => {}}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Project-1', href: '#' },
                  { label: 'Compute', href: '#' },
                  { label: 'Instances' },
                ]}
              />
            }
            actions={
              <>
                <TopBarAction
                  icon={<IconTerminal2 size={16} stroke={1.5} />}
                  aria-label="Console"
                />
                <TopBarAction
                  icon={<IconBell size={16} stroke={1.5} />}
                  aria-label="Notifications"
                  badge
                />
              </>
            }
          />
        </div>
      </FigmaFrame>

      <FigmaGuide
        figmaName="TDS/Navigation/TopBar"
        properties={[
          { name: 'ShowSidebarToggle', type: 'Boolean', values: 'true | false' },
          { name: 'ShowNavigation', type: 'Boolean', values: 'true | false' },
          { name: 'HasActions', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'Bar', direction: 'H', gap: '8px', padding: '0 12px', height: '40px' },
        ]}
        tokens={[
          { label: 'Height', value: '40px' },
          { label: 'BG', value: '--color-surface-default' },
          { label: 'Border bottom', value: '1px, --color-border-subtle' },
          { label: 'Action icon size', value: '16px, stroke 1.5' },
          { label: 'Nav button size', value: '24px × 24px' },
          { label: 'Badge dot', value: '6px, red (notifications)' },
        ]}
        tips={[
          '구조: SidebarToggle + Navigation(◀▶) + Breadcrumb + Actions. 수평 Auto Layout',
          'SidebarToggle: 사이드바가 닫혀있을 때만 표시. 클릭 시 사이드바 열림',
          'Navigation: 뒤로/앞으로 버튼. canGoBack/canGoForward로 비활성화 제어',
          'Breadcrumb: TopBar 중앙에 배치. flex-1로 남은 공간 차지',
          'Actions: 우측에 아이콘 버튼들. TopBarAction 컴포넌트로 생성',
          'TopBarAction의 badge: 빨간 dot으로 알림 표시. Boolean 속성',
        ]}
      />

      <SubTitle>Sub Elements</SubTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <FigmaFrame name="TopBar/Sub/SidebarToggle">
          <button className="size-[var(--topbar-button-size,28px)] flex items-center justify-center rounded-[var(--topbar-button-radius,6px)] hover:bg-[var(--color-surface-hover)]">
            <IconLayoutSidebar size={14} className="text-[var(--color-text-muted)]" />
          </button>
        </FigmaFrame>
        <FigmaFrame name="TopBar/Sub/Navigation">
          <div className="flex items-center gap-0.5">
            <button className="size-[var(--topbar-button-size,28px)] flex items-center justify-center rounded-[var(--topbar-button-radius,6px)] hover:bg-[var(--color-surface-hover)]">
              <IconArrowLeft size={12} className="text-[var(--color-text-muted)]" />
            </button>
            <button className="size-[var(--topbar-button-size,28px)] flex items-center justify-center rounded-[var(--topbar-button-radius,6px)] hover:bg-[var(--color-surface-hover)]">
              <IconArrowRight size={12} className="text-[var(--color-text-muted)]" />
            </button>
          </div>
        </FigmaFrame>
        <FigmaFrame name="TopBar/Sub/Navigation/BackButton">
          <button className="size-[var(--topbar-button-size,28px)] flex items-center justify-center rounded-[var(--topbar-button-radius,6px)] hover:bg-[var(--color-surface-hover)]">
            <IconArrowLeft size={12} className="text-[var(--color-text-muted)]" />
          </button>
        </FigmaFrame>
        <FigmaFrame name="TopBar/Sub/Navigation/ForwardButton">
          <button className="size-[var(--topbar-button-size,28px)] flex items-center justify-center rounded-[var(--topbar-button-radius,6px)] hover:bg-[var(--color-surface-hover)]">
            <IconArrowRight size={12} className="text-[var(--color-text-muted)]" />
          </button>
        </FigmaFrame>
        <FigmaFrame name="TopBar/Sub/TopBarAction/default">
          <TopBarAction icon={<IconTerminal2 size={16} stroke={1.5} />} aria-label="Console" />
        </FigmaFrame>
        <FigmaFrame name="TopBar/Sub/TopBarAction/with-badge">
          <TopBarAction
            icon={<IconBell size={16} stroke={1.5} />}
            aria-label="Notifications"
            badge
          />
        </FigmaFrame>
        <FigmaFrame name="TopBar/Sub/TopBarAction/active">
          <TopBarAction
            icon={<IconTerminal2 size={16} stroke={1.5} />}
            aria-label="Console"
            active
          />
        </FigmaFrame>
      </div>

      {/* ═══════════════════════════════════════════
          LAYOUT & UTILITY
          ═══════════════════════════════════════════ */}
      <CategoryHeader>Layout &amp; Utility</CategoryHeader>

      {/* ════════════════ SKELETON ════════════════ */}
      <SectionTitle>Skeleton</SectionTitle>
      <div className="flex flex-col gap-6">
        <SubTitle>Basic Variants</SubTitle>
        <div className="flex flex-wrap gap-6 items-end">
          <FigmaFrame name="Skeleton/text/3-lines">
            <SkeletonText lines={3} />
          </FigmaFrame>
          <FigmaFrame name="Skeleton/rectangular/default">
            <Skeleton variant="rectangular" width={120} height={80} />
          </FigmaFrame>
          <FigmaFrame name="Skeleton/circular/default">
            <Skeleton variant="circular" size={48} />
          </FigmaFrame>
          <FigmaFrame name="Skeleton/rounded/default">
            <Skeleton variant="rounded" width={120} height={40} />
          </FigmaFrame>
        </div>
        <SubTitle>Table Skeleton</SubTitle>
        <FigmaFrame name="Skeleton/table/3x4">
          <SkeletonTable rows={3} columns={4} />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Feedback/Skeleton"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'text | circular | rectangular | rounded' },
          { name: 'Animation', type: 'Variant', values: 'pulse | wave | none' },
          { name: 'Width', type: 'Text', values: '(px or %)' },
          { name: 'Height', type: 'Text', values: '(px)' },
        ]}
        radius="4px (rectangular/rounded), 9999px (circular), 2px (text)"
        tokens={[
          { label: 'BG', value: '--color-surface-muted (shimmer)' },
          { label: 'Pulse animation', value: 'opacity 0.4 → 1.0, 1.5s ease-in-out infinite' },
          { label: 'Text height', value: '14px per line' },
          { label: 'Text gap', value: '8px between lines' },
        ]}
        tips={[
          '데이터 로딩 중 콘텐츠의 위치를 미리 보여주는 플레이스홀더',
          'Presets: SkeletonText(텍스트 블록), SkeletonAvatar(프로필), SkeletonButton(버튼), SkeletonTable(테이블)',
          'Figma에서 pulse 애니메이션 재현 불가. 정적 프레임으로 캡처하고 spec에 애니메이션 명시',
          'loading prop: true일 때 skeleton 표시, false면 children 표시. 조건부 렌더링에 활용',
          'Table Skeleton: rows × columns 그리드로 자동 생성. 테이블 로딩 상태용',
        ]}
      />

      {/* ════════════════ TAG ════════════════ */}
      <SectionTitle>Tag</SectionTitle>
      <div className="flex flex-col gap-4">
        <SubTitle>Variants</SubTitle>
        <div className="flex flex-wrap gap-3 items-end">
          <FigmaFrame name="Tag/default/md">
            <Tag variant="default">Default</Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/primary/md">
            <Tag variant="primary">Primary</Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/success/md">
            <Tag variant="success">Success</Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/warning/md">
            <Tag variant="warning">Warning</Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/danger/md">
            <Tag variant="danger">Danger</Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/info/md">
            <Tag variant="info">Info</Tag>
          </FigmaFrame>
        </div>
        <SubTitle>Features</SubTitle>
        <div className="flex flex-wrap gap-3 items-end">
          <FigmaFrame name="Tag/primary/closable">
            <Tag variant="primary" closable onClose={() => {}}>
              Closable
            </Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/default/with-icon">
            <Tag variant="default" icon={<IconTag size={12} />}>
              With Icon
            </Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/primary/rounded">
            <Tag variant="primary" rounded>
              Rounded
            </Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/default/outline">
            <Tag variant="default" outline>
              Outline
            </Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/default/disabled">
            <Tag variant="default" disabled>
              Disabled
            </Tag>
          </FigmaFrame>
        </div>
        <SubTitle>Sizes</SubTitle>
        <div className="flex flex-wrap gap-3 items-end">
          <FigmaFrame name="Tag/default/sm">
            <Tag size="sm">Small</Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/default/md">
            <Tag size="md">Medium</Tag>
          </FigmaFrame>
          <FigmaFrame name="Tag/default/lg">
            <Tag size="lg">Large</Tag>
          </FigmaFrame>
        </div>
      </div>

      <FigmaGuide
        figmaName="TDS/Data/Tag"
        properties={[
          {
            name: 'Variant',
            type: 'Variant',
            values: 'default | primary | success | warning | danger | info',
          },
          { name: 'Size', type: 'Variant', values: 'sm | md | lg' },
          { name: 'Closable', type: 'Boolean', values: 'true | false' },
          { name: 'Rounded', type: 'Boolean', values: 'true | false' },
          { name: 'Outline', type: 'Boolean', values: 'true | false' },
          { name: 'Icon', type: 'Instance swap', values: 'icon slot' },
          { name: 'Label', type: 'Text', values: '"Tag"' },
        ]}
        autoLayout={[
          { label: 'SM', direction: 'H', gap: '4px', padding: '2px 6px' },
          { label: 'MD', direction: 'H', gap: '4px', padding: '4px 8px' },
          { label: 'LG', direction: 'H', gap: '4px', padding: '4px 12px' },
        ]}
        radius="4px (--primitive-radius-sm), rounded=true 시 9999px"
        tokens={[
          { label: 'Default bg', value: '--color-surface-subtle' },
          { label: 'Default text', value: '--color-text-default' },
          { label: 'Primary bg', value: '--color-state-info-bg' },
          { label: 'Primary text', value: '--color-state-info' },
          { label: 'Success bg', value: '--color-state-success-bg' },
          { label: 'Danger bg', value: '--color-state-danger-bg' },
          { label: 'Close icon', value: 'IconX, 10px' },
          { label: 'Outline border', value: '1px, variant별 색상' },
        ]}
        tips={[
          'Badge와 유사하나 closable/clickable 인터랙션 지원. 필터 태그, 카테고리 등에 사용',
          'rounded: pill 형태 (radius 9999px). 기본은 rounded-sm',
          'outline: 배경 투명 + border만 표시',
          'closable: 우측에 X 아이콘. 클릭 시 onClose 콜백',
          'TagGroup: 여러 Tag를 감싸는 래퍼. gap sm/md/lg 지원',
          'Badge vs Tag vs Chip: Badge(읽기 전용), Tag(closable/clickable), Chip(선택/필터)',
        ]}
      />

      {/* ════════════════ DISCLOSURE ════════════════ */}
      <SectionTitle>Disclosure</SectionTitle>
      <div className="max-w-lg flex flex-col gap-4">
        <FigmaFrame name="Disclosure/collapsed">
          <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
            <Disclosure>
              <Disclosure.Trigger>Volume details</Disclosure.Trigger>
            </Disclosure>
          </div>
        </FigmaFrame>
        <FigmaFrame name="Disclosure/expanded">
          <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
            <Disclosure defaultOpen>
              <Disclosure.Trigger>Volume details</Disclosure.Trigger>
              <Disclosure.Panel>
                <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                  <p>Name: vol-12345</p>
                  <p>Size: 100 GiB</p>
                  <p>Status: Available</p>
                </div>
              </Disclosure.Panel>
            </Disclosure>
          </div>
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Feedback/Disclosure"
        properties={[
          { name: 'State', type: 'Variant', values: 'collapsed | expanded' },
          { name: 'Title', type: 'Text', values: '"Section Title"' },
          { name: 'DefaultOpen', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'Container', direction: 'V', gap: '0', padding: '0' },
          { label: 'Trigger', direction: 'H', gap: '8px', padding: '8px 0' },
        ]}
        tokens={[
          { label: 'Chevron', value: 'IconChevronDown, 14px, 180° rotation on expand' },
          { label: 'Title font', value: 'label-md (12px medium)' },
          { label: 'Border', value: 'border-b border-subtle (trigger bottom)' },
        ]}
        tips={[
          '구조: Trigger(Title + Chevron) + Panel(Content). 수직 Auto Layout',
          'Trigger 클릭 시 Panel 토글. Chevron 아이콘이 회전(0° → 180°)',
          'collapsed: Trigger만 표시, expanded: Trigger + Panel 모두 표시',
          'Figma에서 State를 Variant로: collapsed / expanded',
          'Controlled 모드: open + onChange prop으로 외부 상태 제어 가능',
          'Figma 캡처 페이지의 FigmaGuide 블록 등에서 실제 사용 중',
        ]}
      />

      {/* ════════════════ COPY BUTTON ════════════════ */}
      <SectionTitle>CopyButton / Copyable</SectionTitle>
      <div className="flex flex-col gap-4">
        <SubTitle>CopyButton</SubTitle>
        <div className="flex flex-wrap gap-4 items-end">
          <FigmaFrame name="CopyButton/ghost/sm/icon-only">
            <CopyButton value="copied-text" variant="ghost" size="sm" />
          </FigmaFrame>
          <FigmaFrame name="CopyButton/outline/sm/with-label">
            <CopyButton value="copied-text" variant="outline" size="sm" label="Copy ID" />
          </FigmaFrame>
        </div>
        <SubTitle>Copyable (텍스트 + 복사 버튼)</SubTitle>
        <div className="flex flex-col gap-2">
          <FigmaFrame name="Copyable/default">
            <Copyable value="i-0123456789abcdef" />
          </FigmaFrame>
          <FigmaFrame name="Copyable/truncate">
            <Copyable
              value="very-long-resource-identifier-that-should-be-truncated"
              truncate
              maxWidth="200px"
            />
          </FigmaFrame>
        </div>
      </div>

      <FigmaGuide
        figmaName="TDS/Utility/CopyButton"
        properties={[
          { name: 'Variant', type: 'Variant', values: 'default | ghost | outline' },
          { name: 'Size', type: 'Variant', values: 'sm | md | lg' },
          { name: 'State', type: 'Variant', values: 'default | copied' },
          { name: 'IconOnly', type: 'Boolean', values: 'true | false' },
          { name: 'Label', type: 'Text', values: '"Copy" (optional)' },
        ]}
        autoLayout={[{ label: 'Copyable', direction: 'H', gap: '4px', padding: '0' }]}
        radius="6px (--primitive-radius-md)"
        tokens={[
          { label: 'Copy icon', value: 'IconCopy, 12px' },
          { label: 'Success icon', value: 'IconCheck, green, 2000ms duration' },
        ]}
        tips={[
          'CopyButton: 아이콘(또는 아이콘+텍스트) 클릭 시 클립보드에 복사. 성공 시 체크 아이콘으로 전환',
          'Copyable: 텍스트 + CopyButton 조합. ID, URL 등 복사 가능한 값 표시용',
          'truncate: 긴 텍스트를 말줄임 처리. maxWidth로 최대 너비 제한',
          'ghost: 배경 없음 (기본). outline: 테두리만. default: 배경+테두리',
          'successDuration: 체크 아이콘 표시 시간 (기본 2000ms)',
        ]}
      />

      {/* ════════════════ PASSWORD ════════════════ */}
      <SectionTitle>Password</SectionTitle>
      <div className="flex flex-col gap-4 max-w-sm">
        <FigmaFrame name="Password/default">
          <Password placeholder="Enter password" fullWidth />
        </FigmaFrame>
        <FigmaFrame name="Password/with-value">
          <Password defaultValue="mypassword123" fullWidth />
        </FigmaFrame>
        <FigmaFrame name="Password/disabled">
          <Password placeholder="Disabled" disabled fullWidth />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Form/Password"
        properties={[
          { name: 'Size', type: 'Variant', values: 'sm | md' },
          { name: 'State', type: 'Variant', values: 'default | focus | error | disabled' },
          { name: 'Visible', type: 'Boolean', values: 'true | false' },
          { name: 'ShowToggle', type: 'Boolean', values: 'true | false' },
        ]}
        autoLayout={[
          { label: 'SM', direction: 'H', gap: '—', padding: '0 10px', height: '28px' },
          { label: 'MD', direction: 'H', gap: '—', padding: '0 10px', height: '32px' },
        ]}
        radius="6px (--primitive-radius-md)"
        tokens={[
          { label: 'Toggle icon', value: 'IconEye / IconEyeOff, 14px' },
          { label: 'Font', value: 'password dots (type=password) 또는 일반 텍스트' },
        ]}
        tips={[
          'Input 기반 + 우측에 비밀번호 표시/숨김 토글 버튼',
          '토글 클릭: type=password ↔ type=text 전환. 아이콘도 Eye ↔ EyeOff 전환',
          'Figma에서 Toggle 버튼 영역을 Boolean으로 제어 (ShowToggle)',
          'State 처리는 Input과 동일 (focus ring, error border, disabled bg)',
        ]}
      />

      {/* ════════════════ SNB MENU ITEM ════════════════ */}
      <SectionTitle>SNBMenuItem</SectionTitle>
      <div className="flex gap-6 items-end">
        <FigmaFrame name="SNBMenuItem/icon/all-states">
          <div className="flex gap-2 bg-[var(--color-surface-subtle)] p-3 rounded-[var(--primitive-radius-lg)]">
            <SNBMenuItem type="icon" icon={<IconHome size={20} />} status="default" />
            <SNBMenuItem type="icon" icon={<IconServer size={20} />} status="hover" />
            <SNBMenuItem type="icon" icon={<IconBrandDocker size={20} />} status="selected" />
          </div>
        </FigmaFrame>
        <FigmaFrame name="SNBMenuItem/text/all-states">
          <div className="flex flex-col gap-1 bg-[var(--color-surface-subtle)] p-3 rounded-[var(--primitive-radius-lg)] w-[200px]">
            <SNBMenuItem type="text" text="Instances" status="default" />
            <SNBMenuItem type="text" text="Volumes" status="hover" />
            <SNBMenuItem type="text" text="Networks" status="selected" />
          </div>
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Navigation/SNBMenuItem"
        properties={[
          { name: 'Type', type: 'Variant', values: 'icon | text' },
          { name: 'Status', type: 'Variant', values: 'default | hover | selected' },
          { name: 'Icon', type: 'Instance swap', values: 'icon slot (type=icon)' },
          { name: 'Text', type: 'Text', values: '"Menu Item" (type=text)' },
        ]}
        autoLayout={[
          { label: 'Icon', direction: 'H', gap: '0', padding: '8px', height: '40px' },
          { label: 'Text', direction: 'H', gap: '8px', padding: '8px 12px', height: '36px' },
        ]}
        radius="6px (--primitive-radius-md)"
        tokens={[
          { label: 'Default bg', value: 'transparent' },
          { label: 'Hover bg', value: '--color-surface-hover' },
          { label: 'Selected bg', value: '--color-surface-hover' },
          { label: 'Selected icon', value: '--color-action-primary' },
          { label: 'Icon size', value: '20px (default), iconSize prop으로 변경 가능' },
        ]}
        tips={[
          '좁은 사이드바(icon sidebar)와 넓은 사이드바(text sidebar)에서 각각 사용',
          'Icon type: 40×40px 정사각형. 아이콘만 중앙 정렬',
          'Text type: 좌정렬 텍스트. 선택 시 font-weight medium + primary color',
          'ContainerSidebar에서 아이콘 사이드바(40px)에는 icon type, 메뉴(200px)에는 text type 사용',
          'Figma에서 Type + Status 조합으로 총 6개 Variant 생성',
        ]}
      />

      {/* ════════════════ SELECTION INDICATOR ════════════════ */}
      <SectionTitle>SelectionIndicator</SectionTitle>
      <div className="flex flex-col gap-4 max-w-lg">
        <FigmaFrame name="SelectionIndicator/empty">
          <SelectionIndicator />
        </FigmaFrame>
        <FigmaFrame name="SelectionIndicator/with-selection">
          <SelectionIndicator
            selectedItems={[
              { id: '1', label: 'default-sg' },
              { id: '2', label: 'web-server-sg' },
              { id: '3', label: 'database-sg' },
            ]}
            onRemove={() => {}}
          />
        </FigmaFrame>
        <FigmaFrame name="SelectionIndicator/error">
          <SelectionIndicator error errorMessage="Selection is required" />
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Data/SelectionIndicator"
        properties={[
          { name: 'HasItems', type: 'Boolean', values: 'true | false' },
          { name: 'Removable', type: 'Boolean', values: 'true | false' },
          { name: 'Error', type: 'Boolean', values: 'true | false' },
          { name: 'EmptyText', type: 'Text', values: '"No items selected"' },
        ]}
        autoLayout={[{ label: 'Container', direction: 'H', gap: '4px', padding: '8px 12px' }]}
        radius="6px (--primitive-radius-md)"
        tokens={[
          { label: 'BG', value: '--color-surface-subtle' },
          { label: 'Border', value: '--color-border-default, 1px' },
          { label: 'Error border', value: '--color-state-danger' },
          { label: 'Chip', value: 'Chip 컴포넌트 인스턴스 사용' },
        ]}
        tips={[
          '선택된 항목들을 Chip으로 표시. 항목 제거 가능 (Removable)',
          'Empty 상태: emptyText 표시 (연한 텍스트)',
          'Error 상태: border가 danger 색상, 하단에 에러 메시지 표시',
          'rightContent: 우측에 추가 콘텐츠(버튼 등) 배치 가능',
          'ListToolbar에서 벌크 액션과 함께 사용',
        ]}
      />

      {/* ════════════════ WINDOW CONTROL ════════════════ */}
      <SectionTitle>WindowControl</SectionTitle>
      <div className="flex flex-col gap-6">
        <SubTitle>Individual Controls</SubTitle>
        <div className="flex gap-6 items-end">
          <FigmaFrame name="WindowControl/minimize">
            <WindowControl type="minimize" />
          </FigmaFrame>
          <FigmaFrame name="WindowControl/maximize">
            <WindowControl type="maximize" />
          </FigmaFrame>
          <FigmaFrame name="WindowControl/close">
            <WindowControl type="close" />
          </FigmaFrame>
        </div>

        <SubTitle>Controls Group</SubTitle>
        <FigmaFrame name="WindowControls/group">
          <WindowControls />
        </FigmaFrame>

        <SubTitle>Title Bar Context</SubTitle>
        <FigmaFrame name="WindowControls/title-bar">
          <div className="flex items-center justify-between w-full max-w-[400px] h-10 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)]">
            <span className="text-body-md font-medium text-[var(--color-text-default)]">
              Application Title
            </span>
            <WindowControls />
          </div>
        </FigmaFrame>
      </div>

      <FigmaGuide
        figmaName="TDS/Navigation/WindowControl"
        properties={[{ name: 'Type', type: 'Variant', values: 'close | minimize | maximize' }]}
        autoLayout={[
          { label: 'Controls Group', direction: 'H', gap: '4px', padding: '0' },
          { label: 'Button', direction: 'H', gap: '0', padding: '0', height: '24px' },
        ]}
        radius="4px (--primitive-radius-sm)"
        tokens={[
          { label: 'Size', value: '24px × 24px' },
          { label: 'Icon', value: '12px' },
          { label: 'Gap', value: '4px' },
          { label: 'Hover bg', value: '--color-surface-hover' },
          { label: 'Close hover bg', value: '--color-state-danger' },
        ]}
        tips={[
          '데스크탑 UI 창 컨트롤 버튼 (Minimize, Maximize, Close)',
          '구조: 3개 버튼이 gap 4px 간격으로 그룹 배치. Title Bar 우측에 위치',
          'Hover 시 배경색 변경. Close 버튼은 빨간색 hover',
          'Maximize/Restore 토글: 창 상태에 따라 아이콘 전환',
          'Figma에서 24×24px 프레임. Type별 아이콘 + hover 상태 Variant',
        ]}
      />
    </div>
  );
}
