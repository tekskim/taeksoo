import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VStack, Badge } from '@/design-system';
import { IconSearch, IconX } from '@tabler/icons-react';
import { navGroups, pageLastUpdated } from './_shared/navigationData';

type Freshness = 'new' | 'recent' | 'old';

function getRelativeTime(dateStr: string): { label: string; freshness: Freshness } {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: 'Today', freshness: 'new' };
  if (diffDays === 1) return { label: 'Yesterday', freshness: 'recent' };
  if (diffDays <= 7) return { label: `${diffDays} days ago`, freshness: 'recent' };
  if (diffDays <= 14) return { label: `${diffDays} days ago`, freshness: 'recent' };
  return { label: dateStr.split(' ')[0], freshness: 'old' };
}

function UpdatedCell({ dateStr }: { dateStr?: string }) {
  if (!dateStr) return <span>—</span>;
  const { label, freshness } = getRelativeTime(dateStr);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={freshness === 'new' ? 'text-[var(--color-text-default)]' : ''}>{label}</span>
      {freshness === 'new' && (
        <Badge variant="info" size="sm">
          N
        </Badge>
      )}
    </span>
  );
}

export function AllComponentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const excludedGroups = new Set(['Figma Migration', 'Audit', 'Prototype', 'Test']);
  const indexGroups = navGroups.filter((g) => !excludedGroups.has(g.title));

  const filteredGroups = searchQuery.trim()
    ? indexGroups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.path.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((group) => group.items.length > 0)
    : indexGroups;

  const totalCount = filteredGroups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <VStack gap={6} align="stretch">
      <VStack gap={2} align="stretch">
        <h2 className="text-heading-h3 text-[var(--color-text-default)]">
          All Components & Patterns
        </h2>
        <p className="text-body-md text-[var(--color-text-muted)]">
          TDS에 등록된 모든 컴포넌트, 패턴, 토큰 페이지의 인덱스입니다.
        </p>
      </VStack>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-[320px]">
          <IconSearch
            size={16}
            stroke={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name or path..."
            className="w-full pl-9 pr-8 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] text-[length:var(--font-size-12)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
            >
              <IconX size={14} stroke={1.5} />
            </button>
          )}
        </div>
        <span className="text-body-sm text-[var(--color-text-subtle)] shrink-0">
          {totalCount} items
          {searchQuery.trim() && ` matching "${searchQuery}"`}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-body-md border-collapse">
          <thead>
            <tr>
              <th className="text-left text-label-sm font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] w-[140px]">
                Category
              </th>
              <th className="text-left text-label-sm font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                Component
              </th>
              <th className="text-left text-label-sm font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
                Path
              </th>
              <th className="text-left text-label-sm font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] w-[160px]">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((group) =>
              group.items.map((item, idx) => (
                <tr
                  key={item.id}
                  className="hover:bg-[var(--color-surface-subtle)] transition-colors"
                >
                  <td
                    className={`p-3 border border-[var(--color-border-default)] align-top text-label-sm font-medium text-[var(--color-text-default)] ${
                      idx === 0 ? '' : 'border-t-0'
                    }`}
                  >
                    {idx === 0 ? group.title : ''}
                  </td>
                  <td className="p-3 border border-[var(--color-border-default)] align-top">
                    <Link
                      to={item.path}
                      className="text-[var(--color-action-primary)] hover:underline text-body-md"
                    >
                      {item.label}
                    </Link>
                  </td>
                  <td className="p-3 border border-[var(--color-border-default)] align-top">
                    <span className="font-mono text-body-sm text-[var(--color-text-subtle)]">
                      {item.path}
                    </span>
                  </td>
                  <td className="p-3 border border-[var(--color-border-default)] align-top text-body-sm text-[var(--color-text-subtle)]">
                    <UpdatedCell dateStr={pageLastUpdated[item.path]} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredGroups.length === 0 && (
        <div className="py-12 text-center text-body-md text-[var(--color-text-subtle)]">
          No results for "{searchQuery}"
        </div>
      )}
    </VStack>
  );
}
