import { PageShell, PageHeader, TopBar, Breadcrumb, VStack } from '@/design-system';
import { useNavigate } from 'react-router-dom';
import {
  ContainerPlatformSidebar,
  CONTAINER_PLATFORM_SIDEBAR_WIDTH,
} from './ContainerPlatformSidebar';

export default function WorkloadsPage() {
  const navigate = useNavigate();

  return (
    <PageShell
      sidebar={<ContainerPlatformSidebar />}
      sidebarWidth={CONTAINER_PLATFORM_SIDEBAR_WIDTH}
      topBar={
        <TopBar
          showNavigation
          onBack={() => navigate(-1)}
          onForward={() => navigate(1)}
          breadcrumb={<Breadcrumb items={[{ label: 'Workloads' }]} />}
        />
      }
    >
      <VStack gap={3}>
        <PageHeader title="Workloads" />
        <span className="text-body-md text-[var(--color-text-muted)]">Coming in a later phase</span>
      </VStack>
    </PageShell>
  );
}
