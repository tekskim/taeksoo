import Layout from '@shared/components/Layout';
import { Fieldset } from '@shared/components/Fieldset';
import { FormField } from '@shared/components/FormField';
import { Input } from '@shared/components/Input';
import { DetailPageHeader } from '@shared/components/DetailPageHeader';
import type { DetailPageHeaderInfoField } from '@shared/components/DetailPageHeader';
import { SectionCard } from '@shared/components/SectionCard';
import { EmptyUI } from '@shared/components/EmptyUI';
import { FloatingCard } from '@shared/components/FloatingCard';
import { Button } from '@shared/components/Button';
import { StatusIndicator } from '@shared/components/StatusIndicator';

function DesignSection({
  title,
  importPath,
  children,
}: {
  title: string;
  importPath: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">{title}</h2>
        <p className="text-13 leading-20 text-text-muted m-0">{importPath}</p>
      </div>
      <div className="p-6 rounded-xl border border-border bg-surface">{children}</div>
    </section>
  );
}

const demoInfoFields: DetailPageHeaderInfoField[] = [
  {
    label: 'Status',
    value: 'Active',
    accessory: <StatusIndicator variant="active" layout="iconOnly" />,
  },
  { label: 'Resource ID', value: 'res-7f3a9c2e', showCopyButton: true, copyText: 'res-7f3a9c2e' },
  { label: 'Region', value: 'ap-northeast-2' },
  { label: 'Created at', value: 'Mar 20, 2026 14:22:10' },
];

