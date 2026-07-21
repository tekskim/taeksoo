import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Modal,
  FormField,
  Textarea,
  Toggle,
  Input,
  Checkbox,
  InfoBox,
  Tag,
  Badge,
  DetailHeader,
  SectionCard,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  EmptyState,
  Table,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  Pagination,
} from '@/design-system';
import { KmsSidebar } from '@/components/KmsSidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconDotsCircleHorizontal } from '@tabler/icons-react';
import { KmsStateBadge, formatDate, AuditLogSection } from './shared';
import type { CryptoKeyDetail, CryptoKeyRotationHistoryItem } from './models/cryptoKey';
import { getMockCryptoKeyBySlug } from './mocks/cryptoKeysRepository';

// ── Constants ─────────────────────────────────────────────────────────────────

const HISTORY_PAGE_SIZE = 10;
const REASON_MAX_LENGTH = 500;

type RotationStatus = CryptoKeyRotationHistoryItem['status'];

type KmsStatusChangeReasonCode =
  | 'suspected_compromise'
  | 'routine_archive'
  | 'emergency_destroy'
  | 'manual_delete';

const KMS_REASON_CODE_LABEL: Record<KmsStatusChangeReasonCode, string> = {
  suspected_compromise: 'Suspected compromise (suspected_compromise)',
  routine_archive: 'Routine archive (routine_archive)',
  emergency_destroy: 'Emergency destroy (emergency_destroy)',
  manual_delete: 'Manual delete (manual_delete)',
};

const ROTATION_STATUS_THEME: Record<RotationStatus, 'gre' | 'ylw' | 'gry' | 'red'> = {
  active: 'gre',
  deactivated: 'ylw',
  archived: 'gry',
  destroyed: 'red',
};

type StatusConfirmActionType = 'rotate' | 'archive' | 'restore' | 'destroy';

type RotationStatusAction = {
  nextStatus: RotationStatus;
  label: string;
  confirmType: StatusConfirmActionType;
  danger?: boolean;
  reasonCode?: KmsStatusChangeReasonCode;
};

/** 버전 상태별 rotation history 액션 (kms CryptoKeyDetailPage 정책) */
const ROTATION_STATUS_ACTIONS: Partial<Record<RotationStatus, RotationStatusAction[]>> = {
  active: [
    {
      nextStatus: 'archived',
      label: 'Archive',
      confirmType: 'archive',
      reasonCode: 'suspected_compromise',
    },
    {
      nextStatus: 'destroyed',
      label: 'Destroy',
      confirmType: 'destroy',
      danger: true,
      reasonCode: 'emergency_destroy',
    },
  ],
  deactivated: [
    {
      nextStatus: 'archived',
      label: 'Archive',
      confirmType: 'archive',
      reasonCode: 'routine_archive',
    },
    {
      nextStatus: 'destroyed',
      label: 'Destroy',
      confirmType: 'destroy',
      danger: true,
      reasonCode: 'manual_delete',
    },
  ],
  archived: [
    { nextStatus: 'deactivated', label: 'Restore', confirmType: 'restore' },
    {
      nextStatus: 'destroyed',
      label: 'Destroy',
      confirmType: 'destroy',
      danger: true,
      reasonCode: 'manual_delete',
    },
  ],
};

const STATUS_CONFIRM_CONFIG: Record<
  StatusConfirmActionType,
  { title: string; confirmLabel: string; danger?: boolean }
