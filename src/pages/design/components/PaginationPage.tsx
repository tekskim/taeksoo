import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import type { PropDef } from '../_shared/PropsTable';
import { Label } from '../../design-system-sections/HelperComponents';
import { Pagination, VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-heading-h5 text-[var(--color-text-default)]">{children}</h4>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

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

function PaginationGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">구성 요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>① Previous/Next Button</strong>
              </Td>
              <Td>이전/다음 페이지 이동</Td>
            </tr>
            <tr>
              <Td>
                <strong>② First/Last Page</strong>
              </Td>
              <Td>목록 시작 및 마지막 페이지</Td>
            </tr>
            <tr>
              <Td>
                <strong>③ Ellipsis</strong>
              </Td>
              <Td>생략된 페이지 존재 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>④ Page Number</strong>
              </Td>
              <Td>
                • 클릭 시 특정 페이지로 이동
                <br />• 현재 위치 파악
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>⑤ Item Counter</strong>
              </Td>
              <Td>
                • 검색/필터가 없을 때: 전체 데이터 수 표시 (예: 100 items)
                <br />• 검색/필터가 있을 때: 필터링된 데이터/전체 데이터 수 표시 (예: 3 selected /
                100 items)
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>⑥ Table Settings Button</strong>
              </Td>
              <Td>
                • 리스트 화면에 한정
                <br />• 클릭 시 테이블 설정 드로어 열림
              </Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Token</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>item-size</code>
              </Td>
              <Td>24px</Td>
            </tr>
            <tr>
              <Td>
                <code>gap</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>
                <code>radius</code>
              </Td>
              <Td>4px</Td>
            </tr>
            <tr>
              <Td>
                <code>font</code>
              </Td>
              <Td>12px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* States */}
      <VStack gap={4}>
        <SectionTitle>States</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">상태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>기본 표시 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Hover</strong>
              </Td>
              <Td>마우스가 버튼/페이지 아이템 위에 위치</Td>
            </tr>
            <tr>
              <Td>
                <strong>Active / Current</strong>
              </Td>
              <Td>현재 페이지(선택 불가, 강조 표시)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Disabled</strong>
              </Td>
              <Td>이동 불가 상태(예: 첫 페이지에서 Previous)</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={6}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) 페이지 이동 규칙</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Previous 버튼 클릭 시 현재 페이지 - 1</li>
              <li>Next 버튼 클릭 시 현재 페이지 + 1</li>
              <li>
                1 페이지에서는 <strong>Previous 버튼 비활성화</strong>
              </li>
              <li>
                마지막 페이지에서는 <strong>Next 버튼 비활성화</strong>
              </li>
              <li>페이지가 1개뿐인 경우 Previous / Next 모두 비활성화</li>
              <li>현재 페이지(Current)는 하이라이트되어 선택 불가</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) 페이지 번호 표시 규칙</SubSectionTitle>
          <Prose>
            <p>
              전체 페이지 수가 <strong>7 페이지 이상일 경우</strong> Ellipsis(…)로 축약 표시
            </p>
          </Prose>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
            <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre-wrap font-[var(--font-family-mono)]">{`1 … 10 11 12 … 99
1 2 3 4 5 … 7
1 … 3 4 5 6 7`}</pre>
          </div>
          <Prose>
            <p>말줄임표가 없는 경우 현재 페이지가 이동해도 페이지 목록 위치 고정</p>
          </Prose>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
            <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre-wrap font-[var(--font-family-mono)]">{`< 1 2 3 4 5 [6] >
< 1 … 11 12 [13] 14 15 >`}</pre>
          </div>
          <Prose>
            <p>양쪽에 말줄임표가 있는 경우 현재 페이지는 항상 가운데에 위치</p>
          </Prose>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
            <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre-wrap font-[var(--font-family-mono)]">{`< 1 … 3 4 [5] 6 7 … 15 >
