import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, DetailHeader, VStack } from '@/design-system';
import {
  IconTerminal2,
  IconPlayerPlay,
  IconPlayerStop,
  IconRefresh,
  IconTrash,
  IconChevronDown,
} from '@tabler/icons-react';

export function DetailHeaderPage() {
  return (
    <ComponentPageTemplate
      title="Detail header"
      description="Page header component for resource detail views with title, actions, and info cards"
      relatedLinks={[
        {
          label: 'Section card',
          path: '/design/components/section-card',
          description: 'Container for grouping content',
        },
        { label: 'Tabs', path: '/design/components/tabs', description: 'Tab navigation' },
        { label: 'Button', path: '/design/components/button', description: 'Action buttons' },
      ]}
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>사용 정책</Label>
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
                    <strong>Status</strong>: StatusIndicator로 실시간 상태를 표시. 항상 첫 번째
                    카드에 배치.
                  </li>
                  <li>
                    <strong>ID</strong>: <code>copyable</code> 속성으로 클립보드 복사 기능을
                    제공합니다.
                  </li>
                  <li>
                    <strong>날짜</strong>: Created at, Updated at 등 시간 정보를 표시합니다.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>container.padding: 16×12px</code> · <code>container.radius: 8px</code> ·{' '}
            <code>container.gap: 12px</code> · <code>title: 16px semibold</code> ·{' '}
            <code>actions.gap: 4px</code> · <code>info-grid.gap: 8px</code> ·{' '}
            <code>info-card.padding: 16×12px</code> · <code>info-card.radius: 8px</code> ·{' '}
            <code>info-card.gap: 6px</code>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Instance Detail header (Figma Reference)</Label>
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
        </VStack>

        <VStack gap={3}>
          <Label>Info Card - Status indicator States</Label>
          <div className="grid grid-cols-4 gap-2">
            <DetailHeader.InfoCard label="Status" value="Active" status="active" />
            <DetailHeader.InfoCard label="Status" value="Shutoff" status="shutoff" />
            <DetailHeader.InfoCard label="Status" value="Degraded" status="degraded" />
            <DetailHeader.InfoCard label="Status" value="Error" status="error" />
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Info Card - Copyable Values</Label>
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
          <Label>Info Card - Basic Text</Label>
          <div className="grid grid-cols-3 gap-2">
            <DetailHeader.InfoCard label="Host" value="compute-03" />
            <DetailHeader.InfoCard label="Created at" value="Jul 25, 2025" />
            <DetailHeader.InfoCard label="Availability zone" value="nova" />
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
