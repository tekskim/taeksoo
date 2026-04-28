import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { VStack } from '@/design-system';

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

function Td({
  children,
  className = '',
  ...rest
}: {
  children?: React.ReactNode;
  className?: string;
} & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`p-3 border-t border-r last:border-r-0 border-[var(--color-border-subtle)] align-top ${className}`}
      {...rest}
    >
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

function AppWindowAnimationGuidelines() {
  return (
    <VStack gap={10}>
      {/* Policy */}
      <VStack gap={4}>
        <SectionTitle>Policy</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[40px]">#</Th>
              <Th className="w-[180px]">구분</Th>
              <Th>정책</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>
                <strong>열기 · 복원 / 닫기 · 최소화</strong>
              </Td>
              <Td>짧은 등장·퇴장 모션 가능. 가독성 우선, 과한 연출 금지 방향 유지.</Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>
                <strong>이동 (드래그)</strong>
              </Td>
              <Td>
                드래그 중 <strong>이동 중</strong>임을 <strong>불투명도(opacity) 조절</strong>{' '}
                등으로 표시하고, <strong>드롭 시 즉시</strong> 기본 상태로 복귀한다.
              </Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>
                <strong>리사이즈</strong>
              </Td>
              <Td>조작 중 피드백(커서·가이드)을 명확하게 제공한다.</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 초기 크기 / 위치 */}
      <VStack gap={4}>
        <SectionTitle>초기 크기 / 위치</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>초기 크기</Td>
              <Td>
                <code>1440 × 800</code> px
              </Td>
            </tr>
            <tr>
              <Td>초기 위치 (X)</Td>
              <Td>
                <code>Math.max(0, (viewport.width − 1440) / 2)</code> — 수평 중앙
              </Td>
            </tr>
            <tr>
              <Td>초기 위치 (Y)</Td>
              <Td>
                <code>Math.max(52, (viewport.height − 800) / 2 + 26)</code> — TopBar 아래 수직 중앙
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 멀티 윈도우 Cascade */}
      <VStack gap={4}>
        <SectionTitle>멀티 윈도우 Cascade 배치</SectionTitle>
        <Prose>
          여러 앱 창을 동시에 실행할 때, 새 창은 이전 창과 겹치지 않도록 계단식(cascade)으로
          배치됩니다. macOS/Windows의 표준 윈도우 배치 전략과 동일합니다.
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Cascade 오프셋</Td>
              <Td>
                <code>30px</code> — 각 새 창이 이전 창 대비 X/Y 방향으로 30px씩 이동
              </Td>
            </tr>
            <tr>
              <Td>순환 주기</Td>
              <Td>
                <code>180px</code> (6개 창) — 오프셋이 180px에 도달하면 시작 위치로 순환
              </Td>
            </tr>
            <tr>
              <Td>기준 카운트</Td>
              <Td>현재 열려 있는(최소화 제외) 창 수 기반</Td>
            </tr>
            <tr>
              <Td>경계 보호</Td>
              <Td>
                화면 밖으로 나가지 않도록 <code>maxX = viewport.width − 400</code>,{' '}
                <code>maxY = viewport.height − 200</code> 으로 clamp
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 열기 / 닫기 */}
      <VStack gap={4}>
        <SectionTitle>열기 / 닫기 (Open / Close)</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>Open</Th>
              <Th>Close</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>라이브러리</Td>
              <Td colSpan={2}>framer-motion (AnimatePresence)</Td>
            </tr>
            <tr>
              <Td>initial / exit</Td>
              <Td>
                <code>scale: 0.95, opacity: 0</code>
              </Td>
              <Td>
                <code>scale: 0.95, opacity: 0</code>
              </Td>
            </tr>
            <tr>
              <Td>animate</Td>
              <Td colSpan={2}>
                <code>scale: 1, opacity: 1</code>
              </Td>
            </tr>
            <tr>
              <Td>duration</Td>
              <Td>200ms (ease-out)</Td>
              <Td>200ms (ease-out)</Td>
            </tr>
            <tr>
              <Td>transformOrigin</Td>
              <Td colSpan={2}>
                <code>center</code>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 최대화 / 복원 */}
      <VStack gap={4}>
        <SectionTitle>최대화 / 복원 (Maximize / Restore)</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>방식</Td>
              <Td>CSS transition (position + size)</Td>
            </tr>
            <tr>
              <Td>전환 속성</Td>
              <Td>
                <code>width, height, top, left, border-radius</code>
              </Td>
            </tr>
            <tr>
              <Td>duration</Td>
              <Td>250ms</Td>
            </tr>
            <tr>
              <Td>이징</Td>
              <Td>ease-out</Td>
            </tr>
            <tr>
              <Td>Maximize 값</Td>
              <Td>
                <code>100vw × 100vh, top: 0, left: 0, border-radius: 0</code>
              </Td>
            </tr>
            <tr>
              <Td>Restore 값</Td>
              <Td>이전 position/size로 복원</Td>
            </tr>
            <tr>
              <Td>비활성 조건</Td>
              <Td>드래그/리사이즈/최소화 중에는 transition: none</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 최소화 / 복원 */}
      <VStack gap={4}>
        <SectionTitle>최소화 / 복원 (Minimize / Restore)</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>Minimize</Th>
              <Th>Restore</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>라이브러리</Td>
              <Td colSpan={2}>framer-motion (animate)</Td>
            </tr>
            <tr>
              <Td>animate</Td>
              <Td>
                <code>scale: 0.3, opacity: 0</code>
              </Td>
              <Td>
                <code>scale: 1, opacity: 1</code>
              </Td>
            </tr>
            <tr>
              <Td>duration</Td>
              <Td>250ms (ease-in)</Td>
              <Td>200ms (ease-out)</Td>
            </tr>
            <tr>
              <Td>transformOrigin</Td>
              <Td>
                <code>top center</code>
              </Td>
              <Td>
                <code>center</code>
              </Td>
            </tr>
            <tr>
              <Td>pointerEvents</Td>
              <Td colSpan={2}>
                최소화 시 <code>pointerEvents: none</code> (클릭 차단)
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 드래그 이동 */}
      <VStack gap={4}>
        <SectionTitle>드래그 이동 (Drag)</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>드래그 중 opacity</Td>
              <Td>
                <code>0.85</code>
              </Td>
            </tr>
            <tr>
              <Td>드래그 중 shadow</Td>
              <Td>
                <code>drop-shadow(0 12px 24px rgba(0,0,0,0.15))</code>
              </Td>
            </tr>
            <tr>
              <Td>드롭 시 복귀</Td>
              <Td>
                즉시 <code>opacity: 1</code>, shadow 제거
              </Td>
            </tr>
            <tr>
              <Td>transition</Td>
              <Td>
                <code>opacity 200ms ease-out, filter 200ms ease-out</code>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* Dock 아이콘 */}
      <VStack gap={4}>
        <SectionTitle>Dock 아이콘 등장 / 퇴장</SectionTitle>
        <Prose>
          <p>
            앱 실행 또는 Pin 시 Dock에 아이콘이 추가되고, Quit + Unpin 시 제거된다. 등장/퇴장 모두
            framer-motion <code>AnimatePresence</code> + <code>Reorder.Item</code>으로 처리한다.
          </p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>Appear (등장)</Th>
              <Th>Disappear (퇴장)</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>라이브러리</Td>
              <Td colSpan={2}>framer-motion (AnimatePresence + Reorder.Item)</Td>
            </tr>
            <tr>
              <Td>initial / exit</Td>
              <Td>
                <code>opacity: 0, scale: 0.6</code>
              </Td>
              <Td>
                <code>opacity: 0, scale: 0.6</code>
              </Td>
            </tr>
            <tr>
              <Td>animate</Td>
              <Td colSpan={2}>
                <code>opacity: 1, scale: 1</code>
              </Td>
            </tr>
            <tr>
              <Td>transition (등장)</Td>
              <Td colSpan={2}>
                <code>type: spring, stiffness: 400, damping: 30</code>
              </Td>
            </tr>
            <tr>
              <Td>transition (퇴장)</Td>
              <Td colSpan={2}>
                <code>duration: 200ms</code> (spring 없이 즉각 사라짐)
              </Td>
            </tr>
            <tr>
              <Td>layout</Td>
              <Td colSpan={2}>
                <code>layout</code> prop 활성화 — 주변 아이콘이 스프링으로 밀림
              </Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>DockIcons 레이아웃 정책</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              framer-motion의 <code>layoutId</code> / <code>layout</code> 속성은{' '}
              <strong>드래그 중일 때만</strong> 활성화한다.
            </li>
            <li>
              TopBar 슬라이딩(translateY) 시 DockIcons가 별도로 반응하지 않도록,{' '}
              <code>isDragging</code> 조건으로 layout 애니메이션을 제한한다.
            </li>
            <li>DockIcons는 TopBar와 함께 하나의 단위로 이동한다.</li>
          </ul>
        </Prose>
      </VStack>

      {/* Design Tokens */}
      <VStack gap={4}>
        <SectionTitle>Design Tokens</SectionTitle>

        <SubSectionTitle>앱 창 애니메이션 토큰</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[220px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>초기 크기</Td>
              <Td>1440 × 800 px</Td>
            </tr>
            <tr>
              <Td>open / close</Td>
              <Td>
                scale 0.95→1, opacity 0→1, <strong>200ms</strong> ease-out (framer-motion)
              </Td>
            </tr>
            <tr>
              <Td>maximize / restore</Td>
              <Td>
                position + size, <strong>250ms</strong> ease-out (CSS transition)
              </Td>
            </tr>
            <tr>
              <Td>minimize</Td>
              <Td>
                scale 1→0.3, opacity 1→0, <strong>250ms</strong> ease-in, origin: top center
              </Td>
            </tr>
            <tr>
              <Td>restore (from minimize)</Td>
              <Td>
                scale 0.3→1, opacity 0→1, <strong>200ms</strong> ease-out, origin: center
              </Td>
            </tr>
            <tr>
              <Td>drag opacity</Td>
              <Td>0.85</Td>
            </tr>
            <tr>
              <Td>drag shadow</Td>
              <Td>
                <code>drop-shadow(0 12px 24px rgba(0,0,0,0.15))</code>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Dock 아이콘 애니메이션 토큰</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[220px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>appear (등장)</Td>
              <Td>
                scale 0.6→1, opacity 0→1, <strong>spring</strong> (stiffness: 400, damping: 30)
              </Td>
            </tr>
            <tr>
              <Td>disappear (퇴장)</Td>
              <Td>
                scale 1→0.6, opacity 1→0, <strong>200ms</strong>
              </Td>
            </tr>
            <tr>
              <Td>drag lift</Td>
              <Td>
                scale: 1.15, zIndex: 50, <strong>spring</strong> (stiffness: 400, damping: 25)
              </Td>
            </tr>
            <tr>
              <Td>layout reorder</Td>
              <Td>
                <code>layout</code> prop + <code>dragElastic: 0.1</code>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>
    </VStack>
  );
}

