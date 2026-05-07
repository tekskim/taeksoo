import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { ChainedSelect, VStack, type ChainedSelectSegment } from '@/design-system';

const defaultSegments: ChainedSelectSegment[] = [
  {
    key: 'app',
    label: 'App',
    options: [
      { value: 'compute', label: 'Compute' },
      { value: 'storage', label: 'Storage' },
      { value: 'network', label: 'Network' },
      { value: 'iam', label: 'IAM' },
    ],
  },
  {
    key: 'partition',
    label: 'Partition',
    options: [
      { value: 'default', label: 'default' },
      { value: 'us-east-1', label: 'us-east-1' },
      { value: 'ap-northeast-2', label: 'ap-northeast-2' },
      { value: 'eu-west-1', label: 'eu-west-1' },
    ],
  },
  {
    key: 'resourceType',
    label: 'Resource type',
    options: [
      { value: 'instance', label: 'instance' },
      { value: 'volume', label: 'volume' },
      { value: 'network', label: 'network' },
      { value: 'security-group', label: 'security-group' },
      { value: 'image', label: 'image' },
    ],
  },
  {
    key: 'resourceId',
    label: 'Resource ID',
    options: [
      { value: '*', label: '* (All)' },
      { value: 'i-0a1b2c3d4e', label: 'i-0a1b2c3d4e' },
      { value: 'i-5f6g7h8i9j', label: 'i-5f6g7h8i9j' },
      { value: 'vol-abc123def', label: 'vol-abc123def' },
    ],
  },
];

function DefaultPreview() {
  const [values, setValues] = useState<Record<string, string>>({});
  return <ChainedSelect segments={defaultSegments} values={values} onChange={setValues} />;
}

function PrefilledExample() {
  const [values, setValues] = useState<Record<string, string>>({
    app: 'compute',
    partition: 'default',
  });
  return <ChainedSelect segments={defaultSegments} values={values} onChange={setValues} />;
}

function DisabledExample() {
  const values = {
    app: 'compute',
    partition: 'default',
    resourceType: 'instance',
    resourceId: '*',
  };
  return <ChainedSelect segments={defaultSegments} values={values} onChange={() => {}} disabled />;
}

function TwoSegmentExample() {
  const [values, setValues] = useState<Record<string, string>>({});
  const segments: ChainedSelectSegment[] = [
    {
      key: 'service',
      label: 'Service',
      options: [
        { value: 'compute', label: 'Compute' },
        { value: 'storage', label: 'Storage' },
      ],
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        { value: 'read', label: 'Read' },
        { value: 'write', label: 'Write' },
        { value: 'delete', label: 'Delete' },
        { value: 'admin', label: 'Admin' },
      ],
    },
  ];
  return <ChainedSelect segments={segments} values={values} onChange={setValues} />;
}

