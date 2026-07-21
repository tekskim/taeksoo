import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  Button,
  PageShell,
  Drawer,
  FormField,
  Input,
  Textarea,
  Badge,
  Tag,
  Modal,
  Table,
  type TableColumn,
  ContextMenu,
  type ContextMenuItem,
  SectionCard,
  DetailHeader,
  InfoBox,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@/design-system';
import { KmsSidebar } from '@/components/KmsSidebar';
import { useTabs } from '@/contexts/TabContext';
import { formatDate, AuditLogSection } from './shared';
import {
  IconEye,
  IconEyeOff,
  IconPencil,
  IconDotsCircleHorizontal,
  IconX,
} from '@tabler/icons-react';

/* ─────────────────────────────────────────────────────────────────
   Types (ported from kms/features/secrets/ui/pages/SecretDetailPage)
   ───────────────────────────────────────────────────────────────── */

type SecretDataRow = {
  id: string;
  key: string;
  value: string;
  masked: boolean;
};

type SecretDrawerValue = {
  name: string;
  secretData: SecretDataRow[];
  tags: Array<{ key: string; value: string }>;
};

type SecretDetail = SecretDrawerValue & {
  slug: string;
  path: string;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
};

type VersionStatus = 'active' | 'deactivated' | 'deleted' | 'destroyed';

type VersionHistoryItem = {
  version: number;
  editedAt: string;
  status: VersionStatus;
};

type VersionHistorySourceItem = {
  version: number;
  editedAt: string;
  status: VersionStatus;
};

type VersionActionKey = 'restore' | 'delete' | 'destroy';

type SecretEditTagsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTags: Array<{ key: string; value: string }>;
  onConfirm: (tags: Array<{ key: string; value: string }>) => void;
};

type SecretRotateDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  secretName: string;
  secretData: SecretDataRow[];
  currentVersion: number;
  onConfirm: (newSecretData: SecretDataRow[]) => void;
};

/* ─────────────────────────────────────────────────────────────────
   KMS23 detail dummy data
   ───────────────────────────────────────────────────────────────── */

