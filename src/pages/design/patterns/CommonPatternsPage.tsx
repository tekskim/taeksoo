import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { CommonPatternsSection } from '../../design-system-sections/CommonPatterns';
import { VStack } from '@/design-system';

export function CommonPatternsPage() {
  return (
    <ComponentPageTemplate
      title="Common patterns"
      description="애플리케이션 전체에서 공통으로 사용되는 UI 패턴 모음입니다. List Page, Detail Page, Drawer, Modal 등의 패턴을 확인할 수 있습니다."
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">패턴 선택 기준</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                      패턴
                    </th>
                    <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                      사용 조건
                    </th>
                    <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                      구성
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      List Page
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      리소스 목록 조회, 검색, 필터링
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      PageHeader + ListToolbar + Pagination + Table
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Detail Page
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      리소스 상세 정보 조회 및 관리
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      DetailHeader + Tabs + SectionCard
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Create Page
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      필드 5~20개의 리소스 생성
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      PageHeader + SectionCard/Disclosure + FormField
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Wizard
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      필드 5개 초과 + 단계별 진행이 필요한 생성
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      Step Cards + Floating Card (Summary)
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Multi Tab Create
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      필드 20개+ 또는 카드 10개+ 초과
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      Tabs + Cards + Floating Card
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                      Form Drawer
                    </td>
                    <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                      간단한 편집 (필드 1~5개)
                    </td>
                    <td className="py-2 text-[var(--color-text-muted)]">
                      Drawer + FormField + Footer buttons
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              필드 5개 부근에서 Form Drawer와 Create Page가 겹칠 수 있습니다. 이 경우 폼의{' '}
              <strong>복잡도</strong>(섹션 구분, 조건부 필드, 연관 리소스 선택 등)를 기준으로
              판단하세요.
            </p>
          </VStack>
        </div>
      }
      examples={<CommonPatternsSection />}
      relatedLinks={[
        {
          label: 'List Page (Table)',
          path: '/design/components/table',
          description: 'Table component for list views',
        },
        {
          label: 'Detail header',
          path: '/design/components/detail-header',
          description: 'Page header for detail views',
        },
        {
          label: 'Wizard',
          path: '/design/patterns/wizard',
          description: 'Multi-step wizard pattern',
        },
        {
          label: 'Open Form (Create Flow)',
          path: '/design/patterns/open-form',
          description: 'Open form and tab-based creation patterns',
        },
        { label: 'Drawer', path: '/design/components/drawer', description: 'Side panel for forms' },
        {
          label: 'Modal',
          path: '/design/components/modal',
          description: 'Dialog for confirmations',
        },
      ]}
    />
  );
}
