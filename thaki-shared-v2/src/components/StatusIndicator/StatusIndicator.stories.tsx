import type { Meta, StoryObj } from '@storybook/react';
import { ActiveIcon, BuildingIcon, PausedIcon } from '../Icon';
import Layout from '../Layout';
import { Typography } from '../Typography';
import { StatusColorScheme, StatusIndicator, StatusVariant } from './StatusIndicator';

const meta: Meta<typeof StatusIndicator> = {
  title: 'Data Display/Status Indicator',
  component: StatusIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '상태 표시 뱃지 컴포넌트입니다. 시스템 상태, 인스턴스 상태 등을 시각적으로 표현합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'active',
        'error',
        'suspended',
        'shelved',
        'shutoff',
        'down',
        'paused',
        'building',
        'inUse',
        'degraded',
        'offline',
        'noMonitor',
      ],
      description: '상태 변형',
    },
    label: {
      control: 'text',
      description: '상태 라벨 텍스트',
    },
    layout: {
      control: 'select',
      options: ['leftIcon', 'iconOnly'],
      description: '표시 형태 (아이콘만 또는 아이콘+라벨)',
    },
    tooltip: {
      control: 'text',
      description: '툴팁 텍스트 (미입력 시 표시되지 않음)',
    },
    colorScheme: {
      control: 'select',
      options: ['success', 'danger', 'warning', 'muted', 'info'],
      description: '색상 스킴 (variant의 기본 색상을 오버라이드)',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'active',
    label: 'Active',
    layout: 'leftIcon',
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants: Array<{ variant: StatusVariant; label: string }> = [
      { variant: 'active', label: 'Active' },
      { variant: 'error', label: 'Error' },
      { variant: 'suspended', label: 'Suspended' },
      { variant: 'shelved', label: 'Shelved' },
      { variant: 'shutoff', label: 'Shutoff' },
      { variant: 'down', label: 'Down' },
      { variant: 'paused', label: 'Paused' },
      { variant: 'building', label: 'Building...' },
      { variant: 'inUse', label: 'In Use' },
      { variant: 'degraded', label: 'Degraded' },
      { variant: 'offline', label: 'Offline' },
      { variant: 'noMonitor', label: 'No Monitor' },
    ];

    return (
      <Layout.VStack gap="md">
        <Typography.Text variant="caption">모든 상태 변형</Typography.Text>
        <Layout.HStack gap="sm" style={{ flexWrap: 'wrap' }}>
          {variants.map(({ variant, label }) => (
            <StatusIndicator key={variant} variant={variant} label={label} />
          ))}
        </Layout.HStack>
      </Layout.VStack>
    );
  },
};

export const WithLabels: Story = {
  render: () => {
    const variants: Array<{ variant: StatusVariant; label: string }> = [
      { variant: 'active', label: 'Active' },
      { variant: 'error', label: 'Error' },
      { variant: 'building', label: 'Building...' },
    ];

    return (
      <Layout.VStack gap="md">
        <Layout.VStack gap="sm">
          <Typography.Text variant="caption">With Icon and Label</Typography.Text>
          <Layout.HStack gap="sm">
            {variants.map(({ variant, label }) => (
              <StatusIndicator key={variant} variant={variant} label={label} />
            ))}
          </Layout.HStack>
        </Layout.VStack>
      </Layout.VStack>
    );
  },
};

export const IconOnly: Story = {
  render: () => {
    const variants: StatusVariant[] = [
      'active',
      'error',
      'suspended',
      'shelved',
      'shutoff',
      'down',
      'paused',
      'building',
      'inUse',
      'degraded',
      'offline',
      'noMonitor',
    ];

    return (
      <Layout.VStack gap="md">
        <Typography.Text variant="caption">아이콘만 표시</Typography.Text>
        <Layout.HStack gap="sm" style={{ alignItems: 'center' }}>
          {variants.map((variant) => (
            <StatusIndicator key={variant} variant={variant} layout="iconOnly" />
          ))}
        </Layout.HStack>
      </Layout.VStack>
    );
  },
};