const DUMMY_SECRETS: SecretDetail[] = [
  {
    slug: 'postgres-main',
    name: 'postgres-main',
    path: '/platform/prod/database/postgres-main',
    currentVersion: 20,
    createdAt: '2026-02-12T09:00:00+09:00',
    updatedAt: '2026-04-24T15:30:00+09:00',
    secretData: [
      { id: 'db-username', key: 'username', value: 'platform_admin', masked: true },
      { id: 'db-password', key: 'password', value: 'Thaki!Prod#2026', masked: true },
    ],
    tags: [
      { key: 'env', value: 'prod' },
      { key: 'owner', value: 'platform' },
    ],
  },
  {
    slug: 'billing-api-key',
    name: 'billing-api-key',
    path: '/platform/prod/billing/api-key',
    currentVersion: 3,
    createdAt: '2026-03-02T10:20:00+09:00',
    updatedAt: '2026-04-20T18:10:00+09:00',
    secretData: [{ id: 'api-key', key: 'apiKey', value: 'ak_live_9uU6kKmsMock', masked: true }],
    tags: [
      { key: 'env', value: 'prod' },
      { key: 'service', value: 'billing' },
    ],
  },
  {
    slug: 'postgresql-password',
    name: 'postgresql.password',
    path: '/ai-platform/prod/database/postgresql-password',
    currentVersion: 3,
    createdAt: '2025-08-15T11:00:00+09:00',
    updatedAt: '2026-04-10T09:20:00+09:00',
    secretData: [
      { id: 'pg-password', key: 'password', value: 'xK9#mPq$wL2!vN7z', masked: true },
      { id: 'pg-username', key: 'username', value: 'tkai_service', masked: true },
      { id: 'pg-host', key: 'host', value: 'pg-primary.internal.thaki.cloud', masked: true },
    ],
    tags: [
      { key: 'env', value: 'prod' },
      { key: 'owner', value: 'ai-platform' },
      { key: 'criticality', value: 'high' },
    ],
  },
  {
    slug: 'redis-password',
    name: 'REDIS_PASSWORD',
    path: '/iam/prod/cache/redis-password',
    currentVersion: 2,
    createdAt: '2025-11-20T14:30:00+09:00',
    updatedAt: '2026-03-28T16:45:00+09:00',
    secretData: [{ id: 'redis-pass', key: 'password', value: 'rD$8kW!mQ3pL#xV6', masked: true }],
    tags: [
      { key: 'env', value: 'prod' },
      { key: 'owner', value: 'iam' },
      { key: 'component', value: 'session-store' },
    ],
  },
  {
    slug: 'openai-api-key',
    name: 'OPENAI_API_KEY',
    path: '/ai-platform/prod/external/openai-api-key',
    currentVersion: 5,
    createdAt: '2025-06-10T09:00:00+09:00',
    updatedAt: '2026-04-25T11:00:00+09:00',
    secretData: [
      {
        id: 'openai-key',
        key: 'apiKey',
        value: 'sk-proj-aBcDeFgHiJkLmNoPqRsTuVwXyZ',
        masked: true,
      },
      { id: 'openai-org', key: 'organizationId', value: 'org-ThakiCloudProd', masked: true },
    ],
    tags: [
      { key: 'env', value: 'prod' },
      { key: 'owner', value: 'ai-platform' },
      { key: 'vendor', value: 'openai' },
      { key: 'cost-center', value: 'ml-ops' },
    ],
  },
  {
    slug: 'kc-client-secret',
    name: 'KC_CLIENT_SECRET',
    path: '/iam/prod/oauth/kc-client-secret',
    currentVersion: 1,
    createdAt: '2026-01-08T10:00:00+09:00',
    updatedAt: '2026-01-08T10:00:00+09:00',
    secretData: [
      {
        id: 'kc-secret',
        key: 'clientSecret',
        value: 'c7f2a9e1-4b3d-8k6m-p5w2-r9t1x0z3y8v6',
        masked: true,
      },
      { id: 'kc-client-id', key: 'clientId', value: 'thaki-suite-iam', masked: true },
    ],
    tags: [
      { key: 'env', value: 'prod' },
      { key: 'owner', value: 'iam' },
      { key: 'provider', value: 'keycloak' },
    ],
  },
  {
    slug: 's3-secret-access-key',
    name: 's3_secret_access_key',
    path: '/storage/prod/infra/s3-secret-access-key',
    currentVersion: 2,
    createdAt: '2025-09-01T08:00:00+09:00',
    updatedAt: '2026-02-14T13:30:00+09:00',
    secretData: [
      { id: 's3-access-key', key: 'accessKeyId', value: 'AKIA3THAKISTORAGE01', masked: true },
      {
        id: 's3-secret-key',
        key: 'secretAccessKey',
        value: 'wJk9Lm2PqR5tUv8XyZ0aBcDeFgHiJkLmNoPqRs',
        masked: true,
      },
      {
        id: 's3-endpoint',
        key: 'endpoint',
        value: 'https://rgw.internal.thaki.cloud',
        masked: true,
      },
    ],
    tags: [
      { key: 'env', value: 'prod' },
      { key: 'owner', value: 'storage' },
      { key: 'backend', value: 'ceph-rgw' },
    ],
  },
  {
    slug: 'github-token',
    name: 'GITHUB_TOKEN',
    path: '/ai-platform/prod/external/github-token',
    currentVersion: 4,
    createdAt: '2025-07-20T15:00:00+09:00',
    updatedAt: '2026-04-22T08:15:00+09:00',
    secretData: [
      {
        id: 'gh-token',
        key: 'token',
        value: 'ghp_xK9mPqWl2vN7zRt1Y8bC3dEf4GhIjKlMn',
        masked: true,
      },
    ],
    tags: [
      { key: 'env', value: 'prod' },
      { key: 'owner', value: 'ai-platform' },
      { key: 'scope', value: 'repo,packages' },
    ],
  },
];

const VERSION_HISTORY_PREVIEW_COUNT = 5;
const VERSION_HISTORY_INCREMENT = 5;
const MOCK_EDITED_AT = '2026-04-28T08:55:00+09:00';

const REASON_MAX_LENGTH = 500;

/* ─────────────────────────────────────────────────────────────────
   Version status / actions (state machine)
   ───────────────────────────────────────────────────────────────── */

const VERSION_STATUS_THEME: Record<VersionStatus, 'gre' | 'blu' | 'ylw' | 'red'> = {
  active: 'gre',
  deactivated: 'blu',
  deleted: 'ylw',
  destroyed: 'red',
};

