import {
  IconBook,
  IconPalette,
  IconComponents,
  IconStack2,
  IconChecklist,
  IconListNumbers,
  IconPackages,
  IconBoxMultiple,
  IconLayoutSidebar,
  IconTopologyRing3,
  IconForms,
  IconTemplate,
} from '@tabler/icons-react';
import type { NavItem, NavGroup } from '../design/_shared/navigationData';

const figmaItems: NavItem[] = [
  {
    id: 'figma-guide',
    label: 'Migration Guide',
    icon: IconBook,
    path: '/lab/figma/guide',
  },
  {
    id: 'figma-foundation',
    label: 'Foundation Capture',
    icon: IconPalette,
    path: '/lab/figma/foundation',
  },
  {
    id: 'figma-components',
    label: 'Components Capture',
    icon: IconComponents,
    path: '/lab/figma/components',
  },
];

const auditItems: NavItem[] = [
  {
    id: 'audit-checklist',
    label: 'Audit Checklist',
    icon: IconChecklist,
    path: '/lab/audit',
  },
  {
    id: 'project-todo',
    label: 'Project TODO',
    icon: IconListNumbers,
    path: '/lab/todo',
  },
];

const prototypeItems: NavItem[] = [
  {
    id: 'ai-workspace',
    label: 'AI Workspace Setup',
    icon: IconStack2,
    path: '/lab/prototype/ai-workspace',
  },
];

const sharedItems: NavItem[] = [
  {
    id: 'shared-components',
    label: 'Shared Components',
    icon: IconPackages,
    path: '/lab/shared-components',
  },
];

const testItems: NavItem[] = [
  {
    id: 'nested-box-test',
    label: 'Nested Box',
    icon: IconBoxMultiple,
    path: '/lab/test/nested-box',
  },
];

const archiveItems: NavItem[] = [
  {
    id: 'sidebar-icons',
    label: 'Sidebar Icons',
    icon: IconLayoutSidebar,
    path: '/lab/sidebar-icons',
  },
  {
    id: 'topology-popovers',
    label: 'Topology Popovers',
    icon: IconTopologyRing3,
    path: '/lab/topology-popovers',
  },
  {
    id: 'create-pages',
    label: 'Create Pages',
    icon: IconTemplate,
    path: '/lab/create-pages',
  },
  {
    id: 'form-patterns',
    label: 'Form Patterns',
    icon: IconForms,
    path: '/lab/form-patterns',
  },
];

export const labNavGroups: NavGroup[] = [
  { title: 'Figma Migration', items: figmaItems },
  { title: 'Audit', items: auditItems },
  { title: 'Prototype', items: prototypeItems },
  { title: 'Shared', items: sharedItems },
  { title: 'Test', items: testItems },
  { title: 'Archive', items: archiveItems },
];

export const allLabNavItems: NavItem[] = labNavGroups.flatMap((g) => g.items);

export const labPageLastUpdated: Record<string, string> = {
  '/lab/figma/guide': '2026-03-01 10:30:00',
  '/lab/figma/foundation': '2026-03-01 10:30:00',
  '/lab/figma/components': '2026-03-01 10:30:00',
  '/lab/prototype/ai-workspace': '2026-03-05 14:00:00',
  '/lab/audit': '2026-03-11 10:00:00',
  '/lab/todo': '2026-03-11 12:00:00',
  '/lab/shared-components': '2026-03-18 12:00:00',
  '/lab/test/nested-box': '2026-03-05 01:30:00',
};

export function isLabRecentlyUpdated(path: string, withinDays = 3): boolean {
  const lastUpdated = labPageLastUpdated[path];
  if (!lastUpdated) return false;
  const updatedDate = new Date(lastUpdated);
  const now = new Date();
  const diffMs = now.getTime() - updatedDate.getTime();
  return diffMs >= 0 && diffMs <= withinDays * 24 * 60 * 60 * 1000;
}
