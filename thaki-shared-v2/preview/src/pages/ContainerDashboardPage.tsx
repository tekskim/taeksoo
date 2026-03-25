import { useState, useRef, type MouseEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { Badge } from '@shared/components/Badge';
import { Tooltip } from '@shared/components/Tooltip';
import { Tabs, Tab } from '@shared/components/Tabs';
import type { TableColumn } from '@shared/components/Table/Table.types';
import { IconExternalLink, IconHelpCircle } from '@tabler/icons-react';

/* ----------------------------------------
   Capacity Progress bar Component
   ---------------------------------------- */

type CapacityStatus = 'success' | 'warning' | 'danger';

interface CapacityProgressBarProps {
  label: string;
  used: number;
  total: number;
  unit: string;
  percentage: number;
}

function CapacityProgressBar({ label, used, total, unit, percentage }: CapacityProgressBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const getStatus = (pct: number): CapacityStatus => {
    if (pct >= 95) return 'danger';
    if (pct >= 70) return 'warning';
    return 'success';
  };

  const status = getStatus(percentage);

  const statusColors: Record<CapacityStatus, { bg: string; fill: string; text: string }> = {
    success: {
      bg: 'var(--color-green-100)',
      fill: 'var(--color-state-success)',
      text: 'var(--color-green-600)',
    },
    warning: {
      bg: 'var(--color-orange-100)',
      fill: 'var(--color-state-warning)',
      text: 'var(--color-orange-600)',
    },
    danger: {
      bg: 'var(--color-red-100)',
      fill: 'var(--color-state-danger)',
      text: 'var(--color-red-600)',
    },
  };

  const colors = statusColors[status];

  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-[var(--spacing-2)] w-full cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-label-md text-[var(--color-text-default)]">{label}</span>

        <div className="flex items-center gap-[var(--spacing-2)]">
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            {used} / {total} {unit}
          </span>
          <div
            className="flex items-center px-1.5 py-0.5 rounded-[var(--radius-md)]"
            style={{ backgroundColor: colors.bg }}
          >
            <span className="text-label-sm" style={{ color: colors.text }}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-[var(--progress-bar-height)] w-full">
        <div
          className="absolute inset-0 rounded-[var(--progress-bar-radius)]"
          style={{ backgroundColor: 'var(--color-border-subtle)' }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-[var(--progress-bar-radius)] transition-all"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: colors.fill,
            minWidth: percentage > 0 ? 4 : 0,
          }}
        />

        {showTooltip && (
          <div
            className="absolute z-10 backdrop-blur-[40px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[6px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-1.5 flex flex-col gap-1 pointer-events-none"
            style={{ left: mousePos.x + 12, top: mousePos.y - 40 }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-[5px] h-[5px] rounded-[1px]"
                style={{ backgroundColor: colors.fill }}
              />
              <span className="text-body-sm text-[var(--color-text-default)] whitespace-nowrap">
                Used: {used} {unit} ({percentage}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[5px] h-[5px] rounded-[1px] bg-[var(--color-border-subtle)]" />
              <span className="text-body-sm text-[var(--color-text-default)] whitespace-nowrap">
                Total: {total} {unit}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Dashboard Card Component
   ---------------------------------------- */

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  bgColor?: string;
  actions?: ReactNode;
}

function Card({
  title,
  children,
  className = '',
  bgColor = 'bg-[var(--color-surface-default)]',
  actions,
}: CardProps) {
  return (
    <div
      className={`p-4 rounded-2xl border border-[var(--color-border-default)] ${bgColor} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h6 className="text-heading-h6">{title}</h6>
        {actions}
      </div>
      {children}
    </div>
  );
}

/* ----------------------------------------
   Events Table Data
   ---------------------------------------- */

interface EventRow extends Record<string, unknown> {
  id: string;
  reason: string;
  object: string;
  message: string;
  name: string;
  firstSeen: string;
  lastSeen: string;
  count: number;
}

const eventsData: EventRow[] = [
  {
    id: '1',
    reason: 'Pulling',
    object: 'Pod object',
    message: 'Pulling image "nginx:lastest"',
    name: 'testpod.1872cb50f1f3985b',
    firstSeen: '2d8h',
    lastSeen: '5m2s',
    count: 666,
  },
  {
    id: '2',
    reason: 'Failed',
    object: 'Pod object',
    message:
      'Failed to pull image "nginx:lastest": rpc error: code = NotFound desc = failed to pull and unpack image...',
    name: 'testpod.1872cb51519dc95b',
    firstSeen: '2d8h',
    lastSeen: '5m2s',
    count: 664,
  },
  {
    id: '3',
    reason: 'FailedGetScale',
    object: 'HorizontalPodAutoscaler object',
    message: 'Back-off pulling image "nginx:lastest"',
    name: 'test.1870aa1e813aa422',
    firstSeen: '9d',
    lastSeen: '54s',
    count: 53607,
  },
  {
    id: '4',
    reason: 'BackOff',
    object: 'Pod object',
    message: 'Error: ImagePullBackOff',
    name: 'testpod.1872cb51804912b6',
    firstSeen: '2d8h',
    lastSeen: '4s',
    count: 14495,
  },
  {
    id: '5',
    reason: 'Failed',
    object: 'Pod object',
    message: 'Error: ImagePullBackOff',
    name: 'testpod.1872cb5180493d50',
    firstSeen: '2d8h',
    lastSeen: '4s',
    count: 14495,
  },
];

const eventsColumns: TableColumn[] = [
  { key: 'reason', header: 'Reason', sortable: true },
  { key: 'object', header: 'Object', sortable: true },
  { key: 'message', header: 'Message', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'firstSeen', header: 'First seen', sortable: true },
  { key: 'lastSeen', header: 'Last seen', sortable: true },
  { key: 'count', header: 'Count', sortable: true, align: 'right' },
];

/* ----------------------------------------
   Container Dashboard Page
   ---------------------------------------- */

export function ContainerDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'events';
  const setActiveTab = (tab: string) => setSearchParams({ tab }, { replace: true });

  const [currentPage, setCurrentPage] = useState(1);

  const col = (key: string) => eventsColumns.find((c) => c.key === key)!;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card
          title="Basic information"
          bgColor="bg-[var(--color-surface-subtle)]"
          className="flex flex-col"
        >
          <h3 className="text-heading-h2 text-[var(--color-text-default)]">k3s-cluster</h3>
          <div className="space-y-4 mt-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Architecture</span>
                <span className="text-body-md text-[var(--color-text-default)]">amd64</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Kubernetes version
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">v1.33.4+k3s1</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">
                  Total resources
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">295</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Created at</span>
                <span className="text-body-md text-[var(--color-text-default)]">Nov 9, 2025</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)] flex items-center gap-1">
                  Deployments
                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">15</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-label-sm text-[var(--color-text-subtle)] flex items-center gap-1">
                  Nodes
                  <IconExternalLink size={12} className="text-[var(--color-action-primary)]" />
                </span>
                <span className="text-body-md text-[var(--color-text-default)]">1</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Capacity">
          <div className="flex flex-col gap-5">
            <CapacityProgressBar
              label="CPU (Used)"
              used={0.26}
              total={8}
              unit="cores"
              percentage={3.3}
            />
            <CapacityProgressBar
              label="CPU (Reserved)"
              used={3.6}
              total={16.0}
              unit="GiB"
              percentage={50.2}
            />
            <CapacityProgressBar
              label="Memory (Used)"
              used={12.0}
              total={16.0}
              unit="GiB"
              percentage={75}
            />
            <CapacityProgressBar
              label="Memory (Reserved)"
              used={15}
              total={16}
              unit="GiB"
              percentage={93.8}
            />
            <CapacityProgressBar label="Pods" used={51} total={110} unit="" percentage={46.4} />
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <Card title="Control plane components">
          <div className="flex gap-3">
            {(['Etcd', 'Scheduler', 'Controller manager'] as const).map((name) => {
              const tooltips: Record<string, string> = {
                Etcd: 'etcd is a distributed key-value store used by Kubernetes to store all cluster state and configuration data.',
                Scheduler:
                  'Scheduler assigns pods to nodes based on resource requirements, constraints, and scheduling policies.',
                'Controller manager':
                  'Controller manager runs background controllers that ensure cluster resources reach their desired state.',
              };
              return (
                <div
                  key={name}
                  className="flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3 relative min-w-0"
                >
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Badge theme="white" size="sm">
                      Active
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0 pr-14">
                    <span className="text-label-sm leading-4 text-[var(--color-text-subtle)] whitespace-nowrap flex items-center gap-1">
                      {name}
                      <Tooltip content={tooltips[name]} direction="top" focusable={false}>
                        <span className="inline-flex">
                          <IconHelpCircle
                            size={12}
                            className="text-[var(--color-text-subtle)] cursor-help"
                          />
                        </span>
                      </Tooltip>
                    </span>
                    <span className="text-body-md leading-4 font-normal truncate text-[var(--color-text-default)]">
                      Uptime: 15d 4h 23m
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card
        title="Events & Secrets"
        actions={
          <Button variant="secondary" size="sm">
            Full events list
          </Button>
        }
      >
        <Tabs
          activeTabId={activeTab}
          onChange={setActiveTab}
          variant="line"
          size="sm"
          contentClassName="pt-0"
        >
          <Tab id="events" label="Events">
            <div className="flex flex-col gap-3">
              <div className="flex justify-start">
                <Pagination
                  totalCount={eventsData.length}
                  size={10}
                  currentAt={currentPage}
                  onPageChange={setCurrentPage}
                  onSettingClick={() => {}}
                  totalCountLabel="items"
                />
              </div>
              <Table columns={eventsColumns} rows={eventsData} tableLayout="auto">
                {eventsData.map((row) => (
                  <Table.Tr key={row.id} rowData={row}>
                    <Table.Td rowData={row} column={col('reason')}>
                      {row.reason}
                    </Table.Td>
                    <Table.Td rowData={row} column={col('object')}>
                      <div className="min-w-0">
                        <span
                          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block"
                          title={row.object}
                        >
                          {row.object}
                        </span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={col('message')}>
                      <div className="min-w-0">
                        <span className="truncate block" title={row.message ?? ''}>
                          {row.message}
                        </span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={col('name')}>
                      <div className="min-w-0">
                        <span
                          className="text-[var(--color-action-primary)] font-medium cursor-pointer hover:underline truncate block"
                          title={row.name}
                        >
                          {row.name}
                        </span>
                      </div>
                    </Table.Td>
                    <Table.Td rowData={row} column={col('firstSeen')}>
                      {row.firstSeen}
                    </Table.Td>
                    <Table.Td rowData={row} column={col('lastSeen')}>
                      {row.lastSeen}
                    </Table.Td>
                    <Table.Td rowData={row} column={col('count')}>
                      {row.count}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table>
            </div>
          </Tab>
          <Tab id="secrets" label="Secrets">
            <div className="text-center py-8 text-[var(--color-text-muted)]">No secrets found</div>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
}
