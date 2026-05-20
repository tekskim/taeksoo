import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { VStack } from '@/design-system';
import {
  IconInfoCircle,
  IconAlertTriangle,
  IconX,
  IconChevronUp,
  IconChevronDown,
} from '@tabler/icons-react';
import AppIconCompute from '@/assets/appIcon/compute.png';

/* ----------------------------------------
   Static Card Component
   ---------------------------------------- */

function StaticNotificationCard({
  appIcon,
  message,
  statusIcon,
  statusInline,
  time,
  partition,
  detail,
  isExpanded,
}: {
  appIcon?: string;
  message: string;
  statusIcon?: React.ReactNode;
  statusInline?: boolean;
  time: string;
  partition?: string;
  detail?: { code?: string | number; message?: string };
  isExpanded?: boolean;
}) {
  const hasDetail = detail && (detail.code || detail.message);

  return (
    <div className="relative rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col gap-3 py-3">
      <div className="flex items-start justify-between px-3">
        <div className="flex gap-2 items-start w-[256px]">
          {appIcon && <img src={appIcon} alt="" className="size-5 shrink-0 object-contain" />}
          <div className="flex flex-col gap-2 flex-1 min-w-[1px]">
            <div className="flex flex-col">
              {statusInline ? (
                <div className="flex items-center gap-1">
                  <span className="text-label-md text-[var(--color-text-default)]">{message}</span>
                  {statusIcon}
                </div>
              ) : (
                <>
                  <span className="text-label-md text-[var(--color-text-default)]">{message}</span>
                  {statusIcon && <div className="flex items-center gap-1">{statusIcon}</div>}
                </>
              )}
            </div>

            {partition && (
              <span className="text-body-sm text-[var(--color-text-subtle)]">{partition}</span>
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
                    <div className="flex flex-col gap-1 text-body-sm text-[var(--color-text-muted)]">
                      {detail.code !== undefined && <p>code: {detail.code}</p>}
                      {detail.message && <p>{detail.message}</p>}
                    </div>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-end self-stretch shrink-0">
          <span className="text-body-sm text-[var(--color-text-subtle)] whitespace-nowrap">
            {time}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="absolute top-[7px] right-[7px] size-4 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)] transition-colors"
      >
        <IconX size={12} stroke={1.5} />
      </button>
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
        Snackbar 카드의 3가지 상태: 기본, View detail 접힘, View detail 펼침.
      </p>
      <VStack gap={6} className="max-w-[320px]">
        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Simple</span>
          <StaticNotificationCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" snapshot `}
            statusIcon={
              <>
                <span className="text-body-md text-[var(--color-text-default)]">infomation</span>
                <IconInfoCircle size={14} stroke={1.5} className="text-[var(--color-state-info)]" />
              </>
            }
            time="10:33"
            partition="ultra-resilient-cloud-native-infrastructure-management-platform"
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            With detail (collapsed)
          </span>
          <StaticNotificationCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" create failed.`}
            statusIcon={
              <IconAlertTriangle
                size={14}
                stroke={1.5}
                className="text-[var(--color-state-danger)]"
              />
            }
            statusInline
            time="10:33"
            partition="ultra-resilient-cloud-native-infrastructure-management-platform"
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
            }}
          />
        </VStack>

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            With detail (expanded)
          </span>
          <StaticNotificationCard
            appIcon={AppIconCompute}
            message={`Volume "backup-01" create failed.`}
            statusIcon={
              <IconAlertTriangle
                size={14}
                stroke={1.5}
                className="text-[var(--color-state-danger)]"
              />
            }
            statusInline
            time="10:33"
            partition="ultra-resilient-cloud-native-infrastructure-management-platform"
            detail={{
              code: 200,
              message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.',
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

Snackbar는 사용자가 수행한 액션의 결과 또는 비동기 작업의 상태를 **즉시 인지할 수 있도록 제공하는 기록형 알림 컴포넌트**이다.

Snackbar는 화면 상단 또는 우측 상단의 고정 영역에 노출되며, 사용자의 현재 작업 흐름을 크게 방해하지 않으면서도 중요한 결과를 전달하는 목적을 가진다.

Snackbar는 단순한 일시적 피드백이 아니라, **알림센터에 기록되는 Notification 계열 컴포넌트**이다.

상세 확인과 기록 관리는 앱 내부 알림센터가 담당하며, 전역 알림 패널은 읽지 않은 알림을 모아 보여주는 보조 뷰로 동작한다.

---

## Composition

\`\`\`
[icon] Message content
       Partition info · Timestamp
       [View details]          [x]
\`\`\`

| 요소 | 설명 |
| --- | --- |
| Type Icon | 알림 유형에 맞는 아이콘 |
| Message Content | 리소스와 액션 결과를 설명하는 본문 |
| Partition Info (optional) | 테넌트, 클러스터, 네임스페이스 등 상위 분류 정보 |
| Timestamp | 메시지 발생 시각 |
| App Icon (optional) | 알림이 발생한 앱 아이콘 |
| View Details Button (optional) | 실패 알림의 상세 정보 확장/축소 |
| Close Button | 스낵바 UI 닫기 |
| Click Area | 리소스 상세/리스트 화면 이동 영역 |

### Type Icon
- 요청 / 성공 / 실패 유형에 따라 아이콘을 다르게 사용한다.
- 텍스트만으로 유형을 전달하지 않고 시각적 구분을 함께 제공한다.

### Message Content
- 어떤 리소스에 대해 어떤 액션이 어떤 결과가 되었는지를 **단일 문장**으로 전달한다.
- 리소스와 액션이 명확히 드러나야 한다.

### Partition Info
- 앱 내에서 상위 분류 개념이 존재하는 경우에만 표시한다.
- 예: tenant, cluster, namespace

### Timestamp
- 스낵바가 발생한 시각을 표시한다.
- 당일 발생: \`hh:mm\`
- 과거 날짜 발생:
  - EN: \`MMM DD\` (예: Dec 7)
  - KO: \`MM월 DD일\` (예: 12월 7일)

### App Icon
- **데스크탑 UI에서 노출될 때만 표시**한다.
- 앱 내부에서 노출되는 경우에는 표시하지 않는다.

### View Details Button
- **Failure 유형에서만 제공한다.**
- 클릭 시 상세 정보 영역을 확장/축소한다.
- 확장 상태에서는 Snackbar가 **Pinned 상태**이다.

### Close Button
- Snackbar UI만 즉시 닫는다.
- 읽음 처리와는 별개이며, 알림센터 / 전역 패널에는 안읽음 상태로 유지된다.

### Click Area
- 닫기 버튼, 상세 보기 버튼을 제외한 나머지 영역이다.
- 클릭 시 대상 리소스의 상세 화면으로 이동한다.
- 상세 화면이 없는 경우 대상 리소스의 리스트 화면으로 이동한다.

---

## Variants

Snackbar는 **노출 위치 맥락** 기준으로 구분할 수 있다.

| 유형 | 설명 |
| --- | --- |
| App Snackbar | 앱이 활성 상태일 때 앱 내부에서 노출 |
| Desktop Snackbar | 앱이 비활성 상태일 때 데스크탑 UI에서 노출 |

### 1) App Snackbar
- 해당 앱 UI의 우측 상단 토스트/스낵바 영역에 표시된다.
- 앱 UI 위 최상단 레이어에 뜬다.

### 2) Desktop Snackbar
- 앱이 닫혀 있거나 비활성 상태일 때 데스크탑 UI 우측 상단에 표시된다.
- 데스크탑 전역 맥락에서 현재 알림을 인지시키는 역할을 한다.

---

## States

| 상태 | 설명 |
| --- | --- |
| Visible | 화면에 노출 중 |
| Hovered | 포인터가 올라간 상태 |
| Pinned | 상세 정보 확장 또는 유지형 상태로 고정된 상태 |
| Queued | 표시 대기 상태 |
| Closed | UI에서 닫힌 상태 |

---

## Behavior

### 1) 노출 위치 규칙

- **앱이 활성 상태일 때**
  - Snackbar는 해당 앱 UI의 우측 상단 영역에 표시된다.
  - 앱 내부 알림센터가 열려 있는 경우 Snackbar는 노출되지 않고, 알림센터 및 전역 패널에만 반영된다.
- **앱이 닫혀 있거나 비활성 상태일 때**
  - Snackbar는 데스크탑 UI 우측 상단 공통 영역에 표시된다.
  - 전역 패널이 열려 있는 경우 Snackbar는 노출되지 않고, 알림센터 및 전역 패널에만 반영된다.

### 2) 동시 노출 규칙

Snackbar의 동시 노출 개수는 **알림 유형에 따라 다르게 적용한다.**

| 유형 | 동시 노출 규칙 |
| --- | --- |
| Auto-dismiss Snackbar | 최대 3개 |
| Persistent Snackbar | 최대 3개 |

- 자동 종료형은 최대 3개까지 동시에 표시한다.
- 고정형 Snackbar는 여러 개 표시 가능하다.
- 최대 개수 초과 시 **FIFO(First In, First Out)** 방식으로 가장 오래된 스낵바를 자동 제거하고 새 스낵바를 표시한다.
- Snackbar는 **최신 알림이 아래에 표시한다.**

### 3) 표시 시간 규칙

- **Auto-dismiss Snackbar(자동 종료형)의 기본 표시 시간은 3초이다.**
- 여러 개가 동시에 쌓인 경우, 순차적으로 자연스럽게 사라지도록 **400ms 간격의 stagger**가 자동 적용된다.
  - 1번째: 3000ms, 2번째: 3400ms, 3번째: 3800ms
- Hover 시 자동 종료가 일시정지된다.
- Hover 해제 시 남은 시간이 다시 진행된다.

### 3-1) Dismiss 애니메이션

스낵바가 사라질 때 **2단계 애니메이션**이 적용된다.

1. **슬라이드 아웃** (300ms): 카드가 우측으로 밀리며 페이드아웃
2. **높이 축소** (200ms): 빈 공간이 부드럽게 접히며 나머지 스낵바가 자연스럽게 위로 이동

### 4) Persistent Snackbar

- 자동 종료되지 않는다.
- 사용자가 리소스 상태를 변경하거나, 알림을 읽는 등 특정 조건을 달성해야 종료된다.
  - 본문 클릭
  - Close 버튼
  - 후속 액션 버튼
  - 상세보기 확인 후 닫기

### 5) 사용자 액션별 동작

| 행동 | 이동 | Snackbar 종료 | 읽음 처리 |
| --- | --- | --- | --- |
| 본문 클릭 | 리소스 화면 | 종료 | ✔ |
| Close | 없음 | 종료 | ✖ |
| 자동 종료 | 없음 | 종료 | ✖ |
| View details | 상세 확장 | 유지 | ✖ |

### 6) 기록 및 읽음 처리 규칙

- Snackbar는 **항상 알림센터에 기록된다.**
- 전역 알림 패널은 읽지 않은 알림만 모아 보여주는 보조 뷰다.
- Snackbar가 화면에 노출되지 않았더라도 기록은 반드시 남아야 한다.
- 본문 클릭을 통해 대상 화면으로 이동한 경우만 읽음 처리된다.
- 닫기, 자동 만료, View details 확장/축소는 읽음 처리로 간주하지 않는다.

### 7) 상세 정보(View details)

- 실패 유형에서 오류코드 등 알림에 대한 상세 메시지가 추가될 때만 제공한다.
- 클릭 시 오류 코드, 오류 메시지 등 상세 정보 영역이 인라인으로 확장된다.
- 상세 정보가 열려 있는 동안 Snackbar는 고정된다.
- 유지형 Snackbar는 상세 정보를 닫더라도 자동 종료되지 않는다.
- 사용자가 명시적으로 닫거나 후속 액션을 수행해야 종료된다.

---

## Content Guidelines

### 1) 메시지 구조
- 메시지는 **리소스 + 액션 + 결과** 중심의 단일 문장으로 작성한다.
- 예: 인스턴스 "{instance name}" 생성에 실패했습니다.

### 2) Timestamp
- 상대 시간이 아니라 **발생 시각**을 사용한다.
- 포맷은 로케일 정책을 따른다.

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Toast | Component | 기록되지 않는 단발성 피드백과 구분 |
| Inline Message | Component | 지속 경고와 구분 |
| Modal | Component | 사용자 결정이 필요한 경우 대체 |
| App Notification Center | Component | 실제 기록 저장 및 상세 확인 |
| Global Notification Panel | Pattern / Component | 안읽은 알림 집합 표시 |
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
      description="사용자 액션의 결과 또는 비동기 작업 상태를 즉시 전달하는 기록형 알림 컴포넌트."
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
          <NotionRenderer markdown={SNACKBAR_GUIDELINES} />
        </>
      }
      relatedLinks={[
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Inline Message', path: '/design/components/inline-message' },
        { label: 'Modal', path: '/design/components/modal' },
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
