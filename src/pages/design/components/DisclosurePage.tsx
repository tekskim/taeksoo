import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Disclosure, VStack } from '@/design-system';

const disclosureProps: PropDef[] = [
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Default open state',
  },
  { name: 'open', type: 'boolean', required: false, description: 'Controlled open state' },
  {
    name: 'onChange',
    type: '(open: boolean) => void',
    required: false,
    description: 'State change handler',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'Trigger + Panel components',
  },
];

export function DisclosurePage() {
  return (
    <ComponentPageTemplate
      title="Disclosure"
      description="Expandable/collapsible content sections"
      whenToUse={[
        'FAQ, 도움말 등 접기/펼치기가 필요한 콘텐츠를 표시할 때',
        '선택적 세부 정보를 기본적으로 숨기고 사용자 요청 시 표시할 때',
        '긴 콘텐츠를 섹션별로 나누어 화면 공간을 절약할 때',
      ]}
      whenNotToUse={[
        '항상 표시되어야 하는 중요한 정보인 경우 → SectionCard 사용',
        '탭 간 전환이 필요한 경우 → Tabs 사용',
        '단계별 진행이 필요한 경우 → Wizard(SectionCard) 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<Disclosure defaultOpen>
  <Disclosure.Trigger>Volume details</Disclosure.Trigger>
  <Disclosure.Panel>
    <div>Content here</div>
  </Disclosure.Panel>
</Disclosure>`}
        >
          <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4 w-full max-w-md">
            <Disclosure defaultOpen>
              <Disclosure.Trigger>Volume details</Disclosure.Trigger>
              <Disclosure.Panel>
                <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                  <p>Name: vol-12345</p>
                  <p>Size: 100 GiB</p>
                  <p>Status: Available</p>
                </div>
              </Disclosure.Panel>
            </Disclosure>
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { Disclosure } from '@/design-system';

<Disclosure defaultOpen>
  <Disclosure.Trigger>Section title</Disclosure.Trigger>
  <Disclosure.Panel>
    <div>Content</div>
  </Disclosure.Panel>
</Disclosure>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>States</Label>
            <div className="flex items-center gap-12">
              <Disclosure>
                <Disclosure.Trigger>Collapsed</Disclosure.Trigger>
              </Disclosure>
              <Disclosure defaultOpen>
                <Disclosure.Trigger>Expanded</Disclosure.Trigger>
              </Disclosure>
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>With content</Label>
            <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
              <Disclosure defaultOpen>
                <Disclosure.Trigger>Volume details</Disclosure.Trigger>
                <Disclosure.Panel>
                  <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                    <p>Name: vol-12345</p>
                    <p>Size: 100 GiB</p>
                    <p>Status: Available</p>
                  </div>
                </Disclosure.Panel>
              </Disclosure>
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Multiple disclosures</Label>
            <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] divide-y divide-[var(--color-border-default)]">
              <div className="p-4">
                <Disclosure>
                  <Disclosure.Trigger>Section 1</Disclosure.Trigger>
                  <Disclosure.Panel>
                    <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                      Content for section 1
                    </div>
                  </Disclosure.Panel>
                </Disclosure>
              </div>
              <div className="p-4">
                <Disclosure>
                  <Disclosure.Trigger>Section 2</Disclosure.Trigger>
                  <Disclosure.Panel>
                    <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                      Content for section 2
                    </div>
                  </Disclosure.Panel>
                </Disclosure>
              </div>
              <div className="p-4">
                <Disclosure defaultOpen>
                  <Disclosure.Trigger>Section 3 (Default Open)</Disclosure.Trigger>
                  <Disclosure.Panel>
                    <div className="mt-3 pl-[18px] text-[length:var(--font-size-12)] text-[var(--color-text-subtle)]">
                      Content for section 3
                    </div>
                  </Disclosure.Panel>
                </Disclosure>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={4}>
          <h3 className="text-heading-h4 text-[var(--color-text-default)]">Usage Guidelines</h3>
          <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed">
            <ul className="list-disc pl-5 space-y-1">
              <li>Create/Edit 페이지에서 설정 카드의 접힘/펼침에 사용합니다.</li>
              <li>
                <strong>기본 상태</strong>: 필수 입력이 있는 섹션은 기본 펼침, 선택 사항만 있는
                섹션은 기본 접힘. 필수+선택 혼합 시 기본 펼침.
              </li>
              <li>접힌 상태에서도 섹션의 입력 상태(완료/미완료/오류)를 시각적으로 표시합니다.</li>
              <li>
                <strong>중첩</strong>: Disclosure 내부에 또 다른 Disclosure를 중첩하지 않습니다
                (1단계만).
              </li>
              <li>접힘/펼침 전환 시 부드러운 애니메이션(200~300ms)을 적용합니다.</li>
            </ul>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <span className="font-mono">gap: 6px</span> ·{' '}
          <span className="font-mono">icon: 12px</span> ·{' '}
          <span className="font-mono">font: 14px / 20px / medium</span>
        </div>
      }
      apiReference={disclosureProps}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          Disclosure uses button for trigger with aria-expanded. Panel content is associated via
          aria-controls. Enter/Space toggles.
        </p>
      }
      relatedLinks={[
        {
          label: 'Section card',
          path: '/design/patterns/section-card',
          description: 'Container for grouping related content',
        },
        {
          label: 'Detail header',
          path: '/design/patterns/detail-header',
          description: 'Page header for resource detail views',
        },
      ]}
    />
  );
}
