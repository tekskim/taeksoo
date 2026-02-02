import { useState } from 'react';
import {
  VStack,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  SectionCard,
  Button,
  Badge,
  Table,
  Input,
  Select,
  Checkbox,
  Toggle,
  Chip,
} from '@/design-system';
import { IconExternalLink, IconCheck, IconX, IconMinus, IconRefresh } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface TokenComparison {
  category: string;
  token: string;
  tdsValue: string;
  productionValue: string;
  status: 'match' | 'different' | 'tds-only' | 'production-only';
}

interface ComponentComparison {
  name: string;
  tdsStatus: 'available' | 'partial' | 'missing';
  productionStatus: 'available' | 'partial' | 'missing';
  notes: string;
}

interface GuidelineItem {
  category: string;
  guideline: string;
  tds: string;
  production: string;
  recommendation: string;
}

/* ----------------------------------------
   Data
   ---------------------------------------- */

const tokenComparisons: TokenComparison[] = [
  // Colors
  {
    category: 'Color',
    token: '--color-action-primary',
    tdsValue: '#2563EB',
    productionValue: '#2563EB',
    status: 'match',
  },
  {
    category: 'Color',
    token: '--color-state-success',
    tdsValue: '#16A34A',
    productionValue: '#22C55E',
    status: 'different',
  },
  {
    category: 'Color',
    token: '--color-state-danger',
    tdsValue: '#DC2626',
    productionValue: '#EF4444',
    status: 'different',
  },
  {
    category: 'Color',
    token: '--color-state-warning',
    tdsValue: '#D97706',
    productionValue: '#F59E0B',
    status: 'different',
  },
  {
    category: 'Color',
    token: '--color-surface-default',
    tdsValue: '#FFFFFF',
    productionValue: '#FFFFFF',
    status: 'match',
  },
  {
    category: 'Color',
    token: '--color-surface-subtle',
    tdsValue: '#F8FAFC',
    productionValue: '#F9FAFB',
    status: 'different',
  },
  {
    category: 'Color',
    token: '--color-text-default',
    tdsValue: '#0F172A',
    productionValue: '#111827',
    status: 'different',
  },
  {
    category: 'Color',
    token: '--color-text-muted',
    tdsValue: '#64748B',
    productionValue: '#6B7280',
    status: 'different',
  },
  {
    category: 'Color',
    token: '--color-border-default',
    tdsValue: '#E2E8F0',
    productionValue: '#E5E7EB',
    status: 'different',
  },
  // Spacing
  {
    category: 'Spacing',
    token: '--spacing-1',
    tdsValue: '0.25rem',
    productionValue: '4px',
    status: 'match',
  },
  {
    category: 'Spacing',
    token: '--spacing-2',
    tdsValue: '0.5rem',
    productionValue: '8px',
    status: 'match',
  },
  {
    category: 'Spacing',
    token: '--spacing-3',
    tdsValue: '0.75rem',
    productionValue: '12px',
    status: 'match',
  },
  {
    category: 'Spacing',
    token: '--spacing-4',
    tdsValue: '1rem',
    productionValue: '16px',
    status: 'match',
  },
  {
    category: 'Spacing',
    token: '--spacing-6',
    tdsValue: '1.5rem',
    productionValue: '24px',
    status: 'match',
  },
  // Typography
  {
    category: 'Typography',
    token: '--font-size-body-md',
    tdsValue: '0.75rem',
    productionValue: '12px',
    status: 'match',
  },
  {
    category: 'Typography',
    token: '--font-size-heading-h5',
    tdsValue: '1rem',
    productionValue: '16px',
    status: 'match',
  },
  {
    category: 'Typography',
    token: '--line-height-body-md',
    tdsValue: '1.125rem',
    productionValue: '18px',
    status: 'match',
  },
  // Radius
  {
    category: 'Radius',
    token: '--radius-sm',
    tdsValue: '0.25rem',
    productionValue: '4px',
    status: 'match',
  },
  {
    category: 'Radius',
    token: '--radius-md',
    tdsValue: '0.375rem',
    productionValue: '6px',
    status: 'match',
  },
  {
    category: 'Radius',
    token: '--radius-lg',
    tdsValue: '0.5rem',
    productionValue: '8px',
    status: 'match',
  },
];

