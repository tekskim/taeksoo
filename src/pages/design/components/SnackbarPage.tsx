import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack, Badge } from '@/design-system';
import {
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconInfoCircle,
  IconX,
  IconChevronUp,
  IconChevronDown,
} from '@tabler/icons-react';
import AppIconIAM from '@/assets/appIcon/iam.png';

/* ----------------------------------------
   Static Card Component
   ---------------------------------------- */

function StaticNotificationCard({
  type,
  message,
  time,
  project,
  showAppIcon = false,
  detail,
  isExpanded,
}: {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  time: string;
  project?: string;
  showAppIcon?: boolean;
  detail?: { code?: string | number; message?: string };
  isExpanded?: boolean;
}) {
  const iconMap = {
    success: (
      <IconCircleCheck size={16} stroke={1.5} className="text-[var(--color-state-success)]" />
    ),
    error: (
      <IconAlertTriangle size={16} stroke={1.5} className="text-[var(--color-state-danger)]" />
    ),
    warning: (
      <IconAlertCircle size={16} stroke={1.5} className="text-[var(--color-state-warning)]" />
    ),
    info: <IconInfoCircle size={16} stroke={1.5} className="text-[var(--color-state-info)]" />,
  };
  const hasDetail = detail && (detail.code || detail.message);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden">
      <div className="flex gap-2 p-3">
        <div className="shrink-0">{iconMap[type]}</div>
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
              <div className="flex flex-col items-end">
                <button
                  type="button"
                  className="size-5 flex items-center justify-center text-[var(--color-text-muted)]"
                >
                  <IconX size={16} stroke={1.5} />
                </button>
                <span className="text-body-sm text-[var(--color-text-muted)] whitespace-nowrap">
                  {time}
                </span>
              </div>
              {showAppIcon && (
                <img
                  src={AppIconIAM}
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
   Card States Example
   ---------------------------------------- */

function NotificationCardStates() {
  return (
    <VStack gap={3}>
      <span className="text-label-md text-[var(--color-text-default)]">
        Notification card states
      </span>
      <p className="text-body-sm text-[var(--color-text-subtle)]">
        All six visual states of a notification card: read/unread, with/without detail disclosure,
        and disclosure open.
      </p>
      <VStack gap={6} className="max-w-[463px]">
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Read (app icon)</span>
          <StaticNotificationCard
            type="success"
            message='Instance "web-server-01" created successfully.'
            time="hh:mm"
            project="Proj-1"
            showAppIcon
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Read (without app icon)
          </span>
          <StaticNotificationCard
            type="success"
            message='Instance "web-server-01" created successfully.'
            time="hh:mm"
            project="Proj-1"
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            Read + Detail (collapsed)
          </span>
          <StaticNotificationCard
            type="success"
            message='Instance "web-server-01" created successfully.'
            time="hh:mm"
            project="Proj-1"
            showAppIcon
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
          <StaticNotificationCard
            type="success"
            message='Instance "web-server-01" created successfully.'
            time="hh:mm"
            project="Proj-1"
            showAppIcon
            detail={{
              code: 400,
              message:
                "Flavor's disk is smaller than the minimum size specified in image metadata.",
            }}
            isExpanded
          />
        </VStack>
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   Guidelines
   ---------------------------------------- */

const SNACKBAR_GUIDELINES = `## Overview
Snackbar는 사용자가 수행한 액션의 결과 또는 비동기 작업의 상태를 즉시 인지할 수 있도록 제공하는 기록형 알림 컴포넌트이다.
Snackbar는 화면 상단 또는 우측 상단의 고정 영역에 노출되며, 사용자의 현재 작업 흐름을 크게 방해하지 않으면서도 중요한 결과를 전달한다.
Snackbar는 단순한 일시적 피드백이 아니라, 알림센터에 기록되는 Notification 계열 컴포넌트이다.

---

## Composition

\`\`\`
+----------------------------------------------------------------------------------+
| [Type Icon] Message Content                          [Partition Info] [Timestamp] |
|             (Optional partition info)                     [App Icon] [View ▼] [X] |
|             <--------------- Click Area -------------->                         |
+----------------------------------------------------------------------------------+
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Type Icon | 알림 유형에 맞는 아이콘 |
| Message Content | 리소스와 액션 결과를 설명하는 본문 |
| Partition Info (optional) | 테넌트, 클러스터 등 상위 분류 정보 |
| Timestamp | 메시지 발생 시각 |
| App Icon (optional) | 알림이 발생한 앱 아이콘 |
| View Details Button (optional) | 실패 알림의 상세 정보 확장/축소 |
| Close Button | 스낵바 UI 닫기 |
| Click Area | 리소스 상세/리스트 화면 이동 영역 |

### Type Icon
- 요청/성공/실패 유형에 따라 아이콘을 다르게 사용한다.

### Message Content
- 어떤 리소스에 대해 어떤 액션이 어떤 결과가 되었는지를 단일 문장으로 전달한다.

### Partition Info
- 앱 내에서 상위 분류 개념이 존재하는 경우에만 표시 (예: tenant, cluster, namespace)

### Timestamp
- Snackbar는 휘발성 알림이므로 간결한 형식을 사용한다. (cf. InlineMessage는 운영 이벤트용 상세 형식)
- 당일: \`hh:mm:ss\`
- 과거: EN: \`MMM DD\` / KO: \`MM월 DD일\`

### App Icon
- 데스크탑 UI에서 노출될 때만 표시. 앱 내부에서는 표시하지 않는다.

### View Details Button
- Failure 유형에서만 제공. 클릭 시 상세 정보 영역 확장/축소. 확장 상태에서는 Pinned.

### Close Button
- Snackbar UI만 닫음. 읽음 처리와 별개, 알림센터/전역 패널에는 안읽음 유지.

### Click Area
- 닫기/상세보기 버튼 제외한 나머지 영역. 클릭 시 리소스 상세/리스트 화면으로 이동.

---

## Variants

| 유형 | 설명 |
| --- | --- |
| App Snackbar | 앱이 활성 상태일 때 앱 내부에서 노출 |
| Desktop Snackbar | 앱이 비활성 상태일 때 데스크탑 UI에서 노출 |

---

## States

| 상태 | 설명 |
| --- | --- |
| Visible | 화면에 노출 중 |
| Hovered | 포인터가 올라간 상태 |
| Pinned | 상세 정보 확장 또는 유지형 상태로 고정 |
| Queued | 표시 대기 상태 |
| Closed | UI에서 닫힌 상태 |

---

## Behavior

### 1) 노출 위치 규칙
- 앱이 활성 상태일 때: 해당 앱 UI의 우측 상단에 표시. 알림센터 열려 있으면 Snackbar 노출되지 않음.
- 앱이 비활성 상태일 때: 데스크탑 UI 우측 상단에 표시. 전역 패널 열려 있으면 노출되지 않음.

### 2) 동시 노출 규칙
| 유형 | 동시 노출 규칙 |
| --- | --- |
| Auto-dismiss Snackbar | 1개 |
| Persistent Snackbar | 최대 3개 |

- 최신 알림이 위에 표시. 최대 개수 초과 시 대기열에 저장.

### 3) 표시 시간 규칙
- Auto-dismiss: 1~3초. Hover 시 일시정지, 해제 시 남은 시간 재개.

### 4) Persistent Snackbar
- 자동 종료되지 않음. 본문 클릭, Close 버튼, 후속 액션 버튼, 상세보기 확인 후 닫기로 종료.

### 5) 사용자 액션별 동작

| 행동 | 이동 | Snackbar 종료 | 읽음 처리 |
| --- | --- | --- | --- |
| 본문 클릭 | 리소스 화면 | 종료 | ✔ |
| Close | 없음 | 종료 | ✖ |
| 자동 종료 | 없음 | 종료 | ✖ |
| View details | 상세 확장 | 유지 | ✖ |

### 6) 기록 및 읽음 처리 규칙
- Snackbar는 항상 알림센터에 기록된다.
- 본문 클릭으로 대상 화면 이동한 경우만 읽음 처리.
- 닫기, 자동 만료, View details는 읽음 처리로 간주하지 않는다.

### 7) 상세 정보(View details)
- 실패 유형에서 오류코드 등 상세 메시지가 있을 때만 제공.
- 상세 열려 있는 동안 Snackbar 고정.

---

## Content Guidelines

### 1) 메시지 구조
- "리소스 + 액션 + 결과" 중심의 단일 문장으로 작성한다.
- 예: 인스턴스 "{instance name}" 생성에 실패했습니다.

### 2) Timestamp
- 상대 시간이 아니라 발생 시각을 사용한다. 로케일 정책을 따른다.

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Toast | Component | 기록되지 않는 단발성 피드백과 구분 |
| Inline Message | Component | 지속 경고와 구분 |
| Modal | Component | 사용자 결정이 필요한 경우 대체 |
| App Notification Center | Component | 실제 기록 저장 및 상세 확인 |
| Global Notification Panel | Pattern | 안읽은 알림 집합 표시 |
| UX Writing Guide | Foundation | 알림 문구 작성 규칙 |
| Error & Alert | Foundation | 알림 계층 및 메시지 유형 정책 |
`;

/* ----------------------------------------
   Page
   ---------------------------------------- */

export function SnackbarPage() {
  return (
    <ComponentPageTemplate
      title="Snackbar"
      description="사용자가 수행한 액션의 결과 또는 비동기 작업의 상태를 즉시 인지할 수 있도록 제공하는 기록형 알림 컴포넌트. 알림센터에 기록되는 Notification 계열 컴포넌트."
      whenToUse={[
        '결과를 알림센터에 기록으로 남겨야 하는 경우',
        '실패 원인에 대한 추가 정보 또는 후속 액션이 필요한 경우',
      ]}
      whenNotToUse={[
        '단발성이고 기록이 필요 없는 가벼운 피드백 (→ Toast)',
        '입력값 오류 또는 필드 단위 검증 (→ Validation)',
        '사용자의 결정이 반드시 필요한 경우 (→ Modal)',
      ]}
      examples={<NotificationCardStates />}
      guidelines={
        <>
          <NotionRenderer markdown={SNACKBAR_GUIDELINES} />
          <DosDonts
            doItems={[
              '기록이 필요한 결과성 알림에 사용한다.',
              '실패 또는 후속 조치가 필요한 알림은 유지형으로 제공한다.',
              '사용자가 액션을 취해야 하는 알림은 자동 종료하지 않는다.',
            ]}
            dontItems={[
              '모든 Snackbar에 동일한 자동 종료 규칙을 적용하지 않는다.',
              '사용자가 아직 내용을 확인하지 못한 유지형 알림을 강제로 교체하지 않는다.',
            ]}
          />
        </>
      }
      relatedLinks={[
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Notification Center', path: '/design/components/notification-center' },
        {
          label: 'Global Notification Panel',
          path: '/design/components/global-notification-panel',
        },
        { label: 'UX Writing Guide', path: '/design/policies/ux-writing' },
        { label: 'Error & Alert', path: '/design/policies/error-alert' },
      ]}
    />
  );
}
