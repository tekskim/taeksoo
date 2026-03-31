import { useState, useMemo } from 'react';
import { VStack, HStack, Badge, SearchInput, Tabs, TabList, Tab, TabPanel } from '@/design-system';
import { DocSection } from './_shared/DocSection';
import {
  IconArrowRight,
  IconExternalLink,
  IconAlertTriangle,
  IconCircleCheck,
  IconReplace,
} from '@tabler/icons-react';

type MigrationStatus = 'migrated' | 'partial' | 'not-migrated' | 'no-equivalent';

interface SharedComponent {
  name: string;
  path: string;
  description: string;
  tdsEquivalent?: string;
  status: MigrationStatus;
  notes?: string;
  category: string;
}

const COMPONENTS: SharedComponent[] = [
  // Form Controls
  {
    name: 'Button',
    path: 'Button.tsx',
    description: 'CVA 기반 버튼. variant × appearance × size 조합 지원.',
    tdsEquivalent: 'Button',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'Input',
    path: 'Input/Input.tsx',
    description: '텍스트 입력. error/success, 사이즈, 패스워드 토글 지원.',
    tdsEquivalent: 'Input',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'FormInput',
    path: 'Input/FormInput.tsx',
    description: 'react-hook-form Controller 통합 Input.',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: 'TDS는 react-hook-form 미사용. 커스텀 상태 관리 검증 패턴 사용.',
    category: 'Form Controls',
  },
  {
    name: 'Textarea',
    path: 'Textarea/Textarea.tsx',
    description: '여러 줄 텍스트 입력. autoResize, charCount 지원.',
    tdsEquivalent: 'Textarea',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'Checkbox',
    path: 'Checkbox.tsx',
    description: '체크박스. controlled/uncontrolled 지원.',
    tdsEquivalent: 'Checkbox',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'RadioButton',
    path: 'RadioButton/RadioButton.tsx',
    description: '단일 라디오 버튼.',
    tdsEquivalent: 'Radio',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'RadioGroup',
    path: 'RadioGroup/RadioGroup.tsx',
    description: '라디오 버튼 그룹. legend, required, error 지원.',
    tdsEquivalent: 'RadioGroup',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'Toggle',
    path: 'Toggle/Toggle.tsx',
    description: 'On/Off 스위치.',
    tdsEquivalent: 'Toggle',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'Dropdown (Select/ComboBox)',
    path: 'Dropdown.tsx',
    description: '드롭다운 Select 및 ComboBox. Option 서브 컴포넌트.',
    tdsEquivalent: 'Select',
    status: 'migrated',
    notes: 'ComboBox(검색형)는 TDS에서 별도 구현 예정.',
    category: 'Form Controls',
  },
  {
    name: 'DatePicker',
    path: 'DatePicker.tsx',
    description: '캘린더 기반 날짜/기간 선택.',
    tdsEquivalent: 'DatePicker',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'Range',
    path: 'Range/Range.tsx',
    description: '슬라이더. single/dual(range) 선택.',
    tdsEquivalent: 'Slider / RangeSlider',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'Password',
    path: 'Password/Password.tsx',
    description: '패스워드 입력 (PasswordInput 재수출).',
    tdsEquivalent: 'Password',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'FilterSearchInput',
    path: 'FilterSearchInput.tsx',
    description: '필터 키 선택 + 값 입력 검색.',
    tdsEquivalent: 'FilterSearchInput',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'TagInput',
    path: 'TagInput/TagInput.tsx',
    description: 'Key-Value 태그 입력. validation 지원.',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: 'TDS에서는 동적 폼 패턴(Pattern 1: Key-Value)으로 대체.',
    category: 'Form Controls',
  },
  {
    name: 'FormField',
    path: 'FormField.tsx',
    description: '폼 필드 래퍼. label, description, error/success/hint.',
    tdsEquivalent: 'FormField',
    status: 'migrated',
    category: 'Form Controls',
  },
  {
    name: 'Fieldset',
    path: 'Fieldset.tsx',
    description: '폼 필드 그룹. legend, description, error.',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: 'TDS에서는 SectionCard로 그룹핑.',
    category: 'Form Controls',
  },
  // Data Display
  {
    name: 'Table',
    path: 'Table/Table.tsx',
    description: '데이터 테이블. 정렬, 컬럼 리사이즈, 로딩/빈 상태.',
    tdsEquivalent: 'Table',
    status: 'migrated',
    category: 'Data Display',
  },
  {
    name: 'TcTable',
    path: 'TcTable/TcTable.tsx',
    description: 'Compound 테이블 (Tr, Td, Header, Body, Footer). 선택, 확장.',
    tdsEquivalent: 'Table',
    status: 'partial',
    notes: 'TDS Table이 대부분 기능을 커버하지만 compound API는 미지원.',
    category: 'Data Display',
  },
  {
    name: 'Badge',
    path: 'Badge.tsx',
    description: '뱃지. theme, size, type(solid/subtle), icon 지원.',
    tdsEquivalent: 'Badge',
    status: 'migrated',
    category: 'Data Display',
  },
  {
    name: 'Tag',
    path: 'Tag/Tag.tsx',
    description: '태그. 필터/멀티셀렉트용.',
    tdsEquivalent: 'Chip',
    status: 'migrated',
    category: 'Data Display',
  },
  {
    name: 'StatusIndicator',
    path: 'StatusIndicator/StatusIndicator.tsx',
    description: '상태 뱃지. 프리셋 아이콘+컬러 또는 커스텀.',
    tdsEquivalent: 'StatusIndicator',
    status: 'migrated',
    category: 'Data Display',
  },
  {
    name: 'Pagination',
    path: 'Pagination/Pagination.tsx',
    description: '페이지네이션. prev/next, 페이지 목록, settings.',
    tdsEquivalent: 'Pagination',
    status: 'migrated',
    category: 'Data Display',
  },
  {
    name: 'ProgressBar',
    path: 'ProgressBar/ProgressBar.tsx',
    description: '프로그레스 바. pending 세그먼트 지원.',
    tdsEquivalent: 'ProgressBar',
    status: 'migrated',
    category: 'Data Display',
  },
  {
    name: 'MultiItemDisplay',
    path: 'MultiItemDisplay/MultiItemDisplay.tsx',
    description: '항목 표시: 첫 항목 + (+N) 툴팁.',
    tdsEquivalent: 'BadgeList',
    status: 'migrated',
    category: 'Data Display',
  },
  {
    name: 'Skeleton',
    path: 'Skeleton/Skeleton.tsx',
    description: '로딩 플레이스홀더.',
    tdsEquivalent: 'Skeleton',
    status: 'migrated',
    category: 'Data Display',
  },
  {
    name: 'CardList',
    path: 'CardList.tsx',
    description: '카드 리스트. 로딩/빈 상태/에러 경계.',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: '앱 레벨 컴포넌트. TDS에서는 각 페이지에서 직접 구현.',
    category: 'Data Display',
  },
  // Feedback
  {
    name: 'InlineMessage',
    path: 'InlineMessage/InlineMessage.tsx',
    description: '인라인 메시지 (success, info, warning, error).',
    tdsEquivalent: 'InlineMessage',
    status: 'migrated',
    category: 'Feedback',
  },
  {
    name: 'Toast',
    path: 'Toast/Toast.tsx',
    description: '토스트 알림.',
    tdsEquivalent: 'Toast / Snackbar',
    status: 'migrated',
    category: 'Feedback',
  },
  {
    name: 'LoadingSpinner',
    path: 'LoadingSpinner/LoadingSpinner.tsx',
    description: '로딩 스피너.',
    tdsEquivalent: 'Loading',
    status: 'migrated',
    category: 'Feedback',
  },
  {
    name: 'EmptyUI',
    path: 'EmptyUI.tsx',
    description: '빈 상태 표시.',
    tdsEquivalent: 'EmptyState',
    status: 'migrated',
    category: 'Feedback',
  },
  // Overlay
  {
    name: 'Overlay (Modal/Drawer)',
    path: 'Overlay/Overlay.tsx',
    description: '모달 및 드로어 오버레이 템플릿.',
    tdsEquivalent: 'Modal / Drawer',
    status: 'migrated',
    category: 'Overlay',
  },
  {
    name: 'ActionModal',
    path: 'ActionModal.tsx',
    description: '액션 모달 (확인/취소).',
    tdsEquivalent: 'ConfirmModal',
    status: 'migrated',
    category: 'Overlay',
  },
  {
    name: 'DeleteResourceModal',
    path: 'DeleteResourceModal.tsx',
    description: '리소스 삭제 확인 모달.',
    tdsEquivalent: 'ConfirmModal (danger)',
    status: 'migrated',
    category: 'Overlay',
  },
  {
    name: 'ResourceActionModal',
    path: 'ResourceActionModal/ResourceActionModal.tsx',
    description: '리소스 액션 모달. InfoContainer + InlineMessage.',
    tdsEquivalent: 'Modal + InfoBox',
    status: 'partial',
    notes: 'TDS에서는 Modal + InfoBox 조합으로 구현.',
    category: 'Overlay',
  },
  {
    name: 'Tooltip',
    path: 'Tooltip/Tooltip.tsx',
    description: '툴팁. CSS Anchor Positioning 사용.',
    tdsEquivalent: 'Tooltip',
    status: 'migrated',
    category: 'Overlay',
  },
  {
    name: 'ContextMenu',
    path: 'ContextMenu.tsx',
    description: '컨텍스트 메뉴. 키보드 탐색, SubItems.',
    tdsEquivalent: 'ContextMenu',
    status: 'migrated',
    category: 'Overlay',
  },
  {
    name: 'FloatingCard',
    path: 'FloatingCard.tsx',
    description: 'Create 페이지 스티키 요약 카드.',
    tdsEquivalent: 'FloatingCard',
    status: 'migrated',
    category: 'Overlay',
  },
  // Navigation
  {
    name: 'TabBar',
    path: 'TabBar/TabBar.tsx',
    description: '브라우저 스타일 탭바. 드래그 리오더, 스크롤.',
    tdsEquivalent: 'TabBar',
    status: 'migrated',
    category: 'Navigation',
  },
  {
    name: 'Tabs',
    path: 'Tabs/Tabs.tsx',
    description: '탭 네비게이션. line/button variant.',
    tdsEquivalent: 'Tabs',
    status: 'migrated',
    category: 'Navigation',
  },
  {
    name: 'TabSelector',
    path: 'TabSelector/TabSelector.tsx',
    description: '세그먼트 컨트롤 (옵션 선택).',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: 'TDS에서는 Tabs variant="boxed"로 대체 가능.',
    category: 'Navigation',
  },
  {
    name: 'Breadcrumb',
    path: 'Breadcrumb.tsx',
    description: '경로 표시 네비게이션.',
    tdsEquivalent: 'Breadcrumb',
    status: 'migrated',
    category: 'Navigation',
  },
  {
    name: 'NavigationControls',
    path: 'NavigationControls/NavigationControls.tsx',
    description: '뒤로/앞으로 네비게이션 버튼.',
    tdsEquivalent: 'TopBar (내장)',
    status: 'migrated',
    category: 'Navigation',
  },
  {
    name: 'Sidebar',
    path: 'Sidebar/Sidebar.tsx',
    description: '사이드바 스켈레톤 (header + menu).',
    tdsEquivalent: 'PageShell sidebar',
    status: 'migrated',
    category: 'Navigation',
  },
  // Layout
  {
    name: 'Layout',
    path: 'Layout/Layout.tsx',
    description: 'Container, Block, VStack, HStack, Grid, Divider.',
    tdsEquivalent: 'VStack / HStack / Container',
    status: 'migrated',
    category: 'Layout',
  },
  {
    name: 'Typography',
    path: 'Typography/Typography.tsx',
    description: 'Title, Text, Label 타이포그래피.',
    tdsEquivalent: '유틸리티 클래스 (text-heading-*, text-body-*)',
    status: 'migrated',
    notes: 'TDS는 컴포넌트 대신 CSS 유틸리티 클래스 사용.',
    category: 'Layout',
  },
  {
    name: 'AppLayout',
    path: 'AppLayout/AppLayout.tsx',
    description: '앱 셸. 사이드바, 헤더(TabBar, ToolBar), 메인.',
    tdsEquivalent: 'PageShell',
    status: 'migrated',
    category: 'Layout',
  },
  {
    name: 'CreateLayout',
    path: 'CreateLayout.tsx',
    description: 'Create 페이지 레이아웃. 좌측 콘텐츠 + 우측 FloatingCard.',
    tdsEquivalent: 'Wizard 패턴',
    status: 'partial',
    notes: 'TDS에서는 SectionCard 기반 Wizard 패턴으로 대체.',
    category: 'Layout',
  },
  {
    name: 'DetailCard',
    path: 'DetailCard.tsx',
    description: '상세 페이지 카드. label-value 쌍.',
    tdsEquivalent: 'SectionCard + DataRow',
    status: 'migrated',
    category: 'Layout',
  },
  {
    name: 'DetailPageHeader',
    path: 'DetailPageHeader.tsx',
    description: '상세 페이지 헤더. title, actions, infoFields.',
    tdsEquivalent: 'DetailHeader',
    status: 'migrated',
    category: 'Layout',
  },
  {
    name: 'InfoContainer',
    path: 'InfoContainer/InfoContainer.tsx',
    description: '읽기 전용 label-value 컨테이너.',
    tdsEquivalent: 'InfoBox',
    status: 'migrated',
    category: 'Layout',
  },
  {
    name: 'Title',
    path: 'Title/Title.tsx',
    description: '페이지/섹션 타이틀.',
    tdsEquivalent: 'PageHeader',
    status: 'migrated',
    category: 'Layout',
  },
  // Utility
  {
    name: 'CopyButton',
    path: 'CopyButton.tsx',
    description: '클립보드 복사 버튼.',
    tdsEquivalent: 'CopyButton',
    status: 'migrated',
    category: 'Utility',
  },
  {
    name: 'Accordion',
    path: 'Accordion.tsx',
    description: '아코디언. single/multiple 패널.',
    tdsEquivalent: 'Disclosure',
    status: 'migrated',
    category: 'Utility',
  },
  {
    name: 'Disclosure',
    path: 'Disclosure.tsx',
    description: '접기/펼치기 섹션.',
    tdsEquivalent: 'Disclosure',
    status: 'migrated',
    category: 'Utility',
  },
  {
    name: 'Stepper',
    path: 'Stepper/Stepper.tsx',
    description: '멀티스텝 위자드. 아코디언 섹션.',
    tdsEquivalent: 'Wizard 패턴 (SectionCard)',
    status: 'partial',
    notes: 'TDS에서는 SectionCard 기반 위자드 상태 관리로 대체.',
    category: 'Utility',
  },
  {
    name: 'RefreshButton',
    path: 'RefreshButton/RefreshButton.tsx',
    description: '새로고침 버튼. 카운트다운 지원.',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: '앱 레벨에서 구현.',
    category: 'Utility',
  },
  {
    name: 'Icon',
    path: 'Icon/Icon.tsx',
    description: 'Tabler 아이콘 래퍼.',
    tdsEquivalent: 'Tabler icons 직접 사용',
    status: 'migrated',
    notes: 'TDS에서는 래퍼 없이 Tabler icons를 직접 import.',
    category: 'Utility',
  },
  {
    name: 'MonitoringToolbar',
    path: 'MonitoringToolbar/MonitoringToolbar.tsx',
    description: '그래프 시간 범위 툴바.',
    tdsEquivalent: 'MonitoringToolbar',
    status: 'migrated',
    category: 'Utility',
  },
  // App-specific
  {
    name: 'AppIcon',
    path: 'AppIcon/AppIcon.tsx',
    description: '앱 브랜드 아이콘.',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: '앱 레벨 컴포넌트.',
    category: 'App-specific',
  },
  {
    name: 'AppHeaderTab',
    path: 'AppLayout/AppHeaderTab.tsx',
    description: 'AppLayout 헤더 탭바.',
    tdsEquivalent: 'TabBar',
    status: 'migrated',
    category: 'App-specific',
  },
  {
    name: 'ToolBar',
    path: 'ToolBar/ToolBar.tsx',
    description: '앱 상단 툴바. 사이드바 토글, 네비게이션, 브레드크럼.',
    tdsEquivalent: 'TopBar',
    status: 'migrated',
    category: 'App-specific',
  },
  {
    name: 'TabContainer',
    path: 'TabContainer/TabContainer.tsx',
    description: '라우트 기반 탭 콘텐츠 lazy 로딩.',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: '앱 레벨 라우팅 컴포넌트.',
    category: 'App-specific',
  },
  {
    name: 'FrameControls',
    path: 'FrameControls/FrameControls.tsx',
    description: '윈도우 컨트롤 (최소화, 최대화, 닫기, snap).',
    tdsEquivalent: 'WindowControl',
    status: 'migrated',
    category: 'App-specific',
  },
  {
    name: 'LangButton',
    path: 'LangButton/LangButton.tsx',
    description: '언어 전환 버튼 (EN/KO).',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: '앱 레벨 컴포넌트.',
    category: 'App-specific',
  },
  {
    name: 'Terminal',
    path: 'Terminal/Terminal.tsx',
    description: 'WebSocket 기반 원격 터미널 (xterm.js).',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: '앱 레벨 컴포넌트. 디자인 시스템 범위 외.',
    category: 'App-specific',
  },
  {
    name: 'PromptEditor',
    path: 'Editor/PromptEditor.tsx',
    description: 'Monaco 기반 프롬프트 에디터.',
    tdsEquivalent: '-',
    status: 'no-equivalent',
    notes: '앱 레벨 컴포넌트. Monaco editor 의존.',
    category: 'App-specific',
  },
];

