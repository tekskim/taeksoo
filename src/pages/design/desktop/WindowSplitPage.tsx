import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { VStack, WindowControls } from '@/design-system';

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

function WindowSplitExamples() {
  return (
    <VStack gap={10}>
      {/* Snap Preview */}
      <VStack gap={4}>
        <SectionTitle>Snap Preview Overlay</SectionTitle>
        <Prose>
          <p>
            창을 화면 좌/우 가장자리로 드래그하면 글래스 프레임 스타일의 프리뷰 오버레이가
            표시됩니다.
          </p>
        </Prose>
        <ComponentPreview title="Left / Right Snap Preview">
          <div className="flex gap-4">
            <div className="relative w-60 h-40 bg-gray-900 rounded-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-1/2 h-full p-1">
                <div
                  className="w-full h-full rounded-[10px]"
                  style={{
                    boxShadow: 'inset 0 0 0 2.5px rgba(255,255,255,0.7), 0 0 20px rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(20px)',
                  }}
                />
              </div>
              <span className="absolute bottom-2 left-2 text-[10px] text-white/60">Left snap</span>
            </div>
            <div className="relative w-60 h-40 bg-gray-900 rounded-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full p-1">
                <div
                  className="w-full h-full rounded-[10px]"
                  style={{
                    boxShadow: 'inset 0 0 0 2.5px rgba(255,255,255,0.7), 0 0 20px rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(20px)',
                  }}
                />
              </div>
              <span className="absolute bottom-2 right-2 text-[10px] text-white/60">
                Right snap
              </span>
            </div>
          </div>
        </ComponentPreview>
      </VStack>

      {/* Snapped State */}
      <VStack gap={4}>
        <SectionTitle>Snapped State</SectionTitle>
        <Prose>
          <p>
            창이 스냅되면 화면의 정확히 절반을 차지하며, <code>borderRadius: 0</code>으로 변경되어
            가장자리에 밀착됩니다.
          </p>
        </Prose>
        <ComponentPreview title="Split Screen (Left + Right)">
          <div className="relative w-80 h-48 bg-gray-900 rounded-lg overflow-hidden flex">
            <div className="w-1/2 h-full bg-blue-500/20 border-r border-white/10 flex items-center justify-center">
              <span className="text-xs text-white/70">App A</span>
            </div>
            <div className="w-1/2 h-full bg-green-500/20 flex items-center justify-center">
              <span className="text-xs text-white/70">App B</span>
            </div>
          </div>
        </ComponentPreview>
      </VStack>

      {/* Drag Visual Effects */}
      <VStack gap={4}>
        <SectionTitle>Drag Visual Effects</SectionTitle>
        <Prose>
          <p>
            창을 드래그하는 동안 투명도와 그림자 효과가 적용되어 이동 중임을 시각적으로 표현합니다.
          </p>
        </Prose>
        <ComponentPreview title="Drag Opacity + Shadow">
          <div className="flex gap-6 items-end">
            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-24 rounded-lg bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex items-center justify-center">
                <span className="text-xs text-[var(--color-text-muted)]">Normal</span>
              </div>
              <span className="text-[10px] text-[var(--color-text-subtle)]">opacity: 1.0</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-32 h-24 rounded-lg bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex items-center justify-center"
                style={{
                  opacity: 0.85,
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))',
                }}
              >
                <span className="text-xs text-[var(--color-text-muted)]">Dragging</span>
              </div>
              <span className="text-[10px] text-[var(--color-text-subtle)]">opacity: 0.85</span>
            </div>
          </div>
        </ComponentPreview>
      </VStack>

      {/* Split Button */}
      <VStack gap={4}>
        <SectionTitle>Split Button (Window Control)</SectionTitle>
        <Prose>
          <p>
            TabBar의 Window Controls에 Split 버튼이 포함되어 있으며, 호버 시 "Left Half" / "Right
            Half" 드롭다운 메뉴가 표시됩니다.
          </p>
        </Prose>
        <ComponentPreview title="Split Button Dropdown">
          <div className="flex items-center justify-between w-full max-w-[400px] h-10 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)]">
            <span className="text-label-md text-[var(--color-text-default)]">
              Application Title
            </span>
            <WindowControls
              showSplit
              onSnapLeft={() => alert('Snap Left')}
              onSnapRight={() => alert('Snap Right')}
            />
          </div>
        </ComponentPreview>
      </VStack>
    </VStack>
  );
}