const componentComparisons: ComponentComparison[] = [
  {
    name: 'Button',
    tdsStatus: 'available',
    productionStatus: 'available',
    notes: 'API 호환, variant 매핑 필요',
  },
  {
    name: 'Input',
    tdsStatus: 'available',
    productionStatus: 'available',
    notes: 'fullWidth prop 추가됨',
  },
  { name: 'Select', tdsStatus: 'available', productionStatus: 'available', notes: '동일한 API' },
  { name: 'Checkbox', tdsStatus: 'available', productionStatus: 'available', notes: '동일한 API' },
  { name: 'Toggle', tdsStatus: 'available', productionStatus: 'available', notes: '동일한 API' },
  {
    name: 'Table',
    tdsStatus: 'available',
    productionStatus: 'available',
    notes: 'selectable, sortable 지원',
  },
  { name: 'Modal', tdsStatus: 'available', productionStatus: 'available', notes: 'size prop 추가' },
  {
    name: 'Drawer',
    tdsStatus: 'available',
    productionStatus: 'available',
    notes: 'footer prop 추가',
  },
  {
    name: 'Tabs',
    tdsStatus: 'available',
    productionStatus: 'available',
    notes: 'variant: underline/boxed',
  },
  {
    name: 'Badge',
    tdsStatus: 'available',
    productionStatus: 'available',
    notes: 'theme prop 추가',
  },
  { name: 'Tooltip', tdsStatus: 'available', productionStatus: 'available', notes: '동일한 API' },
  {
    name: 'Accordion',
    tdsStatus: 'available',
    productionStatus: 'partial',
    notes: 'TDS에서 더 많은 variant 지원',
  },
  {
    name: 'DatePicker',
    tdsStatus: 'available',
    productionStatus: 'available',
    notes: 'mode: single/range',
  },
  {
    name: 'SectionCard',
    tdsStatus: 'available',
    productionStatus: 'missing',
    notes: 'TDS 전용 컴포넌트',
  },
  {
    name: 'DetailHeader',
    tdsStatus: 'available',
    productionStatus: 'missing',
    notes: 'TDS 전용 컴포넌트',
  },
  {
    name: 'ListToolbar',
    tdsStatus: 'available',
    productionStatus: 'missing',
    notes: 'TDS 전용 컴포넌트',
  },
  {
    name: 'FilterSearchInput',
    tdsStatus: 'available',
    productionStatus: 'missing',
    notes: 'TDS 전용 컴포넌트',
  },
];

const guidelines: GuidelineItem[] = [
  {
    category: 'Typography',
    guideline: '기본 본문 크기',
    tds: '12px (text-body-md)',
    production: '12px',
    recommendation: '일치 - 변경 불필요',
  },
  {
    category: 'Typography',
    guideline: '폰트 유닛',
    tds: 'rem (접근성 지원)',
    production: 'px (고정값)',
    recommendation: 'TDS의 rem 방식 권장',
  },
  {
    category: 'Color',
    guideline: 'Primary Action',
    tds: 'Blue-600 (#2563EB)',
    production: 'Blue-600 (#2563EB)',
    recommendation: '일치 - 변경 불필요',
  },
  {
    category: 'Color',
    guideline: 'Success State',
    tds: 'Green-600 (#16A34A)',
    production: 'Green-500 (#22C55E)',
    recommendation: 'TDS 값으로 통일 권장',
  },
  {
    category: 'Spacing',
    guideline: '카드 패딩',
    tds: '24px (spacing-6)',
    production: '24px',
    recommendation: '일치 - 변경 불필요',
  },
  {
    category: 'Layout',
    guideline: '테이블 행 높이',
    tds: '44px',
    production: '48px',
    recommendation: 'TDS 값으로 통일 고려',
  },
  {
    category: 'Component',
    guideline: '버튼 사이즈',
    tds: 'sm/md/lg',
    production: 'sm/md/lg',
    recommendation: '일치 - 변경 불필요',
  },
  {
    category: 'Component',
    guideline: '아이콘 라이브러리',
    tds: '@tabler/icons-react',
    production: '@phosphor-icons/react',
    recommendation: '점진적 통일 권장',
  },
];

/* ----------------------------------------
   Main Component
   ---------------------------------------- */

