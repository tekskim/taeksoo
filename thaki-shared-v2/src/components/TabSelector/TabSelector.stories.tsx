import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileIcon, GridIcon, LayersIcon } from '../Icon';
import Layout from '../Layout';
import { Typography } from '../Typography';
import { TabSelector } from './TabSelector';

const meta: Meta<typeof TabSelector> = {
  title: 'Navigation/TabSelector',
  component: TabSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'TabSelector는 여러 옵션 중 하나를 선택하는 세그먼트 컨트롤 컴포넌트입니다. Tabs 컴포넌트와 유사하지만 컨텐츠 영역 없이 선택만 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: '선택 가능한 옵션 배열',
    },
    value: {
      control: 'text',
      description: '제어된 선택 값',
    },
    defaultValue: {
      control: 'text',
      description: '비제어 모드의 초기 선택 값',
    },

    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '레이아웃 방향',
    },
    onChange: {
      description: '선택 변경 시 호출되는 콜백',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { id: 'tab1', label: '첫 번째' },
  { id: 'tab2', label: '두 번째' },
  { id: 'tab3', label: '세 번째' },
];

export const Default: Story = {
  args: {
    options: basicOptions,
    defaultValue: 'tab1',
    size: 'md',
    layout: 'horizontal',
  },
};

