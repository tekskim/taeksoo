import { useCallback, useRef, useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { InlineMessage, VStack, Button } from '@/design-system';
import {
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
} from '@tabler/icons-react';

const INLINE_MESSAGE_GUIDELINES = `## Overview
사용자에게 지속적인 주의가 필요한 상태/공지를 전달하기 위한 고정형 메시지 컴포넌트이다. "서비스 점검, 용량 부족"처럼 즉시 사라지면 안 되는 정보를 화면 상단 또는 특정 섹션 상단에 고정하여 노출한다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| Container | 고정 노출되는 메시지 영역 |
| Status indicator | info/success/warning/error를 표현하는 시각 요소 |
| Content | 메시지 본문 텍스트(Title 없음) |
| Close button (optional) | 메시지 닫기 버튼 (X 아이콘) |
| Action button (optional) | 메시지에 대한 액션 버튼 |
| Timestamp (optional) | 메시지 발생 시각 표기 |
| Expand/Collapse Control (optional) | 접기/펼치기 토글 셰브론 |

---

## Variants

### Severity

| Severity | 의미 | 예시 |
| --- | --- | --- |
| info | 참고/안내(작업 가능) | "New policy will apply from…" |
| success | 완료/정상(지속 노출 필요 시에만) | "All systems operational" |
| warning | 주의/제한(조치 권장) | "Storage is almost full" |
| error | 문제/장애(영향 큼) | "Service outage detected" |

- success는 "지속 노출이 필요한 성공 상태"에만 사용. 단발 성공 피드백에는 사용하지 않는다(→ Toast).
- error는 사용자의 작업 가능 여부에 영향을 주는 상황에서 사용.

### Type

| Type | 구성 | 사용 시점 |
| --- | --- | --- |
| Default | Icon + Content | 기본 메시지. 닫기/액션 불필요 시 |
| With close | Icon + Content + Close(X) | 사용자가 직접 닫을 수 있는 메시지 |
| With action | Icon + Content + Button | 메시지에 대한 즉각적 액션이 필요할 때 |
| Expandable | Icon + Content(truncated) + Timestamp + Chevron | 긴 로그/에러 메시지. 접기/펼치기 지원 |

---

## Behavior

### 1) 위치 정책
- 관련 콘텐츠 바로 위 또는 아래에 배치한다.

### 2) 지속성 정책
- 자동으로 사라지지 않는다.
- 상태가 해소되거나 지정된 조건이 만족하면 자동 제거된다.

### 3) 접기/펼치기
- 기본 상태는 Collapsed(접힘)이다.
- Collapsed 상태에서도 Severity, 메시지 앞부분 1줄, Timestamp는 항상 노출한다.
- Expanded 상태에서 콘텐츠는 최대 3줄까지 표시. 3줄 초과 시 내부 스크롤 처리한다.
- 스크롤바는 시각적으로 숨기고, 트랙패드/마우스 휠 스크롤만 지원한다.
- 사용자가 펼친 상태는 현재 세션 동안 유지, 새로고침/재진입 시 초기화.

### 4) Timestamp 표기 규칙
- InlineMessage는 영속적 메시지이므로 타임존 포함 상세 형식을 사용한다. (cf. Snackbar는 휘발성 알림용 간결 형식)
- 운영 이벤트/장애/점검처럼 "언제부터"가 중요한 메시지에만 사용.
- KO: YYYY-MM-DD HH:mm:ss (UTC+N)
- EN: Mth DD, YYYY HH:mm:ss (UTC+N)

### 5) 여러 메시지 표기 규칙
- 같은 위치에 여러 InlineMessage가 필요한 경우 VStack으로 8px 간격으로 스태킹.
- Severity 우선: error > warning > info > success
- 동일 severity 내 최신 우선.

---

## Content Guidelines

- Title 없이 "한 문단 구조"로 작성한다.
- Info: "[상태/문제] + [원인 또는 영향] + [필요 시 조치 또는 추가 정보]"
- Error: 가능한 문제의 원인을 포함한다.
- Timestamp: KO \`YYYY-MM-DD HH:mm:ss (UTC+N)\` / EN \`Mth DD, YYYY HH:mm:ss (UTC+N)\`

---

## Related

| 이름 | 유형 | 관련 이유 |
| --- | --- | --- |
| Snackbar | Component | 상태 발생 시점 알림과 역할 분리 |
| Toast | Component | 단발 피드백과 구분 |
| Validation | Component | 입력 오류 메시지와 구분 |
| Notification Center | Component | 기록형 이벤트와 역할 분리 |
| UX Writing Guide | Foundation | 문장 톤/날짜 표기 규칙 |
| Error&Alert Overview | Foundation | 메시지 유형 및 컴포넌트 종합 정책 |
`;

type InlineMessageVariant = 'success' | 'warning' | 'error' | 'info';

const VARIANT_STYLES: Record<
  InlineMessageVariant,
  { bg: string; iconClass: string; icon: React.ReactNode }
> = {
  success: {
    bg: 'bg-[var(--inline-message-success-bg)]',
    iconClass: 'text-[var(--inline-message-success-icon)]',
    icon: <IconCircleCheck size={16} strokeWidth={1.5} />,
  },
  warning: {
    bg: 'bg-[var(--inline-message-warning-bg)]',
    iconClass: 'text-[var(--inline-message-warning-icon)]',
    icon: <IconAlertCircle size={16} strokeWidth={1.5} />,
  },
  error: {
    bg: 'bg-[var(--inline-message-error-bg)]',
    iconClass: 'text-[var(--inline-message-error-icon)]',
    icon: <IconAlertTriangle size={16} strokeWidth={1.5} />,
  },
  info: {
    bg: 'bg-[var(--inline-message-info-bg)]',
    iconClass: 'text-[var(--inline-message-info-icon)]',
    icon: <IconInfoCircle size={16} strokeWidth={1.5} />,
  },
};

function InlineMessageWithClose({
  variant = 'info',
  children,
}: {
  variant?: InlineMessageVariant;
  children: React.ReactNode;
}) {
  const styles = VARIANT_STYLES[variant];
  return (
    <div
      className={`flex items-center gap-[var(--inline-message-gap)] p-[var(--inline-message-padding)] rounded-[var(--inline-message-radius)] ${styles.bg}`}
    >
      <span className={`shrink-0 ${styles.iconClass}`}>{styles.icon}</span>
      <span className="text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)] truncate flex-1 min-w-0">
        {children}
      </span>
      <button className="shrink-0 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors">
        <IconX size={16} stroke={1.5} />
      </button>
    </div>
  );
}

function InlineMessageWithAction({
  variant = 'info',
  actionLabel,
  children,
}: {
  variant?: InlineMessageVariant;
  actionLabel: string;
  children: React.ReactNode;
}) {
  const styles = VARIANT_STYLES[variant];
  return (
    <div
      className={`flex items-center gap-[var(--inline-message-gap)] p-[var(--inline-message-padding)] rounded-[var(--inline-message-radius)] ${styles.bg}`}
    >
      <span className={`shrink-0 ${styles.iconClass}`}>{styles.icon}</span>
      <span className="text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)] truncate flex-1 min-w-0">
        {children}
      </span>
      <Button variant="secondary" size="sm" className="shrink-0">
        {actionLabel}
      </Button>
    </div>
  );
}

function ExpandableInlineMessage({
  variant = 'info',
  timestamp,
  children,
}: {
  variant?: InlineMessageVariant;
  timestamp: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showFade, setShowFade] = useState(false);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const styles = VARIANT_STYLES[variant];

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 2;
    setShowFade(!atBottom);
  }, []);

  const handleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) {
          el.scrollTop = 0;
          const hasOverflow = el.scrollHeight - el.clientHeight > 2;
          setShowFade(hasOverflow);
        }
      });
    } else {
      setShowFade(false);
    }
  };

  return (
    <div
      className={`flex items-start gap-[var(--inline-message-gap)] p-[var(--inline-message-padding)] rounded-[var(--inline-message-radius)] ${styles.bg}`}
    >
      <span className={`shrink-0 ${styles.iconClass}`}>{styles.icon}</span>
      <span className="relative flex-1 min-w-0">
        <span
          ref={scrollRef}
          onScroll={handleScroll}
          className={`block text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)] ${expanded ? 'max-h-[calc(3*var(--inline-message-line-height))] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : 'truncate'}`}
        >
          {children}
        </span>
        {expanded && showFade && (
          <span
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-[var(--inline-message-line-height)]"
            style={{
              background: `linear-gradient(to top, var(--inline-message-${variant}-bg), transparent)`,
            }}
          />
        )}
      </span>
      <span className="text-body-xs leading-[var(--inline-message-line-height)] text-[var(--color-text-default)] whitespace-nowrap shrink-0 ml-2">
        {timestamp}
      </span>
      <button
        className="shrink-0 leading-[var(--inline-message-line-height)] rounded-[var(--radius-sm)] hover:bg-black/5"
        onClick={handleExpand}
      >
        {expanded ? (
          <IconChevronUp size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        ) : (
          <IconChevronDown size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
        )}
      </button>
    </div>
  );
}

