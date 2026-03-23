import { useState, useMemo } from 'react';
import { VStack, HStack, Badge } from '@/design-system';
import { DocSection } from './_shared/DocSection';
import {
  IconPlus,
  IconRefresh,
  IconBug,
  IconTrash,
  IconBook,
  IconChevronDown,
  IconChevronRight,
  IconSortDescending,
  IconSortAscending,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

type ChangeType = 'new' | 'updated' | 'fixed' | 'removed' | 'docs';

interface ChangelogEntry {
  type: ChangeType;
  date: string;
  component?: string;
  description: string;
  link?: string;
}

interface ChangelogVersion {
  version: string;
  date: string;
  summary: string;
  entries: ChangelogEntry[];
}

/* ----------------------------------------
   Config
   ---------------------------------------- */

const TYPE_CONFIG: Record<
  ChangeType,
  {
    label: string;
    icon: typeof IconPlus;
    variant: 'info' | 'warning' | 'success' | 'danger';
  }
> = {
  new: { label: 'New', icon: IconPlus, variant: 'info' },
  updated: { label: 'Updated', icon: IconRefresh, variant: 'warning' },
  fixed: { label: 'Fixed', icon: IconBug, variant: 'success' },
  removed: { label: 'Removed', icon: IconTrash, variant: 'danger' },
  docs: { label: 'Docs', icon: IconBook, variant: 'info' },
};

/* ----------------------------------------
   Changelog Data
   ---------------------------------------- */

const CHANGELOG: ChangelogVersion[] = [
  {
    version: '1.2.0',
    date: '2026-03-23',
    summary: '다크모드 Zinc 팔레트 전환, Table 리사이즈, Figma 캡처 모드, 컴포넌트 문서 대폭 정비',
    entries: [
      // New
      {
        type: 'new',
        date: '2026-03-10',
        component: 'Table',
        description: '컬럼 리사이즈 기능 추가 (snapshot + spacer 전략 기반 드래그 리사이즈)',
        link: '/design/components/table',
      },
      {
        type: 'new',
        date: '2026-03-18',
        component: 'ExpandableChecklist',
        description: '새 컴포넌트 추가 (다크모드 지원 포함)',
        link: '/design/components/expandable-checklist',
      },
      {
        type: 'new',
        date: '2026-03-09',
        component: 'Skeleton / Spinner',
        description: 'Loading에서 분리하여 독립 컴포넌트 페이지 추가',
        link: '/design/components/skeleton',
      },
      {
        type: 'new',
        date: '2026-03-20',
        component: 'Estimate Gauge Bar',
        description: 'Create 페이지용 변형 추가',
        link: '/design/charts/usage-chart',
      },
      {
        type: 'new',
        date: '2026-03-16',
        component: 'System Error Pages',
        description: '403, 404, 500, Link Expired 에러 상태 변형 추가',
        link: '/design/policies/system-error',
      },
      {
        type: 'new',
        date: '2026-03-16',
        description: 'Figma 캡처 모드 — ?capture=true 쿼리 파라미터로 HTML to Design 레이어명 전달',
      },
      {
        type: 'new',
        date: '2026-03-23',
        description: 'Desktop 아이콘 그리드 기반 드래그앤드롭 (스냅 이동)',
      },
      {
        type: 'new',
        date: '2026-03-23',
        component: 'Project Selector',
        description:
          '문서 페이지 추가 — default / sidebar-icon 변형, 드롭다운 패널, 카드 상태 예시',
        link: '/design/components/project-selector',
      },
      {
        type: 'new',
        date: '2026-03-19',
        description: 'thaki-shared-v2 Shared Components 분석 페이지 및 IAM 프리뷰 앱',
        link: '/design/shared-components',
      },
      {
        type: 'new',
        date: '2026-03-16',
        description: 'All Components 인덱스 페이지 — DS 컴포넌트 전체 목록 Overview',
        link: '/design/all',
      },

      // Updated
      {
        type: 'updated',
        date: '2026-03-23',
        component: 'CopyButton',
        description:
          '전체 앱의 인라인 Copy 버튼을 DS CopyButton으로 통일 — InfoBox, DetailHeader, 40+ Detail/List 페이지 적용, stopPropagation 추가. ghost variant 기본 아이콘 색상을 text-muted → text-default로 변경',
        link: '/design/components/copy-button',
      },
      {
        type: 'updated',
        date: '2026-03-23',
        component: 'Typography',
        description:
          'Button 타이포그래피 토큰명을 action.lg/md/sm으로 변경 (Button 컴포넌트명과의 충돌 방지)',
        link: '/design/foundation/typography',
      },
      {
        type: 'updated',
        date: '2026-03-23',
        component: 'Snackbar',
        description:
          'Notification Card States 예시를 NotificationCenter에서 Snackbar 페이지로 이동',
        link: '/design/components/snackbar',
      },
      {
        type: 'updated',
        date: '2026-03-23',
        description:
          '사이드바 New 뱃지를 "오늘만" → "최근 3일" 기간으로 확장, 자동 타임스탬프 갱신 스크립트 추가',
      },
      {
        type: 'updated',
        date: '2026-03-19',
        description: '다크모드 neutral 팔레트를 Slate에서 Zinc로 전환, 토큰 JSON 소스 업데이트',
        link: '/design/foundation/semantic-colors',
      },
      {
        type: 'updated',
        date: '2026-03-20',
        component: 'Table',
        description: '다크모드 전용 토큰 추가 (header bg, selected row bg/border)',
        link: '/design/components/table',
      },
      {
        type: 'updated',
        date: '2026-03-20',
        description:
          'Semantic Colors state-success/warning/danger 값을 앱 실사용 값(500/600)과 동기화',
        link: '/design/foundation/semantic-colors',
      },
      {
        type: 'updated',
        date: '2026-03-20',
        description: 'Semantic Colors 페이지에 Light/Dark 테마 탭 + URL 쿼리 파라미터 동기화',
        link: '/design/foundation/semantic-colors',
      },
      {
        type: 'updated',
        date: '2026-03-20',
        description: '+N 오버플로우 인디케이터를 pill badge + Popover 방식으로 표준화',
      },
      {
        type: 'updated',
        date: '2026-03-23',
        component: 'TabBar',
        description: 'close 버튼에 onWindowClose 미제공 시 엔트리 페이지(/)로 기본 이동',
        link: '/design/components/tabbar',
      },
      {
        type: 'updated',
        date: '2026-03-06',
        component: 'StatusIndicator',
        description: '기본 레이아웃 Icon+Label로 변경, 아이콘 전용 모드 전체 앱에 적용',
        link: '/design/components/status-indicator',
      },
      {
        type: 'updated',
        date: '2026-03-18',
        component: 'Badge',
        description: 'lg 사이즈 제거, md 토큰 업데이트, min-width 추가',
        link: '/design/components/badge',
      },
      {
        type: 'updated',
        date: '2026-03-14',
        component: 'Modal',
        description: '고정 344px 너비로 통일',
        link: '/design/components/modal',
      },
      {
        type: 'updated',
        date: '2026-03-19',
        component: 'FormField',
        description: '레이블 스타일을 text-label-lg와 일치하도록 수정',
        link: '/design/patterns/form-field',
      },
      {
        type: 'updated',
        date: '2026-03-04',
        description: '앱 아이콘 전체를 3D 렌더링 스타일로 교체',
      },
      {
        type: 'updated',
        date: '2026-03-20',
        description:
          '사이드바 네비게이션 재구성 — Transitions → Etc, Dynamic Form Fields → Patterns 이동',
      },
      {
        type: 'updated',
        date: '2026-03-16',
        description: 'DS 문서 페이지 간소화 — Accessibility, Usage, API Reference 섹션 제거',
      },

      // Fixed
      {
        type: 'fixed',
        date: '2026-03-03',
        description: '다크모드 Input 색상, theme scoping, 포털 내 토큰 적용 수정',
      },
      {
        type: 'fixed',
        date: '2026-03-19',
        description: '테이블 선택 행에서 sticky 액션 컬럼 배경색 수정',
      },
      {
        type: 'fixed',
        date: '2026-03-15',
        component: 'Password',
        description: 'placeholder 색상 수정',
        link: '/design/components/password',
      },
      {
        type: 'fixed',
        date: '2026-03-10',
        description: 'Chart color, surface-hover, info-weak-bg 등 누락 CSS 변수 정의',
      },
      {
        type: 'fixed',
        date: '2026-03-11',
        description: 'CloudBuilder 탭 URL 연동 및 라벨 소문자 통일',
      },
      {
        type: 'fixed',
        date: '2026-03-09',
        description: 'DS 문서 깨진 링크, 누락 섹션, 정책 문서 맞춤법 통일',
      },

      // Removed
      {
        type: 'removed',
        date: '2026-03-23',
        description: 'IconographyPage 삭제',
      },
      {
        type: 'removed',
        date: '2026-03-23',
        description: '401-B Session Timeout 에러 케이스 삭제',
      },
      {
        type: 'removed',
        date: '2026-03-06',
        description:
          'EmptyState 컴포넌트 문서 페이지(components/) 삭제 — patterns/EmptyStates 페이지로 이관',
      },
      {
        type: 'removed',
        date: '2026-03-10',
        description: 'NotionDesignNotes 컴포넌트 제거',
      },
    ],
  },
  {
    version: '1.1.1',
    date: '2026-02-23',
    summary: '초기 디자인 시스템 구축 — Foundation 토큰, 핵심 컴포넌트, 페이지 패턴 정의',
    entries: [
      {
        type: 'new',
        date: '2026-02-23',
        description: 'Foundation 토큰 체계 정의 (색상, 타이포그래피, 간격, 반경, 트랜지션)',
        link: '/design/foundation/tokens',
      },
      {
        type: 'new',
        date: '2026-02-23',
        description:
          '핵심 컴포넌트 구현 — Button, Input, Select, Table, Modal, Drawer, Tabs, Badge 등',
      },
      {
        type: 'new',
        date: '2026-02-23',
        description: '페이지 패턴 정의 — List Page, Detail Page, Form Drawer, Wizard',
        link: '/design/patterns/list-page',
      },
      {
        type: 'new',
        date: '2026-02-23',
        description: 'PageShell, PageHeader, DetailHeader, SectionCard 레이아웃 컴포넌트',
        link: '/design/patterns/layout',
      },
      {
        type: 'new',
        date: '2026-02-23',
        description: 'DS 문서 사이트 구축 및 Storybook 연동',
      },
    ],
  },
];

/* ----------------------------------------
   Helpers
   ---------------------------------------- */

function formatShortDate(dateStr: string) {
  const [, month, day] = dateStr.split('-');
  return `${month}-${day}`;
}

/* ----------------------------------------
   Components
   ---------------------------------------- */

function TypeBadge({ type }: { type: ChangeType }) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} size="sm">
      <HStack gap={1} align="center">
        <Icon size={10} stroke={2} />
        <span>{config.label}</span>
      </HStack>
    </Badge>
  );
}

