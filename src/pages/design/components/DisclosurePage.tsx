import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { Disclosure, VStack } from '@/design-system';

const DISCLOSURE_GUIDELINES = `## Overview

Disclosure는 **레이블(Label)과 Chevron 아이콘으로 구성된 토글 트리거**로, 클릭 시 하위 콘텐츠(Panel)를 펼치거나 접는 컴포넌트이다. Form 내 복잡한 설정 그룹이나 페이지 영역의 콘텐츠를 접어 화면 밀도를 조절하는 데 사용한다.

---

## Composition

| 요소 | 설명 | 스펙 |
| --- | --- | --- |
| ① Chevron Icon | 접힌/펼침 상태를 시각적으로 전달하는 아이콘 | Tabler 아이콘: \`IconChevronRight\`(접힌) / \`IconChevronDown\`(펼침) |
| ② Label | 그룹의 제목 또는 헤더를 표시하는 텍스트 | \`text-label-lg\` (13px / line-height 18px) |
| ③ Panel | 펼침 시 노출되는 하위 콘텐츠 영역 | 펼침(노출) 상태에서만 렌더링 |

### Visual Layout

\`\`\`
[ Collapsed (접힌) 상태 ]
┌─────────────────────────────────────────────────────────────┐
│  ① ▶  ② Section Label                                      │
└─────────────────────────────────────────────────────────────┘

[ Expanded (펼침) 상태 ]
┌─────────────────────────────────────────────────────────────┐
│  ① ▼  ② Section Label                                      │
│  ─────────────────────────────────────────────────────────  │
│  ③ Panel Content Area                                       │
│     (Form Fields, 입력 요소 등)                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## States

| 상태 | 설명 | 비주얼 |
| --- | --- | --- |
| Default (Collapsed) | Panel이 접힌 상태 (Disclosure 기본 상태) | \`IconChevronRight\` / 기본 텍스트 색상 |
| Default (Expanded) | Panel이 펼쳐진 상태 | \`IconChevronDown\` / 기본 텍스트 색상 |
| Hover | Trigger 영역에 마우스가 올라갈 때 | Label 색상이 subtle 톤으로 전환 (약 150ms 트랜지션) |
| Disabled | 토글 상호작용이 비활성화된 상태 | 컴포넌트 비활성화 스펙 준수 |

---

## Behavior

### 1) 토글 동작

- Trigger(Label + Chevron) 클릭 시 Panel을 펼치거나 접는다.
- **아이콘 스왑**: \`IconChevronRight\`(접힌)↔\`IconChevronDown\`(펼침) 아이콘을 교체한다. rotate 애니메이션을 사용하지 않는다.

### 2) 호버 상태

- Trigger 영역에 호버 시 Label 색상이 subtle 텍스트 색으로 변경된다.
- 색상 변환에는 **150ms 트랜지션**을 적용한다.

### 3) 접근성

- Trigger는 키보드 조작(Enter/Space)이 동작하도록 한다.
- \`aria-expanded\`로 Panel의 펼침/접힌 상태를 제공한다.

---

## Related

| 이름 | 유형 | 비고 |
| --- | --- | --- |
| Dynamic form fields | Pattern | Disclosure를 Trigger로 사용하는 상위 패턴 |
| Form Field | Component | Panel 내부에 구성되는 입력 요소 |
| Icon | Foundation | Chevron 아이콘 스펙 (Tabler) |
`;

export function DisclosurePage() {
  return (
    <ComponentPageTemplate
      title="Disclosure"
      description="레이블(Label)과 Chevron 아이콘으로 구성된 토글 트리거로, 클릭 시 하위 콘텐츠(Panel)를 펼치거나 접는 컴포넌트이다. Form 내 복잡한 설정 그룹이나 페이지 영역의 콘텐츠를 접어 화면 밀도를 조절하는 데 사용한다."
      whenToUse={[
        '관련 입력 필드 또는 설정 항목을 하나의 논리적 그룹으로 묶어 보여줘야 할 때',
        'Form이 길어져 전체 레이아웃을 축소하는 폴딩 패턴이 필요할 때',
        'Dynamic Form Fields 패턴에서 Disclosure with Nested Grid 구성의 상위 트리거로 사용할 때',
        '콘텐츠의 노출/숨김 상태를 사용자가 제어할 수 있어야 할 때',
      ]}
      whenNotToUse={[
        '항상 모든 콘텐츠가 보여야 하는 영역(→ 접을 필요가 없는 경우)',
        '탭(Tab) 또는 스텝퍼(Stepper)가 더 적합한 다단계 흐름',
        'Accordion이 요구되는 상호 배타적(Exclusive) 토글 구조',
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
        <VStack gap={6}>
          <NotionRenderer markdown={DISCLOSURE_GUIDELINES} />
          <DosDonts
            doItems={[
              'Form 내 5개 이상의 입력 필드로 구성된 그룹에 사용한다.',
              'Label은 해당 그룹이 무엇인지 명확하게 작성한다.',
            ]}
            dontItems={['레이블에 긴 문장(장문)을 사용하지 않는다.']}
          />
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          gap: 6px · icon: 12px · font: 14px / 20px / medium
        </div>
      }
      relatedLinks={[
        { label: 'Dynamic Form Fields', path: '/design/patterns/dynamic-form-fields' },
        { label: 'Form Field', path: '/design/patterns/form-field-pattern' },
        { label: 'Icons', path: '/design/foundation/icons' },
      ]}
    />
  );
}
