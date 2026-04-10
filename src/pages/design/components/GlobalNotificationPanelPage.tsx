import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack, Button, Tabs, TabList, Tab, Select } from '@/design-system';
import {
  IconCircleCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconChevronUp,
  IconChevronDown,
  IconCheckbox,
  IconRefresh,
} from '@tabler/icons-react';
import AppIconCompute from '@/assets/appIcon/compute.png';
import AppIconIAM from '@/assets/appIcon/iam.png';
import AppIconContainer from '@/assets/appIcon/container.png';
import AppIconStorage from '@/assets/appIcon/storage.png';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface PanelNotification {
  id: string;
  message: string;
  statusIcon?: React.ReactNode;
  time: string;
  project?: string;
  app: string;
  appIcon: string;
  isRead?: boolean;
  detail?: { code?: string | number; message?: string };
}

const successIcon = (
  <IconCircleCheck size={14} stroke={1.5} className="text-[var(--color-state-success)]" />
);
const errorIcon = (
  <IconAlertTriangle size={14} stroke={1.5} className="text-[var(--color-state-danger)]" />
);
const warningIcon = (
  <IconAlertCircle size={14} stroke={1.5} className="text-[var(--color-state-warning)]" />
);
const infoIcon = (
  <IconInfoCircle size={14} stroke={1.5} className="text-[var(--color-state-info)]" />
);

/* ----------------------------------------
   StaticPanelCard
   ---------------------------------------- */

