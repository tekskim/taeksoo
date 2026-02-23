import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';

export function CsvDownloadPage() {
  return (
    <ComponentPageTemplate
      title="CSV file download"
      description="Download list data as CSV files from resource list pages"
      relatedLinks={[
        { label: 'Table', path: '/design/components/table', description: 'List data display' },
        {
          label: 'List Toolbar',
          path: '/design/patterns/common',
          description: 'List page pattern with download',
        },
      ]}
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>1. 개요</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <p className="text-body-md text-[var(--color-text-muted)]">
              리스트 화면에서 제공하는 다운로드(Download) 기능은 사용자가 화면에 표시된 데이터를{' '}
              <strong>CSV 형태</strong>로 저장 및 공유할 수 있도록 지원합니다.
            </p>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>2. CSV 파일 구조</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)] w-[160px]">
                    항목
                  </th>
                  <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                    규칙
                  </th>
                  <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">포맷</td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">CSV</td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">—</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                    파일명 규칙
                  </td>
                  <td className="py-2.5 pr-4">
                    <code className="text-body-sm text-[var(--color-action-primary)] bg-[var(--color-surface-subtle)] px-1.5 py-0.5 rounded-[var(--radius-sm)]">
                      {'{{resource_name}}_{{YYYYMMDD}}_{{HH:MM}}.csv'}
                    </code>
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">—</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                    포함 컬럼
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">
                    해당 리소스의 <strong>전체 컬럼</strong>
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">
                    테이블 속성에서 보이는/숨겨진 컬럼에 상관없이 전체 컬럼 데이터가 추출됩니다.
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                    포함 데이터
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">
                    검색/필터 조건이 적용된 <strong>전체 데이터 세트</strong>
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">
                    조건이 없으면 모든 데이터, 조건이 있으면 해당 데이터만 추출
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                    빈 상태
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">
                    컬럼 헤더만 포함된 빈 CSV 파일 생성
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">
                    생성된 리소스가 없거나 조건에 부합한 리소스가 없을 때
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-[var(--color-text-default)]">
                    대용량 파일
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-muted)]">
                    <strong>zip 파일</strong>로 압축하여 제공
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">
                    로우 수(아이템 개수)가 <strong>10,000건 초과</strong> 시 대용량 파일로 분류
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>필터/검색 적용 시 동작</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                필터/검색 조건 없음
              </h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  현재 존재하는 <strong>모든 데이터</strong>가 추출됩니다.
                </li>
                <li>별도 확인 모달 없이 즉시 다운로드됩니다.</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                필터/검색 조건 있음
              </h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>해당 조건에 해당하는 데이터만 추출됩니다.</li>
                <li>
                  조건에 해당하는 데이터만 다운로드된다는 <strong>확인 모달</strong>이 노출됩니다.
                </li>
              </ul>
            </div>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>실패 처리</Label>
          <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
            <p className="text-body-sm text-[var(--color-text-muted)]">
              다운로드 실패 시 토스트 메세지:
            </p>
            <code className="text-body-sm text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)] px-2 py-1 rounded-[var(--radius-sm)] mt-1 inline-block">
              {'Failed to download the {resource_name} list'}
            </code>
          </div>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
