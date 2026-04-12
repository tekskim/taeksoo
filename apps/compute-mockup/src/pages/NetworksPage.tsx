import { VStack, PageHeader, EmptyState, Button } from '../components/shims';
import { IconPlus, IconNetwork } from '@tabler/icons-react';

export function NetworksPage() {
  return (
    <VStack gap={3}>
      <PageHeader
        title="Networks"
        actions={
          <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
            Create Network
          </Button>
        }
      />
      <EmptyState
        icon={<IconNetwork size={48} stroke={1} />}
        title="No networks yet"
        description="Create a network to get started."
        action={
          <Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>
            Create Network
          </Button>
        }
      />
    </VStack>
  );
}
