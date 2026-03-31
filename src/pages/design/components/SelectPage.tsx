import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { DosDonts } from '../_shared/DosDonts';
import { Select, VStack } from '@/design-system';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';

const SELECT_GUIDELINES = `## Overview

드롭다운 목록에서 하나의 옵션을 선택하는 입력 컴포넌트다.
옵션이 많아 화면에 모두 노출하기 어려운 경우, 접힌 상태로 공간을 절약하면서 선택 인터랙션을 제공한다.

---

## Variants

| 구분 | 설명 |
| --- | --- |
| Default | Placeholder 상태의 기본 Select |
| Value | 옵션이 선택된 상태 |
| Disabled | 비활성화 상태, 사용자 입력 불가 |
| Error | 유효성 검사 실패 상태 |

### Width Variants

| 구분 | 크기 |
| --- | --- |
| XS | 80px |
| SM | 160px |
| MD | 240px |
| LG | 320px |
| Half | 50% |
| Full | 100% |

---

## States

| 상태 | 설명 |
| --- | --- |
| Default | 기본 상태. Placeholder 텍스트 표시 |
| Focus | 키보드 포커스 또는 클릭 시. border 2px 강조 |
| Open (Expanded) | 드롭다운 메뉴 펼쳐진 상태 |
| Selected | 옵션 선택 완료 상태. 선택된 항목 텍스트 표시 |
| Disabled | 비활성화 상태. 입력 불가, 시각적으로 구분 |
| Error | 유효성 검사 실패. border 색상 변경 및 에러 메시지 표시 |

---

## Composition

### 1. Trigger 영역

| 요소 | 설명 |
| --- | --- |
| Placeholder / Selected Value | 선택된 값 또는 안내 텍스트 표시 |
| Chevron Icon (▼/▲) | 드롭다운 열림/닫힘 상태 표시 |

### 2. Dropdown Menu

| 요소 | 설명 |
| --- | --- |
| Option Item | 선택 가능한 항목. 현재 선택된 항목에는 체크 아이콘 표시 |
| Disabled Option | 선택 불가 항목. 시각적으로 구분 처리 |
| Scroll Area | 옵션이 10개 이상인 경우 스크롤 영역 내 탐색 |

### 3. Text (optional)

| 요소 | 설명 |
| --- | --- |
| Label | Select 상단에 위치하는 항목 명칭 |
| Helper Text | Select 하단에 위치하는 보조 설명 |
| Error Message | 유효성 검사 실패 시 표시되는 오류 메시지 |

### Design Tokens

| 속성 | 값 |
| --- | --- |
| Padding (Trigger) | 10 × 8px |
| Border Radius | 6px |
| Font Size | 12px |
| Item Padding | 10 × 6px |
| Item Font Size | 12px |
| Border Width | 1px (기본) → 2px (focus) |

---

## Behavior

### 드롭다운 열림/닫힘
- Trigger 클릭 시 드롭다운 메뉴 표시
- 옵션 선택 시 메뉴 닫히고 선택값 반영
- 메뉴 외부 영역 클릭 시 닫힘
- Esc 키 입력 시 닫힘

### 키보드 인터랙션

| 키 | 동작 |
| --- | --- |
| Enter / Space | 드롭다운 열기 / 선택 확정 |
| ↑ / ↓ | 옵션 포커스 이동 |
| Esc | 드롭다운 닫기 |
| Tab | 다음 포커스 영역으로 이동 (드롭다운 닫힘) |

### 드롭다운 위치
- 기본적으로 Trigger 하단에 표시
- 하단 공간이 부족한 경우 상단에 표시 (flip)

### 옵션 텍스트 말줄임
- 옵션 텍스트가 영역을 초과하는 경우 Truncate 말줄임 처리
- hover 시 tooltip으로 전체 텍스트 제공

---

## Usage Guidelines

- 선택지가 3~15개인 경우 Select를 사용한다. 2개 이하이면 Radio, 15개 초과이면 검색 가능한 Select(SearchSelect)를 고려한다.
- Boolean 값(On/Off, Yes/No)에는 Select 대신 Toggle 또는 Checkbox를 사용한다.
- 다중 선택이 필요한 경우 CheckboxGroup 또는 Multi-Select를 사용한다.
- 기본 선택값이 있는 경우 \`defaultValue\`로 명시하고, 선택 해제가 가능해야 하면 placeholder를 제공한다.
- 폼에서 사용 시 반드시 \`FormField\`로 감싸 label을 연결한다.

---

## Related

- Checkbox
- Radio Group
- Toggle
- Tooltip
`;