export const UsageExample: Story = {
  render: () => {
    const instances = [
      { id: '1', name: 'web-server-01', status: 'active' as StatusVariant },
      { id: '2', name: 'db-server-01', status: 'error' as StatusVariant },
      { id: '3', name: 'api-server-01', status: 'building' as StatusVariant },
      {
        id: '4',
        name: 'cache-server-01',
        status: 'suspended' as StatusVariant,
      },
      { id: '5', name: 'worker-01', status: 'paused' as StatusVariant },
    ];

    const statusLabels: Record<StatusVariant, string> = {
      active: 'Active',
      error: 'Error',
      suspended: 'Suspended',
      shelved: 'Shelved',
      shutoff: 'Shutoff',
      down: 'Down',
      paused: 'Paused',
      building: 'Building...',
      inUse: 'In Use',
      degraded: 'Degraded',
      offline: 'Offline',
      noMonitor: 'No Monitor',
      pending: 'Pending',
      draft: 'Draft',
      mounted: 'Mounted',
      deleting: 'Deleting',
    };

    return (
      <Layout.VStack gap="md">
        <Typography.Text variant="caption">인스턴스 상태 목록</Typography.Text>
        <Layout.VStack gap="sm">
          {instances.map((instance) => (
            <Layout.HStack key={instance.id} gap="sm" style={{ alignItems: 'center' }}>
              <Typography.Text style={{ minWidth: '120px' }}>{instance.name}</Typography.Text>
              <StatusIndicator variant={instance.status} label={statusLabels[instance.status]} />
            </Layout.HStack>
          ))}
        </Layout.VStack>
      </Layout.VStack>
    );
  },
};

export const SuccessStates: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Text variant="caption">성공 상태</Typography.Text>
      <Layout.HStack gap="sm">
        <StatusIndicator variant="active" label="Active" />
        <StatusIndicator variant="active" label="Running" />
        <StatusIndicator variant="active" label="Healthy" />
      </Layout.HStack>
    </Layout.VStack>
  ),
};

export const ErrorStates: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Text variant="caption">에러 상태</Typography.Text>
      <Layout.HStack gap="sm">
        <StatusIndicator variant="error" label="Error" />
        <StatusIndicator variant="error" label="Failed" />
        <StatusIndicator variant="error" label="Unhealthy" />
      </Layout.HStack>
    </Layout.VStack>
  ),
};

export const ProcessingStates: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Text variant="caption">처리 중 상태</Typography.Text>
      <Layout.HStack gap="sm">
        <StatusIndicator variant="building" label="Building..." />
        <StatusIndicator variant="building" label="Deploying..." />
        <StatusIndicator variant="building" label="Processing..." />
      </Layout.HStack>
    </Layout.VStack>
  ),
};

export const InactiveStates: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Text variant="caption">비활성 상태</Typography.Text>
      <Layout.HStack gap="sm" style={{ flexWrap: 'wrap' }}>
        <StatusIndicator variant="suspended" label="Suspended" />
        <StatusIndicator variant="shutoff" label="Shutoff" />
        <StatusIndicator variant="down" label="Down" />
        <StatusIndicator variant="paused" label="Paused" />
        <StatusIndicator variant="shelved" label="Shelved" />
        <StatusIndicator variant="inUse" label="In Use" />
      </Layout.HStack>
    </Layout.VStack>
  ),
};

export const WarningStates: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Text variant="caption">경고 상태</Typography.Text>
      <Layout.HStack gap="sm">
        <StatusIndicator variant="degraded" label="Degraded" />
        <StatusIndicator variant="noMonitor" label="No Monitor" />
      </Layout.HStack>
    </Layout.VStack>
  ),
};

export const DangerStates: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Text variant="caption">위험 상태</Typography.Text>
      <Layout.HStack gap="sm">
        <StatusIndicator variant="error" label="Error" />
        <StatusIndicator variant="offline" label="Offline" />
      </Layout.HStack>
    </Layout.VStack>
  ),
};

