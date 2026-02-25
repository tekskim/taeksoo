import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Button, DetailHeader, VStack } from '@/design-system';
import {
  IconTerminal2,
  IconPlayerPlay,
  IconPlayerStop,
  IconRefresh,
  IconTrash,
  IconChevronDown,
} from '@tabler/icons-react';

const detailHeaderProps: PropDef[] = [
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'Title + Actions + InfoGrid',
  },
];

const detailHeaderInfoCardProps: PropDef[] = [
  { name: 'label', type: 'string', required: true, description: 'Info card label' },
  { name: 'value', type: 'ReactNode', required: false, description: 'Info card value' },
  {
    name: 'copyable',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show copy button',
  },
  { name: 'status', type: 'StatusType', required: false, description: 'Status indicator' },
  { name: 'tooltip', type: 'string', required: false, description: 'Help tooltip text' },
];

export function DetailHeaderPage() {
  return (
    <ComponentPageTemplate
      title="Detail header"
      description="Page header component for resource detail views with title, actions, and info cards"
      preview={
        <ComponentPreview
          code={`<DetailHeader>
  <DetailHeader.Title>tk-test</DetailHeader.Title>
  <DetailHeader.Actions>
    <Button variant="outline" size="sm">Console</Button>
    <Button variant="outline" size="sm">Start</Button>
  </DetailHeader.Actions>
  <DetailHeader.InfoGrid>
    <DetailHeader.InfoCard label="Status" value="Active" status="active" />
    <DetailHeader.InfoCard label="ID" value="7284d917..." copyable />
  </DetailHeader.InfoGrid>
</DetailHeader>`}
        >
          <DetailHeader>
            <DetailHeader.Title>tk-test</DetailHeader.Title>
            <DetailHeader.Actions>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconTerminal2 size={12} stroke={1.5} />}
              >
                Console
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}
              >
                Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<IconPlayerStop size={12} stroke={1.5} />}
              >
                Stop
              </Button>
              <Button variant="outline" size="sm" leftIcon={<IconRefresh size={12} stroke={1.5} />}>
                Reboot
              </Button>
              <Button variant="outline" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                rightIcon={<IconChevronDown size={12} stroke={1.5} />}
              >
                More actions
              </Button>
            </DetailHeader.Actions>
            <DetailHeader.InfoGrid>
              <DetailHeader.InfoCard label="Status" value="Active" status="active" />
              <DetailHeader.InfoCard label="ID" value="7284d9174e81431e93060a9bbcf2cdfd" copyable />
              <DetailHeader.InfoCard label="Host" value="compute-03" />
              <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025" />
            </DetailHeader.InfoGrid>
          </DetailHeader>
        </ComponentPreview>
      }
      usage={{
        code: `import { DetailHeader, Button } from '@/design-system';\n\n<DetailHeader>\n  <DetailHeader.Title>{resourceName}</DetailHeader.Title>\n  <DetailHeader.Actions>\n    <Button variant="secondary" size="sm">Edit</Button>\n  </DetailHeader.Actions>\n  <DetailHeader.InfoGrid>\n    <DetailHeader.InfoCard label="Status" status="active" />\n    <DetailHeader.InfoCard label="ID" value={id} copyable />\n  </DetailHeader.InfoGrid>\n</DetailHeader>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Info Card - Status indicator States
            </span>
            <div className="grid grid-cols-4 gap-2">
              <DetailHeader.InfoCard label="Status" value="Active" status="active" />
              <DetailHeader.InfoCard label="Status" value="Shutoff" status="shutoff" />
              <DetailHeader.InfoCard label="Status" value="Degraded" status="degraded" />
              <DetailHeader.InfoCard label="Status" value="Error" status="error" />
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Info Card - Copyable Values
            </span>
            <div className="grid grid-cols-2 gap-2">
              <DetailHeader.InfoCard
                label="Instance ID"
                value="7284d9174e81431e93060a9bbcf2cdfd"
                copyable
              />
              <DetailHeader.InfoCard label="IP Address" value="192.168.1.100" copyable />
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Info Card - Basic Text
            </span>
            <div className="grid grid-cols-3 gap-2">
              <DetailHeader.InfoCard label="Host" value="compute-03" />
              <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025" />
              <DetailHeader.InfoCard label="Availability zone" value="nova" />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={4}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">구성 요소</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>Title</strong>: 리소스 이름. 텍스트가 길 경우 말줄임 처리.
                </li>
                <li>
                  <strong>Actions</strong>: 리소스에 대한 주요 액션 버튼. Secondary sm 크기.
                  ContextMenu로 추가 액션 제공.
                </li>
                <li>
                  <strong>InfoGrid</strong>: 4~6개의 주요 정보를 InfoCard로 표시. Status,
                  ID(copyable), 생성일 등.
                </li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">InfoCard 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>Status</strong>: StatusIndicator로 실시간 상태를 표시. 항상 첫 번째 카드에
                  배치.
                </li>
                <li>
                  <strong>ID</strong>: <code>copyable</code> 속성으로 클립보드 복사 기능을
                  제공합니다.
                </li>
                <li>
                  <strong>날짜</strong>: Created at, Updated at 등 시간 정보를 표시합니다.
                </li>
                <li>
                  <strong>권장 갯수</strong>: 4~6개 권장. 최대 12개까지 자동 멀티 행 배치 지원.
                </li>
              </ul>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                InfoGrid 배치 규칙 (갯수별 자동 레이아웃)
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                InfoCard 갯수에 따라 행 배치가 자동으로 결정됩니다. 한 행에 최대 4개까지 배치되며,
                5개 이상일 경우 멀티 행으로 분배됩니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        갯수
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        레이아웃
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { count: '1~4', layout: 'N', desc: '단일 행에 모두 배치' },
                      { count: '5', layout: '3 / 2', desc: '첫 행 3개, 두 번째 행 2개' },
                      { count: '6', layout: '4 / 2', desc: '첫 행 4개, 두 번째 행 2개' },
                      { count: '7', layout: '4 / 3', desc: '첫 행 4개, 두 번째 행 3개' },
                      { count: '8', layout: '4 / 4', desc: '두 행 균등 배치' },
                      { count: '9', layout: '4 / 3 / 2', desc: '3행 분배' },
                      { count: '10', layout: '4 / 4 / 2', desc: '3행 분배' },
                      { count: '11', layout: '4 / 4 / 3', desc: '3행 분배' },
                      { count: '12', layout: '4 / 4 / 4', desc: '3행 균등 배치 (최대)' },
                    ].map(({ count, layout, desc }) => (
                      <tr key={count} className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          {count}
                        </td>
                        <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">
                          {layout}
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                InfoCard 배치 순서
              </h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>1번째</strong>: Status (StatusIndicator) — 리소스 상태를 가장 먼저 파악
                </li>
                <li>
                  <strong>2번째</strong>: ID (copyable) — 리소스 식별자
                </li>
                <li>
                  <strong>3~4번째</strong>: 핵심 속성 (Host, Image, Network 등)
                </li>
                <li>
                  <strong>마지막</strong>: 시간 정보 (Created at, Updated at)
                </li>
              </ul>
            </VStack>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>container.padding: 16×12px</code> · <code>container.radius: 8px</code> ·{' '}
          <code>container.gap: 12px</code> · <code>title: 16px semibold</code> ·{' '}
          <code>actions.gap: 4px</code> · <code>info-grid.gap: 8px</code> ·{' '}
          <code>info-card.padding: 16×12px</code> · <code>info-card.radius: 8px</code> ·{' '}
          <code>info-card.gap: 6px</code>
        </div>
      }
      apiReference={detailHeaderProps}
      subComponentApis={[{ name: 'DetailHeader.InfoCard', props: detailHeaderInfoCardProps }]}
      relatedLinks={[
        {
          label: 'Section card',
          path: '/design/components/section-card',
          description: 'Container for grouping content',
        },
        { label: 'Tabs', path: '/design/components/tabs', description: 'Tab navigation' },
        { label: 'Button', path: '/design/components/button', description: 'Action buttons' },
      ]}
    />
  );
}
