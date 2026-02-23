import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Button, ContextMenu, VStack } from '@/design-system';
import { IconChevronRight } from '@tabler/icons-react';

export function ContextMenuPage() {
  return (
    <ComponentPageTemplate
      title="Context menu"
      description="Popup menu triggered by right-click or click with submenu support"
      relatedLinks={[
        {
          label: 'Popover',
          path: '/design/components/popover',
          description: 'Interactive overlay',
        },
        { label: 'Menu', path: '/design/components/menu', description: 'Navigation menu' },
        { label: 'Table', path: '/design/components/table', description: 'Row actions' },
      ]}
    >
      <VStack gap={8}>
        {/* 사용 정책 */}
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  트리거 선택 기준
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          트리거
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          사용 조건
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          예시
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          click
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          명시적인 버튼 클릭으로 메뉴 오픈. 주요 액션 제공 시 사용.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          More Actions, Create 드롭다운
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          contextmenu
                        </td>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          우클릭으로 메뉴 오픈. 보조 액션 제공 시 사용.
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          테이블 행 우클릭, 파일 탐색기
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  메뉴 항목 구성 규칙
                </h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    모든 항목에 고유한 <code>id</code> 필드가 필수입니다.
                  </li>
                  <li>
                    <strong>위험 액션</strong> (Delete, Terminate)은{' '}
                    <code>status: &apos;danger&apos;</code>로 설정하고 메뉴 하단에 배치합니다.
                  </li>
                  <li>
                    <strong>구분선</strong>: 별도 divider 항목이 아닌, 항목의{' '}
                    <code>divider: true</code> 속성으로 아래에 구분선을 표시합니다.
                  </li>
                  <li>
                    <strong>순서</strong>: 자주 사용하는 액션을 위에, 위험 액션을 아래에 배치합니다.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>
        </VStack>

        {/* 가이드라인 */}
        <VStack gap={3}>
          <Label>가이드라인</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">Do</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>Delete 등 파괴적 액션은 danger 스타일로 시각적 경고를 제공합니다.</li>
                <li>관련 있는 액션끼리 divider로 그룹을 나눕니다.</li>
                <li>키보드로 메뉴 탐색이 가능하도록 합니다 (Arrow 키, Enter, Escape).</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">Don&apos;t</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>
                  <code>
                    {'{'}type: &apos;divider&apos;{'}'}
                  </code>{' '}
                  형태로 별도 구분선 아이템을 추가하지 않습니다.
                </li>
                <li>서브메뉴를 2단계 이상 중첩하지 않습니다.</li>
                <li>
                  contextmenu 트리거만 단독으로 사용하지 않습니다 (발견성이 낮음, click 트리거와
                  병행).
                </li>
              </ul>
            </div>
          </div>
        </VStack>

        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>min-width: 80px</code> · <code>padding: 12×6px</code> · <code>radius: 6px</code> ·{' '}
            <code>shadow: md</code>
          </div>
        </VStack>

        {/* Static Preview */}
        <VStack gap={3}>
          <Label>Static preview</Label>
          <div className="flex gap-6 items-start">
            {/* Basic Menu */}
            <VStack gap={2}>
              <span className="text-body-xs text-[var(--color-text-subtle)]">Basic</span>
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden">
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

            {/* With Submenu */}
            <VStack gap={2}>
              <span className="text-body-xs text-[var(--color-text-subtle)]">With Submenu</span>
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

            {/* Status Variants */}
            <VStack gap={2}>
              <span className="text-body-xs text-[var(--color-text-subtle)]">Danger Status</span>
              <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-strong)] rounded-[var(--context-menu-radius)] shadow-[var(--shadow-md)] overflow-hidden">
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
          </div>
        </VStack>

        {/* Right Click Trigger */}
        <VStack gap={3}>
          <Label>Right Click Trigger</Label>
          <ContextMenu
            trigger="contextmenu"
            items={[
              { id: 'edit', label: 'Edit', onClick: () => {} },
              { id: 'duplicate', label: 'Duplicate', onClick: () => {} },
              { id: 'copy', label: 'Copy', onClick: () => {}, divider: true },
              { id: 'delete', label: 'Delete', status: 'danger', onClick: () => {} },
            ]}
          >
            <div className="w-[200px] h-[100px] flex items-center justify-center bg-[var(--color-surface-subtle)] border border-dashed border-[var(--color-border-default)] rounded-[var(--radius-md)] text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
              Right-click here
            </div>
          </ContextMenu>
        </VStack>

        {/* Click Trigger */}
        <VStack gap={3}>
          <Label>Click trigger</Label>
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
        </VStack>

        {/* With Submenu */}
        <VStack gap={3}>
          <Label>With submenu</Label>
          <ContextMenu
            trigger="click"
            items={[
              {
                id: 'new',
                label: 'New',
                submenu: [
                  { id: 'new-file', label: 'File', onClick: () => {} },
                  { id: 'new-folder', label: 'Folder', onClick: () => {} },
                ],
              },
              { id: 'open', label: 'Open', onClick: () => {} },
              { id: 'save', label: 'Save', onClick: () => {}, divider: true },
              {
                id: 'export',
                label: 'Export',
                submenu: [
                  { id: 'export-pdf', label: 'PDF', onClick: () => {} },
                  { id: 'export-csv', label: 'CSV', onClick: () => {} },
                  { id: 'export-json', label: 'JSON', onClick: () => {} },
                ],
              },
            ]}
          >
            <Button variant="outline" size="sm">
              Menu with Submenu
            </Button>
          </ContextMenu>
        </VStack>

        {/* Status Variants */}
        <VStack gap={3}>
          <Label>Status variants</Label>
          <ContextMenu
            trigger="click"
            items={[
              { id: 'item1', label: 'Default item', onClick: () => {} },
              { id: 'item2', label: 'Another item', onClick: () => {}, divider: true },
              {
                id: 'danger1',
                label: 'Warning action',
                status: 'danger',
                onClick: () => {},
              },
              {
                id: 'danger2',
                label: 'Delete',
                status: 'danger',
                onClick: () => {},
              },
            ]}
          >
            <Button variant="outline" size="sm">
              Show status variants
            </Button>
          </ContextMenu>
        </VStack>
      </VStack>
    </ComponentPageTemplate>
  );
}
