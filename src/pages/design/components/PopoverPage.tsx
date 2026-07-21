import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { NotionRenderer } from '../_shared/NotionRenderer';
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
    <div className="pt-1">
      <div className="border-t border-[var(--color-border-subtle)] pt-2.5" />
      <div className="flex justify-between items-start">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
        >
          {expanded ? (
            <IconChevronDown size={12} strokeWidth={2} />
          ) : (
            <IconChevronRight size={12} strokeWidth={2} />
          )}
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
    <div className="pt-1">
      <div className="border-t border-[var(--color-border-subtle)] pt-2.5" />
      <div className="flex justify-between items-start">
        <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
          <IconChevronRight size={12} strokeWidth={2} />
          <span>Health Monitor:</span>
        </span>
        <span className="text-[var(--color-text-muted)]">-</span>
      </div>
    </div>
  );
}

const POPOVER_GUIDELINES = `## Overview
**Popover(정보 패널)**은 사용자가 **트리거**(버튼, 노드, 행 등)를 눌렀을 때 **그 근처**에 뜨는 **경량 정보·보조 액션**용 표면이다. **딤 없이** 맥락을 유지하고, **닫기 전까지 열린 상태**로 읽기·복사·링크 이동을 할 수 있다.

---

## Composition

\`\`\`plain text
[헤더: 제목 · 닫기]
[본문: 라벨–값, 복사 가능 필드, 링크]
[선택: 섹션 구분 · View detail · 접이식 블록]
\`\`\`

| 요소 | 역할 |
| --- | --- |
| 헤더 | 리소스 유형·이름 등 **식별** |
| 라벨–값 | 핵심 속성 **스캔 가능**하게 나열 |
| 복사 필드 | ID, IP, CIDR 등 **운영 복사**가 잦은 값 |
| 링크 | 상세·목록 등 이동 |
| 섹션 / View detail | 연관 리소스 묶음·목록으로 이동 진입점 |
| 접이식 블록 | (예: Health Monitor) 하위 목록이 길어질 수 있을 때 |

---

## States (패널·세션)

| 상태 | 설명 |
| --- | --- |
| Closed | 패널 없음 |
| Open | 트리거에 대응하는 패널 표시 |
| Section expanded | 접이식 영역 펼침 |

---

## Behavior

### 열기·닫기
- **트리거 클릭**(또는 제품이 정한 진입)으로 연다.
- **닫기(X)**로 닫는다.
- **팝오버 외부 공간 클릭**(패널 밖·캔버스·외부 버튼 등) 시 **닫는다**.
- (예: 토폴로지) **다른 노드/다른 트리거**를 누르면 **해당 대상 기준으로 갱신**한다.

### 인터랙션
- **링크·이동**: 링크를 누르면 상세·목록·설정 등으로 이동하고, 이동 시 Popover를 **자동으로 닫는다**. 새 탭 또는 같은 화면 이동은 제품에 따른다.
- **복사**: 값 옆에 **복사 아이콘 버튼**을 둔다.
- **접기/펼치기**: 펼침 상태는 **이번에 연 패널 세션** 안에서만 유효. 패널을 닫았다가 다시 열면 **기본은 접힌 상태**이다.

### 배치·레이아웃
- 패널은 **트리거(클릭한 요소) 기준 근접** 배치한다(오프셋·플립·화살표는 디자인 시스템 구현을 따른다).
- 패널 **드래그로 위치 변경**은 **지원하지 않는다**.
- **한 뷰에서 동시에 하나의 Popover**만 연다(다른 트리거는 **내용 교체** 또는 **닫고 열기** — 제품별로 통일).

---

## Related

| 항목 | 유형 | 비고 |
| --- | --- | --- |
| Tooltip | Component | 짧은 비지속 힌트 |
| Modal | Component | 딤·차단형 |
| Drawer | Component | 측면·긴 작업 |
| DS Popover | Component | 앵커·포지션 등 구현 기반 |
`;

/* ── Page ── */

export function PopoverPage() {
  return (
    <ComponentPageTemplate
      title="Popover"
      description="Popover(정보 패널)은 트리거를 눌렀을 때 그 근처에 뜨는 경량 정보·보조 액션용 표면이다. 딤 없이 맥락을 유지하고, 닫기 전까지 열린 상태로 읽기·복사·링크 이동을 할 수 있다."
      whenToUse={[
        '트리거 옆에서 요약 속성·식별자·상태를 보여주면 될 때',
        '복사·상세 이동·목록 이동 등 짧은 보조 액션이 있을 때',
        '한 번에 하나의 패널이면 충분할 때',
      ]}
      whenNotToUse={[
        '차단형 확인·긴 폼·필수 입력이 필요할 때 (→ Modal / Drawer)',
        '한 줄 힌트만 필요하고 포인터를 떼면 사라져도 될 때 (→ Tooltip)',
        '전체 로그·긴 문서 (→ 상세 페이지 / Drawer)',
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
        <VStack gap={8}>
          <NotionRenderer markdown={POPOVER_GUIDELINES} />
          <VStack gap={4}>
            <h3 className="text-heading-h4 text-[var(--color-text-default)]">Usage Guidelines</h3>
            <DosDonts
              doItems={['트리거 맥락을 유지한 채 짧은 읽기·복사·이동만 필요할 때 쓴다.']}
              dontItems={[
                '차단형 확인·긴 폼·필수 입력·전체 로그/문서는 Popover에 넣지 않는다 (→ Modal / Drawer / 상세 페이지).',
                '한 줄 힌트만 필요하면 Popover 대신 Tooltip을 쓴다.',
              ]}
            />
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
          description: '짧은 비지속 힌트',
        },
        {
          label: 'Modal',
          path: '/design/components/modal',
          description: '딤·차단형',
        },
        { label: 'Drawer', path: '/design/components/drawer', description: '측면·긴 작업' },
      ]}
    />
  );
}
