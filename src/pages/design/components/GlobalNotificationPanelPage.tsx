import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack, Button, Tabs, TabList, Tab, Select } from '@/design-system';
import {
  IconCircleCheck,
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
  partition?: string;
  app: string;
  appIcon: string;
  isRead?: boolean;
  detail?: { code?: string | number; message?: string };
  href?: string;
}

/* ----------------------------------------
   StaticPanelCard
   ---------------------------------------- */

function StaticPanelCard({
  appIcon,
  message,
  statusIcon,
  time,
  partition,
  isRead = true,
  showReadButton,
  detail,
  isExpanded,
}: {
  appIcon?: string;
  message: string;
  statusIcon?: React.ReactNode;
  time: string;
  partition?: string;
  isRead?: boolean;
  showReadButton?: boolean;
  detail?: { code?: string | number; message?: string };
  isExpanded?: boolean;
}) {
  const hasDetail = detail && (detail.code || detail.message);
  const isUnread = !isRead;

  return (
    <div className="relative rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col py-3">
      <div className="flex items-start justify-between px-3">
        <div className="flex gap-2 items-start w-[256px]">
          {appIcon && <img src={appIcon} alt="" className="size-5 shrink-0 object-contain" />}
          <div className="flex flex-col gap-2 flex-1 min-w-[1px]">
            <div className="flex flex-col">
              <span className="text-body-md text-[var(--color-text-default)]">
                {message}
                {statusIcon && (
                  <span className="inline-flex items-center align-[-2px] ml-1 gap-1">
                    {statusIcon}
                  </span>
                )}
              </span>
            </div>

            {partition && (
              <span className="text-body-xs text-[var(--color-text-subtle)]">{partition}</span>
            )}

            {hasDetail && (
              <div className="flex flex-col gap-2 rounded-[var(--radius-sm)]">
                <button type="button" className="group flex items-center gap-1">
                  <span className="text-body-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)] whitespace-nowrap">
                    View detail
                  </span>
                  {isExpanded ? (
                    <IconChevronUp
                      size={12}
                      stroke={1.5}
                      className="text-[var(--color-text-subtle)]"
                    />
                  ) : (
                    <IconChevronDown
                      size={12}
                      stroke={1.5}
                      className="text-[var(--color-text-subtle)]"
                    />
                  )}
                </button>

                {isExpanded && (
                  <>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="flex flex-col gap-1 text-body-sm text-[var(--color-text-muted)]">
                      {detail.code !== undefined && <p>code: {detail.code}</p>}
                      {detail.message && <p>{detail.message}</p>}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-end self-stretch shrink-0">
          <span className="text-body-xs text-[var(--color-text-subtle)] whitespace-nowrap">
            {time}
          </span>
        </div>
      </div>

      {isUnread && !showReadButton && (
        <div className="absolute top-3 right-3 size-1.5 rounded-full bg-[var(--color-action-primary)]" />
      )}

      {showReadButton && (
        <button
          type="button"
          className="absolute top-[6px] right-[8px] size-4 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] transition-colors"
        >
          <IconCheckbox size={12} stroke={1.5} />
        </button>
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
        <div className="w-[346px] bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] shadow-lg">
          <div className="relative pt-3 pb-0 rounded-t-lg overflow-hidden">
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

          <div className="px-3 py-2">
            <div className="flex flex-col gap-2">
              <StaticPanelCard
                appIcon={AppIconCompute}
                message={`Volume "backup-01" snapshot\nsuccessfully created`}
                statusIcon={successIcon}
                time="10:23"
                partition="proj-1"
                isRead={false}
              />
              <StaticPanelCard
                appIcon={AppIconCompute}
                message={`Volume "backup-01" create failed.`}
                statusIcon={errorIcon}
                time="09:30"
                partition="proj-2"
                isRead={false}
                detail={{
                  code: 400,
                  message:
                    "Flavor's disk is smaller than the minimum size specified in image metadata.",
                }}
              />
              <StaticPanelCard
                appIcon={AppIconContainer}
                message={`Deployment "api-gateway" scaled to 3 replicas.`}
                statusIcon={infoIcon}
                time="08:45"
                partition="default"
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

const successIcon = (
  <IconCircleCheck size={14} stroke={1.5} className="text-[var(--color-state-success)]" />
);
const errorIcon = (
  <IconAlertTriangle size={14} stroke={1.5} className="text-[var(--color-state-danger)]" />
);
const infoIcon = (
  <IconInfoCircle size={14} stroke={1.5} className="text-[var(--color-state-info)]" />
);

const INITIAL_NOTIFICATIONS: PanelNotification[] = [
  {
    id: '1',
    message: 'Volume "backup-01" snapshot\nsuccessfully created',
    statusIcon: successIcon,
    time: '10:23',
    partition: 'proj-1',
    app: 'Compute',
    appIcon: AppIconCompute,
    isRead: false,
    href: '/compute/volumes',
  },
  {
    id: '2',
    message: 'Volume "data-vol-02" create failed.',
    statusIcon: errorIcon,
    time: '09:30',
    partition: 'proj-2',
    app: 'Compute',
    appIcon: AppIconCompute,
    isRead: false,
    href: '/compute/volumes',
    detail: {
      code: 400,
      message: "Flavor's disk is smaller than the minimum size specified in image metadata.",
    },
  },
  {
    id: '3',
    message: 'API key "prod-key-01" has been rotated.',
    statusIcon: infoIcon,
    time: '10:10',
    partition: 'proj-1',
    app: 'IAM',
    appIcon: AppIconIAM,
    isRead: false,
    href: '/iam/api-keys',
  },
  {
    id: '4',
    message: 'Deployment "api-gateway" scaled to 3 replicas.',
    statusIcon: infoIcon,
    time: '08:45',
    partition: 'default',
    app: 'Container',
    appIcon: AppIconContainer,
    isRead: true,
    href: '/container/deployments',
  },
  {
    id: '5',
    message: 'Instance "web-01" snapshot done.',
    statusIcon: successIcon,
    time: '08:30',
    partition: 'proj-1',
    app: 'Compute',
    appIcon: AppIconCompute,
    isRead: true,
    href: '/compute/instances',
  },
  {
    id: '6',
    message: 'Pod "api-gateway" crash loop.',
    statusIcon: errorIcon,
    time: '09:55',
    partition: 'default',
    app: 'Container',
    appIcon: AppIconContainer,
    isRead: false,
    href: '/container/pods',
    detail: { code: 'ERR_CRASH_LOOP', message: 'Container exited with code 137 (OOMKilled).' },
  },
  {
    id: '7',
    message: 'Storage pool "pool-01" health check passed.',
    statusIcon: successIcon,
    time: '08:15',
    partition: 'proj-1',
    app: 'Storage',
    appIcon: AppIconStorage,
    isRead: true,
    href: '/storage/pools',
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
        <div className="w-[346px] bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] shadow-lg">
          {/* Tabs header */}
          <div className="relative pt-3 pb-0 rounded-t-lg overflow-hidden">
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
            <div className="max-h-[420px] overflow-y-auto px-3 py-2 mr-[-6px] rounded-b-lg notification-scroll">
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
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasDetail =
    notification.detail && (notification.detail.code || notification.detail.message);
  const isUnread = !notification.isRead;

  const handleBodyClick = () => {
    if (notification.href) {
      navigate(notification.href);
    }
  };

  return (
    <div
      className="relative rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col py-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-start justify-between px-3${notification.href ? ' cursor-pointer' : ''}`}
        onClick={handleBodyClick}
      >
        <div className="flex gap-2 items-start w-[256px]">
          <img src={notification.appIcon} alt="" className="size-5 shrink-0 object-contain" />
          <div className="flex flex-col gap-2 flex-1 min-w-[1px]">
            <div className="flex flex-col">
              <span className="text-body-md text-[var(--color-text-default)]">
                {notification.message}
                {notification.statusIcon && (
                  <span className="inline-flex items-center align-[-2px] ml-1 gap-1">
                    {notification.statusIcon}
                  </span>
                )}
              </span>
            </div>

            {notification.partition && (
              <span className="text-body-xs text-[var(--color-text-subtle)]">
                {notification.partition}
              </span>
            )}

            {hasDetail && (
              <div
                className="flex flex-col gap-2 rounded-[var(--radius-sm)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group flex items-center gap-1"
                >
                  <span className="text-body-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)] whitespace-nowrap">
                    View detail
                  </span>
                  {isExpanded ? (
                    <IconChevronUp
                      size={12}
                      stroke={1.5}
                      className="text-[var(--color-text-subtle)]"
                    />
                  ) : (
                    <IconChevronDown
                      size={12}
                      stroke={1.5}
                      className="text-[var(--color-text-subtle)]"
                    />
                  )}
                </button>

                {isExpanded && (
                  <>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="flex flex-col gap-1 text-body-sm text-[var(--color-text-muted)]">
                      {notification.detail?.code !== undefined && (
                        <p>code: {notification.detail.code}</p>
                      )}
                      {notification.detail?.message && <p>{notification.detail.message}</p>}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-end self-stretch shrink-0">
          <span className="text-body-xs text-[var(--color-text-subtle)] whitespace-nowrap">
            {notification.time}
          </span>
        </div>
      </div>

      {isUnread && !isHovered && (
        <div className="absolute top-3 right-3 size-1.5 rounded-full bg-[var(--color-action-primary)]" />
      )}

      {isUnread && isHovered && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead();
          }}
          className="absolute top-[6px] right-[8px] size-4 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] transition-colors"
        >
          <IconCheckbox size={12} stroke={1.5} />
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------
   PanelCardStates
   ---------------------------------------- */

function PanelCardStates() {
  const PARTITION = 'ultra-resilient-cloud-native-infrastructure-management-platform';

  return (
    <VStack gap={3}>
      <span className="text-label-md text-[var(--color-text-default)]">
        Notification card states
      </span>
      <p className="text-body-sm text-[var(--color-text-subtle)]">
        10 visual states of a notification card: info / success / error types, read/unread, hover
        mark-as-read, detail collapsed/expanded.
      </p>
      <div className="grid grid-cols-[320px_320px] gap-6">
        {/* Row 1: Info */}
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Info — Default</span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Deployment "api-gateway" scaled to 3 replicas.`}
            statusIcon={infoIcon}
            time="10:33"
            partition={PARTITION}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Info — Unread</span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Deployment "api-gateway" scaled to 3 replicas.`}
            statusIcon={infoIcon}
            time="10:33"
            partition={PARTITION}
            isRead={false}
          />
        </VStack>

        {/* Row 2: Info hover */}
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Info — Hover (mark as read)
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Deployment "api-gateway" scaled to 3 replicas.`}
            statusIcon={infoIcon}
            time="10:33"
            partition={PARTITION}
            isRead={false}
            showReadButton
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Success — Default</span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" snapshot\nsuccessfully created`}
            statusIcon={successIcon}
            time="10:33"
            partition={PARTITION}
          />
        </VStack>

        {/* Row 3: Success */}
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Success — Read</span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" snapshot\nsuccessfully created`}
            statusIcon={successIcon}
            time="10:33"
            partition={PARTITION}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Success — Unread (hover)
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" snapshot\nsuccessfully created`}
            statusIcon={successIcon}
            time="10:33"
            partition={PARTITION}
            isRead={false}
            showReadButton
          />
        </VStack>

        {/* Row 4: Failed */}
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Failed — Detail closed (unread)
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" create failed.`}
            statusIcon={errorIcon}
            time="10:33"
            partition={PARTITION}
            isRead={false}
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
            }}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Failed — Detail closed (read)
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" create failed.`}
            statusIcon={errorIcon}
            time="10:33"
            partition={PARTITION}
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
            }}
          />
        </VStack>

        {/* Row 5: Failed hover + expanded */}
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Failed — Hover (mark as read)
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" create failed.`}
            statusIcon={errorIcon}
            time="10:33"
            partition={PARTITION}
            isRead={false}
            showReadButton
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
            }}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Failed — Detail expanded
          </span>
          <StaticPanelCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" create failed.`}
            statusIcon={errorIcon}
            time="10:33"
            partition={PARTITION}
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

앱 내부 알림센터는 **해당 앱에서 발생한 모든 기록형 알림의 원본 저장소**이다.

따라서 사용자가 Snackbar를 놓치거나 과거 알림을 확인하려는 경우 **알림센터를 통해 확인할 수 있다.**

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Notification icon | 알림센터 열기 |
| Unread badge | 안읽은 알림 표시 |
| Tabs | 알림 필터 |
| Mark all as read | 전체 읽음 처리 |
| Notification list | 알림 목록 |
| Notification item | 개별 알림 |

### 1) Notification Icon

- 알림센터 진입 아이콘이다.
- 동작
  - 클릭 시 알림센터 열림
  - 안읽은 알림이 있을 경우 **badge 표시**

### 2) Tabs

- 알림 필터 기능 제공한다.
  - All(모든 알림)
  - Unread(읽지 않은 알림)
- 정렬은 최신순이다. (가장 최근에 온 알림이 최상단)

### 3) Mark all as read

- 모든 알림을 읽음 처리한다.
- 동작
  - 현재 알림센터에 표시된 알림을 읽음 처리
  - Badge 제거
- 호버 시 툴팁이 노출된다. "Mark all as read"

### 4) Notification Item

- **알림센터의 개별 알림은 전역 패널의 개별 알림과 동일하다.**
- 개별 알림은 스낵바와 유사한 구조를 가진다.
- 구성 요소

| 요소 | 설명 |
| --- | --- |
| Type icon | 알림 유형 |
| Message | 알림 내용 |
| Timestamp | 발생 시각 |
| Partition info | tenant / cluster 등 |
| Read button | 개별 읽음 처리 |
| View details | 실패 상세 정보 |

---

## Behavior

### 1) 기록 규칙

- 스낵바 알림은 항상 알림 센터에 기록된다.
- 토스트, 인라인, Validation 메시지는 알림센터에 기록되지 않는다.

### 2) 스낵바 관계

- 스낵바로 노출되는 메시지는 모두 알림센터에 기록된다.
- 스낵바에서 동작에 따라 알림센터에서 읽음 처리에 영향을 준다.

| 행동 | 읽음 처리 |
| --- | --- |
| Snackbar 클릭 | ✔ |
| Snackbar 닫기 | ✖ |
| Snackbar 자동 종료 | ✖ |
| View details | ✖ |

### 3) Global Notification Panel

- Global Panel은 **안읽은 알림 집계 뷰**이다.

| 특성 | 설명 |
| --- | --- |
| 데이터 | 모든 앱의 안읽은 알림 |
| 정렬 | 최신순 |
| 필터 | 없음 |

- 알림 센터와 실시간 동기화 된다.

| 행동 | 결과 |
| --- | --- |
| 알림 클릭 | 리소스 이동 + 읽음 |
| 개별 읽음 | 알림 제거 |
| 전체 읽음 | 목록 초기화 |

### 4) Snackbar Suppression Rule

- 앱 내의 알림센터 또는 글로벌 알림 패널이 열려 있을 경우 스낵바가 노출되지 않는다.

| 상황 | 동작 |
| --- | --- |
| Notification Center 열림 | Snackbar 억제 |
| Global Panel 열림 | Snackbar 억제 |

- 이 경우 알림은 스낵바 노출 없이 바로 알림센터와 글로벌 알림 패널 목록에 기록된다.

### 5) 읽음 처리 기준

- 알림 메시지가 읽음 처리가 되는 기준은 다음과 같다.

| 행동 | 읽음 |
| --- | --- |
| Snackbar 클릭 | ✔ |
| Notification item 클릭 | ✔ |
| Read button | ✔ |
| Mark all as read | ✔ |

- 읽음 처리 후에는 해당 알림 메시지가 글로벌 알림 패널에서 제거된다.
- 모두 읽음 처리가 되었을 경우 알림센터와 글로벌 알림 패널의 아이콘에 Badge가 제거된다.

### 6) 알림 보관 정책

- 알림은 사용자가 삭제할 수 없다.
- 알림은 30일 보관 이후 자동으로 삭제된다.

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
      description="해당 앱에서 발생한 모든 기록형 알림의 원본 저장소. Snackbar를 놓치거나 과거 알림을 확인할 때 알림센터를 통해 확인할 수 있다."
      whenToUse={[
        '해당 앱에서 발생한 알림 기록을 확인해야 하는 경우',
        '오류 상세 정보 또는 작업 결과를 확인해야 하는 경우',
      ]}
      whenNotToUse={[
        '단순 UI 피드백 (→ Toast)',
        '지속 경고 메시지 (→ Inline)',
        '사용자 확인이 필요한 작업 (→ Modal)',
        '모든 앱의 알림을 한 번에 확인 (→ Global notification panel)',
      ]}
      preview={<GlobalPanelPreview />}
      examples={
        <VStack gap={8}>
          <GlobalPanelDemo />
          <PanelCardStates />
        </VStack>
      }
      guidelines={
        <>
          <DosDonts
            doItems={[
              '모든 기록형 알림을 알림센터에 저장한다',
              '실패 알림은 상세 정보 제공',
              '안읽은 알림을 명확히 표시한다',
            ]}
            dontItems={[
              'Toast를 기록형 알림으로 사용하지 않는다',
              '사용자가 알림을 삭제하도록 하지 않는다',
              '기록형 알림을 자동으로 숨기지 않는다',
            ]}
          />
          <NotionRenderer markdown={GLOBAL_NOTIFICATION_PANEL_GUIDELINES} />
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
