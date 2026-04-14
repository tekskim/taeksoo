import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { Tooltip, VStack } from '@/design-system';
import {
  IconX,
  IconCopy,
  IconExternalLink,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';

/* ── Helper Components ── */

function CopyableText({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip content={copied ? 'Copied!' : value}>
      <span className="inline-flex items-center gap-1 max-w-[200px]">
        <span className="text-body-sm truncate">{value}</span>
        <button
          onClick={handleCopy}
          className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)] flex-shrink-0"
        >
          {copied ? (
            <IconCheck size={12} className="text-[var(--color-state-success)]" />
          ) : (
            <IconCopy size={12} />
          )}
        </button>
      </span>
    </Tooltip>
  );
}

function LinkText({ value }: { value: string }) {
  return (
    <Tooltip content={value}>
      <Link
        to="#"
        className="text-[var(--color-action-primary)] hover:underline inline-flex items-center gap-0.5 font-medium max-w-[200px]"
      >
        <span className="truncate">{value}</span>
        <IconExternalLink size={12} className="flex-shrink-0" />
      </Link>
    </Tooltip>
  );
}

function PopoverCard({
  title,
  type,
  children,
}: {
  title: string;
  type: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 flex-shrink-0">
      <div className="text-label-md text-[var(--color-text-muted)]">{type}</div>
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] w-[312px] p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-heading-h6 text-[var(--color-text-default)]">{title}</span>
          <button className="flex items-center justify-center w-[var(--window-control-size)] h-[var(--window-control-size)] rounded-[var(--window-control-radius)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] transition-colors -mr-2 -mt-2">
            <IconX size={12} stroke={1} />
          </button>
        </div>
        <div className="text-body-sm text-[var(--color-text-default)] space-y-1.5">{children}</div>
      </div>
    </div>
  );
}

function SectionDivider({ title, count }: { title: string; count: number }) {
  return (
    <div className="pt-2.5">
      <div className="border-t border-[var(--color-border-subtle)] pt-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-muted)]">
            {title} ({count})
          </span>
          <Link to="#" className="text-[var(--color-action-primary)] hover:underline text-label-sm">
            View detail
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--color-text-muted)]">{label}:</span>
      {children}
    </div>
  );
}

