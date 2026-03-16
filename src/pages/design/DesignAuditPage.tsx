import { useState, useMemo, useCallback } from 'react';
import {
  VStack,
  HStack,
  Checkbox,
  ProgressBar,
  Badge,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@/design-system';
import { DocSection } from './_shared/DocSection';
import { IconTrash, IconFilter, IconCircleCheck } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface AuditItem {
  id: string;
  label: string;
  description?: string;
}

interface AuditSubGroup {
  id: string;
  title: string;
  items: AuditItem[];
}

interface AuditCategory {
  id: string;
  title: string;
  description: string;
  items?: AuditItem[];
  subGroups?: AuditSubGroup[];
}

type FilterMode = 'all' | 'pending' | 'done';

/* ----------------------------------------
   Audit Data
   ---------------------------------------- */

const COMPONENT_NAMES = [
  'Button',
  'Input',
  'TextInput',
  'NumberInput',
  'Textarea',
  'SearchInput',
  'FilterSearchInput',
  'Select',
  'DatePicker',
  'Slider',
  'Toggle',
  'Checkbox',
  'Radio',
  'FormField',
  'Table',
  'Pagination',
  'StatusIndicator',
  'SelectionIndicator',
  'Badge',
  'Chip',
  'Card',
  'FileListCard',
  'ExpandableChecklist',
  'InlineMessage',
  'Loading',
  'ProgressBar',
  'Skeleton',
  'Spinner',
  'Toast',
  'Snackbar',
  'NotificationCenter',
  'GlobalNotificationPanel',
  'TopBar',
  'TabBar',
  'Tabs',
  'Breadcrumb',
  'Menu',
  'Tooltip',
  'Popover',
  'ContextMenu',
  'Modal',
  'Drawer',
  'FloatingCard',
  'Disclosure',
  'WindowControl',
  'Scrollbar',
  'DetailHeader',
  'SectionCard',
  'MonitoringToolbar',
  'CsvDownload',
  'AppWindow',
  'Editor',
];

const COMPONENT_CHECK_ITEMS = [
  { suffix: 'doc', label: '문서 페이지 존재' },
  { suffix: 'usage', label: 'Usage Guidelines 작성' },
  { suffix: 'api', label: 'API Reference 작성' },
  { suffix: 'a11y', label: 'Accessibility 섹션 작성' },
  { suffix: 'story', label: 'Storybook 스토리 동기화' },
];

function buildComponentSubGroups(): AuditSubGroup[] {
  return COMPONENT_NAMES.map((name) => ({
    id: `comp-${name.toLowerCase()}`,
    title: name,
    items: COMPONENT_CHECK_ITEMS.map((check) => ({
      id: `comp-${name.toLowerCase()}-${check.suffix}`,
      label: check.label,
    })),
  }));
}

const auditCategories: AuditCategory[] = [
  {
    id: 'components',
    title: 'Component Documentation',
    description: `${COMPONENT_NAMES.length}개 컴포넌트의 문서 완성도를 점검한다.`,
    subGroups: buildComponentSubGroups(),
  },
  {
    id: 'foundation',
    title: 'Foundation',
    description: '디자인 토큰, 타이포그래피, 접근성 등 기초 문서를 점검한다.',
    items: [
      { id: 'fnd-token', label: '토큰 아키텍처 문서화' },
      { id: 'fnd-primitive', label: 'Primitive 색상 토큰 정의 완료' },
      { id: 'fnd-semantic', label: 'Semantic 색상 토큰 정의 완료' },
      { id: 'fnd-typo', label: '타이포그래피 유틸리티 클래스 정의' },
      { id: 'fnd-spacing', label: '스페이싱 & 반경 토큰 정의' },
      { id: 'fnd-border', label: '보더 토큰 정의' },
      { id: 'fnd-shadow', label: '쉐도우 토큰 정의' },
      { id: 'fnd-transition', label: '트랜지션 토큰 정의' },
      { id: 'fnd-icons', label: '아이콘 가이드라인 작성' },
      { id: 'fnd-app-icons', label: '앱 아이콘 가이드라인 작성' },
      { id: 'fnd-ux-writing', label: 'UX Writing 가이드 완성' },
      { id: 'fnd-a11y', label: '접근성 가이드 완성' },
      { id: 'fnd-theming', label: '테마 가이드 완성' },
      { id: 'fnd-contributing', label: 'Contributing 가이드 완성' },
      { id: 'fnd-error-alert', label: 'Error & Alert 가이드 작성' },
      { id: 'fnd-system-error', label: 'System Error 가이드 작성' },
    ],
  },
  {
    id: 'patterns',
    title: 'Patterns',
    description: '페이지 패턴과 폼 패턴 문서를 점검한다.',
    items: [
      { id: 'pat-common', label: 'Common Patterns 문서화' },
      { id: 'pat-wizard', label: 'Wizard (Create Flow) 문서화' },
      { id: 'pat-open-form', label: 'Create Page (Multi tab) 문서화' },
      { id: 'pat-list', label: 'List Page 패턴 문서화' },
      { id: 'pat-detail', label: 'Detail Page 패턴 문서화' },
      { id: 'pat-list-selector', label: 'List Selector 패턴 문서화' },
      { id: 'pat-view-pref', label: 'View Preferences 패턴 문서화' },
      { id: 'pat-shell', label: 'Shell 패턴 문서화' },
      { id: 'pat-empty', label: 'Empty States 패턴 문서화' },
      { id: 'pat-layout', label: 'Layout 패턴 문서화' },
      { id: 'pat-desktop-grid', label: 'Desktop Icon Grid 패턴 문서화' },
      { id: 'pat-dynamic-form', label: 'Dynamic Form Fields 패턴 문서화' },
      { id: 'pat-form-validation', label: 'Form Validation 패턴 문서화' },
      { id: 'pat-form-field', label: 'Form Field 패턴 문서화' },
    ],
  },
  {
    id: 'charts',
    title: 'Charts / Graphs',
    description: '차트 컴포넌트 문서를 점검한다.',
    items: [
      { id: 'chart-overview', label: 'Chart Overview 문서화' },
      { id: 'chart-status', label: 'Status Colors 문서화' },
      { id: 'chart-usage', label: 'Usage Chart 문서화' },
      { id: 'chart-line', label: 'Line Chart 문서화' },
      { id: 'chart-pie', label: 'Pie Chart 문서화' },
      { id: 'chart-tooltip', label: 'Chart Tooltip 문서화' },
    ],
  },
  {
    id: 'code-quality',
    title: 'Code Quality',
    description: 'Deprecated 패턴 제거 및 코드 품질 점검 항목이다.',
    items: [
      { id: 'cq-input-label', label: 'Deprecated Input label 패턴 제거' },
      { id: 'cq-close-btn', label: 'Deprecated Close 버튼 참조 제거' },
      { id: 'cq-hardcode-color', label: '하드코딩 색상 제거 (hex, Tailwind 색상 클래스)' },
      { id: 'cq-hardcode-font', label: '하드코딩 폰트 사이즈 제거' },
      { id: 'cq-hardcode-radius', label: '하드코딩 Border Radius 제거' },
      { id: 'cq-fallback-color', label: 'CSS 변수 fallback 색상 제거' },
      { id: 'cq-chart-local', label: '차트 색상 로컬 재정의 제거' },
      { id: 'cq-custom-empty', label: '커스텀 EmptyState 인라인 정의 제거' },
      { id: 'cq-manual-layout', label: '수동 레이아웃(fixed inset-0) 제거 → PageShell' },
      { id: 'cq-inline-header', label: '인라인 헤더 제거 → PageHeader' },
    ],
  },
  {
    id: 'storybook',
    title: 'Storybook',
    description: 'Storybook 스토리 관리 상태를 점검한다.',
    items: [
      { id: 'sb-all-stories', label: '모든 컴포넌트에 스토리 파일 존재' },
      { id: 'sb-argtypes', label: 'argTypes 문서화 완료' },
      { id: 'sb-deprecated', label: 'Deprecated prop에 @deprecated 표시' },
      { id: 'sb-docs-sync', label: '스토리 JSDoc과 컴포넌트 문서 페이지 동기화' },
      { id: 'sb-variant-coverage', label: '모든 variant에 대한 스토리 존재' },
      { id: 'sb-a11y-addon', label: 'Accessibility addon 설정 확인' },
    ],
  },
  {
    id: 'figma',
    title: 'Figma Migration',
    description: 'Figma 연동 및 마이그레이션 문서를 점검한다.',
    items: [
      { id: 'fig-guide', label: 'Migration Guide 문서화' },
      { id: 'fig-foundation', label: 'Foundation Capture 완료' },
      { id: 'fig-components', label: 'Components Capture 완료' },
    ],
  },
];

/* ----------------------------------------
   useAuditChecklist Hook
   ---------------------------------------- */

const STORAGE_KEY = 'tds-audit-checklist';

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveChecked(checked: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
}

function useAuditChecklist() {
  const [checked, setChecked] = useState<Set<string>>(loadChecked);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveChecked(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setChecked(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const bulkCheck = useCallback((ids: string[]) => {
    setChecked((prev) => {
      const next = new Set([...prev, ...ids]);
      saveChecked(next);
      return next;
    });
  }, []);

  const allItemIds = useMemo(() => {
    const ids: string[] = [];
    for (const cat of auditCategories) {
      if (cat.items) ids.push(...cat.items.map((i) => i.id));
      if (cat.subGroups) {
        for (const sg of cat.subGroups) {
          ids.push(...sg.items.map((i) => i.id));
        }
      }
    }
    return ids;
  }, []);

  const totalCount = allItemIds.length;
  const doneCount = allItemIds.filter((id) => checked.has(id)).length;

  const getCategoryStats = useCallback(
    (cat: AuditCategory) => {
      const ids: string[] = [];
      if (cat.items) ids.push(...cat.items.map((i) => i.id));
      if (cat.subGroups) {
        for (const sg of cat.subGroups) {
          ids.push(...sg.items.map((i) => i.id));
        }
      }
      const total = ids.length;
      const done = ids.filter((id) => checked.has(id)).length;
      return { total, done };
    },
    [checked]
  );

  return { checked, toggle, reset, bulkCheck, totalCount, doneCount, getCategoryStats };
}

/* ----------------------------------------
   Verified Audit Results (2026-03-11)
   ---------------------------------------- */

function buildVerifiedIds(): string[] {
  const ids: string[] = [];

  // Foundation: ALL 16 pages exist with substantial content
  const fndAll = [
    'fnd-token',
    'fnd-primitive',
    'fnd-semantic',
    'fnd-typo',
    'fnd-spacing',
    'fnd-border',
    'fnd-shadow',
    'fnd-transition',
    'fnd-icons',
    'fnd-app-icons',
    'fnd-ux-writing',
    'fnd-a11y',
    'fnd-theming',
    'fnd-contributing',
    'fnd-error-alert',
    'fnd-system-error',
  ];
  ids.push(...fndAll);

  // Patterns: ALL 14 pages exist with substantial content
  const patAll = [
    'pat-common',
    'pat-wizard',
    'pat-open-form',
    'pat-list',
    'pat-detail',
    'pat-list-selector',
    'pat-view-pref',
    'pat-shell',
    'pat-empty',
    'pat-layout',
    'pat-desktop-grid',
    'pat-dynamic-form',
    'pat-form-validation',
    'pat-form-field',
  ];
  ids.push(...patAll);

  // Charts: ALL 6 pages exist with substantial content
  const chartAll = [
    'chart-overview',
    'chart-status',
    'chart-usage',
    'chart-line',
    'chart-pie',
    'chart-tooltip',
  ];
  ids.push(...chartAll);

  // Code Quality: only CSS variable fallback is clean (0 instances)
  ids.push('cq-fallback-color');

  // Figma: ALL 3 pages exist with substantial content
  ids.push('fig-guide', 'fig-foundation', 'fig-components');

  // Component Documentation: ALL 52 have doc pages and usage guidelines
  const allNames = COMPONENT_NAMES.map((n) => n.toLowerCase());
  for (const name of allNames) {
    ids.push(`comp-${name}-doc`);
    ids.push(`comp-${name}-usage`);
  }

  // API Reference verified for 33 components
  const apiYes = [
    'button',
    'input',
    'filtersearchinput',
    'select',
    'datepicker',
    'slider',
    'toggle',
    'checkbox',
    'radio',
    'formfield',
    'table',
    'pagination',
    'statusindicator',
    'selectionindicator',
    'badge',
    'chip',
    'filelistcard',
    'inlinemessage',
    'loading',
    'topbar',
    'tabbar',
    'tabs',
    'breadcrumb',
    'tooltip',
    'popover',
    'contextmenu',
    'modal',
    'drawer',
    'floatingcard',
    'disclosure',
    'detailheader',
    'sectioncard',
    'monitoringtoolbar',
  ];
  for (const name of apiYes) ids.push(`comp-${name}-api`);

  // Accessibility verified for 33 components
  const a11yYes = [
    'button',
    'input',
    'filtersearchinput',
    'select',
    'datepicker',
    'slider',
    'toggle',
    'checkbox',
    'radio',
    'formfield',
    'table',
    'pagination',
    'statusindicator',
    'selectionindicator',
    'badge',
    'chip',
    'filelistcard',
    'inlinemessage',
    'loading',
    'progressbar',
    'skeleton',
    'toast',
    'snackbar',
    'topbar',
    'tabbar',
    'tabs',
    'breadcrumb',
    'menu',
    'tooltip',
    'contextmenu',
    'modal',
    'drawer',
    'disclosure',
  ];
  for (const name of a11yYes) ids.push(`comp-${name}-a11y`);

  // Storybook stories verified for 43 components
  const storyYes = [
    'button',
    'input',
    'textinput',
    'numberinput',
    'textarea',
    'searchinput',
    'filtersearchinput',
    'select',
    'datepicker',
    'slider',
    'toggle',
    'checkbox',
    'radio',
    'formfield',
    'table',
    'pagination',
    'statusindicator',
    'selectionindicator',
    'badge',
    'chip',
    'filelistcard',
    'inlinemessage',
    'loading',
    'progressbar',
    'skeleton',
    'spinner',
    'toast',
    'notificationcenter',
    'topbar',
    'tabbar',
    'tabs',
    'breadcrumb',
    'menu',
    'tooltip',
    'popover',
    'contextmenu',
    'modal',
    'drawer',
    'floatingcard',
    'disclosure',
    'windowcontrol',
    'detailheader',
    'sectioncard',
    'monitoringtoolbar',
  ];
  for (const name of storyYes) ids.push(`comp-${name}-story`);

  return ids;
}

const VERIFIED_IDS = buildVerifiedIds();

/* ----------------------------------------
   Sub-components
   ---------------------------------------- */

function CategorySummaryCard({
  category,
  stats,
}: {
  category: AuditCategory;
  stats: { total: number; done: number };
}) {
  const percent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const theme = percent === 100 ? 'green' : percent >= 50 ? 'yellow' : 'white';

  return (
    <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-label-md text-[var(--color-text-default)]">{category.title}</span>
        <Badge size="sm" type="subtle" theme={theme}>
          {stats.done}/{stats.total}
        </Badge>
      </div>
      <ProgressBar variant="quota" value={stats.done} max={stats.total} showValue={false} />
    </div>
  );
}

function ChecklistItem({
  item,
  isChecked,
  onToggle,
}: {
  item: AuditItem;
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`flex items-start gap-2 py-1.5 ${isChecked ? 'opacity-60' : ''}`}>
      <Checkbox checked={isChecked} onChange={onToggle} />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={`text-body-md ${isChecked ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-default)]'}`}
        >
          {item.label}
        </span>
        {item.description && (
          <span className="text-body-sm text-[var(--color-text-subtle)]">{item.description}</span>
        )}
      </div>
    </div>
  );
}

function filterItems(items: AuditItem[], checked: Set<string>, filter: FilterMode): AuditItem[] {
  if (filter === 'all') return items;
  if (filter === 'done') return items.filter((i) => checked.has(i.id));
  return items.filter((i) => !checked.has(i.id));
}

function CategorySection({
  category,
  checked,
  onToggle,
  filter,
}: {
  category: AuditCategory;
  checked: Set<string>;
  onToggle: (id: string) => void;
  filter: FilterMode;
}) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  if (category.subGroups) {
    const visibleGroups = category.subGroups.filter((sg) => {
      const filtered = filterItems(sg.items, checked, filter);
      return filtered.length > 0;
    });

    if (visibleGroups.length === 0) return null;

    return (
      <DocSection id={category.id} title={category.title} description={category.description}>
        <VStack gap={2} align="stretch">
          {visibleGroups.map((sg) => {
            const filtered = filterItems(sg.items, checked, filter);
            const sgDone = sg.items.filter((i) => checked.has(i.id)).length;
            const sgTotal = sg.items.length;
            const isExpanded = expandedGroups.has(sg.id);
            const allDone = sgDone === sgTotal;

            return (
              <div
                key={sg.id}
                className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden"
              >
                <button
                  onClick={() => toggleGroup(sg.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer ${allDone ? 'bg-[var(--color-state-success-bg)]' : 'bg-[var(--color-surface-subtle)]'}`}
                >
                  <HStack gap={2} align="center">
                    <span
                      className={`text-label-md ${allDone ? 'text-[var(--color-state-success)] line-through' : 'text-[var(--color-text-default)]'}`}
                    >
                      {sg.title}
                    </span>
                  </HStack>
                  <Badge
                    size="sm"
                    type="subtle"
                    theme={allDone ? 'green' : sgDone > 0 ? 'yellow' : 'white'}
                  >
                    {sgDone}/{sgTotal}
                  </Badge>
                </button>
                {isExpanded && (
                  <div className="px-4 py-2 border-t border-[var(--color-border-subtle)]">
                    <VStack gap={0} align="stretch">
                      {filtered.map((item) => (
                        <ChecklistItem
                          key={item.id}
                          item={item}
                          isChecked={checked.has(item.id)}
                          onToggle={() => onToggle(item.id)}
                        />
                      ))}
                    </VStack>
                  </div>
                )}
              </div>
            );
          })}
        </VStack>
      </DocSection>
    );
  }

  const filtered = filterItems(category.items ?? [], checked, filter);
  if (filtered.length === 0) return null;

  return (
    <DocSection id={category.id} title={category.title} description={category.description}>
      <VStack gap={0} align="stretch">
        {filtered.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            isChecked={checked.has(item.id)}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </VStack>
    </DocSection>
  );
}

/* ----------------------------------------
   Main Page
   ---------------------------------------- */

export function DesignAuditPage() {
  const { checked, toggle, reset, bulkCheck, totalCount, doneCount, getCategoryStats } =
    useAuditChecklist();
  const [filter, setFilter] = useState<FilterMode>('all');

  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <VStack gap={8} align="stretch">
      {/* Header */}
      <VStack gap={2} align="start">
        <h2 className="text-heading-h3 text-[var(--color-text-default)]">Design System Audit</h2>
        <p className="text-body-lg text-[var(--color-text-muted)]">
          디자인 시스템 전반의 완성도를 점검하는 체크리스트. 항목을 체크하면 브라우저에 자동
          저장된다.
        </p>
      </VStack>

      {/* Overall Progress */}
      <div className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
        <div className="flex items-center justify-between mb-3">
          <HStack gap={2} align="center">
            <span className="text-heading-h5 text-[var(--color-text-default)]">전체 진행률</span>
            <Badge
              size="md"
              type="subtle"
              theme={percent === 100 ? 'green' : percent >= 50 ? 'yellow' : 'white'}
            >
              {percent}%
            </Badge>
          </HStack>
          <span className="text-body-md text-[var(--color-text-muted)]">
            {doneCount} / {totalCount} 완료
          </span>
        </div>
        <ProgressBar variant="quota" value={doneCount} max={totalCount} showValue={false} />
      </div>

      {/* Category Summary Grid */}
      <div className="grid grid-cols-4 gap-3">
        {auditCategories.map((cat) => (
          <CategorySummaryCard key={cat.id} category={cat} stats={getCategoryStats(cat)} />
        ))}
      </div>

      {/* Filter & Actions */}
      <HStack gap={2} align="center" justify="between">
        <Tabs
          value={filter}
          onChange={(v) => setFilter(v as FilterMode)}
          variant="underline"
          size="sm"
        >
          <TabList>
            <Tab value="all">
              <HStack gap={1.5} align="center">
                <span>전체</span>
                <Badge size="sm" type="subtle" theme="white">
                  {totalCount}
                </Badge>
              </HStack>
            </Tab>
            <Tab value="pending">
              <HStack gap={1.5} align="center">
                <IconFilter size={12} />
                <span>미완료</span>
                <Badge size="sm" type="subtle" theme="yellow">
                  {totalCount - doneCount}
                </Badge>
              </HStack>
            </Tab>
            <Tab value="done">
              <HStack gap={1.5} align="center">
                <span>완료</span>
                <Badge size="sm" type="subtle" theme="green">
                  {doneCount}
                </Badge>
              </HStack>
            </Tab>
          </TabList>
          <TabPanel value="all">
            <span />
          </TabPanel>
          <TabPanel value="pending">
            <span />
          </TabPanel>
          <TabPanel value="done">
            <span />
          </TabPanel>
        </Tabs>
        <HStack gap={2}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<IconCircleCheck size={12} />}
            onClick={() => bulkCheck(VERIFIED_IDS)}
          >
            감사 결과 적용
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<IconTrash size={12} />}
            onClick={() => {
              if (window.confirm('체크 상태를 모두 초기화하시겠습니까?')) reset();
            }}
          >
            초기화
          </Button>
        </HStack>
      </HStack>

      {/* Category Sections */}
      {auditCategories.map((cat) => (
        <CategorySection
          key={cat.id}
          category={cat}
          checked={checked}
          onToggle={toggle}
          filter={filter}
        />
      ))}
    </VStack>
  );
}

export default DesignAuditPage;
