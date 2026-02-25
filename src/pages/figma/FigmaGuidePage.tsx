import { VStack, Badge } from '@/design-system';
import { Link } from 'react-router-dom';

const DocSection = ({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-20">
    <VStack gap={3} align="stretch">
      <VStack gap={1} align="start">
        <h3 className="text-heading-h5 text-[var(--color-text-default)]">{title}</h3>
        {description && (
          <p className="text-body-md text-[var(--color-text-muted)]">{description}</p>
        )}
      </VStack>
      {children}
    </VStack>
  </section>
);

const CodeBlock = ({ code, language = '' }: { code: string; language?: string }) => (
  <pre
    className={`p-4 rounded-[var(--primitive-radius-lg)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] overflow-x-auto text-body-sm font-mono text-[var(--color-text-default)]`}
    data-language={language}
  >
    <code>{code}</code>
  </pre>
);

function MappingTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)]">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border-subtle)]">
              {row.map((cell, j) => (
                <td key={j} className="py-2 px-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CaptureLink = ({ path, label }: { path: string; label: string }) => (
  <Link to={path} className="text-[var(--color-action-primary)] hover:underline text-body-md">
    {label}
  </Link>
);

const namingRows: (string | React.ReactNode)[][] = [
  [<code>Button</code>, <code>TDS/Form/Button</code>, 'Form'],
  [<code>Input</code>, <code>TDS/Form/Input</code>, 'Form'],
  [<code>NumberInput</code>, <code>TDS/Form/NumberInput</code>, 'Form'],
  [<code>SearchInput</code>, <code>TDS/Form/SearchInput</code>, 'Form'],
  [<code>Textarea</code>, <code>TDS/Form/Textarea</code>, 'Form'],
  [<code>Select</code>, <code>TDS/Form/Select</code>, 'Form'],
  [<code>Checkbox</code>, <code>TDS/Form/Checkbox</code>, 'Form'],
  [<code>Radio</code>, <code>TDS/Form/Radio</code>, 'Form'],
  [<code>Toggle</code>, <code>TDS/Form/Toggle</code>, 'Form'],
  [<code>Slider</code>, <code>TDS/Form/Slider</code>, 'Form'],
  [<code>DatePicker</code>, <code>TDS/Form/DatePicker</code>, 'Form'],
  [<code>FormField</code>, <code>TDS/Form/FormField</code>, 'Form'],
  [<code>Badge</code>, <code>TDS/Data/Badge</code>, 'Data Display'],
  [<code>Chip</code>, <code>TDS/Data/Chip</code>, 'Data Display'],
  [<code>StatusIndicator</code>, <code>TDS/Data/StatusIndicator</code>, 'Data Display'],
  [<code>Table</code>, <code>TDS/Data/Table</code>, 'Data Display'],
  [<code>Pagination</code>, <code>TDS/Data/Pagination</code>, 'Data Display'],
  [<code>InfoBox</code>, <code>TDS/Data/InfoBox</code>, 'Data Display'],
  [<code>MetricCard</code>, <code>TDS/Data/MetricCard</code>, 'Data Display'],
  [<code>Tooltip</code>, <code>TDS/Overlay/Tooltip</code>, 'Overlay'],
  [<code>Popover</code>, <code>TDS/Overlay/Popover</code>, 'Overlay'],
  [<code>Modal</code>, <code>TDS/Overlay/Modal</code>, 'Overlay'],
  [<code>ConfirmModal</code>, <code>TDS/Overlay/ConfirmModal</code>, 'Overlay'],
  [<code>Drawer</code>, <code>TDS/Overlay/Drawer</code>, 'Overlay'],
  [<code>ContextMenu</code>, <code>TDS/Overlay/ContextMenu</code>, 'Overlay'],
  [<code>Tabs</code>, <code>TDS/Navigation/Tabs</code>, 'Navigation'],
  [<code>TabBar</code>, <code>TDS/Navigation/TabBar</code>, 'Navigation'],
  [<code>Breadcrumb</code>, <code>TDS/Navigation/Breadcrumb</code>, 'Navigation'],
  [<code>TopBar</code>, <code>TDS/Navigation/TopBar</code>, 'Navigation'],
  [<code>InlineMessage</code>, <code>TDS/Feedback/InlineMessage</code>, 'Feedback'],
  [<code>Loading</code>, <code>TDS/Feedback/Loading</code>, 'Feedback'],
  [<code>EmptyState</code>, <code>TDS/Feedback/EmptyState</code>, 'Feedback'],
  [<code>ErrorState</code>, <code>TDS/Feedback/ErrorState</code>, 'Feedback'],
  [<code>PageShell</code>, <code>TDS/Layout/PageShell</code>, 'Layout'],
  [<code>PageHeader</code>, <code>TDS/Layout/PageHeader</code>, 'Layout'],
  [<code>DetailHeader</code>, <code>TDS/Layout/DetailHeader</code>, 'Layout'],
  [<code>SectionCard</code>, <code>TDS/Layout/SectionCard</code>, 'Layout'],
  [<code>ListToolbar</code>, <code>TDS/Layout/ListToolbar</code>, 'Layout'],
];

const propMappingRows: (string | React.ReactNode)[][] = [
  [
    <code>variant</code>,
    <Badge theme="blue" type="subtle" size="sm">
      Variant
    </Badge>,
    'Button: primary / secondary / ghost / …',
  ],
  [
    <code>size</code>,
    <Badge theme="blue" type="subtle" size="sm">
      Variant
    </Badge>,
    'sm / md / lg',
  ],
  [
    <code>state</code>,
    <Badge theme="blue" type="subtle" size="sm">
      Variant
    </Badge>,
    'default / hover / active / disabled',
  ],
  [
    <code>disabled</code>,
    <Badge theme="green" type="subtle" size="sm">
      Boolean
    </Badge>,
    'true / false',
  ],
  [
    <code>loading</code>,
    <Badge theme="green" type="subtle" size="sm">
      Boolean
    </Badge>,
    'true / false',
  ],
  [
    <code>error</code>,
    <Badge theme="green" type="subtle" size="sm">
      Boolean
    </Badge>,
    'true / false',
  ],
  [
    <code>checked</code>,
    <Badge theme="green" type="subtle" size="sm">
      Boolean
    </Badge>,
    'true / false',
  ],
  [
    <code>label / title</code>,
    <Badge theme="yellow" type="subtle" size="sm">
      Text
    </Badge>,
    '편집 가능한 텍스트',
  ],
  [
    <code>placeholder</code>,
    <Badge theme="yellow" type="subtle" size="sm">
      Text
    </Badge>,
    '편집 가능한 placeholder',
  ],
  [
    <code>leftIcon</code>,
    <Badge theme="red" type="subtle" size="sm">
      Instance swap
    </Badge>,
    '아이콘 슬롯',
  ],
  [
    <code>rightIcon</code>,
    <Badge theme="red" type="subtle" size="sm">
      Instance swap
    </Badge>,
    '아이콘 슬롯',
  ],
  [
    <code>children</code>,
    <Badge theme="gray" type="subtle" size="sm">
      Text / Slot
    </Badge>,
    '컨텐츠 영역',
  ],
];

export function FigmaGuidePage() {
  return (
    <VStack gap={10} align="stretch">
      {/* Header */}
      <VStack gap={2} align="start">
        <h2 className="text-heading-h3 text-[var(--color-text-default)]">Figma Migration Guide</h2>
        <p className="text-body-lg text-[var(--color-text-muted)]">
          HTML to Design 플러그인으로 캡처한 요소를 Figma 컴포넌트로 변환할 때의 네이밍, 프로퍼티,
          구조 규칙
        </p>
      </VStack>

      {/* Capture Pages Quick Links */}
      <DocSection
        id="capture-pages"
        title="캡처 페이지 바로가기"
        description="HTML to Design 플러그인에 사용할 캡처 전용 페이지"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              path: '/design/figma/foundation',
              label: 'Foundation',
              desc: '색상, 타이포, 간격, 아이콘',
            },
            { path: '/design/figma/components', label: 'Components', desc: '전체 UI 컴포넌트' },
            { path: '/design/figma/overlays', label: 'Overlays', desc: 'Modal, Drawer, Tooltip' },
            { path: '/design/figma/patterns', label: 'Patterns', desc: 'List, Detail, Wizard' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="p-4 rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] hover:border-[var(--color-action-primary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
            >
              <VStack gap={1}>
                <span className="text-label-lg text-[var(--color-text-default)]">{item.label}</span>
                <span className="text-body-sm text-[var(--color-text-subtle)]">{item.desc}</span>
              </VStack>
            </Link>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-[var(--primitive-radius-md)] bg-[var(--color-state-info-bg)] text-body-sm text-[var(--color-text-default)]">
          <strong>Standalone 캡처:</strong> 사이드바 없이 순수 컴포넌트만 캡처하려면{' '}
          <CaptureLink path="/figma/foundation" label="/figma/foundation" />,{' '}
          <CaptureLink path="/figma/components" label="/figma/components" />,{' '}
          <CaptureLink path="/figma/overlays" label="/figma/overlays" />,{' '}
          <CaptureLink path="/figma/patterns" label="/figma/patterns" /> 경로를 사용하세요.
        </div>
      </DocSection>

      {/* 1. Figma File Structure */}
      <DocSection
        id="file-structure"
        title="1. Figma 파일 구조"
        description="Figma 파일의 Page 및 Section 구성"
      >
        <MappingTable
          headers={['Figma Page', '설명', '캡처 소스']}
          rows={[
            ['Foundation', '색상 팔레트, 타이포그래피, 간격, 반경, 그림자', '/figma/foundation'],
            ['Components', '전체 UI 컴포넌트 (variant × size × state)', '/figma/components'],
            ['Overlays', 'Modal, Drawer, Tooltip, Popover 정적 렌더링', '/figma/overlays'],
            ['Patterns', 'List/Detail/Wizard/Form 페이지 패턴', '/figma/patterns'],
            ['Icons', 'Tabler 아이콘 컴포넌트화', '/figma/foundation (하단)'],
          ]}
        />
        <CodeBlock
          code={`Page: Components
  ├── Frame: Button
  ├── Frame: Input
  ├── Frame: Select
  ├── Frame: Checkbox
  ...`}
        />
      </DocSection>

      {/* 2. Naming Convention */}
      <DocSection
        id="naming"
        title="2. 컴포넌트 네이밍 규칙"
        description="TDS/{Category}/{ComponentName} 형식"
      >
        <CodeBlock code="TDS/{Category}/{ComponentName}" />
        <MappingTable headers={['TDS 코드', 'Figma 컴포넌트명', '카테고리']} rows={namingRows} />
      </DocSection>

      {/* 3. Property Mapping */}
      <DocSection
        id="property-mapping"
        title="3. Component Property 매핑"
        description="TDS Props → Figma Component Properties 변환 규칙"
      >
        <MappingTable
          headers={['TDS Prop', 'Figma Property', '사용 예시']}
          rows={propMappingRows}
        />
      </DocSection>

      {/* 4. Component Property Table */}
      <DocSection
        id="component-properties"
        title="4. 컴포넌트별 Property 설정표"
        description="주요 컴포넌트의 Figma Property 구성"
      >
        <VStack gap={6} align="stretch">
          {/* Button */}
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Button</h4>
            <MappingTable
              headers={['Property', 'Type', 'Values']}
              rows={[
                [
                  'Variant',
                  'Variant',
                  'primary | secondary | muted | ghost | outline | danger | warning | link',
                ],
                ['Size', 'Variant', 'sm | md | lg'],
                ['State', 'Variant', 'default | hover | active | disabled | loading'],
                ['Icon', 'Variant', 'none | left | right | icon-only'],
                ['Label', 'Text', '"Button"'],
                ['LeftIcon', 'Instance', 'Icon swap slot'],
              ]}
            />
            <MappingTable
              headers={['Size', 'Direction', 'Gap', 'Padding (Y/X)', 'Height']}
              rows={[
                ['sm', 'Horizontal', '6px', '6px / 10px', '28px'],
                ['md', 'Horizontal', '6px', '8px / 12px', '32px'],
                ['lg', 'Horizontal', '8px', '10px / 16px', '36px'],
              ]}
            />
          </VStack>

          {/* Input */}
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Input</h4>
            <MappingTable
              headers={['Property', 'Type', 'Values']}
              rows={[
                ['Size', 'Variant', 'sm | md | lg'],
                ['State', 'Variant', 'default | focus | error | disabled'],
                ['Placeholder', 'Text', '"Enter value..."'],
                ['Value', 'Text', '(editable)'],
                ['LeftElement', 'Boolean', 'true / false'],
                ['RightElement', 'Boolean', 'true / false'],
              ]}
            />
          </VStack>

          {/* Badge */}
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Badge</h4>
            <MappingTable
              headers={['Property', 'Type', 'Values']}
              rows={[
                ['Theme', 'Variant', 'blue | red | green | yellow | gray | white'],
                ['Type', 'Variant', 'solid | subtle'],
                ['Size', 'Variant', 'sm | md | lg'],
                ['Dot', 'Boolean', 'true / false'],
                ['Label', 'Text', '"Badge"'],
              ]}
            />
          </VStack>

          {/* StatusIndicator */}
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">StatusIndicator</h4>
            <MappingTable
              headers={['Property', 'Type', 'Values']}
              rows={[
                [
                  'Status',
                  'Variant',
                  'active | error | building | deleting | pending | shutoff | paused | …',
                ],
                ['Layout', 'Variant', 'icon-only | dot-label'],
              ]}
            />
          </VStack>

          {/* Modal */}
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Modal</h4>
            <MappingTable
              headers={['Property', 'Type', 'Values']}
              rows={[
                ['Size', 'Variant', 'sm | md | lg'],
                ['Title', 'Text', '"Modal Title"'],
                ['Description', 'Text', '(optional)'],
              ]}
            />
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              Radius: 16px, Padding: 24px, Gap: 16px
            </p>
          </VStack>

          {/* Drawer */}
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Drawer</h4>
            <MappingTable
              headers={['Property', 'Type', 'Values']}
              rows={[
                ['Width', 'Variant', '360 | 696 | 1032'],
                ['Title', 'Text', '"Drawer Title"'],
              ]}
            />
          </VStack>

          {/* DetailHeader */}
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">DetailHeader</h4>
            <MappingTable
              headers={['Property', 'Type', 'Values']}
              rows={[
                ['Title', 'Text', '"Resource Name"'],
                ['CardCount', 'Variant', '4 | 5 | 6 | 7 | 8'],
              ]}
            />
            <MappingTable
              headers={['Cards', 'Layout']}
              rows={[
                ['1–4', '단일 행'],
                ['5', '3 / 2'],
                ['6', '4 / 2'],
                ['7', '4 / 3'],
                ['8', '4 / 4'],
              ]}
            />
          </VStack>
        </VStack>
      </DocSection>

      {/* 5. Variant Combinations */}
      <DocSection
        id="variants"
        title="5. 상태 관리 (Variant 조합)"
        description="각 컴포넌트에서 지원하는 전체 Variant 조합"
      >
        <CodeBlock
          code={`Button:
  Variant: primary | secondary | outline | ghost | muted | danger | warning | link
  Size: sm | md | lg
  State: default | hover | active | disabled | loading
  Icon: none | left | right | icon-only

Input:
  Size: sm | md | lg
  State: default | focus | error | disabled
  LeftElement: true | false
  RightElement: true | false

Badge:
  Theme: blue | red | green | yellow | gray | white
  Type: solid | subtle
  Size: sm | md | lg
  Dot: true | false

StatusIndicator:
  Status: active | error | building | pending | shutoff | ...
  Layout: icon-only | dot-label`}
        />
        <div className="p-3 rounded-[var(--primitive-radius-md)] bg-[var(--color-state-warning-bg)] text-body-sm text-[var(--color-text-default)]">
          <strong>Hover 상태:</strong> CSS <code>:hover</code>는 캡처되지 않으므로, Figma에서는 별도
          Variant로 추가합니다.
        </div>
      </DocSection>

      {/* 6. Auto Layout */}
      <DocSection
        id="auto-layout"
        title="6. Auto Layout 가이드"
        description="주요 컴포넌트의 Figma Auto Layout 설정"
      >
        <MappingTable
          headers={['컴포넌트', 'Direction', 'Gap', 'Padding (Y/X)']}
          rows={[
            ['Button SM', 'Horizontal', '6px', '6px / 10px'],
            ['Button MD', 'Horizontal', '6px', '8px / 12px'],
            ['Button LG', 'Horizontal', '8px', '10px / 16px'],
            ['Input MD', 'Horizontal', '—', '0 / 10px'],
            ['Badge SM', 'Horizontal', '4px', '2px / 6px'],
            ['Badge MD', 'Horizontal', '4px', '4px / 8px'],
            ['Checkbox', 'Horizontal', '6px', '0'],
            ['SectionCard', 'Vertical', '16px', '16px'],
            ['Modal SM/MD', 'Vertical', '16px', '24px'],
            ['Drawer 360', 'Vertical', '24px', '24px'],
            ['FormField', 'Vertical', '8px', '0'],
            ['Tooltip', 'Horizontal', '—', '4px / 6px'],
            ['StatusIndicator', 'Horizontal', '4px', '4px / 6px'],
            ['InlineMessage', 'Horizontal', '8px', '12px'],
          ]}
        />
        <VStack gap={2} align="stretch">
          <h4 className="text-heading-h6 text-[var(--color-text-default)]">반응형 규칙</h4>
          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
            <li>
              <strong>Container width</strong> → <code>Fill container</code>
            </li>
            <li>
              <strong>Component height</strong> → <code>Hug contents</code> (대부분), 고정 높이 일부
            </li>
            <li>
              <strong>Text wrapping</strong> → <code>Auto width</code> 또는{' '}
              <code>Fill container</code> (fullWidth)
            </li>
          </ul>
        </VStack>
      </DocSection>

      {/* 7. Token → Figma Style */}
      <DocSection
        id="token-mapping"
        title="7. 토큰 → Figma 스타일 매핑"
        description="CSS 변수와 Figma 스타일의 1:1 매핑"
      >
        <VStack gap={6} align="stretch">
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">색상 스타일</h4>
            <MappingTable
              headers={['CSS Variable', 'Figma Style']}
              rows={[
                ['--semantic-color-primary', 'TDS/Primary'],
                ['--semantic-color-primary-hover', 'TDS/Primary/Hover'],
                ['--semantic-color-on-primary', 'TDS/On Primary'],
                ['--semantic-color-secondary', 'TDS/Secondary'],
                ['--semantic-color-surface', 'TDS/Surface/Default'],
                ['--semantic-color-surface-muted', 'TDS/Surface/Muted'],
                ['--semantic-color-text', 'TDS/Text/Default'],
                ['--semantic-color-text-muted', 'TDS/Text/Muted'],
                ['--semantic-color-text-subtle', 'TDS/Text/Subtle'],
                ['--semantic-color-border', 'TDS/Border/Default'],
                ['--semantic-color-state-info', 'TDS/State/Info'],
                ['--semantic-color-state-success', 'TDS/State/Success'],
                ['--semantic-color-state-warning', 'TDS/State/Warning'],
                ['--semantic-color-state-danger', 'TDS/State/Danger'],
              ]}
            />
          </VStack>

          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">텍스트 스타일</h4>
            <MappingTable
              headers={['유틸리티 클래스', 'Figma Text Style', 'Size / LH / Weight']}
              rows={[
                ['text-heading-h1', 'TDS/Heading/H1', '40px / 48px / 600'],
                ['text-heading-h2', 'TDS/Heading/H2', '32px / 40px / 600'],
                ['text-heading-h3', 'TDS/Heading/H3', '24px / 32px / 600'],
                ['text-heading-h4', 'TDS/Heading/H4', '18px / 28px / 600'],
                ['text-heading-h5', 'TDS/Heading/H5', '16px / 24px / 600'],
                ['text-heading-h6', 'TDS/Heading/H6', '14px / 20px / 600'],
                ['text-heading-h7', 'TDS/Heading/H7', '12px / 18px / 600'],
                ['text-body-lg', 'TDS/Body/LG', '14px / 20px / 400'],
                ['text-body-md', 'TDS/Body/MD', '12px / 18px / 400'],
                ['text-body-sm', 'TDS/Body/SM', '11px / 16px / 400'],
                ['text-body-xs', 'TDS/Body/XS', '10px / 14px / 400'],
                ['text-label-lg', 'TDS/Label/LG', '13px / 18px / 500'],
                ['text-label-md', 'TDS/Label/MD', '12px / 18px / 500'],
                ['text-label-sm', 'TDS/Label/SM', '11px / 16px / 500'],
              ]}
            />
          </VStack>

          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Effect 스타일</h4>
            <MappingTable
              headers={['Token', 'Figma Effect Style', '값']}
              rows={[
                ['--shadow-xs', 'TDS/Shadow/XS', 'Y=1, Blur=2, Opacity=5%'],
                ['--shadow-sm', 'TDS/Shadow/SM', 'Y=1, Blur=3, O=10% + Y=1, Blur=2, O=10%'],
                ['--shadow-md', 'TDS/Shadow/MD', 'Y=4, Blur=6, O=10%'],
                ['--shadow-lg', 'TDS/Shadow/LG', 'Y=10, Blur=15, O=10%'],
                ['--shadow-xl', 'TDS/Shadow/XL', 'Y=20, Blur=25, O=10%'],
              ]}
            />
          </VStack>
        </VStack>
      </DocSection>

      {/* 8. Capture Workflow */}
      <DocSection
        id="workflow"
        title="8. 캡처 워크플로우"
        description="HTML to Design 플러그인을 사용한 단계별 캡처 절차"
      >
        <VStack gap={4} align="stretch">
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              Step 1: 로컬 서버 실행
            </h4>
            <CodeBlock code="npx pnpm dev" language="bash" />
          </VStack>

          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              Step 2: 캡처 페이지 접속
            </h4>
            <MappingTable
              headers={['페이지', 'URL']}
              rows={[
                ['Foundation', 'http://localhost:5173/figma/foundation'],
                ['Components', 'http://localhost:5173/figma/components'],
                ['Overlays', 'http://localhost:5173/figma/overlays'],
                ['Patterns', 'http://localhost:5173/figma/patterns'],
              ]}
            />
          </VStack>

          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              Step 3: HTML to Design 플러그인 실행
            </h4>
            <ol className="list-decimal pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
              <li>
                Figma에서 <code>Plugins → HTML to Design</code> 실행
              </li>
              <li>각 캡처 페이지 URL을 입력하여 캡처</li>
              <li>캡처된 프레임을 Figma Page별로 정리</li>
            </ol>
          </VStack>

          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Step 4: 컴포넌트화</h4>
            <ol className="list-decimal pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
              <li>
                각 UI 요소를 선택 → <code>Create component</code> (Ctrl/Cmd + Alt + K)
              </li>
              <li>
                위 네이밍 규칙에 따라 이름 설정 (<code>TDS/Category/Name</code>)
              </li>
              <li>
                Variant 조합이 필요한 경우 <code>Combine as variants</code>
              </li>
              <li>Component Properties 패널에서 Property 추가</li>
              <li>Auto Layout 설정 확인 및 조정</li>
            </ol>
          </VStack>

          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              Step 5: 스타일 등록
            </h4>
            <ol className="list-decimal pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
              <li>
                색상 스타일: 각 Semantic 색상을 선택 → <code>+</code> 버튼으로 Color Style 생성
              </li>
              <li>텍스트 스타일: 각 타이포그래피 레벨을 선택 → Text Style 생성</li>
              <li>Effect 스타일: Shadow가 적용된 요소를 선택 → Effect Style 생성</li>
            </ol>
          </VStack>
        </VStack>
      </DocSection>

      {/* 9. Cautions */}
      <DocSection id="cautions" title="9. 주의사항" description="캡처 및 Figma 변환 시 주의할 점">
        <VStack gap={4} align="stretch">
          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">캡처 시 주의</h4>
            <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>오버레이 컴포넌트:</strong> Modal, Drawer, Tooltip, Popover는 코드에서{' '}
                <code>createPortal</code>을 사용하지만, 캡처 페이지에서는 portal 없이 인라인으로
                렌더링
              </li>
              <li>
                <strong>Hover 상태:</strong> CSS <code>:hover</code>는 캡처되지 않으므로, className
                override로 hover 스타일을 적용한 정적 버전 포함
              </li>
              <li>
                <strong>애니메이션:</strong> Loading spinner 등은 정적 상태로 캡처됨
              </li>
              <li>
                <strong>다크 모드:</strong> 캡처 페이지는 라이트 모드 기준. 다크 모드 필요 시{' '}
                <code>data-theme=&quot;dark&quot;</code> 추가
              </li>
            </ul>
          </VStack>

          <VStack gap={2} align="stretch">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Figma 변환 시 주의</h4>
            <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
              <li>
                <strong>Instance swap:</strong> 아이콘 슬롯은 Instance swap property로 설정
              </li>
              <li>
                <strong>텍스트 오버라이드:</strong> label, placeholder 등은 Text property로 노출
              </li>
              <li>
                <strong>Constraint:</strong> 반응형이 필요한 컴포넌트는 <code>Fill container</code>{' '}
                + <code>Hug contents</code> 조합 사용
              </li>
              <li>
                <strong>Spacing 일관성:</strong> TDS 토큰에 정의된 spacing 값만 사용 (4px, 8px,
                12px, 16px, 24px 등)
              </li>
            </ul>
          </VStack>
        </VStack>
      </DocSection>

      {/* 10. Checklist */}
      <DocSection
        id="checklist"
        title="10. 체크리스트"
        description="Figma 마이그레이션 완료 확인용 체크리스트"
      >
        <VStack gap={6} align="stretch">
          {[
            {
              title: 'Foundation',
              items: [
                'Primitive 색상 팔레트 (Blue, Red, Green, Orange, Yellow, BlueGray)',
                'Semantic 색상 스타일 등록',
                '타이포그래피 스타일 등록 (Heading H1-H7, Body LG/MD/SM/XS, Label LG/MD/SM)',
                'Spacing 스케일 정리',
                'Border Radius 정리',
                'Shadow Effect 스타일 등록',
                '주요 아이콘 컴포넌트화',
              ],
            },
            {
              title: 'Components',
              items: [
                'Button (8 variant × 3 size × 5 state × icon 조합)',
                'Input (3 size × 4 state)',
                'NumberInput / SearchInput / Textarea',
                'Select (2 size × 4 state)',
                'Checkbox (3 state × disabled)',
                'Radio (2 state × disabled)',
                'Toggle (on/off × disabled)',
                'Slider (default/disabled + with NumberInput)',
                'Badge (6 theme × 2 type × 3 size + dot)',
                'Chip (default/selected/disabled + removable)',
                'StatusIndicator (16 status × 2 layout)',
                'Table, Pagination, ProgressBar',
                'Tabs (underline/boxed), Breadcrumb',
                'InlineMessage (4 variant), Loading (3 size)',
                'EmptyState, ErrorState',
                'FormField, SectionCard, DetailHeader, PageHeader',
                'InfoBox, MetricCard, ListToolbar, ContextMenu',
              ],
            },
            {
              title: 'Overlays',
              items: [
                'Modal (SM/MD/LG)',
                'ConfirmModal (danger)',
                'Drawer (360px/696px)',
                'Tooltip (4 position)',
                'Popover (top/bottom)',
              ],
            },
            {
              title: 'Patterns',
              items: [
                'List Page 패턴',
                'Detail Page 패턴',
                'Form Drawer 패턴',
                'Confirmation Modal 패턴',
                'Wizard (Create Page) 패턴',
              ],
            },
          ].map((group) => (
            <VStack key={group.title} gap={2} align="stretch">
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">{group.title}</h4>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-body-md text-[var(--color-text-muted)] cursor-pointer"
                  >
                    <input type="checkbox" className="rounded" />
                    {item}
                  </label>
                ))}
              </div>
            </VStack>
          ))}
        </VStack>
      </DocSection>
    </VStack>
  );
}
