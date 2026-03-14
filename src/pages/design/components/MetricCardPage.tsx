import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { MetricCard, VStack, Badge } from '@/design-system';

const metricCardProps: PropDef[] = [
  { name: 'title', type: 'string', required: true, description: 'Metric title' },
  { name: 'value', type: 'string | number', required: true, description: 'Metric value' },
  {
    name: 'tooltip',
    type: 'string',
    required: false,
    description: 'Tooltip text (shows info icon)',
  },
  {
    name: 'extra',
    type: 'ReactNode',
    required: false,
    description: 'Extra content next to value (e.g. badge, status)',
  },
  { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
];

function MetricCardPreview() {
  return (
    <MetricCard.Group>
      <MetricCard
        title="Pod restarts"
        value={0}
        tooltip="Pod restarts indicates how many times a container within the pod has been restarted by Kubernetes."
      />
      <MetricCard
        title="Ready"
        value="3/3"
        tooltip="'Ready' indicates how many Deployment pods are currently running and passing readiness checks."
      />
      <MetricCard
        title="Up-to-date"
        value={3}
        tooltip="Up-to-date shows how many pods have been updated to the Deployment's latest specification."
      />
      <MetricCard
        title="Available"
        value={3}
        tooltip="'Available' represents how many pods are fully ready and available to serve user requests."
      />
    </MetricCard.Group>
  );
}

export function MetricCardPage() {
  return (
    <ComponentPageTemplate
      title="Metric Card"
      description="Card for displaying a single metric with title, value, and optional tooltip. MetricCard.Group lays out multiple cards in a row."
      whenToUse={[
        '대시보드에서 주요 지표 표시',
        'Detail 페이지의 메트릭 요약',
        '모니터링 화면의 지표 표시',
      ]}
      whenNotToUse={['단순 key-value 표시 → InfoBox 사용', '상세 정보 카드 → SectionCard 사용']}
      preview={
        <ComponentPreview
          code={`<MetricCard.Group>
  <MetricCard title="Pod restarts" value={0} tooltip="..." />
  <MetricCard title="Ready" value="3/3" tooltip="..." />
  <MetricCard title="Up-to-date" value={3} tooltip="..." />
  <MetricCard title="Available" value={3} tooltip="..." />
</MetricCard.Group>`}
        >
          <MetricCardPreview />
        </ComponentPreview>
      }
      props={metricCardProps}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>With Tooltip</Label>
            <MetricCard.Group>
              <MetricCard
                title="Pod restarts"
                value={3}
                tooltip="Total number of container restarts."
              />
              <MetricCard title="CPU usage" value="45%" tooltip="Current CPU utilization." />
              <MetricCard
                title="Memory usage"
                value="1.2 GB"
                tooltip="Current memory utilization."
              />
              <MetricCard
                title="Network I/O"
                value="120 MB/s"
                tooltip="Current network throughput."
              />
            </MetricCard.Group>
          </VStack>

          <VStack gap={3}>
            <Label>Without Tooltip</Label>
            <MetricCard.Group>
              <MetricCard title="Total instances" value={42} />
              <MetricCard title="Running" value={38} />
              <MetricCard title="Stopped" value={4} />
            </MetricCard.Group>
          </VStack>

          <VStack gap={3}>
            <Label>With Extra Content</Label>
            <MetricCard.Group>
              <MetricCard
                title="Status"
                value="Healthy"
                extra={
                  <Badge variant="success" size="sm">
                    OK
                  </Badge>
                }
              />
              <MetricCard
                title="Alerts"
                value={2}
                extra={
                  <Badge variant="danger" size="sm">
                    Critical
                  </Badge>
                }
              />
              <MetricCard title="Uptime" value="99.9%" tooltip="Service uptime percentage." />
            </MetricCard.Group>
          </VStack>

          <VStack gap={3}>
            <Label>Single Card (Fixed Width)</Label>
            <div className="w-[240px]">
              <MetricCard
                title="Replicas"
                value="3 / 3"
                tooltip="Current available replicas / desired replicas."
              />
            </div>
          </VStack>
        </VStack>
      }
      usage={{
        code: `import { MetricCard } from '@/design-system';

// Group layout
<MetricCard.Group>
  <MetricCard title="Pod restarts" value={0} tooltip="Total restarts." />
  <MetricCard title="Ready" value="3/3" tooltip="Ready pods." />
  <MetricCard title="Up-to-date" value={3} tooltip="Updated pods." />
  <MetricCard title="Available" value={3} tooltip="Available pods." />
</MetricCard.Group>

// With extra content
<MetricCard
  title="Status"
  value="Healthy"
  extra={<Badge variant="success" size="sm">OK</Badge>}
/>`,
      }}
      relatedLinks={[
        { label: 'Info Box', path: '/design/components/info-box' },
        { label: 'Section Card', path: '/design/components/section-card' },
      ]}
    />
  );
}
