import { useMemo, useState, useCallback } from 'react';
import { Badge } from '@shared/components/Badge';
import { StatusIndicator } from '@shared/components/StatusIndicator';
import { Table } from '@shared/components/Table';
import { Pagination } from '@shared/components/Pagination';
import { ProgressBar } from '@shared/components/ProgressBar';
import { Tag } from '@shared/components/Tag';
import { CopyButton } from '@shared/components/CopyButton';
import { InfoContainer } from '@shared/components/InfoContainer';
import { SectionCard } from '@shared/components/SectionCard';
import type { SectionCardField } from '@shared/components/SectionCard';
import { MultiItemDisplay } from '@shared/components/MultiItemDisplay';
import { Button } from '@shared/components/Button';
import { CheckIcon } from '@shared/components/Icon/svg/wrapped';
import type { TableColumn, SortOrder } from '@shared/components/Table/Table.types';

const badgeThemes = ['blu', 'gre', 'ylw', 'red', 'gry'] as const;
const badgeSizes = ['sm', 'md', 'lg'] as const;
const badgeTypes = ['subtle', 'solid'] as const;

interface DemoRow {
  id: string;
  name: string;
  region: string;
  score: number;
  updatedAt: string;
  [key: string]: unknown;
}

const tableRows: DemoRow[] = [
  { id: '1', name: 'alpha', region: 'eu-1', score: 12, updatedAt: '2025-01-02' },
  { id: '2', name: 'bravo', region: 'us-1', score: 40, updatedAt: '2025-03-10' },
  { id: '3', name: 'charlie', region: 'us-2', score: 7, updatedAt: '2025-02-15' },
  { id: '4', name: 'delta', region: 'eu-1', score: 99, updatedAt: '2025-01-20' },
  { id: '5', name: 'echo', region: 'ap-1', score: 55, updatedAt: '2025-03-01' },
];

const tableColumns: TableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'region', header: 'Region', sortable: true },
  { key: 'score', header: 'Score', sortable: true },
  { key: 'updatedAt', header: 'Updated', sortable: true },
];

const statusDemoVariants = [
  'active',
  'error',
  'shutoff',
  'building',
  'pending',
  'suspended',
] as const;

const flatFields: SectionCardField[] = [
  { label: 'Resource ID', value: 'res-7f3a9c2b' },
  { label: 'Region', value: 'ap-northeast-2' },
  { label: 'Created', value: '2025-03-01 09:00:00' },
];

