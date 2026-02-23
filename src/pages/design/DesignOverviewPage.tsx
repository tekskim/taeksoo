import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VStack } from '@/design-system';
import { IconSearch, IconX } from '@tabler/icons-react';
import { navGroups, allNavItems } from './_shared/navigationData';

export function DesignOverviewPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = searchQuery.trim()
    ? navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.id.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((group) => group.items.length > 0)
    : navGroups;

  const totalCount = searchQuery.trim()
    ? filteredGroups.reduce((acc, g) => acc + g.items.length, 0)
    : allNavItems.length;

  return (
    <VStack gap={8} align="stretch">
      {/* Search */}
      <div className="relative max-w-[480px]">
        <IconSearch
          size={18}
          stroke={1.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search components, tokens..."
          className="w-full pl-10 pr-10 py-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[length:var(--font-size-14)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
          >
            <IconX size={16} stroke={1.5} />
          </button>
        )}
      </div>

      {/* Stats */}
      <p className="text-body-md text-[var(--color-text-subtle)]">
        {totalCount} items {searchQuery.trim() && `matching "${searchQuery}"`}
      </p>

      {/* Category Groups */}
      {filteredGroups.map((group) => (
        <VStack key={group.title} gap={4} align="stretch">
          <h3 className="text-heading-h5 text-[var(--color-text-default)]">{group.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {group.items.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                className="group flex items-center gap-3 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] hover:border-[var(--color-border-focus)] hover:shadow-[var(--shadow-md)] transition-all"
              >
                <div className="w-8 h-8 rounded-[var(--primitive-radius-md)] bg-[var(--color-surface-muted)] flex items-center justify-center group-hover:bg-[var(--color-state-info-bg)] transition-colors">
                  <Icon
                    size={16}
                    stroke={1.5}
                    className="text-[var(--color-text-muted)] group-hover:text-[var(--color-action-primary)] transition-colors"
                  />
                </div>
                <span className="text-label-md text-[var(--color-text-default)] group-hover:text-[var(--color-action-primary)] transition-colors truncate">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </VStack>
      ))}
    </VStack>
  );
}
