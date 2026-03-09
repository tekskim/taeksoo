import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import {
  VStack,
  PageHeader,
  ListToolbar,
  FilterSearchInput,
  Pagination,
  Table,
  Button,
  StatusIndicator,
} from '@/design-system';
import type { FilterField, AppliedFilter } from '@/design-system';
import { IconDownload, IconPlayerPlay, IconTrash } from '@tabler/icons-react';
import { DosDonts } from '../_shared/DosDonts';

const sampleData = [
  {
    id: 'i-001',
    name: 'web-server-01',
    status: 'Running',
    type: 'm5.large',
    ip: '10.0.1.12',
    createdAt: '2026-02-15',
  },
  {
    id: 'i-002',
    name: 'api-gateway',
    status: 'Running',
    type: 'm5.xlarge',
    ip: '10.0.1.34',
    createdAt: '2026-02-18',
  },
  {
    id: 'i-003',
    name: 'db-primary',
    status: 'Stopped',
    type: 'r5.2xlarge',
    ip: '10.0.2.5',
    createdAt: '2026-01-22',
  },
  {
    id: 'i-004',
    name: 'cache-node-01',
    status: 'Running',
    type: 'r5.large',
    ip: '10.0.1.88',
    createdAt: '2026-03-01',
  },
  {
    id: 'i-005',
    name: 'worker-batch',
    status: 'Running',
    type: 'c5.xlarge',
    ip: '10.0.3.41',
    createdAt: '2026-03-04',
  },
];

const previewColumns = [
  {
    key: 'status',
    label: 'Status',
    width: '60px',
    align: 'center' as const,
    render: (v: string) => (
      <StatusIndicator status={v === 'Running' ? 'active' : 'error'} layout="icon-only" size="sm" />
    ),
  },
  { key: 'name', label: 'Name', flex: 1 },
  { key: 'id', label: 'ID', flex: 1 },
  { key: 'type', label: 'Type', flex: 1 },
  { key: 'ip', label: 'IP Address', flex: 1 },
  { key: 'createdAt', label: 'Created at', flex: 1, align: 'right' as const },
];

const filterFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Running', label: 'Running' },
      { value: 'Stopped', label: 'Stopped' },
    ],
  },
];

function ListPagePreview() {
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  return (
    <VStack gap={3}>
      <PageHeader
        title="Instances"
        actions={
          <Button variant="primary" size="md">
            Create Instance
          </Button>
        }
      />

      <ListToolbar
        primaryActions={
          <ListToolbar.Actions>
            <FilterSearchInput
              filters={filterFields}
              appliedFilters={appliedFilters}
              onFiltersChange={setAppliedFilters}
              placeholder="Search instances by attributes"
              size="sm"
              className="w-[var(--search-input-width)]"
              hideAppliedFilters
            />
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
            <Button
              variant="muted"
              size="sm"
              leftIcon={<IconPlayerPlay size={12} />}
              disabled={selectedItems.length === 0}
            >
              Start
            </Button>
            <Button
              variant="muted"
              size="sm"
              leftIcon={<IconTrash size={12} />}
              disabled={selectedItems.length === 0}
            >
              Delete
            </Button>
          </ListToolbar.Actions>
        }
      />

      <Pagination
        currentPage={page}
        totalPages={3}
        onPageChange={setPage}
        showSettings
        totalItems={sampleData.length}
        selectedCount={selectedItems.length}
      />

      <Table
        columns={previewColumns}
        data={sampleData}
        rowKey="id"
        selectable
        selectedKeys={selectedItems}
        onSelectionChange={setSelectedItems}
        emptyMessage="No instances found"
      />
    </VStack>
  );
}

