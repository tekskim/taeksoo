import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import type { PropDef } from '../_shared/PropsTable';
import { Label } from '../../design-system-sections/HelperComponents';
import { Pagination, VStack } from '@/design-system';

const paginationProps: PropDef[] = [
  {
    name: 'currentPage',
    type: 'number',
    required: true,
    description: 'Current active page (1-based)',
  },
  { name: 'totalPages', type: 'number', required: true, description: 'Total number of pages' },
  {
    name: 'onPageChange',
    type: '(page: number) => void',
    required: true,
    description: 'Page change handler',
  },
  {
    name: 'totalItems',
    type: 'number',
    required: false,
    description: 'Total item count displayed on the left',
  },
  {
    name: 'selectedCount',
    type: 'number',
    required: false,
    description: 'Number of selected items (shows "X selected / Y items")',
  },
  {
    name: 'showSettings',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show settings icon button',
  },
  {
    name: 'onSettingsClick',
    type: '() => void',
    required: false,
    description: 'Settings button click handler',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disable all page controls',
  },
];

function PaginationPreview() {
  const [page, setPage] = useState(3);
  return (
    <Pagination
      currentPage={page}
      totalPages={10}
      onPageChange={setPage}
      showSettings
      onSettingsClick={() => {}}
      totalItems={115}
    />
  );
}

export function PaginationPage() {
  const [demoPage1, setDemoPage1] = useState(1);
  const [demoPage2, setDemoPage2] = useState(5);
  const [demoPage3, setDemoPage3] = useState(15);
  const [demoPage4, setDemoPage4] = useState(2);

  return (
    <ComponentPageTemplate
      title="Pagination"
      description="Navigation for paginated content"
      preview={
        <ComponentPreview
          code={`<Pagination\n  currentPage={page}\n  totalPages={10}\n  onPageChange={setPage}\n  showSettings\n  totalItems={115}\n/>`}
        >
          <PaginationPreview />
        </ComponentPreview>
      }
      usage={{
        code: `import { Pagination } from '@/design-system';\n\nconst [page, setPage] = useState(1);\n\n<Pagination\n  currentPage={page}\n  totalPages={10}\n  onPageChange={setPage}\n  totalItems={115}\n  showSettings\n  onSettingsClick={() => openPreferences()}\n/>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Basic</Label>
            <Pagination currentPage={demoPage1} totalPages={10} onPageChange={setDemoPage1} />
          </VStack>

          <VStack gap={3}>
            <Label>Middle Page (with dots)</Label>
            <Pagination currentPage={demoPage2} totalPages={10} onPageChange={setDemoPage2} />
          </VStack>

          <VStack gap={3}>
            <Label>Many pages</Label>
            <Pagination currentPage={demoPage3} totalPages={50} onPageChange={setDemoPage3} />
          </VStack>

          <VStack gap={3}>
            <Label>Few Pages (no dots)</Label>
            <Pagination currentPage={demoPage4} totalPages={5} onPageChange={setDemoPage4} />
          </VStack>

          <VStack gap={3}>
            <Label>Disabled</Label>
            <Pagination
              currentPage={3}
              totalPages={10}
              onPageChange={(page) => console.log('Page:', page)}
              disabled
            />
          </VStack>

          <VStack gap={3}>
            <Label>With Total Items</Label>
            <Pagination
              currentPage={demoPage1}
              totalPages={10}
              onPageChange={setDemoPage1}
              totalItems={115}
            />
          </VStack>

          <VStack gap={3}>
            <Label>With Settings & Total Items</Label>
            <Pagination
              currentPage={demoPage1}
              totalPages={10}
              onPageChange={setDemoPage1}
              showSettings
              onSettingsClick={() => console.log('Settings clicked')}
              totalItems={115}
            />
          </VStack>

          <VStack gap={3}>
            <Label>With Selected Count (3 selected)</Label>
            <Pagination
              currentPage={demoPage1}
              totalPages={10}
              onPageChange={setDemoPage1}
              showSettings
              onSettingsClick={() => console.log('Settings clicked')}
              totalItems={115}
              selectedCount={3}
            />
            <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              When rows are selected in a table, the pagination shows &quot;X selected / Y
              items&quot; format.
            </p>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={2}>
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
          <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
            <li>
              Table 바로 위에 배치합니다. 총 항목 수, 현재 페이지, 선택된 항목 수를 표시합니다.
            </li>
            <li>
              <strong>페이지 크기 옵션</strong>: 기본 10. Settings 버튼으로 사용자가 변경 가능 (10,
              20, 50, 100).
            </li>
            <li>
              <strong>페이지 변경 시</strong>: 선택 상태를 초기화하고, 테이블 상단으로 스크롤합니다.
            </li>
            <li>
              <strong>키보드 접근</strong>: 좌우 화살표 키로 페이지 이동이 가능합니다.
            </li>
            <li>
              <strong>총 1페이지</strong>: 항목이 페이지 크기 이하일 때도 Pagination을 표시하되,
              페이지 이동 버튼은 disabled 처리합니다.
            </li>
          </ul>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>item-size: 24px</code> · <code>gap: 8px</code> · <code>radius: 4px</code> ·{' '}
          <code>font: 12px</code>
        </div>
      }
      apiReference={paginationProps}
      accessibility={
        <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
          <li>Arrow Left / Arrow Right: 이전 / 다음 페이지로 이동</li>
          <li>Enter / Space: 포커스된 페이지 버튼 활성화</li>
          <li>nav role=&quot;navigation&quot; + aria-label=&quot;Pagination&quot; 자동 적용</li>
          <li>현재 페이지에 aria-current=&quot;page&quot; 적용</li>
        </ul>
      }
      relatedLinks={[
        {
          label: 'Table',
          path: '/design/components/table',
          description: 'Data table with pagination',
        },
        {
          label: 'SelectionIndicator',
          path: '/design/components/selection-indicator',
          description: 'Selected items display',
        },
        {
          label: 'List Page Pattern',
          path: '/design/patterns/common',
          description: 'List page with pagination',
        },
      ]}
    />
  );
}
