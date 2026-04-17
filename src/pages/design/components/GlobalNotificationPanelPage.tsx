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
        <div className="w-[346px] bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] shadow-lg overflow-hidden">
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
                <Tab value="unread">Unread (3)</Tab>
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
                message='Instance "web-01" created.'
                statusIcon={successIcon}
                time="10:23"
                project="proj-1"
                isRead={false}
              />
              <StaticPanelCard
                appIcon={AppIconCompute}
                message='Volume "data-vol-02" create failed.'
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
    message: 'Instance "web-01" created.',
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
    message: 'Volume "data-vol-02" create failed.',
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
    message: 'Volume "backup-01" snapshot done.',
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
    message: 'Policy "ReadOnly" attached.',
    statusIcon: successIcon,
    time: '08:30',
    project: 'proj-1',
    app: 'IAM',
    appIcon: AppIconIAM,
    isRead: true,
  },
  {
    id: '6',
    message: 'Pod "api-gateway" crash loop.',
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
        <div className="w-[346px] bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] shadow-lg overflow-hidden">
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
                <Tab value="unread">Unread{unreadCount > 0 && ` (${unreadCount})`}</Tab>
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
      <div className="grid grid-cols-[320px_320px] gap-4">
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Compute</span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message='Instance "web-01" created.'
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
            message='Volume "data-vol-02" create failed.'
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
            message='Pod "api-gw" scaling to 3 replicas.'
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
      <div className="grid grid-cols-[320px_320px] gap-6">
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Read — Simple</span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message='Volume "backup-01" created.'
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
            message='Volume "backup-01" created.'
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
            message='Volume "backup-01" snapshot done.'
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
            message='Volume "backup-01" snapshot done.'
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
앱 내부 **알림센터**는 해당 앱에서 발생한 **모든 기록형 알림의 원본 저장소**이다. 사용자가 Snackbar를 놓치거나 과거 알림을 확인하려면 알림센터에서 확인한다.

**전역 알림 패널**은 **모든 앱의 안읽은(Unread) 기록형 알림**을 한곳에서 모아 보여 주는 데스크톱 수준 보조 뷰이다. 알림의 영구 저장소가 아니라 **unread 상태** 알림을 모아 보여 주는 보조 인터페이스이며, 앱 알림센터·스낵바 흐름과 **실시간으로 동기화**된다.

---

## Composition

### 앱 알림센터 (In-app notification center)

| 요소 | 설명 |
| --- | --- |
| Notification icon | 알림센터 열기 |
| Unread badge | 안읽은 알림 표시 |
| Tabs | 알림 필터 (All, Unread, Error 등) |
| Mark all as read | 전체 읽음 처리 |
| Notification list | 알림 목록 |
| Notification item | 개별 알림 |

#### Notification icon
- 알림센터 진입 아이콘. 클릭 시 알림센터가 열린다.
- 안읽은 알림이 있으면 badge를 표시한다.

#### Tabs
- All(모든 알림), Unread(읽지 않은 알림), Error(실패 알림) 등 필터를 제공한다.
- 정렬은 **최신순**(가장 최근 알림이 최상단)이다.

#### Mark all as read
- 현재 알림센터에 표시된 알림을 읽음 처리하고 badge를 제거한다.
- 호버 시 툴팁: "Mark all as read"

#### Notification item
- **전역 패널의 개별 알림과 동일한 구조**를 가진다. 스낵바와 유사한 구성이다.

| 요소 | 설명 |
| --- | --- |
| Type icon | 알림 유형 |
| Message | 알림 내용 |
| Timestamp | 발생 시각 |
| Partition info | tenant / cluster 등 |
| Read button | 개별 읽음 처리 |
| View details | 실패 상세 정보 |

### 전역 알림 패널 (Global notification panel)

| 요소 | 설명 |
| --- | --- |
| Panel Icon | 패널 열기/닫기 · Unread badge |
| Panel | 알림 목록 컨테이너 |
| App Filter | 앱별 알림 필터링 (Select) |
| App Header | 앱별 그룹 헤더(해당 제품 UI에 따라) |
| Show more / Show less | 알림 목록 확장 |
| Mark all as read | 전체 읽음 처리 |
| Notification Item | 개별 알림 카드 |

- **Panel**: 모든 앱의 안읽은 알림을 표시하고, 데스크톱 레벨 고정 위치에 둔다.
- **App Filter**: 알림이 존재하는 앱만 옵션으로 노출할 수 있다. "All apps" 선택 시 전체 앱 알림, 특정 앱 선택 시 해당 앱만 필터링한다.
- **Mark all as read**: 클릭 시 현재 표시 알림을 읽음 처리하고 패널에서 제거한다.

---

## Behavior

### 1) 기록 규칙 (앱 알림센터)
- 스낵바로 노출되는 메시지는 **항상 알림센터에 기록**된다.
- Toast, Inline, Validation 메시지는 알림센터에 기록하지 않는다.

### 2) 스낵바와의 관계
- 스낵바 메시지는 모두 알림센터에 기록된다.
- 스낵바에서의 동작이 알림센터 읽음 처리에 영향을 준다.

| 행동 | 읽음 처리 |
| --- | --- |
| Snackbar 클릭 | ✔ |
| Snackbar 닫기 | ✖ |
| Snackbar 자동 종료 | ✖ |
| View details | ✖ |

### 3) Global Notification Panel 특성

| 특성 | 설명 |
| --- | --- |
| 데이터 | 모든 앱의 안읽은 알림 |
| 정렬 | 최신순 |
| 필터 | 정책에 따라 없음 또는 앱 필터 등 |

알림센터와 **실시간 동기화**된다.

| 행동 | 결과 |
| --- | --- |
| 알림 클릭 | 리소스 이동 + 읽음 |
| 개별 읽음 | 알림 제거(패널에서) |
| 전체 읽음 | 목록 초기화 |

### 4) Snackbar suppression rule
앱 내 알림센터 또는 글로벌 알림 패널이 열려 있으면 스낵바는 노출하지 않는다. 이 경우 알림은 스낵바 없이 알림센터·글로벌 패널 목록에 바로 기록된다.

| 상황 | 동작 |
| --- | --- |
| Notification Center 열림 | Snackbar 억제 |
| Global Panel 열림 | Snackbar 억제 |

### 5) 읽음 처리 기준
| 행동 | 읽음 |
| --- | --- |
| Snackbar 클릭 | ✔ |
| Notification item 클릭 | ✔ |
| Read button | ✔ |
| Mark all as read | ✔ |

- 읽음 처리 후 해당 메시지는 **글로벌 알림 패널에서 제거**된다.
- 모두 읽음 처리되면 알림센터·글로벌 패널 아이콘의 badge가 제거된다.

### 6) 알림 보관 정책
- 사용자가 알림을 삭제할 수 없다.
- **30일** 보관 후 자동 삭제된다.

### 7) 전역 패널 · 실시간 동작
- 패널이 열린 상태에서 새 알림은 상단에 실시간 추가된다.
- 이 상태에서는 Snackbar를 표시하지 않는다.
- 카드 본문 클릭 시 리소스 이동·읽음·패널 닫힘 등은 제품 정책에 따른다. View details는 읽음 처리에 포함하지 않을 수 있다.

---

## Related

| 이름 | 유형 | 이유 |
| --- | --- | --- |
| Snackbar | Component | 기록형 알림 |
| Toast | Component | 단발성 피드백 |
| Inline Message | Component | 지속 경고 |
| Modal | Component | 사용자 확인 |
| Global Notification Panel | Pattern | 안읽은 알림 집계 |
| Error & Alert | Foundation | 알림 유형 정의 |
`;

/* ----------------------------------------
   Page
   ---------------------------------------- */

export function GlobalNotificationPanelPage() {
  return (
    <ComponentPageTemplate
      title="Global notification panel"
      description="앱 알림센터는 해당 앱의 기록형 알림 원본 저장소이고, 전역 알림 패널은 모든 앱의 안읽은 알림을 한곳에서 보는 보조 뷰이다. 두 UI는 스낵바·읽음 상태와 실시간으로 동기화된다."
      whenToUse={[
        '해당 앱에서 발생한 알림 기록을 확인해야 할 때 (앱 알림센터)',
        '오류 상세·작업 결과를 기록형 알림으로 확인해야 할 때 (앱 알림센터)',
        '여러 앱의 안읽은 알림을 한곳에서 빠르게 확인해야 할 때 (전역 알림 패널)',
        'Snackbar를 놓쳤거나 과거 알림을 다시 확인해야 할 때',
      ]}
      whenNotToUse={[
        '단순 UI 피드백 (→ Toast)',
        '지속 경고 메시지 (→ Inline Message)',
        '사용자 확인이 필요한 작업 (→ Modal)',
        '기록 없이 일시적인 피드백만 필요한 경우',
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
              '모든 기록형 알림을 앱 알림센터에 저장한다',
              '실패 알림은 상세 정보를 제공한다',
              '안읽은 알림을 명확히 표시한다',
              '전역 패널에서는 unread 집계를 빠르게 파악할 수 있게 한다',
              '최신 알림을 상단에 둔다',
            ]}
            dontItems={[
              'Toast를 기록형 알림으로 사용하지 않는다',
              '사용자가 알림을 삭제하도록 하지 않는다',
              '기록형 알림을 임의로 자동 숨기지 않는다',
              '전역 패널을 영구 저장소처럼 쌓아 두지 않는다',
            ]}
          />
        </>
      }
      relatedLinks={[
        { label: 'Snackbar', path: '/design/components/snackbar' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Error & Alert', path: '/design/policies/error-alert' },
      ]}
    />
  );
}
