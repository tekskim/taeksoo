import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { VStack, MenuItem, MenuSection } from '@/design-system';
import {
  IconHome,
  IconCube,
  IconTemplate,
  IconCamera,
  IconDisc,
  IconCpu,
  IconDatabase,
  IconDatabaseExport,
  IconNetwork,
  IconRouter,
  IconWorldWww,
  IconShieldLock,
  IconActivity,
  IconServer2,
} from '@tabler/icons-react';

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

function MenuGuidelines() {
  return (
    <VStack gap={10}>
      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <Prose>
          <p>메뉴는 앱의 구조적 복잡도에 따라 레이아웃 단위로 구분된다.</p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">구분</Th>
              <Th>설명</Th>
              <Th className="w-[200px]">사용 사례</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Single</strong>
              </Td>
              <Td>단일 열 사이드바. 헤더 + (Scope Selector) + 메뉴 목록으로 구성</Td>
              <Td>Compute, Object Storage 등</Td>
            </tr>
            <tr>
              <Td>
                <strong>Primary + Secondary</strong>
              </Td>
              <Td>
                2열 사이드바. 좁은 Primary 열(아이콘 + 툴팁)과 넓은 Secondary 열(메뉴 목록)로 구성
              </Td>
              <Td>Container 등 계층이 깊은 앱</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Composition */}
      <VStack gap={6}>
        <SectionTitle>Composition (구성 요소)</SectionTitle>

        {/* 전체 구조 */}
        <VStack gap={3}>
          <SubSectionTitle>전체 구조</SubSectionTitle>

          <p className="text-label-md font-medium text-[var(--color-text-default)]">Single</p>
          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-4 font-mono text-body-sm text-[var(--color-text-default)] leading-relaxed whitespace-pre">
            {`Side Navigation Bar
├── 1. 헤더 영역
│   ├── 앱 아이콘 + 앱 타이틀
│   └── Collapse 버튼
├── 2. Scope Selector (선택)
└── 3. 메뉴 목록
    ├── Menu Item (단독)
    └── Section
        ├── Section Title + Chevron
        └── Menu Item`}
          </div>

          <p className="text-label-md font-medium text-[var(--color-text-default)]">
            Primary + Secondary
          </p>
          <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-4 font-mono text-body-sm text-[var(--color-text-default)] leading-relaxed whitespace-pre">
            {`Side Navigation Bar
├── 1. 헤더 영역 (앱 아이콘 + 앱 타이틀 + Collapse 버튼)
└── 2. 하단 영역 (2열 구조)
    ├── 1. Primary 열
    │   ├── 메뉴 목록 (아이콘 전용, 툴팁 레이블)
    │   └── 하단 액션 (선택, 예: Create +)
    └── 2. Secondary 열
        ├── 1. Scope Selector (선택)
        └── 2. 메뉴 목록
            ├── Menu Item
            └── Section
                ├── Section Title + Chevron
                └── Menu Item`}
          </div>
        </VStack>

        {/* 1. 헤더 영역 */}
        <VStack gap={3}>
          <SubSectionTitle>1. 헤더 영역</SubSectionTitle>
          <Prose>
            <p>상단에 고정되며, 사용자가 현재 어느 앱에 있는지 식별하는 역할을 한다.</p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[180px]">요소</Th>
                <Th>설명</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>a. 앱 아이콘</Td>
                <Td>현재 앱을 나타내는 아이콘</Td>
              </tr>
              <tr>
                <Td>b. 앱 타이틀</Td>
                <Td>현재 앱의 이름 (예: Compute, Container)</Td>
              </tr>
              <tr>
                <Td>c. Collapse 버튼 (⊟)</Td>
                <Td>사이드바 전체를 접거나 펼치는 토글 버튼. 우측 상단에 위치</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        {/* 2. Scope Selector */}
        <VStack gap={3}>
          <SubSectionTitle>2. Scope Selector (선택)</SubSectionTitle>
          <Prose>
            <p>
              앱 내에서 작업 범위(Project, Tenant, Namespace 등)를 전환하는 영역. 해당 속성이
              존재하는 앱에만 표시된다.
            </p>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[180px]">요소</Th>
                <Th>설명</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>a. 범위 레이블</Td>
                <Td>범위 유형 표시 (예: Project, Tenant, Namespace)</Td>
              </tr>
              <tr>
                <Td>b. 현재 선택값</Td>
                <Td>현재 선택된 범위 이름 표시</Td>
              </tr>
              <tr>
                <Td>c. 전환 버튼 (⇄)</Td>
                <Td>클릭 시 범위 선택 드롭다운 열림</Td>
              </tr>
            </tbody>
          </TableWrapper>

          <p className="text-label-md font-medium text-[var(--color-text-default)]">
            Scope Selector 드롭다운
          </p>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[180px]">요소</Th>
                <Th>설명</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>검색 필드</Td>
                <Td>범위 이름으로 필터링</Td>
              </tr>
              <tr>
                <Td>범위 목록</Td>
                <Td>선택 가능한 범위 카드 목록. 이름·설명·ID·생성일 등 메타 정보 포함</Td>
              </tr>
              <tr>
                <Td>현재 선택 표시</Td>
                <Td>현재 선택된 항목에 체크 아이콘(✓) 및 강조 테두리 표시</Td>
              </tr>
              <tr>
                <Td>All (선택)</Td>
                <Td>전체 범위를 대상으로 조회할 수 있는 경우 최상단에 배치 (예: All Namespaces)</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        {/* 3. 메뉴 목록 */}
        <VStack gap={3}>
          <SubSectionTitle>3. 메뉴 목록</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[180px]">요소</Th>
                <Th>설명</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>a. 아이콘 (선택)</Td>
                <Td>
                  메뉴 항목을 시각적으로 식별하는 아이콘. 메뉴 전체에 일관되게 사용하거나 전체 생략
                </Td>
              </tr>
              <tr>
                <Td>b. 레이블</Td>
                <Td>페이지 또는 기능 이름을 나타내는 텍스트</Td>
              </tr>
              <tr>
                <Td>c. 뱃지 (선택)</Td>
                <Td>알림 수, 상태 등 부가 정보 표시. 아이템 우측 끝에 위치</Td>
              </tr>
              <tr>
                <Td>d. 섹션 타이틀</Td>
                <Td>해당 섹션의 그룹명. Chevron(∨)과 함께 표시되며 클릭으로 접힘/펼침 가능</Td>
              </tr>
            </tbody>
          </TableWrapper>
          <Prose>
            <blockquote className="border-l-2 border-[var(--color-border-strong)] pl-3 text-body-sm text-[var(--color-text-subtle)]">
              레이블이 사이드바 너비를 초과하는 경우 말줄임(…)으로 처리하며, 호버 시 툴팁으로 전체
              텍스트를 표시한다.
            </blockquote>
          </Prose>

          <p className="text-label-md font-medium text-[var(--color-text-default)]">
            Design Tokens
          </p>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[180px]">토큰</Th>
                <Th>값</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <code>item.padding</code>
                </Td>
                <Td>8×6px</Td>
              </tr>
              <tr>
                <Td>
                  <code>item.gap</code>
                </Td>
                <Td>6px</Td>
              </tr>
              <tr>
                <Td>
                  <code>item.radius</code>
                </Td>
                <Td>6px (md)</Td>
              </tr>
              <tr>
                <Td>
                  <code>section.padding</code>
                </Td>
                <Td>8×4px</Td>
              </tr>
              <tr>
                <Td>
                  <code>section.gap</code>
                </Td>
                <Td>16px</Td>
              </tr>
              <tr>
                <Td>
                  <code>section.title-gap</code>
                </Td>
                <Td>6px</Td>
              </tr>
              <tr>
                <Td>
                  <code>divider.margin</code>
                </Td>
                <Td>8px</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* States */}
      <VStack gap={4}>
        <SectionTitle>States</SectionTitle>
        <Prose>
          <p>Menu Item은 사용자 인터랙션 및 페이지 상태에 따라 아래의 상태를 가진다.</p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[120px]">상태</Th>
              <Th>설명</Th>
              <Th>시각적 처리</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>기본 상태</Td>
              <Td>배경 없음, 기본 텍스트 색상</Td>
            </tr>
            <tr>
              <Td>
                <strong>Hover</strong>
              </Td>
              <Td>마우스 포인터가 아이템 위에 올라간 상태</Td>
              <Td>배경 강조, 커서 pointer</Td>
            </tr>
            <tr>
              <Td>
                <strong>Active (Pressed)</strong>
              </Td>
              <Td>클릭/탭 직후 순간적으로 눌린 상태</Td>
              <Td>배경 더 진하게 처리</Td>
            </tr>
            <tr>
              <Td>
                <strong>Selected</strong>
              </Td>
              <Td>현재 활성화된(현재 페이지에 해당하는) 아이템</Td>
              <Td>배경 강조색, 텍스트·아이콘 색상 변경</Td>
            </tr>
            <tr>
              <Td>
                <strong>Focused</strong>
              </Td>
              <Td>키보드 탐색 시 포커스된 상태</Td>
              <Td>Focus ring 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Disabled</strong>
              </Td>
              <Td>해당 메뉴 항목을 사용할 수 없는 상태</Td>
              <Td>텍스트 및 아이콘 불투명도 감소, pointer-events 없음</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <blockquote className="border-l-2 border-[var(--color-border-strong)] pl-3 text-body-sm text-[var(--color-text-subtle)]">
            <strong>Selected vs Active</strong>: Selected는 현재 페이지를 나타내는 지속 상태이며,
            Active는 클릭 순간의 일시적 상태다. 두 상태는 동시에 발생할 수 있다.
          </blockquote>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={6}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>내비게이션</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                메뉴 아이템 클릭 시 해당 페이지로 이동하며, 해당 아이템이 Selected 상태로 전환된다.
              </li>
              <li>페이지 이동 후 이전 Selected 아이템은 Default 상태로 돌아간다.</li>
              <li>외부 링크로 이동하는 경우 아이콘(↗)으로 외부 링크임을 명시한다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>사이드바 Collapse</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>헤더 우측의 Collapse 버튼 클릭 시 사이드바 전체가 접힌다.</li>
              <li>
                <strong>Single 레이아웃</strong>에서 접힌 경우: 사이드바가 완전히 숨겨지며 콘텐츠
                영역이 확장된다.
              </li>
              <li>
                <strong>Primary + Secondary 레이아웃</strong>에서 접힌 경우: Secondary 열이 숨겨지고
                Primary 열(아이콘 전용)만 유지된다.
              </li>
              <li>Collapsed 상태의 Primary 아이템에 호버 시 툴팁으로 레이블을 표시한다.</li>
              <li>
                Collapse 상태는 세션 또는 로컬 스토리지에 유지하여 페이지 이동 후에도 보존한다.
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>Scope Selector</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Scope Selector의 전환 버튼(⇄) 클릭 시 드롭다운이 열린다.</li>
              <li>
                드롭다운은 사이드바 너비에 맞춰 렌더링되며, 목록이 길 경우 내부 스크롤을 적용한다.
              </li>
              <li>
                범위를 변경하면 현재 페이지를 유지한 채로 해당 범위 내 데이터를 새로 로드한다. 단,
                선택한 범위에 현재 페이지가 존재하지 않는 경우 해당 범위의 홈(Dashboard 등)으로
                이동한다.
              </li>
              <li>
                드롭다운 외부 클릭 또는 <code>Esc</code> 키 입력 시 닫힌다.
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>Collapsible 섹션</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>Collapsible 섹션의 타이틀 클릭 시 하위 메뉴가 펼쳐지거나 접힌다.</li>
              <li>
                기본 상태: 현재 선택된 페이지가 속한 섹션은 펼친 상태(expanded)로 초기 렌더링한다.
              </li>
              <li>
                하위 메뉴 중 Selected 아이템이 있는 경우, 해당 섹션을 접어도 상위 섹션 타이틀에
                Selected 표시(점 또는 색상)를 유지한다.
              </li>
              <li>
                펼침/접힘 애니메이션: 높이 전환(height transition)을 사용하며, 지속 시간은 Motion
                가이드라인의 <code>duration.short</code>를 따른다.
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>키보드 탐색</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[180px]">키</Th>
                <Th>동작</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <code>Tab</code> / <code>Shift+Tab</code>
                </Td>
                <Td>포커스 이동</Td>
              </tr>
              <tr>
                <Td>
                  <code>↑</code> / <code>↓</code>
                </Td>
                <Td>아이템 간 포커스 이동</Td>
              </tr>
              <tr>
                <Td>
                  <code>Enter</code> / <code>Space</code>
                </Td>
                <Td>아이템 선택 또는 Collapsible 섹션 펼침/접힘</Td>
              </tr>
              <tr>
                <Td>
                  <code>Esc</code>
                </Td>
                <Td>Scope Selector 드롭다운 닫기</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '메뉴 아이템 레이블은 간결하고 명확하게 작성한다. 1~3단어가 이상적이며 동사보다 명사형을 권장한다. (예: Instances, Apps)',
            '아이콘을 사용하는 경우 전체 아이템에 일관되게 적용한다. 일부 아이템에만 아이콘을 넣으면 시각적 불균형이 생긴다.',
            '관련 있는 메뉴끼리 섹션으로 묶어 인지 부하를 줄인다.',
            '사용자가 가장 자주 방문하는 페이지를 목록 상단 또는 첫 번째 섹션에 배치한다.',
            '현재 페이지에 해당하는 아이템은 항상 Selected 상태로 표시하여 사용자가 현재 위치를 즉시 파악할 수 있게 한다.',
          ]}
          dontItems={[
            '한 섹션에 7개 이상의 메뉴 아이템을 나열하지 않는다. 항목이 많다면 섹션을 분리하거나 Collapsible 구조를 활용한다.',
            '메뉴 아이템 레이블에 줄임말이나 약어를 남용하지 않는다. 아이콘만으로 의미가 충분하지 않으면 반드시 레이블을 제공한다.',
            '3단계 이상의 Collapsible 중첩 구조는 사용하지 않는다. 깊은 계층은 인지 부하를 높이고 탐색을 어렵게 만든다.',
            '비활성화(Disabled) 항목을 과도하게 사용하지 않는다. 사용자가 해당 항목에 접근할 수 없는 이유를 알 수 없으면 혼란을 야기한다. 권한 부족 등의 경우에는 Disabled 대신 항목을 숨기는 것을 고려한다.',
            'Selected 상태를 여러 아이템에 동시에 적용하지 않는다. 현재 페이지는 하나이므로 Selected 아이템도 항상 하나여야 한다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">항목</Th>
              <Th>규칙</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>레이블</strong>
              </Td>
              <Td>
                페이지 또는 기능의 이름을 명사형으로 작성한다. 동사 사용은 특수한 액션(예:
                로그아웃)에만 한정한다.
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>섹션 타이틀</strong>
              </Td>
              <Td>
                그룹 내 아이템을 포괄하는 카테고리명을 사용한다. 보통 1단어가 이상적이다. (예:
                Compute, Storage, Network)
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>대소문자</strong>
              </Td>
              <Td>
                영문 레이블은 Title Case를 기본으로 한다. (예: &quot;Instance Templates&quot; ✅,
                &quot;instance templates&quot; ❌)
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>레이블 길이</strong>
              </Td>
              <Td>
                한 줄을 초과하지 않도록 작성한다. 긴 이름은 사이드바 너비를 고려하여 축약한다.
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>언어</strong>
              </Td>
              <Td>
                앱의 언어 설정과 무관하게 메뉴 레이블과 섹션 타이틀은 영문으로 고정한다. 리소스 및
                서비스 명칭의 일관성을 유지하기 위함이다.
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>
    </VStack>
  );
}

