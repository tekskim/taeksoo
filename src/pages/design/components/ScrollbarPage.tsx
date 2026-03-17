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

function ScrollbarGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={2}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>클래스명</Th>
              <Th>적용 컨텍스트</Th>
              <Th>너비</Th>
              <Th>Thumb 색상</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>sidebar-scroll</strong>
              </Td>
              <Td>메인 사이드바 네비게이션</Td>
              <Td>6px</Td>
              <Td>border-default</Td>
            </tr>
            <tr>
              <Td>
                <strong>drawer-scroll</strong>
              </Td>
              <Td>드로어/패널 콘텐츠</Td>
              <Td>6px</Td>
              <Td>border-default</Td>
            </tr>
            <tr>
              <Td>
                <strong>settings-scroll</strong>
              </Td>
              <Td>설정 페이지 콘텐츠</Td>
              <Td>6px</Td>
              <Td>border-default</Td>
            </tr>
            <tr>
              <Td>
                <strong>legend-scroll</strong>
              </Td>
              <Td>차트 범례 영역</Td>
              <Td>6px</Td>
              <Td>border-default</Td>
            </tr>
            <tr>
              <Td>
                <strong>shell-scroll</strong>
              </Td>
              <Td>터미널/Shell 출력</Td>
              <Td>6px</Td>
              <Td>#475569</Td>
            </tr>
            <tr>
              <Td>
                <strong>table-scroll-container</strong>
              </Td>
              <Td>테이블 가로 스크롤</Td>
              <Td>height 6px</Td>
              <Td>border-default</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <p>modal-scroll은 4px 너비를 사용한다.</p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={2}>
        <SectionTitle>Composition (구성 요소)</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Track</strong>
              </Td>
              <Td>transparent</Td>
            </tr>
            <tr>
              <Td>
                <strong>Thumb</strong>
              </Td>
              <Td>border-radius full</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Design Token</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>scrollbar-width</strong>
              </Td>
              <Td>6px / 4px</Td>
            </tr>
            <tr>
              <Td>
                <strong>scrollbar-radius</strong>
              </Td>
              <Td>full</Td>
            </tr>
            <tr>
              <Td>
                <strong>scrollbar-track-color</strong>
              </Td>
              <Td>transparent</Td>
            </tr>
            <tr>
              <Td>
                <strong>scrollbar-thumb-color</strong>
              </Td>
              <Td>border-default</Td>
            </tr>
            <tr>
              <Td>
                <strong>scrollbar-thumb-color-dark</strong>
              </Td>
              <Td>#475569</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={2}>
        <SectionTitle>States</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>상태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Hidden</strong>
              </Td>
              <Td>기본 (비활성 시)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Visible</strong>
              </Td>
              <Td>hover 시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Active</strong>
              </Td>
              <Td>드래그 중</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={2}>
        <SectionTitle>Behavior</SectionTitle>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)]">노출 방식</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>기본적으로 스크롤바는 숨겨지고, hover 시에만 표시된다.</li>
            <li>스크롤 영역에 포커스가 있을 때도 표시할 수 있다.</li>
            <li>비활성 시 track은 transparent로 보이지 않는다.</li>
          </ul>
        </Prose>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)] mt-2">
            가로 스크롤
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>table-scroll-container 클래스로 테이블 가로 스크롤에 적용한다.</li>
            <li>overflow-x: auto와 함께 사용한다.</li>
          </ul>
        </Prose>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)] mt-2">
            Shell 컨텍스트
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>shell-scroll은 어두운 배경(터미널)에서 Thumb 색상을 #475569으로 적용한다.</li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={2}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '스크롤 가능한 모든 컨테이너에 적절한 scroll 클래스를 적용한다.',
            '컨텍스트(사이드바, 드로어, 모달, 테이블)에 맞는 variant를 선택한다.',
          ]}
          dontItems={[
            '스크롤이 필요 없는 영역에 scroll 클래스를 적용하지 않는다.',
            '브라우저 기본 스크롤바가 요구되는 환경에서 강제로 덮어쓰지 않는다.',
            '다른 variant의 스타일을 혼용하지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function ScrollbarPage() {
  return (
    <ComponentPageTemplate
      title="Scrollbar"
      description="다양한 컨테이너 영역에 적용되는 커스텀 스크롤바 스타일 컴포넌트다. 기본 브라우저 스크롤바를 대체하여 TDS에 맞는 일관된 스크롤 경험을 제공한다."
      whenToUse={[
        '콘텐츠 영역이 컨테이너 높이를 초과하여 세로 스크롤이 필요한 경우',
        '테이블 등에서 콘텐츠가 컨테이너 너비를 초과하여 가로 스크롤이 필요한 경우',
        '사이드바, 드로어/패널, 모달 등 스크롤 가능한 모든 UI 영역',
      ]}
      whenNotToUse={[
        '콘텐츠가 컨테이너 안에 완전히 들어오는 경우 (스크롤 불필요)',
        '브라우저 기본 스크롤바가 요구되는 OS 환경',
      ]}
      guidelines={<ScrollbarGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          width: 6px · radius: full · track: transparent · thumb: border-default
        </div>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Available classes
            </span>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  name: 'sidebar-scroll',
                  desc: 'Main sidebar navigation. Width: 6px, stable gutter.',
                },
                { name: 'drawer-scroll', desc: 'Drawer/Panel content. Width: 6px.' },
                { name: 'settings-scroll', desc: 'Settings page content. Width: 6px.' },
                { name: 'legend-scroll', desc: 'Chart legend area. Width: 6px.' },
                {
                  name: 'shell-scroll',
                  desc: 'Terminal/Shell output. Width: 6px, dark thumb (#475569).',
                },
                {
                  name: 'table-scroll-container',
                  desc: 'Table horizontal scroll. Height: 6px, auto overflow-x.',
                },
              ].map(({ name, desc }) => (
                <div
                  key={name}
                  className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]"
                >
                  <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">
                    {name}
                  </div>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Live examples</span>
            <div className="flex gap-6 items-start">
              <div className="flex flex-col gap-2 w-[200px]">
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  sidebar-scroll (6px)
                </span>
                <div className="w-full h-[150px] overflow-y-auto overflow-x-hidden sidebar-scroll bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                  <div className="space-y-2 w-full">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={i}
                        className="text-[length:var(--font-size-11)] text-[var(--color-text-default)] py-1"
                      >
                        Menu Item {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[200px]">
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  shell-scroll (dark)
                </span>
                <div className="w-full h-[150px] overflow-y-auto overflow-x-hidden shell-scroll bg-[#1e293b] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                  <div className="space-y-1 font-mono w-full">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="text-[length:var(--font-size-11)] text-[#94a3b8]">
                        $ command --option {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Horizontal scroll (table-scroll-container)
            </span>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Table horizontal scrollbar (height: 6px)
                </span>
                <div
                  className="w-full max-w-[500px] table-scroll-container bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]"
                  style={{ overflowX: 'auto' }}
                >
                  <div className="flex gap-4 p-3" style={{ width: '800px' }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-[120px] h-[60px] bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] flex items-center justify-center text-[length:var(--font-size-11)] text-[var(--color-text-default)]"
                      >
                        Column {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        { label: 'Layout', path: '/design/patterns/layout' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Drawer', path: '/design/components/drawer' },
        { label: 'Table', path: '/design/components/table' },
      ]}
    />
  );
}