export function DesignDataDisplayPage() {
  const [sort, setSort] = useState<string>('name');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleSortChange = useCallback((nextSort: string | null, nextOrder: SortOrder) => {
    setSort(nextSort ?? '');
    setOrder(nextOrder);
  }, []);

  const sortedRows = useMemo(() => {
    const copy = [...tableRows];
    if (!sort) return copy;
    return copy.sort((a, b) => {
      const av = a[sort as keyof DemoRow];
      const bv = b[sort as keyof DemoRow];
      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 'asc' ? av - bv : bv - av;
      }
      const as = String(av ?? '');
      const bs = String(bv ?? '');
      return order === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
    });
  }, [sort, order]);

  const totalCount = 47;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] leading-[32px] font-semibold text-text m-0">Data display</h1>
        <p className="text-13 leading-20 text-text-muted m-0">
          Live examples of shared-v2 read-only and data components.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Badge</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Badge</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-6">
          {badgeTypes.map((type) => (
            <div key={type} className="flex flex-col gap-3">
              <span className="text-12 font-medium text-text-muted capitalize">{type}</span>
              <div className="flex flex-col gap-4">
                {badgeSizes.map((size) => (
                  <div key={size} className="flex flex-wrap gap-2 items-center">
                    {badgeThemes.map((theme) => (
                      <Badge key={theme} theme={theme} size={size} type={type}>
                        {theme}
                      </Badge>
                    ))}
                    <Badge
                      theme="gre"
                      size={size}
                      type={type}
                      layout="left-icon"
                      icon={<CheckIcon />}
                    >
                      OK
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">
            StatusIndicator
          </h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            @shared/components/StatusIndicator
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-12 text-text-muted">layout=&quot;leftIcon&quot;</span>
            <div className="flex flex-wrap gap-3 items-center">
              {statusDemoVariants.map((v) => (
                <StatusIndicator key={v} variant={v} layout="leftIcon" label={v} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-12 text-text-muted">layout=&quot;iconOnly&quot;</span>
            <div className="flex flex-wrap gap-3 items-center">
              {statusDemoVariants.map((v) => (
                <StatusIndicator
                  key={`${v}-icon`}
                  variant={v}
                  layout="iconOnly"
                  tooltip={`${v} status`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Table</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Table</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-2 overflow-x-auto">
          <Table<DemoRow>
            rows={sortedRows}
            columns={tableColumns}
            sort={sort}
            order={order}
            onSortChange={handleSortChange}
            minWidth={560}
          />
          <p className="text-12 text-text-muted m-0">
            Sort: {sort || '—'} ({order}). Click headers to toggle.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Pagination</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Pagination</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-3">
          <Pagination
            totalCount={totalCount}
            size={pageSize}
            currentAt={page}
            onPageChange={(next) => setPage(next)}
            totalCountLabel="rows"
            onSettingClick={() => {}}
            settingTooltip="Table settings (demo)"
          />
          <span className="text-12 text-text-muted">Page {page}</span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">ProgressBar</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/ProgressBar</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-4 max-w-md">
          <ProgressBar label="25%" value={25} max={100} showValue="percentage" />
          <ProgressBar label="50%" value={50} max={100} showValue="percentage" variant="success" />
          <ProgressBar label="75%" value={75} max={100} showValue="percentage" variant="warning" />
          <ProgressBar label="100%" value={100} max={100} showValue="percentage" variant="danger" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Tag</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Tag</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-wrap gap-2">
          <Tag label="Region" value="KR" />
          <Tag label="Status" value="active" onClose={() => {}} />
          <Tag label="Role" variant="multiSelect" onClose={() => {}} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">CopyButton</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/CopyButton</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex items-center gap-3">
          <span className="text-13 text-text truncate">i-0abc123def456</span>
          <CopyButton text="i-0abc123def456">
            <span className="text-12 text-text-muted ml-1">Copy</span>
          </CopyButton>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">InfoContainer</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/InfoContainer</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-4 max-w-md">
          <InfoContainer
            label="Targets"
            values={['web-01', 'web-02', 'web-03']}
            maxVisibleItems={2}
          />
          <InfoContainer
            label="Members"
            values={['alice', 'bob', 'carol', 'dave']}
            showBullets
            maxVisibleItems={4}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">SectionCard</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/SectionCard</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-6">
          <SectionCard>
            <SectionCard.Header
              title="Compound API"
              description="Header + Content + DataRow"
              actions={
                <Button variant="secondary" appearance="outline" size="sm">
                  Edit
                </Button>
              }
            />
            <SectionCard.Content>
              <SectionCard.DataRow label="Name" value="demo-volume" />
              <SectionCard.DataRow label="Size" value="100 GiB" />
              <SectionCard.DataRow label="AZ" value="zone-a" />
            </SectionCard.Content>
          </SectionCard>

          <SectionCard title="Flat fields API" fields={flatFields} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">
            MultiItemDisplay
          </h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            @shared/components/MultiItemDisplay
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-4 max-w-sm">
          <div>
            <span className="text-12 text-text-muted block mb-1">Single item</span>
            <MultiItemDisplay items={['only-one']} />
          </div>
          <div>
            <span className="text-12 text-text-muted block mb-1">Overflow (+N tooltip)</span>
            <MultiItemDisplay items={['production', 'pci-scope', 'eu-residency', 'encrypted']} />
          </div>
          <div>
            <span className="text-12 text-text-muted block mb-1">Key-value record</span>
            <MultiItemDisplay items={{ app: 'billing', tier: 'gold' }} />
          </div>
        </div>
      </section>
    </div>
  );
}