export function ProductionComparisonPage() {
  const [activeTab, setActiveTab] = useState('tokens');
  const [tokenFilter, setTokenFilter] = useState<string>('all');
  const [componentFilter, setComponentFilter] = useState<string>('all');

  // Scroll to top when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Token filter options
  const tokenCategories = ['all', ...new Set(tokenComparisons.map((t) => t.category))];
  const filteredTokens =
    tokenFilter === 'all'
      ? tokenComparisons
      : tokenComparisons.filter((t) => t.category === tokenFilter);

  // Component filter options
  const componentFilterOptions = [
    { value: 'all', label: '전체' },
    { value: 'match', label: '일치' },
    { value: 'different', label: '차이 있음' },
    { value: 'tds-only', label: 'TDS 전용' },
  ];

  const filteredComponents =
    componentFilter === 'all'
      ? componentComparisons
      : componentFilter === 'match'
        ? componentComparisons.filter(
            (c) => c.tdsStatus === 'available' && c.productionStatus === 'available'
          )
        : componentFilter === 'different'
          ? componentComparisons.filter((c) => c.productionStatus === 'partial')
          : componentComparisons.filter((c) => c.productionStatus === 'missing');

  // Stats
  const tokenStats = {
    total: tokenComparisons.length,
    match: tokenComparisons.filter((t) => t.status === 'match').length,
    different: tokenComparisons.filter((t) => t.status === 'different').length,
  };

  const componentStats = {
    total: componentComparisons.length,
    available: componentComparisons.filter(
      (c) => c.tdsStatus === 'available' && c.productionStatus === 'available'
    ).length,
    tdsOnly: componentComparisons.filter((c) => c.productionStatus === 'missing').length,
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'match':
      case 'available':
        return <IconCheck size={14} className="text-[var(--color-state-success)]" />;
      case 'different':
      case 'partial':
        return <IconMinus size={14} className="text-[var(--color-state-warning)]" />;
      case 'tds-only':
      case 'production-only':
      case 'missing':
        return <IconX size={14} className="text-[var(--color-state-danger)]" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full overflow-auto bg-[var(--color-surface-default)]">
      <div className="p-6">
        <VStack gap={6} className="max-w-7xl mx-auto pb-20">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-h3 text-[var(--color-text-default)]">프로덕션 비교</h1>
              <p className="text-body-md text-[var(--color-text-muted)] mt-1">
                TDS와 프로덕션(thaki-ui) 디자인 시스템 비교 분석
              </p>
            </div>
            <HStack gap={2}>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconRefresh size={14} />}
                onClick={() => window.location.reload()}
              >
                새로고침
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconExternalLink size={14} />}
                onClick={() => window.open('/visual-diff-output/report.html', '_blank')}
              >
                상세 리포트
              </Button>
            </HStack>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
              <p className="text-body-sm text-[var(--color-text-muted)]">토큰 일치율</p>
              <p className="text-heading-h4 text-[var(--color-text-default)] mt-1">
                {Math.round((tokenStats.match / tokenStats.total) * 100)}%
              </p>
              <p className="text-body-sm text-[var(--color-text-subtle)] mt-1">
                {tokenStats.match}/{tokenStats.total} 일치
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
              <p className="text-body-sm text-[var(--color-text-muted)]">컴포넌트 호환성</p>
              <p className="text-heading-h4 text-[var(--color-text-default)] mt-1">
                {Math.round((componentStats.available / componentStats.total) * 100)}%
              </p>
              <p className="text-body-sm text-[var(--color-text-subtle)] mt-1">
                {componentStats.available}/{componentStats.total} 호환
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
              <p className="text-body-sm text-[var(--color-text-muted)]">TDS 전용 컴포넌트</p>
              <p className="text-heading-h4 text-[var(--color-action-primary)] mt-1">
                {componentStats.tdsOnly}
              </p>
              <p className="text-body-sm text-[var(--color-text-subtle)] mt-1">
                새로 추가된 컴포넌트
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
              <p className="text-body-sm text-[var(--color-text-muted)]">마이그레이션 준비</p>
              <p className="text-heading-h4 text-[var(--color-state-success)] mt-1">Ready</p>
              <p className="text-body-sm text-[var(--color-text-subtle)] mt-1">바로 적용 가능</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="md">
            <TabList>
              <Tab value="tokens">토큰 비교</Tab>
              <Tab value="components">컴포넌트 비교</Tab>
              <Tab value="guidelines">가이드라인</Tab>
              <Tab value="live">라이브 비교</Tab>
            </TabList>

            {/* Tokens Tab */}
            <TabPanel value="tokens" className="pt-6">
              <VStack gap={4}>
                <HStack gap={4} className="items-center">
                  <Select
                    options={tokenCategories.map((c) => ({
                      value: c,
                      label: c === 'all' ? '전체 카테고리' : c,
                    }))}
                    value={tokenFilter}
                    onChange={(v) => setTokenFilter(v)}
                    className="w-48"
                  />
                  <div className="flex gap-2">
                    <Chip
                      value={`일치 ${tokenStats.match}`}
                      icon={<IconCheck size={12} />}
                      variant="default"
                    />
                    <Chip
                      value={`차이 ${tokenStats.different}`}
                      icon={<IconMinus size={12} />}
                      variant="default"
                    />
                  </div>
                </HStack>

                <Table
                  columns={[
                    { key: 'category', label: '카테고리', width: '100px' },
                    { key: 'token', label: '토큰', width: '200px' },
                    {
                      key: 'tdsValue',
                      label: 'TDS 값',
                      width: '150px',
                      render: (_value, row) => (
                        <code className="text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded">
                          {row.tdsValue}
                        </code>
                      ),
                    },
                    {
                      key: 'productionValue',
                      label: 'Production 값',
                      width: '150px',
                      render: (_value, row) => (
                        <code className="text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded">
                          {row.productionValue}
                        </code>
                      ),
                    },
                    {
                      key: 'status',
                      label: '상태',
                      width: '80px',
                      render: (_value, row) => (
                        <span className="flex items-center gap-1">
                          <StatusIcon status={row.status} />
                          <span className="text-body-sm">
                            {row.status === 'match' ? '일치' : '차이'}
                          </span>
                        </span>
                      ),
                    },
                  ]}
                  data={filteredTokens}
                  rowKey="token"
                />
              </VStack>
            </TabPanel>

            {/* Components Tab */}
            <TabPanel value="components" className="pt-6">
              <VStack gap={4}>
                <HStack gap={4} className="items-center">
                  <Select
                    options={componentFilterOptions}
                    value={componentFilter}
                    onChange={(v) => setComponentFilter(v)}
                    className="w-48"
                  />
                </HStack>

                <Table
                  columns={[
                    { key: 'name', label: '컴포넌트', width: '150px' },
                    {
                      key: 'tdsStatus',
                      label: 'TDS',
                      width: '100px',
                      render: (_value, row) => (
                        <span className="flex items-center gap-1">
                          <StatusIcon status={row.tdsStatus} />
                          <span className="text-body-sm">
                            {row.tdsStatus === 'available' ? '지원' : '일부'}
                          </span>
                        </span>
                      ),
                    },
                    {
                      key: 'productionStatus',
                      label: 'Production',
                      width: '100px',
                      render: (_value, row) => (
                        <span className="flex items-center gap-1">
                          <StatusIcon status={row.productionStatus} />
                          <span className="text-body-sm">
                            {row.productionStatus === 'available'
                              ? '지원'
                              : row.productionStatus === 'partial'
                                ? '일부'
                                : '없음'}
                          </span>
                        </span>
                      ),
                    },
                    { key: 'notes', label: '비고', width: '300px' },
                  ]}
                  data={filteredComponents}
                  rowKey="name"
                />
              </VStack>
            </TabPanel>

            {/* Guidelines Tab */}
            <TabPanel value="guidelines" className="pt-6">
              <VStack gap={4}>
                <p className="text-body-md text-[var(--color-text-muted)]">
                  디자인 가이드라인 비교 및 권장 사항입니다.
                </p>

                <Table
                  columns={[
                    { key: 'category', label: '카테고리', width: '100px' },
                    { key: 'guideline', label: '가이드라인', width: '150px' },
                    { key: 'tds', label: 'TDS', width: '150px' },
                    { key: 'production', label: 'Production', width: '150px' },
                    {
                      key: 'recommendation',
                      label: '권장 사항',
                      width: '200px',
                      render: (_value, row) => (
                        <span
                          className={
                            row.recommendation.includes('일치')
                              ? 'text-[var(--color-state-success)]'
                              : 'text-[var(--color-state-warning)]'
                          }
                        >
                          {row.recommendation}
                        </span>
                      ),
                    },
                  ]}
                  data={guidelines}
                  rowKey="guideline"
                />
              </VStack>
            </TabPanel>

            {/* Live Comparison Tab */}
            <TabPanel value="live" className="pt-6">
              <VStack gap={6}>
                <div className="flex items-center justify-between">
                  <p className="text-body-md text-[var(--color-text-muted)]">
                    TDS 컴포넌트와 프로덕션(thaki-ui) 스토리북을 나란히 비교합니다.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<IconExternalLink size={14} />}
                    onClick={() => window.open('http://localhost:6006', '_blank')}
                  >
                    스토리북 열기
                  </Button>
                </div>

                {/* Side by Side Comparison */}
                <div className="grid grid-cols-2 gap-6">
                  {/* TDS Side */}
                  <div className="border border-[var(--color-border-default)] rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
                      <span className="text-label-md text-[var(--color-text-default)]">
                        TDS (현재 프로젝트)
                      </span>
                    </div>
                    <div className="p-6">
                      <VStack gap={6}>
                        {/* Button */}
                        <div>
                          <p className="text-label-sm text-[var(--color-text-subtle)] mb-3">
                            Button
                          </p>
                          <HStack gap={2}>
                            <Button variant="primary" size="sm">
                              Primary
                            </Button>
                            <Button variant="secondary" size="sm">
                              Secondary
                            </Button>
                            <Button variant="muted" size="sm">
                              Muted
                            </Button>
                            <Button variant="danger" size="sm">
                              Danger
                            </Button>
                          </HStack>
                        </div>
                        {/* Input */}
                        <div>
                          <p className="text-label-sm text-[var(--color-text-subtle)] mb-3">
                            Input
                          </p>
                          <Input placeholder="Default input" className="max-w-xs" />
                        </div>
                        {/* Checkbox & Toggle */}
                        <div>
                          <p className="text-label-sm text-[var(--color-text-subtle)] mb-3">
                            Form Controls
                          </p>
                          <HStack gap={4}>
                            <Checkbox label="Checkbox" />
                            <Toggle />
                          </HStack>
                        </div>
                        {/* Badge */}
                        <div>
                          <p className="text-label-sm text-[var(--color-text-subtle)] mb-3">
                            Badge
                          </p>
                          <HStack gap={2}>
                            <Badge theme="blue">Blue</Badge>
                            <Badge theme="green">Green</Badge>
                            <Badge theme="red">Red</Badge>
                          </HStack>
                        </div>
                      </VStack>
                    </div>
                  </div>

                  {/* Production Side - iframe */}
                  <div className="border border-[var(--color-border-default)] rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
                      <span className="text-label-md text-[var(--color-text-default)]">
                        Production (thaki-ui Storybook)
                      </span>
                    </div>
                    <iframe
                      src="http://localhost:6006/iframe.html?viewMode=docs&id=components-button--docs"
                      className="w-full h-[500px] border-0"
                      title="thaki-ui Storybook"
                    />
                  </div>
                </div>

                {/* Component Quick Links */}
                <SectionCard>
                  <SectionCard.Header title="컴포넌트별 비교" />
                  <SectionCard.Content>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'Button', path: 'components-button--docs' },
                        { name: 'Input', path: 'components-input--docs' },
                        { name: 'Checkbox', path: 'components-checkbox--docs' },
                        { name: 'Toggle', path: 'components-toggle--docs' },
                        { name: 'Select', path: 'components-select--docs' },
                        { name: 'Badge', path: 'components-badge--docs' },
                        { name: 'Modal', path: 'components-modal--docs' },
                        { name: 'Table', path: 'components-table--docs' },
                      ].map((comp) => (
                        <button
                          key={comp.name}
                          onClick={() =>
                            window.open(`http://localhost:6006/?path=/docs/${comp.path}`, '_blank')
                          }
                          className="px-4 py-3 text-left rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-action-primary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
                        >
                          <span className="text-label-md text-[var(--color-text-default)]">
                            {comp.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>
          </Tabs>
        </VStack>
      </div>
    </div>
  );
}

export default ProductionComparisonPage;
