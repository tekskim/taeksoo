import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Button, ContextMenu, VStack } from '@/design-system';
import { IconChevronRight } from '@tabler/icons-react';

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

const contextMenuProps: PropDef[] = [
  { name: 'items', type: 'ContextMenuItem[]', required: true, description: 'Menu items array' },
  { name: 'children', type: 'ReactElement', required: true, description: 'Trigger element' },
  {
    name: 'trigger',
    type: "'click' | 'contextmenu'",
    default: "'contextmenu'",
    required: false,
    description: 'Trigger type',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
  {
    name: 'align',
    type: "'left' | 'right'",
    default: "'left'",
    required: false,
    description: 'Dropdown alignment',
  },
];

function ContextMenuGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">구성 요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>① Trigger</strong>
              </Td>
              <Td>• 마우스 우클릭 또는 액션 더보기(···) 버튼 클릭</Td>
            </tr>
            <tr>
              <Td>
                <strong>② Menu container</strong>
              </Td>
              <Td>
                • 클릭 지점 또는 대상 요소 인근에 표시되는 팝오버 레이어
                <br />
                • 메뉴가 뷰포트를 벗어나지 않도록 자동 위치 보정(Flip/Shift)
                <br />
                • Right icon: Submenu가 있는 메뉴 항목에는 Submenu indicator(chevron-right)를 표시
                <br />• Left icon: 메뉴 항목의 의미를 시각적으로 표현하거나 상태를 표시하기 위해
                사용
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>③ Submenu</strong>
              </Td>
              <Td>
                • 2단계 이상 분기가 필요한 경우에 선택 사용
                <br />• 과도한 깊이(&gt;2 depth)는 금지(→ Command Menu/별도 화면)
              </Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Token</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>min-width</code>
              </Td>
              <Td>80px</Td>
            </tr>
            <tr>
              <Td>
                <code>padding</code>
              </Td>
              <Td>12×6px</Td>
            </tr>
            <tr>
              <Td>
                <code>radius</code>
              </Td>
              <Td>6px</Td>
            </tr>
            <tr>
              <Td>
                <code>shadow</code>
              </Td>
              <Td>md</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>유형</Th>
              <Th>설명</Th>
              <Th>사용 예시</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Item Context Menu</strong>
              </Td>
              <Td>
                리스트 또는 테이블의 특정 항목(Row)에 대한 보조 액션 메뉴. 해당 항목에 직접 적용되는
                작업을 빠르게 실행할 수 있도록 제공된다.
              </Td>
              <Td>테이블 action 컬럼에서 더보기 버튼 클릭</Td>
            </tr>
            <tr>
              <Td>
                <strong>App Context Menu</strong>
              </Td>
              <Td>
                데스크탑 UI에서 앱 아이콘을 우클릭했을 때 표시되는 보조 액션 메뉴. 해당 앱 자체에
                대한 관리 또는 접근 관련 작업을 제공한다.
              </Td>
              <Td>앱 아이콘 우클릭</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* States */}
      <VStack gap={4}>
        <SectionTitle>States</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">상태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Closed</strong>
              </Td>
              <Td>메뉴가 표시되지 않은 기본 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Open</strong>
              </Td>
              <Td>Context Menu가 화면에 표시된 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Hover (Focus)</strong>
              </Td>
              <Td>
                • 마우스 포인터가 메뉴 항목 위에 위치한 상태
                <br />• 키보드 탐색으로 메뉴 항목이 선택된 상태
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Disabled</strong>
              </Td>
              <Td>
                • 권한 또는 조건이 충족되지 않아 선택할 수 없는 상태
                <br />• 더보기 버튼 또는 컨텍스트 메뉴의 특정 액션이 비활성화
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Submenu Open</strong>
              </Td>
              <Td>특정 메뉴 항목의 하위 메뉴가 확장된 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Selected</strong>
              </Td>
              <Td>체크 또는 선택 상태를 표시하는 메뉴 항목 상태 (토글 메뉴 등)</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={6}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) 닫힘(Dismiss) 규칙</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>메뉴 외부 클릭 시 닫힘</li>
              <li>ESC 키로 닫힘</li>
              <li>
                메뉴 항목 실행 후 자동 닫힘
                <ul className="list-disc pl-5 mt-1">
                  <li>단, 체크/토글 성격은 닫히지 않고 유지</li>
                </ul>
              </li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) 포커스/키보드 탐색</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>열릴 때 메뉴 컨테이너에 포커스</li>
              <li>키보드 ↑/↓ 클릭 시 밑에서/위에서 첫 번째 enabled item에 포커스</li>
              <li>↑/↓로 항목 이동, Enter로 실행, →로 서브메뉴 진입, ←로 서브메뉴 이탈</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) 위치/레이어링</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>앱 화면 밖으로 나가지 않도록 Flip(상하/좌우 전환) 및 Shift(미세 이동) 적용</li>
              <li>메뉴가 열려있는 상태에서는 화면 스크롤 불가</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>4) 액션 실행과 피드백</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>일반 액션: 실행 후 토스트 또는 스낵바(필요시)</li>
              <li>파괴적 액션(Delete): 즉시 실행 금지. 확인 모달 제공</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>5) Submenu 액션 규칙</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Submenu는 메뉴 항목을 <strong>클릭으로 열림(Hover로 열리지 않음)</strong>
              </li>
              <li>
                Submenu가 열린 후에는 마우스가 다른 영역으로 이동하더라도{' '}
                <strong>자동으로 닫히지 않음</strong>
              </li>
              <li>Submenu 내부 항목을 클릭하면 해당 액션이 실행되고 전체 메뉴가 닫힘</li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={6}>
        <SectionTitle>Usage Guidelines</SectionTitle>

        <Prose>
          <p>자주 사용하는 액션을 위에, 파괴적 액션을 아래에 배치한다. 권장 순서:</p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[60px]">순위</Th>
              <Th>메뉴 유형</Th>
              <Th>예시</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>가장 자주 쓰는 기본 액션</Td>
              <Td>Open, View 등</Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>생성/복제</Td>
              <Td>Duplicate, Clone 등</Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>공유/내보내기</Td>
              <Td>Export, Copy link 등</Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td>설정/고급</Td>
              <Td>Advanced</Td>
            </tr>
            <tr>
              <Td>5</Td>
              <Td>파괴적 액션</Td>
              <Td>Delete, Remove 등</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <DosDonts
          doItems={[
            '메뉴 항목은 "현재 선택 대상"에 직접적으로 적용되는 액션만 포함한다.',
            '상위 5–8개 이내로 유지하고, 나머지는 "Submenu"로 분리한다.',
            'Disable은 사용자가 이해 가능한 이유가 있을 때만 사용한다. 화면에서 직관적으로 액션 불가 원인이 확인 가능할 때 → 버튼만 Disabled. 화면에서는 바로 인지하기 어려울 때 → Disabled + 툴팁 제공.',
            'Delete 등 파괴적 액션은 danger 스타일로 시각적 경고를 제공한다.',
          ]}
          dontItems={[
            '탐색(페이지 이동) 중심의 항목은 지양한다.',
            '2 depth를 초과하는 서브메뉴를 만들지 않는다.',
            '동일 의미의 액션을 다른 이름으로 중복 노출하지 않는다.',
            '메뉴에 폼 입력(텍스트 필드 등)을 넣지 않는다(→ 필요 시 Modal/Popover Form 사용).',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function ContextMenuPage() {
  return (
    <ComponentPageTemplate
      title="Context Menu"
      description="사용자가 현재 선택한 대상(파일, 리스트 항목, 셀, 텍스트 등)에 대해 '지금 여기에서 가능한 작업'을 빠르게 실행할 수 있도록 제공되는 보조 액션 메뉴 컴포넌트이다. 주로 우클릭(마우스), 트랙패드 보조 클릭으로 호출된다."
      whenToUse={[
        '리스트/테이블/트리에서 항목 단위로 수행 가능한 액션이 2개 이상 존재할 때',
        '사용자가 화면을 이동하지 않고 즉시 실행해야 하는 보조 액션이 있을 때',
      ]}
      whenNotToUse={[
        '액션이 1개 뿐일 때(→ 인라인 버튼/아이콘 버튼)',
        '탐색 구조(섹션 이동)를 제공하려는 경우(→ Menu/Sidebar)',
      ]}
      preview={
        <ComponentPreview
          code={`<ContextMenu
  trigger="click"
  items={[
    { id: 'edit', label: 'Edit', onClick: () => {} },
    { id: 'duplicate', label: 'Duplicate', onClick: () => {} },
    { id: 'copy', label: 'Copy', onClick: () => {}, divider: true },
    { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
  ]}
>
  <Button variant="outline" size="sm">Click for Menu</Button>
</ContextMenu>`}
        >
          <ContextMenu
            trigger="click"
            items={[
              { id: 'view', label: 'View details', onClick: () => {} },
              { id: 'edit', label: 'Edit', onClick: () => {} },
              { id: 'share', label: 'Share', onClick: () => {}, divider: true },
              { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
            ]}
          >
            <Button variant="outline" size="sm">
              Click for Menu
            </Button>
          </ContextMenu>
        </ComponentPreview>
      }
      usage={{
        code: `import { ContextMenu, Button } from '@/design-system';\n\n<ContextMenu\n  items={[\n    { id: 'edit', label: 'Edit', onClick: handleEdit },\n    { id: 'delete', label: 'Delete', status: 'danger', divider: true, onClick: handleDelete },\n  ]}\n  trigger="click"\n>\n  <Button variant="outline" size="sm">More Actions</Button>\n</ContextMenu>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">Basic Menu</span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                기본 항목 + divider + danger 액션. 자주 사용하는 구성.
              </span>
            </VStack>
            <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden w-fit">
              <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                Edit
              </div>
              <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                Duplicate
              </div>
              <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] border-b border-[var(--color-border-subtle)]">
                Copy
              </div>
              <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-state-danger)]">
                Delete
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">With Submenu</span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                2단계 분기. Submenu indicator(chevron-right)로 하위 메뉴 존재를 표시.
              </span>
            </VStack>
            <div className="flex gap-1 items-start">
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden">
                <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] flex items-center justify-between bg-[var(--context-menu-hover-bg)]">
                  <span>New</span>
                  <IconChevronRight
                    size={12}
                    stroke={1}
                    className="ml-6 text-[var(--color-text-default)]"
                  />
                </div>
                <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                  Open
                </div>
                <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] border-b border-[var(--color-border-subtle)]">
                  Save
                </div>
                <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] flex items-center justify-between">
                  <span>Export</span>
                  <IconChevronRight
                    size={12}
                    stroke={1}
                    className="ml-6 text-[var(--color-text-default)]"
                  />
                </div>
              </div>
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden self-start">
                <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                  File
                </div>
                <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                  Folder
                </div>
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">Danger Status</span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                파괴적 액션은 danger 스타일로 시각적 경고. 메뉴 하단에 배치.
              </span>
            </VStack>
            <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden w-fit">
              <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)]">
                Default item
              </div>
              <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-text-default)] border-b border-[var(--color-border-subtle)]">
                Another item
              </div>
              <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-state-danger)]">
                Warning action
              </div>
              <div className="px-[var(--context-menu-padding-x)] py-[var(--context-menu-padding-y)] text-body-sm text-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]">
                Delete
              </div>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">
                Interactive Demo
              </span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                클릭하여 실제 Context Menu를 열어볼 수 있습니다.
              </span>
            </VStack>
            <div className="flex gap-4">
              <ContextMenu
                trigger="click"
                items={[
                  { id: 'view', label: 'View details', onClick: () => {} },
                  { id: 'edit', label: 'Edit', onClick: () => {} },
                  { id: 'duplicate', label: 'Duplicate', onClick: () => {} },
                  { id: 'export', label: 'Export', onClick: () => {}, divider: true },
                  { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
                ]}
              >
                <Button variant="outline" size="sm">
                  Item Context Menu
                </Button>
              </ContextMenu>
              <ContextMenu
                trigger="click"
                items={[
                  {
                    id: 'status',
                    label: 'Instance status',
                    submenu: [
                      { id: 'start', label: 'Start', onClick: () => {} },
                      { id: 'stop', label: 'Stop', status: 'danger', onClick: () => {} },
                    ],
                  },
                  { id: 'console', label: 'Console', onClick: () => {} },
                  {
                    id: 'delete',
                    label: 'Delete',
                    status: 'danger',
                    divider: true,
                    onClick: () => {},
                  },
                ]}
              >
                <Button variant="outline" size="sm">
                  With Submenu
                </Button>
              </ContextMenu>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<ContextMenuGuidelines />}
      tokens={
        <div className="text-body-sm text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
          <code>min-width: 80px</code> · <code>padding: 12×6px</code> · <code>radius: 6px</code> ·{' '}
          <code>shadow: md</code>
        </div>
      }
      apiReference={contextMenuProps}
      accessibility={
        <VStack gap={4} align="stretch">
          <p className="text-body-md text-[var(--color-text-muted)]">
            Context Menu는 키보드로 완전히 조작 가능해야 하며, 스크린 리더가 메뉴 구조를 인식할 수
            있어야 합니다.
          </p>
          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">ARIA 속성</h4>
            <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
              <li>
                <code>role="menu"</code> — 메뉴 컨테이너에 적용
              </li>
              <li>
                <code>role="menuitem"</code> — 각 메뉴 항목에 적용
              </li>
            </ul>
          </VStack>
          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">키보드 탐색</h4>
            <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
              <li>Arrow Up/Down — 메뉴 항목 간 이동</li>
              <li>Home/End — 첫 번째/마지막 항목으로 이동</li>
              <li>Enter/Space — 포커스된 항목 활성화</li>
              <li>Escape — 메뉴 닫기 및 트리거 요소로 포커스 복원</li>
            </ul>
          </VStack>
        </VStack>
      }
      keyboardInteractions={[
        { key: 'ArrowDown', description: '다음 메뉴 아이템으로 포커스 이동' },
        { key: 'ArrowUp', description: '이전 메뉴 아이템으로 포커스 이동' },
        { key: 'Home', description: '첫 번째 메뉴 아이템으로 포커스 이동' },
        { key: 'End', description: '마지막 메뉴 아이템으로 포커스 이동' },
        { key: 'Enter / Space', description: '포커스된 메뉴 아이템 활성화' },
        { key: 'Escape', description: '메뉴를 닫고 트리거 요소로 포커스 복원' },
      ]}
      relatedLinks={[
        {
          label: 'UX Writing Guide',
          path: '/design/foundation/ux-writing',
          description: '메뉴 레이블 문장 스타일/금칙어/일관성 규칙 준수',
        },
        {
          label: 'Button',
          path: '/design/components/button',
          description: '"⋯(More)" 트리거, 보조 클릭 대체 트리거 제공 시 사용',
        },
        {
          label: 'Modal',
          path: '/design/components/modal',
          description: '파괴적 액션의 확인(Confirm) 흐름에 필요',
        },
        {
          label: 'Toast',
          path: '/design/components/toast',
          description: '즉시 완료 액션 피드백(비기록형) 표준 채널',
        },
        {
          label: 'Snackbar',
          path: '/design/components/snackbar',
          description: '비동기/기록형 이벤트 피드백 채널',
        },
        {
          label: 'Table',
          path: '/design/components/table',
          description: '리스트/테이블 항목 컨텍스트에서 Context Menu 사용 빈도가 높음',
        },
        {
          label: 'Popover',
          path: '/design/components/popover',
          description: 'Context Menu의 레이어/포지셔닝/디스미스 규칙과 일관성 필요',
        },
        {
          label: 'List Page',
          path: '/design/patterns/list-page',
          description: '리스트/테이블 항목 컨텍스트에서 Context Menu 사용 빈도가 높음',
        },
      ]}
    />
  );
}
