import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
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

const menuItemProps: PropDef[] = [
  { name: 'icon', type: 'ReactNode', required: false, description: 'Icon content' },
  { name: 'label', type: 'string', required: true, description: 'Menu item label' },
  {
    name: 'active',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Active state',
  },
  { name: 'onClick', type: '() => void', required: false, description: 'Click handler' },
];

export function MenuPage() {
  return (
    <ComponentPageTemplate
      title="Menu"
      description="앱 내 페이지 이동을 위한 사이드바 내비게이션 컴포넌트로, 사용자가 현재 위치를 파악하고 원하는 페이지로 이동할 수 있도록 돕는다. 메뉴 아이템은 섹션으로 그룹화할 수 있으며, 하위 메뉴를 포함하는 Collapsible 구조를 지원한다."
      whenToUse={[
        '앱 내 주요 페이지 간 이동이 필요할 때',
        '관련 메뉴 항목을 섹션 단위로 그룹화하여 구조적으로 제공해야 할 때',
        '사용자가 현재 위치(활성 페이지)를 명확히 인지해야 할 때',
      ]}
      whenNotToUse={[
        '페이지 내 콘텐츠 탐색(앵커 이동 등)에는 사용하지 않는다. 이 경우 On-page navigation을 사용한다.',
        '단순히 2~3개의 항목만 있는 경우 Tab Bar 또는 Segmented Control을 고려한다.',
      ]}
      keyboardInteractions={[
        { key: '↑ / ↓', description: 'Navigate between menu items' },
        { key: 'Enter / Space', description: 'Activate menu item or toggle collapsible section' },
        { key: 'Tab', description: 'Move focus to next focusable element' },
        { key: 'Escape', description: 'Close submenu or collapsible section' },
      ]}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          Menu uses <code>role="navigation"</code> with <code>aria-label</code> for the nav
          container. Active menu items use <code>aria-current="page"</code>. Collapsible sections
          use <code>aria-expanded</code> to indicate their open/closed state.
        </p>
      }
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
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">1. Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        구분
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">기본 (Default)</td>
                      <td className="py-2">섹션 없이 메뉴 아이템만 나열하는 단순 목록 형태</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">섹션 그룹 (Grouped)</td>
                      <td className="py-2">관련 메뉴를 섹션 타이틀로 그룹화한 형태</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Collapsible 섹션</td>
                      <td className="py-2">하위 메뉴를 포함하며 접힘/펼침이 가능한 형태</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                2. Composition (구성 요소)
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">전체 구조:</p>
              <pre className="text-body-sm text-[var(--color-text-muted)] bg-[var(--color-surface-default)] p-3 rounded-[var(--radius-md)] overflow-x-auto">
                {`사이드바
└── Menu
    ├── Menu Item (단독)
    └── Section
        ├── Section Title (선택)
        ├── Menu Item
        │   └── Sub Menu Item (Collapsible인 경우)
        └── Divider (선택)`}
              </pre>
              <h5 className="text-heading-h7 text-[var(--color-text-default)]">Menu Item</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">a. 아이콘 (선택)</td>
                      <td className="py-2">
                        메뉴 항목을 시각적으로 식별하는 아이콘. 전체 메뉴 아이템에 일관되게
                        사용하거나 전체 생략
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">b. 레이블</td>
                      <td className="py-2">페이지 또는 기능 이름을 나타내는 텍스트</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">c. 확장 아이콘 (선택)</td>
                      <td className="py-2">
                        Collapsible 섹션의 경우 펼침/접힘 상태를 나타내는 Chevron 아이콘
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5 className="text-heading-h7 text-[var(--color-text-default)]">Section</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">a. 섹션 타이틀</td>
                      <td className="py-2">
                        해당 섹션의 그룹명. 시각적으로 구분되는 작은 텍스트로 표시
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">b. 메뉴 아이템 목록</td>
                      <td className="py-2">섹션에 속하는 Menu Item의 집합</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h5 className="text-heading-h7 text-[var(--color-text-default)]">Design Tokens</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        토큰
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        값
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">item.padding</td>
                      <td className="py-2">8×6px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">item.gap</td>
                      <td className="py-2">6px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">item.radius</td>
                      <td className="py-2">6px (md)</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">section.padding</td>
                      <td className="py-2">8×4px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">section.gap</td>
                      <td className="py-2">16px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">section.title-gap</td>
                      <td className="py-2">6px</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">divider.margin</td>
                      <td className="py-2">8px</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">3. States</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        상태
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        시각적 처리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Default</td>
                      <td className="py-2 pr-4">기본 상태</td>
                      <td className="py-2">배경 없음, 기본 텍스트 색상</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Hover</td>
                      <td className="py-2 pr-4">마우스 포인터가 아이템 위에 올라간 상태</td>
                      <td className="py-2">배경 강조, 커서 pointer</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Active</td>
                      <td className="py-2 pr-4">현재 활성화된(현재 페이지에 해당하는) 아이템</td>
                      <td className="py-2">배경 강조색, 텍스트·아이콘 색상 변경</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">4. Behavior</h4>
              <h5 className="text-heading-h7 text-[var(--color-text-default)]">내비게이션</h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  메뉴 아이템 클릭 시 해당 페이지로 이동하며, 해당 아이템이 Selected 상태로
                  전환된다.
                </li>
                <li>페이지 이동 후 이전 Selected 아이템은 Default 상태로 돌아간다.</li>
                <li>외부 링크로 이동하는 경우 아이콘(↗)으로 외부 링크임을 명시한다.</li>
              </ul>
              <h5 className="text-heading-h7 text-[var(--color-text-default)]">Collapsible 섹션</h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  Collapsible 섹션의 타이틀(또는 Chevron 아이콘) 클릭 시 하위 메뉴가 펼쳐지거나
                  접힌다.
                </li>
                <li>
                  기본 상태: 현재 선택된 페이지가 속한 섹션은 펼친 상태(expanded)로 초기 렌더링한다.
                </li>
                <li>
                  하위 메뉴 중 Selected 아이템이 있는 경우, 해당 섹션을 접어도 상위 섹션 타이틀에
                  Selected 표시(점 또는 색상)를 유지한다.
                </li>
                <li>
                  펼침/접힘 애니메이션: 높이 전환(height transition)을 사용하며, 지속 시간은 Motion
                  가이드라인을 따른다.
                </li>
              </ul>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={3}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                5. Usage Guidelines
              </h4>
              <div>
                <h5 className="text-heading-h7 text-[var(--color-text-default)] mb-2">Do ✅</h5>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    메뉴 아이템 레이블은 간결하고 명확하게 작성한다. 1~3단어가 이상적이며 동사보다
                    명사형을 권장한다.
                  </li>
                  <li>아이콘을 사용하는 경우 전체 아이템에 일관되게 적용한다.</li>
                  <li>관련 있는 메뉴끼리 섹션으로 묶어 인지 부하를 줄인다.</li>
                  <li>
                    사용자가 가장 자주 방문하는 페이지를 목록 상단 또는 첫 번째 섹션에 배치한다.
                  </li>
                  <li>
                    현재 페이지에 해당하는 아이템은 항상 Selected 상태로 표시하여 사용자가 현재
                    위치를 즉시 파악할 수 있게 한다.
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-heading-h7 text-[var(--color-text-default)] mb-2">
                  Don&apos;t ❌
                </h5>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>한 섹션에 7개 이상의 메뉴 아이템을 나열하지 않는다.</li>
                  <li>메뉴 아이템 레이블에 줄임말이나 약어를 남용하지 않는다.</li>
                  <li>3단계 이상의 Collapsible 중첩 구조는 사용하지 않는다.</li>
                  <li>비활성화(Disabled) 항목을 과도하게 사용하지 않는다.</li>
                  <li>Selected 상태를 여러 아이템에 동시에 적용하지 않는다.</li>
                </ul>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                6. Content Guidelines
              </h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>레이블</strong>: 페이지 또는 기능의 이름을 명사형으로 작성한다.
                </li>
                <li>
                  <strong>섹션 타이틀</strong>: 그룹 내 아이템을 포괄하는 카테고리명을 사용한다.
                  보통 1단어가 이상적이다.
                </li>
                <li>
                  <strong>대소문자</strong>: 영문 레이블은 Title Case를 기본으로 한다.
                </li>
                <li>
                  <strong>레이블 길이</strong>: 한 줄을 초과하지 않도록 작성한다.
                </li>
                <li>
                  <strong>언어</strong>: 앱의 언어 설정과 무관하게 메뉴 레이블과 섹션 타이틀은
                  영문으로 고정한다.
                </li>
              </ul>
            </VStack>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>item.padding: 8×6px</code> · <code>item.gap: 6px</code> ·{' '}
          <code>item.radius: 6px (md)</code> · <code>section.padding: 8×4px</code> ·{' '}
          <code>section.gap: 16px</code> · <code>section.title-gap: 6px</code> ·{' '}
          <code>divider.margin: 8px</code>
        </div>
      }
      apiReference={menuItemProps}
      relatedLinks={[
        { label: 'TopBar', path: '/design/components/topbar', description: 'App navigation' },
        { label: 'TabBar', path: '/design/components/tabbar', description: 'Tab navigation' },
        {
          label: 'Breadcrumb',
          path: '/design/components/breadcrumb',
          description: 'Path navigation',
        },
      ]}
    />
  );
}
