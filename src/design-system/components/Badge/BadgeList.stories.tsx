import type { Meta, StoryObj } from '@storybook/react-vite';
import { BadgeList } from './BadgeList';

const meta: Meta<typeof BadgeList> = {
  title: 'Components/BadgeList',
  component: BadgeList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## BadgeList 컴포넌트

테이블 셀 등에서 배열 데이터를 뱃지로 렌더링할 때 사용합니다.
\`maxVisible\` 개수 초과 시 \`+N\` 트리거로 Popover에 전체 목록을 표시합니다.

### 사용 규칙
- 뱃지가 2개 이상 될 수 있는 컬럼은 반드시 \`BadgeList\` 사용
- \`flex-wrap\`으로 직접 나열하는 패턴 금지 (행 높이 일관성 깨짐)
- 기본 \`maxVisible\`은 2

### 예시
\`\`\`tsx
import { BadgeList } from '@thaki/tds';

<BadgeList items={['osd.1', 'osd.2', 'osd.3']} maxVisible={2} />
<BadgeList items={labels} maxVisible={2} maxBadgeWidth="72px" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    maxVisible: {
      control: { type: 'number', min: 1, max: 10 },
      description: '표시할 최대 뱃지 수',
      table: { defaultValue: { summary: '2' } },
    },
    maxBadgeWidth: {
      control: 'text',
      description: '개별 뱃지 최대 너비 (truncation용)',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '뱃지 크기',
      table: { defaultValue: { summary: '"sm"' } },
    },
    theme: {
      control: 'select',
      options: ['white', 'blue', 'red', 'green', 'yellow', 'gray'],
      description: '뱃지 테마',
    },
    type: {
      control: 'select',
      options: ['solid', 'subtle'],
      description: '뱃지 타입',
    },
    popoverTitle: {
      control: 'text',
      description: 'Popover 헤더 제목',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BadgeList>;

const shortItems = ['osd.1', 'osd.2', 'osd.3', 'osd.4'];
const labelItems = [
  'app=nginx',
  'env=production',
  'team=platform',
  'version=v2.1.0',
  'region=ap-northeast-2',
];
const longItems = [
  'kubernetes.io/metadata.name=kube-system',
  'node.kubernetes.io/instance-type=m5.xlarge',
  'topology.kubernetes.io/zone=ap-northeast-2a',
];

export const Default: Story = {
  args: {
    items: shortItems,
    maxVisible: 2,
  },
};

export const AllVisible: Story = {
  render: () => <BadgeList items={['osd.1', 'osd.2']} maxVisible={2} />,
};

export const WithOverflow: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">maxVisible=2 (기본)</p>
        <BadgeList
          items={shortItems}
          maxVisible={2}
          popoverTitle={`All OSDs (${shortItems.length})`}
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">maxVisible=1</p>
        <BadgeList
          items={shortItems}
          maxVisible={1}
          popoverTitle={`All OSDs (${shortItems.length})`}
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">maxVisible=3</p>
        <BadgeList
          items={shortItems}
          maxVisible={3}
          popoverTitle={`All OSDs (${shortItems.length})`}
        />
      </div>
    </div>
  ),
};

export const WithTruncation: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">
          maxBadgeWidth="72px" — 중간 길이 라벨
        </p>
        <BadgeList
          items={labelItems}
          maxVisible={2}
          maxBadgeWidth="72px"
          popoverTitle={`All Labels (${labelItems.length})`}
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">
          maxBadgeWidth="140px", maxVisible=1 — 긴 어노테이션
        </p>
        <BadgeList
          items={longItems}
          maxVisible={1}
          maxBadgeWidth="140px"
          popoverTitle={`All Annotations (${longItems.length})`}
        />
      </div>
    </div>
  ),
};

export const Themed: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">
          theme="blue" type="subtle"
        </p>
        <BadgeList items={labelItems} maxVisible={2} theme="blue" type="subtle" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-subtle)] mb-2">
          theme="green" type="subtle"
        </p>
        <BadgeList items={shortItems} maxVisible={2} theme="green" type="subtle" />
      </div>
    </div>
  ),
};

export const InTableContext: Story = {
  render: () => (
    <div className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)]">
      <table className="w-full text-body-md">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[140px]">
              Name
            </th>
            <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[200px]">
              Labels
            </th>
            <th className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 w-[160px]">
              OSDs
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[var(--color-border-subtle)]">
            <td className="py-2 px-3 text-[var(--color-text-default)]">node-01</td>
            <td className="py-2 px-3">
              <BadgeList
                items={labelItems}
                maxVisible={2}
                maxBadgeWidth="72px"
                popoverTitle={`All Labels (${labelItems.length})`}
              />
            </td>
            <td className="py-2 px-3">
              <BadgeList
                items={shortItems}
                maxVisible={2}
                popoverTitle={`All OSDs (${shortItems.length})`}
              />
            </td>
          </tr>
          <tr>
            <td className="py-2 px-3 text-[var(--color-text-default)]">node-02</td>
            <td className="py-2 px-3">
              <BadgeList items={['app=redis']} maxVisible={2} maxBadgeWidth="72px" />
            </td>
            <td className="py-2 px-3">
              <BadgeList items={['osd.5']} maxVisible={2} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