function HealthMonitor({
  healthy,
  degraded,
  error,
  pools,
}: {
  healthy: number;
  degraded: number;
  error: number;
  pools: { name: string; status: 'healthy' | 'degraded' | 'error' }[];
}) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: 'healthy' | 'degraded' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'text-[var(--color-state-success)]';
      case 'degraded':
        return 'text-[#F59E0B]';
      case 'error':
        return 'text-[var(--color-state-danger)]';
    }
  };

  const getStatusLabel = (status: 'healthy' | 'degraded' | 'error') => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
        >
          {expanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
          <span>Health Monitor:</span>
        </button>
        <span className="flex items-center gap-2">
          <span className="text-[var(--color-state-success)]">{healthy} Healthy</span>
          <span className="text-[#F59E0B]">{degraded} Degraded</span>
          <span className="text-[var(--color-state-danger)]">{error} Error</span>
        </span>
      </div>

      {expanded && (
        <div className="mt-1.5 space-y-1.5">
          {pools.map((pool, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className={getStatusColor(pool.status)}>{getStatusLabel(pool.status)}</span>
              <Link
                to="#"
                className="text-[var(--color-action-primary)] hover:underline inline-flex items-center gap-0.5"
              >
                {pool.name}
                <IconExternalLink size={12} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HealthMonitorEmpty() {
  return (
    <div className="flex justify-between items-start">
      <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
        <IconChevronRight size={14} />
        <span>Health Monitor:</span>
      </span>
      <span className="text-[var(--color-text-muted)]">-</span>
    </div>
  );
}

/* ── Page ── */

export function PopoverPage() {
  return (
    <ComponentPageTemplate
      title="Popover"
      description="네트워크 토폴로지 노드를 클릭하면 나타나는 상세 정보 카드. 리소스 상태, 이름, ID 등 핵심 정보를 빠르게 확인하고 관련 페이지로 이동할 수 있다."
      whenToUse={[
        '토폴로지 맵에서 노드를 클릭하여 리소스 상세 정보를 빠르게 확인할 때',
        '리소스 간의 관계(Routers, Subnets, Instances 등)를 섹션별로 조회할 때',
        'ID, IP 등의 값을 클립보드에 복사하거나 상세 페이지로 이동할 때',
      ]}
      whenNotToUse={[
        '단순 텍스트 설명만 필요한 경우 → Tooltip 사용',
        'Badge 오버플로우 목록만 필요한 경우 → Badge Tooltip(BadgeList) 사용',
        '메뉴 아이템 목록을 표시하는 경우 → ContextMenu 사용',
        '복잡한 폼 입력이 필요한 경우 → Drawer 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<PopoverCard title="Router">
  <Row label="Status"><span>Available</span></Row>
  <Row label="Name"><LinkText value="prod-apne2-edge" /></Row>
  <Row label="ID"><CopyableText value="rtr-prod-apne2-edge-001" /></Row>
  <SectionDivider title="Subnets" count={5} />
</PopoverCard>`}
        >
          <PopoverCard title="Router" type="">
            <Row label="Status">
              <span>Available</span>
            </Row>
            <Row label="Name">
              <LinkText value="prod-apne2-edge" />
            </Row>
            <Row label="ID">
              <CopyableText value="rtr-prod-apne2-edge-001" />
            </Row>
            <Row label="SNAT">
              <span>On</span>
            </Row>
            <Row label="External gateway">
              <LinkText value="extnet-apne2-public" />
            </Row>
            <SectionDivider title="Subnets" count={5} />
          </PopoverCard>
        </ComponentPreview>
      }
      examples={
        <VStack gap={12}>
          {/* ── All 5 Types ── */}
          <VStack gap={6}>
            <h3 className="text-heading-h4 text-[var(--color-text-default)]">
              Topology Node Types
            </h3>
            <span className="text-body-md text-[var(--color-text-muted)]">
              네트워크 토폴로지에서 사용되는 5가지 노드 타입별 Popover.
            </span>
            <div className="flex flex-wrap gap-6">
              {/* 1. External Network */}
              <PopoverCard title="External network" type="External Network">
                <Row label="Status">
                  <span>Available</span>
                </Row>
                <Row label="Name">
                  <LinkText value="extnet-apne2-public" />
                </Row>
                <Row label="ID">
                  <CopyableText value="extnet-apne2-pub-001" />
                </Row>
                <Row label="Admin state">
                  <span>Up</span>
                </Row>
                <SectionDivider title="Routers" count={2} />
              </PopoverCard>

              {/* 2. Router */}
              <PopoverCard title="Router" type="Router">
                <Row label="Status">
                  <span>Available</span>
                </Row>
                <Row label="Name">
                  <LinkText value="prod-apne2-edge" />
                </Row>
                <Row label="ID">
                  <CopyableText value="rtr-prod-apne2-edge-001" />
                </Row>
                <Row label="Admin state">
                  <span>Up</span>
                </Row>
                <Row label="SNAT">
                  <span>On</span>
                </Row>
                <Row label="External gateway">
                  <LinkText value="extnet-apne2-public" />
                </Row>
                <SectionDivider title="Subnets" count={5} />
              </PopoverCard>

              {/* 3. VPC */}
              <PopoverCard title="VPC" type="VPC">
                <Row label="Status">
                  <span>Available</span>
                </Row>
                <Row label="Name">
                  <LinkText value="prod-apne2-web" />
                </Row>
                <Row label="ID">
                  <CopyableText value="vpc-prod-apne2-web-001" />
                </Row>
                <Row label="Admin state">
                  <span>Up</span>
                </Row>
                <Row label="Shared">
                  <span>Off</span>
                </Row>
                <Row label="MTU">
                  <span>1500</span>
                </Row>
                <SectionDivider title="Subnets" count={5} />
              </PopoverCard>
            </div>

            <div className="flex flex-wrap gap-6">
              {/* 4. Subnet */}
              <PopoverCard title="Subnet" type="Subnet">
                <Row label="Status">
                  <span>Available</span>
                </Row>
                <Row label="Name">
                  <LinkText value="web-pub-2a" />
                </Row>
                <Row label="ID">
                  <CopyableText value="snet-prod-apne2-web-pub-2a" />
                </Row>
                <Row label="Gateway IP">
                  <CopyableText value="10.10.1.1" />
                </Row>
                <Row label="CIDR">
                  <CopyableText value="10.10.1.0/24" />
                </Row>
                <SectionDivider title="Routers" count={1} />
              </PopoverCard>

              {/* 5. Load Balancer */}
              <PopoverCard title="Load balancer" type="Load Balancer">
                <Row label="Status">
                  <span>Available</span>
                </Row>
                <Row label="Name">
                  <LinkText value="alb-prod-apne2-web-fe" />
                </Row>
                <Row label="ID">
                  <CopyableText value="alb-prod-apne2-web-fe-001" />
                </Row>
                <Row label="Admin state">
                  <span>Up</span>
                </Row>
                <Row label="VIP">
                  <CopyableText value="10.10.1.100" />
                </Row>
                <Row label="Floating IP">
                  <CopyableText value="203.0.113.50" />
                </Row>
                <SectionDivider title="Listeners" count={5} />
                <HealthMonitor
                  healthy={3}
                  degraded={2}
                  error={2}
                  pools={[
                    { name: 'pool1', status: 'error' },
                    { name: 'pool2', status: 'error' },
                    { name: 'pool3', status: 'degraded' },
                    { name: 'pool4', status: 'degraded' },
                    { name: 'pool5', status: 'healthy' },
                    { name: 'pool6', status: 'healthy' },
                    { name: 'pool7', status: 'healthy' },
                  ]}
                />
              </PopoverCard>

              {/* 6. Load Balancer (Empty) */}
              <PopoverCard title="Load balancer" type="Load Balancer (Empty)">
                <Row label="Status">
                  <span>Available</span>
                </Row>
                <Row label="Name">
                  <LinkText value="nlb-new-001" />
                </Row>
                <Row label="ID">
                  <CopyableText value="nlb-new-001" />
                </Row>
                <Row label="Admin state">
                  <span>Up</span>
                </Row>
                <Row label="VIP">
                  <CopyableText value="10.0.0.100" />
                </Row>
                <Row label="Floating IP">
                  <span className="text-[var(--color-text-muted)]">-</span>
                </Row>
                <div className="pt-2.5">
                  <div className="border-t border-[var(--color-border-subtle)]" />
                </div>
                <Row label="Listeners">
                  <span className="text-[var(--color-text-muted)]">-</span>
                </Row>
                <Row label="Pools">
                  <span className="text-[var(--color-text-muted)]">-</span>
                </Row>
                <HealthMonitorEmpty />
              </PopoverCard>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={10}>
          <VStack gap={4}>
            <h3 className="text-heading-h4 text-[var(--color-text-default)]">Usage Guidelines</h3>
            <DosDonts
              doItems={[
                '토폴로지 노드 클릭 시 화면 중앙에 Popover를 표시합니다.',
                '한 번에 하나의 Popover만 표시합니다. 다른 노드 클릭 시 교체됩니다.',
                '헤더 영역을 드래그하여 Popover를 이동할 수 있습니다.',
                'ID, IP 등 복사 가능한 값에는 CopyableText를 사용합니다.',
                'Name, External gateway 등 링크 가능한 값에는 LinkText를 사용합니다.',
                '관련 리소스 섹션(Routers, Subnets 등)에는 SectionDivider + View detail 링크를 사용합니다.',
              ]}
              dontItems={[
                '배경 클릭으로 Popover를 닫지 않습니다 (X 버튼으로만 닫기).',
                'Popover 안에 폼 입력 필드를 배치하지 않습니다.',
                '텍스트 설명만 필요한 경우 Popover 대신 Tooltip을 사용합니다.',
              ]}
            />
          </VStack>

          <VStack gap={4}>
            <h3 className="text-heading-h4 text-[var(--color-text-default)]">Behavior</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-body-md text-[var(--color-text-default)]">
              <VStack gap={2}>
                <span className="text-label-md">초기 위치</span>
                <ul className="space-y-1 text-[var(--color-text-muted)] text-body-sm">
                  <li>• 화면 중앙에 표시 (viewport center)</li>
                  <li>• 클릭한 노드 위치와 무관하게 중앙 고정</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <span className="text-label-md">드래그 이동</span>
                <ul className="space-y-1 text-[var(--color-text-muted)] text-body-sm">
                  <li>• 헤더 영역을 드래그하여 이동 가능</li>
                  <li>• 버튼/링크 클릭 시 드래그 비활성화</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <span className="text-label-md">열기/닫기</span>
                <ul className="space-y-1 text-[var(--color-text-muted)] text-body-sm">
                  <li>• 노드 클릭 시 열기, X 버튼으로 닫기</li>
                  <li>• 다른 노드 클릭 시 새 Popover로 교체</li>
                  <li>• 한 번에 하나만 표시</li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <span className="text-label-md">인터랙션</span>
                <ul className="space-y-1 text-[var(--color-text-muted)] text-body-sm">
                  <li>• 복사 버튼: 클릭 시 클립보드 복사</li>
                  <li>• 링크: 클릭 시 상세 페이지 이동</li>
                  <li>• Health Monitor: 클릭 시 펼침/접힘</li>
                </ul>
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      tokens={
        <VStack gap={4}>
          <VStack gap={1}>
            <span className="text-label-md text-[var(--color-text-default)]">Container</span>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono space-y-0.5">
              <div>width: 312px · padding: 16px · radius: 8px</div>
              <div>border: 1px solid var(--color-border-default)</div>
              <div>shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1)</div>
            </div>
          </VStack>
          <VStack gap={1}>
            <span className="text-label-md text-[var(--color-text-default)]">Typography</span>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono space-y-0.5">
              <div>Header: 14px/20px semibold · --color-text-default</div>
              <div>Label: 11px/16px regular · --color-text-muted</div>
              <div>Value: 11px/16px regular · --color-text-default</div>
              <div>Link: 11px/16px medium · --color-action-primary</div>
            </div>
          </VStack>
          <VStack gap={1}>
            <span className="text-label-md text-[var(--color-text-default)]">Spacing</span>
            <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] font-mono space-y-0.5">
              <div>Header → Content: 16px · Row gap: 6px</div>
              <div>Section divider: mt 12px, pt 12px, 1px border-subtle</div>
            </div>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Tooltip',
          path: '/design/components/tooltip',
          description: 'Text-only hover info',
        },
        {
          label: 'Context Menu',
          path: '/design/components/context-menu',
          description: 'Action menu',
        },
        { label: 'Drawer', path: '/design/components/drawer', description: 'Complex forms' },
        {
          label: 'Floating Card',
          path: '/design/components/floating-card',
          description: 'Draggable overlay card',
        },
      ]}
    />
  );
}
