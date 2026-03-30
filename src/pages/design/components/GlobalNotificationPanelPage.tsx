import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack, Button, Badge, Tabs, TabList, Tab } from '@/design-system';
import {
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
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

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface PanelNotification {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  project?: string;
  app: string;
  appIcon: string;
  isRead?: boolean;
  detail?: { code?: string | number; message?: string };
}

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  success: <IconCircleCheck size={16} stroke={1.5} className="text-[var(--color-state-success)]" />,
  error: <IconAlertTriangle size={16} stroke={1.5} className="text-[var(--color-state-danger)]" />,
  warning: <IconAlertCircle size={16} stroke={1.5} className="text-[var(--color-state-warning)]" />,
  info: <IconInfoCircle size={16} stroke={1.5} className="text-[var(--color-state-info)]" />,
};

/* ----------------------------------------
   StaticSnackbarCard
   ---------------------------------------- */

function StaticSnackbarCard({
  type,
  message,
  time,
  project,
  isRead = true,
  showAppIcon = false,
  appIcon,
  detail,
  isExpanded,
}: {
  type: NotificationType;
  message: string;
  time: string;
  project?: string;
  isRead?: boolean;
  showAppIcon?: boolean;
  appIcon?: string;
  detail?: { code?: string | number; message?: string };
  isExpanded?: boolean;
}) {
  const hasDetail = detail && (detail.code || detail.message);

  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--color-border-default)] overflow-hidden ${
        !isRead ? 'bg-[var(--color-surface-subtle)]' : 'bg-[var(--color-surface-default)]'
      }`}
    >
      <div className="flex gap-2 p-3">
        <div className="shrink-0 pt-0.5">{TYPE_ICONS[type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-start">
            <div className="flex-1 min-w-0 flex flex-col items-start gap-2">
              <p className="text-body-md text-[var(--color-text-muted)]">{message}</p>
              {project && (
                <Badge theme="white" size="sm">
                  {project}
                </Badge>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <div className="size-6 flex items-center justify-center">
                {!isRead && (
                  <div className="size-2 rounded-full bg-[var(--color-action-primary)]" />
                )}
              </div>
              <span className="text-body-sm text-[var(--color-text-muted)] whitespace-nowrap">
                {time}
              </span>
              {showAppIcon && appIcon && (
                <img
                  src={appIcon}
                  alt="App icon"
                  className="size-5 object-cover pointer-events-none"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {hasDetail && (
        <>
          <div className="border-t border-[var(--color-border-subtle)]">
            <button
              type="button"
              className="flex items-center justify-end gap-1.5 w-full px-3 pt-[9px] pb-2"
            >
              <span className="text-label-sm text-[var(--color-text-muted)]">View detail</span>
              {isExpanded ? (
                <IconChevronUp size={12} stroke={1.5} className="text-[var(--color-text-muted)]" />
              ) : (
                <IconChevronDown
                  size={12}
                  stroke={1.5}
                  className="text-[var(--color-text-muted)]"
                />
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="px-3 pb-3">
              <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] flex flex-col gap-1">
                {detail.code && (
                  <p className="text-label-md text-[var(--color-text-default)]">
                    code: {detail.code}
                  </p>
                )}
                {detail.message && (
                  <p className="text-body-md text-[var(--color-text-muted)]">{detail.message}</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ----------------------------------------
   GlobalPanelPreview (static)
   ---------------------------------------- */

function GlobalPanelPreview() {
  return (
    <div className="flex justify-center p-6 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
      <div className="w-[360px] bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] shadow-lg overflow-hidden">
        {/* Tabs header */}
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
              <Tab value="error">
                Error
                <span className="ml-1 text-[var(--color-text-muted)]">(1)</span>
              </Tab>
            </TabList>
          </Tabs>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2 drawer-scroll">
          <div className="flex flex-col gap-2">
            <StaticSnackbarCard
              type="success"
              message='Instance "web-server-01" created successfully.'
              time="10:23"
              project="Proj-1"
              isRead={false}
              showAppIcon
              appIcon={AppIconCompute}
            />
            <StaticSnackbarCard
              type="error"
              message='Failed to create volume "data-vol-02".'
              time="09:30"
              project="Proj-2"
              isRead={false}
              showAppIcon
              appIcon={AppIconCompute}
              detail={{
                code: 400,
                message:
                  "Flavor's disk is smaller than the minimum size specified in image metadata.",
              }}
            />
            <StaticSnackbarCard
              type="warning"
              message="API key expires in 3 days."
              time="08:45"
              isRead={false}
              showAppIcon
              appIcon={AppIconIAM}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   GlobalPanelDemo (interactive)
   ---------------------------------------- */

const INITIAL_NOTIFICATIONS: PanelNotification[] = [
  {
    id: '1',
    type: 'success',
    message: 'Instance "web-server-01" created successfully.',
    time: '10:23',
    project: 'Proj-1',
    app: 'Compute',
    appIcon: AppIconCompute,
    isRead: false,
    detail: { code: 200, message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.' },
  },
  {
    id: '2',
    type: 'error',
    message: 'Failed to create volume "data-vol-02".',
    time: '09:30',
    project: 'Proj-2',
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
    type: 'success',
    message: 'Volume "backup-01" snapshot completed.',
    time: '10:10',
    project: 'Proj-1',
    app: 'Compute',
    appIcon: AppIconCompute,
    isRead: true,
  },
  {
    id: '4',
    type: 'warning',
    message: 'API key expires in 3 days.',
    time: '08:45',
    app: 'IAM',
    appIcon: AppIconIAM,
    isRead: false,
  },
  {
    id: '5',
    type: 'info',
    message: 'New policy "ReadOnly" attached to group.',
    time: '08:30',
    project: 'Proj-1',
    app: 'IAM',
    appIcon: AppIconIAM,
    isRead: true,
  },
  {
    id: '6',
    type: 'error',
    message: 'Pod "api-gateway" CrashLoopBackOff.',
    time: '09:55',
    project: 'default',
    app: 'Container',
    appIcon: AppIconContainer,
    isRead: false,
    detail: { code: 'ERR_CRASH_LOOP', message: 'Container exited with code 137 (OOMKilled).' },
  },
];

function GlobalPanelDemo() {
  const [notifications, setNotifications] = useState<PanelNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'error') return n.type === 'error';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const errorCount = notifications.filter((n) => n.type === 'error').length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleReset = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('all');
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
                <Tab value="error">
                  Error
                  {errorCount > 0 && (
                    <span className="ml-1 text-[var(--color-text-muted)]">({errorCount})</span>
                  )}
                </Tab>
              </TabList>
            </Tabs>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-[100px] text-[var(--color-text-muted)] text-body-md">
              No notifications
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto p-2 drawer-scroll">
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
      className={`rounded-[var(--radius-lg)] border border-[var(--color-border-default)] overflow-hidden ${
        !notification.isRead
          ? 'bg-[var(--color-surface-subtle)]'
          : 'bg-[var(--color-surface-default)]'
      }`}
    >
      <div
        onClick={() => {
          if (!notification.isRead) onMarkAsRead();
        }}
        className="flex gap-3 p-3 cursor-pointer"
      >
        <div className="shrink-0 pt-0.5">{TYPE_ICONS[notification.type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-body-md text-[var(--color-text-default)] mb-2 pr-6">
            {notification.message}
          </p>
          {notification.project && (
            <Badge theme="white" size="sm">
              {notification.project}
            </Badge>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <div className="size-6 flex items-center justify-center">
            {!notification.isRead && (
              <div className="size-2 rounded-full bg-[var(--color-action-primary)]" />
            )}
          </div>
          <span className="text-body-sm text-[var(--color-text-muted)] whitespace-nowrap">
            {notification.time}
          </span>
          <img
            src={notification.appIcon}
            alt="App icon"
            className="size-5 object-cover pointer-events-none"
          />
        </div>
      </div>

      {hasDetail && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center justify-end gap-1 w-full px-3 py-2 text-body-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] border-t border-[var(--color-border-subtle)] transition-colors"
          >
            <span>View detail</span>
            {isExpanded ? (
              <IconChevronUp size={14} stroke={1.5} />
            ) : (
              <IconChevronDown size={14} stroke={1.5} />
            )}
          </button>

          {isExpanded && (
            <div className="px-3 pb-3">
              <div className="p-3 bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] flex flex-col gap-1">
                {notification.detail?.code && (
                  <p className="text-label-md text-[var(--color-text-default)]">
                    code: {notification.detail.code}
                  </p>
                )}
                {notification.detail?.message && (
                  <p className="text-body-md text-[var(--color-text-muted)]">
                    {notification.detail.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
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
      <span className="text-label-md text-[var(--color-text-default)]">Notification types</span>
      <p className="text-body-sm text-[var(--color-text-subtle)]">
        Each notification card uses a type icon to indicate the notification category. When
        displayed in the global panel, app icons identify which application generated the
        notification.
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-[760px]">
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Success</span>
          <StaticSnackbarCard
            type="success"
            message='Instance "web-server-01" created successfully.'
            time="10:23"
            project="Proj-1"
            isRead={false}
            showAppIcon
            appIcon={AppIconCompute}
          />
        </VStack>
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Error</span>
          <StaticSnackbarCard
            type="error"
            message='Failed to create volume "data-vol-02".'
            time="09:30"
            project="Proj-2"
            isRead={false}
            showAppIcon
            appIcon={AppIconStorage}
          />
        </VStack>
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Warning</span>
          <StaticSnackbarCard
            type="warning"
            message="API key expires in 3 days."
            time="08:45"
            isRead={false}
            showAppIcon
            appIcon={AppIconIAM}
          />
        </VStack>
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Info</span>
          <StaticSnackbarCard
            type="info"
            message='Pod "api-gateway" scaling to 3 replicas.'
            time="08:30"
            project="default"
            isRead={false}
            showAppIcon
            appIcon={AppIconContainer}
          />
        </VStack>
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   SnackbarCardStates
   ---------------------------------------- */

function SnackbarCardStates() {
  return (
    <VStack gap={3}>
      <span className="text-label-md text-[var(--color-text-default)]">
        Notification card states
      </span>
      <p className="text-body-sm text-[var(--color-text-subtle)]">
        All six visual states of a notification card: read/unread, with/without detail disclosure,
        and disclosure open.
      </p>
      <div className="grid grid-cols-2 gap-6 max-w-[760px]">
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Read (app icon)</span>
          <StaticSnackbarCard
            type="success"
            message='Instance "web-server-01" created successfully.'
            time="10:23"
            project="Proj-1"
            isRead
            showAppIcon
            appIcon={AppIconCompute}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Unread (app icon)</span>
          <StaticSnackbarCard
            type="success"
            message='Volume "data-vol-01" attached to instance.'
            time="10:15"
            project="Proj-1"
            isRead={false}
            showAppIcon
            appIcon={AppIconCompute}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Read + Detail (collapsed)
          </span>
          <StaticSnackbarCard
            type="warning"
            message='Instance "db-server" is running low on disk space.'
            time="09:15"
            project="Proj-1"
            isRead
            showAppIcon
            appIcon={AppIconCompute}
            detail={{ code: 'WARN_DISK_LOW', message: 'Disk usage is at 92%.' }}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Unread + Detail (collapsed)
          </span>
          <StaticSnackbarCard
            type="error"
            message='Failed to create volume "data-vol-02".'
            time="09:30"
            project="Proj-2"
            isRead={false}
            showAppIcon
            appIcon={AppIconStorage}
            detail={{
              code: 400,
              message:
                "Flavor's disk is smaller than the minimum size specified in image metadata.",
            }}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Read + Detail (expanded)
          </span>
          <StaticSnackbarCard
            type="success"
            message='Instance "web-server-01" created successfully.'
            time="10:23"
            project="Proj-1"
            isRead
            showAppIcon
            appIcon={AppIconCompute}
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
            }}
            isExpanded
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Unread + Detail (expanded)
          </span>
          <StaticSnackbarCard
            type="error"
            message='Failed to create volume "data-vol-02".'
            time="09:30"
            project="Proj-2"
            isRead={false}
            showAppIcon
            appIcon={AppIconStorage}
            detail={{
              code: 400,
              message:
                "Flavor's disk is smaller than the minimum size specified in image metadata.",
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
          <SnackbarCardStates />
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
        { label: 'Notification Center', path: '/design/components/notification-center' },
        { label: 'Error & Alert', path: '/design/policies/error-alert' },
        { label: 'Desktop UI', path: '/design/patterns/desktop-grid' },
      ]}
    />
  );
}