< 1 … 7 8 [9] 10 11 … 15 >`}</pre>
          </div>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) Item Counter</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>기본적으로 전체 목록 개수 표시 (예: 100 items)</li>
              <li>필터, 검색이 적용된 경우 필터 결과 개수로 변경 (예: 50 items)</li>
              <li>선택된 항목이 있을 시 선택된 개수 별도 표시 (예: 3 selected / 50 items)</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) 리셋 규칙</SubSectionTitle>
          <Prose>
            <p>
              결과 집합이 변경되는 모든 조건(필터/검색/정렬)이 바뀌면 페이지는 기본적으로 1페이지로
              리셋한다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>필터/검색 조건 변경 시</li>
              <li>정렬 조건 변경 시</li>
              <li>Rows per page 변경 시</li>
            </ul>
            <p>
              페이지 이동 후 콘텐츠 영역(테이블/리스트)의 상단으로 스크롤하거나, 테이블 헤더로
              포커스를 이동한다(선택 1개를 서비스 기본으로 고정 권장).
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>&quot;이동했는데 화면은 그대로&quot;인 상황을 방지한다.</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            'Pagination은 목록 컨텍스트(리스트/테이블 상단)에 고정 배치한다.',
            '"총 개수 + 현재 표시 범위"를 함께 제공한다.',
            'ellipsis 규칙을 전 화면에서 통일한다.',
            'Disabled 상태는 명확한 논리 조건(첫/마지막 페이지)에서만 사용한다.',
          ]}
          dontItems={[
            '필터/정렬 변경 후 사용자를 중간 페이지에 남겨두지 않는다(기본은 1페이지 리셋).',
            '번호가 과도하게 많아지는데도 축약 없이 전부 노출하지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
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
      description="리스트/테이블 등에서 대량의 데이터를 페이지 단위로 나누어 탐색할 수 있도록 하는 컴포넌트이다. 사용자는 현재 위치를 인지하고, 다음/이전 페이지로 이동하거나 특정 페이지로 점프할 수 있다."
      whenToUse={[
        '데이터가 많아 한 번에 모두 렌더링/로딩하기 어렵거나, 사용자가 페이지 단위로 탐색하는 것이 자연스러운 화면',
        '테이블/리스트의 정렬·필터·검색 결과를 "결과 집합"으로 보고, 페이지 단위로 이동하는 플로우가 필요한 경우',
      ]}
      whenNotToUse={[
        '피드/타임라인처럼 연속 스크롤이 자연스러운 경우(→ Infinite Scroll 패턴)',
        '데이터 수가 매우 적어 페이지 분할이 의미 없는 경우',
        '"다음 몇 개만 더 보기"가 UX적으로 더 적합한 경우(→ Load more 패턴)',
      ]}
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
            <VStack gap={1}>
              <Label>Basic</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                기본 페이지네이션. 페이지 번호와 이전/다음 버튼만 표시.
              </span>
            </VStack>
            <Pagination currentPage={demoPage1} totalPages={10} onPageChange={setDemoPage1} />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Middle Page (with ellipsis)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                7페이지 이상일 때 양쪽 Ellipsis(…) 표시. 현재 페이지가 가운데 위치.
              </span>
            </VStack>
            <Pagination currentPage={demoPage2} totalPages={10} onPageChange={setDemoPage2} />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Many pages</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                대량 페이지. 양쪽 Ellipsis로 축약하여 현재 위치를 명확히 표시.
              </span>
            </VStack>
            <Pagination currentPage={demoPage3} totalPages={50} onPageChange={setDemoPage3} />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Few Pages (no ellipsis)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                7페이지 미만. Ellipsis 없이 모든 페이지 번호를 표시.
              </span>
            </VStack>
            <Pagination currentPage={demoPage4} totalPages={5} onPageChange={setDemoPage4} />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Disabled</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                비활성화 상태. 모든 페이지 컨트롤이 클릭 불가.
              </span>
            </VStack>
            <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} disabled />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>With Item Counter</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                전체 데이터 수를 왼쪽에 표시 (예: 115 items).
              </span>
            </VStack>
            <Pagination
              currentPage={demoPage1}
              totalPages={10}
              onPageChange={setDemoPage1}
              totalItems={115}
            />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>With Settings & Item Counter</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                리스트 화면에서 Table Settings 버튼과 함께 사용.
              </span>
            </VStack>
            <Pagination
              currentPage={demoPage1}
              totalPages={10}
              onPageChange={setDemoPage1}
              showSettings
              onSettingsClick={() => {}}
              totalItems={115}
            />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>With Selected Count</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                선택된 항목이 있을 때 &quot;3 selected / 115 items&quot; 형태로 표시.
              </span>
            </VStack>
            <Pagination
              currentPage={demoPage1}
              totalPages={10}
              onPageChange={setDemoPage1}
              showSettings
              onSettingsClick={() => {}}
              totalItems={115}
              selectedCount={3}
            />
          </VStack>
        </VStack>
      }
      guidelines={<PaginationGuidelines />}
      tokens={
        <div className="text-body-sm text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
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
          description: '테이블 하단에서 Pagination이 가장 많이 사용됨',
        },
        {
          label: 'Search Input',
          path: '/design/components/search-input',
          description: '검색 결과 집합 변경 시 페이지 리셋 정책과 연결',
        },
        {
          label: 'View Preferences',
          path: '/design/patterns/view-preferences',
          description: '테이블 로우, 컬럼 조건을 변경하는 기능',
        },
        {
          label: 'List Page',
          path: '/design/patterns/list-page',
          description: '리스트 화면의 탐색 패턴(필터/검색/정렬/페이지 이동)과 결합',
        },
        {
          label: 'Loading / Skeleton',
          path: '/design/components/loading',
          description: '페이지 전환 중 로딩/스켈레톤 표시 정책 연동',
        },
        {
          label: 'UX Writing Guide',
          path: '/design/foundation/ux-writing',
          description: 'Result summary, aria-label 등 문구/표기 규칙 준수',
        },
      ]}
    />
  );
}
