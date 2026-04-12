import { useParams, useNavigate } from 'react-router-dom';
import {
  VStack,
  Button,
  DetailHeader,
  SectionCard,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  StatusIndicator,
  Badge,
  ContextMenu,
} from '../components/shims';
import { useState } from 'react';
import {
  IconTerminal2,
  IconPlayerPlay,
  IconPlayerStop,
  IconChevronDown,
} from '@tabler/icons-react';

const MOCK_INSTANCE = {
  id: 'i-001',
  name: 'web-server-01',
  status: 'active' as const,
  flavor: 'm1.medium',
  vcpu: '2 vCPU',
  memory: '4 GB',
  ip: '10.0.0.1',
  floatingIp: '203.0.113.10',
  az: 'kr-1a',
  image: 'Ubuntu 22.04 LTS',
  keyPair: 'my-key',
  network: 'default-network',
  createdAt: '2026-03-15 09:23:00',
  updatedAt: '2026-03-20 14:11:00',
};

const moreActions = [
  { id: 'resize', label: 'Resize', onClick: () => alert('Resize') },
  { id: 'snapshot', label: 'Create Snapshot', onClick: () => alert('Create Snapshot') },
  {
    id: 'delete',
    label: 'Delete',
    status: 'danger' as const,
    divider: true,
    onClick: () => alert('Delete'),
  },
];

export function InstanceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const instance = { ...MOCK_INSTANCE, id: id ?? 'i-001' };

  return (
    <VStack gap={4}>
      <button
        className="text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] self-start"
        onClick={() => navigate('/')}
      >
        ← Back to Instances
      </button>

      <DetailHeader>
        <DetailHeader.Title>{instance.name}</DetailHeader.Title>

        <DetailHeader.Actions>
          <Button variant="secondary" size="sm" leftIcon={<IconTerminal2 size={12} />}>
            Console
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<IconPlayerPlay size={12} />}>
            Start
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<IconPlayerStop size={12} />}>
            Stop
          </Button>
          <ContextMenu items={moreActions} trigger="click">
            <Button variant="secondary" size="sm" rightIcon={<IconChevronDown size={12} />}>
              More Actions
            </Button>
          </ContextMenu>
        </DetailHeader.Actions>

        <DetailHeader.InfoGrid>
          <DetailHeader.InfoCard label="Status" status={instance.status} />
          <DetailHeader.InfoCard label="ID" value={instance.id} copyable />
          <DetailHeader.InfoCard label="Flavor" value={instance.flavor} />
          <DetailHeader.InfoCard label="AZ" value={instance.az} />
          <DetailHeader.InfoCard label="IP" value={instance.ip} />
          <DetailHeader.InfoCard label="Created at" value={instance.createdAt} />
        </DetailHeader.InfoGrid>
      </DetailHeader>

      <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="volumes">Volumes</Tab>
          <Tab value="network">Network</Tab>
          <Tab value="monitoring">Monitoring</Tab>
        </TabList>

        <TabPanel value="overview" className="pt-0">
          <VStack gap={4} className="pt-4">
            <SectionCard>
              <SectionCard.Header
                title="Basic Information"
                actions={
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                }
              />
              <SectionCard.Content>
                <SectionCard.DataRow label="Name" value={instance.name} />
                <SectionCard.DataRow label="Status">
                  <StatusIndicator status={instance.status} />
                </SectionCard.DataRow>
                <SectionCard.DataRow label="Flavor" value={instance.flavor} />
                <SectionCard.DataRow label="Image" value={instance.image} />
                <SectionCard.DataRow label="Key Pair" value={instance.keyPair} />
                <SectionCard.DataRow label="Availability Zone">
                  <Badge variant="info" size="sm">
                    {instance.az}
                  </Badge>
                </SectionCard.DataRow>
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Network" />
              <SectionCard.Content>
                <SectionCard.DataRow
                  label="Network"
                  value={instance.network}
                  isLink
                  linkHref="/networks"
                />
                <SectionCard.DataRow label="Private IP" value={instance.ip} />
                <SectionCard.DataRow label="Floating IP" value={instance.floatingIp} />
              </SectionCard.Content>
            </SectionCard>

            <SectionCard>
              <SectionCard.Header title="Timestamps" />
              <SectionCard.Content>
                <SectionCard.DataRow label="Created at" value={instance.createdAt} />
                <SectionCard.DataRow label="Updated at" value={instance.updatedAt} />
              </SectionCard.Content>
            </SectionCard>
          </VStack>
        </TabPanel>

        <TabPanel value="volumes" className="pt-4">
          <p className="text-xs text-[var(--color-text-subtle)]">
            Volumes 탭 — 목업 내용을 여기에 추가하세요.
          </p>
        </TabPanel>

        <TabPanel value="network" className="pt-4">
          <p className="text-xs text-[var(--color-text-subtle)]">
            Network 탭 — 목업 내용을 여기에 추가하세요.
          </p>
        </TabPanel>

        <TabPanel value="monitoring" className="pt-4">
          <p className="text-xs text-[var(--color-text-subtle)]">
            Monitoring 탭 — 목업 내용을 여기에 추가하세요.
          </p>
        </TabPanel>
      </Tabs>
    </VStack>
  );
}
