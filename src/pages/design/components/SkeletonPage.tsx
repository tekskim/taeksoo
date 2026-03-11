import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { VStack } from '@/design-system';

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

function SkeletonBlock({ width = '100%', height = '16px' }: { width?: string; height?: string }) {
  return (
    <div
      className="rounded-[var(--primitive-radius-sm)] animate-pulse bg-[var(--color-border-default)]"
      style={{ width, height }}
    />
  );
}

function SkeletonPreview() {
  return (
    <div className="w-full max-w-[480px] flex flex-col gap-6 p-6 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
      <VStack gap={3}>
        <span className="text-label-sm text-[var(--color-text-subtle)]">Text Skeleton</span>
        <VStack gap={2}>
          <SkeletonBlock width="60%" height="14px" />
          <SkeletonBlock width="100%" height="12px" />
          <SkeletonBlock width="85%" height="12px" />
        </VStack>
      </VStack>

      <VStack gap={3}>
        <span className="text-label-sm text-[var(--color-text-subtle)]">Block Skeleton</span>
        <SkeletonBlock width="100%" height="120px" />
      </VStack>

      <VStack gap={3}>
        <span className="text-label-sm text-[var(--color-text-subtle)]">List Skeleton</span>
        <VStack gap={2}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBlock width="32px" height="32px" />
              <VStack gap={1} className="flex-1">
                <SkeletonBlock width="40%" height="12px" />
                <SkeletonBlock width="70%" height="10px" />
              </VStack>
            </div>
          ))}
        </VStack>
      </VStack>

      <VStack gap={3}>
        <span className="text-label-sm text-[var(--color-text-subtle)]">Table Skeleton</span>
        <VStack gap={1}>
          <div className="flex gap-3">
            <SkeletonBlock width="30%" height="12px" />
            <SkeletonBlock width="30%" height="12px" />
            <SkeletonBlock width="30%" height="12px" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 pt-2">
              <SkeletonBlock width="30%" height="10px" />
              <SkeletonBlock width="30%" height="10px" />
              <SkeletonBlock width="30%" height="10px" />
            </div>
          ))}
        </VStack>
      </VStack>
    </div>
  );
}