const VERSION_STATUS_LABEL: Record<VersionStatus, string> = {
  active: 'Active',
  deactivated: 'Deactivated',
  deleted: 'Deleted',
  destroyed: 'Destroyed',
};

type VersionActionConfirmType = 'restore' | 'delete' | 'destroy';

const VERSION_CONFIRM_CONFIG: Record<
  VersionActionConfirmType,
  {
    title: string;
    description: (version: number) => string;
    confirmLabel: string;
    confirmVariant: 'primary' | 'danger';
    reasonRequired: boolean;
  }
> = {
  restore: {
    title: 'Restore secret version',
    description: (v: number) =>
      `Version v${v} will be restored as a new active version. The current active version will be deactivated.`,
    confirmLabel: 'Restore',
    confirmVariant: 'primary',
    reasonRequired: false,
  },
  delete: {
    title: 'Delete secret version',
    description: (v: number) =>
      `Version v${v} will be deleted. You can restore or permanently destroy it later.`,
    confirmLabel: 'Delete',
    confirmVariant: 'danger',
    reasonRequired: false,
  },
  destroy: {
    title: 'Permanently destroy secret version',
    description: (v: number) =>
      `Version v${v} will be permanently destroyed. This action cannot be undone.`,
    confirmLabel: 'Destroy',
    confirmVariant: 'danger',
    reasonRequired: true,
  },
};

