import { useNavigate } from 'react-router-dom';
import { VStack, PageHeader } from '@/design-system';
import {
  IconServer,
  IconNetwork,
  IconShield,
  IconDatabase,
  IconBox,
  IconUsers,
  IconArrowLeft,
} from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface CreatePageLink {
  label: string;
  path: string;
  yaml?: string;
}

interface CreatePageSection {
  title: string;
  icon: React.ReactNode;
  links: CreatePageLink[];
}

/* ----------------------------------------
   Data
   ---------------------------------------- */

const sections: CreatePageSection[] = [
  {
    title: 'Compute',
    icon: <IconServer size={16} stroke={1.5} />,
    links: [
      { label: 'Create Instance', path: '/compute/instances/create-v2' },
      { label: 'Create Instance Template', path: '/compute/instance-templates/create-v2' },
      { label: 'Create Image', path: '/compute/images/create-v2' },
      { label: 'Create Volume', path: '/compute/volumes/create-v2' },
      { label: 'Create Load Balancer', path: '/compute/load-balancers/create-v2' },
    ],
  },
  {
    title: 'Compute - Network',
    icon: <IconNetwork size={16} stroke={1.5} />,
    links: [
      { label: 'Create Network', path: '/compute/networks/create-v2' },
      { label: 'Create Virtual Adapter (Port)', path: '/compute/ports/create-v2' },
    ],
  },
  {
    title: 'Compute Admin',
    icon: <IconShield size={16} stroke={1.5} />,
    links: [
      { label: 'Create Instance (Admin)', path: '/compute-admin/instances/create-v2' },
      {
        label: 'Create Instance Template (Admin)',
        path: '/compute-admin/instance-templates/create-v2',
      },
      { label: 'Create Image (Admin)', path: '/compute-admin/images/create-v2' },
      { label: 'Create Flavor (Admin)', path: '/compute-admin/flavors/create-v2' },
      { label: 'Create Network (Admin)', path: '/compute-admin/networks/create-v2' },
      { label: 'Create Firewall Rule (Admin)', path: '/compute-admin/firewall/create-rule-v2' },
    ],
  },
  {
    title: 'Storage',
    icon: <IconDatabase size={16} stroke={1.5} />,
    links: [{ label: 'Create Bucket', path: '/storage/buckets/create-v2' }],
  },
  {
    title: 'Container - Cluster',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      { label: 'Create Cluster', path: '/container/cluster-management/create-v2' },
      {
        label: 'Create Namespace',
        path: '/container/namespaces/create-v2',
        yaml: '/container/namespaces/create-yaml-v2',
      },
    ],
  },
  {
    title: 'Container - Workloads',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      {
        label: 'Create Deployment',
        path: '/container/deployments/create-v2',
        yaml: '/container/deployments/create-yaml-v2',
      },
      {
        label: 'Create StatefulSet',
        path: '/container/statefulsets/create-v2',
        yaml: '/container/statefulsets/create-yaml-v2',
      },
      {
        label: 'Create DaemonSet',
        path: '/container/daemonsets/create-v2',
        yaml: '/container/daemonsets/create-yaml-v2',
      },
      {
        label: 'Create Job',
        path: '/container/jobs/create-v2',
        yaml: '/container/jobs/create-yaml-v2',
      },
      {
        label: 'Create CronJob',
        path: '/container/cronjobs/create-v2',
        yaml: '/container/cronjobs/create-yaml-v2',
      },
      {
        label: 'Create Pod',
        path: '/container/pods/create-v2',
        yaml: '/container/pods/create-yaml-v2',
      },
    ],
  },
  {
    title: 'Container - Service Discovery',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      {
        label: 'Create Service',
        path: '/container/services/create-v2',
        yaml: '/container/services/create-yaml-v2',
      },
      {
        label: 'Create Ingress',
        path: '/container/ingresses/create-v2',
        yaml: '/container/ingresses/create-yaml-v2',
      },
      {
        label: 'Create HPA',
        path: '/container/hpa/create-v2',
        yaml: '/container/hpa/create-yaml-v2',
      },
    ],
  },
  {
    title: 'Container - Storage',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      {
        label: 'Create Persistent Volume',
        path: '/container/persistent-volumes/create-v2',
        yaml: '/container/persistent-volumes/create-yaml-v2',
      },
      {
        label: 'Create Persistent Volume Claim',
        path: '/container/pvc/create-v2',
        yaml: '/container/pvc/create-yaml-v2',
      },
      {
        label: 'Create Storage Class',
        path: '/container/storage-classes/create-v2',
        yaml: '/container/storage-classes/create-yaml-v2',
      },
      {
        label: 'Create ConfigMap',
        path: '/container/configmaps/create-v2',
        yaml: '/container/configmaps/create-yaml-v2',
      },
      {
        label: 'Create Secret',
        path: '/container/secrets/create-v2',
        yaml: '/container/secrets/create-yaml-v2',
      },
    ],
  },
  {
    title: 'Container - Policy',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      {
        label: 'Create Limit Range',
        path: '/container/limit-ranges/create-v2',
        yaml: '/container/limit-ranges/create-yaml-v2',
      },
      {
        label: 'Create Resource Quota',
        path: '/container/resource-quotas/create-v2',
        yaml: '/container/resource-quotas/create-yaml-v2',
      },
      {
        label: 'Create Network Policy',
        path: '/container/network-policies/create-v2',
        yaml: '/container/network-policies/create-yaml-v2',
      },
      {
        label: 'Create Pod Disruption Budget',
        path: '/container/pdb/create-v2',
        yaml: '/container/pdb/create-yaml-v2',
      },
    ],
  },
  {
    title: 'IAM',
    icon: <IconUsers size={16} stroke={1.5} />,
    links: [
      { label: 'Create User', path: '/iam/users/create-v2' },
      { label: 'Create User Group', path: '/iam/user-groups/create-v2' },
      { label: 'Create Role', path: '/iam/roles/create-v2' },
      { label: 'Create Policy', path: '/iam/policies/create-v2' },
      { label: 'Create System Administrator', path: '/iam/system-administrators/create-v2' },
    ],
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function DetailPagesDirectoryPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--color-surface-default)]">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <VStack gap={6}>
          {/* Back button + Header */}
          <VStack gap={4}>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-body-md text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors w-fit"
            >
              <IconArrowLeft size={14} stroke={1.5} />
              Back to Home
            </button>
            <PageHeader title="Create Pages Directory" />
            <p className="text-body-md text-[var(--color-text-subtle)]">
              모든 Create 페이지에 대한 빠른 접근 링크입니다. 총{' '}
              {sections.reduce((acc, s) => acc + s.links.length, 0)}개의 Create 페이지가 있습니다.
            </p>
          </VStack>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden"
              >
                {/* Section Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
                  <span className="text-[var(--color-text-muted)]">{section.icon}</span>
                  <span className="text-label-lg text-[var(--color-text-default)]">
                    {section.title}
                  </span>
                  <span className="text-body-sm text-[var(--color-text-subtle)] ml-auto">
                    {section.links.length}
                  </span>
                </div>

                {/* Links */}
                <div className="divide-y divide-[var(--color-border-subtle)]">
                  {section.links.map((link) => (
                    <div
                      key={link.path}
                      className="flex items-center justify-between gap-2 px-4 py-2.5"
                    >
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-body-md text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] hover:underline truncate text-left"
                      >
                        {link.label}
                      </button>
                      {link.yaml && (
                        <button
                          onClick={() => navigate(link.yaml!)}
                          className="text-body-sm text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] whitespace-nowrap px-2 py-0.5 rounded-[var(--primitive-radius-sm)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors"
                        >
                          YAML
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </VStack>
      </div>
    </div>
  );
}

export default DetailPagesDirectoryPage;
