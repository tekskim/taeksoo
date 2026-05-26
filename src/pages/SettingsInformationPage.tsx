import { useState } from 'react';
import {
  Breadcrumb,
  VStack,
  SectionCard,
  DetailHeader,
  PageShell,
  TabBar,
  TopBar,
} from '@/design-system';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { IconExternalLink } from '@tabler/icons-react';

/* ----------------------------------------
   Settings Information Page ---------------------------------------- */

export default function SettingsInformationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  return (
    <PageShell
      sidebar={
        <SettingsSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={<TabBar tabs={[]} activeTab="" onTabChange={() => {}} showAddButton={false} />}
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={false}
          breadcrumb={<Breadcrumb items={[{ label: 'Information' }]} />}
        />
      }
      contentClassName="pt-4 px-8 pb-6"
    >
      <VStack gap={6}>
        {/* Header */}
        <div>
          <h1 className="text-heading-h5 leading-6 text-[var(--color-text-default)]">
            Information
          </h1>
        </div>

        <SectionCard>
          <SectionCard.Content>
            <div className="flex flex-col gap-3">
              <label className="font-medium text-[var(--color-text-default)] text-label-lg">
                Version
              </label>
              <div className="flex gap-4">
                <DetailHeader.InfoCard label="Product name" value="Thaki Cloud Suite" />
                <DetailHeader.InfoCard label="Version" value="0.7.0" />
              </div>
            </div>

            <SectionCard.DataRow label="Terms">
              <div className="flex flex-col gap-2">
                <a
                  href="https://thaki.cloud/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-w-0 text-body-md text-[var(--color-action-primary)] hover:underline w-fit"
                >
                  Terms of Service <IconExternalLink size={12} stroke={1.5} />
                </a>
              </div>
            </SectionCard.DataRow>

            <SectionCard.DataRow label="Support">
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
                  User Guide <IconExternalLink size={12} stroke={1.5} />
                </a>
              </div>
            </SectionCard.DataRow>
          </SectionCard.Content>
        </SectionCard>
      </VStack>
    </PageShell>
  );
}