const CATEGORIES = [
  'Form Controls',
  'Data Display',
  'Feedback',
  'Overlay',
  'Navigation',
  'Layout',
  'Utility',
  'App-specific',
];

const STATUS_CONFIG: Record<
  MigrationStatus,
  { label: string; variant: string; icon: typeof IconCircleCheck }
> = {
  migrated: { label: 'TDS 대응', variant: 'success', icon: IconCircleCheck },
  partial: { label: '부분 대응', variant: 'warning', icon: IconReplace },
  'not-migrated': { label: '미대응', variant: 'danger', icon: IconAlertTriangle },
  'no-equivalent': { label: '대응 없음', variant: 'info', icon: IconExternalLink },
};

function StatusBadge({ status }: { status: MigrationStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant={config.variant as 'success' | 'warning' | 'danger' | 'info'} size="sm">
      {config.label}
    </Badge>
  );
}

export function SharedComponentsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filtered = useMemo(() => {
    if (!search.trim()) return COMPONENTS;
    const q = search.toLowerCase();
    return COMPONENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.tdsEquivalent && c.tdsEquivalent.toLowerCase().includes(q))
    );
  }, [search]);

  const stats = useMemo(() => {
    const total = COMPONENTS.length;
    const migrated = COMPONENTS.filter((c) => c.status === 'migrated').length;
    const partial = COMPONENTS.filter((c) => c.status === 'partial').length;
    const noEquiv = COMPONENTS.filter((c) => c.status === 'no-equivalent').length;
    return {
      total,
      migrated,
      partial,
      noEquiv,
      coverage: Math.round(((migrated + partial) / total) * 100),
    };
  }, []);

  const groupedByCategory = useMemo(() => {
    const map: Record<string, SharedComponent[]> = {};
    for (const cat of CATEGORIES) {
      const items = filtered.filter((c) => c.category === cat);
      if (items.length > 0) map[cat] = items;
    }
    return map;
  }, [filtered]);

  return (
    <VStack gap={8}>
      <DocSection id="shared-components" title="Shared 컴포넌트 분석">
        <p className="text-body-md text-[var(--color-text-muted)]">
          thaki-shared (ThakiCloud/thaki-shared) 컴포넌트 라이브러리와 TDS 디자인 시스템 간의 매핑
          및 대응 현황을 분석합니다. 총 {stats.total}개의 shared 컴포넌트 중 {stats.migrated}개가
          TDS 대응 완료, {stats.partial}개가 부분 대응 상태입니다.
        </p>
      </DocSection>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <SummaryCard label="전체 컴포넌트" value={stats.total} />
        <SummaryCard label="TDS 대응" value={stats.migrated} color="var(--color-state-success)" />
        <SummaryCard label="부분 대응" value={stats.partial} color="var(--color-state-warning)" />
        <SummaryCard label="대응 없음" value={stats.noEquiv} color="var(--color-state-info)" />
      </div>

      {/* Coverage Bar */}
      <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)]">
        <HStack justify="between" align="center" className="mb-2">
          <span className="text-label-md text-[var(--color-text-default)]">TDS 대응 현황</span>
          <span className="text-heading-h5 text-[var(--color-state-success)]">
            {stats.coverage}%
          </span>
        </HStack>
        <div className="w-full h-2 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-state-success)] rounded-full transition-all"
            style={{ width: `${stats.coverage}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
        <TabList>
          <Tab value="overview">개요</Tab>
          <Tab value="mapping">컴포넌트 매핑</Tab>
          <Tab value="notes">비고</Tab>
        </TabList>

        <TabPanel value="overview" className="pt-0">
          <VStack gap={4} className="pt-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="컴포넌트 검색..."
              size="sm"
              className="w-[300px]"
            />
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-3">
                  {category}
                </h4>
                <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
                  <table className="w-full text-body-md">
                    <thead>
                      <tr className="bg-[var(--color-surface-subtle)]">
                        <th className="text-left text-label-sm font-medium p-2.5 text-[var(--color-text-subtle)]">
                          Shared 컴포넌트
                        </th>
                        <th className="text-left text-label-sm font-medium p-2.5 text-[var(--color-text-subtle)]">
                          <HStack gap={1} align="center">
                            <IconArrowRight size={12} />
                            TDS 대응
                          </HStack>
                        </th>
                        <th className="text-center text-label-sm font-medium p-2.5 text-[var(--color-text-subtle)] w-[100px]">
                          상태
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((c) => (
                        <tr key={c.name} className="border-t border-[var(--color-border-subtle)]">
                          <td className="p-2.5">
                            <VStack gap={0.5}>
                              <span className="text-label-md text-[var(--color-text-default)]">
                                {c.name}
                              </span>
                              <span className="text-body-sm text-[var(--color-text-subtle)]">
                                {c.description}
                              </span>
                            </VStack>
                          </td>
                          <td className="p-2.5 text-[var(--color-text-muted)]">
                            {c.tdsEquivalent || '-'}
                          </td>
                          <td className="p-2.5 text-center">
                            <StatusBadge status={c.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </VStack>
        </TabPanel>

        <TabPanel value="mapping" className="pt-0">
          <VStack gap={4} className="pt-4">
            <p className="text-body-md text-[var(--color-text-muted)]">
              Shared 컴포넌트에서 TDS 컴포넌트로의 1:1 매핑 테이블입니다. 마이그레이션 시 이 매핑을
              참조하세요.
            </p>
            <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
              <table className="w-full text-body-md">
                <thead>
                  <tr className="bg-[var(--color-surface-subtle)]">
                    <th className="text-left text-label-sm font-medium p-2.5 text-[var(--color-text-subtle)]">
                      Shared
                    </th>
                    <th className="text-center text-label-sm font-medium p-2.5 text-[var(--color-text-subtle)] w-[40px]" />
                    <th className="text-left text-label-sm font-medium p-2.5 text-[var(--color-text-subtle)]">
                      TDS
                    </th>
                    <th className="text-left text-label-sm font-medium p-2.5 text-[var(--color-text-subtle)]">
                      파일 경로
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPONENTS.filter((c) => c.status === 'migrated' || c.status === 'partial')
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((c) => (
                      <tr key={c.name} className="border-t border-[var(--color-border-subtle)]">
                        <td className="p-2.5 text-[var(--color-text-default)]">{c.name}</td>
                        <td className="p-2.5 text-center text-[var(--color-text-subtle)]">
                          <IconArrowRight size={14} />
                        </td>
                        <td className="p-2.5 text-[var(--color-action-primary)] font-medium">
                          {c.tdsEquivalent}
                        </td>
                        <td className="p-2.5 text-body-sm text-[var(--color-text-subtle)]">
                          {c.path}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </VStack>
        </TabPanel>

        <TabPanel value="notes" className="pt-0">
          <VStack gap={4} className="pt-4">
            <p className="text-body-md text-[var(--color-text-muted)]">
              대응 전환 시 주의사항 및 특이 사항입니다.
            </p>
            {COMPONENTS.filter((c) => c.notes).map((c) => (
              <div
                key={c.name}
                className="p-3 border border-[var(--color-border-default)] rounded-[var(--radius-md)] bg-[var(--color-surface-default)]"
              >
                <HStack justify="between" align="start" className="mb-1">
                  <span className="text-label-md text-[var(--color-text-default)]">{c.name}</span>
                  <StatusBadge status={c.status} />
                </HStack>
                <p className="text-body-sm text-[var(--color-text-muted)]">{c.notes}</p>
              </div>
            ))}
          </VStack>
        </TabPanel>
      </Tabs>
    </VStack>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)]">
      <span className="text-body-sm text-[var(--color-text-subtle)]">{label}</span>
      <div className="text-heading-h3 mt-1" style={color ? { color } : undefined}>
        {value}
      </div>
    </div>
  );
}