function WindowSplitGuidelines() {
  return (
    <VStack gap={10}>
      {/* Policy */}
      <VStack gap={4}>
        <SectionTitle>Policy</SectionTitle>
        <Prose>
          <p>Window Split은 세 가지 방법으로 실행할 수 있다.</p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[40px]">#</Th>
              <Th className="w-[200px]">방법</Th>
              <Th>정책</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>
                <strong>드래그 스냅</strong>
              </Td>
              <Td>
                <ul className="list-disc pl-4 space-y-1.5">
                  <li>
                    앱 윈도우를 화면 <strong>좌/우 가장자리</strong>로 드래그하면 분할 영역이
                    잡히고, 윈도우 사이즈가 해당 방향의 화면 절반으로 <strong>자동 변경</strong>
                    된다.
                  </li>
                  <li>
                    스냅 감지 영역은 화면 가장자리에서 <strong>8px 이내</strong>(
                    <code>SNAP_EDGE_THRESHOLD</code>)이다.
                  </li>
                  <li>
                    스냅 전에 macOS 스타일의 <strong>글래스 프레임 프리뷰</strong>를 표시하여 결과를
                    미리 보여준다.
                  </li>
                  <li>
                    스냅된 창을 다시 드래그하면 <strong>이전 크기/위치로 복원</strong>된다 (
                    <code>preSnapState</code>).
                  </li>
                  <li>
                    단순 클릭(이동 거리 4px 미만)으로는 스냅이 해제되지 않는다 (
                    <code>DRAG_THRESHOLD</code>).
                  </li>
                </ul>
              </Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>
                <strong>분할 버튼</strong>
              </Td>
              <Td>
                Window Control에 <strong>Split 버튼</strong>을 추가하여, 호버 시 드롭다운으로 "Left
                Half" / "Right Half"를 선택할 수 있다.
              </Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>
                <strong>단축키</strong>
              </Td>
              <Td>
                키보드 단축키로 빠르게 스냅할 수 있다. 좌측 스냅: <kbd>⌃ + ←</kbd>, 우측 스냅:{' '}
                <kbd>⌃ + →</kbd>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SectionTitle>공통 정책</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[40px]">#</Th>
              <Th>정책</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>
                드래그 중 창에 <strong>투명도(0.85)</strong>와 <strong>drop-shadow</strong> 효과를
                적용하여 이동 상태를 시각적으로 표현한다.
              </Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>세 가지 방법(드래그, 버튼, 단축키) 모두 동일한 스냅 결과를 보장한다.</Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>
                스냅 해제(드래그·리사이즈) 시 항상 <strong>이전 크기/위치</strong>로 복원한다.
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* Anatomy */}
      <VStack gap={4}>
        <SectionTitle>Anatomy</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[40px]">#</Th>
              <Th className="w-[180px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>Snap edge zone</Td>
              <Td>화면 좌/우 가장자리 8px 영역. 마우스가 진입하면 프리뷰 표시.</Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>Snap preview overlay</Td>
              <Td>
                글래스 프레임 스타일 프리뷰. 화면 절반 크기, 6px 인셋 padding, 10px border-radius.
              </Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>Snapped window</Td>
              <Td>
                화면 정확히 절반, <code>borderRadius: 0</code>, Top Bar 아래부터 화면 하단까지.
              </Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td>Split button</Td>
              <Td>
                Window Controls 내 <code>Scaling</code> 아이콘 (lucide-react). 호버 시 드롭다운 메뉴
                표시.
              </Td>
            </tr>
            <tr>
              <Td>5</Td>
              <Td>Split dropdown</Td>
              <Td>
                "Left Half" / "Right Half" 메뉴. Portal로 렌더링하여 부모 overflow 영향 없음. 앱 창
                우측에 정렬.
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* Interaction */}
      <VStack gap={4}>
        <SectionTitle>Interaction</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[220px]">트리거</Th>
              <Th>동작</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>창을 좌측 가장자리로 드래그</Td>
              <Td>좌측 절반 프리뷰 표시 → 마우스 놓으면 좌측 절반으로 스냅</Td>
            </tr>
            <tr>
              <Td>창을 우측 가장자리로 드래그</Td>
              <Td>우측 절반 프리뷰 표시 → 마우스 놓으면 우측 절반으로 스냅</Td>
            </tr>
            <tr>
              <Td>스냅된 창을 드래그 (4px 이상)</Td>
              <Td>스냅 해제, 이전 크기/위치로 복원 후 자유 이동</Td>
            </tr>
            <tr>
              <Td>Split 버튼 호버</Td>
              <Td>드롭다운 메뉴 표시 ("Left Half" / "Right Half")</Td>
            </tr>
            <tr>
              <Td>드롭다운 메뉴 클릭</Td>
              <Td>해당 방향으로 즉시 스냅</Td>
            </tr>
            <tr>
              <Td>스냅 상태에서 리사이즈 시작</Td>
              <Td>스냅 해제, 이전 크기로 복원 후 리사이즈 진행</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* Design Tokens */}
      <VStack gap={4}>
        <SectionTitle>Design Tokens</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[220px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Snap edge threshold</Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>Drag threshold</Td>
              <Td>4px (스냅 해제 방지용)</Td>
            </tr>
            <tr>
              <Td>Preview z-index</Td>
              <Td>9999</Td>
            </tr>
            <tr>
              <Td>Preview border-radius</Td>
              <Td>10px</Td>
            </tr>
            <tr>
              <Td>Preview box-shadow</Td>
              <Td>
                <code>inset 0 0 0 2.5px rgba(255,255,255,0.7), 0 0 20px rgba(0,0,0,0.08)</code>
              </Td>
            </tr>
            <tr>
              <Td>Preview background</Td>
              <Td>
                <code>rgba(255,255,255,0.15)</code> + <code>backdrop-filter: blur(20px)</code>
              </Td>
            </tr>
            <tr>
              <Td>Preview inset</Td>
              <Td>top/bottom: 6px, left/right: 6px (2px center gap)</Td>
            </tr>
            <tr>
              <Td>Preview transition</Td>
              <Td>
                <code>all 200ms ease-out</code>
              </Td>
            </tr>
            <tr>
              <Td>Snapped window position</Td>
              <Td>
                좌측: <code>x: 0</code>, 우측: <code>x: 50vw</code>, <code>y: TOP_BAR_HEIGHT</code>
              </Td>
            </tr>
            <tr>
              <Td>Snapped window size</Td>
              <Td>
                <code>width: 50vw</code>, <code>height: 100vh - TOP_BAR_HEIGHT</code>
              </Td>
            </tr>
            <tr>
              <Td>Snapped border-radius</Td>
              <Td>0 (가장자리 밀착)</Td>
            </tr>
            <tr>
              <Td>Drag opacity</Td>
              <Td>0.85</Td>
            </tr>
            <tr>
              <Td>Drag shadow</Td>
              <Td>
                <code>drop-shadow(0 12px 24px rgba(0,0,0,0.15))</code>
              </Td>
            </tr>
            <tr>
              <Td>Split button icon</Td>
              <Td>
                <code>Scaling</code> (lucide-react), Window Control 기본 사이즈
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>
    </VStack>
  );
}