export function ListPagePatternPage() {
  return (
    <ComponentPageTemplate
      title="List Page"
      description="시스템에 존재하는 리소스 또는 데이터 목록을 조회, 탐색, 관리하기 위한 화면 패턴이다."
      preview={
        <ComponentPreview
          code={`import { IconPlus, IconDownload, IconPlayerPlay, IconTrash } from '@tabler/icons-react';

<VStack gap={3}>
  <PageHeader
    title="Instances"
    actions={
      <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
        Create Instance
      </Button>
    }
  />

  <ListToolbar
    primaryActions={
      <ListToolbar.Actions>
        <FilterSearchInput filters={filterFields} appliedFilters={appliedFilters}
          onFiltersChange={setAppliedFilters} placeholder="Search instances by attributes"
          size="sm" className="w-[var(--search-input-width)]" hideAppliedFilters />
        <Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
      </ListToolbar.Actions>
    }
    bulkActions={
      <ListToolbar.Actions>
        <Button variant="muted" size="sm" leftIcon={<IconPlayerPlay size={12} />} disabled={selectedItems.length === 0}>Start</Button>
        <Button variant="muted" size="sm" leftIcon={<IconTrash size={12} />} disabled={selectedItems.length === 0}>Delete</Button>
      </ListToolbar.Actions>
    }
  />

  <Pagination currentPage={page} totalPages={3} onPageChange={setPage}
    showSettings totalItems={5} selectedCount={selectedItems.length} />

  <Table columns={columns} data={data} rowKey="id" selectable
    selectedKeys={selectedItems} onSelectionChange={setSelectedItems} />
</VStack>`}
        >
          <ListPagePreview />
        </ComponentPreview>
      }
      whenToUse={['리소스 목록 조회', '관리 대상 데이터 목록 조회', '로그 또는 이벤트 목록 조회']}
      whenNotToUse={[
        '정보가 많지 않아 컬럼보다 카드 기반 정보 탐색이 어울릴 때',
        '단일 객체 관리 화면 (→ Detail page)',
      ]}
      guidelines={
        <VStack gap={10}>
          {/* Overview */}
          <VStack gap={3}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Overview</h3>
            <VStack gap={3}>
              <p className="text-body-md text-[var(--color-text-muted)]">
                시스템에 존재하는{' '}
                <strong>리소스 또는 데이터 목록을 조회, 탐색, 관리하기 위한 화면 패턴</strong>이다.
              </p>
              <p className="text-body-md text-[var(--color-text-muted)]">
                사용자는 List Page에서 다음 작업을 수행할 수 있다.
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>리소스 검색</li>
                <li>필터링</li>
                <li>정렬</li>
                <li>선택 및 일괄 작업</li>
                <li>개별 리소스 관리</li>
              </ul>
              <p className="text-body-md text-[var(--color-text-muted)]">
                List Page는 일반적으로 다음 컴포넌트와 함께 구성된다.
              </p>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>Search Input</li>
                <li>Table</li>
                <li>Pagination</li>
                <li>View Preferences</li>
                <li>List Download</li>
              </ul>
            </VStack>
          </VStack>

          {/* Components */}
          <VStack gap={4}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Components</h3>
            <pre className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] text-body-sm text-[var(--color-text-muted)] overflow-x-auto whitespace-pre">
              {`Page Title              

Tabs (optional)

                                                [Create] (optional)

Search / Filter       [Download] [Batch Actions]

Pagination            [View preferences]   Item count

------------------------------------------
Table
------------------------------------------`}
            </pre>
            <div className="overflow-x-auto">
              <table className="w-full text-body-md border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)] w-[180px]">
                      요소
                    </th>
                    <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-text-muted)]">
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Title
                    </td>
                    <td className="py-2.5">현재 페이지에서 관리하는 리소스명</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Tab
                    </td>
                    <td className="py-2.5">리소스를 유형별로 분류해서 조회</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Create button
                    </td>
                    <td className="py-2.5">새로운 리소스 생성</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Search input
                    </td>
                    <td className="py-2.5">리소스 검색 및 필터링</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      List Download
                    </td>
                    <td className="py-2.5">현재 리스트 데이터 CSV 파일 다운로드</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Batch actions
                    </td>
                    <td className="py-2.5">선택된 여러 리소스에 대해 일괄 액션 버튼 묶음</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Pagination
                    </td>
                    <td className="py-2.5">리스트 페이지 이동</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      View Preferences
                    </td>
                    <td className="py-2.5">테이블 표시 방식 설정</td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Item count
                    </td>
                    <td className="py-2.5">데이터 규모 표시</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Table
                    </td>
                    <td className="py-2.5">리소스 목록 표시</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* Variants */}
          <VStack gap={4}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Variants</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-body-md border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)] w-[180px]">
                      Variant
                    </th>
                    <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--color-text-muted)]">
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Basic List
                    </td>
                    <td className="py-2.5">기본 리소스 목록</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                      Tab List
                    </td>
                    <td className="py-2.5">탭으로 분류된 목록</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>

          {/* Behavior */}
          <VStack gap={6}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Behavior</h3>

            {/* 1) Scroll */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">1) Scroll</h4>
              <VStack gap={2}>
                <p className="text-label-sm text-[var(--color-text-default)] font-medium">
                  Vertical scroll
                </p>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>다음 영역은 스크롤 시 고정된다.</li>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Page title</li>
                    <li>Tabs</li>
                    <li>Search / Filter</li>
                    <li>Table header</li>
                  </ul>
                </ul>
              </VStack>
              <VStack gap={2}>
                <p className="text-label-sm text-[var(--color-text-default)] font-medium">
                  Horizontal scroll
                </p>
                <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>Table 컬럼이 많을 경우 가로 스크롤 발생한다.</li>
                  <li>가로 스크롤 발생 시 Action 컬럼은 고정된다.</li>
                </ul>
              </VStack>
            </VStack>

            {/* 2) Loading */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">2) Loading</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>데이터를 불러올 때 로딩UI로 Skeleton을 사용한다.</li>
              </ul>
            </VStack>

            {/* 3) Create Button */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">3) Create Button</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>새로운 리소스 생성이 가능할 때 추가된다.</li>
                <li>Primary 버튼이다.</li>
                <li>
                  <code className="text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)]">
                    KO
                  </code>{' '}
                  {'{리소스명} 생성'}
                </li>
                <li>
                  <code className="text-body-sm bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)]">
                    EN
                  </code>{' '}
                  {'Create {resource}'}
                </li>
              </ul>
            </VStack>

            {/* 4) Tab */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">4) Tab</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>리소스를 유형별로 분류 조회가 필요할 때 추가된다.</li>
                <li>탭은 5개 이내로 사용한다.</li>
                <li>탭 기준 정보는 table 컬럼에서 중복 제공하지 않는다.</li>
              </ul>
            </VStack>

            {/* 5) List Download */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">5) List Download</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>현재 리스트 데이터를 CSV 파일로 다운로드 한다.</li>
                <li>현재 필터/검색 조건이 반영된 데이터만 다운로드 한다.</li>
              </ul>
            </VStack>

            {/* 6) Batch Actions */}
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">6) Batch Actions</h4>
              <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
                <li>선택된 여러 리소스에 대해 일괄 작업을 수행한다.</li>
                <li>선택된 Row가 없으면 비활성화한다.</li>
              </ul>
            </VStack>
          </VStack>

          {/* Usage Guidelines */}
          <VStack gap={4}>
            <h3 className="text-heading-h5 text-[var(--color-text-default)]">Usage Guidelines</h3>
            <DosDonts
              doItems={[
                '검색과 필터 기능을 제공한다.',
                '대량 데이터 탐색에 Table을 사용한다.',
                'View preferences로 Table 가독성을 개선한다.',
                'Pagination을 통해 데이터 탐색을 지원한다.',
              ]}
              dontItems={[
                'Create 화면 내부 Table에 List Page 패턴을 적용하지 않는다.',
                '설정 드로어 내부 Table에 List Page 패턴을 적용하지 않는다.',
              ]}
            />
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Search Input', path: '/design/components/filter-search-input' },
        { label: 'Table', path: '/design/components/table' },
        { label: 'Pagination', path: '/design/components/pagination' },
        { label: 'View Preferences', path: '/design/patterns/view-preferences' },
        { label: 'List Download', path: '/design/components/csv-download' },
      ]}
      notionPageId="2b09eddc34e68073a489c3545fcc17fa"
    />
  );
}
