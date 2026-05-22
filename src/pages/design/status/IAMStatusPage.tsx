import { StatusIndicator, VStack, HStack } from '@/design-system';
import { Link, useLocation } from 'react-router-dom';
import AppIconIAM from '@/assets/appIcon/iam.webp';
import { PrevNextNav } from '../_shared/PrevNextNav';
import { pageLastUpdated } from '../_shared/navigationData';

interface StatusEntry {
  status: string;
  tooltip: string;
  icon: string;
  color: string;
}

interface ResourceSection {
  resource: string;
  entries: StatusEntry[];
}

const IAM_RESOURCES: ResourceSection[] = [
  {
    resource: 'Users',
    entries: [
      { status: 'active', tooltip: 'Active', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'deactivated', tooltip: 'Deactivated', icon: 'IconLivePhotoOff', color: 'Gray' },
    ],
  },
  {
    resource: 'Access Keys',
    entries: [
      { status: 'active', tooltip: 'Active', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'deactivated', tooltip: 'Deactivated', icon: 'IconLivePhotoOff', color: 'Gray' },
    ],
  },
];

function StatusTable({ entries }: { entries: StatusEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        <thead>
          <tr>
            <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r last:border-r-0 border-[var(--color-border-subtle)] w-[80px]">
              Status
            </th>
            <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r last:border-r-0 border-[var(--color-border-subtle)]">
              Tooltip
            </th>
            <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r last:border-r-0 border-[var(--color-border-subtle)]">
              Icon
            </th>
            <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)] w-[80px]">
              Color
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={i}>
              <td className="p-2 border-t border-r border-[var(--color-border-subtle)] text-center">
                <StatusIndicator status={entry.status as never} layout="icon-only" />
              </td>
              <td className="p-2 border-t border-r border-[var(--color-border-subtle)]">
                <code className="text-body-sm font-mono bg-[var(--color-surface-muted)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                  {entry.tooltip}
                </code>
              </td>
              <td className="p-2 border-t border-r border-[var(--color-border-subtle)]">
                <code className="text-body-sm font-mono bg-[var(--color-surface-muted)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                  {entry.icon}
                </code>
              </td>
              <td className="p-2 border-t border-[var(--color-border-subtle)] text-body-sm">
                {entry.color}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResourceStatusSection({ section }: { section: ResourceSection }) {
  return (
    <VStack gap={4}>
      <span className="text-heading-h5 text-[var(--color-text-default)]">{section.resource}</span>
      <StatusTable entries={section.entries} />
    </VStack>
  );
}

export function IAMStatusPage() {
  const location = useLocation();
  const lastUpdated = pageLastUpdated[location.pathname];

  const formattedDate = lastUpdated
    ? (() => {
        const [y, m, d] = lastUpdated.split(' ')[0].split('-');
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        return `${months[parseInt(m) - 1]} ${d}, ${y}`;
      })()
    : null;

  return (
    <div>
      <VStack gap={0} align="stretch">
        <div className="flex items-start justify-between gap-8 pt-2 pb-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-heading-h3 text-[var(--color-text-default)]">
              IAM — 리소스 상태 정의
            </h2>
            <p className="text-body-lg text-[var(--color-text-muted)] max-w-[720px]">
              IAM 앱의 각 리소스별 Defined 상태 목록. 각 상태에 사용되는 StatusIndicator, tooltip
              텍스트, 아이콘을 정의한다.
            </p>
          </div>
          {formattedDate && (
            <span className="text-body-sm text-[var(--color-text-subtle)] shrink-0">
              Updated {formattedDate}
            </span>
          )}
        </div>

        <HStack gap={3} align="center" className="pb-8">
          <img src={AppIconIAM} alt="" className="size-6 object-contain" />
          <span className="text-heading-h5 text-[var(--color-text-default)]">IAM</span>
        </HStack>

        <VStack gap={8} align="stretch">
          {IAM_RESOURCES.map((section) => (
            <ResourceStatusSection key={section.resource} section={section} />
          ))}
        </VStack>

        <VStack gap={3} align="stretch" className="pt-10">
          <p className="text-body-md text-[var(--color-text-muted)]">
            이 문서는 Notion 기획 문서 &quot;리소스 상태 및 액션 정리&quot;를 기반으로
            작성되었습니다. 상태 추가/변경 시 Notion 문서를 먼저 업데이트한 후 이 페이지에
            반영하세요.
          </p>
        </VStack>

        <VStack gap={3} align="stretch" className="pt-8">
          <h3 className="text-heading-h5 text-[var(--color-text-default)]">Related</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              to="/design/components/status-indicator"
              className="text-body-md text-[var(--color-text-default)] hover:text-[var(--color-action-primary)] transition-colors"
            >
              Status Indicator
            </Link>
            <Link
              to="/design/components/badge"
              className="text-body-md text-[var(--color-text-default)] hover:text-[var(--color-action-primary)] transition-colors"
            >
              Badge
            </Link>
          </div>
        </VStack>

        <div className="pt-12">
          <PrevNextNav />
        </div>
      </VStack>
    </div>
  );
}
