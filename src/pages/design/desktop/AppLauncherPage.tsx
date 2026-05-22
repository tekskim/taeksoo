import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { VStack } from '@/design-system';

import imgCompute from '@/assets/appIcon/compute.webp';
import imgStorage from '@/assets/appIcon/storage.webp';
import imgStorageAdmin from '@/assets/appIcon/storageadmin.webp';
import imgContainer from '@/assets/appIcon/container.webp';
import imgAgent from '@/assets/appIcon/agentops.webp';
import imgAi from '@/assets/appIcon/aiplatform.png';
import imgIam from '@/assets/appIcon/iam.webp';
import imgSettings from '@/assets/appIcon/settings.webp';
import imgCloud from '@/assets/appIcon/cloudbuilder.webp';

const mockApps = [
  { id: 'compute', name: 'Compute', icon: imgCompute },
  { id: 'storage', name: 'Storage\nSystem admin', icon: imgStorageAdmin },
  { id: 'storage-member', name: 'Storage\nMember', icon: imgStorage },
  { id: 'container', name: 'Container', icon: imgContainer },
  { id: 'agent', name: 'Agent Ops', icon: imgAgent },
  { id: 'ai-platform', name: 'AI Platform', icon: imgAi },
  { id: 'iam', name: 'IAM', icon: imgIam },
  { id: 'settings', name: 'Settings', icon: imgSettings },
  { id: 'cloud-builder', name: 'Cloud Builder', icon: imgCloud },
];

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