export function AppWindowAnimationPage() {
  return (
    <ComponentPageTemplate
      title="App Window Animation"
      description="앱 윈도우의 열기·닫기·최소화·최대화·드래그·리사이즈 등 모든 애니메이션과 시각 피드백 사양을 정의합니다."
      category="Desktop"
      status="desktop-only"
      tags={['desktop', 'window', 'animation', 'motion', 'drag', 'minimize', 'maximize']}
      guidelines={<AppWindowAnimationGuidelines />}
      relatedLinks={[
        {
          label: 'Desktop Top GNB',
          path: '/design/desktop/top-gnb',
          description: '상단 바 및 Dock 아이콘 관련',
        },
        {
          label: 'Window Control',
          path: '/design/components/window-control',
          description: '앱 윈도우 제어 버튼 (최소화/최대화/닫기)',
        },
        {
          label: 'Window Split',
          path: '/design/desktop/window-split',
          description: '윈도우 스냅/스플릿 기능',
        },
        {
          label: 'App Window',
          path: '/design/policies/app-window',
          description: '앱 윈도우 전체 정책',
        },
        {
          label: 'Transitions',
          path: '/design/foundation/transitions',
          description: '애니메이션 토큰, 이징, 인터랙티브 데모',
        },
      ]}
    />
  );
}