export function DesignLayoutComponentsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] leading-[30px] font-semibold text-text m-0">
          Layout components
        </h1>
        <p className="text-13 leading-20 text-text-muted m-0">
          Live examples of layout primitives, field grouping, detail headers, and summary cards.
        </p>
      </div>

      <DesignSection
        title="Layout.VStack"
        importPath="@shared/components/Layout — VStack (gap: xs | sm | md | lg)"
      >
        <Layout.VStack gap="lg" className="w-full">
          {(['xs', 'sm', 'md', 'lg'] as const).map((g) => (
            <div key={g} className="flex flex-col gap-2">
              <span className="text-12 font-medium text-text-muted">gap=&quot;{g}&quot;</span>
              <Layout.VStack
                gap={g}
                className="w-full p-3 rounded-lg bg-surface-muted border border-border-subtle"
              >
                <div className="h-8 rounded-md bg-primary/15 border border-border" />
                <div className="h-8 rounded-md bg-primary/15 border border-border" />
                <div className="h-8 rounded-md bg-primary/15 border border-border" />
              </Layout.VStack>
            </div>
          ))}
        </Layout.VStack>
      </DesignSection>

      <DesignSection
        title="Layout.HStack"
        importPath="@shared/components/Layout — HStack (align, justify)"
      >
        <Layout.VStack gap="md" className="w-full">
          <div className="flex flex-col gap-2">
            <span className="text-12 font-medium text-text-muted">
              align=&quot;center&quot; justify=&quot;between&quot;
            </span>
            <Layout.HStack
              align="center"
              justify="between"
              className="w-full p-3 rounded-lg bg-surface-muted border border-border-subtle"
            >
              <span className="text-12 text-text">Left</span>
              <span className="text-12 text-text">Right</span>
            </Layout.HStack>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-12 font-medium text-text-muted">
              align=&quot;start&quot; gap=&quot;sm&quot;
            </span>
            <Layout.HStack
              align="start"
              gap="sm"
              className="w-full p-3 rounded-lg bg-surface-muted border border-border-subtle min-h-[48px]"
            >
              <div className="size-6 rounded bg-primary/20 shrink-0" />
              <div className="text-12 text-text">Start-aligned row</div>
            </Layout.HStack>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-12 font-medium text-text-muted">
              align=&quot;end&quot; justify=&quot;center&quot; gap=&quot;md&quot;
            </span>
            <Layout.HStack
              align="end"
              justify="center"
              gap="md"
              className="w-full p-3 rounded-lg bg-surface-muted border border-border-subtle min-h-[56px]"
            >
              <div className="h-6 w-16 rounded bg-primary/20" />
              <div className="h-10 w-16 rounded bg-primary/30" />
            </Layout.HStack>
          </div>
        </Layout.VStack>
      </DesignSection>

      <DesignSection
        title="Layout.Container"
        importPath="@shared/components/Layout — Container (maxWidth: sm | md | lg | xl)"
      >
        <Layout.VStack gap="md" className="w-full">
          {(['sm', 'md', 'lg', 'xl'] as const).map((mw) => (
            <Layout.Container
              key={mw}
              maxWidth={mw}
              padding="md"
              className="w-full mx-auto bg-surface-muted border border-dashed border-border rounded-lg"
            >
              <p className="text-12 text-text m-0">
                maxWidth=&quot;{mw}&quot; — constrained content width inside the dashed box.
              </p>
            </Layout.Container>
          ))}
        </Layout.VStack>
      </DesignSection>

      <DesignSection title="Fieldset" importPath="@shared/components/Fieldset">
        <Layout.VStack gap="lg" className="w-full">
          <Fieldset
            legend="Default variant"
            variant="default"
            description="Grouped fields with default surface."
          >
            <FormField label="Display name">
              <Input placeholder="My resource" className="w-full" />
            </FormField>
            <FormField label="Description">
              <Input placeholder="Optional" className="w-full" />
            </FormField>
          </Fieldset>
          <Fieldset
            legend="Bordered"
            variant="bordered"
            description="Stronger boundary for dense forms."
          >
            <FormField label="Project">
              <Input placeholder="Select project" className="w-full" />
            </FormField>
          </Fieldset>
          <Fieldset
            legend="Elevated"
            variant="elevated"
            description="Raised grouping for emphasis."
          >
            <FormField label="API endpoint">
              <Input placeholder="https://api.example.com" className="w-full" />
            </FormField>
          </Fieldset>
        </Layout.VStack>
      </DesignSection>

      <DesignSection title="DetailPageHeader" importPath="@shared/components/DetailPageHeader">
        <DetailPageHeader
          title="production-api-cluster"
          actions={
            <>
              <Button appearance="secondary" size="sm">
                Edit
              </Button>
              <Button appearance="primary" size="sm">
                Create snapshot
              </Button>
            </>
          }
          infoFields={demoInfoFields}
        />
      </DesignSection>

      <DesignSection title="SectionCard" importPath="@shared/components/SectionCard — compound API">
        <Layout.VStack gap="lg" className="w-full">
          <SectionCard>
            <SectionCard.Header
              title="Basic information"
              description="Read-only metadata for this resource."
              showDivider
              actions={
                <Button appearance="secondary" size="sm">
                  Edit
                </Button>
              }
            />
            <SectionCard.Content>
              <SectionCard.DataRow label="Name" value="web-tier-asg" />
              <SectionCard.DataRow label="Environment" value="production" />
              <SectionCard.DataRow label="VPC" value="vpc-main" isLink linkHref="/design" />
            </SectionCard.Content>
          </SectionCard>

          <SectionCard isActive>
            <SectionCard.Header
              title="Open section (isActive)"
              description="Active wizard-style card; header divider can be hidden inside content flows."
              showDivider={false}
              actions={
                <Button appearance="ghost" size="sm">
                  Collapse
                </Button>
              }
            />
            <SectionCard.Content showDividers={false}>
              <div className="w-full h-px bg-border-subtle" />
              <div className="py-4">
                <p className="text-12 text-text-muted m-0">
                  Content with <code className="text-11">showDivider=false</code> on the header and
                  manual dividers in the body matches create-flow patterns.
                </p>
              </div>
            </SectionCard.Content>
          </SectionCard>
        </Layout.VStack>
      </DesignSection>

      <DesignSection title="EmptyUI" importPath="@shared/components/EmptyUI">
        <div className="min-h-[200px] w-full rounded-lg border border-dashed border-border overflow-hidden">
          <EmptyUI
            content={{
              title: 'No resources yet',
              description: 'Create a resource to see it listed here.',
            }}
          >
            <Button appearance="primary" size="sm">
              Create resource
            </Button>
          </EmptyUI>
        </div>
      </DesignSection>

      <DesignSection title="FloatingCard" importPath="@shared/components/FloatingCard">
        <FloatingCard
          summaryTitle="Deployment summary"
          sections={[
            {
              id: 'compute',
              title: 'Compute',
              status: 'success',
              items: [
                { label: 'Instances', status: 'success' },
                { label: 'Volumes', status: 'processing' },
              ],
            },
            {
              id: 'network',
              title: 'Network',
              status: 'warning',
              items: [{ label: 'Floating IPs', status: 'warning' }],
            },
          ]}
          quotaTitle="Quota"
          quotas={[
            { label: 'vCPU', used: 42, limit: 64, pending: 8 },
            { label: 'RAM (GiB)', used: 96, limit: 256 },
          ]}
          className="max-w-md"
        />
      </DesignSection>
    </div>
  );
}
