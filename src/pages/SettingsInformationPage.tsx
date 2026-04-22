import { VStack, SectionCard, DetailHeader, PageShell, TabBar } from '@/design-system';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Settings Information Page ---------------------------------------- */

export default function SettingsInformationPage() {
  const sidebarWidth = 200;

  return (
    <PageShell
      sidebar={<SettingsSidebar />}
      sidebarWidth={sidebarWidth}
      tabBar={<TabBar tabs={[]} activeTab="" onTabChange={() => {}} showAddButton={false} />}
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* Header */}
        <div>
          <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
            Information{' '}
          </h1>
          <p className="text-body-md leading-[18px] text-[var(--color-text-muted)] mt-1">
            View application version and related resources.
          </p>
        </div>

        {/* Version */}
        <SectionCard>
          <SectionCard.Header title="Version" />
          <SectionCard.Content>
            <div className="flex gap-4">
              <DetailHeader.InfoCard label="Product name" value="Thaki Cloud Suite" />
              <DetailHeader.InfoCard label="Version" value="0.7.0" />
            </div>
          </SectionCard.Content>
        </SectionCard>

        {/* Terms */}
        <SectionCard>
          <SectionCard.Header title="Terms" />
          <SectionCard.Content>
            <div className="flex flex-col gap-2">
              <a
                href="https://thaki.cloud/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-w-0 text-body-md text-[var(--color-action-primary)] hover:underline w-fit"
              >
                Terms of Service <IconExternalLink size={12} stroke={1.5} />
              </a>
              <a
                href="https://thaki.cloud/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-w-0 text-body-md text-[var(--color-action-primary)] hover:underline w-fit"
              >
                Privacy Policy <IconExternalLink size={12} stroke={1.5} />
              </a>
            </div>
          </SectionCard.Content>
        </SectionCard>

        {/* Support */}
        <SectionCard>
          <SectionCard.Header title="Support" />
          <SectionCard.Content>
            <div className="flex flex-col gap-2">
              <a
                href="https://thaki.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-w-0 text-body-md text-[var(--color-action-primary)] hover:underline w-fit"
              >
                Official Website <IconExternalLink size={12} stroke={1.5} />
              </a>
              <a
                href="https://support.thaki.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-w-0 text-body-md text-[var(--color-action-primary)] hover:underline w-fit"
              >
                Support Center <IconExternalLink size={12} stroke={1.5} />
              </a>
            </div>
          </SectionCard.Content>
        </SectionCard>
      </VStack>
    </PageShell>
  );
}
