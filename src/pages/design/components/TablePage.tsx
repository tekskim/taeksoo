import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';
import { TableDemo } from '../../design-system-sections/TableDemo';

export function TablePage() {
  return (
    <ComponentPageTemplate
      title="Table"
      description="Data table with sorting, selection, sticky header, text truncation with tooltip, and horizontal scroll"
      relatedLinks={[
        {
          label: 'Pagination',
          path: '/design/components/pagination',
          description: 'Table pagination',
        },
        {
          label: 'Status indicator',
          path: '/design/components/status-indicator',
          description: 'Status column',
        },
        {
          label: 'Context menu',
          path: '/design/components/context-menu',
          description: 'Row actions',
        },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">컬럼 정렬 규칙</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          컬럼 유형
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          정렬
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          예시
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">텍스트/이름</td>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          왼쪽 (기본)
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">Name, Description</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">숫자/크기</td>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          오른쪽
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">Size, Count, vCPU</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">날짜/시간</td>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          오른쪽
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          Created at, Updated at
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">상태(Status)</td>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          중앙
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">StatusIndicator</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[var(--color-text-default)]">
                          액션/체크박스
                        </td>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          중앙
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">Actions, Select</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">기능 정책</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>정렬(Sorting)</strong>: 클릭 시 오름차순 → 내림차순 → 정렬 해제 순서로
                    토글. 헤더에 정렬 아이콘 표시.
                  </li>
                  <li>
                    <strong>선택(Selection)</strong>: 체크박스로 행 선택. 헤더 체크박스로 전체
                    선택/해제. 선택 시 SelectionIndicator 및 Bulk 액션 활성화.
                  </li>
                  <li>
                    <strong>Sticky Header</strong>: 스크롤 시 헤더 고정. 데이터가 많을 때 컬럼
                    의미를 유지.
                  </li>
                  <li>
                    <strong>텍스트 말줄임</strong>: 긴 텍스트는 말줄임(truncate) 처리하고, hover 시
                    Tooltip으로 전체 텍스트 표시.
                  </li>
                  <li>
                    <strong>빈 상태</strong>: 데이터가 없을 때 EmptyState 컴포넌트를 테이블 영역에
                    표시.
                  </li>
                  <li>
                    <strong>로딩</strong>: 데이터 로딩 중에는 Skeleton 행을 표시.
                  </li>
                </ul>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Pagination 연동
                </h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>Table 바로 위에 Pagination 컴포넌트를 배치합니다.</li>
                  <li>페이지 변경 시 선택 상태는 초기화됩니다.</li>
                  <li>총 항목 수와 선택 항목 수를 Pagination에 표시합니다.</li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* 가이드라인 */}
        <VStack gap={3}>
          <Label>가이드라인</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">Do</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>Name 컬럼은 항상 첫 번째에 배치하고 링크로 상세 페이지 이동을 제공합니다.</li>
                <li>기본 정렬 기준을 설정합니다 (보통 생성일 내림차순).</li>
                <li>Actions 컬럼은 항상 마지막에 배치합니다.</li>
                <li>연관 리소스는 클릭하여 해당 리소스로 이동할 수 있도록 링크를 제공합니다.</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">Don&apos;t</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>Status 컬럼에 텍스트만 표시하지 않습니다 (StatusIndicator 사용).</li>
                <li>연관 리소스 컬럼을 중앙 정렬하지 않습니다 (왼쪽 정렬 유지).</li>
                <li>빈 상태에서 빈 테이블 구조만 보여주지 않습니다 (EmptyState 표시).</li>
              </ul>
            </div>
          </div>
        </VStack>

        {/* Demo */}
        <TableDemo />
      </VStack>
    </ComponentPageTemplate>
  );
}
