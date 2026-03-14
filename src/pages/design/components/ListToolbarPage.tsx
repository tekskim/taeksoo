import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { ListToolbar, SearchInput, Button } from '@/design-system';
import { IconDownload } from '@tabler/icons-react';

const listToolbarProps: PropDef[] = [
  {
    name: 'primaryActions',
    type: 'ReactNode',
    required: false,
    description: 'Primary action area (e.g. search, download)',
  },
  {
    name: 'bulkActions',
    type: 'ReactNode',
    required: false,
    description: 'Bulk action area (shown alongside primary)',
  },
  {
    name: 'showDivider',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Divider between primary and bulk actions',
  },
  { name: 'filters', type: 'FilterItem[]', required: false, description: 'Active filter chips' },
  {
    name: 'onFilterRemove',
    type: '(id: string) => void',
    required: false,
    description: 'Remove filter handler',
  },
  {
    name: 'onFiltersClear',
    type: '() => void',
    required: false,
    description: 'Clear all filters handler',
  },
  {
    name: 'clearFiltersLabel',
    type: 'string',
    default: "'Clear Filters'",
    required: false,
    description: 'Clear button label',
  },
];

function ListToolbarPreview() {
  const [filters, setFilters] = useState([
    { id: '1', field: 'Status', value: 'Running' },
    { id: '2', field: 'Region', value: 'us-east-1' },
  ]);

  return (
    <div className="w-full">
      <ListToolbar
        primaryActions={
          <ListToolbar.Actions>
            <SearchInput placeholder="Search instances" size="sm" className="w-[240px]" />
            <Button
              variant="secondary"
              size="sm"
              icon={<IconDownload size={12} />}
              aria-label="Download"
            />
          </ListToolbar.Actions>
        }
        bulkActions={
          <ListToolbar.Actions>
            <Button variant="muted" size="sm">
              Start
            </Button>
            <Button variant="muted" size="sm">
              Delete
            </Button>
          </ListToolbar.Actions>
        }
        filters={filters}
        onFilterRemove={(id) => setFilters(filters.filter((f) => f.id !== id))}
        onFiltersClear={() => setFilters([])}
      />
    </div>
  );
}

export function ListToolbarPage() {
  return (
    <ComponentPageTemplate
      title="ListToolbar"
      description="Toolbar for list pages with primary actions, bulk actions, and active filter chips. Supports custom content and filter management."
      whenToUse={['리스트 페이지 상단 액션 영역', '필터, 검색, 벌크 액션을 포함하는 툴바']}
      whenNotToUse={[
        '단순 버튼 그룹 → HStack 사용',
        '상세 페이지 액션 → DetailHeader.Actions 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<ListToolbar
  primaryActions={
    <ListToolbar.Actions>
      <SearchInput placeholder="Search" size="sm" />
      <Button variant="secondary" size="sm" icon={<IconDownload />} />
    </ListToolbar.Actions>
  }
  bulkActions={
    <ListToolbar.Actions>
      <Button variant="muted" size="sm">Delete</Button>
    </ListToolbar.Actions>
  }
  filters={filters}
  onFilterRemove={handleRemove}
  onFiltersClear={handleClear}
/>`}
        >
          <ListToolbarPreview />
        </ComponentPreview>
      }
      props={listToolbarProps}
      usage={{
        code: `import { ListToolbar, SearchInput, Button } from '@/design-system';

<ListToolbar
  primaryActions={
    <ListToolbar.Actions>
      <SearchInput placeholder="Search" size="sm" />
    </ListToolbar.Actions>
  }
  filters={filters}
  onFilterRemove={(id) => removeFilter(id)}
  onFiltersClear={() => clearAll()}
/>`,
      }}
      relatedLinks={[
        { label: 'Table', path: '/design/components/table' },
        { label: 'FilterSearchInput', path: '/design/components/filter-search-input' },
        { label: 'List Page Pattern', path: '/design/patterns/list-page' },
      ]}
    />
  );
}