type VersionActionConfirmModalProps = {
  isOpen: boolean;
  actionType: VersionActionConfirmType;
  versionNumber: number;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

function VersionActionConfirmModal({
  isOpen,
  actionType,
  versionNumber,
  onCancel,
  onConfirm,
}: VersionActionConfirmModalProps) {
  const [reason, setReason] = useState('');
  const config = VERSION_CONFIRM_CONFIG[actionType];
  const isConfirmDisabled = config.reasonRequired && reason.trim().length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={config.title}
      description={config.description(versionNumber)}
      className="w-[400px]"
    >
      <VStack gap={4}>
        <VStack gap={1}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">Version</span>
          <span className="text-body-md text-[var(--color-text-default)]">v{versionNumber}</span>
        </VStack>

        <FormField label="Reason for change" required={config.reasonRequired}>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={REASON_MAX_LENGTH}
            placeholder="Enter reason for change"
            fullWidth
            rows={3}
          />
        </FormField>
      </VStack>

      <div className="flex gap-2 w-full">
        <Button variant="outline" size="md" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          variant={config.confirmVariant}
          size="md"
          disabled={isConfirmDisabled}
          onClick={() => onConfirm(reason.trim())}
          className="flex-1"
        >
          {config.confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

type VersionActionDefinition = {
  key: VersionActionKey;
  label: string;
  danger?: boolean;
  requiresConfirm?: boolean;
};

const VERSION_ACTIONS_BY_STATUS: Record<VersionStatus, VersionActionDefinition[]> = {
  active: [],
  deactivated: [
    { key: 'restore', label: 'Restore' },
    { key: 'delete', label: 'Delete', danger: true, requiresConfirm: true },
  ],
  deleted: [
    { key: 'restore', label: 'Restore' },
    { key: 'destroy', label: 'Destroy', danger: true, requiresConfirm: true },
  ],
  destroyed: [],
};

// 버전 히스토리 더미 데이터
const buildInitialVersionHistory = (currentVersion: number): VersionHistorySourceItem[] =>
  Array.from({ length: currentVersion }, (_, index) => {
    const version = currentVersion - index;
    const previousCount = Math.max(1, Math.floor((currentVersion - 1) * 0.4));
    const deletedCount = Math.max(1, Math.floor((currentVersion - 1) * 0.35));

    let status: VersionStatus;
    if (version === currentVersion) {
      status = 'active';
    } else if (index <= previousCount) {
      status = 'deactivated';
    } else if (index <= previousCount + deletedCount) {
      status = 'deleted';
    } else {
      status = 'destroyed';
    }

    return {
      version,
      editedAt: `2026-04-${String(Math.max(1, 24 - index)).padStart(2, '0')}T15:30:00+09:00`,
      status,
    };
  });

/* ─────────────────────────────────────────────────────────────────
   Render helpers
   ───────────────────────────────────────────────────────────────── */

const maskSecretValue = (value: string): string =>
  value.length > 0 ? '*'.repeat(Math.min(Math.max(value.length, 8), 16)) : '-';

function renderTags(tags: Array<{ key: string; value: string }>) {
  if (tags.length === 0) {
    return <span className="text-body-md text-[var(--color-text-default)]">-</span>;
  }

  return (
    <HStack gap={1} className="flex-wrap">
      {tags.map((tag) => (
        <Tag key={`${tag.key}-${tag.value}`} size="sm" outline>
          {tag.key}: {tag.value}
        </Tag>
      ))}
    </HStack>
  );
}

function renderSecretRows(rows: SecretDrawerValue['secretData'], revealed: boolean) {
  return (
    <VStack gap={1}>
      {rows.map((row) => (
        <HStack key={row.id} gap={2} align="center" className="min-w-0">
          <Badge theme="blu" type="subtle" size="sm">
            {row.key || '-'}
          </Badge>
          <span className="min-w-0 truncate font-mono text-body-sm text-[var(--color-text-default)]">
            {revealed ? row.value || '-' : maskSecretValue(row.value)}
          </span>
        </HStack>
      ))}
    </VStack>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SecretEditTagsDrawer
   ───────────────────────────────────────────────────────────────── */

function SecretEditTagsDrawer({
  isOpen,
  onClose,
  initialTags,
  onConfirm,
}: SecretEditTagsDrawerProps) {
  const [tags, setTags] = useState<Array<{ key: string; value: string }>>(initialTags);

  const handleAddTag = (): void => {
    setTags((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveTag = (index: number): void => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagChange = (index: number, field: 'key' | 'value', value: string): void => {
    setTags((prev) => prev.map((tag, i) => (i === index ? { ...tag, [field]: value } : tag)));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit tags"
      width={560}
      footer={
        <HStack gap={2} className="w-full justify-end">
          <Button variant="muted" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onConfirm(tags)}>
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={2}>
        {tags.length > 0 && (
          <HStack gap={2} className="w-full">
            <span className="flex-1 text-label-sm text-[var(--color-text-subtle)]">Key</span>
            <span className="flex-1 text-label-sm text-[var(--color-text-subtle)]">Value</span>
            <span className="w-5 shrink-0" />
          </HStack>
        )}
        {tags.map((tag, index) => (
          <HStack key={index} gap={2} align="center" className="w-full">
            <Input
              value={tag.key}
              size="sm"
              fullWidth
              placeholder="Key"
              onChange={(e) => handleTagChange(index, 'key', e.target.value)}
            />
            <Input
              value={tag.value}
              size="sm"
              fullWidth
              placeholder="Value"
              onChange={(e) => handleTagChange(index, 'value', e.target.value)}
            />
            <button
              type="button"
              aria-label="Remove tag"
              onClick={() => handleRemoveTag(index)}
              className="size-5 flex shrink-0 items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
            >
              <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
            </button>
          </HStack>
        ))}
        <div>
          <Button variant="outline" size="sm" onClick={handleAddTag}>
            Add tag
          </Button>
        </div>
      </VStack>
    </Drawer>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SecretRotateDrawer (Rotate Now)
   ───────────────────────────────────────────────────────────────── */

function SecretRotateDrawer({
  isOpen,
  onClose,
  secretName,
  secretData,
  onConfirm,
}: SecretRotateDrawerProps) {
  const [rows, setRows] = useState<SecretDataRow[]>(
    secretData.map((row) => ({ ...row, value: '', masked: true }))
  );

  const handleToggleMask = (rowId: string): void => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, masked: !row.masked } : row))
    );
  };

  const handleChangeValue = (rowId: string, value: string): void => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, value } : row)));
  };

  const allFilled = rows.every((row) => row.value.trim().length > 0);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Rotate secret"
      width={560}
      footer={
        <HStack gap={2} className="w-full justify-end">
          <Button variant="muted" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!allFilled} onClick={() => onConfirm(rows)}>
            Rotate
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <InfoBox label="Secret name" value={secretName} />

        <FormField
          label="New secret data"
          helperText="Enter new values for all keys. A new version will be created and the current version will be deactivated."
        >
          <VStack gap={2}>
            {rows.map((row) => (
              <HStack key={row.id} gap={2} align="center" className="w-full">
                <Input
                  aria-label={`${row.key || 'secret'} key`}
                  value={row.key}
                  placeholder="key"
                  fullWidth
                  disabled
                />
                <Input
                  aria-label={`${row.key || 'secret'} new value`}
                  type={row.masked ? 'password' : 'text'}
                  value={row.value}
                  placeholder="New value"
                  fullWidth
                  onChange={(e) => handleChangeValue(row.id, e.target.value)}
                />
                <Button
                  variant="outline"
                  size="md"
                  icon={
                    row.masked ? (
                      <IconEye size={16} stroke={1.5} />
                    ) : (
                      <IconEyeOff size={16} stroke={1.5} />
                    )
                  }
                  aria-label={`${row.key || 'secret'} ${row.masked ? 'show value' : 'hide value'}`}
                  onClick={() => handleToggleMask(row.id)}
                />
              </HStack>
            ))}
          </VStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────────── */

export default function SecretDetailPage() {
  const { secretNameSlug } = useParams<{ secretNameSlug: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const selectedSecret = DUMMY_SECRETS.find((s) => s.slug === secretNameSlug) ?? DUMMY_SECRETS[0];
  const [secret, setSecret] = useState<SecretDetail>(selectedSecret);
  const [isEditTagsDrawerOpen, setIsEditTagsDrawerOpen] = useState(false);
  const [isRotateDrawerOpen, setIsRotateDrawerOpen] = useState(false);
  const [versionHistory, setVersionHistory] = useState<VersionHistorySourceItem[]>(() =>
    buildInitialVersionHistory(selectedSecret.currentVersion)
  );
  const [visibleVersionHistoryCount, setVisibleVersionHistoryCount] = useState(
    VERSION_HISTORY_PREVIEW_COUNT
  );
  const [versionConfirmModal, setVersionConfirmModal] = useState<{
    actionType: VersionActionConfirmType;
    versionNumber: number;
    onConfirm: (reason: string) => void;
  } | null>(null);

  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const handleSaveTags = (tags: Array<{ key: string; value: string }>): void => {
    setSecret((previous) => ({ ...previous, tags, updatedAt: MOCK_EDITED_AT }));
    setIsEditTagsDrawerOpen(false);
  };

  const handleRotate = (newSecretData: SecretDataRow[]): void => {
    const nextVersion = secret.currentVersion + 1;
    setSecret((previous) => ({
      ...previous,
      secretData: newSecretData,
      updatedAt: MOCK_EDITED_AT,
      currentVersion: nextVersion,
    }));
    setVersionHistory((previous) => [
      { version: nextVersion, editedAt: MOCK_EDITED_AT, status: 'active' },
      ...previous.map((item) =>
        item.status === 'active' ? { ...item, status: 'deactivated' as const } : item
      ),
    ]);
    setIsRotateDrawerOpen(false);
  };

  const activeVersion = versionHistory.find((v) => v.status === 'active');

  const currentStatusLabel = activeVersion ? 'Active' : 'Destroyed';
  const currentStatusTheme: 'red' | 'gre' = activeVersion ? 'gre' : 'red';

  // 버전 히스토리: deleted / destroyed 버전은 목록에서 제외
  const secretVersionHistory: VersionHistoryItem[] = versionHistory.filter(
    (item) =>
      item.version <= secret.currentVersion &&
      item.status !== 'deleted' &&
      item.status !== 'destroyed'
  );
  const visibleVersionHistory = secretVersionHistory.slice(0, visibleVersionHistoryCount);
  const canExpandVersionHistory = visibleVersionHistoryCount < secretVersionHistory.length;
  const canCollapseVersionHistory = visibleVersionHistoryCount > VERSION_HISTORY_PREVIEW_COUNT;
  const shouldShowVersionHistoryActions =
    secretVersionHistory.length > VERSION_HISTORY_PREVIEW_COUNT;

  const handleVersionAction = (item: VersionHistoryItem, actionKey: VersionActionKey): void => {
    switch (actionKey) {
      case 'restore': {
        setVersionConfirmModal({
          actionType: 'restore',
          versionNumber: item.version,
          onConfirm: (_reason: string) => {
            const nextVersion = secret.currentVersion + 1;
            setSecret((previous) => ({
              ...previous,
              updatedAt: MOCK_EDITED_AT,
              currentVersion: nextVersion,
            }));
            setVersionHistory((previous) => [
              { version: nextVersion, editedAt: MOCK_EDITED_AT, status: 'active' },
              ...previous.map((v) =>
                v.status === 'active' ? { ...v, status: 'deactivated' as const } : v
              ),
            ]);
            setVersionConfirmModal(null);
          },
        });
        break;
      }
      case 'delete': {
        setVersionConfirmModal({
          actionType: 'delete',
          versionNumber: item.version,
          onConfirm: (_reason: string) => {
            setVersionHistory((previous) =>
              previous.map((v) =>
                v.version === item.version ? { ...v, status: 'deleted' as const } : v
              )
            );
            setVersionConfirmModal(null);
          },
        });
        break;
      }
      case 'destroy': {
        setVersionConfirmModal({
          actionType: 'destroy',
          versionNumber: item.version,
          onConfirm: (_reason: string) => {
            setVersionHistory((previous) =>
              previous.map((v) =>
                v.version === item.version ? { ...v, status: 'destroyed' as const } : v
              )
            );
            setVersionConfirmModal(null);
          },
        });
        break;
      }
      default:
        break;
    }
  };

  const handleExpandVersionHistory = (): void => {
    setVisibleVersionHistoryCount((previous) =>
      Math.min(previous + VERSION_HISTORY_INCREMENT, secretVersionHistory.length)
    );
  };

  const handleCollapseVersionHistory = (): void => {
    setVisibleVersionHistoryCount(VERSION_HISTORY_PREVIEW_COUNT);
  };

  // ── Version history table columns ──────────────────────────────
  const versionColumns: TableColumn<VersionHistoryItem>[] = [
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      align: 'center',
      resizable: false,
      render: (_, row) => (
        <Badge theme={VERSION_STATUS_THEME[row.status]} type="subtle" size="sm">
          {VERSION_STATUS_LABEL[row.status]}
        </Badge>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      width: '100px',
      resizable: false,
      render: (_, row) => <span className="font-mono text-body-sm">v{row.version}</span>,
    },
    {
      key: 'editedAt',
      label: 'Edited at',
      flex: 1,
      minWidth: '200px',
      render: (_, row) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {formatDate(row.editedAt)}
        </span>
      ),
    },
    {
      key: '_actions',
      label: 'Action',
      width: '64px',
      align: 'center',
      resizable: false,
      render: (_, row) => {
        const actions = VERSION_ACTIONS_BY_STATUS[row.status];
        if (actions.length === 0) {
          return <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>;
        }
        const items: ContextMenuItem[] = actions.map((action) => ({
          id: action.key,
          label: action.label,
          status: action.danger ? 'danger' : 'default',
          onClick: () => handleVersionAction(row, action.key),
        }));
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={items} trigger="click" align="right">
              <button
                aria-label={`v${row.version} version actions`}
                className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                <IconDotsCircleHorizontal
                  size={16}
                  stroke={1.5}
                  className="text-[var(--color-text-subtle)]"
                />
              </button>
            </ContextMenu>
          </div>
        );
      },
    },
  ];

  return (
    <PageShell
      sidebar={<KmsSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />}
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'KMS', href: '/kms/overview' },
                { label: 'Secrets', href: '/kms/secrets' },
                { label: secret.name },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={4}>
        {/* Secret information → DetailHeader (TDS detail-header 패턴) */}
        <DetailHeader>
          <DetailHeader.Title>{secret.name}</DetailHeader.Title>
          <DetailHeader.Actions>
            <Button variant="secondary" size="sm" onClick={() => setIsRotateDrawerOpen(true)}>
              Rotate now
            </Button>
          </DetailHeader.Actions>
          <DetailHeader.InfoGrid>
            <DetailHeader.InfoCard
              label="Status"
              value={
                <Badge theme={currentStatusTheme} type="subtle" size="sm">
                  {currentStatusLabel}
                </Badge>
              }
            />
            <DetailHeader.InfoCard label="Secret path" value={secret.path} />
            <DetailHeader.InfoCard
              label="Current version"
              value={
                activeVersion
                  ? `v${secret.currentVersion}`
                  : `v${secret.currentVersion} (destroyed)`
              }
            />
            <DetailHeader.InfoCard label="Created at" value={formatDate(secret.createdAt)} />
            <DetailHeader.InfoCard label="Last updated" value={formatDate(secret.updatedAt)} />
          </DetailHeader.InfoGrid>
        </DetailHeader>

        {/* 섹션들 → DetailHeader 하단 탭 (TDS detail-page 패턴) */}
        <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
          <TabList>
            <Tab value="details">Details</Tab>
            <Tab value="history">History</Tab>
            <Tab value="audit">Audit Logs</Tab>
          </TabList>

          <TabPanel value="details" className="pt-0">
            <VStack gap={4} className="pt-4">
              {/* Secret value */}
              <SectionCard>
                <SectionCard.Header
                  title="Secret value"
                  actions={
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={
                        isSecretRevealed ? (
                          <IconEyeOff size={14} stroke={1.5} />
                        ) : (
                          <IconEye size={14} stroke={1.5} />
                        )
                      }
                      aria-label={isSecretRevealed ? 'Hide secret value' : 'Show secret value'}
                      onClick={() => setIsSecretRevealed((prev) => !prev)}
                    >
                      {isSecretRevealed ? 'Hide secret value' : 'Show secret value'}
                    </Button>
                  }
                />
                <SectionCard.Content>
                  <SectionCard.DataRow label="Secret value">
                    {renderSecretRows(secret.secretData, isSecretRevealed)}
                  </SectionCard.DataRow>
                </SectionCard.Content>
              </SectionCard>

              {/* Tags */}
              <SectionCard>
                <SectionCard.Header
                  title="Tags"
                  actions={
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<IconPencil size={14} stroke={1.5} />}
                      onClick={() => setIsEditTagsDrawerOpen(true)}
                    >
                      Edit
                    </Button>
                  }
                />
                <SectionCard.Content>{renderTags(secret.tags)}</SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>

          <TabPanel value="history" className="pt-0">
            <VStack gap={4} className="pt-4">
              {/* History (version history) */}
              <SectionCard>
                <SectionCard.Header
                  title="History"
                  description="Track version history for secret value changes."
                />
                <SectionCard.Content>
                  <Table<VersionHistoryItem>
                    columns={versionColumns}
                    data={visibleVersionHistory}
                    rowKey="version"
                    resizable={false}
                    emptyMessage="No version history."
                  />

                  {shouldShowVersionHistoryActions && (
                    <HStack gap={1} className="w-full justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!canExpandVersionHistory}
                        onClick={handleExpandVersionHistory}
                      >
                        Load more
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!canCollapseVersionHistory}
                        onClick={handleCollapseVersionHistory}
                      >
                        Collapse
                      </Button>
                    </HStack>
                  )}
                </SectionCard.Content>
              </SectionCard>
            </VStack>
          </TabPanel>

          <TabPanel value="audit" className="pt-0">
            <VStack gap={4} className="pt-4">
              <AuditLogSection resourceId={secret.slug} title="Audit logs" />
            </VStack>
          </TabPanel>
        </Tabs>
      </VStack>

      {/* Edit tags drawer — key로 최신 tags 기준 리셋 */}
      <SecretEditTagsDrawer
        key={`tags-${secret.updatedAt}-${secret.tags.length}`}
        isOpen={isEditTagsDrawerOpen}
        onClose={() => setIsEditTagsDrawerOpen(false)}
        initialTags={secret.tags}
        onConfirm={handleSaveTags}
      />

      {/* Rotate now drawer — key로 회전 후 입력값 리셋 */}
      <SecretRotateDrawer
        key={`rotate-${secret.currentVersion}`}
        isOpen={isRotateDrawerOpen}
        onClose={() => setIsRotateDrawerOpen(false)}
        secretName={secret.name}
        secretData={secret.secretData}
        currentVersion={secret.currentVersion}
        onConfirm={handleRotate}
      />

      {/* Version action confirm modal (restore / delete / destroy) */}
      {versionConfirmModal != null && (
        <VersionActionConfirmModal
          isOpen
          actionType={versionConfirmModal.actionType}
          versionNumber={versionConfirmModal.versionNumber}
          onCancel={() => setVersionConfirmModal(null)}
          onConfirm={versionConfirmModal.onConfirm}
        />
      )}
    </PageShell>
  );
}
