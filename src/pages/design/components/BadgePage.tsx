import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DocSection } from '../_shared/DocSection';
import { PropsTable } from '../_shared/PropsTable';
import { Label } from '../../design-system-sections/HelperComponents';
import { Badge, BadgeList, VStack } from '@/design-system';
import { IconCheck, IconArrowRight } from '@tabler/icons-react';

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

const badgeProps: PropDef[] = [
  {
    name: 'theme',
    type: "'white' | 'blue' | 'red' | 'green' | 'yellow' | 'gray'",
    default: "'white'",
    required: false,
    description: 'Color theme',
  },
  {
    name: 'type',
    type: "'solid' | 'subtle'",
    default: "'solid'",
    required: false,
    description: 'Badge type',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    required: false,
    description: 'Badge size',
  },
  { name: 'leftIcon', type: 'ReactNode', required: false, description: 'Left icon' },
  { name: 'rightIcon', type: 'ReactNode', required: false, description: 'Right icon' },
  {
    name: 'dot',
    type: 'boolean',
    default: 'false',
    required: false,
    description: 'Show dot indicator',
  },
  { name: 'children', type: 'ReactNode', required: true, description: 'Badge content' },
];

const badgeListProps: PropDef[] = [
  {
    name: 'items',
    type: 'string[]',
    required: true,
    description: 'Array of badge items to display',
  },
  {
    name: 'maxVisible',
    type: 'number',
    default: '2',
    required: false,
    description: 'Maximum badges shown before +N overflow',
  },
  {
    name: 'maxBadgeWidth',
    type: 'string',
    required: false,
    description: "Max width per badge with truncation (e.g. '120px')",
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'sm'",
    required: false,
    description: 'Badge size',
  },
  {
    name: 'theme',
    type: "'white' | 'blue' | 'red' | 'green' | 'yellow' | 'gray'",
    required: false,
    description: 'Badge theme',
  },
  {
    name: 'type',
    type: "'solid' | 'subtle'",
    required: false,
    description: 'Badge type',
  },
  {
    name: 'popoverTitle',
    type: 'string',
    required: false,
    description: 'Popover header (default: "All items (N)")',
  },
  {
    name: 'renderItem',
    type: '(item: string, index: number) => ReactNode',
    required: false,
    description: 'Custom render for each badge item',
  },
];

