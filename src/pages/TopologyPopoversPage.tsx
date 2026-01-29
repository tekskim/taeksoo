import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconX,
  IconCopy,
  IconExternalLink,
  IconArrowLeft,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';
import { Tooltip, Button, VStack, HStack } from '@/design-system';

// Helper component for copyable text
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

// Helper component for link text
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

// Popover card wrapper
function PopoverCard({
  title,
  type,
  children,
}: {
  title: string;
  type: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 flex-shrink-0">
      <div className="text-label-md text-[var(--color-text-muted)]">
        {type}
      </div>
      <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] w-[312px] p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-heading-h6 text-[var(--color-text-default)]">
            {title}
          </span>
          <button className="flex items-center justify-center w-[var(--window-control-size)] h-[var(--window-control-size)] rounded-[var(--window-control-radius)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] transition-colors -mr-2 -mt-2">
            <IconX size={12} stroke={1} />
          </button>
        </div>
        {/* Content */}
        <div className="text-body-sm text-[var(--color-text-default)] space-y-1.5">
          {children}
        </div>
      </div>
    </div>
  );
}

// Section divider with title
function SectionDivider({ title, count }: { title: string; count: number }) {
  return (
    <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
      <div className="flex items-center justify-between">
        <span className="text-[var(--color-text-muted)]">
          {title} ({count})
        </span>
        <Link
          to="#"
          className="text-[var(--color-action-primary)] hover:underline text-label-sm"
        >
          View detail
        </Link>
      </div>
    </div>
  );
}

// Row component
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--color-text-muted)]">{label}:</span>
      {children}
    </div>
  );
}

