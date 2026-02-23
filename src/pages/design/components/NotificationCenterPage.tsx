import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, NotificationCenter, VStack } from '@/design-system';
import type { NotificationItem } from '@/design-system';
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconRefresh,
} from '@tabler/icons-react';

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'success',
    message: 'Instance "web-server-01" created successfully.',
    time: '10:23',
    project: 'Proj1',
    isRead: false,
    detail: {
      code: 200,
      message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
    },
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
      message:
        "Flavor's disk is smaller than the minimum size specified in image metadata. Flavor disk is 1073741824 bytes, minimum size is 10737418240 bytes.",
    },
  },
  {
    id: '4',
    type: 'warning',
    message: 'Instance "db-server" is running low on disk space.',
    time: '09:15',
    project: 'Proj1',
    isRead: true,
    detail: {
      code: 'WARN_DISK_LOW',
      message: 'Disk usage is at 92%. Consider expanding the volume or cleaning up unused files.',
    },
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
      description="Centralized notification panel with filtering, read/unread states, and real-time updates"
      relatedLinks={[
        { label: 'Toast', path: '/design/components/toast', description: 'Instant feedback' },
        {
          label: 'Global notification panel',
          path: '/design/components/global-notification-panel',
          description: 'Desktop-level panel',
        },
        {
          label: 'Inline message',
          path: '/design/components/inline-message',
          description: 'Inline feedback',
        },
      ]}
    >
      <VStack gap={8}>
        {/* 1. 개요 (Overview) */}
        <VStack gap={3}>
          <Label>1. 개요</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">정의</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    앱 내부 알림센터는 해당 앱에서 발생한 모든 알림의{' '}
                    <strong>원본 기록 공간</strong>이다.
                  </li>
                  <li>
                    토스트 및 전역 알림 패널이 즉각적 인지를 담당한다면, 앱 내부 알림센터는 알림의{' '}
                    <strong>보관</strong>을 담당한다.
                  </li>
                  <li>
                    알림은 <strong>3일간 보관</strong>되며, 이후 자동 삭제된다. (사용자 삭제 불가,
                    읽음 처리 가능)
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  토스트, 전역 패널과의 관계
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-md border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          레이어
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          역할
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          기록 여부
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          동작
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          토스트
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">즉시 인지</td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">X</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          노출 1~3초(최소 1초 보장), 호버 시 일시정지. 실패에는 View details(인라인
                          확장) 제공(읽음 아님).
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          전역 알림 패널
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          모든 앱의 &apos;안읽은&apos; 알림 목록(미러)
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">X</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          필터 없음 · 최신순. 개별 읽음/전체 읽음 제공. 카드 클릭 = 리소스 이동 +
                          읽음 처리. 패널 열려 있으면 토스트 억제.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          앱 알림센터
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          원본 기록/상세 확인
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">O</td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          개별/전체 읽음 제공, 실패 상세(View details) 제공(읽음 아님), 3일 자동
                          삭제.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">적용 기준</h4>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    해당 앱의 토스트 메시지(즉시 인지)를 놓쳤거나 히스토리 확인이 필요한 경우
                    사용된다.
                  </li>
                  <li>
                    알림 클릭 시 기본 동작 → 대상 리소스의 상세 화면(없으면 리스트 화면)으로 이동 +
                    해당 알림은 읽음 처리
                  </li>
                  <li>
                    View details(알림 상세) 클릭 시 → 알림센터 내에서 해당 알림 확장 (읽음 아님).
                  </li>
                  <li>
                    알림센터가 열려 있는 동안 새 알림이 발생하면 토스트는 뜨지 않고 알림센터 목록에
                    안읽음으로 직접 추가된다.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* 2. 구성요소 (Components) */}
        <VStack gap={3}>
          <Label>2. 구성요소</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                알림센터 아이콘
              </h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>클릭 시 알림센터가 열림</li>
                <li>안읽은 알림이 있을 시 붉은 색으로 뱃지가 표시</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">탭</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>전체(All)</strong> → 모든 알림
                </li>
                <li>
                  <strong>안 읽음(Unread)</strong> → 안 읽은 알림만
                </li>
                <li>
                  <strong>실패(Error)</strong> → 실패 알림만
                </li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                전체 읽음 처리 버튼
              </h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>호버 시 툴팁: &quot;Mark all as read&quot;</li>
                <li>클릭 시 현재 알림센터의 모든 알림이 읽음 처리</li>
                <li>알림센터 아이콘에 뱃지 제거</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">개별 알림</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>토스트와 유사한 형태 (유형 아이콘, 메시지 내용, 발생 시각)</li>
                <li>개별 읽음 처리 버튼, 파티션 정보(선택), 상세 보기 버튼(선택)</li>
                <li>읽지 않은 알림과 읽은 알림 구별 표시</li>
                <li>상세 보기 버튼: 실패 알림에서만 존재 (v0.7)</li>
              </ul>
            </div>
          </div>
        </VStack>

        {/* Design Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>width: 360px</code> · <code>padding: 16px</code> · <code>border-radius: 8px</code>{' '}
            · <code>shadow: lg</code>
          </div>
        </VStack>

        {/* Live Demo */}
        <VStack gap={3}>
          <div className="flex items-center justify-between">
            <Label>Live demo</Label>
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

        {/* Notification Types */}
        <VStack gap={3}>
          <Label>Notification types</Label>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                  <IconCheck size={10} stroke={2} className="text-white" />
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
                  <IconX size={10} stroke={2} className="text-white" />
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
                  <IconAlertTriangle size={10} stroke={2} className="text-white" />
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
                  <IconInfoCircle size={10} stroke={2} className="text-white" />
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
    </ComponentPageTemplate>
  );
}
