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
      { label: 'Create Instance', path: '/compute/instances/create' },
      { label: 'Create Instance Template', path: '/compute/instance-templates/create' },
      { label: 'Create Image', path: '/compute/images/create' },
      { label: 'Create Volume', path: '/compute/volumes/create' },
      { label: 'Create Load Balancer', path: '/compute/load-balancers/create' },
    ],
  },
  {
    title: 'Compute - Network',
    icon: <IconNetwork size={16} stroke={1.5} />,
    links: [
      { label: 'Create Network', path: '/compute/networks/create' },
      { label: 'Create Virtual Adapter (Port)', path: '/compute/ports/create' },
    ],
  },
  {
    title: 'Compute Admin',
    icon: <IconShield size={16} stroke={1.5} />,
    links: [
      { label: 'Create Instance (Admin)', path: '/compute-admin/instances/create' },
      {
        label: 'Create Instance Template (Admin)',
        path: '/compute-admin/instance-templates/create',
      },
      { label: 'Create Image (Admin)', path: '/compute-admin/images/create' },
      { label: 'Create Flavor (Admin)', path: '/compute-admin/flavors/create' },
      { label: 'Create Network (Admin)', path: '/compute-admin/networks/create' },
      { label: 'Create Firewall Rule (Admin)', path: '/compute-admin/firewall/create-rule' },
    ],
  },
  {
    title: 'Storage',
    icon: <IconDatabase size={16} stroke={1.5} />,
    links: [{ label: 'Create Bucket', path: '/storage/buckets/create' }],
  },
  {
    title: 'Container - Cluster',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      { label: 'Create Cluster', path: '/container/cluster-management/create' },
      {
        label: 'Create Namespace',
        path: '/container/namespaces/create',
        yaml: '/container/namespaces/create-yaml',
      },
    ],
  },
  {
    title: 'Container - Workloads',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      {
        label: 'Create Deployment',
        path: '/container/deployments/create',
        yaml: '/container/deployments/create-yaml',
      },
      {
        label: 'Create StatefulSet',
        path: '/container/statefulsets/create',
        yaml: '/container/statefulsets/create-yaml',
      },
      {
        label: 'Create DaemonSet',
        path: '/container/daemonsets/create',
        yaml: '/container/daemonsets/create-yaml',
      },
      { label: 'Create Job', path: '/container/jobs/create', yaml: '/container/jobs/create-yaml' },
      {
        label: 'Create CronJob',
        path: '/container/cronjobs/create',
        yaml: '/container/cronjobs/create-yaml',
      },
      { label: 'Create Pod', path: '/container/pods/create', yaml: '/container/pods/create-yaml' },
    ],
  },
  {
    title: 'Container - Service Discovery',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      {
        label: 'Create Service',
        path: '/container/services/create',
        yaml: '/container/services/create-yaml',
      },
      {
        label: 'Create Ingress',
        path: '/container/ingresses/create',
        yaml: '/container/ingresses/create-yaml',
      },
      { label: 'Create HPA', path: '/container/hpa/create', yaml: '/container/hpa/create-yaml' },
    ],
  },
  {
    title: 'Container - Storage',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      {
        label: 'Create Persistent Volume',
        path: '/container/persistent-volumes/create',
        yaml: '/container/persistent-volumes/create-yaml',
      },
      {
        label: 'Create Persistent Volume Claim',
        path: '/container/pvc/create',
        yaml: '/container/pvc/create-yaml',
      },
      {
        label: 'Create Storage Class',
        path: '/container/storage-classes/create',
        yaml: '/container/storage-classes/create-yaml',
      },
      {
        label: 'Create ConfigMap',
        path: '/container/configmaps/create',
        yaml: '/container/configmaps/create-yaml',
      },
      {
        label: 'Create Secret',
        path: '/container/secrets/create',
        yaml: '/container/secrets/create-yaml',
      },
    ],
  },
  {
    title: 'Container - Policy',
    icon: <IconBox size={16} stroke={1.5} />,
    links: [
      {
        label: 'Create Limit Range',
        path: '/container/limit-ranges/create',
        yaml: '/container/limit-ranges/create-yaml',
      },
      {
        label: 'Create Resource Quota',
        path: '/container/resource-quotas/create',
        yaml: '/container/resource-quotas/create-yaml',
      },
      {
        label: 'Create Network Policy',
        path: '/container/network-policies/create',
        yaml: '/container/network-policies/create-yaml',
      },
      {
        label: 'Create Pod Disruption Budget',
        path: '/container/pdb/create',
        yaml: '/container/pdb/create-yaml',
      },
    ],
  },
  {
    title: 'IAM',
    icon: <IconUsers size={16} stroke={1.5} />,
    links: [
      { label: 'Create User', path: '/iam/users/create' },
      { label: 'Create User Group', path: '/iam/user-groups/create' },
      { label: 'Create Role', path: '/iam/roles/create' },
      { label: 'Create Policy', path: '/iam/policies/create' },
      { label: 'Create System Administrator', path: '/iam/system-administrators/create' },
    ],
  },
];

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function CreatePagesDirectoryPage() {
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

export default CreatePagesDirectoryPage;