export const Variants: Story = {
  render: () => (
    <Layout.VStack gap="lg" style={{ minWidth: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Small Variant</Typography.Text>
        <TabSelector
          options={basicOptions}
          variant="small"
          defaultValue="tab1"
        />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">
          Medium Variant (Default)
        </Typography.Text>
        <TabSelector
          options={basicOptions}
          variant="medium"
          defaultValue="tab1"
        />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">
          Pill Variant (Segment Control)
        </Typography.Text>
        <TabSelector
          options={basicOptions}
          variant="pill"
          defaultValue="tab1"
        />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Layout.VStack gap="lg" style={{ minWidth: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Small</Typography.Text>
        <TabSelector options={basicOptions} defaultValue="tab1" />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Medium (Default)</Typography.Text>
        <TabSelector options={basicOptions} defaultValue="tab1" />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Large</Typography.Text>
        <TabSelector options={basicOptions} defaultValue="tab1" />
      </Layout.VStack>
    </Layout.VStack>
  ),
};

export const Layouts: Story = {
  render: () => (
    <Layout.HStack gap="lg" style={{ alignItems: 'flex-start' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">
          Horizontal (Default)
        </Typography.Text>
        <TabSelector
          options={basicOptions}
          layout="horizontal"
          defaultValue="tab1"
        />
      </Layout.VStack>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">Vertical</Typography.Text>
        <TabSelector
          options={basicOptions}
          layout="vertical"
          defaultValue="tab2"
        />
      </Layout.VStack>
    </Layout.HStack>
  ),
};

export const WithDisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled = [
      { id: 'tab1', label: '활성화' },
      { id: 'tab2', label: '비활성화', disabled: true },
      { id: 'tab3', label: '활성화' },
      { id: 'tab4', label: '비활성화', disabled: true },
    ];

    return (
      <Layout.VStack gap="md" style={{ minWidth: '400px' }}>
        <TabSelector options={optionsWithDisabled} defaultValue="tab1" />
      </Layout.VStack>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const optionsWithIcons = [
      {
        id: 'grid',
        label: (
          <Layout.HStack gap="sm" style={{ alignItems: 'center' }}>
            <GridIcon size={16} />
            <span>그리드</span>
          </Layout.HStack>
        ),
      },
      {
        id: 'list',
        label: (
          <Layout.HStack gap="sm" style={{ alignItems: 'center' }}>
            <LayersIcon size={16} />
            <span>리스트</span>
          </Layout.HStack>
        ),
      },
      {
        id: 'table',
        label: (
          <Layout.HStack gap="sm" style={{ alignItems: 'center' }}>
            <FileIcon size={16} />
            <span>테이블</span>
          </Layout.HStack>
        ),
      },
    ];

    return (
      <Layout.VStack gap="lg" style={{ minWidth: '400px' }}>
        <Layout.VStack gap="sm">
          <Typography.Text variant="caption">
            아이콘과 텍스트 조합
          </Typography.Text>
          <TabSelector options={optionsWithIcons} defaultValue="grid" />
        </Layout.VStack>
      </Layout.VStack>
    );
  },
};

export const IconOnly: Story = {
  render: () => {
    const iconOnlyOptions = [
      {
        id: 'grid',
        label: <GridIcon size={20} />,
      },
      {
        id: 'list',
        label: <LayersIcon size={20} />,
      },
      {
        id: 'table',
        label: <FileIcon size={20} />,
      },
    ];

    return (
      <Layout.VStack gap="lg">
        <Layout.VStack gap="sm">
          <Typography.Text variant="caption">아이콘만 사용</Typography.Text>
          <TabSelector
            options={iconOnlyOptions}
            defaultValue="grid"
            ariaLabel="보기 모드 선택"
          />
        </Layout.VStack>
      </Layout.VStack>
    );
  },
};

const ControlledExample = () => {
  const [selected, setSelected] = useState('tab2');

  const options = [
    { id: 'tab1', label: '옵션 1' },
    { id: 'tab2', label: '옵션 2' },
    { id: 'tab3', label: '옵션 3' },
    { id: 'tab4', label: '옵션 4' },
  ];

  return (
    <Layout.VStack gap="md" style={{ minWidth: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">
          현재 선택: {selected}
        </Typography.Text>
        <TabSelector
          options={options}
          value={selected}
          onChange={setSelected}
        />
      </Layout.VStack>
      <Layout.VStack
        gap="sm"
        style={{
          padding: 'var(--semantic-space-md)',
          backgroundColor: 'var(--semantic-color-surfaceLight)',
          borderRadius: 'var(--semantic-radius-base)',
        }}
      >
        <Typography.Text variant="paragraph">선택된 탭 내용</Typography.Text>
        <Typography.Text variant="caption">
          {selected === 'tab1' && '첫 번째 탭의 컨텐츠입니다.'}
          {selected === 'tab2' && '두 번째 탭의 컨텐츠입니다.'}
          {selected === 'tab3' && '세 번째 탭의 컨텐츠입니다.'}
          {selected === 'tab4' && '네 번째 탭의 컨텐츠입니다.'}
        </Typography.Text>
      </Layout.VStack>
    </Layout.VStack>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

const UncontrolledExample = () => {
  const options = [
    { id: 'tab1', label: '옵션 1' },
    { id: 'tab2', label: '옵션 2' },
    { id: 'tab3', label: '옵션 3' },
  ];

  const [lastChanged, setLastChanged] = useState<string | null>(null);

  return (
    <Layout.VStack gap="md" style={{ minWidth: '400px' }}>
      <Layout.VStack gap="sm">
        <Typography.Text variant="caption">
          비제어 모드 (defaultValue 사용)
        </Typography.Text>
        <TabSelector
          options={options}
          defaultValue="tab2"
          onChange={id => setLastChanged(id)}
        />
      </Layout.VStack>
      {lastChanged && (
        <Typography.Text variant="caption">
          마지막 선택: {lastChanged}
        </Typography.Text>
      )}
    </Layout.VStack>
  );
};

export const Uncontrolled: Story = {
  render: () => <UncontrolledExample />,
};

export const ManyOptions: Story = {
  render: () => {
    const manyOptions = [
      { id: 'instances', label: 'Instances' },
      { id: 'networks', label: 'Networks' },
      { id: 'volumes', label: 'Volumes' },
      { id: 'security', label: 'Security Groups' },
      { id: 'ips', label: 'Floating IPs' },
      { id: 'load-balancers', label: 'Load Balancers' },
    ];

    return (
      <Layout.VStack gap="lg" style={{ width: '600px' }}>
        <Layout.VStack gap="sm">
          <Typography.Text variant="caption">
            많은 옵션이 있는 경우
          </Typography.Text>
          <TabSelector options={manyOptions} defaultValue="instances" />
        </Layout.VStack>
      </Layout.VStack>
    );
  },
};

export const VerticalWithManyOptions: Story = {
  render: () => {
    const navigationOptions = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'compute', label: 'Compute' },
      { id: 'network', label: 'Network' },
      { id: 'storage', label: 'Storage' },
      { id: 'security', label: 'Security' },
      { id: 'monitoring', label: 'Monitoring' },
      { id: 'settings', label: 'Settings' },
    ];

    return (
      <Layout.VStack gap="sm" style={{ width: '200px' }}>
        <Typography.Text variant="caption">사이드바 네비게이션</Typography.Text>
        <TabSelector
          options={navigationOptions}
          layout="vertical"
          defaultValue="compute"
        />
      </Layout.VStack>
    );
  },
};

const FilterExample = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const statusOptions = [
    { id: 'all', label: '전체' },
    { id: 'active', label: '활성' },
    { id: 'inactive', label: '비활성' },
    { id: 'error', label: '오류' },
  ];

  const viewOptions = [
    {
      id: 'grid',
      label: <GridIcon size={18} />,
    },
    {
      id: 'list',
      label: <LayersIcon size={18} />,
    },
  ];

  return (
    <Layout.VStack gap="lg" style={{ minWidth: '500px' }}>
      <Layout.VStack gap="md">
        <Typography.Text>필터 조합 예시</Typography.Text>
        <Layout.HStack gap="md" style={{ alignItems: 'center' }}>
          <Layout.VStack gap="sm">
            <Typography.Text variant="caption">상태 필터</Typography.Text>
            <TabSelector
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </Layout.VStack>
          <Layout.VStack gap="sm">
            <Typography.Text variant="caption">보기 모드</Typography.Text>
            <TabSelector
              options={viewOptions}
              value={viewMode}
              onChange={setViewMode}
              ariaLabel="보기 모드 선택"
            />
          </Layout.VStack>
        </Layout.HStack>
      </Layout.VStack>
      <Layout.VStack
        gap="sm"
        style={{
          padding: 'var(--semantic-space-md)',
          backgroundColor: 'var(--semantic-color-surfaceLight)',
          borderRadius: 'var(--semantic-radius-base)',
        }}
      >
        <Typography.Text variant="caption">
          현재 설정: 상태={statusFilter}, 보기={viewMode}
        </Typography.Text>
      </Layout.VStack>
    </Layout.VStack>
  );
};

export const FilterCombination: Story = {
  render: () => <FilterExample />,
};