const selectOptions = [
  { value: 'active', label: 'Active' },
  { value: 'shutoff', label: 'Shutoff' },
  { value: 'building', label: 'Building' },
];

export function SelectPage() {
  return (
    <ComponentPageTemplate
      title="Select"
      description="드롭다운 목록에서 하나의 옵션을 선택하는 입력 컴포넌트. 옵션이 많아 화면에 모두 노출하기 어려운 경우, 접힌 상태로 공간을 절약하면서 선택 인터랙션을 제공한다."
      whenToUse={['옵션이 4개 이상이거나 가변적이며, 단일 선택이 필요한 경우']}
      whenNotToUse={[
        '하나의 옵션만 선택 가능한 경우 → Radio 사용',
        '옵션이 2~3개 고정인 경우 → Radio Group 사용',
        'On/Off의 즉각적인 상태 전환이 필요한 경우 → Toggle 사용',
        '다중 선택이 필요한 경우 → Checkbox Group 또는 Multi-Select 사용',
      ]}
      preview={
        <ComponentPreview
          code={`<Select placeholder="Select status" options={options} width="md" />`}
        >
          <Select placeholder="Select status" width="md" options={selectOptions} />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Dropdown Menu (Expanded)</Label>
            <div className="flex gap-6 items-start flex-wrap">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Default
                </span>
                <VStack gap={1} className="w-[200px]">
                  <button className="flex items-center justify-between gap-2 w-full h-[var(--input-height-md)] px-[var(--select-padding-x)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)] bg-[var(--select-bg)] border border-solid border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)] rounded-[var(--select-radius)] cursor-pointer">
                    <span className="text-body-md text-[var(--color-text-muted)]">
                      Select status
                    </span>
                    <IconChevronDown
                      size={16}
                      stroke={1.5}
                      className="text-[var(--color-text-default)] rotate-180"
                    />
                  </button>
                  <div className="w-full bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] overflow-hidden">
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                      Active
                    </div>
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                      Shutoff
                    </div>
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer">
                      Building
                    </div>
                  </div>
                </VStack>
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  With Selection
                </span>
                <VStack gap={1} className="w-[200px]">
                  <button className="flex items-center justify-between gap-2 w-full h-[var(--input-height-md)] px-[var(--select-padding-x)] text-[length:var(--select-font-size)] leading-[var(--select-line-height)] bg-[var(--select-bg)] border border-solid border-[var(--select-border-focus)] shadow-[0_0_0_1px_var(--select-border-focus)] rounded-[var(--select-radius)] cursor-pointer">
                    <span className="text-body-md text-[var(--color-text-default)]">Active</span>
                    <IconChevronDown
                      size={16}
                      stroke={1.5}
                      className="text-[var(--color-text-default)] rotate-180"
                    />
                  </button>
                  <div className="w-full bg-[var(--select-menu-bg)] border border-[var(--select-menu-border)] rounded-[var(--select-menu-radius)] shadow-[var(--select-menu-shadow)] overflow-hidden">
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] bg-[var(--select-item-selected-bg)] text-[var(--select-item-selected-text)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                      Active <IconCheck size={14} className="shrink-0" />
                    </div>
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer border-b border-[var(--color-border-subtle)]">
                      Shutoff
                    </div>
                    <div className="flex items-center justify-between px-[var(--select-item-padding-x)] py-[var(--select-item-padding-y)] text-body-md leading-[var(--select-item-line-height)] text-[var(--color-text-default)] hover:bg-[var(--select-item-hover-bg)] cursor-pointer">
                      Building
                    </div>
                  </div>
                </VStack>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Status</Label>
            <div className="flex gap-4 items-start flex-wrap">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Placeholder
                </span>
                <Select placeholder="Placeholder" width="md" options={selectOptions} />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Value
                </span>
                <Select
                  placeholder="Placeholder"
                  defaultValue="active"
                  width="md"
                  options={selectOptions}
                />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Disabled
                </span>
                <Select placeholder="Placeholder" disabled width="md" options={selectOptions} />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Error
                </span>
                <Select
                  placeholder="Placeholder"
                  error="Please select an option"
                  width="md"
                  options={selectOptions}
                />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>With Label & Helper</Label>
            <div className="flex gap-4 items-start">
              <Select
                label="Status"
                placeholder="Select status"
                width="md"
                options={selectOptions}
              />
              <Select
                label="Region"
                placeholder="Select region"
                helperText="Choose your preferred region"
                width="md"
                options={[
                  { value: 'kr', label: 'Korea' },
                  { value: 'us', label: 'United States' },
                  { value: 'jp', label: 'Japan' },
                ]}
              />
            </div>
          </VStack>

          <VStack gap={3}>
            <Label>Width variants</Label>
            <VStack gap={3}>
              <div className="flex gap-4 items-end">
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    XS (80px)
                  </span>
                  <Select
                    placeholder="Select"
                    width="xs"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    SM (160px)
                  </span>
                  <Select
                    placeholder="Select"
                    width="sm"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    MD (240px)
                  </span>
                  <Select
                    placeholder="Select"
                    width="md"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    LG (320px)
                  </span>
                  <Select
                    placeholder="Select"
                    width="lg"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
              </div>
              <VStack gap={3} className="w-full">
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    Half (50%)
                  </span>
                  <Select
                    placeholder="Select"
                    width="half"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
                <VStack gap={1}>
                  <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                    Full (100%)
                  </span>
                  <Select
                    placeholder="Select"
                    width="full"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'shutoff', label: 'Shutoff' },
                    ]}
                  />
                </VStack>
              </VStack>
            </VStack>
          </VStack>

          <VStack gap={3}>
            <Label>With Disabled Options</Label>
            <Select
              label="Instance type"
              placeholder="Select type"
              defaultValue="medium"
              options={[
                { value: 'small', label: 'Small (2 vCPU)' },
                { value: 'medium', label: 'Medium (4 vCPU)' },
                { value: 'large', label: 'Large (8 vCPU)', disabled: true },
                { value: 'xlarge', label: 'X-Large (16 vCPU)', disabled: true },
              ]}
              className="w-[240px]"
            />
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={SELECT_GUIDELINES} />
          <DosDonts
            doItems={[
              'Placeholder는 "Select [항목명]" 형태로 작성한다.',
              '기본 선택값이 있는 경우, 미리 설정하여 사용자 입력을 최소화한다.',
              '옵션이 10개 이상인 경우 스크롤 영역 내에서 탐색한다.',
              '옵션 목록은 논리적 순서로 정렬한다.',
              '선택이 선택 사항(optional)인 경우, None 옵션을 제공한다.',
              '연관된 옵션이 많은 경우 옵션 그룹(Option Group)으로 묶어 제공한다.',
            ]}
            dontItems={[
              '옵션이 3개 이하 고정인 경우 Select를 사용하지 않는다 (Radio Group 사용).',
              'Select 내부 옵션에 복잡한 레이아웃을 넣지 않는다.',
              '옵션 목록이 동적으로 변경되면서 현재 선택값이 사라지게 하지 않는다.',
              '페이지 최초 진입 시 드롭다운이 자동으로 열린 상태로 표시하지 않는다.',
            ]}
          />
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          padding: 10×8px · radius: 6px · font: 12px · item: 10×6px, 12px · border: 1px → 2px focus
        </div>
      }
      relatedLinks={[
        { label: 'Checkbox', path: '/design/components/checkbox' },
        { label: 'Radio', path: '/design/components/radio' },
        { label: 'Toggle', path: '/design/components/toggle' },
        { label: 'Tooltip', path: '/design/components/tooltip' },
      ]}
    />
  );
}
