import { useCallback, useMemo, useState, type ReactElement } from 'react';
import {
  Drawer,
  FilterSearchInput,
  Table,
  Pagination,
  Badge,
  EmptyState,
  HStack,
  VStack,
  Button,
  type TableColumn,
  type FilterField,
  type AppliedFilter,
} from '@/design-system';
import type { SavedQuery } from '@/services/savedQueriesStore';
import { IconBookmark } from '@tabler/icons-react';

type ApplyQueryDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  savedQueries: SavedQuery[];
  onApply: (savedQuery: SavedQuery) => void;
};

const FILTER_FIELDS: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Search by name...' },
  { id: 'query', label: 'Query', type: 'text', placeholder: 'Search by query...' },
  { id: 'appId', label: 'App Identifier', type: 'text', placeholder: 'Search by app ID...' },
  { id: 'level', label: 'Level', type: 'text', placeholder: 'Search by level...' },
];

const DEFAULT_PAGE_SIZE = 8;

const toDisplay = (value: string): string => (value.trim().length > 0 ? value : '-');

const getLevelBadgeVariant = (levels: string[]): 'danger' | 'warning' | 'info' => {
  if (levels.some((l) => l === 'ERROR' || l === 'CRITICAL')) return 'danger';
  if (levels.some((l) => l === 'WARN')) return 'warning';
  return 'info';
};

const ApplyQueryDrawer = ({
  isOpen,
  onClose,
  savedQueries,
  onApply,
}: ApplyQueryDrawerProps): ReactElement => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const filteredSavedQueries = useMemo(() => {
    const nameFilter = appliedFilters.find((f) => f.field === 'name')?.value?.toLowerCase() ?? '';
    const queryFilter = appliedFilters.find((f) => f.field === 'query')?.value?.toLowerCase() ?? '';
    const appIdFilter = appliedFilters.find((f) => f.field === 'appId')?.value?.toLowerCase() ?? '';
    const levelFilter = appliedFilters.find((f) => f.field === 'level')?.value?.toLowerCase() ?? '';

    return savedQueries.filter((sq) => {
      const byName = !nameFilter || sq.name.toLowerCase().includes(nameFilter);
      const byQuery = !queryFilter || sq.query.toLowerCase().includes(queryFilter);
      const byAppId = !appIdFilter || sq.appId.toLowerCase().includes(appIdFilter);
      const byLevel = !levelFilter || sq.levels.some((l) => l.toLowerCase().includes(levelFilter));
      return byName && byQuery && byAppId && byLevel;
    });
  }, [savedQueries, appliedFilters]);

  const pagedSavedQueries = useMemo(() => {
    const start = (currentPage - 1) * DEFAULT_PAGE_SIZE;
    return filteredSavedQueries.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [currentPage, filteredSavedQueries]);

  const totalPages = Math.max(1, Math.ceil(filteredSavedQueries.length / DEFAULT_PAGE_SIZE));

  const selectedQuery = useMemo(
    () => savedQueries.find((item) => item.id === selectedId) ?? null,
    [savedQueries, selectedId]
  );

  const handleApply = (): void => {
    if (!selectedQuery) return;
    onApply(selectedQuery);
    onClose();
  };

  const handleFiltersChange = useCallback((filters: AppliedFilter[]) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const columns: TableColumn<SavedQuery>[] = [
    {
      key: 'id',
      header: '',
      width: '40px',
      render: (_value, row) => (
        <button
          type="button"
          role="radio"
          aria-checked={selectedId === row.id}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(row.id);
          }}
          className="flex items-center justify-center w-5 h-5 rounded-full border-2 cursor-pointer shrink-0"
          style={{
            borderColor:
              selectedId === row.id
                ? 'var(--color-primary-default)'
                : 'var(--color-border-default)',
            backgroundColor: 'transparent',
          }}
          aria-label={`Select ${row.name}`}
        >
          {selectedId === row.id && (
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: 'var(--color-primary-default)' }}
            />
          )}
        </button>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      minWidth: 160,
      render: (_value, row) => <span className="text-body-md">{toDisplay(row.name)}</span>,
    },
    {
      key: 'levels',
      header: 'Level',
      minWidth: 120,
      render: (_value, row) =>
        row.levels.length > 0 ? (
          <Badge variant={getLevelBadgeVariant(row.levels)} size="sm">
            {row.levels.join(', ')}
          </Badge>
        ) : (
          <span className="text-body-md text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'query',
      header: 'Query',
      render: (_value, row) => (
        <span className="text-body-md text-[var(--color-text-subtle)] truncate">
          {toDisplay(row.query)}
        </span>
      ),
    },
    {
      key: 'appId',
      header: 'App Identifier',
      minWidth: 120,
      render: (_value, row) => <span className="text-body-md">{toDisplay(row.appId)}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      minWidth: 140,
      render: (_value, row) => (
        <span className="text-body-md">{new Date(row.createdAt).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Apply Query"
      width={720}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!selectedQuery}
            className="flex-1"
          >
            Apply
          </Button>
        </HStack>
      }
    >
      <VStack gap={4}>
        <FilterSearchInput
          filters={FILTER_FIELDS}
          appliedFilters={appliedFilters}
          onFiltersChange={handleFiltersChange}
          placeholder="Search saved queries by attributes"
          size="sm"
          hideAppliedFilters
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredSavedQueries.length}
          selectedCount={selectedId ? 1 : 0}
        />

        {pagedSavedQueries.length === 0 ? (
          <EmptyState
            variant="inline"
            icon={<IconBookmark size={48} stroke={1} />}
            title={appliedFilters.length > 0 ? 'No results found' : 'No saved queries yet'}
            description={
              appliedFilters.length > 0
                ? 'Try adjusting your search.'
                : 'Save a query from Log Explorer first.'
            }
          />
        ) : (
          <Table
            columns={columns}
            data={pagedSavedQueries}
            rowKey="id"
            selectedKeys={selectedId ? [selectedId] : []}
            onSelectionChange={(keys) => setSelectedId(keys[0] ? String(keys[0]) : null)}
          />
        )}
      </VStack>
    </Drawer>
  );
};

export default ApplyQueryDrawer;
