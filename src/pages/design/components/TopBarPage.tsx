import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { TopBar, TopBarAction, Breadcrumb, VStack } from '@/design-system';
import { IconBell, IconTerminal2, IconFile, IconCopy, IconSearch } from '@tabler/icons-react';

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

const topBarProps: PropDef[] = [
  { name: 'breadcrumb', type: 'ReactNode', required: false, description: 'Breadcrumb content' },
  { name: 'actions', type: 'ReactNode', required: false, description: 'Right-side actions' },
  {
    name: 'showSidebarToggle',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show sidebar toggle',
  },
  {
    name: 'showNavigation',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Show nav buttons',
  },
  {
    name: 'onSidebarToggle',
    type: '() => void',
    required: false,
    description: 'Sidebar toggle handler',
  },
  { name: 'onBack', type: '() => void', required: false, description: 'Back navigation handler' },
  {
    name: 'onForward',
    type: '() => void',
    required: false,
    description: 'Forward navigation handler',
  },
  {
    name: 'canGoBack',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Enable/disable back button',
  },
  {
    name: 'canGoForward',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Enable/disable forward button',
  },
];

function TopBarGuidelines() {
  return (
    <VStack gap={10}>
      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">구분</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>좌측 사이드바 토글 + 뒤로/앞으로 + 브레드크럼, 우측 Utility Control 없음</Td>
            </tr>
            <tr>
              <Td>
                <strong>With Utility Control</strong>
              </Td>
              <Td>
                Default에 우측 Utility Control 영역(알림, 설정, 단축 기능 버튼 등)이 추가된 형태
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[ 사이드바 토글 ] [ ← → ] [ Breadcrumb ]         [ Utility Control ]`}</pre>
        </div>

        <SubSectionTitle>1. 좌측 영역</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
              <Th className="w-[200px]">제공 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>a. 사이드바 토글 버튼</Td>
              <Td>사이드바 열기/닫기 제어</Td>
              <Td>사이드바가 닫혀 있을 때만 표시</Td>
            </tr>
            <tr>
              <Td>b. 뒤로 가기 (←)</Td>
              <Td>브라우저 히스토리 기반 이전 페이지 이동</Td>
              <Td>Default 형에만 포함</Td>
            </tr>
            <tr>
              <Td>c. 앞으로 가기 (→)</Td>
              <Td>브라우저 히스토리 기반 다음 페이지 이동</Td>
              <Td>Default 형에만 포함</Td>
            </tr>
            <tr>
              <Td>d. Breadcrumb</Td>
              <Td>현재 위치를 계층적으로 표시. 각 항목 클릭 시 해당 경로로 이동</Td>
              <Td>항상</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>2. 우측 영역</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
              <Th className="w-[200px]">제공 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>e. 유틸리티 버튼</Td>
              <Td>서비스 맥락에 따른 단축 기능 버튼 (예: kubectl, 파일, 클립보드, 검색 등)</Td>
              <Td>서비스별 옵션</Td>
            </tr>
            <tr>
              <Td>f. 알림 (🔔)</Td>
              <Td>시스템 알림 진입점. 읽지 않은 알림이 있을 경우 배지 표시</Td>
              <Td>항상</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Tokens</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>height</code>
              </Td>
              <Td>36px</Td>
            </tr>
            <tr>
              <Td>
                <code>padding-x</code>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <code>button-size</code>
              </Td>
              <Td>28px</Td>
            </tr>
            <tr>
              <Td>
                <code>icon-size</code>
              </Td>
              <Td>16px</Td>
            </tr>
            <tr>
              <Td>
                <code>border-radius</code>
              </Td>
              <Td>4px</Td>
            </tr>
            <tr>
              <Td>
                <code>gap</code> (버튼 간격)
              </Td>
              <Td>4px</Td>
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
              <Td>버튼 위에 마우스를 올렸을 때 배경색 변화</Td>
            </tr>
            <tr>
              <Td>
                <strong>Active / Pressed</strong>
              </Td>
              <Td>버튼 클릭 시 눌림 피드백</Td>
            </tr>
            <tr>
              <Td>
                <strong>Disabled</strong>
              </Td>
              <Td>뒤로/앞으로 버튼은 히스토리가 없을 때 비활성 처리</Td>
            </tr>
            <tr>
              <Td>
                <strong>With Badge</strong>
              </Td>
              <Td>알림 버튼에 읽지 않은 알림이 있을 때 배지 노출</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>사이드바 연동</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                사이드바가 <strong>열려 있으면</strong> 토글 버튼을 숨긴다.
              </li>
              <li>
                사이드바가 <strong>닫혀 있으면</strong> 토글 버튼을 표시한다.
              </li>
              <li>
                사이드바 상태 변화 시 Top Navigation Bar의 너비는 콘텐츠 영역에 맞게 자동 조정된다.
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>고정(Sticky) 동작</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>페이지 스크롤과 무관하게 화면 최상단에 항상 고정된다.</li>
              <li>z-index 우선순위를 통해 다른 콘텐츠 위에 렌더링된다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>네비게이션 버튼 활성화 조건</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>뒤로 가기: 브라우저 히스토리에 이전 항목이 있을 때만 활성화</li>
              <li>앞으로 가기: 브라우저 히스토리에 다음 항목이 있을 때만 활성화</li>
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
            'Top Navigation Bar는 항상 화면 최상단에 고정하여 일관된 위치를 유지한다.',
            '우측 액션 버튼은 글로벌 기능으로만 구성한다.',
          ]}
          dontItems={['사이드바가 열린 상태에서 토글 버튼을 중복 표시하지 않는다.']}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              유틸리티 버튼의 아이콘에는 반드시 <strong>접근성을 위한 aria-label 또는 툴팁</strong>
              을 제공한다.
            </li>
          </ul>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function TopBarPage() {
  return (
    <ComponentPageTemplate
      title="Top Navigation Bar"
      description="애플리케이션 상단에 고정되는 헤더 컴포넌트로, 사이드바 토글·네비게이션·브레드크럼·액션 버튼을 포함한다. 현재 위치 맥락을 제공하면서 주요 유틸리티 기능에 빠르게 접근할 수 있도록 설계된다."
      whenToUse={[
        '앱의 모든 페이지에서 일관된 상단 내비게이션 영역이 필요할 때',
        '현재 위치(계층 구조)를 사용자에게 명확히 전달해야 할 때',
        '사이드바 토글, 설정, 알림 등 글로벌 액션에 빠르게 접근해야 할 때',
      ]}
      whenNotToUse={[
        '단독 랜딩 페이지, 로그인 페이지 등 내비게이션이 필요 없는 풀스크린 페이지',
        '모달, 다이얼로그 등 오버레이 영역 내부',
      ]}
      preview={
        <ComponentPreview
          code={`<TopBar
  showSidebarToggle
  onSidebarToggle={() => {}}
  breadcrumb={<Breadcrumb items={[{ label: 'Home' }, { label: 'Settings' }]} />}
  actions={<TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" />}
/>`}
        >
          <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] overflow-hidden">
            <TopBar
              showSidebarToggle
              onSidebarToggle={() => {}}
              onBack={() => {}}
              onForward={() => {}}
              breadcrumb={
                <Breadcrumb
                  items={[
                    { label: 'Home', onClick: () => {} },
                    { label: 'Entry page', onClick: () => {} },
                    { label: 'Settings' },
                  ]}
                />
              }
              actions={
                <TopBarAction
                  icon={<IconBell size={16} stroke={1.5} />}
                  aria-label="Notifications"
                />
              }
            />
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { TopBar, TopBarAction, Breadcrumb } from '@/design-system';

<TopBar
  showSidebarToggle={!sidebarOpen}
  onSidebarToggle={toggleSidebar}
  breadcrumb={
    <Breadcrumb items={[
      { label: 'Projects', href: '/projects' },
      { label: 'My project' },
    ]} />
  }
  actions={
    <TopBarAction icon={<IconBell size={16} />} aria-label="Notifications" />
  }
/>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Default</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                좌측 사이드바 토글 + 뒤로/앞으로 + 브레드크럼. 우측 Utility Control 없음.
              </span>
            </VStack>
            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] overflow-hidden">
              <TopBar
                showSidebarToggle
                onSidebarToggle={() => {}}
                onBack={() => {}}
                onForward={() => {}}
                breadcrumb={
                  <Breadcrumb
                    items={[{ label: 'Projects', onClick: () => {} }, { label: 'My project' }]}
                  />
                }
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>With Utility Control</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                우측에 유틸리티 버튼(Terminal, Files, Copy, Search)과 알림 배지가 추가된 형태.
              </span>
            </VStack>
            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] overflow-hidden">
              <TopBar
                showSidebarToggle
                onSidebarToggle={() => {}}
                breadcrumb={<Breadcrumb items={[{ label: 'Home' }]} />}
                actions={
                  <>
                    <TopBarAction
                      icon={<IconTerminal2 size={16} stroke={1.5} />}
                      aria-label="Terminal"
                    />
                    <TopBarAction icon={<IconFile size={16} stroke={1.5} />} aria-label="Files" />
                    <TopBarAction icon={<IconCopy size={16} stroke={1.5} />} aria-label="Copy" />
                    <TopBarAction
                      icon={<IconSearch size={16} stroke={1.5} />}
                      aria-label="Search"
                    />
                    <TopBarAction
                      icon={<IconBell size={16} stroke={1.5} />}
                      aria-label="Notifications"
                      badge
                    />
                  </>
                }
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>With Badge (알림)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                알림 버튼에 읽지 않은 알림이 있을 때 배지가 노출된다.
              </span>
            </VStack>
            <div className="w-full border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] overflow-hidden">
              <TopBar
                showSidebarToggle
                onSidebarToggle={() => {}}
                canGoBack={true}
                canGoForward={false}
                breadcrumb={
                  <Breadcrumb
                    items={[{ label: 'Projects', onClick: () => {} }, { label: 'My project' }]}
                  />
                }
                actions={
                  <TopBarAction
                    icon={<IconBell size={16} stroke={1.5} />}
                    aria-label="Notifications"
                    badge
                  />
                }
              />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<TopBarGuidelines />}
      tokens={
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>height</code>
              </Td>
              <Td>36px</Td>
            </tr>
            <tr>
              <Td>
                <code>padding-x</code>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <code>button-size</code>
              </Td>
              <Td>28px</Td>
            </tr>
            <tr>
              <Td>
                <code>icon-size</code>
              </Td>
              <Td>16px</Td>
            </tr>
            <tr>
              <Td>
                <code>border-radius</code>
              </Td>
              <Td>4px</Td>
            </tr>
            <tr>
              <Td>
                <code>gap</code> (버튼 간격)
              </Td>
              <Td>4px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      }
      apiReference={topBarProps}
      accessibility={
        <Prose>
          <p>
            유틸리티 버튼의 아이콘에는 반드시 <code>aria-label</code> 또는 툴팁을 제공한다.
            네비게이션 버튼(뒤로/앞으로)은 키보드로 접근 가능하다.
          </p>
        </Prose>
      }
      relatedLinks={[
        {
          label: 'Breadcrumb',
          path: '/design/components/breadcrumb',
          description: '현재 위치 계층 경로 표시',
        },
        {
          label: 'Tab Bar',
          path: '/design/components/tabbar',
          description: '브라우저 스타일 멀티 탭',
        },
        {
          label: 'Page Shell',
          path: '/design/patterns/layout',
          description: '전체 페이지 레이아웃 구조',
        },
        {
          label: 'Side Navigation Bar',
          path: '/design/components/menu',
          description: '좌측 사이드바 네비게이션',
        },
        { label: 'Shell', path: '/design/patterns/shell', description: '터미널 패널' },
      ]}
    />
  );
}
