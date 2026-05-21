import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

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

function DesktopGridGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <SectionTitle>그리드 방식</SectionTitle>
        <Prose>
          <p>
            절대 좌표 기반 그리드 스냅 시스템을 사용합니다. 아이콘 위치는 논리적 그리드 좌표(col,
            row)로 관리되며, <code>gridToPixel()</code>을 통해 렌더링 시 절대 픽셀 좌표로
            변환됩니다.
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <VStack gap={4}>
        <SectionTitle>배치 규칙</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Flow</strong>: column-first (위→아래, 왼쪽→오른쪽) — macOS 데스크톱 컨벤션
            </li>
            <li>
              <strong>Alignment</strong>: top-left (content-start)
            </li>
            <li>
              <strong>Drag &amp; Drop</strong>: 아이콘을 드래그하여 그리드 위치를 자유롭게 변경
              가능. 5px 임계값 이후 드래그 시작.
            </li>
            <li>
              <strong>Resize Reflow</strong>: 뷰포트 축소 시 범위 밖 아이콘이 빈 그리드 위치로 자동
              재배치 (requestAnimationFrame 기반 실시간 반영)
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <div className="p-4 bg-[var(--color-state-info-bg)] rounded-[var(--radius-md)]">
        <div className="text-[length:var(--font-size-12)] text-[var(--color-state-info)]">
          <strong>Desktop Grid Guidelines:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>아이콘은 논리적 좌표(col, row)로 관리되며 절대 좌표로 렌더링됩니다.</li>
            <li>셀 크기는 128×120px (CELL_W×CELL_H). 아이콘 영역은 80px (w-20).</li>
            <li>초기 배치는 column-first: 세로 방향으로 채운 후 다음 열로 이동합니다.</li>
            <li>
              드래그 앤 드롭으로 그리드 위치를 변경할 수 있으며, 드롭 시 가장 가까운 빈 셀에
              스냅됩니다.
            </li>
            <li>브라우저 리사이즈 시 범위 밖 아이콘이 실시간으로 빈 위치에 재배치됩니다.</li>
            <li>하단 64px은 Dock 영역으로 예약됩니다.</li>
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
      description="Absolute-positioned grid snap system for desktop icons with drag-and-drop and responsive reflow."
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
                      ['CELL_W', '128px', 'Grid cell width (horizontal step)'],
                      ['CELL_H', '120px', 'Grid cell height (vertical step)'],
                      ['PAD_X', '44px', 'Horizontal inset from screen left edge'],
                      ['PAD_TOP', '76px', '52px (TopBar) + 24px spacing'],
                      ['ICON_W', '80px', 'Icon button width (w-20)'],
                      ['Bottom reserve', '64px', 'Dock area height'],
                      ['DRAG_THRESHOLD', '5px', 'Minimum distance before drag starts'],
                      ['Flow', 'column-first', 'Top→bottom, then left→right (macOS style)'],
                      ['Positioning', 'absolute + fixed grid', 'gridToPixel(col, row) → left/top'],
                      [
                        'Resize reflow',
                        'requestAnimationFrame',
                        'Real-time reflow — out-of-bounds icons relocated instantly',
                      ],
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
                      Max Columns
                    </th>
                    <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">
                      Max Rows (768px height)
                    </th>
                    <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">
                      8 Icons Layout
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ['1024px', '7', '5', '2 cols × 4 rows + 1 col'],
                      ['1280px', '9', '5', '2 cols × 4 rows'],
                      ['1440px', '10', '5', '2 cols × 4 rows'],
                      ['1920px', '14', '5', '2 cols × 4 rows'],
                      ['2560px', '19', '5', '2 cols × 4 rows'],
                    ] as const
                  ).map(([vp, cols, rows, layout], i) => (
                    <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">{vp}</td>
                      <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">
                        {cols}
                      </td>
                      <td className="py-3 pr-4 text-[var(--color-text-default)]">{rows}</td>
                      <td className="py-3 text-[var(--color-text-muted)]">{layout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              maxCols = floor((width - PAD_X) / CELL_W), maxRows = floor((height - PAD_TOP - 64) /
              CELL_H). Resize reflow relocates out-of-bounds icons to empty cells.
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
              {/* Desktop area — column-first layout */}
              <div className="bg-[#0f0f1a] px-4 pt-3 pb-4 relative" style={{ minHeight: 160 }}>
                {[
                  { label: 'IAM', col: 0, row: 0 },
                  { label: 'AI', col: 0, row: 1 },
                  { label: 'Compute', col: 0, row: 2 },
                  { label: 'Agent', col: 1, row: 0 },
                  { label: 'Container', col: 1, row: 1 },
                  { label: 'Admin', col: 1, row: 2 },
                  { label: 'Storage', col: 2, row: 0 },
                  { label: 'Settings', col: 2, row: 1 },
                ].map(({ label, col, row }) => (
                  <div
                    key={label}
                    className="absolute flex flex-col items-center gap-0.5"
                    style={{ left: 16 + col * 56, top: 8 + row * 44 }}
                  >
                    <div className="w-6 h-6 rounded-[4px] bg-white/10 border border-white/15" />
                    <span className="text-[7px] text-white/60 whitespace-nowrap">{label}</span>
                  </div>
                ))}
                <div className="absolute right-3 top-2 text-[6px] text-white/30 font-mono">
                  col-first flow ↓→
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
                    absolute positioning · gridToPixel(col, row) → left / top
                  </span>
                </div>
                <div className="py-2 px-3 text-center border-l border-[var(--color-border-default)]">
                  <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-action-primary)]">
                    128px
                  </span>
                </div>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      tokens={
        <pre className="text-[length:var(--font-size-11)] p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] overflow-x-auto text-[var(--color-text-muted)]">
          {`/* Grid Constants */
const GRID = {
  CELL_W: 128,   // horizontal step
  CELL_H: 120,   // vertical step
  PAD_X: 44,     // left inset
  PAD_TOP: 76,   // top inset (52px TopBar + 24px)
  ICON_W: 80,    // icon button width
  DRAG_THRESHOLD: 5,
};

/* Logical → Pixel conversion */
function gridToPixel(col: number, row: number) {
  return {
    x: GRID.PAD_X + col * GRID.CELL_W,
    y: GRID.PAD_TOP + row * GRID.CELL_H,
  };
}

/* Grid bounds from container */
function getGridBounds(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  return {
    maxCols: Math.max(1, Math.floor((rect.width - GRID.PAD_X) / GRID.CELL_W)),
    maxRows: Math.max(1, Math.floor((rect.height - GRID.PAD_TOP - 64) / GRID.CELL_H)),
  };
}

/* Desktop Icon — absolute positioned */
<button
  className="absolute flex flex-col items-center gap-1 w-20"
  style={{ left: pos.x, top: pos.y }}
>
  <img className="w-16 h-16 object-cover" />
  <span className="text-label-md text-white">{label}</span>
</button>

/* Resize reflow — requestAnimationFrame */
useEffect(() => {
  let rafId = 0;
  const handleResize = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const { maxCols, maxRows } = getGridBounds(container);
      // Relocate out-of-bounds icons to empty cells
      // Column-first scan: col 0→N, row 0→N
    });
  };
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(rafId);
  };
}, []);`}
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
