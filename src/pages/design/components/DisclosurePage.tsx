import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { Label } from '../../design-system-sections/HelperComponents';
import { Disclosure, VStack } from '@/design-system';

export function DisclosurePage() {
  return (
    <ComponentPageTemplate
      title="Disclosure"
      description="Expandable/collapsible content sections"
      relatedLinks={[
        {
          label: 'Section card',
          path: '/design/components/section-card',
          description: 'Container for grouping related content',
        },
        {
          label: 'Detail header',
          path: '/design/components/detail-header',
          description: 'Page header for resource detail views',
        },
      ]}
    >
      <VStack gap={8}>
        <VStack gap={3}>
          <Label>사용 정책</Label>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
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
            </VStack>
          </div>
        </VStack>

        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>gap: 6px</code> · <code>icon: 12px</code> ·{' '}
            <code>font: 14px / 20px / medium</code>
          </div>
        </VStack>

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
    </ComponentPageTemplate>
  );
}
