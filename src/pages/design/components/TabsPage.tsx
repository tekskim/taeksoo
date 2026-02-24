import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Tabs, TabList, Tab, TabPanel, VStack } from '@/design-system';

function CapsuleTabDemo() {
  const [selected, setSelected] = useState<'left' | 'right'>('left');

  return (
    <div className="inline-flex gap-2 p-1 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[8px] w-fit">
      <button
        onClick={() => setSelected('left')}
        className={`
          min-w-[80px] px-[10px] py-[6px] rounded-[6px] text-[length:var(--font-size-12)] font-medium leading-[var(--line-height-18)] text-center transition-all
          ${
            selected === 'left'
              ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)] shadow-sm'
              : 'bg-transparent border border-transparent text-[var(--color-text-default)]'
          }
        `}
      >
        left
      </button>
      <button
        onClick={() => setSelected('right')}
        className={`
          min-w-[80px] px-[10px] py-[6px] rounded-[6px] text-[length:var(--font-size-12)] font-medium leading-[var(--line-height-18)] text-center transition-all
          ${
            selected === 'right'
              ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)] shadow-sm'
              : 'bg-transparent border border-transparent text-[var(--color-text-default)]'
          }
        `}
      >
        right
      </button>
    </div>
  );
}

const tabsProps: PropDef[] = [
  { name: 'value', type: 'string', required: false, description: 'Controlled active tab' },
  { name: 'defaultValue', type: 'string', required: false, description: 'Default active tab' },
  {
    name: 'onChange',
    type: '(value: string) => void',
    required: false,
    description: 'Tab change handler',
  },
  { name: 'size', type: "'sm' | 'md'", default: "'sm'", required: false, description: 'Tab size' },
  {
    name: 'variant',
    type: "'underline' | 'boxed'",
    default: "'underline'",
    required: false,
    description: 'Tab style',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'TabList and TabPanel children',
  },
];

const tabProps: PropDef[] = [
  { name: 'value', type: 'string', required: true, description: 'Tab identifier' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Tab label content' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Disabled state',
  },
];

export function TabsPage() {
  return (
    <ComponentPageTemplate
      title="Tabs"
      description="Tabs for navigation between views with underline and boxed variants"
      preview={
        <ComponentPreview
          code={`<Tabs defaultValue="tab1" size="sm">
  <TabList>
    <Tab value="tab1">menu 1</Tab>
    <Tab value="tab2">menu 2</Tab>
    <Tab value="tab3">menu 3</Tab>
  </TabList>
</Tabs>`}
        >
          <Tabs defaultValue="tab1" size="sm">
            <TabList>
              <Tab value="tab1">menu 1</Tab>
              <Tab value="tab2">menu 2</Tab>
              <Tab value="tab3">menu 3</Tab>
            </TabList>
          </Tabs>
        </ComponentPreview>
      }
      usage={{
        code: `import { Tabs, TabList, Tab, TabPanel } from '@/design-system';

<Tabs defaultValue="overview" size="sm">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>
  <TabPanel value="overview">Overview content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Variants</Label>
            <VStack gap={4}>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Underline (default)
                </span>
                <Tabs defaultValue="tab1" size="sm">
                  <TabList>
                    <Tab value="tab1">menu 1</Tab>
                    <Tab value="tab2">menu 2</Tab>
                    <Tab value="tab3">menu 3</Tab>
                  </TabList>
                </Tabs>
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Capsule tab
                </span>
                <CapsuleTabDemo />
              </VStack>
            </VStack>
          </VStack>
          <VStack gap={3}>
            <Label>Sizes</Label>
            <VStack gap={4}>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Small (12px)
                </span>
                <Tabs defaultValue="tab1" size="sm">
                  <TabList>
                    <Tab value="tab1">menu 1</Tab>
                    <Tab value="tab2">menu 2</Tab>
                    <Tab value="tab3">menu 3</Tab>
                  </TabList>
                </Tabs>
              </VStack>
            </VStack>
          </VStack>
          <VStack gap={3}>
            <Label>Interactive example</Label>
            <Tabs defaultValue="overview" size="sm">
              <TabList>
                <Tab value="overview">Overview</Tab>
                <Tab value="settings">Settings</Tab>
                <Tab value="logs">Logs</Tab>
                <Tab value="disabled" disabled>
                  Disabled
                </Tab>
              </TabList>
              <TabPanel value="overview">
                <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                  <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                    Overview panel content goes here.
                  </p>
                </div>
              </TabPanel>
              <TabPanel value="settings">
                <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                  <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                    Settings panel content goes here.
                  </p>
                </div>
              </TabPanel>
              <TabPanel value="logs">
                <div className="p-4 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                  <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
                    Logs panel content goes here.
                  </p>
                </div>
              </TabPanel>
            </Tabs>
          </VStack>
        </VStack>
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={4}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Variant 선택 기준
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Variant
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        사용 조건
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        underline
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        상세 페이지 내 콘텐츠 전환 (기본값). Detail Page의 섹션 구분에 사용.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        boxed
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        폼 내부 또는 카드 내 옵션 전환 시 사용. 시각적으로 더 독립적인 영역 구분.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  탭 수는 <strong>2~7개</strong>를 권장합니다. 7개 초과 시 스크롤 또는 구조 재설계를
                  검토합니다.
                </li>
                <li>탭 전환 시 입력값은 유지됩니다 (Create/Edit 폼에서 탭 간 이동 시).</li>
                <li>탭 라벨은 간결한 명사형으로 작성합니다 (Details, Volumes, Networking).</li>
              </ul>
            </VStack>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>gap: 8px</code> · <code>min-width: 80px</code> · <code>padding-x: 12px</code> ·{' '}
          <code>indicator: 2px</code> · <code>boxed-padding: 24×8px</code>
        </div>
      }
      apiReference={tabsProps}
      subComponentApis={[{ name: 'Tab', props: tabProps }]}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          Tabs use role="tablist", role="tab", role="tabpanel". Arrow keys navigate between tabs.
          aria-selected indicates active tab.
        </p>
      }
      relatedLinks={[
        { label: 'TabBar', path: '/design/components/tabbar', description: 'Browser-style tabs' },
        {
          label: 'Detail Page',
          path: '/design/patterns/common',
          description: 'Detail page with tabs',
        },
        {
          label: 'Section Card',
          path: '/design/components/section-card',
          description: 'Content sections',
        },
      ]}
    />
  );
}
