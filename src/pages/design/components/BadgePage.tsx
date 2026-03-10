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
    default: '1',
    required: false,
    description: 'Maximum badges shown before +N overflow',
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
              <Th>용도</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Small</strong>
              </Td>
              <Td>테이블 셀, 목록 등 공간이 제한된 영역</Td>
            </tr>
            <tr>
              <Td>
                <strong>Medium</strong>
              </Td>
              <Td>카드, 상세 페이지 등 일반 컨텍스트 (기본값)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Large</strong>
              </Td>
              <Td>강조가 필요한 단독 표시 영역</Td>
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
                <strong>Solid</strong> (default)
              </Td>
              <Td>배경색이 진한 형태. white/gray 테마에서 중립적인 레이블로 사용</Td>
            </tr>
            <tr>
              <Td>
                <strong>Subtle</strong>
              </Td>
              <Td>
                연한 배경 + 텍스트 색상. 시맨틱 컬러(info, success, warning, danger)와 함께 사용 시
                권장
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
        <p className="text-body-sm text-[var(--color-text-subtle)]">
          <strong>Default가 solid인 이유:</strong> Badge의 가장 빈번한 사용처인 테이블 셀에서는
          white/gray 테마의 solid 배지가 시각적으로 가장 균형 잡혀 있습니다. 시맨틱 컬러(info,
          success 등)를 사용할 때는 subtle 타입이 더 적절하므로 명시적으로{' '}
          <code className="text-body-sm">type=&quot;subtle&quot;</code>을 지정하세요.
        </p>

        <SubSectionTitle>Semantic Color</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[120px]">Variant</Th>
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
              <Td>정보성·중립적 레이블 (예: &quot;New&quot;, &quot;v2.1&quot;, 개수 표시)</Td>
            </tr>
            <tr>
              <Td>
                <strong>success</strong>
              </Td>
              <Td>초록색</Td>
              <Td>긍정적 레이블 (예: &quot;Completed&quot;, &quot;Approved&quot;)</Td>
            </tr>
            <tr>
              <Td>
                <strong>warning</strong>
              </Td>
              <Td>주황색</Td>
              <Td>주의 레이블 (예: &quot;Expiring soon&quot;, &quot;Beta&quot;)</Td>
            </tr>
            <tr>
              <Td>
                <strong>danger</strong>
              </Td>
              <Td>빨간색</Td>
              <Td>
                오류/위험 레이블 (예: &quot;Failed&quot;, &quot;Expired&quot;,
                &quot;Deprecated&quot;)
              </Td>
            </tr>
            <tr>
              <Td>
                <strong>white</strong>
              </Td>
              <Td>흰색</Td>
              <Td>어두운 배경 위 중립 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>gray</strong>
              </Td>
              <Td>회색</Td>
              <Td>비활성·보조 정보 표시</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Layout (with Icons)</SubSectionTitle>
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
              <Td>아이콘 + 텍스트</Td>
            </tr>
            <tr>
              <Td>
                <strong>Right icon</strong>
              </Td>
              <Td>텍스트 + 아이콘</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition (구성 요소)</SectionTitle>
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)] p-3">
          <pre className="text-body-sm text-[var(--color-text-muted)] whitespace-pre font-[var(--font-family-mono)]">{`[ (icon)  label text  (icon) ]`}</pre>
        </div>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">요소</Th>
              <Th className="w-[100px]">필수 여부</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Container</strong>
              </Td>
              <Td>✅ 필수</Td>
              <Td>배경색과 border-radius가 적용된 Pill 형태의 래퍼</Td>
            </tr>
            <tr>
              <Td>
                <strong>Label text</strong>
              </Td>
              <Td>✅ 필수</Td>
              <Td>상태·값·카테고리를 나타내는 짧은 텍스트</Td>
            </tr>
            <tr>
              <Td>
                <strong>Left icon</strong>
              </Td>
              <Td>선택</Td>
              <Td>의미를 보조하는 아이콘</Td>
            </tr>
            <tr>
              <Td>
                <strong>Right icon</strong>
              </Td>
              <Td>선택</Td>
              <Td>방향·액션을 암시하는 아이콘</Td>
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
            테이블 셀 안에서 배열 데이터를 여러 개의 Badge로 나열할 때 사용하는 컴포넌트다. 표시
            가능한 개수(<code>maxVisible</code>)를 초과하면 <code>+N</code> 인디케이터로 숨김
            처리하고, 클릭 시 Popover로 전체 항목을 확인할 수 있다.
          </p>
        </Prose>

        <SubSectionTitle>Variants</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">Variant</Th>
              <Th>설명</Th>
              <Th>주요 사용처</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Basic</strong>
              </Td>
              <Td>짧은 값을 그대로 표시</Td>
              <Td>daemons, osds, status</Td>
            </tr>
            <tr>
              <Td>
                <strong>Truncation</strong>
              </Td>
              <Td>긴 값은 말줄임 처리 후 표시</Td>
              <Td>labels, tags</Td>
            </tr>
            <tr>
              <Td>
                <strong>maxVisible=1</strong>
              </Td>
              <Td>1개만 노출 후 나머지 +N 처리</Td>
              <Td>매우 긴 값, 공간 극히 제한</Td>
            </tr>
            <tr>
              <Td>
                <strong>No overflow</strong>
              </Td>
              <Td>항목 수가 maxVisible 이하라 오버플로우 없는 경우</Td>
              <Td>항목 수 적음</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Overflow 처리 정책</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code>maxVisible</code> 값을 초과하는 항목은 <code>+N</code> 인디케이터로 표시한다.
            </li>
            <li>
              <code>+N</code> 클릭 시 Popover가 열리며 전체 Badge 목록을 표시한다.
            </li>
            <li>Popover 내에서도 동일한 Badge 스타일을 유지한다.</li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>

        <SubSectionTitle>Badge vs Chip vs Status Indicator 선택 기준</SubSectionTitle>
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
              <Td>상태 레이블, 카운트 표시, 카테고리 분류 (비인터랙티브)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Chip</strong>
              </Td>
              <Td>사용자가 추가/제거 가능한 태그, 필터 값 (인터랙티브)</Td>
            </tr>
            <tr>
              <Td>
                <strong>Status Indicator</strong>
              </Td>
              <Td>리소스의 실시간 상태 (active, error, building 등)</Td>
            </tr>
          </tbody>
        </TableWrapper>
        <Prose>
          <p>
            Badge는 정적 레이블·카운트 표시(예: 버전, 개수, 카테고리)이고, Status Indicator는 실시간
            운영 상태 표시(예: Running, Error, Building)다. &quot;Active&quot;, &quot;Healthy&quot;
            등 실시간 상태는 Status Indicator를 사용한다.
          </p>
        </Prose>

        <SubSectionTitle>Variant 매핑 규칙</SubSectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>info</strong> (파란색): 정보성·중립적 레이블 (예: &quot;New&quot;,
              &quot;v2.1&quot;, 개수 표시)
            </li>
            <li>
              <strong>success</strong> (초록색): 긍정적 레이블 (예: &quot;Completed&quot;,
              &quot;Approved&quot;)
            </li>
            <li>
              <strong>warning</strong> (주황색): 주의 레이블 (예: &quot;Expiring soon&quot;,
              &quot;Beta&quot;)
            </li>
            <li>
              <strong>danger</strong> (빨간색): 오류/위험 레이블 (예: &quot;Failed&quot;,
              &quot;Expired&quot;, &quot;Deprecated&quot;)
            </li>
          </ul>
        </Prose>

        <DosDonts
          doItems={[
            '레이블은 1–3단어 이내의 짧은 텍스트로 작성한다.',
            '동일한 화면에서 Semantic Color의 의미를 일관되게 사용한다.',
            '테이블·목록 등 밀도가 높은 UI에는 Small 사이즈를 우선 사용한다.',
            '텍스트만으로 의미가 충분히 전달될 때는 아이콘 없이 사용한다.',
          ]}
          dontItems={[
            '문장 전체를 Badge에 담지 않는다.',
            '색상만으로 의미를 구분하지 않는다. 텍스트 레이블을 반드시 함께 사용한다.',
            '동일한 화면에서 같은 색상 Variant를 다른 의미로 혼용하지 않는다.',
            '인터랙티브 요소(버튼, 링크 등)처럼 보이도록 스타일링하지 않는다.',
          ]}
        />
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Content Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Content Guidelines</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>레이블 텍스트는 가능한 한 1단어로 작성하고, 최대 3단어를 넘지 않도록 한다.</li>
            <li>축약어를 사용할 경우 툴팁 등으로 전체 의미를 보완한다.</li>
            <li>
              문장 형태(동사 포함)로 작성하지 않는다. (예: &quot;Error occurred&quot; ❌ →
              &quot;Error&quot; ✅)
            </li>
            <li>
              첫 글자는 대문자로 시작한다. (예: &quot;approved&quot; ❌ → &quot;Approved&quot; ✅)
            </li>
            <li>동일한 상태를 표현할 때는 시스템 전반에 걸쳐 동일한 레이블 텍스트를 사용한다.</li>
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
      description="버전, 상태, 개수, 카테고리 등 짧은 정보를 색상과 함께 시각적으로 표시하는 보기 전용 레이블 컴포넌트다. 텍스트·숫자·상태값을 인라인으로 전달하며, 사용자가 직접 조작하지 않는 읽기 전용 요소다."
      whenToUse={[
        '버전, 상태, 개수, 카테고리(예: New, Approved, Deprecated) 등 짧은 메타 정보를 레이블로 표기할 때',
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
              테이블 셀 안에서 배열 데이터를 여러 개의 Badge로 나열할 때 사용하는 컴포넌트다. 표시
              가능한 개수(<code>maxVisible</code>)를 초과하면 <code>+N</code> 인디케이터로 숨김
              처리하고, 클릭 시 Popover로 전체 항목을 확인할 수 있다.
            </p>
          </Prose>

          <VStack gap={3}>
            <Label>Basic — 짧은 값 (daemons, osds, status)</Label>
            <ComponentPreview
              code={`<BadgeList
  items={['osd.4', 'osd.5', 'osd.6', 'osd.7']}
  popoverTitle="All OSDs (4)"
/>`}
            >
              <BadgeList items={['osd.4', 'osd.5', 'osd.6', 'osd.7']} popoverTitle="All OSDs (4)" />
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
  popoverTitle="All Labels (3)"
/>`}
            >
              <BadgeList
                items={[
                  'kubernetes.io/metadata.name=production',
                  'app.kubernetes.io/instance=nginx',
                  'env=staging',
                ]}
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
  popoverTitle="All Annotations (2)"
/>`}
            >
              <BadgeList
                items={[
                  'app.kubernetes.io/managed-by=helm',
                  'topology.kubernetes.io/zone=us-east-1a',
                ]}
                maxVisible={1}
                popoverTitle="All Annotations (2)"
              />
            </ComponentPreview>
          </VStack>

          <VStack gap={3}>
            <Label>항목이 적은 경우 — 오버플로우 없음</Label>
            <div className="flex gap-6">
              <BadgeList items={['admin']} />
              <BadgeList items={['in', 'up']} />
            </div>
          </VStack>

          <PropsTable props={badgeListProps} name="BadgeListProps" />
        </VStack>
      </DocSection>
    </ComponentPageTemplate>
  );
}
