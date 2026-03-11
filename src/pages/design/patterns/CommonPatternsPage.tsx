import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { CommonPatternsSection } from '../../design-system-sections/CommonPatterns';
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

function CommonPatternsGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <SectionTitle>패턴 선택 기준</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>패턴</Th>
              <Th>사용 조건</Th>
              <Th>구성</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>List Page</strong>
              </Td>
              <Td>리소스 목록 조회, 검색, 필터링</Td>
              <Td>PageHeader + ListToolbar + Pagination + Table</Td>
            </tr>
            <tr>
              <Td>
                <strong>Detail Page</strong>
              </Td>
              <Td>리소스 상세 정보 조회 및 관리</Td>
              <Td>DetailHeader + Tabs + SectionCard</Td>
            </tr>
            <tr>
              <Td>
                <strong>Create Page</strong>
              </Td>
              <Td>필드 5~20개의 리소스 생성</Td>
              <Td>PageHeader + SectionCard/Disclosure + FormField</Td>
            </tr>
            <tr>
              <Td>
                <strong>Wizard</strong>
              </Td>
              <Td>필드 5개 초과 + 단계별 진행이 필요한 생성</Td>
              <Td>Step Cards + Floating Card (Summary)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Multi Tab Create</strong>
              </Td>
              <Td>필드 20개+ 또는 카드 10개+ 초과</Td>
              <Td>Tabs + Cards + Floating Card</Td>
            </tr>
            <tr>
              <Td>
                <strong>Form Drawer</strong>
              </Td>
              <Td>간단한 편집 (필드 1~5개)</Td>
              <Td>Drawer + FormField + Footer buttons</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <p>
            필드 5개 부근에서 Form Drawer와 Create Page가 겹칠 수 있습니다. 이 경우 폼의{' '}
            <strong>복잡도</strong>(섹션 구분, 조건부 필드, 연관 리소스 선택 등)를 기준으로
            판단하세요.
          </p>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function CommonPatternsPage() {
  return (
    <ComponentPageTemplate
      title="Common patterns"
      description="애플리케이션 전체에서 공통으로 사용되는 UI 패턴 모음입니다. List Page, Detail Page, Drawer, Modal 등의 패턴을 확인할 수 있습니다."
      guidelines={<CommonPatternsGuidelines />}
      examples={<CommonPatternsSection />}
      relatedLinks={[
        {
          label: 'List Page (Table)',
          path: '/design/components/table',
          description: 'Table component for list views',
        },
        {
          label: 'Detail header',
          path: '/design/patterns/detail-header',
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