function AppLauncherExamples() {
  return (
    <VStack gap={10}>
      {/* Trigger */}
      <VStack gap={4}>
        <SectionTitle>Trigger — Top Bar Icon</SectionTitle>
        <Prose>
          <p>
            상단 바(Desktop Top GNB) 로고 우측에 위치한 <code>IconGridDots</code> 아이콘을 클릭하여
            Launchpad를 엽니다.
          </p>
        </Prose>
        <ComponentPreview title="Top Bar Launchpad Icon">
          <div className="flex items-center gap-5 bg-[var(--color-surface-default)] px-4 py-3 rounded-lg border border-[var(--color-border-default)]">
            <div className="h-5 w-24 bg-[var(--color-surface-muted)] rounded" />
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--color-surface-muted)] border border-[var(--color-border-default)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
                className="text-[var(--color-text-muted)]"
              >
                <circle cx="5" cy="5" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="19" cy="5" r="1" />
                <circle cx="5" cy="12" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="19" r="1" />
                <circle cx="12" cy="19" r="1" />
                <circle cx="19" cy="19" r="1" />
              </svg>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-[var(--color-surface-muted)] rounded-lg" />
              <div className="w-8 h-8 bg-[var(--color-surface-muted)] rounded-lg" />
            </div>
          </div>
        </ComponentPreview>
      </VStack>

      {/* Grid */}
      <VStack gap={4}>
        <SectionTitle>App Grid with Search</SectionTitle>
        <Prose>
          <p>
            Launchpad가 열리면 상단에 검색바가 표시되고, 그 아래에 <code>appConfigs</code>에 등록된
            모든 앱이 7열 그리드로 표시됩니다. 검색어를 입력하면 앱 이름으로 실시간 필터링됩니다.
          </p>
        </Prose>
        <ComponentPreview title="Launchpad — Search + Grid (Mock)">
          <div className="bg-gray-900/95 rounded-2xl p-10 flex flex-col items-center gap-8">
            <div className="relative w-[320px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search apps..."
                readOnly
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/10 border border-white/15 text-white text-body-md placeholder:text-white/40 outline-none cursor-default"
              />
            </div>
            <div className="grid grid-cols-5 gap-6">
              {mockApps.map((app) => (
                <button
                  key={app.id}
                  className="flex flex-col items-center gap-2.5 w-[100px] cursor-pointer bg-transparent border-none p-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <img src={app.icon} alt={app.name} className="w-16 h-16 object-cover" />
                  <span className="text-label-md text-white text-center leading-tight whitespace-pre-line">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ComponentPreview>
      </VStack>
    </VStack>
  );
}

function AppLauncherGuidelines() {
  return (
    <VStack gap={10}>
      {/* Policy */}
      <VStack gap={4}>
        <SectionTitle>Policy</SectionTitle>
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
                상단바(Top GNB)에 <strong>런처 진입점</strong>(아이콘)을 제공한다.
              </Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>
                런처는 <strong>전체 앱 카탈로그</strong>에 접근할 수 있어야 하며, macOS{' '}
                <strong>Launchpad</strong>와 유사한 <strong>풀스크린 오버레이 그리드</strong> 형태를
                취한다.
              </Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>
                상단에 <strong>검색바</strong>를 제공하여 앱 이름으로 실시간 필터링할 수 있다. 패널
                오픈 시 검색바에 <strong>자동 포커스</strong>된다.
              </Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td>
                앱을 선택하면 해당 앱을 <strong>실행</strong>하거나, 이미 열려 있으면{' '}
                <strong>포커스 전환</strong>한다(기존 Desktop 창 관리 규칙과 정합).
              </Td>
            </tr>
            <tr>
              <Td>5</Td>
              <Td>
                검색 결과가 없으면 <strong>&quot;No apps found&quot;</strong> 메시지를 표시한다.
              </Td>
            </tr>
            <tr>
              <Td>6</Td>
              <Td>
                <strong>반응형 그리드:</strong> 뷰포트 너비에 따라 열 수가 4~7열로 동적 조정된다.
                콘텐츠가 넘칠 경우 오버레이 스크롤바로 세로 스크롤을 제공한다. 검색바는 항상 상단에
                고정된다.
              </Td>
            </tr>
            <tr>
              <Td>7</Td>
              <Td>
                <strong>역할별 필터:</strong> 노출되는 앱 목록은{' '}
                <strong>도메인 사용자(관리자)·시스템 관리자</strong>에 따라 달라질 수 있다.
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
              <Td>Backdrop overlay</Td>
              <Td>
                <code>bg-black/50</code> + <code>backdrop-blur-xl</code> 풀스크린 오버레이. 클릭 시
                패널 닫힘.
              </Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>Search bar</Td>
              <Td>
                너비 320px, 높이 36px (<code>h-9</code>). <code>IconSearch</code> (16px) 좌측 배치.{' '}
                <code>bg-white/10</code> 배경, <code>border-white/15</code>. 포커스 시{' '}
                <code>bg-white/15</code> + <code>border-white/25</code>. 오픈 시 자동 포커스.
              </Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>App grid</Td>
              <Td>
                반응형 CSS Grid (4~7열). 뷰포트 너비에 따라 동적 열 수 조정. <code>gap-6</code>{' '}
                (24px), 수평 중앙 정렬.
              </Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td>App item</Td>
              <Td>
                아이콘(64×64) + 앱 이름. 너비 100px, 호버 시 <code>bg-white/10</code>
              </Td>
            </tr>
            <tr>
              <Td>5</Td>
              <Td>Empty state</Td>
              <Td>
                검색 결과 없을 시 &quot;No apps found&quot; 메시지. <code>text-white/50</code>,
                <code>py-10</code>.
              </Td>
            </tr>
            <tr>
              <Td>6</Td>
              <Td>App name</Td>
              <Td>
                <code>text-label-md</code>, 흰색, 중앙정렬. <code>" - "</code> 포함 시 줄바꿈 (
                <code>whitespace-pre-line</code>). 최대 2줄.
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
              <Th className="w-[180px]">트리거</Th>
              <Th>동작</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>아이콘 클릭 (Top Bar)</Td>
              <Td>Launchpad 토글 (열기/닫기)</Td>
            </tr>
            <tr>
              <Td>검색 입력</Td>
              <Td>앱 이름으로 실시간 필터링 (대소문자 무시). 검색어가 비면 전체 앱 표시.</Td>
            </tr>
            <tr>
              <Td>앱 아이콘 클릭</Td>
              <Td>
                <code>focusApp(appId)</code> 호출 후 패널 닫기. 기존 창이 있으면 포커스, 없으면 새
                창 생성.
              </Td>
            </tr>
            <tr>
              <Td>Backdrop 클릭</Td>
              <Td>패널 닫기</Td>
            </tr>
            <tr>
              <Td>ESC 키</Td>
              <Td>패널 닫기</Td>
            </tr>
            <tr>
              <Td>브라우저 리사이즈</Td>
              <Td>
                <code>requestAnimationFrame</code> 기반으로 열 수 실시간 재계산.{' '}
                <code>cols = clamp(maxFit, 4, 7)</code>.
              </Td>
            </tr>
            <tr>
              <Td>패널 닫힘</Td>
              <Td>
                검색어 초기화 (<code>setSearchQuery(&apos;&apos;)</code>)
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* Animation */}
      <VStack gap={4}>
        <SectionTitle>Animation</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Backdrop</Td>
              <Td>
                fade in/out, <code>duration: 0.25s</code>, <code>ease: easeOut</code>
              </Td>
            </tr>
            <tr>
              <Td>Grid container</Td>
              <Td>
                scale 0.92 → 1 + fade, <code>duration: 0.25s</code>, <code>ease: easeOut</code>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* Design Token */}
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
              <Td>Trigger icon</Td>
              <Td>
                <code>IconGridDots</code> (Tabler), 18px, stroke 1.5
              </Td>
            </tr>
            <tr>
              <Td>Trigger icon color</Td>
              <Td>
                <code>var(--desktop-text-muted)</code> → hover: <code>var(--desktop-text)</code>
              </Td>
            </tr>
            <tr>
              <Td>Search bar width</Td>
              <Td>320px</Td>
            </tr>
            <tr>
              <Td>Search bar height</Td>
              <Td>
                36px (<code>h-9</code>)
              </Td>
            </tr>
            <tr>
              <Td>Search bar position</Td>
              <Td>
                상단 고정 (<code>shrink-0</code>). 하단 앱 그리드만 독립 스크롤.
              </Td>
            </tr>
            <tr>
              <Td>Search bar background</Td>
              <Td>
                <code>bg-white/10</code> → focus: <code>bg-white/15</code>
              </Td>
            </tr>
            <tr>
              <Td>Search icon</Td>
              <Td>
                <code>IconSearch</code>, 16px, stroke 1.5, <code>text-white/50</code>
              </Td>
            </tr>
            <tr>
              <Td>Backdrop background</Td>
              <Td>
                <code>bg-black/70</code> + <code>backdrop-blur-xl</code>
              </Td>
            </tr>
            <tr>
              <Td>Backdrop z-index</Td>
              <Td>6000</Td>
            </tr>
            <tr>
              <Td>Panel z-index</Td>
              <Td>6001</Td>
            </tr>
            <tr>
              <Td>Panel alignment</Td>
              <Td>
                상단 정렬 (<code>items-start justify-center</code>)
              </Td>
            </tr>
            <tr>
              <Td>Panel max height</Td>
              <Td>
                <code>max-h-[calc(100vh-80px)]</code> — 상하 40px 여유
              </Td>
            </tr>
            <tr>
              <Td>Grid columns</Td>
              <Td>
                4~7열 (반응형). <code>gridTemplateColumns: repeat(cols, 100px)</code>
              </Td>
            </tr>
            <tr>
              <Td>Grid min/max cols</Td>
              <Td>MIN_COLS: 4, MAX_COLS: 7</Td>
            </tr>
            <tr>
              <Td>Grid gap</Td>
              <Td>
                24px (<code>gap-6</code>)
              </Td>
            </tr>
            <tr>
              <Td>Grid padding</Td>
              <Td>
                40px (<code>pt-10 px-10</code>)
              </Td>
            </tr>
            <tr>
              <Td>Grid resize</Td>
              <Td>
                <code>requestAnimationFrame</code> 기반. 뷰포트 너비로 열 수 실시간 계산.
              </Td>
            </tr>
            <tr>
              <Td>Scrollbar</Td>
              <Td>
                <code>OverlayScrollbarsComponent</code>. autoHide: move, delay: 800ms.
              </Td>
            </tr>
            <tr>
              <Td>App item width</Td>
              <Td>100px</Td>
            </tr>
            <tr>
              <Td>App icon size</Td>
              <Td>64×64px</Td>
            </tr>
            <tr>
              <Td>App item hover</Td>
              <Td>
                <code>bg-white/10</code>, <code>rounded-xl</code>
              </Td>
            </tr>
            <tr>
              <Td>App name style</Td>
              <Td>
                <code>text-label-md</code>, white, center, <code>whitespace-pre-line</code>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>
    </VStack>
  );
}

