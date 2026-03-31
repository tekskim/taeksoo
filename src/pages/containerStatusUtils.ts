import type { BadgeTheme } from '@/design-system/components/Badge/Badge';

const GREEN_STATUSES = new Set([
  'active',
  'ready',
  'running',
  'completed',
  'ok',
  'healthy',
  'available',
  'bound',
  'succeeded',
  'provisioned',
  'deployed',
]);

const BLUE_STATUSES = new Set([
  'processing',
  'provisioning',
  'creating',
  'building',
  'deploying',
  'scaling',
  'updating',
  'pending',
]);

const RED_STATUSES = new Set(['error', 'failed']);

const GRAY_STATUSES = new Set([
  'stopped',
  'terminating',
  'terminated',
  'released',
  'waiting',
  'suspended',
  'inactive',
  'deleting',
  'lost',
]);

export function getContainerStatusTheme(status: string): BadgeTheme {
  const normalized = status.toLowerCase().trim();
  if (GREEN_STATUSES.has(normalized)) return 'green';
  if (BLUE_STATUSES.has(normalized)) return 'blue';
  if (RED_STATUSES.has(normalized)) return 'red';
  if (GRAY_STATUSES.has(normalized)) return 'gray';
  return 'white';
}
