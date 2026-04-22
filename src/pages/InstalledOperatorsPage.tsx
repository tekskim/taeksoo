/**
 * Installed Operators — FR-026, FR-027
 *
 * 테넌트 관리자 전용 화면 (정책서 §4-5, 기능명세서 결정사항)
 * - 클러스터에 설치된 Operator 목록 조회
 * - 의존 CR Instance 존재 시 삭제 차단 (crInstanceCount > 0)
 * - 일반 사용자에게는 노출하지 않음
 * - v1.0: 목록 조회 + 삭제만 제공. 업그레이드·이벤트 로그는 v1.0 이후.
 */
import { useState } from 'react';
import {
  VStack,
  HStack,
  TabBar,
  TopBar,
  Breadcrumb,
  PageShell,
  PageHeader,
  Table,
  Badge,
  Button,
  Modal,
  InfoBox,
  SearchInput,
  ListToolbar,
  ContextMenu,
  type TableColumn,
  type ContextMenuItem,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import { Link } from 'react-router-dom';
import { ContainerSidebar } from '@/components/ContainerSidebar';
import { AppCatalogSidebar } from '@/components/AppCatalogSidebar';
import { useAppCatalogMode } from '@/contexts/AppCatalogModeContext';
import { useTabs } from '@/contexts/TabContext';
import { IconDotsCircleHorizontal, IconAlertTriangle, IconPackage } from '@tabler/icons-react';
import { getContainerStatusTheme } from './containerStatusUtils';
import type { InstalledOperator } from '@/pages/apps/appsTypes';
import { installedOperatorsMock, crInstancesMock } from '@/pages/apps/appsMockData';

/* ────────────────────────────────────────────────────────────
   Operator Logo Cell
   ──────────────────────────────────────────────────────────── */
function OperatorLogo({ logoUrl, name }: { logoUrl?: string; name: string }) {
  const [error, setError] = useState(false);
  if (logoUrl && !error) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-5 h-5 object-contain"
        onError={() => setError(true)}
      />
    );
  }
  return <IconPackage size={18} stroke={1.5} className="text-[var(--color-text-subtle)]" />;
}

/* ────────────────────────────────────────────────────────────
   InstalledOperatorsPage
   ──────────────────────────────────────────────────────────── */

export default function InstalledOperatorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 240 : 40;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();
  const { isStandalone } = useAppCatalogMode();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<InstalledOperator | null>(null);

  const filteredOperators = installedOperatorsMock.filter(
    (op) =>
      !searchQuery ||
      op.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getContextMenuItems = (row: InstalledOperator): ContextMenuItem[] => [
    {
      id: 'delete',
      label: 'Delete',
      status: 'danger',
      onClick: () => setDeleteTarget(row),
    },
  ];

  const columns: TableColumn<InstalledOperator>[] = [
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      render: (_value, row) => (
        <Badge theme={getContainerStatusTheme(row.status)} type="subtle" size="sm">
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'displayName',
      label: 'Operator name',
      minWidth: columnMinWidths.name,
      render: (value, row) => (
        <HStack gap={2} align="center">
          <OperatorLogo logoUrl={row.logoUrl} name={row.displayName} />
          <Link
            to={`/container/appcatalog/installed-operators/${row.id}`}
            className="text-[var(--color-action-primary)] font-medium hover:underline truncate"
          >
            {value}
          </Link>
        </HStack>
      ),
    },
    {
      key: 'namespace',
      label: 'Scope',
      minWidth: '100px',
      render: () => (
        <Badge theme="default" size="sm">
          Cluster
        </Badge>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      minWidth: '100px',
      render: (value) => (
        <Badge theme="white" size="sm">
          v{value}
        </Badge>
      ),
    },
    {
      key: 'installedAt',
      label: 'Last deployed',
      minWidth: columnMinWidths.createdAt,
    },
    {
      key: 'actions',
      label: 'Action',
      width: fixedColumns.actions,
      align: 'center',
      render: (_value, row) => (
        <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
          <ContextMenu items={getContextMenuItems(row)} trigger="click" align="right">
            <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors group">
              <IconDotsCircleHorizontal
                size={16}
                stroke={1.5}
                className="text-[var(--color-text-muted)]"
              />
            </button>
          </ContextMenu>
        </div>
      ),
    },
  ];

  const crInstances = crInstancesMock[deleteTarget?.id ?? ''] ?? [];
  const hasCrInstances = crInstances.length > 0;

  return (
    <PageShell
      sidebar={
        isStandalone ? (
          <AppCatalogSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        ) : (
          <ContainerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        )
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
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
                { label: 'clusterName', href: '/container' },
                { label: 'App Catalog', href: '/container/appcatalog/catalog' },
                { label: 'Installed Operators' },
              ]}
            />
          }
        />
      }
    >
      <VStack gap={3}>
        <PageHeader title="Installed Operators" />

        <ListToolbar
          primaryActions={
            <ListToolbar.Actions>
              <SearchInput
                placeholder="Search operators by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                size="sm"
                className="w-[var(--search-input-width)]"
              />
            </ListToolbar.Actions>
          }
        />

        <Table
          columns={columns}
          data={filteredOperators}
          rowKey="id"
          emptyMessage="No operators installed"
        />
      </VStack>

      {/* Delete modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Operator"
        size="sm"
        description="This will permanently remove the Operator and all Kubernetes resources it manages. The Operator cannot be deleted while active CR Instances still exist."
      >
        <InfoBox.Group>
          <InfoBox label="Operator" value={deleteTarget?.displayName ?? ''} />

          {hasCrInstances && (
            <InfoBox label="CR Instances">
              <ul className="flex flex-col gap-1 pl-1">
                {crInstances.map((cr) => (
                  <li
                    key={cr.id}
                    className="flex items-center gap-2 text-body-md text-[var(--color-text-default)]"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--color-text-default)] shrink-0" />
                    <span>{cr.name}</span>
                  </li>
                ))}
              </ul>
            </InfoBox>
          )}
        </InfoBox.Group>

        {hasCrInstances && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-[var(--color-feedback-danger-subtle,#fef2f2)] border border-[var(--color-feedback-danger,#ef4444)] rounded-[var(--radius-md)] text-body-sm text-[var(--color-text-default)]">
            <IconAlertTriangle
              size={16}
              stroke={1.5}
              className="text-[var(--color-feedback-danger,#ef4444)] mt-0.5 shrink-0"
            />
            <span>
              <strong>{crInstances.length} CR Instance(s)</strong> are currently running. Delete all
              CR Instances first, then retry.
            </span>
          </div>
        )}

        <div className="flex gap-2 w-full">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={hasCrInstances}
            onClick={() => {
              setDeleteTarget(null);
            }}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </PageShell>
  );
}