> = {
  rotate: { title: 'Confirm key rotation', confirmLabel: 'Rotate now' },
  archive: { title: 'Confirm key version archive', confirmLabel: 'Archive' },
  restore: { title: 'Confirm key version restore', confirmLabel: 'Restore' },
  destroy: { title: 'Confirm key version destruction', confirmLabel: 'Destroy', danger: true },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatNullableDate = (value: string | null | undefined): string =>
  value ? formatDate(value) : '-';

const formatRotationTimestamp = (item: CryptoKeyRotationHistoryItem): string => {
  if (item.status === 'archived' || item.status === 'destroyed') return '-';
  return formatDate(item.rotatedAt);
};

// ── Key version status confirm modal ─────────────────────────────────────────

type KeyVersionStatusConfirmModalProps = {
  keyName: string;
  versionLabels: string[];
  actionType: StatusConfirmActionType;
  reasonCode?: KmsStatusChangeReasonCode;
  onCancel: () => void;
  onConfirm: (rationale: string) => void;
};

function KeyVersionStatusConfirmModal({
  keyName,
  versionLabels,
  actionType,
  reasonCode,
  onCancel,
  onConfirm,
}: KeyVersionStatusConfirmModalProps) {
  const [reason, setReason] = useState('');
  const config = STATUS_CONFIRM_CONFIG[actionType];

  const rationale = reasonCode ? `${reasonCode}: ${reason.trim()}` : reason.trim();

  return (
    <Modal isOpen onClose={onCancel} title={config.title} className="w-[400px]">
      <VStack gap={4}>
        <InfoBox.Group>
          <InfoBox label="Key name" value={keyName || '-'} />
          <InfoBox label="Versions" value={versionLabels.join(', ')} />
          {reasonCode && <InfoBox label="Reason code" value={KMS_REASON_CODE_LABEL[reasonCode]} />}
        </InfoBox.Group>
        <FormField label="Reason for change" required>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={REASON_MAX_LENGTH}
            placeholder="Enter reason for change"
            rows={3}
            fullWidth
          />
        </FormField>
        <HStack gap={2} className="w-full">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={config.danger ? 'danger' : 'primary'}
            className="flex-1"
            disabled={reason.trim().length === 0}
            onClick={() => onConfirm(rationale)}
          >
            {config.confirmLabel}
          </Button>
        </HStack>
      </VStack>
    </Modal>
  );
}

// ── Rotation settings drawer ──────────────────────────────────────────────────

type RotationSettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  initialAutoRotation: boolean;
  initialPeriodDays: number;
  onSave: (autoRotation: boolean, periodDays: number) => void;
};

