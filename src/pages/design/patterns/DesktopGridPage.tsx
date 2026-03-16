import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

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

function DesktopGridGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <SectionTitle>그리드 방식</SectionTitle>
        <Prose>
          <p>
            CSS Grid의 <span className="font-mono">repeat(auto-fill, 80px)</span>를 사용하여 뷰포트
            너비에 따라 아이콘이 자동으로 재배열됩니다. 아이콘 추가/삭제 시 레이아웃 변경이 필요
            없습니다.
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={4}>
        <SectionTitle>배치 규칙</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Flow</strong>: row (왼쪽→오른쪽, 위→아래) — OS 데스크톱 컨벤션
            </li>
            <li>
              <strong>Alignment</strong>: top-left (<span className="font-mono">content-start</span>
              )
            </li>
            <li>
              <strong>Wrap</strong>: 뷰포트 부족 시 자동으로 다음 행으로 이동
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <div className="p-4 bg-[var(--color-state-info-bg)] rounded-[var(--radius-md)]">
        <div className="text-[length:var(--font-size-12)] text-[var(--color-state-info)]">
          <strong>Desktop Grid Guidelines:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>
              <span className="font-mono">auto-fill</span>로 뷰포트에 맞게 컬럼 수가 자동
              결정됩니다.
            </li>
            <li>아이콘 셀은 80px 고정 (w-20). 64px 아이콘 이미지가 중앙 정렬됩니다.</li>
            <li>
              1280px+ 에서 현재 8개 아이콘이 모두 한 줄에 들어갑니다. 1024px에서는 마지막 아이콘이
              두 번째 줄로 이동합니다.
            </li>
            <li>앱 아이콘 추가 시 레이아웃 변경 없이 자동 reflow됩니다.</li>
            <li>하단 64px은 "Go to main page" 네비게이션 링크 영역으로 예약됩니다.</li>
          </ul>
        </div>
      </div>
    </VStack>
  );
}

export function DesktopGridPage() {
  return (
    <ComponentPageTemplate
      title="Desktop Icon Grid"
      description="Responsive grid layout for desktop page icons. Auto-reflows based on viewport width."
      guidelines={<DesktopGridGuidelines />}
      examples={
        <VStack gap={8}>
          {/* Grid Specification Table */}
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Grid specification
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-[length:var(--font-size-12)]">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Property
                    </th>
                    <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Value
                    </th>
                    <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ['Cell size', '80 × ~100px', 'Icon 64px + gap 4px + label (~16px)'],
                      ['Column gap', '48px (gap-x-12)', 'Horizontal space between icons'],
                      ['Row gap', '32px (gap-y-8)', 'Vertical space between rows'],
                      ['Padding', '44px L/R (px-11)', 'Horizontal inset from screen edge'],
                      ['Top offset', '76px', '52px (TopBar height) + 24px spacing'],
                      ['Bottom reserve', '64px (bottom-16)', 'Space for navigation link area'],
                      ['Flow', 'row (left→right, top→bottom)', 'CSS Grid auto-fill'],
                      ['Alignment', 'top-left (content-start)', 'OS desktop convention'],
                    ] as const
                  ).map(([prop, value, desc], i) => (
                    <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">
                        {prop}
                      </td>
                      <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">
                        {value}
                      </td>
                      <td className="py-3 text-[var(--color-text-muted)]">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </VStack>

          {/* Viewport Behavior Table */}
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Viewport behavior
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-[length:var(--font-size-12)]">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)]">
                    <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Viewport
                    </th>
                    <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Available Width
                    </th>
                    <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Max Columns
                    </th>
                    <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">
                      8 Icons Layout
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ['1024px', '936px', '7', '7 + 1 (2 rows)'],
                      ['1280px', '1192px', '9', '1 row'],
                      ['1440px', '1352px', '10', '1 row'],
                      ['1920px', '1832px', '14', '1 row'],
                      ['2560px', '2472px', '19', '1 row'],
                    ] as const
                  ).map(([vp, avail, cols, layout], i) => (
                    <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">{vp}</td>
                      <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">
                        {avail}
                      </td>
                      <td className="py-3 pr-4 text-[var(--color-text-default)]">{cols}</td>
                      <td className="py-3 text-[var(--color-text-muted)]">{layout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Column count = floor((viewport - 88px padding) / (80px cell + 48px gap)). Icons
              auto-wrap to next row when columns are insufficient.
            </p>
          </VStack>

          {/* Visual Diagram */}
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Grid layout diagram
            </span>
            <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] overflow-hidden">
              {/* TopBar mock */}
              <div className="h-7 bg-[#1a1a2e] flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-white/20" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="w-2.5 h-2.5 rounded-[2px] bg-white/15" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-12 rounded-[3px] bg-white/10 border border-white/15" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>
              {/* Desktop area */}
              <div className="bg-[#0f0f1a] px-4 pt-3 pb-4">
                <div
                  className="grid gap-x-6 gap-y-3 items-start content-start"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, 40px)' }}
                >
                  {[
                    'IAM',
                    'Compute',
                    'Storage',
                    'Container',
                    'AI',
                    'Agent',
                    'Settings',
                    'Admin',
                  ].map((name) => (
                    <div key={name} className="flex flex-col items-center gap-0.5">
                      <div className="w-6 h-6 rounded-[4px] bg-white/10 border border-white/15" />
                      <span className="text-[7px] text-white/60 whitespace-nowrap">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Dimensions footer */}
              <div className="flex border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                <div className="py-2 px-3 text-center border-r border-[var(--color-border-default)]">
                  <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-action-primary)]">
                    44px
                  </span>
                </div>
                <div className="flex-1 py-2 text-center">
                  <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-muted)]">
                    grid-template-columns: repeat(auto-fill, 80px) · gap: 48px 32px
                  </span>
                </div>
                <div className="py-2 px-3 text-center border-l border-[var(--color-border-default)]">
                  <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-action-primary)]">
                    44px
                  </span>
                </div>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      tokens={
        <pre className="text-[length:var(--font-size-11)] p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] overflow-x-auto text-[var(--color-text-muted)]">
          {`/* Desktop Icon Grid Container */
<div
  className="absolute top-[76px] left-0 right-0 bottom-16
             px-11 grid gap-x-12 gap-y-8
             content-start items-start"
  style={{ gridTemplateColumns: 'repeat(auto-fill, 80px)' }}
>
  <DesktopIcon icon={...} label="IAM" />
  <DesktopIcon icon={...} label="Compute" />
  {/* ... more icons auto-wrap to next row */}
</div>

/* DesktopIcon — fixed 80px cell */
<button className="flex flex-col items-center gap-1 w-20">
  <div className="w-20 h-20 flex items-center justify-center">
    <img className="w-16 h-16 object-cover" />
  </div>
  <span className="text-label-md text-white">{label}</span>
</button>`}
        </pre>
      }
      relatedLinks={[
        { label: 'Layout', path: '/design/patterns/layout', description: 'Application layout' },
        {
          label: 'App icons',
          path: '/design/foundation/app-icons',
          description: 'Desktop app icon assets',
        },
      ]}
    />
  );
}