export function ChainedSelectPage() {
  return (
    <ComponentPageTemplate
      title="Chained Select"
      description="여러 개의 연관된 선택 항목을 콜론(:)으로 구분된 단일 행 입력으로 제공하는 컴포넌트다. 사용자가 왼쪽부터 순서대로 값을 선택하면, 다음 세그먼트가 활성화된다. 리소스 경로(ARN), 계층적 분류 체계 등 순차적 선택이 필요한 패턴에 적합하다."
      whenToUse={[
        'ARN이나 리소스 경로처럼 계층적 구조를 순서대로 선택해야 할 때',
        '앞 단계의 선택에 따라 다음 단계의 옵션이 결정되는 종속 선택 패턴',
        '여러 Select를 사용하면 공간이 비효율적이고, 선택 항목 간 관계를 시각적으로 나타내야 할 때',
        '리소스 식별자, 필터 경로, 카테고리 계층 등을 입력할 때',
      ]}
      whenNotToUse={[
        '각 선택이 독립적이고 순서가 없는 경우 (→ 개별 Select 사용)',
        '옵션 수가 매우 많아 검색이 필요한 경우 (→ SearchInput + Select 조합 사용)',
        '선택 단계가 6개 이상으로 많아 한 줄에 표시하기 어려운 경우 (→ 단계별 폼 패턴 사용)',
        '값을 자유롭게 입력해야 하는 경우 (→ Input 사용)',
      ]}
      preview={
        <ComponentPreview
          code={`import { ChainedSelect } from '@/design-system';

const segments = [
  {
    key: 'app',
    label: 'App',
    options: [
      { value: 'compute', label: 'Compute' },
      { value: 'storage', label: 'Storage' },
    ],
  },
  {
    key: 'partition',
    label: 'Partition',
    options: [
      { value: 'default', label: 'default' },
      { value: 'us-east-1', label: 'us-east-1' },
    ],
  },
  {
    key: 'resourceType',
    label: 'Resource type',
    options: [
      { value: 'instance', label: 'instance' },
      { value: 'volume', label: 'volume' },
    ],
  },
  {
    key: 'resourceId',
    label: 'Resource ID',
    options: [
      { value: '*', label: '* (All)' },
    ],
  },
];

const [values, setValues] = useState({});

<ChainedSelect
  segments={segments}
  values={values}
  onChange={setValues}
/>`}
        >
          <DefaultPreview />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Default (Empty)</Label>
            <DefaultPreview />
          </VStack>
          <VStack gap={3}>
            <Label>Prefilled (2 of 4 selected)</Label>
            <PrefilledExample />
          </VStack>
          <VStack gap={3}>
            <Label>Disabled</Label>
            <DisabledExample />
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <VStack gap={1}>
            <span className="text-heading-h6 text-[var(--color-text-default)]">
              Sequential Selection
            </span>
            <span className="text-body-md text-[var(--color-text-muted)]">
              사용자는 왼쪽부터 순서대로 값을 선택해야 한다. 앞 단계를 선택하기 전에는 다음 단계가
              비활성화된다.
            </span>
          </VStack>
          <VStack gap={1}>
            <span className="text-heading-h6 text-[var(--color-text-default)]">
              Cascading Reset
            </span>
            <span className="text-body-md text-[var(--color-text-muted)]">
              앞 단계의 값을 변경하면, 해당 단계 이후의 모든 선택 값이 초기화된다. 이는 계층적 종속
              관계를 유지하기 위함이다.
            </span>
          </VStack>
          <VStack gap={1}>
            <span className="text-heading-h6 text-[var(--color-text-default)]">Segment Width</span>
            <span className="text-body-md text-[var(--color-text-muted)]">
              각 세그먼트는 120px 고정 너비를 사용한다. 라벨이 이보다 길면 truncate된다.
            </span>
          </VStack>
          <VStack gap={1}>
            <span className="text-heading-h6 text-[var(--color-text-default)]">Auto-advance</span>
            <span className="text-body-md text-[var(--color-text-muted)]">
              값을 선택하면 자동으로 다음 세그먼트의 드롭다운이 열린다. 사용자가 빠르게 전체 경로를
              완성할 수 있다.
            </span>
          </VStack>
        </VStack>
      }
      tokens={
        <div className="overflow-x-auto">
          <table className="w-full text-body-md">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                <th className="text-left py-2 pr-4 text-label-sm text-[var(--color-text-subtle)]">
                  Token
                </th>
                <th className="text-left py-2 text-label-sm text-[var(--color-text-subtle)]">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-default)]">
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4">Segment width</td>
                <td className="py-2 font-mono">120px</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4">Segment padding</td>
                <td className="py-2 font-mono">5px 4px</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4">Container padding</td>
                <td className="py-2 font-mono">4px</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4">Container border-radius</td>
                <td className="py-2 font-mono">var(--radius-md) (6px)</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4">Container border</td>
                <td className="py-2 font-mono">var(--color-border-strong)</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4">Separator</td>
                <td className="py-2 font-mono">: (colon)</td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="py-2 pr-4">Font</td>
                <td className="py-2 font-mono">text-body-md (12px/16px)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Dropdown max-height</td>
                <td className="py-2 font-mono">200px</td>
              </tr>
            </tbody>
          </table>
        </div>
      }
      relatedLinks={[
        { label: 'Select', href: '/design/components/select' },
        { label: 'FilterSearchInput', href: '/design/components/filter-search-input' },
      ]}
    />
  );
}
