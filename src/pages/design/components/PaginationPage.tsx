import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Pagination, VStack } from '@/design-system';

export function PaginationPage() {
  const [demoPage1, setDemoPage1] = useState(1);
  const [demoPage2, setDemoPage2] = useState(5);
  const [demoPage3, setDemoPage3] = useState(15);
  const [demoPage4, setDemoPage4] = useState(2);

  return (
    <ComponentPageTemplate
      title="Pagination"
      description="Navigation for paginated content"
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
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  Table 바로 위에 배치합니다. 총 항목 수, 현재 페이지, 선택된 항목 수를 표시합니다.
                </li>
                <li>
                  <strong>페이지 크기 옵션</strong>: 기본 10. Settings 버튼으로 사용자가 변경 가능
                  (10, 20, 50, 100).
                </li>
                <li>
                  <strong>페이지 변경 시</strong>: 선택 상태를 초기화하고, 테이블 상단으로
                  스크롤합니다.
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
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>item-size: 24px</code> · <code>gap: 8px</code> · <code>radius: 4px</code> ·{' '}
            <code>font: 12px</code>
          </div>
        </VStack>

        {/* Basic */}
        <VStack gap={3}>
          <Label>Basic</Label>
          <Pagination currentPage={demoPage1} totalPages={10} onPageChange={setDemoPage1} />
        </VStack>

        {/* Middle Page */}
        <VStack gap={3}>
          <Label>Middle Page (with dots)</Label>
          <Pagination currentPage={demoPage2} totalPages={10} onPageChange={setDemoPage2} />
        </VStack>

        {/* Many Pages */}
        <VStack gap={3}>
          <Label>Many pages</Label>
          <Pagination currentPage={demoPage3} totalPages={50} onPageChange={setDemoPage3} />
        </VStack>

        {/* Few Pages */}
        <VStack gap={3}>
          <Label>Few Pages (no dots)</Label>
          <Pagination currentPage={demoPage4} totalPages={5} onPageChange={setDemoPage4} />
        </VStack>

        {/* Disabled */}
        <VStack gap={3}>
          <Label>Disabled</Label>
          <Pagination
            currentPage={3}
            totalPages={10}
            onPageChange={(page) => console.log('Page:', page)}
            disabled
          />
        </VStack>

        {/* With Total Items Only */}
        <VStack gap={3}>
          <Label>With Total Items</Label>
          <Pagination
            currentPage={demoPage1}
            totalPages={10}
            onPageChange={setDemoPage1}
            totalItems={115}
          />
        </VStack>

        {/* With Settings & Total Items */}
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

        {/* With Selected Count */}
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
            When rows are selected in a table, the pagination shows &quot;X selected / Y items&quot;
            format.
          </p>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