// Health Monitor component with expand/collapse
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
        return 'text-[#F59E0B]'; // amber/warning
      case 'error':
        return 'text-[var(--color-state-danger)]';
    }
  };

  const getStatusLabel = (status: 'healthy' | 'degraded' | 'error') => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
      {/* Header Row */}
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

      {/* Expanded Pool List */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] space-y-1.5">
          {pools.map((pool, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className={getStatusColor(pool.status)}>
                {getStatusLabel(pool.status)}
              </span>
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

// Health Monitor Empty state
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

export function TopologyPopoversPage() {
  return (
    <div className="h-screen overflow-auto bg-[var(--color-surface-subtle)]">
      {/* Header */}
      <div className="bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <HStack gap={4} align="center">
            <Link to="/">
              <Button variant="ghost" size="sm" leftIcon={<IconArrowLeft size={16} />}>
                Back
              </Button>
            </Link>
            <VStack gap={1}>
              <h1 className="text-heading-h4 text-[var(--color-text-default)]">
                Topology Popovers
              </h1>
              <p className="text-body-md text-[var(--color-text-muted)]">
                네트워크 토폴로지에서 사용되는 5가지 팝오버 타입
              </p>
            </VStack>
          </HStack>
        </div>
      </div>

      {/* Production Implementation Spec */}
      <div className="px-8 pt-8 space-y-6">
        {/* Container Spec */}
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-6 max-w-5xl mx-auto">
          <h2 className="text-heading-h6 text-[var(--color-text-default)] mb-4">
            프로덕션 구현 스펙
          </h2>

          {/* Container */}
          <div className="space-y-6">
            <div>
              <h3 className="text-label-lg text-[var(--color-text-default)] mb-3">1. 컨테이너</h3>
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4 font-mono text-body-sm space-y-1">
                <div><span className="text-[var(--color-text-muted)]">width:</span> 312px</div>
                <div><span className="text-[var(--color-text-muted)]">padding:</span> 16px</div>
                <div><span className="text-[var(--color-text-muted)]">background:</span> var(--color-surface-default) <span className="text-[var(--color-text-subtle)]">// #FFFFFF</span></div>
                <div><span className="text-[var(--color-text-muted)]">border:</span> 1px solid var(--color-border-default) <span className="text-[var(--color-text-subtle)]">// #E5E5E5</span></div>
                <div><span className="text-[var(--color-text-muted)]">border-radius:</span> var(--radius-lg) <span className="text-[var(--color-text-subtle)]">// 8px</span></div>
                <div><span className="text-[var(--color-text-muted)]">box-shadow:</span> 0px 0px 4px 0px rgba(0, 0, 0, 0.1)</div>
                <div><span className="text-[var(--color-text-muted)]">z-index:</span> 50</div>
                <div><span className="text-[var(--color-text-muted)]">position:</span> fixed</div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-label-lg text-[var(--color-text-default)] mb-3">2. 타이포그래피</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 text-[var(--color-text-muted)] font-medium">요소</th>
                      <th className="text-left py-2 pr-4 text-[var(--color-text-muted)] font-medium">Font Size</th>
                      <th className="text-left py-2 pr-4 text-[var(--color-text-muted)] font-medium">Line Height</th>
                      <th className="text-left py-2 pr-4 text-[var(--color-text-muted)] font-medium">Font Weight</th>
                      <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">Color</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-default)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">헤더 제목</td>
                      <td className="py-2 pr-4 font-mono">14px</td>
                      <td className="py-2 pr-4 font-mono">20px</td>
                      <td className="py-2 pr-4 font-mono">600 (semibold)</td>
                      <td className="py-2 font-mono">--color-text-default</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">라벨 (Status:, Name: 등)</td>
                      <td className="py-2 pr-4 font-mono">11px</td>
                      <td className="py-2 pr-4 font-mono">16px</td>
                      <td className="py-2 pr-4 font-mono">400 (regular)</td>
                      <td className="py-2 font-mono">--color-text-muted</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">값 (텍스트)</td>
                      <td className="py-2 pr-4 font-mono">11px</td>
                      <td className="py-2 pr-4 font-mono">16px</td>
                      <td className="py-2 pr-4 font-mono">400 (regular)</td>
                      <td className="py-2 font-mono">--color-text-default</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">링크 (Name, External gateway)</td>
                      <td className="py-2 pr-4 font-mono">11px</td>
                      <td className="py-2 pr-4 font-mono">16px</td>
                      <td className="py-2 pr-4 font-mono">500 (medium)</td>
                      <td className="py-2 font-mono">--color-action-primary</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">섹션 제목 (Routers (2))</td>
                      <td className="py-2 pr-4 font-mono">11px</td>
                      <td className="py-2 pr-4 font-mono">16px</td>
                      <td className="py-2 pr-4 font-mono">400 (regular)</td>
                      <td className="py-2 font-mono">--color-text-muted</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">View detail 링크</td>
                      <td className="py-2 pr-4 font-mono">11px</td>
                      <td className="py-2 pr-4 font-mono">16px</td>
                      <td className="py-2 pr-4 font-mono">500 (medium)</td>
                      <td className="py-2 font-mono">--color-action-primary</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h3 className="text-label-lg text-[var(--color-text-default)] mb-3">3. 간격</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4 font-mono text-body-sm space-y-1">
                  <div className="text-label-sm text-[var(--color-text-default)] mb-2">컨테이너</div>
                  <div><span className="text-[var(--color-text-muted)]">헤더-컨텐츠 간격:</span> 16px</div>
                  <div><span className="text-[var(--color-text-muted)]">행 간격:</span> 6px</div>
                </div>
                <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4 font-mono text-body-sm space-y-1">
                  <div className="text-label-sm text-[var(--color-text-default)] mb-2">섹션 구분선</div>
                  <div><span className="text-[var(--color-text-muted)]">상단 마진:</span> 12px</div>
                  <div><span className="text-[var(--color-text-muted)]">상단 패딩:</span> 12px</div>
                  <div><span className="text-[var(--color-text-muted)]">border:</span> 1px solid --color-border-subtle</div>
                </div>
              </div>
            </div>

            {/* Value Components */}
            <div>
              <h3 className="text-label-lg text-[var(--color-text-default)] mb-3">4. 값 컴포넌트</h3>
              <div className="space-y-3">
                <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
                  <div className="text-label-sm text-[var(--color-text-default)] mb-2">CopyableText (ID, IP 등)</div>
                  <ul className="text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>• max-width: <code className="bg-[var(--color-surface-muted)] px-1 rounded">200px</code></li>
                    <li>• 텍스트 truncate (말줄임)</li>
                    <li>• 복사 아이콘: 12px, --color-text-subtle</li>
                    <li>• 복사 완료 시: IconCheck (green), 2초 후 원복</li>
                    <li>• hover 시 툴팁에 전체 값 표시</li>
                  </ul>
                </div>
                <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
                  <div className="text-label-sm text-[var(--color-text-default)] mb-2">LinkText (Name, Gateway 등)</div>
                  <ul className="text-body-sm text-[var(--color-text-muted)] space-y-1">
                    <li>• max-width: <code className="bg-[var(--color-surface-muted)] px-1 rounded">200px</code></li>
                    <li>• 텍스트 truncate (말줄임)</li>
                    <li>• 외부 링크 아이콘: 12px</li>
                    <li>• hover 시 underline + 툴팁</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Status Colors */}
            <div>
              <h3 className="text-label-lg text-[var(--color-text-default)] mb-3">5. 상태 색상 (Health Monitor)</h3>
              <div className="flex gap-6 text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--color-state-success)]"></span>
                  <span>Healthy: <code className="font-mono">--color-state-success</code></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
                  <span>Degraded: <code className="font-mono">#F59E0B</code></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--color-state-danger)]"></span>
                  <span>Error: <code className="font-mono">--color-state-danger</code></span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div>
              <h3 className="text-label-lg text-[var(--color-text-default)] mb-3">6. 닫기 버튼</h3>
              <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4 font-mono text-body-sm space-y-1">
                <div><span className="text-[var(--color-text-muted)]">size:</span> var(--window-control-size) <span className="text-[var(--color-text-subtle)]">// 24px</span></div>
                <div><span className="text-[var(--color-text-muted)]">border-radius:</span> var(--window-control-radius) <span className="text-[var(--color-text-subtle)]">// 4px</span></div>
                <div><span className="text-[var(--color-text-muted)]">icon:</span> IconX, 12px, stroke: 1</div>
                <div><span className="text-[var(--color-text-muted)]">position offset:</span> margin-right: -8px, margin-top: -8px</div>
                <div><span className="text-[var(--color-text-muted)]">hover:</span> background: --color-surface-subtle</div>
              </div>
            </div>
          </div>
        </div>

        {/* Behavior Spec */}
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-6 max-w-5xl mx-auto">
          <h2 className="text-heading-h6 text-[var(--color-text-default)] mb-4">
            동작 스펙
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-body-md text-[var(--color-text-default)]">
            {/* Initial Position */}
            <div className="space-y-2">
              <h3 className="text-label-md text-[var(--color-text-default)]">초기 위치</h3>
              <ul className="space-y-1 text-[var(--color-text-muted)]">
                <li>• 화면 중앙에 표시 (viewport center)</li>
                <li>• 클릭한 노드 위치와 무관하게 중앙 고정</li>
                <li>• 팝오버 크기 기준으로 정확한 중앙 계산</li>
              </ul>
            </div>

            {/* Draggable */}
            <div className="space-y-2">
              <h3 className="text-label-md text-[var(--color-text-default)]">드래그 이동</h3>
              <ul className="space-y-1 text-[var(--color-text-muted)]">
                <li>• 헤더 영역을 드래그하여 이동 가능</li>
                <li>• 버튼/링크 클릭 시 드래그 비활성화</li>
                <li>• 드래그 중 커서: <code className="bg-[var(--color-surface-muted)] px-1 rounded">grabbing</code></li>
                <li>• 대기 중 커서: <code className="bg-[var(--color-surface-muted)] px-1 rounded">grab</code></li>
              </ul>
            </div>

            {/* Open/Close */}
            <div className="space-y-2">
              <h3 className="text-label-md text-[var(--color-text-default)]">열기/닫기</h3>
              <ul className="space-y-1 text-[var(--color-text-muted)]">
                <li>• 노드 클릭 시 팝오버 열기</li>
                <li>• X 버튼 클릭으로 닫기</li>
                <li>• 다른 노드 클릭 시 새 팝오버로 교체</li>
                <li>• 배경 클릭 시 닫히지 않음</li>
                <li>• 한 번에 하나의 팝오버만 표시</li>
              </ul>
            </div>

            {/* Interactions */}
            <div className="space-y-2">
              <h3 className="text-label-md text-[var(--color-text-default)]">인터랙션</h3>
              <ul className="space-y-1 text-[var(--color-text-muted)]">
                <li>• 복사 버튼: 클릭 시 클립보드 복사</li>
                <li>• 링크: 클릭 시 상세 페이지 이동</li>
                <li>• Health Monitor: 클릭 시 펼침/접힘</li>
                <li>• View detail: 클릭 시 목록 페이지 이동</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Fields by Type */}
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-6 max-w-5xl mx-auto">
          <h2 className="text-heading-h6 text-[var(--color-text-default)] mb-4">
            타입별 데이터 필드
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 text-[var(--color-text-muted)] font-medium">필드</th>
                  <th className="text-center py-2 px-2 text-[var(--color-text-muted)] font-medium">External Network</th>
                  <th className="text-center py-2 px-2 text-[var(--color-text-muted)] font-medium">Router</th>
                  <th className="text-center py-2 px-2 text-[var(--color-text-muted)] font-medium">VPC</th>
                  <th className="text-center py-2 px-2 text-[var(--color-text-muted)] font-medium">Subnet</th>
                  <th className="text-center py-2 px-2 text-[var(--color-text-muted)] font-medium">Load Balancer</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-default)]">
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">Status</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">Name (링크)</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">ID (복사)</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">Admin state</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">SNAT</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">External gateway (링크)</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">Shared</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">MTU</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">Gateway IP (복사)</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">CIDR (복사)</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">VIP (복사)</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4">Floating IP (복사)</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">섹션: Routers</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">섹션: Subnets</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">섹션: Instances</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">섹션: Load balancers</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                  <td className="py-2 px-2 text-center">-</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-medium">섹션: Listeners</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Health Monitor (펼침/접힘)</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">-</td>
                  <td className="py-2 px-2 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="flex flex-wrap gap-6 justify-center">
          {/* 1. External Network */}
          <PopoverCard title="External network" type="1. External Network">
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
          <PopoverCard title="Router" type="2. Router">
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
          <PopoverCard title="VPC" type="3. VPC">
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

          {/* 4. Subnet */}
          <PopoverCard title="Subnet" type="4. Subnet">
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
            <SectionDivider title="Instances" count={3} />
            <SectionDivider title="Load balancers" count={1} />
          </PopoverCard>

          {/* 5. Load Balancer */}
          <PopoverCard title="Load balancer" type="5. Load Balancer">
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

          {/* 6. Load Balancer (Empty State) */}
          <PopoverCard title="Load balancer" type="6. Load Balancer (Empty)">
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
            <Row label="Listeners">
              <span className="text-[var(--color-text-muted)]">-</span>
            </Row>
            <Row label="Pools">
              <span className="text-[var(--color-text-muted)]">-</span>
            </Row>
            <HealthMonitorEmpty />
          </PopoverCard>
        </div>
      </div>
    </div>
  );
}

export default TopologyPopoversPage;
