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

function GridConstantsTable() {
  const rows = [
    ['CELL_W', '128px', '그리드 셀 가로 폭. 아이콘 간 가로 간격(step)을 결정합니다.'],
    ['CELL_H', '120px', '그리드 셀 세로 높이. 아이콘 간 세로 간격(step)을 결정합니다.'],
    ['PAD_X', '44px', '화면 왼쪽 가장자리에서 첫 번째 열까지의 수평 여백.'],
    ['PAD_TOP', '76px', 'TopBar 높이(52px) + 상단 여백(24px). 첫 번째 행의 시작 위치.'],
    ['ICON_W', '80px', '아이콘 버튼의 너비 (w-20). 셀 내부에서 중앙 정렬됩니다.'],
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[length:var(--font-size-12)]">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
              상수
            </th>
            <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
              값
            </th>
            <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">설명</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, value, desc], i) => (
            <tr key={i} className="border-b border-[var(--color-border-subtle)]">
              <td className="py-2.5 pr-4 font-mono text-[var(--color-text-default)]">{name}</td>
              <td className="py-2.5 pr-4 font-mono text-[var(--color-action-primary)]">{value}</td>
              <td className="py-2.5 text-[var(--color-text-muted)]">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DesktopGridGuidelines() {
  return (
    <VStack gap={10}>
      {/* 1. 그리드 방식 */}
      <VStack gap={4}>
        <SectionTitle>그리드 방식</SectionTitle>
        <Prose>
          <p>
            <strong>절대 좌표 기반 고정 그리드 시스템</strong>을 사용합니다. 아이콘 위치는 논리적
            그리드 좌표(<code>col</code>, <code>row</code>)로 관리되며, 렌더링 시{' '}
            <code>gridToPixel(col, row)</code> 함수를 통해 절대 픽셀 좌표로 변환됩니다.
          </p>
          <p>
            아이콘은 항상 <strong>column-first 순서</strong>(세로 우선, macOS 컨벤션)로 자동
            배치됩니다. 드래그 앤 드롭은 지원하지 않으며, 사용자가 아이콘 위치를 수동으로 변경할 수
            없습니다.
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* 2. 그리드 상수 */}
      <VStack gap={4}>
        <SectionTitle>그리드 상수</SectionTitle>
        <Prose>
          <p>
            모든 그리드 설정은 <code>GRID</code> 상수 객체에 정의되어 있습니다. 아이콘의 실제 렌더링
            위치는 아래 공식으로 계산됩니다:
          </p>
        </Prose>
        <pre className="text-[length:var(--font-size-11)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] text-[var(--color-text-muted)] overflow-x-auto">
          {`x = PAD_X + col × CELL_W    →  44 + col × 128
y = PAD_TOP + row × CELL_H  →  76 + row × 120`}
        </pre>
        <GridConstantsTable />
        <Prose>
          <p>
            아이콘 간 실제 여백: 가로 <strong>48px</strong> (CELL_W 128 - ICON_W 80), 세로 약{' '}
            <strong>36px</strong> (CELL_H 120 - 아이콘 높이 ~84px).
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* 3. 아이콘 구조 */}
      <VStack gap={4}>
        <SectionTitle>아이콘 구조</SectionTitle>
        <Prose>
          <p>각 아이콘은 다음 데이터로 관리됩니다:</p>
        </Prose>
        <pre className="text-[length:var(--font-size-11)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] text-[var(--color-text-muted)] overflow-x-auto">
          {`interface DesktopIconItem {
  id: string;      // 고유 식별자 (예: 'compute', 'iam')
  icon: string;    // 앱 아이콘 이미지 경로
  label: string;   // 아이콘 하단 라벨 텍스트
  col: number;     // 그리드 열 좌표 (0부터 시작)
  row: number;     // 그리드 행 좌표 (0부터 시작)
}`}
        </pre>
        <Prose>
          <p>
            렌더링 구조: <code>{'<button>'}</code> (80px 너비) 안에 64×64 아이콘 이미지 + 4px 간격 +
            라벨 텍스트(<code>text-label-md</code>)로 구성됩니다.
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* 4. 배치 규칙 */}
      <VStack gap={4}>
        <SectionTitle>배치 규칙</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>초기 배치 (Column-first)</strong>: 세로 방향으로 먼저 채운 후 다음 열로
              이동합니다 (macOS 데스크톱 컨벤션). 예를 들어 maxRows가 5이면, 첫 5개 아이콘은 col=0의
              row 0~4에 배치되고, 6번째 아이콘부터 col=1에 배치됩니다.
            </li>
            <li>
              <strong>Alignment</strong>: top-left (content-start). 화면 좌상단에서 아이콘이
              시작됩니다.
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* 5. 자동 Compact */}
      <VStack gap={4}>
        <SectionTitle>자동 Compact</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              드래그 앤 드롭은 <strong>지원하지 않습니다</strong>. 아이콘은 항상 column-first 순서로
              자동 배치됩니다.
            </li>
            <li>
              앱이 추가/제거되면 전체 아이콘이 column-first 순서로 자동 재배열(compact)됩니다. 빈
              셀이 남지 않습니다.
            </li>
            <li>
              아이콘 위치는 영속적으로 저장되지 않습니다. 페이지 로드 시 항상{' '}
              <code>DESKTOP_ICONS_META</code> 배열 순서대로 column-first 배치됩니다.
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* 6. 리사이즈 리플로우 */}
      <VStack gap={4}>
        <SectionTitle>리사이즈 리플로우</SectionTitle>
        <Prose>
          <p>
            브라우저 창 크기가 변경되면 전체 아이콘을 column-first 순서로 재배치합니다.{' '}
            <code>window.resize</code> 이벤트를 <code>requestAnimationFrame</code>으로 처리합니다.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>전체 리플로우</strong>: 창이 줄어들 때뿐만 아니라 커질 때도 전체 아이콘을
              column-first 순서로 재배치합니다. 드래그가 없으므로 보존할 커스텀 배치가 없습니다.
            </li>
            <li>
              <strong>행 수 계산</strong>: <code>maxRows = floor((height - PAD_TOP) / CELL_H)</code>{' '}
              (뷰포트 기준). <code>col = floor(i / maxRows)</code>, <code>row = i % maxRows</code>.
            </li>
            <li>
              <strong>CSS transition</strong>: 리플로우 시 아이콘이 부드럽게 이동합니다 (
              <code>left/top 200ms ease-out</code>).
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* 7. 뷰포트 수용량 */}
      <VStack gap={4}>
        <SectionTitle>뷰포트별 수용량</SectionTitle>
        <Prose>
          <p>아래는 주요 해상도에서의 최대 열/행 수와 수용 가능한 아이콘 개수입니다.</p>
        </Prose>
        <div className="overflow-x-auto">
          <table className="w-full text-[length:var(--font-size-12)]">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                  해상도
                </th>
                <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                  최대 열
                </th>
                <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                  최대 행
                </th>
                <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                  최대 아이콘
                </th>
                <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                  8개 배치
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['1024 × 768', '7', '5', '35', '2열 (5+3)'],
                  ['1280 × 800', '9', '6', '54', '2열 (6+2)'],
                  ['1440 × 900', '10', '6', '60', '2열 (6+2)'],
                  ['1920 × 1080', '14', '8', '112', '1열 (8)'],
                  ['2560 × 1440', '19', '11', '209', '1열 (8)'],
                ] as const
              ).map(([res, cols, rows, max, layout], i) => (
                <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-mono text-[var(--color-text-default)]">{res}</td>
                  <td className="py-2.5 pr-4 font-mono text-[var(--color-action-primary)]">
                    {cols}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-[var(--color-action-primary)]">
                    {rows}
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--color-text-default)]">{max}</td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">{layout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* 8. 앱 런처 (Launchpad) 반응형 그리드 */}
      <VStack gap={4}>
        <SectionTitle>앱 런처 (Launchpad) 반응형 그리드</SectionTitle>
        <Prose>
          <p>
            앱 런처(Launchpad)는 CSS Grid 기반의 반응형 레이아웃을 사용합니다. 뷰포트 너비에 따라 열
            수가 동적으로 조정되며, 콘텐츠가 넘칠 때 세로 스크롤이 가능합니다.
          </p>
        </Prose>

        <div className="overflow-x-auto">
          <table className="w-full text-[length:var(--font-size-12)]">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                  상수
                </th>
                <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                  값
                </th>
                <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                  설명
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['CELL_W', '100px', '앱 버튼 너비 (w-[100px])'],
                  ['GAP', '24px', '그리드 갭 (gap-6)'],
                  ['PAD_X', '40px', '좌우 패딩 (p-10)'],
                  ['MIN_COLS', '4', '최소 열 수'],
                  ['MAX_COLS', '7', '최대 열 수'],
                ] as const
              ).map(([name, value, desc], i) => (
                <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-mono text-[var(--color-text-default)]">{name}</td>
                  <td className="py-2.5 pr-4 font-mono text-[var(--color-action-primary)]">
                    {value}
                  </td>
                  <td className="py-2.5 text-[var(--color-text-muted)]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Prose>
          <p>
            <strong>열 수 계산 공식:</strong>
          </p>
        </Prose>
        <pre className="text-[length:var(--font-size-11)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] text-[var(--color-text-muted)] overflow-x-auto">
          {`available = window.innerWidth - PAD_X × 2
maxFit = floor((available + GAP) / (CELL_W + GAP))
cols = clamp(maxFit, MIN_COLS, MAX_COLS)`}
        </pre>

        <div className="overflow-x-auto">
          <table className="w-full text-[length:var(--font-size-12)]">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                  뷰포트 너비
                </th>
                <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                  가용 너비
                </th>
                <th className="text-left py-2.5 pr-4 font-medium text-[var(--color-text-subtle)]">
                  적용 열 수
                </th>
                <th className="text-left py-2.5 font-medium text-[var(--color-text-subtle)]">
                  비고
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['1440px+', '1360px', '7', 'MAX'],
                  ['1024px', '944px', '7', ''],
                  ['924px', '844px', '6', ''],
                  ['800px', '720px', '5', ''],
                  ['600px', '520px', '4', 'MIN'],
                  ['500px 이하', '420px', '4', 'MIN, 가로 스크롤'],
                ] as const
              ).map(([vp, avail, cols, note], i) => (
                <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2.5 pr-4 font-mono text-[var(--color-text-default)]">{vp}</td>
                  <td className="py-2.5 pr-4 font-mono text-[var(--color-text-muted)]">{avail}</td>
                  <td className="py-2.5 pr-4 font-mono text-[var(--color-action-primary)]">
                    {cols}
                  </td>
                  <td className="py-2.5 text-[var(--color-text-subtle)]">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Prose>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>반응형 열 수</strong>: <code>requestAnimationFrame</code> 기반 resize 리스너로
              실시간 열 수 조정. <code>gridTemplateColumns: repeat(cols, 100px)</code>
              인라인 스타일로 적용.
            </li>
            <li>
              <strong>레이아웃 분리</strong>: 검색바는 상단 고정(<code>shrink-0</code>), 앱 그리드
              영역만 독립적으로 스크롤. <code>max-h-[calc(100vh-80px)]</code>로 뷰포트 높이 제한.
            </li>
            <li>
              <strong>오버레이 스크롤바</strong>: <code>OverlayScrollbarsComponent</code>를 사용하여
              콘텐츠 위에 겹쳐 표시. 스크롤 시에만 나타나고 800ms 후 자동 숨김.
            </li>
            <li>
              <strong>상단 정렬</strong>: 앱 런처 전체가 화면 상단에 정렬됩니다 (
              <code>items-start</code>).
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Summary Info Box */}
      <div className="p-4 bg-[var(--color-state-info-bg)] rounded-[var(--radius-md)]">
        <div className="text-[length:var(--font-size-12)] text-[var(--color-state-info)]">
          <strong>요약:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>절대 좌표 기반 고정 그리드 — 드래그 앤 드롭 미지원</li>
            <li>
              논리 좌표(col, row) → 픽셀 좌표 변환: <code>PAD_X + col × CELL_W</code>,{' '}
              <code>PAD_TOP + row × CELL_H</code>
            </li>
            <li>배치: column-first (세로 우선, macOS 컨벤션) — 항상 자동 배치</li>
            <li>앱 추가/제거 시 자동 compact (빈 셀 없음)</li>
            <li>리사이즈 리플로우: 전체 아이콘 column-first 재배치 + CSS transition</li>
            <li>상태 영속성 없음 — 페이지 로드 시 항상 초기 배치</li>
            <li>앱 런처: 반응형 CSS Grid (4~7열) + 검색바 고정 + 오버레이 스크롤바</li>
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
      description="Absolute-positioned fixed grid system for desktop icons with column-first auto-layout and responsive reflow."
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
                      ['Flow', 'column-first', 'Top→bottom, then left→right (macOS style)'],
                      ['Positioning', 'absolute + fixed grid', 'gridToPixel(col, row) → left/top'],
                      [
                        'Drag & drop',
                        'Not supported',
                        'Icons are auto-placed, no manual reordering',
                      ],
                      [
                        'Resize reflow',
                        'requestAnimationFrame',
                        'All icons re-laid column-first on any resize + CSS transition',
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
              maxRows = floor((height - PAD_TOP) / CELL_H). Resize reflow re-lays all icons
              column-first with CSS transition animation.
            </p>
          </VStack>

          {/* App Launcher (Launchpad) Grid */}
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              App Launcher (Launchpad) grid
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
                      ['CELL_W', '100px', 'App button width'],
                      ['GAP', '24px', 'Grid gap (gap-6)'],
                      ['PAD_X', '40px', 'Horizontal padding (p-10)'],
                      ['MIN_COLS', '4', 'Minimum columns'],
                      ['MAX_COLS', '7', 'Maximum columns'],
                      ['Grid type', 'CSS Grid', 'gridTemplateColumns: repeat(cols, 100px)'],
                      [
                        'Resize',
                        'requestAnimationFrame',
                        'Dynamic column count on viewport resize',
                      ],
                      ['Scroll', 'overlay scrollbar', 'OverlayScrollbarsComponent, autoHide: move'],
                      ['Search bar', 'fixed (shrink-0)', 'Pinned above scrollable grid area'],
                      ['Alignment', 'top-center', 'items-start justify-center'],
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
};

/* Logical → Pixel conversion */
function gridToPixel(col: number, row: number) {
  return {
    x: GRID.PAD_X + col * GRID.CELL_W,
    y: GRID.PAD_TOP + row * GRID.CELL_H,
  };
}

/* Initial layout — always column-first */
function getInitialIconLayout(): DesktopIconItem[] {
  const maxRows = Math.max(1, Math.floor(
    (window.innerHeight - GRID.PAD_TOP) / GRID.CELL_H
  ));
  return DESKTOP_ICONS_META.map((item, i) => ({
    ...item,
    col: Math.floor(i / maxRows),
    row: i % maxRows,
  }));
}

/* Desktop Icon — absolute positioned with transition */
<button
  className="absolute flex flex-col items-center gap-1 w-20 cursor-pointer"
  style={{
    left: pos.x,
    top: pos.y,
    transition: 'left 200ms ease-out, top 200ms ease-out',
  }}
>
  <img className="w-16 h-16 object-cover" />
  <span className="text-label-md text-white">{label}</span>
</button>

/* Resize reflow — re-lay all icons column-first */
useEffect(() => {
  let rafId = 0;
  const handleResize = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const maxRows = Math.max(1, Math.floor(
        (window.innerHeight - GRID.PAD_TOP) / GRID.CELL_H));
      setIcons(prev => prev.map((icon, i) => ({
        ...icon,
        col: Math.floor(i / maxRows),
        row: i % maxRows,
      })));
    });
  };
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(rafId);
  };
}, []);

