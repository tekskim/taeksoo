import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Button, NotificationCenter, VStack } from '@/design-system';
import type { NotificationItem } from '@/design-system';
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconRefresh,
} from '@tabler/icons-react';

const NOTIFICATION_CENTER_GUIDELINES = `## Overview
앱 내부 알림센터는 해당 앱에서 발생한 모든 기록형 알림의 원본 저장소이다. 사용자가 Snackbar를 놓치거나 과거 알림을 확인하려는 경우 알림센터를 통해 확인할 수 있다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Notification icon | 알림센터 열기 |
| Unread badge | 안읽은 알림 표시 |
| Tabs | 알림 필터 (All/Unread/Error) |
| Mark all as read | 전체 읽음 처리 |
| Notification list | 알림 목록 |
| Notification item | 개별 알림 |

### Notification Icon
- 알림센터 열기/닫기 트리거
- Unread badge와 함께 표시

### Tabs
- All: 모든 알림, Unread: 읽지 않은 알림, Error: 실패 알림
- 정렬은 최신순

### Mark all as read
- 현재 알림센터에 표시된 알림을 읽음 처리
- Badge 제거, 호버 시 툴팁 "Mark all as read"

### Notification Item
- 전역 패널의 개별 알림과 동일한 구조

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

### 1) 기록 규칙
- 스낵바 알림은 항상 알림 센터에 기록된다.
- 토스트, 인라인, Validation은 기록되지 않는다.

### 2) 스낵바 관계

| 사용자 행동 | 읽음 처리 |
| --- | --- |
| Snackbar 클릭 | 읽음 |
| Snackbar 닫기/자동 종료/View details | 안읽음 유지 |

- 스낵바로 노출되는 메세지는 모두 알림센터에 기록된다.

### 3) Global Notification Panel
- 모든 앱의 안읽은 알림 집계 뷰, 최신순 정렬
- 알림 센터와 실시간 동기화

| 이벤트 | 패널 동작 |
| --- | --- |
| 새 알림 발생 | 패널 상단 추가 |
| 알림 읽음 처리 | 패널에서 제거 |
| 알림 만료 | 패널에서 제거 |

### 4) Snackbar Suppression Rule

| 조건 | 스낵바 동작 |
| --- | --- |
| 알림센터 열림 | 노출 안 됨 |
| 글로벌 패널 열림 | 노출 안 됨 |

### 5) 읽음 처리 기준

| 행동 | 결과 |
| --- | --- |
| Snackbar 클릭 | 읽음 처리 |
| Notification item 클릭 | 읽음 처리 |
| Read button | 읽음 처리 |
| Mark all as read | 전체 읽음 처리 |
| 읽음 처리 후 | 글로벌 알림 패널에서 제거 |

### 6) 알림 보관 정책
- 알림은 사용자가 삭제할 수 없다.
- 30일 보관 후 자동 삭제.

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

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'success',
    message: 'Instance "web-server-01" created successfully.',
    time: '10:23',
    project: 'Proj1',
    isRead: false,
    detail: { code: 200, message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.' },
  },
  {
    id: '2',
    type: 'success',
    message: 'Volume "data-vol-01" attached to instance.',
    time: '10:15',
    project: 'Proj1',
    isRead: false,
  },
  {
    id: '3',
    type: 'error',
    message: 'Failed to create volume "data-vol-02".',
    time: '09:30',
    project: 'Proj2',
    isRead: false,
    detail: {
      code: 400,
      message: "Flavor's disk is smaller than the minimum size specified in image metadata.",
    },
  },
  {
    id: '4',
    type: 'warning',
    message: 'Instance "db-server" is running low on disk space.',
    time: '09:15',
    project: 'Proj1',
    isRead: true,
    detail: { code: 'WARN_DISK_LOW', message: 'Disk usage is at 92%.' },
  },
  {
    id: '5',
    type: 'info',
    message: 'System maintenance scheduled for tomorrow.',
    time: 'Yesterday',
    isRead: true,
  },
];

export function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleReset = () => {
    setNotifications(initialNotifications);
    setSelectedId(undefined);
  };

  return (
    <ComponentPageTemplate
      title="Notification center"
      description="앱 내부 알림센터는 해당 앱에서 발생한 모든 기록형 알림의 원본 저장소. 사용자가 Snackbar를 놓치거나 과거 알림을 확인하려는 경우 알림센터를 통해 확인할 수 있다."
      whenToUse={[
        '해당 앱에서 발생한 알림 기록을 확인해야 하는 경우',
        '오류 상세 정보 또는 작업 결과를 확인해야 하는 경우',
      ]}
      whenNotToUse={[
        '단순 UI 피드백 (→ Toast)',
        '지속 경고 메세지 (→ Inline)',
        '사용자 확인이 필요한 작업 (→ Modal)',
        '모든 앱의 알림을 한 번에 확인 (→ Global notification panel)',
      ]}
      preview={
        <div className="flex justify-center p-6 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onNotificationClick={(n) => setSelectedId(n.id)}
            selectedId={selectedId}
          />
        </div>
      }
      examples={
        <VStack gap={8}>
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
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onNotificationClick={(n) => setSelectedId(n.id)}
                selectedId={selectedId}
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Notification types
            </span>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                    <IconCheck
                      size={10}
                      stroke={2}
                      className="text-[var(--semantic-color-on-primary)]"
                    />
                  </div>
                  <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
                    Success
                  </span>
                </div>
                <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                  Operation completed
                </p>
              </div>
              <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-state-danger)] flex items-center justify-center">
                    <IconX
                      size={10}
                      stroke={2}
                      className="text-[var(--semantic-color-on-primary)]"
                    />
                  </div>
                  <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
                    Error
                  </span>
                </div>
                <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                  Operation failed
                </p>
              </div>
              <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-state-warning)] flex items-center justify-center">
                    <IconAlertTriangle
                      size={10}
                      stroke={2}
                      className="text-[var(--semantic-color-on-primary)]"
                    />
                  </div>
                  <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
                    Warning
                  </span>
                </div>
                <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                  Attention needed
                </p>
              </div>
              <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-state-info)] flex items-center justify-center">
                    <IconInfoCircle
                      size={10}
                      stroke={2}
                      className="text-[var(--semantic-color-on-primary)]"
                    />
                  </div>
                  <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
                    Info
                  </span>
                </div>
                <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                  General information
                </p>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <>
          <NotionRenderer markdown={NOTIFICATION_CENTER_GUIDELINES} />
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
        </>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>width: 360px</code> · <code>padding: 16px</code> · <code>border-radius: 8px</code> ·{' '}
          <code>shadow: lg</code>
        </div>
      }
      relatedLinks={[
        { label: 'Snackbar', path: '/design/components/snackbar' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Modal', path: '/design/components/modal' },
        {
          label: 'Global Notification Panel',
          path: '/design/components/global-notification-panel',
        },
        { label: 'Error & Alert', path: '/design/foundation/error-alert' },
      ]}
    />
  );
}
