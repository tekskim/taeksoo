import { Badge, VStack, HStack } from '@/design-system';
import { Link, useLocation } from 'react-router-dom';
import AppIconContainer from '@/assets/appIcon/container.png';
import { PrevNextNav } from '../_shared/PrevNextNav';
import { pageLastUpdated } from '../_shared/navigationData';

type BadgeColor = 'green' | 'blue' | 'red' | 'gray' | 'white';

interface StatusEntry {
  status: string;
  color: BadgeColor;
}

interface ResourceSection {
  resource: string;
  entries: StatusEntry[];
}

const CONTAINER_RESOURCES: ResourceSection[] = [
  {
    resource: 'Cluster',
    entries: [
      { status: 'Provisioned', color: 'green' },
      { status: 'Failed', color: 'red' },
      { status: 'Provisioning', color: 'blue' },
      { status: 'Updating', color: 'blue' },
      { status: 'Deleting', color: 'gray' },
      { status: 'Unknown', color: 'white' },
    ],
  },
  {
    resource: 'Namespace',
    entries: [
      { status: 'Active', color: 'green' },
      { status: 'Terminating', color: 'gray' },
      { status: 'Unknown', color: 'blue' },
    ],
  },
  {
    resource: 'Node',
    entries: [
      { status: 'Ready', color: 'green' },
      { status: 'NotReady', color: 'red' },
      { status: 'Unknown', color: 'blue' },
      { status: 'SchedulingDisabled', color: 'gray' },
    ],
  },
  {
    resource: 'Deployment',
    entries: [
      { status: 'Active', color: 'green' },
      { status: 'Error', color: 'red' },
      { status: 'Processing', color: 'blue' },
      { status: 'Stopped', color: 'gray' },
    ],
  },
  {
    resource: 'StatefulSet',
    entries: [
      { status: 'Active', color: 'green' },
      { status: 'Error', color: 'red' },
      { status: 'Processing', color: 'blue' },
      { status: 'Stopped', color: 'gray' },
    ],
  },
  {
    resource: 'DaemonSet',
    entries: [
      { status: 'Active', color: 'green' },
      { status: 'Error', color: 'red' },
      { status: 'Processing', color: 'blue' },
      { status: 'Stopped', color: 'gray' },
    ],
  },
  {
    resource: 'Job',
    entries: [
      { status: 'Complete', color: 'green' },
      { status: 'Failed', color: 'red' },
      { status: 'Active', color: 'blue' },
    ],
  },
  {
    resource: 'CronJob',
    entries: [
      { status: 'Active', color: 'green' },
      { status: 'Error', color: 'red' },
      { status: 'Processing', color: 'blue' },
      { status: 'Suspended', color: 'gray' },
    ],
  },
  {
    resource: 'Pod',
    entries: [
      { status: 'Running', color: 'green' },
      { status: 'Succeeded', color: 'green' },
      { status: 'Failed', color: 'red' },
      { status: 'Pending', color: 'blue' },
      { status: 'Unknown', color: 'white' },
    ],
  },
  {
    resource: 'Container',
    entries: [
      { status: 'Running', color: 'green' },
      { status: 'Error', color: 'red' },
      { status: 'Waiting', color: 'blue' },
      { status: 'Terminated', color: 'gray' },
    ],
  },
  {
    resource: 'Service',
    entries: [
      { status: 'Active', color: 'green' },
      { status: 'Error', color: 'red' },
      { status: 'Processing', color: 'blue' },
    ],
  },
  {
    resource: 'Ingress',
    entries: [
      { status: 'Active', color: 'green' },
      { status: 'Error', color: 'red' },
      { status: 'Processing', color: 'blue' },
    ],
  },
  {
    resource: 'HorizontalPodAutoscaler',
    entries: [
      { status: 'Active', color: 'green' },
      { status: 'Error', color: 'red' },
      { status: 'Processing', color: 'blue' },
    ],
  },
  {
    resource: 'PersistentVolume',
    entries: [
      { status: 'Available', color: 'green' },
      { status: 'Bound', color: 'green' },
      { status: 'Failed', color: 'red' },
      { status: 'Pending', color: 'blue' },
      { status: 'Released', color: 'gray' },
    ],
  },
  {
    resource: 'PersistentVolumeClaim',
    entries: [
      { status: 'Bound', color: 'green' },
      { status: 'Lost', color: 'red' },
      { status: 'Pending', color: 'blue' },
    ],
  },
  {
    resource: 'PodDisruptionBudget',
    entries: [
      { status: 'Active', color: 'green' },
      { status: 'Error', color: 'red' },
      { status: 'Processing', color: 'blue' },
    ],
  },
];

const COLOR_LABELS: Record<BadgeColor, string> = {
  green: 'Green',
  red: 'Red',
  blue: 'Blue',
  gray: 'Gray',
  white: 'White',
};

function StatusTable({ entries }: { entries: StatusEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        <thead>
          <tr>
            <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-r last:border-r-0 border-[var(--color-border-subtle)]">
              Status
            </th>
            <th className="text-left text-label-md font-medium px-3 py-2.5 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-subtle)] w-[80px]">
              Color
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={i}>
              <td className="p-2 border-t border-r border-[var(--color-border-subtle)]">
                <Badge theme={entry.color} type="subtle" size="sm">
                  {entry.status}
                </Badge>
              </td>
              <td className="p-2 border-t border-[var(--color-border-subtle)] text-body-sm">
                {COLOR_LABELS[entry.color]}
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

export function ContainerStatusPage() {
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
              Container — 리소스 상태 정의
            </h2>
            <p className="text-body-lg text-[var(--color-text-muted)] max-w-[720px]">
              Container 앱의 각 리소스별 상태 목록. Kubernetes API 상태값을 Badge 컴포넌트로
              표시한다.
            </p>
          </div>
          {formattedDate && (
            <span className="text-body-sm text-[var(--color-text-subtle)] shrink-0">
              Updated {formattedDate}
            </span>
          )}
        </div>

        <HStack gap={3} align="center" className="pb-4">
          <img src={AppIconContainer} alt="" className="size-6 object-contain" />
          <span className="text-heading-h5 text-[var(--color-text-default)]">Container</span>
        </HStack>

        <p className="text-body-md text-[var(--color-text-muted)] pb-8">
          테이블에서 Badge를 사용할 경우, Badge의 최대 너비는{' '}
          <code className="font-mono text-body-sm bg-[var(--color-surface-muted)] px-1 py-0.5 rounded-[var(--radius-sm)]">
            80px
          </code>
          로 제한한다.
        </p>

        <VStack gap={8} align="stretch">
          {CONTAINER_RESOURCES.map((section) => (
            <ResourceStatusSection key={section.resource} section={section} />
          ))}
        </VStack>

        <VStack gap={3} align="stretch" className="pt-10">
          <p className="text-body-md text-[var(--color-text-muted)]">
            Container 앱은 StatusIndicator 대신 Badge 컴포넌트로 상태를 표시한다. Kubernetes API가
            제공하는 status.phase 또는 condition 값을 우선 표시하며, 사전 정의되지 않은 상태값은
            White Badge로 표시한다.
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