export function MenuPage() {
  return (
    <ComponentPageTemplate
      title="Side Navigation Bar (Menu)"
      description="앱 내 페이지 이동을 위한 사이드바 내비게이션 컴포넌트로, 사용자가 현재 위치를 파악하고 원하는 페이지로 이동할 수 있도록 돕는다. 메뉴 아이템은 섹션으로 그룹화할 수 있으며, 하위 메뉴를 포함하는 Collapsible 구조를 지원한다. 앱의 복잡도에 따라 단일 열(Single) 또는 2열(Primary + Secondary) 레이아웃으로 구성된다."
      whenToUse={[
        '앱 내 주요 페이지 간 이동이 필요할 때',
        '관련 메뉴 항목을 섹션 단위로 그룹화하여 구조적으로 제공해야 할 때',
        '사용자가 현재 위치(활성 페이지)를 명확히 인지해야 할 때',
      ]}
      whenNotToUse={[
        '페이지 내 콘텐츠 탐색(앵커 이동 등)에는 사용하지 않는다.',
        '단순히 2~3개의 항목만 있는 경우 TabBar 또는 Segmented Control을 고려한다.',
      ]}
      preview={
        <ComponentPreview
          code={`<VStack gap={4}>
  <MenuItem icon={<IconHome size={16} />} label="Home" active />
  <MenuSection title="Compute" defaultOpen={true}>
    <MenuItem icon={<IconCube size={16} />} label="Instances" active />
    <MenuItem icon={<IconTemplate size={16} />} label="Instance templates" />
  </MenuSection>
</VStack>`}
        >
          <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
            <VStack gap={4}>
              <MenuItem icon={<IconHome size={16} stroke={1.5} />} label="Home" />
              <MenuSection title="Compute" defaultOpen={true}>
                <MenuItem icon={<IconCube size={16} stroke={1.5} />} label="Instances" active />
                <MenuItem
                  icon={<IconTemplate size={16} stroke={1.5} />}
                  label="Instance templates"
                />
                <MenuItem icon={<IconDisc size={16} stroke={1.5} />} label="Images" />
                <MenuItem icon={<IconCpu size={16} stroke={1.5} />} label="Flavors" />
              </MenuSection>
            </VStack>
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { MenuItem, MenuSection } from '@/design-system';\n\n<MenuSection title="Compute" defaultOpen={true}>\n  <MenuItem icon={<IconCube size={16} />} label="Instances" active />\n  <MenuItem icon={<IconTemplate size={16} />} label="Instance templates" />\n</MenuSection>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Menu items (기본)
            </span>
            <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
              <MenuItem icon={<IconHome size={16} stroke={1.5} />} label="Home" active />
              <MenuItem icon={<IconCube size={16} stroke={1.5} />} label="Instances" />
              <MenuItem icon={<IconTemplate size={16} stroke={1.5} />} label="Instance templates" />
              <MenuItem icon={<IconCamera size={16} stroke={1.5} />} label="Instance snapshots" />
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Collapsible sections
            </span>
            <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
              <VStack gap={4}>
                <MenuSection title="Compute" defaultOpen={true}>
                  <MenuItem icon={<IconCube size={16} stroke={1.5} />} label="Instances" active />
                  <MenuItem
                    icon={<IconTemplate size={16} stroke={1.5} />}
                    label="Instance templates"
                  />
                  <MenuItem icon={<IconDisc size={16} stroke={1.5} />} label="Images" />
                  <MenuItem icon={<IconCpu size={16} stroke={1.5} />} label="Flavors" />
                </MenuSection>
                <MenuSection title="Storage" defaultOpen={true}>
                  <MenuItem icon={<IconDatabase size={16} stroke={1.5} />} label="Volumes" />
                  <MenuItem icon={<IconCamera size={16} stroke={1.5} />} label="Volume snapshots" />
                </MenuSection>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Compute Admin 사이드바 예시
            </span>
            <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
              <VStack gap={4}>
                <MenuItem icon={<IconHome size={16} stroke={1.5} />} label="Home" />
                <MenuSection title="Compute" defaultOpen={true}>
                  <MenuItem icon={<IconCube size={16} stroke={1.5} />} label="Instances" active />
                  <MenuItem
                    icon={<IconTemplate size={16} stroke={1.5} />}
                    label="Instance templates"
                  />
                  <MenuItem
                    icon={<IconCamera size={16} stroke={1.5} />}
                    label="Instance snapshots"
                  />
                  <MenuItem icon={<IconDisc size={16} stroke={1.5} />} label="Images" />
                  <MenuItem icon={<IconCpu size={16} stroke={1.5} />} label="Flavors" />
                </MenuSection>
                <MenuSection title="Storage" defaultOpen={true}>
                  <MenuItem icon={<IconDatabase size={16} stroke={1.5} />} label="Volumes" />
                  <MenuItem icon={<IconCamera size={16} stroke={1.5} />} label="Volume snapshots" />
                  <MenuItem
                    icon={<IconDatabaseExport size={16} stroke={1.5} />}
                    label="Volume backups"
                  />
                </MenuSection>
                <MenuSection title="Network" defaultOpen={true}>
                  <MenuItem icon={<IconNetwork size={16} stroke={1.5} />} label="Networks" />
                  <MenuItem icon={<IconRouter size={16} stroke={1.5} />} label="Routers" />
                  <MenuItem icon={<IconWorldWww size={16} stroke={1.5} />} label="Floating IPs" />
                  <MenuItem
                    icon={<IconShieldLock size={16} stroke={1.5} />}
                    label="Security groups"
                  />
                </MenuSection>
                <MenuSection title="Monitoring" defaultOpen={false}>
                  <MenuItem
                    icon={<IconActivity size={16} stroke={1.5} />}
                    label="Monitor overview"
                  />
                  <MenuItem icon={<IconServer2 size={16} stroke={1.5} />} label="Physical nodes" />
                </MenuSection>
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<MenuGuidelines />}
      keyboardInteractions={[
        { key: 'Tab / Shift+Tab', description: '포커스 이동' },
        { key: '↑ / ↓', description: '아이템 간 포커스 이동' },
        { key: 'Enter / Space', description: '아이템 선택 또는 Collapsible 섹션 펼침/접힘' },
        { key: 'Esc', description: 'Scope Selector 드롭다운 닫기' },
      ]}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          Menu uses <code>role=&quot;navigation&quot;</code> with <code>aria-label</code> for the
          nav container. Active menu items use <code>aria-current=&quot;page&quot;</code>.
          Collapsible sections use <code>aria-expanded</code> to indicate their open/closed state.
        </p>
      }
      relatedLinks={[
        { label: 'Top Navigation Bar', path: '/design/components/topbar' },
        { label: 'Tab Bar', path: '/design/components/tabbar' },
        { label: 'Breadcrumb', path: '/design/components/breadcrumb' },
      ]}
    />
  );
}