/* ----------------------------------------
   App Launcher (Launchpad) — Responsive CSS Grid
   ---------------------------------------- */

const LAUNCHPAD = {
  CELL_W: 100,   // app button width
  GAP: 24,       // gap-6
  PAD_X: 40,     // horizontal padding (p-10)
  MIN_COLS: 4,   // minimum columns
  MAX_COLS: 7,   // maximum columns
};

/* Dynamic column count */
const available = window.innerWidth - LAUNCHPAD.PAD_X * 2;
const maxFit = Math.floor((available + LAUNCHPAD.GAP) / (LAUNCHPAD.CELL_W + LAUNCHPAD.GAP));
const cols = Math.max(LAUNCHPAD.MIN_COLS, Math.min(LAUNCHPAD.MAX_COLS, maxFit));

/* Grid with dynamic columns */
<div className="grid gap-6"
  style={{ gridTemplateColumns: \`repeat(\${cols}, 100px)\` }} />

/* Search bar fixed + grid scrollable */
<motion.div className="flex flex-col items-center max-h-[calc(100vh-80px)]">
  <div className="shrink-0">{/* Search bar */}</div>
  <OverlayScrollbarsComponent className="min-h-0"
    options={{ scrollbars: { autoHide: 'move', autoHideDelay: 800 } }}>
    {/* App grid */}
  </OverlayScrollbarsComponent>
</motion.div>`}
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
