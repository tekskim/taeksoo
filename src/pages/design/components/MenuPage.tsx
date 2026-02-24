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
      description="Navigation menu with sections, items, and dividers"
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
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>사이드바 네비게이션에서 앱 내 페이지 이동에 사용합니다.</li>
              <li>
                <strong>섹션 그룹</strong>: 관련 메뉴를 섹션 타이틀로 그룹화합니다.
              </li>
              <li>
                <strong>Collapsible 섹션</strong>: 하위 메뉴가 있는 섹션은 접힘/펼침이 가능합니다.
              </li>
              <li>
                <strong>활성 상태</strong>: 현재 페이지에 해당하는 메뉴 아이템을 시각적으로
                강조합니다.
              </li>
            </ul>
          </VStack>
        </div>
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
