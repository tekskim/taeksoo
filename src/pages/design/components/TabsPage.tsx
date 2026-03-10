import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Tabs, TabList, Tab, TabPanel, VStack } from '@/design-system';

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

function CapsuleTabDemo() {
  const [selected, setSelected] = useState<'left' | 'right'>('left');

  return (
    <div className="inline-flex gap-2 p-1 bg-[var(--color-surface-subtle)] shadow-[inset_0_0_0_1px_var(--color-border-default)] rounded-[8px] w-fit">
      <button
        onClick={() => setSelected('left')}
        className={`
          min-w-[80px] px-[10px] py-[6px] rounded-[6px] text-[length:var(--font-size-12)] font-medium leading-[var(--line-height-18)] text-center transition-all
          ${
            selected === 'left'
              ? 'bg-[var(--color-surface-default)] shadow-[inset_0_0_0_1px_var(--color-border-default),0_1px_2px_0_rgba(0,0,0,0.05)] text-[var(--color-action-primary)]'
              : 'bg-transparent text-[var(--color-text-default)]'
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
              ? 'bg-[var(--color-surface-default)] shadow-[inset_0_0_0_1px_var(--color-border-default),0_1px_2px_0_rgba(0,0,0,0.05)] text-[var(--color-action-primary)]'
              : 'bg-transparent text-[var(--color-text-default)]'
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

function TabsGuidelines() {
  return (
    <VStack gap={10}>
      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <Prose>
          <p>같은 컴포넌트가 2가지 이상의 형태로 존재하므로 포함한다.</p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[180px]">Variant</Th>
              <Th>설명</Th>
              <Th>사용 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Underline</strong> (default)
              </Td>
              <Td>선택된 탭 하단에 인디케이터 라인을 표시하는 기본형</Td>
              <Td>상세 페이지 내 콘텐츠 전환 (기본값). Detail Page의 섹션 구분에 사용</Td>
            </tr>
            <tr>
              <Td>
                <strong>Boxed</strong>
              </Td>
              <Td>선택된 탭을 박스 형태로 강조하는 캡슐형</Td>
              <Td>
                폼 내부 또는 카드 내 옵션 전환 시 사용. 시각적으로 더 독립적인 영역 구분이 필요할 때
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[ Tab Item 1 (active) ]  [ Tab Item 2 ]  [ Tab Item 3 ]
──────────────────────`}</pre>
        </div>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Tab Item</strong>
              </Td>
              <Td>개별 탭 단위. 라벨 텍스트로 구성되며 선택 상태를 시각적으로 구분</Td>
            </tr>
            <tr>
              <Td>
                <strong>Active Indicator</strong>
              </Td>
              <Td>
                Underline variant의 경우 선택된 탭 하단에 표시되는 2px 인디케이터 라인. Boxed
                variant의 경우 박스 배경으로 대체
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>Tab List</strong>
              </Td>
              <Td>전체 탭을 감싸는 컨테이너. 가로 방향으로 배치되며 하단 구분선(Divider)을 포함</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* States */}
      <VStack gap={4}>
        <SectionTitle>States</SectionTitle>
        <Prose>
          <p>사용자가 직접 클릭·포커스·키보드 인터랙션을 하는 컴포넌트이므로 포함한다.</p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">State</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>비활성 탭의 기본 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Active (Selected)</strong>
              </Td>
              <Td>현재 선택된 탭. 인디케이터 또는 박스로 시각적으로 구분</Td>
            </tr>
            <tr>
              <Td>
                <strong>Hover</strong>
              </Td>
              <Td>마우스 오버 시 텍스트 색상 또는 배경 변화로 피드백 제공</Td>
            </tr>
            <tr>
              <Td>
                <strong>Focused</strong>
              </Td>
              <Td>키보드 포커스 상태. 접근성을 위한 포커스 링(Focus Ring) 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Disabled</strong>
              </Td>
              <Td>비활성화된 탭. 클릭 불가. 텍스트 색상을 흐리게 처리하여 구분</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={4}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>탭 전환 정책</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>탭 클릭 시 해당 탭의 콘텐츠 패널로 즉시 전환한다</li>
              <li>탭 전환 시 폼(Form) 내 입력값은 유지된다 (Create / Edit 폼에서 탭 간 이동 시)</li>
              <li>탭 전환은 페이지 리로드 없이 클라이언트 측에서 처리한다</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>키보드 인터랙션</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[200px]">키</Th>
                <Th>동작</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <kbd>Tab</kbd>
                </Td>
                <Td>Tab List 진입 및 이탈</Td>
              </tr>
              <tr>
                <Td>
                  <kbd>←</kbd> / <kbd>→</kbd>
                </Td>
                <Td>이전 / 다음 탭 항목으로 포커스 이동</Td>
              </tr>
              <tr>
                <Td>
                  <kbd>Enter</kbd> / <kbd>Space</kbd>
                </Td>
                <Td>포커스된 탭 선택</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>반응형 대응</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>탭 수가 많아 가로 공간이 부족한 경우, 가로 스크롤(Overflow Scroll)을 적용한다</li>
              <li>
                탭 목록이 영역을 초과할 경우 양 끝에 스크롤 힌트(Fade 처리)를 시각적으로 표시한다
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '탭 수는 2~7개로 한다. 콘텐츠 섹션이 뚜렷이 구분될 때 탭으로 분리한다.',
            '탭 라벨은 간결한 명사형으로 작성한다 (예: Details, Volumes, Networking).',
            'Underline은 Detail Page의 섹션 구분에, Boxed는 폼이나 카드 내 독립적인 옵션 전환에 사용한다.',
            '탭 전환 시 폼 내 입력값은 유지한다.',
          ]}
          dontItems={[
            '탭 라벨을 동사형이나 문장형으로 작성하지 않는다.',
            'Underline과 Boxed variant를 동일 페이지에서 혼용하지 않는다.',
            '탭 간에 순서 종속 관계가 있거나 콘텐츠가 서로 연관될 경우 탭 대신 Step 또는 Accordion 사용을 검토한다.',
            '페이지 간 이동을 위한 네비게이션 목적으로 탭을 사용하지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

export function TabsPage() {
  return (
    <ComponentPageTemplate
      title="Tabs"
      description="뷰(View) 간 전환을 위한 탐색 컴포넌트로, 동일한 콘텐츠 계층 내에서 섹션을 구분하거나 옵션 간 전환에 사용한다."
      whenToUse={[
        '하나의 페이지 내에서 2개 이상의 콘텐츠 섹션을 구분하여 표시할 때',
        '폼(Form) 내부 또는 카드 내 옵션 전환이 필요할 때',
      ]}
      whenNotToUse={[
        '탭이 1개뿐인 경우 — 탭 대신 단순 레이블 또는 헤딩을 사용한다',
        '탭 간 이동이 독립적인 페이지 전환을 의미하는 경우 — Navigation을 사용한다',
        '탭이 7개를 초과하는 경우 — 구조 재설계 또는 드롭다운 방식을 검토한다',
      ]}
      preview={
        <ComponentPreview
          code={`<Tabs defaultValue="tab1" size="sm">
  <TabList>
    <Tab value="tab1">Details</Tab>
    <Tab value="tab2">Volumes</Tab>
    <Tab value="tab3">Networking</Tab>
  </TabList>
</Tabs>`}
        >
          <Tabs defaultValue="tab1" size="sm">
            <TabList>
              <Tab value="tab1">Details</Tab>
              <Tab value="tab2">Volumes</Tab>
              <Tab value="tab3">Networking</Tab>
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
            <VStack gap={1}>
              <Label>Underline (default)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                선택된 탭 하단에 인디케이터 라인을 표시하는 기본형. Detail Page의 섹션 구분에 사용.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Tabs defaultValue="tab1" size="sm">
                <TabList>
                  <Tab value="tab1">Details</Tab>
                  <Tab value="tab2">Volumes</Tab>
                  <Tab value="tab3">Networking</Tab>
                </TabList>
              </Tabs>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Boxed</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                선택된 탭을 박스 형태로 강조하는 캡슐형. 폼 내부 또는 카드 내 옵션 전환에 사용.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <CapsuleTabDemo />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>States</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Default, Active, Hover, Focused, Disabled 상태.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Tabs defaultValue="tab1" size="sm">
                <TabList>
                  <Tab value="tab1">Active</Tab>
                  <Tab value="tab2">Default</Tab>
                  <Tab value="tab3">Default</Tab>
                  <Tab value="disabled" disabled>
                    Disabled
                  </Tab>
                </TabList>
              </Tabs>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Interactive example</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                탭 클릭 시 해당 콘텐츠 패널로 즉시 전환. 페이지 리로드 없이 처리.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Tabs defaultValue="overview" size="sm">
                <TabList>
                  <Tab value="overview">Overview</Tab>
                  <Tab value="settings">Settings</Tab>
                  <Tab value="logs">Logs</Tab>
                </TabList>
                <TabPanel value="overview">
                  <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] mt-3">
                    <p className="text-body-md text-[var(--color-text-default)]">
                      Overview panel content goes here.
                    </p>
                  </div>
                </TabPanel>
                <TabPanel value="settings">
                  <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] mt-3">
                    <p className="text-body-md text-[var(--color-text-default)]">
                      Settings panel content goes here.
                    </p>
                  </div>
                </TabPanel>
                <TabPanel value="logs">
                  <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] mt-3">
                    <p className="text-body-md text-[var(--color-text-default)]">
                      Logs panel content goes here.
                    </p>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<TabsGuidelines />}
      tokens={
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">토큰</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>gap</code>
              </Td>
              <Td>8px</Td>
            </tr>
            <tr>
              <Td>
                <code>min-width</code>
              </Td>
              <Td>80px</Td>
            </tr>
            <tr>
              <Td>
                <code>padding-x</code>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <code>indicator</code>
              </Td>
              <Td>2px</Td>
            </tr>
            <tr>
              <Td>
                <code>boxed-padding</code>
              </Td>
              <Td>24px × 8px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      }
      apiReference={tabsProps}
      subComponentApis={[{ name: 'Tab', props: tabProps }]}
      keyboardInteractions={[
        { key: 'Tab', description: 'Tab List 진입 및 이탈' },
        { key: '← / →', description: '이전 / 다음 탭 항목으로 포커스 이동' },
        { key: 'Enter / Space', description: '포커스된 탭 선택' },
      ]}
      accessibility={
        <Prose>
          <p>
            Tabs use <code>role="tablist"</code>, <code>role="tab"</code>,{' '}
            <code>role="tabpanel"</code>. Arrow keys navigate between tabs.{' '}
            <code>aria-selected</code> indicates active tab.
          </p>
        </Prose>
      }
      relatedLinks={[
        {
          label: 'Detail Page',
          path: '/design/patterns/detail-page',
          description: 'Detail Page 내 콘텐츠 섹션 구분에 탭 사용',
        },
        {
          label: 'Navigation Bar',
          path: '/design/components/topbar',
          description: '페이지 간 이동에는 Navigation 사용',
        },
        {
          label: 'Accordion',
          path: '/design/components/disclosure',
          description: '순서 종속/연관 콘텐츠에는 Accordion 검토',
        },
        {
          label: 'Select',
          path: '/design/components/select',
          description: '옵션이 많을 때 드롭다운 대안',
        },
      ]}
      notionPageId="30d9eddc34e680e5beffc32d4a06a48e"
    />
  );
}