function RotationSettingsDrawer({
  isOpen,
  onClose,
  initialAutoRotation,
  initialPeriodDays,
  onSave,
}: RotationSettingsDrawerProps) {
  const [autoRotation, setAutoRotation] = useState(initialAutoRotation);
  const [periodDays, setPeriodDays] = useState(initialPeriodDays);

  useEffect(() => {
    if (isOpen) {
      setAutoRotation(initialAutoRotation);
      setPeriodDays(initialPeriodDays);
    }
  }, [isOpen, initialAutoRotation, initialPeriodDays]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Edit rotation settings"
      width={480}
      footer={
        <HStack gap={2} className="w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => onSave(autoRotation, periodDays)}
          >
            Save
          </Button>
        </HStack>
      }
    >
      <VStack gap={6}>
        <FormField label="Automatic rotation">
          <Toggle
            name="auto-rotation-drawer"
            checked={autoRotation}
            checkedLabel="On"
            uncheckedLabel="Off"
            onChange={(e) => setAutoRotation(e.target.checked)}
          />
        </FormField>
        <FormField label="Rotation period">
          <HStack gap={2} align="center">
            <Input
              type="number"
              value={periodDays}
              min={30}
              max={365}
              step={30}
              width="sm"
              disabled={!autoRotation}
              onChange={(e) => setPeriodDays(Number(e.target.value) || 30)}
            />
            <span className="text-body-md text-[var(--color-text-subtle)]">days</span>
          </HStack>
        </FormField>
      </VStack>
    </Drawer>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CryptoKeyDetailPage() {
  const { keyNameSlug = '' } = useParams<{ keyNameSlug: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('rotation');
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [data, setData] = useState<CryptoKeyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [autoRotationEnabled, setAutoRotationEnabled] = useState(false);
  const [rotationPeriodDays, setRotationPeriodDays] = useState(90);
  const [rotationLastUpdatedAt, setRotationLastUpdatedAt] = useState<string | null>(null);
  const [isRotationSettingsDrawerOpen, setIsRotationSettingsDrawerOpen] = useState(false);

  const [currentVersion, setCurrentVersion] = useState(0);
  const [rotationHistory, setRotationHistory] = useState<CryptoKeyRotationHistoryItem[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [selectedVersions, setSelectedVersions] = useState<Set<number>>(new Set());

  const [confirmModal, setConfirmModal] = useState<{
    actionType: StatusConfirmActionType;
    versionLabels: string[];
    reasonCode?: KmsStatusChangeReasonCode;
    onConfirm: (rationale: string) => void;
  } | null>(null);

  // ── Data loading (mock repository, async) ───────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getMockCryptoKeyBySlug(keyNameSlug).then((detail) => {
      if (cancelled) return;
      setData(detail);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [keyNameSlug]);

  useEffect(() => {
    if (!data) return;
    setAutoRotationEnabled(data.autoRotationEnabled);
    setRotationPeriodDays(data.rotationPeriodDays);
    setRotationLastUpdatedAt(data.updatedAt ?? null);
    setCurrentVersion(data.currentVersion);
    setRotationHistory(data.rotationHistory);
    setHistoryPage(1);
    setSelectedVersions(new Set());
  }, [data]);

  const computedNextRotationAt = useMemo((): string => {
    if (!autoRotationEnabled || !rotationLastUpdatedAt) return '-';
    const base = new Date(rotationLastUpdatedAt);
    base.setDate(base.getDate() + rotationPeriodDays);
    return formatDate(base.toISOString());
  }, [autoRotationEnabled, rotationLastUpdatedAt, rotationPeriodDays]);

  // ── Rotation history selection ──────────────────────────────────────────────

  const isSelectable = useCallback(
    (item: CryptoKeyRotationHistoryItem): boolean =>
      item.status !== 'active' && item.status !== 'destroyed',
    []
  );

  const toggleVersion = useCallback((version: number): void => {
    setSelectedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  }, []);

  // 전체 rotation history를 페이지당 10개씩 페이지네이션 (Encryption keys 리스트 패턴)
  const historyTotalPages = Math.max(1, Math.ceil(rotationHistory.length / HISTORY_PAGE_SIZE));
  const historySafePage = Math.min(historyPage, historyTotalPages);
  const visibleRotationHistory = useMemo(
    () =>
      rotationHistory.slice(
        (historySafePage - 1) * HISTORY_PAGE_SIZE,
        historySafePage * HISTORY_PAGE_SIZE
      ),
    [rotationHistory, historySafePage]
  );

  // ── Action handlers ─────────────────────────────────────────────────────────

  const handleRotationSettingsSave = (newAutoRotation: boolean, newPeriodDays: number): void => {
    setAutoRotationEnabled(newAutoRotation);
    setRotationPeriodDays(newPeriodDays);
    setRotationLastUpdatedAt(new Date().toISOString());
    setIsRotationSettingsDrawerOpen(false);
  };

  const handleRotateNow = (): void => {
    if (!data) return;
    setConfirmModal({
      actionType: 'rotate',
      versionLabels: [`v${currentVersion}`],
      onConfirm: (_rationale: string) => {
        const nextVersion = currentVersion + 1;
        setCurrentVersion(nextVersion);
        setRotationHistory((previous) => [
          { version: nextVersion, rotatedAt: new Date().toISOString(), status: 'active' },
          ...previous.map((item) =>
            item.status === 'active' ? { ...item, status: 'deactivated' as const } : item
          ),
        ]);
        setRotationLastUpdatedAt(new Date().toISOString());
        setHistoryPage(1);
        setSelectedVersions(new Set());
        setConfirmModal(null);
      },
    });
  };

  const handleBulkDestroy = (): void => {
    if (selectedVersions.size === 0) return;
    const versionLabels = [...selectedVersions].sort((a, b) => b - a).map((v) => `v${v}`);
    const versionsSnapshot = new Set(selectedVersions);

    setConfirmModal({
      actionType: 'destroy',
      versionLabels,
      onConfirm: (_rationale: string) => {
        setRotationHistory((prev) =>
          prev.map((item) =>
            versionsSnapshot.has(item.version) ? { ...item, status: 'destroyed' as const } : item
          )
        );
        setSelectedVersions(new Set());
        setConfirmModal(null);
      },
    });
  };

  const applyVersionStatus = (
    targetItem: CryptoKeyRotationHistoryItem,
    nextStatus: RotationStatus
  ): void => {
    setRotationHistory((previous) =>
      previous.map((item) =>
        item.version === targetItem.version && item.rotatedAt === targetItem.rotatedAt
          ? { ...item, status: nextStatus }
          : item
      )
    );
  };

  const handleVersionStatusAction = (
    item: CryptoKeyRotationHistoryItem,
    action: RotationStatusAction
  ): void => {
    setConfirmModal({
      actionType: action.confirmType,
      versionLabels: [`v${item.version}`],
      reasonCode: action.reasonCode,
      onConfirm: (_rationale: string) => {
        applyVersionStatus(item, action.nextStatus);
        setConfirmModal(null);
      },
    });
  };

  // ── Rotation history table columns ──────────────────────────────────────────

  const historyColumns: TableColumn<CryptoKeyRotationHistoryItem>[] = [
    {
      key: '_select',
      label: '',
      width: fixedColumns.checkbox,
      align: 'center',
      resizable: false,
      render: (_: any, item: CryptoKeyRotationHistoryItem) =>
        isSelectable(item) ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selectedVersions.has(item.version)}
              onChange={() => toggleVersion(item.version)}
              aria-label={`Select version v${item.version}`}
            />
          </div>
        ) : (
          <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>
        ),
    },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_: any, item: CryptoKeyRotationHistoryItem) => (
        <Badge theme={ROTATION_STATUS_THEME[item.status]} type="subtle" size="sm">
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      width: '90px',
      resizable: false,
      render: (v: any) => <span className="text-body-sm font-mono">v{v}</span>,
    },
    {
      key: 'rotatedAt',
      label: 'Rotated at',
      flex: 1,
      minWidth: '160px',
      render: (_: any, item: CryptoKeyRotationHistoryItem) => (
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          {formatRotationTimestamp(item)}
        </span>
      ),
    },
    {
      key: '_action',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      resizable: false,
      render: (_: any, item: CryptoKeyRotationHistoryItem) => {
        const actions = ROTATION_STATUS_ACTIONS[item.status];
        if (!actions || actions.length === 0) {
          return <span className="text-body-sm text-[var(--color-text-subtle)]">-</span>;
        }
        const menuItems: ContextMenuItem[] = actions.map((action) => ({
          id: `${action.confirmType}-${action.nextStatus}`,
          label: action.label,
          status: action.danger ? 'danger' : 'default',
          onClick: () => handleVersionStatusAction(item, action),
        }));
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <ContextMenu items={menuItems} trigger="click" align="right">
              <button
                aria-label={`Open actions for version v${item.version}`}
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

  // ── Key information fields ──────────────────────────────────────────────────

  const summaryFields: { label: string; value: React.ReactNode }[] = [
    {
      label: 'Status',
      value: data ? <KmsStateBadge status={data.status} /> : '-',
    },
    { label: 'Algorithm', value: data?.algorithm ?? '-' },
    { label: 'Key purpose', value: data?.purpose ?? '-' },
    { label: 'Current version', value: data ? `v${currentVersion}` : '-' },
    { label: 'Created by', value: data?.createdBy ?? '-' },
    { label: 'Created at', value: formatNullableDate(data?.createdAt) },
    { label: 'Description', value: data?.description || '-' },
    {
      label: 'Tags',
      value:
        data && data.tags.length > 0 ? (
          <HStack gap={1} className="flex-wrap">
            {data.tags.map((tag) => (
              <Tag key={tag.key} size="sm" outline>
                {tag.key}={tag.value}
              </Tag>
            ))}
          </HStack>
        ) : (
          '-'
        ),
    },
  ];

  const pageTitle = data?.name ?? keyNameSlug ?? 'Key details';

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
                { label: 'Encryption Keys', href: '/kms/keys' },
                { label: pageTitle },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      {!isLoading && !data ? (
        <EmptyState
          title="Key not found"
          description="The selected key may have been removed or is unavailable."
          variant="card"
        />
      ) : (
        <VStack gap={4}>
          {/* Key information → DetailHeader (TDS detail-header 패턴) */}
          <DetailHeader>
            <DetailHeader.Title>{pageTitle}</DetailHeader.Title>
            <DetailHeader.InfoGrid>
              {summaryFields.map(({ label, value }) => (
                <DetailHeader.InfoCard key={label} label={label} value={value} />
              ))}
            </DetailHeader.InfoGrid>
          </DetailHeader>

          {/* 섹션들 → DetailHeader 하단 탭 (TDS detail-page 패턴) */}
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
            <TabList>
              <Tab value="rotation">Rotation</Tab>
              <Tab value="audit">Audit Logs</Tab>
            </TabList>

            <TabPanel value="rotation" className="pt-0">
              <VStack gap={4} className="pt-4">
                {/* Rotation Settings */}
                <SectionCard>
                  <SectionCard.Header
                    title="Rotation settings"
                    actions={
                      <HStack gap={2}>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!data}
                          onClick={() => setIsRotationSettingsDrawerOpen(true)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!data}
                          onClick={handleRotateNow}
                        >
                          Rotate now
                        </Button>
                      </HStack>
                    }
                  />
                  <SectionCard.Content>
                    <SectionCard.DataRow label="Automatic rotation">
                      {autoRotationEnabled ? 'On' : 'Off'}
                    </SectionCard.DataRow>
                    {autoRotationEnabled && (
                      <SectionCard.DataRow label="Rotation period">
                        {rotationPeriodDays} days
                      </SectionCard.DataRow>
                    )}
                    <SectionCard.DataRow label="Last updated">
                      {formatNullableDate(rotationLastUpdatedAt)}
                    </SectionCard.DataRow>
                    <SectionCard.DataRow label="Next rotation">
                      {computedNextRotationAt}
                    </SectionCard.DataRow>
                  </SectionCard.Content>
                </SectionCard>

                {/* Rotation History */}
                <SectionCard>
                  <SectionCard.Header
                    title="Rotation history"
                    actions={
                      selectedVersions.size > 0 ? (
                        <Button variant="danger" size="sm" onClick={handleBulkDestroy}>
                          Bulk destroy ({selectedVersions.size})
                        </Button>
                      ) : undefined
                    }
                  />
                  <SectionCard.Content>
                    <VStack gap={3} className="w-full pt-3">
                      {/* 전체 히스토리 — 페이지당 10개 (table 상단 좌측) */}
                      <Pagination
                        currentPage={historySafePage}
                        totalPages={historyTotalPages}
                        onPageChange={setHistoryPage}
                        totalItems={rotationHistory.length}
                      />
                      <Table<CryptoKeyRotationHistoryItem>
                        columns={historyColumns}
                        data={visibleRotationHistory}
                        rowKey={(item) => `${item.version}-${item.rotatedAt}`}
                        resizable={false}
                        emptyMessage="No rotation history"
                      />
                    </VStack>
                  </SectionCard.Content>
                </SectionCard>
              </VStack>
            </TabPanel>

            <TabPanel value="audit" className="pt-0">
              <VStack gap={4} className="pt-4">
                <AuditLogSection resourceId={keyNameSlug} title="Audit logs" />
              </VStack>
            </TabPanel>
          </Tabs>
        </VStack>
      )}

      {/* Status change / rotate confirm modal */}
      {confirmModal && (
        <KeyVersionStatusConfirmModal
          keyName={data?.name ?? keyNameSlug}
          versionLabels={confirmModal.versionLabels}
          actionType={confirmModal.actionType}
          reasonCode={confirmModal.reasonCode}
          onCancel={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
        />
      )}

      {/* Rotation settings drawer */}
      <RotationSettingsDrawer
        isOpen={isRotationSettingsDrawerOpen}
        onClose={() => setIsRotationSettingsDrawerOpen(false)}
        initialAutoRotation={autoRotationEnabled}
        initialPeriodDays={rotationPeriodDays}
        onSave={handleRotationSettingsSave}
      />
    </PageShell>
  );
}
