import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DocSection } from '../_shared/DocSection';
import { PropsTable } from '../_shared/PropsTable';
import { Label } from '../../design-system-sections/HelperComponents';
import { Badge, BadgeList, VStack } from '@/design-system';
import { IconCheck, IconArrowRight } from '@tabler/icons-react';

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
            <Label>Sizes</Label>
            <div className="flex gap-3 items-center">
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
            <Label>Types</Label>
            <div className="flex gap-6">
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Solid
                </span>
                <div className="flex gap-2">
                  <Badge size="sm" theme="white">
                    White
                  </Badge>
                </div>
              </VStack>
              <VStack gap={2}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Subtle
                </span>
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
            <Label>Layout (with Icons)</Label>
            <div className="flex gap-3 items-center">
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
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={6}>
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Size
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Small
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        테이블 셀, 인라인 라벨
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Medium
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">기본 크기</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Large
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">강조가 필요한 경우</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Type
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Solid
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">배경색이 진한 형태</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Subtle
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        연한 배경 + 텍스트 색상
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Semantic Color
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        색상
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        사용 목적
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        info
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">파란색</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        정보성, 중립적 레이블 (New, v2.1, 개수)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        success
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">초록색</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        긍정적 레이블 (Completed, Approved)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        warning
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">주황색</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        주의 레이블 (Expiring soon, Beta)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        danger
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">빨간색</td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        오류/위험 레이블 (Failed, Expired, Deprecated)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        white
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">흰색/회색</td>
                      <td className="py-2 text-[var(--color-text-muted)]">기본, 카테고리 분류</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        gray
                      </td>
                      <td className="py-2 pr-4 text-[var(--color-text-muted)]">회색</td>
                      <td className="py-2 text-[var(--color-text-muted)]">비활성, 보조 정보</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Layout
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Text only
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">텍스트만 표시</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Left icon
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">왼쪽 아이콘 포함</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Right icon
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">오른쪽 아이콘 포함</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Composition (구성 요소)
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                구조:{' '}
                <code className="bg-[var(--color-surface-default)] px-1 rounded">
                  [ (icon) label text (icon) ]
                </code>
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        요소
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Container
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">배경, 테두리, 패딩</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Label text
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">짧은 텍스트 또는 숫자</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Left icon
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택적 왼쪽 아이콘</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Right icon
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">선택적 오른쪽 아이콘</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Size
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Padding
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Font Size
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        Line Height
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">sm</td>
                      <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">6×2px</td>
                      <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">11px</td>
                      <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">md</td>
                      <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">8×4px</td>
                      <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12px</td>
                      <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">lg</td>
                      <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12×4px</td>
                      <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">14px</td>
                      <td className="py-2 font-mono text-[var(--color-text-muted)]">20px</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-subtle)] mt-1">
                <code>radius: 4px</code> · <code>gap: 4px</code> · <code>dot-size: 6px</code>
              </p>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">BadgeList</h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                테이블 셀에서 배열 데이터를 뱃지로 표시할 때 사용. 오버플로우 시 +N 인디케이터와
                Popover로 전체 항목을 보여준다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        Variant
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Basic
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        짧은 값 (daemons, osds, status)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Truncation
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        긴 값 (labels, tags) — maxBadgeWidth 사용
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        maxVisible=1
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        매우 긴 값 (annotations)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        No overflow
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        항목이 적어 오버플로우 없음
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                Overflow 처리 정책
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>maxVisible 기본값 2 — 뱃지 2개까지 표시, 나머지는 +N Popover</li>
                <li>컬럼이 좁으면 maxVisible=1 사용</li>
                <li>긴 텍스트는 maxBadgeWidth로 truncation 적용</li>
              </ul>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Usage Guidelines</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        컴포넌트
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        사용 조건
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Badge
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        상태 라벨, 카운트 표시, 카테고리 분류 (비인터랙티브)
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        Chip
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        사용자가 추가/제거 가능한 태그, 필터 값 (인터랙티브)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                        StatusIndicator
                      </td>
                      <td className="py-2 text-[var(--color-text-muted)]">
                        리소스의 실시간 상태 (active, error, building 등)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-subtle)] mt-2">
                <strong>Badge vs StatusIndicator</strong>: Badge는 정적 레이블·카운트 표시용(버전,
                개수, 카테고리)이고, StatusIndicator는 실시간 운영 상태 표시용(Running, Error,
                Building)이다. &quot;Active&quot;, &quot;Healthy&quot; 등 실시간 상태는
                StatusIndicator를 사용한다.
              </p>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                Variant 매핑 규칙
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  <strong>info</strong>: 정보성, 중립적 레이블 (New, v2.1, 개수)
                </li>
                <li>
                  <strong>success</strong>: 긍정적 레이블 (Completed, Approved)
                </li>
                <li>
                  <strong>warning</strong>: 주의 레이블 (Expiring soon, Beta)
                </li>
                <li>
                  <strong>danger</strong>: 오류/위험 레이블 (Failed, Expired, Deprecated)
                </li>
              </ul>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                Do ✅
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>짧은 라벨 텍스트 사용 (1–3단어)</li>
                <li>시맨틱 색상에 맞는 variant 선택</li>
                <li>테이블 셀 배열 데이터는 BadgeList 사용</li>
                <li>긴 텍스트는 maxBadgeWidth로 truncation</li>
              </ul>
              <p className="text-body-sm font-medium text-[var(--color-text-default)] mt-2">
                Don&apos;t ❌
              </p>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>실시간 운영 상태 표시 — StatusIndicator 사용</li>
                <li>사용자 추가/제거 태그 — Chip 사용</li>
                <li>클릭·포커스 등 인터랙션 부여</li>
                <li>과도하게 긴 문장 사용</li>
              </ul>
            </VStack>

            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Content Guidelines
              </h4>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>라벨 텍스트는 짧고 명확하게 (1–3단어 권장)</li>
                <li>약어 사용 시 일관성 유지 (e.g. v2.1, Beta)</li>
                <li>문장 형태보다는 명사/형용사 형태 사용</li>
                <li>대문자 사용은 제한적 (New, Beta 등 특수 케이스만)</li>
                <li>동일 맥락에서 동일 용어·스타일 유지</li>
              </ul>
            </VStack>
          </VStack>
        </div>
      }
      tokens={
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-[length:var(--font-size-11)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Size
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Padding
                  </th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                    Font Size
                  </th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                    Line Height
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">sm</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">6×2px</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">11px</td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">md</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">8×4px</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12px</td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">lg</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12×4px</td>
                  <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">14px</td>
                  <td className="py-2 font-mono text-[var(--color-text-muted)]">20px</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
            <code>radius: 4px</code> · <code>gap: 4px</code> · <code>dot-size: 6px</code>
          </div>
        </>
      }
      apiReference={badgeProps}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          Badge is a presentational component. Use appropriate semantic markup when badges convey
          status (e.g. aria-label on parent).
        </p>
      }
      relatedLinks={[
        { label: 'Chip', path: '/design/components/chip' },
        { label: 'Status Indicator', path: '/design/components/status-indicator' },
      ]}
    >
      {/* BadgeList Section */}
      <DocSection id="badge-list" title="BadgeList">
        <VStack gap={8}>
          <p className="text-body-lg text-[var(--color-text-muted)]">
            테이블 셀에서 배열 데이터를 뱃지로 표시할 때 사용하는 컴포넌트입니다. 오버플로우 시 +N
            인디케이터와 Popover로 전체 항목을 보여줍니다.
          </p>

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
