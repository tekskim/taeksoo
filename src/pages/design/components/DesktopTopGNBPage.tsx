import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
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

function DesktopTopGNBGuidelines() {
  return (
    <VStack gap={10}>
      {/* 1. 설계 원칙 */}
      <VStack gap={4}>
        <SectionTitle>1. 설계 원칙</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>하단바 없이 상단바만 둔다.</strong> 웹에서 하단 고정 UI는 OS UI와 충돌
              가능성이 크며, 전역 컨트롤을 상단에 모아 학습·일관성을 확보한다.
            </li>
            <li>
              <strong>역할:</strong> 앱 실행·전환 허브이자, 시스템 상태·전역 액션의 집합이다.
            </li>
            <li>
              <strong>레이아웃 비침투 원칙:</strong> Top GNB는{' '}
              <strong>레이아웃을 밀지 않는다.</strong> 앱 윈도우·앱 UI에 padding·top
              inset·margin으로 앱 영역을 아래로 밀어 GNB 자리를 만드는 방식은 <strong>금지</strong>
              한다. GNB는 앱(최대화 창) 위에 겹쳐 올라오는 <strong>오버레이(z-order)</strong>로만
              표시·숨김된다.
            </li>
          </ul>
        </Prose>
      </VStack>

      {/* 2. Composition */}
      <VStack gap={4}>
        <SectionTitle>2. Composition (구성 요소)</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[ THAKI Logo ] [ Dock Menu ] [ App Launcher ]          [ Domain ] [ Settings ] [ Account ] [ Notifications ] | [ TCA ]`}</pre>
        </div>

        <SubSectionTitle>2.1 Dock Menu (실행 중 앱)</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">인터랙션</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>마우스 오버</strong>
              </Td>
              <Td>앱 이름 툴팁 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>좌클릭 (미실행)</strong>
              </Td>
              <Td>앱 실행 (새 창 생성)</Td>
            </tr>
            <tr>
              <Td>
                <strong>좌클릭 (포커스 아웃)</strong>
              </Td>
              <Td>가장 최근 포커스였던 윈도우로 포커스 전환</Td>
            </tr>
            <tr>
              <Td>
                <strong>좌클릭 (전부 최소화)</strong>
              </Td>
              <Td>가장 나중에 최소화된 윈도우 복원(Restore)</Td>
            </tr>
            <tr>
              <Td>
                <strong>우클릭</strong>
              </Td>
              <Td>컨텍스트 메뉴: 열린 윈도우 목록, New window, Pin/Unpin, Quit</Td>
            </tr>
            <tr>
              <Td>
                <strong>드래그 앤 드롭</strong>
              </Td>
              <Td>아이콘 순서 변경 (옆 아이콘 밀림)</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>2.2 도메인 표시기</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>읽기 전용 Text label</strong>이다. Select가 아니며, <strong>클릭 불가</strong>
              하다.
            </li>
            <li>
              도메인 목록·전환 UI가 없다. <strong>단일 도메인</strong>만 표시한다.
            </li>
            <li>
              일반(도메인) 계정과 시스템 관리자 계정 모두 동일한 읽기 전용 Text label을 사용한다.
            </li>
          </ul>
        </Prose>

        <SubSectionTitle>2.3 전체 앱 목록 (App Launcher)</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              상단바에 <strong>런처 아이콘</strong>을 제공한다.
            </li>
            <li>
              Dock에 고정·실행 중이 아닌 앱까지 포함한 <strong>전체 앱 카탈로그</strong>에 접근한다.
              (macOS Launchpad와 유사)
            </li>
            <li>
              아이콘 클릭 시 <strong>그리드/리스트 전체 앱 오버레이 또는 패널</strong>을 연다.
            </li>
            <li>앱 선택 시 해당 앱을 실행하거나, 이미 열려 있으면 포커스를 전환한다.</li>
            <li>
              실제 목록은 <strong>역할별 앱 구성</strong>에 따라 필터링된다.
            </li>
          </ul>
        </Prose>

        <SubSectionTitle>2.4 시스템 설정</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>언어:</strong> English, 한국어
            </li>
            <li>
              <strong>테마:</strong> System, Light, Dark
            </li>
          </ul>
        </Prose>

        <SubSectionTitle>2.5 계정</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>계정 정보:</strong> 로그인된 계정 확인. 클릭 시 [설정 앱 - 계정 메뉴] 열림.
            </li>
            <li>
              <strong>로그아웃:</strong> 클릭 시 로그인 화면으로 이동.
            </li>
          </ul>
        </Prose>

        <SubSectionTitle>2.6 TCA · Settings</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              상단바에서 <strong>TCA(AI 챗봇) 패널</strong> 진입: 아이콘 클릭 시 패널 Slide-in
            </li>
            <li>
              상단바에서 <strong>전역 Settings</strong> 진입
            </li>
          </ul>
        </Prose>
      </VStack>

      {/* 3. Variants */}
      <VStack gap={4}>
        <SectionTitle>3. Variants</SectionTitle>
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
                <strong>일반 모드</strong>
              </Td>
              <Td>
                Top GNB가 항상 화면 최상단에 표시된다. 앱 창이 풀스크린이 아닌 경우의 기본 상태.
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Auto-hide 모드</strong>
              </Td>
              <Td>
                하나 이상의 앱 창이 풀스크린(전체 화면)일 때 활성화. Top GNB가 자동으로 숨겨지며,
                마우스를 화면 최상단으로 이동하면 슬라이딩으로 나타난다.
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 4. 풀스크린 Auto-hide 동작 */}
      <VStack gap={4}>
        <SectionTitle>4. 풀스크린 Auto-hide 동작</SectionTitle>

        <SubSectionTitle>적용 조건</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>적용:</strong> 노출된 앱 윈도우가 하나라도{' '}
              <strong>풀스크린(전체 화면)</strong>인 상태
            </li>
            <li>
              <strong>해제:</strong> 모든 앱 창이 풀스크린 해제(Restore)되거나 닫히면 Top GNB가 항상
              표시 상태로 복원
            </li>
            <li>
              <strong>예외:</strong> 노출된 앱 윈도우가 없거나 풀스크린이 아닌 일반 창 모드일 때는
              상단바 상시 표시
            </li>
          </ul>
        </Prose>

        <SubSectionTitle>숨김 / 표시 동작</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">동작</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>기본 상태</strong>
              </Td>
              <Td>
                Top GNB가 시각적으로 숨김 (<code>transform: translateY(-100%)</code>)
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>노출 조건</strong>
              </Td>
              <Td>
                포인터를 뷰포트 최상단으로 이동 → Hot Zone(6px 투명 영역)에 진입 시 슬라이드로 표시.
                GNB는 앱을 밀어내지 않고 상단 시각적 띠 영역에 앱보다 위 z-order로 겹쳐 나타난다.
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>재숨김</strong>
              </Td>
              <Td>
                포인터가 TopBar/Hot Zone을 벗어나면 200ms 딜레이 후 다시 숨김 (OS 메뉴바와 유사한
                진입·이탈 패턴)
              </Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Hot Zone (감지 영역)</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">속성</Th>
              <Th className="w-[120px]">값</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>위치</Td>
              <Td>화면 최상단</Td>
              <Td>fixed, top: 0, left: 0, right: 0</Td>
            </tr>
            <tr>
              <Td>높이</Td>
              <Td>6px</Td>
              <Td>보이지 않는 투명 영역</Td>
            </tr>
            <tr>
              <Td>z-index</Td>
              <Td>10000</Td>
              <Td>모든 요소 위에 위치하여 항상 호버 감지 가능</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>슬라이딩 애니메이션</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>숨김 상태</Td>
              <Td>
                <code>transform: translateY(-100%)</code>
              </Td>
            </tr>
            <tr>
              <Td>표시 상태</Td>
              <Td>
                <code>transform: translateY(0)</code>
              </Td>
            </tr>
            <tr>
              <Td>전환 시간</Td>
              <Td>300ms</Td>
            </tr>
            <tr>
              <Td>이징</Td>
              <Td>ease-out</Td>
            </tr>
            <tr>
              <Td>전환 속성</Td>
              <Td>transform, box-shadow</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>슬라이딩 시 Shadow</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">상태</Th>
              <Th>box-shadow</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>일반 모드</Td>
              <Td>
                <code>var(--desktop-topbar-shadow)</code>
              </Td>
            </tr>
            <tr>
              <Td>Auto-hide 슬라이딩 표시</Td>
              <Td>
                <code>
                  var(--desktop-topbar-shadow), 0 4px 16px rgba(0,0,0,0.08), 0 1px 3px
                  rgba(0,0,0,0.05)
                </code>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 5. 상태 흐름 */}
      <VStack gap={4}>
        <SectionTitle>5. 상태 흐름</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-4">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`                    앱 Maximize
  [항상 표시] ─────────────────────> [숨김]
       ^                              │  ^
       │                   상단 호버  │  │  마우스 이탈 (200ms)
       │                              v  │
       │                         [슬라이드 표시]
       │                              │
       │         앱 Unmaximize        │
       <──────────────────────────────┘`}</pre>
        </div>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>항상 표시</strong> → 앱 Maximize → <strong>숨김</strong>
            </li>
            <li>
              <strong>숨김</strong> → 마우스 상단 호버 → <strong>슬라이드 표시</strong>
            </li>
            <li>
              <strong>슬라이드 표시</strong> → 마우스 이탈 (200ms 후) → <strong>숨김</strong>
            </li>
            <li>
              <strong>숨김</strong> / <strong>슬라이드 표시</strong> → 앱 Unmaximize →{' '}
              <strong>항상 표시</strong>
            </li>
          </ul>
        </Prose>
      </VStack>

      {/* 6. Domain 드롭다운 */}
      <VStack gap={4}>
        <SectionTitle>6. Domain 드롭다운</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              1.0v 기준 도메인 표시기는 <strong>읽기 전용 Text label</strong>이므로 드롭다운이
              존재하지 않는다.
            </li>
            <li>
              향후 도메인 전환이 필요한 경우, 드롭다운은 <strong>불투명 배경</strong>(
              <code>var(--color-surface-default)</code>)을 사용하고 <code>backdrop-blur</code>를
              적용하지 않는다. (전체화면 앱 콘텐츠 비침 방지)
            </li>
          </ul>
        </Prose>
      </VStack>

      {/* 7. Z-index 레이어 체계 */}
      <VStack gap={4}>
        <SectionTitle>7. Z-index 레이어 체계</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[220px]">레이어</Th>
              <Th className="w-[120px]">z-index</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Top GNB (일반 모드)</Td>
              <Td>1000</Td>
              <Td>항상 표시 상태일 때</Td>
            </tr>
            <tr>
              <Td>Domain 드롭다운</Td>
              <Td>1100</Td>
              <Td>Top GNB 내부 드롭다운</Td>
            </tr>
            <tr>
              <Td>앱 창 (일반)</Td>
              <Td>2000 + n</Td>
              <Td>n은 창 생성 순서</Td>
            </tr>
            <tr>
              <Td>Top GNB (Auto-hide)</Td>
              <Td>9999</Td>
              <Td>전체화면 앱 위로 슬라이딩</Td>
            </tr>
            <tr>
              <Td>Hot Zone</Td>
              <Td>10000</Td>
              <Td>항상 최상위에서 호버 감지</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 8. 엣지 케이스 */}
      <VStack gap={4}>
        <SectionTitle>8. 엣지 케이스</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[280px]">케이스</Th>
              <Th>동작</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>여러 창 중 하나만 Maximize</Td>
              <Td>Top GNB 숨김 (하나라도 Maximize되면 auto-hide 활성화)</Td>
            </tr>
            <tr>
              <Td>여러 창 모두 Maximize 후 하나 Restore</Td>
              <Td>Top GNB 여전히 숨김 (다른 창이 아직 Maximize)</Td>
            </tr>
            <tr>
              <Td>Maximize된 창을 닫기(X)</Td>
              <Td>남은 Maximize 창이 없으면 Top GNB 복원</Td>
            </tr>
            <tr>
              <Td>Dock에서 앱 종료(Quit)</Td>
              <Td>해당 앱의 모든 창 Maximize 상태 해제 후 Top GNB 복원 조건 재평가</Td>
            </tr>
            <tr>
              <Td>Top GNB 슬라이딩 중 드롭다운 열기</Td>
              <Td>드롭다운은 불투명 배경으로 정상 표시</Td>
            </tr>
            <tr>
              <Td>Top GNB 표시 중 Unmaximize</Td>
              <Td>즉시 항상 표시 모드로 전환 (auto-hide 해제)</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      {/* 9. 접근성 */}
      <VStack gap={4}>
        <SectionTitle>9. 접근성</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>Hot Zone은 마우스 기반 인터랙션이므로 키보드 접근성은 별도 고려가 필요하다.</li>
            <li>
              향후 키보드 단축키(예: <code>Ctrl+Shift+M</code>)로 Top GNB 토글 기능 추가를 검토할 수
              있다.
            </li>
            <li>
              모든 Dock 아이콘 및 유틸리티 버튼에는 <strong>aria-label 또는 툴팁</strong>을 반드시
              제공한다.
            </li>
          </ul>
        </Prose>
      </VStack>

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            'Top GNB는 항상 화면 최상단에 위치하며, 풀스크린 시에만 auto-hide로 전환한다.',
            'GNB는 앱 위에 오버레이(z-order)로만 표시·숨김한다. 레이아웃을 밀지 않는다.',
            '도메인 표시기는 읽기 전용 Text label로 표시한다.',
            'Dock 아이콘의 좌클릭·우클릭 동작을 일관되게 유지한다.',
            '슬라이딩 시 drop shadow를 적용하여 떠 있는 느낌을 준다.',
          ]}
          dontItems={[
            '풀스크린 시 padding·margin으로 앱 영역을 밀어 GNB 자리를 만들지 않는다.',
            '도메인 표시기를 Select(드롭다운)로 구현하지 않는다.',
            'Hot Zone 없이 auto-hide를 구현하지 않는다 (호버 감지 영역이 없으면 진입 불가).',
            'auto-hide 슬라이딩 시 앱 창의 크기·위치를 변경하지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function DesktopTopGNBPage() {
  return (
    <ComponentPageTemplate
      title="Desktop Top GNB"
      description="Desktop Shell 상단 글로벌 네비게이션 바. 앱 실행·전환 허브이자 시스템 상태·전역 액션의 집합이다. 하단바 없이 상단바만 두어 전역 컨트롤을 상단에 모아 학습·일관성을 확보한다. 풀스크린 시 macOS 메뉴바와 유사한 auto-hide 동작을 지원한다."
      status="desktop-only"
      whenToUse={[
        'Desktop Shell 환경에서 전역 네비게이션 바가 필요할 때',
        '앱 실행·전환, 도메인 확인, 시스템 설정, 알림, AI 챗봇 등 글로벌 액션에 접근할 때',
        '풀스크린 앱 위에서 오버레이로 상단바를 표시해야 할 때',
      ]}
      whenNotToUse={[
        '개별 앱 내부의 상단 내비게이션 (→ Top Navigation Bar 사용)',
        '로그인 페이지, 랜딩 페이지 등 Desktop Shell이 아닌 환경',
      ]}
      preview={
        <ComponentPreview
          code={`<DesktopTopBar
  autoHide={hasMaximizedWindow}
  onChatbotToggle={() => {}}
  onOpenSettings={(tab) => {}}
  onNotificationToggle={() => {}}
  dockIcons={<DockIcons ... />}
/>`}
        >
          <div className="w-full">
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-3">
              <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`┌──────────────────────────────────────────────────────────────────────────┐
│ [ Logo ] [ 🔲🔲🔲 Dock ] [ ⊞ ]          [ Domain A ] [ ⚙ ] [ 👤 ] [ 🔔 ] │ [ AI ]│
└──────────────────────────────────────────────────────────────────────────┘
  ← 좌측: 로고 + Dock + Launcher                우측: Domain + 유틸리티 →`}</pre>
            </div>
          </div>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>일반 모드 (Normal)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                앱 창이 풀스크린이 아닌 경우. Top GNB가 항상 화면 최상단에 표시된다.
              </span>
            </VStack>
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-3">
              <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`┌─── Top GNB (z: 1000) ─── 항상 표시 ──────────────────────────────────────┐
│ [ Logo ] [ Dock Icons ] [ Launcher ]     [ Domain ] [ ⚙ ] [ 👤 ] [ 🔔 ] │ [ AI ] │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    앱 창 (일반 크기, top: 52px)                            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘`}</pre>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Auto-hide 모드 (숨김 상태)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                앱 창이 풀스크린일 때. Top GNB가 위로 슬라이딩되어 숨겨지고, Hot Zone만 남는다.
              </span>
            </VStack>
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-3">
              <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`─── Hot Zone (6px, z: 10000, 투명) ────────────────────────────────────────
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│              풀스크린 앱 (top: 0, height: 100vh, z: 2000+)               │
│                                                                          │
│                   * Top GNB는 translateY(-100%)로 숨김                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘`}</pre>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Auto-hide 모드 (호버로 표시)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                마우스를 화면 최상단으로 이동하면 Top GNB가 슬라이딩으로 나타난다. GNB는 앱 위에
                오버레이로 겹쳐 표시되며, 앱 크기·위치는 변하지 않는다.
              </span>
            </VStack>
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] p-3">
              <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`┌─── Top GNB (z: 9999) ─── 오버레이 + drop shadow ────────────────────────┐
│ [ Logo ] [ Dock Icons ] [ Launcher ]     [ Domain ] [ ⚙ ] [ 👤 ] [ 🔔 ] │ [ AI ] │
├──────────────────────────────────────────────────────────────────────────┤
│              ↑ GNB가 앱 위에 겹쳐 나타남 (앱 영역 변화 없음)              │
│              풀스크린 앱 (top: 0, height: 100vh, z: 2000+)               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘`}</pre>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<DesktopTopGNBGuidelines />}
      tokens={
        <VStack gap={6}>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[220px]">토큰</Th>
                <Th>값</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>height</Td>
                <Td>52px</Td>
              </tr>
              <tr>
                <Td>background</Td>
                <Td>
                  <code>var(--desktop-topbar-bg)</code> (반투명 + backdrop-blur)
                </Td>
              </tr>
              <tr>
                <Td>border-bottom</Td>
                <Td>
                  <code>1px solid var(--desktop-glass-border)</code>
                </Td>
              </tr>
              <tr>
                <Td>box-shadow (일반)</Td>
                <Td>
                  <code>var(--desktop-topbar-shadow)</code>
                </Td>
              </tr>
              <tr>
                <Td>box-shadow (auto-hide 표시)</Td>
                <Td>
                  <code>
                    var(--desktop-topbar-shadow), 0 4px 16px rgba(0,0,0,0.08), 0 1px 3px
                    rgba(0,0,0,0.05)
                  </code>
                </Td>
              </tr>
              <tr>
                <Td>z-index (일반)</Td>
                <Td>1000</Td>
              </tr>
              <tr>
                <Td>z-index (auto-hide)</Td>
                <Td>9999</Td>
              </tr>
              <tr>
                <Td>hot-zone height</Td>
                <Td>6px</Td>
              </tr>
              <tr>
                <Td>hot-zone z-index</Td>
                <Td>10000</Td>
              </tr>
              <tr>
                <Td>slide animation</Td>
                <Td>300ms ease-out</Td>
              </tr>
              <tr>
                <Td>hide delay</Td>
                <Td>200ms</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Top Navigation Bar',
          path: '/design/components/topbar',
          description: '개별 앱 내부의 상단 내비게이션 바',
        },
        {
          label: 'Tab Bar',
          path: '/design/components/tabbar',
          description: '브라우저 스타일 멀티 탭',
        },
        {
          label: 'Window Control',
          path: '/design/components/window-control',
          description: '앱 윈도우 제어 버튼 (최소화/최대화/닫기)',
        },
        {
          label: 'Page Shell',
          path: '/design/patterns/layout',
          description: '전체 페이지 레이아웃 구조',
        },
        {
          label: 'Desktop Icon Grid',
          path: '/design/patterns/desktop-grid',
          description: '데스크톱 바탕화면 아이콘 그리드',
        },
      ]}
    />
  );
}