function ListPageSkeleton() {
  const ROW_COUNT = 6;
  const COLUMNS = [
    { width: '40px', flex: false },
    { width: '50px', flex: false },
    { width: undefined, flex: true, minW: '120px' },
    { width: undefined, flex: true, minW: '80px' },
    { width: undefined, flex: true, minW: '80px' },
    { width: undefined, flex: true, minW: '60px' },
    { width: undefined, flex: true, minW: '60px' },
    { width: '40px', flex: false },
  ];

  return (
    <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <SkeletonBlock width="140px" height="20px" />
        <SkeletonBlock width="110px" height="32px" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 pb-3">
        <SkeletonBlock width="240px" height="28px" />
        <SkeletonBlock width="28px" height="28px" />
        <div className="flex-1" />
        <SkeletonBlock width="60px" height="28px" />
        <SkeletonBlock width="60px" height="28px" />
        <SkeletonBlock width="60px" height="28px" />
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2 px-6 pb-3">
        <SkeletonBlock width="24px" height="24px" />
        <SkeletonBlock width="24px" height="24px" />
        <SkeletonBlock width="24px" height="24px" />
        <SkeletonBlock width="16px" height="12px" />
        <SkeletonBlock width="24px" height="24px" />
        <div className="flex-1" />
        <SkeletonBlock width="60px" height="12px" />
      </div>

      {/* Table */}
      <div className="px-6 pb-5">
        {/* Table Header */}
        <div className="flex items-center gap-3 px-3 py-2 bg-[var(--color-surface-subtle)] rounded-t-[var(--primitive-radius-sm)] border border-[var(--color-border-default)]">
          {COLUMNS.map((col, i) => (
            <div
              key={`h-${i}`}
              className={col.flex ? 'flex-1' : ''}
              style={{
                width: col.width,
                minWidth: col.minW,
              }}
            >
              <SkeletonBlock
                width={i === 0 ? '16px' : i === COLUMNS.length - 1 ? '16px' : '70%'}
                height="10px"
              />
            </div>
          ))}
        </div>

        {/* Table Rows */}
        {Array.from({ length: ROW_COUNT }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex items-center gap-3 px-3 py-3 border-x border-b border-[var(--color-border-default)]"
            style={{ opacity: 1 - rowIdx * 0.1 }}
          >
            {COLUMNS.map((col, colIdx) => (
              <div
                key={`r${rowIdx}-c${colIdx}`}
                className={col.flex ? 'flex-1' : ''}
                style={{
                  width: col.width,
                  minWidth: col.minW,
                }}
              >
                {colIdx === 0 ? (
                  <SkeletonBlock width="16px" height="16px" />
                ) : colIdx === 1 ? (
                  <SkeletonBlock width="24px" height="24px" />
                ) : colIdx === COLUMNS.length - 1 ? (
                  <SkeletonBlock width="16px" height="16px" />
                ) : (
                  <VStack gap={1}>
                    <SkeletonBlock
                      width={`${55 + ((rowIdx * 13 + colIdx * 17) % 35)}%`}
                      height="12px"
                    />
                    {colIdx === 2 && <SkeletonBlock width="40%" height="9px" />}
                  </VStack>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Skeleton Container</strong>
              </Td>
              <Td>Skeleton 전체 영역</Td>
            </tr>
            <tr>
              <Td>
                <strong>Skeleton Animation</strong>
              </Td>
              <Td>로딩 애니메이션</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">유형</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Text Skeleton</strong>
              </Td>
              <Td>텍스트 콘텐츠 placeholder</Td>
            </tr>
            <tr>
              <Td>
                <strong>Block Skeleton</strong>
              </Td>
              <Td>카드 / 콘텐츠 영역 placeholder</Td>
            </tr>
            <tr>
              <Td>
                <strong>List Skeleton</strong>
              </Td>
              <Td>리스트 항목 placeholder</Td>
            </tr>
            <tr>
              <Td>
                <strong>Table Skeleton</strong>
              </Td>
              <Td>테이블 row placeholder</Td>
            </tr>
            <tr>
              <Td>
                <strong>Chart Skeleton</strong>
              </Td>
              <Td>차트 영역 placeholder</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) Loading 시작</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>데이터 요청이 시작되면 스켈레톤을 표시한다.</li>
              <li>스켈레톤은 기존 콘텐츠를 대체한다.</li>
              <li>실제 UI 레이아웃과 동일한 구조를 유지한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) Loading 완료</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>데이터 로딩이 완료되면 스켈레톤을 제거하고 실제 콘텐츠를 표시한다.</li>
              <li>Skeleton → 실제 콘텐츠로 즉시 교체가 되어야 한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) 애니메이션</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>과도한 애니메이션은 사용하지 않는다.</li>
              <li>전체 스켈레톤 영역에 동일한 애니메이션을 적용한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) Loading 시간 정책</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th>로딩 시간</Th>
                <Th>정책</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>{'< 300ms'}</Td>
                <Td>Skeleton 표시하지 않음</Td>
              </tr>
              <tr>
                <Td>300ms – 3s</Td>
                <Td>Skeleton 표시</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5) 레이아웃 안정성</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>실제 콘텐츠와 동일한 spacing을 갖는다.</li>
              <li>동일한 높이와 너비 유지한다.</li>
              <li>레이아웃 점프(layout shift)를 피한다.</li>
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
            '실제 콘텐츠 레이아웃과 동일한 Skeleton 구조를 사용한다.',
            '로딩 상태를 명확하게 표현한다.',
            '콘텐츠 유형에 맞는 Skeleton을 사용한다.',
            '레이아웃 이동을 최소화한다.',
          ]}
          dontItems={[
            '실제 UI 구조와 다른 Skeleton을 사용하지 않는다.',
            'Skeleton을 너무 오래 표시하지 않는다.',
            '복잡한 애니메이션을 적용하지 않는다.',
            '콘텐츠 로딩 완료 후 Skeleton을 지연 제거하지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function SkeletonPage() {
  return (
    <ComponentPageTemplate
      title="Skeleton"
      description="Skeleton은 콘텐츠가 로딩 중일 때 실제 UI 레이아웃을 모방한 플레이스홀더를 표시하는 로딩 컴포넌트이다. 데이터가 로딩되는 동안 사용자에게 레이아웃 구조와 콘텐츠 위치를 미리 보여주어 인지 부하를 줄이고 체감 로딩 시간을 개선한다."
      whenToUse={[
        '페이지 초기 로딩 상태',
        '데이터 API 호출 중',
        '콘텐츠 구조가 미리 정해진 경우',
        '리스트 / 카드 / 테이블 데이터를 불러오는 경우',
      ]}
      whenNotToUse={[
        '짧은 로딩 (<300ms) (→ 표시하지 않음)',
        '레이아웃 확인이 안 되는 전체 화면 로딩 (→ Spinner)',
        '사용자 액션 처리 중 (→ Progress indicator)',
      ]}
      preview={<SkeletonPreview />}
      usage={{
        code: `// Text Skeleton
<div className="animate-pulse bg-[var(--color-border-default)] rounded h-3 w-3/4" />

// Block Skeleton
<div className="animate-pulse bg-[var(--color-border-default)] rounded-lg h-[120px] w-full" />

// List item Skeleton
<div className="flex items-center gap-3">
  <div className="animate-pulse bg-[var(--color-border-default)] rounded w-8 h-8" />
  <div className="flex-1 space-y-2">
    <div className="animate-pulse bg-[var(--color-border-default)] rounded h-3 w-2/5" />
    <div className="animate-pulse bg-[var(--color-border-default)] rounded h-2.5 w-3/5" />
  </div>
</div>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              All Skeleton Variants
            </span>
            <SkeletonPreview />
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              List Page Skeleton
            </span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">
              페이지 로딩 시 테이블 데이터가 표시되기 전 보여지는 전체 List Page 스켈레톤 예시
            </span>
            <ListPageSkeleton />
          </VStack>
        </VStack>
      }
      guidelines={<SkeletonGuidelines />}
      accessibility={
        <Prose>
          <p>
            Skeleton 컨테이너에 <code>aria-hidden="true"</code>를 적용하여 스크린 리더가
            플레이스홀더를 읽지 않도록 한다. 로딩 영역의 부모 요소에 <code>aria-busy="true"</code>를
            설정하여 콘텐츠가 로딩 중임을 전달한다.
            <code>prefers-reduced-motion</code> 미디어 쿼리를 지원하여 모션 민감 사용자에게
            애니메이션을 비활성화한다.
          </p>
        </Prose>
      }
      relatedLinks={[
        { label: 'Loading', path: '/design/components/loading', description: '상위 로딩 패턴' },
        {
          label: 'Progress Bar',
          path: '/design/components/progress-bar',
          description: '진행률 표시 컴포넌트',
        },
        {
          label: 'Empty State',
          path: '/design/patterns/empty-states',
          description: '데이터 없음 상태',
        },
        { label: 'Table', path: '/design/components/table', description: 'Table skeleton 사용' },
      ]}
    />
  );
}
