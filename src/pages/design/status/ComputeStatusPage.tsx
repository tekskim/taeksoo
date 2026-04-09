import { StatusIndicator, VStack, HStack } from '@/design-system';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import AppIconCompute from '@/assets/appIcon/compute.png';

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

const COMPUTE_RESOURCES: ResourceSection[] = [
  {
    resource: 'VM 인스턴스',
    entries: [
      { status: 'active', tooltip: 'Running', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'shutoff', tooltip: 'Stopped', icon: 'IconPower', color: 'Gray' },
      { status: 'paused', tooltip: 'Paused', icon: 'IconPlayerPause', color: 'Gray' },
      { status: 'suspended', tooltip: 'Suspended', icon: 'IconCircleMinus', color: 'Gray' },
      {
        status: 'shelved-offloaded',
        tooltip: 'Shelved(Offloaded)',
        icon: 'IconPlugConnectedX',
        color: 'Gray',
      },
      {
        status: 'verify-resized',
        tooltip: 'Verify resized',
        icon: 'circle-dashed-check',
        color: 'Orange',
      },
      { status: 'error', tooltip: 'Rescued', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Unknown', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Building', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Rebuilding', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Starting', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Stopping', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Rebooting', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Pausing', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Suspending', icon: 'IconLoader (spin)', color: 'Blue' },
      {
        status: 'building',
        tooltip: 'Resizing or Migrating',
        icon: 'IconLoader (spin)',
        color: 'Blue',
      },
      { status: 'building', tooltip: 'Shelving', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '인스턴스 스냅샷',
    entries: [
      { status: 'active', tooltip: 'Active', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'deactivated', tooltip: 'Deactivated', icon: 'IconLivePhotoOff', color: 'Gray' },
      { status: 'building', tooltip: 'Queued', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Saving', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '이미지',
    entries: [
      { status: 'active', tooltip: 'Active', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'deactivated', tooltip: 'Deactivated', icon: 'IconLivePhotoOff', color: 'Gray' },
      { status: 'building', tooltip: 'Queued', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Saving', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Importing', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '볼륨',
    entries: [
      { status: 'active', tooltip: 'Available', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'in-use', tooltip: 'In Use', icon: 'IconInUse', color: 'Gray' },
      { status: 'maintenance', tooltip: 'Maintenance', icon: 'IconTool', color: 'Orange' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Error (Deleting)', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Error (Backup)', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Error (Restoring)', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Error (Extending)', icon: 'IconAlertTriangle', color: 'Red' },
      {
        status: 'building',
        tooltip: 'Awaiting Transfer',
        icon: 'IconLoader (spin)',
        color: 'Blue',
      },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Backing Up', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Restoring Backup', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Attaching', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Detaching', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Downloading', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Uploading', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Changing Type', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Extending', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '볼륨 스냅샷',
    entries: [
      { status: 'active', tooltip: 'Available', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'in-use', tooltip: 'In Use', icon: 'IconInUse', color: 'Gray' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Error (Deleting)', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Backing Up', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Restoring', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '볼륨 백업',
    entries: [
      { status: 'active', tooltip: 'Available', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'in-use', tooltip: 'In Use', icon: 'IconInUse', color: 'Gray' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Error (Deleting)', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Restoring', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '네트워크',
    entries: [
      { status: 'active', tooltip: 'Active', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'down', tooltip: 'Down', icon: 'circle-x', color: 'Gray' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Building', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '라우터',
    entries: [
      { status: 'active', tooltip: 'Active', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
    ],
  },
  {
    resource: '포트',
    entries: [
      { status: 'active', tooltip: 'Active', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'down', tooltip: 'Down', icon: 'circle-x', color: 'Gray' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Building', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '플로팅 IP',
    entries: [
      { status: 'active', tooltip: 'Available', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'in-use', tooltip: 'In Use', icon: 'IconInUse', color: 'Gray' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
    ],
  },
  {
    resource: '로드 밸런서',
    entries: [
      { status: 'active', tooltip: 'Online', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'degraded', tooltip: 'Degraded', icon: 'IconAlertHexagon', color: 'Orange' },
      { status: 'error', tooltip: 'Offline', icon: 'IconAlertTriangle', color: 'Red' },
      {
        status: 'no-monitor',
        tooltip: 'No Monitor',
        icon: 'IconShieldExclamation',
        color: 'Orange',
      },
      { status: 'error', tooltip: 'Provisioning Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Operating Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Draining', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Updating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '리스너',
    entries: [
      { status: 'active', tooltip: 'Online', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'degraded', tooltip: 'Degraded', icon: 'IconAlertHexagon', color: 'Orange' },
      { status: 'error', tooltip: 'Offline', icon: 'IconAlertTriangle', color: 'Red' },
      {
        status: 'no-monitor',
        tooltip: 'No Monitor',
        icon: 'IconShieldExclamation',
        color: 'Orange',
      },
      { status: 'error', tooltip: 'Provisioning Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Operating Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Draining', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Updating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: 'L7 정책',
    entries: [
      { status: 'active', tooltip: 'Online', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'degraded', tooltip: 'Degraded', icon: 'IconAlertHexagon', color: 'Orange' },
      { status: 'error', tooltip: 'Offline', icon: 'IconAlertTriangle', color: 'Red' },
      {
        status: 'no-monitor',
        tooltip: 'No Monitor',
        icon: 'IconShieldExclamation',
        color: 'Orange',
      },
      { status: 'error', tooltip: 'Provisioning Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Operating Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Draining', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Updating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '풀',
    entries: [
      { status: 'active', tooltip: 'Online', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'degraded', tooltip: 'Degraded', icon: 'IconAlertHexagon', color: 'Orange' },
      { status: 'error', tooltip: 'Offline', icon: 'IconAlertTriangle', color: 'Red' },
      {
        status: 'no-monitor',
        tooltip: 'No Monitor',
        icon: 'IconShieldExclamation',
        color: 'Orange',
      },
      { status: 'error', tooltip: 'Provisioning Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Operating Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Draining', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Updating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '멤버',
    entries: [
      { status: 'active', tooltip: 'Online', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'degraded', tooltip: 'Degraded', icon: 'IconAlertHexagon', color: 'Orange' },
      { status: 'error', tooltip: 'Offline', icon: 'IconAlertTriangle', color: 'Red' },
      {
        status: 'no-monitor',
        tooltip: 'No Monitor',
        icon: 'IconShieldExclamation',
        color: 'Orange',
      },
      { status: 'error', tooltip: 'Provisioning Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Operating Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Draining', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Updating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '헬스 모니터',
    entries: [
      { status: 'active', tooltip: 'Online', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'degraded', tooltip: 'Degraded', icon: 'IconAlertHexagon', color: 'Orange' },
      { status: 'error', tooltip: 'Offline', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Provisioning Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'error', tooltip: 'Operating Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Draining', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Updating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '방화벽 (정책)',
    entries: [
      { status: 'active', tooltip: 'Active', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'down', tooltip: 'Inactive', icon: 'circle-x', color: 'Gray' },
      { status: 'down', tooltip: 'Created', icon: 'circle-x', color: 'Gray' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Updating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
  {
    resource: '방화벽 (규칙)',
    entries: [
      { status: 'active', tooltip: 'Active', icon: 'IconLivePhoto', color: 'Green' },
      { status: 'down', tooltip: 'Down', icon: 'circle-x', color: 'Gray' },
      { status: 'down', tooltip: 'Inactive', icon: 'circle-x', color: 'Gray' },
      { status: 'down', tooltip: 'Created', icon: 'circle-x', color: 'Gray' },
      { status: 'error', tooltip: 'Error', icon: 'IconAlertTriangle', color: 'Red' },
      { status: 'building', tooltip: 'Creating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'building', tooltip: 'Updating', icon: 'IconLoader (spin)', color: 'Blue' },
      { status: 'deleting', tooltip: 'Deleting', icon: 'IconLoader (spin)', color: 'Blue' },
    ],
  },
];

function StatusTable({ entries }: { entries: StatusEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        <thead>
          <tr>
            <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] w-[80px]">
              Status
            </th>
            <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
              Tooltip
            </th>
            <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
              Icon
            </th>
            <th className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] w-[80px]">
              Color
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={i}>
              <td className="p-2 border border-[var(--color-border-default)] text-center">
                <StatusIndicator status={entry.status as never} layout="icon-only" />
              </td>
              <td className="p-2 border border-[var(--color-border-default)]">
                <code className="text-body-sm font-mono bg-[var(--color-surface-muted)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                  {entry.tooltip}
                </code>
              </td>
              <td className="p-2 border border-[var(--color-border-default)]">
                <code className="text-body-sm font-mono bg-[var(--color-surface-muted)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                  {entry.icon}
                </code>
              </td>
              <td className="p-2 border border-[var(--color-border-default)] text-body-sm">
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

export function ComputeStatusPage() {
  return (
    <ComponentPageTemplate
      title="Compute — 리소스 상태 정의"
      description="Compute 앱의 각 리소스별 Defined 상태 목록. 각 상태에 사용되는 StatusIndicator, tooltip 텍스트, 아이콘을 정의한다."
      preview={
        <HStack gap={3} align="center">
          <img src={AppIconCompute} alt="" className="size-6 object-contain" />
          <span className="text-heading-h5 text-[var(--color-text-default)]">Compute</span>
        </HStack>
      }
      examples={
        <VStack gap={8}>
          {COMPUTE_RESOURCES.map((section, i) => (
            <div key={section.resource}>
              {i > 0 && <div className="w-full h-px bg-[var(--color-border-subtle)] mb-8" />}
              <ResourceStatusSection section={section} />
            </div>
          ))}
        </VStack>
      }
      guidelines={
        <VStack gap={3}>
          <Label>참고</Label>
          <p className="text-body-md text-[var(--color-text-muted)]">
            이 문서는 Notion 기획 문서 &quot;리소스 상태 및 액션 정리&quot;를 기반으로
            작성되었습니다. 상태 추가/변경 시 Notion 문서를 먼저 업데이트한 후 이 페이지에
            반영하세요.
          </p>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Status Indicator',
          path: '/design/components/status-indicator',
          description: '상태 컴포넌트',
        },
        { label: 'Badge', path: '/design/components/badge', description: 'Default 상태 표시' },
      ]}
    />
  );
}