export const IconOnlyWithTooltip: Story = {
  render: () => {
    const variants: Array<{ variant: StatusVariant; label: string }> = [
      { variant: 'active', label: 'Active - 정상 동작 중' },
      { variant: 'error', label: 'Error - 오류 발생' },
      { variant: 'suspended', label: 'Suspended - 일시 중단됨' },
      { variant: 'shelved', label: 'Shelved - 쉘브됨' },
      { variant: 'shutoff', label: 'Shutoff - 종료됨' },
      { variant: 'down', label: 'Down - 다운됨' },
      { variant: 'paused', label: 'Paused - 일시 정지' },
      { variant: 'building', label: 'Building - 구축 중...' },
      { variant: 'inUse', label: 'In Use - 사용 중' },
      { variant: 'degraded', label: 'Degraded - 성능 저하' },
      { variant: 'offline', label: 'Offline - 오프라인' },
      { variant: 'noMonitor', label: 'No Monitor - 모니터링 없음' },
    ];

    return (
      <Layout.VStack gap="md">
        <Typography.Text variant="caption">
          아이콘만 표시하고 툴팁으로 상세 정보 제공
        </Typography.Text>
        <Typography.Text variant="detail" style={{ color: 'var(--semantic-color-textMuted)' }}>
          공간이 제한된 UI에서 유용합니다. 각 아이콘에 호버하여 상세 설명을 확인하세요.
        </Typography.Text>
        <Layout.HStack gap="sm" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          {variants.map(({ variant, label }) => (
            <StatusIndicator
              key={variant}
              variant={variant}
              label={label}
              layout="iconOnly"
              tooltip={label}
            />
          ))}
        </Layout.HStack>
      </Layout.VStack>
    );
  },
};

export const ColorSchemes: Story = {
  render: () => {
    const colorSchemes: StatusColorScheme[] = ['success', 'danger', 'warning', 'muted', 'info'];

    return (
      <Layout.VStack gap="md">
        <Typography.Text variant="caption">색상 스킴별 표시</Typography.Text>
        <Typography.Text variant="detail" style={{ color: 'var(--semantic-color-textMuted)' }}>
          colorScheme prop으로 배경 색상을 직접 지정할 수 있습니다.
        </Typography.Text>
        <Layout.HStack gap="sm" style={{ flexWrap: 'wrap' }}>
          {colorSchemes.map((colorScheme) => (
            <StatusIndicator
              key={colorScheme}
              colorScheme={colorScheme}
              customIcon={<ActiveIcon color="white" size="sm" />}
              label={colorScheme}
            />
          ))}
        </Layout.HStack>
      </Layout.VStack>
    );
  },
};

export const CustomIconWithColorScheme: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Text variant="caption">커스텀 아이콘 + 색상 스킴</Typography.Text>
      <Typography.Text variant="detail" style={{ color: 'var(--semantic-color-textMuted)' }}>
        customIcon과 colorScheme을 조합하여 완전히 커스텀한 상태를 만들 수 있습니다.
      </Typography.Text>
      <Layout.HStack gap="sm" style={{ flexWrap: 'wrap' }}>
        <StatusIndicator
          colorScheme="info"
          customIcon={<BuildingIcon color="white" size="sm" />}
          label="Pending"
        />
        <StatusIndicator
          colorScheme="warning"
          customIcon={<PausedIcon color="white" size="sm" />}
          label="On Hold"
        />
        <StatusIndicator
          colorScheme="success"
          customIcon={<ActiveIcon color="white" size="sm" />}
          label="Verified"
        />
      </Layout.HStack>
    </Layout.VStack>
  ),
};

export const OverrideVariantColor: Story = {
  render: () => (
    <Layout.VStack gap="md">
      <Typography.Text variant="caption">Variant 색상 오버라이드</Typography.Text>
      <Typography.Text variant="detail" style={{ color: 'var(--semantic-color-textMuted)' }}>
        variant의 기본 아이콘을 유지하면서 colorScheme으로 색상만 변경할 수 있습니다.
      </Typography.Text>
      <Layout.HStack gap="sm" style={{ flexWrap: 'wrap' }}>
        <StatusIndicator variant="active" label="Active (기본)" />
        <StatusIndicator variant="active" colorScheme="info" label="Active (info)" />
        <StatusIndicator variant="active" colorScheme="warning" label="Active (warning)" />
        <StatusIndicator variant="building" colorScheme="success" label="Building (success)" />
      </Layout.HStack>
    </Layout.VStack>
  ),
};