function ExpandedInlineMessage({
  variant = 'info',
  timestamp,
  children,
}: {
  variant?: InlineMessageVariant;
  timestamp: string;
  children: React.ReactNode;
}) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`flex items-start gap-[var(--inline-message-gap)] p-[var(--inline-message-padding)] rounded-[var(--inline-message-radius)] ${styles.bg}`}
    >
      <span className={`shrink-0 ${styles.iconClass}`}>{styles.icon}</span>
      <span className="relative flex-1 min-w-0">
        <span className="block text-[length:var(--inline-message-font-size)] leading-[var(--inline-message-line-height)] text-[var(--inline-message-text)] max-h-[calc(3*var(--inline-message-line-height))] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </span>
      </span>
      <span className="text-body-xs leading-[var(--inline-message-line-height)] text-[var(--color-text-default)] whitespace-nowrap shrink-0 ml-2">
        {timestamp}
      </span>
      <button className="shrink-0 leading-[var(--inline-message-line-height)] rounded-[var(--radius-sm)] hover:bg-black/5">
        <IconChevronUp size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
      </button>
    </div>
  );
}

export function InlineMessagePage() {
  return (
    <ComponentPageTemplate
      title="Inline message"
      description="사용자에게 지속적인 주의가 필요한 상태/공지를 전달하기 위한 고정형 메시지 컴포넌트. '서비스 점검, 용량 부족'처럼 즉시 사라지면 안 되는 정보를 화면 상단 또는 특정 섹션 상단에 고정하여 노출한다."
      whenToUse={[
        '서비스 점검/장애/성능 저하 등 운영 상태 공지',
        '용량/쿼터 부족, 비용 한도 임박 등 지속적 주의가 필요한 상태',
        '특정 섹션 컨텍스트에서만 의미가 있는 지속 경고(해당 섹션 상단 고정)',
      ]}
      whenNotToUse={[
        '단발성 액션 피드백(→ Toast)',
        '비동기 작업 결과/이벤트(→ Snackbar + Notification Center 기록 정책)',
        '입력 오류/필드 가이드(→ Validation)',
        '사용자의 즉각적인 결정이 필요한 경고(→ Modal)',
      ]}
      preview={
        <ComponentPreview
          code={`<InlineMessage variant="success">Operation completed successfully.</InlineMessage>
<InlineMessage variant="warning">Please review before proceeding.</InlineMessage>`}
        >
          <VStack gap={3}>
            <InlineMessage variant="success">Operation completed successfully.</InlineMessage>
            <InlineMessage variant="warning">Please review before proceeding.</InlineMessage>
          </VStack>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Variants</Label>
            <VStack gap={3}>
              <InlineMessage variant="success">
                Used for completed or normal operations.
              </InlineMessage>
              <InlineMessage variant="warning">
                Used when attention is needed but not critical.
              </InlineMessage>
              <InlineMessage variant="error">
                Used for failed actions or system issues.
              </InlineMessage>
              <InlineMessage variant="info">
                Used for general or non-critical updates.
              </InlineMessage>
            </VStack>
          </VStack>

          <VStack gap={3}>
            <Label>With close button</Label>
            <VStack gap={3}>
              <InlineMessageWithClose variant="success">
                Used for completed or normal operations.
              </InlineMessageWithClose>
              <InlineMessageWithClose variant="warning">
                Used when attention is needed but not critical.
              </InlineMessageWithClose>
              <InlineMessageWithClose variant="error">
                Used for failed actions or system issues.
              </InlineMessageWithClose>
              <InlineMessageWithClose variant="info">
                Used for general or non-critical updates.
              </InlineMessageWithClose>
            </VStack>
          </VStack>

          <VStack gap={3}>
            <Label>With action button</Label>
            <VStack gap={3}>
              <InlineMessageWithAction variant="success" actionLabel="Label">
                Used for completed or normal operations.
              </InlineMessageWithAction>
              <InlineMessageWithAction variant="warning" actionLabel="Label">
                Used when attention is needed but not critical.
              </InlineMessageWithAction>
              <InlineMessageWithAction variant="error" actionLabel="Label">
                Used for failed actions or system issues.
              </InlineMessageWithAction>
              <InlineMessageWithAction variant="info" actionLabel="Label">
                Used for general or non-critical updates.
              </InlineMessageWithAction>
            </VStack>
          </VStack>

          <VStack gap={3}>
            <Label>Expandable</Label>
            <VStack gap={3}>
              <ExpandableInlineMessage variant="success" timestamp="Nov-11-2025 02:51 PM">
                Used for completed or normal operations. ERROR nova.compute.manager [instance:
                9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed to allocate the network(s). No
                available IP addresses in subnet 192.168.10.0/24.
              </ExpandableInlineMessage>
              <ExpandableInlineMessage variant="warning" timestamp="Nov-11-2025 02:51 PM">
                Used for completed or normal operations. ERROR nova.compute.manager [instance:
                9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed to allocate the network(s). No
                available IP addresses in subnet 192.168.10.0/24.
              </ExpandableInlineMessage>
              <ExpandableInlineMessage variant="error" timestamp="Nov-11-2025 02:51 PM">
                Used for completed or normal operations. ERROR nova.compute.manager [instance:
                9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed to allocate the network(s). No
                available IP addresses in subnet 192.168.10.0/24.
              </ExpandableInlineMessage>
              <ExpandableInlineMessage variant="info" timestamp="Nov-11-2025 02:51 PM">
                Used for completed or normal operations. ERROR nova.compute.manager [instance:
                9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed to allocate the network(s). No
                available IP addresses in subnet 192.168.10.0/24.
              </ExpandableInlineMessage>
            </VStack>
          </VStack>

          <VStack gap={3}>
            <Label>Expandable (expanded)</Label>
            <VStack gap={3}>
              <ExpandedInlineMessage variant="success" timestamp="Nov-11-2025 02:51 PM">
                ERROR nova.compute.manager [instance: 9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed
                to allocate the network(s). No available IP addresses in subnet 192.168.10.0/24.
                WARNING neutron.agent.dhcp [subnet: 192.168.10.0/24] DHCP lease pool exhausted.
              </ExpandedInlineMessage>
              <ExpandedInlineMessage variant="warning" timestamp="Nov-11-2025 02:51 PM">
                ERROR nova.compute.manager [instance: 9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed
                to allocate the network(s). No available IP addresses in subnet 192.168.10.0/24.
                WARNING neutron.agent.dhcp [subnet: 192.168.10.0/24] DHCP lease pool exhausted.
              </ExpandedInlineMessage>
              <ExpandedInlineMessage variant="error" timestamp="Nov-11-2025 02:51 PM">
                ERROR nova.compute.manager [instance: 9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed
                to allocate the network(s). No available IP addresses in subnet 192.168.10.0/24.
                WARNING neutron.agent.dhcp [subnet: 192.168.10.0/24] DHCP lease pool exhausted.
              </ExpandedInlineMessage>
              <ExpandedInlineMessage variant="info" timestamp="Nov-11-2025 02:51 PM">
                ERROR nova.compute.manager [instance: 9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed
                to allocate the network(s). No available IP addresses in subnet 192.168.10.0/24.
                WARNING neutron.agent.dhcp [subnet: 192.168.10.0/24] DHCP lease pool exhausted.
              </ExpandedInlineMessage>
            </VStack>
          </VStack>

          <VStack gap={3}>
            <Label>Expandable (long content with scroll)</Label>
            <VStack gap={3}>
              <ExpandableInlineMessage variant="error" timestamp="Nov-11-2025 02:51 PM">
                ERROR nova.compute.manager [instance: 9f3a2d1c-8ab2-44bc-9e2b-1e84f8e2a9cc] Failed
                to allocate the network(s). No available IP addresses in subnet 192.168.10.0/24.
                WARNING neutron.agent.dhcp [subnet: 192.168.10.0/24] DHCP lease pool exhausted.
                Current allocation: 253/254 addresses. ERROR nova.scheduler [req-abc123] No valid
                host was found. There are not enough hosts available. INFO nova.compute.resource
                [host: compute-node-03] Free RAM: 512MB, Free Disk: 20GB, Free vCPUs: 2. CRITICAL
                cinder.volume.manager [volume: vol-7890abcd] Volume backend storage is full.
                Available space: 0GB. ERROR glance.store.swift [image: img-5678efgh] Connection
                timeout while uploading image to Swift backend storage cluster.
              </ExpandableInlineMessage>
            </VStack>
          </VStack>

          <VStack gap={3}>
            <Label>Long content</Label>
            <InlineMessage variant="warning">
              This is a longer message that demonstrates how the component handles multi-line
              content. The text will wrap naturally and the icon stays aligned to the top. When the
              message exceeds the available width, it breaks into a second row while maintaining
              consistent padding and icon alignment across all lines.
            </InlineMessage>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={INLINE_MESSAGE_GUIDELINES} />
          <DosDonts
            doItems={[
              '상태 또는 지정된 조건이 해소되면 즉시 제거되도록 한다.',
              'Section 메시지는 해당 섹션 컨텍스트를 벗어나면 노출하지 않는다.',
              'severity는 의미에 맞게만 사용하고 남발하지 않는다.',
            ]}
            dontItems={[
              '단발 피드백(성공/실패)을 Inline Message로 처리하지 않는다.',
              '동일 이슈를 여러 위치에 중복 고정하지 않는다.',
              'timestamp를 모든 메시지에 강제하여 노이즈를 만들지 않는다.',
            ]}
          />
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          padding: 12px · gap: 8px · radius: 6px · icon: 16px · font: 12px
        </div>
      }
      relatedLinks={[
        { label: 'Snackbar', path: '/design/components/snackbar' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Notification Center', path: '/design/components/notification-center' },
      ]}
    />
  );
}
