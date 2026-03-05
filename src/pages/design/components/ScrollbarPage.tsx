import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

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
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={6}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        클래스명
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        적용 컨텍스트
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        너비
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        Thumb 색상
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        sidebar-scroll
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        메인 사이드바 네비게이션
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">6px</td>
                      <td className="py-2 text-[var(--color-text-muted)]">border-default</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        drawer-scroll
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        드로어/패널 콘텐츠
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">6px</td>
                      <td className="py-2 text-[var(--color-text-muted)]">border-default</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        settings-scroll
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        설정 페이지 콘텐츠
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">6px</td>
                      <td className="py-2 text-[var(--color-text-muted)]">border-default</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        legend-scroll
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">차트 범례 영역</td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">6px</td>
                      <td className="py-2 text-[var(--color-text-muted)]">border-default</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        shell-scroll
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        터미널/Shell 출력
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">6px</td>
                      <td className="py-2 text-[var(--color-text-muted)]">#475569</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        table-scroll-container
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                        테이블 가로 스크롤
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">height 6px</td>
                      <td className="py-2 text-[var(--color-text-muted)]">border-default</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-muted)] mt-2">
                <code>modal-scroll</code>은 4px 너비를 사용한다.
              </p>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Composition (구성 요소)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Track
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">transparent</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Thumb
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">border-radius full</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Design Token
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        값
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        scrollbar-width
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">6px / 4px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        scrollbar-radius
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">full</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        scrollbar-track-color
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">transparent</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        scrollbar-thumb-color
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">border-default</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        scrollbar-thumb-color-dark
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">#475569</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">States</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        상태
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Hidden
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">기본 (비활성 시)</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Visible
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">hover 시</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Active
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">드래그 중</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Behavior</h4>
              <p className="text-body-sm font-medium text-[var(--color-text-default)]">노출 방식</p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>기본적으로 스크롤바는 숨겨지고, hover 시에만 표시된다.</li>
                <li>스크롤 영역에 포커스가 있을 때도 표시할 수 있다.</li>
                <li>비활성 시 track은 transparent로 보이지 않는다.</li>
              </ul>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                가로 스크롤
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <code>table-scroll-container</code> 클래스로 테이블 가로 스크롤에 적용한다.
                </li>
                <li>overflow-x: auto와 함께 사용한다.</li>
              </ul>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                Shell 컨텍스트
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <code>shell-scroll</code>은 어두운 배경(터미널)에서 Thumb 색상을 #475569으로
                  적용한다.
                </li>
              </ul>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Usage Guidelines</h4>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-body-sm font-medium text-[var(--color-state-success)]">
                    Do ✅
                  </span>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1 mt-1">
                    <li>스크롤 가능한 모든 컨테이너에 적절한 scroll 클래스를 적용한다.</li>
                    <li>컨텍스트(사이드바, 드로어, 모달, 테이블)에 맞는 variant를 선택한다.</li>
                  </ul>
                </div>
                <div>
                  <span className="text-body-sm font-medium text-[var(--color-state-danger)]">
                    Don&apos;t ❌
                  </span>
                  <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1 mt-1">
                    <li>스크롤이 필요 없는 영역에 scroll 클래스를 적용하지 않는다.</li>
                    <li>브라우저 기본 스크롤바가 요구되는 환경에서 강제로 덮어쓰지 않는다.</li>
                    <li>다른 variant의 스타일을 혼용하지 않는다.</li>
                  </ul>
                </div>
              </div>
            </VStack>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>width: 6px</code> · <code>radius: full</code> · <code>track: transparent</code> ·{' '}
          <code>thumb: border-default</code>
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
      usage={{
        code: `// Add class to scrollable container
<div className="overflow-y-auto sidebar-scroll">
  {/* scrollable content */}
</div>

// CSS supports both Webkit and Firefox
.sidebar-scroll::-webkit-scrollbar { width: 6px; }
.sidebar-scroll { scrollbar-width: thin; }`,
      }}
      relatedLinks={[
        { label: 'Layout', path: '/design/patterns/layout' },
        { label: 'Modal', path: '/design/components/modal' },
        { label: 'Drawer', path: '/design/components/drawer' },
        { label: 'Table', path: '/design/components/table' },
      ]}
    />
  );
}