function StaticPanelCard({
  appIcon,
  message,
  statusIcon,
  time,
  project,
  isRead = true,
  detail,
  isExpanded,
}: {
  appIcon?: string;
  message: string;
  statusIcon?: React.ReactNode;
  time: string;
  project?: string;
  isRead?: boolean;
  detail?: { code?: string | number; message?: string };
  isExpanded?: boolean;
}) {
  const hasDetail = detail && (detail.code || detail.message);

  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--color-border-default)] flex flex-col gap-4 p-3 ${
        !isRead ? 'bg-[var(--color-surface-subtle)]' : 'bg-[var(--color-surface-default)]'
      }`}
    >
      <div className="flex gap-2 items-start">
        {appIcon && <img src={appIcon} alt="" className="size-5 shrink-0 object-contain" />}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <span className="text-body-md text-[var(--color-text-default)]">
            {message}
            {statusIcon && <span className="inline-flex align-[-2px] ml-1">{statusIcon}</span>}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-body-xs text-[var(--color-text-muted)] whitespace-nowrap">
              {time}
            </span>
            {project && (
              <>
                <div className="w-px h-[10px] bg-[var(--color-border-default)]" />
                <span className="text-body-xs text-[var(--color-text-muted)] whitespace-nowrap">
                  {project}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {hasDetail && (
        <div className="flex flex-col gap-2">
          <button type="button" className="flex items-center justify-end gap-1.5 w-full">
            <span className="text-body-sm font-medium text-[var(--color-text-muted)]">
              View detail
            </span>
            {isExpanded ? (
              <IconChevronUp size={12} className="text-[var(--color-text-muted)]" />
            ) : (
              <IconChevronDown size={12} className="text-[var(--color-text-muted)]" />
            )}
          </button>

          {isExpanded && (
            <div
              className={`p-3 rounded-[var(--radius-md)] flex flex-col gap-1 ${
                !isRead ? 'bg-[var(--color-surface-default)]' : 'bg-[var(--color-surface-subtle)]'
              }`}
            >
              {detail.code !== undefined && (
                <p className="text-label-sm text-[var(--color-text-default)]">
                  code: {detail.code}
                </p>
              )}
              {detail.message && (
                <p className="text-body-sm text-[var(--color-text-muted)]">{detail.message}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   GlobalPanelPreview (static)
   ---------------------------------------- */

function GlobalPanelPreview() {
  return (
    <VStack gap={4}>
      <div className="flex justify-center p-6 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
        <div className="w-[360px] bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] shadow-lg overflow-hidden">
          <div className="relative pt-3 pb-0">
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-7 rounded-md text-[var(--color-text-muted)]"
              aria-label="Mark all as read"
            >
              <IconCheckbox size={16} stroke={1.5} />
            </button>
            <Tabs value="all" onChange={() => {}} variant="underline" size="sm" className="w-full">
              <TabList className="w-full px-4">
                <Tab value="all">All</Tab>
                <Tab value="unread">
                  Unread
                  <span className="ml-1 text-[var(--color-text-muted)]">(3)</span>
                </Tab>
              </TabList>
            </Tabs>
          </div>

          <div className="px-3 py-2 border-b border-[var(--color-border-subtle)]">
            <Select options={APP_OPTIONS} value="all" onChange={() => {}} size="md" fullWidth />
          </div>

          <div className="max-h-[400px] overflow-y-auto px-3 py-2 drawer-scroll">
            <div className="flex flex-col gap-2">
              <StaticPanelCard
                appIcon={AppIconCompute}
                message='Instance "web-server-01" created successfully.'
                statusIcon={successIcon}
                time="10:23"
                project="proj-1"
                isRead={false}
              />
              <StaticPanelCard
                appIcon={AppIconCompute}
                message='Failed to create volume "data-vol-02".'
                statusIcon={errorIcon}
                time="09:30"
                project="proj-2"
                isRead={false}
                detail={{
                  code: 400,
                  message:
                    "Flavor's disk is smaller than the minimum size specified in image metadata.",
                }}
              />
              <StaticPanelCard
                appIcon={AppIconIAM}
                message="API key expires in 3 days."
                statusIcon={warningIcon}
                time="08:45"
                isRead={false}
              />
            </div>
          </div>
        </div>
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   GlobalPanelDemo (interactive)
   ---------------------------------------- */

const INITIAL_NOTIFICATIONS: PanelNotification[] = [
  {
    id: '1',
    message: 'Instance "web-server-01" created successfully.',
    statusIcon: successIcon,
    time: '10:23',
    project: 'proj-1',
    app: 'Compute',
    appIcon: AppIconCompute,
    isRead: false,
    detail: { code: 200, message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.' },
  },
  {
    id: '2',
    message: 'Failed to create volume "data-vol-02".',
    statusIcon: errorIcon,
    time: '09:30',
    project: 'proj-2',
    app: 'Compute',
    appIcon: AppIconCompute,
    isRead: false,
    detail: {
      code: 400,
      message: "Flavor's disk is smaller than the minimum size specified in image metadata.",
    },
  },
  {
    id: '3',
    message: 'Volume "backup-01" snapshot completed.',
    statusIcon: successIcon,
    time: '10:10',
    project: 'proj-1',
    app: 'Compute',
    appIcon: AppIconCompute,
    isRead: true,
  },
  {
    id: '4',
    message: 'API key expires in 3 days.',
    statusIcon: warningIcon,
    time: '08:45',
    app: 'IAM',
    appIcon: AppIconIAM,
    isRead: false,
  },
  {
    id: '5',
    message: 'New policy "ReadOnly" attached to group.',
    statusIcon: successIcon,
    time: '08:30',
    project: 'proj-1',
    app: 'IAM',
    appIcon: AppIconIAM,
    isRead: true,
  },
  {
    id: '6',
    message: 'Pod "api-gateway" CrashLoopBackOff.',
    statusIcon: errorIcon,
    time: '09:55',
    project: 'default',
    app: 'Container',
    appIcon: AppIconContainer,
    isRead: false,
    detail: { code: 'ERR_CRASH_LOOP', message: 'Container exited with code 137 (OOMKilled).' },
  },
];

const appIcon = (src: string) => <img src={src} alt="" className="size-4 object-cover" />;

const APP_OPTIONS = [
  { value: 'all', label: 'All apps' },
  { value: 'Compute', label: 'Compute', icon: appIcon(AppIconCompute) },
  { value: 'IAM', label: 'IAM', icon: appIcon(AppIconIAM) },
  { value: 'Container', label: 'Container', icon: appIcon(AppIconContainer) },
  { value: 'Storage', label: 'Storage', icon: appIcon(AppIconStorage) },
];

function GlobalPanelDemo() {
  const [notifications, setNotifications] = useState<PanelNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');
  const [activeApp, setActiveApp] = useState('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread' && n.isRead) return false;
    if (activeApp !== 'all' && n.app !== activeApp) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const availableAppOptions = APP_OPTIONS.filter(
    (opt) => opt.value === 'all' || notifications.some((n) => n.app === opt.value)
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleReset = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('all');
    setActiveApp('all');
  };

  return (
    <VStack gap={3}>
      <div className="flex items-center justify-between">
        <span className="text-label-md text-[var(--color-text-default)]">Live demo</span>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleReset}
          leftIcon={<IconRefresh size={12} />}
        >
          Reset
        </Button>
      </div>
      <div className="flex justify-center p-6 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
        <div className="w-[360px] bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] shadow-lg overflow-hidden">
          {/* Tabs header */}
          <div className="relative pt-3 pb-0">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-7 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-default)] transition-colors group"
              aria-label="Mark all as read"
            >
              <IconCheckbox size={16} stroke={1.5} />
              <span className="absolute top-full right-0 mt-1 px-2 py-1 bg-[var(--color-text-default)] text-[var(--color-surface-default)] text-body-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Mark all as read
              </span>
            </button>

            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              variant="underline"
              size="sm"
              className="w-full"
            >
              <TabList className="w-full px-4">
                <Tab value="all">All</Tab>
                <Tab value="unread">
                  Unread
                  {unreadCount > 0 && (
                    <span className="ml-1 text-[var(--color-text-muted)]">({unreadCount})</span>
                  )}
                </Tab>
              </TabList>
            </Tabs>
          </div>

          {/* App Filter */}
          <div className="px-3 py-2 border-b border-[var(--color-border-subtle)]">
            <Select
              options={availableAppOptions}
              value={activeApp}
              onChange={(v) => setActiveApp(v)}
              size="md"
              fullWidth
            />
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-[100px] text-[var(--color-text-muted)] text-body-md">
              No notifications
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto px-3 py-2 drawer-scroll">
              <div className="flex flex-col gap-2">
                {filteredNotifications.map((n) => (
                  <InteractiveNotificationCard
                    key={n.id}
                    notification={n}
                    onMarkAsRead={() => handleMarkAsRead(n.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </VStack>
  );
}

function InteractiveNotificationCard({
  notification,
  onMarkAsRead,
}: {
  notification: PanelNotification;
  onMarkAsRead: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetail =
    notification.detail && (notification.detail.code || notification.detail.message);

  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--color-border-default)] flex flex-col gap-4 p-3 ${
        !notification.isRead
          ? 'bg-[var(--color-surface-subtle)]'
          : 'bg-[var(--color-surface-default)]'
      }`}
    >
      <div
        onClick={() => {
          if (!notification.isRead) onMarkAsRead();
        }}
        className="flex gap-2 items-start cursor-pointer"
      >
        <img src={notification.appIcon} alt="" className="size-5 shrink-0 object-contain" />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <span className="text-body-md text-[var(--color-text-default)]">
            {notification.message}
            {notification.statusIcon && (
              <span className="inline-flex align-[-2px] ml-1">{notification.statusIcon}</span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-body-xs text-[var(--color-text-muted)] whitespace-nowrap">
              {notification.time}
            </span>
            {notification.project && (
              <>
                <div className="w-px h-[10px] bg-[var(--color-border-default)]" />
                <span className="text-body-xs text-[var(--color-text-muted)] whitespace-nowrap">
                  {notification.project}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {hasDetail && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center justify-end gap-1.5 w-full"
          >
            <span className="text-body-sm font-medium text-[var(--color-text-muted)]">
              View detail
            </span>
            {isExpanded ? (
              <IconChevronUp size={12} className="text-[var(--color-text-muted)]" />
            ) : (
              <IconChevronDown size={12} className="text-[var(--color-text-muted)]" />
            )}
          </button>

          {isExpanded && (
            <div
              className={`p-3 rounded-[var(--radius-md)] flex flex-col gap-1 ${
                !notification.isRead
                  ? 'bg-[var(--color-surface-default)]'
                  : 'bg-[var(--color-surface-subtle)]'
              }`}
            >
              {notification.detail?.code !== undefined && (
                <p className="text-label-sm text-[var(--color-text-default)]">
                  code: {notification.detail.code}
                </p>
              )}
              {notification.detail?.message && (
                <p className="text-body-sm text-[var(--color-text-muted)]">
                  {notification.detail.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   NotificationTypeCards
   ---------------------------------------- */

function NotificationTypeCards() {
  return (
    <VStack gap={3}>
      <span className="text-label-md text-[var(--color-text-default)]">
        Notification card examples
      </span>
      <p className="text-body-sm text-[var(--color-text-subtle)]">
        App icons identify which application generated the notification. Status icons appear inline
        after the message text when relevant (e.g. success check).
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-[760px]">
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Compute</span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message='Instance "web-server-01" created successfully.'
            statusIcon={successIcon}
            time="10:23"
            project="proj-1"
            isRead={false}
          />
        </VStack>
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Storage</span>
          <StaticPanelCard
            appIcon={AppIconStorage}
            message='Failed to create volume "data-vol-02".'
            statusIcon={errorIcon}
            time="09:30"
            project="proj-2"
            isRead={false}
          />
        </VStack>
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">IAM</span>
          <StaticPanelCard
            appIcon={AppIconIAM}
            message="API key expires in 3 days."
            statusIcon={warningIcon}
            time="08:45"
            isRead={false}
          />
        </VStack>
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Container</span>
          <StaticPanelCard
            appIcon={AppIconContainer}
            message='Pod "api-gateway" scaling to 3 replicas.'
            statusIcon={infoIcon}
            time="08:30"
            project="default"
            isRead={false}
          />
        </VStack>
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   PanelCardStates
   ---------------------------------------- */

function PanelCardStates() {
  return (
    <VStack gap={3}>
      <span className="text-label-md text-[var(--color-text-default)]">
        Notification card states
      </span>
      <p className="text-body-sm text-[var(--color-text-subtle)]">
        All six visual states of a notification card: read/unread, with/without detail disclosure,
        and disclosure expanded.
      </p>
      <div className="grid grid-cols-2 gap-6 max-w-[760px]">
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Read — Simple</span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message='Volume "backup-01" '
            statusIcon={successIcon}
            time="10:33"
            project="proj-1"
            isRead
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Unread — Simple</span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message='Volume "backup-01" '
            statusIcon={successIcon}
            time="10:33"
            project="proj-1"
            isRead={false}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Read — With detail (collapsed)
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message='Instance "web-server-01-primary-production-environment-east-region-zone-a-application-stack-v3-deployment-id-20260409-alpha-omega-charli-0123456789" created successfully completed.'
            statusIcon={successIcon}
            time="10:33"
            project="proj-1"
            isRead
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
            }}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Unread — With detail (collapsed)
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message='Instance "web-server-01-primary-production-environment-east-region-zone-a-application-stack-v3-deployment-id-20260409-alpha-omega-charli-0123456789" created successfully completed.'
            statusIcon={successIcon}
            time="10:33"
            project="proj-1"
            isRead={false}
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
            }}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Read — With detail (expanded)
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message='Volume "backup-01" snapshot completed.'
            statusIcon={successIcon}
            time="10:33"
            project="proj-1"
            isRead
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
            }}
            isExpanded
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Unread — With detail (expanded)
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message='Volume "backup-01" snapshot completed.'
            statusIcon={successIcon}
            time="10:33"
            project="proj-1"
            isRead={false}
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
            }}
            isExpanded
          />
        </VStack>
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   Guidelines
   ---------------------------------------- */

const GLOBAL_NOTIFICATION_PANEL_GUIDELINES = `## Overview
전역 알림 패널은 모든 앱의 '안읽은(Unread)' 기록형 알림을 한곳에서 모아 보여주는 데스크탑 레벨 보조 뷰이다.
알림의 저장소가 아니라 unread 상태의 알림을 모아 보여주는 보조 인터페이스이다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Panel Icon | 패널 열기/닫기 |
| Panel | 알림 목록 컨테이너 |
| App Filter | 앱별 알림 필터링 |
| App Header | 앱별 그룹 헤더 |
| Show more / Show less | 알림 목록 확장 |
| Mark all as read | 전체 읽음 처리 |
| Notification Item | 개별 알림 카드 |
| Unread Badge | 안읽은 알림 수 표시 |

### Panel Icon
- 전역 패널 열기/닫기 트리거
- Unread badge와 함께 표시

### Panel
- 모든 앱의 안읽은 알림을 앱별 그룹으로 표시
- 데스크탑 레벨 고정 위치

### App Filter
- 탭 아래에 위치하는 Select 드롭다운
- 알림이 존재하는 앱만 옵션으로 노출
- "All apps" 선택 시 전체 앱 알림 표시
- 특정 앱 선택 시 해당 앱의 알림만 필터링

### App Header
- 알림이 존재하는 앱만 노출
- 앱 아이콘, 앱 이름, Show more/less 버튼, Mark all as read 버튼

### Show more / Show less
- 알림이 1개 이상일 때 표시
- Show more 클릭 시 해당 앱 알림 전체 표시
- Show less 클릭 시 최신 알림 1개만 노출

### Mark all as read
- 해당 앱의 모든 알림 읽음 처리
- 클릭 시 패널에서 즉시 제거

### Notification Item
- 알림센터의 개별 알림과 동일한 구조

| 구성요소 | 설명 |
| --- | --- |
| Type icon | 알림 유형 (success/error/warning/info) |
| Message | 알림 메시지 |
| Timestamp | 발생 시각 |
| Partition info | 프로젝트/네임스페이스 등 |
| Read button | 읽음 처리 |
| View details | 상세 메시지 확장 |

---

## Behavior

### 1) Snackbar suppression rule

| 조건 | 스낵바 동작 |
| --- | --- |
| 알림센터 열림 | 노출 안 됨 |
| 글로벌 패널 열림 | 노출 안 됨 |

### 2) 알림 센터 실시간 동기화

| 이벤트 | 패널 동작 |
| --- | --- |
| 새 알림 발생 | 패널 상단 추가 |
| 알림 읽음 처리 | 패널에서 제거 |
| 알림 만료 | 패널에서 제거 |

### 3) 인터랙션 규칙
- 카드 본문 클릭 → 리소스 화면 이동 + 읽음 처리 + 패널 닫힘
- 개별 읽음 버튼 → 해당 알림 읽음 + 패널에서 제거
- 전체 읽음 버튼 → 현재 표시 알림 읽음 + 패널에서 제거
- View details 버튼 → 상세 메시지 확장, 읽음 처리 안됨

### 4) Real-time Behavior
- 패널이 열린 상태에서 새 알림은 상단에 실시간 추가
- Snackbar는 표시되지 않는다

### 5) 표시 규칙
- 안읽은 알림이 하나 이상 존재할 때만 표시
- 읽음 처리 또는 보관 기간(30일) 만료 시 제거

---

## Related

| 이름 | 유형 | 이유 |
| --- | --- | --- |
| Snackbar | Component | 기록형 알림 |
| Toast | Component | 단발성 피드백 |
| Notification Center | Component | 알림 원본 저장소 |
| Error & Alert | Foundation | 알림 유형 정의 |
| Desktop UI | Pattern | 전역 패널 위치 |
`;

/* ----------------------------------------
   Page
   ---------------------------------------- */

export function GlobalNotificationPanelPage() {
  return (
    <ComponentPageTemplate
      title="Global notification panel"
      description="전역 알림 패널은 모든 앱의 '안읽은(Unread)' 기록형 알림을 한곳에서 모아 보여주는 데스크탑 레벨 보조 뷰. 알림의 저장소가 아니라 unread 상태의 알림을 모아 보여주는 보조 인터페이스."
      whenToUse={[
        '여러 앱에서 발생한 안읽은 알림을 한곳에서 확인해야 하는 경우',
        '사용자가 현재 어떤 앱을 보고 있는지와 관계없이 새로운 알림을 빠르게 확인해야 하는 경우',
        'Snackbar를 놓친 경우',
      ]}
      whenNotToUse={[
        '단순 UI 피드백 (→ Toast)',
        '지속 경고 메시지 (→ Inline)',
        '사용자 확인이 필요한 작업 (→ Modal)',
        '특정 앱의 알림 기록을 상세히 확인 (→ Notification Center)',
      ]}
      preview={<GlobalPanelPreview />}
      examples={
        <VStack gap={8}>
          <GlobalPanelDemo />
          <NotificationTypeCards />
          <PanelCardStates />
        </VStack>
      }
      guidelines={
        <>
          <NotionRenderer markdown={GLOBAL_NOTIFICATION_PANEL_GUIDELINES} />
          <DosDonts
            doItems={[
              '안읽은 알림을 빠르게 확인할 수 있도록 사용한다',
              '알림을 앱별로 그룹화한다',
              '최신 알림을 상단에 표시한다',
            ]}
            dontItems={[
              '전역 패널을 알림 저장소로 사용하지 않는다',
              'Toast를 전역 패널에 표시하지 않는다',
              '읽은 알림을 표시하지 않는다',
            ]}
          />
        </>
      }
      relatedLinks={[
        { label: 'Snackbar', path: '/design/components/snackbar' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Error & Alert', path: '/design/policies/error-alert' },
        { label: 'Desktop UI', path: '/design/patterns/desktop-grid' },
      ]}
    />
  );
}