function EntryRow({ entry }: { entry: ChangelogEntry }) {
  return (
    <HStack gap={2} align="start" className="py-1.5">
      <div className="flex-shrink-0 mt-0.5">
        <TypeBadge type={entry.type} />
      </div>
      <div className="flex-1 text-body-md text-[var(--color-text-default)] min-w-0">
        {entry.component && (
          <span className="text-label-md text-[var(--color-text-default)] mr-1">
            {entry.link ? (
              <a
                href={entry.link}
                className="hover:text-[var(--color-action-primary)] hover:underline"
              >
                {entry.component}
              </a>
            ) : (
              entry.component
            )}
          </span>
        )}
        <span className="text-[var(--color-text-muted)]">{entry.description}</span>
      </div>
      <span className="flex-shrink-0 text-body-sm text-[var(--color-text-subtle)] tabular-nums">
        {formatShortDate(entry.date)}
      </span>
    </HStack>
  );
}

type SortOrder = 'newest' | 'oldest';

function VersionSection({
  version,
  defaultOpen = false,
}: {
  version: ChangelogVersion;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const grouped = useMemo(() => {
    const groups = version.entries.reduce<Record<ChangeType, ChangelogEntry[]>>(
      (acc, entry) => {
        acc[entry.type] = acc[entry.type] || [];
        acc[entry.type].push(entry);
        return acc;
      },
      {} as Record<ChangeType, ChangelogEntry[]>
    );

    const comparator = (a: ChangelogEntry, b: ChangelogEntry) =>
      sortOrder === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);

    for (const type of Object.keys(groups) as ChangeType[]) {
      groups[type] = [...groups[type]].sort(comparator);
    }

    return groups;
  }, [version.entries, sortOrder]);

  const typeOrder: ChangeType[] = ['new', 'updated', 'fixed', 'removed', 'docs'];

  return (
    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center gap-3 px-5 py-4 bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <IconChevronDown size={16} className="text-[var(--color-text-subtle)] flex-shrink-0" />
        ) : (
          <IconChevronRight size={16} className="text-[var(--color-text-subtle)] flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <HStack gap={2} align="center">
            <span className="text-heading-h5 text-[var(--color-text-default)]">
              v{version.version}
            </span>
            <span className="text-body-md text-[var(--color-text-subtle)]">{version.date}</span>
          </HStack>
          <p className="text-body-md text-[var(--color-text-muted)] mt-1">{version.summary}</p>
        </div>
        <HStack gap={1} className="flex-shrink-0">
          {typeOrder.map(
            (type) =>
              grouped[type] &&
              grouped[type].length > 0 && (
                <Badge key={type} variant={TYPE_CONFIG[type].variant} size="sm">
                  {grouped[type].length}
                </Badge>
              )
          )}
        </HStack>
      </button>

      {isOpen && (
        <div className="px-5 py-4 border-t border-[var(--color-border-default)]">
          <HStack gap={1} align="center" justify="end" className="mb-3">
            <button
              type="button"
              className={`flex items-center gap-1 px-2 py-1 rounded-[var(--radius-md)] text-body-sm transition-colors ${
                sortOrder === 'newest'
                  ? 'text-[var(--color-action-primary)] bg-[var(--color-action-primary-subtle)]'
                  : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]'
              }`}
              onClick={() => setSortOrder('newest')}
            >
              <IconSortDescending size={12} stroke={2} />
              최신순
            </button>
            <button
              type="button"
              className={`flex items-center gap-1 px-2 py-1 rounded-[var(--radius-md)] text-body-sm transition-colors ${
                sortOrder === 'oldest'
                  ? 'text-[var(--color-action-primary)] bg-[var(--color-action-primary-subtle)]'
                  : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]'
              }`}
              onClick={() => setSortOrder('oldest')}
            >
              <IconSortAscending size={12} stroke={2} />
              오래된순
            </button>
          </HStack>
          <VStack gap={4}>
            {typeOrder.map((type) => {
              const entries = grouped[type];
              if (!entries || entries.length === 0) return null;
              const config = TYPE_CONFIG[type];
              return (
                <VStack key={type} gap={1}>
                  <HStack gap={1.5} align="center" className="mb-1">
                    <config.icon size={14} stroke={2} className="text-[var(--color-text-subtle)]" />
                    <span className="text-label-md text-[var(--color-text-default)]">
                      {config.label}
                    </span>
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      ({entries.length})
                    </span>
                  </HStack>
                  <VStack gap={0}>
                    {entries.map((entry, i) => (
                      <EntryRow key={i} entry={entry} />
                    ))}
                  </VStack>
                </VStack>
              );
            })}
          </VStack>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Page
   ---------------------------------------- */

export function ChangelogPage() {
  const latest = CHANGELOG[0];

  return (
    <VStack gap={8}>
      <DocSection id="changelog" title="Changelog">
        <p className="text-body-md text-[var(--color-text-muted)]">
          TDS 디자인 시스템의 버전별 변경 사항을 기록합니다. 새 컴포넌트, API 변경, 버그 수정, 삭제
          항목 등을 확인하고 업데이트에 대비할 수 있습니다.
        </p>
        <HStack gap={3} align="center" className="mt-3">
          <HStack gap={1.5} align="center">
            <span className="text-label-md text-[var(--color-text-subtle)]">Current</span>
            <Badge variant="info" size="md">
              v{latest.version}
            </Badge>
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            Last updated: {latest.date}
          </span>
        </HStack>
      </DocSection>

      {/* Versioning Guide */}
      <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-5 py-4">
        <VStack gap={3}>
          <span className="text-heading-h6 text-[var(--color-text-default)]">
            버전 체계 (Semantic Versioning)
          </span>
          <p className="text-body-md text-[var(--color-text-muted)]">
            TDS는{' '}
            <a
              href="https://semver.org/lang/ko/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-action-primary)] hover:underline"
            >
              Semantic Versioning
            </a>
            을 따릅니다. 버전 번호는 <strong>Major.Minor.Patch</strong> 형식이며, 각 자릿수는 변경의
            영향 범위에 따라 올라갑니다.
          </p>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body-md">
            <Badge variant="danger" size="sm">
              Major
            </Badge>
            <span className="text-[var(--color-text-muted)]">
              기존 코드 수정이 필요한 breaking change (컴포넌트 삭제, prop 이름 변경, 토큰 이름
              변경)
            </span>
            <Badge variant="warning" size="sm">
              Minor
            </Badge>
            <span className="text-[var(--color-text-muted)]">
              하위 호환되는 새 기능 추가 (신규 컴포넌트, 신규 prop, 신규 패턴)
            </span>
            <Badge variant="success" size="sm">
              Patch
            </Badge>
            <span className="text-[var(--color-text-muted)]">
              버그 수정, 시각적 미세 조정, 문서 업데이트
            </span>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-body-sm mt-1">
            <TypeBadge type="new" />
            <span className="text-[var(--color-text-subtle)]">신규 컴포넌트 또는 기능 추가</span>
            <TypeBadge type="updated" />
            <span className="text-[var(--color-text-subtle)]">
              기존 컴포넌트의 API 또는 동작 변경
            </span>
            <TypeBadge type="fixed" />
            <span className="text-[var(--color-text-subtle)]">버그 수정</span>
            <TypeBadge type="removed" />
            <span className="text-[var(--color-text-subtle)]">삭제된 컴포넌트 또는 기능</span>
          </div>
        </VStack>
      </div>

      <VStack gap={3}>
        {CHANGELOG.map((version, i) => (
          <VersionSection key={version.version} version={version} defaultOpen={i === 0} />
        ))}
      </VStack>
    </VStack>
  );
}