function BadgeGuidelines() {
  return (
    <VStack gap={10}>
      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>

        <SubSectionTitle>Size</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[120px]">Size</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Small</strong>
              </Td>
              <Td>테이블 셀, 인라인 라벨</Td>
            </tr>
            <tr>
              <Td>
                <strong>Medium</strong>
              </Td>
              <Td>기본 크기</Td>
            </tr>
            <tr>
              <Td>
                <strong>Large</strong>
              </Td>
              <Td>강조가 필요한 경우</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Type</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[120px]">Type</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Solid</strong>
              </Td>
              <Td>배경색이 진한 형태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Subtle</strong>
              </Td>
              <Td>연한 배경 + 텍스트 색상</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Semantic Color</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[120px]">Color</Th>
              <Th className="w-[100px]">색상</Th>
              <Th>사용 목적</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>info</strong>
              </Td>
              <Td>파란색</Td>
              <Td>정보성, 중립적 레이블 (New, v2.1, 개수)</Td>
            </tr>
            <tr>
              <Td>
                <strong>success</strong>
              </Td>
              <Td>초록색</Td>
              <Td>긍정적 레이블 (Completed, Approved)</Td>
            </tr>
            <tr>
              <Td>
                <strong>warning</strong>
              </Td>
              <Td>주황색</Td>
              <Td>주의 레이블 (Expiring soon, Beta)</Td>
            </tr>
            <tr>
              <Td>
                <strong>danger</strong>
              </Td>
              <Td>빨간색</Td>
              <Td>오류/위험 레이블 (Failed, Expired, Deprecated)</Td>
            </tr>
            <tr>
              <Td>
                <strong>white</strong>
              </Td>
              <Td>흰색/회색</Td>
              <Td>기본, 카테고리 분류</Td>
            </tr>
            <tr>
              <Td>
                <strong>gray</strong>
              </Td>
              <Td>회색</Td>
              <Td>비활성, 보조 정보</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Layout</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">Layout</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Text only</strong>
              </Td>
              <Td>텍스트만 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Left icon</strong>
              </Td>
              <Td>왼쪽 아이콘 포함</Td>
            </tr>
            <tr>
              <Td>
                <strong>Right icon</strong>
              </Td>
              <Td>오른쪽 아이콘 포함</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[ (icon)  label text  (icon) ]`}</pre>
        </div>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Container</strong>
              </Td>
              <Td>배경, 테두리, 패딩</Td>
            </tr>
            <tr>
              <Td>
                <strong>Label text</strong>
              </Td>
              <Td>짧은 텍스트 또는 숫자</Td>
            </tr>
            <tr>
              <Td>
                <strong>Left icon</strong>
              </Td>
              <Td>선택적 왼쪽 아이콘</Td>
            </tr>
            <tr>
              <Td>
                <strong>Right icon</strong>
              </Td>
              <Td>선택적 오른쪽 아이콘</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Token</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[100px]">Size</Th>
              <Th>Padding</Th>
              <Th>Font Size</Th>
              <Th>Line Height</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>sm</code>
              </Td>
              <Td>
                <code>6×2px</code>
              </Td>
              <Td>
                <code>11px</code>
              </Td>
              <Td>
                <code>16px</code>
              </Td>
            </tr>
            <tr>
              <Td>
                <code>md</code>
              </Td>
              <Td>
                <code>8×4px</code>
              </Td>
              <Td>
                <code>12px</code>
              </Td>
              <Td>
                <code>16px</code>
              </Td>
            </tr>
            <tr>
              <Td>
                <code>lg</code>
              </Td>
              <Td>
                <code>12×4px</code>
              </Td>
              <Td>
                <code>14px</code>
              </Td>
              <Td>
                <code>20px</code>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <p>
            <code>radius: 4px</code> · <code>gap: 4px</code> · <code>dot-size: 6px</code>
          </p>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* BadgeList */}
      <VStack gap={4}>
        <SectionTitle>BadgeList</SectionTitle>
        <Prose>
          <p>
            테이블 셀에서 배열 데이터를 뱃지로 표시할 때 사용. 오버플로우 시 +N 인디케이터와
            Popover로 전체 항목을 보여준다.
          </p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">Variant</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Basic</strong>
              </Td>
              <Td>짧은 값 (daemons, osds, status)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Truncation</strong>
              </Td>
              <Td>긴 값 (labels, tags) — maxBadgeWidth 사용</Td>
            </tr>
            <tr>
              <Td>
                <strong>maxVisible=1</strong>
              </Td>
              <Td>매우 긴 값 (annotations)</Td>
            </tr>
            <tr>
              <Td>
                <strong>No overflow</strong>
              </Td>
              <Td>항목이 적어 오버플로우 없음</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Overflow 처리 정책</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>maxVisible 기본값 2 — 뱃지 2개까지 표시, 나머지는 +N Popover</li>
            <li>컬럼이 좁으면 maxVisible=1 사용</li>
            <li>긴 텍스트는 maxBadgeWidth로 truncation 적용</li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>

        <SubSectionTitle>Badge vs Chip vs StatusIndicator</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[160px]">컴포넌트</Th>
              <Th>사용 조건</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Badge</strong>
              </Td>
              <Td>상태 라벨, 카운트 표시, 카테고리 분류 (비인터랙티브)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Chip</strong>
              </Td>
              <Td>사용자가 추가/제거 가능한 태그, 필터 값 (인터랙티브)</Td>
            </tr>
            <tr>
              <Td>
                <strong>StatusIndicator</strong>
              </Td>
              <Td>리소스의 실시간 상태 (active, error, building 등)</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <p>
            <strong>Badge vs StatusIndicator</strong>: Badge는 정적 레이블·카운트 표시용(버전, 개수,
            카테고리)이고, StatusIndicator는 실시간 운영 상태 표시용(Running, Error, Building)이다.
            "Active", "Healthy" 등 실시간 상태는 StatusIndicator를 사용한다.
          </p>
        </Prose>

        <DosDonts
          doItems={[
            '짧은 라벨 텍스트 사용 (1–3단어)',
            '시맨틱 색상에 맞는 variant 선택',
            '테이블 셀 배열 데이터는 BadgeList 사용',
            '긴 텍스트는 maxBadgeWidth로 truncation',
          ]}
          dontItems={[
            '실시간 운영 상태 표시 — StatusIndicator 사용',
            '사용자 추가/제거 태그 — Chip 사용',
            '클릭·포커스 등 인터랙션 부여',
            '과도하게 긴 문장 사용',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>라벨 텍스트는 짧고 명확하게 (1–3단어 권장)</li>
            <li>약어 사용 시 일관성 유지 (e.g. v2.1, Beta)</li>
            <li>문장 형태보다는 명사/형용사 형태 사용</li>
            <li>대문자 사용은 제한적 (New, Beta 등 특수 케이스만)</li>
            <li>동일 맥락에서 동일 용어·스타일 유지</li>
          </ul>
        </Prose>
      </VStack>
    </VStack>
  );
}

export function BadgePage() {
  return (
    <ComponentPageTemplate
      title="Badge"
      description="버전, 상태, 갯수, 카테고리 등 짧은 정보를 색상과 함께 시각적으로 표시하는 보기 전용 레이블 컴포넌트다. 텍스트·숫자·상태값을 인라인으로 전달하며, 사용자가 직접 조작하지 않는 읽기 전용 요소다."
      whenToUse={[
        '버전, 상태, 갯수, 카테고리(예: New, Approved, Deprecated) 등 짧은 메타 정보를 레이블로 표기할 때',
        '테이블 셀, 카드, 목록 등에서 속성값을 색상과 함께 인라인으로 보여줄 때',
      ]}
      whenNotToUse={[
        '사용자가 직접 추가하거나 제거할 수 있는 태그가 필요한 경우 → Chip 사용',
        '리소스의 실시간 운영 상태(예: Running, Error, Building)를 표시하는 경우 → Status Indicator 사용',
        '클릭·포커스 등 인터랙션이 필요한 경우',
      ]}
      preview={
        <ComponentPreview
          code={`<Badge size="sm">Default</Badge>
<Badge size="sm" theme="blue" type="subtle">Label</Badge>
<Badge size="sm" theme="green" type="subtle">Completed</Badge>`}
        >
          <div className="flex gap-2">
            <Badge size="sm">Default</Badge>
            <Badge size="sm" theme="blue" type="subtle">
              Label
            </Badge>
            <Badge size="sm" theme="green" type="subtle">
              Completed
            </Badge>
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { Badge } from '@/design-system';

<Badge>Default</Badge>
<Badge theme="blue" type="subtle">Label</Badge>
<Badge theme="green" type="subtle" size="sm">Completed</Badge>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Sizes</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Small(테이블 셀), Medium(기본), Large(강조).
              </span>
            </VStack>
            <div className="flex gap-3 items-center p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <Badge size="sm" theme="white">
                Small
              </Badge>
              <Badge size="md" theme="white">
                Medium
              </Badge>
              <Badge size="lg" theme="white">
                Large
              </Badge>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Types</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Solid(진한 배경)와 Subtle(연한 배경 + 텍스트 색상).
              </span>
            </VStack>
            <div className="flex gap-6 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={2}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Solid</span>
                <div className="flex gap-2">
                  <Badge size="sm" theme="white">
                    White
                  </Badge>
                </div>
              </VStack>
              <VStack gap={2}>
                <span className="text-body-xs text-[var(--color-text-subtle)]">Subtle</span>
                <div className="flex gap-2">
                  <Badge size="sm" type="subtle" theme="white">
                    White
                  </Badge>
                  <Badge size="sm" type="subtle" theme="blue">
                    Blue
                  </Badge>
                  <Badge size="sm" type="subtle" theme="green">
                    Green
                  </Badge>
                  <Badge size="sm" type="subtle" theme="red">
                    Red
                  </Badge>
                  <Badge size="sm" type="subtle" theme="yellow">
                    Yellow
                  </Badge>
                  <Badge size="sm" type="subtle" theme="gray">
                    Gray
                  </Badge>
                </div>
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Layout (with Icons)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                Text only, Left icon, Right icon 레이아웃.
              </span>
            </VStack>
            <div className="flex gap-3 items-center p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={1} align="center">
                <Badge size="sm" theme="blue" type="subtle">
                  Text only
                </Badge>
                <span className="text-body-sm text-[var(--color-text-subtle)]">All apps</span>
              </VStack>
              <VStack gap={1} align="center">
                <Badge size="sm" theme="blue" type="subtle" leftIcon={<IconCheck size={10} />}>
                  Left icon
                </Badge>
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  AI Platform only
                </span>
              </VStack>
              <VStack gap={1} align="center">
                <Badge
                  size="sm"
                  theme="blue"
                  type="subtle"
                  rightIcon={<IconArrowRight size={10} />}
                >
                  Right icon
                </Badge>
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  AI Platform only
                </span>
              </VStack>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<BadgeGuidelines />}
      tokens={
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[100px]">Size</Th>
              <Th>Padding</Th>
              <Th>Font Size</Th>
              <Th>Line Height</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>sm</code>
              </Td>
              <Td>
                <code>6×2px</code>
              </Td>
              <Td>
                <code>11px</code>
              </Td>
              <Td>
                <code>16px</code>
              </Td>
            </tr>
            <tr>
              <Td>
                <code>md</code>
              </Td>
              <Td>
                <code>8×4px</code>
              </Td>
              <Td>
                <code>12px</code>
              </Td>
              <Td>
                <code>16px</code>
              </Td>
            </tr>
            <tr>
              <Td>
                <code>lg</code>
              </Td>
              <Td>
                <code>12×4px</code>
              </Td>
              <Td>
                <code>14px</code>
              </Td>
              <Td>
                <code>20px</code>
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      }
      apiReference={badgeProps}
      accessibility={
        <Prose>
          <p>
            Badge is a presentational component. Use appropriate semantic markup when badges convey
            status (e.g. aria-label on parent).
          </p>
        </Prose>
      }
      relatedLinks={[
        {
          label: 'Chip',
          path: '/design/components/chip',
          description: '사용자가 추가/제거 가능한 인터랙티브 태그',
        },
        {
          label: 'Status Indicator',
          path: '/design/components/status-indicator',
          description: '리소스의 실시간 운영 상태 표시',
        },
      ]}
    >
      {/* BadgeList Section */}
      <DocSection id="badge-list" title="BadgeList">
        <VStack gap={8}>
          <Prose>
            <p>
              테이블 셀에서 배열 데이터를 뱃지로 표시할 때 사용하는 컴포넌트입니다. 오버플로우 시 +N
              인디케이터와 Popover로 전체 항목을 보여줍니다.
            </p>
          </Prose>

          <VStack gap={3}>
            <Label>Basic — 짧은 값 (daemons, osds, status)</Label>
            <ComponentPreview
              code={`<BadgeList
  items={['osd.4', 'osd.5', 'osd.6', 'osd.7']}
  maxVisible={2}
  popoverTitle="All OSDs (4)"
/>`}
            >
              <BadgeList
                items={['osd.4', 'osd.5', 'osd.6', 'osd.7']}
                maxVisible={2}
                popoverTitle="All OSDs (4)"
              />
            </ComponentPreview>
          </VStack>

          <VStack gap={3}>
            <Label>Truncation — 긴 값 (labels, tags)</Label>
            <ComponentPreview
              code={`<BadgeList
  items={[
    'kubernetes.io/metadata.name=production',
    'app.kubernetes.io/instance=nginx',
    'env=staging',
  ]}
  maxVisible={2}
  maxBadgeWidth="120px"
  popoverTitle="All Labels (3)"
/>`}
            >
              <BadgeList
                items={[
                  'kubernetes.io/metadata.name=production',
                  'app.kubernetes.io/instance=nginx',
                  'env=staging',
                ]}
                maxVisible={2}
                maxBadgeWidth="120px"
                popoverTitle="All Labels (3)"
              />
            </ComponentPreview>
          </VStack>

          <VStack gap={3}>
            <Label>maxVisible=1 — 매우 긴 값</Label>
            <ComponentPreview
              code={`<BadgeList
  items={[
    'app.kubernetes.io/managed-by=helm',
    'topology.kubernetes.io/zone=us-east-1a',
  ]}
  maxVisible={1}
  maxBadgeWidth="140px"
  popoverTitle="All Annotations (2)"
/>`}
            >
              <BadgeList
                items={[
                  'app.kubernetes.io/managed-by=helm',
                  'topology.kubernetes.io/zone=us-east-1a',
                ]}
                maxVisible={1}
                maxBadgeWidth="140px"
                popoverTitle="All Annotations (2)"
              />
            </ComponentPreview>
          </VStack>

          <VStack gap={3}>
            <Label>항목이 적은 경우 — 오버플로우 없음</Label>
            <div className="flex gap-6">
              <BadgeList items={['admin']} maxVisible={2} />
              <BadgeList items={['in', 'up']} maxVisible={2} />
            </div>
          </VStack>

          <PropsTable props={badgeListProps} name="BadgeListProps" />
        </VStack>
      </DocSection>
    </ComponentPageTemplate>
  );
}