export function AppLauncherPage() {
  return (
    <ComponentPageTemplate
      title="App Launcher"
      description="macOS Launchpad 스타일의 전체 앱 런처. 상단 바 로고 우측 아이콘을 클릭하면 풀스크린 오버레이에 모든 앱을 그리드로 표시합니다."
      category="Desktop"
      status="desktop-only"
      tags={['desktop', 'launcher', 'launchpad', 'app-grid', 'overlay']}
      whenToUse={[
        '활성화된 앱 창이 바탕화면 아이콘을 가릴 때',
        '한 번의 클릭으로 모든 앱에 접근해야 할 때',
        '창을 최소화하지 않고 다른 앱을 실행하고 싶을 때',
      ]}
      whenNotToUse={[
        '바탕화면이 비어있어 아이콘이 보일 때 (데스크탑 아이콘 직접 클릭 가능)',
        '특정 관리자 앱만 열고 싶을 때 (Admin Center 사용)',
      ]}
      examples={<AppLauncherExamples />}
      guidelines={<AppLauncherGuidelines />}
      relatedLinks={[
        {
          label: 'Desktop Top GNB',
          path: '/design/desktop/top-gnb',
          description: 'Launchpad 트리거가 위치하는 상단 바',
        },
        {
          label: 'Desktop Icon Grid',
          path: '/design/patterns/desktop-grid',
          description: '바탕화면 아이콘 그리드 패턴',
        },
        {
          label: 'Window Control',
          path: '/design/components/window-control',
          description: '앱 윈도우 제어 버튼',
        },
      ]}
    />
  );
}
