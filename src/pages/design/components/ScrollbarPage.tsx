import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { VStack } from '@/design-system';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border-b border-r last:border-r-0 border-[var(--color-border-subtle)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td
      className={`p-3 border-t border-r last:border-r-0 border-[var(--color-border-subtle)] align-top ${className}`}
    >
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="text-[length:var(--font-size-11)] leading-relaxed bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] p-4 overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
}

function ScrollbarGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={2}>
        <SectionTitle>Variants</SectionTitle>
        <Prose>
          <p>
            모든 스크롤 영역은 <code>OverlayScrollbarsComponent</code>를 사용한다. 용도에 따라 CSS
            클래스로 테마를 분기한다.
          </p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Variant</Th>
              <Th>CSS 클래스</Th>
              <Th>크기</Th>
              <Th>적용 컨텍스트</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>
                <code>os-theme-dark</code> (자동 적용)
              </Td>
              <Td>6px</Td>
              <Td>사이드바, 드로어, 레이아웃, 설정 등 대부분의 영역</Td>
            </tr>
            <tr>
              <Td>
                <strong>Compact</strong>
              </Td>
              <Td>
                <code>os-compact</code>
              </Td>
              <Td>4px</Td>
              <Td>모달, 작은 컨테이너 내부</Td>
            </tr>
            <tr>
              <Td>
                <strong>Shell</strong>
              </Td>
              <Td>
                <code>os-shell</code>
              </Td>
              <Td>6px</Td>
              <Td>터미널/콘솔 (어두운 배경, 밝은 Thumb)</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <VStack gap={2}>
        <SectionTitle>Composition</SectionTitle>
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
                <strong>os-viewport</strong>
              </Td>
              <Td>실제 스크롤되는 뷰포트. 콘텐츠를 감싸며 overflow를 처리한다.</Td>
            </tr>
            <tr>
              <Td>
                <strong>os-scrollbar</strong>
              </Td>
              <Td>콘텐츠 위에 오버레이되는 스크롤바 컨테이너 (Track).</Td>
            </tr>
            <tr>
              <Td>
                <strong>os-scrollbar-handle</strong>
              </Td>
              <Td>드래그 가능한 Thumb. border-radius: full.</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <TableWrapper>
          <thead>
            <tr>
              <Th>CSS Variable</Th>
              <Th>Default</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>--os-size</code>
              </Td>
              <Td>6px / 4px (compact)</Td>
              <Td>스크롤바 너비(세로) 또는 높이(가로)</Td>
            </tr>
            <tr>
              <Td>
                <code>--os-handle-bg</code>
              </Td>
              <Td>border-default 60%</Td>
              <Td>Thumb 기본 색상</Td>
            </tr>
            <tr>
              <Td>
                <code>--os-handle-bg-hover</code>
              </Td>
              <Td>border-default</Td>
              <Td>Thumb hover 색상</Td>
            </tr>
            <tr>
              <Td>
                <code>--os-handle-bg-active</code>
              </Td>
              <Td>border-strong</Td>
              <Td>Thumb 드래그 시 색상</Td>
            </tr>
            <tr>
              <Td>
                <code>--os-handle-border-radius</code>
              </Td>
              <Td>full</Td>
              <Td>Thumb 라운드</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

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
              <Td>
                기본 상태. 스크롤하지 않을 때 스크롤바가 숨겨진다. (<code>autoHide: 'scroll'</code>)
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Visible</strong>
              </Td>
              <Td>스크롤 중 표시된다. 스크롤 멈춘 뒤 800ms 후 다시 숨겨진다.</Td>
            </tr>
            <tr>
              <Td>
                <strong>Hover</strong>
              </Td>
              <Td>스크롤바 위에 마우스를 올리면 Thumb 색상이 진해진다.</Td>
            </tr>
            <tr>
              <Td>
                <strong>Active</strong>
              </Td>
              <Td>Thumb을 드래그하는 동안 가장 진한 색상이 적용된다.</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <VStack gap={2}>
        <SectionTitle>Behavior</SectionTitle>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)]">기본 사용법</p>
        </Prose>
        <CodeBlock>
          {`import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

<OverlayScrollbarsComponent
  options={{
    overflow: { x: 'hidden', y: 'scroll' },
    scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
  }}
  defer={false}
  className="flex-1"
>
  {children}
</OverlayScrollbarsComponent>`}
        </CodeBlock>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)] mt-2">
            overflow 방향
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              세로 전용: <code>{`overflow: { x: 'hidden', y: 'scroll' }`}</code> — 사이드바, 드로어,
              메인 콘텐츠
            </li>
            <li>
              양방향: <code>{`overflow: { x: 'scroll', y: 'scroll' }`}</code> — 터미널, 에디터
            </li>
          </ul>
        </Prose>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)] mt-2">
            Shell 컨텍스트
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              어두운 배경의 터미널/콘솔에서는 <code>os-shell</code> 클래스를 추가하여 밝은 Thumb
              색상을 적용한다.
            </li>
          </ul>
        </Prose>
        <Prose>
          <p className="text-body-md font-medium text-[var(--color-text-default)] mt-2">
            HTML 요소 변경
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code>element</code> prop으로 호스트 태그를 변경할 수 있다. 예:{' '}
              <code>{`element="nav"`}</code>, <code>{`element="main"`}</code>
            </li>
          </ul>
        </Prose>
      </VStack>

      <VStack gap={2}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '스크롤 가능한 모든 컨테이너에 OverlayScrollbarsComponent를 사용한다.',
            '용도에 맞는 overflow 방향(x/y)과 autoHide 설정을 선택한다.',
            '모달 등 작은 컨테이너에는 os-compact 클래스를 추가하여 4px로 줄인다.',
          ]}
          dontItems={[
            '네이티브 CSS 스크롤바 스타일링(::-webkit-scrollbar)을 직접 사용하지 않는다.',
            'OverlayScrollbarsComponent 없이 overflow-auto만 단독 사용하지 않는다.',
            'textarea 등 폼 요소 내부에는 OverlayScrollbars를 사용할 수 없다.',
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
      description="OverlayScrollbars 기반의 오버레이 스크롤바 컴포넌트다. 콘텐츠 위에 겹쳐 표시되어 레이아웃 공간을 차지하지 않고, 스크롤하지 않을 때 자동으로 숨겨진다."
      whenToUse={[
        '콘텐츠 영역이 컨테이너 높이를 초과하여 세로 스크롤이 필요한 경우',
        '사이드바, 드로어, 모달, 메인 콘텐츠 등 스크롤 가능한 모든 UI 영역',
        '터미널/콘솔 등 어두운 배경에서 밝은 스크롤바가 필요한 경우',
      ]}
      whenNotToUse={[
        '콘텐츠가 컨테이너 안에 완전히 들어오는 경우 (스크롤 불필요)',
        'textarea 등 네이티브 폼 요소 내부 스크롤',
      ]}
      guidelines={<ScrollbarGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          --os-size: 6px · --os-handle-bg: border-default 60% · --os-handle-bg-hover: border-default
          · --os-handle-bg-active: border-strong · --os-handle-border-radius: full
        </div>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Presets</span>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  name: 'Default (6px)',
                  desc: '사이드바, 드로어, 레이아웃 등 대부분의 스크롤 영역.',
                },
                {
                  name: 'Compact (4px)',
                  desc: '모달, 작은 컨테이너. os-compact 클래스 추가.',
                },
                {
                  name: 'Shell (dark)',
                  desc: '터미널/콘솔. os-shell 클래스, 밝은 Thumb 색상.',
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
                  Default (6px)
                </span>
                <OverlayScrollbarsComponent
                  options={{
                    overflow: { x: 'hidden', y: 'scroll' },
                    scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
                  }}
                  defer={false}
                  className="w-full h-[150px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3"
                >
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
                </OverlayScrollbarsComponent>
              </div>
              <div className="flex flex-col gap-2 w-[200px]">
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Shell (dark)
                </span>
                <OverlayScrollbarsComponent
                  options={{
                    overflow: { x: 'hidden', y: 'scroll' },
                    scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
                  }}
                  defer={false}
                  className="w-full h-[150px] bg-[#1e293b] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3 os-shell"
                >
                  <div className="space-y-1 font-mono w-full">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="text-[length:var(--font-size-11)] text-[#94a3b8]">
                        $ command --option {i + 1}
                      </div>
                    ))}
                  </div>
                </OverlayScrollbarsComponent>
              </div>
              <div className="flex flex-col gap-2 w-[200px]">
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Compact (4px)
                </span>
                <OverlayScrollbarsComponent
                  options={{
                    overflow: { x: 'hidden', y: 'scroll' },
                    scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
                  }}
                  defer={false}
                  className="w-full h-[150px] bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3 os-compact"
                >
                  <div className="space-y-2 w-full">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={i}
                        className="text-[length:var(--font-size-11)] text-[var(--color-text-default)] py-1"
                      >
                        List item {i + 1}
                      </div>
                    ))}
                  </div>
                </OverlayScrollbarsComponent>
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
