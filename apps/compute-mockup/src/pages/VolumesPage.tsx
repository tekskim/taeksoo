import { VStack, PageHeader, EmptyState, Button } from '../components/shims';
import { IconPlus, IconDatabase } from '@tabler/icons-react';

export function VolumesPage() {
  return (
    <VStack gap={3}>
      <PageHeader
        title="Volumes"
        actions={
          <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
            Create Volume
          </Button>
        }
      />
      <EmptyState
        icon={<IconDatabase size={48} stroke={1} />}
        title="No volumes yet"
        description="Create a volume to attach to your instances."
        action={
          <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
            Create Volume
          </Button>
        }
      />
    </VStack>
  );
}
