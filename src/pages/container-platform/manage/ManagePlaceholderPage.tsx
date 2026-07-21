import { PageHeader, VStack, EmptyState } from '@/design-system';
import { useParams } from 'react-router-dom';
import { ManageShell, useManageCluster } from './ManageShell';

/* ----------------------------------------
   Cluster manage — placeholder sections

   Services & Ingress / Config / Policy exist in the manage IA but their screens
   have not been moved over yet. A page-level empty state (no actions) keeps the
   menu honest for the review: the slot is real, the screen is next.
   ---------------------------------------- */

const SECTIONS: Record<string, { title: string; resources: string }> = {
  services: {
    title: 'Services & Ingress',
    resources: 'Services and Ingresses',
  },
  config: {
    title: 'Config',
    resources: 'ConfigMaps and Secrets',
  },
  policy: {
    title: 'Policy',
    resources: 'HPA, LimitRanges, ResourceQuotas, NetworkPolicies, and PodDisruptionBudgets',
  },
};

export default function ManagePlaceholderPage() {
  const { clusterId } = useManageCluster();
  const { section = '' } = useParams<{ section: string }>();
  const meta = SECTIONS[section] ?? { title: 'Section', resources: 'These resources' };

  return (
    <ManageShell clusterId={clusterId} crumb={meta.title}>
      <VStack gap={4}>
        <PageHeader title={meta.title} />
        <EmptyState
          title="Not wired up in this prototype yet"
          description={`${meta.resources} for this cluster will be managed here. The existing management screens move over in a later iteration.`}
        />
      </VStack>
    </ManageShell>
  );
}