export function WindowSplitPage() {
  return (
    <ComponentPageTemplate
      title="Window Split"
      description="macOS 스타일의 윈도우 스냅/스플릿 기능. 창을 화면 가장자리로 드래그하거나 Split 버튼을 사용하여 화면을 분할합니다."
      category="Desktop"
      status="desktop-only"
      tags={['desktop', 'window', 'split', 'snap', 'tiling', 'drag']}
      whenToUse={[
        '두 앱을 나란히 비교하며 작업할 때',
        '한쪽에 참고 자료를 열고 다른쪽에서 작업할 때',
        '빠르게 화면을 분할하여 멀티태스킹할 때',
      ]}
      whenNotToUse={[
        '단일 앱에 집중해야 할 때 (최대화 사용)',
        '자유로운 크기의 윈도우 배치가 필요할 때',
      ]}
      examples={<WindowSplitExamples />}
      guidelines={<WindowSplitGuidelines />}
      relatedLinks={[
        {
          label: 'Window Control',
          path: '/design/components/window-control',
          description: 'Split 버튼이 포함된 Window Controls',
        },
        {
          label: 'Desktop Top GNB',
          path: '/design/desktop/top-gnb',
          description: '창 관리와 관련된 상단 바',
        },
        {
          label: 'App Window',
          path: '/design/policies/app-window',
          description: '앱 윈도우 전체 정책',
        },
      ]}
    />
  );
}
